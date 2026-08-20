'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { depthMedia } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Media } from '@/ui/Media';

import styles from './ActImmersion.module.css';

const Scene = dynamic(() => import('./Scene.client'), { ssr: false });

export const IMMERSION_PROGRESS_EVENT = 'gd:immersion-progress';

interface Props {
  content: Content;
  locale: Locale;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function ActImmersion({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = Boolean(entry?.isIntersecting);
        setMounted(isIntersecting);
        if (isIntersecting) setWebgl(supportsWebGL());
      },
      { threshold: 0, rootMargin: '100% 0px' },
    );
    observer.observe(rootEl);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          const driver = { value: 0 };
          gsap.to(driver, {
            value: 1,
            ease: EASE.scrub,
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.immersion, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.exact,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                progress.current = self.progress;
                window.dispatchEvent(new Event(IMMERSION_PROGRESS_EVENT));
              },
            },
          });

          gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: {
                trigger: rootEl,
                start: 'top top',
                end: () => scrollLength(SCROLL.immersion, !isDesktop),
                scrub: SCRUB.narrative,
              },
            })
            .fromTo('[data-immersion-heading]', { yPercent: 115 }, { yPercent: 0, duration: 0.2 }, 0.16)
            .fromTo('[data-immersion-copy]', { yPercent: 16, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.22 }, 0.35)
            .to('[data-immersion-copy]', { yPercent: -20, autoAlpha: 0, duration: 0.2 }, 0.74)
            .to('[data-immersion-heading]', { yPercent: -110, duration: 0.18 }, 0.8);
        },
      );
    },
    { scope: root },
  );

  const showCanvas = mounted && webgl && !reduced;

  return (
    <section
      ref={root}
      className={`act surface-bordeaux ${styles.act}`}
      aria-labelledby="immersion-title"
    >
      <div ref={stage} className={styles.stage}>
        <div className={styles.fallback} aria-hidden={showCanvas}>
          <div className={styles.portal} />
          {depthMedia.map((item, index) => (
            <div className={styles.plane} key={item.id}>
              <Media item={item} locale={locale} index={index + 1} total={6} compact sizes="28vw" />
            </div>
          ))}
        </div>

        {showCanvas && (
          <div className={styles.canvas} aria-hidden="true">
            <Scene progress={progress} />
          </div>
        )}

        <div className={styles.copy}>
          <span className={`${styles.chapter} micro`}>04 / {content.immersion.heading}</span>
          <div className={`${styles.heading} display line-mask`}>
            <h2 id="immersion-title" data-immersion-heading>
              {content.immersion.heading}
            </h2>
          </div>
          <p className={`${styles.statement} lead`} data-immersion-copy>
            {content.immersion.statement}
          </p>
          <span className={`${styles.depthAxis} micro`}>Foreground / Background</span>
        </div>
      </div>
    </section>
  );
}
