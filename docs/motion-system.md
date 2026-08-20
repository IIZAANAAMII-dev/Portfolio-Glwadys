# Motion System

> **Mise à jour DA — 20 août 2026.** Cette grammaire technique reste valide,
> mais ses gestes incarnent désormais la matière décrite dans
> [`creative-notebook-direction.md`](creative-notebook-direction.md) : feuille
> qui glisse, tirage qui se superpose, note qui se range et archive qui s’aplatit.
> Aucun effet de page-turn ou simulateur de livre n’est autorisé.

> Phase 8 du brief. Un langage d'animation **limité et cohérent**.
> Une grammaire courte appliquée avec rigueur produit une sensation de studio.
> Vingt-cinq familles d'effets produisent une sensation de démo.

---

## 1. Les huit familles autorisées

Aucun mouvement du site n'a le droit d'être en dehors de cette liste.

| # | Famille | Propriétés | Usage |
|---|---|---|---|
| 1 | **MASK** | conteneur `overflow:hidden` + `translateY` de l'enfant | Révélation de texte par ligne. Le geste de base du site. |
| 2 | **CLIP** | `clip-path: inset()` / `polygon()` | Ouverture et fermeture d'images, Front→Behind. |
| 3 | **SCALE** | `scale` | Changement d'échelle du cadre, portail, recul de hiérarchie. |
| 4 | **TRANSLATE** | `x` / `y` (transform) | Déplacements, rails, parallaxe. |
| 5 | **CROP** | `aspect-ratio` + `object-position` | Recadrage d'un média qui change de rôle. |
| 6 | **TYPE REVEAL** | `letter-spacing`, `opsz`, `yPercent` par ligne | Ouverture, titres. Ponctuel. |
| 7 | **SHARED ELEMENT** | nœud persistant unique, ou `Flip` (ACT 05b uniquement) | Handoffs entre actes. |
| 8 | **DEPTH / CAMERA** | `camera.position.z`, Z des plans | ACT 04 exclusivement. |

**Interdits absolus** : rotation 3D DOM · blur animé · `box-shadow` animée ·
`backdrop-filter` animé · morphing SVG · particules · glitch · scatter/explosion ·
texte circulaire · typewriter · ressorts par défaut · `fade-up` seul.

> `fade-up` n'est pas interdit parce qu'il est laid, mais parce qu'appliqué
> partout il supprime toute hiérarchie. L'opacité ne s'anime **jamais seule** :
> elle accompagne toujours un MASK, un CLIP ou un SCALE.

---

## 2. Easings

Un jeu court. Chaque easing a un rôle, on ne l'utilise pas ailleurs.

| Token | GSAP | Rôle |
|---|---|---|
| `EASE.reveal` | `expo.out` | Révélations : rapide, décidé, atterrissage net. |
| `EASE.move` | `power3.out` | Déplacements et entrées standard. |
| `EASE.handoff` | `power2.inOut` | Transitions entre actes, symétriques. |
| `EASE.scrub` | `none` | **Obligatoire** sur tout ce qui est scrubé. |
| `EASE.editorial` | `power4.out` | Les gestes rares et forts (portail, chaos→ordre). |

`EASE.scrub: "none"` sur les tweens scrubés n'est pas une préférence : sans cela,
la position à l'écran ne correspond pas à la position de scroll. C'est l'erreur
la plus fréquente relevée en recherche.

**Aucun `elastic`, aucun `bounce`, aucun `back` au-delà de `1.05`.**
Les animations molles sont proscrites.

---

## 3. Durées et staggers

| Token | Valeur | Usage |
|---|---|---|
| `DUR.snap` | `0.35s` | Micro-interactions, MGC, curseur. |
| `DUR.base` | `0.6s` | Défaut. |
| `DUR.editorial` | `0.9s` | Révélations importantes, Yuna. |
| `DUR.cinematic` | `1.2s` | Réservé : portail, chaos→ordre. **Maximum du site.** |
| `STAGGER.tight` | `0.06s` | Lettres, petits groupes. |
| `STAGGER.base` | `0.09s` | Lignes, fragments. |

Aucune animation ne dépasse `1.2s`. Une durée longue n'est pas du luxe,
c'est de la lenteur.

---

## 4. Scroll

**Lenis** — sensation rapide, l'utilisateur reste maître.

```ts
{ lerp: 0.09, duration: 0.9, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 }
```

Câblage obligatoire avec GSAP (sinon désynchronisation) :

```ts
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

**Valeurs de `scrub`**

| Contexte | Valeur | Pourquoi |
|---|---|---|
| Séquences narratives | `0.6` | Lissage suffisant, pas de flottement. |
| Portail et raccord WebGL | `true` | Liaison 1:1 : l'exactitude prime. |
| Rails horizontaux | `0.5` | Réactivité directe. |

`scrub > 1.5` est interdit : l'animation se décroche du scroll.

---

## 5. Pinning

**Un pin est un événement, pas la mécanique par défaut.**

Neuf pins au total, chacun justifié par une transformation :
Hero · Social · Phone · WebGL · Contact sheet · Moodboard · Strategy · Journey ·
Expertise. Les case studies (ACT 06) et le Contact ne sont **pas** pinnés — ils
respirent, et ce contraste est ce qui rend les pins perceptibles.

Règles :
- `pinSpacing: true` sauf raison explicite.
- `invalidateOnRefresh: true` sur tout pin dont les valeurs dépendent du viewport.
- `anticipatePin: 1` sur les pins qui suivent une longue section fluide.
- Jamais deux pins imbriqués. Un rail horizontal utilise `containerAnimation`
  pour ses triggers internes.

---

## 6. Système de z-index

Une échelle nommée, en tokens. **Aucun `z-index` littéral dans un composant.**

```css
--z-below:        -1;   /* strates révélées derrière (Front→Behind) */
--z-base:          0;   /* contenu */
--z-media:         1;   /* médias en composition */
--z-persistent:   10;   /* élément partagé qui traverse un acte */
--z-canvas:       20;   /* canvas WebGL local */
--z-sticky:       30;   /* contenu pinné */
--z-grain:        40;   /* overlay de grain, pointer-events:none */
--z-nav:          50;   /* navigation basse flottante */
--z-cursor:       60;   /* curseur custom */
--z-overlay:      70;   /* overlay d'ouverture */
```

Le grain est **au-dessus** du contenu et du canvas (il unifie DOM et WebGL) mais
**en dessous** de la navigation et du curseur, pour ne jamais dégrader l'UI.

---

## 7. Règles techniques opposables

**Animer uniquement** `transform`, `opacity`, `clip-path`, et des variables CSS
qui alimentent ces propriétés.

**Ne jamais animer** `width`, `height`, `top`, `left`, `margin`, `padding`,
`box-shadow`, `filter`, `backdrop-filter`. Ces propriétés déclenchent layout ou
paint à chaque frame de scroll, et le coût est multiplié par le nombre de ticks.

`will-change` : posé **au début** de l'animation, retiré à la fin. Jamais permanent.

**Architecture GSAP**
- Un acte = **une** timeline = **un** `useGSAP` scopé. Jamais trois `useEffect`
  pour une même séquence (cause documentée des conflits dans l'historique du repo).
- `useGSAP(() => {...}, { scope: containerRef })` systématique : le scope empêche
  les sélecteurs de fuir d'un acte à l'autre.
- Tout handler d'événement passe par `contextSafe()`.
- Cleanup automatique par `useGSAP`, mais tout `ScrollTrigger` créé hors hook est
  tué explicitement.
- `ScrollTrigger.refresh()` **uniquement** après chargement de médias ou
  changement de layout — jamais en boucle.
- Pas de dizaines de triggers là où une timeline unique suffit.

**Responsive : `gsap.matchMedia()`** (et non `ScrollTrigger.matchMedia()`,
déprécié). Trois contextes :

```ts
const mm = gsap.matchMedia();
mm.add('(min-width: 1024px)',                        () => { /* desktop */ });
mm.add('(max-width: 1023px)',                        () => { /* mobile  */ });
mm.add('(prefers-reduced-motion: reduce)',           () => { /* calme   */ });
```

---

## 8. Responsive : recomposer, pas réduire

Le mobile n'est pas le desktop en `scale(.5)`.

| | Desktop | Mobile |
|---|---|---|
| Opening | 4 fragments, parallaxe pointeur | 2 fragments, aucun parallaxe |
| Hero | débord large des deux mots | débord d'un seul côté |
| Social | 5 médias, 3 plans de profondeur | 3 médias, 1 plan |
| Phone | pin complet, 5 beats | pin complet, **4 beats** |
| WebGL | 6 plans, shader actif | 4 plans, shader désactivé, DPR 1 |
| Contact sheet | rail **horizontal** | **empilement vertical** |
| Strategy | 6 étapes | 6 étapes, scroll réduit |
| Journey | playhead horizontal | playhead vertical |
| Curseur | actif | **absent** |
| Navigation | capsule flottante basse | barre compacte, moins d'items |

Budget de scroll mobile ≈ **70 %** du desktop.
Points de contrôle : `375 · 390 · 430 · 768 · 1024 · 1280 · 1440 · 1920`.

---

## 9. `prefers-reduced-motion`

Obligatoire, et ce n'est **pas** « désactiver les animations » : c'est une
expérience alternative cohérente. Le contenu reste intégralement accessible.

- Lenis désactivé → scroll natif.
- Opening : la composition finale est posée **immédiatement**, sans séquence.
  Scroll jamais verrouillé.
- Tous les pins longs supprimés ; les actes deviennent des compositions statiques
  empilées, lisibles telles quelles.
- Aucun parallaxe, aucun mouvement de caméra.
- **WebGL non monté du tout** → l'ACT 04 rend son fallback DOM (la composition
  plate de sortie, qui existe déjà dans le récit : c'est exactement l'END FRAME
  de l'acte).
- Le curseur custom est désactivé.
- Les révélations deviennent des apparitions immédiates (pas des fades lents).

Le contenu essentiel ne dépend **jamais** du WebGL.

---

## 10. Curseur

Desktop uniquement, `pointer: fine` requis.

Réactivité avant tout : `gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' })`.
Pas de cercle qui poursuit la souris pendant 500 ms.

États : `default` (point discret) · `view` · `drag` · `enter` · `open`.
Aucun gadget, aucune traînée, aucun mélange de couleurs.
Masqué pendant l'Opening, réactivé avec la navigation.

---

## 11. Auto-critique — les questions à repasser à chaque acte

1. Est-ce mémorable, ou seulement propre ?
2. Cette animation raconte-t-elle quelque chose, ou est-elle décorative ?
3. Reconnaît-on une intention éditoriale, ou est-ce un template ?
4. Y a-t-il assez de calme avant et après ce pic ?
5. La 3D mérite-t-elle d'être là ?
6. La transition vers l'acte suivant est-elle naturelle ?
7. **Si je supprime cet effet, le site est-il meilleur ?** Si oui : le supprimer.

---

## 12. Interdit visible

Le visiteur ne doit **jamais** lire un terme technique :
« pinned », « scroll to explore », « immersive experience », « 3D gallery »,
« camera dive », « axis Z », « ScrollTrigger », ni aucune documentation interne.

Les effets se **ressentent**. On ne lit pas leur nom.
