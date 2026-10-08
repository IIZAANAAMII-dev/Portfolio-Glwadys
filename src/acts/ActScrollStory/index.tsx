import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { localeLabels, locales } from '@/content/locales';
import { heroVertical } from '@/content/media';
import { MotionScope } from '@/motion/MotionScope';
import { CropMarks } from '@/ui/CropMarks';
import { Media } from '@/ui/Media';

import styles from './ActScrollStory.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActScrollStory({ content, locale }: Props) {
  return (
    <section
      id="act-opening"
      className={`act surface-ink ${styles.act}`}
      aria-labelledby="hero-title"
    >
      <MotionScope kind="hero" className={styles.hero}>
        <header className={styles.topline}>
          <p className="micro">{content.opening.edition}</p>
          <nav className={styles.languages} aria-label={content.a11y.languageSwitch}>
            {locales.map((item) => (
              <a
                key={item}
                href={`/${item}`}
                hrefLang={item}
                aria-current={item === locale ? 'page' : undefined}
              >
                {localeLabels[item]}
              </a>
            ))}
          </nav>
        </header>

        <div className={styles.heroMain}>
          <div className={styles.identity}>
            <p className={`${styles.axis} micro`}>{content.opening.axis}</p>
            <h1 id="hero-title" className={styles.name}>
              <span>{content.hero.firstName}</span>
              <em>{content.hero.lastName}</em>
            </h1>
            <p className={styles.descriptor}>
              <span>{content.hero.descriptor.split(' · ').slice(0, 2).join(' · ')}</span>
              <span className={styles.descriptorEnd}>{content.hero.descriptor.split(' · ').slice(2).join(' · ')}</span>
            </p>
            <p className={`${styles.tagline} lead`}>{content.opening.tagline}</p>
            <a className={styles.workLink} href="#act-work">
              <span>{content.nav.work}</span>
              <span aria-hidden="true">↘</span>
            </a>
          </div>

          <figure className={styles.heroFigure}>
            <div className={styles.reservationNote} aria-hidden="true">
              <em>THE<br />EDIT</em>
              <span>{content.edit.finished.split(' · ')[0]} / 01</span>
              <i data-reservation-rule />
            </div>
            <div className={styles.heroImage}>
              <div data-hero-crop className={styles.heroCrop}>
                <Media item={heroVertical} locale={locale} className={styles.heroMedia} sizes="(max-width: 767px) 48vw, 28vw" preload />
              </div>
              <div data-hero-marks><CropMarks className={styles.cropMarks} /></div>
            </div>
            <figcaption className={styles.studyCaption}>
              <span className="micro">{content.a11y.directionStudy}</span>
            </figcaption>
          </figure>
        </div>

        <div className={styles.heroFooter}>
          <span className={`${styles.footerIndex} micro`}>01</span>
          <p>{content.social.statement}</p>
          <a className="micro" href="#act-process">
            {content.strategy.heading} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </MotionScope>
    </section>
  );
}
