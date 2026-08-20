'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { MasterTimelineManager } from '@/motion/MasterTimeline';

const SCREENS = [
  { id: 'feed', src: '/assets/projects/yuna-story.svg', label: 'FEED' },
  { id: 'story', src: '/assets/projects/mgc-scrapbook.svg', label: 'STORY' },
  { id: 'reel', src: '/assets/projects/comptoir-macro.svg', label: 'REEL' },
  { id: 'campaign', src: '/assets/projects/yuna-story.svg', label: 'CAMPAIGN' },
];

export function PhoneStorySection() {
  const t = useTranslations('social');
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const screensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MasterTimelineManager.init();

    const ctx = gsap.context(() => {
      const screens = screensRef.current?.querySelectorAll('.phone-screen');
      if (!screens || screens.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.85) {
              MasterTimelineManager.setChapter('gallery');
            } else {
              MasterTimelineManager.setChapter('social');
            }
          },
        },
      });

      // Phone frames in
      tl.fromTo(
        phoneRef.current,
        { scale: 0.7, autoAlpha: 0, y: 60 },
        { scale: 1, autoAlpha: 1, y: 0, duration: 0.3, ease: 'none' },
        0
      );

      // Screen transitions: 4 beats
      screens.forEach((screen, i) => {
        const start = 0.15 + i * 0.2;
        const next = screens[i + 1];

        tl.to(screen, { autoAlpha: 1, scale: 1, duration: 0.12, ease: 'none' }, start);

        if (next) {
          tl.to(screen, { autoAlpha: 0, scale: 0.96, duration: 0.1, ease: 'none' }, start + 0.18)
            .to(next, { autoAlpha: 1, scale: 1, duration: 0.1, ease: 'none' }, start + 0.22);
        }
      });

      // Final zoom: screen fills viewport, bezel leaves
      tl.to(
        phoneRef.current,
        { scale: 4.5, yPercent: -5, duration: 0.35, ease: 'none' },
        0.85
      );
      tl.to(
        '.phone-bezel',
        { autoAlpha: 0, duration: 0.2, ease: 'none' },
        0.85
      );
      tl.to(
        '.phone-screen-active',
        { scale: 1.05, duration: 0.3, ease: 'none' },
        0.9
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="phone-section"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background-dark z-10 flex flex-col justify-between p-6 md:p-14 select-none"
      aria-label="Phone Story"
    >
      <div className="flex justify-between items-start font-mono-tag z-20">
        <div>
          <span className="text-accent-gold text-xs">{t('tag')}</span>
          <h2 className="font-editorial text-2xl sm:text-4xl text-foreground-light mt-1">
            PHONE STORY
          </h2>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          ref={phoneRef}
          className="relative w-[26vw] max-w-[320px] aspect-[9/19.5] will-change-transform"
        >
          <div className="phone-bezel absolute inset-0 rounded-[3rem] bg-[#0a0a0c] border border-white/[0.15] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-20" />
            <div className="absolute inset-[6px] rounded-[2.6rem] overflow-hidden bg-background-dark">
              <div
                ref={screensRef}
                className="relative w-full h-full"
              >
                {SCREENS.map((screen, i) => (
                  <div
                    key={screen.id}
                    className={`phone-screen phone-screen-active absolute inset-0 will-change-transform ${
                      i === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={screen.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 font-mono-tag text-[10px] text-foreground-light/80 tracking-widest">
                      {screen.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end font-mono-tag text-foreground-muted text-[10px] z-20">
        <span>FEED · STORY · REEL · CAMPAIGN</span>
        <span>{t('diveHint')}</span>
      </div>
    </section>
  );
}
