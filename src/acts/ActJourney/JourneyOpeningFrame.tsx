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
      <div className={styles.storyGuide} data-journey-guide>
        <p className={styles.storyStatement}>{content.journey.statement}</p>
        <ol className={styles.chapterList} aria-label={content.journey.heading}>
          {content.journey.entries.map((entry, index) => (
            <li
              className={styles.chapterItem}
              data-journey-chapter
              data-active={index === 0 ? 'true' : undefined}
              key={entry.year}
            >
              <span className={styles.chapterYear}>{entry.year}</span>
              <strong className={styles.chapterName}>{entry.chapter}</strong>
            </li>
          ))}
        </ol>
        <div className={styles.mobileCurrent} aria-live="off">
          {content.journey.entries.map((entry, index) => (
            <span
              data-journey-now
              data-active={index === 0 ? 'true' : undefined}
              key={entry.year}
            >
              {String(index + 1).padStart(2, '0')} / 06 — {entry.year} · {entry.chapter}
            </span>
          ))}
        </div>
        <span className={styles.storyHint}>{content.journey.scrollHint}</span>
      </div>
      <div ref={trackRef} className={styles.track}>
        {entries.map((entry, index) => (
          <article className={styles.entry} data-journey-entry key={entry.year}>
            <span className={styles.entryChapter} data-journey-ink>
              <span>{String(index + 1).padStart(2, '0')} / 06</span>
              <span>{entry.chapter}</span>
            </span>
            <span className={styles.year} data-journey-ink>{entry.year}</span>
            <div className={styles.entryCopy} data-journey-ink>
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
