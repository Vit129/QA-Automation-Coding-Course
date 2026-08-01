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
    id: "oop_composition_over_inheritance",
    meta: "บทที่ 10",
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
    id: "oop_factory_pattern",
    meta: "บทที่ 11",
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
      const TestUserFactory = getLearnerClass(code, "TestUserFactory");

      const admin = TestUserFactory.create('admin');
      const guest = TestUserFactory.create('guest');

      if (!admin || admin.role !== 'admin') {
        throw new Error(`TestUserFactory.create('admin') ต้องคืนค่า user ที่มี role เป็น 'admin' แต่ได้ ${admin && admin.role}`);
      }
      if (!guest || guest.role !== 'guest') {
        throw new Error(`TestUserFactory.create('guest') ต้องคืนค่า user ที่มี role เป็น 'guest' แต่ได้ ${guest && guest.role}`);
      }
      if (admin.username === guest.username) {
        throw new Error("create('admin') และ create('guest') ต้องคืนค่า user คนละคนกัน (username ต้องไม่เหมือนกัน)");
      }
      log(`✓ TestUserFactory.create() สร้าง user ต่างชนิดกันจริงตาม type: admin=${admin.username}, guest=${guest.username}`);
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
    meta: "บทที่ 12",
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
    meta: "บทที่ 13",
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
    id: "oop_static_members",
    meta: "บทที่ 14",
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
const TAB_WIDTH = 2;

  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['oop-fundamentals'] = { id: 'oop-fundamentals', title: 'OOP Fundamentals for QA', folder: 'OOP-Fundamentals', lessons: LESSONS };
})();
