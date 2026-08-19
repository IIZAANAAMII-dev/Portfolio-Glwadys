# Creative Direction

Single source of truth for the rebuild. Where this document and a skill file disagree, this document
wins. Where this document and the brief disagree, the brief wins.

---

## BIG IDEA

> **She decides what enters the frame.**

Glwadys's job is not "posting". It is selection, cropping, sequencing and timing — choosing what an
audience sees, in what order, for how long. That is the same skill set as editing a magazine or
cutting a film.

So the site is not a portfolio *containing* images. **The site performs her craft.** Frames crop and
re-crop. Media is selected, reframed, rejected, regrouped. One image becomes another because someone
*decided* it should. The visitor never reads a claim about her editorial judgement — they spend three
minutes inside it.

This is why the mechanic vocabulary is built on **crop** (`clip-path: inset()`) and **shared media
transform** rather than on fades and slides. The motion grammar *is* the argument.

Two consequences:
- The FRONT / BEHIND idea inherited from the legacy build stops being a floating toggle button and
  becomes structural: the polished result, and the system underneath it.
- The Contact Sheet is the thesis statement of the whole site, not a gallery.

---

## VISUAL LANGUAGE

**Register**: fashion editorial · digital magazine · contemporary · confident · restrained.

Not: cyberpunk, crypto, purple AI, SaaS bento, glassmorphism, blobs, particles, tech demo.

- **Asymmetry always.** No centred hero blocks except where stillness is the point.
- **Type on image, overlapping.** The cheapest, strongest editorial move (ref 10) and it costs nothing.
- **Hairlines, not boxes.** Structure is expressed with 1px rules and alignment, never with cards or borders around content.
- **Micro-metadata as texture.** Tiny mono labels in the margins — location, year, discipline. They make a page feel *printed*.
- **Big negative space, then density.** Comptoir breathes; MGC crowds. The contrast is the composition.
- **One accent, used rarely.** Champagne earns its impact by near-absence.

---

## COLOUR — one reconciled token set

The three project skills and the legacy config specified four different palettes. This is the only
one now.

```css
/* Grounds */
--ink:            #0B0B0C;  /* primary dark ground */
--ink-raised:     #131316;  /* rare, for genuine elevation only */
--ivory:          #F4F1EA;  /* light chapters: Brand, Strategy, Comptoir */
--ivory-deep:     #E7E1D5;  /* light secondary, paper edge */

/* Ink on grounds */
--on-ink:         #F7F6F4;
--on-ink-muted:   #8B8B93;
--on-ivory:       #14120F;
--on-ivory-muted: #6A655C;

/* Accents */
--champagne:      #D9C6A3;  /* THE accent. Used sparingly. */
--champagne-deep: #A38F6E;
--espresso:       #1E1812;  /* warm dark — Comptoir */
--clay:           #A85D4C;  /* MGC only */
```

**Reconciliation log** — for anyone comparing against the skill files:

| Role | `glwadys-awwwards` | legacy config | **Chosen** | Reason |
|---|---|---|---|---|
| Ground | `#0B0B0B` | `#0B0C0E` | `#0B0B0C` | neutral; the legacy value skewed blue, which cheapens warm ivory |
| Ivory | `#F7F2EA` | `#F5F3EF` | `#F4F1EA` | warmer than legacy, less yellow than skill |
| Champagne | `#DDCBA8` | `#D8C29D` | `#D9C6A3` | midpoint; holds AA on `--ink` at display sizes |
| Espresso | `#1E1812` | `#7D4F39` | `#1E1812` | skill value; the legacy brown is a *chapter tint*, not a base |
| Accent | `#A85D4C` | `#D66853` / `#E27D60` | `#A85D4C` | muted clay is editorial; the legacy corals read Instagram-2018 |

**Deleted**: `background.card #181A1E` and `accent.coral #E27D60` — both existed only to fill glass
cards. `--ink-raised` replaces the former and is expected to be used almost never.

**Rules**
- No gradient is ever a background. Gradients only as a scrim under text over an image.
- Chapter tint is carried by **ground + one accent**, never by recolouring photography.
- Grain sits above everything except UI.

### Chapter grounds

| Chapter | Ground | Accent |
|---|---|---|
| Opening · Hero · Story · Phone · Portal | `--ink` | `--champagne` |
| Contact Sheet · Moodboard | `--ink` | `--champagne` |
| Brand · Strategy | `--ivory` | `--on-ivory` + hairlines |
| Yuna | `--ink` | `--champagne` |
| MGC | `--ivory-deep` | `--clay` |
| Comptoir | `--ivory` → `--espresso` | `--champagne-deep` |
| Journey · Expertise · Contact | `--ink` | `--champagne` |

Note the alternation: dark → light → dark → light → dark. Ground changes are themselves a pacing
device.

---

## TYPOGRAPHY

**The legacy pairing is replaced.** Playfair Display + Plus Jakarta Sans is the single strongest
"template" signal in the old build — Playfair is the most over-used editorial serif on the web, and
Plus Jakarta reads as SaaS. Both go.

| Role | Face | Why |
|---|---|---|
| **Display** | **Archivo** (variable: `wght 100–900`, `wdth 62–125`) | Grotesque with newspaper/magazine heritage. The **width axis** is the reason — condensing to ~75 lets `GLWADYS DALLEAU` fill a line at poster scale without collapsing. This is what makes a magazine cover feel like a cover. |
| **Editorial** | **Instrument Serif** (roman + italic) | High-contrast display serif, genuinely contemporary rather than heritage-luxury. Italic is exquisite at large sizes for pull-fragments. Used for *fragments only* — never body copy, never headings. |
| **Mono** | **JetBrains Mono** | Metadata, years, captions, coordinates. Kept from legacy: the role was right. |
| **Hangul** | **Noto Sans KR** | Required for `/ko`. |

All four load via `next/font/google` — self-hosted at build, no render-blocking CDN round-trip, no
CLS. The legacy `<link>` to `fonts.googleapis.com` was a real perf regression and is removed.

### Scale (fluid `clamp()`)

| Token | Size | Use |
|---|---|---|
| `--t-mega` | `clamp(4rem, 17vw, 20rem)` | Hero name, Journey years |
| `--t-display` | `clamp(2.5rem, 9vw, 9rem)` | Act words, Expertise terms |
| `--t-head` | `clamp(1.75rem, 4.5vw, 4rem)` | Headline, project titles |
| `--t-lead` | `clamp(1.05rem, 1.7vw, 1.5rem)` | Lead paragraphs |
| `--t-body` | `clamp(0.95rem, 1.05vw, 1.0625rem)` | Body |
| `--t-meta` | `0.6875rem` | Mono labels, `0.14em` tracking, uppercase |

**Rules**
- Display type gets negative tracking (`-0.03em` to `-0.045em`). Untracked giant grotesque looks unfinished.
- Mono gets positive tracking (`0.14em`) and uppercase. Always.
- Body copy max measure `62ch`.
- Exactly one `--t-mega` element on screen at a time.
- Never mix Instrument Serif and Archivo inside one line except as a deliberate, rare fragment.

---

## MATERIALS · GRAIN · IMAGE TREATMENT

- **Grain**: inherited SVG `feTurbulence` (`baseFrequency 0.8`, `numOctaves 3`). Opacity `0.03` on dark, `0.02` on ivory — it must be felt, not seen. Fixed overlay, `pointer-events: none`, above content, below UI.
- **Paper**: MGC only, one subtle paper texture behind the scrapbook. Nowhere else.
- **Images**: no filters, no duotone, no forced desaturation. Glwadys's work is the product; recolouring it would misrepresent it. Treatment comes from **crop, scale and juxtaposition** only.
- **Corners**: square. `border-radius` is permitted in exactly two places — the phone bezel, and the nav capsule. Everywhere else, `0`.
- **Shadows**: none, except the phone. Depth comes from overlap and scale.

---

## LAYOUT LANGUAGE

- 12-column grid, `clamp(1.25rem, 4vw, 5rem)` gutters, full-bleed permitted.
- Consistent baseline rhythm via a `--space` scale (4px base): `4 8 12 16 24 32 48 64 96 128 192`.
- Media slots declare an aspect ratio and never cause layout shift.
- Text may overlap media. Media may bleed off any edge. Nothing is boxed.

### Layer system (§43) — no ad-hoc z-index

```css
--z-ground:     0;   /* chapter backgrounds */
--z-media:     10;   /* images, video, phone */
--z-narrative: 20;   /* type, metadata */
--z-overlay:   30;   /* scrims, chapter transitions */
--z-grain:     40;   /* grain */
--z-nav:       50;   /* bottom nav capsule */
--z-modal:     60;
--z-cursor:    70;
```

Seven names. Any raw numeric `z-index` in a component is a bug. The legacy `z-[999]` grain plus
scattered `z-10`/`z-40` is exactly what this replaces.

---

## MOTION LANGUAGE

Defined in `docs/awwwards-mechanics.md`. Summary: **3 primary** (Shared Media Transform · Pinned
Editorial Storytelling · Local Cinematic) and **3 secondary** (Mask/Crop Reveal · Horizontal Track ·
Kinetic Typography). Six total, no exceptions. Feel: fast, snappy, precise, cinematic.

## 3D RULES

1. No global Canvas. Ever.
2. One local scene maximum, at the Phone Portal, dynamically imported.
3. It must pass the WHY WEBGL gate in `docs/storyboard.md` before being written. If a DOM transition achieves it, it is not built.
4. Lifecycle: mount → play → converge → hand off to DOM → `dispose()` → unmount. Nothing survives.
5. Z-dominant camera, slight X/Y, minimal rotation. No orbit, no freecam.
6. Media planes only. No blobs, spheres, cubes, particles, bloom, heavy DOF.
7. GSAP owns every uniform. The scene has no independent clock.
8. SAFE tier must never import Three to render the page.

## NAVIGATION

A small **bottom-centre capsule**, not a top navbar. Born when the Hero finishes assembling (ref 03),
persists, and at the end unfolds into the contact CTA — so navigation becomes the call to action and
the film closes its loop.

Items: `GD · WORK · JOURNEY · EXPERTISE · CONTACT` + `FR / EN / KO`.
Hidden during the Opening. Thumb-reachable on mobile. Real `<nav>`, real focus states, keyboard
operable.

## PACING

See the intensity map in `docs/awwwards-mechanics.md`. Two hard rules: **Comptoir is the quiet
floor**, and **nothing except Portal/WebGL reaches peak**.

## SIGNATURE MOMENTS

Five things a visitor could describe afterwards:

1. **Hero Shrink** — the magazine cover becomes an object inside the magazine.
2. **Phone Birth** — the Story exists first; the phone assembles *around* it.
3. **Phone Portal** — the screen becomes the viewport and we pass through it.
4. **Contact Sheet → Moodboard** — a scatter of frames gathers itself into a system.
5. **Nav becomes CTA** — the capsule that has accompanied you unfolds into the invitation.

If a visitor can describe three of these, the site worked.

## MOBILE DIRECTION

Authored, not compressed (§45).

- Opening: fewer media, no mouse parallax.
- Hero: recomposed vertically — name stacked, portrait full-bleed, metadata to the base.
- Hero Shrink: shorter, less travel.
- Phone: shorter pin; **the phone becomes nearly the whole viewport**, which is more honest on a phone than a phone-in-a-phone.
- Portal/WebGL: MEDIUM simplifies; SAFE substitutes a DOM crop transition.
- Contact Sheet: 2-up, vertical, no horizontal track.
- MGC: less overlap, more sequence.
- Journey: playhead becomes horizontal at the top, years pass beneath.
- Nav: thumb zone, 44×44px minimum targets.

## ACCESSIBILITY

`prefers-reduced-motion` is a first-class tier, not an afterthought: Lenis off, pins simplified or
released, no parallax, WebGL replaced by its static final frame, all content reachable. Semantic
headings, real landmarks, visible focus, keyboard-operable nav. Text lives in the DOM — never in
WebGL.

## VOCABULARY BAN (§50)

Never shown to a visitor: `AXE X/Y/Z`, `CAMERA DIVE`, `WEBGL`, `SCROLLTRIGGER`, `TRANSITION`,
`STACKING SPATIAL`, `PROGRESSION 3D`, `PHASE X`, chapter numbering (`03 /`, `04 /`), and
`SCROLL TO EXPLORE` phrased as an instruction.

The legacy build printed `STACKING SPATIAL AXE Y / Z` and `AXE X : FLUX HORIZONTAL` directly to
visitors. Labels describe *content* — a year, a client, a city, a discipline — or they don't exist.
