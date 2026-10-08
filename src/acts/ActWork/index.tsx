'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import {
  comptoirMedia,
  comptoirTexture,
  mgcMedia,
  yunaMedia,
  yunaShared,
} from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { EditorialZoom } from '@/ui/EditorialZoom';
import { Media } from '@/ui/Media';

import styles from './ActWork.module.css';
import { WorkJourneyBridge } from './WorkJourneyBridge';

interface Props {
  content: Content;
  locale: Locale;
}

type Project = Content['work']['projects'][number];
type CaseLabels = Content['work']['caseLabels'];

function ProjectSection({
  project,
  locale,
  labels,
  index,
  handoff,
}: {
  project: Project;
  locale: Locale;
  labels: CaseLabels;
  index: number;
  handoff: { title: string; sentence: string };
}) {
  const root = useRef<HTMLElement>(null);
  const media =
    project.id === 'yuna'
      ? [...yunaMedia, yunaShared]
      : project.id === 'mgc'
        ? mgcMedia
        : comptoirMedia;

  useGSAP(
    () => {
      const rootEl = root.current;
      if (!rootEl) return;
      const q = gsap.utils.selector(rootEl);
      const visual = q<HTMLElement>('[data-project-visual]')[0];
      const dossier = q<HTMLElement>('[data-project-dossier]')[0];
      if (!visual || !dossier) return;
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isReduced } = context.conditions as { isReduced: boolean };
          if (isReduced) return;

          const mediaEls = q<HTMLElement>('[data-project-media]');
          const animatedEls = [
            ...mediaEls,
            ...q<HTMLElement>('[data-project-name], [data-project-copy]'),
          ];
          gsap.set(mediaEls, {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            yPercent: 12,
          });

          if (project.id === 'mgc') {
            gsap.set(mediaEls, {
              rotation: (mediaIndex: number) => [-3.2, 2.4, -4.4, 3.1, -1.8][mediaIndex] ?? 0,
              xPercent: (mediaIndex: number) => [-4, 5, -3, 4, 0][mediaIndex] ?? 0,
              yPercent: (mediaIndex: number) => [10, 17, 8, 14, 11][mediaIndex] ?? 12,
            });
          }

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: visual,
              start: 'top 82%',
              end: 'bottom 18%',
              scrub: SCRUB.narrative,
              onToggle: ({ isActive }) => {
                gsap.set(animatedEls, { willChange: isActive ? 'transform, opacity' : 'auto' });
              },
            },
          });

          tl.fromTo(
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

          const primaryMedia = mediaEls[0];
          if (project.id === 'yuna' && primaryMedia) {
            tl.fromTo(
                q<HTMLElement>('[data-yuna-sweep]'),
                { xPercent: -135, autoAlpha: 0 },
                { xPercent: 135, autoAlpha: 0.72, duration: 0.48 },
                0.34,
              );
            // Le dernier cadrage de la stratégie et le premier de Yuna
            // partagent leur géométrie. La page tourne autour du même visuel.
            gsap.fromTo(q<HTMLElement>('[data-yuna-handoff]'),
              { clipPath: 'inset(0 0 0 0)' },
              { clipPath: 'inset(0 0 100% 0)', ease: EASE.scrub,
                scrollTrigger: { trigger: visual, start: 'top top', end: '+=65%', pin: visual, anticipatePin: 1,
                  scrub: SCRUB.narrative, invalidateOnRefresh: true } },
            );
          }

          if (project.id === 'mgc') {
            tl.to(
              mediaEls,
              { rotation: 0, xPercent: 0, yPercent: 0, stagger: 0.025, duration: 0.28 },
              0.52,
            );
          }

          if (project.id === 'comptoir') {
            tl.fromTo(
              q<HTMLElement>('[data-comptoir-macro]'),
              { scale: 1 },
              { scale: 1.18, duration: 1 },
              0,
            ).to(q<HTMLElement>('[data-project-name]'), { yPercent: -12, duration: 1 }, 0);
          }

          const dossierTl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: dossier,
              start: 'top 82%',
              end: 'bottom 64%',
              scrub: SCRUB.narrative,
            },
          });

          dossierTl
            .fromTo(
              q<HTMLElement>('[data-case-heading]'),
              { yPercent: 55, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.24 },
              0,
            )
            .fromTo(
              q<HTMLElement>('[data-case-row]'),
              { yPercent: 18, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, stagger: 0.08, duration: 0.42 },
              0.12,
            )
            .fromTo(
              q<HTMLElement>('[data-case-proof]'),
              { xPercent: -5, autoAlpha: 0 },
              { xPercent: 0, autoAlpha: 1, stagger: 0.05, duration: 0.32 },
              0.54,
            );
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.project} data-project={project.id} aria-labelledby={`${project.id}-title`}>
      <div className={styles.projectVisual} data-project-visual>
        {project.id === 'yuna' && (
          <div className={styles.yunaHandoff} data-yuna-handoff aria-hidden="true">
            <span className={`${styles.handoffIndex} micro`}>06 / Portfolio</span>
            <span className={`${styles.handoffTitle} display`}>{handoff.title}</span>
            <span className={styles.handoffStatement}>{handoff.sentence}</span>
            <span className={styles.handoffRule} />
            <div className={styles.handoffProof}>
              <Media item={yunaMedia[0]!} locale={locale} sizes="(max-width: 1023px) 54vw, 29vw" />
              <span className={`${styles.handoffStamp} micro`}>Campaign / Yuna Bijoux</span>
              <span className={styles.handoffCrop} />
            </div>
          </div>
        )}
        {project.id === 'comptoir' && (
          <div className={styles.macro} data-comptoir-macro>
            <Media item={comptoirTexture} locale={locale} className="fill-frame" sizes="(max-width: 1023px) 180svh, 100vw" />
          </div>
        )}

        {project.id === 'yuna' && <span className={styles.yunaSweep} data-yuna-sweep aria-hidden="true" />}

        <div className={`${styles.meta} micro`}>
          <span>{project.role}</span>
          <span>{project.place}</span>
          <span>{project.period}</span>
        </div>
        <span className={`${styles.chapterTab} micro`} aria-hidden="true">
          File / {project.id}
        </span>

        <h3 id={`${project.id}-title`} className={`${styles.name} display`} data-project-name>
          {project.name}
        </h3>
        <p className={`${styles.summary} lead`} data-project-copy>
          {project.summary}
        </p>

        {project.id !== 'comptoir' &&
          media.map((item, mediaIndex) => (
            <div
              className={styles.media}
              data-project-media
              data-project-slot={mediaIndex + 1}
              key={item.id}
            >
              {mediaIndex === 0 ? (
                <EditorialZoom
                  item={item}
                  locale={locale}
                  label={project.caseStudy.evidence[0]?.label ?? project.name}
                  sizes="(max-width: 1023px) 65vw, 32vw"
                />
              ) : (
                <Media item={item} locale={locale} compact sizes="(max-width: 1023px) 65vw, 32vw" />
              )}
            </div>
          ))}

        {project.id === 'comptoir' && (
          <div className={styles.comptoirMedia} data-project-media>
            {media.map((item, mediaIndex) => (
              <div key={item.id}>
                {mediaIndex === 1 ? (
                  <EditorialZoom
                    item={item}
                    locale={locale}
                    label={project.caseStudy.evidence[1]?.label ?? project.name}
                    sizes="(max-width: 1023px) 70vw, 22vw"
                  />
                ) : (
                  <Media item={item} locale={locale} compact sizes="(max-width: 1023px) 70vw, 22vw" />
                )}
              </div>
            ))}
          </div>
        )}

        <ul className={`${styles.skills} micro`}>
          {project.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <p className={`${styles.visualNote} micro`}>{labels.visualNote}</p>
      </div>

      <div className={styles.dossier} data-project-dossier>
        <div className={styles.dossierHeading} data-case-heading>
          <span className="micro">Case / {String(index + 1).padStart(2, '0')}</span>
          <span className={`${styles.dossierName} display`}>{project.name}</span>
        </div>

        <div className={styles.editorialDecision} data-case-row>
          <h4 className="micro">{labels.decision}</h4>
          <p>{project.caseStudy.editorialDecision}</p>
        </div>

        <div className={styles.caseGrid}>
          {(
            [
              [labels.challenge, project.caseStudy.challenge],
              [labels.direction, project.caseStudy.direction],
              [labels.outcome, project.caseStudy.outcome],
            ] as const
          ).map(([label, copy], rowIndex) => (
            <article className={styles.caseRow} data-case-row key={label}>
              <span className={`${styles.caseNumber} micro`}>0{rowIndex + 1}</span>
              <h4 className={`${styles.caseLabel} micro`}>{label}</h4>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className={styles.proofRail}>
          <span className={`${styles.proofLabel} micro`}>{labels.evidence}</span>
          {project.caseStudy.evidence.map((proof) => (
            <div className={styles.proof} data-case-proof key={`${proof.value}-${proof.label}`}>
              <strong>{proof.value}</strong>
              <span className="micro">{proof.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActWork({ content, locale }: Props) {
  return (
    <div className={styles.act} aria-labelledby="work-title">
      <h2 id="work-title" className="visually-hidden">{content.work.heading}</h2>
      {content.work.projects.map((project, index) => (
        <ProjectSection
          project={project}
          locale={locale}
          labels={content.work.caseLabels}
          index={index}
          handoff={{ title: content.work.heading, sentence: content.strategy.sentence }}
          key={project.id}
        />
      ))}
      <WorkJourneyBridge content={content} locale={locale} />
    </div>
  );
}
