'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ActOpeningHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.5,
        },
      });

      // Phase 1: media enter
      tl.fromTo('.opening-media-left', { x: '-30vw', opacity: 0 }, { x: 0, opacity: 1, duration: 0.12, ease: 'none' }, 0);
      tl.fromTo('.opening-media-right', { x: '30vw', opacity: 0 }, { x: 0, opacity: 1, duration: 0.12, ease: 'none' }, 0.02);
      tl.fromTo('.opening-portrait', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: 'none' }, 0.04);

      // Phase 2: opening fades, hero appears and builds
      tl.to('.opening-name', { opacity: 0, y: -20, duration: 0.08, ease: 'none' }, 0.16);
      tl.to('.opening-meta', { opacity: 0, duration: 0.08, ease: 'none' }, 0.16);

      tl.fromTo('.hero-name', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.18, stagger: 0.04, ease: 'none' }, 0.22);
      tl.fromTo('.hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12, ease: 'none' }, 0.34);
      tl.fromTo('.hero-meta', { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none' }, 0.4);
      tl.fromTo('.bottom-nav', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: 'none' }, 0.42);

      // Phase 3: hero shrink
      tl.to(stageRef.current, { scale: 0.72, duration: 0.3, ease: 'none' }, 0.55);
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <div ref={stageRef} className="relative w-full h-full will-change-transform">
        {/* Opening */}
        <div className="opening-meta absolute top-8 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60">
          Portfolio 2026
        </div>
        <div className="opening-meta absolute top-8 right-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/60 text-right">
          Marseille
        </div>

        <div className="opening-name absolute left-1/2 -translate-x-1/2 top-[10vh] text-center font-sans text-[clamp(1.25rem,2.5vw,2.5rem)] tracking-[0.3em] uppercase font-medium text-ivory">
          Glwadys Dalleau
        </div>

        <div className="opening-media-left absolute left-[8vw] top-[22vh] w-[18vw] h-[24vh] bg-espresso border border-ivory/10">
          <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase text-ivory/40">Media 01</span>
        </div>
        <div className="opening-media-right absolute right-[8vw] top-[18vh] w-[16vw] h-[28vh] bg-espresso border border-ivory/10">
          <span className="absolute bottom-2 right-2 font-mono text-[9px] uppercase text-ivory/40">Media 02</span>
        </div>
        <div className="opening-portrait absolute left-1/2 -translate-x-1/2 top-[30vh] w-[26vw] h-[38vh] bg-ivory/10 border border-ivory/20">
          <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase text-ivory/40">Portrait</span>
        </div>

        {/* Hero */}
        <h2 className="hero-name absolute left-1/2 -translate-x-1/2 top-[8vh] font-sans text-[clamp(3rem,15vw,14rem)] leading-[0.85] tracking-[-0.03em] text-ivory uppercase font-medium">
          Glwadys
        </h2>
        <div className="hero-portrait relative w-[28vw] h-[38vh] left-1/2 -translate-x-1/2 top-[32vh] bg-ivory/10 border border-ivory/20 overflow-hidden opacity-0" />
        <h2 className="hero-name absolute left-1/2 -translate-x-1/2 top-[62vh] font-sans text-[clamp(3rem,15vw,14rem)] leading-[0.85] tracking-[-0.03em] text-ivory uppercase font-medium">
          Dalleau
        </h2>

        <div className="hero-headline absolute left-[8vw] bottom-[18vh] max-w-[28vw]">
          <p className="font-serif italic text-[clamp(1rem,1.8vw,1.5rem)] leading-snug text-ivory/90">
            Je transforme les marques en histoires dont on se souvient.
          </p>
        </div>

        <div className="hero-meta absolute right-[8vw] bottom-[18vh] text-right font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/60 leading-relaxed">
          <p>Social Media / Content / Brand</p>
          <p>Marseille — FR</p>
        </div>
      </div>

      <nav className="bottom-nav fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] opacity-0">
        <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-ivory/10 bg-obsidian/80 backdrop-blur-md">
          <a href="#hero" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory hover:text-champagne transition-colors">GD</a>
          <a href="#work" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">Work</a>
          <a href="#journey" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">Journey</a>
          <a href="#expertise" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">Expertise</a>
          <a href="#contact" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">Contact</a>
          <div className="flex gap-2 ml-2 pl-4 border-l border-ivory/10">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-champagne">FR</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/40">EN</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/40">KO</span>
          </div>
        </div>
      </nav>
    </section>
  );
}
