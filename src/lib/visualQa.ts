'use client';

import { gsap, ScrollTrigger } from './gsap';
import { restoreScroll } from './scrollControl';
import { filmScrollPosition } from './visualQaMath';

type Film = { timeline: gsap.core.Timeline; states: Readonly<Record<string, number>> };

interface VisualQA {
  snapshot: () => {
    reducedMotion: boolean;
    scrollY: number;
    triggerCount: number;
    films: Record<string, { start: number; end: number; time: number; duration: number; states: Readonly<Record<string, number>> }>;
  };
  seek: (film: string, state: string | number) => number;
}

declare global {
  interface Window { __VISUAL_QA__?: VisualQA }
}

/** QA-only registry. It drives the REAL scroll owner; it never forces a
 * paused animation to a state that the visitor cannot reach. No public UI
 * or renderer depends on it. matchMedia owners unregister on teardown. */
const films = new Map<string, Film>();

function isEnabled() {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('visualqa');
}

function install() {
  if (!isEnabled() || window.__VISUAL_QA__) return;
  window.__VISUAL_QA__ = {
    snapshot: () => ({
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollY: window.scrollY,
      triggerCount: ScrollTrigger.getAll().length,
      films: Object.fromEntries([...films].map(([id, { timeline, states }]) => [id, {
        start: timeline.scrollTrigger?.start ?? 0,
        end: timeline.scrollTrigger?.end ?? 0,
        time: timeline.time(), duration: timeline.duration(), states,
      }])),
    }),
    seek: (id, state) => {
      const film = films.get(id);
      if (!film?.timeline.scrollTrigger) throw new Error(`Film not available: ${id}`);
      const time = typeof state === 'number' ? state : film.states[state];
      if (time === undefined) throw new Error(`Unknown state: ${id}/${state}`);
      const trigger = film.timeline.scrollTrigger;
      const y = filmScrollPosition(trigger.start, trigger.end, film.timeline.duration(), time);
      restoreScroll(y);
      ScrollTrigger.update();
      return y;
    },
  };
}

export function registerVisualFilm(id: string, timeline: gsap.core.Timeline, states: Readonly<Record<string, number>>) {
  if (!isEnabled()) return () => {};
  install();
  const film = { timeline, states };
  films.set(id, film);
  return () => { if (films.get(id) === film) films.delete(id); };
}
