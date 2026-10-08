# Mission Jarvis — Portfolio Glwadys · ORIGINAL FIRST / AWwwards Flagship

## Autorité et modèle

**Commande explicite du propriétaire : « Garde la base que j'avais faite, mais rends-la Awwwards, impressionnante, 10/10. Utilise les modèles payants. »**

Cerveau builder **GPT-6.1 Sol, raisonnement MAX**, via la session Codex connectée à l'abonnement ChatGPT (pas API). Jury indépendant **GPT-6 Astra MAX** en lecture seule sur des preuves réelles.

Le site original est le point de départ ET la base de référence : commit `d4fefe2` sur `main`, travail exclusivement dans la branche isolée `jarvis/glwadys-original-flagship`. La refonte alternative `jarvis/awwwards-rebuild` est une référence à consulter sélectivement, **elle ne doit pas devenir la nouvelle base**. Aucun push sur main, merge, déploiement ou mise en production publique.

## Principes non négociables

1. **Conserver les 9 actes et leur narration originale** : Opening, Contenu/social, Téléphone/Feed/Focus/Story/Campagne, Immersion/profondeur, Processus/moodboard→intention→système→méthode, Projets, Parcours, Expertise, Contact. Respecter les fichiers `src/acts/*` et les médias de départ ; une suppression de chapitre exige une justification explicite et une validation ultérieure.
2. **Conserver le langage original de la DA** : fond chocolat/crème/bordeaux, très grande typo éditoriale, photos et matières, tension studio premium. Plus de spectacle, pas un site vitrine générique.
3. **Conserver et perfectionner l'animation GSAP existante** : l'ouverture typographique multi-temps, les raccords images/front→behind, le téléphone monté au scroll, le studio créatif (moodboard, sélection, campagne), les vrais raccords entre les actes, la ligne active du Parcours, le Contact final. Optimiser les easings, masks, crops, timeline labels, scrub, cadence et raccords. Préserver les animations inversables.
4. **Corriger les défauts sans détruire la base** : l'ancienne WebGL StagePlane gardait des photos flottantes au-dessus des projets et du texte. Correction indispensable : chaque média a une ownership temporelle, disparaît après son acte, nettoyage des ressources, priorité au texte et aux CTA; fin de rémanence et d'occlusions sur desktop/mobile. Réduire le coût GPU, warnings et longues sections inutiles.
5. **Mobile premium véritablement indépendant** à 390×844 et 320×800 : même émotion mais compositions, durées, cadrages, tailles de texte, navigation et gestes spécifiquement écrits pour le tactile. Les cinq destinations accessibles, les petits écrans sans débordement, nav fixe ne cache rien. Pas de WebGL lourd si non fiable sur mobile ; fallback qui garde la narration. `prefers-reduced-motion` complet.
6. **Valeur professionnelle de Glwadys** visible rapidement : derrière les effets, toujours une décision éditoriale de communication, un rôle concret, une preuve honnête pour chaque projet. Les visuels conceptuels restent identifiés, pas de faux chiffres ni de résultats inventés.

## Départ obligatoire — regarder ce qui existait

Avant toute refonte, lire :
- `AGENTS.md`, `docs/motion-system.md`, `docs/storyboard.md`, `docs/creative-direction.md` et `docs/creative-notebook-direction.md`;
- `src/lib/gsap.ts`, `src/lib/motion.ts`, `src/shell/stage/*`, `src/acts/ActScrollStory/index.tsx`, `src/acts/ActProcess/index.tsx`, `src/acts/ActWork/*`;
- les captures réelles et vidéos dans `docs/legacy-motion/`;
- le comparatif V14 sur une autre branche seulement pour les améliorations de QA utiles, notamment le handoff exact au projet Yuna et la navigation mobile.

Le studio dispose d'un audit visuel de l'ancien site avec preuves : ouverture héro monumentale, smartphone au centre et changement de contenu, galerie en profondeur. **Le défaut central est la rémanence de photos WebGL au-dessus de la copie** : ne jamais rendre ce bug à nouveau visible. Le site original faisait environ 28 088 px desktop et 23 967 px mobile après montage; une révision du rythme est possible, mais ne pas réduire l'histoire à quelques cartes statiques.

## Plan d'exécution par étapes (une seule plume)

### A — Contrat de préservation + P0 de la scène persistante
Cartographier les 9 actes, les vidéos/images, les timelines GSAP existantes et la ownership des plans Three.js. Écrire `docs/flagship/01-preservation-map.md` indiquant KEEP / ENHANCE / REPAIR. Corriger en priorité les plans photo qui débordent d'un acte et masquent textes/CTA; conserver le rendu 3D seulement si circonscrit proprement, pas de fausse promesse.

### B — La signature cinématique et la narration des projets
Mise en scène de l'Opening d'origine, amélioration de la transformation de l'image vers le téléphone, des étapes de montage et de la planche contact; créer une continuité visible vers Yuna qui garde son cadrage sélectionné ou explicite la déclinaison de format. Accentuer les différences de personnalité Yuna / Marseille Girls Club / Comptoir. GSAP ScrollTrigger, Flip, SplitText si utiles et déjà présents. Sur mobile, même puissance mais sobriété et bon rythme.

### C — Finition réelle et QA
Vérifier l'interactivité clavier/tactile, scroll rapide/inversé, resize, navigation, URL/langue FR/EN/KO, loading media et reduced motion. Contrôler avec capture réelle, jamais une autoévaluation « perfect ».

## Barrière technique et visuelle

Avant de demander PASS :
- `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check` ;
- parcours complet en navigateur headless + vidéos desktop 1440×900, mobile 390×844 et 320×800; captures de **chaque acte et états intermédiaires au scroll** (au moins 18 états desktop et mobile);
- zéro texte ou CTA masqué par la scène WebGL; disparition des plans flottants à la sortie de leur acte;
- cinq destinations de navigation sur mobile, cible interactive 44 px, scrollWidth exact, safe-area, aucun élément mobile crucial sous la nav;
- reduced motion, clavier/focus, reverse scroll et retour en milieu de séquence, resizes, navigation interne, médias et gestion erreurs;
- rapport `docs/flagship/02-build-and-visual-review.md` avec écarts et vrais fichiers de preuves;
- **Aucun PASS 10/10 autoattribué**. Le jury Astra vérifie les captures et la vidéo, et peut rouvrir un acte. Le vrai succès ne peut être garanti par un seul build.

## Limites

Ne pas toucher au répertoire original main `/home/jarvis/workspace/audits/Portfolio-Glwadys`, ni à l'autre refonte; conserver exactement les médias originaux et tous les contenus vérifiables. Pas de push/merge/déploiement depuis le builder avant revue du mentor; les pushes de preuve sur cette branche isolée seront gérés après validation.
