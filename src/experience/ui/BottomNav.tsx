'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DUR, EASE, prefersReducedMotion } from '../lib/motion';
import { locales } from '@/i18n';

/**
 * The bottom capsule.
 *
 * Not a navbar. It is born when the Hero finishes assembling (ref 03 —
 * Baguette Studio), accompanies the whole scroll, and in the final act unfolds
 * into the contact call to action. Because it is the same DOM node throughout,
 * the ending is a shared-element transform (P1) rather than a new section, which
 * is what closes the narrative loop.
 */
export function BottomNav({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const show = () => {
        if (prefersReducedMotion()) {
          gsap.set(el, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18, scaleY: 0.7, transformOrigin: 'bottom center' },
          { autoAlpha: 1, y: 0, scaleY: 1, duration: DUR.major, ease: EASE.out },
        );
      };

      // Reduced motion has no intro timeline to dispatch the event, so reveal
      // immediately in that case.
      if (prefersReducedMotion()) {
        show();
        return;
      }

      window.addEventListener('gd:nav-birth', show, { once: true });
      return () => window.removeEventListener('gd:nav-birth', show);
    },
    { scope: root },
  );

  const items = [
    { href: '#work', label: t('work'), secondary: false },
    { href: '#journey', label: t('journey'), secondary: true },
    { href: '#expertise', label: t('expertise'), secondary: true },
    { href: '#contact', label: t('contact'), secondary: false },
  ];

  return (
    <nav ref={root} className="nav" aria-label={t('aria')}>
      <a className="nav__mark" href="#top" aria-label="Glwadys Dalleau">
        GD
      </a>

      <span className="nav__sep" aria-hidden />

      <ul className="nav__list">
        {items.map((item) => (
          <li key={item.href}>
            <a
              className={`nav__link${item.secondary ? ' nav__link--secondary' : ''}`}
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <span className="nav__sep" aria-hidden />

      <div className="nav__locales">
        {locales.map((code) => (
          <a
            key={code}
            className="nav__locale"
            href={`/${code}`}
            aria-current={code === locale ? 'true' : undefined}
            hrefLang={code}
          >
            {code}
          </a>
        ))}
      </div>
    </nav>
  );
}
