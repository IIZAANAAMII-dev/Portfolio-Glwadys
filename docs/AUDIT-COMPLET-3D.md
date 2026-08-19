# Audit Complet - Animations et Hiérarchie 3D - Portfolio-Glwadys (Commit 0c901f0)

---

## 📋 Table des Matières

1. [Architecture Globale](#architecture-globale)
2. [Configuration & State Management](#configuration--state-management)
3. [Expérience 3D (R3F)](#expérience-3d-r3f)
4. [Sections DOM & Animations GSAP](#sections-dom--animations-gsap)
5. [UI Components](#ui-components)
6. [Bugs, Incohérences & Risques](#bugs-incohérences--risques)
7. [Recommandations](#recommandations)

---

## 🏗️ Architecture Globale

### Stack Technique
- **Framework**: Next.js 14+ (App Router)
- **3D**: React Three Fiber (R3F)
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scroll**: Lenis
- **State**: Custom Store (subscriber pattern)
- **Styling**: Tailwind CSS + CSS custom

### Flux de Données Principal
```
Scroll (Lenis) → ScrollTrigger (GSAP) → MasterTimelineManager → appStore → CameraRig/MediaPlane → R3F Scene
```

---

## ⚙️ Configuration & State Management

### `src/lib/store.ts` (Lignes 1-99)

**Rôle**: Store d'état global avec pattern subscriber simple

**État géré**:
- `currentChapter`: Chapter (enum de 13 chapitres)
- `scrollProgress`: number (0-1 global)
- `chapterProgress`: number (0-1 par chapitre)
- `isBehindActive`: boolean (mode Front/Behind)
- `activeProject`: 'yuna' | 'mgc' | 'comptoir' | null
- `quality`: QualityConfig (détection automatique)
- `camera`: SpatialCameraState (x, y, z, lookAt, fov, rot)
- `isIndexOpen`: boolean (modal navigation)
- `isLoaded`: boolean
- `cursorMode`: enum (7 modes)
- `cursorText`: string | undefined

**Dépendances**: `src/lib/quality.ts`

**Cleanup**: Pattern unsubscribe dans tous les subscribers

**⚠️ Risque**: Aucun système de persistance, reset au rechargement

---

### `src/lib/quality.ts` (Lignes 1-109)

**Rôle**: Détection automatique de la qualité device

**Critères de détection**:
1. `prefers-reduced-motion` → TIER SAFE (WebGL désactivé)
2. Support WebGL → TIER SAFE si absent
3. GPU low-end (SwiftShader, LLVMpipe, Intel HD 3000, Mali-400) → TIER MEDIUM
4. Mobile ou hardwareConcurrency < 4 → TIER MEDIUM
5. Sinon → TIER HIGH

**Configuration par tier**:
- **SAFE**: WebGL=false, shaders=false, postprocessing=false, cursor=false, maxPlanes=0
- **MEDIUM**: WebGL=true, shaders=false, postprocessing=false, cursor=false, maxPlanes=16, DPR≤1.25
- **HIGH**: WebGL=true, shaders=true, postprocessing=true, cursor=true, maxPlanes=40, DPR≤1.75

**✅ Points forts**: Détection robuste, fallbacks progressifs

**⚠️ Risque**: Détection basée sur user agent (mobile) + renderer string (peut être spoofé)

---

### `src/config/spatial.ts` (Lignes 1-120)

**Rôle**: Système de design spatial unifié

**DEPTH Layers** (Lignes 6-51):
```typescript
foreground: 2.0
primary: 0.0
midground: -3.0
background: -6.0
far: -10.0
// + couches spécifiques par scène
```

**SPATIAL_LANES** (Lignes 53-59):
- Associe Z, contrast, scale par lane
- Permet cohérence visuelle across scènes

**CAMERA_PRESETS** (Lignes 61-112):
- 11 presets: intro, hero, identity, social, phoneDive, gallery, brand, strategy, constellation, finalCallback
- Position, lookAt, fov définis

**MOTION_TIMINGS** (Lignes 114-120):
```typescript
slowScrub: 0.75
standardScrub: 0.55
fastScrub: 0.4
lerpFactorDesktop: 0.16
lerpFactorMobile: 0.2
```

**✅ Points forts**: Architecture spatiale unifiée, très bonne séparation des responsabilités

**⚠️ Incohérence**: Les presets ne sont pas tous utilisés dans `cameraPath.ts`

---

### `src/config/cameraPath.ts` (Lignes 1-22)

**Rôle**: Définit les trajectoires caméra par chapitre

**Mapping Chapter → {start, end}**:
```typescript
intro: { intro → hero }
hero: { hero → identity }
identity: { identity → social }
social: { social → phoneDive }
gallery: { gallery → brand }
brand: { brand → strategy }
strategy: { strategy → finalCallback }
about/journey/work/services/experience/contact: { finalCallback → finalCallback }
```

**⚠️ BUG**: Les chapitres about/work/services/experience/contact ont tous la même caméra statique (finalCallback). Pas de variation.

**⚠️ Incohérence**: Le preset `constellation` n'est pas utilisé dans cameraPath mais existe dans spatial.ts

---

### `src/motion/MasterTimeline.ts` (Lignes 1-45)

**Rôle**: Singleton pour gérer les animations GSAP et mises à jour caméra

**Méthodes**:
- `init()`: Enregistre ScrollTrigger (une seule fois)
- `updateCamera(props)`: Met à jour l'état caméra dans le store
- `setChapter(chapter)`: Change le chapitre courant

**Dépendances**: `src/lib/store.ts`, `src/config/spatial.ts`

**✅ Points forts**: Pattern singleton évite les doubles enregistrements

**⚠️ Risque**: Aucun cleanup explicite, mais ScrollTrigger est global

---

### `src/hooks/useLenis.ts` (Lignes 1-42)

**Rôle**: Hook pour initialiser Lenis (smooth scroll)

**Configuration Lenis**:
```typescript
duration: 0.55
easing: custom ease
orientation: vertical
smoothWheel: true
wheelMultiplier: 1.35
touchMultiplier: 1.6
```

**Intégration GSAP**:
- `lenis.on('scroll', ScrollTrigger.update)`
- `gsap.ticker.add(onTick)` avec `lagSmoothing(0)`

**Cleanup**: `lenis.destroy()`, `gsap.ticker.remove(onTick)`

**Trigger**: Mount uniquement

**✅ Points forts**: Intégration propre avec GSAP, cleanup correct

**⚠️ Risque**: `prefers-reduced-motion` désactive Lenis mais pas GSAP ScrollTrigger dans les sections

---

## 🎮 Expérience 3D (R3F)

### `src/experience/ExperienceCanvas.tsx` (Lignes 1-109)

**Rôle**: Canvas R3F principal avec gestion qualité et mobile

**Conditions de rendu**:
- `mounted` = true
- `quality.enableWebGL` = true
- `isMobile` = false (width < 768)

**⚠️ BUG CRITIQUE**: Sur mobile, WebGL est complètement désactivé (ligne 34). L'expérience 3D n'existe pas sur mobile.

**Configuration Canvas**:
- Camera initiale: `[0, 0, 14]`, fov 48
- DPR: depuis quality config
- Antialias: HIGH tier only
- ToneMapping: ACESFilmic
- PowerPreference: high-performance

**Structure de scène**:
```
SceneDirector
├── CameraRig
├── Lights (ambient, directional, point)
├── SceneLayer "opening"
│   └── 3 MediaPlanes (portrait, yuna-story, mgc-scrapbook)
├── SceneLayer "social"
│   └── Phone
├── SceneLayer "gallery"
│   └── GalleryRoom
└── SceneLayer "work"
    └── ProjectConstellation
```

**Dépendances**: `src/experience/SceneDirector.tsx`, `src/experience/CameraRig.tsx`, tous les composants 3D

**Cleanup**: Aucun cleanup explicite (Suspense fallback)

**⚠️ Incohérence**: Les positions Y des groupes sont hardcodées (-6.5, -12, -18) sans correspondance avec les presets caméra

---

### `src/experience/SceneDirector.tsx` (Lignes 1-44)

**Rôle**: Gère la visibilité des scènes 3D par chapitre

**Mapping Chapter → SceneId**:
```typescript
intro/hero/identity → 'opening'
social → 'social'
gallery/brand/strategy/about → 'gallery'
journey/work/services/experience/contact → 'work'
```

**État**: `{ chapter, scene, progress }`

**Trigger**: Subscription au store appStore

**Composant `SceneLayer`**: Rend conditionnel via `visible={director?.scene === scene}`

**✅ Points forts**: Architecture claire, séparation des scènes

**⚠️ Incohérence**: Le chapitre `about` est mappé à `gallery` mais devrait probablement avoir sa propre scène ou être statique

---

### `src/experience/CameraRig.tsx` (Lignes 1-46)

**Rôle**: Interpolation fluide de la caméra vers les cibles du store

**Trigger**: useFrame (chaque frame R3F)

**Propriétés animées**:
- position (x, y, z) via lerp
- lookAt via lerp
- fov via lerp (si PerspectiveCamera)

**Lerp Factor**:
- MEDIUM tier: 0.2
- HIGH tier: 0.16
- Formule: `1.0 - Math.exp(-delta * (lerpFactor * 60))`

**Timing**: Frame-based (delta en secondes)

**Cleanup**: Unsubscribe store

**✅ Points forts**: Lerp exponentiel pour smoothness, adaptation qualité

**⚠️ Risque**: Aucun clamp sur les valeurs, pourrait overshooter si le store change rapidement

---

### `src/experience/MediaPlane.tsx` (Lignes 1-138)

**Rôle**: Plan texturé générique avec hover et mode Front/Behind

**Trigger**: useFrame (chaque frame)

**Propriétés animées**:
- position.x, y, z via `THREE.MathUtils.damp` (damping factor 4-5)
- scale.x, y via damp (factor 5)
- opacity: statique (0.9 pour behind, 1.0 pour front)

**Effets de state**:
- `isBehindActive`: Modifie le Z offset
  - Si `isBehindLayer`: offset = foreground - background ou background - primary
  - Sinon: offset = background - primary ou 0
- `hovered`: Z +0.4, scale *1.05

**Timing**: Frame-based (delta)

**Interactions**:
- `onPointerOver`: Set cursorMode 'view', cursorText label
- `onPointerOut`: Reset cursor
- `onClick`: Callback optionnel

**Texture**: Chargé via THREE.TextureLoader, SRGBColorSpace

**Cleanup**: Aucun cleanup explicite (useFrame auto)

**✅ Points forts**: Damping pour smoothness, gestion Front/Behind

**⚠️ BUG**: Ligne 60 - Le calcul `SPATIAL_LANES.foreground.z - SPATIAL_LANES.background.z` = 2.0 - (-6.0) = 8.0, ce qui est énorme comme offset

**⚠️ Incohérence**: Le damping factor est hardcodé (4-5) au lieu d'utiliser MOTION_TIMINGS

---

### `src/experience/Phone.tsx` (Lignes 1-163)

**Rôle**: Modèle 3D de smartphone avec animations de flottement et changement de contenu

**Trigger**: useFrame (chaque frame)

**Propriétés animées**:
- position.y: Flottement sinusoïdal (`Math.sin(time * 1.5) * 0.05`)
- position.x, z: Damping vers target
- rotation.y: Flottement + hover tilt
- rotation.x: Hover tilt
- rotation.z: Basé sur `chapterProgress` (`Math.sin(progress * Math.PI) * 0.035`)
- screen texture: Changement basé sur `chapterProgress` (3 beats)
- phase indicators opacity: Damping basé sur progress

**Effets de state**:
- `chapterProgress`: Détermine l'index de texture (0-2) et l'opacity des phases
- `hovered`: Rotation Y +0.15, X -0.1

**Timing**: Frame-based (time depuis clock)

**Textures**: 3 textures chargées (yuna-story, mgc-scrapbook, comptoir-macro)

**Géométrie**:
- Chassis: box 2.2x4.4x0.18
- Screen: plane 2.0x4.2
- Dynamic Island: plane 0.5x0.12
- Phase dots: 3 planes 0.28x0.035
- Home bar: plane 1.22x0.05

**Interactions**:
- `onPointerOver`: Set cursorMode 'open'
- `onPointerOut`: Reset cursor
- `onClick`: Callback optionnel

**Cleanup**: Aucun cleanup explicite

**✅ Points forts**: Animations riches, rythme basé sur le scroll

**⚠️ BUG**: Ligne 94 - `Math.min(2, Math.floor(progress * 3))` peut causer des sauts si progress n'est pas linéaire

**⚠️ Incohérence**: La position Y du groupe est hardcodée dans ExperienceCanvas (-6.5) mais le phone a son propre flottement

---

### `src/experience/GalleryRoom.tsx` (Lignes 1-72)

**Rôle**: Salle de galerie 3D statique avec murs et cadres

**Trigger**: Aucune animation (statique)

**Géométrie**:
- Back wall: box 18x10x0.5 à z=-6
- Floor: plane 18x16 à y=-3.8
- Left/Right walls: box 0.5x10x8
- 3 MediaPlanes: yuna-story, mgc-scrapbook, comptoir-macro

**Matériaux**:
- meshStandardMaterial avec roughness 0.55-0.65, metalness 0.05-0.08
- Couleur: #0b0c0e (dark), #121418 (floor)

**Position**: group à [0, -12, 0] dans ExperienceCanvas

**⚠️ Incohérence**: Pas d'animation alors que la section Gallery a un scroll horizontal

**⚠️ Manque**: Pas d'éclairage spécifique à la galerie (utilise l'éclairage global)

---

### `src/experience/ProjectConstellation.tsx` (Lignes 1-59)

**Rôle**: Constellation de projets 3D avec drift subtil

**Trigger**: useFrame (chaque frame)

**Propriétés animées**:
- rotation.y: `Math.sin(time * 0.22) * 0.025`
- position.y: `Math.cos(time * 0.3) * 0.025`

**Effets de state**:
- `activeProject`: Set via onClick sur chaque MediaPlane

**Timing**: Frame-based (time depuis clock)

**Structure**:
- 3 MediaPlanes (yuna, mgc, comptoir)
- Positions: [-3.2, 1.2], [2.8, 2.0], [3.6, -1.8]
- Z: midground et background

**Interactions**:
- Chaque plane: onClick → set activeProject dans store

**Cleanup**: Aucun cleanup explicite

**✅ Points forts**: Mouvement subtil, ne distrait pas

**⚠️ Incohérence**: La position Y du groupe est -18 dans ExperienceCanvas, très bas

---

## 📜 Sections DOM & Animations GSAP

### `src/sections/IntroSection.tsx` (Lignes 1-88)

**Rôle**: Intro cinématique avec animation de nom

**Trigger**: Mount (useEffect)

**Propriétés animées**:
- `metaRef`: opacity 0→1, y 12→0, duration 0.65, ease power4.out
- `lineRef`: scaleY 0→1, duration 0.8, ease expo.out
- `nameRef`: clipPath inset, yPercent 10→0, duration 1.0, ease expo.out

**Timing**: Timeline séquentielle avec overlaps ('-=0.35', '-=0.45')

**Effets de state**:
- `onComplete`: Set currentChapter 'hero', setVisible false

**Cleanup**: `ctx.revert()`

**Dépendances**: MasterTimelineManager, appStore

**✅ Points forts**: Animation cinématique premium, easings variés

**⚠️ BUG**: La section devient `invisible` après l'animation mais reste dans le DOM (ligne 54), ce qui peut bloquer le scroll

---

### `src/sections/HeroSection.tsx` (Lignes 1-136)

**Rôle**: Section hero avec scroll pinned et caméra dynamique

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile '+=110%', desktop '+=140%'
- pin: true
- scrub: 0.5
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `glwadysRef`: xPercent -11, opacity 0.88, duration 0.8
- `dalleauRef`: xPercent 11, opacity 0.88, duration 0.8
- `headlineRef`: yPercent -24, opacity 0.15, duration 0.8
- `portraitFrameRef`: scale 1.14, yPercent -6, opacity 1, duration 0.9
- `metaGlassRef`: opacity 0, y -28, duration 0.55
- Camera: z 8.5→7.0, y 0→-0.4, duration 1.5

**Timing**: Phases avec overlaps ('<', '<0.1', '<0.16')

**Effets de state**:
- `onUpdate`: Set chapter 'identity' si progress > 0.6, sinon 'hero'

**Cleanup**: `ctx.revert()`

**Dépendances**: MasterTimelineManager, ScrollTrigger

**✅ Points forts**: Multi-axis progression, caméra couplée

**⚠️ Incohérence**: Le scrub 0.5 est différent de MOTION_TIMINGS.standardScrub (0.55)

---

### `src/sections/IdentitySection.tsx` (Lignes 1-134)

**Rôle**: Section identity avec grille déconstruite

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: '+=165%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `titleRef`: y -30, opacity 0.3, duration 1
- `textRef`: y -20, opacity 0.2, duration 1
- `cells[0]`: xPercent -40, yPercent -30, rotate -6, duration 1.5
- `cells[1]`: xPercent 30, yPercent -40, rotate 4, duration 1.5
- `cells[2]`: xPercent -50, yPercent 40, rotate 5, duration 1.5
- `cells[3]`: xPercent 40, yPercent 30, rotate -4, duration 1.5
- Camera: z 7.0→7.5, y -0.4→-3.0, duration 1.5

**Timing**: Stagger implicite via position dans timeline

**Effets de state**:
- `onUpdate`: Set chapter 'social' si progress > 0.7, sinon 'identity'

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Déconstruction spatiale de la grille

**⚠️ BUG**: Si cells n'existent pas (querySelector null), la timeline est vide mais pas d'erreur

---

### `src/sections/SocialSection.tsx` (Lignes 1-144)

**Rôle**: Section social avec mode Front/Behind et phone dive

**Trigger**: ScrollTrigger (pinned) + Store subscription

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile '+=220%', desktop '+=290%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.social-card-left`: xPercent -120, opacity 0, duration 0.75
- `.social-card-right`: xPercent 120, opacity 0, duration 0.75
- Camera: z 7.5→1.4, y -3.0→-6.5, fov 45→54, duration 1.35

**Timing**: Parallèle ('<')

**Effets de state**:
- `onUpdate`: Set chapterProgress, set chapter 'gallery' si > 0.94
- `isBehindActive`: Affiche le label Behind/Front

**Cleanup**: Unsubscribe store, set chapterProgress 0, ctx.revert()

**Dépendances**: MasterTimelineManager, appStore

**✅ Points forts**: Mode Front/Behind intégré, camera dive

**⚠️ Incohérence**: Le phone 3D est à Y=-6.5 mais la caméra va à Y=-6.5, donc ils sont au même niveau (pas de dive réel)

---

### `src/sections/GallerySection.tsx` (Lignes 1-122)

**Rôle**: Section gallery avec scroll horizontal

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: `max(track.scrollWidth * 0.82, window.innerHeight * 2.4)`
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `track`: x -totalWidth, ease none, duration 2.1
- Camera: x 0→4.0, y -6.5→-12.0, z 1.4→7.5, fov 54→45, duration 2.1

**Timing**: Parallèle ('<')

**Effets de state**:
- `onUpdate`: Set chapter 'brand' si progress > 0.85

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Scroll horizontal couplé à caméra 3D

**⚠️ BUG**: `track.scrollWidth` peut être 0 si le contenu n'est pas rendu, causant une end value de 0

---

### `src/sections/BrandSection.tsx` (Lignes 1-146)

**Rôle**: Section brand avec stagger d'items

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: '+=160%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.brand-table-item`: y 60→0, opacity 0→1, scale 0.95→1, stagger 0.08, duration 0.9, ease power4.out
- Camera: x 4.0→0, y -12.0→-15.0, z 7.5→7.0, duration 1

**Timing**: Séquentiel avec overlap ('<')

**Effets de state**:
- `onUpdate`: Set chapter 'strategy' si progress > 0.8

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Stagger élégant

**⚠️ BUG**: Si items n'existent pas, timeline vide

---

### `src/sections/StrategySection.tsx` (Lignes 1-154)

**Rôle**: Section strategy avec scroll horizontal (light mode)

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: `max(steps.scrollWidth * 0.45, window.innerHeight * 1.4)`
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `steps`: x -totalShift, ease none, duration 1.2
- Camera: x 0, y -15.0→-18.0, z 7.0→8.5, duration 1.2

**Timing**: Parallèle ('<')

**Effets de state**:
- `onUpdate`: Set chapter 'about' si progress > 0.85

**Style**: Light mode (bg #f5f3ef, text #121418)

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Transition light mode, scroll horizontal

**⚠️ Incohérence**: Pas de transition de couleur animée, juste CSS

---

### `src/sections/AboutSection.tsx` (Lignes 1-105)

**Rôle**: Section about avec 4 lignes cinétiques

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile '+=90%', desktop '+=150%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `line1Ref`: x -80→0, opacity 0→1, duration 1
- `line2Ref`: y 60→0, opacity 0→1, duration 1
- `line3Ref`: scale 0.8→1, opacity 0→1, duration 1
- `line4Ref`: opacity 0→1, y 30→0, duration 0.7
- `bioRef`: opacity 0→1, y 20→0, duration 1

**Timing**: Overlaps ('-=0.4', '-=0.3', '-=0.5')

**Effets de state**:
- `onUpdate`: Set chapter 'journey' si progress > 0.8

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Animation multi-directionnelle (X, Y, scale)

**⚠️ Incohérence**: Pas de caméra 3D (reste à finalCallback)

---

### `src/sections/JourneySection.tsx` (Lignes 1-112)

**Rôle**: Section journey timeline avec scroll horizontal

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile `max(scrollWidth * 0.22, vh * 0.9)`, desktop `max(scrollWidth * 0.4, vh * 1.4)`
- pin: true
- scrub: 0.5
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `track`: x -totalShift, ease none, duration 1.4
- `.j-year-item`: y 28→0, opacity 0.15→1, stagger 0.07, duration 0.55, ease power4.out

**Timing**: Séquentiel avec overlap ('<0.1')

**Effets de state**:
- `onUpdate`: Set chapter 'work' si progress > 0.85

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Stagger sur items, scroll horizontal

**⚠️ Incohérence**: Scrub 0.5 au lieu de 0.55

---

### `src/sections/WorkSection.tsx` (Lignes 1-131)

**Rôle**: Section work avec constellation de projets

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: '+=145%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.work-constellation-node`: y 80→0, opacity 0→1, scale 0.9→1, stagger 0.1, duration 0.95, ease power4.out

**Timing**: Stagger uniquement

**Effets de state**:
- `onUpdate`: Set chapter 'services' si progress > 0.8

**Style**: Perspective CSS 1200px sur container

**Interactions**: onClick → scrollIntoView case study

**Cleanup**: `ctx.revert()`

**✅ Points forts**: Perspective CSS pour effet 3D

**⚠️ Incohérence**: Pas de caméra 3D (reste à finalCallback)

---

### `src/sections/ServicesSection.tsx` (Lignes 1-101)

**Rôle**: Section services avec stagger et perspective

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: '+=130%'
- pin: true
- scrub: 0.45
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.service-line`: y 60→0, opacity 0→1, rotateX -6→0, stagger 0.08, duration 0.55, ease power4.out
- `.service-title`: x -40→0, opacity 0→1, stagger 0.08, duration 0.45, ease power3.out

**Timing**: Overlap ('<0.12')

**Style**: Perspective CSS 1000px sur container

**⚠️ Incohérence**: Scrub 0.45 différent des autres, pas de chapter update

**⚠️ Manque**: Pas de caméra 3D ni de chapter progression

---

### `src/sections/ExperienceSection.tsx` (Lignes 1-164)

**Rôle**: Section experience avec stacking cards

**Trigger**: ScrollTrigger (non-pinned, toggleActions)

**Configuration ScrollTrigger**:
- trigger: sectionRef
- start: 'top 70%'
- toggleActions: 'play none none reverse'

**Propriétés animées**:
- `.stack-card`: y 42→0, opacity 0→1, stagger 0.08, duration 0.7, ease power4.out

**Timing**: Stagger uniquement

**Style**: Pas de pin, animation au viewport entry

**⚠️ Incohérence**: Pas de caméra 3D, pas de chapter update, différent des autres sections

**⚠️ Manque**: my-12 crée un espacement qui peut casser le flow

---

### `src/sections/ContactSection.tsx` (Lignes 1-85)

**Rôle**: Section contact statique avec CTA

**Trigger**: Aucune animation (statique)

**Interactions**:
- Copy email: navigator.clipboard, timeout 2500ms
- ScrollTo contact: smooth scroll

**Style**: -mt-[20vh] pt-[24vh] pour overlap

**⚠️ Incohérence**: Aucune animation, différent du reste du site

**⚠️ Manque**: Pas de caméra 3D

---

### `src/sections/YunaCaseStudy.tsx` (Lignes 1-122)

**Rôle**: Case study Yuna avec pinned scroll

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile '+=105%', desktop '+=125%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.yuna-element`: y 54→0, opacity 0→1, scale 0.94→1, stagger 0.08, duration 0.9, ease power4.out
- `.yuna-element`: y -18, scale 1.015, duration 0.8, ease none (phase 2)

**Timing**: Séquentiel avec overlap ('<0.3')

**⚠️ Incohérence**: Pas de caméra 3D, pas de chapter update

---

### `src/sections/MgcCaseStudy.tsx` (Lignes 1-103)

**Rôle**: Case study MGC avec scrapbook effect

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile '+=105%', desktop '+=120%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.scrapbook-item`: scale 0.88→1, y 60→0, opacity 0→1, rotation (i%2?-4:4)→0, stagger 0.08, duration 0.9, ease power4.out
- `.scrapbook-item`: y -14, duration 0.75, ease none (phase 2)

**Timing**: Séquentiel avec overlap ('<0.35')

**Style**: Rotations CSS alternées (-2, 3, -1) avec hover reset

**✅ Points forts**: Effet scrapbook avec rotations

**⚠️ Incohérence**: Pas de caméra 3D

---

### `src/sections/ComptoirCaseStudy.tsx` (Lignes 1-110)

**Rôle**: Case study Comptoir avec pinned scroll

**Trigger**: ScrollTrigger (pinned)

**Configuration ScrollTrigger**:
- start: 'top top'
- end: mobile '+=105%', desktop '+=115%'
- pin: true
- scrub: 0.55
- anticipatePin: 1
- invalidateOnRefresh: true

**Propriétés animées**:
- `.comptoir-element`: y 48→0, opacity 0→1, scale 0.95→1, stagger 0.08, duration 0.9, ease power4.out
- `.comptoir-element`: y -14, duration 0.7, ease none (phase 2)

**Timing**: Séquentiel avec overlap ('<0.35')

**⚠️ Incohérence**: Pas de caméra 3D

---

## 🎨 UI Components

### `src/ui/CustomCursor.tsx` (Lignes 1-76)

**Rôle**: Curseur personnalisé avec modes

**Trigger**: Mouse move + Store subscription

**Propriétés animées**:
- x, y: gsap.quickTo, duration 0.09, ease power3.out
- width, height: 14px (default) → 84px (expanded)
- background, border, backdropFilter: selon mode

**Effets de state**:
- `cursorMode`: Détermine l'expansion et le texte
- `cursorText`: Texte affiché dans le curseur
- `quality.enableCustomCursor`: Désactive sur MEDIUM/SAFE

**Timing**: Mouse move (duration 0.09)

**Cleanup**: Unsubscribe store, removeEventListener, killTweensOf

**✅ Points forts**: quickTo pour performance, modes variés

**⚠️ Incohérence**: Le mode 'drag' existe dans le type mais n'est jamais utilisé

---

### `src/ui/BehindSwitch.tsx` (Lignes 1-48)

**Rôle**: Toggle Front/Behind mode

**Trigger**: Click + Store subscription

**Effets de state**:
- `isBehindActive`: Toggle via setState
- UI change: Eye → Layers icon, text change

**Style**: Position fixed bottom-right, glass-panel

**✅ Points forts**: UI claire, animation pulse sur active

**⚠️ Incohérence**: Le toggle affecte tout le site mais n'est visible que dans la section Social

---

### `src/ui/ChapterIndexModal.tsx` (Lignes 1-96)

**Rôle**: Modal de navigation par chapitre

**Trigger**: Store subscription (isIndexOpen)

**Effets de state**:
- `isIndexOpen`: Affiche/masque le modal
- Navigation: scrollIntoView sectionId

**Style**: Fixed inset, backdrop-blur, grid layout

**Cleanup**: Unsubscribe store

**✅ Points forts**: Navigation rapide, multilingue

**⚠️ Incohérence**: Les noms de chapitres sont hardcodés, pas dynamiques depuis store

---

### `src/ui/Navbar.tsx` (Lignes 1-112)

**Rôle**: Navigation principale avec indicateur de chapitre

**Trigger**: Store subscription

**Effets de state**:
- `currentChapter`: Affiché dans l'indicateur central
- `isIndexOpen`: Sync avec modal
- Locale switch: router.replace

**Interactions**:
- Brand pill: scrollTo top
- Index toggle: setState isIndexOpen
- Contact: scrollTo contact-section

**Style**: Fixed top, glass-pill, pointer-events-none sur container

**✅ Points forts**: Indicateur de chapitre en temps réel

**⚠️ Incohérence**: L'indicateur affiche le nom brut du chapter (ex: 'intro') pas localisé

---

### `src/ui/NoiseOverlay.tsx` (Lignes 1-10)

**Rôle**: Overlay de bruit visuel

**Trigger**: Aucun (statique)

**Style**: Fixed, z-index 999, opacity 0.035, SVG filter

**⚠️ Performance**: SVG filter avec feTurbulence peut être coûteux sur certains devices

---

### `src/ui/Footer.tsx` (Lignes 1-29)

**Rôle**: Footer avec scroll to top

**Trigger**: Click

**Interactions**: scrollTo top (smooth)

**Style**: Border-top, glass-pill

**⚠️ Incohérence**: Pas d'animation, différent du style premium du site

---

## 🐛 Bugs, Incohérences & Risques

### Bugs Critiques

1. **Mobile WebGL désactivé** (`ExperienceCanvas.tsx:34`)
   - Sur mobile (width < 768), WebGL est complètement désactivé
   - L'expérience 3D n'existe pas sur mobile
   - Impact: 50%+ des utilisateurs ne voient pas la 3D

2. **IntroSection invisible après animation** (`IntroSection.tsx:54`)
   - La section devient `invisible` après l'animation mais reste dans le DOM
   - Peut bloquer le scroll ou créer des zones fantômes
   - Solution: Retirer du DOM après animation

3. **MediaPlane Z offset incorrect** (`MediaPlane.tsx:60`)
   - Calcul: `SPATIAL_LANES.foreground.z - SPATIAL.LANES.background.z` = 8.0
   - Offset énorme qui peut placer les plans hors champ
   - Impact: Mode Front/Behind non fonctionnel

4. **GallerySection track.scrollWidth = 0** (`GallerySection.tsx:21`)
   - Si le contenu n'est pas rendu, scrollWidth = 0
   - End value de ScrollTrigger devient 0
   - Impact: Section non scrollable

### Incohérences

1. **Camera presets non utilisés** (`cameraPath.ts` vs `spatial.ts`)
   - `constellation` preset existe mais n'est pas dans cameraPath
   - Les chapitres about/work/services/experience/contact ont tous la même caméra (finalCallback)

2. **Scrub values inconsistants**
   - Hero: 0.5
   - Identity: 0.55
   - Social: 0.55
   - Gallery: 0.55
   - Brand: 0.55
   - Strategy: 0.55
   - About: 0.55
   - Journey: 0.5
   - Work: 0.55
   - Services: 0.45
   - Devrait utiliser MOTION_TIMINGS.standardScrub (0.55)

3. **Damping factors hardcodés** (`MediaPlane.tsx`, `Phone.tsx`)
   - MediaPlane: 4-5
   - Phone: 4
   - Devrait utiliser MOTION_TIMINGS.lerpFactor

4. **Positions Y hardcodées** (`ExperienceCanvas.tsx`)
   - Social group: -6.5
   - Gallery group: -12
   - Constellation: -18
   - Pas de correspondance avec les presets caméra

5. **Case studies sans caméra 3D**
   - Yuna, MGC, Comptoir: pas de caméra 3D
   - Restent à finalCallback
   - Incohérent avec le reste du site

6. **Services/Experience/Contact sans caméra 3D**
   - Pas de caméra 3D ni de chapter progression
   - Différent du pattern établi

7. **Phone dive incorrect** (`SocialSection.tsx:58`)
   - Caméra Y: -3.0 → -6.5
   - Phone Y: -6.5 (dans ExperienceCanvas)
   - Ils sont au même niveau, pas de dive réel

### Risques

1. **Performance sur low-end**
   - 3 MediaPlanes + Phone + GalleryRoom + Constellation = ~40 objets
   - Sur MEDIUM tier, maxPlanes = 16 mais tous sont rendus
   - Risque: Crash ou lag sur mobile

2. **Memory leaks**
   - Textures chargées dans MediaPlane et Phone sans dispose
   - useFrame sans cleanup explicite
   - Risque: Memory leak sur navigation

3. **ScrollTrigger refresh**
   - `invalidateOnRefresh: true` sur toutes les sections
   - Peut causer des recalculs coûteux
   - Risque: Lag sur resize

4. **Lenis + ScrollTrigger**
   - Lenis smooth scroll + ScrollTrigger scrub
   - Double interpolation peut causer du jitter
   - Risque: Animation non fluide

5. **State sync**
   - Plusieurs sections mettent à jour currentChapter
   - Pas de validation ni de debouncing
   - Risque: Chapter incorrect en cas de scroll rapide

6. **Accessibility**
   - `prefers-reduced-motion` désactive Lenis mais pas GSAP
   - Les animations 3D continuent
   - Risque: Mauvaise expérience accessibilité

7. **Texture loading**
   - Pas de gestion d'erreur de chargement
   - Pas de placeholder
   - Risque: Plans noirs si assets manquants

---

## 💡 Recommandations

### Priorité 1 (Critique)

1. **Activer WebGL sur mobile avec fallback**
   - Détecter la capacité GPU plutôt que le user agent
   - Réduire la qualité sur mobile (moins de plans, pas de shaders)
   - Ajouter un mode "2D only" si WebGL échoue

2. **Corriger le Z offset de MediaPlane**
   - Revoir la logique Front/Behind
   - Utiliser des valeurs plus petites (ex: 1-2 au lieu de 8)
   - Tester sur tous les cas d'usage

3. **Retirer IntroSection du DOM après animation**
   - Utiliser un state pour conditionner le rendu
   - Ou utiliser un portal pour retirer du flux

4. **Ajouter des guards pour scrollWidth**
   - Vérifier que scrollWidth > 0 avant de créer le ScrollTrigger
   - Fallback à une valeur par défaut

### Priorité 2 (Incohérences)

1. **Uniformiser les scrub values**
   - Utiliser MOTION_TIMINGS partout
   - Ou définir des valeurs par section dans spatial.ts

2. **Utiliser les damping factors de MOTION_TIMINGS**
   - Passer les facteurs aux composants 3D
   - Adapter selon la qualité tier

3. **Corriger les positions Y des groupes 3D**
   - Aligner avec les presets caméra
   - Ou définir une constante par scène

4. **Ajouter des caméras pour les case studies**
   - Définir des presets spécifiques
   - Ou utiliser la constellation avec zoom

5. **Activer la caméra pour Services/Experience/Contact**
   - Définir des presets
   - Ou rester à finalCallback avec justification

### Priorité 3 (Performance)

1. **Limiter le nombre de plans sur MEDIUM tier**
   - N'afficher que la scène active
   - Ou utiliser des LOD (Level of Detail)

2. **Disposer les textures**
   - Ajouter un cleanup dans useEffect
   - Utiliser useLoader de R3F avec dispose

3. **Optimiser ScrollTrigger**
   - Désactiver invalidateOnRefresh si possible
   - Utiliser markers pour debug

4. **Réduire la complexité des animations**
   - Simplifier les timelines
   - Utiliser des easings moins coûteux

### Priorité 4 (UX)

1. **Améliorer l'accessibilité**
   - Désactiver GSAP si prefers-reduced-motion
   - Ajouter des skip links
   - Supporter la navigation clavier

2. **Ajouter des loaders**
   - Loader pour les textures
   - Skeleton screens pour le contenu
   - Progress indicator pour le chargement initial

3. **Améliorer le feedback**
   - Indicateur de scroll
   - Progress bar par chapitre
   - Toast pour les actions (copy, etc.)

4. **Localiser l'UI**
   - Traduire les noms de chapitres
   - Traduire les labels du curseur
   - Traduire les messages d'erreur

---

## 📊 Résumé

**Sections analysées**: 21
**Composants 3D**: 6
**UI Components**: 6
**Fichiers config**: 3
**Hooks**: 1

**Total des animations identifiées**: ~50 timelines GSAP + ~6 animations R3F frame-based

**Bugs critiques**: 4
**Incohérences**: 7
**Risques**: 7

**État général**: Architecture solide mais incohérences dans les valeurs et la gestion mobile. L'expérience 3D est bien pensée mais mal adaptée aux devices contraints.