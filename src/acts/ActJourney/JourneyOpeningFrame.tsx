import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { journeyMedia } from '@/content/media';
import { Media } from '@/ui/Media';
import styles from './ActJourney.module.css';

/** The shared wine aperture, used on both sides of the Work → Journey seam. */
export function JourneyOpeningFrame({ content, locale, preview = false }: {
  content: Content;
  locale: Locale;
  preview?: boolean;
}) {
  const { journey } = content;
  return (
    <>
      {preview && (
        <div className={styles.gate} data-bridge-photo aria-hidden="true">
          <div className={styles.print}>
            <div className={styles.photo}>
              <div className={styles.photoInner}>
                <Media item={journeyMedia[0]!} locale={locale} compact sizes="(max-width: 1023px) 76vw, 36vw" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.mat} data-archive-mat>
        <div className={styles.matPaper}>
          <span className={styles.window} />
          <span className={`${styles.matChapter} micro`}>07 / {journey.heading}</span>
          <span className={`${styles.matRange} micro`}>
            {journey.entries[0]?.year} — {journey.entries.at(-1)?.year}
          </span>
          <h2 id={preview ? undefined : 'journey-title'} className={styles.matTitle}>{journey.heading}</h2>
          <p className={styles.matStatement}>{journey.statement}</p>
          <span className={`${styles.matHint} micro`}>{journey.scrollHint}</span>
        </div>
      </div>
    </>
  );
}
