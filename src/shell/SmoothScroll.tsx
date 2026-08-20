'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

import { gsap, ScrollTrigger } from '@/lib/gsap';
import { registerLenis } from '@/lib/scrollControl';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Smooth scroll + pont GSAP.
 *
 * Sensation visée : rapide et premium. L'utilisateur reste maître.
 * `lerp 0.09` / `duration 0.9` — au-delà de 1.5s / 0.15 de lerp, la page donne
 * la sensation d'être « dans du miel », ce qui est pénalisé.
 *
 * Le câblage `lenis.on('scroll', ScrollTrigger.update)` + ticker GSAP est
 * obligatoire : sans lui, ScrollTrigger et Lenis se désynchronisent et tous les
 * pins dérivent.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Reduced motion : scroll natif, aucun Lenis monté.
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    registerLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    // Une seule horloge pour Lenis et GSAP.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Les pins mesurent le layout : il doit être stabilisé (polices comprises).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      registerLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
