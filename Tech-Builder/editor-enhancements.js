// Extra editor conveniences layered on top of shared/engine.js, kept in their own file
// so engine.js doesn't grow further. Attaches its own keydown listener to the same
// #editor-textarea (addEventListener supports multiple independent listeners on one
// element) - runs after engine.js's own listener since this script loads later.
// Depends on: engine.js's TAB_WIDTH global and updateGutter() being loaded first.

// Dedent a line when the user types a closing bracket on an otherwise-blank line,
// aligning it with the line that opened the matching bracket (like real IDEs do).
// Only fires when engine.js's own auto-close-pair handler did NOT already handle the
// keypress (e.g. the skip-over-existing-closer case) - checked via e.defaultPrevented.
const EDITOR_DEDENT_CLOSERS = { ')': '(', '}': '{', ']': '[' };

function handleAutoDedentOnClose(textarea, key) {
  const opener = EDITOR_DEDENT_CLOSERS[key];
  if (!opener) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  if (start !== end) return;

  const val = textarea.value;
  const lineStart = val.lastIndexOf('\n', start - 1) + 1;
  const beforeCaret = val.slice(lineStart, start);
  if (beforeCaret.trim() !== '') return; // only dedent when the line so far is blank/whitespace

  const tabWidth = typeof TAB_WIDTH === 'number' ? TAB_WIDTH : 2;
  if (beforeCaret.length < tabWidth) return;

  // Walk backwards tracking bracket depth to find the line that opened this block.
  let depth = 0;
  let openerLineIndent = null;
  for (let i = start - 1; i >= 0; i--) {
    const ch = val[i];
    if (ch === key) {
      depth++;
    } else if (ch === opener) {
      if (depth === 0) {
        const ls = val.lastIndexOf('\n', i - 1) + 1;
        openerLineIndent = (val.slice(ls, i).match(/^\s*/) || [''])[0];
        break;
      }
      depth--;
    }
  }

  const newIndent = openerLineIndent !== null
    ? openerLineIndent
    : beforeCaret.slice(0, Math.max(0, beforeCaret.length - tabWidth));

  if (newIndent.length === beforeCaret.length) return;

  textarea.value = val.slice(0, lineStart) + newIndent + val.slice(start);
  textarea.selectionStart = textarea.selectionEnd = lineStart + newIndent.length;
  if (typeof updateGutter === 'function') updateGutter();
  // Deliberately no preventDefault(): the browser still inserts the typed closing
  // bracket right after our dedent, at the now-updated cursor position.
}

// Toggle a line comment (Cmd/Ctrl+/) across the selected lines (or just the current
// line). Comment marker is auto-detected from whichever of // -- # already appears
// most in the file, since Final-Project mixes JS/SQL/YAML/Robot Framework per phase
// and every other track is single-language but the templates already use the right
// marker for that language.
function detectEditorCommentMarker(text) {
  const counts = { '//': 0, '--': 0, '#': 0 };
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) counts['//']++;
    else if (trimmed.startsWith('--')) counts['--']++;
    else if (trimmed.startsWith('#')) counts['#']++;
  }
  let best = '//';
  let bestCount = 0;
  for (const marker of Object.keys(counts)) {
    if (counts[marker] > bestCount) {
      best = marker;
      bestCount = counts[marker];
    }
  }
  return best;
}

function toggleEditorLineComment(textarea) {
  const marker = detectEditorCommentMarker(textarea.value);
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;

  const lineStart = val.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = val.indexOf('\n', end > start ? end - 1 : end);
  if (lineEnd === -1) lineEnd = val.length;

  const block = val.slice(lineStart, lineEnd);
  const lines = block.split('\n');
  const contentLines = lines.filter(l => l.trim() !== '');
  const allCommented = contentLines.length > 0 && contentLines.every(l => l.trim().startsWith(marker));

  const newLines = lines.map((line) => {
    if (line.trim() === '') return line;
    const indent = (line.match(/^\s*/) || [''])[0];
    const rest = line.slice(indent.length);
    if (allCommented) {
      if (rest.startsWith(marker + ' ')) return indent + rest.slice(marker.length + 1);
      if (rest.startsWith(marker)) return indent + rest.slice(marker.length);
      return line;
    }
    return indent + marker + ' ' + rest;
  });

  const newBlock = newLines.join('\n');
  textarea.value = val.slice(0, lineStart) + newBlock + val.slice(lineEnd);
  textarea.selectionStart = lineStart;
  textarea.selectionEnd = lineStart + newBlock.length;
  if (typeof updateGutter === 'function') updateGutter();
  if (typeof updateEditorAutocomplete === 'function') updateEditorAutocomplete();
}

function handleEditorEnhancementsKeydown(e) {
  const textarea = e.target;

  if ((e.metaKey || e.ctrlKey) && e.key === '/') {
    e.preventDefault();
    toggleEditorLineComment(textarea);
    return;
  }

  if (!e.defaultPrevented && EDITOR_DEDENT_CLOSERS[e.key]) {
    handleAutoDedentOnClose(textarea, e.key);
  }
}

function initEditorEnhancements() {
  const textarea = document.getElementById('editor-textarea');
  if (!textarea) return;
  textarea.addEventListener('keydown', handleEditorEnhancementsKeydown);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { detectEditorCommentMarker, toggleEditorLineComment, handleAutoDedentOnClose };
} else if (typeof window !== 'undefined') {
  window.addEventListener('load', initEditorEnhancements);
}
