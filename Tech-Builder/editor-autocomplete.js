// Word-based autocomplete for the code sandbox editor (shared across all course tracks).
// Depends on shared/engine.js's updateGutter() and escapeHtml() being loaded in the same page.
// Load this file before or after engine.js - both attach to the same global scope, no explicit
// import needed (same pattern course.js/engine.js already use for PREFIX/TAB_WIDTH/LESSONS etc).

const EDITOR_WORD_REGEX = /[A-Za-z_$][A-Za-z0-9_$]*/g;
const EDITOR_WORD_MIN_LEN = 2;
var editorAutocompleteMatches = [];
var editorAutocompleteIndex = 0;

// Built-in domain keyword dictionary spanning all 12 course tracks:
// API-Testing, Playwright, Robot-Framework, Performance-Testing, DB-Design-SQL,
// CLI-Essentials, Security-Testing, Accessibility-Testing, Visual-Regression-Testing,
// CI-CD-Pipeline, Framework-Design, Data-Structures-Algorithms.
const BUILTIN_KEYWORDS = [
  // Playwright & API Methods
  'request', 'get', 'post', 'put', 'delete', 'patch', 'status', 'json', 'text', 'headers',
  'extraHTTPHeaders', 'newContext', 'dispose', 'page', 'goto', 'locator', 'getByRole',
  'getByText', 'getByTestId', 'getByPlaceholder', 'getByLabel', 'getByTitle', 'getByAltText',
  'click', 'fill', 'type', 'press', 'check', 'uncheck', 'selectOption', 'waitForSelector',
  'waitForURL', 'waitForLoadState', 'screenshot', 'pdf',

  // Assertions & Matchers
  'expect', 'toBe', 'toEqual', 'toContain', 'toHaveProperty', 'toHaveLength', 'toBeOK',
  'toBeVisible', 'toHaveText', 'toContainText', 'toHaveValue', 'toBeChecked', 'toBeDisabled',
  'toBeEnabled', 'toHaveURL', 'toHaveTitle', 'toHaveCount', 'toHaveScreenshot', 'toBeDefined',
  'toBeUndefined', 'toBeTruthy', 'toBeFalsy',

  // Robot Framework Keywords
  'Library', 'Browser', 'AppiumLibrary', 'SeleniumLibrary', 'Keywords', 'Variables',
  'New Page', 'Click', 'Fill Text', 'Get Text', 'Should Be Equal', 'Should Contain',
  'Should Be True', 'Open Browser', 'Input Text', 'Click Element', 'Element Should Be Visible',
  'Set Variable', 'Create List', 'Create Dictionary',

  // k6 Performance Testing
  'http', 'del', 'group', 'sleep', 'options', 'vus', 'duration', 'stages', 'thresholds',
  'Trend', 'Counter', 'Gauge', 'Rate', 'scenario',

  // SQL & DB Design
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'UPDATE', 'SET', 'DELETE', 'JOIN', 'INNER',
  'LEFT', 'RIGHT', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'PRIMARY', 'KEY', 'FOREIGN', 'UNIQUE', 'DEFAULT',
  'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', '1NF', '2NF', '3NF', 'BCNF',

  // CLI, Git & Unix
  'git', 'commit', 'checkout', 'branch', 'push', 'pull', 'rebase', 'merge', 'log',
  'diff', 'clone', 'init', 'add', 'reset', 'stash', 'ls', 'cd', 'pwd', 'mkdir', 'rm',
  'cp', 'mv', 'cat', 'grep', 'find', 'chmod', 'chown', 'curl', 'ssh', 'tar', 'sed', 'awk',

  // Security, A11y, Visual & CI/CD
  'XSS', 'SQLi', 'CSRF', 'sanitize', 'encodeURIComponent', 'innerHTML', 'textContent',
  'Authorization', 'Bearer', 'JWT', 'hash', 'salt', 'bcrypt', 'cors', 'rateLimit',
  'axe', 'violations', 'aria-label', 'aria-expanded', 'aria-hidden', 'role', 'tabindex',
  'alt', 'focus', 'blur', 'heading', 'button', 'link', 'img', 'contrast',
  'maxDiffPixels', 'maxDiffPixelRatio', 'threshold', 'mask', 'fullPage', 'clip',
  'pull_request', 'schedule', 'jobs', 'runs-on', 'ubuntu-latest', 'steps', 'uses', 'matrix',

  // Framework Design & DSA
  'PageObject', 'BasePage', 'fixtures', 'extend', 'globalSetup', 'globalTeardown',
  'config', 'reporter', 'use', 'storageState', 'trace',
  'BigO', 'Array', 'Map', 'Set', 'Stack', 'Queue', 'LinkedList', 'BinaryTree', 'Graph',
  'DFS', 'BFS', 'binarySearch', 'quickSort', 'mergeSort', 'dynamicProgramming', 'memo', 'collision'
];

// Word (identifier) touching the caret, e.g. typing "res" inside "const res" -> { start, end, word: "res" }
function getCurrentWord(textarea) {
  const caret = textarea.selectionStart;
  const value = textarea.value;
  let start = caret;
  while (start > 0 && /[A-Za-z0-9_$]/.test(value[start - 1])) start--;
  return { start, end: caret, word: value.slice(start, caret) };
}

// Every distinct identifier typed in the editor plus built-in domain keywords
function getKnownWords(text) {
  const localWords = text.match(EDITOR_WORD_REGEX) || [];
  return [...new Set([...localWords, ...BUILTIN_KEYWORDS])];
}

// Recompute autocomplete matches for the word at the caret and show/hide the dropdown accordingly
function updateEditorAutocomplete() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;

  const { word } = getCurrentWord(textarea);
  if (word.length < EDITOR_WORD_MIN_LEN) {
    hideEditorAutocomplete();
    return;
  }

  const known = getKnownWords(textarea.value);
  editorAutocompleteMatches = known
    .filter(w => w !== word && w.toLowerCase().startsWith(word.toLowerCase()))
    .slice(0, 8);

  if (!editorAutocompleteMatches.length) {
    hideEditorAutocomplete();
    return;
  }

  editorAutocompleteIndex = 0;
  renderEditorAutocomplete(textarea, word);
}

// Lazily create the dropdown element inside the editor's positioned container
function getEditorAutocompleteEl(textarea) {
  let el = document.getElementById('editor-autocomplete');
  if (!el) {
    const container = textarea.closest('.editor-container');
    if (!container) return null;
    el = document.createElement('div');
    el.id = 'editor-autocomplete';
    el.style.cssText = 'display: none; position: absolute; max-height: 180px; overflow-y: auto; background-color: #0b0f17; border: 1px solid var(--border-color); border-radius: 6px; z-index: 20; font-family: var(--font-mono); font-size: 0.8rem;';
    container.appendChild(el);
  }
  return el;
}

// Position the dropdown just below the caret. Font is monospace + white-space:pre, so
// caret pixel position is derived from row/column counts instead of a full mirror-div measurement.
function getCaretPixelPosition(textarea) {
  const style = getComputedStyle(textarea);
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const fontSize = parseFloat(style.fontSize) || 14;
  const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.6;

  if (!getCaretPixelPosition._charWidth) {
    const probe = document.createElement('span');
    probe.style.cssText = `position: absolute; visibility: hidden; white-space: pre; font-family: ${style.fontFamily}; font-size: ${style.fontSize};`;
    probe.textContent = 'M'.repeat(40);
    document.body.appendChild(probe);
    getCaretPixelPosition._charWidth = probe.offsetWidth / 40;
    probe.remove();
  }
  const charWidth = getCaretPixelPosition._charWidth;

  const beforeCaret = textarea.value.slice(0, textarea.selectionStart).split('\n');
  const row = beforeCaret.length - 1;
  const col = beforeCaret[beforeCaret.length - 1].length;

  return {
    x: textarea.offsetLeft + paddingLeft + col * charWidth - textarea.scrollLeft,
    y: textarea.offsetTop + paddingTop + (row + 1) * lineHeight - textarea.scrollTop,
  };
}

// Render the matches with the typed prefix highlighted, near the caret
function renderEditorAutocomplete(textarea, word) {
  const el = getEditorAutocompleteEl(textarea);
  if (!el) return;

  if (editorAutocompleteIndex < 0) editorAutocompleteIndex = 0;
  if (editorAutocompleteIndex >= editorAutocompleteMatches.length) {
    editorAutocompleteIndex = Math.max(0, editorAutocompleteMatches.length - 1);
  }

  el.innerHTML = editorAutocompleteMatches.map((w, idx) => {
    const isActive = idx === editorAutocompleteIndex;
    const bgStyle = isActive ? 'background-color: rgba(59, 130, 246, 0.25); font-weight: bold;' : '';
    return `
    <div class="editor-suggestion-item ${isActive ? 'active' : ''}" onclick="acceptEditorAutocompleteClick('${w.replace(/'/g, "\\'")}')" style="padding: 4px 10px; cursor: pointer; color: var(--text-secondary); ${bgStyle}">
      <b style="color: var(--accent-emerald, #10b981);">${escapeHtml(word)}</b>${escapeHtml(w.slice(word.length))}
    </div>
  `;
  }).join('');

  const { x, y } = getCaretPixelPosition(textarea);
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.display = 'block';

  // Ensure active element is scrolled into view inside the dropdown
  const activeChild = el.children[editorAutocompleteIndex];
  if (activeChild && activeChild.scrollIntoView) {
    activeChild.scrollIntoView({ block: 'nearest' });
  }
}

// Hide the dropdown and clear the current match list
function hideEditorAutocomplete() {
  const el = document.getElementById('editor-autocomplete');
  if (el) el.style.display = 'none';
  editorAutocompleteMatches = [];
  editorAutocompleteIndex = 0;
}

// Replace the word at the caret with the chosen match (index-based or top match)
function acceptEditorAutocomplete(index) {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea || !editorAutocompleteMatches.length) return false;

  const chosenIndex = typeof index === 'number' ? index : editorAutocompleteIndex;
  const chosen = editorAutocompleteMatches[chosenIndex] || editorAutocompleteMatches[0];
  if (!chosen) return false;

  const { start, end } = getCurrentWord(textarea);
  textarea.value = textarea.value.slice(0, start) + chosen + textarea.value.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + chosen.length;
  hideEditorAutocomplete();
  updateGutter();
  return true;
}

// Replace the word at the caret with a clicked suggestion
function acceptEditorAutocompleteClick(word) {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;

  const { start, end } = getCurrentWord(textarea);
  textarea.value = textarea.value.slice(0, start) + word + textarea.value.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + word.length;
  hideEditorAutocomplete();
  updateGutter();
  textarea.focus();
}

// Handle keyboard navigation for the autocomplete dropdown (ArrowUp, ArrowDown, Enter, Tab, Escape)
function handleEditorAutocompleteKeydown(e) {
  const el = document.getElementById('editor-autocomplete');
  const isVisible = el && el.style.display !== 'none' && editorAutocompleteMatches.length > 0;

  if (!isVisible) return false;

  if (e.key === 'ArrowDown') {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    editorAutocompleteIndex = (editorAutocompleteIndex + 1) % editorAutocompleteMatches.length;
    const textarea = document.getElementById('editor-textarea');
    if (textarea) renderEditorAutocomplete(textarea, getCurrentWord(textarea).word);
    return true;
  }

  if (e.key === 'ArrowUp') {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    editorAutocompleteIndex = (editorAutocompleteIndex - 1 + editorAutocompleteMatches.length) % editorAutocompleteMatches.length;
    const textarea = document.getElementById('editor-textarea');
    if (textarea) renderEditorAutocomplete(textarea, getCurrentWord(textarea).word);
    return true;
  }

  if (e.key === 'Enter' || e.key === 'Tab') {
    if (e.metaKey || e.ctrlKey) return false;
    if (typeof e.preventDefault === 'function') e.preventDefault();
    acceptEditorAutocomplete(editorAutocompleteIndex);
    return true;
  }

  if (e.key === 'Escape') {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    hideEditorAutocomplete();
    return true;
  }

  return false;
}
