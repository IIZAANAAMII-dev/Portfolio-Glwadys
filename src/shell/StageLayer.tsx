'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { onStageLive, stageState } from '@/lib/stage';
import { useReducedMotion } from '@/lib/useReducedMotion';

import styles from './StageLayer.module.css';

/**
 * Hôte local de la scène d'origine. Le contexte est gardé 1.4 s pour un retour
 * proche ; la visibilité, elle, s'éteint immédiatement à la sortie de l'acte.
 * Le DOM sous-jacent assure les raccords avant le décodage et sans WebGL.
 *
 * Sans WebGL, ou en mouvement réduit, la couche n'existe pas : toute
 * l'information reste portée par le DOM au-dessus.
 */

const StageCanvas = dynamic(() => import('./stage/StageCanvas.client'), { ssr: false });

class StageBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    const supported = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return supported;
  } catch {
    return false;
  }
}

export function StageLayer() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const unavailable = useRef(false);
  const ready = useRef(false);
  const handleReady = useCallback(() => {
    ready.current = true;
    layer.current?.setAttribute('data-stage-ready', 'true');
    if (stageState().live && layer.current?.parentElement) layer.current.parentElement.dataset.stageReady = 'true';
  }, []);
  const handleUnavailable = useCallback(() => {
    unavailable.current = true;
    ready.current = false;
    if (layer.current?.parentElement) delete layer.current.parentElement.dataset.stageReady;
    setMounted(false);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    if (reduced) return;
    let expiry: ReturnType<typeof setTimeout>;
    let supported: boolean | undefined;
    const sync = (requested: boolean) => {
      const next = requested && desktop.matches && !unavailable.current;
      clearTimeout(expiry);
      // Pas de retard React ni de fade CSS sur les prochains textes/CTA.
      layer.current?.toggleAttribute('data-stage-live', next);
      setLive(next);
      if (next) {
        supported ??= hasWebGL();
        if (ready.current && layer.current) {
          layer.current.dataset.stageReady = 'true';
          if (layer.current.parentElement) layer.current.parentElement.dataset.stageReady = 'true';
        }
        setMounted(supported);
      } else {
        if (layer.current?.parentElement) delete layer.current.parentElement.dataset.stageReady;
        if (!desktop.matches) {
          ready.current = false;
          setMounted(false);
        } else expiry = setTimeout(() => { ready.current = false; setMounted(false); }, 1400);
      }
    };
    const off = onStageLive(sync);
    const onResize = () => sync(stageState().live);
    desktop.addEventListener('change', onResize);
    return () => {
      clearTimeout(expiry);
      desktop.removeEventListener('change', onResize);
      off();
    };
  }, [reduced]);

  if (reduced || !mounted) return null;

  return (
    <div ref={layer} className={styles.layer} data-stage-layer data-stage-live={live || undefined} aria-hidden="true">
      <StageBoundary onUnavailable={handleUnavailable}>
        <StageCanvas onReady={handleReady} onUnavailable={handleUnavailable} />
      </StageBoundary>
    </div>
  );
}
