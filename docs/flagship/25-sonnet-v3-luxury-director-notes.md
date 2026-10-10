# 25 — Sonnet 5.5 High → Opus: second-half film, "La pellicule" (directive, no source touched)

Evidence basis: read docs 23/24, WorkJourneyBridge.tsx/.module.css, ActJourney (index, JourneyOpeningFrame), ActExpertise (index, ExpertiseOpeningFrame, css), ActWork, ActContact, content/media.ts, tokens, and viewed 2 old QA stills (docs/qa/full-story-live, pre-V2).
Nothing here was run in a browser: every motion line is intent, not observed behaviour.
Opus must produce real captures (section 6) before any quality claim.

## 0. Decision
Keep the first half untouched: darkroom intro, wine reel, page turn, Yuna iris. The second half becomes ONE continuous object: a 35 mm film ribbon (champagne sprocket edges, pure CSS, no new assets) that is loaded in Work, unspools through the bridge, and carries the six Journey years. Then Expertise becomes the wine "title-card index".
Priority: (1) La pellicule, (2) Index en vin. (3) Contact: one line only, see 5.

Palette arc: Yuna wood (dark) → MGC/Comptoir as now → wood + champagne ribbon (Journey) → rich-wine #592027 (Expertise) → ivory page rises (Manifesto, Contact = the only ivory landing, as the resting state). No ivory cards in the dark half.

## 1. Why this is the right metaphor (facts already in the repo)
Journey photos 2022 = yunaCampaign, 2024 = comptoirCraft, 2025 = mgcEditorialWall (media.ts journeyPhotos). Those are the same images as the three Work folios. Use that: the folios leaving Work ARE frames 2022/2025/2024 of the strip. Duplication becomes the shared element, not repetition.
Do not change project facts, years or any copy/translations.

## 2. CHANGE 1 — "La pellicule": Work bridge → Journey
Files: src/acts/ActWork/WorkJourneyBridge.tsx + .module.css, src/acts/ActJourney/JourneyOpeningFrame.tsx + ActJourney.module.css + index.tsx (the bridge renders JourneyOpeningFrame preview, so one edit feeds both sides of the seam). Scroll owner: bridge timeline owns 0–1 of its own pinned sticky stage (min-height 190svh → 240svh desktop / 210svh mobile); Journey owns its own pin afterwards.
Never both writing the ribbon x. Ribbon x is written by exactly one fromTo per owner, ease none, function values, invalidateOnRefresh, no autoplay.

New nodes: [data-bridge-ribbon] (height = frame height + 2×22px perforation bands; sprocket = repeating-linear-gradient, 28px tile, champagne at .55 alpha on wood), reused as .ribbon in Journey's track. Frame number micro labels (champagne) replace "Folio 01—03" chrome.
Desktop storyboard (bridge timeline 0→1):
 0.00–0.16 LOAD: the 3 folios lose their chaos rotation (-3.4/1.6/3.1 → 0) and lock onto one horizontal row at y 50svh, frame height 54vh, 4:5; the ribbon wipes in left→right behind them (scaleX 0→1, origin left). Bordeaux field still holds. Stillness after: nothing moves 0.14–0.18.
 0.16–0.52 UNSPOOL: ribbon + folios translate left 1:1 with scroll, sprocket background-position tied to the same x so holes visibly travel. Bordeaux drains bottom→top (scaleY 1→0) at 0.30–0.46, revealing wood. Remove the vertical champagne [data-bridge-thread] line and the shrink/fan-out of folios (0.48–0.78 in current code).
 0.52–0.80 DECANT: a fixed wood matte column (width 28vw, same one Journey already draws with .stage::after) fades in; folios slide UNDER it and out. "Parcours" heading + statement rise in the matte (existing data-bridge-journey, line-mask rise).
 0.80–1.00 SWAP: identical to today's contract: nextFrame clone reveals at the exact pinned coordinates. The ribbon end state must equal Journey's first frame: first Journey frame left edge at 28vw, same sprocket phase. Snap ribbon end x to a multiple of the 28px tile so holes align to the pixel. Keep alignNextFilm()'s measuring of the real #act-journey-scene frame.

Journey act: replace six ivory paper cards (.entry background, border, FOCUS ::after label, oxblood year on ivory) with six film frames on one continuous ribbon: photo only (4:5, 54vh), champagne frame number, and a GIANT Didone year (champagne, 14vw, outline or 12% fill) set in the gap above/behind the ribbon at 0.6× scroll speed (parallax by driver, deterministic). Pitch = frame width + 12vw so two frames and a half are visible: a film, not six slides.
Chapter verb (Créer… Diriger) stays in the left matte as a large Didone word, swapped by discrete index change (line-mask rise, 0.45 s expo.out), not scrubbed alpha. Playhead/progress bar becomes the ribbon's lower edge line (scaleX). Keep driver/updateFocus architecture, offsetLeft math and the 0.82→1 handoff window.
Mobile 390 / 320 (authored, not shrunk): Journey keeps its one-page-per-chapter wipe (index.tsx !isDesktop branch). Add fixed sprocket edge strips (12px at 390, 10px at 320) on both sides of the stage whose background-position-y is scrubbed by driver: film travels while pages wipe. Giant year at 38vw behind the photo; chapter verb 2.1rem under it. Bridge on mobile: folios stack as a VERTICAL ribbon (frames 58vw wide), unspool upward (yPercent), exit top; Journey's first full-page photo wipes in from the bottom. At 320 verify the year and verb never touch BottomNav (nav-clearance) or the FR toggle.
Reverse: ribbon + sprocket + year parallax derive from one scalar each, so reverse scroll replays frames exactly; chapter verb index is derived from the same scalar.
Reduced motion: static ribbon, six frames stacked in order, years and verbs visible, no parallax.

## 3. CHANGE 2 — "Index en vin": Expertise (7 entries, real copy unchanged)
Files: src/acts/ActExpertise/index.tsx, ExpertiseOpeningFrame.tsx, ActExpertise.module.css. Because ExpertiseOpeningFrame is also rendered decorative inside Journey's handoff, edit the frame once and the Journey→Expertise seam stays pixel-twin (state pos=0 must be fully CSS-static in the clone).
Ground: rich-wine #592027, champagne + ivory type. The Journey→Expertise seam keeps today's clipPath handoff (inset right→0), now wood → wine instead of wood → ivory.

Layout desktop 1440: heading "Expertise" small Didone top-left (not 9vw at the right). All 7 terms visible at once as a stationary index, Didone italic, 7.2vh each, term font 6.4vw, left at 8vw. Active row: ivory 100% + champagne 1px reading bar sliding row to row at 8vw→58vw. Inactive rows: ivory at .30 (contrast check below). Small inline number "04" in champagne micro left of the term, same baseline. DELETE the 24vw .catalogueNumber (this is the "06 huge / label faded" bug). Context line lives in ONE fixed slot at the right (x 62–94vw, y aligned to the active row via the same scalar), swapped on index change with a line-mask rise.
One scalar: pos ∈ [0,6]. render(pos) is the only writer: bar y = interpolate(rowTops, pos); active = round(pos); opacity/scale of each row = f(|pos - i|); counter text "NN / 07"; context. Call it from the timeline onUpdate AND onRefresh (existing syncChapter pattern, now with no list translation). Row scale via transform only (origin left), rows keep fixed CSS height: zero reflow.
Dramaturgy (SCROLL.expertise 460 stays): 0–0.10 QUIET: rows tiny and low (term 3.2vw, .3 alpha, tracking wide); 0.10–0.76 RISING: pos 0→6, each row holds 64% of its slot then turns (existing slot/hold maths), active row scales 1 → 1.12 and goes bold; 0.76–0.86 CHORD: all seven rows go ivory 1.0 together for one beat (the payoff of the index), bar fades; 0.86–1.0 the ivory Manifesto sheet rises over wine (keep handoff/fold code and ActContact geometry contract).
Mobile 390 / 320: rows 8.4svh, term font clamp(1.75rem, 8.4vw, 3rem), left 6vw; number 0.6rem; context line in a fixed caption band at the bottom above --nav-clearance (2 lines max); bar becomes a 2px champagne left rule. "Brand Communication" must fit on ONE line at 320 (min font 1.75rem ≈ 28px; measure scrollWidth <= clientWidth). Drop the right-hand column entirely on mobile.
Reduced motion: all rows ivory 1.0, no bar, contexts printed under their terms.

## 4. Remove list
Journey ivory paper cards, FOCUS vertical label, bridge vertical thread line, folio fan-out/shrink, Expertise giant number, hover underline ::after on rows, ivory Expertise sheet, row translate list (the scrolling list). Do not touch notebook→Yuna iris or darkroom/reel.

## 5. CHANGE 3 (only if time) — Contact closure
No new layout. When the lastPage enters, replay the intro's champagne pantograph line once (1px, scaleX 0→1 under the email baseline, 0.9 s expo.out, not scrubbed, reduced-motion = already drawn), same easing as the darkroom opening. Callback closes the film without a 4th gimmick. Hero crop (desktop still-life ring) is optional and unverified: change focus only after a screenshot proves the ring reads; otherwise leave as is.

## 6. FAIL GATES (all must pass with real captures; no self-reported 10/10)
G1 SEAM: bridge t=1 vs Journey scroll 0 at 1440×900, 390×844, 320×568: pixel diff <= 1.5% (threshold 16), first frame bbox delta <= 2px, sprocket phase delta <= 1px. Same for Journey end vs Expertise start. Reverse at the same Y matches forward within 1%.
G2 EXPERTISE PHASE: at the 7 hold centers, counter text index == active row index, the bar centre is within 2px of the active row centre, the active term bbox is fully inside the viewport, contrast of active >= 4.5:1 and inactive >= 3:1 (large text), no term wraps or scrolls horizontally at 390/320. Mid-turn state (pos = 2.5) must never show two numbers or a clipped label.
G3 FILM CONTINUITY: sampled at 6+ Journey states, no frame has blank ground >30% of viewport, no ivory card, no identical src visible twice in one viewport, ribbon continues without a gap across bridge→Journey. Reduced motion shows all six chapters with years.
G4 MOBILE TYPE INTEGRITY: at 320/390 no horizontal glyph clipping at rest (hero name, year, verb, terms); any hero-name clipping during exit happens only through the vertical line mask, never as a horizontal overflow; nothing overlaps BottomNav/FR; console and page errors = 0; document scrollWidth == innerWidth.

Captures required (WebKit + Chromium, FR; KO at the three starred states; reduced-motion once): bridge t = 0, .16*, .34, .52, .70*, .81, .83, 1.0; Journey 0, .2, .4 (2022 frame), .6, .82, .91*, 1; Expertise pos 0 (and clone), 2.5, 3, 6, chord .80, handoff .95; Manifesto first frame. Sizes 1440×900, 390×844, 320×568. Save under docs/qa/v3-director/ and write the pixel-diff numbers in the build note; unmeasured performance (full-viewport clip-path + ribbon paint on iPhone) stays labelled UNVERIFIED until a trace exists.
