# Original-first — carte de préservation

Base observée : `d4fefe2`, branche `jarvis/glwadys-original-flagship`. Le commit
de mission `c893d4c` ajoute la documentation, pas une autre base de site.
Une seule plume dans ce worktree. Aucun import de la refonte V14, aucun commit,
push, merge ou déploiement. Cette carte est écrite avant les modifications du
code. Elle décrit un contrat de travail, pas une validation esthétique.

## Sources et invariants

Lecture : `AGENTS.md`, mission 00, `docs/motion-system.md`, `docs/storyboard.md`,
`docs/creative-direction.md` (archive), `docs/creative-notebook-direction.md`
(direction active), tous les actes, shell, catalogue et dictionnaires.
Guides Next locaux : composants client/serveur, lazy loading, images et polices.
Les captures et films conservés dans `docs/legacy-motion/` sont les références
visuelles ; les nouvelles preuves iront dans `qa/original-flagship-v1/`.

KEEP signifie conserver la séquence, son sens et ses médias. ENHANCE signifie
modifier son échelle, sa cadence ou sa composition dans les fichiers existants.
REPAIR signifie rendre son état déterministe, lisible et accessible.

Invariants : chocolat / ivoire / bordeaux, Bodoni Moda / Inter Tight / Kalam,
Noto Sans KR fonctionnel, médias originaux, nom et thèse de Glwadys, périodes,
lieux, rôles, neuf scènes dans le même ordre. Les images du catalogue sont une
série conceptuelle générée, pas des livrables clients authentifiés. Cette nature
doit devenir visible près des projets. Aucun chiffre ni résultat ajouté.
Le contenu indique Paris ↔ Seoul ; la mission mentionne Marseille ↔ Séoul.
On préserve les données existantes, y compris la disponibilité à Marseille.

## Partition à préserver

| Scène / séquence signature | Chemin d'origine et pilote | Décision et modification autorisée |
| --- | --- | --- |
| 01 Opening : filet, deux noms dispersés puis resserrés, fragments, déploiement de la couverture | `ActScrollStory/index.tsx`, `intro`; `.nameFirst`, `.nameLast`, `.openingFrame`, `openingMedia` | KEEP + ENHANCE. Même DOM opening/hero, vraie révélation masquée, noms plus présents, atterrissage lisible, navigation au terme de l'intro. REPAIR masques qui rognent les glyphes, bas contraste du nom et conflit intro/scroll. |
| Hero immobile comme couverture éditoriale | même acte ; `heroFrame`, `heroVertical`, tagline, disciplines, méta | KEEP + ENHANCE. Une capture doit porter identité et métier sans mouvement. Deux images mobiles recomposées ; conserver le contraste de taille. |
| Couverture → page ivoire : les noms se retirent, un vertical survit, le papier se déplie depuis l'image | timeline `tl`, `T.heroHold` → `T.socialIn`; `data-device`, `data-page-surface` | KEEP. Ne pas substituer une disparition en fade ni recréer le vertical. REPAIR mesures et reprise après resize. |
| Contenu : dominant, intention, deux satellites numérotés, détail puis inversion de hiérarchie | `T.socialIn`, `T.detail`, `T.invert`; `socialSatellites` | KEEP + ENHANCE. Composition portrait avec zones distinctes pour texte et images, sans superposition subie. |
| Front → Behind : fermeture des tirages, recul du dominant, révélation des coulisses et des cinq strates | `T.behindIn`; `behindMedia`, `data-behind`, `data-layer-row` | KEEP + REPAIR. Donner des plages lisibles au titre, moodboard et liste ; aucun plan persistant externe. |
| 03 Naissance du téléphone autour du média, absorption des tirages, bezel, rayon calculé, boutons et island | `T.phoneIn`; `.device`, `.screen`, variables `--phone-*` | KEEP + ENHANCE. Device de face et stable ; dimensionner depuis la hauteur ET la largeur mobile disponible. |
| Feed : véritable défilement interne | `T.montage`, `.feed`, `phoneFeed` | KEEP. Quatre beats toujours présents. |
| Focus : arrêt du montage et cadrage, rail actif | `.focus`, `data-focus-image`, `data-phone-rail-item` | KEEP + ENHANCE. Relier chaque beat à une courte intention éditoriale plutôt qu'à un effet gratuit. |
| Story : masque plein écran et format vertical | `.story`, `phoneStory`, même timeline | KEEP. Le nouveau format arrive dans l'écran existant. |
| Campagne → portail : immobilisation, approche, disparition du cadre, géométrie exacte DOM/WebGL | `T.transfer` → `T.screenFull`, `setStageAnchor('screen')`, `film.ts` plan `screen` | KEEP + REPAIR. Pas de photo WebGL pendant le montage précédent ; DOM reste disponible si WebGL lent/absent. Un seul pilote, synchronisé sur le playhead scrubé, pas le scroll brut. |
| 04 Immersion : séparation, plans en perspective, passages proches, circulation, résolution | `STAGE_STEPS`, `StageScene.tsx`, `film.ts` `screen`, `gallery-*`, `raw-*` | KEEP + ENHANCE + REPAIR. Vraie profondeur desktop dans une fenêtre bornée. Mobile : composition DOM avec les mêmes médias et progression, sans WebGL lourd. Les plans se résolvent dans les emplacements de `ArchivePlate`. |
| Immersion → processus : l'espace devient une planche papier | `galleryLayout.ts`, `ArchivePlate.tsx`, début `ActProcess` | KEEP + REPAIR. Même géométrie de sortie, puis Canvas caché et ressources libérées. Aucun canvas au-dessus du titre du processus. |
| 05 Planche contact : huit tirages, rail desktop, index et légendes | `ActProcess/index.tsx`, `P.contact`, `contactRail`, `contactSheet` | KEEP + ENHANCE. Portrait : une planche verticale composée, pas un rail latéral rétréci. |
| Sélection / intention : un tirage retenu, les autres reculent | `P.intention`, `data-intention-media` | KEEP + ENHANCE. Choix perceptible ; le mouvement range la matière. |
| Intention → système : les cinq tokens prennent la grille | `P.system`, `TokenArtifact`, `data-system-*` | KEEP + ENHANCE + REPAIR. Raccord de mise en ordre tangible, pas des photos flottantes sur les tokens. Tokens entièrement lisibles à 320 px. |
| Méthode : six étapes, un mot et un média actif, ligne progressive | `P.method`, `strategy.steps`, `data-method-*` | KEEP + ENHANCE. Contraste réel des lignes, mot lisible, états sans chevauchement ; même vocabulaire Audience → Campaign. |
| Campaign → Sélection → Yuna | dernier `data-method-visual`, `P.work`, `data-work-proof`, `ActWork` premier média | KEEP + REPAIR + ENHANCE. Faire survivre le cadrage Yuna 4:5 ; même point focal et cadre au raccord. Ne pas sélectionner une planche contact puis prétendre que c'est le même cliché Yuna. |
| 06 Yuna : cadrages silencieux, macros, balayage lumineux, dossier | `ActWork/index.tsx` branche `yuna`, `yunaMedia`, `EditorialZoom` | KEEP + ENHANCE. Précision, aucune rotation gratuite ; conserver les faits et ajouter une décision de présentation clairement qualifiée. |
| MGC : tirages décalés, collage puis alignement, dossier | même acte branche `mgc`, `mgcMedia` | KEEP + ENHANCE. Énergie collective distincte ; recomposition portrait et copie sans images dessus. |
| Comptoir : macro continu, texte inverse, preuves retail | branche `comptoir`, `comptoirTexture`, `comptoirMedia` | KEEP + REPAIR. Réduire la concurrence texture/texte et préserver le rôle retail, sans inventer une campagne. |
| Folio → parcours : trois tirages, fil qui rejoint le playhead, retrait des médias | `WorkJourneyBridge.tsx`, timeline 0 → 1 | KEEP + REPAIR. Fil rejoint réellement le repère (28 % desktop, marge mobile), aucune rémanence. |
| 07 Parcours : années 2021–2026, focus actif, playhead, photos et progression | `ActJourney/index.tsx`, `driver.value`, `updateFocus`, `track` | KEEP + ENHANCE. Cadence permettant de lire six jalons ; progression liée à la vraie géométrie du rail. Portrait vertical, pas un CV desktop écrasé. |
| Parcours → expertise : feuille ivoire qui balaie le rail | `data-journey-handoff` | KEEP + REPAIR. Copie visible et noms sans clipping. |
| 08 Expertise : index typo, contextes, soulignements, feuille qui se contracte | `ActExpertise/index.tsx`, `listViewport`, `data-expertise-sheet` | KEEP + REPAIR. Numéros et contextes accessibles, masque ne coupe pas les mots essentiels. |
| 08.5 Manifeste → 09 Contact : même page, grands mots, retour du nom, liens | `ActContact/index.tsx`, `manifestoTl`, `contactTl` | KEEP + REPAIR. Garder le manifeste dans le Contact, pas en dixième scène ; finir sur nom/email réellement lisibles à 320 px. |
| Navigation née de l'ouverture puis CTA final | `BottomNav.tsx`, `SHELL_EVENTS`, cinq `TARGETS` | KEEP + REPAIR. Cinq destinations tactiles ≥44 px, safe-area, trois langues accessibles, contact final sans perte de navigation. Corriger l'observation de `act-immersion` absent. |

## Cause exacte de l'occlusion WebGL d'origine

1. `ActScrollStory` écrit `setStage()` dans `ScrollTrigger.onUpdate`. À la
   sortie en avant, `progress === 1`, donc `t === 3` et `wantsStage === true`.
   Il n'y a ni `onLeave` ni condition `self.isActive` ni sortie sur le playhead.
2. `ActProcess`, `ActWork`, `WorkJourneyBridge`, `ActJourney`, Expertise et
   Contact n'appellent aucune API de scène. Ils ne font donc jamais avancer ou
   libérer ce temps figé. Le cleanup de Story n'arrive qu'au démontage/resize.
3. Dans `film.ts`, les six `raw-*` sont visibles à `t=3` et leur intervalle
   numérique court jusqu'à 7 ou 7.6. Ce sont des bornes de film, pas des bornes
   DOM : `PLANE_RANGE` ne peut pas détecter la sortie du chapitre réel.
4. `StagePlane.useFrame()` lit `t`, mais ignore `stageState.live` et tout
   propriétaire. Un changement de taille ou une arrivée de texture peut
   redessiner le dernier état visible, même après une extinction logique.
5. `StageLayer` demeure montée à vie ; sa couche est `position:fixed`,
   `z-index:20`, `data-stage-live` reste vrai. Les z-index internes du DOM ne
   garantissent pas que chaque mot et CTA soit au-dessus de cette couche.
   Le fade CSS de 180 ms autorise aussi un chevauchement lors d'une sortie.
6. Les warnings de chargement/visibilité sont des traces de diagnostic laissées
   en production. Les trois tiers sont tous chargés, y compris des plans de
   projets qui ne sont pas pilotés. Une texture arrivant après le cleanup est
   ajoutée à `owned` après sa boucle de disposal : fuite possible.
7. L'ancre écran est mesurée dans le `onUpdate` du ScrollTrigger avant que le
   scrub DOM soit nécessairement arrivé au même temps. Les deux rendus peuvent
   donc dévier pendant les changements rapides de direction.

Preuves historiques : `desktop-scroll-08.png` (Système),
`mobile-scroll-08.png` (méthode), `desktop-scroll-14.png` (Comptoir), dans
`docs/legacy-motion/`. Même constellation de photos dans trois chapitres
différents : ce n'est pas un nouveau raccord, c'est le dernier état 3D figé.

## Contrat de réparation

- Une ownership explicite `story`, revendiquée seulement pendant le raccord
  et l'immersion. Ni Process, ni les projets, ni le parcours ne possèdent le
  Canvas. Échantillonner le temps de la timeline rendue après ses transforms.
- Libérer en avant, en arrière, au démontage et au changement de contexte.
  Une libération périmée ne peut pas éteindre un autre propriétaire.
- Quand la scène est inactive : wrapper immédiatement invisible, meshes
  `visible=false`, alpha zéro, ancre supprimée et temps réinitialisé.
  Pas de fade de sortie au-dessus des CTA.
- Sortie de l'immersion sur un jumeau DOM de la composition plate ; ne pas
  rendre les photos du processus dans WebGL après cette sortie.
- Canvas conservé seulement pour les retours proches, puis démonté avec
  disposal explicite des textures ; pas de chargement des tiers inutiles.
  Aucun contexte WebGL sur petit écran ou en mouvement réduit.
- Un fallback DOM intégral reste lisible si le contexte ne se crée pas ou se
  perd ; la copie et les liens n'attendent jamais les textures.

## Examen demandé

Commandes techniques, ouverture multi-états, au moins 18 progressions desktop
et 390×844, captures 320×800, vrais films de scroll, retours, resize,
navigation mobile, FR/EN/KO, reduced motion, absence de débordement et de
photos au-dessus du texte après sortie. Le rapport 02 donnera les chemins
exacts, les limites, les défauts restants et la matière pour le jury Astra.
Le builder ne s'attribue aucun PASS ni aucune note Awwwards.
