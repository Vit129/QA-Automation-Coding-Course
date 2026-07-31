// Lightweight syntax-highlight overlay for the code sandbox editor, kept in its own
// file (separate from engine.js) so engine.js doesn't grow further.
//
// Technique: a non-interactive <pre><code> layer sits directly behind the textarea,
// same font/padding/line-height so characters line up 1:1. The textarea's own text
// is made transparent (CSS class added below, only after this layer mounts, so a
// script load failure never hides the student's code) while its caret stays visible.
//
// Depends on: escapeHtml() from engine.js and BUILTIN_KEYWORDS from
// editor-autocomplete.js, both loaded before this file.

const EDITOR_HIGHLIGHT_COMMENT_STRING_REGEX =
  /(\/\/[^\n]*|--[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)/g;

let editorHighlightKeywordRegex = null;

function getEditorHighlightKeywordRegex() {
  if (editorHighlightKeywordRegex) return editorHighlightKeywordRegex;
  const words = (typeof BUILTIN_KEYWORDS !== 'undefined' ? BUILTIN_KEYWORDS : [])
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  editorHighlightKeywordRegex = words.length
    ? new RegExp(`\\b(?:${words.join('|')})\\b`, 'g')
    : null;
  return editorHighlightKeywordRegex;
}

// Wrap keywords inside a plain (non-comment/string/number) chunk of code
function highlightKeywordsInChunk(chunk) {
  const re = getEditorHighlightKeywordRegex();
  if (!re) return escapeHtml(chunk);
  re.lastIndex = 0;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(chunk))) {
    out += escapeHtml(chunk.slice(last, m.index));
    out += `<span class="tok-keyword">${escapeHtml(m[0])}</span>`;
    last = re.lastIndex;
  }
  out += escapeHtml(chunk.slice(last));
  return out;
}

function tokenizeToHtml(code) {
  EDITOR_HIGHLIGHT_COMMENT_STRING_REGEX.lastIndex = 0;
  let out = '';
  let last = 0;
  let m;
  while ((m = EDITOR_HIGHLIGHT_COMMENT_STRING_REGEX.exec(code))) {
    out += highlightKeywordsInChunk(code.slice(last, m.index));
    if (m[1] !== undefined) {
      out += `<span class="tok-comment">${escapeHtml(m[1])}</span>`;
    } else if (m[2] !== undefined) {
      out += `<span class="tok-string">${escapeHtml(m[2])}</span>`;
    } else if (m[3] !== undefined) {
      out += `<span class="tok-number">${escapeHtml(m[3])}</span>`;
    }
    last = EDITOR_HIGHLIGHT_COMMENT_STRING_REGEX.lastIndex;
  }
  out += highlightKeywordsInChunk(code.slice(last));
  return out;
}

function getEditorHighlightLayer(textarea) {
  let layer = document.getElementById('editor-highlight-layer');
  if (!layer) {
    const container = textarea.closest('.editor-container');
    if (!container) return null;
    layer = document.createElement('pre');
    layer.id = 'editor-highlight-layer';
    layer.className = 'editor-highlight-layer';
    layer.innerHTML = '<code></code>';
    container.insertBefore(layer, textarea);
    textarea.classList.add('has-syntax-highlight');
  }
  return layer;
}

function updateSyntaxHighlight() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;
  const layer = getEditorHighlightLayer(textarea);
  if (!layer) return;

  // Trailing newline keeps the overlay's last empty line the same height as the textarea's.
  layer.querySelector('code').innerHTML = tokenizeToHtml(textarea.value) + '\n';
  layer.scrollTop = textarea.scrollTop;
  layer.scrollLeft = textarea.scrollLeft;
}

function syncEditorHighlightScroll() {
  const textarea = document.getElementById('editor-textarea');
  const layer = document.getElementById('editor-highlight-layer');
  if (!textarea || !layer) return;
  layer.scrollTop = textarea.scrollTop;
  layer.scrollLeft = textarea.scrollLeft;
}

function initEditorHighlight() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;

  updateSyntaxHighlight();
  textarea.addEventListener('input', updateSyntaxHighlight);
  textarea.addEventListener('scroll', syncEditorHighlightScroll);

  // engine.js's auto-close-pair insert, smart-enter, tab-indent, and
  // editor-enhancements.js's dedent-on-close/comment-toggle all mutate
  // textarea.value directly via JS (with preventDefault()) - none of that fires a
  // native 'input' event, so the overlay would otherwise go stale while the real
  // textarea text stays invisible (see .has-syntax-highlight), making those features
  // look broken even though the value is actually correct underneath. This listener
  // is attached last (script loads after engine.js/editor-enhancements.js, so it
  // fires last for the same keydown), re-syncing after any such direct mutation.
  textarea.addEventListener('keydown', () => updateSyntaxHighlight());

  // engine.js's loadLesson() swaps textarea.value directly (no 'input' event fires),
  // so wrap it to refresh the overlay whenever the student switches lessons.
  if (typeof loadLesson === 'function') {
    const originalLoadLesson = loadLesson;
    loadLesson = function (...args) {
      originalLoadLesson.apply(this, args);
      updateSyntaxHighlight();
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tokenizeToHtml, getEditorHighlightKeywordRegex };
} else if (typeof window !== 'undefined') {
  window.addEventListener('load', initEditorHighlight);
}
