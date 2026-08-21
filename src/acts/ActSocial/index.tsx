'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { behindMedia, heroVertical, socialSatellites } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActSocial.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActSocial({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          const dominant = q<HTMLElement>('[data-social-dominant]')[0];
          const behind = q<HTMLElement>('[data-behind]')[0];
          const satellites = q<HTMLElement>('[data-social-satellite]');
          const behindMediaEls = q<HTMLElement>('[data-behind-media]');
          const behindDetails = q<HTMLElement>('[data-behind-detail]');
          const frontCopy = q<HTMLElement>('[data-front-copy]');
          const behindCopy = q<HTMLElement>('[data-behind-copy]');
          const firstSatellite = satellites[0];
          if (!dominant || !behind || !firstSatellite) return;

          gsap.set(satellites, {
            autoAlpha: 0,
            clipPath: 'inset(100% 0% 0% 0%)',
            yPercent: 14,
          });
          gsap.set(behind, { clipPath: 'inset(0% 0% 0% 100%)' });
          gsap.set(behindMediaEls, {
            clipPath: 'inset(0% 0% 100% 0%)',
            yPercent: 8,
          });
          gsap.set([...behindDetails, ...behindCopy], { autoAlpha: 0, y: 14 });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.social, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl
            .to(
              satellites,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                yPercent: 0,
                stagger: 0.045,
                duration: 0.24,
              },
              0.03,
            )
            .to(dominant, { scale: 1.055, duration: 0.24 }, 0.08)
            .to(firstSatellite, { yPercent: -7, duration: 0.2 }, 0.2)
            .to(frontCopy, { autoAlpha: 0, yPercent: -22, duration: 0.16 }, 0.34)
            .to(
              satellites,
              {
                autoAlpha: 0,
                xPercent: (index: number) => (index % 2 === 0 ? -16 : 16),
                clipPath: 'inset(0% 0% 100% 0%)',
                stagger: 0.025,
                duration: 0.2,
              },
              0.35,
            )
            .to(behind, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.32 }, 0.36)
            .to(dominant, { scale: 0.9, duration: 0.22 }, 0.42)
            .to(
              behindMediaEls,
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                yPercent: 0,
                stagger: 0.055,
                duration: 0.18,
              },
              0.44,
            )
            .to(
              [...behindCopy, ...behindDetails],
              { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.11 },
              0.49,
            )
            .to(
              behindMediaEls,
              { yPercent: (index: number) => (index === 0 ? -3 : 4), duration: 0.28 },
              0.66,
            )
            .to(
              dominant,
              {
                x: () => {
                  const rect = dominant.getBoundingClientRect();
                  return window.innerWidth / 2 - (rect.left + rect.width / 2);
                },
                y: () => {
                  const rect = dominant.getBoundingClientRect();
                  return window.innerHeight / 2 - (rect.top + rect.height / 2);
                },
                scale: () => {
                  const targetWidth = isDesktop
                    ? Math.min(window.innerWidth * 0.22, 17 * 16)
                    : Math.min(window.innerWidth * 0.58, 16 * 16);
                  return targetWidth / dominant.offsetWidth;
                },
                duration: 0.28,
              },
              0.73,
            )
            .to(
              [...behindMediaEls, ...behindDetails, ...behindCopy],
              { autoAlpha: 0, yPercent: -5, duration: 0.17 },
              0.79,
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-ink ${styles.act}`} aria-labelledby="social-title">
      <div ref={stage} className={styles.stage}>
        <h2 id="social-title" className="visually-hidden">
          {content.social.heading}
        </h2>

        <div className={styles.frontComposition} data-front-copy>
          <span className={`${styles.chapter} micro`}>02 / {content.social.heading}</span>
          <p className={styles.frontLabel}>{content.social.front}</p>
          <span className={`${styles.frontCount} micro`} aria-hidden="true">
            Front / 01—04
          </span>
        </div>

        <div className={styles.dominant} data-social-dominant>
          <Media item={heroVertical} locale={locale} index={1} total={4} sizes="24vw" preload={false} />
        </div>

        {socialSatellites.slice(0, 3).map((item, index) => (
          <div
            className={styles.satellite}
            data-social-satellite
            data-social-slot={index + 1}
            key={item.id}
          >
            <Media item={item} locale={locale} compact sizes="20vw" />
          </div>
        ))}

        <div className={styles.behind} data-behind>
          <span className={styles.behindWord} aria-hidden="true">
            Behind
          </span>
          <span className={styles.behindRule} data-behind-detail aria-hidden="true" />

          <figure className={styles.behindPrimary} data-behind-media>
            <Media item={behindMedia[0]!} locale={locale} sizes="52vw" />
            <figcaption className={`${styles.mediaCaption} micro`}>
              01 / {behindMedia[0]!.role}
            </figcaption>
          </figure>

          <figure className={styles.behindSecondary} data-behind-media>
            <Media item={behindMedia[1]!} locale={locale} sizes="22vw" />
            <figcaption className={`${styles.mediaCaption} micro`}>
              02 / {behindMedia[1]!.role}
            </figcaption>
          </figure>

          <div className={styles.behindCopy} data-behind-copy>
            <span className={`${styles.behindLabel} micro`}>{content.social.behind}</span>
            <p className={`${styles.statement} lead`}>{content.social.statement}</p>
            <ul className={`${styles.layers} micro`}>
              {content.social.layers.map((layer, index) => (
                <li key={layer}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {layer}
                </li>
              ))}
            </ul>
          </div>

          <span className={`${styles.behindFolio} micro`} data-behind-detail aria-hidden="true">
            Strategy / Production / Rhythm
          </span>
        </div>
      </div>
    </section>
  );
}
