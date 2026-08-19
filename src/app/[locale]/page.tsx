'use client';

import { useSmoothScroll } from '@/experience/hooks/useSmoothScroll';
import { ActOpening } from '@/experience/acts/ActOpening';
import { ActSocial } from '@/experience/acts/ActSocial';
import { BottomNav } from '@/experience/ui/BottomNav';
import { Grain } from '@/experience/ui/Grain';

/**
 * The experience is assembled act by act. Each act owns its own refs, timeline
 * and cleanup — there is no global master timeline, because a single timeline
 * spanning the whole page is impossible to reason about and impossible to tear
 * down safely.
 */
export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  useSmoothScroll();

  return (
    <>
      <a className="visually-hidden" href="#contact">
        Aller au contact
      </a>

      <main id="top">
        <ActOpening />
        <ActSocial />
      </main>

      <Grain />
      <BottomNav locale={locale} />
    </>
  );
}
