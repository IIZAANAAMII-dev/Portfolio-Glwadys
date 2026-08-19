'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaSlot } from '../media/MediaSlot';
import { EASE, MQ, SCRUB, prefersReducedMotion, registerGsap } from '../lib/motion';

const SHEET_IDS = Array.from({ length: 12 }, (_, i) => `SHEET_${String(i + 1).padStart(2, '0')}`);
const BEHIND_IDS = Array.from({ length: 4 }, (_, i) => `BEHIND_${String(i + 1).padStart(2, '0')}`);
const STRATEGY_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;
const BRAND_KEYS = ['pillarsTitle', 'toneTitle', 'paletteTitle', 'messagingTitle'] as const;

/**
 * Act 03 — Creative Process.
 *
 * From contact sheet to moodboard to brand system, then a horizontal strategy
 * track. One pinned scene where the same space darkens, reorders and lightens.
 *
 * Pin 3 of 5.
 */
export function ActCreative() {
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

          const tl = gsap.timeline({
            defaults: { ease: EASE.none },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=260%' : '+=150%',
              pin: true,
              pinSpacing: true,
              scrub: SCRUB.default,
              invalidateOnRefresh: true,
            },
          });

          // 0–18% — the room darkens, the contact sheet resolves on the editing table.
          tl.fromTo(
            root.current,
            { '--ground': '#0B0B0C', '--fg': '#F7F6F4' },
            { '--ground': '#0B0B0C', '--fg': '#F7F6F4', duration: 0.05 },
            0,
          );

          tl.fromTo('[data-c="contact"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0);

          tl.fromTo(
            '[data-c="contact-tile"]',
            {
              y: 55,
              autoAlpha: 0,
              scale: 0.94,
              rotation: (i: number) => (i % 3 === 0 ? 5 : i % 3 === 1 ? -4 : 2),
            },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              rotation: 0,
              stagger: 0.02,
              duration: 0.18,
            },
            0.03,
          );

          // 18–38% — hold the sheet, the visitor reads the editing table.
          // 38–55% — the sheet gathers itself into the brand system. Ground turns ivory.
          tl.to(
            root.current,
            { '--ground': '#F4F1EA', '--fg': '#14120F', duration: 0.2, ease: EASE.sine },
            0.35,
          );

          tl.to('[data-c="contact"]', { autoAlpha: 0, duration: 0.1 }, 0.38);
          tl.fromTo('[data-c="brand"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.45);

          // 55–72% — the brand system holds.
          // 72–100% — the strategy track slides in from the right.
          tl.to('[data-c="brand"]', { autoAlpha: 0.25, duration: 0.1 }, 0.72);
          tl.fromTo('[data-c="strategy"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.74);
          tl.fromTo(
            '[data-c="track"]',
            { xPercent: 12 },
            { xPercent: -75, duration: 0.26 },
            0.74,
          );

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
    <section ref={root} className="creative scene ground-ivory" aria-label={t('brand.title')}>
      <div className="creative__contact" data-c="contact" aria-hidden="true">
        <div className="creative__annotations">
          <span className="meta">SELECT</span>
          <span className="meta">CROP</span>
          <span className="meta">TONE</span>
        </div>
        <div className="creative__sheet-grid">
          {SHEET_IDS.map((id) => (
            <MediaSlot key={id} slot={id} ratio="4 / 3" className="creative__tile" />
          ))}
        </div>
      </div>

      <div className="creative__brand" data-c="brand">
        <h2 className="creative__brand-title display">{t('brand.title')}</h2>
        <p className="creative__brand-subtitle body">{t('brand.subtitle')}</p>
        <div className="creative__brand-grid">
          {BEHIND_IDS.map((id, i) => (
            <div key={id} className="creative__brand-panel">
              <span className="meta creative__brand-label">{t(`brand.${BRAND_KEYS[i]}`)}</span>
              <MediaSlot slot={id} className="creative__tile" />
            </div>
          ))}
        </div>
      </div>

      <div className="creative__strategy" data-c="strategy" aria-label={t('strategy.title')}>
        <div className="creative__track" data-c="track">
          {STRATEGY_KEYS.map((key) => (
            <div key={key} className="creative__panel">
              <h3 className="creative__panel-title head">{t(`strategy.${key}`)}</h3>
              <p className="creative__panel-body body">{t(`strategy.${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
