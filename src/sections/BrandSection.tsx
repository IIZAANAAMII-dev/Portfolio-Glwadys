'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { Palette, Sparkles, MessageSquare, Compass } from 'lucide-react';

export function BrandSection() {
  const t = useTranslations('brand');
  const sectionRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const items = tableRef.current?.querySelectorAll('.brand-table-item');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.8) {
              MasterTimelineManager.setChapter('strategy');
            } else {
              MasterTimelineManager.setChapter('brand');
            }
          },
        },
      });

      if (items && items.length > 0) {
        tl.fromTo(
          items,
          { y: 60, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.9, ease: 'power4.out' }
        ).to(
          {},
          {
            duration: 1,
            onUpdate: function () {
              const prog = this.progress();
              MasterTimelineManager.updateCamera({
                x: gsap.utils.interpolate(4.0, 0, prog),
                y: gsap.utils.interpolate(-12.0, -15.0, prog),
                z: gsap.utils.interpolate(7.5, 7.0, prog),
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
      id="brand-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
    >
      {/* Top Tag */}
      <div className="flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>
        <span className="text-[10px] text-foreground-muted hidden sm:inline">
          CHAOS CRÉATIF → ORDRE DE MARQUE
        </span>
      </div>

      {/* Spatial Brand Identity Table */}
      <div
        ref={tableRef}
        className="my-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto w-full"
      >
        {/* Table Item 1: Communication Pillars */}
        <div className="brand-table-item glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-accent-gold/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-tag text-[10px] text-accent-gold">01. PILIERS</span>
            <Compass className="w-4 h-4 text-accent-gold" />
          </div>
          <h3 className="font-editorial text-xl text-foreground-light mb-2">
            {t('pillarsTitle')}
          </h3>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Inspiration, éducation produit, immersion coulisses et preuve sociale.
          </p>
        </div>

        {/* Table Item 2: Tone & Voice */}
        <div className="brand-table-item glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-accent-gold/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-tag text-[10px] text-accent-gold">02. POSITIONNEMENT</span>
            <MessageSquare className="w-4 h-4 text-accent-gold" />
          </div>
          <h3 className="font-editorial text-xl text-foreground-light mb-2">
            {t('toneTitle')}
          </h3>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Élégant, accessible, direct, incarné et chaleureux.
          </p>
        </div>

        {/* Table Item 3: Palette & Harmony */}
        <div className="brand-table-item glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-accent-gold/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-tag text-[10px] text-accent-gold">03. HARMONIE</span>
            <Palette className="w-4 h-4 text-accent-gold" />
          </div>
          <h3 className="font-editorial text-xl text-foreground-light mb-2">
            {t('paletteTitle')}
          </h3>
          <div className="flex items-center gap-2 my-2">
            <span className="w-4 h-4 rounded-full bg-[#0b0c0e] border border-white/20" />
            <span className="w-4 h-4 rounded-full bg-[#f5f3ef]" />
            <span className="w-4 h-4 rounded-full bg-[#d8c29d]" />
            <span className="w-4 h-4 rounded-full bg-[#7d4f39]" />
          </div>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Obsidian, ivoire chaud, champagne et nuances artisanales.
          </p>
        </div>

        {/* Table Item 4: Key Messaging */}
        <div className="brand-table-item glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-accent-gold/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-tag text-[10px] text-accent-gold">04. MESSAGES</span>
            <Sparkles className="w-4 h-4 text-accent-gold" />
          </div>
          <h3 className="font-editorial text-xl text-foreground-light mb-2">
            {t('messagingTitle')}
          </h3>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Clarifier la valeur unique de la marque dès les premières secondes.
          </p>
        </div>
      </div>

      {/* Bottom Footer Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>DIRECTION ARTISTIQUE STRUCTURÉE</span>
        <span>04 / COHÉRENCE GLOBALE</span>
      </div>
    </section>
  );
}
