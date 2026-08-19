# GLWADYS DALLEAU — ENGINEERING CONSTRAINTS

> Sources de vérité techniques pour la refonte premium.

---

## 6 RÈGLES NON NÉGOCIABLES

### RÈGLE 1 — NO GLOBAL VISUAL WORLD

Je ne veux plus jamais ressentir que toute la page appartient à un énorme Canvas ou une énorme scène persistante.

Une scène :

```
ENTRE → VIT → SE TRANSFORME OU SORT → DISPARAÎT PROPREMENT.
```

Après sa sortie, aucun élément fantôme ne doit rester derrière les sections suivantes.

Même règle pour : sticky, fixed, CSS perspective, translateZ, pins, overlays.

### RÈGLE 2 — NO GLOBAL CANVAS / NO THREE.JS

La suppression actuelle de :

- three
- @react-three/fiber
- @react-three/drei

est validée.

Ne les réinstalle pas.

- Pas de Canvas global.
- Pas de caméra globale.

Le portfolio repose désormais principalement sur : DOM, GSAP, ScrollTrigger, CSS, clip-path, masks, sticky, shared transitions, CSS perspective locale, Lenis.

### RÈGLE 3 — UN PIN DOIT ÊTRE UN ÉVÉNEMENT

Ne pin pas toutes les sections. Chaque pin doit avoir une raison narrative claire.

Je préfère :

- 5 excellentes séquences pinned

à :

- 15 sections qui refusent constamment de laisser avancer le visiteur.

### RÈGLE 4 — TRANSFORMATION > SUCCESSION

Évite :

```
section A
fade out
section B
fade in
```

Cherche toujours en premier :

> Comment un élément de A peut-il physiquement devenir B ?

- Shared media
- mask
- scale
- recomposition
- crop
- position
- typography
- background
- layout

Le site doit sembler monté comme un film interactif.

### RÈGLE 5 — STATIC DESIGN FIRST

Une animation ne doit jamais cacher un mauvais layout.

Pour chaque grande scène :

1. capture un screenshot à son état principal.
2. Si le screenshot seul n'est pas excellent : refais la composition AVANT d'ajouter davantage de motion.

### RÈGLE 6 — VISUAL QA IS BLOCKING

`BUILD OK ≠ DESIGN OK`.

Tu dois réellement voir le rendu dans un navigateur. Si aucun browser / Playwright / système de screenshot n'est disponible, arrête-toi avant de faire la refonte créative. Explique que la visual QA est impossible. Ne prétends jamais avoir terminé une direction créative sans l'avoir vue.

---

## SCROLL LIFECYCLE

Chaque scène :

```
BEFORE ENTER → ENTER → ACTIVE → EXIT → AFTER EXIT
```

**AFTER EXIT :** aucun élément fantôme. Seul un shared element explicitement prévu peut survivre brièvement.

---

## LAYERS

Créer un système de z-index centralisé. Pas de valeurs arbitraires partout.

Conceptuellement :

1. background
2. section content
3. active storytelling
4. overlays
5. navigation
6. cursor/modal

---

## FIXED

Limiter fixed à :

- BottomNav
- CustomCursor desktop
- modal/index
- éventuel tiny chapter state

Les éléments narratifs ne restent pas fixed sur plusieurs actes.

---

## STICKY / PIN

Auditer TOUS :

- position sticky
- fixed
- ScrollTrigger pin
- pinSpacing
- start
- end
- scrub
- overflow
- background
- z-index

Éviter nested pins. Éviter pin dans pin.

---

## OVERLAPS

Un overlap entre deux sections doit être :

- intentionnel
- court
- contrôlé

Sinon il est considéré comme un bug.

---

## GSAP

Une timeline importante doit être construite comme du montage.

- Utiliser les overlaps temporels lorsque pertinents.
- Éviter les longues animations séquentielles.
- Les valeurs temporelles sont des guides, pas des contrats.

Globalement : rapide, réactif, premium. Pas floaty.

---

## LENIS

Audit du réglage actuel. Le scroll doit répondre rapidement au geste. Pas d'inertie excessive.

---

## CURSOR

Desktop seulement. Réactif. Subtil.

- Utiliser `quickTo` ou technique équivalente.
- Touch : désactivé.

---

## GSAP CLEANUP

Utiliser `gsap.context/revert` ou stratégie équivalente.

- Aucune timeline fantôme après unmount.
- Aucun ScrollTrigger abandonné.

---

## ACCESSIBILITY

Implémenter réellement :

- `prefers-reduced-motion`
- Contenu toujours accessible
- Navigation clavier
- Focus states
- BottomNav accessible

---

## MOBILE

Mobile n'est pas desktop rétréci. Recomposer les scènes.

- Intro : moins de médias
- Hero : lisible
- Social : moins d'éléments
- Phone : pin plus court
- Gallery : simplifiée si nécessaire
- Projects : moins d'overlap

---

## BREAKPOINTS À QA

Tester au minimum :

- 375×812
- 390×844
- 430×932
- 768×1024
- 1280×800
- 1440×900
- 1920×1080

---

## PERFORMANCE

Inspecter :

- layout thrashing
- blur filters excessifs
- animations width/height
- reflows
- event listeners
- images
- fonts
- preloads
- lazy load
- bundle

---

## NPM

Inspecter `npm audit`.

- Ne jamais lancer `npm audit fix --force` aveuglément.
- Corriger uniquement les upgrades sûrs.

---

## PRODUCTION

Une fois final :

1. `npm run build`
2. Vérifier le déploiement réel.
3. Comparer local et production.
4. Ne jamais supposer que `portfolio-glwadys.vercel.app` sert automatiquement le dernier état local.

---

## VISUAL VALIDATION GATES

C'est **BLOQUANT**.

Tu ne peux déclarer un ACT terminé qu'après l'avoir réellement inspecté.

Pour chaque ACT :

1. BUILD / compile.
2. OUVRIR dans un vrai navigateur.
3. SCREENSHOT état principal.
4. SCROLL lent.
5. SCROLL rapide.
6. REVERSE scroll.
7. STOP à plusieurs endroits.
8. Vérifier overlaps.
9. Critiquer le résultat.
10. Corriger.
11. Refaire jusqu'à validation.

**IMPORTANT :** tu ne me demandes pas de valider chaque ACT. TU fais toi-même cette boucle. Tu continues automatiquement une fois que l'ACT satisfait les critères.

### SEUL CAS OÙ TU DOIS T'ARRÊTER

Si tu n'as aucun moyen de :

- ouvrir le site
- voir le rendu
- capturer des screenshots

alors arrête la refonte créative. Ne code pas à l'aveugle. Demande l'accès à un browser / Playwright / outil visuel. C'est le seul checkpoint obligatoire nécessitant mon intervention.

### GATE SPÉCIAL ACT 1

Intro/Hero est la fondation. Avant de continuer vers Social, capture :

- intro état initial
- intro avec médias
- Hero finale
- Hero pendant son scroll

Critique-les. Pose-toi :

- La Hero fonctionne-t-elle sans mouvement ?
- Les premières secondes sont-elles mémorables ?
- L'intro est-elle réellement différente de la Hero ?
- La bottom nav fonctionne-t-elle avec la composition ?
- Y a-t-il trop de contenu ?

Si une réponse est mauvaise : REFAIRE ACT 1. Continue seulement une fois le résultat satisfaisant.

---

## AUTONOMIE

Tu peux changer les détails proposés dans `creative-brief.md`. Les chiffres (durées, nombre de médias, vh, angles, distances) sont des **INDICATIONS**. Ils ne sont jamais prioritaires sur le résultat visuel. Si une idée du brief rend mal : change-la. Mais les 6 règles non négociables restent absolues.

---

## ORDRE DE TRAVAIL

1. Skills
2. Audit repository
3. Audit scroll/layers
4. Créer `creative-brief.md`
5. Créer `engineering-constraints.md`
6. Nettoyer toute ancienne architecture qui viole les 6 règles
7. ACT 1 + visual gate
8. ACT 2 + visual gate
9. ACT 3 + visual gate
10. ACT 4 + visual gate
11. ACT 5 + visual gate
12. ACT 6 + visual gate
13. ACT 7 + visual gate
14. Mobile QA
15. Accessibility
16. Performance
17. npm audit raisonné
18. Final build
19. Full-site visual QA
20. Production verification

---

## FULL-SITE FINAL QA

Parcourir l'expérience entière. Je veux ressentir :

```
INTRO → HERO → SOCIAL → PHONE → CREATIVE PROCESS → WORK → JOURNEY → EXPERTISE → CONTACT
```

Pas : une collection de composants React.

Vérifier particulièrement :

- aucun Canvas global
- aucun élément fantôme
- aucun sticky qui fuit
- aucun overlap accidentel
- aucune section transparente accidentellement
- aucun label technique
- aucun long passage vide
- aucun pin sans raison
- aucune transition basée uniquement sur fade si un morph serait meilleur
- aucune animation ajoutée uniquement pour démontrer une compétence technique
