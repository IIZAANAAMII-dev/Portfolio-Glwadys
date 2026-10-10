/** Pure crop geometry of the Work spread (unit-tested in scripts/slot-crop.test.mjs). */

export type Box = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };

/**
 * The cover photograph lands in the spread's photo slot. Its box is first
 * cropped (clip-path, % of its own box) to the slot's proportions around the
 * photograph's subject, then that crop is scaled and placed exactly on the
 * slot. The image itself is never re-laid out or re-cropped by object-fit.
 * The returned x / y / scale assume `transform-origin: 0 0`.
 */
export function coverToSlot(photo: Box, slot: Box, subject: Point) {
  const aspect = slot.w / slot.h;
  const cropW = Math.min(photo.w, photo.h * aspect);
  const cropH = cropW / aspect;
  const cx = Math.min(photo.w - cropW, Math.max(0, photo.w * subject.x - cropW / 2));
  const cy = Math.min(photo.h - cropH, Math.max(0, photo.h * subject.y - cropH / 2));
  const k = slot.w / cropW;
  // Insets are never negative (float noise would print "-0.000%").
  const pct = (v: number, of: number) => `${Math.max(0, (v / of) * 100).toFixed(3)}%`;
  return {
    x: slot.x - photo.x - k * cx,
    y: slot.y - photo.y - k * cy,
    scale: k,
    clipPath: `inset(${pct(cy, photo.h)} ${pct(photo.w - cropW - cx, photo.w)} ${pct(photo.h - cropH - cy, photo.h)} ${pct(cx, photo.w)})`,
  };
}
