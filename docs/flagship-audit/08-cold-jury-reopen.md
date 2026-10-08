# 08 — Cold independent visual jury · REOPEN · 2026-10-08

## Evidence reviewed
Fresh Chromium rendering from the isolated worktree's rebuilt Next production output, served on localhost port 4352 (the older port 4350 was serving a pre-rebuild in-memory cache and MUST NOT be used as evidence).
- `qa/glwadys-new-mobile-hero.png` — 390×844
- `qa/glwadys-mobile-act-process.png`, `qa/glwadys-mobile-act-work-yuna.png`, `qa/glwadys-mobile-act-contact.png` — 390×844
- `qa/glwadys-desktop-new-act-opening.png`, `qa/glwadys-desktop-new-act-process.png`, `qa/glwadys-desktop-new-act-work-yuna.png`, `qa/glwadys-desktop-new-act-contact.png` — 1440×900
- Observed mobile document scrollWidth = 390, scrollHeight = 9625; contact email link exists and browser console reported no errors in focused contact test.

## Strongest case for REOPEN (against a premature 10/10)
1. **P0 — Missing actual project proof.** All visible case images are direction studies, not traceable client artifacts. Labeling is honest, but an Awwwards-level *real portfolio* cannot claim a full proof gate with only generated studies. Never invent deliverables, metrics, results, client approvals or campaign screenshots.
2. **P1 — Signature interaction is a three-step button carousel, not the promised short phone-to-edit handoff.** `EditMark.tsx` swaps between images after explicit button clicks. There is no phone frame/continuity, no authored crop-to-contact-sheet physical handoff, and no tested frame registration into the Yuna case cover. Source and rendered desktop process appear like a static split layout with a button.
3. **P1 — Visual specificity is not yet flagship.** Hero is composed and legible, but uses familiar Didone/oxblood luxury language; the Yuna/Marseille imagery is visually generic and the case studies lack the decisive real-world artifact that would make the creative choices tangible. Avoid adding gratuitous motion/props to conceal the absence of evidence.
4. **P1 — Settled browser evidence is incomplete.** Existing screenshots prove only four main checkpoints, not interaction steps, reverse/rapid scroll, reduced motion, keyboard, no-WebGL, refresh/resize, image/network failure, focus/contrast or performance. One immediate screenshot of contact showed a stale active Projets label; after 800ms it correctly settled to Contact, so do NOT classify this as a confirmed persistent nav bug. QA must wait for fonts and observer settlement.
5. **P2 — Mobile bottom nav and content proximity.** At 390×844 the fixed nav is readable and page width is exactly 390, but it occupies the bottom of visible body text at several checkpoints. Test actual text rectangles and reserve enough end-of-section space, including safe area. Targets need measured >=44px hit boxes, not merely readable labels.
6. **P2 — Navigation to tall cases and handoff context.** Browser `scrollIntoViewIfNeeded()` of `#act-work-yuna` can land partway through a tall case; validate anchor links land at the case's heading/cover with adequate offset, especially from the edit's final handoff CTA.

## What genuinely improved
- Mobile hero: full name and role immediately readable, no horizontal overflow.
- Desktop process: clear one-image / method-column hierarchy with all six decisions visible.
- Contact: clean image-free name, statement, email, LinkedIn and metadata on both sizes.
- Global WebGL and image-collision corridor removed; honest direction-study labels present.
- Five mobile nav labels visible, and Contact active state settled correctly in focused browser test.

## Verdict
**REOPEN — no user notification.** Engineering build alone is insufficient. One focused correction pass should address the actual phone-to-edit continuity, mobile nav/anchor clearance, and reproducible production browser gate without fabricating project proof. If authentic project deliverables are absent, report the hard evidence limitation and withhold final 10/10 acceptance.
