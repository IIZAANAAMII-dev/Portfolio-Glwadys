'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

export function ServicesSection() {
  const t = useTranslations('services');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.service-line');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        items,
        { y: 60, opacity: 0, rotateX: -6 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: 'power4.out',
        }
      ).fromTo(
        '.service-title',
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.45,
          ease: 'power3.out',
        },
        '<0.12'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    { title: t('s1'), desc: t('s1Desc') },
    { title: t('s2'), desc: t('s2Desc') },
    { title: t('s3'), desc: t('s3Desc') },
    { title: t('s4'), desc: t('s4Desc') },
    { title: t('s5'), desc: t('s5Desc') },
    { title: t('s6'), desc: t('s6Desc') },
    { title: t('s7'), desc: t('s7Desc') },
  ];

  return (
    <section
      id="services-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10 bg-background-dark/90"
    >
      <div className="flex justify-between items-start font-mono-tag border-b border-white/10 pb-6">
        <div>
          <span className="text-accent-gold text-xs font-semibold">{t('tag')}</span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-foreground-light mt-2">
            {t('title')}
          </h2>
        </div>
      </div>

      <div
        className="my-auto w-full max-w-6xl mx-auto space-y-2"
        style={{ perspective: '1000px' }}
      >
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="service-line group border-b border-white/10 py-4 flex flex-col md:flex-row md:items-end justify-between cursor-pointer hover:border-accent-gold transition-colors duration-300"
          >
            <h3 className="service-title font-editorial text-3xl sm:text-5xl md:text-6xl text-foreground-light group-hover:text-accent-gold transition-colors leading-tight">
              {srv.title}
            </h3>
            <p className="font-sans text-xs md:text-sm text-foreground-muted md:max-w-xs mt-1 md:mt-0 transition-opacity opacity-70 group-hover:opacity-100">
              {srv.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
