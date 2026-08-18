---
name: glwadys-awwwards
description: Awwwards-level creative portfolio for Glwadys Dalleau. Use for every code or design decision in this repository. Enforces narrative-first architecture, spatial design system, anti-slop rules, quality tiers, and premium motion. Triggers automatically when working on the Portfolio-Glwadys project.
---

# Glwadys Dalleau — Awwwards Portfolio Build Rules

## Identity (never invent)

- **Name**: GLWADYS DALLEAU
- **Role**: Social Media Manager / Content Creation / Brand Communication / Digital Marketing
- **Location / availability**: Marseille, France — available in France & remote
- **Email**: `glwadys.dalleau29@gmail.com`
- **LinkedIn**: `linkedin.com/in/glwadysdalleau`
- **Education**: IPAC Bachelor Factory (2020–2023) — International Business, Marketing & Négociation
- **Experience**: Yuna Bijoux (alternance), Marseille Girls Club (CDI temps partiel), Le Comptoir de Mathilde (CDD)
- **Years**: 2021 → 2026

## Narrative-first 7-Act architecture

Build the site as **one continuous scroll transformation**, not a list of sections.

| Act | Name | Transformative moment |
|-----|------|-----------------------|
| 01 | Intro / Identity | Metadata portrait grid splits into social cells |
| 02 | Social World | FRONT/BÉHIND switch, phone dive through a Story into the gallery |
| 03 | Creative Process | Chaos gallery folds into ordered strategy grid |
| 04 | Selected Work | Camera constellation Yuna → MGC → Comptoir |
| 05 | Journey | Horizontal pinned timeline with giant year reveals |
| 06 | What I Do | Services as full-screen pinned typographic scenes |
| 07 | Final / Contact | Camera pullback, silence, then giant contact phrase |

## Design system

- **Colors**: Obsidian `#0B0B0B`, Warm Ivory `#F7F2EA`, Champagne `#DDCBA8`, Espresso `#1E1812`, Muted Clay `#A85D4C` (accent only).
- **Background paper**: subtle noise/grain overlay and one dark paper texture. No gradients as backgrounds.
- **Typography**:
  - Display: `General Sans` or `Satoshi` (sans, geometric, grotesque) for giant words.
  - Editorial: `Baskervville` or `Source Serif 4` for selected fragments.
  - Mono/Tags: `JetBrains Mono` or `IBM Plex Mono` for years, captions, coordinates.
- **Font scale**: fluid `clamp()`; hero name 15–22vw; section word 10–18vw; body 14–18px; tags 10–11px.
- **No cards, no bento, no glass, no rounded everything, no glowing spheres, no particles, no random 3D objects.**

## Motion rules

- **Primary**: `gsap` + `ScrollTrigger` + `useGSAP`; `lenis` for smooth scroll, piped into `gsap.ticker`.
- **Easing**: `power3.out`, `power4.inOut`, `sine.inOut`, `expo.out` for luxury motion. **Never** bounce, elastic, spring, back.
- **Motion budget**: 60fps. Only `transform` and `opacity`. Use `will-change` on active pinned wrappers.
- **Pinned sections**: single `pin: true` per act, master timeline with labeled phases.
- **3D camera**: smooth lerp to preset positions; no orbit controls; no wild rotations.
- **Reduced motion**: disable Lenis, kill ScrollTrigger-driven motion, keep static layout excellent.

## Quality tiers

- **HIGH**: desktop + good GPU. Full R3F, custom shaders, shadows, 1.5–1.75 DPR, smooth scroll.
- **MEDIUM**: touch/low-mid GPU. R3F without heavy shaders, lower shadow maps, 1.25 DPR, simplified scenes.
- **SAFE**: WebGL disabled / low-end / `prefers-reduced-motion`. DOM-only, static image layers, native scroll, no Lenis.

## Code architecture

```
src/
  app/
    [locale]/
      layout.tsx      # fonts, metadata, i18n, persistent Canvas
      page.tsx        # 7 Act components
    page.tsx          # redirect / → /fr
    layout.tsx        # minimal root
  components/
    canvas/           # ExperienceCanvas, CameraRig
    acts/             # Act01..Act07
    ui/               # Navbar, NoiseOverlay, QualityGate, CustomCursor
  hooks/              # useLenis, useQuality, useScrollProgress
  lib/                # gsap.ts, store.ts, quality.ts
  i18n/               # routing, locales (fr/en/ko)
  styles/             # globals.css, design tokens
public/
  fonts/              # self-host variable fonts
  textures/           # noise, paper, hdri
  images/             # editorial assets (webP/AVIF)
  models/             # phone or objects (GLB, small)
```

## Anti-slop checklist

- No purple/blue AI gradients.
- No generic glassmorphism.
- No giant glowing sphere / torus / random blob.
- No floating UI cards as the main concept.
- No carousel, no timeline widget, no numbered steps as a UI component.
- No fake metrics, fake awards, fake followers, fake ROI.
- No `Locomotive` + `Lenis` together.
- No heavy loader.
- No text rendered inside WebGL as the primary readable copy.

## Verification after each act

1. Run `next build`.
2. Chrome DevTools Performance: 60fps.
3. Check without animations — must still look excellent.
4. Check mobile — must remain elegant and usable.
5. Commit.
