const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  const canvas = await page.$('#act-scroll-story');
  const stage = await page.$('[data-device]');
  const hero = await page.$('.sharedHero');

  const canvasBox = await canvas?.boundingBox();
  const total = canvasBox?.height ?? page.viewportSize().height * 6;

  const points = [0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1.0];

  for (const p of points) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.floor(total * p));
    await page.waitForTimeout(800);

    const data = await page.evaluate(() => {
      const device = document.querySelector('[data-device]');
      const hero = document.querySelector('.sharedHero');
      const bgSocial = document.querySelector('[data-bg-social]');
      const bgPhone = document.querySelector('[data-bg-phone]');
      const d = device?.getBoundingClientRect();
      const h = document.querySelector('[data-media="hero-vertical"]')?.getBoundingClientRect();
      return {
        device: d ? { top: d.top, left: d.left, width: d.width, height: d.height } : null,
        hero: h ? { top: h.top, left: h.left, width: h.width, height: h.height } : null,
        bgSocialOpacity: bgSocial ? getComputedStyle(bgSocial).opacity : '0',
        bgPhoneOpacity: bgPhone ? getComputedStyle(bgPhone).opacity : '0',
        scrollY: window.scrollY,
      };
    });

    console.log(`\n--- ${Math.round(p * 100)}% ---`);
    console.log(JSON.stringify(data, null, 2));
    await page.screenshot({ path: `qa2-${Math.round(p * 100)}.png` });
  }

  await browser.close();
})();
