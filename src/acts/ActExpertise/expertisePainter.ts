import { clamp01, sampleAt } from '@/lib/holdScalar';

/**
 * The single writer of the Expertise index.
 *
 * `pos` ∈ [0, n-1] is the reading position, `chord` ∈ [0, 1] the final beat
 * where all seven disciplines are lit together. Term size and contrast, the
 * band each row occupies, the champagne reading rule, the context line and the
 * counter are all derived from these two numbers, never from timers or
 * independent tweens. Journey paints its decorative clone of the same frame
 * with this very function at pos 0, so the seam is the same pixels by
 * construction.
 *
 * The active discipline is set at hero size. Its row opens into a taller band
 * and the rows below move down by the same amount: transforms only, the list
 * never reflows. Each term has its own hero scale, capped so it still fits the
 * measure whatever the locale or the viewport: a long term ("Brand
 * Communication" at 320px) is never clipped and a short one is never held back
 * to the longest one's size.
 */
export interface ExpertisePainter {
  measure: () => void;
  paint: (pos: number, chord: number) => void;
}

const REST_ALPHA = { desktop: 0.78, mobile: 0.82 } as const;
// Mobile: short disciplines open to ~1.9× (≈ 33px at 320, 42px at 390);
// long ones stop at the measure (painter `heroes`), never clipped.
const HERO_CAP = { desktop: 2.05, mobile: 1.9 } as const;

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

  const restAlpha = isDesktop ? REST_ALPHA.desktop : REST_ALPHA.mobile;
  const cap = isDesktop ? HERO_CAP.desktop : HERO_CAP.mobile;
  let rowTops: number[] = [];
  let rowH = 0;
  let termH = 0;
  let heroes: number[] = [];
  let shown = -1;

  const measure = () => {
    const listTop = list?.offsetTop ?? 0;
    rowTops = rows.map((row) => listTop + row.offsetTop);
    rowH = rows[0]?.offsetHeight ?? 0;
    termH = terms[0]?.offsetHeight ?? 0;
    // offset* ignore transforms: these are the unscaled, natural widths.
    // getBoundingClientRect would include the current hero scale.
    heroes = terms.map((term) => {
      if (!term || !term.offsetWidth) return 1;
      const room = (term.parentElement?.clientWidth ?? 0) - term.offsetLeft - 2;
      return Math.max(1, Math.min(cap, room / term.offsetWidth));
    });
  };

  const paint = (pos: number, chord: number) => {
    if (rowTops.length !== rows.length || heroes.length !== rows.length) measure();
    const active = Math.round(Math.min(rows.length - 1, Math.max(0, pos)));
    const tops: number[] = [];
    const bands: number[] = [];
    let shift = 0;

    rows.forEach((row, index) => {
      const near = clamp01(1 - Math.abs(pos - index));
      const lit = Math.max(near, chord);
      const grow = ((heroes[index] ?? 1) - 1) * near;
      const extra = termH * grow;
      tops.push(rowTops[index]! + shift);
      bands.push(rowH + extra);
      row.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      row.style.setProperty('--band', `${(rowH + extra).toFixed(2)}px`);
      const term = terms[index];
      const num = nums[index];
      if (term) {
        term.style.opacity = (restAlpha + (1 - restAlpha) * lit).toFixed(3);
        term.style.transform = `translate3d(0, ${(extra / 2).toFixed(2)}px, 0) scale(${(1 + grow).toFixed(4)})`;
      }
      if (num) {
        num.style.opacity = (0.5 + 0.5 * lit).toFixed(3);
        num.style.transform = `translate3d(0, ${(extra / 2).toFixed(2)}px, 0)`;
      }
      if (index === active) {
        if (row.dataset.active !== 'true') row.dataset.active = 'true';
      } else if (row.dataset.active) {
        delete row.dataset.active;
      }
      shift += extra;
    });

    const y = sampleAt(tops, pos);
    const band = sampleAt(bands, pos);
    if (rule) {
      // Desktop: a hairline under the active band. Mobile: a bar beside it.
      rule.style.transform = isDesktop
        ? `translate3d(0, ${(y + band - 1).toFixed(2)}px, 0)`
        : `translate3d(0, ${y.toFixed(2)}px, 0) scaleY(${(band / Math.max(1, rowH)).toFixed(4)})`;
      rule.style.opacity = (1 - chord).toFixed(3);
    }
    if (contextSlot) {
      contextSlot.style.transform = isDesktop
        ? `translate3d(0, ${(y + (band - rowH) / 2).toFixed(2)}px, 0)`
        : `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    }
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
    row.style.transform = '';
    row.style.removeProperty('--band');
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
