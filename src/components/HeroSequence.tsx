'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero intro animation
      gsap.fromTo(
        '.hero-name',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
      );
      gsap.fromTo(
        '.hero-portrait',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo(
        '.hero-headline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.6 }
      );
      gsap.fromTo(
        '.hero-meta',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.8 }
      );

      // Hero shrink on scroll
      const shrinkTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set(heroRef.current, { scale: 1 });
          },
        },
      });

      shrinkTl.fromTo(
        heroRef.current,
        { scale: 1, borderRadius: '0px' },
        { scale: 0.72, borderRadius: '0px', ease: 'none' }
      );

      shrinkTl.fromTo(
        '.hero-satellite',
        { opacity: 1, x: 0, y: 0 },
        { opacity: 0, x: '-20vw', y: '-15vh', ease: 'none' },
        0
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      id="hero"
    >
      <div
        ref={heroRef}
        className="hero relative w-full h-full overflow-hidden will-change-transform"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h2 className="hero-name font-sans text-[clamp(3rem,15vw,14rem)] leading-[0.85] tracking-[-0.03em] text-ivory uppercase font-medium">
            Glwadys
          </h2>
          <div className="hero-portrait relative w-[28vw] h-[38vh] my-4 bg-ivory/10 border border-ivory/20 overflow-hidden">
            <span className="absolute bottom-2 left-2 font-mono text-[9px] uppercase text-ivory/40">Portrait</span>
          </div>
          <h2 className="hero-name font-sans text-[clamp(3rem,15vw,14rem)] leading-[0.85] tracking-[-0.03em] text-ivory uppercase font-medium">
            Dalleau
          </h2>
        </div>

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
    </section>
  );
}
