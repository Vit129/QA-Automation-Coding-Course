// Test Automation Framework Design Interactive Coding Playground Data and Logic
// The DRY-helpers lesson is grounded in this very course's own real refactor from earlier
// today (extracting shared/engine.js out of 6 near-duplicate course.js files, including the
// real file:// script-loading limitation hit and worked around). Config/fixtures/reporting
// lessons use standard Playwright API conventions; folder-structure follows the pattern
// already used by the Playwright UI Testing track's own POM lesson.

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
      const hasBaseURL = /baseURL:\s*['"]http:\/\/localhost:5173['"]/.test(code);
      if (!hasBaseURL) {
        throw new Error("ไม่พบการตั้งค่า baseURL: 'http://localhost:5173'\nตัวอย่าง: use: { baseURL: 'http://localhost:5173' }");
      }
      log("✓ ตั้งค่า baseURL ถูกต้อง");
    },
    hint: "use: { baseURL: 'http://localhost:5173' }",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
  },
});`,
    theory: `<strong>Test Automation Framework Design</strong> คือการตัดสินใจว่าจะจัดโครงสร้างโปรเจก test อย่างไร ไม่ใช่แค่ "เขียน test แต่ละบทให้ผ่าน" (ซึ่งเป็นสิ่งที่ track อื่นๆ ในคอร์สนี้สอนไปแล้ว) — ปัญหาที่พบบ่อยเมื่อโปรเจก test โตขึ้น: ทุกคนเขียน test ไฟล์ใหม่แบบ copy-paste จากไฟล์เก่า ไม่มีจุดรวมศูนย์ของ config/helper สุดท้ายกลายเป็น "โค้ดซ้ำกระจายไปทุกที่" แก้จุดเดียวต้องไล่แก้เป็นสิบไฟล์<br/><br/>
    <code>playwright.config.ts</code> คือจุดตั้งค่ากลางของทั้งโปรเจก — <code>baseURL</code> ทำให้ทุก test เขียน <code>page.goto('/watchlist')</code> แทนที่จะต้องพิมพ์ URL เต็มซ้ำทุกไฟล์ (<code>page.goto('http://localhost:5173/watchlist')</code>) — ถ้าวันหนึ่ง URL เปลี่ยน (deploy ไป staging environment) แก้ที่ config จุดเดียวจบ ไม่ต้องไล่แก้ทุก test file<br/><br/>
    บทเรียนที่เหลือในเทรคนี้จะครอบคลุม: Custom Fixtures, โครงสร้างโฟลเดอร์, การลดโค้ดซ้ำแบบ DRY, การจัดการ Test Data, และการตั้งค่า Reporting`,
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
      const hasExtend = /\.extend\(/.test(code);
      const hasFixtureName = /watchlistPage:/.test(code);
      const hasGoto = /goto\(['"]\/watchlist['"]\)/.test(code);
      const hasUse = /await use\(/.test(code);
      if (!hasExtend) {
        throw new Error("ไม่พบการใช้ test.extend()");
      }
      if (!hasFixtureName) {
        throw new Error("ไม่พบ fixture ชื่อ watchlistPage");
      }
      if (!hasGoto) {
        throw new Error("fixture ต้องยิง goto('/watchlist')");
      }
      if (!hasUse) {
        throw new Error("ไม่พบการเรียก await use(...) เพื่อส่งค่าต่อให้ test");
      }
      log("✓ สร้าง Custom Fixture ถูกต้อง");
    },
    hint: "export const test = base.extend({ watchlistPage: async ({ page }, use) => { await page.goto('/watchlist'); await use(page); } });",
    solution: `import { test as base } from '@playwright/test';

export const test = base.extend({
  watchlistPage: async ({ page }, use) => {
    await page.goto('/watchlist');
    await use(page);
  },
});`,
    theory: `<strong>Fixture</strong> ของ Playwright คือกลไก "เตรียมของให้ก่อน test เริ่ม แล้วเก็บกวาดให้หลัง test จบ" — <code>page</code>, <code>request</code>, <code>context</code> ที่ใช้กันมาตลอดทั้งคอร์สนี้ ล้วนเป็น built-in fixture ทั้งหมด<br/><br/>
    <code>test.extend()</code> สร้าง fixture ของตัวเองเพิ่มได้ — ในตัวอย่างนี้ <code>watchlistPage</code> ทำ <code>goto('/watchlist')</code> ให้อัตโนมัติ<strong>ก่อน</strong>ที่ code ของ test จะเริ่มทำงาน แล้ว <code>await use(page)</code> คือจุดที่ "ส่งมอบ" ค่าที่เตรียมไว้กลับไปให้ test ใช้งานต่อ (โค้ดหลัง <code>use()</code> จะรันหลัง test จบ เหมาะกับ cleanup)<br/><br/>
    ประโยชน์เทียบกับเขียน <code>beforeEach</code> ซ้ำทุกไฟล์: fixture ประกาศครั้งเดียวในไฟล์กลาง แล้ว <code>import { test } from './fixtures'</code> ใช้ได้ทุกไฟล์ — ทุก test ที่รับ parameter <code>watchlistPage</code> จะได้หน้าที่ goto ไว้แล้วอัตโนมัติ ไม่ต้องเขียน <code>await page.goto('/watchlist')</code> ซ้ำเองในทุก test อีกต่อไป`,
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
      const hasTests = /tests\//.test(code);
      const hasPages = /pages\//.test(code);
      const hasFixtures = /fixtures\//.test(code);
      const hasUtils = /utils\//.test(code);
      if (!hasTests || !hasPages || !hasFixtures || !hasUtils) {
        throw new Error("ต้องระบุครบทั้ง 4 โฟลเดอร์: tests/, pages/, fixtures/, utils/");
      }
      log("✓ ระบุโครงสร้างโฟลเดอร์ครบถ้วนถูกต้อง");
    },
    hint: "// tests/     - ไฟล์ .spec.ts ที่มีแต่ test case\n// pages/     - Page Object class ของแต่ละหน้า\n// fixtures/  - custom fixture และ test data\n// utils/     - helper function ที่ใช้ร่วมกันข้ามไฟล์",
    solution: `// โครงสร้างโฟลเดอร์มาตรฐานของ automation project
// tests/     - ไฟล์ .spec.ts ที่มีแต่ test case (สั้น อ่านง่าย ไม่มี logic ซับซ้อน)
// pages/     - Page Object class ของแต่ละหน้า (WatchlistPage.ts, LoginPage.ts)
// fixtures/  - custom fixture และ test data (seed data, mock response)
// utils/     - helper function ที่ใช้ร่วมกันข้ามไฟล์ (formatDate, generateTestEmail)`,
    theory: `โปรเจก test ที่โตขึ้นโดยไม่มีโครงสร้างชัดเจน มักจบลงที่ไฟล์เดียวยาวเป็นพันบรรทัด รวมทั้ง test case, selector, helper function, test data ปนกันหมด — แก้ selector ตัวเดียวต้องเลื่อนหาทั้งไฟล์<br/><br/>
    โครงสร้างมาตรฐานที่ทีม Playwright ส่วนใหญ่ใช้ (สอดคล้องกับที่ track Playwright UI Testing สอน POM ไปแล้ว แต่ขยายให้เห็นภาพรวมทั้งโปรเจก):<br/><br/>
    • <code>tests/</code> — เก็บเฉพาะไฟล์ <code>.spec.ts</code> ที่มี test case อ่านแล้วเข้าใจ "ทดสอบอะไร" ทันที ไม่ปนรายละเอียดการ implement<br/>
    • <code>pages/</code> — Page Object class แต่ละไฟล์แทนหนึ่งหน้าเว็บ (ตามที่บท POM ของ track Playwright สอนไว้)<br/>
    • <code>fixtures/</code> — custom fixture (จากบทก่อนหน้า) และ seed data สำหรับ test<br/>
    • <code>utils/</code> — ฟังก์ชันช่วยเหลือทั่วไปที่ไม่ผูกกับหน้าใดหน้าหนึ่ง (format วันที่, สร้าง email สุ่มสำหรับ test)<br/><br/>
    หลักการเลือกว่าโค้ดควรอยู่โฟลเดอร์ไหน: <strong>ถ้าโค้ดผูกกับหน้าเว็บหนึ่งหน้า → pages/, ถ้าเป็น setup ที่ test หลายไฟล์ใช้ร่วมกัน → fixtures/, ถ้าเป็น pure function ไม่ผูกกับ Playwright เลย → utils/</strong>`,
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
      log("🔍 ตรวจสอบฟังก์ชัน countCompletedLessons...");
      const hasFunctionDecl = /function\s+countCompletedLessons\s*\(\s*prefix\s*\)/.test(code);
      const hasLoop = /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*localStorage\.length/.test(code);
      const hasMarker = /_course_completed_/.test(code);
      const hasStartsWith = /startsWith\(/.test(code);
      const hasTrueCheck = /===\s*['"]true['"]/.test(code);
      if (!hasFunctionDecl) {
        throw new Error("ไม่พบการประกาศ function countCompletedLessons(prefix)");
      }
      if (!hasLoop) {
        throw new Error("ไม่พบการวนลูปทุก key ด้วย for (let i = 0; i < localStorage.length; i++)");
      }
      if (!hasMarker || !hasStartsWith) {
        throw new Error("ไม่พบการเช็คว่า key ขึ้นต้นด้วย `${prefix}_course_completed_` ผ่าน .startsWith(...)");
      }
      if (!hasTrueCheck) {
        throw new Error("ไม่พบการตรวจสอบว่าค่าของ key เป็น 'true'");
      }
      log("✓ เขียนฟังก์ชัน DRY ที่ reuse ข้าม track ได้จริงถูกต้อง");
    },
    hint: "function countCompletedLessons(prefix) { const marker = `${prefix}_course_completed_`; let count = 0; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && key.startsWith(marker) && localStorage.getItem(key) === 'true') count++; } return count; }",
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
    theory: `<strong>Real grounding แบบที่สุดของบทนี้:</strong> ฟังก์ชันนี้ไม่ใช่ตัวอย่างสมมติ — มันคือโค้ดจริงที่ยกมาจาก <code>index.html</code> ของคอร์สนี้เองเป๊ะๆ (แค่เปลี่ยนชื่อ) หน้า dashboard รวมทุก track ต้องนับความคืบหน้าของ 11 track ที่มีจำนวนบทไม่เท่ากันเลย (API-Testing 13 บท, Visual-Regression 5 บท, ฯลฯ) และ dashboard <strong>ไม่รู้จักเนื้อหาของ track ไหนเลยสักตัว</strong> — สิ่งที่ทำให้ฟังก์ชันเดียวใช้กับทุก track ได้คือทุก track เก็บ progress ด้วย key รูปแบบเดียวกันเป๊ะ: <code>&lt;prefix&gt;_course_completed_&lt;lessonId&gt;</code> = <code>'true'</code><br/><br/>
    นี่คือ DRY ระดับที่ลึกกว่าแค่ "เขียนฟังก์ชันคำนวณเลข" — มันคือการออกแบบ<strong>รูปแบบ key ให้เดายาก reuse ได้ล่วงหน้า</strong> (ทำตั้งแต่ตอนออกแบบแต่ละ track ให้ใช้ prefix ต่างกันแต่โครงสร้างเดียวกัน) แล้วเขียน<strong>ฟังก์ชันเดียวที่พารามิเตอร์ด้วย prefix</strong> แทนที่จะเขียนโค้ดนับแยกทีละ 11 ครั้งสำหรับ 11 track — เพิ่ม track ที่ 12 ในอนาคตก็ไม่ต้องแตะฟังก์ชันนี้เลยแม้แต่บรรทัดเดียว<br/><br/>
    <strong>อุปสรรคที่เจอจริงระหว่างทำ engine.js refactor ของคอร์สนี้ (คนละจุดกับฟังก์ชันนี้ แต่หลักการ DRY เดียวกัน):</strong> ตอนแรกลองรวม engine logic (render lesson list, validate, reset) ที่ซ้ำกัน ~90% ข้าม 11 ไฟล์ course.js ด้วย <code>&lt;script src="../shared/engine.js"&gt;</code> แล้วพบว่า browser บล็อกการโหลด script ข้าม directory ผ่าน <code>file://</code> เงียบๆ — ทางแก้จริงที่ใช้: เก็บไฟล์ต้นฉบับไว้ที่เดียว (<code>shared/engine.js</code>) แล้วมี script sync ก็อปปี้เข้าไปในแต่ละ track folder เป็น <code>engine.js</code> ของตัวเอง (same-directory load ใช้งานได้จริง) — DRY ที่ดีในทางทฤษฎีบางครั้งเจอข้อจำกัดทางเทคนิคจริงที่ต้องหาทางประนีประนอม ไม่ใช่ทำได้ตรงไปตรงมาเสมอไป`,
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
      const hasObjectDecl = /(?:const|export const)\s+testHoldings\s*=\s*\{/.test(code);
      const hasTicker = /ticker:\s*['"]AAPL['"]/.test(code);
      const hasShares = /shares:\s*40/.test(code);
      const hasAvgCost = /avgCost:\s*178(\.0+)?/.test(code);
      if (!hasObjectDecl) {
        throw new Error("ไม่พบการประกาศ testHoldings object");
      }
      if (!hasTicker || !hasShares || !hasAvgCost) {
        throw new Error("testHoldings ต้องมี ticker='AAPL', shares=40, avgCost=178.00 ครบ");
      }
      log("✓ แยก Test Data ออกจาก Logic ถูกต้อง");
    },
    hint: "export const testHoldings = { ticker: 'AAPL', shares: 40, avgCost: 178.00 };",
    solution: `export const testHoldings = {
  ticker: 'AAPL',
  shares: 40,
  avgCost: 178.00,
};`,
    theory: `ค่าคงที่ที่ฝังตรงในโค้ด test (hardcoded value) กระจายอยู่หลายไฟล์ ทำให้แก้ยาก — ถ้าอยากเปลี่ยน ticker ทดสอบจาก AAPL เป็นตัวอื่น ต้องไล่หาทุกไฟล์ที่พิมพ์ <code>'AAPL'</code> ไว้ตรงๆ เสี่ยงพลาดตกหล่นบางจุด<br/><br/>
    หลักการ <strong>Test Data Management</strong> ที่ดี: แยก "ข้อมูล" (ticker, ราคา, จำนวน) ออกจาก "ตรรกะการทดสอบ" (การกระทำ + การตรวจสอบ) โดยเก็บข้อมูลไว้ใน object/ไฟล์แยกต่างหาก (มักอยู่ใน <code>fixtures/</code> ตามโครงสร้างที่เคยพูดถึง) แล้ว <code>import</code> เข้ามาใช้ในไฟล์ test — เปลี่ยนข้อมูลทดสอบจุดเดียว ทุก test ที่ import ไปใช้จะได้ค่าใหม่โดยอัตโนมัติ<br/><br/>
    ประโยชน์เพิ่มเติม: เมื่อข้อมูลจริง (เช่นโครงสร้าง Holdings ของ My-Investment-Port ที่ track DB Design & SQL ใช้สอน) เปลี่ยนแปลง (เพิ่ม field ใหม่) แก้ไฟล์ test data จุดเดียว ไม่ต้องไล่แก้ hardcoded value กระจายอยู่ทั่วโปรเจก`,
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
      const hasReporterArray = /reporter:\s*\[/.test(code);
      const hasHtml = /\[\s*['"]html['"]/.test(code) || /['"]html['"]\s*\]/.test(code);
      const hasJson = /['"]json['"]/.test(code);
      const hasOutputFile = /outputFile:\s*['"]results\.json['"]/.test(code);
      if (!hasReporterArray) {
        throw new Error("ไม่พบการตั้งค่า reporter: [...]");
      }
      if (!hasHtml || !hasJson) {
        throw new Error("reporter ต้องมีทั้ง 'html' และ 'json'");
      }
      if (!hasOutputFile) {
        throw new Error("ไม่พบ outputFile: 'results.json'");
      }
      log("✓ ตั้งค่า Reporter ถูกต้อง");
    },
    hint: "reporter: [['html'], ['json', { outputFile: 'results.json' }]]",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'results.json' }],
  ],
});`,
    theory: `ผลการรัน test มีคนหลายกลุ่มต้องใช้ต่างกัน: <strong>คน</strong> (QA/dev) อยากเห็นรายงานสวยๆ คลิกดู screenshot/trace ของ test ที่ fail ได้ ส่วน<strong>ระบบอื่น</strong> (CI dashboard, Slack notification bot) อยากได้ข้อมูลแบบ machine-readable เพื่อประมวลผลต่อ<br/><br/>
    Playwright รองรับตั้งค่า <code>reporter</code> เป็น<strong>หลายตัวพร้อมกัน</strong>:<br/><br/>
    • <code>'html'</code> — สร้างรายงานหน้าเว็บสวยงาม เปิดดูได้ใน browser มี screenshot/trace ของ test ที่ fail แนบมาให้ทันที เหมาะกับคนดู<br/>
    • <code>'json'</code> พร้อม <code>outputFile</code> — เขียนผลลัพธ์ทั้งหมดเป็นไฟล์ JSON เดียว เหมาะกับให้ CI script อื่นอ่านต่อ (เช่น ส่งสรุปผลเข้า Slack, อัปเดต dashboard ภายนอก)<br/><br/>
    การตั้งค่าหลาย reporter พร้อมกันไม่ได้ทำให้ test รันช้าลง (reporter แค่ฟังผลลัพธ์ที่ test สร้างแล้วจัดรูปแบบส่งออกคนละแบบ ไม่ใช่รัน test ซ้ำ) — เป็นวิธีที่คุ้มค่าที่สุดในการตอบโจทย์ทั้ง "คนอยากดูสวยๆ" และ "ระบบอยากได้ข้อมูลดิบไปประมวลผลต่อ" พร้อมกันในคำสั่งเดียว`,
    example: `// ตัวอย่างเพิ่ม reporter บรรทัด (สรุปสั้นๆ ใน terminal ระหว่างรัน) เข้าไปด้วย
reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'results.json' }],
],`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า <code>reporter</code> ให้มีทั้ง <code>'html'</code> และ <code>'json'</code><br/>
    2. <code>json</code> reporter ตั้ง <code>outputFile: 'results.json'</code>`
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

    try {
      lesson.validate(userCode, log);

      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
        <div class="terminal-line success">1 passed (89ms)</div>
      `;

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

    } catch (err) {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed (31ms)</div>
      `;
    }
    terminal.scrollTop = terminal.scrollHeight;
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
}
