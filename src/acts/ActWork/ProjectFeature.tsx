'use client';

import { useRef } from 'react';
import type { Content, WorkProject } from '@/content';
import type { Locale } from '@/content/locales';
import { comptoirMedia, mgcMedia, yunaMedia } from '@/content/media';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ, SCRUB } from '@/lib/motion';
import { coverToSlot, type Box } from '@/lib/slotCrop';
import { registerVisualFilm } from '@/lib/visualQa';
import { Media } from '@/ui/Media';
import { EditorialZoom } from '@/ui/EditorialZoom';
import styles from './ProjectFeature.module.css';
import paper from './ActWork.module.css';

/* `subject`: where the photograph's subject sits in its cover box (0–1).
   The spread slot is cropped around it, so the page keeps the group at the
   wall (MGC) and the hands on the chocolate (Comptoir), not a blurred edge. */
const photography = {
  yuna: { hero: yunaMedia[0]!, details: yunaMedia.slice(1), subject: { x: 0.5, y: 0.5 } },
  mgc: { hero: mgcMedia[1]!, details: [mgcMedia[0]!, mgcMedia[3]!], subject: { x: 0.66, y: 0.5 } },
  comptoir: { hero: comptoirMedia[1]!, details: [comptoirMedia[0]!], subject: { x: 0.64, y: 0.5 } },
};

/* Beat map of a feature (fractions of its pinned scroll).
   0    → 0.30  entry. Yuna: the notebook print is lifted away. MGC and
                Comptoir arrive as the next page of the same magazine: their
                photograph lies in the left-page slot of a spread (the exact
                box the previous project was laid into) and lifts off the page
                to become the cover. One element, crop + transform only.
   0.30 → 0.52  still: the cover is read (title, summary, disclosure)
   0.52 → 0.80  the cover photograph is laid onto the left page of a spread,
                the right page opens on its gutter with the editorial decision
   0.80 → 1     still: the spread is read */
const BEAT = { read: 0.4, spreadFrom: 0.52, spreadTo: 0.8 } as const;

/** Layout box of `el` in `ancestor` coordinates, transforms ignored. */
function layoutBox(el: HTMLElement, ancestor: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export function ProjectFeature({ project, content, locale, index }: {
  project: WorkProject; content: Content; locale: Locale; index: number;
}) {
  const root = useRef<HTMLElement>(null);
  const { hero, details, subject } = photography[project.id];
  const labels = content.work.caseLabels;
  const folio = String(index + 1).padStart(2, '0');

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (context) => {
      if (context.conditions?.reduced) return;
      el.dataset.enhanced = 'true';
      const desktop = Boolean(context.conditions?.desktop);
      const stage = q<HTMLElement>('[data-feature-stage]')[0]!;
      const photo = q<HTMLElement>('[data-feature-photo]')[0]!;
      // The print's frame, not the <img>: on desktop the image carries a CSS
      // transform transition (hover zoom) that would drag behind the scrub.
      const frame = q<HTMLElement>('[data-feature-photo] [data-media]');
      const slot = q<HTMLElement>('[data-spread-slot]')[0]!;
      const desk = q<HTMLElement>('[data-spread-desk]')[0]!;
      const leaf = q<HTMLElement>('[data-spread-leaf]')[0]!;
      const pageLeft = q<HTMLElement>('[data-spread-left]')[0]!;
      const pageCopy = q<HTMLElement>('[data-spread-copy]');
      const cover = q<HTMLElement>('[data-cover-copy]');
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

      // Re-measured whenever a tween (re)initialises, i.e. after every
      // refresh: layout boxes ignore transforms, so the pin never skews them.
      const land = () => coverToSlot(layoutBox(photo, stage), layoutBox(slot, stage), subject);
      // Every project after the first opens out of the page slot.
      const fromPage = !opening;
      gsap.set(photo, { transformOrigin: '0 0', clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set([desk, pageLeft], { autoAlpha: fromPage ? 1 : 0 });
      if (fromPage) gsap.set(cover, { autoAlpha: 0, y: 16 });
      // The right page lies folded on the gutter: closed like a magazine.
      gsap.set(leaf, desktop
        ? { autoAlpha: 1, rotationY: -96, transformOrigin: 'left center', transformPerspective: 2200 }
        : { autoAlpha: 1, rotationX: 96, transformOrigin: 'center top', transformPerspective: 1600 });
      gsap.set(pageCopy, { autoAlpha: 0, y: 18 });

      const tl = gsap.timeline({ scrollTrigger: {
        trigger: stage, start: 'top top', end: opening ? '+=270%' : '+=210%',
        pin: stage, scrub: SCRUB.narrative, invalidateOnRefresh: true,
      } });

      // Every tween after the first states its from-values (and does not
      // render early): forward, reverse and a refresh mid-scroll replay the
      // same frames, never a start value recorded from an in-between state.
      const later = { immediateRender: false } as const;
      const cover0 = { x: 0, y: 0, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', '--veil': 1 };

      // 1. Entry.
      if (opening) {
        // The notebook's print is wiped away like a sheet lifted from a desk.
        tl.to(opening, { clipPath: 'inset(0 0 100% 0)', duration: 0.24, ease: 'power2.inOut' }, 0.06);
      } else {
        // The photograph scrolls in laid on the left page, then lifts off it
        // to its cover box while the page and desk fall away beneath it.
        tl.fromTo(photo, {
          x: () => land().x, y: () => land().y, scale: () => land().scale,
          clipPath: () => land().clipPath, '--veil': 0,
        }, { ...cover0, duration: 0.24, ease: 'power3.inOut' }, 0.04)
          .fromTo(pageLeft, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.08, ease: 'none', ...later }, 0.12)
          .fromTo(desk, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12, ease: 'none', ...later }, 0.14)
          .fromTo(cover, { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.07, stagger: 0.012, ease: 'power2.out', ...later }, 0.2);
        // Comptoir keeps its material accent: the print opens from a close
        // crop of the paper and chocolate to the full campaign frame.
        if (project.id === 'comptoir') {
          tl.fromTo(frame, { scale: 1.22 }, { scale: 1, duration: 0.26, ease: 'power2.out' }, 0.04);
        }
      }

      // 2. Cover → spread. The cover copy steps back, the desk dims, and the
      //    same photograph is laid on the left page (crop + transform only).
      const s = BEAT.spreadFrom;
      tl.fromTo(cover, { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -14, duration: 0.07, stagger: 0.012, ease: 'power1.in', ...later }, s)
        .fromTo(desk, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: 'none', ...later }, s)
        .fromTo(pageLeft, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, ease: 'none', ...later }, s + 0.08)
        .fromTo(photo, cover0, {
          x: () => land().x, y: () => land().y, scale: () => land().scale,
          clipPath: () => land().clipPath, '--veil': 0,
          duration: 0.16, ease: 'power3.inOut', ...later,
        }, s + 0.02)
        // 3. The right page opens on its gutter and carries the decision.
        .fromTo(leaf, desktop ? { rotationY: -96 } : { rotationX: 96 },
          { rotationY: 0, rotationX: 0, duration: 0.12, ease: 'power2.out', ...later }, s + 0.14)
        .fromTo(pageCopy, { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.015, ease: 'power2.out', ...later }, s + 0.2)
        .to({}, { duration: 1 - BEAT.spreadTo }, BEAT.spreadTo);

      const unregister = registerVisualFilm(`work-${project.id}`, tl, {
        entry: 0, reveal: 0.3, read: BEAT.read, spread: 0.9, end: 1,
      });
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
        <header className={`${styles.meta} micro`} data-cover-copy>
          <span>06.{folio} / {content.work.heading}</span>
          <span>{project.place} · {project.period}</span>
        </header>
        <div className={styles.photo} data-feature-photo>
          <Media item={hero} locale={locale} compact sizes="(max-width: 1023px) 100vw, 75vw" />
        </div>
        <div className={styles.titleBlock} data-cover-copy>
          <span className={`${styles.role} micro`}>{project.role}</span>
          <h3 id={`${project.id}-title`} className={styles.name}>{project.name}</h3>
        </div>
        <p className={styles.summary} data-cover-copy>{project.summary}</p>
        <span className={styles.folio} aria-hidden="true" data-cover-copy>{folio}</span>
        <p className={`${styles.note} micro`} data-cover-copy>{labels.visualNote}</p>

        {/* The spread: a dimmed desk, a left page that receives the cover
            photograph, and a right page folded on the gutter. Stacked by
            z-index; DOM order keeps cover copy first for reading. */}
        <span className={styles.desk} data-spread-desk aria-hidden="true" />
        <div className={styles.spread} data-spread>
          <div className={styles.pageLeft} data-spread-left aria-hidden="true">
            <span className={styles.slot} data-spread-slot />
            <span className={`${styles.pageFolio} micro`}>{labels.visualNote}</span>
          </div>
          <div className={styles.pageRight} data-spread-leaf>
            <span className={`${styles.pageLabel} micro`} data-spread-copy>{folio} / {labels.decision}</span>
            <p className={styles.decision} data-spread-copy>{project.caseStudy.editorialDecision}</p>
            <span className={`${styles.pageMeta} micro`} data-spread-copy aria-hidden="true">
              <span>{project.role}</span>
              <span>{project.name} · {project.place} · {project.period}</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.dossier} data-project-dossier>
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
