'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { appStore } from '../lib/store';
import { Smartphone, Eye, Layers } from 'lucide-react';

export function SocialSection() {
  const t = useTranslations('social');
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
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
          end: () => window.innerWidth < 768 ? '+=220%' : '+=290%',
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

      // A dedicated, opaque phone scene: content clears before the camera enters.
      tl.to('.social-card-left', { xPercent: -120, opacity: 0, duration: 0.75 })
        .to('.social-card-right', { xPercent: 120, opacity: 0, duration: 0.75 }, '<')
        .to(
          {},
          {
              duration: 1.35,
            onUpdate: function () {
              const prog = this.progress();
              // Camera advances straight into the phone screen center (Camera Dive)
              MasterTimelineManager.updateCamera({
                z: gsap.utils.interpolate(7.5, 1.4, prog),
                y: gsap.utils.interpolate(-3.0, -6.5, prog),
                fov: gsap.utils.interpolate(45, 54, prog),
              });
            },
          },
          '<'
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
      className="social-surface relative min-h-screen w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden z-10"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-mono-tag">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            {t('title')}
          </h2>
        </div>

        {/* Front / Behind Status Indicator */}
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

      {/* Floating Spatial Cards (Front / Behind DOM representations) */}
      <div ref={cardsContainerRef} className="my-auto grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full items-center">
        {/* Left Card: Editorial Feed */}
        <div className="social-card-left glass-panel p-6 rounded-3xl border border-white/10 transition-all duration-500">
          <h3 className="font-editorial text-xl text-foreground-light">
            {isBehind ? t('behindTitle') : t('frontTitle')}
          </h3>
          <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
            {isBehind ? t('behindDesc') : t('frontDesc')}
          </p>
        </div>

        {/* Center Target: Smartphone Dive Portal */}
        <div className="glass-panel p-8 rounded-3xl border border-accent-gold/40 text-center flex flex-col items-center justify-center relative shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center mb-3">
            <Smartphone className="w-6 h-6 text-accent-gold" />
          </div>
          <span className="font-mono-tag text-[10px] text-accent-gold font-bold">
            {t('diveHint')}
          </span>
        </div>

        {/* Right Card: Short-form Reels */}
        <div className="social-card-right glass-panel p-6 rounded-3xl border border-white/10 transition-all duration-500">
          <h3 className="font-editorial text-xl text-foreground-light">
            {isBehind ? t('behindRightTitle') : t('frontRightTitle')}
          </h3>
          <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
            {isBehind ? t('behindRightDesc') : t('frontRightDesc')}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px]">
        <span>{t('tag')}</span>
        <span>{t('title')}</span>
      </div>
    </section>
  );
}
