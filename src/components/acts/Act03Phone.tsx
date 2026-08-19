'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { mediaSlots } from '@/lib/media';
import { cn } from '@/lib/utils';

export function Act03Phone() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=250%',
            pin: wrapperRef.current,
            scrub: 0.7,
            pinSpacing: true,
          },
        });

        // 0-20%: phone birth
        tl.fromTo(frameRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, ease: 'none' }, 0)
          .fromTo(reflectionRef.current, { opacity: 0 }, { opacity: 0.12, ease: 'none' }, 0.05)
          .fromTo(screenRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, ease: 'none' }, 0.05)
          .fromTo(feedRef.current, { y: '60%' }, { y: '0%', ease: 'none' }, 0.1);

        // 20-45%: feed scroll
        tl.to(feedRef.current, { y: '-70%', ease: 'none' }, 0.2)
          .fromTo(focusRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, ease: 'none' }, 0.35)
          .to(focusRef.current, { opacity: 0, scale: 1.05, ease: 'none' }, 0.45);

        // 45-70%: story/reel vertical
        tl.to(feedRef.current, { opacity: 0, ease: 'none' }, 0.45)
          .fromTo(storyRef.current, { opacity: 0, y: '20%', scale: 0.95 }, { opacity: 1, y: '0%', scale: 1, ease: 'none' }, 0.5)
          .to(storyRef.current, { scale: 1.08, ease: 'none' }, 0.65);

        // 70-100%: breakout + portal
        tl.to(phoneRef.current, { y: '-5vh', rotation: 0, ease: 'none' }, 0.7)
          .to(storyRef.current, { scale: 1.25, x: '-10vw', y: '-5vh', ease: 'none' }, 0.7)
          .to(frameRef.current, { opacity: 0, scale: 1.08, ease: 'none' }, 0.8)
          .to(screenRef.current, { width: '100vw', height: '100vh', borderRadius: '0px', ease: 'none' }, 0.75)
          .to(storyRef.current, { scale: 1, x: 0, y: 0, ease: 'none' }, 0.85);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[280vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute top-[10vh] left-[8vw] z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          {t('social.front')}
        </div>

        {/* Phone */}
        <div
          ref={phoneRef}
          className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            ref={frameRef}
            className="relative h-[70vh] w-[calc(70vh*0.45)] rounded-[2.5rem] border border-white/10 bg-charcoal p-2 shadow-2xl"
          >
            {/* Island */}
            <div className="absolute top-3 left-1/2 z-20 h-3 w-20 -translate-x-1/2 rounded-full bg-black/80" />
            {/* Buttons */}
            <div className="absolute -right-1 top-20 h-10 w-1 rounded-r bg-charcoal" />
            <div className="absolute -left-1 top-20 h-6 w-1 rounded-l bg-charcoal" />
            <div className="absolute -left-1 top-32 h-12 w-1 rounded-l bg-charcoal" />

            {/* Screen */}
            <div
              ref={screenRef}
              className="relative h-full w-full overflow-hidden rounded-[2rem] bg-obsidian"
            >
              {/* Feed */}
              <div ref={feedRef} className="absolute top-0 left-0 w-full p-2">
                <div className="mb-2 w-full">
                  <MediaSlot slot={mediaSlots.phoneFeed1} />
                </div>
                <div className="mb-2 w-full">
                  <MediaSlot slot={mediaSlots.phoneFeed2} />
                </div>
                <div className="mb-2 w-full">
                  <MediaSlot slot={mediaSlots.phoneFeed1} />
                </div>
                <div className="mb-2 w-full">
                  <MediaSlot slot={mediaSlots.phoneFeed2} />
                </div>
              </div>

              {/* Focus */}
              <div
                ref={focusRef}
                className="absolute inset-0 z-10 flex items-center justify-center bg-obsidian/90 p-4 opacity-0"
              >
                <MediaSlot slot={mediaSlots.socialCampaign} className="h-full w-full" />
              </div>

              {/* Story / Reel */}
              <div
                ref={storyRef}
                className="absolute inset-0 z-20 flex items-center justify-center opacity-0"
              >
                <MediaSlot slot={mediaSlots.phoneStory} className="h-full w-full" />
              </div>
            </div>

            {/* Reflection */}
            <div
              ref={reflectionRef}
              className="pointer-events-none absolute inset-0 z-30 rounded-[2.5rem] bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
