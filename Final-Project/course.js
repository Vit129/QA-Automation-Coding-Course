(function() {
// Final Project: Japan Concert Trip (All-in-One Capstone Suite)
// Software & QA Engineering Lifecycle Architecture Spec (PRD & Acceptance Criteria Standard):
//   Phase 1: Test Framework & Environment Config
//   Phase 2: Database Schema Architecture (SQL)
//   Phase 3: Backend API Services (Booking Execution)
//   Phase 4: Security & Visa Guard
//   Phase 5: Web UI Automation (Page Object Model)
//   Phase 6: Mobile Client App Automation (E-Ticket)
//   Phase 7: Performance & Stress Testing (k6 Spike Test 1,000 VUs)
//   Phase 8: Continuous Integration Pipeline (GitHub Actions)
//   Phase 9 (Bonus): Advanced Algorithmic Challenge (DS&A Binary Search)

const PREFIX = 'final_project';
const TAB_WIDTH = 2;

function stripComments(code) {
  const clean = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(?<!:)\/\/.*$/gm, '');
  if (/\.(GET|POST|PUT|DELETE|PATCH)\s*\(/.test(clean)) {
    const match = clean.match(/\.(GET|POST|PUT|DELETE|PATCH)\s*\(/)[1];
    throw new Error(`⚠️ ข้อผิดพลาด: Playwright และ JavaScript เป็น Case-sensitive กรุณาใช้ตัวพิมพ์เล็ก .${match.toLowerCase()}() เท่านั้น (ห้ามใช้ตัวพิมพ์ใหญ่ .${match})`);
  }
  return clean;
}

const LESSONS = [
  {
    id: "fp_framework_design",
    meta: "Phase 1 จาก 9: Framework & Architecture Config",
    title: "1. [Phase 1] Test Framework & Environment Specification",
    template: `import { defineConfig } from '@playwright/test';

// [Phase 1 Spec] วางโครงสร้าง Config หลักของ Test Framework สำหรับทริปญี่ปุ่น:
// - AC-101: กำหนด baseURL เป็น 'https://japan-trip.test'
// - AC-102: กำหนด trace เป็น 'on-first-retry'
export default defineConfig({
  // WRITE YOUR CONFIG HERE

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 1 PRD Validation] กำลังตรวจสอบ Test Framework Config...");
      if (/baseURL:\s*['"]https:\/\/japan-trip\.test['"]/.test(clean)) {
        log("✓ [AC-101 Passed]: กำหนด baseURL: 'https://japan-trip.test' เป็นท่อกลางสำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-101]: กรุณากำหนด baseURL: 'https://japan-trip.test'");
      }

      if (/trace:\s*['"]on-first-retry['"]/.test(clean)) {
        log("✓ [AC-102 Passed]: กำหนด trace: 'on-first-retry' สำหรับ CI/CD สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-102]: กรุณากำหนด trace: 'on-first-retry'");
      }
    },
    hint: "ใส่ baseURL: 'https://japan-trip.test', trace: 'on-first-retry' ภายใน defineConfig({ use: { ... } });",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://japan-trip.test',
    trace: 'on-first-retry',
  },
});`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม QA Architecture และ DevOps ร่วมกันวางมาตรฐานนโยบาย Test Infrastructure สำหรับโปรเจกต์ทริปดูคอนเสิร์ตญี่ปุ่น เพื่อให้สคริปต์การทดสอบทุกเลเยอร์ (API, Web, Security) อ้างอิงศูนย์กลางเดียวกัน<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-101]</code>: ต้องสืบทอดสเปกกลางผ่าน <code>defineConfig</code> และกำหนด <code>baseURL: 'https://japan-trip.test'</code><br/>
    • <code>[AC-102]</code>: ต้องเปิดใช้งาน <code>trace: 'on-first-retry'</code> เพื่อบันทึกภาพ/วิดีโอร่องรอยบั๊กเฉพาะเมื่อทดสอบไม่ผ่าน<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> ห้าม Hardcode URL ลงในไฟล์เทสย่อยเด็ดขาด ต้องดึงจาก Config กลางเพื่อรองรับการเปลี่ยน Environment`,
    example: `export default defineConfig({
  use: {
    baseURL: 'https://japan-trip.test',
    trace: 'on-first-retry'
  }
});`,
    task: `จงสร้างไฟล์ Config ตามข้อกำหนด <code>[AC-101]</code> และ <code>[AC-102]</code> โดยใส่ <code>baseURL: 'https://japan-trip.test'</code> และ <code>trace: 'on-first-retry'</code>`
  },
  {
    id: "fp_db_schema",
    meta: "Phase 2 จาก 9: Data Architecture (SQL Schema)",
    title: "2. [Phase 2] Database Schema Architecture Specification",
    template: `-- [Phase 2 Spec] ออกแบบ Database Schema สำหรับทริปคอนเสิร์ตญี่ปุ่น:
-- AC-201: สร้างตาราง japan_trip_bookings พร้อม PRIMARY KEY id
-- AC-202: รองรับคอลัมน์ user_name, concert_date, departure_date, return_date, passport_no, status
-- WRITE YOUR SQL CODE HERE

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 2 PRD Validation] กำลังตรวจสอบ Database Schema...");
      if (/CREATE\s+TABLE\s+japan_trip_bookings/i.test(clean)) {
        log("✓ [AC-201 Passed]: คำสั่ง CREATE TABLE japan_trip_bookings ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-201]: ไม่พบคำสั่ง CREATE TABLE japan_trip_bookings");
      }

      if (/passport_no/i.test(clean) && /concert_date/i.test(clean) && /departure_date/i.test(clean) && /return_date/i.test(clean)) {
        log("✓ [AC-202 Passed]: คอลัมน์ concert_date, departure_date, return_date, passport_no ครบถ้วน");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-202]: คอลัมน์ไม่ครบถ้วน ต้องมี concert_date, departure_date, return_date, passport_no");
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
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 1 ทีม Data Engineering ออกแบบตาราง Relational Database เพื่อเป็นโครงสร้างพื้นฐานสำหรับเก็บข้อมูลทริปโตเกียว (บิน 14 ต.ค. / ดูคอน 16 ต.ค. / กลับ 18 ต.ค.)<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-201]</code>: สร้างตารางชื่อ <code>japan_trip_bookings</code> พร้อมคอลัมน์ <code>id</code> เป็น PRIMARY KEY<br/>
    • <code>[AC-202]</code>: รองรับการเก็บข้อมูล <code>user_name</code>, <code>concert_date</code>, <code>departure_date</code>, <code>return_date</code>, <code>passport_no</code>, และ <code>status</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> คอลัมน์วันที่ต้องใช้ประเภท <code>DATE</code> เพื่อรองรับการทำ Index และคำนวณช่วงเวลาพำนักในญี่ปุ่น`,
    example: `CREATE TABLE example_bookings (
  id INT PRIMARY KEY,
  user_name VARCHAR(100),
  booking_date DATE
);`,
    task: `จงเขียนคำสั่ง SQL สร้างตาราง <code>japan_trip_bookings</code> ตามเกณฑ์ <code>[AC-201]</code> และ <code>[AC-202]</code>`
  },
  {
    id: "fp_api_booking",
    meta: "Phase 3 จาก 9: Microservice API Specification",
    title: "3. [Phase 3] Booking Execution REST API Specification",
    template: `import { test, expect } from '@playwright/test';

test('FP-4003: จองตั๋วเที่ยวบิน + ตั๋วคอนเสิร์ตญี่ปุ่นผ่าน API', async ({ request }) => {
  // AC-301: ยิง POST ไปที่ /api/japan-trip/book พร้อม data ทริป 14-18 ต.ค. และ Passport TH1234567
  // WRITE YOUR CODE HERE


  // AC-302: ตรวจสอบ status 200 และ body.status เป็น 'CONFIRMED'

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 3 PRD Validation] กำลังตรวจสอบ REST API Integration...");
      if (/await\s+request\.post\(['"]\/api\/japan-trip\/book['"]/.test(clean)) {
        log("✓ [AC-301 Passed]: ยิง request.post('/api/japan-trip/book') ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-301]: ไม่พบคำสั่ง request.post('/api/japan-trip/book', { data: ... })");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(clean) && /expect\(body\.status\)\.toBe\(['"]CONFIRMED['"]\)/.test(clean)) {
        log("✓ [AC-302 Passed]: ได้รับ HTTP 200 OK และสถานะ body.status เป็น 'CONFIRMED'");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-302]: ต้องตรวจสอบ status code 200 และ body.status เป็น 'CONFIRMED'");
      }
    },
    hint: "ยิง POST ไปที่ /api/japan-trip/book พร้อม data แล้วเช็ค expect(response.status()).toBe(200); จากนั้น const body = await response.json(); expect(body.status).toBe('CONFIRMED');",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4003: จองตั๋วเที่ยวบิน + ตั๋วคอนเสิร์ตญี่ปุ่นผ่าน API', async ({ request }) => {
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
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 2 ทีม Backend Developer เปิดบริการ REST API Endpoint <code>/api/japan-trip/book</code> สำหรับบันทึกการจองตั๋วเที่ยวบินและตั๋วคอนเสิร์ตลงในตาราง DB<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-301]</code>: ส่งคำสั่ง POST Payload ข้อมูลทริปวันบิน (14 ต.ค.), วันดูคอน (16 ต.ค.), วันกลับ (18 ต.ค.) และเลข Passport<br/>
    • <code>[AC-302]</code>: ต้องได้รับการตอบกลับ HTTP Status <code>200 OK</code> และ Response Body <code>status: 'CONFIRMED'</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> API ต้องบันทึกสถิติแบบ Transactional ห้ามเกิดกรณีจองตั๋วสำเร็จแต่ไม่บันทึกลง DB`,
    example: `const response = await request.post('/api/example', {
  data: { status: 'PENDING' }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ยิง POST <code>/api/japan-trip/book</code> และตรวจสอบเกณฑ์ <code>[AC-301]</code> และ <code>[AC-302]</code>`
  },
  {
    id: "fp_visa_passport_security",
    meta: "Phase 4 จาก 9: Security & Compliance Guard",
    title: "4. [Phase 4] Passport & Visa Security Guard Specification",
    template: `import { test, expect } from '@playwright/test';

test('FP-4004: ตรวจสอบพาสปอร์ตไทย และระยะเวลาพำนักไม่เกิน 15 วัน', async ({ request }) => {
  // AC-401: ยิง POST /api/japan-trip/verify-visa ส่ง passportCountry: 'THA' และ stayDays: 4
  // WRITE YOUR CODE HERE


  // AC-402: ตรวจสอบ status 200 และ body.visaRequired เป็น false

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 4 PRD Validation] กำลังตรวจสอบ Security Compliance...");
      if (/await\s+request\.post\(['"]\/api\/japan-trip\/verify-visa['"]/.test(clean)) {
        log("✓ [AC-401 Passed]: ยิง request.post('/api/japan-trip/verify-visa') ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-401]: ไม่พบคำสั่ง request.post('/api/japan-trip/verify-visa', ...)");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(clean) && /expect\(body\.visaRequired\)\.toBe\(false\)/.test(clean)) {
        log("✓ [AC-402 Passed]: ได้รับสิทธิ์ยกเว้นวีซ่า (visaRequired: false) ถูกต้องตามกฎหมาย");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-402]: ต้องตรวจสอบ status code 200 และ body.visaRequired เป็น false");
      }
    },
    hint: "ยิง POST ไปที่ /api/japan-trip/verify-visa เช็ค status 200 แล้วแปลง json เช็ค expect(body.visaRequired).toBe(false);",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4004: ตรวจสอบพาสปอร์ตไทย และระยะเวลาพำนักไม่เกิน 15 วัน', async ({ request }) => {
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
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม InfoSec & Compliance กำหนดให้มี Security Guard ตรวจสอบความถูกต้องของพาสปอร์ตและเงื่อนไขการเข้าประเทศญี่ปุ่นก่อนอนุญาตให้จองตั๋ว<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-401]</code>: ส่งสเปกยิง POST ไปที่ <code>/api/japan-trip/verify-visa</code> พร้อม <code>passportCountry: 'THA'</code> และพำนัก 4 วัน (14-18 ต.ค.)<br/>
    • <code>[AC-402]</code>: ต้องตอบกลับ <code>visaRequired: false</code> สำหรับผู้ถือพาสปอร์ตไทยที่พำนักไม่เกิน 15 วัน<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> หากระยะเวลาพำนักเกิน 15 วัน ระบบต้องไม่อนุญาตให้ผ่านและตอบกลับ <code>visaRequired: true</code>`,
    example: `const response = await request.post('/api/verify', {
  data: { country: 'THA', stayDays: 4 }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ยิง POST <code>/api/japan-trip/verify-visa</code> ตามเกณฑ์ <code>[AC-401]</code> และ <code>[AC-402]</code>`
  },
  {
    id: "fp_web_ui_e2e",
    meta: "Phase 5 จาก 9: Web UI Page Object Model (POM)",
    title: "5. [Phase 5] Frontend Web E2E User Journey Specification",
    template: `import { test, expect } from '@playwright/test';

test('FP-4005: กรอกวันเดินทาง เลือกตั๋วคอนเสิร์ตโตเกียว และยืนยันจอง', async ({ page }) => {
  // AC-501: เปิดหน้า /japan-trip และกรอกวันเดินทาง 2026-10-14 ใน #departure-date
  // WRITE YOUR CODE HERE


  // AC-502: คลิก #confirm-booking-btn และตรวจ #booking-status มีคำว่า 'Booking Successful'

});`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 5 PRD Validation] กำลังตรวจสอบ Web UI E2E Journey...");
      if (/await\s+page\.goto\(['"]\/japan-trip['"]\)/.test(clean) && (/fill\(['"]#departure-date['"]\s*,\s*['"]2026-10-14['"]\)/.test(clean) || /locator\(['"]#departure-date['"]\)\.fill\(['"]2026-10-14['"]\)/.test(clean))) {
        log("✓ [AC-501 Passed]: เปิดหน้า /japan-trip และกรอกวันเดินทาง #departure-date ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-501]: ต้องสั่ง page.goto('/japan-trip') และ fill '#departure-date' ด้วย '2026-10-14'");
      }

      if (/click\(['"]#confirm-booking-btn['"]\)/.test(clean) && /toContainText\(['"]Booking Successful['"]\)/.test(clean)) {
        log("✓ [AC-502 Passed]: คลิกปุ่มยืนยันและได้รับการยืนยัน 'Booking Successful' บนหน้าจอ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-502]: ต้องสั่ง click('#confirm-booking-btn') และตรวจ #booking-status มีคำว่า 'Booking Successful'");
      }
    },
    hint: "ใช้ page.goto('/japan-trip'); page.fill('#departure-date', '2026-10-14'); page.click('#confirm-booking-btn'); expect(page.locator('#booking-status')).toContainText('Booking Successful');",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4005: กรอกวันเดินทาง เลือกตั๋วคอนเสิร์ตโตเกียว และยืนยันจอง', async ({ page }) => {
  await page.goto('/japan-trip');
  await page.fill('#departure-date', '2026-10-14');
  await page.click('#confirm-booking-btn');
  await expect(page.locator('#booking-status')).toContainText('Booking Successful');
});`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 1-4 เมื่อ Backend และ Security พร้อม ทีม Frontend UX/UI และ Web QA สร้างระบบ E2E Automation บนเบราว์เซอร์จริงตามสเปก Page Object Model<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-501]</code>: เปิดหน้าเว็บ <code>/japan-trip</code> (สืบทอดจาก Config Phase 1) และระบุวันออกเดินทาง <code>2026-10-14</code> ในช่อง <code>#departure-date</code><br/>
    • <code>[AC-502]</code>: คลิกปุ่มยืนยัน <code>#confirm-booking-btn</code> และตรวจการตอบกลับบน DOM element <code>#booking-status</code> ต้องมีคำว่า <code>'Booking Successful'</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> สคริปต์ต้องรอการตอบกลับจาก API (Auto-waiting) โดยไม่ใช้คำสั่งหลับแบบช้า <code>waitForTimeout</code>`,
    example: `await page.goto('/japan-trip');
await page.fill('#departure-date', '2026-10-14');
await page.click('#confirm-booking-btn');`,
    task: `จงเขียนสคริปต์ Playwright E2E บนหน้าเว็บตามเกณฑ์ <code>[AC-501]</code> และ <code>[AC-502]</code>`
  },
  {
    id: "fp_mobile_eticket",
    meta: "Phase 6 จาก 9: Mobile App Automation",
    title: "6. [Phase 6] Mobile Native App E-Ticket Specification",
    template: `*** Settings ***
Documentation    ทดสอบเปิดแอปมือถือแสดง E-Ticket คอนเสิร์ตญี่ปุ่น
Library          Browser

*** Test Cases ***
FP-4006: ตรวจสอบ E-Ticket QR Code บนแอปมือถือ
    # AC-601: เปิดหน้าแอปมือถือไปที่ /mobile/e-ticket
    # WRITE YOUR CODE HERE


    # AC-602: ตรวจสอบว่ามีข้อความ "Japan Concert E-Ticket" บนหน้าจอ

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 6 PRD Validation] กำลังตรวจสอบ Mobile Client App...");
      if (/New Page\s+https?:.*\/mobile\/e-ticket/i.test(clean) || /New Page\s+\/mobile\/e-ticket/i.test(clean) || /Open Browser\s+.*\/mobile\/e-ticket/i.test(clean)) {
        log("✓ [AC-601 Passed]: เปิดหน้าแอปมือถือ /mobile/e-ticket ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-601]: ไม่พบคำสั่งเปิดหน้า /mobile/e-ticket");
      }

      if (/Get Text\s+.*contains\s+Japan Concert E-Ticket/i.test(clean) || /Should Contain\s+.*Japan Concert E-Ticket/i.test(clean) || /Get Text\s+#ticket-title\s+==\s+Japan Concert E-Ticket/i.test(clean) || /Element Should Be Visible\s+.*Japan Concert E-Ticket/i.test(clean)) {
        log("✓ [AC-602 Passed]: ตรวจพบตั๋ว 'Japan Concert E-Ticket' บนหน้าจอแอปมือถือ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-602]: ไม่พบการตรวจสอบข้อความ 'Japan Concert E-Ticket'");
      }
    },
    hint: "ใช้ New Page  /mobile/e-ticket  แล้วเช็ค Get Text  #ticket-title  ==  Japan Concert E-Ticket",
    solution: `*** Settings ***
Documentation    ทดสอบเปิดแอปมือถือแสดง E-Ticket คอนเสิร์ตญี่ปุ่น
Library          Browser

*** Test Cases ***
FP-4006: ตรวจสอบ E-Ticket QR Code บนแอปมือถือ
    New Page    /mobile/e-ticket
    \${title}=   Get Text    #ticket-title
    Should Contain    \${title}    Japan Concert E-Ticket`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 5 เมื่อผู้ใช้จองสำเร็จบนเว็บแล้ว ทีม Mobile App พัฒนาสคริปต์ดึงตั๋ว E-Ticket และ QR Code มาแสดงบนแอปพลิเคชันมือถือสำหรับสแกนเข้าประตูเกตสนามบินและประตูหน้างานคอนเสิร์ต Tokyo Dome<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-601]</code>: ใช้ Robot Framework สั่งเปิดหน้าแอปมือถือ <code>/mobile/e-ticket</code><br/>
    • <code>[AC-602]</code>: ดึงข้อความจาก element <code>#ticket-title</code> และตรวจสอบว่ามีข้อความ <code>'Japan Concert E-Ticket'</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> ตั๋ว E-Ticket ต้องแสดงบาร์โค้ดสดและดึงข้อมูลวันดูคอนเสิร์ต 16 ต.ค. ได้ถูกต้องแม้ในโหมดออฟไลน์`,
    example: `New Page    /mobile/e-ticket
\${title}=   Get Text    #ticket-title`,
    task: `จงเขียน Robot Framework Keyword ตามเกณฑ์ <code>[AC-601]</code> และ <code>[AC-602]</code>`
  },
  {
    id: "fp_performance_k6",
    meta: "Phase 7 จาก 9: Performance Engineering (k6)",
    title: "7. [Phase 7] Performance Engineering & Ticket Spike Test Specification",
    template: `import http from 'k6/http';
import { check } from 'k6';

// AC-701: กำหนด vus: 1000 (จำลองแฟนคลับ 1,000 คนแย่งกดตั๋วพร้อมกัน)
// AC-702: กำหนด duration: '10s'
export const options = {
  // WRITE YOUR K6 OPTIONS HERE

};

export default function () {
  const res = http.get('https://japan-trip.test/api/seats');
  check(res, { 'status is 200': (r) => r.status === 200 });
}`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 7 PRD Validation] กำลังตรวจสอบ Performance Engineering Options...");
      if (/vus:\s*1000/.test(clean)) {
        log("✓ [AC-701 Passed]: กำหนด vus: 1000 (1,000 Virtual Users) สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-701]: ต้องกำหนด vus: 1000");
      }

      if (/duration:\s*['"]10s['"]/.test(clean)) {
        log("✓ [AC-702 Passed]: กำหนด duration: '10s' สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-702]: ต้องกำหนด duration: '10s'");
      }
    },
    hint: "ใส่ vus: 1000, duration: '10s' ใน export const options = { ... };",
    solution: `import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1000,
  duration: '10s',
};

export default function () {
  const res = http.get('https://japan-trip.test/api/seats');
  check(res, { 'status is 200': (r) => r.status === 200 });
}`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม Performance Engineering ออกแบบฉากทัศน์ทดสอบความจุของเซิร์ฟเวอร์วันเปิดขายตั๋วคอนเสิร์ต Tokyo Dome จริง เพื่อดูจุดแตกหักเมื่อแฟนคลับแย่งกันกดจองที่นั่งในวินาทีแรก<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-701]</code>: กำหนดจำนวนผู้ใช้เสมือน <code>vus: 1000</code> เพื่อยิงถล่ม API ที่นั่งพร้อมกัน<br/>
    • <code>[AC-702]</code>: กำหนดระยะเวลาโถมโหลด <code>duration: '10s'</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> อัตราความผิดพลาด Error Rate ต้องไม่เกิน 1% และระบบต้องไม่เกิด Database Deadlock`,
    example: `export const options = {
  vus: 1000,
  duration: '10s',
};`,
    task: `จงกำหนด <code>vus: 1000</code> และ <code>duration: '10s'</code> ใน k6 options ตามเกณฑ์ <code>[AC-701]</code> และ <code>[AC-702]</code>`
  },
  {
    id: "fp_cicd_pipeline",
    meta: "Phase 8 จาก 9: Continuous Delivery Pipeline",
    title: "8. [Phase 8] Continuous Integration & Pipeline Specification",
    template: `# GitHub Actions Workflow สำหรับ Final Project: Japan Concert Trip
name: Japan Concert Trip Capstone Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # AC-801: Checkout โค้ดด้วย actions/checkout@v4
      # WRITE YOUR YAML CODE HERE


      # AC-802: รันสคริปต์ทดสอบทั้งหมดด้วย npm test

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 8 PRD Validation] กำลังตรวจสอบ CI/CD Pipeline YAML...");
      if (/uses:\s*actions\/checkout@v4/.test(clean) || /uses:\s*actions\/checkout@v3/.test(clean)) {
        log("✓ [AC-801 Passed]: กำหนดสเต็ป uses: actions/checkout@v4 ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-801]: ต้องมีสเต็ป uses: actions/checkout@v4");
      }

      if (/run:\s*npm\s+test/.test(clean)) {
        log("✓ [AC-802 Passed]: กำหนดสเต็ป run: npm test ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-802]: ต้องมีสเต็ป run: npm test");
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
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม DevOps Engineer มัดรวมสคริปต์ทดสอบตั้งแต่ Phase 1 ถึง Phase 7 ไปผูกใน GitHub Actions Pipeline เพื่อให้ระบบตรวจสอบอัตโนมัติทุกครั้งที่มี Pull Request<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-801]</code>: สั่งดึงซอร์สโค้ดจาก Git ด้วย action มาตรฐาน <code>uses: actions/checkout@v4</code><br/>
    • <code>[AC-802]</code>: สั่งรันคำสั่งตรวจสอบทั้งหมดด้วย <code>run: npm test</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> Pipeline ต้องรันผ่าน 100% ห้ามมี Failed step มิฉะนั้นระบบจะไม่ยอมให้ Merge โค้ดเข้า Production`,
    example: `steps:
  - uses: actions/checkout@v4
  - run: npm test`,
    task: `จงเขียนสเต็ป YAML ตามเกณฑ์ <code>[AC-801]</code> และ <code>[AC-802]</code>`
  },
  {
    id: "fp_dsa_ticket_optimization",
    meta: "Phase 9 จาก 9: Advanced Algorithmic Challenge (DS&A)",
    title: "9. [Phase 9 ⭐ Bonus] Algorithmic Engineering Specification",
    template: `// [Phase 9 ⭐ Bonus Spec] Binary Search Ticket Price Optimizer (O(log n)):
function findBestTicketPrice(prices, targetPrice) {
  let left = 0;
  let right = prices.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // AC-901: คืนค่า true เมื่อ prices[mid] === targetPrice
    // AC-902: ปรับขอบเขต left = mid + 1 (เมื่อน้อยกว่า) และ right = mid - 1 (เมื่อมากกว่า)
    // WRITE YOUR BINARY SEARCH LOGIC HERE

  }
  return false;
}`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 9 PRD Validation] กำลังตรวจสอบ Binary Search Optimization...");
      if (/prices\[mid\]\s*===\s*targetPrice/.test(clean) || /prices\[mid\]\s*==\s*targetPrice/.test(clean)) {
        log("✓ [AC-901 Passed]: ตรวจพบเงื่อนไขการเจอราคาเป้าหมาย prices[mid] === targetPrice");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-901]: ต้องคืนค่า true เมื่อ prices[mid] === targetPrice");
      }

      if (/left\s*=\s*mid\s*\+\s*1/.test(clean) && /right\s*=\s*mid\s*-\s*1/.test(clean)) {
        log("✓ [AC-902 Passed]: การปรับขอบเขต Binary Search O(log n) ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-902]: ต้องปรับขอบเขต left = mid + 1 และ right = mid - 1");
      }
    },
    hint: "ถ้า prices[mid] === targetPrice คืนค่า true, ถ้า prices[mid] < targetPrice ปรับ left = mid + 1, ไม่งั้นปรับ right = mid - 1",
    solution: `function findBestTicketPrice(prices, targetPrice) {
  let left = 0;
  let right = prices.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (prices[mid] === targetPrice) {
      return true;
    } else if (prices[mid] < targetPrice) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return false;
}`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม Core Algorithmic Engineering ออกแบบฟังก์ชัน Binary Search O(log n) เพื่อค้นหาราคาตั๋วเครื่องบินและผังที่นั่งคอนเสิร์ตที่ดีที่สุดท่ามกลางตั๋ว 100,000 ใบในระบบด้วยความเร็วสูงสุด<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-901]</code>: คืนค่า <code>true</code> เมื่อพบราคาสเปกเป้าหมาย <code>prices[mid] === targetPrice</code><br/>
    • <code>[AC-902]</code>: ปรับขอบเขต Binary Search <code>left = mid + 1</code> เมื่อราคาน้อยกว่า และ <code>right = mid - 1</code> เมื่อราคามากกว่า<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> ต้องรักษาประสิทธิภาพ Time Complexity ระดับ <code>O(log n)</code> เพื่อไม่ให้เซิร์ฟเวอร์ค้างเมื่อผู้ใช้ค้นหาตั๋วพร้อมกัน`,
    example: `if (prices[mid] === targetPrice) return true;
else if (prices[mid] < targetPrice) left = mid + 1;
else right = mid - 1;`,
    task: `จงเขียนลอจิก Binary Search ตามเกณฑ์ <code>[AC-901]</code> และ <code>[AC-902]</code>`
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
    <div class="terminal-line info">$ running capstone PRD validation runner...</div>
    <div class="terminal-line text-muted">Validating spec: ${lesson.title}...</div>
  `;

  setTimeout(() => {
    try {
      lesson.validate(code, appendLog);

      terminal.innerHTML += logs.map(l => `<div class="terminal-line success">${escapeHtml(l)}</div>`).join('');
      terminal.innerHTML += `
        <div class="terminal-line info">---------------------------------------------------</div>
        <div class="terminal-line success">✓ <strong>ผลการตรวจ PRD Spec: ผ่านทุกข้อกำหนด (All AC Passed)</strong></div>
        <div class="terminal-line success">1 passed (24ms)</div>
      `;

      setLessonCompleted(lesson.id);

      const nextBtn = document.getElementById('next-lesson-btn');
      if (nextBtn) {
        if (currentLessonIndex < LESSONS.length - 1) {
          nextBtn.innerText = 'ลุยไป Phase ถัดไป →';
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
        <div class="terminal-line error">✕ <strong>ผลการตรวจ PRD Spec: ไม่ผ่าน (AC Failed)</strong></div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณผ่านการประเมิน Engineering Capstone: Japan Concert Trip แล้ว!</div>
    <div class="terminal-line success">ผ่านสเปกครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} Phases</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพิสูจน์แล้วว่ามีความสามารถระดับ Senior/Staff QA Engineer ในการอ่านและสร้างระบบจริงตามสเปก PRD & Acceptance Criteria ตั้งแต่ Config ➔ DB ➔ API ➔ Security ➔ Web ➔ Mobile ➔ Performance ➔ CI/CD ➔ DS&A Algorithm!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Japan Concert Trip Capstone Architecture');
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
