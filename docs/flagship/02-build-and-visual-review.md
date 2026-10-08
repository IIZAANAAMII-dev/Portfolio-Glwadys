# V1 — revue technique et visuelle (mentor, REOPEN)

**Base réelle :** original `d4fefe2` → branche `jarvis/glwadys-original-flagship`. Le code a été amélioré sur la base originale, et non remplacé par la V14. **Ce document n'est pas un verdict Astra.**

## Réalisé et vérifié le 8 octobre 2026

- `npm run typecheck`, `npm run lint`, `npm run build` et `git diff --check` : **PASS** lors du contrôle indépendant à 09:52 Europe/Paris. Next 16.3 génère les pages FR, EN et KO.
- V1 Playwright Chromium 151 : **312 captures** en local, dont 18 états de progression à 1440×900, 390×844 et 320×800 ; retours, clics de navigation, scénarios sans WebGL, clavier, mouvement réduit et plusieurs langues.
- Rapport brut `qa/original-flagship-v1/browser-results.json` : **630/640 contrôles observés positifs, 10 échecs**. Il est antérieur à la dernière poignée de modifications à 09:41:51 ; les captures desktop à 09:33 ne sont **pas** des preuves définitives du dernier état du code.
- Les trois formats n'ont pas de débordement horizontal dans les 18 positions testées. Les cinq destinations mobile ont des cibles mesurées >=44px et les navigations sont fonctionnelles.
- La vraie scène Three.js reste active dans le chapitre profondeur sur desktop, mais les captures montrent **aucun Canvas** dans Système, Méthode, Yuna, MGC, Parcours, Expertise et Contact. Sur mobile, la profondeur est recomposée en DOM, sans Canvas.
- Le passage du téléphone au portail, la profondeur, la planche contact, la sélection, la méthode et les dossiers originaux sont encore présents. Ce n'est pas un remplacement par une grille de cartes.
- Aucun message console sur les sessions complètes desktop, 390 et 320. Les sessions de dégradation sans WebGL et de reduced motion ont passé les contrôles enregistrés avant l'interruption du serveur.

## Les dix échecs du rapport brut — pas de maquillage

- **7 liés à la session EN** : six captures avec images non décodées et une console `ERR_CONNECTION_REFUSED`, après interruption du serveur de test. **Inconclusifs** sur le rendu EN réel, à rejouer avec un serveur stable.
- **1 test reverse-campaign** : le harnais exigeait Canvas absent alors que le retour se fait **dans la campagne/portail**, où la scène doit être active. Assertion probablement erronée, à réécrire.
- **1 test de stabilité GPU** : textures `[5,5,4,5,4,0]` après six retours ; le zéro final peut être une capture avant chargement, mais l'absence de fuite n'est **pas prouvée**.
- **1 test de resize** : au Contact après un redimensionnement desktop→mobile→desktop, un Canvas reste monté mais caché (`opacity:0`, `visibility:hidden`, `live:false`). Ce n'est pas une occlusion, mais **le démontage/mémoire doit être corrigé ou démontré**.

## Observations visuelles indépendantes — REOPEN

1. **P0 mobile** : le bouton flottant de langue `FR+` chevauche visuellement la zone du quatrième jalon « CAMPAGNE » dans le rail du téléphone à 390×844 et 320×800. Il faut mesurer les rectangles, puis repositionner le bouton ou libérer la zone du rail.
2. **P1 navigation** : plusieurs captures Work/Yuna/MGC affichent encore « ACCUEIL » actif et « ACT 05 / LE PROCESSUS » dans la navigation alors que le projet est à l'écran. L'observateur de sections doit être contrôlé sur tous les points du scroll et au retour.
3. **P1 lisibilité de transition** : l'état « Ce qui le tient » est trop clair/faible sur le fond ivoire dans une capture du milieu de l'animation ; il faut vérifier le contraste pendant tout le scrub, pas seulement au repos.
4. **P1 expérience** : la DA originale est retrouvée et la scène 3D est réelle, mais la continuité exacte du cadrage Yuna au raccord, la fluidité sur iPhone physique et l'impact du premier scroll n'ont pas été certifiés.
5. **P0 preuves** : aucune **nouvelle vidéo V1** du scroll complet n'a été enregistrée. Les deux WebM du README sont les **films de la version originale**, pas de la V1.
6. **P0 validation** : le jury indépendant Astra MAX n'a **pas** rendu de verdict pour cette V1 ; une tentative de démarrage a été bloquée et l'abonnement Codex a indiqué une limite temporaire. **Pas de PASS Awwwards, pas de 10/10.**

## Suite

Corriger les points P0/P1 dans `04-next-sol-brief.md`, reprendre les captures **après le dernier changement**, enregistrer de vraies vidéos V1, rejouer la QA sans coupure du serveur, puis demander un jury Astra froid. Aucune modification de `main` ni déploiement public. Les captures V1 du README sont **préliminaires**, datées, et ne doivent pas être présentées comme une version finale.
