/**
 * Diagnostic ponctuel : relève la géométrie réelle d'éléments clés à
 * différentes positions de scroll. Sert à constater un bug, pas à le supposer.
 *
 *   node scripts/diag.mjs            positions par défaut
 *   node scripts/diag.mjs --at=0.63
 */

import { chromium } from 'playwright';

const args = process.argv.slice(2);
const flag = (n, d) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.split('=').slice(1).join('=') : d;
};

const URL = `${flag('url', 'http://localhost:3000')}/${flag('locale', 'fr')}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TARGETS = [
  ['nameFirstBox', '[class*="nameFirst"]'],
  ['nameFirstLine', '[data-name-line]'],
  ['nameLastBox', '[class*="nameLast"]'],
  ['page', '[data-page-surface]'],
  ['device', '[data-phone-device]'],
  ['screen', '[data-phone-screen]'],
  ['behind', '[data-behind]'],
  ['portal', '[data-portal-frame]'],
  ['ground', '[data-scene-ground]'],
  ['canvasHost', '[data-immersion-canvas]'],
  ['canvas', '[data-immersion-canvas] canvas'],
];

const probe = (targets) =>
  targets.map(([name, sel]) => {
    const el = document.querySelector(sel);
    if (!el) return { name, missing: true };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      name,
      text: el.textContent?.trim() || '',
      x: Math.round(r.left),
      y: Math.round(r.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
      op: Number(cs.opacity).toFixed(2),
      vis: cs.visibility,
      pos: cs.position,
      color: cs.color,
      inline: el.getAttribute('style') ?? '',
      z: cs.zIndex,
      clip: cs.clipPath,
      overflow: cs.overflow,
      transform: cs.transform === 'none' ? 'none' : cs.transform.replace(/matrix\(|\)/g, ''),
      stack: document
        .elementsFromPoint(
          Math.max(0, Math.min(innerWidth - 1, r.left + Math.min(r.width / 2, 50))),
          Math.max(0, Math.min(innerHeight - 1, r.top + r.height / 2)),
        )
        .slice(0, 4)
        .map((node) => `${node.tagName.toLowerCase()}.${String(node.className).split(' ')[0]}`),
    };
  });

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'load' });
  await sleep(3600);

  const max = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  const at = flag('at', null);
  const points = at ? [Number(at)] : [0, 0.06, 0.13, 0.19, 0.25, 0.31, 0.38];

  for (const p of points) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(max * p));
    await sleep(900);
    const rows = await page.evaluate(probe, TARGETS);
    console.log(`\n=== ${(p * 100).toFixed(0)}%  (y=${Math.round(max * p)}) ===`);
    for (const r of rows) {
      if (r.missing) {
        console.log(`  ${r.name.padEnd(11)} ABSENT`);
        continue;
      }
      console.log(
        `  ${r.name.padEnd(11)} ${String(r.x).padStart(5)},${String(r.y).padStart(5)}` +
          ` ${String(r.w).padStart(5)}x${String(r.h).padStart(4)}` +
          ` op=${r.op} ${r.vis} ${r.pos.padEnd(8)} ${r.transform}`,
      );
      if (r.name.startsWith('name')) {
        console.log(
          `      text=${JSON.stringify(r.text)} color=${r.color} z=${r.z}` +
            ` clip=${r.clip} overflow=${r.overflow} inline=${JSON.stringify(r.inline)}` +
            ` stack=${r.stack.join(' > ')}`,
        );
      }
    }

    if (args.includes('--capture-name') && p === points[0]) {
      await page.locator('[class*="nameFirst"]').screenshot({ path: 'docs/qa/name-first-probe.png' });
      await page.locator('[class*="nameLast"]').screenshot({ path: 'docs/qa/name-last-probe.png' });
    }
  }

  await browser.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
