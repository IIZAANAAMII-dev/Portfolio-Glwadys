'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';

const MEDIA = [
  { src: '/assets/editorial/portrait-glwadys.svg', x: '50%', y: '46%', w: '30vw', anchor: 'center' },
  { src: '/assets/projects/yuna-story.svg', x: '18%', y: '22%', w: '16vw' },
  { src: '/assets/projects/mgc-scrapbook.svg', x: '82%', y: '24%', w: '15vw' },
  { src: '/assets/projects/comptoir-macro.svg', x: '20%', y: '74%', w: '14vw' },
];

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLDivElement>(null);
  const glwadysRef = useRef<HTMLHeadingElement>(null);
  const dalleauRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [glwadysRef.current, dalleauRef.current],
        { yPercent: 18, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.4 }
      );

      gsap.fromTo(
        headlineRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.75 }
      );

      mediaRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0.85, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            delay: 0.6 + i * 0.1,
          }
        );
      });
    }, sectionRef);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTick = () => {
      mediaRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = i === 0 ? 0.015 : 0.035;
        gsap.to(el, {
          x: mouse.current.x * depth * window.innerWidth,
          y: mouse.current.y * depth * window.innerHeight,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };

    window.addEventListener('mousemove', onMove);
    gsap.ticker.add(onTick);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0b0c0e] z-10 select-none"
    >
      <div className="pointer-events-none absolute inset-0">
        {MEDIA.map((m, i) => (
          <div
            key={m.src}
            ref={(el) => { mediaRefs.current[i] = el; }}
            className="absolute opacity-0"
            style={{
              left: m.x,
              top: m.y,
              width: m.w,
              maxWidth: '320px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="overflow-hidden rounded-sm border border-white/10 shadow-2xl shadow-black/40 bg-[#15171a]">
              <img
                src={m.src}
                alt=""
                className="w-full h-auto"
                style={{ filter: 'saturate(0.9) brightness(1.05)' }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-4">
        <h1
          ref={glwadysRef}
          className="font-editorial text-[15vw] md:text-[12vw] leading-[0.8] tracking-[-0.05em] text-foreground-light font-medium uppercase"
        >
          GLWADYS
        </h1>
        <h1
          ref={dalleauRef}
          className="font-editorial text-[15vw] md:text-[12vw] leading-[0.8] tracking-[-0.05em] text-foreground-light/80 font-medium uppercase"
        >
          DALLEAU
        </h1>
      </div>

      <div
        ref={headlineRef}
        className="relative z-20 mt-8 max-w-2xl text-center px-6 opacity-0"
      >
        <p className="font-sans text-lg sm:text-2xl md:text-3xl font-light text-accent-gold leading-snug tracking-tight">
          {t('headlinePart1')} {t('headlinePart2')}{' '}
          <span className="font-editorial italic font-normal text-foreground-light">
            {t('headlinePart3')}
          </span>{' '}
          {t('headlinePart4')}
        </p>
      </div>

      <div className="absolute bottom-8 w-full px-6 md:px-14 flex justify-between items-end font-mono-tag text-[10px] text-foreground-muted uppercase tracking-widest z-20 pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span className="text-foreground-light">{t('roleTag')}</span>
          <span className="text-accent-gold">{t('experienceYears')}</span>
        </div>
        <div className="text-right hidden md:block">
          <span className="block text-foreground-light">Marseille — FR</span>
          <span className="block text-foreground-muted">Portfolio 2026</span>
        </div>
      </div>
    </section>
  );
}
