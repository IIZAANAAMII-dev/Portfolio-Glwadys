# Skills Audit & Technical Analysis

This document provides a detailed audit of the specialized skills installed into `.windsurf/skills/` for the creative portfolio of Glwadys Dalleau.

---

## 1. gsap-scrolltrigger

- **Source**: `freshtechbro/claudedesignskills` (adapted for high-precision timeline orchestration)
- **Utilité**: Conductor of the entire storytelling journey. Coordinates multi-chapter pinned sequences, synchronized camera positions, velocity-based distortions, text reveals, and DOM overlays.
- **Règles importantes**:
  - Always clean up timelines via `gsap.context()` in React lifecycle.
  - Set `invalidateOnRefresh: true` for responsive recalculation on resize.
  - Never stack competing scrolltriggers on identical DOM transforms.
  - Use calm, luxury easings (`power3.out`, `expo.out`, `sine.inOut`), strictly avoiding bouncy/elastic curves.
- **Patterns à réutiliser**:
  - Pinned multi-phase master timelines.
  - Scroll velocity clamping for subtle skew and inertia feedback.
  - Proxy objects updating Three.js camera rigs directly.
- **Patterns à éviter**:
  - Scattering hundreds of unmanaged ScrollTriggers across isolated React subcomponents without a master sequence.
- **Utilisation prévue dans le portfolio**:
  - Driving the Master Timeline across 12 narrative chapters from Intro to Contact.

---

## 2. threejs-webgl

- **Source**: `freshtechbro/claudedesignskills` + Three.js core architecture
- **Utilité**: High-performance WebGL rendering for 3D media planes, persistent camera rigs, GLSL shader transitions, and spatial depth layers (X, Y, Z).
- **Règles importantes**:
  - No object allocation inside render ticks (`useFrame`).
  - Strict disposal of geometries, materials, and textures.
  - Clamp device pixel ratio to max 1.75 on desktop, 1.2 on mobile.
  - Use `ACESFilmicToneMapping` and `SRGBColorSpace`.
- **Patterns à réutiliser**:
  - Cover UV calculation shader for responsive media planes without texture deformation.
  - Exponential camera interpolation for cinematic camera motion.
- **Patterns à éviter**:
  - Unmanaged texture loading resulting in GPU memory crashes on iOS Safari.
- **Utilisation prévue dans le portfolio**:
  - Persistent 3D canvas, media planes in 3D space, camera dive through smartphone screen into the content gallery.

---

## 3. react-three-fiber

- **Source**: `EnzeD/r3f-skills` + `pmndrs/react-three-fiber`
- **Utilité**: Declarative integration of Three.js within React 19 / Next.js, handling suspense boundaries and reactive props.
- **Règles importantes**:
  - Keep a single persistent `<Canvas>` at root layout.
  - Mutate Three.js object refs directly in RAF instead of triggering React state re-renders.
  - Use Suspense boundaries for non-blocking texture streams.
- **Patterns à réutiliser**:
  - Viewport-to-world unit conversions (`useThree().viewport`).
  - Adaptive performance monitoring via DPR stepping.
- **Patterns à éviter**:
  - Unmounting/remounting WebGL Canvas between sections or pages.
- **Utilisation prévue dans le portfolio**:
  - Persistent root Canvas rendering 3D chapters and camera rigs.

---

## 4. web3d-integration-patterns

- **Source**: `freshtechbro/claudedesignskills/meta-skills`
- **Utilité**: Bridge architecture unifying DOM typography, GSAP ScrollTrigger, Lenis smooth scroll, and R3F scenes.
- **Règles importantes**:
  - Strict separation of concerns: DOM handles semantics and accessibility; WebGL handles spatial depth and shader effects; GSAP orchestrates both.
  - DOM and WebGL bounding boxes synchronized during shared transitions.
- **Patterns à réutiliser**:
  - Three-tier quality degradation: HIGH (Full WebGL + Shaders), MEDIUM (Optimized DPR + Reduced Geometry), SAFE (Pure CSS/DOM fallback without WebGL).
- **Patterns à éviter**:
  - Trying to render readable long-form text or navigation elements inside WebGL texture canvases instead of accessible DOM.
- **Utilisation prévue dans le portfolio**:
  - Synchronizing the DOM text overlays with the 3D gallery and case study planes.

---

## 5. editorial-craft-atelier

- **Source**: `luminary19/atelier` + bespoke luxury editorial principles
- **Utilité**: Visual art direction enforcement, anti-slop rules, typography hierarchy, and luxury spatial aesthetic.
- **Règles importantes**:
  - No purple AI gradients, no glowing spheres, no generic SaaS card boxes.
  - Asymmetric editorial layouts with deliberate tension, fine micro-typography, and generous negative space.
  - Two-layer concept: FRONT (curated public presence) and BEHIND (strategic planning, moodboard, strategy).
- **Patterns à réutiliser**:
  - High-contrast typography scale (Giant display serif/grotesque vs delicate 10px mono tags).
  - Tactile cursor reveal revealing the "behind-the-scenes" layer.
- **Patterns à éviter**:
  - Centered cookie-cutter hero sections and repetitive bento cards.
- **Utilisation prévue dans le portfolio**:
  - Overall art direction, color palettes (Obsidian, Warm Cream, Champagne Gold, Deep Espresso), and typography layout.

---

## 6. webgl-performance-mobile

- **Source**: WebGL production performance best practices
- **Utilité**: Mobile-first performance engineering ensuring zero thermal throttling or stutter on iOS Safari and Android devices.
- **Règles importantes**:
  - Automatic tier detection on initial page load.
  - Dynamic pause of RAF loop when out of viewport.
  - Compressed WebP images with responsive sizes.
- **Patterns à réutiliser**:
  - Hardware capability probing (GPU renderer string, memory, mobile user agent).
  - SAFE mode fallback for low-power or WebGL-unsupported environments.
- **Patterns à éviter**:
  - Loading heavy 4K textures or uncompressed models on mobile.
- **Utilisation prévue dans le portfolio**:
  - Mobile responsiveness and performance optimization across all 12 chapters.
