'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { Content } from '@/content';
import { localeLabels, locales, type Locale } from '@/content/locales';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { MQ } from '@/lib/motion';
import { SHELL_EVENTS, unlockScroll } from '@/lib/scrollControl';

import styles from './BottomNav.module.css';

const TARGETS = [
  { key: 'home', id: 'act-opening' },
  { key: 'universe', id: 'act-process' },
  { key: 'work', id: 'act-work' },
  { key: 'expertise', id: 'act-expertise' },
  { key: 'contact', id: 'act-contact' },
] as const;

const COPY = {
  fr: { universe: 'Univers', index: 'Index', title: 'Sommaire', close: 'Fermer', chapter: 'Chapitre', edition: 'Portfolio — 2026' },
  en: { universe: 'World', index: 'Index', title: 'Contents', close: 'Close', chapter: 'Chapter', edition: 'Portfolio — 2026' },
  ko: { universe: '작업 세계', index: '목차', title: '목차', close: '닫기', chapter: '챕터', edition: '포트폴리오 — 2026' },
} as const;

type NavKey = (typeof TARGETS)[number]['key'];

export function BottomNav({ content, locale }: { content: Content; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const languages = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<NavKey>('home');
  const [indexOpen, setIndexOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const copy = COPY[locale];
  const chapters = useMemo(() => TARGETS.map((target) => ({
    ...target,
    label: target.key === 'universe' ? COPY[locale].universe : content.nav[target.key],
  })), [content.nav, locale]);
  const activeIndex = chapters.findIndex((chapter) => chapter.key === active);

  useEffect(() => {
    const onReady = () => setVisible(true);
    if (document.documentElement.dataset.shellReady === 'true' || window.matchMedia(MQ.reduced).matches) onReady();
    document.addEventListener(SHELL_EVENTS.ready, onReady);
    return () => document.removeEventListener(SHELL_EVENTS.ready, onReady);
  }, []);

  useGSAP(() => {
    if (!visible || !root.current) return;
    const mm = gsap.matchMedia();
    mm.add({ reduced: MQ.reduced, motion: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (context.conditions?.reduced) return;
      gsap.fromTo(root.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity' });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [visible], revertOnUpdate: true });

  // Physical markers remain reliable when reversing across pinned scenes.
  useEffect(() => {
    const anchors = chapters.map((chapter) => ({ ...chapter, node: document.getElementById(chapter.id) }));
    let raf = 0;
    const sync = () => {
      raf = 0;
      let selected: NavKey = 'home';
      for (const anchor of anchors) {
        if (anchor.node && anchor.node.getBoundingClientRect().top <= window.innerHeight * 0.5) selected = anchor.key;
      }
      setActive(selected);
    };
    const requestSync = () => { if (!raf) raf = requestAnimationFrame(sync); };
    requestSync();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);
    window.addEventListener('pageshow', requestSync);
    ScrollTrigger.addEventListener('refresh', requestSync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
      window.removeEventListener('pageshow', requestSync);
      ScrollTrigger.removeEventListener('refresh', requestSync);
    };
  }, [chapters]);

  useEffect(() => {
    if (!languageOpen) return;
    languages.current?.querySelector<HTMLAnchorElement>('[aria-current]')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageOpen(false);
        languageButton.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [languageOpen]);

  useEffect(() => {
    const panel = dialog.current;
    const triggerElement = trigger.current;
    if (!indexOpen || !panel) return;
    panel.showModal(); // Native modal: inert background, focus containment, Escape.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.querySelector<HTMLAnchorElement>('[aria-current="location"]')?.focus({ preventScroll: true });
    const media = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => { if (media.matches) setIndexOpen(false); };
    media.addEventListener('change', onDesktop);
    return () => {
      panel.close();
      document.body.style.overflow = previousOverflow;
      media.removeEventListener('change', onDesktop);
      if (!media.matches) triggerElement?.focus({ preventScroll: true });
    };
  }, [indexOpen]);

  useGSAP(() => {
    if (!indexOpen || !dialog.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(dialog.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.fromTo(dialog.current!.querySelectorAll('[data-index-row]'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.045, ease: 'power3.out', clearProps: 'transform,opacity' });
    });
    return () => mm.revert();
  }, { dependencies: [indexOpen], revertOnUpdate: true });

  const navigate = () => {
    setIndexOpen(false);
    setLanguageOpen(false);
    unlockScroll();
  };

  const languageLinks = locales.map((language) => (
    <a key={language} className={styles.lang} href={`/${language}`} hrefLang={language}
      lang={language} aria-current={language === locale ? 'page' : undefined}>
      {localeLabels[language]}
    </a>
  ));

  return (
    <>
      <nav ref={root} className={styles.nav} aria-label={content.nav.label} data-visible={visible} data-nav-root>
        <span className={styles.issue} aria-hidden="true">G. / 2026</span>
        <div className={styles.navItems}>
          {chapters.map((chapter, index) => (
            <a key={chapter.key} className={styles.item} href={`#${chapter.id}`}
              aria-current={active === chapter.key ? 'location' : undefined} onClick={navigate}>
              <span className={styles.folio}>{String(index + 1).padStart(2, '0')}</span>
              <span>{chapter.label}</span>
            </a>
          ))}
        </div>
        <button ref={trigger} className={styles.indexToggle} type="button" aria-haspopup="dialog"
          aria-expanded={indexOpen} aria-controls="chapter-index" onClick={() => { setLanguageOpen(false); setIndexOpen(true); }}>
          <span className={styles.indexIcon} aria-hidden="true"><i /><i /></span>{copy.index}
        </button>
        <span className={styles.current} aria-label={`${copy.chapter} ${activeIndex + 1}: ${chapters[activeIndex]?.label}`}>
          <span className={styles.currentNumber}>{String(activeIndex + 1).padStart(2, '0')}<span> / 05</span></span>
          <span className={styles.currentLabel}>{chapters[activeIndex]?.label}</span>
        </span>
        <div className={styles.languageControl} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setLanguageOpen(false);
        }}>
          <button ref={languageButton} className={styles.languageToggle} type="button" aria-label={content.a11y.languageSwitch}
            aria-expanded={languageOpen} aria-controls="site-languages" onClick={() => setLanguageOpen((open) => !open)}>
            {localeLabels[locale]}<span aria-hidden="true">{languageOpen ? '−' : '+'}</span>
          </button>
          <div ref={languages} id="site-languages" className={styles.langs} hidden={!languageOpen}
            role="group" aria-label={content.a11y.languageSwitch}>{languageLinks}</div>
        </div>
      </nav>
      <dialog ref={dialog} id="chapter-index" className={styles.dialog} aria-labelledby="chapter-index-title"
        data-lenis-prevent onCancel={() => setIndexOpen(false)} onClose={() => setIndexOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setIndexOpen(false); }}>
        <div className={styles.indexPaper}>
          <div className={styles.indexTop}>
            <span>{copy.edition}</span>
            <button type="button" className={styles.close} onClick={() => setIndexOpen(false)}>{copy.close}<span aria-hidden="true">×</span></button>
          </div>
          <h2 id="chapter-index-title" className={styles.indexTitle}>{copy.title}<span aria-hidden="true"> / 05</span></h2>
          <nav aria-label={content.nav.label}>
            <ol className={styles.chapterList}>
              {chapters.map((chapter, index) => (
                <li key={chapter.key} data-index-row>
                  <a href={`#${chapter.id}`} aria-current={active === chapter.key ? 'location' : undefined} onClick={navigate}>
                    <span className={styles.folio}>{String(index + 1).padStart(2, '0')}</span>
                    <span>{chapter.label}</span><span className={styles.chapterArrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.indexFooter}>
            <span>Glwadys Dalleau</span>
            <div className={styles.indexLanguages} role="group" aria-label={content.a11y.languageSwitch}>{languageLinks}</div>
          </div>
        </div>
      </dialog>
    </>
  );
}
