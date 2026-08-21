'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/motion';
import { SHELL_EVENTS } from '@/lib/scrollControl';

import styles from './CustomCursor.module.css';

type CursorMode = 'default' | 'view' | 'drag' | 'enter' | 'open';

const MODES = new Set<CursorMode>(['default', 'view', 'drag', 'enter', 'open']);

function modeFor(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) return 'default';

  const interactive = target.closest<HTMLElement>('[data-cursor], a[href], button, [role="button"]');
  if (!interactive) return 'default';

  const explicit = interactive.dataset.cursor as CursorMode | undefined;
  if (explicit && MODES.has(explicit)) return explicit;

  if (interactive instanceof HTMLAnchorElement) {
    const href = interactive.getAttribute('href') ?? '';
    const external = href.startsWith('mailto:') || href.startsWith('tel:') || interactive.target === '_blank';
    return external ? 'open' : 'enter';
  }

  return 'enter';
}

/**
 * Curseur éditorial : un point précis et un viseur carré contextuel.
 * Il n'existe que sur pointeur fin, après l'Opening, et reste entièrement
 * décoratif pour les technologies d'assistance.
 */
export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const ringEl = ring.current;
      const dotEl = dot.current;
      if (!rootEl || !ringEl || !dotEl) return;

      const html = document.documentElement;
      const finePointer = window.matchMedia(MQ.finePointer);
      const reducedMotion = window.matchMedia(MQ.reduced);
      let enabled = false;
      let currentMode: CursorMode = 'default';

      gsap.set([ringEl, dotEl], { xPercent: -50, yPercent: -50 });
      const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.18, ease: 'power3.out' });
      const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.18, ease: 'power3.out' });
      const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'power2.out' });
      const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'power2.out' });

      const hide = () => {
        rootEl.dataset.visible = 'false';
        rootEl.dataset.pressed = 'false';
      };

      const syncAvailability = () => {
        enabled =
          finePointer.matches &&
          !reducedMotion.matches &&
          html.dataset.shellReady === 'true';

        if (enabled) html.dataset.customCursor = 'true';
        else {
          delete html.dataset.customCursor;
          hide();
        }
      };

      const updateMode = (target: EventTarget | null) => {
        const nextMode = modeFor(target);
        if (nextMode === currentMode) return;
        currentMode = nextMode;
        rootEl.dataset.mode = nextMode;
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!enabled || event.pointerType === 'touch') return;
        ringX(event.clientX);
        ringY(event.clientY);
        dotX(event.clientX);
        dotY(event.clientY);
        updateMode(event.target);
        rootEl.dataset.visible = 'true';
      };

      const onPointerDown = (event: PointerEvent) => {
        if (!enabled || event.pointerType === 'touch') return;
        rootEl.dataset.pressed = 'true';
      };

      const onPointerUp = () => {
        rootEl.dataset.pressed = 'false';
      };

      const onPointerOut = (event: PointerEvent) => {
        if (!event.relatedTarget) hide();
      };

      const onReady = () => syncAvailability();

      syncAvailability();
      document.addEventListener(SHELL_EVENTS.ready, onReady);
      document.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerdown', onPointerDown, { passive: true });
      document.addEventListener('pointerup', onPointerUp, { passive: true });
      document.addEventListener('pointerout', onPointerOut, { passive: true });
      window.addEventListener('blur', hide);
      finePointer.addEventListener('change', syncAvailability);
      reducedMotion.addEventListener('change', syncAvailability);

      return () => {
        document.removeEventListener(SHELL_EVENTS.ready, onReady);
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerdown', onPointerDown);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointerout', onPointerOut);
        window.removeEventListener('blur', hide);
        finePointer.removeEventListener('change', syncAvailability);
        reducedMotion.removeEventListener('change', syncAvailability);
        delete html.dataset.customCursor;
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={styles.cursor}
      data-mode="default"
      data-visible="false"
      data-pressed="false"
      aria-hidden="true"
    >
      <span ref={ring} className={styles.ringMover}>
        <span className={styles.ring}>
          <span className={styles.glyph} />
        </span>
      </span>
      <span ref={dot} className={styles.dotMover}>
        <span className={styles.dot} />
      </span>
    </div>
  );
}
