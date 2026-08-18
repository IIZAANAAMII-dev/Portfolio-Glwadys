---
name: glwadys-awwwards-motion
description: Règles motion et WebGL propres au portfolio Glwadys Dalleau.
---

# Glwadys Awards Motion

## Direction

Conserver la palette charbon/ivoire/or, le grain et la typographie éditoriale. Le prestige vient du montage et de la précision, pas de la surcharge.

## Actes

- Intro : overlay d’entrée court, puis retrait complet du DOM visuel.
- Hero : pin court, headline dominante et recomposition média.
- Social : naissance de la profondeur et du téléphone ; le canvas est perceptible uniquement ici.
- Gallery : travelling horizontal puis axe Y/Z lisible.
- Brand/Strategy : contenu vivant qui se range en système.
- Work/Journey/Services : pins courts, case studies différenciés, sortie calme vers Contact/Footer.

## Règles techniques

### NO UNSTRUCTURED 3D

Aucun élément 3D ne peut être placé arbitrairement. Chaque objet doit appartenir à une scène, un chapitre, une lane de profondeur, une fonction narrative et une transition définie. Si sa raison narrative n’est pas explicable, il ne doit pas être rendu.

- Le `SceneDirector` décide la scène active et les `SceneLayer` appliquent le gating.
- Les lanes sont `foreground`, `primary`, `midground`, `background`, `far`.
- La caméra suit `CAMERA_PATH`; les composants ne doivent pas inventer de trajectoires hors de leur leg.
- Un objet hors scène active est `visible={false}` et ne doit pas transparaître via un fond DOM.

- Un seul Lenis, `ScrollTrigger.update` sur son événement scroll.
- Scrub cible `0.45–0.6`; transition principale `0.45–0.9s`; stagger `0.05–0.1s`.
- Une propriété animée par un seul moteur.
- Utiliser `transform`, `opacity`, `clip-path`; éviter les propriétés de layout.
- Tous les effets GSAP sont scoped et nettoyés par `ctx.revert()` ou `useGSAP`.
- Le faux horizontal doit utiliser `ease: none`.
- Le téléphone appartient à `SceneLayer(scene="social")`; aucune perception en Intro/Hero.
- La scène Social est le premier chapitre 3D fort ; Opening/Identity restent principalement DOM et planes légers.
- R3F : refs mutables dans `useFrame`, textures limitées, DPR adaptatif, fallback SAFE.

## Qualité

- HIGH : canvas complet, caméra et beats téléphone.
- MEDIUM : moins de DPR/effets, même narration.
- SAFE : DOM éditorial, aucune dépendance à la 3D.
- Respecter `prefers-reduced-motion` et réduire les pins/effets sur tactile.
