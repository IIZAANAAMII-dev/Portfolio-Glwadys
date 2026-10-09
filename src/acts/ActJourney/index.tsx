'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { ExpertiseOpeningFrame } from '@/acts/ActExpertise/ExpertiseOpeningFrame';
import expertiseStyles from '@/acts/ActExpertise/ActExpertise.module.css';

import { JourneyOpeningFrame } from './JourneyOpeningFrame';

import styles from './ActJourney.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActJourney({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const trackEl = track.current;
      if (!rootEl || !stageEl || !trackEl) return;
      const q = gsap.utils.selector(stageEl);

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          // The Work bridge already renders this exact frame at its end.
          // Hide incoming section background until that sticky film ends.
          gsap.set(rootEl, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: rootEl,
            start: 'top top',
            end: 'bottom top',
            onEnter: () => gsap.set(rootEl, { autoAlpha: 1 }),
            onEnterBack: () => gsap.set(rootEl, { autoAlpha: 1 }),
            onLeaveBack: () => gsap.set(rootEl, { autoAlpha: 0 }),
            onRefresh: (self) => {
              gsap.set(rootEl, { autoAlpha: self.scroll() >= self.start ? 1 : 0 });
            },
          });

          const entries = q<HTMLElement>('[data-journey-entry]');
          const chapters = q<HTMLElement>('[data-journey-chapter]');
          const mobileNow = q<HTMLElement>('[data-journey-now]');
          const media = q<HTMLElement>('[data-journey-media]');
          const progressBar = q<HTMLElement>('[data-journey-progress]')[0];
          const counter = q<HTMLElement>('[data-journey-counter]')[0];
          const handoff = q<HTMLElement>('[data-journey-handoff]')[0];
          if (!progressBar || !counter || !handoff || entries.length === 0) return;

          const driver = { value: 0 };
          let activeIndex = -1;
          const updateFocus = () => {
            // Desktop remains the author's cinematic horizontal contact-sheet
            // travel. Mobile is deliberately a different director: one
            // full-page photograph per chapter, cross-dissolving on scroll.
            // A vertical rail showed two cut-off years and too much dead space.
            if (!isDesktop) {
              const frame = driver.value * (entries.length - 1);
              const nextActive = Math.min(entries.length - 1, Math.max(0, Math.round(frame)));
              gsap.set(trackEl, { x: 0, y: 0 });
              const outgoing = Math.floor(frame);
              const incoming = Math.min(entries.length - 1, outgoing + 1);
              // Long readable holds, short editorial transitions:
              // 40% of each beat is fully readable, 20% is the paper
              // reveal, and 40% holds the next finished composition.
              const local = frame - outgoing;
              const wipe = Math.max(0, Math.min(1, (local - 0.4) / 0.2));
              entries.forEach((entry, index) => {
                // Real editorial page wipe, NOT two translucent cards
                // stacked on one another. The old photo always fills the
                // image while the new shot is physically revealed across it.
                const isOutgoing = index === outgoing;
                const isIncoming = incoming !== outgoing && index === incoming;
                const onScreen = isOutgoing || isIncoming;
                gsap.set(entry, {
                  x: 0,
                  yPercent: 0,
                  scale: 1,
                  autoAlpha: onScreen ? 1 : 0,
                  clipPath: isIncoming
                    ? 'inset(0 ' + ((1 - wipe) * 100).toFixed(2) + '% 0 0)'
                    : isOutgoing ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                  pointerEvents: index === nextActive ? 'auto' : 'none',
                  zIndex: isIncoming ? 2 : isOutgoing ? 1 : 0,
                });
                if (nextActive === index) entry.dataset.active = 'true';
                else delete entry.dataset.active;
                // Letterforms dissolve before the photographic wipe.
                // Never splice two half-readable words during a cross-frame.
                const ink = entry.querySelectorAll<HTMLElement>('[data-journey-ink]');
                const inkAlpha = isOutgoing
                  ? Math.max(0, 1 - wipe / 0.2)
                  : isIncoming ? Math.max(0, (wipe - 0.8) / 0.2) : 0;
                gsap.set(ink, { autoAlpha: inkAlpha });
                const mediaEl = media[index];
                if (mediaEl) gsap.set(mediaEl, { scale: 1, y: 0 });
              });
              gsap.set(progressBar, { scaleY: driver.value });
              if (activeIndex !== nextActive) {
                activeIndex = nextActive;
                counter.textContent = String(nextActive + 1).padStart(2, '0') + ' / ' + String(entries.length).padStart(2, '0');
                chapters.forEach((chapter, index) => {
                  if (index === nextActive) {
                    chapter.dataset.active = 'true';
                    chapter.setAttribute('aria-current', 'step');
                  mobileNow[index]?.setAttribute('data-active', 'true');
                  } else {
                    delete chapter.dataset.active;
                    chapter.removeAttribute('aria-current');
                  mobileNow[index]?.removeAttribute('data-active');
                  }
                });
              }
              return;
            }
            const offsets = entries.map((entry) => entry.offsetLeft);
            const first = offsets[0]!;
            const position = first + driver.value * (offsets[offsets.length - 1]! - first);
            const nextActive = offsets.reduce((closest, offset, index) =>
              Math.abs(offset - position) < Math.abs(offsets[closest]! - position) ? index : closest, 0);
            // Le compteur désigne la carte réellement sous la tête de lecture.
            gsap.set(trackEl, isDesktop
              ? { x: window.innerWidth * 0.28 - position, y: 0 }
              : { x: 0, y: -position });

            entries.forEach((entry, index) => {
              const spacing = Math.max(1, offsets[index + 1] !== undefined
                ? offsets[index + 1]! - offsets[index]!
                : offsets[index]! - offsets[index - 1]!);
              const focus = Math.max(0, 1 - Math.abs(offsets[index]! - position) / spacing);
              gsap.set(entry, {
                scale: 0.94 + focus * 0.06,
                autoAlpha: 0.8 + focus * 0.2,
                y: (1 - focus) * 12,
              });
              if (nextActive === index) entry.dataset.active = 'true';
              else delete entry.dataset.active;

              const mediaEl = media[index];
              if (mediaEl) {
                gsap.set(mediaEl, { scale: 0.94 + focus * 0.06, y: (1 - focus) * 16 });
              }
            });

            gsap.set(progressBar, { scaleY: driver.value });
            if (activeIndex !== nextActive) {
              activeIndex = nextActive;
              counter.textContent = `${String(nextActive + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
              chapters.forEach((chapter, index) => {
                if (index === nextActive) {
                  chapter.dataset.active = 'true';
                  chapter.setAttribute('aria-current', 'step');
                  mobileNow[index]?.setAttribute('data-active', 'true');
                } else {
                  delete chapter.dataset.active;
                  chapter.removeAttribute('aria-current');
                  mobileNow[index]?.removeAttribute('data-active');
                }
              });
            }
          };

          gsap.set(progressBar, { scaleY: 0, transformOrigin: 'center top' });
          gsap.set(handoff, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' });
          // La timeline entre depuis la droite, comme une continuité du mouvement
          // des folios qui sortent à droite dans le pont précédent.
          gsap.set(trackEl, { x: 0, y: 0 });
          // The page is already typeset behind its reveal mask. This keeps the
          // handoff readable even when someone scrolls through it quickly.
          updateFocus();

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.journey, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.rail,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: updateFocus,
              onToggle: ({ isActive }) => {
                trackEl.style.willChange = isActive ? 'transform' : '';
              },
            },
          });

          tl
            .to(driver, { value: 1, duration: 0.82, onUpdate: updateFocus }, 0)
            .to(handoff, { clipPath: 'inset(0 0% 0 0)', duration: 0.18 }, 0.82)
            .to(
              q<HTMLElement>('[data-journey-chrome]'),
              { autoAlpha: 0, y: -8, duration: 0.12 },
              0.82,
            );

          return () => {
            trackEl.style.willChange = '';
            entries.forEach((entry) => delete entry.dataset.active);
            chapters.forEach((chapter) => {
              chapter.removeAttribute('aria-current');
              delete chapter.dataset.active;
            });
            mobileNow.forEach((node) => node.removeAttribute('data-active'));
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-ink ${styles.act}`} aria-labelledby="journey-title">
      <div ref={stage} className={styles.stage} data-cursor="drag">
        <JourneyOpeningFrame content={content} locale={locale} trackRef={track} />
        <div className={[styles.handoff, 'surface-paper'].join(' ')} data-journey-handoff aria-hidden="true">
          {/* Same DOM and styling as the first image of Expertise.
              The next chapter is physically revealed, not presented on a separate card. */}
          <div className={expertiseStyles.sheet}>
            <ExpertiseOpeningFrame content={content} decorative />
          </div>
        </div>
      </div>
    </section>
  );
}
