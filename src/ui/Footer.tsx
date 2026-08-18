'use client';

import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/10 bg-[#0b0c0e] px-6 md:px-14 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tag text-foreground-muted text-xs z-10 relative">
      <div>
        <p className="text-foreground-light">{t('rights')}</p>
        <p className="text-[10px] text-accent-gold mt-0.5">{t('craft')}</p>
      </div>

      <button
        onClick={scrollToTop}
        className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-foreground-light hover:text-accent-gold transition-colors cursor-pointer"
      >
        <span>{t('backToTop')}</span>
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}
