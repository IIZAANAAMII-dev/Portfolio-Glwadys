'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { Compass, MessageSquare, Palette, Sparkles } from 'lucide-react';

export function BrandSection() {
  const t = useTranslations('brand');
  const sectionRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const items = tableRef.current?.querySelectorAll('.brand-table-item');

      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            onEnter: () => MasterTimelineManager.setChapter('brand'),
            onLeaveBack: () => MasterTimelineManager.setChapter('gallery'),
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brand-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
    >
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

      <div
        ref={tableRef}
        className="my-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto w-full"
      >
        {[
          { title: t('pillarsTitle'), icon: Compass, text: 'Inspiration, éducation produit, immersion coulisses et preuve sociale.' },
          { title: t('toneTitle'), icon: MessageSquare, text: 'Élégant, accessible, direct, incarné et chaleureux.' },
          { title: t('paletteTitle'), icon: Palette, text: 'Obsidian, ivoire chaud, champagne et nuances artisanales.' },
          { title: t('messagingTitle'), icon: Sparkles, text: 'Clarifier la valeur unique de la marque dès les premières secondes.' },
        ].map(({ title, icon: Icon, text }) => (
          <div key={title} className="brand-table-item border-t border-white/10 pt-4 pb-6 opacity-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-2xl text-foreground-light">
                {title}
              </h3>
              <Icon className="w-4 h-4 text-accent-gold" />
            </div>
            <p className="font-sans text-xs text-foreground-muted leading-relaxed">
              {text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>{t('title')}</span>
        <span>{t('tag')}</span>
      </div>
    </section>
  );
}
