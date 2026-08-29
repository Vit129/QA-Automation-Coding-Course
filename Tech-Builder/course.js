(function() {
// Become a Tech Builder (Agentic Engineering) — Interactive Coding Playground Data and Logic

function stripComments(code) {
  const noLineComments = code
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
  return noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
}

const LESSONS = [
  {
  id: "tb_gateway_vs_app_boundary",
  meta: "Pillar 1 · บทที่ 1",
  title: "Gateway vs Application Security Boundary",
  theory: `🎯 <strong>เป้าหมาย:</strong> ห้างสรรพสินค้ามีหลายสาขา แต่ละสาขามี POS terminal ของตัวเอง — 403
    ไม่ได้มีสาเหตุเดียวเสมอไป ระบบที่ดีแยกการตรวจสอบเป็น 2 ชั้น:<br/>
    • <strong>Gateway layer:</strong> ตรวจแบบหยาบ ("POS terminal นี้มีสิทธิ์เข้าระบบไหม" — apiKey/token
    ถูกต้องหรือเปล่า)<br/>
    • <strong>Application layer:</strong> ตรวจแบบละเอียด ("POS terminal นี้ขอดูคำสั่งซื้อของสาขาตัวเองจริงไหม" —
    branchId ตรงกันหรือไม่ ห้ามสาขา A เห็นคำสั่งซื้อของสาขา B)<br/><br/>
    🚨 <strong>ทำไมสำคัญ:</strong> ถ้า debug 403 โดยไม่รู้ว่ามาจากชั้นไหน อาจแก้ผิดจุด (แก้ auth token ทั้งที่
    ปัญหาจริงคือ branch filter) เสียเวลาทีมทั้งสองฝั่งฟรี`,
  example: `function checkLogin(request) {
  if (!request.token) return { status: 401, reason: 'NO_TOKEN' };
  return { status: 200, reason: 'OK' };
}`,
  task: `เขียน <code>checkAccess(request, order)</code> คืนค่า <code>{ status, reason }</code>:<br/>
    1. ถ้า <code>!request.apiKey</code> → <code>{ status: 403, reason: 'GATEWAY_UNAUTHORIZED' }</code><br/>
    2. ถ้ามี apiKey แต่ <code>request.branchId !== order.branchId</code> →
       <code>{ status: 403, reason: 'BRANCH_FORBIDDEN' }</code><br/>
    3. นอกนั้น → <code>{ status: 200, reason: 'OK' }</code>`,
  template: `function checkAccess(request, order) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn checkAccess;`)();
    const cases = [
      [{ apiKey: null, branchId: 'branch-1' }, { branchId: 'branch-1' }, 403, 'GATEWAY_UNAUTHORIZED'],
      [{ apiKey: 'k1', branchId: 'branch-1' }, { branchId: 'branch-2' }, 403, 'BRANCH_FORBIDDEN'],
      [{ apiKey: 'k1', branchId: 'branch-1' }, { branchId: 'branch-1' }, 200, 'OK'],
    ];
    for (const [request, order, status, reason] of cases) {
      const r = fn(request, order);
      if (!r || r.status !== status || r.reason !== reason) {
        throw new Error(`checkAccess ผิดสำหรับ branchId=${request.branchId}: ต้องได้ { status: ${status}, reason: '${reason}' }`);
      }
      log(`✓ ${reason} ถูกต้อง`);
    }
  },
  hint: "เช็คชั้น Gateway (apiKey) ก่อนเสมอ ก่อนไปเช็คชั้น Application (branchId) — ห้ามสลับลำดับ",
  solution: `function checkAccess(request, order) {
  if (!request.apiKey) return { status: 403, reason: 'GATEWAY_UNAUTHORIZED' };
  if (request.branchId !== order.branchId) return { status: 403, reason: 'BRANCH_FORBIDDEN' };
  return { status: 200, reason: 'OK' };
}`
},
  {
  id: "tb_service_virtualization_asymmetric",
  meta: "Pillar 1 · บทที่ 2",
  title: "Two-Way Asymmetric Service Virtualization (Mock Server)",
  theory: `🎯 <strong>เป้าหมาย:</strong> ระบบสั่งซื้อของห้างสรรพสินค้าต้อง sync สถานะสินค้าคงคลังกับระบบ
    Inventory/ERP ภายนอก — ถ้าระบบ ERP ยังไม่พร้อมให้ทีม dev เชื่อมต่อจริง (หรือ QA ควบคุมพฤติกรรมไม่ได้)
    ต้องมี "ตัวปลอม" ที่จำลองพฤติกรรมจริง ไม่ใช่แค่ static response เดียว<br/><br/>
    ⚖️ <strong>Asymmetric แปลว่าอะไร:</strong> endpoint เดียวกัน ต้องตอบสนอง<u>ต่างกัน</u>ตาม input —
    เช่น orderId ที่มีจริงในคลังตอบ 200 พร้อมข้อมูล, orderId ที่ไม่มีตอบ 404, input ผิดรูปแบบตอบ 500 —
    นี่คือสิ่งที่ static mock (คืนค่าเดียวเสมอ) ทำไม่ได้ แต่ service virtualization ระดับ production ต้องทำได้<br/><br/>
    🚨 <strong>ข้อควรระวัง:</strong> ต้องมี default/fail-safe case เสมอ ห้ามปล่อยให้ input ที่ไม่คาดคิดทำให้ mock
    ระบบ ERP ล่ม (throw exception ที่ไม่ได้ตั้งใจ) — mock ต้อง "คาดเดาได้" เหมือน service จริงที่ดี`,
  example: `function createUserStub(userId) {
  if (userId === 'active-1') return { status: 200, body: { id: 'active-1', active: true } };
  return { status: 404, body: { error: 'USER_NOT_FOUND' } };
}`,
  task: `จงเขียนฟังก์ชัน <code>createOrderStub(orderId)</code> จำลองระบบ Inventory/ERP ที่ห้างเรียกใช้
    เพื่อเช็คสถานะคำสั่งซื้อ คืนค่า object รูปแบบ <code>{ status, body }</code> ดังนี้:<br/>
    1. ถ้า <code>orderId === 'ORD-100'</code> → <code>{ status: 200, body: { orderId: 'ORD-100', status: 'CONFIRMED' } }</code><br/>
    2. ถ้า <code>orderId === 'ORD-404'</code> → <code>{ status: 404, body: { error: 'ORDER_NOT_FOUND' } }</code><br/>
    3. กรณีอื่นทั้งหมด → <code>{ status: 500, body: { error: 'UNEXPECTED_MOCK_INPUT' } }</code> (fail-safe case)`,
  template: `function createOrderStub(orderId) {
  // WRITE YOUR CODE HERE
  // ต้องคืนค่า { status: number, body: object } ตาม 3 กรณีด้านบน

}`,
  validate: (code, log) => {
    log("🔍 กำลังโหลดฟังก์ชัน createOrderStub...");
    const fn = new Function(`${code}\nreturn createOrderStub;`)();
    if (typeof fn !== 'function') {
      throw new Error("ไม่พบฟังก์ชัน createOrderStub ในโค้ดที่ส่งมา");
    }
    const cases = [
      ['ORD-100', 200, { orderId: 'ORD-100', status: 'CONFIRMED' }],
      ['ORD-404', 404, { error: 'ORDER_NOT_FOUND' }],
      ['ORD-BAD', 500, { error: 'UNEXPECTED_MOCK_INPUT' }],
    ];
    for (const [input, expectStatus, expectBody] of cases) {
      const result = fn(input);
      if (!result || typeof result !== 'object') {
        throw new Error(`เรียก createOrderStub('${input}') แล้วไม่ได้ object กลับมา`);
      }
      if (result.status !== expectStatus) {
        throw new Error(`createOrderStub('${input}') ต้องคืน status ${expectStatus} แต่ได้ ${result.status}`);
      }
      if (JSON.stringify(result.body) !== JSON.stringify(expectBody)) {
        throw new Error(`createOrderStub('${input}') คืน body ไม่ตรงตามที่กำหนด (ตรวจสอบ field ให้ครบ)`);
      }
      log(`✓ input '${input}' → status ${result.status} ถูกต้อง`);
    }
  },
  hint: "อย่าลืมกรณี default (else สุดท้าย) — mock ระบบ ERP เสมือนต้องตอบสนองแบบคาดเดาได้เสมอแม้ input ไม่ตรง case ไหนเลย",
  solution: `function createOrderStub(orderId) {
  if (orderId === 'ORD-100') {
    return { status: 200, body: { orderId: 'ORD-100', status: 'CONFIRMED' } };
  }
  if (orderId === 'ORD-404') {
    return { status: 404, body: { error: 'ORDER_NOT_FOUND' } };
  }
  return { status: 500, body: { error: 'UNEXPECTED_MOCK_INPUT' } };
}`
},
  {
  id: "tb_idempotent_api_contract",
  meta: "Pillar 1 · บทที่ 3",
  title: "ออกแบบ API ให้ Idempotent ด้วย Idempotency Key",
  theory: `🎯 <strong>เป้าหมาย:</strong> ลูกค้าจ่ายเงินที่แคชเชียร์ห้างสรรพสินค้า — ถ้าเน็ตเวิร์กหลุดกลางทาง POS
    terminal มักจะยิง request ซ้ำ (retry) — ถ้า API ไม่ idempotent การ retry จะทำให้เกิดผลข้างเคียงซ้ำ
    (เช่น หักเงินลูกค้าซ้ำสองรอบ) วิธีแก้คือให้ client ส่ง <strong>idempotency key</strong> (เช่น UUID) มาด้วย
    ทุกครั้ง server เก็บว่า key ไหนเคย process แล้ว ถ้าเจอ key ซ้ำให้คืนผลลัพธ์เดิมที่เคย cache ไว้ ไม่ execute ซ้ำ`,
  example: `function once(seen, key, fn) {
  if (seen.has(key)) return seen.get(key);
  const result = fn();
  seen.set(key, result);
  return result;
}`,
  task: `เขียน <code>processPayment(idempotencyStore, key, amount, account)</code>:<br/>
    1. ถ้า <code>idempotencyStore[key]</code> มีอยู่แล้ว → คืนค่าที่ cache ไว้ทันที ห้ามบวก
       <code>account.totalCharged</code> ซ้ำ<br/>
    2. ถ้ายังไม่มี → บวก <code>account.totalCharged += amount</code>, สร้าง
       <code>result = { charged: amount, status: 'OK' }</code>, เก็บลง
       <code>idempotencyStore[key] = result</code> แล้ว return result`,
  template: `function processPayment(idempotencyStore, key, amount, account) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn processPayment;`)();
    const store = {};
    const account = { totalCharged: 0 };
    const r1 = fn(store, 'key-1', 100, account);
    if (account.totalCharged !== 100) throw new Error("ครั้งแรกต้องบวก totalCharged");
    log("✓ ครั้งแรก charge สำเร็จ totalCharged = 100");
    const r2 = fn(store, 'key-1', 100, account);
    if (account.totalCharged !== 100) {
      throw new Error(`เรียกซ้ำด้วย key เดิม ('key-1') totalCharged ต้องยังเป็น 100 (ห้าม charge ซ้ำ) แต่ได้ ${account.totalCharged}`);
    }
    if (JSON.stringify(r1) !== JSON.stringify(r2)) {
      throw new Error("เรียกซ้ำด้วย key เดิมต้องคืนผลลัพธ์เดิมที่ cache ไว้ (จาก idempotencyStore)");
    }
    log("✓ เรียกซ้ำด้วย key เดิม ไม่ charge ซ้ำ คืนผลลัพธ์ cache");
    fn(store, 'key-2', 50, account);
    if (account.totalCharged !== 150) throw new Error("key ใหม่ต้อง charge เพิ่มตามปกติ");
    log("✓ key ใหม่ charge เพิ่มตามปกติ");
  },
  hint: "เช็ค idempotencyStore[key] ก่อนเสมอ ก่อนจะไปแตะ account.totalCharged",
  solution: `function processPayment(idempotencyStore, key, amount, account) {
  if (idempotencyStore[key]) return idempotencyStore[key];
  account.totalCharged += amount;
  const result = { charged: amount, status: 'OK' };
  idempotencyStore[key] = result;
  return result;
}`
},
  {
  id: "tb_correlation_id_propagation",
  meta: "Pillar 1 · บทที่ 4",
  title: "Correlation ID Propagation ข้าม Service",
  theory: `🎯 <strong>เป้าหมาย:</strong> คำสั่งซื้อหนึ่งใบเดินทางผ่านหลาย service ของห้าง (Order → Inventory/ERP
    → Pricing) ต่อกัน — การ trace ว่า "คำสั่งซื้อนี้ทำอะไรไปบ้าง" ยากมากถ้าแต่ละ service log แยกกันไม่มีจุดเชื่อม —
    correlation ID คือ id เดียวที่สร้างครั้งเดียวตอนคำสั่งซื้อเข้าระบบ แล้วแนบไปกับทุก outbound call/log ตลอดทาง
    ไม่สร้างใหม่ ไม่ทิ้งกลางทาง`,
  example: `function withHeader(headers, key, value) {
  return { ...headers, [key]: value };
}`,
  task: `เขียน <code>callDownstream(correlationId, downstreamFn)</code> ที่ต้องเรียก
    <code>downstreamFn(headers)</code> โดย <code>headers</code> ต้องมี key
    <code>'x-correlation-id'</code> เท่ากับ <code>correlationId</code> ที่รับเข้ามาเสมอ (ห้าม
    generate id ใหม่ ห้ามส่ง headers ว่าง)`,
  template: `function callDownstream(correlationId, downstreamFn) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const clean = stripComments(code);
    if (!/x-correlation-id/.test(clean)) {
      throw new Error("ไม่พบ header key 'x-correlation-id' ในโค้ด");
    }
    const fn = new Function(`${code}\nreturn callDownstream;`)();
    let received = null;
    fn('corr-abc-123', (headers) => { received = headers; });
    if (!received || received['x-correlation-id'] !== 'corr-abc-123') {
      throw new Error("downstreamFn ต้องได้รับ headers ที่มี x-correlation-id ตรงกับ correlationId ที่รับเข้ามา");
    }
    log("✓ correlation ID ถูกส่งต่อไปยัง downstream ถูกต้อง");
  },
  hint: "ห้าม hardcode ค่า correlation ID เอง — ต้องใช้ค่าที่รับมาจาก parameter เท่านั้น",
  solution: `function callDownstream(correlationId, downstreamFn) {
  return downstreamFn({ 'x-correlation-id': correlationId });
}`
},
  {
  id: "tb_oauth_interceptor",
  meta: "Pillar 2 · บทที่ 1",
  title: "Outbound OAuth Interceptor — แนบ Token อัตโนมัติทุก Outbound Call",
  theory: `🎯 <strong>เป้าหมาย:</strong> แทนที่จะให้ทุกจุดที่เรียก API ภายนอกต้อง manually แนบ
    <code>Authorization</code> header เอง ให้มี interceptor ชั้นเดียวที่คั่นกลาง คอยเช็คว่า token
    หมดอายุหรือยัง ถ้าหมดแล้วให้ refresh ก่อน แล้วค่อยยิง request จริง<br/><br/>
    ⚖️ <strong>ทำไมสำคัญ:</strong> ลดโอกาสที่ token หมดอายุกลางทาง (401 ที่ debug ยาก) และรวม logic
    เรื่อง auth ไว้จุดเดียวแทนที่จะกระจายอยู่ทุก call site`,
  example: `function callWithAuth(tokenStore, requestFn) {
  const now = Date.now();
  let token = tokenStore.token;
  if (now >= tokenStore.expiresAt) {
    token = tokenStore.refresh();
  }
  return requestFn(token);
}`,
  task: `จงเขียนฟังก์ชัน <code>callWithAuth(tokenStore, requestFn)</code> ที่:<br/>
    1. ถ้า <code>tokenStore.expiresAt</code> ยังไม่ถึงเวลาปัจจุบัน (<code>Date.now()</code>) →
       เรียก <code>requestFn(tokenStore.token)</code> ได้เลย ห้ามเรียก refresh<br/>
    2. ถ้าหมดอายุแล้ว → เรียก <code>tokenStore.refresh()</code> ก่อน (คืนค่า token string ใหม่)
       แล้วเรียก <code>requestFn(newToken)</code> ด้วย token ใหม่ที่ได้`,
  template: `function callWithAuth(tokenStore, requestFn) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    log("🔍 ทดสอบกรณี token ยังไม่หมดอายุ...");
    const fn = new Function(`${code}\nreturn callWithAuth;`)();
    let refreshCalled = 0;
    const freshStore = { token: 'valid-token', expiresAt: Date.now() + 100000, refresh: () => { refreshCalled++; return 'should-not-be-used'; } };
    let receivedToken = null;
    fn(freshStore, (t) => { receivedToken = t; return { ok: true }; });
    if (refreshCalled !== 0) {
      throw new Error("token ยังไม่หมดอายุ แต่โค้ดไปเรียก tokenStore.refresh() โดยไม่จำเป็น");
    }
    if (receivedToken !== 'valid-token') {
      throw new Error("requestFn ต้องได้รับ token เดิม ('valid-token') เมื่อยังไม่หมดอายุ");
    }
    log("✓ ไม่ refresh โดยไม่จำเป็น และแนบ token เดิมถูกต้อง");

    log("🔍 ทดสอบกรณี token หมดอายุแล้ว...");
    const expiredStore = { token: 'old-token', expiresAt: Date.now() - 1000, refresh: () => 'new-token' };
    let receivedAfterRefresh = null;
    fn(expiredStore, (t) => { receivedAfterRefresh = t; return { ok: true }; });
    if (receivedAfterRefresh !== 'new-token') {
      throw new Error("token หมดอายุแล้ว requestFn ต้องได้รับ token ใหม่จาก refresh() ('new-token') ไม่ใช่ token เดิม");
    }
    log("✓ refresh แล้วแนบ token ใหม่ให้ requestFn ถูกต้อง");
  },
  hint: "เช็คเงื่อนไข expiresAt เทียบกับ Date.now() ก่อน — อย่า refresh ทุกครั้งโดยไม่จำเป็น (สิ้นเปลือง network call จริง)",
  solution: `function callWithAuth(tokenStore, requestFn) {
  let token = tokenStore.token;
  if (Date.now() >= tokenStore.expiresAt) {
    token = tokenStore.refresh();
  }
  return requestFn(token);
}`
},
  {
  id: "tb_retry_backoff_fallback",
  meta: "Pillar 2 · บทที่ 2",
  title: "Exponential Backoff Retry + Manual Fallback Queue",
  theory: `🎯 <strong>เป้าหมาย:</strong> ตอนพนักงานกดคืนเงินให้ลูกค้าที่เคาน์เตอร์รับคืนสินค้า ถ้าระบบชำระเงินคืน
    (payment gateway) ล่มชั่วคราว (network กระตุก) ควร retry ไม่กี่ครั้งก่อนยอมแพ้ — แต่ถ้า retry ครบแล้วยัง
    ไม่สำเร็จ ห้ามทิ้งคำขอคืนเงินของลูกค้าไปเฉยๆ ต้องส่งเข้า <strong>fallback queue</strong> ให้พนักงานหรือ
    process อื่นมา retry ทีหลังได้ ไม่ใช่แค่ throw แล้วจบ (ลูกค้าเดินกลับบ้านไปโดยไม่ได้เงินคืน)`,
  example: `function tryOnce(fn) {
  try { return { ok: true, value: fn() }; }
  catch (e) { return { ok: false, error: e.message }; }
}`,
  task: `เขียน <code>attemptWithRetry(operation, maxAttempts, fallbackQueue)</code>:<br/>
    1. เรียก <code>operation()</code> ซ้ำได้สูงสุด <code>maxAttempts</code> ครั้ง<br/>
    2. ถ้าสำเร็จเมื่อไหร่ (ไม่ throw) ให้ return ผลลัพธ์ทันที ไม่ retry ต่อ<br/>
    3. ถ้า fail ครบ <code>maxAttempts</code> ครั้ง ให้ <code>fallbackQueue.push(operation)</code>
       แทนการ throw ต่อ แล้ว return <code>undefined</code>`,
  template: `function attemptWithRetry(operation, maxAttempts, fallbackQueue) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn attemptWithRetry;`)();
    let calls = 0;
    const succeedsOnThird = () => { calls++; if (calls < 3) throw new Error('fail'); return 'done'; };
    const result1 = fn(succeedsOnThird, 5, []);
    if (result1 !== 'done' || calls !== 3) {
      throw new Error(`ต้อง retry จนสำเร็จครั้งที่ 3 แล้วหยุด (ไม่ retry เกิน) แต่เรียกไป ${calls} ครั้ง`);
    }
    log("✓ retry จนสำเร็จแล้วหยุดทันที ไม่ retry เกินความจำเป็น");

    const queue = [];
    const alwaysFails = () => { throw new Error('down'); };
    const result2 = fn(alwaysFails, 3, queue);
    if (queue.length !== 1) {
      throw new Error("fail ครบ maxAttempts แล้วต้อง push เข้า fallbackQueue หนึ่งรายการ");
    }
    log("✓ fail ครบแล้ว push เข้า fallback queue แทนการ throw");
  },
  hint: "ใช้ loop สูงสุด maxAttempts ครั้ง มี try/catch ครอบการเรียก operation() แต่ละครั้ง",
  solution: `function attemptWithRetry(operation, maxAttempts, fallbackQueue) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return operation();
    } catch (e) {
      if (i === maxAttempts - 1) {
        fallbackQueue.push(operation);
        return undefined;
      }
    }
  }
}`
},
  {
  id: "tb_migration_versioning",
  meta: "Pillar 2 · บทที่ 3",
  title: "Database Migration Versioning (2 สไตล์)",
  theory: `🎯 <strong>เป้าหมาย:</strong> migration tool ต้องรู้ว่า "อันไหน apply ไปแล้ว อันไหนยัง" โดยไม่ apply
    ซ้ำ — พบ 2 สไตล์ตั้งชื่อไฟล์ที่ใช้จริงในระบบระดับ enterprise:<br/>
    • <strong>Versioned-file:</strong> <code>V&lt;number&gt;__description.sql</code> เช่น
    <code>V101__add_email_column.sql</code><br/>
    • <strong>Timestamped-folder:</strong> <code>YYYYMMDD_NNN_description/migration.sql</code> เช่น
    <code>20260824_001_add_index/migration.sql</code><br/>
    ทั้งสองแบบทำหน้าที่เดียวกัน: การันตีลำดับ apply ที่แน่นอนและตรวจจับได้ว่า "เคยรันหรือยัง"`,
  example: `function startsWithDigits(s, n) {
  return /^[0-9]{/, n, /}/.test(s); // ตัวอย่างแนวคิด ไม่ใช่โค้ดจริง
}`,
  task: `เขียน <code>isValidMigrationFilename(style, filename)</code> คืนค่า boolean:<br/>
    1. <code>style === 'versioned'</code> → ต้องตรงรูปแบบ <code>V&lt;ตัวเลข&gt;__&lt;คำอธิบาย&gt;.sql</code>
       (เช่น <code>V101__add_email_column.sql</code>)<br/>
    2. <code>style === 'timestamped'</code> → ต้องตรงรูปแบบ
       <code>YYYYMMDD_NNN_&lt;คำอธิบาย&gt;/migration.sql</code> (เช่น
       <code>20260824_001_add_index/migration.sql</code>)`,
  template: `function isValidMigrationFilename(style, filename) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn isValidMigrationFilename;`)();
    const cases = [
      ['versioned', 'V101__add_email_column.sql', true],
      ['versioned', 'add_email_column.sql', false],
      ['timestamped', '20260824_001_add_index/migration.sql', true],
      ['timestamped', 'add_index/migration.sql', false],
    ];
    for (const [style, filename, expected] of cases) {
      const result = fn(style, filename);
      if (Boolean(result) !== expected) {
        throw new Error(`isValidMigrationFilename('${style}', '${filename}') ต้องได้ ${expected} แต่ได้ ${result}`);
      }
      log(`✓ '${filename}' (${style}) ตรวจสอบถูกต้อง`);
    }
  },
  hint: "ใช้ regular expression แยกกันสองแบบตาม style — versioned ขึ้นต้นด้วย V+เลข+__, timestamped ขึ้นต้นด้วยวันที่ 8 หลัก+_+เลข 3 หลัก+_",
  solution: `function isValidMigrationFilename(style, filename) {
  if (style === 'versioned') return /^V[0-9]+__.+\\.sql$/.test(filename);
  if (style === 'timestamped') return /^[0-9]{8}_[0-9]{3}_.+\\/migration\\.sql$/.test(filename);
  return false;
}`
},
  {
  id: "tb_staging_table_reconciliation",
  meta: "Pillar 2 · บทที่ 4",
  title: "Staging Table Pattern สำหรับ Async Reconciliation",
  theory: `🎯 <strong>เป้าหมาย:</strong> คำขอคืนเงินที่ค้างจาก payment gateway ล่ม (บทก่อนหน้า) แทนที่จะเขียนลง
    ตาราง transaction หลักตรงๆ (เสี่ยง lock/partial write เมื่อ retry) ให้เขียนคำขอคืนเงินที่ยังไม่สำเร็จลง
    <strong>staging table</strong> แยกก่อน พร้อม <code>retryCount</code> — แล้วมี process แยกต่างหากคอย
    reconcile: พยายาม apply (สั่งคืนเงินจริง) ทีละแถว สำเร็จก็ลบออก ไม่สำเร็จก็เพิ่ม retryCount แล้วปล่อยไว้ให้
    รอบถัดไปลองใหม่`,
  example: `function markAttempt(row) {
  row.retryCount = (row.retryCount || 0) + 1;
  return row;
}`,
  task: `เขียน <code>reconcile(stagingTable, applyFn)</code> — <code>stagingTable</code> คือ array ของ
    <code>{ id, payload, retryCount }</code>:<br/>
    1. วนลูปทุกแถวที่มีอยู่ตอนเริ่มฟังก์ชัน (ไม่ retry ซ้ำในรอบเดียวกัน)<br/>
    2. เรียก <code>applyFn(row.payload)</code> — ถ้าไม่ throw ให้ลบแถวนั้นออกจาก stagingTable<br/>
    3. ถ้า throw ให้เพิ่ม <code>row.retryCount</code> อีก 1 แล้วคงแถวไว้ (ไม่ลบ)`,
  template: `function reconcile(stagingTable, applyFn) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn reconcile;`)();
    const staging = [
      { id: 1, payload: 'ok-1', retryCount: 0 },
      { id: 2, payload: 'fail-1', retryCount: 2 },
      { id: 3, payload: 'ok-2', retryCount: 0 },
    ];
    const applyFn = (payload) => {
      if (payload.startsWith('fail')) throw new Error('apply failed');
    };
    fn(staging, applyFn);
    if (staging.length !== 1 || staging[0].id !== 2) {
      throw new Error("แถวที่ apply สำเร็จ (id 1, 3) ต้องถูกลบออก เหลือแค่แถวที่ fail (id 2)");
    }
    log("✓ แถวที่สำเร็จถูกลบออกจาก staging table");
    if (staging[0].retryCount !== 3) {
      throw new Error(`แถวที่ fail (id 2) retryCount ต้องเพิ่มจาก 2 เป็น 3 แต่ได้ ${staging[0].retryCount}`);
    }
    log("✓ แถวที่ fail เพิ่ม retryCount และยังคงอยู่");
  },
  hint: "copy รายการแถวตอนเริ่ม (เช่น [...stagingTable]) ก่อน loop — ห้าม loop ทับ array ที่กำลังแก้ไขอยู่ตรงๆ",
  solution: `function reconcile(stagingTable, applyFn) {
  const rows = [...stagingTable];
  for (const row of rows) {
    try {
      applyFn(row.payload);
      const idx = stagingTable.indexOf(row);
      stagingTable.splice(idx, 1);
    } catch (e) {
      row.retryCount += 1;
    }
  }
}`
},
  {
  id: "tb_ast_blast_radius",
  meta: "Pillar 3 · บทที่ 1",
  title: "AST Dependency Graph — หา Blast Radius ของการแก้โค้ด",
  theory: `🎯 <strong>เป้าหมาย:</strong> ก่อนแก้ symbol ใดๆ ในโค้ดเบสใหญ่ อยากรู้ก่อนว่า "ถ้าแก้ตัวนี้
    จะกระทบอะไรบ้างทางอ้อม" — นี่คือ concept เดียวกับที่เครื่องมือ knowledge-graph สาย AST analysis ใช้จริง
    (god-node = symbol ที่มีคนพึ่งพาเยอะผิดปกติ, blast radius = ทุกอย่างที่กระทบทางอ้อมถ้าแก้ node นั้น)<br/><br/>
    💡 <strong>Mental Model:</strong> graph แบบ adjacency list <code>{ A: ['B','C'] }</code> แปลว่า
    "B และ C ใช้งาน A อยู่" (A คือ dependency, B/C คือ dependent) — ถ้าแก้ A ต้องไล่ดู B, C, และทุกอย่างที่
    พึ่งพา B หรือ C ต่อเป็นทอดๆ (transitive)`,
  example: `function directDependents(graph, node) {
  return graph[node] || [];
}`,
  task: `กำหนด dependency graph แบบ adjacency list เช่น
    <code>{ A: ['B','C'], B: ['D'], C: [], D: [] }</code> (หมายถึง B และ C ใช้งาน A, D ใช้งาน B)<br/>
    จงเขียนฟังก์ชัน <code>blastRadius(graph, node)</code> ที่คืนค่า Array ของทุกโหนดที่ได้รับผลกระทบ
    ถ้า <code>node</code> เปลี่ยนแปลง (ไล่ตาม dependent แบบ transitive, ห้ามรวมตัว node เอง, ห้ามซ้ำ,
    ต้องรองรับ graph ที่มี cycle โดยไม่ loop ไม่รู้จบ)`,
  template: `function blastRadius(graph, node) {
  // WRITE YOUR CODE HERE
  // คืนค่า Array ของโหนดที่ได้รับผลกระทบทางอ้อมทั้งหมด (ไม่รวม node เอง, ไม่ซ้ำ)

}`,
  validate: (code, log) => {
    log("🔍 ทดสอบกับ graph แบบไม่มี cycle...");
    const fn = new Function(`${code}\nreturn blastRadius;`)();
    const graph1 = { A: ['B', 'C'], B: ['D'], C: [], D: [] };
    const result1 = new Set(fn(graph1, 'A'));
    const expected1 = new Set(['B', 'C', 'D']);
    if (result1.size !== expected1.size || [...expected1].some(n => !result1.has(n))) {
      throw new Error(`blastRadius(graph, 'A') ต้องได้ ['B','C','D'] (ลำดับไม่สำคัญ) แต่ได้ ${JSON.stringify([...result1])}`);
    }
    if (result1.has('A')) {
      throw new Error("ผลลัพธ์ต้องไม่รวม node ตั้งต้นเอง ('A')");
    }
    log("✓ ไล่ transitive dependent ถูกต้อง: B, C, D");

    log("🔍 ทดสอบกับ graph ที่มี cycle...");
    const graph2 = { X: ['Y'], Y: ['Z'], Z: ['X'] };
    const result2 = fn(graph2, 'X');
    if (!Array.isArray(result2) || result2.length > 3) {
      throw new Error("graph ที่มี cycle (X→Y→Z→X) ทำให้ฟังก์ชัน loop ไม่รู้จบ หรือคืนค่าซ้ำ — ต้องมี visited set กันซ้ำ");
    }
    log("✓ รองรับ cycle โดยไม่ loop ไม่รู้จบ");
  },
  hint: "ใช้ BFS หรือ DFS พร้อม visited Set กัน node ซ้ำและกัน cycle วนไม่รู้จบ",
  solution: `function blastRadius(graph, node) {
  const visited = new Set();
  const queue = [...(graph[node] || [])];
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    queue.push(...(graph[current] || []));
  }
  return [...visited];
}`
},
  {
  id: "tb_offline_first_sync",
  meta: "Pillar 3 · บทที่ 2",
  title: "Offline-First State Sync",
  theory: `🎯 <strong>เป้าหมาย:</strong> POS terminal หน้าร้านต้องขายของได้แม้เน็ตหลุดชั่วคราว (สัญญาณเน็ตในห้าง
    ไม่เสถียร 100%) — เขียนรายการขายลง local store ของเครื่อง POS ทันที (เร็ว ใช้งานได้แม้ offline) แล้วปล่อยให้
    process เบื้องหลัง sync รายการที่ยังไม่ sync ไปยัง server ส่วนกลางทีหลัง — ไม่บล็อกแคชเชียร์รอ network ไม่ว่า
    ลูกค้าจะต่อคิวจ่ายเงินแค่ไหนก็ตาม`,
  example: `function unsyncedEntries(store) {
  return Object.values(store).filter(e => !e.synced);
}`,
  task: `เขียน <code>syncPendingChanges(localStore, remoteClient)</code> — <code>localStore</code> คือ
    object ของ <code>{ id: { data, synced } }</code>:<br/>
    1. วนลูปทุก entry ที่ <code>synced === false</code><br/>
    2. เรียก <code>remoteClient.push(entry.data)</code> — ถ้าไม่ throw ให้ตั้ง
       <code>entry.synced = true</code><br/>
    3. ถ้า throw ให้ข้าม entry นั้นไปเลย (คง synced เป็น false) ไม่ throw ทั้ง process ต่อ`,
  template: `function syncPendingChanges(localStore, remoteClient) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn syncPendingChanges;`)();
    const store = {
      a: { data: 'x', synced: false },
      b: { data: 'y', synced: true },
      c: { data: 'fail', synced: false },
    };
    const remoteClient = { push: (data) => { if (data === 'fail') throw new Error('network error'); } };
    fn(store, remoteClient);
    if (!store.a.synced) throw new Error("entry 'a' push สำเร็จต้องถูกตั้ง synced = true");
    log("✓ entry ที่ push สำเร็จถูกตั้ง synced = true");
    if (store.c.synced) throw new Error("entry 'c' push แล้ว throw ต้องคง synced = false");
    log("✓ entry ที่ push fail ยังคง synced = false ไม่ crash process");
  },
  hint: "ครอบ remoteClient.push ด้วย try/catch ต่อ entry — อย่าให้ entry เดียวที่ fail ทำให้ทั้งลูปหยุด",
  solution: `function syncPendingChanges(localStore, remoteClient) {
  for (const entry of Object.values(localStore)) {
    if (entry.synced) continue;
    try {
      remoteClient.push(entry.data);
      entry.synced = true;
    } catch (e) {
      continue;
    }
  }
}`
},
  {
  id: "tb_reliable_shell_automation",
  meta: "Pillar 3 · บทที่ 3",
  title: "High-Reliability Shell Script (set -euo pipefail)",
  theory: `🎯 <strong>เป้าหมาย:</strong> shell script default จะ "เดินหน้าต่อ" แม้บรรทัดก่อนหน้าล้มเหลว —
    อันตรายมากสำหรับ automation script <code>set -euo pipefail</code> เปลี่ยนพฤติกรรมนี้:<br/>
    • <code>-e</code>: หยุดทันทีถ้าคำสั่งไหน exit ไม่เป็น 0<br/>
    • <code>-u</code>: หยุดทันทีถ้าอ้างถึงตัวแปรที่ไม่เคย set<br/>
    • <code>-o pipefail</code>: pipe (<code>cmd1 | cmd2</code>) ถือว่า fail ถ้า cmd ไหนใน pipe fail
    ไม่ใช่แค่ตัวสุดท้าย`,
  example: `#!/bin/bash
set -euo pipefail
echo "script เริ่มทำงานแบบ fail-fast แล้ว"`,
  task: `เขียน shell script: บรรทัดแรกเปิดใช้ fail-fast ทั้ง 3 แบบในบรรทัดเดียว จากนั้นลบไฟล์
    <code>temp.log</code> อย่างปลอดภัย (ต้องเช็คว่าไฟล์มีอยู่จริงด้วย <code>-f</code> ก่อนสั่งลบ ห้ามลบ
    ตรงๆ โดยไม่เช็ค)`,
  template: `#!/bin/bash
# WRITE YOUR CODE HERE (เปิด fail-fast ทั้ง 3 แบบ)

if [ -f temp.log ]; then
  rm temp.log
fi`,
  validate: (code, log) => {
    const clean = stripComments(code);
    if (!/set\s+-euo\s+pipefail/.test(clean)) {
      throw new Error("ไม่พบ 'set -euo pipefail' — ต้องเปิดใช้ fail-fast ทั้ง 3 แบบในบรรทัดเดียว");
    }
    log("✓ พบ set -euo pipefail");
    if (!/\[\s*-f\s+temp\.log\s*\]/.test(clean)) {
      throw new Error("ต้องเช็คว่าไฟล์ temp.log มีอยู่จริงด้วย -f ก่อนสั่งลบ");
    }
    log("✓ เช็คไฟล์ด้วย -f ก่อนลบ ถูกต้อง");
  },
  hint: "set -euo pipefail ต้องเป็นบรรทัดต้นๆ ของ script (หลัง shebang) ไม่ใช่แทรกกลางไฟล์",
  solution: `#!/bin/bash
set -euo pipefail

if [ -f temp.log ]; then
  rm temp.log
fi`
},
  {
  id: "tb_sandboxed_execution_meta",
  meta: "Pillar 3 · บทที่ 4 (Meta)",
  title: "สร้าง Sandboxed Code Execution Engine ของตัวเอง",
  theory: `🎯 <strong>เป้าหมาย (Meta-lesson):</strong> คอร์สนี้เองรันโค้ดผู้เรียนจริงผ่าน
    <code>new Function()</code> แบบ scoped แทนที่จะใช้ <code>eval()</code> ตรงๆ (ซึ่งเข้าถึง scope ปัจจุบัน
    ทั้งหมด อันตรายกว่า) และดักจับ error ด้วย try/catch เพื่อไม่ให้โค้ดผู้เรียนที่พังทำให้ระบบรัน (runner)
    ทั้งตัวล่มไปด้วย — บทนี้ให้เขียน engine เวอร์ชันย่อยของสิ่งที่กำลังใช้งานอยู่ตอนนี้เอง`,
  example: `function unsafeEval(code) {
  return eval(code); // อันตราย — เข้าถึง scope ปัจจุบันทั้งหมด ห้ามใช้แบบนี้
}`,
  task: `เขียน <code>runUserCode(code, testInput)</code> — <code>code</code> คือ string ของฟังก์ชันชื่อ
    <code>solve</code>:<br/>
    1. ใช้ <code>new Function()</code> (ห้ามใช้ <code>eval</code> ตรงๆ) เพื่อสร้างฟังก์ชัน solve แบบ
       scoped จาก code string<br/>
    2. เรียก <code>solve(testInput)</code> — ถ้าสำเร็จ คืนค่า
       <code>{ ok: true, result: &lt;ผลลัพธ์&gt; }</code><br/>
    3. ถ้าโค้ดผู้เรียน throw ให้ catch แล้วคืนค่า <code>{ ok: false, error: err.message }</code> แทนที่จะ
       ปล่อยให้ runner ทั้งตัวล่ม`,
  template: `function runUserCode(code, testInput) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const stripped = stripComments(code);
    if (/\beval\s*\(/.test(stripped)) {
      throw new Error("ห้ามใช้ eval() ตรงๆ — ต้องใช้ new Function() แบบ scoped เท่านั้น");
    }
    const fn = new Function(`${code}\nreturn runUserCode;`)();
    const good = fn('function solve(x) { return x * 2; }', 5);
    if (!good || good.ok !== true || good.result !== 10) {
      throw new Error("รันโค้ดที่ทำงานปกติแล้วต้องได้ { ok: true, result: 10 }");
    }
    log("✓ รันโค้ดที่ทำงานปกติได้ผลลัพธ์ถูกต้อง");
    const bad = fn('function solve(x) { throw new Error("boom"); }', 5);
    if (!bad || bad.ok !== false) {
      throw new Error("รันโค้ดที่ throw ต้องได้ { ok: false, error: ... } ไม่ใช่ให้ runner ทั้งตัวล่มไปด้วย");
    }
    log("✓ รันโค้ดที่ throw ถูก catch ไว้ ไม่ทำให้ runner ล่ม");
  },
  hint: "ครอบการเรียก solve(testInput) ด้วย try/catch แยกจาก try/catch ที่ครอบ new Function() ตอนสร้างฟังก์ชัน",
  solution: `function runUserCode(code, testInput) {
  try {
    const solve = new Function(\`\${code}\\nreturn solve;\`)();
    try {
      return { ok: true, result: solve(testInput) };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
}`
},
  {
  id: "tb_multirole_auth_state",
  meta: "Pillar 4 · บทที่ 1",
  title: "Multi-Role Auth State Reuse ใน E2E Test (Permission Boundary)",
  theory: `🎯 <strong>เป้าหมาย:</strong> แทนที่จะ login ใหม่ทุก test (ช้าและ flaky) ให้ login ครั้งเดียวต่อ
    role พนักงานในห้าง แล้วบันทึก storage state เป็นไฟล์ (cookies + localStorage) ไว้ reuse ข้าม test ผ่าน
    <code>test.use({ storageState })</code><br/><br/>
    ⚖️ <strong>ทำไมเกี่ยวกับ Security:</strong> การแยกไฟล์ storageState ต่อ role (เช่น Store Manager
    คนละไฟล์กับ Cashier หน้าร้าน) ไม่ใช่แค่เรื่อง performance — มันคือการันตีว่า test แต่ละ role ทดสอบ
    permission boundary จริงที่เคาน์เตอร์รับคืนสินค้า ถ้าปนกันโดยไม่ตั้งใจ (เช่น Cashier ใช้ state ของ
    Store Manager) ผลทดสอบจะ false-positive ทันทีเพราะเห็นสิทธิ์ที่ไม่ควรเห็น`,
  example: `test.describe('Viewer', () => {
  test.use({ storageState: 'auth/storageState-viewer.json' });
  test('เห็นแต่ปุ่มดูข้อมูล', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('view-btn')).toBeVisible();
  });
});`,
  task: `จงเขียน Playwright test สองกลุ่ม (<code>test.describe</code>) สำหรับหน้าเคาน์เตอร์รับคืนสินค้า:<br/>
    1. กลุ่ม <strong>Store Manager</strong> — ตั้ง
       <code>test.use({ storageState: 'auth/storageState-store-manager.json' })</code>
       แล้วตรวจสอบว่าปุ่ม testId <code>'approve-refund-btn'</code> <strong>แสดงผล</strong><br/>
    2. กลุ่ม <strong>Cashier</strong> — ตั้ง
       <code>test.use({ storageState: 'auth/storageState-cashier.json' })</code>
       แล้วตรวจสอบว่าปุ่มเดียวกัน <strong>ไม่แสดงผล</strong> (permission boundary — Cashier รับคืนสินค้าได้
       แต่ต้องให้ Store Manager กดอนุมัติคืนเงินเท่านั้น)`,
  template: `import { test, expect } from '@playwright/test';

test.describe('Store Manager', () => {
  test.use({ storageState: /* WRITE YOUR CODE HERE */ });
  test('เห็นปุ่มอนุมัติคืนเงิน', async ({ page }) => {
    await page.goto('/returns');
    await expect(page.getByTestId('approve-refund-btn')).toBeVisible();
  });
});

test.describe('Cashier', () => {
  test.use({ storageState: /* WRITE YOUR CODE HERE */ });
  test('ไม่เห็นปุ่มอนุมัติคืนเงิน', async ({ page }) => {
    await page.goto('/returns');
    await expect(page.getByTestId('approve-refund-btn')).not.toBeVisible();
  });
});`,
  validate: (code, log) => {
    const clean = stripComments(code);
    const managerBlockMatch = clean.match(/test\.describe\(['"]Store Manager['"][\s\S]*?test\.describe\(['"]Cashier['"]/);
    if (!managerBlockMatch) {
      throw new Error("ไม่พบโครงสร้าง test.describe('Store Manager', ...) ตามด้วย test.describe('Cashier', ...) ตามลำดับที่กำหนด");
    }
    const managerBlock = managerBlockMatch[0];
    if (!/storageState:\s*['"]auth\/storageState-store-manager\.json['"]/.test(managerBlock)) {
      throw new Error("บล็อก Store Manager ต้องใช้ storageState: 'auth/storageState-store-manager.json' เท่านั้น");
    }
    log("✓ Store Manager ใช้ storageState ถูกไฟล์");
    const cashierBlock = clean.slice(clean.indexOf("test.describe('Cashier'"));
    if (!/storageState:\s*['"]auth\/storageState-cashier\.json['"]/.test(cashierBlock)) {
      throw new Error("บล็อก Cashier ต้องใช้ storageState: 'auth/storageState-cashier.json' เท่านั้น (ห้ามใช้ไฟล์ของ role อื่น)");
    }
    log("✓ Cashier ใช้ storageState ถูกไฟล์");
    if (!/toBeVisible\(\)/.test(managerBlock)) {
      throw new Error("บล็อก Store Manager ต้องมี assertion .toBeVisible() สำหรับปุ่มอนุมัติคืนเงิน");
    }
    if (!/\.not\.toBeVisible\(\)/.test(cashierBlock)) {
      throw new Error("บล็อก Cashier ต้องมี assertion .not.toBeVisible() เพื่อพิสูจน์ permission boundary");
    }
    log("✓ Assertion ทั้งสอง role ถูกต้องตาม permission boundary ที่กำหนด");
  },
  hint: "ห้ามสลับไฟล์ storageState ระหว่างสอง describe block เด็ดขาด — นั่นคือหัวใจของบทเรียนนี้ (แยก role จริง ไม่ใช่แค่โครงสร้างเหมือนกัน)",
  solution: `import { test, expect } from '@playwright/test';

test.describe('Store Manager', () => {
  test.use({ storageState: 'auth/storageState-store-manager.json' });
  test('เห็นปุ่มอนุมัติคืนเงิน', async ({ page }) => {
    await page.goto('/returns');
    await expect(page.getByTestId('approve-refund-btn')).toBeVisible();
  });
});

test.describe('Cashier', () => {
  test.use({ storageState: 'auth/storageState-cashier.json' });
  test('ไม่เห็นปุ่มอนุมัติคืนเงิน', async ({ page }) => {
    await page.goto('/returns');
    await expect(page.getByTestId('approve-refund-btn')).not.toBeVisible();
  });
});`
},
  {
  id: "tb_permission_matrix_testing",
  meta: "Pillar 4 · บทที่ 2",
  title: "Permission Matrix Testing (403 สองสาเหตุ)",
  theory: `🎯 <strong>เป้าหมาย:</strong> ต่อยอดจาก Gateway vs App Boundary (Pillar 1, POS terminal หลายสาขา) —
    test suite ที่ดีต้องตรวจ <code>reason</code> ไม่ใช่แค่ <code>status</code> 403 เฉยๆ เพราะ 403 จาก Gateway
    กับ 403 จาก Application คือคนละบั๊ก คนละทีมที่ต้องแก้ ถ้า assert แค่ status เทสจะผ่านแม้ reason ผิดชั้น`,
  example: `function assertEqual(actual, expected, msg) {
  if (actual !== expected) throw new Error(msg);
}`,
  task: `เขียน <code>assertPermissionMatrix(testCases, checkAccessFn)</code> —
    <code>testCases</code> คือ array ของ
    <code>{ request, order, expectedStatus, expectedReason }</code>:<br/>
    1. เรียก <code>checkAccessFn(request, order)</code> ของแต่ละ case<br/>
    2. ถ้า <code>status</code> หรือ <code>reason</code> ไม่ตรงกับที่คาดไว้ ให้ throw Error บอกว่า case
       ไหนพัง คาดหวังอะไร ได้อะไรจริง<br/>
    3. ถ้าผ่านทุก case ให้ return <code>true</code>`,
  template: `function assertPermissionMatrix(testCases, checkAccessFn) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn assertPermissionMatrix;`)();
    const checkAccessFn = (request, order) => {
      if (!request.apiKey) return { status: 403, reason: 'GATEWAY_UNAUTHORIZED' };
      if (request.branchId !== order.branchId) return { status: 403, reason: 'BRANCH_FORBIDDEN' };
      return { status: 200, reason: 'OK' };
    };
    const goodCases = [
      { request: { apiKey: null, branchId: 'branch-1' }, order: { branchId: 'branch-1' }, expectedStatus: 403, expectedReason: 'GATEWAY_UNAUTHORIZED' },
      { request: { apiKey: 'k', branchId: 'branch-1' }, order: { branchId: 'branch-1' }, expectedStatus: 200, expectedReason: 'OK' },
    ];
    if (fn(goodCases, checkAccessFn) !== true) {
      throw new Error("ทุก case ผ่านแล้วต้อง return true");
    }
    log("✓ ทุก case ตรงตามที่คาด ผ่านและ return true");
    const badCases = [
      { request: { apiKey: 'k', branchId: 'branch-1' }, order: { branchId: 'branch-2' }, expectedStatus: 403, expectedReason: 'GATEWAY_UNAUTHORIZED' },
    ];
    let threw = false;
    try { fn(badCases, checkAccessFn); } catch (e) { threw = true; }
    if (!threw) {
      throw new Error("case ที่ reason จริงไม่ตรงกับ expectedReason (BRANCH_FORBIDDEN vs GATEWAY_UNAUTHORIZED ที่คาดผิด) ต้อง throw Error");
    }
    log("✓ case ที่ reason ผิด (คนละชั้น) ตรวจจับได้ ไม่ปล่อยผ่าน");
  },
  hint: "อย่า assert แค่ status — ต้อง assert reason ด้วยเสมอ เพราะ 403 เดียวกันมาจากคนละชั้นได้",
  solution: `function assertPermissionMatrix(testCases, checkAccessFn) {
  for (const tc of testCases) {
    const result = checkAccessFn(tc.request, tc.order);
    if (result.status !== tc.expectedStatus || result.reason !== tc.expectedReason) {
      throw new Error(\`case ล้มเหลว: คาดหวัง { status: \${tc.expectedStatus}, reason: '\${tc.expectedReason}' } แต่ได้ { status: \${result.status}, reason: '\${result.reason}' }\`);
    }
  }
  return true;
}`
},
  {
  id: "tb_error_sanitization",
  meta: "Pillar 4 · บทที่ 3",
  title: "Error Sanitization — ห้าม Leak Stack Trace",
  theory: `🎯 <strong>เป้าหมาย (OWASP-aligned, generic — ไม่ได้ grounded จาก repo เฉพาะเจาะจง):</strong>
    error ภายใน (stack trace, path บนเครื่อง server, ชื่อ table/column) ห้ามหลุดไปถึง client เด็ดขาด — ทำ
    ให้ผู้โจมตีรู้โครงสร้างระบบ ทางที่ถูกคือ map error ภายในทุกแบบให้เป็นข้อความ/รหัสทั่วไปคงที่เดียวกันเสมอ
    ก่อนส่งกลับ client ส่วนรายละเอียดจริงให้ log ไว้ฝั่ง server เท่านั้น`,
  example: `function safeResponse() {
  return { code: 'INTERNAL_ERROR', message: 'Something went wrong' };
}`,
  task: `เขียน <code>sanitizeErrorForClient(error)</code> — ไม่ว่า <code>error</code> ที่รับเข้ามาจะมี
    property อะไรอยู่ข้างในก็ตาม (stack, message, sql, path ฯลฯ) ต้องคืนค่า
    <code>{ code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่' }</code> เสมอ (ค่าคงที่
    ทุกครั้ง ห้ามคืนค่า field ใดๆ ของ error ต้นฉบับออกไปเลย)`,
  template: `function sanitizeErrorForClient(error) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fn = new Function(`${code}\nreturn sanitizeErrorForClient;`)();
    const dangerous = new Error('Connection failed at /internal/db/prod-secrets.js:42');
    dangerous.sql = "SELECT * FROM internal_accounts WHERE token='abc'";
    const result = fn(dangerous);
    const serialized = JSON.stringify(result);
    if (serialized.includes('prod-secrets') || serialized.includes('internal_accounts') || serialized.includes('abc')) {
      throw new Error("ผลลัพธ์หลุดข้อมูลภายใน (path/sql/token) ออกไป — ต้อง sanitize ให้หมด");
    }
    if (result.code !== 'INTERNAL_ERROR' || result.message !== 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่') {
      throw new Error("ต้องคืนค่า { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่' } แบบคงที่ทุกครั้ง");
    }
    log("✓ error ภายในถูก sanitize ครบ ไม่หลุด stack/sql/path ออกไป");
  },
  hint: "อย่าไปแตะ property ใดๆ ของ error เลยแม้แต่การอ่าน — return object คงที่ตรงๆ ปลอดภัยที่สุด",
  solution: `function sanitizeErrorForClient(error) {
  return { code: 'INTERNAL_ERROR', message: 'เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่' };
}`
},
  {
  id: "tb_coverage_bug_pipeline",
  meta: "Pillar 4 · บทที่ 4",
  title: "Automation Coverage KPI + Auto-Bug-Filing Pipeline",
  theory: `🎯 <strong>เป้าหมาย:</strong> สอง DX-automation pattern ที่พบจริงในทีม QA ระดับ enterprise:<br/>
    • <strong>Coverage KPI:</strong> เปอร์เซ็นต์ scenario ที่มี automated test จริง เทียบกับ scenario
    ทั้งหมด ติดตามเป็นตัวเลขต่อเนื่อง ไม่ใช่แค่ความรู้สึก<br/>
    • <strong>Auto-bug-filing:</strong> เมื่อ regression run ตามรอบเจอ test ที่ fail ใหม่ (ไม่ fail ใน run
    ก่อนหน้า) ให้ยิง bug อัตโนมัติทันที ไม่รอให้คนมานั่งไล่ log เอง`,
  example: `function percentage(part, total) {
  return Math.round((part / total) * 1000) / 10;
}`,
  task: `เขียนสองฟังก์ชัน:<br/>
    1. <code>calculateCoverageKpi(totalScenarios, automatedScenarios)</code> — คืนค่าเปอร์เซ็นต์
       (ปัดเศษทศนิยม 1 ตำแหน่ง)<br/>
    2. <code>detectNewFailures(previousRunResults, currentRunResults)</code> — ทั้งสองพารามิเตอร์เป็น
       array ของ <code>{ name, passed }</code> คืนค่า Array ของ <code>name</code> ที่ current fail
       (<code>passed === false</code>) แต่ previous ไม่ fail (เทียบด้วย <code>name</code>)`,
  template: `function calculateCoverageKpi(totalScenarios, automatedScenarios) {
  // WRITE YOUR CODE HERE

}

function detectNewFailures(previousRunResults, currentRunResults) {
  // WRITE YOUR CODE HERE

}`,
  validate: (code, log) => {
    const fns = new Function(`${code}\nreturn { calculateCoverageKpi, detectNewFailures };`)();
    const kpi = fns.calculateCoverageKpi(30, 21);
    if (kpi !== 70.0) {
      throw new Error(`calculateCoverageKpi(30, 21) ต้องได้ 70 (21/30 = 70%) แต่ได้ ${kpi}`);
    }
    log("✓ calculateCoverageKpi คำนวณถูกต้อง");
    const previous = [{ name: 'A', passed: true }, { name: 'B', passed: false }, { name: 'C', passed: true }];
    const current = [{ name: 'A', passed: false }, { name: 'B', passed: false }, { name: 'C', passed: true }];
    const newFailures = fns.detectNewFailures(previous, current);
    if (newFailures.length !== 1 || newFailures[0] !== 'A') {
      throw new Error(`detectNewFailures ต้องได้แค่ ['A'] (B fail อยู่แล้วตั้งแต่รอบก่อน ไม่ใช่ของใหม่) แต่ได้ ${JSON.stringify(newFailures)}`);
    }
    log("✓ detectNewFailures ตรวจจับได้เฉพาะ failure ใหม่จริงๆ ไม่รวมของเดิม");
  },
  hint: "detectNewFailures ต้องเช็คว่า current fail 'และ' previous ไม่ fail (ไม่ใช่แค่ current fail อย่างเดียว)",
  solution: `function calculateCoverageKpi(totalScenarios, automatedScenarios) {
  return Math.round((automatedScenarios / totalScenarios) * 1000) / 10;
}

function detectNewFailures(previousRunResults, currentRunResults) {
  const prevMap = Object.fromEntries(previousRunResults.map(r => [r.name, r.passed]));
  return currentRunResults
    .filter(r => !r.passed && prevMap[r.name] !== false)
    .map(r => r.name);
}`
}
];

const PREFIX = 'tb';
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
    <div class="terminal-line info">[Tech Builder Runner] กำลังเริ่มทดสอบ...</div>
    <div class="terminal-line info">กำลังทดสอบฟังก์ชัน ${lesson.id}...</div>
    <div class="terminal-line text-muted">...................................................</div>
  `;

  setTimeout(() => {
    const log = (msg) => {
      terminal.innerHTML += `<div class="terminal-line success">${msg}</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    };

    try {
      lesson.validate(userCode, log);

      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
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
        <div class="terminal-line error">ข้อผิดพลาด: ${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
      `;
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, 600);
}

function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Become a Tech Builder (Agentic Engineering) แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเทคนิค Service Virtualization, Resilient Backend, AST Analysis และ Shift-Left Security ไปใช้งานจริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Become a Tech Builder (Agentic Engineering)');
}

// Run on window boot

  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['tech-builder'] = { id: 'tech-builder', title: 'Become a Tech Builder (Agentic Engineering)', folder: 'Tech-Builder', lessons: LESSONS };
})();
