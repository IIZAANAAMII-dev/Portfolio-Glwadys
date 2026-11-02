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

/** Recale aussi l'horloge de Lenis après la reconstruction des pins GSAP. */
export function restoreScroll(y: number) {
  const target = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
  if (instance) {
    instance.resize();
    instance.scrollTo(target, { immediate: true, force: true });
  } else window.scrollTo(0, target);
}

/** Gèle la molette/le tactile sans déplacer la page (rideau de chapitre). */
export function pauseScroll() {
  instance?.stop();
}

export function resumeScroll() {
  if (!isScrollLocked()) instance?.start();
}

/** Événements du shell. Évite le prop drilling et tout state partagé. */
export const SHELL_EVENTS = {
  /** L'Opening est terminé : la navigation peut apparaître. */
  ready: 'gd:ready',
  /** Le Contact est actif : la navigation se recompose en CTA final. */
  contact: 'gd:contact',
  /** Demande de saut vers un chapitre, joué derrière le rideau. */
  chapter: 'gd:chapter',
} as const;

export interface ChapterRequest {
  /** Id de l'ancre physique du chapitre (`act-*`). */
  id: string;
  label: string;
  folio: string;
}

/**
 * Demande un saut de chapitre. Renvoie `false` si personne ne l'a pris en
 * charge (mouvement réduit, rideau absent) : l'appelant laisse alors le lien
 * natif faire son saut.
 */
export function requestChapter(detail: ChapterRequest): boolean {
  const event = new CustomEvent<ChapterRequest>(SHELL_EVENTS.chapter, { detail, cancelable: true });
  // Le rideau appelle preventDefault() : c'est lui qui pilote le saut.
  return !document.dispatchEvent(event);
}

/** Position de scroll d'une ancre, identique au saut natif (scroll-margin compris). */
export function anchorScrollY(id: string): number | null {
  const node = document.getElementById(id);
  if (!node) return null;
  const margin = parseFloat(getComputedStyle(node).scrollMarginTop) || 0;
  return node.getBoundingClientRect().top + window.scrollY - margin;
}

export function emitReady() {
  document.documentElement.dataset.shellReady = 'true';
  document.dispatchEvent(new CustomEvent(SHELL_EVENTS.ready));
}

export function emitContact(active: boolean) {
  document.dispatchEvent(new CustomEvent(SHELL_EVENTS.contact, { detail: active }));
}
