import type { Content } from '@/content';

import styles from './ActExpertise.module.css';

interface Props {
  content: Content;
}

export function ActExpertise({ content }: Props) {
  return (
    <section
      id="act-expertise"
      className={`act surface-paper ${styles.act}`}
      aria-labelledby="expertise-title"
    >
      <div className={styles.section}>
        <header className={styles.header}>
          <p className={`${styles.chapter} micro`}>05 / {content.nav.expertise}</p>
          <h2 id="expertise-title" className={`${styles.heading} display`}>
            {content.expertise.heading}
          </h2>
          <p className={styles.manifesto}>{content.manifesto.lineOne}</p>
        </header>

        <ol className={styles.list}>
          {content.expertise.entries.map((entry, index) => (
            <li className={styles.row} key={entry.term} tabIndex={0}>
              <span className={styles.index} aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{entry.term}</h3>
              <p>{entry.context}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
