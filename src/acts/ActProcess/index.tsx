'use client';

import { useRef, type CSSProperties } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { contactSheet, yunaMedia, type MediaItem } from '@/content/media';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ, SCRUB } from '@/lib/motion';
import { registerVisualFilm } from '@/lib/visualQa';
import { Media } from '@/ui/Media';
import { NotebookFrame } from '@/ui/NotebookFrame';

import styles from './ActProcess.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/**
 * ACTE 05 — LE CARNET (scène 4 « The Page Turn » → scène 5 « The Vault »).
 * docs/flagship/23-sonnet-cinematic-creative-treatment.md
 *
 * Le seul acte clair du film. Un livre relié, UN objet : la planche-contact
 * reçue de la chambre noire est la première page de droite. Chaque feuillet
 * tourne physiquement autour de la reliure (rotationY, perspective par
 * feuillet, recto/verso) ; son verso devient la page de gauche suivante.
 *
 *   Planche contact │ tirage retenu
 *   Intention       │ Système (cinq jetons)
 *   01 Audience     │ preuve 01
 *   …               │ …
 *   06 Campaign     │ Yuna — tirage collé dans la géométrie EXACTE de
 *                     `workProof`, puis la page s'ouvre en iris (circle)
 *                     depuis ce tirage sur la chambre forte sombre.
 *
 * Les anciennes scènes empilées (planche, intention, système, méthode,
 * couverture) et leurs doublons ont été fusionnées dans ce seul livre.
 */

/** Partition, en hauteurs de viewport de scroll. */
const P = {
  intro: 0.06,
  firstTurn: 0.95,
  step: 0.62,
  turn: 0.36,
  vault: 5.42,
  end: 6.3,
} as const;

const PROCESS_SCROLL_VH = P.end * 100;
const MOBILE_RATIO = 0.74;

type WorkMarkerStyle = CSSProperties & {
  '--work-marker-top': string;
  '--work-marker-mobile-top': string;
};

function markerStart(start: number, ratio: number) {
  return ((0.5 + start * ratio) / (1 + P.end * ratio)) * 100;
}

const workMarkerStyle: WorkMarkerStyle = {
  '--work-marker-top': `${markerStart(P.vault - 0.12, 1)}%`,
  '--work-marker-mobile-top': `${markerStart(P.vault - 0.12, MOBILE_RATIO)}%`,
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Annotations d'atelier (mise en scène, aucune donnée factuelle). */
const TABLE: Record<Locale, { prints: [string, string, string]; notes: [string, string, string]; swatches: string[] }> = {
  fr: {
    prints: ['Matière', 'Palette', 'Outils'],
    notes: ['lumière rasante, métal froid', 'ivoire, vin, champagne', 'cadrer serré, écrire court'],
    swatches: ['Ivoire', 'Encre', 'Vin', 'Argent', 'Champagne'],
  },
  en: {
    prints: ['Material', 'Palette', 'Tools'],
    notes: ['raking light, cool metal', 'ivory, wine, champagne', 'crop tight, write short'],
    swatches: ['Ivory', 'Ink', 'Wine', 'Silver', 'Champagne'],
  },
  ko: {
    prints: ['소재', '팔레트', '도구'],
    notes: ['낮게 스치는 빛, 차가운 금속', '아이보리, 와인, 샴페인', '좁게 자르고, 짧게 쓰기'],
    swatches: ['아이보리', '잉크', '와인', '실버', '샴페인'],
  },
};

/** Les trois tirages posés sur la page de gauche : bijou, planche, outils. */
const TABLE_PRINTS = [contactSheet[4]!, contactSheet[5]!, contactSheet[1]!] as const;

/** La preuve de chaque étape. La dernière est la campagne Yuna réelle. */
function evidenceFor(index: number, total: number): MediaItem {
  return index === total - 1 ? yunaMedia[0]! : contactSheet[(index + 4) % contactSheet.length]!;
}

function ReducedProcess({ content, locale }: Props) {
  return (
    <div className={styles.reducedProcess}>
      <article className={styles.reducedPanel}>
        <span className="micro">05 / {content.process.heading}</span>
        <h2 className="display">{content.process.sheet}</h2>
        <div className={styles.reducedMediaGrid}>
          {contactSheet.slice(0, 4).map((item) => (
            <Media item={item} locale={locale} compact sizes="38vw" key={item.id} />
          ))}
        </div>
      </article>

      <article className={styles.reducedPanel}>
        <span className="micro">05.2 / {content.process.moodboard}</span>
        <h2 className="display">{content.process.system}</h2>
        <p className="lead">{content.process.systemStatement}</p>
        <div className={styles.reducedSelected}>
          <Media item={contactSheet[0]!} locale={locale} compact sizes="38vw" />
        </div>
        <div className={styles.reducedTokens}>
          {content.process.systemTokens.map((token, index) => (
            <span key={token}>
              <small className="micro">0{index + 1}</small>
              {token}
            </span>
          ))}
        </div>
      </article>

      <article className={styles.reducedPanel}>
        <span className="micro">05.3 / {content.strategy.heading}</span>
        <ol className={styles.reducedMethod}>
          {content.strategy.steps.map((step, index) => (
            <li key={step.term}>
              <span className="micro">0{index + 1}</span>
              <strong>{step.term}</strong>
              <p>{step.note}</p>
            </li>
          ))}
        </ol>
      </article>

      <article className={`${styles.reducedPanel} ${styles.reducedSelection}`}>
        <span className="micro">06 / Portfolio</span>
        <h2 className="display">{content.work.heading}</h2>
        <div className={styles.reducedProof}>
          <Media item={yunaMedia[0]!} locale={locale} sizes="48vw" />
        </div>
      </article>
    </div>
  );
}

/** Spécimen du système : de la matière typographique, pas des cartes. */
function SystemSpecimen({ index }: { index: number }) {
  if (index === 0) return <span className={styles.specSwatches} aria-hidden="true"><i /><i /><i /></span>;
  if (index === 1) return <span className={styles.specType} aria-hidden="true">Aa</span>;
  if (index === 2) return <span className={styles.specTone} aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>;
  if (index === 3) return <span className={styles.specQuote} aria-hidden="true">“</span>;
  return <span className={styles.specCrop} aria-hidden="true" />;
}

export function ActProcess({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { process, strategy, work } = content;
  const steps = strategy.steps;
  const table = TABLE[locale];

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const one = <E extends HTMLElement>(selector: string): E | null => q<E>(selector)[0] ?? null;

      const entryImage = one('[data-notebook-frame="process"] [data-notebook-frame-image]');
      const entryFolio = one('[data-notebook-frame="process"] [data-notebook-folio]');
      const leaves = q<HTMLElement>('[data-leaf]');
      const workScene = one('[data-process-work]');
      const workProof = one('[data-work-proof]');
      const workRule = one('[data-work-rule]');
      if (!leaves.length || !workScene || !workProof || !workRule) return;

      const mm = gsap.matchMedia();
      mm.add({ isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced }, (context) => {
        const { isDesktop, isReduced } = context.conditions as { isDesktop: boolean; isReduced: boolean };
        if (isReduced) return;

        const baseBits = q<HTMLElement>('[data-base-bit]');
        const contactThumbs = q<HTMLElement>('[data-contact-thumb]');
        const leafIntro = q<HTMLElement>('[data-leaf="0"] [data-leaf-intro]');
        const leafFolio = one('[data-leaf-folio]');
        const sweep = one('[data-sweep]');
        const workCopy = q<HTMLElement>('[data-work-copy]');

        /* ---------- ÉTATS INITIAUX ----------
           Le feuillet 0 est le jumeau exact du NotebookFrame reçu : on retire
           l'original, le feuillet prend sa place sans un pixel d'écart. */
        gsap.set([entryImage, entryFolio], { autoAlpha: 0 });
        gsap.set(baseBits, { autoAlpha: 0, y: 14 });
        // Les tirages tombent sur la table : un léger vrillage qui se pose.
        gsap.set(contactThumbs, { autoAlpha: 0, yPercent: 18, rotation: (i: number) => [-5, 4, -3][i % 3] ?? 0 });
        gsap.set(leafIntro, { autoAlpha: 0, y: 12 });
        gsap.set(sweep, { autoAlpha: 0 });
        leaves.forEach((leaf, index) => {
          gsap.set(leaf, {
            zIndex: 50 - index,
            rotationY: 0,
            autoAlpha: 1,
            transformOrigin: 'left center',
            transformPerspective: isDesktop ? 2600 : 1600,
          });
        });
        gsap.set(q<HTMLElement>('[data-front-shade]'), { autoAlpha: 0 });
        gsap.set(q<HTMLElement>('[data-back-shade]'), { autoAlpha: 0.42 });
        gsap.set(q<HTMLElement>('[data-back-term]'), { autoAlpha: 0, yPercent: 26 });
        gsap.set(workScene, { clipPath: 'circle(0px at 50% 50%)' });
        gsap.set(workCopy, { autoAlpha: 0, y: 18 });
        gsap.set(workRule, { scaleY: 0, transformOrigin: 'center top' });

        const tl = gsap.timeline({
          defaults: { ease: 'none', overwrite: false },
          scrollTrigger: {
            trigger: rootEl,
            id: 'notebook-film',
            start: 'top top',
            end: `+=${Math.round(PROCESS_SCROLL_VH * (isDesktop ? 1 : MOBILE_RATIO))}%`,
            pin: stageEl,
            pinSpacing: true,
            scrub: SCRUB.narrative,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // La fin de Story et le début de ce pin partagent UN viewport.
        gsap.set(rootEl, { autoAlpha: 0 });
        ScrollTrigger.create({
          id: 'notebook-ownership', trigger: rootEl,
          start: 'top top', end: 'bottom top',
          onEnter: () => gsap.set(rootEl, { autoAlpha: 1 }),
          onEnterBack: () => gsap.set(rootEl, { autoAlpha: 1 }),
          onLeaveBack: () => gsap.set(rootEl, { autoAlpha: 0 }),
          onRefresh: (self) => gsap.set(rootEl, { autoAlpha: self.scroll() >= self.start ? 1 : 0 }),
        });

        /* ---- La planche s'écrit sur la page de gauche ---- */
        tl.addLabel('entry', 0)
          .to(baseBits, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }, P.intro)
          .to(contactThumbs, { autoAlpha: 1, yPercent: 0, rotation: 0, duration: 0.26, stagger: 0.05, ease: 'power3.out' }, P.intro + 0.14)
          .to(leafIntro, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.06, ease: 'power3.out' }, P.intro + 0.12);
        // Mobile : le titre de la planche prend la place du folio d'atelier.
        if (!isDesktop) tl.to(leafFolio, { autoAlpha: 0, duration: 0.12 }, P.intro);

        /* ---- Les feuillets tournent ----
           Desktop : vraie rotation 3D autour de la reliure ; le feuillet passe
           au-dessus de la pile au moment où il quitte la droite, son verso
           devient la page de gauche. Mobile (page unique) : le feuillet se
           détache vers la gauche et révèle le suivant. */
        leaves.slice(0, -1).forEach((leaf, index) => {
          const at = P.firstTurn + index * P.step;
          const frontShade = leaf.querySelector<HTMLElement>('[data-front-shade]');
          const backShade = leaf.querySelector<HTMLElement>('[data-back-shade]');
          const backTerm = leaf.querySelectorAll<HTMLElement>('[data-back-term]');
          tl.addLabel(`turn-${index + 1}`, at);
          if (isDesktop) {
            tl.set(leaf, { zIndex: 100 + index }, at)
              .to(leaf, { rotationY: -180, duration: P.turn, ease: 'power2.inOut' }, at)
              .to(frontShade, { autoAlpha: 0.5, duration: P.turn / 2, ease: 'power1.in' }, at)
              .to(backShade, { autoAlpha: 0, duration: P.turn / 2, ease: 'power1.out' }, at + P.turn / 2)
              .to(sweep, { autoAlpha: 0.32, duration: P.turn / 2, ease: 'power1.in' }, at)
              .to(sweep, { autoAlpha: 0, duration: P.turn / 2, ease: 'power1.out' }, at + P.turn / 2)
              .to(backTerm, { autoAlpha: 1, yPercent: 0, duration: 0.22, stagger: 0.05, ease: 'power3.out' }, at + P.turn * 0.72);
          } else {
            tl.to(leaf, { rotationY: -96, duration: P.turn, ease: 'power2.in' }, at)
              .to(frontShade, { autoAlpha: 0.55, duration: P.turn, ease: 'power1.in' }, at)
              .to(leaf, { autoAlpha: 0, duration: 0.08 }, at + P.turn - 0.08);
          }
        });

        /* ---- La chambre forte : l'iris s'ouvre depuis le tirage Yuna ----
           Le dernier tirage collé occupe la géométrie exacte de `workProof` :
           l'iris révèle donc la même image, au même endroit, sur fond sombre. */
        const proofCentre = () => ({
          x: workProof.offsetLeft + workProof.offsetWidth / 2,
          y: workProof.offsetTop + workProof.offsetHeight / 2,
        });
        const irisRadius = () => {
          const { x, y } = proofCentre();
          const w = stageEl.clientWidth;
          const h = stageEl.clientHeight;
          return Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
        };
        tl.addLabel('work', P.vault)
          .fromTo(workScene, {
            clipPath: () => { const { x, y } = proofCentre(); return `circle(0px at ${x}px ${y}px)`; },
          }, {
            clipPath: () => { const { x, y } = proofCentre(); return `circle(${irisRadius()}px at ${x}px ${y}px)`; },
            duration: 0.5,
            ease: 'power2.inOut',
            immediateRender: false,
          }, P.vault)
          .to(workRule, { scaleY: 1, duration: 0.24 }, P.vault + 0.3)
          .to(workCopy, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.26, ease: 'power3.out' }, P.vault + 0.34)
          .to({}, { duration: 0.01 }, P.end - 0.01);

        const turnState = (n: number) => P.firstTurn + (n - 1) * P.step + P.turn + 0.12;
        const unregisterQA = registerVisualFilm('notebook', tl, {
          entry: 0,
          sheet: 0.6,
          intention: turnState(1),
          method: turnState(2),
          decision: turnState(5),
          campaign: turnState(7),
          vault: P.vault + 0.3,
          selection: P.end - 0.09,
          seam: P.end,
        });
        return () => {
          unregisterQA();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  /* Contenu des feuillets. Recto = page de droite ; verso = page de gauche
     suivante. Sur mobile (page unique), le texte du recto est porté par
     `[data-mobile-text]` et le verso n'existe pas. */
  const backPages: Array<{ chapter: string; index?: string; term: string; note: string; hand?: string }> = [
    { chapter: `05.2 / ${process.moodboard}`, term: process.moodboard, note: process.intentionStatement, hand: process.choiceNote },
    ...steps.map((step, i) => ({
      chapter: `05.3 / ${strategy.heading}`,
      index: `${pad(i + 1)} / ${pad(steps.length)}`,
      term: step.term,
      note: step.note,
    })),
  ];
  const leafCount = 2 + steps.length;

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-label={process.heading}>
      <span id="act-work" className={styles.workMarker} style={workMarkerStyle} aria-hidden="true" />

      <div ref={stage} className={styles.stage}>
        <div className={styles.motionProcess}>
          {/* Le livre : le papier du NotebookFrame reçu est sa reliure. */}
          <NotebookFrame className={styles.entryPlate} locale={locale} marker="process" />

          {/* Page de gauche initiale (desktop) — la planche contact. */}
          <div className={styles.basePage}>
            <span className={`${styles.pageChapter} micro`} data-base-bit>05 / {process.heading}</span>
            <h2 className={styles.pageTitle} data-base-bit>{process.sheet}</h2>
            <p className={`${styles.pageNote} hand-note`} data-base-bit>{process.materialNote}</p>
            {/* La table : trois vrais tirages posés en quinconce, chacun
                annoté à l'encre, puis un nuancier de matière. */}
            <ol className={styles.table} aria-hidden="true">
              {TABLE_PRINTS.map((item, index) => (
                <li className={styles.tablePrint} data-contact-thumb data-print={index} key={item.id}>
                  <span className={styles.tape} />
                  <Media item={item} locale={locale} compact loading="eager" sizes="(max-width: 1023px) 10vw, 14vw" />
                  <span className={`${styles.printLabel} micro`}>{pad(index + 2)} · {table.prints[index]}</span>
                  <span className={`${styles.printNote} hand-note`}>{table.notes[index]}</span>
                </li>
              ))}
            </ol>
            <ul className={styles.swatches} data-base-bit aria-hidden="true">
              {table.swatches.map((name) => (
                <li key={name}><i />{name}</li>
              ))}
            </ul>
          </div>

          <span className={styles.sweep} data-sweep aria-hidden="true" />

          {/* ---------- LES FEUILLETS ---------- */}
          <div className={styles.leaves}>
            {Array.from({ length: leafCount }, (_, k) => {
              const back = backPages[k];
              const stepIndex = k - 2;
              const step = steps[stepIndex];
              return (
                <div className={styles.leaf} data-leaf={k} key={k}>
                  <div className={`${styles.face} ${styles.front}`}>
                    {k === 0 && (
                      <>
                        <figure className={styles.entryPrint}>
                          <Media item={contactSheet[0]!} locale={locale} compact loading="eager" sizes="(max-width: 1023px) 64vw, 28vw" />
                        </figure>
                        <span className={`${styles.entryFolio} micro`} data-leaf-folio>01 / ATELIER</span>
                        {/* Mobile : un second tirage glissé sur le coin du
                            premier — le bijou, légendé dans sa marge. */}
                        <figure className={styles.mobilePrint} data-leaf-intro aria-hidden="true">
                          <Media item={TABLE_PRINTS[0]} locale={locale} compact loading="eager" sizes="(max-width: 1023px) 34vw, 4vw" />
                          <figcaption className="micro">02 · {table.prints[0]}</figcaption>
                        </figure>
                        <div className={styles.mobileText} data-mobile-text>
                          <span className="micro" data-leaf-intro>05 / {process.heading}</span>
                          <h2 className={styles.mobileTitle} data-leaf-intro>{process.sheet}</h2>
                        </div>
                      </>
                    )}

                    {k === 1 && (
                      <div className={styles.systemPage}>
                        <span className={`${styles.pageChapter} micro`}>05.2 / {process.system}</span>
                        <p className={`${styles.mobileOnly} ${styles.mobileLead}`}>
                          <strong>{process.moodboard}.</strong> {process.intentionStatement}
                        </p>
                        <h3 className={styles.pageTitle}>{process.system}</h3>
                        <p className={styles.pageLead}>{process.systemStatement}</p>
                        <ol className={styles.specList}>
                          {process.systemTokens.map((token, index) => (
                            <li key={token}>
                              <span className="micro">{pad(index + 1)}</span>
                              <SystemSpecimen index={index} />
                              <strong>{token}</strong>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {step && (
                      <>
                        <div className={styles.mobileText}>
                          <span className="micro">05.3 / {strategy.heading} · {pad(stepIndex + 1)}/{pad(steps.length)}</span>
                          <h3 className={styles.mobileTitle}>{step.term}</h3>
                        </div>
                        <figure className={styles.evidence}>
                          <Media item={evidenceFor(stepIndex, steps.length)} locale={locale} sizes="(max-width: 1023px) 54vw, 29vw" />
                          <figcaption className={`${styles.evidenceStamp} micro`}>
                            {stepIndex === steps.length - 1 ? 'Campaign / Yuna Bijoux' : `${pad(stepIndex + 1)} / ${step.term}`}
                          </figcaption>
                          <span className={styles.evidenceCrop} aria-hidden="true" />
                        </figure>
                        <p className={`${styles.mobileOnly} ${styles.mobileNote}`}>{step.note}</p>
                      </>
                    )}
                    <span className={styles.frontShade} data-front-shade aria-hidden="true" />
                  </div>

                  {back && (
                    <div className={`${styles.face} ${styles.back}`}>
                      <span className={`${styles.pageChapter} micro`}>{back.chapter}</span>
                      {back.index && <span className={`${styles.backIndex} micro`}>{back.index}</span>}
                      <h3 className={styles.backTerm}>
                        <span className={styles.backMask}><span data-back-term>{back.term}</span></span>
                      </h3>
                      <p className={styles.backNote} data-back-term>{back.note}</p>
                      {back.hand && <p className={`${styles.backHand} hand-note`} data-back-term>{back.hand}</p>}
                      <span className={styles.backShade} data-back-shade aria-hidden="true" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ---------- 06 · LA CHAMBRE FORTE ---------- */}
          <div className={styles.workScene} data-process-work aria-hidden="true">
            <span className={`${styles.workIndex} micro`} data-work-copy>06 / Portfolio</span>
            <h3 className={`${styles.workTitle} display`} data-work-copy>{work.heading}</h3>
            <p className={styles.workStatement} data-work-copy>{strategy.sentence}</p>
            <span className={styles.workRule} data-work-rule />
            <div className={styles.workProof} data-work-proof>
              <Media item={yunaMedia[0]!} locale={locale} preload sizes="29vw" />
              <span className={`${styles.proofStamp} micro`}>Campaign / Yuna Bijoux</span>
              <span className={styles.proofCrop} />
            </div>
          </div>
        </div>

        <ReducedProcess content={content} locale={locale} />
      </div>
    </section>
  );
}
