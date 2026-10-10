# 30 — Astra High V3: source verified, WebKit gate blocked

## Scope and current status

Task `t_3e6bb2ab`, branch `jarvis/glwadys-cinematic-v3`. Starting HEAD was `a42550b`, not the deleted-module WIP described in the older card. WorkJourneyBridge, JourneyOpeningFrame, the editorial project spreads, six archive prints and single-writer Expertise index were already recovered and committed. They were preserved; no reset, clean, snapshot deletion, main merge or deployment was performed. Earlier dirty screenshots, untracked briefs and other WIP were left untouched.

This is NOT final design/release approval. The required WebKit 390/320 matrix could not run: no installed WebKit; the Playwright installer received HTTP 403 from its download hosts. Desktop/mobile Chromium is supplemental, not a substitute for Safari. Full keyboard/touch interaction suite, physical-phone testing and preview publication remain unverified in this run.

## Executed changes

- Reproducible build: Google Fonts requests failed with sandbox HTTP 403. Vendored the same Bodoni Moda, Inter Tight, Kalam and Noto Sans KR families from Fontsource 5.3.0, with original SIL licenses and provenance under `src/fonts/`. Local Next font loader for Latin families; original unicode-range CSS for Korean (no preload). No package install scripts or fabricated font responses. No new runtime dependency.
- Work: raised generated-visual disclosures from 8–9.6px mobile to 11px, desktop cover to 12px; normal case improves readability. Reserved space beneath the spread aperture for the disclosure. Short-screen summaries increased from 12.8 to 14px.
- MGC 320: the first typography pass left only 0.516px between summary and disclosure; an actual second measurement led to a slightly shorter photo and earlier summary. Final gap is 14.719px, with no title/photo/text collisions observed in the final frame.
- Expertise: resting disciplines now use 0.78 desktop / 0.82 mobile opacity rather than 0.60 / 0.74, synchronized in CSS and the painter. Active discipline, counter, reading rule, seven states and shared Journey frame are unchanged.
- QA: optional installed-browser path, separate evidence root and actual browser version; measured disclosure/body font sizes and disclosure/photo clearance. Two regression tests reject tiny credits and collisions even when document overflow is zero. No assertions removed or weakened.

## Five baseline observations, not a new concept

1. Build could not reproduce typography without live Google Fonts access.
2. Cover disclosure at 320 was only 8.8px.
3. Spread disclosure on mobile was only 8px.
4. Short-screen body copy was only 12.8px.
5. Inactive Expertise terms looked too pale in the captured wine index.

Those five issues were addressed without redesigning the approved editorial chapters. The final MGC 320 and Korean Expertise 320 frames were visually inspected: text is readable, all seven disciplines are present, and no clipping/collision was observed. An advisory concern about the desktop active term touching its underline was not reproduced by DOM measurement: the term box clears the line by 8.648px. Full-section reduced-motion captures include fixed navigation in the screenshot at the current scroll position; these are not viewport composition proofs.

## Real execution

- `npm run typecheck`: pass.
- `npm run lint`: exit 0; existing jsx-ast-utils TSNonNullExpression diagnostic remains.
- `node --test scripts/*.test.mjs qa/*.test.mjs`: 13 passed, 0 failed. Existing Node module-type warnings remain.
- `npm run build -- --webpack`: pass; /fr, /en, /ko statically generated.
- `git diff --check`: pass.
- One server and one browser at a time; harness cleanup stopped both after every run.

Final evidence uses Chromium **153.0.8010.12** from the sandbox's existing executable, not the missing pinned Chromium revision. 10 cases, 242 inspected states, 172 screenshots, zero page/console errors, failed HTTP responses, overflow or assertion failures in that matrix. Exact tested seam x/y/w/h error: 0px (notebook→Yuna, bridge→Journey, Journey→Expertise). This does not certify every intermediate cinematic frame or all project-to-project seam properties.

Matrix: 1440 FR motion; 390 FR/KO motion; 320 FR/EN/KO motion; 320 FR/EN/KO reduced; 320 FR no-JS. Motion runs include reverse seeks, resize, wheel and preference-toggle lifecycle checks. The no-JS/static paths retain six career entries and all seven disciplines.

Source SHA-256 (`src` + lockfile): `2c5bf417e4b516257de1a0d6b978fa3d009adb7a77732cb718b0748488d9bc1e`.
Build ID: `0IhtZ76ltChO5vPBt7XNt`.
Machine report: `docs/qa/astra-resume-final/partial-summary.json`.

## Actual screenshot paths (relative to this worktree)

- `docs/qa/astra-resume-final/chromium-1440-fr-motion/work-mgc-read.png`
- `docs/qa/astra-resume-final/chromium-1440-fr-motion/journey-fourth.png`
- `docs/qa/astra-resume-final/chromium-1440-fr-motion/expertise-sixth.png`
- `docs/qa/astra-resume-final/chromium-320-fr-motion/work-mgc-read.png`
- `docs/qa/astra-resume-final/chromium-320-fr-motion/work-yuna-spread.png`
- `docs/qa/astra-resume-final/chromium-320-ko-motion/expertise-sixth.png`
- `docs/qa/astra-resume-final/chromium-320-fr-reduced/static-full-4.png`

Before: `docs/qa/astra-resume/` (post-font recovery, before readability changes). Intermediate pass: `docs/qa/astra-resume-after/` (stale). Final: `docs/qa/astra-resume-final/`. Do not combine their source hashes.

## Resume on a WebKit-capable host

Run the existing WebKit matrix, `scripts/v3-interaction-qa.mjs`, inspect WebKit folded pages and exact forward/reverse seams, and obtain independent visual approval. The normal full report `scripts/v3-report.mjs` must not be replaced by this partial report. No claim of production readiness or 10/10. Main/public deployment remains approval-gated.

To reproduce supplemental Chromium here:

```sh
QA_BROWSER_EXECUTABLE=/opt/playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell \
QA_OUTPUT_ROOT=docs/qa/astra-resume-final node scripts/v3-qa.mjs chromium 320 fr motion
node scripts/v3-partial-report.mjs docs/qa/astra-resume-final
```
