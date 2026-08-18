# Architecture du Portfolio Créatif de Glwadys Dalleau

## Vue d'ensemble
Le portfolio est une expérience web narrative de type Awwwards, construite avec **Next.js 14 + TypeScript**, **Tailwind CSS**, **GSAP/ScrollTrigger**, **Lenis**, **React Three Fiber / Three.js** et **next-intl** pour le multilingue FR / EN / KO.

## Philosophie d'architecture
- **Séparation des responsabilités :**
  - `DOM` = sémantique, typographie, accessibilité, navigation, contenu textuel.
  - `WebGL (R3F)` = profondeur, caméra, médias 3D, transitions scéniques.
  - `GSAP ScrollTrigger` = directeur/conducteur de la narration, synchronisation du scroll, de la caméra et des états de chapitre.
- **Coupe verticale (vertical slice) :** le site est conçu par chapitres narratifs complètement assemblés avant de passer au suivant, garantissant une cohérence visuelle et fonctionnelle dès les premiers blocs.

## Structure des répertoires
```
src/
  app/              # Next.js App Router (layouts par locale, pages, styles globaux)
  components/       # Composants partagés (si ajoutés)
  experience/       # Scène WebGL persistante, CameraRig, MediaPlane, Phone, ProjectConstellation
  hooks/            # useLenis — smooth scroll synchronisé à ScrollTrigger
  lib/              # store, quality detection, utilitaires
  motion/           # MasterTimeline, orchestration GSAP
  sections/         # Tous les chapitres narratifs du site
  ui/               # Navbar, Footer, CustomCursor, ChapterIndexModal, BehindSwitch, NoiseOverlay
  styles/           # globals.css, design tokens via Tailwind
  config/           # spatial.ts, DEPTH, CAMERA_PRESETS
  i18n.ts           # Configuration next-intl (fr/en/ko)
  navigation.ts     # Link/redirect avec locales
  middleware.ts     # Locale prefix always
```

## Points clés
- Canvas persistant monté dans `LocaleLayout`, jamais démonté entre les chapitres.
- `appStore` est un store minimaliste par abonnement pour synchroniser DOM, UI et R3F sans re-render React inutile.
- `detectQuality()` évalue à l'exécution le support WebGL, le DPR, `prefers-reduced-motion` et le GPU pour choisir entre HIGH / MEDIUM / SAFE.
- `MasterTimelineManager` centralise l'écriture des mises à jour de caméra et l'état du chapitre actif.
