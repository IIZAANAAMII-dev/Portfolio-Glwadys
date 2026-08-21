'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { contactSheet, yunaMedia } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActProcess.module.css';

interface Props {
  content: Content;
  locale: Locale;
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
          if (!isDesktop || isReduced) return;

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
            .to(q<HTMLElement>('[data-sheet-copy]'), { autoAlpha: 0, y: -10, duration: 0.1 }, 0.88)
            .to(stageEl, { backgroundColor: 'var(--paper)', duration: 0.12 }, 0.88);
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
            <figure className={styles.railItem} key={item.id}>
              <span className={`${styles.railIndex} micro`}>{String(index + 1).padStart(2, '0')}</span>
              <Media item={item} locale={locale} index={index + 1} total={8} sizes="28vw" />
            </figure>
          ))}
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

function BrandSystem({ content }: Pick<Props, 'content'>) {
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

          gsap.set(title, { yPercent: 112 });
          gsap.set(manifesto, { autoAlpha: 0, yPercent: 24 });
          gsap.set(items, { autoAlpha: 0, yPercent: 20 });
          gsap.set(artifacts, { scale: 0.82, autoAlpha: 0 });
          gsap.set(axes, { scaleX: 0, transformOrigin: 'left center' });

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
            .to(title, { yPercent: 0, duration: 0.16 }, 0.04)
            .to(manifesto, { autoAlpha: 1, yPercent: 0, duration: 0.2 }, 0.12)
            .to(axes, { scaleX: 1, stagger: 0.05, duration: 0.2 }, 0.2)
            .to(
              items,
              { autoAlpha: 1, yPercent: 0, stagger: 0.045, duration: 0.28 },
              0.22,
            )
            .to(
              artifacts,
              { autoAlpha: 1, scale: 1, stagger: 0.04, duration: 0.22 },
              0.34,
            )
            .to(items, { yPercent: (index: number) => (index % 2 === 0 ? -3 : 3), duration: 0.28 }, 0.58)
            .to(
              [...items, manifesto, title, ...q<HTMLElement>('[data-system-meta]')],
              { autoAlpha: 0, yPercent: -8, duration: 0.16 },
              0.84,
            )
            .to(stageEl, { backgroundColor: 'var(--ivory)', duration: 0.16 }, 0.82);
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
      const words = q<HTMLElement>('[data-strategy-word]');
      const rows = q<HTMLElement>('[data-strategy-line]');
      const campaign = q<HTMLElement>('[data-campaign-reveal]')[0];
      const strategyContent = q<HTMLElement>('[data-strategy-content]');
      const handoff = q<HTMLElement>('[data-work-handoff]');
      const handoffRule = q<HTMLElement>('[data-work-handoff-rule]')[0];
      if (!campaign || !handoffRule) return;

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          gsap.set(words, { yPercent: 110, autoAlpha: 0 });
          gsap.set(rows, { autoAlpha: 0.38, x: 0 });
          gsap.set(campaign, { clipPath: 'inset(100% 0% 0% 0%)', scale: 0.94 });
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

          const start = 0.05;
          const beat = 0.105;
          words.forEach((word, index) => {
            const at = start + index * beat;
            const row = rows[index];
            if (index > 0 && words[index - 1]) {
              tl.to(words[index - 1]!, { yPercent: -105, autoAlpha: 0, duration: 0.055 }, at - 0.025);
            }
            tl.to(word, { yPercent: 0, autoAlpha: 1, duration: 0.07 }, at);
            if (row) {
              tl.to(row, { autoAlpha: 1, x: isDesktop ? -10 : 0, color: 'var(--rich-wine)', duration: 0.07 }, at);
              if (index < rows.length - 1) {
                tl.to(row, { autoAlpha: 0.42, x: 0, color: 'var(--ink)', duration: 0.06 }, at + 0.075);
              }
            }
          });

          tl
            .to(strategyContent, { autoAlpha: 0, yPercent: -6, duration: 0.14 }, 0.72)
            .to(stageEl, { backgroundColor: 'var(--wood-brown)', color: 'var(--ivory)', duration: 0.17 }, 0.73)
            .to(campaign, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.18 }, 0.76)
            .to(handoffRule, { scaleY: 1, duration: 0.14 }, 0.8)
            .to(handoff, { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.14 }, 0.81);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.strategySection} aria-labelledby="strategy-title">
      <div ref={stage} className={styles.stage}>
        <div data-strategy-content>
          <span className={`${styles.kicker} micro`}>05.3 / {content.strategy.heading}</span>
          <h3 id="strategy-title" className="visually-hidden">
            {content.strategy.heading}
          </h3>

          <div className={styles.strategyWords} aria-hidden="true">
            {content.strategy.steps.map((step, index) => (
              <span className={styles.strategyWord} data-strategy-word key={step.term}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                {step.term}
              </span>
            ))}
          </div>

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

        <div className={styles.workHandoff} aria-hidden="true">
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
      <BrandSystem content={props.content} />
      <Strategy {...props} />
    </div>
  );
}
