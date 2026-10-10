import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { comptoirMedia, journeyMedia } from '@/content/media';
import { Media } from '@/ui/Media';
import styles from './ActJourney.module.css';

/** The last Work photograph, carried across the Work → Journey seam. */
const coverMedia = comptoirMedia[1]!;
/** The archive print that holds the same photograph (2024, Le Comptoir). */
const coverFileIndex = Math.max(0, journeyMedia.findIndex((item) => item.src === coverMedia.src));

/**
 * The shared wine aperture, used on both sides of the Work → Journey seam.
 * The cover print is ONE element per side, laid in the mat window: the
 * bridge shrinks it from the Comptoir cover into the window, Journey files it
 * along the ledge at its own year. Both sides request the same image size so
 * the seam is the same decoded photograph.
 */
export function JourneyOpeningFrame({ content, locale, preview = false }: {
  content: Content;
  locale: Locale;
  preview?: boolean;
}) {
  const { journey } = content;
  return (
    <>
      <div className={styles.mat} data-archive-mat>
        <div className={styles.matPaper}>
          <span className={styles.window} />
          <span className={`${styles.matChapter} micro`} data-mat-copy>07 / {journey.heading}</span>
          <span className={`${styles.matRange} micro`} data-mat-copy>
            {journey.entries[0]?.year} — {journey.entries.at(-1)?.year}
          </span>
          <h2 id={preview ? undefined : 'journey-title'} className={styles.matTitle} data-mat-copy>{journey.heading}</h2>
          <p className={styles.matStatement} data-mat-copy>{journey.statement}</p>
          <span className={`${styles.matHint} micro`} data-mat-copy>{journey.scrollHint}</span>
        </div>
      </div>
      <div className={styles.coverPrint} data-archive-cover data-file={coverFileIndex} aria-hidden="true">
        <div className={styles.photo}>
          <div className={styles.photoInner}>
            <Media item={coverMedia} locale={locale} compact sizes="(max-width: 1023px) 200vw, 100vw" />
          </div>
        </div>
      </div>
    </>
  );
}
