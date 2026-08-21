'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { behindMedia, depthMedia, heroFrame, heroVertical, openingMedia, phoneFeed, phoneStory, socialPortal, socialSatellites } from '@/content/media';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { DUR, EASE, MQ, SCROLL, SCRUB, STAGGER, scrollLength } from '@/lib/motion';
import { emitReady, lockScroll, unlockScroll } from '@/lib/scrollControl';
import { Media } from '@/ui/Media';

import styles from './ActScrollStory.module.css';
import { Gallery3D } from './Gallery3D';

interface Props {
  content: Content;
  locale: Locale;
}

function placeAt(el: HTMLElement, left: number, top: number, scale: number) {
  const rect = el.getBoundingClientRect();
  gsap.set(el, { x: left - rect.left, y: top - rect.top, scale });
}

export function ActScrollStory({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const galleryProgressRef = useRef<number>(0);

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const first = q<HTMLElement>(`.${styles.nameFirst}`)[0];
      const last = q<HTMLElement>(`.${styles.nameLast}`)[0];
      const tagline = q<HTMLElement>(`.${styles.tagline}`)[0];
      const spread = q<HTMLElement>(`.${styles.spread}`)[0];
      const openingFrame = q<HTMLElement>(`[data-opening-frame]`)[0];
      if (!first || !last || !tagline || !spread || !openingFrame) return;

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (ctx) => {
          const { isDesktop, isReduced } = ctx.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };

          const lines = q<HTMLElement>('.line-mask > *');
          const metas = q<HTMLElement>('[data-meta]');
          const nameLines = q<HTMLElement>('[data-name-line]');
          const notebookDetails = q<HTMLElement>('[data-notebook-detail]');
          const ruleH = q<HTMLElement>(`.${styles.ruleH}`)[0];
          const ruleV = q<HTMLElement>(`.${styles.ruleV}`)[0];
          const disciplines = q<HTMLElement>(`.${styles.disciplines}`)[0];
          const heroFrameEl = q<HTMLElement>(`.${styles.heroFrame}`)[0];
          const device = q<HTMLElement>(`.${styles.device}`)[0];
          const screen = q<HTMLElement>(`.${styles.screen}`)[0];
          const bgSocial = q<HTMLElement>(`.${styles.bgSocial}`)[0];
          const bgPhone = q<HTMLElement>(`.${styles.bgPhone}`)[0];
          const behind = q<HTMLElement>(`.${styles.behind}`)[0];
          const behindMediaEls = q<HTMLElement>('[data-behind-media]');
          const behindDetails = q<HTMLElement>('[data-behind-detail]');
          const behindCopy = q<HTMLElement>('[data-behind-copy]');
          const frontCopy = q<HTMLElement>('[data-front-copy]')[0];
          const satellites = q<HTMLElement>('[data-social-satellite]');
          if (
            !ruleH ||
            !ruleV ||
            !disciplines ||
            !heroFrameEl ||
            !device ||
            !screen ||
            !bgSocial ||
            !bgPhone ||
            !behind ||
            !frontCopy ||
            !satellites.length
          ) {
            return;
          }

          /* ---------- REDUCED MOTION ---------- */
          if (isReduced) {
            gsap.set([...lines], { yPercent: 0 });
            gsap.set(notebookDetails, { autoAlpha: 1, y: 0 });
            gsap.set([first, last, tagline, disciplines, metas, spread, heroFrameEl, device], { autoAlpha: 1 });
            gsap.set([device, screen], { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1 });
            emitReady();
            return;
          }

          lockScroll();

          /* ---------- ÉTAT D'OUVERTURE ---------- */
          const stageRect = stageEl.getBoundingClientRect();
          const cx = stageRect.left + stageRect.width / 2;
          const cy = stageRect.top + stageRect.height / 2;
          const NAME_SCALE = isDesktop ? 0.42 : 0.62;

          const firstRect = first.getBoundingClientRect();
          const lastRect = last.getBoundingClientRect();
          const firstH = firstRect.height * NAME_SCALE;
          const gap = firstH * 0.04;

          placeAt(first, cx - (firstRect.width * NAME_SCALE) / 2, cy - firstH - gap, NAME_SCALE);
          placeAt(last, cx - (lastRect.width * NAME_SCALE) / 2, cy + gap, NAME_SCALE);

          gsap.set([first, last], { letterSpacing: '0.3em' });
          gsap.set(last, { color: 'var(--ivory)' });

          const taglineRect = tagline.getBoundingClientRect();
          placeAt(tagline, cx - taglineRect.width / 2, cy + firstH * 2 + firstH * 0.55, 1);
          gsap.set(tagline, { autoAlpha: 0 });

          gsap.set(ruleH, { scaleX: 0 });
          gsap.set(ruleV, { scaleY: 0, autoAlpha: 0 });
          gsap.set(nameLines, { yPercent: 112 });
          gsap.set(metas, { autoAlpha: 0 });
          gsap.set(disciplines, { autoAlpha: 0 });
          gsap.set(notebookDetails, { autoAlpha: 0, y: 14 });
          gsap.set(spread, { autoAlpha: 0, scale: 0.82, rotation: -1.2 });
          gsap.set(openingFrame, { autoAlpha: 0, scaleX: 0.16, scaleY: 0.72 });

          gsap.set(screen, {
            xPercent: isDesktop ? -62 : 0,
            yPercent: isDesktop ? 8 : 14,
            scale: 0.82,
            autoAlpha: 0,
            clipPath: 'inset(100% 0 0 0)',
          });
          gsap.set(heroFrameEl, {
            xPercent: isDesktop ? -78 : 0,
            yPercent: isDesktop ? -18 : 16,
            scale: 0.85,
            autoAlpha: 0,
            clipPath: 'inset(100% 0 0 0)',
          });

          const transientEls = q<HTMLElement>(`.${styles.transient}`);
          gsap.set(transientEls, { autoAlpha: 0, scale: 0.9, clipPath: 'inset(100% 0 0 0)' });

          /* ---------- SCROLL STORY — ÉTATS INITIAUX ---------- */
          gsap.set(bgSocial, { autoAlpha: 0 });
          gsap.set(bgPhone, { autoAlpha: 0 });
          gsap.set(behind, { clipPath: 'inset(0% 0% 0% 100%)' });
          gsap.set(behindMediaEls, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 8 });
          gsap.set([...behindDetails, ...behindCopy], { autoAlpha: 0, y: 14 });

          gsap.set(satellites, { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)', yPercent: 14 });
          gsap.set(frontCopy, { autoAlpha: 0, yPercent: 10 });

          // Le device contient le média heroVertical partagé.
          const heroFromLeft = isDesktop ? '65%' : 'auto';
          const heroFromTop = isDesktop ? '25%' : '36%';
          const heroFromRight = isDesktop ? 'auto' : 'var(--margin)';
          const heroWidth = isDesktop ? '18vw' : '44vw';

          gsap.set(device, {
            left: heroFromLeft,
            right: heroFromRight,
            top: heroFromTop,
            width: heroWidth,
            padding: 0,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderRadius: 0,
            '--device-ar': '9 / 16',
            autoAlpha: 1,
          });

          // UI phone masquée en amont du phone.
          const phoneInterface = q<HTMLElement>('[data-phone-interface]')[0]!;
          const phoneEntries = q<HTMLElement>('[data-phone-entry]');
          const phoneDetails = q<HTMLElement>('[data-phone-detail]');
          const phoneBeats = q<HTMLElement>('[data-phone-beat]');
          const phoneRailItems = q<HTMLElement>('[data-phone-rail-item]');
          const phoneButtons = q<HTMLElement>('[data-phone-button]');
          const phoneIsland = q<HTMLElement>(`.${styles.island}`)[0]!;
          const phoneChrome = q<HTMLElement>(`.${styles.phoneChrome}`)[0]!;
          const feed = q<HTMLElement>(`.${styles.feed}`)[0];
          const focus = q<HTMLElement>(`.${styles.focus}`)[0];
          const story = q<HTMLElement>(`.${styles.story}`)[0];
          const campaign = q<HTMLElement>(`.${styles.campaign}`)[0];
          const contextWord = q<HTMLElement>(`.${styles.contextWord}`)[0];
          const screenHero = q<HTMLElement>('[data-screen-hero]')[0];
          // L'interface reste visible ; on anime l'opacité de chaque élément.
          if (phoneInterface) gsap.set(phoneInterface, { autoAlpha: 1 });
          if (contextWord) gsap.set(contextWord, { autoAlpha: 0 });
          gsap.set(phoneEntries, { autoAlpha: 0, y: -10 });
          gsap.set(phoneDetails, { autoAlpha: 0, y: 12 });
          gsap.set(phoneBeats, { yPercent: 110, autoAlpha: 0 });
          gsap.set(phoneRailItems, { autoAlpha: 0.28 });
          gsap.set(q<HTMLElement>('[data-phone-meter]'), { scaleY: 0 });
          if (screenHero) gsap.set(screenHero, { yPercent: 0 });
          if (feed) gsap.set(feed, { yPercent: 105 });
          if (focus) gsap.set(focus, { clipPath: 'inset(100% 0% 0% 0%)' });
          if (story) gsap.set(story, { clipPath: 'inset(100% 0% 0% 0%)' });
          if (campaign) {
            gsap.set(campaign, { clipPath: 'inset(100% 0 0 0)', transformOrigin: 'center center' });
          }
          gsap.set(q<HTMLElement>('[data-campaign-image]'), { scale: 0.86 });
          if (phoneButtons) gsap.set(phoneButtons, { scaleY: 0 });
          if (phoneIsland) gsap.set(phoneIsland, { width: 0 });
          if (phoneChrome) gsap.set(phoneChrome, { autoAlpha: 0 });

          const immersion = q<HTMLElement>(`.${styles.immersion}`)[0];
          const immersionScene = q<HTMLElement>(`.${styles.immersionScene}`)[0];
          const immersionChapter = q<HTMLElement>('[data-immersion-chapter]')[0];
          const immersionHeading = q<HTMLElement>('[data-immersion-heading]')[0];
          const immersionStatement = q<HTMLElement>('[data-immersion-statement]')[0];
          const immersionAxis = q<HTMLElement>('[data-immersion-axis]')[0];
          const central = q<HTMLElement>('[data-immersion-slot="0"]')[0];
          const depthPlanes = q<HTMLElement>('[data-immersion-depth]');

          if (immersion) gsap.set(immersion, { autoAlpha: 0 });
          if (canvasRef.current) gsap.set(canvasRef.current, { autoAlpha: 0 });
          if (immersionChapter) gsap.set(immersionChapter, { autoAlpha: 0, y: -10 });
          if (immersionHeading) gsap.set(immersionHeading, { yPercent: 115 });
          if (immersionStatement) gsap.set(immersionStatement, { autoAlpha: 0, yPercent: 18 });
          if (immersionAxis) gsap.set(immersionAxis, { autoAlpha: 0, y: 10 });
          if (depthPlanes.length) gsap.set(depthPlanes, { autoAlpha: 0 });

          /* ---------- INTROTIMELINE ---------- */
          const introTl = gsap.timeline({ defaults: { ease: EASE.reveal } });

          introTl
            .to(openingFrame, { autoAlpha: 0.82, scaleX: 1, scaleY: 1, duration: DUR.editorial })
            .to(ruleH, { scaleX: 1, duration: DUR.editorial }, 0.06)
            .to(metas, { autoAlpha: 0.72, duration: DUR.base, stagger: STAGGER.base }, 0.05)
            .to(nameLines, { yPercent: 0, duration: DUR.editorial, stagger: STAGGER.base }, 0.22)
            .to([first, last], { letterSpacing: '-0.045em', duration: DUR.editorial, ease: EASE.move }, 0.48)
            .to(tagline, { autoAlpha: 0.88, duration: DUR.base }, 0.72)
            .to(spread, { autoAlpha: 1, scale: 1, rotation: 0, duration: DUR.editorial }, 0.82)
            .to(
              [screen, heroFrameEl, ...transientEls],
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0 0 0)',
                scale: (i: number, target: Element) =>
                  target.classList.contains(styles.transient ?? '') ? 1 : 0.82,
                duration: DUR.base,
                stagger: STAGGER.base,
              },
              0.9,
            )
            .to([first, last], { x: 0, y: 0, scale: 1, duration: DUR.cinematic, ease: EASE.handoff }, 1.28)
            .to(last, { color: 'var(--rich-wine)', duration: DUR.editorial }, 1.28)
            .to(tagline, { x: 0, y: 0, duration: DUR.cinematic, ease: EASE.handoff }, 1.28)
            .to(
              [screen, heroFrameEl],
              { xPercent: 0, yPercent: 0, scale: 1, duration: DUR.cinematic, ease: EASE.handoff },
              1.3,
            )
            .to(
              transientEls,
              { xPercent: (i: number) => (i === 0 ? -130 : 130), autoAlpha: 0, duration: DUR.editorial, ease: EASE.move },
              1.25,
            )
            .to(openingFrame, { autoAlpha: 0, scaleX: 1.24, scaleY: 1.24, duration: DUR.base }, 1.32)
            .to(ruleV, { scaleY: 1, autoAlpha: 1, duration: DUR.editorial }, 1.72)
            .to(disciplines, { autoAlpha: 0.72, duration: DUR.base }, 1.84)
            .to(notebookDetails, { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.tight }, 1.78)
            .add(() => unlockScroll(), 2.12)
            .add(() => emitReady(), 2.34);

          /* ---------- SCROLL TIMELINE (Hero → Social → Phone) ---------- */
          const socialLeft = isDesktop ? '42%' : '34%';
          const socialTop = isDesktop ? '16%' : '20%';
          const socialWidth = isDesktop ? '18vw' : '32vw';

          const phoneWidthVw = isDesktop ? 22 : 58;
          const phoneWidth = `${phoneWidthVw}vw`;
          const phonePadding = isDesktop ? 10 : 8;
          const phoneRadius = isDesktop ? 44 : 38;
          const phoneScreenRadius = isDesktop ? 36 : 30;
          const phoneIslandWidth = isDesktop ? 88 : 72;

          const scrollTl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: () => scrollLength(SCROLL.hero + SCROLL.social + SCROLL.phone + SCROLL.immersion, !isDesktop),
              pin: stageEl,
              pinSpacing: true,
              scrub: SCRUB.narrative,
              invalidateOnRefresh: true,
            },
          });

          // 1. Hero → Social
          scrollTl
            .to(openingFrame, { autoAlpha: 0, scaleX: 1.24, scaleY: 1.24, duration: 0.14 }, 0)
            .to(ruleH, { scaleX: 0, autoAlpha: 0, duration: 0.18 }, 0.02)
            .to(ruleV, { scaleY: 0, autoAlpha: 0, duration: 0.18 }, 0.04)
            .to(spread, { clipPath: 'inset(0% 50% 0% 50%)', scale: 0.96, autoAlpha: 0, duration: 0.2 }, 0.02)
            .to([first, last], { xPercent: (i: number) => (i === 0 ? -12 : 12), scale: 0.84, autoAlpha: 0, duration: 0.18 }, 0.03)
            .to(tagline, { xPercent: -18, autoAlpha: 0, duration: 0.16 }, 0.05)
            .to([...metas, ...notebookDetails, disciplines, heroFrameEl, ...transientEls], { autoAlpha: 0, duration: 0.18 }, 0.04)
            .to(device, { left: socialLeft, top: socialTop, width: socialWidth, xPercent: 0, yPercent: 0, duration: 0.22 }, 0)
            .to(screen, { scale: 1.055, duration: 0.12 }, 0.1)
            .to(bgSocial, { autoAlpha: 1, duration: 0.22 }, 0.06)
            .to(satellites, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, stagger: 0.045, duration: 0.22 }, 0.04)
            .to(frontCopy, { autoAlpha: 1, yPercent: 0, duration: 0.18 }, 0.08)
            .to(satellites[0]!, { yPercent: -7, duration: 0.18 }, 0.14);
          scrollTl.to({}, { duration: 0.1 }, 0.32);

          // 2. Social : Front, puis Behind
          scrollTl
            .to(frontCopy, { autoAlpha: 0, yPercent: -22, duration: 0.22 }, 0.42)
            .to(
              satellites,
              {
                autoAlpha: 0,
                xPercent: (i: number) => (i % 2 === 0 ? -16 : 16),
                clipPath: 'inset(0% 0% 100% 0%)',
                stagger: 0.03,
                duration: 0.26,
              },
              0.44,
            )
            .to(behind, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.22 }, 0.49)
            .to(screen, { scale: 0.9, duration: 0.16 }, 0.51)
            .to(
              behindMediaEls,
              { clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, stagger: 0.07, duration: 0.22 },
              0.53,
            )
            .to([...behindDetails, ...behindCopy], { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.16 }, 0.57)
            .to(behindMediaEls, { yPercent: (i: number) => (i === 0 ? -3 : 4), duration: 0.26 }, 0.69);

          scrollTl.to({}, { duration: 0.1 }, 0.95);

          // 3. Social → Phone : le behind sort, le device tombe puis rebondit en phone
          const tPhone = 1.05;
          scrollTl
            .to(behind, { autoAlpha: 0, xPercent: 18, duration: 0.22 }, tPhone - 0.08)
            .to(
              [...behindCopy, ...behindDetails, ...behindMediaEls],
              { autoAlpha: 0, xPercent: 14, yPercent: -5, stagger: 0.015, duration: 0.2 },
              tPhone - 0.08,
            )
            .to(
              device,
              {
                right: 'auto',
                left: '50%',
                xPercent: -50,
                top: '82%',
                yPercent: -50,
                width: phoneWidth,
                padding: phonePadding * 0.4,
                scale: 0.96,
                rotation: 4,
                backgroundColor: '#0d0c0a',
                borderColor: 'rgba(255 255 255 / 0.09)',
                borderRadius: phoneRadius * 0.4,
                duration: 0.18,
                ease: 'power2.in',
              },
              tPhone,
            )
            .to(
              device,
              {
                top: '46%',
                yPercent: -50,
                padding: phonePadding,
                scale: 1.02,
                rotation: -1.5,
                borderRadius: phoneRadius,
                duration: 0.16,
                ease: 'back.out(1.6)',
              },
              tPhone + 0.18,
            )
            .to(
              device,
              {
                top: '50%',
                yPercent: -50,
                scale: 1,
                rotation: 0,
                duration: 0.14,
                ease: 'power2.out',
              },
              tPhone + 0.34,
            )
            .set(device, { '--device-ar': '9 / 19.5' }, tPhone)
            .to(
              screen,
              { backgroundColor: 'var(--graphite)', borderRadius: phoneScreenRadius, scale: 1, duration: 0.28, ease: 'power2.inOut' },
              tPhone + 0.06,
            )
            .to(bgPhone, { autoAlpha: 1, duration: 0.5 }, tPhone - 0.08)
            .to(bgSocial, { autoAlpha: 0, duration: 0.34 }, tPhone);

          // 4. Phone : contenu
          const tUi = tPhone + 0.28;
          scrollTl
            .to(phoneButtons, { scaleY: 1, duration: 0.12 }, tUi)
            .to(phoneIsland, { width: phoneIslandWidth, duration: 0.18 }, tUi)
            .to(phoneChrome, { autoAlpha: 0.72, duration: 0.12 }, tUi + 0.04)
            .to(phoneEntries, { autoAlpha: 1, y: 0, stagger: 0.03, duration: 0.14 }, tUi)
            .to(phoneDetails, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.16 }, tUi + 0.08)
            .to(q<HTMLElement>('[data-phone-meter]'), { scaleY: 1, duration: 0.5 }, tUi + 0.06);

          if (contextWord) scrollTl.to(contextWord, { autoAlpha: 1, duration: 0.14 }, tUi + 0.04);

          // Le héros part pour révéler le feed, puis focus / story / campaign
          if (screenHero) scrollTl.to(screenHero, { yPercent: -101, duration: 0.18 }, tUi + 0.12);
          if (feed) scrollTl.to(feed, { yPercent: 0, duration: 0.18 }, tUi + 0.12);
          if (feed) scrollTl.to(feed, { yPercent: -25, duration: 0.22 }, tUi + 0.3);
          if (focus) {
            scrollTl.to(focus, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18 }, tUi + 0.22);
            scrollTl.to(q<HTMLElement>('[data-focus-image]'), { scale: 1.055, duration: 0.2 }, tUi + 0.24);
          }
          if (story) {
            scrollTl.to(story, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18 }, tUi + 0.32);
            scrollTl.to(q<HTMLElement>('[data-story-image]'), { scale: 1.04, duration: 0.2 }, tUi + 0.34);
          }
          if (campaign) {
            scrollTl.to(
              campaign,
              { clipPath: 'inset(0% 0 0 0)', duration: 0.22, ease: 'power2.out' },
              tUi + 0.42,
            );
            scrollTl.fromTo(
              q<HTMLElement>('[data-campaign-image]'),
              { scale: 0.86 },
              { scale: 1.035, duration: 0.22, ease: 'power2.out' },
              tUi + 0.42,
            );
          }

          // Beats
          const beatsList = content.phone.beats;
          beatsList.forEach((_, index) => {
            const beat = phoneBeats[index];
            const railItem = phoneRailItems[index];
            const at = tUi + 0.04 + index * 0.06;
            if (beat && railItem) {
              scrollTl
                .to(beat, { yPercent: 0, autoAlpha: 1, duration: 0.05 }, at)
                .to(railItem, { autoAlpha: 1, color: 'var(--rich-wine)', duration: 0.05 }, at)
                .to(beat, { yPercent: -110, autoAlpha: 0, duration: 0.05 }, at + 0.09)
                .to(railItem, { autoAlpha: 0.28, color: 'var(--ink)', duration: 0.05 }, at + 0.09);
            }
          });

          // 5. Phone → plein écran → galerie 3D
          scrollTl.to({}, { duration: 0.08 }, tUi + 0.7);

          const tPortal = tUi + 0.78;
          const viewportW = window.innerWidth;
          const viewportH = window.innerHeight;
          const phoneScreenW = Math.max(0, (phoneWidthVw / 100) * viewportW - phonePadding * 2);
          const phoneScreenH = phoneScreenW * (19.5 / 9);
          const startSx = phoneScreenW / viewportW;
          const startSy = phoneScreenH / viewportH;

          if (screen && startSx > 0 && startSy > 0) {
            scrollTl.set(
              screen,
              {
                position: 'fixed',
                left: '50%',
                right: 'auto',
                top: '50%',
                bottom: 'auto',
                xPercent: -50,
                yPercent: -50,
                width: '100vw',
                height: '100vh',
                overflow: 'visible',
                zIndex: 'var(--z-canvas)',
              },
              tPortal,
            );
            scrollTl.fromTo(
              screen,
              { scaleX: startSx, scaleY: startSy, transformOrigin: 'center center' },
              { scaleX: 1, scaleY: 1, duration: 0.38, ease: 'power2.inOut' },
              tPortal,
            );
          }

          scrollTl.to(phoneInterface, { autoAlpha: 0, yPercent: -5, duration: 0.34 }, tPortal);
          scrollTl.to(device, { autoAlpha: 0, scale: 0.96, duration: 0.36 }, tPortal + 0.04);

          const tImmersion = tPortal + 0.34;
          if (immersion) scrollTl.to(immersion, { autoAlpha: 1, duration: 0.08 }, tPortal + 0.06);
          if (screen) scrollTl.to(screen, { autoAlpha: 0, scale: 1.12, duration: 0.42 }, tImmersion);

          // Canvas R3F lifecycle
          if (canvasRef.current) {
            scrollTl.to(canvasRef.current, { autoAlpha: 1, duration: 0.45 }, tPortal + 0.06);
          }

          scrollTl.eventCallback('onUpdate', () => {
            const t = scrollTl.time();
            const start = tPortal;
            const end = tPortal + 0.8;
            const local = (t - start) / (end - start);
            galleryProgressRef.current = Math.max(0, Math.min(1, local));
          });

          return () => {
            unlockScroll();
          };
        },
      );

      /* Filet de sécurité pour l'ouverture. */
      const release = () => unlockScroll();
      window.addEventListener('keydown', release, { once: true });
      const safety = window.setTimeout(() => {
        release();
        emitReady();
      }, 4500);

      return () => {
        window.removeEventListener('keydown', release);
        window.clearTimeout(safety);
        unlockScroll();
      };
    },
    { scope: root },
  );

  const { opening, hero } = content;

  return (
    <section
      ref={root}
      className={`act ${styles.act}`}
      aria-label={opening.edition}
    >
      <div ref={stage} className={styles.stage}>
        <h1 className="visually-hidden">
          {hero.firstName} {hero.lastName} — {opening.tagline}
        </h1>

        <div className={styles.bgSocial} data-bg-social aria-hidden="true" />
        <div className={styles.bgPhone} data-bg-phone aria-hidden="true" />

        <span className={`${styles.edition} micro`} data-meta>
          <span className="line-mask">
            <span data-meta-line>{opening.edition}</span>
          </span>
        </span>
        <span className={`${styles.axis} micro`} data-meta>
          <span className="line-mask">
            <span data-meta-line>{opening.axis}</span>
          </span>
        </span>

        <span className={styles.ruleH} aria-hidden="true" />
        <span className={styles.ruleV} aria-hidden="true" />
        <span className={styles.spread} aria-hidden="true" />

        <div className={styles.openingFrame} data-opening-frame aria-hidden="true">
          <span className={`${styles.openingCount} micro`}>00 / 09</span>
          <span className={`${styles.openingCaption} micro`}>{opening.edition}</span>
        </div>

        <div className={`${styles.nameFirst} monument`} aria-hidden="true">
          <span className="line-mask">
            <span data-name-line>{hero.firstName}</span>
          </span>
        </div>
        <div className={`${styles.nameLast} monument`} aria-hidden="true">
          <span className="line-mask">
            <span data-name-line>{hero.lastName}</span>
          </span>
        </div>

        <p className={`${styles.tagline} lead`}>{opening.tagline}</p>

        <ul className={`${styles.disciplines} micro`} aria-hidden="true">
          {hero.disciplines.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>

        <div className={`${styles.media} ${styles.heroFrame}`}>
          <Media item={heroFrame} locale={locale} index={2} total={4} sizes="16vw" />
        </div>

        <span className={`${styles.handNote} hand-note`} data-notebook-detail aria-hidden="true">
          ideas become direction
        </span>
        <span className={`${styles.folio} micro`} data-notebook-detail aria-hidden="true">
          01 / Creative notebook
        </span>

        {openingMedia.map((m, i) => (
          <div
            key={m.id}
            className={`${styles.transient} ${
              i === 0 ? styles.transient01 : styles.transient02
            }`}
          >
            <Media item={m} locale={locale} index={i + 3} total={4} compact sizes="14vw" />
          </div>
        ))}

        {/* Social front composition */}
        <div className={styles.frontComposition} data-front-copy>
          <span className={`${styles.frontChapter} micro`}>
            02 / {content.social.heading}
          </span>
          <p className={styles.frontLabel}>{content.social.front}</p>
          <span className={`${styles.frontCount} micro`} aria-hidden="true">
            Front / 01—04
          </span>
        </div>

        {/* Device = heroVertical partagé, qui devient l'écran du téléphone. */}
        <div
          className={styles.device}
          data-device
          data-social-dominant
          data-phone
          data-phone-device
        >
          <span className={styles.sideButton} data-phone-button data-side="left" />
          <span className={styles.sideButton} data-phone-button data-side="right" />
          <span className={styles.island} aria-hidden="true" />

          <div className={styles.screen} data-screen data-phone-screen>
            <div className={styles.phoneChrome} data-phone-detail aria-hidden="true">
              <span>09:41</span>
              <span>GD — Studio</span>
              <span>•••</span>
            </div>

            <div className={styles.screenHero} data-screen-hero data-phone-hero>
              <Media
                item={heroVertical}
                locale={locale}
                className={styles.sharedHero}
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
              <span className={styles.campaignWord}>{content.phone.beats[3] ?? ''}</span>
              <span className={`${styles.screenCaption} micro`}>04 / Full campaign</span>
            </div>

            <span className={styles.reflection} data-phone-detail aria-hidden="true" />
          </div>
        </div>

        {socialSatellites.slice(0, 3).map((item, index) => (
          <div
            className={styles.satellite}
            data-social-satellite
            data-social-slot={index + 1}
            key={item.id}
          >
            <Media item={item} locale={locale} compact sizes="20vw" />
          </div>
        ))}

        {/* Social behind */}
        <div className={styles.behind} data-behind>
          <span className={styles.behindWord} aria-hidden="true">
            Behind
          </span>
          <span className={styles.behindRule} data-behind-detail aria-hidden="true" />

          <figure className={styles.behindPrimary} data-behind-media>
            <Media item={behindMedia[0]!} locale={locale} sizes="52vw" />
            <figcaption className={`${styles.mediaCaption} micro`}>
              01 / {behindMedia[0]!.role}
            </figcaption>
          </figure>

          <figure className={styles.behindSecondary} data-behind-media>
            <Media item={behindMedia[1]!} locale={locale} sizes="22vw" />
            <figcaption className={`${styles.mediaCaption} micro`}>
              02 / {behindMedia[1]!.role}
            </figcaption>
          </figure>

          <div className={styles.behindCopy} data-behind-copy>
            <span className={`${styles.behindLabel} micro`}>{content.social.behind}</span>
            <p className={`${styles.statement} lead`}>{content.social.statement}</p>
            <ul className={`${styles.layers} micro`}>
              {content.social.layers.map((layer, index) => (
                <li key={layer}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {layer}
                </li>
              ))}
            </ul>
          </div>

          <span className={`${styles.behindFolio} micro`} data-behind-detail aria-hidden="true">
            Strategy / Production / Rhythm
          </span>
        </div>

        {/* Phone interface */}
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

        {/* Act 04 — Immersion */}
        <div className={styles.immersion} data-immersion aria-labelledby="immersion-title">
          <div className={styles.immersionScene} data-immersion-scene>
            <div className={styles.immersionCopy}>
              <span className={`${styles.immersionChapter} micro`} data-immersion-chapter>
                04 / {content.immersion.heading}
              </span>
              <div className={`${styles.immersionHeading} display line-mask`}>
                <h2 id="immersion-title" data-immersion-heading>
                  {content.immersion.heading}
                </h2>
              </div>
              <p className={`${styles.immersionStatement} lead`} data-immersion-statement>
                {content.immersion.statement}
              </p>
              <span className={`${styles.immersionAxis} micro`} data-immersion-axis>
                Paper / Archive / Depth
              </span>
            </div>

            <div ref={canvasRef} className={styles.immersionCanvas} data-immersion-canvas>
              <Gallery3D content={content} locale={locale} progress={galleryProgressRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
