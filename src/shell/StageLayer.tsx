'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { onStageLive } from '@/lib/stage';
import { useReducedMotion } from '@/lib/useReducedMotion';

import styles from './StageLayer.module.css';

/**
 * Hôte du Canvas persistant.
 *
 * Three.js reste hors du bundle initial : le module n'est demandé qu'au moment
 * où un acte revendique la scène pour la première fois (`onStageLive`). Une
 * fois monté, il ne se démonte plus — reconstruire un contexte WebGL au retour
 * du visiteur produirait exactement la rupture que cette refonte supprime.
 *
 * Sans WebGL, ou en mouvement réduit, la couche n'existe pas : toute
 * l'information reste portée par le DOM au-dessus.
 */

const StageCanvas = dynamic(() => import('./stage/StageCanvas.client'), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

export function StageLayer() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const off = onStageLive((next) => {
      setLive(next);
      if (next) setMounted(true);
    });
    return () => {
      off();
    };
  }, [reduced]);

  useEffect(() => {
    if (!mounted || reduced) return;
    if (!hasWebGL()) setMounted(false);
  }, [mounted, reduced]);

  if (reduced || !mounted) return null;

  return (
    <div className={styles.layer} data-stage-live={live || undefined} aria-hidden="true">
      <StageCanvas />
    </div>
  );
}
