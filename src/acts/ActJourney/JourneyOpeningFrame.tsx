import type { RefObject } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { journeyMedia } from '@/content/media';
import { Media } from '@/ui/Media';

import styles from './ActJourney.module.css';

/**
 * The actual Journey opening and its last Work-bridge frame use identical DOM
 * and CSS. This is a physical handoff across the pinned scroll boundary.
 */
export function JourneyOpeningFrame({
  content, locale, trackRef, preview = false,
}: {
  content: Content;
  locale: Locale;
  trackRef?: RefObject<HTMLDivElement | null>;
  preview?: boolean;
}) {
  const entries = preview ? content.journey.entries.slice(0, 2) : content.journey.entries;
  return (
    <>
      <span className={[styles.chapter, 'micro'].join(' ')} data-journey-chrome>
        07 / Timeline
      </span>
      <h2 id={preview ? undefined : 'journey-title'} className={[styles.heading, 'title'].join(' ')} data-journey-chrome>
        {content.journey.heading}
      </h2>
      <span className={[styles.range, 'micro'].join(' ')}>2021 — 2026</span>
      <span className={styles.playhead} data-journey-chrome aria-hidden="true">
        <span className={styles.progress} data-journey-progress />
      </span>
      <span className={[styles.counter, 'micro'].join(' ')} data-journey-counter data-journey-chrome>
        01 / {String(content.journey.entries.length).padStart(2, '0')}
      </span>
      <div ref={trackRef} className={styles.track}>
        {entries.map((entry, index) => (
          <article className={styles.entry} data-journey-entry key={entry.year}>
            <span className={styles.year}>{entry.year}</span>
            <div className={styles.entryCopy}>
              <h3 className={[styles.entryLabel, 'title'].join(' ')}>{entry.label}</h3>
              <span className={[styles.place, 'micro'].join(' ')}>{entry.place}</span>
            </div>
            <div className={styles.media} data-journey-media>
              <Media item={journeyMedia[index]!} locale={locale} compact sizes="(max-width: 1023px) 65vw, 40vw" />
            </div>
          </article>
        ))}
      </div>
      <span className={[styles.caption, 'editorial-stamp'].join(' ')} data-journey-chrome>
        {content.contact.axis}
      </span>
    </>
  );
}
