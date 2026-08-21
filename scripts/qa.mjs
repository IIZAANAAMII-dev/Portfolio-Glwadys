/**
 * QA visuel.
 *
 * « BUILD OK ≠ SITE RÉUSSI. » Ce script sert à *regarder* ce qui est construit.
 *
 *   node scripts/qa.mjs opening            captures chronométrées de l'Opening
 *   node scripts/qa.mjs scroll             captures le long du scroll (desktop)
 *   node scripts/qa.mjs scroll --mobile    idem en 390x844
 *   node scripts/qa.mjs viewports          la Hero sur tous les points de contrôle
 *   node scripts/qa.mjs reduced            variante prefers-reduced-motion
 *   node scripts/qa.mjs reverse            scroll inverse (détection d'états cassés)
 *
 * Options : --url=… --locale=fr|en|ko --out=nom --steps=N --console
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const preset = args.find((a) => !a.startsWith('--')) ?? 'scroll';
const flag = (name, fallback = undefined) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const has = (name) => args.includes(`--${name}`);

const BASE = flag('url', 'http://localhost:3000');
const LOCALE = flag('locale', 'fr');
const URL = `${BASE}/${LOCALE}`;
const OUT = path.resolve('docs/qa', flag('out', preset));

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const VIEWPORTS = [
  { w: 375, h: 812 },
  { w: 390, h: 844 },
  { w: 430, h: 932 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Scroll piloté par Lenis : on attend que la position se stabilise. */
async function scrollTo(page, y) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y);
  await page.waitForFunction(
    (target) => Math.abs(window.scrollY - target) < 4 || window.scrollY >= document.body.scrollHeight - window.innerHeight - 4,
    y,
    { timeout: 4000 },
  ).catch(() => {});
  await sleep(700); // laisser les scrubs converger
}

async function pageHeight(page) {
  return page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
}

async function run() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const errors = [];

  const makePage = async (viewport, reduced = false) => {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
      else if (has('console')) console.log(`  · ${m.type()}: ${m.text()}`);
    });
    page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
    return { context, page };
  };

  const shot = async (page, name) => {
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file });
    console.log(`  ✓ ${name}`);
  };

  if (preset === 'opening') {
    // L'Opening est chronométré : on capture le film, pas seulement sa fin.
    const marks = [0, 350, 700, 1150, 1500, 1950, 2350, 2900, 3600];
    const { context, page } = await makePage(DESKTOP);
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    let previous = 0;
    for (const m of marks) {
      await sleep(m - previous);
      previous = m;
      await shot(page, `t${String(m).padStart(4, '0')}ms`);
    }
    // Le verrou de scroll doit être relâché à la fin.
    const locked = await page.evaluate(
      () => document.documentElement.dataset.scrollLocked === 'true',
    );
    console.log(`  scroll verrouillé après l'Opening : ${locked ? 'OUI (DÉFAUT)' : 'non'}`);
    await context.close();
  } else if (preset === 'viewports') {
    for (const v of VIEWPORTS) {
      const { context, page } = await makePage({ width: v.w, height: v.h });
      await page.goto(URL, { waitUntil: 'load' });
      await sleep(3600);
      await shot(page, `${v.w}x${v.h}`);
      await context.close();
    }
  } else if (preset === 'reduced') {
    for (const v of [DESKTOP, MOBILE]) {
      const { context, page } = await makePage(v, true);
      await page.goto(URL, { waitUntil: 'load' });
      await sleep(1200);
      await shot(page, `reduced-${v.width}-top`);
      const max = await pageHeight(page);
      for (const f of [0.25, 0.5, 0.75, 1]) {
        await scrollTo(page, Math.round(max * f));
        await shot(page, `reduced-${v.width}-${Math.round(f * 100)}`);
      }
      await context.close();
    }
  } else if (preset === 'reverse') {
    const { context, page } = await makePage(DESKTOP);
    await page.goto(URL, { waitUntil: 'load' });
    await sleep(3600);
    const max = await pageHeight(page);
    const steps = Number(flag('steps', 12));
    // Descendre vite jusqu'en bas, puis remonter : révèle les états non réversibles.
    await scrollTo(page, max);
    await shot(page, 'bottom');
    for (let i = steps - 1; i >= 0; i--) {
      await scrollTo(page, Math.round((max * i) / steps));
      await shot(page, `up-${String(steps - i).padStart(2, '0')}`);
    }
    await context.close();
  } else {
    // scroll (défaut)
    const mobile = has('mobile');
    const viewport = mobile ? MOBILE : DESKTOP;
    const { context, page } = await makePage(viewport);
    await page.goto(URL, { waitUntil: 'load' });
    await sleep(3600); // laisser l'Opening se terminer
    await shot(page, '00-hero');
    const max = await pageHeight(page);
    const steps = Number(flag('steps', 20));
    console.log(`  hauteur scrollable : ${max}px ≈ ${(max / viewport.height).toFixed(1)} viewports`);
    for (let i = 1; i <= steps; i++) {
      await scrollTo(page, Math.round((max * i) / steps));
      await shot(page, `${String(i).padStart(2, '0')}-${Math.round((i / steps) * 100)}pc`);
    }
    await context.close();
  }

  await browser.close();

  if (errors.length) {
    console.log('\n  ERREURS CONSOLE :');
    [...new Set(errors)].forEach((e) => console.log(`   ! ${e}`));
  } else {
    console.log('\n  aucune erreur console');
  }
  console.log(`\n  → ${OUT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
