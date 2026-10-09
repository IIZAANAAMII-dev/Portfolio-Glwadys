# 23 — Cinematic luxury creative treatment (Sonnet 5.5 → Opus 5.5)

Role: art direction + script. No src touched. Based on mentor captures, docs 22/23-luxury, and one read of the source tree (ActScrollStory T-partition, five act folders, public/media/generated/*). No browser was used; every motion claim below is a *design intent*, not verified behaviour.

## 1. Diagnosis (5 lines)
1. One palette (ivory/paper/wine) from first to last frame: nothing is ever dark, saturated, or loud, so nothing can be a climax.
2. Each act restarts on its own "card on a blank wall" (centered print, big empty ground); the film is nine slides with transitions, not one continuous object.
3. Type and image never collide: huge numerals and Didone mastheads sit beside the photo, while real titles (Digital Marketing) are pale, clipped, secondary.
4. Contact ends as stationery: a conventional paper-and-card layout that any boutique could own; no payoff for the journey that precedes it.
5. Mobile is the desktop poster scaled down, with chrome (nav + FR) competing with content and tiny cropped media.

## 2. Three worlds
A. **The Contact Sheet Becomes the Film** — a darkroom/screening-room world: the portrait is a strip of film frames; scrolling "develops" one frame into full-bleed cinema, then prints it on paper.
B. **The Pantograph Atelier** — a mechanical drawing arm traces the portrait's outline; whatever it traces becomes the next act's content (a drawing machine as narrator).
C. **The Maison Lookbook** — a bound couture book: page turns, tipped-in prints, ribbon marker, chapter dividers in fabric colors.

**Chosen: A, with one guest appearance each of C (the book page-turn) and B (a pantograph line) as seams.**
Reason: the repo already owns a hero portrait, social campaign photos, a contact-sheet asset (`process/contact-sheet-editorial-v2.jpg`), a phone sequence, and a Yuna case: A is the only world where *all* existing media is the same material (frames of one film) and where dark → light → dark alternation is motivated (projection room vs. paper table). B alone is a gimmick over weak content; C alone repeats the beige problem.

## 3. Storyboard — "Développer" (six scenes mapped onto the existing nine acts)

Invariant: ONE persistent anchor element, the **hero frame** (`editorial/hero-vertical.jpg`). It is the same DOM node (or its clone with identical `getBoundingClientRect` at each handoff) from scene 1 to scene 5. Scenes change what *surrounds* it.

**Scene 1 — Black Room (ActScrollStory, T.heroHold→socialIn)**
- Start: pure `#0b0908` screen, a single 1px champagne line (the pantograph trace) draws across at 62% height, then a thin vertical film frame (aspect 2:3, ~28vw / 62vw mobile) is revealed by a clip-path inset(50% 0) → inset(0) expanding from the line.
- End: frame centered, hero portrait inside, name set in the Didone at ~14vw overlapping the frame edge with `mix-blend-mode: difference` against the dark ground (type crosses image, not beside it).
- Motion: line draw (scaleX 0→1, 0.9s, expo.out), clip-path unfold, name letters by line-mask rise. Then STILLNESS: 0.42 vh hold.
- Point: she is revealed, not presented.

**Scene 2 — Full Bleed (social "Ce que l'on voit")**
- Start: frame at centre. End: the same frame scales to `inset(0)` full viewport (clip-path on the container, `scale` on the image only, never both on the same node), image drifting 4% up. The ivory ground never appears; the social photos (`social-campaign`, `social-reel`, `social-community`) are stacked as *follow-up frames in the same viewport*, each entering as a clip-path wipe from bottom (`inset(100% 0 0 0)→inset(0)`), 3 frames max, held ~0.6 vh each.
- Point: social = her work is living images, full-bleed, in the dark.
- Remove the marginal handwriting; caption in one 12px micro line at bottom-left.

**Scene 3 — Phone as Projector (phone/immersion, T.phoneIn→transfer)**
- Start: last social frame shrinks into the existing phone screen (existing `phoneSequence` is the engine). End: phone screen goes full-bleed (existing T.screenFull). Palette inverts here to **wine `#592027` room with champagne light**: the first saturated beat.
- On mobile: no phone mock; the frame becomes a 9:16 viewport-sized reel with a 3-line caption. Same beats, shorter pins.
- Point: the content lives where the audience lives.

**Scene 4 — The Page Turn (ActProcess → ActWork bridge)** — signature effect: BOOK
- Start: full-bleed screen. End: the screen "falls" to a paper ivory book spread; the frame becomes a tipped-in print on the right page, process text on the left (merge the repeated "Behind" and "Notebook" copies into ONE method page; delete the duplicates).
- Motion: the right page rotates `rotateY(0→-170deg)` around its left edge, `transform-origin: left center`, `perspective: 1800px`, `backface-visibility: hidden`; a gradient shadow sweeps over it (opacity 0→0.5→0). 1.4s scrub, power2.inOut. This is the one light, paper scene and the resting point.
- Point: strategy is a considered, tangible act; the film becomes archive.

**Scene 5 — The Vault (ActWork / Yuna)**
- Start: print on the page. End: Yuna case full-bleed on near-black `#14100d`; the print is the key: the page `clip-path: circle()` → hole expands from the print center revealing the case (`yuna-campaign-v2`), then product/macro/social frames hang as a 3-frame horizontal strip (contact sheet) that the viewer pulls with scroll (x translate, one pin).
- Point: proof. Real project, opened like a vault with the same anchor.

**Scene 6 — Colophon (ActJourney → Expertise → Contact, collapsed into one reverse sequence)**
- Journey (chronology) runs on dark with champagne type; Expertise becomes a **single list of six lines at 9vw type**, each line a hover/scroll focus state (opacity .25→1), the numeral small beside it; fixes "06 huge / title clipped".
- Contact: the *hero frame returns*, now smaller, at bottom center of a black screen, as the "last frame of the reel". The email is typeset huge across it, pantograph line draws underline. No card. Contact = end credits.
- Point: closing the film on the portrait where it began.

**Signature effects (4 max):** (1) pantograph line + clip-path unfold, (2) frame → full-bleed → phone shared-element, (3) book page-turn, (4) vault circle-reveal. Resting moments: Scene 1 hold, Scene 4 page, Scene 6 credits.

## 4. Art direction constraints
- **Palette alternation:** ink `#0b0908` (S1,S2) → wine `#592027` (S3) → ivory `#f3ede3` (S4) → near-black warm `#14100d` (S5) → ink (S6). Champagne `#d0ad72` is the only accent; never more than two brand colors on screen. Never two ivory scenes adjacent.
- **Type:** Didone display at 12–16vw only in S1/S6 (2 appearances); elsewhere display 7–9vw. Body 15–17px, max 52ch. Micro 11–12px caps tracking .14em. Title must always have higher contrast than any numeral (numerals ≤ 30% opacity or small).
- **Crop ratios:** hero 2:3; social full-bleed (cover, object-position authored per frame); strips 4:5; book spread 3:2.
- **Density:** one primary image + one line of type per viewport; max 3 simultaneous elements. Never layered translucent image stacks (user rejected).
- **Mobile 390/320:** all scenes are 100svh; no side-by-side; type 17–22vw max for name, 10vw for list; bottom nav hides during scenes 1–3 and 6 (fade out after first scroll, return on scroll-up); FR/locale switch moves to top-right micro, never bottom. No WebGL required: scenes 1–6 are DOM + clip-path + transforms. Pins ≤ 4 viewports each.
- **Reduced motion:** each scene is a static stacked layout with the same order, palette bands and one image each.

## 5. Code priority for Opus
1. **`src/acts/ActScrollStory/` (index.tsx + .module.css)** — 1332 lines, owns scenes 1–3. Rework the opening and social phases using the T partition (heroHold/socialIn/phoneIn/transfer/screenFull). Selectors available: `[data-archive-plate="handoff"]`, `[data-notebook-frame="story"]` (+`-image`, `-paper`, `-folio`), `[data-social-slot]`, `[data-phone-button]`, `[data-phone-note]`, `.line-mask`. Delete the depth-plate layering (`[data-depth-plate]`) and the "handoff" archive plate that causes the paper-card look; make the hero image the persistent anchor.
2. **`src/acts/ActProcess/` + `src/acts/ActWork/` (WorkJourneyBridge)** — scenes 4–5: the page-turn bridge and the vault reveal; merge duplicate Behind/Notebook content (`NotebookFrame` in `src/ui`). Then (phase 2) `ActContact` for credits and `ActExpertise` for the list.

**Director timeline ownership:** one `gsap.timeline({ scrollTrigger: { trigger: root, pin: true, scrub: SCRUB } })` per scene, built in `ActScrollStory` for scenes 1–3 and in `ActProcess` for 4; each scene timeline ends with the anchor in a *recorded geometry* (`Flip.getState` or `getBoundingClientRect` stored in a ref) which the next scene's `fromTo` consumes. Only one owner (`ScrollTrigger.create` with `invalidateOnRefresh: true`) may write transforms to the anchor at a time; others `gsap.set` only on enter/leave. Use `gsap.matchMedia` with `MQ` for mobile/desktop variants. Reverse scroll must reproduce frames exactly (scrub, no `onComplete` side effects, no autoplay timelines). Use `registerVisualFilm` for QA states.

## 6. Remove list
1. Layered semi-transparent photos over the street-scene portrait.
2. Repeated moodboard/printer photos and duplicate "Behind"/"Notebook" method narrative.
3. Centered print-on-blank-ivory cards and marginal handwriting.
4. Huge numeral beside pale clipped titles in Expertise.
5. Burgundy email card as the contact finale.
6. Bottom nav + FR button overlapping content on mobile.
7. Three consecutive ivory acts.

## Acceptance criteria (visual, testable)
- Screenshot of scenes 1,2,3,5,6 at 390×844 and 1440×900 shows dark/saturated ground; only scene 4 is ivory.
- Hero anchor bounding-box differs by ≤2px between scene end and next scene start (check via `registerVisualFilm` states).
- At scroll positions mid-seam, no frame shows blank ground > 30% of viewport.
- No viewport at 390 shows nav/FR overlapping any text or image (bounding boxes don't intersect).
- Expertise title computed contrast ≥ 4.5:1 and fully inside viewport at every focus state.
- Scrolling down then back up to the same Y yields pixel-identical screenshots (no autoplay ownership).
- `prefers-reduced-motion`: all six scenes readable with no transforms in progress.
- Console clean, `npm run build` and `npm run lint` pass; no WebGL context required on mobile.

Not verified: all motion described; nothing here has been run.
