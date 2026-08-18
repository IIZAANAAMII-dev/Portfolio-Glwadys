# Motion audit

| Scène | Animation actuelle | Réglages observés | Ressenti / problème | Correction appliquée ou prévue |
| --- | --- | --- | --- | --- |
| Lenis global | Smooth wheel | durée 1.2 | inertie globale trop présente | durée 0.72, un seul moteur et ticker nettoyé correctement |
| Curseur | `gsap.to` à chaque mouvement | 0.18s, Power2 | rond en retard sur la souris | 0.075s, Power3, overwrite auto ; états conservés |
| Intro | metadata + hairline | 1.2s / 1.4s | entrée trop abstraite et lente | 0.55–0.72s, cartes éditoriales + reveal masqué du nom |
| Intro lifecycle | section dans le flux | min-height viewport | l’intro persistait comme une page entière | overlay fixed, retrait automatique après l’entrée |
| Intro → hero | caméra scroll | scrub 1.2 | transition douce mais peu décisive | scrub 0.45, continuité visuelle intro/hero |
| Hero | pin typographique | 180vh, scrub 1.2 | longue pour une variation faible | 140vh, scrub 0.5, cadre portrait qui prend le contrôle |
| Identity | grille qui se disperse | 200vh, scrub 1.2 | bonne idée, rythme trop dilué | à resserrer au passage final avec reveal de grille plutôt qu’explication |
| Social / Phone | cartes sortent + caméra avance | 250vh, scrub 1.2 | le téléphone est parfois perçu derrière d’autres actes | 290vh dédié, scrub 0.55, téléphone monté uniquement pour le chapitre Social |
| Phone beats | contenu statique | aucun état de séquence | la plongée manque de progression interne | progression store + indicateurs Feed / Story / Campaign synchronisés au pin |
| Galerie | track horizontal + caméra | largeur x 1.2, scrub 1.2 | voyage très long et double lecture DOM/WebGL | longueur réduite, scrub 0.55, plans 3D visibles uniquement durant Gallery |
| Case studies | reveals indépendants | 1.2s, stagger 0.15 | sections projets trop statiques | pins courts 105–125%, scrub 0.55, composition en entrée puis légère sortie |
| Caméra R3F | lerp par frame | facteur 0.07 desktop | caméra semble rester derrière le scroll | facteur 0.16 desktop / 0.20 medium |

## Règles motion retenues

- Scrub narratif : `0.45–0.6`, pas de cumul de lissages.
- Entrées hors-scroll : `0.45–0.75s`, avec des overlaps de `0.16–0.35s`.
- Les pins doivent avoir une action lisible : composer, révéler, traverser ou transformer.
- Opacity et transforms restent les propriétés animées de base ; les masques sont réservés aux reveals de titres et médias clés.
- Mobile : Hero 110vh et Social 220vh pour préserver une tension raisonnable au toucher.
