import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const autocompleteCode = fs.readFileSync(path.join(__dirname, 'editor-autocomplete.js'), 'utf8');

function createDOMEnvironment() {
  const elements = new Map();

  class MockElement {
    constructor(tagName, id = '') {
      this.tagName = tagName.toUpperCase();
      this.id = id;
      this.style = { display: 'none', cssText: '', left: '0px', top: '0px' };
      this.children = [];
      this.innerHTML = '';
      this.value = '';
      this.selectionStart = 0;
      this.selectionEnd = 0;
      this.classList = {
        add: () => {},
        remove: () => {},
      };
      this.listeners = {};
    }

    closest(selector) {
      if (selector === '.editor-container') {
        return containerElement;
      }
      return null;
    }

    appendChild(child) {
      this.children.push(child);
      if (child.id) elements.set(child.id, child);
      return child;
    }

    remove() {
      if (this.id) elements.delete(this.id);
    }

    focus() {}

    addEventListener(event, handler) {
      this.listeners[event] = handler;
    }
  }

  const containerElement = new MockElement('div');
  containerElement.classList.add('editor-container');

  const textareaElement = new MockElement('textarea', 'editor-textarea');
  textareaElement.offsetLeft = 0;
  textareaElement.offsetTop = 0;
  textareaElement.scrollLeft = 0;
  textareaElement.scrollTop = 0;

  containerElement.appendChild(textareaElement);

  const documentMock = {
    getElementById: (id) => elements.get(id) || (id === 'editor-textarea' ? textareaElement : null),
    createElement: (tagName) => new MockElement(tagName),
    body: new MockElement('body'),
  };

  const windowMock = {
    getComputedStyle: () => ({
      paddingLeft: '10px',
      paddingTop: '10px',
      fontSize: '14px',
      lineHeight: '22px',
      fontFamily: 'monospace',
    }),
  };

  const sandbox = {
    console,
    document: documentMock,
    window: windowMock,
    getComputedStyle: windowMock.getComputedStyle,
    escapeHtml: (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    updateGutter: () => {},
  };

  vm.createContext(sandbox);
  vm.runInContext(autocompleteCode, sandbox);

  return { sandbox, textarea: textareaElement };
}

console.log('🧪 Running TDD tests for Editor Autocomplete Keyboard Navigation & Built-in Dictionary...');

// Test 1: Basic autocomplete populates matches
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = 'const response = true;\nconst result = 123;\nres';
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

  sandbox.updateEditorAutocomplete();

  const matches = [...sandbox.editorAutocompleteMatches];
  assert.strictEqual(matches.includes('response'), true);
  assert.strictEqual(matches.includes('result'), true);
  assert.strictEqual(sandbox.editorAutocompleteIndex, 0, 'Initial selected index should be 0');
  console.log('✓ Test 1 Passed: Basic autocomplete populates matches and resets index to 0');
}

// Test 2: ArrowDown navigation wraps around
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = 'const response = true;\nconst result = 123;\nconst resource = "api";\nres';
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

  sandbox.updateEditorAutocomplete();
  assert.strictEqual(sandbox.editorAutocompleteIndex, 0);

  // Press ArrowDown
  const event1 = { key: 'ArrowDown', preventDefault: () => {} };
  const handled1 = sandbox.handleEditorAutocompleteKeydown(event1);
  assert.strictEqual(handled1, true, 'ArrowDown should be handled by autocomplete');
  assert.strictEqual(sandbox.editorAutocompleteIndex, 1, 'ArrowDown should move index to 1');

  // Press ArrowDown again
  const event2 = { key: 'ArrowDown', preventDefault: () => {} };
  sandbox.handleEditorAutocompleteKeydown(event2);
  assert.strictEqual(sandbox.editorAutocompleteIndex, 2, 'ArrowDown should move index to 2');

  console.log('✓ Test 2 Passed: ArrowDown navigates correctly');
}

// Test 3: ArrowUp navigation wraps around backwards
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = 'const response = true;\nconst result = 123;\nconst resource = "api";\nres';
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

  sandbox.updateEditorAutocomplete();
  assert.strictEqual(sandbox.editorAutocompleteIndex, 0);

  // Press ArrowUp from 0 -> should wrap around to last index
  const event1 = { key: 'ArrowUp', preventDefault: () => {} };
  const handled1 = sandbox.handleEditorAutocompleteKeydown(event1);
  assert.strictEqual(handled1, true);
  assert.strictEqual(sandbox.editorAutocompleteIndex > 0, true, 'ArrowUp from 0 should wrap around to end');

  console.log('✓ Test 3 Passed: ArrowUp navigates backwards and wraps around correctly');
}

// Test 4: Enter key accepts currently highlighted suggestion
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = 'const response = true;\nconst result = 123;\nres';
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

  sandbox.updateEditorAutocomplete();

  // Navigate to second suggestion
  sandbox.handleEditorAutocompleteKeydown({ key: 'ArrowDown', preventDefault: () => {} });

  const chosenWord = sandbox.editorAutocompleteMatches[1];

  let prevented = false;
  const eventEnter = { key: 'Enter', preventDefault: () => { prevented = true; } };
  const handled = sandbox.handleEditorAutocompleteKeydown(eventEnter);

  assert.strictEqual(handled, true);
  assert.strictEqual(prevented, true);
  assert.strictEqual(textarea.value, `const response = true;\nconst result = 123;\n${chosenWord}`);
  console.log('✓ Test 4 Passed: Enter key accepts highlighted suggestion');
}

// Test 5: Escape key closes autocomplete
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = 'const response = true;\nres';
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

  sandbox.updateEditorAutocomplete();
  const el = sandbox.document.getElementById('editor-autocomplete');
  assert.strictEqual(el.style.display, 'block');

  const eventEsc = { key: 'Escape', preventDefault: () => {} };
  const handled = sandbox.handleEditorAutocompleteKeydown(eventEsc);

  assert.strictEqual(handled, true);
  assert.strictEqual(el.style.display, 'none');
  console.log('✓ Test 5 Passed: Escape key closes autocomplete dropdown');
}

// Test 6: Built-in dictionary suggests domain keywords (Playwright/RF/SQL/DSA/API)
{
  const { sandbox, textarea } = createDOMEnvironment();
  textarea.value = 'const res = await request.get();\nsta';
  textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

  sandbox.updateEditorAutocomplete();

  const matches = [...sandbox.editorAutocompleteMatches];
  assert.strictEqual(matches.includes('status'), true, 'Typing "sta" should suggest "status" from built-in dictionary');
  console.log('✓ Test 6 Passed: Built-in dictionary suggests domain keywords (status, toBe, etc.)');
}

console.log('\n🎉 ALL AUTCOMPLETE TDD TESTS PASSED!');
