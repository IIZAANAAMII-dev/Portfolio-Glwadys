# 18 — AUDIT IPHONE RÉEL DU VISITEUR / NOUVEAU SOL 6.1 MAX (2026-10-09)

## Contexte
L'utilisateur a fourni SEPT captures d'écran réelles, réalisées dans le navigateur intégré de ChatGPT sur un iPhone vers 20 h 48. Son verdict : « je vois beaucoup d'erreurs, je n'aime pas les transitions, les animations ni le design de ces sections », carte blanche artistique, TOUS les actes concernés, objectif WOW/Awwwards.

Ce document décrit uniquement ce que les images prouvent ; les captures ne montrent PAS leur animation complète. Il faut reproduire chaque état en WebKit 390×844 et 320×800 et filmer le mouvement réel. Le moteur du navigateur dans le cadre ChatGPT occupe une partie du haut/bas de l'écran : tester le viewport réel et les safe areas.

## P0/P1 d'après les captures (pour reproduction, pas à « réparer » à l'aveugle)

1. **Act 02 / « Ce que l'on voit »** : grand vide en haut, collages superposés sur 3 plans avec photographies qui recouvrent légende/étiquette d'une autre, zone photographique plus haute que large, limites de recadrage incohérentes. Une photographie couvre partiellement un bandeau « Portrait ». Dans une autre frame, la photo centrale très sombre coupe la composition devant la jeune femme en atelier. Mobile exige UN sujet de plan, une grille respirante et un handoff image stable, pas cinq cadres flottants.

2. **Act 02.2 / « Ce qui le tient »** : moodboard et photos au-dessus du titre mais double usage de la même image d'atelier vue plus tôt ; les 5 rangées Moodboard/Planning/Copy/Calendrier/Direction deviennent progressivement des textes gris clair de contraste insuffisant puis presque invisibles sur papier ivoire en bas. Ce n'est pas une fin éditoriale intentionnelle mais une perte de lisibilité. Traquer `data` scrub & `opacity` ainsi que masques et gradient pseudo-elements; ne pas simplement augmenter partout opacity quand la scène doit s'effacer au vrai raccord. L'objet doit raconter **l'envers du contenu** sans répéter le carnet méthode.

3. **Act 03 / « Le contenu en situation »** : deux photos de la même étude apparaissent dans un faux iPhone avec décor d'écran noir/overlays et un grand « Focus » italique qui chevauche le bord du téléphone. Le rail Feed/Focus/Story/Campagne est très bas et en concurrence avec la barre de navigation sticky + bouton FR flottant. Niveau de hiérarchie trop chargé, et certains éléments présentent un effet de répétition de mise en page. Le film doit passer d'une réalité sociale à l'autre, pas devenir un mockup générique plein de textes.

4. **Act 04 / « Dans le contenu »** : portrait plein écran d'une personne devant une rue en arrière-plan, recouvert de trois cadres illustratifs presque transparents : stacking sans ordre de lecture, faible contrastes/couches qui font des fantômes, libellé « DANS LE CONTENU » isolé au bas. L'entrée galerie doit être le franchissement d'une seule image-source identifiable, puis un plan final qui physiquement se transforme en contact-sheet d'Act 05. La capture iPhone montre aussi un autre plan de téléphone noir découpant la même rue/photo : analyser le raccord téléphone → immersion pour ne pas réinitialiser l'image.

5. **Act 05 / « Planche contact »** : de grandes images photographiques (main feuilletant planche, crayon et calendrier, femme posant photo) déjà utilisées en actes 02–04 réapparaissent comme quatre cartes presque identiques. Les labels sont à des hauteurs différentes, deux panneaux recadrés, énormément de vide entre certains. La répétition visuelle est perçue comme une duplication de section ; le carnet doit utiliser ces éléments comme **des matières qui se réorganisent en un seul livre** et NON relancer une autre galerie indépendante. Le scrubbing vertical recadre une photo tout en éclaircissant l'autre au point de la rendre blanche, défaut de photo fantôme.

6. **PERSISTENT chrome** : la navigation marron ACCUEIL/PROJETS/PARCOURS/EXPERTISE/CONTACT prend une part substantielle du viewport du téléphone ; le bouton FR+ la surmonte et le bouton noir flottant sur la droite entre dans la lecture. Garder des cibles touch accessibles, mais réduire la gêne et surtout ne jamais laisser CTA/texte clé sous la nav. La capture « Focus » montre « CAMPAGNE » très proche de l'élément FR. Tester 320px, paysage, changement de langue.

7. **DESIGN ACROSS ALL NINE ACTS** : ne pas accepter le simple slogan « film » si une transition est juste un fondu horizontal entre deux sections. Mesurer véritables raccords physiques (même image, même crop, même coordonnées lors de la passation), distinguer plans de lecture et plans de mouvement, regarder reverse-scroll sur WebKit, préserver raccourcis d'accessibilité, distinguer UX mobile (pas desktop empilé).

## Travail imposé à creativelead SOL 6.1 MAX
- Retourner un **audit VISUEL cold read** de chaque acte 01–09 avec des captures *réelles* prise dans Chromium ET WebKit (ne pas utiliser l'outil vision avec un path local qu'il ne sait pas lire : préférer playwright screenshot et browser snapshot, ou inspection directe du DOM et CSS). Donner notes / qualité seulement si assorties de preuves, avec P0/P1/P2.
- Expliquer quels deux paragraphes/sections se répètent réellement et quelles compositions fusionner, renommer ou réécrire ; « Ce qui le tient » = justification brève, « Le carnet » = transformation tangible d'une idée.
- Remettre au builder un plan de 3 PASSES : (1) P0 mobile contrast/overlap/nav/photo, (2) continuous cinematic joins and book, (3) harmonisation whole-site design, motion microinteractions, responsive QA. Pas de compliments gratuits, pas de « 10/10 » déclaratif.

## Travail imposé au builder SOL 6.1 MAX
- Appliquer réellement les 3 passes sur **le code source du seul original worktree**, en conservant la structure de 9 actes si elle reste créativement pertinente. Réutiliser les meilleurs effets de la branche `main` en les intégrant proprement.
- Ne pas « cocher » le projet en se contentant d'une maquette ou d'une note : commits sourcés, screenshots et films avant/après; demandes de review d'un QA distinct si reste P0/P1.
- Charger: `awwwards-godmode`, `editorial-art-direction`, `cinematic-dramaturgy`, `creative-director`, `awwwards-motion-orchestrator`, `gsap-scrolltrigger`, `gsap-performance`, `mobile-native`, `cinematic-qa`.
- `npm run typecheck`, `lint`, `build`, git diff --check ; navigateur WebKit iPhone 390/320 et Chromium desktop 1440/1920, langues FR/EN/KO, reduced-motion, scroll forward/reverse, screenshots. Aucun deploy prod / aucun merge main.

## Execution & trust
- Mode Sol 6.1 via modèle **exact** `gpt-6.1-sol`, fournisseur `openai-codex` (abonnement ChatGPT connecté), profil avec `agent.reasoning_overrides.gpt-6.1-sol=max`. Ne pas basculer silencieusement sur OpenRouter gratuit : une limite doit être explicitement signalée.
- Pas de plusieurs agents *builders* écrivant le même worktree simultanément. Critique indépendante → builder → QA → jury. Ne pas faire déclarer « parfait » par l'auteur des changements.
- URLs Vercel autorisées uniquement en **preview** de branche après tests, jamais prod.
