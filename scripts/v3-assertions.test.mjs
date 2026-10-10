import test from 'node:test';
import assert from 'node:assert/strict';
import { assertSeam, assertReading } from './v3-assertions.mjs';

const frame = { x: 100, y: 80, w: 200, h: 250, source: '/_next/image?url=%2Fphoto.jpg&w=640', fit: 'cover', position: '50% 50%', opacity: '1' };
test('seam gate accepts rounding and responsive resolution, not a changed crop/photo', () => {
  const seam = (after) => ({ beforeFilm: 'work', afterFilm: 'journey', frames: [frame, { ...frame, ...after }] });
  assert.doesNotThrow(() => assertSeam(seam({ x: 100.4, source: '/_next/image?url=%2Fphoto.jpg&w=1024' })));
  for (const bad of [{ x: 104 }, { source: '/other.jpg' }, { position: '50% 20%' }, { opacity: '0' }]) {
    assert.throws(() => assertSeam(seam(bad)));
  }
});
test('reading gate fails actual overflow and lifecycle leaks', () => {
  assert.throws(() => assertReading({ overflow: 5 }, 320, 568));
  assert.throws(() => assertReading({ overflow: 0, resized: true, countBefore: 20, countAfter: 21 }, 320, 568));
  assert.doesNotThrow(() => assertReading({ overflow: 0, resized: true, countBefore: 20, countAfter: 20 }, 320, 568));
});
