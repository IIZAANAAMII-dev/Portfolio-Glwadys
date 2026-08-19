'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';

const expertiseKeys = [
  'expertise.social',
  'expertise.creation',
  'expertise.brand',
  'expertise.strategy',
  'expertise.community',
  'expertise.direction',
];

export function Act08Expertise() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const words = wordsRef.current?.children ? Array.from(wordsRef.current.children) : [];
        if (words.length === 0) return;

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

        words.forEach((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          const prev = i > 0 ? words[i - 1] : null;

          tl.fromTo(
            word,
            { y: '12vh', clipPath: 'inset(100% 0 0 0)', scale: 1.05, opacity: 0 },
            { y: 0, clipPath: 'inset(0% 0 0 0)', scale: 1, opacity: 1, ease: 'none' },
            start,
          );

          if (prev) {
            tl.to(prev, { y: '-12vh', clipPath: 'inset(0 0 100% 0)', opacity: 0, scale: 0.95, ease: 'none' }, start);
          }

          tl.to({}, { duration: (end - start) * 0.6 }, end);
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative h-[240vh] w-full bg-obsidian text-ivory"
    >
      <div
        ref={wrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute top-[10vh] left-[8vw] z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          Expertise
        </div>

        <div
          ref={wordsRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          {expertiseKeys.map((key, i) => (
            <div
              key={key}
              className="absolute text-center font-sans text-[clamp(2.5rem,9vw,9rem)] font-light uppercase tracking-widest text-ivory"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {t(key)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
