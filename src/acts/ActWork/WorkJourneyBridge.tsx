'use client';

import { useRef } from 'react';
import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { comptoirMedia } from '@/content/media';
import { JourneyOpeningFrame } from '@/acts/ActJourney/JourneyOpeningFrame';
import journeyStyles from '@/acts/ActJourney/ActJourney.module.css';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ, SCRUB } from '@/lib/motion';
import { registerVisualFilm } from '@/lib/visualQa';
import { Media } from '@/ui/Media';
import styles from './WorkJourneyBridge.module.css';

/** A printed cover turns off the archive. The final aperture is not an
 * approximation: it is Journey's own component, crop and stage geometry. */
export function WorkJourneyBridge({ content, locale }: { content: Content; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!root.current) return;
    const q = gsap.utils.selector(root.current);
    const mm = gsap.matchMedia();
    mm.add({ mobile: MQ.mobile, desktop: MQ.desktop, reduced: MQ.reduced }, (context) => {
      if (context.conditions?.reduced) return;
      const tl = gsap.timeline({ scrollTrigger: {
        trigger: root.current, start: 'top top', end: '+=140%',
        pin: q('[data-bridge-stage]')[0], scrub: SCRUB.narrative, invalidateOnRefresh: true,
      } });
      tl.to(q('[data-bridge-cover]'), {
        rotationY: -92, xPercent: -8, ease: 'power2.inOut', duration: 0.5,
        transformOrigin: 'left center',
      }, 0.25).set(q('[data-bridge-cover]'), { visibility: 'hidden' }, 0.76)
        .to({}, { duration: 0.24 }, 0.76);
      return registerVisualFilm('work-journey', tl, { cover: 0.12, turn: 0.5, aperture: 0.96 });
    });
    return () => mm.revert();
  }, { scope: root });
  return (
    <section ref={root} className={styles.bridge} data-work-journey-bridge aria-hidden="true">
      <span id="act-journey-handoff" />
      <div className={`${journeyStyles.stage} ${styles.stage}`} data-bridge-stage>
        <JourneyOpeningFrame content={content} locale={locale} preview />
        <div className={styles.cover} data-bridge-cover>
          <Media item={comptoirMedia[1]!} locale={locale} compact sizes="100vw" />
          <div className={styles.imprint}>
            <span className="micro">06 — 07 / {content.journey.heading}</span>
            <span className={styles.title}>{content.work.projects[2]?.name}</span>
            <span className="micro">{content.work.caseLabels.visualNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
