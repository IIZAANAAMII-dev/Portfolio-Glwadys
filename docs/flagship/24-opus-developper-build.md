# 24 — Opus build: « Développer » + « Le carnet » (two acts rewritten)

Source: docs/flagship/23-sonnet-cinematic-creative-treatment.md, scenes 1–5.
Status: two neighbouring acts rewritten. tsc and eslint pass. A production `next build --webpack` compiled with the genuine woff2 fonts served offline. The page was rendered via Playwright MCP at 1440×900, 390×844 and 320×568, in FR, EN and KO. Screenshots are in /tmp/glwadys-opus-v2/shots/.

## Changed files
- src/acts/ActScrollStory/index.tsx — full rewrite (1332 → ~690 lines)
- src/acts/ActScrollStory/ActScrollStory.module.css — full rewrite (1859 → ~1000 lines)
- src/acts/ActProcess/index.tsx — full rewrite (549 → ~470 lines)
- src/acts/ActProcess/ActProcess.module.css — full rewrite (1118 → ~800 lines)
- src/ui/NotebookFrame.module.css — on mobile only, the paper is plain ivory (the old 50 % fold split the single-page print in two)
- docs/flagship/24-opus-developper-build.md — this file

Previous versions: git history, plus /tmp/glwadys-opus-v2/backup/.
Untouched: ActWork, Journey, Expertise, Contact, BottomNav, content, media.
No longer imported (the mentor decides whether to delete): src/shell/StageLayer.tsx, src/shell/stage/*, src/lib/stage.ts, src/ui/ArchivePlate.*, ActScrollStory/phoneSequence.ts and galleryLayout.ts. The WebGL stage no longer runs.

## Act A — ActScrollStory « Développer » (opening, social, phone, immersion)
One persistent object, the APERTURE: a full-stage window where only `clip-path: inset(... round r)` changes. The images inside it are never resized at a handoff, so crop and pixels stay identical at every seam.

| t (vh) | Scene | What happens | Ground |
|---|---|---|---|
| intro ~2 s | Black Room | champagne pantograph line, a 2:3 print opens from it under a wine safelight, Didone name rises (Glwadys ivory / Dalleau champagne) across the frame edges, crop marks | ink #0b0908 |
| 0.46 → 1.32 | Develop | print → full bleed, image scale 1.16 → 1, safelight burns off, crop marks travel to the viewport corners, the name splits out | ink |
| 1.32 → 2.0 | Full bleed | `social.front` held over the photo | ink |
| 2.0 → 3.9 | Reel | 3 frames advance with a bottom wipe, inner counter-motion and depth drift; `social.behind`, then a 5-layer edit strip with a playhead | ink |
| 3.92 → 4.54 | Projector | the room turns wine, the aperture closes on a bare 9:16 screen (no phone body), champagne glow | wine #592027 |
| 4.62 → 6.5 | Formats | Feed / Focus / Story / Campagne inside the screen; Didone beat word, note and rail | wine |
| 6.56 → 8.06 | Portal + immersion | the screen reopens; on desktop the camera pans to keep the walker centred, then the full 16:9; `immersion` copy | — |
| 8.06 → 9.12 | Print | the aperture closes on the exact rect of the notebook print, the paper unfolds, ivory light = ActProcess's first frame | ivory |

## Act B — ActProcess « Le carnet » (scene 4 page turn → scene 5 vault)
The duplicated contact / intention / system / method / cover scenes are merged into ONE bound book.
- Leaf 0 is the pixel twin of the received NotebookFrame print. The original image and folio are hidden at frame 0, and the leaf takes their place.
- 8 leaves, 7 real 3D turns (rotationY 0 → −180 around the binding, `transformPerspective` set on each leaf, recto/verso with backface hidden). The turning leaf's zIndex is raised at the start of its turn, a shade darkens the lifting recto and the verso lightens as it lands, and a shadow sweeps over the page underneath.
- Spreads: Planche contact (title + real 4-frame contact strip) | selected print → Intention | Système (5 typeset specimens) → 01–06 method term | evidence print.
- Every evidence print sits in the EXACT `workProof` geometry (vw/vh offsets corrected by cq units). The last one is the Yuna campaign. An iris `circle()` then opens from that print onto the dark wood vault, revealing the same print in the same place. ActWork's Yuna seam is unchanged.
- Mobile is a single page: the leaf peels left (rotationY → −96 and fades), the title sits above the print and the note fills the free column to its left. No backs.
- Reduced motion: the previous static panels are kept.

## Ownership and robustness
- One scrubbed timeline per act (`opening-film`, `notebook-film`), `ease: none` defaults and `overwrite: false`.
- Every geometry tween is a `fromTo` with function values measured from CSS templates, so invalidateOnRefresh never re-reads a mid-film start.
- The intro autoplay writes only on separate nodes and properties, and is forced to progress(1) on the first scroll.
- matchMedia conditions include `isMobile`. That was a bug in my first pass: without it, mobile ran no animation at all. Caught in render QA and fixed.
- Clip-path windows are driven by NUMERIC CSS variables (`--ap-t/r/b/l/rad`, `--wipe`, `--intro`) that CSS composes into `inset()`.
  - Render QA showed that tweening the clip-path string itself JUMPED instead of interpolating: the browser normalises `inset(0% 0% 0% 0%)` to `inset(0%)`, so the number counts no longer match.
  - Verified after the fix with computed clip-path samples, which interpolate continuously at t = 0.7, 1.0, 2.15, 4.1, 4.3, 6.8, 7.0, 8.2 and 8.4.
  - Lesson for other acts: never tween `inset()` strings whose values can collapse.

## Evidence (sandbox render via Playwright MCP)
- Fonts: real Bodoni Moda / Inter Tight / Kalam / Noto Sans KR. The offline next/font mock serves the genuine woff2 files from a sibling build (`document.fonts` reports all four loaded). See /tmp/glwadys-opus-v2/make_fontmock.py; the real-typography frames are *-rf-* (FR, EN, KO).
- Commit-ready artifact (no git in the sandbox): /tmp/glwadys-opus-v2/0001-developper-and-carnet.mbox, which applies with `git am` on jarvis/glwadys-cinematic-v2 at 3b8f9b4. I verified it against a scratch repo (apply OK, the 6 files match byte for byte, `git diff --check` clean). The plain patch is /tmp/glwadys-opus-v2/glwadys-opus-v2.patch.
- Console: 0 errors and 0 page errors across all runs.
- Forward vs reverse at the same scroll state, as a pixel diff (PNG, threshold 16), on the final build:
  - 1440: hero 0.62 %, social 0.05 %, feed 0.05 %, paper 0 %, notebook method 0 %, vault 0 %.
  - 390: hero 0.84 %, then 0.21 / 0.05 / 0 / 0 / 0 %.
  - Outside the hero, the residue is anti-aliasing. The hero residue is opening chrome (marks and name returning) and is still to investigate (P2).
  - Script: /tmp/glwadys-opus-v2/compare.py.
- Late fix: on desktop the hero print was black. The initial `gsap.set` of the window variables was erased by the refresh invalidation, so the develop `fromTo` now uses `immediateRender: true`. I verified the window at load, after a seek and back, and after a resize at 1440, 390 and 320.
- Forward + reverse scrub film: /tmp/glwadys-opus-v2/film-forward-reverse-1440.webp. It is an animated WebP of 112 frames from real seeks (no ffmpeg in the sandbox).
- Screenshots: *-v3-* (final build, key states and mid-transitions, 1440 and 390), s-* (320×568) in /tmp/glwadys-opus-v2/shots/. Older d-*/m-* frames predate the clip-path fix.
- Visual issues fixed during QA: the desktop tagline sat under the nav (raised); leftover glyphs from earlier beat words (exits now fade); micro-title contrast over photos (ink halo added); the mobile book fold seam (removed); the mobile note column.

## Not verified / remaining
- P0 (host): run the real `npm run build` (Turbopack, network fonts), then `git am` the mbox, or simply commit the worktree, which already contains these exact files. The sandbox used `next build --webpack` with the local real-font mock. A partial `.next/` without BUILD_ID may sit in the worktree from my first attempt, so rebuild before `next start`.
- P1: a true MP4/WebM screen recording is not produced. The WebP scrub film is built from seek frames, not real-time wheel scrolling.
- P1: the hero image on desktop is the 9:16 still life cropped to 16:10. It reads as moody glassware, not obviously a ring. Consider a dedicated desktop crop or focus.
- P1: performance is not measured. Full-viewport clip-path repaints and 3D leaves on a mid iPhone need a trace.
- P1 (existing, not mine): BottomNav's act label truncates ("LE CONT…"), and on mobile the FR toggle crowds the nav capsule.
- P2: on 320-wide phones the mobile method note column is about 75 px wide.
- Old QA scripts (qa2.js, scripts/diag.mjs, qa/mentor-*.mjs) query `[data-device]`/`[data-phone-screen]`, which no longer exist.
- No git in the sandbox (the linked .git is outside the mount). Commit on the host, on branch jarvis/glwadys-cinematic-v2 only.
