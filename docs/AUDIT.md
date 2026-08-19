# AUDIT COMPLET — Animations & Hiérarchie 3D

> Portfolio Glwadys Dalleau — Next.js 14 + GSAP + R3F  
> Objectif : comprendre qui contrôle quoi, où se trouvent les animations, et identifier les incohérences / points de blocage.

---

## 1. Architecture globale

Le site est un **one-page scrollytelling** en 7 actes (12 chapitres dans le store).  
Les déplacements de caméra, les apparitions et les transitions sont pilotés par **GSAP ScrollTrigger** côté DOM, et par **R3F + store** côté WebGL.

```
app/[locale]/layout.tsx        ← monte Canvas, UI globale, nav, curseur
            ↓
app/[locale]/page.tsx          ← enchaîne les <Section />
            ↓
sections/*.tsx                 ← chaque acte = pinned timeline GSAP
            ↓
motion/MasterTimeline.ts       ← register GSAP + ScrollTrigger
lib/store.ts                   ← state central (chapitre, caméra, quality...)
            ↓
experience/*.tsx               ← R3F : caméra, scènes, téléphone, galerie
```

---

## 2. State central — lib/store.ts

Fichier : `src/lib/store.ts`

```
Chapter = 'intro' | 'hero' | 'identity' | 'social' | 'gallery' | 'brand' | 'strategy' | 'about' | 'journey' | 'work' | 'services' | 'experience' | 'contact'
```

| Propriété | Utilisée par | Rôle |
|-----------|--------------|------|
| `currentChapter` | Toutes les sections + SceneDirector + BottomNav | Chapitre actif du récit |
| `scrollProgress` | Stocké mais peu lu | Progression brute scroll |
| `chapterProgress` | Phone.tsx, SceneDirector | Avancement à l'intérieur d'un chapitre 3D |
| `isBehindActive` | BehindSwitch, MediaPlane, SocialSection | Mode "front / behind the scenes" |
| `activeProject` | ProjectConstellation | Projet cliqué dans la constellation |
| `quality` | ExperienceCanvas, CameraRig, CustomCursor | Tiers GPU (HIGH / MEDIUM / SAFE) |
| `camera` (x,y,z,fov...) | CameraRig + sections | Position cible de la caméra R3F |
| `isIndexOpen` | ChapterIndexModal | Ouverture du sommaire |
| `isLoaded` | BottomNav | Fin de l'intro |
| `cursorMode` / `cursorText` | CustomCursor, MediaPlane, Phone | Curseur contextuel |

---

## 3. Orchestrateur — motion/MasterTimeline.ts

Fichier : `src/motion/MasterTimeline.ts`

- `init()` : enregistre `ScrollTrigger` une seule fois.
- `setChapter(c)` : met à jour `currentChapter`.
- `updateCamera(p)` : merge partiel de `camera` dans le store.

C'est un dispatcher. Chaque section garde sa propre timeline et appelle `setChapter` / `updateCamera` dans `onUpdate`.

---

## 4. Sections DOM — acte par acte

### 4.1 OpeningSection.tsx

Fichier : `src/sections/OpeningSection.tsx`

**Rôle :** Introduction entièrement DOM. Pas de 3D.

**Séquence auto (0 → ~6 s) :**
1. Métadonnées `PORTFOLIO 2026 / MARSEILLE` apparaissent.
2. `GLWADYS` et `DALLEAU` révélés avec `yPercent: 100` (line-reveal).
3. `letterSpacing` animé de `0.18em` vers `-0.04em`.
4. 5 médias arrivent par les bords : `leftFar`, `leftNear`, `portrait`, `rightNear`, `rightFar`.
5. Morphose en composition Hero : `GLWADYS` en haut-gauche, `DALLEAU` en bas-droite, portrait centré.
6. Tagline et rôles apparaissent.
7. `isLoaded = true` et `currentChapter = 'hero'`.

**Parallax souris (desktop) :**  
5 éléments (`portrait`, 4 satellites) avec `gsap.quickTo`, coefficients 0.06–0.22. Pas de mouvement sur les mots.

**Scroll pinned :**  
`end: '+=150%'` desktop. Les cartes latérales s'écartent, le portrait zoome, les mots s'effacent. À 85 % : `setChapter('identity')`.

**Dépendances i18n :** `tIntro('sub/location/roles')`, `tHero('headlinePart1-4')`.

**⚠️ BUG identifié :** Les messages `fr/en/ko.json` ont été remplacés pour ne plus contenir `headlinePart1-4` (remplacés par `headline`). `OpeningSection.tsx` appelle encore `tHero('headlinePart1')` etc. → **build cassé**.

---

### 4.2 IdentitySection.tsx

- Pinned `+=165%`.
- Titre + texte s'éloignent, 4 `.grid-cell` dispersent.
- Caméra R3F : `z: 7.0 → 7.5`, `y: -0.4 → -3.0`.
- À 70 % : `setChapter('social')`.

**Problème :** ne modifie pas `chapterProgress`, donc le téléphone n'a pas de progression scroll dans Identity.

---

### 4.3 SocialSection.tsx

- Pinned `+=220%` (mobile) / `+=290%` (desktop).
- Deux cartes DOM s'écartent.
- `chapterProgress` mis à jour.
- Caméra : `z: 7.5 → 1.4`, `y: -3.0 → -6.5`, `fov: 45 → 54`.
- À 94 % : `setChapter('gallery')`.

**Lien 3D :** `Phone.tsx` utilise `chapterProgress` pour changer d'écran.

---

### 4.4 GallerySection.tsx

- Pinned. Track horizontal.
- Caméra : `x: 0→4.0`, `y: -6.5→-12.0`, `z: 1.4→7.5`, `fov: 54→45`.
- À 85 % : `setChapter('brand')`.

**Lien 3D :** `GalleryRoom` visible dans `gallery`.

---

### 4.5 BrandSection.tsx

- Pinned `+=160%`.
- 4 `.brand-table-item` en stagger.
- Caméra : `x: 4.0→0`, `y: -12.0→-15.0`, `z: 7.5→7.0`.
- À 80 % : `setChapter('strategy')`.

---

### 4.6 StrategySection.tsx

- Pinned. Track horizontal des 4 étapes.
- Caméra : `y: -15.0→-18.0`, `z: 7.0→8.5`.
- À 85 % : `setChapter('about')`.

---

### 4.7 AboutSection.tsx

- Pinned `+=90%` / `+=150%`.
- 4 lignes manifesto + bio.
- Pas de caméra 3D.
- À 80 % : `setChapter('journey')`.

---

### 4.8 JourneySection.tsx

- Pinned. Timeline horizontale 2021–2026.
- À 85 % : `setChapter('work')`.

---

### 4.9 WorkSection.tsx

- Pinned `+=145%`.
- 3 `.work-constellation-node` en apparition.
- `setChapter('work')` puis `services` à 80 %.

**Lien 3D :** `ProjectConstellation` visible dans `work`.

---

### 4.10 Case Studies (Yuna / Mgc / Comptoir)

- Chacun pinned individuellement.
- Animations scrub : `y`, `opacity`, `scale`, `rotation`.
- Aucun `setChapter` → la nav ne les reflète pas.

---

### 4.11 ServicesSection.tsx

- Pinned `+=130%`.
- 7 `.service-line` + `.service-title` en stagger.
- Pas de `setChapter`.

---

### 4.12 ExperienceSection.tsx

- Non pinned. `.stack-card` apparaissent au scroll.
- Pas de `setChapter`.

---

### 4.13 ContactSection.tsx

- Section finale. Copie email, liens. Pas d'animation scroll.

---

## 5. UI globale

### 5.1 BottomNav.tsx

- Fixée en bas, apparaît quand `isLoaded`.
- 5 boutons : `GD / WORK / ABOUT / EXPERTISE / CONTACT`.
- Switch langue `fr/en/ko`.
- Numéro de chapitre affiché.

### 5.2 CustomCursor.tsx

- Curseur desktop, suit la souris via `gsap.quickTo`.
- Change selon `cursorMode`.

### 5.3 BehindSwitch.tsx

- Toggle `isBehindActive`. Affecte `MediaPlane` Z et texte `SocialSection`.

### 5.4 ChapterIndexModal.tsx

- Modal plein écran. **Incohérence :** `intro-section` n'existe plus dans `page.tsx` (remplacé par `hero-section`).

### 5.5 NoiseOverlay.tsx / Footer.tsx

- Grain fixe. Footer back-to-top.

---

## 6. Hiérarchie 3D / R3F

### 6.1 ExperienceCanvas.tsx

- Rendu conditionnel : mobile / SAFE / pas WebGL.
- DPR adaptatif.
- Contenu actuel : `CameraRig`, `Phone` (scene `social`), `GalleryRoom` (scene `gallery`), `ProjectConstellation` (scene `work`).

**Observation :** le `SceneLayer scene="opening"` a été supprimé. Le Hero est 100 % DOM.

### 6.2 SceneDirector.tsx

```
SCENE_BY_CHAPTER = {
  intro: 'opening', hero: 'opening', identity: 'opening',
  social: 'social',
  gallery: 'gallery', brand: 'gallery', strategy: 'gallery', about: 'gallery',
  journey: 'work', work: 'work', services: 'work', experience: 'work', contact: 'work',
}
```

**Problème :** `intro/hero/identity` pointent vers `opening` mais il n'a plus d'enfants → rien n'affiche, ce qui est voulu.  
`about` pointe vers `gallery` et `journey/work` vers `work` → scènes 3D visibles hors de leur section narrative.

### 6.3 CameraRig.tsx

- S'abonne à `store.camera`.
- Lerp position, lookAt, FOV à chaque frame.
- Lissage côté R3F.

### 6.4 Phone.tsx

- Visible dans `social`.
- Flottement, rotation au hover.
- 3 beats d'écran selon `chapterProgress`.

### 6.5 GalleryRoom.tsx

- Salle 3D : murs, sol, 3 `MediaPlane`.
- Visible dans `gallery/brand/strategy/about`.

### 6.6 ProjectConstellation.tsx

- 3 `MediaPlane` disposés en triangle.
- Visible dans `journey/work/services/experience/contact`.
- Dérive orbitale lente.

### 6.7 MediaPlane.tsx

- Plan texturé / coloré.
- Gère `isBehindActive` pour décalage Z.
- Hover scale + curseur.

---

## 7. Spatial Design System

Fichier : `src/config/spatial.ts`

```
DEPTH = { foreground: 2.0, primary: 0.0, midground: -3.0, background: -6.0, far: -10.0 }
SPATIAL_LANES = { foreground, primary, midground, background, far }
CAMERA_PRESETS = { intro, hero, identity, social, phoneDive, gallery, brand, strategy, constellation, finalCallback }
```

Utilisé par `MediaPlane` pour le Z et documenté dans `cameraPath.ts` (non importé dans l'app).

---

## 8. Lenis + ScrollTrigger

Fichier : `src/hooks/useLenis.ts`

- Lenis smooth scroll, `lerp: 0.1`, `duration: 1.2`.
- `lenis.on('scroll', ScrollTrigger.update)`.
- `gsap.ticker` pilote le raf.
- Désactivé si `prefers-reduced-motion`.

---

## 9. Problèmes & incohérences

| # | Problème | Fichiers | Impact |
|---|----------|----------|--------|
| 1 | `OpeningSection` appelle `headlinePart1-4` supprimés | `OpeningSection.tsx`, `messages/*.json` | **Build cassé** |
| 2 | `ChapterIndexModal` référence `intro-section` mort | `ChapterIndexModal.tsx` | Lien Intro mort |
| 3 | `SceneDirector` map `about → gallery` et `journey/work → work` | `SceneDirector.tsx` | Scène 3D visible hors section |
| 4 | `CameraRig` garde la dernière cible sans reset | `CameraRig.tsx` | Jumps possibles |
| 5 | `Phone` dépend de `chapterProgress` seulement dans `Social` | `SocialSection.tsx`, `Phone.tsx` | Synchronisation limitée |
| 6 | Pas de fallback DOM 3D en SAFE/mobile | `ExperienceCanvas.tsx` | Perte d'effets 3D |
| 7 | `ServicesSection`, `ExperienceSection`, case studies n'appellent pas `setChapter` | - | Numérotation nav incorrecte |
| 8 | `WorkSection` set `services` à 80 % avant d'y arriver | `WorkSection.tsx` | Nav décalée |
| 9 | `OpeningSection` GSAP réparti dans 3 `useEffect` | `OpeningSection.tsx` | Risque conflit |
| 10 | `MasterTimeline.updateCamera` est un merge, pas un tween | `MasterTimeline.ts`, `CameraRig.tsx` | Lissage côté R3F |

---

## 10. Chemin d'une donnée scroll

```
Scroll utilisateur
        ↓
Lenis + ScrollTrigger
        ↓
gsap.timeline({ scrollTrigger: { pin, scrub } })
        ↓
MasterTimelineManager.setChapter('X')  →  appStore.currentChapter  →  SceneDirector
        ↓                                                      ↓
MasterTimelineManager.updateCamera(...)  →  appStore.camera  →  CameraRig  →  R3F camera
```

---

## 11. Points de vigilance pour les prochaines itérations

1. **Résoudre le build :** remettre `headlinePart1-4` dans `hero` ou adapter `OpeningSection` à `headline`.
2. **Unifier chapitre ↔ scène :** clarifier `about/journey/work`.
3. **Transitions 2D → 3D :** définir clairement où la 3D démarre (Social).
4. **Nettoyer `CameraRig` :** reset/transition douce entre scènes.
5. **Rendre case studies partie du récit :** ajouter `setChapter`.
6. **Ajouter `setChapter` manquants :** `ServicesSection`, `ExperienceSection`.
7. **Rendre `OpeningSection` robuste :** un seul `useEffect` GSAP, gestion resize.
