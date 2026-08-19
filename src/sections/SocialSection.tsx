'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { appStore } from '../lib/store';

const SOCIAL_MEDIA = [
  { src: '/assets/projects/yuna-story.svg', from: { x: '-26vw', y: '-18vh' }, to: { x: '-8%', y: '-35%' }, w: '18vw' },
  { src: '/assets/projects/mgc-scrapbook.svg', from: { x: '26vw', y: '-16vh' }, to: { x: '8%', y: '-38%' }, w: '17vw' },
  { src: '/assets/projects/comptoir-macro.svg', from: { x: '-28vw', y: '18vh' }, to: { x: '-12%', y: '34%' }, w: '15vw' },
  { src: '/assets/editorial/portrait-glwadys.svg', from: { x: '28vw', y: '20vh' }, to: { x: '12%', y: '32%' }, w: '16vw' },
];

export function SocialSection() {
  const t = useTranslations('social');
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneScreenRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isBehind, setIsBehind] = useState(false);

  useEffect(() => {
    MasterTimelineManager.init();

    const unsub = appStore.subscribe((state) => {
      setIsBehind(state.isBehindActive);
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => (window.innerWidth < 768 ? '+=160%' : '+=180%'),
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            appStore.setState({ chapterProgress: p });
            if (p > 0.94) {
              MasterTimelineManager.setChapter('gallery');
            } else {
              MasterTimelineManager.setChapter('social');
            }
          },
        },
      });

      // 0-35% : media enter and compose around phone
      tl.fromTo(
        mediaRefs.current,
        { xPercent: -200, yPercent: -150, scale: 0.7, opacity: 0 },
        {
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.04,
        }
      );

      // 35-75% : media converge into phone
      tl.to(
        mediaRefs.current,
        {
          x: 0,
          y: 0,
          scale: 0.25,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
          stagger: 0.03,
        },
        '+=0.05'
      );

      // 75-100% : phone screen expands to full viewport
      tl.to(
        phoneRef.current,
        {
          scale: 2.2,
          yPercent: 10,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        },
        '+=0.05'
      );

      tl.fromTo(
        phoneScreenRef.current,
        { scale: 0.95, opacity: 1 },
        { scale: 3, opacity: 0, duration: 0.2, ease: 'power2.in' },
        '<0.1'
      );
    }, sectionRef);

    return () => {
      unsub();
      appStore.setState({ chapterProgress: 0 });
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="social-section"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0b0c0e] z-20"
    >
      <div className="absolute top-8 left-6 md:left-14 z-30 font-mono-tag text-[10px] text-foreground-muted uppercase tracking-widest">
        <span className="text-accent-gold block text-xs mb-1">{t('tag')}</span>
        <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light">
          {t('title')}
        </h2>
      </div>

      <div className="absolute top-8 right-6 md:right-14 z-30 glass-panel px-4 py-2 rounded-full flex items-center gap-2">
        <span className={`text-[10px] font-semibold ${isBehind ? 'text-accent-gold' : 'text-foreground-light'}`}>
          {isBehind ? t('behindLabel') : t('frontLabel')}
        </span>
      </div>

      {/* Floating media */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {SOCIAL_MEDIA.map((m, i) => (
          <div
            key={m.src}
            ref={(el) => { mediaRefs.current[i] = el; }}
            className="absolute opacity-0"
            style={{
              left: '50%',
              top: '50%',
              width: m.w,
              maxWidth: '280px',
              transform: `translate(calc(-50% + ${m.from.x}), calc(-50% + ${m.from.y}))`,
            }}
          >
            <div className="overflow-hidden rounded-sm border border-white/10 shadow-2xl shadow-black/40 bg-[#15171a]">
              <img src={m.src} alt="" className="w-full h-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Phone */}
      <div
        ref={phoneRef}
        className="relative z-20 w-[38vh] max-w-[300px] aspect-[9/19.5] rounded-[3rem] bg-gradient-to-br from-[#1a1a1e] to-[#0e0e10] p-3 shadow-2xl shadow-black/60 border border-white/8"
      >
        <div
          ref={phoneScreenRef}
          className="w-full h-full rounded-[2.4rem] overflow-hidden bg-[#0b0c0e]"
        >
          <img
            src="/assets/projects/yuna-story.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-8 w-full px-6 md:px-14 flex justify-between font-mono-tag text-[10px] text-foreground-muted uppercase tracking-widest z-30">
        <span>{isBehind ? t('behindLabel') : t('frontLabel')}</span>
        <span>{t('title')}</span>
      </div>
    </section>
  );
}
