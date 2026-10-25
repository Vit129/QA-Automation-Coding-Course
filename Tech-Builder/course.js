(function() {
// Become a Tech Builder (Agentic & Concurrency Engineering) — Interactive Coding Playground Data and Logic

// --- Sandbox execution helpers --------------------------------------------------

function stripComments(code) {
  // Char-by-char strip so '//' inside a string literal isn't mistaken for a comment start.
  let result = "";
  let i = 0;
  const n = code.length;
  while (i < n) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let str = ch;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === "\\" && i + 1 < n) {
          str += code[i] + code[i + 1];
          i += 2;
        } else {
          str += code[i];
          i++;
        }
      }
      str += code[i] || "";
      i++;
      result += str;
      continue;
    }
    if (ch === "/" && code[i + 1] === "/") {
      while (i < n && code[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < n && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}

// Runs `code` (the learner's snippet) inside a fresh Function scope with `params` injected as
// parameters, then evaluates `expr` in that same scope and returns its value.
function execLearnerCode(code, params, expr) {
  const names = Object.keys(params);
  const values = names.map((n) => params[n]);
  const factory = new Function(...names, `${code}\nreturn (${expr});`);
  return factory(...values);
}

function getLearnerFn(code, fnName) {
  let fn;
  try {
    fn = execLearnerCode(code, {}, `typeof ${fnName} === "function" ? ${fnName} : undefined`);
  } catch (err) {
    throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
  }
  if (typeof fn !== "function") {
    throw new Error(`ไม่พบการประกาศ function ${fnName}()`);
  }
  return fn;
}

function getLearnerClass(code, className) {
  let cls;
  try {
    cls = execLearnerCode(code, {}, `typeof ${className} === "function" ? ${className} : undefined`);
  } catch (err) {
    throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
  }
  if (typeof cls !== "function") {
    throw new Error(`ไม่พบการประกาศ class ${className}`);
  }
  return cls;
}

// Blanks out the CONTENTS of string/template literals (keeps the quotes, same length) so a
// keyword-presence check (e.g. /\bawait\b/) can't be satisfied by a decoy string like "await"
// that never actually executes as code. Apply on top of stripComments().
function blankStringLiterals(code) {
  let result = "";
  let i = 0;
  const n = code.length;
  while (i < n) {
    const ch = code[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      result += ch;
      i++;
      while (i < n && code[i] !== quote) {
        if (code[i] === "\\" && i + 1 < n) {
          result += "  ";
          i += 2;
        } else {
          result += " ";
          i++;
        }
      }
      if (i < n) {
        result += quote;
        i++;
      }
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}

// Builds a mock async "check" function that proves whether the caller ran calls in PARALLEL
// (all started before any finished — peakActive climbs above 1) or SEQUENTIALLY (peakActive
// stays at 1, one call finishes before the next starts). No real timers — the artificial gap
// is a microtask tick (`await Promise.resolve()`), so this stays fast and deterministic.
function makeConcurrencyProbe() {
  const state = { active: 0, peak: 0 };
  const runCheck = async (id) => {
    state.active++;
    state.peak = Math.max(state.peak, state.active);
    await Promise.resolve();
    await Promise.resolve();
    state.active--;
    return id;
  };
  return { runCheck, state };
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
},

  // MODULE: FUNCTIONAL & CONCURRENCY ENGINEERING
{
    id: "pp_pure_function",
    meta: "Pillar 5 · บทที่ 1",
    title: "Functional Programming: Pure Functions",
    template: `// สถานการณ์: ต้องแปลงค่า timeout (มิลลิวินาที) ของ test config ทั้งชุดให้เป็นวินาที
// โดยห้ามแก้ไข array เดิมที่ส่งเข้ามาเลย (side-effect free)
// 1. เขียน function toSeconds(msValues) รับ array of number (มิลลิวินาที)
//    คืนค่า array ใหม่ที่แต่ละค่าหารด้วย 1000 (เป็นวินาที) โดยไม่แก้ไข array เดิม
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Pure Function ด้วยการรันจริง...");
      const fn = getLearnerFn(code, "toSeconds");

      // Random inputs, expected value computed at runtime — a lookup table keyed by input
      // shape (e.g. `input.length === 3 ? [1,2,3] : [...]`) can't survive fresh random values
      // every run, unlike a fixed pair of fixtures.
      const randomMsArray = () => Array.from(
        { length: 2 + Math.floor(Math.random() * 3) },
        () => (1 + Math.floor(Math.random() * 9)) * 1000
      );

      const input = randomMsArray();
      const inputCopy = [...input];
      const result1 = fn(input);

      if (JSON.stringify(input) !== JSON.stringify(inputCopy)) {
        throw new Error(`toSeconds() ต้องไม่แก้ไข array เดิมที่รับเข้ามา (pure function ห้ามมี side-effect) แต่ input ถูกแก้ไขเป็น ${JSON.stringify(input)}`);
      }
      const expected1 = input.map((ms) => ms / 1000);
      if (JSON.stringify(result1) !== JSON.stringify(expected1)) {
        throw new Error(`toSeconds(${JSON.stringify(input)}) ต้องคืนค่า ${JSON.stringify(expected1)} แต่ได้ ${JSON.stringify(result1)}`);
      }
      const result2 = fn(input);
      if (JSON.stringify(result1) !== JSON.stringify(result2)) {
        throw new Error("เรียก toSeconds() ด้วย input เดิมซ้ำ ต้องได้ผลลัพธ์เดิมทุกครั้ง (deterministic) — pure function ห้ามขึ้นกับ state ภายนอก");
      }
      // Second, independently-random input — same input.length could coincide with the first
      // by chance, but the VALUES differ every run, so a per-length lookup table still fails.
      const input3 = randomMsArray();
      const result3 = fn(input3);
      const expected3 = input3.map((ms) => ms / 1000);
      if (JSON.stringify(result3) !== JSON.stringify(expected3)) {
        throw new Error(`toSeconds(${JSON.stringify(input3)}) ต้องคืนค่า ${JSON.stringify(expected3)} แต่ได้ ${JSON.stringify(result3)} — ต้องคำนวณจริงจาก input ไม่ใช่คืนค่าที่จำไว้ตายตัว`);
      }
      log(`✓ toSeconds() เป็น pure function จริง: ไม่แก้ไข input, ผลลัพธ์ deterministic และคำนวณจริง (${JSON.stringify(result1)}, ${JSON.stringify(result3)})`);
    },
    hint: "ใช้ msValues.map(ms => ms / 1000) — .map() คืนค่า array ใหม่เสมอ ไม่แตะ array เดิม ต่างจากการวนลูปด้วย for แล้ว mutate ค่าเดิมทีละตัว",
    solution: `function toSeconds(msValues) {
  return msValues.map(ms => ms / 1000);
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Pure Function</strong> หัวใจของ Functional Programming<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Pure function มี 2 คุณสมบัติ: (1) <strong>Deterministic</strong> — input เดิมต้องได้ output เดิมเสมอ ไม่ขึ้นกับ state ภายนอกหรือเวลา (2) <strong>No Side Effects</strong> — ไม่แก้ไขค่าที่รับเข้ามา ไม่แก้ไข global state ไม่ทำ I/O ข้างใน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>function toSeconds(msValues) {</code><br/>
<code>&nbsp;&nbsp;return msValues.map(ms => ms / 1000);</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เขียน <code>msValues.forEach((ms, i) => msValues[i] = ms / 1000)</code> ดูเหมือนได้ผลลัพธ์ถูก แต่แก้ไข array เดิมตรงๆ (impure) — caller ที่ยังต้องใช้ array เดิมหลังเรียกฟังก์ชันนี้จะพังเงียบๆ`,
    example: `const ms = [500, 1500];
const seconds = toSeconds(ms);
console.log(ms); // [500, 1500] — ไม่ถูกแก้ไข
console.log(seconds); // [0.5, 1.5]`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function toSeconds(msValues)</code><br/>
    2. คืนค่า array ใหม่ (หารด้วย 1000 ทุกตัว) โดยไม่แก้ไข <code>msValues</code> เดิม`
  },
  {
    id: "pp_immutable_update",
    meta: "Pillar 5 · บทที่ 2",
    title: "Functional Programming: Immutable Update Patterns",
    template: `// สถานการณ์: ต้องเพิ่ม test tag ใหม่เข้าไปในรายการ tags ของ test case โดยไม่แก้ไข array เดิม
// (หลาย component อาจถือ reference ของ array เดิมอยู่ — แก้ตรงๆ จะกระทบที่อื่นโดยไม่ตั้งใจ)
// 1. เขียน function addTag(tags, newTag) รับ array of string และ string ใหม่
//    คืนค่า array ใหม่ที่มี newTag ต่อท้าย โดยไม่ใช้ .push() กับ array เดิม
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Immutable Update ด้วยการรันจริง...");
      const clean = stripComments(code);
      if (/\.push\s*\(/.test(clean)) {
        throw new Error("ห้ามใช้ .push() — มันแก้ไข array เดิมตรงๆ (mutation) ให้สร้าง array ใหม่แทน (เช่น spread operator หรือ .concat())");
      }
      const fn = getLearnerFn(code, "addTag");

      // Random tags/newTag every run — a lookup table keyed by input shape can't survive.
      const TAG_POOL = ['smoke', 'regression', 'auth', 'nightly', 'ui', 'api', 'flaky', 'perf'];
      const randomTags = () => {
        const shuffled = [...TAG_POOL].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 1 + Math.floor(Math.random() * 3));
      };
      const randomNewTag = () => 'tag_' + Math.floor(Math.random() * 100000);

      const checkAddTag = (tags, newTag) => {
        const tagsCopy = [...tags];
        const result = fn(tags, newTag);
        if (JSON.stringify(tags) !== JSON.stringify(tagsCopy)) {
          throw new Error(`addTag() ต้องไม่แก้ไข array เดิม แต่ ${JSON.stringify(tagsCopy)} ถูกแก้ไขเป็น ${JSON.stringify(tags)}`);
        }
        if (result === tags) {
          throw new Error("addTag() ต้องคืนค่า array ใหม่ (reference ต่างจากของเดิม) ไม่ใช่คืนค่า array เดิมที่ถูกแก้ไข");
        }
        const expected = [...tags, newTag];
        if (JSON.stringify(result) !== JSON.stringify(expected)) {
          throw new Error(`addTag(${JSON.stringify(tags)}, ${JSON.stringify(newTag)}) ต้องคืนค่า ${JSON.stringify(expected)} แต่ได้ ${JSON.stringify(result)} — ต้องประกอบผลลัพธ์จริงจาก tags/newTag ไม่ใช่คืนค่าที่จำไว้ตายตัว`);
        }
        return result;
      };

      const result1 = checkAddTag(randomTags(), randomNewTag());
      const result2 = checkAddTag(randomTags(), randomNewTag());
      log(`✓ addTag() คืนค่า array ใหม่ถูกต้อง โดยไม่แก้ไข array เดิม: ${JSON.stringify(result1)}, ${JSON.stringify(result2)}`);
    },
    hint: "return [...tags, newTag]; — spread operator กระจายค่าเดิมทั้งหมดลง array ใหม่ แล้วต่อท้ายด้วยค่าใหม่ ไม่แตะ array เดิมเลย",
    solution: `function addTag(tags, newTag) {
  return [...tags, newTag];
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Immutable Update Pattern</strong> — แก้ไขข้อมูลด้วยการสร้างสำเนาใหม่ ไม่ใช่แก้ไขของเดิม<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>เมื่อหลายส่วนของโปรแกรม (component, closure, หรือ async callback) ถือ reference เดียวกันของ array/object เดิมอยู่ การ mutate ตรงๆ (<code>.push()</code>, <code>.splice()</code>, assign property ตรงๆ) จะกระทบทุกที่ที่ถือ reference นั้นพร้อมกันโดยไม่ตั้งใจ — immutable update สร้างของใหม่แทน ของเดิมไม่เปลี่ยนแปลง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>return [...tags, newTag]; // array ใหม่</code><br/>
<code>return { ...config, timeout: 5000 }; // object ใหม่</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>tags.push(newTag); return tags;</code> ดูเหมือนได้ผลลัพธ์ถูก (คืนค่าที่มี tag ใหม่) แต่แก้ไข array เดิมไปด้วย — ถ้าโค้ดอื่นยังถือ reference เดิมของ <code>tags</code> อยู่ จะเห็นค่าที่เปลี่ยนไปโดยไม่คาดคิด`,
    example: `const tags = ['smoke'];
const updated = addTag(tags, 'critical');
console.log(tags); // ['smoke'] — ไม่ถูกแก้ไข
console.log(updated); // ['smoke', 'critical']`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function addTag(tags, newTag)</code><br/>
    2. คืนค่า array ใหม่ (ต่อท้ายด้วย newTag) โดยไม่ใช้ <code>.push()</code> หรือแก้ไข <code>tags</code> เดิม`
  },
  {
    id: "pp_higher_order_functions",
    meta: "Pillar 5 · บทที่ 3",
    title: "Functional Programming: Higher-Order Functions",
    template: `// สถานการณ์: ต้องสร้างตัวเช็คว่า response time เกิน threshold ที่กำหนดหรือไม่ แต่ threshold ไม่เท่ากันในแต่ละ test
// เขียน function ที่คืนค่า "function ใหม่" ที่จำ threshold ไว้ (higher-order function)
// 1. เขียน function makeThresholdChecker(threshold) คืนค่า function ที่รับ value
//    แล้วคืนค่า true ถ้า value เกิน threshold, false ถ้าไม่เกิน
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Higher-Order Function ด้วยการรันจริง...");
      const fn = getLearnerFn(code, "makeThresholdChecker");

      const checkFast = fn(200);
      const checkStrict = fn(50);

      if (typeof checkFast !== "function" || typeof checkStrict !== "function") {
        throw new Error("makeThresholdChecker(threshold) ต้องคืนค่าเป็น function");
      }
      if (checkFast(300) !== true || checkFast(100) !== false) {
        throw new Error(`checkFast = makeThresholdChecker(200) — checkFast(300) ควรเป็น true, checkFast(100) ควรเป็น false`);
      }
      if (checkStrict(300) !== true || checkStrict(100) !== true || checkStrict(30) !== false) {
        throw new Error(`checkStrict = makeThresholdChecker(50) — checkStrict ต้องเช็คตาม threshold ของตัวเอง (50) ไม่ใช่ threshold ของ checkFast (แต่ละ closure ต้องจำค่าของตัวเองแยกกัน)`);
      }
      log("✓ makeThresholdChecker() สร้าง function ที่จำ threshold ของตัวเองถูกต้อง แยกกันแต่ละ instance");
    },
    hint: "function makeThresholdChecker(threshold) { return (value) => value > threshold; } — arrow function ข้างในจะ 'จำ' ค่า threshold ของตัวเองไว้ผ่าน closure",
    solution: `function makeThresholdChecker(threshold) {
  return (value) => value > threshold;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Higher-Order Function</strong> — function ที่รับ/คืนค่าเป็น function อื่น<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>makeThresholdChecker(200)</code> คืนค่า function ใหม่ที่ "จำ" ค่า 200 ไว้ผ่าน <strong>closure</strong> — เรียกซ้ำด้วย threshold ต่างกันจะได้ function คนละตัว จำค่าของตัวเองแยกกัน ไม่ปนกัน มีประโยชน์มากในงาน QA: สร้างตัวเช็ค (validator/matcher) ที่ config ต่างกันได้โดยไม่ต้องเขียนซ้ำ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>function makeThresholdChecker(threshold) {</code><br/>
<code>&nbsp;&nbsp;return (value) => value > threshold;</code><br/>
<code>}</code><br/>
<code>const checkFast = makeThresholdChecker(200);</code><br/>
<code>checkFast(300); // true</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าใช้ <code>let</code>/global variable แชร์ระหว่างหลาย checker แทนที่จะพึ่ง parameter+closure ของแต่ละ call — checker ตัวหลังจะไปทับค่าของตัวก่อนหน้าโดยไม่ตั้งใจ`,
    example: `const checkFast = makeThresholdChecker(200);
const checkStrict = makeThresholdChecker(50);
checkFast(100);   // false
checkStrict(100); // true`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. <code>makeThresholdChecker(threshold)</code> คืนค่า function<br/>
    2. function ที่คืนค่ามาต้องรับ <code>value</code> แล้วคืนค่า <code>value > threshold</code>`
  },
  {
    id: "pp_map_filter_reduce",
    meta: "Pillar 5 · บทที่ 4",
    title: "Functional Programming: map/filter/reduce แทน Imperative Loop",
    template: `// สถานการณ์: มี array ผลการรัน test เป็น [{ name, passed }, ...] ต้องสรุปว่า test ไหนผ่านบ้าง และผ่านทั้งหมดกี่ตัว
// ห้ามใช้ for/while loop เขียนเอง — ใช้ .filter()/.map()/.reduce() แทน
// 1. เขียน function summarize(results) รับ array ของ { name, passed }
//    คืนค่า { passedNames: [...ชื่อที่ passed true], total: จำนวนที่ passed true }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ map/filter/reduce ด้วยการรันจริง...");
      const clean = stripComments(code);
      if (/\bfor\s*\(|\bwhile\s*\(/.test(clean)) {
        throw new Error("ห้ามใช้ for/while loop — ให้ใช้ .filter()/.map()/.reduce() แทน (โจทย์นี้เน้นสไตล์ functional ไม่ใช่ imperative)");
      }
      if (!/\.filter\s*\(|\.map\s*\(|\.reduce\s*\(/.test(clean)) {
        throw new Error("ต้องใช้อย่างน้อยหนึ่งใน .filter()/.map()/.reduce() จริง ไม่ใช่แค่คืนค่าที่คำนวณไว้ล่วงหน้า");
      }
      const fn = getLearnerFn(code, "summarize");

      // Random pass/fail pattern every run — a lookup table keyed by input shape can't survive.
      const NAME_POOL = ['login_test', 'logout_test', 'signup_test', 'search_test', 'checkout_test', 'profile_test'];
      const checkSummarize = () => {
        const n = 3 + Math.floor(Math.random() * 3);
        const results = Array.from({ length: n }, (_, i) => ({
          name: NAME_POOL[i % NAME_POOL.length] + '_' + i,
          passed: Math.random() > 0.5,
        }));
        const summary = fn(results);
        if (!summary || !Array.isArray(summary.passedNames)) {
          throw new Error("summarize() ต้องคืนค่า object ที่มี passedNames เป็น array");
        }
        const expectedNames = results.filter((r) => r.passed).map((r) => r.name);
        if (JSON.stringify(summary.passedNames) !== JSON.stringify(expectedNames)) {
          throw new Error(`passedNames ต้องมีแค่ชื่อ test ที่ passed:true เรียงตามลำดับเดิม (${JSON.stringify(expectedNames)}) แต่ได้ ${JSON.stringify(summary.passedNames)}`);
        }
        if (summary.total !== expectedNames.length) {
          throw new Error(`total ต้องเท่ากับจำนวน test ที่ passed:true (${expectedNames.length}) แต่ได้ ${summary.total}`);
        }
        return summary;
      };

      const summary1 = checkSummarize();
      const summary2 = checkSummarize();
      log(`✓ summarize() ใช้ filter/map/reduce ได้ผลลัพธ์ถูกต้อง: ${JSON.stringify(summary1)}, ${JSON.stringify(summary2)}`);
    },
    hint: "const passedNames = results.filter(r => r.passed).map(r => r.name); const total = passedNames.length; (หรือใช้ .reduce() นับก็ได้) return { passedNames, total };",
    solution: `function summarize(results) {
  const passedNames = results.filter(r => r.passed).map(r => r.name);
  const total = passedNames.reduce((count) => count + 1, 0);
  return { passedNames, total };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>map/filter/reduce</strong> แทนที่ imperative loop (for/while) สไตล์ functional<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>.filter()</code> เลือกเฉพาะที่ตรงเงื่อนไข, <code>.map()</code> แปลงแต่ละตัวเป็นรูปแบบใหม่, <code>.reduce()</code> พับค่าทั้งหมดให้เหลือค่าเดียว — เชนต่อกันได้ อ่านเป็น "pipeline การแปลงข้อมูล" ชัดเจนกว่า for-loop ที่ต้องไล่อ่านทีละบรรทัดว่า accumulator เปลี่ยนแปลงยังไง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>results.filter(r => r.passed).map(r => r.name)</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใช้ <code>.forEach()</code> แล้ว push เข้า array ภายนอกที่ประกาศไว้ก่อน (mutating accumulator) เป็นการเลียนแบบ for-loop ด้วยหน้าตา functional แต่ไม่ได้ประโยชน์ของ pure transformation จริง — ควรใช้ return value ของ filter/map/reduce ตรงๆ`,
    example: `const results = [{ name: 'a', passed: true }, { name: 'b', passed: false }];
summarize(results); // { passedNames: ['a'], total: 1 }`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function summarize(results)</code> ใช้เฉพาะ <code>.filter()</code>/<code>.map()</code>/<code>.reduce()</code> ห้าม for/while<br/>
    2. คืนค่า <code>{ passedNames, total }</code> ตามที่ระบุ`
  },
  {
    id: "pp_function_composition",
    meta: "Pillar 5 · บทที่ 5",
    title: "Functional Programming: Function Composition",
    template: `// สถานการณ์: ต้องประมวลผล test name ก่อนแสดงผล โดยรวมหลาย transformation (trim -> normalize) เข้าด้วยกัน
// เขียน compose(f, g) ที่รวม 2 function เป็นตัวเดียว: compose(f, g)(x) === f(g(x))
// 1. เขียน function compose(f, g) คืนค่า function ใหม่ที่รับ x แล้วคืนค่า f(g(x))
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Function Composition ด้วยการรันจริง...");
      const compose = getLearnerFn(code, "compose");

      const addOne = (x) => x + 1;
      const double = (x) => x * 2;
      const composed = compose(double, addOne);

      if (typeof composed !== "function") {
        throw new Error("compose(f, g) ต้องคืนค่าเป็น function");
      }
      const result = composed(3);
      const expected = double(addOne(3));
      if (result !== expected) {
        throw new Error(`compose(double, addOne)(3) ต้องเท่ากับ double(addOne(3)) = ${expected} (เรียก g ก่อน แล้วค่อยเรียก f ครอบผลลัพธ์) แต่ได้ ${result}`);
      }
      const reversed = compose(addOne, double);
      const reversedResult = reversed(3);
      if (reversedResult === result) {
        throw new Error("compose(addOne, double) กับ compose(double, addOne) ต้องให้ผลลัพธ์ต่างกัน (ลำดับการเรียกมีผล) — ถ้าได้ผลลัพธ์เท่ากันแปลว่า compose() ไม่ได้เรียงลำดับจริง");
      }
      // Second, different x — closes a "the returned function ignores its argument, only
      // ever computed for x=3" loophole a single call can't catch.
      const result2 = composed(10);
      const expected2 = double(addOne(10));
      if (result2 !== expected2) {
        throw new Error(`composed(10) ต้องเท่ากับ double(addOne(10)) = ${expected2} แต่ได้ ${result2} — function ที่ compose() คืนมาต้องใช้ค่า x ที่รับเข้ามาจริง ไม่ใช่คำนวณไว้ตายตัว`);
      }
      log(`✓ compose(f, g)(x) = f(g(x)) ถูกต้อง: compose(double, addOne)(3) = ${result}, (10) = ${result2}`);
    },
    hint: "function compose(f, g) { return (x) => f(g(x)); } — g ทำงานก่อน (ชั้นในสุด) แล้วผลลัพธ์ค่อยส่งต่อให้ f",
    solution: `function compose(f, g) {
  return (x) => f(g(x));
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Function Composition</strong> — รวม function เล็กๆ หลายตัวเป็น pipeline เดียว<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>compose(f, g)(x) = f(g(x))</code> — <code>g</code> ทำงานก่อน (ใกล้ตัวแปรที่สุด) ผลลัพธ์ของ <code>g</code> ค่อยส่งต่อให้ <code>f</code> ครอบอีกที ลำดับสลับกันได้ผลลัพธ์ต่างกัน — การรวม function เล็กๆ ที่แต่ละตัวทำอย่างเดียว (single responsibility ระดับ function) เป็น pipeline ทำให้อ่าน flow การแปลงข้อมูลได้ง่ายกว่าซ้อน call ตรงๆ หลายชั้น<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const composed = compose(double, addOne);</code><br/>
<code>composed(3); // double(addOne(3)) = double(4) = 8</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> สลับลำดับ <code>f</code>/<code>g</code> โดยไม่ตั้งใจ — <code>compose(f, g)</code> กับ <code>compose(g, f)</code> ให้ผลลัพธ์คนละแบบเสมอ (ยกเว้นบางกรณีพิเศษที่ function สลับที่กันได้)`,
    example: `const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const normalize = compose(lower, trim);
normalize('  LOGIN_TEST  '); // 'login_test'`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function compose(f, g)</code><br/>
    2. คืนค่า function ที่รับ <code>x</code> แล้วคืนค่า <code>f(g(x))</code> (g ทำงานก่อนเสมอ)`
  },
  {
    id: "pp_currying",
    meta: "Pillar 5 · บทที่ 6",
    title: "Functional Programming: Currying",
    template: `// สถานการณ์: ต้องการสร้าง function เปรียบเทียบ status code ที่เรียกทีละ argument ได้ (partial application)
// เขียน curried function: matchStatus(expected)(actual) คืนค่า true/false ว่าตรงกันไหม
// 1. เขียน function matchStatus(expected) คืนค่า function ที่รับ actual
//    แล้วคืนค่า true ถ้า actual === expected, false ถ้าไม่ตรง
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Currying ด้วยการรันจริง...");
      const matchStatus = getLearnerFn(code, "matchStatus");

      const isOk = matchStatus(200);
      if (typeof isOk !== "function") {
        throw new Error("matchStatus(expected) ต้องคืนค่าเป็น function (curried — เรียกทีละ argument)");
      }
      if (matchStatus(200)(200) !== true) {
        throw new Error("matchStatus(200)(200) ต้องคืนค่า true");
      }
      if (matchStatus(200)(404) !== false) {
        throw new Error("matchStatus(200)(404) ต้องคืนค่า false");
      }
      const isNotFound = matchStatus(404);
      if (isNotFound(404) !== true || isNotFound(200) !== false) {
        throw new Error("matchStatus(404) ต้องสร้าง checker ที่จำ 404 ไว้แยกจาก checker อื่น (เรียก matchStatus คนละครั้งต้องได้ function ที่จำค่าของตัวเองถูกต้อง)");
      }
      if (isOk(200) !== true || isOk(404) !== false) {
        throw new Error("isOk = matchStatus(200) เรียกซ้ำหลายครั้งหลังจากสร้าง isNotFound แล้ว ต้องยังจำ 200 ไว้ถูกต้อง ไม่ถูกเปลี่ยนโดย matchStatus(404) ที่เรียกทีหลัง");
      }
      log("✓ matchStatus() เป็น curried function ที่ถูกต้อง แต่ละ instance จำค่าของตัวเองแยกกัน");
    },
    hint: "function matchStatus(expected) { return (actual) => actual === expected; } — เรียก matchStatus(200) ครั้งแรกได้ function กลับมา แล้วค่อยเรียก (actual) ทีหลัง",
    solution: `function matchStatus(expected) {
  return (actual) => actual === expected;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Currying</strong> — แปลง function หลาย argument ให้เรียกทีละตัวได้ (partial application)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Curried function รับ argument ทีละตัว คืนค่า function ใหม่รอรับตัวถัดไป จนกว่าจะครบ — <code>matchStatus(200)</code> ยังไม่ได้ผลลัพธ์สุดท้าย แต่ได้ checker ที่ "จำ" 200 ไว้แล้ว รอรับ <code>actual</code> ต่อ มีประโยชน์ในงาน QA: สร้าง matcher/validator ที่ config บางส่วนไว้ล่วงหน้า แล้วนำไปใช้ซ้ำกับหลาย test case<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const isOk = matchStatus(200);</code><br/>
<code>isOk(200); // true</code><br/>
<code>isOk(404); // false</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เก็บ <code>expected</code> ไว้ใน shared/global variable แทนที่จะพึ่ง closure ของแต่ละ call ของ <code>matchStatus()</code> — จะทำให้ <code>matchStatus(404)</code> ไปเปลี่ยนพฤติกรรมของ <code>isOk</code> ที่สร้างไว้ก่อนหน้าโดยไม่ตั้งใจ`,
    example: `const isOk = matchStatus(200);
const isNotFound = matchStatus(404);
isOk(200);       // true
isNotFound(200); // false`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function matchStatus(expected)</code><br/>
    2. คืนค่า function ที่รับ <code>actual</code> แล้วคืนค่า <code>actual === expected</code>`
  },
  {
    id: "pp_async_await",
    meta: "Pillar 6 · บทที่ 1",
    title: "Concurrency: async/await พื้นฐาน",
    template: `// สถานการณ์: ต้องเขียน function ที่ "รอ" ผลลัพธ์แบบ async (จำลองการเรียก backend ด้วย Promise)
// 1. เขียน async function checkStatus(id) ที่:
//    - await ค่าจาก new Promise(resolve => resolve(id % 2 === 0 ? 'passed' : 'failed'))
//    - return ค่าที่ await ได้ (string 'passed' หรือ 'failed')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ async/await ด้วยการรันจริง...");
      const keywordCheck = blankStringLiterals(stripComments(code));
      if (!/\basync\b/.test(keywordCheck)) {
        throw new Error("checkStatus ต้องประกาศด้วย async function จริง (ห้ามแค่คืนค่า Promise ตรงๆ จาก function ธรรมดา)");
      }
      if (!/\bawait\b/.test(keywordCheck)) {
        throw new Error("checkStatus ต้องใช้ await จริงข้างใน (ห้าม return Promise ตรงๆ โดยไม่ await)");
      }
      const fn = getLearnerFn(code, "checkStatus");

      const maybePromise = fn(2);
      if (!maybePromise || typeof maybePromise.then !== "function") {
        throw new Error("checkStatus ต้องเป็น async function (เรียกแล้วต้องได้ Promise กลับมา ไม่ใช่ค่าตรงๆ)");
      }
      return Promise.all([fn(2), fn(3), fn(4), fn(7)]).then(([r2, r3, r4, r7]) => {
        if (r2 !== 'passed') {
          throw new Error(`checkStatus(2) ต้อง resolve เป็น 'passed' (เลขคู่) แต่ได้ ${JSON.stringify(r2)}`);
        }
        if (r3 !== 'failed') {
          throw new Error(`checkStatus(3) ต้อง resolve เป็น 'failed' (เลขคี่) แต่ได้ ${JSON.stringify(r3)}`);
        }
        if (r4 !== 'passed' || r7 !== 'failed') {
          throw new Error(`checkStatus(4) ต้องเป็น 'passed' และ checkStatus(7) ต้องเป็น 'failed' (เช็คตามเงื่อนไข id%2 จริง ไม่ใช่จำคำตอบไว้เฉพาะ id=2/3) แต่ได้ ${JSON.stringify(r4)}/${JSON.stringify(r7)}`);
        }
        log(`✓ checkStatus() เป็น async function ที่ await ค่าถูกต้อง: 2='${r2}', 3='${r3}', 4='${r4}', 7='${r7}'`);
      });
    },
    hint: "async function checkStatus(id) { const result = await new Promise(resolve => resolve(id % 2 === 0 ? 'passed' : 'failed')); return result; }",
    solution: `async function checkStatus(id) {
  const result = await new Promise(resolve => resolve(id % 2 === 0 ? 'passed' : 'failed'));
  return result;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>async/await</strong> พื้นฐาน — วิธีเขียนโค้ด asynchronous ให้อ่านเหมือน synchronous<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>async function</code> คืนค่าเป็น <code>Promise</code> เสมอ (แม้ข้างในจะ <code>return</code> ค่าธรรมดา) — <code>await</code> "หยุดรอ" จนกว่า Promise จะ resolve แล้วค่อยไปบรรทัดถัดไป โดยไม่บล็อก thread อื่น (JavaScript ยังทำงานอย่างอื่นต่อได้ระหว่างรอ)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>async function checkStatus(id) {</code><br/>
<code>&nbsp;&nbsp;const result = await somePromise;</code><br/>
<code>&nbsp;&nbsp;return result;</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม <code>await</code> หน้า Promise — จะได้ <code>[object Promise]</code> แทนค่าจริง (โค้ดยังทำงานต่อไปโดยไม่รอผลลัพธ์)`,
    example: `const status = await checkStatus(2);
console.log(status); // 'passed'`,
    task: `จงเขียน async function ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>async function checkStatus(id)</code><br/>
    2. <code>await</code> ค่าจาก Promise แล้ว return ผลลัพธ์ตามเงื่อนไข`
  },
  {
    id: "pp_promise_all_parallel",
    meta: "Pillar 6 · บทที่ 2",
    title: "Concurrency: Promise.all Parallelism",
    template: `// สถานการณ์: ต้องเช็คผล test หลายตัว "พร้อมกัน" (parallel) แทนที่จะรอทีละตัว (sequential) เพื่อความเร็ว
// runCheck(id) ที่ให้มา คืนค่า Promise ที่ resolve เป็น id (จำลองยิง API เช็คผลแบบ async)
// 1. เขียน async function runAllChecks(runCheck, ids) รับ function runCheck และ array of id
//    ต้องเริ่มเรียก runCheck ทุก id "พร้อมกัน" จริง (ผ่าน Promise.all) ห้ามใช้ for/while ที่ await ทีละตัว
//    คืนค่า array ของผลลัพธ์ เรียงตามลำดับ ids เดิม
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Promise.all Parallelism ด้วยการรันจริง (concurrency proof)...");
      const clean = stripComments(code);
      if (/\bfor\s*\(|\bwhile\s*\(/.test(clean)) {
        throw new Error("ห้ามใช้ for/while loop ที่ await ทีละตัว (sequential) — ต้องใช้ Promise.all() เริ่มยิงทุกตัวพร้อมกันจริง");
      }
      const fn = getLearnerFn(code, "runAllChecks");
      const probe = makeConcurrencyProbe();
      const ids = [1, 2, 3, 4, 5];

      return Promise.resolve(fn(probe.runCheck, ids)).then((result) => {
        if (JSON.stringify(result) !== JSON.stringify(ids)) {
          throw new Error(`runAllChecks() ต้องคืนค่าผลลัพธ์เรียงตามลำดับ ids เดิม [${ids}] แต่ได้ ${JSON.stringify(result)}`);
        }
        if (probe.state.peak <= 1) {
          throw new Error(`runCheck() ทุกตัวถูกเรียกทีละตัว (peak concurrent = ${probe.state.peak}) — ต้องเริ่มเรียกทุก id พร้อมกันจริงผ่าน Promise.all(ids.map(runCheck)) ไม่ใช่ await ทีละตัวในลูป`);
        }
        log(`✓ runAllChecks() เรียก runCheck() พร้อมกันจริง (peak concurrent = ${probe.state.peak} จาก ${ids.length} ids) ผลลัพธ์เรียงถูกต้อง`);
      });
    },
    hint: "async function runAllChecks(runCheck, ids) { return Promise.all(ids.map(id => runCheck(id))); } — .map() สร้าง Promise ทุกตัวพร้อมกันก่อน แล้ว Promise.all() ค่อยรอทุกตัว",
    solution: `async function runAllChecks(runCheck, ids) {
  return Promise.all(ids.map(id => runCheck(id)));
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Promise.all()</strong> สำหรับรัน async operation หลายตัว "พร้อมกัน" จริง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>ids.map(id => runCheck(id))</code> เรียก <code>runCheck</code> ทุกตัว<strong>ทันที</strong>ในรอบเดียว (แต่ละตัวเริ่มทำงานพร้อมกัน ไม่รอกัน) ได้ array ของ Promise แล้ว <code>Promise.all()</code> รอให้ทุกตัว resolve — เทียบกับเขียน <code>for (const id of ids) { await runCheck(id); }</code> ที่ต้องรอ id แรก resolve เสร็จก่อนถึงเริ่ม id ถัดไป (ช้ากว่ามากเมื่อมีหลาย async call ที่เป็นอิสระต่อกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const results = await Promise.all(ids.map(id => runCheck(id)));</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เขียน <code>for (const id of ids) { results.push(await runCheck(id)); }</code> ได้ผลลัพธ์ถูกต้องเหมือนกัน แต่ทำงาน<strong>ทีละตัว</strong> (sequential) — ถ้าแต่ละ call ใช้เวลา 100ms และมี 10 ตัว จะใช้เวลารวม ~1000ms แทนที่จะเป็น ~100ms ถ้าทำพร้อมกัน`,
    example: `const results = await runAllChecks(runCheck, [1, 2, 3]);
// runCheck(1), runCheck(2), runCheck(3) เริ่มพร้อมกันทั้งหมด`,
    task: `จงเขียน async function ให้สมบูรณ์ โดย:<br/>
    1. <code>runAllChecks(runCheck, ids)</code> ต้องเรียก <code>runCheck</code> ทุก id พร้อมกันผ่าน <code>Promise.all()</code><br/>
    2. คืนค่า array ผลลัพธ์เรียงตามลำดับ ids เดิม`
  },
  {
    id: "pp_race_condition_fix",
    meta: "Pillar 6 · บทที่ 3",
    title: "Concurrency: Race Conditions & Async-Safe State",
    template: `// สถานการณ์: SafeCounter ต้องรองรับการเรียก increment() พร้อมกันหลายครั้ง (concurrent)
// โดยไม่เสีย update ไปเลย (race condition) — ปัญหาคลาสสิกเมื่อหลาย async call แก้ shared state ร่วมกัน
// 1. เขียน class SafeCounter ที่มี:
//    - constructor() ตั้ง this.count = 0
//    - async increment(): ต้องจำลอง "อ่านช้า" ด้วย
//        const cur = this.count; await Promise.resolve(); this.count = cur + 1;
//      แต่ต้องทำให้ increment() ที่ถูกเรียกพร้อมกันหลายครั้ง "เรียงคิว" กัน ไม่ทับซ้อนกัน
//      (ใช้ promise-chain queue/mutex — เก็บ Promise ล่าสุดไว้ แล้ว .then() ต่อกันไปเรื่อยๆ)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Race Condition Fix ด้วยการรันจริง (concurrent increment)...");
      const keywordCheck = blankStringLiterals(stripComments(code));
      // Mandate the EXACT vulnerable shape the task specifies (read this.count into a
      // variable, THEN await, THEN write back using that variable) — not just "await appears
      // somewhere". A one-liner `this.count++` (no read-await-write split) or a decoy string
      // literal containing the word "await" would otherwise slip through: the former never
      // creates a race window in the first place (JS can't interleave inside one synchronous
      // statement), so it "passes" without demonstrating the fix the lesson is about.
      const readMatch = /(?:const|let)\s+(\w+)\s*=\s*this\.count\b/.exec(keywordCheck);
      if (!readMatch) {
        throw new Error("increment() ต้องอ่านค่า this.count เก็บไว้ในตัวแปรก่อน (เช่น const cur = this.count;) ตามที่โจทย์จำลอง 'อ่านช้า' ไว้ — เขียน this.count++ ตรงๆ บรรทัดเดียวไม่มีช่วงเวลาเสี่ยง race condition ให้ต้องแก้เลย จึงไม่ได้แสดงว่าแก้ปัญหาจริง");
      }
      const varName = readMatch[1];
      const afterRead = keywordCheck.slice(readMatch.index + readMatch[0].length);
      if (!/\bawait\b/.test(afterRead)) {
        throw new Error("ต้องมี await หลังจากอ่านค่า this.count เก็บไว้ในตัวแปร (จำลอง 'อ่านช้า' ตามที่โจทย์กำหนด)");
      }
      const afterAwait = afterRead.slice(afterRead.search(/\bawait\b/));
      if (!new RegExp(`this\\.count\\s*=\\s*[^;]*\\b${varName}\\b`).test(afterAwait)) {
        throw new Error(`ต้องเขียนค่ากลับที่ this.count โดยใช้ตัวแปร ${varName} ที่อ่านไว้ก่อนหน้า (เช่น this.count = ${varName} + 1;) หลังจาก await เสร็จ ตามที่โจทย์จำลอง 'อ่านช้า' ไว้`);
      }
      const SafeCounter = getLearnerClass(code, "SafeCounter");
      const counter = new SafeCounter();
      const N = 5;

      const calls = Array.from({ length: N }, () => counter.increment());
      if (!calls.every((c) => c && typeof c.then === "function")) {
        throw new Error("increment() ต้องคืนค่าเป็น Promise (thenable) ทุกครั้ง — ถ้า increment() เป็น synchronous function ธรรมดา แปลว่าไม่ได้แก้ปัญหา async race condition ตามที่โจทย์ตั้งใจสอน");
      }
      return Promise.all(calls).then(() => {
        if (counter.count !== N) {
          throw new Error(`เรียก increment() พร้อมกัน ${N} ครั้ง count สุดท้ายต้องเท่ากับ ${N} พอดี (ไม่เสีย update จาก race condition) แต่ได้ ${counter.count} — ต้องเรียงคิว increment() ไม่ให้ read-modify-write ของแต่ละครั้งทับซ้อนกัน (promise-chain mutex)`);
        }
        log(`✓ SafeCounter รองรับ increment() พร้อมกัน ${N} ครั้งถูกต้อง ไม่เสีย update เลย (count = ${counter.count})`);
      });
    },
    hint: "constructor() { this.count = 0; this._queue = Promise.resolve(); } increment() { this._queue = this._queue.then(async () => { const cur = this.count; await Promise.resolve(); this.count = cur + 1; }); return this._queue; } — เก็บ Promise ล่าสุดไว้ที่ this._queue แล้ว .then() ต่อท้ายเรื่อยๆ ทำให้แต่ละ increment() ต้องรอตัวก่อนหน้าทำเสร็จก่อนเสมอ",
    solution: `class SafeCounter {
  constructor() {
    this.count = 0;
    this._queue = Promise.resolve();
  }

  increment() {
    this._queue = this._queue.then(async () => {
      const cur = this.count;
      await Promise.resolve();
      this.count = cur + 1;
    });
    return this._queue;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Race Condition</strong> และวิธีป้องกันด้วย promise-chain mutex (async-safe state)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ถ้า <code>increment()</code> อ่านค่า <code>this.count</code> แล้ว <code>await</code> (จำลองงานช้า) ก่อนเขียนค่ากลับ — เมื่อถูกเรียกพร้อมกันหลายครั้ง แต่ละ call จะ "อ่าน" ค่าเดิมก่อนที่ call อื่นจะ "เขียน" ค่าใหม่เสร็จ ทำให้ update บาง call หายไป (เขียนทับกัน) นี่คือ <strong>race condition</strong> — วิธีแก้: เก็บ Promise ล่าสุดไว้เป็น "คิว" แล้วต่อ <code>.then()</code> ให้แต่ละ increment() ต้องรอตัวก่อนหน้าทำงานเสร็จก่อนเสมอ (serialize) เหมือน mutex/lock ในภาษาที่มี thread จริง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>this._queue = this._queue.then(() => { /* งานที่ต้อง serialize */ });</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เขียน <code>increment()</code> แบบไม่มีคิว (แค่ <code>const cur = this.count; await Promise.resolve(); this.count = cur + 1;</code> ตรงๆ) — เรียกพร้อมกัน 5 ครั้งจะได้ count ประมาณ 1 ไม่ใช่ 5 เพราะทุก call อ่านค่า 0 ก่อนจะมี call ไหนเขียนค่าใหม่เสร็จ`,
    example: `const counter = new SafeCounter();
await Promise.all([counter.increment(), counter.increment(), counter.increment()]);
console.log(counter.count); // 3 (ไม่ใช่ 1)`,
    task: `จงเขียน class <code>SafeCounter</code> ให้สมบูรณ์ โดย:<br/>
    1. <code>increment()</code> จำลองอ่านช้าตามที่ระบุ<br/>
    2. ใช้ promise-chain queue ทำให้เรียกพร้อมกันหลายครั้งแล้ว count ไม่เสีย update`
  },
  {
    id: "pp_event_loop_ordering",
    meta: "Pillar 6 · บทที่ 4",
    title: "Concurrency: Event Loop — Microtask vs Macrotask",
    template: `// สถานการณ์: ต้องเข้าใจว่าทำไม Promise.then() ทำงานก่อน setTimeout(fn, 0) เสมอ (microtask มาก่อน macrotask)
// 1. เขียน function logOrder(log) ที่เรียก log() ตามลำดับที่ควรเกิดขึ้นจริง: 'start', 'end', 'promise', 'timeout'
//    โดยใช้ setTimeout(...) และ Promise.resolve().then(...) จริง (ห้าม hardcode เรียก log ตรงๆ ตามลำดับ)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Event Loop Ordering ด้วยการรันจริง...");
      const clean = stripComments(code);
      if (!/setTimeout\s*\(/.test(clean)) {
        throw new Error("ต้องใช้ setTimeout(...) จริง (macrotask) ห้าม hardcode ลำดับการเรียก log");
      }
      if (!/Promise\.resolve\s*\(\s*\)\s*\.then\s*\(|\.then\s*\(/.test(clean)) {
        throw new Error("ต้องใช้ Promise.then(...) จริง (microtask) ห้าม hardcode ลำดับการเรียก log");
      }
      const fn = getLearnerFn(code, "logOrder");
      const order = [];

      return new Promise((resolve, reject) => {
        try {
          fn((msg) => order.push(msg));
        } catch (err) {
          reject(err);
          return;
        }
        // Flush the microtask queue ONCE (via a bare Promise.then) before any real macrotask
        // can fire — per spec the microtask queue always drains completely (including any
        // chained .then()s the learner's code enqueued) before the next macrotask runs. If
        // 'timeout' already shows up here, the learner logged it from inside a microtask
        // chain instead of a real setTimeout callback — the whole point of this lesson.
        Promise.resolve().then(() => {
          const afterMicrotasks = [...order];
          setTimeout(() => {
            try {
              if (afterMicrotasks.includes('timeout')) {
                throw new Error(`'timeout' ถูก log ไปแล้วก่อนที่ macrotask จริงจะทำงาน (สถานะตอนเช็ค microtask queue: ${JSON.stringify(afterMicrotasks)}) — ต้อง log 'timeout' จากใน setTimeout callback จริงๆ ห้ามซ่อนไว้ใน Promise.then()`);
              }
              const expected = ['start', 'end', 'promise', 'timeout'];
              if (JSON.stringify(order) !== JSON.stringify(expected)) {
                throw new Error(`ลำดับที่ได้คือ ${JSON.stringify(order)} แต่ควรเป็น ${JSON.stringify(expected)} — microtask (Promise.then) ต้องทำงานก่อน macrotask (setTimeout) เสมอ ไม่ว่า setTimeout จะถูกเรียกก่อนในโค้ดก็ตาม`);
              }
              log(`✓ ลำดับ event loop ถูกต้อง: ${JSON.stringify(order)}`);
              resolve();
            } catch (err) {
              reject(err);
            }
          }, 20);
        });
      });
    },
    hint: "function logOrder(log) { log('start'); setTimeout(() => log('timeout'), 0); Promise.resolve().then(() => log('promise')); log('end'); } — setTimeout ถูกเรียกก่อนในโค้ด แต่ macrotask ต้องรอ microtask queue ว่างก่อนเสมอ",
    solution: `function logOrder(log) {
  log('start');
  setTimeout(() => log('timeout'), 0);
  Promise.resolve().then(() => log('promise'));
  log('end');
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Event Loop</strong> — ลำดับการทำงานระหว่าง synchronous code, microtask (Promise), และ macrotask (setTimeout)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>JavaScript รัน synchronous code ก่อนเสมอจนหมด (<code>'start'</code>, <code>'end'</code>) จากนั้นเคลียร์ <strong>microtask queue</strong> ทั้งหมด (<code>Promise.then</code>) ก่อน แล้วค่อยไปหยิบ <strong>macrotask</strong> ถัดไป (<code>setTimeout</code>) มารัน — แม้ <code>setTimeout(fn, 0)</code> จะถูกเรียกก่อน <code>Promise.then()</code> ในโค้ด แต่ <code>Promise.then()</code> จะทำงานก่อนเสมอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>ลำดับ: Synchronous code → Microtask queue (Promise) → Macrotask queue (setTimeout)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> คิดว่า <code>setTimeout(fn, 0)</code> จะรันทันที (0ms) เพราะ delay เป็น 0 — ที่จริงมันแค่หมายถึง "รอ macrotask queue คิวถัดไป" ซึ่งต้องรอให้ microtask ทั้งหมดในรอบนั้นทำงานให้เสร็จก่อนเสมอ`,
    example: `logOrder(console.log);
// เห็นผล: start, end, promise, timeout`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. <code>logOrder(log)</code> ใช้ <code>setTimeout</code> และ <code>Promise.then</code> จริง<br/>
    2. เรียก log() ตามลำดับที่เกิดขึ้นจริงตาม event loop: <code>'start'</code>, <code>'end'</code>, <code>'promise'</code>, <code>'timeout'</code>`
  },
  {
    id: "pp_worker_thread_concept",
    meta: "Pillar 6 · บทที่ 5",
    title: "Concurrency: Worker Threads (แนวคิด)",
    template: `// สถานการณ์: มีงานคำนวณหนัก (heavy computation) ที่จะไปบล็อก main thread ถ้ารันตรงๆ
// ต้องแยกไปรันใน Worker thread แทน (บทนี้เป็นแนวคิด — ตรวจแบบ static text เพราะ sandbox นี้รัน JS เดี่ยว
// ไม่มี Worker environment จริงให้รัน เหมือนบทเรียน TypeScript ของ OOP-Fundamentals)
// 1. เขียนโค้ดสร้าง Worker ใหม่ด้วย new Worker('heavy-task.js')
// 2. ส่งงานเข้าไปด้วย worker.postMessage(...)
// 3. รับผลลัพธ์กลับผ่าน worker.onmessage = (event) => { ... }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Worker Thread Concept...");
      const clean = stripComments(code);
      if (!/new\s+Worker\s*\(/.test(clean)) {
        throw new Error("ไม่พบการสร้าง new Worker(...)");
      }
      if (!/\.postMessage\s*\(/.test(clean)) {
        throw new Error("ไม่พบการส่งงานเข้า worker ด้วย .postMessage(...)");
      }
      if (!/\.onmessage\s*=/.test(clean)) {
        throw new Error("ไม่พบการรับผลลัพธ์กลับด้วย .onmessage = ...");
      }
      log("✓ สร้าง Worker, ส่งงานด้วย postMessage, รับผลลัพธ์ด้วย onmessage ถูกต้อง");
    },
    hint: "const worker = new Worker('heavy-task.js'); worker.postMessage({ data: 'compute this' }); worker.onmessage = (event) => { console.log(event.data); };",
    solution: `const worker = new Worker('heavy-task.js');
worker.postMessage({ data: 'compute this' });
worker.onmessage = (event) => {
  console.log('result:', event.data);
};`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิด <strong>Worker Threads</strong> — รันงานหนักแยกจาก main thread เพื่อไม่ให้ UI/event loop ค้าง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>JavaScript ปกติทำงานแบบ single-threaded — งานคำนวณหนัก (image processing, heavy loop) จะบล็อก event loop ทำให้หน้าเว็บค้าง <code>Worker</code> รันโค้ดใน thread แยกจริง สื่อสารกับ main thread ผ่าน message passing (<code>postMessage</code>/<code>onmessage</code>) เท่านั้น ไม่แชร์ memory ตรงๆ (ต่างจาก thread ในภาษาอื่นที่แชร์ memory ได้ จึงไม่มีปัญหา race condition แบบ shared-state เหมือนบทก่อนหน้า)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const worker = new Worker('heavy-task.js');</code><br/>
<code>worker.postMessage(data);</code><br/>
<code>worker.onmessage = (event) => { /* ใช้ event.data */ };</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> คาดหวังว่า worker จะเข้าถึงตัวแปร/DOM ของ main thread ได้ตรงๆ — Worker สื่อสารได้เฉพาะผ่าน message passing เท่านั้น ส่ง function หรือ DOM element เข้าไปตรงๆ ไม่ได้`,
    example: `// heavy-task.js (ไฟล์แยก รันใน worker thread)
onmessage = (event) => {
  const result = heavyComputation(event.data);
  postMessage(result);
};`,
    task: `จงเขียนโค้ดให้สมบูรณ์ โดยมี:<br/>
    1. <code>new Worker(...)</code><br/>
    2. <code>.postMessage(...)</code><br/>
    3. <code>.onmessage = ...</code>`
  },
  {
    id: "pp_parallel_test_capstone",
    meta: "Pillar 6 · บทที่ 6 (Capstone)",
    title: "Mini Capstone: รัน Test Suite แบบ Parallel + สรุปผลแบบ Functional",
    template: `// สถานการณ์ (Capstone ปิดท้ายเทรคนี้): รวม Concurrency (Promise.all) + Functional (map/reduce) เข้าด้วยกัน
// testCases คือ array ของ { name, run } โดย run() คืนค่า Promise<boolean> (true = passed)
// 1. เขียน async function runSuite(testCases) ที่:
//    - รัน testCases.run() ทุกตัว "พร้อมกัน" ผ่าน Promise.all (ห้าม for/while await ทีละตัว)
//    - ใช้ .map()/.reduce() สรุปผลลัพธ์ (ห้าม for/while)
//    - คืนค่า { total: จำนวน testCases ทั้งหมด, passed: จำนวนที่ true }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Mini Capstone (Parallel + Functional) ด้วยการรันจริง...");
      const clean = stripComments(code);
      if (/\bfor\s*\(|\bwhile\s*\(/.test(clean)) {
        throw new Error("ห้ามใช้ for/while loop — ทั้งการรัน testCases (ต้องพร้อมกันผ่าน Promise.all) และการสรุปผล (ต้องใช้ map/reduce)");
      }
      if (!/\.map\s*\(/.test(clean) || !/\.reduce\s*\(/.test(clean)) {
        throw new Error("ต้องใช้ทั้ง .map() และ .reduce() จริง (ตามที่โจทย์ระบุ) ไม่ใช่แค่คืนค่าที่คำนวณไว้ล่วงหน้า");
      }
      if (!/Promise\.all\s*\(/.test(clean)) {
        throw new Error("ต้องใช้ Promise.all(...) จริงในการรัน testCases พร้อมกัน");
      }
      const fn = getLearnerFn(code, "runSuite");

      // Random pass/fail pattern (and random length) every run — a lookup table keyed by
      // testCases.length can't survive fresh random values every run.
      const runRandomSuite = () => {
        // Wide length range so a hardcoded 2-branch lookup table (e.g. "n===4 ? A : B") has
        // negligible odds of coincidentally matching both the random length AND the random
        // pass-count on any given run — narrower ranges were empirically shown to collide
        // often enough to matter (see PLAYBOOK CASE-005 addendum).
        const n = 5 + Math.floor(Math.random() * 8);
        const probe = makeConcurrencyProbe();
        const pattern = Array.from({ length: n }, () => Math.random() > 0.5);
        const testCases = pattern.map((p, i) => ({ name: 'test_' + i, run: () => probe.runCheck(p) }));
        const expectedPassed = pattern.filter(Boolean).length;

        return Promise.resolve(fn(testCases)).then((summary) => {
          if (!summary || typeof summary.total !== "number" || typeof summary.passed !== "number") {
            throw new Error("runSuite() ต้องคืนค่า object { total, passed } ที่เป็นตัวเลข");
          }
          if (summary.total !== n) {
            throw new Error(`total ต้องเท่ากับจำนวน testCases ทั้งหมด (${n}) แต่ได้ ${summary.total}`);
          }
          if (summary.passed !== expectedPassed) {
            throw new Error(`passed ต้องเท่ากับจำนวนที่ run() คืนค่า true (${expectedPassed}) แต่ได้ ${summary.passed}`);
          }
          if (probe.state.peak <= 1) {
            throw new Error(`testCases.run() ทุกตัวถูกเรียกทีละตัว (peak concurrent = ${probe.state.peak}) — ต้องรันพร้อมกันจริงผ่าน Promise.all`);
          }
          return summary;
        });
      };

      return runRandomSuite().then((summary1) => runRandomSuite().then((summary2) => runRandomSuite().then((summary3) => {
        log(`✓ runSuite() รันพร้อมกันจริงและสรุปผลถูกต้องทั้งสามชุดข้อมูลสุ่ม: ${JSON.stringify(summary1)}, ${JSON.stringify(summary2)}, ${JSON.stringify(summary3)}`);
      })));
    },
    hint: "async function runSuite(testCases) { const results = await Promise.all(testCases.map(tc => tc.run())); const passed = results.reduce((count, r) => count + (r ? 1 : 0), 0); return { total: testCases.length, passed }; }",
    solution: `async function runSuite(testCases) {
  const results = await Promise.all(testCases.map(tc => tc.run()));
  const passed = results.reduce((count, r) => count + (r ? 1 : 0), 0);
  return { total: testCases.length, passed };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ผสาน <strong>Concurrency</strong> (Promise.all) และ <strong>Functional Programming</strong> (map/reduce) เข้าด้วยกันในสถานการณ์เดียว ปิดท้าย Programming Paradigms track<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>testCases.map(tc => tc.run())</code> เริ่มรันทุก test case พร้อมกัน (concurrency) แล้ว <code>Promise.all()</code> รอผลลัพธ์ทั้งหมด จากนั้น <code>.reduce()</code> พับผลลัพธ์ (functional) ให้เหลือค่าสรุปเดียว — รวมสองแนวคิดที่เรียนมาทั้งเทรคเข้าด้วยกันในโจทย์เดียวที่ใกล้เคียงงานจริง (parallel test runner)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const results = await Promise.all(testCases.map(tc => tc.run()));</code><br/>
<code>const passed = results.reduce((count, r) => count + (r ? 1 : 0), 0);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> รัน test case ทีละตัวด้วย <code>for...of</code> + <code>await</code> ในลูป ได้ผลลัพธ์ถูกต้องเหมือนกันแต่ทำลาย benefit ของ parallel execution ที่โจทย์ต้องการพิสูจน์`,
    example: `const summary = await runSuite(testCases);
console.log(summary); // { total: 4, passed: 3 }`,
    task: `จงเขียน async function <code>runSuite(testCases)</code> ให้สมบูรณ์:<br/>
    1. รัน <code>run()</code> ของทุก testCase พร้อมกันผ่าน <code>Promise.all</code><br/>
    2. สรุปผลด้วย <code>.map()</code>/<code>.reduce()</code> คืนค่า <code>{ total, passed }</code>`
  }
];

const PREFIX = 'tb';

const PP_MIGRATION_IDS = [
  'pp_pure_function',
  'pp_immutable_update',
  'pp_higher_order_functions',
  'pp_map_filter_reduce',
  'pp_function_composition',
  'pp_currying',
  'pp_async_await',
  'pp_promise_all_parallel',
  'pp_race_condition_fix',
  'pp_event_loop_ordering',
  'pp_worker_thread_concept',
  'pp_parallel_test_capstone',
];

function migrateParadigmsProgress() {
  if (typeof localStorage === 'undefined') return;
  try {
    for (const id of PP_MIGRATION_IDS) {
      const oldCompletedKey = 'pp_course_completed_' + id;
      const newCompletedKey = PREFIX + '_course_completed_' + id;
      if (localStorage.getItem(oldCompletedKey) === 'true' && !localStorage.getItem(newCompletedKey)) {
        localStorage.setItem(newCompletedKey, 'true');
      }
      const oldCodeKey = 'pp_sandbox_code_' + id;
      const newCodeKey = PREFIX + '_sandbox_code_' + id;
      const oldCode = localStorage.getItem(oldCodeKey);
      if (oldCode && !localStorage.getItem(newCodeKey)) {
        localStorage.setItem(newCodeKey, oldCode);
      }
    }
  } catch (e) {
    // Non-blocking in restricted storage
  }
}
migrateParadigmsProgress();

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
      terminal.innerHTML += `<div class="terminal-line success">${escapeHtml(msg)}</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    };

    const onPassed = () => {
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
      terminal.scrollTop = terminal.scrollHeight;
    };

    const onFailed = (err) => {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">ข้อผิดพลาด: ${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
      `;
      terminal.scrollTop = terminal.scrollHeight;
    };

    try {
      Promise.resolve(lesson.validate(userCode, log)).then(onPassed).catch(onFailed);
    } catch (err) {
      onFailed(err);
    }
  }, 600);
}

function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Become a Tech Builder (Agentic & Concurrency Engineering) แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเทคนิค Service Virtualization, Resilient Backend, AST Analysis, Shift-Left Security, Functional Pipelines และ Concurrency Management ไปสร้างและคุมระบบจริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Become a Tech Builder (Agentic & Concurrency Engineering)');
}

// Run on window boot

  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['tech-builder'] = { id: 'tech-builder', title: 'Become a Tech Builder (Agentic & Concurrency Engineering)', folder: 'Tech-Builder', lessons: LESSONS };
})();
