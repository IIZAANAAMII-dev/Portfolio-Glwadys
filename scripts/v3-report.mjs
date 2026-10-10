import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile, stat } from 'node:fs/promises';

const hash = createHash('sha256');
async function fingerprint(dir) {
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await fingerprint(path);
    else hash.update(path).update(await readFile(path));
  }
}
await fingerprint('src');
hash.update(await readFile('package-lock.json'));
const sourceSha256 = hash.digest('hex');
const root = 'docs/qa/v3-final';
const expected = [];
for (const [engine, width] of [['chromium', 1440], ['webkit', 390], ['webkit', 320]]) {
  for (const locale of ['fr', 'en', 'ko']) for (const mode of ['motion', 'reduced']) expected.push(`${engine}-${width}-${locale}-${mode}`);
}
expected.push('webkit-320-fr-nojs');
let stateCount = 0, screenshotCount = 0, screenshotBytes = 0, maxSeamError = 0;
for (const name of expected) {
  const result = JSON.parse(await readFile(`${root}/${name}/results.json`));
  assert.equal(result.sourceSha256, sourceSha256, `Stale evidence: ${name}`);
  for (const key of ['errors', 'failures', 'assertions']) assert.deepEqual(result[key], [], `${name}: ${key}`);
  assert.ok(result.states.every((s) => s.overflow <= 1));
  stateCount += result.states.length;
  for (const file of await readdir(`${root}/${name}`)) if (file.endsWith('.png')) {
    screenshotCount++;
    screenshotBytes += (await stat(`${root}/${name}/${file}`)).size;
  }
  if (name.endsWith('-motion')) {
    const seams = JSON.parse(await readFile(`${root}/${name}/seams.json`));
    for (const { frames: [a, b] } of seams) for (const key of ['x', 'y', 'w', 'h']) maxSeamError = Math.max(maxSeamError, Math.abs(a[key] - b[key]));
  }
}
const interactions = JSON.parse(await readFile(`${root}/interactions.json`));
assert.equal(interactions.length, 6);
assert.ok(interactions.every((i) => i.keyboardAnchors && i.contact && i.errors.length === 0));
const summary = { sourceSha256, buildId: (await readFile('.next/BUILD_ID', 'utf8')).trim(), cases: expected.length, expected,
  stateCount, interactionCases: interactions.length, screenshotCount, screenshotBytes, maxSeamError,
  consoleErrors: 0, failedResponses: 0, assertionFailures: 0 };
await writeFile(`${root}/summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
