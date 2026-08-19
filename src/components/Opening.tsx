'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Opening() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.opening-name',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9 }
      )
        .fromTo(
          '.opening-meta',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          '-=0.4'
        )
        .fromTo(
          '.opening-media-left',
          { opacity: 0, x: -120, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 1.2 },
          '-=0.2'
        )
        .fromTo(
          '.opening-media-right',
          { opacity: 0, x: 120, scale: 0.9 },
          { opacity: 1, x: 0, scale: 1, duration: 1.2 },
          '-=1.0'
        )
        .fromTo(
          '.opening-portrait',
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 1.0 },
          '-=0.8'
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="opening relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <div className="absolute top-8 left-8 opening-meta font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
        Portfolio 2026
      </div>
      <div className="absolute top-8 right-8 opening-meta font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
        Marseille
      </div>

      <div className="opening-name text-center">
        <h1 className="font-sans text-[clamp(1.25rem,2.5vw,2.5rem)] tracking-[0.3em] uppercase font-medium text-ivory">
          Glwadys Dalleau
        </h1>
      </div>

      <div className="opening-media-left absolute left-[8vw] top-[22vh] w-[18vw] h-[24vh] bg-espresso border border-ivory/10">
        <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase text-ivory/40">Media 01</span>
      </div>
      <div className="opening-media-right absolute right-[8vw] top-[18vh] w-[16vw] h-[28vh] bg-espresso border border-ivory/10">
        <span className="absolute bottom-2 right-2 font-mono text-[9px] uppercase text-ivory/40">Media 02</span>
      </div>
      <div className="opening-portrait absolute left-1/2 -translate-x-1/2 top-[30vh] w-[26vw] h-[38vh] bg-ivory/10 border border-ivory/20">
        <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase text-ivory/40">Portrait</span>
      </div>
    </section>
  );
}
