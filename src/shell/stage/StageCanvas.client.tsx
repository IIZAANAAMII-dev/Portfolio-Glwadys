'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

import { StageScene } from './StageScene';
import { sourcesForTier } from './film';

/**
 * Le Canvas maître. Un seul, pour toute l'expérience.
 *
 * `frameloop="demand"` : aucune frame n'est produite quand le scroll est
 * immobile. Les actes appellent `requestStageRender()` via `setStage()`.
 * Le DPR est plafonné selon la puissance déclarée de l'appareil : au-delà de
 * 1.75 la différence n'est pas perceptible sur des photographies, alors que le
 * coût de remplissage double.
 */
export default function StageCanvas() {
  const dpr = useMemo<[number, number] | number>(() => {
    if (typeof window === 'undefined') return 1;
    const cores = navigator.hardwareConcurrency ?? 4;
    const small = window.matchMedia('(max-width: 1023px)').matches;
    if (small || cores <= 4) return 1;
    return [1, 1.75];
  }, []);

  const antialias = typeof window !== 'undefined' && (navigator.hardwareConcurrency ?? 4) > 4;

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;
    // Précharge l'écran (tier 0) et la galerie/processus (tier 1) pour éviter
    // les cases vides au passage du téléphone à la scène 3D.
    [0, 1].forEach((tier) =>
      sourcesForTier(tier as 0 | 1, isMobile).forEach((src) => {
        const img = new window.Image();
        img.fetchPriority = 'high';
        img.src = src;
      }),
    );
  }, []);

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={dpr}
      camera={{ position: [0, 0, 0], fov: 52, near: 0.4, far: 400 }}
      gl={{ antialias, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <StageScene />
    </Canvas>
  );
}
