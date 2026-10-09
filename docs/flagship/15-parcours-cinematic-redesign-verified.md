# Parcours — six cinematic chapters, verified redesign (2026-10-09)

## Why the original layout failed
The original Journey rail showed two partly cut cards at once on mobile, huge headlines cropped on desktop and no obvious relationship between years. The user said the story was incomprehensible and explicitly authorized a **substantial design change** to reach an Awwwards-level film.

## Source changes on the one correct original worktree
- `src/content/index.ts`: six *factual* stages retain all original years, labels and places. FR/EN/KO gain localized narrative chapter terms and one connecting statement. No biographical achievements were fabricated.
- `JourneyOpeningFrame.tsx`: a shared visual editorial story spine (introductory statement, six readable chapters, active step and accessible DOM), plus a short chapter tag inside each image frame. The same component is still reused by Work’s last frame and Journey’s first frame.
- `ActJourney.module.css`: desktop gains an opaque espresso-colored film matte on the left, with readable typography and an antique-gold chapter marker; images pass *behind* it, preserving the original GSAP horizontal choreography. Typography and contact-sheet sizes have been recalibrated. Mobile gains larger portraits and one 64svh editorial page at a time, instead of an accidentally cropped vertical carousel.
- `ActJourney/index.tsx`: each mobile page is an **opaque film frame**; the next image reveals itself over the departing image through a reversible clip mask. Full text is held for most of each beat and leaves during the short paper wipe rather than displaying two truncated fragments. The chapter name remains visible throughout. Desktop retains the native scroll-driven rail. Accessible `aria-current=step` follows the director's active chapter.
- `src/lib/motion.ts`: the chapter-specific scroll budget has been extended from 280vh to 390vh (mobile applies the site's native 0.7 ratio), offering time to read six beats instead of fast-forwarding every card.
- `WorkJourneyBridge.tsx`: the preexisting shared first frame is kept in sync with the new mobile one-page director, so the prior Work→Journey handoff does not restart abruptly.

## Evidence, not a self-awarded score
- Chromium live browser screenshots, in `docs/qa/film-gate/`: `mobile-journey-redesign-{1..5}.png`, `small-journey-redesign-{1..5}.png`, `desktop-journey-redesign-{1..5}.png`. Earlier baseline in `desktop-parcours-baseline-*.png` and `mobile-parcours-baseline-*.png`.
- Real forward-and-reverse scroll recordings: `parcours-redesign-mobile-forward-reverse.webm` (390×844) and `parcours-redesign-desktop-forward-reverse.webm` (1440×900). Both recorded against the actual Next dev server, not generated animations.
- Browser QA on FR desktop 1440×900, FR mobile 390×844, FR small mobile 320×800, EN and KO mobile 390×844 and FR reduced-motion 390×844; **zero page errors** and no document horizontal overflow in checked states. Reduced-motion renders the full chronology in normal document flow.
- At the Work→Journey boundary on mobile, `qa/mentor-boundary-pixel.mjs` measured exactly **x=20px** and **y=185.4px** for both the departing film and the incoming real first stage. Desktop alignment at the seam is within approximately 2px.
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` PASS. The one lint warning is in an unrelated preexisting untracked QA scratch script.

## What's still not perfect
This is a real, significant visual overhaul of a previously confusing act, **not proof of a 10/10 Awwwards portfolio**. Immersion→Process, the other act handoffs, real iPhone Safari and hardware motion performance, WebGL lifecycle and independent art direction jury remain. Jarvis Astra skill missions have been explicitly updated with the user's permission to redesign compositions while preserving the original film DNA; they are not reported done until running and providing real evidence.

All changes must remain on `jarvis/glwadys-original-flagship`; never merge or publish `main` without approval.
