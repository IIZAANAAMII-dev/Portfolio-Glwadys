# Glwadys — Continuous Film Gate 01 (verified 2026-10-09)

## Creative premise / branch discipline

The original nine-act cinematic portfolio on `main` remains the authorial standard. Current work is on **`jarvis/glwadys-original-flagship` only**. This pass specifically eliminates two disconnected-section seams by making the **last frame of the departing pinned scene the exact first frame of the arriving scene**. It is not a claim of 10/10 or a completed Awwwards jury.

## Source edits (real code, not a Kanban status label)

1. `src/acts/ActJourney/JourneyOpeningFrame.tsx` — shared true opening for Journey and the final Work bridge shot: identical typography, playhead, first project cards and underlying image identities.
2. `src/acts/ActWork/WorkJourneyBridge.tsx` and CSS — final segment now unveils the actual Journey opening frame, not a stand-alone centered title; its track is aligned against the actual next scene's DOM geometry, with ScrollTrigger refresh for resizes.
3. `src/acts/ActJourney/index.tsx` and CSS — Journey enters over the Work bridge's departing pinned frame at the exact same scroll position using `margin-top:-100svh`; hidden root is revealed only when it legitimately owns the frame. Reduced-motion layout disables negative overlap.
4. `src/acts/ActExpertise/ExpertiseOpeningFrame.tsx` — one paper page markup and styling reused by Journey's departing frame and the real Expertise initial stage, including title, rows and supporting content.
5. `src/acts/ActExpertise/index.tsx` and CSS — Expertise overlays the concluding Journey frame instead of emerging from below as a second identical section; visibility switches at the actual pin boundary, honors reverse scrolling and reduced-motion fallback.

## Actual browser evidence (not simulated)

- Chromium Playwright on Jarvis-core, against live Next.js 16 local development server, at desktop 1440×900 and mobile 390×844, plus 320×800.
- `qa/mentor-shared-seam.mjs` and `qa/mentor-bridge-seam.mjs`: snapshots at 150px before, 10px before, 30px after, 220px after, settled for both seams in both screen classes; preserved in `docs/qa/film-gate/`.
- `qa/mentor-boundary-pixel.mjs`: at Work→Journey exactly scrollY=21544 desktop, clone and real first card measured **x=403.4 px** and each parent **y≈−0.1 px**, same transform. On mobile exactly scrollY=17892, clone and real first card measured **y=185.4 px**, same transform. The 70px drift after scrolling 30px is the *intended* next-stage rail progression, not a positional pop at the boundary.
- `qa/mentor-film-locale-gate.mjs`: FR 320×800, EN 390×844, KO 1440×900 and 320 reduced-motion; each navigated forward, backward, near ±1px from both seams, and returned to the boundary. **0 page errors, navigation remained visible, document width == viewport width** in these test cases.
- `npm run typecheck`, `npm run lint` (one warning in an untracked QA scratch script), `npm run build`, `git diff --check`: PASS. FR/EN/KO statically generated.
- Recorded Chromium forward/reverse scrub video files verified on host: `docs/qa/film-gate/work-to-journey-mobile.webm` (1.6 MB) and `docs/qa/film-gate/journey-to-expertise-desktop.webm` (1.5 MB). These are inspection evidence, not a substitute for a full performance benchmark.

## Still blocking an honest '10/10' judgment

The **full film is NOT yet perfected**. Full nine-act reel, other transitions (opening/social, phone/WebGL, process/Yuna case studies, separate project handoffs and final contact), reverse scroll under touch inertia, real iPhone Safari, custom cursor, WebGL context churn/resizing, frame rate, media loading, language-specific typography, reduced-motion accessibility and visual review by a cold independent critic all remain to be tested/improved. No main changes, no production deploy. User must see and approve a preview.

## Next Jarvis mentoring focus

Read `docs/flagship/08-main-motion-master-reference.md`. Pick the highest visible interruption after those two verified seams; fix real source, prove first and last frames identical at transition, capture forward/reverse mobile/desktop video, run typecheck/lint/build and a cold jury. Never certify 10/10 based on model self-report.
