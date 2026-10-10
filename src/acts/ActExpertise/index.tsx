'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { registerVisualFilm } from '@/lib/visualQa';
import { heldSteps, segment, settle } from '@/lib/holdScalar';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';

import { ExpertiseOpeningFrame } from './ExpertiseOpeningFrame';
import { clearExpertisePaint, createExpertisePainter } from './expertisePainter';

import styles from './ActExpertise.module.css';

interface Props {
  content: Content;
}

/* Beat map of the wine index (fractions of the pinned scroll).
   0 → 0.06   still: discipline 01 is read, the page is exactly Journey's last frame
   0.06 → 0.78 seven readings, each one held, a short settle between them
   0.78 → 0.81 the last discipline keeps a full reading hold
   0.81 → 0.86 chord: the seven disciplines light together (payoff of the index)
   0.87 → 1    the ivory manifesto page rises and trims to ActContact's page */
const BEAT = { readFrom: 0.06, readTo: 0.78, chordFrom: 0.81, chordTo: 0.86 } as const;

export function ActExpertise({ content }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl || !list.current) return;
      const q = gsap.utils.selector(stageEl);
      const sheet = q<HTMLElement>('[data-expertise-sheet]')[0];
      const fold = q<HTMLElement>('[data-expertise-fold]')[0];
      const handoff = q<HTMLElement>('[data-expertise-handoff]')[0];
      if (!sheet || !fold || !handoff) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;
          rootEl.dataset.enhanced = 'true';

          // Journey's pinned last frame already shows this exact page. The
          // real act only becomes visible at the pixel where that pin ends.
          gsap.set(rootEl, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: rootEl,
            start: 'top top',
            end: 'bottom top',
            onEnter: () => gsap.set(rootEl, { autoAlpha: 1 }),
            onEnterBack: () => gsap.set(rootEl, { autoAlpha: 1 }),
            onLeaveBack: () => gsap.set(rootEl, { autoAlpha: 0 }),
            onRefresh: (self) => {
              gsap.set(rootEl, { autoAlpha: self.scroll() >= self.start ? 1 : 0 });
            },
          });

          const count = q<HTMLElement>('[data-expertise-row]').length;
          const painter = createExpertisePainter(sheet, isDesktop);
          const driver = { t: 0 };
          const render = () => {
            const pos = heldSteps(segment(driver.t, BEAT.readFrom, BEAT.readTo), count, 0.2);
            const chord = settle(segment(driver.t, BEAT.chordFrom, BEAT.chordTo));
            painter.paint(pos, chord);
          };

          // Handoff geometry mirrors ActContact's manifesto page exactly:
          // inset 0 clamp(1rem, 3vw, 2.75rem) on desktop, 0.75rem on mobile.
          const pageInset = () => {
            if (!isDesktop) return 12;
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            return Math.min(Math.max(window.innerWidth * 0.03, rem), rem * 2.75);
          };

          gsap.set(fold, { scale: 0, transformOrigin: 'right top' });
          gsap.set(handoff, { yPercent: 100 });
          gsap.set(sheet, { clipPath: 'inset(0px 0px 0px 0px)' });
          render();

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.expertise, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                painter.measure();
                render();
              },
            },
          });

          tl.to(driver, { t: 1, duration: 1, onUpdate: render }, 0)
            .to(handoff, { yPercent: 0, duration: 0.09, ease: EASE.handoff }, 0.87)
            .to(
              sheet,
              {
                clipPath: () => `inset(0px ${pageInset()}px 0px ${pageInset()}px)`,
                duration: 0.03,
                ease: EASE.handoff,
              },
              0.96,
            )
            .to(fold, { scale: 1, duration: 0.03 }, 0.97);

          // The hero scale depends on the display face's real widths.
          let alive = true;
          document.fonts?.ready.then(() => {
            if (!alive) return;
            painter.measure();
            render();
          });

          const unregister = registerVisualFilm('expertise', tl, {
            first: 0.06, second: 0.18, third: 0.3, fourth: 0.42,
            fifth: 0.54, sixth: 0.66, seventh: 0.78, all: 0.86, contact: 1,
          });
          return () => {
            alive = false;
            unregister();
            delete rootEl.dataset.enhanced;
            clearExpertisePaint(sheet);
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-bordeaux ${styles.act}`} aria-labelledby="expertise-title">
      <div ref={stage} className={styles.stage}>
        <div className={styles.sheet} data-expertise-sheet>
          <ExpertiseOpeningFrame content={content} listRef={list} />
          <div className={styles.handoffLayer} data-expertise-handoff aria-hidden="true">
            <span className={styles.sheetFold} data-expertise-fold />
            <div className={styles.handoffMeta}>
              <span className="micro">{content.manifesto.eyebrow}</span>
              <span className="micro">Glwadys Dalleau / 2026</span>
            </div>
            <p className={styles.handoffTitle}>
              <span>{content.manifesto.lineOne}</span>
              <span>{content.manifesto.lineTwo}</span>
            </p>
            <span className={styles.handoffRule} />
            <span className={`${styles.handoffNote} hand-note`}>{content.manifesto.note}</span>
            <span className={`${styles.handoffAxis} micro`}>{content.contact.axis}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
