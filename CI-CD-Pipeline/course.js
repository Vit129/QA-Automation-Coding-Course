(function() {
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
    hint: "YAML workflow ทุกไฟล์ต้องมี key ระดับบนสุดสำหรับตั้งชื่อ workflow ทั้งไฟล์ — คำนั้นแปลตรงตัวว่า 'ชื่อ' ในภาษาอังกฤษ ใส่ไว้เป็นบรรทัดแรกสุดตามด้วยค่าที่ task กำหนด",
    solution: `name: CI`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิด <strong>CI/CD (Continuous Integration / Continuous Deployment)</strong> เพื่อให้ Test Suite รันอัตโนมัติทุกครั้งที่มีการเปลี่ยนโค้ด<br/><br/>
    ⚖️ <strong>ความสำคัญของ CI/CD ต่อ QA Automation:</strong><br/>
    • ❌ <strong>ไม่มี CI/CD:</strong> Test Automation เขียนไว้อย่างดี แต่ไม่ค่อยถูกรัน หรือรันเฉพาะก่อน Deploy เท่านั้น<br/>
    • <strong>มี CI/CD:</strong> บังคับรัน Test ทุกครั้งที่มี Push หรือ Pull Request บล็อก Bug ไม่ให้หลุดไปถึง Branch หลัก<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>name: CI</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ไวยากรณ์ในไฟล์ Configuration ของ GitHub Actions ใช้รูปแบบ <strong>YAML</strong> ซึ่งเคร่งครัดเรื่องการเว้นวรรค (Indentation) ห้ามใช้ Tab เคาะ space ให้เท่ากันเสมอ`,
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
      const stripped = code.replace(/#.*$/gm, '');
      const hasOn = /^on:\s*$/m.test(stripped);
      const hasPushMain =
        /^\s*push:\s*\n\s*branches:\s*\n\s*-\s*main\s*$/m.test(stripped) ||
        /^\s*push:\s*\n\s*branches:\s*\[\s*main\s*\]\s*$/m.test(stripped);
      const hasPullRequest = /^\s*pull_request:\s*$/m.test(stripped);
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
    hint: "มี key ระดับบนสุดที่กำหนดว่า workflow จะ trigger ตอนไหน — ภายใต้ key นั้นต้องมี 2 เงื่อนไข: (1) เงื่อนไขสำหรับ push ที่ระบุว่า branch ไหนบ้างที่ทำให้เข้าเงื่อนไข (ต้องมี main อยู่ใน list) และ (2) อีก key ที่ทำให้ workflow รันทุกครั้งที่มีคนเปิดหรืออัปเดต pull request",
    solution: `name: CI
on:
  push:
    branches:
      - main
  pull_request:`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> กำหนดเงื่อนไขการรันอัตโนมัติ (Trigger Events) ในไฟล์ YAML ผ่านคีย์ <code>on:</code><br/><br/>
    ⚖️ <strong>2 Event หลักที่พบบ่อยที่สุด:</strong><br/>
    • <code>push: branches: [main]</code>: รันเมื่อมี Commit ถูก Push เข้า Branch หลักโดยตรง<br/>
    • <code>pull_request:</code>: รันเมื่อมีคนสร้างหรืออัปเดต Pull Request (บล็อกก่อน Code Merge)<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>on:</code><br/>
    <code>  push:</code><br/>
    <code>    branches: [main]</code><br/>
    <code>  pull_request:</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ควรตั้งค่ารัน Test บน Pull Request เสมอ เพื่อให้รู้ผลทดสอบ "ก่อน" ที่โค้ดจะถูกรวมเข้า Branch หลัก`,
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
      const stripped = code.replace(/#.*$/gm, '');
      const hasConcurrency = /^concurrency:\s*$/m.test(stripped);
      const hasGroup = /^\s*group:\s*ci-\$\{\{\s*github\.ref\s*\}\}\s*$/m.test(stripped);
      const hasCancelInProgress = /^\s*cancel-in-progress:\s*true\s*$/m.test(stripped);
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
    hint: "มี key ระดับบนสุดที่กำหนด 'กลุ่ม' ของ run ที่ถือว่าเป็นงานเดียวกัน (ควรอ้างอิง context variable ที่บอกว่ากำลังรันจาก ref ไหน) แล้วมีอีก key ย่อยที่สั่งให้ยกเลิก run เก่าที่ยังไม่จบทันทีเมื่อมี run ใหม่ในกลุ่มเดียวกันเริ่มขึ้น",
    solution: `name: CI
on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Concurrency: ยกเลิก Run เก่าที่ล้าสมัยแล้วอัตโนมัติ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>&nbsp;&nbsp;group: ci-\${{ github.ref }}<br/><br/>&nbsp;&nbsp;cancel-in-progress: true</code><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>concurrency</code> แก้ปัญหานี้: <code>group</code> กำหนด "กลุ่ม" ของ run ที่ถือว่าเป็นงานเดียวกัน (ในที่นี้คือ <code>ci-\${{ github.ref }}</code> — ref เดียวกัน เช่น PR branch เดียวกัน) แล้ว <code>cancel-in-progress: true</code> สั่งให้<strong>ยกเลิก run เก่าที่ยังไม่จบ</strong>ทันทีเมื่อมี run ใหม่ในกลุ่มเดียวกันเริ่มขึ้น<br/><br/><br/><strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> จริงมีตั้งค่านี้ไว้ตรงตัว:<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตรวจสอบไวยากรณ์ (Syntax) และ Parameter ที่ส่งเข้าฟังก์ชันให้ถูกต้องครบถ้วนเสมอ`,
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
      const stripped = code.replace(/#.*$/gm, '');
      const hasCacheAction = /^\s*-?\s*uses:\s*actions\/cache@v4\s*$/m.test(stripped);
      const hasNodeModulesPath = /^\s*node_modules\s*$/m.test(stripped);
      const hasPlaywrightPath = /^\s*~\/\.cache\/ms-playwright\s*$/m.test(stripped);
      const hasKeyHash = /^\s*key:.*hashFiles\(['"]package-lock\.json['"]\)/m.test(stripped);
      if (!hasCacheAction) {
        throw new Error("ไม่พบ uses: actions/cache@v4");
      }
      if (!hasNodeModulesPath || !hasPlaywrightPath) {
        throw new Error("ไม่พบ path ที่ cache ทั้ง node_modules และ ~/.cache/ms-playwright");
      }
      if (!hasKeyHash) {
        throw new Error("ไม่พบ key ที่ใช้ hashFiles('package-lock.json')");
      }
      log("✓ ตั้งค่า Caching ถูกต้อง");
    },
    hint: "มี action สำเร็จรูปของ GitHub สำหรับเก็บโฟลเดอร์ข้าม run (เวอร์ชัน 4) ต้องระบุ path มากกว่า 1 โฟลเดอร์ (ทั้ง dependency หลักของ Node และ browser binary ที่ Playwright โหลดมา) และ key ที่ผูกกับ hash ของไฟล์ lock dependency เพื่อให้ cache invalidate อัตโนมัติเมื่อ dependency เปลี่ยน",
    solution: `- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      node_modules
      ~/.cache/ms-playwright
    key: deps-\${{ hashFiles('package-lock.json') }}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Caching: อย่าโหลด Dependency ใหม่ทุกครั้งถ้าไม่จำเป็น และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การติดตั้ง <code>node_modules</code> และดาวน์โหลด browser binary ของ Playwright (Chromium/Firefox/WebKit ตัวเต็ม) ใช้เวลาหลายนาทีทุกครั้งที่ CI รัน — ถ้าไม่มี cache เลย ทุก run ต้องโหลดใหม่หมดแม้ dependency จะไม่เปลี่ยนเลยจาก run ก่อนหน้า<br/><br/>
    <code>actions/cache</code> เก็บโฟลเดอร์ที่ระบุไว้ (<code>path</code>) ไว้ข้าม run โดยผูกกับ <code>key</code> — ถ้า <code>key</code> ตรงกับที่เคยเก็บไว้ (เช็คจาก <code>hashFiles('package-lock.json')</code> คือ hash ของไฟล์ lock dependency) จะ<strong>restore cache แทนการโหลดใหม่</strong> ทำให้ CI เร็วขึ้นมาก แต่ถ้า <code>package-lock.json</code> เปลี่ยน (มี dependency ใหม่/อัปเดตเวอร์ชัน) hash จะเปลี่ยนตาม แล้ว cache เก่าจะไม่ match — บังคับให้ install ใหม่โดยอัตโนมัติ (ถูกต้อง เพราะ dependency ชุดใหม่ไม่ตรงกับของเก่า)<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> ใช้แนวคิดเดียวกันนี้กับ SwiftPM build cache: <code>key: spm-v2-\${{ runner.os }}-\${{ env.XCODE_VERSION }}-\${{ hashFiles('Package.swift', 'Package.resolved') }}</code> — ผูก key กับทั้ง toolchain version และ hash ของไฟล์ dependency คู่กัน (ตัวอย่างนี้ปรับมาเป็น <code>package-lock.json</code> สำหรับ Node/npm)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>actions/cache</code> เก็บโฟลเดอร์ที่ระบุไว้ (<code>path</code>) ไว้ข้าม run โดยผูกกับ <code>key</code> — ถ้า <code>key</code> ตรงกับที่เคยเก็บไว้ (เช็คจาก <code>hashFiles('package-lock.json')</code> คือ hash ของไฟล์ lock dependency) จะ<strong>restore cache แทนการโหลดใหม่</strong> ทำให้ CI เร็วขึ้นมาก แต่ถ้า <code>package-lock.json</code> เปลี่ยน (มี dependency ใหม่/อัปเดตเวอร์ชัน) hash จะเปลี่ยนตาม แล้ว cache เก่าจะไม่ match — บังคับให้ install ใหม่โดยอัตโนมัติ (ถูกต้อง เพราะ dependency ชุดใหม่ไม่ตรงกับของเก่า)<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> ใช้แนวคิดเดียวกันนี้กับ SwiftPM build cache: <code>key: spm-v2-\${{ runner.os }}-\${{ env.XCODE_VERSION }}-\${{ hashFiles('Package.swift', 'Package.resolved') }}</code> — ผูก key กับทั้ง toolchain version และ hash ของไฟล์ dependency คู่กัน (ตัวอย่างนี้ปรับมาเป็น <code>package-lock.json</code> สำหรับ Node/npm)`,
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
      const stripped = code.replace(/#.*$/gm, '');
      const hasStrategy = /^\s*strategy:\s*$/m.test(stripped);
      const hasMatrix = /^\s*matrix:\s*$/m.test(stripped);
      const hasBrowserList = /^\s*browser:\s*\[\s*chromium\s*,\s*firefox\s*,\s*webkit\s*\]\s*$/m.test(stripped);
      if (!hasStrategy || !hasMatrix) {
        throw new Error("ไม่พบ strategy: matrix:");
      }
      if (!hasBrowserList) {
        throw new Error("ไม่พบรายชื่อ browser ครบ chromium, firefox, webkit ในรูปแบบ browser: [chromium, firefox, webkit]");
      }
      log("✓ ตั้งค่า Matrix Strategy ถูกต้อง");
    },
    hint: "มี top-level key ใน job ที่สั่งให้ GitHub Actions รัน job เดียวกันซ้ำหลาย instance พร้อมกัน โดยกำหนด list ของค่าที่ต้องการให้ต่างกันในแต่ละรอบ (ในที่นี้คือชื่อ 3 browser ที่ Playwright รองรับ)",
    solution: `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=\${{ matrix.browser }}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Matrix Strategy</strong> รัน job เดียวกันซ้ำหลายครั้งโดยเปลี่ยนแค่ตัวแปรบางตัว (เช่น browser, OS, เวอร์ชัน Node) แทนที่จะเขียน job แยกกัน 3 ก้อนที่เหมือนกันเป๊ะยกเว้น 1 บรรทัด — GitHub Actions จะรันทุก combination <strong>พร้อมกัน</strong> (ไม่ใช่ทีละอัน) ทำให้ผลลัพธ์ทั้ง 3 browser ออกมาเร็วเท่าๆ กับรันแค่ 1 browser<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Matrix Strategy</strong> รัน job เดียวกันซ้ำหลายครั้งโดยเปลี่ยนแค่ตัวแปรบางตัว (เช่น browser, OS, เวอร์ชัน Node) แทนที่จะเขียน job แยกกัน 3 ก้อนที่เหมือนกันเป๊ะยกเว้น 1 บรรทัด — GitHub Actions จะรันทุก combination <strong>พร้อมกัน</strong> (ไม่ใช่ทีละอัน) ทำให้ผลลัพธ์ทั้ง 3 browser ออกมาเร็วเท่าๆ กับรันแค่ 1 browser<br/><br/>
    <code>\${{ matrix.browser }}</code> คือค่าที่เปลี่ยนไปในแต่ละรอบ (chromium, แล้ว firefox, แล้ว webkit) — ใช้แทนที่ในคำสั่งจริง (<code>--project=\${{ matrix.browser }}</code>) เพื่อสั่ง Playwright ให้รันเฉพาะ browser นั้นในแต่ละ job instance<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> ไม่ได้ใช้ matrix syntax ตรงๆ แต่ใช้แนวคิดเดียวกัน (รันแยก 2 job คู่ขนาน: <code>build-test</code> บน <code>macos-26</code> และ <code>linux-build-test</code> บน <code>ubuntu-latest</code> container <code>swift:6.0</code>) — เป้าหมายเดียวกันคือ "พิสูจน์ว่าใช้งานได้จริงบนหลายสภาพแวดล้อม พร้อมกัน ไม่ใช่ทีละอัน" matrix syntax เป็นวิธีเขียนที่กระชับกว่าเมื่อ combination เยอะและมีแค่ตัวแปรเดียวที่ต่างกัน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>\${{ matrix.browser }}</code> คือค่าที่เปลี่ยนไปในแต่ละรอบ (chromium, แล้ว firefox, แล้ว webkit) — ใช้แทนที่ในคำสั่งจริง (<code>--project=\${{ matrix.browser }}</code>) เพื่อสั่ง Playwright ให้รันเฉพาะ browser นั้นในแต่ละ job instance<br/><br/><br/><strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> ไม่ได้ใช้ matrix syntax ตรงๆ แต่ใช้แนวคิดเดียวกัน (รันแยก 2 job คู่ขนาน: <code>build-test</code> บน <code>macos-26</code> และ <code>linux-build-test</code> บน <code>ubuntu-latest</code> container <code>swift:6.0</code>) — เป้าหมายเดียวกันคือ "พิสูจน์ว่าใช้งานได้จริงบนหลายสภาพแวดล้อม พร้อมกัน ไม่ใช่ทีละอัน" matrix syntax เป็นวิธีเขียนที่กระชับกว่าเมื่อ combination เยอะและมีแค่ตัวแปรเดียวที่ต่างกัน<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตรวจสอบไวยากรณ์ (Syntax) และ Parameter ที่ส่งเข้าฟังก์ชันให้ถูกต้องครบถ้วนเสมอ`,
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
      const stripped = code.replace(/#.*$/gm, '');
      const hasJobName = /^\s*lint:\s*$/m.test(stripped);
      const hasContinueOnError = /^\s*continue-on-error:\s*true\s*$/m.test(stripped);
      if (!hasJobName) {
        throw new Error("ไม่พบ job ชื่อ lint:");
      }
      if (!hasContinueOnError) {
        throw new Error("ไม่พบ continue-on-error: true");
      }
      log("✓ ตั้งค่า Advisory Job ถูกต้อง");
    },
    hint: "job ที่เป็นแค่คำแนะนำไม่ควรบล็อกการ merge แม้จะ fail — มี key ระดับ job ตัวหนึ่งที่สั่งให้ workflow ไม่ fail ตามแม้ step ข้างในจะ fail จริง (ค่าเป็น boolean)",
    solution: `jobs:
  lint:
    name: Lint (advisory)
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - run: npx eslint .`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ continue-on-error: Job แบบ Advisory ที่ไม่ควรบล็อกการ Merge และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>&nbsp;&nbsp;name: Format lint (advisory)<br/><br/>&nbsp;&nbsp;# Style only — never block a merge on formatting.<br/><br/>&nbsp;&nbsp;continue-on-error: true<br/><br/><br/>benchmarks:<br/><br/>&nbsp;&nbsp;name: Benchmarks (non-blocking)<br/><br/>&nbsp;&nbsp;# Perf baselines are informational here; never block a merge on runner variance.<br/><br/>&nbsp;&nbsp;continue-on-error: true</code><br/><br/><br/>สังเกตคอมเมนต์ทั้งสองจุด — ทั้งคู่อธิบายเหตุผลตรงๆ ว่าทำไมถึงไม่ควรบล็อก (formatting เป็นเรื่อง style, benchmark ผันผวนตาม runner ที่สุ่มได้)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> มี 2 job ที่ตั้งค่านี้ไว้ตรงๆ พร้อมคอมเมนต์อธิบายเหตุผล:<br/><br/><br/><code>lint:<br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>continue-on-error: true</code> สั่งให้ job นั้น<strong>รายงานผลแบบ fail ได้ตามจริง แต่ไม่ทำให้ workflow โดยรวม fail</strong> — คนยังเห็นว่า lint มีปัญหา (ไปแก้ทีหลังได้) แต่ไม่ถูกบล็อกจาก merge เพราะเรื่องรูปแบบโค้ดเพียงอย่างเดียว<br/><br/>`,
    example: `# job หลักที่ควรบล็อกจริง ไม่มี continue-on-error (ค่า default คือต้องผ่านถึง merge ได้)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npx playwright test`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. สร้าง job ชื่อ <code>lint</code><br/>
    2. ตั้งค่า <code>continue-on-error: true</code>`
  },
  {
    id: "artifact_upload_on_failure",
    meta: "บทที่ 6",
    title: "Artifact Upload: เอาหลักฐาน Test ที่ Fail ออกมาจาก CI ให้ได้",
    template: `# สถานการณ์: test fail ใน CI แต่รายงาน HTML + trace ที่ Playwright สร้างไว้ถูกลบทิ้งไปพร้อม runner
# ถ้าไม่ upload ออกมาก่อน ไม่มีทางเห็นว่า fail เพราะอะไร ต้องเดาแล้วรันซ้ำเอง
# 1. เพิ่ม step upload-artifact ให้ทำงานแม้ step ก่อนหน้าจะ fail (if: always())
#    อัปโหลดโฟลเดอร์ playwright-report ชื่อ 'playwright-report'
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Artifact Upload...");
      const stripped = code.replace(/#.*$/gm, '');
      const hasUploadAction = /^\s*-?\s*uses:\s*actions\/upload-artifact@v4\s*$/m.test(stripped);
      const hasAlways = /^\s*if:\s*always\(\)\s*$/m.test(stripped);
      const hasName = /^\s*name:\s*playwright-report\s*$/m.test(stripped);
      const hasPath = /^\s*path:\s*playwright-report\s*$/m.test(stripped);
      if (!hasUploadAction) {
        throw new Error("ไม่พบ uses: actions/upload-artifact@v4");
      }
      if (!hasAlways) {
        throw new Error("ไม่พบ if: always() — ถ้าไม่ใส่ step นี้จะไม่รันเลยเมื่อ test ก่อนหน้า fail");
      }
      if (!hasName || !hasPath) {
        throw new Error("ต้องตั้งค่า name: playwright-report และ path: playwright-report");
      }
      log("✓ ตั้งค่า Artifact Upload ถูกต้อง");
    },
    hint: "ต้องใช้ action สำเร็จรูปสำหรับอัปโหลดไฟล์ออกจาก runner (เวอร์ชัน 4) และต้องมี condition ที่สั่งให้ step นี้รันเสมอไม่ว่าผลลัพธ์ของ step ก่อนหน้าจะเป็นอย่างไร (ค่า default ของทุก step จะข้ามไปเลยถ้า step ก่อนหน้า fail) แล้วตั้งชื่อ artifact กับ path ให้ตรงกับโฟลเดอร์ที่ Playwright เขียนรายงานไว้",
    solution: `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Artifact Upload: เอาหลักฐาน Test ที่ Fail ออกมาจาก CI ให้ได้ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ตั้งค่า Trigger, Caching, Matrix ให้ test รันอัตโนมัติได้ครบแล้ว (บทก่อนหน้า) — แต่ถ้า test fail ใน CI แล้วไม่มีใครเอาหลักฐาน (screenshot, trace, HTML report ที่ Playwright สร้างให้อัตโนมัติ) ออกมาดูได้ ก็เท่ากับรู้แค่ว่า "แดง" แต่ไม่รู้ว่าทำไม ต้อง clone มารันซ้ำบนเครื่องตัวเองอีกรอบเพื่อไล่ดู<br/><br/>
    <code>actions/upload-artifact</code> เก็บไฟล์จาก CI runner (ที่ปกติหายไปพร้อม runner หลังจบงาน) ไว้ให้ดาวน์โหลดผ่านหน้า GitHub Actions ได้ทีหลัง — จุดสำคัญที่สุดคือ <code>if: always()</code>: ค่า default ของทุก step คือ<strong>รันเฉพาะตอน step ก่อนหน้าผ่านเท่านั้น</strong> ถ้าไม่ใส่ <code>if: always()</code> แล้ว <code>npx playwright test</code> fail ก่อนหน้า step upload จะถูก<strong>ข้ามไปเลย</strong> — กลายเป็นว่ายิ่ง test fail (ตอนที่ต้องการหลักฐานมากที่สุด) กลับยิ่งไม่มีหลักฐานให้ดู<br/><br/>
    <code>name</code> ตั้งชื่อ artifact ที่จะเห็นในหน้า GitHub Actions, <code>path</code> ระบุโฟลเดอร์ที่ Playwright เขียนรายงานไว้ (ค่า default คือ <code>playwright-report/</code>) — ดาวน์โหลดมาเปิดดู HTML report ได้เหมือนรันบนเครื่องตัวเองทุกประการ รวม screenshot/trace ของจุดที่ fail<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>actions/upload-artifact</code> เก็บไฟล์จาก CI runner (ที่ปกติหายไปพร้อม runner หลังจบงาน) ไว้ให้ดาวน์โหลดผ่านหน้า GitHub Actions ได้ทีหลัง — จุดสำคัญที่สุดคือ <code>if: always()</code>: ค่า default ของทุก step คือ<strong>รันเฉพาะตอน step ก่อนหน้าผ่านเท่านั้น</strong> ถ้าไม่ใส่ <code>if: always()</code> แล้ว <code>npx playwright test</code> fail ก่อนหน้า step upload จะถูก<strong>ข้ามไปเลย</strong> — กลายเป็นว่ายิ่ง test fail (ตอนที่ต้องการหลักฐานมากที่สุด) กลับยิ่งไม่มีหลักฐานให้ดู<br/><br/><br/><code>name</code> ตั้งชื่อ artifact ที่จะเห็นในหน้า GitHub Actions, <code>path</code> ระบุโฟลเดอร์ที่ Playwright เขียนรายงานไว้ (ค่า default คือ <code>playwright-report/</code>) — ดาวน์โหลดมาเปิดดู HTML report ได้เหมือนรันบนเครื่องตัวเองทุกประการ รวม screenshot/trace ของจุดที่ fail<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตรวจสอบไวยากรณ์ (Syntax) และ Parameter ที่ส่งเข้าฟังก์ชันให้ถูกต้องครบถ้วนเสมอ`,
    example: `# ตัวอย่างอัปโหลด trace แยกต่างหากด้วย (ละเอียดกว่า HTML report เฉยๆ)
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-traces
    path: test-results/`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. เพิ่ม step ใช้ <code>actions/upload-artifact@v4</code> พร้อม <code>if: always()</code><br/>
    2. ตั้งค่า <code>name: playwright-report</code> และ <code>path: playwright-report</code>`
  },
  {
    id: "advanced_needs_artifact_handoff",
    meta: "ขั้นสูง 1",
    title: "Multi-Job Pipeline: ส่งไฟล์ข้าม Job ด้วย needs + Artifact Hand-off",
    template: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --reporter=html
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report

  # สถานการณ์: job "deploy" ต้องรอ job "build" ให้รัน test เสร็จก่อน แล้วดึงรายงานที่ build อัปโหลดไว้
  # มาใช้ต่อ (เช่น publish ขึ้นหน้า status page) — ไม่ใช่ generate รายงานซ้ำเอง
  # 1. สร้าง job ชื่อ deploy ที่ต้องรอ job build ให้เสร็จก่อน
  # 2. ให้ deploy ดาวน์โหลด artifact ชื่อ playwright-report ที่ build อัปโหลดไว้
  # WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการต่อ Job ด้วย needs และ Artifact hand-off...");
      const stripped = code.replace(/#.*$/gm, '');
      const deployIdx = stripped.search(/^\s*deploy:\s*$/m);
      if (deployIdx === -1) {
        throw new Error("ไม่พบ job ชื่อ deploy:");
      }
      const deployBlock = stripped.slice(deployIdx);
      const hasNeedsBuild = /^\s*needs:\s*build\s*$/m.test(deployBlock);
      const hasDownloadAction = /^\s*-?\s*uses:\s*actions\/download-artifact@v4\s*$/m.test(deployBlock);
      const hasDownloadName = /^\s*name:\s*playwright-report\s*$/m.test(deployBlock);
      const hasDownloadPath = /^\s*path:\s*playwright-report\s*$/m.test(deployBlock);
      if (!hasNeedsBuild) {
        throw new Error("job deploy ต้องมี needs: build เพื่อรอให้ build เสร็จก่อน ไม่งั้นทั้งสอง job จะรันพร้อมกัน");
      }
      if (!hasDownloadAction) {
        throw new Error("job deploy ต้องมี step ที่ใช้ actions/download-artifact@v4 เพื่อดึง artifact ที่ build อัปโหลดไว้กลับมาใช้");
      }
      if (!hasDownloadName || !hasDownloadPath) {
        throw new Error("step download-artifact ต้องระบุ name: playwright-report และ path: playwright-report ให้ตรงกับตอนที่ build อัปโหลดไว้ ไม่งั้นดาวน์โหลดไม่เจอ");
      }
      log("✓ ต่อ Job ด้วย needs และ Artifact hand-off ถูกต้อง");
    },
    hint: "job ที่สองต้องรอ job แรกให้เสร็จก่อนเสมอด้วย key ระดับ job ที่แปลว่า 'ต้องการ' — แล้วใช้ action คู่ตรงข้ามของ upload (ที่ใช้ดึงสิ่งที่เคยอัปโหลดไว้กลับมา) โดย name ของ artifact ต้องตรงกับตอนอัปโหลดเป๊ะๆ ไม่งั้นดาวน์โหลดไม่เจอ",
    solution: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --reporter=html
      - uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
      - run: echo "Publishing report downloaded from build job"`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Multi-Job Pipeline: ส่งไฟล์ข้าม Job ด้วย needs + Artifact Hand-off และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>จนถึงบทก่อนหน้า ทุก workflow มีแค่ 1 job — แต่ pipeline จริงมักมีหลาย job ที่ต้อง<strong>พึ่งพากัน</strong> เช่น job <code>build</code> รัน test แล้วสร้างรายงาน ก่อนที่ job <code>deploy</code> จะเอารายงานนั้นไป publish ต่อ<br/><br/>
    โดย default GitHub Actions รันทุก job ใน <code>jobs:</code> <strong>พร้อมกัน (ขนาน)</strong> — ถ้าไม่บอกไว้ชัดเจน <code>deploy</code> อาจเริ่มรันก่อน <code>build</code> จะอัปโหลดรายงานเสร็จด้วยซ้ำ <code>needs: build</code> สั่งให้ <code>deploy</code> รอ <code>build</code> ให้<strong>เสร็จสมบูรณ์ก่อน</strong>ถึงจะเริ่ม<br/><br/>
    แต่แค่รอเฉยๆ ไม่พอ — แต่ละ job รันบน runner คนละเครื่องกัน ไฟล์ที่ <code>build</code> สร้างไว้ (เช่น <code>playwright-report/</code>) จะ<strong>ไม่มีอยู่จริง</strong>บนเครื่องของ <code>deploy</code> เลย ต้องส่งต่อผ่าน <code>actions/upload-artifact</code> (ฝั่ง build) คู่กับ <code>actions/download-artifact</code> (ฝั่ง deploy) โดย <code>name</code> ต้องตรงกันเป๊ะทั้งสองฝั่ง มิฉะนั้น <code>download-artifact</code> จะหา artifact ไม่เจอและ fail<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>โดย default GitHub Actions รันทุก job ใน <code>jobs:</code> <strong>พร้อมกัน (ขนาน)</strong> — ถ้าไม่บอกไว้ชัดเจน <code>deploy</code> อาจเริ่มรันก่อน <code>build</code> จะอัปโหลดรายงานเสร็จด้วยซ้ำ <code>needs: build</code> สั่งให้ <code>deploy</code> รอ <code>build</code> ให้<strong>เสร็จสมบูรณ์ก่อน</strong>ถึงจะเริ่ม<br/><br/><br/>แต่แค่รอเฉยๆ ไม่พอ — แต่ละ job รันบน runner คนละเครื่องกัน ไฟล์ที่ <code>build</code> สร้างไว้ (เช่น <code>playwright-report/</code>) จะ<strong>ไม่มีอยู่จริง</strong>บนเครื่องของ <code>deploy</code> เลย ต้องส่งต่อผ่าน <code>actions/upload-artifact</code> (ฝั่ง build) คู่กับ <code>actions/download-artifact</code> (ฝั่ง deploy) โดย <code>name</code> ต้องตรงกันเป๊ะทั้งสองฝั่ง มิฉะนั้น <code>download-artifact</code> จะหา artifact ไม่เจอและ fail<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตรวจสอบไวยากรณ์ (Syntax) และ Parameter ที่ส่งเข้าฟังก์ชันให้ถูกต้องครบถ้วนเสมอ`,
    example: `# ตัวอย่าง job ที่สามรอทั้งสอง job ก่อนหน้า (needs รับ array ได้)
notify:
  needs: [build, deploy]
  runs-on: ubuntu-latest
  steps:
    - run: echo "build และ deploy เสร็จทั้งคู่แล้ว"`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. สร้าง job ชื่อ <code>deploy</code> ที่มี <code>needs: build</code><br/>
    2. เพิ่ม step ใช้ <code>actions/download-artifact@v4</code> พร้อม <code>name: playwright-report</code> และ <code>path: playwright-report</code> ให้ตรงกับที่ <code>build</code> อัปโหลดไว้`
  },
  {
    id: "advanced_debug_missing_needs",
    meta: "ขั้นสูง 2",
    title: "Debug Pipeline: ทำไม Deploy ถึงรันก่อน Test เสร็จ",
    template: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test

  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh

# บั๊กที่ต้องแก้: ทีมรายงานว่า deploy.sh รันขึ้น production ไปแล้วทั้งที่ e2e_test ยังไม่ผ่าน
# เพราะ GitHub Actions รันทุก job ใน jobs: พร้อมกันเป็น default เสมอ ถ้าไม่มีอะไรบอกให้ job หนึ่งรออีก job
# ห้ามแก้ด้วยการลบ job ใดออก หรือแค่สลับลำดับ job ในไฟล์ (ลำดับในไฟล์ไม่มีผลต่อลำดับการรันจริง)
# แก้ไข YAML ด้านบนให้ deploy ต้องรอ e2e_test ผ่านก่อนเท่านั้นถึงจะเริ่มรัน
# WRITE YOUR CODE HERE (แก้ไขโดยตรงในโค้ดด้านบน)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแก้ไข Pipeline ที่รันผิดลำดับ...");
      const stripped = code.replace(/#.*$/gm, '');
      const hasE2eJob = /^\s*e2e_test:\s*$/m.test(stripped);
      const deployIdx = stripped.search(/^\s*deploy:\s*$/m);
      if (!hasE2eJob || deployIdx === -1) {
        throw new Error("ห้ามลบ job e2e_test หรือ deploy ออก ต้องแก้ที่ต้นเหตุของปัญหา ไม่ใช่ตัดปัญหาทิ้ง");
      }
      const deployBlock = stripped.slice(deployIdx);
      const hasNeedsE2e = /^\s*needs:\s*e2e_test\s*$/m.test(deployBlock);
      if (!hasNeedsE2e) {
        throw new Error("job deploy ยังไม่รอ job e2e_test ให้เสร็จก่อน — เพิ่ม needs: e2e_test ใน job deploy (การสลับลำดับ job ในไฟล์ไม่ได้ทำให้รันตามลำดับจริง ต้องใช้ needs: เท่านั้น)");
      }
      log("✓ แก้ไข Pipeline ให้รันตามลำดับที่ถูกต้องแล้ว");
    },
    hint: "job ที่ประกาศแยกกันใน jobs: จะรันขนานกันเสมอโดย default ไม่ว่าจะเขียนสลับลำดับก่อนหลังในไฟล์แบบไหนก็ตาม (ลำดับในไฟล์ไม่มีผลต่อลำดับรันจริง) ต้องมี key ระดับ job ตัวหนึ่งที่สั่งให้ job หนึ่งรอให้อีก job หนึ่ง 'เสร็จ' ก่อนถึงจะเริ่มทำงาน",
    solution: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test

  deploy:
    needs: e2e_test
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Debug Pipeline: ทำไม Deploy ถึงรันก่อน Test เสร็จ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทนี้ไม่ได้ให้เขียนใหม่ตั้งแต่ต้น แต่ให้<strong>ไล่หาต้นเหตุ</strong>จากอาการที่เห็น: "deploy รันไปแล้วทั้งที่ test ยังไม่ผ่าน" — นี่คืออาการจริงที่ทีมมักเจอ ไม่ใช่แค่ syntax error ที่ YAML parser จะฟ้องเอง แต่เป็น<strong>บั๊กเชิงโครงสร้าง</strong>ที่ syntax ถูกต้องสมบูรณ์แบบ รันได้ไม่มี error เลย แต่ผลลัพธ์ที่ได้ผิดจากที่ตั้งใจ<br/><br/>
    กับดักที่พบบ่อยที่สุดคือ<strong>เข้าใจผิดว่าลำดับ job ในไฟล์ = ลำดับการรันจริง</strong> — ไม่ใช่เลย GitHub Actions มองทุก job ใน <code>jobs:</code> เป็น<strong>อิสระต่อกันและรันพร้อมกันเสมอ</strong> เว้นแต่จะมี <code>needs:</code> ผูกไว้ชัดเจนว่า job ไหนต้องรอ job ไหน การสลับตำแหน่ง <code>deploy</code> กับ <code>e2e_test</code> ในไฟล์ (ไม่เพิ่ม <code>needs:</code>) จะไม่แก้อะไรเลยเพราะ engine ไม่ได้อ่านไฟล์แล้วรันตามลำดับบรรทัด<br/><br/>
    ทางแก้ที่ตรงต้นเหตุมีทางเดียว: เพิ่ม <code>needs: e2e_test</code> ใน job <code>deploy</code> เพื่อประกาศ dependency จริงๆ ให้ scheduler ของ GitHub Actions รู้ว่าต้องรอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>ทางแก้ที่ตรงต้นเหตุมีทางเดียว: เพิ่ม <code>needs: e2e_test</code> ใน job <code>deploy</code> เพื่อประกาศ dependency จริงๆ ให้ scheduler ของ GitHub Actions รู้ว่าต้องรอ<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> กับดักที่พบบ่อยที่สุดคือ<strong>เข้าใจผิดว่าลำดับ job ในไฟล์ = ลำดับการรันจริง</strong> — ไม่ใช่เลย GitHub Actions มองทุก job ใน <code>jobs:</code> เป็น<strong>อิสระต่อกันและรันพร้อมกันเสมอ</strong> เว้นแต่จะมี <code>needs:</code> ผูกไว้ชัดเจนว่า job ไหนต้องรอ job ไหน การสลับตำแหน่ง <code>deploy</code> กับ <code>e2e_test</code> ในไฟล์ (ไม่เพิ่ม <code>needs:</code>) จะไม่แก้อะไรเลยเพราะ engine ไม่ได้อ่านไฟล์แล้วรันตามลำดับบรรทัด<br/><br/>`,
    example: `# บั๊กแบบเดียวกันแต่มาจาก indentation ผิด (step หลุดออกจาก job โดยไม่ตั้งใจ)
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
  - run: npm test   # บั๊ก: บรรทัดนี้ indent ผิดระดับ กลายเป็น item ใน jobs: ไม่ใช่ step ใน build
                     # ทำให้ "npm test" ไม่ถูกรันเป็น step ของ job build เลย`,
    task: `จากอาการ "deploy รันก่อน e2e_test เสร็จ" จงแก้ไข YAML ด้านบนโดย:<br/>
    1. หาต้นเหตุที่แท้จริงว่าทำไม GitHub Actions ถึงปล่อยให้ deploy รันไม่รอ e2e_test<br/>
    2. แก้ไขให้ job <code>deploy</code> มี <code>needs: e2e_test</code> เพื่อบังคับลำดับการรันจริง (ห้ามลบ job ใดออก และห้ามใช้วิธีสลับลำดับ job เฉยๆ)`
  },
  {
    id: "env_var_pinning",
    meta: "บทที่ 7",
    title: "env: กำหนดตัวแปรระดับ Workflow เพื่อ Pin เวอร์ชัน Dependency",
    template: `# สถานการณ์: package.json ระบุ "@playwright/test": "^1.48.0" — เครื่องหมาย ^ ทำให้ npm install ได้เวอร์ชัน patch/minor ใหม่กว่าเสมอ
# ถ้า Playwright ออกเวอร์ชันใหม่ที่เปลี่ยนพฤติกรรม (breaking change) CI จะพังกะทันหันโดยไม่มีใครแตะโค้ดเลยสักบรรทัด
# 1. ประกาศตัวแปรระดับ workflow ชื่อ PLAYWRIGHT_VERSION ค่า "1.48.0" ไว้ใน env: (นอก jobs: เพื่อให้ทุก job เรียกใช้ได้)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า env:...");
      const stripped = code.replace(/#.*$/gm, '');
      const hasEnvBlock = /^env:\s*$/m.test(stripped);
      const hasVersionVar = /^\s*PLAYWRIGHT_VERSION:\s*["']1\.48\.0["']\s*$/m.test(stripped);
      if (!hasEnvBlock) {
        throw new Error("ไม่พบ env: ที่ระดับบนสุดของไฟล์ (นอก jobs:)");
      }
      if (!hasVersionVar) {
        throw new Error("ไม่พบตัวแปร PLAYWRIGHT_VERSION: \"1.48.0\" ใต้ env:");
      }
      log("✓ ตั้งค่า env: ถูกต้อง");
    },
    hint: "มี key ระดับบนสุดสำหรับประกาศตัวแปรที่ใช้ได้ทุก job/step ในไฟล์เดียวกัน วางคู่กับ on: และ jobs: (ไม่ซ้อนอยู่ใต้ job ใดๆ) ค่าที่กำหนดตรงนี้เรียกใช้ซ้ำได้ทุกที่ในไฟล์ผ่าน syntax ${{ env.<ชื่อตัวแปร> }}",
    solution: `env:
  PLAYWRIGHT_VERSION: "1.48.0"

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -D @playwright/test@\${{ env.PLAYWRIGHT_VERSION }}
      - run: npx playwright test`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ env: กำหนดตัวแปรระดับ Workflow เพื่อ Pin เวอร์ชัน Dependency และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ประโยชน์ที่สำคัญที่สุดสำหรับ QA: <strong>pin เวอร์ชันของ tool/dependency ไว้ที่จุดเดียว</strong> แทนที่จะกระจายเลขเวอร์ชันเดียวกันไปพิมพ์ซ้ำในหลาย step — ถ้าต้องอัปเดตเวอร์ชัน แก้ที่เดียวจบ ไม่ต้องไล่หาทุกจุดที่พิมพ์เลขเวอร์ชันไว้ (ซึ่งพลาดง่ายมากถ้าทำมือ)<br/><br/><br/>&nbsp;&nbsp;# Pin the toolchain to a known major so a \`latest-stable\` jump (e.g. to a new Xcode with<br/><br/>&nbsp;&nbsp;# source-breaking changes) can't turn a green main red without a deliberate bump here.<br/><br/>&nbsp;&nbsp;XCODE_VERSION: "26.5"</code><br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>Real grounding:</strong> kouen-terminal's <code>ci.yml</code> (บรรทัด 14-21) ใช้แนวคิดนี้จริง เพื่อ pin เวอร์ชัน Xcode พร้อมคอมเมนต์อธิบายเหตุผลไว้ตรงๆ:<br/><br/><br/><code>env:<br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> คอมเมนต์นี้อธิบายตรงประเด็นที่สุด: ถ้าไม่ pin เวอร์ชันไว้ CI ที่เคย "เขียว" อาจกลายเป็น "แดง" ได้เอง<strong>โดยไม่มีใครเปลี่ยนโค้ดเลยสักบรรทัด</strong> เพียงเพราะ toolchain รุ่นใหม่กว่าที่ดึงมาอัตโนมัติมีพฤติกรรมเปลี่ยนไป — ตัวอย่างนี้ปรับจาก Xcode version มาเป็น Playwright version สำหรับบริบท Node/npm`,
    example: `# ตัวอย่าง env: ระดับ job override ค่า workflow-level เฉพาะ job นั้น (เช่น job ทดสอบ Playwright เวอร์ชันถัดไปแยกต่างหาก)
jobs:
  test-next:
    env:
      PLAYWRIGHT_VERSION: "1.49.0"
    runs-on: ubuntu-latest`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. ประกาศ <code>env:</code> ระดับบนสุด (นอก jobs:)<br/>
    2. กำหนดตัวแปร <code>PLAYWRIGHT_VERSION: "1.48.0"</code> ไว้ข้างใน`
  },
  {
    id: "paths_filter_skip_docs",
    meta: "บทที่ 8",
    title: "paths-ignore: ข้าม CI เมื่อแก้แค่ไฟล์เอกสาร",
    template: `name: CI
on:
  push:
    branches: [main]
  pull_request:
# สถานการณ์: ทีมแก้ไขแค่ README.md หรือไฟล์ในโฟลเดอร์ docs/ บ่อยมาก (แก้ typo, เพิ่มคำอธิบาย) ไม่ได้แตะโค้ดทดสอบเลยสักบรรทัด
# แต่ push ทุกครั้งก็ยังรัน npx playwright test เต็มรูปแบบเหมือนเดิม เสีย compute โดยไม่จำเป็น เพราะไฟล์เอกสารไม่มีทางทำให้ test ผ่านหรือ fail ต่างไปเลย
# 1. เพิ่ม paths-ignore ใต้ push: ให้ข้าม CI เมื่อไฟล์ที่เปลี่ยนอยู่ใน docs/** หรือเป็น README.md เท่านั้น
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า paths-ignore...");
      const stripped = code.replace(/#.*$/gm, '');
      const hasPathsIgnore = /^\s*paths-ignore:\s*$/m.test(stripped);
      const hasDocsPath = /^\s*-\s*docs\/\*\*\s*$/m.test(stripped);
      const hasReadmePath = /^\s*-\s*README\.md\s*$/m.test(stripped);
      if (!hasPathsIgnore) {
        throw new Error("ไม่พบ paths-ignore: ใต้ push:");
      }
      if (!hasDocsPath || !hasReadmePath) {
        throw new Error("paths-ignore ต้องมีครบทั้ง docs/** และ README.md");
      }
      log("✓ ตั้งค่า paths-ignore ถูกต้อง");
    },
    hint: "on.push มี key ย่อยที่ระบุ 'รายการ path ที่ไม่ต้องสน' ได้ (มี key พี่น้องอีกตัวที่ทำตรงข้ามคือระบุเฉพาะ path ที่ต้องสนเท่านั้น — สองตัวนี้ใช้พร้อมกันใน event เดียวกันไม่ได้) รับค่าเป็น list ของ path/glob pattern เหมือน branches: ที่เรียนมาแล้ว",
    solution: `name: CI
on:
  push:
    branches: [main]
    paths-ignore:
      - docs/**
      - README.md
  pull_request:`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ paths-ignore: ข้าม CI เมื่อแก้แค่ไฟล์เอกสาร และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ประโยชน์: แก้ README/เอกสารบ่อยแค่ไหนก็ไม่เสีย compute รัน test ที่ไม่มีทางเปลี่ยนผลเลย — feedback ของ push ที่แก้โค้ดจริงก็เร็วขึ้นด้วยเพราะไม่ต้องแย่ง runner กับ run ที่ไม่จำเป็น<br/><br/><br/><em>หมายเหตุความถูกต้อง:</em> ยืนยันจากเอกสารทางการของ GitHub Actions (docs.github.com — Workflow syntax, Skipping workflow runs) ไม่ใช่จากไฟล์ ci.yml จริงของโปรเจกใดบนเครื่องนี้ เพราะยังไม่มีโปรเจกไหนใช้ paths-ignore จริง<br/><br/>
    💡 <strong>Mental Model:</strong><br/>ทำความเข้าใจลำดับการทำงานและโครงสร้างการทดสอบก่อนลงมือเขียนโค้ดจริง<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>ข้อควรระวังสำคัญ</strong> (จากเอกสารทางการของ GitHub เรื่อง "Skipping workflow runs"): ถ้า workflow นี้ถูกตั้งเป็น <strong>required status check</strong> ใน branch protection แล้ว PR ที่แก้แค่เอกสาร (ซึ่ง workflow ถูกข้ามไปเพราะ paths-ignore) จะมี check ค้างสถานะ "Pending" ตลอดไป เพราะ GitHub ไม่รู้ว่า "ข้าม" กับ "ยังไม่รัน" ต่างกันยังไงสำหรับ required check — ทำให้ merge ไม่ได้ทั้งที่ไม่มีอะไรผิดเลย ทางแก้คือสร้าง workflow เสริมชื่อเดียวกับ check ที่ required ไว้ ให้รันแบบ no-op เมื่อ trigger ตรงเงื่อนไข paths-ignore แทน<br/><br/>`,
    example: `# ตัวอย่างตรงข้าม: paths: (allow-list) รัน CI เฉพาะเมื่อมีไฟล์ .ts หรือ .tsx เปลี่ยนเท่านั้น
on:
  push:
    paths:
      - '**.ts'
      - '**.tsx'`,
    task: `จงเขียน YAML ให้สมบูรณ์ โดย:<br/>
    1. เพิ่ม <code>paths-ignore</code> ใต้ <code>push:</code><br/>
    2. ระบุ path ครบทั้ง <code>docs/**</code> และ <code>README.md</code>`
  },
  {
    id: "matrix_fail_fast",
    meta: "ขั้นสูง 3",
    title: "fail-fast: false — อย่าให้ Browser ตัวเดียว Fail แล้วดับทุก Browser ที่เหลือ",
    template: `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=\${{ matrix.browser }}

# บทที่ 4 สอนตั้งค่า matrix ให้รัน 3 browser พร้อมกัน แต่ไม่ได้พูดถึง fail-fast เลย (ค่า default คือ true)
# สถานการณ์: chromium รันผ่านแล้ว แต่ firefox ดัน fail ก่อน webkit จะรันเสร็จ — ด้วยค่า default ของ GitHub Actions
# job webkit ที่ยังรันค้างอยู่จะถูก "ยกเลิกทันที" ทำให้ไม่รู้เลยว่า webkit จะผ่านหรือ fail ด้วย ต้องมานั่งรันซ้ำทั้งหมดอีกรอบเพื่อดูผลจริงของทุก browser
# 1. เพิ่ม fail-fast: false ใน strategy (ระดับเดียวกับ matrix:) เพื่อให้ทุก browser รันจนจบเสมอ ไม่ว่า browser ไหนจะ fail ก่อนก็ตาม
# WRITE YOUR CODE HERE (แก้ไขโดยตรงในโค้ดด้านบน)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า fail-fast...");
      const stripped = code.replace(/#.*$/gm, '');
      const hasMatrixBrowsers = /^\s*browser:\s*\[\s*chromium\s*,\s*firefox\s*,\s*webkit\s*\]\s*$/m.test(stripped);
      if (!hasMatrixBrowsers) {
        throw new Error("ห้ามลบการตั้งค่า matrix.browser เดิมออก ต้องคงไว้ครบทั้ง chromium, firefox, webkit");
      }
      const hasFailFastFalse = /^\s*fail-fast:\s*false\s*$/m.test(stripped);
      if (!hasFailFastFalse) {
        throw new Error("ไม่พบ fail-fast: false ใน strategy: (ค่า default ของ fail-fast คือ true — ยกเลิก job อื่นในทันทีเมื่อมี job หนึ่ง fail)");
      }
      log("✓ ตั้งค่า fail-fast: false ถูกต้อง");
    },
    hint: "strategy: มี key พี่น้องของ matrix: อีกตัวหนึ่งที่ควบคุมว่าจะยกเลิก job อื่นในกลุ่มเดียวกันหรือไม่เมื่อมี job หนึ่ง fail (ค่า default เป็น true อยู่แล้วโดยไม่ต้องเขียนเอง) ตั้งค่าเป็น boolean false เพื่อพลิกพฤติกรรมนั้น ให้ทุก combination รันจนจบเสมอ",
    solution: `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test --project=\${{ matrix.browser }}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ fail-fast: false — อย่าให้ Browser ตัวเดียว Fail แล้วดับทุก Browser ที่เหลือ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทที่ 4 สอนให้รัน test ซ้ำ 3 browser พร้อมกันด้วย matrix — แต่ไม่ได้พูดถึงพฤติกรรมเมื่อ browser ใดตัวหนึ่ง fail เลย ความจริงคือ GitHub Actions มีค่า default ซ่อนอยู่ที่ไม่มีใครเห็นในไฟล์: <code>fail-fast: true</code><br/><br/>
    <strong>ตามเอกสารทางการของ GitHub:</strong> เมื่อ <code>fail-fast</code> เป็น <code>true</code> (default) — ถ้ามี job ใดใน matrix fail ขึ้นมา GitHub จะ<strong>ยกเลิก job อื่นที่ยังรันอยู่หรือรอคิวอยู่ในกลุ่มเดียวกันทันที</strong> ฟังดูสมเหตุสมผลตอนแรก (ประหยัด compute เมื่อรู้แล้วว่ามีอะไรพัง) แต่สำหรับ matrix ที่ทดสอบข้าม browser การยกเลิกนี้<strong>ทำลายจุดประสงค์เดิมของการรัน matrix ไปเลย</strong> — เหตุผลที่รันแยก 3 browser ตั้งแต่แรกคือต้องการรู้ผลของ<strong>ทุก</strong>ตัวพร้อมกัน ถ้า firefox fail แล้ว webkit ที่ยังไม่ทันรันเสร็จถูกยกเลิกไปด้วย ทีมจะไม่มีทางรู้เลยว่า webkit ผ่านหรือ fail จนกว่าจะแก้ firefox แล้วรันใหม่ทั้งหมดอีกรอบ<br/><br/>
    <code>fail-fast: false</code> วางไว้ระดับเดียวกับ <code>matrix:</code> ภายใต้ <code>strategy:</code> เดียวกัน — พลิกพฤติกรรม default ให้ทุก combination ใน matrix รันจนจบเสมอไม่ว่าตัวไหนจะ fail ก่อน ทำให้เห็นผลครบทั้ง 3 browser ในรอบเดียว (บอกได้ตรงๆ ว่า "fail เฉพาะ firefox" หรือ "fail หลาย browser พร้อมกัน" ซึ่งเป็นข้อมูลที่ต่างกันมากตอนวิเคราะห์ต้นเหตุ)<br/><br/>
    <em>หมายเหตุความถูกต้อง:</em> พฤติกรรมนี้ยืนยันจากเอกสารทางการของ GitHub Actions (Workflow syntax for GitHub Actions — <code>jobs.&lt;job_id&gt;.strategy.fail-fast</code>) ไม่ใช่จากไฟล์จริงในโปรเจกใดบนเครื่องนี้ เพราะยังไม่มีโปรเจกไหนที่ใช้ matrix strategy จริงกับ Playwright ในลักษณะนี้<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>ตามเอกสารทางการของ GitHub:</strong> เมื่อ <code>fail-fast</code> เป็น <code>true</code> (default) — ถ้ามี job ใดใน matrix fail ขึ้นมา GitHub จะ<strong>ยกเลิก job อื่นที่ยังรันอยู่หรือรอคิวอยู่ในกลุ่มเดียวกันทันที</strong> ฟังดูสมเหตุสมผลตอนแรก (ประหยัด compute เมื่อรู้แล้วว่ามีอะไรพัง) แต่สำหรับ matrix ที่ทดสอบข้าม browser การยกเลิกนี้<strong>ทำลายจุดประสงค์เดิมของการรัน matrix ไปเลย</strong> — เหตุผลที่รันแยก 3 browser ตั้งแต่แรกคือต้องการรู้ผลของ<strong>ทุก</strong>ตัวพร้อมกัน ถ้า firefox fail แล้ว webkit ที่ยังไม่ทันรันเสร็จถูกยกเลิกไปด้วย ทีมจะไม่มีทางรู้เลยว่า webkit ผ่านหรือ fail จนกว่าจะแก้ firefox แล้วรันใหม่ทั้งหมดอีกรอบ<br/><br/><br/><code>fail-fast: false</code> วางไว้ระดับเดียวกับ <code>matrix:</code> ภายใต้ <code>strategy:</code> เดียวกัน — พลิกพฤติกรรม default ให้ทุก combination ใน matrix รันจนจบเสมอไม่ว่าตัวไหนจะ fail ก่อน ทำให้เห็นผลครบทั้ง 3 browser ในรอบเดียว (บอกได้ตรงๆ ว่า "fail เฉพาะ firefox" หรือ "fail หลาย browser พร้อมกัน" ซึ่งเป็นข้อมูลที่ต่างกันมากตอนวิเคราะห์ต้นเหตุ)<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตรวจสอบไวยากรณ์ (Syntax) และ Parameter ที่ส่งเข้าฟังก์ชันให้ถูกต้องครบถ้วนเสมอ`,
    example: `# ใช้คู่กับ max-parallel ได้ด้วย เพื่อจำกัดจำนวน browser ที่รันพร้อมกันสูงสุด (ประหยัด runner quota)
strategy:
  fail-fast: false
  max-parallel: 2
  matrix:
    browser: [chromium, firefox, webkit]`,
    task: `จากพฤติกรรม default ของ matrix strategy จงแก้ไข YAML ด้านบนโดย:<br/>
    1. เพิ่ม <code>fail-fast: false</code> ใน <code>strategy:</code> (ระดับเดียวกับ <code>matrix:</code>)<br/>
    2. ห้ามลบหรือแก้ไข <code>matrix.browser</code> เดิม ต้องคงไว้ครบทั้ง 3 browser`
  },
  {
    id: "environment_protection_deploy",
    meta: "ขั้นสูง 4",
    title: "environment: ผูก Job Deploy เข้ากับ Protection Rule ก่อนขึ้น Production จริง",
    template: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test

  # บทก่อนหน้าแก้ให้ deploy รอ e2e_test ผ่านก่อนแล้วด้วย needs: e2e_test — แต่พอ test ผ่านปุ๊บ deploy.sh ก็รันขึ้น production ทันทีอัตโนมัติ
  # ไม่มีคนอนุมัติเลยสักขั้นตอน ทีมต้องการให้ tech lead กด approve ก่อนเสมอถึงจะ deploy จริงขึ้น production ได้ แม้ test จะผ่านหมดแล้วก็ตาม
  # (protection rule "ต้องมี required reviewer" ถูกตั้งค่าไว้แล้วที่ GitHub repo Settings > Environments > production — งานฝั่ง YAML คือผูก job นี้เข้ากับ environment นั้นให้ถูกชื่อ)
  # 1. เพิ่ม environment: production ใน job deploy
  deploy:
    needs: e2e_test
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
# WRITE YOUR CODE HERE (แก้ไขโดยตรงในโค้ดด้านบน)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการผูก Job เข้ากับ Environment...");
      const stripped = code.replace(/#.*$/gm, '');
      const deployIdx = stripped.search(/^\s*deploy:\s*$/m);
      if (deployIdx === -1) {
        throw new Error("ห้ามลบ job deploy ออก ต้องแก้ที่ job เดิม ไม่ใช่สร้างใหม่หรือลบทิ้ง");
      }
      const deployBlock = stripped.slice(deployIdx);
      const hasNeedsE2e = /^\s*needs:\s*e2e_test\s*$/m.test(deployBlock);
      if (!hasNeedsE2e) {
        throw new Error("ห้ามลบ needs: e2e_test ที่มีอยู่แล้วออก ต้องคงไว้เหมือนเดิม");
      }
      const hasEnvironment = /^\s*environment:\s*production\s*$/m.test(deployBlock);
      if (!hasEnvironment) {
        throw new Error("ไม่พบ environment: production ใน job deploy — key นี้ผูก job เข้ากับ protection rule ที่ตั้งไว้ใน repo Settings");
      }
      log("✓ ผูก Job deploy เข้ากับ Environment ถูกต้อง");
    },
    hint: "job มี key ระดับเดียวกับ needs: และ runs-on: อีกตัวหนึ่งที่รับค่าเป็นชื่อ environment ตรงๆ (string) — ชื่อ environment นี้ต้องตรงกับที่ตั้งค่า protection rule ไว้ใน repo Settings ให้ตรงเป๊ะ ตัว YAML เองไม่ได้กำหนด reviewer หรือเงื่อนไขใดๆ เลย แค่ 'อ้างอิง' ชื่อ environment เท่านั้น",
    solution: `name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright test

  deploy:
    needs: e2e_test
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ environment: ผูก Job Deploy เข้ากับ Protection Rule ก่อนขึ้น Production จริง และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><em>หมายเหตุความถูกต้อง:</em> ยืนยันจากเอกสารทางการของ GitHub Actions (Environments — protection rules ตั้งค่าใน repository Settings) ไม่ใช่จากไฟล์ ci.yml จริงของโปรเจกใดบนเครื่องนี้ เพราะยังไม่มีโปรเจกไหนที่ตั้งค่า deployment environment ผ่าน GitHub Actions จริง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>environment: production</code> ผูก job นั้นเข้ากับ environment ชื่อ <code>production</code> ที่ตั้งค่าไว้ใน repo (Settings → Environments) — ถ้า environment นั้นมี <strong>protection rule</strong> (เช่น required reviewers, wait timer, จำกัดว่า deploy ได้จาก branch ไหนบ้าง) ตั้งไว้ job จะ<strong>ค้างรอ</strong>ที่สถานะ "Waiting" จนกว่าเงื่อนไขจะผ่านก่อนถึงจะรัน step ข้างในต่อ แม้ <code>needs: e2e_test</code> จะผ่านหมดแล้วก็ตาม<br/><br/><br/>จุดสำคัญที่สุดที่พลาดกันบ่อย: <strong>protection rule เอง (required reviewer คือใคร, ต้องรอกี่นาที ฯลฯ) ไม่ได้เขียนอยู่ใน YAML เลยสักตัว</strong> — ตั้งค่าอยู่ใน repo Settings เท่านั้น ฝั่ง YAML มีหน้าที่แค่ "อ้างอิงชื่อ environment ให้ตรง" เท่านั้น ถ้า Settings ยังไม่ได้สร้าง environment ชื่อ <code>production</code> หรือยังไม่ตั้ง protection rule ไว้ การเขียน <code>environment: production</code> เฉยๆ ก็ไม่มี gate อะไรเกิดขึ้นจริง<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตรวจสอบไวยากรณ์ (Syntax) และ Parameter ที่ส่งเข้าฟังก์ชันให้ถูกต้องครบถ้วนเสมอ`,
    example: `# environment รองรับ object form ด้วย เพิ่ม url ที่จะโชว์เป็นลิงก์ "View deployment" บนหน้า PR
deploy:
  needs: e2e_test
  environment:
    name: production
    url: https://app.example.com
  runs-on: ubuntu-latest`,
    task: `จากสถานการณ์ "deploy รันขึ้น production ทันทีโดยไม่มีคนอนุมัติ" จงแก้ไข YAML ด้านบนโดย:<br/>
    1. เพิ่ม <code>environment: production</code> ใน job <code>deploy</code><br/>
    2. ห้ามลบ <code>needs: e2e_test</code> เดิมออก`
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
        <div class="terminal-line error">${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
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
  showTrackCertificate('CI/CD Pipeline');
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
  window.QA_TRACKS['ci-cd-pipeline'] = { id: 'ci-cd-pipeline', title: 'CI/CD Pipeline', folder: 'CI-CD-Pipeline', lessons: LESSONS };
})();
