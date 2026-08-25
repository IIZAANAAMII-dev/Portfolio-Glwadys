'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

/**
 * Enveloppe de montage du canvas de l'ACT 04.
 *
 * Three.js et R3F ne doivent pas peser sur le bundle initial : le module n'est
 * chargé que lorsque l'acte approche, et jamais du tout si le visiteur a demandé
 * moins d'animation ou si le navigateur n'expose pas WebGL — dans ces deux cas
 * la composition DOM de repli suffit, le contenu n'en dépend pas.
 */

const Gallery3D = dynamic(() => import('./Gallery3D').then((m) => m.Gallery3D), {
  ssr: false,
});

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

interface Props {
  className?: string;
  reduced: boolean;
  active: boolean;
  progress: React.MutableRefObject<number>;
  burst: React.MutableRefObject<number>;
  requestRenderRef: React.MutableRefObject<(() => void) | null>;
}

export function ImmersionCanvas({
  className,
  reduced,
  active,
  progress,
  burst,
  requestRenderRef,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || reduced || !active || !hasWebGL()) {
      requestRenderRef.current = null;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        // Once decoded, keep the demand-loop canvas alive for reverse scroll.
        // It renders no frames offscreen and avoids a WebGL context teardown /
        // texture re-upload cycle when the visitor revisits the raccord.
        if (entries.some((entry) => entry.isIntersecting)) setMounted(true);
      },
      // Une hauteur de viewport d'avance : les textures sont décodées avant
      // l'entrée, sinon le raccord depuis le portail montre des plans vides.
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      requestRenderRef.current = null;
    };
  }, [active, reduced, requestRenderRef]);

  return (
    <div ref={host} className={className} data-immersion-canvas aria-hidden="true">
      {active && mounted && (
        <Gallery3D progress={progress} burst={burst} requestRenderRef={requestRenderRef} />
      )}
    </div>
  );
}
