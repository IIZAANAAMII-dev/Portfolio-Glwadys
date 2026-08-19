'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import { appStore } from '../lib/store';

const MEDIA = [
  { src: '/assets/editorial/portrait-glwadys.svg', x: '50%', y: '58%', w: '30vw', z: 10 },
  { src: '/assets/projects/yuna-story.svg', x: '20%', y: '22%', w: '18vw', z: 20 },
  { src: '/assets/projects/mgc-scrapbook.svg', x: '80%', y: '24%', w: '16vw', z: 20 },
  { src: '/assets/projects/comptoir-macro.svg', x: '22%', y: '74%', w: '14vw', z: 10 },
];

export function IntroSection() {
  const t = useTranslations('intro');
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const mediaRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setDone(true);
      appStore.setState({ isLoaded: true, currentChapter: 'hero' });
      if (sectionRef.current) sectionRef.current.style.display = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          gsap.to(sectionRef.current, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
            onComplete: () => {
              if (sectionRef.current) sectionRef.current.style.display = 'none';
              setDone(true);
              appStore.setState({ isLoaded: true, currentChapter: 'hero' });
            },
          });
        },
      });

      tl.fromTo(
        nameRef.current,
        { clipPath: 'inset(0 0 100% 0)', yPercent: 8 },
        { clipPath: 'inset(0 0 0% 0)', yPercent: 0, duration: 1.0, ease: 'expo.out' }
      );

      tl.fromTo(
        mediaRefs.current,
        { scale: 0.7, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
        },
        '-=0.5'
      );

      tl.to({}, { duration: 0.35 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <section
      id="intro-section"
      ref={sectionRef}
      className="fixed inset-0 z-[100] h-screen w-full flex flex-col items-center justify-center bg-[#0b0c0e] select-none"
      aria-hidden="true"
    >
      <div
        ref={nameRef}
        className="absolute z-[60] text-center font-editorial uppercase leading-[0.78] tracking-[-0.06em] text-[13vw] md:text-[9vw] text-foreground-light"
        style={{ top: '40%', transform: 'translateY(-50%)' }}
      >
        <span className="block">Glwadys</span>
        <span className="block pl-[4vw] text-accent-gold">Dalleau</span>
      </div>

      {MEDIA.map((m, i) => (
        <img
          key={m.src}
          ref={(el) => { mediaRefs.current[i] = el; }}
          src={m.src}
          alt=""
          className="absolute object-cover rounded-sm opacity-0"
          style={{
            left: m.x,
            top: m.y,
            width: m.w,
            maxWidth: '260px',
            transform: 'translate(-50%, -50%)',
            zIndex: m.z,
          }}
        />
      ))}

      <div className="absolute bottom-8 w-full px-8 flex justify-between font-mono-tag text-[10px] text-foreground-muted uppercase tracking-widest">
        <span>{t('location')}</span>
        <span>{t('roles')}</span>
      </div>
    </section>
  );
}
