/**
 * Visual QA harness.
 *
 * Drives the locally installed Chrome (no Playwright browser download needed)
 * and captures screenshots at chosen scroll depths, so every act can be
 * reviewed statically before it is considered done.
 *
 * Usage:
 *   node scripts/shoot.mjs --url http://localhost:3000/fr --out act1 --at 0,0.25,0.5
 *   node scripts/shoot.mjs --url ... --viewport 390x844 --out mobile
 *   node scripts/shoot.mjs --selfcheck
 *
 * Flags:
 *   --url        page to open (default http://localhost:3000/fr)
 *   --out        filename prefix inside docs/screenshots
 *   --at         comma list of scroll progress values 0..1 (default 0)
 *   --viewport   WxH (default 1440x900)
 *   --full       also capture a full-page screenshot
 *   --settle     ms to wait after each scroll (default 900)
 *   --reduced    emulate prefers-reduced-motion: reduce
 *   --selfcheck  verify the harness itself works, then exit
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const OUT_DIR = 'docs/screenshots';

const CHROME_CANDIDATES = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env['ProgramFiles(x86)']}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`,
  `${process.env.ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
];

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function resolveExecutable() {
  const found = CHROME_CANDIDATES.find((candidate) => candidate && existsSync(candidate));
  if (!found) {
    throw new Error(
      'No Chrome or Edge executable found. Install one, or set CHROME_PATH.',
    );
  }
  return process.env.CHROME_PATH ?? found;
}

async function launch() {
  return chromium.launch({
    executablePath: resolveExecutable(),
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
  });
}

/**
 * Scrolls to a fraction of the total scrollable height and waits for the
 * scroll-driven animations to settle. Dispatches real wheel-free scrolling so
 * smooth-scroll libraries stay in sync with the native position.
 */
async function scrollTo(page, progress, settle) {
  await page.evaluate((p) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * p, behavior: 'instant' });
  }, progress);
  await page.waitForTimeout(settle);
}

async function selfcheck() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 420 } });
  await page.setContent(
    `<body style="margin:0;background:#0B0C0E;color:#D8C29D;height:100vh;display:grid;place-items:center;font-family:system-ui">
       <div style="text-align:center">
         <div style="font-size:12px;letter-spacing:.28em;color:#8E929C">VISUAL QA HARNESS</div>
         <div style="font-size:46px;font-weight:600;letter-spacing:-.03em;margin-top:10px">TOOLING OK</div>
       </div>
     </body>`,
  );
  await page.screenshot({ path: `${OUT_DIR}/_tooling-check.png` });
  const engine = await page.evaluate(() => navigator.userAgent);
  await browser.close();
  console.log('SELFCHECK OK');
  console.log('executable:', resolveExecutable());
  console.log('userAgent :', engine);
}

async function shoot(args) {
  const url = args.url ?? 'http://localhost:3000/fr';
  const prefix = args.out ?? 'shot';
  const settle = Number(args.settle ?? 900);
  const [width, height] = String(args.viewport ?? '1440x900').split('x').map(Number);
  const stops = String(args.at ?? '0')
    .split(',')
    .map(Number)
    .filter((n) => !Number.isNaN(n));

  await mkdir(OUT_DIR, { recursive: true });
  const browser = await launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: args.reduced ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(settle);

  const written = [];
  for (const progress of stops) {
    if (progress > 0) await scrollTo(page, progress, settle);
    const name = `${prefix}-${String(Math.round(progress * 100)).padStart(3, '0')}.png`;
    await page.screenshot({ path: `${OUT_DIR}/${name}` });
    written.push(name);
  }

  if (args.full) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(settle);
    const name = `${prefix}-full.png`;
    await page.screenshot({ path: `${OUT_DIR}/${name}`, fullPage: true });
    written.push(name);
  }

  const metrics = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    screens: +(document.documentElement.scrollHeight / window.innerHeight).toFixed(2),
  }));

  await browser.close();

  console.log(`url        : ${url}`);
  console.log(`viewport   : ${width}x${height}`);
  console.log(`page height: ${metrics.scrollHeight}px (${metrics.screens} screens)`);
  console.log(`captured   : ${written.join(', ')}`);
  if (errors.length) {
    console.log(`\nCONSOLE ERRORS (${errors.length}):`);
    errors.slice(0, 15).forEach((e) => console.log(`  - ${e}`));
  } else {
    console.log('console    : clean');
  }
  await writeFile(
    `${OUT_DIR}/${prefix}-report.json`,
    JSON.stringify({ url, width, height, metrics, written, errors }, null, 2),
  );
}

const args = parseArgs(process.argv);
try {
  if (args.selfcheck) await selfcheck();
  else await shoot(args);
} catch (error) {
  console.error('FAILED:', error.message);
  process.exit(1);
}
