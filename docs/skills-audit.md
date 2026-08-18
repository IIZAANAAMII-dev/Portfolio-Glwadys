# Skills audit — Glwadys Awards pass

## Local skills already used

### awwwards-animations
- **Source:** `.agents/skills/awwwards-animations`
- **Use:** direction motion haut de gamme, Lenis, GSAP, reveals éditoriaux, curseur et performance.
- **Patterns retenus:** timings courts, overlaps, clip-path, une librairie par propriété, reduced motion.
- **À éviter:** smooth scroll sur-amorti, animation gadget, répétition de fades.

### gsap-scrolltrigger
- **Source:** `.agents/skills/gsap-scrolltrigger`
- **Use:** pins, scrubs, horizontal scroll, refresh et cleanup.
- **Patterns retenus:** timelines top-level avec `pin`, `scrub: 0.45–0.6`, `ease: none` pour les tracks horizontaux, `ctx.revert()`.
- **À éviter:** ScrollTriggers imbriqués dans des timelines, `scrub` et `toggleActions` ensemble, ease non linéaire sur un faux horizontal.

### react-three-fiber / threejs-webgl
- **Source:** `.agents/skills/react-three-fiber`, `.agents/skills/threejs-webgl`
- **Use:** Canvas isolé, caméra, textures, groupes visibles par chapitre et fallback qualité.
- **Patterns retenus:** refs mutables dans `useFrame`, textures mises en cache, groupes `visible`, Suspense et DPR limité.
- **À éviter:** setState à chaque frame, objets recréés au render, canvas lourds avant l’acte Social.

## Skills installés pour ce projet

### web3d-integration-patterns
- **Source:** `freshtechbro/claudedesignskills/.claude/skills/web3d-integration-patterns`
- **Installé dans:** `C:/Users/User/.codex/skills/web3d-integration-patterns`
- **Use:** architecture hybride DOM + R3F + GSAP et synchronisation d’état.
- **Application:** `ExperienceCanvas`, `CameraRig`, `Phone` et `appStore` séparent la couche WebGL, le montage GSAP et l’UI lisible.
- **Point clé:** une seule source de vérité pour la caméra et un seul pilote par propriété afin d’éviter les conflits GSAP/R3F.

### gsap-scrolltrigger (official)
- **Source:** `greensock/gsap-skills`
- **Installé dans:** `C:/Users/User/.codex/skills/gsap-scrolltrigger`
- **Use:** validation des pins, scrubs, refresh et transitions horizontales.

### gsap-react (official)
- **Source:** `greensock/gsap-skills`
- **Installé dans:** `C:/Users/User/.codex/skills/gsap-react`
- **Use:** recommande `useGSAP` avec scope et cleanup automatique. Le projet conserve pour l’instant `gsap.context()` car il ne dépend pas de `@gsap/react`.

### gsap-performance (official)
- **Source:** `greensock/gsap-skills`
- **Installé dans:** `C:/Users/User/.codex/skills/gsap-performance`
- **Use:** transforms/opacity, `quickTo` pour le curseur, limitation du travail hors écran et nettoyage.

## Décision stack

Le projet conserve Next.js + React + GSAP ScrollTrigger + Lenis + R3F/Three. Aucun nouveau moteur de scroll ou framework 3D n’est ajouté. La 3D lourde est créée uniquement dans l’acte Social, puis contrôlée par chapitre ; l’intro reste un overlay d’entrée DOM qui se retire.
