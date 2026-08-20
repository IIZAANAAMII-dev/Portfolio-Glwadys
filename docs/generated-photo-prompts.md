# Série photo générée — prompts et traçabilité

Cette série a été produite le 21 août 2026 avec **OpenAI ImageGen intégré à
Codex**, en mode génération d'image. Une requête distincte a été utilisée pour
chaque prise de vue maître. Les 17 images suivant la couverture ont utilisé la
première image comme **référence de style uniquement**, sans demander d'en
reprendre la composition ou les objets.

## Direction commune du prompt

Chaque requête combinait les contraintes suivantes :

- photographie éditoriale premium pour le portfolio d'une directrice créative ;
- lumière naturelle chaude et contenue, contraste mat, grain argentique discret ;
- palette ivoire, bordeaux profond, noyer, graphite et métal champagne ;
- matières tactiles et composition laissant de l'espace pour le layout du site ;
- rendu crédible de prise de vue moyen format / 35 mm, sans aspect 3D ou banque
  d'images ;
- aucun texte lisible, logo, nom de marque, interface, slogan ou filigrane ;
- ratio demandé explicitement pour correspondre à l'emplacement final.

Les scènes humaines ont été demandées comme des moments naturels et anonymes,
sans célébrité ni personne réelle identifiable. Les scènes produit ont été
générées sans packaging ou identité de marque existante.

## Prompt set par fichier

| Fichier intégré | Ratio | Demande principale ajoutée à la direction commune |
|---|---:|---|
| `editorial/hero-vertical.jpg` | 9:16 | Nature morte sculpturale : bague argentée, miroir, papiers ivoire, ruban bordeaux et noyer ; image de couverture. |
| `editorial/hero-frame.jpg` | 4:5 | Macro d'une table de direction créative : tirage sans texte, pince champagne et papier bordeaux. |
| `social/social-campaign.jpg` | 4:5 | Deux mains organisant des tirages vierges et un posemètre pour préparer une production de contenu. |
| `social/social-reel.jpg` | 9:16 | Femme vue de dos marchant dans une rue de Marseille vers la mer, foulard bordeaux au vent. |
| `social/social-object.jpg` | 1:1 | Appareil photo noir, planche-contact sans texte et crayon bordeaux sur papier ivoire. |
| `social/social-community.jpg` | 1:1 | Quatre femmes collaborant naturellement autour d'une table de création éclairée par le jour. |
| `process/moodboard.jpg` | 3:2 | Vue zénithale d'un moodboard tactile : tirages vierges, papiers, nuances bordeaux et règle métallique. |
| `process/planning.jpg` | 4:5 | Main annotant au crayon une grille éditoriale analogique, sans dates ni texte lisible. |
| `yuna/yuna-macro.jpg` | 4:5 | Boucle d'oreille argentée sculpturale sur velours graphite, précision macro et lumière tenue. |
| `yuna/yuna-product.jpg` | 1:1 | Pendentif argenté sans marque sur un carré de papier ivoire texturé. |
| `yuna/yuna-social.jpg` | 9:16 | Main portant une bague argentée sculpturale, tenue noire et lumière chaude discrète. |
| `mgc/mgc-community.jpg` | 1:1 | Cinq femmes échangeant et riant autour d'une table dans une cour marseillaise. |
| `mgc/mgc-event.jpg` | 3:2 | Préparation d'une rencontre créative autour d'une longue table dans une cour, à la tombée du jour. |
| `mgc/mgc-ugc.jpg` | 4:5 | Deux femmes assises sur des marches en pierre découvrant ensemble des tirages vierges. |
| `mgc/mgc-shared.jpg` | 16:9 | Papiers ivoire, étoffe bordeaux et reflets d'eau ; texture de transition abstraite. |
| `comptoir/comptoir-texture.jpg` | 16:9 | Macro de chocolat noir, poudre de cacao, papier bordeaux et noyer ancien. |
| `comptoir/comptoir-product.jpg` | 4:5 | Tablette artisanale sans marque, emballée de papier ivoire et d'une bande bordeaux. |
| `comptoir/comptoir-shop.jpg` | 3:2 | Table de merchandising chaleureuse avec chocolats, bocaux et papiers, sans étiquette lisible. |

## Sorties et traitement

- Originaux : PNG générés par ImageGen, de 941×1672 à 1672×941 px.
- Intégration : copies JPEG qualité 88 dans `public/media/generated/`.
- Poids intégré : 18 fichiers, 3,51 Mo au total.
- Recadrage : géré dans `src/content/media.ts` via le ratio déclaré et `focus`.
- WebGL : les six visuels d'immersion réemploient ces JPEG en sRGB, avec mipmaps
  et anisotropie limitée à 8.

Ces images sont des visuels conceptuels d'appui. Elles doivent être remplacées
par les campagnes réelles autorisées dès que Glwadys dispose des fichiers et des
droits de publication correspondants.
