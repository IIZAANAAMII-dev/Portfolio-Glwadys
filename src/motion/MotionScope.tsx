'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { gsap, ScrollTrigger } from './gsap';

interface Props {
  kind: 'hero' | 'journey';
  className?: string;
  children: ReactNode;
}

/** Two small, scoped enhancements over server-rendered editorial content. */
export function MotionScope({ kind, className, children }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add({
        mobile: '(max-width: 767px)',
        desktop: '(min-width: 768px)',
        reduce: '(prefers-reduced-motion: reduce)',
      }, (match) => {
        const { mobile, reduce } = match.conditions!;
        const element = root.current!;
        if (kind === 'hero' && !reduce) {
          const marks = element.querySelectorAll('[data-hero-marks] [data-crop-stroke]');
          const crop = element.querySelector('[data-hero-crop]');
          const rule = element.querySelector('[data-reservation-rule]');
          gsap.from(marks, { strokeDashoffset: 1, duration: 0.55, stagger: 0.045, ease: 'power2.out' });
          gsap.from(rule, { scaleX: 0, duration: 0.6, ease: 'power3.out' });
          gsap.to(crop, {
            scale: mobile ? 0.94 : 0.96,
            clipPath: mobile ? 'inset(4% 5%)' : 'inset(3% 4%)',
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top top',
              end: mobile ? 'bottom 38%' : 'bottom 30%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        if (kind === 'journey') {
          const rows = [...element.querySelectorAll<HTMLElement>('[data-journey-year]')];
          const playhead = element.querySelector<HTMLElement>('[data-journey-playhead]')!;
          let current = -1;
          const select = (index: number) => {
            if (index === current) return;
            current = index;
            rows.forEach((row, i) => { row.dataset.active = String(i === index); });
          };
          const update = () => {
            const readingLine = window.innerHeight * 0.42;
            const closest = rows.reduce((best, row, i) => {
              const distance = Math.abs(row.getBoundingClientRect().top + 40 - readingLine);
              return distance < best.distance ? { index: i, distance } : best;
            }, { index: 0, distance: Infinity });
            select(closest.index);
          };
          ScrollTrigger.create({ trigger: element, start: 'top 70%', end: 'bottom 30%', onUpdate: update, onRefresh: update });
          if (mobile && !reduce) {
            gsap.fromTo(playhead, { scaleY: 0 }, {
              scaleY: 1, ease: 'none',
              scrollTrigger: { trigger: element, start: 'top 42%', end: 'bottom 42%', scrub: true, invalidateOnRefresh: true },
            });
          }
          const focusYear = (event: Event) => {
            const row = (event.target as HTMLElement).closest<HTMLElement>('[data-journey-year]');
            if (row) select(rows.indexOf(row));
          };
          element.addEventListener('focusin', focusYear);
          element.addEventListener('pointerdown', focusYear);
          update();
          return () => {
            element.removeEventListener('focusin', focusYear);
            element.removeEventListener('pointerdown', focusYear);
            rows.forEach((row) => { delete row.dataset.active; });
          };
        }
      });
    }, root);

    // Font loading and restored scroll positions must use the final geometry.
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); context.revert(); };
  }, [kind]);

  return <div ref={root} className={className}>{children}</div>;
}
