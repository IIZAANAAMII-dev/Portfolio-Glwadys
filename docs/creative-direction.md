# Creative Direction — archive pré-presse

> **Archivé le 20 août 2026.** La source de vérité active est
> [`creative-notebook-direction.md`](creative-notebook-direction.md). Les règles
> ci-dessous documentent l’ancienne piste pré-presse et ne doivent plus guider
> de nouvelles décisions visuelles.

> Phase 4 du brief. Ce document est opposable : tout ce qui est construit doit
> pouvoir se justifier ici, et tout ce qui ne s'y justifie pas doit être supprimé.

---

## 1. Le sujet

**Glwadys Dalleau** — social media, création de contenu, communication de marque,
stratégie de contenu, community management. Univers : luxe, mode, cosmétique,
joaillerie, art de vivre. Base **Marseille**, horizon **Séoul**.

La phrase qui tient tout le site :

> **Je transforme les marques en histoires dont on se souvient.**

Elle n'est pas un slogan décoratif : c'est la thèse que l'expérience doit
démontrer. D'où le mouvement narratif du site : on montre d'abord le **résultat**
(du contenu fini, séduisant), puis on force la révélation de ce qu'il y a
**derrière** (une stratégie), puis on remonte jusqu'au **système** qui la produit.

Ce que le site doit faire comprendre sans jamais l'écrire :
elle ne « fait pas des posts », elle construit des récits de marque.

---

## 2. Le problème de départ, et pourquoi il devient une force

**Aucun asset photographique n'est disponible aujourd'hui.** Les visuels réels
seront fournis plus tard.

Un site éditorial dont les images manquent peut échouer de deux façons : afficher
des placeholders gris (cheap, disqualifiant), ou remplir avec de la banque
d'images générique (mensonger, et visible immédiatement par un œil entraîné).

La sortie retenue est une troisième voie, et elle est cohérente avec le sujet :

> **Le site adopte le langage du pré-presse.**
> Ce n'est pas un site auquel il manque des images.
> C'est une **maquette de magazine avant le bon à tirer** — un objet éditorial
> où les emplacements sont *réservés*, cotés, cadrés, annotés.

C'est un registre réel, professionnel et désirable : les chemins de fer, les
gabarits, les repères de coupe font partie de la culture visuelle de la mode et
de l'édition. Cela rend l'absence d'image **volontaire** au lieu de subie, et cela
raconte au passage le métier de Glwadys : la direction avant l'exécution.

**Conséquence directe :** la charge expressive repose sur la **typographie, la
composition, l'espace, le rythme et la matière**. Ce sont précisément les quatre
sources de luxe listées par le brief. La contrainte pousse dans la bonne direction.

Et quand les vrais médias arriveront, ils prendront la place des réservations
**sans modification de code** (voir `asset-manifest.md`).

---

## 3. Registre

```
EDITORIAL LUXURY  ×  FASHION MAGAZINE  ×  CONTEMPORARY DIGITAL  ×  STUDIO
```

Le site doit ressembler à une couverture, un lookbook, un chemin de fer, une
table de montage. Jamais à une interface SaaS.

**Trois mots de garde :** *tenu*, *tranchant*, *silencieux*.

Registre féminin par la finesse, le contraste typographique et la retenue —
jamais par le rose, l'arrondi ou le décoratif.

Dimension coréenne : elle existe **par l'ouverture**, pas par le folklore.
Elle se manifeste uniquement par le motif `MARSEILLE ↔ SEOUL`, la présence
d'une version coréenne du site, et une sensibilité éditoriale (blanc, silence,
asymétrie). **Aucun** drapeau, aucun hangul décoratif, aucune esthétique K-pop.

---

## 4. Couleur

Palette courte. Le luxe vient du contraste d'échelle et du vide, pas du nombre
de couleurs.

| Token | Valeur | Rôle |
|---|---|---|
| `--paper` | `#F2EDE4` | Ivoire chaud. Fond des actes clairs. |
| `--paper-deep` | `#E5DCCE` | Second ivoire. Réservations, aplats, respirations. |
| `--ink` | `#0E0D0C` | Noir encre légèrement chaud. Fond des actes sombres, texte sur ivoire. |
| `--graphite` | `#2A2724` | Gris chaud. Aplats secondaires, réservations sur fond sombre. |
| `--bordeaux` | `#3B121B` | Bordeaux profond. Fond des moments de tension. |
| `--oxblood` | `#5C1A24` | Rouge brun. **Seule couleur accentuée.** Filets, mots isolés, état actif. |
| `--blush` | `#D9C4B8` | Ton chair poudré. Très discret, réservations claires uniquement. |
| `--champagne` | `#C3A87C` | Métallique. **Filets capillaires uniquement**, jamais en aplat, jamais en texte plein. |

Règles opposables :

- **Aucun noir pur `#000`, aucun blanc pur `#FFF`.** Tout est légèrement chaud.
- `--champagne` n'apparaît **jamais** en surface. Filets à 1 px, ou texte
  à ≤ 12 px en petites capitales, et **au maximum deux fois dans tout le site**.
  C'est ce qui sépare le luxe du doré cheap.
- Un acte a **un** fond. Pas de dégradé de fond. Les gradients sont réservés à la
  matière (grain, reflet du téléphone, vignettage de réservation).
- `--oxblood` est un accent, pas une couleur d'ambiance : jamais plus d'un
  élément accentué visible à la fois.

**Partition chromatique** (elle signale les chapitres sans étiquette) :

```
00 Opening      ink
01 Hero         ink
02 Social       ink ────────────► paper      (bascule au Front→Behind)
03 Phone        paper
04 Immersion    ink
05 Process      paper → paper-deep
   Strategy     paper
06 Yuna         ink
   MGC          paper-deep
   Comptoir     bordeaux
07 Journey      ink
08 Expertise    paper
09 Contact      ink
```

Trois bascules majeures clair↔sombre, chacune posée sur un handoff — donc jamais
perçue comme un changement de section, mais comme un changement de lumière.

---

## 5. Typographie

Deux familles, plus une pour le coréen. Trois au total, conformément à la règle
« rarement plus de trois ».

| Famille | Rôle |
|---|---|
| **Bodoni Moda** (variable, axe `opsz`) | Display. Didone à très fort contraste : registre haute couture. |
| **Inter Tight** (variable) | Sans suisse. Méta, labels, corps, chiffres. |
| **Noto Sans KR** | Version coréenne uniquement. |

**Pourquoi ce couple.** Le contraste gras/maigre extrême du Didone n'existe qu'au
grand corps : c'est une typo qui *exige* l'échelle, donc elle force une
composition éditoriale plutôt qu'une grille d'interface. Inter Tight, resserrée
et neutre, ne lui dispute rien. Serif expressive + sans neutre = « display et
lecture », lu comme délibéré.

**Contrainte assumée à surveiller :** un Didone à faible corps devient illisible,
et ses déliés maigres disparaissent sur écran basse densité. D'où les règles :

- Bodoni Moda **uniquement** ≥ 28 px, et jamais en dessous du poids 400 en petit.
- Aucun texte courant en Bodoni. Le corps de lecture est en Inter Tight.
- Poids < 300 : display ≥ 28 px seulement.
- Sous 18 px : poids ≥ 400.

**Échelle et tracking** (les valeurs viennent des relevés de sites de mode) :

| Token | Taille | Tracking | Line-height |
|---|---|---|---|
| `--t-monument` | `clamp(4.5rem, 17vw, 20rem)` | `-0.045em` | `0.82` |
| `--t-display` | `clamp(2.75rem, 8vw, 8.5rem)` | `-0.03em` | `0.92` |
| `--t-title` | `clamp(1.75rem, 3.6vw, 3.25rem)` | `-0.02em` | `1.05` |
| `--t-lead` | `clamp(1.125rem, 1.7vw, 1.5rem)` | `-0.01em` | `1.35` |
| `--t-body` | `1rem` | `0` | `1.55` |
| `--t-meta` | `0.75rem` | `+0.14em` | `1.2` |
| `--t-micro` | `0.6875rem` | `+0.18em` | `1.1` |

Le rapport `--t-monument` / `--t-micro` atteint ~28:1. **C'est ce contraste
d'échelle qui produit le luxe**, pas l'ornement.

Autres règles :
- `text-wrap: balance` sur les titres, `pretty` sur les descriptions, aucun des
  deux sur le texte long.
- Mesure plafonnée à 60–75 caractères (`max-width: 34ch` sur le lead).
- `font-variant-numeric: tabular-nums` sur toute valeur qui change (années,
  index, compteurs) — sinon la mise en page tremble.
- Petites capitales = tracking **positif** obligatoire. Grand corps = tracking
  **négatif**.
- Le texte est stocké en casse naturelle ; les capitales sont un effet CSS
  (`text-transform`), jamais une décision d'écriture.
- `font-optical-sizing: auto` (Bodoni Moda a un axe `opsz` : on s'en sert).

**La typographie est un matériau graphique**, pas seulement un porteur de sens :
elle est recadrée, masquée, sortie du cadre, utilisée comme surface. Mais elle
n'est **pas animée systématiquement** : voir `motion-system.md`.

---

## 6. Grille et composition

Grille de **12 colonnes**, gouttière `1.5rem`, marges `clamp(1.25rem, 4vw, 5rem)`.

Elle est là pour être **habitée, puis brisée délibérément** : la grille sert de
référence pour que la rupture se lise comme une décision. Chaque composition est
asymétrique ; rien n'est centré par défaut.

- **Le vide est un élément de composition.** Une colonne vide est un choix.
- **Débord assumé** : les très grands titres peuvent sortir du cadre. Un mot coupé
  par le bord est un geste éditorial, pas un bug — mais jamais sur du texte
  porteur d'information.
- **Filets capillaires** (1 px, `--ink` à 12 % ou `--champagne` à 25 %) pour
  structurer. Jamais d'ombre de carte.
- **Labels verticaux** (`writing-mode: vertical-rl`) ponctuels, en `--t-micro`,
  posés dans les marges.
- **Aucun `border-radius`** en dehors du téléphone. Zéro exception.
- Espacement : `~64px` (`--space-block`) entre blocs majeurs, `10–20px` entre
  éléments liés.

---

## 7. Matière

**Grain.** Un grain unique, global, en overlay : opacité **0.058**, statique,
`pointer-events: none`, généré une seule fois avec deux échelles de turbulence
(grain argentique fin + fibre papier large) en data-URI, donc aucune requête
réseau et aucun asset binaire. Il ne réduit jamais la
lisibilité et il n'est **jamais animé** — grain animé = anti-pattern documenté.
Son rôle : donner une matière de papier et unifier ivoire et encre.

**Réservation média.** Le composant central de la DA en l'absence de photos.
Une réservation n'est pas un placeholder : c'est une **fenêtre cotée**.

Elle est composée de :
- un aplat tonal issu de la palette (jamais un gris neutre) ;
- des **repères de coupe** aux quatre angles : filets 1 px, longueur ~14 px ;
- une légende en `--t-micro` : rôle + ratio, ex. `CAMPAIGN · 4:5` ;
- un **index** en chiffres tabulaires, ex. `03 / 06` ;
- un très léger vignettage pour donner de la profondeur au lieu d'un aplat mort ;
- le grain global par-dessus.

Elle respecte **exactement** le ratio du média final (`aspect-ratio`), pour que
l'arrivée des vraies images ne provoque **aucun** décalage de mise en page.

> Le même composant affiche l'image dès qu'un `src` existe, et la réservation
> disparaît. C'est la même API, le même ratio, la même place dans la composition.

**Reflet.** Uniquement sur l'écran du téléphone : un gradient linéaire très faible,
statique. Aucun `backdrop-filter` massif, aucune ombre animée.

---

## 8. Ce que ce site ne fera pas

Interdits explicites, à valeur de test d'acceptation :

cards SaaS · grilles de cartes identiques · glassmorphism · gradients
violets/bleus · blobs · particules · néons · UI dashboard · gros `border-radius` ·
ombres de cartes · barres de compétences · nuages de logos · carrousels ·
témoignages · `fade-up` systématique · grain animé · doré en aplat ·
noir pur / blanc pur · texte centré par défaut · lorem ipsum ·
étiquettes techniques visibles (« pinned », « 3D gallery », « scroll to explore »…).

---

## 9. Critère de réussite

Trois tests, à appliquer à chaque acte :

1. **Test de la capture.** Un screenshot statique de cet acte tiendrait-il comme
   page de magazine ? Si l'acte n'existe que par son animation, il est faible.
2. **Test de la soustraction.** Si je retire un effet, le site est-il meilleur ?
   Si oui, il faut le retirer.
3. **Test de la narration.** Cette animation raconte-t-elle quelque chose sur
   Glwadys ? Sinon elle est décorative, donc suspecte.
