import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium, webkit } from 'playwright';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4440';
const out = process.env.QA_OUT ?? 'docs/qa/sol61-builder/pass-b';
await fs.mkdir(out, { recursive: true });
const results = [], failures = [];
const states = [
  ['opening', 'social'], ['opening', 'behind'], ['opening', 'campaign'],
  ['opening', 'portal'], ['opening', 'immersion'], ['opening', 'paper'],
  ['notebook', 'sheet'], ['notebook', 'intention'], ['notebook', 'system'],
  ['notebook', 'method'], ['notebook', 'selection'],
];
for (const [engine, name, width, height] of [[chromium, 'chromium', 1440, 900], [webkit, 'webkit', 390, 844], [webkit, 'webkit', 320, 800]]) {
  const browser = await engine.launch({ headless: true, ...(name === 'chromium' ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {}) });
  for (const locale of ['fr', 'en', 'ko']) {
    const tag = `${name}-${width}-${locale}`;
    if ((process.env.QA_CASE && process.env.QA_CASE !== tag) || (process.env.QA_WIDTH && Number(process.env.QA_WIDTH) !== width)) continue;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference', ...(locale === 'fr' ? { recordVideo: { dir: `${out}/videos`, size: { width, height } } } : {}) });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      await page.goto(`${base}/${locale}?visualqa`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2700);
      assert.equal(await page.evaluate(() => !!window.__VISUAL_QA__), true, 'real-scroll QA hook');
      const geometry = await page.evaluate(() => window.__VISUAL_QA__.snapshot());
      const seamDelta = geometry.films.notebook.start - geometry.films.opening.end;
      assert.ok(Math.abs(seamDelta) < 2, `pin seam gap ${seamDelta}px`);
      for (const [film, state] of [...states, ...states.slice().reverse()]) {
        await page.evaluate(([f, s]) => window.__VISUAL_QA__.seek(f, s), [film, state]);
        await page.waitForTimeout(750);
        const sample = await page.evaluate(async () => {
          const opacity = el => { let alpha = 1; for (let p = el; p; p = p.parentElement) { const s = getComputedStyle(p); if (s.display === 'none' || s.visibility === 'hidden') return 0; alpha *= Number(s.opacity); } return alpha; };
          // Bounding boxes alone count offscreen feed images that are actually
          // clipped by the phone screen. Use the browser's real clip geometry.
          const intersecting = await new Promise(resolve => {
            const observer = new IntersectionObserver(entries => { observer.disconnect(); resolve(entries.filter(e => e.isIntersecting && e.intersectionRect.width > 10 && e.intersectionRect.height > 10).map(e => e.target)); });
            [...document.images].forEach(image => observer.observe(image));
          });
          const images = intersecting.filter(image => opacity(image) > 0.95 && image.getBoundingClientRect().width > 100);
          return { ...window.__VISUAL_QA__.snapshot(), overflow: document.documentElement.scrollWidth - innerWidth, visibleImages: images.map(i => ({ id: i.parentElement.dataset.media, loaded: i.complete && i.naturalWidth > 0 })) };
        });
        results.push({ tag, film, state, ...sample });
        assert.equal(sample.overflow, 0, `${film}/${state} overflow`);
        assert.ok(sample.visibleImages.every(i => i.loaded), `${film}/${state} unloaded visible image: ${JSON.stringify(sample.visibleImages.filter(i => !i.loaded))}`);
        if (locale === 'fr') await page.screenshot({ path: `${out}/${tag}-${film}-${state}.png` });
      }
      // Same actual photo, same crop, same rectangle on either side of the
      // physical pin boundary. Compare only the photograph, not chrome.
      const twins = [];
      for (const [marker, y] of [['story', geometry.films.opening.end - 1], ['process', geometry.films.notebook.start + 1], ['story', geometry.films.opening.end - 1]]) {
        await page.evaluate(value => scrollTo(0, value), y);
        await page.waitForTimeout(800);
        const image = page.locator(`[data-notebook-frame="${marker}"] [data-notebook-frame-image]`);
        const rect = await image.boundingBox();
        const crop = await image.locator('img').evaluate(el => ({ src: el.getAttribute('src'), fit: getComputedStyle(el).objectFit, focus: getComputedStyle(el).objectPosition }));
        const visibility = await image.evaluate(el => { const chain = []; for (let p = el; p && chain.length < 6; p = p.parentElement) chain.push({ cls: p.className, alpha: getComputedStyle(p).opacity, visibility: getComputedStyle(p).visibility }); return chain; });
        const png = await page.screenshot({ path: `${out}/${tag}-seam-${twins.length}-${marker}.png`, clip: rect });
        twins.push({ marker, rect, crop, visibility, sha256: createHash('sha256').update(png).digest('hex') });
      }
      for (const dimension of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(twins[0].rect[dimension] - twins[1].rect[dimension]) < 1, `seam ${dimension}`);
      assert.deepEqual(twins[0].crop, twins[1].crop, 'seam source/crop');
      assert.equal(twins[0].sha256, twins[1].sha256, 'seam photographed pixels');
      assert.equal(twins[0].sha256, twins[2].sha256, 'reverse photographed pixels');
      assert.deepEqual(errors, [], 'console/page errors');
      results.push({ tag, seamDelta, twins });
      console.log(`PASS ${tag}: real pin handoff, identical photo pixels forward/reverse, ${states.length * 2} states.`);
    } catch (error) {
      failures.push({ tag, error: error.message, errors });
      await page.screenshot({ path: `${out}/${tag}-FAIL.png` });
      console.log(`FAIL ${tag}: ${error.message}`);
    } finally {
      await fs.writeFile(`${out}/${tag}-results.json`, JSON.stringify({ results: results.filter(r => r.tag === tag), failures: failures.filter(r => r.tag === tag) }, null, 2));
      const video = page.video();
      await context.close();
      if (video) await video.saveAs(`${out}/${tag}-forward-reverse.webm`);
    }
  }
  await browser.close();
}
await fs.writeFile(`${out}/results.json`, JSON.stringify({ results, failures }, null, 2));
assert.deepEqual(failures, [], `${failures.length} failing contexts`);
console.log(`PASS all ${results.filter(r => r.twins).length} contexts and ${results.filter(r => r.state).length} semantic samples.`);
