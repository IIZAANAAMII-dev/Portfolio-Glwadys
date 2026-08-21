'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { heroVertical, phoneFeed, phoneStory, socialPortal } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCROLL, SCRUB, scrollLength } from '@/lib/motion';
import { Media } from '@/ui/Media';

import styles from './ActPhone.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function ActPhone({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

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

          const device = q<HTMLElement>('[data-phone]')[0];
          const screen = q<HTMLElement>('[data-phone-screen]')[0];
          const hero = q<HTMLElement>('[data-phone-hero]')[0];
          const feed = q<HTMLElement>('[data-phone-feed]')[0];
          const focus = q<HTMLElement>('[data-phone-focus]')[0];
          const story = q<HTMLElement>('[data-phone-story]')[0];
          const campaign = q<HTMLElement>('[data-phone-campaign]')[0];
          const portal = q<HTMLElement>('[data-phone-portal]')[0];
          const portalPlane = q<HTMLElement>('[data-phone-portal-plane]')[0];
          if (
            !device ||
            !screen ||
            !hero ||
            !feed ||
            !focus ||
            !story ||
            !campaign ||
            !portal ||
            !portalPlane
          ) {
            return;
          }

          const beats = q<HTMLElement>('[data-phone-beat]');
          const railItems = q<HTMLElement>('[data-phone-rail-item]');
          const entries = q<HTMLElement>('[data-phone-entry]');
          const details = q<HTMLElement>('[data-phone-detail]');
          const interfaceEls = q<HTMLElement>('[data-phone-interface]');

          const portalInset = () => {
            const stageRect = stageEl.getBoundingClientRect();
            const screenRect = screen.getBoundingClientRect();
            const top = Math.max(0, screenRect.top - stageRect.top);
            const right = Math.max(0, stageRect.right - screenRect.right);
            const bottom = Math.max(0, stageRect.bottom - screenRect.bottom);
            const left = Math.max(0, screenRect.left - stageRect.left);
            const radius = isDesktop ? 34 : 30;
            return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
          };

          const screenGeometry = () => {
            const stageRect = stageEl.getBoundingClientRect();
            const screenRect = screen.getBoundingClientRect();
            return {
              top: screenRect.top - stageRect.top,
              left: screenRect.left - stageRect.left,
              width: screenRect.width,
              height: screenRect.height,
            };
          };

          const portalPlaneStart = () => {
            const frame = screenGeometry();
            const height = frame.height;
            const width = height * (16 / 9);
            return {
              top: frame.top,
              left: frame.left + (frame.width - width) * 0.32,
              width,
              height,
            };
          };

          const portalPlaneEnd = () => {
            const widthFromHeight = stageEl.clientHeight * (16 / 9);
            const width = Math.max(stageEl.clientWidth, widthFromHeight);
            const height = width * (9 / 16);
            return {
              top: (stageEl.clientHeight - height) * 0.5,
              left: (stageEl.clientWidth - width) * 0.32,
              width,
              height,
            };
          };

          gsap.set(device, {
            '--phone-bezel': '0px',
            '--phone-radius': '0px',
            '--phone-island': '0px',
            aspectRatio: '9 / 16',
          });
          gsap.set(entries, { autoAlpha: 0, y: -10 });
          gsap.set(details, { autoAlpha: 0, y: 12 });
          gsap.set(beats, { yPercent: 110, autoAlpha: 0 });
          gsap.set(railItems, { autoAlpha: 0.28 });
          gsap.set(feed, { yPercent: 105 });
          gsap.set([focus, story, campaign], { clipPath: 'inset(100% 0% 0% 0%)' });
          gsap.set(portal, { autoAlpha: 0, clipPath: 'inset(50% 50% 50% 50%)' });
          gsap.set(q<HTMLElement>('[data-phone-meter]'), { scaleY: 0 });

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.phone, !isDesktop),
              pin: stageEl,
              scrub: SCRUB.narrative,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const showBeat = (index: number, at: number) => {
            const beat = beats[index];
            const railItem = railItems[index];
            if (!beat || !railItem) return;
            tl.to(beat, { yPercent: 0, autoAlpha: 1, duration: 0.075 }, at)
              .to(railItem, { autoAlpha: 1, color: 'var(--rich-wine)', duration: 0.075 }, at)
              .to(beat, { yPercent: -110, autoAlpha: 0, duration: 0.07 }, at + 0.14)
              .to(railItem, { autoAlpha: 0.28, color: 'var(--ink)', duration: 0.07 }, at + 0.14);
          };

          tl
            .to(entries, { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.1 }, 0.015)
            .to(details, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.12 }, 0.07)
            .to(
              device,
              {
                '--phone-bezel': isDesktop ? '10px' : '8px',
                '--phone-radius': isDesktop ? '44px' : '38px',
                '--phone-island': isDesktop ? '88px' : '72px',
                aspectRatio: '9 / 19.5',
                duration: 0.16,
              },
              0,
            )
            .to(q<HTMLElement>('[data-phone-button]'), { scaleY: 1, duration: 0.12 }, 0.035)
            .to(q<HTMLElement>('[data-phone-meter]'), { scaleY: 1, duration: 0.92 }, 0.04)
            .to(hero, { yPercent: -101, duration: 0.13 }, 0.18)
            .to(feed, { yPercent: 0, duration: 0.13 }, 0.18)
            .to(feed, { yPercent: -25, duration: 0.15 }, 0.28)
            .to(focus, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.13 }, 0.38)
            .to(q<HTMLElement>('[data-focus-image]'), { scale: 1.055, duration: 0.14 }, 0.4)
            .to(story, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14 }, 0.51)
            .to(q<HTMLElement>('[data-story-image]'), { scale: 1.04, duration: 0.15 }, 0.53)
            .to(campaign, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14 }, 0.64)
            .to(q<HTMLElement>('[data-campaign-image]'), { scale: 1.035, duration: 0.14 }, 0.66)
            .set(portal, { clipPath: portalInset }, 0.735)
            .set(
              portalPlane,
              {
                top: () => portalPlaneEnd().top,
                left: () => portalPlaneEnd().left,
                width: () => portalPlaneEnd().width,
                height: () => portalPlaneEnd().height,
                x: () => portalPlaneStart().left - portalPlaneEnd().left,
                y: () => portalPlaneStart().top - portalPlaneEnd().top,
                scale: () => portalPlaneStart().width / portalPlaneEnd().width,
                transformOrigin: 'left top',
              },
              0.735,
            )
            .to(portal, { autoAlpha: 1, duration: 0.035 }, 0.735)
            .to(interfaceEls, { autoAlpha: 0, yPercent: -5, duration: 0.12 }, 0.77)
            .to(
              portal,
              {
                clipPath: 'inset(0px 0px 0px 0px round 0px)',
                duration: 0.22,
              },
              0.78,
            )
            .to(
              portalPlane,
              {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.205,
              },
              0.755,
            )
            .to(device, { autoAlpha: 0, scale: 0.985, duration: 0.1 }, 0.82)
            .to(q<HTMLElement>('[data-portal-meta]'), { autoAlpha: 1, y: 0, duration: 0.1 }, 0.84)
            .to(q<HTMLElement>('[data-portal-meta]'), { autoAlpha: 0, y: -8, duration: 0.08 }, 0.94);

          showBeat(0, 0.08);
          showBeat(1, 0.29);
          showBeat(2, 0.47);
          showBeat(3, 0.63);
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`act surface-paper ${styles.act}`} aria-labelledby="phone-title">
      <div ref={stage} className={styles.stage}>
        <h2 id="phone-title" className="visually-hidden">
          {content.phone.heading}
        </h2>

        <div className={styles.interface} data-phone-interface>
          <span className={`${styles.chapter} micro`} data-phone-entry>
            03 / {content.phone.heading}
          </span>
          <span className={`${styles.counter} micro`} data-phone-entry>
            09 : 16 / 04 beats
          </span>
          <p className={`${styles.note} lead`} data-phone-detail>
            {content.social.statement}
          </p>

          <div className={styles.beat} aria-hidden="true">
            {content.phone.beats.map((beat) => (
              <span className="line-mask" key={beat}>
                <span data-phone-beat>{beat}</span>
              </span>
            ))}
          </div>

          <ol className={styles.sequenceRail} data-phone-detail aria-hidden="true">
            {content.phone.beats.map((beat, index) => (
              <li data-phone-rail-item key={beat}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {beat}
              </li>
            ))}
          </ol>

          <span className={styles.progressTrack} data-phone-detail aria-hidden="true">
            <span data-phone-meter />
          </span>
        </div>

        <span className={styles.contextWord} data-phone-entry aria-hidden="true">
          {content.phone.heading}
        </span>

        <div className={styles.device} data-phone>
          <span className={styles.sideButton} data-phone-button data-side="left" />
          <span className={styles.sideButton} data-phone-button data-side="right" />
          <span className={styles.island} aria-hidden="true" />

          <div className={styles.screen} data-phone-screen>
            <div className={styles.phoneChrome} data-phone-detail aria-hidden="true">
              <span>09:41</span>
              <span>GD — Studio</span>
              <span>•••</span>
            </div>

            <div className={styles.screenHero} data-phone-hero>
              <Media
                item={heroVertical}
                locale={locale}
                className={styles.fillMedia}
                sizes="28vw"
                preload={false}
              />
            </div>

            <div className={styles.feed} data-phone-feed>
              <span className={`${styles.feedTitle} micro`}>Selected / Content</span>
              {phoneFeed.concat(phoneFeed).map((item, index) => (
                <div className={styles.feedItem} key={`${item.id}-${index}`}>
                  <Media item={item} locale={locale} compact sizes="12vw" />
                </div>
              ))}
            </div>

            <div className={styles.focus} data-phone-focus>
              <div className={styles.layerImage} data-focus-image>
                <Media item={phoneFeed[2]!} locale={locale} className={styles.fillMedia} sizes="28vw" />
              </div>
              <span className={`${styles.screenCaption} micro`}>Focus / Direction</span>
            </div>

            <div className={styles.story} data-phone-story>
              <div className={styles.layerImage} data-story-image>
                <Media item={phoneStory} locale={locale} className={styles.fillMedia} sizes="28vw" />
              </div>
              <span className={styles.storyProgress} aria-hidden="true" />
              <span className={`${styles.screenCaption} micro`}>Story / Marseille</span>
            </div>

            <div className={styles.campaign} data-phone-campaign>
              <div className={styles.layerImage} data-campaign-image>
                <Media item={socialPortal} locale={locale} className={styles.fillMedia} sizes="32vw" />
              </div>
              <span className={styles.campaignWord}>{content.phone.beats[3]}</span>
              <span className={`${styles.screenCaption} micro`}>04 / Full campaign</span>
            </div>

            <span className={styles.reflection} data-phone-detail aria-hidden="true" />
          </div>
        </div>

        <div className={styles.portal} data-phone-portal aria-hidden="true">
          <div className={styles.portalPlane} data-phone-portal-plane>
            <Media
              item={socialPortal}
              locale={locale}
              className={styles.portalMedia}
              sizes="100vw"
            />
          </div>
          <span className={styles.portalShade} />
          <span className={`${styles.portalMeta} micro`} data-portal-meta>
            03 → 04 / Enter the archive
          </span>
        </div>
      </div>
    </section>
  );
}
