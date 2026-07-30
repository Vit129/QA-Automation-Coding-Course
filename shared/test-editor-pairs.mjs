import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engineCode = fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8');

function createDOMEnvironment() {
  const elements = new Map();

  class MockElement {
    constructor(tagName, id = '') {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      this.style = { display: 'none', cssText: '' };
      this.children = [];
      this.value = '';
      this.selectionStart = 0;
      this.selectionEnd = 0;
      this.listeners = {};
    }

    appendChild(child) {
      this.children.push(child);
      if (child.id) elements.set(child.id, child);
      return child;
    }

    addEventListener(event, handler) {
      this.listeners[event] = handler;
    }
  }

  const textareaElement = new MockElement('textarea', 'editor-textarea');
  const gutterElement = new MockElement('div', 'editor-gutter');
  elements.set('editor-textarea', textareaElement);
  elements.set('editor-gutter', gutterElement);

  const documentMock = {
    getElementById: (id) => elements.get(id) || null,
    createElement: (tagName) => new MockElement(tagName),
    body: new MockElement('body'),
    addEventListener: () => {},
  };

  const sandbox = {
    console,
    document: documentMock,
    window: { document: documentMock },
    TAB_WIDTH: 2,
    updateEditorAutocomplete: () => {},
    hideEditorAutocomplete: () => {},
    acceptEditorAutocomplete: () => false,
  };

  vm.createContext(sandbox);
  vm.runInContext(engineCode, sandbox);

  return { sandbox, textarea: textareaElement };
}

console.log('🧪 Running TDD tests for Pair Deletion & Smart Enter Indentation...');

// Test 1: Backspace between quote pair deletes both characters
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = "const s = '';";
  textarea.selectionStart = textarea.selectionEnd = 11; // between ''

  const event = { key: 'Backspace', target: textarea, preventDefault: () => {} };
  sandbox.handleTextareaKeydown(event);

  assert.strictEqual(textarea.value, "const s = ;");
  assert.strictEqual(textarea.selectionStart, 10);
  console.log('✓ Test 1 Passed: Backspace deletes both matching quotes');
}

// Test 2: Backspace between parentheses deletes both characters
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = "func()";
  textarea.selectionStart = textarea.selectionEnd = 5; // between ()

  const event = { key: 'Backspace', target: textarea, preventDefault: () => {} };
  sandbox.handleTextareaKeydown(event);

  assert.strictEqual(textarea.value, "func");
  assert.strictEqual(textarea.selectionStart, 4);
  console.log('✓ Test 2 Passed: Backspace deletes matching parentheses ()');
}

// Test 3: Smart Enter inside {} formats inner line with indentation
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = "function test() {}";
  textarea.selectionStart = textarea.selectionEnd = 17; // between {}

  const event = { key: 'Enter', target: textarea, preventDefault: () => {} };
  sandbox.handleTextareaKeydown(event);

  assert.strictEqual(textarea.value, "function test() {\n  \n}");
  assert.strictEqual(textarea.selectionStart, 20); // at inner line position
  console.log('✓ Test 3 Passed: Smart Enter inside {} expands line with indentation');
}

// Test 4: Enter maintains base line indentation
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = "  const a = 1;";
  textarea.selectionStart = textarea.selectionEnd = 14;

  const event = { key: 'Enter', target: textarea, preventDefault: () => {} };
  sandbox.handleTextareaKeydown(event);

  assert.strictEqual(textarea.value, "  const a = 1;\n  ");
  assert.strictEqual(textarea.selectionStart, 17);
  console.log('✓ Test 4 Passed: Enter maintains base line indentation');
}

console.log('\n🎉 ALL PAIR DELETION & SMART ENTER TESTS PASSED!');
