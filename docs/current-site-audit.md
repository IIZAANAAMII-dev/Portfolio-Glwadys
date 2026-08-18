# Audit du site actuel

Audit réalisé sur l’implémentation locale et sa structure de scènes (18 août 2026). La référence distante n’a pas pu être rendue automatiquement, l’audit visuel est donc complété par le code et les assets réels du projet.

## KEEP

- La palette charbon, ivoire et or, le grain discret, la typographie Playfair/mono et le ton éditorial : c’est la signature la plus distinctive du portfolio.
- Le principe DOM + WebGL, les métadonnées fines et les chapitres de récit sont une excellente base « premium ».
- Les idées de portrait éclaté, de bascule Front/Behind, de plongée dans le téléphone et de galerie X/Y/Z ont un fort potentiel narratif.
- Le système qualité HIGH/MEDIUM/SAFE et les contenus existants doivent rester la colonne vertébrale de la version performante.

## FIX

- Le canvas fixe contenait toutes les scènes simultanément. Avec des sections DOM largement transparentes, le téléphone et les médias pouvaient se lire hors de leur acte. Les scènes WebGL doivent être exclusivement visibles par chapitre.
- Le Lenis à `1.2`, les scrubs à `1.2` et le lissage caméra très faible additionnaient leur inertie : la sensation devenait lente alors que chaque mouvement était élégant isolément.
- La hero était surtout une typographie centrale : elle ne proposait pas assez d’image, de hiérarchie ni de transformation pour justifier son pin.
- L’intro était réduite à une ligne et des métadonnées. Elle ne préparait pas réellement la présence de Glwadys ni la transition vers la hero.
- Les sections Identity/Social/Gallery avaient plusieurs bonnes intentions mais parfois un contenu explicatif qui prend le dessus sur la mise en scène.

## REMOVE / RÉDUIRE

- Les délais de scrub longs, les grands temps morts et les animations « un élément après l’autre ».
- La visibilité permanente des objets 3D hors contexte.
- Les surfaces translucides sur les actes qui doivent masquer une scène WebGL passée.
- Les cartes qui répètent textuellement ce que la mise en scène devrait déjà raconter.

## MERGE

- Intro + hero : une même entrée en deux battements, avec les médias qui annoncent puis encadrent la hero.
- Identity + Social : l’éclatement du portrait devient la grille des contenus ; la section sociale concentre Front/Behind et la séquence téléphone.
- Gallery : le strip horizontal DOM et les plans WebGL ne sont plus deux galeries parallèles mais un unique travelling synchronisé.

## Verdict

La DA n’avait pas besoin d’être remplacée. Le vrai défaut était de réalisation : trop de lissage, de temps de scroll et de couches visibles en même temps. La refonte doit monter en contraste de rythme, mieux isoler les actes et faire de chaque pin un événement clair.

## Clarification de structure

- L’intro est un overlay d’entrée temporaire ; elle ne doit pas devenir une section persistante du parcours.
- Le téléphone 3D est réservé à `02 / UNIVERS SOCIAL`. Le canvas est masqué par chapitre avant et après cette scène.
