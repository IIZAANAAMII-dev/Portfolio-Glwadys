'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaSlot } from '../media/MediaSlot';
import { EASE, MQ, SCRUB, prefersReducedMotion, registerGsap } from '../lib/motion';

/**
 * Act 02 — Social World.
 *
 * The hero satellite becomes a phone. The visitor scrolls through two faces of
 * the same craft: the public feed and the behind-the-scenes strategy, then the
 * phone breaks open into a single campaign frame.
 *
 * Pin 2 of 5.
 */
export function ActSocial() {
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const reduced = prefersReducedMotion();

      if (reduced) return;

      const mm = gsap.matchMedia();

      mm.add(
        { desktop: MQ.desktop, small: `(max-width: 1023px)`, reduced: MQ.reduced },
        (context) => {
          const { reduced: isReduced, desktop } = context.conditions as {
            desktop: boolean;
            small: boolean;
            reduced: boolean;
          };

          if (isReduced) return;

          const face = (v: 'front' | 'behind' | 'portal') =>
            root.current?.setAttribute('data-face', v);

          const tl = gsap.timeline({
            defaults: { ease: EASE.none },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=210%' : '+=140%',
              pin: true,
              pinSpacing: true,
              scrub: SCRUB.default,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (self.progress < 0.44) face('front');
                else if (self.progress < 0.78) face('behind');
                else face('portal');
              },
            },
          });

          // 0–25% — phone is born from below, front grid resolves behind it.
          tl.fromTo(
            '[data-s="phone"]',
            { yPercent: 55, scale: 0.5, autoAlpha: 0 },
            { yPercent: 0, scale: 1, autoAlpha: 1, duration: 0.24 },
            0,
          );

          tl.fromTo(
            '[data-s="front"]',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.15 },
            0.05,
          );

          // 20–55% — the screen scrolls as if the user is swiping a story feed.
          tl.to('[data-s="screen-content"]', { yPercent: -48, duration: 0.5 }, 0.2);

          // 44–54% — FRONT flips to BEHIND. The phone stays; what it shows changes.
          tl.to('[data-s="front"]', { autoAlpha: 0, duration: 0.08 }, 0.42);
          tl.fromTo(
            '[data-s="behind"]',
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.1 },
            0.46,
          );

          // 78–100% — the campaign frame bursts from behind the phone. The phone
          // dissolves; the image becomes the portal to the gallery.
          tl.fromTo(
            '[data-s="portal"]',
            { scale: 0.82, autoAlpha: 0 },
            { scale: 1.15, autoAlpha: 1, duration: 0.2 },
            0.78,
          );
          tl.to('[data-s="phone"]', { autoAlpha: 0, scale: 0.92, duration: 0.15 }, 0.8);
          tl.to('[data-s="behind"]', { autoAlpha: 0.3, duration: 0.12 }, 0.82);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="social scene ground-ink"
      data-face="front"
      aria-label={t('social.title')}
    >
      <div className="social__switch">
        <span className="social__label social__label--front meta">{t('social.frontLabel')}</span>
        <span className="social__label social__label--behind meta">{t('social.behindLabel')}</span>
      </div>

      <div className="social__layers" aria-hidden="true">
        <div className="social__front" data-s="front">
          <div className="social__front-grid">
            <MediaSlot slot="PHONE_FEED_01" ratio="4 / 5" className="social__tile" />
            <MediaSlot slot="PHONE_FEED_02" ratio="4 / 5" className="social__tile" />
            <MediaSlot slot="PHONE_FEED_03" ratio="4 / 5" className="social__tile" />
            <MediaSlot slot="PHONE_FEED_04" ratio="4 / 5" className="social__tile" />
          </div>
        </div>

        <div className="social__behind" data-s="behind">
          <div className="social__behind-grid">
            <MediaSlot slot="BEHIND_01" className="social__tile" />
            <MediaSlot slot="BEHIND_02" className="social__tile" />
            <MediaSlot slot="BEHIND_03" className="social__tile" />
            <MediaSlot slot="BEHIND_04" className="social__tile" />
          </div>
        </div>
      </div>

      <div className="social__portal" data-s="portal" aria-hidden="true">
        <MediaSlot
          slot="CAMPAIGN_WIDE_01"
          className="social__portal-media"
          sizes="100vw"
          priority
        />
      </div>

      <div className="social__phone" data-s="phone" aria-label={t('social.title')}>
        <div className="phone__bezel">
          <div className="phone__screen">
            <div className="phone__screen-content" data-s="screen-content">
              <MediaSlot slot="PHONE_STORY_01" className="phone__story" />
              <MediaSlot slot="PHONE_STORY_02" className="phone__story" />
              <MediaSlot slot="PHONE_STORY_03" className="phone__story" />
            </div>
          </div>
        </div>
      </div>

      <div className="social__caption">
        <span className="meta">{t('social.tag')}</span>
        <span className="meta social__hint" data-s="dive-hint">
          {t('social.diveHint')}
        </span>
      </div>
    </section>
  );
}
