# 14 — SOL MAX / GSAP builder results

Status: implementation and requested production proof complete. Mentor/Astra cold jury remains pending. No flagship verdict is issued by the builder. No commit, push, merge, deployment or publication.

All work and evidence are confined to `/home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards`, with one implementation writer. Existing audit and QA artifacts were preserved.

## Implementation

The existing warm editorial palette, serif/sans hierarchy, six chapters, five navigation destinations and FR/EN/KO content remain. Existing generated visuals continue to carry direction-study disclosures. Project roles, challenges, directions and skills were preserved; no client deliverable or outcome was invented.

### One image through THE EDIT

[EditMark.tsx](../../src/acts/ActProcess/EditMark.tsx) now keeps one persistent Yuna photograph and DOM element through all three states. Its source is `/media/generated/yuna/yuna-campaign-v2.jpg`, which is also the Yuna cover source.

1. **Réserver:** the photograph begins in phone framing.
2. **Tirer:** GSAP Flip releases that element into the selected slot of a contact sheet made from the three existing Yuna studies. The other two prints enter through a clipping gesture. The selected image is visibly the same frame, rather than an unrelated sheet bitmap.
3. **Annoter:** Flip expands that selected element into the full crop. SVG corner marks draw in; the oxblood selection rule and handle belong to the moving element. Reversing captures its current interrupted position and returns it coherently.

The existing browser View Transition carries the selected frame into Yuna. The destination image is decoded before capture, the cover lands near 48px, and focus moves to `case-yuna`. Temporary names and the handoff class clear in `finally` and on unmount. Duplicate activation is guarded; reduced motion and browsers without View Transitions land immediately. Keyboard position survives the button becoming the handoff anchor. A noscript Yuna link preserves the semantic route when JavaScript is disabled.

### Scoped motion

[gsap.ts](../../src/motion/gsap.ts) registers ScrollTrigger and Flip at one client boundary. [MotionScope.tsx](../../src/motion/MotionScope.tsx) provides only hero and journey enhancements, using scoped contexts, matchMedia branches and cleanup. Edit animations use their own scoped context. Font readiness refreshes final geometry; resize and motion-preference changes settle interrupted Edit travel and clear temporary transforms.

| Verb | Authored response |
| --- | --- |
| Réserver | Hero corner strokes and reservation rule draw quickly. Native scrolling reversibly scales/clips the photograph into its reserved frame. |
| Tirer | The same phone photograph moves into the proof sheet through Flip. |
| Annoter | The selected print expands with its crop marks and oxblood rule attached. |
| Caler | ScrollTrigger tracks one active ledger year; mobile adds a vertical playhead. Touch/focus can select a year without obscuring its copy. |
| Transmettre | The image handoff joins Edit to Yuna. The final email action has one rule and a 4px arrow gesture on focus, tap or hover. |

There is no scroll replacement, Lenis, pinning, global canvas/WebGL, reveal parade or layout property animated on each scroll frame. React state changes on interactions or navigation section changes, not every animation frame. The inherited global image hover sheen/zoom was removed so the selected photograph stays still. Reduced motion has instant Edit states, no Flip travel and no scrubbed crop/playhead movement; all semantic content remains visible.

### Mobile and desktop composition

- **Hero:** separate mobile image/signature columns, mobile image focus, deliberate descriptor line break and attached reservation marks. The desktop image height now leaves the opening footer clear of the dock.
- **Edit:** all three states share a reserved mobile control-row height. This also fixes a measured 7px document-height change at 320px that previously shifted the ledger after a mid-scroll refresh. Desktop method spacing fits the last explanatory line above navigation.
- **Work:** Yuna uses a quiet, still crop; MGC uses a three-image community assembly; Comptoir uses a tactile macro plus a smaller craft detail. Copy groups are spaced for their respective entry compositions rather than repeating a portrait-card layout. Desktop Yuna retains the complete skill list above the dock.
- **Journey:** the mobile vertical ledger keeps all six entries legible in its first frame. Smaller year numerals prevent italic ink from crossing the copy column. Desktop retains the editorial grid and one active rule.
- **Expertise:** seven visible rows, restrained alternating mobile indentation, and equivalent touch/focus feedback. No accordion or dashboard widget was added.
- **Contact:** image-free ending, dominant email, restrained transmission gesture, readable footer/return link. At 320px the email has a full-width row, with the arrow beside the label, to prevent an orphan final character.
- **Navigation:** all five destinations remain visible and safe-area aware. The surface is solid rather than blurred glass. Active state follows the settled document position using passive events and one scheduled read, replacing the stale partial IntersectionObserver updates.

## Final validation

Fresh optimized Next 16.3 build **`7lNLd6JXSla2v-OGYVmzv`**, served locally on port 4416. The final browser run began **2026-10-08 05:31:05 UTC**, using Playwright 1.62.1 in Docker and Chromium **151.0.7922.34**. Build tools ran with Node 26.10.0 and npm 12.1.0. Only GSAP 3.15.0 was added as an application dependency.

| Check | Recorded result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | Exit 0 | [Log](../../qa/sol14-20261008/typecheck.log) |
| `npm run lint` | Exit 0, no lint warnings | [Log](../../qa/sol14-20261008/lint.log) |
| `npm run build` | Exit 0; FR/EN/KO statically generated | [Log](../../qa/sol14-20261008/build.log) |
| `git diff --check` | Exit 0 | [Log](../../qa/sol14-20261008/diff-check.log) |
| Production browser proof | Exit 0; **191 assertions satisfied, zero failures** | [Results](../../qa/sol14-20261008/results.json), [log](../../qa/sol14-20261008/browser-proof.log) |

The [evidence index](../../qa/sol14-20261008/README.md) links all **21 required screenshots**: nine desktop 1440×900 frames, nine mobile 390×844 frames, and 320×800 Hero/Edit 2/Contact-bottom. It also includes MGC/Comptoir, touch/focus, intermediate Flip/handoff, locale and fallback captures, [mobile trace](../../qa/sol14-20261008/mobile-browser-trace.zip), [desktop recording](../../qa/sol14-20261008/desktop-session.webm) and [mobile recording](../../qa/sol14-20261008/mobile-session.webm). Captures were visually inspected as compositions; the trace/recordings preserve movement for the mentor's review.

### Geometry and navigation

Document scrollWidth is exactly **1440, 390 and 320px** at the respective viewports. FR/EN/KO additionally have exact 390/320px widths. Required captured frames and both additional case compositions have no measured text/image intersections with the dock. All visible mobile links, buttons and focusable rows in captured frames meet **44×44px**.

Measured clearance from the last listed element to the dock's top edge, rounded to one decimal:

| Element / frame | 1440×900 | 390×844 | 320×800 |
| --- | ---: | ---: | ---: |
| Hero footer | 46.8px | 37.4px | 37.4px |
| Edit controls, state 0 | 41.1px | 46.8px | — |
| Edit controls, state 1 | 41.1px | 46.8px | — |
| Edit controls, state 2 | 41.1px | 46.8px | 65.1px |
| Journey, final ledger row | 66.7px | 40.6px | — |
| Expertise, final row | 40.2px | 76.5px | — |
| Contact footer, section entry | 59.2px | 28.1px | — |
| Contact footer, document bottom | 59.2px | 100.1px | 100.4px |

Desktop method's final note clears by **36.3px**, and Yuna's final skill at Work entry by **27.6px**. Mobile MGC's challenge clears by **27.0px**, and Comptoir's summary by **26.5px**. Locale Edit 2 clearances at 390/320px are FR **46.8/65.1px**, EN **47.2/86.6px**, KO **25.1/64.9px**. The [320px email probe](../../qa/sol14-20261008/small-email.json) records one complete address line in all three locales, without overflow.

All five nav targets are 44px high. Desktop widths are **101.9, 106.9, 118.9, 115.8, 112.9px** in destination order. At 390px every target is **69.0×44px**; at 320px every target is **55.0×44px**. Full x/y/width/height rectangles for every frame are retained in results.json. Every destination's hash and `aria-current` agree after settlement.

### Runtime, input and fallback evidence

- **Zero console errors/warnings, failed requests, HTTP errors, broken images or canvas elements** across all instrumented normal, locale and motion/fallback/constrained scenarios.
- Pointer/touch handoff and keyboard handoff land the same source/crop family near 48px, focus `case-yuna`, set `#act-work-yuna`, and leave both transition names `none` with the temporary class removed at 1600ms. Keyboard handoff cover tops are **48.34px desktop / 48px mobile / 47.75px small**, within the 1px rounding tolerance.
- Keyboard Space reverses, Enter selects and Enter activates handoff. Eight rapid forward/reverse inputs at 55ms pauses settle correctly; mobile/small use actual touchscreen events. The photograph retains DOM identity, source and a cleared final transform throughout.
- Desktop↔mobile resize, resize during Flip, hero scroll progression/reversal, year selection by touch/focus, expertise focus and the contact rule/arrow were exercised. Mid-scroll refresh has **0px restoration delta at all three sizes**, with the correct settled navigation state.
- Reduced motion switches Edit instantly, has no scrubbed hero movement, preserves all six chapter headings and lands the handoff correctly. Disabling WebGL records **zero calls**. Disabling View Transitions exercises the immediate handoff fallback.
- `/fr`, `/en`, `/ko` return **HTTP 200**, with `fr-FR`, `en`, `ko-KR` respectively. JavaScript-disabled output retains **six chapters, three cases, the email action and the noscript Yuna anchor**.

The constrained local probe used **120ms network latency, 200,000 B/s download, 100,000 B/s upload and 4× CPU throttling**. During the first Flip, **83 rAF intervals** had a **16.7ms median**, **33.4ms maximum**, and **zero intervals over 34ms**. Handoff remained usable and runtime logs stayed clean. These are synthetic local browser observations, not a device or field performance guarantee.

## Review scope

This is single-writer implementation and local Chromium evidence. Safari/Firefox, physical iOS/Android, assistive technology and field performance remain unverified. The captures test chosen compositions; they do not prove every possible scroll offset or every device/font combination. The mentor/Astra cold jury has not run, and engineering checks do not establish an Awwwards verdict.

The local optimized server is available on `http://127.0.0.1:4416/fr` for review. All changes remain uncommitted. Stop here for mentor review; further design changes await that review.

## Inputs and API guidance

Read [AGENTS.md](../../AGENTS.md), [V14 brief](14-sol-gsap-brief.md), [V13 mobile brief](13-mobile-signature-brief.md), [V12 correction results](12-focused-correction-results.md), [mentor reopen](12-mentor-reopen.md), and [direction synthesis](00-synthesis.md). Consulted the installed Next 16.3 guides for server/client components, CSS and Image before implementation, and the local animation, typography and modern-design skills.

GSAP API guidance: [Flip](https://gsap.com/docs/v3/Plugins/Flip/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
