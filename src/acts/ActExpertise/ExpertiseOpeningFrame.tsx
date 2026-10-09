import type { RefObject } from 'react';

import type { Content } from '@/content';

import styles from './ActExpertise.module.css';

/**
 * One editorial page reused for the last Journey frame and the first
 * Expertise frame: a shared visual rather than two adjacent section intros.
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
  const animated = decorative ? {} : { 'data-expertise-content': '' };
  return (
    <>
      <span className={[styles.chapter, 'micro'].join(' ')} {...animated}>
        08 / Index
      </span>
      <h2
        id={decorative ? undefined : 'expertise-title'}
        className={[styles.heading, 'title'].join(' ')}
        {...animated}
      >
        {content.expertise.heading}
      </h2>
      <div className={styles.listViewport} {...animated}>
        <ol ref={listRef} className={styles.list}>
          {content.expertise.entries.map((entry, index) => (
            <li className={styles.row} key={entry.term}>
              <span className={[styles.index, 'micro'].join(' ')}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.term}>{entry.term}</span>
              <span className={[styles.context, 'micro'].join(' ')}>{entry.context}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className={[styles.aside, 'hand-note'].join(' ')} {...animated}>
        {content.strategy.sentence}
      </p>
    </>
  );
}
