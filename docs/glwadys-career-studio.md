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


## CV premium / ATS — direction artistique commune

Le CV, le portfolio et le Career Studio utilisent désormais la même palette (ivoire #FAF8F6, encre #24242A, bordeaux #9B495C) et des caractères éditoriaux. Le dossier CV statique est `public/cv/index.html`.

Le workflow construit automatiquement trois fichiers dans `public/cv/` : `CV_Glwadys_Dalleau_Premium_2026.pdf`, `CV_Glwadys_Dalleau_Communication_ATS.pdf` et `CV_Glwadys_Dalleau_Retail_ATS.pdf`. Les PDF sont également joints en artifact à l'exécution GitHub Actions pendant 30 jours, même si GitHub Pages n'a pas encore été activé. Les versions ATS sont en une colonne, contiennent du texte sélectionnable, et n'affirment pas de résultats de ventes non mesurés. Les chiffres 24 mois, 5 expériences et 3 univers décrivent le parcours uniquement.

**IMPORTANT — Première mise en ligne GitHub Pages** : un administrateur doit activer Source = GitHub Actions sur [Settings → Pages](https://github.com/IIZAANAAMII-dev/Portfolio-Glwadys/settings/pages). Le `GITHUB_TOKEN` standard ne peut pas créer le service Pages lorsqu'il est désactivé. Après activation, relancer [le workflow](https://github.com/IIZAANAAMII-dev/Portfolio-Glwadys/actions/workflows/glwadys-pages.yml) et vérifier que build et deploy sont au vert. Liens attendus : `/fr/` (portfolio), `/cv/` (CV) et `/job-hub/` (application).

**Vercel** : l'espace connecté automatiquement par l'API est l'équipe Pro. Ne pas y déployer l'app si le but est le compte personnel Hobby. Le déploiement Hobby nécessitera de sélectionner explicitement cette portée dans l'interface Vercel ou de reconnecter l'application Vercel au compte personnel, puis lier GitHub ou envoyer les fichiers statiques ; ne pas deviner la cible.
