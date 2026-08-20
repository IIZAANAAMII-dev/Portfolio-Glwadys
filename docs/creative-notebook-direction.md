# Direction artistique — Creative Notebook Premium

> Source de vérité visuelle active depuis le 20 août 2026. Elle remplace la
> direction « pré-presse » historique décrite dans `creative-direction.md`.

## Intention

Le portfolio est le carnet de travail évolutif d’une créative : intuition,
contenu, direction, stratégie, projets, expérience. Le langage visuel est celui
d’un carnet éditorial de luxe — tactile, mode, international, personnel et très
maîtrisé — jamais celui d’un scrapbook DIY, d’un template vintage ou d’un
simulateur de livre.

La narration alterne les formes au lieu de déguiser chaque section en page :

- couverture et spreads éditoriaux très propres ;
- contact sheet et compositions asymétriques ;
- grande photographie accompagnée de notes rares ;
- système de marque strict et séquences plein écran ;
- archives suspendues dans un espace sombre et chaud.

## Palette testée

| Token | Valeur active | Usage |
|---|---:|---|
| Ivory | `#F3EDE3` | pages principales, lumière |
| Paper | `#E8DED1` | contre-pages, fonds secondaires |
| Warm taupe | `#BCA991` | tirages chauds, accents mats |
| Ink | `#17140F` | texte et couvertures |
| Charcoal | `#28221C` | média sombre, profondeur |
| Champagne | `#D0AD72` | ruban et filet exceptionnel |
| Antique gold | `#986738` | détail patrimonial, jamais corps de texte |
| Rich wine | `#592027` | accent identitaire et transition |
| Espresso | `#4A2E21` | matière et ombre chaude |
| Wood brown | `#2B1D17` | table, dos de couverture, espace 3D |

Il n’y a ni blanc froid, ni gris UI, ni couleur numérique flashy. Le grain est
statique et la texture papier reste assez faible pour préserver le contraste.

## Trois voix typographiques

1. **Bodoni Moda** — display serif pour la couverture, les titres et les mots
   de bascule.
2. **Inter Tight** — sans-serif fine pour la navigation, les dates, les labels,
   les légendes et le corps.
3. **Kalam** — accent manuscrit réservé aux notes courtes. Jamais un paragraphe,
   jamais un grand titre.

`Noto Sans KR` reste une police fonctionnelle de locale et non une quatrième
voix graphique.

## Matières et limite de dosage

Un écran ne doit porter qu’un ou deux gestes tactiles forts : bande de papier,
trombone, tampon, bord de page, pli ou trait de crayon. Ces signes servent à
expliquer un état de travail ; ils ne sont jamais ajoutés comme stickers.

- Ombres : larges, chaudes, mates et peu opaques.
- Papier : bords francs, fibres discrètes, aucun rayon décoratif.
- Photos : noir et blanc ou chaleur maîtrisée, traitées comme des tirages.
- Paris ↔ Séoul : micro-label, tampon, axe ou timeline — aucun drapeau et aucun
  décor culturel littéral.

## Storyboard par acte

| Acte | Forme | Fonction narrative | Geste tactile principal |
|---|---|---|---|
| 00–01 Opening/Hero | couverture sombre puis spread ivoire | fragments → identité | page centrale + ruban |
| 02 Social | digital au-dessus d’un dossier papier | front → préparation | onglet de dossier |
| 03 Phone | objet digital sur table éditoriale | contenu en situation | note manuscrite |
| 04 Immersion | archive suspendue chaude | entrer dans le contenu | feuilles courbées |
| 05 Process | contact sheet puis grille | intuition → système | trombone/ruban rares |
| 06 Work | trois dossiers distincts | appliquer la méthode | chapitre/index |
| 07 Journey | travel log moderne | expérience internationale | tampons d’années |
| 08 Expertise | grand index typographique | compétences sans cartes | soulignements crayon |
| 09 Contact | dernière page sur couverture bois | sortie calme | mention « last page » |

## Motion

GSAP/ScrollTrigger reste le directeur unique du scroll. Les gestes sont des
transformations de matière : un papier glisse, un tirage passe sous un autre,
une composition se range, une feuille se courbe puis s’aplatit. Les animations
utilisent principalement transform et opacity, respectent le reduced motion et
gardent un seul pilote par propriété.

Sont explicitement interdits : page-turn gadget, physique de livre, parallaxe
gratuite, rebonds craft, néon, bleu sci-fi et accumulation de collages.

## 3D structurée

La scène immersive est un **archive room**, pas une démo Three.js. Chaque plan
appartient à l’acte Immersion, porte un type de média, occupe une profondeur
nommée et suit la transition ouverture → circulation → mise à plat. La lumière
est simulée dans le shader pour garder six feuilles peu coûteuses, avec vignette
chaude et ombre de bord. Aucun objet 3D sans fonction narrative.

