'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';

export function JourneySection() {
  const t = useTranslations('journey');
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalShift = track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${track.scrollWidth * 1.1}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.85) {
              MasterTimelineManager.setChapter('work');
            } else {
              MasterTimelineManager.setChapter('journey');
            }
          },
        },
      });

      tl.to(track, {
        x: -totalShift,
        ease: 'none',
        duration: 3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const milestones = [
    { year: '2021', text: t('y2021'), depth: 'back', role: 'Social Media Initial Craft' },
    { year: '2022', text: t('y2022'), depth: 'front', role: 'Yuna Bijoux Work-Study (Brest)' },
    { year: '2023', text: t('y2023'), depth: 'back', role: 'IPAC Factory Bachelor Degree' },
    { year: '2024', text: t('y2024'), depth: 'front', role: 'Le Comptoir de Mathilde Merchandising' },
    { year: '2025', text: t('y2025'), depth: 'back', role: 'Marseille Girls Club Community' },
    { year: '2026', text: t('y2026'), depth: 'front', role: 'Strategic Brand & Social Direction' },
  ];

  return (
    <section
      id="journey-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden z-10 select-none py-8"
    >
      {/* Top Header */}
      <div className="px-6 md:px-14 flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>
        <span className="text-[10px] text-foreground-muted hidden sm:inline">
          ~5 ANS DE MATURATION PROFESSIONNELLE
        </span>
      </div>

      {/* Horizontal Giant Years Track */}
      <div className="my-auto w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex items-center gap-10 md:gap-16 px-6 md:px-14 w-max"
        >
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between w-[320px] sm:w-[420px] md:w-[480px] h-[380px] glass-panel p-8 rounded-3xl border border-white/10 group hover:border-accent-gold/40 transition-all duration-300"
            >
              {/* Giant Background Year Typo */}
              <span className="font-editorial text-7xl sm:text-9xl text-white/5 font-bold absolute -top-6 right-4 select-none pointer-events-none group-hover:text-accent-gold/10 transition-colors">
                {m.year}
              </span>

              <div className="flex justify-between items-center font-mono-tag text-xs text-accent-gold z-10">
                <span>MILESTONE {idx + 1}</span>
                <span className="text-foreground-muted">{m.year}</span>
              </div>

              <div className="z-10 my-auto">
                <h3 className="font-editorial text-2xl text-foreground-light leading-snug">
                  {m.text}
                </h3>
                <p className="font-sans text-xs text-foreground-muted mt-2">
                  {m.role}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] font-mono text-foreground-muted z-10">
                <span>PROGRESSION</span>
                <span className="text-accent-gold">ÉVOLUTION 3D</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status */}
      <div className="px-6 md:px-14 flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>TIMELINE HORIZONTALE SPATIALE</span>
        <span>07 / PARCOURS 2021–2026</span>
      </div>
    </section>
  );
}
