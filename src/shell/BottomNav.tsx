'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { Content } from '@/content';
import { localeLabels, locales, type Locale } from '@/content/locales';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { SHELL_EVENTS, unlockScroll } from '@/lib/scrollControl';

import styles from './BottomNav.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/** Ancres des actes. `home` remonte au début du film. */
const TARGETS = [
  { key: 'home', id: 'act-opening' },
  { key: 'work', id: 'act-work' },
  { key: 'journey', id: 'act-journey-scene' },
  { key: 'expertise', id: 'act-expertise' },
  { key: 'contact', id: 'act-contact' },
] as const;

type NavKey = (typeof TARGETS)[number]['key'];

export function BottomNav({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<NavKey>('home');
  const [activeAct, setActiveAct] = useState(0);
  const [contactMode, setContactMode] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const acts = useMemo(
    () => [
      { id: 'act-opening', label: content.nav.home, navKey: 'home' as const },
      { id: 'act-social', label: content.social.heading, navKey: 'home' as const },
      { id: 'act-phone', label: content.phone.heading, navKey: 'home' as const },
      { id: 'act-immersion', label: content.immersion.heading, navKey: 'home' as const },
      { id: 'act-process', label: content.process.heading, navKey: 'home' as const },
      { id: 'act-work', label: content.work.heading, navKey: 'work' as const },
      { id: 'act-journey-scene', label: content.journey.heading, navKey: 'journey' as const },
      { id: 'act-expertise', label: content.expertise.heading, navKey: 'expertise' as const },
      { id: 'act-contact', label: content.contact.heading, navKey: 'contact' as const },
    ],
    [content],
  );

  useGSAP(
    () => {
      const progressEl = progress.current;
      if (!progressEl) return;

      const mm = gsap.matchMedia();
      mm.add({ isReduced: MQ.reduced }, (context) => {
        const { isReduced } = context.conditions as { isReduced: boolean };
        gsap.set(progressEl, { scaleX: isReduced ? 1 : 0, transformOrigin: 'left center' });
        if (isReduced) return;

        gsap.to(progressEl, {
          scaleX: 1,
          ease: EASE.scrub,
          scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: SCRUB.exact,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // La navigation naît à la fin de l'Opening.
  useEffect(() => {
    const onReady = () => setVisible(true);
    if (document.documentElement.dataset.shellReady === 'true') onReady();
    document.addEventListener(SHELL_EVENTS.ready, onReady);
    return () => document.removeEventListener(SHELL_EVENTS.ready, onReady);
  }, []);

  useEffect(() => {
    if (!languageOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageOpen(false);
        languageButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [languageOpen]);

  useEffect(() => {
    const onContact = (event: Event) => {
      setContactMode(Boolean((event as CustomEvent<boolean>).detail));
    };
    document.addEventListener(SHELL_EVENTS.contact, onContact);
    return () => document.removeEventListener(SHELL_EVENTS.contact, onContact);
  }, []);

  /*
   * Read the PHYSICAL act boundaries on every scroll direction, not the
   * IntersectionObserver event payload. IO stopped updating the label after a
   * pinned scroll reverse because the giant ActProcess wrapper remained
   * intersecting while the 1px Work anchor was already out of the viewport.
   * That left "Projets / ACT 06" highlighted while the real image was ACT 05.
   * Recompute from ALL boundaries and schedule at most once per animation frame.
   */
  useEffect(() => {
    const anchors = acts.map((act, index) => ({
      index,
      node: document.getElementById(act.id),
    })).filter((item): item is { index: number; node: HTMLElement } => Boolean(item.node));
    if (!anchors.length) return;

    let raf = 0;
    let lastIndex = -1;
    const sync = () => {
      raf = 0;
      const focusLine = window.innerHeight * 0.5;
      let selected = anchors[0]!.index;
      // Markers are already positioned by the film's pinned GSAP director.
      // The LAST boundary crossing the focus line owns the active act.
      for (const item of anchors) {
        if (item.node.getBoundingClientRect().top <= focusLine) selected = item.index;
      }
      if (selected === lastIndex) return;
      lastIndex = selected;
      const match = acts[selected];
      if (!match) return;
      setActiveAct(selected);
      setActive(match.navKey);
    };
    const requestSync = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(sync);
    };
    const onRefresh = () => requestSync();
    requestSync();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', onRefresh);
    window.addEventListener('pageshow', onRefresh);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', onRefresh);
      window.removeEventListener('pageshow', onRefresh);
    };
  }, [acts]);

  return (
    <nav
      ref={root}
      className={`${styles.nav} micro`}
      aria-label={content.nav.label}
      data-visible={visible}
      data-contact={contactMode}
      data-nav-root
      data-lang-open={languageOpen}
    >
      <div className={styles.navItems}>
        {TARGETS.map((t) => (
          <a
            key={t.key}
            className={`${styles.item} ${t.key === 'journey' ? styles.journeyItem : ''} ${t.key === 'expertise' ? styles.expertiseItem : ''}`}
            href={`#${t.id}`}
            aria-current={active === t.key ? 'true' : undefined}
            onClick={() => {
              unlockScroll();
              setLanguageOpen(false);
            }}
          >
            <span className={styles.label}>{content.nav[t.key]}</span>
          </a>
        ))}
      </div>

      <div className={styles.storyState} aria-hidden="true">
        <span className={styles.storyIndex}>
          ACT {String(activeAct + 1).padStart(2, '0')} / {String(acts.length).padStart(2, '0')}
        </span>
        <span className={styles.storyLabel}>{acts[activeAct]?.label}</span>
        <span className={styles.progressTrack}>
          <span ref={progress} className={styles.progressFill} />
        </span>
      </div>

      <span className={styles.divider} aria-hidden="true" />

      <button
        ref={languageButton}
        className={styles.languageToggle}
        type="button"
        aria-label={content.a11y.languageSwitch}
        aria-expanded={languageOpen}
        aria-controls="site-languages"
        onClick={() => setLanguageOpen((open) => !open)}
        onKeyDown={(event) => { if (event.key === 'Escape') setLanguageOpen(false); }}
      >
        {localeLabels[locale]} <span aria-hidden="true">{languageOpen ? '−' : '+'}</span>
      </button>
      <div id="site-languages" className={styles.langs} role="group" aria-label={content.a11y.languageSwitch}>
        {locales.map((l) => (
          <a
            key={l}
            className={styles.lang}
            href={`/${l}`}
            hrefLang={l}
            aria-current={l === locale ? 'true' : undefined}
          >
            {localeLabels[l]}
          </a>
        ))}
      </div>

      <a className={styles.contactCta} href={`mailto:${content.contact.email}`}>
        <span>{content.contact.cta}</span>
        <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}
