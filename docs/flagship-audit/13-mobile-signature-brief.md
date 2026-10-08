# 13 — Mobile-first flagship / signature continuity

## Authority
Single writer only in the isolated worktree. No commit, push, merge, deploy or publication.
Use the ChatGPT-backed Jarvis route. Preserve FR/EN/KO, native scroll, accessibility, reduced motion, honest direction-study labels, zero global WebGL/canvas.

## Current gate
V12 fixed the major P0 fit/contact defects. Engineering is healthy. This pass exists because the site is still visually below a true Awwwards flagship bar, especially on mobile.

## North star
Mobile must feel DESIGNED at 390×844, not compressed from desktop.
The site should have one unmistakable identity: THE EDIT — crop, selection, registration, transmission.

## Priority 1 — THE EDIT must tell one believable visual decision
Current problem: contact-sheet imagery and selected jewelry image still feel disconnected.
Build a continuous selection story without fabricating client proof:
- step 0: finished phone frame;
- step 1: reveal a contact/proof sheet that visibly contains the SAME source image/crop family used for the final selection;
- step 2: oxblood selection mark visibly isolates that exact frame;
- the selected frame expands/crops into the exact Yuna cover source;
- handoff uses existing View Transition shared-element system;
- no unrelated crossfade;
- no blank frame;
- reverse step must remain coherent;
- reduced motion uses clear instant states.

If the existing contactSheet asset cannot truthfully contain the same image, construct the sheet composition from existing Yuna direction-study assets in DOM/CSS rather than pretending an unrelated image was selected.

## Priority 2 — Mobile flagship composition at 390×844
Audit every section as its own composition:
Hero, Edit 0/1/2, Work/Yuna, Journey, Expertise, Contact.

For each:
- keep one clear focal hierarchy;
- keep fixed nav from visually fighting reading;
- maintain >= 24px visual breathing room above nav for the last meaningful line/control;
- no text/image intersection;
- no content relying on hover;
- no horizontal rail;
- preserve 44px targets and exact 390px width;
- use responsive typography with deliberate mobile line breaks, not accidental wrapping;
- use image crops specific to mobile, not desktop crops squeezed down.

Mobile Hero:
- preserve immediate identity/role;
- stronger crop/registration signature around the hero image;
- avoid generic fade/slide;
- first viewport must feel authored and recognizable.

Mobile THE EDIT:
- controls reachable with one thumb;
- each state fits cleanly above nav;
- selection line/crop must remain visually readable at phone size;
- handoff should feel like the image itself travels into Yuna.

Mobile Work:
- Yuna: quiet precision and crop detail;
- MGC: controlled community/contact-sheet rhythm;
- Comptoir: material/macro emphasis;
- no generic same-layout repetition across all three.

Mobile Journey:
- keep ledger clarity;
- make the active-year playhead obvious without animation noise;
- row endings never disappear behind nav.

Mobile Expertise:
- tactile, not dashboard-like;
- each row should have a visible active/focus state that also makes sense on touch;
- consider alternating editorial indentation/rule rhythm if it improves authorship without hurting scanability.

Mobile Contact:
- final screen must feel like a deliberate ending;
- email remains primary;
- use one restrained "Transmettre" gesture/rule movement;
- keep footer/return fully visible above nav;
- no image.

## Priority 3 — Desktop signature without over-decoration
Do not redesign desktop from scratch.
Strengthen only:
- hero reservation/crop identity;
- edit selection chain;
- project differentiation;
- final contact transmission payoff.

Avoid adding generic particles, glass, cursor gimmicks, large WebGL, infinite marquee, noise-heavy overlays or gratuitous pinning.

## Priority 4 — Navigation behavior
Keep all five destinations.
On mobile, consider a subtle compacting/receding state while reading if it materially improves composition, but:
- navigation must remain reachable;
- no disappearing navigation trap;
- keyboard/focus remains correct;
- safe area respected;
- test 320px and 390px.

## Motion grammar
Only use:
- Réserver
- Tirer
- Annoter
- Caler
- Transmettre

Every animation must express one of these verbs.
No generic y+opacity reveal chains.

## Performance / engineering
- no new heavy dependency
- CSS / small React client logic / View Transitions preferred
- no canvas
- clean console/network
- exact 320 and 390 scrollWidth
- reduced motion
- keyboard
- fast forward/reverse Edit taps
- resize
- refresh mid-scroll
- no-WebGL remains irrelevant and harmless
- typecheck/lint/build/diff all pass

## Evidence required
Fresh optimized production build and captures:
desktop 1440×900:
hero, edit0, edit1, edit2, handoff, work, journey, expertise, contact
mobile 390×844:
same 9 states
mobile 320×800:
hero, edit2, contact-bottom

Also record:
- nav target rectangles
- nav clearance to meaningful content
- handoff source/target transition-name cleanup at 1600ms
- keyboard activation of Edit controls/handoff
- rapid forward/reverse Edit sequence
- console/warnings/failed requests
- scrollWidth
- reduced motion
- FR/EN/KO HTTP/lang

Write docs/flagship-audit/13-builder-results.md and stop for mentor review.
NEVER self-PASS.
