# Storyboard — the whole film

Every beat declares the element that **survives** into the next beat. If nothing survives, it is a
cut, and cuts are rare and deliberate (§4, P1).

Scroll budget target: **≈13–15 screens**. The legacy build was 18.9 screens of mostly empty space;
this is denser and shorter.

Mechanic codes from `docs/awwwards-mechanics.md`: **P1** shared media transform · **P2** pinned
editorial storytelling · **P3** local cinematic · **S1** mask/crop · **S2** horizontal track ·
**S3** kinetic type.

---

## ACT I — OPENING · HERO

### Beat 01 · OPENING CREDITS
- **Visual** — `--ink`, grain. Centre-left, small: `GLWADYS DALLEAU` in mono, tracked wide. Beneath, one line: *Social Media · Content · Brand*. Bottom-left `MARSEILLE — FR`, bottom-right `2026`. Nothing else. It should look like the title card of a film, not a loading screen.
- **User action** — none. Autonomous, ~1.4s.
- **Motion** — hairline draws left→right (`scaleX`, `expo.out`). Mono letters arrive by word, stagger 0.03. Then `HERO_PORTRAIT_01` enters from the left, edge-cropped, occupying roughly a third; `PHONE_STORY_01` enters from the right, narrower, vertically offset. Both `power4.inOut`, overlapping by 0.15s so they feel choreographed rather than sequential.
- **Technique** — time-based GSAP timeline, no ScrollTrigger. `clamp`ed `gsap.quickTo` mouse parallax on desktop (±10px, media only, never type).
- **Feel** — curiosity. Restraint. *Someone is composing this in front of you.*
- **In** — page load. No loader, no percentage counter.
- **Out** → **the two media survive.** They do not fade.

### Beat 02 · HERO ASSEMBLES
- **Visual** — the two media *reposition* while `GLWADYS` / `DALLEAU` scale from mono-small to `--t-mega` Archivo condensed. Final composition, asymmetric:
  ```
  GLWADYS
        [ HERO_PORTRAIT_01 ]      JE TRANSFORME LES MARQUES
  DALLEAU                          EN HISTOIRES DONT
                                   ON SE SOUVIENT.
  SOCIAL / CONTENT / BRAND                    MARSEILLE — FR
  ```
  Portrait overlaps the counter of `DALLEAU`. Type over image. Deliberately *not* a centred name-above-image layout.
- **Motion** — P1: the same DOM nodes move; the name's `font-size`/`wdth` animate; portrait re-crops via `clip-path`. Second media slides to a smaller satellite position.
- **Technique** — continuation of the same timeline. Width-axis animation on the variable font.
- **Feel** — identity. This frame is the poster of the site and must be excellent frozen (§6).
- **Out** → the bottom nav capsule is **born** (ref 03): fades up + `scaleY` from the bottom edge. Everything else holds.

### Beat 03 · HERO SHRINK — *signature*
- **Visual** — the fullscreen cover contracts into an object sitting inside the page. Ground appears around it. Portrait re-crops tighter. Satellite media exits. Name relayouts to a smaller, denser lockup.
- **User action** — first scroll. **The reward for scrolling must be immediate** — no dead zone.
- **Motion** — P2, pin ~180vh, `scrub: 0.5`. Cover wrapper `scale` + `clip-path: inset()` inward. Not a soft mushy scrub: it lands.
- **Technique** — pin #1 of 5. Single timeline, labelled phases.
- **Feel** — surprise. *I am leaving the cover and entering the magazine.*
- **Out** → **the portrait survives.**

---

## ACT II — STORY · PHONE

### Beat 04 · HERO → STORY
- **Visual** — the portrait re-crops from landscape-ish to a **9:16 vertical**. Everything else leaves. A single vertical frame, alone, centred-left, on `--ink`.
- **Motion** — P1 + S1: `clip-path` animates the aspect; `object-position` shifts to hold the subject; scale up slightly.
- **Feel** — narrowing. Focus. The format itself signals *social*.
- **Out** → **the 9:16 frame survives and does not move again for the next beat.**

### Beat 05 · PHONE BIRTH — *signature*
- **Visual** — the frame stays exactly where it is. A bezel, buttons, speaker slot and a faint screen reflection **build around it**. The Story does not enter a phone; the phone *forms around the Story*.
- **Motion** — bezel `clip-path` grows outward from the frame edge; hardware details `scaleY`/`scaleX` in, stagger 0.06; reflection sweeps once.
- **Technique** — **DOM/CSS phone.** Justified: ref 11 achieves "3D UI elements purely with CSS"; and §16 prefers an excellent DOM phone to a poor GLB. Real content stays real DOM — accessible, selectable, crawlable, zero texture upload.
- **Feel** — recognition. A small delight: *oh — it was a phone all along.*
- **Out** → phone complete, pin begins.

### Beat 06 · PHONE — FEED
- **Visual** — inside the screen, a real feed scrolls. Outside the phone, in the left margin, quiet mono metadata and one short line of copy.
- **Motion** — P2, pin #2 (longest, ~400vh), `scrub: 0.5`. **The phone never moves.** Only the screen's inner content translates. This is the discipline that makes it read as a device rather than an image of one.
- **Feel** — immersion.

### Beat 07 · PHONE — POST → STORY/REEL → CAMPAIGN
- **Visual** — three beats inside the same pin: one post takes focus (siblings dim and scale down); vertical Story/Reel transition; then a campaign media **begins to exceed the bezel** — the first hint the frame won't hold.
- **Motion** — S1 crops inside the screen; the campaign media scales beyond `overflow` bounds at the exit of the phase.
- **Feel** — her work, shown working. This is where the visitor learns what she actually does.
- **Out** → phone rotates to perfectly frontal. Everything squares up.

### Beat 08 · PHONE PORTAL — *peak*
- **Visual** — screen grows. Bezel expands past the viewport edges and out of existence. The screen becomes `100vw × 100vh`. Then we cross it.
- **Motion** — scale + `clip-path` release; bezel `opacity`/`scale` out; the screen's media takes the full frame.
- **Feel** — the moment the site is remembered for.
- **Out** → **the fullscreen media survives** into whatever the next beat is (see the gate below).

---

## ⚠ GATE — WHY WEBGL? (§19, §55)

Required before any Canvas code is written.

**What the beat needs**: six or so media at different depths; a camera pushing through them along Z
with slight X/Y; depths converging back to a single plane; hand off to a DOM composition.

**Can DOM do it?** Largely, yes — and there is direct precedent: *Good is the New Cool* achieves
"3D UI elements purely with CSS, achieving depth without WebGL" (ref 11). CSS `perspective` +
`transform-style: preserve-3d` + `translateZ` gives real depth, real parallax and a real camera push,
with material advantages: the media stay `<img>` elements (accessible, indexable, no texture upload,
no disposal, no context loss), and it composites on the GPU with no extra bundle.

**What only WebGL gives**: per-pixel distortion at the instant of crossing the glass, velocity-driven
warp, and a shader dissolve on the handoff (ref 12's "feather" transition).

**Ruling — CSS 3D first.** The Portal and the depth sequence get built in CSS 3D and screenshotted.
WebGL is added **only if** the captures show the CSS version genuinely lacks the wow, and only as a
local, dynamically-imported scene with a hard dispose. The brief is explicit: *"Si une transition DOM
suffit : ne mets pas WebGL."* Committing to WebGL before seeing the CSS version would be deciding
with the budget instead of the eye.

**Provisional verdict: DOM/CSS 3D. Re-examined at Visual Gate 3, with the screenshots attached to the
decision.** Whatever wins, the beat is identical to the visitor — which is the tell that it should be
decided on merit.

---

### Beat 09 · THE CROSSING · depth sequence
- **Visual** — six media in depth: portrait near, Story mid, Reel far, campaign wide, a typographic plane, one secondary image. Scroll pushes through. Not a tunnel, not infinite, not 50 cards.
- **Motion** — camera push on Z, slight X/Y drift, almost no rotation.
- **Feel** — wow, then release.
- **Out** — **depths converge.** Z differences shrink to zero, everything arrives on one plane, matching a prepared DOM composition frame-for-frame. Then the 3D layer (whichever technology) is disposed and unmounted. **No canvas or 3D context exists after this beat.**

---

## ACT III — CREATIVE PROCESS

### Beat 10 · CONTACT SHEET — *the thesis*
- **Visual** — an editing table / contact sheet. Frames at genuinely different sizes and slight rotations, some overlapping, a few crossed out. Hairline grid beneath. Mono annotations in the margins — `SELECT`, `CROP`, `TONE` — only where they carry editorial meaning, never as decoration.
- **Motion** — deliberate return to flat 2D. Staggered reveal, S2 horizontal track optional on desktop.
- **Feel** — craft, tactility, judgement. *This is the actual work.* Answers the Big Idea directly.
- **Out** → **the frames survive.**

### Beat 11 · CONTACT SHEET → MOODBOARD
- **Visual** — the scattered frames gather and regroup. Palette swatches, a type specimen, tone-of-voice fragments and messaging lines appear among them.
- **Motion** — **GSAP Flip**: `Flip.getState()` → reorder the DOM → `Flip.from()`. The single most legible "chaos becomes intention" gesture available.
- **Feel** — a system emerging.

### Beat 12 · MOODBOARD → BRAND SYSTEM
- **Visual** — ground turns `--ivory`. Rotations go to zero, spacing becomes regular, images align to the grid, type becomes a scale rather than a collection of sizes.
- **Motion** — continuous Flip/tween of the same nodes; no new elements.
- **Feel** — order. Mastery. Visibly the BEHIND layer.

### Beat 13 · STRATEGY
- **Visual** — pinned horizontal track on `--ivory`. Large single words with one supporting line each: `AUDIENCE · POSITIONNEMENT · TON · CONTENU · PLANNING · CAMPAGNE`. Real content from `strategy.step1..4`.
- **Motion** — P2 pin #3 + S2, `ease: 'none'`, `invalidateOnRefresh: true`.
- **Feel** — lateral, systematic, calm competence.
- **Out** → one panel's media goes fullscreen → Yuna.

---

## ACT IV — WORK

### Beat 14 · YUNA BIJOUX
- **Visual** — jewellery. Very large images, macro detail, vertical content, fine type, deep negative space. `--ink` + champagne. Mono metadata: `BREST · SEP 2022 — JUL 2023 · ALTERNANCE`.
- **Motion** — S1 crop reveals only. **No 3D.** Restrained, ref 10 register.
- **Feel** — elegance. Do the beautiful thing before the complex thing.
- **Out** → **the last Yuna media survives** — changes crop, ratio, rotation and position, and becomes an MGC photograph.

### Beat 15 · MGC
- **Visual** — community energy. Paper texture, overlaps, small rotations, typographic fragments, density. `--ivory-deep` + `--clay`. Compact → expansion → overlap → recomposition.
- **Motion** — S1 + the OKCC angled parallax entry (ref 08). `Draggable` only if it genuinely earns it.
- **Feel** — energy, warmth, humanity. The deliberate opposite of Yuna.
- **Out** → one media goes fullscreen; palette warms toward cream/brown → Comptoir.

### Beat 16 · COMPTOIR — *the quiet floor*
- **Visual** — `--ivory` → `--espresso`. Very large images. Packaging, texture, product. Almost no motion.
- **Motion** — **exactly one** signature: a macro zoom, chosen after QA (§33). Not three.
- **Feel** — silence. Breathing. This beat exists to make the others louder.

---

## ACT V — JOURNEY · EXPERTISE · CONTACT

### Beat 17 · EDITING TIMELINE
- **Visual** — a fixed **playhead**; the years travel beneath it: `2021 2022 2023 2024 2025 2026` at `--t-mega`. As each meets the playhead, its media, role, skills and milestone resolve. Sperotto inverted (ref 09).
- **Motion** — P2 pin #4 + S3 on the numerals.
- **Content** — real only: IPAC · Yuna · Le Comptoir · MGC · freelance. **Merges About + Experience + Education + Journey** — the legacy build stated these three engagements four separate times. No repetition afterwards.
- **Feel** — progression, in her own professional language.

### Beat 18 · EXPERTISE — kinetic type
- **Visual** — no cards. One term active at `--t-display`; the next **pushes / masks / crops** it out. Small contextual media optional. The seven real services.
- **Motion** — P2 pin #5 + S3. `SplitText` by line, `clip-path` replacement.
- **Feel** — confidence, impact.

### Beat 19 · NAV BECOMES CTA — *loop closes*
- **Visual** — everything else goes quiet. The bottom capsule rises, stretches, its items recompose, and it unfolds into `GLWADYS DALLEAU / TRAVAILLONS ENSEMBLE`, then email + LinkedIn.
- **Motion** — P1 on the nav element itself — the same DOM node that was born in Beat 02.
- **Feel** — inevitability. The navigation *was* the invitation all along.
- **Content** — `glwadys.dalleau29@gmail.com` · `linkedin.com/in/glwadysdalleau` · Marseille, France & remote.

### Beat 20 · FOOTER
Very calm, barely animated, a clear ending. Locale switch, credit line, year.

---

## Media slot manifest

Rendered as designed editorial plates until real media lands (`media-source/README.md`).

| Slot ID | Ratio | Beats | Art direction |
|---|---|---|---|
| `HERO_PORTRAIT_01` | 4:5 → 9:16 | 01–05 | **The most important asset.** Must survive an aggressive re-crop to vertical: subject off-centre, generous headroom, calm background. |
| `PHONE_STORY_01..03` | 9:16 | 01, 06–09 | Real stories/reels she made. |
| `PHONE_FEED_01..09` | 1:1 / 4:5 | 06–07 | Feed tiles. Variety matters more than perfection. |
| `CAMPAIGN_WIDE_01` | 16:9 | 07–09 | Must survive going fullscreen. Highest resolution available. |
| `SHEET_01..24` | mixed | 10–12 | The contact sheet needs **volume**. Outtakes and near-misses are ideal — they make the selection read as real. |
| `YUNA_PRODUCT_MACRO_01..04` | mixed + macro | 14 | Jewellery, tight macro, fine detail. |
| `YUNA_STORY_01..02` | 9:16 | 14 | Vertical product content. |
| `MGC_EVENT_WIDE_01..08` | mostly 3:2 | 15 | Events, community, candid. Imperfect is better here. |
| `COMPTOIR_PRODUCT_01..04` | mixed | 16 | Packaging, texture. One at very high resolution for the macro zoom. |
| `JOURNEY_2021..2026` | 4:5 | 17 | One image per year. |
| `BEHIND_01..04` | mixed | 11–12 | Real moodboards, calendars, planning. Screenshots fine. **The BEHIND layer has no substitute — no stock image can stand in for her actual strategy work.** |

---

## Cut list — what the brief's journey does *not* include

Deliberate deletions from the legacy build, recorded so they don't creep back:

- "Selected Work" landing with three teaser cards → we enter Yuna directly (§28).
- Separate About section → folded into the Journey timeline.
- Separate Experience section → same.
- Separate Education section → one line inside the timeline.
- The FRONT/BEHIND toggle button → became structural instead of a control.
- Chapter index modal → the bottom nav is enough.
- Numbered section tags, axis labels, "phase" captions → §50.
