(function() {
// Programming Paradigms for QA — Interactive Coding Playground Data and Logic
// Two paradigms QA-Automation engineers hit constantly but this course didn't teach yet:
// Functional Programming (pure functions, immutability, composition, currying) and
// Concurrency (async/await, Promise.all parallelism, race conditions, event-loop ordering).
// Both paradigms are almost entirely ABOUT runtime behavior, not structure — so nearly every
// lesson here uses real execution via execLearnerCode/getLearnerFn/getLearnerClass, same
// helpers OOP-Fundamentals and Data-Structures-Algorithms already established. Concurrency
// proofs (parallel vs sequential, race-condition-safe vs not) use a shared counter trick —
// same "prove the real approach, not just keyword-match the text" discipline DSA's Big-O
// lessons use via access-counting, adapted here to count CONCURRENT calls instead of array
// accesses. No real wall-clock delays except the one event-loop-ordering lesson, which needs
// a real (tiny) setTimeout to demonstrate macrotask-vs-microtask ordering honestly.

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
    id: "pp_pure_function",
    meta: "บทที่ 1",
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

      const input = [1000, 2000, 3000];
      const inputCopy = [...input];
      const result1 = fn(input);

      if (JSON.stringify(input) !== JSON.stringify(inputCopy)) {
        throw new Error(`toSeconds() ต้องไม่แก้ไข array เดิมที่รับเข้ามา (pure function ห้ามมี side-effect) แต่ input ถูกแก้ไขเป็น ${JSON.stringify(input)}`);
      }
      if (JSON.stringify(result1) !== JSON.stringify([1, 2, 3])) {
        throw new Error(`toSeconds([1000,2000,3000]) ต้องคืนค่า [1,2,3] แต่ได้ ${JSON.stringify(result1)}`);
      }
      const result2 = fn(input);
      if (JSON.stringify(result1) !== JSON.stringify(result2)) {
        throw new Error("เรียก toSeconds() ด้วย input เดิมซ้ำ ต้องได้ผลลัพธ์เดิมทุกครั้ง (deterministic) — pure function ห้ามขึ้นกับ state ภายนอก");
      }
      log(`✓ toSeconds() เป็น pure function จริง: ไม่แก้ไข input, ผลลัพธ์ deterministic (${JSON.stringify(result1)})`);
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
    meta: "บทที่ 2",
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

      const original = ['smoke', 'regression'];
      const originalCopy = [...original];
      const result = fn(original, 'critical');

      if (JSON.stringify(original) !== JSON.stringify(originalCopy)) {
        throw new Error(`addTag() ต้องไม่แก้ไข array เดิม แต่ original ถูกแก้ไขเป็น ${JSON.stringify(original)}`);
      }
      if (result === original) {
        throw new Error("addTag() ต้องคืนค่า array ใหม่ (reference ต่างจากของเดิม) ไม่ใช่คืนค่า array เดิมที่ถูกแก้ไข");
      }
      if (JSON.stringify(result) !== JSON.stringify(['smoke', 'regression', 'critical'])) {
        throw new Error(`addTag(['smoke','regression'], 'critical') ต้องคืนค่า ['smoke','regression','critical'] แต่ได้ ${JSON.stringify(result)}`);
      }
      log(`✓ addTag() คืนค่า array ใหม่ถูกต้อง โดยไม่แก้ไข array เดิม: ${JSON.stringify(result)}`);
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
    meta: "บทที่ 3",
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
    meta: "บทที่ 4",
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
      const fn = getLearnerFn(code, "summarize");

      const results = [
        { name: 'login_test', passed: true },
        { name: 'logout_test', passed: false },
        { name: 'signup_test', passed: true },
      ];
      const summary = fn(results);

      if (!summary || !Array.isArray(summary.passedNames)) {
        throw new Error("summarize() ต้องคืนค่า object ที่มี passedNames เป็น array");
      }
      if (JSON.stringify(summary.passedNames) !== JSON.stringify(['login_test', 'signup_test'])) {
        throw new Error(`passedNames ต้องมีแค่ชื่อ test ที่ passed:true เรียงตามลำดับเดิม แต่ได้ ${JSON.stringify(summary.passedNames)}`);
      }
      if (summary.total !== 2) {
        throw new Error(`total ต้องเท่ากับจำนวน test ที่ passed:true คือ 2 แต่ได้ ${summary.total}`);
      }
      log(`✓ summarize() ใช้ filter/map/reduce ได้ผลลัพธ์ถูกต้อง: ${JSON.stringify(summary)}`);
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
    meta: "บทที่ 5",
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
      log(`✓ compose(f, g)(x) = f(g(x)) ถูกต้อง: compose(double, addOne)(3) = ${result}`);
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
    meta: "บทที่ 6",
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
    meta: "บทที่ 7",
    title: "Concurrency: async/await พื้นฐาน",
    template: `// สถานการณ์: ต้องเขียน function ที่ "รอ" ผลลัพธ์แบบ async (จำลองการเรียก backend ด้วย Promise)
// 1. เขียน async function checkStatus(id) ที่:
//    - await ค่าจาก new Promise(resolve => resolve(id % 2 === 0 ? 'passed' : 'failed'))
//    - return ค่าที่ await ได้ (string 'passed' หรือ 'failed')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ async/await ด้วยการรันจริง...");
      const fn = getLearnerFn(code, "checkStatus");

      const maybePromise = fn(2);
      if (!maybePromise || typeof maybePromise.then !== "function") {
        throw new Error("checkStatus ต้องเป็น async function (เรียกแล้วต้องได้ Promise กลับมา ไม่ใช่ค่าตรงๆ)");
      }
      return Promise.all([fn(2), fn(3)]).then(([evenResult, oddResult]) => {
        if (evenResult !== 'passed') {
          throw new Error(`checkStatus(2) ต้อง resolve เป็น 'passed' (เลขคู่) แต่ได้ ${JSON.stringify(evenResult)}`);
        }
        if (oddResult !== 'failed') {
          throw new Error(`checkStatus(3) ต้อง resolve เป็น 'failed' (เลขคี่) แต่ได้ ${JSON.stringify(oddResult)}`);
        }
        log(`✓ checkStatus() เป็น async function ที่ await ค่าถูกต้อง: checkStatus(2)='${evenResult}', checkStatus(3)='${oddResult}'`);
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
    meta: "บทที่ 8",
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
    meta: "บทที่ 9",
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
      const SafeCounter = getLearnerClass(code, "SafeCounter");
      const counter = new SafeCounter();
      const N = 5;

      const calls = Array.from({ length: N }, () => counter.increment());
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
    meta: "บทที่ 10",
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
        setTimeout(() => {
          try {
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
    meta: "บทที่ 11",
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
    meta: "บทปิดท้าย",
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
      const fn = getLearnerFn(code, "runSuite");
      const probe = makeConcurrencyProbe();

      const testCases = [
        { name: 'login_test', run: () => probe.runCheck(true) },
        { name: 'logout_test', run: () => probe.runCheck(false) },
        { name: 'signup_test', run: () => probe.runCheck(true) },
        { name: 'search_test', run: () => probe.runCheck(true) },
      ];

      return Promise.resolve(fn(testCases)).then((summary) => {
        if (!summary || typeof summary.total !== "number" || typeof summary.passed !== "number") {
          throw new Error("runSuite() ต้องคืนค่า object { total, passed } ที่เป็นตัวเลข");
        }
        if (summary.total !== 4) {
          throw new Error(`total ต้องเท่ากับจำนวน testCases ทั้งหมด (4) แต่ได้ ${summary.total}`);
        }
        if (summary.passed !== 3) {
          throw new Error(`passed ต้องเท่ากับจำนวนที่ run() คืนค่า true (3) แต่ได้ ${summary.passed}`);
        }
        if (probe.state.peak <= 1) {
          throw new Error(`testCases.run() ทุกตัวถูกเรียกทีละตัว (peak concurrent = ${probe.state.peak}) — ต้องรันพร้อมกันจริงผ่าน Promise.all`);
        }
        log(`✓ runSuite() รันพร้อมกันจริง (peak concurrent = ${probe.state.peak}) และสรุปผลถูกต้อง: ${JSON.stringify(summary)}`);
      });
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

// --- Track-branded runner ---------------------------------------------------------

function runSandboxCode() {
  const editor = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const runBtn = document.getElementById('run-btn');
  if (!editor || !terminal) return;

  const userCode = editor.value;
  const lesson = LESSONS[currentLessonIndex];

  terminal.innerHTML = `
    <div class="terminal-line info">$ node run-test.js</div>
    <div class="terminal-line text-muted">...................................................</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;

  if (runBtn) runBtn.disabled = true;

  const log = (msg) => {
    terminal.innerHTML += `<div class="terminal-line text-muted">${escapeHtml(msg)}</div>`;
    terminal.scrollTop = terminal.scrollHeight;
  };

  setTimeout(() => {
    if (runBtn) runBtn.disabled = false;

    const onPassed = () => {
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: ผ่าน (Passed)</strong></div>
        <div class="terminal-line success">1 passed</div>
      `;
      terminal.scrollTop = terminal.scrollHeight;
      markLessonCompleted(lesson.id);
      renderLessonList();
      updateProgressBar();
      checkMilestones();

      const nextLessonBtn = document.getElementById('next-lesson-btn');
      if (nextLessonBtn) {
        nextLessonBtn.style.display = 'inline-flex';
        if (currentLessonIndex < LESSONS.length - 1) {
          nextLessonBtn.innerText = `บทถัดไป →`;
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
      }
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Programming Paradigms for QA แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการใช้ Functional Programming (pure function, immutability, composition, currying) และ Concurrency (async/await, Promise.all, race-condition-safe state, event loop) เขียน automation ที่เร็วขึ้น ปลอดภัยขึ้น และอ่านง่ายขึ้น!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Programming Paradigms for QA');
}

const PREFIX = 'pp';
const TAB_WIDTH = 2;

  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['programming-paradigms'] = { id: 'programming-paradigms', title: 'Programming Paradigms for QA', folder: 'Programming-Paradigms', lessons: LESSONS };
})();
