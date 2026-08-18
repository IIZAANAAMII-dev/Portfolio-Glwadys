'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '../navigation';
import { locales, Locale } from '../i18n';
import { useState, useEffect } from 'react';
import { appStore, Chapter } from '../lib/store';
import { Compass, Globe, Menu, X, ArrowUpRight } from 'lucide-react';

export function Navbar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter>('intro');

  useEffect(() => {
    const unsub = appStore.subscribe((state) => {
      setCurrentChapter(state.currentChapter);
      setIsIndexOpen(state.isIndexOpen);
    });
    return () => {
      unsub();
    };
  }, []);

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  const toggleIndex = () => {
    appStore.setState({ isIndexOpen: !isIndexOpen });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 md:px-8 py-5 flex items-center justify-between pointer-events-none">
      {/* Brand Identity Pill */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
          <span className="font-editorial text-sm tracking-wide text-foreground-light group-hover:text-accent-gold transition-colors">
            GLWADYS DALLEAU
          </span>
          <span className="font-mono-tag text-[10px] text-foreground-muted hidden sm:inline ml-2">
            MARSEILLE, FR
          </span>
        </button>
      </div>

      {/* Center Dynamic Chapter Indicator */}
      <div className="hidden lg:flex items-center gap-2 pointer-events-auto">
        <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2">
          <span className="font-mono-tag text-[10px] text-accent-gold">
            CHAPITRE
          </span>
          <span className="text-xs text-foreground-light font-medium tracking-wider uppercase">
            {currentChapter}
          </span>
        </div>
      </div>

      {/* Right Controls: Index, Languages, Contact */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {/* Language Selector */}
        <div className="glass-panel rounded-full p-1 flex items-center gap-1">
          {(['fr', 'en', 'ko'] as const).map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase transition-all ${
                locale === l
                  ? 'bg-accent-gold text-background-dark font-bold'
                  : 'text-foreground-muted hover:text-foreground-light'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Index Toggle */}
        <button
          onClick={toggleIndex}
          className="glass-pill px-3.5 py-2 rounded-full flex items-center gap-2 text-xs font-mono text-foreground-light hover:border-accent-gold transition-colors cursor-pointer"
          aria-label={t('index')}
        >
          <Compass className="w-3.5 h-3.5 text-accent-gold" />
          <span className="hidden sm:inline">{t('index')}</span>
        </button>

        {/* Contact CTA */}
        <button
          onClick={scrollToContact}
          className="glass-pill bg-accent-gold/20 hover:bg-accent-gold hover:text-background-dark text-accent-gold px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          <span>{t('contact')}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
}
