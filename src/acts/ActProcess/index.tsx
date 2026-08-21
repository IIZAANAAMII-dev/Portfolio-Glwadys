'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { contactSheet, yunaMedia } from '@/content/media';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActProcess.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

function prepareStageOwnership(root: HTMLElement, stage: HTMLElement) {
  gsap.set(stage, { autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom top',
    onEnter: () => gsap.set(stage, { autoAlpha: 1 }),
    onEnterBack: () => gsap.set(stage, { autoAlpha: 1 }),
    onLeaveBack: () => gsap.set(stage, { autoAlpha: 0 }),
    onRefresh: (self) => {
      gsap.set(stage, { autoAlpha: self.scroll() >= self.start ? 1 : 0 });
    },
  });
}

function ContactSheetRail({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      const railEl = rail.current;
      if (!rootEl || !stageEl || !railEl) return;
      const q = gsap.utils.selector(stageEl);

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          prepareStageOwnership(rootEl, stageEl);
          if (!isDesktop) return;

          const railItems = q<HTMLElement>('[data-sheet-item]');
          const handoff = q<HTMLElement>('[data-sheet-handoff]')[0];
          const handoffCopy = q<HTMLElement>('[data-sheet-handoff-copy]');
          if (!handoff) return;

          gsap.set(handoff, { clipPath: 'inset(0% 100% 0% 0%)' });
          gsap.set(handoffCopy, { autoAlpha: 0, y: 12 });

          gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: {
                trigger: rootEl,
                start: 'top top',
                end: () => scrollLength(SCROLL.contactSheet),
                pin: stageEl,
                scrub: SCRUB.rail,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
            .to(railEl, { x: () => -(railEl.scrollWidth - window.innerWidth), duration: 1 }, 0)
            .to(q<HTMLElement>('[data-sheet-copy]'), { autoAlpha: 0, y: -10, duration: 0.12 }, 0.8)
            .to(railItems, { autoAlpha: 0, yPercent: -5, stagger: 0.012, duration: 0.16 }, 0.81)
            .to(stageEl, { backgroundColor: 'var(--paper)', duration: 0.16 }, 0.8)
            .to(handoff, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.2 }, 0.78)
            .to(
              handoffCopy,
              { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.14 },
              0.84,
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.railSection} aria-labelledby="process-title">
      <div ref={stage} className={styles.stage}>
        <div data-sheet-copy>
          <span className={`${styles.kicker} micro`}>05 / {content.process.heading}</span>
          <h2 id="process-title" className={`${styles.sectionTitle} display`}>
            {content.process.sheet}
          </h2>
        </div>
        <div ref={rail} className={styles.rail}>
          {contactSheet.map((item, index) => (
            <figure className={styles.railItem} data-sheet-item key={item.id}>
              <span className={`${styles.railIndex} micro`}>{String(index + 1).padStart(2, '0')}</span>
              <Media item={item} locale={locale} index={index + 1} total={8} sizes="28vw" />
            </figure>
          ))}
        </div>
        <div className={styles.sheetHandoff} data-sheet-handoff aria-hidden="true">
          <span className={`${styles.kicker} micro`} data-sheet-handoff-copy>
            05.2 / {content.process.moodboard}
          </span>
          <div className={styles.systemTitleMask}>
            <span className={`${styles.systemTitle} display`} data-sheet-handoff-copy>
              {content.process.system}
            </span>
          </div>
          <p className={styles.systemManifesto} data-sheet-handoff-copy>
            {content.strategy.sentence}
          </p>
        </div>
        <span className={styles.railRule} aria-hidden="true" />
      </div>
    </section>
  );
}

function TokenArtifact({ index }: { index: number }) {
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
        {Array.from({ length: 7 }, (_, signalIndex) => (
          <i key={signalIndex} />
        ))}
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
      <i />
    </span>
  );
}

function MethodOpening({ content, locale }: Props) {
  return (
    <div className={styles.methodOpening} data-method-opening>
      <figure className={styles.methodPrimary} data-method-media>
        <Media item={contactSheet[0]!} locale={locale} sizes="24vw" />
        <figcaption className={`${styles.methodCaption} micro`}>01 / Mood &amp; intention</figcaption>
      </figure>

      <figure className={styles.methodSecondary} data-method-media>
        <Media item={contactSheet[2]!} locale={locale} compact sizes="14vw" />
        <figcaption className={`${styles.methodCaption} micro`}>02 / Notes &amp; structure</figcaption>
      </figure>

      <div className={styles.methodCopy} data-method-copy>
        <span className={`${styles.methodKicker} micro`}>05.3 / {content.strategy.heading}</span>
        <p className={styles.methodTitle}>{content.strategy.heading}</p>
        <p className={styles.methodStatement}>{content.strategy.sentence}</p>
      </div>

      <span className={`${styles.methodFolio} micro`} aria-hidden="true">
        Observe / Frame / Compose
      </span>
    </div>
  );
}

function BrandSystem({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;
      const q = gsap.utils.selector(stageEl);
      const items = q<HTMLElement>('[data-system-item]');
      const artifacts = q<HTMLElement>('[data-system-artifact]');
      const axes = q<HTMLElement>('[data-system-axis]');
      const title = q<HTMLElement>('[data-system-title]')[0];
      const manifesto = q<HTMLElement>('[data-system-manifesto]')[0];
      if (!title || !manifesto) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          prepareStageOwnership(rootEl, stageEl);

          gsap.set(title, { yPercent: 0 });
          gsap.set(manifesto, { autoAlpha: 1, yPercent: 0 });
          gsap.set(items, { autoAlpha: 0, yPercent: 20 });
          gsap.set(artifacts, { scale: 0.82, autoAlpha: 0 });
          gsap.set(axes, { scaleX: 0, transformOrigin: 'left center' });
          const methodHandoff = q<HTMLElement>('[data-brand-method-handoff]')[0];
          if (!methodHandoff) return;
          gsap.set(methodHandoff, { clipPath: 'inset(0% 100% 0% 0%)' });

          gsap
            .timeline({
              defaults: { ease: EASE.scrub },
              scrollTrigger: {
                trigger: rootEl,
                start: 'top top',
                end: () => scrollLength(SCROLL.moodboard, !isDesktop),
                pin: stageEl,
                scrub: SCRUB.narrative,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
            .to(axes, { scaleX: 1, stagger: 0.05, duration: 0.2 }, 0.12)
            .to(
              items,
              { autoAlpha: 1, yPercent: 0, stagger: 0.045, duration: 0.28 },
              0.16,
            )
            .to(
              artifacts,
              { autoAlpha: 1, scale: 1, stagger: 0.04, duration: 0.22 },
              0.28,
            )
            .to(items, { yPercent: (index: number) => (index % 2 === 0 ? -3 : 3), duration: 0.28 }, 0.58)
            .to(
              [...items, manifesto, title, ...q<HTMLElement>('[data-system-meta]')],
              { autoAlpha: 0.42, yPercent: -2, duration: 0.16 },
              0.84,
            )
            .to(stageEl, { backgroundColor: 'var(--ivory)', duration: 0.2 }, 0.76)
            .to(
              methodHandoff,
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.24 },
              0.74,
            );
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.systemSection} aria-labelledby="system-title">
      <div ref={stage} className={styles.systemStage}>
        <span className={styles.systemGhost} aria-hidden="true">
          05.2
        </span>
        <span className={`${styles.kicker} micro`} data-system-meta>
          05.2 / {content.process.moodboard}
        </span>
        <span className={`${styles.boardState} micro`} data-system-meta aria-hidden="true">
          {content.process.moodboard} → {content.process.system}
        </span>

        <div className={`${styles.systemTitleMask} line-mask`}>
          <h3 id="system-title" className={`${styles.systemTitle} display`} data-system-title>
            {content.process.system}
          </h3>
        </div>

        <p className={styles.systemManifesto} data-system-manifesto>
          {content.strategy.sentence}
        </p>

        <span className={styles.systemAxis} data-system-axis aria-hidden="true" />
        <div className={styles.board}>
          {content.process.systemTokens.map((token, index) => (
            <article className={styles.boardItem} data-system-item key={token}>
              <span className={`${styles.boardLabel} micro`}>{String(index + 1).padStart(2, '0')}</span>
              <TokenArtifact index={index} />
              <p className={styles.boardValue}>{token}</p>
            </article>
          ))}
        </div>

        <div
          className={styles.brandMethodHandoff}
          data-brand-method-handoff
          aria-hidden="true"
        >
          <MethodOpening content={content} locale={locale} />
        </div>

      </div>
    </section>
  );
}

function Strategy({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;
      const q = gsap.utils.selector(stageEl);
      const rows = q<HTMLElement>('[data-strategy-line]');
      const methodMedia = q<HTMLElement>('[data-method-media]');
      const campaign = q<HTMLElement>('[data-campaign-reveal]')[0];
      const strategyContent = q<HTMLElement>('[data-strategy-content]');
      const handoff = q<HTMLElement>('[data-work-handoff]');
      const handoffRule = q<HTMLElement>('[data-work-handoff-rule]')[0];
      const handoffPanel = q<HTMLElement>('[data-work-handoff-panel]')[0];
      if (!campaign || !handoffRule || !handoffPanel) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          prepareStageOwnership(rootEl, stageEl);

          gsap.set(rows, { autoAlpha: 0, y: 12, x: 0 });
          gsap.set(campaign, { clipPath: 'inset(100% 0% 0% 0%)', scale: 0.94 });
          gsap.set(handoffPanel, { clipPath: 'inset(0 100% 0 0)' });
          gsap.set(handoff, { autoAlpha: 0, y: 12 });
          gsap.set(handoffRule, { scaleY: 0, transformOrigin: 'center top' });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.strategy, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl
            .to(rows, { y: 0, autoAlpha: 0.72, stagger: 0.025, duration: 0.14 }, 0.03)
            .to(methodMedia.slice(0, 1), { yPercent: -3, scale: 1.018, duration: 0.68 }, 0)
            .to(methodMedia.slice(1, 2), { yPercent: 4, duration: 0.68 }, 0);

          const start = 0.12;
          const beat = 0.095;
          rows.forEach((row, index) => {
            const at = start + index * beat;
            const previousRow = rows[index - 1];
            if (previousRow) {
              tl.to(
                previousRow,
                { autoAlpha: 0.74, x: 0, color: 'var(--ink)', duration: 0.07 },
                at - 0.02,
              );
            }
            if (row) {
              tl.to(
                row,
                {
                  autoAlpha: 1,
                  x: isDesktop ? -6 : 0,
                  color: 'var(--rich-wine)',
                  duration: 0.08,
                },
                at,
              );
            }
          });

          tl
            .to(strategyContent, { autoAlpha: 0, yPercent: -3, duration: 0.14 }, 0.7)
            .to(stageEl, { backgroundColor: 'var(--wood-brown)', color: 'var(--ivory)', duration: 0.18 }, 0.71)
            .to(campaign, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.2 }, 0.74)
            .to(handoffPanel, { clipPath: 'inset(0 0% 0 0)', duration: 0.22 }, 0.77)
            .to(handoffRule, { scaleY: 1, duration: 0.15 }, 0.79)
            .to(handoff, { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.14 }, 0.8);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.strategySection} aria-labelledby="strategy-title">
      <div ref={stage} className={styles.stage}>
        <div className={styles.strategyContent} data-strategy-content>
          <h3 id="strategy-title" className="visually-hidden">
            {content.strategy.heading}
          </h3>

          <MethodOpening content={content} locale={locale} />

          <ol className={styles.strategyLine}>
            {content.strategy.steps.map((step, index) => (
              <li className={styles.strategyLineItem} data-strategy-line key={step.term}>
                <span className={`${styles.strategyIndex} micro`}>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step.term}</strong>
                <span className={styles.strategyNote}>{step.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.campaignReveal} data-campaign-reveal aria-hidden="true">
          <Media item={yunaMedia[0]!} locale={locale} sizes="26vw" />
        </div>

        <div className={styles.workHandoff} data-work-handoff-panel aria-hidden="true">
          <span className={`${styles.workIndex} micro`} data-work-handoff>
            06 / Portfolio
          </span>
          <h3 className={`${styles.workTitle} display`} data-work-handoff>
            {content.work.heading}
          </h3>
          <span className={styles.workRule} data-work-handoff-rule />
        </div>
      </div>
    </section>
  );
}

export function ActProcess(props: Props) {
  return (
    <div className={`act surface-paper ${styles.act}`}>
      <ContactSheetRail {...props} />
      <BrandSystem {...props} />
      <Strategy {...props} />
    </div>
  );
}
