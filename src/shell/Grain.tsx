import styles from './Grain.module.css';

/** Matière de papier, posée une seule fois au-dessus de tout le site. */
export function Grain() {
  return (
    <div className={styles.grain} aria-hidden="true">
      <span className={styles.coarse} />
      <span className={styles.fiber} />
      <span className={styles.fine} />
    </div>
  );
}
