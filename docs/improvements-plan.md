# Improvements plan — Awards pass

## Gardé et renforcé

- Univers noir/or/ivoire, grain, élégance éditoriale, composants de navigation et système de qualité.
- Narration spatiale : portrait, contenus sociaux, téléphone, galerie, stratégie, projets et parcours.

## Supprimé / accéléré

- Inertie excessive Lenis/ScrollTrigger/caméra et séquences sans transformation majeure.
- Visibilité hors-scène de l’ensemble des objets WebGL.
- Hero 180vh à faible enjeu ; passage à 140vh plus dense.

## Recomposition des actes

1. **Intro → Hero** : nom révélé entre trois aperçus média, puis recomposition sur la signature éditoriale.
2. **Identity → Social** : la grille devient les formats sociaux ; Front/Behind reste une lecture contextuelle.
3. **Phone** : acte opaque et pinned, téléphone seul dans le canvas, contenu qui se vide autour et caméra qui entre dans l’écran.
4. **Gallery** : horizontalité DOM synchronisée avec des plans en profondeur, puis sortie vers Brand.
5. **Brand / Strategy / Journey / Work** : seconde passe prévue pour resserrer les textes, mettre les transformations de grille avant l’explication et créer des overlaps média.

## Ajouts réalisés dans cette passe

- Isolation par chapitre des groupes WebGL pour éliminer le téléphone « fantôme ».
- Surface de scène opaque pour Social et Gallery.
- Nouvelle intro courte avec media cards et reveal clip-path.
- Hero compacte avec cadre portrait et montée de dominance au scroll.
- Téléphone enrichi de trois beats de contenu synchronisés au progrès du pin (Feed / Story / Campaign) sans remonter la scène.
- Timeline, stratégie, work et services resserrés avec des overlaps plus courts.
- Case studies Yuna, MGC et Comptoir convertis en mini-séquences pinned, avec entrées simultanées, rotation éditoriale et sortie en profondeur.
- Reconstruction spatiale : `SceneDirector`, lanes de profondeur partagées et `CAMERA_PATH` pour supprimer les placements 3D arbitraires.
- Visibility gating strict : Opening, Social, Gallery et Work ne rendent que leur scène active.
- Curseur piloté par `gsap.quickTo` pour supprimer les tweens concurrents à chaque mouvement souris.
- Paramètres de vitesse globaux et curseur recalibrés.

## Vérifications à poursuivre

- Build TypeScript, viewport desktop et mobile, préférence reduced motion.
- Contrôle d’un vrai screenshot navigateur pour ajuster les proportions, notamment téléphone et cadre portrait.
- Deuxième passe : timeline Journey, case studies et services afin que la seconde moitié conserve le niveau de tension de l’ouverture.
