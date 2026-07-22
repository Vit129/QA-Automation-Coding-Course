#!/usr/bin/env node
// Regression test for the gameable-answer defenses in Data-Structures-Algorithms/course.js.
//
// shared/selftest.mjs already covers the generic invariant (solution passes, empty template
// fails) for all 22 lessons. This file goes further: it targets specific GAMEABLE wrong
// answers — plausible learner submissions that LOOK like a fix but skip the actual rule being
// taught — the same class of bug this repo has been bitten by before (commit 38bc980,
// "harden all 11 tracks against ... gameable validate()", and DB-Design-SQL's
// functional_dependency WHERE 1=0 case). Every case below must be rejected.
//
// Run: node Data-Structures-Algorithms/test-complexity-lessons.mjs

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sandbox = {
  console,
  document: { getElementById: () => null, addEventListener: () => {}, querySelector: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const src = fs.readFileSync(path.join(__dirname, 'course.js'), 'utf8');
vm.runInContext(src, sandbox);
const LESSONS = vm.runInContext('LESSONS', sandbox);

const lessonById = Object.fromEntries(LESSONS.map(l => [l.id, l]));

let pass = 0;
let fail = 0;
const failures = [];

function expectReject(lessonId, label, code) {
  const lesson = lessonById[lessonId];
  try {
    lesson.validate(code, () => {});
    fail++;
    failures.push(`${lessonId} :: ${label} — expected REJECT but validate() passed`);
  } catch (e) {
    pass++;
  }
}

function expectPass(lessonId, label, code) {
  const lesson = lessonById[lessonId];
  try {
    lesson.validate(code, () => {});
    pass++;
  } catch (e) {
    fail++;
    failures.push(`${lessonId} :: ${label} — expected PASS but validate() rejected: ${e.message}`);
  }
}

// --- queue_fifo: pop() instead of shift() gives LIFO (Stack behavior), must be rejected.
expectReject(
  'queue_fifo',
  'dequeue() uses pop() (LIFO) instead of shift() (FIFO)',
  `class JobQueue {
    constructor() { this.items = []; }
    enqueue(job) { this.items.push(job); }
    dequeue() { return this.items.pop(); }
    isEmpty() { return this.items.length === 0; }
  }`
);
expectPass('queue_fifo', 'real solution', lessonById.queue_fifo.solution);

// --- merge_sort_algorithm / quick_sort_algorithm / heap_sort_algorithm: calling
// Array.prototype.sort() instead of implementing the algorithm must be rejected.
expectReject(
  'merge_sort_algorithm',
  'cheats with .sort() instead of real merge sort',
  `function mergeSort(arr) { return [...arr].sort((a, b) => a - b); }`
);
expectPass('merge_sort_algorithm', 'real solution', lessonById.merge_sort_algorithm.solution);

expectReject(
  'quick_sort_algorithm',
  'cheats with .sort() instead of real quick sort',
  `function quickSort(arr) { return [...arr].sort((a, b) => a - b); }`
);
expectPass('quick_sort_algorithm', 'real solution', lessonById.quick_sort_algorithm.solution);

expectReject(
  'heap_sort_algorithm',
  'cheats with .sort() instead of real heap sort',
  `function heapSort(arr) { return [...arr].sort((a, b) => a - b); }`
);
expectPass('heap_sort_algorithm', 'real solution', lessonById.heap_sort_algorithm.solution);

// --- bst_insert_search: a fake BST backed by a plain sorted array (not the real
// { value, left, right } node structure) must be rejected by the structural assertions.
expectReject(
  'bst_insert_search',
  'fake BST backed by plain sorted array (no real node shape)',
  `class BST {
    constructor() { this.values = []; this.root = null; }
    insert(value) {
      this.values.push(value);
      this.values.sort((a, b) => a - b);
    }
    contains(value) { return this.values.includes(value); }
  }`
);
expectPass('bst_insert_search', 'real solution', lessonById.bst_insert_search.solution);

// --- memoization_basics: naive recursion with no cache is correct but must be rejected on
// the timing budget (n=42 without memoization takes seconds, not <500ms).
expectReject(
  'memoization_basics',
  'naive recursion with no memoization (correct but too slow)',
  `function countPossibleTestPaths(n) {
    if (n <= 1) return 1;
    return countPossibleTestPaths(n - 1) + countPossibleTestPaths(n - 2);
  }`
);
expectPass('memoization_basics', 'real solution', lessonById.memoization_basics.solution);

console.log(`complexity-lessons regression: ${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
