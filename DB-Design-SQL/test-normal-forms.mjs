#!/usr/bin/env node
// Regression test for the 5 Normal Form lessons (functional_dependency, normal_form_1nf/2nf/3nf/bcnf)
// added to DB-Design-SQL/course.js.
//
// shared/selftest.mjs already covers the generic invariant (solution passes, empty template
// fails) for every lesson in every track, including these. This file goes further: it targets
// GAMEABLE wrong answers specifically — the class of bug this repo has been bitten by before
// (commit 38bc980, "harden all 11 tracks against ... gameable validate()"). Each case below is
// an answer a learner might plausibly submit that LOOKS like a fix but skips the actual rule,
// and every one of them must be rejected.
//
// Run: node DB-Design-SQL/test-normal-forms.mjs

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sandbox = {
  console,
  document: { getElementById: () => null, addEventListener: () => {}, querySelector: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  alasql: require('alasql'),
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

// expectReject: code SHOULD make validate() throw. expectPass: code SHOULD NOT throw.
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

// --- functional_dependency: a hardcoded/unconditional filter that just happens to return
// 0 rows on the clean seed data, without actually computing anything, must be rejected.
expectReject(
  'functional_dependency',
  'gameable WHERE 1=0 (always empty, no real GROUP BY/HAVING logic)',
  `SELECT testerEmail, 0 AS nameCount FROM test_runs_flat WHERE 1 = 0;`
);
expectPass(
  'functional_dependency',
  'real solution',
  lessonById.functional_dependency.solution
);

// --- normal_form_1nf: creating the right-shaped table but leaving a value still comma-joined
// (i.e. not actually splitting it into atomic rows) must be rejected.
expectReject(
  'normal_form_1nf',
  'contact_numbers created but AMZN phone still comma-joined (not atomic)',
  `CREATE TABLE contact_numbers (ticker STRING, phone STRING);
   INSERT INTO contact_numbers (ticker, phone) VALUES
     ('AMZN', '02-111-1111,02-222-2222'),
     ('GOOGL', '02-333-3333');`
);
expectPass(
  'normal_form_1nf',
  'real solution',
  lessonById.normal_form_1nf.solution
);

// --- normal_form_2nf / 3nf / bcnf: creating the right tables with correct data but WITHOUT
// the FOREIGN KEY constraint (so a bogus reference silently succeeds) must be rejected — the
// whole point of these lessons is enforcing the FK, not just having the right column names.
expectReject(
  'normal_form_2nf',
  'order_items created without FOREIGN KEY (bogus ticker not blocked)',
  `CREATE TABLE tickers_catalog (ticker STRING PRIMARY KEY, productName STRING);
   CREATE TABLE order_items (orderId NUMBER, ticker STRING, quantity NUMBER, PRIMARY KEY (orderId, ticker));
   INSERT INTO tickers_catalog VALUES ('AMZN', 'Amazon.com Inc');
   INSERT INTO order_items VALUES (1, 'AMZN', 50);`
);
expectPass(
  'normal_form_2nf',
  'real solution',
  lessonById.normal_form_2nf.solution
);

expectReject(
  'normal_form_3nf',
  'holdings_normalized created without FOREIGN KEY (bogus broker not blocked)',
  `CREATE TABLE brokers_lookup (broker STRING PRIMARY KEY, country STRING);
   CREATE TABLE holdings_normalized (ticker STRING PRIMARY KEY, broker STRING);
   INSERT INTO brokers_lookup VALUES ('Webull', 'US');
   INSERT INTO holdings_normalized VALUES ('AMZN', 'Webull');`
);
expectPass(
  'normal_form_3nf',
  'real solution',
  lessonById.normal_form_3nf.solution
);

expectReject(
  'normal_form_bcnf',
  'test_case_reviews created without FOREIGN KEY (bogus reviewer not blocked)',
  `CREATE TABLE reviewers (reviewer STRING PRIMARY KEY, team STRING);
   CREATE TABLE test_case_reviews (testCase STRING, reviewer STRING, PRIMARY KEY (testCase, reviewer));
   INSERT INTO reviewers VALUES ('Nueng', 'QA-Web');
   INSERT INTO test_case_reviews VALUES ('TC-001', 'Nueng');`
);
expectPass(
  'normal_form_bcnf',
  'real solution',
  lessonById.normal_form_bcnf.solution
);

console.log(`normal-forms regression: ${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
