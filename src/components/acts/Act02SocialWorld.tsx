'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { MediaSlot } from '@/components/ui/MediaSlot';
import { mediaSlots } from '@/lib/media';

const behindWords = ['PLANNING', 'COPY', 'CALENDAR', 'MOODBOARD', 'STRATEGY'];

export function Act02SocialWorld() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const campaignRef = useRef<HTMLDivElement>(null);
  const behindRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%',
            pin: wrapperRef.current,
            scrub: 0.6,
            pinSpacing: true,
          },
        });

        // 0-30%: satellites enter FRONT
        tl.fromTo(postRef.current, { x: '-60vw', y: '30vh', rotation: -8, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'none' }, 0)
          .fromTo(reelRef.current, { x: '60vw', y: '-20vh', rotation: 8, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'none' }, 0)
          .fromTo(campaignRef.current, { x: '40vw', y: '40vh', rotation: 4, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'none' }, 0)
          .fromTo(behindRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);

        // 30-60%: FRONT splits, BEHIND revealed
        tl.to([postRef.current, reelRef.current, campaignRef.current], { x: (i) => (i === 0 ? '-45vw' : i === 1 ? '45vw' : '35vw'), y: (i) => (i === 0 ? '-25vh' : i === 1 ? '25vh' : '-40vh'), opacity: 0.35, ease: 'none' }, 0.3)
          .to(behindRef.current, { opacity: 1, scale: 1.05, ease: 'none' }, 0.3)
          .to(mainRef.current, { scale: 1.08, rotation: 1, ease: 'none' }, 0.3);

        // 60-100%: clean, only main vertical remains
        tl.to([postRef.current, reelRef.current, campaignRef.current], { opacity: 0, ease: 'none' }, 0.6)
          .to(behindRef.current, { opacity: 0, scale: 1.15, ease: 'none' }, 0.6)
          .to(mainRef.current, { x: 0, y: 0, scale: 1, rotation: 0, ease: 'none' }, 0.6)
          .to({}, { duration: 0.2 }, '+=0.2');
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[260vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden perspective-[1200px]"
      >
        <div className="absolute top-[10vh] left-[8vw] z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          {t('social.front')}
        </div>

        {/* BEHIND layer */}
        <div
          ref={behindRef}
          className="absolute inset-0 z-0 flex items-center justify-center gap-16"
          style={{ transform: 'translateZ(-120px)' }}
        >
          {behindWords.map((word, i) => (
            <div
              key={word}
              className="font-sans text-[clamp(2rem,6vw,6rem)] font-light uppercase tracking-widest text-ivory/[0.08]"
              style={{ transform: `translateZ(${(i - 2) * 30}px)` }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Satellites */}
        <div
          ref={postRef}
          className="absolute left-[18vw] top-[16vh] z-20 w-[18vw] min-w-[180px]"
        >
          <MediaSlot slot={mediaSlots.socialPost1} />
        </div>
        <div
          ref={reelRef}
          className="absolute right-[14vw] top-[10vh] z-20 w-[14vw] min-w-[140px]"
        >
          <MediaSlot slot={mediaSlots.socialReel1} />
        </div>
        <div
          ref={campaignRef}
          className="absolute right-[12vw] bottom-[14vh] z-20 w-[28vw] min-w-[260px]"
        >
          <MediaSlot slot={mediaSlots.socialCampaign} />
        </div>

        {/* Main media */}
        <div
          ref={mainRef}
          className="absolute top-1/2 left-1/2 z-10 w-[22vw] min-w-[220px] -translate-x-1/2 -translate-y-1/2"
        >
          <MediaSlot slot={mediaSlots.socialMain} />
        </div>

        <div className="absolute bottom-[8vh] right-[8vw] z-30 max-w-[18vw] text-right font-serif text-sm leading-relaxed text-ivory/50">
          {t('hero.headline')}
        </div>
      </div>
    </section>
  );
}
