'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { portfolioThread } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './WorkJourneyBridge.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function WorkJourneyBridge({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const folio = q<HTMLElement>('[data-bridge-folio]')[0];
      const colorField = q<HTMLElement>('[data-bridge-color]')[0];
      const thread = q<HTMLElement>('[data-bridge-thread]')[0];
      const tabs = q<HTMLElement>('[data-bridge-project]');
      const years = q<HTMLElement>('[data-bridge-year]');
      const journeyCopy = q<HTMLElement>('[data-bridge-journey]');
      const archiveCopy = q<HTMLElement>('[data-bridge-archive]');
      if (!folio || !colorField || !thread) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          gsap.set(folio, {
            autoAlpha: 1,
            clipPath: 'inset(47% 0% 47% 0%)',
            scale: 1.025,
            rotation: -1.2,
          });
          gsap.set(tabs, { autoAlpha: 0, y: 18 });
          gsap.set(years, { autoAlpha: 0, y: 16 });
          gsap.set(journeyCopy, { autoAlpha: 0, yPercent: 28 });
          gsap.set(archiveCopy, { autoAlpha: 0.46, y: 4 });
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
            .to(folio, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.2 }, 0)
            .to(archiveCopy, { autoAlpha: 1, y: 0, stagger: 0.045, duration: 0.18 }, 0.04)
            .to(tabs, { autoAlpha: 1, y: 0, stagger: 0.055, duration: 0.2 }, 0.1)
            .to(thread, { scaleY: 1, duration: 0.26 }, 0.14)
            .to(tabs, { autoAlpha: 0, y: -12, stagger: 0.035, duration: 0.16 }, 0.42)
            .to(archiveCopy, { autoAlpha: 0, y: -10, stagger: 0.03, duration: 0.14 }, 0.44)
            .to(colorField, { scaleY: 0, duration: 0.24 }, 0.44)
            .to(
              folio,
              {
                scale: isDesktop ? 0.56 : 0.64,
                xPercent: isDesktop ? -58 : 18,
                yPercent: isDesktop ? 8 : 18,
                rotation: 0,
                autoAlpha: 0.42,
                duration: 0.28,
              },
              0.48,
            )
            .to(thread, { x: threadShift, duration: 0.3 }, 0.5)
            .to(years, { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.22 }, 0.6)
            .to(journeyCopy, { autoAlpha: 1, yPercent: 0, stagger: 0.045, duration: 0.22 }, 0.62)
            .to(folio, { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 0, duration: 0.18 }, 0.82);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.bridge} data-work-journey-bridge aria-hidden="true">
      <div ref={stage} className={styles.stage}>
        <span className={styles.colorField} data-bridge-color />
        <span className={styles.thread} data-bridge-thread />

        <div className={styles.archiveChrome}>
          <span className="micro" data-bridge-archive>
            06.9 / Archive
          </span>
          <span className="micro" data-bridge-archive>
            {content.work.heading} → {content.journey.heading}
          </span>
        </div>

        <div className={styles.folio} data-bridge-folio>
          <Media item={portfolioThread} locale={locale} sizes="34vw" />
        </div>

        <ol className={styles.projectIndex}>
          {content.work.projects.map((project, index) => (
            <li data-bridge-project key={project.id}>
              <span className="micro">0{index + 1}</span>
              <strong>{project.name}</strong>
              <span className="micro">{project.period}</span>
            </li>
          ))}
        </ol>

        <span className={`${styles.journeyChapter} micro`} data-bridge-journey>
          07 / Timeline
        </span>
        <h2 className={styles.journeyTitle} data-bridge-journey>
          {content.journey.heading}
        </h2>
        <div className={styles.years}>
          {content.journey.entries.map((entry) => (
            <span data-bridge-year key={entry.year}>
              {entry.year}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
