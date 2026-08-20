# Storyboard

> **Mise à jour DA — 20 août 2026.** Les actes et handoffs restent la structure
> narrative. Leurs surfaces, accessoires et traitements visuels suivent
> désormais [`creative-notebook-direction.md`](creative-notebook-direction.md),
> qui prévaut sur toute mention pré-presse ci-dessous.

> Phase 7 du brief. Neuf **actes narratifs**, pas neuf `<section>` indépendantes.
> Chaque acte est décrit par : START FRAME · USER ACTION · MOTION · FOCAL ELEMENT ·
> HANDOFF · END FRAME.
>
> Règle structurante : **ACTE → TRANSFORMATION → ACTE → HANDOFF → ACTE.**
> Quand un acte se termine, un élément survit et devient le point de départ du
> suivant. C'est ce mécanisme, et non l'accumulation d'effets, qui produit le récit.

---

## Budget de scroll

La longueur excessive est la pénalité la plus fréquente relevée en recherche
(§7 de `creative-research.md`). Le budget est donc fixé **avant** le build, et
chaque acte doit tenir dedans.

| Acte | Séquence | Scroll | Pin |
|---|---|---|---|
| 00 | Opening | `0` (auto, verrouillé) | — |
| 01 | Hero + transformation | `+=100vh` | oui |
| 02 | Social World + Front→Behind | `+=180vh` | oui |
| 03 | Phone : naissance, montage, portail | `+=220vh` | oui |
| 04 | Immersion WebGL | `+=180vh` | oui |
| 05a | Contact sheet (rail horizontal) | `+=180vh` | oui |
| 05b | Moodboard → système de marque | `+=130vh` | oui |
| 05c | Stratégie (typographique) | `+=150vh` | oui |
| 06a | Yuna | `+=110vh` | non |
| 06b | MGC | `+=110vh` | non |
| 06c | Comptoir | `+=90vh` | non |
| 07 | Journey (playhead) | `+=160vh` | oui |
| 08 | Expertise | `+=100vh` | oui |
| 09 | Contact | `100vh` | non |

**Total ≈ 18 hauteurs de viewport.** Neuf pins, tous justifiés par une
transformation — aucun pin décoratif. Ces valeurs sont les valeurs **initiales** :
elles seront resserrées en phase QA si la sensation est longue. Le sens de
correction par défaut est **vers le bas**.

**Cinq pics assumés**, le reste est délibérément calme :
la naissance du téléphone (03) · le portail (03→04) · le climax spatial (04) ·
le chaos→ordre (05b) · le rappel final de la navigation (09).

---

## ACT 00 — OPENING

Automatique. Aucun scroll requis. `~2.8 s`. Scroll verrouillé.

**START FRAME**
Fond `--ink`, presque vide. Grain. Aucun visage, aucun grand portrait — le site ne
repose pas sur le visage de Glwadys, c'est une contrainte explicite du sujet.
Deux méta minuscules en `--t-micro` aux angles opposés : `PORTFOLIO 2026` et
`MARSEILLE ↔ SEOUL`. Un filet capillaire horizontal, à 38 % de la hauteur,
de largeur nulle.

**USER ACTION**
Aucune. Sur desktop, un parallaxe de pointeur extrêmement léger (facteurs
0.02–0.08) devient actif dès que les fragments entrent.

**MOTION** — une seule timeline maîtresse, six temps

1. `0.0s` Le filet se déploie de la gauche vers la droite (`scaleX 0 → 1`,
   `transformOrigin: left`, `expo.out`). Les méta apparaissent en mask reveal.
2. `0.35s` **GLWADYS** puis **DALLEAU** en Bodoni Moda, très grand, centré,
   révélés **par ligne** : chaque mot est dans un conteneur `overflow:hidden` et
   monte de `yPercent: 100 → 0`, stagger `0.09s`.
3. `0.6s` **Le tracking se referme** : `letter-spacing` `0.28em → -0.045em`
   simultanément à `scale 1.06 → 1`. C'est le geste signature de l'ouverture :
   le nom passe d'un état dispersé à un bloc compact.
4. `1.1s` La phrase de positionnement apparaît en `--t-lead`, mask reveal par ligne.
5. `1.35s` **Quatre fragments** entrent depuis les bords (pas quinze). Ce ne sont
   pas des portraits : matière, macro produit, typographie de campagne, détail.
   Entrée en `clip-path: inset()` qui s'ouvre + translation courte, stagger `0.08s`.
   Chacun est une **réservation média** cotée.
6. `1.9s` **La composition se transforme sans coupure** : le nom se désolidarise
   (GLWADYS monte à gauche, DALLEAU descend à droite), il change d'échelle vers
   `--t-monument`, deux fragments sortent du cadre, deux trouvent leur place
   définitive, les marges se dessinent, les méta se répartissent aux quatre angles.

`2.6s` La composition est stabilisée : **c'est la Hero.**
`2.4s` **Le scroll est déverrouillé avant la fin perçue** — l'attente n'est
jamais subie. La navigation basse apparaît en dernier (`2.7s`).

**FOCAL ELEMENT** — le nom.

**HANDOFF**
Il n'y a pas de handoff : Opening et Hero sont **le même DOM, la même timeline**.
Jamais `Opening → fade black → Hero`. Rien n'est démonté, rien n'est remonté.

**END FRAME** — la Hero de l'ACT 01, atteinte par transformation continue.

---

## ACT 01 — HERO

**START FRAME**
Composition asymétrique tenant comme une **couverture de magazine**.
`GLWADYS` en haut à gauche et `DALLEAU` en bas à droite en `--t-monument`,
volontairement débordants du cadre. Deux réservations média survivantes en
`4:5` et `9:16`. Quatre méta aux angles : `CONTENT`, `SOCIAL`, `BRAND STRATEGY`,
`MARSEILLE ↔ SEOUL`. Un filet vertical en `--champagne` à 25 % — **une** des deux
seules apparitions du métallique dans tout le site.

Elle doit être impressionnante **sur une capture statique**. C'est le test n°1.

**USER ACTION** — premier scroll.

**MOTION** — pinné, `+=100vh`, `scrub: 0.6`
La Hero ne disparaît pas : **la couverture devient un objet éditorial physique.**

- Le cadre entier rétrécit (`scale 1 → 0.86`), et `--paper` se révèle **autour** :
  on quitte la couverture pour entrer dans le magazine.
- Le nom perd de l'échelle (`--t-monument → --t-display`) et se rapproche.
- Les marges apparaissent, les filets se rétractent.
- La réservation `4:5` glisse hors cadre. **La réservation `9:16` survit.**

**FOCAL ELEMENT** — la réservation verticale `9:16`.

**HANDOFF → ACT 02**
Le `9:16` est un **élément persistant unique** (pas un Flip) : il traverse la
frontière des deux actes, se recentre et devient le média dominant du monde social.
Un seul nœud DOM, animé en continu par deux ScrollTriggers successifs.

**END FRAME** — couverture réduite sur ivoire, `9:16` en route vers le centre.

---

## ACT 02 — SOCIAL WORLD

Ici on découvre le travail réel avec le contenu. **Pas une grille Instagram.**

**START FRAME**
Le `9:16` hérité, centré, dominant. Autour, quatre médias entrent selon une
hiérarchie stricte (un dominant, un secondaire, deux tertiaires) — jamais une
grille d'égaux.

**USER ACTION** — scroll continu.

**MOTION** — pinné, `+=180vh`. Le scroll agit comme un **chef de montage**.

- **BEAT 1** — La campagne principale s'installe. Les satellites entrent en
  `clip-path` + translation courte, sur trois plans de profondeur (parallaxe
  léger, facteurs 0.04 / 0.09 / 0.15).
- **BEAT 2** — Le contenu social entre. La hiérarchie est encore lisible.
- **BEAT 3** — Un format Story traverse la composition en diagonale, passant
  **devant** le média dominant. Premier moment où l'ordre est bousculé.
- **BEAT 4** — **La hiérarchie s'inverse** : le dominant recule (`scale 1 → 0.82`),
  un secondaire prend le premier plan. Le regard est redirigé.

- **BEAT 5 — FRONT → BEHIND.** La transformation signature de l'acte.
  Les contenus finis **ne se fondent pas** : ils se recadrent
  (`clip-path: inset()` qui se referme), s'écartent en translation et pivotent
  très légèrement (≤ 2°). Derrière eux, une strate avance
  (`scale 0.94 → 1`, `--graphite` sur `--paper`) : moodboard, planning, copy,
  calendrier, notes de direction.
  Le fond bascule `--ink → --paper` sur ce beat précis.
  Le sens : *derrière chaque contenu, il y a une stratégie.*

**FOCAL ELEMENT** — le format vertical.

**HANDOFF → ACT 03**
La scène se nettoie. Tous les médias sortent **sauf le format vertical**, qui
se recentre et grandit légèrement. Puis, autour de lui, une structure commence
à se dessiner.

**END FRAME** — le vertical seul, centré, sur ivoire. Un contour naît.

---

## ACT 03 — PHONE

### 03a — Naissance

Le téléphone **naît autour du média**. Il n'apparaît pas comme un mockup prêt à
l'emploi : c'est la différence entre un geste et un asset.

**MOTION** (`~40vh` du pin) — ordre de construction, piloté par variables CSS

- `--phone-bezel` `0 → 12px` : le bezel s'épaissit autour du média.
- `--phone-radius` `0 → 44px` : les angles s'arrondissent.
  Le rayon de l'écran est **calculé** (`radius − bezel`), jamais fixé — c'est ce
  détail qui rend le device crédible.
- Les boutons latéraux s'étirent (`scaleY 0 → 1`).
- La dynamic island s'ouvre (`width 0 → 96px`).
- Un reflet linéaire statique apparaît en dernier, à très faible opacité.

Le média **devient** l'écran, sans transition : il l'a toujours été.

### 03b — Montage

**Le téléphone est une ancre stable.** Il ne descend jamais avec la page.
La section est pinnée ; le scroll pilote **le contenu de l'écran**.

- **BEAT 1 — FEED** : défilement interne, `translateY` du contenu **dans** l'écran.
- **BEAT 2 — FOCUS** : un contenu s'arrête, prend plus de place, et des
  informations éditoriales apparaissent **autour du téléphone**, dans les marges,
  en `--t-micro`.
- **BEAT 3 — STORY** : bascule verticale plein écran vers un format Story.
- **BEAT 4 — CAMPAGNE** : un élément commence à **dépasser** les limites physiques
  du device. Première rupture du contrat visuel.
- **BEAT 5 — BREAKOUT** : le contenu ne respecte plus l'écran. Il devient évident
  que le téléphone est sur le point de disparaître. Tension maximale.

### 03c — Portail

**MOTION** (`~40vh` final, `scrub: true` — l'exactitude prime sur le lissage)
Téléphone strictement de face. `scale` progressif jusqu'à ce que le bezel quitte
les bords du viewport. L'écran atteint `100vw / 100vh`.

À cet instant, l'utilisateur n'est plus **devant** un téléphone : il est **dans**
son contenu.

**FOCAL ELEMENT** — l'écran.

**HANDOFF → ACT 04**
La **dernière frame DOM** de l'écran est mesurée
(`getBoundingClientRect()`) et devient la **première frame WebGL**.
Contrat : même position, même échelle, même colorimétrie. Aucun flash.

**END FRAME** — un plan unique, plein cadre. DOM ou WebGL : indiscernable.

---

## ACT 04 — IMMERSION

Vraie 3D, mais **locale**. Aucun canvas global, aucun monde WebGL permanent.
Le canvas appartient exclusivement à cet acte : lazy-loaded, monté par
`IntersectionObserver`, `frameloop="demand"`, disposé à la sortie.

**START FRAME**
Le plan unique hérité du portail. Rien d'autre. La 3D n'est pas encore visible
**en tant que** 3D : c'est le point clé de l'absence de flash.

**USER ACTION** — scroll continu.

**MOTION** — pinné, `+=180vh`. La caméra avance principalement en **Z**.

- **ENTRÉE** — On vient de traverser l'écran. Le plan est frontal.
- **RÉVÉLATION DE PROFONDEUR** — Le plan unique **se sépare** en plusieurs plans
  qui s'échelonnent en Z. C'est le moment « comment le site vient de faire ça ».
  Cinq à six plans seulement : `FOREGROUND` / `MIDGROUND` / `BACKGROUND`.
- **TRAVELLING** — La caméra pousse en Z. Les plans proches défilent vite, les
  lointains lentement. Décalage de pointeur desktop très faible (≤ 0.6°).
- **NEAR PASS** — Un média passe près de la caméra et sort du cadre. Sensation
  physique de traversée.
- **DÉCALAGE D'AXE** — Léger changement de composition en X/Y, très contrôlé.
- **CLIMAX** — Composition spatiale forte. Le seul **effet shader signature** du
  site atteint son amplitude maximale : une déformation d'image très subtile
  (déplacement d'UV, amplitude ≤ 0.03) qui évoque du papier qui gondole.
  Pas une démo de shader — un effet au service du registre éditorial.
- **APLATISSEMENT** — La profondeur **se résorbe**. Les Z convergent vers un plan
  commun, la caméra se stabilise, la composition redevient plate.

Contraintes : aucune `OrbitControls`, aucune caméra libre, aucun tunnel
interminable, aucune lumière (matériaux non éclairés), aucune ombre.

**FOCAL ELEMENT** — la caméra, et la profondeur elle-même.

**HANDOFF → ACT 05**
Jamais `WebGL → fade → section suivante`. La composition plate obtenue en
aplatissement est **reproduite à l'identique en DOM**, on bascule sur une frame,
puis le canvas est démonté et **disposé** (geometry, material, texture, renderer).

Le visiteur vient littéralement de transformer un **espace** en **page**.

**END FRAME** — une composition plate en DOM. Le canvas n'existe plus.

---

## ACT 05 — CREATIVE PROCESS

Changement de rythme volontaire. Après l'immersion, on revient au tactile,
à l'éditorial, à l'humain. Fond `--paper`.

### 05a — Contact sheet

**START FRAME** — Les plans issus du WebGL sont devenus une **planche contact** :
images, captures, notes, fragments de tailles inégales, posés comme sur une table
de montage.

**MOTION** — pinné, `+=180vh`, rail **horizontal**, `ease: "none"` obligatoire.
C'est le **seul** rail horizontal purement latéral du site (Journey en est un
autre, mais c'est une chronologie, ce qui le justifie différemment).

**HANDOFF** — Le rail **ne se termine pas** : ses éléments le **quittent**.

### 05b — Moodboard → système de marque

**MOTION** — pinné, `+=130vh`. **C'est ici, et seulement ici, qu'on utilise GSAP Flip** :
c'est un changement de layout, pas un travelling, donc le seul cas où Flip excelle.

1. **Moodboard** — Les éléments quittent le rail, se rapprochent, pivotent
   légèrement (rotations aléatoires ≤ 6°), se chevauchent. État organique.
   Apparaissent : palette, typographie, ton, message, direction de contenu.
2. **CHAOS → ORDRE** — Le pic n°4 du site. Les rotations reviennent à `0`, les
   espacements deviennent réguliers, les alignements rejoignent la grille, les
   typographies deviennent un système, les couleurs deviennent des tokens visibles.
   **On voit la pensée créative devenir un système de marque.**

`Flip.getState()` avant mutation, mutation dans un `requestAnimationFrame`,
`Flip.from()` après, `absolute` restreint à un sous-ensemble.

### 05c — Stratégie

La grille se simplifie encore.

**Décision de conception assumée** — le brief proposait un rail horizontal.
On ne le fait pas : ce serait un **second rail latéral consécutif**, et « la même
galerie horizontale que tout le monde » est explicitement ce que les jurys
reprochent. À la place, une séquence **typographique verticale**.

**MOTION** — pinné, `+=150vh`. Six étapes :
`AUDIENCE · POSITIONING · TONE · CONTENT · PLANNING · CAMPAIGN`.
Chaque mot arrive en `--t-display`, occupe seul le cadre, puis **rétrécit et va
prendre sa place** dans une ligne qui se construit progressivement en bas de
l'écran. À la fin, les six mots forment une seule phrase compacte.
Très peu de texte. Aucune carte, aucune icône.

**HANDOFF → ACT 06** — Le dernier mot (`CAMPAIGN`) reste, et le premier média
de Yuna se révèle **derrière** lui par `clip-path`.

**END FRAME** — la ligne des six étapes, et une image qui s'ouvre.

---

## ACT 06 — SELECTED WORK

Trois univers, **trois personnalités de mouvement distinctes**. Pas trois cartes,
pas de page projet générique. Tout se joue dans le scroll continu — c'est ce qui
rend les transitions partagées possibles.

### 06a — YUNA BIJOUX
*Social Media & Communication (alternance) · Brest · sept. 2022 – juil. 2023*

Joaillerie, premium, précision, silence. Fond `--ink`.

**Personnalité motion** — lente mais jamais molle. Macro, recadrages, masques,
typographie raffinée. Durées longues (`0.9–1.2s`), easing `power3.out`,
amplitudes courtes. **Aucune rotation.** Tout est aligné, tenu, silencieux.

**HANDOFF → MGC** — pas de coupure. Un **visuel partagé** : la dernière image
Yuna change de ratio (`4:5 → 1:1`), se recadre, change de palette
(`--ink → --paper-deep`) et **devient** le premier élément MGC.

### 06b — MARSEILLE GIRLS CLUB
*Community & Communication (CDI temps partiel) · Marseille / hybride · avr. 2025 – avr. 2026*

Communauté, social, scrapbook, énergie, UGC, collage. Fond `--paper-deep`.

**Personnalité motion** — vive. Durées courtes (`0.35–0.5s`), easing
`power4.out`, décalages nets, léger overshoot. Rotations franches (≤ 8°),
chevauchements, annotations manuscrites-typographiques. Énergique, **jamais
enfantin** : le collage est tenu par la grille en arrière-plan.

**HANDOFF → COMPTOIR** — transition par **matière et couleur** : un élément
devient plein cadre, et sa teinte glisse vers `--bordeaux`.

### 06c — LE COMPTOIR DE MATHILDE
*Expérience Client & Support Vente (CDD) · Marseille · oct. 2024 – aujourd'hui*

Épicerie fine artisanale. Calme, chaleureux, art de vivre, merchandising,
matière. Fond `--bordeaux`.

**Personnalité motion** — **une seule** animation signature : un zoom macro très
lent et continu sur une matière, avec un parallaxe de texte inverse.
Rien d'autre. C'est la respiration avant l'ACT 07.

**END FRAME** — l'image recule, la matière s'apaise.

---

## ACT 07 — JOURNEY

Pas une timeline de CV. Une **table de montage** : `2021 → 2026`.

**START FRAME** — Fond `--ink`. Un **playhead** fixe, vertical, en `--oxblood`,
au tiers gauche. Une bande temporelle prête à défiler dessous.

**MOTION** — pinné, `+=160vh`. Les années traversent l'écran horizontalement
(`ease: "none"`). Le playhead ne bouge **jamais**.
Quand une année atteint le playhead, l'expérience correspondante apparaît en
fragment : rôle, lieu, une réservation média. L'année active est en
`--t-display` ; les autres sont en `--t-title` à faible opacité.

Ce qui doit se lire, c'est la **progression**, pas une liste de dates :
racines créatives → première alternance social media → diplôme et freelance →
retail et merchandising → communauté → direction de marque.

**FOCAL ELEMENT** — le playhead.

**HANDOFF → ACT 08** — La bande temporelle s'estompe et **la dernière année
(`2026`) grandit** jusqu'à devenir le premier mot de l'Expertise.

---

## ACT 08 — EXPERTISE

Après beaucoup de média, retour à la **pure typographie**. Fond `--paper`.

**START FRAME** — Une liste verticale de compétences en `--t-display`, alignée à
gauche, séparée par des filets capillaires. Aucune carte, **aucun pourcentage**.

**MOTION** — pinné, `+=100vh`. Un seul terme est actif à la fois ; le suivant
**pousse** le précédent (mask reveal vertical). Au pointeur, le terme survolé
passe en `--oxblood` et une précision contextuelle apparaît dans la marge en
`--t-micro`. Simple. Très fort.

Termes : `SOCIAL MEDIA` · `CONTENT CREATION` · `CONTENT STRATEGY` ·
`BRAND COMMUNICATION` · `COMMUNITY` · `DIGITAL MARKETING` · `INTERNATIONAL`.

**HANDOFF → ACT 09** — La complexité se réduit. Il ne reste qu'une ligne.

---

## ACT 09 — CONTACT

La fin doit conclure le film, pas afficher un formulaire.

**START FRAME** — Fond `--ink`. Presque vide. **On retourne au point de départ.**

**MOTION**
`GLWADYS DALLEAU` réapparaît en `--t-monument`, révélé par le **même** mask
reveal par ligne que l'Opening — la boucle est explicitement refermée.
Puis la grande phrase, l'email, LinkedIn, la disponibilité.
`MARSEILLE ↔ SEOUL` revient comme motif final, en `--champagne` : la **seconde
et dernière** apparition du métallique du site.

**LE RAPPEL DE LA NAVIGATION** — pic n°5.
La capsule de navigation basse, née à la fin de l'Opening, **monte, s'étire et se
transforme en CTA final**. Ses items se recomposent en un seul bouton de contact.
La navigation a accompagné tout le parcours ; elle le referme.

**FOCAL ELEMENT** — le nom, puis la navigation devenue CTA.

**END FRAME** — Un nom, une phrase, un email. Silence.
Contenu : `glwadys.dalleau29@gmail.com` · `linkedin.com/in/glwadysdalleau`.

---

## Lifecycle d'un acte

Chaque acte possède un cycle de vie explicite, sans exception :

```
BEFORE ENTER  → hors layout ou masqué, aucun trigger actif
ENTER         → révélation chorégraphiée
ACTIVE        → transformation pilotée par le scroll
EXIT          → sortie chorégraphiée, l'élément persistant est transmis
AFTER EXIT    → masqué / démonté / hors layout
```

Après `EXIT`, tout élément non persistant est **masqué, démonté ou sorti du
layout**. Aucun acte ne peut apparaître accidentellement derrière un autre.
Les overlaps ne sont autorisés que **chorégraphiés**.

## Chaîne des éléments persistants

C'est l'épine dorsale du récit. Un seul élément à la fois traverse une frontière :

```
nom (00→01) → réservation 9:16 (01→02) → format vertical (02→03)
→ écran du téléphone (03→04) → composition plate (04→05)
→ dernier élément du rail (05a→05b) → mot CAMPAIGN (05c→06a)
→ image partagée (06a→06b) → matière (06b→06c)
→ année 2026 (07→08) → nom + navigation (08→09→00)
```

Le dernier maillon renvoie au premier : le site est une boucle.
