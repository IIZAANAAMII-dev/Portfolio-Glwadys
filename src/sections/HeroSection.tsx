'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const glwadysRef = useRef<HTMLHeadingElement>(null);
  const dalleauRef = useRef<HTMLHeadingElement>(null);
  const metaGlassRef = useRef<HTMLDivElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      // Pinned Hero Timeline with multi-axis progression
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => window.innerWidth < 768 ? '+=110%' : '+=140%',
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.6) {
              MasterTimelineManager.setChapter('identity');
            } else {
              MasterTimelineManager.setChapter('hero');
            }
          },
        },
      });

      tl
        // Phase 1 (0-40%): Words split, camera moves closer
        .to(glwadysRef.current, { xPercent: -11, opacity: 0.88, duration: 0.8 })
        .to(dalleauRef.current, { xPercent: 11, opacity: 0.88, duration: 0.8 }, '<')
        .to(headlineRef.current, { yPercent: -24, opacity: 0.15, duration: 0.8 }, '<')
        .to(portraitFrameRef.current, { scale: 1.14, yPercent: -6, opacity: 1, duration: 0.9 }, '<0.1')
        // Phase 2 (40-100%): Camera dives into portrait
        .to(metaGlassRef.current, { opacity: 0, y: -28, duration: 0.55 }, '<0.16')
        .to(
          {},
          {
            duration: 1.5,
            onUpdate: function () {
              const prog = this.progress();
              MasterTimelineManager.updateCamera({
                z: gsap.utils.interpolate(8.5, 7.0, prog),
                y: gsap.utils.interpolate(0, -0.4, prog),
              });
            },
          },
          '<'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 select-none"
    >
      {/* Top Asymmetric Metadata Glass */}
      <div ref={metaGlassRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-16 pointer-events-auto">
        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-gold" />
          <span className="font-mono-tag text-xs text-foreground-light">
            {t('roleTag')}
          </span>
          <span className="text-white/20">|</span>
          <span className="font-mono-tag text-[10px] text-accent-gold">
            {t('experienceYears')}
          </span>
        </div>

        <div className="glass-pill px-4 py-2 rounded-full hidden md:block">
          <span className="font-mono-tag text-[10px] text-foreground-muted">
            {t('badge')}
          </span>
        </div>
      </div>

      {/* Center Giant Spatial Display Typography */}
      <div className="my-auto flex flex-col items-center justify-center relative py-12 pointer-events-none">
        <div ref={portraitFrameRef} className="absolute w-[36vw] max-w-[360px] aspect-[3/4] rounded-[12rem] border border-accent-gold/25 bg-background-dark/45 backdrop-blur-[2px] opacity-70" />
        {/* Rear Deep Name: GLWADYS */}
        <h1
          ref={glwadysRef}
          className="font-editorial text-[14vw] md:text-[13vw] leading-[0.8] tracking-tighter text-foreground-light font-medium uppercase text-center opacity-90 transition-transform"
        >
          GLWADYS
        </h1>

        {/* Foreground Headline */}
        <div
          ref={headlineRef}
          className="max-w-2xl my-4 text-center px-4"
        >
          <p className="font-sans text-lg sm:text-2xl md:text-3xl font-light text-accent-gold leading-snug tracking-tight">
            {t('headlinePart1')} {t('headlinePart2')}{' '}
            <span className="font-editorial italic font-normal text-foreground-light">
              {t('headlinePart3')}
            </span>{' '}
            {t('headlinePart4')}
          </p>
        </div>

        {/* Foreground Deep Name: DALLEAU */}
        <h1
          ref={dalleauRef}
          className="font-editorial text-[14vw] md:text-[13vw] leading-[0.8] tracking-tighter text-foreground-light/80 font-medium uppercase text-center transition-transform"
        >
          DALLEAU
        </h1>
      </div>

      {/* Bottom Editorial Caption */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] pb-4">
        <span>01 / DIRECTION DE CONTENU</span>
        <span>SCROLL POUR ENTRER DANS LA STRUCTURE</span>
      </div>
    </section>
  );
}

