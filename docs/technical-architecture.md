# Technical Architecture

> Phase 9 du brief. Les choix ci-dessous sont motivés. Aucune technologie n'est
> retenue parce qu'elle est mentionnée dans le brief : seulement si elle sert le résultat.

---

## 1. Stack

| Rôle | Choix | Version | Pourquoi |
|---|---|---|---|
| Framework | **Next.js** App Router | `16.3.0` | Routes localisées statiques, `next/font` (auto-hébergement des polices, zéro requête tierce, zéro CLS), `next/image`, import dynamique pour isoler le WebGL. |
| Langage | **TypeScript** | `6.0.3` | Le contenu et les médias sont typés : une réservation média mal formée est une erreur de compilation. |
| UI | **React** | `19.2.8` | Requis par R3F 9. |
| Animation | **GSAP** + ScrollTrigger + Flip + SplitText | `3.15.0` | Seule bibliothèque d'animation du projet. Tous les plugins nécessaires sont dans le paquet public depuis 3.13 — aucune licence requise. |
| Hook React | **@gsap/react** | `2.1.2` | `useGSAP` : scope + cleanup + StrictMode. |
| Smooth scroll | **Lenis** | `1.3.26` | Léger, respecte `prefers-reduced-motion`, s'intègre proprement au ticker GSAP. |
| 3D | **three** + **@react-three/fiber** + **drei** | `0.185.1` / `9.7.0` / `10.7.8` | **Chargés uniquement dans l'ACT 04**, par import dynamique. Ne pèsent pas sur le bundle initial. |
| Styles | **CSS natif** + custom properties + CSS Modules | — | Voir §2. |

Toutes les versions sont **épinglées exactement** (pas de `^`) et publiées depuis
plus de 7 jours au moment de l'installation. `next@16.3.1`, `typescript@7.0.2` et
`tailwindcss@4.3.3` ont été écartés car publiés 1 à 6 jours avant le build : une
part non négligeable des attaques de chaîne d'approvisionnement est détectée et
retirée dans les premiers jours.

---

## 2. Pourquoi pas de Tailwind

Décision assumée, contraire à l'habitude par défaut.

1. Les couleurs par défaut de Tailwind (`bg-slate-*`, `text-cyan-*`) et son
   esthétique de base (`rounded-lg`, `shadow-md`) sont **citées nommément** comme
   marqueurs de « template » dans les critiques de jury recensées.
2. Le site est piloté par des **variables CSS animées par GSAP**
   (`--phone-bezel`, `--phone-radius`, `--clip`). C'est le cœur de la naissance du
   téléphone et des révélations `clip-path`. Une approche utilitaire ne l'exprime pas.
3. Les compositions sont **art-directées à la colonne près**, avec débords
   volontaires et grilles brisées. Le CSS Grid écrit à la main est plus lisible ici
   qu'une pile de classes utilitaires.
4. Tailwind v4 change de modèle de configuration ; il a été publié 6 jours avant
   le build, donc écarté de toute façon par la règle de fraîcheur.

Le coût est réel : plus de CSS à écrire. Il est accepté, car ce projet est un objet
graphique, pas une application.

**Discipline compensatoire** : tous les tokens (couleur, échelle typographique,
espacement, z-index, easing, durée) vivent dans un seul fichier de tokens, et
aucune valeur magique n'est autorisée dans un composant.

---

## 3. Page unique, sans routes projet

Le brief laisse le choix. **Décision : une seule page par langue.**

Le récit est un film continu, et trois handoffs exigés par le brief
(Strategy→Yuna, Yuna→MGC, MGC→Comptoir) sont des **transitions de média
partagées**. Dans un scroll continu, ce sont des tweens sur un nœud persistant :
fiables et exacts. En routes séparées, il faudrait des View Transitions ou du
Flip inter-pages, avec remise à zéro du scroll et risque de flash — pour un
bénéfice nul, puisque chaque projet est une étape du récit et non une fiche
autonome.

Conséquence : `/fr`, `/en`, `/ko` uniquement.

---

## 4. i18n

FR (défaut) · EN · KO. **Sans dépendance externe.**

Le contenu est un dictionnaire typé, statique, connu à la compilation. `next-intl`
apporterait du middleware, du negotiation de locale et une surface de
configuration dont un site mono-page n'a pas besoin.

```
src/app/[locale]/page.tsx     → generateStaticParams: fr | en | ko
src/content/                  → dictionnaires typés
```

```ts
type Locale = 'fr' | 'en' | 'ko';

// Le type force l'exhaustivité : ajouter une clé sans sa traduction KO
// est une erreur de compilation.
type Dictionary = Record<Locale, Content>;
```

Règles :
- **La logique motion ne connaît jamais une chaîne traduite.** Les timelines
  ciblent des `data-*` et des refs, jamais du texte. Changer de langue ne peut
  donc pas casser une animation.
- Les compositions réservent l'espace du **variant le plus long** des trois
  langues, pour éviter tout recalage.
- `lang` correct sur `<html>`, et `Noto Sans KR` chargé **uniquement** sur `/ko`.
- Les noms propres et les termes métier (`SOCIAL MEDIA`, `CONTENT`, `BRAND`)
  restent en anglais dans les trois langues : c'est l'usage réel du secteur, et
  cela stabilise les compositions typographiques.

---

## 5. Système de données média

Aucune image n'est codée en dur dans un composant. C'est la condition pour que
les vrais assets remplacent les réservations sans toucher au code.

```ts
export type MediaRatio = '4:5' | '9:16' | '1:1' | '16:9' | '3:2';

export type MediaRole =
  | 'campaign' | 'social' | 'story' | 'reel'
  | 'product'  | 'macro'  | 'texture'
  | 'moodboard'| 'planning'| 'note' | 'portrait';

export interface MediaItem {
  id: string;
  role: MediaRole;
  ratio: MediaRatio;
  /** Absent = réservation éditoriale cotée. Présent = image réelle. */
  src?: string;
  mobileSrc?: string;
  poster?: string;
  alt: Record<Locale, string>;
  project?: 'yuna' | 'mgc' | 'comptoir';
  priority?: boolean;
  /** Aplat de la réservation, issu de la palette. */
  tone?: 'paper' | 'paper-deep' | 'graphite' | 'blush' | 'bordeaux';
  /** Recadrage lorsqu'une image réelle arrive. */
  focus?: `${number}% ${number}%`;
}
```

Un composant unique, `<Media />`, consomme un `MediaItem` :
- `src` absent → **réservation** (aplat tonal, repères de coupe, légende, index) ;
- `src` présent → `next/image` avec le même `aspect-ratio` et le même `focus`.

**Le ratio est déclaré dans la donnée, jamais déduit du fichier.** C'est ce qui
garantit zéro décalage de mise en page à l'arrivée des vrais médias, et donc zéro
recalage des timelines.

---

## 6. Orchestration du scroll

Pas de store global. C'est le correctif principal de l'échec précédent : un store
`currentChapter` dupliquait une information que le scroll possède déjà, et les
deux divergeaient.

```
Lenis  →  gsap.ticker  →  ScrollTrigger.update
                              ↓
                    une timeline par acte
                    (useGSAP scopé au conteneur de l'acte)
                              ↓
        transform / opacity / clip-path / variables CSS
                              ↓
              ACT 04 : écrit dans une ref, lue par useFrame
```

- Un acte possède **sa** timeline et ne connaît pas les autres.
- La seule information partagée est l'**élément persistant** transmis d'un acte
  au suivant, via un ref remonté au niveau de la page.
- La navigation lit l'acte actif via un unique `ScrollTrigger` par acte
  (`onToggle`), et non via un état dupliqué à la main dans chaque section.

---

## 7. Contrat du canvas WebGL local

Le point le plus délicat du projet, et la cause de l'échec précédent
(canvas global permanent). Contraintes non négociables :

1. **Aucun canvas `fixed` global.** Le canvas vit dans le conteneur de l'ACT 04,
   en `position: sticky`, clippé par son parent.
2. **Import dynamique** : `next/dynamic`, `ssr: false`. Three.js et R3F sont
   absents du bundle initial.
3. **Montage par `IntersectionObserver`** (`threshold: 0`, `rootMargin` d'une
   hauteur de viewport pour précharger les textures avant l'entrée).
4. **`frameloop="demand"`** + `invalidate()` : rendu uniquement quand le scroll
   fait bouger la scène.
5. **`visibilitychange`** : boucle coupée si l'onglet passe en arrière-plan.
6. **Démontage et disposal complets** à la sortie : geometry, material, texture,
   `renderer.dispose()`. Un navigateur limite le nombre de contextes WebGL
   simultanés (~8 sur Chrome) et tue le plus ancien au-delà.
7. **Piloté par une ref, pas par du state React.** GSAP écrit
   `progress.current`, `useFrame` le lit. Zéro re-render pendant le scroll.
8. **Aucune lumière, aucune ombre.** `meshBasicMaterial` ou `ShaderMaterial`.
   Une photo sur un plan plat éclairé par `meshStandardMaterial` est dénaturée.
9. **`texture.colorSpace = THREE.SRGBColorSpace`** obligatoire — sinon les images
   du canvas ne raccordent pas colorimétriquement avec les mêmes images en DOM,
   et la transition sans flash est morte.
10. **Non monté du tout** si `prefers-reduced-motion` ou absence de WebGL :
    l'acte rend son fallback DOM.

### Mapping 1 pixel = 1 unité

Pour que la première frame WebGL coïncide exactement avec la dernière frame DOM :

```ts
const D = 100; // distance caméra
const fov = 2 * Math.atan(viewportHeight / 2 / D) * (180 / Math.PI);
// camera.position.z = D  →  1 unité three.js = 1 pixel CSS au plan z = 0
```

Un plan reprend alors directement le rect DOM mesuré :

```ts
const { left, top, width, height } = el.getBoundingClientRect();
mesh.scale.set(width, height, 1);
mesh.position.set(
  left - innerWidth  / 2 + width  / 2,
  -top + innerHeight / 2 - height / 2,
  0,
);
```

Le FOV dépend de la hauteur du viewport : **recalculé à chaque resize**.

La bascule est masquée par un swap sur une frame
(`visibility: hidden`, jamais `display: none`, qui détruirait le layout et donc
la mesure).

---

## 8. Arborescence

```
src/
  app/
    layout.tsx                  racine, <html lang>, fonts, grain
    [locale]/
      layout.tsx                generateStaticParams
      page.tsx                  assemble les 9 actes
  acts/
    Act00Opening/               00 + 01 : un seul composant, une seule timeline
    Act02Social/
    Act03Phone/
    Act04Immersion/
      index.tsx                 conteneur DOM + fallback + IntersectionObserver
      Scene.client.tsx          import dynamique R3F, ssr:false
      materials/               shader signature
    Act05Process/
    Act06Work/{Yuna,Mgc,Comptoir}
    Act07Journey/
    Act08Expertise/
    Act09Contact/
  shell/
    SmoothScroll.tsx            Lenis + pont GSAP
    BottomNav.tsx
    Cursor.tsx
    Grain.tsx
  ui/
    Media.tsx                   réservation ou image réelle
    SplitLines.tsx              mask reveal par ligne
    Rule.tsx                    filet capillaire
  lib/
    gsap.ts                     registerPlugin, une seule fois
    motion.ts                   EASE, DUR, STAGGER, breakpoints
    useReducedMotion.ts
  content/
    index.ts                    dictionnaires typés fr/en/ko
    media.ts                    catalogue MediaItem
  styles/
    tokens.css                  couleur, typo, espacement, z-index
    base.css                    reset, grille, utilitaires
```

**ACT 00 et ACT 01 sont un seul composant.** Ce n'est pas une commodité : c'est la
seule façon de garantir qu'Opening → Hero soit une continuité et non une
transition entre deux montages.

---

## 9. Budget de performance

Cible : **60 fps** sur desktop moderne, fluide sur laptop moyen et mobile.

| Poste | Budget |
|---|---|
| JS initial (hors WebGL) | `< 180 KB` gzip |
| Chunk WebGL (chargé à la demande) | `< 320 KB` gzip |
| Polices | 3 variables, `woff2`, sous-ensembles latin (+ coréen sur `/ko` seul) |
| Textures WebGL | ≤ 6, max 2048 px, `< 200 KB` chacune, puissances de 2 |
| DPR canvas | `[1, 2]` desktop, `1` mobile |
| Grain | SVG en data-URI, **zéro requête**, zéro asset binaire |
| Images | AVIF/WebP via `next/image`, `sizes` explicites, `priority` sur la Hero seule |

Les réservations média n'ont **aucun coût réseau** : CSS et texte. Le site est
donc très léger tant que les vrais assets ne sont pas là — ce qui laisse toute la
marge de budget pour eux.

---

## 10. Accessibilité

- HTML sémantique : chaque acte est une `<section>` avec un titre accessible.
  Les titres décoratifs oversized n'usurpent pas la hiérarchie `h1`–`h3`.
- **Le contenu essentiel ne dépend jamais du WebGL** ni d'une animation.
- Navigation clavier complète, `:focus-visible` visible sur fond clair **et**
  sombre.
- `alt` réel pour chaque média, dans les trois langues (typé, donc non oubliable).
- Une réservation média est décorative → `aria-hidden` + `alt=""`, pour ne pas
  polluer un lecteur d'écran avec « emplacement réservé ».
- Le verrouillage de scroll de l'Opening est **borné dans le temps** et annulé par
  toute interaction clavier — un scroll bloqué est un défaut bloquant.
- Contraste vérifié sur les paires réellement utilisées (`--paper`/`--ink`,
  `--paper`/`--oxblood`, `--ink`/`--champagne`).
- `prefers-reduced-motion` : voir `motion-system.md` §9.
- ARIA uniquement là où le HTML ne suffit pas.

---

## 11. Vérification

```bash
npm run typecheck   # tsc --noEmit
npm run lint
npm run build
```

Le QA visuel (Playwright, captures par acte, desktop + mobile, scroll lent /
rapide / inverse / arrêt en plein pin / resize) est décrit dans le brief et
**fait partie de la définition de terminé**. Un build qui passe ne prouve rien
sur une expérience.
