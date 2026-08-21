'use client';

import { useRef } from 'react';

import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { heroFrame, heroVertical, openingMedia } from '@/content/media';
import { gsap, useGSAP } from '@/lib/gsap';
import { DUR, EASE, MQ, SCROLL, SCRUB, STAGGER, scrollLength } from '@/lib/motion';
import { emitReady, lockScroll, unlockScroll } from '@/lib/scrollControl';
import { Media } from '@/ui/Media';

import styles from './ActOpeningHero.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/** Place `el` de sorte que son coin haut-gauche atteigne (left, top), à `scale`.
 *  Suppose `transform-origin: left top`, donc l'échelle ne déplace pas l'ancre. */
function placeAt(el: HTMLElement, left: number, top: number, scale: number) {
  const rect = el.getBoundingClientRect();
  gsap.set(el, { x: left - rect.left, y: top - rect.top, scale });
}

export function ActOpeningHero({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      if (!stageEl) return;

      const q = gsap.utils.selector(stageEl);
      const first = q<HTMLElement>(`.${styles.nameFirst}`)[0];
      const last = q<HTMLElement>(`.${styles.nameLast}`)[0];
      const tagline = q<HTMLElement>(`.${styles.tagline}`)[0];
      const spread = q<HTMLElement>(`.${styles.spread}`)[0];
      const openingFrame = q<HTMLElement>('[data-opening-frame]')[0];
      const handoffSurface = q<HTMLElement>('[data-hero-handoff]')[0];
      if (!first || !last || !tagline || !spread || !openingFrame || !handoffSurface) return;

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (ctx) => {
          const { isDesktop, isReduced } = ctx.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };

          const transient = q<HTMLElement>(`.${styles.transient}`);
          const media = q<HTMLElement>(`.${styles.media}`);
          const metas = q<HTMLElement>('[data-meta]');
          const lines = q<HTMLElement>('.line-mask > *');
          const nameLines = q<HTMLElement>('[data-name-line]');
          const notebookDetails = q<HTMLElement>('[data-notebook-detail]');
          const handoffDetails = q<HTMLElement>('[data-handoff-detail]');
          const heroFrameEl = q<HTMLElement>(`.${styles.heroFrame}`)[0];
          const heroVerticalEl = q<HTMLElement>(`.${styles.heroVertical}`)[0];
          const heroSharedVisual = q<HTMLElement>('[data-hero-shared-visual]')[0];
          const ruleH = q<HTMLElement>(`.${styles.ruleH}`)[0];
          const ruleV = q<HTMLElement>(`.${styles.ruleV}`)[0];
          const disciplines = q<HTMLElement>(`.${styles.disciplines}`)[0];
          if (
            !heroFrameEl ||
            !heroVerticalEl ||
            !heroSharedVisual ||
            !ruleH ||
            !ruleV ||
            !disciplines
          ) {
            return;
          }

          /* ---------- REDUCED MOTION ----------
             La Hero est déjà l'état de repos CSS : il n'y a rien à jouer.
             Le scroll n'est jamais verrouillé. */
          if (isReduced) {
            gsap.set([...lines], { yPercent: 0 });
            gsap.set(notebookDetails, { autoAlpha: 1, y: 0 });
            emitReady();
            return;
          }

          lockScroll();

          /* ---------- ÉTAT D'OUVERTURE ----------
             Calculé à partir de la position Hero, donc recalculé
             automatiquement par matchMedia à chaque changement de contexte. */
          const stageRect = stageEl.getBoundingClientRect();
          const cx = stageRect.left + stageRect.width / 2;
          const cy = stageRect.top + stageRect.height / 2;
          const NAME_SCALE = isDesktop ? 0.42 : 0.62;

          const firstRect = first.getBoundingClientRect();
          const lastRect = last.getBoundingClientRect();
          const firstH = firstRect.height * NAME_SCALE;
          const gap = firstH * 0.04;

          placeAt(
            first,
            cx - (firstRect.width * NAME_SCALE) / 2,
            cy - firstH - gap,
            NAME_SCALE,
          );
          placeAt(last, cx - (lastRect.width * NAME_SCALE) / 2, cy + gap, NAME_SCALE);

          // Le tracking s'ouvre vers la droite depuis l'ancre : c'est le geste.
          gsap.set([first, last], { letterSpacing: '0.3em' });
          gsap.set(last, { color: 'var(--ivory)' });

          const taglineRect = tagline.getBoundingClientRect();
          placeAt(
            tagline,
            cx - taglineRect.width / 2,
            cy + firstH * 2 + firstH * 0.55,
            1,
          );
          gsap.set(tagline, { autoAlpha: 0 });

          gsap.set(ruleH, { scaleX: 0 });
          gsap.set(ruleV, { scaleY: 0, autoAlpha: 0 });
          gsap.set(nameLines, { yPercent: 112 });
          gsap.set(metas, { autoAlpha: 0 });
          gsap.set(disciplines, { autoAlpha: 0 });
          gsap.set(notebookDetails, { autoAlpha: 0, y: 14 });
          gsap.set(handoffDetails, { autoAlpha: 0, y: 16 });
          gsap.set(spread, { autoAlpha: 0, scale: 0.82, rotation: -1.2 });
          gsap.set(openingFrame, { autoAlpha: 0, scaleX: 0.16, scaleY: 0.72 });
          gsap.set(handoffSurface, {
            clipPath: 'inset(0% 50% 0% 50%)',
          });

          // Médias persistants : état d'ouverture = décalage relatif vers le centre.
          gsap.set(heroVerticalEl, {
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
          gsap.set(transient, { autoAlpha: 0, scale: 0.9, clipPath: 'inset(100% 0 0 0)' });

          /* ---------- TIMELINE MAÎTRESSE ----------
             Un acte = une timeline. ~2.8 s, déverrouillage à 2.4 s. */
          const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

          tl
            // 1. Le filet se déploie, les méta se posent.
            .to(openingFrame, {
              autoAlpha: 0.82,
              scaleX: 1,
              scaleY: 1,
              duration: DUR.editorial,
            })
            .to(ruleH, {
              scaleX: 1,
              duration: DUR.editorial,
            }, 0.06)
            .to(metas, { autoAlpha: 0.72, duration: DUR.base, stagger: STAGGER.base }, 0.05)

            // 2. Le nom, révélé par ligne.
            .to(
              nameLines,
              { yPercent: 0, duration: DUR.editorial, stagger: STAGGER.base },
              0.22,
            )

            // 3. Le tracking se referme + l'échelle se resserre. Geste signature.
            .to(
              [first, last],
              { letterSpacing: '-0.045em', duration: DUR.editorial, ease: EASE.move },
              0.48,
            )

            // 4. La phrase de positionnement.
            .to(tagline, { autoAlpha: 0.88, duration: DUR.base }, 0.72)

            // La couverture révèle le spread de travail, sans effet de page-turn.
            .to(
              spread,
              { autoAlpha: 1, scale: 1, rotation: 0, duration: DUR.editorial },
              0.82,
            )

            // 5. Les fragments entrent depuis les bords.
            .to(
              [...media, ...transient],
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

            /* 6. MORPHOSE — la composition d'ouverture devient la Hero.
                  Tout revient à l'identité, c'est-à-dire au repos CSS. */
            .to(
              [first, last],
              { x: 0, y: 0, scale: 1, duration: DUR.cinematic, ease: EASE.handoff },
              1.28,
            )
            .to(last, { color: 'var(--rich-wine)', duration: DUR.editorial }, 1.28)
            .to(
              tagline,
              { x: 0, y: 0, duration: DUR.cinematic, ease: EASE.handoff },
              1.28,
            )
            .to(
              media,
              {
                xPercent: 0,
                yPercent: 0,
                scale: 1,
                duration: DUR.cinematic,
                ease: EASE.handoff,
              },
              1.3,
            )
            // Deux fragments quittent le cadre, deux trouvent leur place.
            .to(
              transient,
              {
                xPercent: (i: number) => (i === 0 ? -130 : 130),
                autoAlpha: 0,
                duration: DUR.editorial,
                ease: EASE.move,
              },
              1.25,
            )
            .to(openingFrame, { autoAlpha: 0, scaleX: 1.24, scaleY: 1.24, duration: DUR.base }, 1.32)
            .to(
              ruleV,
              { scaleY: 1, autoAlpha: 1, duration: DUR.editorial },
              1.72,
            )
            .to(
              disciplines,
              { autoAlpha: 0.72, duration: DUR.base },
              1.84,
            )
            .to(
              notebookDetails,
              { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.tight },
              1.78,
            )

            // 7. Le scroll est rendu AVANT la fin perçue : l'attente n'est pas subie.
            .add(() => unlockScroll(), 2.12)
            .add(() => emitReady(), 2.34);

          /* ---------- ACT 01 — LA COUVERTURE DEVIENT OBJET ----------
             Timeline distincte car elle est pilotée par le scroll, mais elle
             reste dans le même composant et cible le même DOM que l'Opening. */
          const heroTl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => scrollLength(SCROLL.hero, !isDesktop),
              pin: stageEl,
              pinSpacing: true,
              scrub: SCRUB.narrative,
              invalidateOnRefresh: true,
            },
          });

          const socialTarget = () => {
            const width = isDesktop
              ? Math.min(window.innerWidth * 0.18, 17 * 16)
              : window.innerWidth * 0.32;
            return {
              left: window.innerWidth * (isDesktop ? 0.42 : 0.34),
              top: window.innerHeight * (isDesktop ? 0.16 : 0.2),
              width,
              height: width * (16 / 9),
            };
          };

          heroTl
            .to(
              handoffSurface,
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.9,
              },
              0.04,
            )
            .to(
              handoffDetails,
              { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.34 },
              0.38,
            )
            .to(
              heroFrameEl,
              {
                xPercent: -92,
                yPercent: -8,
                clipPath: 'inset(0% 100% 0% 0%)',
                autoAlpha: 0,
                duration: 0.62,
              },
              0.04,
            )
            .to(
              [first, last],
              {
                xPercent: (i: number) => (i === 0 ? -12 : 12),
                scale: 0.84,
                autoAlpha: 0,
                duration: 0.72,
              },
              0.06,
            )
            .to(tagline, { xPercent: -18, autoAlpha: 0, duration: 0.54 }, 0.08)
            .to(
              heroVerticalEl,
              {
                x: () => {
                  const target = socialTarget();
                  const scaledLeft = heroVerticalEl.offsetLeft + (heroVerticalEl.offsetWidth - target.width) / 2;
                  return target.left - scaledLeft;
                },
                y: () => {
                  const target = socialTarget();
                  const scaledTop = heroVerticalEl.offsetTop + (heroVerticalEl.offsetHeight - target.height) / 2;
                  return target.top - scaledTop;
                },
                duration: 1,
              },
              0,
            )
            .to(
              heroSharedVisual,
              {
                scale: () => socialTarget().width / heroVerticalEl.offsetWidth,
                duration: 1,
              },
              0,
            )
            .to(ruleH, { scaleX: 0, autoAlpha: 0, duration: 0.7 }, 0.08)
            .to(ruleV, { scaleY: 0, autoAlpha: 0, duration: 0.62 }, 0.1)
            .to(
              spread,
              {
                clipPath: 'inset(0% 50% 0% 50%)',
                scale: 0.96,
                rotation: 0,
                autoAlpha: 0,
                duration: 0.76,
              },
              0.02,
            )
            .to(
              [...metas, ...notebookDetails, disciplines],
              { autoAlpha: 0, duration: 0.48 },
              0.08,
            );

          return () => {
            // Filet de sécurité : le scroll ne doit jamais rester verrouillé.
            unlockScroll();
          };
        },
        // `isDesktop` sert de dépendance implicite : matchMedia recrée le contexte.
      );

      /* Le verrou est borné : toute interaction clavier le libère immédiatement.
         Un scroll bloqué est un défaut d'accessibilité bloquant. */
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
      className={`act surface-paper ${styles.act}`}
      aria-label={opening.edition}
    >
      <div ref={stage} className={styles.stage}>
        {/* Titre sémantique unique. Les blocs visibles sont décoratifs pour
            éviter que le lecteur d'écran lise le nom deux fois. */}
        <h1 className="visually-hidden">
          {hero.firstName} {hero.lastName} — {opening.tagline}
        </h1>

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
        <div className={styles.handoffSurface} data-hero-handoff aria-hidden="true">
          <span className={styles.handoffIndex} data-handoff-detail>
            02
          </span>
          <span className={`${styles.handoffKicker} micro`} data-handoff-detail>
            01 → 02 / {content.social.heading}
          </span>
          <span className={`${styles.handoffStatement} lead`} data-handoff-detail>
            {content.social.statement}
          </span>
        </div>

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

        <div className={`${styles.media} ${styles.heroVertical}`} data-persistent="hero-vertical">
          <div className={styles.heroSharedVisual} data-hero-shared-visual>
            <Media item={heroVertical} locale={locale} index={1} total={4} sizes="20vw" />
          </div>
        </div>
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
      </div>
    </section>
  );
}
