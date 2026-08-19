'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { cn } from '@/lib/utils';

export interface BottomNavHandle {
  setCta: (value: boolean) => void;
}

export const BottomNav = forwardRef<BottomNavHandle, { className?: string }>(
  function BottomNav({ className }, ref) {
    const { t, locale, labels } = useI18n();
    const [cta, setCta] = useState(false);

    useImperativeHandle(ref, () => ({
      setCta,
    }));

    if (cta) {
      return (
        <nav
          className={cn(
            'fixed bottom-6 left-1/2 z-30 -translate-x-1/2',
            'flex flex-col items-center gap-3 text-center',
            className,
          )}
          aria-label="Contact"
          data-nav
        >
          <p className="font-sans text-[clamp(1rem,3vw,2.5rem)] font-light uppercase tracking-widest text-ivory">
            {t('hero.name.first')} {t('hero.name.last')}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-champagne">
            {t('contact.cta')}
          </p>
        </nav>
      );
    }

    const items = [
      { id: 'gd', label: t('nav.gd') },
      { id: 'work', label: t('nav.work') },
      { id: 'journey', label: t('nav.journey') },
      { id: 'expertise', label: t('nav.expertise') },
      { id: 'contact', label: t('nav.contact') },
    ];

    const locales = ['fr', 'en', 'ko'] as const;

    return (
      <nav
        className={cn(
          'fixed bottom-6 left-1/2 z-30 -translate-x-1/2',
          'flex items-center gap-1 px-2 py-2',
          'rounded-full border border-white/10 bg-charcoal/60 backdrop-blur-sm',
          className,
        )}
        aria-label="Primary"
        data-nav
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-ivory/90 transition-colors hover:text-champagne"
          >
            {item.label}
          </a>
        ))}
        <span className="mx-2 h-4 w-px bg-white/10" />
        {locales.map((loc) => (
          <a
            key={loc}
            href={`/${loc}`}
            className={cn(
              'px-2 text-[11px] font-mono uppercase tracking-wider transition-colors',
              loc === locale ? 'text-champagne' : 'text-ivory/50 hover:text-ivory',
            )}
            aria-current={loc === locale ? 'page' : undefined}
          >
            {labels[loc]}
          </a>
        ))}
      </nav>
    );
  },
);
