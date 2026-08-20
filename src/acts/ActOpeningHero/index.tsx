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
      if (!first || !last || !tagline) return;

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isReduced: MQ.reduced },
        (ctx) => {
          const { isDesktop, isReduced } = ctx.conditions as {
            isDesktop: boolean;
            isReduced: boolean;
          };

          const transient = q<HTMLElement>(`.${styles.transient}`);
          const media = q<HTMLElement>(`.${styles.media}`);
          const metas = q<HTMLElement>('[data-meta]');
          const lines = q<HTMLElement>('.line-mask > *');

          /* ---------- REDUCED MOTION ----------
             La Hero est déjà l'état de repos CSS : il n'y a rien à jouer.
             Le scroll n'est jamais verrouillé. */
          if (isReduced) {
            gsap.set([...lines], { yPercent: 0 });
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

          const taglineRect = tagline.getBoundingClientRect();
          placeAt(
            tagline,
            cx - taglineRect.width / 2,
            cy + firstH * 2 + firstH * 0.55,
            1,
          );
          gsap.set(tagline, { autoAlpha: 0 });

          gsap.set(q<HTMLElement>(`.${styles.ruleH}`), { scaleX: 0 });
          gsap.set(q<HTMLElement>(`.${styles.ruleV}`), { scaleY: 0, autoAlpha: 0 });
          gsap.set(metas, { autoAlpha: 0 });
          gsap.set(q<HTMLElement>(`.${styles.disciplines}`), { autoAlpha: 0 });

          // Médias persistants : état d'ouverture = décalage relatif vers le centre.
          gsap.set(q<HTMLElement>(`.${styles.heroVertical}`), {
            xPercent: isDesktop ? -62 : 0,
            yPercent: isDesktop ? 8 : 14,
            scale: 0.82,
            autoAlpha: 0,
          });
          gsap.set(q<HTMLElement>(`.${styles.heroFrame}`), {
            xPercent: isDesktop ? -78 : 0,
            yPercent: isDesktop ? -18 : 16,
            scale: 0.85,
            autoAlpha: 0,
          });
          gsap.set(transient, { autoAlpha: 0, scale: 0.9 });

          /* ---------- TIMELINE MAÎTRESSE ----------
             Un acte = une timeline. ~2.8 s, déverrouillage à 2.4 s. */
          const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

          tl
            // 1. Le filet se déploie, les méta se posent.
            .to(q<HTMLElement>(`.${styles.ruleH}`), {
              scaleX: 1,
              duration: DUR.editorial,
            })
            .to(metas, { autoAlpha: 0.72, duration: DUR.base, stagger: STAGGER.base }, 0.05)

            // 2. Le nom, révélé par ligne.
            .to(
              q<HTMLElement>('[data-name-line]'),
              { yPercent: 0, duration: DUR.editorial, stagger: STAGGER.base },
              0.35,
            )

            // 3. Le tracking se referme + l'échelle se resserre. Geste signature.
            .to(
              [first, last],
              { letterSpacing: '-0.045em', duration: DUR.editorial, ease: EASE.move },
              0.6,
            )

            // 4. La phrase de positionnement.
            .to(tagline, { autoAlpha: 0.88, duration: DUR.base }, 1.1)

            // 5. Les fragments entrent depuis les bords.
            .to(
              [...media, ...transient],
              {
                autoAlpha: 1,
                scale: (i: number, target: Element) =>
                  target.classList.contains(styles.transient ?? '') ? 1 : 0.82,
                duration: DUR.base,
                stagger: STAGGER.base,
              },
              1.35,
            )

            /* 6. MORPHOSE — la composition d'ouverture devient la Hero.
                  Tout revient à l'identité, c'est-à-dire au repos CSS. */
            .to(
              [first, last],
              { x: 0, y: 0, scale: 1, duration: DUR.cinematic, ease: EASE.handoff },
              1.9,
            )
            .to(
              tagline,
              { x: 0, y: 0, duration: DUR.cinematic, ease: EASE.handoff },
              1.9,
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
              1.95,
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
              1.9,
            )
            .to(
              q<HTMLElement>(`.${styles.ruleV}`),
              { scaleY: 1, autoAlpha: 1, duration: DUR.editorial },
              2.15,
            )
            .to(
              q<HTMLElement>(`.${styles.disciplines}`),
              { autoAlpha: 0.72, duration: DUR.base },
              2.25,
            )

            // 7. Le scroll est rendu AVANT la fin perçue : l'attente n'est pas subie.
            .add(() => unlockScroll(), 2.4)
            .add(() => emitReady(), 2.65);

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

          heroTl
            .to(stageEl, { scale: 0.88, duration: 1 }, 0)
            .to(
              q<HTMLElement>(`.${styles.heroFrame}`),
              { xPercent: -125, autoAlpha: 0, duration: 0.72 },
              0.08,
            )
            .to(
              [first, last],
              { scale: 0.72, autoAlpha: 0.34, duration: 0.9 },
              0,
            )
            .to(tagline, { xPercent: -24, autoAlpha: 0.35, duration: 0.75 }, 0.08)
            .to(
              q<HTMLElement>(`.${styles.heroVertical}`),
              {
                xPercent: isDesktop ? -82 : -45,
                yPercent: isDesktop ? 10 : 2,
                scale: isDesktop ? 1.18 : 1.08,
                duration: 1,
              },
              0,
            )
            .to(q<HTMLElement>(`.${styles.ruleH}`), { scaleX: 0.24, duration: 0.8 }, 0.1)
            .to(q<HTMLElement>(`.${styles.ruleV}`), { scaleY: 0, duration: 0.65 }, 0.12);

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
      const safety = window.setTimeout(release, 4500);

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
          <Media item={heroVertical} locale={locale} index={1} total={4} sizes="20vw" />
        </div>
        <div className={`${styles.media} ${styles.heroFrame}`}>
          <Media item={heroFrame} locale={locale} index={2} total={4} sizes="16vw" />
        </div>

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
