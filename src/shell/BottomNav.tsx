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

    let frame = 0;
    let current: NavKey = 'home';
    let disposed = false;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.42;
      const next = [...sections].reverse().find(({ element }) => element.getBoundingClientRect().top <= line)?.key ?? 'home';
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('scrollend', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    update();
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('scrollend', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
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
