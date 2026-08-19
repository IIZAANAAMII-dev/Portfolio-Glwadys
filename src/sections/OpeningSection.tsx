'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { appStore } from '@/lib/store';
import { MasterTimelineManager } from '@/motion/MasterTimeline';

export function OpeningSection({ locale }: { locale: string }) {
  const tHero = useTranslations('hero');
  const tIntro = useTranslations('intro');

  const sectionRef = useRef<HTMLElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const glwadysRef = useRef<HTMLDivElement>(null);
  const dalleauRef = useRef<HTMLDivElement>(null);
  const glwadysInnerRef = useRef<HTMLSpanElement>(null);
  const dalleauInnerRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);

  const portraitRef = useRef<HTMLDivElement>(null);
  const leftFarRef = useRef<HTMLDivElement>(null);
  const leftNearRef = useRef<HTMLDivElement>(null);
  const rightNearRef = useRef<HTMLDivElement>(null);
  const rightFarRef = useRef<HTMLDivElement>(null);

  const [morphed, setMorphed] = useState(false);

  useEffect(() => {
    MasterTimelineManager.init();
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMorphed(true);
      appStore.setState({ isLoaded: true, currentChapter: 'hero' });
      return;
    }

    const ctx = gsap.context(() => {
      const setBase = gsap.set;

      setBase([portraitRef.current, leftFarRef.current, leftNearRef.current, rightNearRef.current, rightFarRef.current], {
        opacity: 0,
        scale: 0.9,
      });

      setBase(glwadysInnerRef.current, { yPercent: 100 });
      setBase(dalleauInnerRef.current, { yPercent: 100 });

      const introTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          appStore.setState({ isLoaded: true, currentChapter: 'hero' });
          setMorphed(true);
        },
      });

      introTl
        .fromTo(metaRef.current, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .fromTo(glwadysInnerRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, '-=0.35')
        .fromTo(dalleauInnerRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out' }, '-=0.7')
        .fromTo(glwadysRef.current, { letterSpacing: '0.18em' }, { letterSpacing: '-0.04em', duration: 1.2, ease: 'expo.out' }, '-=0.8')
        .fromTo(dalleauRef.current, { letterSpacing: '0.18em' }, { letterSpacing: '-0.04em', duration: 1.2, ease: 'expo.out' }, '-=1.1')
        .addLabel('media', '-=0.6')
        .fromTo(leftFarRef.current, { x: '-60vw', opacity: 0, scale: 0.85 }, { x: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out' }, 'media')
        .fromTo(leftNearRef.current, { x: '-70vw', opacity: 0, scale: 0.85 }, { x: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out' }, 'media+=0.12')
        .fromTo(portraitRef.current, { y: '85vh', opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.15, ease: 'power3.out' }, 'media+=0.22')
        .fromTo(rightNearRef.current, { x: '70vw', opacity: 0, scale: 0.85 }, { x: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out' }, 'media+=0.34')
        .fromTo(rightFarRef.current, { x: '60vw', opacity: 0, scale: 0.85 }, { x: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out' }, 'media+=0.46')
        .addLabel('morph', '+=0.35')
        .to(glwadysRef.current, { x: '-30vw', y: '-22vh', duration: 1.3, ease: 'expo.inOut' }, 'morph')
        .to(dalleauRef.current, { x: '30vw', y: '20vh', duration: 1.3, ease: 'expo.inOut' }, 'morph')
        .to(metaRef.current, { x: '-30vw', y: '-6vh', autoAlpha: 0.6, duration: 1.0, ease: 'expo.inOut' }, 'morph')
        .fromTo(taglineRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 'morph+=0.3')
        .fromTo(rolesRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 'morph+=0.5');
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]);

  useEffect(() => {
    if (!morphed) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => (window.innerWidth < 768 ? '+=110%' : '+=150%'),
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.85) {
              MasterTimelineManager.setChapter('identity');
            } else {
              MasterTimelineManager.setChapter('hero');
            }
          },
        },
      });

      scrollTl
        .to({}, { duration: 0.15 })
        .to([leftFarRef.current, leftNearRef.current], { x: '-=18vw', opacity: 0.55, duration: 0.35, ease: 'none' }, 0.15)
        .to([rightFarRef.current, rightNearRef.current], { x: '+=18vw', opacity: 0.55, duration: 0.35, ease: 'none' }, 0.15)
        .to(portraitRef.current, { scale: 1.15, duration: 0.4, ease: 'none' }, 0.15)
        .to(glwadysRef.current, { x: '-=8vw', opacity: 0.75, duration: 0.4, ease: 'none' }, 0.35)
        .to(dalleauRef.current, { x: '+=8vw', opacity: 0.75, duration: 0.4, ease: 'none' }, 0.35)
        .to(taglineRef.current, { autoAlpha: 0.18, y: -24, duration: 0.3, ease: 'none' }, 0.35)
        .to(portraitRef.current, { scale: 1.45, y: '-5vh', duration: 0.45, ease: 'none' }, 0.55)
        .to([glwadysRef.current, dalleauRef.current], { autoAlpha: 0.25, duration: 0.4, ease: 'none' }, 0.55)
        .to([leftFarRef.current, leftNearRef.current, rightFarRef.current, rightNearRef.current], { autoAlpha: 0.15, duration: 0.35, ease: 'none' }, 0.6)
        .to(portraitRef.current, { scale: 1.75, opacity: 1, duration: 0.35, ease: 'none' }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, [morphed]);

  useEffect(() => {
    if (!morphed || window.innerWidth < 768) return;

    const q = gsap.quickTo;
    const movers = [
      { el: portraitRef.current, x: q(portraitRef.current, 'x', { duration: 0.7, ease: 'power2.out' }), y: q(portraitRef.current, 'y', { duration: 0.7, ease: 'power2.out' }), k: 0.06 },
      { el: leftFarRef.current, x: q(leftFarRef.current, 'x', { duration: 0.85, ease: 'power2.out' }), y: q(leftFarRef.current, 'y', { duration: 0.85, ease: 'power2.out' }), k: 0.18 },
      { el: leftNearRef.current, x: q(leftNearRef.current, 'x', { duration: 0.75, ease: 'power2.out' }), y: q(leftNearRef.current, 'y', { duration: 0.75, ease: 'power2.out' }), k: 0.12 },
      { el: rightNearRef.current, x: q(rightNearRef.current, 'x', { duration: 0.75, ease: 'power2.out' }), y: q(rightNearRef.current, 'y', { duration: 0.75, ease: 'power2.out' }), k: 0.12 },
      { el: rightFarRef.current, x: q(rightFarRef.current, 'x', { duration: 0.85, ease: 'power2.out' }), y: q(rightFarRef.current, 'y', { duration: 0.85, ease: 'power2.out' }), k: 0.18 },
    ].filter((m) => m.el) as { el: Element; x: (v: number) => void; y: (v: number) => void; k: number }[];

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      movers.forEach((m) => {
        m.x(dx * m.k * 80);
        m.y(dy * m.k * 56);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [morphed]);

  const media = {
    portrait: '/assets/editorial/portrait-glwadys.svg',
    leftFar: '/assets/projects/mgc-scrapbook.svg',
    leftNear: '/assets/projects/comptoir-macro.svg',
    rightNear: '/assets/projects/yuna-story.svg',
    rightFar: '/assets/projects/mgc-scrapbook.svg',
  };

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background-dark z-10 select-none"
      aria-label="Glwadys Dalleau"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #d8c29d 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Top metadata */}
      <div ref={metaRef} className="absolute top-8 left-1/2 -translate-x-1/2 text-center font-mono-tag text-[10px] tracking-[0.2em] text-foreground-muted will-change-transform">
        <p className="text-foreground-light">{tIntro('sub')}</p>
        <p className="text-accent-gold mt-1">{tIntro('location')}</p>
      </div>

      {/* Name — GLWADYS */}
      <div
        ref={glwadysRef}
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 text-foreground-light will-change-transform z-[5]"
      >
        <div className="overflow-hidden">
          <span ref={glwadysInnerRef} className="block font-editorial text-[13vw] md:text-[12vw] leading-[0.82] tracking-[-0.04em] uppercase whitespace-nowrap">
            GLWADYS
          </span>
        </div>
      </div>

      {/* Name — DALLEAU */}
      <div
        ref={dalleauRef}
        className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 text-accent-gold will-change-transform z-[5]"
      >
        <div className="overflow-hidden">
          <span ref={dalleauInnerRef} className="block font-editorial text-[13vw] md:text-[12vw] leading-[0.82] tracking-[-0.04em] uppercase whitespace-nowrap">
            DALLEAU
          </span>
        </div>
      </div>

      {/* Portrait */}
      <div
        ref={portraitRef}
        className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[36vw] max-w-[420px] aspect-[3/4] will-change-transform z-[3]"
      >
        <img
          src={media.portrait}
          alt="Glwadys Dalleau"
          className="w-full h-full object-cover rounded-[3rem] border border-white/10 shadow-2xl"
        />
      </div>

      {/* Satellite media */}
      <div
        ref={leftFarRef}
        className="absolute left-[8%] top-[24%] -translate-x-1/2 -translate-y-1/2 w-[8vw] max-w-[120px] aspect-[3/5] will-change-transform z-[4]"
      >
        <img src={media.leftFar} alt="" className="w-full h-full object-cover rounded-2xl border border-white/10" />
      </div>
      <div
        ref={leftNearRef}
        className="absolute left-[20%] top-[56%] -translate-x-1/2 -translate-y-1/2 w-[13vw] max-w-[180px] aspect-[4/5] will-change-transform z-[6]"
      >
        <img src={media.leftNear} alt="" className="w-full h-full object-cover rounded-2xl border border-white/10" />
      </div>
      <div
        ref={rightNearRef}
        className="absolute left-[80%] top-[54%] -translate-x-1/2 -translate-y-1/2 w-[14vw] max-w-[200px] aspect-[4/5] will-change-transform z-[6]"
      >
        <img src={media.rightNear} alt="" className="w-full h-full object-cover rounded-2xl border border-white/10" />
      </div>
      <div
        ref={rightFarRef}
        className="absolute left-[91%] top-[26%] -translate-x-1/2 -translate-y-1/2 w-[8vw] max-w-[120px] aspect-[3/5] will-change-transform z-[4]"
      >
        <img src={media.rightFar} alt="" className="w-full h-full object-cover rounded-2xl border border-white/10" />
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="absolute left-1/2 top-[74%] -translate-x-1/2 max-w-2xl text-center px-6 will-change-transform z-[5]"
      >
        <p className="font-sans text-lg md:text-2xl font-light text-accent-gold leading-snug tracking-tight">
          {tHero('headlinePart1')} {tHero('headlinePart2')}{' '}
          <span className="font-editorial italic text-foreground-light">{tHero('headlinePart3')}</span>{' '}
          {tHero('headlinePart4')}
        </p>
      </div>

      {/* Role & location */}
      <div
        ref={rolesRef}
        className="absolute bottom-8 left-8 font-mono-tag text-[10px] tracking-[0.18em] text-foreground-muted will-change-transform z-[5]"
      >
        <p className="text-foreground-light">{tIntro('roles')}</p>
        <p className="text-accent-gold mt-1">{tIntro('location')}</p>
      </div>
    </section>
  );
}
