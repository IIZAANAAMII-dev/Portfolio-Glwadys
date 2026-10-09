/** Convert semantic timeline time to real scroll, never a guessed vh offset. */
export function filmScrollPosition(start: number, end: number, duration: number, time: number) {
  if (![start, end, duration, time].every(Number.isFinite) || duration <= 0 || end < start) {
    throw new RangeError('Invalid film geometry');
  }
  return start + (end - start) * Math.max(0, Math.min(1, time / duration));
}
