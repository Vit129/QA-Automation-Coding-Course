// Tests for the Security+ MCQ exam mode: the pure logic (exam/mcq-logic.js) and the
// question bank (exam/security-plus-mcq.js). A wrong answer key is worse than no question,
// so the bank is checked structurally here and sample-checked by hand in review.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (rel) => fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');

const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(read('exam/mcq-logic.js'), sandbox);
vm.runInContext(read('exam/security-plus-mcq.js'), sandbox);

const L = sandbox.McqLogic;
const bank = sandbox.MCQ_BANKS['security-plus'].questions;

// Deterministic PRNG so sampling tests do not flake.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Values built inside the vm context have a different Object/Array prototype, which
// deepStrictEqual rejects, so structural comparisons go through JSON.
const same = (actual, expected, msg) => assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected), msg);

console.log('🧪 Running Security+ MCQ exam tests...');

// 1. The shipped bank is well-formed and covers every domain.
{
  const problems = L.validateBank(bank);
  assert.strictEqual(problems.length, 0, 'bank has structural problems:\n' + problems.join('\n'));
  assert.ok(bank.length >= 60, `expected at least 60 questions, got ${bank.length}`);
  for (const d of [1, 2, 3, 4, 5]) {
    const n = bank.filter((q) => q.domain === d).length;
    assert.ok(n >= 7, `domain ${d} has only ${n} questions`);
  }
  assert.ok(bank.some((q) => q.type === 'multi'), 'bank should include "choose N" questions');
  console.log(`✓ Test 1: bank is well-formed (${bank.length} questions, all 5 domains)`);
}

// 2. validateBank actually catches the mistakes it claims to.
{
  const good = { id: 'x1', domain: 2, objective: '2.1', type: 'single', stem: 'q', choices: ['a', 'b', 'c', 'd'], answer: [0], explanation: 'e' };
  const withAll = (extra) => [good, { ...good, id: 'x2', domain: 1, objective: '1.1' }, { ...good, id: 'x3', domain: 3, objective: '3.1' },
    { ...good, id: 'x4', domain: 4, objective: '4.1' }, { ...good, id: 'x5', domain: 5, objective: '5.1' }].concat(extra ? [extra] : []);
  assert.strictEqual(L.validateBank(withAll()).length, 0, 'control bank must be valid');

  const cases = [
    ['answer index out of range', { ...good, id: 'b1', answer: [4] }],
    ['duplicate id', { ...good, id: 'x1' }],
    ['single with two answers', { ...good, id: 'b3', answer: [0, 1] }],
    ['multi with one answer', { ...good, id: 'b4', type: 'multi', stem: 'เลือก 2 ข้อ', answer: [0] }],
    ['multi stem without count', { ...good, id: 'b5', type: 'multi', stem: 'pick some', answer: [0, 1] }],
    ['empty explanation', { ...good, id: 'b6', explanation: ' ' }],
    ['objective in wrong domain', { ...good, id: 'b7', objective: '4.2' }],
    ['duplicate choice text', { ...good, id: 'b8', choices: ['a', 'a', 'c', 'd'] }],
    ['too few choices', { ...good, id: 'b9', choices: ['a', 'b'], answer: [0] }],
  ];
  for (const [label, bad] of cases) {
    assert.ok(L.validateBank(withAll(bad)).length > 0, `validateBank should flag: ${label}`);
  }
  assert.ok(L.validateBank([good]).some((p) => p.includes('domain 1')), 'a bank missing a domain must be flagged');
  console.log('✓ Test 2: validateBank flags malformed questions');
}

// 3. Domain allocation follows the SY0-701 weights and respects caps.
{
  const plenty = { 1: 50, 2: 50, 3: 50, 4: 50, 5: 50 };
  const a90 = L.allocateByDomain(90, plenty);
  // 12/22/18/28/20 of 90 = 10.8 / 19.8 / 16.2 / 25.2 / 18.0 -> floors 10/19/16/25/18, the two
  // leftover seats go to the largest fractions (domains 1 and 2).
  same(a90, { 1: 11, 2: 20, 3: 16, 4: 25, 5: 18 });
  assert.strictEqual(Object.values(a90).reduce((s, n) => s + n, 0), 90, 'allocation must sum to the requested count');

  const a20 = L.allocateByDomain(20, plenty);
  assert.strictEqual(Object.values(a20).reduce((s, n) => s + n, 0), 20);

  // A domain with too few questions is capped and the shortfall moves to the others.
  const capped = L.allocateByDomain(20, { 1: 1, 2: 50, 3: 50, 4: 50, 5: 50 });
  assert.strictEqual(capped[1], 1);
  assert.strictEqual(Object.values(capped).reduce((s, n) => s + n, 0), 20, 'shortfall must be refilled');

  // Asking for more than the bank holds returns everything, never more.
  const tiny = { 1: 1, 2: 2, 3: 1, 4: 2, 5: 1 };
  const all = L.allocateByDomain(100, tiny);
  same(all, tiny);
  console.log('✓ Test 3: allocation is weighted, capped, and always sums correctly');
}

// 4. buildMcqExam draws unique questions with valid choice permutations.
{
  for (const count of [1, 10, 30, bank.length, bank.length + 25]) {
    const exam = L.buildMcqExam(bank, count, seeded(count));
    assert.strictEqual(exam.length, Math.min(count, bank.length), `count ${count}`);
    const ids = exam.map((e) => e.question.id);
    assert.strictEqual(new Set(ids).size, ids.length, 'a question must not appear twice');
    for (const e of exam) {
      const sorted = e.order.slice().sort((x, y) => x - y);
      same(sorted, e.question.choices.map((_, i) => i), 'order must be a permutation of the choices');
    }
  }
  // Same seed -> same exam; different seed -> different order (the shuffle really happens).
  const a = L.buildMcqExam(bank, 20, seeded(7)).map((e) => e.question.id).join(',');
  const b = L.buildMcqExam(bank, 20, seeded(7)).map((e) => e.question.id).join(',');
  const c = L.buildMcqExam(bank, 20, seeded(8)).map((e) => e.question.id).join(',');
  assert.strictEqual(a, b);
  assert.notStrictEqual(a, c);
  console.log('✓ Test 4: exams are unique, shuffled, and reproducible with a seed');
}

// 5. Grading is exact-set; no partial credit on "choose N".
{
  const single = { type: 'single', answer: [2] };
  assert.strictEqual(L.gradeMcq(single, [2]), true);
  assert.strictEqual(L.gradeMcq(single, [1]), false);
  assert.strictEqual(L.gradeMcq(single, []), false);
  assert.strictEqual(L.gradeMcq(single, undefined), false);

  const multi = { type: 'multi', answer: [0, 3] };
  assert.strictEqual(L.gradeMcq(multi, [3, 0]), true, 'order of selection must not matter');
  assert.strictEqual(L.gradeMcq(multi, [0]), false, 'one of two is wrong');
  assert.strictEqual(L.gradeMcq(multi, [0, 1, 3]), false, 'an extra choice is wrong');
  assert.strictEqual(L.gradeMcq(multi, [0, 1]), false);
  assert.strictEqual(L.gradeMcq(multi, [0, 0, 3]), true, 'duplicate clicks collapse to a set');
  console.log('✓ Test 5: grading is exact-set');
}

console.log('🎉 ALL SECURITY+ MCQ EXAM TESTS PASSED!');
