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
          end: () => {
            const isMobile = window.innerWidth < 768;
            const multiplier = isMobile ? 0.18 : 0.32;
            const base = isMobile ? 0.7 : 1.1;
            return `+=${Math.max(track.scrollWidth * multiplier, window.innerHeight * base)}`;
          },
          pin: true,
          scrub: 0.5,
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
        duration: 1.4,
      }).fromTo(
        '.j-year-item',
        { y: 28, opacity: 0.15 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'power4.out' },
        '<0.1'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const milestones = [
    { year: '2021', text: t('y2021') },
    { year: '2022', text: t('y2022') },
    { year: '2023', text: t('y2023') },
    { year: '2024', text: t('y2024') },
    { year: '2025', text: t('y2025') },
    { year: '2026', text: t('y2026') },
  ];

  return (
    <section
      id="journey-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden z-10 select-none py-8"
    >
      <div className="px-6 md:px-14 flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
          <p className="font-sans text-xs text-foreground-muted mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="my-auto w-full overflow-visible">
        <div
          ref={trackRef}
          className="flex items-end gap-[12vw] md:gap-[16vw] pl-6 md:pl-14 pr-[60vw] w-max"
        >
          {milestones.map((m) => (
            <div
              key={m.year}
              className="j-year-item flex flex-col justify-end w-[70vw] md:w-[34vw] h-[45vh] border-b border-white/10 pb-4"
            >
              <span className="font-editorial text-[22vw] md:text-[11vw] leading-[0.75] text-foreground-light/90 select-none">
                {m.year}
              </span>
              <p className="font-sans text-sm md:text-base text-foreground-muted mt-3 max-w-xs">
                {m.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
