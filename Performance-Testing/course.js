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
  },
  {
    id: "sleep_think_time",
    meta: "บทที่ 5",
    title: "sleep(): จำลอง Think Time ของผู้ใช้จริง",
    template: `import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
  // 1. หน่วงเวลา 1 วินาทีก่อนเริ่ม iteration ถัดไป (จำลองเวลาที่ผู้ใช้จริงใช้อ่าน/คิดก่อนกดต่อ)
  // WRITE YOUR CODE HERE

}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ sleep()...");
      const hasImport = /import\s*\{\s*sleep\s*\}\s*from\s*['"]k6['"]/.test(code);
      const hasSleep = /sleep\(1\)/.test(code);
      if (!hasImport) {
        throw new Error("ไม่พบ import { sleep } from 'k6'\nตัวอย่าง: import { sleep } from 'k6';");
      }
      if (!hasSleep) {
        throw new Error("ไม่พบคำสั่ง sleep(1)\nตัวอย่าง: sleep(1);");
      }
      log("✓ ใช้ sleep(1) จำลอง think time ถูกต้อง");
    },
    hint: "import { sleep } from 'k6'; แล้วเรียก sleep(1); ท้าย default function",
    solution: `import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
  // 1. หน่วงเวลา 1 วินาทีก่อนเริ่ม iteration ถัดไป (จำลองเวลาที่ผู้ใช้จริงใช้อ่าน/คิดก่อนกดต่อ)
  sleep(1);
}`,
    theory: `ถ้าไม่ใส่ <code>sleep()</code> เลย แต่ละ Virtual User จะวน <code>default function</code> ซ้ำเร็วที่สุดเท่าที่ทำได้แบบไม่หยุดพัก — ไม่สมจริงเลย เพราะผู้ใช้จริงไม่ได้กดรีเฟรชหน้าเว็บรัวๆ ไม่มีจังหวะหยุดคิด<br/><br/>
    <code>sleep(&lt;วินาที&gt;)</code> หยุดพัก VU นั้นก่อนเริ่ม iteration ถัดไป จำลอง "think time" — เวลาที่ผู้ใช้จริงใช้อ่านข้อมูลบนหน้าจอหรือตัดสินใจก่อนกดต่อ ทำให้จำนวน request/วินาทีที่เกิดจริงใกล้เคียงพฤติกรรมผู้ใช้จริงมากขึ้น แทนที่จะยิงถี่เกินจริงจนอาจชน Rate Limiter เร็วกว่าที่ผู้ใช้จริงจะทำได้ (เทียบกับบท Rate Limit ก่อนหน้า)`,
    example: `// think time แบบสุ่มช่วง 1-3 วินาที สมจริงกว่าค่าคงที่ตายตัว
sleep(Math.random() * 2 + 1);`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. import <code>sleep</code> จาก <code>k6</code><br/>
    2. เรียก <code>sleep(1)</code> หลังยิง request ในแต่ละ iteration`
  },
  {
    id: "custom_metrics",
    meta: "บทที่ 6",
    title: "Custom Metrics: นับเหตุการณ์เฉพาะที่ k6 ไม่ได้วัดให้อัตโนมัติ",
    template: `import http from 'k6/http';
import { Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
// 1. สร้าง Custom Counter ชื่อ 'rate_limit_count' เพื่อนับจำนวนครั้งที่เจอ 429 โดยเฉพาะ
// WRITE YOUR CODE HERE


export const options = {
  vus: 20,
  duration: '10s',
};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);
  // 2. เพิ่มค่า Counter ทีละ 1 เฉพาะตอน status เป็น 429

}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสร้าง Custom Counter...");
      const hasImport = /import\s*\{\s*Counter\s*\}\s*from\s*['"]k6\/metrics['"]/.test(code);
      const hasDeclare = /new Counter\(\s*['"]rate_limit_count['"]\s*\)/.test(code);
      const hasAdd = /\.add\(1\)/.test(code);

      if (!hasImport) {
        throw new Error("ไม่พบ import { Counter } from 'k6/metrics'\nตัวอย่าง: import { Counter } from 'k6/metrics';");
      }
      if (!hasDeclare) {
        throw new Error("ไม่พบการสร้าง Counter ชื่อ 'rate_limit_count'\nตัวอย่าง: const rateLimitCount = new Counter('rate_limit_count');");
      }
      if (!hasAdd) {
        throw new Error("ไม่พบการเพิ่มค่า Counter ด้วย .add(1)\nตัวอย่าง: if (res.status === 429) { rateLimitCount.add(1); }");
      }
      log("✓ สร้างและใช้งาน Custom Counter ถูกต้อง");
    },
    hint: "import { Counter } from 'k6/metrics'; const rateLimitCount = new Counter('rate_limit_count'); แล้ว if (res.status === 429) rateLimitCount.add(1);",
    solution: `import http from 'k6/http';
import { Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
const rateLimitCount = new Counter('rate_limit_count');

export const options = {
  vus: 20,
  duration: '10s',
};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);
  if (res.status === 429) {
    rateLimitCount.add(1);
  }
}`,
    theory: `k6 มี metric มาตรฐานให้อัตโนมัติอยู่แล้ว (<code>http_req_duration</code>, <code>http_req_failed</code> ที่ใช้ในบท Thresholds) แต่บางครั้งต้องการนับ "เหตุการณ์เฉพาะเจาะจง" ที่ metric มาตรฐานไม่แยกให้ — เช่นบท Rate Limit ก่อนหน้าที่ 429 ถือเป็นผลลัพธ์ที่คาดหวัง (ไม่ใช่ failure) การรู้ว่า "โดน Rate Limit กี่ครั้งกันแน่" แยกออกมาต่างหากจึงมีประโยชน์กว่าดูแค่ตัวเลข failed รวมๆ<br/><br/>
    <strong>Custom Metrics</strong> ที่ใช้บ่อย:<br/>
    • <strong>Counter</strong> — นับจำนวนสะสม (ใช้ในบทนี้: นับจำนวนครั้งที่เจอ 429)<br/>
    • <strong>Trend</strong> — เก็บการกระจายตัวของค่าตัวเลข (เช่น เวลาที่ใช้เฉพาะขั้นตอน business logic หนึ่งๆ) คำนวณ min/max/avg/percentile ให้อัตโนมัติ<br/>
    • <strong>Rate</strong> — สัดส่วน true/false (ตัวอย่างเคยเห็นในบท Rate Limit ก่อนหน้า)<br/>
    • <strong>Gauge</strong> — เก็บแค่ค่าล่าสุด<br/><br/>
    ค่าที่นับผ่าน Custom Metric จะไปโผล่ในสรุปผลตอนจบการทดสอบ (k6 summary) แยกต่างหากจาก metric มาตรฐาน ทำให้อ่านรายงานได้ตรงประเด็นกว่า`,
    example: `// Trend ใช้วัดการกระจายตัวของเวลาที่ใช้เฉพาะขั้นตอนหนึ่ง
import { Trend } from 'k6/metrics';
const aiPanelDuration = new Trend('ai_panel_duration');

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/panel\`);
  aiPanelDuration.add(res.timings.duration);
}`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. สร้าง Custom Counter ชื่อ <code>rate_limit_count</code><br/>
    2. เพิ่มค่า Counter ทีละ 1 เฉพาะตอน <code>res.status === 429</code>`
  },
  {
    id: "group_transactions",
    meta: "บทที่ 7",
    title: "group(): จัดกลุ่ม Multi-step Transaction ในรายงานผล",
    template: `import http from 'k6/http';
import { group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 5,
  duration: '15s',
};

export default function () {
  // 1. จัดกลุ่มขั้นตอน "AI Model Check" ให้ครอบคลุมการยิง GET /api/ai/health และ GET /api/ai/model ไว้ด้วยกัน
  // WRITE YOUR CODE HERE

}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ group()...");
      const hasImport = /import\s*\{\s*group\s*\}\s*from\s*['"]k6['"]/.test(code);
      const hasGroup = /group\(\s*['"]AI Model Check['"]/.test(code);
      const hasHealth = /\/api\/ai\/health/.test(code);
      const hasModel = /\/api\/ai\/model[`'"]/.test(code);

      if (!hasImport) {
        throw new Error("ไม่พบ import { group } from 'k6'\nตัวอย่าง: import { group } from 'k6';");
      }
      if (!hasGroup) {
        throw new Error("ไม่พบ group('AI Model Check', ...)\nตัวอย่าง: group('AI Model Check', () => { ... });");
      }
      if (!hasHealth || !hasModel) {
        throw new Error("ต้องยิงทั้ง /api/ai/health และ /api/ai/model ไว้ภายใน group เดียวกัน");
      }
      log("✓ ใช้ group() จัดกลุ่ม transaction ถูกต้อง");
    },
    hint: "import { group } from 'k6'; แล้วห่อ http.get สองอันด้วย group('AI Model Check', () => { ... });",
    solution: `import http from 'k6/http';
import { group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 5,
  duration: '15s',
};

export default function () {
  group('AI Model Check', () => {
    http.get(\`\${BASE_URL}/api/ai/health\`);
    http.get(\`\${BASE_URL}/api/ai/model\`);
  });
}`,
    theory: `บทเรียนก่อนหน้าทุกบทมี <strong>request เดียว</strong>ต่อ 1 iteration — แต่ user journey จริงมักมีหลายขั้นตอนต่อเนื่องกัน (เปิดหน้าเว็บ → โหลดข้อมูลหลายชุด → กดปุ่มทำ action) <code>group()</code> ห่อกลุ่ม request ที่เป็น "ขั้นตอนเดียวกันในทางธุรกิจ" เข้าด้วยกัน แล้วตั้งชื่อให้อ่านง่าย<br/><br/>
    ประโยชน์หลัก: รายงานสรุปผลของ k6 (summary output) จะแยกแสดงผลตาม group แทนที่จะกองรวมทุก request เป็น list แบนราบเดียว ทำให้เห็นชัดว่า "ขั้นตอนไหนช้า" แทนที่จะต้องไล่เดารายชื่อ URL เอง — ยิ่งสคริปต์มีหลายสิบ request ต่อ iteration ยิ่งจำเป็นต้องจัดกลุ่มแบบนี้`,
    example: `// จัดหลาย group ในสคริปต์เดียว แยกแต่ละขั้นตอนของ user journey
group('Health Check', () => {
  http.get(\`\${BASE_URL}/api/ai/health\`);
});
group('Model Switch', () => {
  http.get(\`\${BASE_URL}/api/ai/model\`);
  http.post(\`\${BASE_URL}/api/ai/model/switch\`, JSON.stringify({ model: 'gpt-4' }));
});`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. import <code>group</code> จาก <code>k6</code><br/>
    2. ห่อการยิง <code>/api/ai/health</code> และ <code>/api/ai/model</code> ไว้ใน <code>group('AI Model Check', ...)</code>`
  },
  {
    id: "scenarios_executors",
    meta: "บทที่ 8",
    title: "Scenarios & Executors: ควบคุมรูปแบบโหลดแบบ Explicit",
    template: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  // 1. กำหนด scenarios ชื่อ 'steady_load' ใช้ executor แบบ 'constant-vus' จำนวน 15 VU นาน '20s'
  // WRITE YOUR CODE HERE

};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า scenarios...");
      const hasScenarios = /scenarios:\s*\{/.test(code);
      const hasName = /steady_load:\s*\{/.test(code);
      const hasExecutor = /executor:\s*['"]constant-vus['"]/.test(code);
      const hasVus = /vus:\s*15/.test(code);
      const hasDuration = /duration:\s*['"]20s['"]/.test(code);

      if (!hasScenarios || !hasName) {
        throw new Error("ไม่พบ scenarios ชื่อ 'steady_load'\nตัวอย่าง: scenarios: { steady_load: { ... } }");
      }
      if (!hasExecutor) {
        throw new Error("ไม่พบ executor: 'constant-vus'");
      }
      if (!hasVus || !hasDuration) {
        throw new Error("ไม่พบ vus: 15 และ duration: '20s' ใน scenario");
      }
      log("✓ ตั้งค่า scenarios แบบ constant-vus ถูกต้อง");
    },
    hint: "ใส่ scenarios: { steady_load: { executor: 'constant-vus', vus: 15, duration: '20s' } }",
    solution: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  scenarios: {
    steady_load: {
      executor: 'constant-vus',
      vus: 15,
      duration: '20s',
    },
  },
};

export default function () {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}`,
    theory: `<code>vus</code>/<code>duration</code> (บทที่ 1) และ <code>stages</code> (บทที่ 3) ที่เคยเขียนมาทั้งหมด แท้จริงแล้วคือ<strong>รูปแบบย่อ</strong>ของ <code>scenarios</code> — k6 แปลงมันเป็น scenario เดียวที่ไม่มีชื่อให้อัตโนมัติเบื้องหลัง <code>scenarios</code> คือรูปแบบเต็มที่เปิดให้ควบคุมได้ละเอียดกว่า:<br/><br/>
    1. <strong>ตั้งชื่อ scenario ได้</strong> (เช่น <code>steady_load</code>) ทำให้อ่านรายงานง่ายขึ้นว่าผลลัพธ์มาจาก load pattern ไหน<br/>
    2. <strong>รันหลาย scenario พร้อมกันได้ในการทดสอบเดียว</strong> (เช่น โหลดคงที่พื้นหลัง + spike แทรกเข้ามาช่วงสั้นๆ พร้อมกัน) ซึ่งทำไม่ได้ถ้าใช้แค่ <code>vus</code>/<code>stages</code> เดี่ยวๆ<br/>
    3. <strong>เลือก executor ได้เต็มรูปแบบ</strong> — <code>constant-vus</code> (VU คงที่ตลอด, ใช้ในบทนี้), <code>ramping-vus</code> (เท่ากับ stages), <code>constant-arrival-rate</code> (คุม "จำนวน request/วินาที" ตรงๆ แทนที่จะคุมผ่านจำนวน VU), <code>per-vu-iterations</code> (แต่ละ VU วนตามจำนวนรอบที่กำหนด ไม่ใช่ตามเวลา)`,
    example: `// รัน 2 scenario พร้อมกัน: โหลดคงที่พื้นหลัง + spike แทรกเข้ามาช่วงสั้นๆ
export const options = {
  scenarios: {
    steady_load: { executor: 'constant-vus', vus: 15, duration: '30s' },
    traffic_spike: { executor: 'ramping-vus', startVUs: 0, stages: [{ duration: '5s', target: 50 }, { duration: '5s', target: 0 }], startTime: '10s' },
  },
};`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดยกำหนด <code>scenarios</code>:<br/>
    1. ตั้งชื่อ scenario ว่า <code>steady_load</code><br/>
    2. ใช้ <code>executor: 'constant-vus'</code>, <code>vus: 15</code>, <code>duration: '20s'</code>`
  },
  {
    id: "setup_teardown",
    meta: "บทที่ 9",
    title: "setup() / teardown(): เตรียมและเก็บกวาดก่อน-หลัง Load Test",
    template: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 10,
  duration: '10s',
};

// 1. เขียนฟังก์ชัน setup() ให้ยิง GET /api/ai/health ก่อนเริ่มโหลดจริง แล้ว return { healthCheckStatus: res.status }
// WRITE YOUR CODE HERE


export default function (data) {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}

// 2. เขียนฟังก์ชัน teardown() ให้ console.log('Load test เสร็จสมบูรณ์')
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ setup() และ teardown()...");
      const hasSetup = /export function setup\s*\(\s*\)\s*\{[\s\S]*?http\.get[\s\S]*?return[\s\S]*?\}/.test(code);
      const hasTeardown = /export function teardown\s*\(\s*\)\s*\{[\s\S]*?console\.log\(['"]Load test เสร็จสมบูรณ์['"]\)/.test(code);

      if (!hasSetup) {
        throw new Error("ไม่พบ setup() ที่ยิง http.get แล้ว return ค่า\nตัวอย่าง: export function setup() { const res = http.get(...); return { healthCheckStatus: res.status }; }");
      }
      if (!hasTeardown) {
        throw new Error("ไม่พบ teardown() ที่ console.log('Load test เสร็จสมบูรณ์')\nตัวอย่าง: export function teardown() { console.log('Load test เสร็จสมบูรณ์'); }");
      }
      log("✓ เขียน setup() และ teardown() ถูกต้อง");
    },
    hint: "export function setup() { const res = http.get(...); return { healthCheckStatus: res.status }; } และ export function teardown() { console.log('Load test เสร็จสมบูรณ์'); }",
    solution: `import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  vus: 10,
  duration: '10s',
};

export function setup() {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);
  return { healthCheckStatus: res.status };
}

export default function (data) {
  http.get(\`\${BASE_URL}/api/ai/health\`);
}

export function teardown() {
  console.log('Load test เสร็จสมบูรณ์');
}`,
    theory: `<code>setup()</code> รันแค่<strong>ครั้งเดียว</strong>ก่อนที่ VU ตัวไหนจะเริ่ม iterate เลย — เหมาะสำหรับเช็ค health ก่อนยิงโหลดจริง, เตรียม/seed ข้อมูลทดสอบ, หรือเก็บ baseline state ไว้เทียบภายหลัง ค่าที่ <code>return</code> ออกมาจาก <code>setup()</code> จะถูกส่งเป็น argument <code>data</code> เข้าไปใน <code>default function</code> ทุกครั้งที่ทุก VU เรียก (ในเทมเพลตนี้ยังไม่ได้ใช้ <code>data</code> แต่รับไว้เป็น parameter แล้ว)<br/><br/>
    <code>teardown()</code> รันแค่<strong>ครั้งเดียว</strong>หลังทุก VU จบการทดสอบทั้งหมดแล้ว — เหมาะสำหรับ log สรุปผล หรือ<strong>คืนค่าสถานะที่ระบบใช้ร่วมกันกลับเป็นค่าเริ่มต้น</strong><br/><br/>
    เชื่อมโยงกับบท "State Leak / Race Condition" ของ track API Testing: เอนด์พอยต์ <code>/api/ai/model/switch</code> ของ My-Investment-Port เปลี่ยนโมเดล AI แบบ global mutable state (ไม่ผูกกับ user คนใดคนหนึ่ง) ถ้า load test สคริปต์หนึ่งสลับโมเดลไปมาระหว่างทดสอบ แล้วจบการทดสอบโดยไม่คืนค่ากลับ โมเดลที่ค้างอยู่จะกระทบการทดสอบ/การใช้งานจริงครั้งถัดไปทันที — <code>teardown()</code> คือจุดที่ถูกต้องสำหรับสั่ง reset ค่านั้นกลับเป็นค่า default ก่อนจบสคริปต์`,
    example: `// ตัวอย่าง teardown() ที่ reset shared state กลับเป็นค่า default จริง
export function teardown() {
  http.post(\`\${BASE_URL}/api/ai/model/switch\`, JSON.stringify({ model: 'default' }), {
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('รีเซ็ต AI model กลับเป็นค่า default แล้ว');
}`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. เขียน <code>setup()</code> ให้ยิง <code>http.get</code> ไปที่ <code>/api/ai/health</code> แล้ว <code>return</code> ค่า status<br/>
    2. เขียน <code>teardown()</code> ให้ <code>console.log('Load test เสร็จสมบูรณ์')</code>`
  },
];

// Application state

const PREFIX = 'perf';
const TAB_WIDTH = 2;

function runSandboxCode() {
  const lesson = LESSONS[currentLessonIndex];
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal || !nextLessonBtn || !overlay) return;

  const userCode = textarea.value;

  // Save user code state
  localStorage.setItem(`${PREFIX}_sandbox_code_${lesson.id}`, userCode);

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
