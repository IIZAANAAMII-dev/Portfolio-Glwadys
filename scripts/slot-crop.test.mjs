import assert from 'node:assert/strict';
import test from 'node:test';
import { coverToSlot } from '../src/lib/slotCrop.ts';

// Visible box of the transformed, clipped photograph (transform-origin 0 0).
function visible(photo, t) {
  const [top, right, bottom, left] = t.clipPath.match(/-?[\d.]+(?=%)/g).map((v) => Number(v) / 100);
  return {
    x: photo.x + t.x + t.scale * photo.w * left,
    y: photo.y + t.y + t.scale * photo.h * top,
    w: t.scale * photo.w * (1 - left - right),
    h: t.scale * photo.h * (1 - top - bottom),
    insets: [top, right, bottom, left],
  };
}

// Cover boxes and spread slots derived from the CSS at 1440×900 and 390×844.
const cases = {
  'yuna 1440': [{ x: 518.4, y: 0, w: 921.6, h: 900 }, { x: 118.08, y: 112.68, w: 570.24, h: 632.12 }],
  'mgc 1440': [{ x: 0, y: 279, w: 1036.8, h: 517 }, { x: 118.08, y: 112.68, w: 570.24, h: 632.12 }],
  'comptoir 1440': [{ x: 403.2, y: 0, w: 1036.8, h: 900 }, { x: 118.08, y: 112.68, w: 570.24, h: 632.12 }],
  'mgc 390': [{ x: 0, y: 227.88, w: 390, h: 303.84 }, { x: 22.4, y: 28, w: 345.2, h: 318.74 }],
  'comptoir 390': [{ x: 0, y: 67.52, w: 390, h: 489.52 }, { x: 22.4, y: 28, w: 345.2, h: 318.74 }],
};
const subjects = [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }, { x: 0.64, y: 0.5 }, { x: 0.66, y: 0.5 }, { x: 1, y: 1 }];

test('the cropped cover lands exactly on the spread slot, whatever its subject', () => {
  for (const [name, [photo, slot]] of Object.entries(cases)) {
    for (const subject of subjects) {
      const v = visible(photo, coverToSlot(photo, slot, subject));
      for (const key of ['x', 'y', 'w', 'h']) {
        assert.ok(Math.abs(v[key] - slot[key]) < 0.05, `${name} ${JSON.stringify(subject)}: ${key} ${v[key]} vs ${slot[key]}`);
      }
      assert.ok(v.insets.every((inset) => inset >= 0), `${name}: the crop leaves the photograph`);
    }
  }
});

test('the crop window is centred on the subject, clamped inside the photograph', () => {
  const photo = { x: 0, y: 0, w: 1000, h: 500 };
  const slot = { x: 0, y: 0, w: 400, h: 500 };
  const centre = (subject) => {
    const [, right, , left] = visible(photo, coverToSlot(photo, slot, subject)).insets;
    return (left + 1 - right) / 2;
  };
  assert.ok(Math.abs(centre({ x: 0.5, y: 0.5 }) - 0.5) < 1e-4);
  assert.ok(Math.abs(centre({ x: 0.66, y: 0.5 }) - 0.66) < 1e-4);
  assert.ok(Math.abs(centre({ x: 0.95, y: 0.5 }) - 0.8) < 1e-4);
  assert.ok(Math.abs(centre({ x: 0, y: 0.5 }) - 0.2) < 1e-4);
});
