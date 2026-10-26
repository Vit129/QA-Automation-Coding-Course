// Regression test for Security-Testing's migrateLegacyProgress().
//
// Bug it guards: the migration map used to COPY each learner's saved sandbox code from a
// legacy lesson id to the new lesson id. But every remapped lesson changed its task and
// function signature during the v0.14.0 rewrite, so the copied code was the stale
// pre-rewrite template (e.g. the old `/api/ai/recommend` auth test) showing up under a
// lesson whose task is now completely different ("ยังเป็นตัวเก่า"). The fix: migrate only
// the completion flag, and remove any stale code copy an earlier migration already made —
// but only when it is byte-identical to the old code (learner never edited it).

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const courseCode = fs.readFileSync(path.join(__dirname, '../Security-Testing/course.js'), 'utf8');

// Minimal in-memory localStorage that the IIFE's migrateLegacyProgress() can drive.
function makeLocalStorage(initial) {
  const store = { ...initial };
  return {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    _dump: () => store,
  };
}

// Run course.js (which calls migrateLegacyProgress() at load) against a given localStorage.
function runWith(localStorage) {
  const sandbox = {
    console,
    document: { getElementById: () => null, addEventListener: () => {} },
    localStorage,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(courseCode, sandbox);
  return sandbox;
}

console.log('🧪 Running Security-Testing legacy-migration regression tests...');

// Test 1: completion flag migrates from the legacy id to the new id.
{
  const ls = makeLocalStorage({ 'sec_course_completed_auth_bypass': 'true' });
  runWith(ls);
  assert.strictEqual(
    ls.getItem('sec_course_completed_auth_bypass_prevention'), 'true',
    'completion flag should migrate auth_bypass -> auth_bypass_prevention'
  );
  console.log('✓ Test 1: completion flag migrates');
}

// Test 2: a stale code copy identical to the old code is REMOVED (so the new template shows).
{
  const staleOldCode = "// old /api/ai/recommend lesson\nconst r = await request.post('/api/ai/recommend');";
  const ls = makeLocalStorage({
    'sec_sandbox_code_auth_bypass': staleOldCode,
    'sec_sandbox_code_auth_bypass_prevention': staleOldCode, // what a prior migration copied
  });
  runWith(ls);
  assert.strictEqual(
    ls.getItem('sec_sandbox_code_auth_bypass_prevention'), null,
    'byte-identical stale code copy must be removed so the new lesson template is shown'
  );
  console.log('✓ Test 2: stale copied code is cleaned up');
}

// Test 3: code the learner actually edited on the NEW lesson is preserved (not clobbered).
{
  const oldCode = "old code";
  const learnerEdited = "function authorizeRequest(request, routeConfig) { return { status: 200 }; }";
  const ls = makeLocalStorage({
    'sec_sandbox_code_auth_bypass': oldCode,
    'sec_sandbox_code_auth_bypass_prevention': learnerEdited,
  });
  runWith(ls);
  assert.strictEqual(
    ls.getItem('sec_sandbox_code_auth_bypass_prevention'), learnerEdited,
    'learner-edited code on the new lesson must be preserved'
  );
  console.log('✓ Test 3: learner-edited new code preserved');
}

// Test 4: no legacy code at all -> migration never creates a code key for the new lesson.
{
  const ls = makeLocalStorage({ 'sec_course_completed_auth_bypass': 'true' });
  runWith(ls);
  assert.strictEqual(
    ls.getItem('sec_sandbox_code_auth_bypass_prevention'), null,
    'migration must not fabricate sandbox code for the new lesson'
  );
  console.log('✓ Test 4: no sandbox code fabricated');
}

console.log('🎉 ALL SECURITY LEGACY-MIGRATION TESTS PASSED!');
