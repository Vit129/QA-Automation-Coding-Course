(function() {
// Accessibility (a11y) Testing Interactive Coding Playground Data and Logic
// Grounded in real aria-label/alt/heading usage found in My-Investment-Port's
// src/features/aiInvestment/ (InvestmentTimeline.jsx, AiTeamTab.jsx, QuickBuyWatchlist.jsx).
// axe-core scan and keyboard-navigation lessons teach universal technique (no project-specific
// axe-core setup exists yet in the reference project).

// ponytail: naive strip (no real JS/HTML parser) — good enough to stop the "answer pasted
// inside a comment" cheese in validate() checks below; not proof against gaming via string
// literals containing the same text (would need a real parser to close that gap).
function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

// WCAG 1.4.3 contrast-ratio math (relative luminance formula), used by the ขั้นสูง 1 lesson
// to genuinely compute contrast instead of pattern-matching a hex value.
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

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
      const clean = stripComments(code);
      const hasImport = /import\s+AxeBuilder\s+from\s+['"]@axe-core\/playwright['"]/.test(clean);
      const hasAnalyze = /new AxeBuilder\(\{\s*page\s*\}\)\s*\.analyze\(\)/.test(clean);
      const hasLengthCheck = /violations\.length\)\.toBe\(0\)/.test(clean) || /expect\(.*violations.*\)\.toHaveLength\(0\)/.test(clean);
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
    hint: "axe-core ให้ class ที่ต้องสร้าง instance โดยส่ง { page } เข้าไปในตัวสร้าง แล้วเรียกเมธอดสแกนแบบ asynchronous บน instance นั้น ผลลัพธ์ที่ได้จะมี array ของปัญหาที่เจอ — ตรวจสอบว่า array นั้นมีความยาวเป็น 0",
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
      const clean = stripComments(code);
      const hasLocator = /page\.locator\(['"]img['"]\)/.test(clean);
      const hasCount = /\.count\(\)/.test(clean);
      const hasAltCheck = /getAttribute\(['"]alt['"]\)/.test(clean);
      // ต้องผูก toBeTruthy()/not.toBe('') เข้ากับตัวแปรที่มาจาก getAttribute('alt') จริง ไม่ใช่แค่คำว่า
      // toBeTruthy() ปรากฏอยู่ที่ไหนก็ได้ในโค้ด (ของเดิมแค่เช็ค substring ลอยๆ ไม่ผูกกับ alt เลย)
      const hasTruthyCheck = /expect\([^)]*\)\.(toBeTruthy\(\)|not\.toBe\(['"]['"]\))/.test(clean);
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
    hint: "ต้องวนลูปตามจำนวนรูปภาพที่เจอทั้งหมด แล้วดึงค่า attribute ที่เก็บคำอธิบายรูปของแต่ละรูปออกมาทีละรูป จากนั้นตรวจสอบด้วย expect ว่าค่าที่ได้ไม่ใช่ค่าว่างเปล่า",
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
      const clean = stripComments(code);
      const hasGetByLabel = /page\.getByLabel\(['"]Select month['"]\)/.test(clean);
      // ผูก toBeVisible() เข้ากับ expect(...getByLabel...) โดยตรง ไม่ใช่แค่เช็คว่ามีคำว่า toBeVisible()
      // ปรากฏลอยๆ ที่ไหนในโค้ดก็ได้ (ของเดิมไม่ผูกกับ element ที่หาเจอเลย)
      const hasVisibleCheck = /expect\(\s*page\.getByLabel\(['"]Select month['"]\)\s*\)\.toBeVisible\(\)/.test(clean);
      if (!hasGetByLabel) {
        throw new Error("ไม่พบการใช้ page.getByLabel('Select month')");
      }
      if (!hasVisibleCheck) {
        throw new Error("ไม่พบการตรวจสอบ toBeVisible() บน element ที่หาเจอผ่าน getByLabel('Select month')");
      }
      log("✓ หา element ผ่าน aria-label ถูกต้อง");
    },
    hint: "Playwright มีวิธีค้นหา element ผ่านชื่อที่เข้าถึงได้ (accessible name) โดยตรง แทนที่จะใช้ CSS selector ทั่วไป — ถ้าใช้แล้วหา element เจอและมันแสดงผลอยู่จริง แปลว่า attribute ที่ให้ชื่อกับ element นั้นถูกตั้งค่าไว้ถูกต้อง",
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
      const clean = stripComments(code);
      const hasTabPress = /page\.keyboard\.press\(['"]Tab['"]\)/.test(clean);
      const hasActiveElementCheck = /document\.activeElement\.tagName/.test(clean);
      // ผูก not.toBe('BODY') ให้ต้องตามหลัง document.activeElement.tagName ในลำดับเดียวกัน (ไม่ใช่แค่
      // สองคำนี้ปรากฏแยกกันคนละที่ในโค้ดโดยไม่เกี่ยวข้องกันเลย)
      const hasNotBodyCheck = /document\.activeElement\.tagName[\s\S]*?\.not\.toBe\(['"]BODY['"]\)/.test(clean);
      if (!hasTabPress) {
        throw new Error("ไม่พบการกด Tab ด้วย page.keyboard.press('Tab')");
      }
      if (!hasActiveElementCheck) {
        throw new Error("ไม่พบการเช็ค document.activeElement.tagName\nตัวอย่าง: await page.evaluate(() => document.activeElement.tagName)");
      }
      if (!hasNotBodyCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า activeElement ไม่ใช่ BODY ต่อเนื่องจากค่าที่ดึงมา\nตัวอย่าง: expect(tagName).not.toBe('BODY');");
      }
      log("✓ ทดสอบ Keyboard Navigation ถูกต้อง (focus เลื่อนไปยัง element จริง)");
    },
    hint: "ต้องจำลองการกดปุ่มเลื่อน focus ด้วยคีย์บอร์ด แล้วอ่านว่า element ไหนกำลังถูก focus อยู่ในขณะนั้นผ่านการรันโค้ดฝั่ง browser จากนั้นเทียบว่า tag ของ element นั้นไม่ใช่ tag เริ่มต้นของหน้า (body)",
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
// 1. ดึงลำดับ level ของ heading ทั้งหมดในหน้า (h1=1, h2=2, ...) ด้วย page.evaluate()
// 2. ตรวจสอบว่าไม่มีคู่ heading ที่ติดกันกระโดดข้ามระดับมากกว่า 1 (เช่น h1 ต่อด้วย h4 เลยถือว่าผิด)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับ Heading ว่าไม่กระโดดข้าม...");
      const clean = stripComments(code);
      // ผูก page.evaluate() + querySelectorAll(...) + tagName[1] เข้าด้วยกันเป็นสายเดียว (ของเดิมเช็คแยก
      // อิสระจากกัน ทำให้ผ่านได้แม้สามอย่างนี้ไม่ได้เกี่ยวข้องกันเลยในโค้ดจริง)
      const hasEvaluateChain = /page\.evaluate\(\s*\(\)\s*=>[\s\S]*?querySelectorAll\(['"]h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6['"]\)[\s\S]*?tagName\[1\]/.test(clean);
      // ผูกการลบกันของสอง index ที่ติดกัน [i] และ [i - 1] เข้ากับ toBeLessThanOrEqual(1) โดยตรง (ของเดิมแค่
      // เช็คว่ามีคำว่า toBeLessThanOrEqual(1) อยู่ที่ไหนก็ได้ในโค้ด ไม่ผูกกับการเทียบ level เลย)
      const hasStepCheck = /\w+\[i\]\s*-\s*\w+\[i\s*-\s*1\]\)\.toBeLessThanOrEqual\(1\)/.test(clean);
      if (!hasEvaluateChain) {
        throw new Error("ไม่พบการดึง heading ทั้งหมดผ่าน page.evaluate() ด้วย document.querySelectorAll('h1, h2, h3, h4, h5, h6') แล้วแปลงเป็นตัวเลข level ด้วย tagName[1]");
      }
      if (!hasStepCheck) {
        throw new Error("ไม่พบการตรวจสอบว่าความต่างระหว่าง heading ที่ติดกันไม่เกิน 1\nตัวอย่าง: expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);");
      }
      log("✓ ยืนยันได้ว่าลำดับ heading ไม่กระโดดข้ามระดับจริง");
    },
    hint: "ต้องดึงลำดับ heading ทั้งหมดจากหน้าโดยรันโค้ดฝั่ง browser แปลงแต่ละ tag เป็นตัวเลขระดับ แล้ววนลูปเทียบผลต่างระหว่าง level ของ heading ที่ติดกันสองอันว่าต้องไม่มากกว่าหนึ่งระดับ",
    solution: `import { test, expect } from '@playwright/test';

test('ลำดับ heading ไม่กระโดดข้ามระดับ', async ({ page }) => {
  await page.goto('/');
  const levels = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => Number(h.tagName[1]))
  );

  for (let i = 1; i < levels.length; i++) {
    expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  }
});`,
    theory: `<strong>Semantic HTML heading</strong> (<code>&lt;h1&gt;</code> ถึง <code>&lt;h6&gt;</code>) ไม่ใช่แค่เรื่องขนาดตัวอักษร — screen reader ใช้ heading เป็น "สารบัญ" ให้ผู้ใช้กระโดดข้ามไปยัง section ที่สนใจได้ทันที (กด shortcut คีย์เพื่อ "ไป heading ถัดไป" โดยไม่ต้องอ่านทุกอย่างตั้งแต่ต้น)<br/><br/>
    กฎสำคัญ: ลำดับ heading ต้อง<strong>ไม่กระโดดข้าม</strong> เช่นมี <code>&lt;h1&gt;</code> แล้วกระโดดไป <code>&lt;h4&gt;</code> เลยโดยไม่มี <code>h2</code>/<code>h3</code> คั่น — ทำให้โครงสร้าง "สารบัญ" ที่ screen reader สร้างให้อัตโนมัติดูสับสน ไม่สื่อความสัมพันธ์ของเนื้อหาจริง บทนี้พิสูจน์กฎข้อนี้จริงๆ ด้วยการดึง level ของทุก heading ในหน้า (<code>h1</code>→1, <code>h2</code>→2, ...) แล้วเช็คว่าความต่างระหว่างคู่ที่ติดกัน<strong>ไม่เกิน 1</strong> เสมอ (นับแค่ "ลึกลงไปมากขึ้น" ทีละระดับ — ถอยขึ้นข้ามหลายระดับทำได้ปกติ เช่น h3→h1 ไม่ผิดกฎนี้)<br/><br/>
    <strong>Real grounding:</strong> <code>AiTeamTab.jsx</code> ของ My-Investment-Port มี <code>&lt;h2 className="text-gradient-mint"&gt;{UI_STRINGS.AI_INV_TEAM_STUDIO_TITLE}&lt;/h2&gt;</code> เป็นหัวข้อ section จริง — ใช้ <code>h2</code> (ไม่ใช่ <code>h1</code>) เพราะ component นี้เป็น section ย่อยของหน้าใหญ่กว่า ซึ่งถูกต้องตามหลัก semantic hierarchy (มี <code>h1</code> เดียวของทั้งหน้าอยู่ระดับบนสุด แล้ว section ย่อยๆ ใช้ <code>h2</code>/<code>h3</code> ไล่ลงมา)`,
    example: `// ตัวอย่างเช็คว่ามี h1 แค่อันเดียวในหน้า (กฎที่เข้มงวดกว่า)
const h1Count = await page.locator('h1').count();
expect(h1Count).toBe(1);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ดึง level ของ heading ทั้งหมดผ่าน <code>page.evaluate()</code> ด้วย <code>document.querySelectorAll('h1, h2, h3, h4, h5, h6')</code> แล้วแปลง tagName เป็นตัวเลข (<code>Number(h.tagName[1])</code>)<br/>
    2. วนลูปตรวจสอบว่าความต่างระหว่าง heading ที่ติดกันไม่เกิน <code>1</code>`
  },
  {
    id: "color_contrast",
    meta: "บทที่ 5",
    title: "Color Contrast: WCAG Failure ที่พบบ่อยที่สุด",
    template: `// สถานการณ์: axe-core มี rule เฉพาะสำหรับเช็คความต่างสีระหว่างตัวอักษรกับพื้นหลัง (color-contrast)
// การสแกนแบบเต็ม (บทนำ) ครอบคลุมกฎนี้อยู่แล้ว แต่บทนี้เจาะจงสแกนเฉพาะกฎนี้กฎเดียว
// 1. ใช้ AxeBuilder จำกัดให้สแกนเฉพาะ rule 'color-contrast' ด้วย withRules(['color-contrast'])
// 2. ตรวจสอบว่า violations ต้องว่างเปล่า (length === 0)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสแกน Color Contrast...");
      const clean = stripComments(code);
      const hasImport = /import\s+AxeBuilder\s+from\s+['"]@axe-core\/playwright['"]/.test(clean);
      // ผูก withRules(['color-contrast']) ให้ต้องต่อด้วย .analyze() โดยตรงในสายเดียวกัน (ของเดิมเช็ค
      // .analyze() แบบลอยๆ ซึ่งจับคู่กับ analyze() ของอะไรก็ได้ในโค้ด ไม่จำเป็นต้องเป็นตัวที่ถูก withRules มาก่อน)
      const hasScopedAnalyze = /withRules\(\s*\[\s*['"]color-contrast['"]\s*\]\s*\)\s*\.analyze\(\)/.test(clean);
      const hasLengthCheck = /violations\.length\)\.toBe\(0\)/.test(clean) || /expect\(.*violations.*\)\.toHaveLength\(0\)/.test(clean);
      if (!hasImport) {
        throw new Error("ไม่พบ import AxeBuilder from '@axe-core/playwright'");
      }
      if (!hasScopedAnalyze) {
        throw new Error("ไม่พบการจำกัด rule ด้วย withRules(['color-contrast']) ต่อด้วย analyze() ในสายเดียวกัน");
      }
      if (!hasLengthCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า violations.length เป็น 0");
      }
      log("✓ สแกน Color Contrast เฉพาะจุดถูกต้อง (ไม่มี violation)");
    },
    hint: "เหมือนบทนำ แต่ใช้ตัวเลือกของ instance สแกนที่จำกัดขอบเขตให้เหลือแค่กฎเดียวก่อนเรียกเมธอดสแกนต่อท้าย แล้วตรวจสอบความยาวผลลัพธ์เหมือนเดิม",
    solution: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('ไม่มี Color Contrast violation', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  expect(results.violations.length).toBe(0);
});`,
    theory: `<strong>Color Contrast</strong> คือสัดส่วนความต่างระหว่างสีตัวอักษรกับสีพื้นหลัง — WCAG กำหนดขั้นต่ำไว้ชัดเจน (ระดับ AA: ตัวอักษรปกติต้องมีสัดส่วนอย่างน้อย <strong>4.5:1</strong>, ตัวอักษรใหญ่/หนาต้องอย่างน้อย <strong>3:1</strong>) เพื่อให้ผู้ใช้สายตาเลือนราง/ตาบอดสีอ่านออกได้จริง<br/><br/>
    <strong>นี่คือ WCAG violation ที่ automated scan เจอบ่อยที่สุดในโลกจริง</strong> (สำรวจโดย WebAIM ปีต่อปีพบว่า color contrast ติดอันดับ 1 ของปัญหา a11y ที่เจอบนเว็บสาธารณะเสมอ) เพราะดีไซน์เนอร์มักเลือกสีจากความสวยงามอย่างเดียว โดยไม่ได้เช็คสัดส่วนตัวเลขจริง — สีเทาอ่อนบนพื้นขาว หรือสีพาสเทลที่ดูทันสมัย มักตกมาตรฐาน WCAG โดยไม่รู้ตัว<br/><br/>
    <code>AxeBuilder</code> (ที่ใช้สแกนทั้งหน้าไปแล้วในบทนำ) รองรับ <code>withRules([...])</code> จำกัดการสแกนให้เหลือแค่กฎที่ต้องการ — มีประโยชน์เวลาต้องการรายงานเจาะจงเฉพาะปัญหาเดียว (เช่น ทีมออกแบบเพิ่งแก้เรื่องสี อยากเช็คเฉพาะจุดนี้ซ้ำไว ๆ โดยไม่ต้องรอผลสแกนเต็มทุกกฎ)`,
    example: `// ตัวอย่างจำกัดหลาย rule พร้อมกัน (ไม่ใช่แค่ rule เดียว)
const results = await new AxeBuilder({ page })
  .withRules(['color-contrast', 'image-alt', 'label'])
  .analyze();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ใช้ <code>AxeBuilder</code> จำกัดให้สแกนเฉพาะ <code>withRules(['color-contrast'])</code><br/>
    2. ตรวจสอบว่า <code>violations.length</code> เป็น <code>0</code>`
  },
  {
    id: "advanced_multi_issue_fix",
    meta: "ขั้นสูง 1",
    title: "รวมปัญหา: แก้ Accessibility Violations พร้อมกันหลายจุด",
    template: `<!-- สถานการณ์: หน้าฟอร์มสมัครสมาชิกนี้มี Accessibility violations พร้อมกัน 3 จุด ต้องแก้ให้ครบทุกจุด -->
<div class="signup-form">
  <img src="/assets/team-photo.jpg">
  <!-- (1) รูปนี้สื่อความหมาย (ภาพทีมงานจริง) ไม่ใช่รูปตกแต่งล้วนๆ -->

  <label>อีเมล</label>
  <input type="email" id="email-input" name="email">
  <!-- (2) label กับ input ด้านบนยังไม่ถูกผูกเข้าด้วยกันอย่างเป็นทางการ -->

  <p style="color: #999999; background-color: #ffffff;">กรุณากรอกอีเมลที่ใช้งานจริงเพื่อรับลิงก์ยืนยัน</p>
  <!-- (3) สีตัวอักษรกับพื้นหลังคู่นี้ contrast ประมาณ 2.85:1 ต่ำกว่ามาตรฐาน WCAG AA -->
</div>
<!-- แก้ไข HTML ด้านบนให้ผ่านทั้ง 3 จุด -->
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Accessibility violations ทั้ง 3 จุด...");
      const clean = stripComments(code);
      const missing = [];

      // (1) alt text ต้องมีเนื้อหาจริง ไม่ใช่แค่ attribute ว่างหรือไม่มีเลย
      const imgTag = (clean.match(/<img\b[^>]*>/i) || [])[0];
      const altValue = imgTag ? (imgTag.match(/\balt\s*=\s*(['"])(.*?)\1/i) || [])[2] : null;
      if (!imgTag || !altValue || !altValue.trim()) {
        missing.push("รูปภาพ &lt;img&gt; ยังไม่มี alt text ที่มีเนื้อหา (WCAG 1.1.1 Non-text Content)");
      }

      // (2) label ต้องผูกกับ input ด้วย for/id ที่ตรงกันจริง (เช็คแยกจากกันคนละ tag เพื่อกันการ hardcode
      // ข้อความ for="..." ลอยๆ ไว้ในที่อื่นที่ไม่ใช่ label จริง)
      const labelFor = (clean.match(/<label\b[^>]*\bfor\s*=\s*(['"])(.*?)\1[^>]*>/i) || [])[2];
      const inputId = (clean.match(/<input\b[^>]*\bid\s*=\s*(['"])(.*?)\1[^>]*>/i) || [])[2];
      if (!labelFor || !inputId || labelFor !== inputId) {
        missing.push("&lt;label&gt; ยังไม่ผูกกับ &lt;input&gt; ด้วย for/id ที่ตรงกัน (WCAG 1.3.1 Info and Relationships)");
      }

      // (3) contrast ratio คำนวณจริงจากค่าสีที่อยู่ใน style ของ <p> เท่านั้น (ไม่ใช่ regex match สีที่อาจ
      // หลุดมาจากคอมเมนต์หรือที่อื่นในไฟล์ที่ไม่เกี่ยวกับ text จริง)
      const pOpenTag = (clean.match(/<p\b([^>]*)>/i) || [])[1] || '';
      const styleAttr = (pOpenTag.match(/style\s*=\s*(['"])(.*?)\1/i) || [])[2] || '';
      const textColor = (styleAttr.match(/(?<!background-)color:\s*(#[0-9a-fA-F]{3,6})/i) || [])[1];
      const bgColor = (styleAttr.match(/background-color:\s*(#[0-9a-fA-F]{3,6})/i) || [])[1];
      if (!textColor || !bgColor || contrastRatio(textColor, bgColor) < 4.5) {
        missing.push("สีตัวอักษรกับพื้นหลังยัง contrast ไม่ถึง 4.5:1 ตามมาตรฐาน WCAG 1.4.3 Contrast (Minimum)");
      }

      if (missing.length > 0) {
        throw new Error(`ยังมี Accessibility violation ที่ไม่ได้แก้ ${missing.length} จุด:\n- ${missing.join("\n- ")}`);
      }
      log("✓ แก้ไข Accessibility violations ครบทั้ง 3 จุด (alt text, label association, color contrast)");
    },
    hint: "แต่ละปัญหาต้องแก้แยกกันตามหลัก WCAG คนละข้อ: (1) รูปที่สื่อความหมายต้องมีคำอธิบายให้ screen reader อ่านออกเสียงแทนได้ (2) label กับ input ต้องผูกกันด้วย attribute ที่ระบุ id เดียวกันทั้งสองฝั่ง ไม่ใช่แค่วางข้อความไว้ใกล้ๆ กัน (3) ลองคำนวณสัดส่วนความต่างของสีตัวอักษรกับพื้นหลังจริง แล้วเทียบกับเกณฑ์ขั้นต่ำของ WCAG AA สำหรับตัวอักษรขนาดปกติ",
    solution: `<div class="signup-form">
  <img src="/assets/team-photo.jpg" alt="ทีมงานผู้ก่อตั้งบริษัทถ่ายภาพรวมกันที่ออฟฟิศ">

  <label for="email-input">อีเมล</label>
  <input type="email" id="email-input" name="email">

  <p style="color: #595959; background-color: #ffffff;">กรุณากรอกอีเมลที่ใช้งานจริงเพื่อรับลิงก์ยืนยัน</p>
</div>`,
    theory: `ในงานจริง Accessibility violation แทบไม่เคยมาทีละจุดเดียว — หน้าเว็บหนึ่งหน้ามักมีหลายปัญหาซ้อนกันพร้อมกัน และแต่ละปัญหาก็อ้างอิงกฎ WCAG คนละข้อ:<br/><br/>
    <strong>WCAG 1.1.1 Non-text Content (Level A)</strong> — รูปภาพที่สื่อความหมายต้องมี text alternative ให้ screen reader อ่านแทนได้<br/><br/>
    <strong>WCAG 1.3.1 Info and Relationships (Level A)</strong> — ความสัมพันธ์เชิงโครงสร้าง (เช่น label กับ input ไหนคู่กัน) ต้องสื่อสารผ่านโค้ดจริง ไม่ใช่แค่การจัดวางให้ดูใกล้กันด้วยสายตา — screen reader อ่านโครงสร้าง DOM ไม่ได้ "เห็น" ว่าอะไรอยู่ใกล้อะไร<br/><br/>
    <strong>WCAG 1.4.3 Contrast (Minimum) (Level AA)</strong> — ตัวอักษรขนาดปกติต้องมีสัดส่วนความต่างของสีอย่างน้อย 4.5:1 กับพื้นหลัง<br/><br/>
    บทนี้ฝึกการ "อ่านโค้ดจริงแล้วหาว่าอะไรผิดกี่จุด" ซึ่งใกล้เคียงงาน QA จริงมากกว่าการแก้ปัญหาเดียวโดดๆ — และ validate ของบทนี้ตรวจแต่ละจุดแยกกันอิสระ ถ้าแก้ไม่ครบจะบอกเจาะจงว่าเหลือจุดไหนบ้าง ไม่ใช่แค่ "ผิด" เฉยๆ`,
    example: `// ตัวอย่างคำนวณ contrast ratio เองแบบง่ายๆ (หลักการเดียวกับที่ axe-core ใช้ภายใน)
function relativeLuminance(r, g, b) {
  const ch = c => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
// contrast = (lighter + 0.05) / (darker + 0.05)`,
    task: `จงแก้ไข HTML ด้านบนให้ผ่านทั้ง 3 จุดพร้อมกัน:<br/>
    1. เพิ่มคำอธิบายที่มีเนื้อหาจริงให้รูปภาพ (ไม่ใช่ค่าว่าง)<br/>
    2. ผูก <code>&lt;label&gt;</code> กับ <code>&lt;input&gt;</code> ด้วย attribute ที่ระบุ id เดียวกันทั้งสองฝั่ง<br/>
    3. เปลี่ยนสีตัวอักษรให้ contrast กับพื้นหลังอย่างน้อย 4.5:1 ตามเกณฑ์ WCAG AA`
  },
  {
    id: "advanced_axe_scoped_aria_rule",
    meta: "ขั้นสูง 2",
    title: "เจาะจงกฎ ARIA: สแกนเฉพาะ aria-required-attr ด้วย axe-core",
    template: `// สถานการณ์: custom dropdown widget ใช้ role="combobox" ซึ่งตาม ARIA spec ต้องมี attribute ที่จำเป็นครบ
// (เช่น aria-expanded) ไม่งั้น screen reader จะไม่รู้สถานะเปิด/ปิดของ dropdown นั้นเลย
// axe-core มี rule 'aria-required-attr' เจาะจงตรวจสอบเรื่องนี้โดยเฉพาะ ไม่ต้องสแกนกฎอื่นทั้งหมด
// 1. ใช้ AxeBuilder จำกัดให้สแกนเฉพาะ rule 'aria-required-attr' ด้วย withRules(['aria-required-attr'])
// 2. ตรวจสอบว่า violations ต้องว่างเปล่า (length === 0)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสแกนเฉพาะ aria-required-attr...");
      const clean = stripComments(code);
      const hasImport = /import\s+AxeBuilder\s+from\s+['"]@axe-core\/playwright['"]/.test(clean);
      // ผูก withRules(['aria-required-attr']) ให้ต้องต่อด้วย .analyze() โดยตรงในสายเดียวกัน เหมือนบทที่แล้ว
      const hasScopedAnalyze = /new AxeBuilder\(\{\s*page\s*\}\)\s*\.withRules\(\s*\[\s*['"]aria-required-attr['"]\s*\]\s*\)\s*\.analyze\(\)/.test(clean);
      const hasLengthCheck = /violations\.length\)\.toBe\(0\)/.test(clean) || /expect\(.*violations.*\)\.toHaveLength\(0\)/.test(clean);
      if (!hasImport) {
        throw new Error("ไม่พบ import AxeBuilder from '@axe-core/playwright'");
      }
      if (!hasScopedAnalyze) {
        throw new Error("ไม่พบการสร้าง new AxeBuilder({ page }) แล้วจำกัดด้วย withRules(['aria-required-attr']) ต่อด้วย analyze() ในสายเดียวกัน");
      }
      if (!hasLengthCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า violations.length เป็น 0");
      }
      log("✓ สแกนเฉพาะ aria-required-attr ถูกต้อง (ไม่มี violation)");
    },
    hint: "axe-core มีตัวเลือกจำกัด rule ที่จะสแกนเหมือนบทที่แล้ว (color-contrast) — ครั้งนี้ให้หา rule id ของ axe-core ที่ตรงกับปัญหา ARIA attribute ที่ขาดหายไปบน widget แทน แล้วต่อท้ายด้วยการรัน analyze() และตรวจสอบผลลัพธ์แบบเดียวกัน",
    solution: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('ไม่มี aria-required-attr violation บน custom combobox widget', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withRules(['aria-required-attr']).analyze();
  expect(results.violations.length).toBe(0);
});`,
    theory: `<strong>WCAG 4.1.2 Name, Role, Value (Level A)</strong> กำหนดว่า custom UI component (ที่ไม่ใช่ HTML element มาตรฐานอย่าง <code>&lt;select&gt;</code>) ต้องประกาศ role, state และ property ผ่าน ARIA attribute ให้ assistive technology อ่านได้ครบถ้วน — เช่น <code>role="combobox"</code> ต้องมาพร้อม <code>aria-expanded</code> เพื่อบอกว่า dropdown เปิดอยู่หรือปิดอยู่ ถ้าขาด attribute ที่จำเป็นไป screen reader จะไม่รู้สถานะปัจจุบันของ widget เลย<br/><br/>
    axe-core มี rule <code>aria-required-attr</code> เจาะจงตรวจสอบเรื่องนี้: แต่ละ ARIA role มี "required attribute" ตาม spec ของมันเอง (เช่น <code>role="checkbox"</code> ต้องมี <code>aria-checked</code>, <code>role="combobox"</code> ต้องมี <code>aria-expanded</code>) — rule นี้จะ fail ทันทีถ้า element ที่ประกาศ role นั้นขาด attribute ที่จำเป็นไป<br/><br/>
    เหมือนบทที่แล้ว (color-contrast) การจำกัดสแกนเฉพาะ rule เดียวมีประโยชน์เวลาต้องการ regression test เจาะจงหลังทีม frontend เพิ่งแก้ widget ตัวใดตัวหนึ่ง โดยไม่ต้องรอผลสแกนเต็มรูปแบบทุกกฎ`,
    example: `// ตัวอย่างจำกัดสแกนเฉพาะกลุ่ม role อื่น เช่น aria-valid-attr-value (ค่า attribute ต้องถูกต้องตาม spec)
const results = await new AxeBuilder({ page })
  .withRules(['aria-valid-attr-value'])
  .analyze();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ใช้ <code>AxeBuilder</code> จำกัดให้สแกนเฉพาะ <code>withRules(['aria-required-attr'])</code><br/>
    2. ตรวจสอบว่า <code>violations.length</code> เป็น <code>0</code>`
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
        <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
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
  showTrackCertificate('Accessibility (a11y) Testing');
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
  window.QA_TRACKS['accessibility-testing'] = { id: 'accessibility-testing', title: 'Accessibility (a11y) Testing', folder: 'Accessibility-Testing', lessons: LESSONS };
})();
