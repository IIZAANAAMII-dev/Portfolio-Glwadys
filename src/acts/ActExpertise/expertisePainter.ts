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
  const layers = Array.from(scope.querySelectorAll<HTMLElement>('[data-expertise-layer]'));
  const counter = scope.querySelector<HTMLElement>('[data-expertise-counter]');
  let shown = -1;
  let printTravel = 0;

  /* Study i is uncovered while the reading travels from discipline i-1 to i.
     Only the top fully laid print and the one being laid are painted: on a
     hold (integer position) exactly one study exists for the compositor. */
  const paintStudies = (pos: number) => {
    if (layers.length < 2) return;
    const top = Math.min(layers.length - 1, Math.max(0, Math.floor(pos + 1e-4)));
    layers.forEach((layer, index) => {
      const reveal = index === 0 ? 1 : Math.min(1, Math.max(0, pos - index + 1));
      const visible = index === top || (index === top + 1 && reveal > 0.001);
      layer.style.visibility = visible ? 'visible' : 'hidden';
      if (index > 0) layer.style.setProperty('--reveal', reveal.toFixed(4));
    });
  };

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
    paintStudies(pos);
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
  scope.querySelectorAll<HTMLElement>('[data-expertise-layer]').forEach((layer) => {
    layer.style.visibility = '';
    layer.style.removeProperty('--reveal');
  });
}
