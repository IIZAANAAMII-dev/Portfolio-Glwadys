# GLWADYS — 17 / Atelier notebook and honest cinematic UX gate

**2026-10-09 — Actual original worktree, `jarvis/glwadys-original-flagship` only.** User asked to mentor Jarvis and truly redesign the whole site, not merely add small flourishes. Authorial thesis and required Jarvis skills are in `docs/flagship/16-director-master-editorial-film.md`.

## 1. Factual editorial cleanup
Original 'What you see / What holds it' already establishes the strategic thought behind content. A later generic 'The process / The method' felt like a duplicate idea. **Act 05 is now a distinct physical object**, called `Le carnet` (FR), `The notebook` (EN), `작업 노트` (KO), with its internal `La méthode` as one of its components. No separate extra act, no fictitious client claim; all existing content and nine acts preserved.

## 2. Actually implemented signature interaction
`src/acts/ActProcess/index.tsx` and `ActProcess.module.css`:
- real, art-directed claret wine hardcover, aged brass spine, restrained serif monogram, and paper page border; existing contact-sheet imagery becomes physical evidence pages.
- cover rotates in three dimensions, from 0 to −168 degrees, on the **existing scrubbed GSAP master timeline**; pages flip in sequence (previous sheet rotates −164 degrees, following sheet is revealed underneath).
- **No separate pin, no Three.js / WebGL, no animation loops.** Motion follows scroll both ways; easier to interrupt and lighter than an extraneous animated widget. Mobile uses flat 2D mask instead of 3D, with larger page and fixed chapter notes; movement-reduced visitors get the site's existing semantic Process sequence.
- The sixth and final Yuna photo retains the previously validated same-media handoff to the first Work case study. Author's images and best motion language preserved.

## 3. Real UX bug fixed
`src/shell/BottomNav.tsx`: prior IntersectionObserver could leave nav highlighted on `Projets / ACT 06` when reversing back into `Le carnet / ACT 05`. Observing only changes in intersection of an oversized pinned scene and a narrow Work marker led to stale state. The nav now reads all genuine physical act boundaries on a scroll-frame-throttled check in either direction; `aria-current` and ACT index remain synchronized.

## 4. Evidence and tests actually checked
- Chromium Playwright page-state sampling at 11 positions across the notebook for desktop 1440×900, mobile 390×844, small mobile 320×800, mobile EN and KO, and mobile reduced motion. **0 page errors; 0 observed horizontal overflow**.
- Grounded screenshot/video proofs `docs/qa/film-gate/book-desktop-2-85.png` (cover turning), `book-desktop-3-2.png` (first page), `notebook-desktop-open-final.png`, `notebook-mobile-open-final.png`, `notebook-small-open-final.png`; screen videos `notebook-desktop-film-forward-reverse.webm`, `notebook-mobile-film-forward-reverse.webm`, `notebook-small-film-forward-reverse.webm`.
- Reverse navigation tests: desktop 1440×900 and mobile 390×844 from Process→Work→back to Process, **correct ACT 05 / Le carnet and ACT 06 / Sélection each time**.
- WebKit headless engine tested on 390×844 and 320×800 for the same sequence. No JS page errors, no horizontal overflow and ACT ownership remains correct. **This is WebKit on the server, not validation on real iPhone Safari hardware.**
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` pass (ESLint's single nonfatal warning concerns a preexisting untracked QA scratch script, not application code).
- Responsive photo/book remains part of the same semantic journal; no main changes.

## 5. Jarvis continuation, independent cold gate
The live mission queue in `portfolio-glwadys-astra` includes creativelead `t_bbf9d5c8` (8 force-loaded premium skills), source builder `t_84813115`, final QA `t_27e19338`, independent jury `t_78ac6e14`. Comments refer to master brief 16. Each must actually critique and fix all nine acts. GPT-6 Astra via OpenAI-Codex/ChatGPT login is pinned but **was returning 429 rate-limited as of the last check**; do not report agent has completed until proven. Avoid concurrent agents editing same worktree.

## 6. Still open — NO false perfect claim
Immersion→Notebook/Process handoff, full nine-act film in both directions, actual iPhone Safari performance and touch inertia, page-turn compositing FPS, WebGL memory/context lifecycle, cross-locale font metrics/spacing, reading contrast and all previous duplicated motifs need an independent audit. This improvement does not warrant a self-awarded 10/10. Preview builds only; user signoff required before production/main.
