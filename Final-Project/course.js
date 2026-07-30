(function() {
// Final Project: Japan Concert Trip (All-in-One Capstone Suite)
// Scenario: ทริปดูคอนเสิร์ตที่โตเกียว ญี่ปุ่น (Sequential E2E Workflow)
//   - วันออกเดินทาง (Departure Date): 2026-10-14
//   - วันดูคอนเสิร์ต (Concert Date): 2026-10-16 (Tokyo Dome)
//   - วันเดินทางกลับ (Return Date): 2026-10-18
//   - เอกสาร: พาสปอร์ตไทย (อายุเหลือ > 6 เดือน) + ฟรีวีซ่าญี่ปุ่น (ไม่เกิน 15 วัน)

const PREFIX = 'final_project';
const TAB_WIDTH = 2;

function stripComments(code) {
  const clean = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/\.(GET|POST|PUT|DELETE|PATCH)\s*\(/.test(clean)) {
    const match = clean.match(/\.(GET|POST|PUT|DELETE|PATCH)\s*\(/)[1];
    throw new Error(`⚠️ ข้อผิดพลาด: Playwright และ JavaScript เป็น Case-sensitive กรุณาใช้ตัวพิมพ์เล็ก .${match.toLowerCase()}() เท่านั้น (ห้ามใช้ตัวพิมพ์ใหญ่ .${match})`);
  }
  return clean;
}

const LESSONS = [
  {
    id: "fp_db_schema",
    meta: "ขั้นตอนที่ 1 จาก 6: วางโครงสร้างตารางฐานข้อมูล",
    title: "1. [Step 1/6] ออกแบบ DB Schema รองรับการจองทริปโตเกียว",
    template: `-- [Step 1/6] ออกแบบ Database Schema สำหรับทริปคอนเสิร์ตญี่ปุ่น:
-- 1. สร้างตาราง japan_trip_bookings พร้อมคอลัมน์:
--    id (PRIMARY KEY), user_name, concert_date, departure_date, return_date, passport_no, status
-- WRITE YOUR SQL CODE HERE

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Step 1/6] กำลังตรวจสอบโครงสร้าง Database Schema...");
      if (/CREATE\s+TABLE\s+japan_trip_bookings/i.test(clean)) {
        log("✓ ขั้นตอนที่ 1: คำสั่ง CREATE TABLE japan_trip_bookings ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง CREATE TABLE japan_trip_bookings");
      }

      if (/passport_no/i.test(clean) && /concert_date/i.test(clean) && /departure_date/i.test(clean) && /return_date/i.test(clean)) {
        log("✓ ขั้นตอนที่ 2: มีคอลัมน์ concert_date, departure_date, return_date, passport_no ครบถ้วน");
      } else {
        throw new Error("คอลัมน์ไม่ครบถ้วน ต้องมี concert_date, departure_date, return_date, passport_no");
      }
    },
    hint: "สร้างตาราง CREATE TABLE japan_trip_bookings (id INT PRIMARY KEY, user_name VARCHAR(100), concert_date DATE, departure_date DATE, return_date DATE, passport_no VARCHAR(20), status VARCHAR(20));",
    solution: `CREATE TABLE japan_trip_bookings (
  id INT PRIMARY KEY,
  user_name VARCHAR(100),
  concert_date DATE,
  departure_date DATE,
  return_date DATE,
  passport_no VARCHAR(20),
  status VARCHAR(20)
);`,
    theory: `🏁 <strong>จุดเริ่มต้น Workflow (Step 1/6):</strong> ก่อนจะสร้างระบบจองทริปดูคอนเสิร์ตที่โตเกียว (บิน 14 ต.ค. / ดูคอน 16 ต.ค. / กลับ 18 ต.ค.) เราต้องวางรากฐาน Database Schema ตาราง <code>japan_trip_bookings</code> ก่อน เพื่อเป็นจุดรองรับข้อมูลจาก API และ Web UI ในขั้นตอนถัดไป!`,
    example: `CREATE TABLE example_bookings (
  id INT PRIMARY KEY,
  user_name VARCHAR(100),
  booking_date DATE
);`,
    task: `จงเขียนคำสั่ง SQL สร้างตาราง <code>japan_trip_bookings</code> ที่มีคอลัมน์ <code>id</code>, <code>user_name</code>, <code>concert_date</code>, <code>departure_date</code>, <code>return_date</code>, <code>passport_no</code>, และ <code>status</code>`
  },
  {
    id: "fp_api_booking",
    meta: "ขั้นตอนที่ 2 จาก 6: ทดสอบยิง API จองทริปบันทึกลง DB",
    title: "2. [Step 2/6] ยิง Playwright API จองตั๋วบันทึกลง DB",
    template: `import { test, expect } from '@playwright/test';

test('FP-4002: จองตั๋วเที่ยวบิน + ตั๋วคอนเสิร์ตญี่ปุ่นผ่าน API', async ({ request }) => {
  // 1. ยิง POST ไปที่ /api/japan-trip/book พร้อม data:
  //    departureDate: '2026-10-14', concertDate: '2026-10-16', returnDate: '2026-10-18', passportNo: 'TH1234567'
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 200


  // 3. ตรวจสอบว่า body.status เป็น 'CONFIRMED'

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Step 2/6] กำลังตรวจสอบสคริปต์ Playwright API...");
      if (/await\s+request\.post\(['"]\/api\/japan-trip\/book['"]/.test(clean)) {
        log("✓ ขั้นตอนที่ 1: ยิง request.post('/api/japan-trip/book') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.post('/api/japan-trip/book', { data: ... })");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 200\nตัวอย่าง: expect(response.status()).toBe(200);");
      }

      if (/expect\(body\.status\)\.toBe\(['"]CONFIRMED['"]\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบ body.status เป็น 'CONFIRMED' ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบว่า body.status เป็น 'CONFIRMED'");
      }
    },
    hint: "ยิง POST ไปที่ /api/japan-trip/book พร้อม data แล้วเช็ค expect(response.status()).toBe(200); จากนั้น const body = await response.json(); expect(body.status).toBe('CONFIRMED');",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4002: จองตั๋วเที่ยวบิน + ตั๋วคอนเสิร์ตญี่ปุ่นผ่าน API', async ({ request }) => {
  const response = await request.post('/api/japan-trip/book', {
    data: {
      departureDate: '2026-10-14',
      concertDate: '2026-10-16',
      returnDate: '2026-10-18',
      passportNo: 'TH1234567'
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.status).toBe('CONFIRMED');
});`,
    theory: `🔗 <strong>ต่อยอดจาก Step 1 (Step 2/6):</strong> เมื่อตาราง DB พร้อมแล้ว ตอนนี้เราต้องเขียน Playwright API ยิง POST ไปที่ <code>/api/japan-trip/book</code> ส่งข้อมูลทริป (14-18 ต.ค.) เพื่อบันทึกการจองลงตาราง <code>japan_trip_bookings</code> ที่สร้างใน Step 1 และตรวจสถานะ CONFIRMED`,
    example: `const response = await request.post('/api/example', {
  data: { status: 'PENDING' }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ยิง POST ไปที่ <code>/api/japan-trip/book</code> พร้อมข้อมูลทริป เช็ค status <code>200</code> และ <code>body.status</code> เป็น <code>CONFIRMED</code>`
  },
  {
    id: "fp_visa_passport_security",
    meta: "ขั้นตอนที่ 3 จาก 6: ตรวจสอบสิทธิ์เดินทาง & ฟรีวีซ่า",
    title: "3. [Step 3/6] ตรวจสอบพาสปอร์ต & สิทธิ์ฟรีวีซ่าญี่ปุ่น 15 วัน",
    template: `import { test, expect } from '@playwright/test';

test('FP-4003: ตรวจสอบพาสปอร์ตไทย และระยะเวลาพำนักไม่เกิน 15 วัน', async ({ request }) => {
  // 1. ยิง POST /api/japan-trip/verify-visa พร้อมระยะเวลาเดินทาง 14 ต.ค. ถึง 18 ต.ค. (4 วัน)
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 200


  // 3. ตรวจสอบว่า body.visaRequired เป็น false (ฟรีวีซ่า 15 วัน)

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Step 3/6] กำลังตรวจสอบเงื่อนไข Passport & Visa...");
      if (/await\s+request\.post\(['"]\/api\/japan-trip\/verify-visa['"]/.test(clean)) {
        log("✓ ขั้นตอนที่ 1: ยิง request.post('/api/japan-trip/verify-visa') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.post('/api/japan-trip/verify-visa', ...)");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 200");
      }

      if (/expect\(body\.visaRequired\)\.toBe\(false\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบ body.visaRequired เป็น false ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ body.visaRequired เป็น false (ฟรีวีซ่าไม่เกิน 15 วัน)");
      }
    },
    hint: "ยิง POST ไปที่ /api/japan-trip/verify-visa เช็ค status 200 แล้วแปลง json เช็ค expect(body.visaRequired).toBe(false);",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4003: ตรวจสอบพาสปอร์ตไทย และระยะเวลาพำนักไม่เกิน 15 วัน', async ({ request }) => {
  const response = await request.post('/api/japan-trip/verify-visa', {
    data: {
      passportCountry: 'THA',
      stayDays: 4
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.visaRequired).toBe(false);
});`,
    theory: `🛡️ <strong>ต่อยอดจาก Step 2 (Step 3/6):</strong> API จองสำเร็จแล้ว แต่ก่อนจะให้ผู้ใช้ไปหน้าเว็บ เราต้องสร้าง Security Guard ตรวจสอบว่าพาสปอร์ตไทยนี้เดินทาง 4 วัน (14-18 ต.ค.) เข้าเงื่อนไขฟรีวีซ่าญี่ปุ่น 15 วันหรือไม่ (<code>visaRequired: false</code>)`,
    example: `const response = await request.post('/api/verify', {
  data: { country: 'THA', stayDays: 4 }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ยิง POST <code>/api/japan-trip/verify-visa</code> พร้อม <code>passportCountry: 'THA'</code> และ <code>stayDays: 4</code> แล้วเช็ค <code>body.visaRequired</code> เป็น <code>false</code>`
  },
  {
    id: "fp_web_ui_e2e",
    meta: "ขั้นตอนที่ 4 จาก 6: ทดสอบหน้าเว็บจองทริปบนเบราว์เซอร์จริง",
    title: "4. [Step 4/6] ทดสอบหน้าเว็บจองทริปญี่ปุ่นด้วย Playwright Web UI",
    template: `import { test, expect } from '@playwright/test';

test('FP-4004: กรอกวันเดินทาง เลือกตั๋วคอนเสิร์ตโตเกียว และยืนยันจอง', async ({ page }) => {
  // 1. ไปที่หน้า /japan-trip
  // WRITE YOUR CODE HERE


  // 2. กรอกวันเดินทาง 2026-10-14 ใน #departure-date


  // 3. คลิกปุ่มจองตั๋ว #confirm-booking-btn


  // 4. ตรวจสอบว่าข้อความสำเร็จ #booking-status มีคำว่า 'Booking Successful'

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Step 4/6] กำลังตรวจสอบ Playwright Web UI Test...");
      if (/await\s+page\.goto\(['"]\/japan-trip['"]\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 1: สั่ง page.goto('/japan-trip') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.goto('/japan-trip')");
      }

      if (/await\s+page\.fill\(['"]#departure-date['"]\s*,\s*['"]2026-10-14['"]\)/.test(clean) || /await\s+page\.locator\(['"]#departure-date['"]\)\.fill\(['"]2026-10-14['"]\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 2: กรอกวันเดินทาง #departure-date ถูกต้อง");
      } else {
        throw new Error("ไม่พบการกรอก #departure-date ด้วย '2026-10-14'");
      }

      if (/await\s+page\.click\(['"]#confirm-booking-btn['"]\)/.test(clean) || /await\s+page\.locator\(['"]#confirm-booking-btn['"]\)\.click\(\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 3: คลิกปุ่ม #confirm-booking-btn ถูกต้อง");
      } else {
        throw new Error("ไม่พบการคลิกปุ่ม #confirm-booking-btn");
      }

      if (/expect\(page\.locator\(['"]#booking-status['"]\)\)\.toContainText\(['"]Booking Successful['"]\)/.test(clean) || /expect\(await\s+page\.textContent\(['"]#booking-status['"]\)\)\.toContain\(['"]Booking Successful['"]\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 4: ตรวจสอบข้อความ #booking-status ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ #booking-status ว่ามีคำว่า 'Booking Successful'");
      }
    },
    hint: "ใช้ page.goto('/japan-trip'); page.fill('#departure-date', '2026-10-14'); page.click('#confirm-booking-btn'); expect(page.locator('#booking-status')).toContainText('Booking Successful');",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4004: กรอกวันเดินทาง เลือกตั๋วคอนเสิร์ตโตเกียว และยืนยันจอง', async ({ page }) => {
  await page.goto('/japan-trip');
  await page.fill('#departure-date', '2026-10-14');
  await page.click('#confirm-booking-btn');
  await expect(page.locator('#booking-status')).toContainText('Booking Successful');
});`,
    theory: `💻 <strong>ต่อยอดจาก Step 3 (Step 4/6):</strong> Backend & Visa Check ผ่านแล้ว! คราวนี้ผู้ใช้จะเปิดหน้าเว็บ <code>/japan-trip</code> เพื่อเลือกวันออกเดินทาง (14 ต.ค.) และกดปุ่ม <code>#confirm-booking-btn</code> ให้ระบบเรียก API จาก Step 2-3 และแสดงผล 'Booking Successful'`,
    example: `await page.goto('/japan-trip');
await page.fill('#departure-date', '2026-10-14');
await page.click('#confirm-booking-btn');`,
    task: `เขียนสคริปต์ Playwright UI ไปที่ <code>/japan-trip</code> กรอก <code>#departure-date</code> เป็น <code>'2026-10-14'</code> กด <code>#confirm-booking-btn</code> และตรวจ <code>#booking-status</code> มีคำว่า <code>'Booking Successful'</code>`
  },
  {
    id: "fp_mobile_eticket",
    meta: "ขั้นตอนที่ 5 จาก 6: ดึง E-Ticket บนแอปมือถือ",
    title: "5. [Step 5/6] ดึง E-Ticket QR Code บนแอปมือถือด้วย Robot Framework",
    template: `*** Settings ***
Documentation    ทดสอบเปิดแอปมือถือแสดง E-Ticket คอนเสิร์ตญี่ปุ่น
Library          Browser

*** Test Cases ***
FP-4005: ตรวจสอบ E-Ticket QR Code บนแอปมือถือ
    # 1. เปิดหน้าแอปมือถือไปที่ /mobile/e-ticket
    # WRITE YOUR CODE HERE


    # 2. ตรวจสอบว่ามีข้อความ "Japan Concert E-Ticket" บนหน้าจอ

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Step 5/6] กำลังตรวจสอบ Robot Framework Mobile Script...");
      if (/New Page\s+https?:.*\/mobile\/e-ticket/i.test(clean) || /New Page\s+\/mobile\/e-ticket/i.test(clean) || /Open Browser\s+.*\/mobile\/e-ticket/i.test(clean)) {
        log("✓ ขั้นตอนที่ 1: เปิดหน้าแอปมือถือ /mobile/e-ticket ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งเปิดหน้า /mobile/e-ticket (ตัวอย่าง: New Page  /mobile/e-ticket)");
      }

      if (/Get Text\s+.*contains\s+Japan Concert E-Ticket/i.test(clean) || /Should Contain\s+.*Japan Concert E-Ticket/i.test(clean) || /Get Text\s+#ticket-title\s+==\s+Japan Concert E-Ticket/i.test(clean) || /Element Should Be Visible\s+.*Japan Concert E-Ticket/i.test(clean)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ 'Japan Concert E-Ticket' ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ 'Japan Concert E-Ticket' บนหน้าจอแอปมือถือ");
      }
    },
    hint: "ใช้ New Page  /mobile/e-ticket  แล้วเช็ค Get Text  #ticket-title  ==  Japan Concert E-Ticket",
    solution: `*** Settings ***
Documentation    ทดสอบเปิดแอปมือถือแสดง E-Ticket คอนเสิร์ตญี่ปุ่น
Library          Browser

*** Test Cases ***
FP-4005: ตรวจสอบ E-Ticket QR Code บนแอปมือถือ
    New Page    /mobile/e-ticket
    \${title}=   Get Text    #ticket-title
    Should Contain    \${title}    Japan Concert E-Ticket`,
    theory: `📱 <strong>ต่อยอดจาก Step 4 (Step 5/6):</strong> เมื่อจองบนเว็บสำเร็จแล้ว ผู้ใช้จะเปิดแอปมือถือไปที่ <code>/mobile/e-ticket</code> เพื่อดึงตั๋วคอนเสิร์ตและ Boarding Pass ที่สร้างไว้ในระบบขึ้นมาแสดงบนหน้าจอ <code>#ticket-title</code>`,
    example: `New Page    /mobile/e-ticket
\${title}=   Get Text    #ticket-title`,
    task: `จงเขียน Robot Framework keyword เปิดหน้า <code>/mobile/e-ticket</code> และตรวจสอบว่า <code>#ticket-title</code> มีข้อความ <code>Japan Concert E-Ticket</code>`
  },
  {
    id: "fp_cicd_pipeline",
    meta: "ขั้นตอนที่ 6 จาก 6: มัดรวมสคริปต์รันบน CI/CD Pipeline",
    title: "6. [Step 6/6] รวมสคริปต์จาก Step 1-5 ไปรันบน GitHub Actions CI/CD",
    template: `# GitHub Actions Workflow สำหรับ Final Project: Japan Concert Trip
name: Japan Concert Trip Capstone Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout โค้ดด้วย actions/checkout@v4
      # WRITE YOUR YAML CODE HERE


      # 2. รันสคริปต์ทดสอบทั้งหมดด้วย npm test

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Step 6/6] กำลังตรวจสอบ GitHub Actions YAML...");
      if (/uses:\s*actions\/checkout@v4/.test(clean) || /uses:\s*actions\/checkout@v3/.test(clean)) {
        log("✓ ขั้นตอนที่ 1: กำหนด uses: actions/checkout@v4 ถูกต้อง");
      } else {
        throw new Error("ไม่พบขั้นตอน uses: actions/checkout@v4");
      }

      if (/run:\s*npm\s+test/.test(clean)) {
        log("✓ ขั้นตอนที่ 2: กำหนด run: npm test ถูกต้อง");
      } else {
        throw new Error("ไม่พบขั้นตอน run: npm test");
      }
    },
    hint: "ใส่ - uses: actions/checkout@v4 และ - run: npm test ใต้ steps:",
    solution: `# GitHub Actions Workflow สำหรับ Final Project: Japan Concert Trip
name: Japan Concert Trip Capstone Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test`,
    theory: `🎉 <strong>จุดสิ้นสุด Workflow (Step 6/6):</strong> เรามีครบตั้งแต่ DB ➔ API ➔ Visa Check ➔ Web UI ➔ Mobile App แล้ว! ขั้นตอนสุดท้ายคือการนำสคริปต์ทั้งหมดไปผูกใน GitHub Actions YAML เพื่อให้ระบบรัน Automate ทั้งหมดทุกครั้งที่มีการเปลี่ยนโค้ด!`,
    example: `steps:
  - uses: actions/checkout@v4
  - run: npm test`,
    task: `จงเขียน YAML สเต็ป <code>uses: actions/checkout@v4</code> และ <code>run: npm test</code> ใน GitHub Actions Workflow`
  }
];

function runSandboxCode() {
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal) return;

  const code = textarea.value;
  const lesson = LESSONS[currentLessonIndex];
  const logs = [];
  const appendLog = (msg) => logs.push(msg);

  terminal.innerHTML = `
    <div class="terminal-line info">$ running capstone test runner...</div>
    <div class="terminal-line text-muted">Running test: ${lesson.title}...</div>
  `;

  setTimeout(() => {
    try {
      lesson.validate(code, appendLog);

      terminal.innerHTML += logs.map(l => `<div class="terminal-line success">${escapeHtml(l)}</div>`).join('');
      terminal.innerHTML += `
        <div class="terminal-line info">---------------------------------------------------</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: ผ่านการประเมิน (Passed)</strong></div>
        <div class="terminal-line success">1 passed (24ms)</div>
      `;

      setLessonCompleted(lesson.id);

      const nextBtn = document.getElementById('next-lesson-btn');
      if (nextBtn) {
        if (currentLessonIndex < LESSONS.length - 1) {
          nextBtn.innerText = 'เรียนรู้บทเรียนถัดไป →';
          nextBtn.onclick = () => {
            selectLesson(currentLessonIndex + 1);
          };
        } else {
          nextBtn.innerText = '🎓 สำเร็จโปรเจกต์จบ!';
          nextBtn.onclick = () => {
            if (overlay) overlay.classList.remove('show');
            showGraduationMessage();
          };
        }
      }

      if (overlay) overlay.classList.add('show');
    } catch (err) {
      terminal.innerHTML += logs.map(l => `<div class="terminal-line success">${escapeHtml(l)}</div>`).join('');
      terminal.innerHTML += `
        <div class="terminal-line info">---------------------------------------------------</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ไม่ผ่าน (Failed)</strong></div>
        <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed (38ms)</div>
      `;
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, 300);
}

function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  const totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณสำเร็จ Final Project: Japan Concert Trip แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} ขั้นตอน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพิสูจน์แล้วว่ามีความสามารถระดับ Senior QA Engineer ในการออกแบบและสร้าง Test Infrastructure ของระบบจริงตั้งแต่ DB ➔ API ➔ Security ➔ Web ➔ Mobile ➔ CI/CD Pipeline!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Japan Concert Trip Capstone');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LESSONS;
} else if (typeof window !== 'undefined') {
  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;

  if (!window.QA_TRACKS) window.QA_TRACKS = {};
  window.QA_TRACKS['final-project'] = {
    id: "Final-Project",
    title: "Final Project: Japan Concert Trip (All-in-One Capstone)",
    folder: "Final-Project",
    lessons: LESSONS
  };
}
})();
