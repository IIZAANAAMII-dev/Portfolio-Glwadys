'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { mediaSlots } from '@/lib/media';
import { cn } from '@/lib/utils';

const mgcSlots = [mediaSlots.webglMid, mediaSlots.webglBack, mediaSlots.mgc1];

export function Act06Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const yunaRef = useRef<HTMLDivElement>(null);
  const mgcRef = useRef<HTMLDivElement>(null);
  const comptoirRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=280%',
            pin: wrapperRef.current,
            scrub: 0.6,
            pinSpacing: true,
          },
        });

        // 0-35%: Yuna — clean, macro, vertical
        tl.fromTo(yunaRef.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, ease: 'none' }, 0)
          .to(yunaRef.current, { x: '-8vw', scale: 0.85, opacity: 0.4, ease: 'none' }, 0.3)
          .to(yunaRef.current, { opacity: 0, ease: 'none' }, 0.35);

        // 35-70%: MGC — scrapbook
        tl.fromTo(
          mgcRef.current?.children ? Array.from(mgcRef.current.children) : [],
          { x: '60vw', y: '40vh', rotation: 8, opacity: 0 },
          {
            x: 0,
            y: 0,
            rotation: (i) => (i % 2 === 0 ? -3 : 4),
            opacity: 1,
            ease: 'none',
            stagger: 0,
          },
          0.35,
        )
          .to(
            mgcRef.current?.children ? Array.from(mgcRef.current.children) : [],
            { x: (i) => (i % 2 === 0 ? -20 : 20), y: (i) => (i % 2 === 0 ? -15 : 15), opacity: 0.4, ease: 'none' },
            0.65,
          )
          .to(mgcRef.current, { opacity: 0, ease: 'none' }, 0.7);

        // 70-100%: Comptoir — calm, warm, macro
        tl.fromTo(comptoirRef.current, { opacity: 0, scale: 1.15, y: '10vh' }, { opacity: 1, scale: 1, y: 0, ease: 'none' }, 0.7)
          .to(comptoirRef.current, { scale: 1.08, y: '-5vh', ease: 'none' }, 0.9);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative h-[300vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute top-[10vh] left-[8vw] z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          Selected Work
        </div>

        {/* Yuna */}
        <div
          ref={yunaRef}
          className="absolute top-1/2 left-1/2 z-10 w-[26vw] min-w-[260px] -translate-x-1/2 -translate-y-1/2"
        >
          <MediaSlot slot={mediaSlots.yuna1} />
        </div>

        {/* MGC */}
        <div
          ref={mgcRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-6 opacity-0"
        >
          {mgcSlots.map((slot, i) => (
            <div
              key={`mgc-${slot.id}-${i}`}
              className={cn('w-[18vw]', i === 0 ? '-mt-16' : i === 1 ? 'mt-8' : '-mb-8')}
            >
              <MediaSlot slot={slot} />
            </div>
          ))}
        </div>

        {/* Comptoir */}
        <div
          ref={comptoirRef}
          className="absolute top-1/2 left-1/2 z-10 w-[70vw] -translate-x-1/2 -translate-y-1/2 opacity-0"
        >
          <MediaSlot slot={mediaSlots.comptoir1} />
        </div>
      </div>
    </section>
  );
}
