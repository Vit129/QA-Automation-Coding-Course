// Integration test: simulates exam/index.html's real script load order
// (engine.js -> editor-autocomplete.js -> editor-enhancements.js -> editor-highlight.js
// -> exam-engine.js) against a minimal DOM mock matching the exam page's actual markup,
// to confirm the editor conveniences added to the exam page (auto-close pairs, tab-indent,
// dedent-on-close, comment-toggle, syntax highlight, autocomplete) wire up without any
// ReferenceError from engine.js's LESSONS-dependent code never running.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

class MockElement {
  constructor(tagName, id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.style = { display: 'none', cssText: '' };
    this.classList = { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} };
    this.children = [];
    this.value = '';
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.listeners = {};
    this._innerHTML = '';
    this.max = '';
  }
  set innerHTML(v) { this._innerHTML = v; }
  get innerHTML() { return this._innerHTML; }
  querySelector(sel) {
    if (sel === 'code') return (this._codeChild ||= new MockElement('code'));
    return null;
  }
  querySelectorAll() { return []; }
  appendChild(child) { this.children.push(child); if (child.id) elements.set(child.id, child); return child; }
  insertBefore(child) { this.children.push(child); if (child.id) elements.set(child.id, child); return child; }
  closest(sel) { return sel === '.editor-container' ? elements.get('editor-container') : null; }
  addEventListener(event, handler) { (this.listeners[event] ||= []).push(handler); }
  dispatchEvent(event) { (this.listeners[event.type] || []).forEach((h) => h(event)); }
}

const elements = new Map();
['editor-textarea', 'editor-gutter', 'editor-container', 'start-exam-btn', 'question-count',
 'time-limit', 'track-checklist', 'exam-question-badge', 'exam-question-title', 'exam-question-task',
 'exam-progress-label', 'exam-prev-btn', 'exam-next-btn', 'exam-question-nav'].forEach((id) => {
  const tag = id === 'editor-textarea' ? 'textarea' : (id.includes('input') || id === 'question-count' || id === 'time-limit' ? 'input' : 'div');
  elements.set(id, new MockElement(tag, id));
});

const documentMock = {
  getElementById: (id) => elements.get(id) || null,
  createElement: (tagName) => new MockElement(tagName),
  querySelectorAll: () => [],
  body: new MockElement('body'),
  addEventListener: () => {},
};

function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const loadListeners = [];
const windowMock = {
  document: documentMock,
  addEventListener: (evt, fn) => { if (evt === 'load') loadListeners.push(fn); },
  QA_TRACKS: {
    demo: { id: 'demo', title: 'Demo Track', lessons: [
      { id: 'l1', meta: 'Demo', title: 'Demo Lesson', task: 'do the thing',
        template: 'const x = 1;', solution: 'const x = 2;',
        validate: (code) => { if (!/x = 2/.test(code)) throw new Error('nope'); } },
    ] } },
};

const sandbox = { console, document: documentMock, window: windowMock, escapeHtml, alert: () => {}, confirm: () => true };
vm.createContext(sandbox);

// Real script load order from exam/index.html
sandbox.window.TAB_WIDTH = 2; // <script>window.TAB_WIDTH = 2;</script>
vm.runInContext(read('engine.js'), sandbox);
vm.runInContext(read('editor-autocomplete.js'), sandbox);
vm.runInContext(read('editor-enhancements.js'), sandbox);
vm.runInContext(read('editor-highlight.js'), sandbox);
vm.runInContext(read('exam-engine.js'), sandbox);

console.log('🧪 Running exam-page editor wiring integration test...');

// Fire every queued 'load' listener, exactly like the real page's single 'load' event does.
// This must NOT throw - proves engine.js's LESSONS-dependent code (initApp) never runs here.
assert.doesNotThrow(() => loadListeners.forEach((fn) => fn()));
console.log('✓ Test 1 Passed: all load listeners fire without ReferenceError (initApp never touches undefined LESSONS)');

// initExamPage() (exam-engine.js's own window.onload target) wires up the textarea directly - call it.
sandbox.initExamPage();
const textarea = elements.get('editor-textarea');
assert.ok(textarea.listeners.keydown && textarea.listeners.keydown.length > 0, 'keydown listener should be attached');
console.log('✓ Test 2 Passed: initExamPage() attaches the shared keydown handler to #editor-textarea');

// Auto-close pair: typing '(' should insert '()' (engine.js's handleTextareaKeydown, reused as-is)
textarea.value = '';
textarea.selectionStart = textarea.selectionEnd = 0;
textarea.dispatchEvent({ type: 'keydown', key: '(', target: textarea, preventDefault: () => {} });
assert.strictEqual(textarea.value, '()');
console.log('✓ Test 3 Passed: auto-close-pair works on the exam textarea');

// Cmd+/ comment toggle (editor-enhancements.js's own separate listener, already registered
// once in Test 1 - real browsers only ever fire 'load' once, so don't re-fire it here).
textarea.value = 'const a = 1;';
textarea.selectionStart = textarea.selectionEnd = 5;
textarea.dispatchEvent({ type: 'keydown', key: '/', metaKey: true, target: textarea, preventDefault: () => {} });
assert.strictEqual(textarea.value, '// const a = 1;');
console.log('✓ Test 4 Passed: Cmd+/ comment toggle works on the exam textarea');

// renderQuestion() must not throw (no LESSONS global needed - reads window.QA_TRACKS) and
// must refresh the syntax-highlight overlay per the editor-highlight.js wrap of renderQuestion.
// EXAM_STATE is a top-level const in exam-engine.js - vm.runInContext doesn't expose
// const/let bindings on the context object, so mutate it via more code run in-context.
vm.runInContext(
  "EXAM_STATE.questions = [{ trackId: 'demo', trackTitle: 'Demo Track', lesson: window.QA_TRACKS.demo.lessons[0] }];",
  sandbox
);
assert.strictEqual(typeof sandbox.renderQuestion, 'function');
assert.doesNotThrow(() => sandbox.renderQuestion(0));
assert.strictEqual(textarea.value, 'const x = 1;');
const overlay = elements.get('editor-container').children.find((c) => c.id === 'editor-highlight-layer');
assert.ok(overlay, 'syntax-highlight overlay should have been created');
assert.ok(overlay.querySelector('code').innerHTML.includes('const'), 'overlay should reflect the new question template');
console.log('✓ Test 5 Passed: renderQuestion() swaps the answer and refreshes the syntax-highlight overlay');

console.log('\n🎉 ALL EXAM EDITOR WIRING TESTS PASSED!');
