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
