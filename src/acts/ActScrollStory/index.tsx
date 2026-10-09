'use client';

import { useRef, type CSSProperties } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import {
  behindMedia,
  depthMedia,
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
import { releaseStage, setStage, setStageAnchor } from '@/lib/stage';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { registerVisualFilm } from '@/lib/visualQa';
import { StageLayer } from '@/shell/StageLayer';
import { ArchivePlate } from '@/ui/ArchivePlate';
import { Media } from '@/ui/Media';
import { NotebookFrame } from '@/ui/NotebookFrame';

import { PHONE_BEAT as BEAT, phonePhase, phoneReadingTime } from './phoneSequence';
import styles from './ActScrollStory.module.css';

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
  // Leave a real editorial opening hold: without it, the name is already
  // flying outside the phone viewport after the first touch scroll.
  heroHold: 0.42,
  socialIn: 1.18,
  /** Les détails complémentaires : troisième niveau de la hiérarchie. */
  detail: 2.02,
  invert: 2.46,
  behindIn: 2.76,
  phoneIn: 4.15,
  montage: 4.6,
  /** Le dernier contenu s'immobilise, le téléphone se recentre. */
  transfer: 6.70,
  /** L'écran est devenu la surface plein cadre. */
  screenFull: 7.38,
  /** Les couches se sont détachées. */
  separate: 8.14,
  /** La caméra a traversé : la main passe au chapitre « Le processus ». */
  corridor: 8.98,
  end: 8.98,
} as const;

/**
 * Correspondance scroll → chapitre du Canvas maître.
 * Écrite ici, une fois : c'est le seul endroit du projet où la partition de
 * scroll et la partition 3D se rencontrent.
 */
/**
 * Les deux tirages secondaires retenus dans `socialSatellites`.
 * Le choix est éditorial : une table de direction (00) et une main qui
 * sélectionne (01). Le reste du catalogue reste disponible ailleurs.
 */
const SECONDARY_PLATES = [0, 1] as const;

const STAGE_STEPS = [
  { at: T.transfer, to: T.screenFull, chapter: 1 },
  { at: T.screenFull, to: T.separate, chapter: 2 },
  { at: T.separate, to: T.corridor, chapter: 3 },
] as const;

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
  { id: 'act-immersion', start: T.transfer },
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

/**
 * Composition posée pour `prefers-reduced-motion`.
 *
 * Rendue **à la place** de la version animée, jamais en plus : deux copies du
 * même texte dans le DOM créent des doublons pour les lecteurs d'écran et pour
 * l'indexation. Le hook renvoie `false` au premier rendu, donc le serveur émet
 * toujours la version animée et le client retire l'une des deux.
 */
function ReducedStory({ content, locale }: Props) {
  const { hero, opening, social, phone } = content;

  return (
    <div className={styles.reducedStory}>
      <article className={styles.reducedPanel}>
        <span className="micro">01 / {opening.edition}</span>
        <h2 className={`${styles.reducedName} monument`}>
          {hero.firstName} <em>{hero.lastName}</em>
        </h2>
        <p className="lead">{opening.tagline}</p>
        <div className={styles.reducedHeroMedia}>
          <Media item={heroVertical} locale={locale} preload={false} sizes="42vh" />
        </div>
      </article>

      <article className={styles.reducedPanel}>
        <span className="micro">02 / {social.heading}</span>
        <h2 className="display">{social.front}</h2>
        <p className="lead">{social.frontStatement}</p>
        <div className={styles.reducedMediaPair}>
          <Media item={socialSatellites[0]!} locale={locale} sizes="44vw" />
          <Media item={behindMedia[0]!} locale={locale} sizes="44vw" />
        </div>
        <p className="lead">{social.statement}</p>
        <ol className={styles.reducedLayers}>
          {social.layers.map((layer, index) => (
            <li key={layer}>
              <span className="micro">{String(index + 1).padStart(2, '0')}</span>
              {layer}
            </li>
          ))}
        </ol>
      </article>

      <article className={`${styles.reducedPanel} ${styles.reducedPhonePanel}`}>
        <span className="micro">03 / {phone.heading}</span>
        <h2 className="display">{phone.beats.join(' · ')}</h2>
        <div className={styles.reducedPhoneMedia}>
          <Media item={phoneStory} locale={locale} sizes="52vw" />
        </div>
        <ol className={styles.reducedPhoneNotes}>
          {phone.notes.map((note, index) => <li key={note}><span className="micro">0{index + 1} / {phone.beats[index]}</span><p>{note}</p></li>)}
        </ol>
      </article>
      <article className={`${styles.reducedPanel} ${styles.reducedImmersion}`}>
        <span className="micro">04 / {content.immersion.heading}</span>
        <h2 className="display">{content.immersion.heading}</h2>
        <p className="lead">{content.immersion.statement}</p>
        <div className={styles.reducedMediaPair}>
          <Media item={depthMedia[1]!} locale={locale} sizes="44vw" />
          <Media item={depthMedia[2]!} locale={locale} sizes="44vw" />
        </div>
      </article>
    </div>
  );
}

export function ActScrollStory({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
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
          const frontBits = q<HTMLElement>('[data-front-bit]');
          const satellites = q<HTMLElement>('[data-social-satellite]');
          const satelliteImages = q<HTMLElement>('[data-social-image]');
          const satelliteCaptions = q<HTMLElement>('[data-social-caption]');
          const detailPlate = one('[data-social-detail]');

          const behind = one('[data-behind]');
          const behindMediaEls = q<HTMLElement>('[data-behind-media]');
          const behindBits = q<HTMLElement>('[data-behind-detail], [data-behind-copy]');
          const behindRows = q<HTMLElement>('[data-layer-row]');

          const phoneUi = q<HTMLElement>('[data-phone-entry], [data-phone-detail]');
          const phoneBeats = q<HTMLElement>('[data-phone-beat]');
          const phoneRail = q<HTMLElement>('[data-phone-rail-item]');
          const phoneNotes = q<HTMLElement>('[data-phone-note]');
          const phoneButtons = q<HTMLElement>('[data-phone-button]');
          const island = one(`.${styles.island}`);
          const feed = one(`.${styles.feed}`);
          const focus = one(`.${styles.focus}`);
          const story = one(`.${styles.story}`);
          const campaign = one(`.${styles.campaign}`);
          const screenHero = one('[data-screen-hero]');
          const screenEl = one('[data-phone-screen]');

          const stageGround = one('[data-stage-ground]');
          const transferCopy = q<HTMLElement>('[data-transfer-bit]');
          const screenGlass = one('[data-screen-glass]');
          const portalSurface = one('[data-portal-surface]');
          const depthPlates = q<HTMLElement>('[data-depth-plate]');
          const flat = one('[data-archive-plate="handoff"]');
          const flatSlots = q<HTMLElement>('[data-archive-plate="handoff"] [data-flat-slot]');
          const notebookFrame = one('[data-notebook-frame="story"]');
          const notebookImage = one('[data-notebook-frame="story"] [data-notebook-frame-image]');
          const notebookPaper = one('[data-notebook-frame="story"] [data-notebook-paper]');

          if (!ruleH || !behind || !frontCopy || !screenEl || !stageGround) return;

          /* ================================================================
             REDUCED MOTION — pas « sans animation » : une composition posée.
             ================================================================ */
          if (isReduced) {
            unlockScroll();
            emitReady();
            return;
          }

          const openingSeen = document.documentElement.dataset.shellReady === 'true';
          if (!openingSeen) lockScroll();

          /* ================================================================
             ÉTATS INITIAUX
             ================================================================ */
          const stageRect = stageEl.getBoundingClientRect();
          const cx = stageRect.left + stageRect.width / 2;
          const cy = stageRect.top + stageRect.height / 2;
          const NAME_SCALE = isDesktop ? 0.54 : 0.72;

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
          // Preserve the creator's original name reveal: opacity follows the editorial
          // tracking/camera movement without the mask displacement that could hide a line.
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

          gsap.set(frontCopy, { autoAlpha: 0 });
          gsap.set(frontBits, { autoAlpha: 0, y: 12 });
          /* Trois tirages seulement, très peu inclinés : une table de direction
             artistique se lit, elle ne s'éparpille pas. */
          const boardRotations = [-1.5, 1.1, -2];
          gsap.set(satellites, {
            autoAlpha: 0,
            clipPath: 'inset(100% 0% 0% 0%)',
            rotation: (index: number) => boardRotations[index] ?? 0,
          });
          gsap.set(satelliteImages, { scale: 1.075 });
          gsap.set(satelliteCaptions, { autoAlpha: 0, y: 6 });
          gsap.set(detailPlate, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' });

          gsap.set(behind, { autoAlpha: 0, scale: 0.94 });
          gsap.set(behindMediaEls, { clipPath: 'inset(0% 0% 100% 0%)', yPercent: 6 });
          gsap.set(behindBits, { autoAlpha: 0, y: 14 });
          // The five labels form ONE readable index. Staggered opacity left
          // "Calendrier / Direction" nearly invisible while the title was
          // already fully revealed on real iPhone screenshots.
          gsap.set(behindRows, { autoAlpha: 0, x: -6 });

          gsap.set(phoneUi, { autoAlpha: 0, y: 10 });
          gsap.set(phoneBeats, { y: 0, yPercent: 110, autoAlpha: 0 });
          gsap.set(phoneNotes, { yPercent: 104, autoAlpha: 0 });
          gsap.set(phoneRail, { autoAlpha: 1 });
          gsap.set(phoneButtons, { scaleY: 0 });
          gsap.set(island, { width: 0 });
          gsap.set(q<HTMLElement>('[data-phone-meter]'), { scaleY: 0 });
          gsap.set(screenHero, { yPercent: 0 });
          gsap.set(feed, { yPercent: 104 });
          gsap.set([focus, story, campaign], { clipPath: 'inset(100% 0% 0% 0%)' });

          gsap.set(stageGround, { autoAlpha: 0 });
          gsap.set(transferCopy, { autoAlpha: 0, y: 14 });
          gsap.set(screenGlass, { autoAlpha: 0 });
          gsap.set(portalSurface, { autoAlpha: 0, scale: 1 });
          gsap.set(depthPlates, { autoAlpha: 0, scale: 0.65, yPercent: 15 });
          gsap.set(flat, { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' });
          gsap.set(notebookFrame, { autoAlpha: 0 });
          // The actor owns visibility. The photograph itself stays opaque,
          // including after reverse-scrub; opacity is not a tween startAt.
          gsap.set(notebookImage, { autoAlpha: 1 });
          gsap.set(notebookPaper, { autoAlpha: 0, scaleX: 0.3, scaleY: 0.8 });
          gsap.set(q<HTMLElement>('[data-notebook-frame="story"] [data-notebook-folio]'), { autoAlpha: 0 });

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
            // The wine ink belongs on IVORY pages; on dark-wood hero it lost
            // contrast and erased half the surname. Keep the warm silver/
            // taupe editorial voice visible through the opening reveal.
            .to(last, { color: 'var(--warm-taupe)', duration: DUR.editorial }, 1.24)
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
          if (openingSeen) intro.progress(1);

          /* ================================================================
             PARTITION SCROLLÉE
             Chaque valeur dérivée (caméra et séparation des plans) dépend du
             playhead parent : aucun sous-mouvement autonome à désynchroniser.
             ================================================================ */
          /* Le rectangle de l'écran est republié à chaque frame du raccord :
             le plan WebGL naît donc dans la géométrie exacte du device, y
             compris pendant que celui-ci grandit. C'est ce qui remplace le
             fondu par une continuité. */
          const publishScreen = () => setStageAnchor('screen', screenEl);
          const film = { timeline: undefined as gsap.core.Timeline | undefined };
          const syncStage = () => {
            const timeline = film.timeline;
            if (!timeline) return;
            const t = timeline.time();
            // Phase identity is an explicit semantic contract. The opening's
            // independent intro is NOT allowed to repaint its marginalia once
            // a real social/movie chapter takes ownership of the film.
            stageEl.dataset.filmPhase = t >= T.socialIn - 0.02 ? 'narrative' : 'opening';
            // Race condition proved on real iPhone: if visitors begin
            // scrolling during the autonomous 2.3s opening animation, its
            // independent timeline keeps writing opacity=1 AFTER the scroll
            // film already entered Social / Behind. Hand ownership over to
            // the scroll director exactly once; do not let opener reappear.
            if (t > T.heroHold + 0.2 && intro.isActive()) {
              intro.pause();
              gsap.set([...metas, ...notebookDetails, disciplines], { autoAlpha: 0 });
              if (t >= T.socialIn) gsap.set(heroFrameEl, { autoAlpha: 0 });
            }
            // Safari can retain an opening photo when its clip-path tween is
            // composited out of the pinned layer. Enforce act ownership: this
            // hero-only print may NEVER be visible over Social/Strategy/Phone.
            if (t > T.socialIn + 0.18) gsap.set(heroFrameEl, { autoAlpha: 0 });
            const phase = phonePhase(t, T.montage, T.transfer - 0.06, phoneRail.length);
            phoneRail.forEach((rail, index) => { rail.dataset.active = String(index === phase); });
            if (!isDesktop || !timeline.scrollTrigger?.isActive || t < T.transfer - 0.35 || t >= T.end) {
              releaseStage('story');
              return;
            }
            publishScreen();
            flatSlots.forEach((slot, index) => setStageAnchor(`flat-${index}`, slot));
            if (t < T.transfer) {
              setStage(-1, 'story');
              return;
            }
            const step = STAGE_STEPS.find((s) => t < s.to) ?? STAGE_STEPS[STAGE_STEPS.length - 1]!;
            const local = gsap.utils.clamp(0, 1, (t - step.at) / (step.to - step.at));
            setStage(step.chapter - 1 + local, 'story');
          };

          const tl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            onUpdate: syncStage,
            scrollTrigger: {
              trigger: rootEl,
              id: 'opening-film',
              start: 'top top',
              end: `+=${Math.round(SCROLL_VH * (isDesktop ? 1 : MOBILE_RATIO))}%`,
              pin: stageEl,
              pinSpacing: true,
              scrub: 0.55,
              invalidateOnRefresh: true,
              onLeave: () => releaseStage('story'),
              onLeaveBack: () => releaseStage('story'),
              onEnterBack: syncStage,
              onRefresh: syncStage,
            },
          });
          film.timeline = tl;

          /* ---------------------------------------------------------------
             SECTION 1 — LA COUVERTURE DEVIENT UN CADRAGE
             Une seule idée : tout se retire sauf une image, et la page naît
             d'elle. Le nom ne disparaît pas — il passe DERRIÈRE le média.
             --------------------------------------------------------------- */
          const heroMediaH = () => window.innerHeight * (isDesktop ? 0.52 : 0.34);
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
              // The autoplay intro and scroll scrub must NEVER both own the
              // same handwriting/folio opacity. If the visitor scrolls before
              // the 2.3 s intro settles, scroll takes precedence immediately.
              // Without overwrite, 'ideas become direction' reappeared ON TOP
              // of the Strategy rows on a real iPhone screen.
              { autoAlpha: 0, duration: 0.42, stagger: 0.03, overwrite: 'auto' },
              T.heroHold + 0.1,
            )
            .to(
              heroFrameEl,
              // Safari/WebKit on iPhone can leave a clipped media plate visible
              // even when the 100% inset should hide it. The hero proof must
              // physically EXIT before it can cover the Social strategy list.
              { xPercent: -46, yPercent: 22, clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 0, duration: 0.5 },
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
            // La page ne s'allume plus d'un set() brutal : elle passe de 0 à
            // la taille du média en douceur, puis se déplie jusqu'au plein cadre.
            .to(
              page,
              {
                autoAlpha: 1,
                scaleX: () => heroMediaW() / window.innerWidth,
                scaleY: () => heroMediaH() / window.innerHeight,
                duration: 0.18,
                ease: 'power2.out',
              },
              T.heroHold + 0.58,
            )
            .to(
              page,
              { scaleX: 1, scaleY: 1, duration: 0.62, ease: 'power3.inOut' },
              T.heroHold + 0.62,
            );

          /* ---------------------------------------------------------------
             SECTION 2 — LA DOUBLE PAGE
             Hiérarchie explicite et non négociable :
               1. l'image principale (le média persistant) prend sa place ;
               2. l'intention est écrite ;
               3. deux tirages secondaires légendés arrivent ;
               4. un détail complémentaire, seul, ferme la page ;
               5. la page se retourne sur « ce qui le tient ».
             Tout ce qui ne sert pas cette lecture a été retiré.
             --------------------------------------------------------------- */
          tl.to(
            device,
            {
              left: isDesktop ? '42%' : '50%',
              top: isDesktop ? '48%' : '49%',
              // ONE hero print. The old 43vw mobile source looked like an
              // incidental tiny third tile; the authored poster is now a
              // dominant full-page photographic subject before becoming the
              // physical screen of the phone in Act 03.
              width: isDesktop ? '23vw' : '66vw',
              // The autonomous opening may have paused before revealing
              // the media if the visitor scrolls early. The SCROLL owner must
              // explicitly own both visibility and crop in Act 02, otherwise
              // a huge blank magazine window appears on real iPhones.
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.5,
              ease: 'power2.inOut',
            },
            T.socialIn,
          )
            .to(frontCopy, { autoAlpha: 1, duration: 0.3 }, T.socialIn + 0.06)
            // 2 — l'intention, avant les images secondaires.
            .to(
              frontBits,
              { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.34 },
              T.socialIn + 0.12,
            )
            // 3 — deux tirages seulement, légendés et numérotés.
            .to(
              satellites,
              {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                stagger: 0.13,
                duration: 0.44,
              },
              T.socialIn + 0.42,
            )
            .to(satelliteImages, { scale: 1, stagger: 0.13, duration: 0.6 }, T.socialIn + 0.44)
            .to(
              satelliteCaptions,
              { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.3 },
              T.socialIn + 0.6,
            );

          // 4 — un seul détail complémentaire. Il arrive après, pas en même temps.
          tl.to(
            detailPlate,
            { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4 },
            T.detail,
          );

          // La hiérarchie s'inverse : le dominant recule, le tirage retenu avance.
          tl.to(device, { scale: 0.88, duration: 0.42 }, T.invert);
          const focusSatellite = satellites[1];
          if (focusSatellite) {
            tl.to(focusSatellite, { scale: 1.04, duration: 0.4 }, T.invert).to(
              focusSatellite,
              { scale: 1, duration: 0.34 },
              T.behindIn,
            );
          }

          // 5 — FRONT → BEHIND : la page se retourne sur sa strate porteuse.
          tl.to([frontCopy, detailPlate], { autoAlpha: 0, yPercent: -10, duration: 0.3 }, T.behindIn)
            .to(
              satellites,
              {
                clipPath: 'inset(0% 0% 100% 0%)',
                autoAlpha: 0,
                stagger: 0.06,
                duration: 0.4,
              },
              T.behindIn + 0.04,
            )
            .to(device, {
              scale: isDesktop ? 0.72 : 0.42,
              ...(isDesktop ? {} : { left: '83%', top: '28%' }),
              duration: 0.36,
            }, T.behindIn + 0.04)
            .to(behind, { autoAlpha: 1, scale: 1, duration: 0.32, ease: EASE.move }, T.behindIn + 0.08)
            .to(
              behindMediaEls,
              { clipPath: 'inset(0% 0% 0% 0%)', yPercent: 0, stagger: 0.08, duration: 0.28 },
              T.behindIn + 0.1,
            )
            .to(behindBits, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.2 }, T.behindIn + 0.18)
            .to(
              behindRows,
              // Deliberately reveal as a single semantic list, not a staircase
              // of unreadable grey words; GSAP scrub still reverses naturally.
              { autoAlpha: 1, x: 0, duration: 0.14 },
              T.behindIn + 0.22,
            );

          /* ---------------------------------------------------------------
             SECTION 3 — LE CONTENU EN SITUATION
             Le device NAÎT autour du média. Il n'est pas posé : il pousse.
             --------------------------------------------------------------- */
          const phoneW = () => Math.min(window.innerHeight * (isDesktop ? 0.35 : 0.255), window.innerWidth * (isDesktop ? 0.27 : 0.58));
          const bezel = isDesktop ? 10 : 8;
          const radius = isDesktop ? 44 : 36;
          const collectX = (_index: number, target: HTMLElement) => {
            const rect = target.getBoundingClientRect();
            return window.innerWidth / 2 - (rect.left + rect.width / 2);
          };
          const collectY = (_index: number, target: HTMLElement) => {
            const rect = target.getBoundingClientRect();
            return window.innerHeight / 2 - (rect.top + rect.height / 2);
          };

          tl.to(behindBits, { autoAlpha: 0, y: -8, duration: 0.1 }, T.phoneIn - 0.5)
            // Les tirages de stratégie sont physiquement repris par l'écran :
            // moodboard et planning deviennent les premières unités du feed.
            .to(
              behindMediaEls,
              {
                x: collectX,
                y: collectY,
                scale: isDesktop ? 0.17 : 0.24,
                rotation: (index: number) => (index === 0 ? -2.4 : 2.2),
                stagger: 0.045,
                duration: 0.34,
                ease: 'power2.inOut',
              },
              T.phoneIn - 0.5,
            )
            .to(
              device,
              {
                left: '50%',
                top: isDesktop ? '50%' : '40%',
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                width: () => `${Math.round(phoneW())}px`,
                duration: 0.5,
                ease: 'power2.inOut',
              },
              T.phoneIn - 0.4,
            )
            .to(behindMediaEls, { autoAlpha: 0, duration: 0.16 }, T.phoneIn - 0.17)
            .to(behind, { autoAlpha: 0, duration: 0.2 }, T.phoneIn - 0.14)
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
              T.phoneIn - 0.12,
            )
            .to(
              device,
              { '--phone-radius': `${radius}px`, duration: 0.34, ease: 'power2.out' },
              T.phoneIn + 0.02,
            )
            .to(phoneButtons, { scaleY: 1, duration: 0.22 }, T.phoneIn + 0.1)
            .to(island, { width: isDesktop ? 88 : 70, duration: 0.26 }, T.phoneIn + 0.12)
            .to(phoneUi, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.3 }, T.phoneIn + 0.16)
            .to(q<HTMLElement>('[data-phone-meter]'), { scaleY: 1, duration: 2.2 }, T.montage);

          /* MONTAGE — quatre étapes, une seule réellement active à la fois.
             Le pas est de 0.44 vh au lieu de 0.5 : la séquence est raccourcie
             d'environ 15 % sans qu'aucune étape ne soit sacrifiée. */
          tl.to(screenHero, { yPercent: -101, duration: 0.32 }, T.montage)
            .to(feed, { yPercent: 0, duration: 0.32 }, T.montage)
            .to(feed, { yPercent: -22, duration: 0.46 }, T.montage + 0.38)
            .to(focus, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18 }, T.montage + BEAT)
            .to(q<HTMLElement>('[data-focus-image]'), { scale: 1.06, duration: 0.22 }, T.montage + BEAT)
            .to(story, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18 }, T.montage + BEAT * 2)
            .to(q<HTMLElement>('[data-story-image]'), { scale: 1.05, duration: 0.22 }, T.montage + BEAT * 2)
            .to(campaign, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.18 }, T.montage + BEAT * 3)
            .fromTo(
              q<HTMLElement>('[data-campaign-image]'),
              { scale: 1.09 },
              { scale: 1, duration: 0.22 },
              T.montage + BEAT * 3,
            );

          /* Le rail latéral et le grand mot de l'étape sont pilotés par le même
             repère temporel : ils ne peuvent pas se désynchroniser. L'étape
             quittée reste lisible (0.5) au lieu de disparaître. */
          content.phone.beats.forEach((_, i) => {
            const beat = phoneBeats[i];
            const rail = phoneRail[i];
            const note = phoneNotes[i];
            if (!beat || !rail || !note) return;
            const at = T.montage + 0.06 + i * BEAT;
            tl.to(beat, { yPercent: 0, autoAlpha: 1, duration: 0.1 }, at)
              .to(note, { yPercent: 0, autoAlpha: 1, duration: 0.1 }, at);
            // The final campaign has a real photographic reading hold before
            // its surface grows into Immersion. The global handoff owns its exit.
            if (i < content.phone.beats.length - 1) {
              tl.to(beat, { yPercent: -110, autoAlpha: 0, duration: 0.1 }, at + BEAT - 0.1)
                .to(note, { yPercent: -104, autoAlpha: 0, duration: 0.1 }, at + BEAT - 0.1);
            }
          });

          /* ===============================================================
             TÉLÉPHONE → UNIVERS 3D
             Le grand raccord. Un seul mouvement, une seule surface.

             1. le dernier contenu s'immobilise (le montage est fini) ;
             2. le téléphone se recentre ;
             3. la caméra se rapproche : le device grandit, l'écran avec lui —
                le plan WebGL est ancré sur `[data-phone-screen]`, il grandit
                donc *exactement* comme lui, sans un pixel d'écart ;
             4. le cadre sort du champ : bezel, boutons et rayon s'annulent
                pendant que le device dépasse le viewport ;
             5. l'écran devient la surface plein cadre (chapitre 1) ;
             6-8. les couches se détachent et avancent (chapitre 2) ;
             9-10. la caméra traverse et la planche contact se résout
                (chapitre 3, repris par l'acte « Le processus »).

             Aucun `set()` d'opacité sur un calque entier, aucun flash : tout
             est une interpolation continue, donc réversible.
             =============================================================== */

          /* Approach ends at the exact viewport rectangle. Arbitrary 1.12×
             overscale changed the crop when the full-frame DOM twin arrived. */

          tl
            // 1-2 — immobilisation et recentrage.
            .to(
              device,
              { left: '50%', top: '50%', xPercent: -50, yPercent: -50, duration: 0.24 },
              T.transfer - 0.04,
            )
            .to(
              [...phoneUi, ...phoneBeats, ...phoneNotes],
              { autoAlpha: 0, y: -8, duration: 0.18 },
              T.transfer - 0.08,
            )
            // A printed photographic aperture, not an anonymous black handset.
            .to(campaign, { '--campaign-shade': 0, duration: 0.2 }, T.transfer - 0.2)
            .to(q<HTMLElement>('[data-campaign-ui]'), { autoAlpha: 0, duration: 0.2 }, T.transfer - 0.2)
            // Le fond passe au chocolat profond : la page devient un espace.
            .to(stageGround, { autoAlpha: 1, duration: 0.5 }, T.transfer - 0.1)
            // 3 — approche. Le device grandit, le plan WebGL est ancré sur lui.
            .to(
              device,
              {
                scale: 1,
                width: () => stageEl.clientWidth,
                height: () => stageEl.clientHeight,
                duration: T.screenFull - T.transfer,
                ease: 'power2.inOut',
              },
              T.transfer,
            )
            // Le contenu DOM de l'écran s'efface *sous* le plan WebGL qui le
            // recouvre déjà : on ne voit donc rien s'éteindre.
            // Le contenu DOM reste sous son jumeau WebGL : fallback sans vide.
            .to(screenGlass, { autoAlpha: 1, duration: 0.2 }, T.transfer + 0.05)
            // 4 — le cadre sort du champ.
            .to(
              device,
              {
                '--phone-bezel': '0px',
                '--phone-radius': '0px',
                borderColor: 'transparent',
                borderWidth: 0,
                backgroundColor: 'transparent',
                duration: 0.34,
              },
              T.transfer + 0.22,
            )
            .to(phoneButtons, { scaleY: 0, duration: 0.2 }, T.transfer + 0.18)
            .to(island, { width: 0, duration: 0.2 }, T.transfer + 0.18)
            .to(screenGlass, { autoAlpha: 0, duration: 0.2 }, T.screenFull - 0.3)
            .set(device, { autoAlpha: 0 }, T.screenFull)
            // Ce qui restait de la section 2 quitte la scène avant le plein cadre.
            .to(
              [behind, ...satellites, frontCopy, detailPlate],
              { autoAlpha: 0, duration: 0.24 },
              T.transfer,
            )
            // 6-10 — la légende du raccord, brève et lisible sur le fond sombre.
            .to(
              transferCopy,
              { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.2 },
              T.screenFull + 0.2,
            )
            .to(
              transferCopy,
              { autoAlpha: 0, y: -10, stagger: 0.05, duration: 0.24 },
              T.separate + 0.42,
            );

          // The DOM twin owns the full frame before the device retires;
          // never reveal a low-alpha portal underneath an already hidden screen.
          tl.to(portalSurface, { autoAlpha: 1, duration: 0.01 }, T.screenFull - 0.01);
          if (isDesktop) {
            tl.to(portalSurface, { scale: 0.72, autoAlpha: 0, duration: 0.5 }, T.screenFull + 0.06)
              .to(depthPlates, { autoAlpha: 1, scale: 1, yPercent: 0, stagger: 0.06, duration: 0.34 }, T.screenFull + 0.08)
              .to(depthPlates, { scale: 1.22, xPercent: (i: number) => i % 2 ? 95 : -95, autoAlpha: 0, stagger: 0.06, duration: 0.64 }, T.separate - 0.1);
          } else {
            // Resolve the crop BEFORE the sensory reading hold, not during its exit.
            tl.to(portalSurface, { scale: 0.84, duration: 0.3 }, T.screenFull + 0.04)
              .to(portalSurface, { autoAlpha: 0, duration: 0.22 }, T.end - 0.96);
          }
          tl.to(flat, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.28 }, T.end - 0.94);

          // A selected photographic print grows into the first bound spread.
          // The incoming component is a twin, not a second four-photo gallery.
          const firstFlat = flatSlots[0];
          if (firstFlat && notebookFrame && notebookImage && notebookPaper) {
            const at = T.end - 0.64;
            tl.set(notebookFrame, { autoAlpha: 1 }, at)
              .set(firstFlat, { autoAlpha: 0 }, at)
              .fromTo(notebookImage, {
                autoAlpha: 1,
                x: () => firstFlat.offsetLeft + firstFlat.offsetWidth / 2 - (notebookImage.offsetLeft + notebookImage.offsetWidth / 2),
                y: () => firstFlat.offsetTop + firstFlat.offsetHeight / 2 - (notebookImage.offsetTop + notebookImage.offsetHeight / 2),
                scale: () => firstFlat.offsetWidth / notebookImage.offsetWidth,
              }, {
                x: 0, y: 0, scale: 1, autoAlpha: 1,
                duration: 0.48, ease: EASE.handoff, immediateRender: false,
              }, at)
              .to(flatSlots.slice(1), { autoAlpha: 0, xPercent: 38, duration: 0.28 }, at)
              .to(q<HTMLElement>('[data-archive-plate="handoff"] .micro'), { autoAlpha: 0, duration: 0.12 }, at)
              .to(notebookPaper, { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.38, ease: EASE.handoff }, at + 0.12)
              .to(q<HTMLElement>('[data-notebook-frame="story"] [data-notebook-folio]'), { autoAlpha: 1, duration: 0.12 }, T.end - 0.2);
          }

          // Verrou de durée : la partition vaut exactement T.end.
          tl.to({}, { duration: 0.01 }, T.end - 0.01);
          Object.entries({ hero: 0, social: T.socialIn, behind: T.behindIn, phone: T.phoneIn, feed: T.montage, focus: T.montage + BEAT, story: T.montage + BEAT * 2, campaign: T.montage + BEAT * 3, portal: T.transfer, depth: T.screenFull, flat: T.end - 0.34 }).forEach(([label, at]) => tl.addLabel(label, at));

          const unregisterQA = registerVisualFilm('opening', tl, {
            hero: 0.25, social: 2.28, behind: 3.64,
            feed: phoneReadingTime(0, T.montage), focus: phoneReadingTime(1, T.montage),
            story: phoneReadingTime(2, T.montage), campaign: phoneReadingTime(3, T.montage),
            screen: T.screenFull - 0.005,
            portal: T.screenFull, immersion: T.screenFull + 0.48,
            paper: T.end - 0.12, seam: T.end,
          });
          const onResize = () => syncStage();
          window.addEventListener('resize', onResize);

          return () => {
            unregisterQA();
            window.removeEventListener('resize', onResize);
            setStageAnchor('screen', null);
            releaseStage('story');
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
        mm.revert();
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
        {/* Le sol du raccord : le chocolat profond monte sous le téléphone,
            donc la page ne « change pas de couleur », elle s'enfonce. */}
        <div className={styles.stageGround} data-stage-ground aria-hidden="true" />
        <div className={styles.depthFallback} aria-hidden="true">
          <div className={styles.portalSurface} data-portal-surface>
            <Media item={socialPortal} locale={locale} className={styles.fillMedia} sizes="(max-width: 1023px) 180svh, 1920px" />
          </div>
          {depthMedia.slice(1).map((item, index) => (
            <figure className={styles.depthPlate} data-depth-plate data-depth-slot={index} key={item.id}>
              <Media item={item} locale={locale} compact sizes="(max-width: 1023px) 55vw, 30vw" />
            </figure>
          ))}
        </div>
        <StageLayer />
        <ArchivePlate locale={locale} marker="handoff" className={styles.flatHandoff} />
        <NotebookFrame locale={locale} marker="story" className={styles.notebookHandoff} />

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

        {/* ---------- SECTION 2 — LA DOUBLE PAGE ----------
            Une grille éditoriale, un titre, une intention, des légendes.
            L'espace négatif est un élément de composition, pas un oubli. */}
        <div className={styles.frontComposition} data-front-copy>
          <span className={`${styles.frontChapter} micro`}>
            <em>02</em> / {content.social.heading}
          </span>
          <h2 className={styles.frontLabel} data-front-bit>
            {content.social.front}
          </h2>
          <p className={`${styles.frontIntent} lead`} data-front-bit>
            {content.social.frontStatement}
          </p>
          <span className={`${styles.frontCount} micro`} data-front-bit>
            Table 02 — direction artistique
          </span>
          <span className={styles.frontRule} data-front-bit aria-hidden="true" />
          <span className={`${styles.frontNote} hand-note`} data-front-bit aria-hidden="true">
            mood · matière · rythme
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
              <div className={styles.feedProfile} aria-hidden="true">
                <span>GD</span>
                <strong>Studio / contenu</strong>
                <small>Marseille · aujourd’hui</small>
              </div>
              <span className={`${styles.feedTitle} micro`}>Feed / 12 posts</span>
              {phoneFeed.concat(phoneFeed).map((m, i) => (
                <div className={styles.feedItem} key={`${m.id}-${i}`}>
                  <Media item={m} locale={locale} compact sizes="20vh" />
                </div>
              ))}
              <span className={styles.feedTabs} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className={styles.focus}>
              <div className={styles.layerImage} data-focus-image>
                <Media item={phoneFeed[2]!} locale={locale} className={styles.fillMedia} sizes="(max-width: 1023px) 55svh, 76vh" />
              </div>
              <span className={`${styles.reelLabel} micro`}>Reel / Cut 00:14</span>
              <span className={styles.reelPlay} aria-hidden="true">▶</span>
              <span className={styles.reelTimeline} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={`${styles.screenCaption} micro`}>Focus / Montage</span>
            </div>

            <div className={styles.story}>
              <div className={styles.layerImage} data-story-image>
                <Media item={phoneStory} locale={locale} className={styles.fillMedia} sizes="28vh" />
              </div>
              <span className={styles.storyProgress} aria-hidden="true" />
              <span className={styles.storySticker} aria-hidden="true">
                <small>Votre mood ?</small>
                <strong>Jour</strong>
                <strong>Nuit</strong>
              </span>
              <span className={`${styles.screenCaption} micro`}>Story / Marseille</span>
            </div>

            <div className={styles.campaign}>
              <div className={styles.layerImage} data-campaign-image>
                <Media
                  item={socialPortal}
                  locale={locale}
                  className={styles.fillMedia}
                  loading="eager"
                  sizes="(max-width: 1023px) 180svh, 1920px"
                />
              </div>
              <span className={styles.cameraFocus} data-campaign-ui aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={`${styles.campaignMeta} micro`} data-campaign-ui>Carousel 04 / 04 · publié</span>
              <span className={styles.campaignWord} data-campaign-ui>{content.phone.beats[3] ?? ''}</span>
              <span className={styles.carouselDots} data-campaign-ui aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>

            <span className={styles.reflection} data-phone-detail aria-hidden="true" />
            {/* Reflet d'approche : il signale que la caméra entre dans la
                surface de verre, juste avant que le cadre ne sorte du champ. */}
            <span className={styles.screenGlass} data-screen-glass aria-hidden="true" />
          </div>
        </div>

        {/* Deux tirages secondaires. Pas cinq : la hiérarchie est le sujet. */}
        {SECONDARY_PLATES.map((slot, i) => (
          <figure
            className={styles.satellite}
            data-social-satellite
            data-social-slot={i + 1}
            key={socialSatellites[slot]!.id}
          >
            <div className={styles.satelliteImage} data-social-image>
              <Media item={socialSatellites[slot]!} locale={locale} compact sizes="24vw" />
            </div>
            <figcaption className={`${styles.satelliteCaption} micro`} data-social-caption>
              <span>
                <em>{String(i + 2).padStart(2, '0')}</em> {socialSatellites[slot]!.role}
              </span>
              <span aria-hidden="true">Pl. {String(i + 2).padStart(2, '0')}</span>
            </figcaption>
          </figure>
        ))}

        {/* Le détail complémentaire : troisième et dernier niveau de lecture. */}
        <figure className={styles.detailPlate} data-social-detail>
          <Media item={socialSatellites[2]!} locale={locale} compact sizes="14vw" />
          <figcaption className={`${styles.detailCaption} micro`}>
            <em>04</em> {socialSatellites[2]!.role}
          </figcaption>
        </figure>

        {/* ---------- SECTION 2 — behind ---------- */}
        <div className={styles.behind} data-behind>
          <span className={styles.behindWord} aria-hidden="true">
            Behind
          </span>
          <span className={styles.behindRule} data-behind-detail aria-hidden="true" />

          <figure className={styles.behindPrimary} data-behind-media>
            <Media item={behindMedia[0]!} locale={locale} sizes="(max-width: 1023px) 65vw, 42vw" />
          </figure>

          <figure className={styles.behindSecondary} data-behind-media>
            <Media item={behindMedia[1]!} locale={locale} sizes="16vw" />
          </figure>

          <div className={styles.behindCopy} data-behind-copy>
            <span className={`${styles.behindLabel} micro`}>
              <em>02.2</em> / {content.social.behind}
            </span>
            <h3 className={`${styles.behindTitle} title`}>{content.social.behind}</h3>
            <p className={`${styles.statement} lead`}>{content.social.statement}</p>
            {/* Les cinq strates : une liste numérotée, contrastée, sans décor.
                Les pictogrammes précédents rendaient la colonne illisible. */}
            <ol className={styles.layers}>
              {content.social.layers.map((layer, i) => (
                <li key={layer} data-layer-row>
                  <span className={`${styles.layerIndex} micro`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <strong>{layer}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ---------- SECTION 3 — habillage ---------- */}
        <div className={styles.interface}>
          <span className={`${styles.chapter} micro`} data-phone-entry>
            <em>03</em> / {content.phone.heading}
          </span>
          <span className={`${styles.counter} micro`} data-phone-entry>
            04 étapes · format 9:16
          </span>

          <div className={styles.beat} aria-hidden="true">
            {content.phone.beats.map((b) => (
              <span className="line-mask" key={b}>
                <span data-phone-beat>{b}</span>
              </span>
            ))}
          </div>

          {/* Le rail est la carte de la séquence : les quatre étapes restent
              visibles et lisibles, une seule est active. */}
          <ol className={styles.sequenceRail} data-phone-detail aria-hidden="true">
            {content.phone.beats.map((b, i) => (
              <li data-phone-rail-item key={b}>
                <span className={styles.railIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.railLabel}>{b}</span>
                <i className={styles.railMark} />
              </li>
            ))}
          </ol>
          <div className={styles.phoneNotes} aria-hidden="true">
            {content.phone.notes.map((note) => <p className="line-mask" key={note}><span data-phone-note>{note}</span></p>)}
          </div>

          <span className={styles.progressTrack} data-phone-detail aria-hidden="true">
            <span data-phone-meter />
          </span>
        </div>

        {/* ---------- RACCORD ----------
            Le contenu réel du raccord est rendu par le Canvas maître. Ici, la
            seule légende : elle nomme ce que le visiteur est en train de voir,
            pour qu'aucun plan ne soit gratuit. */}
        <div className={styles.transfer} aria-hidden="true">
          <span className={`${styles.transferLabel} micro`} data-transfer-bit>
            {content.immersion.heading}
          </span>
          <p className={`${styles.transferStatement} lead`} data-transfer-bit>
            {content.immersion.statement}
          </p>
        </div>
        </div>

        {reduced && <ReducedStory content={content} locale={locale} />}
      </div>
    </section>
  );
}
