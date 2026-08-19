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
          {t('subtitle')}
        </span>
      </div>

      {/* Brand Identity Lines */}
      <div
        ref={tableRef}
        className="my-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto w-full"
      >
        <div className="brand-table-item border-t border-white/10 pt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-editorial text-2xl text-foreground-light">
              {t('pillarsTitle')}
            </h3>
            <Compass className="w-4 h-4 text-accent-gold" />
          </div>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Inspiration, éducation produit, immersion coulisses et preuve sociale.
          </p>
        </div>

        <div className="brand-table-item border-t border-white/10 pt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-editorial text-2xl text-foreground-light">
              {t('toneTitle')}
            </h3>
            <MessageSquare className="w-4 h-4 text-accent-gold" />
          </div>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Élégant, accessible, direct, incarné et chaleureux.
          </p>
        </div>

        <div className="brand-table-item border-t border-white/10 pt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-editorial text-2xl text-foreground-light">
              {t('paletteTitle')}
            </h3>
            <Palette className="w-4 h-4 text-accent-gold" />
          </div>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Obsidian, ivoire chaud, champagne et nuances artisanales.
          </p>
        </div>

        <div className="brand-table-item border-t border-white/10 pt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-editorial text-2xl text-foreground-light">
              {t('messagingTitle')}
            </h3>
            <Sparkles className="w-4 h-4 text-accent-gold" />
          </div>
          <p className="font-sans text-xs text-foreground-muted leading-relaxed">
            Clarifier la valeur unique de la marque dès les premières secondes.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>{t('title')}</span>
        <span>{t('tag')}</span>
      </div>
    </section>
  );
}
