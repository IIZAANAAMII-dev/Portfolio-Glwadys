'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { Users, Calendar, MapPin, Heart } from 'lucide-react';

export function MgcCaseStudy() {
  const t = useTranslations('work.mgc');
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrapbookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = scrapbookRef.current?.querySelectorAll('.scrapbook-item');

      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'bottom 20%', toggleActions: 'play none none reverse' } });
      tl.fromTo(items || [], { scale: 0.88, y: 60, opacity: 0, rotation: (i) => (i % 2 === 0 ? -4 : 4) }, { scale: 1, y: 0, opacity: 1, rotation: 0, stagger: 0.08, duration: 0.9, ease: 'power4.out' })
        .to(items || [], { y: -14, duration: 0.75, ease: 'none' }, '<0.35');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="mgc-case-study"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 my-12 bg-background-dark"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-[#e27d60] text-xs font-semibold">CASE STUDY 02 / SCRAPBOOK COMMUNAUTAIRE</span>
          <h2 className="font-editorial text-4xl sm:text-6xl text-foreground-light mt-2">
            {t('title')}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
          <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-[#e27d60]">
            <Calendar className="w-3.5 h-3.5" />
            {t('period')}
          </span>
          <span className="glass-pill px-3 py-1 rounded-full flex items-center gap-1.5 text-foreground-light">
            <MapPin className="w-3.5 h-3.5" />
            {t('location')}
          </span>
        </div>
      </div>

      {/* Scrapbook Visual Composition */}
      <div ref={scrapbookRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto py-10 items-center max-w-6xl mx-auto w-full">
        {/* Fragment 1: Community Club Role */}
        <div className="scrapbook-item glass-panel p-8 rounded-3xl border border-[#e27d60]/30 -rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono-tag text-xs text-[#e27d60]">COMMUNAUTÉ FÉMININE</span>
            <Users className="w-4 h-4 text-[#e27d60]" />
          </div>
          <h3 className="font-editorial text-2xl text-foreground-light mb-3">
            {t('role')}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-foreground-muted leading-relaxed">
            {t('summary')}
          </p>
        </div>

        {/* Fragment 2: Event Scrapbook Moment */}
        <div className="scrapbook-item glass-panel p-8 rounded-3xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-300 bg-[#e27d60]/10">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono-tag text-xs text-foreground-light">ÉVÉNEMENTS & RENCONTRES</span>
            <Heart className="w-4 h-4 text-[#e27d60]" />
          </div>
          <blockquote className="font-editorial text-2xl text-foreground-light leading-snug my-4">
            « Raconter l&apos;énergie d&apos;un collectif marseillais en mouvement. »
          </blockquote>
          <span className="font-mono text-[10px] text-foreground-muted">
            DIRECTION DU CONTENU SOCIAL & EVENT
          </span>
        </div>

        {/* Fragment 3: Skills Stack */}
        <div className="scrapbook-item glass-panel p-8 rounded-3xl border border-white/10 -rotate-1 hover:rotate-0 transition-transform duration-300">
          <span className="font-mono-tag text-xs text-[#e27d60] block mb-3">COMPÉTENCES CLÉS</span>
          <div className="space-y-2">
            {['Contenu Digital', 'Engagement Communautaire', 'Événementiel', 'Cohérence de Marque', 'Planning'].map((sk) => (
              <div key={sk} className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-white/5 text-foreground-light">
                <span>{sk}</span>
                <span className="text-[#e27d60]">✓</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>MARSEILLE GIRLS CLUB · CDI (2025–2026)</span>
        <span>CAS ÉTUDE COMMUNITY & DIGITAL SCRAPBOOK</span>
      </div>
    </section>
  );
}
