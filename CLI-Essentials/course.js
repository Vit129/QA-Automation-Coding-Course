(function() {
// Git, Vim & Unix Cheat Sheet Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/kouen-terminal/ repo's real .githooks/
// and Scripts/*.sh files where real material exists. Vim lessons are generic/universal —
// neither reference project has a .vimrc, so those two teach the standard survival skill
// instead (this course's own CLAUDE.md conventions call the same tradeoff out explicitly
// when no project-specific grounding exists for a topic). The lazygit lesson/notes are
// generic tool intro too — no reference repo pins lazygit as required tooling.

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
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasStash = /git stash push\s+-u\s+-m\s+["']wip-login-fix["']/.test(activeCode);
      if (hasStash) {
        log("✓ ใช้ git stash push -u -m \"wip-login-fix\" ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git stash push -u -m \"wip-login-fix\"\nตัวอย่าง: git stash push -u -m \"wip-login-fix\"");
      }
    },
    hint: "นึกถึงคำสั่ง git ที่เก็บงานค้างไว้ชั่วคราว ต้องมี flag ที่รวมไฟล์ untracked เข้าไปด้วย และ flag ที่ตั้งป้ายกำกับข้อความให้จำได้ทีหลัง",
    solution: `git stash push -u -m "wip-login-fix"`,
    theory: `<strong>git stash</strong> เก็บงานที่ยังไม่พร้อม commit ไว้ชั่วคราว แล้วคืน working tree ให้สะอาดเพื่อสลับไปทำงานอื่นก่อน<br/><br/>
    <strong>ห้ามใช้ <code>git stash</code>/<code>git stash pop</code> แบบเปล่าๆ ถ้าทำงานพร้อมกันหลาย session/worktree</strong> เพราะ stash stack เป็น stack เดียวใช้ร่วมกันทั้ง repo — ถ้ามีคนอื่น (หรือ agent อื่น) stash ไว้ก่อนหน้า <code>git stash pop</code> เปล่าๆ อาจไปดึงของคนอื่นออกมาโดยไม่ตั้งใจ<br/><br/>
    วิธีที่ปลอดภัยกว่า:<br/>
    1. <code>git stash push -u -m "&lt;ป้ายกำกับ&gt;"</code> — <code>-u</code> รวมไฟล์ untracked ด้วย (ไฟล์ใหม่ที่ยังไม่ได้ add) <code>-m</code> ตั้งชื่อป้ายกำกับให้หาเจอง่ายทีหลัง<br/>
    2. <code>git stash list --format='%H %gs'</code> — หา SHA ของ stash ที่มีชื่อป้ายกำกับตรงกับที่ตั้งไว้<br/>
    3. <code>git stash apply &lt;sha&gt;</code> (ไม่ใช่ <code>pop</code>) — ดึงกลับมาโดยระบุตัวที่ต้องการเจาะจง ไม่เสี่ยงไปโดนของคนอื่น แล้วค่อย <code>git stash drop &lt;sha&gt;</code> ทิ้งเองทีหลังเมื่อมั่นใจแล้ว<br/><br/>
    <strong>lazygit:</strong> ทำสิ่งเดียวกันนี้แบบเห็นภาพชัดกว่า — กด <code>s</code> ตรงไฟล์ที่ต้องการ stash, panel stash (มุมล่างซ้าย) แสดงรายการ label ทั้งหมดให้เลือกด้วยตา ไม่ต้องจำ SHA เอง`,
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
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasConfig = /git config core\.hooksPath \.githooks\b/.test(activeCode);
      if (hasConfig) {
        log("✓ ใช้ git config core.hooksPath .githooks ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git config core.hooksPath .githooks\nตัวอย่าง: git config core.hooksPath .githooks");
      }
    },
    hint: "นึกถึงคำสั่งตั้งค่า config ของ git (git config) แล้วหา key ที่ควบคุมว่า git จะไปหา hook scripts จากโฟลเดอร์ไหน จากนั้นชี้ไปที่โฟลเดอร์ .githooks",
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
    id: "git_init",
    meta: "บทที่ 2",
    title: "Git Init: เริ่มต้น Repository ใหม่",
    template: `# สถานการณ์: มีโฟลเดอร์โปรเจคใหม่ ยังไม่มี git track อยู่เลย
# 1. เริ่มต้น git repository ในโฟลเดอร์ปัจจุบัน
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git init...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasInit = /git init\b/.test(activeCode);
      if (hasInit) {
        log("✓ ใช้ git init ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git init\nตัวอย่าง: git init");
      }
    },
    hint: "นึกถึงคำสั่งพื้นฐานที่สุดของ git ที่ใช้เริ่มสร้าง repository ใหม่เอี่ยมในโฟลเดอร์ปัจจุบัน ไม่ต้องมี flag หรือ argument ใดๆ เพิ่ม",
    solution: `git init`,
    theory: `<strong>git init</strong> สร้างโฟลเดอร์ <code>.git/</code> ซ้อนในโฟลเดอร์ปัจจุบัน เริ่มต้น tracking repo ใหม่ตั้งแต่ศูนย์ — ทำครั้งเดียวตอนเริ่มโปรเจคใหม่ที่ยังไม่มี git มาก่อน<br/><br/>
    ถ้าโปรเจคมี remote (GitHub/GitLab) อยู่แล้วและต้องการโค้ดที่มีอยู่ ให้ใช้ <code>git clone &lt;url&gt;</code> แทน — ไม่ใช่ <code>git init</code> ตามด้วย <code>git remote add</code> เอง (clone ทำสองอย่างในคำสั่งเดียว: init + ผูก remote + ดึงโค้ดมาครบ)<br/><br/>
    หลัง <code>git init</code> repo จะยังไม่มี commit ใดๆ เลย (<code>git status</code> จะบอกว่า "No commits yet") — git สมัยใหม่ (2.28+) จะตั้งชื่อ default branch เป็น <code>main</code> ให้อัตโนมัติ`,
    example: `# เช็คว่า repo เพิ่ง init เสร็จ ยังไม่มี commit ใดๆ
git status`,
    task: `จงเขียนคำสั่งเริ่มต้น git repository ใหม่ในโฟลเดอร์ปัจจุบัน`
  },
  {
    id: "git_fetch",
    meta: "บทที่ 3",
    title: "Git Fetch: ดึงข้อมูลใหม่จาก Remote แบบปลอดภัย (ไม่ Merge อัตโนมัติ)",
    template: `# สถานการณ์: อยากรู้ว่า origin/main มีการเปลี่ยนแปลงใหม่มั้ย ก่อนจะ merge เข้าโค้ดตัวเอง
# 1. ดึงข้อมูลล่าสุดของ branch main จาก origin (ไม่ merge เข้า branch ปัจจุบัน)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git fetch...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFetch = /git fetch\s+origin\s+main\b/.test(activeCode);
      if (hasFetch) {
        log("✓ ใช้ git fetch origin main ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git fetch origin main\nตัวอย่าง: git fetch origin main");
      }
    },
    hint: "นึกถึงคำสั่ง git ที่ดึงข้อมูลจาก remote มาเก็บไว้เฉยๆ โดยไม่ merge เข้า branch ปัจจุบัน ระบุชื่อ remote และชื่อ branch ที่ต้องการต่อท้าย",
    solution: `git fetch origin main`,
    theory: `<strong>git fetch</strong> ดึงข้อมูล commit/ref ใหม่จาก remote มาเก็บไว้ (เช่น <code>origin/main</code>) แต่<strong>ไม่แตะ branch ปัจจุบันเลย</strong> — ต่างจาก <code>git pull</code> ที่ fetch+merge ในคำสั่งเดียว ปลอดภัยกว่าเวลาต้องการแค่ "ดูก่อนว่ามีอะไรเปลี่ยนไป" โดยไม่กระทบงานที่ทำค้างอยู่<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/commit-push-merge.sh</code> (ใช้จริงตอน merge worktree เข้า main) เขียนไว้ตรงๆ ว่า <code>git fetch origin main</code> ก่อนจะ <code>git rebase origin/main</code> เสมอ — แยกขั้นตอน "ดึงข้อมูลมาดูก่อน" ออกจาก "เอาไปรวมจริง" ชัดเจน`,
    example: `git fetch origin main
git log HEAD..origin/main --oneline  # ดูว่า main มี commit ใหม่อะไรบ้างที่เรายังไม่มี`,
    task: `จงดึงข้อมูลล่าสุดของ branch main จาก origin โดยไม่ merge เข้า branch ปัจจุบัน`
  },
  {
    id: "git_pull",
    meta: "บทที่ 4",
    title: "Git Pull: Fetch + Rebase ในคำสั่งเดียว",
    template: `# สถานการณ์: push ถูก remote ปฏิเสธเพราะมีคนอื่น push ก่อน ต้องดึงงานใหม่มารวมก่อนค่อย push ซ้ำ
# 1. pull จาก origin branch ชื่อ 'feature/login-fix' แบบ rebase (ไม่สร้าง merge commit)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git pull...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasPull = /git pull\s+--rebase\s+origin\s+feature\/login-fix\b/.test(activeCode);
      if (hasPull) {
        log("✓ ใช้ git pull --rebase origin feature/login-fix ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git pull --rebase origin feature/login-fix\nตัวอย่าง: git pull --rebase origin feature/login-fix");
      }
    },
    hint: "git pull ปกติคือ fetch+merge รวมกัน แต่โจทย์นี้ต้องการไม่ให้เกิด merge commit — มี flag ที่เปลี่ยนวิธีรวม history จาก merge เป็นวางต่อแบบเรียงเส้นตรงแทน ระบุ remote และชื่อ branch ต่อท้ายด้วย",
    solution: `git pull --rebase origin feature/login-fix`,
    theory: `<code>git pull</code> = <code>git fetch</code> + <code>git merge</code> (default) รวมในคำสั่งเดียว — แต่ merge แบบ default สร้าง merge commit พิเศษทุกครั้งที่ history แตกกัน ทำให้ log รกถ้า pull บ่อยๆ ใช้ <code>--rebase</code> แทนเพื่อเอา commit ของเรามาวางต่อจาก origin ใหม่ (history เรียบเป็นเส้นตรง ไม่มี merge commit ปลอมๆ)<br/><br/>
    <strong>Real grounding:</strong> <code>Scripts/commit-push-merge.sh</code> ของ kouen-terminal ใช้จริงตอน push ถูก remote reject (มีคนอื่น push ก่อน):
    <pre><code>if ! git push origin "HEAD:$branch" --force-with-lease; then
  git pull --rebase origin "$branch"
  git push origin "HEAD:$branch" --force-with-lease
fi</code></pre>
    pattern มาตรฐานสำหรับ "sync แล้วลอง push ใหม่"`,
    example: `# ถ้า rebase เจอ conflict ระหว่างทาง แก้ไฟล์แล้ว git add ต่อด้วย
git rebase --continue
# หรือยกเลิกกลับไปจุดก่อน rebase ทั้งหมด
git rebase --abort`,
    task: `จง pull จาก origin branch 'feature/login-fix' แบบ rebase ไม่สร้าง merge commit`
  },
  {
    id: "git_switch",
    meta: "บทที่ 5",
    title: "Git Switch: สลับ/สร้าง Branch แบบสมัยใหม่",
    template: `# สถานการณ์: ต้องเริ่มงานฟีเจอร์ใหม่ อยากสร้าง branch แยกจาก main แล้วสลับเข้าไปทำทันที
# 1. สร้าง branch ใหม่ชื่อ 'feature/login-fix' แล้วสลับเข้าไปทำในคำสั่งเดียว
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git switch...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasSwitch = /git switch\s+-c\s+feature\/login-fix\b/.test(activeCode);
      if (hasSwitch) {
        log("✓ ใช้ git switch -c feature/login-fix ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git switch -c feature/login-fix\nตัวอย่าง: git switch -c feature/login-fix");
      }
    },
    hint: "นึกถึงคำสั่งสมัยใหม่ (git 2.23+) ที่ทำหน้าที่สลับ branch อย่างเดียว แล้วหา flag ตัวย่อที่แปลว่า 'สร้างใหม่' เพื่อสร้าง+สลับในคำสั่งเดียว",
    solution: `git switch -c feature/login-fix`,
    theory: `<strong>git switch</strong> (git 2.23+) คือคำสั่งใหม่แยกหน้าที่ออกจาก <code>git checkout</code> เดิม — checkout เก่าทำได้ทั้ง "สลับ branch" และ "restore ไฟล์" ในคำสั่งเดียวกัน ทำให้สับสน/พิมพ์ path ผิดพลาดกลายเป็นสลับ branch แทนโดยไม่ตั้งใจ <code>switch</code> ทำหน้าที่เดียวชัดเจน: สลับ branch เท่านั้น<br/><br/>
    • <code>git switch &lt;branch&gt;</code> — สลับไป branch ที่มีอยู่แล้ว<br/>
    • <code>git switch -c &lt;new-branch&gt;</code> — สร้างใหม่แล้วสลับเข้าไปทันที (<code>-c</code> = <code>--create</code>)<br/><br/>
    คู่กันกับ <code>git restore &lt;file&gt;</code> ที่แยกหน้าที่ "คืนค่าไฟล์" ออกมาต่างหาก (เดิม <code>git checkout &lt;file&gt;</code> ทำหน้าที่นี้)`,
    example: `git switch main  # สลับกลับไป main (ไม่สร้างใหม่ ไม่มี -c)`,
    task: `จงสร้าง branch ใหม่ชื่อ 'feature/login-fix' แล้วสลับเข้าไปในคำสั่งเดียว`
  },
  {
    id: "git_merge",
    meta: "บทที่ 6",
    title: "Git Merge: รวม Branch เข้าด้วยกัน",
    template: `# สถานการณ์: ทำงานใน feature/login-fix เสร็จแล้ว (สมมติสลับมาอยู่ main แล้ว) ต้องการรวมกลับเข้า main
# 1. merge เอา feature/login-fix เข้ามาที่ branch ปัจจุบัน
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git merge...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasMerge = /git merge\s+feature\/login-fix\b/.test(activeCode);
      if (hasMerge) {
        log("✓ ใช้ git merge feature/login-fix ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git merge feature/login-fix\nตัวอย่าง: git merge feature/login-fix");
      }
    },
    hint: "นึกถึงคำสั่ง git ที่เอา commit จาก branch อื่นมารวมเข้า branch ที่ยืนอยู่ตอนนี้ (ต้องยืนอยู่ branch ปลายทางก่อน) แล้วระบุชื่อ branch ต้นทางที่จะถูกดึงเข้ามาต่อท้าย",
    solution: `git merge feature/login-fix`,
    theory: `<strong>git merge</strong> เอา commit จาก branch อื่นมารวมเข้า branch ปัจจุบัน (ต้องสลับไปอยู่ branch ปลายทางก่อนเสมอ — คำสั่ง merge วิ่ง "เอาเข้ามา" ไม่ใช่ "ส่งออกไป")<br/><br/>
    • <strong>Fast-forward merge:</strong> ถ้า branch ปัจจุบันไม่มี commit ใหม่เลยตั้งแต่แยก branch ออกไป git จะแค่เลื่อน pointer ไปข้างหน้า ไม่มี merge commit เกิดขึ้น<br/>
    • <strong>3-way merge:</strong> ถ้าทั้งสอง branch ต่างมี commit ใหม่ของตัวเอง git จะสร้าง merge commit พิเศษ (มี 2 parent) เพื่อรวม history ทั้งสองเข้าด้วยกัน<br/>
    • ถ้ามีคนแก้ไฟล์บรรทัดเดียวกันจากทั้งสองฝั่ง เกิด <strong>merge conflict</strong> ต้องแก้เองแล้ว <code>git add</code> + <code>git commit</code> ต่อให้จบ<br/><br/>
    <strong>lazygit:</strong> ตอน conflict เกิด ไฟล์ที่ชนจะขึ้นสีแดงในลิสต์ไฟล์ทันที กด Enter เข้าไฟล์นั้นแล้วเลือก merge tool ในตัว (หรือเปิด editor ปกติ) ได้เลย ไม่ต้องพิมพ์ <code>git status</code> ไล่หาว่าไฟล์ไหนชนบ้าง`,
    example: `# เช็คว่า merge จะ fast-forward หรือสร้าง merge commit ก่อนรวมจริง
git merge --no-commit --no-ff feature/login-fix
git merge --abort  # ยกเลิกถ้าแค่อยากลองดูก่อน`,
    task: `จง merge branch feature/login-fix เข้ามาที่ branch ปัจจุบัน`
  },
  {
    id: "git_push",
    meta: "บทที่ 7",
    title: "Git Push: ส่ง Commit ขึ้น Remote พร้อมตั้ง Upstream ครั้งแรก",
    template: `# สถานการณ์: push branch 'feature/login-fix' ขึ้น origin เป็นครั้งแรก (ยังไม่เคยตั้ง upstream)
# 1. push พร้อมตั้งค่า upstream ในคำสั่งเดียว
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git push...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasPush = /git push\s+-u\s+origin\s+feature\/login-fix\b/.test(activeCode);
      if (hasPush) {
        log("✓ ใช้ git push -u origin feature/login-fix ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git push -u origin feature/login-fix\nตัวอย่าง: git push -u origin feature/login-fix");
      }
    },
    hint: "push ครั้งแรกของ branch ใหม่ต้องระบุ remote+branch ชัดเจน แล้วมี flag ตัวย่อที่ผูก local branch เข้ากับ remote branch ไว้ให้เลย (จะได้ไม่ต้องพิมพ์ origin/branch ซ้ำในครั้งถัดไป)",
    solution: `git push -u origin feature/login-fix`,
    theory: `push ครั้งแรกของ branch ใหม่ต้องระบุ remote+branch ชัดเจน แล้วใช้ <code>-u</code> (<code>--set-upstream</code>) ผูก local branch กับ remote branch ไว้ — หลังจากนั้น <code>git push</code>/<code>git pull</code> เปล่าๆ (ไม่ต้องพิมพ์ origin/branch ซ้ำ) จะรู้เองว่าต้องไปที่ไหน<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/commit-push.sh</code> ใช้เป๊ะแบบนี้ทุก commit: <code>git push -u origin "$branch"</code><br/><br/>
    <strong>คำเตือนสำคัญ</strong> (จากกฎ core.md ของ session นี้เอง): ห้าม force-push ไปที่ main/master โดยไม่ได้รับอนุญาต — ถ้าจำเป็นต้อง force push branch ตัวเอง (เช่นหลัง rebase) ให้ใช้ <code>--force-with-lease</code> แทน <code>--force</code> เปล่าๆ เพราะ force-with-lease จะเช็คก่อนว่า remote ไม่ได้ถูกคนอื่น push ทับระหว่างที่เรายังไม่ได้ fetch ล่าสุด (กันเผลอเขียนทับงานคนอื่นโดยไม่รู้ตัว) — <code>Scripts/commit-push-merge.sh</code> ของ kouen ใช้จริง: <code>git push origin "HEAD:$branch" --force-with-lease</code>`,
    example: `# หลัง branch มี upstream แล้ว push เปล่าๆ พอ ไม่ต้องพิมพ์ origin/branch ซ้ำ
git push`,
    task: `จง push branch feature/login-fix ขึ้น origin พร้อมตั้งค่า upstream (-u) ในคำสั่งเดียว`
  },
  {
    id: "git_amend",
    meta: "บทที่ 8",
    title: "Git Commit --amend: แก้ไข Commit ล่าสุดโดยไม่สร้างใหม่",
    template: `# สถานการณ์: เพิ่ง commit ไปแล้วนึกขึ้นได้ว่าพิมพ์ commit message ผิด (ยังไม่ได้ push ออกไปไหน)
# 1. แก้ไข commit ล่าสุดให้ใช้ข้อความใหม่ว่า 'fix: correct login validation logic' แทนข้อความเดิม
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git commit --amend...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasAmend = /git commit\s+--amend\s+-m\s+["']fix: correct login validation logic["']/.test(activeCode);
      if (hasAmend) {
        log("✓ ใช้ git commit --amend -m \"fix: correct login validation logic\" ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git commit --amend -m \"fix: correct login validation logic\"\nตัวอย่าง: git commit --amend -m \"fix: correct login validation logic\"");
      }
    },
    hint: "amend ไม่ใช่คำสั่งแยกของ git แต่เป็น flag ต่อท้าย git commit ที่บอกว่าให้แก้ไข commit ล่าสุดแทนสร้างใหม่ ใช้คู่กับ -m เพื่อตั้งข้อความใหม่ได้เลยในคำสั่งเดียว",
    solution: `git commit --amend -m "fix: correct login validation logic"`,
    theory: `<strong>git commit --amend</strong> ไม่ใช่คำสั่งเดี่ยวๆ (ไม่มี <code>git amend</code>) แต่เป็น<strong>ตัวเลือกของ <code>git commit</code></strong> ที่สั่งว่า "แทนที่จะสร้าง commit ใหม่ ให้ไปแก้ไข commit ล่าสุดแทน" — commit เดิมจะถูกแทนที่ด้วย commit hash ใหม่ทั้งหมด (ไม่ใช่แก้ของเดิม)<br/><br/>
    ใช้งานได้ 2 แบบ:<br/>
    1. <code>git commit --amend -m "ข้อความใหม่"</code> — เปลี่ยนแค่ commit message เท่านั้น<br/>
    2. <code>git add &lt;ไฟล์ที่ลืม&gt; && git commit --amend --no-edit</code> — เพิ่มไฟล์เข้า commit เดิม โดย <code>--no-edit</code> คงข้อความเดิมไว้ ไม่เปิด editor ให้แก้<br/><br/>
    <strong>ข้อควรระวังสำคัญที่สุด:</strong> ห้าม amend commit ที่ <strong>push ไปแล้วและคนอื่นดึงไปใช้ต่อ</strong> เพราะ amend เปลี่ยน commit hash ทำให้ history ของเราไม่ตรงกับที่คนอื่นมีอยู่ในเครื่อง ถ้าจำเป็นต้อง amend commit ที่ push ไปแล้ว (ยังไม่มีใครดึงไปใช้ต่อ) ต้อง force push ด้วย <code>--force-with-lease</code> ตามด้วยเสมอ (ห้ามใช้ <code>--force</code> เปล่าๆ)`,
    example: `# ลืม add ไฟล์เข้า commit ล่าสุด แก้โดยไม่เปลี่ยนข้อความเดิม
git add login.spec.ts
git commit --amend --no-edit`,
    task: `จงแก้ไข commit ล่าสุดให้ใช้ข้อความใหม่ว่า <code>"fix: correct login validation logic"</code> ด้วย <code>git commit --amend -m</code>`
  },
  {
    id: "git_tag_release",
    meta: "บทที่ 9",
    title: "Git Tag: ติด Tag เวอร์ชัน (Semantic Versioning) สำหรับ Release",
    template: `# สถานการณ์: โค้ดบน main พร้อม release เป็นเวอร์ชัน v1.2.0 แล้ว ต้องการติด annotated tag พร้อมข้อความอธิบาย
# 1. สร้าง annotated tag ชื่อ 'v1.2.0' พร้อมข้อความ 'Release v1.2.0: add login retry logic'
# WRITE YOUR CODE HERE


# 2. push tag นั้นขึ้น origin (push ปกติไม่ส่ง tag ไปด้วยอัตโนมัติ)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git tag...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasTag = /git tag\s+-a\s+v1\.2\.0\s+-m\s+["']Release v1\.2\.0: add login retry logic["']/.test(activeCode);
      const hasPush = /git push\s+origin\s+v1\.2\.0\b/.test(activeCode);
      if (!hasTag) {
        throw new Error("ไม่พบคำสั่ง git tag -a v1.2.0 -m \"Release v1.2.0: add login retry logic\"\nตัวอย่าง: git tag -a v1.2.0 -m \"...\"");
      }
      if (!hasPush) {
        throw new Error("ไม่พบคำสั่ง git push origin v1.2.0\nตัวอย่าง: git push origin v1.2.0");
      }
      log("✓ ใช้ git tag -a v1.2.0 -m \"...\" แล้ว push origin v1.2.0 ถูกต้อง");
    },
    hint: "annotated tag ต้องใช้ flag -a ระบุชื่อ tag ตามด้วย -m ใส่ข้อความอธิบาย (เหมือน commit message) จากนั้น git push ธรรมดาไม่ส่ง tag ไปให้อัตโนมัติ ต้องระบุชื่อ tag ต่อท้าย origin ตรงๆ อีกคำสั่งหนึ่ง",
    solution: `git tag -a v1.2.0 -m "Release v1.2.0: add login retry logic"
git push origin v1.2.0`,
    theory: `<strong>git tag</strong> ปักหมุดไว้ที่ commit ใดคอมมิตหนึ่งแบบถาวร ใช้ทำเครื่องหมายจุด release ของ semantic versioning (<code>MAJOR.MINOR.PATCH</code> เช่น <code>v1.2.0</code>: MAJOR เปลี่ยนตอน breaking change, MINOR เปลี่ยนตอนเพิ่มฟีเจอร์ที่ backward-compatible, PATCH เปลี่ยนตอนแก้บั๊กเฉยๆ)<br/><br/>
    Tag มี 2 แบบ:<br/>
    • <strong>Lightweight tag</strong> (<code>git tag v1.2.0</code> เฉยๆ) — แค่ pointer ชี้ไป commit ไม่มี metadata อะไรเพิ่ม<br/>
    • <strong>Annotated tag</strong> (<code>git tag -a v1.2.0 -m "..."</code>) — เก็บผู้สร้าง, วันที่, และข้อความไว้ด้วย เหมือน commit object แยกต่างหาก — <strong>แนะนำให้ใช้แบบนี้เสมอสำหรับ release จริง</strong> เพราะมีข้อมูลตรวจสอบย้อนหลังได้ครบกว่า<br/><br/>
    <strong>ข้อสำคัญที่พลาดกันบ่อย:</strong> <code>git push</code> ธรรมดา<strong>ไม่ส่ง tag ขึ้น remote ให้อัตโนมัติ</strong> ต้องระบุชื่อ tag ต่อท้ายเอง (<code>git push origin v1.2.0</code>) หรือถ้ามีหลาย tag ค้างอยู่อยากส่งพร้อมกันหมดใช้ <code>git push origin --tags</code> (ระวัง: จะ push tag ทุกอันที่มีในเครื่อง ไม่ใช่แค่อันใหม่)<br/><br/>
    บน GitHub/GitLab การ push tag ขึ้นไปมักเป็นจุดเริ่มของ "Release" อัตโนมัติ (ผูก CI ให้ build/deploy ตอนเจอ tag ที่ตรง pattern <code>v*</code>)`,
    example: `# ดู tag ทั้งหมดที่ตรงกับ pattern v1.* ที่มีอยู่ในเครื่อง
git tag -l "v1.*"
# ลบ tag ที่ตั้งผิดทั้ง local และ remote
git tag -d v1.2.0
git push origin --delete v1.2.0`,
    task: `จงเขียนคำสั่งให้ครบ โดย:<br/>
    1. สร้าง annotated tag ชื่อ <code>v1.2.0</code> พร้อมข้อความ <code>"Release v1.2.0: add login retry logic"</code><br/>
    2. push tag นั้นขึ้น <code>origin</code>`
  },
  {
    id: "git_lazygit_intro",
    meta: "บทที่ 10",
    title: "lazygit: ครอบคำสั่ง git ที่เรียนมาทั้งหมดด้วย TUI",
    template: `# สถานการณ์: อยู่ในโฟลเดอร์ repo แล้ว อยากเปิด lazygit ขึ้นมาดูสถานะแบบเห็นภาพ แทนพิมพ์ git status/log ทีละคำสั่ง
# 1. เปิด lazygit
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่งเปิด lazygit...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasLazygit = /^\s*lazygit\s*$/m.test(activeCode);
      if (hasLazygit) {
        log("✓ ใช้คำสั่ง lazygit ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง lazygit\nตัวอย่าง: lazygit");
      }
    },
    hint: "พิมพ์แค่ชื่อโปรแกรมเฉยๆ ไม่ต้องมี flag หรือ argument ใดๆ — lazygit จะอ่าน repo จากโฟลเดอร์ปัจจุบันเอง",
    solution: `lazygit`,
    theory: `<strong>lazygit</strong> คือ TUI (terminal UI) ที่ครอบคำสั่ง git ทั้งหมดที่เรียนมาในบทก่อนหน้า (<code>stash</code>/<code>fetch</code>/<code>pull</code>/<code>switch</code>/<code>merge</code>/<code>push</code>) ให้กด key เดียวแทนพิมพ์คำสั่งยาวๆ ทุกครั้ง โดยไม่ได้แทนที่ความเข้าใจ git command — ต้องรู้ก่อนว่าแต่ละคำสั่งทำอะไรถึงจะกด lazygit ได้อย่างมั่นใจ<br/><br/>
    Layout หลัก (4 panel ซ้าย + diff view ขวา): Status, Files, Local Branches, Commits — เลื่อนด้วยลูกศรหรือ <code>1</code>-<code>5</code> สลับ panel<br/><br/>
    Key ที่ใช้บ่อยที่สุด:<br/>
    • <code>space</code> — stage/unstage ไฟล์ที่เลือกอยู่ (แทน <code>git add</code>)<br/>
    • <code>c</code> — commit (เปิด prompt พิมพ์ commit message)<br/>
    • <code>P</code> (ตัวใหญ่) — push, <code>p</code> (ตัวเล็ก) — pull<br/>
    • <code>s</code> — stash ไฟล์ที่เลือก, panel stash ดูรายการ stash ทั้งหมด<br/>
    • <code>Enter</code> ที่ branch ใน panel Local Branches — switch ไปทันที (แทน <code>git switch</code>)<br/>
    • <code>?</code> — เปิด panel keybinding ทั้งหมด ณ ตำแหน่งที่ยืนอยู่ (context-aware)<br/>
    • <code>q</code> — ออกจากโปรแกรม<br/><br/>
    ข้อดีที่ทำให้เร็วกว่าพิมพ์เอง: เห็น diff ของทุกไฟล์แบบ real-time โดยไม่ต้องพิมพ์ <code>git diff</code>, stage เฉพาะบางส่วนของไฟล์ได้ (partial hunk staging) ด้วย <code>space</code> ในโหมด line-by-line โดยไม่ต้องจำ <code>git add -p</code>`,
    example: `# ติดตั้งผ่าน Homebrew (macOS/Linux)
brew install lazygit
# เปิดจากโฟลเดอร์ repo ปัจจุบัน
lazygit`,
    task: `จงเปิด lazygit ขึ้นมา (พิมพ์ชื่อโปรแกรมเฉยๆ ไม่ต้องมี flag)`
  },
  {
    id: "vim_survival",
    meta: "บทที่ 11",
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
    hint: "จำโหมดของ Vim ให้ได้: ต้องเข้าสู่โหมดที่พิมพ์ตัวอักษรได้ก่อนถึงจะพิมพ์ข้อความได้จริง แล้วต้องกลับสู่โหมดคำสั่งก่อนจะสั่งบันทึก+ออกได้",
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
    id: "vim_navigation",
    meta: "บทที่ 12",
    title: "Vim การเคลื่อนที่พื้นฐาน: h j k l, gg, G, w, b",
    template: `# สถานการณ์: เปิดไฟล์ log ยาวหลายร้อยบรรทัดอยู่ ต้องกระโดดไปดูบรรทัดแรกสุด แล้วไปดูบรรทัดสุดท้ายสุดของไฟล์
# 1. กระโดดไปบรรทัดแรกสุดของไฟล์
# WRITE YOUR CODE HERE


# 2. กระโดดไปบรรทัดสุดท้ายสุดของไฟล์
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasGg = lines.some(l => l === 'gg');
      const hasG = lines.some(l => l === 'G');

      if (!hasGg) {
        throw new Error("ไม่พบคำสั่งกระโดดไปบรรทัดแรกสุด\nตัวอย่าง: พิมพ์ gg ใน Normal mode");
      }
      if (!hasG) {
        throw new Error("ไม่พบคำสั่งกระโดดไปบรรทัดสุดท้ายสุด\nตัวอย่าง: พิมพ์ G (ตัวใหญ่) ใน Normal mode");
      }
      log("✓ ลำดับคีย์ gg → G ถูกต้อง");
    },
    hint: "นึกถึงคำสั่ง Normal mode ที่กดตัวอักษรเดิมซ้ำกัน 2 ครั้งเพื่อไปต้นไฟล์ แล้วตัวอักษรตัวใหญ่ตัวเดียวที่ไปท้ายไฟล์",
    solution: `gg
G`,
    theory: `Vim ไม่จำเป็นต้องใช้ลูกศรเลย — <code>h</code> <code>j</code> <code>k</code> <code>l</code> คือซ้าย/ลง/ขึ้น/ขวา อยู่ตำแหน่งเดียวกับ home row ทำให้ไม่ต้องขยับมือออกจากแป้นพิมพ์หลัก<br/><br/>
    การกระโดดระยะไกลที่ใช้บ่อยที่สุด:<br/>
    • <code>gg</code> — ไปบรรทัดแรกสุดของไฟล์<br/>
    • <code>G</code> — ไปบรรทัดสุดท้ายสุดของไฟล์<br/>
    • <code>5G</code> (ใส่เลขนำหน้า) — ไปบรรทัดที่ 5 โดยตรง<br/>
    • <code>w</code> — กระโดดไปต้นคำถัดไป, <code>b</code> — กระโดดถอยไปต้นคำก่อนหน้า<br/>
    • <code>0</code> — ไปต้นบรรทัด, <code>$</code> — ไปท้ายบรรทัด<br/><br/>
    หลักการ: แทบทุกคำสั่ง Normal mode ใส่ตัวเลขนำหน้าได้เพื่อ "ทำซ้ำกี่ครั้ง" เช่น <code>3w</code> กระโดดไป 3 คำถัดไป — เข้าใจ pattern นี้แล้วจะเดาคำสั่งใหม่ๆ ได้เองโดยไม่ต้องท่องจำทีละตัว`,
    example: `# กระโดดไปบรรทัดที่ 42 ตรงๆ โดยไม่ต้องเลื่อนทีละบรรทัด
42G`,
    task: `จงกระโดดไปบรรทัดแรกสุดของไฟล์ด้วย <code>gg</code> แล้วกระโดดไปบรรทัดสุดท้ายสุดด้วย <code>G</code>`
  },
  {
    id: "vim_search_replace",
    meta: "บทที่ 13",
    title: "Vim Search & Replace: แก้ Config ไฟล์เร็วๆ ผ่าน SSH",
    template: `# สถานการณ์: ต้องเปลี่ยนค่า port ทุกจุดในไฟล์ config จาก 3000 เป็น 3001 ผ่าน SSH (ไม่มี GUI editor)
# 1. เขียนคำสั่ง Vim แบบ Ex command แทนที่คำว่า 3000 เป็น 3001 ทุกจุด ทั้งไฟล์
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง Search & Replace...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasSubstitute = /:%s\/3000\/3001\/g(?![a-zA-Z])/.test(activeCode);
      if (hasSubstitute) {
        log("✓ ใช้ :%s/3000/3001/g ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง :%s/3000/3001/g\nตัวอย่าง: :%s/3000/3001/g");
      }
    },
    hint: "นึกถึง Ex command แบบ substitute ของ Vim (:s/หา/แทน/) แล้วเติมสัญลักษณ์ขอบเขตที่แปลว่า 'ทั้งไฟล์' นำหน้า s และอย่าลืม flag ท้ายสุดที่ทำให้แทนที่ทุกจุดในแต่ละบรรทัด ไม่ใช่แค่จุดแรก",
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
    id: "vim_delete_yank",
    meta: "บทที่ 14",
    title: "Vim ลบ/คัดลอกบรรทัด: dd, yy, p",
    template: `# สถานการณ์: cursor อยู่บรรทัดที่ไม่ต้องการ อยากลบทิ้งแล้ววางกลับที่อื่น
# 1. ลบทั้งบรรทัดที่ cursor อยู่ (เก็บเข้า register อัตโนมัติ)
# WRITE YOUR CODE HERE


# 2. วาง (paste) สิ่งที่เพิ่งลบไปกลับคืนที่บรรทัดถัดจาก cursor
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasDelete = lines.some(l => l === 'dd');
      const hasPaste = lines.some(l => l === 'p');

      if (!hasDelete) {
        throw new Error("ไม่พบคำสั่งลบทั้งบรรทัด\nตัวอย่าง: พิมพ์ dd ใน Normal mode");
      }
      if (!hasPaste) {
        throw new Error("ไม่พบคำสั่งวาง (paste)\nตัวอย่าง: พิมพ์ p ใน Normal mode");
      }
      log("✓ ลำดับคีย์ dd → p ถูกต้อง");
    },
    hint: "นึกถึงคำสั่ง Normal mode ที่ลบทั้งบรรทัดด้วยการกดตัวอักษรเดิมซ้ำ 2 ครั้งติดกัน แล้วคำสั่งวางที่เป็นตัวอักษรเดียว",
    solution: `dd
p`,
    theory: `ใน Normal mode, <code>dd</code> คือคำสั่งลบทั้งบรรทัดที่ cursor อยู่ — ข้อความที่ถูกลบจะเก็บเข้า <strong>register เริ่มต้น</strong> (unnamed register) เหมือน clipboard ชั่วคราว แล้วใช้ <code>p</code> (put/paste) วางกลับได้ทันทีที่บรรทัดถัดจาก cursor (ใช้ <code>P</code> ตัวใหญ่ถ้าอยากวาง<strong>ก่อน</strong>บรรทัด cursor แทน)<br/><br/>
    คำสั่งลบรูปแบบเดียวกันที่ใช้บ่อย: <code>dw</code> (ลบทั้งคำ), <code>d$</code> (ลบถึงท้ายบรรทัด), <code>3dd</code> (ลบ 3 บรรทัดรวด — ใส่ตัวเลขนำหน้าคำสั่งซ้ำกี่รอบก็ได้เกือบทุกคำสั่ง Normal mode)<br/><br/>
    <code>yy</code> (yank) คือคัดลอกทั้งบรรทัดแบบไม่ลบ (เก็บเข้า register เดียวกับ dd) แล้ว <code>p</code> วางได้เหมือนกัน — ต่างจาก <code>dd</code> แค่ตรงที่ต้นฉบับไม่หายไป`,
    example: `# คัดลอก (ไม่ลบ) บรรทัดปัจจุบัน แล้ววาง 2 ครั้งติดกัน
yy
p
p`,
    task: `จงลบทั้งบรรทัดที่ cursor อยู่ด้วย dd แล้ววางกลับด้วย p`
  },
  {
    id: "vim_visual_mode",
    meta: "บทที่ 15",
    title: "Vim Visual Mode: เลือกข้อความก่อนแก้ไข",
    template: `# สถานการณ์: ต้องการลบ 3 บรรทัดติดกันพร้อมกัน แทนที่จะกด dd ทีละบรรทัด 3 รอบ
# 1. เข้าสู่ Visual Line mode (เลือกทีละบรรทัด)
# WRITE YOUR CODE HERE


# 2. เลื่อนลง 2 บรรทัดเพื่อขยายพื้นที่เลือกให้ครอบคลุม 3 บรรทัด (บรรทัดปัจจุบัน + อีก 2 บรรทัดถัดไป)


# 3. ลบข้อความที่เลือกไว้ทั้งหมด
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const vIdx = lines.findIndex(l => l === 'V');
      const jIdx = lines.findIndex((l, i) => i > vIdx && /^j{2}$|^j$/.test(l));
      const jCount = lines.filter(l => l === 'j').length;
      const dIdx = lines.findIndex(l => l === 'd');

      if (vIdx === -1) {
        throw new Error("ไม่พบคำสั่งเข้า Visual Line mode\nตัวอย่าง: พิมพ์ V (ตัวใหญ่) ใน Normal mode");
      }
      if (!(lines.some(l => l === 'jj') || jCount >= 2)) {
        throw new Error("ไม่พบคำสั่งเลื่อนลง 2 บรรทัดเพื่อขยายพื้นที่เลือก\nตัวอย่าง: พิมพ์ jj หรือ j สองครั้ง");
      }
      if (dIdx === -1 || dIdx < vIdx) {
        throw new Error("ไม่พบคำสั่งลบข้อความที่เลือกไว้\nตัวอย่าง: พิมพ์ d หลังเลือกพื้นที่เสร็จแล้ว");
      }
      log("✓ ลำดับคีย์ V → jj → d ถูกต้อง");
    },
    hint: "นึกถึงตัวอักษรตัวใหญ่ตัวเดียวที่เข้าสู่โหมดเลือกแบบทีละบรรทัด จากนั้นเลื่อนลงด้วยคีย์เคลื่อนที่ปกติเพื่อขยายพื้นที่เลือก แล้วจบด้วยคำสั่งลบตัวเดียว (ตัวเดียวกับที่ใช้คู่กับ dd ปกติ แต่ไม่ต้องพิมพ์ซ้ำ)",
    solution: `V
jj
d`,
    theory: `<strong>Visual mode</strong> ให้เลือกข้อความก่อนสั่ง action แทนที่จะเดา motion ล่วงหน้า (เหมือน <code>3dd</code>) — เหมาะกับตอนไม่แน่ใจว่าพื้นที่ที่ต้องการมีกี่บรรทัด/กี่ตัวอักษรกันแน่ เพราะเห็น highlight ที่เลือกไว้แบบ real-time ก่อนตัดสินใจ<br/><br/>
    3 โหมดย่อยของ Visual mode:<br/>
    • <code>v</code> (ตัวเล็ก) — Character-wise: เลือกทีละตัวอักษร<br/>
    • <code>V</code> (ตัวใหญ่) — Line-wise: เลือกทีละบรรทัดเต็ม<br/>
    • <code>Ctrl+v</code> — Block-wise: เลือกเป็นสี่เหลี่ยม (ใช้แก้หลายบรรทัดที่ column เดียวกันพร้อมกัน)<br/><br/>
    หลังเข้า Visual mode แล้ว ใช้คีย์เคลื่อนที่ปกติ (<code>j</code> <code>k</code> <code>w</code> <code>$</code> ฯลฯ) ขยาย/หดพื้นที่ที่เลือกไว้ได้ตามต้องการ จากนั้นกด action ตัวเดียวจบ (ไม่ต้องพิมพ์ซ้ำเหมือน <code>dd</code>):<br/>
    • <code>d</code> — ลบสิ่งที่เลือก<br/>
    • <code>y</code> — คัดลอกสิ่งที่เลือก (yank)<br/>
    • <code>&gt;</code> / <code>&lt;</code> — เพิ่ม/ลด indent ของสิ่งที่เลือก`,
    example: `# เลือกทั้งคำ (character-wise) แล้วคัดลอกแทนลบ
v
w
y`,
    task: `จงเข้าสู่ Visual Line mode ด้วย <code>V</code> แล้วเลื่อนลง 2 บรรทัดด้วย <code>jj</code> แล้วลบข้อความที่เลือกไว้ทั้งหมดด้วย <code>d</code>`
  },
  {
    id: "vim_undo_redo",
    meta: "บทที่ 16",
    title: "Vim Undo/Redo: ย้อนกลับเมื่อพิมพ์ผิด",
    template: `# สถานการณ์: เพิ่งลบ/แก้ไขผิดบรรทัด อยากย้อนกลับ แล้วเปลี่ยนใจอยากทำต่อใหม่
# 1. ย้อนกลับการแก้ไขล่าสุด (undo)
# WRITE YOUR CODE HERE


# 2. เปลี่ยนใจ อยากทำสิ่งที่เพิ่ง undo ไปซ้ำอีกครั้ง (redo)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasUndo = lines.some(l => l === 'u');
      const hasRedo = lines.some(l => /^(ctrl-r|<c-r>|ctrl\+r)$/i.test(l));

      if (!hasUndo) {
        throw new Error("ไม่พบคำสั่ง undo\nตัวอย่าง: พิมพ์ u ใน Normal mode");
      }
      if (!hasRedo) {
        throw new Error("ไม่พบคำสั่ง redo\nตัวอย่าง: พิมพ์ Ctrl+r ใน Normal mode");
      }
      log("✓ ลำดับคีย์ u → Ctrl+r ถูกต้อง");
    },
    hint: "นึกถึงปุ่มเดี่ยวใน Normal mode ที่ใช้ย้อนการแก้ไขล่าสุด แล้วปุ่มผสม Ctrl กับตัวอักษรเดียวที่ทำสิ่งที่เพิ่ง undo ไปซ้ำอีกครั้ง",
    solution: `u
Ctrl+r`,
    theory: `<code>u</code> (undo) ย้อนการแก้ไขล่าสุดกลับไปทีละขั้น ทำซ้ำได้เรื่อยๆ (กด <code>u</code> หลายครั้ง = ย้อนหลายขั้น) — ต่างจาก editor ทั่วไปที่ใช้ Ctrl+Z, Vim ใช้ปุ่ม <code>u</code> เดี่ยวๆ ใน Normal mode<br/><br/>
    <code>Ctrl+r</code> (redo) คือทำสิ่งที่เพิ่ง undo ไปซ้ำอีกครั้ง (ตรงข้ามกับ undo) — สลับ undo/redo ไปมาได้จนกว่าจะแก้ไขอะไรใหม่ (พอพิมพ์อะไรใหม่ history ฝั่ง redo จะถูกล้างทิ้ง)<br/><br/>
    ทั้งสองคำสั่งทำงานได้เฉพาะตอนอยู่ <strong>Normal mode</strong> เท่านั้น (เหมือนคำสั่งอื่นๆ ที่ไม่ใช่ Insert mode)`,
    example: `# undo ย้อนกลับ 3 ขั้นรวดเดียว (ใส่ตัวเลขนำหน้าได้เหมือนคำสั่งอื่น)
3u`,
    task: `จง undo การแก้ไขล่าสุดด้วย u แล้ว redo กลับมาด้วย Ctrl+r`
  },
  {
    id: "unix_safe_script",
    meta: "บทที่ 17",
    title: "Unix Shell: Safe Script Header ที่ควรมีทุกไฟล์",
    template: `#!/usr/bin/env bash
# 1. เพิ่ม safety header ที่ทำให้ script หยุดทันทีเมื่อเจอ error, ตัวแปรไม่ได้ประกาศ, หรือ pipe ล้มเหลว
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Safety Header...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasSet = /set -euo pipefail\b/.test(activeCode);
      if (hasSet) {
        log("✓ ใช้ set -euo pipefail ถูกต้อง");
      } else {
        throw new Error("ไม่พบ set -euo pipefail\nตัวอย่าง: set -euo pipefail");
      }
    },
    hint: "นึกถึงคำสั่ง set ของ bash ที่รวม 3 flag ไว้ด้วยกัน: หยุดทันทีเมื่อคำสั่งพัง, เตือนเมื่ออ้างอิงตัวแปรที่ไม่เคยประกาศ, และจับ error ที่เกิดกลางทาง pipeline ด้วย",
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
    meta: "บทที่ 18",
    title: "Unix Pipe + grep: เช็คว่าไฟล์อันตรายถูก Stage ไว้ไหม",
    template: `# หมายเหตุ: บรรทัดนี้ปรับจาก .githooks/commit-msg จริงของ kouen-terminal
# 1. เช็คว่าไฟล์ที่ staged ไว้ (git diff --cached --name-only) มีคำว่า "Info.plist" อยู่หรือไม่
#    (แบบเงียบ ไม่ print อะไร เอาไว้เช็คแค่ exit code สำหรับ if condition)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการต่อ Pipe + grep...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasPipe = /git diff --cached --name-only\s*\|\s*grep -q\s+["']Info\.plist["']/.test(activeCode);
      if (hasPipe) {
        log("✓ ใช้ git diff --cached --name-only | grep -q \"Info.plist\" ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git diff --cached --name-only | grep -q \"Info.plist\"\nตัวอย่าง: git diff --cached --name-only | grep -q \"Info.plist\"");
      }
    },
    hint: "ต่อคำสั่งที่แสดงรายชื่อไฟล์ staged เข้ากับเครื่องมือค้นหา pattern แบบมาตรฐานผ่าน pipe แล้วใช้ flag ของเครื่องมือนั้นที่ทำให้ทำงานแบบเงียบ (ไม่ print อะไรออกมา แค่ตั้งค่า exit code ไว้เช็คใน if)",
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
  },
  {
    id: "unix_find_files",
    meta: "บทที่ 19",
    title: "Unix find: ค้นหาไฟล์ตามชื่อ/ประเภท (ใช้จริงใน Kouen Build Scripts)",
    template: `# หมายเหตุ: Scripts/run.sh จริงของ kouen-terminal ใช้ find ลบไฟล์ .html ที่ generate ไว้ในโฟลเดอร์ graphify-out ทั้งหมด
# 1. ค้นหาไฟล์ (-type f) ที่ชื่อลงท้าย .html ในโฟลเดอร์ graphify-out แล้วลบทิ้งทันที (-delete)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง find...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFind = /find\s+graphify-out\s+-type\s+f\s+-name\s+['"]?\*\.html['"]?\s+-delete\b/.test(activeCode);
      if (hasFind) {
        log("✓ ใช้ find graphify-out -type f -name '*.html' -delete ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง find graphify-out -type f -name '*.html' -delete\nตัวอย่าง: find graphify-out -type f -name '*.html' -delete");
      }
    },
    hint: "นึกถึงคำสั่งค้นหาไฟล์แบบวนลึกที่มี flag กรองประเภท (เอาเฉพาะไฟล์) และ flag กรองชื่อแบบ wildcard แล้วต่อท้ายด้วย action ที่ลบสิ่งที่เจอทันที",
    solution: `find graphify-out -type f -name '*.html' -delete`,
    theory: `<code>find &lt;path&gt; &lt;เงื่อนไข&gt;</code> ค้นหาไฟล์/โฟลเดอร์แบบวนลึกเข้าไปทุก subdirectory — เงื่อนไขที่ใช้บ่อยสุด:<br/><br/>
    • <code>-type f</code> เอาเฉพาะไฟล์ (ไม่เอาโฟลเดอร์), <code>-type d</code> เอาเฉพาะโฟลเดอร์<br/>
    • <code>-name '&lt;pattern&gt;'</code> กรองด้วยชื่อไฟล์ (รองรับ wildcard <code>*</code> แบบเดียวกับ shell แต่ต้องใส่ quote กันไม่ให้ shell ขยาย <code>*</code> เองก่อนส่งให้ find)<br/>
    • <code>-delete</code> ลบไฟล์ที่เจอทันที (<strong>อันตราย!</strong> ทดสอบด้วย <code>-print</code> ก่อนเสมอถ้าไม่มั่นใจ)<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/run.sh</code> ใช้เป๊ะแบบนี้ตอน refresh graphify: <code>find graphify-out -type f -name '*.html' -delete</code> — ลบไฟล์ report .html เก่าทั้งหมดก่อน generate ใหม่ (ป้องกันของเก่าค้าง)`,
    example: `# ปลอดภัยกว่า: ดูก่อนว่าจะลบอะไรบ้าง ก่อนใส่ -delete จริง
find graphify-out -type f -name '*.html' -print`,
    task: `จงเขียนคำสั่ง find ค้นหาไฟล์ (-type f) ชื่อลงท้าย .html ในโฟลเดอร์ graphify-out แล้วลบทิ้ง (-delete)`
  },
  {
    id: "unix_chmod",
    meta: "บทที่ 20",
    title: "Unix chmod: ให้สิทธิ์ Execute กับ Script",
    template: `# สถานการณ์: เพิ่งเขียน deploy.sh เสร็จ พอสั่งรัน ./deploy.sh กลับเจอ "Permission denied"
# 1. ให้สิทธิ์ execute กับไฟล์ deploy.sh
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง chmod...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasChmod = /chmod\s+\+x\s+deploy\.sh\b/.test(activeCode);
      if (hasChmod) {
        log("✓ ใช้ chmod +x deploy.sh ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง chmod +x deploy.sh\nตัวอย่าง: chmod +x deploy.sh");
      }
    },
    hint: "นึกถึงคำสั่งเปลี่ยนสิทธิ์ไฟล์ของ Unix แล้วหา flag แบบสัญลักษณ์ที่แปลว่า 'เพิ่มสิทธิ์ execute' ต่อท้ายด้วยชื่อไฟล์ที่ต้องการ",
    solution: `chmod +x deploy.sh`,
    theory: `ไฟล์ทุกไฟล์ใน Unix มีสิทธิ์ 3 กลุ่ม: <strong>อ่าน (r)</strong>, <strong>เขียน (w)</strong>, <strong>รัน (x)</strong> — แยกกำหนดแยกกันได้ 3 ระดับ: เจ้าของไฟล์ (user), กลุ่ม (group), และคนอื่นทั้งหมด (others) เช่น <code>-rw-r--r--</code> ที่เห็นจาก <code>ls -l</code> แปลว่า เจ้าของอ่าน+เขียนได้แต่รันไม่ได้ ส่วนกลุ่ม/คนอื่นอ่านได้อย่างเดียว<br/><br/>
    ไฟล์ script ที่เพิ่งสร้างใหม่ (เช่นจาก <code>touch</code> หรือ editor) มักไม่มีสิทธิ์ execute ติดมาด้วย ทำให้รันตรงๆ ด้วย <code>./script.sh</code> แล้วเจอ <code>Permission denied</code> ทันที ทั้งที่เนื้อหาในไฟล์ไม่มีปัญหาอะไรเลย<br/><br/>
    <code>chmod +x &lt;ไฟล์&gt;</code> คือรูปแบบสัญลักษณ์ (symbolic) เพิ่มสิทธิ์ execute ให้ทั้ง user/group/others พร้อมกัน — ใช้บ่อยและจำง่ายกว่ารูปแบบตัวเลข (numeric mode) อย่าง <code>chmod 755 deploy.sh</code> ที่ให้ผลเทียบเท่ากัน (7 = rwx สำหรับเจ้าของ, 5 = r-x สำหรับกลุ่มและคนอื่น)`,
    example: `# เช็คสิทธิ์ปัจจุบันของไฟล์ก่อน chmod
ls -l deploy.sh
# ให้สิทธิ์แบบระบุตัวเลขเทียบเท่า chmod +x (rwx สำหรับเจ้าของ, r-x สำหรับกลุ่ม/คนอื่น)
chmod 755 deploy.sh`,
    task: `จงให้สิทธิ์ execute กับไฟล์ <code>deploy.sh</code> ด้วย <code>chmod +x</code>`
  },
  {
    id: "unix_cd_navigate",
    meta: "บทที่ 21",
    title: "Unix cd: สลับโฟลเดอร์และย้อนกลับแบบไม่ต้องพิมพ์ Path เต็ม",
    template: `# สถานการณ์: อยู่ในโฟลเดอร์ project/tests/e2e อยู่ ต้องขึ้นไปที่ root ของโปรเจกต์ (project/) เพื่อรันคำสั่งอื่นก่อน
# 1. ขึ้นไป 2 ระดับจากโฟลเดอร์ปัจจุบันในคำสั่งเดียว
# WRITE YOUR CODE HERE


# 2. ทำงานที่ root เสร็จแล้ว สลับกลับไปโฟลเดอร์ก่อนหน้า (project/tests/e2e) โดยไม่ต้องพิมพ์ path เต็มซ้ำ
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง cd...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasUp = lines.some(l => /^cd\s+\.\.\/\.\.$/.test(l));
      const hasBack = lines.some(l => /^cd\s+-$/.test(l));

      if (!hasUp) {
        throw new Error("ไม่พบคำสั่งขึ้นไป 2 ระดับ\nตัวอย่าง: cd ../..");
      }
      if (!hasBack) {
        throw new Error("ไม่พบคำสั่งสลับกลับไปโฟลเดอร์ก่อนหน้า\nตัวอย่าง: cd -");
      }
      log("✓ ใช้ cd ../.. แล้ว cd - ถูกต้อง");
    },
    hint: "การขึ้นหลายระดับใช้ .. คั่นด้วย / ซ้อนกันได้ในคำสั่งเดียว ส่วนการกลับไปโฟลเดอร์ก่อนหน้ามีทางลัดตัวเดียวที่ไม่ต้องพิมพ์ path เต็ม (คล้ายปุ่ม back)",
    solution: `cd ../..
cd -`,
    theory: `<code>cd</code> (change directory) เป็นคำสั่งพื้นฐานที่สุดในการสลับตำแหน่งที่ทำงานอยู่ของ shell แต่มีทางลัดที่ช่วยประหยัดเวลาได้เยอะ:<br/><br/>
    • <code>cd &lt;path&gt;</code> — ไป path ที่ระบุ (relative หรือ absolute ก็ได้)<br/>
    • <code>cd ..</code> — ขึ้น 1 ระดับ, <code>cd ../..</code> — ขึ้น 2 ระดับ (ซ้อน <code>..</code> ต่อกันด้วย <code>/</code> ได้เรื่อยๆ)<br/>
    • <code>cd</code> (ไม่ใส่ argument) หรือ <code>cd ~</code> — กลับไป home directory ของ user ทันที<br/>
    • <code>cd -</code> — สลับกลับไปโฟลเดอร์<strong>ก่อนหน้า</strong>ที่เพิ่งอยู่ (เก็บไว้ใน environment variable <code>$OLDPWD</code>) กด <code>cd -</code> สองครั้งติดกันจะสลับไปมาระหว่าง 2 โฟลเดอร์เหมือนปุ่ม back/forward<br/><br/>
    ใช้ <code>pwd</code> (print working directory) เช็คได้ตลอดว่าตอนนี้อยู่ที่โฟลเดอร์ไหน — มีประโยชน์มากตอนเขียน script เพราะสคริปต์ไม่รู้ context ว่าถูกเรียกจากโฟลเดอร์ไหน ต้อง <code>cd</code> ไปตำแหน่งที่ถูกต้องก่อนเสมอ`,
    example: `# เช็คตำแหน่งปัจจุบันก่อน-หลัง cd เพื่อยืนยันว่าไปถูกที่
pwd
cd ../..
pwd`,
    task: `จงขึ้นไป 2 ระดับด้วย <code>cd ../..</code> แล้วสลับกลับไปโฟลเดอร์ก่อนหน้าด้วย <code>cd -</code>`
  },
  {
    id: "unix_mkdir_parents",
    meta: "บทที่ 22",
    title: "Unix mkdir -p: สร้างโฟลเดอร์ซ้อนหลายชั้นในคำสั่งเดียว",
    template: `# สถานการณ์: ต้องการสร้างโครงสร้างโฟลเดอร์เก็บผลเทส tests/e2e/fixtures แต่ทั้ง tests/ และ tests/e2e/ ยังไม่มีอยู่เลยสักโฟลเดอร์
#           (mkdir tests/e2e/fixtures เฉยๆ จะ error: No such file or directory)
# 1. สร้างโฟลเดอร์ tests/e2e/fixtures พร้อมกับโฟลเดอร์แม่ที่ยังไม่มีทั้งหมดในคำสั่งเดียว
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง mkdir...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasMkdir = /mkdir\s+-p\s+tests\/e2e\/fixtures\b/.test(activeCode);
      if (hasMkdir) {
        log("✓ ใช้ mkdir -p tests/e2e/fixtures ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง mkdir -p tests/e2e/fixtures\nตัวอย่าง: mkdir -p tests/e2e/fixtures");
      }
    },
    hint: "mkdir เฉยๆ สร้างได้แค่โฟลเดอร์ปลายทางเดียวและต้องมีโฟลเดอร์แม่อยู่ก่อนแล้ว มี flag ตัวเดียวที่สั่งให้สร้างโฟลเดอร์แม่ทุกชั้นที่ยังไม่มีไปพร้อมกันด้วย",
    solution: `mkdir -p tests/e2e/fixtures`,
    theory: `<code>mkdir &lt;path&gt;</code> แบบ default สร้างได้แค่โฟลเดอร์ปลายทางเดียว และ<strong>ต้องมีโฟลเดอร์แม่อยู่ก่อนแล้วเท่านั้น</strong> ถ้า path ซ้อนหลายชั้นแต่โฟลเดอร์แม่ยังไม่มีจะเจอ error <code>No such file or directory</code> ทันที<br/><br/>
    <code>-p</code> (parents) แก้ปัญหานี้: สร้างโฟลเดอร์แม่ทุกชั้นที่ยังไม่มีให้อัตโนมัติ ก่อนจะสร้างโฟลเดอร์ปลายทางจริง — <code>mkdir -p tests/e2e/fixtures</code> จะสร้างทั้ง <code>tests/</code>, <code>tests/e2e/</code>, และ <code>tests/e2e/fixtures/</code> ในคำสั่งเดียว แม้จะไม่มีสักโฟลเดอร์มาก่อนเลยก็ตาม<br/><br/>
    ข้อดีอีกอย่าง: <code>-p</code> ทำให้คำสั่ง<strong>idempotent</strong> (รันซ้ำได้โดยไม่ error) — ถ้าโฟลเดอร์มีอยู่แล้วบางส่วนหรือทั้งหมด <code>mkdir -p</code> จะไม่ error เลย ต่างจาก <code>mkdir</code> เฉยๆ ที่จะ error ทันทีถ้าโฟลเดอร์ปลายทางมีอยู่แล้ว — เพราะแบบนี้ script ที่รัน setup/deploy ซ้ำๆ (เช่น CI pipeline) มักใช้ <code>mkdir -p</code> เสมอแทน <code>mkdir</code> เฉยๆ`,
    example: `# สร้างหลายโฟลเดอร์พร้อมกันในคำสั่งเดียว (แต่ละอันมี -p ในตัว)
mkdir -p reports/{screenshots,logs,coverage}`,
    task: `จงสร้างโฟลเดอร์ <code>tests/e2e/fixtures</code> พร้อมโฟลเดอร์แม่ที่ยังไม่มีทั้งหมด ด้วย <code>mkdir -p</code>`
  },
  {
    id: "unix_symlink",
    meta: "บทที่ 23",
    title: "Unix Symbolic Link: ชี้ชื่อสั้นไปยังไฟล์จริง ไม่ต้อง Copy ซ้ำ",
    template: `# สถานการณ์: มีไฟล์ config จริงอยู่ที่ config/production.env อยากให้เครื่องมือที่ root โปรเจกต์เข้าถึงผ่านชื่อ .env สั้นๆ
#           โดยไม่ต้อง copy ไฟล์ซ้ำ (อยากแก้ที่เดียว แล้วมีผลทั้งคู่)
# 1. สร้าง symbolic link ชื่อ .env ที่ root โปรเจกต์ ให้ชี้ไปที่ config/production.env
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง ln -s...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasSymlink = /ln\s+-s\s+config\/production\.env\s+\.env\b/.test(activeCode);
      if (hasSymlink) {
        log("✓ ใช้ ln -s config/production.env .env ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง ln -s config/production.env .env\nตัวอย่าง: ln -s config/production.env .env");
      }
    },
    hint: "คำสั่งสร้าง link มี flag ตัวเดียวที่ทำให้เป็น 'symbolic' (ตัวชี้ ไม่ใช่ก็อปปี้จริง) แล้วเรียงลำดับ argument เป็น: ไฟล์จริงที่จะถูกชี้ไปก่อน ตามด้วยชื่อ link ที่จะสร้างใหม่",
    solution: `ln -s config/production.env .env`,
    theory: `<code>ln -s &lt;target&gt; &lt;link_name&gt;</code> สร้าง<strong>symbolic link</strong> (symlink) — ไฟล์พิเศษที่ทำหน้าที่เป็นแค่ "ตัวชี้" ไปยังไฟล์/โฟลเดอร์จริงอีกที่หนึ่ง ไม่ใช่การ copy เนื้อหาไปจริงๆ<br/><br/>
    ข้อสำคัญของ <code>ln -s</code> ที่ต่างจาก copy:<br/>
    • แก้ไขไฟล์ผ่าน symlink เท่ากับแก้ไฟล์ต้นฉบับจริง (เพราะชี้ไปที่เดียวกัน) — ไม่มีปัญหาข้อมูล 2 ชุดไม่ตรงกัน<br/>
    • <code>ls -l</code> จะโชว์ symlink เป็น <code>.env -&gt; config/production.env</code> ให้เห็นชัดว่าชี้ไปไหน<br/>
    • <code>rm .env</code> ลบแค่ตัว link ทิ้ง <strong>ไม่กระทบไฟล์ต้นฉบับ</strong> (<code>config/production.env</code> ยังอยู่ปกติ)<br/>
    • ลืมใส่ <code>-s</code> จะได้ <strong>hard link</strong> แทน (ชี้ตรงไปที่ข้อมูลบน disk เดียวกันเป๊ะ ข้ามไดรฟ์ไม่ได้ และลบต้นฉบับไม่ได้ถ้ายังมี hard link เหลืออยู่) — งาน QA/dev ทั่วไปเกือบทั้งหมดใช้ symbolic link (<code>-s</code>) ไม่ใช่ hard link<br/><br/>
    ใช้บ่อยตอนสลับ config ระหว่าง environment (เช่น <code>ln -sf config/staging.env .env</code> เปลี่ยนไปชี้ staging แทน production แบบ overwrite link เดิมด้วย <code>-f</code>) หรือตอน tool ต้องการชื่อไฟล์คงที่แต่เนื้อหาจริงเปลี่ยนตาม version`,
    example: `# สลับ .env ไปชี้ staging แทน production (-f = force เขียนทับ link เดิม)
ln -sf config/staging.env .env
# เช็คว่า .env ชี้ไปไฟล์ไหนอยู่ตอนนี้
ls -l .env`,
    task: `จงสร้าง symbolic link ชื่อ <code>.env</code> ให้ชี้ไปที่ <code>config/production.env</code> ด้วย <code>ln -s</code>`
  },
  {
    id: "unix_trap_cleanup",
    meta: "บทที่ 24",
    title: "Unix trap: ล้างไฟล์ชั่วคราวอัตโนมัติแม้สคริปต์ล้มเหลว",
    template: `# หมายเหตุ: Scripts/generate-app-icon.sh จริงของ kouen-terminal สร้างโฟลเดอร์ temp ไว้ประมวลผล icon
# แล้วต้องการลบโฟลเดอร์ temp นั้นทิ้งเสมอไม่ว่าสคริปต์จะจบแบบสำเร็จหรือ error กลางทาง
TMP_STAGE=$(mktemp -d)
# 1. ตั้ง trap ให้ลบโฟลเดอร์ $TMP_STAGE ทิ้งทุกครั้งที่สคริปต์จบการทำงาน (ไม่ว่าสำเร็จหรือพัง)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง trap...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasTrap = /trap\s+'rm -rf "\$TMP_STAGE"'\s+EXIT\b/.test(activeCode);
      if (hasTrap) {
        log("✓ ใช้ trap 'rm -rf \"$TMP_STAGE\"' EXIT ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง trap 'rm -rf \"$TMP_STAGE\"' EXIT\nตัวอย่าง: trap 'rm -rf \"$TMP_STAGE\"' EXIT");
      }
    },
    hint: `นึกถึงคำสั่ง shell ที่ผูก action ให้รันอัตโนมัติเมื่อสคริปต์จบการทำงาน ไม่ว่าจะจบแบบสำเร็จหรือ error กลางทาง — action ที่ต้องผูกไว้คือคำสั่งลบโฟลเดอร์แบบ recursive บน $TMP_STAGE และสัญญาณที่ต้องดักคือตอนสคริปต์กำลังจะออก`,
    solution: `trap 'rm -rf "$TMP_STAGE"' EXIT`,
    theory: `<code>trap '&lt;คำสั่ง&gt;' &lt;สัญญาณ&gt;</code> สั่งให้ shell รันคำสั่งที่กำหนดอัตโนมัติเมื่อเกิดสัญญาณนั้น — <code>EXIT</code> คือ "สคริปต์กำลังจะจบการทำงาน" <strong>ไม่ว่าจะจบแบบปกติ, error (exit code ไม่ใช่ 0), หรือโดน Ctrl+C</strong> ก็ตาม ทำให้เหมาะมากสำหรับ "cleanup ที่ต้องเกิดขึ้นเสมอ" เช่น ลบไฟล์ temp<br/><br/>
    ถ้าไม่ตั้ง trap แล้วสคริปต์ error กลางทางก่อนถึงบรรทัด rm ท้ายสุด ไฟล์ temp จะค้างอยู่ตลอดไป — trap แก้ปัญหานี้โดยผูก cleanup ไว้ล่วงหน้าตั้งแต่ต้น ไม่ต้องพึ่งว่าสคริปต์จะรันจบถึงบรรทัดสุดท้ายจริงหรือเปล่า<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/generate-app-icon.sh</code>, <code>mobile-web.sh</code>, <code>smoke-dmg.sh</code> ใช้ pattern เดียวกันนี้ทั้งหมด — สร้าง resource ชั่วคราว (temp dir, background process) แล้ว <code>trap '&lt;cleanup&gt;' EXIT</code> ทันทีหลังสร้างเสร็จ ก่อนจะทำงานต่อ`,
    example: `# ใช้ trap คู่กับหลาย signal พร้อมกันได้ (เช่นเผื่อโดน Ctrl+C หรือ kill ด้วย)
trap cleanup EXIT INT TERM`,
    task: `จงตั้ง trap ให้รันคำสั่ง rm -rf "$TMP_STAGE" ทุกครั้งที่สคริปต์จบการทำงาน (EXIT)`
  },
  {
    id: "unix_log_summary_pipeline",
    meta: "ขั้นสูง 1",
    title: "Unix Pipeline หลายขั้นตอน: สรุปสถิติ Test Fail จาก Log",
    template: `# สถานการณ์: ไฟล์ test-results.log ในโฟลเดอร์ปัจจุบัน เก็บผลรันเทสไว้บรรทัดละ 1 รายการ
# รูปแบบแต่ละบรรทัด: <วันที่> <เวลา> <PASS|FAIL> <ชื่อ test case>
# ตัวอย่างเนื้อหาไฟล์:
# 2024-07-01 10:00:01 PASS test_login
# 2024-07-01 10:00:05 FAIL test_logout
# 2024-07-01 10:01:00 PASS test_search
# 2024-07-01 10:02:15 FAIL test_login
# 2024-07-01 10:03:00 FAIL test_login
# 2024-07-01 10:04:00 PASS test_checkout
# 2024-07-01 10:05:00 FAIL test_search
#
# 1. เขียน pipeline คำสั่งเดียวที่ทำครบทุกขั้นตอนนี้ตามลำดับ:
#    a) กรองเฉพาะบรรทัดที่มีคำว่า FAIL จากไฟล์ test-results.log
#    b) ดึงเฉพาะคอลัมน์ที่ 4 (ชื่อ test case) ออกมา
#    c) เรียงข้อมูลก่อน (จำเป็นสำหรับขั้นตอนถัดไป)
#    d) นับจำนวนครั้งที่แต่ละชื่อซ้ำกัน
#    e) เรียงผลลัพธ์จากจำนวนมากไปน้อย
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ pipeline สรุปสถิติจาก log...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const flattened = activeCode.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const stages = flattened.split('|').map(s => s.trim()).filter(Boolean);

      const stageChecks = [
        { re: /^grep\s+["']?FAIL["']?\s+test-results\.log$/, desc: 'grep "FAIL" test-results.log' },
        { re: /^awk\s+['"]\{\s*print\s+\$4\s*\}['"]$/, desc: "awk '{print $4}'" },
        { re: /^sort$/, desc: 'sort' },
        { re: /^uniq\s+-c$/, desc: 'uniq -c' },
        { re: /^sort\s+(-rn|-nr|-r\s+-n|-n\s+-r)$/, desc: 'sort -rn' },
      ];

      if (stages.length !== 5) {
        throw new Error(`pipeline ต้องมีทั้งหมด 5 ขั้นตอนต่อกันด้วย | (ตอนนี้พบ ${stages.length} ขั้นตอน)\nโครงสร้างที่ต้องการ: grep ... | awk '{print $4}' | sort | uniq -c | sort -rn`);
      }
      for (let i = 0; i < stageChecks.length; i++) {
        if (!stageChecks[i].re.test(stages[i])) {
          throw new Error(`ขั้นตอนที่ ${i + 1} ของ pipeline ไม่ถูกต้อง\nคาดหวังประมาณ: ${stageChecks[i].desc}\nพบจริง: ${stages[i]}`);
        }
      }
      log("✓ pipeline grep → awk → sort → uniq -c → sort -rn ถูกต้องครบทุกขั้นตอน");
    },
    hint: "ต้องกรองบรรทัดที่ต้องการก่อนด้วยเครื่องมือค้นหา pattern แบบมาตรฐาน จากนั้นดึงเฉพาะคอลัมน์ที่ต้องการออกมา (มีเครื่องมือแยกคอลัมน์ที่ใช้ได้ เช่น awk) ก่อนจะนับจำนวนซ้ำต้องเรียงข้อมูลให้อยู่ติดกันก่อนเสมอ แล้วค่อยนับด้วย flag ที่ทำให้แสดงจำนวนครั้งด้วย สุดท้ายเรียงผลลัพธ์จากมากไปน้อยแบบตัวเลข",
    solution: `grep "FAIL" test-results.log | awk '{print $4}' | sort | uniq -c | sort -rn`,
    theory: `งาน QA จริงมักต้องสรุปสถิติจาก log/ผลรันเทสที่มีเป็นพันบรรทัด — คำสั่งเดียวไม่พอ ต้องต่อหลายเครื่องมือเข้าด้วยกันผ่าน pipe (<code>|</code>) แต่ละตัวรับ stdout จากตัวก่อนหน้ามาเป็น stdin ของตัวเอง<br/><br/>
    แยกทีละขั้นตอน:<br/>
    1. <code>grep "FAIL" test-results.log</code> — กรองเอาเฉพาะบรรทัดที่มีคำว่า FAIL<br/>
    2. <code>awk '{print $4}'</code> — awk แบ่งแต่ละบรรทัดเป็น "คอลัมน์" ตาม whitespace โดยอัตโนมัติ (<code>$1</code>, <code>$2</code>, ... ) คำสั่งนี้พิมพ์เฉพาะคอลัมน์ที่ 4 ออกมา (ชื่อ test case)<br/>
    3. <code>sort</code> — <strong>จำเป็นต้องเรียงก่อนเสมอ</strong> เพราะขั้นตอนถัดไป (<code>uniq</code>) นับเฉพาะรายการที่ซ้ำกัน "ติดกัน" เท่านั้น ถ้าไม่ sort ก่อน รายการซ้ำที่อยู่ห่างกันจะถูกนับแยกกันผิดพลาด<br/>
    4. <code>uniq -c</code> — นับจำนวนบรรทัดที่ซ้ำกันติดกัน แล้วพิมพ์ตัวเลขนำหน้า<br/>
    5. <code>sort -rn</code> — เรียงผลลัพธ์ตามตัวเลข (<code>-n</code>) จากมากไปน้อย (<code>-r</code>) เพื่อดูว่า test ไหน fail บ่อยที่สุดอยู่บนสุด<br/><br/>
    หลักการสำคัญ: งานแบบนี้ทำด้วยคำสั่งเดียวไม่ได้ ต้อง "ประกอบ" เครื่องมือเล็กๆ หลายตัวเข้าด้วยกัน — นี่คือปรัชญาพื้นฐานของ Unix เอง`,
    example: `# ใช้ pattern เดียวกันนับ HTTP status code ที่เจอบ่อยที่สุดใน access.log
grep " 500 " access.log | awk '{print $1}' | sort | uniq -c | sort -rn`,
    task: `จงเขียน pipeline คำสั่งเดียวจากไฟล์ <code>test-results.log</code> ให้ครบทุกขั้นตอน:<br/>
    1. กรองเฉพาะบรรทัดที่มีคำว่า <code>FAIL</code><br/>
    2. ดึงเฉพาะคอลัมน์ที่ 4 (ชื่อ test case)<br/>
    3. เรียงข้อมูล (จำเป็นก่อนนับ)<br/>
    4. นับจำนวนครั้งที่ซ้ำกันของแต่ละชื่อ<br/>
    5. เรียงผลลัพธ์จากจำนวนมากไปน้อย`
  },
  {
    id: "unix_batch_fail_check",
    meta: "ขั้นสูง 2",
    title: "Loop + Conditional: ตรวจสอบไฟล์ผลเทสหลายไฟล์แบบ Batch",
    template: `# สถานการณ์: โฟลเดอร์ results/ เก็บไฟล์ผลการทดสอบหลายไฟล์ (result1.txt, result2.txt, result3.txt, ...)
# บางไฟล์มีคำว่า FAIL ปรากฏอยู่ข้างในถ้าเทสในไฟล์นั้นล้มเหลว ต้องการหาว่าไฟล์ไหนบ้างที่ fail
# 1. เขียนสคริปต์วนลูปผ่านทุกไฟล์ .txt ในโฟลเดอร์ results/ (ใช้ชื่อตัวแปร f แทนแต่ละไฟล์)
#    แล้วเช็คว่าไฟล์นั้นมีคำว่า FAIL อยู่ข้างในหรือไม่ (เช็คแบบเงียบ ไม่ print เอง)
#    ถ้ามี ให้ print ชื่อไฟล์นั้นออกมา
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ loop + conditional...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

      const forIdx = lines.findIndex(l => /^for\s+f\s+in\s+results\/\*\.txt\s*;\s*do$/.test(l));
      const ifIdx = lines.findIndex(l => /^if\s+grep\s+-q\s+["']FAIL["']\s+"\$f"\s*;\s*then$/.test(l));
      const echoIdx = lines.findIndex(l => /^echo\s+"?\$f"?$/.test(l));
      const fiIdx = lines.findIndex(l => l === 'fi');
      const doneIdx = lines.findIndex(l => l === 'done');

      if (forIdx === -1) {
        throw new Error("ไม่พบ for loop ที่วนไฟล์ .txt ในโฟลเดอร์ results/ ให้ถูกต้อง\nตัวอย่างโครงสร้าง: for f in results/*.txt; do");
      }
      if (ifIdx === -1) {
        throw new Error("ไม่พบเงื่อนไข if ที่เช็คคำว่า FAIL ในไฟล์ $f ด้วย grep -q แบบเงียบ\nตัวอย่างโครงสร้าง: if grep -q \"FAIL\" \"$f\"; then");
      }
      if (echoIdx === -1) {
        throw new Error("ไม่พบคำสั่ง echo แสดงชื่อไฟล์ $f เมื่อเจอ FAIL\nตัวอย่าง: echo \"$f\"");
      }
      if (fiIdx === -1) {
        throw new Error("ไม่พบ fi ปิดท้ายเงื่อนไข if");
      }
      if (doneIdx === -1) {
        throw new Error("ไม่พบ done ปิดท้าย for loop");
      }
      if (!(forIdx < ifIdx && ifIdx < echoIdx && echoIdx < fiIdx && fiIdx < doneIdx)) {
        throw new Error("ลำดับโครงสร้างไม่ถูกต้อง — ต้องเรียงเป็น for...do → if...then → echo → fi → done ตามลำดับ");
      }
      log("✓ ลำดับ for → if → echo → fi → done ถูกต้อง");
    },
    hint: "ต้อง loop ผ่านทุกไฟล์ .txt ในโฟลเดอร์ด้วยคำสั่งวนซ้ำของ shell ก่อน แล้วในแต่ละรอบเช็คเงื่อนไขด้วยเครื่องมือค้นหา pattern แบบเงียบ (ไม่ print อะไร แค่ให้ exit code บอกว่าเจอหรือไม่) ว่าพบคำว่า FAIL ในไฟล์นั้นหรือเปล่า ถ้าใช่ค่อย print ชื่อไฟล์ออกมา แล้วอย่าลืมปิด if ด้วย fi และปิด loop ด้วย done",
    solution: `for f in results/*.txt; do
  if grep -q "FAIL" "$f"; then
    echo "$f"
  fi
done`,
    theory: `งาน QA จริงมักต้องเช็คผลเทสจากหลายไฟล์พร้อมกัน แทนที่จะเปิดดูทีละไฟล์เอง ใช้ <strong>loop</strong> ผสม <strong>conditional</strong> ให้ shell ทำงานซ้ำแทนเรา<br/><br/>
    1. <code>for f in results/*.txt; do ... done</code> — วนลูปผ่านทุกไฟล์ที่ตรงกับ pattern <code>results/*.txt</code> (shell ขยาย <code>*</code> เป็นรายชื่อไฟล์จริงให้เอง) ตัวแปร <code>f</code> จะเปลี่ยนค่าเป็นชื่อไฟล์ถัดไปในแต่ละรอบ<br/>
    2. <code>if grep -q "FAIL" "$f"; then ... fi</code> — <code>grep -q</code> เช็คแบบเงียบว่าไฟล์นั้นมีคำว่า FAIL หรือไม่ ให้แค่ exit code (0 = เจอ, ไม่ใช่ 0 = ไม่เจอ) เอาไปใช้เป็นเงื่อนไขของ <code>if</code> ได้ตรงๆ<br/>
    3. quote ตัวแปร <code>"$f"</code> เสมอเวลาใช้เป็น argument ของคำสั่ง — ป้องกันปัญหาถ้าชื่อไฟล์มี space หรือ special character อยู่ข้างใน (shell จะไม่ตัดคำผิดพลาด)<br/>
    4. <code>echo "$f"</code> — แสดงชื่อไฟล์ที่เข้าเงื่อนไข ก่อนจะปิด <code>if</code> ด้วย <code>fi</code> และปิด <code>for</code> ด้วย <code>done</code><br/><br/>
    แนวคิดนี้ต่อยอดจาก <code>set -euo pipefail</code> และ <code>grep -q</code> ที่เรียนไปก่อนหน้า — เอามาผสมกับ loop เพื่อจัดการงาน batch หลายไฟล์พร้อมกันแบบอัตโนมัติ`,
    example: `# ตัวอย่างนับจำนวนไฟล์ที่ fail แทนที่จะ print ชื่อไฟล์
count=0
for f in results/*.txt; do
  if grep -q "FAIL" "$f"; then
    count=$((count + 1))
  fi
done
echo "พบไฟล์ fail ทั้งหมด $count ไฟล์"`,
    task: `จงเขียนสคริปต์ให้ครบ โดย:<br/>
    1. วนลูปผ่านทุกไฟล์ <code>.txt</code> ในโฟลเดอร์ <code>results/</code> ด้วยตัวแปรชื่อ <code>f</code><br/>
    2. ในแต่ละรอบ เช็คแบบเงียบว่าไฟล์นั้นมีคำว่า <code>FAIL</code> อยู่หรือไม่<br/>
    3. ถ้ามี ให้ <code>echo</code> ชื่อไฟล์นั้นออกมา`
  },
  {
    id: "git_status",
    meta: "บทเสริม 1",
    title: "Git Status: เช็คสถานะ Working Directory ก่อนลงมือทำอะไรต่อ",
    template: `# สถานการณ์: เพิ่งแก้ไฟล์ไปหลายไฟล์ ไม่แน่ใจว่าไฟล์ไหน stage ไว้แล้ว ไฟล์ไหนยังไม่ได้ track เลย
# 1. เช็คสถานะปัจจุบันของ working directory
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git status...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasStatus = /git status\b/.test(activeCode);
      if (hasStatus) {
        log("✓ ใช้ git status ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git status\nตัวอย่าง: git status");
      }
    },
    hint: "คำสั่งพื้นฐานที่สุดที่ควรพิมพ์ก่อนทำอะไรก็ตามใน git เพื่อดูภาพรวมของ working directory ตอนนี้",
    solution: `git status`,
    theory: `<strong>git status</strong> คือคำสั่งที่ควรพิมพ์เป็นอันดับแรกก่อน commit/add ทุกครั้ง แสดงสถานะไฟล์ทั้งหมดแบ่งเป็น 3 กลุ่ม:<br/><br/>
    1. <strong>Staged (จะเข้าไปใน commit ถัดไป)</strong> — ไฟล์ที่ <code>git add</code> ไปแล้ว<br/>
    2. <strong>Modified/Unstaged</strong> — ไฟล์ที่แก้ไปแล้วแต่ยังไม่ได้ <code>git add</code><br/>
    3. <strong>Untracked</strong> — ไฟล์ใหม่ที่ git ยังไม่เคยรู้จักเลย (ไม่เคย add มาก่อน)<br/><br/>
    เช็คก่อน commit ทุกครั้งช่วยกันคอมมิตไฟล์ผิดหรือลืมไฟล์ที่ควร add ไปด้วย`,
    example: `# แบบย่อ (short format) กระชับกว่า อ่านเร็วกว่าตอนไฟล์เยอะ
git status -s`,
    task: `จงเช็คสถานะปัจจุบันของ working directory ด้วย <code>git status</code>`
  },
  {
    id: "git_log",
    meta: "บทเสริม 2",
    title: "Git Log: ดูประวัติ Commit แบบกระชับ",
    template: `# สถานการณ์: อยากดูประวัติ commit ล่าสุด 5 รายการ แบบกระชับบรรทัดเดียวต่อ commit
# 1. แสดงประวัติ 5 commit ล่าสุด แบบย่อบรรทัดเดียว
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git log...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasLog = /git log\s+--oneline\s+-5\b/.test(activeCode);
      if (hasLog) {
        log("✓ ใช้ git log --oneline -5 ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git log --oneline -5\nตัวอย่าง: git log --oneline -5");
      }
    },
    hint: "git log เฉยๆ แสดงรายละเอียดยาวทีละ commit — มี flag ที่ย่อให้เหลือบรรทัดเดียวต่อ commit แล้วใส่เลขจำกัดจำนวน commit ที่จะแสดงต่อท้าย",
    solution: `git log --oneline -5`,
    theory: `<code>git log</code> เฉยๆ แสดงประวัติ commit ทั้งหมดแบบละเอียด (hash เต็ม, ผู้เขียน, วันที่, ข้อความ) ยาวมากถ้า repo มี commit เยอะ<br/><br/>
    • <code>--oneline</code> — ย่อแต่ละ commit เหลือบรรทัดเดียว (hash ย่อ + ข้อความ)<br/>
    • <code>-N</code> (เช่น <code>-5</code>) — จำกัดแสดงแค่ N commit ล่าสุด<br/>
    • <code>--graph --all</code> — วาดเส้น branch แบบ ASCII ให้เห็นว่า commit ไหนอยู่ branch ไหนบ้าง มีประโยชน์มากตอน branch เยอะ`,
    example: `# ดูทุก branch พร้อมเส้นกราฟ
git log --oneline --graph --all`,
    task: `จงแสดงประวัติ 5 commit ล่าสุดแบบย่อบรรทัดเดียวด้วย <code>git log --oneline -5</code>`
  },
  {
    id: "git_diff",
    meta: "บทเสริม 3",
    title: "Git Diff: ดูว่าเปลี่ยนอะไรไปบ้างก่อน Commit",
    template: `# สถานการณ์: แก้ไฟล์ไปแล้วยังไม่ได้ add อยากดูว่าเปลี่ยนอะไรไปบ้างก่อน แล้วพอ add แล้วอยากเช็คซ้ำว่า staged ไว้ถูกต้อง
# 1. ดู diff ของไฟล์ที่แก้แต่ยังไม่ได้ stage
# WRITE YOUR CODE HERE


# 2. หลัง git add แล้ว ดู diff ของสิ่งที่ staged ไว้ (จะเข้าไปใน commit ถัดไป)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git diff...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasDiff = /^git diff\s*$/m.test(activeCode);
      const hasCachedDiff = /git diff\s+--cached\b/.test(activeCode);
      if (!hasDiff) {
        throw new Error("ไม่พบคำสั่ง git diff (ดู unstaged changes)\nตัวอย่าง: git diff");
      }
      if (!hasCachedDiff) {
        throw new Error("ไม่พบคำสั่ง git diff --cached (ดู staged changes)\nตัวอย่าง: git diff --cached");
      }
      log("✓ ใช้ git diff แล้ว git diff --cached ถูกต้อง");
    },
    hint: "git diff เฉยๆ เทียบ working directory กับ staging area ส่วนอีก flag หนึ่งเทียบ staging area กับ commit ล่าสุดแทน (ดูว่า staged ไว้ถูกต้องมั้ยก่อนจะ commit จริง)",
    solution: `git diff
git diff --cached`,
    theory: `<code>git diff</code> เปรียบเทียบไฟล์ได้หลายคู่ต่างกัน ขึ้นอยู่กับ flag:<br/><br/>
    • <code>git diff</code> (เปล่าๆ) — เทียบ <strong>working directory vs staging area</strong> คือดูว่าแก้อะไรไปแล้วที่ยังไม่ได้ <code>add</code><br/>
    • <code>git diff --cached</code> (เท่ากับ <code>--staged</code>) — เทียบ <strong>staging area vs commit ล่าสุด</strong> คือดูว่า <code>add</code> ไว้อะไรบ้างที่จะเข้า commit ถัดไปจริงๆ<br/>
    • <code>git diff HEAD</code> — เทียบ working directory กับ commit ล่าสุดตรงๆ (รวมทั้ง staged และ unstaged ในทีเดียว)<br/><br/>
    เช็ค <code>git diff --cached</code> ก่อน commit ทุกครั้งช่วยกันไม่ให้ commit อะไรที่ไม่ตั้งใจ add ไปด้วย`,
    example: `# เทียบ working directory กับ commit ล่าสุดตรงๆ (รวม staged+unstaged)
git diff HEAD`,
    task: `จงดู <code>git diff</code> (unstaged) แล้วดู <code>git diff --cached</code> (staged) ตามลำดับ`
  },
  {
    id: "git_add_patch",
    meta: "บทเสริม 4",
    title: "Git Add -p: Stage เฉพาะบางส่วนของไฟล์ (Patch Mode)",
    template: `# สถานการณ์: ไฟล์ login.ts มีทั้งการแก้บั๊กจริง และบรรทัด console.log ที่ใช้ debug ทิ้งไว้ ไม่อยากให้ทั้งสองอย่างอยู่ commit เดียวกัน
# 1. เข้าโหมด patch เพื่อเลือก stage เฉพาะบาง hunk ของไฟล์ login.ts
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git add -p...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasAddP = /git add\s+-p\s+login\.ts\b/.test(activeCode);
      if (hasAddP) {
        log("✓ ใช้ git add -p login.ts ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git add -p login.ts\nตัวอย่าง: git add -p login.ts");
      }
    },
    hint: "git add ธรรมดา stage ทั้งไฟล์เท่านั้น มี flag ตัวย่อ (patch mode) ที่ทำให้เลือก stage ได้ทีละส่วน (hunk) ของไฟล์แทน",
    solution: `git add -p login.ts`,
    theory: `<code>git add &lt;ไฟล์&gt;</code> ธรรมดา stage ทั้งไฟล์รวดเดียว — ถ้าไฟล์มีทั้งการแก้ที่ตั้งใจ commit จริงๆ ปนกับโค้ด debug ที่ลืมลบ จะแยกไม่ได้ว่าอะไรควรอยู่ commit ไหน<br/><br/>
    <code>git add -p &lt;ไฟล์&gt;</code> (patch mode) แบ่งการแก้ไขออกเป็น "hunk" (กลุ่มบรรทัดที่เปลี่ยนติดกัน) แล้วถามทีละ hunk ว่าจะ stage มั้ย (<code>y</code>=ใช่, <code>n</code>=ไม่, <code>s</code>=แบ่ง hunk นี้ให้ย่อยลงอีก, <code>q</code>=หยุดถามที่เหลือ) — ทำให้แยก commit ได้ละเอียดกว่าระดับไฟล์ เป็นเทคนิคที่ทำให้แต่ละ commit โฟกัสเรื่องเดียวจริงๆ`,
    example: `# ทำแบบเดียวกันตอน commit แทนที่จะ add ก่อน (สลับไป patch mode ตอน commit ได้เลย)
git commit -p`,
    task: `จงเข้าโหมด patch ของ <code>git add</code> เพื่อเลือก stage บาง hunk ของไฟล์ <code>login.ts</code>`
  },
  {
    id: "git_clone",
    meta: "บทเสริม 5",
    title: "Git Clone: ดึง Repository ที่มีอยู่แล้วมาไว้ในเครื่อง",
    template: `# สถานการณ์: มี repo อยู่แล้วบน GitHub (https://github.com/acme/webapp.git) ต้องการโค้ดทั้งหมดมาไว้ในเครื่องเพื่อเริ่มทำงาน
# 1. clone repo นี้มาไว้ในเครื่อง
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git clone...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasClone = /git clone\s+https:\/\/github\.com\/acme\/webapp\.git\b/.test(activeCode);
      if (hasClone) {
        log("✓ ใช้ git clone https://github.com/acme/webapp.git ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git clone https://github.com/acme/webapp.git\nตัวอย่าง: git clone https://github.com/acme/webapp.git");
      }
    },
    hint: "คำสั่งเดียวที่ทำครบทั้ง init + ผูก remote + ดึงโค้ดทั้งหมดมาจาก URL ที่ระบุ",
    solution: `git clone https://github.com/acme/webapp.git`,
    theory: `<strong>git clone &lt;url&gt;</strong> ทำครบในคำสั่งเดียว: สร้างโฟลเดอร์ใหม่ + <code>git init</code> ข้างใน + ผูก remote ชื่อ <code>origin</code> ให้ชี้ไป url ที่ระบุ + ดึงข้อมูลทั้งหมด (ทุก branch, ทุก commit) มาเก็บไว้ + checkout branch default (มักเป็น <code>main</code>) ออกมาให้ทำงานได้ทันที<br/><br/>
    นี่คือเหตุผลที่บท <code>git init</code> เตือนไว้ว่า: ถ้าโปรเจกต์มี remote อยู่แล้วให้ใช้ <code>clone</code> แทน ไม่ต้องมานั่ง <code>init</code> แล้วต่อด้วย <code>remote add</code> เอง<br/><br/>
    ค่า default ชื่อโฟลเดอร์ที่ได้จะตรงกับชื่อ repo (ในตัวอย่างนี้คือ <code>webapp/</code>) ถ้าอยากตั้งชื่อโฟลเดอร์เองใส่ argument ที่สองต่อท้าย`,
    example: `# clone แล้วตั้งชื่อโฟลเดอร์เองแทนใช้ชื่อ repo เดิม
git clone https://github.com/acme/webapp.git my-local-webapp`,
    task: `จง clone repo <code>https://github.com/acme/webapp.git</code> มาไว้ในเครื่อง`
  },
  {
    id: "git_remote",
    meta: "บทเสริม 6",
    title: "Git Remote: ผูก Local Repo เข้ากับ Remote บน GitHub",
    template: `# สถานการณ์: เพิ่งสร้าง repo ใหม่ในเครื่องด้วย git init แล้วสร้าง repo เปล่าไว้บน GitHub รอแล้ว ต้องการผูกทั้งสองเข้าด้วยกัน
# 1. ผูก remote ชื่อ 'origin' ให้ชี้ไปที่ https://github.com/acme/webapp.git
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git remote add...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRemote = /git remote add\s+origin\s+https:\/\/github\.com\/acme\/webapp\.git\b/.test(activeCode);
      if (hasRemote) {
        log("✓ ใช้ git remote add origin https://github.com/acme/webapp.git ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git remote add origin https://github.com/acme/webapp.git\nตัวอย่าง: git remote add origin https://github.com/acme/webapp.git");
      }
    },
    hint: "คำสั่งย่อยของ remote ที่ใช้เพิ่ม remote ใหม่ ตามด้วยชื่อที่จะเรียก (ตามธรรมเนียมมักใช้ origin) แล้วตามด้วย URL ของ repo",
    solution: `git remote add origin https://github.com/acme/webapp.git`,
    theory: `<strong>remote</strong> คือชื่อเล่นที่ผูกไว้กับ URL ของ repo อื่น (ปกติอยู่บน GitHub/GitLab) — <code>origin</code> เป็นแค่<strong>ชื่อตามธรรมเนียม</strong> ที่ทุกคนใช้กัน ไม่ใช่ชื่อบังคับของ git<br/><br/>
    <code>git remote add &lt;ชื่อ&gt; &lt;url&gt;</code> ผูก remote ใหม่เข้ากับ local repo — จำเป็นเฉพาะตอนที่ repo เริ่มจาก <code>git init</code> เอง (ถ้าใช้ <code>git clone</code> จะได้ remote <code>origin</code> ผูกมาให้อัตโนมัติแล้ว)<br/><br/>
    หนึ่ง repo มีได้หลาย remote พร้อมกัน (เช่น <code>origin</code> ชี้ไป fork ของตัวเอง + <code>upstream</code> ชี้ไป repo ต้นฉบับ) ใช้ <code>git remote -v</code> ดูรายชื่อ remote ทั้งหมดพร้อม URL`,
    example: `# ดู remote ทั้งหมดที่ผูกไว้ พร้อม URL (v = verbose)
git remote -v`,
    task: `จงผูก remote ชื่อ <code>origin</code> ให้ชี้ไปที่ <code>https://github.com/acme/webapp.git</code>`
  },
  {
    id: "git_reset",
    meta: "บทเสริม 7",
    title: "Git Reset: ย้อน Commit กลับแบบยังเก็บไฟล์ที่แก้ไว้",
    template: `# สถานการณ์: เพิ่ง commit ไปแต่ยังไม่ได้ push เลย นึกขึ้นได้ว่ายังไม่อยากได้ commit นี้ อยากย้อนกลับไปก่อน commit แต่ยังเก็บไฟล์ที่แก้ไว้ (staged พร้อม commit ใหม่)
# 1. ย้อนกลับไปก่อน commit ล่าสุด 1 อัน โดยไฟล์ที่แก้ยังอยู่และยัง staged ไว้เหมือนเดิม
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git reset...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasReset = /git reset\s+--soft\s+HEAD~1\b/.test(activeCode);
      if (hasReset) {
        log("✓ ใช้ git reset --soft HEAD~1 ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git reset --soft HEAD~1\nตัวอย่าง: git reset --soft HEAD~1");
      }
    },
    hint: "git reset มี flag ควบคุมว่าจะเก็บไฟล์ที่แก้ไว้ระดับไหน แบบที่ยังเก็บไว้แบบ staged ครบเหมือนเดิมคือ flag ที่แปลว่า 'เบาที่สุด' ตามด้วยตำแหน่งย้อนกลับ 1 commit ก่อนหน้า HEAD",
    solution: `git reset --soft HEAD~1`,
    theory: `<code>git reset &lt;commit&gt;</code> ย้าย branch pointer กลับไปที่ commit เก่ากว่า มี 3 โหมดสำคัญ ต่างกันตรงว่า "เก็บไฟล์ที่แก้ไว้แค่ไหน":<br/><br/>
    • <code>--soft</code> — ย้อน commit แต่ <strong>เก็บทุกอย่างไว้แบบ staged</strong> เหมือนเพิ่ง <code>git add</code> เสร็จ พร้อม commit ใหม่ทันที (ใช้แก้ commit message หรือรวม commit หลายอันเข้าด้วยกัน)<br/>
    • <code>--mixed</code> (default ถ้าไม่ใส่ flag) — ย้อน commit และเอาออกจาก staged ด้วย แต่ไฟล์ในเครื่องยังอยู่ (ต้อง <code>git add</code> ใหม่เอง)<br/>
    • <code>--hard</code> — ย้อน commit และ<strong>ลบการแก้ไขทั้งหมดทิ้งถาวร</strong> (ไฟล์กลับไปเหมือน commit เป้าหมายเป๊ะ) — <strong style="color:#e00">อันตรายที่สุด ห้ามใช้กับ commit ที่ push ไปแล้ว/คนอื่นดึงไปใช้ต่อ</strong> เพราะข้อมูลหายจริง กู้คืนยาก<br/><br/>
    กฎทองคือ: <code>reset</code> (ทุกโหมด) ปลอดภัยเฉพาะกับ commit ที่ยัง<strong>ไม่ push</strong> ออกไปไหนเท่านั้น`,
    example: `# ย้อน 1 commit แบบลบการแก้ไขทิ้งถาวร (ระวังมาก ใช้เฉพาะ commit ที่ไม่เคย push)
git reset --hard HEAD~1`,
    task: `จงย้อนกลับไปก่อน commit ล่าสุด 1 อัน โดยเก็บไฟล์ที่แก้ไว้แบบ staged ด้วย <code>git reset --soft HEAD~1</code>`
  },
  {
    id: "git_revert",
    meta: "บทเสริม 8",
    title: "Git Revert: ย้อน Commit แบบปลอดภัยสำหรับ Commit ที่ Push ไปแล้ว",
    template: `# สถานการณ์: commit hash abc1234 ที่ push ไปแล้วและคนอื่นดึงไปใช้ต่อแล้ว ทำให้เกิดบั๊ก ห้ามแก้ history เดิม (ห้ามใช้ reset/amend)
# 1. สร้าง commit ใหม่ที่ยกเลิกผลของ commit abc1234 โดยไม่ลบ history เดิม
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git revert...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRevert = /git revert\s+abc1234\b/.test(activeCode);
      if (hasRevert) {
        log("✓ ใช้ git revert abc1234 ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git revert abc1234\nตัวอย่าง: git revert abc1234");
      }
    },
    hint: "นึกถึงคำสั่งที่ 'ย้อนผล' ของ commit หนึ่งโดยไม่ลบ commit เดิมออกจาก history เลย แล้วระบุ commit hash ที่ต้องการย้อนต่อท้าย",
    solution: `git revert abc1234`,
    theory: `<strong>git revert &lt;commit&gt;</strong> สร้าง<strong>commit ใหม่</strong>ที่ทำการแก้ไขตรงข้ามกับ commit เป้าหมายเป๊ะ (ถ้า commit เดิมเพิ่มบรรทัดอะไรไป revert จะลบบรรทัดนั้นออก) — <strong>history เดิมไม่หายไปไหนเลย</strong> commit ที่ผิดพลาดยังอยู่ใน log ตามปกติ แค่มี commit ใหม่ตามมาแก้ผลของมัน<br/><br/>
    เทียบกับ <code>reset</code>:<br/>
    • <code>reset</code> — เขียน history ใหม่ (ลบ/ย้าย commit ทิ้ง) ปลอดภัยเฉพาะ commit ที่ยังไม่ push<br/>
    • <code>revert</code> — ไม่แตะ history เดิมเลย ปลอดภัย<strong>แม้กับ commit ที่ push ไปแล้วและคนอื่นดึงไปใช้ต่อ</strong> เพราะทุกคนแค่ต้อง <code>pull</code> commit ใหม่ที่ revert เข้ามาเพิ่ม ไม่มี history ใครขัดกัน<br/><br/>
    กฎง่ายๆ: commit ยังไม่ push → ใช้ <code>reset</code>/<code>amend</code> ได้ตามสบาย, commit push ไปแล้ว/แชร์กับคนอื่นแล้ว → ใช้ <code>revert</code> เสมอ`,
    example: `# revert หลาย commit ติดกันในคำสั่งเดียว (เก่าสุดไปใหม่สุด)
git revert HEAD~2..HEAD`,
    task: `จงสร้าง commit ใหม่ที่ย้อนผลของ commit <code>abc1234</code> ด้วย <code>git revert abc1234</code>`
  },
  {
    id: "vim_quit_variants",
    meta: "บทเสริม 9",
    title: "Vim ออกจากโปรแกรม: :q vs :q! vs :wq!",
    template: `# สถานการณ์: เปิดไฟล์ 3 สถานการณ์แยกกันด้วย Vim ต้องออกด้วยคำสั่งที่ต่างกันตามสถานการณ์
# 1. ไฟล์ A: ยังไม่ได้แก้อะไรเลย แค่อยากออกเฉยๆ
# WRITE YOUR CODE HERE


# 2. ไฟล์ B: แก้ไปแล้วแต่เปลี่ยนใจ ไม่อยากเก็บอะไรเลย อยากออกแบบทิ้งทุกอย่างทันที


# 3. ไฟล์ C: เปิดด้วย vim -R (read-only) แต่ดันแก้เนื้อหาไปแล้ว อยากบันทึกทับ read-only flag แล้วออก
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasQ = lines.some(l => l === ':q');
      const hasQBang = lines.some(l => l === ':q!');
      const hasWqBang = lines.some(l => l === ':wq!');

      if (!hasQ) {
        throw new Error("ไม่พบคำสั่ง :q\nตัวอย่าง: พิมพ์ :q ใน Normal mode");
      }
      if (!hasQBang) {
        throw new Error("ไม่พบคำสั่ง :q!\nตัวอย่าง: พิมพ์ :q! ใน Normal mode");
      }
      if (!hasWqBang) {
        throw new Error("ไม่พบคำสั่ง :wq!\nตัวอย่าง: พิมพ์ :wq! ใน Normal mode");
      }
      log("✓ ใช้ :q, :q!, :wq! ครบทั้ง 3 แบบถูกต้อง");
    },
    hint: "แบบธรรมดาไม่มี ! ต่อท้ายจะออกให้ก็ต่อเมื่อไม่มีอะไรค้าง ถ้าอยากบังคับไม่สนใจว่ามีอะไรค้างให้เติม ! ต่อท้าย ส่วนถ้าอยากบันทึกด้วยต้องมี w นำหน้า q",
    solution: `:q
:q!
:wq!`,
    theory: `Vim มีคำสั่งออกหลายแบบ ต่างกันตรง "จะยอมออกตอนไหน" และ "บันทึกก่อนออกมั้ย":<br/><br/>
    • <code>:q</code> (quit) — ออกได้ก็ต่อเมื่อ<strong>ไม่มีอะไรค้าง</strong> (ไม่มีการแก้ไขที่ยังไม่บันทึก) ถ้ามีอะไรค้างจะ error <code>E37: No write since last change</code> ทันที ไม่ยอมออกให้เฉยๆ<br/>
    • <code>:q!</code> — เติม <code>!</code> (force) ท้ายคำสั่งไหนก็ตาม แปลว่า "บังคับทำ ไม่ต้องถามอะไร" — <code>:q!</code> จึงออกทันทีโดย<strong>ทิ้งการแก้ไขที่ยังไม่บันทึกทั้งหมด</strong><br/>
    • <code>:wq</code> — เขียน (write) แล้วออก (quit) เรียงกัน แต่จะ error ถ้าไฟล์เป็น read-only (เปิดด้วย <code>vim -R</code> หรือตั้ง <code>:set readonly</code> ไว้)<br/>
    • <code>:wq!</code> — เติม <code>!</code> บังคับเขียนทับ read-only flag<strong>ของ Vim เอง</strong>แล้วออก — <strong>ข้อควรรู้:</strong> <code>!</code> ตัวนี้ override แค่ read-only flag ภายใน Vim เท่านั้น ถ้าไฟล์จริงถูก <code>chmod</code> ห้ามเขียนระดับ filesystem (permission denied จริง) <code>:wq!</code> ก็ยังเขียนไม่ได้อยู่ดี<br/><br/>
    หลักการจำ: <code>!</code> ต่อท้ายคำสั่งไหนก็ตาม = "บังคับ ไม่ต้องถาม" ใช้ pattern นี้ได้กับคำสั่ง Ex อื่นๆ ของ Vim ด้วยเช่นกัน`,
    example: `# ปิดทุกไฟล์ที่เปิดพร้อมกันหมด (หลาย buffer/split) แบบบังคับทิ้งทุกอย่าง
:qa!`,
    task: `จงเขียนคำสั่งออกจาก Vim ให้ครบทั้ง 3 แบบตามสถานการณ์:<br/>
    1. <code>:q</code> — ออกเฉยๆ (ไม่มีอะไรค้าง)<br/>
    2. <code>:q!</code> — ออกแบบทิ้งการแก้ไขทั้งหมด<br/>
    3. <code>:wq!</code> — บันทึกทับ read-only flag แล้วออก`
  },
  {
    id: "vim_search",
    meta: "บทเสริม 10",
    title: "Vim Search: หาคำในไฟล์ด้วย / และเลื่อนไปผลถัดไปด้วย n",
    template: `# สถานการณ์: ไฟล์ log ยาวมาก อยากหาคำว่า ERROR อย่างเร็ว แล้วเลื่อนไปจุดที่เจอถัดไปเรื่อยๆ
# 1. ค้นหาคำว่า ERROR เดินหน้าจากตำแหน่ง cursor ปัจจุบัน
# WRITE YOUR CODE HERE


# 2. เลื่อนไปจุดที่เจอคำว่า ERROR ถัดไป (ทิศทางเดิม)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasSearch = lines.some(l => l === '/ERROR');
      const hasNext = lines.some(l => l === 'n');

      if (!hasSearch) {
        throw new Error("ไม่พบคำสั่งค้นหา ERROR\nตัวอย่าง: พิมพ์ /ERROR แล้ว Enter");
      }
      if (!hasNext) {
        throw new Error("ไม่พบคำสั่งเลื่อนไปผลถัดไป\nตัวอย่าง: พิมพ์ n ใน Normal mode");
      }
      log("✓ ใช้ /ERROR แล้ว n ถูกต้อง");
    },
    hint: "สัญลักษณ์นำหน้าคำค้นหาที่หาแบบเดินหน้า (ตรงข้ามกับ ? ที่หาถอยหลัง) แล้วตัวอักษรตัวเดียวที่เลื่อนไปผลถัดไปในทิศทางเดียวกับที่ค้นหาไว้",
    solution: `/ERROR
n`,
    theory: `<code>/pattern</code> ค้นหา<strong>เดินหน้า</strong>จากตำแหน่ง cursor (กด Enter เพื่อยืนยันคำค้นหา) ส่วน <code>?pattern</code> ค้นหา<strong>ถอยหลัง</strong> — pattern รองรับ regex เต็มรูปแบบเหมือน <code>:%s/pattern/.../g</code><br/><br/>
    หลังค้นหาแล้ว:<br/>
    • <code>n</code> — เลื่อนไปจุดที่เจอ<strong>ถัดไป</strong> (ทิศทางเดิมที่ค้นหาไว้)<br/>
    • <code>N</code> (ตัวใหญ่) — เลื่อนไปจุดที่เจอ<strong>ก่อนหน้า</strong> (ทิศทางย้อนกลับ)<br/><br/>
    ค้นหาแบบ wrap รอบไฟล์ได้อัตโนมัติ — ถ้าเลื่อนถึงท้ายไฟล์แล้วยังกด <code>n</code> ต่อ จะวนกลับไปเริ่มหาจากต้นไฟล์ใหม่ (มีข้อความ <code>search hit BOTTOM, continuing at TOP</code> เตือนให้รู้)`,
    example: `# ค้นหาคำที่ cursor อยู่ตรงนี้พอดี (ไม่ต้องพิมพ์คำเอง) แล้วเลื่อนไปจุดถัดไป
*
n`,
    task: `จงค้นหาคำว่า <code>ERROR</code> ด้วย <code>/ERROR</code> แล้วเลื่อนไปจุดที่เจอถัดไปด้วย <code>n</code>`
  },
  {
    id: "vim_macros",
    meta: "บทเสริม 11",
    title: "Vim Macros: บันทึกลำดับคีย์แล้วเล่นซ้ำอัตโนมัติ",
    template: `# สถานการณ์: มี 10 บรรทัดที่ต้องเติม ; ท้ายบรรทัดเหมือนกันหมด ไม่อยากพิมพ์ A;<Esc>j ทีละบรรทัดเอง 10 รอบ
# 1. เริ่มบันทึก macro เก็บไว้ใน register ชื่อ a
# WRITE YOUR CODE HERE


# 2. เติม ; ท้ายบรรทัดปัจจุบัน (เข้า Insert mode ที่ท้ายบรรทัดด้วย A พิมพ์ ; แล้ว Esc) แล้วเลื่อนลง 1 บรรทัด


# 3. หยุดบันทึก macro


# 4. เล่น macro ที่บันทึกไว้ซ้ำอีก 9 ครั้ง (ให้ครบ 10 บรรทัดตามที่ทำไปแล้ว 1 บรรทัดตอนบันทึก)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const startIdx = lines.findIndex(l => l === 'qa');
      const appendIdx = lines.findIndex(l => l === 'A;');
      const escIdx = lines.findIndex(l => /^(<Esc>|Esc)$/i.test(l));
      const downIdx = lines.findIndex(l => l === 'j');
      const stopIdx = lines.findIndex((l, i) => l === 'q' && i > downIdx);
      const replayIdx = lines.findIndex(l => l === '9@a');

      if (startIdx === -1) throw new Error("ไม่พบคำสั่งเริ่มบันทึก macro ลง register a\nตัวอย่าง: พิมพ์ qa");
      if (appendIdx === -1 || appendIdx < startIdx) throw new Error("ไม่พบคำสั่ง A; เพื่อเติม ; ท้ายบรรทัด\nตัวอย่าง: พิมพ์ A; หลังเริ่มบันทึก");
      if (escIdx === -1 || escIdx < appendIdx) throw new Error("ไม่พบคำสั่งออกจาก Insert mode\nตัวอย่าง: พิมพ์ <Esc>");
      if (downIdx === -1 || downIdx < escIdx) throw new Error("ไม่พบคำสั่งเลื่อนลง 1 บรรทัด\nตัวอย่าง: พิมพ์ j");
      if (stopIdx === -1) throw new Error("ไม่พบคำสั่งหยุดบันทึก macro\nตัวอย่าง: พิมพ์ q หลังทำเสร็จ");
      if (replayIdx === -1 || replayIdx < stopIdx) throw new Error("ไม่พบคำสั่งเล่น macro ซ้ำ 9 ครั้ง\nตัวอย่าง: พิมพ์ 9@a");
      log("✓ ลำดับคีย์ qa → A; → Esc → j → q → 9@a ถูกต้อง");
    },
    hint: "macro เริ่มบันทึกด้วย q ตามด้วยชื่อ register (ตัวอักษร a-z) ทำสิ่งที่ต้องการซ้ำแล้วหยุดบันทึกด้วย q เฉยๆ อีกครั้ง จากนั้นเล่นซ้ำด้วย @ ตามด้วยชื่อ register เดิม ใส่ตัวเลขนำหน้า @ ได้เพื่อเล่นซ้ำหลายรอบในคำสั่งเดียว",
    solution: `qa
A;
<Esc>
j
q
9@a`,
    theory: `<strong>Macro</strong> คือการบันทึกลำดับคีย์ที่กดจริงไว้ในตัวแปรชื่อสั้นๆ (register a-z) แล้วสั่งเล่นซ้ำได้ทีหลัง เหมาะมากกับงานที่ต้องแก้แบบเดิมซ้ำๆ กันหลายบรรทัด/หลายจุด<br/><br/>
    ขั้นตอน:<br/>
    1. <code>qa</code> — เริ่มบันทึกลง register <code>a</code> (ใช้ตัวอักษรอื่นแทน a ได้ เช่น <code>qb</code>)<br/>
    2. ทำสิ่งที่ต้องการตามปกติ (คีย์อะไรก็ได้ รวมถึงเข้า Insert mode พิมพ์ข้อความจริงด้วย)<br/>
    3. <code>q</code> (กดตัวเดียวเฉยๆ ไม่มี argument) — หยุดบันทึก<br/>
    4. <code>@a</code> — เล่น macro ที่บันทึกไว้ใน register a ซ้ำ 1 รอบ<br/>
    5. <code>9@a</code> (ใส่เลขนำหน้า) — เล่นซ้ำ 9 รอบรวด, <code>@@</code> — เล่น macro ล่าสุดที่เพิ่งเล่นไปซ้ำอีกครั้ง (ไม่ต้องพิมพ์ชื่อ register ซ้ำ)<br/><br/>
    macro ทรงพลังกว่า <code>:%s/.../.../g</code> ตรงที่ทำ logic ซับซ้อนกว่าการแทนที่ข้อความธรรมดาได้ (เช่น ตรวจเงื่อนไขแล้วแก้ต่างกันไปทีละบรรทัด)`,
    example: `# ดูเนื้อหาที่บันทึกไว้ใน macro register a (เผื่ออยากเช็คว่าบันทึกถูกต้องมั้ย)
:reg a`,
    task: `จงบันทึก macro ลง register <code>a</code> ที่เติม <code>;</code> ท้ายบรรทัดแล้วเลื่อนลง แล้วเล่นซ้ำ 9 ครั้งด้วย <code>9@a</code>`
  },
  {
    id: "unix_ls",
    meta: "บทเสริม 12",
    title: "Unix ls: ดูรายชื่อไฟล์ทั้งหมดรวมไฟล์ซ่อน พร้อมรายละเอียด",
    template: `# สถานการณ์: เพิ่ง cd เข้าโฟลเดอร์โปรเจกต์ อยากดูว่ามีไฟล์อะไรบ้าง รวมไฟล์ซ่อน (dotfiles เช่น .env, .gitignore) พร้อมสิทธิ์/ขนาด/วันที่แก้ไข
# 1. แสดงรายชื่อไฟล์ทั้งหมดในโฟลเดอร์ปัจจุบัน แบบละเอียดรวมไฟล์ซ่อน
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง ls...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasLs = /ls\s+-la\b/.test(activeCode);
      if (hasLs) {
        log("✓ ใช้ ls -la ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง ls -la\nตัวอย่าง: ls -la");
      }
    },
    hint: "ls เฉยๆ แสดงแค่ชื่อไฟล์สั้นๆ ไม่รวมไฟล์ซ่อน มี 2 flag ที่ต้องรวมกัน: แบบละเอียด (long format) และแบบรวมไฟล์ซ่อนทั้งหมด",
    solution: `ls -la`,
    theory: `<code>ls</code> เฉยๆ แสดงแค่ชื่อไฟล์/โฟลเดอร์แบบสั้น และ<strong>ไม่แสดงไฟล์ซ่อน</strong> (ไฟล์ที่ชื่อขึ้นต้นด้วย <code>.</code> เช่น <code>.env</code>, <code>.gitignore</code>)<br/><br/>
    • <code>-l</code> (long) — แสดงแบบละเอียด: สิทธิ์ (rwx), เจ้าของ, กลุ่ม, ขนาดไฟล์, วันที่แก้ไขล่าสุด<br/>
    • <code>-a</code> (all) — แสดงไฟล์ซ่อนด้วย (รวมถึง <code>.</code> และ <code>..</code> ที่แทนโฟลเดอร์ปัจจุบัน/แม่)<br/>
    • รวมกันเป็น <code>-la</code> หรือ <code>-al</code> ได้ผลเหมือนกัน<br/><br/>
    เพิ่ม <code>-h</code> (human-readable) แสดงขนาดไฟล์เป็น KB/MB/GB แทนตัวเลข byte ยาวๆ อ่านยาก: <code>ls -lah</code>`,
    example: `# แสดงขนาดไฟล์แบบอ่านง่าย (KB/MB) แทนตัวเลข byte ดิบ
ls -lah`,
    task: `จงแสดงรายชื่อไฟล์ทั้งหมดในโฟลเดอร์ปัจจุบัน แบบละเอียดรวมไฟล์ซ่อนด้วย <code>ls -la</code>`
  },
  {
    id: "unix_cat",
    meta: "บทเสริม 13",
    title: "Unix cat: แสดงเนื้อหาไฟล์สั้นๆ ในเทอร์มินัลทันที",
    template: `# สถานการณ์: อยากดูเนื้อหาไฟล์ deploy.log สั้นๆ ในเทอร์มินัลเลย ไม่อยากเปิด editor แค่เพื่อดูเฉยๆ
# 1. แสดงเนื้อหาทั้งหมดของไฟล์ deploy.log ออกทาง terminal
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง cat...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasCat = /cat\s+deploy\.log\b/.test(activeCode);
      if (hasCat) {
        log("✓ ใช้ cat deploy.log ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง cat deploy.log\nตัวอย่าง: cat deploy.log");
      }
    },
    hint: "คำสั่งพื้นฐานที่สุดสำหรับพิมพ์เนื้อหาไฟล์ออกทาง stdout ตรงๆ ไม่มี flag อะไรพิเศษ",
    solution: `cat deploy.log`,
    theory: `<code>cat</code> (concatenate) พิมพ์เนื้อหาไฟล์ออกทาง stdout ตรงๆ ทั้งไฟล์ — เหมาะกับไฟล์สั้นๆ ที่อยากดูเนื้อหาเร็วๆ โดยไม่ต้องเปิด editor<br/><br/>
    ใส่หลายไฟล์พร้อมกันได้ จะพิมพ์ต่อกันเป็นเนื้อหาเดียว: <code>cat a.txt b.txt</code> — ที่มาของชื่อ "concatenate" (เอามาต่อกัน) นั่นเอง<br/><br/>
    <strong>ข้อควรระวัง:</strong> ถ้าไฟล์ยาวมาก (log เป็นหมื่นบรรทัด) <code>cat</code> จะพิมพ์รัวออกมาทั้งหมดจนล้นหน้าจอ อ่านไม่ทัน — กรณีนั้นควรใช้ <code>head</code>/<code>tail</code> (ดูเฉพาะส่วนต้น/ท้าย) หรือ <code>less</code> (เลื่อนดูทีละหน้า) แทน`,
    example: `# ต่อหลายไฟล์เข้าด้วยกันแล้วเก็บผลรวมไว้ในไฟล์ใหม่
cat part1.txt part2.txt > combined.txt`,
    task: `จงแสดงเนื้อหาทั้งหมดของไฟล์ <code>deploy.log</code> ด้วย <code>cat</code>`
  },
  {
    id: "unix_head_tail",
    meta: "บทเสริม 14",
    title: "Unix head/tail: ดูแค่ต้นไฟล์หรือท้ายไฟล์ (รวมถึงแบบ Real-time)",
    template: `# สถานการณ์: ไฟล์ deploy.log มีเป็นหมื่นบรรทัด อยากดู 20 บรรทัดแรกเช็ค header ก่อน แล้วอยากดู log ใหม่ที่เขียนเพิ่มเข้ามาแบบ real-time
# 1. แสดง 20 บรรทัดแรกของไฟล์ deploy.log
# WRITE YOUR CODE HERE


# 2. ตามดู log ใหม่ที่เขียนเพิ่มเข้าไฟล์ deploy.log แบบ real-time (ค้างหน้าจอรอดูต่อเนื่อง)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง head/tail...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasHead = /head\s+-n\s*20\s+deploy\.log\b/.test(activeCode);
      const hasTailF = /tail\s+-f\s+deploy\.log\b/.test(activeCode);
      if (!hasHead) {
        throw new Error("ไม่พบคำสั่ง head -n 20 deploy.log\nตัวอย่าง: head -n 20 deploy.log");
      }
      if (!hasTailF) {
        throw new Error("ไม่พบคำสั่ง tail -f deploy.log\nตัวอย่าง: tail -f deploy.log");
      }
      log("✓ ใช้ head -n 20 deploy.log แล้ว tail -f deploy.log ถูกต้อง");
    },
    hint: "คำสั่งแรกดูบรรทัดต้นไฟล์ ใส่ -n ตามด้วยจำนวนบรรทัด ส่วนคำสั่งที่สองดูบรรทัดท้ายไฟล์ มี flag พิเศษที่ทำให้ค้างรอดู log ใหม่ต่อเนื่องแทนที่จะแสดงแล้วจบทันที",
    solution: `head -n 20 deploy.log
tail -f deploy.log`,
    theory: `<code>head</code> แสดง<strong>บรรทัดแรกๆ</strong> ของไฟล์ (default 10 บรรทัด ถ้าไม่ระบุ), <code>tail</code> แสดง<strong>บรรทัดท้ายๆ</strong> ของไฟล์ — ใช้ <code>-n &lt;จำนวน&gt;</code> กำหนดจำนวนบรรทัดที่ต้องการทั้งคู่<br/><br/>
    <strong><code>tail -f</code></strong> (follow) พิเศษกว่า: แสดงบรรทัดท้ายไฟล์แล้ว<strong>ไม่จบโปรแกรม</strong> แต่ค้างรอดูบรรทัดใหม่ที่ถูกเขียนเพิ่มเข้าไฟล์แบบ real-time (เหมือนเปิดจอมอนิเตอร์ log สด) — เป็นวิธีมาตรฐานที่ใช้ตามดู log ของ server/process ที่กำลังรันอยู่ กด <code>Ctrl+C</code> เพื่อหยุดตาม`,
    example: `# ผสมกับ grep เพื่อกรองเฉพาะบรรทัดที่มีคำว่า ERROR แบบ real-time
tail -f deploy.log | grep ERROR`,
    task: `จงแสดง 20 บรรทัดแรกของ <code>deploy.log</code> ด้วย <code>head -n 20</code> แล้วตามดู log ใหม่แบบ real-time ด้วย <code>tail -f</code>`
  },
  {
    id: "unix_cp_mv",
    meta: "บทเสริม 15",
    title: "Unix cp/mv: สำรองไฟล์ (Copy) และย้าย/เปลี่ยนชื่อไฟล์ (Move)",
    template: `# สถานการณ์: ก่อนแก้ config.yaml อยาก backup ไฟล์เดิมไว้ก่อน แล้วพอ backup เสร็จอยากย้ายไฟล์ backup นั้นไปเก็บในโฟลเดอร์ archive/
# 1. คัดลอกไฟล์ config.yaml เป็น config.yaml.bak (backup ไว้)
# WRITE YOUR CODE HERE


# 2. ย้ายไฟล์ config.yaml.bak ไปไว้ในโฟลเดอร์ archive/ (path เดิม)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง cp/mv...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasCp = /cp\s+config\.yaml\s+config\.yaml\.bak\b/.test(activeCode);
      const hasMv = /mv\s+config\.yaml\.bak\s+archive\/config\.yaml\.bak\b/.test(activeCode);
      if (!hasCp) {
        throw new Error("ไม่พบคำสั่ง cp config.yaml config.yaml.bak\nตัวอย่าง: cp config.yaml config.yaml.bak");
      }
      if (!hasMv) {
        throw new Error("ไม่พบคำสั่ง mv config.yaml.bak archive/config.yaml.bak\nตัวอย่าง: mv config.yaml.bak archive/config.yaml.bak");
      }
      log("✓ ใช้ cp config.yaml config.yaml.bak แล้ว mv config.yaml.bak archive/config.yaml.bak ถูกต้อง");
    },
    hint: "คำสั่งแรกทำสำเนาไฟล์ (ต้นฉบับยังอยู่ มี 2 ไฟล์หลังรัน) ระบุไฟล์ต้นทางแล้วตามด้วยชื่อไฟล์ปลายทางใหม่ คำสั่งที่สองย้ายไฟล์ไปที่ปลายทางใหม่ (ต้นฉบับหายไป เหลือแค่ที่ปลายทาง) syntax เหมือนกัน",
    solution: `cp config.yaml config.yaml.bak
mv config.yaml.bak archive/config.yaml.bak`,
    theory: `<code>cp &lt;ต้นทาง&gt; &lt;ปลายทาง&gt;</code> (copy) — ทำสำเนาไฟล์ ต้นฉบับยังอยู่เหมือนเดิม หลังรันจะมี<strong>2 ไฟล์</strong> ถ้าอยาก copy ทั้งโฟลเดอร์ต้องเติม <code>-r</code> (recursive): <code>cp -r src-dir/ dest-dir/</code><br/><br/>
    <code>mv &lt;ต้นทาง&gt; &lt;ปลายทาง&gt;</code> (move) — ย้ายไฟล์ ต้นฉบับ<strong>หายไป</strong> เหลือแค่ที่ปลายทางใหม่ (มีไฟล์เดียว) ใช้ syntax เดียวกันได้ทั้ง 2 จุดประสงค์:<br/>
    • <strong>ย้ายไปโฟลเดอร์อื่น</strong> (ชื่อไฟล์เหมือนเดิม): <code>mv file.txt archive/file.txt</code><br/>
    • <strong>เปลี่ยนชื่อ</strong> (อยู่โฟลเดอร์เดิม): <code>mv old-name.txt new-name.txt</code> — Unix ไม่มีคำสั่ง <code>rename</code> แยกต่างหาก ใช้ <code>mv</code> ทำหน้าที่นี้แทน`,
    example: `# เปลี่ยนชื่อไฟล์ (อยู่โฟลเดอร์เดิม ไม่ได้ย้ายที่)
mv old-report.json report.json`,
    task: `จงคัดลอก <code>config.yaml</code> เป็น <code>config.yaml.bak</code> ด้วย <code>cp</code> แล้วย้ายไปไว้ที่ <code>archive/config.yaml.bak</code> ด้วย <code>mv</code>`
  },
  {
    id: "unix_rm",
    meta: "บทเสริม 16",
    title: "Unix rm: ลบไฟล์/โฟลเดอร์ทิ้งถาวร (ไม่มีถังขยะ)",
    template: `# สถานการณ์: โฟลเดอร์ tmp-cache/ มีไฟล์ cache เก่าเต็มไปหมด อยากลบทิ้งทั้งโฟลเดอร์รวดเดียว
# 1. ลบโฟลเดอร์ tmp-cache ทิ้งทั้งหมด (รวมไฟล์ข้างในทุกไฟล์) โดยไม่ต้องถามยืนยันทีละไฟล์
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง rm...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRm = /rm\s+-rf\s+tmp-cache\b/.test(activeCode);
      if (hasRm) {
        log("✓ ใช้ rm -rf tmp-cache ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง rm -rf tmp-cache\nตัวอย่าง: rm -rf tmp-cache");
      }
    },
    hint: "ลบโฟลเดอร์ต้องมี flag ที่ทำให้ลบแบบวนลึกเข้าไปทุกไฟล์ข้างใน รวมกับ flag ที่ไม่ถามยืนยันและไม่ error ถ้าไม่เจอไฟล์บางไฟล์",
    solution: `rm -rf tmp-cache`,
    theory: `<code>rm &lt;ไฟล์&gt;</code> แบบ default ลบได้แค่ไฟล์เดี่ยว ลบโฟลเดอร์ไม่ได้ (error <code>Is a directory</code>) ต้องเติม flag:<br/><br/>
    • <code>-r</code> (recursive) — ลบแบบวนลึกเข้าไปทุก subdirectory จำเป็นสำหรับลบโฟลเดอร์<br/>
    • <code>-f</code> (force) — ไม่ถามยืนยันทีละไฟล์ และไม่ error ถ้าไฟล์ไม่มีอยู่จริง<br/>
    • รวมกันเป็น <code>-rf</code> คือ pattern มาตรฐานที่ใช้ลบโฟลเดอร์ทั้งก้อนแบบเงียบๆ<br/><br/>
    <strong style="color:#e00">คำเตือนสำคัญที่สุด:</strong> Unix <strong>ไม่มีถังขยะ (trash)</strong> — <code>rm -rf</code> ลบถาวรทันที กู้คืนไม่ได้เลย (ต่างจาก GUI ที่ลบแล้วยังกู้จาก Recycle Bin ได้) และห้ามใช้กับตัวแปรที่อาจว่างเปล่าเด็ดขาด: <code>rm -rf "$DIR"</code> ถ้า <code>$DIR</code> ดันไม่ได้ตั้งค่าไว้ (unset) จะกลายเป็น <code>rm -rf ""</code> ซึ่งบางกรณีตีความเป็นโฟลเดอร์ปัจจุบันหรือแย่กว่านั้น — นี่คือเหตุผลที่บท <code>set -euo pipefail</code> (โดยเฉพาะ <code>-u</code>) สำคัญมากในสคริปต์ที่มี <code>rm -rf</code>`,
    example: `# ปลอดภัยกว่า: ดูก่อนว่าจะลบอะไรบ้างด้วย -i (ถามยืนยันทีละไฟล์) ก่อนมั่นใจแล้วค่อยใช้ -f
rm -ri tmp-cache`,
    task: `จงลบโฟลเดอร์ <code>tmp-cache</code> ทิ้งทั้งหมดด้วย <code>rm -rf</code>`
  },
  {
    id: "unix_wc",
    meta: "บทเสริม 17",
    title: "Unix wc: นับจำนวนบรรทัด/คำ/ตัวอักษรในไฟล์",
    template: `# สถานการณ์: อยากรู้คร่าวๆ ว่าไฟล์ test-results.log มีผลการรันเทสทั้งหมดกี่บรรทัด (นับจำนวนบรรทัดในไฟล์)
# 1. นับจำนวนบรรทัดทั้งหมดในไฟล์ test-results.log
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง wc...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasWc = /wc\s+-l\s+test-results\.log\b/.test(activeCode);
      if (hasWc) {
        log("✓ ใช้ wc -l test-results.log ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง wc -l test-results.log\nตัวอย่าง: wc -l test-results.log");
      }
    },
    hint: "wc (word count) มี flag เฉพาะสำหรับนับจำนวนบรรทัด (ไม่ใช่คำ) ตามด้วยชื่อไฟล์ที่ต้องการนับ",
    solution: `wc -l test-results.log`,
    theory: `<code>wc</code> (word count) นับสถิติพื้นฐานของไฟล์ text:<br/><br/>
    • <code>-l</code> — นับจำนวน<strong>บรรทัด</strong> (line)<br/>
    • <code>-w</code> — นับจำนวน<strong>คำ</strong> (word, แบ่งด้วย whitespace)<br/>
    • <code>-c</code> — นับจำนวน<strong>byte</strong>, <code>-m</code> — นับจำนวน<strong>ตัวอักษร</strong> (character อาจต่างจาก byte ถ้ามีตัวอักษรหลาย byte เช่นภาษาไทย)<br/><br/>
    ใช้บ่อยที่สุดแบบต่อ pipe เพื่อนับจำนวนผลลัพธ์จากคำสั่งอื่น เช่น <code>grep FAIL test-results.log | wc -l</code> นับว่ามีกี่บรรทัดที่ fail — เร็วกว่าเปิดไฟล์มานับเองเยอะ`,
    example: `# นับจำนวนบรรทัดที่มีคำว่า FAIL แทนที่จะนับทั้งไฟล์
grep FAIL test-results.log | wc -l`,
    task: `จงนับจำนวนบรรทัดทั้งหมดในไฟล์ <code>test-results.log</code> ด้วย <code>wc -l</code>`
  },
  {
    id: "unix_redirection",
    meta: "บทเสริม 18",
    title: "Unix Redirection: ส่ง Output ไปเก็บในไฟล์แทนพิมพ์หน้าจอ",
    template: `# สถานการณ์: รัน run-tests.sh แล้วอยากเก็บผลลัพธ์ปกติไว้ในไฟล์ ทับของเก่า, ต่อยอดเพิ่มเข้าไฟล์เดิมแบบไม่ทับ, แล้วสุดท้ายเก็บทั้งผลลัพธ์ปกติและ error รวมไฟล์เดียวกัน
# 1. รัน run-tests.sh แล้วเก็บผลลัพธ์ปกติ (stdout) ลงไฟล์ out.log แบบทับของเดิม
# WRITE YOUR CODE HERE


# 2. รันอีกครั้ง แล้วต่อท้ายผลลัพธ์เข้า out.log โดยไม่ลบของเดิม


# 3. รันอีกครั้ง แล้วเก็บทั้งผลลัพธ์ปกติและ error รวมกันในไฟล์ out.log (ทับใหม่)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Redirection...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasOverwrite = lines.some(l => l === 'run-tests.sh > out.log');
      const hasAppend = lines.some(l => l === 'run-tests.sh >> out.log');
      const hasBoth = lines.some(l => l === 'run-tests.sh > out.log 2>&1');

      if (!hasOverwrite) throw new Error("ไม่พบคำสั่ง run-tests.sh > out.log\nตัวอย่าง: run-tests.sh > out.log");
      if (!hasAppend) throw new Error("ไม่พบคำสั่ง run-tests.sh >> out.log\nตัวอย่าง: run-tests.sh >> out.log");
      if (!hasBoth) throw new Error("ไม่พบคำสั่ง run-tests.sh > out.log 2>&1\nตัวอย่าง: run-tests.sh > out.log 2>&1");
      log("✓ ใช้ >, >>, และ 2>&1 ครบทั้ง 3 แบบถูกต้อง");
    },
    hint: "> ตัวเดียวทับไฟล์เดิม, >> สองตัวต่อท้ายไม่ทับ, ส่วนการรวม stderr เข้ากับ stdout ต้องเติม 2>&1 ต่อท้ายสุด (หลัง > ที่กำหนดปลายทางแล้ว)",
    solution: `run-tests.sh > out.log
run-tests.sh >> out.log
run-tests.sh > out.log 2>&1`,
    theory: `Unix มี 2 stream หลักที่โปรแกรมพิมพ์ออกมา: <strong>stdout</strong> (output ปกติ, หมายเลข 1) และ <strong>stderr</strong> (error, หมายเลข 2) — redirection ควบคุมว่าแต่ละ stream ไปไหน:<br/><br/>
    • <code>&gt; file</code> — ส่ง stdout ไปเขียนไฟล์ <strong>ทับของเดิมทั้งหมด</strong><br/>
    • <code>&gt;&gt; file</code> — ส่ง stdout ไปเขียนไฟล์แบบ<strong>ต่อท้าย</strong> ไม่ลบเนื้อหาเดิม<br/>
    • <code>2&gt;&amp;1</code> — ส่ง stderr (2) ไปที่เดียวกับที่ stdout (1) กำลังไปอยู่ ณ ตอนนั้น — <strong>ลำดับสำคัญมาก</strong> ต้องเขียน <code>&gt; out.log 2&gt;&amp;1</code> (กำหนดปลายทางของ stdout ก่อน แล้วค่อยบอก stderr ให้ไปที่เดียวกัน) สลับลำดับผลจะไม่เหมือนกัน<br/><br/>
    ใช้บ่อยตอนรัน script ใน background/cron แล้วอยากเก็บทั้ง output และ error ไว้ตรวจสอบทีหลังในไฟล์เดียว แทนที่จะปล่อยหายไปกับ terminal`,
    example: `# ทิ้ง output ทั้งหมดไม่สนใจเลย (ส่งไป /dev/null ซึ่งเป็นเหมือน "หลุมดำ")
noisy-command.sh > /dev/null 2>&1`,
    task: `จงเขียนคำสั่งให้ครบ 3 แบบ:<br/>
    1. <code>run-tests.sh > out.log</code> — ทับของเดิม<br/>
    2. <code>run-tests.sh >> out.log</code> — ต่อท้ายไม่ทับ<br/>
    3. <code>run-tests.sh > out.log 2>&1</code> — รวม stdout+stderr`
  },
  {
    id: "unix_xargs",
    meta: "บทเสริม 19",
    title: "Unix xargs: ส่งผลลัพธ์จาก Pipe ไปเป็น Argument ของคำสั่งถัดไป",
    template: `# สถานการณ์: อยากลบไฟล์ .tmp ทั้งหมดที่ find เจอ แต่อยากใช้ rm ตรงๆ แทน find -delete (เผื่อ rm มีอย่างอื่นต้องทำเพิ่ม เช่น log ก่อนลบ)
# 1. หาไฟล์ .tmp ทั้งหมดในโฟลเดอร์ปัจจุบัน แล้วส่งรายชื่อที่เจอไปเป็น argument ให้ rm ลบทิ้ง
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง xargs...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasXargs = /find\s+\.\s+-name\s+['"]?\*\.tmp['"]?\s*\|\s*xargs\s+rm\b/.test(activeCode);
      if (hasXargs) {
        log("✓ ใช้ find . -name '*.tmp' | xargs rm ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง find . -name '*.tmp' | xargs rm\nตัวอย่าง: find . -name '*.tmp' | xargs rm");
      }
    },
    hint: "หาไฟล์ก่อนด้วย find ปกติ แล้วต่อ pipe เข้ากับคำสั่งที่แปลง stdin แต่ละบรรทัดให้กลายเป็น argument ของคำสั่งถัดไป ตามด้วยชื่อคำสั่งที่ต้องการรัน (rm)",
    solution: `find . -name '*.tmp' | xargs rm`,
    theory: `หลายคำสั่ง (เช่น <code>rm</code>) รับ<strong>argument</strong>เป็นชื่อไฟล์ แต่<strong>ไม่ได้อ่านจาก stdin โดยตรง</strong> — ถ้า <code>find ... | rm</code> ตรงๆ จะไม่ทำงาน เพราะ <code>rm</code> ไม่รู้จะเอา stdin ไปทำอะไร<br/><br/>
    <code>xargs</code> แก้ปัญหานี้: อ่านแต่ละบรรทัดจาก stdin แล้ว<strong>แปลงเป็น argument</strong> ต่อท้ายคำสั่งที่ระบุ — <code>find . -name '*.tmp' | xargs rm</code> เท่ากับสั่ง <code>rm</code> พร้อม argument เป็นรายชื่อไฟล์ทั้งหมดที่ find เจอ<br/><br/>
    <strong>ข้อควรระวัง:</strong> ถ้าชื่อไฟล์มี space อยู่ข้างใน <code>xargs</code> ธรรมดาจะตัดคำผิดพลาด (แยกชื่อไฟล์เดียวเป็นหลาย argument) วิธีป้องกันคือใช้คู่กับ <code>find -print0</code> และ <code>xargs -0</code> ที่คั่นด้วย null byte แทน space`,
    example: `# ปลอดภัยกว่าเวลาชื่อไฟล์อาจมี space (คั่นด้วย null byte แทน)
find . -name '*.tmp' -print0 | xargs -0 rm`,
    task: `จงหาไฟล์ <code>.tmp</code> ทั้งหมดด้วย <code>find</code> แล้วส่งต่อให้ <code>xargs rm</code> ลบทิ้ง`
  },
  {
    id: "unix_ps_kill",
    meta: "บทเสริม 20",
    title: "Unix ps/kill: หา Process ที่ค้างอยู่แล้วปิดทิ้ง",
    template: `# สถานการณ์: dev server (node) ที่ลืมปิดค้างกิน port อยู่ ต้องการหา process ที่รันอยู่แล้วปิดทิ้ง
# 1. แสดง process ทั้งหมดที่กำลังรันอยู่ กรองเฉพาะที่เกี่ยวกับ node
# WRITE YOUR CODE HERE


# 2. ปิด process ที่เจอ (สมมติ PID คือ 1234) แบบบังคับปิดทันที
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง ps/kill...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasPs = lines.some(l => /^ps\s+aux\s*\|\s*grep\s+node$/.test(l));
      const hasKill = lines.some(l => /^kill\s+-9\s+1234$/.test(l));

      if (!hasPs) throw new Error("ไม่พบคำสั่ง ps aux | grep node\nตัวอย่าง: ps aux | grep node");
      if (!hasKill) throw new Error("ไม่พบคำสั่ง kill -9 1234\nตัวอย่าง: kill -9 1234");
      log("✓ ใช้ ps aux | grep node แล้ว kill -9 1234 ถูกต้อง");
    },
    hint: "แสดง process ทั้งหมดของทุก user (aux) แล้วต่อ pipe กรองด้วยเครื่องมือค้นหา pattern มาตรฐาน จากนั้นสั่งปิด process ด้วย PID ที่เจอ พร้อม flag ที่แปลว่า 'บังคับปิดทันที ไม่ต้องรอ'",
    solution: `ps aux | grep node
kill -9 1234`,
    theory: `<code>ps aux</code> แสดง process ทั้งหมดที่กำลังรันอยู่ในเครื่อง (ทุก user, <code>a</code>=all users, <code>u</code>=user-oriented format แสดง CPU%/mem%, <code>x</code>=รวม process ที่ไม่ได้ผูกกับ terminal ด้วย) แต่ละแถวมี <strong>PID</strong> (Process ID) ซึ่งเป็นตัวเลขไว้อ้างอิงว่าจะสั่งอะไรกับ process ไหน — ต่อ pipe เข้า <code>grep</code> เพื่อกรองหาเฉพาะที่สนใจ<br/><br/>
    <code>kill &lt;PID&gt;</code> ส่ง<strong>signal</strong>ไปให้ process — default คือ <code>SIGTERM</code> (signal 15) ที่แค่ "ขอร้อง" ให้ process ปิดตัวเอง (ยังทำ cleanup ก่อนปิดได้) ส่วน <code>kill -9</code> คือ <code>SIGKILL</code> ที่<strong>บังคับปิดทันที ไม่ให้โอกาส cleanup เลย</strong><br/><br/>
    <strong>แนวทางที่ควรทำ:</strong> ลอง <code>kill &lt;PID&gt;</code> เปล่าๆ (ไม่มี -9) ก่อนเสมอ ให้โอกาส process ปิดตัวเองอย่างเรียบร้อย ถ้าไม่ยอมปิดจริงๆ ค่อยใช้ <code>-9</code> เป็นทางเลือกสุดท้าย`,
    example: `# ปิด process ทุกตัวที่ชื่อ node ตรงๆ โดยไม่ต้องหา PID เอง
pkill -9 node`,
    task: `จงหา process ของ node ด้วย <code>ps aux | grep node</code> แล้วปิด process ที่ PID <code>1234</code> แบบบังคับด้วย <code>kill -9 1234</code>`
  },
  {
    id: "unix_curl",
    meta: "บทเสริม 21",
    title: "Unix curl: ยิง Request ทดสอบ API จาก Terminal",
    template: `# สถานการณ์: อยาก smoke-test แบบเร็วๆ ว่า endpoint https://api.example.com/health ตอบ HTTP status code อะไร โดยไม่สนใจเนื้อหา response เลย
# 1. ยิง GET ไปที่ endpoint นั้น แสดงแค่ HTTP status code ออกมา ไม่แสดงเนื้อหา response
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง curl...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasCurl = /curl\s+-s\s+-o\s+\/dev\/null\s+-w\s+["']%\{http_code\}["']\s+https:\/\/api\.example\.com\/health\b/.test(activeCode);
      if (hasCurl) {
        log("✓ ใช้ curl -s -o /dev/null -w \"%{http_code}\" https://api.example.com/health ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง curl -s -o /dev/null -w \"%{http_code}\" https://api.example.com/health\nตัวอย่าง: curl -s -o /dev/null -w \"%{http_code}\" https://api.example.com/health");
      }
    },
    hint: "ต้องปิด progress meter ก่อน (silent) ทิ้งเนื้อหา response ไปที่ /dev/null (ไม่สนใจ) แล้วใช้ flag format output พิมพ์แค่ status code ออกมาแทน",
    solution: `curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health`,
    theory: `<code>curl &lt;url&gt;</code> ยิง HTTP request จาก terminal (default เป็น GET) พิมพ์ response body ออกทาง stdout — เร็วกว่าเปิด Postman ตอนอยากทดสอบเร็วๆ ระหว่างเขียนสคริปต์<br/><br/>
    Flag ที่ใช้บ่อยสำหรับ smoke test:<br/>
    • <code>-s</code> (silent) — ปิด progress meter ที่ปกติจะพิมพ์ระหว่างโหลด<br/>
    • <code>-o /dev/null</code> — ทิ้ง response body ไป (ไม่สนใจเนื้อหา แค่อยากรู้ว่า request สำเร็จมั้ย)<br/>
    • <code>-w "%{http_code}"</code> (write-out) — พิมพ์ค่า HTTP status code ออกมาแทน (200, 404, 500 ฯลฯ)<br/><br/>
    รวมกันได้ one-liner เช็คว่า endpoint ตอบ 200 มั้ยโดยไม่ต้อง parse response เอง — ใช้ได้ทั้งตอนทดสอบมือและใน CI script`,
    example: `# ยิง POST พร้อม JSON body และ header กำหนด content-type
curl -X POST -H "Content-Type: application/json" -d '{"user":"qa"}' https://api.example.com/login`,
    task: `จงยิง GET ไปที่ <code>https://api.example.com/health</code> แล้วแสดงแค่ HTTP status code ด้วย <code>curl -s -o /dev/null -w "%{http_code}"</code>`
  },
  {
    id: "unix_tar",
    meta: "บทเสริม 22",
    title: "Unix tar: บีบอัดและแตกไฟล์ Archive",
    template: `# สถานการณ์: อยากบีบอัดโฟลเดอร์ test-reports/ ทั้งหมดเป็นไฟล์เดียวก่อนอัปโหลดเป็น CI artifact แล้วอีกเครื่องนึงต้องแตกไฟล์นั้นออกมาดู
# 1. บีบอัดโฟลเดอร์ test-reports/ เป็นไฟล์ test-reports.tar.gz (พร้อมแสดงรายชื่อไฟล์ที่บีบอัดไปด้วย)
# WRITE YOUR CODE HERE


# 2. แตกไฟล์ test-reports.tar.gz ออกมา (พร้อมแสดงรายชื่อไฟล์ที่แตกออกมาด้วย)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง tar...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasCreate = lines.some(l => /^tar\s+-czvf\s+test-reports\.tar\.gz\s+test-reports\/?$/.test(l));
      const hasExtract = lines.some(l => /^tar\s+-xzvf\s+test-reports\.tar\.gz$/.test(l));

      if (!hasCreate) throw new Error("ไม่พบคำสั่ง tar -czvf test-reports.tar.gz test-reports/\nตัวอย่าง: tar -czvf test-reports.tar.gz test-reports/");
      if (!hasExtract) throw new Error("ไม่พบคำสั่ง tar -xzvf test-reports.tar.gz\nตัวอย่าง: tar -xzvf test-reports.tar.gz");
      log("✓ ใช้ tar -czvf ... แล้ว tar -xzvf ... ถูกต้อง");
    },
    hint: "สร้าง archive ใช้ flag c (create) รวมกับ z (gzip) v (verbose) f (filename ต้องอยู่ท้ายสุดก่อนชื่อไฟล์) ส่วนแตกไฟล์เปลี่ยนแค่ c เป็น x (extract) ที่เหลือเหมือนเดิม",
    solution: `tar -czvf test-reports.tar.gz test-reports/
tar -xzvf test-reports.tar.gz`,
    theory: `<code>tar</code> (tape archive) รวมหลายไฟล์/โฟลเดอร์เป็น archive ไฟล์เดียว — flag ที่ต้องจำ (เรียงลำดับสำคัญ <code>f</code> ต้องอยู่ท้ายสุดก่อนชื่อไฟล์เสมอ):<br/><br/>
    • <code>c</code> (create) — สร้าง archive ใหม่, <code>x</code> (extract) — แตก archive ออกมา<br/>
    • <code>z</code> (gzip) — บีบอัด/แตกแบบ gzip พร้อมกันในตัว (ได้ <code>.tar.gz</code>)<br/>
    • <code>v</code> (verbose) — แสดงรายชื่อไฟล์ที่กำลังประมวลผลระหว่างทาง (เห็น progress)<br/>
    • <code>f</code> (filename) — ระบุว่าชื่อไฟล์ archive คืออะไร (argument ถัดจาก flag นี้ต้องเป็นชื่อไฟล์เสมอ)<br/><br/>
    <code>-czvf</code> (create) กับ <code>-xzvf</code> (extract) คือ 2 pattern ที่ใช้บ่อยที่สุดจนควรจำขึ้นใจ — ใช้เก็บ build artifact/test report ก่อนอัปโหลดใน CI pipeline บ่อยมาก เพราะไฟล์เดียวอัปโหลด/ดาวน์โหลดง่ายกว่าไฟล์กระจายเป็นร้อยไฟล์`,
    example: `# ดูรายชื่อไฟล์ข้างใน archive โดยไม่ต้องแตกไฟล์จริง (t = list contents)
tar -tzvf test-reports.tar.gz`,
    task: `จงบีบอัดโฟลเดอร์ <code>test-reports/</code> เป็น <code>test-reports.tar.gz</code> ด้วย <code>tar -czvf</code> แล้วแตกกลับออกมาด้วย <code>tar -xzvf</code>`
  },
  {
    id: "unix_sed",
    meta: "บทเสริม 23",
    title: "Unix sed: แทนที่ข้อความในไฟล์ตรงๆ ผ่าน Command Line",
    template: `# สถานการณ์: ต้องเปลี่ยนเลขเวอร์ชันในไฟล์ version.txt จาก 1.2.0 เป็น 1.3.0 ทุกจุดที่เจอ โดยแก้ไฟล์ตรงๆ ไม่เปิด editor
# 1. แทนที่ 1.2.0 เป็น 1.3.0 ทุกจุด แล้วบันทึกทับไฟล์ version.txt เลย (in-place)
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง sed...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasSed = /sed\s+-i\s+["']s\/1\.2\.0\/1\.3\.0\/g["']\s+version\.txt\b/.test(activeCode);
      if (hasSed) {
        log("✓ ใช้ sed -i 's/1.2.0/1.3.0/g' version.txt ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง sed -i 's/1.2.0/1.3.0/g' version.txt\nตัวอย่าง: sed -i 's/1.2.0/1.3.0/g' version.txt");
      }
    },
    hint: "sed ใช้ syntax แทนที่แบบเดียวกับ :%s ของ Vim (s/หา/แทน/g) แต่ต้องมี flag บอกว่าให้แก้ไฟล์ตรงๆ ในที่ (in-place) แล้วตามด้วยชื่อไฟล์",
    solution: `sed -i 's/1.2.0/1.3.0/g' version.txt`,
    theory: `<code>sed</code> (stream editor) แก้ไขข้อความแบบ non-interactive จาก command line โดยตรง ใช้ syntax แทนที่แบบเดียวกับที่เรียนใน Vim: <code>s/หา/แทน/g</code> (<code>g</code> = แทนที่ทุกจุดที่เจอต่อบรรทัด ไม่ใช่แค่จุดแรก) — โมเดลความคิดเดียวกันย้ายไปใช้ได้ทั้ง 2 เครื่องมือ<br/><br/>
    • <code>-i</code> (in-place) — แก้ไฟล์จริงตรงๆ ทับต้นฉบับเลย ถ้าไม่ใส่ <code>-i</code> ผลลัพธ์จะพิมพ์ออกทาง stdout เฉยๆ ไม่แก้ไฟล์จริง<br/>
    • <strong>ข้อควรระวังข้าม OS:</strong> บน Linux <code>sed -i 's/.../.../ ' file</code> ใช้ได้ตรงๆ แต่บน macOS (BSD sed) ต้องใส่ argument ว่างต่อจาก <code>-i</code> เสมอ: <code>sed -i '' 's/.../.../' file</code> ไม่งั้นจะ error หรือพฤติกรรมเพี้ยน<br/><br/>
    ใช้บ่อยตอนต้องแก้ config/version หลายไฟล์พร้อมกันแบบอัตโนมัติใน script (เช่น bump version ตอน release) โดยไม่ต้องเปิด editor ทีละไฟล์`,
    example: `# แก้ไฟล์แบบเก็บสำเนาต้นฉบับไว้เป็น .bak ก่อนเสมอ (ปลอดภัยกว่า เผื่อพลาด)
sed -i.bak 's/1.2.0/1.3.0/g' version.txt`,
    task: `จงแทนที่ <code>1.2.0</code> เป็น <code>1.3.0</code> ทุกจุดในไฟล์ <code>version.txt</code> แบบแก้ทับไฟล์ตรงๆ ด้วย <code>sed -i 's/1.2.0/1.3.0/g' version.txt</code>`
  },
  {
    id: "unix_export",
    meta: "บทเสริม 24",
    title: "Unix export: ตั้งค่า Environment Variable ให้ Subprocess มองเห็น",
    template: `# สถานการณ์: script ทดสอบต้องอ่านค่า API_URL จาก environment variable แต่ตั้งค่าตัวแปรใน shell เฉยๆ ไม่พอ เพราะ subprocess ที่ script เรียกต่อ (เช่น node) มองไม่เห็นค่านั้นเลย
# 1. ตั้งค่า environment variable ชื่อ API_URL ให้เป็น https://staging.api.example.com แบบที่ subprocess มองเห็นได้
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง export...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasExport = /export\s+API_URL=https:\/\/staging\.api\.example\.com\b/.test(activeCode);
      if (hasExport) {
        log("✓ ใช้ export API_URL=https://staging.api.example.com ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง export API_URL=https://staging.api.example.com\nตัวอย่าง: export API_URL=https://staging.api.example.com");
      }
    },
    hint: "ตั้งค่าตัวแปรแบบ VAR=value เฉยๆ จะเห็นได้แค่ shell ปัจจุบัน มีคำสั่งนำหน้าที่ทำให้ตัวแปรนั้นกลายเป็น environment variable ที่ subprocess ที่ถูกเรียกต่อจากนี้มองเห็นได้ด้วย",
    solution: `export API_URL=https://staging.api.example.com`,
    theory: `<code>VAR=value</code> เฉยๆ (ไม่มี <code>export</code>) ตั้งค่าเป็นแค่<strong>shell variable</strong> — มองเห็นได้เฉพาะ shell ปัจจุบันเท่านั้น ถ้า shell นี้ไปเรียก process อื่นต่อ (เช่นรัน <code>node script.js</code>) process ลูกนั้น<strong>จะมองไม่เห็นค่านี้เลย</strong><br/><br/>
    <code>export VAR=value</code> เลื่อนสถานะตัวแปรขึ้นเป็น<strong>environment variable</strong> ที่ถูกส่งต่อ (inherit) ไปให้ทุก subprocess ที่ถูกเรียกจาก shell นี้นับจากนี้ไป — สำคัญมากเพราะเครื่องมือส่วนใหญ่ (test runner, build script, framework ต่างๆ) อ่าน config ผ่าน environment variable (เช่น <code>process.env.API_URL</code> ใน Node.js หรือ <code>os.environ</code> ใน Python) ไม่ได้อ่านจาก shell variable ตรงๆ<br/><br/>
    เช็คค่าที่ export ไว้ได้ด้วย <code>echo $API_URL</code> หรือดูทุก environment variable พร้อมกันด้วย <code>env</code>`,
    example: `# เช็คค่าที่ export ไว้ แล้วลบทิ้งถ้าไม่ต้องการแล้ว
echo $API_URL
unset API_URL`,
    task: `จงตั้งค่า environment variable <code>API_URL</code> เป็น <code>https://staging.api.example.com</code> ด้วย <code>export</code>`
  },
];

// Application state

const PREFIX = 'cli';
const TAB_WIDTH = 2;

function runSandboxCode() {
  const lesson = LESSONS[currentLessonIndex];
  const textarea = document.getElementById('editor-textarea');
  const terminal = document.getElementById('terminal-body');
  const nextLessonBtn = document.getElementById('next-lesson-btn');
  const overlay = document.getElementById('lesson-overlay');

  if (!textarea || !terminal || !nextLessonBtn || !overlay) return;

  const userCode = textarea.value;

  // Save user code state
  localStorage.setItem(`${PREFIX}_sandbox_code_${lesson.id}`, userCode);

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
        <div class="terminal-line error">ข้อผิดพลาด: ${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Git, Vim & Unix Cheat Sheet แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วกับคำสั่งพื้นฐานที่ QA ใช้บ่อยแต่ลืมง่าย — git stash, git hooks, Vim survival, และ Unix pipe/grep!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Git, Vim & Unix Cheat Sheet');
}

// Run on window boot


  // Expose the standalone-page contract (see shared/engine.js header comment) as real globals,
  // and register into the shared registry so exam/index.html can load every track's LESSONS
  // side-by-side without a duplicate top-level "const LESSONS" collision across <script> tags.
  window.PREFIX = PREFIX;
  window.TAB_WIDTH = TAB_WIDTH;
  window.LESSONS = LESSONS;
  window.runSandboxCode = runSandboxCode;
  window.showGraduationMessage = showGraduationMessage;
  window.QA_TRACKS = window.QA_TRACKS || {};
  window.QA_TRACKS['cli-essentials'] = { id: 'cli-essentials', title: 'Git, Vim & Unix Cheat Sheet', folder: 'CLI-Essentials', lessons: LESSONS };
})();
