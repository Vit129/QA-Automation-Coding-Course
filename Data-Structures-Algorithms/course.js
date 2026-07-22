(function() {
// Data Structures & Algorithms for QA — Interactive Coding Playground Data and Logic
// Starts from a QA-motivated framing (why a tester should care) then expands into real
// CS-course-depth content, per this course's own decision: QA is the entry point, not the
// ceiling. Every lesson's validate() actually EXECUTES the learner's function against real
// inputs (via execLearnerCode, same helper Framework-Design's course.js already uses) — never
// just regex-matches the source text, since a broken binary search can still satisfy a regex.
// Complexity-sensitive lessons (Big-O, hash dedup, binary search, nested-loop diagnosis) prove
// the ALGORITHMIC APPROACH by counting array accesses via a Proxy, not by wall-clock timing —
// timing is flaky across machines; a fixed access-count budget that only a linear (not
// quadratic) or logarithmic (not linear) approach can meet is not.

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
// parameters, then evaluates `expr` in that same scope and returns its value. Used here mainly
// as `execLearnerCode(code, {}, 'typeof fnName === "function" ? fnName : undefined')` to pull
// the learner's function out so validate() can call it directly with real/proxied inputs.
function execLearnerCode(code, params, expr) {
  const names = Object.keys(params);
  const values = names.map((n) => params[n]);
  const factory = new Function(...names, `${code}\nreturn (${expr});`);
  return factory(...values);
}

// Wraps an array in a Proxy that counts every numeric-index access into `counter.count`, so
// validate() can prove a learner's function used a fast (near-linear/logarithmic) approach
// instead of a slow nested-loop scan — far more reliable in CI than wall-clock timing.
function makeCountedArray(arr, counter) {
  return new Proxy(arr, {
    get(target, prop) {
      if (typeof prop === 'string' && /^\d+$/.test(prop)) counter.count++;
      return target[prop];
    }
  });
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

const LESSONS = [
  {
    id: "big_o_notation",
    meta: "บทนำ",
    title: "Big-O Notation: ทำไม Test Suite ถึงรันช้าลงเรื่อยๆ เมื่อข้อมูลโต",
    template: `// สถานการณ์: test suite ของทีมมี helper ที่เช็คว่ามี ticket ID ซ้ำอยู่ในรายการรอทดสอบหรือไม่
// ทีมสังเกตว่า suite รันเร็วมากตอนมี 100 tickets แต่ช้าลงอย่างเห็นได้ชัดตอนมี 5,000 tickets
// (ช้าลงมากกว่าสัดส่วนที่ควรจะเป็น) — ปัญหาคลาสสิกของ Big-O: nested loop วิ่งเช็คคู่ทุกคู่ (O(n^2))
// แทนที่จะเช็คทีละตัวผ่าน Set (O(n))
//
// 1. เขียน function hasDuplicateTicket(tickets) รับ array of string คืนค่า true ถ้ามี ticket ซ้ำ
//    (ไม่ว่าจะซ้ำกี่คู่ก็ตาม) คืนค่า false ถ้าไม่มีซ้ำเลย
//    ต้องใช้ Set เช็คทีละตัว (O(n)) ห้ามใช้ nested loop เทียบทุกคู่ (O(n^2))
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ hasDuplicateTicket() ทั้งความถูกต้องและ Big-O...");
      const fn = getLearnerFn(code, "hasDuplicateTicket");

      // Correctness first, on small inputs
      if (fn(["A", "B", "C"]) !== false) {
        throw new Error("hasDuplicateTicket(['A','B','C']) ต้องคืนค่า false (ไม่มีซ้ำ)");
      }
      if (fn(["A", "B", "A"]) !== true) {
        throw new Error("hasDuplicateTicket(['A','B','A']) ต้องคืนค่า true (A ซ้ำ)");
      }

      // Now prove the COMPLEXITY: 2,000 unique tickets + 1 duplicate near the end. A single
      // Set-based pass touches each element ~once (~2,000 accesses). A nested-loop O(n^2)
      // checker would touch millions of times. Budget of 6,000 cleanly separates the two —
      // this is an access-count budget, not a wall-clock timer, so it's not CI-flaky.
      const n = 2000;
      const tickets = Array.from({ length: n }, (_, i) => "TCK-" + i);
      tickets[n - 1] = "TCK-500"; // duplicate of an early ticket, placed at the very end
      const counter = { count: 0 };
      const counted = makeCountedArray(tickets, counter);
      const result = fn(counted);
      if (result !== true) {
        throw new Error(`คาดว่าจะพบ ticket ซ้ำ (TCK-500 ปรากฏ 2 ครั้ง) แต่ได้ผลลัพธ์ ${result}`);
      }
      if (counter.count > n * 3) {
        throw new Error(`hasDuplicateTicket ใช้ nested loop เทียบทุกคู่ (O(n^2)) — เข้าถึง array ${counter.count} ครั้งสำหรับข้อมูล ${n} ตัว (ควรอยู่ราวๆ O(n) คือไม่กี่พันครั้ง ไม่ใช่หลักล้าน) ให้ใช้ Set เช็คว่าเคยเจอค่านี้มาก่อนหรือยังแทน`);
      }
      log(`✓ ตรวจถูกต้องและใช้แนวทาง O(n) จริง (เข้าถึง array ${counter.count} ครั้ง จากข้อมูล ${n} ตัว)`);
    },
    hint: "วนลูปครั้งเดียวผ่าน tickets เก็บค่าที่เจอแล้วไว้ใน Set — ก่อนเพิ่มค่าใหม่เข้า Set ให้เช็คก่อนว่า Set มีค่านี้อยู่แล้วหรือยัง ถ้ามีแล้วคือเจอค่าซ้ำ คืนค่า true ทันที ห้ามใช้ลูปซ้อนลูปเทียบสมาชิกทุกคู่กันเอง",
    solution: `function hasDuplicateTicket(tickets) {
  const seen = new Set();
  for (let i = 0; i < tickets.length; i++) {
    if (seen.has(tickets[i])) return true;
    seen.add(tickets[i]);
  }
  return false;
}`,
    theory: `<strong>Big-O Notation</strong> คือภาษาที่ใช้อธิบายว่า "เวลาทำงานของโค้ดโตขึ้นเร็วแค่ไหน" เมื่อขนาดข้อมูล (n) เพิ่มขึ้น — ไม่ใช่การวัดเวลาจริงเป็นวินาที แต่วัด<strong>อัตราการโต</strong> เทียบกับ n<br/><br/>
    ที่พบบ่อยที่สุด: <code>O(1)</code> (คงที่ ไม่ว่า n เท่าไหร่ก็เร็วเท่าเดิม), <code>O(log n)</code> (โตช้ามาก เช่น binary search), <code>O(n)</code> (โตเป็นเส้นตรงตาม n), <code>O(n log n)</code> (ส่วนใหญ่ของ sorting ที่ดี), <code>O(n^2)</code> (nested loop เทียบทุกคู่ — อันตรายที่สุดในบทนี้)<br/><br/>
    วิธีดูจากโค้ดแบบคร่าวๆ: ลูปชั้นเดียววิ่งผ่านข้อมูล n ตัว = <code>O(n)</code> ลูปซ้อนลูป (ลูปในลูป) ที่แต่ละชั้นวิ่งผ่าน n ตัวเหมือนกัน = <code>O(n^2)</code> — เช็ค ticket ซ้ำแบบ nested loop (เทียบทุก ticket กับทุก ticket ที่เหลือ) ที่ n=100 ทำงาน ~10,000 ครั้ง ยังเร็วอยู่ แต่ที่ n=5,000 ทำงาน ~25,000,000 ครั้ง — นี่คือเหตุผลที่ suite ใหญ่ขึ้นแล้ว "ช้าเกินสัดส่วน" ทั้งที่ข้อมูลโตขึ้นแค่ 50 เท่า เวลากลับโตขึ้น 2,500 เท่า<br/><br/>
    ทางแก้: ใช้ <code>Set</code> (ตามที่จะเรียนลึกในบทถัดไป) เก็บค่าที่เคยเจอแล้ว เช็คว่าเคยเจอหรือยังในเวลาคงที่ (O(1) โดยเฉลี่ย) ทำให้ทั้งฟังก์ชันเหลือแค่ O(n) — โตตามข้อมูลแบบเส้นตรง ไม่ใช่กำลังสอง`,
    example: `// ตัวอย่าง O(n^2) ที่ควรหลีกเลี่ยง (แค่ตัวอย่างวิธีคิด ไม่ใช่คำตอบ)
function hasDuplicateSlow(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true; // เทียบทุกคู่ = O(n^2)
    }
  }
  return false;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function hasDuplicateTicket(tickets)</code><br/>
    2. ใช้ <code>Set</code> เช็คทีละตัว (O(n)) ห้ามใช้ nested loop เทียบทุกคู่ (O(n^2))<br/>
    3. คืนค่า <code>true</code> ถ้ามี ticket ซ้ำ, <code>false</code> ถ้าไม่มี`
  },
  {
    id: "array_vs_linked_list",
    meta: "บทที่ 1",
    title: "Array vs Linked List: โครงสร้างข้อมูลพื้นฐานสองแบบ",
    template: `// สถานการณ์: ต้องแปลง array ของชื่อ test suite ให้เป็น Linked List (โครงสร้างแบบโซ่ต่อกัน)
// เพื่อทำความเข้าใจว่า Array (เข้าถึงด้วย index ได้ทันที) ต่างจาก Linked List (ต้องไล่ทีละ node) อย่างไร
//
// 1. เขียน function arrayToLinkedList(items) รับ array of string
//    คืนค่าเป็น "head node" ตัวแรกของ linked list โดยแต่ละ node มีรูปแบบ { value, next }
//    (next ของ node สุดท้ายต้องเป็น null)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ arrayToLinkedList() (ไล่ node ทีละตัวจริง)...");
      const fn = getLearnerFn(code, "arrayToLinkedList");

      const items = ["Login Suite", "Checkout Suite", "Search Suite"];
      const head = fn(items);
      if (!head || typeof head !== "object") {
        throw new Error("arrayToLinkedList ต้อง return node แรก (object ที่มี value กับ next) ไม่ใช่ array หรือค่าว่าง");
      }

      let node = head;
      const walked = [];
      let steps = 0;
      while (node) {
        if (!("value" in node) || !("next" in node)) {
          throw new Error(`Node ที่ index ${steps} ต้องมี property value และ next ครบทั้งคู่ ได้: ${JSON.stringify(node)}`);
        }
        walked.push(node.value);
        node = node.next;
        steps++;
        if (steps > items.length + 1) {
          throw new Error("ไล่ node เกินจำนวนที่ควรจะเป็น — เช็คว่า next ของ node สุดท้ายตั้งเป็น null หรือยัง (อาจวนลูปไม่รู้จบ)");
        }
      }

      if (JSON.stringify(walked) !== JSON.stringify(items)) {
        throw new Error(`ไล่ node ทีละตัวแล้วได้ลำดับค่า ${JSON.stringify(walked)} แต่คาดว่าจะได้ ${JSON.stringify(items)} ตามลำดับเดิมของ array`);
      }
      log(`✓ แปลง array เป็น Linked List ถูกต้อง — ไล่ node ทีละตัวได้ครบ ${walked.length} node ตามลำดับ และ node สุดท้ายมี next เป็น null`);
    },
    hint: "สร้าง node ทีละตัวจากท้าย array มาหน้า (หรือวนจากหน้าไปหลังแล้วต่อ .next ทีหลังก็ได้) โดยแต่ละ node เป็น object { value: ..., next: ... } — node สุดท้ายต้องมี next เป็น null เสมอ แล้ว return node แรกสุดกลับไป",
    solution: `function arrayToLinkedList(items) {
  let next = null;
  for (let i = items.length - 1; i >= 0; i--) {
    next = { value: items[i], next };
  }
  return next;
}`,
    theory: `<strong>Array</strong> เก็บข้อมูลต่อเนื่องกันในหน่วยความจำ เข้าถึงสมาชิกลำดับที่ N ได้ทันที (<code>arr[N]</code>) ด้วยความเร็ว <code>O(1)</code> — แต่การแทรก/ลบตรงกลาง array ต้องขยับสมาชิกที่เหลือทั้งหมด (<code>O(n)</code>)<br/><br/>
    <strong>Linked List</strong> เก็บข้อมูลเป็น "โซ่" ของ node แต่ละ node ชี้ไปยัง node ถัดไปด้วย <code>next</code> — เข้าถึงสมาชิกลำดับที่ N ต้อง<strong>ไล่ทีละ node</strong>จากตัวแรกเสมอ (<code>O(n)</code> ไม่มีทาง "กระโดด" ไปตรงๆ เหมือน array) แต่การแทรก/ลบที่จุดใดจุดหนึ่ง (ถ้ามี reference ของ node ข้างเคียงอยู่แล้ว) ทำได้เร็วมาก (<code>O(1)</code>) เพราะแค่เปลี่ยน <code>next</code> ของ node ข้างเคียง ไม่ต้องขยับอะไรทั้งแถว<br/><br/>
    ในงาน QA: ถ้ารายการ test data ถูก<strong>อ่านตามลำดับ index บ่อยๆ</strong> (เช่น "ดึง test case ที่ 5") array เหมาะกว่า แต่ถ้ารายการถูก<strong>แทรก/ลบกลางทางบ่อยๆ</strong> (เช่น คิวงานที่ถูก insert/cancel กลางคันตลอดเวลา) Linked List จะเลี่ยงต้นทุนขยับข้อมูลทั้งแถวได้ — เข้าใจ tradeoff นี้ช่วยเลือกโครงสร้างข้อมูลให้ helper function ของ automation ทำงานเร็วขึ้นจริง`,
    example: `// ตัวอย่างไล่ Linked List ที่มีอยู่แล้วเพื่ออ่านค่าทั้งหมด (ไม่ใช่คำตอบของโจทย์นี้)
function linkedListToArray(head) {
  const result = [];
  let node = head;
  while (node) {
    result.push(node.value);
    node = node.next;
  }
  return result;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function arrayToLinkedList(items)</code><br/>
    2. แปลงแต่ละสมาชิกใน <code>items</code> เป็น node รูปแบบ <code>{ value, next }</code> เรียงต่อกันตามลำดับเดิม<br/>
    3. <code>next</code> ของ node สุดท้ายต้องเป็น <code>null</code> แล้ว return node แรกสุด`
  },
  {
    id: "hash_set_dedup",
    meta: "บทที่ 2",
    title: "Hash Table / Set: ลบ Test Data ซ้ำใน O(n) ไม่ใช่ O(n^2)",
    template: `// สถานการณ์: generator สุ่มสร้าง test case ID นับพันตัว แต่บางตัวสุ่มออกมาซ้ำกันโดยไม่ตั้งใจ
// ต้องกรองให้เหลือ ID ที่ไม่ซ้ำ โดย "คงลำดับการปรากฏครั้งแรก" ไว้เหมือนเดิม
//
// 1. เขียน function dedupeTestCaseIds(ids) รับ array of string (อาจมีค่าซ้ำ)
//    คืนค่า array ใหม่ที่ไม่มีค่าซ้ำ โดยเก็บลำดับการปรากฏ "ครั้งแรก" ของแต่ละค่าไว้
//    ต้องใช้ Set เช็ค O(n) ห้ามใช้ .includes()/.indexOf() ในลูป (เป็น O(n^2))
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ dedupeTestCaseIds() ทั้งความถูกต้องและ Big-O...");
      const fn = getLearnerFn(code, "dedupeTestCaseIds");

      const small = fn(["TC-1", "TC-2", "TC-1", "TC-3", "TC-2"]);
      if (JSON.stringify(small) !== JSON.stringify(["TC-1", "TC-2", "TC-3"])) {
        throw new Error(`คาดว่า dedupeTestCaseIds(['TC-1','TC-2','TC-1','TC-3','TC-2']) จะได้ ['TC-1','TC-2','TC-3'] (คงลำดับการปรากฏครั้งแรก) แต่ได้ ${JSON.stringify(small)}`);
      }

      // Big-O proof: 3,000 ids, ~30% duplicates. A Set-based single pass touches each element
      // ~once (~3,000 accesses). A .includes()-in-a-loop approach re-scans the growing result
      // array on every element (O(n^2), tens of millions of accesses at this size).
      const n = 3000;
      const ids = [];
      for (let i = 0; i < n; i++) ids.push("ID-" + (i % Math.round(n * 0.7)));
      const counter = { count: 0 };
      const counted = makeCountedArray(ids, counter);
      const result = fn(counted);
      const expectedUnique = Math.round(n * 0.7);
      if (!Array.isArray(result) || result.length !== expectedUnique) {
        throw new Error(`คาดว่าจะได้ ${expectedUnique} ค่าที่ไม่ซ้ำกัน แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} ค่า`);
      }
      if (counter.count > n * 3) {
        throw new Error(`dedupeTestCaseIds ใช้แนวทางที่ scan ซ้ำ (เช่น .includes()/.indexOf() ในลูป, O(n^2)) — เข้าถึง array ${counter.count} ครั้งสำหรับข้อมูล ${n} ตัว ให้ใช้ Set เช็คว่าเคยเจอค่านี้มาก่อนหรือยังแทน (O(n))`);
      }
      log(`✓ ลบ ID ซ้ำถูกต้องและใช้แนวทาง O(n) จริง (เข้าถึง array ${counter.count} ครั้ง จากข้อมูล ${n} ตัว)`);
    },
    hint: "วนลูปครั้งเดียวผ่าน ids เก็บผลลัพธ์ที่ไม่ซ้ำไว้ใน array ใหม่ พร้อมเก็บ Set คู่ขนานไว้เช็คว่าเคยเจอค่านี้มาก่อนหรือยัง — ถ้ายังไม่เคยเจอ (Set ไม่มีค่านี้) ให้เพิ่มเข้า Set และ push เข้า array ผลลัพธ์ ห้ามใช้ .includes() หรือ .indexOf() เช็คกับ array ผลลัพธ์ที่กำลังโตขึ้นเรื่อยๆ เพราะแต่ละครั้งจะ scan ทั้ง array นั้นซ้ำ",
    solution: `function dedupeTestCaseIds(ids) {
  const seen = new Set();
  const result = [];
  for (let i = 0; i < ids.length; i++) {
    if (!seen.has(ids[i])) {
      seen.add(ids[i]);
      result.push(ids[i]);
    }
  }
  return result;
}`,
    theory: `<strong>Hash Table</strong> (ใน JavaScript คือ <code>Set</code> และ <code>Map</code>) เก็บข้อมูลด้วยการคำนวณ "hash" ของค่าเพื่อหาตำแหน่งเก็บ/ค้นหาโดยตรง ทำให้ <code>.has()</code>, <code>.add()</code>, <code>.get()</code> ทำงานเฉลี่ย <code>O(1)</code> (คงที่) ไม่ว่าข้อมูลจะมีกี่ตัวก็ตาม — ต่างจากการ scan array ด้วย <code>.includes()</code>/<code>.indexOf()</code> ที่ต้องไล่ดูทีละตัวจนกว่าจะเจอ (<code>O(n)</code> ต่อครั้ง)<br/><br/>
    ปัญหาคลาสสิกที่เจอบ่อย: ลบค่าซ้ำออกจาก array ด้วยการวนลูปแล้วเช็ค <code>if (!result.includes(item)) result.push(item)</code> — ดูเหมือนใช้ได้ แต่ <code>.includes()</code> ต้อง scan <code>result</code> ทั้งหมดทุกครั้งที่เรียก และ <code>result</code> ก็โตขึ้นเรื่อยๆ ทำให้รวมแล้วทั้งฟังก์ชันกลายเป็น <code>O(n^2)</code> — ที่ n=3,000 (จากตัวอย่างในบทนี้) วิธีนี้ทำงานหลักสิบล้านครั้ง ในขณะที่ใช้ <code>Set</code> ทำงานแค่ราวๆ 3,000 ครั้ง<br/><br/>
    ต่อยอดจากบท "Big-O Notation" — นี่คือตัวอย่างจริงของการใช้ Hash Table เปลี่ยนงานจาก O(n^2) ให้เหลือ O(n) ซึ่งเป็นเทคนิคที่ใช้บ่อยที่สุดอย่างหนึ่งในงานเขียน test data generator/cleanup ที่ต้องจัดการข้อมูลจำนวนมาก`,
    example: `// ตัวอย่างใช้ Set เช็คสมาชิกร่วมระหว่าง 2 รายการ (ไม่ใช่คำตอบของโจทย์นี้)
function findCommonTickers(listA, listB) {
  const setA = new Set(listA);
  return listB.filter(x => setA.has(x));
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function dedupeTestCaseIds(ids)</code><br/>
    2. ใช้ <code>Set</code> เช็คว่าเคยเจอค่านี้แล้วหรือยัง (O(n)) ห้ามใช้ <code>.includes()</code>/<code>.indexOf()</code> ในลูป (O(n^2))<br/>
    3. คืนค่า array ใหม่ที่ไม่ซ้ำ โดยคงลำดับการปรากฏครั้งแรกไว้`
  },
  {
    id: "stack_bracket_matching",
    meta: "บทที่ 3",
    title: "Stack: ตรวจสอบวงเล็บ/แท็กที่เปิด-ปิดไม่ครบ",
    template: `// สถานการณ์: ก่อนรัน test บาง framework จะ parse expression/config ที่มีวงเล็บซ้อนกันหลายชั้น
// ถ้าวงเล็บเปิด-ปิดไม่ครบหรือผิดลำดับ (เช่น "([)]") ต้องจับได้ก่อนรันจริง ไม่ใช่ปล่อยให้ parser พังกลางทาง
//
// 1. เขียน function isBalanced(expression) รับ string ที่มีเฉพาะอักขระ ( ) [ ] { }
//    คืนค่า true ถ้าวงเล็บทุกคู่เปิด-ปิดถูกต้องและซ้อนกันถูกลำดับ, false ถ้าไม่ใช่
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ isBalanced() ด้วย Stack...");
      const fn = getLearnerFn(code, "isBalanced");

      const cases = [
        ["()", true],
        ["([{}])", true],
        ["([)]", false],
        ["(()", false],
        ["", true],
        ["{[()()]}", true],
        [")(", false],
      ];
      for (const [input, expected] of cases) {
        const actual = fn(input);
        if (actual !== expected) {
          throw new Error(`isBalanced(${JSON.stringify(input)}) ต้องคืนค่า ${expected} แต่ได้ ${actual}`);
        }
      }
      log("✓ ตรวจสอบวงเล็บถูกต้องครบทุกกรณี รวมถึงกรณีซ้อนผิดลำดับและเปิด-ปิดไม่ครบ");
    },
    hint: "ใช้ array เป็น Stack: เจอวงเล็บเปิดให้ push เข้า stack, เจอวงเล็บปิดให้ pop ตัวบนสุดออกมาเทียบว่าเป็นคู่กันไหม (ถ้า stack ว่างตอนเจอวงเล็บปิด หรือ pop ออกมาไม่ตรงคู่ ให้คืนค่า false ทันที) จบลูปแล้วถ้า stack ไม่ว่างเปล่าแปลว่ามีวงเล็บเปิดที่ไม่ได้ปิด ให้คืนค่า false ด้วย",
    solution: `function isBalanced(expression) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  for (const ch of expression) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (ch === ')' || ch === ']' || ch === '}') {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
    theory: `<strong>Stack</strong> คือโครงสร้างข้อมูลแบบ <strong>LIFO</strong> (Last In, First Out — เข้าหลังสุด ออกก่อน) มีแค่ 2 การกระทำหลัก: <code>push</code> (ใส่ไว้บนสุด) และ <code>pop</code> (เอาตัวบนสุดออก) — เปรียบเหมือนกองจานซ้อนกัน หยิบจานที่วางบนสุดออกก่อนเสมอ<br/><br/>
    การเช็ควงเล็บเปิด-ปิดให้ครบและถูกลำดับคือ<strong>ตัวอย่างคลาสสิกที่สุดของ Stack</strong>: เจอวงเล็บเปิดให้ push เก็บไว้ พอเจอวงเล็บปิดให้ pop ตัวบนสุดออกมาเทียบว่าเป็นคู่กันไหม (วงเล็บปิดต้องจับคู่กับวงเล็บเปิดตัว<strong>ล่าสุด</strong>ที่ยังไม่ได้ปิด ตรงกับหลัก LIFO เป๊ะ) — <code>"([)]"</code> จะ fail เพราะพอเจอ <code>)</code> ตัวบนสุดของ stack คือ <code>[</code> ไม่ใช่ <code>(</code>ที่ควรจะจับคู่<br/><br/>
    ในงาน QA เทคนิค Stack ยังใช้ตรวจสอบ<strong>ลำดับการรัน test</strong>ได้ด้วย เช่น teardown ต้องทำย้อนกลับตามลำดับ setup ที่ทำไว้ (setup A → B → C ต้อง teardown C → B → A) ซึ่งเป็นพฤติกรรม LIFO แบบเดียวกัน`,
    example: `// ตัวอย่าง Stack ใช้ reverse ลำดับ (ไม่ใช่คำตอบของโจทย์นี้)
function reverseWithStack(items) {
  const stack = [...items];
  const result = [];
  while (stack.length > 0) result.push(stack.pop());
  return result;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function isBalanced(expression)</code><br/>
    2. ใช้ Stack เช็คว่าวงเล็บ <code>()</code> <code>[]</code> <code>{}</code> เปิด-ปิดครบและซ้อนกันถูกลำดับ<br/>
    3. คืนค่า <code>true</code>/<code>false</code> ตามผลตรวจ`
  },
  {
    id: "sorting_stability",
    meta: "บทที่ 4",
    title: "Sorting และ Stability: ทำไม Order ของผลลัพธ์ที่เท่ากันถึงสำคัญ",
    template: `// สถานการณ์: ต้องเรียงผลลัพธ์ test run ตามเวลาที่รัน (timestamp) จากเก่าไปใหม่
// แต่บาง test run มี timestamp ตรงกันเป๊ะ (รันพร้อมกันแบบ parallel) — ถ้า sort ไม่ stable
// test ที่ timestamp เท่ากันอาจถูกสลับลำดับเดิมโดยไม่ควร ทำให้ report แสดงผลไม่ตรงกับที่รันจริง
//
// 1. เขียน function sortResultsByTimestamp(results) รับ array ของ { id, timestamp }
//    คืนค่า array ใหม่ที่เรียงตาม timestamp จากน้อยไปมาก
//    ถ้า timestamp เท่ากัน ต้องคงลำดับเดิม (relative order) ของรายการเหล่านั้นไว้ (stable sort)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ sortResultsByTimestamp() ทั้งลำดับและ Stability...");
      const fn = getLearnerFn(code, "sortResultsByTimestamp");

      const input = [
        { id: "r1", timestamp: 300 },
        { id: "r2", timestamp: 100 },
        { id: "r3", timestamp: 100 },
        { id: "r4", timestamp: 200 },
        { id: "r5", timestamp: 100 },
      ];
      const result = fn(input);
      if (!Array.isArray(result) || result.length !== 5) {
        throw new Error(`คาดว่าจะได้ array 5 รายการ แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} รายการ`);
      }
      const order = result.map(r => r.id);
      const timestamps = result.map(r => r.timestamp);
      for (let i = 1; i < timestamps.length; i++) {
        if (timestamps[i] < timestamps[i - 1]) {
          throw new Error(`ผลลัพธ์ต้องเรียง timestamp จากน้อยไปมาก แต่ได้ลำดับ timestamp: ${JSON.stringify(timestamps)}`);
        }
      }
      // r2, r3, r5 all have timestamp=100 and appeared in that relative order in the input —
      // a stable sort must keep them in exactly that order among themselves.
      const tiedGroup = order.filter(id => ["r2", "r3", "r5"].includes(id));
      if (JSON.stringify(tiedGroup) !== JSON.stringify(["r2", "r3", "r5"])) {
        throw new Error(`r2, r3, r5 มี timestamp เท่ากัน (100) ต้องคงลำดับเดิม (r2, r3, r5) ไว้ แต่ได้ลำดับ ${JSON.stringify(tiedGroup)} — sort ไม่ stable`);
      }
      log("✓ เรียงลำดับถูกต้องและเป็น stable sort จริง (รายการที่ timestamp เท่ากันคงลำดับเดิมไว้)");
    },
    hint: "ใช้ Array.prototype.sort() พร้อม comparator ที่เทียบ timestamp กัน (a.timestamp - b.timestamp) — .sort() ใน JavaScript ตั้งแต่มาตรฐาน ES2019 เป็นต้นไป รับประกันว่า stable อยู่แล้วโดยไม่ต้องเขียนอะไรเพิ่ม ตราบใดที่ comparator เทียบแค่ timestamp เพียงอย่างเดียว ห้ามลองเขียน sort เองแบบ swap ตำแหน่งตรงๆ เพราะมักจะไม่ stable",
    solution: `function sortResultsByTimestamp(results) {
  return [...results].sort((a, b) => a.timestamp - b.timestamp);
}`,
    theory: `<strong>Sorting</strong> คือการเรียงลำดับข้อมูล — สิ่งที่มักถูกมองข้ามคือ <strong>Stability</strong>: sort ที่ "stable" คือ sort ที่รายการซึ่งมีค่าเปรียบเทียบ<strong>เท่ากันเป๊ะ</strong> จะคง<strong>ลำดับสัมพัทธ์เดิม</strong>ไว้เหมือนก่อน sort ไม่ใช่สลับกันไปมาแบบสุ่ม<br/><br/>
    ในตัวอย่างนี้ r2, r3, r5 ทั้งสามตัวมี <code>timestamp = 100</code> เท่ากันเป๊ะ (เกิดจาก test run พร้อมกันแบบ parallel) — ถ้า sort ไม่ stable ลำดับของทั้งสามตัวหลัง sort อาจไม่ตรงกับลำดับที่เกิดขึ้นจริง ทำให้ report ที่แสดงผล "ใครรันก่อนใคร" ผิดเพี้ยนไปจากความเป็นจริงทั้งที่ timestamp ถูกต้องทุกตัว<br/><br/>
    ข่าวดี: <code>Array.prototype.sort()</code> ใน JavaScript ตั้งแต่ ES2019 (V8/Node/เบราว์เซอร์สมัยใหม่ทุกตัว) รับประกัน stable โดยอัตโนมัติ — ไม่ต้องเขียนโค้ดพิเศษเพิ่ม แค่เขียน comparator ให้ถูกต้อง (เทียบเฉพาะ field ที่ต้องการจริงๆ) sort ก็จะ stable ให้เอง แต่ถ้าเขียน sorting algorithm เอง (เช่น quicksort แบบ swap ตำแหน่งง่ายๆ) มักจะ<strong>ไม่</strong> stable โดยไม่รู้ตัว`,
    example: `// ตัวอย่าง sort ที่ไม่ใช่ stable-sensitive (เรียงแค่ field เดียว ไม่มีค่าเท่ากันชนกัน)
function sortByCostDesc(items) {
  return [...items].sort((a, b) => b.cost - a.cost);
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function sortResultsByTimestamp(results)</code><br/>
    2. เรียง <code>timestamp</code> จากน้อยไปมาก<br/>
    3. รายการที่ <code>timestamp</code> เท่ากันต้องคงลำดับเดิม (stable sort)`
  },
  {
    id: "binary_search",
    meta: "บทที่ 5",
    title: "Searching: Linear vs Binary Search สำหรับ Test Oracle",
    template: `// สถานการณ์: มี fixture ที่เก็บค่าที่คาดหวัง (expected value) เรียงลำดับไว้แล้วจำนวนมาก
// ต้องค้นหาว่าค่าหนึ่งๆ อยู่ใน fixture นี้หรือไม่ (และอยู่ตำแหน่งไหน) ให้เร็วที่สุด
//
// 1. เขียน function binarySearch(sortedValues, target) รับ array ที่เรียงจากน้อยไปมากแล้ว
//    คืนค่า index ของ target ถ้าเจอ, คืนค่า -1 ถ้าไม่เจอ
//    ต้องใช้ Binary Search (แบ่งครึ่งช่วงค้นหาทุกรอบ) ห้ามวนลูปไล่ทีละตัวจากต้นจนจบ (Linear Search)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ binarySearch() ทั้งความถูกต้องและว่าเป็น Binary Search จริง...");
      const fn = getLearnerFn(code, "binarySearch");

      const n = 100000;
      const values = Array.from({ length: n }, (_, i) => i * 2); // sorted: 0, 2, 4, ..., (n-1)*2

      const check = (target, expectedIndex) => {
        const counter = { count: 0 };
        const counted = makeCountedArray(values, counter);
        const result = fn(counted, target);
        if (result !== expectedIndex) {
          throw new Error(`binarySearch(sortedValues, ${target}) ต้องได้ index ${expectedIndex} แต่ได้ ${result}`);
        }
        // log2(100,000) ≈ 17 — a generous budget of 40 comfortably fits any correct binary
        // search while rejecting a linear scan, which would need up to 100,000 accesses.
        if (counter.count > 40) {
          throw new Error(`binarySearch(sortedValues, ${target}) เข้าถึง array ${counter.count} ครั้ง สำหรับข้อมูล ${n} ตัว — มากเกินไปสำหรับ Binary Search จริง (ควรอยู่ราวๆ log2(${n}) ≈ 17 ครั้ง ไม่ใช่หลักพัน/หมื่น) ตรวจสอบว่าแบ่งครึ่งช่วงค้นหาทุกรอบจริงหรือไม่ ไม่ใช่วนลูปไล่ทีละตัว`);
        }
      };

      check(0, 0);           // first element
      check((n - 1) * 2, n - 1); // last element
      check(50000 * 2, 50000);   // middle-ish element
      check(3, -1);              // not present (odd number, never in the array)

      log("✓ ค้นหาถูกต้องทุกกรณีและใช้ Binary Search จริง (เข้าถึง array ในระดับ log n ไม่ใช่ n)");
    },
    hint: "ตั้งขอบเขตซ้าย (low) และขวา (high) ของช่วงที่ยังค้นหาอยู่ วนลูปหาจุดกึ่งกลาง (mid) เทียบค่าตรงกลางกับ target — ถ้าตรงกันคืนค่า index นั้นทันที ถ้า target น้อยกว่าค่าตรงกลางให้เลื่อนขอบขวามาไว้ก่อน mid ถ้ามากกว่าให้เลื่อนขอบซ้ายไปหลัง mid ทำซ้ำจนกว่าขอบซ้ายจะเกินขอบขวา (แปลว่าไม่เจอ คืนค่า -1)",
    solution: `function binarySearch(sortedValues, target) {
  let low = 0;
  let high = sortedValues.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (sortedValues[mid] === target) return mid;
    if (sortedValues[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
    theory: `<strong>Linear Search</strong> ไล่ดูทีละตัวจากต้นจนจบ (<code>O(n)</code>) ใช้ได้กับข้อมูลไม่เรียงลำดับ — <strong>Binary Search</strong> ใช้ได้เฉพาะข้อมูลที่<strong>เรียงลำดับแล้ว</strong>เท่านั้น แต่แลกมาด้วยความเร็วระดับ <code>O(log n)</code>: แบ่งครึ่งช่วงค้นหาทุกรอบ เทียบค่าตรงกลางกับ target แล้วตัดครึ่งที่ไม่เกี่ยวทิ้งไปเลย<br/><br/>
    ความต่างของความเร็วมหาศาลเมื่อข้อมูลใหญ่ขึ้น: fixture ขนาด 100,000 รายการ (ตามตัวอย่างในบทนี้) Linear Search อาจต้องเช็คถึง 100,000 ครั้งในกรณีแย่สุด ในขณะที่ Binary Search ใช้แค่ราวๆ <code>log2(100,000) ≈ 17</code> ครั้งเท่านั้น — นี่คือเหตุผลที่ต่อยอดจากบท "Big-O Notation": <code>O(log n)</code> โตช้ากว่า <code>O(n)</code> อย่างมหาศาลเมื่อ n ใหญ่ขึ้น<br/><br/>
    ในงาน QA เทคนิคนี้มีประโยชน์ตอนต้อง<strong>ค้นหาค่าคาดหวัง (expected value) จาก fixture ขนาดใหญ่ที่เรียงลำดับไว้แล้ว</strong> — ถ้า fixture ไม่ได้เรียงลำดับไว้ก่อน ต้องแลกด้วยการ sort ก่อน (O(n log n) ตามบทที่แล้ว) ซึ่งคุ้มค่าถ้าต้องค้นหาซ้ำหลายครั้งบน fixture เดียวกัน`,
    example: `// ตัวอย่าง Linear Search (ใช้ได้กับข้อมูลไม่เรียงลำดับ แต่ช้ากว่าถ้าข้อมูลใหญ่และเรียงแล้ว)
function linearSearch(values, target) {
  for (let i = 0; i < values.length; i++) {
    if (values[i] === target) return i;
  }
  return -1;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function binarySearch(sortedValues, target)</code><br/>
    2. แบ่งครึ่งช่วงค้นหาทุกรอบ (ห้ามวนลูปไล่ทีละตัว)<br/>
    3. คืนค่า <code>index</code> ถ้าเจอ, คืนค่า <code>-1</code> ถ้าไม่เจอ`
  },
  {
    id: "recursion_nested_sum",
    meta: "บทที่ 6",
    title: "Recursion: ไล่โครงสร้าง Test Fixture ที่ซ้อนกันหลายชั้น",
    template: `// สถานการณ์: test fixture จริงมักซ้อนกันหลายชั้น (object ข้างในมี object/array ข้างในอีกที)
// ต้องรวมค่าตัวเลขทั้งหมดที่ซ้อนอยู่ลึกแค่ไหนก็ตาม
//
// 1. เขียน function sumNestedValues(node) รับค่าที่อาจเป็น number, array, หรือ object
//    คืนค่าผลรวมของตัวเลขทั้งหมดที่ซ้อนอยู่ข้างในไม่ว่าจะลึกกี่ชั้น
//    (ถ้า node เป็น number ให้คืนค่าตัวมันเอง)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ sumNestedValues() แบบ recursive...");
      const fn = getLearnerFn(code, "sumNestedValues");

      if (fn(5) !== 5) {
        throw new Error("sumNestedValues(5) ต้องคืนค่า 5 (base case: เป็นตัวเลขอยู่แล้ว)");
      }
      if (fn([1, 2, 3]) !== 6) {
        throw new Error("sumNestedValues([1,2,3]) ต้องคืนค่า 6");
      }

      const fixture = {
        suite: "Checkout",
        retries: 2,
        cases: [
          { id: 1, durationMs: 120 },
          { id: 2, durationMs: 340, nested: { extra: 10, more: [5, 5] } },
        ],
      };
      // 2 (retries) + 1 + 120 + 2 + 340 + 10 + 5 + 5 = 485
      const result = fn(fixture);
      if (result !== 485) {
        throw new Error(`sumNestedValues(fixture) ต้องรวมตัวเลขทั้งหมดที่ซ้อนอยู่ทุกระดับได้ 485 แต่ได้ ${result}`);
      }
      log("✓ รวมค่าตัวเลขที่ซ้อนอยู่ในโครงสร้างหลายชั้นได้ถูกต้อง");
    },
    hint: "แยกเป็น 3 กรณี (base case + 2 recursive case): ถ้า node เป็น number ให้คืนค่าตัวมันเอง (base case, จบการวนซ้ำ) ถ้าเป็น array ให้ sumNestedValues ของแต่ละสมาชิกแล้วบวกกัน ถ้าเป็น object (ไม่ใช่ number ไม่ใช่ array) ให้ sumNestedValues ของค่าในแต่ละ key แล้วบวกกัน — string ให้ข้ามไป (นับเป็น 0)",
    solution: `function sumNestedValues(node) {
  if (typeof node === 'number') return node;
  if (Array.isArray(node)) {
    return node.reduce((sum, item) => sum + sumNestedValues(item), 0);
  }
  if (node && typeof node === 'object') {
    return Object.values(node).reduce((sum, item) => sum + sumNestedValues(item), 0);
  }
  return 0;
}`,
    theory: `<strong>Recursion</strong> (การเรียกตัวเอง) คือเทคนิคที่ฟังก์ชันเรียกตัวมันเองซ้ำๆ จนกว่าจะถึง <strong>base case</strong> (กรณีฐานที่หยุดเรียกตัวเองและคืนค่าตรงๆ) — ทุกฟังก์ชัน recursive ต้องมี base case ไม่งั้นจะเรียกตัวเองไม่รู้จบจน stack overflow<br/><br/>
    ในบทนี้ base case คือ "node เป็นตัวเลขล้วนๆ แล้ว" (คืนค่าตรงๆ ไม่ต้องเรียกตัวเองต่อ) ส่วน recursive case คือ "node ยังเป็น array หรือ object อยู่" (ต้องไล่เข้าไปข้างในต่อ) — โครงสร้าง fixture ที่ซ้อนกันกี่ชั้นก็ตาม (array ใน object ใน array ใน object...) recursion จะไล่ลงไปเรื่อยๆ จนเจอ base case ในทุกกิ่งแล้วรวมผลกลับขึ้นมา<br/><br/>
    ในงาน QA เทคนิคนี้ใช้บ่อยมากตอนต้อง<strong>เขียน test data generator หรือ diff-checker ของ nested JSON fixture</strong> ที่ไม่รู้ล่วงหน้าว่าจะซ้อนลึกกี่ชั้น — เขียนแบบ recursive ทำให้รองรับความลึกเท่าไหร่ก็ได้โดยไม่ต้องเขียนลูปซ้อนลูปตายตัวตามจำนวนชั้นที่คาดเดาไว้`,
    example: `// ตัวอย่าง recursion นับจำนวน key ทั้งหมดในโครงสร้างที่ซ้อนกัน (ไม่ใช่คำตอบของโจทย์นี้)
function countAllKeys(node) {
  if (!node || typeof node !== 'object') return 0;
  const keys = Object.keys(node);
  return keys.length + keys.reduce((sum, k) => sum + countAllKeys(node[k]), 0);
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function sumNestedValues(node)</code><br/>
    2. Base case: ถ้า <code>node</code> เป็น number ให้คืนค่าตัวมันเอง<br/>
    3. Recursive case: ถ้าเป็น array หรือ object ให้รวมค่าจากทุกสมาชิก/ทุก key ด้วยการเรียกตัวเองซ้ำ`
  },
  {
    id: "tree_leaf_count",
    meta: "บทที่ 7",
    title: "Trees: นับ Test Case จริงในโครงสร้าง Suite ที่ซ้อนกันหลายชั้น",
    template: `// สถานการณ์: test suite ซ้อนกันเป็นลำดับชั้น (describe ข้างในมี describe ย่อยอีกที)
// node ที่ "ไม่มีลูก" (leaf) คือ test case จริงที่รันได้ ส่วน node ที่ "มีลูก" คือแค่กลุ่ม (describe block)
// รูปแบบ node: { name: string, children: [ ...node ] } — leaf คือ node ที่ children เป็น array ว่างเปล่า
//
// 1. เขียน function countLeafTestCases(node) รับ tree node ตามรูปแบบข้างต้น
//    คืนค่าจำนวน leaf (test case จริง) ทั้งหมดในทุกระดับของ tree
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ countLeafTestCases() แบบ Tree Traversal...");
      const fn = getLearnerFn(code, "countLeafTestCases");

      const singleLeaf = { name: "TC-1", children: [] };
      if (fn(singleLeaf) !== 1) {
        throw new Error("countLeafTestCases สำหรับ node เดียวที่ไม่มีลูก ต้องนับเป็น 1 (leaf เดียว)");
      }

      const suite = {
        name: "Root Suite",
        children: [
          {
            name: "Login",
            children: [
              { name: "TC-Login-1", children: [] },
              { name: "TC-Login-2", children: [] },
            ],
          },
          {
            name: "Checkout",
            children: [
              {
                name: "Payment",
                children: [
                  { name: "TC-Payment-1", children: [] },
                ],
              },
              { name: "TC-Checkout-1", children: [] },
            ],
          },
        ],
      };
      // Leaves: TC-Login-1, TC-Login-2, TC-Payment-1, TC-Checkout-1 = 4
      const result = fn(suite);
      if (result !== 4) {
        throw new Error(`countLeafTestCases(suite) ต้องนับ leaf ได้ 4 (TC-Login-1, TC-Login-2, TC-Payment-1, TC-Checkout-1) แต่ได้ ${result}`);
      }
      log("✓ นับ test case จริง (leaf) ในโครงสร้าง suite ที่ซ้อนกันหลายชั้นได้ถูกต้อง");
    },
    hint: "ถ้า node.children เป็น array ว่างเปล่า แปลว่า node นี้คือ leaf (test case จริง) ให้คืนค่า 1 — ถ้า children ไม่ว่างเปล่า ให้เรียก countLeafTestCases ซ้ำกับลูกแต่ละตัว แล้วรวมผลลัพธ์ทั้งหมดเข้าด้วยกัน (ไม่นับ node ที่มีลูกเป็น leaf เอง)",
    solution: `function countLeafTestCases(node) {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countLeafTestCases(child), 0);
}`,
    theory: `<strong>Tree</strong> คือโครงสร้างข้อมูลแบบลำดับชั้น: มี node ราก (root) และแต่ละ node มี "ลูก" (children) ได้หลายตัว — node ที่ไม่มีลูกเรียกว่า <strong>leaf</strong> (ใบไม้) node ที่มีลูกเรียกว่า <strong>internal node</strong><br/><br/>
    <code>describe</code>/<code>test</code> block ของ framework ทดสอบสมัยใหม่ (Playwright, Jest, Mocha) มีโครงสร้างเป็น Tree โดยธรรมชาติ: <code>describe</code> คือ internal node (กลุ่ม ไม่ใช่ test จริง) ส่วน <code>test</code>/<code>it</code> คือ leaf (test case ที่รันได้จริง) — การนับว่า "suite นี้มีกี่ test case จริง" คือการนับ leaf ทั้งหมดของ tree ไม่ใช่นับ node ทั้งหมด (ซึ่งจะรวม describe ที่ไม่ใช่ test เข้าไปด้วยผิดๆ)<br/><br/>
    เทคนิคไล่ tree แบบนี้เรียกว่า <strong>Tree Traversal</strong> ต่อยอดโดยตรงจากบท "Recursion" ก่อนหน้า — base case คือเจอ leaf (คืนค่า 1 ทันที) recursive case คือยังมีลูกอยู่ (ไล่เข้าไปนับในลูกแต่ละตัวแล้วรวมกัน) การเข้าใจโครงสร้างนี้ช่วยเขียนเครื่องมือวิเคราะห์ test suite (เช่น "มี test จริงกี่ตัว", "suite ไหนลึกเกินไป") ได้ตรงไปตรงมา`,
    example: `// ตัวอย่าง Tree Traversal หาความลึกสูงสุดของ suite (ไม่ใช่คำตอบของโจทย์นี้)
function maxDepth(node) {
  if (node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(maxDepth));
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function countLeafTestCases(node)</code><br/>
    2. ถ้า <code>node.children</code> เป็น array ว่างเปล่า (leaf) ให้นับ 1<br/>
    3. ถ้ามีลูก ให้รวมจำนวน leaf จากลูกทุกตัวด้วยการเรียกตัวเองซ้ำ`
  },
  {
    id: "graph_cycle_detection",
    meta: "บทที่ 8",
    title: "Graphs: หา Circular Dependency ใน CI Pipeline",
    template: `// สถานการณ์: CI pipeline มี job หลายตัวที่ขึ้นกับ job อื่นก่อนถึงจะรันได้ (dependency graph)
// ถ้ามี "circular dependency" (A รอ B, B รอ C, C รอ A วนกลับมา) pipeline จะรันไม่ได้เลยเพราะรอกันไม่จบ
// ต้องตรวจจับปัญหานี้ก่อน deploy จริง
//
// 1. เขียน function hasCyclicDependency(graph) รับ object ที่แต่ละ key คือชื่อ job
//    ค่าคือ array ของชื่อ job ที่ job นั้นต้องรอ (dependency) เช่น { A: ['B'], B: ['C'], C: [] }
//    คืนค่า true ถ้ามี circular dependency ที่ไหนก็ตามใน graph, false ถ้าไม่มี
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ hasCyclicDependency() ด้วย Graph Traversal...");
      const fn = getLearnerFn(code, "hasCyclicDependency");

      const acyclic = { build: [], test: ["build"], deploy: ["test", "build"] };
      if (fn(acyclic) !== false) {
        throw new Error("hasCyclicDependency(acyclic) ต้องคืนค่า false (ไม่มี job ไหนวนกลับมาหาตัวเองผ่านสาย dependency)");
      }

      const cyclic = { jobA: ["jobB"], jobB: ["jobC"], jobC: ["jobA"] };
      if (fn(cyclic) !== true) {
        throw new Error("hasCyclicDependency(cyclic) ต้องคืนค่า true (jobA -> jobB -> jobC -> jobA วนกลับมา)");
      }

      const selfLoop = { deploy: ["deploy"] };
      if (fn(selfLoop) !== true) {
        throw new Error("hasCyclicDependency(selfLoop) ต้องคืนค่า true (deploy รอตัวเอง ก็ถือเป็น cycle)");
      }

      const largerAcyclic = { lint: [], build: ["lint"], unit: ["build"], e2e: ["build", "unit"], deploy: ["e2e"] };
      if (fn(largerAcyclic) !== false) {
        throw new Error("hasCyclicDependency(largerAcyclic) ต้องคืนค่า false (เป็นสายตรง ไม่มี cycle แม้จะมีหลาย job)");
      }

      log("✓ ตรวจจับ circular dependency ในกราฟได้ถูกต้องทุกกรณี รวมถึง cycle ทางอ้อมและวนกลับตัวเอง");
    },
    hint: "ใช้ DFS (Depth-First Search) ไล่จาก job แต่ละตัว พร้อมเก็บสถานะ 'กำลังไล่อยู่ในสายปัจจุบัน' (visiting) แยกจาก 'ไล่จบไปแล้ว' (visited) — ถ้าระหว่างไล่ DFS เจอ job ที่มีสถานะ 'กำลังไล่อยู่ในสายปัจจุบัน' อยู่แล้ว แปลว่าวนกลับมาเจอตัวเองในสายเดียวกัน (มี cycle) ให้คืนค่า true ทันที ถ้าไล่จนสำรวจ job ทั้งหมดจบโดยไม่เจอแบบนั้นเลย ให้คืนค่า false",
    solution: `function hasCyclicDependency(graph) {
  const visiting = new Set();
  const visited = new Set();

  function dfs(job) {
    if (visiting.has(job)) return true;
    if (visited.has(job)) return false;

    visiting.add(job);
    const deps = graph[job] || [];
    for (const dep of deps) {
      if (dfs(dep)) return true;
    }
    visiting.delete(job);
    visited.add(job);
    return false;
  }

  for (const job of Object.keys(graph)) {
    if (dfs(job)) return true;
  }
  return false;
}`,
    theory: `<strong>Graph</strong> คือโครงสร้างข้อมูลของ "node" ที่เชื่อมกันด้วย "edge" แบบอิสระ (ต่างจาก Tree ที่มีลำดับชั้นชัดเจน โหนดหนึ่งเชื่อมกับโหนดไหนก็ได้ไม่จำกัด) — CI pipeline dependency คือ Graph แบบ <strong>directed</strong> (edge มีทิศทาง: "A รอ B" ไม่ได้แปลว่า "B รอ A")<br/><br/>
    การหา <strong>circular dependency</strong> คือการหาว่ามี "cycle" ในกราฟหรือไม่ (ไล่ตามทิศทาง edge ไปเรื่อยๆ แล้ววนกลับมาเจอ node เดิมที่ยังไล่ไม่จบ) — เทคนิคมาตรฐานคือ <strong>DFS (Depth-First Search)</strong> ต่อยอดจากบท "Trees" (การไล่ tree ก็คือ DFS แบบหนึ่ง) แต่ต้องเพิ่มการ<strong>แยกสถานะ 2 แบบ</strong>: node ที่ "อยู่ในสายที่กำลังไล่อยู่ตอนนี้" (visiting) กับ node ที่ "ไล่จบสมบูรณ์ไปแล้วก่อนหน้านี้" (visited) — ถ้าไล่แล้วเจอ node ที่ยัง "visiting" อยู่ (ยังไม่จบสาย) แปลว่าวนกลับมาเจอตัวเองจริงๆ คือ cycle<br/><br/>
    ในงาน QA/DevOps เทคนิคนี้ป้องกันปัญหา CI pipeline ที่ deadlock (รอกันไม่จบ) ก่อน deploy จริง เช็คได้ตั้งแต่ตอน parse ไฟล์ config ของ pipeline โดยไม่ต้องรอให้รันจริงแล้วค้างไม่จบ`,
    example: `// ตัวอย่าง DFS ธรรมดา (ไม่เช็ค cycle) หาว่า job ปลายทางไปถึงได้จาก job เริ่มต้นหรือไม่
function canReach(graph, from, to, seen = new Set()) {
  if (from === to) return true;
  if (seen.has(from)) return false;
  seen.add(from);
  return (graph[from] || []).some(dep => canReach(graph, dep, to, seen));
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function hasCyclicDependency(graph)</code><br/>
    2. ใช้ DFS พร้อมแยกสถานะ "กำลังไล่อยู่ในสายปัจจุบัน" กับ "ไล่จบแล้ว"<br/>
    3. คืนค่า <code>true</code> ถ้าพบ circular dependency ที่ไหนก็ตาม, <code>false</code> ถ้าไม่พบเลย`
  },
  {
    id: "nested_loop_pair_matching",
    meta: "บทที่ 9",
    title: "Big-O ของ Nested Loop: จับ Bug ประสิทธิภาพจากการจับคู่ข้อมูล 2 ชุด",
    template: `// สถานการณ์: มีรายการค่าที่คาดหวัง (expected) และค่าที่ระบบตอบจริง (actual) มาจาก API คนละชุด
// ต้องหาว่า "ค่าไหนบ้างที่ปรากฏอยู่ทั้งสองฝั่ง" (ไม่สนใจว่าปรากฏกี่ครั้ง แค่ว่ามีร่วมกันไหม)
// วิธีไร้เดียงสาคือวนลูปซ้อนลูปเทียบทุกคู่ระหว่างสองรายการ (O(n*m)) ซึ่งช้ามากเมื่อทั้งสองฝั่งใหญ่
//
// 1. เขียน function countMatchingValues(expected, actual) รับ array of string สองชุด
//    คืนค่าจำนวนค่าที่ไม่ซ้ำกัน (distinct) ที่ปรากฏอยู่ใน "ทั้งสองฝั่ง"
//    ต้องไม่ใช้ nested loop เทียบทุกคู่ระหว่าง expected กับ actual (O(n*m))
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ countMatchingValues() ทั้งความถูกต้องและ Big-O...");
      const fn = getLearnerFn(code, "countMatchingValues");

      const small = fn(["A", "B", "C"], ["B", "C", "D"]);
      if (small !== 2) {
        throw new Error(`countMatchingValues(['A','B','C'], ['B','C','D']) ต้องได้ 2 (B และ C ปรากฏทั้งสองฝั่ง) แต่ได้ ${small}`);
      }

      // Big-O proof: two 2,500-element arrays. A nested-loop O(n*m) approach touches ~6,250,000
      // times combined. A Set-based approach (build a Set from one side, scan the other once)
      // touches roughly n+m ≈ 5,000 times combined — budget of 20,000 cleanly separates them.
      const n = 2500;
      const expected = Array.from({ length: n }, (_, i) => "V-" + i);
      const actual = Array.from({ length: n }, (_, i) => "V-" + (i + Math.round(n / 2))); // half overlap
      const counter = { count: 0 };
      const countedExpected = makeCountedArray(expected, counter);
      const countedActual = makeCountedArray(actual, counter);
      const result = fn(countedExpected, countedActual);
      const expectedOverlap = n - Math.round(n / 2);
      if (result !== expectedOverlap) {
        throw new Error(`คาดว่าจะได้ ${expectedOverlap} ค่าที่ปรากฏทั้งสองฝั่ง แต่ได้ ${result}`);
      }
      if (counter.count > (n + n) * 5) {
        throw new Error(`countMatchingValues ใช้ nested loop เทียบทุกคู่ระหว่างสอง array (O(n*m)) — เข้าถึง array รวม ${counter.count} ครั้งสำหรับข้อมูลฝั่งละ ${n} ตัว (ควรอยู่ราวๆ O(n+m) คือหลักพัน ไม่ใช่หลักล้าน) ให้สร้าง Set จากฝั่งใดฝั่งหนึ่งก่อน แล้ว scan อีกฝั่งแค่รอบเดียว`);
      }
      log(`✓ นับค่าที่ปรากฏร่วมกันถูกต้องและใช้แนวทาง O(n+m) จริง (เข้าถึง array รวม ${counter.count} ครั้ง จากข้อมูลฝั่งละ ${n} ตัว)`);
    },
    hint: "สร้าง Set จาก array ฝั่งใดฝั่งหนึ่งก่อน (เช่น expected) แล้ววนลูปครั้งเดียวผ่านอีกฝั่ง (actual) เช็คแต่ละค่าว่าอยู่ใน Set นั้นไหม — เก็บผลลัพธ์ที่เจอไว้ใน Set อีกตัวเพื่อไม่นับค่าเดิมซ้ำสองครั้ง แล้วนับขนาดของ Set ผลลัพธ์นั้น ห้ามวนลูปซ้อนลูปเทียบทุกคู่ระหว่าง expected กับ actual โดยตรง",
    solution: `function countMatchingValues(expected, actual) {
  const expectedSet = new Set(expected);
  const matched = new Set();
  for (let i = 0; i < actual.length; i++) {
    if (expectedSet.has(actual[i])) {
      matched.add(actual[i]);
    }
  }
  return matched.size;
}`,
    theory: `บทนี้รวมทุกอย่างที่เรียนมาในเทรคนี้เข้าด้วยกัน: การจับคู่ข้อมูลระหว่าง 2 รายการ (เช่น "expected vs actual" ที่ QA เจอแทบทุกวัน) ถ้าเขียนแบบไร้เดียงสาด้วย nested loop (วนลูปนอกไล่ <code>expected</code> ทีละตัว วนลูปในไล่ <code>actual</code> ทีละตัวเทียบกัน) จะได้ความซับซ้อน <code>O(n*m)</code> — ที่ n=m=2,500 (ตามตัวอย่างในบทนี้) วิธีนี้ทำงานประมาณ 6.25 ล้านครั้ง<br/><br/>
    ทางแก้ต่อยอดจากบท "Hash Table / Set": สร้าง <code>Set</code> จากฝั่งใดฝั่งหนึ่งก่อน (ใช้เวลา O(n) ครั้งเดียว) แล้ววนลูปอีกฝั่งแค่รอบเดียว เช็คแต่ละตัวกับ Set นั้น (O(1) ต่อครั้ง) รวมทั้งหมดกลายเป็น <code>O(n+m)</code> — ที่ n=m=2,500 เหลือแค่ราวๆ 5,000 ครั้ง เร็วกว่าวิธี nested loop กว่า 1,000 เท่า<br/><br/>
    นี่คือรูปแบบการคิดที่ต้องฝึกให้เป็นสัญชาตญาณในงาน QA: ทุกครั้งที่เห็นตัวเองกำลังจะเขียน nested loop เทียบข้อมูล 2 ชุด ให้ถามตัวเองก่อนว่า "แปลงฝั่งใดฝั่งหนึ่งเป็น Set ก่อนได้ไหม" — เกือบทุกครั้งคำตอบคือได้ และเปลี่ยนจาก O(n*m) เป็น O(n+m) ได้ทันที`,
    example: `// ตัวอย่างใช้เทคนิคเดียวกันหาค่าที่อยู่ฝั่งเดียว (expected เท่านั้น ไม่มีใน actual)
function findMissingValues(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter(v => !actualSet.has(v));
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function countMatchingValues(expected, actual)</code><br/>
    2. สร้าง <code>Set</code> จากฝั่งใดฝั่งหนึ่งก่อน แล้ว scan อีกฝั่งแค่รอบเดียว (ห้าม nested loop)<br/>
    3. คืนค่าจำนวนค่าที่ไม่ซ้ำกันซึ่งปรากฏอยู่ทั้งสองฝั่ง`
  },
  {
    id: "memoization_basics",
    meta: "ขั้นสูง 1",
    title: "Basic Dynamic Programming: Memoization กับ Test ที่คำนวณซ้ำ",
    template: `// สถานการณ์: helper คำนวณ "จำนวนวิธีที่เป็นไปได้" ของ test path แบบ recursive
// countPossibleTestPaths(n) = countPossibleTestPaths(n-1) + countPossibleTestPaths(n-2)
// (แต่ละขั้นเลือกได้ 2 แบบ ต่อยอดจากขั้นก่อนหน้าหรือสองขั้นก่อนหน้า) กรณีฐาน: n<=1 คืนค่า 1
// แบบ recursive ล้วนๆ ไม่มี memoization จะคำนวณค่าเดิมซ้ำเป็นล้านครั้งเมื่อ n โต (ช้ามาก)
//
// 1. เขียน function countPossibleTestPaths(n) ให้ได้ผลลัพธ์ถูกต้องตามสูตรข้างต้น
//    ต้องใช้ Memoization (เก็บผลลัพธ์ที่เคยคำนวณแล้วไว้ใช้ซ้ำ) ไม่ใช่ recursive ล้วนๆ ที่คำนวณซ้ำ
//    (ทดสอบด้วย n=42 ต้องได้คำตอบเร็ว ถ้าไม่ memoize จะช้ามากจนเกิน timeout)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ countPossibleTestPaths() ทั้งความถูกต้องและว่า Memoize จริง...");
      const fn = getLearnerFn(code, "countPossibleTestPaths");

      if (fn(0) !== 1) throw new Error("countPossibleTestPaths(0) ต้องได้ 1 (base case)");
      if (fn(1) !== 1) throw new Error("countPossibleTestPaths(1) ต้องได้ 1 (base case)");
      if (fn(2) !== 2) throw new Error("countPossibleTestPaths(2) ต้องได้ 2 (paths(1) + paths(0) = 1 + 1)");
      if (fn(5) !== 8) throw new Error(`countPossibleTestPaths(5) ต้องได้ 8 แต่ได้ ${fn(5)}`);

      // Without memoization, n=42 needs ~2^42 recursive calls (unmemoized Fibonacci-shaped
      // recursion, ~430 million) — measured ~2.1s on ordinary dev hardware. Memoized, it's
      // near-instant (<5ms) regardless of hardware. A 500ms budget leaves wide margin on both
      // sides even accounting for real machine-speed variance — unlike n=35's original 1000ms
      // budget, which left too little margin (~800ms measured) to be reliably non-flaky.
      const start = Date.now();
      const result = fn(42);
      const elapsed = Date.now() - start;
      if (result !== 433494437) {
        throw new Error(`countPossibleTestPaths(42) ต้องได้ 433494437 แต่ได้ ${result}`);
      }
      if (elapsed > 500) {
        throw new Error(`countPossibleTestPaths(42) ใช้เวลา ${elapsed}ms (เกิน 500ms) — แปลว่ายังเป็น recursive ล้วนๆ ที่คำนวณค่าเดิมซ้ำหลายร้อยล้านครั้ง (exponential) ต้องเก็บผลลัพธ์ที่เคยคำนวณแล้วไว้ใน cache (memoization) เพื่อไม่คำนวณ n เดิมซ้ำสองครั้ง`);
      }
      log(`✓ คำนวณถูกต้องและใช้ Memoization จริง (n=42 ใช้เวลาแค่ ${elapsed}ms)`);
    },
    hint: "สร้าง cache (object หรือ Map) เก็บผลลัพธ์ที่เคยคำนวณแล้วตาม n ไว้ นอกฟังก์ชันหลักหรือผ่าน closure — ก่อนคำนวณ n ใดๆ ให้เช็ค cache ก่อนว่ามีคำตอบของ n นี้แล้วหรือยัง ถ้ามีแล้วคืนค่าจาก cache ทันทีโดยไม่ต้องคำนวณซ้ำ ถ้ายังไม่มีค่อยคำนวณตามสูตร (เรียกตัวเองสำหรับ n-1 และ n-2) แล้วเก็บผลลัพธ์ลง cache ก่อน return",
    solution: `function countPossibleTestPaths(n, cache = {}) {
  if (n <= 1) return 1;
  if (n in cache) return cache[n];
  const result = countPossibleTestPaths(n - 1, cache) + countPossibleTestPaths(n - 2, cache);
  cache[n] = result;
  return result;
}`,
    theory: `<strong>Dynamic Programming (DP)</strong> คือเทคนิคเพิ่มประสิทธิภาพของปัญหาที่ recursive function คำนวณค่าเดิมซ้ำหลายรอบ — <strong>Memoization</strong> คือรูปแบบพื้นฐานที่สุดของ DP: เก็บผลลัพธ์ที่เคยคำนวณแล้วไว้ใน cache แล้วเช็ค cache ก่อนคำนวณใหม่ทุกครั้ง<br/><br/>
    <code>countPossibleTestPaths(n)</code> มีรูปแบบเดียวกับ Fibonacci: <code>f(n) = f(n-1) + f(n-2)</code> — ถ้าเขียนแบบ recursive ล้วนๆ ไม่มี cache การคำนวณ <code>f(42)</code> จะเรียก <code>f(41)</code> และ <code>f(40)</code> แต่ <code>f(41)</code> เองก็เรียก <code>f(40)</code> ซ้ำอีกที (คนละ call กัน) — ยิ่ง n ใหญ่ขึ้น จำนวนการเรียกซ้ำโตแบบ<strong>เอ็กซ์โพเนนเชียล</strong> (<code>O(2^n)</code>) ที่ n=42 คือเรียกฟังก์ชันรวมกันหลายร้อยล้านครั้ง ใช้เวลาหลักวินาทีเป็นต้นไป<br/><br/>
    Memoization แก้ปัญหานี้ด้วยการสังเกตว่า <code>f(33)</code> มีค่าเดียวเสมอไม่ว่าจะถูกเรียกจากที่ไหน — คำนวณครั้งแรกแล้วเก็บไว้ ครั้งต่อไปที่ต้องใช้ค่าเดิมก็หยิบจาก cache แทนคำนวณใหม่ ทำให้ทั้งฟังก์ชันเหลือความซับซ้อนแค่ <code>O(n)</code> (คำนวณแต่ละค่าของ n แค่ครั้งเดียว) — ในงาน QA เทคนิคนี้ใช้ได้ทุกครั้งที่ helper function มีการคำนวณค่าเดิมซ้ำๆ จากอินพุตเดิม เช่น การประเมิน combination ของ test parameter ที่ซ้อนทับกัน (ย้อนกลับไปเชื่อมกับหลัก Pairwise Testing ใน track Test Design Theory)`,
    example: `// ตัวอย่าง memoization ด้วย Map แทน object literal (กันปัญหา key ชนกับ prototype property)
function fibWithMap(n, cache = new Map()) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n);
  const result = fibWithMap(n - 1, cache) + fibWithMap(n - 2, cache);
  cache.set(n, result);
  return result;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function countPossibleTestPaths(n)</code> ตามสูตร <code>f(n) = f(n-1) + f(n-2)</code>, base case <code>n<=1</code> คืนค่า 1<br/>
    2. ใช้ cache เก็บผลลัพธ์ที่เคยคำนวณแล้ว (memoization) ไม่ใช่ recursive ล้วนๆ<br/>
    3. ต้องคำนวณ <code>n=42</code> ได้เร็ว ไม่ใช้เวลาเกิน 500 มิลลิวินาที`
  },
  {
    id: "queue_fifo",
    meta: "ขั้นสูง 2",
    title: "Queue: ลำดับการรัน CI Job แบบ FIFO (ต่างจาก Stack)",
    template: `// สถานการณ์: CI job ต้องรันตามลำดับ "เข้าคิวก่อน ได้รันก่อน" (FIFO — First In, First Out)
// ต่างจาก Stack (บทที่แล้ว) ที่เป็น LIFO (เข้าหลังสุด ออกก่อน)
//
// 1. เขียน class ชื่อ JobQueue มี 3 เมธอด:
//    - enqueue(job): เพิ่ม job เข้าท้ายคิว
//    - dequeue(): เอา job ตัวแรกสุดที่เข้าคิวออกและคืนค่า (คืนค่า undefined ถ้าคิวว่าง)
//    - isEmpty(): คืนค่า true/false ว่าคิวว่างเปล่าหรือไม่
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ JobQueue ว่าเป็น FIFO จริง (ไม่ใช่ LIFO)...");
      const QueueClass = getLearnerFn(code, "JobQueue");
      const q = new QueueClass();

      if (q.isEmpty() !== true) {
        throw new Error("isEmpty() ของคิวที่ยังไม่มี job ต้องคืนค่า true");
      }
      q.enqueue("A");
      q.enqueue("B");
      q.enqueue("C");
      if (q.isEmpty() !== false) {
        throw new Error("isEmpty() ของคิวที่มี job อยู่ต้องคืนค่า false");
      }
      if (q.dequeue() !== "A") {
        throw new Error("dequeue() ครั้งแรกต้องได้ 'A' (เข้าคิวก่อนสุด) ไม่ใช่ 'C' (ถ้าได้ 'C' แปลว่าเขียนเป็น LIFO แบบ Stack ไปแล้ว)");
      }
      if (q.dequeue() !== "B") {
        throw new Error("dequeue() ครั้งที่สองต้องได้ 'B'");
      }
      q.enqueue("D"); // interleave enqueue/dequeue to prove real FIFO ordering, not just reversal
      if (q.dequeue() !== "C") {
        throw new Error("dequeue() ครั้งที่สามต้องได้ 'C' (ยังเหลือค้างจากก่อนหน้า D จะเข้าคิวทีหลัง ต้องออกทีหลัง)");
      }
      if (q.dequeue() !== "D") {
        throw new Error("dequeue() ครั้งที่สี่ต้องได้ 'D'");
      }
      if (q.isEmpty() !== true) {
        throw new Error("คิวต้องว่างเปล่าหลัง dequeue ครบทุกตัวแล้ว");
      }
      if (q.dequeue() !== undefined) {
        throw new Error("dequeue() ตอนคิวว่างเปล่าต้องคืนค่า undefined ไม่ใช่ throw error หรือคืนค่าอื่น");
      }
      log("✓ JobQueue ทำงานแบบ FIFO ถูกต้อง — ทดสอบด้วยการสลับ enqueue/dequeue แล้วลำดับยังถูกต้อง");
    },
    hint: "เก็บ job ทั้งหมดไว้ใน array ภายใน class — enqueue ให้ push เข้าท้าย array, dequeue ให้เอาตัวแรกสุดของ array ออก (มีเมธอดของ array ที่เอาตัวหน้าสุดออกและคืนค่าตัวนั้นพอดี) ห้ามใช้ pop() (นั่นคือ LIFO แบบ Stack) ต้องเอาตัวหน้าสุดออก ไม่ใช่ตัวท้ายสุด",
    solution: `class JobQueue {
  constructor() {
    this.items = [];
  }
  enqueue(job) {
    this.items.push(job);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}`,
    theory: `<strong>Queue</strong> คือโครงสร้างข้อมูลแบบ <strong>FIFO</strong> (First In, First Out — เข้าก่อน ออกก่อน) ตรงข้ามกับ <strong>Stack</strong> (บทที่แล้ว) ที่เป็น LIFO — เปรียบเหมือนคิวต่อแถวจริงๆ คนที่มาต่อคิวก่อนได้รับบริการก่อนเสมอ ไม่ว่าจะมีคนมาต่อแถวเพิ่มกี่คนก็ตาม<br/><br/>
    ใน CI/CD Pipeline งานที่ถูก trigger (เช่น job ที่รอ runner ว่าง) มักจะประมวลผลแบบ FIFO เพื่อความยุติธรรม — job ที่ trigger ก่อนควรได้รันก่อน ไม่ใช่ให้ job ที่เพิ่ง trigger ล่าสุดแซงคิวไปรันก่อน (ซึ่งจะเกิดขึ้นถ้าใช้ Stack โดยไม่ตั้งใจ)<br/><br/>
    <strong>ข้อสังเกตเรื่อง Big-O:</strong> โซลูชันในบทนี้ใช้ <code>Array.prototype.shift()</code> ซึ่งจริงๆ แล้วเป็น <code>O(n)</code> ต่อครั้ง (ต้องขยับสมาชิกที่เหลือทุกตัวมาชิดซ้าย 1 ตำแหน่ง — เชื่อมกับบท "Array vs Linked List" ก่อนหน้านี้) ถ้าต้องเรียก dequeue บ่อยมากกับคิวขนาดใหญ่ ควรพิจารณาใช้ Linked List หรือ index สองตัว (head/tail pointer) แทน เพื่อให้ dequeue เป็น <code>O(1)</code> จริง แต่สำหรับคิวขนาดทั่วไปในงาน QA เช่น mock job queue การใช้ array ธรรมดาแบบนี้เพียงพอแล้ว`,
    example: `// ตัวอย่าง Queue ใช้จำลองคิวรอ retry ของ test ที่ fail (ไม่ใช่คำตอบของโจทย์นี้)
class RetryQueue extends JobQueue {
  hasMore() {
    return !this.isEmpty();
  }
}`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>class JobQueue</code><br/>
    2. <code>enqueue(job)</code> เพิ่ม job เข้าท้ายคิว<br/>
    3. <code>dequeue()</code> เอา job ตัวแรกสุดออก (FIFO), คืนค่า <code>undefined</code> ถ้าคิวว่าง<br/>
    4. <code>isEmpty()</code> คืนค่า <code>true</code>/<code>false</code>`
  },
  {
    id: "bfs_shortest_path",
    meta: "ขั้นสูง 3",
    title: "BFS: หาระยะทางสั้นที่สุดระหว่าง Job สองตัวใน Dependency Graph",
    template: `// สถานการณ์: อยากรู้ว่า job หนึ่งๆ ต้องผ่าน dependency กี่ขั้นถึงจะไปถึง job ปลายทางได้ (สั้นที่สุด)
// การไล่กราฟแบบ DFS (บทที่แล้ว) เจอเส้นทางได้ก็จริง แต่ไม่การันตีว่าเป็นเส้นทางที่ "สั้นที่สุด"
// ต้องใช้ BFS (Breadth-First Search — ไล่ทีละ "ชั้น" ด้วย Queue จากบทที่แล้ว) ถึงจะการันตีระยะทางสั้นสุด
//
// 1. เขียน function shortestPath(graph, start, end) รับ graph แบบเดียวกับบท Graph ก่อนหน้า
//    (object ที่แต่ละ key คือชื่อ job ค่าคือ array ของ job ที่เชื่อมต่อถึงได้โดยตรง)
//    คืนค่าจำนวน "ขั้น" (edge) น้อยที่สุดจาก start ไปถึง end
//    คืนค่า 0 ถ้า start === end, คืนค่า -1 ถ้าไปไม่ถึง end เลย
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ shortestPath() ด้วย BFS...");
      const fn = getLearnerFn(code, "shortestPath");

      const graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: ["E"], E: [] };
      if (fn(graph, "A", "A") !== 0) throw new Error("shortestPath(graph,'A','A') ต้องได้ 0 (ต้นทางกับปลายทางเดียวกัน)");
      if (fn(graph, "A", "D") !== 2) throw new Error(`shortestPath(graph,'A','D') ต้องได้ 2 (A->B->D หรือ A->C->D) แต่ได้ ${fn(graph, "A", "D")}`);
      if (fn(graph, "A", "E") !== 3) throw new Error(`shortestPath(graph,'A','E') ต้องได้ 3 แต่ได้ ${fn(graph, "A", "E")}`);
      if (fn(graph, "A", "ZZZ") !== -1) throw new Error("shortestPath ไปยัง node ที่ไม่มีอยู่จริงต้องได้ -1");

      // Graph with BOTH a short path (2 hops) and a much longer path (5 hops) to the same
      // target — a solution that just finds *a* path (without tracking the shortest) could
      // return 5 here if it happens to explore the long branch. True BFS always gets 2.
      const tricky = {
        X: ["Y", "Z"],
        Y: ["W"],
        Z: ["A2"],
        A2: ["B2"],
        B2: ["C2"],
        C2: ["W"],
        W: [],
      };
      if (fn(tricky, "X", "W") !== 2) {
        throw new Error(`shortestPath(tricky,'X','W') ต้องได้ 2 (X->Y->W คือเส้นทางสั้นสุด แม้จะมีเส้นทาง X->Z->A2->B2->C2->W ที่ยาวกว่าอยู่ด้วย) แต่ได้ ${fn(tricky, "X", "W")} — ตรวจสอบว่าใช้ BFS ไล่ทีละชั้นจริง ไม่ใช่แค่หาเส้นทางแรกที่เจอ`);
      }

      log("✓ หาระยะทางสั้นที่สุดถูกต้องทุกกรณี รวมถึงกรณีมีเส้นทางยาวกว่าให้เลือกด้วย");
    },
    hint: "ใช้ Queue (บทที่แล้ว) เก็บคู่ [node, ระยะทางสะสม] เริ่มจาก [start, 0] แล้ว dequeue ทีละตัว ถ้า node ที่ dequeue ได้คือ end ให้คืนค่าระยะทางตอนนั้นทันที ไม่งั้นให้ enqueue เพื่อนบ้านของ node นั้นที่ยังไม่เคยเยือน พร้อมระยะทาง+1 — เก็บ Set ของ node ที่เคยเยือนแล้วไว้กันวนซ้ำ การไล่ทีละ 'ชั้น' แบบนี้ (BFS) การันตีว่าเจอ end ครั้งแรกคือระยะทางสั้นที่สุดเสมอ",
    solution: `function shortestPath(graph, start, end) {
  if (start === end) return 0;

  const visited = new Set([start]);
  const queue = [[start, 0]];

  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    const neighbors = graph[node] || [];
    for (const next of neighbors) {
      if (next === end) return dist + 1;
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([next, dist + 1]);
      }
    }
  }
  return -1;
}`,
    theory: `<strong>BFS (Breadth-First Search)</strong> ไล่กราฟทีละ "ชั้น" (level) จากจุดเริ่มต้น — เยือนเพื่อนบ้านโดยตรงทั้งหมดก่อน แล้วค่อยไปเพื่อนบ้านของเพื่อนบ้าน (ชั้นที่ 2) แล้วค่อยชั้นที่ 3 ไปเรื่อยๆ ต่างจาก <strong>DFS</strong> (บท "Graphs" ก่อนหน้า) ที่ลงลึกไปตามเส้นทางเดียวก่อนจนสุดทาง แล้วค่อยย้อนกลับมาลองเส้นทางอื่น<br/><br/>
    คุณสมบัติสำคัญของ BFS: เพราะไล่ทีละชั้นเรียงจากใกล้ไปไกล <strong>node แรกที่เจอ end คือระยะทางสั้นที่สุดเสมอ</strong> (ในกราฟที่ไม่มีน้ำหนักบนเส้นเชื่อม) — DFS ไม่มีคุณสมบัตินี้ เพราะอาจดิ่งลงเส้นทางยาวก่อนโดยบังเอิญ แล้วเจอ end ที่นั่นทั้งที่มีทางลัดสั้นกว่าอยู่<br/><br/>
    เครื่องมือที่ทำให้ BFS ไล่ "ทีละชั้น" ได้ถูกต้องคือ <strong>Queue</strong> (FIFO จากบทที่แล้ว) — ใส่ node ที่ยังไม่ได้เยือนเข้าคิวตามลำดับที่ค้นพบ แล้ว dequeue ออกมาตามลำดับเดียวกัน ทำให้ node ที่ใกล้กว่าเสมอถูกประมวลผลก่อน node ที่ไกลกว่า (ถ้าใช้ Stack แทน Queue ตรงนี้ จะกลายเป็น DFS ทันที) — ในงาน QA เทคนิคนี้ตอบคำถาม "ต้องผ่านกี่ job/service ถึงจะไปถึงเป้าหมาย" ซึ่งมีประโยชน์ตอนวิเคราะห์ CI dependency graph หรือ service call graph ที่ซับซ้อน`,
    example: `// ตัวอย่าง BFS แบบเดียวกันแต่เก็บ "เส้นทาง" ทั้งเส้นแทนแค่ระยะทาง (ไม่ใช่คำตอบของโจทย์นี้)
function shortestPathRoute(graph, start, end) {
  const visited = new Set([start]);
  const queue = [[start]];
  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (node === end) return path;
    for (const next of (graph[node] || [])) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return null;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function shortestPath(graph, start, end)</code><br/>
    2. ใช้ BFS (Queue) ไล่ทีละชั้นจาก <code>start</code><br/>
    3. คืนค่า <code>0</code> ถ้า <code>start === end</code>, คืนค่าระยะทางสั้นสุดถ้าไปถึง, คืนค่า <code>-1</code> ถ้าไปไม่ถึง`
  },
  {
    id: "priority_queue_min_heap",
    meta: "ขั้นสูง 4",
    title: "Heap / Priority Queue: รัน Test ที่ Priority สูงสุดก่อนเสมอ",
    template: `// สถานการณ์: test scheduler ต้องรัน test ที่มี priority ต่ำสุด (เร่งด่วนที่สุด) ก่อนเสมอ
// ไม่ว่าจะถูกเพิ่มเข้ามาตอนไหนก็ตาม — ต่างจาก Queue (FIFO) และ Stack (LIFO) ที่ดูแค่ "ลำดับการเข้า"
// โครงสร้างที่เหมาะกับงานนี้คือ Priority Queue ซึ่งมักสร้างจาก Binary Heap ข้างใน
//
// 1. เขียน class ชื่อ MinPriorityQueue มี 3 เมธอด:
//    - insert(item, priority): เพิ่ม item พร้อมค่า priority (ตัวเลข ยิ่งน้อยยิ่งเร่งด่วน)
//    - extractMin(): เอา item ที่ priority น้อยที่สุดออกและคืนค่าเป็น { item, priority }
//      (คืนค่า undefined ถ้าคิวว่าง) ต้องคืนค่าตาม priority น้อยไปมากเสมอ ไม่ว่าจะ insert ลำดับไหน
//    - isEmpty(): คืนค่า true/false
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ MinPriorityQueue ว่าคืนค่าตาม priority จริง...");
      const PQClass = getLearnerFn(code, "MinPriorityQueue");
      const pq = new PQClass();

      if (pq.isEmpty() !== true) {
        throw new Error("isEmpty() ของคิวที่ยังไม่มีอะไรเลย ต้องคืนค่า true");
      }

      // Insert deliberately out of priority order — a correct priority queue must still
      // extract them from lowest to highest priority regardless of insertion order.
      pq.insert("C", 30);
      pq.insert("A", 10);
      pq.insert("D", 40);
      pq.insert("B", 20);

      if (pq.isEmpty() !== false) {
        throw new Error("isEmpty() ของคิวที่มี item อยู่ ต้องคืนค่า false");
      }

      const order = [];
      while (!pq.isEmpty()) {
        const result = pq.extractMin();
        if (!result || typeof result !== "object" || !("item" in result) || !("priority" in result)) {
          throw new Error(`extractMin() ต้อง return object รูปแบบ { item, priority } แต่ได้ ${JSON.stringify(result)}`);
        }
        order.push(result.item);
      }

      if (JSON.stringify(order) !== JSON.stringify(["A", "B", "C", "D"])) {
        throw new Error(`extractMin() ต้องคืนค่าตามลำดับ priority น้อยไปมาก (A=10, B=20, C=30, D=40) ได้ลำดับ ['A','B','C','D'] แต่ได้ ${JSON.stringify(order)}`);
      }
      if (pq.extractMin() !== undefined) {
        throw new Error("extractMin() ตอนคิวว่างเปล่าต้องคืนค่า undefined");
      }
      log("✓ MinPriorityQueue คืนค่าตาม priority น้อยไปมากถูกต้องเสมอ ไม่ว่าจะ insert ลำดับไหน");
    },
    hint: "วิธีที่ง่ายที่สุด (ไม่ต้องสร้าง Binary Heap เต็มรูปแบบ): เก็บ item ทั้งหมดไว้ใน array ธรรมดา ตอน extractMin ให้หาตำแหน่งที่ priority น้อยที่สุดในนั้นก่อน แล้วเอาตัวนั้นออกจาก array (ใช้เมธอดที่ลบสมาชิกที่ตำแหน่งใดตำแหน่งหนึ่งออกได้) แล้วคืนค่ากลับไป — โซลูชันเต็มจะแสดง Binary Heap จริงที่ทำได้เร็วกว่า (O(log n) ต่อครั้ง) ให้ดูเป็นตัวอย่างเพิ่มเติม",
    solution: `class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  insert(item, priority) {
    this.heap.push({ item, priority });
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  extractMin() {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
        if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
        if (smallest === i) break;
        [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
        i = smallest;
      }
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}`,
    theory: `<strong>Priority Queue</strong> คือโครงสร้างที่คืนค่า "item ที่สำคัญที่สุด" ออกมาก่อนเสมอ (ในบทนี้คือ priority น้อยที่สุด = เร่งด่วนที่สุด) ไม่สนใจลำดับการเพิ่มเข้ามาเลย — ต่างจาก Queue (FIFO) และ Stack (LIFO) ที่สนใจแค่ "เข้ามาตอนไหน"<br/><br/>
    เบื้องหลัง Priority Queue ที่มีประสิทธิภาพมักสร้างจาก <strong>Binary Heap</strong>: โครงสร้างต้นไม้ (ต่อยอดจากบท "Trees") ที่เก็บอยู่ใน array เดียว โดยรับประกันว่า node แม่ (parent) ต้องมี priority น้อยกว่าหรือเท่ากับ node ลูกเสมอ (Min-Heap Property) — ทำให้ item ที่ priority น้อยที่สุดอยู่ตำแหน่งบนสุด (index 0) เสมอ หยิบออกได้ทันที<br/><br/>
    <code>insert</code> ใส่ค่าใหม่ต่อท้าย array แล้ว "ลอยขึ้น" (sift-up) สลับตำแหน่งกับ parent ไปเรื่อยๆ จนกว่า Min-Heap Property จะถูกต้อง — <code>extractMin</code> เอาตัวบนสุดออก เอาตัวท้าย array มาไว้บนสุดแทนชั่วคราว แล้ว "จมลง" (sift-down) สลับกับลูกที่น้อยกว่าไปเรื่อยๆ จนกว่าจะถูกต้องอีกครั้ง — ทั้งสองการกระทำนี้ใช้เวลาแค่ <code>O(log n)</code> เพราะความสูงของ Binary Heap คือ <code>log n</code> เสมอ (ต่อยอดจากบท "Big-O Notation")<br/><br/>
    ในงาน QA เทคนิคนี้ใช้ตรงกับการเขียน test scheduler ที่ต้องรัน test เร่งด่วน (เช่น smoke test ก่อน deploy) ก่อน test ทั่วไปเสมอ ไม่ว่า test เหล่านั้นจะถูกเพิ่มเข้าคิวเมื่อไหร่ก็ตาม`,
    example: `// ตัวอย่างใช้ Priority Queue จำลอง scheduler จริง (ไม่ใช่คำตอบของโจทย์นี้)
const scheduler = new MinPriorityQueue();
scheduler.insert('smoke-test', 1);   // priority 1 = เร่งด่วนสุด
scheduler.insert('regression-test', 5);
scheduler.insert('hotfix-verify', 0); // priority 0 = เร่งด่วนกว่า smoke-test อีก
console.log(scheduler.extractMin().item); // 'hotfix-verify' ออกมาก่อนเสมอ`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>class MinPriorityQueue</code><br/>
    2. <code>insert(item, priority)</code> เพิ่ม item พร้อม priority<br/>
    3. <code>extractMin()</code> คืนค่า <code>{ item, priority }</code> ที่ priority น้อยที่สุด เสมอ ไม่ว่าจะ insert ลำดับไหน<br/>
    4. <code>isEmpty()</code> คืนค่า <code>true</code>/<code>false</code>`
  },
  {
    id: "merge_sort_algorithm",
    meta: "ขั้นสูง 5",
    title: "Merge Sort: เขียน Sorting Algorithm เองแบบ Divide and Conquer",
    template: `// สถานการณ์: บท "Sorting และ Stability" ก่อนหน้าใช้ Array.prototype.sort() สำเร็จรูป
// แต่ตอนต้อง review/debug helper ที่เขียน sort เองในโปรเจกจริง ต้องเข้าใจว่าข้างในทำงานอย่างไร
// Merge Sort คือ sorting algorithm แบบ Divide and Conquer ที่ทำงานเร็วสม่ำเสมอ O(n log n)
//
// 1. เขียน function mergeSort(arr) รับ array of number
//    คืนค่า array ใหม่ที่เรียงจากน้อยไปมาก โดยใช้เทคนิค Merge Sort เอง (แบ่งครึ่ง เรียงแต่ละครึ่ง แล้ว merge กลับ)
//    ห้ามเรียก Array.prototype.sort() ในนี้ (โจทย์นี้ต้องเขียน sort เอง ไม่ใช่พึ่งฟังก์ชันสำเร็จรูป)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ mergeSort() ทั้งความถูกต้องและว่าเขียนเองจริง...");
      const clean = stripComments(code);
      if (/\.sort\s*\(/.test(clean)) {
        throw new Error("ห้ามเรียก Array.prototype.sort() ในนี้ — โจทย์นี้ต้องเขียน Merge Sort ด้วยตัวเอง (แบ่งครึ่ง เรียงแต่ละครึ่งแบบ recursive แล้ว merge สอง array ที่เรียงแล้วกลับเข้าด้วยกัน)");
      }

      const fn = getLearnerFn(code, "mergeSort");

      const small = fn([5, 2, 8, 1]);
      if (JSON.stringify(small) !== JSON.stringify([1, 2, 5, 8])) {
        throw new Error(`mergeSort([5,2,8,1]) ต้องได้ [1,2,5,8] แต่ได้ ${JSON.stringify(small)}`);
      }
      if (JSON.stringify(fn([7])) !== JSON.stringify([7])) {
        throw new Error("mergeSort([7]) ต้องได้ [7] (array ตัวเดียวถือว่าเรียงอยู่แล้ว)");
      }
      if (JSON.stringify(fn([])) !== JSON.stringify([])) {
        throw new Error("mergeSort([]) ต้องได้ [] (array ว่างเปล่า)");
      }

      // Larger deterministic input to catch merge-step bugs that small inputs might hide.
      const big = Array.from({ length: 200 }, (_, i) => (i * 37) % 200);
      const sortedBig = fn(big);
      const expectedBig = [...big].sort((a, b) => a - b);
      if (JSON.stringify(sortedBig) !== JSON.stringify(expectedBig)) {
        throw new Error("mergeSort กับข้อมูล 200 ตัว ให้ผลลัพธ์ไม่ถูกต้อง (ลองเช็ค merge step ว่ารวมสอง array ที่เรียงแล้วถูกต้องหรือไม่)");
      }

      log("✓ Merge Sort ถูกต้องและเขียนเองจริง ไม่ได้พึ่ง Array.prototype.sort()");
    },
    hint: "แบ่ง array ออกเป็นสองครึ่งเท่าๆ กัน เรียก mergeSort ซ้ำ (recursive) กับแต่ละครึ่งจนเหลือ array ที่มี 0 หรือ 1 ตัว (เรียงอยู่แล้วโดยปริยาย เป็น base case) จากนั้นเขียนฟังก์ชัน merge แยกต่างหากที่รวมสอง array ที่เรียงแล้วเข้าด้วยกัน โดยเทียบตัวหน้าสุดของสองฝั่งทีละคู่ เอาตัวที่น้อยกว่าใส่ผลลัพธ์ก่อนเสมอ จนกว่าฝั่งใดฝั่งหนึ่งจะหมด แล้วค่อยใส่ที่เหลือของอีกฝั่งต่อท้าย",
    solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }
  return result;
}`,
    theory: `<strong>Merge Sort</strong> คือ sorting algorithm แบบ <strong>Divide and Conquer</strong> (แบ่งปัญหาใหญ่เป็นปัญหาย่อยที่เหมือนกัน แก้ปัญหาย่อยแล้วรวมผลกลับ) ต่อยอดโดยตรงจากบท "Recursion": แบ่ง array เป็นสองครึ่งซ้ำๆ (recursive) จนเหลือ array ขนาด 0-1 ตัว (เรียงอยู่แล้วโดยปริยาย, base case) แล้วค่อย <strong>merge</strong> สอง array ที่เรียงแล้วกลับเข้าด้วยกันทีละคู่จากล่างขึ้นบน<br/><br/>
    ทำไมถึงเร็วสม่ำเสมอ <code>O(n log n)</code>: การแบ่งครึ่งซ้ำๆ ให้ความลึก <code>log n</code> ชั้น (เหมือนความสูงของ Binary Tree ที่สมดุล) แต่ละชั้นต้องทำงาน merge รวมทั้งหมด <code>O(n)</code> (เทียบและใส่ทุกตัวลง array ผลลัพธ์) รวมกันทุกชั้นจึงเป็น <code>O(n log n)</code> — เร็วกว่า sorting algorithm พื้นฐาน (bubble sort, insertion sort) ที่เป็น <code>O(n^2)</code> อย่างมากเมื่อข้อมูลใหญ่ขึ้น (เชื่อมกับบท "Big-O Notation")<br/><br/>
    ข้อดีอีกอย่างของ Merge Sort ที่เขียนตามบทนี้: เป็น <strong>stable sort</strong> โดยธรรมชาติ (ตอน merge ถ้าค่าเท่ากัน เลือกฝั่งซ้ายก่อนเสมอ <code>left[i] <= right[j]</code>) ตรงกับหลักการ Stability ที่เรียนไปในบท "Sorting และ Stability" — ในงาน QA การเข้าใจกลไกจริงของ sort ช่วยให้ review/debug helper function ที่เขียน sort เองในโปรเจก (ไม่ได้พึ่ง built-in) ได้อย่างมั่นใจ`,
    example: `// ตัวอย่าง merge สอง array ที่เรียงแล้วเข้าด้วยกัน (ส่วนหนึ่งของ Merge Sort)
function mergeExample(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function mergeSort(arr)</code><br/>
    2. แบ่งครึ่งและเรียกตัวเองซ้ำ (recursive) จนถึง base case (array ขนาด 0-1)<br/>
    3. เขียนฟังก์ชัน <code>merge</code> รวมสอง array ที่เรียงแล้วเข้าด้วยกัน<br/>
    4. ห้ามเรียก <code>Array.prototype.sort()</code>`
  },
  {
    id: "dp_2d_lcs",
    meta: "ขั้นสูง 6",
    title: "2D Dynamic Programming: หา Common Sequence ระหว่าง Test Output สองชุด",
    template: `// สถานการณ์: เปรียบเทียบ log/output สองชุดที่อาจมีบางบรรทัดเพิ่ม/หายไป (ไม่ตรงกันเป๊ะทุกตำแหน่ง)
// อยากรู้ว่า "ลำดับร่วม" ที่ยาวที่สุดระหว่างสองชุดคืออะไร (ไม่ต้องติดกัน แค่เรียงลำดับตรงกัน)
// นี่คือปัญหา Longest Common Subsequence (LCS) — DP แบบ 1 มิติ (บท Memoization) ไม่พอ ต้องใช้ตาราง 2 มิติ
//
// 1. เขียน function longestCommonSubsequenceLength(a, b) รับ string สองตัว
//    คืนค่าความยาวของ Longest Common Subsequence (ลำดับร่วมที่ยาวที่สุด ไม่ต้องติดกัน)
//    ตัวอย่าง: "ABCBDAB" กับ "BDCABA" มี LCS ยาว 4 (เช่น "BCBA" หรือ "BDAB")
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ longestCommonSubsequenceLength() ด้วย 2D DP...");
      const fn = getLearnerFn(code, "longestCommonSubsequenceLength");

      if (fn("", "ABC") !== 0) throw new Error("longestCommonSubsequenceLength('', 'ABC') ต้องได้ 0 (string ว่างเปล่าไม่มีอะไรร่วมกับใครได้)");
      if (fn("ABC", "ABC") !== 3) throw new Error("longestCommonSubsequenceLength('ABC', 'ABC') ต้องได้ 3 (เหมือนกันทั้งหมด)");
      if (fn("ABC", "XYZ") !== 0) throw new Error("longestCommonSubsequenceLength('ABC', 'XYZ') ต้องได้ 0 (ไม่มีตัวอักษรร่วมกันเลย)");

      const classic1 = fn("ABCBDAB", "BDCABA");
      if (classic1 !== 4) {
        throw new Error(`longestCommonSubsequenceLength('ABCBDAB', 'BDCABA') ต้องได้ 4 แต่ได้ ${classic1}`);
      }
      const classic2 = fn("AGGTAB", "GXTXAYB");
      if (classic2 !== 4) {
        throw new Error(`longestCommonSubsequenceLength('AGGTAB', 'GXTXAYB') ต้องได้ 4 แต่ได้ ${classic2}`);
      }

      log("✓ หา Longest Common Subsequence ถูกต้องทุกกรณี รวมถึงกรณี classic ที่มีความยาวไม่เท่ากัน");
    },
    hint: "สร้างตาราง 2 มิติ dp[i][j] แทน 'ความยาว LCS ของ a ตัวอักษร i ตัวแรก กับ b ตัวอักษร j ตัวแรก' — ถ้า a[i-1] === b[j-1] (ตัวอักษรตรงกัน) ให้ dp[i][j] = dp[i-1][j-1] + 1 (ต่อยอดจากผลลัพธ์ก่อนหน้าที่ไม่รวมตัวอักษรคู่นี้) ถ้าไม่ตรงกัน ให้ dp[i][j] = ค่ามากสุดระหว่าง dp[i-1][j] กับ dp[i][j-1] (ลองตัดตัวอักษรตัวใดตัวหนึ่งออกแล้วดูว่าฝั่งไหนให้ค่ามากกว่า) แถว/คอลัมน์ที่ 0 (string ว่างเปล่า) ต้องเป็น 0 ทั้งหมด (base case) คำตอบสุดท้ายอยู่ที่ dp[a.length][b.length]",
    solution: `function longestCommonSubsequenceLength(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[n][m];
}`,
    theory: `<strong>2D Dynamic Programming</strong> ต่อยอดจากบท "Memoization" (1D DP — เก็บผลลัพธ์ตามค่า n เดียว) แต่ปัญหาบางแบบต้องการ 2 มิติ (เก็บผลลัพธ์ตามคู่ตัวแปร i, j) — <strong>Longest Common Subsequence (LCS)</strong> คือตัวอย่างคลาสสิกที่สุดของ 2D DP: หาลำดับร่วมที่ยาวที่สุดระหว่าง 2 string โดย<strong>ไม่จำเป็นต้องติดกัน</strong> (ต่างจาก "substring" ที่ต้องติดกันเป๊ะ)<br/><br/>
    ตาราง <code>dp[i][j]</code> แทน "คำตอบของปัญหาย่อย" (LCS ของ a ช่วง i ตัวแรก กับ b ช่วง j ตัวแรก) — กฎการเติมตาราง: ถ้าตัวอักษรตัวปัจจุบันของทั้งสองฝั่งตรงกัน (<code>a[i-1] === b[j-1]</code>) แปลว่าตัวอักษรนี้เป็นส่วนหนึ่งของ LCS ได้แน่นอน ต่อยอดจากคำตอบของปัญหาย่อยที่เล็กกว่า (<code>dp[i-1][j-1] + 1</code>) ถ้าไม่ตรงกัน ต้อง "ลอง" ตัดตัวอักษรฝั่งใดฝั่งหนึ่งออกแล้วดูว่าทางไหนให้ผลลัพธ์ดีกว่า (<code>Math.max(dp[i-1][j], dp[i][j-1])</code>)<br/><br/>
    ทำไมต้องเป็น DP (ไม่ใช่ recursive ล้วนๆ): ถ้าเขียน recursive ตรงๆ ตามนิยาม จะคำนวณปัญหาย่อยเดิมซ้ำหลายครั้ง (เหมือนปัญหาของบท Memoization) แต่ตอนนี้ปัญหาย่อยระบุด้วยคู่ (i, j) ไม่ใช่ค่าเดียว จึงต้องเก็บ cache เป็นตาราง 2 มิติแทนที่จะเป็นค่าเดียวต่อ n — ทำให้ทั้งอัลกอริทึมมีความซับซ้อนแค่ <code>O(n*m)</code> (เติมตารางทีละช่อง) แทนที่จะเป็น exponential แบบ recursive ล้วนๆ<br/><br/>
    ในงาน QA เทคนิคนี้ใช้ตรงกับการเขียนเครื่องมือ diff ระหว่าง expected/actual log หรือ test output สองชุดที่อาจมีบรรทัดเพิ่ม/หายไปบ้าง แต่ยังมี "แก่นร่วม" ที่ตรงกันเรียงลำดับเดิม`,
    example: `// ตัวอย่างต่อยอด: หา string ของ LCS จริง ไม่ใช่แค่ความยาว (ไม่ใช่คำตอบของโจทย์นี้)
function longestCommonSubsequenceString(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  let i = n, j = m, result = '';
  while (i > 0 && j > 0) {
    if (a[i-1] === b[j-1]) { result = a[i-1] + result; i--; j--; }
    else if (dp[i-1][j] >= dp[i][j-1]) i--;
    else j--;
  }
  return result;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function longestCommonSubsequenceLength(a, b)</code><br/>
    2. สร้างตาราง 2 มิติ <code>dp[i][j]</code> ตามกฎ: ตัวอักษรตรงกัน → <code>dp[i-1][j-1]+1</code>, ไม่ตรงกัน → <code>Math.max(dp[i-1][j], dp[i][j-1])</code><br/>
    3. คืนค่า <code>dp[a.length][b.length]</code>`
  },
  {
    id: "bst_insert_search",
    meta: "ขั้นสูง 7",
    title: "Binary Search Tree: โครงสร้างที่เรียงลำดับตัวเองอัตโนมัติ",
    template: `// สถานการณ์: ต้องการเก็บค่าคาดหวัง (expected value) ที่เพิ่มเข้ามาเรื่อยๆ แบบไม่เรียงลำดับ
// แต่ยังอยากค้นหาได้เร็วแบบ Binary Search (บทก่อนหน้า) โดยไม่ต้อง sort ใหม่ทุกครั้งที่เพิ่มค่า
// Binary Search Tree (BST) คือโครงสร้างที่ทำได้: ทุก node ฝั่งซ้ายเล็กกว่า, ทุก node ฝั่งขวามากกว่า
//
// 1. เขียน class BST มี property "root" (เริ่มต้นเป็น null) และ 2 เมธอด:
//    - insert(value): เพิ่มค่าเข้าต้นไม้ตามกฎ BST (สร้าง node รูปแบบ { value, left, right })
//    - contains(value): คืนค่า true/false ว่ามีค่านี้อยู่ในต้นไม้หรือไม่
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ BST ทั้งโครงสร้างจริงและการค้นหา...");
      const BSTClass = getLearnerFn(code, "BST");
      const tree = new BSTClass();

      [50, 30, 70, 20, 40, 60, 80].forEach(v => tree.insert(v));

      if (!tree.root || tree.root.value !== 50) {
        throw new Error(`หลัง insert 50 เป็นตัวแรก root.value ต้องเป็น 50 แต่ได้ ${JSON.stringify(tree.root)}`);
      }
      if (!tree.root.left || tree.root.left.value !== 30) {
        throw new Error("root.left.value ต้องเป็น 30 (30 < 50 ต้องอยู่ฝั่งซ้ายของ root)");
      }
      if (!tree.root.right || tree.root.right.value !== 70) {
        throw new Error("root.right.value ต้องเป็น 70 (70 > 50 ต้องอยู่ฝั่งขวาของ root)");
      }
      if (!tree.root.left.left || tree.root.left.left.value !== 20) {
        throw new Error("root.left.left.value ต้องเป็น 20 (20 < 50 และ 20 < 30 ต้องอยู่ซ้ายสุด)");
      }
      if (!tree.root.left.right || tree.root.left.right.value !== 40) {
        throw new Error("root.left.right.value ต้องเป็น 40 (40 < 50 แต่ 40 > 30 ต้องอยู่ขวาของ 30)");
      }
      if (!tree.root.right.left || tree.root.right.left.value !== 60) {
        throw new Error("root.right.left.value ต้องเป็น 60 (60 > 50 แต่ 60 < 70 ต้องอยู่ซ้ายของ 70)");
      }
      if (!tree.root.right.right || tree.root.right.right.value !== 80) {
        throw new Error("root.right.right.value ต้องเป็น 80 (80 > 50 และ 80 > 70 ต้องอยู่ขวาสุด)");
      }

      for (const v of [50, 30, 70, 20, 40, 60, 80]) {
        if (tree.contains(v) !== true) {
          throw new Error(`contains(${v}) ต้องคืนค่า true (เคย insert ค่านี้ไปแล้ว) แต่ได้ false`);
        }
      }
      if (tree.contains(999) !== false) {
        throw new Error("contains(999) ต้องคืนค่า false (ไม่เคย insert ค่านี้)");
      }
      if (tree.contains(45) !== false) {
        throw new Error("contains(45) ต้องคืนค่า false (ไม่เคย insert ค่านี้ แม้จะอยู่ระหว่าง 40 กับ 50 ก็ตาม)");
      }

      log("✓ BST สร้างโครงสร้างถูกต้องตามกฎ (ซ้ายเล็กกว่า, ขวามากกว่า) และค้นหาได้ถูกต้องทุกกรณี");
    },
    hint: "insert: ถ้า root เป็น null ให้สร้าง node ใหม่เป็น root เลย ไม่งั้นไล่จาก root ลงไป เทียบค่าใหม่กับ node ปัจจุบัน ถ้าน้อยกว่าให้ไปทางซ้าย ถ้ามากกว่าให้ไปทางขวา ทำซ้ำจนเจอตำแหน่งว่าง (left หรือ right เป็น null) แล้วสร้าง node ใหม่ตรงนั้น — contains: ไล่จาก root แบบเดียวกัน ถ้าเจอค่าตรงกันคืนค่า true ถ้าไปจนสุดทาง (เจอ null) แล้วยังไม่เจอ คืนค่า false",
    solution: `class BST {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = { value, left: null, right: null };
    if (this.root === null) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  contains(value) {
    let current = this.root;
    while (current !== null) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }
}`,
    theory: `<strong>Binary Search Tree (BST)</strong> คือ Tree (บทก่อนหน้า) ที่มีกฎเพิ่มเติม: ทุก node ค่าใน subtree ฝั่งซ้ายต้อง<strong>น้อยกว่า</strong> node นั้น และทุกค่าใน subtree ฝั่งขวาต้อง<strong>มากกว่า</strong> — กฎนี้ใช้ซ้ำในทุกระดับของต้นไม้ (recursive property) ทำให้การค้นหาทำงานเหมือน <strong>Binary Search</strong> (บทก่อนหน้า) แต่บนโครงสร้างต้นไม้แทนที่จะเป็น array ที่เรียงไว้แล้ว<br/><br/>
    ข้อดีเหนือ sorted array: BST <strong>insert ค่าใหม่ได้เร็ว</strong> (<code>O(log n)</code> โดยเฉลี่ย ถ้าต้นไม้สมดุลพอสมควร) โดยไม่ต้องขยับข้อมูลทั้งแถวเหมือน sorted array (ซึ่ง insert เป็น <code>O(n)</code>) — แลกมาด้วยการค้นหาที่ยังคงเร็วระดับ <code>O(log n)</code> เหมือน Binary Search เดิม เพราะทุกขั้นตอนตัดครึ่งพื้นที่ค้นหาทิ้งไปได้เหมือนกัน (ไปซ้ายหรือไปขวาแค่ทางเดียว)<br/><br/>
    ข้อควรระวัง: ถ้า insert ค่าตามลำดับที่<strong>เรียงอยู่แล้ว</strong> (เช่น 1,2,3,4,5 ตามลำดับ) BST จะกลายเป็นเส้นตรงเอียงไปทางเดียว (ไม่สมดุลเลย) ทำให้ค้นหากลายเป็น <code>O(n)</code> แทนที่จะเป็น <code>O(log n)</code> — โครงสร้างขั้นสูงกว่าอย่าง AVL Tree หรือ Red-Black Tree แก้ปัญหานี้ด้วยการ "จัดสมดุลต้นไม้ใหม่" อัตโนมัติทุกครั้งที่ insert (นอกเหนือขอบเขตของบทนี้) ในงาน QA เทคนิคพื้นฐานนี้เพียงพอสำหรับเก็บ test data ที่เพิ่มเข้ามาเรื่อยๆ แต่ต้องค้นหาได้เร็วอยู่เสมอ`,
    example: `// ตัวอย่างไล่ BST แบบ in-order traversal เพื่อดึงค่าทั้งหมดออกมาแบบเรียงลำดับ (ไม่ใช่คำตอบของโจทย์นี้)
function inOrderTraversal(node, result = []) {
  if (node === null) return result;
  inOrderTraversal(node.left, result);
  result.push(node.value);
  inOrderTraversal(node.right, result);
  return result;
}`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>class BST</code> มี property <code>root</code> เริ่มต้นเป็น <code>null</code><br/>
    2. <code>insert(value)</code> เพิ่มค่าตามกฎ BST (ซ้ายเล็กกว่า, ขวามากกว่า) สร้าง node รูปแบบ <code>{ value, left, right }</code><br/>
    3. <code>contains(value)</code> คืนค่า <code>true</code>/<code>false</code>`
  },
  {
    id: "topological_sort",
    meta: "ขั้นสูง 8",
    title: "Topological Sort: จัดลำดับ CI Job ให้ Dependency มาก่อนเสมอ",
    template: `// สถานการณ์: ต้องจัดลำดับ CI job ทั้งหมดให้รันได้จริง โดย job ที่เป็น dependency ต้องรันเสร็จก่อน
// job ที่ขึ้นกับมันเสมอ (ต่อยอดจากบท Graph/BFS ก่อนหน้าที่ใช้ dependency graph รูปแบบเดียวกัน)
// graph รูปแบบเดิม: key คือชื่อ job, value คือ array ของ job ที่ต้องรันเสร็จก่อน (dependency)
//
// 1. เขียน function topologicalSort(graph) รับ graph (ไม่มี cycle)
//    คืนค่า array ของชื่อ job เรียงลำดับที่ถูกต้อง (ทุก job ต้องอยู่หลัง dependency ของมันเสมอ)
//    หมายเหตุ: อาจมีคำตอบที่ถูกต้องได้มากกว่า 1 แบบถ้ามี job ที่ไม่ขึ้นกับกันเลย (independent) — ระบบเช็คแค่ว่า "ลำดับถูกต้องตามกฎ" ไม่เช็คว่าตรงคำตอบเป๊ะ
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ topologicalSort() ว่า dependency มาก่อนเสมอ...");
      const fn = getLearnerFn(code, "topologicalSort");

      const checkValidOrder = (graph, order, label) => {
        const jobs = Object.keys(graph);
        if (!Array.isArray(order) || order.length !== jobs.length) {
          throw new Error(`${label}: ต้องได้ array ที่มีครบทุก job (${jobs.length} ตัว) แต่ได้ ${Array.isArray(order) ? order.length : "ไม่ใช่ array"} ตัว`);
        }
        if (new Set(order).size !== jobs.length) {
          throw new Error(`${label}: มี job ซ้ำกันในผลลัพธ์ หรือขาดหายไป — ได้ ${JSON.stringify(order)}`);
        }
        const position = {};
        order.forEach((job, idx) => { position[job] = idx; });
        for (const job of jobs) {
          for (const dep of graph[job]) {
            if (position[dep] > position[job]) {
              throw new Error(`${label}: '${dep}' เป็น dependency ของ '${job}' ต้องอยู่ก่อนในลำดับ แต่ผลลัพธ์ ${JSON.stringify(order)} ให้ '${job}' มาก่อน '${dep}'`);
            }
          }
        }
      };

      const chain = { deploy: ["test", "build"], test: ["build"], build: ["lint"], lint: [] };
      checkValidOrder(chain, fn(chain), "chain graph");

      // Independent branches (A and B don't depend on each other) — multiple valid orders
      // exist here (A,B,C or B,A,C), so the check above validates the RULE, not one exact array.
      const branch = { A: [], B: [], C: ["A", "B"] };
      checkValidOrder(branch, fn(branch), "branch graph");

      log("✓ จัดลำดับถูกต้องทุกกรณี รวมถึงกรณีมี job อิสระที่ไม่ขึ้นกับกัน (คำตอบมีได้หลายแบบ)");
    },
    hint: "ใช้ Kahn's Algorithm ต่อยอดจากบท BFS/Queue: นับ 'in-degree' ของแต่ละ job (จำนวน dependency ที่ยังต้องรอ = graph[job].length) เริ่มจาก job ที่ in-degree เป็น 0 (ไม่มี dependency เลย) ใส่เข้า Queue — dequeue ทีละตัว ใส่เข้าผลลัพธ์ แล้วลด in-degree ของทุก job ที่ขึ้นกับ job ที่เพิ่ง dequeue ไป (ต้องสร้าง reverse map ไว้ก่อนว่า 'ใครขึ้นกับใครบ้าง') ถ้า job ไหน in-degree ลดเหลือ 0 ให้ enqueue ต่อ ทำซ้ำจนคิวว่าง",
    solution: `function topologicalSort(graph) {
  const jobs = Object.keys(graph);
  const inDegree = {};
  const dependents = {};
  jobs.forEach(j => {
    inDegree[j] = graph[j].length;
    dependents[j] = [];
  });
  jobs.forEach(j => {
    graph[j].forEach(dep => {
      dependents[dep].push(j);
    });
  });

  const queue = jobs.filter(j => inDegree[j] === 0);
  const order = [];
  while (queue.length > 0) {
    const job = queue.shift();
    order.push(job);
    for (const dependent of dependents[job]) {
      inDegree[dependent]--;
      if (inDegree[dependent] === 0) queue.push(dependent);
    }
  }
  return order;
}`,
    theory: `<strong>Topological Sort</strong> จัดลำดับ node ของ Directed Acyclic Graph (DAG — กราฟมีทิศทาง ไม่มี cycle ต่อยอดจากบท "Graphs" ที่เรียนตรวจ cycle ไปแล้ว) ให้ node ต้นทางของทุก edge มาก่อน node ปลายทางเสมอ — ในบทนี้คือ dependency ของ job ต้องรันเสร็จก่อน job ที่ขึ้นกับมันเสมอ<br/><br/>
    เทคนิคที่ใช้คือ <strong>Kahn's Algorithm</strong> ซึ่งเป็น BFS แบบหนึ่ง (ต่อยอดจากบท Queue/BFS โดยตรง): นับ "in-degree" (จำนวน dependency ที่ยังไม่เสร็จ) ของแต่ละ job เริ่มจาก job ที่ in-degree เป็น 0 (พร้อมรันได้ทันที) ใส่ในคิว ประมวลผลทีละตัวแล้ว "ปลดล็อก" job อื่นที่รอตัวนี้อยู่ (ลด in-degree ของพวกเขาลง) เมื่อ job ไหน in-degree เหลือ 0 ก็เข้าคิวต่อ<br/><br/>
    <strong>ข้อสำคัญ:</strong> ถ้ามี job หลายตัวที่ไม่ขึ้นกับกันเลย (independent) ลำดับที่ถูกต้องมีได้<strong>มากกว่าหนึ่งแบบ</strong> — การตรวจสอบจึงต้องเช็ค "กฎ" (dependency ต้องมาก่อนเสมอ) ไม่ใช่เช็คว่าตรงกับคำตอบเดียวที่ตายตัว ในงาน QA เทคนิคนี้ตอบคำถาม "ต้องรัน job/migration/setup step ไหนก่อนไหนถึงจะไม่พัง" ได้ตรงไปตรงมา`,
    example: `// ตัวอย่างตรวจว่ากราฟมี cycle ก่อนเรียก topologicalSort จริง (ใช้เทคนิคจากบท Graphs ก่อนหน้า)
function canBeOrdered(graph) {
  return !hasCyclicDependency(graph); // hasCyclicDependency มาจากบท Graphs
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function topologicalSort(graph)</code><br/>
    2. ใช้ Kahn's Algorithm (in-degree + Queue) ต่อยอดจากบท BFS<br/>
    3. คืนค่า array ของ job ที่ dependency มาก่อนเสมอ (คำตอบมีได้หลายแบบถ้ามี job อิสระ)`
  },
  {
    id: "dijkstra_shortest_path",
    meta: "ขั้นสูง 9",
    title: "Dijkstra: หาเส้นทางที่ต้นทุนรวมต่ำสุด (Weighted Graph)",
    template: `// สถานการณ์: บท BFS ก่อนหน้าหาระยะทาง "จำนวนขั้น" สั้นสุด แต่ไม่สนใจว่าแต่ละขั้นมีต้นทุน (cost/time) เท่าไหร่
// ตอนนี้แต่ละเส้นเชื่อมมี "weight" (เช่น เวลารัน job เป็นวินาที) ต้องหาเส้นทางที่ "ต้นทุนรวม" ต่ำสุด ไม่ใช่จำนวนขั้นน้อยสุด
// graph รูปแบบใหม่: key คือ job, value คือ array ของ { to, weight } เช่น { A: [{ to: 'B', weight: 4 }] }
//
// 1. เขียน function dijkstraShortestDistance(graph, start, end)
//    คืนค่าต้นทุนรวมต่ำสุดจาก start ไปถึง end (บวก weight สะสมตลอดเส้นทาง)
//    คืนค่า 0 ถ้า start === end, คืนค่า Infinity ถ้าไปไม่ถึง end เลย
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ dijkstraShortestDistance()...");
      const fn = getLearnerFn(code, "dijkstraShortestDistance");

      const graph = {
        A: [{ to: "B", weight: 4 }, { to: "C", weight: 1 }],
        B: [{ to: "D", weight: 1 }],
        C: [{ to: "B", weight: 1 }, { to: "D", weight: 5 }],
        D: [],
      };

      if (fn(graph, "A", "A") !== 0) throw new Error("dijkstraShortestDistance(graph,'A','A') ต้องได้ 0");
      if (fn(graph, "A", "B") !== 2) {
        throw new Error(`dijkstraShortestDistance(graph,'A','B') ต้องได้ 2 (A->C->B ต้นทุน 1+1=2 ถูกกว่า A->B ตรงๆ ที่ต้นทุน 4) แต่ได้ ${fn(graph, "A", "B")}`);
      }
      if (fn(graph, "A", "D") !== 3) {
        throw new Error(`dijkstraShortestDistance(graph,'A','D') ต้องได้ 3 (A->C->B->D ต้นทุน 1+1+1=3 ถูกกว่าทางอื่น) แต่ได้ ${fn(graph, "A", "D")}`);
      }
      if (fn(graph, "A", "ZZZ") !== Infinity) {
        throw new Error("dijkstraShortestDistance ไปยัง node ที่ไม่มีอยู่จริงต้องได้ Infinity");
      }

      log("✓ หาต้นทุนรวมต่ำสุดถูกต้องทุกกรณี รวมถึงกรณีที่เส้นทางอ้อมถูกกว่าเส้นทางตรง");
    },
    hint: "เก็บ 'ต้นทุนสะสมที่ดีที่สุดเท่าที่รู้ตอนนี้' ของแต่ละ node ไว้ใน object (เริ่มต้น Infinity ทุกตัว ยกเว้น start ที่เป็น 0) วนซ้ำ: เลือก node ที่ยังไม่ประมวลผลและมีต้นทุนสะสมน้อยที่สุด (ต่อยอดแนวคิดจากบท Heap/Priority Queue) ประมวลผลมัน แล้วเช็คทุกเพื่อนบ้าน — ถ้า 'ต้นทุนสะสมถึง node ปัจจุบัน + weight ของเส้นเชื่อม' น้อยกว่าต้นทุนสะสมเดิมของเพื่อนบ้านนั้น ให้อัปเดตค่าใหม่ ทำซ้ำจนประมวลผลครบทุก node ที่ไปถึงได้",
    solution: `function dijkstraShortestDistance(graph, start, end) {
  const dist = {};
  Object.keys(graph).forEach(node => { dist[node] = Infinity; });
  dist[start] = 0;

  const visited = new Set();

  while (true) {
    let current = null;
    let currentDist = Infinity;
    for (const node of Object.keys(graph)) {
      if (!visited.has(node) && dist[node] < currentDist) {
        current = node;
        currentDist = dist[node];
      }
    }
    if (current === null) break;
    visited.add(current);

    for (const edge of graph[current]) {
      const newDist = dist[current] + edge.weight;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
      }
    }
  }

  return dist[end] !== undefined ? dist[end] : Infinity;
}`,
    theory: `<strong>Dijkstra's Algorithm</strong> ต่อยอดจากบท BFS แต่รองรับเส้นเชื่อมที่มี <strong>weight</strong> (น้ำหนัก/ต้นทุน) ไม่เท่ากัน — BFS การันตีระยะทาง "จำนวนขั้น" สั้นสุดเพราะทุกเส้นเชื่อมมีต้นทุนเท่ากันหมด (นับเป็น 1 เสมอ) แต่พอแต่ละเส้นเชื่อมมีต้นทุนต่างกัน การไล่ทีละขั้นแบบ BFS ไม่การันตีเส้นทางที่ต้นทุนรวมต่ำสุดอีกต่อไป (เส้นทางที่ "ขั้นน้อยกว่า" อาจต้นทุนรวมสูงกว่าเส้นทางที่ "ขั้นเยอะกว่าแต่ราคาถูกกว่า" ก็ได้)<br/><br/>
    หลักการของ Dijkstra: เก็บ "ต้นทุนสะสมที่ดีที่สุดเท่าที่รู้ตอนนี้" ของทุก node (เริ่มต้น Infinity หมด ยกเว้น start=0) แล้ววนเลือก node ที่ยังไม่ประมวลผลและมีต้นทุนสะสมน้อยที่สุดมาประมวลผลก่อนเสมอ (concept เดียวกับ Priority Queue จากบทก่อนหน้า — ในเวอร์ชันเต็มที่มีประสิทธิภาพจริงจะใช้ Min-Heap เลือก node นี้แทนการวน scan ทุกครั้งแบบในบทนี้) — ทุกครั้งที่ประมวลผล node ให้เช็คว่า "ผ่าน node นี้ไปหาเพื่อนบ้าน" ถูกกว่าที่เคยรู้มาก่อนหรือไม่ (เรียกว่า relaxation) ถ้าถูกกว่าก็อัปเดต<br/><br/>
    ในตัวอย่างนี้ A ไป B ทางตรง (weight 4) แพงกว่าอ้อมผ่าน C (1+1=2) — Dijkstra จับความจริงข้อนี้ได้ถูกต้อง ต่างจาก BFS ที่จะบอกว่า A→B ทางตรง "ใกล้กว่า" เพราะนับแค่จำนวนขั้น (1 ขั้น) โดยไม่สนต้นทุนจริง ในงาน QA เทคนิคนี้ใช้ตอบคำถามจริงเช่น "เส้นทาง deploy ไหนใช้เวลารวมน้อยที่สุด" ที่แต่ละขั้นมีเวลาไม่เท่ากัน`,
    example: `// ตัวอย่างสร้าง graph แบบ weighted จากเวลารันจริงของแต่ละ job (ไม่ใช่คำตอบของโจทย์นี้)
const pipelineGraph = {
  lint: [{ to: 'build', weight: 30 }],
  build: [{ to: 'deploy', weight: 120 }],
  deploy: [],
};`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function dijkstraShortestDistance(graph, start, end)</code><br/>
    2. เก็บต้นทุนสะสมต่ำสุดของแต่ละ node แล้วประมวลผล node ที่ต้นทุนน้อยที่สุดก่อนเสมอ<br/>
    3. คืนค่า <code>0</code> ถ้า <code>start === end</code>, ต้นทุนรวมต่ำสุดถ้าไปถึง, <code>Infinity</code> ถ้าไปไม่ถึง`
  },
  {
    id: "minimum_spanning_tree",
    meta: "ขั้นสูง 10",
    title: "Minimum Spanning Tree: เชื่อม Test Environment ทั้งหมดด้วยต้นทุนต่ำสุด",
    template: `// สถานการณ์: ต้องเชื่อมต่อ test environment ทุกตัวเข้าด้วยกัน (ผ่าน network link ที่มีต้นทุนต่างกัน)
// โดยใช้ต้นทุนรวมต่ำที่สุด และไม่จำเป็นต้องเชื่อมทุกคู่ ขอแค่ทุกตัว "เชื่อมถึงกันได้" ทางใดทางหนึ่งก็พอ
// นี่คือปัญหา Minimum Spanning Tree (MST) แก้ด้วย Kruskal's Algorithm
//
// 1. เขียน function minimumSpanningTreeCost(nodes, edges)
//    nodes คือ array ของชื่อ node ทั้งหมด, edges คือ array ของ { from, to, weight }
//    คืนค่าต้นทุนรวมต่ำสุดที่เชื่อมทุก node เข้าด้วยกันได้ (ไม่มี cycle เกินความจำเป็น)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ minimumSpanningTreeCost() ด้วย Kruskal's Algorithm...");
      const fn = getLearnerFn(code, "minimumSpanningTreeCost");

      const nodes = ["A", "B", "C", "D"];
      const edges = [
        { from: "A", to: "B", weight: 1 },
        { from: "B", to: "C", weight: 2 },
        { from: "A", to: "C", weight: 4 },
        { from: "C", to: "D", weight: 3 },
        { from: "B", to: "D", weight: 5 },
      ];
      const result = fn(nodes, edges);
      if (result !== 6) {
        throw new Error(`minimumSpanningTreeCost ต้องได้ 6 (เลือกเส้นเชื่อม AB=1, BC=2, CD=3 รวม 6 — ข้าม AC=4 และ BD=5 เพราะจะทำให้เกิด cycle) แต่ได้ ${result}`);
      }

      // Already-minimal case: exactly enough edges to connect everything, no choice to make
      const nodes2 = ["X", "Y", "Z"];
      const edges2 = [
        { from: "X", to: "Y", weight: 7 },
        { from: "Y", to: "Z", weight: 3 },
      ];
      if (fn(nodes2, edges2) !== 10) {
        throw new Error(`minimumSpanningTreeCost(nodes2, edges2) ต้องได้ 10 (7+3, ทั้งสองเส้นจำเป็นต้องใช้ ไม่มีทางเลือกอื่น) แต่ได้ ${fn(nodes2, edges2)}`);
      }

      log("✓ หาต้นทุนต่ำสุดที่เชื่อมทุก node เข้าด้วยกันได้ถูกต้องทุกกรณี");
    },
    hint: "เรียง edges ทั้งหมดจากต้นทุนน้อยไปมากก่อน แล้วไล่พิจารณาทีละเส้นตามลำดับนั้น — ใช้ Union-Find (Disjoint Set): เก็บว่าแต่ละ node อยู่ 'กลุ่ม' ไหน เริ่มต้นทุก node อยู่กลุ่มของตัวเอง ถ้า edge ที่พิจารณาเชื่อม 2 node ที่อยู่คนละกลุ่มกัน ให้เพิ่ม edge นั้น (บวกต้นทุนสะสม) แล้วรวมสองกลุ่มเป็นกลุ่มเดียวกัน — ถ้า node ทั้งสองอยู่กลุ่มเดียวกันอยู่แล้ว ให้ข้าม edge นั้นไปเลย (เพิ่มแล้วจะเกิด cycle โดยไม่จำเป็น) ทำจนพิจารณาครบทุก edge",
    solution: `function minimumSpanningTreeCost(nodes, edges) {
  const parent = {};
  nodes.forEach(n => { parent[n] = n; });

  function find(x) {
    while (parent[x] !== x) x = parent[x];
    return x;
  }

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  let totalCost = 0;

  for (const edge of sortedEdges) {
    const rootFrom = find(edge.from);
    const rootTo = find(edge.to);
    if (rootFrom !== rootTo) {
      parent[rootFrom] = rootTo;
      totalCost += edge.weight;
    }
  }

  return totalCost;
}`,
    theory: `<strong>Minimum Spanning Tree (MST)</strong> คือชุดเส้นเชื่อมที่น้อยที่สุด (จำนวน node - 1 เส้นเสมอ) ที่ทำให้ node ทุกตัวเชื่อมถึงกันได้ทางใดทางหนึ่ง โดยมีต้นทุนรวมต่ำที่สุด — ต่างจาก Dijkstra (บทก่อนหน้า) ที่หาเส้นทางสั้นสุด<strong>ระหว่าง 2 จุด</strong> MST หาการเชื่อม<strong>ทุกจุดเข้าด้วยกัน</strong>ในคราวเดียว<br/><br/>
    <strong>Kruskal's Algorithm</strong> แก้ปัญหานี้ด้วยแนวคิด greedy: เรียง edge ทั้งหมดจากถูกไปแพง แล้วหยิบทีละเส้นตามลำดับ — เพิ่มเส้นนั้นก็ต่อเมื่อมันเชื่อม 2 กลุ่มที่<strong>ยังไม่เชื่อมกัน</strong> (ถ้าเชื่อมกันอยู่แล้ว การเพิ่มเส้นนี้จะสร้าง cycle โดยไม่จำเป็น สิ้นเปลืองต้นทุนเปล่าๆ) เครื่องมือที่เช็คว่า "2 node นี้อยู่กลุ่มเดียวกันหรือยัง" ได้เร็วคือ <strong>Union-Find (Disjoint Set)</strong>: แต่ละ node จำ "ตัวแทนกลุ่ม" ของตัวเองไว้ ถ้าสอง node มีตัวแทนกลุ่มเดียวกันแปลว่าอยู่กลุ่มเดียวกันแล้ว<br/><br/>
    ในตัวอย่างนี้ edge ที่ถูกที่สุดสามเส้น (AB=1, BC=2, CD=3) เชื่อมทุก node ได้พอดีโดยไม่เกิด cycle เลย — edge ที่เหลือ (AC=4, BD=5) ถูกข้ามเพราะปลายทั้งสองฝั่งอยู่กลุ่มเดียวกันไปแล้วตอนที่พิจารณาถึง ในงาน QA เทคนิคนี้ใช้ตอบคำถาม "เชื่อมต่อ server/environment ทั้งหมดเข้าด้วยกันด้วยต้นทุน network link รวมต่ำสุดได้อย่างไร"`,
    example: `// ตัวอย่าง Union-Find ธรรมดา เช็คว่า 2 node อยู่กลุ่มเดียวกันหรือยัง (ไม่ใช่คำตอบของโจทย์นี้)
function areConnected(parent, a, b) {
  function find(x) { while (parent[x] !== x) x = parent[x]; return x; }
  return find(a) === find(b);
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function minimumSpanningTreeCost(nodes, edges)</code><br/>
    2. เรียง edges จากต้นทุนน้อยไปมาก ใช้ Union-Find เช็คว่าเพิ่ม edge แล้วเกิด cycle หรือไม่<br/>
    3. คืนค่าต้นทุนรวมของ edge ที่เลือกทั้งหมด (ไม่เพิ่ม edge ที่ทำให้เกิด cycle)`
  },
  {
    id: "quick_sort_algorithm",
    meta: "ขั้นสูง 11",
    title: "Quick Sort: Divide and Conquer อีกแบบ ด้วย Partition",
    template: `// สถานการณ์: บท Merge Sort ก่อนหน้าแบ่งครึ่งเรื่อยๆ แล้ว merge กลับ — Quick Sort ใช้แนวคิดต่างออกไป
// เลือก "pivot" ตัวหนึ่ง แล้วแบ่งข้อมูลเป็น "น้อยกว่า pivot" กับ "มากกว่า pivot" (partition) ก่อนเรียงแต่ละฝั่งต่อ
//
// 1. เขียน function quickSort(arr) รับ array of number
//    คืนค่า array ใหม่ที่เรียงจากน้อยไปมาก โดยใช้เทคนิค Quick Sort (เลือก pivot, partition, recursive)
//    ห้ามเรียก Array.prototype.sort() ในนี้
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ quickSort() ทั้งความถูกต้องและว่าเขียนเองจริง...");
      const clean = stripComments(code);
      if (/\.sort\s*\(/.test(clean)) {
        throw new Error("ห้ามเรียก Array.prototype.sort() ในนี้ — โจทย์นี้ต้องเขียน Quick Sort ด้วยตัวเอง (เลือก pivot, partition เป็นฝั่งน้อยกว่า/มากกว่า, recursive)");
      }

      const fn = getLearnerFn(code, "quickSort");

      if (JSON.stringify(fn([5, 2, 8, 1])) !== JSON.stringify([1, 2, 5, 8])) {
        throw new Error(`quickSort([5,2,8,1]) ต้องได้ [1,2,5,8] แต่ได้ ${JSON.stringify(fn([5, 2, 8, 1]))}`);
      }
      if (JSON.stringify(fn([7])) !== JSON.stringify([7])) {
        throw new Error("quickSort([7]) ต้องได้ [7]");
      }
      if (JSON.stringify(fn([])) !== JSON.stringify([])) {
        throw new Error("quickSort([]) ต้องได้ []");
      }
      // Already-sorted input is Quick Sort's classic worst-case trap for a naive
      // last-element pivot — must still produce a CORRECT result (performance isn't graded here).
      const alreadySorted = Array.from({ length: 50 }, (_, i) => i);
      if (JSON.stringify(fn(alreadySorted)) !== JSON.stringify(alreadySorted)) {
        throw new Error("quickSort กับ array ที่เรียงอยู่แล้ว (worst-case ของ Quick Sort) ให้ผลลัพธ์ไม่ถูกต้อง");
      }

      const big = Array.from({ length: 200 }, (_, i) => (i * 37) % 200);
      const expectedBig = [...big].sort((a, b) => a - b);
      if (JSON.stringify(fn(big)) !== JSON.stringify(expectedBig)) {
        throw new Error("quickSort กับข้อมูล 200 ตัว ให้ผลลัพธ์ไม่ถูกต้อง");
      }

      log("✓ Quick Sort ถูกต้องและเขียนเองจริง รวมถึงกรณี worst-case (array ที่เรียงอยู่แล้ว)");
    },
    hint: "เลือก pivot ตัวหนึ่ง (เช่น ตัวกลางหรือตัวสุดท้ายของ array) แบ่งสมาชิกที่เหลือเป็น 2 กลุ่ม: น้อยกว่า pivot กับมากกว่าหรือเท่ากับ pivot เรียก quickSort ซ้ำ (recursive) กับแต่ละกลุ่ม แล้วต่อผลลัพธ์เป็น [เรียงฝั่งน้อยกว่า, pivot, เรียงฝั่งมากกว่า] — base case: array ที่มี 0 หรือ 1 ตัว ถือว่าเรียงอยู่แล้ว",
    solution: `function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const rest = arr.filter((_, i) => i !== Math.floor(arr.length / 2));
  const less = rest.filter(x => x < pivot);
  const greaterOrEqual = rest.filter(x => x >= pivot);

  return [...quickSort(less), pivot, ...quickSort(greaterOrEqual)];
}`,
    theory: `<strong>Quick Sort</strong> คือ Divide and Conquer อีกรูปแบบหนึ่ง ต่างจาก Merge Sort (บทก่อนหน้า) ตรงที่ "แบ่ง" ก่อนแล้วค่อย "เรียงแต่ละฝั่ง" (Merge Sort เรียงแต่ละฝั่งก่อนแล้วค่อย merge ทีหลัง) — เลือก <strong>pivot</strong> ตัวหนึ่งจากข้อมูล แล้วแบ่งที่เหลือเป็น 2 กลุ่ม: น้อยกว่า pivot กับมากกว่าหรือเท่ากับ pivot (เรียกขั้นตอนนี้ว่า <strong>partition</strong>) แล้วเรียก quickSort ซ้ำกับแต่ละกลุ่ม<br/><br/>
    Quick Sort โดยเฉลี่ยเร็วเท่า Merge Sort (<code>O(n log n)</code>) แต่มี<strong>worst case เป็น <code>O(n^2)</code></strong> ถ้าเลือก pivot แย่ซ้ำๆ — กรณีคลาสสิกที่สุด: ถ้าเลือก pivot เป็นตัวสุดท้ายเสมอ แล้วข้อมูลเรียงอยู่แล้ว (หรือเรียงย้อนกลับ) แต่ละรอบ partition จะได้กลุ่ม "น้อยกว่า" ที่มีสมาชิกเกือบทั้งหมด กับกลุ่ม "มากกว่า" ที่ว่างเปล่า ทำให้ไม่ได้แบ่งครึ่งจริงๆ เหมือนที่ Merge Sort ทำได้เสมอ<br/><br/>
    ในบทนี้เลือก pivot เป็น<strong>ตัวกลาง</strong>ของ array แทนตัวสุดท้าย ซึ่งช่วยลดโอกาสเจอ worst case กับข้อมูลที่เรียงอยู่แล้วได้บ้าง (แต่ไม่ได้การันตี 100% — เทคนิคขั้นสูงกว่าอย่าง "median-of-three" หรือสุ่ม pivot ช่วยลดความเสี่ยงนี้ได้อีก) ในงาน QA การเข้าใจ tradeoff นี้ช่วยตอบคำถาม "ทำไม custom sort บางอันช้าลงมากเป็นพิเศษกับข้อมูลบางแบบ" ได้`,
    example: `// ตัวอย่าง partition แยกกลุ่มรอบ pivot (ส่วนหนึ่งของ Quick Sort)
function partitionExample(arr, pivot) {
  return {
    less: arr.filter(x => x < pivot),
    greaterOrEqual: arr.filter(x => x >= pivot),
  };
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function quickSort(arr)</code><br/>
    2. เลือก pivot แล้วแบ่งที่เหลือเป็นฝั่งน้อยกว่า/มากกว่าหรือเท่ากับ pivot<br/>
    3. เรียกตัวเองซ้ำ (recursive) กับแต่ละฝั่ง แล้วต่อผลลัพธ์กลับเข้าด้วยกัน<br/>
    4. ห้ามเรียก <code>Array.prototype.sort()</code>`
  },
  {
    id: "heap_sort_algorithm",
    meta: "ขั้นสูง 12",
    title: "Heap Sort: ใช้ Binary Heap (จากบทก่อนหน้า) มาเรียงข้อมูลทั้ง Array",
    template: `// สถานการณ์: บท Heap/Priority Queue ก่อนหน้าสอนให้ "ดึงค่าน้อยสุดออกทีละตัว" ได้เร็ว
// ถ้าดึงค่าน้อยสุดออกไปเรื่อยๆ จนหมด แล้วเก็บลำดับที่ดึงได้ไว้ — นั่นคือ array ที่เรียงแล้วนั่นเอง!
// นี่คือหลักการของ Heap Sort
//
// 1. เขียน function heapSort(arr) รับ array of number
//    คืนค่า array ใหม่ที่เรียงจากน้อยไปมาก โดยใช้หลักการ Binary Heap (สร้าง heap แล้วดึงค่าน้อยสุดออกทีละตัว)
//    ห้ามเรียก Array.prototype.sort() ในนี้
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ heapSort() ทั้งความถูกต้องและว่าเขียนเองจริง...");
      const clean = stripComments(code);
      if (/\.sort\s*\(/.test(clean)) {
        throw new Error("ห้ามเรียก Array.prototype.sort() ในนี้ — โจทย์นี้ต้องเขียน Heap Sort ด้วยตัวเอง (ใช้หลักการ Binary Heap จากบทก่อนหน้า)");
      }

      const fn = getLearnerFn(code, "heapSort");

      if (JSON.stringify(fn([5, 2, 8, 1])) !== JSON.stringify([1, 2, 5, 8])) {
        throw new Error(`heapSort([5,2,8,1]) ต้องได้ [1,2,5,8] แต่ได้ ${JSON.stringify(fn([5, 2, 8, 1]))}`);
      }
      if (JSON.stringify(fn([7])) !== JSON.stringify([7])) {
        throw new Error("heapSort([7]) ต้องได้ [7]");
      }
      if (JSON.stringify(fn([])) !== JSON.stringify([])) {
        throw new Error("heapSort([]) ต้องได้ []");
      }

      const big = Array.from({ length: 200 }, (_, i) => (i * 37) % 200);
      const expectedBig = [...big].sort((a, b) => a - b);
      if (JSON.stringify(fn(big)) !== JSON.stringify(expectedBig)) {
        throw new Error("heapSort กับข้อมูล 200 ตัว ให้ผลลัพธ์ไม่ถูกต้อง");
      }

      log("✓ Heap Sort ถูกต้องและใช้หลักการ Binary Heap จริง ไม่ได้พึ่ง Array.prototype.sort()");
    },
    hint: "ใช้ MinPriorityQueue แบบเดียวกับบท Heap ก่อนหน้า (หรือสร้าง heap logic เดิมใหม่ในนี้เลยก็ได้): insert สมาชิกทุกตัวของ arr เข้า heap ก่อน (priority = ค่าตัวมันเอง) แล้ว extractMin() ออกมาทีละตัวใส่ผลลัพธ์ไปเรื่อยๆ จนกว่า heap จะว่างเปล่า — ลำดับที่ extractMin() คืนค่ามาคือ array ที่เรียงจากน้อยไปมากพอดี",
    solution: `function heapSort(arr) {
  const heap = [];

  function siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent] <= heap[i]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  function siftDown(i) {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
      if (smallest === i) break;
      [heap[smallest], heap[i]] = [heap[i], heap[smallest]];
      i = smallest;
    }
  }

  arr.forEach(value => {
    heap.push(value);
    siftUp(heap.length - 1);
  });

  const result = [];
  while (heap.length > 0) {
    const min = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      siftDown(0);
    }
    result.push(min);
  }
  return result;
}`,
    theory: `<strong>Heap Sort</strong> นำ Binary Heap (บทก่อนหน้า) มาใช้เรียงข้อมูลทั้ง array โดยตรง — หลักการเรียบง่ายมาก: ใส่สมาชิกทั้งหมดเข้า Min-Heap แล้วดึงค่าน้อยที่สุดออกทีละตัว (<code>extractMin</code>) ไปเรื่อยๆ จนกว่า heap จะว่างเปล่า ลำดับที่ดึงออกมาได้คือข้อมูลที่เรียงจากน้อยไปมากพอดี เพราะ Min-Heap รับประกันว่าตัวบนสุดคือค่าน้อยที่สุดเสมอ<br/><br/>
    ความซับซ้อน: <code>insert</code> และ <code>extractMin</code> แต่ละครั้งใช้เวลา <code>O(log n)</code> (บทก่อนหน้า) ทำซ้ำ n ครั้งทั้ง insert และ extract รวมเป็น <code>O(n log n)</code> — เร็วเท่า Merge Sort และ Quick Sort โดยเฉลี่ย แต่ต่างจาก Quick Sort ตรงที่ Heap Sort <strong>ไม่มี worst case ที่แย่กว่า</strong> (การันตี <code>O(n log n)</code> เสมอ ไม่ว่าข้อมูลจะเรียงมาแบบไหน) จุดเด่นอีกอย่างคือ Heap Sort ตัวจริง <strong>sort in-place ได้</strong> (build heap ทับ array เดิม, ใช้ auxiliary space แค่ O(1)) ต่างจาก Merge Sort ที่ต้องใช้ array เสริม — ข้อเสียคือไม่ stable และ cache locality แย่กว่า Quick Sort/Merge Sort (โจทย์นี้ implement แบบใช้ heap array + result array แยกกันเพื่อความง่ายในการสอน ไม่ใช่คุณสมบัติจริงของ Heap Sort)<br/><br/>
    เปรียบเทียบ 3 sorting algorithm ที่เรียนมา: <strong>Merge Sort</strong> (stable, O(n log n) เสมอ, ใช้ memory เพิ่มสำหรับ merge), <strong>Quick Sort</strong> (เร็วเฉลี่ย O(n log n) แต่ worst case O(n^2), in-place), <strong>Heap Sort</strong> (O(n log n) เสมอเหมือน Merge Sort, in-place เหมือน Quick Sort แต่ไม่ stable) — ในงาน QA การเลือกใช้ sort ให้เหมาะกับสถานการณ์ (ต้องการ stable ไหม, กลัว worst case ไหม, memory จำกัดแค่ไหน) คือทักษะที่ต่อยอดจากทั้ง 3 บทนี้รวมกัน`,
    example: `// ตัวอย่างใช้ MinPriorityQueue จากบทก่อนหน้าทำ Heap Sort แบบสั้น (ไม่ใช่คำตอบของโจทย์นี้ แต่แนวคิดเดียวกัน)
function heapSortViaPQ(arr, MinPriorityQueue) {
  const pq = new MinPriorityQueue();
  arr.forEach(v => pq.insert(v, v));
  const result = [];
  while (!pq.isEmpty()) result.push(pq.extractMin().item);
  return result;
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function heapSort(arr)</code><br/>
    2. สร้าง Min-Heap จากสมาชิกทั้งหมดใน <code>arr</code> (ต่อยอดบท Heap ก่อนหน้า)<br/>
    3. ดึงค่าน้อยสุดออกทีละตัวจนกว่า heap จะว่างเปล่า ใส่ผลลัพธ์ตามลำดับที่ดึงได้<br/>
    4. ห้ามเรียก <code>Array.prototype.sort()</code>`
  }
];

// Application state

const PREFIX = 'dsa';
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
    <div class="terminal-line info">node ${lesson.id}.test.js</div>
    <div class="terminal-line text-muted">...................................................</div>
  `;

  setTimeout(() => {
    const log = (msg) => {
      terminal.innerHTML += `<div class="terminal-line success">${msg}</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    };

    const onPassed = () => {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
        <div class="terminal-line success">1 passed (12ms)</div>
      `;
      terminal.scrollTop = terminal.scrollHeight;

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
    };

    const onFailed = (err) => {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed</div>
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

// Show graduation final messages
function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Data Structures & Algorithms for QA แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการใช้ Big-O, Hash Table, Stack, Sorting, Binary Search, Recursion, Tree, Graph และ Memoization วิเคราะห์และเขียนโค้ด automation ที่เร็วและถูกต้องมากขึ้น!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Data Structures & Algorithms for QA');
}


  // Expose the standalone-page contract (see shared/engine.js header comment) as real globals,
  // and register into the shared registry so exam/index.html can load every track's LESSONS
  // side-by-side without a duplicate top-level "const LESSONS" collision across <script> tags.
  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['data-structures-algorithms'] = { id: 'data-structures-algorithms', title: 'Data Structures & Algorithms for QA', folder: 'Data-Structures-Algorithms', lessons: LESSONS };
})();
