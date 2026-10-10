import assert from 'node:assert/strict';

export function assertSeam(seam, tolerance = 1) {
  const [before, after] = seam.frames;
  for (const key of ['x', 'y', 'w', 'h']) {
    assert.ok(Math.abs(before[key] - after[key]) <= tolerance,
      `${seam.beforeFilm} → ${seam.afterFilm}: ${key} differs (${before[key]} / ${after[key]})`);
  }
  // Different responsive image resolutions are allowed; the underlying photo is not.
  const source = (url) => url ? new URL(url, 'https://qa.local').searchParams.get('url') ?? url : null;
  assert.equal(source(before.source), source(after.source), 'Seam changed the source photograph');
  for (const key of ['fit', 'position', 'opacity']) assert.equal(before[key], after[key], `Seam changed ${key}`);
}

export function assertReading(state, width, height) {
  assert.ok(state.overflow <= 1, `Document overflow: ${state.overflow}px`);
  if (state.film === 'expertise' && !['contact', 'all'].includes(state.state)) {
    const names = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
    const index = names.indexOf(state.state);
    assert.equal(state.terms.length, 7, 'The index must retain all seven disciplines');
    assert.equal(state.counter, `${String(index + 1).padStart(2, '0')} / 07`);
    assert.equal(state.active, state.terms[index].text);
    assert.equal(Number(state.terms[index].alpha), 1, 'Active term faded');
    for (const term of state.terms) {
      assert.ok(term.x >= -1 && term.x + term.w <= width + 1, `${term.text}: horizontal clipping`);
      assert.ok(term.y >= 0 && term.y + term.h < height - 90, `${term.text}: vertical clipping/control collision`);
    }
    // Desktop: hairline under the active band. Mobile: bar beside it, as tall as the band.
    const band = state.band ?? state.activeRow.h;
    assert.ok(Math.abs(state.rule.y - state.activeRow.y - (width >= 1024 ? band - 1 : 0)) <= 1.5,
      'Active rule and row are desynchronized');
    if (width < 1024) assert.ok(Math.abs(state.rule.h - band) <= 1.5, 'Active bar and band differ');
    const active = state.terms[index];
    for (const term of state.terms) {
      if (term !== active) assert.ok(active.h > term.h * 1.15, `${active.text}: active discipline is not set apart`);
    }
  }
  if (state.state === 'spread') {
    const project = state.projects.find((p) => `work-${p.id}` === state.film);
    const d = project.decision;
    assert.equal(Number(project.decisionAlpha), 1, `${project.id}: decision page not settled`);
    assert.ok(d.x >= -1 && d.x + d.w <= width + 1, `${project.id}: decision clipped horizontally`);
    assert.ok(d.y >= 0 && d.y + d.h <= height - 100, `${project.id}: decision under navigation`);
  }
  if (state.state === 'read') {
    const project = state.projects.find((p) => `work-${p.id}` === state.film);
    const [title, summary, note] = project.texts;
    for (const text of [title, summary, note]) {
      assert.ok(text.x >= -1 && text.x + text.w <= width + 1, `${project.id}: ${text.text} clipped horizontally`);
      assert.ok(text.y >= 0 && text.y + text.h <= height - 60, `${project.id}: copy under navigation`);
    }
    assert.ok(title.y + title.h <= summary.y + 1, `${project.id}: title overlaps summary`);
    assert.ok(summary.y + summary.h <= note.y + 1, `${project.id}: summary overlaps image disclosure`);
  }
  if (state.resized) assert.equal(state.countBefore, state.countAfter, 'Resize leaked ScrollTriggers');
}
