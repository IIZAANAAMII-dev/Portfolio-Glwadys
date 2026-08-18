# Performance & Quality Modes

## Détection de qualité (`src/lib/quality.ts`)
Le site détecte à l'exécution le support WebGL, le GPU, le mobile, `hardwareConcurrency` et `prefers-reduced-motion` pour choisir une tier :

### HIGH
- Desktop performant
- WebGL complet, shaders, postprocessing subtil, curseur personnalisé
- DPR max 1.75
- 40 plans media maximum

### MEDIUM
- Laptops / mobiles modernes
- DPR 1.0–1.25
- Shaders simplifiés, pas de postprocessing lourd, pas de curseur
- 16 plans media maximum

### SAFE
- `prefers-reduced-motion` ou absence de WebGL
- Canvas complètement désactivé
- Expérience assurée par DOM + CSS + GSAP léger

## Optimisations appliquées
- Textures SVG produites en interne (pas de fichiers 4K).
- Pixel ratio clampé.
- `InstancedMesh` et géométries planes basiques.
- `dispose()` pour les ressources WebGL.
- Frame loop désactivé quand WebGL n'est pas visible ou tab inactif.
- Chargement progressif des sections (vertical slice).

## Objectifs
- 60 FPS cible sur desktop.
- 30–60 FPS sur mobile grâce à la tier MEDIUM.
- Expérience lisible et accessible en SAFE.
