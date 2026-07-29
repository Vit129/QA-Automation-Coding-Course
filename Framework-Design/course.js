(function() {
// Test Automation Framework Design Interactive Coding Playground Data and Logic
// The DRY-helpers lesson is grounded in this very course's own real refactor from earlier
// today (extracting shared/engine.js out of 6 near-duplicate course.js files, including the
// real file:// script-loading limitation hit and worked around). Config/fixtures/reporting
// lessons use standard Playwright API conventions; folder-structure follows the pattern
// already used by the Playwright UI Testing track's own POM lesson.

// --- Sandbox execution helpers --------------------------------------------------
// Some validate() checks below need to verify learner code actually BEHAVES
// correctly (calls a real function with real inputs and inspects the real output),
// not just that certain keywords appear in the submitted text. These helpers run
// the learner's code inside an isolated `Function` scope so validate() can call
// into whatever it defines, with controlled fake inputs, without touching this
// module's own state or the real browser globals.

function stripComments(code) {
  // A regex-only strip breaks on strings that themselves contain '//' (e.g. the
  // 'http://localhost:5173' URL literal this course's own lessons use) — it would
  // treat the URL's '//' as a line-comment start and truncate the string. This
  // scans char-by-char, tracking string state, so '//'/'/*' are only treated as
  // comments when they appear outside a string literal.
  // ponytail: doesn't special-case '/regex/' literals containing '/' — not used
  // in this course's solutions, upgrade if that ever changes.
  let result = "";
  let i = 0;
  const n = code.length;
  while (i < n) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let str = ch;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === "\\" && i + 1 < n) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      str += code[i] || "";
      i++;
      result += str;
      continue;
    }
    if (ch === "/" && code[i + 1] === "/") {
      while (i < n && code[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}

function makeFakeLocalStorage(data) {
  const keys = Object.keys(data);
  return {
    length: keys.length,
    key: (i) => keys[i],
    getItem: (k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
  };
}

// Runs `code` (the learner's snippet) inside a fresh Function scope with `params`
// injected as parameters (so e.g. a fake `localStorage` shadows the real global),
// then evaluates `expr` in that same scope and returns its value. Throws if `code`
// itself throws while being defined/executed.
function execLearnerCode(code, params, expr) {
  const names = Object.keys(params);
  const values = names.map((n) => params[n]);
  const factory = new Function(...names, `${code}\nreturn (${expr});`);
  return factory(...values);
}

// Extracts the balanced `{...}`/`[...]` block that immediately follows the first
// match of `keyRegex` (e.g. /reporter:\s*\[/), so later checks can be anchored to
// "inside this specific object/array" instead of "anywhere in the whole file"
// (which a stray comment or unrelated line could otherwise satisfy).
function extractBalancedBlock(code, keyRegex, openChar, closeChar) {
  const m = keyRegex.exec(code);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  if (code[start] !== openChar) return null;
  let depth = 0;
  for (let i = start; i < code.length; i++) {
    if (code[i] === openChar) depth++;
    else if (code[i] === closeChar) {
      depth--;
      if (depth === 0) return code.slice(start, i + 1);
    }
  }
  return null;
}

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "ทำไมต้องออกแบบ Framework: ปัญหาของ \"ไฟล์เดียวยาวเป็นพันบรรทัด\"",
    template: `// สถานการณ์: playwright.config.ts เป็นจุดตั้งค่ากลางของทั้งโปรเจก test
// 1. กำหนด baseURL ให้ config ชี้ไปที่ 'http://localhost:5173' (URL ของ My-Investment-Port ตอน dev)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า baseURL...");
      const clean = stripComments(code);
      const hasBaseURL = /use\s*:\s*\{[\s\S]*?baseURL:\s*['"]http:\/\/localhost:5173['"][\s\S]*?\}/.test(clean);
      if (!hasBaseURL) {
        throw new Error("ไม่พบการตั้งค่า baseURL: 'http://localhost:5173' ภายใน use: { ... } block\nตัวอย่าง: use: { baseURL: 'http://localhost:5173' }");
      }
      log("✓ ตั้งค่า baseURL ถูกต้อง");
    },
    hint: "ค่า baseURL เป็น property หนึ่งภายใน use: { } ของ defineConfig() ต้องเป็น string URL ที่ล้อมด้วย quote ให้ตรงกับ URL ของ dev server เป๊ะ",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
  },
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Test Automation Framework Design</strong> คือการตัดสินใจว่าจะจัดโครงสร้างโปรเจก test อย่างไร ไม่ใช่แค่ "เขียน test แต่ละบทให้ผ่าน" (ซึ่งเป็นสิ่งที่ track อื่นๆ ในคอร์สนี้สอนไปแล้ว) — ปัญหาที่พบบ่อยเมื่อโปรเจก test โตขึ้น: ทุกคนเขียน test ไฟล์ใหม่แบบ copy-paste จากไฟล์เก่า ไม่มีจุดรวมศูนย์ของ config/helper สุดท้ายกลายเป็น "โค้ดซ้ำกระจายไปทุกที่" แก้จุดเดียวต้องไล่แก้เป็นสิบไฟล์<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทเรียนที่เหลือในเทรคนี้จะครอบคลุม: Custom Fixtures, โครงสร้างโฟลเดอร์, การลดโค้ดซ้ำแบบ DRY, การจัดการ Test Data, และการตั้งค่า Reporting<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>playwright.config.ts</code> คือจุดตั้งค่ากลางของทั้งโปรเจก — <code>baseURL</code> ทำให้ทุก test เขียน <code>page.goto('/watchlist')</code> แทนที่จะต้องพิมพ์ URL เต็มซ้ำทุกไฟล์ (<code>page.goto('http://localhost:5173/watchlist')</code>) — ถ้าวันหนึ่ง URL เปลี่ยน (deploy ไป staging environment) แก้ที่ config จุดเดียวจบ ไม่ต้องไล่แก้ทุก test file<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใส่ <code>baseURL</code> ไว้นอก <code>use: { ... }</code> block (เช่นแปะไว้ระดับบนสุดของ <code>defineConfig()</code> ตรงๆ) จะไม่มีผลอะไรเลย เพราะ Playwright อ่านค่านี้จากภายใน <code>use</code> เท่านั้น และต้องมี <code>http://</code> นำหน้าเสมอให้ตรงกับพอร์ตจริงของ dev server`,
    example: `// ตัวอย่าง config เพิ่มเติมที่ใช้บ่อย
export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  retries: 2,
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า <code>baseURL: 'http://localhost:5173'</code> ใน <code>use</code> block`
  },
  {
    id: "custom_fixtures",
    meta: "บทที่ 1",
    title: "Custom Fixtures: ฉีดค่าที่ Test ต้องใช้ซ้ำๆ โดยไม่ต้อง Setup เอง",
    template: `// สถานการณ์: หลาย test ต้องการหน้า Watchlist ที่ seed ข้อมูลไว้แล้วเสมอ
// เขียน beforeEach ซ้ำทุกไฟล์เป็นภาระ — ใช้ custom fixture แทน
// 1. สร้าง custom fixture ชื่อ 'watchlistPage' ที่ goto('/watchlist') ให้อัตโนมัติก่อนส่งต่อให้ test
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสร้าง Custom Fixture...");
      const clean = stripComments(code);
      const hasExtend = /\.extend\(/.test(clean);
      if (!hasExtend) {
        throw new Error("ไม่พบการใช้ test.extend()");
      }
      // Anchor goto/use to be INSIDE the watchlistPage fixture body itself, not just
      // floating anywhere else in the file — prevents passing via scattered snippets.
      const fixtureMatch = /watchlistPage\s*:\s*async\s*\(\s*\{[^)]*page[^)]*\}\s*,\s*use\s*\)\s*=>\s*\{([\s\S]*?)\}/.exec(clean);
      if (!fixtureMatch) {
        throw new Error("ไม่พบ fixture ชื่อ watchlistPage ที่เป็นรูปแบบ async ({ page }, use) => { ... }");
      }
      const body = fixtureMatch[1];
      if (!/goto\(\s*['"]\/watchlist['"]\s*\)/.test(body)) {
        throw new Error("fixture watchlistPage ต้องยิง goto('/watchlist') ภายในตัว fixture เอง");
      }
      if (!/await\s+use\(/.test(body)) {
        throw new Error("fixture watchlistPage ต้องเรียก await use(...) ภายในตัว fixture เอง เพื่อส่งค่าต่อให้ test");
      }
      log("✓ สร้าง Custom Fixture ถูกต้อง");
    },
    hint: "ใช้ pattern base.extend({ ชื่อ fixture: async ({ page }, use) => { ... } }) — ภายใน fixture ให้ goto หน้าที่ต้องการก่อน แล้วค่อย await use(page) เพื่อส่งค่าต่อให้ test ใช้งาน",
    solution: `import { test as base } from '@playwright/test';

export const test = base.extend({
  watchlistPage: async ({ page }, use) => {
    await page.goto('/watchlist');
    await use(page);
  },
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Fixture</strong> ของ Playwright คือกลไก "เตรียมของให้ก่อน test เริ่ม แล้วเก็บกวาดให้หลัง test จบ" — <code>page</code>, <code>request</code>, <code>context</code> ที่ใช้กันมาตลอดทั้งคอร์สนี้ ล้วนเป็น built-in fixture ทั้งหมด<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Fixture</strong> ของ Playwright คือกลไก "เตรียมของให้ก่อน test เริ่ม แล้วเก็บกวาดให้หลัง test จบ" — <code>page</code>, <code>request</code>, <code>context</code> ที่ใช้กันมาตลอดทั้งคอร์สนี้ ล้วนเป็น built-in fixture ทั้งหมด<br/><br/>
    <code>test.extend()</code> สร้าง fixture ของตัวเองเพิ่มได้ — ในตัวอย่างนี้ <code>watchlistPage</code> ทำ <code>goto('/watchlist')</code> ให้อัตโนมัติ<strong>ก่อน</strong>ที่ code ของ test จะเริ่มทำงาน แล้ว <code>await use(page)</code> คือจุดที่ "ส่งมอบ" ค่าที่เตรียมไว้กลับไปให้ test ใช้งานต่อ (โค้ดหลัง <code>use()</code> จะรันหลัง test จบ เหมาะกับ cleanup)<br/><br/>
    ประโยชน์เทียบกับเขียน <code>beforeEach</code> ซ้ำทุกไฟล์: fixture ประกาศครั้งเดียวในไฟล์กลาง แล้ว <code>import { test } from './fixtures'</code> ใช้ได้ทุกไฟล์ — ทุก test ที่รับ parameter <code>watchlistPage</code> จะได้หน้าที่ goto ไว้แล้วอัตโนมัติ ไม่ต้องเขียน <code>await page.goto('/watchlist')</code> ซ้ำเองในทุก test อีกต่อไป<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>export const test = base.extend({</code><br/>
<code>&nbsp;&nbsp;watchlistPage: async ({ page }, use) => {</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await page.goto('/watchlist');</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await use(page);</code><br/>
<code>&nbsp;&nbsp;},</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมเรียก <code>await use(page)</code> ในตัว fixture จะทำให้ test ที่ขอใช้ <code>watchlistPage</code> ไม่ได้ค่าอะไรเลย (fixture ต้อง "ส่งมอบ" ค่าผ่าน <code>use()</code> เสมอ จะ <code>return</code> ตรงๆ แบบฟังก์ชันปกติไม่ได้)`,
    example: `// ตัวอย่างการใช้งาน fixture ที่สร้างไว้ในไฟล์ test จริง
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('เพิ่ม ticker ใหม่ใน watchlist', async ({ watchlistPage }) => {
  await watchlistPage.getByTestId('add-ticker-btn').click();
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ใช้ <code>test.extend()</code> สร้าง fixture ชื่อ <code>watchlistPage</code><br/>
    2. ให้ fixture ยิง <code>goto('/watchlist')</code> แล้ว <code>await use(page)</code> ส่งต่อ`
  },
  {
    id: "folder_organization",
    meta: "บทที่ 2",
    title: "โครงสร้างโฟลเดอร์: แยกหน้าที่ให้ชัด ไม่ใช่โยนทุกอย่างลงที่เดียว",
    template: `// สถานการณ์: กำลังจะสร้างโครงสร้างโฟลเดอร์สำหรับ automation project ใหม่
// 1. เขียน comment แสดงโครงสร้างโฟลเดอร์มาตรฐาน 4 โฟลเดอร์ (tests, pages, fixtures, utils - ใส่ / ต่อท้ายทุกชื่อ)
//    พร้อมอธิบายสั้นๆ ว่าแต่ละโฟลเดอร์เก็บอะไร
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบโครงสร้างโฟลเดอร์ที่ระบุ...");
      const hasTests = /\btests\//.test(code);
      const hasPages = /\bpages\//.test(code);
      const hasFixtures = /\bfixtures\//.test(code);
      const hasUtils = /\butils\//.test(code);
      if (!hasTests || !hasPages || !hasFixtures || !hasUtils) {
        throw new Error("ต้องระบุครบทั้ง 4 โฟลเดอร์: tests/, pages/, fixtures/, utils/");
      }
      log("✓ ระบุโครงสร้างโฟลเดอร์ครบถ้วนถูกต้อง");
    },
    hint: "นึกถึง 4 หน้าที่หลักของโปรเจก test: ที่เก็บตัว test เอง, ที่เก็บ Page Object ของแต่ละหน้า, ที่เก็บของที่ share ข้ามไฟล์แบบ fixture/seed data, และที่เก็บ helper function ทั่วไปที่ไม่ผูกกับหน้าไหน — ตั้งชื่อโฟลเดอร์ให้ตรงหน้าที่ อย่าลืมใส่ / ต่อท้ายทุกชื่อ",
    solution: `// โครงสร้างโฟลเดอร์มาตรฐานของ automation project
// tests/     - ไฟล์ .spec.ts ที่มีแต่ test case (สั้น อ่านง่าย ไม่มี logic ซับซ้อน)
// pages/     - Page Object class ของแต่ละหน้า (WatchlistPage.ts, LoginPage.ts)
// fixtures/  - custom fixture และ test data (seed data, mock response)
// utils/     - helper function ที่ใช้ร่วมกันข้ามไฟล์ (formatDate, generateTestEmail)`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ โครงสร้างโฟลเดอร์: แยกหน้าที่ให้ชัด ไม่ใช่โยนทุกอย่างลงที่เดียว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>โครงสร้างมาตรฐานที่ทีม Playwright ส่วนใหญ่ใช้ (สอดคล้องกับที่ track Playwright UI Testing สอน POM ไปแล้ว แต่ขยายให้เห็นภาพรวมทั้งโปรเจก):<br/><br/><br/>หลักการเลือกว่าโค้ดควรอยู่โฟลเดอร์ไหน: <strong>ถ้าโค้ดผูกกับหน้าเว็บหนึ่งหน้า → pages/, ถ้าเป็น setup ที่ test หลายไฟล์ใช้ร่วมกัน → fixtures/, ถ้าเป็น pure function ไม่ผูกกับ Playwright เลย → utils/</strong><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>// tests/     - ไฟล์ .spec.ts ที่มีแต่ test case</code><br/>
<code>// pages/     - Page Object class ของแต่ละหน้า</code><br/>
<code>// fixtures/  - custom fixture และ test data</code><br/>
<code>// utils/     - helper function ที่ใช้ร่วมกันข้ามไฟล์</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใส่ Page Object class ปนไว้ใน <code>tests/</code> โดยตรง (แทนที่จะแยกไปไว้ใน <code>pages/</code>) ทำให้ไฟล์ test ยาวและมี implementation detail ปนกับ test case จนแยกไม่ออกว่าอะไรคือ "สิ่งที่ทดสอบ" อะไรคือ "วิธี implement"`,
    example: `// ตัวอย่างโครงสร้างเต็มของโปรเจกจริง
// e2e/
//   tests/
//     watchlist.spec.ts
//     auth.spec.ts
//   pages/
//     WatchlistPage.ts
//   fixtures/
//     index.ts
//     seedData.ts
//   utils/
//     dateHelpers.ts
//   playwright.config.ts`,
    task: `จงเขียน comment ให้สมบูรณ์ โดยระบุโครงสร้างโฟลเดอร์มาตรฐานครบทั้ง 4 โฟลเดอร์: <code>tests/</code>, <code>pages/</code>, <code>fixtures/</code>, <code>utils/</code>`
  },
  {
    id: "reusable_helpers_dry",
    meta: "บทที่ 3",
    title: "DRY จริง: กรณีศึกษาจากคอร์สนี้เอง ที่เพิ่งรีแฟคเตอร์วันนี้",
    template: `// สถานการณ์จริง: ฟังก์ชันนี้คือของจริงจากหน้า dashboard รวมทุก track ของคอร์สนี้เอง (index.html)
// dashboard ต้องนับบทที่ผ่านแล้วของ 11 track ที่ไม่รู้จักกันเลย โดยไม่เขียนโค้ดนับแยกทีละ track
// กุญแจคือทุก track เก็บ key แบบเดียวกันเป๊ะ: "<prefix>_course_completed_<lessonId>" = 'true'
// เขียนฟังก์ชันเดียวที่รับแค่ prefix แล้วใช้ได้กับทุก track โดยไม่ต้องรู้ล่วงหน้าว่ามีบทอะไรบ้าง
// 1. วนลูปทุก key ใน localStorage ด้วย for (let i = 0; i < localStorage.length; i++)
// 2. นับเฉพาะ key ที่ขึ้นต้นด้วย \`\${prefix}_course_completed_\` และมีค่าเป็น 'true'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบฟังก์ชัน countCompletedLessons (รันจริงเพื่อตรวจพฤติกรรม)...");
      // Real execution instead of keyword-matching: a function that hard-codes a
      // return value or checks the wrong variable would pass a text-only regex
      // check, but fails here because we actually call it against fake data.
      const data = {
        fwk_course_completed_intro: "true",
        fwk_course_completed_custom_fixtures: "true",
        fwk_course_completed_folder_organization: "false",
        other_course_completed_intro: "true",
        fwk_course_completed_reporting_config: "true",
      };
      let fn;
      try {
        fn = execLearnerCode(
          code,
          { localStorage: makeFakeLocalStorage(data) },
          'typeof countCompletedLessons === "function" ? countCompletedLessons : undefined'
        );
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
      }
      if (typeof fn !== "function") {
        throw new Error("ไม่พบการประกาศ function countCompletedLessons(prefix) ที่ทำงานได้จริง");
      }
      const fwkCount = fn("fwk");
      if (fwkCount !== 3) {
        throw new Error(`countCompletedLessons('fwk') ควรได้ 3 (นับเฉพาะ key ที่ขึ้นต้นด้วย fwk_course_completed_ และค่าเป็น 'true') แต่ได้ ${fwkCount}`);
      }
      const otherCount = fn("other");
      if (otherCount !== 1) {
        throw new Error(`countCompletedLessons('other') ควรได้ 1 แต่ได้ ${otherCount}`);
      }
      log("✓ ฟังก์ชันทำงานถูกต้องกับข้อมูลจำลอง (ตรวจจากผลลัพธ์จริง ไม่ใช่แค่รูปแบบข้อความ)");
    },
    hint: "วนลูปด้วย for และดึงชื่อ key แต่ละตัวด้วย localStorage.key(i) เทียบว่าขึ้นต้นด้วย marker ที่ประกอบจาก prefix ด้วย .startsWith(...) แล้วเช็คค่าด้วย localStorage.getItem(key) ให้เท่ากับ 'true' แบบ strict equality (===) ก่อนนับ",
    solution: `function countCompletedLessons(prefix) {
  const marker = \`\${prefix}_course_completed_\`;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(marker) && localStorage.getItem(key) === 'true') {
      count++;
    }
  }
  return count;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding แบบที่สุดของบทนี้:</strong> ฟังก์ชันนี้ไม่ใช่ตัวอย่างสมมติ — มันคือโค้ดจริงที่ยกมาจาก <code>index.html</code> ของคอร์สนี้เองเป๊ะๆ (แค่เปลี่ยนชื่อ) หน้า dashboard รวมทุก track ต้องนับความคืบหน้าของ 11 track ที่มีจำนวนบทไม่เท่ากันเลย (API-Testing 13 บท, Visual-Regression 5 บท, ฯลฯ) และ dashboard <strong>ไม่รู้จักเนื้อหาของ track ไหนเลยสักตัว</strong> — สิ่งที่ทำให้ฟังก์ชันเดียวใช้กับทุก track ได้คือทุก track เก็บ progress ด้วย key รูปแบบเดียวกันเป๊ะ: <code>&lt;prefix&gt;_course_completed_&lt;lessonId&gt;</code> = <code>'true'</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>นี่คือ DRY ระดับที่ลึกกว่าแค่ "เขียนฟังก์ชันคำนวณเลข" — มันคือการออกแบบ<strong>รูปแบบ key ให้เดายาก reuse ได้ล่วงหน้า</strong> (ทำตั้งแต่ตอนออกแบบแต่ละ track ให้ใช้ prefix ต่างกันแต่โครงสร้างเดียวกัน) แล้วเขียน<strong>ฟังก์ชันเดียวที่พารามิเตอร์ด้วย prefix</strong> แทนที่จะเขียนโค้ดนับแยกทีละ 11 ครั้งสำหรับ 11 track — เพิ่ม track ที่ 12 ในอนาคตก็ไม่ต้องแตะฟังก์ชันนี้เลยแม้แต่บรรทัดเดียว<br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>อุปสรรคที่เจอจริงระหว่างทำ engine.js refactor ของคอร์สนี้ (คนละจุดกับฟังก์ชันนี้ แต่หลักการ DRY เดียวกัน):</strong> ตอนแรกลองรวม engine logic (render lesson list, validate, reset) ที่ซ้ำกัน ~90% ข้าม 11 ไฟล์ course.js ด้วย <code>&lt;script src="../shared/engine.js"&gt;</code> แล้วพบว่า browser บล็อกการโหลด script ข้าม directory ผ่าน <code>file://</code> เงียบๆ — ทางแก้จริงที่ใช้: เก็บไฟล์ต้นฉบับไว้ที่เดียว (<code>shared/engine.js</code>) แล้วมี script sync ก็อปปี้เข้าไปในแต่ละ track folder เป็น <code>engine.js</code> ของตัวเอง (same-directory load ใช้งานได้จริง) — DRY ที่ดีในทางทฤษฎีบางครั้งเจอข้อจำกัดทางเทคนิคจริงที่ต้องหาทางประนีประนอม ไม่ใช่ทำได้ตรงไปตรงมาเสมอไป<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใช้ <code>===</code> เทียบกับ <code>'true'</code> (ใช้ truthy check เฉยๆ) จะนับ string ค่าอื่นที่ไม่ใช่ 'true' ผิดไปด้วย และอย่าลืม guard <code>key &&</code> ก่อนเรียก <code>.startsWith()</code> เพราะ <code>localStorage.key(i)</code> อาจคืน <code>null</code> ได้`,
    example: `// ตัวอย่างใช้ฟังก์ชันเดียวกันนี้กับหลาย track รวด ไม่ต้องเขียนโค้ดนับแยก
const tracks = [
  { prefix: 'api', total: 13 },
  { prefix: 'visual', total: 5 },
];
for (const t of tracks) {
  console.log(\`\${t.prefix}: \${countCompletedLessons(t.prefix)}/\${t.total}\`);
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function countCompletedLessons(prefix)</code><br/>
    2. วนลูปทุก key ใน <code>localStorage</code> ด้วย <code>for (let i = 0; i &lt; localStorage.length; i++)</code><br/>
    3. นับเฉพาะ key ที่ <code>.startsWith(\`\${prefix}_course_completed_\`)</code> และมีค่าเป็น <code>'true'</code>`
  },
  {
    id: "test_data_management",
    meta: "บทที่ 4",
    title: "Test Data Management: แยกข้อมูลทดสอบออกจาก Logic การทดสอบ",
    template: `// สถานการณ์: test หลายไฟล์ต้องใช้ ticker ตัวอย่างเดียวกัน (AAPL, ราคา, จำนวนหุ้น)
// เขียนค่าคงที่ฝังในทุกไฟล์ทำให้แก้ทีเดียวไม่ครบ
// 1. สร้าง object testHoldings เก็บข้อมูลทดสอบ (ไม่ใช่ logic การทดสอบ) แยกออกมาต่างหาก
//    มี key: ticker='AAPL', shares=40, avgCost=178.00
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแยก Test Data...");
      const clean = stripComments(code);
      // Extract the actual object body so ticker/shares/avgCost must appear INSIDE
      // testHoldings itself — not merely somewhere else in the file (e.g. a stray
      // comment or an unrelated line) while testHoldings stays an empty object.
      const block = extractBalancedBlock(clean, /(?:const|export const)\s+testHoldings\s*=\s*\{/, "{", "}");
      if (!block) {
        throw new Error("ไม่พบการประกาศ testHoldings object");
      }
      const hasTicker = /ticker:\s*['"]AAPL['"]/.test(block);
      const hasShares = /shares:\s*40\b/.test(block);
      const hasAvgCost = /avgCost:\s*178(\.0+)?\b/.test(block);
      if (!hasTicker || !hasShares || !hasAvgCost) {
        throw new Error("testHoldings ต้องมี ticker: 'AAPL', shares: 40, avgCost: 178.00 อยู่ภายใน object เดียวกันจริง");
      }
      log("✓ แยก Test Data ออกจาก Logic ถูกต้อง");
    },
    hint: "แยกข้อมูลออกจาก logic การทดสอบ — ประกาศค่าคงที่เป็น object เดียวเก็บทุก field ที่ test ต้องใช้ซ้ำ",
    solution: `export const testHoldings = {
  ticker: 'AAPL',
  shares: 40,
  avgCost: 178.00,
};`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Test Data Management: แยกข้อมูลทดสอบออกจาก Logic การทดสอบ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ประโยชน์เพิ่มเติม: เมื่อข้อมูลจริง (เช่นโครงสร้าง Holdings ของ My-Investment-Port ที่ track DB Design & SQL ใช้สอน) เปลี่ยนแปลง (เพิ่ม field ใหม่) แก้ไฟล์ test data จุดเดียว ไม่ต้องไล่แก้ hardcoded value กระจายอยู่ทั่วโปรเจก<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>หลักการ <strong>Test Data Management</strong> ที่ดี: แยก "ข้อมูล" (ticker, ราคา, จำนวน) ออกจาก "ตรรกะการทดสอบ" (การกระทำ + การตรวจสอบ) โดยเก็บข้อมูลไว้ใน object/ไฟล์แยกต่างหาก (มักอยู่ใน <code>fixtures/</code> ตามโครงสร้างที่เคยพูดถึง) แล้ว <code>import</code> เข้ามาใช้ในไฟล์ test — เปลี่ยนข้อมูลทดสอบจุดเดียว ทุก test ที่ import ไปใช้จะได้ค่าใหม่โดยอัตโนมัติ<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า test ไหน mutate <code>testHoldings</code> ตรงๆ (เช่น <code>testHoldings.shares = 50</code>) ค่าที่เปลี่ยนจะกระทบทุก test อื่นที่ import object เดียวกันไปใช้ต่อ (module cache แชร์ reference เดียวกัน) ควร clone ด้วย <code>{ ...testHoldings }</code> ก่อน mutate เสมอ`,
    example: `// ตัวอย่างใช้ test data ที่แยกไว้ในไฟล์ test จริง
import { testHoldings } from '../fixtures/testHoldings';

test('เพิ่ม Holding ใหม่', async ({ page }) => {
  await page.getByTestId('ticker-input').fill(testHoldings.ticker);
  await page.getByTestId('shares-input').fill(String(testHoldings.shares));
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>testHoldings</code> object<br/>
    2. มี key <code>ticker: 'AAPL'</code>, <code>shares: 40</code>, <code>avgCost: 178.00</code>`
  },
  {
    id: "reporting_config",
    meta: "บทที่ 5",
    title: "Reporting: ตั้งค่ารายงานผลให้อ่านง่ายทั้งคนและ CI",
    template: `// สถานการณ์: อยากได้รายงานผล test แบบ HTML ดูง่าย (สำหรับคน) และ JSON (สำหรับ CI/dashboard อื่น)
// 1. ตั้งค่า reporter ใน playwright.config.ts ให้มีทั้ง 'html' และ 'json' พร้อมกัน
//    JSON output ให้เขียนไปที่ 'results.json'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Reporter...");
      const clean = stripComments(code);
      // Anchor 'html'/'json'/outputFile to be inside the reporter: [...] array itself,
      // not just present anywhere in the file.
      const block = extractBalancedBlock(clean, /reporter:\s*\[/, "[", "]");
      if (!block) {
        throw new Error("ไม่พบการตั้งค่า reporter: [...]");
      }
      const hasHtml = /['"]html['"]/.test(block);
      const hasJson = /['"]json['"]/.test(block);
      const hasOutputFile = /outputFile:\s*['"]results\.json['"]/.test(block);
      if (!hasHtml || !hasJson) {
        throw new Error("reporter ต้องมีทั้ง 'html' และ 'json' อยู่ภายใน reporter: [...] เดียวกันจริง");
      }
      if (!hasOutputFile) {
        throw new Error("ไม่พบ outputFile: 'results.json' ภายใน reporter: [...]");
      }
      log("✓ ตั้งค่า Reporter ถูกต้อง");
    },
    hint: "reporter รับ array ของ [ชื่อ reporter, options] ได้หลายตัวพร้อมกัน ตัวที่มี option เพิ่มเติมให้ใส่เป็น tuple [name, { ... }]",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'results.json' }],
  ],
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Reporting: ตั้งค่ารายงานผลให้อ่านง่ายทั้งคนและ CI และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การตั้งค่าหลาย reporter พร้อมกันไม่ได้ทำให้ test รันช้าลง (reporter แค่ฟังผลลัพธ์ที่ test สร้างแล้วจัดรูปแบบส่งออกคนละแบบ ไม่ใช่รัน test ซ้ำ) — เป็นวิธีที่คุ้มค่าที่สุดในการตอบโจทย์ทั้ง "คนอยากดูสวยๆ" และ "ระบบอยากได้ข้อมูลดิบไปประมวลผลต่อ" พร้อมกันในคำสั่งเดียว<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>reporter: [</code><br/>
<code>&nbsp;&nbsp;['html'],</code><br/>
<code>&nbsp;&nbsp;['json', { outputFile: 'results.json' }],</code><br/>
<code>],</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมห่อแต่ละ reporter เป็น tuple <code>[ชื่อ, options]</code> แล้วใส่ <code>outputFile</code> ผิดตำแหน่ง (เช่นแปะไว้นอก array ของ <code>'json'</code>) จะทำให้ Playwright ไม่รู้ว่า option นี้เป็นของ reporter ตัวไหน`,
    example: `// ตัวอย่างเพิ่ม reporter บรรทัด (สรุปสั้นๆ ใน terminal ระหว่างรัน) เข้าไปด้วย
reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'results.json' }],
],`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า <code>reporter</code> ให้มีทั้ง <code>'html'</code> และ <code>'json'</code><br/>
    2. <code>json</code> reporter ตั้ง <code>outputFile: 'results.json'</code>`
  },
  {
    id: "advanced_retry_wrapper",
    meta: "ขั้นสูง 1",
    title: "Retry Wrapper: ห่อฟังก์ชัน Async ให้ลองใหม่อัตโนมัติเมื่อ Fail",
    template: `// สถานการณ์: บาง test เรียกของที่ flaky โดยธรรมชาติ (เช่น API เช็คสถานะ, WebSocket connect)
// เขียน try/catch วนลองใหม่ซ้ำในทุกไฟล์ test เป็นภาระ — ต้องการ wrapper กลางที่ใช้ซ้ำได้
//
// สเปค:
// 1. ประกาศ async function ชื่อ retry รับ 3 พารามิเตอร์ (fn, retries, delayMs)
//    - fn คือ async function ที่ไม่รับ argument (เรียกแค่ fn())
//    - retries คือจำนวนครั้งสูงสุดที่ "เรียก fn" ทั้งหมด (นับรวมครั้งแรก)
//    - delayMs คือเวลาหน่วง (ms) ก่อนลองเรียกใหม่ทุกครั้งที่ fail
// 2. เรียก fn() ถ้าสำเร็จ ให้ return ค่านั้นออกไปทันที ไม่ต้องลองซ้ำอีก
// 3. ถ้า fn() throw ให้รอ delayMs แล้วเรียก fn() ใหม่ (นับเป็นอีก 1 ครั้ง)
// 4. ถ้าเรียกครบ retries ครั้งแล้วยัง fail ทุกครั้ง ให้ throw error ล่าสุดออกไป
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ retry() wrapper...");
      let retryFn;
      // Shadow setTimeout with an immediate-callback stand-in: keeps the test fast
      // (no real waiting) and keeps it working even in a bare execution context
      // that has no host-provided timer API of its own (unlike the real browser).
      const instantSetTimeout = (cb) => {
        cb();
        return 0;
      };
      try {
        retryFn = execLearnerCode(code, { setTimeout: instantSetTimeout }, 'typeof retry === "function" ? retry : undefined');
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะโหลด: ${err.message}`);
      }
      if (typeof retryFn !== "function") {
        throw new Error("ไม่พบการประกาศ function retry(fn, retries, delayMs)");
      }
      log("✓ พบฟังก์ชัน retry แล้ว กำลังทดสอบพฤติกรรมจริงแบบ async...");
      // retry() is inherently asynchronous (it must await the wrapped fn and any
      // delay), so real behavioral verification can't finish synchronously. We do
      // a synchronous structural gate above (so a missing/broken retry fails
      // immediately, as this playground's engine expects), then hand back a
      // Promise that actually calls the learner's function with fake async
      // dependencies and checks the real outcome.
      return (async () => {
        let calls = 0;
        const fakeFn = async () => {
          calls++;
          if (calls < 3) throw new Error(`fail#${calls}`);
          return "success-value";
        };
        const result = await retryFn(fakeFn, 5, 0);
        if (calls !== 3) {
          throw new Error(`fn ควรถูกเรียกจนสำเร็จรวม 3 ครั้ง (fail 2 ครั้งแรก, สำเร็จครั้งที่ 3) แต่ถูกเรียก ${calls} ครั้ง`);
        }
        if (result !== "success-value") {
          throw new Error(`retry() ต้อง return ค่าที่ fn() คืนตอนสำเร็จ ('success-value') แต่ได้ ${result}`);
        }

        let calls2 = 0;
        const alwaysFail = async () => {
          calls2++;
          throw new Error("always-fail");
        };
        let threw = false;
        let thrownMessage = "";
        try {
          await retryFn(alwaysFail, 3, 0);
        } catch (e) {
          threw = true;
          thrownMessage = e.message;
        }
        if (!threw) {
          throw new Error("เมื่อ fn fail ทุกครั้งจนครบ retries แล้ว retry() ต้อง throw error ล่าสุดออกไป ไม่ใช่ resolve เงียบๆ");
        }
        if (thrownMessage !== "always-fail") {
          throw new Error(`error ที่ throw ออกมาควรเป็น error ล่าสุดจาก fn() ('always-fail') แต่ได้ '${thrownMessage}'`);
        }
        if (calls2 !== 3) {
          throw new Error(`เมื่อ retries=3 และ fn fail ทุกครั้ง ต้องเรียก fn ทั้งหมด 3 ครั้งพอดี แต่ถูกเรียก ${calls2} ครั้ง`);
        }
        log("✓ retry() ทำงานถูกต้องจริง: ลองใหม่จนสำเร็จได้ และ throw เมื่อ fail ครบจำนวนครั้ง");
      })();
    },
    hint: "ใช้ for loop นับจำนวนครั้งที่ลอง ในแต่ละรอบ await fn() ภายใน try/catch — สำเร็จก็ return ค่าออกไปทันที, fail ก็เก็บ error ล่าสุดไว้แล้ว await การหน่วงเวลาด้วย Promise + setTimeout ก่อนวนรอบถัดไป พอครบจำนวนรอบที่กำหนดแล้วยัง fail ให้ throw error ที่เก็บไว้ล่าสุด",
    solution: `async function retry(fn, retries, delayMs) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Retry Wrapper: ห่อฟังก์ชัน Async ให้ลองใหม่อัตโนมัติเมื่อ Fail และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Automation ที่คุยกับระบบภายนอก (API เรียกเช็คสถานะ, WebSocket, third-party service) มักเจอ<strong>ความ flaky ตามธรรมชาติ</strong> ที่ไม่ใช่บั๊กของแอปเรา (network glitch ชั่วคราว, service ยังไม่พร้อมตอบ) — เขียน <code>try/catch</code> วนลองใหม่ในทุกจุดที่เรียกของแบบนี้เป็นโค้ดซ้ำที่ scale ไม่ได้ (DRY เดิมจากบทก่อนหน้า ใช้หลักการเดียวกัน)<br/><br/>
    <strong>Retry wrapper</strong> คือฟังก์ชันกลางที่ "ห่อ" ฟังก์ชัน async ใดๆ ให้มีพฤติกรรม ลองใหม่อัตโนมัติเมื่อ fail โดยรับพารามิเตอร์ควบคุม: จำนวนครั้งสูงสุด (<code>retries</code>) และเวลาหน่วงระหว่างรอบ (<code>delayMs</code>) — การหน่วงเวลาสำคัญเพราะถ้าลองซ้ำทันทีไม่หน่วงเลย อาจยิงถล่ม service ที่กำลังมีปัญหาซ้ำเข้าไปอีก (thundering herd)<br/><br/>
    หลักการสำคัญที่ทำให้ wrapper นี้ "ถูกต้อง": (1) สำเร็จเมื่อไหร่ต้องหยุดทันที ไม่ลองต่อให้เสียเวลา (2) ต้องนับจำนวนครั้งให้ตรงตาม <code>retries</code> พอดี ไม่มากไม่น้อยกว่าที่กำหนด (3) เมื่อหมดโอกาสแล้วต้อง throw error ตัวล่าสุดออกไป ไม่ใช่กลืน error เงียบๆ (เพราะ test framework ต้องรู้ว่าสุดท้ายแล้วมันยัง fail อยู่จริง)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>for (let attempt = 1; attempt &lt;= retries; attempt++) {</code><br/>
<code>&nbsp;&nbsp;try { return await fn(); }</code><br/>
<code>&nbsp;&nbsp;catch (err) { lastError = err; }</code><br/>
<code>}</code><br/>
<code>throw lastError;</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม <code>await</code> ตอนหน่วงเวลาด้วย <code>setTimeout</code> จะทำให้ loop ยิง retry ถัดไปทันทีโดยไม่รอจริง หรือลืม throw <code>lastError</code> หลัง loop จบ ทำให้ฟังก์ชัน return <code>undefined</code> เงียบๆ แทนที่จะแจ้ง error ว่ายัง fail อยู่`,
    example: `// ตัวอย่างใช้ retry ห่อ API call ที่ flaky ในไฟล์ test จริง
const health = await retry(
  () => fetch('/api/health').then((r) => r.json()),
  3,
  500
);
expect(health.status).toBe('ok');`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>async function retry(fn, retries, delayMs)</code><br/>
    2. เรียก <code>fn()</code> สำเร็จเมื่อไหร่ให้ return ค่าออกไปทันที<br/>
    3. fail ให้รอ <code>delayMs</code> แล้วลองใหม่ นับรวมไม่เกิน <code>retries</code> ครั้ง<br/>
    4. ครบจำนวนครั้งแล้วยัง fail ให้ throw error ล่าสุดออกไป`
  },
  {
    id: "advanced_test_data_factory",
    meta: "ขั้นสูง 2",
    title: "Test Data Factory: สร้าง Mock Object ใหม่ทุกครั้งพร้อม Unique ID",
    template: `// สถานการณ์: หลาย test ต้องการ "ผลลัพธ์ test case" ปลอมไว้ mock ข้อมูล
// ถ้าทุก test ใช้ object เดิมซ้ำ อาจชนกัน (id ซ้ำ, test หนึ่ง mutate ค่าไปกระทบอีก test)
// จึงต้องมี factory function ที่สร้าง object ใหม่ให้ทุกครั้งที่เรียก
//
// สเปค:
// 1. ประกาศ function ชื่อ createTestCaseResult ไม่รับ argument
// 2. ทุกครั้งที่เรียก ต้อง return object ใหม่ (คนละ reference กัน) ที่มีอย่างน้อย field:
//    - id: ต้อง unique ไม่ซ้ำกันในแต่ละครั้งที่เรียก (เช่น counter ที่เพิ่มขึ้นเรื่อยๆ)
//    - status: ตั้งค่าเริ่มต้นเป็น 'pending'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ createTestCaseResult() factory (เรียกจริงหลายครั้งเพื่อเช็ค id ไม่ซ้ำ)...");
      let factoryFn;
      try {
        factoryFn = execLearnerCode(code, {}, 'typeof createTestCaseResult === "function" ? createTestCaseResult : undefined');
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
      }
      if (typeof factoryFn !== "function") {
        throw new Error("ไม่พบการประกาศ function createTestCaseResult()");
      }
      const results = [factoryFn(), factoryFn(), factoryFn()];
      results.forEach((r, idx) => {
        if (!r || typeof r !== "object") {
          throw new Error(`การเรียกครั้งที่ ${idx + 1} ต้อง return object`);
        }
        if (r.status !== "pending") {
          throw new Error(`การเรียกครั้งที่ ${idx + 1} ต้องมี status เป็น 'pending' เป็นค่าเริ่มต้น`);
        }
      });
      if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        throw new Error("แต่ละครั้งที่เรียก createTestCaseResult() ต้อง return object ใหม่ (คนละ reference) ไม่ใช่ object เดิมซ้ำ");
      }
      const ids = results.map((r) => r.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        throw new Error(`id ต้อง unique ทุกครั้งที่เรียก แต่ได้ id ซ้ำกัน: ${ids.join(", ")}`);
      }
      log("✓ factory สร้าง object ใหม่พร้อม id ไม่ซ้ำกันได้จริง");
    },
    hint: "เก็บตัวนับ (counter) ไว้นอกฟังก์ชันในตัวแปรที่ persist ข้ามการเรียก แล้วเพิ่มค่าก่อน return object ใหม่ทุกครั้ง (หรือใช้ timestamp/random ที่การันตีไม่ซ้ำก็ได้) — อย่าลืม return object literal ใหม่ทุกครั้ง ห้าม return ตัวแปร object เดิมซ้ำ",
    solution: `let __testCaseCounter = 0;

function createTestCaseResult() {
  __testCaseCounter += 1;
  return {
    id: __testCaseCounter,
    status: 'pending',
  };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Test Data Factory</strong> คือรูปแบบหนึ่งของ Test Data Management (บทที่ 4) ที่ลึกกว่าการแยกค่าคงที่ธรรมดา — เมื่อ test ต้องการ "ของปลอม" ที่มีสถานะเปลี่ยนแปลงได้ (mutate ได้ระหว่าง test) การใช้ object เดิมซ้ำๆ ข้ามหลาย test เป็นบ่อเกิดของบั๊กที่ตามยากที่สุดแบบหนึ่ง: <strong>test A แก้ค่าใน object แล้ว test B ที่รันทีหลังเจอค่าที่เพี้ยนไปจาก test A โดยไม่รู้ตัว (state leak ข้าม test)</strong><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Factory function แก้ปัญหานี้ด้วยการ<strong>สร้าง object ใหม่ทุกครั้งที่ถูกเรียก</strong> (ไม่ return reference เดิมซ้ำ) พร้อม<strong>ค่า id ที่ไม่ซ้ำกัน</strong> — id ที่ unique สำคัญเพราะเวลา assert หรือ track ผลลัพธ์หลาย test case พร้อมกัน (เช่นรัน parallel) การมี id ชนกันจะทำให้แยกไม่ออกว่าผลลัพธ์ไหนเป็นของ test ไหน<br/><br/><br/>วิธีการันตี unique ที่ใช้บ่อย:ตัวนับ (counter) ที่เพิ่มค่าทุกครั้ง (เรียบง่าย คาดเดาลำดับได้) หรือค่าสุ่ม/timestamp ที่ชนกันยากมาก (เหมาะกับกระจาย test ข้ามหลาย process/worker ที่ไม่แชร์ตัวนับกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>let __testCaseCounter = 0;</code><br/>
<code>function createTestCaseResult() {</code><br/>
<code>&nbsp;&nbsp;__testCaseCounter += 1;</code><br/>
<code>&nbsp;&nbsp;return { id: __testCaseCounter, status: 'pending' };</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า return object เดิมที่ประกาศไว้นอกฟังก์ชัน (แทนที่จะสร้าง object literal <code>{ ... }</code> ใหม่ทุกครั้ง) ทุกการเรียกจะได้ reference เดียวกัน — test หนึ่ง mutate ค่าจะกระทบอีก test ที่เรียก factory ไปก่อนหน้าโดยไม่รู้ตัว`,
    example: `// ตัวอย่างใช้ factory สร้าง test case ปลอมหลายตัวไม่ชนกันในไฟล์ test จริง
const tc1 = createTestCaseResult();
const tc2 = createTestCaseResult();
console.log(tc1.id, tc2.id); // ตัวเลขต่างกันเสมอ ไม่ว่าจะเรียกกี่ครั้ง`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function createTestCaseResult()</code><br/>
    2. ทุกครั้งที่เรียก ต้อง return object ใหม่ (คนละ reference)<br/>
    3. object ต้องมี <code>id</code> ที่ไม่ซ้ำกันในแต่ละครั้ง และ <code>status: 'pending'</code>`
  },
  {
    id: "pom_design_principles",
    meta: "ขั้นสูง 3",
    title: "POM Design: แยก Action Method ออกจาก Verify Method อย่างมีวินัย",
    template: `// สถานการณ์จริง: HoldingsPage.ts ของ My-Investment-Port (tests/web-testing/pages/port/holdings/holdingsPage.ts)
// แยกหน้าที่ของ method อย่างชัดเจน: method ที่ "กระทำ" (เช่น searchTicker) ไม่มี assertion อยู่ข้างในเลย
// ส่วน method ที่ตั้งใจ "ตรวจผล" (ตั้งชื่อขึ้นต้นด้วย verify) เท่านั้นที่มี expect() — เพื่อให้อ่านชื่อ method รู้ทันทีว่ามันจะ assert หรือแค่กระทำ
// เขียน class HoldingsPage ให้มี 2 method ตามนี้:
// 1. async searchTicker(ticker) — เรียก this.searchInput.fill(ticker) เท่านั้น ห้ามมี expect()
// 2. async verifyHoldingInTable(ticker) — เรียก this.getHoldingRow(ticker) แล้ว expect(...).toBeVisible()
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแยก Action Method และ Verify Method ใน POM...");
      const clean = stripComments(code);
      const searchBlock = extractBalancedBlock(clean, /searchTicker\s*\(\s*ticker\s*\)\s*\{/, "{", "}");
      if (!searchBlock) {
        throw new Error("ไม่พบ method searchTicker(ticker) { ... } ที่ครบถ้วน");
      }
      if (!/this\.searchInput\.fill\(\s*ticker\s*\)/.test(searchBlock)) {
        throw new Error("searchTicker(ticker) ต้องเรียก this.searchInput.fill(ticker)");
      }
      if (/expect\(/.test(searchBlock)) {
        throw new Error("searchTicker(ticker) เป็น action method ต้อง 'กระทำ' อย่างเดียว ห้ามมี expect() ปนอยู่ข้างใน — ผิดหลักการแยก action ออกจาก verify");
      }
      const verifyBlock = extractBalancedBlock(clean, /verifyHoldingInTable\s*\(\s*ticker\s*\)\s*\{/, "{", "}");
      if (!verifyBlock) {
        throw new Error("ไม่พบ method verifyHoldingInTable(ticker) { ... } ที่ครบถ้วน");
      }
      if (!/expect\(\s*this\.getHoldingRow\(\s*ticker\s*\)\s*\)\s*\.\s*toBeVisible\(\)/.test(verifyBlock)) {
        throw new Error("verifyHoldingInTable(ticker) ต้องมี expect(this.getHoldingRow(ticker)).toBeVisible()");
      }
      log("✓ แยก Action Method และ Verify Method ตามหลัก POM ถูกต้อง");
    },
    hint: "method ที่แค่ 'ทำ' อย่าง fill/click ไม่ควรตัดสินผ่าน/ไม่ผ่านเอง ปล่อยให้ test เป็นคนตัดสินผ่าน expect() แทน — ส่วน method ที่ตั้งชื่อสื่อว่า verify (หรือ getXxx สำหรับดึงค่า) เท่านั้นที่ควรมี expect() ซ่อนอยู่ข้างใน เพื่อให้อ่านชื่อ method แล้วรู้ทันทีว่าจะ assert หรือเปล่า",
    solution: `class HoldingsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search ticker');
  }

  getHoldingRow(ticker) {
    return this.page.getByTestId('holding-row-' + ticker);
  }

  async searchTicker(ticker) {
    await this.searchInput.fill(ticker);
  }

  async verifyHoldingInTable(ticker) {
    await expect(this.getHoldingRow(ticker)).toBeVisible();
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>HoldingsPage.ts</code> ของ My-Investment-Port (<code>tests/web-testing/pages/port/holdings/holdingsPage.ts</code>) มี method <code>searchTicker(ticker)</code> ที่กรอกช่องค้นหาอย่างเดียว ไม่มี assertion ใดๆ ข้างใน และมี method <code>verifyHoldingInTable(ticker)</code>, <code>verifyDcaAmount(ticker, ...)</code> ที่ตั้งชื่อขึ้นต้นด้วย <code>verify</code> โดยเฉพาะ และมี <code>expect()</code> อยู่ข้างในเท่านั้น — เปิดไฟล์จริงแล้วจะเห็นรูปแบบนี้ทั้งไฟล์<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Real grounding:</strong> <code>HoldingsPage.ts</code> ของ My-Investment-Port (<code>tests/web-testing/pages/port/holdings/holdingsPage.ts</code>) มี method <code>searchTicker(ticker)</code> ที่กรอกช่องค้นหาอย่างเดียว ไม่มี assertion ใดๆ ข้างใน และมี method <code>verifyHoldingInTable(ticker)</code>, <code>verifyDcaAmount(ticker, ...)</code> ที่ตั้งชื่อขึ้นต้นด้วย <code>verify</code> โดยเฉพาะ และมี <code>expect()</code> อยู่ข้างในเท่านั้น — เปิดไฟล์จริงแล้วจะเห็นรูปแบบนี้ทั้งไฟล์<br/><br/>
    หลักการ <strong>POM Design</strong> ที่มักถูกเข้าใจผิดว่า "ห้ามมี expect() ใน Page Object เด็ดขาด" — ในทางปฏิบัติจริง (ตามไฟล์นี้) ไม่ได้เข้มงวดขนาดนั้น: <strong>action method</strong> (คลิก, กรอกฟอร์ม, navigate) ไม่ควรมี assertion เพราะมันคือ "การกระทำ" ไม่ใช่ "การตัดสิน" — แต่ method ที่<strong>ตั้งใจให้เป็นตัวตรวจผล</strong>และตั้งชื่อสื่อความหมายชัดเจน (ขึ้นต้นด้วย <code>verify</code>) การมี <code>expect()</code> ข้างในเป็นที่ยอมรับได้ เพราะชื่อ method บอกไว้ตรงๆ แล้วว่ามันจะ assert<br/><br/>
    ปัญหาจริงที่หลักการนี้ป้องกัน: ถ้า <code>searchTicker()</code> แอบมี <code>expect()</code> ซ่อนอยู่ข้างใน คนอ่าน test ที่เห็นแค่ <code>await holdingsPage.searchTicker('AAPL')</code> จะไม่รู้เลยว่าบรรทัดนี้ "อาจ fail จากการ assert" ด้วย — ต้องเปิดไปดูข้างใน Page Object ถึงจะรู้ ทำให้ debug ยากขึ้นโดยไม่จำเป็น<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>async searchTicker(ticker) {</code><br/>
<code>&nbsp;&nbsp;await this.searchInput.fill(ticker); // ไม่มี expect()</code><br/>
<code>}</code><br/>
<code>async verifyHoldingInTable(ticker) {</code><br/>
<code>&nbsp;&nbsp;await expect(this.getHoldingRow(ticker)).toBeVisible();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าแอบใส่ <code>expect()</code> ไว้ใน action method อย่าง <code>searchTicker()</code> คนอ่าน test ที่เห็นแค่ <code>await holdingsPage.searchTicker('AAPL')</code> จะไม่รู้เลยว่าบรรทัดนี้อาจ fail จากการ assert ด้วย ต้องแยกให้ action method "กระทำ" เท่านั้น ปล่อยให้ method ที่ขึ้นต้นด้วย <code>verify</code> เป็นตัวเดียวที่มี <code>expect()</code>`,
    example: `// ตัวอย่างใช้งานทั้งสอง method ร่วมกันในไฟล์ test จริง
const holdingsPage = new HoldingsPage(page);
await holdingsPage.searchTicker('AAPL');
await holdingsPage.verifyHoldingInTable('AAPL');`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. เขียน method <code>async searchTicker(ticker)</code> เรียก <code>this.searchInput.fill(ticker)</code> เท่านั้น ห้ามมี <code>expect()</code><br/>
    2. เขียน method <code>async verifyHoldingInTable(ticker)</code> เรียก <code>expect(this.getHoldingRow(ticker)).toBeVisible()</code>`
  },
  {
    id: "env_based_config",
    meta: "ขั้นสูง 4",
    title: "Environment-based Config: สลับ Base URL ตาม Environment พร้อม Safety Guard",
    template: `// สถานการณ์จริง: playwright.config.ts ของ My-Investment-Port อ่านค่า BASE_URL จาก environment variable
// เพื่อสลับรัน test ระหว่าง local dev, SIT, staging ได้โดยไม่ต้องแก้โค้ด แล้วมี safety guard กันรัน test พลาดเข้า production
// 1. ประกาศ const baseURL = process.env.BASE_URL || 'http://localhost:5175'
// 2. เขียน if (!baseURL.includes('localhost')) { throw new Error(...) } เป็น safety guard
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Environment-based Config และ Safety Guard...");
      const clean = stripComments(code);
      const hasBaseURL = /const\s+baseURL\s*=\s*process\.env\.BASE_URL\s*\|\|\s*['"]http:\/\/localhost:5175['"]/.test(clean);
      if (!hasBaseURL) {
        throw new Error("ไม่พบ const baseURL = process.env.BASE_URL || 'http://localhost:5175'");
      }
      const guardMatch = /if\s*\(\s*!\s*baseURL\.includes\(\s*['"]localhost['"]\s*\)\s*\)\s*\{([\s\S]*?)\}/.exec(clean);
      if (!guardMatch) {
        throw new Error("ไม่พบ if (!baseURL.includes('localhost')) { ... } เป็น safety guard");
      }
      if (!/throw\s+new\s+Error\(/.test(guardMatch[1])) {
        throw new Error("ภายใน safety guard ต้อง throw new Error(...) เพื่อบล็อกการรัน test");
      }
      log("✓ ตั้งค่า Environment-based Config พร้อม Safety Guard ถูกต้อง");
    },
    hint: "ใช้ process.env.BASE_URL ดึงค่าจาก environment ตอนรัน ถ้าไม่ได้ตั้งไว้เลย fallback ด้วย || ไปที่ localhost — ส่วน guard คือ if ธรรมดาที่เช็คว่า baseURL 'ไม่ใช่' localhost แล้ว throw error ออกไปทันทีก่อนจะปล่อยให้ test รันต่อ",
    solution: `const baseURL = process.env.BASE_URL || 'http://localhost:5175';

if (!baseURL.includes('localhost')) {
  throw new Error(\`🛑 BLOCKED: BASE_URL="\${baseURL}" is not a safe test environment. Tests can only run against localhost.\`);
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>playwright.config.ts</code> ของ My-Investment-Port (<code>tests/web-testing/playwright.config.ts</code>) อ่านค่า baseURL จาก <code>process.env.BASE_URL</code> พร้อม fallback เป็น <code>http://localhost:5175</code> เมื่อไม่ได้ตั้งค่าไว้ — วิธีนี้ทำให้สลับรัน test ข้าม environment (local dev / SIT / staging) ได้โดยแค่เปลี่ยนตัวแปร environment ตอนสั่งรัน ไม่ต้องแก้โค้ด config เลย เช่น <code>BASE_URL=https://sit.example.com npx playwright test</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ไฟล์จริงยังมี <strong>safety guard</strong> ต่อท้ายทันที: ตรวจสอบว่า baseURL หน้าตาเหมือน localhost, 127.0.0.1 หรือ SIT host ที่รู้จักหรือไม่ ถ้าไม่ใช่ (เช่นมีคนตั้ง BASE_URL เป็น URL ของ production โดยไม่ได้ตั้งใจ) จะ throw error หยุดการรันทันที <strong>ก่อน</strong>ที่ test จะเริ่มยิงคำสั่งใดๆ เข้าเว็บจริงเลยด้วยซ้ำ<br/><br/><br/>เหตุผลที่ guard นี้สำคัญ: automation test มักมีการกระทำที่ทำลายข้อมูลได้ (ลบ, แก้ไข, submit ฟอร์ม) — ถ้า environment variable ผิดพลาดแล้ว test ไปรันใส่ production จริงโดยไม่มี guard กันไว้ อาจสร้างความเสียหายที่แก้คืนไม่ได้ การเช็คแบบนี้เป็นด่านป้องกันสุดท้ายที่ทำได้ในระดับ config ก่อนจะไปถึงจุดที่สายเกินไป (บทเรียนนี้ทำให้ตัวตรวจง่ายกว่าไฟล์จริงเล็กน้อย — ไฟล์จริงใช้ regex ครอบคลุมทั้ง localhost, 127.0.0.1 และ SIT host พร้อมกัน หลักการเดียวกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const baseURL = process.env.BASE_URL || 'http://localhost:5175';</code><br/>
<code>if (!baseURL.includes('localhost')) {</code><br/>
<code>&nbsp;&nbsp;throw new Error(\`BLOCKED: \${baseURL} is not safe\`);</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าลืมใส่เครื่องหมาย <code>!</code> หน้า <code>baseURL.includes('localhost')</code> guard จะกลายเป็นบล็อกกรณีที่ปลอดภัย (localhost) แทนที่จะบล็อกกรณีอันตราย (URL อื่นที่ไม่ใช่ localhost) ทำให้ safety guard ทำงานสลับด้านตรงข้ามกับที่ตั้งใจไว้เลย`,
    example: `// รันจริงโดยสลับ environment ผ่าน command line โดยไม่ต้องแก้โค้ด config เลย
// BASE_URL=https://sit.example.com npx playwright test
// BASE_URL=http://localhost:5175 npx playwright test`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>const baseURL = process.env.BASE_URL || 'http://localhost:5175'</code><br/>
    2. เขียน safety guard: ถ้า <code>baseURL</code> ไม่มีคำว่า <code>'localhost'</code> ให้ <code>throw new Error(...)</code>`
  },
  {
    id: "fixture_composition",
    meta: "ขั้นสูง 5",
    title: "Fixture Composition: ให้ Fixture หนึ่งพึ่งพา Fixture อื่นที่สร้างไว้แล้ว",
    template: `// สถานการณ์: ต่อยอดจาก fixture watchlistPage (บทที่ 1) — ตอนนี้หลาย test ต้องการหน้า watchlist ที่ goto ไว้แล้ว "และ" กรองหมวด Technology ไว้ล่วงหน้าด้วย
// แทนที่จะ copy โค้ด goto + filter ไปเขียนซ้ำในทุก test หรือเขียน fixture ใหม่จาก page เปล่าๆ อีกรอบ
// ให้สร้าง fixture ใหม่ที่ "พึ่งพา" fixture watchlistPage ที่มีอยู่แล้วโดยตรง
// สเปค:
// 1. สร้าง fixture ชื่อ filteredWatchlistPage โดยรับ parameter เป็น { watchlistPage } (ไม่ใช่ { page })
// 2. ภายใน fixture ให้เรียก watchlistPage.getByTestId('sector-filter').selectOption('Technology')
// 3. แล้ว await use(watchlistPage) ส่งต่อให้ test
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Fixture Composition (fixture ที่พึ่งพา fixture อื่น)...");
      const clean = stripComments(code);
      const hasExtend = /\.extend\(/.test(clean);
      if (!hasExtend) {
        throw new Error("ไม่พบการใช้ test.extend()");
      }
      const fixtureMatch = /filteredWatchlistPage\s*:\s*async\s*\(\s*\{[^)]*watchlistPage[^)]*\}\s*,\s*use\s*\)\s*=>\s*\{([\s\S]*?)\}/.exec(clean);
      if (!fixtureMatch) {
        throw new Error("ไม่พบ fixture ชื่อ filteredWatchlistPage ที่รับ { watchlistPage } เป็น parameter (ไม่ใช่ { page }) — fixture นี้ต้อง 'พึ่งพา' fixture watchlistPage ที่มีอยู่แล้ว ไม่ใช่เริ่มจาก page เปล่าๆ ใหม่");
      }
      const body = fixtureMatch[1];
      if (!/watchlistPage\.getByTestId\(\s*['"]sector-filter['"]\s*\)\.selectOption\(\s*['"]Technology['"]\s*\)/.test(body)) {
        throw new Error("fixture filteredWatchlistPage ต้องเรียก watchlistPage.getByTestId('sector-filter').selectOption('Technology')");
      }
      if (!/await\s+use\(\s*watchlistPage\s*\)/.test(body)) {
        throw new Error("fixture filteredWatchlistPage ต้อง await use(watchlistPage) ส่งต่อ watchlistPage (ที่ filter แล้ว) ให้ test ใช้งาน ไม่ใช่ use(page) ตัวเปล่า");
      }
      log("✓ Fixture Composition ถูกต้อง: fixture ใหม่พึ่งพา fixture เดิมได้จริง");
    },
    hint: "fixture ใหม่ไม่จำเป็นต้องพึ่งพา built-in page เท่านั้น — สามารถรับ fixture ที่เราสร้างเองไว้ก่อนหน้า (เช่น watchlistPage) เป็น parameter แทนได้เลย Playwright จะจัดลำดับให้เองว่าต้อง setup fixture ที่ถูกพึ่งพาก่อน แล้วค่อย teardown ทีหลังสุด (setup ก่อน teardown หลัง เรียงตามลำดับการพึ่งพา)",
    solution: `import { test as base } from '@playwright/test';

export const test = base.extend({
  watchlistPage: async ({ page }, use) => {
    await page.goto('/watchlist');
    await use(page);
  },
  filteredWatchlistPage: async ({ watchlistPage }, use) => {
    await watchlistPage.getByTestId('sector-filter').selectOption('Technology');
    await use(watchlistPage);
  },
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Fixture Composition: ให้ Fixture หนึ่งพึ่งพา Fixture อื่นที่สร้างไว้แล้ว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทที่ 1 สอนสร้าง fixture ที่พึ่งพา built-in <code>page</code> — แต่ fixture ที่เราสร้างเองก็สามารถ "พึ่งพา fixture อื่นที่เราสร้างไว้ก่อนหน้า" ได้เช่นกัน แค่ตั้งชื่อ fixture นั้นเป็น parameter แทน <code>page</code> ตรงๆ Playwright จะรู้เองจาก dependency graph ว่าต้อง setup ตัวที่ถูกพึ่งพาก่อนเสมอ (ตามเอกสารทางการ Playwright: fixture A ที่พึ่งพา fixture B, B ต้อง setup ก่อน A และ teardown หลัง A เสมอ ไม่ว่าจะพึ่งพากันกี่ชั้นก็ตาม)<br/><br/>
    ประโยชน์เทียบกับเขียน fixture ใหม่จาก <code>page</code> เปล่าๆ ซ้ำ: ไม่ต้องเขียน <code>goto('/watchlist')</code> ซ้ำอีกรอบใน fixture ใหม่ — ต่อยอดจากสิ่งที่มีอยู่แล้วได้ตรงๆ เหมือนฟังก์ชันเรียกฟังก์ชัน ลด logic ที่ต้องดูแลซ้ำซ้อนเมื่อโปรเจกมี fixture หลายสิบตัวที่ทับซ้อนกันบางส่วน<br/><br/>
    ข้อควรระวัง: อย่าพึ่งพาข้ามกันเป็นวงกลม (fixture A พึ่งพา B และ B พึ่งพา A) — Playwright จะตรวจจับและ error ทันทีตอน setup เพราะไม่รู้ว่าจะ setup ตัวไหนก่อน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>export const test = base.extend({</code><br/>
<code>&nbsp;&nbsp;watchlistPage: async ({ page }, use) => { ... },</code><br/>
<code>&nbsp;&nbsp;filteredWatchlistPage: async ({ watchlistPage }, use) => {</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await watchlistPage.getByTestId('sector-filter').selectOption('Technology');</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await use(watchlistPage);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ข้อควรระวัง: อย่าพึ่งพาข้ามกันเป็นวงกลม (fixture A พึ่งพา B และ B พึ่งพา A) — Playwright จะตรวจจับและ error ทันทีตอน setup เพราะไม่รู้ว่าจะ setup ตัวไหนก่อน`,
    example: `// ใช้ filteredWatchlistPage ในไฟล์ test จริง — ได้ทั้ง goto และ filter มาพร้อมแล้ว ไม่ต้องเขียนเอง
import { test } from './fixtures';

test('เห็นเฉพาะหุ้นกลุ่ม Technology', async ({ filteredWatchlistPage }) => {
  await filteredWatchlistPage.getByTestId('watchlist-row').first().isVisible();
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. สร้าง fixture ชื่อ <code>filteredWatchlistPage</code> ที่รับ <code>{ watchlistPage }</code> เป็น parameter<br/>
    2. เรียก <code>watchlistPage.getByTestId('sector-filter').selectOption('Technology')</code><br/>
    3. แล้ว <code>await use(watchlistPage)</code> ส่งต่อให้ test`
  },
  {
    id: "test_step_reporting",
    meta: "ขั้นสูง 6",
    title: "test.step(): แบ่งรายงานผลเป็นขั้นตอนให้อ่านง่ายเมื่อ Test Fail",
    template: `// สถานการณ์: test เพิ่ม Holding ใหม่มีหลายขั้นตอน (login, เพิ่ม holding) เขียนรวมกันเป็น test เดียวยาวๆ
// เวลา fail รายงาน HTML/trace viewer บอกแค่ชื่อ test ทั้งก้อน ไม่รู้ว่า fail ตรงขั้นตอนไหนใน 2 ขั้นตอนนี้
// ใช้ test.step() ห่อแต่ละขั้นตอน ให้รายงานแยกแสดงเป็นสัดส่วนชัดเจน รู้ทันทีว่า fail ที่ step ไหน
// สเปค:
// 1. ห่อขั้นตอนแรกด้วย await test.step('login', async () => { await page.goto('/login'); })
// 2. ห่อขั้นตอนที่สองด้วย await test.step('add holding', async () => { await page.getByTestId('btn-add-holding').click(); })
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ test.step()...");
      const clean = stripComments(code);
      const loginStep = /test\.step\(\s*['"]login['"]\s*,\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\)/.exec(clean);
      if (!loginStep) {
        throw new Error("ไม่พบ test.step('login', async () => { ... })");
      }
      if (!/goto\(\s*['"]\/login['"]\s*\)/.test(loginStep[1])) {
        throw new Error("step 'login' ต้องเรียก page.goto('/login') อยู่ภายใน");
      }
      const addStep = /test\.step\(\s*['"]add holding['"]\s*,\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\)/.exec(clean);
      if (!addStep) {
        throw new Error("ไม่พบ test.step('add holding', async () => { ... })");
      }
      if (!/getByTestId\(\s*['"]btn-add-holding['"]\s*\)\.click\(\)/.test(addStep[1])) {
        throw new Error("step 'add holding' ต้องเรียก page.getByTestId('btn-add-holding').click() อยู่ภายใน");
      }
      if (!/await\s+test\.step\(/.test(clean)) {
        throw new Error("ต้องเรียก test.step() ด้วย await เสมอ (test.step คืน Promise)");
      }
      log("✓ ใช้ test.step() แยกขั้นตอนถูกต้อง");
    },
    hint: "test.step(ชื่อ, async () => { ... }) ห่อโค้ดแต่ละขั้นตอนไว้ข้างใน callback — ต้อง await เพราะมันคืน Promise เสมอ ไม่ว่า callback ข้างในจะทำอะไรก็ตาม ผลลัพธ์คือรายงานและ trace viewer จะแยกแสดงแต่ละ step เป็นก้อนของตัวเอง",
    solution: `import { test } from '@playwright/test';

test('เพิ่ม Holding ใหม่', async ({ page }) => {
  await test.step('login', async () => {
    await page.goto('/login');
  });

  await test.step('add holding', async () => {
    await page.getByTestId('btn-add-holding').click();
  });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>ยืนยันจากเอกสารทางการ Playwright:</strong> <code>test.step(title, body)</code> "Declares a test step that is shown in the report" — แต่ละ step ที่ห่อไว้จะปรากฏเป็นก้อนแยกกันชัดเจนทั้งใน HTML report และ trace viewer แทนที่จะเห็นแค่ log รวมของทั้ง test<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>ยืนยันจากเอกสารทางการ Playwright:</strong> <code>test.step(title, body)</code> "Declares a test step that is shown in the report" — แต่ละ step ที่ห่อไว้จะปรากฏเป็นก้อนแยกกันชัดเจนทั้งใน HTML report และ trace viewer แทนที่จะเห็นแค่ log รวมของทั้ง test<br/><br/>
    <code>test.step()</code> คืนค่าที่ callback ข้างในมัน return ออกมา (ตามเอกสาร: "The method returns the value returned by the step callback") จึงใช้เก็บผลลัพธ์จาก step หนึ่งไปใช้ต่อใน step ถัดไปได้ตรงๆ และรองรับการซ้อน step ข้างในอีก step หนึ่งได้ด้วย (nested step) เหมาะกับขั้นตอนย่อยของขั้นตอนใหญ่<br/><br/>
    ประโยชน์จริงเมื่อ test ยาวและซับซ้อนขึ้น (เช่น login → เพิ่ม holding → ตรวจผลรวม 3 ขั้นตอนขึ้นไป): ถ้าไม่มี step แบ่งไว้ รายงานจะบอกแค่ "test นี้ fail" คนอ่านต้องไล่ดู log ทั้งหมดเองว่า fail ตรงไหน — มี step แบ่งไว้ จะเห็นทันทีว่า step ไหน pass ไปแล้ว step ไหนคือจุดที่ fail จริง (ตัวอย่างนี้ใช้ testid จริงจาก <code>HoldingsPage.ts</code> ของ My-Investment-Port คือ <code>btn-add-holding</code> แต่การห่อด้วย test.step() เองยังไม่ได้ใช้จริงใน test suite ของโปรเจกนั้นตอนนี้ — บทเรียนนี้สอน API ที่ยืนยันถูกต้องจากเอกสารทางการ ประยุกต์กับ testid จริงที่มีอยู่)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>await test.step('login', async () => {</code><br/>
<code>&nbsp;&nbsp;await page.goto('/login');</code><br/>
<code>});</code><br/>
<code>await test.step('add holding', async () => {</code><br/>
<code>&nbsp;&nbsp;await page.getByTestId('btn-add-holding').click();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใส่ <code>await</code> หน้า <code>test.step(...)</code> จะทำให้ step ถัดไปเริ่มทำงานก่อนที่ step ก่อนหน้าจะทำงานเสร็จจริง (เพราะ <code>test.step()</code> คืน Promise เสมอ) ลำดับใน report อาจไม่ตรงกับลำดับที่ต้องการ และ error ข้างในอาจไม่ถูกจับตามที่ควร`,
    example: `// test.step() ซ้อนกันได้ (nested step) และ return ค่าออกมาใช้ต่อได้
const total = await test.step('คำนวณยอดรวม', async () => {
  await test.step('ขั้นตอนย่อย: ดึงราคาล่าสุด', async () => {
    await page.waitForSelector('[data-testid="price-loaded"]');
  });
  return 100;
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ห่อขั้นตอนแรกด้วย <code>await test.step('login', async () => { await page.goto('/login'); })</code><br/>
    2. ห่อขั้นตอนที่สองด้วย <code>await test.step('add holding', async () => { await page.getByTestId('btn-add-holding').click(); })</code>`
  },
  {
    id: "parallel_worker_isolation",
    meta: "ขั้นสูง 7",
    title: "Parallel Worker Isolation: กัน Resource ชนกันข้าม Worker ด้วย workerIndex",
    template: `// สถานการณ์จริง: Playwright รัน test พร้อมกันหลาย worker process (คนละ process แยกกัน) เพื่อความเร็ว
// ถ้าทุก worker ใช้ resource ภายนอกร่วมกัน (เช่น login user เดียวกันเข้า backend เดียวกัน) จะชนกัน:
// worker หนึ่งอาจลบ/แก้ข้อมูลที่อีก worker กำลังใช้ทดสอบอยู่พอดี ทำให้ test flaky แบบสุ่มที่จับยากมาก
// เอกสาร Playwright แนะนำผูก resource กับ testInfo.workerIndex (เลขที่ไม่ซ้ำกันในแต่ละ worker) เพื่อให้แต่ละ worker ได้ resource ของตัวเอง
// สเปค:
// 1. ประกาศ function ชื่อ makeWorkerTestUser รับ 1 พารามิเตอร์ (workerIndex)
// 2. return string โดยต่อคำว่า 'user-' เข้ากับ workerIndex (เช่น workerIndex = 0 ต้องได้ 'user-0', workerIndex = 1 ต้องได้ 'user-1')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ makeWorkerTestUser() (รันจริงเพื่อตรวจว่าแต่ละ worker ได้ user ไม่ชนกัน)...");
      let fn;
      try {
        fn = execLearnerCode(code, {}, 'typeof makeWorkerTestUser === "function" ? makeWorkerTestUser : undefined');
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
      }
      if (typeof fn !== "function") {
        throw new Error("ไม่พบการประกาศ function makeWorkerTestUser(workerIndex)");
      }
      const results = [0, 1, 2].map((i) => fn(i));
      results.forEach((r, idx) => {
        if (r !== `user-${idx}`) {
          throw new Error(`makeWorkerTestUser(${idx}) ควรได้ 'user-${idx}' แต่ได้ ${JSON.stringify(r)}`);
        }
      });
      const uniqueVals = new Set(results);
      if (uniqueVals.size !== results.length) {
        throw new Error("แต่ละ workerIndex ต้องได้ user ที่ไม่ซ้ำกัน (มิฉะนั้น worker คนละตัวจะแย่งใช้ user เดียวกัน)");
      }
      log("✓ makeWorkerTestUser() ทำงานถูกต้องจริง: แต่ละ worker ได้ user ไม่ชนกัน");
    },
    hint: "ผูกค่า workerIndex เข้ากับ string ตรงๆ ไม่ต้องมี logic ซับซ้อนอะไรเลย — ความ 'ไม่ชนกัน' มาจากตัวเลข workerIndex เองที่ Playwright การันตีไว้แล้วว่าแต่ละ worker process จะได้ค่าไม่ซ้ำกัน หน้าที่ของฟังก์ชันนี้แค่เอาเลขนั้นไปแปะท้าย prefix",
    solution: `function makeWorkerTestUser(workerIndex) {
  return \`user-\${workerIndex}\`;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>ยืนยันจากเอกสารทางการ Playwright:</strong> แต่ละ worker process มี isolated browser context ของตัวเองอยู่แล้ว (cookies, storage, in-memory variable ในหน้าเว็บไม่ปนกันข้าม worker) แต่เอกสารเตือนไว้ตรงๆ ว่า "flakiness comes from state that lives outside a single test" — พูดง่ายๆ คือ resource ที่อยู่<strong>นอกเหนือ</strong>ขอบเขตของ browser (เช่น user account ใน backend, แถวข้อมูลใน database) ไม่ได้ isolate ให้อัตโนมัติ ต้องจัดการเอง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>ยืนยันจากเอกสารทางการ Playwright:</strong> แต่ละ worker process มี isolated browser context ของตัวเองอยู่แล้ว (cookies, storage, in-memory variable ในหน้าเว็บไม่ปนกันข้าม worker) แต่เอกสารเตือนไว้ตรงๆ ว่า "flakiness comes from state that lives outside a single test" — พูดง่ายๆ คือ resource ที่อยู่<strong>นอกเหนือ</strong>ขอบเขตของ browser (เช่น user account ใน backend, แถวข้อมูลใน database) ไม่ได้ isolate ให้อัตโนมัติ ต้องจัดการเอง<br/><br/>
    Playwright ให้ค่า <code>testInfo.workerIndex</code> (เลขเริ่มจาก 1 ไม่ซ้ำกันในแต่ละ worker ที่ยังมีชีวิตอยู่) มาเพื่อการนี้โดยเฉพาะ — ตัวอย่างจากเอกสาร: สร้าง test user ชื่อ <code>user-</code> ต่อท้ายด้วยเลข workerIndex ให้แต่ละ worker ได้ user เป็นของตัวเอง ทุก test ที่รันโดย worker เดียวกันใช้ user ตัวเดิมซ้ำได้ (ไม่ต้องสร้างใหม่ทุก test) แต่ worker คนละตัวจะไม่มีวันชนกันเลย เพราะเลข workerIndex การันตีไม่ซ้ำกัน<br/><br/>
    <strong>ความเชื่อมโยงกับความเป็นจริงของโปรเจกนี้:</strong> <code>playwright.config.ts</code> ของ My-Investment-Port ตั้งค่า <code>fullyParallel: false</code> และ <code>workers: 1</code> จริง (รันแบบ serial ทีละ test process เดียว) จึงยังไม่ได้ใช้เทคนิคนี้ตอนนี้ — แต่เป็นเทคนิคมาตรฐานที่เอกสารทางการแนะนำสำหรับวันที่โปรเจกไหนก็ตามขยายไปรัน parallel จริงจัง ไม่ใช่แค่ทฤษฎีลอยๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>function makeWorkerTestUser(workerIndex) {</code><br/>
<code>&nbsp;&nbsp;return \`user-\${workerIndex}\`;</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าใช้ตัวแปร counter ธรรมดาแทน <code>workerIndex</code> เพื่อสร้างชื่อ user ที่ไม่ซ้ำ จะไม่การันตี uniqueness จริง เพราะแต่ละ worker process มีหน่วยความจำแยกกัน ตัวแปร counter ของแต่ละ worker จะเริ่มนับจาก 0 เหมือนกันหมด ต้องใช้ <code>workerIndex</code> ที่ Playwright การันตีไม่ซ้ำข้าม process เท่านั้น`,
    example: `// ใช้ผูกกับ fixture จริงในไฟล์ test (ยืนยัน pattern จากเอกสาร Playwright)
const test = base.extend({
  testUser: async ({}, use, testInfo) => {
    const username = makeWorkerTestUser(testInfo.workerIndex);
    await use(username);
  },
});`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function makeWorkerTestUser(workerIndex)</code><br/>
    2. return string รูปแบบ <code>user-0</code>, <code>user-1</code>, ... ตามค่า <code>workerIndex</code> ที่ส่งเข้ามา (ต่อคำว่า <code>user-</code> กับ workerIndex ตรงๆ)`
  }
];

// Application state

const PREFIX = 'fwk';
const TAB_WIDTH = 2;

function runSandboxCode() {
  const lesson = LESSONS[currentLessonIndex];
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal || !nextLessonBtn || !overlay) return;

  const userCode = textarea.value;
  localStorage.setItem(`${PREFIX}_sandbox_code_${lesson.id}`, userCode);

  terminal.innerHTML = `
    <div class="terminal-line info">npx playwright test ${lesson.id}.spec.ts --project=framework</div>
    <div class="terminal-line text-muted">...................................................</div>
  `;

  setTimeout(() => {
    const outputs = [];
    const log = (msg) => {
      outputs.push(`<div class="terminal-line success">${msg}</div>`);
      terminal.innerHTML += `<div class="terminal-line success">${msg}</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    };

    const onPassed = () => {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
        <div class="terminal-line success">1 passed (89ms)</div>
      `;
      terminal.scrollTop = terminal.scrollHeight;

      setLessonCompleted(lesson.id);

      setTimeout(() => {
        overlay.classList.add('show');

        if (currentLessonIndex < LESSONS.length - 1) {
          nextLessonBtn.innerText = `เรียนรู้บทเรียนถัดไป →`;
          nextLessonBtn.onclick = () => {
            overlay.classList.remove('show');
            selectLesson(currentLessonIndex + 1);
          };
        } else {
          nextLessonBtn.innerText = `🏆 จบหลักสูตรแล้ว! ทบทวนความรู้`;
          nextLessonBtn.onclick = () => {
            overlay.classList.remove('show');
            showGraduationMessage();
          };
        }
      }, 1000);
    };

    const onFailed = (err) => {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed (31ms)</div>
      `;
      terminal.scrollTop = terminal.scrollHeight;
    };

    try {
      // validate() is normally synchronous, but a lesson whose real behavior is
      // inherently async (e.g. testing a retry() wrapper) returns a Promise from
      // its own async check instead. Promise.resolve(...) handles both: a plain
      // return value resolves immediately, a real Promise is awaited properly.
      Promise.resolve(lesson.validate(userCode, log)).then(onPassed).catch(onFailed);
    } catch (err) {
      onFailed(err);
    }
  }, 600);
}

// Show graduation final messages
function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Test Automation Framework Design แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการออกแบบ Config, Custom Fixture, โครงสร้างโฟลเดอร์, DRY Helper, Test Data Management และ Reporting ในงาน QA จริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Test Automation Framework Design');
}


  // Expose the standalone-page contract (see shared/engine.js header comment) as real globals,
  // and register into the shared registry so exam/index.html can load every track's LESSONS
  // side-by-side without a duplicate top-level "const LESSONS" collision across <script> tags.
  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['framework-design'] = { id: 'framework-design', title: 'Test Automation Framework Design', folder: 'Framework-Design', lessons: LESSONS };
})();
