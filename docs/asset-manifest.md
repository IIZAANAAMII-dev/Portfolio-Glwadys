# Asset Manifest

> Le site est désormais soutenu par une **série photographique conceptuelle de
> 18 images générées pour le projet**. Les 47 emplacements du catalogue sont
> alimentés par ces images et leurs recadrages narratifs.
>
> Ce document reste la liste de remplacement pour les futurs médias clients réels.
> Chaque ligne correspond à une entrée de `src/content/media.ts` : substituer un
> fichier conserve les ratios, le layout et les animations.

---

## Comment livrer un média

1. Déposer le fichier dans `public/media/<catégorie>/`.
2. Dans `src/content/media.ts`, ajouter `src` à l'entrée correspondante.
3. C'est tout. Le ratio et la place dans la composition sont déjà déclarés.

**Le ratio livré doit correspondre au ratio déclaré.** C'est la seule contrainte
stricte : c'est elle qui garantit qu'aucune composition ne bouge. Si le cadrage
naturel ne correspond pas, ne pas recadrer soi-même — renseigner `focus`
(ex. `focus: '50% 30%'`) et laisser le site recadrer.

**Direction photo.** Noir et blanc mat ou chaleur contenue, contraste doux,
grain discret, aucun traitement froid ou saturé. Les visuels doivent se lire
comme des tirages premium, pas comme des cartes UI.

**Formats.** JPEG ou PNG en entrée, `next/image` produit AVIF/WebP.
Largeur utile : **2000 px** pour les plein cadre, 1400 px pour le reste.
Inutile de compresser en amont. Vidéo : `mp4` H.264 + une image `poster`.

---

## Série conceptuelle actuellement intégrée

- **Génération :** OpenAI ImageGen intégré à Codex, le 21 août 2026.
- **Mode :** génération intégrée, une requête distincte par prise de vue maître.
- **Direction :** photographie éditoriale chaude et mate, grain argentique discret,
  palette ivoire / bordeaux / noyer / graphite / métal champagne.
- **Sécurité de marque :** aucun logo, nom de marque, interface ou slogan n'est
  incrusté dans les images.
- **Statut :** visuels conceptuels d'appui. Ils ne doivent pas être présentés comme
  des photographies de campagnes réellement livrées aux marques citées.
- **Publication :** remplacer en priorité les images de projet par des médias dont
  Glwadys ou les marques détiennent les droits dès qu'ils sont disponibles.

Les originaux PNG générés restent conservés dans le dossier de génération Codex.
Le projet embarque 18 copies JPEG qualité 88, pour un poids total de **3,51 Mo** :

Le prompt set, les ratios et les demandes propres à chaque prise de vue sont
documentés dans [`docs/generated-photo-prompts.md`](./generated-photo-prompts.md).

| Univers | Fichiers | Dimensions |
|---|---:|---|
| Éditorial / Hero | 2 | 941×1672 à 1122×1402 |
| Social | 4 | 941×1672 à 1254×1254 |
| Process | 2 | 1122×1402 et 1536×1024 |
| Yuna | 3 | 941×1672 à 1254×1254 |
| Marseille Girls Club | 4 | 1122×1402 à 1672×941 |
| Comptoir | 3 | 1122×1402 à 1672×941 |

Les scènes Phone, Immersion et Journey réemploient volontairement cette série :
la répétition crée la continuité du récit et évite 29 téléchargements uniques.

---

## Priorité 1 — remplacements réels recommandés

| ID | Acte | Rôle | Ratio | Ce qu'il faut |
|---|---|---|---|---|
| `hero-vertical` | 01 → 02 → 03 | `story` | **9:16** | **Le média le plus important du site.** Il traverse la Hero, le monde social, et devient l'écran du téléphone. Un contenu vertical fort : campagne, reel, story soignée. Il doit tenir en très grand comme en petit. |
| `hero-frame` | 01 | `campaign` | **4:5** | Second média de la couverture. Détail de campagne, matière, macro produit. **Pas un portrait.** |
| `open-01` … `open-04` | 00 | `texture` / `macro` / `product` | 1:1, 4:5, 3:2, 9:16 | Quatre fragments d'ouverture. **Aucun visage.** Matières, détails, macro, typographie de campagne, objets. |
| `phone-feed-01..04` | 03 | `social` | **1:1** | Quatre contenus de feed qui défilent dans l'écran. |
| `phone-story` | 03 | `story` | **9:16** | Le format Story plein écran du beat 3. |

## Priorité 2 — les trois projets

Chaque projet a une personnalité visuelle distincte. Le mouvement est déjà calé
dessus ; les images doivent la confirmer.

### Yuna Bijoux — joaillerie, premium, silence
| ID | Rôle | Ratio | Ce qu'il faut |
|---|---|---|---|
| `yuna-macro` | `macro` | 4:5 | Macro bijou. Précision, lumière tenue. |
| `yuna-product` | `product` | 1:1 | Produit sur fond neutre. |
| `yuna-social` | `social` | 9:16 | Contenu social publié pour la marque. |
| `yuna-shared` | `campaign` | 4:5 | **Média du handoff Yuna → MGC** : il change de ratio et de palette pour devenir le premier élément MGC. Choisir une image qui supporte un recadrage carré. |

### Marseille Girls Club — communauté, énergie, scrapbook
| ID | Rôle | Ratio | Ce qu'il faut |
|---|---|---|---|
| `mgc-community` | `social` | 1:1 | Humain, communauté, événement. |
| `mgc-event` | `campaign` | 3:2 | Couverture d'événement. |
| `mgc-ugc-01/02` | `social` | 4:5 | Contenus type UGC, esprit collage. |
| `mgc-shared` | `texture` | 16:9 | **Média du handoff MGC → Comptoir** : passe en plein cadre puis glisse vers le bordeaux. |

### Le Comptoir de Mathilde — épicerie fine, matière, art de vivre
| ID | Rôle | Ratio | Ce qu'il faut |
|---|---|---|---|
| `comptoir-texture` | `texture` | 16:9 | **Une matière**, très proche : chocolat, papier, tissu, bois. Support du seul zoom macro lent de l'acte. Doit tenir en 2000 px. |
| `comptoir-product` | `product` | 4:5 | Packaging, produit. |
| `comptoir-shop` | `campaign` | 3:2 | Merchandising, mise en scène boutique. |

## Priorité 3 — le processus créatif

| ID | Acte | Rôle | Ratio | Ce qu'il faut |
|---|---|---|---|---|
| `sheet-01` … `sheet-08` | 05a | `moodboard` / `note` / `planning` | mélangés | Planche contact : captures d'écran de plannings, notes, moodboards, references, screenshots de posts. **L'authenticité compte plus que la beauté** — c'est la coulisse. |
| `behind-moodboard` | 02 | `moodboard` | 3:2 | La strate révélée par le Front→Behind. |
| `behind-planning` | 02 | `planning` | 4:5 | Calendrier éditorial, planning de publication. |

## Priorité 4 — parcours et immersion

| ID | Acte | Rôle | Ratio | Ce qu'il faut |
|---|---|---|---|---|
| `journey-2021` … `journey-2026` | 07 | mélangés | 4:5 | Un fragment par année. Peut réutiliser les médias projets. |
| `depth-01` … `depth-06` | 04 | mélangés | mélangés | Les plans de la scène 3D. **Peuvent réutiliser** les médias ci-dessus — c'est même préférable narrativement : on retraverse ce qu'on vient de voir. Contrainte technique : ≤ 2048 px, puissances de 2 recommandées. |
| `portrait-editorial` | 09 | `portrait` | 4:5 | **Optionnel.** Un seul portrait, discret, à la toute fin. Le site est explicitement construit pour ne pas reposer sur le visage de Glwadys : ce média est un choix, pas un besoin. |

---

## Ce qu'il ne faut pas livrer

- Des captures d'écran d'Instagram avec l'interface visible (barres, icônes, likes).
  Le contenu **dans** le téléphone est mis en scène par le site lui-même.
- Des images avec du texte incrusté en petit corps : illisible en réservation
  comme en plein cadre.
- Des photos déjà recadrées serré : le site a besoin de marge pour recadrer.
- Des logos en bitmap. Si un logo est nécessaire, fournir un SVG.
- Des images de banque d'images génériques. Mieux vaut la réservation éditoriale
  qu'une fausse image : la réservation est un parti pris, la banque d'images est
  un aveu.

---

## Licences

Aucun asset photographique externe n'est utilisé dans le projet. La série actuelle
a été générée spécifiquement avec OpenAI ImageGen et ne contient pas de marque ou
de personne identifiable. Le grain d'interface est généré en SVG (`feTurbulence`,
data-URI). Les polices — **Bodoni Moda**, **Inter Tight**, **Noto Sans KR** — sont
sous SIL Open Font License 1.1 et auto-hébergées par `next/font`, sans requête vers
un tiers.

Tout média ajouté doit être la propriété de Glwadys ou faire l'objet d'une
autorisation d'usage. Les contenus produits pour une marque (Yuna, MGC, Comptoir)
relèvent souvent d'un accord avec cette marque : à vérifier avant publication.

---

## État courant

| | Compte |
|---|---|
| Emplacements définis | **47** |
| Emplacements alimentés | **47 / 47** |
| Photographies maîtres | **18** |
| Poids source dans le projet | **3,51 Mo** |
| Emplacements en réservation | **0** |

Le site est pleinement fonctionnel et présentable avec cette série conceptuelle.
Une validation contractuelle reste nécessaire avant d'associer les visuels aux
expériences clients réelles.
