'use client';

import { useRef } from 'react';
import type { Content, WorkProject } from '@/content';
import type { Locale } from '@/content/locales';
import { comptoirMedia, mgcMedia, yunaMedia } from '@/content/media';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ, SCRUB } from '@/lib/motion';
import { registerVisualFilm } from '@/lib/visualQa';
import { Media } from '@/ui/Media';
import { EditorialZoom } from '@/ui/EditorialZoom';
import styles from './ProjectFeature.module.css';
import paper from './ActWork.module.css';

const photography = {
  yuna: { hero: yunaMedia[0]!, details: yunaMedia.slice(1) },
  mgc: { hero: mgcMedia[1]!, details: [mgcMedia[0]!, mgcMedia[3]!] },
  comptoir: { hero: comptoirMedia[1]!, details: [comptoirMedia[0]!] },
};

export function ProjectFeature({ project, content, locale, index }: {
  project: WorkProject; content: Content; locale: Locale; index: number;
}) {
  const root = useRef<HTMLElement>(null);
  const { hero, details } = photography[project.id];
  const labels = content.work.caseLabels;

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (context) => {
      if (context.conditions?.reduced) return;
      el.dataset.enhanced = 'true';
      const desktop = context.conditions?.desktop;
      const stage = q<HTMLElement>('[data-feature-stage]')[0]!;
      const photo = q<HTMLElement>('[data-feature-photo]')[0]!;
      const opening = q<HTMLElement>('[data-yuna-handoff]')[0];
      if (opening) {
        gsap.set(el, { autoAlpha: 0 });
        ScrollTrigger.create({ trigger: el, start: 'top top', end: 'bottom top',
          onEnter: () => gsap.set(el, { autoAlpha: 1 }),
          onEnterBack: () => gsap.set(el, { autoAlpha: 1 }),
          onLeaveBack: () => gsap.set(el, { autoAlpha: 0 }),
          onRefresh: (self) => gsap.set(el, { autoAlpha: self.scroll() >= self.start ? 1 : 0 }),
        });
      }
      // One physical gesture per chapter. No satellite images or drifting
      // copy: the middle 40% of the scene is a completely still reading plate.
      const tl = gsap.timeline({ scrollTrigger: {
        trigger: stage, start: 'top top', end: opening ? '+=190%' : '+=120%',
        pin: stage, scrub: SCRUB.narrative, invalidateOnRefresh: true,
      } });
      if (opening) {
        tl.to(opening, { clipPath: 'inset(0 0 100% 0)', duration: 0.28, ease: 'power2.inOut' }, 0.1);
      } else if (project.id === 'mgc') {
        tl.fromTo(photo, { yPercent: 12, clipPath: 'inset(18% 0 0 0)' },
          { yPercent: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.3, ease: 'power2.inOut' }, 0.06);
      } else {
        tl.fromTo(q('[data-feature-photo] img'), { scale: 1.35 },
          { scale: 1, duration: 0.32, ease: 'power2.inOut' }, 0.05);
      }
      tl.to(photo, { xPercent: desktop ? -3 : 0, scale: 0.96, duration: 0.2, ease: 'power2.inOut' }, 0.8)
        .to({}, { duration: 0.01 }, 0.99);
      const unregister = registerVisualFilm(`work-${project.id}`, tl, { entry: 0, reveal: 0.25, read: 0.6, spread: 1 });
      return () => { unregister(); delete el.dataset.enhanced; };
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className={styles.project} data-project={project.id} aria-labelledby={`${project.id}-title`}>
      <div className={styles.stage} data-feature-stage>
        {project.id === 'yuna' && (
          <div className={paper.yunaHandoff} data-yuna-handoff aria-hidden="true">
            <span className={`${paper.handoffIndex} micro`}>06 / Portfolio</span>
            <span className={`${paper.handoffTitle} display`}>{content.work.heading}</span>
            <span className={paper.handoffStatement}>{content.strategy.sentence}</span>
            <span className={paper.handoffRule} />
            <div className={paper.handoffProof}>
              <Media item={yunaMedia[0]!} locale={locale} sizes="(max-width: 1023px) 54vw, 29vw" />
              <span className={`${paper.handoffStamp} micro`}>Campaign / Yuna Bijoux</span>
              <span className={paper.handoffCrop} />
            </div>
          </div>
        )}
        <header className={`${styles.meta} micro`}>
          <span>06.{String(index + 1).padStart(2, '0')} / {content.work.heading}</span>
          <span>{project.place} · {project.period}</span>
        </header>
        <div className={styles.photo} data-feature-photo>
          <Media item={hero} locale={locale} compact sizes="(max-width: 1023px) 100vw, 75vw" />
        </div>
        <div className={styles.titleBlock}>
          <span className={`${styles.role} micro`}>{project.role}</span>
          <h3 id={`${project.id}-title`} className={styles.name}>{project.name}</h3>
        </div>
        <p className={styles.summary}>{project.summary}</p>
        <span className={styles.folio} aria-hidden="true">0{index + 1}</span>
        <p className={`${styles.note} micro`}>{labels.visualNote}</p>
      </div>

      <div className={styles.dossier} data-project-dossier>
        <div className={styles.dossierIntro}>
          <span className="micro">0{index + 1} / {labels.decision}</span>
          <p>{project.caseStudy.editorialDecision}</p>
        </div>
        <div className={styles.details}>
          {details.map((item) => (
            <EditorialZoom key={item.id} item={item} locale={locale} label={project.name}
              sizes="(max-width: 1023px) 90vw, 45vw" />
          ))}
        </div>
        <div className={styles.caseGrid}>
          {([
            [labels.challenge, project.caseStudy.challenge],
            [labels.direction, project.caseStudy.direction],
            [labels.outcome, project.caseStudy.outcome],
          ] as const).map(([label, copy], i) => (
            <article key={label}>
              <span className="micro">0{i + 1}</span>
              <h4 className="micro">{label}</h4>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className={styles.evidence}>
          <span className="micro">{labels.evidence}</span>
          {project.caseStudy.evidence.map((proof) => (
            <p key={proof.label}><strong>{proof.value}</strong><span>{proof.label}</span></p>
          ))}
        </div>
        <ul className={`${styles.skills} micro`}>{project.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </div>
    </section>
  );
}
