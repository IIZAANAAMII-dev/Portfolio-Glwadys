# 11 — Mentor visual pass: every-stage Awwwards correction

## Current verdict
The rebuild is technically clean and readable, but not yet visually distinctive enough for a flagship Awwwards portfolio. The problem is no longer collisions or WebGL instability. The problem is authored continuity and signature interaction.

## Section-by-section gate

### 01 Hero — REOPEN
Strength: elegant, readable, good hierarchy.
Defect: reads as familiar luxury portfolio template: large Didone + burgundy still life + centered bottom nav.
Correction:
- preserve composition and copy;
- add one restrained authored entrance and one scroll departure mechanism tied to THE EDIT concept, not generic y+opacity;
- use crop/registration logic: the hero visual should feel "reserved" and then become part of the edit language as the user leaves the hero;
- do not add particles, glass, neon, or global WebGL.

### 02 THE EDIT / Process — REOPEN, highest priority
Strength: method hierarchy now works and phone step is legible.
Defect: three click states feel like a component demo. The final selected frame jumps to Yuna instead of physically transmitting.
Correction:
- retain 3 accessible states and controls;
- make step 0→1 a continuous phone-shell release: phone crop expands into proof/contact sheet, not a hard image swap;
- make step 1→2 visibly select one frame: oxblood crop path/line should travel and settle, image should zoom/crop into the exact Yuna framing;
- implement a true shared-element Yuna handoff using the browser View Transitions API where supported, with a safe instant-scroll fallback;
- mark source and target with a shared transition name only during handoff;
- target animation ~700–1000ms, restrained luxury easing, no flash/blank frame;
- target Yuna section must land at heading/cover with ~48px offset on desktop/mobile;
- preserve keyboard/touch/reduced-motion.

### 03 Selected Work — REOPEN
Strength: clean case-study readability.
Defect: static two-column editorial listing; not enough authored differentiation between cases.
Correction:
- keep copy and honest direction-study labels;
- give Yuna, MGC, Comptoir distinct visual behaviors using CSS/view-driven micro-interactions rather than generic reveal presets;
- Yuna: precise crop / stillness / detail;
- MGC: controlled contact-sheet/community assembly;
- Comptoir: restrained macro/material emphasis;
- no image may cross body copy.

### 04 Parcours — REOPEN
Strength: strong typography and chronological clarity.
Defect: reads as static grid/catalogue.
Correction:
- preserve grid;
- add a single editorial playhead/rule or active-year behavior that responds to viewport/hover/focus;
- no continuous scaling/fading of every item;
- mobile must remain a vertical ledger with no obscured rows.

### 05 Expertise — REOPEN
Strength: clean list.
Defect: visually generic service list.
Correction:
- keep list semantics;
- add tactile row interaction on hover/focus: oxblood rule/number, subtle type shift or description reveal;
- mobile should not depend on hover;
- avoid accordion/dashboard feel.

### 06 Contact — REOPEN
Strength: clean, readable conversion content.
Defect: lacks final memorable payoff.
Correction:
- keep image-free contact;
- turn the email row into the final "Transmettre" gesture: restrained rule travel / arrow movement / subtle background warmth on hover/focus;
- no giant animation; final screen should feel deliberate and calm.

## Global navigation / mobile
- fixed nav currently visually overlaps the bottom of content at some mobile checkpoints even if geometric collision test is false;
- increase section-end breathing room/safe-area so the last readable row is never visually crowded by nav;
- maintain all five destinations and >=44px targets;
- preserve exact 390px scrollWidth.

## Technical
- no global WebGL
- no persistent canvas
- keep native document scroll
- no new heavy dependency unless essential
- prefer CSS, View Transitions API and small local client logic
- prefers-reduced-motion must disable handoff animation cleanly
- no console warnings/errors
- keep fr/en/ko
- original repo untouched
- no commit/push/deploy

## Evidence required before stopping
Fresh screenshots at 1440x900 and 390x844 for:
hero, edit step0, edit step1, edit step2, Yuna handoff, work, journey, expertise, contact.
Run:
typecheck, lint, build, git diff --check.
Then write docs/flagship-audit/11-builder-results.md and STOP for mentor. Never self-PASS.
