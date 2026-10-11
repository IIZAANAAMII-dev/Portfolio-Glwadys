'use client';

import { useRef, type CSSProperties } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import {
  behindMedia,
  heroVertical,
  phoneFeed,
  phoneStory,
  socialPortal,
  socialSatellites,
} from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/motion';
import { emitReady, unlockScroll } from '@/lib/scrollControl';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { registerVisualFilm } from '@/lib/visualQa';
import { Media } from '@/ui/Media';
import { NotebookFrame } from '@/ui/NotebookFrame';

import styles from './ActScrollStory.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/**
 * CHAPITRE 1 — « DÉVELOPPER ».
 * docs/flagship/23-sonnet-cinematic-creative-treatment.md, scènes 1 → 3.
 *
 * Une chambre noire. Un seul objet traverse tout l'acte : L'OUVERTURE
 * (`[data-aperture]`), une fenêtre plein cadre dont seul le `clip-path`
 * change. Les images qu'elle contient ne sont JAMAIS redimensionnées pendant
 * un raccord : quand le tirage devient plein cadre, quand le plein cadre
 * devient l'écran, quand l'écran redevient la salle, c'est la fenêtre qui
 * bouge — le cadrage reste, au pixel près, le même.
 *
 *   1. Black Room   — un filet de pantographe trace l'axe, le tirage s'ouvre
 *                     depuis lui, sous lumière inactinique (voile vin).
 *   2. Full Bleed   — l'ouverture gagne le cadre entier, le voile se
 *                     « développe », puis trois photogrammes avancent.
 *   3. Projecteur   — la salle devient vin, l'ouverture se referme sur un
 *                     écran 9:16 sans téléphone dessiné ; quatre formats.
 *   4. Immersion    — l'écran se rouvre : la campagne devient la salle.
 *   5. Tirage       — l'ouverture se referme sur le tirage du carnet, la
 *                     lumière se rallume (ivoire) : relais vers ActProcess.
 *
 * Une seule timeline scrubée possède l'ouverture. L'ouverture autonome
 * (intro) écrit sur un nœud ENFANT distinct : aucune propriété partagée.
 */

/** Partition en hauteurs de viewport de scroll. */
const T = {
  develop: 0.46,
  socialIn: 1.32,
  frames: 2.0,
  frameStep: 0.62,
  contract: 3.92,
  montage: 4.62,
  transfer: 6.56,
  immersion: 7.26,
  print: 8.06,
  paper: 8.56,
  end: 9.12,
} as const;

const BEAT = 0.46;
const SCROLL_VH = T.end * 100;
const MOBILE_RATIO = 0.74;

const STORY_ACT_MARKERS = [
  { id: 'act-opening', start: 0 },
  { id: 'act-social', start: T.socialIn },
  { id: 'act-phone', start: T.contract },
  { id: 'act-immersion', start: T.transfer },
] as const;

/** Libellés de mise en scène (le contenu factuel reste dans `content`). */
const LABELS: Record<Locale, { issue: string; frame: string; layers: string; screen: string; reel: string }> = {
  fr: { issue: 'Nº 01', frame: 'Tirage', layers: 'Les strates', screen: 'Écran 9:16', reel: 'Format UGC' },
  en: { issue: 'No. 01', frame: 'Print', layers: 'The layers', screen: 'Screen 9:16', reel: 'UGC format' },
  ko: { issue: 'No. 01', frame: '프린트', layers: '레이어', screen: '스크린 9:16', reel: 'UGC 포맷' },
};

/** Les trois photogrammes du monde social et la strate qu'ils incarnent. */
const SOCIAL_FRAMES = [
  { media: behindMedia[0]!, layer: 0 },
  { media: behindMedia[1]!, layer: 1 },
  { media: socialSatellites[0]!, layer: 4 },
] as const;

type ActMarkerStyle = CSSProperties & {
  '--marker-top': string;
  '--marker-height': string;
  '--marker-mobile-top': string;
  '--marker-mobile-height': string;
};

function markerStart(start: number, ratio: number) {
  if (start === 0) return 0;
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

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Composition posée pour `prefers-reduced-motion` : mêmes scènes, mêmes
 * bandes de couleur (encre → vin → image), une image dominante par scène,
 * aucune transformation en cours. Rendue À LA PLACE de la version animée.
 */
function ReducedStory({ content, locale }: Props) {
  const { hero, opening, social, phone, immersion } = content;
  const formats = [phoneFeed[0]!, phoneFeed[2]!, phoneStory, socialPortal];
  return (
    <div className={styles.reducedStory}>
      <article className={`${styles.reducedPanel} ${styles.reducedInk} ${styles.reducedCover}`}>
        <div className={`${styles.reducedChrome} micro`}>
          <span>{LABELS[locale].issue} — {opening.edition}</span>
          <span>{opening.topics}</span>
        </div>
        <h2 className={styles.reducedName}>
          <span>{hero.firstName}</span>
          <span>{hero.lastName}</span>
        </h2>
        <p className={styles.reducedRole}>
          <span>{opening.role[0]}</span>
          <span>{opening.role[1]}</span>
        </p>
        <figure className={styles.reducedHero}>
          <Media item={heroVertical} locale={locale} preload={false} sizes="(max-width: 1023px) 64vw, 28vw" />
          <figcaption className={styles.reducedCredit}>{opening.credit}</figcaption>
        </figure>
        <p className="lead">{opening.tagline}</p>
      </article>

      <article className={`${styles.reducedPanel} ${styles.reducedInk}`}>
        <span className="micro">02 / {social.heading}</span>
        <h2 className="display">{social.front}</h2>
        <p className="lead">{social.frontStatement}</p>
        <div className={styles.reducedStrip}>
          {SOCIAL_FRAMES.map(({ media }) => (
            <Media key={media.id} item={media} locale={locale} compact sizes="(max-width: 1023px) 30vw, 22vw" />
          ))}
        </div>
        <h3 className="title">{social.behind}</h3>
        <p className="lead">{social.statement}</p>
        <ol className={styles.reducedLayers}>
          {social.layers.map((layer, index) => (
            <li key={layer}><span className="micro">{pad(index + 1)}</span>{layer}</li>
          ))}
        </ol>
      </article>

      <article className={`${styles.reducedPanel} ${styles.reducedWine}`}>
        <span className="micro">03 / {phone.heading}</span>
        <ol className={styles.reducedFormats}>
          {phone.beats.map((beat, index) => (
            <li key={beat}>
              <Media item={formats[index]!} locale={locale} compact sizes="(max-width: 1023px) 40vw, 18vw" />
              <strong>{beat}</strong>
              <p>{phone.notes[index]}</p>
            </li>
          ))}
        </ol>
      </article>

      <article className={`${styles.reducedPanel} ${styles.reducedImmersion}`}>
        <div className={styles.reducedBleed}>
          <Media item={socialPortal} locale={locale} className={styles.fill} sizes="100vw" />
        </div>
        <span className="micro">04 / {immersion.heading}</span>
        <h2 className="display">{immersion.heading}</h2>
        <p className="lead">{immersion.statement}</p>
      </article>
    </div>
  );
}

export function ActScrollStory({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const labels = LABELS[locale];

  useGSAP(
    () => {
      const rootEl = root.current;
      const stageEl = stage.current;
      if (!rootEl || !stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const one = <E extends HTMLElement>(sel: string): E | null => q<E>(sel)[0] ?? null;

      const aperture = one('[data-aperture]');
      const heroSlot = one('[data-slot="hero"]');
      const screenSlot = one('[data-slot="screen"]');
      const printImage = one('[data-notebook-frame="story"] [data-notebook-frame-image]');
      if (!aperture || !heroSlot || !screenSlot || !printImage) return;

      const mm = gsap.matchMedia();

      mm.add({ isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced }, (ctx) => {
        const { isDesktop, isReduced } = ctx.conditions as { isDesktop: boolean; isReduced: boolean };

        if (isReduced) {
          unlockScroll();
          emitReady();
          return;
        }

        /* ---------- ACTEURS ---------- */
        const trace = one('[data-trace]');
        const marks = q<HTMLElement>('[data-mark]');
        const metas = q<HTMLElement>('[data-meta]');
        const nameWraps = q<HTMLElement>('[data-name]');
        const nameLines = q<HTMLElement>('[data-name-line]');
        const tagline = one('[data-tagline]');
        const glint = one('[data-glint]');
        const safelight = one('[data-safelight]');
        const scrim = one('[data-scrim]');
        const heroImage = one('[data-reel-layer="hero"] [data-reel-image]');

        const frontBits = q<HTMLElement>('[data-front-bit]');
        const behindBits = q<HTMLElement>('[data-behind-bit]');
        const socialLayers = q<HTMLElement>('[data-reel-layer="social"]');
        const socialImages = q<HTMLElement>('[data-reel-layer="social"] [data-reel-image]');
        const stripFill = one('[data-strip-fill]');
        const stripItems = q<HTMLElement>('[data-strip-item]');

        const room = one('[data-room]');
        const glow = one('[data-glow]');
        const phoneBits = q<HTMLElement>('[data-phone-bit]');
        const formats = q<HTMLElement>('[data-format]');
        const formatImages = q<HTMLElement>('[data-format] [data-format-image]');
        const beatWords = q<HTMLElement>('[data-beat-word]');
        const beatNotes = q<HTMLElement>('[data-beat-note]');
        const railItems = q<HTMLElement>('[data-rail-item]');
        const campaign = one('[data-reel-layer="campaign"]');
        const campaignImage = one('[data-reel-layer="campaign"] [data-reel-image]');
        const campaignPan = one('[data-campaign-pan]');

        const immersionBits = q<HTMLElement>('[data-immersion-bit]');
        const notebook = one('[data-notebook-frame="story"]');
        const notebookPaper = one('[data-notebook-frame="story"] [data-notebook-paper]');
        const notebookFolio = one('[data-notebook-frame="story"] [data-notebook-folio]');
        const paperRoom = one('[data-paper-room]');

        if (!heroImage || !campaign || !campaignImage || !campaignPan || !room || !glow) return;

        /* ---------- GÉOMÉTRIE ----------
           L'ouverture est pilotée par cinq variables CSS NUMÉRIQUES
           (--ap-t/r/b/l en % du stage, --ap-rad en px) que le CSS compose en
           `clip-path: inset(... round ...)`. Interpoler la chaîne clip-path
           elle-même était fragile (le navigateur normalise « inset(0%) » et
           le raccord sautait d'un coup) ; des nombres s'interpolent toujours.
           Chaque fenêtre est mesurée sur un gabarit CSS invisible. */
        type Box = { t: number; r: number; b: number; l: number };
        const boxOf = (el: HTMLElement): Box => {
          const s = stageEl.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return {
            t: ((r.top - s.top) / s.height) * 100,
            r: ((s.right - r.right) / s.width) * 100,
            b: ((s.bottom - r.bottom) / s.height) * 100,
            l: ((r.left - s.left) / s.width) * 100,
          };
        };
        const SCREEN_RADIUS = isDesktop ? 30 : 24;
        const windowOf = (el: HTMLElement, radius: number) => ({
          '--ap-t': () => boxOf(el).t,
          '--ap-r': () => boxOf(el).r,
          '--ap-b': () => boxOf(el).b,
          '--ap-l': () => boxOf(el).l,
          '--ap-rad': radius,
        });
        const FULL = { '--ap-t': 0, '--ap-r': 0, '--ap-b': 0, '--ap-l': 0, '--ap-rad': 0 };
        const heroWindow = windowOf(heroSlot, 0);
        const screenWindow = windowOf(screenSlot, SCREEN_RADIUS);
        const printWindow = windowOf(printImage, 0);

        /* Les repères de cadrage partent des coins du tirage vers les coins
           du cadre : le spectateur voit le cadrage s'agrandir. */
        const markTravel = (index: number, axis: 'x' | 'y') => {
          const s = stageEl.getBoundingClientRect();
          const r = heroSlot.getBoundingClientRect();
          const inset = isDesktop ? 28 : 16;
          if (axis === 'x') return index % 2 === 0 ? s.left + inset - r.left : s.right - inset - r.right;
          return index < 2 ? s.top + inset - r.top : s.bottom - inset - r.bottom;
        };

        /* ---------- ÉTATS INITIAUX ----------
           La couverture est déjà peinte par le CSS (tirage, titre, métier,
           crédit) : ces valeurs reprennent l'état SSR à l'identique, aucun
           élément visible n'est masqué à l'hydratation. */
        const openingSeen = document.documentElement.dataset.shellReady === 'true';

        gsap.set(aperture, { ...heroWindow, autoAlpha: 1 });
        aperture.dataset.armed = 'true';
        gsap.set(trace, { scaleX: 0, autoAlpha: 1 });
        gsap.set(marks, { autoAlpha: 0, x: 0, y: 0 });
        gsap.set(metas, { autoAlpha: 1 });
        gsap.set(nameLines, { yPercent: 0 });
        gsap.set(nameWraps, { xPercent: 0, autoAlpha: 1 });
        gsap.set(tagline, { autoAlpha: 0, y: 12 });
        gsap.set(glint, { xPercent: -130 });
        // Un voile léger : la couverture doit se lire comme une vraie photo
        // dès la première seconde ; le « développement » la libère au scroll.
        gsap.set(safelight, { autoAlpha: 0.26 });
        gsap.set(scrim, { autoAlpha: 0 });
        gsap.set(heroImage, { scale: 1.16, yPercent: 0 });

        gsap.set(frontBits, { autoAlpha: 0, yPercent: 40 });
        gsap.set(behindBits, { autoAlpha: 0, y: 18 });
        gsap.set(socialLayers, { '--wipe': 100 });
        gsap.set(socialImages, { yPercent: 12, scale: 1.08 });
        gsap.set(stripFill, { scaleX: 0 });
        gsap.set(stripItems, { autoAlpha: 0.34 });

        gsap.set(room, { autoAlpha: 0 });
        gsap.set(glow, { autoAlpha: 0, scale: 0.7 });
        gsap.set(phoneBits, { autoAlpha: 0, y: 10 });
        gsap.set(formats, { '--wipe': 100 });
        gsap.set(formatImages, { yPercent: 10 });
        gsap.set(beatWords, { yPercent: 110, autoAlpha: 1 });
        gsap.set(beatNotes, { autoAlpha: 0, y: 10 });
        gsap.set(railItems, { autoAlpha: 0.32 });
        gsap.set(campaign, { '--wipe': 100 });
        gsap.set(campaignImage, { yPercent: 8, scale: 1 });
        // Desktop 16:9 : la marcheuse est à 32 % de l'image. La caméra la
        // recentre dans l'écran 9:16, puis repanote vers le plein cadre.
        gsap.set(campaignPan, { xPercent: isDesktop ? 18 : 0 });

        gsap.set(immersionBits, { autoAlpha: 0, y: 22 });
        gsap.set(notebook, { autoAlpha: 0 });
        gsap.set(printImage, { autoAlpha: 0 });
        gsap.set(notebookPaper, { autoAlpha: 0, scaleX: 0.3, scaleY: 0.8 });
        gsap.set(notebookFolio, { autoAlpha: 0 });
        gsap.set(paperRoom, { autoAlpha: 0 });

        /* ================================================================
           RÉGLAGE AUTONOME (~2,2 s), SANS VERROU DE SCROLL. Tout est déjà
           lisible : l'intro ne fait que « mettre au point ». Elle n'écrit
           que des propriétés qu'aucun tween scrubé ne touche : interlettrage
           du titre, x de la signature, échelle du tirage (nœud enfant de
           [data-reel-image]), trace.scaleX, marks/tagline, glint.xPercent.
           ================================================================ */
        const heroPrint = heroImage.firstElementChild as HTMLElement | null;
        const intro = gsap.timeline({ defaults: { ease: 'expo.out', overwrite: false } });
        intro
          // L'objectif fait le point : le tirage se pose, sans jamais disparaître.
          .to(heroPrint, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
          .to(trace, { scaleX: 1, duration: 0.9 }, 0)
          // Le titre de tête se resserre comme un logotype que l'on cale.
          .to(nameLines.slice(0, 1), { letterSpacing: '-0.02em', duration: 1.6, ease: 'power4.out' }, 0.05)
          // x (px) sur l'enveloppe : le scrub n'y écrit que xPercent.
          .to(nameWraps.slice(1), { x: 0, duration: 1.4, ease: 'power3.out' }, 0.2)
          .to(marks, { autoAlpha: 1, duration: 0.45, stagger: 0.05 }, 0.4)
          .to(tagline, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.5)
          // Un seul reflet d'argent traverse la bague : la matière, pas un effet.
          .to(glint, { xPercent: 130, duration: 1.5, ease: 'power2.inOut' }, 0.45)
          .add(() => emitReady(), 0.8);
        if (openingSeen) intro.progress(1);

        // Le visiteur prend la main dès qu'il le veut : l'intro est conclue
        // AVANT que le scrub ne lise ses valeurs de départ (scroll → tick).
        const finishIntro = () => {
          if (intro.progress() < 1) intro.progress(1);
        };
        window.addEventListener('scroll', finishIntro, { once: true, passive: true });

        /* ================================================================
           PARTITION SCROLLÉE — un seul propriétaire, `ease: none` par défaut,
           aucune action latérale : l'aller et le retour rejouent les mêmes
           images.
           ================================================================ */
        const tl = gsap.timeline({
          defaults: { ease: 'none', overwrite: false },
          onUpdate: () => {
            // Si le visiteur scrolle pendant l'ouverture autonome, elle est
            // conclue instantanément : un seul propriétaire à la fois.
            if (intro.isActive() && tl.time() > 0.02) intro.progress(1);
          },
          scrollTrigger: {
            trigger: rootEl,
            id: 'opening-film',
            start: 'top top',
            end: `+=${Math.round(SCROLL_VH * (isDesktop ? 1 : MOBILE_RATIO))}%`,
            pin: stageEl,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        /* ---- 1 → 2 : LE TIRAGE DEVIENT LE CADRE (développement) ---- */
        tl.addLabel('hero', 0)
          // immediateRender:true : l'état « tirage » est l'état AVANT ce tween,
          // et il est réappliqué à chaque refresh/retour (le simple set initial
          // était effacé sur desktop par l'invalidation du refresh).
          .fromTo(aperture, { ...heroWindow }, { ...FULL, duration: 0.86, ease: 'power2.inOut', immediateRender: true }, T.develop)
          .to(heroImage, { scale: 1, duration: 0.86, ease: 'power2.inOut' }, T.develop)
          .to(safelight, { autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, T.develop + 0.12)
          .to(trace, { autoAlpha: 0, duration: 0.24 }, T.develop)
          .fromTo(marks, { x: 0, y: 0 }, {
            x: (i: number) => markTravel(i, 'x'),
            y: (i: number) => markTravel(i, 'y'),
            duration: 0.86,
            ease: 'power2.inOut',
            immediateRender: false,
          }, T.develop)
          .to(marks, { autoAlpha: 0, duration: 0.2 }, T.socialIn - 0.1)
          // Le titre de couverture remonte dans son propre masque, comme une
          // page qu'on soulève ; le nom de famille glisse hors du cadre.
          .fromTo(nameLines.slice(0, 1), { yPercent: 0 }, {
            yPercent: -118,
            duration: 0.54,
            ease: 'power2.in',
            immediateRender: false,
          }, T.develop + 0.02)
          .to(nameWraps.slice(1), { xPercent: 52, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, T.develop + 0.04)
          .to([tagline, ...metas], { autoAlpha: 0, duration: 0.3 }, T.develop)
          .to(scrim, { autoAlpha: 1, duration: 0.4 }, T.develop + 0.5)
          // Le plein cadre est atteint : la phrase entre en traversant l'image.
          .to(frontBits, { autoAlpha: 1, yPercent: 0, duration: 0.34, stagger: 0.07, ease: 'power3.out' }, T.socialIn)
          .addLabel('social', T.socialIn);

        /* ---- 2 : TROIS PHOTOGRAMMES AVANCENT (bobine) ---- */
        const stripSpan = T.frameStep * 3 - 0.2;
        tl.to(frontBits, { autoAlpha: 0, yPercent: -30, duration: 0.26, stagger: 0.04, ease: 'power2.in' }, T.frames - 0.06)
          .to(behindBits, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power3.out' }, T.frames + 0.22)
          .to(stripFill, { scaleX: 1, duration: stripSpan }, T.frames);
        stripItems.forEach((item, index) => {
          tl.to(item, { autoAlpha: 1, duration: 0.12 }, T.frames + index * (stripSpan / stripItems.length));
        });
        socialLayers.forEach((layer, index) => {
          const at = T.frames + index * T.frameStep;
          const image = socialImages[index];
          const below = index === 0 ? heroImage : socialImages[index - 1];
          tl.to(layer, { '--wipe': 0, duration: 0.38, ease: 'power3.inOut' }, at);
          if (image) tl.to(image, { yPercent: 0, scale: 1, duration: 0.5, ease: 'power2.out' }, at);
          // Contre-mouvement : l'image quittée remonte, la profondeur se lit.
          if (below) tl.to(below, { yPercent: -7, duration: 0.38, ease: 'power3.inOut' }, at);
        });

        /* ---- 2 → 3 : LA SALLE DEVIENT VIN, LE CADRE DEVIENT ÉCRAN ---- */
        tl.addLabel('phone', T.contract)
          .to(behindBits, { autoAlpha: 0, y: -12, duration: 0.24, stagger: 0.03 }, T.contract - 0.06)
          // Les légendes de photogramme ne doivent pas être rognées par l'écran.
          .to(q<HTMLElement>('[data-frame-caption]'), { autoAlpha: 0, duration: 0.16 }, T.contract - 0.06)
          .to(scrim, { autoAlpha: 0, duration: 0.3 }, T.contract)
          .to(room, { autoAlpha: 1, duration: 0.4 }, T.contract)
          .fromTo(aperture, { ...FULL }, { ...screenWindow, duration: 0.62, ease: 'power3.inOut', immediateRender: false }, T.contract)
          .to(glow, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, T.contract + 0.2)
          .to(phoneBits, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out' }, T.contract + 0.42);

        /* ---- 3 : QUATRE FORMATS DANS LA MÊME LUMIÈRE ---- */
        const formatLayers = [...formats, campaign];
        const formatPics = [...formatImages, campaignImage];
        formatLayers.forEach((layer, index) => {
          const at = T.montage + index * BEAT;
          const word = beatWords[index];
          const note = beatNotes[index];
          const rail = railItems[index];
          const pic = formatPics[index];
          tl.to(layer, { '--wipe': 0, duration: 0.2, ease: 'power3.inOut' }, at)
            .to(glow, { scale: 1.06 + (index % 2) * 0.08, duration: 0.2 }, at);
          if (pic) tl.to(pic, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, at);
          if (word) tl.to(word, { yPercent: 0, duration: 0.16, ease: 'power3.out' }, at + 0.04);
          if (note) tl.to(note, { autoAlpha: 1, y: 0, duration: 0.16 }, at + 0.08);
          if (rail) tl.to(rail, { autoAlpha: 1, duration: 0.1 }, at);
          if (index < formatLayers.length - 1) {
            if (word) tl.to(word, { yPercent: -140, autoAlpha: 0, duration: 0.14, ease: 'power2.in' }, at + BEAT - 0.12);
            if (note) tl.to(note, { autoAlpha: 0, y: -8, duration: 0.12 }, at + BEAT - 0.12);
            if (rail) tl.to(rail, { autoAlpha: 0.32, duration: 0.1 }, at + BEAT - 0.04);
          }
        });

        /* ---- 3 → 4 : L'ÉCRAN SE ROUVRE, LA CAMPAGNE DEVIENT LA SALLE ---- */
        const lastBeat = [beatWords.at(-1), beatNotes.at(-1)].filter((el): el is HTMLElement => Boolean(el));
        tl.addLabel('portal', T.transfer)
          .to([...phoneBits, ...lastBeat], { autoAlpha: 0, duration: 0.2 }, T.transfer - 0.08)
          .fromTo(aperture, { ...screenWindow }, { ...FULL, duration: 0.64, ease: 'power3.inOut', immediateRender: false }, T.transfer)
          .to(campaignPan, { xPercent: 0, duration: 0.64, ease: 'power3.inOut' }, T.transfer)
          .to(glow, { autoAlpha: 0, duration: 0.3 }, T.transfer + 0.2)
          .to(campaignImage, { scale: 1.07, duration: T.print - T.transfer }, T.transfer)
          .to(scrim, { autoAlpha: 1, duration: 0.3 }, T.immersion - 0.2)
          .to(immersionBits, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: 'power3.out' }, T.immersion)
          .to(immersionBits, { autoAlpha: 0, y: -14, duration: 0.24, stagger: 0.04, ease: 'power2.in' }, T.print - 0.24)
          .to(scrim, { autoAlpha: 0, duration: 0.2 }, T.print - 0.1);

        /* ---- 4 → 5 : LE CADRE SE REFERME SUR LE TIRAGE, LA LUMIÈRE REVIENT ---- */
        tl.addLabel('print', T.print)
          .fromTo(aperture, { ...FULL }, { ...printWindow, duration: 0.46, ease: 'power3.inOut', immediateRender: false }, T.print)
          // Le tirage s'expose dans la fenêtre : même géométrie que le carnet
          // d'ActProcess. Un fondu d'exposition, puis la fenêtre se retire
          // derrière son jumeau exact.
          .set(notebook, { autoAlpha: 1 }, T.print + 0.3)
          .to(printImage, { autoAlpha: 1, duration: 0.16, ease: 'power1.inOut' }, T.print + 0.3)
          .set(aperture, { autoAlpha: 0 }, T.paper)
          .to(notebookPaper, { autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.36, ease: 'power2.inOut' }, T.paper)
          .to(paperRoom, { autoAlpha: 1, duration: 0.3 }, T.paper + 0.14)
          .to(notebookFolio, { autoAlpha: 1, duration: 0.12 }, T.end - 0.16)
          .to({}, { duration: 0.01 }, T.end - 0.01);

        const unregisterQA = registerVisualFilm('opening', tl, {
          hero: 0.2,
          develop: T.develop + 0.43,
          social: T.socialIn + 0.4,
          moodboard: T.frames + 0.5,
          planning: T.frames + T.frameStep + 0.5,
          direction: T.frames + T.frameStep * 2 + 0.5,
          screen: T.montage - 0.04,
          feed: T.montage + 0.3,
          focus: T.montage + BEAT + 0.3,
          story: T.montage + BEAT * 2 + 0.3,
          campaign: T.montage + BEAT * 3 + 0.3,
          immersion: T.immersion + 0.4,
          print: T.paper - 0.02,
          paper: T.end - 0.05,
          seam: T.end,
        });

        return () => {
          unregisterQA();
          window.removeEventListener('scroll', finishIntro);
          intro.kill();
          delete aperture.dataset.armed;
        };
      });

      /* Filet de sécurité : la navigation apparaît même si l'intro n'a pas
         tourné. Le scroll n'est plus jamais verrouillé par la couverture ;
         on libère tout verrou hérité d'une version précédente. */
      unlockScroll();
      const safety = window.setTimeout(emitReady, 1600);

      return () => {
        mm.revert();
        window.clearTimeout(safety);
      };
    },
    { scope: root },
  );

  const { opening, hero, social, phone, immersion } = content;

  return (
    <section ref={root} className={`act ${styles.act}`} aria-label={opening.edition}>
      <div className={styles.actMarkers} aria-hidden="true">
        {STORY_ACT_MARKERS.map((marker, index) => (
          <span className={styles.actMarker} id={marker.id} key={marker.id} style={markerStyle(index)} />
        ))}
      </div>

      <div ref={stage} className={styles.stage}>
        <h1 className="visually-hidden">
          {hero.firstName} {hero.lastName} — {opening.role.join(' · ')}
        </h1>

        <div className={styles.motionStory}>
          {/* Les sols. Encre (stage) → vin (salle de projection) → ivoire (tirage). */}
          <div className={styles.room} data-room aria-hidden="true" />
          <div className={styles.glow} data-glow aria-hidden="true" />
          <div className={styles.paperRoom} data-paper-room aria-hidden="true" />

          {/* Gabarits invisibles : la géométrie est écrite en CSS, mesurée en JS. */}
          <span className={`${styles.heroGeom} ${styles.traceSlot}`} aria-hidden="true">
            <span className={styles.trace} data-trace />
          </span>
          <span className={`${styles.heroGeom} ${styles.heroSlot}`} data-slot="hero" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span className={styles.mark} data-mark data-corner={i} key={i} />
            ))}
            {/* Crédit photo de couverture, posé le long du tirage. */}
            <span className={styles.coverCredit} data-meta>
              <span className={styles.coverCreditFull}>{opening.credit}</span>
              <span className={styles.coverCreditShort}>{opening.credit.split(', ').pop()}</span>
            </span>
          </span>
          <span className={`${styles.screenGeom} ${styles.screenSlot}`} data-slot="screen" aria-hidden="true" />

          {/* ---------- L'OUVERTURE ---------- */}
          <div className={styles.aperture} data-aperture aria-hidden="true">
            <div className={styles.apertureIntro} data-aperture-intro>
              <div className={styles.layer} data-reel-layer="hero">
                <div className={styles.reelImage} data-reel-image>
                  <Media item={heroVertical} locale={locale} className={styles.fill} sizes="100vw" />
                </div>
                <span className={styles.glint} data-glint />
              </div>

              {SOCIAL_FRAMES.map(({ media, layer }, index) => (
                <div className={styles.layer} data-reel-layer="social" key={media.id}>
                  <div className={styles.reelImage} data-reel-image>
                    <Media item={media} locale={locale} className={styles.fill} loading="eager" sizes="100vw" />
                  </div>
                  <span className={`${styles.frameCaption} micro`} data-frame-caption>
                    {labels.frame} {pad(index + 2)} — {social.layers[layer]}
                  </span>
                </div>
              ))}

              {/* Formats : posés dans la géométrie exacte de l'écran. */}
              <div className={`${styles.screenGeom} ${styles.formats}`}>
                <div className={`${styles.format} ${styles.feed}`} data-format>
                  <div className={styles.formatImage} data-format-image>
                    <div className={styles.feedHead}>
                      <span>GD</span>
                      <strong>Studio / contenu</strong>
                    </div>
                    <div className={styles.feedGrid}>
                      {phoneFeed.concat(phoneFeed.slice(0, 2)).map((m, i) => (
                        <Media key={`${m.id}-${i}`} item={m} locale={locale} compact className={styles.feedCell} sizes="12vw" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.format} data-format>
                  <div className={styles.formatImage} data-format-image>
                    <Media item={phoneFeed[2]!} locale={locale} className={styles.fill} sizes="(max-width: 1023px) 70vw, 26vw" />
                  </div>
                  <span className={styles.reelBar}><i /></span>
                </div>
                <div className={styles.format} data-format>
                  <div className={styles.formatImage} data-format-image>
                    <Media item={phoneStory} locale={locale} className={styles.fill} sizes="(max-width: 1023px) 70vw, 26vw" />
                  </div>
                  <span className={styles.storyBar}><i /><i /><i /></span>
                </div>
              </div>

              <div className={styles.layer} data-reel-layer="campaign">
                <div className={styles.campaignPan} data-campaign-pan>
                  <div className={styles.reelImage} data-reel-image>
                    <Media item={socialPortal} locale={locale} className={styles.fill} loading="eager" sizes="100vw" />
                  </div>
                </div>
              </div>

              <span className={styles.safelight} data-safelight />
              <span className={styles.scrim} data-scrim />
            </div>
          </div>

          {/* ---------- 1 · COUVERTURE ----------
              Un numéro de magazine : bandeau, titre de tête, métier, titres
              de couverture, crédit. Une seule image, beaucoup d'air. */}
          <div className={styles.openingChrome}>
            <span className={`${styles.edition} micro`} data-meta>
              {labels.issue}<span className={styles.editionLong}> — {opening.edition}</span>
            </span>
            <span className={`${styles.counter} micro`} data-meta>{opening.topics}</span>
            <span className={`${styles.axis} micro`} data-meta>{opening.axis}</span>
          </div>

          <div className={`${styles.name} ${styles.nameFirst}`} data-name aria-hidden="true">
            <span className={styles.mask}><span data-name-line>{hero.firstName}</span></span>
          </div>
          <p className={styles.role} data-meta aria-hidden="true">
            <span>{opening.role[0]}</span>
            <span>{opening.role[1]}</span>
          </p>
          <div className={`${styles.name} ${styles.nameLast}`} data-name aria-hidden="true">
            <span className={styles.mask}><span data-name-line>{hero.lastName}</span></span>
          </div>
          <ol className={styles.coverLines} data-meta>
            {opening.coverLines.map((line) => (
              <li key={line.folio}>
                <span className={styles.coverFolio}>{line.folio}</span>
                <span>{line.text}</span>
              </li>
            ))}
          </ol>
          <p className={`${styles.tagline} lead`} data-tagline>{opening.tagline}</p>

          {/* ---------- 2 · FULL BLEED ---------- */}
          <div className={styles.frontCopy}>
            <span className={`${styles.chapter} micro`} data-front-bit>02 / {social.heading}</span>
            <h2 className={styles.frontTitle} data-front-bit>{social.front}</h2>
            <p className={`${styles.frontStatement} lead`} data-front-bit>{social.frontStatement}</p>
          </div>

          <div className={styles.behindCopy}>
            <span className={`${styles.chapter} micro`} data-behind-bit>02.2 / {labels.layers}</span>
            <h3 className={styles.behindTitle} data-behind-bit>{social.behind}</h3>
            <p className={`${styles.behindStatement} lead`} data-behind-bit>{social.statement}</p>
            <div className={styles.strip} data-behind-bit>
              <span className={styles.stripTrack}><span className={styles.stripFill} data-strip-fill /></span>
              <ol className={styles.stripList}>
                {social.layers.map((layer, index) => (
                  <li data-strip-item key={layer}>
                    <span className="micro">{pad(index + 1)}</span>
                    {layer}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ---------- 3 · PROJECTEUR ---------- */}
          <div className={styles.phoneCopy}>
            <span className={`${styles.chapter} ${styles.phoneChapter} micro`} data-phone-bit>03 / {phone.heading}</span>
            <span className={`${styles.phoneMeta} micro`} data-phone-bit>{labels.screen} · {labels.reel}</span>
            <div className={styles.beatWords} aria-hidden="true">
              {phone.beats.map((beat) => (
                <span className={styles.beatMask} key={beat}><span data-beat-word>{beat}</span></span>
              ))}
            </div>
            <div className={styles.beatNotes}>
              {phone.notes.map((note) => (
                <p data-beat-note key={note}>{note}</p>
              ))}
            </div>
            <ol className={styles.rail} data-phone-bit aria-hidden="true">
              {phone.beats.map((beat, index) => (
                <li data-rail-item key={beat}><span>{pad(index + 1)}</span>{beat}</li>
              ))}
            </ol>
          </div>

          {/* ---------- 4 · IMMERSION ---------- */}
          <div className={styles.immersionCopy}>
            <span className={`${styles.chapter} micro`} data-immersion-bit>04 / {immersion.heading}</span>
            <h2 className={styles.immersionTitle} data-immersion-bit>{immersion.heading}</h2>
            <p className={`${styles.immersionStatement} lead`} data-immersion-bit>{immersion.statement}</p>
          </div>

          {/* ---------- 5 · TIRAGE → relais ActProcess ---------- */}
          <NotebookFrame locale={locale} marker="story" className={styles.notebookHandoff} />
        </div>

        {reduced && <ReducedStory content={content} locale={locale} />}
      </div>
    </section>
  );
}
