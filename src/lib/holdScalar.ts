/**
 * Pure scroll maths shared by the archive (Journey) and the index (Expertise).
 *
 * Every visual state of those acts is derived from ONE scroll scalar through
 * these functions, so forward and reverse scrolling replay identical frames
 * and the counter can never disagree with what is on screen.
 */

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Normalised position of `t` inside [from, to]. */
export const segment = (t: number, from: number, to: number) =>
  clamp01((t - from) / Math.max(1e-6, to - from));

/** Symmetric ease (≈ power2.inOut): a physical start and settle. */
export const settle = (x: number) => {
  const v = clamp01(x);
  return v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2;
};

/**
 * Maps a 0..1 progress onto 0..(count-1) with a still HOLD on every integer.
 * `hold` is the fraction of each step spent motionless on either side,
 * so a step is: hold — eased travel — hold.
 */
export function heldSteps(progress: number, count: number, hold = 0.22): number {
  if (count <= 1) return 0;
  const steps = count - 1;
  const u = clamp01(progress) * steps;
  const index = Math.min(steps - 1, Math.floor(u));
  const local = u - index;
  const travel = clamp01((local - hold) / Math.max(1e-6, 1 - 2 * hold));
  return index + settle(travel);
}

/** Linear interpolation inside a list of numbers at a fractional index. */
export function sampleAt(values: number[], position: number): number {
  if (values.length === 0) return 0;
  const p = Math.min(values.length - 1, Math.max(0, position));
  const i = Math.floor(p);
  const next = values[Math.min(values.length - 1, i + 1)]!;
  return values[i]! + (next - values[i]!) * (p - i);
}
