import type { Locale } from '@/content/locales';
import { contactSheet } from '@/content/media';
import { Media } from './Media';
import styles from './NotebookFrame.module.css';

/** The physical twin at the Immersion/Notebook boundary. Both actors use
 * exactly this photograph, crop, paper and geometry; neither invents a grid. */
export function NotebookFrame({ locale, marker, className }: {
  locale: Locale;
  marker: 'story' | 'process';
  className?: string;
}) {
  return (
    <div className={`${styles.frame} ${className ?? ''}`} data-notebook-frame={marker} aria-hidden="true">
      <div className={styles.paper} data-notebook-paper>
        <span className={styles.binding} />
        <span className={styles.marginRule} />
      </div>
      <figure className={styles.image} data-notebook-frame-image>
        <Media item={contactSheet[0]!} locale={locale} compact loading="eager" sizes="(max-width: 1023px) 64vw, 28vw" />
      </figure>
      <span className={`${styles.folio} micro`} data-notebook-folio>01 / ATELIER</span>
    </div>
  );
}
