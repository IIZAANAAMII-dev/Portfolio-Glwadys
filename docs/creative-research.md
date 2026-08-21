# Creative Research

> Phase 2 du brief. Ce document n'est pas un catalogue d'inspirations : c'est
> l'extraction des **mécaniques** observées, et ce qu'elles décident pour ce site.
> Principe cadre : inspiration ≠ copie. Aucune animation signature d'un autre site
> n'est reproduite. On combine des principes pour fabriquer notre propre langage.

---

## 0. Le constat qui structure tout le reste

Le critère de notation d'Awwwards est **Design + Usability ≈ 70 %**, la
Créativité ≈ 20 % et joue comme **multiplicateur, pas comme substitut**.

Conséquence directe : l'erreur classique est de tout investir dans la créativité
(un gimmick WebGL) en affamant les fondamentaux. Un jury pénalise :
une intro de 6 secondes, un smooth scroll pâteux, un pin interminable, un site
cassé sur téléphone, du faux contenu.

C'est exactement le piège dans lequel les tentatives précédentes de ce repo sont
tombées (canvas global, 12 chapitres pinnés, build cassé). **La 3D est le dernier
élément à construire, pas le premier.**

---

## 1. Opening → Hero : une seule continuité

Le mode d'échec dominant, c'est de traiter le loader et la Hero comme deux
systèmes séparés : le loader sort, la Hero entre, et il reste une **frame morte**
entre les deux.

La solution observée est toujours la même : **une seule timeline GSAP où la
sortie du loader EST l'entrée de la Hero**, avec des positions qui se chevauchent
(`'<0.15'`, `'<0.2'`) plutôt qu'un enchaînement séquentiel.

Techniques recensées :

- **Cover lift** : un calque plein écran monte en `yPercent: -100` pendant que la
  composition derrière remonte de `scale: 1.08 → 1` — les deux se recouvrent.
- **Clip-path morph** : on anime le `clip-path` d'un masque, pas le contenu.
  Accéléré par le compositeur, aucun layout.
- **Tracking close** : `letter-spacing` d'un très grand titre qui se referme
  (large → serré), souvent couplé à un léger `scale`.
- **Mask reveal par ligne** : chaque ligne dans un conteneur `overflow:hidden`,
  translation `yPercent: 100 → 0`.

**Durées réelles** : 0.6–0.8 s en version rapide, 1.2–1.5 s en version cinématique.
**Au-delà de 2 s, c'est pénalisé comme problème d'usabilité.**

> **Décision.** Le brief demande 2.5–4 s. C'est long au regard de ce constat.
> Arbitrage retenu : viser **~2.8 s**, et surtout faire en sorte que **le scroll
> soit déverrouillé avant la fin perçue** de la séquence, pour que l'attente ne
> soit jamais subie. Une seule timeline maîtresse, aucun fade to black.

---

## 2. Shared element handoff

C'est le mécanisme central du brief (« réutiliser un élément d'une section comme
point de départ de la suivante »). Quatre approches existent :

| Technique | Fonctionnement | Quand |
|---|---|---|
| **GSAP Flip + `data-flip-id`** | Deux nœuds DOM distincts partagent le même id ; Flip anime le second depuis les bornes enregistrées du premier | Changement de conteneur / de parent |
| **Élément unique persistant** | Un seul nœud traverse plusieurs ScrollTriggers, animé en continu | Handoff **scrubé** au scroll |
| **Clip-path re-crop** | L'image ne bouge pas, le cadrage change | Changement de ratio |
| **Fixed swap** | `position: fixed` aux valeurs du `getBoundingClientRect()`, puis reparent | Cas limites |

**Pièges documentés :**
- L'ordre est impératif : `Flip.getState()` **avant** la mutation DOM, `Flip.from()` après.
- `data-flip-id` doit être posé **avant** `getState()`.
- `absolute: true` sort les éléments du flux → les frères sautent à leur position
  finale. Il faut cibler un sous-ensemble (`absolute: ".subset"`).
- **Flip + `scrub` est fragile** : une mutation DOM en pleine interpolation
  provoque un saut. Consensus des forums : faire fonctionner l'animation **sans**
  ScrollTrigger d'abord, puis brancher le scroll ; et effectuer les mutations DOM
  dans un `requestAnimationFrame` après l'update.

> **Décision.** Pour tous les handoffs **scrubés au scroll** (Hero→Social,
> Social→Phone, Yuna→MGC, MGC→Comptoir) on utilise **l'élément unique persistant**,
> pas Flip. Flip est réservé au **seul** moment où il excelle et où le risque est
> contenu : la recomposition Contact Sheet → Moodboard → Grille (ACT 05), qui est
> un changement de layout, pas un travelling.

---

## 3. Front → Behind

Il ne s'agit jamais d'un crossfade. Les mécaniques réelles :

- **`clip-path: inset()`** sur des calques empilés : le calque du dessus se
  referme (`inset(0 0 100%)`) et découvre celui du dessous. Souvent couplé à un
  décalage d'`object-position` pour un parallaxe secondaire.
- **Split door** : deux moitiés qui s'écartent via `clip-path: polygon()`.
- **Scale-down + scale-up** : la couche avant rétrécit (1.2 → 0.8) pendant que la
  couche arrière grandit (0.8 → 1) — sensation de « traverser ».

`clip-path` est accéléré par le compositeur : c'est la bonne propriété.
Réserve : **Safari est capricieux sur l'animation de `inset()`** — préférer
`polygon()` ou tester finement.

> **Décision ACT 02.** Les contenus finis ne s'effacent pas : ils **se recadrent
> et s'écartent** (`clip-path: inset` + translation), et la strate stratégique
> derrière est révélée **en même temps qu'elle avance** (scale 0.94 → 1). La
> composition se transforme physiquement.

---

## 4. Téléphone DOM, puis portail

**Naissance.** Le cadre se construit dans l'ordre : rectangle + `border-radius`,
puis bezel (padding), puis dynamic island, puis reflet (`::after` en gradient).
Piloté par variables CSS (`--phone-radius`, `--phone-bezel`, …) pour être
animable en une seule timeline.

Ratios réels relevés sur des implémentations sérieuses (Remotion) :
`PHONE_W 760 / PHONE_H 1560`, `BEZEL 18`, `FRAME_RADIUS 96`, `SCREEN_RADIUS 78`.
Soit un ratio écran ≈ **9:19.5**, un bezel ≈ 2.4 % de la largeur, et un rayon
d'écran ≈ rayon de cadre − bezel. Ce dernier point est le détail qui fait la
différence entre un mockup crédible et un rectangle arrondi.

**Ancrage.** Le téléphone ne doit jamais sembler descendre avec la page : la
section est **pinnée**, le scroll pilote **le contenu**, pas le device.

**Portail.** Le téléphone passe de face, `scale` progressif, le bezel sort du
viewport, l'écran atteint 100vw/100vh. À cet instant on n'est plus devant un
téléphone, on est dans son contenu.

> **Décision.** Le rayon d'écran est calculé (`--phone-radius` − `--phone-bezel`)
> et non fixé arbitrairement. Le portail se termine sur un écran **exactement**
> plein cadre : c'est cette frame qui sert de contrat avec le WebGL (§5).

---

## 5. DOM → WebGL sans flash — le point technique décisif

C'est l'apport le plus important de la recherche, et il ne venait pas des skills.

Pour qu'un plan WebGL coïncide **au pixel** avec un élément DOM, on fixe la
caméra à une distance `d` et on en déduit le FOV de sorte que **1 unité = 1 pixel** :

```js
const d = 100;
const fov = 2 * Math.atan(viewportHeight / 2 / d) * (180 / Math.PI);
camera = new THREE.PerspectiveCamera(fov, width / height, 0.01, 1000);
camera.position.z = d;
```

Un plan prend alors directement les dimensions du rect DOM :

```js
const { left, top, width, height } = el.getBoundingClientRect();
mesh.scale.set(width, height, 1);
mesh.position.set(
  left - window.innerWidth  / 2 + width  / 2,
  -top + window.innerHeight / 2 - height / 2,
  0
);
```

À recalculer au resize (le FOV dépend de la hauteur du viewport).

**Masquer la bascule.** Trois méthodes : crossfade d'opacité très court
(0.1–0.2 s), ou swap instantané sur une seule frame avec
`visibility: hidden` (**pas** `display:none`, qui détruit le layout), ou une
frame de synchronisation explicite avant de committer le swap.

**Et l'inverse (WebGL → DOM)** est symétrique : on fait converger les profondeurs
Z vers un plan commun, la composition devient plate, on reproduit cette
composition exacte en DOM, on bascule, puis on dispose le canvas.

**Canvas local.** `IntersectionObserver` (`threshold: 0`) pour monter/démonter et
couper la boucle de rendu ; `visibilitychange` pour l'onglet en arrière-plan ;
disposal explicite de geometry / material / texture / renderer. Contrainte
matérielle à connaître : **un navigateur limite le nombre de contextes WebGL
simultanés** (ordre de 8 sur Chrome, 16 sur Firefox) et tue le plus ancien
au-delà — argument supplémentaire pour un canvas unique et local.

> **Décision.** Caméra perspective en mapping 1:1 pixel, un seul canvas, monté par
> `IntersectionObserver`, `frameloop="demand"`, disposé à la sortie. La dernière
> frame DOM du téléphone et la première frame WebGL sont **la même composition**.

---

## 6. Scroll horizontal

Justifié pour du contenu **séquentiel ou comparatif** (pellicule, chronologie,
étapes). Injustifié pour une grille de projets ou du texte long.

Règles techniques :
- Le tween horizontal **doit** être en `ease: "none"`, sinon la position à l'écran
  ne correspond pas à la position de scroll. C'est l'erreur la plus fréquente.
- Distance : `end: "+=N * 100vh"` pour N panneaux (75vh = plus rapide,
  150vh = plus lent).
- Les ScrollTriggers imbriqués dans un rail horizontal nécessitent
  `containerAnimation`.

Ce que les jurys reprochent : « la même galerie à scroll horizontal que tout le
monde ». Donc : peu de panneaux, et un rail qui **se désagrège** au lieu de
simplement finir.

> **Décision.** Deux rails horizontaux maximum, 3 à 5 beats chacun, ~75–100vh par
> beat. Le rail de l'ACT 05 ne « finit » pas : ses éléments **quittent** le rail
> pour former le moodboard. Sur mobile, les rails deviennent verticaux.

---

## 7. Rythme et dosage

- **3 à 5 moments spectaculaires** pour un long-scroll. Au-delà de 6, c'est épuisant.
- Un moment fort toutes les 2–3 hauteurs de viewport.
- Longueur totale typique d'un site narratif primé : 10–15 hauteurs de viewport.
- Les changements de chapitre se signalent **sans étiquette** : bascule de fond,
  changement de traitement typographique, changement de rythme d'espacement.

> **Décision.** Cinq pics assumés : la naissance du téléphone, le portail, le
> climax spatial, le chaos→ordre du moodboard, le rappel final de la navigation.
> Tout le reste est délibérément calme. Les chapitres se signalent par la
> couleur de fond et le passage serif ↔ sans, jamais par un label.

---

## 8. Sensation de scroll

Valeurs par défaut de Lenis : `lerp: 0.1`, `duration: 1.2`,
easing `1.001 - 2^(-10t)` (ease-out expo).

- Sensation **rapide / premium** : `duration 0.8–1.0`, `lerp 0.07–0.1`.
- Sensation **cinématique** : `duration 1.5–1.8`, `lerp 0.12–0.15`.
- « Page dans du miel » = `duration > 1.5`, `lerp > 0.15`, ou `scrub > 2`.
- `scrub: true` = liaison 1:1 exacte ; `scrub: 1` ajoute 1 s de lissage.
  Fourchette de production : **0.5–1.0**.
- Lenis respecte `prefers-reduced-motion` en forçant `lerp: 1`.

> **Décision.** `lerp 0.09`, `duration 0.9`, ease-out expo. `scrub: 0.6` par défaut
> sur les séquences narratives, `scrub: true` sur le portail et le raccord WebGL
> où l'exactitude compte plus que le lissage.

---

## 9. Registre éditorial / luxe

Ce que font réellement les maisons et les magazines :

- **Échelle extrême** : display 95–245 px face à des méta de 11–12 px. C'est le
  contraste d'échelle qui produit le luxe, pas l'ornement.
- **Tracking négatif au grand corps** : jusqu'à `-0.047em` à 95 px.
  **Tracking positif** (1–2 px) sur les petites capitales.
- **Palette très courte** : 5–7 neutres, parfois un système binaire noir/blanc
  strict, sans tons intermédiaires. La photo et la typographie portent l'émotion.
- **Photo à fond perdu** : 100vw, **aucun** `border-radius`, aucun gradient
  d'overlay.
- **Espacement** : ~64 px entre blocs majeurs, 10–20 px entre éléments liés.
- **Boutons fantômes** : filet 1 px, fond transparent.
- **Filets capillaires** au lieu d'ombres de cartes.
- **Labels en capitales** flottant près des bords d'image, esprit générique de
  film plutôt qu'étiquette produit.
- **Grain** : opacité **0.03–0.05**, statique. Animé ou au-delà de 0.1, c'est un
  anti-pattern.

---

## 10. Anti-patterns retenus comme interdits

Liste de contrôle, directement issue des critiques de jurys et des recensements
d'anti-patterns :

`fade-up` sur tout · smooth scroll pâteux · pins interminables ·
ressorts Framer Motion par défaut · particules décoratives · grain animé ou trop
fort · ouverture « Hi, I'm … » · barres de compétences · nuages de logos ·
grilles de cartes identiques · ombres de cartes + gros `border-radius` ·
carrousels · témoignages · page /services · gradients violets/bleus ·
couleurs par défaut de Tailwind · titres en gradient · texte en `Inter` par
défaut à 16px/1.5 · lorem ipsum · animer `width`/`height`/`top`/`left`/`margin` ·
`box-shadow` animée · `backdrop-filter` massif · `scrub` > 2 ·
`will-change` permanent.

Ces interdits sont repris comme règles opposables dans `motion-system.md` §7.

---

## 11. Ce que la recherche a fait changer par rapport au brief

Le brief autorise explicitement à améliorer la proposition. Quatre écarts assumés :

1. **Opening ramené à ~2.8 s** avec déverrouillage anticipé du scroll, au lieu de
   2.5–4 s subies (§1).
2. **Flip cantonné à l'ACT 05.** Le brief le suggérait aussi pour les handoffs ;
   la documentation montre que Flip + `scrub` est instable. Les handoffs scrubés
   passent par un élément persistant (§2).
3. **Pas de Tailwind.** Les couleurs et l'esthétique par défaut de Tailwind sont
   citées comme marqueur de « template » ; un site à direction éditoriale forte
   se pilote mieux en CSS custom properties (voir `technical-architecture.md`).
4. **Case studies sur la page unique**, sans routes dédiées : les transitions
   partagées Yuna → MGC → Comptoir exigées par le brief sont bien plus fiables
   dans un scroll continu que via des transitions de page.
