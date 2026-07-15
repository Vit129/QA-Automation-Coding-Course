// API Testing Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/My-Investment-Port/server/index.js Express API
// and the real Playwright request-based suite at My-Investment-Port/tests/api-testing/.

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
    hint: "ใช้ const response = await request.get('/api/ta/levels?ticker=AAPL'); แล้ว expect(response.status()).toBe(200); จากนั้น const body = await response.json(); expect(body).toHaveProperty('pivot');",
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
    hint: "ยิง request.get('/api/ta/levels') เฉยๆ (ไม่มี query) แล้ว expect(response.status()).toBe(400); จากนั้นดึง body มาเช็ค expect(body.error).toBe('Ticker is required');",
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
    hint: "ใช้ request.post('/api/ai/panel', { data: {} }) เพื่อส่ง JSON body ว่าง (Playwright จะใส่ Content-Type: application/json ให้อัตโนมัติ) แล้วเช็ค status 400 และ body.error === 'panel is required'",
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
    hint: "ยิง request.post('/api/ai/portfolio-snapshot', { data: { holdings: [] } }) โดยไม่ต้องใส่ headers เลย แล้วเช็ค status 401 และ body.error === 'Unauthorized: Invalid or missing API key'",
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
    hint: "ใช้ expect(body.resistance).toHaveLength(3) และ expect(body.support).toHaveLength(3), ใช้ expect(body.ohlc).toMatchObject({ high: expect.any(Number), low: expect.any(Number), close: expect.any(Number) }) และ expect(body.updated).toMatch(/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/)",
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
    hint: "สร้างด้วย const apiContext = await playwright.request.newContext({ extraHTTPHeaders: { 'X-API-Key': 'dev-key-insecure' } }); แล้วเรียก apiContext.post(...) และปิดด้วย await apiContext.dispose();",
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
    hint: "ยิง request.get('/api/calendar/alerts') เฉยๆ แล้ว expect(response.status()).toBe(400); จากนั้น expect(body.error).toBe('tickers parameter required (comma-separated)');",
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
    hint: "ใช้ for (let i = 0; i < 101; i++) { lastResponse = await request.get('/api/ai/health'); } แล้ว expect(lastResponse.status()).toBe(429); จากนั้น const body = await lastResponse.json(); expect(body.error).toBe('Too many requests, please try again later');",
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
    &nbsp;&nbsp;message: { error: 'Too many requests, please try again later' }<br/>
    });<br/>
    app.use(limiter);</code><br/><br/>
    เมื่อ IP เดียวกันยิงเกิน <code>max</code> ภายใน <code>windowMs</code> เซิร์ฟเวอร์จะตอบกลับ status <code>429 Too Many Requests</code> พร้อม body ตาม <code>message</code> ที่กำหนดไว้ การทดสอบเคสนี้ต้องยิง request ซ้ำเกิน limit จริงแล้วยืนยันว่า request "ตัวที่เกิน" ถูกปฏิเสธด้วยรูปแบบที่ตรงกับโค้ดจริง ไม่ใช่แค่เดาว่ามันน่าจะ block`,
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
      log("🔍 ตรวจสอบ Test Isolation สำหรับ Global State...");
      const hasGet = /await\s+request\.get\(['"]\/api\/ai\/model['"]\)/.test(code);
      const hasOriginalVar = /originalModel/.test(code);
      const hasCurrentModelRead = /currentModel/.test(code);
      if (hasGet && hasOriginalVar && hasCurrentModelRead) {
        log("✓ ขั้นตอนที่ 1: อ่านค่าโมเดลเดิม (currentModel) เก็บไว้ในตัวแปร originalModel ก่อนแก้ไขถูกต้อง");
      } else {
        throw new Error("ไม่พบการยิง GET /api/ai/model เพื่อเก็บค่าเดิมไว้ในตัวแปร originalModel ก่อนแก้ไขอะไร\nตัวอย่าง: const before = await request.get('/api/ai/model');\nconst { currentModel: originalModel } = await before.json();");
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
    hint: "อ่านค่าก่อนด้วย const before = await request.get('/api/ai/model'); const { currentModel: originalModel } = await before.json(); แล้วสลับด้วย await request.post('/api/ai/model/switch', { data: { model: 'gemini-3.5-flash' } }); เช็ค status 200 แล้วคืนค่าท้ายเทสด้วย await request.post('/api/ai/model/switch', { data: { model: originalModel } });",
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
    hint: "ใช้ const response = await request.get('/api/portfolio/history?page=999&limit=20'); แล้ว expect(response.status()).toBe(200); จากนั้น const body = await response.json(); expect(body.items).toHaveLength(0);",
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
    hint: "ใช้ request.post('/api/holdings/import', { multipart: { file: { name: 'empty.csv', mimeType: 'text/csv', buffer: Buffer.from('') } } }); แล้วเช็ค status 400 และ body.error === 'CSV file is empty or invalid'",
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
    hint: "ใช้ request.post('/api/holdings/import', { multipart: { file: { name: 'malware.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('fake binary') } } }); แล้วเช็ค status 400 และ body.error === 'Only CSV files are allowed'",
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
    hint: "ใช้ request.post('/api/holdings/import', { multipart: { file: { name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) } } }); แล้วเช็ค status 413 และ body.error === 'File size exceeds 5MB limit'",
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
  const savedCode = localStorage.getItem(`api_sandbox_code_${lesson.id}`);
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
  return localStorage.getItem('api_course_completed_' + lessonId) === 'true';
}

// Mark lesson completed
function setLessonCompleted(lessonId) {
  localStorage.setItem('api_course_completed_' + lessonId, 'true');
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
  localStorage.setItem(`api_sandbox_code_${lesson.id}`, userCode);

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
        <div class="terminal-line error">ข้อผิดพลาด: ${err.message.replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed (35ms)</div>
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
      if (key && (key.startsWith('api_course_completed_') || key.startsWith('api_sandbox_code_'))) {
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร API Testing Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค Status Code Assertion, Negative Testing, Auth Headers และ Schema Validation ไปทดสอบ Backend API จริงในโปรเจค My-Investment-Port (server/index.js)!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

// Run on window boot
window.onload = initApp;
