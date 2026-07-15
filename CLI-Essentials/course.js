// Git, Vim & Unix Cheat Sheet Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/kouen-terminal/ repo's real .githooks/
// and Scripts/*.sh files where real material exists. Vim lessons are generic/universal —
// neither reference project has a .vimrc, so those two teach the standard survival skill
// instead (this course's own CLAUDE.md conventions call the same tradeoff out explicitly
// when no project-specific grounding exists for a topic).

const LESSONS = [
  {
    id: "git_stash",
    meta: "บทนำ",
    title: "Git Stash: เก็บงานค้างไว้ชั่วคราวแบบมีป้ายกำกับ",
    template: `# สถานการณ์: กำลังแก้ไฟล์ค้างอยู่ แต่ต้องสลับไปทำ hotfix ด่วนก่อน
# 1. เก็บงานที่ทำค้างไว้ชั่วคราว (รวมไฟล์ untracked ด้วย -u) พร้อมป้ายกำกับชื่อ 'wip-login-fix'
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git stash...");
      const hasStash = /git stash push\s+-u\s+-m\s+["']wip-login-fix["']/.test(code);
      if (hasStash) {
        log("✓ ใช้ git stash push -u -m \"wip-login-fix\" ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git stash push -u -m \"wip-login-fix\"\nตัวอย่าง: git stash push -u -m \"wip-login-fix\"");
      }
    },
    hint: "ใช้ git stash push -u -m \"wip-login-fix\"",
    solution: `git stash push -u -m "wip-login-fix"`,
    theory: `<strong>git stash</strong> เก็บงานที่ยังไม่พร้อม commit ไว้ชั่วคราว แล้วคืน working tree ให้สะอาดเพื่อสลับไปทำงานอื่นก่อน<br/><br/>
    <strong>ห้ามใช้ <code>git stash</code>/<code>git stash pop</code> แบบเปล่าๆ ถ้าทำงานพร้อมกันหลาย session/worktree</strong> เพราะ stash stack เป็น stack เดียวใช้ร่วมกันทั้ง repo — ถ้ามีคนอื่น (หรือ agent อื่น) stash ไว้ก่อนหน้า <code>git stash pop</code> เปล่าๆ อาจไปดึงของคนอื่นออกมาโดยไม่ตั้งใจ<br/><br/>
    วิธีที่ปลอดภัยกว่า:<br/>
    1. <code>git stash push -u -m "&lt;ป้ายกำกับ&gt;"</code> — <code>-u</code> รวมไฟล์ untracked ด้วย (ไฟล์ใหม่ที่ยังไม่ได้ add) <code>-m</code> ตั้งชื่อป้ายกำกับให้หาเจอง่ายทีหลัง<br/>
    2. <code>git stash list --format='%H %gs'</code> — หา SHA ของ stash ที่มีชื่อป้ายกำกับตรงกับที่ตั้งไว้<br/>
    3. <code>git stash apply &lt;sha&gt;</code> (ไม่ใช่ <code>pop</code>) — ดึงกลับมาโดยระบุตัวที่ต้องการเจาะจง ไม่เสี่ยงไปโดนของคนอื่น แล้วค่อย <code>git stash drop &lt;sha&gt;</code> ทิ้งเองทีหลังเมื่อมั่นใจแล้ว`,
    example: `# ตัวอย่างค้นหา stash ของตัวเองด้วยป้ายกำกับ แล้วดึงกลับมาแบบเจาะจง
git stash list --format='%H %gs' | grep "wip-login-fix"
git stash apply <sha-ที่เจอ>`,
    task: `จงเขียนคำสั่งให้สมบูรณ์ โดย:<br/>
    1. เก็บงานค้างไว้ชั่วคราวด้วย <code>git stash push</code> รวมไฟล์ untracked (<code>-u</code>) พร้อมป้ายกำกับ <code>"wip-login-fix"</code>`
  },
  {
    id: "git_hooks",
    meta: "บทที่ 1",
    title: "Git Hooks: เปิดใช้งาน Custom Hooks Directory",
    template: `# หมายเหตุ: repo จริงของ kouen-terminal มี custom hook อยู่ใน .githooks/
#           (commit-msg กันคอมมิต Info.plist หลุดมือโดยไม่ตั้งใจ)
# 1. สั่งให้ git ใช้โฟลเดอร์ .githooks แทนตำแหน่ง default (.git/hooks)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า core.hooksPath...");
      const hasConfig = /git config core\.hooksPath \.githooks/.test(code);
      if (hasConfig) {
        log("✓ ใช้ git config core.hooksPath .githooks ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git config core.hooksPath .githooks\nตัวอย่าง: git config core.hooksPath .githooks");
      }
    },
    hint: "ใช้ git config core.hooksPath .githooks",
    solution: `git config core.hooksPath .githooks`,
    theory: `<strong>Git Hooks</strong> คือสคริปต์ที่ git เรียกอัตโนมัติตอนจุดใดจุดหนึ่งของ workflow (ก่อน commit, ตอนตั้งชื่อ commit message, หลัง commit เสร็จ ฯลฯ) เพื่อบังคับใช้กติกาของทีมโดยไม่ต้องพึ่งวินัยของคนเขียนโค้ดเอง<br/><br/>
    ปัญหา: default hooks อยู่ที่ <code>.git/hooks/</code> ซึ่ง<strong>ไม่ถูก track โดย git</strong> (อยู่ใน .git เอง ไม่ commit ติดไปกับ repo) แปลว่าถ้าตั้ง hook ไว้ที่เครื่องตัวเอง คนอื่น clone repo ไปจะไม่ได้ hook นั้นด้วยเลย<br/><br/>
    ทางแก้จริงที่ใช้ในโปรเจก kouen-terminal (บันทึกไว้ใน CLAUDE.md ของ repo): เก็บ hook ไว้ในโฟลเดอร์ที่ถูก track ปกติ (<code>.githooks/</code>) แล้วสั่ง <code>git config core.hooksPath .githooks</code> บอก git ให้มองหา hook ที่โฟลเดอร์นี้แทน — วิธีนี้ทำให้ hook เดินทางไปกับ repo ได้ทุก clone (ทุกคนต้องรันคำสั่งนี้ 1 ครั้งหลัง clone)<br/><br/>
    ตัวอย่างจริงของ <code>.githooks/commit-msg</code> ใน kouen: เช็คว่าไฟล์ <code>Info.plist</code> ถูก stage ไว้หรือไม่ ถ้าใช่แต่ commit message ไม่มีคำว่า "version"/"bump"/"release" จะ<strong>บล็อกการ commit</strong> ทันที (ป้องกันเหตุการณ์ที่เคยเกิดจริง: commit ธรรมดาดันไปทับไฟล์เวอร์ชันโดยไม่ตั้งใจ)`,
    example: `# ตัวอย่างเนื้อหาจริงบางส่วนของ .githooks/commit-msg
STAGED=$(git diff --cached --name-only)
if echo "$STAGED" | grep -q "Info.plist"; then
  # เช็ค commit message ว่ามีคำเกี่ยวกับ version หรือไม่ ถ้าไม่มีให้ exit 1 (บล็อก commit)
  :
fi`,
    task: `จงเขียนคำสั่งให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า <code>core.hooksPath</code> ให้ชี้ไปที่โฟลเดอร์ <code>.githooks</code> แทน default`
  },
  {
    id: "vim_survival",
    meta: "บทที่ 2",
    title: "Vim Survival: ติดอยู่ใน Editor ตอน git commit ทำไง",
    template: `# สถานการณ์: พิมพ์ git commit เฉยๆ (ไม่ใส่ -m) แล้วหลุดเข้า Vim โดยไม่ได้ตั้งใจ
# 1. เข้าสู่โหมด Insert แล้วพิมพ์ข้อความ commit message ว่า 'fix: correct typo'
# WRITE YOUR CODE HERE


# 2. ออกจากโหมด Insert กลับสู่ Normal mode แล้วบันทึก + ออกจาก Vim
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasInsert = lines.some(l => l === 'i');
      const hasMessage = lines.some(l => l === 'fix: correct typo');
      const hasEsc = lines.some(l => /^(<Esc>|Esc)$/i.test(l));
      const hasWq = lines.some(l => l === ':wq');

      if (!hasInsert) {
        throw new Error("ไม่พบคำสั่งเข้าโหมด Insert\nตัวอย่าง: พิมพ์ i ในบรรทัดแรก");
      }
      if (!hasMessage) {
        throw new Error("ไม่พบข้อความ commit message 'fix: correct typo'");
      }
      if (!hasEsc) {
        throw new Error("ไม่พบคำสั่งออกจากโหมด Insert\nตัวอย่าง: พิมพ์ <Esc>");
      }
      if (!hasWq) {
        throw new Error("ไม่พบคำสั่งบันทึก+ออก\nตัวอย่าง: พิมพ์ :wq");
      }
      log("✓ ลำดับคีย์ i → พิมพ์ข้อความ → Esc → :wq ถูกต้อง");
    },
    hint: "ลำดับคีย์คือ: i (ขึ้นบรรทัดใหม่) แล้วพิมพ์ fix: correct typo แล้วกด <Esc> แล้วพิมพ์ :wq",
    solution: `i
fix: correct typo
<Esc>
:wq`,
    theory: `Vim เป็น <strong>Modal Editor</strong> — ปุ่มเดียวกันทำงานต่างกันขึ้นอยู่กับ "โหมด" ที่อยู่ ต่างจาก editor ทั่วไปที่พิมพ์แล้วเข้าไปเป็นตัวอักษรทันที<br/><br/>
    1. <strong>Normal mode</strong> (โหมดเริ่มต้นเสมอ) — ปุ่มคือ "คำสั่ง" ไม่ใช่ตัวอักษร (เช่น <code>dd</code> ลบทั้งบรรทัด, <code>i</code> ไม่ได้พิมพ์ตัว i แต่สั่งเข้า Insert mode)<br/>
    2. <strong>Insert mode</strong> (กด <code>i</code> เพื่อเข้า) — ปุ่มคือตัวอักษรจริงเหมือน editor ทั่วไป<br/>
    3. กลับ Normal mode ด้วย <code>&lt;Esc&gt;</code> เสมอ ไม่ว่าจะอยู่โหมดไหน<br/>
    4. คำสั่งขึ้นต้นด้วย <code>:</code> (Ex command) พิมพ์ได้เฉพาะตอนอยู่ Normal mode: <code>:wq</code> (write + quit บันทึกแล้วออก), <code>:q!</code> (quit ทิ้งโดยไม่บันทึก ใช้ตอนพิมพ์ผิดทั้งหมดอยากเริ่มใหม่)<br/><br/>
    เหตุการณ์ที่พบบ่อยที่สุด: พิมพ์ <code>git commit</code> เฉยๆ (ลืมใส่ <code>-m "ข้อความ"</code>) ระบบเปิด Vim (หรือ editor ที่ตั้งไว้ใน <code>$EDITOR</code>) ให้พิมพ์ commit message — คนที่ไม่คุ้น Vim มักติดอยู่เพราะพิมพ์อะไรก็ไม่ขึ้น (เพราะยังอยู่ Normal mode ต้องกด <code>i</code> ก่อน) หรือกด <code>Ctrl+C</code>/ปิดหน้าต่างแทนซึ่งมักทำให้ terminal ค้าง`,
    example: `# ถ้าพิมพ์ผิดทั้งหมดอยากยกเลิก ไม่บันทึกอะไรเลย ออกจาก Vim แบบทิ้งทุกอย่าง
<Esc>
:q!`,
    task: `จงเขียนลำดับคีย์ Vim ให้สมบูรณ์ โดย:<br/>
    1. กด <code>i</code> เข้าโหมด Insert แล้วพิมพ์ <code>fix: correct typo</code><br/>
    2. กด <code>&lt;Esc&gt;</code> กลับ Normal mode แล้วพิมพ์ <code>:wq</code> เพื่อบันทึก+ออก`
  },
  {
    id: "vim_search_replace",
    meta: "บทที่ 3",
    title: "Vim Search & Replace: แก้ Config ไฟล์เร็วๆ ผ่าน SSH",
    template: `# สถานการณ์: ต้องเปลี่ยนค่า port ทุกจุดในไฟล์ config จาก 3000 เป็น 3001 ผ่าน SSH (ไม่มี GUI editor)
# 1. เขียนคำสั่ง Vim แบบ Ex command แทนที่คำว่า 3000 เป็น 3001 ทุกจุด ทั้งไฟล์
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง Search & Replace...");
      const hasSubstitute = /:%s\/3000\/3001\/g/.test(code);
      if (hasSubstitute) {
        log("✓ ใช้ :%s/3000/3001/g ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง :%s/3000/3001/g\nตัวอย่าง: :%s/3000/3001/g");
      }
    },
    hint: "ใช้ :%s/3000/3001/g",
    solution: `:%s/3000/3001/g`,
    theory: `<strong>Ex command</strong> รูปแบบ <code>:s/pattern/replacement/flags</code> คือคำสั่ง find & replace ของ Vim ใช้ได้เฉพาะตอนอยู่ Normal mode<br/><br/>
    ส่วนประกอบ: <code>:%s/3000/3001/g</code><br/>
    1. <code>%</code> — ขอบเขต "ทั้งไฟล์" (ทุกบรรทัด) ถ้าไม่ใส่ <code>%</code> จะแทนที่แค่บรรทัดปัจจุบันบรรทัดเดียว<br/>
    2. <code>s</code> — คำสั่ง substitute<br/>
    3. <code>3000</code> — pattern ที่ต้องการค้นหา (รองรับ regex ด้วย)<br/>
    4. <code>3001</code> — ข้อความที่จะแทนที่<br/>
    5. <code>g</code> — global flag: แทนที่<strong>ทุกจุดที่เจอในแต่ละบรรทัด</strong> ถ้าไม่ใส่ <code>g</code> จะแทนแค่จุดแรกที่เจอต่อบรรทัดเท่านั้น (บั๊กที่พบบ่อย: ลืมใส่ <code>g</code> แล้วงงว่าทำไมยังเหลือค่าเก่าอยู่บางจุด)<br/><br/>
    ใช้บ่อยตอนต้อง SSH เข้าเซิร์ฟเวอร์ที่ไม่มี GUI editor แล้วต้องแก้ config/log ไฟล์ด่วนๆ`,
    example: `# ตัวอย่างแทนที่เฉพาะบรรทัดที่ 5-10 เท่านั้น (ไม่ใช้ % ทั้งไฟล์)
:5,10s/localhost/127.0.0.1/g`,
    task: `จงเขียนคำสั่ง Vim ให้สมบูรณ์ โดย:<br/>
    1. แทนที่ <code>3000</code> เป็น <code>3001</code> ทุกจุด ทั้งไฟล์ ด้วย <code>:%s/.../.../g</code>`
  },
  {
    id: "unix_safe_script",
    meta: "บทที่ 4",
    title: "Unix Shell: Safe Script Header ที่ควรมีทุกไฟล์",
    template: `#!/usr/bin/env bash
# 1. เพิ่ม safety header ที่ทำให้ script หยุดทันทีเมื่อเจอ error, ตัวแปรไม่ได้ประกาศ, หรือ pipe ล้มเหลว
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Safety Header...");
      const hasSet = /set -euo pipefail/.test(code);
      if (hasSet) {
        log("✓ ใช้ set -euo pipefail ถูกต้อง");
      } else {
        throw new Error("ไม่พบ set -euo pipefail\nตัวอย่าง: set -euo pipefail");
      }
    },
    hint: "ใช้ set -euo pipefail",
    solution: `#!/usr/bin/env bash
set -euo pipefail`,
    theory: `Bash แบบ default นั้น "ใจดีเกินไป" — รันคำสั่งพัง ก็ยังรันบรรทัดถัดไปต่อเหมือนไม่มีอะไรเกิดขึ้น สคริปต์ทุกไฟล์ใน <code>Scripts/</code> ของ kouen-terminal จริง (24 ไฟล์) เริ่มต้นด้วยบรรทัดเดียวกันหมด: <code>set -euo pipefail</code><br/><br/>
    แยกทีละ flag:<br/>
    1. <strong><code>-e</code></strong> (errexit): หยุด script ทันทีที่คำสั่งไหนคืนค่า exit code ไม่ใช่ 0 — ไม่มี flag นี้ script จะรันต่อแม้คำสั่งก่อนหน้าจะพัง อาจทำงานต่อบนสถานะที่ผิดพลาดโดยไม่รู้ตัว<br/>
    2. <strong><code>-u</code></strong> (nounset): error ทันทีถ้าอ้างอิงตัวแปรที่ไม่เคยประกาศ — จับ typo ชื่อตัวแปรได้ (เช่นพิมพ์ <code>$FOOBAR</code> ทั้งที่ประกาศไว้เป็น <code>$FOO_BAR</code> ปกติ bash จะแทนที่เป็นค่าว่างเงียบๆ ไม่แจ้งเตือนเลย)<br/>
    3. <strong><code>-o pipefail</code></strong>: ปกติ exit code ของ pipeline (<code>cmd1 | cmd2</code>) จะดูแค่คำสั่งสุดท้าย ถ้า <code>cmd1</code> พังแต่ <code>cmd2</code> สำเร็จ pipeline จะรายงานว่าสำเร็จทั้งที่จริงพังไปแล้วครึ่งทาง — flag นี้แก้ให้ pipeline fail ทันทีถ้ามีคำสั่งไหนใน pipe พัง`,
    example: `#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
# จากนี้ไปถ้าคำสั่งไหนพัง script จะหยุดทันที ไม่รันบรรทัดถัดไปทับสถานะผิดพลาด`,
    task: `จงเขียน Header ให้สมบูรณ์ โดย:<br/>
    1. เพิ่ม <code>set -euo pipefail</code> ต่อจาก shebang เพื่อให้ script ปลอดภัยขึ้น`
  },
  {
    id: "unix_grep_pipe",
    meta: "บทที่ 5",
    title: "Unix Pipe + grep: เช็คว่าไฟล์อันตรายถูก Stage ไว้ไหม",
    template: `# หมายเหตุ: บรรทัดนี้ปรับจาก .githooks/commit-msg จริงของ kouen-terminal
# 1. เช็คว่าไฟล์ที่ staged ไว้ (git diff --cached --name-only) มีคำว่า "Info.plist" อยู่หรือไม่
#    (แบบเงียบ ไม่ print อะไร เอาไว้เช็คแค่ exit code สำหรับ if condition)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการต่อ Pipe + grep...");
      const hasPipe = /git diff --cached --name-only\s*\|\s*grep -q\s+["']Info\.plist["']/.test(code);
      if (hasPipe) {
        log("✓ ใช้ git diff --cached --name-only | grep -q \"Info.plist\" ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git diff --cached --name-only | grep -q \"Info.plist\"\nตัวอย่าง: git diff --cached --name-only | grep -q \"Info.plist\"");
      }
    },
    hint: "ใช้ git diff --cached --name-only | grep -q \"Info.plist\"",
    solution: `git diff --cached --name-only | grep -q "Info.plist"`,
    theory: `<strong>Pipe (<code>|</code>)</strong> ส่ง stdout ของคำสั่งฝั่งซ้ายไปเป็น stdin ให้คำสั่งฝั่งขวา — <code>git diff --cached --name-only</code> พิมพ์รายชื่อไฟล์ที่ staged ไว้ (คนละไฟล์ต่อบรรทัด) แล้วส่งต่อให้ <code>grep</code> ค้นหา<br/><br/>
    <strong><code>grep -q</code></strong> (quiet) ไม่พิมพ์อะไรออกมาเลย แค่ตั้งค่า <strong>exit code</strong>: เจอ = 0 (สำเร็จ), ไม่เจอ = 1 (ล้มเหลว) — ออกแบบมาให้ใช้ในเงื่อนไข <code>if</code> โดยเฉพาะ ไม่ต้องมานั่ง parse ข้อความเอง:<br/><br/>
    <code>if git diff --cached --name-only | grep -q "Info.plist"; then<br/>
    &nbsp;&nbsp;echo "พบไฟล์ Info.plist ถูก stage ไว้"<br/>
    fi</code><br/><br/>
    บรรทัดนี้ปรับมาจากโค้ดจริงของ <code>.githooks/commit-msg</code> ในโปรเจก kouen-terminal ซึ่งใช้เทคนิคเดียวกัน (เก็บผลลัพธ์ไว้ในตัวแปรก่อนแล้วค่อย echo ไปป้อน grep) เพื่อเช็คก่อนบล็อกการ commit ที่อาจทำให้ไฟล์เวอร์ชันเสียหายโดยไม่ตั้งใจ`,
    example: `# ตัวอย่างใช้ผลจาก grep -q ในเงื่อนไข if จริง (ต่อยอดจาก commit-msg hook)
if git diff --cached --name-only | grep -q "Info.plist"; then
  echo "🛑 พบ Info.plist ถูก stage ไว้ — ตรวจสอบก่อน commit"
  exit 1
fi`,
    task: `จงเขียนคำสั่งให้สมบูรณ์ โดย:<br/>
    1. ต่อ <code>git diff --cached --name-only</code> ด้วย pipe เข้า <code>grep -q "Info.plist"</code> เพื่อเช็คแบบเงียบว่าไฟล์นี้ถูก stage ไว้หรือไม่`
  }
];

// Application state
let currentLessonIndex = 0;
let completedLessons = {}; // tracks lessonId -> boolean

// Initialize the app
function initApp() {
  renderLessonList();
  loadLesson(currentLessonIndex);
  updateProgressBar();

  // Set up lesson menu toggle (overlay drawer)
  const toggleBtn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });

    // Close the drawer when clicking outside of it
    document.addEventListener('click', (e) => {
      if (!sidebar.classList.contains('show')) return;
      if (sidebar.contains(e.target) || toggleBtn.contains(e.target)) return;
      sidebar.classList.remove('show');
    });
  }

  // Sync tab focus and prevent tab exit
  const textarea = document.getElementById('editor-textarea');
  if (textarea) {
    textarea.addEventListener('keydown', handleTextareaKeydown);
    textarea.addEventListener('input', updateGutter);
    textarea.addEventListener('scroll', syncGutterScroll);
  }
}

// Keydown handler to prevent tab key escaping the editor
function handleTextareaKeydown(e) {
  const textarea = e.target;
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Insert 2 spaces
    textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);

    // Move cursor
    textarea.selectionStart = textarea.selectionEnd = start + 2;
    updateGutter();
  }

  // CMD/Ctrl + Enter shortcut to run tests
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    runSandboxCode();
  }
}

// Synced scroll between textarea and line numbers gutter
function syncGutterScroll(e) {
  const gutter = document.getElementById('editor-gutter');
  if (gutter) gutter.scrollTop = e.target.scrollTop;
}

// Render line numbers in the gutter
function updateGutter() {
  const textarea = document.getElementById('editor-textarea');
  const gutter = document.getElementById('editor-gutter');
  if (!textarea || !gutter) return;

  const lineCount = textarea.value.split('\n').length;
  const numbers = [];
  for (let i = 1; i <= lineCount; i++) {
    numbers.push(`<div>${i}</div>`);
  }
  gutter.innerHTML = numbers.join('');
}

// Render the sidebar list
function renderLessonList() {
  const listContainer = document.getElementById('lesson-list');
  if (!listContainer) return;

  listContainer.innerHTML = LESSONS.map((lesson, idx) => {
    const isCompleted = isLessonCompleted(lesson.id);
    const activeClass = idx === currentLessonIndex ? 'active' : '';
    const completedClass = isCompleted ? 'completed' : '';

    return `
      <button class="lesson-item ${activeClass} ${completedClass}" onclick="selectLesson(${idx})">
        <div class="lesson-item-meta">
          <span>${lesson.meta}</span>
          <span class="check-icon">✓ ผ่านการประเมิน</span>
        </div>
        <div class="lesson-item-title">${lesson.title}</div>
      </button>
    `;
  }).join('');
}

// Select a lesson from sidebar
function selectLesson(idx) {
  currentLessonIndex = idx;
  renderLessonList();
  loadLesson(idx);

  // Hide sidebar after selection (always an overlay drawer now)
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('show');
  }
}

// Load lesson content and reset editor
function loadLesson(idx) {
  const lesson = LESSONS[idx];
  const titleContainer = document.getElementById('current-lesson-title');
  const bodyContainer = document.getElementById('lesson-body');
  const textarea = document.getElementById('editor-textarea');
  const overlay = document.getElementById('lesson-overlay');

  if (titleContainer) titleContainer.innerText = lesson.title;

  // Build premium structured explain-demonstrate-practice blocks
  if (bodyContainer) {
    bodyContainer.innerHTML = `
      <div class="content-block theory">
        <div class="content-block-title">📘 คำอธิบาย (Theory)</div>
        <div class="content-text">${lesson.theory}</div>
      </div>
      <div class="content-block example">
        <div class="content-block-title">💻 โค้ดตัวอย่าง (Example)</div>
        <div class="content-text"><pre><code>${escapeHtml(lesson.example)}</code></pre></div>
      </div>
      <div class="content-block task">
        <div class="content-block-title">🎯 โจทย์ปฏิบัติการ (Challenge Task)</div>
        <div class="content-text">${lesson.task}</div>
      </div>
    `;
  }

  // Reset overlay
  if (overlay) overlay.classList.remove('show');

  // Restore code if edited or load default template
  const savedCode = localStorage.getItem(`cli_sandbox_code_${lesson.id}`);
  if (textarea) {
    textarea.value = savedCode !== null ? savedCode : lesson.template;
    updateGutter();
  }

  // Reset Terminal output
  const terminal = document.getElementById('terminal-body');
  if (terminal) {
    terminal.innerHTML = `<div class="terminal-line text-muted">พร้อมสำหรับรันการทดสอบ... เขียนโค้ดด้านบนแล้วกด Run Tests</div>`;
  }
}

// Helper to escape HTML tags inside code blocks
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Show lesson Hint
function showLessonHint() {
  const lesson = LESSONS[currentLessonIndex];
  showDialog("💡 คำแนะนำช่วยเหลือ (Hint)", lesson.hint, false);
}

// Show lesson Solution
function showLessonSolution() {
  const lesson = LESSONS[currentLessonIndex];
  showDialog("🔑 เฉลยคำตอบ (Solution)", lesson.solution, true);
}

// Show custom dialog modal
function showDialog(title, content, showAction) {
  const overlay = document.getElementById('dialog-overlay');
  const titleEl = document.getElementById('dialog-title');
  const contentEl = document.getElementById('dialog-content');
  const actionBtn = document.getElementById('dialog-action-btn');

  if (!overlay || !titleEl || !contentEl || !actionBtn) return;

  titleEl.innerText = title;
  contentEl.innerText = content;

  if (showAction) {
    actionBtn.style.display = 'block';
    actionBtn.onclick = () => {
      applySolution(content);
      closeDialog();
    };
  } else {
    actionBtn.style.display = 'none';
  }

  overlay.classList.add('show');
}

// Close dialog modal
function closeDialog() {
  const overlay = document.getElementById('dialog-overlay');
  if (overlay) overlay.classList.remove('show');
}

// Paste the solution directly into the editor
function applySolution(code) {
  const textarea = document.getElementById('editor-textarea');
  if (textarea) {
    textarea.value = code;
    updateGutter();

    const terminal = document.getElementById('terminal-body');
    if (terminal) {
      terminal.innerHTML += `<div class="terminal-line info">[System] ทำการป้อนโค้ดเฉลยลงใน Editor อัตโนมัติเรียบร้อยแล้ว</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }
  }
}

// Check if lesson is marked completed in localStorage
function isLessonCompleted(lessonId) {
  return localStorage.getItem('cli_course_completed_' + lessonId) === 'true';
}

// Mark lesson completed
function setLessonCompleted(lessonId) {
  const alreadyDone = isLessonCompleted(lessonId);
  localStorage.setItem('cli_course_completed_' + lessonId, 'true');
  renderLessonList();
  updateProgressBar();
  if (!alreadyDone) showXPToast();
}

// Show a floating "+10 XP" toast on first-time lesson completion
function showXPToast(amount = 10) {
  const toast = document.createElement('div');
  toast.className = 'xp-toast';
  toast.textContent = `⚡ +${amount} XP`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('xp-toast-out'), 1800);
  setTimeout(() => toast.remove(), 2200);
}

// Update overall progress bar
function updateProgressBar() {
  const completedCount = LESSONS.filter(l => isLessonCompleted(l.id)).length;
  const percent = Math.round((completedCount / LESSONS.length) * 100);

  const fill = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-label');

  if (fill) fill.style.width = percent + '%';
  if (label) label.innerText = `${completedCount} / ${LESSONS.length} บทเรียน`;
}

// Sandbox compilation and execution evaluation
function runSandboxCode() {
  const lesson = LESSONS[currentLessonIndex];
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal || !nextLessonBtn || !overlay) return;

  const userCode = textarea.value;

  // Save user code state
  localStorage.setItem(`cli_sandbox_code_${lesson.id}`, userCode);

  // Start compiling animation log in terminal
  terminal.innerHTML = `
    <div class="terminal-line info">[Shell] กำลังตรวจสอบคำสั่ง...</div>
    <div class="terminal-line info">bash ${lesson.id}.sh</div>
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
      // Execute the validator function of the current lesson
      lesson.validate(userCode, log);

      // Success logs
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
        <div class="terminal-line success">exit code: 0</div>
      `;

      // Mark as completed
      setLessonCompleted(lesson.id);

      // Show next lesson modal overlay
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
      // Print compilation errors in red in the terminal
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">ข้อผิดพลาด: ${err.message.replace(/\n/g, '<br/>')}</div>
      `;
    }
    terminal.scrollTop = terminal.scrollHeight;
  }, 600);
}

// Reset course progress
function resetCourse() {
  if (confirm("คุณต้องการล้างประวัติการเขียนและล้างความคืบหน้าทั้งหมดเพื่อเริ่มต้นใหม่ใช่หรือไม่?")) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cli_course_completed_') || key.startsWith('cli_sandbox_code_'))) {
        localStorage.removeItem(key);
      }
    }
    currentLessonIndex = 0;
    initApp();
  }
}

// Show graduation final messages
function showGraduationMessage() {
  const terminal = document.getElementById('terminal-body');
  if (!terminal) return;

  let totalCorrect = LESSONS.filter(l => isLessonCompleted(l.id)).length;

  terminal.innerHTML = `
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Git, Vim & Unix Cheat Sheet แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วกับคำสั่งพื้นฐานที่ QA ใช้บ่อยแต่ลืมง่าย — git stash, git hooks, Vim survival, และ Unix pipe/grep!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

// Run on window boot
window.onload = initApp;
