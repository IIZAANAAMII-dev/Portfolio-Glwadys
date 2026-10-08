# Audit verdict

**Not ready for premium production.** The mobile captures show content being covered, and the WebGL chapter has no ready or failure path that preserves its visuals. SEO URL configuration and mixed-language interface copy also need attention.

This audit uses only the supplied source and screenshots. I did not run a browser, inspect the omitted CSS or `Media` component, or check live network responses; the matrix below is a release checklist, not a report of executed tests.

## Verified defects

| Priority | Finding | Evidence and impact |
|---|---|---|
| **P1** | **Mobile content is obscured.** | In [mobile-0500](</home/jarvis/workspace/audits/Portfolio-Glwadys/qa/mobile-0500.png>), image strips cover the project summary and overlap the Yuna case heading. In [mobile-1000](</home/jarvis/workspace/audits/Portfolio-Glwadys/qa/mobile-1000.png>), the collage crosses the contact title, message and email. The [desktop contact capture](</home/jarvis/workspace/audits/Portfolio-Glwadys/qa/shot-1000.png>) also places imagery over the email area. This makes important copy hard to read at captured states. |
| **P1** | **The immersive chapter has no reliable WebGL or media fallback.** | [StageLayer](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/StageLayer.tsx>) renders no fallback when the Canvas is unavailable. [ActScrollStory](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/acts/ActScrollStory/index.tsx>) continues its animation and hides the phone DOM at the transfer; it does not wait for the scene to be ready. [StageScene](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/stage/StageScene.tsx>) omits a plane when its texture fails. Slow loads, missing assets or unavailable WebGL can therefore leave this chapter blank or incomplete. |
| **P1 release check** | **Production canonical URLs lack an explicit base.** | The supplied root locale layout sets canonical and language alternates to relative paths such as `/fr`, but does not define `metadataBase`. Verify the emitted tags before release: if Next’s fallback base is used, production can advertise localhost canonical URLs. |
| **P2** | **English and Korean routes contain hard-coded French and English UI copy.** | Examples include “Table 02 — direction artistique,” “Marseille · aujourd’hui,” “Votre mood ?,” and “la matière brute / avant le choix,” plus English labels such as “Selected,” “Evidence” and “Timeline.” These appear outside the locale dictionaries in [ActScrollStory](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/acts/ActScrollStory/index.tsx>), [ActProcess](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/acts/ActProcess/index.tsx>) and [ActJourney](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/acts/ActJourney/index.tsx>). |
| **P2** | **Social preview metadata is incomplete in the supplied locale metadata.** | The locale metadata provides title and description, but no Open Graph image or Twitter card fields. Sharing can produce an incomplete preview; confirm whether any parent defaults exist before treating the rendered tags as final. |
| **P2** | **Texture failures remove imagery without a visible recovery state.** | The texture loader catches errors and skips the plane, while also logging to the console. There is no retry or replacement visual in the supplied stage code. |
| **P2** | **Production code emits diagnostic console messages.** | [StageScene](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/stage/StageScene.tsx>) logs tier loads, plane creation and visibility with unconditional `console.warn` calls. Missing textures log `console.error`. This pollutes production diagnostics and means a clean-console QA check will fail. |
| **P2** | **The “evidence” fields do not substantiate the case-study outcomes.** | In [the content dictionaries](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/content/index.ts>), evidence entries are labels such as “Produit,” “Social” and “Marque,” with descriptions of deliverables. They do not provide proof or measured outcomes. Use verified results and artifact attribution, or label these as capabilities/deliverables rather than evidence. |
| **P2** | **The media type does not enforce its alt-text contract.** | [MediaItem](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/content/media.ts>) makes `alt` optional even though the documented contract requires localized alt text whenever `src` exists. The current generated entries include alt text, but the type permits future images without it. |
| **P2** | **The Canvas and textures persist after the scene stops being live.** | [StageLayer](</home/jarvis/workspace/studio-worktrees/portfolio-glwadys-awwwards/src/shell/StageLayer.tsx>) explicitly keeps the Canvas mounted after first activation. `frameloop="demand"` reduces idle rendering, but textures and the WebGL context remain allocated. This differs from the supplied architecture requirement for teardown and disposal at scene exit. |

## Hypotheses and items to confirm

The CSS modules, `Media` implementation and rendered page head were not supplied, so these need browser verification:

- **Reduced-motion duplicate content:** `ActScrollStory` renders the animated story and conditionally adds `ReducedStory`; `ActProcess` renders both the motion and reduced variants. CSS may hide the inactive version, but confirm it is absent from the accessibility tree and cannot receive focus.
- **Contrast and focus visibility:** the screenshots show small, faint labels on light surfaces, but the supplied evidence does not include token values or focus styles. Measure contrast and test `:focus-visible` on both paper and dark backgrounds.
- **Image loading behavior and budgets:** the media catalogue has localized descriptions, but the `Media` component and asset files are missing. Confirm broken-image handling, intrinsic dimensions, actual file sizes, lazy loading and request priority.
- **Hydration masking:** `suppressHydrationWarning` is set on both `<html>` and `<body>`. No mismatch is proven here, but inspect hydration warnings without suppression before relying on it.
- **Canvas error recovery:** there is no visible error boundary in the supplied Canvas host. Exercise WebGL initialization failure and context loss to confirm they cannot interrupt the page.
- **Case-study screen-reader order:** scroll-triggered `autoAlpha` changes can make content invisible before its reveal. Check reading order and access to unrevealed sections with a screen reader and reduced motion enabled.

## Sound foundations

The supplied code awaits Next 16’s promised route `params`, sets a locale-specific `<html lang>`, includes localized metadata descriptions and meaningful localized image descriptions, and provides a skip link to `main`. GSAP animations use `useGSAP` scopes; the Lenis ticker, cursor listeners and navigation observer have cleanup paths. Reduced motion bypasses the Lenis instance and the stage Canvas.

## Deterministic QA matrix

Run each row on a clean browser profile. For visual checkpoints, wait for `document.fonts.ready` and two animation frames after scrolling. The checks below are **not run**.

| Scenario | Deterministic setup and steps | Pass criteria |
|---|---|---|
| Desktop | `/fr`, **1440×900**, DPR 1. Capture at scroll positions **0, 500 and 1000**; then traverse each act. | No unintended text/image collisions; all primary copy and contact links remain readable; no blank scene during handoffs. |
| Mobile | `/fr`, **390×844**, DPR 1. Capture at **0, 500 and 1000**. Check `document.documentElement.scrollWidth <= 390`. | No clipped page width; images do not cover summaries, headings, email or CTA; fixed navigation leaves content readable. |
| Reduced motion | Emulate `prefers-reduced-motion: reduce`, reload `/fr`, then scroll through every act. | No pinned or scroll-scrubbed motion; all content is present once in the accessibility tree; no blank immersive section or scroll lock. |
| Keyboard | Fresh load. Tab from the top through the skip link, navigation, locale links, contact links and back-to-top; activate links with Enter. | Focus is always visible; no invisible control receives focus; skip link reaches `main`; navigation works without a pointer; scroll is never trapped. |
| Resize | Start at the phone-to-immersion handoff on desktop; resize to **390×844**, then back to **1440×900** without reloading. | Scroll position stays coherent; no stale pin spacing, overflow, collapsed anchors or DOM/WebGL geometry mismatch. |
| Refresh mid-scroll | Scroll into the process pin and refresh. Repeat in the phone-to-immersion handoff. | Restored scroll lands on a coherent frame; content, nav state and scene recover; no stuck lock or blank pinned area. |
| Reverse/rapid scroll | Traverse the phone-to-immersion handoff, then reverse through it quickly several times. Repeat across the process-to-work handoff. | Transitions reverse cleanly; no stale opacity/clip state, jumps, duplicate planes or delayed nav state. |
| No WebGL | Block WebGL/WebGL2 context creation before loading `/fr`; traverse the immersive section. | No uncaught error; readable DOM fallback remains through the full chapter; no blank stretch when the phone exits. |
| Console/network | On desktop and mobile, traverse the whole page with network failures visible. Record console output and failed requests; separately throttle image loading and block one stage texture. | No production diagnostic warnings, uncaught errors, hydration warnings or unintended failed requests; failed media degrades to a deliberate fallback instead of disappearing. |