import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const code = fs.readFileSync(path.join(__dirname, 'editor-enhancements.js'), 'utf8');

function createTextarea(value, selectionStart, selectionEnd = selectionStart) {
  return { value, selectionStart, selectionEnd, classList: { add: () => {} } };
}

function loadSandbox(extra = {}) {
  const sandbox = {
    console,
    module: { exports: {} },
    TAB_WIDTH: 2,
    updateGutter: () => {},
    updateEditorAutocomplete: () => {},
    ...extra,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

console.log('🧪 Running TDD tests for Editor Enhancements (dedent + comment toggle)...');

// Test 1: typing '}' on a blank indented line dedents to match the opening line's indent
{
  const sandbox = loadSandbox();
  const textarea = createTextarea('function test() {\n    \n}', 22, 22); // caret after 4 spaces on inner line
  sandbox.handleAutoDedentOnClose(textarea, '}');
  assert.strictEqual(textarea.value, 'function test() {\n\n}');
  assert.strictEqual(textarea.selectionStart, 18);
  console.log("✓ Test 1 Passed: typing '}' dedents to match opening line indent");
}

// Test 2: toggling comment on an uncommented JS line adds '// '
{
  const sandbox = loadSandbox();
  const textarea = createTextarea("const a = 1;\nconst b = 2; // already\n", 5, 5);
  sandbox.toggleEditorLineComment(textarea);
  assert.strictEqual(textarea.value.split('\n')[0], '// const a = 1;');
  console.log("✓ Test 2 Passed: toggle comment adds '// ' prefix, marker detected from existing '//'");
}

// Test 3: toggling comment on an already-commented line removes the marker
{
  const sandbox = loadSandbox();
  const textarea = createTextarea('// const a = 1;\n// const b = 2;', 5, 5);
  sandbox.toggleEditorLineComment(textarea);
  assert.strictEqual(textarea.value.split('\n')[0], 'const a = 1;');
  console.log('✓ Test 3 Passed: toggle comment on a commented line removes the marker');
}

// Test 4: SQL file (marker '--') toggles with '--' not '//'
{
  const sandbox = loadSandbox();
  const textarea = createTextarea('-- existing comment\nCREATE TABLE t (id INT);', 25, 25);
  sandbox.toggleEditorLineComment(textarea);
  assert.strictEqual(textarea.value.split('\n')[1], '-- CREATE TABLE t (id INT);');
  console.log("✓ Test 4 Passed: SQL file detects '--' as the comment marker, not '//'");
}

// Test 5: dedent does nothing when the line isn't blank/whitespace-only before the caret
{
  const sandbox = loadSandbox();
  const original = 'const x = {a: 1}';
  const textarea = createTextarea(original, original.length, original.length);
  sandbox.handleAutoDedentOnClose(textarea, '}');
  assert.strictEqual(textarea.value, original);
  console.log('✓ Test 5 Passed: no dedent when caret line already has content');
}

console.log('\n🎉 ALL EDITOR ENHANCEMENTS TESTS PASSED!');
