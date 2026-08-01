(function() {
// Final Project: Japan Concert Trip (All-in-One Capstone Suite)
// Software & QA Engineering Lifecycle Architecture Spec (PRD & Acceptance Criteria Standard):
//   Phase 1: Test Framework & Environment Config
//   Phase 2: Database Schema Architecture (SQL)
//   Phase 3: Booking + Visa Compliance Integration (single flow, backend API)
//   Phase 4: Web UI Automation — reuses Phase 3's visa API before booking (POM)
//   Phase 5: Mobile Client App Automation (E-Ticket)
//   Phase 6: Performance & Stress Testing (k6 Spike Test + SLA Thresholds)
//   Phase 7: Continuous Integration Pipeline (GitHub Actions, multi-step)
//   Phase 8 (Bonus): Advanced Algorithmic Challenge (DS&A Binary Search — index return)

const PREFIX = 'final_project';
const TAB_WIDTH = 2;

// selftest.mjs runs course.js without engine.js loaded (no isLessonCompleted global) —
// treat "prior phase completed" as true there so the solution/template invariant still holds.
function priorPhaseCompleted(lessonId) {
  return typeof isLessonCompleted === 'function' ? isLessonCompleted(lessonId) : true;
}

// Real execution harness for Phase 3/4's Playwright-style code (mirrors the pattern
// already used for Phase 8's binary search — new Function() against a mock, not regex
// on the text). Phase 5 stays regex-based (Robot Framework syntax, deferred).
function prepareExecutableCode(code) {
  return stripComments(code).replace(/^\s*import\s.*?;\s*$/gm, '');
}

function createMockExpect() {
  return function expect(actual) {
    const resolved = (actual && typeof actual === 'object' && '__mockLocatorText' in actual)
      ? actual.__mockLocatorText
      : actual;
    return {
      toBe(expected) {
        if (resolved !== expected) {
          throw new Error(`expect ได้ ${JSON.stringify(resolved)} แต่ต้องการ ${JSON.stringify(expected)}`);
        }
      },
      toContainText(expected) {
        if (typeof resolved !== 'string' || !resolved.includes(expected)) {
          throw new Error(`ข้อความหน้าจอควรมีคำว่า "${expected}" แต่ได้ ${JSON.stringify(resolved)}`);
        }
      }
    };
  };
}

async function runPlaywrightLikeTest(code, fixtures) {
  const executable = prepareExecutableCode(code);
  let capturedFn = null;
  const mockTest = (name, fn) => { capturedFn = fn; };
  let runner;
  try {
    runner = new Function('test', 'expect', executable);
  } catch (e) {
    throw new Error(`โค้ดมี Syntax Error รันไม่ได้ — ${e.message}`);
  }
  runner(mockTest, createMockExpect());
  if (typeof capturedFn !== 'function') {
    throw new Error("ไม่พบการเรียก test('...', async (...) => {...}) ที่ถูกต้องในโค้ด");
  }
  await capturedFn(fixtures);
}

function createBookingBackend() {
  const calls = { book: null, visa: null };
  const post = async (url, opts) => {
    const data = opts && opts.data;
    if (url === '/api/japan-trip/book') {
      calls.book = data || null;
      if (!data || !data.passportNo) {
        throw new Error('Mock backend: POST /api/japan-trip/book payload ไม่ถูกต้อง (ขาด passportNo)');
      }
      return { status: () => 200, json: async () => ({ status: 'CONFIRMED' }) };
    }
    if (url === '/api/japan-trip/verify-visa') {
      calls.visa = data || null;
      if (!data || typeof data.stayDays !== 'number') {
        throw new Error('Mock backend: POST /api/japan-trip/verify-visa payload ต้องมี stayDays เป็นตัวเลข (คำนวณเองจากวันบิน/วันกลับ)');
      }
      if (data.stayDays !== 4) {
        throw new Error(`Mock backend: stayDays คำนวณผิด — ควรได้ 4 วัน (14-18 ต.ค.) แต่ได้ ${data.stayDays}`);
      }
      return { status: () => 200, json: async () => ({ visaRequired: false }) };
    }
    throw new Error(`Mock backend: ไม่รู้จัก endpoint ${url}`);
  };
  return { request: { post }, calls };
}

function createPhase4Env() {
  const dom = { currentUrl: null, departureDate: null, bookingStatus: '', visaVerified: false, visaCallMade: false };
  const request = {
    post: async (url, opts) => {
      if (url !== '/api/japan-trip/verify-visa') {
        throw new Error(`Mock backend: Phase 4 ต้องเรียกเฉพาะ /api/japan-trip/verify-visa (ซ้ำจาก Phase 3) แต่เรียก ${url}`);
      }
      dom.visaCallMade = true;
      const data = opts && opts.data;
      if (!data || data.stayDays !== 4) {
        throw new Error('Mock backend: verify-visa payload ต้องมี stayDays: 4 เหมือน Phase 3 (คำนวณจาก 14-18 ต.ค.)');
      }
      dom.visaVerified = true;
      return { status: () => 200, json: async () => ({ visaRequired: false }) };
    }
  };
  const page = {
    goto: async (url) => { dom.currentUrl = url; },
    fill: async (selector, value) => {
      if (selector !== '#departure-date') {
        throw new Error(`Mock page: ไม่รู้จัก selector ${selector} สำหรับ fill()`);
      }
      dom.departureDate = value;
    },
    click: async (selector) => {
      if (selector !== '#confirm-booking-btn') {
        throw new Error(`Mock page: ไม่รู้จัก selector ${selector} สำหรับ click()`);
      }
      if (dom.currentUrl !== '/japan-trip') {
        throw new Error("Mock page: ต้อง page.goto('/japan-trip') ก่อนคลิกยืนยันการจอง");
      }
      if (!dom.visaVerified) {
        throw new Error('Mock page: ต้องเรียก verify-visa API ยืนยัน visaRequired เป็น false ก่อนคลิกยืนยันการจอง (AC-401 ต้องมาก่อน AC-402)');
      }
      dom.bookingStatus = dom.departureDate === '2026-10-14' ? 'Booking Successful' : 'Booking Failed: invalid date';
    },
    locator: (selector) => {
      if (selector === '#booking-status') {
        return { __mockLocatorText: dom.bookingStatus };
      }
      if (selector === '#departure-date') {
        return { fill: async (value) => { dom.departureDate = value; } };
      }
      throw new Error(`Mock page: ไม่รู้จัก selector ${selector}`);
    }
  };
  return { request, page, dom };
}

// Minimal Robot Framework Browser-library interpreter for Phase 5 — not a real RF
// parser, just enough keywords (New Page/Open Browser, Get Text, Should Contain,
// Element Should Be Visible) to run the learner's flow against a fake page instead of
// regex-matching the text. Unsupported keywords (e.g. "Set Variable" to fake a value
// without ever reading the page) are deliberately left unimplemented — a variable that
// never flowed through a real Get Text stays unset and fails Should Contain naturally.
function runRobotFrameworkLikeTest(code) {
  const PAGE_CONTENT = { '/mobile/e-ticket': 'Japan Concert E-Ticket' };
  const dom = { currentUrl: null, opened: false };
  const vars = {};
  let sawGetText = false;
  let checkedContains = false;

  const resolveVar = (token) => {
    const m = /^\$\{(\w+)\}$/.exec(token || '');
    return m ? vars[m[1]] : token;
  };

  // No inline trailing-comment stripping here — this course's pseudo-RF selectors
  // (e.g. "#ticket-title") start with '#' just like a real RF comment marker would,
  // and every AC comment in the template is already on its own full line.
  const lines = code.split('\n');
  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('***') || /^(Documentation|Library)\b/i.test(line)) continue;
    if (/^FP-\d+:/.test(line)) continue;

    let tokens = line.split(/\s{2,}|\t/).map(t => t.trim()).filter(Boolean);
    if (!tokens.length) continue;

    let assignTo = null;
    const assignMatch = /^\$\{(\w+)\}=$/.exec(tokens[0]);
    if (assignMatch) {
      assignTo = assignMatch[1];
      tokens = tokens.slice(1);
    }
    if (!tokens.length) continue;

    const [keywordRaw, ...args] = tokens;
    const keyword = keywordRaw.toLowerCase();
    const resolvedArgs = args.map(resolveVar);

    if (keyword === 'new page' || keyword === 'open browser') {
      dom.currentUrl = resolvedArgs[0];
      dom.opened = true;
    } else if (keyword === 'get text') {
      const selector = resolvedArgs[0];
      if (!dom.opened) {
        throw new Error('Mock RF: เรียก Get Text ก่อนเปิดหน้าเว็บด้วย New Page/Open Browser');
      }
      if (selector !== '#ticket-title') {
        throw new Error(`Mock RF: Get Text ใช้ selector ที่ไม่รู้จัก (${selector})`);
      }
      const text = PAGE_CONTENT[dom.currentUrl] || '';
      sawGetText = true;
      if (assignTo) vars[assignTo] = text;
      if (resolvedArgs[1] === '==') {
        if (!text.includes(resolvedArgs[2])) {
          throw new Error(`Mock RF: Get Text ${selector} == ล้มเหลว — ได้ "${text}" ไม่มีคำว่า "${resolvedArgs[2]}"`);
        }
        checkedContains = true;
      }
    } else if (keyword === 'should contain') {
      const actual = resolveVar(args[0]);
      const expected = args[1];
      if (typeof actual !== 'string' || !actual.includes(expected)) {
        throw new Error(`Mock RF: Should Contain ล้มเหลว — "${actual}" ไม่มีคำว่า "${expected}"`);
      }
      checkedContains = true;
    } else if (keyword === 'element should be visible') {
      if (!dom.opened) {
        throw new Error('Mock RF: เรียก Element Should Be Visible ก่อนเปิดหน้าเว็บ');
      }
      if (!resolvedArgs.some(a => /ticket-title|Japan Concert E-Ticket/.test(a))) {
        throw new Error('Mock RF: Element Should Be Visible ไม่ได้ตรวจ element ที่เกี่ยวกับ E-Ticket');
      }
      checkedContains = true;
    }
  }

  if (!dom.opened) {
    throw new Error("ไม่ผ่านเกณฑ์ [AC-501]: ยังไม่พบคำสั่งเปิดหน้าแอปมือถือ");
  }
  if (dom.currentUrl !== '/mobile/e-ticket') {
    throw new Error(`ไม่ผ่านเกณฑ์ [AC-501]: เปิดหน้าผิด URL (${dom.currentUrl}) ต้องเป็น /mobile/e-ticket`);
  }
  if (!checkedContains) {
    throw new Error("ไม่ผ่านเกณฑ์ [AC-502]: ยังไม่พบการตรวจสอบว่าข้อความบนหน้าจอมีคำว่า 'Japan Concert E-Ticket' (ต้องดึงข้อความจริงด้วย Get Text ก่อน)");
  }
}

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
    meta: "Phase 1 จาก 8: Framework & Architecture Config",
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
        throw new Error("ไม่ผ่านเกณฑ์ [AC-101]: ยังไม่พบการกำหนดค่า baseURL ให้ตรงกับที่ระบุในโจทย์ ภายใน use ของ defineConfig");
      }

      if (/trace:\s*['"]on-first-retry['"]/.test(clean)) {
        log("✓ [AC-102 Passed]: กำหนด trace: 'on-first-retry' สำหรับ CI/CD สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-102]: ยังไม่พบการเปิดใช้งาน trace ตามโหมดที่ระบุในโจทย์");
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
    meta: "Phase 2 จาก 8: Data Architecture (SQL Schema)",
    title: "2. [Phase 2] Database Schema Architecture Specification",
    template: `-- [Phase 2 Spec] ออกแบบ Database Schema สำหรับทริปคอนเสิร์ตญี่ปุ่น:
-- AC-201: สร้างตาราง japan_trip_bookings พร้อม PRIMARY KEY id
-- AC-202: รองรับคอลัมน์ user_name, concert_date, departure_date, return_date, passport_no, status
-- AC-203: user_name และ passport_no ห้ามเป็นค่าว่าง (NOT NULL) — จองทริปโดยไม่รู้ว่าใครจองไม่ได้
-- WRITE YOUR SQL CODE HERE

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 2 PRD Validation] กำลังตรวจสอบ Database Schema...");
      if (/CREATE\s+TABLE\s+japan_trip_bookings/i.test(clean)) {
        log("✓ [AC-201 Passed]: คำสั่ง CREATE TABLE japan_trip_bookings ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-201]: ยังไม่พบคำสั่งสร้างตารางตามชื่อที่ระบุในโจทย์");
      }

      if (/passport_no/i.test(clean) && /concert_date/i.test(clean) && /departure_date/i.test(clean) && /return_date/i.test(clean)) {
        log("✓ [AC-202 Passed]: คอลัมน์ concert_date, departure_date, return_date, passport_no ครบถ้วน");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-202]: คอลัมน์ยังไม่ครบตามที่ระบุในโจทย์ ลองเช็คว่าใส่ครบทุกคอลัมน์เกี่ยวกับวันเดินทางและพาสปอร์ตหรือยัง");
      }

      if (/user_name[^,]*NOT\s+NULL/i.test(clean) && /passport_no[^,]*NOT\s+NULL/i.test(clean)) {
        log("✓ [AC-203 Passed]: user_name และ passport_no กำหนด NOT NULL ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-203]: คอลัมน์ระบุตัวตนผู้จองยังไม่ถูกบังคับห้ามเว้นว่างตามที่ระบุในโจทย์");
      }
    },
    hint: "ต่อท้ายชนิดข้อมูลของ user_name และ passport_no ด้วย NOT NULL เช่น user_name VARCHAR(100) NOT NULL — type/length เลือกเองได้ ไม่มีล็อกตายตัว",
    solution: `CREATE TABLE japan_trip_bookings (
  id INT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  concert_date DATE,
  departure_date DATE,
  return_date DATE,
  passport_no VARCHAR(20) NOT NULL,
  status VARCHAR(20)
);`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 1 ทีม Data Engineering ออกแบบตาราง Relational Database เพื่อเป็นโครงสร้างพื้นฐานสำหรับเก็บข้อมูลทริปโตเกียว (บิน 14 ต.ค. / ดูคอน 16 ต.ค. / กลับ 18 ต.ค.)<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-201]</code>: สร้างตารางชื่อ <code>japan_trip_bookings</code> พร้อมคอลัมน์ <code>id</code> เป็น PRIMARY KEY<br/>
    • <code>[AC-202]</code>: รองรับการเก็บข้อมูล <code>user_name</code>, <code>concert_date</code>, <code>departure_date</code>, <code>return_date</code>, <code>passport_no</code>, และ <code>status</code><br/>
    • <code>[AC-203]</code>: <code>user_name</code> และ <code>passport_no</code> ต้องเป็น <code>NOT NULL</code> เพราะเป็นข้อมูลระบุตัวตนผู้จอง<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> คอลัมน์วันที่ต้องใช้ประเภท <code>DATE</code> เพื่อรองรับการทำ Index และคำนวณช่วงเวลาพำนักในญี่ปุ่น ชนิด/ความยาวของ VARCHAR เลือกออกแบบเองได้ตามความเหมาะสม ไม่มีคำตอบตายตัว`,
    example: `CREATE TABLE example_bookings (
  id INT PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  booking_date DATE
);`,
    task: `จงเขียนคำสั่ง SQL สร้างตาราง <code>japan_trip_bookings</code> ตามเกณฑ์ <code>[AC-201]</code>, <code>[AC-202]</code> และ <code>[AC-203]</code>`
  },
  {
    id: "fp_booking_visa_integration",
    meta: "Phase 3 จาก 8: Booking + Visa Compliance Integration",
    title: "3. [Phase 3] Booking Execution & Visa Compliance Integration Specification",
    template: `import { test, expect } from '@playwright/test';

// [Phase 3 Spec] หนึ่ง flow เดียว: จองตั๋วผ่าน API ก่อน แล้วต้องเช็ค Visa Compliance ต่อในเทสเดียวกัน
// ข้อมูลทริป (จาก Phase 2): บิน 2026-10-14 / ดูคอน 2026-10-16 / กลับ 2026-10-18 / Passport TH1234567 / สัญชาติไทย
test('FP-4003: จองทริปญี่ปุ่นผ่าน API แล้วตรวจสอบสิทธิ์ยกเว้นวีซ่าในเทสเดียวกัน', async ({ request }) => {
  // AC-301: POST /api/japan-trip/book ด้วยข้อมูลทริปข้างต้น -> status 200 และ body.status เป็น 'CONFIRMED'
  // WRITE YOUR CODE HERE


  // AC-302: POST /api/japan-trip/verify-visa ด้วย passportCountry + จำนวนวันพำนักที่คำนวณเองจากวันบิน/วันกลับ -> status 200 และ body.visaRequired เป็น false

});`,
    validate: (code, log) => {
      log("🔍 [Phase 3 PRD Validation] กำลังรันโค้ดจริงผ่าน Mock Backend...");
      if (!priorPhaseCompleted('fp_db_schema')) {
        throw new Error("ไม่ผ่านเกณฑ์: ต้องผ่าน Phase 2 (Database Schema) ก่อน — Phase 3 ต่อยอดโครงสร้างข้อมูลจาก Phase 2 โดยตรง");
      }
      const backend = createBookingBackend();
      return runPlaywrightLikeTest(code, { request: backend.request }).then(() => {
        if (!backend.calls.book) {
          throw new Error("ไม่ผ่านเกณฑ์ [AC-301]: ยังไม่พบการเรียก POST /api/japan-trip/book ตามที่ระบุในโจทย์");
        }
        if (!backend.calls.visa) {
          throw new Error("ไม่ผ่านเกณฑ์ [AC-302]: ยังไม่พบการเรียก POST /api/japan-trip/verify-visa ต่อในเทสเดียวกัน");
        }
        log("✓ [AC-301+302 Passed]: จองตั๋วผ่าน API แล้วตรวจสอบวีซ่าต่อในเทสเดียวกัน สำเร็จทั้ง flow (รันจริงผ่าน Mock Backend)");
      });
    },
    hint: "หนึ่ง test() เดียว ยิง POST /book ก่อน เช็ค response แล้วแปลง json เก็บตัวแปร จากนั้นยิง POST /verify-visa ต่อ (คำนวณ stayDays เองจาก 14-18 ต.ค. = 4 วัน) แล้วเช็ค response ที่สอง",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4003: จองทริปญี่ปุ่นผ่าน API แล้วตรวจสอบสิทธิ์ยกเว้นวีซ่าในเทสเดียวกัน', async ({ request }) => {
  const bookingResponse = await request.post('/api/japan-trip/book', {
    data: {
      departureDate: '2026-10-14',
      concertDate: '2026-10-16',
      returnDate: '2026-10-18',
      passportNo: 'TH1234567'
    }
  });

  expect(bookingResponse.status()).toBe(200);
  const bookingBody = await bookingResponse.json();
  expect(bookingBody.status).toBe('CONFIRMED');

  const visaResponse = await request.post('/api/japan-trip/verify-visa', {
    data: {
      passportCountry: 'THA',
      stayDays: 4
    }
  });

  expect(visaResponse.status()).toBe(200);
  const visaBody = await visaResponse.json();
  expect(visaBody.visaRequired).toBe(false);
});`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 2 ทีม Backend Developer และทีม InfoSec & Compliance รวม flow การจองและการตรวจสิทธิ์วีซ่าเข้าด้วยกัน — ในระบบจริง การจองที่ยังไม่ผ่าน Visa Compliance ถือว่ายังไม่สมบูรณ์ ดังนั้นเทสต้องครอบคลุมทั้งสองขั้นตอนต่อเนื่องกันในหนึ่ง flow<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-301]</code>: POST <code>/api/japan-trip/book</code> ด้วยข้อมูลทริป (วันบิน/วันดูคอน/วันกลับ/Passport) แล้วต้องได้ <code>200 OK</code> และ <code>body.status === 'CONFIRMED'</code><br/>
    • <code>[AC-302]</code>: ต่อในเทสเดียวกัน POST <code>/api/japan-trip/verify-visa</code> ด้วย <code>passportCountry: 'THA'</code> และจำนวนวันพำนัก (คำนวณเองจากช่วง 14-18 ต.ค.) แล้วต้องได้ <code>body.visaRequired === false</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> ทั้งสอง Endpoint ต้องอยู่ใน flow เดียวกัน — ห้ามแยกเป็นสอง test() เพราะในระบบจริงการจองที่ยังไม่ผ่าน visa check ถือว่ายัง incomplete`,
    example: `const r1 = await request.post('/api/example/book', { data: { ... } });
expect(r1.status()).toBe(200);
const b1 = await r1.json();
expect(b1.status).toBe('CONFIRMED');

const r2 = await request.post('/api/example/verify-visa', { data: { ... } });
const b2 = await r2.json();
expect(b2.visaRequired).toBe(false);`,
    task: `จงเขียนสคริปต์เดียวที่ยิง POST ทั้ง <code>/api/japan-trip/book</code> และ <code>/api/japan-trip/verify-visa</code> ต่อกัน ตามเกณฑ์ <code>[AC-301]</code> และ <code>[AC-302]</code>`
  },
  {
    id: "fp_web_ui_e2e",
    meta: "Phase 4 จาก 8: Web UI + Visa Reuse (Page Object Model)",
    title: "4. [Phase 4] Frontend Web E2E User Journey Specification",
    template: `import { test, expect } from '@playwright/test';

// [Phase 4 Spec] ก่อนกรอกฟอร์มจอง ต้องเรียกใช้ API เดียวกับ Phase 3 เพื่อยืนยัน visa compliance ในเทสเดียวกันก่อน
test('FP-4005: ยืนยัน visa compliance ผ่าน API ก่อน แล้วค่อยกรอกฟอร์มจองบนเว็บ', async ({ page, request }) => {
  // AC-401: เรียก request.post('/api/japan-trip/verify-visa') ซ้ำแบบ Phase 3 -> ต้องได้ body.visaRequired เป็น false ก่อนไปต่อ
  // WRITE YOUR CODE HERE


  // AC-402: page.goto('/japan-trip') กรอกวันเดินทาง 2026-10-14 ใน #departure-date คลิก #confirm-booking-btn และตรวจ #booking-status มีคำว่า 'Booking Successful'

});`,
    validate: (code, log) => {
      log("🔍 [Phase 4 PRD Validation] กำลังรันโค้ดจริงผ่าน Mock Backend + Mock Page...");
      if (!priorPhaseCompleted('fp_booking_visa_integration')) {
        throw new Error("ไม่ผ่านเกณฑ์: ต้องผ่าน Phase 3 (Booking + Visa Integration) ก่อน — Phase 4 reuse API เดียวกับ Phase 3 จริง ไม่ใช่แค่พิมพ์ซ้ำ");
      }
      const env = createPhase4Env();
      return runPlaywrightLikeTest(code, { page: env.page, request: env.request }).then(() => {
        if (!env.dom.visaCallMade) {
          throw new Error("ไม่ผ่านเกณฑ์ [AC-401]: ยังไม่พบการเรียก verify-visa API ซ้ำจาก Phase 3 ก่อนไปกรอกฟอร์ม");
        }
        if (env.dom.bookingStatus !== 'Booking Successful') {
          throw new Error("ไม่ผ่านเกณฑ์ [AC-402]: ยังไม่ยืนยันว่าหน้าจอแสดงข้อความ 'Booking Successful' สำเร็จ");
        }
        log("✓ [AC-401+402 Passed]: ยืนยัน visa ผ่าน API แล้วกรอกฟอร์มจองบนหน้าเว็บสำเร็จทั้ง flow (รันจริง)");
      });
    },
    hint: "test ต้องรับทั้ง { page, request } — ยิง request.post('/api/japan-trip/verify-visa', ...) เช็ค visaRequired false ก่อน แล้วค่อย page.goto('/japan-trip'); page.fill('#departure-date', '2026-10-14'); page.click('#confirm-booking-btn'); expect(page.locator('#booking-status')).toContainText('Booking Successful');",
    solution: `import { test, expect } from '@playwright/test';

test('FP-4005: ยืนยัน visa compliance ผ่าน API ก่อน แล้วค่อยกรอกฟอร์มจองบนเว็บ', async ({ page, request }) => {
  const visaResponse = await request.post('/api/japan-trip/verify-visa', {
    data: {
      passportCountry: 'THA',
      stayDays: 4
    }
  });
  const visaBody = await visaResponse.json();
  expect(visaBody.visaRequired).toBe(false);

  await page.goto('/japan-trip');
  await page.fill('#departure-date', '2026-10-14');
  await page.click('#confirm-booking-btn');
  await expect(page.locator('#booking-status')).toContainText('Booking Successful');
});`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ต่อยอดจาก Phase 3 โดยตรง — ทีม Frontend UX/UI และ Web QA สร้างระบบ E2E Automation บนเบราว์เซอร์จริง แต่ก่อนกรอกฟอร์มจองต้อง "reuse" API เดียวกับ Phase 3 เพื่อยืนยัน compliance ก่อน สะท้อนว่า UI flow จริงต้องพึ่งพา backend check เดิม ไม่ใช่แยกจากกัน<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-401]</code>: เรียก API <code>/api/japan-trip/verify-visa</code> ซ้ำจาก Phase 3 ในเทสนี้ (ใช้ fixture <code>request</code> ร่วมกับ <code>page</code>) แล้วต้องได้ <code>visaRequired: false</code> ก่อนไปกรอกฟอร์ม<br/>
    • <code>[AC-402]</code>: เปิดหน้าเว็บ <code>/japan-trip</code> ระบุวันออกเดินทาง <code>2026-10-14</code> ในช่อง <code>#departure-date</code> คลิกปุ่มยืนยัน <code>#confirm-booking-btn</code> และตรวจ <code>#booking-status</code> ต้องมีคำว่า <code>'Booking Successful'</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> สคริปต์ต้องรอการตอบกลับจาก API (Auto-waiting) โดยไม่ใช้คำสั่งหลับแบบช้า <code>waitForTimeout</code> และห้ามข้ามขั้นตอนยืนยัน visa ไปกรอกฟอร์มตรงๆ`,
    example: `const r = await request.post('/api/example/verify-visa', { data: { ... } });
const b = await r.json();
expect(b.visaRequired).toBe(false);

await page.goto('/japan-trip');
await page.fill('#departure-date', '2026-10-14');
await page.click('#confirm-booking-btn');`,
    task: `จงเขียนสคริปต์ Playwright ที่เรียก verify-visa API ก่อน แล้วค่อยทำ E2E บนหน้าเว็บ ตามเกณฑ์ <code>[AC-401]</code> และ <code>[AC-402]</code>`
  },
  {
    id: "fp_mobile_eticket",
    meta: "Phase 5 จาก 8: Mobile App Automation",
    title: "5. [Phase 5] Mobile Native App E-Ticket Specification",
    template: `*** Settings ***
Documentation    ทดสอบเปิดแอปมือถือแสดง E-Ticket คอนเสิร์ตญี่ปุ่น
Library          Browser

*** Test Cases ***
FP-4006: ตรวจสอบ E-Ticket QR Code บนแอปมือถือ
    # AC-501: เปิดหน้าแอปมือถือไปที่ /mobile/e-ticket
    # WRITE YOUR CODE HERE


    # AC-502: ตรวจสอบว่ามีข้อความ "Japan Concert E-Ticket" บนหน้าจอ

`,
    validate: (code, log) => {
      log("🔍 [Phase 5 PRD Validation] กำลังรันโค้ดจริงผ่าน Mock Mobile Page...");
      runRobotFrameworkLikeTest(code);
      log("✓ [AC-501+502 Passed]: เปิดหน้า /mobile/e-ticket และตรวจพบข้อความ 'Japan Concert E-Ticket' จริง (รันจริงผ่าน Mock)");
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
    ต่อยอดจาก Phase 4 เมื่อผู้ใช้จองสำเร็จบนเว็บแล้ว ทีม Mobile App พัฒนาสคริปต์ดึงตั๋ว E-Ticket และ QR Code มาแสดงบนแอปพลิเคชันมือถือสำหรับสแกนเข้าประตูเกตสนามบินและประตูหน้างานคอนเสิร์ต Tokyo Dome<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-501]</code>: ใช้ Robot Framework สั่งเปิดหน้าแอปมือถือ <code>/mobile/e-ticket</code><br/>
    • <code>[AC-502]</code>: ดึงข้อความจาก element <code>#ticket-title</code> และตรวจสอบว่ามีข้อความ <code>'Japan Concert E-Ticket'</code><br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> ตั๋ว E-Ticket ต้องแสดงบาร์โค้ดสดและดึงข้อมูลวันดูคอนเสิร์ต 16 ต.ค. ได้ถูกต้องแม้ในโหมดออฟไลน์`,
    example: `New Page    /mobile/e-ticket
\${title}=   Get Text    #ticket-title`,
    task: `จงเขียน Robot Framework Keyword ตามเกณฑ์ <code>[AC-501]</code> และ <code>[AC-502]</code>`
  },
  {
    id: "fp_performance_k6",
    meta: "Phase 6 จาก 8: Performance Engineering (k6 + SLA Thresholds)",
    title: "6. [Phase 6] Performance Engineering & Ticket Spike Test Specification",
    template: `import http from 'k6/http';
import { check } from 'k6';

// AC-601: กำหนด vus: 1000 (จำลองแฟนคลับ 1,000 คนแย่งกดตั๋วพร้อมกัน)
// AC-602: กำหนด duration: '10s'
// AC-603: กำหนด thresholds — http_req_duration ต้องผ่าน p(95) < 500ms ไม่งั้นถือว่า SLA ล้มเหลว
export const options = {
  // WRITE YOUR K6 OPTIONS HERE

};

export default function () {
  const res = http.get('https://japan-trip.test/api/seats');
  check(res, { 'status is 200': (r) => r.status === 200 });
}`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 6 PRD Validation] กำลังตรวจสอบ Performance Engineering Options...");
      if (/vus:\s*1000/.test(clean)) {
        log("✓ [AC-601 Passed]: กำหนด vus: 1000 (1,000 Virtual Users) สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-601]: ยังไม่พบการกำหนดจำนวน Virtual Users ตามที่ระบุในโจทย์");
      }

      if (/duration:\s*['"]10s['"]/.test(clean)) {
        log("✓ [AC-602 Passed]: กำหนด duration: '10s' สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-602]: ยังไม่พบการกำหนดระยะเวลาทดสอบตามที่ระบุในโจทย์");
      }

      if (/thresholds\s*:\s*{[\s\S]*http_req_duration[\s\S]*p\(95\)\s*<\s*500/.test(clean)) {
        log("✓ [AC-603 Passed]: กำหนด thresholds http_req_duration p(95) < 500ms สำเร็จ");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-603]: ยังไม่พบการกำหนด SLA threshold สำหรับ http_req_duration ตามที่ระบุในโจทย์");
      }
    },
    hint: "ใส่ vus: 1000, duration: '10s', thresholds: { http_req_duration: ['p(95)<500'] } ใน export const options = { ... };",
    solution: `import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1000,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const res = http.get('https://japan-trip.test/api/seats');
  check(res, { 'status is 200': (r) => r.status === 200 });
}`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม Performance Engineering ออกแบบฉากทัศน์ทดสอบความจุของเซิร์ฟเวอร์วันเปิดขายตั๋วคอนเสิร์ต Tokyo Dome จริง เพื่อดูจุดแตกหักเมื่อแฟนคลับแย่งกันกดจองที่นั่งในวินาทีแรก และกำหนด SLA ชัดเจนว่า "เร็วแค่ไหนถึงจะยอมรับได้"<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-601]</code>: กำหนดจำนวนผู้ใช้เสมือน <code>vus: 1000</code> เพื่อยิงถล่ม API ที่นั่งพร้อมกัน<br/>
    • <code>[AC-602]</code>: กำหนดระยะเวลาโถมโหลด <code>duration: '10s'</code><br/>
    • <code>[AC-603]</code>: กำหนด <code>thresholds</code> ว่า 95% ของ request ต้องตอบกลับไม่เกิน 500ms (<code>p(95)&lt;500</code>) มิฉะนั้นถือว่า Performance Test ล้มเหลวแม้ status จะเป็น 200 ทั้งหมด<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> อัตราความผิดพลาด Error Rate ต้องไม่เกิน 1%, ระบบต้องไม่เกิด Database Deadlock, และการฝ่าฝืน SLA threshold ต้องทำให้ pipeline เห็นว่า build นี้ไม่ผ่าน`,
    example: `export const options = {
  vus: 1000,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
};`,
    task: `จงกำหนด <code>vus: 1000</code>, <code>duration: '10s'</code> และ <code>thresholds</code> ใน k6 options ตามเกณฑ์ <code>[AC-601]</code>, <code>[AC-602]</code> และ <code>[AC-603]</code>`
  },
  {
    id: "fp_cicd_pipeline",
    meta: "Phase 7 จาก 8: Continuous Delivery Pipeline (Multi-step)",
    title: "7. [Phase 7] Continuous Integration & Pipeline Specification",
    template: `# GitHub Actions Workflow สำหรับ Final Project: Japan Concert Trip
name: Japan Concert Trip Capstone Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # AC-701: Checkout โค้ดด้วย actions/checkout@v4
      # AC-702: ติดตั้ง Node.js ด้วย actions/setup-node@v4 ก่อนรันเทสใดๆ (ต้องมาก่อนสเต็ป npm test)
      # WRITE YOUR YAML CODE HERE


      # AC-703: รันสคริปต์ทดสอบทั้งหมดด้วย npm test

`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 7 PRD Validation] กำลังตรวจสอบ CI/CD Pipeline YAML...");
      const prerequisitePhases = ['fp_booking_visa_integration', 'fp_web_ui_e2e', 'fp_mobile_eticket'];
      const missingPrereq = prerequisitePhases.find(id => !priorPhaseCompleted(id));
      if (missingPrereq) {
        throw new Error(`ไม่ผ่านเกณฑ์: ต้องผ่าน Phase 3, 4, 5 ให้ครบก่อน — Pipeline นี้รันเทสที่มัดรวมจากทุก Phase ก่อนหน้า (ยังขาด: ${missingPrereq})`);
      }
      if (/uses:\s*actions\/checkout@v4/.test(clean) || /uses:\s*actions\/checkout@v3/.test(clean)) {
        log("✓ [AC-701 Passed]: กำหนดสเต็ป uses: actions/checkout@v4 ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-701]: ยังไม่พบสเต็ป checkout ซอร์สโค้ดตามที่ระบุในโจทย์");
      }

      const setupNodeIdx = clean.search(/uses:\s*actions\/setup-node@v4/);
      const npmTestIdx = clean.search(/run:\s*npm\s+test/);
      if (setupNodeIdx !== -1) {
        log("✓ [AC-702 Passed]: กำหนดสเต็ป uses: actions/setup-node@v4 ถูกต้อง");
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-702]: ยังไม่พบสเต็ปติดตั้ง Node.js runtime ก่อนรันเทสตามที่ระบุในโจทย์");
      }

      if (npmTestIdx !== -1) {
        if (setupNodeIdx !== -1 && setupNodeIdx < npmTestIdx) {
          log("✓ [AC-703 Passed]: กำหนดสเต็ป run: npm test หลัง setup-node ถูกต้อง");
        } else {
          throw new Error("ไม่ผ่านเกณฑ์ [AC-703]: สเต็ปรันเทสต้องอยู่หลังสเต็ปติดตั้ง Node.js runtime — เช็คลำดับสเต็ปอีกครั้ง");
        }
      } else {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-703]: ยังไม่พบสเต็ปรันเทสทั้งหมดตามที่ระบุในโจทย์");
      }
    },
    hint: "เรียงลำดับ steps: - uses: actions/checkout@v4 แล้ว - uses: actions/setup-node@v4 แล้วค่อย - run: npm test ลำดับสำคัญ ติดตั้ง Node ก่อนรันเทสเสมอ",
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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm test`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม DevOps Engineer มัดรวมสคริปต์ทดสอบตั้งแต่ Phase 1 ถึง Phase 6 ไปผูกใน GitHub Actions Pipeline เพื่อให้ระบบตรวจสอบอัตโนมัติทุกครั้งที่มี Pull Request แต่ runner ของ GitHub Actions เป็นเครื่องเปล่า ไม่มี Node.js ติดมาด้วย ต้องติดตั้งเองก่อนรันเทส<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-701]</code>: สั่งดึงซอร์สโค้ดจาก Git ด้วย action มาตรฐาน <code>uses: actions/checkout@v4</code><br/>
    • <code>[AC-702]</code>: ติดตั้ง Node.js runtime ด้วย <code>uses: actions/setup-node@v4</code> ก่อนสเต็ปรันเทสใดๆ<br/>
    • <code>[AC-703]</code>: สั่งรันคำสั่งตรวจสอบทั้งหมดด้วย <code>run: npm test</code> โดยต้องอยู่หลัง setup-node เสมอ<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> Pipeline ต้องรันผ่าน 100% ห้ามมี Failed step, ลำดับ step ผิดจะทำให้ npm test ล้มเหลวเพราะไม่มี Node.js ให้ใช้`,
    example: `steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
  - run: npm test`,
    task: `จงเขียนสเต็ป YAML ตามเกณฑ์ <code>[AC-701]</code>, <code>[AC-702]</code> และ <code>[AC-703]</code> โดยเรียงลำดับให้ถูกต้อง`
  },
  {
    id: "fp_dsa_ticket_optimization",
    meta: "Phase 8 จาก 8: Advanced Algorithmic Challenge (DS&A ⭐ Bonus)",
    title: "8. [Phase 8 ⭐ Bonus] Algorithmic Engineering Specification",
    template: `// [Phase 8 ⭐ Bonus Spec] Binary Search Ticket Price Locator (O(log n)):
// ต่างจาก exists-check ทั่วไป — ระบบต้องรู้ "ตำแหน่ง index" ของราคานั้นในผัง เพื่อดึงที่นั่งจริงมาแสดง
function findBestTicketPrice(prices, targetPrice) {
  let left = 0;
  let right = prices.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // AC-801: ถ้าเจอราคาเป้าหมายพอดี ต้องคืนค่า "ตำแหน่ง" ของมัน — ห้ามคืนแค่ true/false
    // AC-802: ถ้ายังไม่เจอ ต้องขยับขอบเขตการค้นหาเข้าหากึ่งกลางใหม่ ตามหลัก Binary Search
    // WRITE YOUR BINARY SEARCH LOGIC HERE

  }
  // AC-803: ถ้าหาไม่เจอเลย ต้องคืนค่า -1 (ไม่ใช่ false) ตามธรรมเนียม index-based search
  return -1;
}`,
    validate: (code, log) => {
      const clean = stripComments(code);
      log("🔍 [Phase 8 PRD Validation] กำลังรันโค้ดจริงเพื่อตรวจสอบ Binary Search Optimization...");

      // Static pre-check before executing anything: the loop skeleton (while (left <= right))
      // is given, so code missing the bound updates would spin forever once run for real.
      // Catch that here instead of hanging the tab.
      if (!/left\s*=\s*mid\s*\+\s*1/.test(clean) || !/right\s*=\s*mid\s*-\s*1/.test(clean)) {
        throw new Error("ไม่ผ่านเกณฑ์ [AC-802]: ยังไม่พบการปรับขอบเขต left = mid + 1 และ right = mid - 1 ให้ครบทั้งสองทิศทาง (ไม่รันโค้ดต่อเพราะ loop จะไม่มีวันจบ)");
      }

      const buildFn = () => new Function('prices', 'targetPrice', `${clean}\nreturn findBestTicketPrice(prices, targetPrice);`);

      let fn;
      try {
        fn = buildFn();
      } catch (e) {
        throw new Error(`ไม่ผ่านเกณฑ์: โค้ดมี Syntax Error รันไม่ได้ — ${e.message}`);
      }

      const found = fn([10, 20, 30, 40, 50], 30);
      if (found === 2) {
        log("✓ [AC-801 Passed]: findBestTicketPrice([10,20,30,40,50], 30) คืนค่า index 2 ถูกต้อง (รันจริง ไม่ใช่แค่ตรวจข้อความ)");
      } else {
        throw new Error(`ไม่ผ่านเกณฑ์ [AC-801]: findBestTicketPrice([10,20,30,40,50], 30) ควรคืนค่า index 2 แต่ได้ ${JSON.stringify(found)} — ห้ามคืนค่า boolean หรือ index ผิดตำแหน่ง`);
      }

      const missing = fn([10, 20, 30, 40, 50], 25);
      if (missing === -1) {
        log("✓ [AC-803 Passed]: findBestTicketPrice([10,20,30,40,50], 25) คืนค่า -1 เมื่อไม่พบ ถูกต้อง");
      } else {
        throw new Error(`ไม่ผ่านเกณฑ์ [AC-803]: เมื่อหาไม่เจอ ควรคืนค่า -1 แต่ได้ ${JSON.stringify(missing)}`);
      }

      let accessCount = 0;
      const bigArr = Array.from({ length: 1024 }, (_, i) => i * 2);
      const countedArr = new Proxy(bigArr, {
        get(target, prop) {
          if (typeof prop === 'string' && /^\d+$/.test(prop)) accessCount++;
          return target[prop];
        }
      });
      const bigResult = buildFn()(countedArr, 1000);
      if (bigResult !== 500) {
        throw new Error(`ไม่ผ่านเกณฑ์ [AC-801]: บน array ขนาด 1024 ตัว หา targetPrice=1000 ควรได้ index 500 แต่ได้ ${JSON.stringify(bigResult)}`);
      }
      if (accessCount <= 40) {
        log(`✓ [AC-802 Passed]: ใช้ Binary Search จริง — เข้าถึง array แค่ ${accessCount} ครั้งจาก 1024 ตัว (O(log n))`);
      } else {
        throw new Error(`ไม่ผ่านเกณฑ์ [AC-802]: เข้าถึง array ${accessCount} ครั้งจาก 1024 ตัว — นี่คือ Linear Scan ไม่ใช่ Binary Search O(log n) (ต้องเข้าถึงไม่เกิน ~40 ครั้ง แม้จะ access prices[mid] ซ้ำในเงื่อนไข if/else if ก็ตาม)`);
      }
    },
    hint: "เทียบ prices[mid] กับ targetPrice: ตรงกันให้คืนค่าตำแหน่งนั้นเลย (ไม่ใช่ boolean) ไม่ตรงกันให้ตัดสินใจว่าครึ่งไหนของ array ยังมีโอกาสเจอ แล้วขยับขอบเขต left/right เข้าหากึ่งกลางใหม่ฝั่งนั้น เหมือนหลักการ Binary Search ทั่วไป",
    solution: `function findBestTicketPrice(prices, targetPrice) {
  let left = 0;
  let right = prices.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (prices[mid] === targetPrice) {
      return mid;
    } else if (prices[mid] < targetPrice) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    theory: `📌 <strong>1. Business & Architectural Context (บริบทระบบ):</strong><br/>
    ทีม Core Algorithmic Engineering ออกแบบฟังก์ชัน Binary Search O(log n) เพื่อค้นหา "ตำแหน่งที่นั่ง" ที่ตรงกับราคาเป้าหมายท่ามกลางตั๋ว 100,000 ใบในระบบ — ต่างจากแค่เช็คว่ามีหรือไม่มี เพราะระบบต้องเอา index ไปดึงข้อมูลที่นั่งจริงมาแสดงต่อ<br/><br/>
    📋 <strong>2. System Requirements & Acceptance Criteria (AC):</strong><br/>
    • <code>[AC-801]</code>: คืนค่า <code>index (mid)</code> เมื่อพบราคาสเปกเป้าหมาย <code>prices[mid] === targetPrice</code> — ห้ามคืนค่า boolean<br/>
    • <code>[AC-802]</code>: ปรับขอบเขต Binary Search <code>left = mid + 1</code> เมื่อราคาน้อยกว่า และ <code>right = mid - 1</code> เมื่อราคามากกว่า<br/>
    • <code>[AC-803]</code>: คืนค่า <code>-1</code> เมื่อหาไม่เจอเลย ตามธรรมเนียม index-based search (เช่น <code>Array.indexOf</code>)<br/><br/>
    🏗️ <strong>3. Production Constraints:</strong> ต้องรักษาประสิทธิภาพ Time Complexity ระดับ <code>O(log n)</code> เพื่อไม่ให้เซิร์ฟเวอร์ค้างเมื่อผู้ใช้ค้นหาตั๋วพร้อมกัน`,
    example: `if (prices[mid] === targetPrice) return mid;
else if (prices[mid] < targetPrice) left = mid + 1;
else right = mid - 1;
// หลุด loop แล้วยังไม่เจอ -> return -1;`,
    task: `จงเขียนลอจิก Binary Search ที่คืนค่า index ตามเกณฑ์ <code>[AC-801]</code>, <code>[AC-802]</code> และ <code>[AC-803]</code>`
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

  const onSuccess = () => {
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
    terminal.scrollTop = terminal.scrollHeight;
  };

  const onFailure = (err) => {
    terminal.innerHTML += logs.map(l => `<div class="terminal-line success">${escapeHtml(l)}</div>`).join('');
    terminal.innerHTML += `
      <div class="terminal-line info">---------------------------------------------------</div>
      <div class="terminal-line error">✕ <strong>ผลการตรวจ PRD Spec: ไม่ผ่าน (AC Failed)</strong></div>
      <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
      <div class="terminal-line error">1 failed (38ms)</div>
    `;
    terminal.scrollTop = terminal.scrollHeight;
  };

  setTimeout(() => {
    let result;
    try {
      result = lesson.validate(code, appendLog);
    } catch (err) {
      onFailure(err);
      return;
    }
    // Phase 3/4 validators execute the learner's async Playwright-style code for real
    // and return a Promise — every other phase's validate() throws synchronously and
    // returns undefined here, so this branch is a no-op for them.
    if (result && typeof result.then === 'function') {
      result.then(onSuccess).catch(onFailure);
    } else {
      onSuccess();
    }
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
    <div class="terminal-line text-muted">คุณพิสูจน์แล้วว่ามีความสามารถระดับ Senior/Staff QA Engineer ในการอ่านและสร้างระบบจริงตามสเปก PRD & Acceptance Criteria ตั้งแต่ Config ➔ DB ➔ Booking+Visa Integration ➔ Web (reuse Visa API) ➔ Mobile ➔ Performance+SLA ➔ CI/CD ➔ DS&A Algorithm!</div>
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
