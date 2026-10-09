# 22 — Director's luxury film bible / production instructions for Sol 6.1 Max

2026-10-09. THIS IS A SOURCE-IMPLEMENTATION ORDER FOR THE ACTIVE BUILDER, NOT ANOTHER AUDIT TASK. User requests **a genuine Awwwards-grade luxurious WOW experience**, carte blanche to redesign composition, preserve original author-made motion and the brand's visual DNA. Builder should MODIFY TRACKED SOURCE and ship a tested feature-branch commit. Independent QA/jury later. Do not spend runtime writing a self-assessment.

## References checked — principles, NEVER clone layout/assets
- [DICH™ Fashion / Awwwards](https://www.awwwards.com/inspiration/pre-loader-dichtm-fashion) — creative interaction hierarchy, a decisive signature gesture. Awarded SOTD/Developer Award June 2025.
- [The Art of Silk by STUDIOGUSTO / Awwwards discovery](https://www.awwwards.com/websites/storytelling/) — texture, precious material, meticulous transitions; SOTD May 18, 2025.
- [Humbert & Poyet scroll portfolio](https://www.awwwards.com/inspiration/scroll-portfolio) — restrained typography, strong architecture and one moving photographic composition at a time.
The transfer is **principles**: tactile material, obsessive hierarchy, restrained elegance + uniquely meaningful kinetic details, not the look of a template.

## ONE BIG IDEA
**A creative director's archival film that turns into a physical couture editorial object.**
One entity persists through each act: the hero photo -> a social composition -> moving image in a real campaign -> immersive print -> THE SAME print becoming a folio -> tangible choice -> real case Yuna -> human chronology -> index -> colophon. Match exact physical image geometry during each seam. The visitor should never feel a reset between independent sections. Only one hero gesture per act and a maximum of THREE memorable signature gestures for the whole site.

### NONNEGOTIABLE five design laws
1. **Image subject wins.** On mobile, one hero image, one title, one clear contextual cue maximum. Absolutely no ghost stack of 3 semitransparent photo plates, duplicate collages, overlapping labels or small repeated image fragments without narrative causality.
2. **Every image needs a role.** Do not reuse the same moodboard woman twice merely because it's available. If same media carries across an act, show the PHYSICAL transformation without a cut. Else use existing different supported media from repository and check crop/focus.
3. **Typographic drama with silence.** Bodoni Moda can be enormous ONCE in one shot, no repeated jumbo headers on every sheet. Inter Tight should be comfortable body, not microscopically letterspaced. Kalam only for rare *handwritten notes*, never content. The user needs actual reading time in between transitions.
4. **Material beats tricks.** Reveal a paper edge, fold, mask, clip, pin and shade as the plot requires. Keep shadows light, grained paper subtle. No random float, spin, noisy 3D or excessive scroll budget. GSAP ScrollTrigger is sole motion owner, reversible and fast.
5. **Actual small iPhone is the primary judge.** On 320 and 390 width, reserve persistent navigation/FR control band, safe-area. Avoid 4-line body text behind overlays, and avoid swipe/scroll competition. Any photo/glyph beyond the crop without intention is P0; screenshots of 320 and 390 must both be strong standalone editorial frames.

## Concrete storyboard & assignments (9 acts, differentiated!)
### 00–01 Cover / opening — *The signature*
Current strong asset is dark warm architectural photo. Keep. Introduce her name like a luxury fashion masthead, hold it for comprehension. Signature gesture 1: giant initial typography becomes small marginalia as THE SAME photograph becomes a printed plate. On mobile avoid offscreen surname and excessive scroll distance before first message.

### 02 Visible social — *The finished image*
One dominant portrait/composition and 1–2 restrained labels, no ghost transparent collage. Its goal: she CREATES content. Use a confident gallery portrait framing, not a stack of separate image cards. Tell a new thought, not "Behind" again.

### 02.2 Behind social — *One insight, NOT another method*
This is NOT the six steps of the notebook. Show a single revealing interaction: finished image retracts to expose a brief strategic proof (why framing / light / message), with FIVE current labels only as secondary evidence. Repeated old images from Hero must not clip/bleed. Readable row alpha at EVERY reading frame. Think a contact sheet's reverse, not another big explanation.

### 03 Phone / Campaign — *Distribution comes alive*
Phone is not a generic giant black iPhone UI design. Scene should show how one asset actually travels: feed -> focus -> story -> campaign; 4 steps as progression rather than 4 links fighting FR+ and nav. State text readable at 320px, FR+ outside rail, one current stage luminous and others muted but legible. Cinema gesture: same image travels INTO real phone media surface and eventually grows OUT to full-bleed. No fresh photo suddenly appearing on step change.

### 04 Immersion — *Inside the image*
A single material photograph is the portal. 3D ambient archive on capable desktop, no GPU on mobile; graceful mobile editorial equivalent that feels designed, not fallback. Introduce depth, warmth, and a sensory pause. DO NOT put four floating photos identical to next act. Signature gesture 2: a particular photographic plane changes from spatial object into a crisp printed rectangle.

### 05 Le Carnet — *Creation in matter*
Already real shared handoff from Immersion: commit 0a0b527. Protect this. It becomes a folio. The cover opens (one precise page-turn), then pass from "matière" to intention to visual system to method and finally the real Yuna case. **NO generic notebook-card carousel**. Current artistic defects to fix in source right now:
- Notebook contact-sheet desktop screenshot: handwritten note 'la matière brute / avant le choix' bleeds beyond left viewport (X < 0). Keep inside paper margin, don't fake hover.
- Intention mobile handwritten note is pressed up against FR+ nav and is barely visible. Give it a meaningful bounding rectangle within page, OR remove if noise.
- Système desktop + mobile: fifth 'Cadrage' photo is half-opacity/thumbnail thin strip; make a proper FULL-SIZE photographic aperture, clear crop and caption, distinct from 4 small token cards; no opacity fade under sticky nav. Avoid repeated SAME image already used in intention. Give unique media role or reframe to detail; one hierarchy.
- Method: photos repeat yet again; material transformation rather than reuse by chance. Literal process steps must remain accessible, reveal as deliberate editorial row sequence, not a table from a business PowerPoint.
Gesture 3: the book physical page resolves seamlessly to a Yuna case study cover (already existing join, protect exact pixels).

### 06 Selection/Work — *The proof*
Yuna, MGC, Comptoir have different personalities and full-bleed hero evidence. Give each distinct IMAGE PALETTE/photographic composition, not 3 identical cards. Short strong story title + identity + obvious project affordance and reverse-scroll. Preserve exact Yuna handoff; don't lose UI hierarchy when GSAP scrubs.

### 07 Journey — *A life in six frames*
The six verified chapter story beats (2021–26) remain. Each reads like photographic chapter titles, not a wall of unexplained job titles. Six years become one evolving line, one photograph is the hero at a time. Avoid putting another notebook spread right after notebook.

### 08 Expertise — *The index*
Typographic index, disciplined. Don't turn skills into cards, bubbles or another year list. The luxury feel is typographic proportion, breathing room, precision of baseline, one restrained underline/line gesture. Avoid another "process" list.

### 09 Contact / back cover — *After the film*
A genuine final colophon/closing line; simple dominant name/email CTA with strong contrast, quiet image material and a decisive invitation. Original Contact already stronger in screenshots than some middle acts. Safe-area, nav and FR+ must not obscure email or CTA. Emotional stopping point without unnecessary animation.

## Director's concrete success definitions (must drive CODE decisions)
- **3 gestures only**: (a) Cover → photo print, (b) immersion depth → tactile folio, (c) folio → Yuna case. Additional motion ONLY in service of reading/continuity.
- **Motion density**: between two large transitions, hold at least one stable complete composition; no 3 simultaneous independent image movements or persistent half-transparent labels. GSAP scrub reverse must be deterministic (no independent intro autoplay races).
- **Crossfade isn't a seam**: photograph ID, rect, crop and pixel content match at both edges; test forward+reverse, no blank frame, no doubling or ghost.
- **Mobile UX**: at 320px check browser-in-app toolbar-like reduced visual viewport, FR+ & bottom nav, no overlaps; respect prefers-reduced-motion and keyboard focus, no hover-only content, no WebGL on mobile.
- **Actual code**: source diffs in src/acts/** and components, not only docs. Save tested screenshots/animations in docs/qa/sol61-builder; npm run typecheck/lint/build + git diff --check, meaningful commits to branch only. Don't modify main or public prod.
- **Do not game scores**: passing 207 DOM/geometry cases validates the seam's MECHANICS, not luxe aesthetics. Still inspect real desktop + mobile screenshots with human/AI vision where available, no falsified judgments.
- **One builder**: current Sol agent alone owns src; mentor doesn't conflict. QA/jury remain subsequent independent critics.

## Active mentoring instructions, immediately actionable
1. Finish the CURRENT tracked pass C edits (Notebook photo sizing, marginalia, deliberate wording) and capture 320/390 WebKit + 1440 Chromium, then COMMIT+PUSH ONLY FEATURE BRANCH without waiting for new audit.
2. Next spend remaining code budget on the weakest middle act with highest visual impact, not tiny polish everywhere. Prefer Social/Behind and Phone->Immersion. Avoid 3 simultaneous unfinished transitions.
3. Report code files, tested scenes and new branch deploy ID, with honest remaining defects. Independent QA and cold jury gate P0/P1. Avoid wandering into repeated audits.
