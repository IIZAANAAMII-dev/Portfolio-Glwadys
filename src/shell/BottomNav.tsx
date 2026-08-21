'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { Content } from '@/content';
import { localeLabels, locales, type Locale } from '@/content/locales';
import { gsap, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { SHELL_EVENTS } from '@/lib/scrollControl';

import styles from './BottomNav.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

/** Ancres des actes. `home` remonte au début du film. */
const TARGETS = [
  { key: 'home', id: 'act-opening' },
  { key: 'work', id: 'act-work' },
  { key: 'journey', id: 'act-journey' },
  { key: 'expertise', id: 'act-expertise' },
  { key: 'contact', id: 'act-contact' },
] as const;

type NavKey = (typeof TARGETS)[number]['key'];

export function BottomNav({ content, locale }: Props) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<NavKey>('home');
  const [activeAct, setActiveAct] = useState(0);
  const [contactMode, setContactMode] = useState(false);
  const acts = useMemo(
    () => [
      { id: 'act-opening', label: content.nav.home, navKey: 'home' as const },
      { id: 'act-social', label: content.social.heading, navKey: 'home' as const },
      { id: 'act-phone', label: content.phone.heading, navKey: 'home' as const },
      { id: 'act-immersion', label: content.immersion.heading, navKey: 'home' as const },
      { id: 'act-process', label: content.process.heading, navKey: 'home' as const },
      { id: 'act-work', label: content.work.heading, navKey: 'work' as const },
      { id: 'act-journey', label: content.journey.heading, navKey: 'journey' as const },
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
    const onContact = (event: Event) => {
      setContactMode(Boolean((event as CustomEvent<boolean>).detail));
    };
    document.addEventListener(SHELL_EVENTS.contact, onContact);
    return () => document.removeEventListener(SHELL_EVENTS.contact, onContact);
  }, []);

  /* L'acte actif est déduit de l'observation du DOM, jamais d'un état dupliqué
     dans chaque section : c'est la cause racine de la navigation fausse dans
     les tentatives précédentes du projet. */
  useEffect(() => {
    const sections = acts.map((act) => document.getElementById(act.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const index = acts.findIndex((act) => act.id === hit.target.id);
        const match = acts[index];
        if (!match) return;
        setActiveAct(index);
        setActive(match.navKey);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [acts]);

  return (
    <nav
      ref={root}
      className={`${styles.nav} micro`}
      aria-label={content.nav.label}
      data-visible={visible}
      data-contact={contactMode}
      data-nav-root
    >
      <div className={styles.navItems}>
        {TARGETS.map((t) => (
          <a
            key={t.key}
            className={`${styles.item} ${t.key === 'journey' ? styles.journeyItem : ''} ${t.key === 'expertise' ? styles.expertiseItem : ''}`}
            href={`#${t.id}`}
            aria-current={active === t.key ? 'true' : undefined}
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

      <div className={styles.langs} role="group" aria-label={content.a11y.languageSwitch}>
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
