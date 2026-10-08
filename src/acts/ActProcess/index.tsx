'use client';

import { useRef, type CSSProperties } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { contactSheet, ratioValue, yunaMedia } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { ArchivePlate } from '@/ui/ArchivePlate';
import { Media } from '@/ui/Media';

import styles from './ActProcess.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/** Une seule partition pour tout l'acte 05. Une unité = un viewport de scroll. */
const P = {
  entry: 0,
  contact: 0.12,
  intention: 1.05,
  system: 1.85,
  method: 2.65,
  work: 5.9,
  end: 6.35,
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
  '--work-marker-top': `${markerStart(P.work - 0.12, 1)}%`,
  '--work-marker-mobile-top': `${markerStart(P.work - 0.12, MOBILE_RATIO)}%`,
};

function TokenArtifact({ index, locale }: { index: number; locale: Locale }) {
  if (index === 0) {
    return (
      <span className={styles.swatches} data-system-artifact aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    );
  }

  if (index === 1) {
    return (
      <span className={styles.typeSpecimen} data-system-artifact aria-hidden="true">
        <strong>Aa</strong>
        <small>A—Z / 01—09</small>
      </span>
    );
  }

  if (index === 2) {
    return (
      <span className={styles.toneSignal} data-system-artifact aria-hidden="true">
        {Array.from({ length: 7 }, (_, signalIndex) => <i key={signalIndex} />)}
      </span>
    );
  }

  if (index === 3) {
    return (
      <span className={styles.quoteMark} data-system-artifact aria-hidden="true">
        “
      </span>
    );
  }

  return (
    <span className={styles.cropFrame} data-system-artifact aria-hidden="true">
      <Media item={contactSheet[0]!} locale={locale} compact sizes="(max-width: 1023px) 35vw, 15vw" />
      <i />
    </span>
  );
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
        <p className="lead">{content.strategy.sentence}</p>
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

export function ActProcess({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const contactRail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const railEl = contactRail.current;
      if (!rootEl || !stageEl || !railEl) return;

      const q = gsap.utils.selector(stageEl);
      const one = <T extends HTMLElement>(selector: string): T | null => q<T>(selector)[0] ?? null;
      const centre = (element: HTMLElement) => {
        let x = element.offsetWidth / 2;
        let y = element.offsetHeight / 2;
        let current: HTMLElement | null = element;
        while (current && current !== stageEl) {
          x += current.offsetLeft;
          y += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        return { x, y };
      };

      const entryPlate = one('[data-archive-plate="process-entry"]');
      const contactScene = one('[data-process-contact]');
      const contactCards = q<HTMLElement>('[data-contact-card]');
      const contactChrome = q<HTMLElement>('[data-contact-copy]');
      const intentionScene = one('[data-process-intention]');
      const intentionMedia = q<HTMLElement>('[data-intention-media]');
      const intentionCopy = q<HTMLElement>('[data-intention-copy]');
      const systemScene = one('[data-process-system]');
      const systemTokens = q<HTMLElement>('[data-system-token]');
      const systemArtifacts = q<HTMLElement>('[data-system-artifact]');
      const systemLines = q<HTMLElement>('[data-system-line]');
      const systemCopy = q<HTMLElement>('[data-system-copy]');
      const methodScene = one('[data-process-method]');
      const methodRows = q<HTMLElement>('[data-method-row]');
      const methodWords = q<HTMLElement>('[data-method-word]');
      const methodVisuals = q<HTMLElement>('[data-method-visual]');
      const finalMethodVisual = methodVisuals.at(-1) ?? null;
      const methodChrome = q<HTMLElement>('[data-method-copy]');
      const workScene = one('[data-process-work]');
      const workCopy = q<HTMLElement>('[data-work-copy]');
      const workProof = one('[data-work-proof]');
      const workRule = one('[data-work-rule]');

      if (!entryPlate || !contactScene || !intentionScene || !systemScene || !methodScene || !workScene || !workProof || !workRule) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as { isDesktop: boolean; isReduced: boolean };
          if (isReduced) return;

          gsap.set(entryPlate, { autoAlpha: 1 });
          gsap.set(contactCards, { autoAlpha: 0, scale: 0.96 });
          gsap.set(intentionScene, { autoAlpha: 0 });
          gsap.set(intentionMedia, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 });
          gsap.set(intentionCopy, { autoAlpha: 0, y: 12 });
          gsap.set(systemScene, { autoAlpha: 0, clipPath: 'inset(0% 100% 0% 0%)' });
          gsap.set(systemTokens, { autoAlpha: 0, yPercent: 16 });
          gsap.set(systemArtifacts, { autoAlpha: 0, scale: 0.82 });
          gsap.set(systemLines, { scaleX: 0, transformOrigin: 'left center' });
          gsap.set(systemCopy, { autoAlpha: 0, y: 12 });
          gsap.set(methodScene, { autoAlpha: 0 });
          gsap.set(methodRows, { autoAlpha: 0.8, x: 0 });
          gsap.set(methodWords, { autoAlpha: 0, yPercent: 12 });
          gsap.set(methodVisuals, { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)', scale: 1.04 });
          gsap.set(methodChrome, { autoAlpha: 0, y: 10 });
          gsap.set(workScene, { clipPath: 'inset(100% 0% 0% 0%)' });
          gsap.set(workCopy, { autoAlpha: 0, y: 18 });
          gsap.set(workProof, { autoAlpha: 0, y: 24, rotation: 1.8, scale: 0.96 });
          gsap.set(workRule, { scaleY: 0, transformOrigin: 'center top' });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: `+=${Math.round(PROCESS_SCROLL_VH * (isDesktop ? 1 : MOBILE_RATIO))}%`,
              pin: stageEl,
              pinSpacing: true,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => {
                railEl.style.willChange = isActive ? 'transform' : '';
              },
            },
          });

          tl.addLabel('contact', P.contact)
            .to(contactCards, { autoAlpha: 1, scale: 1, stagger: 0.035, duration: 0.18 }, P.entry + 0.02)
            .to(entryPlate, { autoAlpha: 0, duration: 0.12 }, P.entry + 0.08)
            .to(railEl, {
              x: isDesktop ? () => -(railEl.scrollWidth - window.innerWidth * 0.9) : 0,
              y: isDesktop ? 0 : () => -Math.max(0, railEl.scrollHeight - (railEl.parentElement?.clientHeight ?? 0)),
              duration: 0.76,
            }, P.contact)
            .to(contactChrome, { x: isDesktop ? -10 : 0, duration: 0.32 }, P.contact + 0.34)

            .addLabel('intention', P.intention)
            .to(contactCards, { autoAlpha: 0.14, scale: 0.76, stagger: 0.02, duration: 0.26 }, P.intention - 0.14)
            .to(contactChrome, { autoAlpha: 0, y: -10, duration: 0.18 }, P.intention - 0.1)
            .to(intentionScene, { autoAlpha: 1, duration: 0.12 }, P.intention - 0.08)
            .to(intentionMedia, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, stagger: 0.075, duration: 0.4 }, P.intention)
            .to(intentionCopy, { autoAlpha: 1, y: 0, stagger: 0.055, duration: 0.3 }, P.intention + 0.14)

            .addLabel('system', P.system)
            .to(intentionMedia, {
              x: () => {
                const target = systemArtifacts.at(-1);
                if (!target) return 0;
                return centre(target).x - centre(intentionMedia[0]!).x;
              },
              y: () => {
                const target = systemArtifacts.at(-1);
                if (!target) return 0;
                return centre(target).y - centre(intentionMedia[0]!).y;
              },
              scale: () => (systemArtifacts.at(-1)?.clientWidth ?? 100) / intentionMedia[0]!.offsetWidth,
              rotation: 1.4, autoAlpha: 0, duration: 0.34,
            }, P.system - 0.16)
            .to(intentionCopy, { autoAlpha: 0, y: -8, duration: 0.18 }, P.system - 0.12)
            .to(
              systemScene,
              { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.24 },
              P.system - 0.12,
            )
            .to(systemLines, { scaleX: 1, stagger: 0.04, duration: 0.24 }, P.system)
            .to(systemCopy, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.28 }, P.system + 0.04)
            .to(systemTokens, { autoAlpha: 1, yPercent: 0, stagger: 0.055, duration: 0.34 }, P.system + 0.1)
            .to(systemArtifacts, { autoAlpha: 1, scale: 1, stagger: 0.045, duration: 0.28 }, P.system + 0.2)

            .addLabel('method', P.method)
            .to(systemScene, { scale: isDesktop ? 0.58 : 0.7, xPercent: isDesktop ? -31 : -20, yPercent: -7, autoAlpha: 0.26, duration: 0.34 }, P.method - 0.16)
            .to(intentionScene, { autoAlpha: 0, duration: 0.2 }, P.method - 0.16)
            .to(contactScene, { autoAlpha: 0, duration: 0.16 }, P.method - 0.16)
            .to(methodScene, { autoAlpha: 1, duration: 0.14 }, P.method - 0.08)
            .to(methodChrome, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.24 }, P.method);

          const beat = 0.55;
          content.strategy.steps.forEach((_, index) => {
            const at = P.method + 0.12 + index * beat;
            const word = methodWords[index];
            const visual = methodVisuals[index];
            const row = methodRows[index];
            const previousWord = methodWords[index - 1];
            const previousVisual = methodVisuals[index - 1];
            const previousRow = methodRows[index - 1];

            if (previousWord) tl.to(previousWord, { autoAlpha: 0, yPercent: -10, duration: 0.08 }, at - 0.035);
            if (previousVisual) tl.to(previousVisual, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)', scale: 0.97, duration: 0.1 }, at - 0.035);
            if (previousRow) tl.to(previousRow, { autoAlpha: 0.8, x: 0, color: 'var(--ink)', duration: 0.08 }, at - 0.035);
            if (word) tl.to(word, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, at);
            if (visual) tl.to(visual, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.16 }, at);
            if (row) tl.to(row, { autoAlpha: 1, x: isDesktop ? -10 : 0, color: 'var(--rich-wine)', duration: 0.1 }, at);
          });

          if (finalMethodVisual) {
            const targetWidth = () => workProof.offsetWidth;
            const alignX = () => {
              return workProof.offsetLeft + workProof.offsetWidth / 2 - (finalMethodVisual.offsetLeft + finalMethodVisual.offsetWidth / 2);
            };
            const alignY = () => {
              return workProof.offsetTop + workProof.offsetHeight / 2 - (finalMethodVisual.offsetTop + finalMethodVisual.offsetHeight / 2);
            };
            tl.to(
              finalMethodVisual,
              {
                x: alignX,
                y: alignY,
                scale: () => targetWidth() / finalMethodVisual.offsetWidth,
                rotation: 0,
                duration: 0.24,
                ease: EASE.handoff,
              },
              P.work - 0.22,
            );
          }

          tl.addLabel('work', P.work)
            .to(workScene, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.32, ease: EASE.handoff }, P.work - 0.1)
            .to([methodScene, systemScene], { autoAlpha: 0, duration: 0.16 }, P.work + 0.02)
            .to(workRule, { scaleY: 1, duration: 0.2 }, P.work)
            .to(workCopy, { autoAlpha: 1, y: 0, stagger: 0.045, duration: 0.24 }, P.work + 0.02)
            .to(workProof, { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: 0.24 }, P.work - 0.01)
            .to({}, { duration: 0.01 }, P.end - 0.01);

          return () => {
            railEl.style.willChange = '';
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-labelledby="process-title">
      <span id="act-work" className={styles.workMarker} style={workMarkerStyle} aria-hidden="true" />

      <div ref={stage} className={styles.stage}>
        <div className={styles.motionProcess}>
          <ArchivePlate className={styles.entryPlate} locale={locale} marker="process-entry" />

          <div className={styles.contactScene} data-process-contact>
            <div className={styles.processChrome} data-contact-copy>
              <span className="micro">05 / {content.process.heading}</span>
              <span className={`${styles.processSequence} micro`} aria-hidden="true">
                {content.process.sheet} → {content.process.moodboard} → {content.process.system} → {content.strategy.heading}
              </span>
            </div>
            <h2 id="process-title" className={`${styles.contactTitle} display`} data-contact-copy>{content.process.sheet}</h2>
            <span className={`${styles.contactNote} hand-note`} data-contact-copy aria-hidden="true">la matière brute / avant le choix</span>
            <div className={styles.contactRailViewport}>
            <div ref={contactRail} className={styles.contactRail}>
              {contactSheet.map((item, index) => (
                <figure className={styles.contactCard} data-contact-card key={item.id}>
                  <span className={`${styles.contactIndex} micro`}>{String(index + 1).padStart(2, '0')}</span>
                  <Media item={item} locale={locale} compact sizes="27vw" />
                  <figcaption className="micro">{item.role}</figcaption>
                </figure>
              ))}
            </div>
            </div>
            <span className={styles.contactRule} data-contact-copy aria-hidden="true" />
          </div>

          <div className={styles.intentionScene} data-process-intention>
            <span className={`${styles.sceneChapter} micro`} data-intention-copy>05.2 / {content.process.moodboard}</span>
            <h3 className={`${styles.intentionTitle} display`} data-intention-copy>{content.process.moodboard}</h3>
            <p className={styles.intentionStatement} data-intention-copy>{content.strategy.sentence}</p>
            <span className={`${styles.intentionNote} hand-note`} data-intention-copy aria-hidden="true">un tirage retenu / le reste recule</span>
            <figure className={styles.intentionMedia} data-intention-media>
              <Media item={contactSheet[0]!} locale={locale} compact sizes="42vw" />
              <figcaption className="micro">Selected 01 / {contactSheet[0]!.role}</figcaption>
              <span className={styles.intentionCrop} aria-hidden="true" />
            </figure>
            <span className={styles.intentionAxis} data-intention-copy aria-hidden="true" />
          </div>

          <div className={styles.systemScene} data-process-system>
            <span className={`${styles.sceneChapter} micro`} data-system-copy>05.2 / {content.process.moodboard} → {content.process.system}</span>
            <h3 className={`${styles.systemTitle} display`} data-system-copy>{content.process.system}</h3>
            <p className={styles.systemStatement} data-system-copy>{content.strategy.sentence}</p>
            <span className={styles.systemLine} data-system-line aria-hidden="true" />
            <div className={styles.systemBoard}>
              {content.process.systemTokens.map((token, index) => (
                <article className={styles.systemToken} data-system-token key={token}>
                  <span className={`${styles.tokenIndex} micro`}>{String(index + 1).padStart(2, '0')}</span>
                  <TokenArtifact index={index} locale={locale} />
                  <p>{token}</p>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.methodScene} data-process-method>
            <span className={`${styles.sceneChapter} micro`} data-method-copy>05.3 / {content.strategy.heading}</span>
            <span className={`${styles.methodCounter} micro`} data-method-copy aria-hidden="true">Direction → décision → campagne</span>
            <div className={styles.methodWords} aria-hidden="true">
              {content.strategy.steps.map((step, index) => (
                <span data-method-word key={step.term}><small>0{index + 1}</small>{step.term}</span>
              ))}
            </div>
            <div className={styles.methodVisuals} aria-hidden="true">
              {content.strategy.steps.map((step, index) => (
                <figure data-method-visual key={`visual-${step.term}`} style={{ '--evidence-ratio': ratioValue[(index === content.strategy.steps.length - 1 ? yunaMedia[0]! : contactSheet[index % contactSheet.length]!).ratio] } as CSSProperties}>
                  <Media
                    item={index === content.strategy.steps.length - 1 ? yunaMedia[0]! : contactSheet[index % contactSheet.length]!}
                    locale={locale}
                    compact
                    sizes="28vw"
                  />
                  <figcaption>
                    <span className="micro">0{index + 1} / {index === content.strategy.steps.length - 1 ? 'Campaign · Yuna' : 'Evidence'}</span>
                    <strong>{step.term}</strong>
                  </figcaption>
                </figure>
              ))}
            </div>
            <ol className={styles.methodList}>
              {content.strategy.steps.map((step, index) => (
                <li data-method-row key={step.term}>
                  <span className="micro">0{index + 1}</span>
                  <strong>{step.term}</strong>
                  <p>{step.note}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.workScene} data-process-work aria-hidden="true">
            <span className={`${styles.workIndex} micro`} data-work-copy>06 / Portfolio</span>
            <h3 className={`${styles.workTitle} display`} data-work-copy>{content.work.heading}</h3>
            <p className={styles.workStatement} data-work-copy>{content.strategy.sentence}</p>
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
