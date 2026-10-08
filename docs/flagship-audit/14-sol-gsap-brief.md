# 14 — SOL MAX / GSAP flagship pass

## Mission
Turn the current Glwadys portfolio into a genuinely authored Awwwards-level experience while preserving clarity, honesty, accessibility and mobile performance.

Single implementation writer only. Work in this isolated worktree. Do not touch main/original repo. No deploy/merge/publication. Do not self-PASS.

## Brain / tooling
- Builder model: GPT-6.1 Sol, reasoning=max, via ChatGPT subscription.
- Use GSAP deliberately. Add the `gsap` package if needed.
- Preferred GSAP modules: `ScrollTrigger`, `Flip`.
- Keep native document scrolling. Do NOT add Lenis unless a mentor later proves it is necessary.
- No global WebGL/canvas. No decorative 3D just to signal "Awwwards".

## 2026 reference principles
Current strong creative portfolios repeatedly use:
- one coherent motion grammar rather than generic reveal presets;
- ScrollTrigger for authored progression and reversible scroll-linked states;
- Flip/shared-element motion so one real visual element travels between states;
- strong still compositions first, motion second;
- mobile authored separately rather than desktop simply stacked;
- fewer, stronger signature moments instead of constant effects.

Apply principles, never copy a reference composition.

## Locked identity
THE EDIT = crop, select, annotate, register, transmit.
Warm dark editorial palette, ivory, oxblood, champagne.
Editorial serif + restrained sans.
No glassmorphism, neon, particle wallpaper, dashboard UI, infinite-marquee cliché, cyberpunk, or generic SaaS motion.

## P0 — THE EDIT must become the signature interaction
Current 3-step UI is structurally correct but still feels like a component.

Implement a believable continuous selection:
1. **Phone / finished image**
   - one Yuna source image in phone framing.
2. **Contact sheet**
   - build the proof sheet from existing Yuna study images;
   - the exact source frame from step 1 must remain visibly identifiable;
   - use GSAP Flip so the phone image physically releases from the phone state and lands as the selected sheet tile;
   - crop marks / registration marks draw in, not generic fade.
3. **Selected crop**
   - capture Flip state, isolate selected tile, animate it to become the full selected crop;
   - oxblood selection rule/crop handles move with it;
   - reverse must be coherent.

Then handoff to Yuna:
- use the existing browser View Transition or GSAP Flip handoff, whichever produces the cleanest shared-element continuity without a blank frame;
- source and target must visibly be the same image/crop family;
- land Yuna cover around 48px from top;
- clear temporary transition names/classes reliably;
- keyboard activation, rapid forward/reverse taps, reduced motion all work.

## P0 — Mobile 390×844 is a first-class composition
Audit and author each frame:
Hero, Edit 0/1/2, Yuna handoff, Work, Journey, Expertise, Contact.

Hard rules:
- exact scrollWidth = viewport at 320 and 390;
- no text/image/nav collision;
- >=24px visual clearance above fixed nav for meaningful controls/text;
- all touch targets >=44px;
- no content relies on hover;
- mobile-specific image crop/positioning;
- mobile-specific type line breaks;
- no horizontal carousels/rails unless they are clearly usable and necessary.

### Mobile Hero
- name/role immediately legible;
- stronger reservation/crop identity around image;
- GSAP entrance may draw/register the crop frame and title rhythm, but keep it fast and restrained;
- on scroll, use a reversible ScrollTrigger to “register” the hero image into THE EDIT language;
- no generic fade-up sequence.

### Mobile Edit
- all 3 states fit comfortably above nav;
- buttons thumb reachable;
- crop/registration marks remain readable;
- selected tile movement must be obvious even at 390px.

### Mobile Work
Differentiate cases without repeating same card:
- Yuna = still precision, crop, controlled image scale;
- MGC = contact-sheet/community assembly;
- Comptoir = tactile macro/material emphasis.
Use GSAP only if each motion expresses a different verb.

### Mobile Journey
- preserve vertical ledger;
- a single GSAP ScrollTrigger-driven playhead/rule may track the active year;
- no item-by-item fade parade;
- active year remains readable on touch.

### Mobile Expertise
- tactile rows;
- touch/focus state works without hover;
- restrained indentation/rule/type response;
- no accordion/dashboard vibe.

### Mobile Contact
- calm final frame;
- email is dominant;
- “Transmettre” motion: one rule/arrow movement on focus/tap/hover, no giant effect;
- footer and back-to-top always clear of nav.

## P1 — Desktop polish
Do not redesign from scratch.
Strengthen:
- Hero reservation/crop language;
- THE EDIT sequence;
- case differentiation;
- Journey playhead;
- Contact transmission payoff.

At 1440×900:
- no CTA hidden by fixed nav;
- hero/readability remains elegant;
- motion must reverse cleanly on scroll.

## GSAP architecture
Create a tiny reusable client-side motion layer, not a global animation framework.
- Register plugins once.
- Use scoped `gsap.context()` or React refs for cleanup.
- Use `gsap.matchMedia()` for desktop/mobile/reduced motion branches where appropriate.
- Kill ScrollTriggers on unmount.
- Avoid React state updates every animation frame.
- Prefer transforms/clip-path/opacity; avoid animating layout properties continuously.
- Preserve semantic DOM when JS is disabled.

## Reduced motion
When `prefers-reduced-motion: reduce`:
- no scrubbed movement;
- no Flip travel;
- all content visible;
- edit states switch instantly but remain understandable;
- handoff lands correctly.

## Engineering / QA
Before stopping:
- npm run typecheck
- npm run lint
- npm run build
- git diff --check
- optimized production server
- Playwright via Docker if host browser deps are missing

Capture:
Desktop 1440×900:
hero, edit0, edit1, edit2, handoff, work, journey, expertise, contact

Mobile 390×844:
same 9 states

Mobile 320×800:
hero, edit2, contact-bottom

Verify:
- console errors/warnings = 0
- failed requests = 0
- broken images = 0
- no canvas
- scrollWidth exact
- nav targets >=44px
- keyboard controls/handoff
- rapid forward/reverse Edit taps
- resize desktop↔mobile
- refresh mid-scroll
- reduced motion
- fr/en/ko HTTP 200 + correct lang
- no stale active nav state after settlement

Write:
- docs/flagship-audit/14-builder-results.md
- qa/sol14-*/ fresh evidence

STOP for mentor/Astra cold jury. Never self-PASS.
