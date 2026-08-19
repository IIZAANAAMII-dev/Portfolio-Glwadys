'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MediaSlot } from '../media/MediaSlot';
import { DUR, EASE, MQ, SCRUB, STAGGER, prefersReducedMotion, registerGsap } from '../lib/motion';

/**
 * Beats 01–03: Opening credits → Hero assembles → Hero Shrink.
 *
 * The DOM is authored in its FINAL Hero state, and the opening animates *to*
 * that state. This is deliberate: it means the static render is the poster
 * composition, so the Hero is correct with JavaScript disabled, under
 * reduced-motion, and in a screenshot — which is the §6 requirement.
 *
 * Pin 1 of 5.
 */
export function ActOpening() {
  const t = useTranslations();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const reduced = prefersReducedMotion();

      // Reveal: the stage is hidden until initial states are applied, so the
      // server-rendered final composition never flashes before the opening.
      const reveal = () => root.current?.setAttribute('data-intro', 'done');

      if (reduced) {
        reveal();
        return;
      }

      // ---------------------------------------------------------- beats 01–02
      // Autonomous, time-based. The only non-scroll-driven structural motion in
      // the site: the visitor has not scrolled yet, so scroll cannot drive it.
      const intro = gsap.timeline({
        defaults: { ease: EASE.inOut, duration: DUR.major },
        onStart: reveal,
      });

      intro
        .addLabel('credits')
        .from('[data-o="rule"]', { scaleX: 0, duration: 0.9, ease: EASE.expo }, 0)
        .from(
          '[data-o="credit"]',
          { yPercent: 110, autoAlpha: 0, duration: 0.7, stagger: STAGGER.default, ease: EASE.out },
          0.1,
        )
        // The name starts small and mono-scaled, then grows into the mega lockup.
        .from(
          '[data-o="name"]',
          { scale: 0.24, yPercent: 18, autoAlpha: 0, transformOrigin: 'left center', duration: 1.1 },
          0.35,
        )
        .addLabel('media')
        // Portrait from the left, satellite from the right, overlapping by 0.15s
        // so they read as choreographed rather than queued.
        .from('[data-o="portrait"]', { xPercent: -118, autoAlpha: 0, duration: 1.05 }, 0.55)
        .from('[data-o="satellite"]', { xPercent: 130, autoAlpha: 0, duration: 1.05 }, 0.7)
        .from(
          '[data-o="headline"] .line',
          { yPercent: 105, autoAlpha: 0, duration: 0.75, stagger: STAGGER.default, ease: EASE.out },
          0.75,
        )
        .addLabel('nav')
        // The nav is born once the Hero has finished assembling (ref 03), and is
        // the same element that becomes the contact CTA at the end.
        .add(() => window.dispatchEvent(new CustomEvent('gd:nav-birth')), '>-0.2');

      // ------------------------------------------------------------- beat 03
      // Hero Shrink. The cover contracts into an object sitting in the page.
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: MQ.desktop, small: `(max-width: 1023px)`, reduced: MQ.reduced },
        (context) => {
          const { reduced: isReduced, desktop } = context.conditions as {
            desktop: boolean;
            small: boolean;
            reduced: boolean;
          };

          if (isReduced) return;

          const shrink = gsap.timeline({
            defaults: { ease: EASE.none },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: desktop ? '+=180%' : '+=120%',
              pin: true,
              pinSpacing: true,
              scrub: SCRUB.default,
              invalidateOnRefresh: true,
            },
          });

          shrink
            // Satellite leaves the composition first.
            .to('[data-o="satellite"]', { yPercent: 26, autoAlpha: 0, duration: 0.3 }, 0)
            .to('[data-o="headline"]', { autoAlpha: 0, yPercent: -8, duration: 0.35 }, 0.05)
            // The cover becomes an object: scale down, ground appears around it.
            .to(
              '[data-o="stage"]',
              {
                scale: desktop ? 0.64 : 0.78,
                yPercent: desktop ? -2 : 0,
                duration: 1,
              },
              0,
            )
            // The portrait crops tighter and pushes in — it is about to become
            // the Story, so it starts narrowing here.
            .to('[data-o="portrait"] .media', { clipPath: 'inset(6% 14% 6% 14%)', duration: 1 }, 0)
            .to('[data-o="portrait"] img, [data-o="portrait"] .plate', { scale: 1.08, duration: 1 }, 0)
            // A hairline frame resolves around the shrunken cover: the signal
            // that we are now looking at an object rather than through a window.
            .to('[data-o="frame"]', { autoAlpha: 1, duration: 0.4 }, 0.45)
            .to('[data-o="meta"]', { autoAlpha: 0.45, duration: 0.4 }, 0.2);

          return () => {
            shrink.scrollTrigger?.kill();
            shrink.kill();
          };
        },
      );

      return () => {
        mm.revert();
        intro.kill();
        ScrollTrigger.refresh();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="opening scene ground-ink" data-intro="pending">
      <div className="opening__stage" data-o="stage">
        <span className="opening__frame" data-o="frame" aria-hidden />

        <header className="opening__top" data-o="meta">
          <span className="meta" data-o="credit">
            Glwadys Dalleau
          </span>
          <span className="meta" data-o="credit">
            {t('nav.tag')}
          </span>
        </header>

        <hr className="opening__rule rule" data-o="rule" />

        <div className="opening__composition">
          <h1 className="opening__name mega" data-o="name">
            <span className="opening__name-line">Glwadys</span>
            <span className="opening__name-line opening__name-line--2">Dalleau</span>
          </h1>

          <div className="opening__portrait" data-o="portrait">
            <MediaSlot
              slot="HERO_PORTRAIT_01"
              priority
              objectPosition="50% 32%"
              sizes="(max-width: 767px) 78vw, 32vw"
            />
          </div>

          <p className="opening__headline head" data-o="headline">
            <span className="line">{t('hero.headlinePart1')}</span>{' '}
            <span className="line">{t('hero.headlinePart2')}</span>{' '}
            <span className="line editorial">{t('hero.headlinePart3')}</span>{' '}
            <span className="line editorial">{t('hero.headlinePart4')}</span>
          </p>

          <div className="opening__satellite" data-o="satellite">
            <MediaSlot slot="PHONE_STORY_01" sizes="(max-width: 767px) 40vw, 16vw" />
          </div>
        </div>

        <footer className="opening__bottom" data-o="meta">
          <span className="meta" data-o="credit">
            {t('intro.roles')}
          </span>
          <span className="meta" data-o="credit">
            {t('nav.location')}
          </span>
        </footer>
      </div>
    </section>
  );
}
