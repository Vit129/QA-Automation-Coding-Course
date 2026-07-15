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

  // Set up mobile menu toggle
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
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

  // Hide sidebar on mobile after selection
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 768) {
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
