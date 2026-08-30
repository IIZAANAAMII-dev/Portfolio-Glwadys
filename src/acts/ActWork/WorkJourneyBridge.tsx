'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { comptoirMedia, mgcMedia, yunaMedia } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './WorkJourneyBridge.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

const folioMedia = [yunaMedia[0]!, mgcMedia[0]!, comptoirMedia[0]!] as const;

export function WorkJourneyBridge({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const folios = q<HTMLElement>('[data-bridge-folio]');
      const colorField = q<HTMLElement>('[data-bridge-color]')[0];
      const thread = q<HTMLElement>('[data-bridge-thread]')[0];
      const journeyCopy = q<HTMLElement>('[data-bridge-journey]');
      const archiveCopy = q<HTMLElement>('[data-bridge-archive]');
      if (folios.length === 0 || !colorField || !thread) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          gsap.set(folios, {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1.025,
            rotation: (index: number) => [-3.4, 1.6, 3.1][index] ?? 0,
          });
          gsap.set(journeyCopy, { autoAlpha: 0, yPercent: 28 });
          gsap.set(archiveCopy, { autoAlpha: 0.78, y: 4 });
          gsap.set(thread, { scaleY: 0.08, transformOrigin: 'center top' });
          gsap.set(colorField, { scaleY: 1, transformOrigin: 'center bottom' });

          const threadShift = () => {
            if (isDesktop) return -window.innerWidth * 0.22;
            return -(window.innerWidth * 0.5 - Math.max(20, window.innerWidth * 0.04));
          };

          gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: {
                trigger: rootEl,
                start: 'top top',
                end: 'bottom bottom',
                scrub: SCRUB.narrative,
                invalidateOnRefresh: true,
              },
            })
            .to(
              folios,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                scale: 1,
                stagger: 0.045,
                duration: 0.22,
              },
              0,
            )
            .to(archiveCopy, { autoAlpha: 1, y: 0, stagger: 0.045, duration: 0.18 }, 0.04)
            .to(thread, { scaleY: 1, duration: 0.26 }, 0.14)
            .to(archiveCopy, { autoAlpha: 0, y: -10, stagger: 0.03, duration: 0.14 }, 0.44)
            .to(colorField, { scaleY: 0, duration: 0.24 }, 0.44)
            .to(
              folios,
              {
                scale: isDesktop ? 0.52 : 0.62,
                xPercent: (index: number) =>
                  isDesktop ? [-78, -24, 32][index] ?? 0 : [-12, 10, 32][index] ?? 0,
                yPercent: (index: number) => [8, 20, 32][index] ?? 16,
                rotation: 0,
                autoAlpha: 0.48,
                stagger: 0.025,
                duration: 0.28,
              },
              0.48,
            )
            .to(thread, { x: threadShift, duration: 0.3 }, 0.5)
            .to(journeyCopy, { autoAlpha: 1, yPercent: 0, stagger: 0.045, duration: 0.22 }, 0.46)
            .to(
              folios,
              {
                scale: 0.4,
                xPercent: (index: number) =>
                  isDesktop ? [92, 108, 122][index] ?? 60 : [40, 58, 76][index] ?? 40,
                yPercent: (index: number) => [22, 30, 40][index] ?? 20,
                rotation: (index: number) => [4, -2, 6][index] ?? 0,
                autoAlpha: 0,
                stagger: 0.025,
                duration: 0.24,
              },
              0.78,
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.bridge} data-work-journey-bridge aria-hidden="true">
      <span id="act-journey-handoff" className={styles.journeyMarker} />
      <div ref={stage} className={styles.stage}>
        <span className={styles.colorField} data-bridge-color />
        <span className={styles.thread} data-bridge-thread />

        <div className={styles.archiveChrome}>
          <span className="micro" data-bridge-archive>
            06.9 / Folio 01—03
          </span>
          <span className="micro" data-bridge-archive>
            Folio 01—03 → {content.journey.heading}
          </span>
        </div>

        <div className={styles.folios}>
          {content.work.projects.map((project, index) => {
            const year = project.period.match(/20\d{2}/)?.[0] ?? content.journey.entries[index]?.year;
            return (
              <article className={styles.folio} data-bridge-folio data-folio-index={index + 1} key={project.id}>
                <Media item={folioMedia[index]!} locale={locale} sizes="28vw" />
                <footer className={styles.folioMeta}>
                  <span className="micro">Folio 0{index + 1}</span>
                  <strong>{project.name}</strong>
                  <span className={styles.folioYear}>{year}</span>
                </footer>
              </article>
            );
          })}
        </div>

        <span className={`${styles.journeyChapter} micro`} data-bridge-journey>
          07 / Timeline
        </span>
        <h2 className={styles.journeyTitle} data-bridge-journey>
          {content.journey.heading}
        </h2>
      </div>
    </section>
  );
}
