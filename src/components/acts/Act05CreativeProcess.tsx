'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { mediaSlots } from '@/lib/media';
import { cn } from '@/lib/utils';

const strategyWords = [
  'strategy.audience',
  'strategy.positioning',
  'strategy.tone',
  'strategy.content',
  'strategy.planning',
  'strategy.campaign',
];

const contactSlots = [
  mediaSlots.yuna1,
  mediaSlots.mgc1,
  mediaSlots.comptoir1,
  mediaSlots.webglMid,
  mediaSlots.webglBack,
  mediaSlots.webglForeground,
];

export function Act05CreativeProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const strategyRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const track = trackRef.current;
        if (!track) return;

        const trackWidth = track.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=300%',
            pin: wrapperRef.current,
            scrub: 0.6,
            pinSpacing: true,
          },
        });

        // 0-25%: contact sheet horizontal
        tl.fromTo(track, { x: 0 }, { x: -trackWidth, ease: 'none' }, 0)
          .fromTo(moodRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.24)
          .to(track, { opacity: 0, scale: 0.95, ease: 'none' }, 0.3)
          .fromTo(
            moodRef.current?.children ? Array.from(moodRef.current.children) : [],
            { x: 0, y: 0, rotation: 0, scale: 1 },
            {
              x: (i) => (i % 2 === 0 ? -10 + i * 5 : 15 - i * 4),
              y: (i) => (i % 2 === 0 ? -8 : 10),
              rotation: (i) => (i % 2 === 0 ? -4 : 4),
              scale: 1.05,
              ease: 'none',
              stagger: 0,
            },
            0.3,
          )
          // 50%: moodboard → brand order
          .to(moodRef.current, { opacity: 0, ease: 'none' }, 0.5)
          .fromTo(brandRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.5)
          .to(
            brandRef.current?.children ? Array.from(brandRef.current.children) : [],
            { x: 0, y: 0, rotation: 0, scale: 1, ease: 'none' },
            0.55,
          )
          // 75%: brand → strategy
          .to(brandRef.current, { opacity: 0, ease: 'none' }, 0.72)
          .fromTo(strategyRef.current, { opacity: 0, x: '10vw' }, { opacity: 1, x: 0, ease: 'none' }, 0.75);

        const words = strategyRef.current?.children ? Array.from(strategyRef.current.children) : [];
        const wordsWidth = (strategyRef.current?.scrollWidth || 0) - window.innerWidth;
        tl.fromTo(strategyRef.current, { x: 0 }, { x: -wordsWidth, ease: 'none' }, 0.78);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative h-[340vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute top-[10vh] left-[8vw] z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          Creative Process
        </div>

        {/* Contact Sheet */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 flex h-screen items-center gap-4 px-[8vw] will-change-transform"
        >
          {contactSlots.map((slot, i) => (
            <div
              key={slot.id + i}
              className={cn(
                'flex-shrink-0',
                i % 2 === 0 ? 'w-[22vw]' : 'w-[16vw]',
              )}
            >
              <MediaSlot slot={slot} />
            </div>
          ))}
        </div>

        {/* Moodboard */}
        <div
          ref={moodRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-6 opacity-0"
        >
          {contactSlots.slice(0, 4).map((slot, i) => (
            <div
              key={`mood-${slot.id}-${i}`}
              className={cn('w-[18vw]', i % 2 === 0 ? '-mt-12' : 'mt-12')}
            >
              <MediaSlot slot={slot} />
            </div>
          ))}
        </div>

        {/* Brand System */}
        <div
          ref={brandRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0"
        >
          {contactSlots.slice(0, 4).map((slot, i) => (
            <div
              key={`brand-${slot.id}-${i}`}
              className="w-[18vw]"
              style={{ transform: `translateZ(${-i * 20}px)` }}
            >
              <MediaSlot slot={slot} />
            </div>
          ))}
        </div>

        {/* Strategy */}
        <div
          ref={strategyRef}
          className="pointer-events-none absolute top-1/2 left-0 z-20 flex items-center gap-[12vw] whitespace-nowrap px-[8vw] opacity-0"
          style={{ transform: 'translateY(-50%)' }}
        >
          {strategyWords.map((word) => (
            <span
              key={word}
              className="font-sans text-[clamp(3rem,12vw,12rem)] font-light uppercase tracking-widest text-ivory"
            >
              {t(word)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
