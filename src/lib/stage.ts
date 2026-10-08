'use client';

/**
 * SCÈNE D'ORIGINE — progression locale du raccord téléphone → immersion.
 *
 * Le Canvas borné dans ActScrollStory lit un seul scalaire `t` (0 à 3).
 * Les chapitres ultérieurs restent archivés ci-dessous ; leurs actes utilisent
 * leur partition DOM, sans revendiquer cette scène.
 *
 * Pourquoi un module et non un contexte React : GSAP écrit `t` à chaque frame de
 * scroll. Le faire passer par du state React provoquerait un re-render par frame
 * et désynchroniserait le DOM du WebGL. Le Canvas lit `t` dans `useFrame`,
 * jamais via une prop ; l'ownership est relâchée aux deux sorties de l'acte.
 *
 * Les chapitres sont contigus et ordonnés : interpoler entre deux keyframes
 * suffit à rendre chaque transition réversible, dans les deux sens de scroll,
 * sans qu'aucun acte n'ait à connaître ses voisins.
 */

export const STAGE_CHAPTERS = [
  /** L'écran du téléphone, à la géométrie exacte de son homologue DOM. */
  'screen',
  /** Le contenu de l'écran se détache en couches et avance en profondeur. */
  'separate',
  /** La caméra traverse la composition. */
  'corridor',
  /** 01 — Matière brute : la planche contact se résout. */
  'raw',
  /** 02 — Sélection. */
  'select',
  /** 03 — Intention. */
  'intent',
  /** 04 — Système. */
  'system',
  /** 05 — Résultat : un seul tirage survit. */
  'result',
  /** Le tirage retenu devient la couverture du projet Yuna. */
  'cover',
  /** Les trois projets deviennent trois tirages. */
  'folio',
  /** La ligne éditoriale devient la frise du parcours. */
  'timeline',
] as const;

export type StageChapter = (typeof STAGE_CHAPTERS)[number];

/** Index de chapitre → position `t`. `chapter('raw') === 3`. */
export function chapter(id: StageChapter): number {
  return STAGE_CHAPTERS.indexOf(id);
}

export const STAGE_END = STAGE_CHAPTERS.length - 1;

export interface StageRect {
  /** Centre et taille, en fractions du viewport. */
  u: number;
  v: number;
  w: number;
  h: number;
}

interface StageState {
  /** Position dans le film, en numéros de chapitre. */
  t: number;
  /** Dernier sens de scroll observé. 1 = avant. */
  dir: 1 | -1;
  /** Le Canvas doit-il produire des frames ? */
  live: boolean;
  /** Le temps seul n'autorise jamais un plan à survivre à son acte. */
  owner: 'story' | null;
  /**
   * Ancres DOM publiées par les actes : c'est le contrat qui synchronise la
   * couche DOM et le Canvas. Un plan ancré naît *exactement* dans le cadre de
   * son homologue HTML, ce qui remplace tout fondu par une continuité.
   */
  rects: Map<string, StageRect>;
}

const state: StageState = { t: 0, dir: 1, live: false, owner: null, rects: new Map() };

let renderer: (() => void) | null = null;
const liveListeners = new Set<(live: boolean) => void>();

/** Le Canvas s'enregistre pour pouvoir être réveillé à la demande. */
export function registerStageRenderer(fn: (() => void) | null) {
  renderer = fn;
}

export function requestStageRender() {
  renderer?.();
}

export function stageState(): Readonly<StageState> {
  return state;
}

/**
 * Positionne le film. Appelé par les ScrollTriggers des actes.
 * `live` s'allume dès qu'un acte revendique la scène et s'éteint quand plus
 * aucun ne la revendique : le Canvas ne rend jamais pour rien.
 */
export function setStage(t: number, owner: 'story') {
  // -1 est le préchauffage : aucun plan du film n'est visible.
  const next = Math.max(-1, Math.min(STAGE_END, t));
  if (next !== state.t) state.dir = next > state.t ? 1 : -1;
  state.t = next;
  state.owner = owner;
  setStageLive(true);
  renderer?.();
}

function setStageLive(live: boolean) {
  if (state.live === live) return;
  state.live = live;
  liveListeners.forEach((fn) => fn(live));
  renderer?.();
}

/** Sortie synchrone, y compris au retour, au resize et au démontage. */
export function releaseStage(owner: 'story') {
  if (state.owner !== owner) return;
  state.owner = null;
  state.t = 0;
  state.rects.clear();
  setStageLive(false);
}

export function onStageLive(fn: (live: boolean) => void) {
  liveListeners.add(fn);
  fn(state.live);
  return () => liveListeners.delete(fn);
}

/**
 * Publie la géométrie d'un élément DOM comme ancre de scène.
 * Passer `null` retire l'ancre : le plan retombe alors sur sa position écrite,
 * ce qui garantit qu'aucun raccord ne dépend d'un élément absent.
 */
export function setStageAnchor(name: string, el: Element | null) {
  if (!el) {
    state.rects.delete(name);
    return;
  }
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    state.rects.delete(name);
    return;
  }
  state.rects.set(name, {
    u: (rect.x + rect.width / 2) / window.innerWidth,
    v: (rect.y + rect.height / 2) / window.innerHeight,
    w: rect.width / window.innerWidth,
    h: rect.height / window.innerHeight,
  });
}

export function stageAnchor(name: string): StageRect | undefined {
  return state.rects.get(name);
}

/** Progression locale d'un chapitre, bornée. */
export function chapterProgress(t: number, id: StageChapter) {
  return Math.max(0, Math.min(1, t - chapter(id)));
}
