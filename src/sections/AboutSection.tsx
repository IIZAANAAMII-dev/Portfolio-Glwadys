'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';

export function AboutSection() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const line3Ref = useRef<HTMLHeadingElement>(null);
  const line4Ref = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => window.innerWidth < 768 ? '+=90%' : '+=150%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.8) {
              MasterTimelineManager.setChapter('journey');
            } else {
              MasterTimelineManager.setChapter('about');
            }
          },
        },
      });

      // 4 Kinetic Statements: X -> Y -> Z -> Convergence
      tl.fromTo(line1Ref.current, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
        .fromTo(line2Ref.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.4')
        .fromTo(line3Ref.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, '-=0.4')
        .fromTo(line4Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .fromTo(bioRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, '-=0.5');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
    >
      {/* Top Tag */}
      <div className="flex justify-between items-center font-mono-tag text-foreground-muted">
        <span className="text-accent-gold">{t('tag')}</span>
      </div>

      {/* Center 4 Kinetic Manifestos */}
      <div className="my-auto max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-2 py-8">
        <h2
          ref={line1Ref}
          className="font-editorial text-3xl sm:text-5xl md:text-6xl text-foreground-light tracking-tight"
        >
          {t('line1')}
        </h2>
        <h2
          ref={line2Ref}
          className="font-editorial text-3xl sm:text-5xl md:text-6xl text-accent-gold italic tracking-tight"
        >
          {t('line2')}
        </h2>
        <h2
          ref={line3Ref}
          className="font-editorial text-3xl sm:text-5xl md:text-6xl text-foreground-light tracking-tight"
        >
          {t('line3')}
        </h2>
        <h2
          ref={line4Ref}
          className="font-editorial text-2xl sm:text-4xl md:text-5xl text-foreground-light/80 font-light mt-2"
        >
          {t('line4')}
        </h2>

        {/* Bio Paragraph */}
        <p
          ref={bioRef}
          className="font-sans text-xs sm:text-sm md:text-base text-foreground-muted max-w-2xl mt-8 leading-relaxed px-4"
        >
          {t('bio')}
        </p>
      </div>

      <div className="flex justify-end items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>{t('tag')}</span>
      </div>
    </section>
  );
}
