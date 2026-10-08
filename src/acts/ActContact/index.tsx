import type { Content } from '@/content';

import styles from './ActContact.module.css';

interface Props {
  content: Content;
}

export function ActContact({ content }: Props) {
  return (
    <section
      id="act-contact"
      className={`act surface-wood ${styles.act}`}
      aria-labelledby="contact-title"
    >
      <div className={styles.section}>
        <header className={styles.header}>
          <p className="micro">06 / {content.contact.heading}</p>
        </header>

        <div className={styles.contactGrid}>
          <div className={styles.invitation}>
            <h2 id="contact-title" className={styles.name}>
              <span>{content.hero.firstName}</span>
              <em>{content.hero.lastName}</em>
            </h2>
            <p className={styles.statement}>{content.contact.statement}</p>
            <a className={styles.mailAction} href={`mailto:${content.contact.email}`}>
              <span className={`${styles.actionLabel} micro`}>{content.contact.cta}</span>
              <span className={styles.email}>{content.contact.email}</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </a>
            <a className={styles.linkedin} href={content.contact.linkedin} target="_blank" rel="noreferrer">
              {content.contact.linkedinLabel}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <dl className={styles.details}>
            <div>
              <dt>{content.contact.labels.availability}</dt>
              <dd>{content.contact.availability}</dd>
            </div>
            <div>
              <dt>{content.contact.labels.services}</dt>
              <dd>{content.contact.services}</dd>
            </div>
            <div>
              <dt>{content.contact.labels.languages}</dt>
              <dd>{content.contact.languages}</dd>
            </div>
            <div>
              <dt>{content.contact.labels.axis}</dt>
              <dd>{content.contact.axis}</dd>
            </div>
          </dl>
        </div>

        <footer className={styles.footer}>
          <span>{content.contact.copyright}</span>
          <a href="#act-opening">{content.contact.backToTop} ↑</a>
        </footer>
      </div>
    </section>
  );
}
