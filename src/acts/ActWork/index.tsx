'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import {
  comptoirMedia,
  comptoirTexture,
  mgcMedia,
  mgcShared,
  yunaMedia,
  yunaShared,
} from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActWork.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

type Project = Content['work']['projects'][number];

function ProjectSection({ project, locale }: { project: Project; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const media =
    project.id === 'yuna'
      ? [...yunaMedia, yunaShared]
      : project.id === 'mgc'
        ? [...mgcMedia, mgcShared]
        : comptoirMedia;

  useGSAP(
    () => {
      const rootEl = root.current;
      if (!rootEl) return;
      const q = gsap.utils.selector(rootEl);
      const mm = gsap.matchMedia();

      mm.add(
        { isReduced: MQ.reduced },
        (context) => {
          const { isReduced } = context.conditions as { isReduced: boolean };
          if (isReduced) return;

          const mediaEls = q<HTMLElement>('[data-project-media]');
          gsap.set(mediaEls, {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            yPercent: 12,
          });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 82%',
              end: 'bottom 28%',
              scrub: SCRUB.narrative,
            },
          });

          tl
            .fromTo(
              q<HTMLElement>('[data-project-name]'),
              { yPercent: 38, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.22 },
              0,
            )
            .to(
              mediaEls,
              {
                clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
                yPercent: 0,
                stagger: project.id === 'mgc' ? 0.04 : 0.07,
                duration: 0.3,
              },
              0.08,
            )
            .fromTo(
              q<HTMLElement>('[data-project-copy]'),
              { yPercent: 12, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.2 },
              0.23,
            );

          if (project.id === 'mgc') {
            tl.to(mediaEls, { rotation: 0, xPercent: 0, yPercent: 0, stagger: 0.025, duration: 0.28 }, 0.52);
          }

          if (project.id === 'comptoir') {
            tl.fromTo(
              q<HTMLElement>('[data-comptoir-macro]'),
              { scale: 1 },
              { scale: 1.18, duration: 1 },
              0,
            ).to(q<HTMLElement>('[data-project-name]'), { yPercent: -12, duration: 1 }, 0);
          }
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.project} data-project={project.id} aria-labelledby={`${project.id}-title`}>
      {project.id === 'comptoir' && (
        <div className={styles.macro} data-comptoir-macro>
          <Media item={comptoirTexture} locale={locale} className="fill-frame" sizes="100vw" />
        </div>
      )}

      <div className={`${styles.meta} micro`}>
        <span>{project.role}</span>
        <span>{project.place}</span>
        <span>{project.period}</span>
      </div>

      <h3 id={`${project.id}-title`} className={`${styles.name} display`} data-project-name>
        {project.name}
      </h3>
      <p className={`${styles.summary} lead`} data-project-copy>
        {project.summary}
      </p>

      {project.id !== 'comptoir' &&
        media.map((item) => (
          <div className={styles.media} data-project-media key={item.id}>
            <Media item={item} locale={locale} compact sizes="32vw" />
          </div>
        ))}

      {project.id === 'mgc' && (
        <span className={styles.annotation} aria-hidden="true">
          Community first
        </span>
      )}

      {project.id === 'comptoir' && (
        <div className={styles.comptoirMedia} data-project-media>
          {media.map((item) => (
            <div key={item.id}>
              <Media item={item} locale={locale} compact sizes="22vw" />
            </div>
          ))}
        </div>
      )}

      <ul className={`${styles.skills} micro`}>
        {project.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export function ActWork({ content, locale }: Props) {
  return (
    <div className={styles.act}>
      <header className={styles.workHeader}>
        <span className={`${styles.workIndex} micro`}>06 / Portfolio</span>
        <h2 className={`${styles.workTitle} display`}>{content.work.heading}</h2>
      </header>
      {content.work.projects.map((project) => (
        <ProjectSection project={project} locale={locale} key={project.id} />
      ))}
    </div>
  );
}
