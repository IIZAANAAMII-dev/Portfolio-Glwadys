'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { CAMERA_PRESETS } from '../config/spatial';

export function IntroSection() {
  const t = useTranslations('intro');
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      // Intro initial entrance animation
      const tl = gsap.timeline();
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      ).fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: 'expo.inOut' },
        '-=0.6'
      );

      // ScrollTrigger transitioning from Intro into Hero camera space
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const progress = self.progress;
          // Interpolate camera Z from 14 to 8.5
          MasterTimelineManager.updateCamera({
            z: gsap.utils.interpolate(14, 8.5, progress),
            fov: gsap.utils.interpolate(48, 45, progress),
          });
          if (progress > 0.5) {
            MasterTimelineManager.setChapter('hero');
          } else {
            MasterTimelineManager.setChapter('intro');
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro-section"
      ref={sectionRef}
      className="relative min-h-[100vh] w-full flex flex-col justify-between p-6 md:p-14 z-10 select-none pointer-events-none"
    >
      {/* Top Intro Tag */}
      <div ref={metaRef} className="flex justify-between items-start text-foreground-muted font-mono-tag">
        <div>
          <p className="text-foreground-light tracking-widest">{t('sub')}</p>
          <p className="text-[10px] text-accent-gold mt-1">{t('location')}</p>
        </div>
        <div className="text-right">
          <p>{t('roles')}</p>
          <p className="text-[10px] text-foreground-muted mt-1">2021 — 2026</p>
        </div>
      </div>

      {/* Horizontal Hairline */}
      <div
        ref={lineRef}
        className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent origin-center my-auto"
      />

      {/* Bottom Hint */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted">
        <span className="text-[10px] tracking-widest text-accent-gold/80 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-ping" />
          {t('scrollHint')}
        </span>
        <span className="text-[10px]">THE CREATIVE LAYERS</span>
      </div>
    </section>
  );
}
