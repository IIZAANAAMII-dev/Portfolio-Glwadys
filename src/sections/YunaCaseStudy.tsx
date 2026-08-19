'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { Sparkles, Calendar, MapPin, Award } from 'lucide-react';

export function YunaCaseStudy() {
  const t = useTranslations('work.yuna');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll('.yuna-element');
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'bottom 20%', toggleActions: 'play none none reverse' } });
      tl.fromTo(elements || [], { y: 54, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.9, ease: 'power4.out' })
        .to(elements || [], { y: -18, scale: 1.015, duration: 0.8, ease: 'none' }, '<0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="yuna-case-study"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 my-12 bg-background-dark"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-accent-gold text-xs font-semibold">CASE STUDY 01 / JOAILLERIE</span>
          <h2 className="font-editorial text-4xl sm:text-6xl text-foreground-light mt-2">
            {t('title')}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
          <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-accent-gold">
            <Calendar className="w-3.5 h-3.5" />
            {t('period')}
          </span>
          <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-foreground-light">
            <MapPin className="w-3.5 h-3.5" />
            {t('location')}
          </span>
        </div>
      </div>

      {/* Case Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto py-8 items-center">
        {/* Left Column: Role & Narrative */}
        <div className="lg:col-span-5 space-y-6">
          <div className="yuna-element glass-panel p-8 rounded-3xl border border-accent-gold/20">
            <span className="font-mono-tag text-xs text-accent-gold">RÔLE & MISSION</span>
            <h3 className="font-editorial text-2xl text-foreground-light mt-2">
              {t('role')}
            </h3>
            <p className="font-sans text-sm text-foreground-muted mt-4 leading-relaxed">
              {t('summary')}
            </p>
          </div>

          <div className="yuna-element glass-panel p-6 rounded-3xl border border-white/5">
            <span className="font-mono-tag text-xs text-accent-gold">EXPÉRISES MOBILISÉES</span>
            <div className="flex flex-wrap gap-2 mt-3">
              {['Social Media Management', 'Création Visuelle', 'Planning Éditorial', 'Storytelling Produit', 'Reach Organique'].map((sk) => (
                <span
                  key={sk}
                  className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 text-foreground-light border border-white/10"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Breakdown Frames */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="yuna-element glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between aspect-[4/5]">
            <div className="flex justify-between items-center font-mono-tag text-[10px] text-accent-gold">
              <span>01. STORIES INSTAGRAM</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="my-auto text-center">
              <span className="font-editorial text-3xl text-foreground-light block">
                Mise en Scène Or & Perles
              </span>
              <p className="font-sans text-xs text-foreground-muted mt-2">
                Valorisation des détails de fabrication et de l&apos;artisanat d&apos;art.
              </p>
            </div>
            <span className="font-mono text-[10px] text-foreground-muted">RÉGULARITÉ & ESTHÉTIQUE</span>
          </div>

          <div className="yuna-element glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between aspect-[4/5]">
            <div className="flex justify-between items-center font-mono-tag text-[10px] text-accent-gold">
              <span>02. REELS DÉTAIL</span>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="my-auto text-center">
              <span className="font-editorial text-3xl text-foreground-light block">
                Storytelling Matières
              </span>
              <p className="font-sans text-xs text-foreground-muted mt-2">
                Plans rapprochés sur les textures, reflets et éclat des créations.
              </p>
            </div>
            <span className="font-mono text-[10px] text-foreground-muted">ENGAGEMENT QUALIFIÉ</span>
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>YUNA BIJOUX · BREST (2022–2023)</span>
        <span>CAS ÉTUDE JOAILLERIE D&apos;ART</span>
      </div>
    </section>
  );
}
