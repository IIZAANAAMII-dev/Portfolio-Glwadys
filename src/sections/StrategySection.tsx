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
          end: () => `+=${steps.scrollWidth * 1.1}`,
          pin: true,
          scrub: 1.2,
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
        duration: 3,
      }).to(
        {},
        {
          duration: 3,
          onUpdate: function () {
            const prog = this.progress();
            MasterTimelineManager.updateCamera({
              x: 0,
              y: gsap.utils.interpolate(-15.0, -18.0, prog),
              z: gsap.utils.interpolate(7.0, 8.5, prog),
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
          STRATEGY
        </span>
      </div>

      {/* Horizontal Steps Track */}
      <div className="my-auto w-full overflow-visible">
        <div
          ref={stepsTrackRef}
          className="flex items-center gap-6 md:gap-10 w-max pr-14"
        >
          {/* Step 1 */}
          <div className="w-[300px] sm:w-[380px] md:w-[440px] bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col justify-between h-[360px]">
            <div className="flex justify-between items-center">
              <span className="font-mono-tag text-xs text-[#a38f6e] font-bold">ÉTAPE 01</span>
              <Target className="w-5 h-5 text-[#a38f6e]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step1')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>
            <div className="border-t border-black/5 pt-3 text-[10px] font-mono text-[#626670]">
              BENCHMARK & VEILLE SECTORIELLE
            </div>
          </div>

          {/* Step 2 */}
          <div className="w-[300px] sm:w-[380px] md:w-[440px] bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col justify-between h-[360px]">
            <div className="flex justify-between items-center">
              <span className="font-mono-tag text-xs text-[#a38f6e] font-bold">ÉTAPE 02</span>
              <TrendingUp className="w-5 h-5 text-[#a38f6e]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step2')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>
            <div className="border-t border-black/5 pt-3 text-[10px] font-mono text-[#626670]">
              IDENTITÉ & TON ÉDITORIAL
            </div>
          </div>

          {/* Step 3 */}
          <div className="w-[300px] sm:w-[380px] md:w-[440px] bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col justify-between h-[360px]">
            <div className="flex justify-between items-center">
              <span className="font-mono-tag text-xs text-[#a38f6e] font-bold">ÉTAPE 03</span>
              <Calendar className="w-5 h-5 text-[#a38f6e]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step3')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
            <div className="border-t border-black/5 pt-3 text-[10px] font-mono text-[#626670]">
              CALENDRIER DE DIFFUSION & PRODUCTION
            </div>
          </div>

          {/* Step 4 */}
          <div className="w-[300px] sm:w-[380px] md:w-[440px] bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col justify-between h-[360px]">
            <div className="flex justify-between items-center">
              <span className="font-mono-tag text-xs text-[#a38f6e] font-bold">ÉTAPE 04</span>
              <CheckCircle2 className="w-5 h-5 text-[#a38f6e]" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl text-[#121418] mb-3">
                {t('step4')}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#626670] leading-relaxed">
                {t('step4Desc')}
              </p>
            </div>
            <div className="border-t border-black/5 pt-3 text-[10px] font-mono text-[#626670]">
              ENGAGEMENT & AJUSTEMENT CONTINU
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Light */}
      <div className="flex justify-between items-end font-mono-tag text-[#626670] text-[10px]">
        <span>GRILLE STRATÉGIQUE IVOIRE</span>
        <span>05 / MÉTHODE & CADRE</span>
      </div>
    </section>
  );
}
