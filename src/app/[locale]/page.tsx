'use client';

import { useRef, useState } from 'react';
import { SmoothScroll } from '@/components/shell/SmoothScroll';
import { Grain } from '@/components/shell/Grain';
import { BottomNav, BottomNavHandle } from '@/components/shell/BottomNav';
import { CustomCursor } from '@/components/shell/CustomCursor';
import { Act00Opening } from '@/components/acts/Act00Opening';
import { Act01Hero } from '@/components/acts/Act01Hero';
import { Act02SocialWorld } from '@/components/acts/Act02SocialWorld';
import { Act03Phone } from '@/components/acts/Act03Phone';
import { Act04WebGLPortal } from '@/components/acts/Act04WebGLPortal';
import { Act05CreativeProcess } from '@/components/acts/Act05CreativeProcess';
import { Act06Work } from '@/components/acts/Act06Work';
import { Act07Journey } from '@/components/acts/Act07Journey';
import { Act08Expertise } from '@/components/acts/Act08Expertise';
import { Act09Contact } from '@/components/acts/Act09Contact';

export default function HomePage() {
  const [openingDone, setOpeningDone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const navRef = useRef<BottomNavHandle>(null);

  return (
    <SmoothScroll>
      <Grain />
      <CustomCursor />
      <BottomNav
        ref={navRef}
        className={
          openingDone
            ? 'opacity-100 transition-opacity duration-700'
            : 'pointer-events-none opacity-0'
        }
      />
      <main className="relative z-0">
        {openingDone ? null : <Act00Opening onComplete={() => setOpeningDone(true)} />}
        <Act01Hero />
        <Act02SocialWorld />
        <Act03Phone />
        <Act04WebGLPortal />
        <Act05CreativeProcess />
        <Act06Work />
        <Act07Journey />
        <Act08Expertise />
        <Act09Contact navRef={navRef} />
      </main>
    </SmoothScroll>
  );
}
