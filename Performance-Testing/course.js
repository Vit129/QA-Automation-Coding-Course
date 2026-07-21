(function() {
// Performance Testing (k6) Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/My-Investment-Port/server/index.js Express API
// (same real endpoints and rate-limiter used by the API-Testing track's functional tests)

// ตัดคอมเมนต์ (// และ /* */) ออกจากโค้ดก่อนตรวจสอบด้วย validate() ทุกบทเรียน
// ป้องกันการเขียนคำตอบ/โค้ดที่ต้องการไว้ในคอมเมนต์เพื่อหลอกให้ regex ตรวจผ่าน
// หมายเหตุ: ไม่ตัด "//" ที่ตามหลัง ":" (เช่น http://, https://) เพื่อไม่ทำลาย URL ในโค้ดจริง
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(?<!:)\/\/.*$/gm, '');
}

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
      const src = stripComments(code);
      const hasGet = /const\s+res\s*=\s*http\.get\(`\$\{BASE_URL\}\/api\/ai\/health`\)/.test(src);
      if (hasGet) {
        log("✓ ขั้นตอนที่ 1: ยิง http.get(`${BASE_URL}/api/ai/health`) ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง http.get(`${BASE_URL}/api/ai/health`)\nตัวอย่าง: const res = http.get(`${BASE_URL}/api/ai/health`);");
      }

      const hasCheck = /check\(res,\s*\{[\s\S]*?status\s*===\s*200[\s\S]*?\}\)/.test(src);
      if (hasCheck) {
        log("✓ ขั้นตอนที่ 2: ใช้ check() ตรวจสอบ status 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบด้วย check()\nตัวอย่าง: check(res, { 'status is 200': (r) => r.status === 200 });");
      }
    },
    hint: "ใช้ http.get() ของ k6 ยิงไปที่ endpoint /api/ai/health ผ่านตัวแปร BASE_URL แล้วเก็บผลลัพธ์ไว้ในตัวแปร จากนั้นใช้ check() ตรวจสอบว่าค่า status ของ response ตรงกับ 200 หรือไม่",
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
      const src = stripComments(code);
      const hasOptions = /export\s+const\s+options\s*=\s*\{[\s\S]*?vus:\s*10[\s\S]*?duration:\s*['"]30s['"][\s\S]*?\}/.test(src) ||
                         /export\s+const\s+options\s*=\s*\{[\s\S]*?duration:\s*['"]30s['"][\s\S]*?vus:\s*10[\s\S]*?\}/.test(src);
      if (hasOptions) {
        log("✓ ตั้งค่า options ด้วย vus: 10 และ duration: '30s' ถูกต้อง");
      } else {
        throw new Error("ไม่พบ export const options ที่มี vus: 10 และ duration: '30s'\nตัวอย่าง: export const options = { vus: 10, duration: '30s' };");
      }
    },
    hint: "กำหนด object ชื่อ options แล้ว export ออกไป โดยใส่ key สำหรับจำนวน Virtual User และ key สำหรับระยะเวลาการทดสอบตามค่าที่โจทย์กำหนด",
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
      const src = stripComments(code);
      const hasDuration = /http_req_duration:\s*\[\s*['"]p\(95\)<500['"]\s*\]/.test(src);
      if (hasDuration) {
        log("✓ ขั้นตอนที่ 1: ตั้ง threshold http_req_duration p(95)<500 ถูกต้อง");
      } else {
        throw new Error("ไม่พบ threshold http_req_duration: ['p(95)<500']\nตัวอย่าง: http_req_duration: ['p(95)<500'],");
      }

      const hasFailed = /http_req_failed:\s*\[\s*['"]rate<0\.01['"]\s*\]/.test(src);
      if (hasFailed) {
        log("✓ ขั้นตอนที่ 2: ตั้ง threshold http_req_failed rate<0.01 ถูกต้อง");
      } else {
        throw new Error("ไม่พบ threshold http_req_failed: ['rate<0.01']\nตัวอย่าง: http_req_failed: ['rate<0.01'],");
      }
    },
    hint: "เพิ่ม key thresholds เข้าไปใน options โดยใช้ชื่อ metric http_req_duration และ http_req_failed เป็น key แต่ละตัวรับค่าเป็น array ของเงื่อนไขในรูปแบบ string ตามไวยากรณ์ percentile/rate ของ k6",
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
      const src = stripComments(code);
      const hasRampUp = /\{\s*duration:\s*['"]10s['"]\s*,\s*target:\s*20\s*\}/.test(src);
      const hasPlateau = /\{\s*duration:\s*['"]30s['"]\s*,\s*target:\s*20\s*\}/.test(src);
      const hasRampDown = /\{\s*duration:\s*['"]10s['"]\s*,\s*target:\s*0\s*\}/.test(src);

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
    hint: "แทนที่จะใช้ vus/duration ตรงๆ ให้ใช้ key stages ซึ่งเป็น array ของ object { duration, target } เรียงต่อกัน 3 ช่วงตามลำดับที่โจทย์อธิบาย (ไต่ขึ้น, คงที่, ไต่ลง)",
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
      const src = stripComments(code);
      const hasCorrectCheck = /check\(res,\s*\{[\s\S]*?r\.status\s*===\s*200\s*\|\|\s*r\.status\s*===\s*429[\s\S]*?\}\)/.test(src);
      const hasWrongCheck = /check\(res,\s*\{[\s\S]*?r\.status\s*===\s*200[\s\S]*?\}\)/.test(src) && !hasCorrectCheck;

      if (hasCorrectCheck) {
        log("✓ ใช้ check() ที่ยอมรับทั้ง 200 และ 429 ถูกต้อง (รองรับ Rate Limit จริงของ server)");
      } else if (hasWrongCheck) {
        throw new Error("check() นี้เช็คเฉพาะ status 200 เท่านั้น — เมื่อ 20 VU ยิงต่อเนื่องจะชน Rate Limit จริง (100 req/min) แล้วได้ 429 กลับมา ทำให้ check() นี้ fail จำนวนมากทั้งที่ server ทำงานถูกต้องตามที่ออกแบบไว้\nตัวอย่าง: check(res, { 'status is 200 or 429': (r) => r.status === 200 || r.status === 429 });");
      } else {
        throw new Error("ไม่พบการเช็คด้วย check()\nตัวอย่าง: check(res, { 'status is 200 or 429': (r) => r.status === 200 || r.status === 429 });");
      }
    },
    hint: "ออกแบบเงื่อนไขใน check() ให้ยอมรับได้มากกว่าหนึ่ง status code โดยใช้ operator OR (||) ระหว่างเงื่อนไข status 200 กับเงื่อนไข status 429 เพราะ Rate Limiter จริงจะตอบ 429 เมื่อโดนจำกัด ไม่ใช่ error",
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
      const src = stripComments(code);
      const hasImport = /import\s*\{\s*sleep\s*\}\s*from\s*['"]k6['"]/.test(src);
      const hasSleep = /sleep\(1\)/.test(src);
      if (!hasImport) {
        throw new Error("ไม่พบ import { sleep } from 'k6'\nตัวอย่าง: import { sleep } from 'k6';");
      }
      if (!hasSleep) {
        throw new Error("ไม่พบคำสั่ง sleep(1)\nตัวอย่าง: sleep(1);");
      }
      log("✓ ใช้ sleep(1) จำลอง think time ถูกต้อง");
    },
    hint: "import ฟังก์ชันสำหรับหน่วงเวลาจาก k6 (ไม่ใช่ k6/http) แล้วเรียกใช้พร้อมระบุจำนวนวินาทีตามโจทย์ ต่อท้ายการยิง request ใน default function",
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
      const src = stripComments(code);
      const hasImport = /import\s*\{\s*Counter\s*\}\s*from\s*['"]k6\/metrics['"]/.test(src);
      const hasDeclare = /new Counter\(\s*['"]rate_limit_count['"]\s*\)/.test(src);
      // ต้องเพิ่มค่าเฉพาะภายในเงื่อนไข res.status === 429 เท่านั้น ไม่ใช่ .add(1) ลอยๆ ที่ไหนก็ได้ในไฟล์
      const hasConditionalAdd = /if\s*\(\s*res\.status\s*===\s*429\s*\)\s*\{[\s\S]*?\.add\(1\)[\s\S]*?\}/.test(src);

      if (!hasImport) {
        throw new Error("ไม่พบ import { Counter } from 'k6/metrics'\nตัวอย่าง: import { Counter } from 'k6/metrics';");
      }
      if (!hasDeclare) {
        throw new Error("ไม่พบการสร้าง Counter ชื่อ 'rate_limit_count'\nตัวอย่าง: const rateLimitCount = new Counter('rate_limit_count');");
      }
      if (!hasConditionalAdd) {
        throw new Error("ต้องเพิ่มค่า Counter ด้วย .add(1) เฉพาะภายในเงื่อนไขที่ตรวจสอบ res.status === 429 เท่านั้น (ไม่ใช่เพิ่มแบบไม่มีเงื่อนไข)\nตัวอย่างโครงสร้าง: if (res.status === 429) { rateLimitCount.add(1); }");
      }
      log("✓ สร้างและใช้งาน Custom Counter ถูกต้อง");
    },
    hint: "import ชนิด metric ที่ใช้นับจำนวนสะสมจาก k6/metrics แล้วสร้าง instance ด้วยชื่อที่โจทย์กำหนด จากนั้นเพิ่มค่าให้ metric นั้นเฉพาะเมื่อ response status ตรงกับ 429 (ใช้ if ครอบเงื่อนไข ไม่ใช่เพิ่มทุกครั้ง)",
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
      const src = stripComments(code);
      const hasImport = /import\s*\{\s*group\s*\}\s*from\s*['"]k6['"]/.test(src);
      // ต้องดึงเฉพาะเนื้อหาภายใน callback ของ group('AI Model Check', ...) มาตรวจ
      // ไม่ใช่แค่เช็คว่า endpoint สองตัวปรากฏอยู่ที่ไหนก็ได้ในไฟล์ (อาจอยู่นอก group ก็ยังผ่าน)
      const groupMatch = src.match(/group\(\s*['"]AI Model Check['"]\s*,\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\)/);
      const groupBody = groupMatch ? groupMatch[1] : '';
      const hasHealth = /\/api\/ai\/health/.test(groupBody);
      const hasModel = /\/api\/ai\/model[`'"]/.test(groupBody);

      if (!hasImport) {
        throw new Error("ไม่พบ import { group } from 'k6'\nตัวอย่าง: import { group } from 'k6';");
      }
      if (!groupMatch) {
        throw new Error("ไม่พบ group('AI Model Check', ...)\nตัวอย่าง: group('AI Model Check', () => { ... });");
      }
      if (!hasHealth || !hasModel) {
        throw new Error("ต้องยิงทั้ง /api/ai/health และ /api/ai/model ไว้ภายใน callback ของ group('AI Model Check', ...) เดียวกัน ไม่ใช่นอก group");
      }
      log("✓ ใช้ group() จัดกลุ่ม transaction ถูกต้อง");
    },
    hint: "import ฟังก์ชันจัดกลุ่มจาก k6 แล้วเรียกใช้งานโดยส่งชื่อกลุ่มเป็น argument แรก และฟังก์ชัน callback เป็น argument ที่สอง วาง http.get() ทั้งสองคำสั่งไว้ภายใน callback นั้น",
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
      const src = stripComments(code);
      const hasScenarios = /scenarios:\s*\{/.test(src);
      // ต้องดึงเฉพาะเนื้อหาภายใน object ของ steady_load มาตรวจ executor/vus/duration
      // ไม่ใช่แค่เช็คว่าค่าเหล่านั้นปรากฏอยู่ที่ไหนก็ได้ใน options (อาจมาจาก block อื่นก็ยังผ่าน)
      const scenarioMatch = src.match(/steady_load:\s*\{([\s\S]*?)\}/);
      const scenarioBody = scenarioMatch ? scenarioMatch[1] : '';
      const hasExecutor = /executor:\s*['"]constant-vus['"]/.test(scenarioBody);
      const hasVus = /vus:\s*15\b/.test(scenarioBody);
      const hasDuration = /duration:\s*['"]20s['"]/.test(scenarioBody);

      if (!hasScenarios || !scenarioMatch) {
        throw new Error("ไม่พบ scenarios ชื่อ 'steady_load'\nตัวอย่าง: scenarios: { steady_load: { ... } }");
      }
      if (!hasExecutor) {
        throw new Error("ไม่พบ executor: 'constant-vus' ภายใน scenario steady_load");
      }
      if (!hasVus || !hasDuration) {
        throw new Error("ไม่พบ vus: 15 และ duration: '20s' ภายใน scenario steady_load");
      }
      log("✓ ตั้งค่า scenarios แบบ constant-vus ถูกต้อง");
    },
    hint: "แทนที่ vus/duration ตรงๆ ด้วย key scenarios ซึ่งเป็น object ที่มี key เป็นชื่อ scenario แต่ละ scenario เป็น object ย่อยที่ระบุ executor และ parameter ควบคุมโหลด (จำนวน VU, ระยะเวลา) ตามชนิด executor ที่เลือก",
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
      const src = stripComments(code);
      const hasSetup = /export function setup\s*\(\s*\)\s*\{[\s\S]*?http\.get[\s\S]*?return[\s\S]*?\}/.test(src);
      const hasTeardown = /export function teardown\s*\(\s*\)\s*\{[\s\S]*?console\.log\(['"]Load test เสร็จสมบูรณ์['"]\)/.test(src);

      if (!hasSetup) {
        throw new Error("ไม่พบ setup() ที่ยิง http.get แล้ว return ค่า\nตัวอย่าง: export function setup() { const res = http.get(...); return { healthCheckStatus: res.status }; }");
      }
      if (!hasTeardown) {
        throw new Error("ไม่พบ teardown() ที่ console.log('Load test เสร็จสมบูรณ์')\nตัวอย่าง: export function teardown() { console.log('Load test เสร็จสมบูรณ์'); }");
      }
      log("✓ เขียน setup() และ teardown() ถูกต้อง");
    },
    hint: "เขียนฟังก์ชันชื่อ setup แบบ export ที่ยิง request ตรวจ health แล้ว return object เก็บผลลัพธ์ที่ต้องใช้ต่อ และเขียนฟังก์ชันชื่อ teardown แบบ export แยกต่างหาก ที่ทำงานหลังทดสอบเสร็จเพื่อพิมพ์ข้อความสรุป",
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
  {
    id: "advanced_stages_thresholds",
    meta: "ขั้นสูง 1",
    title: "รวม Stages กับ Thresholds แบบ Compound: ต้องผ่านทั้ง Latency และ Error Rate พร้อมกัน",
    template: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  // 1. กำหนด stages ให้ไต่จาก 0 ขึ้นไป 30 VU ภายใน 10 วินาที, คงที่ 30 VU นาน 20 วินาที, แล้วไต่ลงกลับ 0 ภายใน 10 วินาที
  // WRITE YOUR CODE HERE


  // 2. กำหนด thresholds ให้ http_req_duration ต้องมี p(95) ต่ำกว่า 400ms และ http_req_failed ต้องต่ำกว่า 2% พร้อมกันทั้งสองเงื่อนไข
  // WRITE YOUR CODE HERE

};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);
  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
  });
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Stages + Thresholds ร่วมกัน...");
      const src = stripComments(code);

      const stagesMatch = src.match(/stages:\s*\[([\s\S]*?)\]/);
      const stagesBody = stagesMatch ? stagesMatch[1] : '';
      const hasRampUp = /\{\s*duration:\s*['"]10s['"]\s*,\s*target:\s*30\s*\}/.test(stagesBody);
      const hasPlateau = /\{\s*duration:\s*['"]20s['"]\s*,\s*target:\s*30\s*\}/.test(stagesBody);
      const hasRampDown = /\{\s*duration:\s*['"]10s['"]\s*,\s*target:\s*0\s*\}/.test(stagesBody);

      if (!stagesMatch) {
        throw new Error("ไม่พบ stages array\nตัวอย่างรูปแบบ: stages: [ { duration: '10s', target: 30 }, ... ]");
      }
      if (!hasRampUp || !hasPlateau || !hasRampDown) {
        throw new Error("stages ต้องมีครบ 3 ช่วง: ไต่ขึ้น 0→30 VU ใน 10s, คงที่ 30 VU นาน 20s, ไต่ลง 30→0 VU ใน 10s");
      }
      log("✓ ขั้นตอนที่ 1: stages ไต่ขึ้น-คงที่-ไต่ลงถูกต้อง");

      const thresholdsMatch = src.match(/thresholds:\s*\{([\s\S]*?)\}/);
      const thresholdsBody = thresholdsMatch ? thresholdsMatch[1] : '';
      const hasDuration = /http_req_duration:\s*\[\s*['"]p\(95\)<400['"]\s*\]/.test(thresholdsBody);
      const hasFailed = /http_req_failed:\s*\[\s*['"]rate<0\.02['"]\s*\]/.test(thresholdsBody);

      if (!thresholdsMatch || !hasDuration || !hasFailed) {
        throw new Error("thresholds ต้องมีทั้ง http_req_duration: ['p(95)<400'] และ http_req_failed: ['rate<0.02'] พร้อมกันในเงื่อนไขเดียว");
      }
      log("✓ ขั้นตอนที่ 2: thresholds ครอบคลุมทั้ง p95 latency และ error rate ถูกต้อง");
    },
    hint: "รวมสองรูปแบบที่เคยเรียนแยกกันมาไว้ใน options เดียวกัน: ใช้ stages เป็น array ของ { duration, target } ตามลำดับที่โจทย์อธิบายเพื่อไต่โหลด และใช้ thresholds ที่มี key http_req_duration กับ http_req_failed พร้อมกันสองตัว โดยแต่ละตัวเป็น array ของเงื่อนไข string ตามไวยากรณ์ที่เคยใช้ในบท Thresholds",
    solution: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  stages: [
    { duration: '10s', target: 30 },
    { duration: '20s', target: 30 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<400'],
    http_req_failed: ['rate<0.02'],
  },
};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);
  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
  });
}`,
    theory: `บทเรียนนี้รวมสองแนวคิดที่เคยแยกเรียนมาก่อนหน้าเข้าด้วยกันในสคริปต์เดียว: <code>stages</code> (บทที่ 3) ควบคุม "รูปแบบโหลด" ที่เปลี่ยนแปลงตามเวลา ส่วน <code>thresholds</code> (บทที่ 2) ควบคุม "เกณฑ์ผ่าน/ไม่ผ่าน" ของผลลัพธ์ — ในการทดสอบจริง แทบไม่มีทีมไหนตั้ง threshold แค่ตัวเดียวเวลาทำ ramping load test เพราะ p95 latency เพียงอย่างเดียวไม่บอกว่า request ที่เหลือ fail ไปกี่ % และในทางกลับกัน error rate เพียงอย่างเดียวก็ไม่บอกว่า request ที่ผ่านนั้นช้าแค่ไหน<br/><br/>
    เกณฑ์ผ่านที่รัดกุมของการทดสอบ load แบบ ramping ต้องดูทั้งสองมุมพร้อมกัน: <code>http_req_duration</code> (ความเร็ว) และ <code>http_req_failed</code> (ความสำเร็จ) — ถ้าตั้ง threshold แค่ตัวเดียว k6 อาจรายงานผ่านทั้งที่ระบบมีปัญหาจริงในอีกมุมหนึ่งที่ threshold ไม่ได้ตรวจ ยิ่งช่วง ramp-up/ramp-down ที่โหลดเปลี่ยนแปลงตลอดเวลา ยิ่งมีโอกาสเจอปัญหาแค่มุมใดมุมหนึ่งสูงกว่าช่วง steady state ปกติ`,
    example: `// ตัวอย่าง threshold ที่ผูกกับ tag เฉพาะ แทนที่จะเป็น global metric ตรงๆ
export const options = {
  stages: [{ duration: '30s', target: 50 }],
  thresholds: {
    'http_req_duration{scenario:default}': ['p(90)<250'],
    http_req_failed: ['rate<0.005'],
  },
};`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดยกำหนด <code>options</code> ให้มีทั้งสองส่วนพร้อมกัน:<br/>
    1. <code>stages</code>: ไต่ขึ้นจาก 0 ไป <code>30</code> VU ภายใน <code>10s</code>, คงที่ <code>30</code> VU นาน <code>20s</code>, แล้วไต่ลงกลับ <code>0</code> ภายใน <code>10s</code><br/>
    2. <code>thresholds</code>: <code>http_req_duration</code> ต้องมี <code>p(95)&lt;400</code> และ <code>http_req_failed</code> ต้องมี <code>rate&lt;0.02</code> พร้อมกันทั้งสองเงื่อนไข`
  },
  {
    id: "advanced_scenarios_compound_check",
    meta: "ขั้นสูง 2",
    title: "หลาย Scenarios พร้อมกัน + Compound check(): ตรวจทั้ง Status และ Body พร้อมกัน",
    template: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  // 1. กำหนด scenarios สองตัว: 'baseline_load' ใช้ executor 'constant-vus' จำนวน 10 VU นาน '20s'
  //    และ 'stress_spike' ใช้ executor 'ramping-vus' เริ่มที่ startVUs: 0 มี stages ไต่ขึ้น 0→40 VU ภายใน 5s
  //    แล้วไต่ลงกลับ 0 ภายใน 5s โดยเริ่มหลัง baseline_load ผ่านไปแล้ว 10 วินาที (startTime: '10s')
  // WRITE YOUR CODE HERE

};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);

  // 2. ใช้ check() ตรวจสอบพร้อมกัน 2 เงื่อนไขในเงื่อนไขเดียว: status ต้องเป็น 200 และ res.body ต้องมีคำว่า "ok" ปรากฏอยู่
  // WRITE YOUR CODE HERE

}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ scenarios หลายตัว + compound check()...");
      const src = stripComments(code);

      const baselineMatch = src.match(/baseline_load:\s*\{([\s\S]*?)\}/);
      const baselineBody = baselineMatch ? baselineMatch[1] : '';
      const hasBaselineExecutor = /executor:\s*['"]constant-vus['"]/.test(baselineBody);
      const hasBaselineVus = /vus:\s*10\b/.test(baselineBody);
      const hasBaselineDuration = /duration:\s*['"]20s['"]/.test(baselineBody);

      if (!baselineMatch || !hasBaselineExecutor || !hasBaselineVus || !hasBaselineDuration) {
        throw new Error("ไม่พบ scenario 'baseline_load' ที่ถูกต้อง (ต้องมี executor: 'constant-vus', vus: 10, duration: '20s')");
      }
      log("✓ ขั้นตอนที่ 1: scenario baseline_load ถูกต้อง");

      const spikeMatch = src.match(/stress_spike:\s*\{([\s\S]*?startTime:\s*['"]10s['"][\s\S]*?)\}/);
      const spikeBody = spikeMatch ? spikeMatch[0] : '';
      const hasSpikeExecutor = /executor:\s*['"]ramping-vus['"]/.test(spikeBody);
      const hasStartVUs = /startVUs:\s*0\b/.test(spikeBody);
      const hasRampUp = /\{\s*duration:\s*['"]5s['"]\s*,\s*target:\s*40\s*\}/.test(spikeBody);
      const hasRampDown = /\{\s*duration:\s*['"]5s['"]\s*,\s*target:\s*0\s*\}/.test(spikeBody);

      if (!spikeMatch || !hasSpikeExecutor || !hasStartVUs || !hasRampUp || !hasRampDown) {
        throw new Error("ไม่พบ scenario 'stress_spike' ที่ถูกต้อง (ต้องมี executor: 'ramping-vus', startVUs: 0, stages ไต่ขึ้น 0→40 ใน 5s แล้วลงกลับ 0 ใน 5s, และ startTime: '10s')");
      }
      log("✓ ขั้นตอนที่ 2: scenario stress_spike ถูกต้อง");

      const checkMatch = src.match(/check\(res,\s*\{([\s\S]*?)\}\)/);
      const checkBody = checkMatch ? checkMatch[1] : '';
      const hasStatusCheck = /status\s*===\s*200/.test(checkBody);
      const hasBodyCheck = /body\.includes\(\s*['"]ok['"]\s*\)/.test(checkBody);

      if (!checkMatch || !hasStatusCheck || !hasBodyCheck) {
        throw new Error("check() ต้องตรวจสอบทั้ง status === 200 และ body.includes('ok') พร้อมกันในเงื่อนไขเดียวกัน");
      }
      log("✓ ขั้นตอนที่ 3: check() แบบ compound (status + body) ถูกต้อง");
    },
    hint: "แยกคิดเป็นสองส่วน: (1) scenarios ต้องมีสอง entry ชื่อต่างกัน แต่ละ entry เลือก executor ที่เหมาะกับรูปแบบโหลดของมันเอง — โหลดคงที่ตลอดใช้ executor ที่เคยเรียนในบท Scenarios, ส่วนโหลดที่ต้องไล่ขึ้น-ลงในช่วงสั้นๆ ใช้ executor แบบมี stages ของตัวเอง พร้อมระบุเวลาเริ่มให้เหลื่อมกับ scenario แรก (2) check() ให้ใส่เงื่อนไขสองอันไว้ใน object เดียวกัน อันหนึ่งตรวจ status อีกอันตรวจเนื้อหาใน res.body ด้วยเมธอดของ string ที่ใช้ค้นหาคำในข้อความ",
    solution: `import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export const options = {
  scenarios: {
    baseline_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '20s',
    },
    stress_spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 40 },
        { duration: '5s', target: 0 },
      ],
      startTime: '10s',
    },
  },
};

export default function () {
  const res = http.get(\`\${BASE_URL}/api/ai/health\`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains ok': (r) => r.body.includes('ok'),
  });
}`,
    theory: `การทดสอบจริงมักไม่ได้มีแค่โหลดคงที่รูปแบบเดียว — ระบบอาจต้องรับ traffic พื้นหลังปกติไปพร้อมๆ กับ spike สั้นๆ แทรกเข้ามา (เช่น แคมเปญการตลาดที่ยิง notification พร้อมกันช่วงสั้นๆ ระหว่างที่ traffic ปกติยังเดินอยู่) การจำลองสถานการณ์นี้ต้องใช้ <code>scenarios</code> หลายตัวพร้อมกัน โดยแต่ละตัวมี <code>executor</code> ต่างชนิดกันได้ (เช่น <code>constant-vus</code> คู่กับ <code>ramping-vus</code>) และ <code>startTime</code> กำหนดว่า scenario ไหนเริ่มช้ากว่ากันเท่าไหร่ ทำให้ทั้งสองรูปแบบโหลดวิ่งซ้อนทับกันในการทดสอบครั้งเดียว<br/><br/>
    อีกด้านหนึ่ง <code>check()</code> ที่ตรวจแค่ status code อย่างเดียวบางครั้งไม่พอ — server อาจตอบ 200 กลับมาแต่เนื้อหาใน body ผิดพลาด (เช่น error message ที่ wrap มาเป็น 200 แทนที่จะเป็น error status จริง) การตรวจสอบที่รัดกุมกว่าจึงต้องดูทั้ง status code และเนื้อหาของ response พร้อมกันในเงื่อนไขเดียว — ถ้าเงื่อนไขใดเงื่อนไขหนึ่งไม่ผ่าน check() นั้นจะถูกนับเป็น fail ทันที ต่างจากการแยก check เป็นคนละรายการที่แต่ละอันจะถูกนับผ่าน/ไม่ผ่านแยกกันเอง`,
    example: `// ตัวอย่าง compound check ที่ตรวจ header กับ response time พร้อมกัน
check(res, {
  'has content-type json': (r) => r.headers['Content-Type'].includes('application/json'),
  'responded fast enough': (r) => r.timings.duration < 200,
});`,
    task: `จงเขียนสคริปต์ k6 ให้สมบูรณ์ โดย:<br/>
    1. กำหนด <code>scenarios</code> สองตัว: <code>baseline_load</code> ใช้ <code>executor: 'constant-vus'</code>, <code>vus: 10</code>, <code>duration: '20s'</code> และ <code>stress_spike</code> ใช้ <code>executor: 'ramping-vus'</code>, <code>startVUs: 0</code>, มี <code>stages</code> ไต่ขึ้นจาก 0 ไป <code>40</code> VU ภายใน <code>5s</code> แล้วไต่ลงกลับ <code>0</code> ภายใน <code>5s</code>, และ <code>startTime: '10s'</code><br/>
    2. ใช้ <code>check()</code> ตรวจสอบพร้อมกัน 2 เงื่อนไขในเงื่อนไขเดียวกัน: <code>status</code> ต้องเป็น <code>200</code> และ <code>res.body</code> ต้องมีคำว่า <code>'ok'</code> อยู่ด้วย`
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
        <div class="terminal-line error">ข้อผิดพลาด: ${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
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
  showTrackCertificate('Performance Testing (k6)');
}

// Run on window boot


  // Expose the standalone-page contract (see shared/engine.js header comment) as real globals,
  // and register into the shared registry so exam/index.html can load every track's LESSONS
  // side-by-side without a duplicate top-level "const LESSONS" collision across <script> tags.
  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['performance-testing'] = { id: 'performance-testing', title: 'Performance Testing (k6)', folder: 'Performance-Testing', lessons: LESSONS };
})();
