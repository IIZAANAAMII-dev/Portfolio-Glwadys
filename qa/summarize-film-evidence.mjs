import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root = 'docs/qa/sol61-builder';
const batches = await Promise.all([1440, 390, 320].map(async width => JSON.parse(await fs.readFile(`${root}/pass-b/${width}/results.json`, 'utf8'))));
const results = batches.flatMap(batch => batch.results);
const failures = batches.flatMap(batch => batch.failures);
const contexts = results.filter(result => result.twins);
const summary = {
  contexts: contexts.length,
  semanticSamples: results.filter(result => result.state).length,
  identicalForwardReversePhotoPixels: contexts.every(context => new Set(context.twins.map(twin => twin.sha256)).size === 1),
  failures,
};
assert.equal(summary.contexts, 9);
assert.equal(summary.semanticSamples, 198);
assert.equal(summary.identicalForwardReversePhotoPixels, true);
assert.deepEqual(failures, []);
await fs.writeFile(`${root}/pass-b/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
