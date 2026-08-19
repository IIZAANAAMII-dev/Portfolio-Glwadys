# Skills Research

Audit of agent skills available for this project: what is installed, what the brief asked me to find,
what actually exists, and what I decided to use.

---

## 1. HEADLINE FINDINGS

1. **The official GSAP skills are already installed** at `C:\Users\klegarrec\.agents\skills\` — all
   eight of them, MIT licensed, genuinely from GreenSock. Nothing to install.
2. **`luminary19/atelier` does not contain the skills the brief describes.** The repo exists but the
   `atelier-direction` / `atelier-typography` / `atelier-motion` / `atelier-ship-reviewer` /
   `forge-*` skill names could not be found in it. §5B, §5C and §60 of the brief cannot be followed
   as written. See §4 below for what I'm doing instead.
3. **Three project-specific skills contradict each other** on architecture *and* palette. They had to
   be reconciled before any code could be written. See §3 — this is the most important section.
4. **Two installed skills actively contradict the brief** (`modern-web-design` prescribes
   glassmorphism; `gsap-plugins` prescribes ScrollSmoother). Resolved in §5.
5. I **did not install any third-party skills.** Reasoning in §4.

---

## 2. INSTALLED SKILLS — 26 distinct, across 5 directories

Duplicated across `.windsurf/skills/` and `.agents/skills/` (verified byte-identical):
`gsap-scrolltrigger`, `awwwards-animations`, `modern-web-design`, `react-three-fiber`,
`threejs-webgl`, `r3f-fundamentals`, `r3f-animation`, `r3f-lighting`, `r3f-shaders`, `r3f-textures`.

### Tier A — used actively

| Skill | Location | The rules I'm actually taking from it |
|---|---|---|
| `gsap-core` | `~/.agents` | camelCase vars; prefer `x/y/scale/rotation` over transform strings; `autoAlpha` not `opacity` for show/hide; `gsap.matchMedia()` for breakpoints **and** `prefers-reduced-motion`; `immediateRender: false` on stacked `from()` tweens on the same property |
| `gsap-timeline` | `~/.agents` | timelines over `delay` chains; position params `"+=0.5"`, `"<"`, `">"`; `addLabel()` for phases; ScrollTrigger goes on the **timeline**, never a child tween |
| `gsap-scrolltrigger` | 3 copies | register once; `pinSpacing` semantics; `scrub` number = seconds of catch-up; **`containerAnimation` horizontal tween must use `ease: "none"`**; create triggers in page order or set `refreshPriority`; `ScrollTrigger.refresh()` only on real layout change |
| `gsap-react` | `~/.agents` | `useGSAP()` with a `scope` ref; `contextSafe()` for event handlers; `ctx.revert()` if using raw `useEffect`; never run GSAP during SSR |
| `gsap-performance` | `~/.claude` | transform + opacity only; `will-change` sparingly and only while active; `gsap.quickTo()` for pointer-driven values; `stagger` over N tweens |
| `gsap-utils` | `~/.agents` | `mapRange`, `clamp`, `snap`, `interpolate`, `toArray`, `selector(scope)` |
| `awwwards-animations` | project | **the Lenis↔GSAP contract** (see §5); timing budgets — micro 150–300ms, UI 300–500ms, page 500–800ms, stagger 0.02–0.1s; `clip-path: inset(100% 0 0 0)` image reveal; horizontal track `x: () => -(scrollWidth - innerWidth)` |
| `editorial-craft-atelier` | project | asymmetric composition; FRONT/BEHIND layering; typography as structure; motion must communicate intention; the anti-slop list |
| `glwadys-awwwards` | project | **primary architecture directive** — palette, type scale, easing whitelist, quality tiers, anti-slop |

### Tier B — narrow, specific use

| Skill | Used for | Explicitly NOT used for |
|---|---|---|
| `gsap-plugins` | `SplitText` (kinetic type), `Flip` (contact-sheet → moodboard), `CustomEase` | `ScrollSmoother` — conflicts with Lenis; `Draggable` unless MGC genuinely earns it |
| `web3d-integration-patterns` | the DOM↔WebGL handoff: `getBoundingClientRect()` → WebGL viewport mapping, quality tiers | its "persistent Canvas" framing — the brief forbids a global canvas |
| `webgl-performance-mobile` | DPR clamping, `.dispose()` discipline, pausing the loop off-viewport | — |
| `react-three-fiber`, `r3f-fundamentals`, `threejs-webgl` | *only* if the one local scene is built: Canvas setup, `useFrame` ref-mutation (never `setState`), `frameloop="demand"`, disposal | scene-graph maximalism |

### Tier C — deliberately ignored

| Skill | Why |
|---|---|
| `gsap-frameworks` | Vue/Svelte. Project is React. |
| `r3f-shaders` | Pushes toward shader-for-its-own-sake. At most one tiny distortion uniform is in scope. |
| `r3f-animation`, `r3f-lighting`, `r3f-textures` | GLTF animation blending, morph targets, three-point lighting rigs, PBR texture sets — all far beyond one media-plane scene. |
| `modern-web-design` | **Prescribes glassmorphism** (`backdrop-filter: blur(10px) saturate(180%)`, `border-radius: 16px`) which is on the anti-slop list, and is exactly the legacy site's failure. I take *only* its Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms) and 44×44px touch targets. |
| `glwadys-creative-portfolio` | Superseded — see §3. |
| `find-skills` | Meta-skill. |

---

## 3. RECONCILING THE THREE PROJECT SKILLS ⚠️

All three describe this same portfolio, differently. Left unresolved, they produce an incoherent site
— which is part of why the legacy build drifted.

| | `glwadys-awwwards` | `glwadys-awwwards-motion` | `glwadys-creative-portfolio` |
|---|---|---|---|
| Structure | **7 acts** | chapters + `SceneDirector` | **12 steps** ("Creative Layers") |
| Palette | explicit hex | "charbon/ivoire/or", no hex | none given |
| 3D model | persistent Canvas, quality tiers | `SceneDirector` + `SceneLayer` gating, 5 depth lanes, `CAMERA_PATH` | persistent Canvas, camera dive, GLSL |
| Language | EN | FR | EN |

### Palette conflict — three competing sets

| Role | `glwadys-awwwards` | legacy `tailwind.config.ts` | Decision |
|---|---|---|---|
| Ground | `#0B0B0B` | `#0B0C0E` | resolved in `docs/creative-direction.md` |
| Ivory | `#F7F2EA` | `#F5F3EF` | ditto |
| Champagne | `#DDCBA8` | `#D8C29D` | ditto |
| Espresso | `#1E1812` | `#7D4F39` (warm brown) | ditto |
| Clay/accent | `#A85D4C` | `#D66853` / `#E27D60` | ditto |

### Resolution

- **`glwadys-awwwards` is the base** — it is the only one with explicit hex values, a type scale, an
  easing whitelist and a coherent quality-tier definition.
- **Adopt from `glwadys-awwwards-motion`**: the `NO UNSTRUCTURED 3D` rule (every 3D object must have a
  scene, a lane, a narrative function and a defined transition, or it isn't rendered), the scrub band
  `0.45–0.6`, transitions `0.45–0.9s`, stagger `0.05–0.1s`, and "one property, one engine".
  **Reject** its `SceneDirector` / persistent-canvas / `CAMERA_PATH` machinery — the brief forbids a
  global canvas, so scene gating is unnecessary: a scene that doesn't exist needs no gate.
- **Retire `glwadys-creative-portfolio`**: its 12-step structure conflicts, it defines no palette, and
  its "persistent R3F Canvas maintaining state without remounts" is the exact thing §2 of the brief
  forbids. Its one lasting contribution — FRONT vs BEHIND — is already in `editorial-craft-atelier`.
- **All three assume a persistent Canvas.** The brief overrides all three. Where a skill and the brief
  disagree, **the brief wins**.

The brief's own 18-beat journey supersedes all three act-lists. Mapping lives in `docs/storyboard.md`.

---

## 4. ONLINE RESEARCH — what the brief asked for vs what exists

| # | Target from brief | Verified? | Finding | Decision |
|---|---|---|---|---|
| A | `greensock/gsap-skills` | ✅ exists, MIT, official | 8 skills — **already installed locally** | **SKIP** (have it) |
| B | `luminary19/atelier` — atelier-direction/ux/typography/layout/motion/scroll/webgl/perf-a11y/build-engineer/ship-reviewer | ⚠️ repo exists (~1 star), **skill names not found** | Described as "anti-slop frontend design skill suite, 11 skills". The specific names in the brief could not be located. Near-misses: `jangles-byte/atelier`, `IamK77/Skill/skills/atelier`, `atelier-oss/atelier` (a CLI, not skills) | **SKIP** — see below |
| C | Forge (`forge-model`, `forge-texture`, …) | ❌ not found | Moot: no bespoke 3D asset is needed. Phone is DOM/CSS per §16 | **SKIP** |
| D | `freshtechbro/claudedesignskills` | ✅ exists, MIT, 664★ | Upstream of the locally-installed `threejs-webgl`, `react-three-fiber`, `web3d-integration-patterns`, `modern-web-design` | **SKIP** (already installed) |
| E | `saviorhidc/claude-web-design-skills` → `screenshot-workflow` | ✅ exists, 0★ | Ships a Puppeteer `screenshot.mjs` | **SKIP** — I built `scripts/shoot.mjs` instead |
| F | `borghei/Claude-Skills` → `senior-frontend` | ✅ exists, 489★, MIT + Commons Clause | Next.js scaffolding, bundle analysis, a11y | **SKIP** — scaffolding value only; repo is 368 skills |
| G | `MengTo/Skills` → interaction design | ✅ exists, 153 skills | `html-to-interaction-prompts`; also `cinematic-scroll-storytelling`, `masked-reveal`, `staggered-word-reveal` | **SKIP** — overlaps `awwwards-animations` |

Also surfaced (not installed): `DeHor-Labs/visual-eyes`, `luukalleman/premium-design-skill`,
`xiaopu-ai/web-design`, `miqdadbadjuber/anti-slop`, `sceboucher/hypertype`,
`aslanmazhidov/design-review-skill`, `doodledood/…/scrollytelling`.

### Why I installed nothing

1. **Coverage is already complete.** Motion → 8 official GSAP skills + `awwwards-animations`.
   Editorial/anti-slop → `editorial-craft-atelier` + `glwadys-awwwards` + this brief, which is
   stricter than any of the candidates. WebGL → 8 R3F/Three skills for one small scene.
2. **The one real gap was visual QA, and I closed it directly.** `scripts/shoot.mjs` drives the
   installed Chrome, captures at arbitrary scroll depths, emulates `prefers-reduced-motion`, and
   reports console errors. Better fitted than a generic screenshot skill — and it works, which
   matters because Playwright's own Chromium download deadlocks on this machine (§6).
3. **Supply-chain caution.** Most candidates are unlicensed, low-star, and several ship executable
   scripts. Adding six of them to satisfy a checklist is unjustifiable risk for zero new capability.
4. **Prompt-collision risk.** The three project skills already contradict each other (§3). Adding
   more opinionated design skills makes drift worse, not better.

**The `atelier-ship-reviewer` gap (§60) is real.** Since it doesn't exist, the adversarial review is a
written checklist derived from §60 + §61 of the brief, executed against screenshots via
`scripts/shoot.mjs`, recorded in `docs/ship-review.md`. Same function, no phantom dependency.

---

## 5. CONTRADICTIONS AND RULINGS

| # | Conflict | Ruling |
|---|---|---|
| 1 | `modern-web-design` prescribes glassmorphism ⟷ `editorial-craft-atelier` "No generic glassmorphism" ⟷ `glwadys-awwwards` "no cards, no bento, no glass, no rounded everything" | **Anti-glass wins, 2-to-1 and the brief agrees.** Glassmorphism *is* the legacy failure — `.glass-panel` was on nearly every element. `modern-web-design` contributes Web Vitals only. |
| 2 | `gsap-plugins` documents ScrollSmoother ⟷ `glwadys-awwwards` + `awwwards-animations` + brief §41 say Lenis | **Lenis.** ScrollSmoother needs `#smooth-wrapper`/`#smooth-content` and would be a second smooth-scroll engine. Brief §41: one system only. |
| 3 | R3F skills encourage rich 3D ⟷ brief §2/§3 restrict to one local scene | **Brief wins.** R3F skills are reference material, not an agenda. |
| 4 | Three project skills all assume a persistent Canvas ⟷ brief §2 forbids a global Canvas | **Brief wins.** Mount → play → transition out → dispose → unmount. |
| 5 | `gsap-core` lists `back.out(1.7)` / `elastic.out(1, 0.3)` ⟷ `glwadys-awwwards` bans bounce/elastic/spring/back | **Ban holds.** Whitelist: `power2.out`, `power3.out`, `power4.inOut`, `expo.out`, `sine.inOut`, `none`, plus named `CustomEase`s. |

### The one Lenis↔GSAP contract for this project

```js
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Non-negotiable, from `awwwards-animations` and corroborated by the M-TRUST teardown. Exactly one
Lenis instance; no Locomotive; no ScrollSmoother.

---

## 6. TOOLING NOTE — how visual QA actually works here

`npx playwright install chromium` **reliably deadlocks on this machine**: the 137 MB archive
downloads to `%TEMP%` and then extraction stalls indefinitely at ~2 files (almost certainly
antivirus). A killed run also leaves a stale `%LOCALAPPDATA%\ms-playwright\__dirlock`, which makes
every subsequent run hang waiting on the lock.

Workaround, in place and verified: `@playwright/test` is installed for the API only, and
`scripts/shoot.mjs` launches the system Chrome via `executablePath`
(`C:\Program Files\Google\Chrome\Application\chrome.exe`, falling back to Edge; overridable with
`CHROME_PATH`). No browser download required.

```bash
node scripts/shoot.mjs --selfcheck
node scripts/shoot.mjs --url http://localhost:3000/fr --out act1 --at 0,0.25,0.5,0.75 --full
node scripts/shoot.mjs --url http://localhost:3000/fr --out mobile --viewport 390x844
node scripts/shoot.mjs --url http://localhost:3000/fr --out rm --reduced
```

Writes PNGs plus a `-report.json` (page height in screens, console errors) to `docs/screenshots/`.
