# Reference Research

The 12 references from the brief, with honest verification status, what each actually is, and a
USE / REJECT verdict.

**Verification legend**
`✅ VERIFIED` — I read the Awwwards submission page and/or credible technical teardown; element list confirmed.
`◐ PARTIAL` — site and author identified, mechanic named by its own submission, but implementation not inspected.
`○ INFERRED` — mechanic described from the general technique, not from this specific site.

> Two references the first research pass reported as "could not locate" were in fact resolvable, and
> both mattered. Recorded here so the corrections aren't lost:
> - **iN** is **`in.com.br`** (Brazilian agency, submitted by Programatório PRO). Its Awwwards element
>   list explicitly contains *Loader, Morph transition, Page transition, Section transition, Home
>   page, About us*. This is the brief's highest-priority reference and it is real.
> - **Michael R. Johnson Portfolio** is **`michaelrichardjohnson.com`** (submitted by danny-lines),
>   element tagged `scroll` + `gallery`.

---

## 01 — 0110 Studio ◐

Local scroll-driven 3D scene. `awwwards.com/inspiration/3d-scroll-animation-0110-studio-portfolio-web`

- **Mechanic** — scroll-scrubbed camera through a WebGL scene with a deliberately small object count, entering and leaving as a bounded episode rather than a persistent world.
- **Why it works** — the 3D is an *event*. Because it starts and ends, it reads as a set piece instead of a gimmick.
- **Learn** — this is the exact licence for the Phone Portal: one bounded cinematic, then back to DOM.
- **Don't copy** — an all-3D site. Wrong medium for a social-media portfolio, and it would bury the content and the SEO.
- **Verdict: USE the containment principle. REJECT the all-3D architecture.**

## 02 — Michael R. Johnson ◐

Z-axis depth gallery. `michaelrichardjohnson.com`

- **Mechanic** — gallery arranged along Z; scroll moves the viewer *through* it rather than *past* it. Submission also lists a bespoke loader.
- **Why it works** — depth converts a grid into a place. Approach/recede carries more physicality than translation.
- **Learn** — the one legitimate role for Z inside the WebGL scene: media at different depths that scroll resolves into a single plane.
- **Don't copy** — Z-depth as the whole navigation model; and never expose "Z axis" as visible copy (the legacy site did exactly that — §50 violation).
- **Verdict: USE inside the local scene only. REJECT as a site-wide paradigm.**

## 03 — Baguette Studio ◐

Hero animation ↔ navigation relationship. `awwwards.com/inspiration/hero-animation-baguette-studio`

- **Mechanic** — an animated hero that resolves into a stable navigation state; nav is part of the hero's choreography, not a separate bar bolted on top.
- **Why it works** — nav *arriving* rather than pre-existing makes the opening feel authored.
- **Learn** — directly powers Opening → Hero → Bottom Nav: the capsule is born when the Hero finishes building, and is reused as the final CTA. Narrative bookend.
- **Don't copy** — hero motion so busy it obscures navigation.
- **Verdict: USE.**

## 04 — iN ✅ — HIGHEST PRIORITY

Morph / section transitions. `in.com.br` · `awwwards.com/inspiration/scroll-animations-in`

- **Mechanic** — verified element list: **Morph transition**, **Section transition**, **Page transition**, plus a bespoke loader. Sections don't succeed one another, they *convert* into one another.
- **Why it works** — it removes the seam. There is no "next section" moment, so the site reads as one continuous piece — which is precisely brief §4, *transformation > succession*.
- **Learn** — the model for every act boundary: Intro→Hero, Hero→Story, Gallery→Moodboard, Yuna→MGC. Implementation without WebGL: `Flip.getState()` → mutate DOM → `Flip.from()`, plus scrubbed `clip-path` on a shared element.
- **Don't copy** — morphing *everything*. If every boundary morphs, none of them lands.
- **Verdict: USE as the primary transition grammar.**

## 05 — BALANS KITCHEN ✅

clip-path / sticky / horizontal / parallax. `awwwards.com/inspiration/homepage-clip-path-slider-balans-kitchen-1`

- **Mechanic** — pinned wrapper, `clip-path` scrubbed open, horizontal panel track, parallax layers inside each panel. Verified pattern:

```js
gsap.timeline({ scrollTrigger: { trigger: '.wrapper', start: 'top top',
  end: '+=' + (100 * totalPanels + 1) + '%', scrub: true, pin: true } })
  .to('.wrapper', { clipPath: 'circle(71% at 50% 50%)', duration: 1 / totalPanels })
  .to(panels,     { xPercent: -100 * (totalPanels - 1), duration: 1, ease: 'none' });
```

- **Why it works** — `clip-path` gives a cinematic wipe with zero WebGL, and it composites cheaply.
- **Learn** — the workhorse for Strategy (horizontal track) and for reveals throughout. Note `ease: 'none'` on the horizontal tween, mandated by the ScrollTrigger skill too.
- **Don't copy** — `circle()` wipes (dated); over-long pins. Prefer `inset()` — it reads as a *crop*, which is editorially meaningful for a content strategist.
- **Verdict: USE, with `inset()` instead of `circle()`.**

## 06 — M-TRUST ✅

Layering GSAP + Lenis + Three.js. `awwwards.com/inspiration/gsap-scroll-transition-m-trust-co-ltd`

- **Mechanic** — DOM carries all readable content; WebGL is a layer whose shader uniforms are driven by scrubbed GSAP. Verified stack: SvelteKit, TS, Three.js, Tailwind, GSAP, Lenis.
- **Why it works** — clear division of labour. Text stays selectable, accessible and crawlable; WebGL only adds depth.
- **Learn** — confirms the Lenis↔GSAP contract and, critically, that **GSAP drives WebGL uniforms** — one timeline is the single source of truth, so no second animation engine can fight it.
- **Don't copy** — its persistent canvas.
- **Verdict: USE the layering discipline. REJECT the persistence.**

## 07 — Noomo Labs ✅ — HIGH PRIORITY (mobile)

Mobile scroll & interaction. `awwwards.com/inspiration/mobile-scroll-and-interactions-noomo-labs`

- **Mechanic** — scroll-driven 3D character; documented mobile strategy is aggressive quality reduction while preserving the narrative. In their words: *"significantly reduced the quality of the glass while making this downgrade almost invisible"*, *"lowered the number of simulations and physics calculations"*.
- **Why it works** — mobile keeps the *story* and loses only fidelity. Users never perceive a lesser version.
- **Learn** — the governing principle for MEDIUM/SAFE tiers: **degrade fidelity, never narrative**. Mobile gets the same beats, fewer pixels and fewer elements.
- **Don't copy** — a mascot. Wrong register for a professional portfolio.
- **Verdict: USE the degradation philosophy. REJECT the character.**

## 08 — OKCC Labs ✅

Work gallery. `awwwards.com/inspiration/work-scroll-animation-okcc-labs`

- **Mechanic** — refractive glass logo (mouse-reactive tilt) + scroll-driven card parallax, cards entering at angles.
- **Why it works** — one premium focal effect, everything else restrained.
- **Learn** — the *card-entry-at-an-angle* parallax is pure DOM and suits MGC's scrapbook energy.
- **Don't copy** — the glass refraction (that's the OKCC signature, and glass is on our anti-slop list); rendering cards in WebGL.
- **Verdict: USE the parallax entry. REJECT the glass.**

## 09 — Sperotto S.p.A. ✅

History timeline. `awwwards.com/inspiration/history-scroll-animation-sperotto-s-p-a`

- **Mechanic** — vintage images and dates emerge progressively against a stable timeline spine (Studio375 case study).
- **Why it works** — the stable spine plus changing content produces a sense of *travelling through time*.
- **Learn** — invert it, as the brief instructs: instead of the viewer moving along the timeline, fix a **playhead** and move the years beneath it. That reframes a corporate timeline as a **video-editing timeline** — native to Glwadys's actual craft, and it merges About/Experience/Education/Journey into one non-repeating act.
- **Don't copy** — the corporate-heritage tone; a timeline UI widget.
- **Verdict: USE, reinterpreted as an editing timeline.**

## 10 — Humbert & Poyet ✅

Restraint. `awwwards.com/inspiration/scroll-portfolio`

- **Mechanic** — typography-led scroll; letters overlay photographs on scroll; generous whitespace; only 2–3 elements move at any moment.
- **Why it works** — *restraint reads as confidence.* Reviewed as bringing "an interesting twist to luxury" through subtlety rather than spectacle.
- **Learn** — **the most important reference in the list.** It licenses the calm required by §38's pacing contrast. Comptoir and Contact exist because of this. A premium site does not need to be spectacular every second — and type overlapping image is the cheapest, strongest editorial move available.
- **Don't copy** — minimalism so severe the work can't be seen. Glwadys must show volume in MGC.
- **Verdict: USE as the baseline register; the loud acts are the exceptions.**

## 11 — Good is the New Cool ✅

Stretch + page transitions. `awwwards.com/inspiration/stretching-effect-of-scroll-and-on-page-transitions-good-is-the-new-cool`

- **Mechanic** — images stretch/expand inside sliders; new pages push old ones out. Stack: Nuxt 3, Storyblok, GSAP. Notably: **"3D UI elements purely with CSS, achieving depth without WebGL."**
- **Why it works** — scale-based elasticity feels organic and costs nothing.
- **Learn** — that quote is the strongest external evidence for this brief's core bet: depth is achievable in CSS. Directly supports a **DOM/CSS phone** (§16) over a GLB.
- **Don't copy** — distortion strong enough to misrepresent a client's imagery. Non-negotiable for a portfolio.
- **Verdict: USE subtly (crop-scale, not warp). Adopt the CSS-depth thesis wholesale.**

## 12 — Composites.archi ✅

WebGL scene transition. `awwwards.com/inspiration/transition-composites-archi`

- **Mechanic** — "feather" shader wipe between WebGL scenes, uniforms driven by a GSAP timeline. Stack: Three.js, GSAP, Nuxt.
- **Why it works** — an organic edge beats a hard cut; the transition itself becomes the signature.
- **Learn** — the model for the **WebGL → DOM handoff** (§22): the exit is a designed moment, not a teardown. Converge depths, match the final 3D frame to a prepared DOM composition, cross the seam, *then* dispose.
- **Don't copy** — a shader wipe at every boundary; scene-to-scene WebGL chaining.
- **Verdict: USE for the single exit handoff only.**

---

## Cross-cutting synthesis

### Mechanics that recur across the award-winning set

| Mechanic | Seen in | DOM-achievable? |
|---|---|---|
| Pinned section + horizontal track | 05, 08 | **Yes** — `ease: 'none'` mandatory |
| `clip-path` reveal / crop transition | 05, 11 | **Yes** — compositor-friendly |
| Scrubbed ScrollTrigger | all | **Yes** |
| Lenis + GSAP ticker sync | 06, 07 | **Yes** |
| Parallax depth layers | 05, 08, 10 | **Yes** |
| Typography-led reveal (SplitText / clip-path) | 03, 04, 10 | **Yes** |
| Shared-element morph (Flip) | 04, 11 | **Yes** |
| Progressive staggered reveal | 09, all | **Yes** |
| True camera movement through depth | 01, 02, 06, 12 | **No — genuine WebGL** |
| Refraction / shader wipe | 08, 12 | **No — genuine WebGL** |

**Eight of ten recurring mechanics need no WebGL.** This is the evidence base for the brief's §3
restriction, and it is why the WebGL budget is one scene.

### Why sites like these read as finished work rather than GSAP demos

1. **One motion grammar, reused.** 2–3 eases for the whole site, not a new ease per section.
2. **Pins are rationed.** Over-pinning makes scrolling feel broken.
3. **Not everything is scrubbed.** Some motion must be time-based, or nothing feels alive.
4. **Calm is designed, not left over.** Reference 10 is 90% calm and outclasses busier sites.
5. **Typography leads; motion reinforces.** Never the reverse.
6. **Mobile is authored, not squeezed** (reference 07).
7. **Every animation has a narrative reason.** The legacy build's 13 identical fade-ups had none.

### Verified numeric starting points

| Parameter | Value | Source |
|---|---|---|
| `scrub` | `1` typical; `0.45–0.6` tighter | cross-site; project motion skill |
| Major transition | 0.45–0.9 s | project motion skill |
| Micro-interaction | 150–300 ms | `awwwards-animations` |
| UI transition | 300–500 ms | `awwwards-animations` |
| Stagger | 0.02–0.1 s | both |
| Lenis `lerp` | ~0.08 | cross-site |
| Horizontal track end | `+= (scrollWidth - innerWidth)` | ScrollTrigger skill |
| Mobile DPR | ×0.5–0.7 | mobile WebGL guidance |

Treated as starting points and tuned against screenshots, per §63.
