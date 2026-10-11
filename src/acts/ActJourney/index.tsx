'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { registerVisualFilm } from '@/lib/visualQa';
import { clamp01, heldSteps, sampleAt, segment, settle } from '@/lib/holdScalar';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { ExpertiseOpeningFrame } from '@/acts/ActExpertise/ExpertiseOpeningFrame';
import { clearExpertisePaint, createExpertisePainter } from '@/acts/ActExpertise/expertisePainter';
import expertiseStyles from '@/acts/ActExpertise/ActExpertise.module.css';

import { JourneyArchive } from './JourneyArchive';

import styles from './ActJourney.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/* Beat map of the archive (fractions of the pinned scroll).
   0    → 0.03  still: the wine page frames the Comptoir print (bridge's last frame)
   0.03 → 0.13  the Comptoir print is filed along the ledge at its own year
   0.05 → 0.15  the passe-partout is lifted off, wine → wood, 2021 is revealed
   0.17 → 0.85  six prints, each one held for reading, one settle between them
   0.85 → 0.88  last print held
   0.88 → 1     the wine index page rises over the archive (Expertise frame 0) */
const BEAT = {
  fileFrom: 0.03,
  fileTo: 0.13,
  liftFrom: 0.05,
  liftTo: 0.15,
  readFrom: 0.17,
  readTo: 0.85,
  riseFrom: 0.88,
} as const;

export function ActJourney({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const stripEl = strip.current;
      if (!rootEl || !stageEl || !stripEl) return;
      const q = gsap.utils.selector(stageEl);

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;
          rootEl.dataset.enhanced = 'true';
          gsap.set(rootEl, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: rootEl, start: 'top top', end: 'bottom top',
            onEnter: () => gsap.set(rootEl, { autoAlpha: 1 }),
            onEnterBack: () => gsap.set(rootEl, { autoAlpha: 1 }),
            onLeaveBack: () => gsap.set(rootEl, { autoAlpha: 0 }),
            onRefresh: (self) => gsap.set(rootEl, { autoAlpha: self.scroll() >= self.start ? 1 : 0 }),
          });

          const gate = q<HTMLElement>('[data-archive-gate]')[0];
          const mat = q<HTMLElement>('[data-archive-mat]')[0];
          const handoff = q<HTMLElement>('[data-archive-handoff]')[0];
          const riseEdge = q<HTMLElement>('[data-archive-edge]')[0];
          const counter = q<HTMLElement>('[data-archive-counter]')[0];
          const prints = q<HTMLElement>('[data-archive-print]');
          const photos = q<HTMLElement>('[data-archive-photo]');
          const shades = q<HTMLElement>('[data-archive-shade]');
          const chapters = q<HTMLElement>('[data-archive-chapter]');
          const rolls = q<HTMLElement>('[data-archive-roll]');
          const indexClone = q<HTMLElement>('[data-index-clone]')[0];
          const cover = q<HTMLElement>('[data-archive-cover]')[0];
          if (!gate || !mat || !handoff || !riseEdge || !counter || !indexClone || !cover || prints.length === 0) return;
          // The rising index page is Expertise's first frame, painted by
          // Expertise's own painter at pos 0 (hero term, bands, rule).
          const indexPainter = createExpertisePainter(indexClone, isDesktop);

          const count = prints.length;
          const total = String(count).padStart(2, '0');
          const file = Math.min(count - 1, Math.max(0, Number(cover.dataset.file) || 0));
          let gateCx = 0;
          let centers: number[] = [];
          let stageH = 1;
          let shown = -1;

          // A print's resting offset in passage, |d| = distance to the gate.
          const passage = (d: number) => {
            const ad = Math.abs(d);
            return {
              sink: Math.min(ad, 1.4) * stageH * 0.014,
              turn: Math.max(-1, Math.min(1, d)) * 0.7 * Math.min(1, ad),
            };
          };

          const measure = () => {
            // Computed (fractional) sizes, not offsetWidth: rounding drifts
            // away from the shared aperture across six prints on small screens.
            const gateCss = getComputedStyle(gate);
            gateCx = parseFloat(gateCss.left) + parseFloat(gateCss.width) / 2;
            const gap = parseFloat(getComputedStyle(stripEl).columnGap) || 0;
            let left = prints[0]!.offsetLeft;
            centers = prints.map((print) => {
              const w = parseFloat(getComputedStyle(print).width);
              const centre = left + w / 2;
              left += w + gap;
              return centre;
            });
            stageH = stageEl.clientHeight || window.innerHeight;
            indexPainter.measure();
            indexPainter.paint(0, 0);
          };

          const driver = { t: 0 };
          const render = () => {
            const t = driver.t;
            const filed = settle(segment(t, BEAT.fileFrom, BEAT.fileTo));
            const lift = settle(segment(t, BEAT.liftFrom, BEAT.liftTo));
            const pos = heldSteps(segment(t, BEAT.readFrom, BEAT.readTo), count, 0.22);
            const rise = settle(segment(t, BEAT.riseFrom, 1));

            // 1. The Comptoir print slides along the ledge onto its own year
            //    (the same photograph, waiting off-frame at the 2024 print).
            //    It lands with that print's exact passage offset at pos 0.
            const target = passage(file);
            const reach = (centers[file] ?? 0) - (centers[0] ?? 0);
            cover.style.transform = `translate3d(${(filed * reach).toFixed(2)}px, ${(filed * target.sink).toFixed(2)}px, 0) rotate(${(filed * target.turn).toFixed(3)}deg)`;
            cover.style.visibility = filed >= 1 ? 'hidden' : 'visible';

            // 2. The passe-partout leaves upwards, carrying its title.
            mat.style.transform = `translate3d(0, ${(-lift * 100).toFixed(3)}%, 0)`;
            mat.style.visibility = lift >= 1 ? 'hidden' : 'visible';

            // 3. The prints travel as one physical row: x is a single value,
            //    centring the reading print (of any format) in the gate.
            const x = gateCx - sampleAt(centers, pos);
            stripEl.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            prints.forEach((print, index) => {
              const d = index - pos;
              const ad = Math.abs(d);
              // Resting print: exactly flat. Prints in passage sink a few
              // pixels and turn by less than a degree, like paper slid by hand.
              const { sink, turn } = passage(d);
              print.style.transform = `translate3d(0, ${sink.toFixed(2)}px, 0) rotate(${turn.toFixed(3)}deg)`;
              const shade = shades[index];
              if (shade) shade.style.opacity = (Math.min(1, ad) * 0.6).toFixed(3);
              const photo = photos[index];
              // Parallax stays inside the 1.08 overscale: no edge is ever exposed.
              const drift = Math.max(-1.2, Math.min(1.2, d));
              if (photo) photo.style.transform = `translate3d(${(-drift * 3.2).toFixed(3)}%, 0, 0) scale(1.08)`;
            });

            // 4. The reading column derives from the same position.
            chapters.forEach((chapter, index) => {
              const d = index - pos;
              const alpha = clamp01(1 - Math.abs(d) * 2.6);
              chapter.style.opacity = alpha.toFixed(3);
              chapter.style.transform = `translate3d(0, ${(d * 14).toFixed(2)}px, 0)`;
              chapter.style.visibility = alpha < 0.002 ? 'hidden' : 'visible';
            });
            rolls.forEach((roll) => {
              const lines = roll.childElementCount || 1;
              roll.style.transform = `translate3d(0, ${((-pos / lines) * 100).toFixed(4)}%, 0)`;
            });
            const active = Math.round(pos);
            if (shown !== active) {
              shown = active;
              counter.textContent = `${String(active + 1).padStart(2, '0')} / ${total}`;
              chapters.forEach((chapter, index) => {
                if (index === active) {
                  chapter.dataset.active = 'true';
                  chapter.setAttribute('aria-current', 'step');
                } else {
                  delete chapter.dataset.active;
                  chapter.removeAttribute('aria-current');
                }
              });
            }

            // 5. The wine index page rises from the lower paper edge.
            handoff.style.setProperty('--rise', rise.toFixed(4));
            handoff.style.visibility = rise <= 0 ? 'hidden' : 'visible';
            riseEdge.style.transform = `translate3d(0, ${((1 - rise) * stageH).toFixed(2)}px, 0)`;
            riseEdge.style.opacity = rise > 0 && rise < 1 ? '1' : '0';
          };

          measure();
          render();
          let alive = true;
          document.fonts?.ready.then(() => {
            if (!alive) return;
            measure();
            render();
          });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.journey, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => {
                measure();
                render();
              },
              onToggle: ({ isActive }) => {
                stripEl.style.willChange = isActive ? 'transform' : '';
              },
            },
          });
          tl.to(driver, { t: 1, duration: 1, onUpdate: render }, 0);

          const unregister = registerVisualFilm('journey', tl, {
            aperture: 0, filing: 0.09, first: 0.17, second: 0.306, third: 0.442,
            fourth: 0.578, fifth: 0.714, sixth: 0.85, index: 1,
          });
          return () => {
            alive = false;
            unregister();
            delete rootEl.dataset.enhanced;
            stripEl.style.willChange = '';
            [mat, cover, stripEl, riseEdge, ...prints, ...photos, ...rolls, ...chapters].forEach((node) => {
              node.style.transform = '';
              node.style.visibility = '';
              node.style.opacity = '';
            });
            shades.forEach((node) => (node.style.opacity = ''));
            handoff.style.removeProperty('--rise');
            handoff.style.visibility = '';
            clearExpertisePaint(indexClone);
            chapters.forEach((chapter, index) => {
              chapter.removeAttribute('aria-current');
              if (index === 0) chapter.dataset.active = 'true';
              else delete chapter.dataset.active;
            });
            counter.textContent = `01 / ${total}`;
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-wood ${styles.act}`} aria-labelledby="journey-title">
      <ol className="visually-hidden" aria-label={content.journey.heading}>
        {content.journey.entries.map((entry) => (
          <li key={entry.year}>{entry.year} — {entry.chapter}. {entry.label}. {entry.place}.</li>
        ))}
      </ol>
      <div ref={stage} className={styles.stage}>
        <JourneyArchive content={content} locale={locale} stripRef={strip} />
        <div className={[styles.handoff, 'surface-bordeaux'].join(' ')} data-archive-handoff aria-hidden="true">
          {/* Same DOM, CSS and painter state as Expertise's first frame:
              the index page physically rises over the archive. */}
          <div className={expertiseStyles.sheet} data-index-clone>
            <ExpertiseOpeningFrame content={content} locale={locale} decorative />
          </div>
        </div>
        <span className={styles.riseEdge} data-archive-edge aria-hidden="true" />
      </div>
    </section>
  );
}
