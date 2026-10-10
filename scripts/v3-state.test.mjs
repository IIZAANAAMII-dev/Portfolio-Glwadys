import assert from 'node:assert/strict';
import test from 'node:test';
import { heldSteps, sampleAt, segment, settle } from '../src/lib/holdScalar.ts';

test('empty and single-entry scenes never advance', () => {
  for (const count of [0, 1]) for (const t of [-1, 0, 0.5, 1, 2]) assert.equal(heldSteps(t, count), 0);
});
test('six archive and seven index states have exact reading holds', () => {
  for (const count of [6, 7]) {
    for (let i = 0; i < count; i++) {
      assert.equal(heldSteps(i / (count - 1), count), i);
      for (const offset of [-0.1, 0.1]) {
        assert.equal(heldSteps((i + offset) / (count - 1), count), i);
      }
    }
  }
});
test('forward and reverse are deterministic, bounded and monotone', () => {
  const points = Array.from({ length: 1001 }, (_, i) => i / 1000);
  const forward = points.map((t) => heldSteps(t, 7));
  assert.deepEqual([...points].reverse().map((t) => heldSteps(t, 7)).reverse(), forward);
  assert.ok(forward.every((p, i) => p >= 0 && p <= 6 && (i === 0 || p >= forward[i - 1])));
});
test('segments, easing and measured row interpolation clamp correctly', () => {
  assert.equal(segment(0, 0.2, 0.8), 0);
  assert.equal(segment(1, 0.2, 0.8), 1);
  assert.equal(settle(0.5), 0.5);
  assert.equal(sampleAt([], 10), 0);
  assert.equal(sampleAt([90, 130, 170], 1.5), 150);
  assert.equal(sampleAt([90, 130], -1), 90);
  assert.equal(sampleAt([90, 130], 5), 130);
});
