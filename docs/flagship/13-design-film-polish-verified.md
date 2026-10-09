# Glwadys flagship — design & film polish, proof-gated (2026-10-09)

## Artistic intent
The original Creative Notebook Premium nine-act portfolio stays intact on `jarvis/glwadys-original-flagship`. This revision removes **actual visible defects** instead of appending decorative effects. The goal is an Awwwards-grade film, **not an unsupported claim of 10/10**.

## Verified source improvements

1. **Opening director: coherent film pacing.** `src/acts/ActScrollStory/index.tsx` now holds the cover at its complete editorial composition for `T.heroHold=0.42` viewport units before the original GSAP name/text/media handoff begins. Previously `heroHold=0` propelled the name out of the viewport on the user's first small scroll, making this premium signature unreadable.
2. **Mobile-native identity.** `src/acts/ActScrollStory/ActScrollStory.module.css` recalibrates both headline sizes to `clamp(3rem,17vw,7.2rem)` for narrow viewports, retaining the original serif hierarchy while ensuring both "GLWADYS" and "DALLEAU" stay within 320–390px.
3. **Warm editorial legibility.** The surname in the dark wood opening now settles on `var(--warm-taupe)` rather than dark `var(--rich-wine)`, whose poor dark-on-dark contrast made the second half of the signature almost disappear. Wine remains available as an identity accent on light pages; this does not change the color system.
4. **Cases readable when encountered.** `src/acts/ActWork/index.tsx` replaces a *single long dossier scrub* over three case rows with independent, short ScrollTrigger row handoffs, reaching full opacity at their entrance into the viewport. This avoids unreadable translucent body text throughout long mobile case-study scrolls, particularly on Bordeaux in Comptoir. Motion still uses GSAP transforms/opacity, with normal reduced-motion semantics. `src/acts/ActWork/ActWork.module.css` also improves the printed index/proof label opacity without changing the grid.

## Browser evidence (actual live Chromium, not fabricated)

- Screenshot baseline `docs/qa/film-gate/m-design-01.png`: the name is cropped beyond the mobile edge, tagline only partly visible. After: `docs/qa/film-gate/mobile320-hero-contrast-final.png`, `mobile390-hero-contrast-final.png`, `desktop1440-hero-contrast-final.png` show complete signature, balanced hero photography and legible text.
- Pixel geometry on actual browser at mobile 320 width, both scroll 0 and 200: first name bounds **[17,259] px**, surname **[71,303] px**, tagline **[20,282] px**; all inside the 320px viewport. Mobile 390 scroll 211: first **[16,312]**, surname **[89,374]**, tagline **[20,328]**; viewport width 390px.
- Cases measured by `qa/mentor-design-precision.mjs` at two phases per dossier on mobile 320 and mobile 390: 4 `[data-case-row]` blocks in each of Yuna, MGC, Comptoir render opacity 1 when onscreen; Comptoir body color `rgb(232, 222, 209)` on burgundy surface. Verified screen evidence `docs/qa/film-gate/mobile320-art-direction-comptoir.png`, `mobile390-art-direction-comptoir.png`.
- Desktop 1440, mobile 320, mobile 390, EN mobile 390, KO mobile 390: Playwright found **0 browser page errors** and `document.scrollWidth-innerWidth=0` for checked states. Motion recording forward/backwards `docs/qa/film-gate/hero-mobile-typography-film-final.webm`.
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check`: passed. Lint emitted one warning in preexisting, untracked `qa/mentor-contrast-probe.mjs`, not in source files.

## Jarvis mandatory skill use and continuation

The creative cold review task `t_bbf9d5c8` is pinned to `gpt-6-astra` / `openai-codex` and FORCE-LOADS `awwwards-godmode`, `editorial-art-direction`, `creative-director`, `award-design-scout`, `awwwards-motion-orchestrator`, `mobile-native`, `cinematic-qa`, `gsap-performance`. Read every skill's validation criteria; criticize the real page, source and screenshots; NEVER certify perfection by self-assessment. At ~19:53 Paris, Astra returned HTTP 429, with quota reset advertised ~21:13. Do not claim that the agent completed a review.

Next independent edit should tackle the biggest remaining cinematic discontinuity (Immersion → Process), preserving the already-proven shared film joins at commits `7197462`, `2a9909e`, and this design revision. The remaining true 10/10 gate also needs human visual approval, 9-act film proof, desktop/mobile Safari QA, reverse scrubs, real FPS & WebGL context cleanup, contrast, typography and photos.

**Never push to main, merge, or deploy publicly without the user's explicit authorization.** Preview branch GitHub pushes can generate Vercel previews.
