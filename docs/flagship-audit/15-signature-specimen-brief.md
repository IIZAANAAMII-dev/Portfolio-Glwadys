# V15 — SIGNATURE / FIRST IMPACT — Creative Mentor Brief

Status: CREATIVE SPECIMEN TO BE REVIEWED. Never self-label an Awwwards PASS.

## Context
- Current candidate V14 is technically solid, screenshot gallery published in README.md / docs/previews, GitHub branch jarvis/awwwards-rebuild, commit badac8c.
- An independent Astra max V14 screenshot jury is concurrently running; it reviews immutable V14 screenshots. Do not edit docs/previews or README while V15 is being drafted.
- **MANDATORY BEFORE ANY IMPLEMENTATION:** read `docs/flagship-audit/16-legacy-motion-audit.md` and examine old captures/videos under `docs/legacy-motion/`. The user explicitly wants to preserve the actual cinematic GSAP choreography from origin/main `d4fefe2`, not have Jarvis replace it with generic motion. Preserve the ambitious old opening scale/masking/cadence, phone montage and purposeful cross-chapter handoffs; do NOT resurrect the old persistent StageLayer/StageScene, floating cards over copy, GPU stalls, long multi-pin scroll, or restricted mobile navigation.
- V14 actual screenshots show: desktop Hero is elegant but familiar luxury editorial split; mobile Hero is legible but visual subject is too modest and TYPE/EDIT wordmark feels pasted alongside a thumbnail; Work reads like ordinary two-column cases. Contact remains calm but not memorable.
- The user explicitly requires 100% impressive Awwwards ambition and genuinely exceptional mobile, not fake quality scores.

## Design thesis
THE EDIT must become a visual *action* one can recognize without reading copy.
The signature is a physical, precise oxblood crop/registration stroke that finds, chooses and carries a real visual through the story. Use it in the right 2–3 moments only; avoid repeated overlays.

## V15 high impact only (do not remake six sections)

### Specimen 1: Hero as a cinematic editorial cover — P0
- Increase the visual authority of the hero photo in a distinct authored composition on desktop and a custom one on mobile 390x844.
- Must still show full "Glwadys Dalleau", clear descriptor, project link and the honest concept-study caption in the first viewport.
- Make typography and image feel physically composed, not independent columns. Use the registration mark as connective tissue between heading and image.
- Make opening visually remarkable in a static screenshot first. Motion second.
- One premium GSAP authored entrance: image is *registered* with line/crop drawing and typography follows with a purposeful edit cadence. A reversible on-scroll transition preserves image->THE EDIT semantics. No generic fade-up parade.
- Respect iOS safe areas and mobile notch, 320px small screens; no clipped text.

### Specimen 2: Work as an editorial exhibition — P0
- At least one project must have a signature composition that does NOT read like a card or a two-column blog post.
- Keep Yuna same-source handoff intact; do not move or clone Yuna target element so View Transition/GSAP continuity remains.
- MGC should tell a community story via a distinctive multi-image assembly with hierarchy; Comptoir should feel material/macro and tactile; Yuna should feel precise luxury stillness.
- Different visual emphasis, image crop language and arrangement per case, while preserving every factual line and all direction-study disclaimers. No fabricated metrics/deliverables.
- On mobile, use strong editorial crops and clear rhythm; no horizontal overflow/hover dependency. Avoid three virtually identical stacked cases.

### Specimen 3: Contact final payoff — P1
- Maintain image-free closing, email link as primary CTA, full name/availability/footer.
- Make one crafted transmission moment via the red registration stroke crossing into the email gesture on focus/hover/tap; not an enormous unrelated animation.
- Keep 44px touch target and focus visibly distinct.

## Engineering / ethical constraints
- GSAP 3.15 already installed. Use existing MotionScope architecture, GSAP ScrollTrigger/Flip; no Lenis, infinite pinning, global WebGL or full viewport canvas.
- Preserve native scroll, keyboard, reduced motion, FR/EN/KO, no horizontal overflow, readable semantic DOM.
- The user wants mobile-first visuals at 390x844 and 320x800. Don't let nav dock eat the final action.
- Work only on isolated worktree branch jarvis/awwwards-rebuild, do not touch main or push/merge/deploy. Do not edit or refresh the published V14 screenshots in docs/previews until review passes.
- Read AGENTS.md, V14 implementation and current components before changing anything.
- Do not re-install/update dependencies without necessity.

## Evidence and stop gate
- Run npm run typecheck / lint / build and git diff --check.
- Capture fresh optimized production browser screenshots Hero/Work(MGC,Comptoir,Yuna)/Contact at 1440x900 and 390x844 and 320x800, plus intermediate animated hero state with Playwright Docker; save under qa/sol15-<date>/.
- Verify no console/network errors, motion reduced, hero reverse scroll and 390/320 scroll widths exact, nav clearance >=24px.
- Write docs/flagship-audit/15-sol-creative-specimen.md with changed files, screenshots, results, remaining problems and caveats.
- STOP after one coherent specimen pass for independent mentor/Astra jury, do not self-PASS or touch README gallery yet.

## Independent Astra max cold jury findings — MANDATORY P1
Read `docs/flagship-audit/15-astra-cold-jury.md` alongside the legacy motion audit.
- The selected Yuna frame changes its crop/aspect when passed to Work. Repair by preserving the true selected crop across states **or explicitly narrating the intended format adaptation**; no misleading claim of exact crop.
- The crop mark collides with the 01 badge in contact-sheet state; maintain guaranteed clearance even mid-Flip.
- Show a concrete editorial choice, not an abstract annotation: propose a short visible note on the same selected photograph (e.g. "Le geste avant le bijou"), clearly presented as concept direction not real client quote.
- Mobile Process and first Yuna viewport must show an actual strategy insight sooner, not merely large images.
- Hero should regain **the monumental typography + staged image assembly from the user's original animations**, without mandatory locked scroll.
- Keep five mobile nav destinations and check dock prominence.

## Legacy motion source-of-truth
The historical source is `d4fefe2` on `main`. The audit compared its real browser playback, not just code; the old intro's staged typography, media-plane orchestration and phone montage are worth **design translation**, but the old global StagePlane stack produces persistent photos over text, THREE.Clock warnings, ReadPixels GPU stalls and excessive long pinning. **DO NOT restore that code architecture**.
Use the historical video links and image proofs, then implement a new bounded scene with CSS/GSAP, respecting real-mobile performance and accessibility.
