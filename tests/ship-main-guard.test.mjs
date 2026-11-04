import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('ship refuses main before preparing a release or calling external tools', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'qa-ship-guard-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, 'scripts'));
  mkdirSync(path.join(root, 'bin'));
  copyFileSync('scripts/release-cycle.sh', path.join(root, 'scripts/release-cycle.sh'));
  writeFileSync(path.join(root, 'bin/git'), '#!/bin/sh\n[ "$1 $2" = "branch --show-current" ] && { echo main; exit 0; }\necho unexpected-git-call >&2\nexit 99\n', { mode: 0o755 });
  const result = spawnSync('/bin/bash', [path.join(root, 'scripts/release-cycle.sh'), 'test', 'skip'], {
    encoding: 'utf8', env: { ...process.env, PATH: `${path.join(root, 'bin')}:/usr/bin:/bin` },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /requires a feature branch/);
  assert.doesNotMatch(result.stderr, /unexpected-git-call/);
});
