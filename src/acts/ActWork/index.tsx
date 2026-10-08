import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { comptoirMedia, mgcMedia, yunaMedia } from '@/content/media';
import { Media } from '@/ui/Media';

import styles from './ActWork.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

const projectMedia = {
  yuna: yunaMedia[0]!,
  mgc: mgcMedia[0]!,
  comptoir: comptoirMedia[1]!,
} as const;

export function ActWork({ content, locale }: Props) {
  return (
    <section
      id="act-work"
      className={`act surface-paper-deep ${styles.act}`}
      aria-labelledby="work-title"
    >
      <div className={styles.section}>
        <header className={styles.header}>
          <p className={`${styles.chapter} micro`}>03 / {content.nav.work}</p>
          <h2 id="work-title" className={`${styles.heading} display`}>
            {content.work.heading}
          </h2>
          <p className={styles.headerNote}>{content.opening.tagline}</p>
        </header>

        <div className={styles.cases}>
          {content.work.projects.map((project, index) => (
            <article
              className={styles.case}
              data-project={project.id}
              id={`act-work-${project.id}`}
              aria-labelledby={`case-${project.id}`}
              key={project.id}
            >
              <figure className={styles.figure}>
                <div
                  className={styles.visual}
                  data-yuna-handoff-target={project.id === 'yuna' ? 'true' : undefined}
                >
                  <Media
                    item={projectMedia[project.id]}
                    locale={locale}
                    className={styles.projectImage}
                    compact
                    loading={project.id === 'yuna' ? 'eager' : undefined}
                    sizes="(max-width: 767px) 90vw, (max-width: 1199px) 46vw, 34vw"
                  />
                  <span className={styles.imageIndex} aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <figcaption className={styles.studyCaption}>
                  {content.a11y.directionStudy}
                </figcaption>
              </figure>

              <div className={styles.caseCopy}>
                <p className={`${styles.period} micro`}>
                  {project.place} <span aria-hidden="true">·</span> {project.period}
                </p>
                <h3
                  id={`case-${project.id}`}
                  className={`${styles.caseTitle} title`}
                  tabIndex={project.id === 'yuna' ? -1 : undefined}
                >
                  {project.name}
                </h3>

                <div className={styles.role}>
                  <span className={`${styles.label} micro`}>{content.work.caseLabels.role}</span>
                  <p>{project.role}</p>
                </div>

                <p className={styles.summary}>{project.summary}</p>

                <div className={styles.direction}>
                  <div>
                    <h4>{content.work.caseLabels.challenge}</h4>
                    <p>{project.caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4>{content.work.caseLabels.direction}</h4>
                    <p>{project.caseStudy.direction}</p>
                  </div>
                </div>

                <div className={styles.practice}>
                  <span className={`${styles.label} micro`}>{content.work.caseLabels.practice}</span>
                  <ul>
                    {project.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
