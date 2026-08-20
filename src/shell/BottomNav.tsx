'use client';

import { useEffect, useState } from 'react';

import type { Content } from '@/content';
import { localeLabels, locales, type Locale } from '@/content/locales';
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

export function BottomNav({ content, locale }: Props) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [contactMode, setContactMode] = useState(false);

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
    const sections = TARGETS.map((t) => document.getElementById(t.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const match = TARGETS.find((t) => t.id === hit.target.id);
        if (match) setActive(match.key);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
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
