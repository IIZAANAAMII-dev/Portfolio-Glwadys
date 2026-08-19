'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { cn } from '@/lib/utils';

export function Act00Opening({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const media1Ref = useRef<HTMLDivElement>(null);
  const media2Ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        },
      });

      gsap.set([lineRef.current, nameRef.current, metaRef.current, media1Ref.current, media2Ref.current], {
        opacity: 0,
      });

      tl.fromTo(lineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.2)
        .fromTo(nameRef.current, { y: 24, clipPath: 'inset(100% 0 0 0)' }, { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power4.out' }, 0.4)
        .fromTo(metaRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.7)
        .fromTo(media1Ref.current, { x: '-60vw', opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0.9)
        .fromTo(media2Ref.current, { x: '60vw', opacity: 0, scale: 0.9 }, { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0.9)
        .to(nameRef.current, { scale: 3.2, y: '-10vh', duration: 1.4, ease: 'power4.inOut' }, 1.4)
        .to(media1Ref.current, { x: '-18vw', y: '-8vh', rotation: -6, scale: 1.1, duration: 1.2, ease: 'power3.inOut' }, 1.6)
        .to(media2Ref.current, { x: '18vw', y: '10vh', rotation: 6, scale: 1.1, duration: 1.2, ease: 'power3.inOut' }, 1.6)
        .to({}, { duration: 0.45 }, '+=0.3');
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, t]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center',
        'bg-obsidian text-ivory',
      )}
      aria-hidden="true"
    >
      <div ref={lineRef} className="absolute top-1/2 left-[10vw] h-px w-[80vw] origin-left bg-champagne/30" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={nameRef}
          className="text-center font-sans text-[clamp(2.5rem,6vw,6rem)] font-light uppercase tracking-[0.22em] text-ivory"
        >
          Glwadys Dalleau
        </div>
      </div>

      <div ref={metaRef} className="absolute top-[18vh] left-[8vw] font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
        <div>{t('opening.portfolio')}</div>
        <div className="mt-1">{t('opening.marseille')}</div>
      </div>

      <div ref={media1Ref} className="absolute left-[12vw] top-[32vh] h-[26vh] w-[18vw] bg-espresso" />
      <div ref={media2Ref} className="absolute right-[12vw] bottom-[24vh] h-[22vh] w-[20vw] bg-charcoal" />
    </div>
  );
}
