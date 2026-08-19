'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaSlot } from '../media/MediaSlot';
import { EASE, SCRUB, prefersReducedMotion, registerGsap } from '../lib/motion';

/**
 * Act 04 — Work.
 *
 * Three case studies with distinct tones: Yuna (still, macro, jewellery),
 * MGC (energy, community, scrapbook), Comptoir (quiet, product, one macro zoom).
 *
 * No pinning here; each case breathes as its own scene.
 */
export function ActWork() {
  const t = useTranslations();
  const root = useRef<HTMLDivElement>(null);

  const yunaSkills = t.raw('work.yuna.skills') as string[];
  const mgcSkills = t.raw('work.mgc.skills') as string[];
  const comptoirSkills = t.raw('work.comptoir.skills') as string[];

  useGSAP(
    () => {
      registerGsap();
      const reduced = prefersReducedMotion();

      if (reduced) return;

      // Yuna: slow, elegant reveal.
      gsap.from('[data-w="yuna-content"]', {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-w="yuna"]', start: 'top 80%' },
      });

      gsap.from('[data-w="yuna-media"] .media', {
        clipPath: 'inset(12% 12% 12% 12%)',
        scale: 1.15,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.inOut,
        scrollTrigger: { trigger: '[data-w="yuna-media"]', start: 'top 80%' },
      });

      // MGC: enter with slight rotation and warmth.
      gsap.from('[data-w="mgc-content"]', {
        y: 55,
        autoAlpha: 0,
        duration: 0.8,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-w="mgc"]', start: 'top 80%' },
      });

      gsap.from('[data-w="mgc-media"] .media', {
        y: 40,
        rotation: (i: number) => (i % 2 === 0 ? 4 : -5),
        autoAlpha: 0,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.08,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-w="mgc-media"]', start: 'top 80%' },
      });

      // Comptoir: almost nothing, then a single macro zoom.
      gsap.from('[data-w="comptoir-content"]', {
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-w="comptoir"]', start: 'top 80%' },
      });

      gsap.from('[data-w="comptoir-media"] .media', {
        y: 30,
        autoAlpha: 0,
        duration: 1.0,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-w="comptoir-media"]', start: 'top 80%' },
      });

      gsap.to('.work__comptoir-macro', {
        scale: 1.35,
        y: '-8%',
        ease: EASE.none,
        scrollTrigger: {
          trigger: '.work__comptoir-macro',
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB.tight,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (['[data-w="yuna"]', '[data-w="yuna-media"]', '[data-w="mgc"]', '[data-w="mgc-media"]', '[data-w="comptoir"]', '[data-w="comptoir-media"]', '.work__comptoir-macro'].some((s) => st.vars.trigger === s)) {
            st.kill();
          }
        });
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} id="work" className="work" aria-label={t('work.title')}>
      <section className="work__case scene ground-ink" data-w="yuna">
        <div className="work__content" data-w="yuna-content">
          <span className="meta">{t('work.yuna.location')} · {t('work.yuna.period')}</span>
          <h2 className="work__title display">{t('work.yuna.title')}</h2>
          <p className="work__summary body">{t('work.yuna.summary')}</p>
          <div className="work__skills">
            {yunaSkills.map((s) => (
              <span key={s} className="meta">{s}</span>
            ))}
          </div>
        </div>
        <div className="work__media work__media--yuna" data-w="yuna-media">
          <MediaSlot slot="YUNA_PRODUCT_MACRO_01" className="work__yuna-macro" priority />
          <MediaSlot slot="YUNA_STORY_01" className="work__yuna-story" sizes="24vw" />
        </div>
      </section>

      <section className="work__case scene ground-ivory-deep" data-w="mgc">
        <div className="work__content work__content--mgc" data-w="mgc-content">
          <span className="meta work__mgc-meta">{t('work.mgc.location')} · {t('work.mgc.period')}</span>
          <h2 className="work__title display">{t('work.mgc.title')}</h2>
          <p className="work__summary body">{t('work.mgc.summary')}</p>
          <div className="work__skills">
            {mgcSkills.map((s) => (
              <span key={s} className="meta work__mgc-meta">{s}</span>
            ))}
          </div>
        </div>
        <div className="work__media work__media--mgc" data-w="mgc-media">
          <MediaSlot slot="MGC_EVENT_WIDE_01" className="work__mgc-wide" />
          <MediaSlot slot="MGC_EVENT_WIDE_02" className="work__mgc-wide" />
        </div>
      </section>

      <section className="work__case scene ground-espresso" data-w="comptoir">
        <div className="work__content work__content--comptoir" data-w="comptoir-content">
          <span className="meta">{t('work.comptoir.location')} · {t('work.comptoir.period')}</span>
          <h2 className="work__title display">{t('work.comptoir.title')}</h2>
          <p className="work__summary body">{t('work.comptoir.summary')}</p>
          <div className="work__skills">
            {comptoirSkills.map((s) => (
              <span key={s} className="meta">{s}</span>
            ))}
          </div>
        </div>
        <div className="work__media work__media--comptoir" data-w="comptoir-media">
          <MediaSlot slot="COMPTOIR_PRODUCT_01" ratio="4 / 5" className="work__comptoir-hero" priority />
          <MediaSlot slot="COMPTOIR_PRODUCT_02" ratio="9 / 16" className="work__comptoir-macro" />
        </div>
      </section>
    </div>
  );
}
