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
    • ถ้ามีคนแก้ไฟล์บรรทัดเดียวกันจากทั้งสองฝั่ง เกิด <strong>merge conflict</strong> ต้องแก้เองแล้ว <code>git add</code> + <code>git commit</code> ต่อให้จบ`,
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
    id: "vim_survival",
    meta: "บทที่ 8",
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
    id: "vim_search_replace",
    meta: "บทที่ 9",
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
    meta: "บทที่ 10",
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
    id: "vim_undo_redo",
    meta: "บทที่ 11",
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
    meta: "บทที่ 12",
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
    meta: "บทที่ 13",
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
    meta: "บทที่ 14",
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
    id: "unix_trap_cleanup",
    meta: "บทที่ 15",
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
}

// Run on window boot
