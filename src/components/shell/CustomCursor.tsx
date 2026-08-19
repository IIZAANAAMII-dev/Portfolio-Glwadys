'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;

    setVisible(true);
    window.addEventListener('mousemove', onMove);
    const ticker = () => {
      pos.current.cx += (pos.current.x - pos.current.cx) * 0.18;
      pos.current.cy += (pos.current.y - pos.current.cy) * 0.18;
      if (cursorRef.current) {
        gsap.set(cursorRef.current, { x: pos.current.cx, y: pos.current.cy });
      }
    };
    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/60 mix-blend-difference md:block"
      aria-hidden="true"
    />
  );
}
