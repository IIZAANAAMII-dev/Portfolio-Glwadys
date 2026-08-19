'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaSlot } from '../media/MediaSlot';
import { EASE, MQ, SCRUB, prefersReducedMotion, registerGsap } from '../lib/motion';

const YEARS = [2021, 2022, 2023, 2024, 2025, 2026] as const;
const SERVICES = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'] as const;

/**
 * Act 05 — Journey, Expertise, Contact.
 *
 * The closing movement: a horizontal timeline of years, a typographic list of
 * real services, then the final contact call. The nav capsule was born in Act 1;
 * this is where the loop ends.
 *
 * Pin 4 of 5.
 */
export function ActFinal() {
  const t = useTranslations();
  const root = useRef<HTMLDivElement>(null);

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

          const journey = gsap.timeline({
            defaults: { ease: EASE.none },
            scrollTrigger: {
              trigger: '[data-f="journey"]',
              start: 'top top',
              end: desktop ? '+=180%' : '+=120%',
              pin: true,
              pinSpacing: true,
              scrub: SCRUB.default,
              invalidateOnRefresh: true,
            },
          });

          journey.to('[data-f="track"]', { xPercent: -83.33, duration: 1 });

          return () => {
            journey.scrollTrigger?.kill();
            journey.kill();
          };
        },
      );

      gsap.from('[data-f="expertise-item"]', {
        y: 55,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-f="expertise"]', start: 'top 80%' },
      });

      gsap.from('[data-f="contact"]', {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.out,
        scrollTrigger: { trigger: '[data-f="contact"]', start: 'top 80%' },
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} id="journey" className="final" aria-label={t('journey.title')}>
      <section className="final__journey scene ground-ink" data-f="journey" aria-label={t('journey.title')}>
        <div className="journey__meta meta">{t('journey.title')}</div>
        <div className="journey__playhead" aria-hidden="true" />
        <div className="journey__track" data-f="track">
          {YEARS.map((year) => (
            <div key={year} className="journey__panel">
              <span className="journey__year mega">{year}</span>
              <span className="journey__role meta">{t(`journey.y${year}`)}</span>
              <MediaSlot slot={`JOURNEY_${year}`} className="journey__media" />
            </div>
          ))}
        </div>
      </section>

      <section className="final__expertise scene ground-ink" data-f="expertise" aria-label={t('services.title')}>
        <div className="expertise__header">
          <span className="meta">{t('services.tag')}</span>
          <h2 className="expertise__title display">{t('services.title')}</h2>
          <p className="expertise__subtitle body">{t('services.subtitle')}</p>
        </div>
        <div className="expertise__list">
          {SERVICES.map((key) => (
            <div key={key} className="expertise__item" data-f="expertise-item">
              <h3 className="expertise__name head">{t(`services.${key}`)}</h3>
              <p className="expertise__desc body">{t(`services.${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="final__contact scene ground-ink" data-f="contact" id="contact" aria-label={t('contact.tag')}>
        <span className="meta">{t('contact.tag')}</span>
        <h2 className="contact__headline display">{t('contact.headline')}</h2>
        <p className="contact__sub body">{t('contact.sub')}</p>
        <div className="contact__links">
          <a className="contact__link" href="mailto:glwadys.dalleau29@gmail.com">
            <span className="meta">{t('contact.emailLabel')}</span>
            <span className="contact__value head">glwadys.dalleau29@gmail.com</span>
          </a>
          <a className="contact__link" href="https://linkedin.com/in/glwadysdalleau" target="_blank" rel="noreferrer">
            <span className="meta">{t('contact.linkedinLabel')}</span>
            <span className="contact__value head">linkedin.com/in/glwadysdalleau</span>
          </a>
        </div>
        <p className="contact__note meta">{t('contact.locationNote')}</p>
      </section>

      <footer className="final__footer scene ground-ink">
        <span className="meta">{t('footer.rights')}</span>
        <span className="meta">{t('footer.craft')}</span>
        <a className="meta" href="#top">{t('footer.backToTop')}</a>
      </footer>
    </div>
  );
}
