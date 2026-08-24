import type { CSSProperties } from 'react';

import type { Locale } from '@/content/locales';
import { contactSheet } from '@/content/media';
import { galleryFlatSlots } from '@/acts/ActScrollStory/galleryLayout';

import { Media } from './Media';
import styles from './ArchivePlate.module.css';

interface ArchivePlateProps {
  locale: Locale;
  className?: string;
  eyebrow?: string;
  title?: string;
  marker?: 'handoff' | 'process-entry';
}

function slotStyle(index: number): CSSProperties {
  const slot = galleryFlatSlots[index]!;
  return {
    '--flat-left': `${slot.desktop.left * 100}%`,
    '--flat-top': `${slot.desktop.top * 100}%`,
    '--flat-width': `${slot.desktop.width * 100}%`,
    '--flat-aspect': slot.desktop.aspect,
    '--flat-mobile-left': `${slot.mobile.left * 100}%`,
    '--flat-mobile-top': `${slot.mobile.top * 100}%`,
    '--flat-mobile-width': `${slot.mobile.width * 100}%`,
    '--flat-mobile-aspect': slot.mobile.aspect,
  } as CSSProperties;
}

/**
 * The one-frame DOM twin of Gallery3D's resolved composition.
 * It is decorative here: the canonical, accessible contact-sheet content sits
 * directly beneath it in ActProcess.
 */
export function ArchivePlate({ locale, className, eyebrow, title, marker }: ArchivePlateProps) {
  return (
    <div
      className={[styles.plate, className].filter(Boolean).join(' ')}
      data-archive-plate={marker}
      aria-hidden="true"
    >
      {eyebrow && <span className={`${styles.eyebrow} micro`}>{eyebrow}</span>}
      {title && <span className={`${styles.title} display`}>{title}</span>}

      {contactSheet.slice(0, galleryFlatSlots.length).map((item, index) => (
        <figure className={styles.card} style={slotStyle(index)} key={item.id}>
          <span className={`${styles.index} micro`}>{String(index + 1).padStart(2, '0')}</span>
          <Media item={item} locale={locale} compact sizes="25vw" />
        </figure>
      ))}

      <span className={styles.rule} />
    </div>
  );
}
