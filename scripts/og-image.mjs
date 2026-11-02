/**
 * Génère les images de partage (Open Graph / X) : public/og/og-{fr,en,ko}.jpg
 *
 * La couverture du numéro, recomposée à 1200×630 avec les vraies polices
 * (Bodoni Moda romain + italique, Inter Tight, Noto Sans KR) et la vraie
 * photographie de couverture. Rendu par Chromium, aucune dépendance ajoutée.
 *
 *   node scripts/og-image.mjs
 *
 * Si Chromium n'est pas trouvé, définir PLAYWRIGHT_CHROMIUM=/chemin/vers/chrome.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const file = (p) => pathToFileURL(join(root, p)).href;

const COPY = {
  fr: { role: ['Community Manager', 'Créatrice de contenu UGC'], topics: 'Luxe · Mode · Joaillerie', axis: 'Paris ↔ Seoul', tagline: 'Je transforme les marques en histoires dont on se souvient.' },
  en: { role: ['Community Manager', 'UGC Content Creator'], topics: 'Luxury · Fashion · Jewellery', axis: 'Paris ↔ Seoul', tagline: 'I turn brands into stories people remember.' },
  ko: { role: ['커뮤니티 매니저', 'UGC 콘텐츠 크리에이터'], topics: '럭셔리 · 패션 · 주얼리', axis: '파리 ↔ 서울', tagline: '브랜드를 기억에 남는 이야기로 만듭니다.' },
};

const html = (locale) => {
  const c = COPY[locale];
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<link rel="stylesheet" href="${file('src/fonts/noto/index.css')}">
<style>
@font-face { font-family: Bodoni; src: url(${file('src/fonts/bodoni/bodoni-moda-latin-standard-normal.woff2')}) format('woff2'); font-weight: 400 900; font-style: normal; }
@font-face { font-family: Bodoni; src: url(${file('src/fonts/bodoni/bodoni-moda-latin-standard-italic.woff2')}) format('woff2'); font-weight: 400 900; font-style: italic; }
@font-face { font-family: Inter; src: url(${file('src/fonts/inter/inter-tight-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { position: relative; background: radial-gradient(70% 90% at 50% 112%, rgb(208 173 114 / 0.14), transparent 60%), #0b0908; color: #f3ede3;
  font-family: Inter, 'Noto Sans KR Variable', sans-serif; -webkit-font-smoothing: antialiased; }
.bar { position: absolute; left: 56px; right: 56px; top: 40px; display: flex; justify-content: space-between; padding-bottom: 14px;
  border-bottom: 1px solid rgb(243 237 227 / 0.18); font-size: 13px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; }
.bar .gold { color: #d0ad72; }
.print { position: absolute; left: 50%; top: 92px; width: 300px; height: 450px; transform: translateX(-50%); overflow: hidden; }
.print img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 52%; filter: sepia(0.06) saturate(0.92); }
.mark { position: absolute; width: 18px; height: 18px; border: 0 solid #d0ad72; }
.m0 { left: 438px; top: 80px; border-left-width: 1px; border-top-width: 1px; }
.m1 { right: 438px; top: 80px; border-right-width: 1px; border-top-width: 1px; }
.m2 { left: 438px; top: 524px; border-left-width: 1px; border-bottom-width: 1px; }
.m3 { right: 438px; top: 524px; border-right-width: 1px; border-bottom-width: 1px; }
.name { position: absolute; left: 0; right: 0; top: 96px; text-align: center; font-family: Bodoni; font-optical-sizing: auto; font-weight: 400;
  font-size: 212px; line-height: 0.82; letter-spacing: -0.02em; text-transform: uppercase; }
.family { position: absolute; right: 64px; top: 304px; font-family: Bodoni; font-style: italic; font-size: 92px; line-height: 1; letter-spacing: -0.02em; color: #d0ad72; }
.role { position: absolute; left: 56px; top: 320px; font-size: 17px; font-weight: 500; letter-spacing: 0.16em; line-height: 1.5; text-transform: uppercase; }
.role::before { content: ''; display: block; width: 40px; height: 1px; margin-bottom: 18px; background: #d0ad72; }
.tagline { position: absolute; right: 64px; bottom: 54px; width: 300px; text-align: right; font-size: 21px; line-height: 1.32; color: rgb(243 237 227 / 0.92); text-wrap: balance; }
.credit { position: absolute; left: 56px; bottom: 54px; font-size: 12px; letter-spacing: 0.04em; color: rgb(243 237 227 / 0.66); }
html[lang='ko'] .role, html[lang='ko'] .tagline { letter-spacing: 0; word-break: keep-all; }
</style></head><body>
<div class="bar"><span>Nº 01 — Portfolio 2026</span><span class="gold">${c.topics}</span><span>${c.axis}</span></div>
<div class="print"><img src="${file('public/media/portfolio/editorial/hero-vertical.jpg')}" alt=""></div>
<span class="mark m0"></span><span class="mark m1"></span><span class="mark m2"></span><span class="mark m3"></span>
<div class="name">Glwadys</div>
<div class="family">Dalleau</div>
<p class="role">${c.role[0]}<br>${c.role[1]}</p>
<p class="tagline">${c.tagline}</p>
<p class="credit">glwadys.dalleau29@gmail.com</p>
</body></html>`;
};

const executablePath = process.env.PLAYWRIGHT_CHROMIUM ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const work = join(tmpdir(), `og-${process.pid}`);
await mkdir(work, { recursive: true });
await mkdir(join(root, 'public/og'), { recursive: true });
try {
  for (const locale of Object.keys(COPY)) {
    const source = join(work, `og-${locale}.html`);
    await writeFile(source, html(locale));
    await page.goto(pathToFileURL(source).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const out = join(root, `public/og/og-${locale}.jpg`);
    await page.screenshot({ path: out, type: 'jpeg', quality: 86 });
    console.log(out);
  }
} finally {
  await browser.close();
  await rm(work, { recursive: true, force: true });
}
