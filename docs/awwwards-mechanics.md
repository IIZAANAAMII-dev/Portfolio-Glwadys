# Motion Vocabulary

Derived from `docs/reference-research.md`. Per brief §8: **maximum 3 primary and 3 secondary
mechanics.** This constraint is the point — a small vocabulary reused with discipline is what
separates an authored site from a collection of effects.

**If a moment cannot be expressed in one of these six mechanics, the moment is wrong — not the
vocabulary.** Adding a seventh mechanic requires deleting one.

---

## PRIMARY — carry the narrative

### P1 · SHARED MEDIA TRANSFORM
> One element physically becomes the next thing. Nothing fades out and is replaced.

- **Refs**: 04 iN (morph/section transition), 11 Good is the New Cool
- **Tech**: `Flip.getState()` → mutate DOM → `Flip.from()`; scrubbed `clip-path: inset()`; `transform` on a shared node. Never `width`/`height`/`top`/`left`.
- **Used at**: Opening → Hero (the media reposition *is* the Hero assembling) · Hero → Story (portrait re-crops to 9:16) · Story → Phone (frame builds *around* the surviving Story) · Portal → WebGL and WebGL → DOM (frame-matched handoff) · Contact Sheet → Moodboard (Flip regroup) · Yuna → MGC (last Yuna media re-crops into an MGC photo) · MGC → Comptoir (one media goes fullscreen) · Nav → Contact CTA
- **Rule**: at every act boundary, name the element that survives. If nothing survives, it's a cut — and cuts must be deliberate and rare.
- **Non-negotiable**: the surviving element is the *same DOM node*, not a duplicate cross-fading with its twin. Ghost duplicates are how §7 gets violated.

### P2 · PINNED EDITORIAL STORYTELLING
> The stage holds still. The content inside it evolves.

- **Refs**: 05 BALANS KITCHEN, 09 Sperotto, 10 Humbert & Poyet
- **Tech**: `pin: true` on a wrapper, `scrub: 0.5`, one timeline with `addLabel()` phases. ScrollTrigger on the timeline, never on children.
- **Budget — 5 pins for the entire site.** A pin announces "something important begins" (§5).
  1. **Hero Shrink** — cover becomes an object in the page
  2. **Phone** — the longest pin; feed → post → story → campaign
  3. **Strategy** — horizontal track
  4. **Journey** — playhead fixed, years travel beneath it
  5. **Expertise** — kinetic type replacement
- **Rule**: no nested pins. No pin longer than ~400vh except the Phone. `pinSpacing` audited per pin.

### P3 · LOCAL CINEMATIC (the one WebGL episode)
> A bounded set piece with a hard mount and a hard dispose.

- **Refs**: 01 0110 Studio, 06 M-TRUST, 12 Composites.archi, 02 Michael R. Johnson (Z)
- **Tech**: dynamically imported local Canvas. Lifecycle: mount → play → converge → hand off to DOM → `dispose()` → unmount. GSAP owns the uniforms; the scene has no independent animation clock.
- **Used at**: Phone Portal only. Once. **Justification gate in `docs/storyboard.md` must be signed off before a line of it is written** (§55) — if a DOM transition achieves it, it doesn't get built.
- **Rule**: no Canvas exists before it or after it. Camera is Z-dominant with slight X/Y, minimal rotation, no orbit, no freecam.

---

## SECONDARY — texture and rhythm, never structure

### S1 · MASK / CROP REVEAL
- **Refs**: 05, 11 · **Tech**: `clip-path: inset()` scrubbed; `ease: none` when scroll-linked.
- **Why `inset()` and not `circle()`**: a rectangular crop reads as an *editorial decision* — a crop mark, a reframe. Circle wipes read as 2014. This is also the visual argument of the whole site: Glwadys decides what enters the frame.

### S2 · HORIZONTAL TRACK
- **Refs**: 05, 08 · **Tech**: `x: () => -(track.scrollWidth - innerWidth)`, **`ease: 'none'` mandatory**, `invalidateOnRefresh: true`.
- **Used at**: Strategy (primary), Contact Sheet (optional). Twice at most — a third would become a tic.

### S3 · KINETIC TYPOGRAPHY
- **Refs**: 03, 04, 10 · **Tech**: `SplitText` by line/word; reveal via `clip-path` or `y` under a mask; stagger 0.02–0.1s. Always `split.revert()` on cleanup.
- **Used at**: Expertise (a term pushes/masks out the previous), Hero headline, Journey year numerals.
- **Rule**: never letter-by-letter on body copy — only on display type. Text stays real, selectable DOM; never rendered into WebGL.

---

## Explicitly NOT in the vocabulary

Rejected on evidence, not taste. Each was available and each was declined:

| Excluded | Why |
|---|---|
| Fade-up-on-enter (`y: 40, opacity: 0`) | The legacy site's only move, used 13 times. It is the absence of a decision. |
| Glass / blur panels | Anti-slop list; 2-to-1 skill ruling; the legacy failure mode. |
| Circle/ellipse wipes | Dated; contradicts the crop metaphor. |
| Mouse-follow blobs, particles, floating spheres | Anti-slop list. |
| Refraction / glass shaders | OKCC's signature, not ours. |
| Character mascots | Wrong register (ref 07). |
| Scroll-jacked full-page snapping | Removes reader control. |
| Persistent global Canvas | Brief §2. |
| Draggable | Only if MGC genuinely earns it; a gadget otherwise. |
| Stretch/warp distortion of client imagery | Misrepresents a client's work. Crop-scale only. |

---

## Motion feel — one grammar

| Parameter | Value |
|---|---|
| Easing whitelist | `power2.out`, `power3.out`, `power4.inOut`, `expo.out`, `sine.inOut`, `none` (+ named `CustomEase`) |
| **Banned eases** | bounce, elastic, spring, `back` — any overshoot |
| Scrub | `0.5` default; `0.45–0.6` band; `none` for horizontal tracks |
| Major transition | 0.45–0.9 s |
| UI transition | 300–500 ms |
| Micro-interaction | 150–300 ms |
| Stagger | 0.05–0.1 s (0.02 for display chars) |
| Animated properties | `transform`, `opacity`, `clip-path` **only** |
| Engine ownership | one property, one engine — never two tweens on one property |
| Lenis | single instance, `lerp ≈ 0.08`, piped into `gsap.ticker`, `lagSmoothing(0)` |

Target feel: **fast, snappy, precise, cinematic.** Not floaty, not dreamy, not slow. Reveals are
short; major transitions are fluid but condensed.

---

## Pacing map (§38)

Intensity is the composition. Same intensity everywhere = no intensity anywhere.

```
OPENING     ████████░░  fast, assembling
HERO        ██████░░░░  iconic, still
SHRINK      █████████░  surprise
STORY       ████░░░░░░  narrowing
PHONE       ███████░░░  focused immersion
PORTAL      ██████████  peak
WEBGL       ██████████  peak — the only one
HANDOFF     ███░░░░░░░  release
CONTACT SH. ██████░░░░  craft, tactile
MOODBOARD   █████░░░░░  gathering
BRAND       ████░░░░░░  ordering
STRATEGY    ██████░░░░  lateral, systematic
YUNA        ███░░░░░░░  elegance, slow
MGC         ████████░░  energy, density
COMPTOIR    ██░░░░░░░░  silence  ← deliberate floor
JOURNEY     █████░░░░░  progression
EXPERTISE   ███████░░░  impact
CONTACT     ██░░░░░░░░  calm, inevitable
```

Two rules fall out of this: **Comptoir must be quieter than anything around it** (ref 10 licenses
this), and **nothing else may reach the Portal/WebGL peak** or the peak stops being one.

---

## The 12 questions, answered for our own site

The brief asks these of each reference (§8). Turned inward, they are the acceptance test for every
scene we build:

1. **Signature moment?** Phone Portal — crossing through the screen.
2. **What stays stable?** The phone during its pin; the playhead during Journey; the surviving media at every boundary.
3. **What moves?** Content *inside* stable frames. Rarely more than 3–5 elements at once.
4. **Scroll-linked?** All structural progression.
5. **Time-based?** Only Opening assembly, mouse parallax, and micro-interactions. Everything else answers to scroll.
6. **Where is the calm?** Hero (held), Yuna, Comptoir (the floor), Contact.
7. **Where is depth?** Layered crops and parallax in DOM; real Z once, in the local scene.
8. **How does the next scene arrive?** By transformation (P1). Never by fade.
9. **Typography's role?** Structure and hierarchy. Motion reinforces type; type never decorates motion.
10. **Mobile?** Authored separately (§45) — fewer media, no mouse parallax, shorter pins, simplified or DOM-substituted WebGL.
11. **Technology visible?** Never. No axis names, no "scroll to explore" as a technical instruction, no chapter numbering (§50).
12. **Does it still work static?** Every scene is screenshotted and must be presentable alone (§6, §59).
