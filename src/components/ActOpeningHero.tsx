'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const planes = [
  { id: 'portrait', x: '0vw', y: '0vh', z: 0, w: '26vw', h: '34vh', fromScale: 0.3, toScale: 1, label: 'Portrait' },
  { id: 'media1', x: '-30vw', y: '-20vh', z: 120, w: '18vw', h: '22vh', fromScale: 0.2, toScale: 0.9, label: 'Media 01' },
  { id: 'media2', x: '28vw', y: '-18vh', z: -100, w: '16vw', h: '28vh', fromScale: 0.2, toScale: 1.1, label: 'Media 02' },
  { id: 'media3', x: '-18vw', y: '22vh', z: 80, w: '14vw', h: '18vh', fromScale: 0.2, toScale: 0.85, label: 'Media 03' },
  { id: 'media4', x: '22vw', y: '20vh', z: -150, w: '20vw', h: '24vh', fromScale: 0.2, toScale: 1.2, label: 'Media 04' },
];

export default function ActOpeningHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      let mouseCleanup: (() => void) | undefined;
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      if (!isTouch) {
        const onMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(stage, {
            rotateY: x * 4,
            rotateX: -y * 3,
            duration: 0.8,
            ease: 'power2.out',
          });
        };
        window.addEventListener('mousemove', onMove);
        mouseCleanup = () => window.removeEventListener('mousemove', onMove);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 0.5,
        },
      });

      // Name appears
      tl.fromTo('.opening-name', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08, ease: 'none' }, 0);

      // Media explodes from center
      planes.forEach((p, i) => {
        tl.fromTo(
          `.plane-${p.id}`,
          { x: 0, y: 0, z: 0, scale: p.fromScale, opacity: 0 },
          { x: p.x, y: p.y, z: p.z, scale: p.toScale, opacity: 1, duration: 0.2, ease: 'none' },
          0.04 + i * 0.02
        );
      });

      // Hero info
      tl.fromTo('.hero-name', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12, ease: 'none' }, 0.34);
      tl.fromTo('.hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1, ease: 'none' }, 0.4);
      tl.fromTo('.hero-meta', { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none' }, 0.46);
      tl.fromTo('.bottom-nav', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: 'none' }, 0.5);

      // Shrink
      tl.to(stage, { scale: 0.78, duration: 0.25, ease: 'none' }, 0.6);

      return () => {
        mouseCleanup?.();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={stageRef}
        className="relative w-full h-full will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="opening-name absolute left-1/2 -translate-x-1/2 top-[10vh] text-center font-sans text-[clamp(1.5rem,3vw,3rem)] tracking-[0.35em] uppercase font-medium text-ivory opacity-0">
          Glwadys Dalleau
        </div>

        {planes.map((p) => (
          <div
            key={p.id}
            className={`plane plane-${p.id} absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-espresso border border-ivory/10 overflow-hidden opacity-0`}
            style={{
              width: p.w,
              height: p.h,
              transformStyle: 'preserve-3d',
            }}
          >
            <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase text-ivory/40">{p.label}</span>
          </div>
        ))}

        <h2 className="hero-name absolute left-1/2 -translate-x-1/2 top-[76vh] font-sans text-[clamp(2.5rem,10vw,10rem)] leading-[0.85] tracking-[-0.03em] text-ivory uppercase font-medium opacity-0">
          Dalleau
        </h2>

        <div className="hero-headline absolute left-[8vw] bottom-[18vh] max-w-[28vw] opacity-0">
          <p className="font-serif italic text-[clamp(1rem,1.8vw,1.5rem)] leading-snug text-ivory/90">
            Je transforme les marques en histoires dont on se souvient.
          </p>
        </div>

        <div className="hero-meta absolute right-[8vw] bottom-[18vh] text-right font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/60 leading-relaxed opacity-0">
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
