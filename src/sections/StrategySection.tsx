'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { Calendar, Target, CheckCircle2, TrendingUp } from 'lucide-react';

export function StrategySection() {
  const t = useTranslations('strategy');
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const steps = stepsTrackRef.current;
      if (!steps) return;

      const totalShift = steps.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.max(steps.scrollWidth * 0.45, window.innerHeight * 1.4)}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.85) {
              MasterTimelineManager.setChapter('about');
            } else {
              MasterTimelineManager.setChapter('strategy');
            }
          },
        },
      });

      tl.to(steps, {
        x: -totalShift,
        ease: 'none',
        duration: 1.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="strategy-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#f5f3ef] text-[#121418] p-6 md:p-14 overflow-hidden z-10 transition-colors duration-700"
    >
      {/* Top Header Light Mode */}
      <div className="flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-[#a38f6e] text-xs font-bold">{t('tag')}</span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-[#121418] mt-1">
            {t('title')}
          </h2>
          <p className="font-sans text-xs md:text-sm text-[#626670] mt-1 max-w-md">
            {t('subtitle')}
          </p>
        </div>

        <span className="font-editorial text-4xl sm:text-6xl text-[#121418]/10 tracking-widest hidden md:inline font-bold">
          {t('tag')}
        </span>
      </div>

      {/* Horizontal Steps Track */}
      <div className="my-auto w-full overflow-visible">
        <div
          ref={stepsTrackRef}
          className="flex items-stretch gap-4 md:gap-8 w-max px-6 md:px-14"
        >
          <div className="w-[280px] sm:w-[360px] md:w-[420px] flex flex-col justify-between border-t border-black/10 pt-4 pb-8">
            <Target className="w-5 h-5 text-[#a38f6e]" />
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step1')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>
          </div>

          <div className="w-[280px] sm:w-[360px] md:w-[420px] flex flex-col justify-between border-t border-black/10 pt-4 pb-8">
            <TrendingUp className="w-5 h-5 text-[#a38f6e]" />
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step2')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>
          </div>

          <div className="w-[280px] sm:w-[360px] md:w-[420px] flex flex-col justify-between border-t border-black/10 pt-4 pb-8">
            <Calendar className="w-5 h-5 text-[#a38f6e]" />
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step3')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
          </div>

          <div className="w-[280px] sm:w-[360px] md:w-[420px] flex flex-col justify-between border-t border-black/10 pt-4 pb-8">
            <CheckCircle2 className="w-5 h-5 text-[#a38f6e]" />
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step4')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end font-mono-tag text-[#626670] text-[10px]">
        <span>{t('title')}</span>
        <span>{t('tag')}</span>
      </div>
    </section>
  );
}
