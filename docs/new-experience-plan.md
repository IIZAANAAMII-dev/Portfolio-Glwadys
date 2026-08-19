# NEW EXPERIENCE PLAN — GLWADYS DALLEAU

## 1. Architecture

**Stack**: Next.js 14 App Router + React 18 + TypeScript + Tailwind CSS + GSAP (ScrollTrigger) + Lenis.
**3D**: React Three Fiber + Three.js loaded lazily for the one local WebGL sequence.
**Export statique** (`output: 'export`), pas de SSR pour le motion (`'use client'` dans les actes).

### Système de fichiers

```text
src/
  app/
    [locale]/
      layout.tsx      # metadata, fonts, i18n, SmoothScroll
      page.tsx        # monte les actes
    page.tsx          # redirect / → /fr
    layout.tsx        # root minimal
    not-found.tsx
  components/
    shell/
      Grain.tsx
      SmoothScroll.tsx
      BottomNav.tsx
      CustomCursor.tsx
      LocaleSwitch.tsx
      QualityGate.tsx
    acts/
      Act00Opening.tsx
      Act01Hero.tsx
      Act02SocialWorld.tsx
      Act03Phone.tsx
      Act04WebGLPortal.tsx
      Act05ContactSheet.tsx
      Act06Strategy.tsx
      Act07WorkYuna.tsx
      Act08WorkMGC.tsx
      Act09WorkComptoir.tsx
      Act10Journey.tsx
      Act11Expertise.tsx
      Act12Contact.tsx
    three/
      SpatialScene.tsx
      MediaPlane.tsx
      CameraRig.tsx
    ui/
      DisplayText.tsx
      MetadataLine.tsx
      MediaFrame.tsx
  hooks/
    useLenis.ts
    useQuality.ts
    useReducedMotion.ts
    useI18n.ts
  lib/
    gsap.ts
    i18n/
      routing.ts
      messages.ts
    utils.ts
  styles/
    globals.css
    tokens.css
public/
  images/
    placeholder/     # jusqu'aux vrais assets
  fonts/
```

### Langues

FR (default), EN, KO.
Routes : `/fr`, `/en`, `/ko`.
Messages déclarés dans `src/lib/i18n/messages.ts` (ou fichiers JSON statiques).

### Design system

- **Colors**:
  - obsidian `#0B0B0B`
  - warm-ivory `#F7F2EA`
  - champagne `#DDCBA8`
  - espresso `#1E1812`
  - clay `#A85D4C` (accent rare)
- **Fonts**:
  - Display: `General Sans` (ou `Plus Jakarta Sans` fallback via Google Fonts)
  - Editorial: `Baskervville` / `Source Serif 4`
  - Mono: `JetBrains Mono`
  - KO: `Pretendard` / `Noto Sans KR`
- **Type scale**: fluide avec `clamp()`
  - hero name: `clamp(4rem, 16vw, 18rem)`
  - section word: `clamp(3rem, 11vw, 13rem)`
  - metadata: `11px` mono uppercase
- **Motion values**:
  - easings: `power3.out`, `power4.inOut`, `expo.out`
  - durations: micro `0.2–0.3s`, UI `0.4–0.6s`, major `0.7–1.2s`, stagger `0.05–0.08s`
- **Z-index**:
  - `z-0` background
  - `z-10` content
  - `z-20` sticky media
  - `z-30` nav
  - `z-40` cursor
  - `z-50` overlay

---

## 2. Actes narratifs

| Act | Composant | Pin | Rôle |
| :-- | :-- | :-: | :--- |
| 00 | `Act00Opening` | non | Générique automatique 2.8s qui fabrique la Hero |
| 01 | `Act01Hero` | oui | Magazine cover vivante, shrink dans le magazine |
| 02 | `Act02SocialWorld` | oui | Couches social FRONT / BEHIND, transformation vers téléphone |
| 03 | `Act03Phone` | oui | Phone naît, feed, focus, story, breakout |
| 04 | `Act04WebGLPortal` | oui | Téléphone devient écran, handoff DOM → WebGL, travelling Z |
| 05 | `Act05ContactSheet` | oui | Retour 2D horizontal, contact sheet → moodboard |
| 06 | `Act06Strategy` | oui | Brand system → horizontal stratégique |
| 07 | `Act07WorkYuna` | oui | Luxe, crop, macro, vertical calme |
| 08 | `Act08WorkMGC` | oui | Scrapbook, énergie, X/Y, collages |
| 09 | `Act09WorkComptoir` | non | Respiration, macro calme |
| 10 | `Act10Journey` | oui | Timeline horizontale, playhead fixe |
| 11 | `Act11Expertise` | oui | Kinetic typographie, un mot à la fois |
| 12 | `Act12Contact` | non | Nav devient CTA final, footer |

---

## 3. Timelines GSAP

### 00 — Opening (automatique)

```text
0.0s  fade-in grain + fond obsidian
0.1s  ligne horizontale 0 → 1 scaleX
0.3s  "GLWADYS DALLEAU" line-reveal (clipPath)
0.6s  metadata (SOCIAL MEDIA / CONTENT CREATION / BRAND COMMUNICATION)
0.9s  deux fragments média entrent depuis gauche/droite
1.4s  nom devient dominant (scale 1 → 4.2)
1.8s  fragments tournent et se positionnent en cover
2.2s  hold
2.5s  déverrouille scroll, apparaît BottomNav
```

**Out**: le wrapper opening reste dans le DOM et se transforme en `Act01Hero` via matching transforms. Pas de fade out / cut.

### 01 — Hero

- **Enter** : composition s'assemble à partir des éléments de l'opening.
- **Active** : magazine cover, portrait/détail média central, typographie dominante.
- **Shrink** : pinned `start: 'top top'`, `end: '+=130%'`, `scrub: 0.6`.
  - 0–30% : cover 100vh → 68vh, typo se recompose, satellites quittent.
  - 30–70% : re-crop média central, metadata réapparaît en bas.
  - 70–100% : transition vers Social : média devient 9:16, sort du frame.

### 02 — Social World

- Pinned `end: '+=160%'`.
- **Layers** : 5–7 médias en Z (foreground, mid, background).
- **Front** : contenus finis (reels, posts, stories).
- **Behind** : stratégie, planning, calendrier (mêmes médias écartés).
- **Exit** : un seul 9:16 reste, se recentre.

### 03 — Phone

- Pinned `end: '+=220%'`.
- Naissance DOM : bezel, frame, buttons, island construits autour du 9:16.
- **Feed** : translation Y du contenu à l'intérieur.
- **Focus** : pause + scale + metadata autour.
- **Story/Reel** : passage vertical, angle très léger.
- **Breakout** : contenu dépasse du téléphone.

### 04 — WebGL Portal

- Pinned `end: '+=180%'`.
- **Portal** : écran du phone scale 1 → viewport, bezel sort.
- **Handoff** : média DOM fullscreen → texture WebGL synchronisée.
- **R3F scene** : 5–8 `MediaPlane` à Z variés.
- **Camera** : translation Z principale, X/Y lissé par le scroll, micro influence souris desktop.
- **Exit** : Z converge, perspective s'aplatit.
- **Cleanup** : dispose textures/geometry, unmount Canvas.

### 05 — Contact Sheet → Moodboard

- Pinned horizontal `end: '+=120%'`.
- **X track** : 12–16 frames glissent horizontalement.
- **Moodboard** : images quittent le rail, rotations/overlaps libres.
- **Brand system** : rotations → 0, spacing, grille.

### 06 — Strategy

- Pinned `end: '+=130%'`.
- Background transition dark → warm-ivory.
- Grand mots horizontaux : AUDIENCE → POSITIONING → TONE → CONTENT → PLANNING → CAMPAIGN.

### 07 / 08 / 09 — Work

- **Yuna** : pinned, crop/scale, macro, luxe.
- **MGC** : pinned, scrapbook X/Y, collage.
- **Comptoir** : non-pinned, macro-scroll calme.

### 10 — Journey

- Pinned horizontal.
- Playhead fixe au centre.
- Années + rôle + média passent devant/derrière le playhead.

### 11 — Expertise

- Pinned.
- Mots-services plein écran, un actif à la fois.
- Mask/scale/crop/horizontal push.

### 12 — Contact

- Non-pinned.
- BottomNav s'anime en CTA final.
- Footer minimal.

---

## 4. ScrollTriggers

- Un `ScrollTrigger` maître par acte, géré via `useGSAP({ scope })`.
- `gsap.context()` + `ctx.revert()` pour le cleanup.
- `ScrollTrigger.refresh()` au resize et au changement de locale.
- `markers: false` en production.
- `pin: true` sur les actes à transformations, avec `pinSpacing: true`.
- `scrub` adapté : `0.5` pour les transformations directes, `0.8` pour le phone/3D.

---

## 5. Pins

| Pin | Durée approximative | Justification |
| :-- | :-- | :-- |
| Hero Shrink | `+=130%` | Transformer la cover en objet éditorial |
| Social | `+=160%` | Explorer Front/Behind, amener le téléphone |
| Phone | `+=220%` | Nombreux beats (feed, focus, story, breakout, portal) |
| WebGL | `+=180%` | Caméra travelling 3D |
| Contact Sheet | `+=120%` | Horizontal editing desk |
| Strategy | `+=130%` | Horizontal mot par mot |
| Yuna | `+=110%` | Luxe macro / crop |
| MGC | `+=110%` | Scrapbook énergie |
| Journey | `+=120%` | Timeline année par année |
| Expertise | `+=110%` | Kinetic typographie |

---

## 6. Transitions

Chaque acte implémente un `HANDOFF` explicite vers le suivant :

- **Opening → Hero** : même éléments, même références, scale/composition.
- **Hero → Social** : média central devient 9:16.
- **Social → Phone** : le 9:16 est conservé, le phone DOM construit autour.
- **Phone → WebGL** : screen scale 1 → viewport, texture passée à R3F.
- **WebGL → Contact Sheet** : z converge, DOM flat reproduit la composition.
- **Contact Sheet → Moodboard** : GSAP Flip / transform.
- **Moodboard → Brand → Strategy** : rotations → 0, spacing, grille.
- **Strategy → Yuna** : un média devient dominant, fullscreen, cutless.
- **Yuna → MGC** : crop/rotation, scrapbook.
- **MGC → Comptoir** : palette plus chaude, un média s'apaise.
- **Comptoir → Journey** : média récédé, timeline.
- **Journey → Expertise** : fade timeline, typos géantes entrent.
- **Expertise → Contact** : nav remonte et devient CTA.

---

## 7. Expérience(s) WebGL

### Local WebGL : `SpatialScene`

- Monté uniquement dans `Act04WebGLPortal`.
- 6 `MediaPlane` avec textures chargées avant le montage.
- Lanes : `far`, `background`, `midground`, `primary`, `foreground`.
- Matériau : `MeshBasicMaterial` pour le contraste éditorial (pas de lumières complexes).
- Caméra : presets de positions interpolées par `useFrame` + `gsap`.
- Post-traitement : **aucun** (perf > effet).

---

## 8. Lifecycle WebGL

1. **Préchargement** : loader d'images dans `useEffect` avant d'afficher le Canvas.
2. **Mount** : `Act04WebGLPortal` affiche `<Canvas>` plein écran + z-index `z-20`.
3. **Active** : `useFrame` met à jour la caméra selon le progrès scroll.
4. **Exit** : convergence Z, dernier frame.
5. **Handoff** : DOM final render la même composition à `opacity: 1`.
6. **Unmount** : `Canvas` retiré, `useTexture` dispose, listeners supprimés, RAF arrêté.

---

## 9. Responsive

- **Desktop (≥1280px)** : expérience complète, WebGL activé, pins longs.
- **Laptop (1024–1279px)** : WebGL activé, mêmes pins, ajustements typographie.
- **Tablet (768–1023px)** : pins raccourcis, WebGL simplifié (DPR 1.0).
- **Mobile (<768px)** : opening plus court, no mouse parallax, pas de WebGL (DOM fallback), pins plus courts, nav en bas thumb-friendly.
- **Small mobile (<390px)** : moins de médias, typo plus compacte.

### Stratégie d'adaptation

- `gsap.matchMedia()` pour gérer les variants de pins.
- `useQuality()` détecte DPR / GPU / touch.
- `useReducedMotion()` désactive les pins lourds et le smooth scroll.

---

## 10. Performance

- **First Load JS** : limiter le bundle initial, Three chargé via `next/dynamic`.
- **Images** : Next.js `<Image>` impossible en export statique → `img` classique avec `loading="lazy"` et `decoding="async"`, formats WebP/AVIF.
- **DPR** : `dpr={[1, 1.5]}` dans R3F, `1.0` sur mobile.
- **Texture memory** : 1024x max, textures unshared si possible.
- **ScrollTrigger** : un par acte, nettoyage immédiat.
- **RAF** : aucun RAF persistant hors WebGL.
- **Will-change** : appliqué uniquement sur les wrappers pinned.
- **GPU** : `transform` et `opacity` seulement ; jamais de `width/height/top/left` animés.

---

## 11. Reduced motion

- Si `prefers-reduced-motion: reduce` :
  - Lenis désactivé, scroll natif.
  - Opening réduit à un simple fade statique.
  - Pins supprimés ou très courts.
  - WebGL remplacé par DOM flat.
  - Pas de parallaxe.
- Les contenus restent accessibles et élégants sans motion.

---

## 12. Stratégie assets

Aucun asset réel fourni dans `public/` au moment du plan. En conséquence :

1. **Phase 1** : utiliser des placeholders sémantiques (rectangles de couleur du system, noms de projets en overlay).
2. **Liste des médias requis** :
   - `glwadys-portrait.jpg`
   - `yuna-product-01.jpg`
   - `yuna-product-02.jpg`
   - `yuna-macro.jpg`
   - `mgc-event-01.jpg`
   - `mgc-event-02.jpg`
   - `mgc-people-01.jpg`
   - `comptoir-packaging.jpg`
   - `comptoir-product.jpg`
   - `comptoir-texture.jpg`
   - `grain.png` (tile)
   - `paper.jpg` (MGC)
3. **À remplacer** dès que Glwadys fournit les vrais médias — les noms de chemins seront centralisés dans `lib/assets.ts`.

---

## 13. QA visuelle

### Checkpoints

- **A — Opening + Hero** : mémorable, pas de visage trop tôt, nav unlock.
- **B — Social + Phone** : transformation 9:16, phone naît, pas de lag.
- **C — WebGL** : handoff, caméra Z, dispose propre.
- **D — Process + Strategy** : horizontal stable, chaos → ordre.
- **E — Work** : Yuna/MGC/Comptoir différenciés.
- **F — Journey + Expertise + Contact** : nav → CTA.

### Tests systématiques

- Chrome Desktop, Firefox, Safari.
- Mobile Safari & Chrome Android.
- `prefers-reduced-motion`.
- Reverse scroll complet.
- Resize pendant un pin.
- Refresh au milieu de la page.
- `next build` + export + `npm run start`.
