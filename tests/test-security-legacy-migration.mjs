// Regression test for Security-Testing's migrateLegacyProgress().
//
// Bug it guards: returning learners saw stale pre-v0.14.0 starter code (e.g. the old
// `/api/ai/recommend` auth test) on lessons whose task was completely rewritten
// ("ยังเป็นตัวเก่า"). The stale code lives in the browser's localStorage under the NEW
// lesson id — carried from the old lesson or copied by an earlier migration. A first fix
// that only cleared byte-identical copies missed the common case where the OLD key is no
// longer present. The current fix does a one-time unconditional reset of saved sandbox
// code on every remapped lesson (completion flags are kept), guarded by a flag so later
// edits persist.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const courseCode = fs.readFileSync(path.join(__dirname, '../Security-Testing/course.js'), 'utf8');

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

const STALE = "// old /api/ai/recommend lesson\nconst r = await request.post('/api/ai/recommend');";

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

// Test 2 (the real bug): stale code under the new id with the OLD key ABSENT is cleared.
{
  const ls = makeLocalStorage({ 'sec_sandbox_code_auth_bypass_prevention': STALE });
  runWith(ls);
  assert.strictEqual(
    ls.getItem('sec_sandbox_code_auth_bypass_prevention'), null,
    'stale code must be cleared even when the legacy key no longer exists'
  );
  console.log('✓ Test 2: stale code cleared when old key is absent');
}

// Test 3: the reset is one-time — code edited AFTER the reset (next load) persists.
{
  const ls = makeLocalStorage({ 'sec_sandbox_code_sqli_union_blind': STALE });
  runWith(ls);                       // first load: clears stale, sets the flag
  assert.strictEqual(ls.getItem('sec_sandbox_code_sqli_union_blind'), null, 'first load clears stale');
  const fresh = 'function detectSqli(){ /* learner new work */ }';
  ls.setItem('sec_sandbox_code_sqli_union_blind', fresh);
  runWith(ls);                       // second load: flag set, must NOT wipe new work
  assert.strictEqual(
    ls.getItem('sec_sandbox_code_sqli_union_blind'), fresh,
    'reset must run only once; edits made after it must persist'
  );
  console.log('✓ Test 3: reset is one-time, later edits persist');
}

// Test 4: a NON-remapped lesson's saved code is never touched.
{
  const mine = 'function verifyZeroTrustAccess(){ return { allow: true }; }';
  const ls = makeLocalStorage({ 'sec_sandbox_code_cvss_cve_scoring': mine });
  runWith(ls);
  assert.strictEqual(
    ls.getItem('sec_sandbox_code_cvss_cve_scoring'), mine,
    'lessons that were not remapped must keep their saved code'
  );
  console.log('✓ Test 4: non-remapped lessons untouched');
}

console.log('🎉 ALL SECURITY LEGACY-MIGRATION TESTS PASSED!');
