# Portfolio Glwadys — Flagship synthesis

## Direction lock: THE EDIT

The portfolio becomes a story about **the decision behind the image**. Glwadys is not presented as someone who merely produces attractive content; the site demonstrates how she selects, frames, edits and turns raw material into a brand story.

Emotional arc: **recognition → reveal → proof → invitation**.

## Keep
- dark warm palette, ivory and oxblood accents
- expressive display serif + restrained sans-serif
- strong quiet opening
- the persistent image handoff idea
- distinct Yuna / Marseille Girls Club / Le Comptoir contexts
- multilingual structure
- DOM-first content and reduced-motion path

## Kill
- global fixed WebGL canvas across unrelated acts
- flying-photo corridor and image planes that cross text
- generated still lifes presented as if they were client evidence
- excessive notebook props used simultaneously
- faux social chrome that does not prove a deliverable
- repeated y+opacity reveal language
- very long pinned passages
- mobile layouts that simply compress desktop

## Signature interaction
One exact artifact survives a transformation:
finished image → crop/contact sheet → oxblood edit mark selects a frame → planning annotation/grid registers → selected image becomes the Yuna cover.

The signature is the **edit mark**, not a generic portal.

## Implementation priorities
1. Mobile legibility: zero text/image collisions at 390x844.
2. Contact: completely unobscured name, statement, email, LinkedIn, availability.
3. Navigation: full-width-safe mobile UI; all five destinations reachable; active state correct.
4. Hero: full name readable; role/service descriptor visible immediately.
5. Process: one dominant image + readable method column; remove competing collage.
6. WebGL: scope to one short handoff only, desktop only; no persistent canvas afterwards.
7. Work: each case gets separate visual character and clear evidence/role/decision/outcome language. Existing generated assets must be labeled as direction studies where real deliverables are unavailable; never invent outcomes.
8. Motion grammar: Réserver / Tirer / Annoter / Caler / Transmettre. Remove generic reveal presets.
9. Pacing: max 3 pinned passages; no pin > 6vh-equivalents; reach contact within ~15 desktop viewport heights.
10. Technical: clean console, graceful no-WebGL, predictable reverse-scroll/resize/reduced-motion.

## Desktop target
- editorial, cinematic but calm
- hierarchy always stronger than effects
- one authored transition per chapter, not motion everywhere
- images never cover copy unless intentionally masked for <300ms and the content is still readable immediately before/after

## Mobile target
- separately composed vertical narrative
- no WebGL
- no horizontal process rail
- no clipped nav
- 12px side clearance minimum, 44px touch targets
- reserved safe-area under fixed navigation
- image/copy zones never overlap

## Hard acceptance gates
- 1440x900 and 390x844: hero, method, Yuna, contact have zero unintended intersections
- contact email fully visible and clickable
- mobile document scrollWidth <= viewport width
- all five nav destinations reachable on mobile
- reduced motion contains all content exactly once and no stuck pinned layout
- reverse/rapid scroll leaves no stale opacity/clip states
- no-WebGL still tells the complete story
- no console errors/warnings from production code
- build + lint + typecheck pass
- generated concept imagery is not represented as client output
- final cold jury must build the strongest REOPEN case first
