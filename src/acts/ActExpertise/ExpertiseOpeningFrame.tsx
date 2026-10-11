import type { RefObject } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { socialSatellites } from '@/content/media';
import { Media } from '@/ui/Media';

import styles from './ActExpertise.module.css';

/** Also printed in Journey's closing frame: identical composition at the seam. */
export function ExpertiseOpeningFrame({ content, locale, listRef, decorative = false }: {
  content: Content;
  locale: Locale;
  listRef?: RefObject<HTMLOListElement | null>;
  decorative?: boolean;
}) {
  const { expertise } = content;
  const total = String(expertise.entries.length).padStart(2, '0');
  return (
    <div className={styles.composition}>
      <header className={styles.masthead}>
        <h2 id={decorative ? undefined : 'expertise-title'} className={styles.heading}>
          <span className={styles.chapter}>04 /</span> {expertise.heading}
        </h2>
        <span className={styles.counter} data-expertise-counter aria-hidden="true">01 / {total}</span>
      </header>
      <div className={styles.editorial}>
        <div className={styles.heroTerms} aria-hidden="true">
          {expertise.entries.map((entry, index) => (
            <p key={entry.term} className={styles.heroTerm} data-expertise-hero data-first={index === 0 ? 'true' : undefined}>
              {entry.term}
            </p>
          ))}
        </div>
        <div className={styles.contexts} aria-hidden="true">
          {expertise.entries.map((entry, index) => (
            <p key={entry.term} className={styles.context} data-expertise-context data-first={index === 0 ? 'true' : undefined}>
              {entry.context}
            </p>
          ))}
        </div>
        <figure className={styles.print}>
          <div className={styles.printCrop}>
            <div className={styles.printImage} data-expertise-print>
              <Media item={socialSatellites[4]!} locale={locale} preload={false} className="fill-frame"
                sizes="(max-width: 1023px) 30vw, 34vw" />
            </div>
          </div>
          <figcaption>{expertise.studyCaption}</figcaption>
        </figure>
      </div>
      <div className={styles.disciplines}>
        <p className={styles.indexLabel}>{expertise.indexLabel}</p>
        <ol ref={listRef} className={styles.index} data-expertise-index>
          {expertise.entries.map((entry, index) => (
            <li className={styles.row} data-expertise-row data-active={index === 0 ? 'true' : undefined} key={entry.term}>
              <span className={styles.num} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.term}>{entry.term}</span>
              <span className={styles.rowContext}>{entry.context}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
