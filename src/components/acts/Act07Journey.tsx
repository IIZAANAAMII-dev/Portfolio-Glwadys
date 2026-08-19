'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

const journeySteps = [
  { year: '2021', label: 'Creative roots & social media' },
  { year: '2022', label: 'Yuna Bijoux, Brest' },
  { year: '2023', label: 'IPAC Bachelor & freelance' },
  { year: '2024', label: 'Le Comptoir de Mathilde' },
  { year: '2025', label: 'Marseille Girls Club' },
  { year: '2026', label: 'Social media & brand direction' },
];

export function Act07Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        if (!track) return;

        const trackWidth = track.scrollWidth - window.innerWidth;

        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=160%',
            pin: wrapperRef.current,
            scrub: 0.6,
            pinSpacing: true,
          },
        }).fromTo(track, { x: 0 }, { x: -trackWidth, ease: 'none' }, 0);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative h-[180vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute top-[10vh] left-[8vw] z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          Journey
        </div>

        {/* Playhead */}
        <div className="absolute top-0 bottom-0 left-1/2 z-20 w-px bg-champagne/40" />
        <div className="absolute top-[46vh] left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-champagne">
          Playhead
        </div>

        {/* Timeline track */}
        <div
          ref={trackRef}
          className="absolute top-1/2 left-0 flex items-center gap-[18vw] pl-[50vw] pr-[50vw] will-change-transform"
          style={{ transform: 'translateY(-50%)' }}
        >
          {journeySteps.map((step) => (
            <div
              key={step.year}
              className="flex flex-shrink-0 flex-col items-start gap-4"
            >
              <span className="font-sans text-[clamp(3rem,10vw,10rem)] font-light uppercase tracking-widest text-ivory">
                {step.year}
              </span>
              <span className="max-w-[260px] font-mono text-[11px] uppercase tracking-wider text-ivory/60">
                {step.label}
              </span>
              <div className="h-24 w-16 bg-charcoal" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
