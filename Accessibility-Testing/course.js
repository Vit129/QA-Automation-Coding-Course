// Accessibility (a11y) Testing Interactive Coding Playground Data and Logic
// Grounded in real aria-label/alt/heading usage found in My-Investment-Port's
// src/features/aiInvestment/ (InvestmentTimeline.jsx, AiTeamTab.jsx, QuickBuyWatchlist.jsx).
// axe-core scan and keyboard-navigation lessons teach universal technique (no project-specific
// axe-core setup exists yet in the reference project).

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "Accessibility Testing คืออะไร: ทำไม QA ต้องสนใจ",
    template: `// สถานการณ์: ใช้ @axe-core/playwright สแกนหาปัญหา Accessibility อัตโนมัติ
// 1. import AxeBuilder จาก '@axe-core/playwright'
// 2. รัน analyze() บนหน้าเว็บปัจจุบัน แล้วตรวจสอบว่า violations array ต้องว่างเปล่า (length === 0)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ AxeBuilder...");
      const hasImport = /import\s+AxeBuilder\s+from\s+['"]@axe-core\/playwright['"]/.test(code);
      const hasAnalyze = /new AxeBuilder\(\{\s*page\s*\}\)\s*\.analyze\(\)/.test(code);
      const hasLengthCheck = /violations\.length\)\.toBe\(0\)/.test(code) || /expect\(.*violations.*\)\.toHaveLength\(0\)/.test(code);
      if (!hasImport) {
        throw new Error("ไม่พบ import AxeBuilder from '@axe-core/playwright'");
      }
      if (!hasAnalyze) {
        throw new Error("ไม่พบการรัน new AxeBuilder({ page }).analyze()");
      }
      if (!hasLengthCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า violations.length เป็น 0\nตัวอย่าง: expect(results.violations.length).toBe(0);");
      }
      log("✓ สแกน Accessibility อัตโนมัติถูกต้อง (ไม่มี violation)");
    },
    hint: "import AxeBuilder from '@axe-core/playwright'; แล้ว const results = await new AxeBuilder({ page }).analyze(); expect(results.violations.length).toBe(0);",
    solution: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('หน้าเว็บไม่มี Accessibility violation', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.length).toBe(0);
});`,
    theory: `<strong>Accessibility (a11y) Testing</strong> คือการยืนยันว่าเว็บ/แอปใช้งานได้จริงสำหรับผู้ใช้ที่มีข้อจำกัดทางร่างกาย เช่น ผู้ใช้ screen reader (ตาบอด/สายตาเลือนราง), ผู้ใช้ที่ควบคุมด้วยคีย์บอร์ดอย่างเดียว (มือสั่น/อัมพาต), ผู้ใช้ตาบอดสี — ไม่ใช่แค่ "nice to have" แต่หลายประเทศมีกฎหมายบังคับ (ADA ในสหรัฐ, EN 301 549 ในยุโรป)<br/><br/>
    <strong>WCAG (Web Content Accessibility Guidelines)</strong> คือมาตรฐานกลางที่ทั้งอุตสาหกรรมอ้างอิง แบ่งเป็นระดับ A/AA/AAA — ส่วนใหญ่องค์กรตั้งเป้าที่ <strong>AA</strong><br/><br/>
    เครื่องมือที่ QA ใช้ตรวจสอบอัตโนมัติที่นิยมที่สุดคือ <strong>axe-core</strong> — ผูกกับ Playwright ผ่านแพ็กเกจ <code>@axe-core/playwright</code> สแกนหน้าเว็บทั้งหน้าแล้วรายงาน "violation" (จุดที่ผิดกฎ WCAG) ออกมาเป็น array — ถ้า array นี้ว่างเปล่า แปลว่าผ่านการสแกนอัตโนมัติ (แต่ยังต้องทดสอบด้วยมือเพิ่มเติม เพราะ automated scan จับได้แค่ ~30-50% ของปัญหา a11y ทั้งหมด บทถัดไปจะครอบคลุมสิ่งที่ automated scan จับไม่ได้ทั้งหมด)`,
    example: `// จำกัดสแกนเฉพาะบางส่วนของหน้า (ไม่ใช่ทั้งหน้า)
const results = await new AxeBuilder({ page })
  .include('#main-content')
  .analyze();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. import <code>AxeBuilder</code> จาก <code>@axe-core/playwright</code><br/>
    2. รัน <code>analyze()</code> แล้วตรวจสอบว่า <code>violations.length</code> เป็น <code>0</code>`
  },
  {
    id: "alt_text_check",
    meta: "บทที่ 1",
    title: "Alt Text: รูปภาพต้องมีคำอธิบายสำหรับ Screen Reader",
    template: `// สถานการณ์: AiTeamTab.jsx จริงของ My-Investment-Port มี <img> รูปโปรไฟล์ AI พร้อม alt={name}
// 1. ดึงรูปภาพทั้งหมดในหน้าด้วย page.locator('img')
// 2. วนลูปตรวจสอบว่าทุกรูปต้องมี attribute alt ที่ไม่ใช่ค่าว่าง
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเช็ค alt text ของรูปภาพ...");
      const hasLocator = /page\.locator\(['"]img['"]\)/.test(code);
      const hasCount = /\.count\(\)/.test(code);
      const hasAltCheck = /getAttribute\(['"]alt['"]\)/.test(code);
      const hasTruthyCheck = /toBeTruthy|not\.toBe\(['"]['"]\)/.test(code);
      if (!hasLocator || !hasCount) {
        throw new Error("ไม่พบการดึงรูปภาพทั้งหมดด้วย page.locator('img') และ .count()");
      }
      if (!hasAltCheck) {
        throw new Error("ไม่พบการตรวจสอบ attribute alt\nตัวอย่าง: await images.nth(i).getAttribute('alt')");
      }
      if (!hasTruthyCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า alt text ไม่ว่างเปล่า\nตัวอย่าง: expect(altText).toBeTruthy();");
      }
      log("✓ ตรวจสอบ alt text ของรูปภาพทั้งหมดถูกต้อง");
    },
    hint: "const images = page.locator('img'); const count = await images.count(); วนลูปเช็ค await images.nth(i).getAttribute('alt') ต้อง toBeTruthy()",
    solution: `import { test, expect } from '@playwright/test';

test('รูปภาพทุกรูปต้องมี alt text', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('img');
  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const altText = await images.nth(i).getAttribute('alt');
    expect(altText).toBeTruthy();
  }
});`,
    theory: `<code>alt</code> attribute คือคำอธิบายข้อความสำหรับรูปภาพ — screen reader จะอ่านค่านี้ออกเสียงแทนที่จะข้ามรูปไปเฉยๆ ถ้ารูปไม่มี <code>alt</code> เลย ผู้ใช้ screen reader จะไม่รู้เลยว่ามีรูปอะไรอยู่ตรงนั้น (บางเครื่องอ่านชื่อไฟล์แทน เช่น "img_4821.jpg" ซึ่งไม่มีความหมายอะไร)<br/><br/>
    <strong>Real grounding:</strong> <code>AiTeamTab.jsx</code> ของ My-Investment-Port เขียนถูกต้องอยู่แล้ว:<br/><br/>
    <code>&lt;img src={portrait} alt={name} style={{ ... }} loading="lazy" /&gt;</code><br/><br/>
    สังเกตว่า <code>alt={name}</code> ใช้ชื่อจริงของ AI persona แทนที่จะเป็น <code>alt=""</code> (ค่าว่าง) หรือไม่มี attribute เลย — <code>alt=""</code> ก็มีที่ใช้จริงเหมือนกัน (สำหรับรูปตกแต่งล้วนๆ ที่ไม่มีความหมายต่อเนื้อหา เช่น เส้นแบ่ง/ไอคอนซ้ำ) แต่รูปที่สื่อความหมาย (โปรไฟล์, กราฟ, ไอคอนปุ่ม) ต้องมี <code>alt</code> ที่อธิบายเนื้อหาจริงเสมอ`,
    example: `// ตัวอย่างแยกกรณี alt="" (ตกแต่งล้วน) ออกจากรูปที่ต้องมีคำอธิบาย
const decorativeImages = page.locator('img[alt=""]');
const meaningfulImages = page.locator('img:not([alt=""])');`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ดึงรูปภาพทั้งหมดด้วย <code>page.locator('img')</code><br/>
    2. วนลูปตรวจสอบว่าทุกรูปมี <code>alt</code> ที่ไม่ว่างเปล่า`
  },
  {
    id: "aria_label_check",
    meta: "บทที่ 2",
    title: "ARIA Label: ปุ่มไอคอนอย่างเดียวต้องมีชื่อให้ Screen Reader อ่านได้",
    template: `// สถานการณ์: InvestmentTimeline.jsx จริงมีปุ่ม dropdown เดือน/สัปดาห์ที่แสดงแค่ไอคอน/ตัวเลข ไม่มีข้อความอธิบาย
// จึงต้องมี aria-label กำกับไว้ เช่น aria-label="Select month"
// 1. หาปุ่ม dropdown เดือนด้วย page.getByLabel('Select month')
// 2. ตรวจสอบว่าปุ่มนี้ visible อยู่จริง
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ aria-label หา element...");
      const hasGetByLabel = /page\.getByLabel\(['"]Select month['"]\)/.test(code);
      const hasVisibleCheck = /toBeVisible\(\)/.test(code);
      if (!hasGetByLabel) {
        throw new Error("ไม่พบการใช้ page.getByLabel('Select month')");
      }
      if (!hasVisibleCheck) {
        throw new Error("ไม่พบการตรวจสอบ toBeVisible()");
      }
      log("✓ หา element ผ่าน aria-label ถูกต้อง");
    },
    hint: "await expect(page.getByLabel('Select month')).toBeVisible();",
    solution: `import { test, expect } from '@playwright/test';

test('ปุ่ม dropdown เดือนมี aria-label ที่ถูกต้อง', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Select month')).toBeVisible();
});`,
    theory: `<code>aria-label</code> ให้ "ชื่อที่เข้าถึงได้" (accessible name) กับ element ที่ไม่มีข้อความอธิบายตัวเองชัดเจน (เช่น ปุ่มที่มีแค่ไอคอน 🔍 หรือ dropdown ที่แสดงแค่ตัวเลขเดือน) — screen reader จะอ่านค่า <code>aria-label</code> แทนที่จะอ่านว่า "button" เฉยๆ ซึ่งไม่มีประโยชน์กับผู้ใช้เลย<br/><br/>
    <strong>Real grounding:</strong> <code>InvestmentTimeline.jsx</code> ของ My-Investment-Port มี <code>aria-label="Select month"</code> และ <code>aria-label="Select week"</code> จริงบนปุ่ม dropdown ที่เกี่ยวข้อง — และมีอีกจุดที่น่าสนใจ: <code>aria-label="ค้นหา ticker ในประวัติรายการ"</code> เขียนเป็นภาษาไทยตรงๆ (screen reader ภาษาไทยอ่านได้ถูกต้อง ไม่จำเป็นต้องเป็นภาษาอังกฤษเสมอไป)<br/><br/>
    เทคนิคการทดสอบที่ดี: ใช้ <code>page.getByLabel()</code> แทน CSS selector ตรงๆ — วิธีนี้ทำให้ test <strong>พิสูจน์ accessibility ไปในตัว</strong> เพราะถ้า element หา<strong>ไม่เจอ</strong>ผ่าน <code>getByLabel()</code> แปลว่า <code>aria-label</code> หายไปหรือข้อความไม่ตรง — test จะ fail ทันทีโดยไม่ต้องเขียนเช็คแยกต่างหาก`,
    example: `// ตัวอย่างเช็คปุ่มค้นหาที่มี aria-label ภาษาไทย
await expect(page.getByLabel('ค้นหา ticker ในประวัติรายการ')).toBeVisible();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. หาปุ่มด้วย <code>page.getByLabel('Select month')</code><br/>
    2. ตรวจสอบว่า <code>toBeVisible()</code>`
  },
  {
    id: "keyboard_navigation",
    meta: "บทที่ 3",
    title: "Keyboard Navigation: ใช้งานได้โดยไม่แตะเมาส์เลย",
    template: `// สถานการณ์: ผู้ใช้ที่ควบคุมด้วยคีย์บอร์ดอย่างเดียว ต้องกด Tab ไล่ไปหา element ที่ต้องการได้
// 1. กด Tab (page.keyboard.press('Tab')) เพื่อเลื่อน focus ไปยัง element แรกที่ focusable ได้
// 2. ตรวจสอบว่ามี element ที่ถูก focus อยู่จริง (document.activeElement ไม่ใช่ body)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทดสอบ Keyboard Navigation...");
      const hasTabPress = /page\.keyboard\.press\(['"]Tab['"]\)/.test(code);
      const hasActiveElementCheck = /document\.activeElement\.tagName/.test(code);
      const hasNotBodyCheck = /not\.toBe\(['"]BODY['"]\)/.test(code);
      if (!hasTabPress) {
        throw new Error("ไม่พบการกด Tab ด้วย page.keyboard.press('Tab')");
      }
      if (!hasActiveElementCheck) {
        throw new Error("ไม่พบการเช็ค document.activeElement.tagName\nตัวอย่าง: await page.evaluate(() => document.activeElement.tagName)");
      }
      if (!hasNotBodyCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า activeElement ไม่ใช่ BODY\nตัวอย่าง: expect(tagName).not.toBe('BODY');");
      }
      log("✓ ทดสอบ Keyboard Navigation ถูกต้อง (focus เลื่อนไปยัง element จริง)");
    },
    hint: "await page.keyboard.press('Tab'); const tagName = await page.evaluate(() => document.activeElement.tagName); expect(tagName).not.toBe('BODY');",
    solution: `import { test, expect } from '@playwright/test';

test('กด Tab แล้ว focus เลื่อนไปยัง element ที่ใช้งานได้', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');

  const tagName = await page.evaluate(() => document.activeElement.tagName);
  expect(tagName).not.toBe('BODY');
});`,
    theory: `ผู้ใช้บางกลุ่มไม่สามารถใช้เมาส์ได้เลย (มือสั่น, อัมพาต, หรือแค่ชอบใช้คีย์บอร์ดล้วนก็มี) — ทุกฟังก์ชันบนเว็บต้อง<strong>เข้าถึงได้ด้วยคีย์บอร์ดอย่างเดียว</strong> โดยเฉพาะปุ่ม <code>Tab</code> (เลื่อน focus ไปข้างหน้า), <code>Shift+Tab</code> (ถอยกลับ), <code>Enter</code>/<code>Space</code> (กดปุ่ม)<br/><br/>
    บั๊กที่พบบ่อยที่สุด: Dev ใช้ <code>&lt;div onClick={...}&gt;</code> แทน <code>&lt;button&gt;</code> จริง — คลิกด้วยเมาส์ทำงานได้ปกติ (เพราะ onClick ทำงานกับ div ได้) แต่กด <code>Tab</code> ไล่ไปจะ<strong>ข้าม div นั้นไปเลย</strong> เพราะ <code>&lt;div&gt;</code> ไม่ใช่ focusable element โดย default (ต้องใส่ <code>tabIndex="0"</code> เพิ่มเองถึงจะ focus ได้ และยังต้องเพิ่ม keydown handler สำหรับ Enter/Space เองด้วย เพราะ div ไม่มี native "activate on Enter" เหมือน button)<br/><br/>
    การทดสอบนี้พิสูจน์ระดับพื้นฐานสุด: กด <code>Tab</code> ครั้งเดียวแล้วดูว่า <code>document.activeElement</code> เปลี่ยนจาก <code>&lt;body&gt;</code> ไปเป็น element อื่นจริงหรือไม่ — ถ้ายังเป็น <code>BODY</code> อยู่ แปลว่าไม่มี element ไหน focusable เลยในหน้านั้น (ปัญหาร้ายแรงมาก)`,
    example: `// ตัวอย่างไล่ Tab หลายครั้งแล้วเช็คว่า focus วนกลับมาจุดเดิม (focus trap ทดสอบ modal)
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Tab');
}
const finalTag = await page.evaluate(() => document.activeElement.tagName);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. กด <code>Tab</code> ด้วย <code>page.keyboard.press('Tab')</code><br/>
    2. ตรวจสอบว่า <code>document.activeElement.tagName</code> ไม่ใช่ <code>'BODY'</code>`
  },
  {
    id: "semantic_heading_structure",
    meta: "บทที่ 4",
    title: "Semantic Heading: ลำดับ h1-h6 ต้องไม่กระโดดข้าม",
    template: `// สถานการณ์: AiTeamTab.jsx จริงมี <h2> เป็นหัวข้อ section (ไม่มี h1 ในไฟล์นี้เพราะเป็น component ย่อย)
// 1. ดึง heading ทั้งหมดในหน้าด้วย page.locator('h1, h2, h3, h4, h5, h6')
// 2. ตรวจสอบว่ามี heading อย่างน้อย 1 อันในหน้า (count มากกว่า 0)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบโครงสร้าง Heading...");
      const hasLocator = /page\.locator\(['"]h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6['"]\)/.test(code);
      const hasCountCheck = /toBeGreaterThan\(0\)/.test(code);
      if (!hasLocator) {
        throw new Error("ไม่พบการดึง heading ทั้งหมดด้วย page.locator('h1, h2, h3, h4, h5, h6')");
      }
      if (!hasCountCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า count มากกว่า 0\nตัวอย่าง: expect(count).toBeGreaterThan(0);");
      }
      log("✓ ตรวจสอบโครงสร้าง Heading ถูกต้อง");
    },
    hint: "const headings = page.locator('h1, h2, h3, h4, h5, h6'); const count = await headings.count(); expect(count).toBeGreaterThan(0);",
    solution: `import { test, expect } from '@playwright/test';

test('หน้าเว็บมี semantic heading อย่างน้อย 1 อัน', async ({ page }) => {
  await page.goto('/');
  const headings = page.locator('h1, h2, h3, h4, h5, h6');
  const count = await headings.count();
  expect(count).toBeGreaterThan(0);
});`,
    theory: `<strong>Semantic HTML heading</strong> (<code>&lt;h1&gt;</code> ถึง <code>&lt;h6&gt;</code>) ไม่ใช่แค่เรื่องขนาดตัวอักษร — screen reader ใช้ heading เป็น "สารบัญ" ให้ผู้ใช้กระโดดข้ามไปยัง section ที่สนใจได้ทันที (กด shortcut คีย์เพื่อ "ไป heading ถัดไป" โดยไม่ต้องอ่านทุกอย่างตั้งแต่ต้น)<br/><br/>
    กฎสำคัญ: ลำดับ heading ต้อง<strong>ไม่กระโดดข้าม</strong> เช่นมี <code>&lt;h1&gt;</code> แล้วกระโดดไป <code>&lt;h4&gt;</code> เลยโดยไม่มี <code>h2</code>/<code>h3</code> คั่น — ทำให้โครงสร้าง "สารบัญ" ที่ screen reader สร้างให้อัตโนมัติดูสับสน ไม่สื่อความสัมพันธ์ของเนื้อหาจริง<br/><br/>
    <strong>Real grounding:</strong> <code>AiTeamTab.jsx</code> ของ My-Investment-Port มี <code>&lt;h2 className="text-gradient-mint"&gt;{UI_STRINGS.AI_INV_TEAM_STUDIO_TITLE}&lt;/h2&gt;</code> เป็นหัวข้อ section จริง — ใช้ <code>h2</code> (ไม่ใช่ <code>h1</code>) เพราะ component นี้เป็น section ย่อยของหน้าใหญ่กว่า ซึ่งถูกต้องตามหลัก semantic hierarchy (มี <code>h1</code> เดียวของทั้งหน้าอยู่ระดับบนสุด แล้ว section ย่อยๆ ใช้ <code>h2</code>/<code>h3</code> ไล่ลงมา)`,
    example: `// ตัวอย่างเช็คว่ามี h1 แค่อันเดียวในหน้า (กฎที่เข้มงวดกว่า)
const h1Count = await page.locator('h1').count();
expect(h1Count).toBe(1);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ดึง heading ทั้งหมดด้วย <code>page.locator('h1, h2, h3, h4, h5, h6')</code><br/>
    2. ตรวจสอบว่า count มากกว่า <code>0</code>`
  }
];

// Application state

const PREFIX = 'a11y';
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
    <div class="terminal-line info">npx playwright test ${lesson.id}.spec.ts --project=a11y</div>
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
        <div class="terminal-line success">1 passed (118ms)</div>
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
        <div class="terminal-line error">${err.message.replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed (37ms)</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Accessibility Testing แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการตรวจสอบ axe-core scan, Alt Text, ARIA Label, Keyboard Navigation และ Semantic Heading ในงาน QA จริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}
