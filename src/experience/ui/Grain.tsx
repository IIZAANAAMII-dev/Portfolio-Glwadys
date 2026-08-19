/**
 * Analogue grain. Sits above content and below UI (--z-grain).
 * It should be felt rather than seen: 3% on dark grounds.
 */
export function Grain() {
  return <div className="grain" aria-hidden />;
}
