import type { Content } from '@/content';
import type { Locale } from '@/content/locales';

import { EditMark } from './EditMark';
import styles from './ActProcess.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActProcess({ content, locale }: Props) {
  return (
    <section
      id="act-process"
      className={`act surface-paper ${styles.act}`}
      aria-labelledby="method-title"
    >
      <div className={styles.section}>
        <header className={styles.sectionHeader}>
          <p className={`${styles.chapter} micro`}>02 / {content.process.heading}</p>
          <p className={styles.thesis}>{content.strategy.sentence}</p>
        </header>

        <div className={styles.layout}>
          <EditMark content={content} locale={locale} />

          <div className={styles.method}>
            <p className={`${styles.eyebrow} micro`}>{content.edit.layout}</p>
            <h2 id="method-title" className={`${styles.heading} title`}>
              {content.strategy.heading}
            </h2>
            <p className={styles.intro}>{content.manifesto.lineTwo}</p>

            <ol className={styles.steps}>
              {content.strategy.steps.map((step, index) => (
                <li className={styles.step} key={step.term}>
                  <span className={styles.index} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{step.term}</h3>
                    <p>{step.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
