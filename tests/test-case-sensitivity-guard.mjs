import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiCourseCode = fs.readFileSync(path.join(__dirname, '../API-Testing/course.js'), 'utf8');

function createSandbox() {
  const sandbox = {
    console,
    document: { getElementById: () => null, addEventListener: () => {} },
    localStorage: { getItem: () => null, setItem: () => {} },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(apiCourseCode, sandbox);
  return sandbox;
}

console.log('🧪 Running TDD tests for Case Sensitivity Guard (.GET, .POST, etc.)...');

// Test 1: Uppercase .GET() throws helpful error
{
  const sandbox = createSandbox();
  const lesson = sandbox.LESSONS[0]; // TC-3001
  const badCode = `const response = await request.GET('/api/ta/levels?ticker=AAPL');\nexpect(response.status()).toBe(200);`;

  assert.throws(
    () => lesson.validate(badCode, () => {}),
    (err) => {
      return err.message.includes('Case-sensitive') && err.message.includes('.get()');
    },
    'Should throw helpful error pointing out .get() lowercase requirement'
  );
  console.log('✓ Test 1 Passed: Uppercase .GET() throws helpful case-sensitivity error');
}

// Test 2: Uppercase .POST() throws helpful error
{
  const sandbox = createSandbox();
  const lesson = sandbox.LESSONS[1]; // TC-3002
  const badCode = `const response = await request.POST('/api/ai/portfolio-snapshot', { data: { holdings: [] } });`;

  assert.throws(
    () => lesson.validate(badCode, () => {}),
    (err) => {
      return err.message.includes('Case-sensitive') && err.message.includes('.post()');
    },
    'Should throw helpful error pointing out .post() lowercase requirement'
  );
  console.log('✓ Test 2 Passed: Uppercase .POST() throws helpful case-sensitivity error');
}

// Test 3: Valid lowercase .get() is accepted normally
{
  const sandbox = createSandbox();
  const lesson = sandbox.LESSONS[0]; // TC-3001
  const goodCode = lesson.solution;

  assert.doesNotThrow(() => {
    lesson.validate(goodCode, () => {});
  });
  console.log('✓ Test 3 Passed: Lowercase solution validates without errors');
}

console.log('\n🎉 ALL CASE SENSITIVITY GUARD TESTS PASSED!');
