'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';

import { ExpertiseOpeningFrame } from './ExpertiseOpeningFrame';

import styles from './ActExpertise.module.css';

interface Props {
  content: Content;
}

export function ActExpertise({ content }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const listEl = list.current;
      if (!rootEl || !stageEl || !listEl) return;
      const q = gsap.utils.selector(stageEl);
      const sheet = q<HTMLElement>('[data-expertise-sheet]')[0];
      const fold = q<HTMLElement>('[data-expertise-fold]')[0];
      const handoff = q<HTMLElement>('[data-expertise-handoff]')[0];
      if (!sheet || !fold || !handoff) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          // The actual Expertise page must not enter from the bottom as a
          // second copy of Journey's last frame. Journey's pinned frame owns
          // the transition until its final pixel; then the identical real
          // page takes over at the exact same screen coordinates.
          // Hide the entire incoming surface, not only its stage: even an empty
          // ivory root would otherwise occlude the departing Journey frame.
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

          const entryEls = q<HTMLElement>('[data-expertise-row]');
          const liveNumber = q<HTMLElement>('[data-expertise-number]')[0];
          const viewport = listEl.parentElement as HTMLElement;
          const count = entryEls.length;
          let shown = -1;

          /* The list's actual y is the single source of truth. Numeral,
             active marker and plate opacity are all derived from it, so the
             chapter number can never disagree with the plate on screen,
             whatever the scrub lag or scroll direction. */
          const syncChapter = () => {
            const y = Number(gsap.getProperty(listEl, 'y')) || 0;
            const plate = Math.max(viewport.clientHeight, 1);
            let nearest = 0;
            let nearestDistance = Infinity;
            entryEls.forEach((entry, index) => {
              const distance = Math.abs(entry.offsetTop + y) / plate;
              if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = index;
              }
              // Physical page mask handles passage. Do not independently
              // fade actual words: 06 / Digital Marketing was nearly invisible
              // in the REAL 390px screenshot despite sitting inside the
              // viewport. One moving typographic plate stays ink-dark.
              entry.style.opacity = '1';
            });
            if (nearest === shown) return;
            shown = nearest;
            entryEls.forEach((entry, index) => {
              if (index === nearest) entry.dataset.active = 'true';
              else delete entry.dataset.active;
            });
            if (liveNumber) liveNumber.textContent = String(nearest + 1).padStart(2, '0');
          };

          // Handoff geometry mirrors ActContact's manifesto page exactly:
          // inset 0 clamp(1rem, 3vw, 2.75rem) on desktop, 0.75rem on mobile.
          const pageInset = () => {
            if (!isDesktop) return 12;
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            return Math.min(Math.max(window.innerWidth * 0.03, rem), rem * 2.75);
          };

          gsap.set(listEl, { y: 0 });
          gsap.set(fold, { scale: 0, transformOrigin: 'right top' });
          gsap.set(handoff, { yPercent: 100 });
          gsap.set(sheet, { clipPath: 'inset(0px 0px 0px 0px)' });
          syncChapter();

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            onUpdate: syncChapter,
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.expertise, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: syncChapter,
            },
          });

          // Seven plates share 0..0.8 of the film. Every plate owns a full
          // still hold (64 % of its slot) followed by a short turn. The list
          // always lands on a row's own top edge, so the last chapter is as
          // complete as the first — never aligned to the list's bottom.
          const slot = 0.8 / count;
          const hold = slot * 0.64;
          for (let i = 0; i < count - 1; i += 1) {
            tl.fromTo(
              listEl,
              { y: () => -(entryEls[i]?.offsetTop ?? 0) },
              {
                y: () => -(entryEls[i + 1]?.offsetTop ?? 0),
                duration: slot - hold,
                ease: EASE.handoff,
                immediateRender: false,
              },
              i * slot + hold,
            );
          }

          // 0.8 → 1: the Manifesto sheet rises over the opaque Expertise
          // page (no ghosting), then the sheet is trimmed to the exact inset
          // page ActContact continues with, fold corner included.
          tl
            .to(handoff, { yPercent: 0, duration: 0.12, ease: EASE.handoff }, 0.8)
            .to(
              sheet,
              {
                clipPath: () => `inset(0px ${pageInset()}px 0px ${pageInset()}px)`,
                duration: 0.08,
                ease: EASE.handoff,
              },
              0.91,
            )
            .to(fold, { scale: 1, duration: 0.07 }, 0.93)
            .set({}, {}, 1);

          return () => {
            entryEls.forEach((entry, index) => {
              entry.style.opacity = '';
              if (index === 0) entry.dataset.active = 'true';
              else delete entry.dataset.active;
            });
            if (liveNumber) liveNumber.textContent = '01';
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-labelledby="expertise-title">
      <div ref={stage} className={styles.stage}>
        <div className={styles.sheet} data-expertise-sheet>
          <ExpertiseOpeningFrame content={content} listRef={list} />
          <div className={styles.handoffLayer} data-expertise-handoff aria-hidden="true">
            <span className={styles.sheetFold} data-expertise-fold />
            <div className={styles.handoffMeta}>
              <span className="micro">{content.manifesto.eyebrow}</span>
              <span className="micro">Glwadys Dalleau / 2026</span>
            </div>
            <p className={styles.handoffTitle}>
              <span>{content.manifesto.lineOne}</span>
              <span>{content.manifesto.lineTwo}</span>
            </p>
            <span className={styles.handoffRule} />
            <span className={`${styles.handoffNote} hand-note`}>{content.manifesto.note}</span>
            <span className={`${styles.handoffAxis} micro`}>{content.contact.axis}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
