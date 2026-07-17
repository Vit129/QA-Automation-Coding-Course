(function() {
// Visual Regression Testing Interactive Coding Playground Data and Logic
// Grounded in My-Investment-Port's real live-price display (QuickBuyWatchlist.jsx's
// currentPrice) for the masking lesson - a real dynamic-content source that would false-
// positive an unmasked visual diff. Threshold-tuning callback references the same CI-
// baseline gotcha already noted in the Playwright UI Testing track's own references.

// Strips // line comments and /* */ block comments before validation regexes run,
// so a learner cannot pass a check merely by leaving the task's own instructional
// comment text (which often echoes the target API/testId) sitting unused in their code.
function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "Visual Regression Testing คืออะไร: จับบั๊กที่ Functional Test มองไม่เห็น",
    template: `// สถานการณ์: ต้องการถ่ายภาพหน้าจอเปรียบเทียบกับ baseline ที่เคยเซฟไว้
// 1. ถ่ายภาพหน้าจอทั้งหน้าด้วย toHaveScreenshot()
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ toHaveScreenshot()...");
      const src = stripComments(code);
      const hasScreenshot = /await expect\(page\)\.toHaveScreenshot\(\)/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()\nตัวอย่าง: await expect(page).toHaveScreenshot();");
      }
      log("✓ ถ่ายภาพหน้าจอเปรียบเทียบกับ baseline ถูกต้อง");
    },
    hint: "ใช้ assertion ของ Playwright ที่เทียบภาพทั้งหน้ากับ baseline โดยตรง ไม่ต้องส่ง argument ใดๆ เข้าไป — ชื่อ method สื่อความหมายตรงตัวว่า 'ต้องมีภาพหน้าจอ (เทียบกับ baseline)'",
    solution: `import { test, expect } from '@playwright/test';

test('หน้าเว็บไม่มีการเปลี่ยนแปลงทาง visual โดยไม่ตั้งใจ', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();
});`,
    theory: `<strong>Visual Regression Testing</strong> จับบั๊กประเภทที่ Functional Test (เช็คค่า/behavior) มองไม่เห็นเลย — เช่น CSS พังจน layout ทับกัน, สีเปลี่ยนผิดโดยไม่ตั้งใจ, font ไม่โหลด, รูปภาพหาย ทั้งที่ทุก assertion เชิงข้อมูล/behavior ยังผ่านหมด เพราะ DOM/data ถูกต้อง แค่ "หน้าตา" ผิดไป<br/><br/>
    <code>toHaveScreenshot()</code> ของ Playwright ทำงาน 2 แบบ:<br/>
    1. <strong>ครั้งแรกที่รัน</strong> — ไม่มี baseline ให้เทียบ จึงถ่ายภาพเก็บไว้เป็น baseline ทันที (ผ่านเสมอ)<br/>
    2. <strong>ครั้งถัดไป</strong> — ถ่ายภาพใหม่แล้วเทียบ pixel-by-pixel กับ baseline ที่เก็บไว้ ถ้าต่างเกินค่าที่ยอมรับได้ (threshold) test จะ fail พร้อมสร้างไฟล์ diff image ให้ดูว่าต่างกันตรงไหน<br/><br/>
    บทถัดไปจะครอบคลุมปัญหาจริงที่ต้องรู้ก่อนใช้งาน: การ mask เนื้อหาที่เปลี่ยนตลอดเวลา, การเทส responsive หลาย viewport, และการปรับ threshold ให้ไม่ false-positive จากเรื่องเล็กน้อยอย่าง anti-aliasing`,
    example: `// ถ่ายภาพเฉพาะ element เดียว ไม่ใช่ทั้งหน้า (เจาะจงกว่า เร็วกว่า)
await expect(page.getByTestId('watchlist-panel')).toHaveScreenshot();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพหน้าจอทั้งหน้าเปรียบเทียบกับ baseline ด้วย <code>toHaveScreenshot()</code>`
  },
  {
    id: "masking_dynamic_content",
    meta: "บทที่ 1",
    title: "Masking: ปิดบังส่วนที่เปลี่ยนตลอดเวลาก่อนเทียบภาพ",
    template: `// สถานการณ์: QuickBuyWatchlist.jsx จริงแสดง currentPrice แบบ real-time (ราคาหุ้นเปลี่ยนทุกวินาที)
// ถ่ายภาพเทียบ baseline ตรงๆ จะ fail ทุกครั้งเพราะราคาไม่เท่าเดิม ทั้งที่ layout ไม่ได้พังอะไรเลย
// 1. ถ่ายภาพทั้งหน้า แต่ mask element ที่มี data-testid="watchlist-current-price" ไว้ก่อน
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ mask()...");
      const src = stripComments(code);
      const hasMaskOption = /mask:\s*\[/.test(src);
      const hasCorrectTestId = /getByTestId\(\s*['"]watchlist-current-price['"]\s*\)/.test(src);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasMaskOption) {
        throw new Error("ไม่พบ option mask: [...]\nตัวอย่าง: await expect(page).toHaveScreenshot({ mask: [page.getByTestId('watchlist-current-price')] });");
      }
      if (!hasCorrectTestId) {
        throw new Error("mask ต้องเจาะจงไปที่ locator ของ data-testid='watchlist-current-price' โดยใช้ page.getByTestId(...) จริง ไม่ใช่แค่พิมพ์ชื่อ testId ไว้เฉยๆ");
      }
      log("✓ Mask เนื้อหาที่เปลี่ยนตลอดเวลาก่อนเทียบภาพถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option mask เป็น array ของ locator — ใช้ page.getByTestId() หา element ตาม data-testid ที่โจทย์กำหนด แล้วใส่ locator นั้นเข้าไปใน array",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพเปรียบเทียบโดย mask ราคาที่เปลี่ยนตลอดเวลา', async ({ page }) => {
  await page.goto('/watchlist');
  await expect(page).toHaveScreenshot({
    mask: [page.getByTestId('watchlist-current-price')],
  });
});`,
    theory: `<strong>Real grounding:</strong> <code>QuickBuyWatchlist.jsx</code> ของ My-Investment-Port แสดง <code>currentPrice</code> จริงแบบ real-time:<br/><br/>
    <code>const currentPrice = prices[item.ticker];<br/>
    &lt;ResponsiveValue label={UI_STRINGS.AI_WATCH_COL_CURRENT} value={currentPrice ? \`\$\${formatMoney(currentPrice)}\` : '—'} align="right" /&gt;</code><br/><br/>
    ถ้าถ่ายภาพหน้านี้เทียบ baseline ตรงๆ โดยไม่ mask ราคา — test จะ<strong>fail แทบทุกครั้ง</strong>เพราะราคาหุ้นจริงเปลี่ยนแทบทุกวินาที ทั้งที่ layout/สไตล์ไม่ได้พังอะไรเลย นี่คือ <strong>false positive</strong> ที่พบบ่อยที่สุดของ Visual Regression Testing<br/><br/>
    <code>mask</code> option ของ <code>toHaveScreenshot()</code> รับ array ของ locator — Playwright จะ<strong>วาดกล่องสีทึบทับ</strong>บริเวณนั้นก่อนเทียบภาพ ทำให้เนื้อหาที่เปลี่ยนตลอดเวลา (ราคา, เวลา, ตัวนับ, ข้อมูลที่ randomize) ไม่ถูกนำมาเทียบเลย ในขณะที่ส่วนอื่นของหน้า (layout, สี, ตำแหน่ง) ยังถูกตรวจสอบตามปกติ`,
    example: `// mask หลาย element พร้อมกัน (ราคา + เวลาล่าสุดที่อัปเดต)
await expect(page).toHaveScreenshot({
  mask: [
    page.getByTestId('watchlist-current-price'),
    page.getByTestId('last-updated-timestamp'),
  ],
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพทั้งหน้าด้วย <code>toHaveScreenshot()</code><br/>
    2. mask element <code>data-testid="watchlist-current-price"</code>`
  },
  {
    id: "responsive_visual_check",
    meta: "บทที่ 2",
    title: "Responsive Visual Check: เทียบภาพหลาย Viewport",
    template: `// สถานการณ์: ต้องการเช็คว่าหน้าเว็บแสดงผลถูกต้องทั้งจอมือถือและจอ desktop
// 1. ตั้งค่า viewport เป็นขนาดมือถือ (375x667)
// 2. ถ่ายภาพเปรียบเทียบด้วย toHaveScreenshot('mobile.png')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเทส Responsive หลาย viewport...");
      const src = stripComments(code);
      const hasSetViewport = /setViewportSize\(\{\s*width:\s*375,\s*height:\s*667\s*\}\)/.test(src);
      const hasNamedScreenshot = /toHaveScreenshot\(['"]mobile\.png['"]\)/.test(src);
      if (!hasSetViewport) {
        throw new Error("ไม่พบการตั้งค่า viewport 375x667\nตัวอย่าง: await page.setViewportSize({ width: 375, height: 667 });");
      }
      if (!hasNamedScreenshot) {
        throw new Error("ไม่พบการถ่ายภาพชื่อ 'mobile.png'\nตัวอย่าง: await expect(page).toHaveScreenshot('mobile.png');");
      }
      log("✓ เทส Responsive Visual สำหรับ viewport มือถือถูกต้อง");
    },
    hint: "ต้องเรียกสอง method เรียงกัน: หนึ่งคือ method ของ page ที่ตั้งขนาดหน้าจอ (รับ object ที่มี width กับ height) แล้วตามด้วย toHaveScreenshot() ที่ส่งชื่อไฟล์เป็น argument ตัวแรก",
    solution: `import { test, expect } from '@playwright/test';

test('หน้าเว็บแสดงผลถูกต้องบนจอมือถือ', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('mobile.png');
});`,
    theory: `เว็บสมัยใหม่ต้องรองรับหลายขนาดจอ (Responsive Design) — CSS ที่ถูกต้องบน desktop อาจพังบนมือถือ (เมนูซ้อนทับ, ปุ่มล้นจอ, ข้อความอ่านไม่ได้) การทดสอบ Functional อย่างเดียวไม่จับปัญหาแบบนี้เลยเพราะ element ทุกตัวยังอยู่ใน DOM ครบ แค่ "หน้าตา" เพี้ยน<br/><br/>
    <code>page.setViewportSize({ width, height })</code> จำลองขนาดหน้าจอต่างๆ ก่อนถ่ายภาพ — ตั้งชื่อไฟล์ screenshot ให้ต่างกันชัดเจน (<code>'mobile.png'</code>, <code>'tablet.png'</code>, <code>'desktop.png'</code>) เพื่อไม่ให้ baseline ของแต่ละขนาดทับกัน<br/><br/>
    ขนาด viewport ที่นิยมทดสอบ: มือถือ (375×667, iPhone SE), แท็บเล็ต (768×1024, iPad), desktop (1920×1080) — ครอบคลุมกลุ่มผู้ใช้ส่วนใหญ่โดยไม่ต้องทดสอบทุกขนาดจอที่มีในโลกจริง`,
    example: `// ทดสอบหลายขนาดจอในลูปเดียว ลดโค้ดซ้ำ
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
];
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await expect(page).toHaveScreenshot(\`\${vp.name}.png\`);
}`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า viewport เป็น <code>{ width: 375, height: 667 }</code><br/>
    2. ถ่ายภาพเปรียบเทียบชื่อ <code>'mobile.png'</code>`
  },
  {
    id: "full_page_screenshot",
    meta: "บทที่ 3",
    title: "Full Page Screenshot: ถ่ายภาพทั้งหน้าที่ยาวเกินจอ",
    template: `// สถานการณ์: หน้า Investment Timeline ยาวเกินจอ ต้องเลื่อนดูหลายรอบ
// 1. ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดู ด้วย option fullPage: true
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการถ่ายภาพ Full Page...");
      const src = stripComments(code);
      const hasFullPage = /fullPage:\s*true/.test(src);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasFullPage) {
        throw new Error("ไม่พบการตั้งค่า fullPage: true\nตัวอย่าง: await expect(page).toHaveScreenshot({ fullPage: true });");
      }
      log("✓ ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดูถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option ที่บอกให้ถ่ายภาพความสูงทั้งหมดของหน้า ไม่ใช่แค่ส่วนที่มองเห็นในจอ — ชื่อ option สื่อความหมายตรงตัวว่า 'เต็มหน้า'",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดู', async ({ page }) => {
  await page.goto('/timeline');
  await expect(page).toHaveScreenshot({ fullPage: true });
});`,
    theory: `ค่า default ของ <code>toHaveScreenshot()</code> ถ่ายภาพแค่<strong>ส่วนที่มองเห็นในจอ (viewport)</strong> เท่านั้น — ถ้าหน้าเว็บยาวเกินจอ (ต้องเลื่อนดู) เนื้อหาส่วนที่อยู่นอกจอจะไม่ถูกถ่ายภาพเลย ทำให้ Visual Regression พลาดบั๊กที่อยู่ใน section ที่มองไม่เห็นตอนแรก<br/><br/>
    <code>fullPage: true</code> สั่งให้ Playwright เลื่อนหน้าจอไปเรื่อยๆ แล้วต่อภาพทุกส่วนเข้าด้วยกันเป็นภาพเดียวยาวเท่าความสูงจริงของหน้า — เหมาะกับหน้าที่มีเนื้อหายาว เช่น <code>InvestmentTimeline.jsx</code> ของ My-Investment-Port ที่แสดงประวัติการลงทุนเป็นรายการยาวตามช่วงเวลา<br/><br/>
    ข้อควรระวัง: หน้าที่มีเนื้อหา<strong>โหลดเพิ่มตอนเลื่อน</strong> (infinite scroll / lazy load) อาจได้ผลลัพธ์ไม่คงที่ระหว่างการรันแต่ละครั้ง เพราะจำนวนแถวที่โหลดมาขึ้นกับจังหวะเวลาที่ถ่ายภาพพอดี — กรณีแบบนี้ควร screenshot เฉพาะ element ที่ต้องการแทนการใช้ <code>fullPage: true</code> ทั้งหน้า`,
    example: `// ถ่ายภาพเฉพาะ element เดียวที่ยาวเกินจอ (แทนทั้งหน้า)
await expect(page.getByTestId('timeline-list')).toHaveScreenshot();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพทั้งหน้าด้วย <code>toHaveScreenshot({ fullPage: true })</code>`
  },
  {
    id: "threshold_tuning",
    meta: "บทที่ 4",
    title: "Threshold Tuning: กันไม่ให้ False Positive จาก Font Rendering",
    template: `// สถานการณ์: baseline generate บน CI (Linux) แต่ dev รัน test บน macOS
// font rendering ต่างกันเล็กน้อยทำให้ diff เกิดขึ้นเสมอทั้งที่ไม่มีอะไรพัง
// 1. ถ่ายภาพเปรียบเทียบ พร้อมตั้งค่า maxDiffPixelRatio ให้ยอมรับความต่างเล็กน้อยได้ (0.02 = 2%)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Threshold...");
      const src = stripComments(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      const hasMaxDiffRatio = /maxDiffPixelRatio:\s*0\.02/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasMaxDiffRatio) {
        throw new Error("ไม่พบการตั้งค่า maxDiffPixelRatio: 0.02\nตัวอย่าง: await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });");
      }
      log("✓ ตั้งค่า threshold ให้ยอมรับความต่างเล็กน้อยถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option ที่กำหนดสัดส่วนพิกเซลสูงสุดที่ยอมให้ต่างจาก baseline ได้ ค่าเป็นทศนิยมระหว่าง 0-1 แทนเปอร์เซ็นต์ (0.02 = 2%)",
    solution: `import { test, expect } from '@playwright/test';

test('เทียบภาพโดยยอมรับความต่างเล็กน้อยจาก font rendering', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });
});`,
    theory: `ปัญหาจริงที่ทีมที่ใช้ Visual Regression Testing เจอบ่อยที่สุด: <strong>macOS กับ Linux render font ต่างกันเล็กน้อย</strong> (anti-aliasing, sub-pixel rendering ไม่เหมือนกัน) ถ้า baseline สร้างบน CI (มักรันบน Linux) แล้ว dev รัน test เดิมบนเครื่อง macOS ของตัวเอง — จะได้ diff เล็กๆ น้อยๆ ทุกครั้งทั้งที่ไม่มีอะไรพังจริง (false positive)<br/><br/>
    <code>maxDiffPixelRatio</code> กำหนดสัดส่วนพิกเซลที่ต่างกันได้สูงสุด (0.02 = ยอมรับความต่างได้ถึง 2% ของพิกเซลทั้งหมด) ก่อนจะถือว่า test fail จริง — ตั้งค่าน้อยเกินไปจะ false-positive บ่อย (เจอ diff จาก font rendering ทั้งที่ไม่มีบั๊กจริง) ตั้งค่ามากเกินไปจะพลาดบั๊กจริงที่ทำให้ layout เปลี่ยนแปลงชัดเจน<br/><br/>
    <strong>วิธีที่ถูกต้องที่สุด</strong> (ตามที่ track Playwright UI Testing เคยแนะนำไว้ในหัวข้อ Gotchas): <strong>generate baseline บน CI เสมอ ไม่ใช่บนเครื่อง local ของแต่ละคน</strong> — เพราะถ้าทุกคน (และ CI) รัน test เทียบกับ baseline ที่มาจากสภาพแวดล้อมเดียวกันเป๊ะ (Linux ของ CI) ปัญหา font-rendering-ต่างกันจะไม่เกิดขึ้นเลยตั้งแต่แรก การตั้ง <code>maxDiffPixelRatio</code> เป็นแค่ตาข่ายนิรภัยสำรอง ไม่ใช่ทางแก้หลัก`,
    example: `// ตัวอย่างตั้งค่าอีกแบบ: จำนวนพิกเซลตายตัวแทนสัดส่วน (เหมาะกับภาพขนาดคงที่)
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพเปรียบเทียบด้วย <code>toHaveScreenshot()</code><br/>
    2. ตั้งค่า <code>maxDiffPixelRatio: 0.02</code>`
  },
  {
    id: "combined_mask_and_threshold",
    meta: "ขั้นสูง 1",
    title: "รวมร่าง: Mask หลาย Element พร้อม Threshold ในการถ่ายภาพเดียว",
    template: `// สถานการณ์: หน้า Dashboard แสดงราคาหุ้น real-time (data-testid="watchlist-current-price")
// และเวลาล่าสุดที่อัปเดต (data-testid="last-updated-timestamp") พร้อมกัน
// นอกจากนี้ baseline ยัง generate มาจาก CI (Linux) ทำให้ font rendering ต่างจากเครื่อง local เล็กน้อย (เหมือนบทที่ 4)
// ต้องแก้ทั้งสองปัญหาพร้อมกันในการถ่ายภาพครั้งเดียว:
// 1. mask ทั้ง watchlist-current-price และ last-updated-timestamp (สองส่วนที่เปลี่ยนตลอดเวลา)
// 2. ตั้งค่า maxDiffPixelRatio เป็น 0.02 เพื่อกันความต่างเล็กน้อยจาก font rendering
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการรวม mask หลาย element + maxDiffPixelRatio...");
      const src = stripComments(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      const hasMaskOption = /mask:\s*\[/.test(src);
      if (!hasMaskOption) {
        throw new Error("ไม่พบ option mask: [...] ที่รวม locator ของส่วนที่เปลี่ยนตลอดเวลาทั้งสองส่วน");
      }
      const hasPriceTestId = /getByTestId\(\s*['"]watchlist-current-price['"]\s*\)/.test(src);
      const hasTimestampTestId = /getByTestId\(\s*['"]last-updated-timestamp['"]\s*\)/.test(src);
      if (!hasPriceTestId || !hasTimestampTestId) {
        throw new Error("mask ต้องครอบคลุมทั้งสอง locator: page.getByTestId('watchlist-current-price') และ page.getByTestId('last-updated-timestamp')");
      }
      const hasMaxDiffRatio = /maxDiffPixelRatio:\s*0\.02/.test(src);
      if (!hasMaxDiffRatio) {
        throw new Error("ไม่พบการตั้งค่า maxDiffPixelRatio: 0.02 ร่วมกับ mask ในการถ่ายภาพเดียวกัน");
      }
      log("✓ รวม mask หลาย element และ maxDiffPixelRatio ในการถ่ายภาพเดียวถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ options object เดียว ที่ใส่ทั้ง mask (array ของหลาย locator ที่ได้จาก getByTestId) และ maxDiffPixelRatio เป็น key พร้อมกันได้ ลองนึกถึงบทที่ 1 (mask หลาย element) รวมกับบทที่ 4 (threshold) แล้วรวมสอง option เข้าใน object เดียว",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพ Dashboard โดย mask ส่วนที่เปลี่ยนตลอดเวลา และยอมรับความต่างเล็กน้อยจาก font rendering', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot({
    mask: [
      page.getByTestId('watchlist-current-price'),
      page.getByTestId('last-updated-timestamp'),
    ],
    maxDiffPixelRatio: 0.02,
  });
});`,
    theory: `บทเรียนนี้รวมสองปัญหาที่เจอแยกกันในบทที่ 1 (masking) และบทที่ 4 (threshold) เข้าด้วยกัน เพราะในงานจริง Dashboard หนึ่งหน้ามักมี<strong>ปัญหาซ้อนกันหลายอย่างพร้อมกัน</strong> ไม่ได้เจอทีละปัญหาเรียงลำดับสวยงามแบบในบทเรียน<br/><br/>
    <code>toHaveScreenshot()</code> รับ options object เดียว ดังนั้น <code>mask</code> และ <code>maxDiffPixelRatio</code> จึงเป็นแค่สอง key ใน object เดียวกัน — ไม่ต้องเรียก <code>toHaveScreenshot()</code> สองครั้งหรือแยกเป็นสอง assertion<br/><br/>
    ข้อควรระวัง: <code>mask</code> จัดการเฉพาะ "พื้นที่ที่รู้อยู่แล้วว่าเปลี่ยนตลอดเวลา" (ราคา, เวลา) ส่วน <code>maxDiffPixelRatio</code> จัดการ "ความต่างเล็กน้อยที่คาดเดาตำแหน่งไม่ได้" (font rendering, anti-aliasing) — สอง option นี้แก้ปัญหาคนละประเภท ใช้แทนกันไม่ได้ ต้องใช้ร่วมกันเมื่อหน้าเว็บมีทั้งสองปัญหาพร้อมกัน`,
    example: `// ตัวอย่าง: mask element เดียวแต่รวมกับ threshold (กรณีมีแค่ปัญหาเดียวของแต่ละฝั่ง)
await expect(page).toHaveScreenshot({
  mask: [page.getByTestId('live-clock')],
  maxDiffPixelRatio: 0.01,
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพด้วย <code>toHaveScreenshot()</code><br/>
    2. mask ทั้ง <code>data-testid="watchlist-current-price"</code> และ <code>data-testid="last-updated-timestamp"</code> ในการถ่ายภาพเดียวกัน<br/>
    3. ตั้งค่า <code>maxDiffPixelRatio: 0.02</code> ร่วมด้วยใน options object เดียวกัน`
  },
  {
    id: "flaky_font_animation_fix",
    meta: "ขั้นสูง 2",
    title: "Debug Flaky Test: Font โหลดไม่ทัน + CSS Animation กำลังเล่นอยู่",
    template: `// สถานการณ์: Test นี้ flaky บน CI — บางครั้งผ่าน บางครั้ง fail แบบสุ่ม ทั้งที่หน้าเว็บไม่มีอะไรเปลี่ยนแปลงจริง
// สาเหตุ: (1) font ยังโหลดไม่เสร็จตอนถ่ายภาพ (2) มี CSS animation (fade-in) กำลังเล่นอยู่พอดีตอนถ่ายภาพ
// โค้ดด้านล่างพยายามแก้ด้วย blind wait ซึ่ง "เดา" เวลาไปเฉยๆ ไม่ได้รับประกันว่า font โหลดเสร็จหรือ animation จบจริง
// ทำให้ยัง flaky อยู่บางครั้ง (เครื่องช้ากว่าที่เดาไว้ ก็ยังไม่จบทัน)
import { test, expect } from '@playwright/test';

test('ถ่ายภาพหน้า Dashboard อย่างเสถียร ไม่ flaky จาก font และ animation', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForTimeout(2000); // ผิด: blind wait เดาเวลา ไม่รับประกันความเสถียรจริง
  await expect(page).toHaveScreenshot();
});

// TODO: แก้ไขให้ถูกต้อง แทนที่ blind wait ด้านบนด้วย:
// 1. ปิด CSS animation ก่อนถ่ายภาพ ด้วยการตั้งค่า context/test option ที่เกี่ยวกับการลดการเคลื่อนไหว
// 2. รอสัญญาณจริงว่า font โหลดเสร็จสมบูรณ์ก่อนถ่ายภาพ
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแก้ไข Flaky Test จาก Font/Animation...");
      const src = stripComments(code);
      const hasBlindWait = /waitForTimeout\(/.test(src);
      if (hasBlindWait) {
        throw new Error("ยังพบ page.waitForTimeout() อยู่ — เป็น blind wait ที่เดาเวลาเฉยๆ ไม่รับประกันความเสถียรจริง ต้องเอาออกแล้วรอสัญญาณที่แท้จริงแทน");
      }
      const hasReducedMotion = /reducedMotion:\s*['"]reduce['"]/.test(src);
      if (!hasReducedMotion) {
        throw new Error("ไม่พบการปิด CSS animation ด้วย option reducedMotion: 'reduce'\nตัวอย่าง: test.use({ reducedMotion: 'reduce' });");
      }
      const hasFontReady = /document\.fonts\.ready/.test(src);
      const hasNetworkIdle = /waitForLoadState\(\s*['"]networkidle['"]\s*\)/.test(src);
      if (!hasFontReady && !hasNetworkIdle) {
        throw new Error("ไม่พบการรอความเสถียรก่อนถ่ายภาพ — ต้องรอ font โหลดเสร็จด้วย document.fonts.ready หรือรอ page.waitForLoadState('networkidle')");
      }
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      log("✓ แก้ไข Flaky Test ด้วยการรอความเสถียรที่แท้จริง (ไม่ใช่ blind wait) ถูกต้อง");
    },
    hint: "แทนที่ blind wait ด้วยสองอย่างร่วมกัน: (1) ปิด animation ด้วย context/test option ที่ปิดการเคลื่อนไหวตามการตั้งค่า prefers-reduced-motion ของระบบ (Playwright มี option ระดับ context ให้ตรงนี้) และ (2) รอ Promise ที่ browser มีให้อยู่แล้วสำหรับเช็คว่า font ทั้งหมดโหลดเสร็จ (อยู่ใต้ object ของ document ที่เกี่ยวกับ fonts)",
    solution: `import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('ถ่ายภาพหน้า Dashboard อย่างเสถียร ไม่ flaky จาก font และ animation', async ({ page }) => {
  await page.goto('/dashboard');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot();
});`,
    theory: `Flaky visual test (บางครั้งผ่าน บางครั้ง fail แบบสุ่ม โดยไม่มีอะไรเปลี่ยนจริง) ต่างจาก false positive ที่คงที่ (เช่น font-rendering ต่างเครื่องในบทที่ 4) ตรงที่<strong>ผลลัพธ์ไม่คงที่แม้รันซ้ำบนเครื่องเดียวกัน</strong> — สาเหตุหลักสองอย่างที่พบบ่อยที่สุดคือ font ที่โหลดผ่านเครือข่ายยังมาไม่ครบตอนถ่ายภาพ (บางครั้งมาทัน บางครั้งไม่ทัน) และ CSS animation/transition ที่กำลังเล่นอยู่พอดี (จับภาพได้คนละ frame ทุกครั้งที่รัน)<br/><br/>
    <strong>ทำไม <code>page.waitForTimeout()</code> ไม่ใช่ทางแก้ที่ถูกต้อง:</strong> เป็นการ "เดา" ตัวเลขเวลาคงที่ ซึ่งไม่รับประกันอะไรเลย — เครื่อง CI ที่ช้ากว่าปกติ (เช่น ตอน CI คิวงานหนัก) อาจยังโหลด font ไม่เสร็จแม้รอเกินเวลาที่เดาไว้ ในขณะที่เครื่องเร็วก็รอเสียเวลาโดยไม่จำเป็น<br/><br/>
    <strong>ทางแก้ที่ถูกต้อง</strong> คือรอ "สัญญาณจริง" แทนการเดาเวลา: <code>document.fonts.ready</code> คือ Promise มาตรฐานของ browser ที่ resolve เมื่อฟอนต์ทั้งหมดโหลดเสร็จจริง (เรียกผ่าน <code>page.evaluate()</code>) ส่วนการปิด CSS animation ทำได้ผ่าน context option <code>reducedMotion: 'reduce'</code> ซึ่งบอก browser ให้ส่งสัญญาณ <code>prefers-reduced-motion: reduce</code> — เว็บที่เขียน CSS animation ให้เคารพ media query นี้ (แนวทางที่ดีอยู่แล้วเพื่อ accessibility) จะปิด/ข้าม animation ไปเอง ทำให้ทุกครั้งที่ถ่ายภาพ ได้ frame สุดท้ายที่นิ่งแล้วเสมอ`,
    example: `// ทางเลือกอื่นสำหรับรอความเสถียร: รอ network idle แทนรอ font โดยตรง
// (เหมาะกับกรณีที่ font โหลดมาพร้อมกับ resource อื่นๆ ผ่าน network เดียวกัน)
test.use({ reducedMotion: 'reduce' });
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
await expect(page).toHaveScreenshot();`,
    task: `จงแก้ไขสคริปต์ทดสอบที่ flaky ให้เสถียร โดย:<br/>
    1. เอา <code>page.waitForTimeout()</code> (blind wait) ออก<br/>
    2. ปิด CSS animation ด้วย <code>reducedMotion: 'reduce'</code><br/>
    3. รอ font โหลดเสร็จด้วย <code>document.fonts.ready</code> (หรือรอ <code>page.waitForLoadState('networkidle')</code>) ก่อนถ่ายภาพด้วย <code>toHaveScreenshot()</code>`
  }
];

// Application state

const PREFIX = 'visual';
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
    <div class="terminal-line info">npx playwright test ${lesson.id}.spec.ts --project=visual</div>
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
        <div class="terminal-line success">1 passed (156ms)</div>
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
        <div class="terminal-line error">1 failed (44ms)</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Visual Regression Testing แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการใช้ toHaveScreenshot(), Masking, Responsive Check, Full Page และ Threshold Tuning ในงาน QA จริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
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
  window.QA_TRACKS['visual-regression-testing'] = { id: 'visual-regression-testing', title: 'Visual Regression Testing', folder: 'Visual-Regression-Testing', lessons: LESSONS };
})();
