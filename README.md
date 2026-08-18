# Glwadys Dalleau — Creative Portfolio

Awwwards-level creative portfolio for **Glwadys Dalleau**, a Social Media Manager, Content Creator and Brand Strategist based in Marseille, France.

## Concept
**"The Creative Layers"** — the experience reveals the two sides of her work: the polished public content (FRONT) and the strategic structure behind it (BEHIND).

## Stack
- **Next.js 14** + **React 18** + **TypeScript**
- **Tailwind CSS**
- **GSAP** + **ScrollTrigger**
- **Lenis** smooth scroll
- **React Three Fiber** + **Three.js** + **Drei**
- **next-intl** (FR / EN / KO)

## Commands
```bash
npm install
npm run dev      # http://localhost:3000/fr
npm run build
npm start
```

## Architecture
- `src/sections/` — narrative chapters
- `src/experience/` — persistent WebGL canvas
- `src/motion/` — GSAP master timeline
- `src/config/` — spatial design tokens
- `src/lib/` — quality detection, global store
- `docs/` — full technical and art documentation

## i18n
Routes: `/fr`, `/en`, `/ko`.
Translations live in `messages/fr.json`, `messages/en.json`, `messages/ko.json`.

## Quality Modes
- **HIGH** — full WebGL, shaders, custom cursor
- **MEDIUM** — optimized WebGL for mobile/laptops
- **SAFE** — no WebGL, DOM + CSS + GSAP only

## Documentation
- `docs/skills-audit.md`
- `docs/art-direction.md`
- `docs/assets-sources.md`
- `docs/architecture.md`
- `docs/motion-system.md`
- `docs/spatial-system.md`
- `docs/performance.md`

## Status
Build successful. Ready for deployment on Vercel / Netlify / any Node.js host.

