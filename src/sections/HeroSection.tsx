'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { appStore } from '../lib/store';

const isMobile = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

const mediaAssets = [
  {
    key: 'left-far',
    src: '/assets/projects/mgc-scrapbook.svg',
    alt: 'Moodboard',
    layer: 'bg',
    positionClass:
      'left-[4vw] md:left-[7vw] top-[14vh] w-[12vw] min-w-[88px] max-w-[150px] aspect-[3/4]',
  },
  {
    key: 'left-near',
    src: '',
    alt: 'Reel',
    layer: 'mid',
    positionClass:
      'left-[14vw] md:left-[20vw] bottom-[18vh] w-[16vw] min-w-[110px] max-w-[220px] aspect-[4/3]',
    color: true,
  },
  {
    key: 'portrait',
    src: '/assets/editorial/portrait-glwadys.svg',
    alt: 'Glwadys Dalleau',
    layer: 'mid',
    positionClass:
      'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] min-w-[220px] max-w-[360px] aspect-[3/4]',
  },
  {
    key: 'right-near',
    src: '/assets/projects/yuna-story.svg',
    alt: 'Story',
    layer: 'fg',
    positionClass:
      'right-[14vw] md:right-[20vw] top-[18vh] w-[14vw] min-w-[100px] max-w-[190px] aspect-[3/4]',
  },
  {
    key: 'right-far',
    src: '/assets/projects/comptoir-macro.svg',
    alt: 'Projet',
    layer: 'bg',
    positionClass:
      'right-[4vw] md:right-[7vw] bottom-[16vh] w-[13vw] min-w-[90px] max-w-[160px] aspect-[4/5]',
  },
];

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const quickSetters = useRef<{
    [key: string]: { x: gsap.QuickToFunc; y: gsap.QuickToFunc };
  }>({});

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      // Intro set states
      gsap.set('.intro-name-top', {
        clipPath: 'inset(0 0 100% 0)',
        yPercent: 20,
        opacity: 1,
      });
      gsap.set('.intro-name-bottom', {
        clipPath: 'inset(0 0 100% 0)',
        yPercent: 20,
        opacity: 1,
      });
      gsap.set('.intro-media', { opacity: 0, y: 60, scale: 0.95 });
      gsap.set('.hero-meta', { opacity: 0, y: 18 });
      gsap.set('.hero-headline', { opacity: 0, y: 30 });

      // Intro timeline: title sequence -> media arrival -> hero composition
      const introTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          appStore.setState({ currentChapter: 'hero' });
        },
      });

      introTl
        .to('.intro-name-top', {
          clipPath: 'inset(0 0 0% 0)',
          yPercent: 0,
          duration: 1.05,
          ease: 'expo.out',
        })
        .to(
          '.intro-name-bottom',
          {
            clipPath: 'inset(0 0 0% 0)',
            yPercent: 0,
            duration: 1.05,
            ease: 'expo.out',
          },
          '-=0.78'
        )
        .to(
          '.intro-media',
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.14,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .to(
          '.hero-meta',
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.7'
        )
        // Transformation: words split, media settle into hero composition
        .to(
          '.intro-name-top',
          {
            yPercent: -14,
            xPercent: -8,
            duration: 1.4,
            ease: 'power3.inOut',
          },
          'reveal'
        )
        .to(
          '.intro-name-bottom',
          {
            yPercent: 14,
            xPercent: 8,
            duration: 1.4,
            ease: 'power3.inOut',
          },
          'reveal'
        )
        .to(
          '.intro-media',
          {
            duration: 1.4,
            scale: 1.02,
            ease: 'power3.inOut',
            stagger: 0.04,
          },
          'reveal'
        )
        .to(
          '.hero-headline',
          { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' },
          'reveal-=0.4'
        );

      // Scroll-driven hero cinematic
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => (window.innerWidth < 768 ? '+=140%' : '+=180%'),
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.6) {
              MasterTimelineManager.setChapter('identity');
            } else {
              MasterTimelineManager.setChapter('hero');
            }
          },
        },
      });

      // Phase A-B: lateral media react
      scrollTl
        .to(
          '.media-left-far',
          { xPercent: -55, yPercent: -15, opacity: 0, duration: 1 },
          0
        )
        .to(
          '.media-left-near',
          { xPercent: -85, yPercent: 25, opacity: 0, duration: 1 },
          0
        )
        .to(
          '.media-right-near',
          { xPercent: 75, yPercent: -20, opacity: 0, duration: 1 },
          0
        )
        .to(
          '.media-right-far',
          { xPercent: 55, yPercent: 20, opacity: 0, duration: 1 },
          0
        )
        .to(
          '.intro-name-top',
          { xPercent: -22, opacity: 0.25, duration: 1 },
          0
        )
        .to(
          '.intro-name-bottom',
          { xPercent: 22, opacity: 0.25, duration: 1 },
          0
        )
        .to(
          '.hero-headline',
          { opacity: 0, y: -40, duration: 0.8 },
          0.1
        );

      // Phase D: portrait becomes dominant
      scrollTl.to(
        '.media-portrait',
        {
          scale: 1.55,
          xPercent: -50,
          yPercent: -50,
          opacity: 0.9,
          duration: 1,
          ease: 'none',
        },
        0.25
      );

      // Phase E: chapter handoff stays DOM-only; 3D begins in Social
    }, sectionRef);

    // Mouse parallax using gsap.quickTo (performant, only desktop)
    let mouseHandler: ((e: MouseEvent) => void) | null = null;
    if (!isMobile()) {
      quickSetters.current = {
        fg: {
          x: gsap.quickTo('.layer-fg', 'x', { duration: 0.65, ease: 'power2.out' }),
          y: gsap.quickTo('.layer-fg', 'y', { duration: 0.65, ease: 'power2.out' }),
        },
        mid: {
          x: gsap.quickTo('.layer-mid', 'x', { duration: 0.75, ease: 'power2.out' }),
          y: gsap.quickTo('.layer-mid', 'y', { duration: 0.75, ease: 'power2.out' }),
        },
        bg: {
          x: gsap.quickTo('.layer-bg', 'x', { duration: 0.85, ease: 'power2.out' }),
          y: gsap.quickTo('.layer-bg', 'y', { duration: 0.85, ease: 'power2.out' }),
        },
      };

      mouseHandler = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        mouse.current.x = x;
        mouse.current.y = y;

        quickSetters.current.fg?.x(x * 22);
        quickSetters.current.fg?.y(y * 14);
        quickSetters.current.mid?.x(x * 12);
        quickSetters.current.mid?.y(y * 8);
        quickSetters.current.bg?.x(x * 6);
        quickSetters.current.bg?.y(y * 4);
      };
      window.addEventListener('mousemove', mouseHandler);
    }

    return () => {
      ctx.revert();
      if (mouseHandler) window.removeEventListener('mousemove', mouseHandler);
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden z-10 bg-background-dark select-none"
    >
      {/* Top metadata */}
      <div className="hero-meta absolute top-6 md:top-10 left-6 md:left-14 z-20">
        <p className="font-mono-tag text-[10px] text-accent-gold tracking-widest">
          GLWADYS DALLEAU
        </p>
        <p className="font-mono-tag text-[10px] text-foreground-muted mt-1">
          SOCIAL · CONTENT · BRAND
        </p>
      </div>
      <div className="hero-meta absolute top-6 md:top-10 right-6 md:right-14 z-20 text-right">
        <p className="font-mono-tag text-[10px] text-accent-gold tracking-widest">
          MARSEILLE
        </p>
        <p className="font-mono-tag text-[10px] text-foreground-muted mt-1">
          FRANCE
        </p>
      </div>

      {/* Main stage */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Top name: GLWADYS */}
        <h1 className="intro-name-top font-editorial text-[13vw] md:text-[11vw] leading-[0.82] tracking-tighter text-foreground-light uppercase absolute top-[10vh] left-0 w-full text-center pointer-events-none z-30 will-change-transform">
          GLWADYS
        </h1>

        {/* Bottom name: DALLEAU */}
        <h1 className="intro-name-bottom font-editorial text-[13vw] md:text-[11vw] leading-[0.82] tracking-tighter text-foreground-light/80 uppercase absolute bottom-[10vh] left-0 w-full text-center pointer-events-none z-30 will-change-transform">
          DALLEAU
        </h1>

        {/* Headline */}
        <div className="hero-headline absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-40 max-w-xl md:max-w-2xl px-6 will-change-transform">
          <p className="font-sans text-lg md:text-2xl font-light text-accent-gold leading-snug tracking-tight">
            {t('headline')}
          </p>
          <p className="font-mono-tag text-[10px] text-foreground-muted mt-4 tracking-widest">
            SOCIAL MEDIA MANAGER · CONTENT CREATION · BRAND COMMUNICATION
          </p>
        </div>

        {/* Media pieces */}
        {mediaAssets.map((m, i) => (
          <div
            key={m.key}
            className={`intro-media ${m.positionClass} absolute z-20 will-change-transform ${
              m.layer === 'fg'
                ? 'layer-fg'
                : m.layer === 'mid'
                ? 'layer-mid'
                : 'layer-bg'
            } ${m.key === 'portrait' ? 'media-portrait' : `media-${m.key}`}`}
          >
            <div className="w-full h-full overflow-hidden border border-white/[0.08] bg-surface/40 rounded-[1px]">
              {m.src ? (
                <img
                  src={m.src}
                    alt={m.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent-gold/10 flex items-center justify-center">
                  <span className="font-mono-tag text-[9px] text-accent-gold tracking-widest">
                    {m.alt}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
