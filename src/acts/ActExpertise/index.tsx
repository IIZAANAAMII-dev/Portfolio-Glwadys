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

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          gsap.to(listEl, {
            y: () => {
              const viewport = listEl.parentElement;
              return viewport ? -(listEl.scrollHeight - viewport.clientHeight) : 0;
            },
            ease: EASE.scrub,
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
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-labelledby="expertise-title">
      <div ref={stage} className={styles.stage}>
        <span className={`${styles.chapter} micro`}>08 / Index</span>
        <h2 id="expertise-title" className={`${styles.heading} title`}>
          {content.expertise.heading}
        </h2>
        <div className={styles.listViewport}>
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
        <p className={`${styles.aside} hand-note`}>{content.strategy.sentence}</p>
      </div>
    </section>
  );
}
