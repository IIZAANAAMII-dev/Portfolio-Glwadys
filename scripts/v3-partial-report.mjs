import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';

// Supplemental Chromium evidence, explicitly NOT the required WebKit gate.
const root = process.argv[2] ?? 'docs/qa/astra-resume-final';
const expected = [
  'chromium-1440-fr-motion', 'chromium-390-fr-motion', 'chromium-390-ko-motion',
  'chromium-320-fr-motion', 'chromium-320-en-motion', 'chromium-320-ko-motion',
  'chromium-320-fr-reduced', 'chromium-320-en-reduced', 'chromium-320-ko-reduced',
  'chromium-320-fr-nojs',
];
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
let states = 0, screenshots = 0, maxSeamError = 0;
const measurements = [];
const browserVersions = new Set();
for (const name of expected) {
  const result = JSON.parse(await readFile(`${root}/${name}/results.json`, 'utf8'));
  assert.equal(result.sourceSha256, sourceSha256, `Stale: ${name}`);
  for (const field of ['errors', 'failures', 'assertions']) assert.deepEqual(result[field], [], `${name}/${field}`);
  assert.ok(result.states.every((state) => state.overflow <= 1));
  states += result.states.length;
  browserVersions.add(result.browserVersion);
  screenshots += (await readdir(`${root}/${name}`)).filter((file) => file.endsWith('.png')).length;
  for (const state of result.states) {
    if (state.state === 'read' && !state.reverse) {
      const project = state.projects.find((p) => `work-${p.id}` === state.film);
      const [, summary, note] = project.texts;
      measurements.push({ case: name, project: project.id, summaryPx: summary.fontSize,
        disclosurePx: note.fontSize, summaryToNoteGap: note.y - summary.y - summary.h });
    }
    if (state.film === 'expertise' && state.state === 'sixth' && result.width === 1440 && !state.reverse) {
      const term = state.terms[5];
      measurements.push({ case: name, state: 'expertise-sixth', textToRuleGap: state.rule.y - term.y - term.h });
    }
  }
  if (name.endsWith('-motion')) {
    for (const { frames: [a, b] } of JSON.parse(await readFile(`${root}/${name}/seams.json`, 'utf8'))) {
      for (const key of ['x', 'y', 'w', 'h']) maxSeamError = Math.max(maxSeamError, Math.abs(a[key] - b[key]));
    }
  }
}
const report = {
  status: 'PARTIAL — Chromium only; required WebKit matrix blocked by unavailable browser/network 403',
  sourceSha256, buildId: (await readFile('.next/BUILD_ID', 'utf8')).trim(), browserVersions: [...browserVersions],
  cases: expected.length, expected, states, screenshots, maxSeamError,
  errors: 0, failures: 0, assertions: 0, measurements,
};
await writeFile(`${root}/partial-summary.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
