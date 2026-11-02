'use client';

import { useRef, useState } from 'react';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/motion';
import {
  anchorScrollY,
  pauseScroll,
  restoreScroll,
  resumeScroll,
  SHELL_EVENTS,
  type ChapterRequest,
} from '@/lib/scrollControl';

import styles from './ChapterCurtain.module.css';

/**
 * Rideau de chapitre.
 *
 * Un saut d'ancre traverse des dizaines de milliers de pixels de films
 * épinglés : en natif, la page « clignote » d'un état à l'autre. Ici, une
 * page d'encre monte, porte le titre du chapitre comme un intercalaire de
 * magazine, le saut a lieu derrière elle, chaque scrub est conclu, puis la
 * page continue sa course et découvre le chapitre déjà composé.
 *
 * Décoratif (aria-hidden) : le lien reste un vrai lien, et sous
 * `prefers-reduced-motion` le saut natif est conservé.
 */
export function ChapterCurtain() {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<ChapterRequest | null>(null);

  useGSAP(
    (_context, contextSafe) => {
      const panel = root.current;
      if (!panel || !contextSafe) return;
      const reduced = window.matchMedia(MQ.reduced);
      let busy = false;

      const settleFilms = () => {
        ScrollTrigger.update();
        // Les timelines scrubées rattrapent le saut en 0,6 s : on conclut
        // leur lissage maintenant, derrière le rideau.
        ScrollTrigger.getAll().forEach((trigger) => trigger.getTween()?.progress(1));
      };

      const play = contextSafe((detail: ChapterRequest) => {
        const target = anchorScrollY(detail.id);
        if (target === null) return;
        busy = true;
        setChapter(detail);
        pauseScroll();
        panel.dataset.active = 'true';

        const lines = panel.querySelectorAll<HTMLElement>('[data-curtain-line]');
        const rule = panel.querySelector<HTMLElement>('[data-curtain-rule]');
        // Pas d'overwrite « true » : la sortie (même cible) tuerait l'entrée
        // dès la construction de la timeline. Un seul rideau à la fois (busy).
        gsap
          .timeline({
            defaults: { overwrite: false },
            onComplete: () => {
              busy = false;
              delete panel.dataset.active;
              resumeScroll();
            },
          })
          .fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.62, ease: 'power3.inOut' })
          .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.22)
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out' }, 0.28)
          .add(() => {
            restoreScroll(Math.max(0, target));
            settleFilms();
          }, 0.66)
          // Un battement : le chapitre se compose derrière la page.
          .add(() => settleFilms(), 0.82)
          .to(lines, { yPercent: -110, duration: 0.5, stagger: 0.04, ease: 'power3.in' }, 0.96)
          .to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.68, ease: 'power3.inOut' }, 1.02);
      });

      const onChapter = (event: Event) => {
        const detail = (event as CustomEvent<ChapterRequest>).detail;
        if (reduced.matches || !detail) return; // saut natif
        event.preventDefault();
        if (busy) return;
        play(detail);
      };

      document.addEventListener(SHELL_EVENTS.chapter, onChapter);
      return () => {
        document.removeEventListener(SHELL_EVENTS.chapter, onChapter);
        resumeScroll();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.curtain} aria-hidden="true">
      <div className={styles.inner}>
        <span className={styles.folio}>
          <span className={styles.mask}><span data-curtain-line>{chapter?.folio ?? ''}</span></span>
        </span>
        <span className={styles.title}>
          <span className={styles.mask}><span data-curtain-line>{chapter?.label ?? ''}</span></span>
        </span>
        <span className={styles.rule} data-curtain-rule />
        <span className={styles.signature} translate="no">
          <span className={styles.mask}><span data-curtain-line>Glwadys Dalleau — Portfolio 2026</span></span>
        </span>
      </div>
    </div>
  );
}
