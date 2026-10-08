# V2 correction brief

Keep original design and fix the mobile navigation overlap.
Read 00-original-first-mission.md, 01-preservation-map.md and 02-build-and-visual-review.md before editing. Work only in jarvis/glwadys-original-flagship, preserving all nine original acts and their media. No changes to main or the alternative rebuild.

## Critical fixes

1. Mobile: the floating FR+ language control visually overlaps the CAMPAGNE rail step in the phone sequence at 390x844 and 320x800. Measure bounding boxes across all four phone beats and move it without hiding any of the five nav links or reducing touch targets.
2. WebGL: after a desktop-to-mobile-to-desktop resize, a hidden Canvas remains mounted at Contact. Verify cleanup and resource disposal after six cycles of depth-to-process, reverse scroll, resize and Contact. Wait for textures to load before interpreting GPU counts.
3. Browser evidence: capture every act and intermediate animation at 1440x900, 390x844 and 320x800 AFTER the latest code edits, plus actual V2 scroll recordings on desktop and mobile. Historical videos cannot be used as V2 evidence.
4. Languages: rerun FR, EN and KO with a stable server; the previous QA lost the server during EN, causing connection-refused errors and broken images that are not yet attributable to the site.

## Art direction and navigation

5. The Work/Yuna/MGC screenshots still show ACCUEIL active and ACT 05 / LE PROCESSUS in the navigation. Fix the active section observer so the correct five destinations and nine act labels track real scroll position, including reverse and rapid scroll.
6. Increase contrast during the Behind transition; the current desktop screenshot 03 has low-contrast text over ivory. Preserve the image montage and typography, but make every intermediate state legible.
7. Verify exact Yuna crop continuity from process selection to Work, or explicitly label a deliberate aspect-ratio adaptation. Never claim the same frame if the source image changes.
8. Review the 320px composition and Contact email touch area; preserve the original spectacular GSAP opening, phone montage, WebGL depth on desktop, DOM depth on mobile and nine-act story. Do not replace it with a generic portfolio.

## Validation

Run typecheck, lint, build, diff check, scroll/reverse/resize, no WebGL fallback, reduced motion, keyboard, five mobile navigation links, FR/EN/KO, and video/screenshot evidence. Correct the QA assertion that wrongly requires no Canvas during reverse-campaign, where the portal legitimately owns the stage. Write 05-v2-builder-results.md with honest limitations and stop for independent Astra review. No self-awarded 10/10, no merge or public deployment.
