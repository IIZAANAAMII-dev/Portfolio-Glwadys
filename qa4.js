const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  const height = await page.evaluate(() => document.body.scrollHeight);
  const points = [0.80, 0.88, 0.92, 0.96, 1.0];

  for (const p of points) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor(height * p));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa4-${Math.round(p * 100)}.png` });
    console.log(`captured ${Math.round(p * 100)}%`);
  }

  await browser.close();
})();
