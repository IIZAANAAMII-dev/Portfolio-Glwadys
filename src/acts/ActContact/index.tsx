'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { DUR, EASE, MQ, STAGGER } from '@/lib/motion';
import { emitContact } from '@/lib/scrollControl';

import styles from './ActContact.module.css';

interface Props {
  content: Content;
}

export function ActContact({ content }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      if (!rootEl) return;
      const q = gsap.utils.selector(rootEl);
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isReduced } = context.conditions as { isReduced: boolean };

          ScrollTrigger.create({
            trigger: rootEl,
            start: 'top 52%',
            end: 'bottom 48%',
            onToggle: (self) => emitContact(self.isActive),
          });

          if (isReduced) return;

          const tl = gsap.timeline({
            defaults: { ease: EASE.reveal },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          });

          tl
            .fromTo(
              q<HTMLElement>('[data-contact-name]'),
              { yPercent: 110 },
              { yPercent: 0, duration: DUR.editorial, stagger: STAGGER.base },
              0,
            )
            .fromTo(q<HTMLElement>('[data-contact-rule]'), { scaleX: 0 }, { scaleX: 1, duration: DUR.editorial }, 0.18)
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
            one last note — let’s make it memorable
          </span>

          <div className={styles.links} data-contact-copy>
            <a className={styles.email} href={`mailto:${content.contact.email}`}>
              {content.contact.email}
            </a>
            <a className={`${styles.linkedin} micro`} href={content.contact.linkedin} target="_blank" rel="noreferrer">
              {content.contact.linkedinLabel} ↗
            </a>
          </div>

          <span className={`${styles.availability} micro`}>{content.contact.availability}</span>
          <span className={`${styles.axis} micro`}>{content.contact.axis}</span>
        </div>
      </div>
    </footer>
  );
}
