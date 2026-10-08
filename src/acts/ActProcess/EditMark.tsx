'use client';

import { useState, type MouseEvent } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { yunaMedia } from '@/content/media';
import { Media } from '@/ui/Media';

import styles from './EditMark.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function EditMark({ content, locale }: Props) {
  const [step, setStep] = useState(0);
  const phases = [content.edit.finished, content.edit.contactSheet, content.edit.selected];
  const images = [yunaMedia[0]!, yunaMedia[0]!, yunaMedia[0]!];

  function handleHandoff(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const source = document.querySelector<HTMLElement>('[data-yuna-handoff-source]');
    const target = document.querySelector<HTMLElement>('[data-yuna-handoff-target]');
    const heading = document.getElementById('case-yuna');

    if (!source || !target || !heading) return;

    event.preventDefault();

    let didUpdate = false;
    const updateDestination = (shareElement: boolean) => {
      didUpdate = true;
      source.style.removeProperty('view-transition-name');
      if (shareElement) target.style.viewTransitionName = 'yuna-handoff';

      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - 48);
      window.scrollTo({ top, behavior: 'instant' });
      window.history.pushState(null, '', '#act-work-yuna');
      heading.focus({ preventScroll: true });
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reducedMotion) {
      updateDestination(false);
      return;
    }

    source.style.viewTransitionName = 'yuna-handoff';
    document.documentElement.classList.add('yuna-handoff-active');

    try {
      const transition = document.startViewTransition(() => updateDestination(true));
      const cleanup = () => {
        source.style.removeProperty('view-transition-name');
        target.style.removeProperty('view-transition-name');
        document.documentElement.classList.remove('yuna-handoff-active');
      };

      void transition.finished.then(cleanup, cleanup);
    } catch {
      source.style.removeProperty('view-transition-name');
      document.documentElement.classList.remove('yuna-handoff-active');
      if (!didUpdate) updateDestination(false);
      window.setTimeout(() => target.style.removeProperty('view-transition-name'), 0);
    }
  }

  return (
    <figure className={styles.figure} aria-label={content.edit.label}>
      <div
        className={styles.visual}
        data-step={step}
        data-yuna-handoff-source="true"
      >
        {images.map((item, index) => (
          <div
            className={styles.imageLayer}
            data-current={step === index}
            data-layer={index === 0 ? 'phone' : index === 1 ? 'sheet' : 'selected'}
            aria-hidden={step !== index}
            key={`${item.id}-${index}`}
          >
            {index === 1 ? (
              <div className={styles.sheetGrid}>
                {yunaMedia.map((frame, frameIndex) => (
                  <div
                    className={styles.sheetTile}
                    data-selected={frameIndex === 0}
                    key={frame.id}
                  >
                    <Media
                      item={frame}
                      locale={locale}
                      className={styles.imageFrame}
                      compact
                      loading={step === 1 ? 'eager' : 'lazy'}
                      sizes="(max-width: 767px) 42vw, 17vw"
                    />
                    <span className={styles.sheetNumber} aria-hidden="true">
                      0{frameIndex + 1}
                    </span>
                  </div>
                ))}
                <span className={styles.sheetColophon} aria-hidden="true">
                  YUNA / 01—03
                </span>
              </div>
            ) : (
              <Media
                item={item}
                locale={locale}
                className={styles.imageFrame}
                compact
                loading={index === step || index === 2 ? 'eager' : undefined}
                sizes="(max-width: 767px) 88vw, 36vw"
              />
            )}
          </div>
        ))}

        <span className={styles.phoneBezel} aria-hidden="true" />
        <span className={styles.cropFrame} aria-hidden="true" />
        <span className={styles.selectionLine} aria-hidden="true" />
        <span className={styles.frameIndex} aria-hidden="true">
          0{step + 1} / 03
        </span>
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.phase} aria-live="polite" aria-atomic="true">
          {phases[step]}
        </span>
        <span className={styles.study}>{content.a11y.directionStudy}</span>
      </figcaption>

      <div className={styles.controls} role="group" aria-label={content.edit.label}>
        {step > 0 && (
          <button className={styles.secondaryAction} type="button" onClick={() => setStep(step - 1)}>
            <span aria-hidden="true">←</span>
            {content.edit.previousStep}
          </button>
        )}
        {step < 2 ? (
          <button className={styles.primaryAction} type="button" onClick={() => setStep(step + 1)}>
            {step === 0 ? content.edit.openContactSheet : content.edit.selectFrame}
            <span aria-hidden="true">↗</span>
          </button>
        ) : (
          <a className={styles.primaryAction} href="#act-work-yuna" onClick={handleHandoff}>
            {content.edit.handoff}
            <span aria-hidden="true">↘</span>
          </a>
        )}
      </div>
    </figure>
  );
}
