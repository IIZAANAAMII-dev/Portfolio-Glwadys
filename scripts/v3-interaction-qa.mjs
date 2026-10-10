import { chromium, webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3187'], { stdio: 'ignore' });
let browser;
const results = [];
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error('Preview exited');
    try { if ((await fetch('http://127.0.0.1:3187/fr')).ok) { ready = true; break; } } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  assert.ok(ready);
  for (const [engine, width, height] of [['chromium', 1440, 900], ['webkit', 390, 844]]) {
    browser = await ({ chromium, webkit }[engine]).launch();
    for (const locale of ['fr', 'en', 'ko']) {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: engine === 'webkit' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`http://127.0.0.1:3187/${locale}?visualqa`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(4500);
      await page.waitForFunction(() => window.__VISUAL_QA__?.snapshot().films.expertise);
      await page.evaluate(() => window.__VISUAL_QA__.seek('expertise', 'sixth'));
      await page.waitForTimeout(1100);
      if (width < 1024) {
        const toggle = page.locator('[aria-controls="site-languages"]');
        await toggle.tap();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        for (const l of ['fr', 'en', 'ko']) assert.ok(await page.locator(`#site-languages a[href="/${l}"]`).isVisible());
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.ok(await toggle.evaluate((e) => document.activeElement === e));
      }
      const journey = page.locator('[data-nav-root] a[href="#act-journey-scene"]');
      await journey.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2400);
      assert.equal(await journey.getAttribute('aria-current'), 'true');
      const expert = page.locator('[data-nav-root] a[href="#act-expertise"]');
      await expert.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2400);
      assert.equal(await expert.getAttribute('aria-current'), 'true');
      // Native End and mailto link remain available; never activate external contact.
      await page.keyboard.press('End');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(2000);
      assert.ok(await page.locator('#act-contact a[href^="mailto:"]').first().isVisible());
      assert.deepEqual(errors, []);
      results.push({ engine, width, locale, keyboardAnchors: true, contact: true, touchLocaleEscape: width < 1024, errors });
      await context.close();
    }
    await browser.close();
    browser = undefined;
  }
  await writeFile('docs/qa/v3-final/interactions.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results));
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  if (server.exitCode === null) await once(server, 'exit');
}
