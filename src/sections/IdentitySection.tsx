'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '@/motion/MasterTimeline';

const CELLS = [
  { pos: 'left top', label: '01' },
  { pos: 'right top', label: '02' },
  { pos: 'left bottom', label: '03' },
  { pos: 'right bottom', label: '04' },
];

export function IdentitySection() {
  const t = useTranslations('identity');
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const cells = gridRef.current?.querySelectorAll('.id-cell');
      if (!cells || cells.length === 0) return;

      // Start state: cells stacked as one portrait, title visible
      gsap.set(cells, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, gap: 0 });
      gsap.set(gridRef.current, { gap: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.85) {
              MasterTimelineManager.setChapter('social');
            } else {
              MasterTimelineManager.setChapter('identity');
            }
          },
        },
      });

      // Phase 1: title fades, cells drift apart
      tl.to(titleRef.current, { autoAlpha: 0, y: -40, duration: 0.3, ease: 'none' }, 0)
        .to(
          cells[0],
          { xPercent: -60, yPercent: -60, rotation: -6, duration: 0.7, ease: 'none' },
          0.05
        )
        .to(
          cells[1],
          { xPercent: 60, yPercent: -60, rotation: 6, duration: 0.7, ease: 'none' },
          0.08
        )
        .to(
          cells[2],
          { xPercent: -60, yPercent: 60, rotation: 6, duration: 0.7, ease: 'none' },
          0.11
        )
        .to(
          cells[3],
          { xPercent: 60, yPercent: 60, rotation: -6, duration: 0.7, ease: 'none' },
          0.14
        )
        // Phase 2: cells settle into an open grid
        .to(cells, { xPercent: 0, yPercent: 0, rotation: 0, scale: 0.92, duration: 0.6, ease: 'none' }, 0.55)
        .to(gridRef.current, { gap: 16, duration: 0.6, ease: 'none' }, 0.55)
        // Phase 3: social content begins to emerge
        .to(cells, { scale: 0.88, autoAlpha: 0.35, duration: 0.4, ease: 'none' }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="identity-section"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background-dark z-10 select-none"
      aria-label="Identity"
    >
      {/* Title */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6 will-change-transform"
      >
        <span className="font-mono-tag text-[10px] text-accent-gold tracking-widest">
          {t('tag')}
        </span>
        <h2 className="font-editorial text-4xl md:text-6xl text-foreground-light mt-3 leading-tight">
          {t('title')}
        </h2>
        <p className="font-sans text-sm md:text-base text-foreground-muted max-w-md mt-4 leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Portrait grid */}
      <div
        ref={gridRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[44vw] aspect-[3/4] grid grid-cols-2 grid-rows-2 z-10 will-change-[gap]"
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      >
        {CELLS.map((cell, i) => (
          <div
            key={i}
            className={`id-cell relative overflow-hidden border border-white/[0.08] rounded-sm will-change-transform`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img
              src="/assets/editorial/portrait-glwadys.svg"
              alt=""
              className="absolute w-[200%] h-[200%] object-cover"
              style={{ objectPosition: cell.pos, top: 0, left: 0 }}
            />
            <span className="absolute top-2 left-2 font-mono-tag text-[10px] text-foreground-muted/60">
              {cell.label}
            </span>
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="absolute bottom-8 left-8 font-mono-tag text-[10px] text-foreground-muted tracking-widest">
        <span className="text-accent-gold">{t('tag')}</span>
      </div>
      <div className="absolute bottom-8 right-8 font-mono-tag text-[10px] text-foreground-muted tracking-widest">
        {t('caption')}
      </div>
    </section>
  );
}
