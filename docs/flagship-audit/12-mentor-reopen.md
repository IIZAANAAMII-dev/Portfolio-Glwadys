# 12 — Independent mentor gate: 2026-10-08 05:43 CEST

## Verdict: REOPEN — no Awwwards PASS

Fresh optimized Next.js build was served on localhost:4399. Two independent Playwright runs were captured at 1440×900 and 390×844, with deep three-step Edit/handoff captures in qa/gate-20261008-0545. Do not treat the earlier V11 builder's self-report as the gate.

## Engineering evidence

- Typecheck: PASS. Lint: 0 errors, 1 existing warning (unused `before` in qa/independent-20261008/review.mjs:26). Build: PASS for fr/en/ko. `git diff --check`: PASS.
- Both viewports: HTTP 200, no console errors/warnings, no failed requests, no broken images, no canvas; scrollWidth exactly viewport width.
- Five bottom navigation destinations exist and measure >=44px height (mobile ~69×44px).
- Edit states 0,1,2 all reachable. Handoff lands Yuna cover at top 48px, hash #act-work-yuna, heading top 72px desktop / 578px mobile. At 1100ms temporary transition names clear. Reduced motion and no-WebGL preserve content and reach Yuna.
- Rapid reverse and resize preserved width; mid-scroll reload returned a usable page. Full keyboard/screen-reader/trace performance not independently proven.
- Fresh screenshots show desktop process CTA is partially occluded by fixed bottom nav at edit states 1 and 2; mobile nav visually covers Parcours 2024, Expertise row 06 and contact footer/return link at selected section-top frames.

## Four specialist review lenses (mentor synthesis; independent model jury not yet completed)

### Art direction and typography — REOPEN (7.1/10)
Strong warm editorial palette and display typography; mobile hero readable, study labels honest. But hero and contact still resemble a restrained luxury template; the same jewelry crop repeats as hero, process and Yuna proof. Need a more recognizable authored edit-mark identity, less repeated art direction, and a stronger final transmission payoff. Preserve hierarchy and restrained palette.

### Motion and narrative continuity — REOPEN (7.0/10)
The three edit states now move with inset/opacity and shared-element handoff exists, but the contact sheet changes to an unrelated jewelry image: the visual decision is asserted, not fully demonstrated as a single frame being selected. Desktop CTA gets hidden behind nav at process anchor. Preserve browser View Transitions and reduced-motion instant fallback; improve the visible same-image selection chain without WebGL or heavy libraries.

### Mobile UX and accessibility — REOPEN (7.2/10)
Dedicated 390px vertical composition is readable, no horizontal overflow, touch targets 44px, contact email and LinkedIn accessible. However fixed nav masks lower text at anchored screenshots; process buttons crowd nav, copyright/return are masked in contact's first frame. On mobile, Yuna heading is below the fold after handoff (cover starts 48px, heading 578px); acceptable only if scroll affordance is clear. Need explicit bottom breathing room and a nav behavior that never visually fights reading.

### Interaction, performance, engineering — REOPEN (8.2/10)
Static build and browser runtime healthy; no global WebGL/canvas, 3 locales. One lint warning remains. Test coverage lacks keyboard-only navigation and focus proof, fast/reverse edit taps, slow network and actual performance trace. View Transition cleanup should be tested at 1600ms on the no-WebGL path (900ms capture still showed a transient target name). Avoid unverified performance claims.

## Prioritized single-writer correction brief

P0. Ensure desktop Edit controls remain fully visible at 1440×900 for states 0/1/2 when #act-process is aligned at top. Fix vertical fit or position, not by hiding the nav or adding a meaningless spacer. Target >=24px clearance above nav.
P0. Make mobile contact footer and return-to-top link fully readable when user reaches the bottom; nav must not permanently mask either. Preserve 5 destinations and >=44px touch targets.
P1. Improve mobile section-entry frames (Parcours, Expertise) so nav never appears to cut the last readable row in half; test scroll-up, scroll-down and 390px screenshot states.
P1. Strengthen THE EDIT selection continuity: the selected Yuna image should emerge from the contact-sheet frame via an authored crop/mark transformation, not feel like an unrelated crossfade. Preserve existing 3 accessible steps and shared-element handoff.
P1. Improve hero-to-edit identity and project differentiation without generic entrance presets, new global WebGL, or expensive dependencies.
P2. Remove lint warning, prove keyboard/focus, 320px and 390px overflow, no-WebGL cleanup at 1600ms, rapid reverse, refresh, and performance sanity.

Keep untouched: original repo, multilingual FR/EN/KO, native scroll, no canvas, honest direction-study labeling, image-free contact, safe-area-aware bottom nav, calm typography and reduced-motion path.

## Exit criteria
Fresh independent screenshots for all stages and both viewports, clear CTA/nav clearance, exact mobile width, zero unintended text/media collisions, keyboard and reduced-motion proof, clean typecheck/lint/build/diff, and cold jury with no credible REOPEN. No commit, push, deploy or merge.
