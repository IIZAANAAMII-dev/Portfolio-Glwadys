# Assets audit

| Fichier | Dimensions / poids | Usage | Preload | Optimisation |
|---|---:|---|---|---|
| `public/assets/editorial/portrait-glwadys.svg` | SVG, 1.8 KB | Portrait Opening/Identity | au montage Canvas | déjà vectoriel et léger |
| `public/assets/projects/yuna-story.svg` | SVG, 2.0 KB | Story, Phone screen, Gallery, Yuna | au montage scène | réutilisé ; éviter les doublons de texture |
| `public/assets/projects/mgc-scrapbook.svg` | SVG, 1.7 KB | Behind, Gallery, MGC | au montage scène | réutilisé ; conserver vectoriel |
| `public/assets/projects/comptoir-macro.svg` | SVG, 1.5 KB | Gallery, Comptoir | au montage scène | réutilisé ; conserver vectoriel |

## Décision de chargement

- Aucun GLB lourd n’est présent dans `public`; le téléphone est procédural et reste sous quelques meshes simples.
- Les textures ne sont demandées que lorsque leur `SceneLayer` est monté dans le Canvas, avec Suspense global.
- HIGH conserve le Canvas complet ; MEDIUM baisse DPR et effets ; SAFE retire WebGL.
- Une future bibliothèque de photographies raster devra utiliser AVIF/WebP, `srcset`, dimensions réservées et lazy loading hors Intro/Social.
