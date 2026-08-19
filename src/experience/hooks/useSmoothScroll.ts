'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap, prefersReducedMotion } from '../lib/motion';

/**
 * The single smooth-scroll instance for the whole site.
 *
 * Exactly one Lenis, piped into gsap.ticker so GSAP and Lenis share one clock —
 * without this, ScrollTrigger reads a stale scroll position and pinned sections
 * visibly lag. No Locomotive, no ScrollSmoother: a second smooth-scroll engine
 * would fight this one.
 *
 * Under prefers-reduced-motion Lenis is never constructed, leaving native
 * scrolling intact.
 */
export function useSmoothScroll() {
  useEffect(() => {
    registerGsap();

    if (prefersReducedMotion()) {
      // Native scroll only. ScrollTrigger still works; it just isn't smoothed.
      return;
    }

    const lenis = new Lenis({
      // Responsive rather than syrupy — the brief asks for snappy, not honey.
      lerp: 0.08,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      orientation: 'vertical',
      smoothWheel: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);
}
