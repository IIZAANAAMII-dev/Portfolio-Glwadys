'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { DUR, EASE, MQ, SCRUB, STAGGER } from '@/lib/motion';
import { emitContact } from '@/lib/scrollControl';

import styles from './ActContact.module.css';

interface Props {
  content: Content;
}

export function ActContact({ content }: Props) {
  const root = useRef<HTMLElement>(null);
  const manifestoSection = useRef<HTMLElement>(null);
  const contactSection = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const manifestoEl = manifestoSection.current;
      const contactEl = contactSection.current;
      if (!rootEl || !manifestoEl || !contactEl) return;
      const q = gsap.utils.selector(rootEl);
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isReduced } = context.conditions as { isReduced: boolean };

          ScrollTrigger.create({
            trigger: contactEl,
            start: 'top 52%',
            end: 'bottom 48%',
            onToggle: (self) => emitContact(self.isActive),
          });

          if (isReduced) return;

          const manifestoTl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: manifestoEl,
              start: 'top 78%',
              end: 'bottom 42%',
              scrub: SCRUB.narrative,
            },
          });

          manifestoTl
            .fromTo(
              q<HTMLElement>('[data-manifesto-line]'),
              { yPercent: 112 },
              { yPercent: 0, duration: 0.42, stagger: STAGGER.tight },
              0,
            )
            .fromTo(
              q<HTMLElement>('[data-manifesto-rule]'),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.32 },
              0.26,
            )
            .fromTo(
              q<HTMLElement>('[data-manifesto-note]'),
              { yPercent: 45, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.28 },
              0.38,
            )
            .to(q<HTMLElement>('[data-manifesto-copy]'), { yPercent: -5, duration: 0.3 }, 0.7);

          const contactTl = gsap.timeline({
            defaults: { ease: EASE.reveal },
            scrollTrigger: {
              trigger: contactEl,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          });

          contactTl
            .fromTo(
              q<HTMLElement>('[data-contact-name]'),
              { yPercent: 110 },
              { yPercent: 0, duration: DUR.editorial, stagger: STAGGER.base },
              0,
            )
            .fromTo(
              q<HTMLElement>('[data-contact-rule]'),
              { scaleX: 0 },
              { scaleX: 1, duration: DUR.editorial },
              0.18,
            )
            .fromTo(
              q<HTMLElement>('[data-contact-copy]'),
              { yPercent: 30, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: DUR.editorial, stagger: STAGGER.base },
              0.3,
            );
        },
      );

      return () => emitContact(false);
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={`act surface-wood ${styles.act}`}>
      <section ref={manifestoSection} className={styles.manifestoSection} aria-labelledby="manifesto-title">
        <div className={styles.manifestoStage}>
          <div className={`${styles.manifestoPage} paper-card`}>
            <span className={`${styles.manifestoEyebrow} micro`}>{content.manifesto.eyebrow}</span>
            <span className={`${styles.manifestoEdition} micro`}>Glwadys Dalleau / 2026</span>

            <h2 id="manifesto-title" className={styles.manifestoTitle} data-manifesto-copy>
              <span className={`${styles.manifestoLine} line-mask`}>
                <span data-manifesto-line>{content.manifesto.lineOne}</span>
              </span>
              <span className={`${styles.manifestoLine} line-mask`}>
                <span data-manifesto-line>{content.manifesto.lineTwo}</span>
              </span>
            </h2>

            <span className={styles.manifestoRule} data-manifesto-rule aria-hidden="true" />
            <p className={`${styles.manifestoNote} hand-note`} data-manifesto-note>
              {content.manifesto.note}
            </p>
            <span className={`${styles.manifestoAxis} micro`}>{content.contact.axis}</span>
          </div>
        </div>
      </section>

      <section ref={contactSection} className={styles.contactSection} aria-labelledby="contact-title">
        <div className={styles.stage}>
          <div className={`${styles.lastPage} paper-card`}>
            <span className={`${styles.chapter} micro`}>09 / {content.contact.heading}</span>
            <span className={`${styles.edition} micro`}>Portfolio 2026</span>

            <h2 id="contact-title" className={`${styles.name} monument`}>
              <span className={`${styles.nameLine} line-mask`}>
                <span data-contact-name>Glwadys</span>
              </span>
              <span className={`${styles.nameLine} line-mask`}>
                <span data-contact-name>Dalleau</span>
              </span>
            </h2>

            <span className={styles.rule} data-contact-rule aria-hidden="true" />
            <p className={`${styles.message} lead`} data-contact-copy>
              {content.contact.statement}
            </p>
            <span className={`${styles.finalNote} hand-note`} data-contact-copy aria-hidden="true">
              {content.contact.cta}
            </span>

            <div className={styles.links} data-contact-copy>
              <a className={styles.email} href={`mailto:${content.contact.email}`} data-cursor="view">
                {content.contact.email}
              </a>
              <a
                className={`${styles.linkedin} micro`}
                href={content.contact.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {content.contact.linkedinLabel} ↗
              </a>
            </div>

            <div className={`${styles.footerMeta} micro`} data-contact-copy>
              <span>01 / {content.contact.availability}</span>
              <span>02 / {content.contact.services}</span>
              <span>03 / {content.contact.languages}</span>
              <span>04 / {content.contact.axis}</span>
            </div>

            <span className={`${styles.copyright} micro`}>{content.contact.copyright}</span>
            <a className={`${styles.backTop} micro`} href="#act-opening">
              {content.contact.backToTop} ↑
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
