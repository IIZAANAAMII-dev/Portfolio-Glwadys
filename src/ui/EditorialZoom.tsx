'use client';

import { useRef } from 'react';

import type { Locale } from '@/content/locales';
import type { MediaItem } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/motion';

import { Media } from './Media';
import styles from './EditorialZoom.module.css';

interface Props {
  item: MediaItem;
  locale: Locale;
  label: string;
  sizes: string;
}

export function EditorialZoom({ item, locale, label, sizes }: Props) {
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const visualEl = visual.current;
      const lensEl = lens.current;
      if (!rootEl || !visualEl || !lensEl) return;

      const finePointer = window.matchMedia(MQ.finePointer);
      const reducedMotion = window.matchMedia(MQ.reduced);
      if (!finePointer.matches || reducedMotion.matches) return;

      gsap.set(lensEl, { xPercent: -50, yPercent: -50 });
      const lensX = gsap.quickTo(lensEl, 'x', { duration: 0.16, ease: 'power3.out' });
      const lensY = gsap.quickTo(lensEl, 'y', { duration: 0.16, ease: 'power3.out' });
      const visualX = gsap.quickTo(visualEl, 'xPercent', {
        duration: 0.38,
        ease: 'power3.out',
      });
      const visualY = gsap.quickTo(visualEl, 'yPercent', {
        duration: 0.38,
        ease: 'power3.out',
      });

      const onMove = (event: PointerEvent) => {
        const rect = rootEl.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;
        const nx = localX / rect.width - 0.5;
        const ny = localY / rect.height - 0.5;

        lensX(localX);
        lensY(localY);
        visualX(nx * -4.5);
        visualY(ny * -4.5);
      };

      const onEnter = () => {
        rootEl.dataset.active = 'true';
      };

      const onLeave = () => {
        rootEl.dataset.active = 'false';
        visualX(0);
        visualY(0);
      };

      rootEl.addEventListener('pointermove', onMove, { passive: true });
      rootEl.addEventListener('pointerenter', onEnter, { passive: true });
      rootEl.addEventListener('pointerleave', onLeave, { passive: true });

      return () => {
        rootEl.removeEventListener('pointermove', onMove);
        rootEl.removeEventListener('pointerenter', onEnter);
        rootEl.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: root },
  );

  return (
    <figure ref={root} className={styles.zoom} data-active="false" data-cursor="view">
      <div className={styles.window}>
        <div ref={visual} className={styles.visual}>
          <Media item={item} locale={locale} sizes={sizes} />
        </div>
        <span ref={lens} className={styles.lens} aria-hidden="true">
          <span>+</span>
        </span>
      </div>
      <figcaption className={`${styles.caption} micro`}>
        <span>Focus</span>
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}
