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
  const nameRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      // Intro initial entrance animation
      const tl = gsap.timeline();
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power4.out' }
      ).fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'expo.out' },
        '-=0.32'
      ).fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 32, rotate: -3 },
        { opacity: 1, y: 0, rotate: 0, duration: 0.6, stagger: 0.07, ease: 'power4.out' },
        '-=0.35'
      ).fromTo(
        nameRef.current,
        { clipPath: 'inset(0 0 100% 0)', yPercent: 12 },
        { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 0.72, ease: 'expo.out' },
        '-=0.25'
      );

      // ScrollTrigger transitioning from Intro into Hero camera space
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.45,
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
      className="relative min-h-[82vh] w-full flex flex-col justify-between p-6 md:p-14 z-10 select-none pointer-events-none"
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

      <div className="relative flex items-center justify-center min-h-[43vh] overflow-hidden">
        <div ref={cardsRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[7%] top-[12%] w-24 md:w-36 aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 rotate-[-9deg] opacity-90">
            <img src="/assets/editorial/portrait-glwadys.svg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-[9%] top-[8%] w-24 md:w-40 aspect-[9/14] overflow-hidden rounded-2xl border border-accent-gold/40 rotate-[7deg] opacity-90">
            <img src="/assets/projects/yuna-story.svg" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-[20%] bottom-[3%] w-20 md:w-28 aspect-square overflow-hidden rounded-full border border-white/15 rotate-[13deg] opacity-80">
            <img src="/assets/projects/mgc-scrapbook.svg" alt="" className="h-full w-full object-cover" />
          </div>
        </div>
        <div ref={nameRef} className="relative z-10 text-center font-editorial uppercase leading-[0.72] tracking-[-0.075em] text-[15vw] md:text-[12vw] text-foreground-light">
          <span className="block">Glwadys</span>
          <span className="block pl-[11vw] text-accent-gold">Dalleau</span>
        </div>
      </div>

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
