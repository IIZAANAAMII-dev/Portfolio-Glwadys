'use client';

import { useRef } from 'react';
import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { JourneyOpeningFrame } from '@/acts/ActJourney/JourneyOpeningFrame';
import journeyStyles from '@/acts/ActJourney/ActJourney.module.css';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ, SCRUB } from '@/lib/motion';
import { registerVisualFilm } from '@/lib/visualQa';
import styles from './WorkJourneyBridge.module.css';

/* Beat map (fractions of the pinned scroll).
   0    → 0.24  still: the Comptoir photograph, enlarged, is read as a cover
   0.24 → 0.70  the same print settles into Journey's wine window
   0.56 → 0.78  the passe-partout's own copy is set around the settling print
   0.78 → 1     still: exactly Journey's first frame */
const BEAT = { settleFrom: 0.24, settleTo: 0.7, copyFrom: 0.56, still: 0.78 } as const;

/**
 * The last Work photograph becomes the first archive print. The print, its
 * window and the wine mat are Journey's own component (same DOM and CSS):
 * the bridge only enlarges that print at the start, so the seam into
 * Journey is the same element at the same box, never a crossfade.
 */
export function WorkJourneyBridge({ content, locale }: { content: Content; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (!root.current) return;
    const q = gsap.utils.selector(root.current);
    const mm = gsap.matchMedia();
    mm.add({ mobile: MQ.mobile, desktop: MQ.desktop, reduced: MQ.reduced }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const stage = q<HTMLElement>('[data-bridge-stage]')[0];
      const cover = q<HTMLElement>('[data-archive-cover]')[0];
      const imprint = q<HTMLElement>('[data-bridge-imprint]')[0];
      if (!stage || !cover || !imprint) return;

      /** Enlarged cover box, as a transform of the window box (origin 0 0). */
      const enlarged = () => {
        const css = getComputedStyle(cover);
        const gx = parseFloat(css.left);
        const gy = parseFloat(css.top);
        const w = parseFloat(css.width);
        const h = parseFloat(css.height);
        const W = stage.clientWidth;
        const H = stage.clientHeight;
        // The print is read whole: above the navigation line (desktop, where
        // the imprint stands on it) or above the imprint (mobile), never under
        // the persistent nav or the language control.
        const pad = desktop ? 24 : 12;
        const floor = desktop
          ? H - parseFloat(getComputedStyle(imprint).bottom) - 12
          : imprint.offsetTop - 16;
        const room = Math.max(0, floor - pad);
        let k: number;
        let left: number;
        if (desktop) {
          // As tall as that room allows, centred on the window, and always to
          // the right of the imprint so the copy never sits on the photograph.
          k = Math.max(1, room / h);
          left = Math.max(gx + (w - k * w) / 2, imprint.offsetLeft + imprint.offsetWidth + 24);
        } else {
          k = Math.max(1, Math.min(W / w, room / h));
          left = (W - k * w) / 2;
        }
        let top = pad + (room - k * h) / 2;
        // The enlarged print always contains the window it settles into.
        left = Math.min(gx, Math.max(gx + w * (1 - k), left));
        top = Math.min(gy, Math.max(gy + h * (1 - k), top));
        return { x: left - gx, y: top - gy, scale: k };
      };

      gsap.set(cover, { transformOrigin: '0 0' });
      const tl = gsap.timeline({ scrollTrigger: {
        trigger: root.current, start: 'top top', end: '+=140%',
        pin: stage, scrub: SCRUB.narrative, invalidateOnRefresh: true,
      } });
      tl.fromTo(cover,
        { x: () => enlarged().x, y: () => enlarged().y, scale: () => enlarged().scale },
        { x: 0, y: 0, scale: 1, duration: BEAT.settleTo - BEAT.settleFrom, ease: 'power2.inOut' },
        BEAT.settleFrom)
        .fromTo(imprint, { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -16, duration: 0.14, ease: 'power1.in' }, BEAT.settleFrom)
        .fromTo(q('[data-mat-copy]'), { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.02, ease: 'power2.out' }, BEAT.copyFrom)
        .to({}, { duration: 1 - BEAT.still }, BEAT.still);
      return registerVisualFilm('work-journey', tl, { cover: 0.12, turn: 0.47, aperture: 0.96 });
    });
    return () => mm.revert();
  }, { scope: root });
  return (
    <section ref={root} className={styles.bridge} data-work-journey-bridge aria-hidden="true">
      <span id="act-journey-handoff" />
      <div className={`${journeyStyles.stage} ${styles.stage}`} data-bridge-stage>
        <JourneyOpeningFrame content={content} locale={locale} preview />
        <div className={styles.imprint} data-bridge-imprint>
          <span className="micro">06 — 07 / {content.journey.heading}</span>
          <span className={styles.title}>{content.work.projects[2]?.name}</span>
          <span className="micro">{content.work.caseLabels.visualNote}</span>
        </div>
      </div>
    </section>
  );
}
