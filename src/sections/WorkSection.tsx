'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { ArrowUpRight } from 'lucide-react';

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
          end: '+=145%',
          pin: true,
          scrub: 0.55,
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
          { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.95, ease: 'power4.out' }
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
      </div>

      <div
        ref={cardsRef}
        className="my-auto w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        style={{ perspective: '1200px' }}
      >
        {[
          { id: 'yuna-case-study', color: 'accent-gold' },
          { id: 'mgc-case-study', color: '#e27d60' },
          { id: 'comptoir-case-study', color: '#c5a880' },
        ].map((item, idx) => {
          const key = item.id.replace('-case-study', '') as 'yuna' | 'mgc' | 'comptoir';
          const isLeft = idx === 0;
          const isRight = idx === 2;
          return (
            <button
              key={item.id}
              onClick={() => scrollToCase(item.id)}
              className="work-constellation-node group text-left p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 focus:outline-none"
              style={{
                transform: isLeft ? 'rotateY(6deg)' : isRight ? 'rotateY(-6deg)' : 'rotateY(0deg)',
                transformOrigin: isLeft ? 'right center' : isRight ? 'left center' : 'center',
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: item.color === 'accent-gold' ? '#d8c29d' : item.color }}
                >
                  {t(`${key}.location`)}
                </span>
                <ArrowUpRight className="w-4 h-4 text-foreground-muted group-hover:text-foreground-light transition-colors" />
              </div>
              <div className="my-auto">
                <h3 className="font-editorial text-2xl sm:text-3xl text-foreground-light group-hover:text-white transition-colors leading-tight">
                  {t(`${key}.title`)}
                </h3>
                <p className="font-mono-tag text-[10px] text-foreground-muted mt-1">
                  {t(`${key}.role`)}
                </p>
                <p className="font-sans text-xs text-foreground-muted mt-4 line-clamp-3 leading-relaxed">
                  {t(`${key}.summary`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>PROJETS SÉLECTIONNÉS</span>
        <span>{t('yuna.location')} · {t('mgc.location')} · {t('comptoir.location')}</span>
      </div>
    </section>
  );
}
