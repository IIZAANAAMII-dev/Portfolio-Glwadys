import Image from 'next/image';
import type { CSSProperties } from 'react';

import { ratioValue, type MediaItem } from '@/content/media';
import type { Locale } from '@/content/locales';

import styles from './Media.module.css';

interface MediaProps {
  item: MediaItem;
  locale: Locale;
  /** Index affiché sur la réservation, ex. 3 → « 03 ». */
  index?: number;
  total?: number;
  /** Masque la cotation : réservations trop petites pour la porter. */
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
  sizes?: string;
  /** Permet de neutraliser le preload quand le même média réapparaît plus loin dans le film. */
  preload?: boolean;
}

/**
 * Rend un emplacement média.
 *
 * - `item.src` présent → image réelle (`next/image`).
 * - `item.src` absent  → réservation éditoriale cotée.
 *
 * Dans les deux cas, le ratio vient de la **donnée**, jamais du fichier :
 * c'est ce qui garantit qu'aucune composition ne bouge à l'arrivée des vrais
 * visuels, et donc qu'aucune timeline n'a à être recalée.
 */
export function Media({
  item,
  locale,
  index,
  total,
  compact = false,
  className,
  style,
  sizes = '(max-width: 1023px) 60vw, 30vw',
  preload,
}: MediaProps) {
  const frameStyle = {
    '--ratio': ratioValue[item.ratio],
    ...(item.focus ? { '--focus': item.focus } : {}),
    ...style,
  } as CSSProperties;

  const classes = [styles.frame, compact ? styles.compact : '', className]
    .filter(Boolean)
    .join(' ');

  if (item.src) {
    return (
      <div
        className={classes}
        data-tone={item.tone}
        data-media={item.id}
        data-cursor="view"
        style={frameStyle}
      >
        <Image
          className={styles.image}
          src={item.src}
          alt={item.alt?.[locale] ?? ''}
          fill
          sizes={sizes}
          preload={preload ?? item.priority}
        />
      </div>
    );
  }

  return (
    <div
      className={classes}
      data-tone={item.tone}
      data-media={item.id}
      data-reserved="true"
      style={frameStyle}
      /* Une réservation ne porte aucune information : elle ne doit pas
         polluer un lecteur d'écran avec « emplacement réservé ». */
      aria-hidden="true"
    >
      <div className={styles.reservation}>
        <span className={styles.mark} data-corner="tl" />
        <span className={styles.mark} data-corner="tr" />
        <span className={styles.mark} data-corner="bl" />
        <span className={styles.mark} data-corner="br" />
        <span className={styles.axis} />
        <span className={`${styles.caption} micro`}>
          {item.role} · {item.ratio}
        </span>
        {index !== undefined && (
          <span className={`${styles.index} micro`}>
            {String(index).padStart(2, '0')}
            {total !== undefined ? ` / ${String(total).padStart(2, '0')}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
