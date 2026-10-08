import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = await import('playwright');
const output = 'qa/mentor-20261008';
const baseUrl = process.env.MENTOR_SHOTS_URL ?? 'http://127.0.0.1:4356/fr';
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const report = { baseUrl, generatedAt: new Date().toISOString(), viewports: {} };

for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const errors = [];
  const warnings = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
    if (message.type() === 'warning') warnings.push(message.text());
  });

  const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await pause(1100);

  const viewport = {
    http: response?.status(),
    width,
    height,
    captures: {},
    errors,
    warnings,
  };

  async function capture(label, delay = 500) {
    if (delay) await pause(delay);
    const path = `${output}/${name}-${label}.png`;
    await page.screenshot({ path, animations: 'allow' });
    viewport.captures[label] = {
      path,
      ...(await page.evaluate(() => {
        const nav = [...document.querySelectorAll('nav')].find((item) => item.querySelectorAll('a').length === 5);
        const navRect = nav?.getBoundingClientRect();
        const intersecting = navRect
          ? [...document.querySelectorAll('main h1, main h2, main h3, main p, main a, main dd')]
              .filter((element) => {
                if (nav.contains(element) || element.closest('nav')) return false;
                const rect = element.getBoundingClientRect();
                return (
                  rect.width > 0 &&
                  rect.height > 0 &&
                  rect.top < innerHeight &&
                  rect.bottom > 0 &&
                  rect.left < navRect.right &&
                  rect.right > navRect.left &&
                  rect.top < navRect.bottom &&
                  rect.bottom > navRect.top
                );
              })
              .map((element) => element.textContent.trim().slice(0, 70))
          : [];
        return {
          scrollY: Math.round(scrollY),
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          navTargets: nav?.querySelectorAll('a').length ?? 0,
          navTargetSizes: nav
            ? [...nav.querySelectorAll('a')].map((link) => {
                const rect = link.getBoundingClientRect();
                return { width: Math.round(rect.width), height: Math.round(rect.height) };
              })
            : [],
          textIntersectingNav: intersecting,
          canvasCount: document.querySelectorAll('canvas').length,
          yunaTargetTop: (() => {
            const target = document.querySelector('[data-yuna-handoff-target]');
            return target ? Math.round(target.getBoundingClientRect().top) : null;
          })(),
          yunaHeadingTop: (() => {
            const heading = document.querySelector('#case-yuna');
            return heading ? Math.round(heading.getBoundingClientRect().top) : null;
          })(),
          sourceViewTransitionName: document.querySelector('[data-yuna-handoff-source]')?.style.viewTransitionName ?? '',
          targetViewTransitionName: document.querySelector('[data-yuna-handoff-target]')?.style.viewTransitionName ?? '',
        };
      })),
    };
  }

  async function scrollToId(id) {
    await page.locator(`#${id}`).evaluate((element) => {
      window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top, behavior: 'instant' });
    });
    await pause(250);
  }

  async function alignEditVisual() {
    await page.locator('#act-process [data-yuna-handoff-source]').evaluate((element) => {
      const preferredTop = innerWidth < 768 ? 120 : 104;
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - preferredTop,
        behavior: 'instant',
      });
    });
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await capture('hero', 100);

  await scrollToId('act-process');
  await alignEditVisual();
  await capture('edit-0');
  await page.locator('#act-process button').last().click();
  await alignEditVisual();
  await capture('edit-1', 900);
  await page.locator('#act-process button').last().click();
  await alignEditVisual();
  await capture('edit-2', 900);

  const handoff = page.locator('#act-process a[href="#act-work-yuna"]');
  await handoff.click();
  await capture('yuna-handoff', 360);
  await pause(620);
  await capture('work-yuna', 250);

  await scrollToId('act-work');
  await capture('work');
  await scrollToId('act-journey-scene');
  await capture('journey');
  await scrollToId('act-expertise');
  await capture('expertise');
  await scrollToId('act-contact');
  await capture('contact');

  viewport.final = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: innerWidth,
    yunaHandoffSupported: typeof document.startViewTransition === 'function',
    yunaImageCount: document.querySelectorAll('[data-yuna-handoff-source] img').length,
    yunaTargetCount: document.querySelectorAll('[data-yuna-handoff-target]').length,
    sourceViewTransitionName: document.querySelector('[data-yuna-handoff-source]').style.viewTransitionName,
    targetViewTransitionName: document.querySelector('[data-yuna-handoff-target]').style.viewTransitionName,
    emailHref: document.querySelector('#act-contact a[href^="mailto:"]')?.getAttribute('href'),
    nameTargets: [...document.querySelectorAll('nav')]
      .find((item) => item.querySelectorAll('a').length === 5)
      ?.querySelectorAll('a').length ?? 0,
  }));

  report.viewports[name] = viewport;
  await context.close();
}

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const reducedPage = await reducedContext.newPage();
const reducedErrors = [];
reducedPage.on('pageerror', (error) => reducedErrors.push(error.message));
await reducedPage.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
await reducedPage.evaluate(() => document.fonts.ready);
await reducedPage.locator('#act-process').evaluate((element) => {
  window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top, behavior: 'instant' });
});
await reducedPage.locator('#act-process button').last().click();
await reducedPage.locator('#act-process button').last().click();
await reducedPage.locator('#act-process a[href="#act-work-yuna"]').click();
await pause(200);
await reducedPage.screenshot({ path: `${output}/mobile-reduced-motion.png` });
report.reducedMotion = await reducedPage.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  viewportWidth: innerWidth,
  yunaTop: Math.round(document.querySelector('[data-yuna-handoff-target]').getBoundingClientRect().top),
  sourceViewTransitionName: document.querySelector('[data-yuna-handoff-source]').style.viewTransitionName,
  targetViewTransitionName: document.querySelector('[data-yuna-handoff-target]').style.viewTransitionName,
  handoffClassActive: document.documentElement.classList.contains('yuna-handoff-active'),
  canvasCount: document.querySelectorAll('canvas').length,
}));
report.reducedMotion.errors = reducedErrors;
await reducedContext.close();

await browser.close();
report.completedAt = new Date().toISOString();
await writeFile(`${output}/results.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, viewports: report.viewports }, null, 2));
