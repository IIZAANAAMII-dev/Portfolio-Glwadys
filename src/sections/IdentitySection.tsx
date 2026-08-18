'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';

export function IdentitySection() {
  const t = useTranslations('identity');
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const cells = gridContainerRef.current?.querySelectorAll('.grid-cell');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=165%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const prog = self.progress;
            if (prog > 0.7) {
              MasterTimelineManager.setChapter('social');
            } else {
              MasterTimelineManager.setChapter('identity');
            }
          },
        },
      });

      // Deconstruct portrait cells into spatial directions
      if (cells && cells.length > 0) {
        tl.to(titleRef.current, { y: -30, opacity: 0.3, duration: 1 })
          .to(textRef.current, { y: -20, opacity: 0.2, duration: 1 }, '<')
          .to(cells[0], { xPercent: -40, yPercent: -30, rotate: -6, duration: 1.5 }, '<')
          .to(cells[1], { xPercent: 30, yPercent: -40, rotate: 4, duration: 1.5 }, '<')
          .to(cells[2], { xPercent: -50, yPercent: 40, rotate: 5, duration: 1.5 }, '<')
          .to(cells[3], { xPercent: 40, yPercent: 30, rotate: -4, duration: 1.5 }, '<')
          .to(
            {},
            {
              duration: 1.5,
              onUpdate: function () {
                const p = this.progress();
                MasterTimelineManager.updateCamera({
                  z: gsap.utils.interpolate(7.0, 7.5, p),
                  y: gsap.utils.interpolate(-0.4, -3.0, p),
                });
              },
            },
            '<'
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="identity-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
    >
      {/* Top Tag */}
      <div className="flex justify-between items-center font-mono-tag text-foreground-muted">
        <span className="text-accent-gold">{t('tag')}</span>
        <span>{t('caption')}</span>
      </div>

      {/* Center Deconstructed Grid Representation */}
      <div className="my-auto max-w-4xl mx-auto w-full flex flex-col items-center">
        <div className="text-center mb-8">
          <h2
            ref={titleRef}
            className="font-editorial text-3xl sm:text-5xl md:text-6xl text-foreground-light tracking-tight mb-3"
          >
            {t('title')}
          </h2>
          <p
            ref={textRef}
            className="font-sans text-sm md:text-base text-foreground-muted max-w-lg mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </p>
        </div>

        {/* 4 Controlled Editorial Cells */}
        <div
          ref={gridContainerRef}
          className="grid grid-cols-2 gap-4 w-full max-w-lg aspect-square p-4 rounded-3xl border border-white/5 bg-white/[0.01]"
        >
          <div className="grid-cell glass-panel rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative shadow-lg">
            <span className="font-mono-tag text-[10px] text-accent-gold">01. STORY</span>
            <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center my-auto">
              <span className="text-accent-gold text-xs">✦</span>
            </div>
            <p className="font-sans text-xs text-foreground-light font-medium">Capture d&apos;attention</p>
          </div>

          <div className="grid-cell glass-panel rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative shadow-lg">
            <span className="font-mono-tag text-[10px] text-foreground-muted">02. FEED</span>
            <div className="w-full h-8 rounded-lg bg-white/5 my-auto" />
            <p className="font-sans text-xs text-foreground-light font-medium">Esthétique de marque</p>
          </div>

          <div className="grid-cell glass-panel rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative shadow-lg">
            <span className="font-mono-tag text-[10px] text-foreground-muted">03. REEL</span>
            <div className="w-6 h-6 rounded-md bg-accent-gold/30 my-auto" />
            <p className="font-sans text-xs text-foreground-light font-medium">Storytelling court</p>
          </div>

          <div className="grid-cell glass-panel rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative shadow-lg">
            <span className="font-mono-tag text-[10px] text-accent-gold">04. STRATÉGIE</span>
            <div className="w-10 h-2 rounded bg-accent-gold my-auto" />
            <p className="font-sans text-xs text-foreground-light font-medium">Cohérence globale</p>
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>TRANSITION : CELLULES → SOCIAL PRESENCE</span>
        <span>GLWADYS DALLEAU</span>
      </div>
    </section>
  );
}
