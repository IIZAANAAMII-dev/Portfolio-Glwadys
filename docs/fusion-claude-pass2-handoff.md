# Fusion — Claude pass 2 handoff (director brief 37)

Date: 2026-10-11. Branch `jarvis/glwadys-fusion-luxe-ugc`, same worktree. No git ops, no new deps.
BottomNav and Expertise were not touched (Codex work preserved).

**Not verified:** this session had no shell, so typecheck, build and browser runs did **not** happen.
I checked types and selectors by reading the code only. Director QA should run `typecheck` + `build` first.

## Changed files
- `src/acts/ActScrollStory/index.tsx`
- `src/acts/ActScrollStory/ActScrollStory.module.css`
- `src/acts/ActProcess/index.tsx`
- `src/acts/ActProcess/ActProcess.module.css`

## 1 · P0 cover first paint (ActScrollStory)
- The cover now renders before hydration. The aperture's SSR `clip-path` is the hero-print window, computed in CSS with the same formula as `.heroGeom` (desktop, mobile, short phones). The photo, GLWADYS, the role "Community Manager / Créatrice de contenu UGC", the issue chrome, the cover lines and the credit all show in the first frame. No black void.
- GSAP sets `data-armed` on `[data-aperture]` after measuring the same box, and the numeric `--ap-*` clip takes over. The cleanup removes it.
- The intro no longer hides anything that is already visible. It only refines, starting from the SSR values:
  - the hero print eases into focus (`scale 1.045 → 1` on the Media child of `[data-reel-image]`)
  - the masthead letter-spacing tightens (`0.04em → -0.02em`)
  - the signature settles (`x 0.14em → 0` on its wrapper, so the mask clips nothing)
  - trace, corner marks, tagline and the silver glint follow
- `emitReady` fires at 0.8 s (safety timer 1.6 s).
- **The scroll lock is removed.** The cover never calls `lockScroll`. A one-time `scroll` listener finishes the intro before the scrub reads its start values, so reverse scroll stays deterministic. None of the intro's properties is written by the scrubbed timeline.
- Reduced motion is unchanged (`ReducedStory`).

## 2 · P1 credit microtype (ActScrollStory CSS)
- The vertical 280 px credit is gone. Each viewport now gets a horizontal caption:
  - **Desktop:** one line, 12 px, under the print's foot, indented past the corner mark. It clears the nav down to roughly 1280×720.
  - **Mobile:** sits above the print's top edge, aligned to it, between the role and the image (11 px, balanced wrap).
  - **≤359 px wide or ≤700 px tall:** shows only the localized "image générée / generated image / 생성 이미지", so the generated label stays visible.

## 3 · P1 tactile moodboard (ActProcess)
- Desktop left page: the near-black `contactStrip` bar is replaced by a size-container "table" with three real prints:
  - 02 jewelry macro, 03 moodboard, 04 tools
  - ivory print borders, tilts, champagne tape and a wine micro-label on each print
  - one handwritten ink note per print
  - a named swatch line underneath (ivory / ink / wine / silver / champagne)
- Prints load `eager` (small `sizes`), so no dark placeholder appears on the settled hold.
- Motion: the prints drop onto the table with a small rotation that settles (scrubbed, so it reverses).
- Mobile/320: leaf 0 gets a second, tilted print (the jewelry macro) over the corner of the retained print, captioned "02 · Matière" in its paper margin. It appears with `[data-leaf-intro]` after the exact NotebookFrame twin handoff, so that handoff is unchanged. On ≤620 px tall phones it moves up to keep the title clear.
- The Yuna bridge (`evidence` / `workProof` geometry, iris) and the image identity are untouched.
- The staging annotations are a local `TABLE` (FR/EN/KO) in `ActProcess`. They are styling labels, not factual claims.

## For director QA
- 1440 / 390 / 320 at t = 0.3–1.0 s: the cover should already be composed.
- 1440 notebook `sheet` state.
- 390 / 320 notebook entry.
- Fast reverse scroll through the hero → develop transition.
