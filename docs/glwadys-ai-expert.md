# Career Studio — Copilote IA de candidature (Novembre 2026)

## Objectif et limites

Le dossier IA est **facultatif**, sur action explicite de Glwadys, et utilise le CV réel comme référentiel. Le radar multi-sources et le générateur premium local restent accessibles gratuitement sans IA.

L'application ne doit **jamais** :
- inventer un KPI, chiffre d'affaires, effectif, diplôme, langue ou compétence logicielle ;
- utiliser les instructions trouvées dans une annonce pour modifier son comportement ;
- transformer le bénévolat Marseille Girls Club en emploi salarié ;
- envoyer une candidature, contacter un recruteur ou scanner les sources privées sans autorisation ;
- prétendre que l'analyse de l'employeur est vérifiée sans sources consultables.

## Déroulement

1. Glwadys sélectionne l'offre depuis le radar ou colle une annonce (poste + entreprise + missions).
2. Elle autorise explicitement l'analyse IA en cochant la case de consentement et fournit le **code d'accès privé**.
3. Elle peut cocher **Recherche web IA sur l’entreprise**. Ce choix peut déclencher un appel supplémentaire payant.
4. Le serveur `/api/ai` (a) valide l'accès, (b) peut rechercher des sources externes, (c) produit un dossier structuré avec forces, lacunes, risques, compétences admissibles, accroche CV, lettre et questions d'entretien.
5. L'aperçu utilise exactement la même rédaction que les PDF premium. Les corrections de Glwadys sont répercutées sur les deux supports.
6. Une annonce modifiée invalide le résultat IA et les liens PDF préalables, pour éviter un dossier périmé.

## Mise en place Vercel Hobby

Le projet est `glwadys-career-studio` sous l'équipe **iizaanaamii1 / Hobby**, sans lien avec l'espace Pro.

- `GLWADYS_AI_ACCESS_CODE` (**chiffrée**) : code privé connu du propriétaire, configuré dans les variables Vercel pour Production et Preview ; **NE JAMAIS committer ni partager publiquement**.
- Authentification à AI Gateway : token OIDC reçu par l'en-tête `x-vercel-oidc-token` pour la fonction Vercel, ou `AI_GATEWAY_API_KEY` si explicitement configuré. Aucun jeton dans les fichiers du front.
- Modèle par défaut : `openai/gpt-6-luna`. Réglage facultatif `GLWADYS_AI_MODEL` ou `GLWADYS_AI_RESEARCH_MODEL` côté serveur.
- Crédits IA : indépendants des ressources d'hébergement. Vérifier les crédits restants et conserver les plafonds de dépenses dans la console Vercel AI Gateway ; l'offre gratuite ne constitue pas une garantie de volume illimité.

La protection associe un code privé fort et une limitation *best effort* en mémoire de la fonction. Celle-ci n'est **pas** une garantie de quota global entre instances : si le site devient public ou partagé largement, ajouter un rate limit persistant et des budgets stricts avant d'augmenter le volume. Les appels web et IA ne sont jamais lancés automatiquement à l'ouverture de la page.

## Vie privée

Le POST côté navigateur transmet : rôle, entreprise, description de l'offre (et URL officielle uniquement si la correspondance entreprise/poste est maintenue), type de métier, ton, consentement, code privé, option de recherche.

Le serveur construit le parcours vérifié côté backend. Il **n'envoie pas** les coordonnées personnelles, le PDF complet ni les notes facultatives au fournisseur de modèle. Les requêtes IA contiennent cependant les expériences professionnelles citées ; **Glwadys doit donner son accord**. Aucun prompt ni dossier généré ne doit être écrit dans les logs applicatifs.

L'accès web aux résultats du modèle n'est présenté comme factuel que lorsqu'il est accompagné de sources. Toute information externe doit être relue avant un envoi.

## Tests

- Tests contractuels `scripts/ai_contract_smoke.cjs` avec fausse IA (consentement, code, schéma, recherche simulée, champs non attestés).
- Tests Playwright `scripts/ux_smoke.cjs` : annonce fictive, fausse réponse IA, synchronisation aperçu/PDF et révision manuelle.
- `api/ai GET` donne la disponibilité sans lancer le moindre modèle.
- Le bon comportement réel avec une IA facturée et une recherche web sur une vraie entreprise doit être vérifié **avec l'accord explicite de Glwadys** avant d'être considéré comme validé.

Références officielles :
- https://vercel.com/docs/ai-gateway/authentication-and-byok
- https://vercel.com/docs/ai-gateway/pricing
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/tools-web-search
