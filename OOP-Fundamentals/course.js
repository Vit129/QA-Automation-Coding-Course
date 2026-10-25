(function() {
// OOP Fundamentals for QA — Interactive Coding Playground Data and Logic
// Four pillars (Encapsulation/Inheritance/Polymorphism/Abstraction) + design patterns for QA
// (Factory, Singleton, Builder). Lessons 1-7/10 use regex (matches the other tracks' pattern,
// concept is structural). Lessons 8/9/11-15 use real execution via execLearnerCode — the whole
// point of those lessons is runtime behavior (identity, differing output, chaining, counter
// state) that regex cannot meaningfully verify, same discipline as Data-Structures-Algorithms
// and Final-Project Phase 8's real-execution lessons.

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

function getLearnerClass(code, className) {
  return getLearnerClasses(code, [className])[0];
}

// Extracts multiple classes from a SINGLE execution of `code` so they share the same
// underlying class references (extending/instanceof only holds true within one Function
// scope — extracting classes via separate calls re-runs the whole code string each time,
// producing distinct class objects that instanceof would wrongly reject).
function getLearnerClasses(code, classNames) {
  const expr = `[${classNames.map((n) => `typeof ${n} === "function" ? ${n} : undefined`).join(", ")}]`;
  let classes;
  try {
    classes = execLearnerCode(code, {}, expr);
  } catch (err) {
    throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
  }
  classNames.forEach((name, i) => {
    if (typeof classes[i] !== "function") {
      throw new Error(`ไม่พบการประกาศ class ${name}`);
    }
  });
  return classes;
}

function makeFakeLocalStorage(data) {
  const keys = Object.keys(data);
  return {
    length: keys.length,
    key: (i) => keys[i],
    getItem: (k) => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
  };
}

// Runs `code` (the learner's snippet) inside a fresh Function scope with `params`
// injected as parameters (so e.g. a fake `localStorage` shadows the real global),
// then evaluates `expr` in that same scope and returns its value. Throws if `code`
// itself throws while being defined/executed.
function execLearnerCode(code, params, expr) {
  const names = Object.keys(params);
  const values = names.map((n) => params[n]);
  const factory = new Function(...names, `${code}\nreturn (${expr});`);
  return factory(...values);
}

// Extracts the balanced `{...}`/`[...]` block that immediately follows the first
// match of `keyRegex` (e.g. /reporter:\s*\[/), so later checks can be anchored to
// "inside this specific object/array" instead of "anywhere in the whole file"
// (which a stray comment or unrelated line could otherwise satisfy).
function extractBalancedBlock(code, keyRegex, openChar, closeChar) {
  const m = keyRegex.exec(code);
  if (!m) return null;
  const start = m.index + m[0].length - 1;
  if (code[start] !== openChar) return null;
  let depth = 0;
  for (let i = start; i < code.length; i++) {
    if (code[i] === openChar) depth++;
    else if (code[i] === closeChar) {
      depth--;
      if (depth === 0) return code.slice(start, i + 1);
    }
  }
  return null;
}


const LESSONS = [
  {
    id: "oop_class_constructor",
    meta: "บทที่ 1",
    title: "Class & Constructor พื้นฐาน",
    template: `// สถานการณ์: ต้องเก็บข้อมูล test user ให้เป็นระเบียบแทนที่จะใช้ plain object กระจัดกระจาย
// 1. เขียน class TestUser ที่มี constructor รับ username และ role
//    เก็บค่าไว้ที่ this.username และ this.role
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ class TestUser...");
      const clean = stripComments(code);
      if (!/class\s+TestUser\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class TestUser");
      }
      if (!/constructor\s*\(/.test(clean)) {
        throw new Error("ไม่พบ constructor(...) ภายใน class");
      }
      if (!/this\.username\s*=/.test(clean)) {
        throw new Error("ไม่พบการเก็บค่าที่ this.username");
      }
      if (!/this\.role\s*=/.test(clean)) {
        throw new Error("ไม่พบการเก็บค่าที่ this.role");
      }
      log("✓ สร้าง class TestUser พร้อม constructor ถูกต้อง");
    },
    hint: "ประกาศ class TestUser { constructor(username, role) { this.username = username; this.role = role; } }",
    solution: `class TestUser {
  constructor(username, role) {
    this.username = username;
    this.role = role;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Class</strong> และ <strong>Constructor</strong> พื้นฐานของ OOP ใน JavaScript<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>class</code> คือพิมพ์เขียว (blueprint) สำหรับสร้าง object ที่มีโครงสร้างและพฤติกรรมเหมือนกัน — <code>constructor()</code> คือ function พิเศษที่รันอัตโนมัติทุกครั้งที่สร้าง instance ใหม่ด้วย <code>new</code><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class TestUser {</code><br/>
<code>&nbsp;&nbsp;constructor(username, role) {</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;this.username = username;</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;this.role = role;</code><br/>
<code>&nbsp;&nbsp;}</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใช้ <code>this.</code> นำหน้าตอนเก็บค่า — เขียนแค่ <code>username = username;</code> จะไม่ผูกค่ากับ instance เลย`,
    example: `const u = new TestUser('qa_bob', 'tester');
console.log(u.username); // 'qa_bob'`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>class TestUser</code><br/>
    2. มี <code>constructor(username, role)</code><br/>
    3. เก็บค่าไว้ที่ <code>this.username</code> และ <code>this.role</code>`
  },
  {
    id: "oop_encapsulation_private",
    meta: "บทที่ 2",
    title: "Encapsulation: Private Fields",
    template: `// สถานการณ์: ต้องการซ่อนค่า balance ไม่ให้ code ภายนอกแก้ไขตรงๆ ได้ ต้องผ่าน method เท่านั้น
// 1. เขียน class Account มี private field #balance เริ่มต้นที่ 0
// 2. เขียน method deposit(amount) ที่บวกค่าเข้า #balance
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Private Fields...");
      const clean = stripComments(code);
      if (!/class\s+Account\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Account");
      }
      if (!/#balance/.test(clean)) {
        throw new Error("ไม่พบ private field #balance — ต้องใช้ # นำหน้าชื่อ field");
      }
      if (/(?<!#)\bthis\.balance\b/.test(clean)) {
        throw new Error("พบการใช้ this.balance แบบ public — ต้องใช้ private field #balance เท่านั้น ห้ามมี field balance แบบ public ปนอยู่");
      }
      if (!/deposit\s*\(/.test(clean)) {
        throw new Error("ไม่พบ method deposit(amount)");
      }
      log("✓ ใช้ private field #balance และ deposit() ถูกต้อง");
    },
    hint: "ใช้ #balance = 0; เป็น class field ประกาศไว้บนสุดของ class แล้วเขียน method deposit(amount) { this.#balance += amount; }",
    solution: `class Account {
  #balance = 0;

  deposit(amount) {
    this.#balance += amount;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Encapsulation</strong> ผ่าน Private Fields (<code>#field</code>) ของ JavaScript<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Private field (<code>#</code> นำหน้า) เข้าถึงได้เฉพาะจากภายใน class เท่านั้น — code ภายนอกแก้ไขตรงๆ ไม่ได้ ต้องผ่าน method ที่ class กำหนดให้เท่านั้น ป้องกันค่าถูกแก้แบบไม่ถูกต้อง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class Account {</code><br/>
<code>&nbsp;&nbsp;#balance = 0;</code><br/>
<code>&nbsp;&nbsp;deposit(amount) { this.#balance += amount; }</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>account.#balance</code> จากภายนอก class จะ syntax error ทันที — ต้อง expose ผ่าน method/getter เท่านั้น อย่าเผลอประกาศ <code>this.balance</code> แบบ public คู่กันไปด้วย`,
    example: `const a = new Account();
a.deposit(100);
// a.#balance ไม่สามารถเข้าถึงจากภายนอกได้`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>class Account</code> พร้อม private field <code>#balance</code><br/>
    2. มี method <code>deposit(amount)</code> บวกค่าเข้า <code>#balance</code>`
  },
  {
    id: "oop_encapsulation_getter",
    meta: "บทที่ 3",
    title: "Encapsulation: Getter",
    template: `// สถานการณ์: ต่อยอดจาก Account เดิม ต้องการให้ code ภายนอก "อ่าน" ค่า balance ได้ แบบ read-only
// 1. เขียน class Account มี private field #balance เริ่มต้นที่ 0
// 2. เขียน getter balance() ที่คืนค่า #balance
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Getter...");
      const clean = stripComments(code);
      if (!/class\s+Account\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Account");
      }
      if (!/#balance/.test(clean)) {
        throw new Error("ไม่พบ private field #balance");
      }
      if (!/get\s+balance\s*\(\s*\)\s*\{/.test(clean)) {
        throw new Error("ไม่พบ getter get balance() — ต้องประกาศด้วย keyword get");
      }
      const getterMatch = /get\s+balance\s*\(\s*\)\s*\{([\s\S]*?)\}/.exec(clean);
      if (!getterMatch || !/#balance/.test(getterMatch[1])) {
        throw new Error("getter balance() ต้อง return ค่าจาก #balance");
      }
      log("✓ สร้าง getter balance() คืนค่าจาก #balance ถูกต้อง");
    },
    hint: "get balance() { return this.#balance; } — getter เรียกใช้เหมือน property ธรรมดา ไม่ต้องมีวงเล็บตอนเรียก",
    solution: `class Account {
  #balance = 0;

  get balance() {
    return this.#balance;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Getter</strong> สำหรับ expose ค่าแบบ read-only จาก private field<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>get</code> ทำให้ method เรียกใช้ได้เหมือน property (<code>account.balance</code> ไม่ใช่ <code>account.balance()</code>) — เหมาะกับการ expose ค่าที่อยากให้อ่านได้แต่ไม่อยากให้ set ตรงๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>get balance() { return this.#balance; }</code><br/>
เรียกใช้: <code>account.balance</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เผลอใส่วงเล็บตอนเรียก (<code>account.balance()</code>) จะ error เพราะ getter ไม่ใช่ function ธรรมดา`,
    example: `const a = new Account();
console.log(a.balance); // 0 — ไม่มีวงเล็บ`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. มี private field <code>#balance</code><br/>
    2. มี getter <code>get balance()</code> คืนค่า <code>#balance</code>`
  },
  {
    id: "oop_encapsulation_setter_validation",
    meta: "บทที่ 4",
    title: "Encapsulation: Setter พร้อม Validation",
    template: `// สถานการณ์: ต้องการให้ตั้งค่า balance ผ่าน setter ได้ แต่ต้อง reject ค่าติดลบ
// 1. เขียน class Account มี private field #balance เริ่มต้นที่ 0
// 2. เขียน setter balance(value) ที่ throw error ถ้า value น้อยกว่า 0 ไม่งั้นเก็บค่าไว้ที่ #balance
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Setter พร้อม Validation...");
      const clean = stripComments(code);
      if (!/class\s+Account\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Account");
      }
      if (!/set\s+balance\s*\(/.test(clean)) {
        throw new Error("ไม่พบ setter set balance(value)");
      }
      const setterMatch = /set\s+balance\s*\(\s*\w+\s*\)\s*\{([\s\S]*?)\n\s*\}/.exec(clean);
      if (!setterMatch) {
        throw new Error("ไม่สามารถอ่าน body ของ setter balance ได้");
      }
      const body = setterMatch[1];
      if (!/throw/.test(body)) {
        throw new Error("setter balance ต้อง throw error เมื่อค่าติดลบ");
      }
      if (!/<\s*0/.test(body)) {
        throw new Error("setter balance ต้องเช็คเงื่อนไข value < 0 ก่อน throw");
      }
      log("✓ setter balance(value) มี validation ปฏิเสธค่าติดลบถูกต้อง");
    },
    hint: "set balance(value) { if (value < 0) { throw new Error('negative'); } this.#balance = value; }",
    solution: `class Account {
  #balance = 0;

  set balance(value) {
    if (value < 0) {
      throw new Error('balance cannot be negative');
    }
    this.#balance = value;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Setter</strong> ที่ทำ validation ก่อนเก็บค่าจริง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>set</code> ทำให้ method รันตอน assign ค่า (<code>account.balance = -5</code>) — เป็นจุดเดียวที่ควบคุมได้ว่าค่าที่เข้ามาถูกต้องหรือไม่ก่อนจะเก็บจริง ป้องกัน state ที่ผิดพลาดเข้าไปอยู่ใน object<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>set balance(value) {</code><br/>
<code>&nbsp;&nbsp;if (value < 0) throw new Error(...);</code><br/>
<code>&nbsp;&nbsp;this.#balance = value;</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม throw แล้วปล่อยผ่านเงียบๆ (silent fail) จะทำให้ state ผิดหลุดเข้าไปโดยไม่มีใครรู้`,
    example: `const a = new Account();
a.balance = 100; // OK
a.balance = -5;  // throws Error`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. มี setter <code>set balance(value)</code><br/>
    2. <code>throw</code> เมื่อ <code>value < 0</code> ไม่งั้นเก็บค่าไว้ที่ <code>#balance</code>`
  },
  {
    id: "oop_immutability",
    meta: "บทที่ 5",
    title: "Immutability",
    template: `// สถานการณ์: ต้องการให้ config object ของ test suite ไม่สามารถถูกแก้ไขระหว่างรันได้อีกหลังจากสร้างเสร็จ
// 1. สร้าง object config มี property baseUrl และ timeout ตามใจ
// 2. ใช้ Object.freeze() ทำให้ config แก้ไขไม่ได้
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Immutability...");
      const clean = stripComments(code);
      if (!/Object\.freeze\(/.test(clean)) {
        throw new Error("ไม่พบการใช้ Object.freeze()");
      }
      log("✓ ใช้ Object.freeze() ถูกต้อง");
    },
    hint: "const config = { baseUrl: '...', timeout: 5000 }; Object.freeze(config);",
    solution: `const config = {
  baseUrl: 'http://localhost:5173',
  timeout: 5000,
};
Object.freeze(config);`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Immutability</strong> ด้วย <code>Object.freeze()</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>Object.freeze()</code> ป้องกันไม่ให้ property ของ object ถูกเปลี่ยนแปลง ลบ หรือเพิ่มใหม่ได้อีก — เหมาะกับ config ที่ไม่ควรมีใคร (หรือ test อื่น) แก้ไขระหว่างรัน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const config = { baseUrl: '...' };</code><br/>
<code>Object.freeze(config);</code><br/>
<code>config.baseUrl = 'x'; // ไม่มีผล (silent ใน non-strict mode)</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>Object.freeze()</code> เป็น shallow — freeze แค่ระดับบนสุด ถ้า property เป็น nested object ตัว nested เองยังแก้ไขได้`,
    example: `Object.freeze(config);
config.timeout = 999; // ไม่มีผล, config.timeout ยังคงค่าเดิม`,
    task: `จงเขียนโค้ดให้สมบูรณ์ โดย:<br/>
    1. สร้าง object <code>config</code><br/>
    2. เรียก <code>Object.freeze(config)</code>`
  },
  {
    id: "oop_inheritance_extends",
    meta: "บทที่ 6",
    title: "Inheritance: extends",
    template: `// สถานการณ์: มี class BasePage อยู่แล้ว (สมมติว่าประกาศไว้ที่อื่น) ต้องการสร้าง LoginPage ที่สืบทอดพฤติกรรมจากมัน
// 1. เขียน class LoginPage ที่ extends BasePage
// 2. constructor รับ url แล้วเรียก super(url)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Inheritance...");
      const clean = stripComments(code);
      if (!/class\s+LoginPage\s+extends\s+BasePage\b/.test(clean)) {
        throw new Error("ไม่พบ class LoginPage extends BasePage");
      }
      if (!/super\s*\(/.test(clean)) {
        throw new Error("ไม่พบการเรียก super(...) ใน constructor");
      }
      log("✓ LoginPage extends BasePage พร้อมเรียก super() ถูกต้อง");
    },
    hint: "class LoginPage extends BasePage { constructor(url) { super(url); } }",
    solution: `class LoginPage extends BasePage {
  constructor(url) {
    super(url);
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Inheritance</strong> ด้วย <code>extends</code> และ <code>super()</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>extends</code> ทำให้ class ลูกได้รับ property/method ทั้งหมดจาก class แม่มาใช้ — <code>super(...)</code> ต้องเรียกก่อนใช้ <code>this</code> ใน constructor ของ class ลูกเสมอ เพื่อรัน constructor ของ class แม่ก่อน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class LoginPage extends BasePage {</code><br/>
<code>&nbsp;&nbsp;constructor(url) { super(url); }</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใช้ <code>this</code> ก่อนเรียก <code>super()</code> จะ throw ReferenceError ทันที — <code>super()</code> ต้องมาก่อนเสมอในทุก constructor ของ subclass`,
    example: `const login = new LoginPage('/login');
// login สืบทอด method ทั้งหมดจาก BasePage`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>class LoginPage extends BasePage</code><br/>
    2. constructor รับ <code>url</code> แล้วเรียก <code>super(url)</code>`
  },
  {
    id: "oop_method_override",
    meta: "บทที่ 7",
    title: "Method Overriding",
    template: `// สถานการณ์: BasePage มี method open() ทั่วไป แต่ LoginPage ต้องการ open() ที่ทำอะไรเพิ่มเติมเฉพาะหน้า login
// 1. เขียน class LoginPage extends BasePage
// 2. override method open() ให้เรียก super.open() ก่อน แล้วค่อยทำ logic เพิ่ม (เช่น console.log ก็ได้)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Method Overriding...");
      const clean = stripComments(code);
      if (!/class\s+LoginPage\s+extends\s+BasePage\b/.test(clean)) {
        throw new Error("ไม่พบ class LoginPage extends BasePage");
      }
      const openMatch = /open\s*\(\s*\)\s*\{([\s\S]*?)\n\s*\}/.exec(clean);
      if (!openMatch) {
        throw new Error("ไม่พบการ override method open()");
      }
      if (!/super\.open\s*\(/.test(openMatch[1])) {
        throw new Error("method open() ที่ override ต้องเรียก super.open() ก่อน");
      }
      log("✓ override open() พร้อมเรียก super.open() ถูกต้อง");
    },
    hint: "open() { super.open(); /* logic เพิ่มเติม */ }",
    solution: `class LoginPage extends BasePage {
  open() {
    super.open();
    console.log('LoginPage opened');
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Method Overriding</strong> และการเรียก <code>super.method()</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Subclass ประกาศ method ชื่อเดียวกับ class แม่ได้เพื่อ "แทนที่" พฤติกรรมเดิม — <code>super.method()</code> ยังเรียก version ของ class แม่ได้ถ้าต้องการต่อยอดจากของเดิมแทนที่จะเขียนใหม่ทั้งหมด<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class LoginPage extends BasePage {</code><br/>
<code>&nbsp;&nbsp;open() { super.open(); /* เพิ่มเติม */ }</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> Override แล้วลืมเรียก <code>super.open()</code> จะทำให้ logic ของ class แม่หายไปทั้งหมด (ถ้าตั้งใจแทนที่ทั้งหมดก็ไม่ต้องเรียก แต่ต้องรู้ตัวว่าทำแบบนั้น)`,
    example: `const login = new LoginPage();
login.open(); // รัน BasePage.open() ก่อน แล้วค่อยรัน logic เพิ่มของ LoginPage`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>class LoginPage extends BasePage</code><br/>
    2. override <code>open()</code> ที่เรียก <code>super.open()</code> ก่อนเสมอ`
  },
  {
    id: "oop_polymorphism_common_interface",
    meta: "บทที่ 8",
    title: "Polymorphism: Common Interface",
    template: `// สถานการณ์: มี BasePage class ให้แล้ว (ประกาศไว้ในโค้ดของคุณ) มี method open() คืนค่า string
// ต้องสร้าง subclass 2 ตัวที่ override open() คืนค่าต่างกัน เพื่อพิสูจน์ polymorphism
// 1. เขียน class BasePage { open() { return 'base'; } }
// 2. เขียน class LoginPage extends BasePage { open() { return 'login'; } }
// 3. เขียน class DashboardPage extends BasePage { open() { return 'dashboard'; } }
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Polymorphism ด้วยการรันจริง...");
      const [BasePage, LoginPage, DashboardPage] = getLearnerClasses(code, ["BasePage", "LoginPage", "DashboardPage"]);

      const base = new BasePage();
      const login = new LoginPage();
      const dashboard = new DashboardPage();

      if (typeof base.open !== "function" || typeof login.open !== "function" || typeof dashboard.open !== "function") {
        throw new Error("ทั้ง 3 class ต้องมี method open()");
      }

      const pages = [login, dashboard];
      const results = pages.map((p) => p.open());

      if (new Set(results).size !== results.length) {
        throw new Error("LoginPage.open() และ DashboardPage.open() ต้องคืนค่าที่แตกต่างกันจริง (แต่ละ subclass ต้อง override ให้พฤติกรรมต่างกัน)");
      }
      if (!(login instanceof BasePage) || !(dashboard instanceof BasePage)) {
        throw new Error("LoginPage และ DashboardPage ต้อง extends BasePage");
      }
      log(`✓ เรียก .open() ผ่าน interface เดียวกัน ได้ผลลัพธ์ต่างกันจริงตาม subclass: ${JSON.stringify(results)}`);
    },
    hint: "ประกาศ BasePage มี open() คืนค่าอะไรก็ได้ แล้วให้ LoginPage/DashboardPage extends BasePage แล้ว override open() คืนค่าที่ต่างกันจริงๆ",
    solution: `class BasePage {
  open() {
    return 'base';
  }
}

class LoginPage extends BasePage {
  open() {
    return 'login';
  }
}

class DashboardPage extends BasePage {
  open() {
    return 'dashboard';
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Polymorphism</strong> — เรียก method เดียวกันผ่าน interface เดียวกัน แต่ได้พฤติกรรมต่างกันตาม subclass จริง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Polymorphism คือความสามารถของ object ต่าง class (ที่สืบทอดมาจากแม่เดียวกัน) ในการตอบสนองต่อ method call เดียวกันด้วยพฤติกรรมของตัวเอง — ประโยชน์ในงาน QA: วนลูป array ของ Page Object หลายประเภท เรียก <code>.open()</code> เดียวกันได้โดยไม่ต้องเช็ค type ก่อน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const pages = [new LoginPage(), new DashboardPage()];</code><br/>
<code>pages.forEach(p => p.open()); // แต่ละตัวทำงานตาม override ของตัวเอง</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า subclass ไม่ override method เลย จะได้พฤติกรรมของ class แม่ทุกตัวเหมือนกันหมด — ไม่ใช่ polymorphism จริง (เขียน regex ให้ผ่านได้ แต่พฤติกรรมจริงไม่ต่างกัน) บทเรียนนี้รันโค้ดจริงเพื่อเช็คว่าแต่ละ subclass คืนค่าต่างกันจริง`,
    example: `const pages = [new LoginPage(), new DashboardPage()];
pages.forEach(p => console.log(p.open())); // 'login', 'dashboard'`,
    task: `จงเขียน 3 class ให้สมบูรณ์:<br/>
    1. <code>BasePage</code> มี <code>open()</code><br/>
    2. <code>LoginPage extends BasePage</code> override <code>open()</code> คืนค่าต่างจาก base<br/>
    3. <code>DashboardPage extends BasePage</code> override <code>open()</code> คืนค่าต่างจากทั้งสองตัวข้างต้น`
  },
  {
    id: "oop_abstraction_template_method",
    meta: "บทที่ 9",
    title: "Abstraction: Template Method",
    template: `// สถานการณ์: อยากบังคับให้ subclass ทุกตัวต้อง implement run() เอง ไม่งั้นให้ error ทันทีตอนเรียกจาก base
// 1. เขียน class TestCase { run() { throw new Error('run() must be implemented'); } }
// 2. เขียน class LoginTestCase extends TestCase ที่ override run() ให้คืนค่าอะไรก็ได้ (ไม่ throw)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Abstraction ด้วยการรันจริง...");
      const [TestCase, LoginTestCase] = getLearnerClasses(code, ["TestCase", "LoginTestCase"]);

      const base = new TestCase();
      let baseThrew = false;
      try {
        base.run();
      } catch (err) {
        baseThrew = true;
      }
      if (!baseThrew) {
        throw new Error("TestCase.run() (base) ต้อง throw error เมื่อเรียกตรงๆ โดยไม่ override");
      }

      const child = new LoginTestCase();
      if (!(child instanceof TestCase)) {
        throw new Error("LoginTestCase ต้อง extends TestCase");
      }
      let childThrew = false;
      try {
        child.run();
      } catch (err) {
        childThrew = true;
      }
      if (childThrew) {
        throw new Error("LoginTestCase.run() ต้อง override ไม่ให้ throw error เหมือน base");
      }
      log("✓ TestCase.run() (base) throw ตามคาด, LoginTestCase.run() override ไม่ throw ถูกต้อง");
    },
    hint: "class TestCase { run() { throw new Error('...'); } } แล้ว class LoginTestCase extends TestCase { run() { return 'ok'; } } (ห้ามเรียก super.run() ใน LoginTestCase เพราะจะ throw)",
    solution: `class TestCase {
  run() {
    throw new Error('run() must be implemented');
  }
}

class LoginTestCase extends TestCase {
  run() {
    return 'login test executed';
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Abstraction</strong> ผ่าน Template Method pattern — base class กำหนด "สัญญา" ว่า subclass ต้อง implement อะไรบ้าง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>JavaScript ไม่มี abstract class ในตัวเหมือนภาษาอื่น แต่จำลองได้ด้วยการให้ method ของ base class throw error ทันทีถ้าไม่ถูก override — บังคับให้ subclass ทุกตัวต้อง implement เอง ไม่งั้นพังทันทีตอนรัน ไม่ใช่พังแบบเงียบๆ ทีหลัง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class TestCase { run() { throw new Error('...'); } }</code><br/>
<code>class LoginTestCase extends TestCase { run() { return '...'; } }</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม override <code>run()</code> ใน subclass จะทำให้ error หลุดออกมาตอนรันจริง — นี่คือพฤติกรรมที่ตั้งใจ (fail-fast) ไม่ใช่ bug`,
    example: `const t = new LoginTestCase();
t.run(); // 'login test executed', ไม่ throw

const base = new TestCase();
base.run(); // throws Error`,
    task: `จงเขียน 2 class ให้สมบูรณ์:<br/>
    1. <code>TestCase</code> มี <code>run()</code> ที่ throw เสมอ<br/>
    2. <code>LoginTestCase extends TestCase</code> override <code>run()</code> ไม่ให้ throw`
  },
  {
    id: "oop_typescript_interface_abstract",
    meta: "บทที่ 10",
    title: "TypeScript: Interface & Abstract Class",
    template: `// สถานการณ์: ทีมย้ายไปใช้ TypeScript ต้องการนิยาม "สัญญา" ของ Page Object แบบ type-safe
// (บทนี้เป็น TypeScript syntax — ตรวจแบบ static text ไม่ได้รันจริง เพราะ sandbox นี้รัน JS เท่านั้น)
// 1. เขียน interface PageObject มี method open(): void
// 2. เขียน abstract class BasePage implements PageObject มี abstract method open(): void
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ TypeScript Interface & Abstract Class...");
      const clean = stripComments(code);
      if (!/interface\s+PageObject\s*\{/.test(clean)) {
        throw new Error("ไม่พบการประกาศ interface PageObject");
      }
      const interfaceMatch = /interface\s+PageObject\s*\{([\s\S]*?)\}/.exec(clean);
      if (!interfaceMatch || !/open\s*\(\s*\)\s*:\s*void/.test(interfaceMatch[1])) {
        throw new Error("interface PageObject ต้องมี open(): void");
      }
      if (!/abstract\s+class\s+BasePage\s+implements\s+PageObject\b/.test(clean)) {
        throw new Error("ไม่พบ abstract class BasePage implements PageObject");
      }
      if (!/abstract\s+open\s*\(\s*\)\s*:\s*void\s*;/.test(clean)) {
        throw new Error("BasePage ต้องมี abstract open(): void;");
      }
      log("✓ ประกาศ interface PageObject และ abstract class BasePage ถูกต้อง");
    },
    hint: "interface PageObject { open(): void; } แล้ว abstract class BasePage implements PageObject { abstract open(): void; }",
    solution: `interface PageObject {
  open(): void;
}

abstract class BasePage implements PageObject {
  abstract open(): void;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Interface</strong> และ <strong>Abstract Class</strong> ของ TypeScript — วิธีจำลอง Abstraction แบบ type-safe ที่ JavaScript ธรรมดาไม่มี<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>interface</code> นิยาม "สัญญา" ของ shape/method ที่ต้องมี โดยไม่มี implementation เลย (ลบไปตอน compile ไม่เหลือใน JS ที่ output) — <code>abstract class</code> คล้ายกันแต่ implement บางส่วนได้ และ instantiate ตรงๆ ไม่ได้ (<code>new BasePage()</code> จะ error) ต้องผ่าน subclass ที่ implement <code>abstract</code> method ให้ครบก่อน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>interface PageObject { open(): void; }</code><br/>
<code>abstract class BasePage implements PageObject {</code><br/>
<code>&nbsp;&nbsp;abstract open(): void;</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> พยายาม <code>new BasePage()</code> ตรงๆ จะ compile error ทันที (TS2511) — abstract class มีไว้ให้ extends เท่านั้น ไม่ใช่สร้าง instance ตรง`,
    example: `class LoginPage extends BasePage {
  open(): void {
    console.log('opening login page');
  }
}`,
    task: `จงเขียน TypeScript ให้สมบูรณ์ โดย:<br/>
    1. <code>interface PageObject</code> มี <code>open(): void</code><br/>
    2. <code>abstract class BasePage implements PageObject</code> มี <code>abstract open(): void;</code>`
  },
  {
    id: "oop_composition_over_inheritance",
    meta: "บทที่ 11",
    title: "Composition over Inheritance",
    template: `// สถานการณ์: Page ต้องการความสามารถ log แต่ไม่ควร extends Logger (Page ไม่ใช่ Logger ชนิดหนึ่ง)
// ควรใช้ composition: ให้ Page "มี" Logger เป็น field แทน
// 1. เขียน class Logger { log(msg) { ... } }
// 2. เขียน class Page ที่ "ไม่" extends Logger แต่มี this.logger = new Logger() แทน
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Composition over Inheritance...");
      const clean = stripComments(code);
      if (!/class\s+Logger\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Logger");
      }
      if (!/class\s+Page\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Page");
      }
      if (/class\s+Page\s+extends\s+Logger\b/.test(clean)) {
        throw new Error("Page ต้องไม่ extends Logger — โจทย์นี้ต้องการ composition ไม่ใช่ inheritance");
      }
      if (!/this\.logger\s*=\s*new\s+Logger\s*\(/.test(clean)) {
        throw new Error("ไม่พบการเก็บ instance ของ Logger ไว้ที่ this.logger = new Logger()");
      }
      log("✓ Page ใช้ composition (this.logger = new Logger()) แทน inheritance ถูกต้อง");
    },
    hint: "class Page { constructor() { this.logger = new Logger(); } } — Page มี Logger เป็นสมาชิก ไม่ได้ extends จากมัน",
    solution: `class Logger {
  log(msg) {
    console.log(msg);
  }
}

class Page {
  constructor() {
    this.logger = new Logger();
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจหลัก <strong>"Composition over Inheritance"</strong> — เลือกใช้ "has-a" แทน "is-a" เมื่อความสัมพันธ์ไม่ใช่ subtype จริง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>Page extends Logger</code> ผิดหลัก เพราะ Page ไม่ใช่ Logger ชนิดหนึ่ง (fails the "is-a" test) — ควรใช้ composition แทน: Page "มี" Logger เป็นเครื่องมือช่วย (this.logger = new Logger()) เรียกใช้ผ่าน this.logger.log(...) แทน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class Page {</code><br/>
<code>&nbsp;&nbsp;constructor() { this.logger = new Logger(); }</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใช้ inheritance เพียงเพราะอยากได้ method มาใช้ฟรีๆ (ไม่ได้เช็คว่าเป็นความสัมพันธ์แบบ subtype จริงไหม) นำไปสู่ class hierarchy ที่ลึกและเปราะบาง`,
    example: `const page = new Page();
page.logger.log('opened');`,
    task: `จงเขียน 2 class ให้สมบูรณ์:<br/>
    1. <code>class Logger</code><br/>
    2. <code>class Page</code> ที่<strong>ไม่</strong> extends Logger แต่มี <code>this.logger = new Logger()</code>`
  },
  {
    id: "oop_solid_srp",
    meta: "บทที่ 12",
    title: "SOLID: Single Responsibility Principle",
    template: `// สถานการณ์: class ReportManager ทำสองหน้าที่ปนกัน — validate ข้อมูล test result และ write ไฟล์ report
// (เห็นปัญหา: ถ้า format การเขียนไฟล์เปลี่ยน ต้องมาแก้ class เดียวกับที่ validate logic ก็อยู่ในนั้นด้วย)
// 1. เขียน class ResultValidator ที่มี method validate(data)
// 2. เขียน class ReportWriter ที่มี method write(report)
// ห้ามให้ทั้งสอง method (validate/write) ไปอยู่ปนกันใน class เดียวกัน — แยกความรับผิดชอบให้ชัด
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Single Responsibility Principle...");
      const clean = stripComments(code);
      if (!/class\s+ResultValidator\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class ResultValidator");
      }
      if (!/class\s+ReportWriter\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class ReportWriter");
      }
      const validatorMatch = /class\s+ResultValidator\s*\{([\s\S]*?)\n\}/.exec(clean);
      const writerMatch = /class\s+ReportWriter\s*\{([\s\S]*?)\n\}/.exec(clean);
      if (!validatorMatch || !/validate\s*\(/.test(validatorMatch[1])) {
        throw new Error("ResultValidator ต้องมี method validate(data)");
      }
      if (!writerMatch || !/write\s*\(/.test(writerMatch[1])) {
        throw new Error("ReportWriter ต้องมี method write(report)");
      }
      if (/write\s*\(/.test(validatorMatch[1])) {
        throw new Error("ResultValidator ไม่ควรมี method write — เป็นความรับผิดชอบของ ReportWriter (แยกหน้าที่ให้ชัด ไม่ปนกัน)");
      }
      if (/validate\s*\(/.test(writerMatch[1])) {
        throw new Error("ReportWriter ไม่ควรมี method validate — เป็นความรับผิดชอบของ ResultValidator (แยกหน้าที่ให้ชัด ไม่ปนกัน)");
      }
      log("✓ แยกความรับผิดชอบเป็น ResultValidator และ ReportWriter ถูกต้อง (คนละเหตุผลในการแก้ไข)");
    },
    hint: "ResultValidator มีแค่ validate(data) เท่านั้น, ReportWriter มีแค่ write(report) เท่านั้น อย่าให้ method ข้ามไปอยู่อีก class",
    solution: `class ResultValidator {
  validate(data) {
    return data != null;
  }
}

class ReportWriter {
  write(report) {
    return JSON.stringify(report);
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Single Responsibility Principle (SRP)</strong> — ตัวแรกของ SOLID: class ควรมีเหตุผลเดียวเท่านั้นในการถูกแก้ไข<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ถ้า class เดียวทำทั้ง validate และ write file — เวลา format ไฟล์เปลี่ยน (เหตุผลที่ 1) หรือ validation rule เปลี่ยน (เหตุผลที่ 2) ต้องมาแก้ class เดียวกันทั้งคู่ เสี่ยงกระทบกันโดยไม่ตั้งใจ — แยกเป็นคนละ class ตามความรับผิดชอบ (validate vs write) ทำให้แก้จุดหนึ่งไม่กระทบอีกจุด<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class ResultValidator { validate(data) {...} }</code><br/>
<code>class ReportWriter { write(report) {...} }</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> "God class" ที่ทำทุกอย่าง (validate + write + format + send email) เป็นสัญญาณว่า class นั้นละเมิด SRP — ยิ่งฟังก์ชันเยอะ ยิ่งมีเหตุผลให้แก้เยอะ ยิ่งเสี่ยง bug ข้ามหน้าที่`,
    example: `const validator = new ResultValidator();
const writer = new ReportWriter();
if (validator.validate(data)) {
  writer.write({ status: 'ok' });
}`,
    task: `จงเขียน 2 class แยกความรับผิดชอบให้ชัด:<br/>
    1. <code>ResultValidator</code> มีเฉพาะ <code>validate(data)</code><br/>
    2. <code>ReportWriter</code> มีเฉพาะ <code>write(report)</code>`
  },
  {
    id: "oop_solid_ocp",
    meta: "บทที่ 13",
    title: "SOLID: Open/Closed Principle",
    template: `// สถานการณ์: มี ReportFormatter base class อยู่แล้ว ต้องเพิ่มรูปแบบ format ใหม่โดย "ไม่แก้" ของเดิม
// ให้เพิ่มด้วยการสร้าง subclass ใหม่แทน (เปิดให้ขยาย แต่ปิดไม่ให้แก้ของเดิม)
// 1. เขียน class ReportFormatter { format(data) { return JSON.stringify(data); } }
// 2. เขียน class XmlReportFormatter extends ReportFormatter ที่ override format(data) คืนค่าเป็น XML-like string แทน
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Open/Closed Principle ด้วยการรันจริง...");
      const [ReportFormatter, XmlReportFormatter] = getLearnerClasses(code, ["ReportFormatter", "XmlReportFormatter"]);

      const base = new ReportFormatter();
      const xml = new XmlReportFormatter();

      if (typeof base.format !== "function" || typeof xml.format !== "function") {
        throw new Error("ทั้งสอง class ต้องมี method format(data)");
      }
      if (!(xml instanceof ReportFormatter)) {
        throw new Error("XmlReportFormatter ต้อง extends ReportFormatter (ขยายผ่านการสร้าง subclass ใหม่ ไม่ใช่แก้ของเดิม)");
      }
      const sample = { status: 'ok' };
      const baseResult = base.format(sample);
      const xmlResult = xml.format(sample);
      if (baseResult === xmlResult) {
        throw new Error("XmlReportFormatter.format() ต้อง override ให้ผลลัพธ์ต่างจาก ReportFormatter.format() จริง");
      }
      log(`✓ เพิ่มรูปแบบ format ใหม่ผ่าน subclass โดยไม่แก้ ReportFormatter เดิม: base=${JSON.stringify(baseResult)}, xml=${JSON.stringify(xmlResult)}`);
    },
    hint: "ReportFormatter.format() คืนค่าอะไรก็ได้ (เช่น JSON.stringify) แล้ว XmlReportFormatter extends ReportFormatter override format() คืนค่าเป็นรูปแบบอื่นที่ต่างออกไปจริง",
    solution: `class ReportFormatter {
  format(data) {
    return JSON.stringify(data);
  }
}

class XmlReportFormatter extends ReportFormatter {
  format(data) {
    return \`<report status="\${data.status}"/>\`;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Open/Closed Principle (OCP)</strong> — class ควรเปิดให้ขยายได้ แต่ปิดไม่ให้แก้ไขโค้ดเดิม<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ถ้าต้องเพิ่มรูปแบบ report ใหม่ทุกครั้งด้วยการเปิด <code>ReportFormatter</code> เดิมมาเติม <code>if/else</code> — ยิ่งเพิ่มรูปแบบเยอะ ยิ่งเสี่ยงพัง logic เดิมที่ทำงานอยู่แล้ว แทนที่จะแก้ของเดิม ให้ <strong>extends</strong> แล้ว override แทน (เหมือนที่ทำใน Polymorphism lesson แต่คราวนี้เน้นมุมมอง "เพิ่ม feature โดยไม่แตะของเดิม")<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class XmlReportFormatter extends ReportFormatter { format(data) { /* แบบใหม่ */ } }</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เปิด <code>ReportFormatter</code> เดิมมาเติม <code>if (type === 'xml') {...}</code> ทุกครั้งที่มี format ใหม่ — นี่คือการละเมิด OCP ตรงๆ (แก้ของเดิมทุกครั้ง แทนที่จะขยายผ่าน subclass)`,
    example: `const formatters = [new ReportFormatter(), new XmlReportFormatter()];
formatters.forEach(f => console.log(f.format({ status: 'ok' })));`,
    task: `จงเขียน 2 class ให้สมบูรณ์:<br/>
    1. <code>ReportFormatter</code> มี <code>format(data)</code><br/>
    2. <code>XmlReportFormatter extends ReportFormatter</code> override <code>format(data)</code> คืนค่าต่างจาก base จริง`
  },
  {
    id: "oop_solid_lsp",
    meta: "บทที่ 14",
    title: "SOLID: Liskov Substitution Principle",
    template: `// สถานการณ์: ทุก subclass ของ TestRunner ต้อง "แทนที่" กันได้โดยไม่ทำให้ผู้ใช้ (caller) พังหรือได้ shape ผลลัพธ์ที่ต่างไป
// caller คาดหวังว่า runner.run() จะคืนค่า object ที่มี property "passed" เป็น boolean เสมอ ไม่ว่าจะเป็น subclass ไหน
// 1. เขียน class TestRunner { run() { return { passed: true }; } }
// 2. เขียน class SmokeTestRunner extends TestRunner ที่ override run() แต่ยังคืนค่า { passed: boolean } ตามสัญญาเดิม
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Liskov Substitution Principle ด้วยการรันจริง...");
      const [TestRunner, SmokeTestRunner] = getLearnerClasses(code, ["TestRunner", "SmokeTestRunner"]);

      if (!(new SmokeTestRunner() instanceof TestRunner)) {
        throw new Error("SmokeTestRunner ต้อง extends TestRunner");
      }

      const runners = [new TestRunner(), new SmokeTestRunner()];
      for (const runner of runners) {
        const result = runner.run();
        if (!result || typeof result.passed !== "boolean") {
          throw new Error(`runner.run() ของทุก subclass ต้องคืนค่า object ที่มี property "passed" เป็น boolean เสมอ (ตามสัญญาของ TestRunner) แต่ ${runner.constructor.name}.run() คืนค่า ${JSON.stringify(result)} — subclass ต้อง "แทนที่" กันได้โดยไม่เปลี่ยน shape ผลลัพธ์`);
        }
      }
      log("✓ ทุก subclass คืนค่า shape { passed: boolean } ตามสัญญาเดิม — แทนที่กันได้จริงตาม LSP");
    },
    hint: "TestRunner.run() คืนค่า { passed: true } แล้ว SmokeTestRunner extends TestRunner override run() แต่ยังคืนค่า object ที่มี passed เป็น boolean เหมือนเดิม (จะเป็น true หรือ false ก็ได้ แค่ shape ต้องตรงสัญญา)",
    solution: `class TestRunner {
  run() {
    return { passed: true };
  }
}

class SmokeTestRunner extends TestRunner {
  run() {
    return { passed: false };
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Liskov Substitution Principle (LSP)</strong> — subclass ต้องแทนที่ base class ได้โดยไม่ทำให้โปรแกรมพังหรือพฤติกรรมผิดสัญญา<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ถ้า caller เขียนโค้ดโดยคาดหวัง <code>runner.run().passed</code> เป็น boolean เสมอ (ไม่ว่าจะส่ง <code>TestRunner</code> หรือ subclass ไหนเข้ามา) — subclass ที่คืนค่า shape ต่างไป (เช่น คืน string แทน object หรือ throw แทนที่จะ return) จะทำให้ caller พังทันทีที่สลับมาใช้ subclass — subclass ต้องรักษา "สัญญา" (input/output shape) ของ base class ไว้เสมอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const runners = [new TestRunner(), new SmokeTestRunner()];</code><br/>
<code>runners.forEach(r => r.run().passed); // ต้องทำงานได้เหมือนกันทุกตัว</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> Classic LSP violation: subclass override method ให้ throw error หรือคืนค่าคนละ shape จาก base (เช่น base คืน object, subclass คืน string) — caller ที่เขียนมาใช้กับ base จะพังทันทีเมื่อสลับไปใช้ subclass ทั้งที่ไม่ควรต้องรู้ตัวเลยว่าเปลี่ยน type`,
    example: `function runAndCheck(runner) {
  const result = runner.run();
  return result.passed ? 'PASS' : 'FAIL';
}
runAndCheck(new SmokeTestRunner()); // ต้องทำงานได้เหมือน runAndCheck(new TestRunner())`,
    task: `จงเขียน 2 class ให้สมบูรณ์:<br/>
    1. <code>TestRunner</code> มี <code>run()</code> คืนค่า <code>{ passed: boolean }</code><br/>
    2. <code>SmokeTestRunner extends TestRunner</code> override <code>run()</code> แต่ยังคืนค่า shape <code>{ passed: boolean }</code> ตามสัญญาเดิม`
  },
  {
    id: "oop_solid_isp",
    meta: "บทที่ 15",
    title: "SOLID: Interface Segregation Principle",
    template: `// สถานการณ์: เดิมมี class เดียวชื่อ Testable บังคับให้ทุกคนต้อง implement ครบ 4 method (run, setup, teardown, report)
// ทั้งที่ test บางแบบ (เช่น smoke test) ต้องการแค่ run() กับ report() เท่านั้น ไม่ต้องการ setup/teardown เลย
// แก้โดยแยกเป็น 2 class เล็กๆ ตามความสามารถจริงที่ใช้ แทนที่จะบังคับ implement ครบทุกอย่างในที่เดียว
// 1. เขียน class Runnable ที่มีเฉพาะ method run()
// 2. เขียน class Reportable ที่มีเฉพาะ method report()
// (ห้ามรวม setup/teardown ปนเข้ามาใน class ใดๆ — โจทย์นี้ต้องการแค่ 2 ความสามารถนี้)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Interface Segregation Principle...");
      const clean = stripComments(code);
      if (!/class\s+Runnable\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Runnable");
      }
      if (!/class\s+Reportable\b/.test(clean)) {
        throw new Error("ไม่พบการประกาศ class Reportable");
      }
      const runnableMatch = /class\s+Runnable\s*\{([\s\S]*?)\n\}/.exec(clean);
      const reportableMatch = /class\s+Reportable\s*\{([\s\S]*?)\n\}/.exec(clean);
      if (!runnableMatch || !/run\s*\(/.test(runnableMatch[1])) {
        throw new Error("Runnable ต้องมี method run()");
      }
      if (!reportableMatch || !/report\s*\(/.test(reportableMatch[1])) {
        throw new Error("Reportable ต้องมี method report()");
      }
      if (/setup\s*\(|teardown\s*\(/.test(runnableMatch[1]) || /setup\s*\(|teardown\s*\(/.test(reportableMatch[1])) {
        throw new Error("อย่าเผลอรวม setup/teardown เข้ามาใน class เหล่านี้ — โจทย์ต้องการแยกความสามารถให้เล็กเฉพาะที่ใช้จริง ไม่ใช่ interface ใหญ่ที่บังคับทุกอย่าง");
      }
      if (/class\s+Runnable\s+extends\s+Reportable\b/.test(clean) || /class\s+Reportable\s+extends\s+Runnable\b/.test(clean)) {
        throw new Error("Runnable และ Reportable ต้องเป็นความสามารถแยกอิสระจากกัน ไม่ใช่ extends กันเอง (ไม่งั้นกลับไปเป็น fat interface เหมือนเดิม)");
      }
      log("✓ แยก Runnable และ Reportable เป็นความสามารถเล็กๆ อิสระจากกันถูกต้อง");
    },
    hint: "Runnable มีแค่ run() เท่านั้น, Reportable มีแค่ report() เท่านั้น อย่าให้ extends กันเองหรือมี setup/teardown ปนมา",
    solution: `class Runnable {
  run() {
    return 'running';
  }
}

class Reportable {
  report() {
    return 'report generated';
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Interface Segregation Principle (ISP)</strong> — อย่าบังคับให้ implement method ที่ไม่ได้ใช้จริง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>"Fat interface" ที่บังคับ 4 method (run/setup/teardown/report) ทำให้ smoke test ที่ต้องการแค่ run+report ต้อง implement setup/teardown เปล่าๆ ไปด้วย (มักเป็น method ว่างเปล่าที่ไม่มีความหมาย) — แยกเป็นความสามารถเล็กๆ (Runnable, Reportable) แล้วให้ class ที่ต้องการจริงค่อยรวมเข้าด้วยกันเอง (เช่นผ่าน composition) ดีกว่าบังคับทุกคนต้อง implement ทุกอย่าง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class Runnable { run() {...} }</code><br/>
<code>class Reportable { report() {...} }</code><br/>
สมมติ SmokeTest ต้องการทั้งสองความสามารถ ก็ compose เข้าด้วยกันแทนที่จะ implement interface ใหญ่อันเดียว<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> class ที่ implement method เยอะแต่ครึ่งหนึ่งเป็น empty stub (<code>setup() {}</code> ที่ไม่ทำอะไรเลยเพราะ "ต้องมีเพราะ interface บังคับ") เป็นสัญญาณชัดว่า interface ใหญ่เกินไป ควรแยกให้เล็กลง`,
    example: `class SmokeTest {
  constructor() {
    this.runner = new Runnable();
    this.reporter = new Reportable();
  }
}`,
    task: `จงเขียน 2 class แยกความสามารถให้เล็กและอิสระจากกัน:<br/>
    1. <code>Runnable</code> มีเฉพาะ <code>run()</code><br/>
    2. <code>Reportable</code> มีเฉพาะ <code>report()</code>`
  },
  {
    id: "oop_solid_dip",
    meta: "บทที่ 16",
    title: "SOLID: Dependency Inversion Principle",
    template: `// สถานการณ์: TestRunner เดิม hardcode สร้าง ConcreteLogger เองข้างใน ทำให้เปลี่ยน logger (เช่นเป็น mock ตอน test) ไม่ได้เลย
// แก้โดยให้ TestRunner "รับ" logger ผ่าน constructor แทน (dependency injection) — พึ่งพา abstraction ไม่ใช่ concrete class ที่ผูกตายตัว
// 1. เขียน class TestRunner ที่ constructor รับ logger เป็น parameter แล้วเก็บไว้ที่ this.logger
// 2. เขียน method run() ที่เรียก this.logger.log('running') ผ่าน logger ที่ถูก inject เข้ามา (ห้าม new logger เองข้างใน)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Dependency Inversion Principle ด้วยการรันจริง...");
      const clean = stripComments(code);
      if (/new\s+\w*Logger\w*\s*\(/.test(clean)) {
        throw new Error("ห้าม new logger เองข้างใน class — ต้องรับ logger จากภายนอกผ่าน constructor (dependency injection) เพื่อพึ่งพา abstraction ไม่ใช่ concrete class");
      }
      const TestRunner = getLearnerClass(code, "TestRunner");

      const calls = [];
      const fakeLogger = { log: (msg) => calls.push(msg) };
      const runner = new TestRunner(fakeLogger);

      if (runner.logger !== fakeLogger) {
        throw new Error("TestRunner ต้องเก็บ logger ที่ inject เข้ามาไว้ที่ this.logger โดยตรง (ไม่ใช่สร้าง logger เองข้างใน)");
      }
      if (typeof runner.run !== "function") {
        throw new Error("TestRunner ต้องมี method run()");
      }
      runner.run();
      if (calls.length === 0) {
        throw new Error("run() ต้องเรียก this.logger.log(...) จริง (ผ่าน logger ที่ถูก inject เข้ามา) — ไม่มีการเรียก log เลย");
      }
      log(`✓ TestRunner ใช้ logger ที่ inject เข้ามาจริง (ไม่ hardcode concrete class): logged ${JSON.stringify(calls)}`);
    },
    hint: "constructor(logger) { this.logger = logger; } — ห้ามเขียน this.logger = new ConcreteLogger() ข้างใน ต้องรับจากภายนอกเท่านั้น แล้ว run() { this.logger.log('running'); }",
    solution: `class TestRunner {
  constructor(logger) {
    this.logger = logger;
  }

  run() {
    this.logger.log('running');
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Dependency Inversion Principle (DIP)</strong> — พึ่งพา abstraction (สิ่งที่ inject เข้ามา) แทนที่จะ hardcode concrete class ไว้ข้างใน<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ถ้า <code>TestRunner</code> เขียน <code>this.logger = new ConcreteLogger()</code> เองข้างใน constructor — จะสลับไปใช้ mock logger ตอน unit test ไม่ได้เลย (ผูกติดกับ concrete class ตายตัว) แก้ด้วยการ "รับ" logger จากภายนอกผ่าน constructor (dependency injection) แทน ทำให้ทดสอบง่ายขึ้นมาก (ส่ง fake logger เข้าไปแทนของจริงได้)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class TestRunner {</code><br/>
<code>&nbsp;&nbsp;constructor(logger) { this.logger = logger; }</code><br/>
<code>&nbsp;&nbsp;run() { this.logger.log('running'); }</code><br/>
<code>}</code><br/>
ใช้งานจริง: <code>new TestRunner(realLogger)</code>, ใน unit test: <code>new TestRunner(fakeLogger)</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เขียน <code>this.logger = new ConcreteLogger()</code> ไว้ข้างใน constructor — ดูเหมือนใช้งานได้ปกติ แต่ทดสอบ class นี้แบบแยกเดี่ยว (unit test) แทบเป็นไปไม่ได้เพราะ dependency ถูกผูกตายตัวไว้ข้างใน`,
    example: `const realLogger = { log: (msg) => console.log(msg) };
const runner = new TestRunner(realLogger);
runner.run();`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>constructor(logger)</code> เก็บ logger ที่ inject เข้ามาไว้ที่ <code>this.logger</code> (ห้าม <code>new</code> logger เองข้างใน)<br/>
    2. <code>run()</code> เรียก <code>this.logger.log(...)</code> ผ่าน logger ที่ inject เข้ามา`
  },
  {
    id: "oop_factory_pattern",
    meta: "บทที่ 17",
    title: "Design Pattern: Factory",
    template: `// สถานการณ์: ต้องสร้าง test user หลายประเภท (admin/guest) โดยไม่ให้ code เรียก new TestUser(...) กระจัดกระจายทั่ว test suite
// 1. เขียน class TestUser { constructor(username, role) { this.username = username; this.role = role; } }
// 2. เขียน class TestUserFactory ที่มี static method create(type) คืนค่า TestUser
//    ถ้า type === 'admin' คืนค่า TestUser ที่ username 'admin_user', role 'admin'
//    ถ้า type === 'guest' คืนค่า TestUser ที่ username 'guest_user', role 'guest'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Factory Pattern ด้วยการรันจริง...");
      const [TestUser, TestUserFactory] = getLearnerClasses(code, ["TestUser", "TestUserFactory"]);

      const admin = TestUserFactory.create('admin');
      const guest = TestUserFactory.create('guest');

      if (!(admin instanceof TestUser) || !(guest instanceof TestUser)) {
        throw new Error("TestUserFactory.create() ต้องคืนค่าเป็น instance ของ TestUser จริง (new TestUser(...)) ไม่ใช่ plain object ที่หน้าตาคล้ายกัน");
      }
      if (!admin || admin.role !== 'admin') {
        throw new Error(`TestUserFactory.create('admin') ต้องคืนค่า user ที่มี role เป็น 'admin' แต่ได้ ${admin && admin.role}`);
      }
      if (!guest || guest.role !== 'guest') {
        throw new Error(`TestUserFactory.create('guest') ต้องคืนค่า user ที่มี role เป็น 'guest' แต่ได้ ${guest && guest.role}`);
      }
      if (admin.username === guest.username) {
        throw new Error("create('admin') และ create('guest') ต้องคืนค่า user คนละคนกัน (username ต้องไม่เหมือนกัน)");
      }
      log(`✓ TestUserFactory.create() สร้าง TestUser instance ต่างชนิดกันจริงตาม type: admin=${admin.username}, guest=${guest.username}`);
    },
    hint: "static create(type) { if (type === 'admin') return new TestUser('admin_user', 'admin'); if (type === 'guest') return new TestUser('guest_user', 'guest'); }",
    solution: `class TestUser {
  constructor(username, role) {
    this.username = username;
    this.role = role;
  }
}

class TestUserFactory {
  static create(type) {
    if (type === 'admin') {
      return new TestUser('admin_user', 'admin');
    }
    if (type === 'guest') {
      return new TestUser('guest_user', 'guest');
    }
    throw new Error('unknown type: ' + type);
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Factory Pattern</strong> — รวมศูนย์ logic การสร้าง object ที่มีหลายชนิดไว้ที่จุดเดียว<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>แทนที่จะเรียก <code>new TestUser(...)</code> กระจัดกระจายทั่ว test suite (ต้องจำ argument ที่ถูกต้องของแต่ละ role เอง) ให้ <code>TestUserFactory.create(type)</code> เป็นจุดเดียวที่รู้ว่าแต่ละ type ต้องการ argument อะไรบ้าง — แก้ logic การสร้างที่จุดเดียว ไม่ต้องไล่แก้ทุก test file<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>static create(type) {</code><br/>
<code>&nbsp;&nbsp;if (type === 'admin') return new TestUser(...);</code><br/>
<code>&nbsp;&nbsp;if (type === 'guest') return new TestUser(...);</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> Factory ที่คืนค่าเหมือนกันทุก type (ไม่ได้แยก logic จริง) ไม่ใช่ factory pattern จริง — แค่ wrapper เปล่าๆ`,
    example: `const admin = TestUserFactory.create('admin');
const guest = TestUserFactory.create('guest');`,
    task: `จงเขียน 2 class ให้สมบูรณ์:<br/>
    1. <code>TestUser</code><br/>
    2. <code>TestUserFactory</code> มี <code>static create(type)</code> คืนค่า user ต่างกันตาม <code>'admin'</code>/<code>'guest'</code>`
  },
  {
    id: "oop_singleton_pattern",
    meta: "บทที่ 18",
    title: "Design Pattern: Singleton",
    template: `// สถานการณ์: config ของ test suite ควรมีแค่ instance เดียวทั้งโปรเจก ไม่ว่าจะเรียกกี่ครั้งก็ตาม
// 1. เขียน class ConfigManager ที่มี static method getInstance()
//    ต้องคืนค่า instance เดียวกันทุกครั้งที่เรียก ไม่ว่าจะเรียกกี่ครั้งก็ตาม
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Singleton Pattern ด้วยการรันจริง (identity check)...");
      const ConfigManager = getLearnerClass(code, "ConfigManager");

      if (typeof ConfigManager.getInstance !== "function") {
        throw new Error("ไม่พบ static method ConfigManager.getInstance()");
      }

      const a = ConfigManager.getInstance();
      const b = ConfigManager.getInstance();
      const c = ConfigManager.getInstance();

      if (!(a instanceof ConfigManager)) {
        throw new Error("ConfigManager.getInstance() ต้องคืนค่าเป็น instance ของ ConfigManager จริง (new ConfigManager()) — ไม่ใช่ undefined/null/object อื่น");
      }
      if (a !== b || b !== c) {
        throw new Error("ConfigManager.getInstance() ต้องคืนค่า instance เดียวกันทุกครั้ง (===) แต่ได้ instance คนละตัวกัน — ต้องเก็บ instance ที่สร้างแล้วไว้ใช้ซ้ำ ไม่สร้างใหม่ทุกครั้ง");
      }
      log("✓ ConfigManager.getInstance() คืนค่า instance เดียวกันจริง (identity เท่ากันทั้ง 3 ครั้ง)");
    },
    hint: "เก็บ instance ไว้ใน static field: static #instance = null; static getInstance() { if (!ConfigManager.#instance) { ConfigManager.#instance = new ConfigManager(); } return ConfigManager.#instance; }",
    solution: `class ConfigManager {
  static #instance = null;

  static getInstance() {
    if (!ConfigManager.#instance) {
      ConfigManager.#instance = new ConfigManager();
    }
    return ConfigManager.#instance;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Singleton Pattern</strong> — รับประกันว่ามี instance เดียวเท่านั้นทั้งโปรแกรม<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Singleton ใช้เมื่อต้องการ shared state เดียวทั้งระบบ (เช่น config, connection pool) — เก็บ instance ที่สร้างแล้วไว้ใน static field แล้วเช็คก่อนว่ามีอยู่แล้วหรือยังก่อนสร้างใหม่ ถ้ามีแล้วคืนตัวเดิม<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>static #instance = null;</code><br/>
<code>static getInstance() {</code><br/>
<code>&nbsp;&nbsp;if (!this.#instance) this.#instance = new ConfigManager();</code><br/>
<code>&nbsp;&nbsp;return this.#instance;</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมเช็คว่ามี instance อยู่แล้วหรือยัง แล้ว <code>return new ConfigManager()</code> ตรงๆ ทุกครั้ง — จะได้ instance คนละตัวกันทุกครั้งที่เรียก ไม่ใช่ singleton จริง (regex เช็คว่ามีคำว่า getInstance ผ่านได้ แต่พฤติกรรมผิด บทเรียนนี้จึงต้องรันโค้ดจริงเช็ค identity)`,
    example: `const a = ConfigManager.getInstance();
const b = ConfigManager.getInstance();
console.log(a === b); // true`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>class ConfigManager</code> มี <code>static getInstance()</code><br/>
    2. เรียกกี่ครั้งก็ต้องได้ instance เดียวกัน (<code>===</code>)`
  },
  {
    id: "oop_builder_pattern",
    meta: "บทที่ 19",
    title: "Design Pattern: Builder",
    template: `// สถานการณ์: ต้องสร้าง test data object ที่มีหลาย field แบบ chain method อ่านง่าย แทนการส่ง argument ยาวๆ
// 1. เขียน class TestDataBuilder ที่มี method setName(name), setEmail(email) แต่ละ method return this (เพื่อ chain ได้)
// 2. เขียน method build() ที่คืนค่า object { name, email } ตามที่ set ไว้
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Builder Pattern ด้วยการรันจริง...");
      const TestDataBuilder = getLearnerClass(code, "TestDataBuilder");

      const result = new TestDataBuilder()
        .setName('Alice')
        .setEmail('alice@example.com')
        .build();

      if (!result || result.name !== 'Alice') {
        throw new Error(`build() ต้องคืนค่า object ที่มี name เป็น 'Alice' แต่ได้ ${JSON.stringify(result)}`);
      }
      if (result.email !== 'alice@example.com') {
        throw new Error(`build() ต้องคืนค่า object ที่มี email เป็น 'alice@example.com' แต่ได้ ${JSON.stringify(result)}`);
      }
      log(`✓ chain .setName().setEmail().build() ให้ผลลัพธ์ที่ set ไว้จริง: ${JSON.stringify(result)}`);
    },
    hint: "setName(name) { this.name = name; return this; } — ต้อง return this ทุก setter method ถึงจะ chain ต่อกันได้ แล้ว build() { return { name: this.name, email: this.email }; }",
    solution: `class TestDataBuilder {
  setName(name) {
    this.name = name;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  build() {
    return { name: this.name, email: this.email };
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Builder Pattern</strong> — สร้าง object ทีละส่วนผ่าน method chain ที่อ่านง่าย<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>แทนที่จะส่ง constructor argument ยาวๆ (<code>new TestData('Alice', 'a@x.com', true, false, ...)</code> ที่จำลำดับไม่ได้) แต่ละ setter method คืนค่า <code>this</code> กลับมา ทำให้ chain ต่อกันได้เรื่อยๆ อ่านง่ายว่า set อะไรไปบ้าง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>setName(name) { this.name = name; return this; }</code><br/>
เรียกใช้: <code>new Builder().setName('A').setEmail('b').build()</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม <code>return this</code> ใน setter method จะทำให้ chain ต่อไม่ได้ (method ถัดไปจะเรียกบน <code>undefined</code> แทน)`,
    example: `const data = new TestDataBuilder()
  .setName('Bob')
  .setEmail('bob@example.com')
  .build();
// { name: 'Bob', email: 'bob@example.com' }`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>setName(name)</code> และ <code>setEmail(email)</code> ต้อง <code>return this</code><br/>
    2. <code>build()</code> คืนค่า <code>{ name, email }</code> ตามที่ set ไว้`
  },
  {
    id: "oop_observer_pattern",
    meta: "บทที่ 20",
    title: "Design Pattern: Observer",
    template: `// สถานการณ์: ต้องการให้ test suite แจ้งเตือนหลาย listener (เช่น reporter, logger) ทุกครั้งที่ test จบ โดยไม่ผูก listener ไว้ตายตัว
// 1. เขียน class TestSubject ที่มี method subscribe(fn) เก็บ fn ไว้ใน array ของ subscriber
// 2. เขียน method notify(data) ที่เรียกทุก subscriber ที่ subscribe ไว้ พร้อมส่ง data ให้แต่ละตัว
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Observer Pattern ด้วยการรันจริง...");
      const TestSubject = getLearnerClass(code, "TestSubject");

      const subject = new TestSubject();
      if (typeof subject.subscribe !== "function") {
        throw new Error("TestSubject ต้องมี method subscribe(fn)");
      }
      if (typeof subject.notify !== "function") {
        throw new Error("TestSubject ต้องมี method notify(data)");
      }

      const received1 = [];
      const received2 = [];
      subject.subscribe((data) => received1.push(data));
      subject.subscribe((data) => received2.push(data));

      subject.notify('test_finished');

      if (received1.length === 0 || received2.length === 0) {
        throw new Error("notify(data) ต้องเรียกทุก subscriber ที่ subscribe ไว้ (มี subscriber ที่ไม่ถูกเรียกเลย)");
      }
      if (received1[0] !== 'test_finished' || received2[0] !== 'test_finished') {
        throw new Error("notify(data) ต้องส่ง data ที่ได้รับไปให้ subscriber แต่ละตัวจริง");
      }
      log(`✓ subscribe() 2 ตัว แล้ว notify() เรียกครบทั้งคู่พร้อม data ที่ถูกต้อง`);
    },
    hint: "subscribe(fn) { this.subscribers = this.subscribers || []; this.subscribers.push(fn); } แล้ว notify(data) { this.subscribers.forEach(fn => fn(data)); }",
    solution: `class TestSubject {
  subscribe(fn) {
    this.subscribers = this.subscribers || [];
    this.subscribers.push(fn);
  }

  notify(data) {
    (this.subscribers || []).forEach((fn) => fn(data));
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Observer Pattern</strong> — แจ้งเตือนหลาย listener เมื่อมีเหตุการณ์เกิดขึ้น โดยไม่ผูก listener ไว้ตายตัว<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>subscribe(fn)</code> ให้ใครก็ได้มา "สมัคร" รับข่าวสารโดยไม่ต้องแก้โค้ดของ <code>TestSubject</code> เอง — <code>notify(data)</code> คือจุดที่ประกาศเหตุการณ์แล้วบอกทุก subscriber พร้อมกัน เหมาะกับ test suite ที่อยากให้ reporter/logger/notifier หลายตัวรู้ว่า test จบแล้วพร้อมกัน โดยไม่ต้องเรียกแต่ละตัวเองทีละบรรทัด<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>subject.subscribe(data => console.log('reporter:', data));</code><br/>
<code>subject.subscribe(data => console.log('logger:', data));</code><br/>
<code>subject.notify('done'); // ทั้งสอง callback ถูกเรียก</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมเก็บ subscriber ไว้ใน array แล้วเขียนแบบเก็บได้แค่ตัวเดียว (<code>this.subscriber = fn</code>) — subscribe ครั้งที่สองจะทับตัวแรกทิ้งไปเลย ไม่ใช่ observer pattern จริง`,
    example: `const subject = new TestSubject();
subject.subscribe(data => console.log('got:', data));
subject.notify('test_finished');`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>subscribe(fn)</code> เก็บ fn ไว้ (รองรับหลายตัว)<br/>
    2. <code>notify(data)</code> เรียกทุก subscriber พร้อม data`
  },
  {
    id: "oop_strategy_pattern",
    meta: "บทที่ 21",
    title: "Design Pattern: Strategy",
    template: `// สถานการณ์: ต้องการสลับ "วิธี" ตัดสินใจว่าจะ retry test หรือไม่ ได้ตอน runtime โดยไม่แก้โค้ด RetryContext เอง
// 1. เขียน class RetryContext ที่ constructor รับ strategy (object ที่มี method shouldRetry(attempt))
// 2. เขียน method run(attempt) ที่คืนค่าผลจาก this.strategy.shouldRetry(attempt)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Strategy Pattern ด้วยการรันจริง...");
      const RetryContext = getLearnerClass(code, "RetryContext");

      const alwaysRetry = { shouldRetry: () => true };
      const neverRetry = { shouldRetry: () => false };

      const ctxA = new RetryContext(alwaysRetry);
      const ctxB = new RetryContext(neverRetry);

      if (typeof ctxA.run !== "function") {
        throw new Error("RetryContext ต้องมี method run(attempt)");
      }

      const resultA = ctxA.run(1);
      const resultB = ctxB.run(1);

      if (resultA !== true) {
        throw new Error(`ใช้ strategy ที่ shouldRetry คืนค่า true เสมอ แต่ run(1) ของ RetryContext คืนค่า ${resultA} — run() ต้อง delegate ไปที่ this.strategy.shouldRetry(attempt) จริง`);
      }
      if (resultB !== false) {
        throw new Error(`ใช้ strategy ที่ shouldRetry คืนค่า false เสมอ แต่ run(1) ของ RetryContext คืนค่า ${resultB} — run() ต้อง delegate ไปที่ this.strategy.shouldRetry(attempt) จริง`);
      }
      log("✓ สลับ strategy ตอน runtime ได้จริง — RetryContext พฤติกรรมเปลี่ยนตาม strategy ที่ inject เข้ามา");
    },
    hint: "constructor(strategy) { this.strategy = strategy; } แล้ว run(attempt) { return this.strategy.shouldRetry(attempt); }",
    solution: `class RetryContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  run(attempt) {
    return this.strategy.shouldRetry(attempt);
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Strategy Pattern</strong> — สลับ "อัลกอริทึม/วิธีตัดสินใจ" ได้ตอน runtime โดยไม่ต้องแก้โค้ดของ context เอง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>RetryContext</code> ไม่รู้เลยว่า "วิธี" ตัดสินใจ retry เป็นแบบไหน — มันแค่รับ <code>strategy</code> object ที่มี <code>shouldRetry()</code> มาแล้วเรียกใช้ ถ้าอยากเปลี่ยนนโยบาย retry (เช่น retry เฉพาะ network error, หรือ retry สูงสุด 3 ครั้ง) แค่ inject strategy object คนละตัว ไม่ต้องแก้ <code>RetryContext</code> เลย<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const ctx = new RetryContext({ shouldRetry: (n) => n < 3 });</code><br/>
<code>ctx.run(1); // delegate ไปที่ strategy ที่ inject เข้ามา</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เขียน logic การตัดสินใจ (if/else หลายเงื่อนไข) ฝังไว้ใน <code>RetryContext</code> ตรงๆ แทนที่จะ delegate ไปที่ <code>strategy</code> — ทำให้เพิ่มนโยบายใหม่ต้องแก้ <code>RetryContext</code> ทุกครั้ง เหมือนกลับไปละเมิด OCP ซ้ำอีก`,
    example: `const strategy = { shouldRetry: (attempt) => attempt < 3 };
const ctx = new RetryContext(strategy);
ctx.run(1); // true`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>constructor(strategy)</code> เก็บ strategy ไว้<br/>
    2. <code>run(attempt)</code> delegate ไปที่ <code>this.strategy.shouldRetry(attempt)</code>`
  },
  {
    id: "oop_adapter_pattern",
    meta: "บทที่ 22",
    title: "Design Pattern: Adapter",
    template: `// สถานการณ์: มี OldDriver เดิม (สมมติว่าประกาศไว้ในโค้ดของคุณ) มี method execute(cmd) เท่านั้น
// แต่โค้ดใหม่ในระบบคาดหวัง interface ที่มี method run(cmd) แทน — เขียน Adapter มาแปลงให้เข้ากันโดยไม่แก้ OldDriver
// 1. เขียน class DriverAdapter ที่ constructor รับ oldDriver instance เก็บไว้
// 2. เขียน method run(cmd) ที่เรียก this.oldDriver.execute(cmd) แล้วคืนค่าผลลัพธ์กลับไป
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Adapter Pattern ด้วยการรันจริง...");
      const DriverAdapter = getLearnerClass(code, "DriverAdapter");

      const calls = [];
      const fakeOldDriver = {
        execute: (cmd) => {
          calls.push(cmd);
          return 'executed:' + cmd;
        },
      };

      const adapter = new DriverAdapter(fakeOldDriver);
      if (typeof adapter.run !== "function") {
        throw new Error("DriverAdapter ต้องมี method run(cmd)");
      }

      const result = adapter.run('click');
      if (calls.length === 0 || calls[0] !== 'click') {
        throw new Error("run(cmd) ต้องเรียก this.oldDriver.execute(cmd) จริง โดยส่ง cmd เดิมต่อไปให้");
      }
      if (result !== 'executed:click') {
        throw new Error(`run(cmd) ต้องคืนค่าผลลัพธ์จาก oldDriver.execute(cmd) กลับไปด้วย แต่ได้ ${JSON.stringify(result)}`);
      }
      log("✓ DriverAdapter แปลง run(cmd) เป็น oldDriver.execute(cmd) ได้จริง โดยไม่แก้ OldDriver เดิม");
    },
    hint: "constructor(oldDriver) { this.oldDriver = oldDriver; } แล้ว run(cmd) { return this.oldDriver.execute(cmd); }",
    solution: `class DriverAdapter {
  constructor(oldDriver) {
    this.oldDriver = oldDriver;
  }

  run(cmd) {
    return this.oldDriver.execute(cmd);
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Adapter Pattern</strong> — แปลง interface เก่าที่เข้ากันไม่ได้ ให้ใช้กับโค้ดใหม่ได้โดยไม่ต้องแก้ของเดิม<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>OldDriver</code> มี <code>execute(cmd)</code> แต่โค้ดใหม่ทั้งระบบเรียกผ่าน <code>run(cmd)</code> — แทนที่จะไปแก้ <code>OldDriver</code> เดิม (อาจกระทบโค้ดอื่นที่ใช้ <code>execute</code> อยู่แล้ว) เขียน <code>DriverAdapter</code> มาห่อ <code>OldDriver</code> ไว้ แปลง <code>run()</code> ให้เรียก <code>execute()</code> ข้างในแทน — ของเดิมไม่ต้องแตะเลย<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class DriverAdapter {</code><br/>
<code>&nbsp;&nbsp;constructor(oldDriver) { this.oldDriver = oldDriver; }</code><br/>
<code>&nbsp;&nbsp;run(cmd) { return this.oldDriver.execute(cmd); }</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม forward ค่า return กลับจาก method เดิม (เรียก <code>execute()</code> แต่ไม่ <code>return</code> ผลลัพธ์) — caller ที่เรียกผ่าน adapter จะได้ <code>undefined</code> แทนที่จะได้ผลลัพธ์จริง`,
    example: `const oldDriver = { execute: (cmd) => 'ran:' + cmd };
const adapter = new DriverAdapter(oldDriver);
adapter.run('click'); // 'ran:click'`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>constructor(oldDriver)</code> เก็บ oldDriver ไว้<br/>
    2. <code>run(cmd)</code> เรียก <code>this.oldDriver.execute(cmd)</code> แล้ว return ผลลัพธ์กลับไป`
  },
  {
    id: "oop_decorator_pattern",
    meta: "บทที่ 23",
    title: "Design Pattern: Decorator",
    template: `// สถานการณ์: ต้องการเพิ่มพฤติกรรม "log ก่อน-หลัง" ให้ test step function ใดๆ โดยไม่ต้องแก้ function เดิม
// 1. เขียน function withLogging(fn, log) ที่คืนค่า function ใหม่
// 2. function ใหม่นี้: เรียก log('before') ก่อน, เรียก fn(...args) แล้วเก็บผลลัพธ์, เรียก log('after'), แล้ว return ผลลัพธ์ของ fn
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Decorator Pattern ด้วยการรันจริง...");
      const withLogging = execLearnerCode(code, {}, `typeof withLogging === "function" ? withLogging : undefined`);
      if (typeof withLogging !== "function") {
        throw new Error("ไม่พบการประกาศ function withLogging(fn, log)");
      }

      const original = (x) => x * 2;
      const logs = [];
      const wrapped = withLogging(original, (msg) => logs.push(msg));

      if (typeof wrapped !== "function") {
        throw new Error("withLogging(fn, log) ต้องคืนค่าเป็น function ใหม่");
      }

      const result = wrapped(5);

      if (result !== 10) {
        throw new Error(`function ที่ decorate แล้วต้องยังคืนค่าเดิมจาก fn ที่ห่อไว้ (original(5) = 10) แต่ได้ ${result}`);
      }
      if (logs.length !== 2 || logs[0] !== 'before' || logs[1] !== 'after') {
        throw new Error(`ต้องเรียก log('before') ก่อนเรียก fn และ log('after') หลังเรียก fn เสมอ แต่ log ที่บันทึกได้คือ ${JSON.stringify(logs)}`);
      }
      log(`✓ withLogging() เพิ่มพฤติกรรม log ก่อน-หลังได้จริง โดยผลลัพธ์เดิมของ fn ยังถูกต้อง: ${JSON.stringify(logs)} -> ${result}`);
    },
    hint: "function withLogging(fn, log) { return (...args) => { log('before'); const result = fn(...args); log('after'); return result; }; }",
    solution: `function withLogging(fn, log) {
  return (...args) => {
    log('before');
    const result = fn(...args);
    log('after');
    return result;
  };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Decorator Pattern</strong> — ห่อ function/object เดิมเพื่อเพิ่มพฤติกรรม โดยไม่แก้ของเดิมและผลลัพธ์เดิมยังใช้งานได้ปกติ<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>withLogging(fn, log)</code> คืนค่า function ใหม่ที่ "ห่อ" fn เดิมไว้ — เพิ่ม logging ก่อน/หลังโดยที่ fn เดิมไม่ต้องรู้ตัวเลยว่าถูกห่ออยู่ ผลลัพธ์ที่ caller ได้รับยังคงเป็นผลลัพธ์จริงของ fn เดิม (transparent wrapping) — มีประโยชน์มากในงาน QA เช่น ห่อ test step function ด้วย retry/timing/logging โดยไม่แตะ step function เดิมเลย<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const wrapped = withLogging(originalFn, console.log);</code><br/>
<code>wrapped(5); // log('before') -> originalFn(5) -> log('after') -> return ผลลัพธ์</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม <code>return result;</code> ตอนท้าย (เรียก fn แต่ไม่ return ค่ากลับ) — caller ที่ใช้ function ที่ถูก decorate แล้วจะได้ <code>undefined</code> แทนที่จะได้ผลลัพธ์จริงของ fn ที่ห่อไว้ ทำลาย "transparency" ที่ decorator ต้องมี`,
    example: `const logged = withLogging((x) => x + 1, msg => console.log(msg));
logged(5); // logs 'before', 'after', returns 6`,
    task: `จงเขียน function ให้สมบูรณ์ โดย:<br/>
    1. <code>withLogging(fn, log)</code> คืนค่า function ใหม่<br/>
    2. function ใหม่ต้องเรียก <code>log('before')</code>, เรียก <code>fn(...args)</code>, เรียก <code>log('after')</code>, แล้ว return ผลลัพธ์ของ fn`
  },
  {
    id: "oop_static_members",
    meta: "บทที่ 24",
    title: "Static Members",
    template: `// สถานการณ์: ต้องการนับว่าสร้าง TestCase instance ไปทั้งหมดกี่ตัวแล้ว ทุก instance ควรเห็นเลขเดียวกัน (shared, ไม่ใช่ per-instance)
// 1. เขียน class TestCase ที่มี static totalCreated เริ่มต้นที่ 0
// 2. ทุกครั้งที่สร้าง instance ใหม่ (ใน constructor) ให้เพิ่มค่า TestCase.totalCreated ขึ้น 1
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Static Members ด้วยการรันจริง (นับ instance จริง)...");
      const TestCase = getLearnerClass(code, "TestCase");

      if (typeof TestCase.totalCreated !== "number") {
        throw new Error("ไม่พบ static field totalCreated ที่เป็นตัวเลข");
      }
      const before = TestCase.totalCreated;
      new TestCase();
      new TestCase();
      new TestCase();
      const after = TestCase.totalCreated;

      if (after !== before + 3) {
        throw new Error(`สร้าง instance ใหม่ 3 ตัว แต่ TestCase.totalCreated เพิ่มจาก ${before} เป็น ${after} (ควรเพิ่มขึ้น 3 พอดี) — เช็คว่า constructor เพิ่มค่า static field ทุกครั้งที่สร้าง instance หรือไม่`);
      }
      log(`✓ TestCase.totalCreated นับ instance จริงถูกต้อง: ${before} -> ${after}`);
    },
    hint: "static totalCreated = 0; constructor() { TestCase.totalCreated++; }",
    solution: `class TestCase {
  static totalCreated = 0;

  constructor() {
    TestCase.totalCreated++;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ <strong>Static Members</strong> — field/method ที่เป็นของ class เอง ไม่ใช่ของแต่ละ instance<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>static</code> field ถูก share ระหว่างทุก instance ของ class นั้น — เหมาะกับการนับจำนวน, เก็บ config ร่วม, หรือ cache ที่ไม่ควรผูกกับ instance ใดตัวหนึ่ง เข้าถึงผ่านชื่อ class ตรงๆ (<code>TestCase.totalCreated</code>) ไม่ใช่ผ่าน instance (<code>this.totalCreated</code> จะเป็นคนละตัวกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>class TestCase {</code><br/>
<code>&nbsp;&nbsp;static totalCreated = 0;</code><br/>
<code>&nbsp;&nbsp;constructor() { TestCase.totalCreated++; }</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เผลอเขียน <code>this.totalCreated++</code> แทน <code>TestCase.totalCreated++</code> — จะสร้าง instance property ใหม่แยกของแต่ละ instance แทนที่จะแชร์ค่าเดียวกันข้าม instance (regex เห็นคำว่า totalCreated ผ่านได้ แต่ค่าจริงไม่ share กัน จึงต้องรันโค้ดจริงนับ)`,
    example: `new TestCase();
new TestCase();
console.log(TestCase.totalCreated); // 2`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. <code>static totalCreated = 0;</code><br/>
    2. เพิ่มค่าใน constructor ทุกครั้งที่สร้าง instance ใหม่`
  },
  {
    id: "oop_capstone_mini",
    meta: "บทปิดท้าย",
    title: "Mini Capstone: รวม Factory + Singleton + Builder",
    template: `// สถานการณ์ (Capstone เล็กๆ ปิดท้ายเทรคนี้): สร้าง TestSuiteRunner ที่รวม 3 pattern เข้าด้วยกัน
// 1. เขียน class TestSuiteRunner ที่มี static getInstance() คืนค่า instance เดียวกันเสมอ (Singleton)
// 2. instance มี method addTest(name) ที่เก็บชื่อ test ไว้ใน this.tests (array) แล้ว return this (Builder-style chain)
// 3. เขียน static method create(names) (Factory) ที่รับ array ของชื่อ test แล้วคืนค่า instance
//    ของ TestSuiteRunner (ผ่าน getInstance()) ที่ addTest ทุกชื่อใน names เรียบร้อยแล้ว
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Mini Capstone ด้วยการรันจริง...");
      const TestSuiteRunner = getLearnerClass(code, "TestSuiteRunner");

      if (typeof TestSuiteRunner.getInstance !== "function") {
        throw new Error("ไม่พบ static method getInstance()");
      }
      const a = TestSuiteRunner.getInstance();
      const b = TestSuiteRunner.getInstance();
      if (a !== b) {
        throw new Error("getInstance() ต้องคืนค่า instance เดียวกันทุกครั้ง (Singleton)");
      }

      if (typeof a.addTest !== "function") {
        throw new Error("instance ต้องมี method addTest(name)");
      }
      const chainResult = a.addTest('login_test');
      if (chainResult !== a) {
        throw new Error("addTest(name) ต้อง return this เพื่อ chain ต่อได้ (Builder-style)");
      }
      if (!Array.isArray(a.tests) || !a.tests.includes('login_test')) {
        throw new Error("addTest(name) ต้องเก็บชื่อ test ไว้ใน this.tests (array)");
      }

      if (typeof TestSuiteRunner.create !== "function") {
        throw new Error("ไม่พบ static method create(names) (Factory)");
      }
      const runner = TestSuiteRunner.create(['test_a', 'test_b']);
      if (!(runner instanceof TestSuiteRunner)) {
        throw new Error("create(names) ต้องคืนค่า instance ของ TestSuiteRunner");
      }
      if (!runner.tests.includes('test_a') || !runner.tests.includes('test_b')) {
        throw new Error("create(names) ต้อง addTest ทุกชื่อใน names ให้ครบ");
      }
      if (runner !== TestSuiteRunner.getInstance()) {
        throw new Error("create(names) ต้องใช้ instance เดียวกันจาก getInstance() (Singleton) ไม่ใช่สร้าง instance ใหม่แยก");
      }
      log(`✓ Factory + Singleton + Builder ทำงานร่วมกันถูกต้อง: tests=${JSON.stringify(runner.tests)}`);
    },
    hint: "getInstance() เก็บ instance เดียวใน static field. addTest(name) { this.tests = this.tests || []; this.tests.push(name); return this; }. static create(names) { const r = TestSuiteRunner.getInstance(); names.forEach(n => r.addTest(n)); return r; }",
    solution: `class TestSuiteRunner {
  static #instance = null;

  static getInstance() {
    if (!TestSuiteRunner.#instance) {
      TestSuiteRunner.#instance = new TestSuiteRunner();
    }
    return TestSuiteRunner.#instance;
  }

  addTest(name) {
    this.tests = this.tests || [];
    this.tests.push(name);
    return this;
  }

  static create(names) {
    const runner = TestSuiteRunner.getInstance();
    names.forEach((n) => runner.addTest(n));
    return runner;
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ผสาน 3 pattern ที่เรียนมา (Factory, Singleton, Builder) เข้าด้วยกันในสถานการณ์เดียว ปิดท้าย OOP Fundamentals track<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Singleton</strong> รับประกันมี TestSuiteRunner ตัวเดียวทั้งโปรแกรม, <strong>Builder</strong> (<code>addTest</code> คืนค่า <code>this</code>) ทำให้เพิ่ม test ทีละตัวแบบ chain ได้, <strong>Factory</strong> (<code>create(names)</code>) เป็นทางลัดสร้าง/เติม suite จาก array ชื่อในคำสั่งเดียว โดยทั้งหมดยังอ้างถึง instance เดียวกันผ่าน Singleton<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>รวม 3 pattern: <code>getInstance()</code> (Singleton) + <code>.addTest().addTest()</code> (Builder chain) + <code>create(names)</code> (Factory ที่ wrap ทั้งสองอย่าง)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>create(names)</code> เผลอสร้าง <code>new TestSuiteRunner()</code> เองตรงๆ แทนที่จะผ่าน <code>getInstance()</code> — จะทำลาย Singleton guarantee ทันที (ได้ instance คนละตัวกับที่ getInstance() คืนไปก่อนหน้า)`,
    example: `const runner = TestSuiteRunner.create(['smoke_test', 'regression_test']);
console.log(runner.tests); // ['smoke_test', 'regression_test']
console.log(runner === TestSuiteRunner.getInstance()); // true`,
    task: `จงเขียน class <code>TestSuiteRunner</code> ให้สมบูรณ์ รวม 3 pattern:<br/>
    1. <code>static getInstance()</code> — Singleton<br/>
    2. <code>addTest(name)</code> return <code>this</code> — Builder chain<br/>
    3. <code>static create(names)</code> — Factory ที่ใช้ instance เดียวกันจาก getInstance()`
  },

  // ==========================================
  // PART 2: PRODUCTION FRAMEWORK ARCHITECTURE
  // ==========================================
  {
    id: "fwk_intro",
    meta: "Framework 1",
    title: "ทำไมต้องออกแบบ Framework: ปัญหาของ \"ไฟล์เดียวยาวเป็นพันบรรทัด\"",
    template: `// สถานการณ์: playwright.config.ts เป็นจุดตั้งค่ากลางของทั้งโปรเจก test
// 1. กำหนด baseURL ให้ config ชี้ไปที่ 'http://localhost:5173' (URL ของ My-Investment-Port ตอน dev)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า baseURL...");
      const clean = stripComments(code);
      const hasBaseURL = /use\s*:\s*\{[\s\S]*?baseURL:\s*['"]http:\/\/localhost:5173['"][\s\S]*?\}/.test(clean);
      if (!hasBaseURL) {
        throw new Error("ยังไม่พบการกำหนดค่า baseURL ให้ตรงกับที่ระบุในโจทย์ ภายใน use ของ defineConfig");
      }
      log("✓ ตั้งค่า baseURL ถูกต้อง");
    },
    hint: "ค่า baseURL เป็น property หนึ่งภายใน use: { } ของ defineConfig() ต้องเป็น string URL ที่ล้อมด้วย quote ให้ตรงกับ URL ของ dev server เป๊ะ",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
  },
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Test Automation Framework Design</strong> คือการตัดสินใจว่าจะจัดโครงสร้างโปรเจก test อย่างไร ไม่ใช่แค่ "เขียน test แต่ละบทให้ผ่าน" (ซึ่งเป็นสิ่งที่ track อื่นๆ ในคอร์สนี้สอนไปแล้ว) — ปัญหาที่พบบ่อยเมื่อโปรเจก test โตขึ้น: ทุกคนเขียน test ไฟล์ใหม่แบบ copy-paste จากไฟล์เก่า ไม่มีจุดรวมศูนย์ของ config/helper สุดท้ายกลายเป็น "โค้ดซ้ำกระจายไปทุกที่" แก้จุดเดียวต้องไล่แก้เป็นสิบไฟล์<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทเรียนที่เหลือในเทรคนี้จะครอบคลุม: Custom Fixtures, โครงสร้างโฟลเดอร์, การลดโค้ดซ้ำแบบ DRY, การจัดการ Test Data, และการตั้งค่า Reporting<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>playwright.config.ts</code> คือจุดตั้งค่ากลางของทั้งโปรเจก — <code>baseURL</code> ทำให้ทุก test เขียน <code>page.goto('/watchlist')</code> แทนที่จะต้องพิมพ์ URL เต็มซ้ำทุกไฟล์ (<code>page.goto('http://localhost:5173/watchlist')</code>) — ถ้าวันหนึ่ง URL เปลี่ยน (deploy ไป staging environment) แก้ที่ config จุดเดียวจบ ไม่ต้องไล่แก้ทุก test file<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใส่ <code>baseURL</code> ไว้นอก <code>use: { ... }</code> block (เช่นแปะไว้ระดับบนสุดของ <code>defineConfig()</code> ตรงๆ) จะไม่มีผลอะไรเลย เพราะ Playwright อ่านค่านี้จากภายใน <code>use</code> เท่านั้น และต้องมี <code>http://</code> นำหน้าเสมอให้ตรงกับพอร์ตจริงของ dev server`,
    example: `// ตัวอย่าง config เพิ่มเติมที่ใช้บ่อย
export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  retries: 2,
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า <code>baseURL: 'http://localhost:5173'</code> ใน <code>use</code> block`
  },
  {
    id: "fwk_custom_fixtures",
    meta: "Framework 2",
    title: "Custom Fixtures: ฉีดค่าที่ Test ต้องใช้ซ้ำๆ โดยไม่ต้อง Setup เอง",
    template: `// สถานการณ์: หลาย test ต้องการหน้า Watchlist ที่ seed ข้อมูลไว้แล้วเสมอ
// เขียน beforeEach ซ้ำทุกไฟล์เป็นภาระ — ใช้ custom fixture แทน
// 1. สร้าง custom fixture ชื่อ 'watchlistPage' ที่ goto('/watchlist') ให้อัตโนมัติก่อนส่งต่อให้ test
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการสร้าง Custom Fixture...");
      const clean = stripComments(code);
      const hasExtend = /\.extend\(/.test(clean);
      if (!hasExtend) {
        throw new Error("ไม่พบการใช้ test.extend()");
      }
      // Anchor goto/use to be INSIDE the watchlistPage fixture body itself, not just
      // floating anywhere else in the file — prevents passing via scattered snippets.
      const fixtureMatch = /watchlistPage\s*:\s*async\s*\(\s*\{[^)]*page[^)]*\}\s*,\s*use\s*\)\s*=>\s*\{([\s\S]*?)\}/.exec(clean);
      if (!fixtureMatch) {
        throw new Error("ไม่พบการประกาศ fixture ชื่อ watchlistPage ในรูปแบบฟังก์ชัน async ที่รับ page และ use ตามแบบแผนของ Playwright fixture");
      }
      const body = fixtureMatch[1];
      if (!/goto\(\s*['"]\/watchlist['"]\s*\)/.test(body)) {
        throw new Error("fixture watchlistPage ยังไม่ได้ไปที่หน้าที่ระบุในโจทย์ ภายในตัว fixture เอง");
      }
      if (!/await\s+use\(/.test(body)) {
        throw new Error("fixture watchlistPage ยังไม่ได้ส่งค่ากลับไปให้ test ผ่าน use() ภายในตัว fixture เอง");
      }
      log("✓ สร้าง Custom Fixture ถูกต้อง");
    },
    hint: "ใช้ pattern base.extend({ ชื่อ fixture: async ({ page }, use) => { ... } }) — ภายใน fixture ให้ goto หน้าที่ต้องการก่อน แล้วค่อย await use(page) เพื่อส่งค่าต่อให้ test ใช้งาน",
    solution: `import { test as base } from '@playwright/test';

export const test = base.extend({
  watchlistPage: async ({ page }, use) => {
    await page.goto('/watchlist');
    await use(page);
  },
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Fixture</strong> ของ Playwright คือกลไก "เตรียมของให้ก่อน test เริ่ม แล้วเก็บกวาดให้หลัง test จบ" — <code>page</code>, <code>request</code>, <code>context</code> ที่ใช้กันมาตลอดทั้งคอร์สนี้ ล้วนเป็น built-in fixture ทั้งหมด<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Fixture</strong> ของ Playwright คือกลไก "เตรียมของให้ก่อน test เริ่ม แล้วเก็บกวาดให้หลัง test จบ" — <code>page</code>, <code>request</code>, <code>context</code> ที่ใช้กันมาตลอดทั้งคอร์สนี้ ล้วนเป็น built-in fixture ทั้งหมด<br/><br/>
    <code>test.extend()</code> สร้าง fixture ของตัวเองเพิ่มได้ — ในตัวอย่างนี้ <code>watchlistPage</code> ทำ <code>goto('/watchlist')</code> ให้อัตโนมัติ<strong>ก่อน</strong>ที่ code ของ test จะเริ่มทำงาน แล้ว <code>await use(page)</code> คือจุดที่ "ส่งมอบ" ค่าที่เตรียมไว้กลับไปให้ test ใช้งานต่อ (โค้ดหลัง <code>use()</code> จะรันหลัง test จบ เหมาะกับ cleanup)<br/><br/>
    ประโยชน์เทียบกับเขียน <code>beforeEach</code> ซ้ำทุกไฟล์: fixture ประกาศครั้งเดียวในไฟล์กลาง แล้ว <code>import { test } from './fixtures'</code> ใช้ได้ทุกไฟล์ — ทุก test ที่รับ parameter <code>watchlistPage</code> จะได้หน้าที่ goto ไว้แล้วอัตโนมัติ ไม่ต้องเขียน <code>await page.goto('/watchlist')</code> ซ้ำเองในทุก test อีกต่อไป<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>export const test = base.extend({</code><br/>
<code>&nbsp;&nbsp;watchlistPage: async ({ page }, use) => {</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await page.goto('/watchlist');</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await use(page);</code><br/>
<code>&nbsp;&nbsp;},</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมเรียก <code>await use(page)</code> ในตัว fixture จะทำให้ test ที่ขอใช้ <code>watchlistPage</code> ไม่ได้ค่าอะไรเลย (fixture ต้อง "ส่งมอบ" ค่าผ่าน <code>use()</code> เสมอ จะ <code>return</code> ตรงๆ แบบฟังก์ชันปกติไม่ได้)`,
    example: `// ตัวอย่างการใช้งาน fixture ที่สร้างไว้ในไฟล์ test จริง
import { test } from './fixtures';
import { expect } from '@playwright/test';

test('เพิ่ม ticker ใหม่ใน watchlist', async ({ watchlistPage }) => {
  await watchlistPage.getByTestId('add-ticker-btn').click();
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ใช้ <code>test.extend()</code> สร้าง fixture ชื่อ <code>watchlistPage</code><br/>
    2. ให้ fixture ยิง <code>goto('/watchlist')</code> แล้ว <code>await use(page)</code> ส่งต่อ`
  },
  {
    id: "fwk_folder_organization",
    meta: "Framework 3",
    title: "โครงสร้างโฟลเดอร์: แยกหน้าที่ให้ชัด ไม่ใช่โยนทุกอย่างลงที่เดียว",
    template: `// สถานการณ์: กำลังจะสร้างโครงสร้างโฟลเดอร์สำหรับ automation project ใหม่
// 1. เขียน comment แสดงโครงสร้างโฟลเดอร์มาตรฐาน 4 โฟลเดอร์ (tests, pages, fixtures, utils - ใส่ / ต่อท้ายทุกชื่อ)
//    พร้อมอธิบายสั้นๆ ว่าแต่ละโฟลเดอร์เก็บอะไร
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบโครงสร้างโฟลเดอร์ที่ระบุ...");
      const hasTests = /\btests\//.test(code);
      const hasPages = /\bpages\//.test(code);
      const hasFixtures = /\bfixtures\//.test(code);
      const hasUtils = /\butils\//.test(code);
      if (!hasTests || !hasPages || !hasFixtures || !hasUtils) {
        throw new Error("ยังระบุโครงสร้างโฟลเดอร์มาตรฐานไม่ครบตามที่โจทย์กำหนด (ต้องมีทั้ง 4 ส่วน)");
      }
      log("✓ ระบุโครงสร้างโฟลเดอร์ครบถ้วนถูกต้อง");
    },
    hint: "นึกถึง 4 หน้าที่หลักของโปรเจก test: ที่เก็บตัว test เอง, ที่เก็บ Page Object ของแต่ละหน้า, ที่เก็บของที่ share ข้ามไฟล์แบบ fixture/seed data, และที่เก็บ helper function ทั่วไปที่ไม่ผูกกับหน้าไหน — ตั้งชื่อโฟลเดอร์ให้ตรงหน้าที่ อย่าลืมใส่ / ต่อท้ายทุกชื่อ",
    solution: `// โครงสร้างโฟลเดอร์มาตรฐานของ automation project
// tests/     - ไฟล์ .spec.ts ที่มีแต่ test case (สั้น อ่านง่าย ไม่มี logic ซับซ้อน)
// pages/     - Page Object class ของแต่ละหน้า (WatchlistPage.ts, LoginPage.ts)
// fixtures/  - custom fixture และ test data (seed data, mock response)
// utils/     - helper function ที่ใช้ร่วมกันข้ามไฟล์ (formatDate, generateTestEmail)`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ โครงสร้างโฟลเดอร์: แยกหน้าที่ให้ชัด ไม่ใช่โยนทุกอย่างลงที่เดียว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>โครงสร้างมาตรฐานที่ทีม Playwright ส่วนใหญ่ใช้ (สอดคล้องกับที่ track Playwright UI Testing สอน POM ไปแล้ว แต่ขยายให้เห็นภาพรวมทั้งโปรเจก):<br/><br/><br/>หลักการเลือกว่าโค้ดควรอยู่โฟลเดอร์ไหน: <strong>ถ้าโค้ดผูกกับหน้าเว็บหนึ่งหน้า → pages/, ถ้าเป็น setup ที่ test หลายไฟล์ใช้ร่วมกัน → fixtures/, ถ้าเป็น pure function ไม่ผูกกับ Playwright เลย → utils/</strong><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>// tests/     - ไฟล์ .spec.ts ที่มีแต่ test case</code><br/>
<code>// pages/     - Page Object class ของแต่ละหน้า</code><br/>
<code>// fixtures/  - custom fixture และ test data</code><br/>
<code>// utils/     - helper function ที่ใช้ร่วมกันข้ามไฟล์</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใส่ Page Object class ปนไว้ใน <code>tests/</code> โดยตรง (แทนที่จะแยกไปไว้ใน <code>pages/</code>) ทำให้ไฟล์ test ยาวและมี implementation detail ปนกับ test case จนแยกไม่ออกว่าอะไรคือ "สิ่งที่ทดสอบ" อะไรคือ "วิธี implement"`,
    example: `// ตัวอย่างโครงสร้างเต็มของโปรเจกจริง
// e2e/
//   tests/
//     watchlist.spec.ts
//     auth.spec.ts
//   pages/
//     WatchlistPage.ts
//   fixtures/
//     index.ts
//     seedData.ts
//   utils/
//     dateHelpers.ts
//   playwright.config.ts`,
    task: `จงเขียน comment ให้สมบูรณ์ โดยระบุโครงสร้างโฟลเดอร์มาตรฐานครบทั้ง 4 โฟลเดอร์: <code>tests/</code>, <code>pages/</code>, <code>fixtures/</code>, <code>utils/</code>`
  },
  {
    id: "fwk_reusable_helpers_dry",
    meta: "Framework 4",
    title: "DRY จริง: กรณีศึกษาจากคอร์สนี้เอง ที่เพิ่งรีแฟคเตอร์วันนี้",
    template: `// สถานการณ์จริง: ฟังก์ชันนี้คือของจริงจากหน้า dashboard รวมทุก track ของคอร์สนี้เอง (index.html)
// dashboard ต้องนับบทที่ผ่านแล้วของ 11 track ที่ไม่รู้จักกันเลย โดยไม่เขียนโค้ดนับแยกทีละ track
// กุญแจคือทุก track เก็บ key แบบเดียวกันเป๊ะ: "<prefix>_course_completed_<lessonId>" = 'true'
// เขียนฟังก์ชันเดียวที่รับแค่ prefix แล้วใช้ได้กับทุก track โดยไม่ต้องรู้ล่วงหน้าว่ามีบทอะไรบ้าง
// 1. วนลูปทุก key ใน localStorage ด้วย for (let i = 0; i < localStorage.length; i++)
// 2. นับเฉพาะ key ที่ขึ้นต้นด้วย \`\${prefix}_course_completed_\` และมีค่าเป็น 'true'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบฟังก์ชัน countCompletedLessons (รันจริงเพื่อตรวจพฤติกรรม)...");
      // Real execution instead of keyword-matching: a function that hard-codes a
      // return value or checks the wrong variable would pass a text-only regex
      // check, but fails here because we actually call it against fake data.
      const data = {
        fwk_course_completed_intro: "true",
        fwk_course_completed_custom_fixtures: "true",
        fwk_course_completed_folder_organization: "false",
        other_course_completed_intro: "true",
        fwk_course_completed_reporting_config: "true",
      };
      let fn;
      try {
        fn = execLearnerCode(
          code,
          { localStorage: makeFakeLocalStorage(data) },
          'typeof countCompletedLessons === "function" ? countCompletedLessons : undefined'
        );
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
      }
      if (typeof fn !== "function") {
        throw new Error("ไม่พบการประกาศ function countCompletedLessons(prefix) ที่ทำงานได้จริง");
      }
      const fwkCount = fn("fwk");
      if (fwkCount !== 3) {
        throw new Error(`countCompletedLessons('fwk') ควรนับได้ 3 รายการ ตรวจสอบเงื่อนไขการกรอง key และค่าที่นับตามที่ระบุในโจทย์อีกครั้ง แต่ได้ ${fwkCount}`);
      }
      const otherCount = fn("other");
      if (otherCount !== 1) {
        throw new Error(`countCompletedLessons('other') ควรได้ 1 แต่ได้ ${otherCount}`);
      }
      log("✓ ฟังก์ชันทำงานถูกต้องกับข้อมูลจำลอง (ตรวจจากผลลัพธ์จริง ไม่ใช่แค่รูปแบบข้อความ)");
    },
    hint: "วนลูปด้วย for และดึงชื่อ key แต่ละตัวด้วย localStorage.key(i) เทียบว่าขึ้นต้นด้วย marker ที่ประกอบจาก prefix ด้วย .startsWith(...) แล้วเช็คค่าด้วย localStorage.getItem(key) ให้เท่ากับ 'true' แบบ strict equality (===) ก่อนนับ",
    solution: `function countCompletedLessons(prefix) {
  const marker = \`\${prefix}_course_completed_\`;
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(marker) && localStorage.getItem(key) === 'true') {
      count++;
    }
  }
  return count;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding แบบที่สุดของบทนี้:</strong> ฟังก์ชันนี้ไม่ใช่ตัวอย่างสมมติ — มันคือโค้ดจริงที่ยกมาจาก <code>index.html</code> ของคอร์สนี้เองเป๊ะๆ (แค่เปลี่ยนชื่อ) หน้า dashboard รวมทุก track ต้องนับความคืบหน้าของ 11 track ที่มีจำนวนบทไม่เท่ากันเลย (API-Testing 13 บท, Visual-Regression 5 บท, ฯลฯ) และ dashboard <strong>ไม่รู้จักเนื้อหาของ track ไหนเลยสักตัว</strong> — สิ่งที่ทำให้ฟังก์ชันเดียวใช้กับทุก track ได้คือทุก track เก็บ progress ด้วย key รูปแบบเดียวกันเป๊ะ: <code>&lt;prefix&gt;_course_completed_&lt;lessonId&gt;</code> = <code>'true'</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>นี่คือ DRY ระดับที่ลึกกว่าแค่ "เขียนฟังก์ชันคำนวณเลข" — มันคือการออกแบบ<strong>รูปแบบ key ให้เดายาก reuse ได้ล่วงหน้า</strong> (ทำตั้งแต่ตอนออกแบบแต่ละ track ให้ใช้ prefix ต่างกันแต่โครงสร้างเดียวกัน) แล้วเขียน<strong>ฟังก์ชันเดียวที่พารามิเตอร์ด้วย prefix</strong> แทนที่จะเขียนโค้ดนับแยกทีละ 11 ครั้งสำหรับ 11 track — เพิ่ม track ที่ 12 ในอนาคตก็ไม่ต้องแตะฟังก์ชันนี้เลยแม้แต่บรรทัดเดียว<br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>อุปสรรคที่เจอจริงระหว่างทำ engine.js refactor ของคอร์สนี้ (คนละจุดกับฟังก์ชันนี้ แต่หลักการ DRY เดียวกัน):</strong> ตอนแรกลองรวม engine logic (render lesson list, validate, reset) ที่ซ้ำกัน ~90% ข้าม 11 ไฟล์ course.js ด้วย <code>&lt;script src="../shared/engine.js"&gt;</code> แล้วพบว่า browser บล็อกการโหลด script ข้าม directory ผ่าน <code>file://</code> เงียบๆ — ทางแก้จริงที่ใช้: เก็บไฟล์ต้นฉบับไว้ที่เดียว (<code>shared/engine.js</code>) แล้วมี script sync ก็อปปี้เข้าไปในแต่ละ track folder เป็น <code>engine.js</code> ของตัวเอง (same-directory load ใช้งานได้จริง) — DRY ที่ดีในทางทฤษฎีบางครั้งเจอข้อจำกัดทางเทคนิคจริงที่ต้องหาทางประนีประนอม ไม่ใช่ทำได้ตรงไปตรงมาเสมอไป<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใช้ <code>===</code> เทียบกับ <code>'true'</code> (ใช้ truthy check เฉยๆ) จะนับ string ค่าอื่นที่ไม่ใช่ 'true' ผิดไปด้วย และอย่าลืม guard <code>key &&</code> ก่อนเรียก <code>.startsWith()</code> เพราะ <code>localStorage.key(i)</code> อาจคืน <code>null</code> ได้`,
    example: `// ตัวอย่างใช้ฟังก์ชันเดียวกันนี้กับหลาย track รวด ไม่ต้องเขียนโค้ดนับแยก
const tracks = [
  { prefix: 'api', total: 13 },
  { prefix: 'visual', total: 5 },
];
for (const t of tracks) {
  console.log(\`\${t.prefix}: \${countCompletedLessons(t.prefix)}/\${t.total}\`);
}`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function countCompletedLessons(prefix)</code><br/>
    2. วนลูปทุก key ใน <code>localStorage</code> ด้วย <code>for (let i = 0; i &lt; localStorage.length; i++)</code><br/>
    3. นับเฉพาะ key ที่ <code>.startsWith(\`\${prefix}_course_completed_\`)</code> และมีค่าเป็น <code>'true'</code>`
  },
  {
    id: "fwk_test_data_management",
    meta: "Framework 5",
    title: "Test Data Management: แยกข้อมูลทดสอบออกจาก Logic การทดสอบ",
    template: `// สถานการณ์: test หลายไฟล์ต้องใช้ ticker ตัวอย่างเดียวกัน (AAPL, ราคา, จำนวนหุ้น)
// เขียนค่าคงที่ฝังในทุกไฟล์ทำให้แก้ทีเดียวไม่ครบ
// 1. สร้าง object testHoldings เก็บข้อมูลทดสอบ (ไม่ใช่ logic การทดสอบ) แยกออกมาต่างหาก
//    มี key: ticker='AAPL', shares=40, avgCost=178.00
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแยก Test Data...");
      const clean = stripComments(code);
      // Extract the actual object body so ticker/shares/avgCost must appear INSIDE
      // testHoldings itself — not merely somewhere else in the file (e.g. a stray
      // comment or an unrelated line) while testHoldings stays an empty object.
      const block = extractBalancedBlock(clean, /(?:const|export const)\s+testHoldings\s*=\s*\{/, "{", "}");
      if (!block) {
        throw new Error("ไม่พบการประกาศ testHoldings object");
      }
      const hasTicker = /ticker:\s*['"]AAPL['"]/.test(block);
      const hasShares = /shares:\s*40\b/.test(block);
      const hasAvgCost = /avgCost:\s*178(\.0+)?\b/.test(block);
      if (!hasTicker || !hasShares || !hasAvgCost) {
        throw new Error("testHoldings ยังมีข้อมูลไม่ครบ ตรวจสอบว่ามีค่า ticker, shares และ avgCost ตรงกับที่ระบุในโจทย์ครบถ้วนภายใน object เดียวกัน");
      }
      log("✓ แยก Test Data ออกจาก Logic ถูกต้อง");
    },
    hint: "แยกข้อมูลออกจาก logic การทดสอบ — ประกาศค่าคงที่เป็น object เดียวเก็บทุก field ที่ test ต้องใช้ซ้ำ",
    solution: `export const testHoldings = {
  ticker: 'AAPL',
  shares: 40,
  avgCost: 178.00,
};`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Test Data Management: แยกข้อมูลทดสอบออกจาก Logic การทดสอบ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ประโยชน์เพิ่มเติม: เมื่อข้อมูลจริง (เช่นโครงสร้าง Holdings ของ My-Investment-Port ที่ track DB Design & SQL ใช้สอน) เปลี่ยนแปลง (เพิ่ม field ใหม่) แก้ไฟล์ test data จุดเดียว ไม่ต้องไล่แก้ hardcoded value กระจายอยู่ทั่วโปรเจก<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>หลักการ <strong>Test Data Management</strong> ที่ดี: แยก "ข้อมูล" (ticker, ราคา, จำนวน) ออกจาก "ตรรกะการทดสอบ" (การกระทำ + การตรวจสอบ) โดยเก็บข้อมูลไว้ใน object/ไฟล์แยกต่างหาก (มักอยู่ใน <code>fixtures/</code> ตามโครงสร้างที่เคยพูดถึง) แล้ว <code>import</code> เข้ามาใช้ในไฟล์ test — เปลี่ยนข้อมูลทดสอบจุดเดียว ทุก test ที่ import ไปใช้จะได้ค่าใหม่โดยอัตโนมัติ<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า test ไหน mutate <code>testHoldings</code> ตรงๆ (เช่น <code>testHoldings.shares = 50</code>) ค่าที่เปลี่ยนจะกระทบทุก test อื่นที่ import object เดียวกันไปใช้ต่อ (module cache แชร์ reference เดียวกัน) ควร clone ด้วย <code>{ ...testHoldings }</code> ก่อน mutate เสมอ`,
    example: `// ตัวอย่างใช้ test data ที่แยกไว้ในไฟล์ test จริง
import { testHoldings } from '../fixtures/testHoldings';

test('เพิ่ม Holding ใหม่', async ({ page }) => {
  await page.getByTestId('ticker-input').fill(testHoldings.ticker);
  await page.getByTestId('shares-input').fill(String(testHoldings.shares));
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>testHoldings</code> object<br/>
    2. มี key <code>ticker: 'AAPL'</code>, <code>shares: 40</code>, <code>avgCost: 178.00</code>`
  },
  {
    id: "fwk_reporting_config",
    meta: "Framework 6",
    title: "Reporting: ตั้งค่ารายงานผลให้อ่านง่ายทั้งคนและ CI",
    template: `// สถานการณ์: อยากได้รายงานผล test แบบ HTML ดูง่าย (สำหรับคน) และ JSON (สำหรับ CI/dashboard อื่น)
// 1. ตั้งค่า reporter ใน playwright.config.ts ให้มีทั้ง 'html' และ 'json' พร้อมกัน
//    JSON output ให้เขียนไปที่ 'results.json'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Reporter...");
      const clean = stripComments(code);
      // Anchor 'html'/'json'/outputFile to be inside the reporter: [...] array itself,
      // not just present anywhere in the file.
      const block = extractBalancedBlock(clean, /reporter:\s*\[/, "[", "]");
      if (!block) {
        throw new Error("ไม่พบการตั้งค่า reporter อย่างครบถ้วน");
      }
      const hasHtml = /['"]html['"]/.test(block);
      const hasJson = /['"]json['"]/.test(block);
      const hasOutputFile = /outputFile:\s*['"]results\.json['"]/.test(block);
      if (!hasHtml || !hasJson) {
        throw new Error("reporter ต้องมีทั้ง 'html' และ 'json' อยู่ในการตั้งค่าเดียวกันจริง");
      }
      if (!hasOutputFile) {
        throw new Error("ไม่พบการตั้งค่า outputFile ให้ตรงกับชื่อไฟล์ผลลัพธ์ที่ระบุในโจทย์ ภายใน reporter ของ 'json'");
      }
      log("✓ ตั้งค่า Reporter ถูกต้อง");
    },
    hint: "reporter รับ array ของ [ชื่อ reporter, options] ได้หลายตัวพร้อมกัน ตัวที่มี option เพิ่มเติมให้ใส่เป็น tuple [name, { ... }]",
    solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'results.json' }],
  ],
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Reporting: ตั้งค่ารายงานผลให้อ่านง่ายทั้งคนและ CI และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การตั้งค่าหลาย reporter พร้อมกันไม่ได้ทำให้ test รันช้าลง (reporter แค่ฟังผลลัพธ์ที่ test สร้างแล้วจัดรูปแบบส่งออกคนละแบบ ไม่ใช่รัน test ซ้ำ) — เป็นวิธีที่คุ้มค่าที่สุดในการตอบโจทย์ทั้ง "คนอยากดูสวยๆ" และ "ระบบอยากได้ข้อมูลดิบไปประมวลผลต่อ" พร้อมกันในคำสั่งเดียว<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>reporter: [</code><br/>
<code>&nbsp;&nbsp;['html'],</code><br/>
<code>&nbsp;&nbsp;['json', { outputFile: 'results.json' }],</code><br/>
<code>],</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมห่อแต่ละ reporter เป็น tuple <code>[ชื่อ, options]</code> แล้วใส่ <code>outputFile</code> ผิดตำแหน่ง (เช่นแปะไว้นอก array ของ <code>'json'</code>) จะทำให้ Playwright ไม่รู้ว่า option นี้เป็นของ reporter ตัวไหน`,
    example: `// ตัวอย่างเพิ่ม reporter บรรทัด (สรุปสั้นๆ ใน terminal ระหว่างรัน) เข้าไปด้วย
reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'results.json' }],
],`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า <code>reporter</code> ให้มีทั้ง <code>'html'</code> และ <code>'json'</code><br/>
    2. <code>json</code> reporter ตั้ง <code>outputFile: 'results.json'</code>`
  },
  {
    id: "fwk_advanced_retry_wrapper",
    meta: "Framework 7",
    title: "Retry Wrapper: ห่อฟังก์ชัน Async ให้ลองใหม่อัตโนมัติเมื่อ Fail",
    template: `// สถานการณ์: บาง test เรียกของที่ flaky โดยธรรมชาติ (เช่น API เช็คสถานะ, WebSocket connect)
// เขียน try/catch วนลองใหม่ซ้ำในทุกไฟล์ test เป็นภาระ — ต้องการ wrapper กลางที่ใช้ซ้ำได้
//
// สเปค:
// 1. ประกาศ async function ชื่อ retry รับ 3 พารามิเตอร์ (fn, retries, delayMs)
//    - fn คือ async function ที่ไม่รับ argument (เรียกแค่ fn())
//    - retries คือจำนวนครั้งสูงสุดที่ "เรียก fn" ทั้งหมด (นับรวมครั้งแรก)
//    - delayMs คือเวลาหน่วง (ms) ก่อนลองเรียกใหม่ทุกครั้งที่ fail
// 2. เรียก fn() ถ้าสำเร็จ ให้ return ค่านั้นออกไปทันที ไม่ต้องลองซ้ำอีก
// 3. ถ้า fn() throw ให้รอ delayMs แล้วเรียก fn() ใหม่ (นับเป็นอีก 1 ครั้ง)
// 4. ถ้าเรียกครบ retries ครั้งแล้วยัง fail ทุกครั้ง ให้ throw error ล่าสุดออกไป
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ retry() wrapper...");
      let retryFn;
      // Shadow setTimeout with an immediate-callback stand-in: keeps the test fast
      // (no real waiting) and keeps it working even in a bare execution context
      // that has no host-provided timer API of its own (unlike the real browser).
      const instantSetTimeout = (cb) => {
        cb();
        return 0;
      };
      try {
        retryFn = execLearnerCode(code, { setTimeout: instantSetTimeout }, 'typeof retry === "function" ? retry : undefined');
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะโหลด: ${err.message}`);
      }
      if (typeof retryFn !== "function") {
        throw new Error("ไม่พบการประกาศ function retry(fn, retries, delayMs)");
      }
      log("✓ พบฟังก์ชัน retry แล้ว กำลังทดสอบพฤติกรรมจริงแบบ async...");
      // retry() is inherently asynchronous (it must await the wrapped fn and any
      // delay), so real behavioral verification can't finish synchronously. We do
      // a synchronous structural gate above (so a missing/broken retry fails
      // immediately, as this playground's engine expects), then hand back a
      // Promise that actually calls the learner's function with fake async
      // dependencies and checks the real outcome.
      return (async () => {
        let calls = 0;
        const fakeFn = async () => {
          calls++;
          if (calls < 3) throw new Error(`fail#${calls}`);
          return "success-value";
        };
        const result = await retryFn(fakeFn, 5, 0);
        if (calls !== 3) {
          throw new Error(`fn ควรถูกเรียกจนสำเร็จรวม 3 ครั้ง (fail 2 ครั้งแรก, สำเร็จครั้งที่ 3) แต่ถูกเรียก ${calls} ครั้ง`);
        }
        if (result !== "success-value") {
          throw new Error(`retry() ต้อง return ค่าที่ fn() คืนตอนสำเร็จ ('success-value') แต่ได้ ${result}`);
        }

        let calls2 = 0;
        const alwaysFail = async () => {
          calls2++;
          throw new Error("always-fail");
        };
        let threw = false;
        let thrownMessage = "";
        try {
          await retryFn(alwaysFail, 3, 0);
        } catch (e) {
          threw = true;
          thrownMessage = e.message;
        }
        if (!threw) {
          throw new Error("เมื่อ fn fail ทุกครั้งจนครบ retries แล้ว retry() ต้อง throw error ล่าสุดออกไป ไม่ใช่ resolve เงียบๆ");
        }
        if (thrownMessage !== "always-fail") {
          throw new Error(`error ที่ throw ออกมาควรเป็น error ล่าสุดจาก fn() ('always-fail') แต่ได้ '${thrownMessage}'`);
        }
        if (calls2 !== 3) {
          throw new Error(`เมื่อ retries=3 และ fn fail ทุกครั้ง ต้องเรียก fn ทั้งหมด 3 ครั้งพอดี แต่ถูกเรียก ${calls2} ครั้ง`);
        }
        log("✓ retry() ทำงานถูกต้องจริง: ลองใหม่จนสำเร็จได้ และ throw เมื่อ fail ครบจำนวนครั้ง");
      })();
    },
    hint: "ใช้ for loop นับจำนวนครั้งที่ลอง ในแต่ละรอบ await fn() ภายใน try/catch — สำเร็จก็ return ค่าออกไปทันที, fail ก็เก็บ error ล่าสุดไว้แล้ว await การหน่วงเวลาด้วย Promise + setTimeout ก่อนวนรอบถัดไป พอครบจำนวนรอบที่กำหนดแล้วยัง fail ให้ throw error ที่เก็บไว้ล่าสุด",
    solution: `async function retry(fn, retries, delayMs) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Retry Wrapper: ห่อฟังก์ชัน Async ให้ลองใหม่อัตโนมัติเมื่อ Fail และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Automation ที่คุยกับระบบภายนอก (API เรียกเช็คสถานะ, WebSocket, third-party service) มักเจอ<strong>ความ flaky ตามธรรมชาติ</strong> ที่ไม่ใช่บั๊กของแอปเรา (network glitch ชั่วคราว, service ยังไม่พร้อมตอบ) — เขียน <code>try/catch</code> วนลองใหม่ในทุกจุดที่เรียกของแบบนี้เป็นโค้ดซ้ำที่ scale ไม่ได้ (DRY เดิมจากบทก่อนหน้า ใช้หลักการเดียวกัน)<br/><br/>
    <strong>Retry wrapper</strong> คือฟังก์ชันกลางที่ "ห่อ" ฟังก์ชัน async ใดๆ ให้มีพฤติกรรม ลองใหม่อัตโนมัติเมื่อ fail โดยรับพารามิเตอร์ควบคุม: จำนวนครั้งสูงสุด (<code>retries</code>) และเวลาหน่วงระหว่างรอบ (<code>delayMs</code>) — การหน่วงเวลาสำคัญเพราะถ้าลองซ้ำทันทีไม่หน่วงเลย อาจยิงถล่ม service ที่กำลังมีปัญหาซ้ำเข้าไปอีก (thundering herd)<br/><br/>
    หลักการสำคัญที่ทำให้ wrapper นี้ "ถูกต้อง": (1) สำเร็จเมื่อไหร่ต้องหยุดทันที ไม่ลองต่อให้เสียเวลา (2) ต้องนับจำนวนครั้งให้ตรงตาม <code>retries</code> พอดี ไม่มากไม่น้อยกว่าที่กำหนด (3) เมื่อหมดโอกาสแล้วต้อง throw error ตัวล่าสุดออกไป ไม่ใช่กลืน error เงียบๆ (เพราะ test framework ต้องรู้ว่าสุดท้ายแล้วมันยัง fail อยู่จริง)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>for (let attempt = 1; attempt &lt;= retries; attempt++) {</code><br/>
<code>&nbsp;&nbsp;try { return await fn(); }</code><br/>
<code>&nbsp;&nbsp;catch (err) { lastError = err; }</code><br/>
<code>}</code><br/>
<code>throw lastError;</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืม <code>await</code> ตอนหน่วงเวลาด้วย <code>setTimeout</code> จะทำให้ loop ยิง retry ถัดไปทันทีโดยไม่รอจริง หรือลืม throw <code>lastError</code> หลัง loop จบ ทำให้ฟังก์ชัน return <code>undefined</code> เงียบๆ แทนที่จะแจ้ง error ว่ายัง fail อยู่`,
    example: `// ตัวอย่างใช้ retry ห่อ API call ที่ flaky ในไฟล์ test จริง
const health = await retry(
  () => fetch('/api/health').then((r) => r.json()),
  3,
  500
);
expect(health.status).toBe('ok');`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>async function retry(fn, retries, delayMs)</code><br/>
    2. เรียก <code>fn()</code> สำเร็จเมื่อไหร่ให้ return ค่าออกไปทันที<br/>
    3. fail ให้รอ <code>delayMs</code> แล้วลองใหม่ นับรวมไม่เกิน <code>retries</code> ครั้ง<br/>
    4. ครบจำนวนครั้งแล้วยัง fail ให้ throw error ล่าสุดออกไป`
  },
  {
    id: "fwk_advanced_test_data_factory",
    meta: "Framework 8",
    title: "Test Data Factory: สร้าง Mock Object ใหม่ทุกครั้งพร้อม Unique ID",
    template: `// สถานการณ์: หลาย test ต้องการ "ผลลัพธ์ test case" ปลอมไว้ mock ข้อมูล
// ถ้าทุก test ใช้ object เดิมซ้ำ อาจชนกัน (id ซ้ำ, test หนึ่ง mutate ค่าไปกระทบอีก test)
// จึงต้องมี factory function ที่สร้าง object ใหม่ให้ทุกครั้งที่เรียก
//
// สเปค:
// 1. ประกาศ function ชื่อ createTestCaseResult ไม่รับ argument
// 2. ทุกครั้งที่เรียก ต้อง return object ใหม่ (คนละ reference กัน) ที่มีอย่างน้อย field:
//    - id: ต้อง unique ไม่ซ้ำกันในแต่ละครั้งที่เรียก (เช่น counter ที่เพิ่มขึ้นเรื่อยๆ)
//    - status: ตั้งค่าเริ่มต้นเป็น 'pending'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ createTestCaseResult() factory (เรียกจริงหลายครั้งเพื่อเช็ค id ไม่ซ้ำ)...");
      let factoryFn;
      try {
        factoryFn = execLearnerCode(code, {}, 'typeof createTestCaseResult === "function" ? createTestCaseResult : undefined');
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
      }
      if (typeof factoryFn !== "function") {
        throw new Error("ไม่พบการประกาศ function createTestCaseResult()");
      }
      const results = [factoryFn(), factoryFn(), factoryFn()];
      results.forEach((r, idx) => {
        if (!r || typeof r !== "object") {
          throw new Error(`การเรียกครั้งที่ ${idx + 1} ต้อง return object`);
        }
        if (r.status !== "pending") {
          throw new Error(`การเรียกครั้งที่ ${idx + 1} ต้องมี status เป็น 'pending' เป็นค่าเริ่มต้น`);
        }
      });
      if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        throw new Error("แต่ละครั้งที่เรียก createTestCaseResult() ต้อง return object ใหม่ (คนละ reference) ไม่ใช่ object เดิมซ้ำ");
      }
      const ids = results.map((r) => r.id);
      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length) {
        throw new Error(`id ต้อง unique ทุกครั้งที่เรียก แต่ได้ id ซ้ำกัน: ${ids.join(", ")}`);
      }
      log("✓ factory สร้าง object ใหม่พร้อม id ไม่ซ้ำกันได้จริง");
    },
    hint: "เก็บตัวนับ (counter) ไว้นอกฟังก์ชันในตัวแปรที่ persist ข้ามการเรียก แล้วเพิ่มค่าก่อน return object ใหม่ทุกครั้ง (หรือใช้ timestamp/random ที่การันตีไม่ซ้ำก็ได้) — อย่าลืม return object literal ใหม่ทุกครั้ง ห้าม return ตัวแปร object เดิมซ้ำ",
    solution: `let __testCaseCounter = 0;

function createTestCaseResult() {
  __testCaseCounter += 1;
  return {
    id: __testCaseCounter,
    status: 'pending',
  };
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Test Data Factory</strong> คือรูปแบบหนึ่งของ Test Data Management (บทที่ 4) ที่ลึกกว่าการแยกค่าคงที่ธรรมดา — เมื่อ test ต้องการ "ของปลอม" ที่มีสถานะเปลี่ยนแปลงได้ (mutate ได้ระหว่าง test) การใช้ object เดิมซ้ำๆ ข้ามหลาย test เป็นบ่อเกิดของบั๊กที่ตามยากที่สุดแบบหนึ่ง: <strong>test A แก้ค่าใน object แล้ว test B ที่รันทีหลังเจอค่าที่เพี้ยนไปจาก test A โดยไม่รู้ตัว (state leak ข้าม test)</strong><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Factory function แก้ปัญหานี้ด้วยการ<strong>สร้าง object ใหม่ทุกครั้งที่ถูกเรียก</strong> (ไม่ return reference เดิมซ้ำ) พร้อม<strong>ค่า id ที่ไม่ซ้ำกัน</strong> — id ที่ unique สำคัญเพราะเวลา assert หรือ track ผลลัพธ์หลาย test case พร้อมกัน (เช่นรัน parallel) การมี id ชนกันจะทำให้แยกไม่ออกว่าผลลัพธ์ไหนเป็นของ test ไหน<br/><br/><br/>วิธีการันตี unique ที่ใช้บ่อย:ตัวนับ (counter) ที่เพิ่มค่าทุกครั้ง (เรียบง่าย คาดเดาลำดับได้) หรือค่าสุ่ม/timestamp ที่ชนกันยากมาก (เหมาะกับกระจาย test ข้ามหลาย process/worker ที่ไม่แชร์ตัวนับกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>let __testCaseCounter = 0;</code><br/>
<code>function createTestCaseResult() {</code><br/>
<code>&nbsp;&nbsp;__testCaseCounter += 1;</code><br/>
<code>&nbsp;&nbsp;return { id: __testCaseCounter, status: 'pending' };</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า return object เดิมที่ประกาศไว้นอกฟังก์ชัน (แทนที่จะสร้าง object literal <code>{ ... }</code> ใหม่ทุกครั้ง) ทุกการเรียกจะได้ reference เดียวกัน — test หนึ่ง mutate ค่าจะกระทบอีก test ที่เรียก factory ไปก่อนหน้าโดยไม่รู้ตัว`,
    example: `// ตัวอย่างใช้ factory สร้าง test case ปลอมหลายตัวไม่ชนกันในไฟล์ test จริง
const tc1 = createTestCaseResult();
const tc2 = createTestCaseResult();
console.log(tc1.id, tc2.id); // ตัวเลขต่างกันเสมอ ไม่ว่าจะเรียกกี่ครั้ง`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function createTestCaseResult()</code><br/>
    2. ทุกครั้งที่เรียก ต้อง return object ใหม่ (คนละ reference)<br/>
    3. object ต้องมี <code>id</code> ที่ไม่ซ้ำกันในแต่ละครั้ง และ <code>status: 'pending'</code>`
  },
  {
    id: "fwk_pom_design_principles",
    meta: "Framework 9",
    title: "POM Design: แยก Action Method ออกจาก Verify Method อย่างมีวินัย",
    template: `// สถานการณ์จริง: HoldingsPage.ts ของ My-Investment-Port (tests/web-testing/pages/port/holdings/holdingsPage.ts)
// แยกหน้าที่ของ method อย่างชัดเจน: method ที่ "กระทำ" (เช่น searchTicker) ไม่มี assertion อยู่ข้างในเลย
// ส่วน method ที่ตั้งใจ "ตรวจผล" (ตั้งชื่อขึ้นต้นด้วย verify) เท่านั้นที่มี expect() — เพื่อให้อ่านชื่อ method รู้ทันทีว่ามันจะ assert หรือแค่กระทำ
// เขียน class HoldingsPage ให้มี 2 method ตามนี้:
// 1. async searchTicker(ticker) — เรียก this.searchInput.fill(ticker) เท่านั้น ห้ามมี expect()
// 2. async verifyHoldingInTable(ticker) — เรียก this.getHoldingRow(ticker) แล้ว expect(...).toBeVisible()
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแยก Action Method และ Verify Method ใน POM...");
      const clean = stripComments(code);
      const searchBlock = extractBalancedBlock(clean, /searchTicker\s*\(\s*ticker\s*\)\s*\{/, "{", "}");
      if (!searchBlock) {
        throw new Error("ไม่พบ method searchTicker(ticker) { ... } ที่ครบถ้วน");
      }
      if (!/this\.searchInput\.fill\(\s*ticker\s*\)/.test(searchBlock)) {
        throw new Error("searchTicker(ticker) ยังไม่ได้กรอกค่าลงช่องค้นหาตามที่ระบุในโจทย์");
      }
      if (/expect\(/.test(searchBlock)) {
        throw new Error("searchTicker(ticker) เป็น action method ต้อง 'กระทำ' อย่างเดียว ห้ามมี expect() ปนอยู่ข้างใน — ผิดหลักการแยก action ออกจาก verify");
      }
      const verifyBlock = extractBalancedBlock(clean, /verifyHoldingInTable\s*\(\s*ticker\s*\)\s*\{/, "{", "}");
      if (!verifyBlock) {
        throw new Error("ไม่พบ method verifyHoldingInTable(ticker) { ... } ที่ครบถ้วน");
      }
      if (!/expect\(\s*this\.getHoldingRow\(\s*ticker\s*\)\s*\)\s*\.\s*toBeVisible\(\)/.test(verifyBlock)) {
        throw new Error("verifyHoldingInTable(ticker) ยังไม่ได้ตรวจสอบว่าแถวข้อมูลที่ต้องการปรากฏอยู่จริงด้วย expect()");
      }
      log("✓ แยก Action Method และ Verify Method ตามหลัก POM ถูกต้อง");
    },
    hint: "method ที่แค่ 'ทำ' อย่าง fill/click ไม่ควรตัดสินผ่าน/ไม่ผ่านเอง ปล่อยให้ test เป็นคนตัดสินผ่าน expect() แทน — ส่วน method ที่ตั้งชื่อสื่อว่า verify (หรือ getXxx สำหรับดึงค่า) เท่านั้นที่ควรมี expect() ซ่อนอยู่ข้างใน เพื่อให้อ่านชื่อ method แล้วรู้ทันทีว่าจะ assert หรือเปล่า",
    solution: `class HoldingsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search ticker');
  }

  getHoldingRow(ticker) {
    return this.page.getByTestId('holding-row-' + ticker);
  }

  async searchTicker(ticker) {
    await this.searchInput.fill(ticker);
  }

  async verifyHoldingInTable(ticker) {
    await expect(this.getHoldingRow(ticker)).toBeVisible();
  }
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>HoldingsPage.ts</code> ของ My-Investment-Port (<code>tests/web-testing/pages/port/holdings/holdingsPage.ts</code>) มี method <code>searchTicker(ticker)</code> ที่กรอกช่องค้นหาอย่างเดียว ไม่มี assertion ใดๆ ข้างใน และมี method <code>verifyHoldingInTable(ticker)</code>, <code>verifyDcaAmount(ticker, ...)</code> ที่ตั้งชื่อขึ้นต้นด้วย <code>verify</code> โดยเฉพาะ และมี <code>expect()</code> อยู่ข้างในเท่านั้น — เปิดไฟล์จริงแล้วจะเห็นรูปแบบนี้ทั้งไฟล์<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Real grounding:</strong> <code>HoldingsPage.ts</code> ของ My-Investment-Port (<code>tests/web-testing/pages/port/holdings/holdingsPage.ts</code>) มี method <code>searchTicker(ticker)</code> ที่กรอกช่องค้นหาอย่างเดียว ไม่มี assertion ใดๆ ข้างใน และมี method <code>verifyHoldingInTable(ticker)</code>, <code>verifyDcaAmount(ticker, ...)</code> ที่ตั้งชื่อขึ้นต้นด้วย <code>verify</code> โดยเฉพาะ และมี <code>expect()</code> อยู่ข้างในเท่านั้น — เปิดไฟล์จริงแล้วจะเห็นรูปแบบนี้ทั้งไฟล์<br/><br/>
    หลักการ <strong>POM Design</strong> ที่มักถูกเข้าใจผิดว่า "ห้ามมี expect() ใน Page Object เด็ดขาด" — ในทางปฏิบัติจริง (ตามไฟล์นี้) ไม่ได้เข้มงวดขนาดนั้น: <strong>action method</strong> (คลิก, กรอกฟอร์ม, navigate) ไม่ควรมี assertion เพราะมันคือ "การกระทำ" ไม่ใช่ "การตัดสิน" — แต่ method ที่<strong>ตั้งใจให้เป็นตัวตรวจผล</strong>และตั้งชื่อสื่อความหมายชัดเจน (ขึ้นต้นด้วย <code>verify</code>) การมี <code>expect()</code> ข้างในเป็นที่ยอมรับได้ เพราะชื่อ method บอกไว้ตรงๆ แล้วว่ามันจะ assert<br/><br/>
    ปัญหาจริงที่หลักการนี้ป้องกัน: ถ้า <code>searchTicker()</code> แอบมี <code>expect()</code> ซ่อนอยู่ข้างใน คนอ่าน test ที่เห็นแค่ <code>await holdingsPage.searchTicker('AAPL')</code> จะไม่รู้เลยว่าบรรทัดนี้ "อาจ fail จากการ assert" ด้วย — ต้องเปิดไปดูข้างใน Page Object ถึงจะรู้ ทำให้ debug ยากขึ้นโดยไม่จำเป็น<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>async searchTicker(ticker) {</code><br/>
<code>&nbsp;&nbsp;await this.searchInput.fill(ticker); // ไม่มี expect()</code><br/>
<code>}</code><br/>
<code>async verifyHoldingInTable(ticker) {</code><br/>
<code>&nbsp;&nbsp;await expect(this.getHoldingRow(ticker)).toBeVisible();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าแอบใส่ <code>expect()</code> ไว้ใน action method อย่าง <code>searchTicker()</code> คนอ่าน test ที่เห็นแค่ <code>await holdingsPage.searchTicker('AAPL')</code> จะไม่รู้เลยว่าบรรทัดนี้อาจ fail จากการ assert ด้วย ต้องแยกให้ action method "กระทำ" เท่านั้น ปล่อยให้ method ที่ขึ้นต้นด้วย <code>verify</code> เป็นตัวเดียวที่มี <code>expect()</code>`,
    example: `// ตัวอย่างใช้งานทั้งสอง method ร่วมกันในไฟล์ test จริง
const holdingsPage = new HoldingsPage(page);
await holdingsPage.searchTicker('AAPL');
await holdingsPage.verifyHoldingInTable('AAPL');`,
    task: `จงเขียน class ให้สมบูรณ์ โดย:<br/>
    1. เขียน method <code>async searchTicker(ticker)</code> เรียก <code>this.searchInput.fill(ticker)</code> เท่านั้น ห้ามมี <code>expect()</code><br/>
    2. เขียน method <code>async verifyHoldingInTable(ticker)</code> เรียก <code>expect(this.getHoldingRow(ticker)).toBeVisible()</code>`
  },
  {
    id: "fwk_env_based_config",
    meta: "Framework 10",
    title: "Environment-based Config: สลับ Base URL ตาม Environment พร้อม Safety Guard",
    template: `// สถานการณ์จริง: playwright.config.ts ของ My-Investment-Port อ่านค่า BASE_URL จาก environment variable
// เพื่อสลับรัน test ระหว่าง local dev, SIT, staging ได้โดยไม่ต้องแก้โค้ด แล้วมี safety guard กันรัน test พลาดเข้า production
// 1. ประกาศ const baseURL = process.env.BASE_URL || 'http://localhost:5175'
// 2. เขียน if (!baseURL.includes('localhost')) { throw new Error(...) } เป็น safety guard
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Environment-based Config และ Safety Guard...");
      const clean = stripComments(code);
      const hasBaseURL = /const\s+baseURL\s*=\s*process\.env\.BASE_URL\s*\|\|\s*['"]http:\/\/localhost:5175['"]/.test(clean);
      if (!hasBaseURL) {
        throw new Error("ไม่พบการประกาศตัวแปร baseURL ที่อ่านค่าจาก environment variable พร้อม fallback ตามที่ระบุในโจทย์");
      }
      const guardMatch = /if\s*\(\s*!\s*baseURL\.includes\(\s*['"]localhost['"]\s*\)\s*\)\s*\{([\s\S]*?)\}/.exec(clean);
      if (!guardMatch) {
        throw new Error("ไม่พบ safety guard ที่เช็คว่า baseURL ไม่ใช่ localhost ตามที่ระบุในโจทย์");
      }
      if (!/throw\s+new\s+Error\(/.test(guardMatch[1])) {
        throw new Error("ภายใน safety guard ต้อง throw new Error(...) เพื่อบล็อกการรัน test");
      }
      log("✓ ตั้งค่า Environment-based Config พร้อม Safety Guard ถูกต้อง");
    },
    hint: "ใช้ process.env.BASE_URL ดึงค่าจาก environment ตอนรัน ถ้าไม่ได้ตั้งไว้เลย fallback ด้วย || ไปที่ localhost — ส่วน guard คือ if ธรรมดาที่เช็คว่า baseURL 'ไม่ใช่' localhost แล้ว throw error ออกไปทันทีก่อนจะปล่อยให้ test รันต่อ",
    solution: `const baseURL = process.env.BASE_URL || 'http://localhost:5175';

if (!baseURL.includes('localhost')) {
  throw new Error(\`🛑 BLOCKED: BASE_URL="\${baseURL}" is not a safe test environment. Tests can only run against localhost.\`);
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>playwright.config.ts</code> ของ My-Investment-Port (<code>tests/web-testing/playwright.config.ts</code>) อ่านค่า baseURL จาก <code>process.env.BASE_URL</code> พร้อม fallback เป็น <code>http://localhost:5175</code> เมื่อไม่ได้ตั้งค่าไว้ — วิธีนี้ทำให้สลับรัน test ข้าม environment (local dev / SIT / staging) ได้โดยแค่เปลี่ยนตัวแปร environment ตอนสั่งรัน ไม่ต้องแก้โค้ด config เลย เช่น <code>BASE_URL=https://sit.example.com npx playwright test</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ไฟล์จริงยังมี <strong>safety guard</strong> ต่อท้ายทันที: ตรวจสอบว่า baseURL หน้าตาเหมือน localhost, 127.0.0.1 หรือ SIT host ที่รู้จักหรือไม่ ถ้าไม่ใช่ (เช่นมีคนตั้ง BASE_URL เป็น URL ของ production โดยไม่ได้ตั้งใจ) จะ throw error หยุดการรันทันที <strong>ก่อน</strong>ที่ test จะเริ่มยิงคำสั่งใดๆ เข้าเว็บจริงเลยด้วยซ้ำ<br/><br/><br/>เหตุผลที่ guard นี้สำคัญ: automation test มักมีการกระทำที่ทำลายข้อมูลได้ (ลบ, แก้ไข, submit ฟอร์ม) — ถ้า environment variable ผิดพลาดแล้ว test ไปรันใส่ production จริงโดยไม่มี guard กันไว้ อาจสร้างความเสียหายที่แก้คืนไม่ได้ การเช็คแบบนี้เป็นด่านป้องกันสุดท้ายที่ทำได้ในระดับ config ก่อนจะไปถึงจุดที่สายเกินไป (บทเรียนนี้ทำให้ตัวตรวจง่ายกว่าไฟล์จริงเล็กน้อย — ไฟล์จริงใช้ regex ครอบคลุมทั้ง localhost, 127.0.0.1 และ SIT host พร้อมกัน หลักการเดียวกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const baseURL = process.env.BASE_URL || 'http://localhost:5175';</code><br/>
<code>if (!baseURL.includes('localhost')) {</code><br/>
<code>&nbsp;&nbsp;throw new Error(\`BLOCKED: \${baseURL} is not safe\`);</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าลืมใส่เครื่องหมาย <code>!</code> หน้า <code>baseURL.includes('localhost')</code> guard จะกลายเป็นบล็อกกรณีที่ปลอดภัย (localhost) แทนที่จะบล็อกกรณีอันตราย (URL อื่นที่ไม่ใช่ localhost) ทำให้ safety guard ทำงานสลับด้านตรงข้ามกับที่ตั้งใจไว้เลย`,
    example: `// รันจริงโดยสลับ environment ผ่าน command line โดยไม่ต้องแก้โค้ด config เลย
// BASE_URL=https://sit.example.com npx playwright test
// BASE_URL=http://localhost:5175 npx playwright test`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>const baseURL = process.env.BASE_URL || 'http://localhost:5175'</code><br/>
    2. เขียน safety guard: ถ้า <code>baseURL</code> ไม่มีคำว่า <code>'localhost'</code> ให้ <code>throw new Error(...)</code>`
  },
  {
    id: "fwk_fixture_composition",
    meta: "Framework 11",
    title: "Fixture Composition: ให้ Fixture หนึ่งพึ่งพา Fixture อื่นที่สร้างไว้แล้ว",
    template: `// สถานการณ์: ต่อยอดจาก fixture watchlistPage (บทที่ 1) — ตอนนี้หลาย test ต้องการหน้า watchlist ที่ goto ไว้แล้ว "และ" กรองหมวด Technology ไว้ล่วงหน้าด้วย
// แทนที่จะ copy โค้ด goto + filter ไปเขียนซ้ำในทุก test หรือเขียน fixture ใหม่จาก page เปล่าๆ อีกรอบ
// ให้สร้าง fixture ใหม่ที่ "พึ่งพา" fixture watchlistPage ที่มีอยู่แล้วโดยตรง
// สเปค:
// 1. สร้าง fixture ชื่อ filteredWatchlistPage โดยรับ parameter เป็น { watchlistPage } (ไม่ใช่ { page })
// 2. ภายใน fixture ให้เรียก watchlistPage.getByTestId('sector-filter').selectOption('Technology')
// 3. แล้ว await use(watchlistPage) ส่งต่อให้ test
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Fixture Composition (fixture ที่พึ่งพา fixture อื่น)...");
      const clean = stripComments(code);
      const hasExtend = /\.extend\(/.test(clean);
      if (!hasExtend) {
        throw new Error("ไม่พบการใช้ test.extend()");
      }
      const fixtureMatch = /filteredWatchlistPage\s*:\s*async\s*\(\s*\{[^)]*watchlistPage[^)]*\}\s*,\s*use\s*\)\s*=>\s*\{([\s\S]*?)\}/.exec(clean);
      if (!fixtureMatch) {
        throw new Error("ไม่พบ fixture ชื่อ filteredWatchlistPage ที่รับ { watchlistPage } เป็น parameter (ไม่ใช่ { page }) — fixture นี้ต้อง 'พึ่งพา' fixture watchlistPage ที่มีอยู่แล้ว ไม่ใช่เริ่มจาก page เปล่าๆ ใหม่");
      }
      const body = fixtureMatch[1];
      if (!/watchlistPage\.getByTestId\(\s*['"]sector-filter['"]\s*\)\.selectOption\(\s*['"]Technology['"]\s*\)/.test(body)) {
        throw new Error("fixture filteredWatchlistPage ยังไม่ได้กรองหมวดหมู่ตามที่ระบุในโจทย์ ผ่าน watchlistPage ที่รับมา");
      }
      if (!/await\s+use\(\s*watchlistPage\s*\)/.test(body)) {
        throw new Error("fixture filteredWatchlistPage ต้องส่งต่อ watchlistPage ที่กรองแล้วให้ test ใช้งานผ่าน use() ไม่ใช่ค่าตัวเปล่าที่ยังไม่ได้กรอง");
      }
      log("✓ Fixture Composition ถูกต้อง: fixture ใหม่พึ่งพา fixture เดิมได้จริง");
    },
    hint: "fixture ใหม่ไม่จำเป็นต้องพึ่งพา built-in page เท่านั้น — สามารถรับ fixture ที่เราสร้างเองไว้ก่อนหน้า (เช่น watchlistPage) เป็น parameter แทนได้เลย Playwright จะจัดลำดับให้เองว่าต้อง setup fixture ที่ถูกพึ่งพาก่อน แล้วค่อย teardown ทีหลังสุด (setup ก่อน teardown หลัง เรียงตามลำดับการพึ่งพา)",
    solution: `import { test as base } from '@playwright/test';

export const test = base.extend({
  watchlistPage: async ({ page }, use) => {
    await page.goto('/watchlist');
    await use(page);
  },
  filteredWatchlistPage: async ({ watchlistPage }, use) => {
    await watchlistPage.getByTestId('sector-filter').selectOption('Technology');
    await use(watchlistPage);
  },
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Fixture Composition: ให้ Fixture หนึ่งพึ่งพา Fixture อื่นที่สร้างไว้แล้ว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทที่ 1 สอนสร้าง fixture ที่พึ่งพา built-in <code>page</code> — แต่ fixture ที่เราสร้างเองก็สามารถ "พึ่งพา fixture อื่นที่เราสร้างไว้ก่อนหน้า" ได้เช่นกัน แค่ตั้งชื่อ fixture นั้นเป็น parameter แทน <code>page</code> ตรงๆ Playwright จะรู้เองจาก dependency graph ว่าต้อง setup ตัวที่ถูกพึ่งพาก่อนเสมอ (ตามเอกสารทางการ Playwright: fixture A ที่พึ่งพา fixture B, B ต้อง setup ก่อน A และ teardown หลัง A เสมอ ไม่ว่าจะพึ่งพากันกี่ชั้นก็ตาม)<br/><br/>
    ประโยชน์เทียบกับเขียน fixture ใหม่จาก <code>page</code> เปล่าๆ ซ้ำ: ไม่ต้องเขียน <code>goto('/watchlist')</code> ซ้ำอีกรอบใน fixture ใหม่ — ต่อยอดจากสิ่งที่มีอยู่แล้วได้ตรงๆ เหมือนฟังก์ชันเรียกฟังก์ชัน ลด logic ที่ต้องดูแลซ้ำซ้อนเมื่อโปรเจกมี fixture หลายสิบตัวที่ทับซ้อนกันบางส่วน<br/><br/>
    ข้อควรระวัง: อย่าพึ่งพาข้ามกันเป็นวงกลม (fixture A พึ่งพา B และ B พึ่งพา A) — Playwright จะตรวจจับและ error ทันทีตอน setup เพราะไม่รู้ว่าจะ setup ตัวไหนก่อน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>export const test = base.extend({</code><br/>
<code>&nbsp;&nbsp;watchlistPage: async ({ page }, use) => { ... },</code><br/>
<code>&nbsp;&nbsp;filteredWatchlistPage: async ({ watchlistPage }, use) => {</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await watchlistPage.getByTestId('sector-filter').selectOption('Technology');</code><br/>
<code>&nbsp;&nbsp;&nbsp;&nbsp;await use(watchlistPage);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ข้อควรระวัง: อย่าพึ่งพาข้ามกันเป็นวงกลม (fixture A พึ่งพา B และ B พึ่งพา A) — Playwright จะตรวจจับและ error ทันทีตอน setup เพราะไม่รู้ว่าจะ setup ตัวไหนก่อน`,
    example: `// ใช้ filteredWatchlistPage ในไฟล์ test จริง — ได้ทั้ง goto และ filter มาพร้อมแล้ว ไม่ต้องเขียนเอง
import { test } from './fixtures';

test('เห็นเฉพาะหุ้นกลุ่ม Technology', async ({ filteredWatchlistPage }) => {
  await filteredWatchlistPage.getByTestId('watchlist-row').first().isVisible();
});`,
    task: `จงเขียนสคริปต์ให้สมบูรณ์ โดย:<br/>
    1. สร้าง fixture ชื่อ <code>filteredWatchlistPage</code> ที่รับ <code>{ watchlistPage }</code> เป็น parameter<br/>
    2. เรียก <code>watchlistPage.getByTestId('sector-filter').selectOption('Technology')</code><br/>
    3. แล้ว <code>await use(watchlistPage)</code> ส่งต่อให้ test`
  },
  {
    id: "fwk_test_step_reporting",
    meta: "Framework 12",
    title: "test.step(): แบ่งรายงานผลเป็นขั้นตอนให้อ่านง่ายเมื่อ Test Fail",
    template: `// สถานการณ์: test เพิ่ม Holding ใหม่มีหลายขั้นตอน (login, เพิ่ม holding) เขียนรวมกันเป็น test เดียวยาวๆ
// เวลา fail รายงาน HTML/trace viewer บอกแค่ชื่อ test ทั้งก้อน ไม่รู้ว่า fail ตรงขั้นตอนไหนใน 2 ขั้นตอนนี้
// ใช้ test.step() ห่อแต่ละขั้นตอน ให้รายงานแยกแสดงเป็นสัดส่วนชัดเจน รู้ทันทีว่า fail ที่ step ไหน
// สเปค:
// 1. ห่อขั้นตอนแรกด้วย await test.step('login', async () => { await page.goto('/login'); })
// 2. ห่อขั้นตอนที่สองด้วย await test.step('add holding', async () => { await page.getByTestId('btn-add-holding').click(); })
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ test.step()...");
      const clean = stripComments(code);
      const loginStep = /test\.step\(\s*['"]login['"]\s*,\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\)/.exec(clean);
      if (!loginStep) {
        throw new Error("ไม่พบ test.step() สำหรับขั้นตอน login ตามที่ระบุในโจทย์");
      }
      if (!/goto\(\s*['"]\/login['"]\s*\)/.test(loginStep[1])) {
        throw new Error("step 'login' ยังไม่ได้ไปที่หน้าที่ระบุในโจทย์อยู่ภายใน");
      }
      const addStep = /test\.step\(\s*['"]add holding['"]\s*,\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*\)/.exec(clean);
      if (!addStep) {
        throw new Error("ไม่พบ test.step() สำหรับขั้นตอน add holding ตามที่ระบุในโจทย์");
      }
      if (!/getByTestId\(\s*['"]btn-add-holding['"]\s*\)\.click\(\)/.test(addStep[1])) {
        throw new Error("step 'add holding' ยังไม่ได้กระทำการที่ระบุในโจทย์อยู่ภายใน");
      }
      if (!/await\s+test\.step\(/.test(clean)) {
        throw new Error("ต้องเรียก test.step() ด้วย await เสมอ (test.step คืน Promise)");
      }
      log("✓ ใช้ test.step() แยกขั้นตอนถูกต้อง");
    },
    hint: "test.step(ชื่อ, async () => { ... }) ห่อโค้ดแต่ละขั้นตอนไว้ข้างใน callback — ต้อง await เพราะมันคืน Promise เสมอ ไม่ว่า callback ข้างในจะทำอะไรก็ตาม ผลลัพธ์คือรายงานและ trace viewer จะแยกแสดงแต่ละ step เป็นก้อนของตัวเอง",
    solution: `import { test } from '@playwright/test';

test('เพิ่ม Holding ใหม่', async ({ page }) => {
  await test.step('login', async () => {
    await page.goto('/login');
  });

  await test.step('add holding', async () => {
    await page.getByTestId('btn-add-holding').click();
  });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>ยืนยันจากเอกสารทางการ Playwright:</strong> <code>test.step(title, body)</code> "Declares a test step that is shown in the report" — แต่ละ step ที่ห่อไว้จะปรากฏเป็นก้อนแยกกันชัดเจนทั้งใน HTML report และ trace viewer แทนที่จะเห็นแค่ log รวมของทั้ง test<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>ยืนยันจากเอกสารทางการ Playwright:</strong> <code>test.step(title, body)</code> "Declares a test step that is shown in the report" — แต่ละ step ที่ห่อไว้จะปรากฏเป็นก้อนแยกกันชัดเจนทั้งใน HTML report และ trace viewer แทนที่จะเห็นแค่ log รวมของทั้ง test<br/><br/>
    <code>test.step()</code> คืนค่าที่ callback ข้างในมัน return ออกมา (ตามเอกสาร: "The method returns the value returned by the step callback") จึงใช้เก็บผลลัพธ์จาก step หนึ่งไปใช้ต่อใน step ถัดไปได้ตรงๆ และรองรับการซ้อน step ข้างในอีก step หนึ่งได้ด้วย (nested step) เหมาะกับขั้นตอนย่อยของขั้นตอนใหญ่<br/><br/>
    ประโยชน์จริงเมื่อ test ยาวและซับซ้อนขึ้น (เช่น login → เพิ่ม holding → ตรวจผลรวม 3 ขั้นตอนขึ้นไป): ถ้าไม่มี step แบ่งไว้ รายงานจะบอกแค่ "test นี้ fail" คนอ่านต้องไล่ดู log ทั้งหมดเองว่า fail ตรงไหน — มี step แบ่งไว้ จะเห็นทันทีว่า step ไหน pass ไปแล้ว step ไหนคือจุดที่ fail จริง (ตัวอย่างนี้ใช้ testid จริงจาก <code>HoldingsPage.ts</code> ของ My-Investment-Port คือ <code>btn-add-holding</code> แต่การห่อด้วย test.step() เองยังไม่ได้ใช้จริงใน test suite ของโปรเจกนั้นตอนนี้ — บทเรียนนี้สอน API ที่ยืนยันถูกต้องจากเอกสารทางการ ประยุกต์กับ testid จริงที่มีอยู่)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>await test.step('login', async () => {</code><br/>
<code>&nbsp;&nbsp;await page.goto('/login');</code><br/>
<code>});</code><br/>
<code>await test.step('add holding', async () => {</code><br/>
<code>&nbsp;&nbsp;await page.getByTestId('btn-add-holding').click();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใส่ <code>await</code> หน้า <code>test.step(...)</code> จะทำให้ step ถัดไปเริ่มทำงานก่อนที่ step ก่อนหน้าจะทำงานเสร็จจริง (เพราะ <code>test.step()</code> คืน Promise เสมอ) ลำดับใน report อาจไม่ตรงกับลำดับที่ต้องการ และ error ข้างในอาจไม่ถูกจับตามที่ควร`,
    example: `// test.step() ซ้อนกันได้ (nested step) และ return ค่าออกมาใช้ต่อได้
const total = await test.step('คำนวณยอดรวม', async () => {
  await test.step('ขั้นตอนย่อย: ดึงราคาล่าสุด', async () => {
    await page.waitForSelector('[data-testid="price-loaded"]');
  });
  return 100;
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ห่อขั้นตอนแรกด้วย <code>await test.step('login', async () => { await page.goto('/login'); })</code><br/>
    2. ห่อขั้นตอนที่สองด้วย <code>await test.step('add holding', async () => { await page.getByTestId('btn-add-holding').click(); })</code>`
  },
  {
    id: "fwk_parallel_worker_isolation",
    meta: "Framework 13",
    title: "Parallel Worker Isolation: กัน Resource ชนกันข้าม Worker ด้วย workerIndex",
    template: `// สถานการณ์จริง: Playwright รัน test พร้อมกันหลาย worker process (คนละ process แยกกัน) เพื่อความเร็ว
// ถ้าทุก worker ใช้ resource ภายนอกร่วมกัน (เช่น login user เดียวกันเข้า backend เดียวกัน) จะชนกัน:
// worker หนึ่งอาจลบ/แก้ข้อมูลที่อีก worker กำลังใช้ทดสอบอยู่พอดี ทำให้ test flaky แบบสุ่มที่จับยากมาก
// เอกสาร Playwright แนะนำผูก resource กับ testInfo.workerIndex (เลขที่ไม่ซ้ำกันในแต่ละ worker) เพื่อให้แต่ละ worker ได้ resource ของตัวเอง
// สเปค:
// 1. ประกาศ function ชื่อ makeWorkerTestUser รับ 1 พารามิเตอร์ (workerIndex)
// 2. return string โดยต่อคำว่า 'user-' เข้ากับ workerIndex (เช่น workerIndex = 0 ต้องได้ 'user-0', workerIndex = 1 ต้องได้ 'user-1')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ makeWorkerTestUser() (รันจริงเพื่อตรวจว่าแต่ละ worker ได้ user ไม่ชนกัน)...");
      let fn;
      try {
        fn = execLearnerCode(code, {}, 'typeof makeWorkerTestUser === "function" ? makeWorkerTestUser : undefined');
      } catch (err) {
        throw new Error(`โค้ดมี error ขณะรัน: ${err.message}`);
      }
      if (typeof fn !== "function") {
        throw new Error("ไม่พบการประกาศ function makeWorkerTestUser(workerIndex)");
      }
      const results = [0, 1, 2].map((i) => fn(i));
      results.forEach((r, idx) => {
        if (r !== `user-${idx}`) {
          throw new Error(`makeWorkerTestUser(${idx}) ยังคืนค่าไม่ตรงกับรูปแบบที่ระบุในโจทย์ แต่ได้ ${JSON.stringify(r)}`);
        }
      });
      const uniqueVals = new Set(results);
      if (uniqueVals.size !== results.length) {
        throw new Error("แต่ละ workerIndex ต้องได้ user ที่ไม่ซ้ำกัน (มิฉะนั้น worker คนละตัวจะแย่งใช้ user เดียวกัน)");
      }
      log("✓ makeWorkerTestUser() ทำงานถูกต้องจริง: แต่ละ worker ได้ user ไม่ชนกัน");
    },
    hint: "ผูกค่า workerIndex เข้ากับ string ตรงๆ ไม่ต้องมี logic ซับซ้อนอะไรเลย — ความ 'ไม่ชนกัน' มาจากตัวเลข workerIndex เองที่ Playwright การันตีไว้แล้วว่าแต่ละ worker process จะได้ค่าไม่ซ้ำกัน หน้าที่ของฟังก์ชันนี้แค่เอาเลขนั้นไปแปะท้าย prefix",
    solution: `function makeWorkerTestUser(workerIndex) {
  return \`user-\${workerIndex}\`;
}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>ยืนยันจากเอกสารทางการ Playwright:</strong> แต่ละ worker process มี isolated browser context ของตัวเองอยู่แล้ว (cookies, storage, in-memory variable ในหน้าเว็บไม่ปนกันข้าม worker) แต่เอกสารเตือนไว้ตรงๆ ว่า "flakiness comes from state that lives outside a single test" — พูดง่ายๆ คือ resource ที่อยู่<strong>นอกเหนือ</strong>ขอบเขตของ browser (เช่น user account ใน backend, แถวข้อมูลใน database) ไม่ได้ isolate ให้อัตโนมัติ ต้องจัดการเอง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>ยืนยันจากเอกสารทางการ Playwright:</strong> แต่ละ worker process มี isolated browser context ของตัวเองอยู่แล้ว (cookies, storage, in-memory variable ในหน้าเว็บไม่ปนกันข้าม worker) แต่เอกสารเตือนไว้ตรงๆ ว่า "flakiness comes from state that lives outside a single test" — พูดง่ายๆ คือ resource ที่อยู่<strong>นอกเหนือ</strong>ขอบเขตของ browser (เช่น user account ใน backend, แถวข้อมูลใน database) ไม่ได้ isolate ให้อัตโนมัติ ต้องจัดการเอง<br/><br/>
    Playwright ให้ค่า <code>testInfo.workerIndex</code> (เลขเริ่มจาก 1 ไม่ซ้ำกันในแต่ละ worker ที่ยังมีชีวิตอยู่) มาเพื่อการนี้โดยเฉพาะ — ตัวอย่างจากเอกสาร: สร้าง test user ชื่อ <code>user-</code> ต่อท้ายด้วยเลข workerIndex ให้แต่ละ worker ได้ user เป็นของตัวเอง ทุก test ที่รันโดย worker เดียวกันใช้ user ตัวเดิมซ้ำได้ (ไม่ต้องสร้างใหม่ทุก test) แต่ worker คนละตัวจะไม่มีวันชนกันเลย เพราะเลข workerIndex การันตีไม่ซ้ำกัน<br/><br/>
    <strong>ความเชื่อมโยงกับความเป็นจริงของโปรเจกนี้:</strong> <code>playwright.config.ts</code> ของ My-Investment-Port ตั้งค่า <code>fullyParallel: false</code> และ <code>workers: 1</code> จริง (รันแบบ serial ทีละ test process เดียว) จึงยังไม่ได้ใช้เทคนิคนี้ตอนนี้ — แต่เป็นเทคนิคมาตรฐานที่เอกสารทางการแนะนำสำหรับวันที่โปรเจกไหนก็ตามขยายไปรัน parallel จริงจัง ไม่ใช่แค่ทฤษฎีลอยๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>function makeWorkerTestUser(workerIndex) {</code><br/>
<code>&nbsp;&nbsp;return \`user-\${workerIndex}\`;</code><br/>
<code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าใช้ตัวแปร counter ธรรมดาแทน <code>workerIndex</code> เพื่อสร้างชื่อ user ที่ไม่ซ้ำ จะไม่การันตี uniqueness จริง เพราะแต่ละ worker process มีหน่วยความจำแยกกัน ตัวแปร counter ของแต่ละ worker จะเริ่มนับจาก 0 เหมือนกันหมด ต้องใช้ <code>workerIndex</code> ที่ Playwright การันตีไม่ซ้ำข้าม process เท่านั้น`,
    example: `// ใช้ผูกกับ fixture จริงในไฟล์ test (ยืนยัน pattern จากเอกสาร Playwright)
const test = base.extend({
  testUser: async ({}, use, testInfo) => {
    const username = makeWorkerTestUser(testInfo.workerIndex);
    await use(username);
  },
});`,
    task: `จงเขียนฟังก์ชันให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>function makeWorkerTestUser(workerIndex)</code><br/>
    2. return string รูปแบบ <code>user-0</code>, <code>user-1</code>, ... ตามค่า <code>workerIndex</code> ที่ส่งเข้ามา (ต่อคำว่า <code>user-</code> กับ workerIndex ตรงๆ)`
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร OOP Fundamentals for QA แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการใช้ Encapsulation, Inheritance, Polymorphism, Abstraction และ Design Pattern (Factory/Singleton/Builder) ออกแบบ automation framework ที่เป็นระเบียบและขยายง่ายขึ้น!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('OOP Fundamentals for QA');
}

const PREFIX = 'oop';

// Migration map from standalone Framework-Design track to unified OOP & Framework track
const FWK_MIGRATION_IDS = [
  'intro',
  'custom_fixtures',
  'folder_organization',
  'reusable_helpers_dry',
  'test_data_management',
  'reporting_config',
  'advanced_retry_wrapper',
  'advanced_test_data_factory',
  'pom_design_principles',
  'env_based_config',
  'fixture_composition',
  'test_step_reporting',
  'parallel_worker_isolation'
];

function migrateFrameworkProgress() {
  if (typeof localStorage === 'undefined') return;
  try {
    for (const oldId of FWK_MIGRATION_IDS) {
      const newId = 'fwk_' + oldId;
      const oldCompletedKey = 'fwk_course_completed_' + oldId;
      const newCompletedKey = PREFIX + '_course_completed_' + newId;
      if (localStorage.getItem(oldCompletedKey) === 'true' && !localStorage.getItem(newCompletedKey)) {
        localStorage.setItem(newCompletedKey, 'true');
      }
      const oldCodeKey = 'fwk_sandbox_code_' + oldId;
      const newCodeKey = PREFIX + '_sandbox_code_' + newId;
      const oldCode = localStorage.getItem(oldCodeKey);
      if (oldCode && !localStorage.getItem(newCodeKey)) {
        localStorage.setItem(newCodeKey, oldCode);
      }
    }
  } catch (e) {
    // Non-blocking in restricted storage
  }
}
migrateFrameworkProgress();

const TAB_WIDTH = 2;

  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['oop-fundamentals'] = { id: 'oop-fundamentals', title: 'OOP & Framework Architecture for QA', folder: 'OOP-Fundamentals', lessons: LESSONS };
})();
