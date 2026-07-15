// Performance Testing (k6) Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/My-Investment-Port/server/index.js Express API
// (same real endpoints and rate-limiter used by the API-Testing track's functional tests)

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "แนะนำความรู้พื้นฐาน k6",
    template: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  // 1. ยิง GET ไปที่ \${BASE_URL}/api/ai/health ของ My-Investment-Port
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบด้วย check() ว่า status เป็น 200

}`,
    validate: (code, log) => {
      log("🔍 กำลังตรวจสอบไวยากรณ์...");
      const hasGet = /const\s+res\s*=\s*http\.get\(`\$\{BASE_URL\}\/api\/ai\/health`\)/.test(code);
      if (hasGet) {
        log("✓ ขั้นตอนที่ 1: ยิง http.get(`${BASE_URL}/api/ai/health`) ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง http.get(`${BASE_URL}/api/ai/health`)\nตัวอย่าง: const res = http.get(`${BASE_URL}/api/ai/health`);");
      }

      const hasCheck = /check\(res,\s*\{[\s\S]*?status\s*===\s*200[\s\S]*?\}\)/.test(code);
      if (hasCheck) {
        log("✓ ขั้นตอนที่ 2: ใช้ check() ตรวจสอบ status 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบด้วย check()\nตัวอย่าง: check(res, { 'status is 200': (r) => r.status === 200 });");
      }
    },
    hint: "ใช้ const res = http.get(`${BASE_URL}/api/ai/health`); แล้ว check(res, { 'status is 200': (r) => r.status === 200 });",
    solution: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  // 1. ยิง GET ไปที่ \${BASE_URL}/api/ai/health ของ My-Investment-Port
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);

  // 2. ตรวจสอบด้วย check() ว่า status เป็น 200
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}`,
    theory: `<strong>k6</strong> คือเครื่องมือ Load/Performance Testing แบบ Code-first (เขียนสคริปต์ด้วย JavaScript) ใช้ยิง HTTP request จริงไปยัง Backend เพื่อวัดว่าระบบรับโหลดพร้อมกันได้ดีแค่ไหน ต่างจาก Playwright API Testing ที่ยิง 1 request ต่อ 1 test case, k6 จะรัน <code>default function</code> เดียวกันซ้ำๆ พร้อมกันหลาย "Virtual User (VU)" เพื่อจำลองผู้ใช้จริงจำนวนมาก<br/><br/>
    องค์ประกอบพื้นฐาน:<br/>
    1. <strong><code>http.get()</code></strong>: ยิง HTTP request จริง (เหมือน Playwright's <code>request.get()</code> แต่ออกแบบมาสำหรับยิงซ้ำเป็นพันๆ ครั้ง)<br/>
    2. <strong><code>check()</code></strong>: ตรวจสอบผลลัพธ์แบบ "soft assertion" — ถ้าไม่ผ่าน จะบันทึกอัตราความล้มเหลวไว้ในรายงาน แต่<strong>ไม่หยุดสคริปต์</strong> (ต่างจาก Playwright's <code>expect()</code> ที่ throw error ทันที) เพราะ k6 ต้องรันต่อเนื่องนับพัน iteration แม้บาง iteration จะ fail<br/><br/>
    เอนด์พอยต์ <code>/api/ai/health</code> คือตัวเดียวกับที่ใช้ในบท "GET Request พื้นฐาน" ของ track API Testing (Playwright) — Playwright ตรวจ "ถูกต้องไหม" (functional), k6 ตรวจ "รับโหลดพร้อมกันได้ไหม" (performance) คนละมุมมองแต่ endpoint จริงเดียวกัน`,
    example: `// ตัวอย่างยิง POST พร้อม body ใน k6
import http from 'k6/http';
const res = http.post('http://localhost:3001/api/ai/panel', JSON.stringify({ panel: 'risk' }), {
  headers: { 'Content-Type': 'application/json' },
});`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. ยิง GET ไปที่ <code>\${BASE_URL}/api/ai/health</code><br/>
    2. ใช้ <code>check()</code> ตรวจสอบว่า status code เป็น <code>200</code>`
  },
  {
    id: "options_vus_duration",
    meta: "บทที่ 1",
    title: "Options: กำหนดจำนวน Virtual User และระยะเวลา",
    template: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// 1. กำหนด export const options ให้มี vus: 10 และ duration: '30s'
// WRITE YOUR CODE HERE


export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Options...");
      const hasOptions = /export\s+const\s+options\s*=\s*\{[\s\S]*?vus:\s*10[\s\S]*?duration:\s*['"]30s['"][\s\S]*?\}/.test(code) ||
                         /export\s+const\s+options\s*=\s*\{[\s\S]*?duration:\s*['"]30s['"][\s\S]*?vus:\s*10[\s\S]*?\}/.test(code);
      if (hasOptions) {
        log("✓ ตั้งค่า options ด้วย vus: 10 และ duration: '30s' ถูกต้อง");
      } else {
        throw new Error("ไม่พบ export const options ที่มี vus: 10 และ duration: '30s'\nตัวอย่าง: export const options = { vus: 10, duration: '30s' };");
      }
    },
    hint: "ใช้ export const options = { vus: 10, duration: '30s' };",
    solution: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// 1. กำหนด export const options ให้มี vus: 10 และ duration: '30s'
export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    theory: `<code>export const options</code> คือจุดกำหนด "รูปแบบโหลด" ที่ k6 จะจำลอง สองค่าพื้นฐานที่สุด:<br/><br/>
    1. <strong><code>vus</code></strong> (Virtual Users): จำนวนผู้ใช้จำลองที่รัน <code>default function</code> พร้อมกันตลอดการทดสอบ — <code>vus: 10</code> คือมี "ผู้ใช้จำลอง" 10 คนยิง request วนซ้ำพร้อมกันตลอดเวลา<br/>
    2. <strong><code>duration</code></strong>: ระยะเวลารวมของการทดสอบ (<code>'30s'</code>, <code>'2m'</code>, <code>'1h'</code>) — เมื่อครบเวลา k6 จะหยุดทุก VU ทันที ไม่สนใจว่า iteration ล่าสุดจะจบหรือยัง<br/><br/>
    ต่างจาก Playwright ที่ 1 test = 1 ผู้ใช้ 1 ครั้ง, k6 ด้วย <code>vus: 10, duration: '30s'</code> จะยิง request จากผู้ใช้จำลอง 10 คนพร้อมกันวนซ้ำต่อเนื่องนาน 30 วินาที — จำนวน request ทั้งหมดขึ้นอยู่กับว่าแต่ละ iteration ใช้เวลาเท่าไหร่ ไม่ใช่ค่าคงที่ที่กำหนดตรงๆ`,
    example: `// ตัวอย่างกำหนดจำนวน iteration ตายตัวแทนการใช้ duration
export const options = {
  vus: 5,
  iterations: 50, // รันรวมทั้งหมด 50 ครั้ง แบ่งกันระหว่าง 5 VU แล้วหยุด
};`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. กำหนด <code>options</code> ให้มี <code>vus: 10</code> และ <code>duration: '30s'</code>`
  },
  {
    id: "thresholds",
    meta: "บทที่ 2",
    title: "Thresholds: กำหนดเกณฑ์ผ่าน/ไม่ผ่านของ Performance",
    template: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 10,
  duration: '30s',
  // 1. กำหนด thresholds ให้ http_req_duration ต้องมี p(95) ต่ำกว่า 500ms และ http_req_failed ต้องต่ำกว่า 1%
  // WRITE YOUR CODE HERE

};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Thresholds...");
      const hasDuration = /http_req_duration:\s*\[\s*['"]p\(95\)<500['"]\s*\]/.test(code);
      if (hasDuration) {
        log("✓ ขั้นตอนที่ 1: ตั้ง threshold http_req_duration p(95)<500 ถูกต้อง");
      } else {
        throw new Error("ไม่พบ threshold http_req_duration: ['p(95)<500']\nตัวอย่าง: http_req_duration: ['p(95)<500'],");
      }

      const hasFailed = /http_req_failed:\s*\[\s*['"]rate<0\.01['"]\s*\]/.test(code);
      if (hasFailed) {
        log("✓ ขั้นตอนที่ 2: ตั้ง threshold http_req_failed rate<0.01 ถูกต้อง");
      } else {
        throw new Error("ไม่พบ threshold http_req_failed: ['rate<0.01']\nตัวอย่าง: http_req_failed: ['rate<0.01'],");
      }
    },
    hint: "ใส่ thresholds: { http_req_duration: ['p(95)<500'], http_req_failed: ['rate<0.01'] } ใน options",
    solution: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 10,
  duration: '30s',
  // 1. กำหนด thresholds ให้ http_req_duration ต้องมี p(95) ต่ำกว่า 500ms และ http_req_failed ต้องต่ำกว่า 1%
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    theory: `<strong>Threshold</strong> คือเกณฑ์ที่ทำให้ k6 <strong>จบด้วย exit code ล้มเหลว</strong> (เอาไปเสียบ CI/CD ได้ทันที) ต่างจาก <code>check()</code> ที่แค่บันทึกอัตราผ่าน/ไม่ผ่านไว้ดูเฉยๆ ไม่กระทบผลลัพธ์รวมของการรัน<br/><br/>
    Metric ที่ใช้บ่อยที่สุด:<br/>
    1. <strong><code>http_req_duration</code></strong>: เวลาตอบสนองของทุก request ระบุแบบ percentile เช่น <code>p(95)&lt;500</code> หมายถึง "95% ของ request ทั้งหมดต้องตอบภายใน 500ms" (ไม่ใช้ค่าเฉลี่ยเพราะค่าผิดปกติไม่กี่ตัวจะถูกกลบไปหมด)<br/>
    2. <strong><code>http_req_failed</code></strong>: อัตราของ request ที่ล้มเหลว (status >= 400 หรือ connection error) เช่น <code>rate&lt;0.01</code> หมายถึง "ต้องมี request ที่ fail น้อยกว่า 1%"<br/><br/>
    ถ้า threshold ไหนไม่ผ่าน k6 จะจบด้วย exit code ที่ไม่ใช่ 0 — CI pipeline เอาไปเช็คแล้ว block การ deploy ได้ทันทีโดยไม่ต้องอ่านรายงานเอง`,
    example: `// ตัวอย่าง threshold ที่เข้มงวดกว่าสำหรับ endpoint ที่ critical
export const options = {
  thresholds: {
    'http_req_duration{endpoint:checkout}': ['p(99)<300'],
    http_req_failed: ['rate<0.001'],
  },
};`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดยกำหนด <code>thresholds</code>:<br/>
    1. <code>http_req_duration</code> ต้องมี <code>p(95)&lt;500</code> (95% ของ request ตอบภายใน 500ms)<br/>
    2. <code>http_req_failed</code> ต้องมี <code>rate&lt;0.01</code> (fail น้อยกว่า 1%)`
  },
  {
    id: "stages_ramping",
    meta: "บทที่ 3",
    title: "Stages: จำลอง Load แบบค่อยๆ เพิ่ม-ลด (Ramping)",
    template: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  // 1. กำหนด stages ให้ค่อยๆ เพิ่มจาก 0 ไป 20 VU ใน 10 วินาที, คงที่ 20 VU นาน 30 วินาที, แล้วค่อยๆ ลดกลับ 0 ใน 10 วินาที
  // WRITE YOUR CODE HERE

};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Stages...");
      const hasRampUp = /\{\s*duration:\s*['"]10s['"]\s*,\s*target:\s*20\s*\}/.test(code);
      const hasPlateau = /\{\s*duration:\s*['"]30s['"]\s*,\s*target:\s*20\s*\}/.test(code);
      const hasRampDown = /\{\s*duration:\s*['"]10s['"]\s*,\s*target:\s*0\s*\}/.test(code);

      if (hasRampUp) {
        log("✓ ขั้นตอนที่ 1: ramp up 0→20 VU ใน 10s ถูกต้อง");
      } else {
        throw new Error("ไม่พบ stage ramp up { duration: '10s', target: 20 }");
      }

      if (hasPlateau) {
        log("✓ ขั้นตอนที่ 2: คงที่ 20 VU นาน 30s ถูกต้อง");
      } else {
        throw new Error("ไม่พบ stage คงที่ { duration: '30s', target: 20 }");
      }

      if (hasRampDown) {
        log("✓ ขั้นตอนที่ 3: ramp down 20→0 VU ใน 10s ถูกต้อง");
      } else {
        throw new Error("ไม่พบ stage ramp down { duration: '10s', target: 0 }");
      }
    },
    hint: "ใส่ stages: [ { duration: '10s', target: 20 }, { duration: '30s', target: 20 }, { duration: '10s', target: 0 } ]",
    solution: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  // 1. กำหนด stages ให้ค่อยๆ เพิ่มจาก 0 ไป 20 VU ใน 10 วินาที, คงที่ 20 VU นาน 30 วินาที, แล้วค่อยๆ ลดกลับ 0 ใน 10 วินาที
  stages: [
    { duration: '10s', target: 20 },
    { duration: '30s', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    theory: `ผู้ใช้จริงไม่ได้เปิดเว็บพร้อมกันทีเดียว 1,000 คนในเสี้ยววินาที — ปริมาณ traffic ค่อยๆ เพิ่มขึ้น (ช่วงเช้าคนเข้างาน) แล้วค่อยๆ ลดลง (ช่วงดึก) การทดสอบด้วย <code>vus</code> คงที่ตรงๆ จึงไม่สมจริงเท่า <strong><code>stages</code></strong> ซึ่งกำหนดโปรไฟล์โหลดที่เปลี่ยนแปลงตามเวลาได้<br/><br/>
    แต่ละ stage คือ <code>{ duration, target }</code>: "ใช้เวลา <code>duration</code> ในการไล่จำนวน VU ปัจจุบันไปสู่ <code>target</code>" เรียงต่อกันเป็นลำดับ:<br/>
    1. <code>{ duration: '10s', target: 20 }</code> — ไล่ VU จาก 0 ขึ้นไป 20 ภายใน 10 วินาที (ramp-up)<br/>
    2. <code>{ duration: '30s', target: 20 }</code> — คงที่ 20 VU นาน 30 วินาที (plateau, ช่วงวัดผลจริง)<br/>
    3. <code>{ duration: '10s', target: 0 }</code> — ไล่ VU ลงกลับ 0 ภายใน 10 วินาที (ramp-down, ดูพฤติกรรมตอน traffic ลดฮวบ)<br/><br/>
    <strong>ข้อควรระวัง</strong>: <code>options.vus</code>/<code>options.duration</code> กับ <code>options.stages</code> ใช้แทนกันไม่ได้ในสคริปต์เดียวกัน — ถ้ามี <code>stages</code> แล้ว k6 จะใช้ค่านั้นควบคุมจำนวน VU ตลอดการทดสอบแทน ไม่สนใจ <code>vus</code>/<code>duration</code> ที่ตั้งไว้`,
    example: `// ตัวอย่าง stress test: ไล่โหลดขึ้นเรื่อยๆ จนกว่าจะพัง (ไม่มี ramp-down)
export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 200 },
  ],
};`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดยกำหนด <code>stages</code>:<br/>
    1. Ramp-up จาก 0 ไป <code>20</code> VU ภายใน <code>10s</code><br/>
    2. คงที่ <code>20</code> VU นาน <code>30s</code><br/>
    3. Ramp-down จาก 20 กลับไป <code>0</code> VU ภายใน <code>10s</code>`
  },
  {
    id: "rate_limit_aware",
    meta: "บทที่ 4",
    title: "Load Test ชนกับ Rate Limit จริง: ต้องคาดการณ์ 429 ไว้ล่วงหน้า",
    template: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 20,
  duration: '10s',
};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);

  // หมายเหตุ: server จริงมี rate limiter (server/index.js) จำกัด 100 request/นาที/IP
  // ยิงด้วย 20 VU ต่อเนื่องแบบนี้จะชนขีดจำกัดแน่นอน — ได้ 429 กลับมาไม่ใช่บั๊ก
  // 1. เช็คด้วย check() ว่า status ต้องเป็น 200 หรือ 429 เท่านั้น (ไม่ใช่ error อื่นเช่น 500)
  // WRITE YOUR CODE HERE

}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการออกแบบ check() ให้รองรับ Rate Limit จริง...");
      const hasCorrectCheck = /check\(res,\s*\{[\s\S]*?r\.status\s*===\s*200\s*\|\|\s*r\.status\s*===\s*429[\s\S]*?\}\)/.test(code);
      const hasWrongCheck = /check\(res,\s*\{[\s\S]*?r\.status\s*===\s*200[\s\S]*?\}\)/.test(code) && !hasCorrectCheck;

      if (hasCorrectCheck) {
        log("✓ ใช้ check() ที่ยอมรับทั้ง 200 และ 429 ถูกต้อง (รองรับ Rate Limit จริงของ server)");
      } else if (hasWrongCheck) {
        throw new Error("check() นี้เช็คเฉพาะ status 200 เท่านั้น — เมื่อ 20 VU ยิงต่อเนื่องจะชน Rate Limit จริง (100 req/min) แล้วได้ 429 กลับมา ทำให้ check() นี้ fail จำนวนมากทั้งที่ server ทำงานถูกต้องตามที่ออกแบบไว้\nตัวอย่าง: check(res, { 'status is 200 or 429': (r) => r.status === 200 || r.status === 429 });");
      } else {
        throw new Error("ไม่พบการเช็คด้วย check()\nตัวอย่าง: check(res, { 'status is 200 or 429': (r) => r.status === 200 || r.status === 429 });");
      }
    },
    hint: "ใช้ check(res, { 'status is 200 or 429': (r) => r.status === 200 || r.status === 429 }); เพราะ 429 คือพฤติกรรมที่ถูกต้องของ Rate Limiter จริง ไม่ใช่บั๊ก",
    solution: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 20,
  duration: '10s',
};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);

  // หมายเหตุ: server จริงมี rate limiter (server/index.js) จำกัด 100 request/นาที/IP
  // ยิงด้วย 20 VU ต่อเนื่องแบบนี้จะชนขีดจำกัดแน่นอน — ได้ 429 กลับมาไม่ใช่บั๊ก
  // 1. เช็คด้วย check() ว่า status ต้องเป็น 200 หรือ 429 เท่านั้น (ไม่ใช่ error อื่นเช่น 500)
  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
  });
}`,
    theory: `เอนด์พอยต์ <code>/api/ai/health</code> ใช้ในบทเรียนนี้ ผูกอยู่กับ middleware <code>express-rate-limit</code> จริงตัวเดียวกับที่บท "Rate-Limit Testing" ของ track API Testing (Playwright) เคยพิสูจน์มาแล้วในระดับ functional test:<br/><br/>
    <code>const limiter = rateLimit({<br/>
    &nbsp;&nbsp;windowMs: 1 * 60 * 1000, // 1 นาที<br/>
    &nbsp;&nbsp;max: 100, // 100 request ต่อนาทีต่อ IP<br/>
    });<br/>
    app.use(limiter);</code><br/><br/>
    ถ้าตั้ง <code>vus: 20</code> ยิงต่อเนื่อง 10 วินาที จำนวน request จะเกิน 100/นาทีอย่างรวดเร็วแน่นอน — ผลคือได้ <code>429</code> กลับมาเป็นสัดส่วนสูง <strong>นี่ไม่ใช่บั๊ก</strong> แต่คือ Rate Limiter ทำงานถูกต้องตามที่ Dev ออกแบบไว้<br/><br/>
    บั๊กที่พบบ่อยที่สุดของ Performance Testing มือใหม่: เขียน <code>check()</code> เช็คเฉพาะ <code>status === 200</code> แล้วตกใจเมื่อเห็นอัตราความล้มเหลวพุ่งสูงตอนรัน load test พร้อมสรุปผิดว่า "server รับโหลดไม่ไหว" ทั้งที่จริงคือ Rate Limiter กำลังปกป้องระบบอยู่ การออกแบบ check()/threshold ที่ถูกต้องต้อง<strong>รู้ล่วงหน้าว่าระบบมี guard อะไรบ้าง</strong> แล้วนับ 429 เป็นผลลัพธ์ที่คาดหวังไว้ ไม่ใช่ความล้มเหลว — Functional test (Playwright) พิสูจน์แล้วว่า Limiter บล็อกถูกจุด, Performance test (k6) นี้พิสูจน์ต่อว่า Limiter ตัวเดียวกันยังทำงานถูกต้องแม้ภายใต้โหลดพร้อมกันจริง`,
    example: `// ตัวอย่างแยกนับอัตรา 429 ต่างหาก เพื่อยืนยันว่า Rate Limiter ทำงานจริง (ไม่ใช่แค่ยอมให้ผ่าน)
import { Rate } from 'k6/metrics';
const rateLimitHits = new Rate('rate_limit_triggered');

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);
  rateLimitHits.add(res.status === 429);
}`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. เช็คด้วย <code>check()</code> ว่า status เป็น <code>200</code> หรือ <code>429</code> เท่านั้น (ไม่ใช่ error อื่น) เพราะ 20 VU ยิงต่อเนื่องจะชน Rate Limiter จริงของ <code>server/index.js</code> แน่นอน`
  }
];

// Application state
let currentLessonIndex = 0;
let completedLessons = {}; // tracks lessonId -> boolean

// Initialize the app
function initApp() {
  renderLessonList();
  loadLesson(currentLessonIndex);
  updateProgressBar();

  // Set up lesson menu toggle (overlay drawer)
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });

    // Close the drawer when clicking outside of it
    document.addEventListener('click', (e) => {
      if (!sidebar.classList.contains('show')) return;
      if (sidebar.contains(e.target) || toggleBtn.contains(e.target)) return;
      sidebar.classList.remove('show');
    });
  }

  // Sync tab focus and prevent tab exit
  const textarea = document.getElementById('editor-textarea');
  if (textarea) {
    textarea.addEventListener('keydown', handleTextareaKeydown);
    textarea.addEventListener('input', updateGutter);
    textarea.addEventListener('scroll', syncGutterScroll);
  }
}

// Keydown handler to prevent tab key escaping the editor
function handleTextareaKeydown(e) {
  const textarea = e.target;
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert 2 spaces
    textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);

    // Move cursor
    textarea.selectionStart = textarea.selectionEnd = start + 2;
    updateGutter();
  }

  // CMD/Ctrl + Enter shortcut to run tests
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    runSandboxCode();
  }
}

// Synced scroll between textarea and line numbers gutter
function syncGutterScroll(e) {
  const gutter = document.getElementById('editor-gutter');
  if (gutter) gutter.scrollTop = e.target.scrollTop;
}

// Render line numbers in the gutter
function updateGutter() {
  const textarea = document.getElementById('editor-textarea');
  const gutter = document.getElementById('editor-gutter');
  if (!textarea || !gutter) return;

  const lineCount = textarea.value.split('\n').length;
  const numbers = [];
  for (let i = 1; i <= lineCount; i++) {
    numbers.push(`<div>${i}</div>`);
  }
  gutter.innerHTML = numbers.join('');
}

// Render the sidebar list
function renderLessonList() {
  const listContainer = document.getElementById('lesson-list');
  if (!listContainer) return;

  listContainer.innerHTML = LESSONS.map((lesson, idx) => {
    const isCompleted = isLessonCompleted(lesson.id);
    const activeClass = idx === currentLessonIndex ? 'active' : '';
    const completedClass = isCompleted ? 'completed' : '';

    return `
      <button class="lesson-item ${activeClass} ${completedClass}" onclick="selectLesson(${idx})">
        <div class="lesson-item-meta">
          <span>${lesson.meta}</span>
          <span class="check-icon">✓ ผ่านการประเมิน</span>
        </div>
        <div class="lesson-item-title">${lesson.title}</div>
      </button>
    `;
  }).join('');
}

// Select a lesson from sidebar
function selectLesson(idx) {
  currentLessonIndex = idx;
  renderLessonList();
  loadLesson(idx);

  // Hide sidebar after selection (always an overlay drawer now)
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('show');
  }
}

// Load lesson content and reset editor
function loadLesson(idx) {
  const lesson = LESSONS[idx];
  const titleContainer = document.getElementById('current-lesson-title');
  const bodyContainer = document.getElementById('lesson-body');
  const textarea = document.getElementById('editor-textarea');
  const overlay = document.getElementById('lesson-overlay');

  if (titleContainer) titleContainer.innerText = lesson.title;

  // Build premium structured explain-demonstrate-practice blocks
  if (bodyContainer) {
    bodyContainer.innerHTML = `
      <div class="content-block theory">
        <div class="content-block-title">📘 คำอธิบาย (Theory)</div>
        <div class="content-text">${lesson.theory}</div>
      </div>
      <div class="content-block example">
        <div class="content-block-title">💻 โค้ดตัวอย่าง (Example)</div>
        <div class="content-text"><pre><code>${escapeHtml(lesson.example)}</code></pre></div>
      </div>
      <div class="content-block task">
        <div class="content-block-title">🎯 โจทย์ปฏิบัติการ (Challenge Task)</div>
        <div class="content-text">${lesson.task}</div>
      </div>
    `;
  }

  // Reset overlay
  if (overlay) overlay.classList.remove('show');

  // Restore code if edited or load default template
  const savedCode = localStorage.getItem(`perf_sandbox_code_${lesson.id}`);
  if (textarea) {
    textarea.value = savedCode !== null ? savedCode : lesson.template;
    updateGutter();
  }

  // Reset Terminal output
  const terminal = document.getElementById('terminal-body');
  if (terminal) {
    terminal.innerHTML = `<div class="terminal-line text-muted">พร้อมสำหรับรันการทดสอบ... เขียนโค้ดด้านบนแล้วกด Run Tests</div>`;
  }
}

// Helper to escape HTML tags inside code blocks
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Show lesson Hint
function showLessonHint() {
  const lesson = LESSONS[currentLessonIndex];
  showDialog("💡 คำแนะนำช่วยเหลือ (Hint)", lesson.hint, false);
}

// Show lesson Solution
function showLessonSolution() {
  const lesson = LESSONS[currentLessonIndex];
  showDialog("🔑 เฉลยคำตอบ (Solution)", lesson.solution, true);
}

// Show custom dialog modal
function showDialog(title, content, showAction) {
  const overlay = document.getElementById('dialog-overlay');
  const titleEl = document.getElementById('dialog-title');
  const contentEl = document.getElementById('dialog-content');
  const actionBtn = document.getElementById('dialog-action-btn');

  if (!overlay || !titleEl || !contentEl || !actionBtn) return;

  titleEl.innerText = title;
  contentEl.innerText = content;

  if (showAction) {
    actionBtn.style.display = 'block';
    actionBtn.onclick = () => {
      applySolution(content);
      closeDialog();
    };
  } else {
    actionBtn.style.display = 'none';
  }

  overlay.classList.add('show');
}

// Close dialog modal
function closeDialog() {
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) overlay.classList.remove('show');
}

// Paste the solution directly into the editor
function applySolution(code) {
  const textarea = document.getElementById('editor-textarea');
  if (textarea) {
    textarea.value = code;
    updateGutter();

    const terminal = document.getElementById('terminal-body');
    if (terminal) {
      terminal.innerHTML += `<div class="terminal-line info">[System] ทำการป้อนโค้ดเฉลยลงใน Editor อัตโนมัติเรียบร้อยแล้ว</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }
  }
}

// Check if lesson is marked completed in localStorage
function isLessonCompleted(lessonId) {
  return localStorage.getItem('perf_course_completed_' + lessonId) === 'true';
}

// Mark lesson completed
function setLessonCompleted(lessonId) {
  localStorage.setItem('perf_course_completed_' + lessonId, 'true');
  renderLessonList();
  updateProgressBar();
}

// Update overall progress bar
function updateProgressBar() {
  const completedCount = LESSONS.filter(l => isLessonCompleted(l.id)).length;
  const percent = Math.round((completedCount / LESSONS.length) * 100);

  const fill = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-label');

  if (fill) fill.style.width = percent + '%';
  if (label) label.innerText = `${completedCount} / ${LESSONS.length} บทเรียน`;
}

// Sandbox compilation and execution evaluation
function runSandboxCode() {
  const lesson = LESSONS[currentLessonIndex];
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal || !nextLessonBtn || !overlay) return;

  const userCode = textarea.value;

  // Save user code state
  localStorage.setItem(`perf_sandbox_code_${lesson.id}`, userCode);

  // Start compiling animation log in terminal
  terminal.innerHTML = `
    <div class="terminal-line info">[k6 Runner] กำลังเริ่มรัน Load Test...</div>
    <div class="terminal-line info">k6 run ${lesson.id}.js</div>
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
      // Execute the validator function of the current lesson
      lesson.validate(userCode, log);

      // Success logs
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
        <div class="terminal-line success">checks.........................: 100.00%</div>
        <div class="terminal-line success">http_req_failed................: 0.00%</div>
      `;

      // Mark as completed
      setLessonCompleted(lesson.id);

      // Show next lesson modal overlay
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
      // Print compilation errors in red in the terminal
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">ข้อผิดพลาด: ${err.message.replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">checks.........................: 0.00%</div>
      `;
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, 600);
}

// Reset course progress
function resetCourse() {
  if (confirm("คุณต้องการล้างประวัติการเขียนและล้างความคืบหน้าทั้งหมดเพื่อเริ่มต้นใหม่ใช่หรือไม่?")) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('perf_course_completed_') || key.startsWith('perf_sandbox_code_'))) {
        localStorage.removeItem(key);
      }
    }
    currentLessonIndex = 0;
    initApp();
  }
}

// Show graduation final messages
function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Performance Testing (k6) Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค VUs, Thresholds, Stages และการออกแบบ check() ให้รู้จัก Rate Limiter จริง ไปทดสอบ Load ของ Backend จริงในโปรเจค My-Investment-Port (server/index.js)!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

// Run on window boot
window.onload = initApp;
