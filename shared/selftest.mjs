#!/usr/bin/env node
// Self-test harness for every lesson in every track.
//
// Invariant checked per lesson: lesson.validate(lesson.solution, ...) must NOT throw,
// and lesson.validate(lesson.template, ...) MUST throw (the unfilled "WRITE YOUR CODE
// HERE" placeholder should never pass). This is the only thing guarding against silent
// drift between a lesson's solution/template text and its validate() regex.
//
// Run: npm test  (or: node shared/selftest.mjs)
// Requires: npm install (pulls in alasql, used only by DB-Design-SQL's real SQL execution)

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const TRACKS = [
  'API-Testing',
  'Playwright',
  'Robot-Framework',
  'Performance-Testing',
  'DB-Design-SQL',
  'CLI-Essentials',
  'Security-Testing',
  'Accessibility-Testing',
  'Visual-Regression-Testing',
  'CI-CD-Pipeline',
  'Framework-Design',
];

function extractLessons(src, sandbox) {
  // Run the WHOLE file in the sandbox (not just a slice of the LESSONS array literal) so that
  // any top-level helper function a lesson's validate() closes over (e.g. stripComments(),
  // rfLineMatch(), execLearnerCode(), resetDatabase()/runQuery()) is actually in scope — this
  // matches how the file really runs in the browser (course.js loaded as one <script>, engine.js
  // referencing its top-level bindings afterward in the same global scope).
  vm.runInContext(src, sandbox);
  return vm.runInContext('LESSONS', sandbox);
}

let totalPass = 0;
let totalFail = 0;
let totalLessons = 0;
const failures = [];

for (const track of TRACKS) {
  const filePath = path.join(ROOT, track, 'course.js');
  const src = fs.readFileSync(filePath, 'utf8');

  const sandbox = {
    console,
    document: { getElementById: () => null, addEventListener: () => {}, querySelector: () => null },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  };
  sandbox.window = sandbox;
  if (track === 'DB-Design-SQL') {
    sandbox.alasql = require('alasql');
  }
  vm.createContext(sandbox);

  const lessons = extractLessons(src, sandbox);
  let pass = 0;
  let fail = 0;

  for (const lesson of lessons) {
    try {
      lesson.validate(lesson.solution, () => {});
      pass++;
    } catch (e) {
      fail++;
      failures.push(`${track} :: ${lesson.id} — SOLUTION FAILED: ${e.message}`);
    }
    try {
      lesson.validate(lesson.template, () => {});
      fail++;
      failures.push(`${track} :: ${lesson.id} — TEMPLATE SHOULD HAVE THROWN BUT DIDN'T`);
    } catch (e) {
      pass++;
    }
  }

  console.log(`${track}: ${lessons.length} lessons, ${pass} checks passed, ${fail} failed`);
  totalPass += pass;
  totalFail += fail;
  totalLessons += lessons.length;
}

console.log(`\nTOTAL: ${totalLessons} lessons, ${totalPass} passed, ${totalFail} failed`);

if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
