import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, webkit } from 'playwright';

const base = process.env.QA_URL ?? 'http://127.0.0.1:4440';
const out = 'docs/qa/sol61-builder/pass-a';
await fs.mkdir(out, { recursive: true });
const results = [];
for (const [engine, name, widths] of [[chromium, 'chromium', [1440]], [webkit, 'webkit', [390, 320]]]) {
  const browser = await engine.launch({ headless: true, ...(name === 'chromium' ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {}) });
  for (const width of widths) for (const locale of ['fr', 'en', 'ko']) for (const reduced of [false, true]) {
    const height = width === 1440 ? 900 : width === 390 ? 844 : 800;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2600);
    if (reduced) {
      await page.locator('[class*="reducedPhonePanel"]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/${name}-${width}-${locale}-reduced.png` });
      for (const y of [0, height * 3, height * 6, 0]) {
        await page.evaluate(value => scrollTo(0, value), y);
        await page.waitForTimeout(150);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
      }
    } else {
      const start = await page.locator('#act-scroll-story').evaluate(el => el.getBoundingClientRect().top + scrollY);
      for (const t of [4.78, 5.18, 5.66, 6.08, 5.18]) {
        await page.evaluate(y => scrollTo(0, y), start + t * height * (width >= 1024 ? 1 : 0.74));
        await page.waitForTimeout(900);
        const state = await page.evaluate(() => {
          const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom, right: r.right }; };
          const rail = document.querySelector('[class*="sequenceRail"]');
          const lang = document.querySelector('[class*="languageToggle"]');
          const nav = document.querySelector('[data-nav-root]');
          const overlap = (a, b) => Math.min(a.right, b.right) > Math.max(a.x, b.x) && Math.min(a.bottom, b.bottom) > Math.max(a.y, b.y);
          const rr = rect(rail), lr = rect(lang), nr = rect(nav);
          return { rail: rr, language: lr, nav: nr, collision: overlap(rr, lr) || overlap(rr, nr), overflow: document.documentElement.scrollWidth - innerWidth };
        });
        assert.equal(state.overflow, 0, `${name}/${width}/${locale}/${t} overflow`);
        assert.equal(state.collision, false, `${name}/${width}/${locale}/${t} utility collision`);
        results.push({ name, width, height, locale, reduced, t, ...state });
        if (t === 5.18) await page.screenshot({ path: `${out}/${name}-${width}-${locale}-focus.png` });
      }
      if (width < 1024) {
        await page.locator('[class*="languageToggle"]').click();
        assert.equal(await page.locator('#site-languages a:visible').count(), 3);
        await page.screenshot({ path: `${out}/${name}-${width}-${locale}-menu-open.png` });
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#site-languages a:visible').count(), 0);
      }
    }
    assert.deepEqual(errors, [], `${name}/${width}/${locale} errors`);
    await context.close();
  }
  await browser.close();
}
await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
console.log(`PASS ${results.length} forward/reverse phone samples; 18 viewport/locale/motion contexts; no utility collision/overflow/console errors.`);
