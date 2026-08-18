'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { appStore } from '../lib/store';

export function ServicesSection() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const services = [
    { title: t('s1'), desc: t('s1Desc'), code: '01 / SMM' },
    { title: t('s2'), desc: t('s2Desc'), code: '02 / CONTENT' },
    { title: t('s3'), desc: t('s3Desc'), code: '03 / STRATEGY' },
    { title: t('s4'), desc: t('s4Desc'), code: '04 / BRAND' },
    { title: t('s5'), desc: t('s5Desc'), code: '05 / MARKETING' },
    { title: t('s6'), desc: t('s6Desc'), code: '06 / COMMUNITY' },
    { title: t('s7'), desc: t('s7Desc'), code: '07 / RESEARCH' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('.service-line');

      gsap.from(items || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.0,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 my-12"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-accent-gold text-xs font-semibold">{t('tag')}</span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-foreground-light mt-2">
            {t('title')}
          </h2>
        </div>
        <span className="text-xs text-foreground-muted hidden sm:inline">
          EXPERTISE COMPLÈTE & STRATÉGIE
        </span>
      </div>

      {/* Typographic Services Lines */}
      <div className="my-auto py-8 space-y-4 max-w-6xl mx-auto w-full">
        {services.map((srv, idx) => (
          <div
            key={idx}
            onMouseEnter={() => {
              setHoveredIdx(idx);
              appStore.setState({ cursorMode: 'view', cursorText: srv.code });
            }}
            onMouseLeave={() => {
              setHoveredIdx(null);
              appStore.setState({ cursorMode: 'default', cursorText: undefined });
            }}
            className="service-line group border-b border-white/10 pb-4 pt-2 flex flex-col md:flex-row md:items-center justify-between transition-all duration-300 cursor-pointer hover:border-accent-gold"
          >
            <div className="flex items-baseline gap-4 md:gap-8">
              <span className="font-mono text-xs text-accent-gold font-semibold">
                {srv.code}
              </span>
              <h3 className="font-editorial text-2xl sm:text-4xl md:text-5xl text-foreground-light group-hover:text-accent-gold transition-colors tracking-tight">
                {srv.title}
              </h3>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0">
              <p className="font-sans text-xs text-foreground-muted max-w-xs transition-opacity opacity-70 group-hover:opacity-100">
                {srv.desc}
              </p>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-background-dark transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] border-t border-white/10 pt-4">
        <span>TYPOGRAPHIE & MOTIONS IDENTIFIÉES</span>
        <span>09 / SERVICES & COMPÉTENCES</span>
      </div>
    </section>
  );
}
