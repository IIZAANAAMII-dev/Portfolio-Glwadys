/**
 * The motion system. One grammar for the whole site.
 *
 * Every duration, ease and scrub value used anywhere in the experience comes
 * from here. If a component needs a value that is not in this file, either the
 * value is wrong or the vocabulary needs an explicit amendment in
 * docs/awwwards-mechanics.md.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/** Registers plugins exactly once. Safe to call from any client component. */
export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: EASE.out, duration: DUR.ui });
  registered = true;
}

/**
 * Easing whitelist. Overshoot eases (bounce, elastic, spring, back) are banned
 * — they read as playful, and this site is not.
 */
export const EASE = {
  /** Default. Decisive arrival. */
  out: 'power3.out',
  /** Softer settle, for larger travel. */
  outSoft: 'power2.out',
  /** Symmetrical, for repositioning that should feel authored. */
  inOut: 'power4.inOut',
  /** Sharpest arrival. Reveals. */
  expo: 'expo.out',
  /** Barely-there drift. */
  sine: 'sine.inOut',
  /** Mandatory for anything scroll-linked and linear (horizontal tracks). */
  none: 'none',
} as const;

export const DUR = {
  /** 150–300ms — hovers, small state changes. */
  micro: 0.22,
  /** 300–500ms — UI transitions. */
  ui: 0.4,
  /** 450–900ms — act transitions, shared media transforms. */
  major: 0.7,
} as const;

export const STAGGER = {
  /** Display characters only. */
  chars: 0.02,
  /** Default: words, media, list items. */
  default: 0.07,
  /** Slower, for a handful of large elements. */
  wide: 0.1,
} as const;

/** Scrub band is 0.45–0.6. Anything outside it feels either twitchy or soupy. */
export const SCRUB = {
  default: 0.5,
  tight: 0.45,
  loose: 0.6,
} as const;

/** Breakpoints for gsap.matchMedia(). */
export const MQ = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  mobile: '(max-width: 767px)',
  /** Anything that is not a fine pointer gets no hover/parallax affordances. */
  finePointer: '(hover: hover) and (pointer: fine)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MQ.reduced).matches;
}
