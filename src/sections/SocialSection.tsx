'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '@/motion/MasterTimeline';
import { appStore } from '@/lib/store';
import { Smartphone, Eye, Layers } from 'lucide-react';

const FRONT = [
  { id: 'f1', src: '/assets/projects/yuna-story.svg', label: 'FEED', x: '-28%', y: '-18%', z: 60, w: '14vw', r: -4 },
  { id: 'f2', src: '/assets/projects/mgc-scrapbook.svg', label: 'STORY', x: '26%', y: '-22%', z: 100, w: '16vw', r: 5 },
  { id: 'f3', src: '/assets/projects/comptoir-macro.svg', label: 'REEL', x: '0%', y: '10%', z: 40, w: '20vw', r: 0 },
  { id: 'f4', src: '/assets/projects/yuna-story.svg', label: 'CAMPAIGN', x: '-22%', y: '26%', z: 80, w: '13vw', r: 3 },
  { id: 'f5', src: '/assets/projects/mgc-scrapbook.svg', label: 'LIVE', x: '24%', y: '24%', z: 30, w: '12vw', r: -2 },
];

const BEHIND = [
  { id: 'b1', label: 'MOODBOARD', x: '-28%', y: '-18%', z: 60, w: '14vw', r: -4 },
  { id: 'b2', label: 'CAPTION', x: '26%', y: '-22%', z: 100, w: '16vw', r: 5 },
  { id: 'b3', label: 'CALENDAR', x: '0%', y: '10%', z: 40, w: '20vw', r: 0 },
  { id: 'b4', label: 'HOOK 3s', x: '-22%', y: '26%', z: 80, w: '13vw', r: 3 },
  { id: 'b5', label: 'STRATEGY', x: '24%', y: '24%', z: 30, w: '12vw', r: -2 },
];

export function SocialSection() {
  const t = useTranslations('social');
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isBehind, setIsBehind] = useState(false);

  useEffect(() => {
    const unsub = appStore.subscribe((s) => setIsBehind(s.isBehindActive));
    return () => unsub();
  }, []);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const cards = stageRef.current?.querySelectorAll('.social-card');
      const phone = stageRef.current?.querySelector('.phone-portal');
      if (!cards || !phone) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () =>
            typeof window !== 'undefined' && window.innerWidth < 768
              ? '+=220%'
              : '+=280%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.92) {
              MasterTimelineManager.setChapter('gallery');
            } else {
              MasterTimelineManager.setChapter('social');
            }
          },
        },
      });

      // Cards converge and drift in depth
      tl.fromTo(
        cards,
        { z: -100, scale: 0.85, autoAlpha: 0 },
        { z: 0, scale: 1, autoAlpha: 1, duration: 0.35, stagger: 0.03, ease: 'none' },
        0
      )
        .to(
          cards,
          { z: (i) => [60, 100, 40, 80, 30][i % 5], duration: 0.5, ease: 'none' },
          0.1
        )
        .to(
          cards,
          { xPercent: (i) => (i % 2 === 0 ? -35 : 35), autoAlpha: 0.25, duration: 0.5, ease: 'none' },
          0.55
        )
        .to(
          phone,
          { scale: 1.35, z: 180, autoAlpha: 1, duration: 0.45, ease: 'none' },
          0.6
        )
        .to(
          phone,
          { scale: 2.8, yPercent: -5, duration: 0.4, ease: 'none' },
          0.9
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="social-section"
      ref={sectionRef}
      className="social-surface relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
      style={{ perspective: '1400px' }}
    >
      {/* Top */}
      <div className="flex justify-between items-start font-mono-tag z-30">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>
        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
          {isBehind ? (
            <>
              <Layers className="w-3.5 h-3.5 text-accent-gold" />
              <span className="text-xs text-accent-gold font-semibold">{t('behindLabel')}</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-foreground-muted" />
              <span className="text-xs text-foreground-light">{t('frontLabel')}</span>
            </>
          )}
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {FRONT.map((post, i) => (
          <div
            key={post.id}
            className="social-card absolute w-[28vw] max-w-[260px] aspect-[3/4] overflow-hidden border border-white/10 rounded-2xl bg-surface/40 will-change-transform"
            style={{
              transform: `translate3d(${post.x}, ${post.y}, ${isBehind ? -200 : post.z}px) rotate(${post.r}deg)`,
              opacity: isBehind ? 0 : 1,
              transition: 'transform 0.8s ease, opacity 0.6s ease',
            }}
          >
            <img src={post.src} alt="" className="w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 font-mono-tag text-[9px] text-foreground-light/70">
              {post.label}
            </span>
          </div>
        ))}

        {BEHIND.map((post, i) => (
          <div
            key={post.id}
            className="social-card absolute w-[28vw] max-w-[260px] aspect-[3/4] overflow-hidden border border-white/10 rounded-2xl bg-surface/80 backdrop-blur-sm will-change-transform flex flex-col justify-between p-4"
            style={{
              transform: `translate3d(${post.x}, ${post.y}, ${isBehind ? post.z : -200}px) rotate(${post.r}deg)`,
              opacity: isBehind ? 1 : 0,
              transition: 'transform 0.8s ease, opacity 0.6s ease',
            }}
          >
            <span className="font-mono-tag text-[10px] text-accent-gold tracking-widest">
              {post.label}
            </span>
            <p className="font-sans text-xs text-foreground-muted leading-relaxed">
              {i === 0 ? t('behindDesc') : i === 2 ? t('behindRightDesc') : t('behindRightDesc')}
            </p>
          </div>
        ))}

        {/* Phone portal */}
        <div
          className="phone-portal absolute w-[16vw] max-w-[200px] aspect-[9/19.5] will-change-transform opacity-0 scale-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-50px)',
          }}
        >
          <div className="relative w-full h-full rounded-[2.4rem] border-4 border-[#1a1a1d] bg-black shadow-2xl overflow-hidden">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-10" />
            <img
              src="/assets/projects/yuna-story.svg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] z-30">
        <span>{t('tag')}</span>
        <span className="flex items-center gap-2">
          <Smartphone className="w-3 h-3 text-accent-gold" />
          {t('diveHint')}
        </span>
      </div>
    </section>
  );
}
