'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { journeyMedia } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActJourney.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActJourney({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const trackEl = track.current;
      if (!rootEl || !stageEl || !trackEl) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          gsap.to(trackEl, {
            x: isDesktop ? () => -(trackEl.scrollWidth - window.innerWidth * 0.72) : 0,
            y: isDesktop ? 0 : () => -(trackEl.scrollHeight - window.innerHeight * 0.76),
            ease: EASE.scrub,
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.journey, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.rail,
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
    <section ref={root} className={`act surface-ink ${styles.act}`} aria-labelledby="journey-title">
      <div ref={stage} className={styles.stage}>
        <span className={`${styles.chapter} micro`}>07 / Timeline</span>
        <h2 id="journey-title" className={`${styles.heading} title`}>
          {content.journey.heading}
        </h2>
        <span className={`${styles.range} micro`}>2021 — 2026</span>
        <span className={styles.playhead} aria-hidden="true" />

        <div ref={track} className={styles.track}>
          {content.journey.entries.map((entry, index) => (
            <article className={styles.entry} key={entry.year}>
              <span className={styles.year}>{entry.year}</span>
              <div className={styles.entryCopy}>
                <h3 className={`${styles.entryLabel} title`}>{entry.label}</h3>
                <span className={`${styles.place} micro`}>{entry.place}</span>
              </div>
              <div className={styles.media}>
                <Media item={journeyMedia[index]!} locale={locale} compact sizes="20vw" />
              </div>
            </article>
          ))}
        </div>

        <span className={`${styles.caption} editorial-stamp`}>{content.contact.axis}</span>
      </div>
    </section>
  );
}
