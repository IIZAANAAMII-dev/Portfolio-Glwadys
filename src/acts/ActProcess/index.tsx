'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { contactSheet, yunaMedia } from '@/content/media';
import { Flip, gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { DUR, EASE, MQ, SCROLL, SCRUB, STAGGER, scrollLength } from '@/lib/motion';
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

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (!isDesktop || isReduced) return;

          gsap.to(railEl, {
            x: () => -(railEl.scrollWidth - window.innerWidth),
            ease: EASE.scrub,
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.contactSheet),
              pin: stageEl,
              scrub: SCRUB.rail,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.railSection} aria-labelledby="process-title">
      <div ref={stage} className={styles.stage}>
        <span className={`${styles.kicker} micro`}>05 / {content.process.heading}</span>
        <h2 id="process-title" className={`${styles.sectionTitle} display`}>
          {content.process.sheet}
        </h2>
        <div ref={rail} className={styles.rail}>
          {contactSheet.map((item, index) => (
            <div className={styles.railItem} key={item.id}>
              <span className={`${styles.railIndex} micro`}>{String(index + 1).padStart(2, '0')}</span>
              <Media item={item} locale={locale} index={index + 1} total={8} sizes="28vw" />
            </div>
          ))}
        </div>
        <span className={styles.railRule} aria-hidden="true" />
      </div>
    </section>
  );
}

function BrandSystem({ content }: Pick<Props, 'content'>) {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const rootEl = root.current;
      const boardEl = board.current;
      if (!rootEl || !boardEl || !contextSafe) return;

      const items = Array.from(boardEl.querySelectorAll<HTMLElement>('[data-system-item]'));
      const flipTo = contextSafe((mode: 'chaos' | 'order') => {
        if (boardEl.dataset.mode === mode) return;
        const state = Flip.getState(items);
        boardEl.dataset.mode = mode;
        requestAnimationFrame(() => {
          Flip.from(state, {
            duration: DUR.cinematic,
            ease: EASE.editorial,
            absolute: false,
            scale: true,
            stagger: STAGGER.tight,
          });
        });
      });

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (!isDesktop || isReduced) {
            boardEl.dataset.mode = 'order';
            return;
          }

          ScrollTrigger.create({
            trigger: rootEl,
            start: 'top 42%',
            end: 'bottom 58%',
            onEnter: () => flipTo('order'),
            onEnterBack: () => flipTo('order'),
            onLeaveBack: () => flipTo('chaos'),
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.systemSection} aria-labelledby="system-title">
      <div className={styles.sticky}>
        <span className={`${styles.kicker} micro`}>05.2 / {content.process.moodboard}</span>
        <span className={`${styles.boardState} micro`} aria-hidden="true">
          Loose notes → refined system
        </span>
        <h3 id="system-title" className={`${styles.sectionTitle} display`}>
          {content.process.system}
        </h3>
        <div ref={board} className={styles.board} data-mode="chaos">
          {content.process.systemTokens.map((token, index) => (
            <article className={styles.boardItem} data-system-item key={token}>
              <span className={`${styles.boardLabel} micro`}>{String(index + 1).padStart(2, '0')}</span>
              {index === 0 && (
                <div className={styles.swatches} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <p className={styles.boardValue}>{token}</p>
            </article>
          ))}
        </div>
        <p className={`${styles.systemStatement} hand-note`}>{content.strategy.sentence}</p>
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
      const lineItems = q<HTMLElement>('[data-strategy-line]');
      const reveal = q<HTMLElement>('[data-campaign-reveal]')[0];

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isDesktop, isReduced } = context.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };
          if (isReduced) return;

          gsap.set(words, { yPercent: 115, autoAlpha: 0 });
          if (words[0]) {
            gsap.set(words[0], { yPercent: 0, autoAlpha: 1 });
          }
          gsap.set(lineItems, { yPercent: 40, autoAlpha: 0 });

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

          const beat = 1 / content.strategy.steps.length;
          words.forEach((word, index) => {
            const at = index * beat;
            const lineItem = lineItems[index];
            if (index > 0) {
              tl.to(word, { yPercent: 0, autoAlpha: 1, duration: beat * 0.42 }, at);
            }
            tl.to(word, { yPercent: -110, autoAlpha: 0, duration: beat * 0.36 }, at + beat * 0.5);
            if (lineItem) {
              tl.to(
                lineItem,
                { yPercent: 0, autoAlpha: 1, duration: beat * 0.3 },
                at + beat * 0.62,
              );
            }
          });

          if (reveal) {
            tl.to(
              reveal,
              { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', duration: 0.14 },
              0.86,
            )
              .to(
                [...words, ...lineItems, ...q<HTMLElement>(`.${styles.kicker}`)],
                { autoAlpha: 0, yPercent: -16, duration: 0.1 },
                0.9,
              )
              .to(
                stageEl,
                { backgroundColor: 'var(--wood-brown)', color: 'var(--ivory)', duration: 0.1 },
                0.9,
              );
          }
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.strategySection} aria-labelledby="strategy-title">
      <div ref={stage} className={styles.stage}>
        <span className={`${styles.kicker} micro`}>05.3 / {content.strategy.heading}</span>
        <h3 id="strategy-title" className="visually-hidden">
          {content.strategy.heading}
        </h3>

        <div className={styles.strategyWords} aria-hidden="true">
          {content.strategy.steps.map((step) => (
            <span className={styles.strategyWord} data-strategy-word key={step.term}>
              {step.term}
            </span>
          ))}
        </div>

        <div className={styles.campaignReveal} data-campaign-reveal>
          <Media item={yunaMedia[0]!} locale={locale} sizes="26vw" />
        </div>

        <ol className={styles.strategyLine}>
          {content.strategy.steps.map((step, index) => (
            <li className={`${styles.strategyLineItem} micro`} data-strategy-line key={step.term}>
              {String(index + 1).padStart(2, '0')} · {step.term}
              <span className={styles.strategyNote}>{step.note}</span>
            </li>
          ))}
        </ol>
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
