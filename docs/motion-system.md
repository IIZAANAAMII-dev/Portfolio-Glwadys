# Motion System (Système d'Animation)

## Directeur : GSAP + ScrollTrigger
GSAP est utilisé comme orchestrateur principal. Chaque chapitre est une section épinglée (`pin: true`) ou défilante dont la progression scroll pilote une timeline synchronisée.

## Principes généraux
- **Easings éditoriaux :** `power3.out`, `expo.out`, `sine.inOut`, `quart.out`. Pas de `bounce`, `elastic`, `back.out` sauf exception rarissime.
- **Scrub lissé :** valeurs autour de `1.2` pour un rendu cinématographique ; `true` pour 1:1 avec Lenis.
- **Nettoyage :** toutes les animations sont encapsulées dans `gsap.context()` et nettoyées au `useEffect` return.
- **Timeline maître locale par section :** pas de fichier monolithique de 2 000 lignes ; chaque section gère son propre micro-récit, piloté par `MasterTimelineManager`.

## Organisation
- `src/motion/MasterTimeline.ts` : enregistrement des plugins GSAP, centralisation des mises à jour de caméra 3D, changement de chapitre.
- `src/sections/*.tsx` : chaque section contient sa propre `ScrollTrigger` timeline.
- Les coordonnées de la caméra R3F sont interpolées via `gsap.utils.interpolate()` dans les callbacks `onUpdate`.

## Animation de la caméra
- `CameraRig.tsx` lisse chaque frame la position, le `lookAt` et le FOV.
- Aucune caméra FPS, aucune rotation excessive ; mouvements fluides et intentionnels.

## Accessibilité
- `prefers-reduced-motion` est pris en charge : `useLenis` et l'expérience WebGL sont désactivés si la préférence est active.
