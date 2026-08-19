# GLWADYS DALLEAU — CREATIVE BRIEF

> Portfolio premium, éditorial, mémorable, cohérent.
> Objectif : niveau de réalisation Awwwards, sans en promettre l'award.
> Production actuelle : https://portfolio-glwadys.vercel.app/fr

---

## POSITIONNEMENT

**Glwadys Dalleau**

- Social Media
- Content Creation
- Brand Communication
- Digital Marketing

**Direction :**

- fashion editorial
- social culture
- digital magazine
- brand storytelling
- premium creative portfolio

**Non :**

- SaaS
- dashboard
- portfolio template
- Webflow agency cliché

---

## DA À CONSERVER

Conserver les meilleurs éléments existants :

- palette
- grain
- grande typographie
- contrastes
- ambiance
- élégance
- certaines transparences/glass légères
- footer si pertinent

Ne remplace pas l'identité actuelle par un design générique.

---

## RÉFÉRENCES

Étudier les **principes** de :

- https://pahari.vercel.app/
- https://nikolaradeski.com/

**Ne copie pas** leur code, layout, assets, typography ou animation exacte.

**PAHARI** : seulement l'idée narrative :

- identité
- apparition des médias
- léger mouse parallax
- ces éléments construisent la Hero

**NIKOLA RADESKI** : seulement :

- identité typographique forte
- composition Hero premium
- média central
- espace
- bottom navigation capsule

Créer une interprétation propre à Glwadys.

---

## PARCOURS FINAL — 7 ACTES

Le visiteur ne doit ressentir que 7 grands actes :

| Act | Name | Sens |
|-----|------|------|
| 1 | INTRO / HERO | Curiosité, identité |
| 2 | SOCIAL WORLD / PHONE | Énergie, immersion |
| 3 | CREATIVE PROCESS | Maîtrise |
| 4 | SELECTED WORK | Personnalité |
| 5 | JOURNEY | Évolution |
| 6 | EXPERTISE | Confiance |
| 7 | CONTACT | Calme |

Ne donne plus l'impression de traverser 15 sections indépendantes.

---

## ACT 1 — INTRO / HERO

### INTRO

INTRO et HERO sont différentes.

- INTRO = title sequence.
- HERO = cover finale.

L'intro doit être courte et nerveuse.

Les valeurs temporelles données ici sont des **REPÈRES**, jamais des obligations.

- Environ 1.5 à 2.5 secondes si cela fonctionne visuellement.

**Début :**

- `GLWADYS DALLEAU`
- petite accroche

Puis plusieurs médias arrivent depuis différentes zones du viewport.

**Desktop :** mouse parallax léger.

Utiliser une composition éditoriale volontaire. Pas de placement aléatoire.

Les médias de l'intro deviennent ensuite ceux de la Hero.

**INTERDIT :** intro fade out → hero fade in. Je veux une transformation.

### HERO

La Hero doit fonctionner comme une cover de magazine. Elle doit déjà être superbe en screenshot.

Grande identité :

```
GLWADYS
DALLEAU
```

- Un média principal fort.
- Quelques médias secondaires seulement.

**Accroche :**

> JE TRANSFORME LES MARQUES EN HISTOIRES DONT ON SE SOUVIENT.

**Tiny metadata :**

- SOCIAL MEDIA / CONTENT / BRAND
- MARSEILLE — FR

Évite de tout raconter immédiatement.

### BOTTOM NAV

Navigation capsule fixe en bas.

Direction inspirée seulement dans son principe de Nikola.

Par exemple :

```
GD   WORK   JOURNEY   EXPERTISE   CONTACT
```

- FR / EN / KO correctement intégré.
- Cachée pendant l'intro.
- Apparaît quand la Hero finale est construite.
- Reste petite, premium et discrète.

### HERO SCROLL

Pin court uniquement s'il améliore vraiment le récit.

- Hero stable
- recomposition légère
- média principal prend le contrôle
- transition Social

Le visiteur doit sentir : **"la couverture s'ouvre"**.

---

## ACT 2 — SOCIAL WORLD / PHONE

Pas besoin d'une énorme section Identity autonome.

Faire :

- Hero media
- portrait
- crop
- grid
- contenus sociaux

La transition doit être continue.

### SOCIAL WORLD

Premier vrai moment énergique.

- DOM + GSAP + ScrollTrigger + CSS perspective locale.
- Composition éditoriale.
- Repère seulement : environ 5 à 7 médias simultanément sur grand desktop.
- Moins si une composition plus simple est meilleure.

**Types :**

- post
- story
- reel
- campaign
- portrait

Chaque média possède un rôle. Pas de scatter aléatoire.

### FRONT / BEHIND

Conserver cette idée.

**FRONT :** contenu final.

**BEHIND :** planning, moodboard, captions, strategy, calendar.

La transformation doit être spatiale/compositionnelle. Pas juste opacity swap.

### PHONE BIRTH

Choisir **UNE** Story. Elle devient dominante. Les autres médias sortent.

La Story :

- se centre
- devient frontale
- adopte le ratio écran

Puis le téléphone se construit **AUTOUR**.

Le téléphone est DOM/CSS. Pas GLB. Pas Three. Il doit réellement ressembler à un smartphone premium.

### PHONE PIN

Le téléphone devient une **ANCRE**. Il ne scroll pas physiquement avec la page. Le scroll pilote sa timeline.

4 beats maximum comme repère :

- FEED
- STORY
- REEL
- CAMPAIGN

Peut être moins si plus élégant.

### PHONE → GALLERY

- Téléphone frontal.
- Screen grossit.
- Bezel sort du viewport.
- L'écran devient plein viewport.
- Son contenu devient directement la galerie.

Aucun hard cut.

---

## ACT 3 — CREATIVE PROCESS

Cette séquence doit raconter visuellement :

```
CONTENT → CURATION → MOODBOARD → BRAND → STRATEGY
```

Je ne veux pas cinq sections séparées.

### GALLERY

Grande galerie DOM. Commencer éventuellement par un voyage horizontal.

- Scroll vertical → track X.
- Différents formats : portrait, landscape, story, reel, square, typography.
- Créer une grille invisible.

### DEPTH

CSS perspective uniquement si elle apporte réellement quelque chose.

- Foreground / middle / background via parallax différentiel.
- Aucun faux effet 3D cheap.
- Si une simple composition 2D avec excellent parallax est meilleure : choisis-la.

### X → Y

Le mouvement horizontal doit éventuellement évoluer vers une composition verticale.

- Créer un média guide.
- Pas de changement arbitraire de direction.

### FAUX Z

Optionnel.

Utiliser :

- scale
- crop
- perspective
- depth layers
- mask

Si ce n'est pas excellent : supprime-le.

### GALLERY → COLLAGE

Les médias ralentissent. Ils convergent. Le système horizontal disparaît. Les médias forment un collage.

### COLLAGE → MOODBOARD

Le collage commence à s'organiser. Palette, font, image, tone, messaging, content fragments.

### MOODBOARD → BRAND

- Rotations diminuent.
- Alignements deviennent réguliers.
- Spacing devient intentionnel.

### BRAND → STRATEGY

- L'ambiance devient plus structurée.
- Éventuellement fond plus ivoire / clair si cohérent.
- La composition devient frontale.
- Puis horizontal Strategy.

### STRATEGY

Passage horizontal pinned. Peu de texte. Grande typo.

Exemples de contenus :

- POSITIONING
- AUDIENCE
- CONTENT PLANNING
- BRAND VOICE
- EDITORIAL CALENDAR
- MESSAGING

---

## ACT 4 — SELECTED WORK

Pas de constellation. Pas de grille générique de trois cards. Les projets doivent être trois univers.

### YUNA

- fashion
- jewelry
- elegant
- social

Vertical imagery, product macro, phone DOM si pertinent, masks, fine typography. Peu de grosses interactions.

### YUNA → MGC

Un média Yuna devient la première pièce du chapitre suivant. Shared transition.

### MGC

- community
- event
- human
- scrapbook
- energy

5–8 photos comme simple repère maximum, pas obligation.

- Paper texture
- Overlaps
- Slight rotations
- Typography fragments
- Sticky composition si pertinente

Le résultat doit rester curated.

### MGC → COMPTOIR

Un média devient plein viewport. Transition colorimétrique : vers cream, brown, chocolate.

### COMPTOIR

Moment calme. Beaucoup moins d'animation.

- Grandes images
- Packaging
- Matière
- Produit

**UNE** animation signature seulement. Choisir celle qui rend le mieux :

- macro zoom
- OU product parallax
- OU texture reveal

---

## ACT 5 — JOURNEY

Fusionner intelligemment : About, Experience, Education, Journey.

Ne raconte pas trois fois les mêmes entreprises.

Après Work : respiration. Portrait. Quelques phrases fortes. Puis la composition devient timeline.

### TIMELINE

Grandes années : 2021, 2022, 2023, 2024, 2025, 2026.

- Horizontal pinned seulement si réellement pertinent.
- Peu de texte.
- Utiliser les informations réelles disponibles : IPAC, Yuna, Le Comptoir, Marseille Girls Club, Freelance.
- Ne rien inventer.
- IPAC = milestone. Pas grosse section séparée.

---

## ACT 6 — EXPERTISE

Pas de cards SaaS. Grande séquence typographique.

**Services réels :**

- Social Media Management
- Content Creation
- Content Strategy
- Brand Communication
- Digital Marketing
- Community Management
- Market Research

Lorsqu'un service devient actif : petit média contextuel. La section doit être relativement courte.

---

## ACT 7 — CONTACT

Faire retomber toute l'énergie.

- Beaucoup d'espace.
- Grande phrase :

```
CRÉONS
QUELQUE CHOSE
DONT ON SE SOUVIENT.
```

- Puis email / LinkedIn.
- Footer presque statique.
- Fin calme.

---

## RÉDACTION / CONTENU

**SUPPRIMER du rendu public** tous les labels techniques :

```
TRANSITION
CAMERA DIVE
AXE X
AXE Y
AXE Z
TRAVELLING SPATIAL
STACKING
PROGRESSION 3D
GRILLE STRATÉGIQUE IVOIRE
...
```

**RÈGLE :** si un texte explique COMMENT l'animation fonctionne, il appartient à `/docs`, pas au portfolio.

---

## SENSATIONS À PRODUIRE

| Section | Sensation |
|---------|-----------|
| INTRO | curiosité |
| HERO | identité |
| SOCIAL | énergie |
| PHONE | immersion |
| PROCESS | maîtrise |
| WORK | personnalité |
| JOURNEY | évolution |
| EXPERTISE | confiance |
| CONTACT | calme |

---

## FINAL QUALITY QUESTIONS

Avant de terminer :

- Est-ce que les 5 premières secondes sont mémorables ?
- Est-ce que la Hero ferait une bonne cover statique ?
- Est-ce que chaque mouvement a une raison ?
- Est-ce que le site paraît cohérent du début à la fin ?
- Est-ce que chaque projet possède sa personnalité ?
- Est-ce que l'expérience paraît plus simple qu'elle ne l'est techniquement ?
- Est-ce que le mobile semble conçu spécifiquement ?
- Est-ce que le scroll reste agréable à l'aller ET au retour ?
- Est-ce qu'on oublie complètement la technologie utilisée ?

Si une réponse importante est **NON** : continuer à polir.
