'use client';

import type Lenis from 'lenis';

/**
 * Contrôle du scroll, partagé entre le shell et les actes.
 *
 * Volontairement un module et non un contexte React : verrouiller le scroll ne
 * doit provoquer aucun re-render, sous peine de faire sauter les timelines en
 * cours pendant l'Opening.
 */

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Verrouille le scroll et remet la page en haut. */
export function lockScroll() {
  document.documentElement.dataset.scrollLocked = 'true';
  window.scrollTo(0, 0);
  instance?.stop();
}

export function unlockScroll() {
  delete document.documentElement.dataset.scrollLocked;
  instance?.start();
}

export function isScrollLocked() {
  return document.documentElement.dataset.scrollLocked === 'true';
}

/** Événements du shell. Évite le prop drilling et tout state partagé. */
export const SHELL_EVENTS = {
  /** L'Opening est terminé : la navigation peut apparaître. */
  ready: 'gd:ready',
  /** Le Contact est actif : la navigation se recompose en CTA final. */
  contact: 'gd:contact',
} as const;

export function emitReady() {
  document.dispatchEvent(new CustomEvent(SHELL_EVENTS.ready));
}

export function emitContact(active: boolean) {
  document.dispatchEvent(new CustomEvent(SHELL_EVENTS.contact, { detail: active }));
}
