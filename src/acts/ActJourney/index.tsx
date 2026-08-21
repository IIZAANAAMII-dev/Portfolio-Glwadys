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
      const q = gsap.utils.selector(stageEl);

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

          const entries = q<HTMLElement>('[data-journey-entry]');
          const media = q<HTMLElement>('[data-journey-media]');
          const progressBar = q<HTMLElement>('[data-journey-progress]')[0];
          const counter = q<HTMLElement>('[data-journey-counter]')[0];
          const handoff = q<HTMLElement>('[data-journey-handoff]')[0];
          if (!progressBar || !counter || !handoff || entries.length === 0) return;

          const driver = { value: 0 };
          let activeIndex = -1;
          const updateFocus = () => {
            const position = driver.value * Math.max(entries.length - 1, 1);
            const nextActive = Math.round(position);

            entries.forEach((entry, index) => {
              const focus = Math.max(0, 1 - Math.abs(index - position));
              gsap.set(entry, {
                scale: 0.94 + focus * 0.06,
                autoAlpha: 0.58 + focus * 0.42,
                y: (1 - focus) * 12,
              });
              if (nextActive === index) entry.dataset.active = 'true';
              else delete entry.dataset.active;

              const mediaEl = media[index];
              if (mediaEl) {
                gsap.set(mediaEl, { scale: 0.94 + focus * 0.06, y: (1 - focus) * 16 });
              }
            });

            gsap.set(progressBar, { scaleY: driver.value });
            if (activeIndex !== nextActive) {
              activeIndex = nextActive;
              counter.textContent = `${String(nextActive + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
            }
          };

          gsap.set(progressBar, { scaleY: 0, transformOrigin: 'center top' });
          gsap.set(handoff, {
            clipPath: 'inset(0 49.5% 0 49.5%)',
            scale: 1.008,
            transformOrigin: 'center center',
          });
          updateFocus();

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.journey, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.rail,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => {
                trackEl.style.willChange = isActive ? 'transform' : '';
              },
            },
          });

          tl
            .to(
              trackEl,
              {
                x: isDesktop ? () => -(trackEl.scrollWidth - window.innerWidth * 0.72) : 0,
                y: isDesktop ? 0 : () => -(trackEl.scrollHeight - window.innerHeight * 0.76),
                duration: 0.8,
              },
              0,
            )
            .to(driver, { value: 1, duration: 0.8, onUpdate: updateFocus }, 0)
            .to(handoff, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 0.25 }, 0.7)
            .to(
              q<HTMLElement>('[data-journey-chrome]'),
              { autoAlpha: 0, y: -8, duration: 0.12 },
              0.76,
            );

          return () => {
            trackEl.style.willChange = '';
            entries.forEach((entry) => delete entry.dataset.active);
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-ink ${styles.act}`} aria-labelledby="journey-title">
      <div ref={stage} className={styles.stage} data-cursor="drag">
        <span className={`${styles.chapter} micro`} data-journey-chrome>
          07 / Timeline
        </span>
        <h2 id="journey-title" className={`${styles.heading} title`} data-journey-chrome>
          {content.journey.heading}
        </h2>
        <span className={`${styles.range} micro`}>2021 — 2026</span>
        <span className={styles.playhead} data-journey-chrome aria-hidden="true">
          <span className={styles.progress} data-journey-progress />
        </span>
        <span className={`${styles.counter} micro`} data-journey-counter data-journey-chrome>
          01 / {String(content.journey.entries.length).padStart(2, '0')}
        </span>

        <div ref={track} className={styles.track}>
          {content.journey.entries.map((entry, index) => (
            <article className={styles.entry} data-journey-entry key={entry.year}>
              <span className={styles.year}>{entry.year}</span>
              <div className={styles.entryCopy}>
                <h3 className={`${styles.entryLabel} title`}>{entry.label}</h3>
                <span className={`${styles.place} micro`}>{entry.place}</span>
              </div>
              <div className={styles.media} data-journey-media>
                <Media item={journeyMedia[index]!} locale={locale} compact sizes="20vw" />
              </div>
            </article>
          ))}
        </div>

        <span className={`${styles.caption} editorial-stamp`} data-journey-chrome>
          {content.contact.axis}
        </span>
        <div className={styles.handoff} data-journey-handoff aria-hidden="true" />
      </div>
    </section>
  );
}
