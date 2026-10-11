/** One scalar drives both the live spread and Journey's decorative copy.
 * Fixed type sizes and index geometry: only the hero/caption and print move.
 * Exactly one term is visible, and integer holds remove its transform entirely.
 */
export interface ExpertisePainter {
  measure: () => void;
  paint: (pos: number, chord: number) => void;
}

export function createExpertisePainter(scope: HTMLElement, isDesktop: boolean): ExpertisePainter {
  const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-expertise-row]'));
  const heroes = Array.from(scope.querySelectorAll<HTMLElement>('[data-expertise-hero]'));
  const contexts = Array.from(scope.querySelectorAll<HTMLElement>('[data-expertise-context]'));
  const print = scope.querySelector<HTMLElement>('[data-expertise-print]');
  const counter = scope.querySelector<HTMLElement>('[data-expertise-counter]');
  let shown = -1;
  let printTravel = 0;

  const measure = () => { printTravel = Math.min(isDesktop ? 24 : 10, (print?.clientHeight ?? 0) * 0.05); };
  const paint = (position: number) => {
    const pos = Math.max(0, Math.min(rows.length - 1, position));
    const active = Math.round(pos);
    const offset = active - pos;
    if (shown !== active) {
      shown = active;
      rows.forEach((row, index) => { row.dataset.active = String(index === active); });
      if (counter) counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(rows.length).padStart(2, '0')}`;
    }
    [heroes, contexts].forEach((nodes) => nodes.forEach((node, index) => {
      const selected = index === active;
      node.style.visibility = selected ? 'visible' : 'hidden';
      node.style.opacity = selected ? String(1 - Math.abs(offset) * 0.65) : '0';
      node.style.transform = selected && Math.abs(offset) > 0.001 ? `translateY(${(offset * 18).toFixed(2)}px)` : 'none';
    }));
    if (print) print.style.transform = `translateY(${(-printTravel * pos / Math.max(1, rows.length - 1)).toFixed(2)}px)`;
  };

  measure();
  return { measure, paint };
}

export function clearExpertisePaint(scope: HTMLElement) {
  scope.querySelectorAll<HTMLElement>('[data-expertise-row]').forEach((row, index) => {
    row.dataset.active = String(index === 0);
  });
  const counter = scope.querySelector<HTMLElement>('[data-expertise-counter]');
  if (counter) counter.textContent = `01 / ${String(scope.querySelectorAll('[data-expertise-row]').length).padStart(2, '0')}`;
  scope.querySelectorAll<HTMLElement>('[data-expertise-hero], [data-expertise-context], [data-expertise-print]').forEach((node) => {
    node.style.opacity = '';
    node.style.visibility = '';
    node.style.transform = '';
  });
}
