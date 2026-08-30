/* Visual QA: capture scroll positions + console errors.
   node scripts/qa-shots.js [outPrefix] [w] [h] [p1,p2,...] */
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const prefix = process.argv[2] || 'shot';
  const width = Number(process.argv[3] || 1440);
  const height = Number(process.argv[4] || 900);
  const points = (process.argv[5] || '0,0.12,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1')
    .split(',')
    .map(Number);

  const dir = 'qa';
  fs.mkdirSync(dir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

  await page.goto('http://localhost:3000/fr', { waitUntil: 'load' });
  await page.waitForTimeout(4200);

  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  console.log('scrollable height', docHeight, `(${(docHeight / height).toFixed(1)} viewports)`);

  for (const p of points) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(docHeight * p));
    await page.waitForTimeout(900);
    const name = `${dir}/${prefix}-${String(Math.round(p * 1000)).padStart(4, '0')}.png`;
    await page.screenshot({ path: name });
    console.log('captured', name);
  }

  if (errors.length) {
    console.log('\n--- console ---');
    console.log([...new Set(errors)].slice(0, 40).join('\n'));
  } else {
    console.log('\nno console errors');
  }
  await browser.close();
})();
