'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ActStoryPhone() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.6,
        },
      });

      // Media gather from hero
      tl.fromTo('.story-media', { x: 0, y: 0, opacity: 0, scale: 0.5 }, { duration: 0.12, ease: 'none' });

      // Portrait becomes 9:16 story
      tl.fromTo(
        '.story-portrait',
        { scale: 0.5, borderRadius: '0px' },
        { scale: 1, borderRadius: '0px', duration: 0.2, ease: 'none' },
        0
      );

      // Other medias leave
      tl.to(
        '.story-media-1',
        { x: '-60vw', opacity: 0, duration: 0.15, ease: 'none' },
        0
      );
      tl.to(
        '.story-media-2',
        { x: '60vw', opacity: 0, duration: 0.15, ease: 'none' },
        0
      );

      // Phone frame builds around
      tl.fromTo(
        phoneRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.2, ease: 'none' },
        0.25
      );

      // Feed scroll inside
      tl.fromTo(
        '.phone-feed',
        { y: '100%' },
        { y: '0%', duration: 0.15, ease: 'none' },
        0.45
      );

      // Post focus
      tl.fromTo(
        '.phone-post',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.1, ease: 'none' },
        0.55
      );

      // Story / Reel vertical
      tl.fromTo(
        '.phone-reel',
        { y: '100%' },
        { y: '0%', duration: 0.1, ease: 'none' },
        0.65
      );

      // Campaign leaves phone
      tl.fromTo(
        screenRef.current,
        { scale: 1 },
        { scale: 1.25, duration: 0.15, ease: 'none' },
        0.85
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-obsidian"
    >
      <div className="story-media-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18vw] h-[24vh] bg-espresso border border-ivory/10 z-10" />
      <div className="story-media-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[16vw] h-[28vh] bg-espresso border border-ivory/10 z-10" />

      <div
        ref={phoneRef}
        className="relative z-20 opacity-0 will-change-transform"
        style={{
          width: '20vw',
          minWidth: '320px',
          aspectRatio: '9/19.5',
          borderRadius: '38px',
          background: '#0B0B0B',
          border: '10px solid #23272D',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="absolute -top-[3px] left-1/2 -translate-x-1/2 h-[24px] w-[120px] bg-obsidian rounded-b-xl z-30"
        />
        <div
          ref={screenRef}
          className="relative w-full h-full rounded-[28px] overflow-hidden will-change-transform"
        >
          <div className="story-portrait absolute inset-0 bg-ivory/10 flex items-center justify-center">
            <span className="font-mono text-[9px] uppercase text-ivory/40">Story / Portrait</span>
          </div>
          <div className="phone-feed absolute inset-0 bg-obsidian/90 p-4 flex flex-col gap-3">
            <div className="h-[30%] bg-espresso rounded" />
            <div className="h-[30%] bg-espresso rounded" />
            <div className="h-[30%] bg-espresso rounded" />
          </div>
          <div className="phone-post absolute inset-0 bg-espresso flex items-center justify-center opacity-0">
            <span className="font-mono text-[9px] uppercase text-ivory/40">Post</span>
          </div>
          <div className="phone-reel absolute inset-0 bg-ivory/10 flex items-center justify-center" style={{ transform: 'translateY(100%)' }}>
            <span className="font-mono text-[9px] uppercase text-ivory/40">Reel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
