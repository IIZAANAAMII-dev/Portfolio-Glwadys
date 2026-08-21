/**
 * Grammaire de mouvement du site.
 * Référence : docs/motion-system.md
 *
 * Ce fichier est le miroir TypeScript des tokens de mouvement de tokens.css.
 * Toute valeur d'animation vient d'ici. Aucun nombre magique dans un acte.
 */

/** Easings. Chaque easing a un rôle et ne sert pas ailleurs. */
export const EASE = {
  /** Révélations : rapide, décidé, atterrissage net. */
  reveal: 'expo.out',
  /** Déplacements et entrées standard. */
  move: 'power3.out',
  /** Transitions entre actes, symétriques. */
  handoff: 'power2.inOut',
  /** Obligatoire sur tout ce qui est scrubé au scroll. */
  scrub: 'none',
  /** Les gestes rares et forts : portail, chaos→ordre. */
  editorial: 'power4.out',
} as const;

/** Durées. Aucune animation ne dépasse `cinematic`. */
export const DUR = {
  snap: 0.35,
  base: 0.6,
  editorial: 0.9,
  cinematic: 1.2,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.09,
} as const;

/** Valeurs de scrub. `> 1.5` est interdit : l'animation se décroche du scroll. */
export const SCRUB = {
  /** Séquences narratives. */
  narrative: 0.6,
  /** Rails horizontaux : réactivité directe. */
  rail: 0.5,
  /** Portail et raccord WebGL : liaison 1:1, l'exactitude prime. */
  exact: true,
} as const;

/** Contextes de `gsap.matchMedia()`. */
export const MQ = {
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023px)',
  /** Pointeur fin réellement disponible : condition du curseur custom. */
  finePointer: '(min-width: 1024px) and (pointer: fine)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

/**
 * Budget de scroll par acte, en pourcentage de la hauteur du viewport.
 * Défini avant le build (docs/storyboard.md) pour que la longueur totale
 * reste tenue. Le sens de correction par défaut est vers le bas.
 */
export const SCROLL = {
  hero: 120,
  social: 230,
  phone: 320,
  immersion: 240,
  contactSheet: 200,
  moodboard: 200,
  strategy: 230,
  journey: 160,
  expertise: 100,
} as const;

/** Le mobile recompose et raccourcit : ~70 % du budget desktop. */
export const MOBILE_SCROLL_RATIO = 0.7;

/** `+=Nvh` pour un ScrollTrigger, ajusté au contexte. */
export function scrollLength(vh: number, isMobile = false): string {
  const value = isMobile ? Math.round(vh * MOBILE_SCROLL_RATIO) : vh;
  return `+=${value}%`;
}
