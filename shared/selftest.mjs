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
  const startMarker = 'const LESSONS = [';
  const endMarker = '\n// Application state';
  const start = src.indexOf(startMarker) + 'const LESSONS = '.length;
  const end = src.indexOf(endMarker);
  if (start < 0 || end < 0) {
    throw new Error('Could not locate LESSONS array boundaries (missing "// Application state" marker?)');
  }
  const arrayText = src.slice(start, end).trim().replace(/;$/, '');
  return vm.runInContext(`(${arrayText})`, sandbox);
}

let totalPass = 0;
let totalFail = 0;
let totalLessons = 0;
const failures = [];

for (const track of TRACKS) {
  const filePath = path.join(ROOT, track, 'course.js');
  const src = fs.readFileSync(filePath, 'utf8');

  const sandbox = { console };
  if (track === 'DB-Design-SQL') {
    sandbox.alasql = require('alasql');
  }
  vm.createContext(sandbox);

  if (track === 'DB-Design-SQL') {
    // resetDatabase()/runQuery() live before the LESSONS array in this track's course.js
    const lines = src.split('\n');
    const helper = lines.slice(9, 40).join('\n');
    vm.runInContext(helper, sandbox);
  }

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
