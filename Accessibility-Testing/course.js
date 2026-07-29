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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิด Accessibility (a11y) Testing และการใช้ <code>@axe-core/playwright</code> ตรวจสอบอัตโนมัติ<br/><br/>
    ⚖️ <strong>ระดับการรับรองมาตรฐาน WCAG (Web Content Accessibility Guidelines):</strong><br/>
    • <strong>A:</strong> ระดับพื้นฐานที่ต้องมี (เช่น มี Alt Text)<br/>
    • <strong>AA:</strong> ระดับมาตรฐานอุตสาหกรรม (target หลักขององค์กรส่วนใหญ่)<br/>
    • <strong>AAA:</strong> ระดับสูงสุดสำหรับเคสเฉพาะทาง<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>const results = await new AxeBuilder({ page }).analyze();</code><br/>
    <code>expect(results.violations.length).toBe(0);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> Automated Scan ด้วย axe-core ตรวจพบปัญหาได้เพียง 30-50% เท่านั้น ส่วนที่เหลือต้องใช้ Manual Keyboard & Screen Reader Testing ร่วมด้วย`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ยืนยันว่ารูปภาพทั้งหมดบนหน้าเว็บมี <code>alt</code> attribute ที่เหมาะสมสำหรับ Screen Reader<br/><br/>
    ⚖️ <strong>ความแตกต่างของ Alt Text ตามประเภทรูปภาพ:</strong><br/>
    • <strong>รูปสื่อความหมาย (Meaningful):</strong> ต้องมีคำอธิบายชัดเจน (เช่น <code>alt="รูปโปรไฟล์ สมชาย"</code>)<br/>
    • <strong>รูปตกแต่ง (Decorative):</strong> ใส่ <code>alt=""</code> เพื่อบอก Screen Reader ให้ข้ามรูปนี้ไป<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>const altText = await images.nth(i).getAttribute('alt');</code><br/>
    <code>expect(altText).toBeTruthy();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> การลืมใส่ <code>alt</code> attribute (ไม่ใช่ <code>alt=""</code>) จะทำให้ Screen Reader พยายามอ่านชื่อไฟล์รูปภาพ (เช่น <code>img_123.jpg</code>) ซึ่งสร้างความรำคาญแก่ผู้ใช้`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ ARIA Label: ปุ่มไอคอนอย่างเดียวต้องมีชื่อให้ Screen Reader อ่านได้ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>aria-label</code> ให้ "ชื่อที่เข้าถึงได้" (accessible name) กับ element ที่ไม่มีข้อความอธิบายตัวเองชัดเจน (เช่น ปุ่มที่มีแค่ไอคอน 🔍 หรือ dropdown ที่แสดงแค่ตัวเลขเดือน) — screen reader จะอ่านค่า <code>aria-label</code> แทนที่จะอ่านว่า "button" เฉยๆ ซึ่งไม่มีประโยชน์กับผู้ใช้เลย<br/><br/>
    <strong>Real grounding:</strong> <code>InvestmentTimeline.jsx</code> ของ My-Investment-Port มี <code>aria-label="Select month"</code> และ <code>aria-label="Select week"</code> จริงบนปุ่ม dropdown ที่เกี่ยวข้อง — และมีอีกจุดที่น่าสนใจ: <code>aria-label="ค้นหา ticker ในประวัติรายการ"</code> เขียนเป็นภาษาไทยตรงๆ (screen reader ภาษาไทยอ่านได้ถูกต้อง ไม่จำเป็นต้องเป็นภาษาอังกฤษเสมอไป)<br/><br/>
    เทคนิคการทดสอบที่ดี: ใช้ <code>page.getByLabel()</code> แทน CSS selector ตรงๆ — วิธีนี้ทำให้ test <strong>พิสูจน์ accessibility ไปในตัว</strong> เพราะถ้า element หา<strong>ไม่เจอ</strong>ผ่าน <code>getByLabel()</code> แปลว่า <code>aria-label</code> หายไปหรือข้อความไม่ตรง — test จะ fail ทันทีโดยไม่ต้องเขียนเช็คแยกต่างหาก<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>await expect(page.getByLabel('Select month')).toBeVisible();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>aria-label</code> จะ<strong>แทนที่</strong>ข้อความที่มองเห็นทั้งหมดของ element นั้น ไม่ใช่แค่เสริม — ถ้าใส่ <code>aria-label</code> ไว้บนปุ่มที่มี text content อยู่แล้วโดยข้อความไม่ตรงกัน screen reader จะอ่านแค่ค่าใน <code>aria-label</code> เท่านั้น ทำให้สิ่งที่ผู้ใช้ Voice Control พูดตามที่เห็นบนจอ (visible label) ใช้สั่งงานปุ่มนั้นไม่ได้ (ผิด WCAG 2.5.3 Label in Name)`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Keyboard Navigation: ใช้งานได้โดยไม่แตะเมาส์เลย และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ผู้ใช้บางกลุ่มไม่สามารถใช้เมาส์ได้เลย (มือสั่น, อัมพาต, หรือแค่ชอบใช้คีย์บอร์ดล้วนก็มี) — ทุกฟังก์ชันบนเว็บต้อง<strong>เข้าถึงได้ด้วยคีย์บอร์ดอย่างเดียว</strong> โดยเฉพาะปุ่ม <code>Tab</code> (เลื่อน focus ไปข้างหน้า), <code>Shift+Tab</code> (ถอยกลับ), <code>Enter</code>/<code>Space</code> (กดปุ่ม)<br/><br/>
    บั๊กที่พบบ่อยที่สุด: Dev ใช้ <code>&lt;div onClick={...}&gt;</code> แทน <code>&lt;button&gt;</code> จริง — คลิกด้วยเมาส์ทำงานได้ปกติ (เพราะ onClick ทำงานกับ div ได้) แต่กด <code>Tab</code> ไล่ไปจะ<strong>ข้าม div นั้นไปเลย</strong> เพราะ <code>&lt;div&gt;</code> ไม่ใช่ focusable element โดย default (ต้องใส่ <code>tabIndex="0"</code> เพิ่มเองถึงจะ focus ได้ และยังต้องเพิ่ม keydown handler สำหรับ Enter/Space เองด้วย เพราะ div ไม่มี native "activate on Enter" เหมือน button)<br/><br/>
    การทดสอบนี้พิสูจน์ระดับพื้นฐานสุด: กด <code>Tab</code> ครั้งเดียวแล้วดูว่า <code>document.activeElement</code> เปลี่ยนจาก <code>&lt;body&gt;</code> ไปเป็น element อื่นจริงหรือไม่ — ถ้ายังเป็น <code>BODY</code> อยู่ แปลว่าไม่มี element ไหน focusable เลยในหน้านั้น (ปัญหาร้ายแรงมาก)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>การทดสอบนี้พิสูจน์ระดับพื้นฐานสุด: กด <code>Tab</code> ครั้งเดียวแล้วดูว่า <code>document.activeElement</code> เปลี่ยนจาก <code>&lt;body&gt;</code> ไปเป็น element อื่นจริงหรือไม่ — ถ้ายังเป็น <code>BODY</code> อยู่ แปลว่าไม่มี element ไหน focusable เลยในหน้านั้น (ปัญหาร้ายแรงมาก)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> บั๊กที่พบบ่อยที่สุด: Dev ใช้ <code>&lt;div onClick={...}&gt;</code> แทน <code>&lt;button&gt;</code> จริง — คลิกด้วยเมาส์ทำงานได้ปกติ (เพราะ onClick ทำงานกับ div ได้) แต่กด <code>Tab</code> ไล่ไปจะ<strong>ข้าม div นั้นไปเลย</strong> เพราะ <code>&lt;div&gt;</code> ไม่ใช่ focusable element โดย default (ต้องใส่ <code>tabIndex="0"</code> เพิ่มเองถึงจะ focus ได้ และยังต้องเพิ่ม keydown handler สำหรับ Enter/Space เองด้วย เพราะ div ไม่มี native "activate on Enter" เหมือน button)<br/><br/>`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Semantic HTML heading</strong> (<code>&lt;h1&gt;</code> ถึง <code>&lt;h6&gt;</code>) ไม่ใช่แค่เรื่องขนาดตัวอักษร — screen reader ใช้ heading เป็น "สารบัญ" ให้ผู้ใช้กระโดดข้ามไปยัง section ที่สนใจได้ทันที (กด shortcut คีย์เพื่อ "ไป heading ถัดไป" โดยไม่ต้องอ่านทุกอย่างตั้งแต่ต้น)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Semantic HTML heading</strong> (<code>&lt;h1&gt;</code> ถึง <code>&lt;h6&gt;</code>) ไม่ใช่แค่เรื่องขนาดตัวอักษร — screen reader ใช้ heading เป็น "สารบัญ" ให้ผู้ใช้กระโดดข้ามไปยัง section ที่สนใจได้ทันที (กด shortcut คีย์เพื่อ "ไป heading ถัดไป" โดยไม่ต้องอ่านทุกอย่างตั้งแต่ต้น)<br/><br/>
    กฎสำคัญ: ลำดับ heading ต้อง<strong>ไม่กระโดดข้าม</strong> เช่นมี <code>&lt;h1&gt;</code> แล้วกระโดดไป <code>&lt;h4&gt;</code> เลยโดยไม่มี <code>h2</code>/<code>h3</code> คั่น — ทำให้โครงสร้าง "สารบัญ" ที่ screen reader สร้างให้อัตโนมัติดูสับสน ไม่สื่อความสัมพันธ์ของเนื้อหาจริง บทนี้พิสูจน์กฎข้อนี้จริงๆ ด้วยการดึง level ของทุก heading ในหน้า (<code>h1</code>→1, <code>h2</code>→2, ...) แล้วเช็คว่าความต่างระหว่างคู่ที่ติดกัน<strong>ไม่เกิน 1</strong> เสมอ (นับแค่ "ลึกลงไปมากขึ้น" ทีละระดับ — ถอยขึ้นข้ามหลายระดับทำได้ปกติ เช่น h3→h1 ไม่ผิดกฎนี้)<br/><br/>
    <strong>Real grounding:</strong> <code>AiTeamTab.jsx</code> ของ My-Investment-Port มี <code>&lt;h2 className="text-gradient-mint"&gt;{UI_STRINGS.AI_INV_TEAM_STUDIO_TITLE}&lt;/h2&gt;</code> เป็นหัวข้อ section จริง — ใช้ <code>h2</code> (ไม่ใช่ <code>h1</code>) เพราะ component นี้เป็น section ย่อยของหน้าใหญ่กว่า ซึ่งถูกต้องตามหลัก semantic hierarchy (มี <code>h1</code> เดียวของทั้งหน้าอยู่ระดับบนสุด แล้ว section ย่อยๆ ใช้ <code>h2</code>/<code>h3</code> ไล่ลงมา)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>const levels = await page.evaluate(() =></code><br/>
    <code>  Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => Number(h.tagName[1])));</code><br/>
    <code>expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เลือกระดับ heading ตาม<strong>ขนาดตัวอักษรที่อยากได้</strong>แทนที่จะดูโครงสร้างเนื้อหาจริง (เช่น อยากได้ตัวเล็กเลยใช้ <code>&lt;h4&gt;</code> ทั้งที่เนื้อหาควรเป็น <code>h2</code>) ทำให้ลำดับกระโดดข้ามโดยไม่ตั้งใจ — ควรกำหนดลำดับ heading ตามโครงสร้าง/ลำดับความสำคัญของเนื้อหาก่อนเสมอ แล้วค่อยใช้ CSS ควบคุมขนาดตัวอักษรแยกต่างหาก`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Color Contrast</strong> คือสัดส่วนความต่างระหว่างสีตัวอักษรกับสีพื้นหลัง — WCAG กำหนดขั้นต่ำไว้ชัดเจน (ระดับ AA: ตัวอักษรปกติต้องมีสัดส่วนอย่างน้อย <strong>4.5:1</strong>, ตัวอักษรใหญ่/หนาต้องอย่างน้อย <strong>3:1</strong>) เพื่อให้ผู้ใช้สายตาเลือนราง/ตาบอดสีอ่านออกได้จริง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Color Contrast</strong> คือสัดส่วนความต่างระหว่างสีตัวอักษรกับสีพื้นหลัง — WCAG กำหนดขั้นต่ำไว้ชัดเจน (ระดับ AA: ตัวอักษรปกติต้องมีสัดส่วนอย่างน้อย <strong>4.5:1</strong>, ตัวอักษรใหญ่/หนาต้องอย่างน้อย <strong>3:1</strong>) เพื่อให้ผู้ใช้สายตาเลือนราง/ตาบอดสีอ่านออกได้จริง<br/><br/>
    <strong>นี่คือ WCAG violation ที่ automated scan เจอบ่อยที่สุดในโลกจริง</strong> (สำรวจโดย WebAIM ปีต่อปีพบว่า color contrast ติดอันดับ 1 ของปัญหา a11y ที่เจอบนเว็บสาธารณะเสมอ) เพราะดีไซน์เนอร์มักเลือกสีจากความสวยงามอย่างเดียว โดยไม่ได้เช็คสัดส่วนตัวเลขจริง — สีเทาอ่อนบนพื้นขาว หรือสีพาสเทลที่ดูทันสมัย มักตกมาตรฐาน WCAG โดยไม่รู้ตัว<br/><br/>
    <code>AxeBuilder</code> (ที่ใช้สแกนทั้งหน้าไปแล้วในบทนำ) รองรับ <code>withRules([...])</code> จำกัดการสแกนให้เหลือแค่กฎที่ต้องการ — มีประโยชน์เวลาต้องการรายงานเจาะจงเฉพาะปัญหาเดียว (เช่น ทีมออกแบบเพิ่งแก้เรื่องสี อยากเช็คเฉพาะจุดนี้ซ้ำไว ๆ โดยไม่ต้องรอผลสแกนเต็มทุกกฎ)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>AxeBuilder</code> (ที่ใช้สแกนทั้งหน้าไปแล้วในบทนำ) รองรับ <code>withRules([...])</code> จำกัดการสแกนให้เหลือแค่กฎที่ต้องการ — มีประโยชน์เวลาต้องการรายงานเจาะจงเฉพาะปัญหาเดียว (เช่น ทีมออกแบบเพิ่งแก้เรื่องสี อยากเช็คเฉพาะจุดนี้ซ้ำไว ๆ โดยไม่ต้องรอผลสแกนเต็มทุกกฎ)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>นี่คือ WCAG violation ที่ automated scan เจอบ่อยที่สุดในโลกจริง</strong> (สำรวจโดย WebAIM ปีต่อปีพบว่า color contrast ติดอันดับ 1 ของปัญหา a11y ที่เจอบนเว็บสาธารณะเสมอ) เพราะดีไซน์เนอร์มักเลือกสีจากความสวยงามอย่างเดียว โดยไม่ได้เช็คสัดส่วนตัวเลขจริง — สีเทาอ่อนบนพื้นขาว หรือสีพาสเทลที่ดูทันสมัย มักตกมาตรฐาน WCAG โดยไม่รู้ตัว<br/><br/>`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ รวมปัญหา: แก้ Accessibility Violations พร้อมกันหลายจุด และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>WCAG 1.1.1 Non-text Content (Level A)</strong> — รูปภาพที่สื่อความหมายต้องมี text alternative ให้ screen reader อ่านแทนได้<br/><br/><br/><strong>WCAG 1.3.1 Info and Relationships (Level A)</strong> — ความสัมพันธ์เชิงโครงสร้าง (เช่น label กับ input ไหนคู่กัน) ต้องสื่อสารผ่านโค้ดจริง ไม่ใช่แค่การจัดวางให้ดูใกล้กันด้วยสายตา — screen reader อ่านโครงสร้าง DOM ไม่ได้ "เห็น" ว่าอะไรอยู่ใกล้อะไร<br/><br/><br/>บทนี้ฝึกการ "อ่านโค้ดจริงแล้วหาว่าอะไรผิดกี่จุด" ซึ่งใกล้เคียงงาน QA จริงมากกว่าการแก้ปัญหาเดียวโดดๆ — และ validate ของบทนี้ตรวจแต่ละจุดแยกกันอิสระ ถ้าแก้ไม่ครบจะบอกเจาะจงว่าเหลือจุดไหนบ้าง ไม่ใช่แค่ "ผิด" เฉยๆ<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>&lt;img src="..." alt="ทีมงานผู้ก่อตั้งบริษัทถ่ายภาพรวมกันที่ออฟฟิศ"&gt;</code><br/>
    <code>&lt;label for="email-input"&gt;อีเมล&lt;/label&gt;</code><br/>
    <code>&lt;input type="email" id="email-input"&gt;</code><br/>
    <code>&lt;p style="color: #595959; background-color: #ffffff;"&gt;...&lt;/p&gt;</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>WCAG 1.4.3 Contrast (Minimum) (Level AA)</strong> — ตัวอักษรขนาดปกติต้องมีสัดส่วนความต่างของสีอย่างน้อย 4.5:1 กับพื้นหลัง<br/><br/>`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>WCAG 4.1.2 Name, Role, Value (Level A)</strong> กำหนดว่า custom UI component (ที่ไม่ใช่ HTML element มาตรฐานอย่าง <code>&lt;select&gt;</code>) ต้องประกาศ role, state และ property ผ่าน ARIA attribute ให้ assistive technology อ่านได้ครบถ้วน — เช่น <code>role="combobox"</code> ต้องมาพร้อม <code>aria-expanded</code> เพื่อบอกว่า dropdown เปิดอยู่หรือปิดอยู่ ถ้าขาด attribute ที่จำเป็นไป screen reader จะไม่รู้สถานะปัจจุบันของ widget เลย<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>เหมือนบทที่แล้ว (color-contrast) การจำกัดสแกนเฉพาะ rule เดียวมีประโยชน์เวลาต้องการ regression test เจาะจงหลังทีม frontend เพิ่งแก้ widget ตัวใดตัวหนึ่ง โดยไม่ต้องรอผลสแกนเต็มรูปแบบทุกกฎ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>axe-core มี rule <code>aria-required-attr</code> เจาะจงตรวจสอบเรื่องนี้: แต่ละ ARIA role มี "required attribute" ตาม spec ของมันเอง (เช่น <code>role="checkbox"</code> ต้องมี <code>aria-checked</code>, <code>role="combobox"</code> ต้องมี <code>aria-expanded</code>) — rule นี้จะ fail ทันทีถ้า element ที่ประกาศ role นั้นขาด attribute ที่จำเป็นไป<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> การใส่ <code>role</code> ให้ widget โดยไม่เช็ค required attribute ของ role นั้นตาม ARIA spec ให้ครบ (เช่น ใส่ <code>role="combobox"</code> แต่ลืม <code>aria-expanded</code>) เป็นปัญหาที่ developer มักมองข้าม เพราะปุ่ม/dropdown ยัง<strong>ทำงานได้ปกติทางสายตา</strong> — ต้องรัน axe-core หรือเช็ค required attribute ของแต่ละ role ให้ครบก่อน merge เสมอ`,
    example: `// ตัวอย่างจำกัดสแกนเฉพาะกลุ่ม role อื่น เช่น aria-valid-attr-value (ค่า attribute ต้องถูกต้องตาม spec)
const results = await new AxeBuilder({ page })
  .withRules(['aria-valid-attr-value'])
  .analyze();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ใช้ <code>AxeBuilder</code> จำกัดให้สแกนเฉพาะ <code>withRules(['aria-required-attr'])</code><br/>
    2. ตรวจสอบว่า <code>violations.length</code> เป็น <code>0</code>`
  },
  {
    id: "table_scope_association",
    meta: "ขั้นสูง 3",
    title: "Table Header Scope: ผูก <th> เข้ากับคอลัมน์ข้อมูลด้วย scope Attribute",
    template: `// สถานการณ์: PortfolioTable.jsx จริงของ My-Investment-Port render ตาราง Holdings ด้วย <table><thead><tr>
// วนลูป headers.map() แล้ว render <th> ให้แต่ละคอลัมน์ (Ticker, Quantity, Price, ...) — แต่ยังไม่ได้ใส่
// attribute ที่บอก screen reader ว่า <th> แต่ละอันเป็นหัวข้อของ "คอลัมน์" ไม่ใช่ "แถว"
// เวลาผู้ใช้ screen reader เลื่อนไปยังเซลล์ข้อมูลกลางตาราง (เช่น เลขราคาช่องหนึ่ง) เครื่องมือควรอ่านชื่อคอลัมน์
// กำกับให้ทุกครั้ง แต่ถ้าไม่มี scope attribute ผูกไว้ ผู้ใช้จะได้ยินแค่ตัวเลขลอยๆ ไม่รู้ว่าคือคอลัมน์อะไร
// 1. ดึง <th> ทั้งหมดในตารางด้วย page.locator('table th')
// 2. วนลูปตรวจสอบว่าทุก th มี attribute scope เป็น 'col'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ scope attribute ของ th ในตาราง...");
      const clean = stripComments(code);
      const hasLocator = /page\.locator\(['"]table th['"]\)/.test(clean);
      const hasCount = /\.count\(\)/.test(clean);
      const hasScopeGet = /getAttribute\(['"]scope['"]\)/.test(clean);
      const hasColCheck = /expect\([^)]*\)\.toBe\(['"]col['"]\)/.test(clean);
      if (!hasLocator || !hasCount) {
        throw new Error("ไม่พบการดึง th ทั้งหมดด้วย page.locator('table th') และ .count()");
      }
      if (!hasScopeGet) {
        throw new Error("ไม่พบการตรวจสอบ attribute scope\nตัวอย่าง: await headers.nth(i).getAttribute('scope')");
      }
      if (!hasColCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า scope เป็น 'col'\nตัวอย่าง: expect(scope).toBe('col');");
      }
      log('✓ ทุก th ในตารางผูก scope="col" ถูกต้อง');
    },
    hint: "ต้องวนลูปตามจำนวน th ทั้งหมดที่เจอ แล้วดึงค่า attribute ที่บอกว่า header นี้เป็นหัวข้อของคอลัมน์หรือแถว ออกมาทีละตัว จากนั้นตรวจสอบด้วย expect ว่าค่าที่ได้ตรงกับคำที่สื่อความหมายว่าเป็น 'คอลัมน์'",
    solution: `import { test, expect } from '@playwright/test';

test('ทุก th ในตาราง Holdings ผูก scope="col" ถูกต้อง', async ({ page }) => {
  await page.goto('/holdings');
  const headers = page.locator('table th');
  const count = await headers.count();

  for (let i = 0; i < count; i++) {
    const scope = await headers.nth(i).getAttribute('scope');
    expect(scope).toBe('col');
  }
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Table Header Scope: ผูก <th> เข้ากับคอลัมน์ข้อมูลด้วย scope Attribute และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>scope</code> attribute บน <code>&lt;th&gt;</code> ประกาศชัดเจนว่า header เซลล์นี้เป็นหัวข้อของ "คอลัมน์" (<code>scope="col"</code>) หรือ "แถว" (<code>scope="row"</code>) — screen reader ใช้ข้อมูลนี้ประกาศชื่อคอลัมน์กำกับทุกครั้งที่ผู้ใช้เลื่อนไปยังเซลล์ข้อมูลกลางตาราง (เช่น "Price, column, 245.30" แทนที่จะได้ยินแค่ "245.30" ลอยๆ ไม่รู้บริบท)<br/><br/>
    <strong>Real grounding:</strong> <code>PortfolioTable.jsx</code> ของ My-Investment-Port render ตาราง Holdings จริงด้วย <code>&lt;table&gt;&lt;thead&gt;&lt;tr&gt;</code> วนลูป <code>table.getHeaderGroups()</code> แล้ว render <code>&lt;th&gt;</code> ให้แต่ละคอลัมน์ (Ticker, Quantity, Price ฯลฯ) — แต่ตรวจสอบซอร์สโค้ดจริงแล้วพบว่ายังไม่มี <code>scope</code> attribute ผูกไว้กับ <code>&lt;th&gt;</code> เลยสักตัว (มีแค่ class/style สำหรับจัดหน้าตา) บทนี้สอนวิธีปิดช่องว่างนี้ให้ถูกต้อง<br/><br/>
    axe-core มี rule <code>scope-attr-valid</code> (ตรวจว่าค่า <code>scope</code> ที่ใส่ถูกต้องตามสเปก) และ <code>th-has-data-cells</code> (ตรวจว่า <code>th</code> แต่ละตัวมีเซลล์ข้อมูลที่มันอธิบายอยู่จริงในตาราง) คอยตรวจสอบเรื่องนี้อัตโนมัติได้ — แต่กรณีตารางเรียบง่ายแบบ Holdings (header แถวเดียว ไม่มี header ซ้อนหลายชั้น) การใส่ <code>scope="col"</code> ตรงๆ ก็เพียงพอแล้วตามหลัก WCAG 1.3.1 Info and Relationships (Level A) ที่เคยเรียนมาแล้วในบทขั้นสูง 1<br/><br/>
    ข้อสังเกตเพิ่ม: ถ้า <code>&lt;th&gt;</code> ตัวไหนเป็นหัวข้อของ "แถว" แทน (เช่น คอลัมน์แรกสุดที่เป็นชื่อ ticker กำกับทั้งแถวนั้น) ต้องใช้ <code>scope="row"</code> แทน <code>scope="col"</code> — ต้องดูโครงสร้างตารางจริงว่า header ตัวไหนอธิบาย "แนวตั้ง" (คอลัมน์) หรือ "แนวนอน" (แถว)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>const scope = await headers.nth(i).getAttribute('scope');</code><br/>
    <code>expect(scope).toBe('col');</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใส่ <code>scope="row"</code> สลับกับ <code>scope="col"</code> (หรือไม่ใส่เลย) ให้กับ <code>&lt;th&gt;</code> ที่จริงๆ เป็นหัวข้อคอลัมน์ — ต้องดูทิศทางของ header แต่ละตัวในตารางจริงก่อนใส่ค่า ไม่ใช่ hardcode <code>'col'</code> ทุกตัวโดยไม่เช็ค เพราะตารางที่มีคอลัมน์แรกเป็นชื่อ (เช่น ticker) มักต้องใช้ <code>scope="row"</code> สำหรับ header แนวนอนนั้น`,
    example: `// ตัวอย่างตารางที่มี header ทั้งแนวตั้งและแนวนอนพร้อมกัน (คอลัมน์แรกเป็น scope="row")
// <th scope="col">Price</th>
// <th scope="row">AAPL</th>`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ดึง <code>&lt;th&gt;</code> ทั้งหมดด้วย <code>page.locator('table th')</code><br/>
    2. วนลูปตรวจสอบว่าทุกตัวมี <code>scope</code> เป็น <code>'col'</code>`
  },
  {
    id: "toast_live_region",
    meta: "ขั้นสูง 4",
    title: "Live Region: Toast Notification ต้องประกาศสถานะให้ Screen Reader โดยไม่ขัดจังหวะ",
    template: `// สถานการณ์: Toast.jsx และ ToastContext.jsx จริงของ My-Investment-Port แสดง notification popup ชั่วคราว
// (เช่น "บันทึกสำเร็จ") ที่ auto-dismiss เองหลังผ่านไปตามเวลาที่กำหนด (duration) โดยไม่ต้องให้ผู้ใช้กดอะไรเลย
// แต่ popup นี้โผล่ขึ้นมาแบบเงียบๆ ในมุมมองของ screen reader — ถ้าผู้ใช้กำลังโฟกัสอยู่ที่จุดอื่นของหน้า
// (เช่น กำลังกรอกฟอร์มอยู่) จะไม่มีทางรู้เลยว่ามี toast ขึ้นมาแล้วหายไป เพราะไม่มีอะไรบอก screen reader
// ว่าเนื้อหาส่วนนี้เพิ่งเปลี่ยนแปลง
// 1. คลิกปุ่มบันทึกเพื่อ trigger toast (page.getByRole('button', { name: 'Save' }))
// 2. ตรวจสอบว่ามี element ที่ประกาศสถานะ (page.getByRole('status')) ปรากฏขึ้นมาและมองเห็นได้
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Live Region ของ Toast Notification...");
      const clean = stripComments(code);
      const hasClick = /getByRole\(['"]button['"],\s*\{\s*name:\s*['"]Save['"]\s*\}\)\.click\(\)/.test(clean);
      const hasStatusCheck = /expect\(\s*page\.getByRole\(['"]status['"]\)\s*\)\.toBeVisible\(\)/.test(clean);
      if (!hasClick) {
        throw new Error("ไม่พบการคลิกปุ่มบันทึกด้วย page.getByRole('button', { name: 'Save' }).click()");
      }
      if (!hasStatusCheck) {
        throw new Error("ไม่พบการตรวจสอบ toBeVisible() บน element ที่หาเจอผ่าน page.getByRole('status')");
      }
      log('✓ Toast แสดงผ่าน live region ที่ screen reader ประกาศได้ถูกต้อง');
    },
    hint: "หลังจาก trigger ให้ toast ปรากฏขึ้น ต้องหา element ที่ประกาศสถานะผ่าน accessible role ที่บอกความหมายว่า 'เป็นข้อความสถานะที่เพิ่งเปลี่ยนแปลง' (implicit role ที่ผูกกับ aria-live แบบไม่ขัดจังหวะผู้ใช้) แล้วตรวจสอบว่ามันแสดงผลอยู่จริง",
    solution: `import { test, expect } from '@playwright/test';

test('Toast แสดงผ่าน live region ให้ screen reader ประกาศอัตโนมัติ', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('status')).toBeVisible();
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>WCAG 4.1.3 Status Messages (Level AA)</strong> กำหนดว่าข้อความสถานะ (status message) ที่ปรากฏขึ้นโดยไม่ได้ย้าย focus ไปหามัน ต้องสามารถระบุได้ผ่าน role หรือ property ทาง code เพื่อให้ assistive technology แจ้งผู้ใช้ได้ — Toast notification เป็นตัวอย่างคลาสสิกของสิ่งนี้: มันโผล่มา "ข้างๆ" สิ่งที่ผู้ใช้กำลังทำอยู่ ไม่เคยขโมย focus ไปเลย<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>WCAG 4.1.3 Status Messages (Level AA)</strong> กำหนดว่าข้อความสถานะ (status message) ที่ปรากฏขึ้นโดยไม่ได้ย้าย focus ไปหามัน ต้องสามารถระบุได้ผ่าน role หรือ property ทาง code เพื่อให้ assistive technology แจ้งผู้ใช้ได้ — Toast notification เป็นตัวอย่างคลาสสิกของสิ่งนี้: มันโผล่มา "ข้างๆ" สิ่งที่ผู้ใช้กำลังทำอยู่ ไม่เคยขโมย focus ไปเลย<br/><br/>
    <strong>Real grounding:</strong> <code>Toast.jsx</code> และ <code>ToastContext.jsx</code> ของ My-Investment-Port เป็น component จริงที่ใช้งานทั่วทั้งแอป (เรียกผ่าน <code>useToast()</code> hook) — <code>ToastContext.jsx</code> render toast ทั้งหมดไว้ใน <code>&lt;div className="toast-container"&gt;</code> ที่อยู่คงที่ใน DOM แล้วเพิ่ม/ลบ <code>&lt;Toast&gt;</code> ตาม state แต่ตรวจสอบซอร์สโค้ดจริงแล้วพบว่าทั้ง <code>toast-container</code> และตัว toast เองไม่มี <code>aria-live</code> หรือ <code>role</code> ใดๆ กำกับไว้เลย (ต่างจาก <code>Spinner.jsx</code> ของโปรเจกต์เดียวกันที่มี <code>role="status"</code> ถูกต้องอยู่แล้ว) — เป็นช่องว่างจริงที่บทนี้สอนวิธีปิด<br/><br/>
    วิธีปิดช่องว่างนี้คือใส่ <code>role="status"</code> (implicit <code>aria-live="polite"</code> — รอจังหวะที่ผู้ใช้ว่างก่อนค่อยประกาศ เหมาะกับ toast ประเภท success/info) หรือ <code>role="alert"</code> (implicit <code>aria-live="assertive"</code> — ขัดจังหวะประกาศทันที เหมาะกับ toast ประเภท error ที่ต้องรู้ทันที) — เลือกตาม <code>type</code> ของ toast: <code>success</code>/<code>info</code>/<code>warning</code> ใช้ <code>role="status"</code>, <code>error</code> ใช้ <code>role="alert"</code><br/><br/>
    ข้อควรระวัง: <code>aria-live</code>/<code>role</code> ต้องอยู่บน element ที่มีอยู่ใน DOM <strong>ตั้งแต่ก่อน</strong> เนื้อหาจะเปลี่ยน (เช่น container ที่คงที่อยู่แล้ว) ถ้าใส่ role นี้บน element ที่เพิ่งถูกสร้างขึ้นมาใหม่พร้อมกับข้อความเลย บาง screen reader จะไม่ทันประกาศ เพราะมันตรวจจับการ "เปลี่ยนแปลงภายใน" element ที่มีอยู่แล้ว ไม่ใช่การ "เพิ่ม element ใหม่" เข้ามาทั้งก้อน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>Real grounding:</strong> <code>Toast.jsx</code> และ <code>ToastContext.jsx</code> ของ My-Investment-Port เป็น component จริงที่ใช้งานทั่วทั้งแอป (เรียกผ่าน <code>useToast()</code> hook) — <code>ToastContext.jsx</code> render toast ทั้งหมดไว้ใน <code>&lt;div className="toast-container"&gt;</code> ที่อยู่คงที่ใน DOM แล้วเพิ่ม/ลบ <code>&lt;Toast&gt;</code> ตาม state แต่ตรวจสอบซอร์สโค้ดจริงแล้วพบว่าทั้ง <code>toast-container</code> และตัว toast เองไม่มี <code>aria-live</code> หรือ <code>role</code> ใดๆ กำกับไว้เลย (ต่างจาก <code>Spinner.jsx</code> ของโปรเจกต์เดียวกันที่มี <code>role="status"</code> ถูกต้องอยู่แล้ว) — เป็นช่องว่างจริงที่บทนี้สอนวิธีปิด<br/><br/><br/>วิธีปิดช่องว่างนี้คือใส่ <code>role="status"</code> (implicit <code>aria-live="polite"</code> — รอจังหวะที่ผู้ใช้ว่างก่อนค่อยประกาศ เหมาะกับ toast ประเภท success/info) หรือ <code>role="alert"</code> (implicit <code>aria-live="assertive"</code> — ขัดจังหวะประกาศทันที เหมาะกับ toast ประเภท error ที่ต้องรู้ทันที) — เลือกตาม <code>type</code> ของ toast: <code>success</code>/<code>info</code>/<code>warning</code> ใช้ <code>role="status"</code>, <code>error</code> ใช้ <code>role="alert"</code><br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ข้อควรระวัง: <code>aria-live</code>/<code>role</code> ต้องอยู่บน element ที่มีอยู่ใน DOM <strong>ตั้งแต่ก่อน</strong> เนื้อหาจะเปลี่ยน (เช่น container ที่คงที่อยู่แล้ว) ถ้าใส่ role นี้บน element ที่เพิ่งถูกสร้างขึ้นมาใหม่พร้อมกับข้อความเลย บาง screen reader จะไม่ทันประกาศ เพราะมันตรวจจับการ "เปลี่ยนแปลงภายใน" element ที่มีอยู่แล้ว ไม่ใช่การ "เพิ่ม element ใหม่" เข้ามาทั้งก้อน`,
    example: `// เลือก role ตามความรุนแรงของ toast
const role = toastType === 'error' ? 'alert' : 'status';
// <div role={role}>{message}</div>`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. คลิกปุ่มบันทึกด้วย <code>page.getByRole('button', { name: 'Save' })</code><br/>
    2. ตรวจสอบว่า <code>page.getByRole('status')</code> แสดงผล (<code>toBeVisible()</code>)`
  },
  {
    id: "reduced_motion_vestibular",
    meta: "ขั้นสูง 5",
    title: "prefers-reduced-motion: เคารพผู้ใช้ที่มีอาการ Vestibular Disorder",
    template: `// สถานการณ์: My-Investment-Port จริงมี CSS หลายไฟล์ (toast-styles.css, button-styles.css, form-styles.css,
// animation-styles.css, card-styles.css, table-styles.css ฯลฯ) ที่เขียน @media (prefers-reduced-motion: reduce)
// ปิด animation/transition ทั้งหมดไว้อยู่แล้ว เพื่อผู้ใช้ที่ตั้งค่าระบบปฏิเสธการเคลื่อนไหว — กลุ่มผู้ใช้ที่มีอาการ
// vestibular disorder (เวียนหัว/คลื่นไส้จาก motion บนจอ เช่น parallax, slide transition, spinning loader)
// พึ่งพา setting นี้เพื่อใช้งานเว็บได้โดยไม่ป่วย
// แค่เขียน CSS ไว้ไม่พอ ต้องมี Playwright test ยืนยันว่าเมื่อจำลอง setting นี้ในเบราว์เซอร์แล้ว หน้าเว็บจริง
// นิ่งสนิทไม่มี animation เล่นอยู่เลย (สังเกตว่าเทคนิคเดียวกันนี้เคยใช้ในบทเรียน flaky_font_animation_fix
// ของ track Visual-Regression-Testing มาแล้ว — แต่ที่นั่นใช้เพื่อ "กันไม่ให้ screenshot diff fail แบบสุ่ม" บทนี้
// ใช้เพื่อ "พิสูจน์ผลลัพธ์ที่ผู้ใช้จริงที่มีอาการ vestibular ได้รับ" ซึ่งเป็นคนละเป้าหมายกัน)
// 1. จำลอง setting ระบบด้วย page.emulateMedia({ reducedMotion: 'reduce' })
// 2. ถ่ายภาพเปรียบเทียบด้วย toHaveScreenshot() หลังจำลองค่านี้แล้ว
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการจำลอง prefers-reduced-motion ก่อนถ่ายภาพ...");
      const clean = stripComments(code);
      const hasEmulate = /page\.emulateMedia\(\s*\{\s*reducedMotion:\s*['"]reduce['"]\s*\}\s*\)/.test(clean);
      const hasScreenshot = /toHaveScreenshot\(/.test(clean);
      if (!hasEmulate) {
        throw new Error("ไม่พบการจำลอง prefers-reduced-motion ด้วย page.emulateMedia({ reducedMotion: 'reduce' })");
      }
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      const emulateIndex = clean.indexOf('emulateMedia');
      const screenshotIndex = clean.indexOf('toHaveScreenshot');
      if (emulateIndex > screenshotIndex) {
        throw new Error("ต้องจำลอง prefers-reduced-motion ด้วย emulateMedia() ก่อนถ่ายภาพด้วย toHaveScreenshot() เสมอ ไม่ใช่หลัง");
      }
      log("✓ จำลอง prefers-reduced-motion และถ่ายภาพถูกต้อง");
    },
    hint: "Playwright มีเมธอดจำลองการตั้งค่า media feature ของระบบปฏิบัติการได้โดยตรง รับ object ที่ระบุ key ตรงกับชื่อ media feature และค่าที่ต้องการจำลอง — ต้องเรียกเมธอดนี้ก่อนขั้นตอนถ่ายภาพเปรียบเทียบเสมอ เพื่อให้ค่านั้นมีผลตอน render จริง",
    solution: `import { test, expect } from '@playwright/test';

test('หน้าเว็บไม่มี animation เมื่อจำลอง prefers-reduced-motion: reduce', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page).toHaveScreenshot();
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>WCAG 2.3.3 Animation from Interactions (Level AAA)</strong> กำหนดว่า motion animation ที่เกิดจากการกระทำของผู้ใช้ (ไม่ใช่ animation ที่จำเป็นต่อการสื่อความหมาย) ต้องสามารถปิดได้ — เอกสารทางการของ WCAG ระบุ <code>prefers-reduced-motion</code> CSS media query เป็นเทคนิคที่เพียงพอสำหรับข้อนี้โดยตรง (แม้เป็นระดับ AAA ซึ่งสูงกว่าเป้าหมาย AA ที่ track นี้ตั้งไว้ตั้งแต่บทนำ แต่เป็นแนวปฏิบัติที่ดีที่อุตสาหกรรมทำตามกันอย่างกว้างขวางเพราะกระทบผู้ใช้จริงชัดเจน)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Vestibular disorder</strong> คือความผิดปกติของระบบการทรงตัวในหูชั้นใน — ผู้ป่วยกลุ่มนี้อาจเวียนหัว คลื่นไส้ หรือถึงขั้นเป็นไมเกรนได้จาก motion บนจอที่คนทั่วไปมองว่าไม่มีอะไร เช่น parallax scroll, carousel เลื่อนอัตโนมัติ, spinning loader, slide transition — เป็นความพิการทางร่างกายอีกกลุ่มที่แยกจากตาบอด/หูหนวก/มือสั่นที่เคยเรียนมาในบทก่อนๆ<br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>CSS ฝั่งเดียวพิสูจน์ไม่ได้ว่า "ทำงานจริง" — ต้องมี test ยืนยันด้วยว่าเมื่อจำลอง setting นี้ในเบราว์เซอร์แล้ว หน้าเว็บที่ render ออกมานิ่งจริง <code>page.emulateMedia({ reducedMotion: 'reduce' })</code> จำลอง media feature นี้ในบริบทของ Playwright แล้วถ่ายภาพเทียบ baseline สองเวอร์ชัน (ปกติ vs reduced-motion) ถ้า CSS ทำงานถูกต้อง สอง baseline นี้ควรจะนิ่งเหมือนกันทุกครั้งที่รัน (ไม่มี frame กลางๆ ของ animation หลุดเข้ามาสุ่ม)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>Real grounding:</strong> My-Investment-Port เป็นตัวอย่างที่ทำเรื่องนี้ถูกต้อง<strong>สม่ำเสมอทั้งโปรเจกต์</strong> — ตรวจสอบซอร์สโค้ดพบ <code>@media (prefers-reduced-motion: reduce)</code> block จริงอยู่ในอย่างน้อย 7 ไฟล์ CSS: <code>toast-styles.css</code>, <code>animation-styles.css</code>, <code>button-styles.css</code>, <code>form-styles.css</code>, <code>card-styles.css</code>, <code>table-styles.css</code>, <code>swipe-metric-table.css</code> — แต่ละไฟล์มีคอมเมนต์กำกับตรงๆ ว่า <code>/* Accessibility: Respect prefers-reduced-motion */</code> ยืนยันว่าทีมตั้งใจทำเรื่องนี้จริง ไม่ใช่บังเอิญ เช่นใน <code>toast-styles.css</code>: <code>.toast, .toast-close, .toast-progress, .toast-icon { animation: none !important; transition: none !important; }</code> ภายใต้ media query นี้<br/><br/>`,
    example: `// เปรียบเทียบพฤติกรรมปกติ (มี animation) กับ reduced-motion (ไม่มี animation) ในไฟล์เดียวกัน
test('มี animation ตามปกติเมื่อไม่ได้ตั้งค่า reduced motion', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot({ animations: 'allow' });
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. จำลอง <code>page.emulateMedia({ reducedMotion: 'reduce' })</code> ก่อนถ่ายภาพ<br/>
    2. ถ่ายภาพเปรียบเทียบด้วย <code>toHaveScreenshot()</code>`
  },
  {
    id: "focus_visible_indicator",
    meta: "ขั้นสูง 6",
    title: "Focus Visible: ห้ามลบ Outline เริ่มต้นโดยไม่มีของทดแทน",
    template: `/* สถานการณ์: form-styles.css และ button-styles.css จริงของ My-Investment-Port เคยเจอปัญหาเดียวกับที่เว็บจำนวนมากทำพลาด
   นักพัฒนาลบ outline เริ่มต้นของ browser ออกเพราะมันดูไม่เข้ากับดีไซน์ (outline: none;) — ผู้ใช้เมาส์ไม่รู้สึกอะไรเลย
   เพราะไม่เคยเห็น outline อยู่แล้ว แต่ผู้ใช้ที่ควบคุมด้วยคีย์บอร์ดล้วนกด Tab ไล่ไปเรื่อยๆ โดยไม่รู้เลยว่าตอนนี้
   focus อยู่ตรงไหนของหน้า (ผิดกับบทที่ 3 ที่แค่พิสูจน์ว่า "focus ไปถึงจริง" บทนี้พิสูจน์อีกขั้นว่า
   "focus นั้นมองเห็นได้ด้วยตา") */
.input-field {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
}

/* แก้ไข CSS ด้านบน: เพิ่ม rule .input-field:focus-visible ที่กำหนด outline แบบมองเห็นได้จริง
   (ความหนาเป็น px + solid + สี) ทดแทน outline ที่ถูกลบไปด้านบน */
/* WRITE YOUR CODE HERE */
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Focus Visible Indicator...");
      const clean = stripComments(code);
      const focusVisibleMatch = clean.match(/\.input-field:focus-visible\s*\{([^}]*)\}/);
      if (!focusVisibleMatch) {
        throw new Error("ไม่พบ selector .input-field:focus-visible { ... }");
      }
      const block = focusVisibleMatch[1];
      const hasVisibleOutline = /outline:\s*[1-9]\d*px\s+solid\s+\S+/i.test(block);
      const hasNoneInBlock = /outline:\s*none/i.test(block);
      if (hasNoneInBlock) {
        throw new Error("อย่าใส่ outline: none ซ้ำใน .input-field:focus-visible — จุดประสงค์ของ selector นี้คือทดแทน outline ที่ถูกลบไป ไม่ใช่ลบซ้ำ");
      }
      if (!hasVisibleOutline) {
        throw new Error("ใน .input-field:focus-visible ต้องกำหนด outline ที่มองเห็นได้จริง (ความหนาเป็น px + solid + สี) ไม่ใช่ outline: none หรือปล่อยว่าง\nตัวอย่าง: outline: 2px solid #10b981;");
      }
      log("✓ เพิ่ม Focus Visible Indicator ทดแทน outline ที่ถูกลบไปถูกต้อง");
    },
    hint: "ต้องเพิ่ม selector ใหม่ที่ใช้ pseudo-class ซึ่งต่างจาก :focus ตรงที่มันฉลาดพอจะรู้ว่า focus นี้มาจากคีย์บอร์ดจริงๆ (ไม่ใช่จากการคลิกเมาส์) แล้วกำหนด outline ที่มีความหนาเป็นพิกเซล เส้นทึบ (solid) และสีที่มองเห็นชัดเจนบนพื้นหลังจริง",
    solution: `.input-field {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
}

.input-field:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>WCAG 2.4.7 Focus Visible (Level AA)</strong> กำหนดว่า element ที่ควบคุมได้ด้วยคีย์บอร์ดต้องมีโหมดที่ตัวชี้ focus มองเห็นได้เสมอ — เพราะผู้ใช้คีย์บอร์ดล้วนไม่มีเคอร์เซอร์เมาส์ให้ดูว่า "ตอนนี้กำลังจะโต้ตอบกับอะไร" ตัว focus indicator (มักเป็น outline รอบ element) คือสิ่งเดียวที่บอกตำแหน่งปัจจุบันของพวกเขา<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>WCAG 2.4.7 Focus Visible (Level AA)</strong> กำหนดว่า element ที่ควบคุมได้ด้วยคีย์บอร์ดต้องมีโหมดที่ตัวชี้ focus มองเห็นได้เสมอ — เพราะผู้ใช้คีย์บอร์ดล้วนไม่มีเคอร์เซอร์เมาส์ให้ดูว่า "ตอนนี้กำลังจะโต้ตอบกับอะไร" ตัว focus indicator (มักเป็น outline รอบ element) คือสิ่งเดียวที่บอกตำแหน่งปัจจุบันของพวกเขา<br/><br/>
    <strong>Real grounding:</strong> <code>form-styles.css</code> ของ My-Investment-Port มี <code>.input-field { outline: none; }</code> จริงบรรทัดที่ตั้งค่า base style — แต่ตามด้วย <code>.input-field:focus-visible { outline: 2px solid var(--accent, #10b981); outline-offset: 2px; }</code> ทันที ทดแทนไว้ให้ครบ เช่นเดียวกับ <code>button-styles.css</code> ที่มี <code>.btn { outline: none; }</code> คู่กับ <code>.btn:focus-visible { outline: 2px solid rgba(16, 185, 129, 0.6); outline-offset: 2px; }</code> ภายใต้คอมเมนต์กำกับตรงๆ ว่า <code>/* Accessibility: Focus Visible */</code> — ยืนยันว่าทีมตั้งใจทำถูกต้องตามแพทเทิร์นนี้จริง ไม่ใช่บังเอิญ<br/><br/>
    <strong>ทำไมใช้ <code>:focus-visible</code> แทน <code>:focus</code> ธรรมดา:</strong> <code>:focus</code> ทำงานกับทุกการ focus ไม่ว่าจะมาจากคีย์บอร์ดหรือ<strong>คลิกเมาส์</strong>ก็ตาม — ถ้าใส่ outline บน <code>:focus</code> ตรงๆ ผู้ใช้เมาส์จะเห็นกรอบ outline โผล่ขึ้นมาทุกครั้งที่คลิกปุ่ม (ซึ่งนักออกแบบมักมองว่า "ดูไม่เรียบร้อย") <code>:focus-visible</code> เป็น pseudo-class ที่ browser คำนวณเองว่า focus ครั้งนี้ "น่าจะมาจากคีย์บอร์ด" (เช่น กด Tab) หรือมาจากการคลิกเมาส์ — แสดง outline เฉพาะกรณีแรกเท่านั้น ทำให้ได้ทั้งดีไซน์ที่สะอาดสำหรับผู้ใช้เมาส์ และ accessibility ที่ครบสำหรับผู้ใช้คีย์บอร์ดพร้อมกัน<br/><br/>
    บั๊กที่พบบ่อยที่สุดในโลกจริง: ทีมลบ <code>outline: none</code> ทั้งเว็บเพราะ "ไม่สวย" โดยไม่ใส่อะไรทดแทนเลย — ผลคือผู้ใช้คีย์บอร์ดล้วนใช้เว็บไม่ได้จริงๆ ทั้งเว็บ (WCAG 2.4.7 fail ทั้งไซต์) แม้ว่าฟังก์ชันการทำงานทุกอย่างจะยัง "ทำงานได้" ถ้ามองจากมุมมองเมาส์<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>Real grounding:</strong> <code>form-styles.css</code> ของ My-Investment-Port มี <code>.input-field { outline: none; }</code> จริงบรรทัดที่ตั้งค่า base style — แต่ตามด้วย <code>.input-field:focus-visible { outline: 2px solid var(--accent, #10b981); outline-offset: 2px; }</code> ทันที ทดแทนไว้ให้ครบ เช่นเดียวกับ <code>button-styles.css</code> ที่มี <code>.btn { outline: none; }</code> คู่กับ <code>.btn:focus-visible { outline: 2px solid rgba(16, 185, 129, 0.6); outline-offset: 2px; }</code> ภายใต้คอมเมนต์กำกับตรงๆ ว่า <code>/* Accessibility: Focus Visible */</code> — ยืนยันว่าทีมตั้งใจทำถูกต้องตามแพทเทิร์นนี้จริง ไม่ใช่บังเอิญ<br/><br/><br/><strong>ทำไมใช้ <code>:focus-visible</code> แทน <code>:focus</code> ธรรมดา:</strong> <code>:focus</code> ทำงานกับทุกการ focus ไม่ว่าจะมาจากคีย์บอร์ดหรือ<strong>คลิกเมาส์</strong>ก็ตาม — ถ้าใส่ outline บน <code>:focus</code> ตรงๆ ผู้ใช้เมาส์จะเห็นกรอบ outline โผล่ขึ้นมาทุกครั้งที่คลิกปุ่ม (ซึ่งนักออกแบบมักมองว่า "ดูไม่เรียบร้อย") <code>:focus-visible</code> เป็น pseudo-class ที่ browser คำนวณเองว่า focus ครั้งนี้ "น่าจะมาจากคีย์บอร์ด" (เช่น กด Tab) หรือมาจากการคลิกเมาส์ — แสดง outline เฉพาะกรณีแรกเท่านั้น ทำให้ได้ทั้งดีไซน์ที่สะอาดสำหรับผู้ใช้เมาส์ และ accessibility ที่ครบสำหรับผู้ใช้คีย์บอร์ดพร้อมกัน<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> บั๊กที่พบบ่อยที่สุดในโลกจริง: ทีมลบ <code>outline: none</code> ทั้งเว็บเพราะ "ไม่สวย" โดยไม่ใส่อะไรทดแทนเลย — ผลคือผู้ใช้คีย์บอร์ดล้วนใช้เว็บไม่ได้จริงๆ ทั้งเว็บ (WCAG 2.4.7 fail ทั้งไซต์) แม้ว่าฟังก์ชันการทำงานทุกอย่างจะยัง "ทำงานได้" ถ้ามองจากมุมมองเมาส์`,
    example: `/* Global reset ที่ครอบคลุมทุก element พร้อมกัน แทนการเขียนแยกทีละ component */
*:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}`,
    task: `จงแก้ไข CSS ด้านบนให้เพิ่ม Focus Visible Indicator:<br/>
    1. เพิ่ม selector <code>.input-field:focus-visible</code><br/>
    2. กำหนด <code>outline</code> ที่มองเห็นได้จริง (ความหนาเป็น px, <code>solid</code>, มีสี) ทดแทน <code>outline: none</code> ที่ถูกลบไป`
  },
  {
    id: "modal_focus_trap",
    meta: "ขั้นสูง 7",
    title: "Focus Trap: Modal Dialog ต้องมี role, ปิดด้วย Escape ได้",
    template: `// สถานการณ์: ConfirmDialog.jsx จริงของ My-Investment-Port เปิด modal ผ่าน createPortal พร้อมล็อค scroll ของ
// หน้าเว็บหลังไว้ (document.documentElement/body.style.overflow = 'hidden') ระหว่างที่ dialog เปิดอยู่ —
// แต่ตรวจสอบซอร์สโค้ดจริงของ ConfirmDialog.jsx, FormModal.jsx และ SettingsModal.jsx แล้วไม่พบ role="dialog",
// aria-modal, หรือการปิดด้วยปุ่ม Escape เลยสักที่ ผู้ใช้คีย์บอร์ดที่กด Tab ตอนนี้จะเลื่อน focus ทะลุออกไปยัง
// element ของหน้าเว็บด้านหลัง (ที่มองไม่เห็นเพราะโดน overlay บังอยู่) ได้ และไม่มีวิธีปิด dialog ด้วยคีย์บอร์ดเลย
// สมมติว่าทีมแก้ไขแล้วให้ container หลักของ dialog มี role="dialog" กำกับ
// 1. คลิกปุ่มเปิด dialog (page.getByRole('button', { name: 'Delete Account' })) แล้วตรวจสอบว่า dialog
//    (page.getByRole('dialog')) แสดงผลอยู่
// 2. กด Escape (page.keyboard.press('Escape')) แล้วตรวจสอบว่า dialog หายไปแล้ว (toBeHidden())
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ role และการปิด Modal Dialog ด้วย Escape...");
      const clean = stripComments(code);
      const hasOpenClick = /getByRole\(['"]button['"],\s*\{\s*name:\s*['"]Delete Account['"]\s*\}\)\.click\(\)/.test(clean);
      const hasDialogVisible = /expect\(\s*page\.getByRole\(['"]dialog['"]\)\s*\)\.toBeVisible\(\)/.test(clean);
      const hasEscape = /page\.keyboard\.press\(['"]Escape['"]\)/.test(clean);
      const hasDialogHidden = /expect\(\s*page\.getByRole\(['"]dialog['"]\)\s*\)\.toBeHidden\(\)/.test(clean);
      if (!hasOpenClick) {
        throw new Error("ไม่พบการคลิกปุ่มเปิด dialog ด้วย page.getByRole('button', { name: 'Delete Account' }).click()");
      }
      if (!hasDialogVisible) {
        throw new Error("ไม่พบการตรวจสอบว่า page.getByRole('dialog') แสดงผลอยู่ (toBeVisible())");
      }
      if (!hasEscape) {
        throw new Error("ไม่พบการกด Escape ด้วย page.keyboard.press('Escape')");
      }
      if (!hasDialogHidden) {
        throw new Error("ไม่พบการตรวจสอบว่า dialog หายไปแล้วหลังกด Escape\nตัวอย่าง: expect(page.getByRole('dialog')).toBeHidden();");
      }
      log("✓ Modal Dialog มี role และปิดด้วย Escape ได้ถูกต้อง");
    },
    hint: "ต้องเปิด dialog ก่อนแล้วยืนยันว่ามันหา element ที่มี role สื่อความหมายว่าเป็นกล่องโต้ตอบเจอและมองเห็นได้จริง จากนั้นจำลองการกดปุ่มที่ใช้ปิดหน้าต่างโต้ตอบตามธรรมเนียมสากล แล้วตรวจสอบด้วย element เดิมว่ามันหายไปจากการมองเห็นแล้ว",
    solution: `import { test, expect } from '@playwright/test';

test('Escape ปิด Modal Dialog ที่มี role ถูกต้อง', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Delete Account' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Focus Trap: Modal Dialog ต้องมี role, ปิดด้วย Escape ได้ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ตาม ARIA Authoring Practices Guide (APG) แพทเทิร์น <strong>Dialog (Modal)</strong> กำหนดพฤติกรรมที่ต้องมีครบ 5 อย่าง: (1) container หลักต้องมี <code>role="dialog"</code> (2) เมื่อเปิด focus ต้องย้ายเข้าไปอยู่ใน element ข้างในทันที (3) กด <code>Tab</code>/<code>Shift+Tab</code> ต้องวนอยู่แค่ภายใน dialog เท่านั้น ("focus trap" — ห้ามหลุดออกไปยัง element ของหน้าเว็บด้านหลัง) (4) ปุ่ม <code>Escape</code> ต้องปิด dialog ได้ (5) เมื่อปิดแล้ว focus ต้องย้อนกลับไปที่ element ที่เป็นตัวเปิด dialog นั้น — และถ้า background ถูกทำให้ interact ไม่ได้เลยจริงๆ ควรเสริม <code>aria-modal="true"</code> เพื่อบอก assistive technology ว่าเนื้อหาข้างนอกถูกปิดกั้นสนิท<br/><br/>
    <strong>Real grounding:</strong> <code>ConfirmDialog.jsx</code> ของ My-Investment-Port render ผ่าน <code>createPortal</code> พร้อม overlay + กล่องโต้ตอบ และมีโค้ดล็อค scroll ของหน้าเว็บหลังไว้จริงตอน dialog เปิด: <code>document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; document.body.style.touchAction = 'none';</code> (แล้วคืนค่าเดิมตอนปิด) — พิสูจน์ว่าทีมคิดเรื่อง "หน้าเว็บด้านหลังต้องหยุดโต้ตอบได้" มาแล้วในระดับ visual/scroll แต่ตรวจสอบซอร์สโค้ดของ <code>ConfirmDialog.jsx</code>, <code>FormModal.jsx</code>, และ <code>SettingsModal.jsx</code> ทั้ง 3 ไฟล์แล้ว<strong>ไม่พบ</strong> <code>role="dialog"</code>, <code>aria-modal</code>, การจัดการ <code>Escape</code>, หรือ focus trap ใดๆ เลยสักไฟล์ — เป็นช่องว่างจริงที่พบบ่อยมาก: ทำถูกฝั่ง visual (บังหน้าจอ, ล็อค scroll) แต่ลืมทำฝั่ง keyboard/screen-reader โดยสิ้นเชิง<br/><br/>
    บทนี้ validate เฉพาะส่วนที่ทดสอบผ่าน Playwright ได้ตรงไปตรงมา (role กับ Escape) — ส่วนการทดสอบว่า Tab loop ไม่หลุดออกนอก dialog จริง ต้องรวมเทคนิคจากตัวอย่างท้ายบท keyboard_navigation (กด Tab วนหลายครั้งแล้วเช็คว่า activeElement ยังอยู่ภายใน dialog เสมอ ไม่เคยหลุดไปเป็น element นอกกล่อง) เข้ากับบทนี้<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.keyboard.press('Escape');</code><br/>
    <code>await expect(page.getByRole('dialog')).toBeHidden();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม<strong>คืน focus</strong> กลับไปที่ element ที่เป็นตัวเปิด dialog (เช่นปุ่ม <code>Delete Account</code>) หลังปิดแล้ว — ถ้าไม่จัดการ focus ตอนปิด ผู้ใช้ keyboard จะหลุดไปอยู่ที่ <code>&lt;body&gt;</code> แล้วต้องกด <code>Tab</code> ไล่หาตำแหน่งเดิมใหม่ตั้งแต่บนสุดของหน้า ซึ่งขัดกับหลัก ARIA APG Dialog pattern ที่กำหนดให้ focus ย้อนกลับไปยัง trigger element เสมอ`,
    example: `// ตรวจสอบว่า focus ไม่หลุดออกนอก dialog แม้กด Tab เกินจำนวน element ที่ focusable ได้ข้างใน
const dialog = page.getByRole('dialog');
for (let i = 0; i < 15; i++) {
  await page.keyboard.press('Tab');
}
await expect(dialog.locator(':focus')).toBeVisible();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. คลิกปุ่มเปิด dialog ด้วย <code>page.getByRole('button', { name: 'Delete Account' })</code> แล้วตรวจสอบว่า <code>page.getByRole('dialog')</code> <code>toBeVisible()</code><br/>
    2. กด <code>page.keyboard.press('Escape')</code> แล้วตรวจสอบว่า dialog <code>toBeHidden()</code>`
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
