# Skills Audit

> Phase 1 du brief. Objectif : ne pas supposer qu'un skill est installé, chercher réellement,
> installer ce qui sert, **lire** ce qui est installé, et distinguer honnêtement
> « installé » de « réellement utile ».

Registry utilisé : `npx skills find` (https://skills.sh/), via le skill `find-skills`.
Installation : niveau projet, dans `.agents/skills/` (+ symlink `.claude/skills/`).
L'installation globale a été refusée par le CLI dans cet environnement
(`PromptScript does not support global skill installation`).

---

## 1. Requêtes effectuées

`gsap animation` · `react three fiber` · `threejs webgl` · `awwwards` ·
`creative frontend design` · `webgl shader glsl` · `web design` ·
`playwright visual testing` · `editorial typography` · `smooth scroll`

---

## 2. Déjà présents avant le projet (non réinstallés)

Le pack officiel GreenSock était déjà installé au niveau utilisateur
(`greensock/gsap-skills`, 47.9K installs) : `gsap-core`, `gsap-timeline`,
`gsap-scrolltrigger`, `gsap-plugins`, `gsap-react`, `gsap-performance`,
`gsap-utils`, `gsap-frameworks`.

C'est la source la plus fiable du projet : officielle, et elle couvre exactement
ce dont dépend l'architecture (ScrollTrigger, timelines, Flip, SplitText,
`gsap.matchMedia()`, cleanup React, performance).

---

## 3. Installés

| Skill | Installs | Pourquoi |
|---|---|---|
| `vercel-labs/agent-skills@web-design-guidelines` | 558.5K | Officiel Vercel. Grille de revue UI/UX/a11y, utilisée en phase QA. |
| `enzed/r3f-skills@r3f-fundamentals` | 1.2K | Setup Canvas, `frameloop`, disposal, fuites de contexte WebGL. |
| `enzed/r3f-skills@r3f-textures` | 1.1K | `colorSpace` sRGB, anisotropy, mipmaps, cover-fit : critique pour afficher des photos sans les dénaturer. |
| `enzed/r3f-skills@r3f-animation` | 1.2K | `useFrame`, damping, pilotage depuis une valeur externe sans re-render React. |
| `enzed/r3f-skills@r3f-shaders` | 1.2K | `shaderMaterial`, uniforms sans re-render, cover UV. Pour l'effet signature. |
| `enzed/r3f-skills@r3f-lighting` | 1.1K | Lu pour **confirmer qu'on n'en a pas besoin** (voir §5). Conclusion utile. |
| `freshtechbro/claudedesignskills@web3d-integration-patterns` | 2.1K | Ciblé par le brief. Valeur réelle moyenne (voir §6). |
| `freshtechbro/claudedesignskills@modern-web-design` | 2.1K | Checklists accessibilité + performance. |
| `jakubkrehel/skills@better-typography` | 9.8K | Le meilleur skill du lot pour ce projet. Règles typographiques précises. |
| `devmartinese/awwwards-animations-skill@awwwards-animations` | 2.2K | Ciblé par le brief. Bon sur l'intégration Lenis↔ScrollTrigger. |

---

## 4. Écartés délibérément

| Skill | Raison |
|---|---|
| `locomotive-scroll` | On utilise Lenis. Locomotive v5 est de toute façon bâti sur Lenis. |
| `motion-framer`, `react-spring-physics` | Le brief interdit explicitement les « animations Framer Motion génériques ». Une seule bibliothèque d'animation : GSAP. Éviter deux libs qui animent la même propriété. |
| `babylonjs`, `playcanvas`, `aframe-webxr`, `spline-interactive`, `rive-interactive`, `lottie-animations`, `pixijs-2d` | Hors stack. |
| `r3f-physics`, `r3f-geometry`, `r3f-loaders`, `r3f-postprocessing` | Pas de physique, pas de modèles GLTF, géométrie = plans. Post-processing non justifié au vu du budget perf. |
| `blender-web-pipeline`, `substance-3d-texturing` | Aucun asset 3D à produire. |
| `barba-js` | Site mono-page, pas de transitions inter-pages. |
| `scroll-reveal-libraries` | « fade-up systématique » est un anti-pattern du brief. |
| Les ~10 autres skills « awwwards-* » | 3 à 35 installs, auteurs inconnus. En dessous du seuil de confiance recommandé par `find-skills` (< 100 installs = prudence). |
| `playwright-visual-testing` | Playwright est utilisé directement. Le skill n'apportait pas de méthode supérieure. |

---

## 5. Ce que la lecture a réellement changé dans le plan

Les points ci-dessous ne sont pas des résumés : ce sont des décisions modifiées
**parce que** la documentation a été lue.

1. **Pas de lumières dans la scène 3D.** `r3f-lighting` confirme que
   `meshStandardMaterial` applique un calcul d'éclairage qui dénature une photo
   sur un plan plat. Décision : `meshBasicMaterial` (ou `ShaderMaterial`) partout,
   **zéro light**, zéro shadow map. Gain de perf gratuit et rendu photographique juste.

2. **`texture.colorSpace = THREE.SRGBColorSpace` est obligatoire.** Sans cela les
   images apparaissent délavées/désaturées dans le canvas et ne raccordent pas
   avec les mêmes images en DOM — ce qui **casserait la transition sans flash**
   qui est le cœur de l'ACT 04. C'est le détail technique le plus important
   découvert dans cette phase.

3. **`frameloop="demand"` + `invalidate()`** plutôt qu'une boucle continue :
   la scène ne rend que quand le scroll la fait bouger.

4. **Piloter la 3D par une `ref`, pas par un state React.** GSAP écrit dans
   `scrollRef.current`, `useFrame` le lit. Zéro re-render React pendant le scroll.
   C'est précisément le contraire de l'architecture « store central » qui a échoué
   dans les tentatives précédentes du repo (voir §7).

5. **Cover UV en shader** plutôt qu'un ajustement de géométrie : permet de changer
   le ratio d'un plan sans déformer l'image.

6. **`gsap.matchMedia()` et non `ScrollTrigger.matchMedia()`.** Le skill
   `awwwards-animations` propose la seconde forme ; elle est dépréciée. Le skill
   officiel `gsap-core` fait autorité ici. Contradiction relevée, arbitrée en
   faveur de l'officiel.

7. **`useGSAP({ scope })` systématique + `contextSafe()`** pour tout handler.
   Résout le double-mount StrictMode et évite les sélecteurs qui fuient d'un acte
   à l'autre — cause probable des « sections fantômes » de l'historique.

8. **Typographie :** poids < 300 réservés au display ≥ 28px ; `1.1` de
   `line-height` pour les titres et **au moins 1.4 dès 3 lignes** ; letter-spacing
   négatif au grand corps, positif sur les petites capitales ; mesure plafonnée
   à 60–75 caractères ; `text-wrap: balance` sur les titres, `pretty` sur les
   descriptions. Ces valeurs sont reprises telles quelles dans les tokens.

9. **`will-change` seulement pendant l'animation**, jamais en permanent.

---

## 6. Évaluation honnête de la valeur réelle

Installer n'est pas utiliser, et tous les skills ne se valent pas.

- **Forte valeur :** le pack officiel `gsap-*`, `better-typography`,
  `r3f-textures`, `r3f-fundamentals`, `r3f-shaders`.
- **Valeur moyenne :** `awwwards-animations` (le câblage Lenis↔GSAP↔ticker est
  correct et directement réutilisable ; le reste du repo part vers de
  l'audio-reactive et de l'art algorithmique hors sujet), `modern-web-design`
  (checklists correctes mais génériques), `web-design-guidelines` (utile mais
  c'est surtout un pointeur vers une URL à fetcher au moment de la revue).
- **Faible valeur réelle :** `web3d-integration-patterns`. Malgré son nom, il ne
  traite **pas** le problème dur du projet — faire correspondre au pixel un
  `getBoundingClientRect()` DOM à un plan WebGL. Il propose surtout des patterns
  génériques, du Zustand, de l'OrbitControls et du Framer Motion 3D, tous
  contraires aux contraintes du brief. Ses seuls apports retenus :
  `frameloop="demand"` / `invalidate()`, et l'avertissement sur les conflits
  d'animation entre deux libs.
- **Le point technique décisif ne vient pas des skills** mais de la recherche
  créative : la formule de FOV qui rend 1 unité WebGL = 1 pixel CSS
  (voir `creative-research.md` §5). Sans elle, la transition DOM→WebGL ne peut
  pas être exacte.

---

## 7. Enseignements de l'historique du repo

Le repo contenait 20 commits de tentatives antérieures, effacées par un commit
`suppr`. Leur audit (`docs/AUDIT.md` de l'époque, récupéré via git) liste
10 problèmes. Trois sont structurels et dictent l'architecture actuelle :

1. Un **Canvas WebGL global** piloté par un **store central**
   (`currentChapter` + `camera`) → scènes 3D visibles hors de leur section,
   caméra qui garde sa dernière cible, « jumps ». Le brief interdit désormais
   le canvas global : c'est la bonne leçon, et elle est confirmée par les faits.
2. **Désynchronisation chapitre ↔ scène** : plusieurs sections oubliaient
   `setChapter`, la navigation était fausse. Cause racine : un état global
   dupliquant une information que le scroll possède déjà.
3. **GSAP éclaté dans 3 `useEffect`** dans l'Opening → conflits.
   D'où la règle : **un acte = une timeline = un `useGSAP` scopé**.

Le contenu réel (identité, projets, parcours, contacts) a été récupéré depuis
`docs/legacy-content-inventory.md` de l'historique et est la source de vérité
de `src/content/`. Deux écarts entre le brief et ce contenu ont été arbitrés
avec la propriétaire du projet : localisation **Marseille ↔ Seoul** (et non
Paris ↔ Seoul), et **Marseille Girls Club** (et non Miss Girl Club).
