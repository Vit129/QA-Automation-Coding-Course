import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const highlightCode = fs.readFileSync(path.join(__dirname, 'editor-highlight.js'), 'utf8');

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadSandbox(builtinKeywords) {
  const sandbox = {
    console,
    module: { exports: {} },
    escapeHtml,
    BUILTIN_KEYWORDS: builtinKeywords,
  };
  vm.createContext(sandbox);
  vm.runInContext(highlightCode, sandbox);
  return sandbox;
}

console.log('🧪 Running TDD tests for Editor Syntax Highlight Tokenizer...');

// Test 1: keyword gets wrapped, plain code stays untouched
{
  const sandbox = loadSandbox(['expect', 'request']);
  const html = sandbox.tokenizeToHtml("const r = await request.post('/x');\nexpect(r).toBe(1);");
  assert.ok(html.includes('<span class="tok-keyword">request</span>'), 'request should be wrapped as a keyword');
  assert.ok(html.includes('<span class="tok-keyword">expect</span>'), 'expect should be wrapped as a keyword');
  console.log('✓ Test 1 Passed: known keywords wrapped in tok-keyword spans');
}

// Test 2: line comment (//) wrapped, string wrapped, number wrapped
{
  const sandbox = loadSandbox([]);
  const html = sandbox.tokenizeToHtml("const x = 42; // a comment\nconst s = 'hello';");
  assert.ok(html.includes('<span class="tok-comment">// a comment</span>'), 'line comment should be wrapped');
  assert.ok(html.includes('<span class="tok-number">42</span>'), 'number should be wrapped');
  assert.ok(html.includes('<span class="tok-string">&#39;hello&#39;</span>'), 'string should be wrapped');
  console.log('✓ Test 2 Passed: comments, numbers, and strings each wrapped correctly');
}

// Test 3: SQL-style comment (--) also recognized
{
  const sandbox = loadSandbox([]);
  const html = sandbox.tokenizeToHtml('-- a sql comment\nCREATE TABLE t (id INT);');
  assert.ok(html.includes('<span class="tok-comment">-- a sql comment</span>'), 'SQL comment should be wrapped');
  console.log('✓ Test 3 Passed: SQL-style -- comments recognized');
}

// Test 4: HTML-unsafe characters inside code are escaped, not left raw
{
  const sandbox = loadSandbox([]);
  const html = sandbox.tokenizeToHtml('const a = 1 < 2 && 3 > 2;');
  assert.ok(!/[^&]</.test(html.replace(/<span[^>]*>|<\/span>/g, '')), 'raw unescaped "<" must not appear outside of span tags');
  assert.ok(html.includes('&lt;'), 'comparison operators must be HTML-escaped');
  assert.ok(html.includes('&amp;&amp;'), '&& must be HTML-escaped');
  console.log('✓ Test 4 Passed: unsafe HTML characters in code are escaped');
}

// Test 5: text inside a comment/string is never re-scanned for keywords (no double-wrapping)
{
  const sandbox = loadSandbox(['expect']);
  const html = sandbox.tokenizeToHtml("// expect this to be a comment, not a keyword");
  assert.ok(!html.includes('tok-keyword'), 'keyword inside a comment must not be highlighted as a keyword');
  assert.ok(html.includes('tok-comment'), 'the whole line should be one comment token');
  console.log('✓ Test 5 Passed: keywords inside comments/strings are not double-highlighted');
}

console.log('\n🎉 ALL SYNTAX HIGHLIGHT TOKENIZER TESTS PASSED!');
