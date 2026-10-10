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
test('reading gate rejects tiny disclosures and collisions despite no page overflow', () => {
  const box = (y, fontSize = 14) => ({ text: 'copy', x: 20, y, w: 250, h: 20, fontSize });
  const project = { id: 'yuna', texts: [box(50, 40), box(350), box(430, 11)] };
  const state = { overflow: 0, film: 'work-yuna', state: 'read', projects: [project] };
  assert.doesNotThrow(() => assertReading(state, 320, 568));
  project.texts[2].fontSize = 8.8;
  assert.throws(() => assertReading(state, 320, 568), /disclosure too small/);
  project.texts[2] = box(360, 11);
  assert.throws(() => assertReading(state, 320, 568), /summary overlaps/);
});

test('spread disclosure must clear the image aperture', () => {
  const project = {
    id: 'yuna', decision: { x: 20, y: 260, w: 260, h: 90 }, decisionAlpha: 1,
    disclosureSize: 11, disclosure: { y: 230 }, slot: { y: 20, h: 200 },
  };
  const state = { overflow: 0, film: 'work-yuna', state: 'spread', projects: [project] };
  assert.doesNotThrow(() => assertReading(state, 320, 568));
  project.slot.h = 220;
  assert.throws(() => assertReading(state, 320, 568), /disclosure overlaps photograph/);
});

test('reading gate fails actual overflow and lifecycle leaks', () => {
  assert.throws(() => assertReading({ overflow: 5 }, 320, 568));
  assert.throws(() => assertReading({ overflow: 0, resized: true, countBefore: 20, countAfter: 21 }, 320, 568));
  assert.doesNotThrow(() => assertReading({ overflow: 0, resized: true, countBefore: 20, countAfter: 20 }, 320, 568));
});
