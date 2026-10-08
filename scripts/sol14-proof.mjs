import { chromium } from 'playwright';
import { mkdir, writeFile, rename } from 'node:fs/promises';

const output = 'qa/sol14-20261008';
const base = process.env.SOL14_URL ?? 'http://127.0.0.1:4416';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const report = { generatedAt: new Date().toISOString(), base, browser: browser.version(), checks: [], viewports: {}, locales: {}, variants: {} };
const check = (name, ok, observed) => { report.checks.push({ name, ok: Boolean(ok), observed }); };
const pause = (page, time = 850) => page.waitForTimeout(time);

async function instrument(context, options = {}) {
  await context.addInitScript(({ noWebGL, noTransition }) => {
    window.__sol14 = { shifts: [], longTasks: [], lcp: [], webglCalls: 0 };
    for (const type of ['layout-shift', 'longtask', 'largest-contentful-paint']) {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (type === 'layout-shift' && !entry.hadRecentInput) window.__sol14.shifts.push(entry.value);
          if (type === 'longtask') window.__sol14.longTasks.push(entry.duration);
          if (type === 'largest-contentful-paint') window.__sol14.lcp.push(entry.startTime);
        }
      }).observe({ type, buffered: true });
    }
    if (noWebGL) {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type.includes('webgl')) { window.__sol14.webglCalls++; return null; }
        return getContext.call(this, type, ...args);
      };
    }
    if (noTransition) document.startViewTransition = undefined;
  }, options);
}

function listen(page) {
  const log = { errors: [], warnings: [], failedRequests: [], httpErrors: [] };
  page.on('pageerror', (e) => log.errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') log.errors.push(m.text()); if (m.type() === 'warning') log.warnings.push(m.text()); });
  page.on('requestfailed', (r) => log.failedRequests.push({ url: r.url(), reason: r.failure()?.errorText }));
  page.on('response', (r) => { if (r.status() >= 400) log.httpErrors.push({ url: r.url(), status: r.status() }); });
  return log;
}

async function load(page, locale = 'fr') {
  const response = await page.goto(base + '/' + locale, { waitUntil: 'networkidle', timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  await pause(page, 750);
  return response?.status();
}

async function align(page, id, offset = 0) {
  await page.locator('#' + id).evaluate((e, top) => window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().top - top, behavior: 'instant' }), offset);
  await pause(page, 180);
}

async function layout(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('a[href="#act-contact"]').closest('nav');
    const nr = nav.getBoundingClientRect();
    const visible = (e) => {
      const r = e.getBoundingClientRect();
      return r.width && r.height && r.bottom > 0 && r.top < innerHeight && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none';
    };
    const texts = [...document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main a, main dd, main figcaption, main ul li')].filter((e) => !e.closest('nav') && visible(e));
    const collisions = texts.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.top < nr.bottom && r.bottom > nr.top && r.left < nr.right && r.right > nr.left;
    }).map((e) => ({ text: e.textContent.trim(), rect: e.getBoundingClientRect().toJSON() }));
    const source = document.querySelector('[data-yuna-handoff-source]');
    const target = document.querySelector('[data-yuna-handoff-target]');
    const editControls = document.querySelector('#act-process [role="group"]');
    const footer = document.querySelector('#act-contact footer');
    const heroFooter = document.querySelector('#act-opening [class*="heroFooter"]');
    const lastJourney = document.querySelector('#act-journey-scene li:last-child');
    const lastExpertise = document.querySelector('#act-expertise li:last-child');
    const lastMethod = document.querySelector('#act-process ol li:last-child p');
    const lastYunaSkill = document.querySelector('#act-work-yuna ul li:last-child');
    const mgcChallenge = document.querySelector('#act-work-mgc [class*="direction"] > div:first-child p');
    const comptoirSummary = document.querySelector('#act-work-comptoir [class*="summary"]');
    const clearance = (e) => e ? nr.top - e.getBoundingClientRect().bottom : null;
    const heroImage = document.querySelector('[data-hero-crop]');
    const photoCollision = [...document.images].filter((img) => visible(img) && !img.closest('[aria-hidden="true"]')).filter((img) => {
      const r = img.getBoundingClientRect();
      return r.top < nr.bottom && r.bottom > nr.top && r.left < nr.right && r.right > nr.left;
    }).map((img) => img.getAttribute('alt'));
    return {
      viewport: { width: innerWidth, height: innerHeight }, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth,
      scrollY, scrollHeight: document.documentElement.scrollHeight, canvas: document.querySelectorAll('canvas').length,
      activeNav: nav.querySelector('[aria-current="location"]')?.getAttribute('href'), nav: nr.toJSON(),
      navTargets: [...nav.querySelectorAll('a')].map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href'), rect: a.getBoundingClientRect().toJSON() })),
      touchTargets: [...document.querySelectorAll('a, button, [tabindex="0"]')].filter(visible).map((e) => ({ text: e.textContent.trim(), rect: e.getBoundingClientRect().toJSON() })),
      collisions, photoCollision,
      clearances: { edit: clearance(editControls), hero: clearance(heroFooter), journey: clearance(lastJourney), expertise: clearance(lastExpertise), contact: clearance(footer), method: clearance(lastMethod), yunaPractice: clearance(lastYunaSkill), mgcChallenge: clearance(mgcChallenge), comptoirSummary: clearance(comptoirSummary) },
      editStep: document.querySelector('#act-process [data-step]')?.dataset.step,
      source: { rect: source.getBoundingClientRect().toJSON(), transform: getComputedStyle(source).transform, name: getComputedStyle(source).viewTransitionName, persistent: !window.__solPrint || source === window.__solPrint, src: source.querySelector('img').getAttribute('src'), asset: new URL(source.querySelector('img').src).searchParams.get('url'), alt: source.querySelector('img').alt },
      target: { rect: target.getBoundingClientRect().toJSON(), name: getComputedStyle(target).viewTransitionName, src: target.querySelector('img').getAttribute('src'), asset: new URL(target.querySelector('img').src).searchParams.get('url'), alt: target.querySelector('img').alt },
      transitionClass: document.documentElement.classList.contains('yuna-handoff-active'), hash: location.hash, focusedId: document.activeElement?.id,
      heroTransform: heroImage ? getComputedStyle(heroImage).transform : null,
      activeYears: [...document.querySelectorAll('[data-journey-year][data-active="true"]')].map((e) => e.dataset.journeyYear),
      metrics: window.__sol14,
    };
  });
}

async function capture(page, prefix, name, data) {
  await pause(page, 300);
  const path = output + '/' + prefix + '-' + name + '.png';
  await page.screenshot({ path, animations: 'allow' });
  data.captures[name] = { path, ...(await layout(page)) };
  if (data.captures[name].viewport.width < 768) {
    check(prefix + ': ' + name + ' touch targets >=44px', data.captures[name].touchTargets.every((e) => e.rect.width >= 44 && e.rect.height >= 44), data.captures[name].touchTargets);
  }
}

async function integrity(page, name, log) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
  const data = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth, viewport: innerWidth, canvas: document.querySelectorAll('canvas').length,
    brokenImages: [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
  }));
  check(name + ': document width', data.width === data.viewport, data);
  check(name + ': no canvas or broken image', data.canvas === 0 && data.brokenImages.length === 0, data);
  check(name + ': clean console and network', Object.values(log).every((a) => a.length === 0), log);
  return data;
}

for (const [prefix, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844], ['small', 320, 800]]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, hasTouch: width < 768, reducedMotion: 'no-preference', recordVideo: prefix === 'small' ? undefined : { dir: output + '/video', size: { width, height } } });
  await instrument(context);
  if (prefix === 'mobile') await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  const video = page.video();
  const log = listen(page);
  const data = { http: await load(page), width, height, captures: {}, log, behavior: {} };
  report.viewports[prefix] = data;
  check(prefix + ': HTTP 200', data.http === 200, data.http);
  await page.evaluate(() => { window.__solPrint = document.querySelector('[data-yuna-handoff-source]'); });
  await capture(page, prefix, 'hero', data);
  await align(page, 'act-process');
  if (prefix !== 'small') await capture(page, prefix, 'edit0', data);
  data.behavior.flipTravel = [];
  for (const step of [1, 2]) {
    if (width < 768) await page.locator('[data-edit-next]').tap();
    else await page.locator('[data-edit-next]').click();
    await pause(page, 160);
    data.behavior.flipTravel.push({ to: step, at: '160ms', ...(await layout(page)).source });
    if (prefix !== 'small') await page.screenshot({ path: output + '/' + prefix + '-flip-to-' + step + '-160ms.png' });
    await pause(page, 700);
    if (prefix !== 'small' || step === 2) await capture(page, prefix, 'edit' + step, data);
  }
  const selected = await layout(page);
  check(prefix + ': one persistent selected image', selected.source.persistent && selected.source.asset === selected.target.asset && selected.source.alt === selected.target.alt && selected.source.transform === 'none', selected.source);
  check(prefix + ': Edit fits above nav', selected.clearances.edit >= 24, selected.clearances.edit);

  if (prefix === 'desktop') {
    await page.locator('[data-yuna-handoff-source] img').hover();
    await pause(page, 900);
    const transform = await page.locator('[data-yuna-handoff-source] img').evaluate((e) => getComputedStyle(e).transform);
    check('desktop: selected photograph stays still on hover', transform === 'none', transform);
    await page.mouse.move(0, 0);
  }

  if (prefix !== 'small') {
    if (width < 768) await page.locator('[data-edit-next]').tap();
    else await page.locator('[data-edit-next]').click();
    await pause(page, 220);
    await page.screenshot({ path: output + '/' + prefix + '-handoff-220ms.png' });
    await pause(page, 1380);
    data.behavior.pointerHandoff = await layout(page);
    await capture(page, prefix, 'handoff', data);
    const h = data.behavior.pointerHandoff;
    check(prefix + ': pointer handoff + cleanup at 1600ms', h.hash === '#act-work-yuna' && Math.abs(h.target.rect.top - 48) < 1 && h.focusedId === 'case-yuna' && h.source.name === 'none' && h.target.name === 'none' && !h.transitionClass && h.activeNav === '#act-work', h);
    await align(page, 'act-work');
    await capture(page, prefix, 'work', data);
    for (const [name, id] of [['work-mgc', 'act-work-mgc'], ['work-comptoir', 'act-work-comptoir'], ['journey', 'act-journey-scene'], ['expertise', 'act-expertise'], ['contact', 'act-contact']]) {
      // Center the complete short desktop material case; long case/ledger entries start at the top.
      await align(page, id, prefix === 'desktop' && name === 'work-comptoir' ? 144 : 0);
      await capture(page, prefix, name, data);
    }
    for (const frame of ['hero', 'edit0', 'edit1', 'edit2', 'handoff', 'work', 'work-mgc', 'work-comptoir', 'journey', 'expertise', 'contact']) {
      const c = data.captures[frame];
      check(prefix + ': ' + frame + ' no nav intersections', c.collisions.length === 0 && c.photoCollision.length === 0, { texts: c.collisions, images: c.photoCollision });
    }
    for (const [frame, key] of [['hero', 'hero'], ['journey', 'journey'], ['expertise', 'expertise'], ['contact', 'contact']]) {
      check(prefix + ': ' + frame + ' clearance >=24', data.captures[frame].clearances[key] >= 24, data.captures[frame].clearances[key]);
    }
    if (prefix === 'desktop') {
      for (const frame of ['edit0', 'edit1', 'edit2']) {
        check('desktop: ' + frame + ' method clearance >=24', data.captures[frame].clearances.method >= 24, data.captures[frame].clearances.method);
      }
      check('desktop: Work skills clearance >=24', data.captures.work.clearances.yunaPractice >= 24, data.captures.work.clearances.yunaPractice);
    } else {
      for (const [frame, key] of [['work-mgc', 'mgcChallenge'], ['work-comptoir', 'comptoirSummary']]) {
        check('mobile: ' + frame + ' clearance >=24', data.captures[frame].clearances[key] >= 24, data.captures[frame].clearances[key]);
      }
    }
    check(prefix + ': single active ledger year', data.captures.journey.activeYears.length === 1, data.captures.journey.activeYears);
    await align(page, 'act-expertise');
    const row = page.locator('#act-expertise li').nth(3);
    if (width < 768) await row.tap(); else await row.focus();
    data.behavior.expertise = await row.evaluate((e) => ({ focused: document.activeElement === e, rule: getComputedStyle(e, '::before').transform, background: getComputedStyle(e).backgroundColor, rect: e.getBoundingClientRect().toJSON() }));
    await pause(page, 400);
    await page.screenshot({ path: output + '/' + prefix + '-expertise-touch-focus.png' });
    check(prefix + ': tactile focus row', data.behavior.expertise.focused && data.behavior.expertise.rect.height >= 44, data.behavior.expertise);
    await align(page, 'act-contact');
    await page.locator('a[href^="mailto:"]').focus();
    await pause(page, 750);
    await page.screenshot({ path: output + '/' + prefix + '-contact-transmit-focus.png' });
    data.behavior.contactFocus = await page.locator('a[href^="mailto:"]').evaluate((e) => ({ focus: document.activeElement === e, rule: getComputedStyle(e, '::after').transform, arrow: getComputedStyle(e.lastElementChild).transform, href: e.getAttribute('href') }));
    check(prefix + ': transmit focus rule', data.behavior.contactFocus.focus && data.behavior.contactFocus.href.includes('glwadys.dalleau29@gmail.com'), data.behavior.contactFocus);
    await align(page, 'act-journey-scene');
    const year = page.locator('[data-journey-year="2025"]');
    if (width < 768) await year.tap(); else await year.focus();
    data.behavior.journeyFocus = (await layout(page)).activeYears;
    check(prefix + ': ledger touch/focus selects one year', data.behavior.journeyFocus.length === 1 && data.behavior.journeyFocus[0] === '2025', data.behavior.journeyFocus);
    await page.screenshot({ path: output + '/' + prefix + '-journey-touch-focus.png' });
  }

  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await capture(page, prefix, 'contact-bottom', data);
  check(prefix + ': contact bottom clearance', data.captures['contact-bottom'].clearances.contact >= 24, data.captures['contact-bottom'].clearances.contact);
  if (prefix === 'small') {
    for (const frame of ['hero', 'edit2', 'contact-bottom']) {
      const c = data.captures[frame];
      check('small: ' + frame + ' no nav intersections', c.collisions.length === 0 && c.photoCollision.length === 0, { texts: c.collisions, images: c.photoCollision });
    }
    check('small: hero clearance >=24', data.captures.hero.clearances.hero >= 24, data.captures.hero.clearances.hero);
  }
  const nav = data.captures.hero.navTargets;
  check(prefix + ': five nav targets >=44px', nav.length === 5 && nav.every((n) => n.rect.width >= 44 && n.rect.height >= 44), nav);
  data.behavior.nav = [];
  for (const id of ['act-opening', 'act-work', 'act-journey-scene', 'act-expertise', 'act-contact']) {
    if (width < 768) await page.locator('nav a[href="#' + id + '"]').tap();
    else await page.locator('nav a[href="#' + id + '"]').click();
    await pause(page, 500);
    const d = await layout(page);
    data.behavior.nav.push({ destination: id, hash: d.hash, active: d.activeNav });
    check(prefix + ': nav settles at ' + id, d.hash === '#' + id && d.activeNav === '#' + id, d.activeNav);
  }

  await align(page, 'act-process');
  await page.locator('[data-edit-back]').focus();
  await page.keyboard.press('Space');
  await pause(page, 800);
  check(prefix + ': keyboard reverse', (await layout(page)).editStep === '1', (await layout(page)).editStep);
  await page.locator('[data-edit-next]').focus();
  await page.keyboard.press('Enter');
  await pause(page, 800);
  check(prefix + ': keyboard select', (await layout(page)).editStep === '2', (await layout(page)).editStep);
  const sequence = ['back', 'back', 'next', 'back', 'next', 'next', 'back', 'next'];
  data.behavior.rapid = [];
  for (const action of sequence) {
    const control = page.locator('[data-edit-' + action + ']');
    if (width < 768) {
      const bounds = await control.boundingBox();
      await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    } else {
      await control.evaluate((e) => e.click());
    }
    await pause(page, 55);
    data.behavior.rapid.push({ action, input: width < 768 ? 'touchscreen' : 'programmatic click', step: (await layout(page)).editStep });
  }
  await pause(page, 900);
  const afterRapid = await layout(page);
  check(prefix + ': rapid forward/reverse settles', afterRapid.editStep === '2' && afterRapid.source.persistent && afterRapid.source.transform === 'none', afterRapid.source);
  await page.locator('[data-edit-next]').focus();
  await page.keyboard.press('Enter');
  await pause(page, 1600);
  data.behavior.rapidHandoff = await layout(page);
  await page.screenshot({ path: output + '/' + prefix + '-keyboard-handoff.png' });
  check(prefix + ': keyboard handoff after rapid sequence', Math.abs(data.behavior.rapidHandoff.target.rect.top - 48) < 1 && data.behavior.rapidHandoff.focusedId === 'case-yuna' && data.behavior.rapidHandoff.source.name === 'none' && data.behavior.rapidHandoff.target.name === 'none' && !data.behavior.rapidHandoff.transitionClass, data.behavior.rapidHandoff.target);

  await align(page, 'act-journey-scene', 90);
  const beforeRefresh = await page.evaluate(() => scrollY);
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await pause(page, 600);
  data.behavior.refresh = await layout(page);
  data.behavior.refreshPosition = { before: beforeRefresh, after: data.behavior.refresh.scrollY, delta: data.behavior.refresh.scrollY - beforeRefresh };
  check(prefix + ': mid-scroll refresh usable', Math.abs(data.behavior.refreshPosition.delta) < 6 && data.behavior.refresh.activeNav === '#act-journey-scene' && data.behavior.refresh.scrollWidth === width, data.behavior.refreshPosition);
  if (prefix !== 'small') {
    for (const size of [{ width: 390, height: 844 }, { width: 1440, height: 900 }, { width, height }]) {
      await page.setViewportSize(size);
      await pause(page, 350);
      check(prefix + ': resize ' + size.width + ' width', (await layout(page)).scrollWidth === size.width, (await layout(page)).scrollWidth);
    }
    await align(page, 'act-process');
    await page.locator('[data-edit-next]').click();
    await pause(page, 140);
    await page.setViewportSize({ width: width === 390 ? 1440 : 390, height: width === 390 ? 900 : 844 });
    await pause(page, 400);
    check(prefix + ': resize during Flip settles', (await layout(page)).source.transform === 'none', (await layout(page)).source);
    await page.setViewportSize({ width, height });
  }
  await align(page, 'act-opening');
  data.behavior.heroReverse = await layout(page);
  check(prefix + ': hero reverse registration', data.behavior.heroReverse.heroTransform === 'matrix(1, 0, 0, 1, 0, 0)' || data.behavior.heroReverse.heroTransform === 'none', data.behavior.heroReverse.heroTransform);
  await page.evaluate(() => scrollTo({ top: 350, behavior: 'instant' }));
  await pause(page, 250);
  data.behavior.heroRegistered = (await layout(page)).heroTransform;
  check(prefix + ': scroll registers hero crop', data.behavior.heroRegistered !== data.behavior.heroReverse.heroTransform && data.behavior.heroRegistered !== 'none', data.behavior.heroRegistered);
  await align(page, 'act-opening');
  check(prefix + ': crop returns after scroll reversal', (await layout(page)).heroTransform === data.behavior.heroReverse.heroTransform, (await layout(page)).heroTransform);
  data.integrity = await integrity(page, prefix, log);
  if (prefix === 'mobile') await context.tracing.stop({ path: output + '/mobile-browser-trace.zip' });
  await context.close();
  if (video) await rename(await video.path(), output + '/' + prefix + '-session.webm');
  await writeFile(output + '/results.json', JSON.stringify(report, null, 2));
  console.log(prefix + ' evidence complete');
}

for (const variant of ['reduced-motion', 'no-webgl', 'no-view-transition']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: variant === 'reduced-motion' ? 'reduce' : 'no-preference' });
  await instrument(context, { noWebGL: variant === 'no-webgl', noTransition: variant === 'no-view-transition' });
  const page = await context.newPage();
  const log = listen(page);
  const data = { http: await load(page), captures: {}, log };
  report.variants[variant] = data;
  await align(page, 'act-process');
  for (let step = 1; step <= 2; step++) {
    await page.locator('[data-edit-next]').click();
    const current = await layout(page);
    if (variant === 'reduced-motion') check(variant + ': instant Edit ' + step, current.editStep === String(step) && current.source.transform === 'none', current.source);
    await pause(page);
  }
  await capture(page, variant, 'edit2', data);
  await page.locator('[data-edit-next]').focus();
  await page.keyboard.press('Enter');
  await pause(page, 1600);
  await capture(page, variant, 'handoff', data);
  const h = data.captures.handoff;
  check(variant + ': correct handoff and cleanup', Math.abs(h.target.rect.top - 48) < 1 && h.hash === '#act-work-yuna' && h.source.name === 'none' && h.target.name === 'none' && !h.transitionClass, h.target);
  if (variant === 'no-webgl') check(variant + ': no WebGL calls', h.metrics.webglCalls === 0, h.metrics.webglCalls);
  if (variant === 'reduced-motion') {
    await align(page, 'act-opening');
    const first = (await layout(page)).heroTransform;
    await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }));
    check(variant + ': no scrub movement', first === (await layout(page)).heroTransform, first);
    const headings = await page.locator('main h1, main h2').allTextContents();
    check(variant + ': six chapters present', headings.length === 6, headings);
  }
  data.integrity = await integrity(page, variant, log);
  await context.close();
  await writeFile(output + '/results.json', JSON.stringify(report, null, 2));
  console.log(variant + ' evidence complete');
}

for (const locale of ['fr', 'en', 'ko']) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await instrument(context);
  const page = await context.newPage();
  const log = listen(page);
  const data = { http: await load(page, locale), captures: {}, log, widths: [] };
  report.locales[locale] = data;
  data.lang = await page.locator('html').getAttribute('lang');
  check(locale + ': HTTP/lang', data.http === 200 && data.lang === { fr: 'fr-FR', en: 'en', ko: 'ko-KR' }[locale], { http: data.http, lang: data.lang });
  if (locale !== 'fr') {
    await capture(page, locale + '-390', 'hero', data);
    await align(page, 'act-contact');
    await capture(page, locale + '-390', 'contact', data);
  }
  for (const size of [{ width: 390, height: 844 }, { width: 320, height: 800 }]) {
    await page.setViewportSize(size);
    await align(page, 'act-process');
    const initial = await layout(page);
    if (initial.editStep === '0') { await page.locator('[data-edit-next]').click(); await pause(page); await page.locator('[data-edit-next]').click(); await pause(page); }
    const d = await layout(page);
    data.widths.push({ width: size.width, actual: d.scrollWidth, editClearance: d.clearances.edit });
    check(locale + ': ' + size.width + ' exact width and Edit clearance', d.scrollWidth === size.width && d.clearances.edit >= 24, data.widths.at(-1));
    if (locale !== 'fr') await capture(page, locale + '-' + size.width, 'edit2', data);
  }
  data.integrity = await integrity(page, locale, log);
  await context.close();
}

const noJS = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
const noJSPage = await noJS.newPage();
await noJSPage.goto(base + '/fr', { waitUntil: 'networkidle' });
const semantic = { chapters: await noJSPage.locator('h1, h2').count(), cases: await noJSPage.locator('[data-project]').count(), email: await noJSPage.locator('a[href^="mailto:"]').count(), handoff: await noJSPage.locator('noscript a[href="#act-work-yuna"]').count() };
report.variants.noJS = semantic;
check('No JS: semantic content + handoff anchor', semantic.chapters === 6 && semantic.cases === 3 && semantic.email === 1 && semantic.handoff === 1, semantic);
await noJSPage.screenshot({ path: output + '/no-js-hero.png' });
await noJS.close();

const slow = await browser.newContext({ viewport: { width: 390, height: 844 } });
await instrument(slow);
const slowPage = await slow.newPage();
const slowLog = listen(slowPage);
const cdp = await slow.newCDPSession(slowPage);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 120, downloadThroughput: 200000, uploadThroughput: 100000 });
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const slowData = { http: await load(slowPage), log: slowLog, captures: {} };
report.variants.constrained = slowData;
await align(slowPage, 'act-process');
const frames = slowPage.evaluate(() => new Promise((resolve) => {
  const ticks = []; const start = performance.now();
  const frame = (t) => { ticks.push(t); if (t - start < 1400) requestAnimationFrame(frame); else resolve(ticks.slice(1).map((time, i) => time - ticks[i])); };
  requestAnimationFrame(frame);
}));
await slowPage.locator('[data-edit-next]').click();
const deltas = await frames;
slowData.frameIntervals = { samples: deltas.length, median: [...deltas].sort((a, b) => a - b)[Math.floor(deltas.length / 2)], max: Math.max(...deltas), over34ms: deltas.filter((n) => n > 34).length };
await pause(slowPage);
await slowPage.locator('[data-edit-next]').click();
await pause(slowPage);
await slowPage.locator('[data-edit-next]').click();
await pause(slowPage, 1600);
slowData.handoff = await layout(slowPage);
check('Constrained: handoff remains usable', slowData.handoff.hash === '#act-work-yuna' && Math.abs(slowData.handoff.target.rect.top - 48) < 1, slowData.handoff.target);
slowData.integrity = await integrity(slowPage, 'constrained', slowLog);
await slowPage.screenshot({ path: output + '/constrained-handoff.png' });
await slow.close();

report.failures = report.checks.filter((c) => !c.ok);
await writeFile(output + '/results.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ generatedAt: report.generatedAt, checks: report.checks.length, failures: report.failures, constrained: slowData.frameIntervals }, null, 2));
await browser.close();
if (report.failures.length) process.exitCode = 1;
