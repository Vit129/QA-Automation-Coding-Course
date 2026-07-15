// CI/CD Pipeline Interactive Coding Playground Data and Logic
// Grounded in kouen-terminal's real .github/workflows/ci.yml - trigger config, concurrency/
// cancel-in-progress, dependency caching, matrix-equivalent parallel jobs, and the
// continue-on-error advisory-job pattern (with its real inline comments explaining why).
// Reframed with a Playwright/npm flavor since kouen-terminal itself is a Swift project.

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "CI/CD คืออะไร: ทำไม Test ต้องรันอัตโนมัติทุกครั้งที่ Push",
    template: `# หมายเหตุ: ไฟล์ .github/workflows/ci.yml คือจุดกำหนดว่า GitHub Actions จะรันอะไรบ้าง เมื่อไหร่
# 1. กำหนดชื่อ workflow ว่า "CI"
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งชื่อ workflow...");
      const hasName = /^name:\s*CI\s*$/m.test(code);
      if (!hasName) {
        throw new Error("ไม่พบ name: CI ที่บรรทัดบนสุด\nตัวอย่าง: name: CI");
      }
      log("✓ ตั้งชื่อ workflow ถูกต้อง");
    },
    hint: "ใส่ name: CI เป็นบรรทัดแรกของไฟล์",
    solution: `name: CI`,
    theory: `<strong>CI/CD (Continuous Integration / Continuous Deployment)</strong> คือระบบที่รันงาน (build, test, deploy) <strong>อัตโนมัติ</strong>ทุกครั้งที่มีการเปลี่ยนแปลงโค้ด (push, เปิด pull request) แทนที่จะรอให้คนใดคนหนึ่งจำได้ว่าต้องรัน test เองก่อน merge<br/><br/>
    เหตุผลที่ QA ต้องเข้าใจ CI/CD (ไม่ใช่แค่หน้าที่ DevOps): <strong>test automation ที่เขียนไว้ (Playwright, k6, ฯลฯ) มีค่าจริงก็ต่อเมื่อมันถูกรันสม่ำเสมอ</strong> — test suite ที่เขียนไว้สวยงามแต่ไม่มีใครรันเลยไม่ต่างจากไม่มี test เลย CI คือกลไกที่การันตีว่า test จะถูกรันทุกครั้งโดยไม่ต้องพึ่งความจำของคนใดคนหนึ่ง<br/><br/>
    บทเรียนนี้อิงจากไฟล์ <code>.github/workflows/ci.yml</code> จริงของโปรเจก kouen-terminal (แม้จะเป็นโปรเจก Swift ไม่ใช่ Playwright แต่โครงสร้าง/แนวคิดของ CI/CD ที่ใช้เป็นสากล — บทเรียนนี้ปรับให้ตัวอย่างรัน <code>npx playwright test</code> แทน <code>swift test</code>)`,
    example: `# ตัวอย่างโครงสร้าง workflow ไฟล์เต็ม (ภาพรวมก่อนลงรายละเอียดทีละส่วนในบทถัดไป)
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. ตั้งชื่อ workflow ว่า <code>CI</code>`
  },
  {
    id: "trigger_config",
    meta: "บทที่ 1",
    title: "Trigger: กำหนดว่า CI จะรันตอนไหนบ้าง",
    template: `name: CI
# 1. กำหนดให้ workflow รันตอน push เข้า branch main และรันทุกครั้งที่มี pull_request
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Trigger...");
      const hasOn = /^on:/m.test(code);
      const hasPushMain = /push:\s*\n\s*branches:\s*\n?\s*-?\s*main|branches:\s*\[\s*main\s*\]/.test(code);
      const hasPullRequest = /pull_request:/.test(code);
      if (!hasOn) {
        throw new Error("ไม่พบ on: ที่กำหนด trigger");
      }
      if (!hasPushMain) {
        throw new Error("ไม่พบการตั้งค่า push branches: main");
      }
      if (!hasPullRequest) {
        throw new Error("ไม่พบ pull_request: trigger");
      }
      log("✓ ตั้งค่า Trigger ถูกต้อง");
    },
    hint: "on:\n  push:\n    branches:\n      - main\n  pull_request:",
    solution: `name: CI
on:
  push:
    branches:
      - main
  pull_request:`,
    theory: `<code>on:</code> กำหนดว่า workflow จะถูก<strong>trigger</strong> (เริ่มรัน) ตอนไหนบ้าง — เงื่อนไขที่ใช้บ่อยที่สุด:<br/><br/>
    • <code>push: branches: [main]</code> — รันทุกครั้งที่มี commit ถูก push เข้า branch <code>main</code> โดยตรง<br/>
    • <code>pull_request:</code> (ไม่ระบุ branches ก็ได้ = ทุก PR) — รันทุกครั้งที่เปิดหรืออัปเดต Pull Request ไปยัง branch ไหนก็ตาม — นี่คือจุดสำคัญที่สุดสำหรับ QA เพราะ <strong>test ต้องรันก่อน merge เข้า main เสมอ</strong> ไม่ใช่รันหลัง merge ไปแล้วถึงรู้ว่าพัง<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> จริงกำหนดไว้:<br/><br/>
    <code>on:<br/>
    &nbsp;&nbsp;push:<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;branches:<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- main<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- "claude/**"<br/>
    &nbsp;&nbsp;pull_request:</code><br/><br/>
    สังเกตว่านอกจาก <code>main</code> ยังมี <code>"claude/**"</code> (wildcard pattern) — รวม branch ที่ AI agent สร้างขึ้นด้วย เพื่อให้ CI ตรวจสอบงานที่ agent ทำโดยอัตโนมัติเช่นกัน ไม่ต้องรอจนกว่าจะเปิด PR ก่อน`,
    example: `# ตัวอย่าง trigger เพิ่มเติม: รันตาม schedule ทุกวันตอนเที่ยงคืน (nightly regression)
on:
  schedule:
    - cron: '0 0 * * *'`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. รันตอน push เข้า <code>branches: [main]</code><br/>
    2. รันทุกครั้งที่มี <code>pull_request</code>`
  },
  {
    id: "concurrency_cancel",
    meta: "บทที่ 2",
    title: "Concurrency: ยกเลิก Run เก่าที่ล้าสมัยแล้วอัตโนมัติ",
    template: `name: CI
on:
  push:
    branches: [main]
  pull_request:
# 1. กำหนด concurrency group แยกตาม github.ref และตั้งค่า cancel-in-progress: true
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Concurrency...");
      const hasConcurrency = /^concurrency:/m.test(code);
      const hasGroup = /group:\s*ci-\$\{\{\s*github\.ref\s*\}\}/.test(code);
      const hasCancelInProgress = /cancel-in-progress:\s*true/.test(code);
      if (!hasConcurrency) {
        throw new Error("ไม่พบ concurrency: block");
      }
      if (!hasGroup) {
        throw new Error("ไม่พบ group: ci-${{ github.ref }}");
      }
      if (!hasCancelInProgress) {
        throw new Error("ไม่พบ cancel-in-progress: true");
      }
      log("✓ ตั้งค่า Concurrency ถูกต้อง");
    },
    hint: "concurrency:\n  group: ci-${{ github.ref }}\n  cancel-in-progress: true",
    solution: `name: CI
on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true`,
    theory: `ถ้า push commit ใหม่เข้า PR เดิมซ้ำๆ ติดกันเร็วๆ (แก้โค้ดแล้ว push อีกรอบทันทีก่อน CI รอบแรกรันเสร็จ) — โดย default GitHub Actions จะปล่อยให้ CI ของทุก commit รันจนจบ แม้ commit เก่าจะ<strong>ล้าสมัยไปแล้ว</strong>เพราะมีโค้ดใหม่กว่ามาแทนที่ ทำให้เสีย compute resource ไปฟรีๆ กับผลลัพธ์ที่ไม่มีใครสนใจอีกต่อไป<br/><br/>
    <code>concurrency</code> แก้ปัญหานี้: <code>group</code> กำหนด "กลุ่ม" ของ run ที่ถือว่าเป็นงานเดียวกัน (ในที่นี้คือ <code>ci-\${{ github.ref }}</code> — ref เดียวกัน เช่น PR branch เดียวกัน) แล้ว <code>cancel-in-progress: true</code> สั่งให้<strong>ยกเลิก run เก่าที่ยังไม่จบ</strong>ทันทีเมื่อมี run ใหม่ในกลุ่มเดียวกันเริ่มขึ้น<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> จริงมีตั้งค่านี้ไว้ตรงตัว:<br/><br/>
    <code>concurrency:<br/>
    &nbsp;&nbsp;group: ci-\${{ github.ref }}<br/>
    &nbsp;&nbsp;cancel-in-progress: true</code>`,
    example: `# ตัวอย่างแยก group ตาม workflow name ด้วย ป้องกัน workflow อื่นชื่อกลุ่มชนกัน
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. กำหนด <code>group: ci-\${{ github.ref }}</code><br/>
    2. ตั้งค่า <code>cancel-in-progress: true</code>`
  },
  {
    id: "caching_dependencies",
    meta: "บทที่ 3",
    title: "Caching: อย่าโหลด Dependency ใหม่ทุกครั้งถ้าไม่จำเป็น",
    template: `# 1. cache โฟลเดอร์ node_modules และ browser binary ของ Playwright (~/.cache/ms-playwright)
#    โดย key อ้างอิงจาก hash ของ package-lock.json
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Cache...");
      const hasCacheAction = /uses:\s*actions\/cache@v4/.test(code);
      const hasPath = /node_modules/.test(code) && /ms-playwright/.test(code);
      const hasKeyHash = /hashFiles\(['"]package-lock\.json['"]\)/.test(code);
      if (!hasCacheAction) {
        throw new Error("ไม่พบ uses: actions/cache@v4");
      }
      if (!hasPath) {
        throw new Error("ไม่พบ path ที่ cache ทั้ง node_modules และ ~/.cache/ms-playwright");
      }
      if (!hasKeyHash) {
        throw new Error("ไม่พบ key ที่ใช้ hashFiles('package-lock.json')");
      }
      log("✓ ตั้งค่า Caching ถูกต้อง");
    },
    hint: "uses: actions/cache@v4\nwith:\n  path: |\n    node_modules\n    ~/.cache/ms-playwright\n  key: deps-${{ hashFiles('package-lock.json') }}",
    solution: `- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      node_modules
      ~/.cache/ms-playwright
    key: deps-\${{ hashFiles('package-lock.json') }}`,
    theory: `การติดตั้ง <code>node_modules</code> และดาวน์โหลด browser binary ของ Playwright (Chromium/Firefox/WebKit ตัวเต็ม) ใช้เวลาหลายนาทีทุกครั้งที่ CI รัน — ถ้าไม่มี cache เลย ทุก run ต้องโหลดใหม่หมดแม้ dependency จะไม่เปลี่ยนเลยจาก run ก่อนหน้า<br/><br/>
    <code>actions/cache</code> เก็บโฟลเดอร์ที่ระบุไว้ (<code>path</code>) ไว้ข้าม run โดยผูกกับ <code>key</code> — ถ้า <code>key</code> ตรงกับที่เคยเก็บไว้ (เช็คจาก <code>hashFiles('package-lock.json')</code> คือ hash ของไฟล์ lock dependency) จะ<strong>restore cache แทนการโหลดใหม่</strong> ทำให้ CI เร็วขึ้นมาก แต่ถ้า <code>package-lock.json</code> เปลี่ยน (มี dependency ใหม่/อัปเดตเวอร์ชัน) hash จะเปลี่ยนตาม แล้ว cache เก่าจะไม่ match — บังคับให้ install ใหม่โดยอัตโนมัติ (ถูกต้อง เพราะ dependency ชุดใหม่ไม่ตรงกับของเก่า)<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> ใช้แนวคิดเดียวกันนี้กับ SwiftPM build cache: <code>key: spm-v2-\${{ runner.os }}-\${{ env.XCODE_VERSION }}-\${{ hashFiles('Package.swift', 'Package.resolved') }}</code> — ผูก key กับทั้ง toolchain version และ hash ของไฟล์ dependency คู่กัน (ตัวอย่างนี้ปรับมาเป็น <code>package-lock.json</code> สำหรับ Node/npm)`,
    example: `# ตัวอย่าง self-heal cache ที่เสียหายบางส่วน (แนวคิดจาก kouen-terminal จริง)
- name: Heal partial cache
  run: |
    if [ -d node_modules ] && [ ! -f node_modules/.bin/playwright ]; then
      echo "::warning::node_modules restored แต่ playwright bin หายไป — ลบแล้วติดตั้งใหม่"
      rm -rf node_modules
    fi`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. ใช้ <code>actions/cache@v4</code><br/>
    2. <code>path</code> รวมทั้ง <code>node_modules</code> และ <code>~/.cache/ms-playwright</code><br/>
    3. <code>key</code> อ้างอิง <code>hashFiles('package-lock.json')</code>`
  },
  {
    id: "matrix_multiple_browsers",
    meta: "บทที่ 4",
    title: "Matrix: รัน Test เดียวกันซ้ำหลาย Browser พร้อมกัน",
    template: `# 1. กำหนด matrix strategy ให้รัน job ซ้ำ 3 ครั้งด้วย browser: chromium, firefox, webkit
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Matrix Strategy...");
      const hasStrategy = /^\s*strategy:/m.test(code);
      const hasMatrix = /matrix:/.test(code);
      const hasBrowsers = /chromium/.test(code) && /firefox/.test(code) && /webkit/.test(code);
      if (!hasStrategy || !hasMatrix) {
        throw new Error("ไม่พบ strategy: matrix:");
      }
      if (!hasBrowsers) {
        throw new Error("ไม่พบรายชื่อ browser ครบ chromium, firefox, webkit");
      }
      log("✓ ตั้งค่า Matrix Strategy ถูกต้อง");
    },
    hint: "strategy:\n  matrix:\n    browser: [chromium, firefox, webkit]",
    solution: `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=\${{ matrix.browser }}`,
    theory: `<strong>Matrix Strategy</strong> รัน job เดียวกันซ้ำหลายครั้งโดยเปลี่ยนแค่ตัวแปรบางตัว (เช่น browser, OS, เวอร์ชัน Node) แทนที่จะเขียน job แยกกัน 3 ก้อนที่เหมือนกันเป๊ะยกเว้น 1 บรรทัด — GitHub Actions จะรันทุก combination <strong>พร้อมกัน</strong> (ไม่ใช่ทีละอัน) ทำให้ผลลัพธ์ทั้ง 3 browser ออกมาเร็วเท่าๆ กับรันแค่ 1 browser<br/><br/>
    <code>\${{ matrix.browser }}</code> คือค่าที่เปลี่ยนไปในแต่ละรอบ (chromium, แล้ว firefox, แล้ว webkit) — ใช้แทนที่ในคำสั่งจริง (<code>--project=\${{ matrix.browser }}</code>) เพื่อสั่ง Playwright ให้รันเฉพาะ browser นั้นในแต่ละ job instance<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> ไม่ได้ใช้ matrix syntax ตรงๆ แต่ใช้แนวคิดเดียวกัน (รันแยก 2 job คู่ขนาน: <code>build-test</code> บน <code>macos-26</code> และ <code>linux-build-test</code> บน <code>ubuntu-latest</code> container <code>swift:6.0</code>) — เป้าหมายเดียวกันคือ "พิสูจน์ว่าใช้งานได้จริงบนหลายสภาพแวดล้อม พร้อมกัน ไม่ใช่ทีละอัน" matrix syntax เป็นวิธีเขียนที่กระชับกว่าเมื่อ combination เยอะและมีแค่ตัวแปรเดียวที่ต่างกัน`,
    example: `# matrix หลายมิติพร้อมกัน (browser x OS) — รันทุก combination = 3 x 2 = 6 job
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    os: [ubuntu-latest, macos-latest]
runs-on: \${{ matrix.os }}`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. กำหนด <code>strategy.matrix.browser</code> เป็น <code>[chromium, firefox, webkit]</code>`
  },
  {
    id: "advisory_non_blocking_jobs",
    meta: "บทที่ 5",
    title: "continue-on-error: Job แบบ Advisory ที่ไม่ควรบล็อกการ Merge",
    template: `# สถานการณ์: job lint (ตรวจสอบ code style) ไม่ควรบล็อกการ merge PR แม้จะเจอปัญหา
# เพราะเป็นแค่คำแนะนำ ไม่ใช่ requirement ที่ทำให้ฟีเจอร์พัง
# 1. ตั้งค่า job ชื่อ lint ให้ continue-on-error: true
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า continue-on-error...");
      const hasJobName = /^\s*lint:/m.test(code);
      const hasContinueOnError = /continue-on-error:\s*true/.test(code);
      if (!hasJobName) {
        throw new Error("ไม่พบ job ชื่อ lint:");
      }
      if (!hasContinueOnError) {
        throw new Error("ไม่พบ continue-on-error: true");
      }
      log("✓ ตั้งค่า Advisory Job ถูกต้อง");
    },
    hint: "jobs:\n  lint:\n    runs-on: ubuntu-latest\n    continue-on-error: true\n    steps:\n      - run: npx eslint .",
    solution: `jobs:
  lint:
    name: Lint (advisory)
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - run: npx eslint .`,
    theory: `ไม่ใช่ทุก job ควรมีสิทธิ์ "บล็อกการ merge" เท่ากันหมด — job สำคัญ (test ที่พิสูจน์ business logic) ควรบล็อกจริงถ้า fail แต่ job แบบ<strong>ให้คำแนะนำ</strong> (lint, benchmark วัดความเร็วที่ผันผวนตาม runner) ไม่ควรบล็อก เพราะความผันผวนของมันไม่ได้แปลว่าโค้ดพังจริง<br/><br/>
    <code>continue-on-error: true</code> สั่งให้ job นั้น<strong>รายงานผลแบบ fail ได้ตามจริง แต่ไม่ทำให้ workflow โดยรวม fail</strong> — คนยังเห็นว่า lint มีปัญหา (ไปแก้ทีหลังได้) แต่ไม่ถูกบล็อกจาก merge เพราะเรื่องรูปแบบโค้ดเพียงอย่างเดียว<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> มี 2 job ที่ตั้งค่านี้ไว้ตรงๆ พร้อมคอมเมนต์อธิบายเหตุผล:<br/><br/>
    <code>lint:<br/>
    &nbsp;&nbsp;name: Format lint (advisory)<br/>
    &nbsp;&nbsp;# Style only — never block a merge on formatting.<br/>
    &nbsp;&nbsp;continue-on-error: true<br/><br/>
    benchmarks:<br/>
    &nbsp;&nbsp;name: Benchmarks (non-blocking)<br/>
    &nbsp;&nbsp;# Perf baselines are informational here; never block a merge on runner variance.<br/>
    &nbsp;&nbsp;continue-on-error: true</code><br/><br/>
    สังเกตคอมเมนต์ทั้งสองจุด — ทั้งคู่อธิบายเหตุผลตรงๆ ว่าทำไมถึงไม่ควรบล็อก (formatting เป็นเรื่อง style, benchmark ผันผวนตาม runner ที่สุ่มได้)`,
    example: `# job หลักที่ควรบล็อกจริง ไม่มี continue-on-error (ค่า default คือต้องผ่านถึง merge ได้)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. สร้าง job ชื่อ <code>lint</code><br/>
    2. ตั้งค่า <code>continue-on-error: true</code>`
  }
];

// Application state

const PREFIX = 'cicd';
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
    <div class="terminal-line info">[GitHub Actions] Validating .github/workflows/ci.yml...</div>
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
        <div class="terminal-line success">✓ <strong>YAML ถูกต้อง (Valid)</strong></div>
        <div class="terminal-line success">Workflow syntax check passed</div>
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
        <div class="terminal-line error">✕ <strong>YAML ไม่ถูกต้อง (Invalid)</strong></div>
        <div class="terminal-line error">${err.message.replace(/\n/g, '<br/>')}</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร CI/CD Pipeline แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการตั้งค่า Trigger, Concurrency, Caching, Matrix Strategy และ Advisory Job ในงาน QA จริง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}
