'use client';

import { useMemo, useRef } from 'react';

import { ActImmersion } from '@/acts/ActImmersion';
import { ActOpeningHero } from '@/acts/ActOpeningHero';
import { ActPhone } from '@/acts/ActPhone';
import { ActSocial } from '@/acts/ActSocial';
import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { heroVertical } from '@/content/media';
import type { SharedStoryRefs } from '@/lib/sharedStory';
import { Media } from '@/ui/Media';

import styles from './CinematicOpeningSequence.module.css';

interface Props {
  content: Content;
  locale: Locale;
}

export function CinematicOpeningSequence({ content, locale }: Props) {
  const mask = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const sharedStory = useMemo<SharedStoryRefs>(() => ({ mask, plane }), []);

  return (
    <div className={styles.sequence}>
      <div id="act-opening">
        <ActOpeningHero content={content} locale={locale} sharedStory={sharedStory} />
      </div>
      <div id="act-social" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActSocial content={content} locale={locale} sharedStory={sharedStory} />
      </div>
      <div id="act-phone" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActPhone content={content} locale={locale} sharedStory={sharedStory} />
      </div>
      <div id="act-immersion" className="act-handoff-overlap act-handoff-overlap--exact">
        <ActImmersion content={content} locale={locale} />
      </div>

      <div ref={mask} className={styles.bridgeMask} aria-hidden="true">
        <div ref={plane} className={styles.bridgePlane} data-shared-story-plane>
          <Media
            item={heroVertical}
            locale={locale}
            className={styles.bridgeMedia}
            sizes="(max-width: 1023px) 60vw, 28vw"
            preload
          />
        </div>
      </div>
    </div>
  );
}
