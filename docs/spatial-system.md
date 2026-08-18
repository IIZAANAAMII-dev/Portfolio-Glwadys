# Spatial System (Système Spatial 3D)

## Concept : "The Creative Layers"
Le portfolio raconte deux plans du travail de Glwadys :
- **FRONT** : ce que le public voit (posts, stories, reels, campagnes).
- **BEHIND** : ce qui structure le résultat (moodboard, planning, stratégie, calendrier).

## Organisation des profondeurs (Z)
| Couche | Z | Usage |
|--------|---|-------|
| Foreground | +2.0 à +4.0 | Badges, cartes actives, UI glass |
| Midground | 0.0 à +1.5 | Headline, portrait principal, sujet actif |
| Background | -1.5 à -4.0 | Médias inactifs, grilles, moodboards |
| Deep Void | -5.0 à -15.0 | Marqueurs temporels, auras, médias lointains |

## Presets de caméra
`src/config/CAMERA_PRESETS.ts` définit les coordonnées de caméra pour chaque chapitre (intro, hero, identity, social, phoneDive, gallery, brand, constellation, finalCallback).

## Axes narratifs
- **X :** scroll horizontal, timeline, travelling de galerie.
- **Y :** scroll naturel, stacking d'expériences, montée/descente.
- **Z :** profondeur, camera dive, zoom, passage devant/derrière.

## Règles
- Aucun nombre magique dispersé dans le code. Les valeurs de profondeur viennent de `src/config/spatial.ts`.
- La caméra est cinématique : lissage exponentiel par frame, `lookAt` animé, FOV progressif.
- Pas de caméra FPS ou de rotations nerveuses.
