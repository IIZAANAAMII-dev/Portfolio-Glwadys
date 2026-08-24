'use client';

import { useRef, useState, type CSSProperties } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import {
  behindMedia,
  heroFrame,
  heroVertical,
  openingMedia,
  phoneFeed,
  phoneStory,
  socialPortal,
  socialSatellites,
} from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, EASE, MQ, STAGGER } from '@/lib/motion';
import { emitReady, lockScroll, unlockScroll } from '@/lib/scrollControl';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { ArchivePlate } from '@/ui/ArchivePlate';
import { Media } from '@/ui/Media';

import styles from './ActScrollStory.module.css';
import { ImmersionCanvas } from './ImmersionCanvas';

interface Props {
  content: Content;
  locale: Locale;
}

/**
 * CHAPITRE 1 — OUVERTURE → HERO → CONTENU → SITUATION → IMMERSION.
 *
 * Une seule scène pinnée, une seule timeline. Le découpage en « sections » est
 * une commodité de lecture : à l'écran, rien ne commence et rien ne finit, une
 * chose se transforme en une autre.
 *
 * ─── PARTITION ────────────────────────────────────────────────────────────
 * L'unité de temps de la timeline vaut **une hauteur de viewport de scroll**.
 * `T.socialIn = 1.3` se lit donc « 130 vh après le début de l'acte ». C'est ce
 * qui rend le budget de scroll auditable au lieu d'être une suite de 0.14.
 *
 * ─── RÈGLE STRUCTURELLE ───────────────────────────────────────────────────
 * L'écran (`[data-phone-screen]`) n'est **jamais** transformé. Seul le device
 * l'est. L'écran est par construction l'intérieur exact du device ; c'est la
 * seule façon d'empêcher le corps et l'écran de se désolidariser.
 *
 * ─── ÉLÉMENT PERSISTANT ───────────────────────────────────────────────────
 * `heroVertical` est un nœud DOM unique, jamais démonté, jamais recréé. Il est
 * la photo 9:16 de la couverture, puis le média dominant du monde social, puis
 * l'écran du téléphone. La campagne qui arrive dans ce même écran fournit
 * ensuite l'image du portail.
 */

/** Repères de la partition, en hauteurs de viewport. */
const T = {
  heroHold: 0.0,
  socialIn: 1.18,
  storyCross: 2.0,
  invert: 2.42,
  behindIn: 2.72,
  phoneIn: 4.15,
  montage: 4.65,
  compress: 6.72,
  burst: 7.45,
  gallery: 7.68,
  flatten: 9.2,
  handoff: 9.46,
  end: 9.82,
} as const;

/** Longueur totale du pin, en % de viewport. Dérivée de la partition. */
const SCROLL_VH = T.end * 100;

/** Le mobile recompose et raccourcit. */
const MOBILE_RATIO = 0.74;

/**
 * Repères DOM de la navigation pour les quatre actes contenus dans cette
 * timeline unique. Leur géométrie suit la partition : la navigation peut donc
 * continuer à observer le document sans dupliquer le playhead GSAP en state.
 */
const STORY_ACT_MARKERS = [
  { id: 'act-opening', start: T.heroHold },
  { id: 'act-social', start: T.socialIn },
  { id: 'act-phone', start: T.phoneIn },
  { id: 'act-immersion', start: T.burst },
] as const;

type ActMarkerStyle = CSSProperties & {
  '--marker-top': string;
  '--marker-height': string;
  '--marker-mobile-top': string;
  '--marker-mobile-height': string;
};

function markerStart(start: number, ratio: number) {
  if (start === T.heroHold) return 0;
  return ((0.5 + start * ratio) / (1 + T.end * ratio)) * 100;
}

function markerStyle(index: number): ActMarkerStyle {
  const marker = STORY_ACT_MARKERS[index]!;
  const next = STORY_ACT_MARKERS[index + 1];
  const desktopTop = markerStart(marker.start, 1);
  const desktopEnd = next ? markerStart(next.start, 1) : 100;
  const mobileTop = markerStart(marker.start, MOBILE_RATIO);
  const mobileEnd = next ? markerStart(next.start, MOBILE_RATIO) : 100;

  return {
    '--marker-top': `${desktopTop}%`,
    '--marker-height': `${desktopEnd - desktopTop}%`,
    '--marker-mobile-top': `${mobileTop}%`,
    '--marker-mobile-height': `${mobileEnd - mobileTop}%`,
  };
}

function placeAt(el: HTMLElement, left: number, top: number, scale: number) {
  const rect = el.getBoundingClientRect();
  gsap.set(el, { x: left - rect.left, y: top - rect.top, scale });
}

function ReducedStory({ content, locale }: Props) {
  const { hero, opening, social, phone, immersion } = content;

  return (
    <div className={styles.reducedStory}>
      <article className={styles.reducedPanel}>
        <span className="micro">01 / {opening.edition}</span>
        <h2 className={`${styles.reducedName} monument`}>
          {hero.firstName} <em>{hero.lastName}</em>
        </h2>
        <p className="lead">{opening.tagline}</p>
        <div className={styles.reducedHeroMedia}>
          <Media item={heroVertical} locale={locale} sizes="(max-width: 1023px) 68vw, 34vw" />
        </div>
      </article>

      <article className={styles.reducedPanel}>
        <span className="micro">02 / {social.heading}</span>
        <h2 className="display">{social.front}</h2>
        <p className="lead">{social.statement}</p>
        <div className={styles.reducedMediaPair}>
          <Media item={socialSatellites[1]!} locale={locale} sizes="44vw" />
          <Media item={behindMedia[0]!} locale={locale} sizes="44vw" />
        </div>
      </article>

      <article className={styles.reducedPanel}>
        <span className="micro">03 / {phone.heading}</span>
        <h2 className="display">{phone.beats.join(' / ')}</h2>
        <div className={styles.reducedPhoneMedia}>
          <Media item={phoneStory} locale={locale} sizes="52vw" />
        </div>
      </article>

      <article className={`${styles.reducedPanel} ${styles.reducedImmersion}`}>
        <span className="micro">04 / {immersion.heading}</span>
        <h2 className="display">{immersion.heading}</h2>
        <p className="lead">{immersion.statement}</p>
        <ArchivePlate locale={locale} />
      </article>
    </div>
  );
}

export function ActScrollStory({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const galleryProgress = useRef(0);
  const burstValue = useRef(0);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const galleryMountState = useRef(false);
  const [galleryActive, setGalleryActive] = useState(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      /* `null` plutôt que `undefined` : GSAP ignore silencieusement une cible
         nulle, ce qui évite une garde par élément décoratif. */
      const one = <T extends HTMLElement>(sel: string): T | null => q<T>(sel)[0] ?? null;

      const first = one(`.${styles.nameFirst}`);
      const last = one(`.${styles.nameLast}`);
      const tagline = one(`.${styles.tagline}`);
      const device = one(`.${styles.device}`);
      const page = one('[data-page-surface]');
      const openingFrame = one('[data-opening-frame]');
      if (!first || !last || !tagline || !device || !page || !openingFrame) return;

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (ctx) => {
          const { isDesktop, isReduced } = ctx.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };

          /* ---------- ÉLÉMENTS ---------- */
          const metas = q<HTMLElement>('[data-meta]');
          const nameLines = q<HTMLElement>('[data-name-line]');
          const notebookDetails = q<HTMLElement>('[data-notebook-detail]');
          const transients = q<HTMLElement>(`.${styles.transient}`);
          const ruleH = one(`.${styles.ruleH}`);
          const ruleV = one(`.${styles.ruleV}`);
          const disciplines = one(`.${styles.disciplines}`);
          const heroFrameEl = one(`.${styles.heroFrame}`);
          const frontCopy = one('[data-front-copy]');
          const satellites = q<HTMLElement>('[data-social-satellite]');
          const crossing = one('[data-social-crossing]');

          const behind = one('[data-behind]');
          const behindMediaEls = q<HTMLElement>('[data-behind-media]');
          const behindBits = q<HTMLElement>('[data-behind-detail], [data-behind-copy]');

          const phoneUi = q<HTMLElement>('[data-phone-entry], [data-phone-detail]');
          const phoneBeats = q<HTMLElement>('[data-phone-beat]');
          const phoneRail = q<HTMLElement>('[data-phone-rail-item]');
          const phoneButtons = q<HTMLElement>('[data-phone-button]');
          const island = one(`.${styles.island}`);
          const feed = one(`.${styles.feed}`);
          const focus = one(`.${styles.focus}`);
          const story = one(`.${styles.story}`);
          const campaign = one(`.${styles.campaign}`);
          const screenHero = one('[data-screen-hero]');

          const portalFrame = one('[data-portal-frame]');
          const sceneGround = one('[data-scene-ground]');
          const immersion = one('[data-immersion]');
          const immersionBits = q<HTMLElement>('[data-immersion-bit]');
          const immersionChapter = one(`.${styles.immersionChapter}`);
          const immersionNarrative = [
            one(`.${styles.immersionHeading}`),
            one(`.${styles.immersionStatement}`),
          ].filter((element): element is HTMLElement => Boolean(element));
          const flatPaper = one('[data-flat-paper]');
          const flatHandoff = one('[data-archive-plate="handoff"]');

          if (
            !ruleH ||
            !behind ||
            !frontCopy ||
            !portalFrame ||
            !immersion ||
            !immersionChapter ||
            !flatPaper ||
            !flatHandoff
          )
            return;

          /* ================================================================
             REDUCED MOTION — pas « sans animation » : une composition posée.
             ================================================================ */
          if (isReduced) {
            unlockScroll();
            emitReady();
            return;
          }

          lockScroll();

          /* ================================================================
             ÉTATS INITIAUX
             ================================================================ */
          const stageRect = stageEl.getBoundingClientRect();
          const cx = stageRect.left + stageRect.width / 2;
          const cy = stageRect.top + stageRect.height / 2;
          const NAME_SCALE = isDesktop ? 0.42 : 0.62;

          // Tracking changes the measured width substantially; establish it
          // before centering both lines so the opening stack shares one axis.
          gsap.set([first, last], { letterSpacing: '0.3em' });
          const firstRect = first.getBoundingClientRect();
          const lastRect = last.getBoundingClientRect();
          const firstH = firstRect.height * NAME_SCALE;
          const gap = firstH * 0.04;

          placeAt(first, cx - (firstRect.width * NAME_SCALE) / 2, cy - firstH - gap, NAME_SCALE);
          placeAt(last, cx - (lastRect.width * NAME_SCALE) / 2, cy + gap, NAME_SCALE);
          gsap.set(last, { color: 'var(--ivory)' });

          const taglineRect = tagline.getBoundingClientRect();
          placeAt(tagline, cx - taglineRect.width / 2, cy + firstH * 2 + firstH * 0.55, 1);
          gsap.set(tagline, { autoAlpha: 0 });

          gsap.set(ruleH, { scaleX: 0 });
          gsap.set(ruleV, { scaleY: 0, autoAlpha: 0 });
          // Keep the baseline in its final geometry. A transform reveal on these
          // two nested spans was being re-applied during the initial pin refresh,
          // leaving both names translated below their masks. Opacity owns the
          // reveal; tracking and the parent move still carry the transformation.
          gsap.set(nameLines, { yPercent: 0, autoAlpha: 0 });
          gsap.set([...metas, disciplines], { autoAlpha: 0 });
          gsap.set(notebookDetails, { autoAlpha: 0, y: 14 });
          gsap.set(openingFrame, { autoAlpha: 0, scaleX: 0.16, scaleY: 0.72 });
          gsap.set(transients, { autoAlpha: 0, scale: 0.9, clipPath: 'inset(100% 0 0 0)' });
          gsap.set(heroFrameEl, { autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' });

          // La page ivoire est repliée derrière le média : elle en sortira.
          gsap.set(page, { autoAlpha: 0, scaleX: 0.2, scaleY: 0.5 });

          /* Le device porte le média persistant. L'écran, lui, n'est jamais
             transformé : il est l'intérieur du device, point. */
          gsap.set(device, {
            autoAlpha: 0,
            clipPath: 'inset(100% 0 0 0)',
            '--device-ar': '9 / 16',
          });

          gsap.set([frontCopy, crossing], { autoAlpha: 0 });
          gsap.set(satellites, { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)', yPercent: 12 });
          gsap.set(crossing, { xPercent: -140, yPercent: 40, rotation: -8 });

          gsap.set(behind, { autoAlpha: 0, scale: 0.94 });
          gsap.set(behindMediaEls, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 6 });
          gsap.set(behindBits, { autoAlpha: 0, y: 14 });

          gsap.set(phoneUi, { autoAlpha: 0, y: 10 });
          gsap.set(phoneBeats, { yPercent: 110, autoAlpha: 0 });
          gsap.set(phoneRail, { autoAlpha: 0.26 });
          gsap.set(phoneButtons, { scaleY: 0 });
          gsap.set(island, { width: 0 });
          gsap.set(q<HTMLElement>('[data-phone-meter]'), { scaleY: 0 });
          gsap.set(screenHero, { yPercent: 0 });
          gsap.set(feed, { yPercent: 104 });
          gsap.set([focus, story, campaign], { clipPath: 'inset(100% 0% 0% 0%)' });

          gsap.set(portalFrame, { autoAlpha: 0, clipPath: 'inset(50% 0% 50% 0%)' });
          gsap.set(sceneGround, { autoAlpha: 0 });
          gsap.set(immersion, { autoAlpha: 0 });
          gsap.set(immersionBits, { autoAlpha: 0, y: 12 });
          gsap.set(flatPaper, { autoAlpha: 0, clipPath: 'inset(50% 0% 50% 0%)' });
          gsap.set(flatHandoff, { autoAlpha: 0 });

          /* ================================================================
             OUVERTURE (auto, ~2.4 s) — devient la Hero sans coupure.
             ================================================================ */
          const intro = gsap.timeline({ defaults: { ease: EASE.reveal } });

          intro
            .to(openingFrame, { autoAlpha: 0.82, scaleX: 1, scaleY: 1, duration: DUR.editorial })
            .to(ruleH, { scaleX: 1, duration: DUR.editorial }, 0.06)
            .to(metas, { autoAlpha: 0.72, duration: DUR.base, stagger: STAGGER.base }, 0.05)
            .to(nameLines, { autoAlpha: 1, duration: DUR.editorial, stagger: STAGGER.base }, 0.22)
            .to(
              [first, last],
              { letterSpacing: '-0.045em', duration: DUR.editorial, ease: EASE.move },
              0.48,
            )
            .to(tagline, { autoAlpha: 0.88, duration: DUR.base }, 1.04)
            .to(
              [device, heroFrameEl, ...transients],
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0 0 0)',
                scale: 1,
                duration: DUR.base,
                stagger: STAGGER.base,
              },
              0.86,
            )
            // La composition se déplie : le nom rejoint sa place de couverture.
            .to([first, last], { x: 0, y: 0, scale: 1, duration: DUR.cinematic, ease: EASE.handoff }, 1.24)
            .to(last, { color: 'var(--rich-wine)', duration: DUR.editorial }, 1.24)
            .to(tagline, { x: 0, y: 0, duration: DUR.cinematic, ease: EASE.handoff }, 1.24)
            .to(
              transients,
              {
                xPercent: (i: number) => (i === 0 ? -130 : 130),
                autoAlpha: 0,
                duration: DUR.editorial,
                ease: EASE.move,
              },
              1.22,
            )
            .to(openingFrame, { autoAlpha: 0, scaleX: 1.24, scaleY: 1.24, duration: DUR.base }, 1.3)
            .to(ruleV, { scaleY: 1, autoAlpha: 1, duration: DUR.editorial }, 1.68)
            .to(disciplines, { autoAlpha: 0.72, duration: DUR.base }, 1.8)
            .to(
              notebookDetails,
              { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.tight },
              1.74,
            )
            // Le scroll est rendu avant la fin perçue : l'attente n'est jamais subie.
            .add(() => unlockScroll(), 2.05)
            .add(() => emitReady(), 2.3);

          /* ================================================================
             EXPLOSION — hybride.
             Le scroll déclenche l'événement, l'explosion elle-même est
             autonome (~700 ms), puis le contrôle revient au scroll.
             Réversible : remonter la rembobine.

             Définie AVANT la partition : ScrollTrigger appelle `onUpdate` dès
             l'initialisation, et `driveBurst` doit déjà pouvoir s'exécuter.
             ================================================================ */
          const burstTl = gsap.timeline({ paused: true });
          burstTl
            .to(burstValue, {
              current: 1,
              duration: 0.42,
              ease: 'power4.out',
              onUpdate: () => requestRenderRef.current?.(),
            })
            .to(
              portalFrame,
              { scale: 1.08, autoAlpha: 0, duration: 0.34, ease: 'power3.out' },
              0.06,
            );

          let fired = false;
          const driveBurst = (t: number) => {
            if (t >= T.burst && !fired) {
              fired = true;
              burstTl.play();
            } else if (t < T.burst - 0.08 && fired) {
              fired = false;
              burstTl.reverse();
            }
            // A fast wheel/touch jump must never arrive in the corridor while
            // the autonomous burst is still showing an empty compressed stack.
            if (t >= T.gallery && fired && burstTl.progress() < 1) burstTl.progress(1);
          };

          /* ================================================================
             PARTITION SCROLLÉE
             ================================================================ */
          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: rootEl,
              start: 'top top',
              end: `+=${Math.round(SCROLL_VH * (isDesktop ? 1 : MOBILE_RATIO))}%`,
              pin: stageEl,
              pinSpacing: true,
              scrub: 0.55,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const t = self.progress * T.end;
                const shouldMountGallery = t >= T.compress - 0.45;
                if (shouldMountGallery !== galleryMountState.current) {
                  galleryMountState.current = shouldMountGallery;
                  setGalleryActive(shouldMountGallery);
                }
                galleryProgress.current = gsap.utils.clamp(
                  0,
                  1,
                  (t - T.gallery) / (T.handoff - T.gallery),
                );
                // Le canvas ne rend que quand la scène bouge réellement.
                if (t > T.burst - 0.4) requestRenderRef.current?.();
                driveBurst(t);
              },
            },
          });

          /* ---------------------------------------------------------------
             SECTION 1 — LA COUVERTURE DEVIENT UN CADRAGE
             Une seule idée : tout se retire sauf une image, et la page naît
             d'elle. Le nom ne disparaît pas — il passe DERRIÈRE le média.
             --------------------------------------------------------------- */
          const heroMediaH = () => window.innerHeight * (isDesktop ? 0.52 : 0.44);
          const heroMediaW = () => heroMediaH() * (9 / 16);

          tl.to(
            first,
            { xPercent: -118, duration: 0.62, ease: 'power2.in' },
            T.heroHold + 0.04,
          )
            .to(last, { xPercent: 118, duration: 0.62, ease: 'power2.in' }, T.heroHold + 0.1)
            .to(tagline, { xPercent: -60, autoAlpha: 0, duration: 0.42 }, T.heroHold + 0.06)
            .to(ruleH, { scaleX: 0, duration: 0.36 }, T.heroHold + 0.02)
            .to(ruleV, { scaleY: 0, autoAlpha: 0, duration: 0.36 }, T.heroHold + 0.02)
            .to(openingFrame, { autoAlpha: 0, duration: 0.2 }, T.heroHold)
            .to(
              [...metas, ...notebookDetails, disciplines],
              { autoAlpha: 0, duration: 0.42, stagger: 0.03 },
              T.heroHold + 0.1,
            )
            .to(
              heroFrameEl,
              { xPercent: -46, yPercent: 22, clipPath: 'inset(0% 0% 100% 0%)', duration: 0.5 },
              T.heroHold + 0.08,
            )
            // Le média survivant vient au centre sans perdre son contrat 9:16.
            .to(
              device,
              {
                left: '50%',
                right: 'auto',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                width: () => `${Math.round(heroMediaW())}px`,
                '--device-ar': '9 / 16',
                duration: 0.78,
                ease: 'power2.inOut',
              },
              T.heroHold + 0.08,
            )
            // …puis la page ivoire se déplie DEPUIS lui. Le fond ne « change »
            // pas de couleur : une page a grandi. Le changement a une origine.
            .set(
              page,
              {
                autoAlpha: 1,
                scaleX: () => heroMediaW() / window.innerWidth,
                scaleY: () => heroMediaH() / window.innerHeight,
              },
              T.heroHold + 0.58,
            )
            .to(
              page,
              { scaleX: 1, scaleY: 1, duration: 0.62, ease: 'power3.inOut' },
              T.heroHold + 0.6,
            );

          /* ---------------------------------------------------------------
             SECTION 2 — LE CONTENU : hiérarchie, puis ce qui la tient
             --------------------------------------------------------------- */
          tl.to(
            device,
            { left: isDesktop ? '38%' : '50%', top: '46%', duration: 0.5, ease: 'power2.inOut' },
            T.socialIn,
          )
            .to(frontCopy, { autoAlpha: 1, duration: 0.34 }, T.socialIn + 0.1)
            .to(
              satellites,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                yPercent: 0,
                stagger: 0.11,
                duration: 0.46,
              },
              T.socialIn + 0.14,
            )
            // Trois plans de profondeur, jamais une grille d'égaux.
            .to(
              satellites,
              {
                yPercent: (i: number) => [-6, 3, -2][i] ?? 0,
                duration: 0.8,
              },
              T.socialIn + 0.6,
            );

          // BEAT — un format Story traverse DEVANT le média dominant.
          tl.to(
            crossing,
            {
              autoAlpha: 1,
              xPercent: 130,
              yPercent: -30,
              rotation: 6,
              duration: 0.86,
              ease: 'power1.inOut',
            },
            T.storyCross,
          ).to(crossing, { autoAlpha: 0, duration: 0.2 }, T.storyCross + 0.7);

          // BEAT — la hiérarchie s'inverse : le dominant recule.
          tl.to(device, { scale: 0.84, duration: 0.4 }, T.invert)
            .to(satellites[1] ?? [], { scale: 1.12, duration: 0.4 }, T.invert)
            .to(satellites[1] ?? [], { scale: 1, duration: 0.34 }, T.behindIn);

          // BEAT — FRONT → BEHIND. Les contenus finis se referment,
          // la strate qui les tient avance depuis le fond.
          tl.to(frontCopy, { autoAlpha: 0, yPercent: -14, duration: 0.3 }, T.behindIn)
            .to(
              satellites,
              {
                clipPath: 'inset(0% 0% 100% 0%)',
                xPercent: (i: number) => (i % 2 === 0 ? -9 : 9),
                rotation: (i: number) => (i % 2 === 0 ? -1.6 : 1.6),
                autoAlpha: 0,
                stagger: 0.07,
                duration: 0.44,
              },
              T.behindIn + 0.04,
            )
            .to(device, { scale: 0.74, duration: 0.44 }, T.behindIn + 0.08)
            .to(behind, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, T.behindIn + 0.16)
            .to(
              behindMediaEls,
              { clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, stagger: 0.13, duration: 0.44 },
              T.behindIn + 0.26,
            )
            .to(behindBits, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.32 }, T.behindIn + 0.4);

          /* ---------------------------------------------------------------
             SECTION 3 — LE CONTENU EN SITUATION
             Le device NAÎT autour du média. Il n'est pas posé : il pousse.
             --------------------------------------------------------------- */
          const phoneW = () => window.innerHeight * (isDesktop ? 0.4 : 0.34);
          const bezel = isDesktop ? 10 : 8;
          const radius = isDesktop ? 44 : 36;

          tl.to(
            [behind, ...behindMediaEls, ...behindBits],
            { autoAlpha: 0, duration: 0.36, stagger: 0.02 },
            T.phoneIn - 0.42,
          )
            .to(
              device,
              {
                left: '50%',
                top: '50%',
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                width: () => `${Math.round(phoneW())}px`,
                duration: 0.5,
                ease: 'power2.inOut',
              },
              T.phoneIn - 0.4,
            )
            // Naissance : le device pousse AUTOUR du média. Bezel puis rayon,
            // pilotés en variables CSS — le rayon de l'écran s'en déduit.
            .to(
              device,
              {
                '--device-ar': '9 / 19.5',
                '--phone-bezel': `${bezel}px`,
                backgroundColor: '#0d0c0a',
                borderColor: 'rgba(255 255 255 / 0.09)',
                duration: 0.3,
                ease: 'power2.out',
              },
              T.phoneIn,
            )
            .to(
              device,
              { '--phone-radius': `${radius}px`, duration: 0.34, ease: 'power2.out' },
              T.phoneIn + 0.12,
            )
            .to(phoneButtons, { scaleY: 1, duration: 0.22 }, T.phoneIn + 0.2)
            .to(island, { width: isDesktop ? 88 : 70, duration: 0.26 }, T.phoneIn + 0.24)
            .to(phoneUi, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.3 }, T.phoneIn + 0.3)
            .to(q<HTMLElement>('[data-phone-meter]'), { scaleY: 1, duration: 2.2 }, T.montage);

          // MONTAGE — le scroll est le chef de montage.
          tl.to(screenHero, { yPercent: -101, duration: 0.34 }, T.montage)
            .to(feed, { yPercent: 0, duration: 0.34 }, T.montage)
            .to(feed, { yPercent: -22, duration: 0.5 }, T.montage + 0.42)
            .to(focus, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.34 }, T.montage + 0.62)
            .to(q<HTMLElement>('[data-focus-image]'), { scale: 1.06, duration: 0.6 }, T.montage + 0.64)
            .to(story, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.34 }, T.montage + 1.16)
            .to(q<HTMLElement>('[data-story-image]'), { scale: 1.05, duration: 0.6 }, T.montage + 1.18)
            .to(campaign, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.38 }, T.montage + 1.56)
            .fromTo(
              q<HTMLElement>('[data-campaign-image]'),
              { scale: 1.1 },
              { scale: 1, duration: 0.6 },
              T.montage + 1.56,
            );

          content.phone.beats.forEach((_, i) => {
            const beat = phoneBeats[i];
            const rail = phoneRail[i];
            if (!beat || !rail) return;
            const at = T.montage + 0.1 + i * 0.5;
            tl.to(beat, { yPercent: 0, autoAlpha: 1, duration: 0.16 }, at)
              .to(rail, { autoAlpha: 1, color: 'var(--rich-wine)', duration: 0.16 }, at)
              .to(beat, { yPercent: -110, autoAlpha: 0, duration: 0.16 }, at + 0.42)
              .to(rail, { autoAlpha: 0.26, color: 'var(--ink)', duration: 0.16 }, at + 0.42);
          });

          /* ---------------------------------------------------------------
             COMPRESSION — le contrat visuel se rompt.
             Le plein cadre s'OUVRE par clip-path (jamais par un scale non
             uniforme : c'est ce qui écrasait l'image de 3,5× auparavant),
             le device s'efface, puis la composition se comprime.
             --------------------------------------------------------------- */
          tl.to(
            portalFrame,
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.54, ease: 'power2.inOut' },
            T.compress,
          )
            .to(phoneUi, { autoAlpha: 0, duration: 0.3 }, T.compress)
            .to(phoneBeats, { autoAlpha: 0, duration: 0.2 }, T.compress)
            .to(device, { autoAlpha: 0, duration: 0.34 }, T.compress + 0.34)
            .to(
              [behind, ...satellites, frontCopy],
              { autoAlpha: 0, duration: 0.2 },
              T.compress,
            )
            // Le sol sombre monte pendant que le plein cadre couvre déjà tout.
            .to(sceneGround, { autoAlpha: 1, duration: 0.3 }, T.compress + 0.42)
            // Anticipation : la composition se resserre juste avant la rupture.
            .to(portalFrame, { scale: 0.955, duration: 0.24, ease: 'power2.in' }, T.burst - 0.24);

          // Le canvas prend le relais ; le DOM reste jusqu'à ce que la 3D soit là.
          tl.to(immersion, { autoAlpha: 1, duration: 0.12 }, T.burst)
            .to(immersionBits, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.46 }, T.gallery + 0.12)
            .to(
              immersionNarrative,
              { autoAlpha: 0, y: -10, duration: 0.24 },
              T.gallery + 0.56,
            )
            .to(immersionChapter, { autoAlpha: 0, duration: 0.22 }, T.flatten - 0.55)
            // The dark corridor resolves into a physical paper surface while
            // the surviving WebGL planes move into their DOM contact-sheet slots.
            .to(
              flatPaper,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: T.handoff - T.flatten,
                ease: 'power2.inOut',
              },
              T.flatten,
            )
            // One-frame twin: same sources and geometry, now in DOM. The canvas
            // can be removed without a color or position flash.
            .set(flatHandoff, { autoAlpha: 1 }, T.handoff - 0.025)
            .set(immersion, { autoAlpha: 0 }, T.handoff);

          // Verrou de durée : la partition vaut exactement T.end.
          tl.to({}, { duration: 0.01 }, T.end - 0.01);

          return () => {
            burstTl.kill();
            unlockScroll();
          };
        },
      );

      /* Filet de sécurité : un scroll verrouillé est un défaut bloquant. */
      const release = () => unlockScroll();
      window.addEventListener('keydown', release, { once: true });
      const safety = window.setTimeout(() => {
        release();
        emitReady();
      }, 4200);

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
    <section ref={root} className={`act ${styles.act}`} aria-label={opening.edition}>
      <div className={styles.actMarkers} aria-hidden="true">
        {STORY_ACT_MARKERS.map((marker, index) => (
          <span
            className={styles.actMarker}
            id={marker.id}
            key={marker.id}
            style={markerStyle(index)}
          />
        ))}
      </div>

      <div ref={stage} className={styles.stage}>
        <h1 className="visually-hidden">
          {hero.firstName} {hero.lastName} — {opening.tagline}
        </h1>

        <div className={styles.motionStory}>

        {/* La page ivoire : elle naît du média et devient la surface du chapitre. */}
        <div className={styles.pageSurface} data-page-surface aria-hidden="true" />
        {/* Le sol de la scène immersive : il monte derrière le plein cadre
            opaque, donc on ne le voit jamais « changer ». */}
        <div className={styles.sceneGround} data-scene-ground aria-hidden="true" />
        <div className={styles.flatPaper} data-flat-paper aria-hidden="true" />

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
          <Media item={heroFrame} locale={locale} sizes="16vw" />
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
            className={`${styles.transient} ${i === 0 ? styles.transient01 : styles.transient02}`}
          >
            <Media item={m} locale={locale} compact sizes="14vw" />
          </div>
        ))}

        {/* ---------- SECTION 2 — front ---------- */}
        <div className={styles.frontComposition} data-front-copy>
          <span className={`${styles.frontChapter} micro`}>02 / {content.social.heading}</span>
          <p className={styles.frontLabel}>{content.social.front}</p>
          <span className={`${styles.frontCount} micro`} aria-hidden="true">
            Front / 01—04
          </span>
        </div>

        {/* ---------- ÉLÉMENT PERSISTANT ----------
            Couverture 9:16 → dominant social → écran. Un seul nœud. */}
        <div className={styles.device} data-device data-phone-device>
          <span className={styles.sideButton} data-phone-button data-side="left" />
          <span className={styles.sideButton} data-phone-button data-side="right" />
          <span className={styles.island} aria-hidden="true" />

          <div className={styles.screen} data-phone-screen>
            <div className={styles.phoneChrome} data-phone-detail aria-hidden="true">
              <span>09:41</span>
              <span>GD — Studio</span>
              <span>•••</span>
            </div>

            <div className={styles.screenHero} data-screen-hero>
              <Media
                item={heroVertical}
                locale={locale}
                className={styles.sharedHero}
                sizes="42vh"
              />
            </div>

            <div className={styles.feed}>
              <span className={`${styles.feedTitle} micro`}>Selected / Content</span>
              {phoneFeed.concat(phoneFeed).map((m, i) => (
                <div className={styles.feedItem} key={`${m.id}-${i}`}>
                  <Media item={m} locale={locale} compact sizes="12vh" />
                </div>
              ))}
            </div>

            <div className={styles.focus}>
              <div className={styles.layerImage} data-focus-image>
                <Media item={phoneFeed[2]!} locale={locale} className={styles.fillMedia} sizes="28vh" />
              </div>
              <span className={`${styles.screenCaption} micro`}>Focus / Direction</span>
            </div>

            <div className={styles.story}>
              <div className={styles.layerImage} data-story-image>
                <Media item={phoneStory} locale={locale} className={styles.fillMedia} sizes="28vh" />
              </div>
              <span className={styles.storyProgress} aria-hidden="true" />
              <span className={`${styles.screenCaption} micro`}>Story / Marseille</span>
            </div>

            <div className={styles.campaign}>
              <div className={styles.layerImage} data-campaign-image>
                <Media item={socialPortal} locale={locale} className={styles.fillMedia} sizes="32vh" />
              </div>
              <span className={styles.campaignWord}>{content.phone.beats[3] ?? ''}</span>
            </div>

            <span className={styles.reflection} data-phone-detail aria-hidden="true" />
          </div>
        </div>

        {socialSatellites.slice(0, 3).map((m, i) => (
          <div
            className={styles.satellite}
            data-social-satellite
            data-social-slot={i + 1}
            key={m.id}
          >
            <Media item={m} locale={locale} compact sizes="20vw" />
          </div>
        ))}

        <div className={styles.crossing} data-social-crossing aria-hidden="true">
          <Media item={phoneStory} locale={locale} compact sizes="14vw" />
        </div>

        {/* ---------- SECTION 2 — behind ---------- */}
        <div className={styles.behind} data-behind>
          <span className={styles.behindWord} aria-hidden="true">
            Behind
          </span>
          <span className={styles.behindRule} data-behind-detail aria-hidden="true" />

          <figure className={styles.behindPrimary} data-behind-media>
            <Media item={behindMedia[0]!} locale={locale} sizes="42vw" />
          </figure>

          <figure className={styles.behindSecondary} data-behind-media>
            <Media item={behindMedia[1]!} locale={locale} sizes="16vw" />
          </figure>

          <div className={styles.behindCopy} data-behind-copy>
            <span className={`${styles.behindLabel} micro`}>{content.social.behind}</span>
            <p className={`${styles.statement} lead`}>{content.social.statement}</p>
            <ul className={`${styles.layers} micro`}>
              {content.social.layers.map((layer, i) => (
                <li key={layer}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {layer}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- SECTION 3 — habillage ---------- */}
        <div className={styles.interface}>
          <span className={`${styles.chapter} micro`} data-phone-entry>
            03 / {content.phone.heading}
          </span>
          <span className={`${styles.counter} micro`} data-phone-entry>
            09 : 16 / 04 beats
          </span>

          <div className={styles.beat} aria-hidden="true">
            {content.phone.beats.map((b) => (
              <span className="line-mask" key={b}>
                <span data-phone-beat>{b}</span>
              </span>
            ))}
          </div>

          <ol className={styles.sequenceRail} data-phone-detail aria-hidden="true">
            {content.phone.beats.map((b, i) => (
              <li data-phone-rail-item key={b}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {b}
              </li>
            ))}
          </ol>

          <span className={styles.progressTrack} data-phone-detail aria-hidden="true">
            <span data-phone-meter />
          </span>
        </div>

        {/* ---------- RACCORD — le plein cadre qui explose ---------- */}
        <div className={styles.portalFrame} data-portal-frame aria-hidden="true">
          <Media item={socialPortal} locale={locale} className={styles.portalMedia} sizes="100vw" />
        </div>

        {/* ---------- SECTION 4 — immersion ---------- */}
        <div className={styles.immersion} data-immersion aria-labelledby="immersion-title">
          <ImmersionCanvas
            className={styles.immersionCanvas}
            reduced={reduced}
            active={galleryActive}
            progress={galleryProgress}
            burst={burstValue}
            requestRenderRef={requestRenderRef}
          />

          <div className={styles.immersionCopy}>
            <span className={`${styles.immersionChapter} micro`} data-immersion-bit>
              04 / {content.immersion.heading}
            </span>
            <h2 id="immersion-title" className={`${styles.immersionHeading} display`} data-immersion-bit>
              {content.immersion.heading}
            </h2>
            <p className={`${styles.immersionStatement} lead`} data-immersion-bit>
              {content.immersion.statement}
            </p>
          </div>
        </div>

        <ArchivePlate
          className={styles.flatHandoff}
          locale={locale}
          marker="handoff"
          eyebrow={`05 / ${content.process.heading}`}
          title={content.process.sheet}
        />
        </div>

        <ReducedStory content={content} locale={locale} />
      </div>
    </section>
  );
}
