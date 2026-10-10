import type { RefObject } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { journeyMedia } from '@/content/media';
import { Media } from '@/ui/Media';

import { JourneyOpeningFrame } from './JourneyOpeningFrame';
import styles from './ActJourney.module.css';

/**
 * Splits the years into character columns. Columns whose character never
 * changes (the "202" of 2021–2026) are printed once and stay still; only the
 * changing columns roll, so the year turns like an archive index stamp.
 */
function yearColumns(years: string[]) {
  const width = Math.max(...years.map((year) => year.length));
  return Array.from({ length: width }, (_, column) => {
    const chars = years.map((year) => year.padStart(width, ' ')[column] ?? ' ');
    return { still: chars.every((char) => char === chars[0]), chars };
  });
}

/**
 * Le journal des images, 2021 → 2026: an archive of oversized prints laid on
 * the dark wood desk. One print rests in the reading position, the previous
 * one slides under the left page, the next one waits at the paper edge.
 * A wine passe-partout — the same wine page the Comptoir dossier ends on —
 * is lifted off the first print to open the act.
 */
export function JourneyArchive({
  content,
  locale,
  stripRef,
}: {
  content: Content;
  locale: Locale;
  stripRef?: RefObject<HTMLDivElement | null>;
}) {
  const { journey } = content;
  const total = String(journey.entries.length).padStart(2, '0');
  const columns = yearColumns(journey.entries.map((entry) => entry.year));

  return (
    <>
      <span className={styles.gate} data-archive-gate aria-hidden="true" />

      {/* Prints: the photographic protagonists. */}
      <div ref={stripRef} className={styles.strip} data-archive-strip aria-hidden="true">
        {journey.entries.map((entry, index) => (
          <figure className={styles.print} data-archive-print key={entry.year}>
            <div className={styles.photo}>
              <div className={styles.photoInner} data-archive-photo>
                <Media
                  item={journeyMedia[index]!}
                  locale={locale}
                  compact
                  sizes="(max-width: 1023px) 76vw, 36vw"
                />
              </div>
            </div>
            <figcaption className={styles.caption}>
              <span>{entry.year}</span>
              <span>{entry.place}</span>
            </figcaption>
            <span className={styles.shade} data-archive-shade />
          </figure>
        ))}
      </div>

      {/* Left page: the reading column (desktop) / caption block (mobile). */}
      <div className={styles.page}>
        <ol className={styles.chapters} aria-hidden="true">
          {journey.entries.map((entry, index) => (
            <li
              className={styles.chapterItem}
              data-archive-chapter
              data-active={index === 0 ? 'true' : undefined}
              key={entry.year}
            >
              <span className={styles.itemYear}>{entry.year}</span>
              <span className={styles.itemVerb}>{entry.chapter}</span>
              <span className={styles.itemLabel}>{entry.label}</span>
              <span className={[styles.itemPlace, 'micro'].join(' ')}>{entry.place}</span>
            </li>
          ))}
        </ol>

        <div className={styles.stamp} aria-hidden="true">
          <span className={styles.verbMask}>
            <span className={styles.verbRoll} data-archive-roll>
              {journey.entries.map((entry) => (
                <span key={entry.year}>{entry.chapter}</span>
              ))}
            </span>
          </span>
          <span className={styles.year}>
            {columns.map((column, index) =>
              column.still ? (
                <span className={styles.yearStill} key={index}>
                  {column.chars[0]}
                </span>
              ) : (
                <span className={styles.yearMask} key={index}>
                  <span className={styles.yearRoll} data-archive-roll>
                    {column.chars.map((char, charIndex) => (
                      <span key={charIndex}>{char}</span>
                    ))}
                  </span>
                </span>
              ),
            )}
          </span>
        </div>
      </div>

      <div className={styles.head} aria-hidden="true">
        <span className="micro">07 / {journey.heading}</span>
        <span className={[styles.counter, 'micro'].join(' ')} data-archive-counter>
          01 / {total}
        </span>
      </div>

      <JourneyOpeningFrame content={content} locale={locale} />
    </>
  );
}
