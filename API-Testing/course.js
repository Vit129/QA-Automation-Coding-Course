(function() {
// API Testing Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/My-Investment-Port/server/index.js Express API
// and the real Playwright request-based suite at My-Investment-Port/tests/api-testing/.

// Strip comments before running validate() checks against a learner's code, so a
// commented-out / fake snippet (e.g. `// expect(response.status()).toBe(200);`)
// can't satisfy a check meant for real, executed code.
function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "GET Request พื้นฐาน & Status Code Assertion",
    template: `import { test, expect } from '@playwright/test';

test('TC-3001: ดึงค่าแนวรับ-แนวต้านของ AAPL', async ({ request }) => {
  // 1. ยิง GET ไปที่ /api/ta/levels พร้อม query param ticker=AAPL
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 200


  // 3. ตรวจสอบว่า response body มี property 'pivot'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 กำลังตรวจสอบไวยากรณ์...");
      const hasGet = /await\s+request\.get\(['"]\/api\/ta\/levels\?ticker=AAPL['"]\)/.test(code);
      if (hasGet) {
        log("✓ ขั้นตอนที่ 1: ยิง request.get('/api/ta/levels?ticker=AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.get('/api/ta/levels?ticker=AAPL')\nตัวอย่าง: const response = await request.get('/api/ta/levels?ticker=AAPL');");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code\nตัวอย่าง: expect(response.status()).toBe(200);");
      }

      const hasBodyCheck = /toHaveProperty\(['"]pivot['"]\)/.test(code) || /body\.pivot\)\.toBeDefined\(\)/.test(code) || /\.pivot\).*\.not\.toBeUndefined\(\)/.test(code);
      if (hasBodyCheck) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบว่า body มี property 'pivot' ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบว่า response body มี property 'pivot'\nตัวอย่าง: expect(body).toHaveProperty('pivot');");
      }
    },
    hint: "ใช้ request.get() ยิงไปยัง endpoint พร้อมแนบ query string ตามที่โจทย์กำหนด แล้วอ่านค่า status ผ่าน method ของ response ก่อนแปลง body เป็น JSON ด้วย method ที่เหมาะสม จากนั้นมองหา matcher ของ expect ที่ใช้ตรวจสอบว่า object มี property หนึ่งๆ อยู่จริง (ไม่ใช่การเทียบค่าเป๊ะๆ)",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3001: ดึงค่าแนวรับ-แนวต้านของ AAPL', async ({ request }) => {
  // 1. ยิง GET ไปที่ /api/ta/levels พร้อม query param ticker=AAPL
  const response = await request.get('/api/ta/levels?ticker=AAPL');

  // 2. ตรวจสอบว่า status code เป็น 200
  expect(response.status()).toBe(200);

  // 3. ตรวจสอบว่า response body มี property 'pivot'
  const body = await response.json();
  expect(body).toHaveProperty('pivot');
});`,
    theory: `<strong>API Testing</strong> คือการทดสอบ Backend โดยตรงผ่าน HTTP โดยไม่ต้องเปิดเบราว์เซอร์ ทำให้เร็วกว่าและเสถียรกว่า UI Test มาก Playwright มี fixture ชื่อ <code>request</code> (ชนิด <strong>APIRequestContext</strong>) ที่แยกออกจาก <code>page</code> โดยสิ้นเชิง<br/><br/>
    เอนด์พอยต์ <code>/api/ta/levels</code> ในโปรเจก My-Investment-Port เป็นตัวอย่างจริง: รับ query param <code>ticker</code> แล้วคำนวณ Pivot Point (แนวรับ-แนวต้าน) จากราคาสูงสุด/ต่ำสุด/ปิดของวันก่อนหน้า และตอบกลับเป็น JSON<br/><br/>
    หลักการสำคัญ 3 ข้อของ API Testing:<br/>
    1. <strong>Status Code</strong>: ตัวเลขบอกผลลัพธ์ระดับโปรโตคอล (200 = สำเร็จ, 4xx = ผิดจากฝั่ง client, 5xx = ผิดจากฝั่ง server)<br/>
    2. <strong>Response Body</strong>: ข้อมูล JSON ที่ระบบตอบกลับ ต้องแปลงด้วย <code>await response.json()</code> ก่อนตรวจสอบ<br/>
    3. <strong>Independent from UI</strong>: ไม่ต้องพึ่ง DOM หรือ Selector ใดๆ ทำให้ทดสอบ Business Logic ได้ตรงจุดกว่า`,
    example: `// ตัวอย่างการยิง GET request และตรวจสอบผลลัพธ์เบื้องต้น
import { test, expect } from '@playwright/test';

test('เช็คสถานะระบบ AI Hub', async ({ request }) => {
  const response = await request.get('/api/ai/health');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.ok).toBe(true);
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง GET request ไปที่ <code>/api/ta/levels?ticker=AAPL</code><br/>
    2. ตรวจสอบว่า status code ตอบกลับเป็น <code>200</code><br/>
    3. แปลง body เป็น JSON แล้วตรวจสอบว่ามี property <code>pivot</code> อยู่จริง`
  },
  {
    id: "negative_testing",
    meta: "บทที่ 1",
    title: "Negative Testing: ตรวจ Error Response เมื่อขาด Parameter",
    template: `import { test, expect } from '@playwright/test';

test('TC-3002: ไม่ระบุ ticker ต้องได้ 400', async ({ request }) => {
  // 1. ยิง GET ไปที่ /api/ta/levels โดยไม่ใส่ query param ticker เลย
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 400


  // 3. ตรวจสอบว่า error message ตรงกับ 'Ticker is required'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 วิเคราะห์เส้นทาง Error Path...");
      if (/await\s+request\.get\(['"]\/api\/ta\/levels['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 1: ยิง request.get('/api/ta/levels') โดยไม่ใส่ ticker ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.get('/api/ta/levels') (ห้ามใส่ query param ticker ในบทนี้)");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(400\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 400 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 400\nตัวอย่าง: expect(response.status()).toBe(400);");
      }

      if (/body\.error\)\.toBe\(['"]Ticker is required['"]\)/.test(code) || /toEqual\(\{\s*error:\s*['"]Ticker is required['"]\s*\}\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error 'Ticker is required' ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'Ticker is required'\nตัวอย่าง: expect(body.error).toBe('Ticker is required');");
      }
    },
    hint: "ลองยิง GET ไปยัง endpoint เดียวกับบทก่อนหน้าแต่จงใจไม่แนบ query param เลย แล้วดูว่า backend ตอบกลับด้วย status code และ error message อะไร (อ่านโค้ด validation ฝั่ง server ที่ theory อ้างถึงประกอบ) ก่อนเขียน assertion เทียบข้อความให้ตรงเป๊ะ",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3002: ไม่ระบุ ticker ต้องได้ 400', async ({ request }) => {
  // 1. ยิง GET ไปที่ /api/ta/levels โดยไม่ใส่ query param ticker เลย
  const response = await request.get('/api/ta/levels');

  // 2. ตรวจสอบว่า status code เป็น 400
  expect(response.status()).toBe(400);

  // 3. ตรวจสอบว่า error message ตรงกับ 'Ticker is required'
  const body = await response.json();
  expect(body.error).toBe('Ticker is required');
});`,
    theory: `QA ที่ทดสอบเฉพาะ "เส้นทางที่ถูกต้อง" (Happy Path) เพียงอย่างเดียวถือว่าทำงานไม่ครบ เพราะ Dev มักลืมทดสอบเคสที่ผู้ใช้งานส่งข้อมูลไม่ครบหรือผิดรูปแบบ<br/><br/>
    ในโค้ดจริงของ <code>/api/ta/levels</code> มีการเช็คตั้งแต่บรรทัดแรกว่า:<br/>
    <code>if (!ticker) return res.status(400).json({ error: 'Ticker is required' });</code><br/><br/>
    <strong>Negative Testing</strong> คือการจงใจส่งข้อมูลที่ไม่ถูกต้อง (ในที่นี้คือไม่ส่ง <code>ticker</code>) แล้วยืนยันว่าระบบตอบกลับด้วย status code และข้อความ error ที่ "สอดคล้องกับสิ่งที่ Dev เขียนไว้จริง" ไม่ใช่แค่ไม่ Crash เฉยๆ`,
    example: `// ตัวอย่าง Negative Test กับ endpoint ที่ต้องการพารามิเตอร์บังคับ
const response = await request.get('/api/calendar/alerts');
expect(response.status()).toBe(400);

const body = await response.json();
expect(body.error).toContain('tickers parameter required');`,
    task: `จงเขียนสคริปต์ทดสอบ Error Path ให้สมบูรณ์ โดย:<br/>
    1. ยิง GET request ไปที่ <code>/api/ta/levels</code> โดย<strong>ไม่ใส่</strong> query param <code>ticker</code><br/>
    2. ตรวจสอบว่า status code ตอบกลับเป็น <code>400</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับข้อความ <code>'Ticker is required'</code> เป๊ะๆ`
  },
  {
    id: "post_body",
    meta: "บทที่ 2",
    title: "POST Request พร้อม JSON Body",
    template: `import { test, expect } from '@playwright/test';

test('TC-3003: ไม่ส่ง panel ต้องได้ 400', async ({ request }) => {
  // 1. ยิง POST ไปที่ /api/ai/panel โดยส่ง data เป็น object ว่าง {}
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 400


  // 3. ตรวจสอบว่าข้อความ error ตรงกับ 'panel is required'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบการส่ง POST Body...");
      const hasPost = /await\s+request\.post\(['"]\/api\/ai\/panel['"]\s*,\s*\{\s*data:\s*\{\s*\}\s*\}\s*\)/.test(code);
      if (hasPost) {
        log("✓ ขั้นตอนที่ 1: ยิง request.post('/api/ai/panel', { data: {} }) ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.post('/api/ai/panel', { data: {} })\nตัวอย่าง: const response = await request.post('/api/ai/panel', { data: {} });");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(400\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 400 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 400\nตัวอย่าง: expect(response.status()).toBe(400);");
      }

      if (/body\.error\)\.toBe\(['"]panel is required['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error 'panel is required' ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'panel is required'\nตัวอย่าง: expect(body.error).toBe('panel is required');");
      }
    },
    hint: "POST request ใน Playwright ใช้ option สำหรับแนบ body เป็น object ธรรมดา (ไม่ต้อง stringify เอง, Content-Type ถูกตั้งให้อัตโนมัติ) — ลองส่ง object ว่างเพื่อจงใจให้ field บังคับหายไป แล้วดูว่า backend ตอบ status และ error message อะไรกลับมา",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3003: ไม่ส่ง panel ต้องได้ 400', async ({ request }) => {
  // 1. ยิง POST ไปที่ /api/ai/panel โดยส่ง data เป็น object ว่าง {}
  const response = await request.post('/api/ai/panel', { data: {} });

  // 2. ตรวจสอบว่า status code เป็น 400
  expect(response.status()).toBe(400);

  // 3. ตรวจสอบว่าข้อความ error ตรงกับ 'panel is required'
  const body = await response.json();
  expect(body.error).toBe('panel is required');
});`,
    theory: `การยิง <strong>POST</strong> ต่างจาก GET ตรงที่ต้องแนบข้อมูลไปกับ Request Body ด้วย ใน Playwright ใช้ option <code>data</code> ซึ่งจะ serialize เป็น JSON และตั้งค่า header <code>Content-Type: application/json</code> ให้อัตโนมัติ<br/><br/>
    เอนด์พอยต์ <code>/api/ai/panel</code> ในเซิร์ฟเวอร์จริงมีโค้ดตรวจสอบ field บังคับดังนี้:<br/>
    <code>const { panel, snapshot, force } = req.body || {};<br/>
    if (!panel) return res.status(400).json({ error: 'panel is required' });</code><br/><br/>
    การทดสอบเคสนี้ช่วยยืนยันว่า Backend มี Input Validation ที่ถูกต้อง ก่อนที่จะปล่อยให้ Logic การวิเคราะห์ทำงานต่อโดยข้อมูลไม่ครบ`,
    example: `// ตัวอย่างการยิง POST พร้อม body จริง (happy path)
const response = await request.post('/api/ai/panel', {
  data: { panel: 'risk', snapshot: {} }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง POST request ไปที่ <code>/api/ai/panel</code> พร้อม <code>data: {}</code> (ไม่ส่ง field <code>panel</code>)<br/>
    2. ตรวจสอบว่า status code ตอบกลับเป็น <code>400</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'panel is required'</code>`
  },
  {
    id: "auth_headers",
    meta: "บทที่ 3",
    title: "Custom Headers & API Key Authentication",
    template: `import { test, expect } from '@playwright/test';

test('TC-3004: เรียก API ที่ต้อง Auth โดยไม่มี API Key', async ({ request }) => {
  // 1. ยิง POST ไปที่ /api/ai/portfolio-snapshot พร้อม data: { holdings: [] }
  //    (สังเกตว่าไม่ได้แนบ header X-API-Key ใดๆ)
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 401


  // 3. ตรวจสอบว่าข้อความ error ตรงกับ 'Unauthorized: Invalid or missing API key'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบเส้นทาง Authentication...");
      const hasPost = /await\s+request\.post\(['"]\/api\/ai\/portfolio-snapshot['"]\s*,\s*\{\s*data:\s*\{\s*holdings:\s*\[\]\s*\}\s*\}\s*\)/.test(code);
      if (hasPost) {
        log("✓ ขั้นตอนที่ 1: ยิง request.post('/api/ai/portfolio-snapshot', { data: { holdings: [] } }) ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.post('/api/ai/portfolio-snapshot', { data: { holdings: [] } })\nตัวอย่าง: const response = await request.post('/api/ai/portfolio-snapshot', { data: { holdings: [] } });");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(401\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 401 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 401\nตัวอย่าง: expect(response.status()).toBe(401);");
      }

      if (/body\.error\)\.toBe\(['"]Unauthorized: Invalid or missing API key['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error ของ Unauthorized ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'Unauthorized: Invalid or missing API key'");
      }
    },
    hint: "ยิง POST ไปยัง endpoint ที่ต้อง auth โดยจงใจไม่แนบ header ยืนยันตัวตนใดๆ เลย แล้วดูว่า middleware ฝั่ง backend ปฏิเสธด้วย status code และข้อความอะไรเมื่อไม่มี API key แนบมา",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3004: เรียก API ที่ต้อง Auth โดยไม่มี API Key', async ({ request }) => {
  // 1. ยิง POST ไปที่ /api/ai/portfolio-snapshot พร้อม data: { holdings: [] }
  //    (สังเกตว่าไม่ได้แนบ header X-API-Key ใดๆ)
  const response = await request.post('/api/ai/portfolio-snapshot', {
    data: { holdings: [] }
  });

  // 2. ตรวจสอบว่า status code เป็น 401
  expect(response.status()).toBe(401);

  // 3. ตรวจสอบว่าข้อความ error ตรงกับ 'Unauthorized: Invalid or missing API key'
  const body = await response.json();
  expect(body.error).toBe('Unauthorized: Invalid or missing API key');
});`,
    theory: `บาง endpoint ต้องผ่าน Middleware ตรวจสอบสิทธิ์ก่อนถึงจะเข้าถึง Logic จริงได้ ในเซิร์ฟเวอร์นี้ endpoint ที่สำคัญอย่าง <code>/api/ai/portfolio-snapshot</code> และ <code>/api/ai/recommend</code> ถูกครอบด้วย <code>validateApiKey</code> middleware:<br/><br/>
    <code>const apiKey = req.headers['x-api-key'];<br/>
    if (!apiKey || apiKey !== expectedKey) {<br/>
    &nbsp;&nbsp;return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });<br/>
    }</code><br/><br/>
    ในการทดสอบ API จริง QA ต้องยืนยันทั้ง 2 ทาง: (1) ถ้า<strong>ไม่แนบ</strong> header หรือแนบผิด ต้องถูกปฏิเสธด้วย 401 เสมอ และ (2) ถ้าแนบ header <code>X-API-Key</code> ที่ถูกต้อง ต้องผ่านเข้าไปทำงานได้ปกติ — การลืมทดสอบข้อ (1) คือช่องโหว่ความปลอดภัยที่พบบ่อยที่สุดอย่างหนึ่ง`,
    example: `// ตัวอย่างการแนบ custom header เพื่อผ่าน Authentication
const response = await request.post('/api/ai/portfolio-snapshot', {
  headers: { 'X-API-Key': 'dev-key-insecure' },
  data: { holdings: [] }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ทดสอบ Authentication Failure ให้สมบูรณ์ โดย:<br/>
    1. ยิง POST request ไปที่ <code>/api/ai/portfolio-snapshot</code> พร้อม <code>data: { holdings: [] }</code> โดย<strong>ไม่แนบ header</strong> ใดๆ<br/>
    2. ตรวจสอบว่า status code ตอบกลับเป็น <code>401</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'Unauthorized: Invalid or missing API key'</code>`
  },
  {
    id: "schema_assertions",
    meta: "บทที่ 4",
    title: "Response Schema & Contract Assertions",
    template: `import { test, expect } from '@playwright/test';

test('TC-3005: ตรวจสอบโครงสร้าง (Schema) ของ Response', async ({ request }) => {
  const response = await request.get('/api/ta/levels?ticker=AAPL');
  const body = await response.json();

  // 1. ตรวจสอบว่า resistance และ support เป็น array ที่มีความยาว 3 พอดี (r1-r3, s1-s3)
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า ohlc มี property high, low, close ครบทั้ง 3 ตัว


  // 3. ตรวจสอบว่า updated เป็นข้อความรูปแบบวันที่ ISO 8601

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ Response Contract...");
      const hasArrayLen = /expect\(body\.resistance\)\.toHaveLength\(3\)/.test(code) && /expect\(body\.support\)\.toHaveLength\(3\)/.test(code);
      if (hasArrayLen) {
        log("✓ ขั้นตอนที่ 1: ตรวจสอบความยาว resistance/support = 3 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบความยาว array\nตัวอย่าง: expect(body.resistance).toHaveLength(3);\nexpect(body.support).toHaveLength(3);");
      }

      const hasOhlc = /toMatchObject\(\{\s*high:.*low:.*close:.*\}\)/s.test(code) ||
        (/toHaveProperty\(['"]high['"]\)/.test(code) && /toHaveProperty\(['"]low['"]\)/.test(code) && /toHaveProperty\(['"]close['"]\)/.test(code));
      if (hasOhlc) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ property high/low/close ของ ohlc ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ property high, low, close ของ body.ohlc\nตัวอย่าง: expect(body.ohlc).toMatchObject({ high: expect.any(Number), low: expect.any(Number), close: expect.any(Number) });");
      }

      const hasIsoCheck = /body\.updated\)\.toMatch\(\/.*\\d\{4\}-\\d\{2\}-\\d\{2\}.*\//.test(code);
      if (hasIsoCheck) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบรูปแบบวันที่ ISO 8601 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบรูปแบบวันที่ ISO 8601 ของ body.updated\nตัวอย่าง: expect(body.updated).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/);");
      }
    },
    hint: "มองหา matcher ของ Playwright/Jest ที่เช็คความยาวของ array, matcher ที่เช็คว่า object มีบาง property ตรงตามรูปแบบโดยไม่ต้องเท่ากันทั้งหมด (ใช้ร่วมกับ helper ที่เช็คแค่ 'ชนิดข้อมูล' แทนค่าจริง เพราะราคาหุ้นเปลี่ยนทุกวัน) และการเทียบ string กับ regular expression เพื่อยืนยันรูปแบบวันที่",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3005: ตรวจสอบโครงสร้าง (Schema) ของ Response', async ({ request }) => {
  const response = await request.get('/api/ta/levels?ticker=AAPL');
  const body = await response.json();

  // 1. ตรวจสอบว่า resistance และ support เป็น array ที่มีความยาว 3 พอดี (r1-r3, s1-s3)
  expect(body.resistance).toHaveLength(3);
  expect(body.support).toHaveLength(3);

  // 2. ตรวจสอบว่า ohlc มี property high, low, close ครบทั้ง 3 ตัว
  expect(body.ohlc).toMatchObject({
    high: expect.any(Number),
    low: expect.any(Number),
    close: expect.any(Number)
  });

  // 3. ตรวจสอบว่า updated เป็นข้อความรูปแบบวันที่ ISO 8601
  expect(body.updated).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/);
});`,
    theory: `การเช็คแค่ <code>status === 200</code> ไม่เพียงพอ เพราะ Backend อาจตอบ 200 มาพร้อมข้อมูลที่โครงสร้างผิดเพี้ยนได้ (เช่น field หายไป หรือชนิดข้อมูลเปลี่ยน) <strong>Schema/Contract Testing</strong> คือการยืนยันรูปร่าง (shape) ของข้อมูลที่ตอบกลับมา ไม่ใช่แค่ค่าตรงเป๊ะ<br/><br/>
    จากโค้ดจริงของ <code>/api/ta/levels</code> ที่คำนวณ Pivot Point จะตอบกลับเสมอด้วยโครงสร้าง:<br/>
    <code>{ ticker, pivot, resistance: [r1,r2,r3], support: [s1,s2,s3], ohlc: { high, low, close }, updated }</code><br/><br/>
    Matcher ที่มีประโยชน์:<br/>
    • <code>toHaveLength(n)</code> — ยืนยันความยาว array<br/>
    • <code>toMatchObject({...})</code> — ยืนยันบาง property โดยไม่ต้องเท่ากันทั้งหมด<br/>
    • <code>expect.any(Number)</code> — ยืนยันแค่ "ชนิดข้อมูล" ไม่สนใจค่าจริง (เพราะราคาหุ้นเปลี่ยนทุกวัน)`,
    example: `// ตัวอย่างการยืนยัน type โดยไม่สนใจค่าจริงที่เปลี่ยนแปลงได้
expect(body).toMatchObject({
  ticker: 'AAPL',
  pivot: expect.any(Number),
});`,
    task: `จงเขียนสคริปต์ตรวจสอบโครงสร้าง Response ให้สมบูรณ์ โดย:<br/>
    1. ยืนยันว่า <code>body.resistance</code> และ <code>body.support</code> มีความยาว <code>3</code><br/>
    2. ยืนยันว่า <code>body.ohlc</code> มี property <code>high</code>, <code>low</code>, <code>close</code> เป็นตัวเลข<br/>
    3. ยืนยันว่า <code>body.updated</code> อยู่ในรูปแบบวันที่ ISO 8601`
  },
  {
    id: "request_context",
    meta: "บทที่ 5",
    title: "Reusable Request Context & Default Headers",
    template: `import { test, expect } from '@playwright/test';

test('TC-3006: สร้าง Request Context พร้อม Header เริ่มต้น', async ({ playwright }) => {
  // 1. สร้าง context ใหม่ด้วย playwright.request.newContext() พร้อม extraHTTPHeaders แนบ X-API-Key
  // WRITE YOUR CODE HERE


  // 2. ใช้ context ที่สร้างเรียก POST ไปที่ /api/ai/portfolio-snapshot ด้วย data: { holdings: [] }


  // 3. ตรวจสอบว่า status code เป็น 200 (เพราะแนบ Key ถูกต้องแล้วผ่าน context)


  // 4. ปิด context หลังใช้งานเสร็จเสมอ

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบการสร้าง APIRequestContext...");
      const hasContext = /playwright\.request\.newContext\(\{[\s\S]*extraHTTPHeaders[\s\S]*['"]X-API-Key['"][\s\S]*\}\)/.test(code);
      if (hasContext) {
        log("✓ ขั้นตอนที่ 1: สร้าง context ด้วย extraHTTPHeaders แนบ X-API-Key ถูกต้อง");
      } else {
        throw new Error("ไม่พบการสร้าง context ด้วย playwright.request.newContext({ extraHTTPHeaders: { 'X-API-Key': ... } })");
      }

      const contextVarMatch = code.match(/const\s+(\w+)\s*=\s*await\s+playwright\.request\.newContext/);
      const varName = contextVarMatch ? contextVarMatch[1] : null;
      const postRegex = varName ? new RegExp(`${varName}\\.post\\(['"]\\/api\\/ai\\/portfolio-snapshot['"]`) : /apiContext\.post\(['"]\/api\/ai\/portfolio-snapshot['"]/;
      if (varName && postRegex.test(code)) {
        log(`✓ ขั้นตอนที่ 2: ใช้ ${varName}.post('/api/ai/portfolio-snapshot', ...) ถูกต้อง`);
      } else {
        throw new Error("ไม่พบการเรียก .post('/api/ai/portfolio-snapshot') จาก context ตัวแปรที่สร้างขึ้น");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบ status code 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 200\nตัวอย่าง: expect(response.status()).toBe(200);");
      }

      if (varName && new RegExp(`${varName}\\.dispose\\(\\)`).test(code)) {
        log("✓ ขั้นตอนที่ 4: ปิด context ด้วย .dispose() ถูกต้อง");
      } else {
        throw new Error("ไม่พบการปิด context ด้วย .dispose() หลังใช้งานเสร็จ");
      }
    },
    hint: "fixture playwright มี method สำหรับสร้าง APIRequestContext ใหม่ที่แนบ header เริ่มต้นให้ทุก request ผ่าน option หนึ่ง — ใช้ context ที่สร้างขึ้นแทน request เดิมทุกจุดในเทสนี้ และอย่าลืมว่าทุก context ที่สร้างขึ้นต้องถูกปิดด้วย method คืนทรัพยากรเมื่อใช้งานเสร็จ",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3006: สร้าง Request Context พร้อม Header เริ่มต้น', async ({ playwright }) => {
  // 1. สร้าง context ใหม่ด้วย playwright.request.newContext() พร้อม extraHTTPHeaders แนบ X-API-Key
  const apiContext = await playwright.request.newContext({
    extraHTTPHeaders: { 'X-API-Key': 'dev-key-insecure' }
  });

  // 2. ใช้ context ที่สร้างเรียก POST ไปที่ /api/ai/portfolio-snapshot ด้วย data: { holdings: [] }
  const response = await apiContext.post('/api/ai/portfolio-snapshot', {
    data: { holdings: [] }
  });

  // 3. ตรวจสอบว่า status code เป็น 200 (เพราะแนบ Key ถูกต้องแล้วผ่าน context)
  expect(response.status()).toBe(200);

  // 4. ปิด context หลังใช้งานเสร็จเสมอ
  await apiContext.dispose();
});`,
    theory: `เมื่อหลาย test ต้องแนบ header เดิมซ้ำๆ (เช่น <code>X-API-Key</code>) การพิมพ์ headers ในทุก request เป็นการเขียนโค้ดซ้ำ (DRY violation) ที่แก้ได้ด้วย <strong>APIRequestContext</strong><br/><br/>
    ในโปรเจกจริง <code>tests/api-testing/playwright.config.ts</code> ใช้แนวทางเดียวกันในระดับ config:<br/>
    <code>use: {<br/>
    &nbsp;&nbsp;baseURL: process.env.API_BASE_URL,<br/>
    &nbsp;&nbsp;extraHTTPHeaders: { 'Accept': 'application/json' }<br/>
    }</code><br/><br/>
    ทุก request ที่ยิงผ่าน fixture <code>request</code> จะได้ header เหล่านี้ติดไปอัตโนมัติ แต่ถ้าต้องการ context ที่มี header เฉพาะกลุ่ม test (เช่น เฉพาะกลุ่มที่ต้อง Auth) ให้สร้างด้วย <code>playwright.request.newContext()</code> แทน และอย่าลืม <code>.dispose()</code> ทุกครั้งเพื่อคืนทรัพยากรเชื่อมต่อ`,
    example: `// ตัวอย่าง config ระดับไฟล์ (playwright.config.ts) ที่ทำให้ไม่ต้องพิมพ์ baseURL ซ้ำทุก test
export default defineConfig({
  use: {
    baseURL: 'https://api.example.com',
    extraHTTPHeaders: { 'Accept': 'application/json' }
  }
});`,
    task: `จงเขียนสคริปต์สร้าง Request Context ที่แนบ Header อัตโนมัติ โดย:<br/>
    1. สร้าง context ด้วย <code>playwright.request.newContext({ extraHTTPHeaders: { 'X-API-Key': 'dev-key-insecure' } })</code><br/>
    2. ใช้ context นั้นยิง POST ไปที่ <code>/api/ai/portfolio-snapshot</code> พร้อม <code>data: { holdings: [] }</code><br/>
    3. ตรวจสอบว่า status code เป็น <code>200</code><br/>
    4. ปิด context ด้วย <code>.dispose()</code>`
  },
  {
    id: "csv_query_params",
    meta: "บทที่ 6",
    title: "Capstone: Comma-separated Query Params",
    template: `import { test, expect } from '@playwright/test';

test('TC-3007: ไม่ระบุ tickers ต้องได้ 400 พร้อมข้อความที่ตรงกับโค้ดจริง', async ({ request }) => {
  // 1. ยิง GET ไปที่ /api/calendar/alerts โดยไม่ใส่ query param tickers เลย
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 400


  // 3. ตรวจสอบว่า error message ตรงกับ 'tickers parameter required (comma-separated)'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบเคส Comma-separated Query Param...");
      if (/await\s+request\.get\(['"]\/api\/calendar\/alerts['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 1: ยิง request.get('/api/calendar/alerts') โดยไม่ใส่ tickers ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.get('/api/calendar/alerts') (ห้ามใส่ query param tickers ในบทนี้)");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(400\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 400 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 400\nตัวอย่าง: expect(response.status()).toBe(400);");
      }

      if (/body\.error\)\.toBe\(['"]tickers parameter required \(comma-separated\)['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error ถูกต้องตรงกับโค้ดจริง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'tickers parameter required (comma-separated)'");
      }
    },
    hint: "ลองยิง GET ไปยัง endpoint นี้โดยไม่ใส่ query param เลย แล้วเทียบข้อความ error กับสิ่งที่โค้ด backend จริงเขียนไว้ (อ่านจาก theory ประกอบ) ให้ตรงเป๊ะ",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3007: ไม่ระบุ tickers ต้องได้ 400 พร้อมข้อความที่ตรงกับโค้ดจริง', async ({ request }) => {
  // 1. ยิง GET ไปที่ /api/calendar/alerts โดยไม่ใส่ query param tickers เลย
  const response = await request.get('/api/calendar/alerts');

  // 2. ตรวจสอบว่า status code เป็น 400
  expect(response.status()).toBe(400);

  // 3. ตรวจสอบว่า error message ตรงกับ 'tickers parameter required (comma-separated)'
  const body = await response.json();
  expect(body.error).toBe('tickers parameter required (comma-separated)');
});`,
    theory: `บทสรุปของโมดูลนี้: endpoint <code>/api/calendar/alerts</code> รับพารามิเตอร์แบบ <strong>comma-separated string</strong> เช่น <code>?tickers=AAPL,MSFT,NVDA</code> แล้ว parse เองในโค้ด:<br/><br/>
    <code>const rawTickers = String(req.query.tickers || '');<br/>
    const tickers = rawTickers.split(',').map(t => t.trim()).filter(Boolean);<br/>
    if (!tickers.length) return res.status(400).json({ error: 'tickers parameter required (comma-separated)' });</code><br/><br/>
    นี่คือรูปแบบ query param ที่พบบ่อยในระบบจริง (ต่างจาก array param แบบ <code>?tickers[]=AAPL&tickers[]=MSFT</code>) และเป็นจุดที่ QA มักพลาดเพราะสมมติเอาเองว่า "ส่ง string เปล่าก็คงผ่าน" ทั้งที่ Dev เขียน validation ดักไว้แล้ว การอ่านโค้ด Backend จริงก่อนออกแบบ Test Case จึงสำคัญกว่าการเดา`,
    example: `// ตัวอย่าง happy path ของ comma-separated query param
const response = await request.get('/api/calendar/alerts?tickers=AAPL,MSFT');
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดยอ้างอิงจากโค้ดจริงใน <code>server/index.js</code>:<br/>
    1. ยิง GET request ไปที่ <code>/api/calendar/alerts</code> โดย<strong>ไม่ใส่</strong> query param <code>tickers</code><br/>
    2. ตรวจสอบว่า status code ตอบกลับเป็น <code>400</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'tickers parameter required (comma-separated)'</code> เป๊ะๆ ตามที่ Dev เขียนไว้`
  },
  {
    id: "rate_limit",
    meta: "บทที่ 7",
    title: "Rate-Limit Testing: ยิง Request เกิน Limit",
    template: `import { test, expect } from '@playwright/test';

test('TC-3008: ยิง Request เกิน 100 ครั้งต่อนาทีต้องโดน Rate Limit', async ({ request }) => {
  let lastResponse;

  // 1. ใช้ for loop ยิง GET ไปที่ /api/ai/health วนซ้ำ 101 ครั้ง เก็บ response ตัวสุดท้ายไว้ในตัวแปร lastResponse
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า response ตัวสุดท้ายมี status code เป็น 429


  // 3. ตรวจสอบว่า error message ตรงกับ 'Too many requests, please try again later'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ Rate-Limit Testing...");
      const hasLoop = /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*101\s*;\s*\w+\+\+\s*\)/.test(code);
      const hasGetInLoop = /lastResponse\s*=\s*await\s+request\.get\(['"]\/api\/ai\/health['"]\)/.test(code);
      if (hasLoop && hasGetInLoop) {
        log("✓ ขั้นตอนที่ 1: วน for loop 101 ครั้งยิง request.get('/api/ai/health') เก็บลง lastResponse ถูกต้อง");
      } else {
        throw new Error("ไม่พบ for loop ที่วนยิง request.get('/api/ai/health') 101 ครั้งแล้วเก็บผลลง lastResponse\nตัวอย่าง: for (let i = 0; i < 101; i++) {\n  lastResponse = await request.get('/api/ai/health');\n}");
      }

      if (/expect\(lastResponse\.status\(\)\)\.toBe\(429\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 429 ของ lastResponse ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 429\nตัวอย่าง: expect(lastResponse.status()).toBe(429);");
      }

      if (/body\.error\)\.toBe\(['"]Too many requests, please try again later['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error ของ Rate Limit ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'Too many requests, please try again later'\nตัวอย่าง: expect(body.error).toBe('Too many requests, please try again later');");
      }
    },
    hint: "ต้องวนยิง request ซ้ำๆ ด้วยลูปจนเกินจำนวนที่ backend อนุญาตต่อหน้าต่างเวลา แล้วเก็บเฉพาะ response ตัวสุดท้ายไว้ตรวจสอบ (ไม่ใช่ทุกตัว) จากนั้นเทียบ status code กับ error message ที่ middleware limiter กำหนดไว้ตามโค้ดจริงใน theory",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3008: ยิง Request เกิน 100 ครั้งต่อนาทีต้องโดน Rate Limit', async ({ request }) => {
  let lastResponse;

  // 1. ใช้ for loop ยิง GET ไปที่ /api/ai/health วนซ้ำ 101 ครั้ง เก็บ response ตัวสุดท้ายไว้ในตัวแปร lastResponse
  for (let i = 0; i < 101; i++) {
    lastResponse = await request.get('/api/ai/health');
  }

  // 2. ตรวจสอบว่า response ตัวสุดท้ายมี status code เป็น 429
  expect(lastResponse.status()).toBe(429);

  // 3. ตรวจสอบว่า error message ตรงกับ 'Too many requests, please try again later'
  const body = await lastResponse.json();
  expect(body.error).toBe('Too many requests, please try again later');
});`,
    theory: `<strong>Rate Limiting</strong> คือการจำกัดจำนวน request ที่ client เดียวกันยิงได้ในช่วงเวลาหนึ่ง ป้องกัน abuse และ DoS เซิร์ฟเวอร์ ในโปรเจก My-Investment-Port เซิร์ฟเวอร์ผูก middleware <code>express-rate-limit</code> ไว้กับทุก route:<br/><br/>
    <code>const limiter = rateLimit({<br/>
    &nbsp;&nbsp;windowMs: 1 * 60 * 1000, // 1 นาที<br/>
    &nbsp;&nbsp;max: 100, // 100 request ต่อนาทีต่อ IP<br/>
    &nbsp;&nbsp;message: { error: 'Too many requests, please try again later' },<br/>
    &nbsp;&nbsp;skip: (req) => process.env.NODE_ENV === 'development'<br/>
    });<br/>
    app.use(limiter);</code><br/><br/>
    เมื่อ IP เดียวกันยิงเกิน <code>max</code> ภายใน <code>windowMs</code> เซิร์ฟเวอร์จะตอบกลับ status <code>429 Too Many Requests</code> พร้อม body ตาม <code>message</code> ที่กำหนดไว้ การทดสอบเคสนี้ต้องยิง request ซ้ำเกิน limit จริงแล้วยืนยันว่า request "ตัวที่เกิน" ถูกปฏิเสธด้วยรูปแบบที่ตรงกับโค้ดจริง ไม่ใช่แค่เดาว่ามันน่าจะ block<br/><br/>
    <strong>ข้อควรระวังจริง:</strong> โค้ดจริงมี <code>skip: (req) => process.env.NODE_ENV === 'development'</code> — แปลว่าถ้ารัน server ในโหมด dev (ตามที่ dev ส่วนใหญ่รันตอน develop ปกติ) limiter นี้จะ<strong>ไม่ทำงานเลย</strong> ยิงกี่ครั้งก็ไม่มีวันเจอ 429 ต้องรัน server แบบ <code>NODE_ENV=production</code> เพื่อทดสอบ path นี้ให้เจอผลจริง — บั๊กที่พบบ่อย: ทดสอบผ่านเครื่อง dev แล้วมั่นใจว่า rate limit ทำงาน ทั้งที่จริงมันถูกปิดไว้อยู่ตลอด`,
    example: `// ตัวอย่างการยิงซ้ำจนชนขีดจำกัดแล้วตรวจสอบ status code
let res;
for (let i = 0; i < 101; i++) {
  res = await request.get('/api/ai/health');
}
expect(res.status()).toBe(429);`,
    task: `จงเขียนสคริปต์ทดสอบ Rate Limit ให้สมบูรณ์ โดยอ้างอิงจาก middleware จริงใน <code>server/index.js</code>:<br/>
    1. ยิง GET request ไปที่ <code>/api/ai/health</code> วนซ้ำด้วย for loop 101 ครั้ง เก็บ response ตัวสุดท้ายไว้ในตัวแปร <code>lastResponse</code><br/>
    2. ตรวจสอบว่า <code>lastResponse</code> มี status code เป็น <code>429</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'Too many requests, please try again later'</code> เป๊ะๆ ตามที่ Dev เขียนไว้`
  },
  {
    id: "state_leak_race",
    meta: "บทที่ 8",
    title: "Race Condition: Global State รั่วไหลข้าม Test เมื่อรัน Parallel",
    template: `import { test, expect } from '@playwright/test';

test('TC-3009: สลับ AI Model แล้วต้องคืนค่าเดิมเสมอ (กัน state รั่วไหลข้าม test อื่น)', async ({ request }) => {
  // 1. ยิง GET /api/ai/model เก็บค่าโมเดลเดิมไว้ในตัวแปร originalModel ก่อนแก้ไขอะไรทั้งสิ้น
  // WRITE YOUR CODE HERE


  // 2. ยิง POST /api/ai/model/switch พร้อม data: { model: 'gemini-3.5-flash' } แล้วตรวจสอบว่า status code เป็น 200


  // 3. คืนค่าโมเดลกลับเป็น originalModel เสมอ ด้วย POST /api/ai/model/switch อีกครั้ง (ไม่ปล่อยให้ test อื่นเจอ state ที่เปลี่ยนไปค้างอยู่)

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ Test Isolation สำหรับ Global State...");
      const getMatch = code.match(/const\s+(\w+)\s*=\s*await\s+request\.get\(['"]\/api\/ai\/model['"]\)/);
      const getVar = getMatch ? getMatch[1] : null;
      const hasDestructure = getVar && new RegExp(`const\\s*\\{\\s*currentModel\\s*:\\s*originalModel\\s*\\}\\s*=\\s*await\\s+${getVar}\\.json\\(\\)`).test(code);
      if (hasDestructure) {
        log("✓ ขั้นตอนที่ 1: อ่านค่าโมเดลเดิม (currentModel) เก็บไว้ในตัวแปร originalModel ก่อนแก้ไขถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง GET /api/ai/model แล้วดึง currentModel ออกมาเก็บไว้ในตัวแปร originalModel ก่อนแก้ไขอะไร\nตัวอย่าง: const before = await request.get('/api/ai/model');\nconst { currentModel: originalModel } = await before.json();");
      }

      const hasSwitch = /await\s+request\.post\(['"]\/api\/ai\/model\/switch['"]\s*,\s*\{\s*data:\s*\{\s*model:\s*['"]gemini-3\.5-flash['"]\s*\}\s*\}\s*\)/.test(code);
      const hasStatusCheck = /expect\(\w+\.status\(\)\)\.toBe\(200\)/.test(code);
      if (hasSwitch && hasStatusCheck) {
        log("✓ ขั้นตอนที่ 2: สลับโมเดลเป็น 'gemini-3.5-flash' แล้วตรวจสอบ status 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง POST /api/ai/model/switch ด้วย data: { model: 'gemini-3.5-flash' } พร้อมตรวจสอบ status 200\nตัวอย่าง: const res = await request.post('/api/ai/model/switch', { data: { model: 'gemini-3.5-flash' } });\nexpect(res.status()).toBe(200);");
      }

      const hasRestore = /request\.post\(['"]\/api\/ai\/model\/switch['"]\s*,\s*\{\s*data:\s*\{\s*model:\s*originalModel\s*\}\s*\}\s*\)/.test(code);
      if (hasRestore) {
        log("✓ ขั้นตอนที่ 3: คืนค่าโมเดลกลับเป็น originalModel ถูกต้อง");
      } else {
        throw new Error("ไม่พบการคืนค่าโมเดลกลับเป็น originalModel ด้วย POST /api/ai/model/switch อีกครั้งท้ายเทส\nตัวอย่าง: await request.post('/api/ai/model/switch', { data: { model: originalModel } });");
      }
    },
    hint: "อ่านค่า state ปัจจุบันจาก backend เก็บไว้ในตัวแปรก่อนเสมอ แล้วค่อยเปลี่ยนค่านั้นด้วย POST request ที่เหมาะสม สุดท้ายอย่าลืมยิง POST อีกครั้งเพื่อคืนค่ากลับเป็น 'ค่าที่อ่านมาตอนแรก' (ตัวแปรที่เก็บไว้ ไม่ใช่ค่าคงที่ที่เขียนตายตัว) ไม่เช่นนั้น test อื่นที่รันขนานกันจะเจอ state ค้างอยู่",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3009: สลับ AI Model แล้วต้องคืนค่าเดิมเสมอ (กัน state รั่วไหลข้าม test อื่น)', async ({ request }) => {
  // 1. ยิง GET /api/ai/model เก็บค่าโมเดลเดิมไว้ในตัวแปร originalModel ก่อนแก้ไขอะไรทั้งสิ้น
  const before = await request.get('/api/ai/model');
  const { currentModel: originalModel } = await before.json();

  // 2. ยิง POST /api/ai/model/switch พร้อม data: { model: 'gemini-3.5-flash' } แล้วตรวจสอบว่า status code เป็น 200
  const switchResponse = await request.post('/api/ai/model/switch', {
    data: { model: 'gemini-3.5-flash' }
  });
  expect(switchResponse.status()).toBe(200);

  // 3. คืนค่าโมเดลกลับเป็น originalModel เสมอ ด้วย POST /api/ai/model/switch อีกครั้ง (ไม่ปล่อยให้ test อื่นเจอ state ที่เปลี่ยนไปค้างอยู่)
  await request.post('/api/ai/model/switch', { data: { model: originalModel } });
});`,
    theory: `ไม่ใช่ทุกความไม่เสถียรของ test จะแก้ด้วยการเพิ่ม timeout — บางเคสคือ <strong>Race Condition</strong> จาก Global State ที่ทดสอบหลายตัวแย่งกันแก้ ซึ่งเพิ่มเวลารอเท่าไหร่ก็ไม่ช่วย เพราะปัญหาไม่ได้อยู่ที่ "ช้า" แต่อยู่ที่ "ลำดับการรันแทรกกัน"<br/><br/>
    ในโค้ดจริงของ <code>packages/ai-core/services/gemini-service.js</code> มีตัวแปรระดับโมดูล:<br/>
    <code>let currentModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';</code><br/><br/>
    endpoint <code>/api/ai/model/switch</code> เขียนทับตัวแปรนี้ตรงๆ — เป็น state ที่ใช้ร่วมกัน "ทั้งเซิร์ฟเวอร์" ไม่ใช่ per-request หรือ per-test ถ้ารัน test ขนานกัน (parallel workers) แล้ว test A สลับโมเดลพร้อมกับที่ test B กำลังจะ assert ค่าโมเดลอีกตัว ผลลัพธ์จะขึ้นอยู่กับว่าใครรันก่อนหลัง — flaky แบบที่เพิ่ม <code>timeout</code>/<code>retries</code> เท่าไหร่ก็ไม่มีทางแก้ได้<br/><br/>
    ทางแก้ที่ถูกต้อง: (1) อ่านค่าก่อนแก้ไขเสมอ (2) คืนค่าเดิมท้าย test เสมอไม่ว่าผลจะผ่านหรือไม่ (ในโค้ดจริงควรใช้ <code>try/finally</code> หรือ <code>test.afterEach</code>) และ/หรือ (3) บังคับให้ test กลุ่มที่แก้ shared state ตัวเดียวกันรันแบบ serial ด้วย <code>test.describe.configure({ mode: 'serial' })</code> แทนการปล่อยให้ parallel worker ชนกัน`,
    example: `// ตัวอย่างการบังคับ test กลุ่มที่แก้ shared state เดียวกันให้รันเรียงลำดับ ไม่ขนาน
test.describe('AI Model switching (shares global state)', () => {
  test.describe.configure({ mode: 'serial' });

  test('...', async ({ request }) => { /* ... */ });
  test('...', async ({ request }) => { /* ... */ });
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดยยึดหลัก "อ่านก่อน-แก้-คืนค่า" กับ Global State จริงใน <code>gemini-service.js</code>:<br/>
    1. ยิง GET <code>/api/ai/model</code> เก็บค่าโมเดลเดิมไว้ในตัวแปร <code>originalModel</code><br/>
    2. ยิง POST <code>/api/ai/model/switch</code> พร้อม <code>data: { model: 'gemini-3.5-flash' }</code> แล้วตรวจสอบ status <code>200</code><br/>
    3. คืนค่าโมเดลกลับเป็น <code>originalModel</code> ด้วย POST <code>/api/ai/model/switch</code> อีกครั้งเสมอ`
  },
  {
    id: "pagination_edge_case",
    meta: "บทที่ 9",
    title: "Pagination Edge Case: หน้าที่เกินขอบเขต (Mock Endpoint)",
    template: `import { test, expect } from '@playwright/test';

test('TC-3010: ขอหน้าที่เกินขอบเขตของ Pagination ต้องได้ array ว่าง ไม่ error', async ({ request }) => {
  // หมายเหตุ: /api/portfolio/history เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด Pagination เพราะ API จริงของ My-Investment-Port ยังไม่มี endpoint แบบนี้
  // 1. ยิง GET /api/portfolio/history?page=999&limit=20 (หน้าที่เกินขอบเขตจริงแน่นอน)
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 200 (ไม่ใช่ error แม้จะขอหน้าที่เกินขอบเขต)


  // 3. ตรวจสอบว่า body.items เป็น array ว่าง (length 0)

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ Pagination Edge Case...");
      const hasGet = /await\s+request\.get\(['"]\/api\/portfolio\/history\?page=999&limit=20['"]\)/.test(code);
      if (hasGet) {
        log("✓ ขั้นตอนที่ 1: ยิง request.get('/api/portfolio/history?page=999&limit=20') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.get('/api/portfolio/history?page=999&limit=20')\nตัวอย่าง: const response = await request.get('/api/portfolio/history?page=999&limit=20');");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(200\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 200\nตัวอย่าง: expect(response.status()).toBe(200);");
      }

      if (/expect\(body\.items\)\.toHaveLength\(0\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบว่า body.items เป็น array ว่างถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบว่า body.items มีความยาว 0\nตัวอย่าง: expect(body.items).toHaveLength(0);");
      }
    },
    hint: "ลองส่งเลขหน้า (page) ที่เกินจำนวนหน้าทั้งหมดไปแน่ๆ แล้วดูว่า endpoint ยังตอบ status ปกติหรือไม่ (ไม่ error) และ array ข้อมูลที่ได้ควรมีความยาวเท่าไหร่เมื่อไม่มีข้อมูลเหลือให้แสดง",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3010: ขอหน้าที่เกินขอบเขตของ Pagination ต้องได้ array ว่าง ไม่ error', async ({ request }) => {
  // หมายเหตุ: /api/portfolio/history เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด Pagination เพราะ API จริงของ My-Investment-Port ยังไม่มี endpoint แบบนี้
  // 1. ยิง GET /api/portfolio/history?page=999&limit=20 (หน้าที่เกินขอบเขตจริงแน่นอน)
  const response = await request.get('/api/portfolio/history?page=999&limit=20');

  // 2. ตรวจสอบว่า status code เป็น 200 (ไม่ใช่ error แม้จะขอหน้าที่เกินขอบเขต)
  expect(response.status()).toBe(200);

  // 3. ตรวจสอบว่า body.items เป็น array ว่าง (length 0)
  const body = await response.json();
  expect(body.items).toHaveLength(0);
});`,
    theory: `<strong>หมายเหตุสำคัญ:</strong> เช็คแล้ว API จริงของ My-Investment-Port <strong>ไม่มี</strong> endpoint แบบ pagination (<code>page</code>/<code>limit</code>/<code>offset</code>) เลยสักตัว — บทเรียนนี้จำลอง endpoint <code>/api/portfolio/history</code> ขึ้นมาเพื่อสอนแนวคิดที่พบบ่อยมากในระบบจริงทั่วไป ไม่ใช่ endpoint จริงของโปรเจกนี้<br/><br/>
    บั๊กที่พบบ่อยของ Pagination: เมื่อ client ขอหน้าที่เกินจำนวนหน้าทั้งหมด (เช่น มีข้อมูลแค่ 5 หน้า แต่ขอหน้าที่ 999) Backend ที่เขียนไม่ดีมักพัง 2 แบบ:<br/>
    1. โยน error 400/500 ทั้งที่ query parameter ถูกต้องตามรูปแบบทุกอย่าง (แค่ "เกินขอบเขต" ไม่ใช่ "ผิดรูปแบบ")<br/>
    2. แย่กว่านั้นคือ วนกลับไปคืนข้อมูลหน้าแรกซ้ำ (data leak แบบเงียบๆ) ทำให้ client เข้าใจผิดว่ามีข้อมูลจริง<br/><br/>
    พฤติกรรมที่ถูกต้องตาม REST convention: หน้าที่เกินขอบเขตต้องได้ <code>200</code> พร้อม array ว่าง เพื่อให้ UI แสดง "ไม่มีข้อมูลเพิ่มเติม" ได้อย่างสง่างาม ไม่ต้อง special-case จัดการ error แยก`,
    example: `// ตัวอย่าง happy path ของ pagination ปกติ (หน้าที่ 1 มีข้อมูลจริง)
const response = await request.get('/api/portfolio/history?page=1&limit=20');
const body = await response.json();
expect(body.items.length).toBeGreaterThan(0);
expect(body.totalPages).toBeGreaterThanOrEqual(1);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (endpoint จำลองเพื่อฝึกแนวคิด) โดย:<br/>
    1. ยิง GET <code>/api/portfolio/history?page=999&limit=20</code> (หน้าที่เกินขอบเขต)<br/>
    2. ตรวจสอบว่า status code เป็น <code>200</code> ไม่ใช่ error<br/>
    3. ตรวจสอบว่า <code>body.items</code> เป็น array ว่าง (<code>length 0</code>)`
  },
  {
    id: "file_import_validation",
    meta: "บทที่ 10",
    title: "File Import: ตรวจสอบไฟล์ผิดรูปแบบก่อนประมวลผล (Mock Endpoint)",
    template: `import { test, expect } from '@playwright/test';

test('TC-3011: อัปโหลดไฟล์ CSV ว่างเปล่าต้องได้ 400 ไม่ใช่ Server Crash', async ({ request }) => {
  // หมายเหตุ: /api/holdings/import เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด File Import Validation เพราะ API จริงของ My-Investment-Port ยังไม่มี endpoint แบบนี้
  // 1. ยิง POST /api/holdings/import ด้วย multipart file ชื่อ empty.csv เนื้อหาว่างเปล่า
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 400 (ไม่ใช่ 500 Server Crash)


  // 3. ตรวจสอบว่า body.error ตรงกับ 'CSV file is empty or invalid'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ File Import Validation...");
      const hasMultipart = /await\s+request\.post\(['"]\/api\/holdings\/import['"][\s\S]*?multipart:\s*\{[\s\S]*?file:\s*\{[\s\S]*?buffer:\s*Buffer\.from\(['"]{2}\)/.test(code);
      if (hasMultipart) {
        log("✓ ขั้นตอนที่ 1: ส่งไฟล์ CSV ว่างเปล่าผ่าน multipart ถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง POST /api/holdings/import แบบ multipart พร้อมไฟล์เนื้อหาว่างเปล่า\nตัวอย่าง: const response = await request.post('/api/holdings/import', {\n  multipart: { file: { name: 'empty.csv', mimeType: 'text/csv', buffer: Buffer.from('') } }\n});");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(400\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 400 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 400\nตัวอย่าง: expect(response.status()).toBe(400);");
      }

      if (/body\.error\)\.toBe\(['"]CSV file is empty or invalid['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'CSV file is empty or invalid'\nตัวอย่าง: expect(body.error).toBe('CSV file is empty or invalid');");
      }
    },
    hint: "การส่งไฟล์ผ่าน Playwright ใช้ option สำหรับแนบไฟล์แบบ multipart โดยไม่ต้องมีไฟล์จริงบนดิสก์เลย — ลองสร้างเนื้อหาไฟล์ว่างเปล่าขึ้นมาในหน่วยความจำ แล้วดูว่า backend ตอบ status และ error message อะไรเมื่อไฟล์ไม่มีเนื้อหาให้ parse",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3011: อัปโหลดไฟล์ CSV ว่างเปล่าต้องได้ 400 ไม่ใช่ Server Crash', async ({ request }) => {
  // หมายเหตุ: /api/holdings/import เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด File Import Validation เพราะ API จริงของ My-Investment-Port ยังไม่มี endpoint แบบนี้
  // 1. ยิง POST /api/holdings/import ด้วย multipart file ชื่อ empty.csv เนื้อหาว่างเปล่า
  const response = await request.post('/api/holdings/import', {
    multipart: {
      file: { name: 'empty.csv', mimeType: 'text/csv', buffer: Buffer.from('') }
    }
  });

  // 2. ตรวจสอบว่า status code เป็น 400 (ไม่ใช่ 500 Server Crash)
  expect(response.status()).toBe(400);

  // 3. ตรวจสอบว่า body.error ตรงกับ 'CSV file is empty or invalid'
  const body = await response.json();
  expect(body.error).toBe('CSV file is empty or invalid');
});`,
    theory: `<strong>หมายเหตุสำคัญ:</strong> เช็คแล้ว server ของ My-Investment-Port <strong>ไม่มี</strong> multer/express-fileupload หรือ endpoint สำหรับ import ไฟล์เลยสักตัว — บทเรียนนี้จำลอง endpoint <code>/api/holdings/import</code> ขึ้นมาเพื่อสอนแนวคิดที่พบบ่อยมากเมื่อต้องรับไฟล์จาก client จริง ไม่ใช่ endpoint จริงของโปรเจกนี้<br/><br/>
    บั๊กที่พบบ่อยที่สุดของ endpoint รับไฟล์: Dev เขียนโค้ด parse ไฟล์ (เช่น CSV) โดยเชื่อว่าไฟล์ต้อง "ถูกรูปแบบเสมอ" แล้วส่งตรงเข้า logic ประมวลผลทันที พอเจอไฟล์ว่างเปล่า/format ผิด/encoding แปลกๆ โค้ด parser จะโยน exception ที่ไม่ได้ดักไว้ ทำให้ server ตอบ <code>500 Internal Server Error</code> (หรือแย่กว่านั้นคือ process ล่มทั้งตัว) แทนที่จะเป็น <code>400 Bad Request</code> พร้อมข้อความชัดเจน<br/><br/>
    หลักการ: endpoint ที่รับไฟล์จาก client ต้อง validate เนื้อหาไฟล์ "ก่อน" ส่งเข้า business logic เสมอ — เช็คว่าไฟล์ไม่ว่างเปล่า มีคอลัมน์ที่คาดหวัง และ parse ได้จริง ก่อนจะประมวลผลต่อ ถ้า validate ไม่ผ่านต้องตอบ 4xx พร้อมเหตุผลที่ผู้ใช้แก้ไขได้ ไม่ใช่ปล่อยให้ crash`,
    example: `// ตัวอย่าง happy path: ไฟล์ CSV ถูกต้องตามรูปแบบ
const response = await request.post('/api/holdings/import', {
  multipart: {
    file: { name: 'holdings.csv', mimeType: 'text/csv', buffer: Buffer.from('ticker,shares\\nAAPL,10') }
  }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (endpoint จำลองเพื่อฝึกแนวคิด) โดย:<br/>
    1. ยิง POST <code>/api/holdings/import</code> ด้วย multipart ไฟล์ชื่อ <code>empty.csv</code> เนื้อหาว่างเปล่า<br/>
    2. ตรวจสอบว่า status code เป็น <code>400</code> ไม่ใช่ <code>500</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'CSV file is empty or invalid'</code>`
  },
  {
    id: "file_type_validation",
    meta: "บทที่ 11",
    title: "File Type Validation: ปฏิเสธไฟล์ผิดประเภทก่อนประมวลผล (Mock Endpoint)",
    template: `import { test, expect } from '@playwright/test';

test('TC-3012: อัปโหลดไฟล์ .exe อ้างว่าเป็น CSV ต้องโดนบล็อกด้วย 400', async ({ request }) => {
  // หมายเหตุ: /api/holdings/import เป็น endpoint จำลอง (mock) ต่อยอดจากบทที่ 10
  // 1. ยิง POST /api/holdings/import ด้วย multipart file ชื่อ malware.exe mimeType application/x-msdownload
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 400


  // 3. ตรวจสอบว่า body.error ตรงกับ 'Only CSV files are allowed'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ File Type Validation...");
      const hasMultipart = /await\s+request\.post\(['"]\/api\/holdings\/import['"][\s\S]*?multipart:\s*\{[\s\S]*?file:\s*\{[\s\S]*?mimeType:\s*['"]application\/x-msdownload['"][\s\S]*?\}/.test(code);
      if (hasMultipart) {
        log("✓ ขั้นตอนที่ 1: ส่งไฟล์ .exe ผ่าน multipart พร้อม mimeType ผิดประเภทถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง POST /api/holdings/import แบบ multipart พร้อมไฟล์ mimeType 'application/x-msdownload'\nตัวอย่าง: const response = await request.post('/api/holdings/import', {\n  multipart: { file: { name: 'malware.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('fake binary') } }\n});");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(400\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 400 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 400\nตัวอย่าง: expect(response.status()).toBe(400);");
      }

      if (/body\.error\)\.toBe\(['"]Only CSV files are allowed['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'Only CSV files are allowed'\nตัวอย่าง: expect(body.error).toBe('Only CSV files are allowed');");
      }
    },
    hint: "การเช็คประเภทไฟล์ที่แนบมาไม่ควรดูจากนามสกุลชื่อไฟล์อย่างเดียว — มองหา field ใน multipart ที่ใช้ระบุ MIME type ของไฟล์ แล้วลองตั้งค่าให้ไม่ตรงกับ CSV ดูว่า backend ปฏิเสธด้วย status และข้อความอะไร",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3012: อัปโหลดไฟล์ .exe อ้างว่าเป็น CSV ต้องโดนบล็อกด้วย 400', async ({ request }) => {
  // หมายเหตุ: /api/holdings/import เป็น endpoint จำลอง (mock) ต่อยอดจากบทที่ 10
  // 1. ยิง POST /api/holdings/import ด้วย multipart file ชื่อ malware.exe mimeType application/x-msdownload
  const response = await request.post('/api/holdings/import', {
    multipart: {
      file: { name: 'malware.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('fake binary') }
    }
  });

  // 2. ตรวจสอบว่า status code เป็น 400
  expect(response.status()).toBe(400);

  // 3. ตรวจสอบว่า body.error ตรงกับ 'Only CSV files are allowed'
  const body = await response.json();
  expect(body.error).toBe('Only CSV files are allowed');
});`,
    theory: `บทที่แล้วเช็คแค่ "ไฟล์ว่างเปล่า" แต่ในระบบจริงยังมีอีกเคสที่พบบ่อยไม่แพ้กัน: <strong>ไฟล์ผิดประเภท</strong> — ผู้ใช้ (หรือคนร้าย) อาจแนบไฟล์ <code>.exe</code>, <code>.png</code>, หรือ script ใดๆ แล้วตั้งชื่อ/พยายามหลอกว่าเป็น <code>.csv</code><br/><br/>
    หลักการตรวจสอบที่ถูกต้อง: <strong>ห้ามเชื่อแค่ชื่อไฟล์ (นามสกุล)</strong> เพราะเปลี่ยนชื่อไฟล์ยังไงก็ได้ ต้องเช็ค <code>mimeType</code> ที่ client ส่งมาประกอบด้วย (แม้ <code>mimeType</code> เองก็ยัง spoof ได้ในทางทฤษฎี แต่เป็นด่านแรกที่ป้องกัน mistake ทั่วไปได้ดี) และในระบบที่ต้องการความปลอดภัยสูงกว่านี้ควรตรวจ "magic bytes" ต้นไฟล์จริงด้วย (เช่นไฟล์ CSV จริงต้องไม่มี PE header ของ .exe)<br/><br/>
    บั๊กที่พบบ่อย: Backend เช็คแค่นามสกุลไฟล์จาก field name ที่ client กำหนดเอง (<code>filename.endsWith('.csv')</code>) โดยไม่เช็ค <code>mimeType</code>/เนื้อหาจริงเลย — ผ่านการเช็คปลอมๆ ได้ง่ายๆ แค่เปลี่ยนชื่อไฟล์`,
    example: `// ตัวอย่างเช็คไฟล์ที่ mimeType ถูกต้องแต่ชื่อไฟล์แปลก (ยังต้องผ่าน เพราะ Backend เช็ค mimeType ไม่ใช่นามสกุล)
const response = await request.post('/api/holdings/import', {
  multipart: {
    file: { name: 'my_data_file', mimeType: 'text/csv', buffer: Buffer.from('ticker,shares\\nAAPL,10') }
  }
});
expect(response.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (endpoint จำลองเพื่อฝึกแนวคิด) โดย:<br/>
    1. ยิง POST <code>/api/holdings/import</code> ด้วย multipart ไฟล์ชื่อ <code>malware.exe</code> mimeType <code>application/x-msdownload</code><br/>
    2. ตรวจสอบว่า status code เป็น <code>400</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'Only CSV files are allowed'</code>`
  },
  {
    id: "file_size_validation",
    meta: "บทที่ 12",
    title: "File Size Validation: ปฏิเสธไฟล์ใหญ่เกินก่อนจะกินหน่วยความจำ (Mock Endpoint)",
    template: `import { test, expect } from '@playwright/test';

test('TC-3013: อัปโหลดไฟล์ใหญ่เกิน 5MB ต้องโดนบล็อกด้วย 413', async ({ request }) => {
  // หมายเหตุ: /api/holdings/import เป็น endpoint จำลอง (mock) ต่อยอดจากบทที่ 10-11
  // 1. ยิง POST /api/holdings/import ด้วย multipart file ขนาด 6MB (เกิน limit 5MB)
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่า status code เป็น 413


  // 3. ตรวจสอบว่า body.error ตรงกับ 'File size exceeds 5MB limit'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ File Size Validation...");
      const hasBigBuffer = /Buffer\.alloc\(\s*6\s*\*\s*1024\s*\*\s*1024\s*\)/.test(code);
      const hasMultipart = /await\s+request\.post\(['"]\/api\/holdings\/import['"][\s\S]*?multipart:/.test(code);
      if (hasBigBuffer && hasMultipart) {
        log("✓ ขั้นตอนที่ 1: ส่งไฟล์ขนาด 6MB (Buffer.alloc(6 * 1024 * 1024)) ถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง POST /api/holdings/import พร้อมไฟล์ขนาด 6MB\nตัวอย่าง: const response = await request.post('/api/holdings/import', {\n  multipart: { file: { name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) } }\n});");
      }

      if (/expect\(response\.status\(\)\)\.toBe\(413\)/.test(code)) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบ status code 413 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 413\nตัวอย่าง: expect(response.status()).toBe(413);");
      }

      if (/body\.error\)\.toBe\(['"]File size exceeds 5MB limit['"]\)/.test(code)) {
        log("✓ ขั้นตอนที่ 3: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ที่ตรงกับ 'File size exceeds 5MB limit'\nตัวอย่าง: expect(body.error).toBe('File size exceeds 5MB limit');");
      }
    },
    hint: "ไม่ต้องมีไฟล์ใหญ่จริงในเครื่อง สร้าง buffer ขนาดใหญ่ขึ้นมาในหน่วยความจำตรงๆ ให้เกิน limit ที่ backend กำหนด แล้วดูว่า status code ที่ถูกต้องตาม HTTP spec สำหรับ 'ไฟล์ใหญ่เกินไป' คืออะไร (ไม่ใช่ 400 ธรรมดา)",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3013: อัปโหลดไฟล์ใหญ่เกิน 5MB ต้องโดนบล็อกด้วย 413', async ({ request }) => {
  // หมายเหตุ: /api/holdings/import เป็น endpoint จำลอง (mock) ต่อยอดจากบทที่ 10-11
  // 1. ยิง POST /api/holdings/import ด้วย multipart file ขนาด 6MB (เกิน limit 5MB)
  const response = await request.post('/api/holdings/import', {
    multipart: {
      file: { name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) }
    }
  });

  // 2. ตรวจสอบว่า status code เป็น 413
  expect(response.status()).toBe(413);

  // 3. ตรวจสอบว่า body.error ตรงกับ 'File size exceeds 5MB limit'
  const body = await response.json();
  expect(body.error).toBe('File size exceeds 5MB limit');
});`,
    theory: `นอกจากประเภทไฟล์ผิด อีกเคสที่ระบบรับไฟล์ต้องป้องกันคือ <strong>ไฟล์ใหญ่เกินไป</strong> — ถ้าไม่จำกัดขนาดไว้ ผู้ใช้ (หรือคนร้าย) ส่งไฟล์ขนาดหลาย GB มาได้ ทำให้ server กินหน่วยความจำจนล่ม (Denial of Service แบบไม่ตั้งใจหรือตั้งใจก็ได้)<br/><br/>
    Status code ที่ถูกต้องตาม HTTP spec สำหรับเคสนี้คือ <strong><code>413 Payload Too Large</code></strong> (ไม่ใช่ 400 ธรรมดา) — บอกชัดเจนว่าปัญหาคือ "ขนาด" ไม่ใช่ "รูปแบบข้อมูล"<br/><br/>
    ในการทดสอบจริง ไม่จำเป็นต้องมีไฟล์ 6MB เก็บไว้ในเครื่องจริงๆ — ใช้ <code>Buffer.alloc(6 * 1024 * 1024)</code> สร้าง buffer ขนาด 6MB ขึ้นมาในหน่วยความจำตรงๆ ตอนรัน test ได้เลย (เร็วกว่าและไม่ต้อง commit ไฟล์ใหญ่ๆ ติดไปกับ test repo)<br/><br/>
    ลำดับการตรวจสอบที่ถูกต้องของ Backend: เช็ค "ขนาดไฟล์" ก่อนเช็ค "เนื้อหาไฟล์" เสมอ (เช็คขนาดเร็วและถูกกว่ามาก ไม่ต้องอ่าน/parse เนื้อหาทั้งไฟล์ก่อนถึงจะรู้ว่ามันใหญ่เกินไป) — บั๊กที่พบบ่อยคือเขียนโค้ด parse ไฟล์ก่อนแล้วค่อยเช็คขนาดทีหลัง ทำให้ยังเสีย CPU/Memory ไปกับการ parse ไฟล์ใหญ่ๆ อยู่ดีก่อนจะถูกปฏิเสธ`,
    example: `// ตัวอย่างไฟล์ขนาดพอดี limit (5MB เป๊ะ) ต้องผ่าน ไม่ใช่โดนบล็อก
const response = await request.post('/api/holdings/import', {
  multipart: {
    file: { name: 'ok.csv', mimeType: 'text/csv', buffer: Buffer.alloc(5 * 1024 * 1024, 'a') }
  }
});
expect(response.status()).not.toBe(413);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (endpoint จำลองเพื่อฝึกแนวคิด) โดย:<br/>
    1. ยิง POST <code>/api/holdings/import</code> ด้วยไฟล์ขนาด <code>6MB</code> (<code>Buffer.alloc(6 * 1024 * 1024)</code>)<br/>
    2. ตรวจสอบว่า status code เป็น <code>413</code><br/>
    3. ตรวจสอบว่า <code>body.error</code> ตรงกับ <code>'File size exceeds 5MB limit'</code>`
  },
  {
    id: "chained_workflow",
    meta: "ขั้นสูง 1",
    title: "Chained Request Workflow: สร้าง Resource แล้วดึงข้อมูลกลับด้วย id ที่ได้จาก Response (Mock Endpoint)",
    template: `import { test, expect } from '@playwright/test';

test('TC-3014: สร้าง Watchlist แล้วใช้ id จาก response ไปดึงข้อมูลกลับมาตรวจสอบ', async ({ request }) => {
  // หมายเหตุ: /api/watchlist เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด Chained Request Workflow

  // 1. ยิง POST ไปที่ /api/watchlist พร้อม data: { ticker: 'TSLA' } แล้วดึง id จาก response body มาเก็บไว้ในตัวแปรชื่อ id
  // WRITE YOUR CODE HERE


  // 2. ใช้ id ที่ได้จากขั้นตอนที่ 1 (ห้ามเขียน id เอง) ยิง GET ไปที่ /api/watchlist/\${id}


  // 3. ตรวจสอบว่า status code ของ GET เป็น 200 และ body.ticker ตรงกับ 'TSLA'

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ Chained Request Workflow...");

      const postMatch = code.match(/const\s+(\w+)\s*=\s*await\s+request\.post\(['"]\/api\/watchlist['"]\s*,\s*\{\s*data:\s*\{\s*ticker:\s*['"]TSLA['"]\s*\}\s*\}\s*\)/);
      const postVar = postMatch ? postMatch[1] : null;
      if (postVar) {
        log(`✓ ขั้นตอนที่ 1: ยิง request.post('/api/watchlist', { data: { ticker: 'TSLA' } }) เก็บผลไว้ในตัวแปร ${postVar} ถูกต้อง`);
      } else {
        throw new Error("ไม่พบการยิง POST /api/watchlist ด้วย data: { ticker: 'TSLA' } พร้อมเก็บผลลัพธ์ไว้ในตัวแปร\nตัวอย่าง: const createResponse = await request.post('/api/watchlist', { data: { ticker: 'TSLA' } });");
      }

      const hasIdCapture = postVar && new RegExp(`const\\s*\\{\\s*id\\s*\\}\\s*=\\s*await\\s+${postVar}\\.json\\(\\)`).test(code);
      if (hasIdCapture) {
        log("✓ ขั้นตอนที่ 2: ดึง id จาก response body ของการสร้าง resource มาเก็บไว้ในตัวแปร id ถูกต้อง");
      } else {
        throw new Error("ไม่พบการดึง id จาก response body ของการสร้าง resource\nตัวอย่าง: const { id } = await createResponse.json();");
      }

      const getMatch = code.match(/const\s+(\w+)\s*=\s*await\s+request\.get\(`\/api\/watchlist\/\$\{id\}`\)/);
      const getVar = getMatch ? getMatch[1] : null;
      if (getVar) {
        log(`✓ ขั้นตอนที่ 3: ใช้ id ที่ได้ยิง GET ไปที่ /api/watchlist/\${id} เก็บผลไว้ในตัวแปร ${getVar} ถูกต้อง`);
      } else {
        throw new Error("ไม่พบการยิง GET ไปที่ /api/watchlist/${id} โดยใช้ id ที่ดึงมาจากขั้นตอนก่อนหน้า (ต้องใช้ template literal แทรกตัวแปร id จริง)\nตัวอย่าง: const getResponse = await request.get(`/api/watchlist/${id}`);");
      }

      const hasStatusCheck = getVar && new RegExp(`expect\\(${getVar}\\.status\\(\\)\\)\\.toBe\\(200\\)`).test(code);
      const hasJsonRead = getVar && new RegExp(`await\\s+${getVar}\\.json\\(\\)`).test(code);
      const hasTickerCheck = /body\.ticker\)\.toBe\(['"]TSLA['"]\)/.test(code);
      if (hasStatusCheck && hasJsonRead && hasTickerCheck) {
        log("✓ ขั้นตอนที่ 4: ตรวจสอบ status 200 และ body.ticker === 'TSLA' จาก response ของ GET ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบ status code 200 และ body.ticker ที่ตรงกับ 'TSLA' จาก response ของ GET\nตัวอย่าง: expect(getResponse.status()).toBe(200);\nconst body = await getResponse.json();\nexpect(body.ticker).toBe('TSLA');");
      }
    },
    hint: "ห้ามคิด id เอง — ต้องดึงค่าที่ backend สร้างขึ้นให้จากการยิง POST ครั้งแรกออกมาจาก response body ก่อน แล้วค่อยเอาค่านั้นแทรกลงใน URL ของ request ถัดไปด้วย template literal จากนั้นตรวจสอบว่าข้อมูลที่ดึงกลับมาตรงกับสิ่งที่สร้างไว้จริง",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3014: สร้าง Watchlist แล้วใช้ id จาก response ไปดึงข้อมูลกลับมาตรวจสอบ', async ({ request }) => {
  // หมายเหตุ: /api/watchlist เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด Chained Request Workflow

  // 1. ยิง POST ไปที่ /api/watchlist พร้อม data: { ticker: 'TSLA' } แล้วดึง id จาก response body มาเก็บไว้ในตัวแปรชื่อ id
  const createResponse = await request.post('/api/watchlist', { data: { ticker: 'TSLA' } });
  const { id } = await createResponse.json();

  // 2. ใช้ id ที่ได้จากขั้นตอนที่ 1 (ห้ามเขียน id เอง) ยิง GET ไปที่ /api/watchlist/\${id}
  const getResponse = await request.get(\`/api/watchlist/\${id}\`);

  // 3. ตรวจสอบว่า status code ของ GET เป็น 200 และ body.ticker ตรงกับ 'TSLA'
  expect(getResponse.status()).toBe(200);
  const body = await getResponse.json();
  expect(body.ticker).toBe('TSLA');
});`,
    theory: `การทดสอบ API ในระบบจริงไม่ได้จบแค่การยิง request เดี่ยวๆ ทีละครั้งเสมอไป หลาย workflow ต้องอาศัยผลลัพธ์จาก request หนึ่งไปเป็น input ของ request ถัดไป เรียกว่า <strong>Chained Request / Multi-step Workflow</strong><br/><br/>
    รูปแบบที่พบบ่อยที่สุด: ยิง <code>POST</code> เพื่อสร้าง resource ใหม่ แล้ว backend จะสร้าง <code>id</code> ให้เองและตอบกลับมาใน response body — QA <strong>ห้ามสมมติหรือคิด id เอง</strong> เพราะ id มักเป็นค่าที่ backend สุ่มหรือ auto-increment ขึ้นมา (เช่น UUID หรือเลขลำดับถัดไปในฐานข้อมูล) ต้องดึงค่าจริงจาก response ของขั้นตอนก่อนหน้ามาใช้เสมอ<br/><br/>
    ขั้นตอนสำคัญ 3 อย่างของแบบฝึกหัดนี้:<br/>
    1. <strong>Extract</strong>: แปลง response แรกเป็น JSON แล้วดึงค่าที่ต้องใช้ต่อออกมาเก็บในตัวแปร<br/>
    2. <strong>Chain</strong>: นำตัวแปรนั้นไปประกอบเป็นส่วนหนึ่งของ URL หรือ body ของ request ถัดไป (มักใช้ template literal แทรกตัวแปรลงใน string)<br/>
    3. <strong>Verify</strong>: ยืนยันว่าข้อมูลที่ได้จาก request ที่สองสอดคล้องกับสิ่งที่สร้างไว้ในขั้นตอนแรกจริง ไม่ใช่แค่เช็ค status code ผ่านเฉยๆ`,
    example: `// ตัวอย่าง Chained Request กับ endpoint สร้างและดึงข้อมูล order
const createRes = await request.post('/api/orders', { data: { item: 'widget' } });
const { orderId } = await createRes.json();

const getRes = await request.get(\`/api/orders/\${orderId}\`);
expect(getRes.status()).toBe(200);
const orderBody = await getRes.json();
expect(orderBody.item).toBe('widget');`,
    task: `จงเขียนสคริปต์ทดสอบ Multi-step Workflow ให้สมบูรณ์ (endpoint จำลองเพื่อฝึกแนวคิด) โดย:<br/>
    1. ยิง POST ไปที่ <code>/api/watchlist</code> พร้อม <code>data: { ticker: 'TSLA' }</code> แล้วดึง <code>id</code> จาก response body มาเก็บไว้ในตัวแปรชื่อ <code>id</code><br/>
    2. ใช้ <code>id</code> ที่ได้จากขั้นตอนที่ 1 (ห้ามเขียน id เอง) ยิง GET ไปที่ <code>/api/watchlist/\${id}</code><br/>
    3. ตรวจสอบว่า status code ของ GET เป็น <code>200</code> และ <code>body.ticker</code> ตรงกับ <code>'TSLA'</code>`
  },
  {
    id: "auth_token_flow",
    meta: "ขั้นสูง 2",
    title: "Session/Token Authentication: Login แล้วแนบ Token ใช้ข้าม Request (Mock Endpoint)",
    template: `import { test, expect } from '@playwright/test';

test('TC-3015: Login ดึง Token แล้วใช้ Authorization Header เข้าถึง Endpoint ที่ต้อง Auth', async ({ request }) => {
  // หมายเหตุ: /api/auth/login และ /api/portfolio/secure เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด Token-based Authentication

  // 1. ยิง GET ไปที่ /api/portfolio/secure โดยไม่แนบ Authorization header ใดๆ แล้วตรวจสอบว่า status code เป็น 401
  // WRITE YOUR CODE HERE


  // 2. ยิง POST ไปที่ /api/auth/login พร้อม data: { username: 'qa_user', password: 'qa_pass' } แล้วดึง token จาก response body


  // 3. ใช้ token ที่ได้ แนบเป็น Authorization header รูปแบบ Bearer ยิง GET ไปที่ /api/portfolio/secure อีกครั้ง แล้วตรวจสอบว่า status code เป็น 200

});`,
    validate: (code, log) => {
      code = stripComments(code);
      log("🔍 ตรวจสอบ Token-based Authentication Flow...");

      const unauthMatch = code.match(/const\s+(\w+)\s*=\s*await\s+request\.get\(['"]\/api\/portfolio\/secure['"]\)/);
      const unauthVar = unauthMatch ? unauthMatch[1] : null;
      const hasUnauthCheck = unauthVar && new RegExp(`expect\\(${unauthVar}\\.status\\(\\)\\)\\.toBe\\(401\\)`).test(code);
      if (hasUnauthCheck) {
        log("✓ ขั้นตอนที่ 1: ยิง GET /api/portfolio/secure โดยไม่มี token แล้วตรวจสอบ status 401 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง GET /api/portfolio/secure โดยไม่แนบ Authorization header แล้วตรวจสอบ status 401\nตัวอย่าง: const unauthorizedResponse = await request.get('/api/portfolio/secure');\nexpect(unauthorizedResponse.status()).toBe(401);");
      }

      const loginMatch = code.match(/const\s+(\w+)\s*=\s*await\s+request\.post\(['"]\/api\/auth\/login['"]\s*,\s*\{\s*data:\s*\{\s*username:\s*['"]qa_user['"]\s*,\s*password:\s*['"]qa_pass['"]\s*\}\s*\}\s*\)/);
      const loginVar = loginMatch ? loginMatch[1] : null;
      const hasTokenCapture = loginVar && new RegExp(`const\\s*\\{\\s*token\\s*\\}\\s*=\\s*await\\s+${loginVar}\\.json\\(\\)`).test(code);
      if (hasTokenCapture) {
        log("✓ ขั้นตอนที่ 2: ยิง POST /api/auth/login แล้วดึง token จาก response body ถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง POST /api/auth/login ด้วย data: { username: 'qa_user', password: 'qa_pass' } พร้อมดึง token จาก response body\nตัวอย่าง: const loginResponse = await request.post('/api/auth/login', { data: { username: 'qa_user', password: 'qa_pass' } });\nconst { token } = await loginResponse.json();");
      }

      const authedMatch = code.match(/const\s+(\w+)\s*=\s*await\s+request\.get\(['"]\/api\/portfolio\/secure['"]\s*,\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer\s*\$\{token\}`\s*\}\s*\}\s*\)/);
      const authedVar = authedMatch ? authedMatch[1] : null;
      const hasAuthedCheck = authedVar && new RegExp(`expect\\(${authedVar}\\.status\\(\\)\\)\\.toBe\\(200\\)`).test(code);
      if (authedVar && hasAuthedCheck) {
        log("✓ ขั้นตอนที่ 3: แนบ token เป็น Authorization: Bearer header ยิง GET อีกครั้งแล้วตรวจสอบ status 200 ถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง GET /api/portfolio/secure พร้อมแนบ headers: { Authorization: `Bearer ${token}` } แล้วตรวจสอบ status 200\nตัวอย่าง: const authorizedResponse = await request.get('/api/portfolio/secure', { headers: { Authorization: `Bearer ${token}` } });\nexpect(authorizedResponse.status()).toBe(200);");
      }
    },
    hint: "แยกทดสอบสองสถานการณ์ให้ชัดเจน: (1) ไม่มี token เลยต้องถูกปฏิเสธ (2) มี token ที่ได้จากการ login จริงต้องผ่านได้ — token ที่ได้จากขั้นตอน login ต้องถูกแนบไปกับ request ถัดไปผ่าน header สำหรับยืนยันตัวตนในรูปแบบ Bearer scheme ไม่ใช่ header ธรรมดา",
    solution: `import { test, expect } from '@playwright/test';

test('TC-3015: Login ดึง Token แล้วใช้ Authorization Header เข้าถึง Endpoint ที่ต้อง Auth', async ({ request }) => {
  // หมายเหตุ: /api/auth/login และ /api/portfolio/secure เป็น endpoint จำลอง (mock) เพื่อสอนแนวคิด Token-based Authentication

  // 1. ยิง GET ไปที่ /api/portfolio/secure โดยไม่แนบ Authorization header ใดๆ แล้วตรวจสอบว่า status code เป็น 401
  const unauthorizedResponse = await request.get('/api/portfolio/secure');
  expect(unauthorizedResponse.status()).toBe(401);

  // 2. ยิง POST ไปที่ /api/auth/login พร้อม data: { username: 'qa_user', password: 'qa_pass' } แล้วดึง token จาก response body
  const loginResponse = await request.post('/api/auth/login', {
    data: { username: 'qa_user', password: 'qa_pass' }
  });
  const { token } = await loginResponse.json();

  // 3. ใช้ token ที่ได้ แนบเป็น Authorization header รูปแบบ Bearer ยิง GET ไปที่ /api/portfolio/secure อีกครั้ง แล้วตรวจสอบว่า status code เป็น 200
  const authorizedResponse = await request.get('/api/portfolio/secure', {
    headers: { Authorization: \`Bearer \${token}\` }
  });
  expect(authorizedResponse.status()).toBe(200);
});`,
    theory: `ระบบจริงส่วนใหญ่ไม่ได้เปิดให้ทุก endpoint เข้าถึงได้อิสระ — ต้อง <strong>login</strong> ก่อนเพื่อแลก <strong>token</strong> (เช่น JWT หรือ session token) แล้วแนบ token นั้นไปกับทุก request ถัดไปเพื่อพิสูจน์ตัวตน รูปแบบนี้เรียกว่า <strong>Token-based Authentication</strong><br/><br/>
    รูปแบบที่พบบ่อยที่สุดคือ <strong>Bearer Token</strong>: หลัง login สำเร็จ backend จะตอบ token กลับมาใน response body แล้ว client ต้องแนบ token นั้นไปกับ header <code>Authorization</code> ในรูปแบบ <code>Bearer &lt;token&gt;</code> ในทุก request ที่ต้องการสิทธิ์เข้าถึง<br/><br/>
    การทดสอบ Authentication ที่ครบถ้วนต้องมี <strong>2 เงื่อนไขคู่กันเสมอ</strong> ไม่ใช่แค่เงื่อนไขเดียว:<br/>
    1. <strong>Negative case</strong>: request ที่ไม่มี token (หรือ token ผิด/หมดอายุ) ต้องถูกปฏิเสธด้วย <code>401 Unauthorized</code> เสมอ<br/>
    2. <strong>Positive case</strong>: request ที่มี token ถูกต้องจากการ login จริง ต้องผ่านเข้าไปทำงานได้ปกติ<br/><br/>
    การทดสอบแค่เงื่อนไขเดียว (เช่น เช็คแค่ว่า login สำเร็จ แต่ไม่เคยเช็คว่าไม่มี token แล้วโดนบล็อกจริง) คือช่องโหว่ที่ QA พลาดบ่อยที่สุดในระบบที่มี Authentication`,
    example: `// ตัวอย่าง Token-based Authentication กับ endpoint สมมติอื่น
const loginRes = await request.post('/api/auth/login', {
  data: { username: 'admin', password: 'secret' }
});
const { token } = await loginRes.json();

const profileRes = await request.get('/api/profile', {
  headers: { Authorization: \`Bearer \${token}\` }
});
expect(profileRes.status()).toBe(200);`,
    task: `จงเขียนสคริปต์ทดสอบ Authentication Flow ให้สมบูรณ์ (endpoint จำลองเพื่อฝึกแนวคิด) โดย:<br/>
    1. ยิง GET ไปที่ <code>/api/portfolio/secure</code> โดย<strong>ไม่แนบ</strong> Authorization header ใดๆ แล้วตรวจสอบว่า status code เป็น <code>401</code><br/>
    2. ยิง POST ไปที่ <code>/api/auth/login</code> พร้อม <code>data: { username: 'qa_user', password: 'qa_pass' }</code> แล้วดึง <code>token</code> จาก response body<br/>
    3. แนบ <code>token</code> ที่ได้เป็น header <code>Authorization: Bearer &lt;token&gt;</code> ยิง GET ไปที่ <code>/api/portfolio/secure</code> อีกครั้ง แล้วตรวจสอบว่า status code เป็น <code>200</code>`
  }
];

// Application state

const PREFIX = 'api';
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
    <div class="terminal-line info">[Playwright Runner] กำหนดคอมไพล์เพื่อเริ่มรัน...</div>
    <div class="terminal-line info">npx playwright test ${lesson.id}.spec.ts --project=api</div>
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
        <div class="terminal-line success">1 passed (94ms)</div>
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
        <div class="terminal-line error">1 failed (35ms)</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร API Testing Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค Status Code Assertion, Negative Testing, Auth Headers และ Schema Validation ไปทดสอบ Backend API จริงในโปรเจค My-Investment-Port (server/index.js)!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
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
  window.QA_TRACKS['api-testing'] = { id: 'api-testing', title: 'Playwright API Testing', folder: 'API-Testing', lessons: LESSONS };
})();
