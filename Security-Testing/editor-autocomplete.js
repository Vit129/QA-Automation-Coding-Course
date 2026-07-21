// Word-based autocomplete for the code sandbox editor (shared across all course tracks).
// Depends on shared/engine.js's updateGutter() and escapeHtml() being loaded in the same page.
// Load this file before or after engine.js - both attach to the same global scope, no explicit
// import needed (same pattern course.js/engine.js already use for PREFIX/TAB_WIDTH/LESSONS etc).

const EDITOR_WORD_REGEX = /[A-Za-z_$][A-Za-z0-9_$]*/g;
const EDITOR_WORD_MIN_LEN = 2;
let editorAutocompleteMatches = [];

// Word (identifier) touching the caret, e.g. typing "res" inside "const res" -> { start, end, word: "res" }
function getCurrentWord(textarea) {
  const caret = textarea.selectionStart;
  const value = textarea.value;
  let start = caret;
  while (start > 0 && /[A-Za-z0-9_$]/.test(value[start - 1])) start--;
  return { start, end: caret, word: value.slice(start, caret) };
}

// Every distinct identifier already typed in the editor (word-based completion, like an IDE's local suggestions)
function getKnownWords(text) {
  return [...new Set(text.match(EDITOR_WORD_REGEX) || [])];
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
    .slice(0, 6);

  if (!editorAutocompleteMatches.length) {
    hideEditorAutocomplete();
    return;
  }

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
    el.style.cssText = 'display: none; position: absolute; max-height: 160px; overflow-y: auto; background-color: #0b0f17; border: 1px solid var(--border-color); border-radius: 6px; z-index: 20; font-family: var(--font-mono); font-size: 0.8rem;';
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

  el.innerHTML = editorAutocompleteMatches.map(w => `
    <div class="editor-suggestion-item" onclick="acceptEditorAutocompleteClick('${w.replace(/'/g, "\\'")}')" style="padding: 4px 10px; cursor: pointer; color: var(--text-secondary);">
      <b style="color: var(--accent-emerald);">${escapeHtml(word)}</b>${escapeHtml(w.slice(word.length))}
    </div>
  `).join('');

  const { x, y } = getCaretPixelPosition(textarea);
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.display = 'block';
}

// Hide the dropdown and clear the current match list
function hideEditorAutocomplete() {
  const el = document.getElementById('editor-autocomplete');
  if (el) el.style.display = 'none';
  editorAutocompleteMatches = [];
}

// Replace the word at the caret with the top match (used by the Tab key)
function acceptEditorAutocomplete() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea || !editorAutocompleteMatches.length) return false;

  const { start, end } = getCurrentWord(textarea);
  const chosen = editorAutocompleteMatches[0];
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
