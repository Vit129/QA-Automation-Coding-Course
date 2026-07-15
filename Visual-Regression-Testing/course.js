// Visual Regression Testing Interactive Coding Playground Data and Logic
// Grounded in My-Investment-Port's real live-price display (QuickBuyWatchlist.jsx's
// currentPrice) for the masking lesson - a real dynamic-content source that would false-
// positive an unmasked visual diff. Threshold-tuning callback references the same CI-
// baseline gotcha already noted in the Playwright UI Testing track's own references.

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
      const hasScreenshot = /await expect\(page\)\.toHaveScreenshot\(\)/.test(code);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()\nตัวอย่าง: await expect(page).toHaveScreenshot();");
      }
      log("✓ ถ่ายภาพหน้าจอเปรียบเทียบกับ baseline ถูกต้อง");
    },
    hint: "await expect(page).toHaveScreenshot();",
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
      const hasMaskOption = /mask:\s*\[/.test(code);
      const hasCorrectTestId = /watchlist-current-price/.test(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(code);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasMaskOption) {
        throw new Error("ไม่พบ option mask: [...]\nตัวอย่าง: await expect(page).toHaveScreenshot({ mask: [page.getByTestId('watchlist-current-price')] });");
      }
      if (!hasCorrectTestId) {
        throw new Error("mask ต้องเจาะจงไปที่ data-testid='watchlist-current-price'");
      }
      log("✓ Mask เนื้อหาที่เปลี่ยนตลอดเวลาก่อนเทียบภาพถูกต้อง");
    },
    hint: "await expect(page).toHaveScreenshot({ mask: [page.getByTestId('watchlist-current-price')] });",
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
      const hasSetViewport = /setViewportSize\(\{\s*width:\s*375,\s*height:\s*667\s*\}\)/.test(code);
      const hasNamedScreenshot = /toHaveScreenshot\(['"]mobile\.png['"]\)/.test(code);
      if (!hasSetViewport) {
        throw new Error("ไม่พบการตั้งค่า viewport 375x667\nตัวอย่าง: await page.setViewportSize({ width: 375, height: 667 });");
      }
      if (!hasNamedScreenshot) {
        throw new Error("ไม่พบการถ่ายภาพชื่อ 'mobile.png'\nตัวอย่าง: await expect(page).toHaveScreenshot('mobile.png');");
      }
      log("✓ เทส Responsive Visual สำหรับ viewport มือถือถูกต้อง");
    },
    hint: "await page.setViewportSize({ width: 375, height: 667 }); แล้ว await expect(page).toHaveScreenshot('mobile.png');",
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
      const hasFullPage = /fullPage:\s*true/.test(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(code);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasFullPage) {
        throw new Error("ไม่พบการตั้งค่า fullPage: true\nตัวอย่าง: await expect(page).toHaveScreenshot({ fullPage: true });");
      }
      log("✓ ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดูถูกต้อง");
    },
    hint: "await expect(page).toHaveScreenshot({ fullPage: true });",
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
      const hasScreenshot = /toHaveScreenshot\(/.test(code);
      const hasMaxDiffRatio = /maxDiffPixelRatio:\s*0\.02/.test(code);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasMaxDiffRatio) {
        throw new Error("ไม่พบการตั้งค่า maxDiffPixelRatio: 0.02\nตัวอย่าง: await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });");
      }
      log("✓ ตั้งค่า threshold ให้ยอมรับความต่างเล็กน้อยถูกต้อง");
    },
    hint: "await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });",
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
