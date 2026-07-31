// Integration test: engine.js + editor-highlight.js loaded together, in real script
// order, to prove the syntax-highlight overlay doesn't go stale after JS-driven
// textarea.value mutations that skip the native 'input' event (auto-close-pair
// insert, accept-autocomplete, tab-indent) - the exact bug a live user hit after
// editor-highlight.js shipped (overlay stale + real text made transparent = looked
// like those features stopped working entirely).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engineCode = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');
const highlightCode = fs.readFileSync(path.join(__dirname, 'editor-highlight.js'), 'utf8');

function createDOMEnvironment() {
  const elements = new Map();

  class MockElement {
    constructor(tagName, id = '') {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      this.style = { display: 'none', cssText: '' };
      this.classList = { add: () => {}, contains: () => false };
      this.children = [];
      this.value = '';
      this.selectionStart = 0;
      this.selectionEnd = 0;
      this.listeners = {};
      this._innerHTML = '';
    }

    set innerHTML(v) { this._innerHTML = v; }
    get innerHTML() { return this._innerHTML; }

    querySelector(sel) {
      if (sel === 'code' && !this._codeChild) {
        this._codeChild = new MockElement('code');
      }
      return this._codeChild || null;
    }

    appendChild(child) {
      this.children.push(child);
      if (child.id) elements.set(child.id, child);
      return child;
    }

    insertBefore(child) {
      this.children.push(child);
      if (child.id) elements.set(child.id, child);
      return child;
    }

    closest(sel) {
      return sel === '.editor-container' ? containerElement : null;
    }

    addEventListener(event, handler) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(handler);
    }

    dispatchEvent(event) {
      (this.listeners[event.type] || []).forEach((h) => h(event));
    }
  }

  const textareaElement = new MockElement('textarea', 'editor-textarea');
  const gutterElement = new MockElement('div', 'editor-gutter');
  const containerElement = new MockElement('div', 'editor-container');
  elements.set('editor-textarea', textareaElement);
  elements.set('editor-gutter', gutterElement);
  elements.set('editor-container', containerElement);

  const documentMock = {
    getElementById: (id) => elements.get(id) || null,
    createElement: (tagName) => new MockElement(tagName),
    body: new MockElement('body'),
    addEventListener: () => {},
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const sandbox = {
    console,
    document: documentMock,
    window: { document: documentMock, addEventListener: () => {} },
    TAB_WIDTH: 2,
    BUILTIN_KEYWORDS: [],
    escapeHtml,
    updateEditorAutocomplete: () => {},
    hideEditorAutocomplete: () => {},
    acceptEditorAutocomplete: () => false,
  };

  vm.createContext(sandbox);
  vm.runInContext(engineCode, sandbox);   // 1st: real listeners, unmodified engine.js
  vm.runInContext(highlightCode, sandbox); // 2nd: real editor-highlight.js, as shipped

  // Both files gate their real textarea-listener setup behind window 'load' in the
  // browser. initApp() also renders the lesson list/progress bar, which needs a full
  // LESSONS/localStorage environment this test doesn't set up - so just replicate the
  // one line of initApp that matters here (attaching the real keydown handler).
  textareaElement.addEventListener('keydown', sandbox.handleTextareaKeydown);
  sandbox.initEditorHighlight();

  return { sandbox, textarea: textareaElement };
}

console.log('🧪 Running integration test: overlay stays in sync after JS-driven mutations...');

// Test 1: auto-close-pair insert (types '(' -> engine.js sets .value directly, no
// native 'input' event) must still refresh the overlay via the keydown listener.
{
  const { textarea } = createDOMEnvironment();
  textarea.value = '';
  textarea.selectionStart = textarea.selectionEnd = 0;

  const event = { key: '(', target: textarea, preventDefault: () => {}, defaultPrevented: false };
  textarea.dispatchEvent({ type: 'keydown', ...event });

  assert.strictEqual(textarea.value, '()');
  const layerHtml = textarea.closest('.editor-container').children
    .find((c) => c.id === 'editor-highlight-layer')
    .querySelector('code').innerHTML;
  assert.ok(layerHtml.includes('()'), `overlay should reflect the auto-inserted pair, got: ${layerHtml}`);
  console.log("✓ Test 1 Passed: overlay refreshes after auto-close-pair insert '()'");
}

// Test 2: smart-enter inside {} (engine.js sets .value directly) must refresh overlay
{
  const { textarea } = createDOMEnvironment();
  textarea.value = 'function test() {}';
  textarea.selectionStart = textarea.selectionEnd = 17;

  const event = { key: 'Enter', target: textarea, preventDefault: () => {}, defaultPrevented: false };
  textarea.dispatchEvent({ type: 'keydown', ...event });

  assert.strictEqual(textarea.value, 'function test() {\n  \n}');
  const layerHtml = textarea.closest('.editor-container').children
    .find((c) => c.id === 'editor-highlight-layer')
    .querySelector('code').innerHTML;
  assert.ok(layerHtml.includes('function test() {'), `overlay should reflect the expanded block, got: ${layerHtml}`);
  console.log('✓ Test 2 Passed: overlay refreshes after smart-enter block expansion');
}

console.log('\n🎉 ALL OVERLAY-SYNC INTEGRATION TESTS PASSED!');
