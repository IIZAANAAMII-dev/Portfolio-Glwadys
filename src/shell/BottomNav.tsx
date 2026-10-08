'use client';

import { useEffect, useState } from 'react';

import type { Content } from '@/content';

import styles from './BottomNav.module.css';

interface Props {
  content: Content;
}

const TARGETS = [
  { key: 'home', id: 'act-opening' },
  { key: 'work', id: 'act-work' },
  { key: 'journey', id: 'act-journey-scene' },
  { key: 'expertise', id: 'act-expertise' },
  { key: 'contact', id: 'act-contact' },
] as const;

const ACTIVE_SECTIONS = [
  { id: 'act-opening', key: 'home' },
  { id: 'act-process', key: 'home' },
  { id: 'act-work', key: 'work' },
  { id: 'act-journey-scene', key: 'journey' },
  { id: 'act-expertise', key: 'expertise' },
  { id: 'act-contact', key: 'contact' },
] as const;

type NavKey = (typeof TARGETS)[number]['key'];

export function BottomNav({ content }: Props) {
  const [active, setActive] = useState<NavKey>('home');

  useEffect(() => {
    const sections = ACTIVE_SECTIONS.map(({ id, key }) => ({
      element: document.getElementById(id),
      key,
    })).filter((section): section is { element: HTMLElement; key: NavKey } => Boolean(section.element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const candidates = entries.filter((entry) => entry.isIntersecting);
        if (!candidates.length) return;

        const current = candidates
          .map((entry) => ({
            id: entry.target.id,
            distance: Math.abs(
              (entry.target as HTMLElement).getBoundingClientRect().top +
                (entry.target as HTMLElement).getBoundingClientRect().height / 2 -
                window.innerHeight / 2,
            ),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        const next = ACTIVE_SECTIONS.find((section) => section.id === current?.id);
        if (next) setActive(next.key);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.nav} aria-label={content.nav.label}>
      {TARGETS.map((target) => (
        <a
          className={styles.item}
          key={target.key}
          href={`#${target.id}`}
          aria-current={active === target.key ? 'location' : undefined}
        >
          {content.nav[target.key]}
        </a>
      ))}
    </nav>
  );
}
