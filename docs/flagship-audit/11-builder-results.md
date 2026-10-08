# 11 — Builder results: every-stage mentor pass

## Status

Implementation is complete in the isolated worktree and is ready for mentor review. This is not a PASS; the mentor owns the visual gate.

## Changes made

- **Hero:** added a restrained crop entrance and native CSS view-timeline crop registration as the opening frame leaves the viewport. Kept the composition and copy, and gave the direction-study caption enough width to read at 390px.
- **The Edit:** kept all three accessible states. The phone shell opens into the contact sheet, then the selected oxblood frame resolves to the Yuna crop. The Yuna action uses the View Transitions API where available, temporarily shares `yuna-handoff` between source and destination, and lands the cover at a 48px offset. Instant scrolling is used when the API is unavailable or reduced motion is requested.
- **Selected work:** gave Yuna a still, precise crop treatment; MGC a contact-sheet assembly; and Comptoir a restrained material-scale response. Kept existing copy and conceptual direction-study labels.
- **Parcours:** retained the chronological layout and added a single active-year rule that responds to pointer and keyboard focus.
- **Expertise and contact:** retained list semantics and readable mobile descriptions; added restrained focus/hover responses to the expertise rows and the final email gesture.
- **Navigation and motion:** preserved all five destinations and 44px minimum target heights. Added mobile end spacing and a solid footer backing for the fixed navigation. Kept document scrolling native, honored reduced motion, and introduced no global canvas/WebGL scene.

## Validation

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed with one existing warning: `qa/independent-20261008/review.mjs:26` assigns `before` without using it. |
| `npm run build` | Passed; `/fr`, `/en`, and `/ko` prerendered. |
| `git diff --check` | Passed after writing this report. |

Fresh browser captures were made at **1440×900** and **390×844** for every required checkpoint. The output also includes a settled Yuna work view and a reduced-motion run.

| Checkpoint | Desktop | Mobile |
| --- | --- | --- |
| Hero | [desktop-hero.png](../../qa/mentor-20261008/desktop-hero.png) | [mobile-hero.png](../../qa/mentor-20261008/mobile-hero.png) |
| Edit — state 0 | [desktop-edit-0.png](../../qa/mentor-20261008/desktop-edit-0.png) | [mobile-edit-0.png](../../qa/mentor-20261008/mobile-edit-0.png) |
| Edit — state 1 | [desktop-edit-1.png](../../qa/mentor-20261008/desktop-edit-1.png) | [mobile-edit-1.png](../../qa/mentor-20261008/mobile-edit-1.png) |
| Edit — state 2 | [desktop-edit-2.png](../../qa/mentor-20261008/desktop-edit-2.png) | [mobile-edit-2.png](../../qa/mentor-20261008/mobile-edit-2.png) |
| Yuna handoff | [desktop-yuna-handoff.png](../../qa/mentor-20261008/desktop-yuna-handoff.png) | [mobile-yuna-handoff.png](../../qa/mentor-20261008/mobile-yuna-handoff.png) |
| Selected work | [desktop-work.png](../../qa/mentor-20261008/desktop-work.png) | [mobile-work.png](../../qa/mentor-20261008/mobile-work.png) |
| Parcours | [desktop-journey.png](../../qa/mentor-20261008/desktop-journey.png) | [mobile-journey.png](../../qa/mentor-20261008/mobile-journey.png) |
| Expertise | [desktop-expertise.png](../../qa/mentor-20261008/desktop-expertise.png) | [mobile-expertise.png](../../qa/mentor-20261008/mobile-expertise.png) |
| Contact | [desktop-contact.png](../../qa/mentor-20261008/desktop-contact.png) | [mobile-contact.png](../../qa/mentor-20261008/mobile-contact.png) |

Additional evidence: [settled Yuna view](../../qa/mentor-20261008/mobile-work-yuna.png), [mobile reduced-motion view](../../qa/mentor-20261008/mobile-reduced-motion.png), and the [machine-readable capture report](../../qa/mentor-20261008/results.json).

## Browser observations for mentor review

- Both viewport runs returned HTTP 200 with no browser console errors or warnings. No canvas was present in any capture.
- The document width stayed at 1440px on desktop and exactly 390px on mobile. The mobile navigation has five 69×44px targets; desktop targets are each 44px high.
- The browser supports View Transitions. At the handoff capture, the Yuna cover is at `top: 48px`; the target heading is at 72px on desktop and 578px on mobile. The temporary transition name is cleared when the handoff settles.
- With reduced motion enabled, the handoff uses the instant path, lands at `top: 48px`, and leaves both transition names and the temporary handoff class unset.
- The capture harness still reports text bounding boxes crossing the fixed navigation at some chosen scroll positions (including process copy, a Parcours row, an Expertise row, and the contact return link). The mobile footer backing masks content below the nav, and section-end spacing was increased, but the screenshots are included for the mentor to judge whether the remaining proximity feels clear enough.
- These captures do not verify rapid/reversed handoff input, screen-reader behavior, or a performance trace. Available project imagery remains labeled as conceptual direction study where applicable; no client outcomes were added or implied.

## Scope

The original repository was not modified. No commit, push, deploy, or merge was made.
