import type { Locale } from '@/content/locales';
import { contactSheet } from '@/content/media';

import { Media } from './Media';
import styles from './CreativeDesk.module.css';

interface Props {
  locale: Locale;
}

/** Matière physique commune aux trois dernières pages du carnet. */
export function CreativeDesk({ locale }: Props) {
  return (
    <div className={styles.desk} data-creative-desk aria-hidden="true">
      <figure className={`${styles.object} ${styles.printOne}`} data-desk-object>
        <Media item={contactSheet[0]!} locale={locale} compact sizes="16vw" preload={false} />
        <figcaption className="micro">Mood / 01</figcaption>
      </figure>

      <figure className={`${styles.object} ${styles.printTwo}`} data-desk-object>
        <Media item={contactSheet[2]!} locale={locale} compact sizes="15vw" preload={false} />
        <figcaption className="micro">Structure / 02</figcaption>
      </figure>

      <figure className={`${styles.object} ${styles.materialSample}`} data-desk-object>
        <Media item={contactSheet[7]!} locale={locale} compact sizes="12vw" preload={false} />
      </figure>

      <div className={`${styles.object} ${styles.typeProof}`} data-desk-object>
        <span>Aa</span>
        <small className="micro">Bodoni / Inter Tight</small>
      </div>

      <span className={`${styles.object} ${styles.swatches}`} data-desk-object>
        <i />
        <i />
        <i />
        <i />
      </span>

      <span className={`${styles.object} ${styles.pencil}`} data-desk-object>
        <i />
      </span>
      <span className={`${styles.object} ${styles.tape}`} data-desk-object />
    </div>
  );
}
