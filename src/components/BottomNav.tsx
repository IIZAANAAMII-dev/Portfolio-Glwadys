'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function BottomNav() {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.6 }
      );
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] opacity-0"
    >
      <div className="flex items-center gap-6 px-6 py-3 rounded-full border border-ivory/10 bg-obsidian/80 backdrop-blur-md">
        <a href="#hero" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory hover:text-champagne transition-colors">
          GD
        </a>
        <a href="#work" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">
          Work
        </a>
        <a href="#journey" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">
          Journey
        </a>
        <a href="#expertise" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">
          Expertise
        </a>
        <a href="#contact" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/70 hover:text-champagne transition-colors">
          Contact
        </a>
        <div className="flex gap-2 ml-2 pl-4 border-l border-ivory/10">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-champagne">FR</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/40">EN</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ivory/40">KO</span>
        </div>
      </div>
    </nav>
  );
}
