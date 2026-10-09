/** The four formats share one reversible scroll clock (viewport units). */
export const PHONE_BEAT = 0.44;

export function phonePhase(time: number, montage: number, exit: number, count: number): number {
  if (![time, montage, exit, count].every(Number.isFinite) || count < 1 || time < montage || time >= exit) return -1;
  // Decimal beat boundaries must not fall into the previous phase through
  // floating-point subtraction. This tolerance is below visible scroll precision.
  return Math.min(count - 1, Math.floor((time - montage) / PHONE_BEAT + 1e-9));
}

export function phoneReadingTime(index: number, montage: number): number {
  return montage + index * PHONE_BEAT + 0.34;
}
