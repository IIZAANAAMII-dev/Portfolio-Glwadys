'use client';

import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { StageScene } from './StageScene';

/**
 * Le Canvas du raccord téléphone → immersion, borné par le premier acte.
 *
 * `frameloop="demand"` : aucune frame n'est produite quand le scroll est
 * immobile. Les actes appellent `requestStageRender()` via `setStage()`.
 * Le DPR est plafonné selon la puissance déclarée de l'appareil : au-delà de
 * 1.75 la différence n'est pas perceptible sur des photographies, alors que le
 * coût de remplissage double.
 */
export default function StageCanvas({ onReady, onUnavailable }: { onReady: () => void; onUnavailable: () => void }) {
  const surface = useRef<HTMLCanvasElement | null>(null);
  const onLost = useCallback((event: Event) => {
    event.preventDefault();
    onUnavailable();
  }, [onUnavailable]);
  useEffect(() => () => {
    // Le renderer perd volontairement son contexte lors du démontage. Cette
    // libération normale ne doit pas interdire le prochain retour dans l'acte.
    surface.current?.removeEventListener('webglcontextlost', onLost);
  }, [onLost]);
  const dpr = useMemo<[number, number] | number>(() => {
    if (typeof window === 'undefined') return 1;
    const cores = navigator.hardwareConcurrency ?? 4;
    const small = window.matchMedia('(max-width: 1023px)').matches;
    if (small || cores <= 4) return 1;
    return [1, 1.75];
  }, []);

  const antialias = typeof window !== 'undefined' && (navigator.hardwareConcurrency ?? 4) > 4;

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={dpr}
      camera={{ position: [0, 0, 0], rotation: [0, 0, 0], fov: 52, near: 0.4, far: 400 }}
      gl={{ antialias, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
        surface.current = gl.domElement;
        gl.domElement.addEventListener('webglcontextlost', onLost, { once: true });
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <StageScene onReady={onReady} />
    </Canvas>
  );
}
