import type { Content } from '@/content';

import styles from './ActJourney.module.css';

interface Props {
  content: Content;
}

export function ActJourney({ content }: Props) {
  return (
    <section
      id="act-journey-scene"
      className={`act surface-ink ${styles.act}`}
      aria-labelledby="journey-title"
    >
      <div className={styles.section}>
        <header className={styles.header}>
          <p className="micro">04 / {content.nav.journey}</p>
          <h2 id="journey-title" className={`${styles.heading} display`}>
            {content.journey.heading}
          </h2>
          <p className={styles.axis}>{content.contact.axis}</p>
        </header>

        <ol className={styles.entries}>
          {content.journey.entries.map((entry, index) => (
            <li className={styles.entry} key={entry.year} tabIndex={0}>
              <span className={styles.number} aria-hidden="true">
                0{index + 1}
              </span>
              <p className={styles.year}>{entry.year}</p>
              <div className={styles.entryCopy}>
                <h3>{entry.label}</h3>
                <p>{entry.place}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
