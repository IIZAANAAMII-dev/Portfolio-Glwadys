import type { RefObject } from 'react';

import type { Content } from '@/content';

import styles from './ActExpertise.module.css';

/**
 * The wine index: seven communication disciplines set as one typographic
 * page. Rendered by Expertise itself and, decoratively, by Journey's last
 * frame (the same page rising over the archive), so both sides of the seam
 * are the same DOM, CSS and painter.
 */
export function ExpertiseOpeningFrame({
  content,
  listRef,
  decorative = false,
}: {
  content: Content;
  listRef?: RefObject<HTMLOListElement | null>;
  decorative?: boolean;
}) {
  const total = String(content.expertise.entries.length).padStart(2, '0');
  return (
    <>
      <span className={[styles.chapter, 'micro'].join(' ')}>08 / Index</span>
      <h2 id={decorative ? undefined : 'expertise-title'} className={styles.heading}>
        {content.expertise.heading}
      </h2>
      <span className={[styles.counter, 'micro'].join(' ')} data-expertise-counter aria-hidden="true">
        01 / {total}
      </span>
      <span className={styles.margin} aria-hidden="true" />
      <ol ref={listRef} className={styles.index} data-expertise-index>
        {content.expertise.entries.map((entry, index) => (
          <li
            className={styles.row}
            data-expertise-row
            data-active={index === 0 ? 'true' : undefined}
            key={entry.term}
          >
            <span className={styles.num} data-expertise-num aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className={styles.term} data-expertise-term>
              {entry.term}
            </span>
            {/* Read by assistive tech in every mode; printed under the term
                when motion is reduced. The animated slot below is decorative. */}
            <span className={styles.rowContext}>{entry.context}</span>
          </li>
        ))}
      </ol>
      <span className={styles.rule} data-expertise-rule aria-hidden="true" />
      <div className={styles.contexts} data-expertise-contexts aria-hidden="true">
        {content.expertise.entries.map((entry, index) => (
          <p
            className={styles.context}
            data-expertise-context
            data-first={index === 0 ? 'true' : undefined}
            key={entry.term}
          >
            {entry.context}
          </p>
        ))}
      </div>
    </>
  );
}
