# 19 — Real iPhone social P0 fixed, before/after and WebKit gate (2026-10-09)

## What the actual screenshot and live test showed
The user's 7 real screenshots exposed that Act 02.2, `Ce qui le tient`, displayed five faded rows and sometimes overlaid hero-only annotations and an old floating photograph on top of the copy.
- **Reproduced initial row opacity** in Chromium 390×844 at scrub 3.18: `[0.61, 0.41, 0.21, 0.01, 0]`. That is genuinely illegible text, not artistic intention.
- Independently reproduced a **race between the autonomous intro timeline and scrolling**. Scroll around 2.2s after loading to chapter 02.2: both `[data-notebook-detail]` elements, `ideas become direction` and `01 / Creative notebook`, erroneously remained alpha `1`, stacked on Strategy list. Waiting ~3.6s before scrolling avoided the race.
- Independently reproduced WebKit's clip-path compositor inconsistency: old `.heroFrame` retained opacity 1 and bled across the Social strategy text at x0..82px, even when Chromium's frame was correctly clipped and invisible.

## Actual tracked fixes in ActScrollStory
1. Treat the five strategy labels as one readable semantic index: remove the GSAP stagger from `behindRows`, reveal all at `T.behindIn+0.22`, 0.14 scrub beats, rather than leaking readability all the way to late rows. Retains reversible GSAP behavior.
2. Scroll is the authoritative film controller: on motion after the first hero hold, stop the independent intro if still active. Explicitly clear hero-only decorative details, resolving the early-scroll race; scrub timeline also uses `overwrite: auto` on initial hero-only state transitions.
3. Hero photo is faded out by both alpha and the existing clip-path during exit. Its semantic ownership ends in Social; the transition no longer relies solely on a WebKit clip mask.
4. The `.behind` design becomes **an actual opaque ivory page**; z-index is raised to the photographic plate layer. This is a better literal tactile paper effect and physically blocks outdated frames. A CSS `:has()` fallthrough also makes opening-only `.heroFrame` inert whenever the GSAP-owned `.behind` is visible. Tested in Chromium and WebKit on iPhone-sized viewport.

## Verification
- Automated Chromium and WebKit at 390×844, FR, six scroll states including reverse. At the same middle chapter frame 3.35, all five rows **alpha = 1**.
- Intro race regression: wait only 2.2s before forward scroll to Behind. Both hero handwriting elements now computed opacity **0** and CSS visibility **hidden** (original alpha was 1 for both); repeat after 3.6s also alpha 0.
- WebKit browser hit-testing after layered matte: the top layer at x25/y525 belongs to Behind's semantic copy, not an image left over from Hero. Browser computed `.heroFrame` opacity **0** in WebKit and Chromium.
- Proof: `docs/qa/film-gate/behind-webkit-3-35.png` and `behind-chromium-3-35.png`, plus samples from `qa/mentor-behind-contrast.mjs` and `qa/mentor-notebook-ghost.mjs`.
- No JS page errors or document overflow in sampled tests. Typecheck/lint/build/diff-check must pass before committing; independent mobile Safari hardware remains unverified.

## Remaining P0s for Sol 6.1 Max builder
Consult **docs/flagship/18-iphone-user-feedback-sol61-max.md**: repeated editorial photographs across Social→Immersion→Contact Sheet; limited purpose in stacked-collage images, awkward phone with nav overlays, confusing contact sheet, physical camera seams in ALL nine acts. This fix is a specific P0, **not a statement that the full website is at 10/10**. Creativelead read-only audit `t_bbf9d5c8`, then builder `t_84813115`, QA `t_27e19338`, independent jury `t_78ac6e14` must continue. All pinned to `gpt-6.1-sol` / `openai-codex`; for profiles `agent.reasoning_overrides.gpt-6.1-sol=max`. No public production launch.
