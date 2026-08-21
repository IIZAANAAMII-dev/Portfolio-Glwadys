const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const height = await page.evaluate(() => document.body.scrollHeight);
  const points = [0, 0.25, 0.5, 0.75, 1.0];

  for (const p of points) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor(height * p));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `qa-${Math.round(p * 100)}.png` });
  }

  await browser.close();
})();
