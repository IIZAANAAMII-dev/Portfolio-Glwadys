'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { locales, Locale } from '@/i18n';
import { appStore, Chapter } from '@/lib/store';

const sectionByLabel: Record<string, string> = {
  home: 'hero-section',
  work: 'work-section',
  about: 'about-section',
  expertise: 'services-section',
  contact: 'contact-section',
};

export function BottomNav({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [chapter, setChapter] = useState<Chapter>('intro');

  useEffect(() => {
    const unsubLoaded = appStore.subscribe((s) => {
      if (s.isLoaded && !visible) setVisible(true);
    });
    const unsubChapter = appStore.subscribe((s) => setChapter(s.currentChapter));
    return () => {
      unsubLoaded();
      unsubChapter();
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    gsap.fromTo(
      '.bottom-nav-capsule',
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: 0.15 }
    );
  }, [visible]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const switchLocale = (l: Locale) => {
    router.replace(pathname, { locale: l });
  };

  const navItems = [
    { key: 'home', label: 'GD', id: sectionByLabel.home },
    { key: 'work', label: t('work'), id: sectionByLabel.work },
    { key: 'about', label: t('about'), id: sectionByLabel.about },
    { key: 'expertise', label: t('expertise'), id: sectionByLabel.expertise },
    { key: 'contact', label: t('contact'), id: sectionByLabel.contact },
  ];

  return (
    <nav
      className={`fixed left-1/2 bottom-6 z-50 -translate-x-1/2 ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-label="Navigation"
    >
      <div className="bottom-nav-capsule flex items-center gap-1 md:gap-2 rounded-full px-2 py-2 md:px-4 md:py-2.5 bg-background-surface/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] opacity-0">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => scrollTo(item.id)}
            className="px-2.5 md:px-3 py-1.5 rounded-full font-mono text-[9px] md:text-[10px] tracking-[0.14em] uppercase text-foreground-muted transition-colors hover:text-foreground-light hover:bg-white/5"
          >
            {item.label}
          </button>
        ))}

        <span className="w-px h-3 bg-white/10 mx-1 hidden md:block" />

        <div className="flex items-center gap-0.5">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-6 h-6 md:w-7 md:h-7 rounded-full font-mono text-[9px] md:text-[10px] tracking-wider uppercase transition-all ${
                locale === l
                  ? 'bg-accent-gold text-background-dark font-semibold'
                  : 'text-foreground-muted hover:text-foreground-light'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <span className="hidden md:inline font-mono text-[9px] text-accent-gold/70 ml-1 tracking-wider">
          {chapter === 'hero' || chapter === 'intro' ? '01' : chapter === 'social' ? '02' : chapter === 'gallery' ? '03' : chapter === 'work' ? '08' : ''}
        </span>
      </div>
    </nav>
  );
}
