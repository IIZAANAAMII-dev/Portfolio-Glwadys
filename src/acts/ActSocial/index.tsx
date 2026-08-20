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
        {
          isDesktop: MQ.desktop,
          isMobile: MQ.mobile,
          isReduced: MQ.reduced,
        },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            isReduced: boolean;
          };

          if (isReduced) return;

          const dominant = q<HTMLElement>('[data-social-dominant]')[0];
          const satellites = q<HTMLElement>('[data-social-satellite]');
          const behind = q<HTMLElement>('[data-behind]')[0];
          const behindMediaEls = q<HTMLElement>('[data-behind-media]');
          const firstSatellite = satellites[0];
          if (!dominant || !behind || !firstSatellite) return;

          gsap.set(satellites, {
            autoAlpha: 0,
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            yPercent: (i: number) => (i % 2 === 0 ? 24 : -18),
          });
          gsap.set(behindMediaEls, { scale: 0.94, autoAlpha: 0 });

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
                clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
                yPercent: 0,
                stagger: 0.06,
                duration: 0.22,
              },
              0,
            )
            .to(dominant, { scale: 1.08, duration: 0.26 }, 0.12)
            .to(firstSatellite, { xPercent: 38, yPercent: -12, scale: 1.12, duration: 0.25 }, 0.24)
            .to(dominant, { scale: 0.82, yPercent: 8, duration: 0.24 }, 0.3)
            .to(
              satellites,
              {
                xPercent: (i: number) => (i % 2 === 0 ? -45 : 45),
                rotation: (i: number) => (i % 2 === 0 ? -1.5 : 1.5),
                clipPath: 'polygon(0 0, 100% 0, 100% 18%, 0 42%)',
                duration: 0.28,
              },
              0.52,
            )
            .to(
              behind,
              {
                clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
                duration: 0.34,
              },
              0.5,
            )
            .to(
              behindMediaEls,
              { scale: 1, autoAlpha: 1, stagger: 0.05, duration: 0.26 },
              0.56,
            )
            .to(q<HTMLElement>('[data-behind-label]'), { autoAlpha: 1, y: 0, duration: 0.2 }, 0.62)
            .to(q<HTMLElement>('[data-social-statement]'), { autoAlpha: 1, y: 0, duration: 0.22 }, 0.68)
            .to(q<HTMLElement>('[data-social-layers]'), { autoAlpha: 1, y: 0, duration: 0.2 }, 0.72)
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
                scale: isDesktop ? 1.04 : 1,
                rotation: 0,
                duration: 0.28,
              },
              0.74,
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

        <span className={`${styles.chapter} micro`}>02 / {content.social.heading}</span>
        <p className={styles.frontLabel}>{content.social.front}</p>
        <span className={`${styles.behindLabel} micro`} data-behind-label>
          {content.social.behind}
        </span>

        <div className={styles.dominant} data-social-dominant>
          <Media item={heroVertical} locale={locale} index={1} total={5} sizes="24vw" />
        </div>

        {socialSatellites.map((item, index) => (
          <div className={styles.satellite} data-social-satellite key={item.id}>
            <Media
              item={item}
              locale={locale}
              index={index + 2}
              total={5}
              compact={index > 1}
              sizes="18vw"
            />
          </div>
        ))}

        <div className={styles.behind} data-behind>
          <div className={styles.behindGrid}>
            {behindMedia.map((item, index) => (
              <div className={styles.behindMedia} data-behind-media key={item.id}>
                <Media item={item} locale={locale} index={index + 1} total={2} sizes="34vw" />
              </div>
            ))}
          </div>
        </div>

        <p className={`${styles.statement} lead`} data-social-statement>
          {content.social.statement}
        </p>
        <ul className={`${styles.layers} micro`} data-social-layers>
          {content.social.layers.map((layer) => (
            <li key={layer}>{layer}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
