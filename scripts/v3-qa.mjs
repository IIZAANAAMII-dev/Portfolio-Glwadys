import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { once } from 'node:events';

// A bounded runner owns exactly one production server and one browser.
const [engine = 'chromium', widthArg = '1440', locale = 'fr', mode = 'motion'] = process.argv.slice(2);
const width = Number(widthArg), height = width === 320 ? 568 : width === 1440 ? 900 : 844;
const out = `docs/qa/astra-v3/${engine}-${width}-${locale}-${mode}`;
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3187'], { stdio: ['ignore', 'pipe', 'pipe'] });
let log = '';
server.stdout.on('data', (x) => { log += x; });
server.stderr.on('data', (x) => { log += x; });
let browser;
const errors = [], failures = [], states = [];
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
      terms: [...(expert?.querySelectorAll('[data-expertise-term]') ?? [])].map((e) => ({
        text: e.textContent, ...box(e), alpha: getComputedStyle(e).opacity,
      })),
      journey: journey?.querySelector('[data-active="true"]')?.textContent,
      photo: journey?.querySelector('[data-archive-photo] img') ? box(journey.querySelector('[data-archive-photo] img')) : null,
      projects: [...document.querySelectorAll('[data-feature-stage]')].map((stage) => ({
        id: stage.closest('[data-project]').dataset.project,
        texts: [...stage.querySelectorAll('h3, p')].map((e) => ({ text: e.textContent, ...box(e) })),
      })),
    };
  });
  if (mode === 'motion') {
    await page.waitForFunction(() => window.__VISUAL_QA__?.snapshot().films.expertise);
    const initial = await page.evaluate(() => window.__VISUAL_QA__.snapshot());
    await writeFile(`${out}/registry.json`, JSON.stringify(initial, null, 2));
    const targets = [
      ['work-yuna', 'entry'], ['work-yuna', 'read'], ['work-mgc', 'read'], ['work-comptoir', 'read'],
      ['work-journey', 'cover'], ['work-journey', 'turn'], ['work-journey', 'aperture'],
      ['journey', 'aperture'], ['journey', 'first'], ['journey', 'fourth'], ['journey', 'sixth'], ['journey', 'index'],
      ...['first','second','third','fourth','fifth','sixth','seventh','all','contact'].map((s) => ['expertise', s]),
    ];
    for (const [film, state] of targets) {
      await page.evaluate(([f, s]) => window.__VISUAL_QA__.seek(f, s), [film, state]);
      await page.waitForTimeout(1000);
      const data = await inspect();
      states.push({ film, state, ...data });
      if (['read', 'entry', 'aperture', 'fourth', 'sixth', 'contact'].includes(state)) {
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
      ['work-journey', 'journey', '[data-bridge-photo] img', 'section[aria-labelledby="journey-title"] [data-archive-photo] img'],
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
  } else {
    for (const selector of ['[data-project="yuna"]','[data-project="mgc"]','[data-project="comptoir"]','section[aria-labelledby="journey-title"]','section[aria-labelledby="expertise-title"]']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      states.push({ selector, ...await inspect() });
      await page.screenshot({ path: `${out}/static-${states.length}.png` });
    }
  }
  await writeFile(`${out}/results.json`, JSON.stringify({ engine, width, height, locale, mode, errors, failures, states }, null, 2));
  console.log(JSON.stringify({ out, errors, failures, states: states.length, overflows: states.filter((s) => s.overflow > 1).length }));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  if (server.exitCode === null) await once(server, 'exit');
}
