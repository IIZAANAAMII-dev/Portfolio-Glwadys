# 29 — Opus V3 delivery: continuous seams, ledge archive, readable index (2026-10-10)

Source pass against briefs 27/28 and the product-director P0 list. Identity is unchanged:
every visible string comes from the existing `content/` data (community management /
communication). No new media, no new claims, no film vocabulary. The
"visuels conceptuels générés pour ce portfolio" disclosure is still on every project
cover, on the spread's left page and on the Work → Journey imprint.

## Status — read first
- **Nothing in this pass was compiled, rendered or screenshotted.** This session's
  permission mode held every `npm` / `node` / `tsc` / Playwright call for approval
  (`npm run typecheck` → "This command requires approval"; same for
  `node node_modules/typescript/bin/tsc`). So typecheck, lint, `next build --webpack`
  and browser QA are **not run** on this source. The code was checked by reading only.
- Frames used to find the defects: `docs/qa/v3-final/*` (08:13–08:18). They come from
  the 08:10 build, which predates both the 09:27 spread/Expertise source and this pass.
  **They are stale evidence, not proof of the current source.** They were not committed.
- Visual approval is still open. No score is claimed.

## Defects seen in the frames → fix
| Frame | Defect | Fix |
|---|---|---|
| `chromium-1440-fr-motion/work-journey-aperture.png`, `webkit-390-fr-motion/work-journey-aperture.png` | Work → Journey swapped photos: the Comptoir cover turned away like a door (rotateY) and showed an unrelated contact-sheet print in the window. That's a page turn, not a shared element. | The bridge now uses **one element**: the Comptoir print (`[data-archive-cover]`, inside Journey's own `JourneyOpeningFrame`) starts enlarged and settles into the wine window with a transform only. Journey frame 0 renders the same print at the same box. The rotate-away cover was removed. |
| `journey-fourth.png` (1440 and 320) vs `journey-aperture.png` | All six chapters had the same 4:5 print at the same place with the same column. The Comptoir photo showed up again at 2024 with nothing linking it to Work. | **Ledge archive.** The prints come in six formats (4:5, 1:1, 3:2, 4:5, 3:2, 1:1) and all stand on the same lower edge, so each chapter has its own silhouette and the row has a real rhythm. The strip now centres each reading print of any format in the gate (per-print centres, `sampleAt`). **Filing gesture:** as the act opens, the Comptoir print slides along the ledge and lands exactly on the 2024 print (Le Comptoir de Mathilde): same photograph, same box and the same passage offset. The wine mat lifts as that happens and 2021 shows underneath. At 2024 the reader sees that same print again, now in the chronology. |
| `webkit-320-ko-motion/expertise-sixth.png`, `webkit-390-fr-motion/expertise-fourth.png` | The active discipline was barely bigger than the others. "Brand Communication" fills the 320 measure, so the single hero scale shared by all seven terms came out at ≈1.008. | The painter now gives **each term its own hero scale** (`min(cap, room/width)`). On mobile, terms rest at `min(row·0.56, 5.2vw)` (was 6.3vw), so even "Brand Communication" opens to about 1.25× at 320. Resting opacity on mobile is 0.74 (was 0.6), so the context rows stay readable. Terms are the same English labels in FR/EN/KO, and the contexts are localised. |
| same | The two-line context band could reach the FR+/KO+ control at 320×568. | The mobile `--row-h` is now taken from `--control-clearance` (nav + language control), not `--nav-clearance`. Seven rows, the opened band and a two-line context end at about y≈416 at 320×568, above the control (≈428). |

## Project → project seam (`ActWork/ProjectFeature.tsx`)
Each feature ends on its spread: the photo is laid into the left-page slot. MGC and
Comptoir now **arrive as the next page of the same magazine**. Their stage scrolls in
with the dark desk, the ivory left page, and their own photo already in the slot.
`coverToSlot()` is the same crop and transform the spread uses, so it's the same slot
box the previous project was laid into. Over 0.04–0.28 the photo lifts off the page to
its cover box (clip-path plus x/y/scale only, no re-layout), the page and desk fall
away, and the cover copy is set at 0.20. Comptoir keeps a material accent: it opens
from a 1.22 close crop of paper and chocolate. Yuna keeps the verified notebook wipe.
Reverse scroll replays the fromTo state.

## Work → Journey seam (`ActWork/WorkJourneyBridge.tsx`, `ActJourney/JourneyOpeningFrame.tsx`)
- 0–0.24 hold: the Comptoir print, enlarged (desktop: 94% of the height, kept to the
  right of the imprint; mobile: full width above the imprint, which sits above
  `--control-clearance`), with "06 — 07 / Parcours", the project name and the generated-image disclosure.
- 0.24–0.70: the print settles into the window. The start box always contains the
  window, so the wood under the hole never shows. The bridge stage is wine under the
  window as well.
- 0.56–0.78: the mat's own copy is set. 0.78–1: hold, identical to Journey t=0.
- Both sides request the same image size (`200vw`/`100vw`), so the seam uses the same
  decoded photograph. `will-change` is left off the print so it re-rasters sharp after scaling.

## QA harness (`scripts/v3-qa.mjs`)
- The seam check now compares `[data-work-journey-bridge] [data-archive-cover] img` with
  Journey's `[data-archive-cover] img` (x/y/w/h ≤1px, same source, fit, position and opacity).
- New `work-mgc/entry` and `work-comptoir/entry` states with an **aperture assertion**:
  the photo's visible box (transformed box minus the clip inset) must equal the
  spread slot box within 1.5px.
- New `journey/filing` state, and keyframes for all six Journey chapters, the bridge
  `cover`/`turn` frames and `expertise/first`.

## To run (host, one server at a time — VPS swap)
```
npm run typecheck && npm run lint && node --test scripts/*.test.mjs
npx next build --webpack
node scripts/v3-qa.mjs chromium 1440 fr motion
node scripts/v3-qa.mjs webkit 390 fr motion && node scripts/v3-qa.mjs webkit 320 ko motion
node scripts/v3-qa.mjs webkit 320 en motion && node scripts/v3-qa.mjs webkit 320 fr reduced
node scripts/v3-qa.mjs webkit 320 fr nojs
node scripts/v3-interaction-qa.mjs && node scripts/v3-report.mjs
```
Then look at the following frames, not just the JSON: `work-mgc-entry`,
`work-comptoir-entry`, `work-journey-cover/turn/aperture`, `journey-aperture/filing/first…sixth`,
`expertise-first/fourth/sixth`, at 1440, 390 and 320.

## Known risks (unverified because nothing ran)
- GSAP: entry `fromTo` with function-based from-values, followed by the spread `to`
  tweens on the same targets. It should be deterministic, but it is untested under
  `invalidateOnRefresh` and resize.
- The bridge's mobile scale depends on `imprint.offsetTop`. Long KO titles could make
  the imprint taller, which only makes the start print smaller.
- Journey print formats at 1024–1180 and in WebKit are unverified. The landscape print
  edge should stay right of the left page (≥ 37vw).
- Expertise: the 1.15× "set apart" assertion at 320 depends on the real width of
  Bodoni Moda italic (estimated at ≈0.60 em per character from the 320 frame).
- Carried over from the earlier pass: WebKit 3D leaf with `backface-visibility`, spread geometry at 1024–1180.
