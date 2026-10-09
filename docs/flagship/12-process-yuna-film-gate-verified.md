# Glwadys film — 02 Process → Yuna verified handoff

**Repository and scope:** `jarvis/glwadys-original-flagship` only, original `main` preserved. This is the third handoff corrected in the current film-continuity pass, after Work→Journey and Journey→Expertise (commit `7197462`).

## What was actually corrected

At the end of `ActProcess`, the same Yuna Bijoux proof image, editorial cover, and title are already built in the original GSAP timeline. The following `ActWork` Yuna project was moving into the viewport **before** its predecessor released the pinned shot. That made the identical image/title visible twice as stacked sections. A second issue left the Method/Campaign layers readable on top of the incoming Yuna image on mobile.

- `src/acts/ActWork/index.tsx`: added a ScrollTrigger ownership handoff only for Yuna. The actual project section is hidden until it reaches `top top`, then displayed; moving backward across the seam returns visual ownership to the departing pinned `ActProcess` shot. Other project sections are untouched; reduced-motion setting does not hide Yuna.
- `src/acts/ActProcess/index.tsx`: method/system layers fade out slightly earlier while the already-authored Yuna proof animates into its destination. Do not replace or reorder the original GSAP narrative.

## Reproducible QA and evidence

- Chromium Playwright desktop 1440×900 and mobile 390×844 forward scrolling across last 900px to the Yuna boundary; screenshots `docs/qa/film-gate/{desktop,mobile}-process-work-{toward-seam,join,at-start}.png`. The final outgoing Yuna frame and the new project first frame now occupy the same visual position, without two visible copies.
- FR 320×800, EN 390×844, KO 1440×900 plus FR 320×800 with reduced motion were exercised before, at and after boundary, then **in reverse**. At -1px the real Yuna project is hidden; at +1px it is visible. In reduced motion it remains visible throughout (normal document flow). **Zero browser page errors and zero document horizontal overflow** in these scenarios.
- `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`: PASS; ESLint reports 1 nonfatal warning in an untracked old QA helper, no source errors; FR/EN/KO all build as static pages.
- Direct browser recording of the actual mobile scroll forward and backward: `docs/qa/film-gate/process-to-yuna-mobile.webm`.

## Not equivalent to 10/10 yet

The other intro/social/phone/immersive scene links, WebGL cleanup, responsive typography, interaction FPS, iPhone Safari performance and a cold Awwwards jury still require critical inspection. These fixes form a verified film system, but the *entire nine-act portfolio* cannot be certified perfect from three repaired seams. Do not report a perfect score or merge to main without independent QA and user review.
