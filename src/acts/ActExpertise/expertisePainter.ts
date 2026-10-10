import { clamp01, sampleAt } from '@/lib/holdScalar';

/**
 * The single writer of the Expertise index.
 *
 * `pos` ∈ [0, n-1] is the reading position, `chord` ∈ [0, 1] the final beat
 * where all seven disciplines are lit together. Term contrast, the champagne
 * reading rule, the context line and the counter are all derived from these
 * two numbers, never from timers or independent tweens. Journey renders a
 * decorative clone of the same frame and paints it with this very function at
 * pos 0, so the seam between both acts is the same pixels by construction.
 *
 * Writes are transform / opacity only: rows have a fixed CSS height, nothing
 * reflows while scrolling.
 */
export interface ExpertisePainter {
  measure: () => void;
  paint: (pos: number, chord: number) => void;
}

const REST_ALPHA = 0.68;

export function createExpertisePainter(scope: HTMLElement, isDesktop: boolean): ExpertisePainter {
  const list = scope.querySelector<HTMLElement>('[data-expertise-index]');
  const rows = Array.from(scope.querySelectorAll<HTMLElement>('[data-expertise-row]'));
  const terms = rows.map((row) => row.querySelector<HTMLElement>('[data-expertise-term]'));
  const nums = rows.map((row) => row.querySelector<HTMLElement>('[data-expertise-num]'));
  const rule = scope.querySelector<HTMLElement>('[data-expertise-rule]');
  const contextSlot = scope.querySelector<HTMLElement>('[data-expertise-contexts]');
  const contexts = Array.from(scope.querySelectorAll<HTMLElement>('[data-expertise-context]'));
  const counter = scope.querySelector<HTMLElement>('[data-expertise-counter]');
  const total = String(rows.length).padStart(2, '0');

  let rowTops: number[] = [];
  let shown = -1;

  const measure = () => {
    const listTop = list?.offsetTop ?? 0;
    rowTops = rows.map((row) => listTop + row.offsetTop);
  };

  const paint = (pos: number, chord: number) => {
    if (rowTops.length !== rows.length) measure();
    const active = Math.round(Math.min(rows.length - 1, Math.max(0, pos)));
    const y = Math.round(sampleAt(rowTops, pos) * 100) / 100;

    rows.forEach((row, index) => {
      const near = clamp01(1 - Math.abs(pos - index));
      const lit = Math.max(near, chord);
      const term = terms[index];
      const num = nums[index];
      if (term) {
        term.style.opacity = (REST_ALPHA + (1 - REST_ALPHA) * lit).toFixed(3);
        // Mobile keeps scale 1: the longest discipline must never overflow 320px.
        term.style.transform = isDesktop ? `scale(${(1 + 0.07 * near).toFixed(4)})` : '';
      }
      if (num) num.style.opacity = (0.5 + 0.5 * lit).toFixed(3);
      if (index === active) {
        if (row.dataset.active !== 'true') row.dataset.active = 'true';
      } else if (row.dataset.active) {
        delete row.dataset.active;
      }
    });

    if (rule) {
      rule.style.transform = `translate3d(0, ${y}px, 0)`;
      rule.style.opacity = (1 - chord).toFixed(3);
    }
    if (contextSlot && isDesktop) contextSlot.style.transform = `translate3d(0, ${y}px, 0)`;
    else if (contextSlot) contextSlot.style.transform = '';
    contexts.forEach((context, index) => {
      const delta = index - pos;
      const alpha = clamp01(1 - Math.abs(delta) * 2.4) * (1 - chord);
      context.style.opacity = alpha.toFixed(3);
      context.style.transform = `translate3d(0, ${(delta * 14).toFixed(2)}px, 0)`;
      context.style.visibility = alpha < 0.002 ? 'hidden' : 'visible';
    });

    if (counter && shown !== active) {
      shown = active;
      counter.textContent = `${String(active + 1).padStart(2, '0')} / ${total}`;
    }
  };

  measure();
  return { measure, paint };
}

/** Removes every inline style the painter wrote (matchMedia revert). */
export function clearExpertisePaint(scope: HTMLElement) {
  scope.querySelectorAll<HTMLElement>('[data-expertise-row]').forEach((row, index) => {
    if (index === 0) row.dataset.active = 'true';
    else delete row.dataset.active;
  });
  const counter = scope.querySelector<HTMLElement>('[data-expertise-counter]');
  if (counter) counter.textContent = `01 / ${String(scope.querySelectorAll('[data-expertise-row]').length).padStart(2, '0')}`;
  scope
    .querySelectorAll<HTMLElement>(
      '[data-expertise-term], [data-expertise-num], [data-expertise-rule], [data-expertise-contexts], [data-expertise-context]',
    )
    .forEach((node) => {
      node.style.opacity = '';
      node.style.transform = '';
      node.style.visibility = '';
    });
}
