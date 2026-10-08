'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { yunaMedia } from '@/content/media';
import { Flip, gsap } from '@/motion/gsap';
import { CropMarks } from '@/ui/CropMarks';
import { Media } from '@/ui/Media';

import styles from './EditMark.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function EditMark({ content, locale }: Props) {
  const [step, setStep] = useState(0);
  const root = useRef<HTMLElement>(null);
  const artifact = useRef<HTMLDivElement>(null);
  const scope = useRef<gsap.Context | null>(null);
  const travel = useRef<gsap.core.Timeline | null>(null);
  const handoff = useRef<ViewTransition | null>(null);
  const handoffPending = useRef(false);
  const phases = [content.edit.finished, content.edit.contactSheet, content.edit.selected];

  useEffect(() => {
    scope.current = gsap.context(() => {}, root);
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const settle = () => {
      travel.current?.progress(1).kill();
      if (artifact.current) gsap.set(artifact.current, { clearProps: 'all' });
      const details = root.current?.querySelectorAll('[data-crop-stroke], [data-selection-rule], [data-proof]');
      if (details) {
        gsap.killTweensOf(details);
        gsap.set(details, { clearProps: 'all' });
      }
    };
    window.addEventListener('resize', settle);
    motionPreference.addEventListener('change', settle);
    return () => {
      handoff.current?.skipTransition();
      window.removeEventListener('resize', settle);
      motionPreference.removeEventListener('change', settle);
      scope.current?.revert();
      document.documentElement.classList.remove('yuna-handoff-active');
      document.querySelector<HTMLElement>('[data-yuna-handoff-target]')?.style.removeProperty('view-transition-name');
    };
  }, []);

  function changeStep(next: number) {
    const print = artifact.current;
    if (!print || next === step || handoffPending.current) return;
    const keepFocus = root.current?.contains(document.activeElement);
    // Capture the actual interrupted position, rather than completing an old trip.
    travel.current?.kill();
    const before = Flip.getState(print, { props: 'borderRadius' });
    gsap.set(print, { clearProps: 'all' });
    flushSync(() => setStep(next));

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scope.current?.add(() => {
        travel.current = Flip.from(before, {
          duration: 0.72, scale: true, ease: 'power3.inOut',
          onComplete: () => { gsap.set(print, { clearProps: 'all' }); },
        });
        const strokes = print.querySelectorAll('[data-crop-stroke]');
        gsap.killTweensOf(strokes);
        gsap.set(strokes, { clearProps: 'strokeDashoffset' });
        if (next > 0) {
          gsap.fromTo(strokes, { strokeDashoffset: 1 }, {
            strokeDashoffset: 0, duration: 0.38, stagger: 0.045, delay: 0.22, ease: 'power2.out',
          });
        }
        const rule = print.querySelector('[data-selection-rule]');
        gsap.killTweensOf(rule);
        if (next > 0) gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.5, delay: 0.18, ease: 'power2.out' });
        if (next === 1) {
          const proofs = root.current!.querySelectorAll('[data-proof]');
          gsap.killTweensOf(proofs);
          gsap.fromTo(proofs, { clipPath: 'inset(0 0 100% 0)' }, {
            clipPath: 'inset(0)', duration: 0.46, stagger: 0.075, ease: 'power2.out', clearProps: 'clipPath',
          });
        }
      });
    }
    // A button becomes the handoff link; preserve keyboard position through it.
    if (keepFocus && !root.current?.contains(document.activeElement)) {
      root.current?.querySelector<HTMLElement>('[data-edit-next]')?.focus({ preventScroll: true });
    }
  }

  async function handleHandoff(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const source = artifact.current;
    const target = document.querySelector<HTMLElement>('[data-yuna-handoff-target]');
    const heading = document.getElementById('case-yuna');
    if (!source || !target || !heading) return;
    event.preventDefault();
    if (handoffPending.current) return;
    handoffPending.current = true;
    travel.current?.progress(1).kill();
    gsap.set(source, { clearProps: 'all' });
    const cleanup = () => {
      source.style.removeProperty('view-transition-name');
      target.style.removeProperty('view-transition-name');
      document.documentElement.classList.remove('yuna-handoff-active');
      handoff.current = null;
      handoffPending.current = false;
    };
    const land = (shared: boolean) => {
      source.style.removeProperty('view-transition-name');
      if (shared) target.style.viewTransitionName = 'yuna-handoff';
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - 48);
      window.scrollTo({ top, behavior: 'instant' });
      if (window.location.hash !== '#act-work-yuna') window.history.pushState(null, '', '#act-work-yuna');
      heading.focus({ preventScroll: true });
    };
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      land(false);
      cleanup();
      return;
    }
    // Decode the same source at its destination size before the shared capture.
    await target.querySelector('img')?.decode().catch(() => {});
    if (!source.isConnected || !target.isConnected) { cleanup(); return; }
    source.style.viewTransitionName = 'yuna-handoff';
    document.documentElement.classList.add('yuna-handoff-active');
    try {
      handoff.current = document.startViewTransition(() => land(true));
      await handoff.current.finished;
    } catch {
      land(false);
    } finally {
      cleanup();
    }
  }

  return (
    <figure ref={root} className={styles.figure} aria-label={content.edit.label}>
      <div className={styles.visual} data-step={step}>
        <div className={styles.sheetGrid} aria-hidden={step !== 1}>
          <div className={styles.selectedSlot} />
          {yunaMedia.slice(1).map((frame, index) => (
            <div className={styles.sheetTile} data-proof key={frame.id}>
              <Media item={frame} locale={locale} className={styles.imageFrame} compact loading="eager" sizes="(max-width: 767px) 42vw, 17vw" />
              <span className={styles.sheetNumber} aria-hidden="true">0{index + 2}</span>
            </div>
          ))}
          <div className={styles.sheetColophon}>
            <span>YUNA / 01—03</span>
            <em>THE<br />EDIT</em>
            <span>01 ↗</span>
          </div>
        </div>

        <div ref={artifact} className={styles.artifact} data-flip-id="yuna-print" data-yuna-handoff-source>
          <Media item={yunaMedia[0]!} locale={locale} className={styles.imageFrame} compact loading="eager" sizes="(max-width: 767px) 90vw, 36vw" />
          <CropMarks className={styles.cropMarks} />
          <span className={styles.selectionRule} data-selection-rule aria-hidden="true" />
          <span className={styles.sheetNumber} aria-hidden="true">01</span>
        </div>
        <span className={styles.phoneBezel} aria-hidden="true" />
        <span className={styles.frameIndex} aria-hidden="true">0{step + 1} / 03</span>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.phase} aria-live="polite" aria-atomic="true">{phases[step]}</span>
        <span className={styles.study}>{content.a11y.directionStudy}</span>
      </figcaption>

      <div className={styles.controls} role="group" aria-label={content.edit.label}>
        {step > 0 && (
          <button className={styles.secondaryAction} type="button" data-edit-back onClick={() => changeStep(step - 1)}>
            <span aria-hidden="true">←</span>{content.edit.previousStep}
          </button>
        )}
        {step < 2 ? (
          <button className={styles.primaryAction} type="button" data-edit-next onClick={() => changeStep(step + 1)}>
            {step === 0 ? content.edit.openContactSheet : content.edit.selectFrame}<span aria-hidden="true">↗</span>
          </button>
        ) : (
          <a className={styles.primaryAction} href="#act-work-yuna" data-edit-next onClick={handleHandoff}>
            {content.edit.handoff}<span aria-hidden="true">↘</span>
          </a>
        )}
      </div>
      <noscript><a className={styles.primaryAction} href="#act-work-yuna">{content.edit.handoff} ↘</a></noscript>
    </figure>
  );
}
