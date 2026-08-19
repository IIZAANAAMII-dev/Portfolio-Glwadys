'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { cn } from '@/lib/utils';

export function Act01Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const media1Ref = useRef<HTMLDivElement>(null);
  const media2Ref = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=120%',
            pin: wrapperRef.current,
            scrub: 0.6,
            pinSpacing: true,
          },
        });

        tl.fromTo(wrapperRef.current, { scale: 1 }, { scale: 0.72, ease: 'none' }, 0)
          .fromTo(nameRef.current, { y: '-10vh', scale: 3.2 }, { y: '-18vh', scale: 0.85, ease: 'none' }, 0)
          .fromTo(media1Ref.current, { x: '-18vw', y: '-8vh', rotation: -6, scale: 1.1, opacity: 1 }, { x: '-42vw', y: '-30vh', rotation: -12, opacity: 0.4, ease: 'none' }, 0)
          .fromTo(media2Ref.current, { x: '18vw', y: '10vh', rotation: 6, scale: 1.1, opacity: 1 }, { x: '42vw', y: '30vh', rotation: 12, opacity: 0.4, ease: 'none' }, 0)
          .fromTo(metaRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.4);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[220vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className={cn(
          'relative h-screen w-full overflow-hidden',
          'flex items-center justify-center',
        )}
      >
        <div
          ref={nameRef}
          className="text-center font-sans text-[clamp(2.5rem,6vw,6rem)] font-light uppercase tracking-[0.22em] text-ivory"
        >
          Glwadys Dalleau
        </div>

        <div
          ref={media1Ref}
          className="absolute left-[12vw] top-[32vh] h-[26vh] w-[18vw] bg-espresso"
          aria-label="Editorial fragment"
        />
        <div
          ref={media2Ref}
          className="absolute right-[12vw] bottom-[24vh] h-[22vh] w-[20vw] bg-charcoal"
          aria-label="Editorial fragment"
        />

        <div
          ref={metaRef}
          className="absolute bottom-[8vh] left-[8vw] font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60"
        >
          <div>{t('hero.meta.social')}</div>
          <div>{t('hero.meta.content')}</div>
          <div>{t('hero.meta.brand')}</div>
          <div className="mt-4 text-ivory/40">{t('hero.location')}</div>
        </div>

        <p className="absolute right-[8vw] bottom-[8vh] max-w-[18vw] text-right font-serif text-sm leading-relaxed text-ivory/70">
          {t('hero.headline')}
        </p>
      </div>
    </section>
  );
}
