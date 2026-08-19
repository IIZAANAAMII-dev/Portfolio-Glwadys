'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Grain() {
  const grainRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(grainRef.current, {
        opacity: 0.12,
        filter: 'grayscale(1)',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=100%',
          scrub: true,
        },
      });
    },
    { scope: grainRef }
  );

  return (
    <div
      ref={grainRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        opacity: 0.04,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    />
  );
}
