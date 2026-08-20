'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { heroVertical, phoneFeed, phoneStory } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActPhone.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActPhone({ content, locale }: Props) {
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

          const device = q<HTMLElement>('[data-phone]')[0];
          const hero = q<HTMLElement>('[data-phone-hero]')[0];
          const feed = q<HTMLElement>('[data-phone-feed]')[0];
          const story = q<HTMLElement>('[data-phone-story]')[0];
          if (!device || !hero || !feed || !story) return;

          gsap.set(device, {
            '--phone-bezel': '0px',
            '--phone-radius': '0px',
            '--phone-island': '0px',
            aspectRatio: '9 / 16',
          });

          const labels = q<HTMLElement>('[data-phone-beat]');
          const feedLabel = labels[0];
          const focusLabel = labels[1];
          const storyLabel = labels[2];
          const campaignLabel = labels[3];
          if (!feedLabel || !focusLabel || !storyLabel || !campaignLabel) return;
          gsap.set(labels, { yPercent: 110, autoAlpha: 0 });
          gsap.set(q<HTMLElement>('[data-phone-detail]'), { autoAlpha: 0, y: 12 });
          gsap.set(q<HTMLElement>('[data-phone-entry]'), { autoAlpha: 0, y: -10 });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.phone, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl
            .to(
              q<HTMLElement>('[data-phone-entry]'),
              { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.1 },
              0.02,
            )
            .to(
              device,
              {
                '--phone-bezel': isDesktop ? '10px' : '8px',
                '--phone-radius': isDesktop ? '44px' : '40px',
                '--phone-island': isDesktop ? '92px' : '78px',
                aspectRatio: '9 / 19.5',
                duration: 0.14,
                onComplete: () => {
                  device.dataset.built = 'true';
                },
                onReverseComplete: () => {
                  delete device.dataset.built;
                },
              },
              0,
            )
            .to(q<HTMLElement>('[data-phone-button]'), { scaleY: 1, duration: 0.1 }, 0.04)
            .to(feedLabel, { yPercent: 0, autoAlpha: 1, duration: 0.12 }, 0.08)
            .to(
              q<HTMLElement>('[data-phone-detail]'),
              { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.12 },
              0.08,
            )
            .to(hero, { yPercent: -102, duration: 0.16 }, 0.16)
            .to(feed, { yPercent: -104, duration: 0.16 }, 0.16)
            .to(feed, { yPercent: -128, duration: 0.14 }, 0.3)
            .to(feedLabel, { yPercent: -110, autoAlpha: 0, duration: 0.08 }, 0.31)
            .to(focusLabel, { yPercent: 0, autoAlpha: 1, duration: 0.1 }, 0.34)
            .to(q<HTMLElement>('[data-phone-note]'), { xPercent: 0, autoAlpha: 1, duration: 0.12 }, 0.36)
            .to(
              story,
              { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', duration: 0.17 },
              0.38,
            )
            .to(focusLabel, { yPercent: -110, autoAlpha: 0, duration: 0.08 }, 0.4)
            .to(storyLabel, { yPercent: 0, autoAlpha: 1, duration: 0.1 }, 0.42)
            .to(q<HTMLElement>('[data-phone-campaign]'), { scale: 1.18, autoAlpha: 1, duration: 0.15 }, 0.6)
            .to(q<HTMLElement>('[data-breakout]'), { scaleX: 1, duration: 0.13 }, 0.63)
            .to(storyLabel, { yPercent: -110, autoAlpha: 0, duration: 0.08 }, 0.64)
            .to(campaignLabel, { yPercent: 0, autoAlpha: 1, duration: 0.1 }, 0.67)
            .to(q<HTMLElement>('[data-phone-note]'), { xPercent: 25, autoAlpha: 0, duration: 0.1 }, 0.7)
            .to(
              device,
              {
                scale: () => {
                  const rect = device.getBoundingClientRect();
                  return (window.innerWidth / rect.width) * 1.08;
                },
                aspectRatio: '9 / 16',
                duration: 0.3,
                ease: EASE.scrub,
              },
              0.7,
            )
            .to(
              q<HTMLElement>('[data-phone-ui]'),
              { autoAlpha: 0, scale: 0.92, duration: 0.13 },
              0.76,
            )
            .to(stageEl, { backgroundColor: 'var(--bordeaux)', duration: 0.22 }, 0.78)
            .to(q<HTMLElement>('[data-phone-campaign]'), { autoAlpha: 0, duration: 0.1 }, 0.9);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-labelledby="phone-title">
      <div ref={stage} className={styles.stage}>
        <h2 id="phone-title" className="visually-hidden">
          {content.phone.heading}
        </h2>

        <div className={styles.interface} data-phone-ui>
          <span className={`${styles.chapter} micro`} data-phone-entry>
            03 / {content.phone.heading}
          </span>
          <span className={`${styles.counter} micro`} data-phone-entry>
            09 : 16
          </span>
          <p className={`${styles.note} lead`} data-phone-note>
            {content.social.statement}
          </p>
          <span className={`${styles.digitalNote} hand-note`} data-phone-detail aria-hidden="true">
            reflection → digital
          </span>
          <span className={`${styles.archiveStamp} editorial-stamp`} data-phone-detail aria-hidden="true">
            {content.opening.axis.replace('↔', '/')}
          </span>
          <div className={styles.beat} aria-hidden="true">
            {content.phone.beats.map((beat) => (
              <span className="line-mask" key={beat}>
                <span data-phone-beat>{beat}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.device} data-phone>
          <span className={styles.sideButton} data-phone-button data-side="left" />
          <span className={styles.sideButton} data-phone-button data-side="right" />
          <span className={styles.island} aria-hidden="true" />

          <div className={styles.screen}>
            <div className={styles.screenHero} data-phone-hero>
              <Media
                item={heroVertical}
                locale={locale}
                className={styles.fillMedia}
                sizes="28vw"
                preload={false}
              />
            </div>

            <div className={styles.feed} data-phone-feed>
              {phoneFeed.concat(phoneFeed).map((item, index) => (
                <div className={styles.feedItem} key={`${item.id}-${index}`}>
                  <Media item={item} locale={locale} compact sizes="12vw" />
                </div>
              ))}
            </div>

            <div className={styles.story} data-phone-story>
              <Media item={phoneStory} locale={locale} className={styles.fillMedia} sizes="28vw" />
            </div>

            <div className={styles.campaign} data-phone-campaign>
              <span className={styles.campaignWord}>Campaign</span>
            </div>
          </div>
        </div>

        <span className={styles.breakout} data-breakout aria-hidden="true" />
      </div>
    </section>
  );
}
