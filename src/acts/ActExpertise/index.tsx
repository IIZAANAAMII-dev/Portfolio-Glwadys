'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';

import styles from './ActExpertise.module.css';

interface Props {
  content: Content;
}

export function ActExpertise({ content }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const listEl = list.current;
      if (!rootEl || !stageEl || !listEl) return;
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

          gsap.set(fold, { scale: 0, transformOrigin: 'right top' });
          gsap.set(handoff, {
            autoAlpha: 0,
            clipPath: 'inset(0 0 100% 0)',
          });

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
            },
          });

          tl
            .to(
              listEl,
              {
                y: () => {
                  const viewport = listEl.parentElement;
                  return viewport ? -(listEl.scrollHeight - viewport.clientHeight) : 0;
                },
                duration: 0.8,
              },
              0,
            )
            .to(
              q<HTMLElement>('[data-expertise-content]'),
              { autoAlpha: 0, y: -10, duration: 0.12 },
              0.8,
            )
            .to(
              sheet,
              {
                scaleX: () => {
                  const inset = isDesktop
                    ? Math.min(Math.max(window.innerWidth * 0.03, 16), 44)
                    : 12;
                  return (window.innerWidth - inset * 2) / window.innerWidth;
                },
                scaleY: () => {
                  const inset = isDesktop
                    ? Math.min(Math.max(window.innerWidth * 0.03, 16), 44)
                    : 12;
                  return (window.innerHeight - inset * 2) / window.innerHeight;
                },
                duration: 0.2,
              },
              0.8,
            )
            .to(fold, { scale: 1, duration: 0.16 }, 0.82)
            .to(
              handoff,
              { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.2 },
              0.79,
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-labelledby="expertise-title">
      <div ref={stage} className={styles.stage}>
        <div className={styles.sheet} data-expertise-sheet>
          <span className={`${styles.chapter} micro`} data-expertise-content>
            08 / Index
          </span>
          <h2 id="expertise-title" className={`${styles.heading} title`} data-expertise-content>
            {content.expertise.heading}
          </h2>
          <div className={styles.listViewport} data-expertise-content>
            <ol ref={list} className={styles.list}>
              {content.expertise.entries.map((entry, index) => (
                <li className={styles.row} key={entry.term} tabIndex={0}>
                  <span className={`${styles.index} micro`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.term}>{entry.term}</span>
                  <span className={`${styles.context} micro`}>{entry.context}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className={`${styles.aside} hand-note`} data-expertise-content>
            {content.strategy.sentence}
          </p>
          <span className={styles.sheetFold} data-expertise-fold aria-hidden="true" />
          <div className={styles.handoffLayer} data-expertise-handoff aria-hidden="true">
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
