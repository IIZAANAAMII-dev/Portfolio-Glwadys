import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { assertReading, assertSeam } from './v3-assertions.mjs';

const hash = createHash('sha256');
async function fingerprint(dir) {
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await fingerprint(path);
    else hash.update(path).update(await readFile(path));
  }
}
await fingerprint('src');
hash.update(await readFile('package-lock.json'));
const sourceSha256 = hash.digest('hex');

// A bounded runner owns exactly one production server and one browser.
const [engine = 'chromium', widthArg = '1440', locale = 'fr', mode = 'motion'] = process.argv.slice(2);
const width = Number(widthArg), height = width === 320 ? 568 : width === 1440 ? 900 : 844;
const out = `docs/qa/v3-final/${engine}-${width}-${locale}-${mode}`;
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3187'], { stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
server.stdout.on('data', (x) => { log += x; });
server.stderr.on('data', (x) => { log += x; });
let browser;
const errors = [], failures = [], states = [], assertions = [];
const check = (label, fn) => { try { fn(); } catch (error) { assertions.push(`${label}: ${error.message}`); } };
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${log}`);
    try { if ((await fetch('http://127.0.0.1:3187/fr')).ok) { ready = true; break; } } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  if (!ready) throw new Error(`Server readiness failed: ${log}`);
  browser = await ({ chromium, webkit }[engine]).launch({ headless: true });
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1,
    reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', javaScriptEnabled: mode !== 'nojs' });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
  await page.goto(`http://127.0.0.1:3187/${locale}?visualqa`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(4500);
  const inspect = () => page.evaluate(() => {
    const box = (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
    const expert = document.querySelector('section[aria-labelledby="expertise-title"]');
    const journey = document.querySelector('section[aria-labelledby="journey-title"]');
    return {
      scrollY, overflow: document.documentElement.scrollWidth - innerWidth,
      active: expert?.querySelector('[data-active="true"] [data-expertise-term]')?.textContent,
      counter: expert?.querySelector('[data-expertise-counter]')?.textContent,
      rule: box(expert.querySelector('[data-expertise-rule]')),
      activeRow: box(expert.querySelector('[data-expertise-row][data-active="true"]')),
      band: parseFloat(getComputedStyle(expert.querySelector('[data-expertise-row][data-active="true"]')).getPropertyValue('--band')) || null,
      terms: [...(expert?.querySelectorAll('[data-expertise-term]') ?? [])].map((e) => ({
        text: e.textContent, ...box(e), alpha: getComputedStyle(e).opacity,
      })),
      journey: journey?.querySelector('[data-active="true"]')?.textContent,
      photo: journey?.querySelector('[data-archive-photo] img') ? box(journey.querySelector('[data-archive-photo] img')) : null,
      projects: [...document.querySelectorAll('[data-feature-stage]')].map((stage) => ({
        id: stage.closest('[data-project]').dataset.project,
        texts: [...stage.querySelectorAll('h3, p')].map((e) => ({ text: e.textContent, ...box(e) })),
        decision: box(stage.querySelector('[data-spread] p')),
        decisionAlpha: getComputedStyle(stage.querySelector('[data-spread] p')).opacity,
      })),
    };
  });
  if (mode === 'motion') {
    await page.waitForFunction(() => window.__VISUAL_QA__?.snapshot().films.expertise);
    const initial = await page.evaluate(() => window.__VISUAL_QA__.snapshot());
    await writeFile(`${out}/registry.json`, JSON.stringify(initial, null, 2));
    const targets = [
      ['work-yuna', 'entry'], ['work-yuna', 'read'], ['work-yuna', 'spread'],
      ['work-mgc', 'entry'], ['work-mgc', 'read'], ['work-mgc', 'spread'],
      ['work-comptoir', 'entry'], ['work-comptoir', 'read'], ['work-comptoir', 'spread'],
      ['work-journey', 'cover'], ['work-journey', 'turn'], ['work-journey', 'aperture'],
      ['journey', 'aperture'], ['journey', 'filing'],
      ...['first', 'second', 'third', 'fourth', 'fifth', 'sixth'].map((s) => ['journey', s]), ['journey', 'index'],
      ...['first','second','third','fourth','fifth','sixth','seventh','all','contact'].map((s) => ['expertise', s]),
    ];
    for (const [film, state] of targets) {
      await page.evaluate(([f, s]) => window.__VISUAL_QA__.seek(f, s), [film, state]);
      await page.waitForTimeout(1000);
      const data = await inspect();
      if (state === 'entry' && film !== 'work-yuna') {
        // Project → project: the incoming photograph must sit exactly in the
        // spread's left-page slot (visible = transformed box minus clip inset).
        data.aperture = await page.evaluate((id) => {
          const stage = document.querySelector(`[data-project="${id}"] [data-feature-stage]`);
          const r = stage.querySelector('[data-feature-photo]').getBoundingClientRect();
          const s = stage.querySelector('[data-spread-slot]').getBoundingClientRect();
          const inset = (getComputedStyle(stage.querySelector('[data-feature-photo]')).clipPath.match(/[\d.]+%/g) ?? [])
            .map((v) => parseFloat(v) / 100);
          // Computed inset() may be serialised in its 1–3 value shorthand.
          const [t = 0, rt = t, b = t, l = rt] = inset;
          return {
            visible: { x: r.x + r.width * l, y: r.y + r.height * t, w: r.width * (1 - l - rt), h: r.height * (1 - t - b) },
            slot: { x: s.x, y: s.y, w: s.width, h: s.height },
          };
        }, film.slice(5));
        check(`${film}/aperture`, () => {
          for (const key of ['x', 'y', 'w', 'h']) {
            if (Math.abs(data.aperture.visible[key] - data.aperture.slot[key]) > 1.5) {
              throw new Error(`${key} ${data.aperture.visible[key]} vs slot ${data.aperture.slot[key]}`);
            }
          }
        });
      }
      states.push({ film, state, ...data });
      const keyframe = ['read', 'spread', 'entry', 'cover', 'turn', 'aperture', 'filing', 'fourth', 'sixth', 'contact'].includes(state)
        || (film === 'journey' && state !== 'index') || (film === 'expertise' && state === 'first');
      if (keyframe) {
        await page.screenshot({ path: `${out}/${film}-${state}.png` });
      }
    }
    for (const [film, state] of [['expertise','sixth'], ['journey','fourth'], ['work-mgc','read'], ['work-yuna','entry']]) {
      await page.evaluate(([f, s]) => window.__VISUAL_QA__.seek(f, s), [film, state]);
      await page.waitForTimeout(1100);
      states.push({ film, state, reverse: true, ...await inspect() });
    }
    const seams = [];
    for (const [beforeFilm, afterFilm, beforeSelector, afterSelector] of [
      ['notebook', 'work-yuna', '[data-work-proof] img', '[data-yuna-handoff] img'],
      // The Comptoir print: the bridge's last frame and Journey's first are one box.
      ['work-journey', 'journey', '[data-work-journey-bridge] [data-archive-cover] img', 'section[aria-labelledby="journey-title"] [data-archive-cover] img'],
      ['journey', 'expertise', '[data-archive-handoff] [data-expertise-term]', 'section[aria-labelledby="expertise-title"] [data-expertise-term]'],
    ]) {
      const frames = [];
      for (const [film, time, selector] of [[beforeFilm, initial.films[beforeFilm].duration - 0.0002, beforeSelector], [afterFilm, 0.0002, afterSelector]]) {
        await page.evaluate(([f, t]) => window.__VISUAL_QA__.seek(f, t), [film, time]);
        await page.waitForTimeout(1100);
        frames.push(await page.locator(selector).first().evaluate((e) => {
          const r = e.getBoundingClientRect(), css = getComputedStyle(e);
          return { x: r.x, y: r.y, w: r.width, h: r.height, source: e.getAttribute('src'), fit: css.objectFit, position: css.objectPosition, opacity: css.opacity };
        }));
      }
      seams.push({ beforeFilm, afterFilm, frames });
    }
    await writeFile(`${out}/seams.json`, JSON.stringify(seams, null, 2));
    for (const seam of seams) check('seam', () => assertSeam(seam));
    await page.evaluate(() => window.__VISUAL_QA__.seek('expertise', 'sixth'));
    await page.waitForTimeout(1000);
    const countBefore = await page.evaluate(() => window.__VISUAL_QA__.snapshot().triggerCount);
    await page.setViewportSize({ width: width === 1440 ? 1200 : width + 20, height });
    await page.waitForTimeout(500);
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.__VISUAL_QA__.seek('expertise', 'sixth'));
    await page.waitForTimeout(1000);
    const countAfter = await page.evaluate(() => window.__VISUAL_QA__.snapshot().triggerCount);
    states.push({ film: 'expertise', state: 'sixth', resized: true, countBefore, countAfter, ...await inspect() });
    await page.mouse.wheel(0, -height);
    await page.waitForTimeout(900);
    await page.mouse.wheel(0, height);
    await page.waitForTimeout(900);
    await page.evaluate(() => window.__VISUAL_QA__.seek('expertise', 'sixth'));
    await page.waitForTimeout(1100);
    states.push({ film: 'expertise', state: 'sixth', wheeled: true, ...await inspect() });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(400);
    if (await page.locator('[data-enhanced="true"]').count()) assertions.push('Reduced-motion toggle left enhanced scenes');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.__VISUAL_QA__.seek('expertise', 'sixth'));
    await page.waitForTimeout(1100);
    states.push({ film: 'expertise', state: 'sixth', preferenceToggled: true, ...await inspect() });
  } else {
    for (const selector of ['[data-project="yuna"]','[data-project="mgc"]','[data-project="comptoir"]','section[aria-labelledby="journey-title"]','section[aria-labelledby="expertise-title"]']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      states.push({ selector, ...await inspect() });
      await page.screenshot({ path: `${out}/static-${states.length}.png` });
      if (selector.startsWith('section')) await page.locator(selector).screenshot({ path: `${out}/static-full-${states.length}.png` });
    }
    const staticPath = await page.evaluate(() => ({
      enhanced: document.querySelectorAll('[data-enhanced="true"]').length,
      captions: [...document.querySelectorAll('[data-archive-print] figcaption')].map((e) => ({
        text: e.textContent, visible: getComputedStyle(e).display !== 'none',
      })),
      terms: [...document.querySelectorAll('section[aria-labelledby="expertise-title"] [data-expertise-term]')].map((e) => ({
        alpha: getComputedStyle(e).opacity, right: e.getBoundingClientRect().right,
      })),
      navVisible: getComputedStyle(document.querySelector('[data-nav-root]')).visibility,
    }));
    if (staticPath.enhanced || staticPath.captions.length !== 6 || staticPath.captions.some((c) => !c.visible || !c.text.trim())
      || staticPath.terms.length !== 7 || staticPath.terms.some((t) => t.alpha !== '1' || t.right > width + 1)
      || staticPath.navVisible !== 'visible') assertions.push(`Static path incomplete: ${JSON.stringify(staticPath)}`);
  }
  for (const state of states) check(`${state.film ?? state.selector}/${state.state ?? mode}`, () => assertReading(state, width, height));
  for (const reverse of states.filter((s) => s.reverse)) {
    const forward = states.find((s) => !s.reverse && s.film === reverse.film && s.state === reverse.state);
    if (forward?.active !== reverse.active || forward?.journey !== reverse.journey) assertions.push(`Reverse mismatch: ${reverse.film}`);
  }
  await writeFile(`${out}/results.json`, JSON.stringify({ sourceSha256, engine, width, height, locale, mode, errors, failures, assertions, states }, null, 2));
  console.log(JSON.stringify({ out, sourceSha256, errors, failures, assertions, states: states.length, overflows: states.filter((s) => s.overflow > 1).length }));
  if (errors.length || failures.length || assertions.length) process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  if (server.exitCode === null) await once(server, 'exit');
}
