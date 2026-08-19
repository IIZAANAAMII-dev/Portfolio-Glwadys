'use client';

import { useRef, useEffect, RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { BottomNavHandle } from '@/components/shell/BottomNav';

export function Act09Contact({ navRef }: { navRef: RefObject<BottomNavHandle | null> }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current || !navRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'top 20%',
      scrub: true,
      onUpdate: (self) => {
        navRef.current?.setCta(self.progress > 0.5);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [navRef]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.6,
          },
        });

        tl.fromTo(ctaRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0)
          .fromTo(linksRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.4);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full bg-obsidian py-[22vh] text-ivory"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-6 text-center">
        <div ref={ctaRef} className="space-y-4">
          <p className="font-sans text-[clamp(2rem,5vw,5rem)] font-light uppercase tracking-widest">
            {t('hero.name.first')} {t('hero.name.last')}
          </p>
          <p className="font-serif text-2xl text-ivory/70 md:text-3xl">
            {t('contact.cta')}
          </p>
        </div>

        <div
          ref={linksRef}
          className="flex flex-col items-center gap-4 font-mono text-sm uppercase tracking-widest"
        >
          <a
            href="mailto:glwadys.dalleau29@gmail.com"
            className="text-ivory/80 transition-colors hover:text-champagne"
          >
            glwadys.dalleau29@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/glwadysdalleau"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ivory/80 transition-colors hover:text-champagne"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <footer className="absolute bottom-8 left-0 w-full text-center font-mono text-[10px] uppercase tracking-wider text-ivory/30">
        © 2026 Glwadys Dalleau — Marseille
      </footer>
    </section>
  );
}
