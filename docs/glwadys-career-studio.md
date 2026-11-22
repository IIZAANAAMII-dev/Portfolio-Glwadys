# Glwadys Career Studio — publication GitHub Pages

**Projet source** : [Portfolio-Glwadys](https://github.com/IIZAANAAMII-dev/Portfolio-Glwadys)

## Lancer le site sans Vercel

1. Ouvrir `Settings → Pages` sur le dépôt GitHub.
2. Dans `Build and deployment → Source`, choisir **GitHub Actions**.
3. Dans `Actions`, ouvrir le workflow `Glwadys - Portfolio and Career Studio (GitHub Pages)` et cliquer **Run workflow** si aucun déploiement n'est lancé.
4. Attendre l'état **success** des jobs `build` et `deploy` et tester dans un navigateur.

Adresses attendues une fois la publication confirmée :
- Portfolio : https://iizaanaamii-dev.github.io/Portfolio-Glwadys/fr/
- Job Hub : https://iizaanaamii-dev.github.io/Portfolio-Glwadys/job-hub/

**Attention** : les liens ci-dessus ne constituent pas une preuve que GitHub Pages est activé.

Le workflow effectue un export statique Next.js de trois langues. Si cet export échoue, il publie au minimum le Job Hub autonome. La branche main utilisée par Vercel garde sa configuration Next.js normale : `output: export` n'est activé que pour GitHub Pages.

Le flux JSON est généré 2 fois par jour via les API publiques Remotive et Arbeitnow. Les annonces Remotive sont fournies avec retard et doivent pointer vers leurs pages originales. Les autres plateformes (France Travail, APEC, LinkedIn, Indeed, etc.) sont interrogées via des recherches externes ouvertes dans le navigateur ; aucun scraping non autorisé n'est réalisé. Le choix d'une offre et l'envoi d'une candidature restent manuels.

## Vie privée et qualité

Le Job Hub n'envoie pas les informations de candidature sur un serveur : le tableau est stocké dans le navigateur de l'appareil. Pour changer d'appareil, exporter/importer la sauvegarde JSON. Aucun CV avec coordonnées n'est publié dans le code source.

Les corrections des dates et statuts dans `src/content/index.ts` proviennent du CV transmis par Glwadys. Le contenu créatif du portfolio reste à vérifier avec elle avant un envoi massif aux recruteurs (notamment les résultats des projets et les langues revendiquées).

Pour tester : ouvrir `public/job-hub/index.html` après déploiement ou le fichier autonome local fourni.
