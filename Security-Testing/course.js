// Security Testing Interactive Coding Playground Data and Logic
// Grounded in the real /Users/supavit.cho/Git/Personal/My-Investment-Port/server/index.js middleware.
// validateApiKey is attached only to /api/ai/portfolio-snapshot, /api/ai/recommend,
// /api/ai/price-history, and /api/ai/model/switch (verified by grepping server/index.js) - NOT to
// /api/ai/panel, which is unauthenticated. Auth lessons target /api/ai/recommend (really protected).
// The sensitive-data-exposure lesson deliberately targets /api/ai/panel instead: it's the one real
// inconsistency found while researching this track (/api/calendar/alerts gates error.message behind
// NODE_ENV, /api/ai/panel does not). XSS/Watchlist scenario and the missing security-headers state
// are honestly labeled where not grounded in real project code.

// Strips // line comments and /* */ block comments before pattern-matching student code, so
// wrapping the "correct" line inside a comment can't fool validate() into a false pass.
// ponytail: naive regex-based stripper - doesn't understand string literals, so a code sample
// containing a literal "//" or "/* */" inside a string would get mangled. None of the solutions
// below do that; if a future lesson needs it, swap in a real tokenizer instead of extending this.
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "Security Testing คืออะไร: มุมมองของ QA ไม่ใช่ Pentester",
    template: `// สถานการณ์: เอนด์พอยต์ /api/ai/recommend ของ My-Investment-Port ต้องใช้ API Key เสมอ
// (ดูจาก validateApiKey middleware ใน server/index.js — ผูกไว้กับ endpoint นี้จริง)
// 1. ยิง POST ไปที่ /api/ai/recommend แบบไม่ใส่ header X-API-Key เลย
// 2. ตรวจสอบว่า status code ต้องเป็น 401 (Unauthorized) ไม่ใช่ 200
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการยิง request แบบไม่มี API Key...");
      const stripped = stripComments(code);
      const hasPost = /request\.post\(['"`].*\/api\/ai\/recommend['"`]/.test(stripped);
      const has401 = /expect\(response\.status\(\)\)\.toBe\(401\)/.test(stripped);
      if (!hasPost) {
        throw new Error("ไม่พบการยิง POST ไปที่ /api/ai/recommend\nตัวอย่าง: const response = await request.post('/api/ai/recommend', { data: {} });");
      }
      if (!has401) {
        throw new Error("ไม่พบการตรวจสอบ status 401\nตัวอย่าง: expect(response.status()).toBe(401);");
      }
      log("✓ ยืนยันได้ว่า endpoint ปฏิเสธ request ที่ไม่มี API Key ถูกต้อง");
    },
    hint: "Playwright's request fixture ยิง POST ได้โดยไม่ต้องใส่ headers เลย (เท่ากับไม่มี key) ลองดูว่า method ไหนใช้ยิง POST และ method ไหนใช้อ่าน status code จาก response ที่ได้กลับมา แล้วเทียบค่าด้วย expect()",
    solution: `import { test, expect } from '@playwright/test';

test('ปฏิเสธ request ที่ไม่มี API Key', async ({ request }) => {
  const response = await request.post('/api/ai/recommend', { data: {} });
  expect(response.status()).toBe(401);
});`,
    theory: `<strong>Security Testing สำหรับ QA</strong> ไม่ใช่การเจาะระบบ (pentest) แต่คือการ<strong>ยืนยันว่ากลไกป้องกันที่ Dev เขียนไว้ทำงานจริง</strong> — เหมือนงาน Functional Testing ทั่วไป แค่มุมมองพลิกจาก "ทำสิ่งที่ถูกต้องแล้วได้ผลถูกต้องมั้ย" เป็น "ทำสิ่งที่ไม่ควรทำได้ แล้วระบบบล็อกมั้ย"<br/><br/>
    บทเรียนนี้อิงจาก middleware จริงใน <code>server/index.js</code> ของ My-Investment-Port:<br/><br/>
    <code>const validateApiKey = (req, res, next) => {<br/>
    &nbsp;&nbsp;const apiKey = req.headers['x-api-key'];<br/>
    &nbsp;&nbsp;const expectedKey = process.env.API_KEY || 'dev-key-insecure';<br/>
    &nbsp;&nbsp;if (!apiKey || apiKey !== expectedKey) {<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });<br/>
    &nbsp;&nbsp;}<br/>
    &nbsp;&nbsp;next();<br/>
    };</code><br/><br/>
    <strong>หมายเหตุความแม่นยำ:</strong> middleware นี้ไม่ได้ผูกกับทุก endpoint ของ AI Hub — ตรวจสอบโค้ดจริงแล้วมีแค่ 4 endpoint ที่ผูกไว้: <code>/api/ai/portfolio-snapshot</code>, <code>/api/ai/recommend</code> (ใช้ในบทนี้), <code>/api/ai/price-history</code>, และ <code>/api/ai/model/switch</code> — endpoint อื่นอย่าง <code>/api/ai/panel</code> ไม่มี middleware นี้เลย (จะใช้ในบท Sensitive Data Exposure ถัดไปด้วยเหตุผลอื่น)<br/><br/>
    การเขียนโค้ดนี้ไม่ได้แปลว่ามันทำงานถูกต้องเสมอไป — QA ต้องพิสูจน์ด้วยการยิง request จริงที่<strong>ตั้งใจทำผิดกติกา</strong> (ไม่ใส่ key) แล้วดูว่าระบบบล็อกจริงตามที่ออกแบบไว้หรือไม่ นี่คือหัวใจของ Security Testing ระดับ QA — บทถัดๆ ไปจะครอบคลุม Injection, XSS, Sensitive Data Exposure และ Security Headers`,
    example: `// ตัวอย่างยิงด้วย API Key ผิด (ไม่ใช่แค่ไม่มี key เลย)
const response = await request.post('/api/ai/recommend', {
  data: {},
  headers: { 'X-API-Key': 'wrong-key-12345' },
});
expect(response.status()).toBe(401);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง POST ไปที่ <code>/api/ai/recommend</code> โดยไม่ใส่ header <code>X-API-Key</code><br/>
    2. ตรวจสอบว่า status code เป็น <code>401</code>`
  },
  {
    id: "injection_awareness",
    meta: "บทที่ 1",
    title: "Injection Awareness: ยิง Input แปลกๆ แล้วดูว่า Error Message ยังปลอดภัยอยู่มั้ย",
    template: `// สถานการณ์จริง (ยืนยันจากโค้ด server/index.js): /api/ta/levels ยิงต่อไปที่ Yahoo Finance API จริง
// ถ้า ticker ผิดปกติ (injection-like string) endpoint จะ error และตอบกลับ 500 จริง (ควบคุมไว้แล้ว)
// สิ่งที่ต้องพิสูจน์ไม่ใช่ "ห้าม 500" แต่คือ "500 ต้องไม่หลุดรายละเอียดภายในออกมา"
// 1. ยิง GET ไปที่ /api/ta/levels พร้อม ticker เป็น string แปลกปลอม "AAPL'; DROP TABLE users;--"
// 2. ตรวจสอบว่า body.error ต้องเป็นข้อความทั่วไปที่ปลอดภัย ไม่ใช่ raw error/stack trace
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทดสอบด้วย Injection-like Input...");
      const stripped = stripComments(code);
      const hasInjectionString = /DROP TABLE|--|;--/.test(stripped);
      const hasErrorRead = /body\.error/.test(stripped);
      const hasSafeCheck = /not\.toMatch\(.*(?:at Object|stack|axios|ENOENT)/.test(stripped) ||
                            /toBe\(['"]Failed to calculate levels['"]\)/.test(stripped);
      if (!hasInjectionString) {
        throw new Error("ไม่พบการทดสอบด้วย input แบบ injection-like\nตัวอย่าง: ticker=AAPL'; DROP TABLE users;--");
      }
      if (!hasErrorRead) {
        throw new Error("ไม่พบการอ่านค่า body.error จาก response");
      }
      if (!hasSafeCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า error message ปลอดภัย (ไม่หลุด stack trace) หรือเป็นข้อความควบคุมที่คาดไว้\nตัวอย่าง: expect(body.error).toBe('Failed to calculate levels'); หรือ expect(body.error).not.toMatch(/at Object|stack/);");
      }
      log("✓ ยืนยันได้ว่า error message ยังปลอดภัยแม้ยิง input แปลกปลอมเข้าไป");
    },
    hint: "ต่อ query string ที่มีอักขระ injection-like เข้าไปใน URL ตรงๆ ได้เลยตอนยิง GET จากนั้นแปลง response เป็น JSON แล้วดูใน theory ว่า server ควบคุมข้อความ error ที่ส่งกลับมาให้เป็นค่าคงที่อะไร",
    solution: `import { test, expect } from '@playwright/test';

test('error message ยังปลอดภัยแม้ยิง input แบบ injection-like', async ({ request }) => {
  const response = await request.get("/api/ta/levels?ticker=AAPL'; DROP TABLE users;--");
  const body = await response.json();
  expect(body.error).toBe('Failed to calculate levels');
});`,
    theory: `<strong>Injection Testing</strong> ในมุมมอง QA ไม่ใช่การพยายามเจาะระบบจริง (นั่นคือหน้าที่ pentester) แต่คือการ<strong>ยิง input ที่ผิดปกติ/เป็นอันตราย</strong>แล้วยืนยันว่าระบบ<strong>จัดการมันอย่างมีสติ</strong><br/><br/>
    <strong>ความจริงที่ตรงไปตรงมา (แก้จากเวอร์ชันก่อนหน้าของบทนี้):</strong> ตรวจสอบโค้ดจริงของ <code>/api/ta/levels</code> แล้วพบว่า endpoint นี้ยิงต่อไปที่ Yahoo Finance API จริง (<code>axios.get</code>) — ticker ที่ผิดปกติ (รวมถึง injection-like string) ทำให้เกิด error ภายใน แล้ว handler จะ<strong>ตอบกลับ 500 จริง</strong> เสมอ (ไม่ใช่ "ไม่มีวัน 500" ตามที่บทเรียนเวอร์ชันก่อนอ้างผิดไป):<br/><br/>
    <code>} catch (error) {<br/>
    &nbsp;&nbsp;console.error(\`[TA] Error for \${ticker}:\`, error.message);<br/>
    &nbsp;&nbsp;res.status(500).json({ error: 'Failed to calculate levels' });<br/>
    }</code><br/><br/>
    สิ่งที่ QA ต้องพิสูจน์จึงไม่ใช่ "ห้ามมี 500" แต่คือ <strong>"500 ที่เกิดขึ้นต้องเป็น 500 ที่ควบคุมไว้แล้ว"</strong> — <code>error.message</code> จริง (ที่อาจมีรายละเอียดจาก Yahoo API หรือ axios) ถูก <code>console.error</code> ไว้ฝั่ง server เท่านั้น ไม่เคยส่งกลับมาให้ client เห็นเลย ผู้ใช้เห็นแค่ข้อความทั่วไปที่ปลอดภัย <code>'Failed to calculate levels'</code> เสมอ — นี่คือ pattern เดียวกับที่บท Sensitive Data Exposure จะพูดถึงต่อไป`,
    example: `// ตัวอย่างยิง input แปลกแบบอื่น (script tag) แล้วเช็คแบบเดียวกัน
const response2 = await request.get('/api/ta/levels?ticker=<script>alert(1)</script>');
const body2 = await response2.json();
expect(body2.error).not.toMatch(/at Object|stack|axios/);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง GET ไปที่ <code>/api/ta/levels</code> พร้อม <code>ticker</code> เป็น injection-like string<br/>
    2. ตรวจสอบว่า <code>body.error</code> เป็นข้อความควบคุมที่ปลอดภัย (<code>'Failed to calculate levels'</code>) ไม่ใช่ raw error`
  },
  {
    id: "xss_input_sanitization",
    meta: "บทที่ 2",
    title: "XSS Prevention: ข้อความที่ผู้ใช้พิมพ์ต้องไม่ถูกรันเป็นโค้ด",
    template: `// สถานการณ์: ช่อง note ของ Watchlist ให้ผู้ใช้พิมพ์ข้อความอิสระ
// 1. พิมพ์ข้อความ note เป็น '<script>window.__xss = true</script>' ลงในช่อง
// 2. ตรวจสอบว่าตัวแปร window.__xss ไม่ถูกตั้งค่า (สคริปต์ไม่ถูกรันจริง)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทดสอบ XSS Prevention...");
      const stripped = stripComments(code);
      const hasScriptPayload = /<script>window\.__xss/.test(stripped);
      const hasEvaluateCheck = /page\.evaluate\(\(\)\s*=>\s*window\.__xss\)/.test(stripped);
      const hasFalsyCheck = /toBeFalsy|toBeUndefined|not\.toBe\(true\)/.test(stripped);
      if (!hasScriptPayload) {
        throw new Error("ไม่พบการกรอกข้อความที่มี <script>window.__xss = true</script>");
      }
      if (!hasEvaluateCheck) {
        throw new Error("ไม่พบการเช็คค่า window.__xss ผ่าน page.evaluate()\nตัวอย่าง: const xssRan = await page.evaluate(() => window.__xss);");
      }
      if (!hasFalsyCheck) {
        throw new Error("ไม่พบการตรวจสอบว่าค่าที่ได้เป็น falsy (สคริปต์ไม่ถูกรัน)\nตัวอย่าง: expect(xssRan).toBeFalsy();");
      }
      log("✓ ยืนยันได้ว่าข้อความไม่ถูกรันเป็นโค้ดจริง (ป้องกัน XSS)");
    },
    hint: "กรอกข้อความผ่าน locator ปกติ (fill แล้ว click เพื่อบันทึก) จากนั้นใช้ page.evaluate() เพื่ออ่านค่าตัวแปร global ฝั่ง browser ที่ payload พยายามตั้งค่า — ถ้าอ่านได้เป็นค่า falsy แปลว่าสคริปต์ไม่ถูกรันจริง",
    solution: `import { test, expect } from '@playwright/test';

test('ป้องกัน XSS: ข้อความที่พิมพ์ไม่ถูกรันเป็นโค้ด', async ({ page }) => {
  await page.goto('/watchlist');
  await page.getByTestId('watchlist-note-input').fill('<script>window.__xss = true</script>');
  await page.getByTestId('watchlist-save-btn').click();

  const xssRan = await page.evaluate(() => window.__xss);
  expect(xssRan).toBeFalsy();
});`,
    theory: `<strong>XSS (Cross-Site Scripting)</strong> คือช่องโหว่ที่ข้อความซึ่งควรเป็นแค่ "ข้อมูล" (เช่นชื่อ, note, comment) ถูก<strong>ตีความและรันเป็นโค้ดจริง</strong>เมื่อแสดงผลบนหน้าเว็บ — ถ้าผู้ใช้พิมพ์ <code>&lt;script&gt;...&lt;/script&gt;</code> แล้วระบบเอาไปแสดงผลตรงๆ โดยไม่ escape ตัวอักษรพิเศษ สคริปต์นั้นจะถูกรันจริงในเบราว์เซอร์ของผู้ใช้คนอื่นที่มาดูข้อมูลเดียวกัน<br/><br/>
    React (ที่ My-Investment-Port ใช้) <strong>ป้องกัน XSS ให้อัตโนมัติ</strong>ในกรณีส่วนใหญ่ — การ render <code>{note}</code> ธรรมดาจะ escape HTML tag ให้เองเสมอ ยกเว้นกรณีที่ dev จงใจใช้ <code>dangerouslySetInnerHTML</code> (ชื่อ prop บอกตรงๆ ว่าอันตราย) ซึ่งข้าม auto-escape ไปโดยสิ้นเชิง<br/><br/>
    วิธีทดสอบ: กรอกข้อความที่มี <code>&lt;script&gt;</code> tag ตั้งค่าตัวแปร global แปลกๆ (เช่น <code>window.__xss = true</code>) ที่ปกติไม่มีในหน้าเว็บ แล้วเช็คด้วย <code>page.evaluate()</code> ว่าตัวแปรนั้นถูกตั้งค่าจริงหรือไม่ — ถ้า<strong>ไม่ถูกตั้งค่า</strong> แปลว่าสคริปต์ไม่ถูกรัน (ป้องกันสำเร็จ) หมายเหตุ: <code>watchlist-note-input</code>/<code>watchlist-save-btn</code>/<code>/watchlist</code> ในเทมเพลตนี้เป็นตัวอย่างสมมติ (My-Investment-Port ไม่มีหน้า Watchlist จริงแบบนี้) ใช้สอนเทคนิคการทดสอบ ไม่ได้อิงโค้ดจริง`,
    example: `// ตัวอย่างเช็ค DOM ว่า tag ไม่ถูกแปลงเป็น element จริง (อีกวิธียืนยัน)
const scriptTagCount = await page.locator('script:has-text("window.__xss")').count();
expect(scriptTagCount).toBe(0);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. กรอกข้อความ <code>&lt;script&gt;window.__xss = true&lt;/script&gt;</code> ในช่อง note<br/>
    2. ตรวจสอบด้วย <code>page.evaluate()</code> ว่า <code>window.__xss</code> เป็นค่า falsy (สคริปต์ไม่ถูกรันจริง)`
  },
  {
    id: "auth_bypass",
    meta: "บทที่ 3",
    title: "Auth Bypass: ลองสวมรอยด้วย Key ปลอม ไม่ใช่แค่ไม่มี Key",
    template: `// สถานการณ์: validateApiKey middleware เช็ค header X-API-Key เทียบกับค่าที่ตั้งไว้จริง
// 1. ยิง POST ไปที่ /api/ai/recommend พร้อม header X-API-Key เป็นค่าผิด "wrong-key-12345"
// 2. ตรวจสอบว่า status code เป็น 401 และ error message ต้องมีคำว่า "Unauthorized"
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทดสอบด้วย API Key ปลอม...");
      const stripped = stripComments(code);
      const hasWrongKey = /X-API-Key['"]?\s*:\s*['"]wrong-key/.test(stripped);
      const has401 = /expect\(response\.status\(\)\)\.toBe\(401\)/.test(stripped);
      const hasMessageCheck = /Unauthorized/.test(stripped) && /body\.error|toContain/.test(stripped);
      if (!hasWrongKey) {
        throw new Error("ไม่พบการยิง request พร้อม header X-API-Key เป็นค่าผิด\nตัวอย่าง: headers: { 'X-API-Key': 'wrong-key-12345' }");
      }
      if (!has401) {
        throw new Error("ไม่พบการตรวจสอบ status 401");
      }
      if (!hasMessageCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า error message มีคำว่า 'Unauthorized'\nตัวอย่าง: expect(body.error).toContain('Unauthorized');");
      }
      log("✓ ยืนยันได้ว่า API Key ปลอมถูกปฏิเสธพร้อม error message ที่ถูกต้อง");
    },
    hint: "คล้ายบทนำ แต่คราวนี้ใส่ header ที่มีค่าผิดแทนการไม่ใส่เลย แล้วอย่าตรวจแค่ status code เฉยๆ — ต้องอ่าน body เป็น JSON ด้วยแล้วตรวจสอบว่าข้อความ error สื่อถึงเหตุผลการถูกปฏิเสธด้วย",
    solution: `import { test, expect } from '@playwright/test';

test('ปฏิเสธ API Key ปลอม พร้อม error message ที่ถูกต้อง', async ({ request }) => {
  const response = await request.post('/api/ai/recommend', {
    data: {},
    headers: { 'X-API-Key': 'wrong-key-12345' },
  });
  expect(response.status()).toBe(401);

  const body = await response.json();
  expect(body.error).toContain('Unauthorized');
});`,
    theory: `บทนำเคยทดสอบแค่ "ไม่ใส่ Key เลย" — บทนี้ต่อยอดให้ครอบคลุมมากขึ้น: ทดสอบ<strong>ใส่ Key ที่ผิด</strong>ด้วย (ไม่ใช่แค่ไม่มี) เพราะเป็นกรณีที่พบบ่อยกว่าในการโจมตีจริง (ผู้โจมตีมักลองเดา/สุ่ม key มากกว่าไม่ใส่อะไรเลย) middleware จริงต้องครอบคลุมทั้งสองเงื่อนไข:<br/><br/>
    <code>if (!apiKey || apiKey !== expectedKey) {<br/>
    &nbsp;&nbsp;return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });<br/>
    }</code><br/><br/>
    สังเกตเงื่อนไข <code>!apiKey || apiKey !== expectedKey</code> — OR สองเงื่อนไข ครอบคลุมทั้ง "ไม่มี key" และ "มี key แต่ผิด" การทดสอบที่ครอบคลุมจริงต้องพิสูจน์<strong>ทั้งสองฝั่งของเงื่อนไข</strong> ไม่ใช่แค่ฝั่งเดียว — บั๊กจริงที่พบบ่อย: Dev เขียนเช็คแค่ <code>!apiKey</code> (ลืม <code>!==</code>) ทำให้ key ผิดอะไรก็ผ่านได้หมด ถ้า QA ทดสอบแค่ "ไม่ใส่ key" จะไม่มีทางเจอบั๊กแบบนี้เลย<br/><br/>
    การตรวจสอบ error message (<code>'Unauthorized'</code>) เพิ่มเติมจาก status code อย่างเดียว ช่วยยืนยันว่าระบบปฏิเสธด้วยเหตุผลที่ถูกต้องจริง ไม่ใช่ 401 ที่มาจากสาเหตุอื่นโดยบังเอิญ`,
    example: `// ตัวอย่างทดสอบ Key ที่ถูกต้องควรผ่านได้ปกติ (positive case คู่กัน)
const response2 = await request.post('/api/ai/recommend', {
  data: { snapshot: {} },
  headers: { 'X-API-Key': process.env.TEST_API_KEY },
});
expect(response2.status()).not.toBe(401);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง POST ไปที่ <code>/api/ai/recommend</code> พร้อม header <code>X-API-Key: 'wrong-key-12345'</code><br/>
    2. ตรวจสอบว่า status เป็น <code>401</code> และ <code>body.error</code> ต้อง <code>toContain('Unauthorized')</code>`
  },
  {
    id: "sensitive_data_exposure",
    meta: "บทที่ 4",
    title: "Sensitive Data Exposure: Error Response ไม่ควรหลุดรายละเอียดภายใน",
    template: `// สถานการณ์: เอนด์พอยต์ /api/ai/panel ของ My-Investment-Port จริงๆ ตอบ error กลับมาแบบนี้เสมอ:
//   res.status(500).json({ error: error.message || 'AI panel analysis failed' });
// (ไม่เช็ค NODE_ENV เลย ต่างจาก /api/calendar/alerts ที่ gate ด้วย isDev ก่อนค่อยส่ง error.message จริง)
// 1. ยิง request ที่ทำให้เกิด error แล้วตรวจสอบว่า error message ไม่มีคำที่บ่งบอกรายละเอียดภายใน
//    เช่น "at Object" (stack trace), "ENOENT", "ECONNREFUSED" (system-level error)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเช็ค Sensitive Data ใน error response...");
      const stripped = stripComments(code);
      const hasErrorCheck = /body\.error/.test(stripped);
      const hasLeakPatternCheck = /not\.toMatch|not\.toContain/.test(stripped) &&
                                  (/at Object|ENOENT|ECONNREFUSED|stack/.test(stripped));
      if (!hasErrorCheck) {
        throw new Error("ไม่พบการอ่านค่า body.error จาก response");
      }
      if (!hasLeakPatternCheck) {
        throw new Error("ไม่พบการตรวจสอบว่า error message ไม่มี pattern ที่บ่งบอกรายละเอียดภายใน (stack trace/system error)\nตัวอย่าง: expect(body.error).not.toMatch(/at Object|ENOENT|ECONNREFUSED/);");
      }
      log("✓ ยืนยันได้ว่า error message ไม่หลุดรายละเอียดภายในของระบบ");
    },
    hint: "อ่าน body.error แล้วนึกถึงว่า pattern แบบไหนที่บ่งบอกว่าเป็น stack trace หรือ system-level error (ไม่ใช่ข้อความควบคุมปกติ) จากนั้นใช้ assertion ฝั่ง negative (not...) เพื่อยืนยันว่า pattern เหล่านั้นไม่ปรากฏ",
    solution: `import { test, expect } from '@playwright/test';

test('error response ไม่หลุดรายละเอียดภายในของระบบ', async ({ request }) => {
  const response = await request.post('/api/ai/panel', { data: { panel: null } });
  const body = await response.json();

  expect(body.error).not.toMatch(/at Object|ENOENT|ECONNREFUSED/);
});`,
    theory: `<strong>Sensitive Data Exposure</strong> ไม่ได้หมายถึงแค่รหัสผ่าน/token หลุดเท่านั้น — <strong>stack trace, path ของไฟล์บนเครื่อง server, ชื่อ library ภายใน, error ระดับระบบปฏิบัติการ</strong> (เช่น <code>ENOENT</code> = file not found, <code>ECONNREFUSED</code> = connection refused) ล้วนเป็นข้อมูลที่ไม่ควรหลุดออกไปให้ผู้ใช้ทั่วไปเห็น เพราะช่วยให้ผู้โจมตี "เห็นภาพ" โครงสร้างภายในของระบบเพื่อวางแผนโจมตีต่อ<br/><br/>
    <strong>สิ่งที่พบจริงในโค้ด <code>server/index.js</code> ของ My-Investment-Port (อ่านโค้ดจริงตอนเตรียมบทเรียนนี้):</strong> เอนด์พอยต์ <code>/api/calendar/alerts</code> เขียนถูกต้อง — เช็ค <code>NODE_ENV</code> ก่อนตัดสินใจว่าจะส่ง <code>error.message</code> จริงหรือข้อความทั่วไป:<br/><br/>
    <code>const isDev = process.env.NODE_ENV === 'development';<br/>
    res.status(500).json({ error: isDev ? error.message : 'Failed to fetch calendar alerts' });</code><br/><br/>
    แต่เอนด์พอยต์ <code>/api/ai/panel</code> ที่อยู่ถัดไปในไฟล์เดียวกัน<strong>ไม่ได้ gate แบบเดียวกัน</strong> — ส่ง <code>error.message</code> ดิบๆ กลับไปเสมอไม่ว่า environment ไหน: <code>res.status(500).json({ error: error.message || 'AI panel analysis failed' })</code> นี่คือความไม่สอดคล้องกันจริงที่มีอยู่ในโค้ดปัจจุบัน — เป็นตัวอย่างจริงว่าทำไม QA ต้องทดสอบทุกเอนด์พอยต์แยกกัน ไม่ใช่เห็นเอนด์พอยต์หนึ่งทำถูกแล้วสรุปว่าที่เหลือทำถูกเหมือนกันหมด`,
    example: `// ตัวอย่างเช็คว่า response ไม่มี field ที่ไม่ควรหลุด (เช่น internal userId, dbConnectionString)
const forbiddenFields = ['dbConnectionString', 'internalUserId', 'apiSecret'];
for (const field of forbiddenFields) {
  expect(body).not.toHaveProperty(field);
}`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง request ที่ทำให้เกิด error<br/>
    2. ตรวจสอบว่า <code>body.error</code> ไม่มี pattern ที่บ่งบอกรายละเอียดภายใน (<code>at Object</code>, <code>ENOENT</code>, <code>ECONNREFUSED</code>)`
  },
  {
    id: "security_headers",
    meta: "บทที่ 5",
    title: "Security Headers: ตรวจสอบเกราะป้องกันระดับ HTTP Response",
    template: `// สถานการณ์: server/index.js จริงของ My-Investment-Port ไม่ได้ตั้งค่า security header เพิ่มเติม
// (ไม่มี helmet middleware หรือ header พวก X-Content-Type-Options เลย)
// 1. ยิง GET ไปที่ /api/ai/health แล้วอ่าน response headers
// 2. เขียน assertion จริงว่า header 'x-content-type-options' ต้องมีค่าเป็น 'nosniff'
//    หมายเหตุ: ถ้ารันจริงตอนนี้ test นี้จะ FAIL เพราะระบบยังไม่ได้ตั้งค่า header นี้เลย —
//    นั่นคือผลลัพธ์ที่ถูกต้องของบทนี้ assertion ต้องยืนยันสถานะที่ "ควรจะเป็น" แล้วปล่อยให้แดง
//    เพื่อรายงาน gap จริงกลับไปให้ทีม Dev ไม่ใช่เขียน test ที่ผ่านเสมอโดยไม่ตรวจสอบอะไรจริง
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเขียน assertion จริงสำหรับ Security Headers...");
      const stripped = stripComments(code);
      const hasHeadersRead = /response\.headers\(\)/.test(stripped);
      const hasRealAssertion = /expect\(\s*headers\[['"]x-content-type-options['"]\]\s*\)\.toBe\(['"]nosniff['"]\)/.test(stripped);
      if (!hasHeadersRead) {
        throw new Error("ไม่พบการอ่าน response.headers()\nตัวอย่าง: const headers = response.headers();");
      }
      if (!hasRealAssertion) {
        throw new Error("ไม่พบการ assert ค่าจริงของ header 'x-content-type-options' — แค่ log ออกมาดูไม่นับ ต้องมี expect() ที่ยืนยันค่าที่คาดหวังจริง\nตัวอย่าง: expect(headers['x-content-type-options']).toBe('nosniff');");
      }
      log("✓ ยืนยันได้ด้วย assertion จริงว่า header ถูกตรวจสอบตามที่คาดหวัง (ไม่ใช่แค่รายงานสถานะเฉยๆ)");
    },
    hint: "อ่าน headers จาก response.headers() แล้วดูใน theory ว่า header ที่ปลอดภัยควรมีค่าอะไร จากนั้นเขียน assertion ที่ยืนยันค่านั้นตรงๆ แทนการแค่ log ออกมาดูเฉยๆ — ใช่ ต่อให้รู้ว่ามันจะ fail ก็ต้องเขียนให้ fail จริง",
    solution: `import { test, expect } from '@playwright/test';

test('ตรวจสอบ Security Header x-content-type-options', async ({ request }) => {
  const response = await request.get('/api/ai/health');
  const headers = response.headers();

  expect(headers['x-content-type-options']).toBe('nosniff');
});`,
    theory: `<strong>Security Headers</strong> คือ HTTP response header พิเศษที่บอกเบราว์เซอร์ให้เปิดใช้กลไกป้องกันเพิ่มเติม เช่น:<br/><br/>
    • <code>X-Content-Type-Options: nosniff</code> — ห้ามเบราว์เซอร์เดา MIME type เอง (ป้องกันไฟล์ที่แอบอ้างเป็นชนิดอื่น)<br/>
    • <code>X-Frame-Options: DENY</code> — ห้ามเว็บถูกฝังใน <code>&lt;iframe&gt;</code> ของเว็บอื่น (ป้องกัน Clickjacking)<br/>
    • <code>Content-Security-Policy</code> — จำกัดว่าสคริปต์/ทรัพยากรใดโหลดได้จากที่ไหนบ้าง (ป้องกัน XSS อีกชั้น)<br/><br/>
    <strong>ความจริงที่ตรงไปตรงมา:</strong> ตรวจสอบโค้ด <code>server/index.js</code> ของ My-Investment-Port จริงแล้ว<strong>ไม่พบ</strong> middleware อย่าง <code>helmet</code> หรือการตั้งค่า header เหล่านี้เลย — โปรเจกนี้มี CORS whitelist + API Key + Rate Limiter (ที่เจอในบทก่อนหน้า) แต่ยังไม่มี security header ชั้นนี้<br/><br/>
    <strong>ทำไมบทนี้ถึงบังคับให้เขียน assertion จริง ทั้งที่รู้อยู่แล้วว่ามันจะ fail:</strong> เวอร์ชันก่อนหน้าของบทเรียนนี้สอนให้แค่ <code>console.log</code> ค่า header ออกมาดูโดยไม่ assert อะไรเลย — นั่นคือ test ที่ "เขียนแล้วผ่านเสมอ" ไม่ว่าระบบจะปลอดภัยหรือไม่ ซึ่งเป็นนิสัยที่อันตรายมากสำหรับ QA เพราะทำให้ทีมเข้าใจผิดว่า "มี test ครอบคลุมแล้ว" ทั้งที่ test นั้นไม่เคยตรวจสอบอะไรจริงสักครั้ง<br/><br/>
    แนวทางที่ถูกต้องคือ<strong>ยืนยันสถานะที่ควรจะเป็น</strong> (header ต้องมีค่า <code>nosniff</code>) แล้วปล่อยให้ test รันแล้ว<strong>แดง (fail)</strong> ถ้าความจริงยังไม่ตรงตามที่ควรจะเป็น — test ที่ fail แบบมีเหตุผลชัดเจนคือหลักฐานที่มีประโยชน์กว่า test ที่ผ่านเสมอโดยไม่ตรวจสอบอะไร เพราะมันสื่อสารช่องว่างด้าน security กลับไปให้ทีม Dev เห็นเป็นรูปธรรม (เช่น แนะนำให้ติดตั้ง <code>helmet</code> npm package) แทนที่จะซ่อนปัญหาไว้เบื้องหลัง test สีเขียวปลอมๆ`,
    example: `// อีกตัวอย่าง: assert header ป้องกัน Clickjacking ด้วยแนวคิดเดียวกัน
expect(headers['x-frame-options']).toBe('DENY');`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง GET ไปที่ <code>/api/ai/health</code> แล้วอ่าน <code>response.headers()</code><br/>
    2. เขียน assertion จริงว่า <code>headers['x-content-type-options']</code> ต้องเท่ากับ <code>'nosniff'</code> (ห้ามแค่ log ออกมาดู) — ถ้ารันจริงตอนนี้ test จะ fail เพราะระบบยังไม่ได้ตั้งค่า header นี้ นั่นคือผลลัพธ์ที่ถูกต้องของบทเรียนนี้`
  },
  {
    id: "advanced_stack_trace_leak",
    meta: "ขั้นสูง 1",
    title: "ขั้นสูง 1: Stack Trace ต้องไม่หลุดออกมาใน Error Response",
    template: `// สถานการณ์ (สมมติ เพื่อฝึกเทคนิค ไม่ใช่ endpoint จริงใน My-Investment-Port เหมือนบทอื่นๆ):
// มี endpoint ใหม่ /api/reports/generate ที่ error handling ยังไม่รัดกุมพอ
// เมื่อเกิด error ภายใน (เช่น อ่านไฟล์รายงานไม่สำเร็จ) endpoint นี้อาจหลุด stack trace เต็มรูปแบบ
// ออกมาใน body.error — stack trace ของ Node.js มีรูปแบบตายตัวคือ
//   "at functionName (/absolute/path/to/file.js:12:34)"
// ซึ่งเผยทั้ง path ไฟล์จริงบนเครื่อง server และเลขบรรทัด/คอลัมน์ที่ error เกิดขึ้น
// บทที่ 4 (Sensitive Data Exposure) เช็คแค่คำเฉพาะ (เช่น "ENOENT") บทนี้ต้องคิดกว้างกว่านั้น:
// ต้องจับ "รูปแบบ" ของ stack trace ทั้งเส้น ไม่ใช่แค่คำใดคำหนึ่ง
// 1. ยิง request ที่ทำให้เกิด error ที่ /api/reports/generate
// 2. เขียน assertion จริงว่า body.error ต้อง "ไม่" ตรงกับรูปแบบ stack trace แบบนี้
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการทดสอบ Stack Trace Leak (ขั้นสูง)...");
      const stripped = stripComments(code);
      const hasRequest = /request\.(get|post)\(['"`].*\/api\/reports\/generate['"`]/.test(stripped);
      const hasBodyRead = /body\.error/.test(stripped);
      const hasNegativeAssertion = /expect\(\s*body\.error\s*\)\.not\.(toMatch|toContain)\(/.test(stripped);
      const hasLineColPattern = /:\\d\+.*:\\d\+/.test(stripped);
      if (!hasRequest) {
        throw new Error("ไม่พบการยิง request ไปที่ /api/reports/generate\nตัวอย่าง: const response = await request.post('/api/reports/generate', { data: { reportId: 'invalid' } });");
      }
      if (!hasBodyRead) {
        throw new Error("ไม่พบการอ่านค่า body.error จาก response");
      }
      if (!hasNegativeAssertion) {
        throw new Error("ไม่พบ negative assertion บน body.error\nตัวอย่าง: expect(body.error).not.toMatch(...);");
      }
      if (!hasLineColPattern) {
        throw new Error("assertion ที่มีต้องจับรูปแบบ 'path:เลขบรรทัด:เลขคอลัมน์' ของ stack trace จริงๆ ไม่ใช่แค่คำเฉพาะคำเดียว\nตัวอย่าง: expect(body.error).not.toMatch(/at .*\\(.*:\\d+:\\d+\\)/);");
      }
      log("✓ ยืนยันได้ว่า error message ไม่หลุด stack trace ที่มี path และเลขบรรทัดจริง");
    },
    hint: "Node.js stack trace มีรูปแบบตายตัวคือ 'at <function> (<path>:<บรรทัด>:<คอลัมน์>)' ลองคิดว่าจะเขียน pattern อย่างไรให้จับได้ทั้งส่วน path และตัวเลขสองชุดที่คั่นด้วย colon ท้ายบรรทัด แล้วใช้ negative assertion ยืนยันว่า body.error ไม่ตรงกับ pattern นั้น",
    solution: `import { test, expect } from '@playwright/test';

test('error response ไม่หลุด stack trace ที่มี path และเลขบรรทัด', async ({ request }) => {
  const response = await request.post('/api/reports/generate', { data: { reportId: 'invalid' } });
  const body = await response.json();

  expect(body.error).not.toMatch(/at .*\\(.*:\\d+:\\d+\\)/);
});`,
    theory: `บทที่ 4 (Sensitive Data Exposure) สอนให้เช็คคำเฉพาะที่บ่งบอกรายละเอียดภายใน เช่น <code>ENOENT</code>, <code>ECONNREFUSED</code>, <code>at Object</code> — วิธีนั้นใช้ได้ดีเมื่อรู้ล่วงหน้าว่าคำเหล่านั้นจะปรากฏ แต่ stack trace จริงมีรูปแบบที่หลากหลายกว่านั้นมาก (ชื่อฟังก์ชัน, ชื่อไฟล์, เลขบรรทัดที่เปลี่ยนไปเรื่อยๆ)<br/><br/>
    สิ่งที่<strong>คงที่เสมอ</strong>ในทุก stack trace ของ Node.js/V8 คือรูปแบบโครงสร้าง: <code>at &lt;function or &lt;anonymous&gt;&gt; (&lt;absolute path&gt;:&lt;line&gt;:&lt;column&gt;)</code> — path ตามด้วยเลขบรรทัดและเลขคอลัมน์ คั่นด้วย colon เสมอ นี่คือ "ลายเซ็น" ของ stack trace ที่ QA ระดับสูงควรจับด้วย pattern มากกว่าคำใดคำหนึ่ง เพราะครอบคลุมทุกกรณีของ error ภายในที่หลุดออกมาโดยไม่ต้องรู้ล่วงหน้าว่า error message จะเขียนว่าอะไร<br/><br/>
    <em>หมายเหตุ: <code>/api/reports/generate</code> เป็น endpoint สมมติสำหรับฝึกเทคนิคนี้ ไม่ใช่ endpoint จริงใน My-Investment-Port</em>`,
    example: `// อีกวิธีตรวจสอบแบบใกล้เคียงกัน: เช็คว่า response body ทั้งก้อนไม่มี field ชื่อ stack เปิดเผยตรงๆ เลย
expect(body).not.toHaveProperty('stack');`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง request ที่ทำให้เกิด error ที่ <code>/api/reports/generate</code><br/>
    2. เขียน negative assertion ว่า <code>body.error</code> ต้อง "ไม่" ตรงกับ pattern ของ stack trace ที่มีรูปแบบ <code>path:เลขบรรทัด:เลขคอลัมน์</code> (เช่น <code>/at .*\\(.*:\\d+:\\d+\\)/</code>) — การเช็คแค่คำใดคำหนึ่งไม่พอสำหรับบทนี้`
  },
  {
    id: "advanced_auth_coverage",
    meta: "ขั้นสูง 2",
    title: "ขั้นสูง 2: Auth Middleware ต้องถูกบังคับใช้ครบทุก Endpoint ที่ควรป้องกัน",
    template: `// สถานการณ์ขั้นสูง: บทนำและบทที่ 3 ทดสอบไปแล้วว่า /api/ai/recommend ปฏิเสธ request
// ที่ไม่มี/มี API Key ผิด — แต่ validateApiKey middleware จริงผูกไว้กับทั้งหมด 4 endpoint
// (ดู comment บนสุดของไฟล์นี้): portfolio-snapshot, recommend, price-history, model/switch
// การทดสอบแค่ endpoint เดียวไม่พิสูจน์ว่า middleware ถูกผูกไว้ถูกต้องกับ endpoint ที่เหลือด้วย
// (บั๊กจริงที่พบบ่อย: เพิ่ม endpoint ใหม่แล้วลืมผูก middleware ป้องกันไว้)
// 1. ยิง POST ไปยัง endpoint ที่เหลืออีก 3 ตัว (portfolio-snapshot, price-history, model/switch)
//    แบบไม่ใส่ API Key
// 2. เขียน assertion จริงว่าทุก endpoint ต้องตอบกลับ 401 ไม่มีข้อยกเว้น
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบความครอบคลุมของการทดสอบ Auth ในทุก endpoint ที่ควรป้องกัน...");
      const stripped = stripComments(code);
      const requiredEndpoints = ['/api/ai/portfolio-snapshot', '/api/ai/price-history', '/api/ai/model/switch'];
      const missingEndpoints = requiredEndpoints.filter((ep) => !stripped.includes(ep));
      const has401Assertion = /expect\(response\.status\(\)\)\.toBe\(401\)/.test(stripped);
      if (missingEndpoints.length > 0) {
        throw new Error(`ยังไม่ได้ทดสอบ endpoint ที่ต้องมี API Key ครบทั้งหมด — ขาด: ${missingEndpoints.join(', ')}`);
      }
      if (!has401Assertion) {
        throw new Error("ไม่พบการตรวจสอบ status 401 จริง\nตัวอย่าง: expect(response.status()).toBe(401);");
      }
      log("✓ ยืนยันได้ว่า endpoint ที่ควรถูกป้องกันทั้งหมดถูกทดสอบและปฏิเสธ request ที่ไม่มี API Key จริง");
    },
    hint: "ลองนึกถึง array ของ endpoint ที่ควรถูกป้องกันทั้งหมด (ดูจาก comment บนสุดของไฟล์นี้ว่ามีอะไรบ้าง) แล้ววนลูปยิง POST แบบไม่ใส่ API Key ไปทีละตัว จากนั้นยืนยัน status code ในแต่ละรอบ",
    solution: `import { test, expect } from '@playwright/test';

const protectedEndpoints = [
  '/api/ai/portfolio-snapshot',
  '/api/ai/price-history',
  '/api/ai/model/switch',
];

test('endpoint ที่ต้องมี API Key ทั้งหมดปฏิเสธ request ที่ไม่มี key', async ({ request }) => {
  for (const endpoint of protectedEndpoints) {
    const response = await request.post(endpoint, { data: {} });
    expect(response.status()).toBe(401);
  }
});`,
    theory: `บทนำและบทที่ 3 พิสูจน์แล้วว่า <code>/api/ai/recommend</code> ปฏิเสธ request ที่ไม่มี/มี API Key ผิดจริง — แต่นั่นพิสูจน์แค่ endpoint เดียว การสรุปว่า "middleware ทำงานถูกต้อง" จาก endpoint เดียวเป็นการสรุปที่เร็วเกินไป เพราะ middleware ใน Express ต้องถูก<strong>ผูก (attach) แยกทีละ route</strong> — การลืมผูก middleware กับ route ใหม่ที่เพิ่มเข้ามาทีหลังเป็นบั๊กที่พบได้จริงบ่อยมาก และจะไม่ถูกจับได้เลยถ้า QA ทดสอบซ้ำแค่ endpoint เดิมที่รู้อยู่แล้วว่าทำงานถูก<br/><br/>
    <strong>ความครอบคลุม (coverage) คือหัวใจของบทนี้:</strong> ต้องยืนยันว่า<strong>ทุก</strong>endpoint ที่ควรมี auth (ตามที่ยืนยันจากโค้ดจริงไว้ในบทนำ) ปฏิเสธ request ที่ไม่มี key จริง ไม่ใช่แค่ตัวใดตัวหนึ่ง — ในทางกลับกัน ก็ต้องรู้ด้วยว่า <code>/api/ai/panel</code> (บทที่ 4) ไม่ได้อยู่ในกลุ่มนี้ เพราะไม่มี middleware ผูกไว้จริง การรู้ว่า "endpoint ไหนควรป้องกันและไหนไม่ควร" สำคัญพอๆ กับการทดสอบว่ามันป้องกันจริง`,
    example: `// ตัวอย่างเช็คด้านตรงข้าม: ยืนยันว่า endpoint ที่ไม่ได้ผูก middleware จริง (เช่น /api/ai/panel)
// ไม่ตอบ 401 แม้ไม่มี API Key เลย (เพื่อยืนยันความเข้าใจที่ถูกต้องเกี่ยวกับขอบเขตของ middleware)
const panelResponse = await request.get('/api/ai/panel');
expect(panelResponse.status()).not.toBe(401);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ยิง POST ไปยัง endpoint ทั้ง 3 ตัวที่เหลือซึ่งต้องมี API Key: <code>/api/ai/portfolio-snapshot</code>, <code>/api/ai/price-history</code>, <code>/api/ai/model/switch</code> แบบไม่ใส่ header <code>X-API-Key</code><br/>
    2. เขียน assertion จริงว่าทุก endpoint ต้องตอบกลับ status <code>401</code>`
  }
];

// Application state

const PREFIX = 'sec';
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
    <div class="terminal-line info">npx playwright test ${lesson.id}.spec.ts --project=security</div>
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
        <div class="terminal-line success">1 passed (102ms)</div>
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
        <div class="terminal-line error">1 failed (41ms)</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Security Testing แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการตรวจสอบ Auth Bypass, Injection Awareness, XSS Prevention, Sensitive Data Exposure และ Security Headers ในงาน QA จริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}
