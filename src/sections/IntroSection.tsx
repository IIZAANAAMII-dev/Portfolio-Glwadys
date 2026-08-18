'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '../motion/MasterTimeline';
import { appStore } from '../lib/store';

export function IntroSection() {
  const t = useTranslations('intro');
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      // Premium intro cinematic
      const tl = gsap.timeline({
        onComplete: () => {
          appStore.setState({ currentChapter: 'hero' });
          setVisible(false);
        },
      });
      tl.fromTo(
        metaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power4.out' }
      ).fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.8, ease: 'expo.out' },
        '-=0.35'
      ).fromTo(
        nameRef.current,
        { clipPath: 'inset(0 0 100% 0)', yPercent: 10 },
        { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 1.0, ease: 'expo.out' },
        '-=0.45'
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro-section"
      ref={sectionRef}
      aria-hidden={!visible}
      className={`fixed inset-0 min-h-screen w-full flex flex-col justify-between items-center p-6 md:p-14 z-[60] select-none pointer-events-none bg-background-dark transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 invisible'}`}
    >
      {/* Top Intro Tag */}
      <div ref={metaRef} className="w-full flex justify-between items-start text-foreground-muted font-mono-tag">
        <div>
          <p className="text-foreground-light tracking-widest">{t('sub')}</p>
          <p className="text-[10px] text-accent-gold mt-1">{t('location')}</p>
        </div>
        <div className="text-right">
          <p>{t('roles')}</p>
        </div>
      </div>

      {/* Centered Name + Vertical Hairline */}
      <div className="my-auto flex flex-col items-center justify-center text-center overflow-hidden">
        <div
          ref={lineRef}
          className="w-[1px] h-24 md:h-32 bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent origin-top mb-8"
        />
        <div ref={nameRef} className="font-editorial uppercase leading-[0.76] tracking-[-0.06em] text-[12vw] md:text-[9vw] text-foreground-light">
          <span className="block">Glwadys</span>
          <span className="block pl-[8vw] text-accent-gold">Dalleau</span>
        </div>
      </div>

      <div className="w-full flex justify-between items-end font-mono-tag text-foreground-muted">
        <span className="text-[10px] tracking-widest text-accent-gold/80 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-ping" />
          {t('scrollHint')}
        </span>
        <span className="text-[10px] text-foreground-muted">{t('sub')}</span>
      </div>
    </section>
  );
}
