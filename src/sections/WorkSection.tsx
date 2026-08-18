'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export function WorkSection() {
  const t = useTranslations('work');
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.work-constellation-node');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.8) {
              MasterTimelineManager.setChapter('services');
            } else {
              MasterTimelineManager.setChapter('work');
            }
          },
        },
      });

      if (cards && cards.length > 0) {
        tl.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.2, duration: 1.5, ease: 'power3.out' }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToCase = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="work-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
          <p className="font-sans text-xs text-foreground-muted mt-1">
            {t('subtitle')}
          </p>
        </div>
        <div className="glass-pill px-4 py-2 rounded-full hidden sm:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
          <span className="text-[10px] font-mono text-accent-gold">CONSTELLATION 3D</span>
        </div>
      </div>

      {/* 3 Major Spatial Case Study Gateways */}
      <div
        ref={cardsRef}
        className="my-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full"
      >
        {/* Case 1: YUNA BIJOUX */}
        <div
          onClick={() => scrollToCase('yuna-case-study')}
          className="work-constellation-node glass-panel p-8 rounded-3xl border border-white/10 hover:border-accent-gold/60 transition-all duration-500 cursor-pointer flex flex-col justify-between h-[420px] group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono-tag text-xs text-accent-gold">01 / JOAILLERIE</span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-background-dark transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-auto">
            <h3 className="font-editorial text-3xl text-foreground-light group-hover:text-accent-gold transition-colors">
              {t('yuna.title')}
            </h3>
            <p className="font-mono-tag text-[10px] text-foreground-muted mt-1">
              {t('yuna.role')} · {t('yuna.location')}
            </p>
            <p className="font-sans text-xs text-foreground-muted mt-3 line-clamp-3 leading-relaxed">
              {t('yuna.summary')}
            </p>
          </div>
          <div className="border-t border-white/10 pt-3 flex flex-wrap gap-1.5">
            {['Storytelling', 'Reels', 'Reach'].map((sk) => (
              <span key={sk} className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-foreground-light">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Case 2: MARSEILLE GIRLS CLUB */}
        <div
          onClick={() => scrollToCase('mgc-case-study')}
          className="work-constellation-node glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#e27d60]/60 transition-all duration-500 cursor-pointer flex flex-col justify-between h-[420px] group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono-tag text-xs text-[#e27d60]">02 / COMMUNAUTÉ</span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#e27d60] group-hover:text-background-dark transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-auto">
            <h3 className="font-editorial text-3xl text-foreground-light group-hover:text-[#e27d60] transition-colors">
              {t('mgc.title')}
            </h3>
            <p className="font-mono-tag text-[10px] text-foreground-muted mt-1">
              {t('mgc.role')} · {t('mgc.location')}
            </p>
            <p className="font-sans text-xs text-foreground-muted mt-3 line-clamp-3 leading-relaxed">
              {t('mgc.summary')}
            </p>
          </div>
          <div className="border-t border-white/10 pt-3 flex flex-wrap gap-1.5">
            {['Community', 'Scrapbook', 'Events'].map((sk) => (
              <span key={sk} className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-foreground-light">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Case 3: LE COMPTOIR DE MATHILDE */}
        <div
          onClick={() => scrollToCase('comptoir-case-study')}
          className="work-constellation-node glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#c5a880]/60 transition-all duration-500 cursor-pointer flex flex-col justify-between h-[420px] group relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="font-mono-tag text-xs text-[#c5a880]">03 / ART DE VIVRE</span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#c5a880] group-hover:text-background-dark transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-auto">
            <h3 className="font-editorial text-3xl text-foreground-light group-hover:text-[#c5a880] transition-colors">
              {t('comptoir.title')}
            </h3>
            <p className="font-mono-tag text-[10px] text-foreground-muted mt-1">
              {t('comptoir.role')} · {t('comptoir.location')}
            </p>
            <p className="font-sans text-xs text-foreground-muted mt-3 line-clamp-3 leading-relaxed">
              {t('comptoir.summary')}
            </p>
          </div>
          <div className="border-t border-white/10 pt-3 flex flex-wrap gap-1.5">
            {['Merchandising', 'Conseil', 'Expérience'].map((sk) => (
              <span key={sk} className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-foreground-light">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>CONSTELLATION DE PROJETS SPATIAUX</span>
        <span>08 / RÉALISATIONS SÉLECTIONNÉES</span>
      </div>
    </section>
  );
}
