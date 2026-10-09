import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filmScrollPosition } from '../src/lib/visualQaMath.ts';

test('semantic times use measured trigger geometry', () => {
  assert.equal(filmScrollPosition(200, 8800, 8.6, 4.3), 4500);
  assert.equal(filmScrollPosition(200, 8800, 8.6, 8.6), 8800);
  assert.equal(filmScrollPosition(6369, 10334, 6.35, 0), 6369);
});
test('out-of-range seeks clamp without overshooting adjacent scenes', () => {
  assert.equal(filmScrollPosition(500, 2500, 2, -1), 500);
  assert.equal(filmScrollPosition(500, 2500, 2, 4), 2500);
});
test('invalid or stale geometry fails explicitly', () => {
  for (const values of [[0, 100, 0, 1], [100, 0, 1, 1], [0, 100, 1, NaN], [0, Infinity, 1, 0]]) {
    assert.throws(() => filmScrollPosition(...values), RangeError);
  }
});
