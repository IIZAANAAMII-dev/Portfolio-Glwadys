# 3D audit — reconstruction spatiale

## Diagnostic

L’ancienne scène mélangeait des coordonnées de chapitres différents dans un Canvas fixe : portrait à l’origine, téléphone à `y=-6.5`, galerie à `y=-12` et constellation à `y=-18`. La caméra suivait plusieurs sections DOM, mais les objets n’avaient pas de directeur commun. Cela créait une impression de cartes flottantes plutôt qu’un espace éditorial.

## Inventaire

| Élément | Composant | Scène | Position / profondeur | Visibilité avant | Trigger / durée | Rôle narratif | Décision |
|---|---|---|---|---|---|---|---|
| Portrait Glwadys | `MediaPlane` | Opening / Identity | `[0, .2, 0]`, primary | visible via canvas fixe | Intro/Hero/Identity | présence et transition portrait → grille | garder, lane primary |
| Story Yuna | `MediaPlane` | Opening | `[3.8, 1.4, foreground]` | trop tôt dans l’ancien système | Hero | média secondaire | garder comme accent, jamais téléphone |
| Moodboard MGC | `MediaPlane` | Opening / Behind | `[-3.6,-1, background]` | trop tôt | Hero/Behind | annoncer Front/Behind | garder, contraste réduit |
| Phone | `Phone` | Social | `[0, -6.5, primary+.5]` | pouvait transparaître | Social pin | anchor du Social World et Camera Dive | visibility gate strict Social |
| Vertical Reel | `MediaPlane` | Gallery | `[-4.5,2,foreground]` | visible hors Gallery | Gallery | hero media X | garder, lane foreground |
| Product Editorial | `MediaPlane` | Gallery | `[4.2,-1,midground]` | visible hors Gallery | Gallery | support media | garder, lane midground |
| Community Essence | `MediaPlane` | Gallery | `[0,3.2,background]` | visible hors Gallery | Gallery | texture de fond | garder, lane background |
| Yuna node | `MediaPlane` | Work | `[-3.2,1.2,primary]` | toujours monté/visible | Work | selected work | gate Work, mouvement réduit |
| MGC node | `MediaPlane` | Work | `[2.8,2,midground+1.2]` | toujours monté/visible | Work | selected work | gate Work |
| Comptoir node | `MediaPlane` | Work | `[3.6,-1.8,background+1.8]` | toujours monté/visible | Work | selected work | gate Work |

## Reconstruction

- `SceneDirector` est désormais la source de vérité : active chapter, active scene et progress.
- `SceneLayer` applique une visibilité stricte aux scènes Opening, Social, Gallery et Work.
- `SPATIAL_LANES` impose Foreground / Primary / Midground / Background / Far avec échelle et contraste associés.
- `CAMERA_PATH` documente les legs de caméra par chapitre. Les sections peuvent interpoler dans un leg, pas inventer des coordonnées isolées.
- Le téléphone est un anchor Social : aucun render visuel avant/après son chapitre.
- La constellation n’orbite plus comme une démo Three.js ; elle respire à peine et n’existe que dans Work.

## Problèmes encore surveillés

- La transition Gallery → Moodboard → Strategy est actuellement surtout DOM ; elle doit devenir la prochaine passe de flattening Z.
- Les textures SVG sont légères mais certaines contiennent des détails très sombres ; une passe asset dédiée pourra produire WebP/AVIF si des bitmap réels sont ajoutés.
