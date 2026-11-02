# 39 — Passe « premium Awwwards » (Claude, 2 novembre 2026)

Branche `claude/awwwards-premium`, partie de `jarvis/glwadys-fusion-luxe-ugc` (b2ccf7e), la plus récente. `main` n'a pas été modifiée.

## Méthode
- Build de production réel (`next build`, Turbopack), puis `next start`.
- Storyboards Chromium par position de scroll réelle : 1440×900 FR, 390×844 FR et 320×568 KO. Captures de transitions intermédiaires, plus aller-retour.
- Interactions exécutées dans le navigateur : rideau de chapitre, sommaire mobile, copie de l'adresse (presse-papiers relu), aimant de l'étiquette, retour au début, saut natif sous mouvement réduit.
- Skills appliqués : `awwwards-animations`, `better-typography`, `web-design-guidelines` (règles récupérées en direct).
- Preview Vercel du premier commit : READY.

## Références Awwwards retenues (principes, jamais de copie)
- **Cartier — Le Chœur des Pierres** (makemepulse), SOTD 20/10/2026. Révélation « gouache » et scroll animé. Notes du jury : accessibilité 8,0, animations 8,6. → lavis à bord fondu des études Expertise.
- **MIU MIU — A House that we shaped** (Merci Michel), Site of the Month août 2026. Transitions d'entrée et de sortie entre scènes. → rideau de chapitre.
- **G. Colombel — Portfolio 2026**, SOTD et Developer Award du 28/10/2026. Transition de page, préchargement soigné. → chapitre composé derrière la page d'encre.
- **Almira Kho** (mention honorable 29/09/2026) et **Deadly Ponies** (Studio Almond, mention honorable 09/10/2026). Typographie de magazine, photographie plein cadre, retenue. → vrai italique Didone, 404 éditoriale.

Pondération Awwwards : Design 40 %, Usability 30 %, Creativity 20 %, Content 10 %. L'usabilité pèse presque autant que le design : chaque correction ci-dessous vise un défaut visible ou une friction réelle.

## Défauts corrigés (constatés en capture)
| Défaut | Correction |
| --- | --- |
| Pendant ~2 s avant hydratation, le carnet et Yuna (empilés par les marges -100svh) recouvraient la couverture | Drapeau `data-js` posé avant le premier rendu : les actes suivants restent masqués jusqu'à `data-hydrated`. Sans JS, les actes se lisent à plat |
| Couverture desktop : détail agrandi 2,3× d'un portrait de 941 px, flou, bague illisible | La boîte du tirage a le ratio de la photo. La couverture montre toute la nature morte, nette, puis la photo grandit avec la fenêtre jusqu'au plein cadre |
| Couverture mobile : agrandissement 2,6× sur iPhone 3× | Même mécanique, cadrage serré sur le bijou à environ 1,1 px source par pixel |
| Seul le Bodoni romain était chargé : les 22 italiques étaient synthétisés | Ajout du vrai Bodoni Moda Italic (Fontsource 5.3.0, OFL). Le romain est identique octet pour octet au fichier du paquet |
| Couture Expertise → Contact : la réplique remontait sur la vraie page, le manifeste se lisait deux fois | Expertise ne possède plus que sa plage épinglée. La page Contact démarre dans l'état exact de la réplique |
| Note, filet et axe du manifeste sous la nav sur mobile | Placés au-dessus de la bande de navigation, 320×568 compris |
| React 19 préchargeait 11 images très en aval, en concurrence avec la couverture (LCP) | `fetchPriority="low"` sur les médias de raccord. Seule la photo de couverture est préchargée |
| Expertise : la même photo répétée pour les 7 disciplines | Une étude par discipline, posée par un lavis piloté par le scalaire de scroll (aller = retour) |
| 404 blanche par défaut, coquille vide sans JS | `dynamicParams = false` et `app/global-not-found.tsx` éditorial |
| Partage : canonical relatif, aucune image OG | Images OG/X par langue (vraies polices et vraie photo, `scripts/og-image.mjs`), canonical absolu, theme-color, JSON-LD `Person` |

## Gestes premium ajoutés
- **Rideau de chapitre** (`src/shell/ChapterCurtain.tsx`) : une page d'encre monte avec le chapitre en italique Didone. Le saut et la conclusion des scrubs (`getTween().progress(1)`) ont lieu derrière, puis la page découvre le chapitre déjà composé. Les clics modifiés et `prefers-reduced-motion` gardent le saut natif.
- **Contact** : « Copier l'adresse » avec annonce `role="status"` (l'étiquette tissée n'est pas sélectionnable), et étiquette magnétique sur pointeur fin, ombre à 40 %. Seuls x/y sont écrits ; le scrub garde ses propriétés.
- Barre de défilement fine champagne. Aucun voile gris au toucher sur iOS.

## Non vérifié / à suivre
- Pas d'iPhone réel ni de Safari WebKit (bibliothèque système absente du conteneur). À contrôler sur appareil : rideau, sommaire, couture du manifeste.
- Pas de trace de performance sur appareil moyen de gamme. Le lavis Expertise repeint un masque (une couche) pendant les transitions seulement.
- Journey : pendant les roulements de chiffres, deux mots de chapitre se chevauchent brièvement. C'est voulu en mouvement, mais à juger en vidéo.
- `experimental.globalNotFound` est expérimental dans Next 16.3 : à revalider à chaque montée de version.

## Légendes des visuels (décision du propriétaire, 2 nov. 2026)
Le site ne mentionne plus « image générée ». Il emploie la légende de presse standard, qui ne fait pas passer les visuels pour de vraies campagnes des marques citées :
- FR : « Photo d'illustration »
- EN : « Illustrative photograph »
- KO : « 연출 이미지 »

Le dossier des visuels `public/media/generated/` est renommé `public/media/portfolio/`, car il apparaissait dans chaque adresse d'image.

