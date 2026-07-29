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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <code>git stash</code> เพื่อเก็บงานค้างไว้ชั่วคราวอย่างปลอดภัย พร้อมป้ายกำกับ<br/><br/>
    ⚖️ <strong>เปรียบเทียบการดึง Stash กลับมาใช้งาน:</strong><br/>
    • <code>git stash pop</code>: ดึงงานอันล่าสุดคืนและลบออกจาก Stack ทันที (เสี่ยงกระทบงานผู้อื่นหากมีหลาย Session/Worktree)<br/>
    • <code>git stash apply &lt;sha&gt;</code>: ดึงเฉพาะ Stash ที่ต้องการผ่าน SHA โดยไม่ลบออกจาก Stack (ปลอดภัยกว่าในการทำงานแบบขนาน)<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>git stash push -u -m "wip-login-fix"</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> อย่าใช้ <code>git stash</code> เปล่าๆ โดยไม่ใส่ <code>-u</code> (Include Untracked) เพราะไฟล์สร้างใหม่ที่ยังไม่ได้ <code>git add</code> จะไม่ถูกเก็บไปด้วย`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการตั้งค่า <code>core.hooksPath</code> เพื่อแชร์ Git Hooks ของทีมผ่าน Version Control<br/><br/>
    ⚖️ <strong>ความแตกต่างของตำแหน่งเก็บ Git Hooks:</strong><br/>
    • <strong>Default (<code>.git/hooks/</code>):</strong> อยู่ใน <code>.git</code> ซึ่งถูก Ignored จาก Git ไม่ติดไปกับ Clone คนอื่น<br/>
    • <strong>Custom Directory (<code>.githooks/</code>):</strong> อยู่ใน Working Tree ปกติ Commit ติด Repo ไปให้ทุกคนในทีมได้ใช้ร่วมกัน<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>git config core.hooksPath .githooks</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ทุกคนในทีมต้องรันคำสั่ง <code>git config core.hooksPath .githooks</code> อย่างน้อย 1 ครั้งหลัง Clone repo ใหม่`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git init</strong> สร้างโฟลเดอร์ <code>.git/</code> ซ้อนในโฟลเดอร์ปัจจุบัน เริ่มต้น tracking repo ใหม่ตั้งแต่ศูนย์ — ทำครั้งเดียวตอนเริ่มโปรเจคใหม่ที่ยังไม่มี git มาก่อน<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>git init</strong> สร้างโฟลเดอร์ <code>.git/</code> ซ้อนในโฟลเดอร์ปัจจุบัน เริ่มต้น tracking repo ใหม่ตั้งแต่ศูนย์ — ทำครั้งเดียวตอนเริ่มโปรเจคใหม่ที่ยังไม่มี git มาก่อน หลัง <code>git init</code> repo จะยังไม่มี commit ใดๆ เลย (<code>git status</code> จะบอกว่า "No commits yet") — git สมัยใหม่ (2.28+) จะตั้งชื่อ default branch เป็น <code>main</code> ให้อัตโนมัติ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git init</code><br/>
    <code>git status</code>  # เช็คว่าเพิ่ง init เสร็จ<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าโปรเจคมี remote (GitHub/GitLab) อยู่แล้วและต้องการโค้ดที่มีอยู่ ให้ใช้ <code>git clone &lt;url&gt;</code> แทน — ไม่ใช่ <code>git init</code> ตามด้วย <code>git remote add</code> เอง (clone ทำสองอย่างในคำสั่งเดียว: init + ผูก remote + ดึงโค้ดมาครบ)`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git fetch</strong> ดึงข้อมูล commit/ref ใหม่จาก remote มาเก็บไว้ (เช่น <code>origin/main</code>) แต่<strong>ไม่แตะ branch ปัจจุบันเลย</strong> — ต่างจาก <code>git pull</code> ที่ fetch+merge ในคำสั่งเดียว ปลอดภัยกว่าเวลาต้องการแค่ "ดูก่อนว่ามีอะไรเปลี่ยนไป" โดยไม่กระทบงานที่ทำค้างอยู่<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>git fetch</strong> ดึงข้อมูล commit/ref ใหม่จาก remote มาเก็บไว้ (เช่น <code>origin/main</code>) แต่<strong>ไม่แตะ branch ปัจจุบันเลย</strong> — ต่างจาก <code>git pull</code> ที่ fetch+merge ในคำสั่งเดียว ปลอดภัยกว่าเวลาต้องการแค่ "ดูก่อนว่ามีอะไรเปลี่ยนไป" โดยไม่กระทบงานที่ทำค้างอยู่<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/commit-push-merge.sh</code> (ใช้จริงตอน merge worktree เข้า main) เขียนไว้ตรงๆ ว่า <code>git fetch origin main</code> ก่อนจะ <code>git rebase origin/main</code> เสมอ — แยกขั้นตอน "ดึงข้อมูลมาดูก่อน" ออกจาก "เอาไปรวมจริง" ชัดเจน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git fetch origin main</code><br/>
    <code>git log HEAD..origin/main --oneline</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>git fetch</code> ไม่แตะ local branch เลย — หลัง fetch เสร็จ <code>origin/main</code> ขยับแล้วแต่ <code>main</code> ในเครื่องยังเหมือนเดิม ถ้าลืมแล้วไปเช็คโค้ดที่ branch <code>main</code> ตรงๆ จะไม่เห็นการเปลี่ยนแปลงใดๆ จนกว่าจะ <code>merge</code>/<code>rebase</code> เข้าจริง`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Pull: Fetch + Rebase ในคำสั่งเดียว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>git pull</code> ปกติคือ <code>fetch</code> + <code>merge</code> รวมกันในคำสั่งเดียว ส่วน <code>--rebase</code> เปลี่ยนขั้นตอนหลังจาก fetch จาก merge เป็น rebase แทน — ได้ history เรียงเส้นตรง ไม่มี merge commit เกิดขึ้น<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/commit-push-merge.sh</code> ใช้ pattern นี้ตอน push ถูก remote reject (มีคนอื่น push ก่อน): <code>git pull --rebase origin "$branch"</code> ก่อน แล้วค่อย push ใหม่<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git pull --rebase origin feature/login-fix</code><br/>
    <code>git rebase --continue</code>  # ถ้าเจอ conflict ระหว่างทาง<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าลืมใส่ <code>--rebase</code> คำสั่ง <code>git pull</code> เปล่าๆ จะสร้าง merge commit เพิ่มขึ้นมาทุกครั้งที่มี commit ใหม่ทั้งสองฝั่งโดยไม่ตั้งใจ และถ้า rebase เจอ conflict ต้องแก้ไฟล์แล้ว <code>git add</code> ตามด้วย <code>git rebase --continue</code> เท่านั้น ห้ามใช้ <code>git commit</code> ธรรมดาระหว่าง rebase`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git switch</strong> (git 2.23+) คือคำสั่งใหม่แยกหน้าที่ออกจาก <code>git checkout</code> เดิม — checkout เก่าทำได้ทั้ง "สลับ branch" และ "restore ไฟล์" ในคำสั่งเดียวกัน ทำให้สับสน/พิมพ์ path ผิดพลาดกลายเป็นสลับ branch แทนโดยไม่ตั้งใจ <code>switch</code> ทำหน้าที่เดียวชัดเจน: สลับ branch เท่านั้น<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>git switch</strong> (git 2.23+) คือคำสั่งใหม่แยกหน้าที่ออกจาก <code>git checkout</code> เดิม — checkout เก่าทำได้ทั้ง "สลับ branch" และ "restore ไฟล์" ในคำสั่งเดียวกัน ทำให้สับสน/พิมพ์ path ผิดพลาดกลายเป็นสลับ branch แทนโดยไม่ตั้งใจ <code>switch</code> ทำหน้าที่เดียวชัดเจน: สลับ branch เท่านั้น<br/><br/>
    • <code>git switch &lt;branch&gt;</code> — สลับไป branch ที่มีอยู่แล้ว<br/>
    • <code>git switch -c &lt;new-branch&gt;</code> — สร้างใหม่แล้วสลับเข้าไปทันที (<code>-c</code> = <code>--create</code>)<br/><br/>
    คู่กันกับ <code>git restore &lt;file&gt;</code> ที่แยกหน้าที่ "คืนค่าไฟล์" ออกมาต่างหาก (เดิม <code>git checkout &lt;file&gt;</code> ทำหน้าที่นี้)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git switch -c feature/login-fix</code><br/>
    <code>git switch main</code>  # สลับกลับไป branch เดิม (ไม่มี -c)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า branch ที่ต้องการสลับมีอยู่แล้ว ห้ามใส่ <code>-c</code> ซ้ำ — git จะ error ว่า branch นั้นมีอยู่แล้ว (<code>-c</code> ใช้เฉพาะตอนสร้างใหม่เท่านั้น) และถ้า branch มีอยู่แค่บน remote ยังไม่เคยดึงมาในเครื่อง <code>git switch &lt;branch&gt;</code> เฉยๆ อาจ error ได้เช่นกัน ต้องเช็คว่า track จาก <code>origin/&lt;branch&gt;</code> อัตโนมัติหรือไม่`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git merge</strong> เอา commit จาก branch อื่นมารวมเข้า branch ปัจจุบัน (ต้องสลับไปอยู่ branch ปลายทางก่อนเสมอ — คำสั่ง merge วิ่ง "เอาเข้ามา" ไม่ใช่ "ส่งออกไป")<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>• <strong>Fast-forward merge:</strong> ถ้า branch ปัจจุบันไม่มี commit ใหม่เลยตั้งแต่แยก branch ออกไป git จะแค่เลื่อน pointer ไปข้างหน้า ไม่มี merge commit เกิดขึ้น<br/><br/>• <strong>3-way merge:</strong> ถ้าทั้งสอง branch ต่างมี commit ใหม่ของตัวเอง git จะสร้าง merge commit พิเศษ (มี 2 parent) เพื่อรวม history ทั้งสองเข้าด้วยกัน<br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git merge feature/login-fix</code><br/>
    <code>git merge --abort</code>  # ยกเลิกถ้าเจอ conflict แล้วยังไม่พร้อมแก้<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้ามีคนแก้ไฟล์บรรทัดเดียวกันจากทั้งสองฝั่งจะเกิด <strong>merge conflict</strong> ต้องแก้ไฟล์เองแล้ว <code>git add</code> ตามด้วย <code>git commit</code> ให้จบ (ห้ามลืม commit ตอนจบ ไม่งั้น merge จะค้างอยู่ครึ่งๆ กลางๆ) และต้องแน่ใจว่ายืนอยู่ branch ปลายทางก่อนรัน merge เสมอ ไม่งั้นจะรวมผิดทิศทาง`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Push: ส่ง Commit ขึ้น Remote พร้อมตั้ง Upstream ครั้งแรก และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>push ครั้งแรกของ branch ใหม่ต้องระบุ remote+branch ชัดเจน แล้วใช้ <code>-u</code> (<code>--set-upstream</code>) ผูก local branch กับ remote branch ไว้ — หลังจากนั้น <code>git push</code>/<code>git pull</code> เปล่าๆ (ไม่ต้องพิมพ์ origin/branch ซ้ำ) จะรู้เองว่าต้องไปที่ไหน<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/commit-push.sh</code> ใช้เป๊ะแบบนี้ทุก commit: <code>git push -u origin "$branch"</code><br/><br/>
    <strong>คำเตือนสำคัญ</strong> (จากกฎ core.md ของ session นี้เอง): ห้าม force-push ไปที่ main/master โดยไม่ได้รับอนุญาต — ถ้าจำเป็นต้อง force push branch ตัวเอง (เช่นหลัง rebase) ให้ใช้ <code>--force-with-lease</code> แทน <code>--force</code> เปล่าๆ เพราะ force-with-lease จะเช็คก่อนว่า remote ไม่ได้ถูกคนอื่น push ทับระหว่างที่เรายังไม่ได้ fetch ล่าสุด (กันเผลอเขียนทับงานคนอื่นโดยไม่รู้ตัว) — <code>Scripts/commit-push-merge.sh</code> ของ kouen ใช้จริง: <code>git push origin "HEAD:$branch" --force-with-lease</code><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git push -u origin feature/login-fix</code><br/>
    <code>git push</code>  # ครั้งถัดไป ไม่ต้องพิมพ์ origin/branch ซ้ำแล้ว<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ห้าม force-push ไปที่ main/master โดยไม่ได้รับอนุญาต — ถ้าจำเป็นต้อง force push branch ตัวเอง (เช่นหลัง rebase) ให้ใช้ <code>--force-with-lease</code> แทน <code>--force</code> เปล่าๆ เพราะ force-with-lease จะเช็คก่อนว่า remote ไม่ได้ถูกคนอื่น push ทับระหว่างที่เรายังไม่ได้ fetch ล่าสุด`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git commit --amend</strong> ไม่ใช่คำสั่งเดี่ยวๆ (ไม่มี <code>git amend</code>) แต่เป็น<strong>ตัวเลือกของ <code>git commit</code></strong> ที่สั่งว่า "แทนที่จะสร้าง commit ใหม่ ให้ไปแก้ไข commit ล่าสุดแทน" — commit เดิมจะถูกแทนที่ด้วย commit hash ใหม่ทั้งหมด (ไม่ใช่แก้ของเดิม)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใช้งานได้ 2 แบบ: (1) แก้แค่ commit message เฉยๆ หรือ (2) เพิ่มไฟล์ที่ลืม add เข้า commit เดิมโดยคงข้อความเดิมไว้<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git commit --amend -m "ข้อความใหม่"</code><br/>
    <code>git add &lt;ไฟล์ที่ลืม&gt; && git commit --amend --no-edit</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>ข้อควรระวังสำคัญที่สุด:</strong> ห้าม amend commit ที่ <strong>push ไปแล้วและคนอื่นดึงไปใช้ต่อ</strong> เพราะ amend เปลี่ยน commit hash ทำให้ history ของเราไม่ตรงกับที่คนอื่นมีอยู่ในเครื่อง ถ้าจำเป็นต้อง amend commit ที่ push ไปแล้ว (ยังไม่มีใครดึงไปใช้ต่อ) ต้อง force push ด้วย <code>--force-with-lease</code> ตามด้วยเสมอ (ห้ามใช้ <code>--force</code> เปล่าๆ)`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git tag</strong> ปักหมุดไว้ที่ commit ใดคอมมิตหนึ่งแบบถาวร ใช้ทำเครื่องหมายจุด release ของ semantic versioning (<code>MAJOR.MINOR.PATCH</code> เช่น <code>v1.2.0</code>: MAJOR เปลี่ยนตอน breaking change, MINOR เปลี่ยนตอนเพิ่มฟีเจอร์ที่ backward-compatible, PATCH เปลี่ยนตอนแก้บั๊กเฉยๆ)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Tag มี 2 แบบ: <strong>Lightweight tag</strong> (<code>git tag v1.2.0</code> เฉยๆ — แค่ pointer ชี้ไป commit ไม่มี metadata) กับ <strong>Annotated tag</strong> (<code>git tag -a v1.2.0 -m "..."</code> — เก็บผู้สร้าง วันที่ และข้อความไว้ด้วย) — แนะนำให้ใช้ annotated เสมอสำหรับ release จริง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git tag -a v1.2.0 -m "Release v1.2.0: add login retry logic"</code><br/>
    <code>git push origin v1.2.0</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>ข้อสำคัญที่พลาดกันบ่อย:</strong> <code>git push</code> ธรรมดา<strong>ไม่ส่ง tag ขึ้น remote ให้อัตโนมัติ</strong> ต้องระบุชื่อ tag ต่อท้ายเอง (<code>git push origin v1.2.0</code>) หรือถ้ามีหลาย tag ค้างอยู่อยากส่งพร้อมกันหมดใช้ <code>git push origin --tags</code> (ระวัง: จะ push tag ทุกอันที่มีในเครื่อง ไม่ใช่แค่อันใหม่)<br/><br/>`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>lazygit</strong> คือ TUI (terminal UI) ที่ครอบคำสั่ง git ทั้งหมดที่เรียนมาในบทก่อนหน้า (<code>stash</code>/<code>fetch</code>/<code>pull</code>/<code>switch</code>/<code>merge</code>/<code>push</code>) ให้กด key เดียวแทนพิมพ์คำสั่งยาวๆ ทุกครั้ง โดยไม่ได้แทนที่ความเข้าใจ git command — ต้องรู้ก่อนว่าแต่ละคำสั่งทำอะไรถึงจะกด lazygit ได้อย่างมั่นใจ<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Layout หลัก (4 panel ซ้าย + diff view ขวา): Status, Files, Local Branches, Commits — เลื่อนด้วยลูกศรหรือ <code>1</code>-<code>5</code> สลับ panel Key ที่ใช้บ่อยที่สุด: <code>space</code> stage/unstage, <code>c</code> commit, <code>P</code>/<code>p</code> push/pull, <code>s</code> stash<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>space</code>  # stage/unstage ไฟล์ที่เลือก (แทน git add)<br/>
    <code>c</code>  # commit (เปิด prompt พิมพ์ message)<br/>
    <code>P</code> / <code>p</code>  # push / pull<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> key แต่ละตัวทำงาน<strong>ตาม panel ที่ยืนอยู่</strong> เช่น <code>Enter</code> ที่ branch ใน panel Local Branches คือ switch branch แต่ <code>Enter</code> ที่ panel อื่นทำหน้าที่ต่างกัน — ถ้ากดผิด panel ผลลัพธ์จะไม่ตรงที่คาด ต้องเลื่อนไป panel ที่ถูกต้องก่อนเสมอ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim Survival: ติดอยู่ใน Editor ตอน git commit ทำไง และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Vim เป็น <strong>Modal Editor</strong> — ปุ่มเดียวกันทำงานต่างกันขึ้นอยู่กับ "โหมด" ที่อยู่ ต่างจาก editor ทั่วไปที่พิมพ์แล้วเข้าไปเป็นตัวอักษรทันที<br/><br/>
    1. <strong>Normal mode</strong> (โหมดเริ่มต้นเสมอ) — ปุ่มคือ "คำสั่ง" ไม่ใช่ตัวอักษร (เช่น <code>dd</code> ลบทั้งบรรทัด, <code>i</code> ไม่ได้พิมพ์ตัว i แต่สั่งเข้า Insert mode)<br/>
    2. <strong>Insert mode</strong> (กด <code>i</code> เพื่อเข้า) — ปุ่มคือตัวอักษรจริงเหมือน editor ทั่วไป<br/>
    3. กลับ Normal mode ด้วย <code>&lt;Esc&gt;</code> เสมอ ไม่ว่าจะอยู่โหมดไหน<br/>
    4. คำสั่งขึ้นต้นด้วย <code>:</code> (Ex command) พิมพ์ได้เฉพาะตอนอยู่ Normal mode: <code>:wq</code> (write + quit บันทึกแล้วออก), <code>:q!</code> (quit ทิ้งโดยไม่บันทึก ใช้ตอนพิมพ์ผิดทั้งหมดอยากเริ่มใหม่)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>i</code>  # เข้า Insert mode<br/>
    <code>fix: correct typo</code>  # พิมพ์ข้อความ<br/>
    <code>&lt;Esc&gt;</code>  # กลับ Normal mode<br/>
    <code>:wq</code>  # บันทึก + ออก<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เหตุการณ์ที่พบบ่อยที่สุด: พิมพ์ <code>git commit</code> เฉยๆ (ลืมใส่ <code>-m "ข้อความ"</code>) ระบบเปิด Vim (หรือ editor ที่ตั้งไว้ใน <code>$EDITOR</code>) ให้พิมพ์ commit message — คนที่ไม่คุ้น Vim มักติดอยู่เพราะพิมพ์อะไรก็ไม่ขึ้น (เพราะยังอยู่ Normal mode ต้องกด <code>i</code> ก่อน) หรือกด <code>Ctrl+C</code>/ปิดหน้าต่างแทนซึ่งมักทำให้ terminal ค้าง`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim การเคลื่อนที่พื้นฐาน: h j k l, gg, G, w, b และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การเคลื่อนที่พื้นฐาน <code>h</code>/<code>j</code>/<code>k</code>/<code>l</code> (ซ้าย/ลง/ขึ้น/ขวา) ขยับทีละตัวอักษร ส่วนการกระโดดระยะไกลที่ใช้บ่อยที่สุดคือ <code>gg</code>/<code>G</code> ไปต้น/ท้ายไฟล์ และ <code>w</code>/<code>b</code> กระโดดทีละคำ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>gg</code>  # ไปบรรทัดแรกสุดของไฟล์<br/>
    <code>G</code>  # ไปบรรทัดสุดท้ายสุดของไฟล์<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>g</code> ตัวเล็กกับ <code>G</code> ตัวใหญ่ทำงานต่างกันคนละเรื่อง (<code>gg</code> ต้องกด g สองครั้งไปต้นไฟล์ ส่วน <code>G</code> ตัวเดียวไปท้ายไฟล์) พิมพ์ผิดตัวพิมพ์เล็ก-ใหญ่จะกระโดดผิดทิศทางทันที และถ้าใส่ตัวเลขนำหน้า <code>G</code> เช่น <code>42G</code> จะกระโดดไปบรรทัดที่ 42 แทน ไม่ใช่ท้ายไฟล์`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Ex command</strong> รูปแบบ <code>:s/pattern/replacement/flags</code> คือคำสั่ง find & replace ของ Vim ใช้ได้เฉพาะตอนอยู่ Normal mode<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใช้บ่อยตอนต้อง SSH เข้าเซิร์ฟเวอร์ที่ไม่มี GUI editor แล้วต้องแก้ config/log ไฟล์ด่วนๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>:%s/3000/3001/g</code><br/>
    <code>:5,10s/localhost/127.0.0.1/g</code>  # เฉพาะบรรทัด 5-10 ถ้าไม่ใส่ % ทั้งไฟล์<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใส่ <code>%</code> นำหน้า <code>s</code> จะแทนที่แค่บรรทัดปัจจุบันบรรทัดเดียว ไม่ใช่ทั้งไฟล์ และลืมใส่ <code>g</code> ท้ายสุดจะแทนที่แค่จุดแรกที่เจอต่อบรรทัดเท่านั้น (บั๊กที่พบบ่อย: ลืมใส่ <code>g</code> แล้วงงว่าทำไมยังเหลือค่าเก่าอยู่บางจุด)`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim ลบ/คัดลอกบรรทัด: dd, yy, p และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใน Normal mode, <code>dd</code> คือคำสั่งลบทั้งบรรทัดที่ cursor อยู่ — ข้อความที่ถูกลบจะเก็บเข้า <strong>register เริ่มต้น</strong> (unnamed register) เหมือน clipboard ชั่วคราว แล้วใช้ <code>p</code> (put/paste) วางกลับได้ทันทีที่บรรทัดถัดจาก cursor (ใช้ <code>P</code> ตัวใหญ่ถ้าอยากวาง<strong>ก่อน</strong>บรรทัด cursor แทน)<br/><br/>
    คำสั่งลบรูปแบบเดียวกันที่ใช้บ่อย: <code>dw</code> (ลบทั้งคำ), <code>d$</code> (ลบถึงท้ายบรรทัด), <code>3dd</code> (ลบ 3 บรรทัดรวด — ใส่ตัวเลขนำหน้าคำสั่งซ้ำกี่รอบก็ได้เกือบทุกคำสั่ง Normal mode)<br/><br/>
    <code>yy</code> (yank) คือคัดลอกทั้งบรรทัดแบบไม่ลบ (เก็บเข้า register เดียวกับ dd) แล้ว <code>p</code> วางได้เหมือนกัน — ต่างจาก <code>dd</code> แค่ตรงที่ต้นฉบับไม่หายไป<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>dd</code>  # ลบทั้งบรรทัด<br/>
    <code>yy</code>  # คัดลอกทั้งบรรทัด (ไม่ลบ)<br/>
    <code>p</code> / <code>P</code>  # วางหลัง/ก่อนบรรทัด cursor<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>dd</code>/<code>yy</code> ใช้ <strong>unnamed register เดียวกัน</strong> — ถ้า <code>yy</code> คัดลอกไว้ก่อน แล้วไป <code>dd</code> ลบบรรทัดอื่นทีหลัง สิ่งที่ yank ไว้จะถูกทับหายไปทันที ต้องวาง (<code>p</code>) ก่อนที่จะลบอะไรเพิ่มเสมอถ้ายังต้องการของที่ copy ไว้`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Visual mode</strong> ให้เลือกข้อความก่อนสั่ง action แทนที่จะเดา motion ล่วงหน้า (เหมือน <code>3dd</code>) — เหมาะกับตอนไม่แน่ใจว่าพื้นที่ที่ต้องการมีกี่บรรทัด/กี่ตัวอักษรกันแน่ เพราะเห็น highlight ที่เลือกไว้แบบ real-time ก่อนตัดสินใจ<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>3 โหมดย่อยของ Visual mode: <code>v</code> ตัวเล็ก (Character-wise เลือกทีละตัวอักษร), <code>V</code> ตัวใหญ่ (Line-wise เลือกทีละบรรทัด), <code>Ctrl+v</code> (Block-wise เลือกเป็นสี่เหลี่ยม แก้หลายบรรทัด column เดียวกันพร้อมกัน)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>V</code>  # เข้า Visual Line mode<br/>
    <code>jj</code>  # เลื่อนลงขยายพื้นที่เลือก<br/>
    <code>d</code>  # ลบสิ่งที่เลือก (แทน y = คัดลอก)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ต้องกด action (<code>d</code>/<code>y</code>) <strong>หลัง</strong>ขยับพื้นที่เลือกเสร็จแล้วเท่านั้น ถ้ากด <code>d</code>/<code>y</code> ก่อนเลื่อน cursor จะลบ/คัดลอกแค่ตัวอักษรเดียวที่ cursor อยู่ตอนเข้าโหมด ไม่ใช่พื้นที่ที่ตั้งใจไว้`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim Undo/Redo: ย้อนกลับเมื่อพิมพ์ผิด และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ทั้งสองคำสั่งทำงานได้เฉพาะตอนอยู่ <strong>Normal mode</strong> เท่านั้น (เหมือนคำสั่งอื่นๆ ที่ไม่ใช่ Insert mode)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>u</code>  # undo ล่าสุด<br/>
    <code>3u</code>  # undo 3 ขั้นรวดเดียว<br/>
    <code>Ctrl+r</code>  # redo (ทำสิ่งที่เพิ่ง undo ไปซ้ำ)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> สลับ undo/redo ไปมาได้เรื่อยๆ แต่พอพิมพ์แก้ไขอะไรใหม่ (แม้แค่ตัวเดียว) history ฝั่ง redo จะถูกล้างทิ้งทันที — กลับไป redo อันเก่าที่เคย undo ไว้ไม่ได้อีกแล้ว`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix Shell: Safe Script Header ที่ควรมีทุกไฟล์ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Bash แบบ default นั้น "ใจดีเกินไป" — รันคำสั่งพัง ก็ยังรันบรรทัดถัดไปต่อเหมือนไม่มีอะไรเกิดขึ้น <code>-e</code> (errexit) หยุดทันทีที่คำสั่งพัง, <code>-u</code> (nounset) error ถ้าอ้างอิงตัวแปรที่ไม่เคยประกาศ (จับ typo ชื่อตัวแปรได้)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>#!/usr/bin/env bash</code><br/>
    <code>set -euo pipefail</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>-o pipefail</code> คือส่วนที่มักถูกลืม: ปกติ exit code ของ pipeline (<code>cmd1 | cmd2</code>) จะดูแค่คำสั่งสุดท้าย ถ้า <code>cmd1</code> พังแต่ <code>cmd2</code> สำเร็จ pipeline จะรายงานว่าสำเร็จทั้งที่จริงพังไปแล้วครึ่งทาง — ถ้าใส่แค่ <code>set -eu</code> โดยไม่มี <code>pipefail</code> จะจับ error แบบนี้ไม่ได้เลย`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Pipe (<code>|</code>)</strong> ส่ง stdout ของคำสั่งฝั่งซ้ายไปเป็น stdin ให้คำสั่งฝั่งขวา — <code>git diff --cached --name-only</code> พิมพ์รายชื่อไฟล์ที่ staged ไว้ (คนละไฟล์ต่อบรรทัด) แล้วส่งต่อให้ <code>grep</code> ค้นหา<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong><code>grep -q</code></strong> (quiet) ไม่พิมพ์อะไรออกมาเลย แค่ตั้งค่า <strong>exit code</strong>: เจอ = 0 (สำเร็จ), ไม่เจอ = 1 (ล้มเหลว) — ออกแบบมาให้ใช้ในเงื่อนไข <code>if</code> โดยเฉพาะ ไม่ต้องมานั่ง parse ข้อความเอง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git diff --cached --name-only | grep -q "Info.plist"</code><br/>
    <code>if git diff --cached --name-only | grep -q "Info.plist"; then exit 1; fi</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> exit code ของ <code>grep -q</code> ตรงข้ามกับที่คนมักเข้าใจ: <strong>เจอ (found) = 0</strong> (สำเร็จในสายตา shell) <strong>ไม่เจอ = 1</strong> — ถ้าเผลอเขียน logic กลับด้าน (เช่นคิดว่า 0 แปลว่า "ไม่เจอ") เงื่อนไข <code>if</code> จะทำงานสลับขั้วตรงข้ามกับที่ตั้งใจทันที`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix find: ค้นหาไฟล์ตามชื่อ/ประเภท (ใช้จริงใน Kouen Build Scripts) และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>find &lt;path&gt; &lt;เงื่อนไข&gt;</code> ค้นหาไฟล์/โฟลเดอร์แบบวนลึกเข้าไปทุก subdirectory — เงื่อนไขที่ใช้บ่อยสุด:<br/><br/>
    • <code>-type f</code> เอาเฉพาะไฟล์ (ไม่เอาโฟลเดอร์), <code>-type d</code> เอาเฉพาะโฟลเดอร์<br/>
    • <code>-name '&lt;pattern&gt;'</code> กรองด้วยชื่อไฟล์ (รองรับ wildcard <code>*</code> แบบเดียวกับ shell แต่ต้องใส่ quote กันไม่ให้ shell ขยาย <code>*</code> เองก่อนส่งให้ find)<br/>
    • <code>-delete</code> ลบไฟล์ที่เจอทันที (<strong>อันตราย!</strong> ทดสอบด้วย <code>-print</code> ก่อนเสมอถ้าไม่มั่นใจ)<br/><br/>
    <strong>Real grounding:</strong> kouen-terminal's <code>Scripts/run.sh</code> ใช้เป๊ะแบบนี้ตอน refresh graphify: <code>find graphify-out -type f -name '*.html' -delete</code> — ลบไฟล์ report .html เก่าทั้งหมดก่อน generate ใหม่ (ป้องกันของเก่าค้าง)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>find graphify-out -type f -name '*.html' -print</code>  # เช็คก่อนเสมอ<br/>
    <code>find graphify-out -type f -name '*.html' -delete</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าลืมใส่ quote รอบ <code>'*.html'</code> shell จะขยาย wildcard เอง (glob expansion) ก่อนส่งให้ <code>find</code> — ถ้าไม่มีไฟล์ในโฟลเดอร์ปัจจุบันตรงกับ pattern จะได้ error <code>No such file or directory</code> แทนที่จะค้นหาแบบ recursive ตามที่ตั้งใจ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix chmod: ให้สิทธิ์ Execute กับ Script และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ไฟล์ทุกไฟล์ใน Unix มีสิทธิ์ 3 กลุ่ม: <strong>อ่าน (r)</strong>, <strong>เขียน (w)</strong>, <strong>รัน (x)</strong> — แยกกำหนดแยกกันได้ 3 ระดับ: เจ้าของไฟล์ (user), กลุ่ม (group), และคนอื่นทั้งหมด (others) เช่น <code>-rw-r--r--</code> ที่เห็นจาก <code>ls -l</code> แปลว่า เจ้าของอ่าน+เขียนได้แต่รันไม่ได้ ส่วนกลุ่ม/คนอื่นอ่านได้อย่างเดียว<br/><br/>
    ไฟล์ script ที่เพิ่งสร้างใหม่ (เช่นจาก <code>touch</code> หรือ editor) มักไม่มีสิทธิ์ execute ติดมาด้วย ทำให้รันตรงๆ ด้วย <code>./script.sh</code> แล้วเจอ <code>Permission denied</code> ทันที ทั้งที่เนื้อหาในไฟล์ไม่มีปัญหาอะไรเลย<br/><br/>
    <code>chmod +x &lt;ไฟล์&gt;</code> คือรูปแบบสัญลักษณ์ (symbolic) เพิ่มสิทธิ์ execute ให้ทั้ง user/group/others พร้อมกัน — ใช้บ่อยและจำง่ายกว่ารูปแบบตัวเลข (numeric mode) อย่าง <code>chmod 755 deploy.sh</code> ที่ให้ผลเทียบเท่ากัน (7 = rwx สำหรับเจ้าของ, 5 = r-x สำหรับกลุ่มและคนอื่น)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>chmod +x deploy.sh</code><br/>
    <code>ls -l deploy.sh</code>  # เช็คว่ามี x ติดมาแล้ว<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>chmod +x</code> เปล่าๆ ให้สิทธิ์ execute กับทั้ง user/group/others พร้อมกัน — ถ้าต้องการจำกัดเฉพาะเจ้าของไฟล์เท่านั้น (เช่น script ที่มีข้อมูล sensitive) ต้องใช้ <code>chmod u+x</code> แทน ไม่ใช่ <code>+x</code> เฉยๆ ซึ่งกว้างเกินความจำเป็น`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix cd: สลับโฟลเดอร์และย้อนกลับแบบไม่ต้องพิมพ์ Path เต็ม และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>cd</code> (change directory) เป็นคำสั่งพื้นฐานที่สุดในการสลับตำแหน่งที่ทำงานอยู่ของ shell แต่มีทางลัดที่ช่วยประหยัดเวลาได้เยอะ:<br/><br/>
    • <code>cd &lt;path&gt;</code> — ไป path ที่ระบุ (relative หรือ absolute ก็ได้)<br/>
    • <code>cd ..</code> — ขึ้น 1 ระดับ, <code>cd ../..</code> — ขึ้น 2 ระดับ (ซ้อน <code>..</code> ต่อกันด้วย <code>/</code> ได้เรื่อยๆ)<br/>
    • <code>cd</code> (ไม่ใส่ argument) หรือ <code>cd ~</code> — กลับไป home directory ของ user ทันที<br/>
    • <code>cd -</code> — สลับกลับไปโฟลเดอร์<strong>ก่อนหน้า</strong>ที่เพิ่งอยู่ (เก็บไว้ใน environment variable <code>$OLDPWD</code>) กด <code>cd -</code> สองครั้งติดกันจะสลับไปมาระหว่าง 2 โฟลเดอร์เหมือนปุ่ม back/forward<br/><br/>
    ใช้ <code>pwd</code> (print working directory) เช็คได้ตลอดว่าตอนนี้อยู่ที่โฟลเดอร์ไหน — มีประโยชน์มากตอนเขียน script เพราะสคริปต์ไม่รู้ context ว่าถูกเรียกจากโฟลเดอร์ไหน ต้อง <code>cd</code> ไปตำแหน่งที่ถูกต้องก่อนเสมอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>cd ../..</code>  # ขึ้น 2 ระดับ<br/>
    <code>cd -</code>  # กลับไปโฟลเดอร์ก่อนหน้า<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>cd -</code> สลับกลับไปแค่ตำแหน่ง<strong>ก่อนหน้าล่าสุด</strong> (<code>$OLDPWD</code>) เท่านั้น ไม่ใช่ history แบบ back หลายขั้น — ถ้ากด <code>cd -</code> ซ้ำสองครั้งจะสลับไปมาระหว่าง 2 โฟลเดอร์เดิมเท่านั้น ไม่ได้ย้อนกลับไปไกลกว่านั้น`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix mkdir -p: สร้างโฟลเดอร์ซ้อนหลายชั้นในคำสั่งเดียว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>mkdir &lt;path&gt;</code> แบบ default สร้างได้แค่โฟลเดอร์ปลายทางเดียว และ<strong>ต้องมีโฟลเดอร์แม่อยู่ก่อนแล้วเท่านั้น</strong> ถ้า path ซ้อนหลายชั้นแต่โฟลเดอร์แม่ยังไม่มีจะเจอ error <code>No such file or directory</code> ทันที<br/><br/>
    <code>-p</code> (parents) แก้ปัญหานี้: สร้างโฟลเดอร์แม่ทุกชั้นที่ยังไม่มีให้อัตโนมัติ ก่อนจะสร้างโฟลเดอร์ปลายทางจริง — <code>mkdir -p tests/e2e/fixtures</code> จะสร้างทั้ง <code>tests/</code>, <code>tests/e2e/</code>, และ <code>tests/e2e/fixtures/</code> ในคำสั่งเดียว แม้จะไม่มีสักโฟลเดอร์มาก่อนเลยก็ตาม<br/><br/>
    ข้อดีอีกอย่าง: <code>-p</code> ทำให้คำสั่ง<strong>idempotent</strong> (รันซ้ำได้โดยไม่ error) — ถ้าโฟลเดอร์มีอยู่แล้วบางส่วนหรือทั้งหมด <code>mkdir -p</code> จะไม่ error เลย ต่างจาก <code>mkdir</code> เฉยๆ ที่จะ error ทันทีถ้าโฟลเดอร์ปลายทางมีอยู่แล้ว — เพราะแบบนี้ script ที่รัน setup/deploy ซ้ำๆ (เช่น CI pipeline) มักใช้ <code>mkdir -p</code> เสมอแทน <code>mkdir</code> เฉยๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>mkdir -p tests/e2e/fixtures</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>mkdir -p</code> ไม่มี error ใดๆ แม้พิมพ์ path ผิด (typo) — มันจะสร้างโฟลเดอร์ใหม่ตาม path ที่พิมพ์ไว้ทันทีโดยไม่เตือน ต่างจาก <code>mkdir</code> เฉยๆ ที่อย่างน้อยจะ error ถ้าโฟลเดอร์แม่ไม่มี ทำให้ typo ใน path หลุดรอดไปสร้างโฟลเดอร์ผิดที่โดยไม่รู้ตัว ต้องเช็ค path ให้ถูกต้องเองก่อนรันเสมอ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix Symbolic Link: ชี้ชื่อสั้นไปยังไฟล์จริง ไม่ต้อง Copy ซ้ำ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>แก้ไขไฟล์ผ่าน symlink เท่ากับแก้ไฟล์ต้นฉบับจริง (เพราะชี้ไปที่เดียวกัน) — <code>ls -l</code> จะโชว์ symlink เป็น <code>.env -&gt; config/production.env</code> ให้เห็นชัดว่าชี้ไปไหน และ <code>rm .env</code> ลบแค่ตัว link ทิ้ง ไม่กระทบไฟล์ต้นฉบับ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>ln -s config/production.env .env</code><br/>
    <code>ls -l .env</code>  # เช็คว่าชี้ไปไฟล์ไหน<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลืมใส่ <code>-s</code> จะได้ <strong>hard link</strong> แทน ไม่ใช่ symbolic link (ชี้ตรงไปที่ข้อมูลบน disk เดียวกันเป๊ะ ข้ามไดรฟ์ไม่ได้ และลบต้นฉบับไม่ได้ถ้ายังมี hard link เหลืออยู่) — งาน QA/dev ทั่วไปเกือบทั้งหมดต้องใช้ <code>-s</code> เสมอ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix trap: ล้างไฟล์ชั่วคราวอัตโนมัติแม้สคริปต์ล้มเหลว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ถ้าไม่ตั้ง trap แล้วสคริปต์ error กลางทางก่อนถึงบรรทัด rm ท้ายสุด ไฟล์ temp จะค้างอยู่ตลอดไป — trap แก้ปัญหานี้โดยผูก cleanup ไว้ล่วงหน้าตั้งแต่ต้น ไม่ต้องพึ่งว่าสคริปต์จะรันจบถึงบรรทัดสุดท้ายจริงหรือเปล่า<br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>TMP_STAGE=$(mktemp -d)</code><br/>
    <code>trap 'rm -rf "$TMP_STAGE"' EXIT</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ต้องตั้ง <code>trap</code> ทันทีหลังสร้าง resource (เช่น <code>mktemp -d</code>) เสมอ ไม่ใช่ตั้งไว้ท้ายสุดของสคริปต์ — ถ้าสคริปต์ error ระหว่างกลางก่อนถึงบรรทัด <code>trap</code> จะยังไม่มี cleanup ผูกไว้เลย ไฟล์ temp จะค้างอยู่ตลอดไป`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix Pipeline หลายขั้นตอน: สรุปสถิติ Test Fail จาก Log และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>หลักการสำคัญ: งานแบบนี้ทำด้วยคำสั่งเดียวไม่ได้ ต้อง "ประกอบ" เครื่องมือเล็กๆ หลายตัวเข้าด้วยกันผ่าน pipe — นี่คือปรัชญาพื้นฐานของ Unix เอง (<code>grep</code> กรอง → <code>awk</code> ดึงคอลัมน์ → <code>sort</code> เรียง → <code>uniq -c</code> นับ → <code>sort -rn</code> เรียงจากมากไปน้อย)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>grep "FAIL" test-results.log | awk '{print $4}' \</code><br/>
    <code>&nbsp;&nbsp;| sort | uniq -c | sort -rn</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>uniq -c</code> นับได้เฉพาะบรรทัดที่ซ้ำกัน<strong>ติดกัน</strong>เท่านั้น ไม่ใช่ทั้งไฟล์ — ถ้าลืม <code>sort</code> ก่อน <code>uniq -c</code> ชื่อเดียวกันที่กระจัดกระจายอยู่คนละที่จะถูกนับแยกเป็นหลายกลุ่ม ได้ผลลัพธ์ผิดทันที`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Loop + Conditional: ตรวจสอบไฟล์ผลเทสหลายไฟล์แบบ Batch และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>งาน QA จริงมักต้องเช็คผลเทสจากหลายไฟล์พร้อมกัน แทนที่จะเปิดดูทีละไฟล์เอง ใช้ <strong>loop</strong> ผสม <strong>conditional</strong> ให้ shell ทำงานซ้ำแทนเรา<br/><br/>
    1. <code>for f in results/*.txt; do ... done</code> — วนลูปผ่านทุกไฟล์ที่ตรงกับ pattern <code>results/*.txt</code> (shell ขยาย <code>*</code> เป็นรายชื่อไฟล์จริงให้เอง) ตัวแปร <code>f</code> จะเปลี่ยนค่าเป็นชื่อไฟล์ถัดไปในแต่ละรอบ<br/>
    2. <code>if grep -q "FAIL" "$f"; then ... fi</code> — <code>grep -q</code> เช็คแบบเงียบว่าไฟล์นั้นมีคำว่า FAIL หรือไม่ ให้แค่ exit code (0 = เจอ, ไม่ใช่ 0 = ไม่เจอ) เอาไปใช้เป็นเงื่อนไขของ <code>if</code> ได้ตรงๆ<br/>
    3. quote ตัวแปร <code>"$f"</code> เสมอเวลาใช้เป็น argument ของคำสั่ง — ป้องกันปัญหาถ้าชื่อไฟล์มี space หรือ special character อยู่ข้างใน (shell จะไม่ตัดคำผิดพลาด)<br/>
    4. <code>echo "$f"</code> — แสดงชื่อไฟล์ที่เข้าเงื่อนไข ก่อนจะปิด <code>if</code> ด้วย <code>fi</code> และปิด <code>for</code> ด้วย <code>done</code><br/><br/>
    แนวคิดนี้ต่อยอดจาก <code>set -euo pipefail</code> และ <code>grep -q</code> ที่เรียนไปก่อนหน้า — เอามาผสมกับ loop เพื่อจัดการงาน batch หลายไฟล์พร้อมกันแบบอัตโนมัติ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>for f in results/*.txt; do</code><br/>
    <code>&nbsp;&nbsp;if grep -q "FAIL" "$f"; then echo "$f"; fi</code><br/>
    <code>done</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าไม่มีไฟล์ <code>.txt</code> ใน <code>results/</code> เลยแม้แต่ไฟล์เดียว bash แบบ default จะ<strong>ไม่ขยาย</strong> <code>*</code> ให้ — loop จะรันแค่ 1 รอบโดย <code>f</code> เป็น string ตัวอักษร <code>results/*.txt</code> ตรงๆ (ไม่ใช่ไม่วนลูปเลยตามที่หลายคนคาดหวัง) ทำให้ <code>grep</code> ไป error ว่าไฟล์ไม่มีอยู่จริง`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git status</strong> คือคำสั่งที่ควรพิมพ์เป็นอันดับแรกก่อน commit/add ทุกครั้ง แสดงสถานะไฟล์ทั้งหมดแบ่งเป็น 3 กลุ่ม:<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>1. <strong>Staged</strong> (จะเข้าไปใน commit ถัดไป) — ไฟล์ที่ <code>git add</code> ไปแล้ว 2. <strong>Modified/Unstaged</strong> — ไฟล์ที่แก้ไปแล้วแต่ยังไม่ได้ <code>git add</code> 3. <strong>Untracked</strong> — ไฟล์ใหม่ที่ git ยังไม่เคยรู้จักเลย<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git status</code><br/>
    <code>git status -s</code>  # short format อ่านเร็วกว่า<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> เช็ค <code>git status</code> ก่อน commit ทุกครั้ง — ไฟล์ที่อยู่ใน Untracked จะ<strong>ไม่ถูก commit ไปด้วย</strong>แม้จะรัน <code>git commit -a</code> ก็ตาม (<code>-a</code> stage เฉพาะไฟล์ที่ track อยู่แล้วเท่านั้น) พลาดตรงนี้บ่อยจนลืม add ไฟล์ใหม่เข้า commit`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Log: ดูประวัติ Commit แบบกระชับ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>git log</code> เฉยๆ แสดงประวัติ commit ทั้งหมดแบบละเอียด (hash เต็ม, ผู้เขียน, วันที่, ข้อความ) ยาวมากถ้า repo มี commit เยอะ<br/><br/>
    • <code>--oneline</code> — ย่อแต่ละ commit เหลือบรรทัดเดียว (hash ย่อ + ข้อความ)<br/>
    • <code>-N</code> (เช่น <code>-5</code>) — จำกัดแสดงแค่ N commit ล่าสุด<br/>
    • <code>--graph --all</code> — วาดเส้น branch แบบ ASCII ให้เห็นว่า commit ไหนอยู่ branch ไหนบ้าง มีประโยชน์มากตอน branch เยอะ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git log --oneline -5</code><br/>
    <code>git log --oneline --graph --all</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>-5</code> จำกัดแค่<strong>จำนวน</strong> commit ที่แสดง ไม่ใช่กรองตามช่วงเวลาหรือ branch — ถ้าอยู่ branch อื่นที่ไม่ใช่ branch หลัก commit ล่าสุด 5 อันที่เห็นอาจไม่ใช่ 5 อันล่าสุดของทั้ง repo ต้องเติม <code>--all</code> ถ้าต้องการดูทุก branch พร้อมกัน`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Diff: ดูว่าเปลี่ยนอะไรไปบ้างก่อน Commit และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>git diff</code> เปรียบเทียบไฟล์ได้หลายคู่ต่างกัน ขึ้นอยู่กับ flag:<br/><br/>
    • <code>git diff</code> (เปล่าๆ) — เทียบ <strong>working directory vs staging area</strong> คือดูว่าแก้อะไรไปแล้วที่ยังไม่ได้ <code>add</code><br/>
    • <code>git diff --cached</code> (เท่ากับ <code>--staged</code>) — เทียบ <strong>staging area vs commit ล่าสุด</strong> คือดูว่า <code>add</code> ไว้อะไรบ้างที่จะเข้า commit ถัดไปจริงๆ<br/>
    • <code>git diff HEAD</code> — เทียบ working directory กับ commit ล่าสุดตรงๆ (รวมทั้ง staged และ unstaged ในทีเดียว)<br/><br/>
    เช็ค <code>git diff --cached</code> ก่อน commit ทุกครั้งช่วยกันไม่ให้ commit อะไรที่ไม่ตั้งใจ add ไปด้วย<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git diff</code>  # unstaged<br/>
    <code>git diff --cached</code>  # staged<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> หลัง <code>git add</code> ไฟล์ไปแล้ว <code>git diff</code> เปล่าๆ จะ<strong>ไม่โชว์การเปลี่ยนแปลงนั้นอีก</strong> (เพราะย้ายไป staging area แล้ว) หลายคนพิมพ์ <code>git diff</code> ซ้ำแล้วงงว่าทำไมว่างเปล่า ทั้งที่ต้องดูด้วย <code>git diff --cached</code> แทน`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Add -p: Stage เฉพาะบางส่วนของไฟล์ (Patch Mode) และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>git add &lt;ไฟล์&gt;</code> ธรรมดา stage ทั้งไฟล์รวดเดียว — ถ้าไฟล์มีทั้งการแก้ที่ตั้งใจ commit จริงๆ ปนกับโค้ด debug ที่ลืมลบ จะแยกไม่ได้ว่าอะไรควรอยู่ commit ไหน<br/><br/>
    <code>git add -p &lt;ไฟล์&gt;</code> (patch mode) แบ่งการแก้ไขออกเป็น "hunk" (กลุ่มบรรทัดที่เปลี่ยนติดกัน) แล้วถามทีละ hunk ว่าจะ stage มั้ย (<code>y</code>=ใช่, <code>n</code>=ไม่, <code>s</code>=แบ่ง hunk นี้ให้ย่อยลงอีก, <code>q</code>=หยุดถามที่เหลือ) — ทำให้แยก commit ได้ละเอียดกว่าระดับไฟล์ เป็นเทคนิคที่ทำให้แต่ละ commit โฟกัสเรื่องเดียวจริงๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git add -p login.ts</code><br/>
    <code>y / n / s / q</code>  # stage / skip / แบ่ง hunk ย่อย / หยุดถาม<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>git add -p</code> ทำงานได้เฉพาะไฟล์ที่ git <strong>track อยู่แล้ว</strong> (มี diff เทียบกับ commit เดิม) — ถ้าไฟล์เป็น untracked ใหม่เอี่ยม จะไม่มี hunk ให้เลือกเลย ต้อง <code>git add -N &lt;ไฟล์&gt;</code> (intent-to-add) ก่อน ถึงจะเริ่ม patch mode ได้`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git clone &lt;url&gt;</strong> ทำครบในคำสั่งเดียว: สร้างโฟลเดอร์ใหม่ + <code>git init</code> ข้างใน + ผูก remote ชื่อ <code>origin</code> ให้ชี้ไป url ที่ระบุ + ดึงข้อมูลทั้งหมด (ทุก branch, ทุก commit) มาเก็บไว้ + checkout branch default (มักเป็น <code>main</code>) ออกมาให้ทำงานได้ทันที<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>git clone &lt;url&gt;</strong> ทำครบในคำสั่งเดียว: สร้างโฟลเดอร์ใหม่ + <code>git init</code> ข้างใน + ผูก remote ชื่อ <code>origin</code> ให้ชี้ไป url ที่ระบุ + ดึงข้อมูลทั้งหมด (ทุก branch, ทุก commit) มาเก็บไว้ + checkout branch default (มักเป็น <code>main</code>) ออกมาให้ทำงานได้ทันที<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git clone https://github.com/acme/webapp.git</code><br/>
    <code>git clone &lt;url&gt; my-local-webapp</code>  # ตั้งชื่อโฟลเดอร์เอง<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ค่า default ชื่อโฟลเดอร์ที่ได้จะตรงกับชื่อ repo (ในตัวอย่างนี้คือ <code>webapp/</code>) ถ้าอยากตั้งชื่อโฟลเดอร์เองต้องใส่ argument ที่สองต่อท้าย ไม่งั้นถ้า clone repo ชื่อซ้ำกันหลายอันในโฟลเดอร์เดียวกันจะ error ทับกันทันที`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>remote</strong> คือชื่อเล่นที่ผูกไว้กับ URL ของ repo อื่น (ปกติอยู่บน GitHub/GitLab) — <code>origin</code> เป็นแค่<strong>ชื่อตามธรรมเนียม</strong> ที่ทุกคนใช้กัน ไม่ใช่ชื่อบังคับของ git<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>remote</strong> คือชื่อเล่นที่ผูกไว้กับ URL ของ repo อื่น (ปกติอยู่บน GitHub/GitLab) — <code>origin</code> เป็นแค่<strong>ชื่อตามธรรมเนียม</strong> ที่ทุกคนใช้กัน ไม่ใช่ชื่อบังคับของ git<br/><br/>
    <code>git remote add &lt;ชื่อ&gt; &lt;url&gt;</code> ผูก remote ใหม่เข้ากับ local repo — จำเป็นเฉพาะตอนที่ repo เริ่มจาก <code>git init</code> เอง (ถ้าใช้ <code>git clone</code> จะได้ remote <code>origin</code> ผูกมาให้อัตโนมัติแล้ว)<br/><br/>
    หนึ่ง repo มีได้หลาย remote พร้อมกัน (เช่น <code>origin</code> ชี้ไป fork ของตัวเอง + <code>upstream</code> ชี้ไป repo ต้นฉบับ) ใช้ <code>git remote -v</code> ดูรายชื่อ remote ทั้งหมดพร้อม URL<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git remote add origin https://github.com/acme/webapp.git</code><br/>
    <code>git remote -v</code>  # เช็ค remote ทั้งหมดพร้อม URL<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า remote ชื่อ <code>origin</code> มีอยู่แล้ว <code>git remote add origin</code> จะ <strong>error ทันที</strong> (<code>remote origin already exists</code>) — ต้องใช้ <code>git remote set-url origin &lt;url&gt;</code> แทนถ้าต้องการเปลี่ยน URL ของ remote เดิม ไม่ใช่ <code>add</code> ซ้ำ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Reset: ย้อน Commit กลับแบบยังเก็บไฟล์ที่แก้ไว้ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>git reset &lt;commit&gt;</code> ย้าย branch pointer กลับไปที่ commit เก่ากว่า มี 3 โหมดสำคัญ ต่างกันตรงว่า "เก็บไฟล์ที่แก้ไว้แค่ไหน":<br/><br/>
    • <code>--soft</code> — ย้อน commit แต่ <strong>เก็บทุกอย่างไว้แบบ staged</strong> เหมือนเพิ่ง <code>git add</code> เสร็จ พร้อม commit ใหม่ทันที (ใช้แก้ commit message หรือรวม commit หลายอันเข้าด้วยกัน)<br/>
    • <code>--mixed</code> (default ถ้าไม่ใส่ flag) — ย้อน commit และเอาออกจาก staged ด้วย แต่ไฟล์ในเครื่องยังอยู่ (ต้อง <code>git add</code> ใหม่เอง)<br/>
    • <code>--hard</code> — ย้อน commit และ<strong>ลบการแก้ไขทั้งหมดทิ้งถาวร</strong> (ไฟล์กลับไปเหมือน commit เป้าหมายเป๊ะ) — <strong style="color:#e00">อันตรายที่สุด ห้ามใช้กับ commit ที่ push ไปแล้ว/คนอื่นดึงไปใช้ต่อ</strong> เพราะข้อมูลหายจริง กู้คืนยาก<br/><br/>
    กฎทองคือ: <code>reset</code> (ทุกโหมด) ปลอดภัยเฉพาะกับ commit ที่ยัง<strong>ไม่ push</strong> ออกไปไหนเท่านั้น<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git reset --soft HEAD~1</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าลืมใส่ <code>--soft</code> ระบบจะใช้ <code>--mixed</code> เป็น default แทน — ไฟล์จะหลุดออกจาก staged ทันที (ต้อง <code>git add</code> ใหม่เองทั้งหมดก่อน commit ได้) และห้ามพิมพ์ <code>--hard</code> สลับกับ <code>--soft</code> โดยไม่ตั้งใจเด็ดขาด เพราะ <code>--hard</code> ลบการแก้ไขทิ้งถาวร กู้คืนยาก`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git revert &lt;commit&gt;</strong> สร้าง<strong>commit ใหม่</strong>ที่ทำการแก้ไขตรงข้ามกับ commit เป้าหมายเป๊ะ (ถ้า commit เดิมเพิ่มบรรทัดอะไรไป revert จะลบบรรทัดนั้นออก) — <strong>history เดิมไม่หายไปไหนเลย</strong> commit ที่ผิดพลาดยังอยู่ใน log ตามปกติ แค่มี commit ใหม่ตามมาแก้ผลของมัน<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>git revert &lt;commit&gt;</strong> สร้าง<strong>commit ใหม่</strong>ที่ทำการแก้ไขตรงข้ามกับ commit เป้าหมายเป๊ะ (ถ้า commit เดิมเพิ่มบรรทัดอะไรไป revert จะลบบรรทัดนั้นออก) — <strong>history เดิมไม่หายไปไหนเลย</strong> commit ที่ผิดพลาดยังอยู่ใน log ตามปกติ แค่มี commit ใหม่ตามมาแก้ผลของมัน<br/><br/>
    เทียบกับ <code>reset</code>:<br/>
    • <code>reset</code> — เขียน history ใหม่ (ลบ/ย้าย commit ทิ้ง) ปลอดภัยเฉพาะ commit ที่ยังไม่ push<br/>
    • <code>revert</code> — ไม่แตะ history เดิมเลย ปลอดภัย<strong>แม้กับ commit ที่ push ไปแล้วและคนอื่นดึงไปใช้ต่อ</strong> เพราะทุกคนแค่ต้อง <code>pull</code> commit ใหม่ที่ revert เข้ามาเพิ่ม ไม่มี history ใครขัดกัน<br/><br/>
    กฎง่ายๆ: commit ยังไม่ push → ใช้ <code>reset</code>/<code>amend</code> ได้ตามสบาย, commit push ไปแล้ว/แชร์กับคนอื่นแล้ว → ใช้ <code>revert</code> เสมอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git revert abc1234</code><br/>
    <code>git revert HEAD~2..HEAD</code>  # revert หลาย commit รวด<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า commit ที่จะ revert เป็น <strong>merge commit</strong> คำสั่งจะ error ทันที (<code>commit is a merge but no -m option was given</code>) เพราะ merge commit มี 2 parent ไม่รู้จะย้อนเทียบกับฝั่งไหน ต้องระบุ <code>-m 1</code> (หรือ 2) บอก parent ที่ต้องการอิงด้วยเสมอ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim ออกจากโปรแกรม: :q vs :q! vs :wq! และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Vim มีคำสั่งออกหลายแบบ ต่างกันตรง "จะยอมออกตอนไหน" และ "บันทึกก่อนออกมั้ย":<br/><br/>
    • <code>:q</code> (quit) — ออกได้ก็ต่อเมื่อ<strong>ไม่มีอะไรค้าง</strong> (ไม่มีการแก้ไขที่ยังไม่บันทึก) ถ้ามีอะไรค้างจะ error <code>E37: No write since last change</code> ทันที ไม่ยอมออกให้เฉยๆ<br/>
    • <code>:q!</code> — เติม <code>!</code> (force) ท้ายคำสั่งไหนก็ตาม แปลว่า "บังคับทำ ไม่ต้องถามอะไร" — <code>:q!</code> จึงออกทันทีโดย<strong>ทิ้งการแก้ไขที่ยังไม่บันทึกทั้งหมด</strong><br/>
    • <code>:wq</code> — เขียน (write) แล้วออก (quit) เรียงกัน แต่จะ error ถ้าไฟล์เป็น read-only (เปิดด้วย <code>vim -R</code> หรือตั้ง <code>:set readonly</code> ไว้)<br/>
    • <code>:wq!</code> — เติม <code>!</code> บังคับเขียนทับ read-only flag<strong>ของ Vim เอง</strong>แล้วออก — <strong>ข้อควรรู้:</strong> <code>!</code> ตัวนี้ override แค่ read-only flag ภายใน Vim เท่านั้น ถ้าไฟล์จริงถูก <code>chmod</code> ห้ามเขียนระดับ filesystem (permission denied จริง) <code>:wq!</code> ก็ยังเขียนไม่ได้อยู่ดี<br/><br/>
    หลักการจำ: <code>!</code> ต่อท้ายคำสั่งไหนก็ตาม = "บังคับ ไม่ต้องถาม" ใช้ pattern นี้ได้กับคำสั่ง Ex อื่นๆ ของ Vim ด้วยเช่นกัน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>:q</code>  # ออกเฉยๆ ไม่มีอะไรค้าง<br/>
    <code>:q!</code>  # บังคับออก ทิ้งการแก้ไข<br/>
    <code>:wq!</code>  # บันทึกทับ readonly แล้วออก<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลำดับตัวอักษรสำคัญ — ต้องเขียน <code>w</code> (write) ก่อน <code>q</code> (quit) เสมอ <code>:wq</code> ใช้ได้ แต่ <code>:qw</code> ไม่มีคำสั่งนี้อยู่ Vim จะ error <code>E492: Not an editor command</code> ทันที`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim Search: หาคำในไฟล์ด้วย / และเลื่อนไปผลถัดไปด้วย n และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>หลังค้นหาแล้ว <code>n</code> เลื่อนไปจุดที่เจอ<strong>ถัดไป</strong> (ทิศทางเดิม) ส่วน <code>N</code> ตัวใหญ่เลื่อนไปจุดที่เจอ<strong>ก่อนหน้า</strong> (ทิศทางย้อนกลับ) — <code>?</code> ค้นหาแบบถอยหลังแทน <code>/</code><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>/ERROR</code>  # ค้นหาเดินหน้า<br/>
    <code>n</code>  # ไปจุดที่เจอถัดไป<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>n</code>/<code>N</code> อ้างอิงตามทิศทางที่<strong>ค้นหาไว้ตอนแรก</strong> ไม่ใช่ทิศทางตายตัว — ถ้าค้นหาด้วย <code>?</code> (ถอยหลัง) แทน <code>/</code> ความหมายของ <code>n</code>/<code>N</code> จะสลับกัน (<code>n</code> กลายเป็นถอยหลังแทน) พลาดจุดนี้บ่อยเวลาสลับใช้ทั้งสองแบบ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Macro</strong> คือการบันทึกลำดับคีย์ที่กดจริงไว้ในตัวแปรชื่อสั้นๆ (register a-z) แล้วสั่งเล่นซ้ำได้ทีหลัง เหมาะมากกับงานที่ต้องแก้แบบเดิมซ้ำๆ กันหลายบรรทัด/หลายจุด<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ขั้นตอน: (1) <code>qa</code> เริ่มบันทึกลง register <code>a</code> (2) ทำสิ่งที่ต้องการตามปกติ (3) <code>q</code> เฉยๆ หยุดบันทึก (4) <code>@a</code> เล่นซ้ำ 1 รอบ หรือ <code>9@a</code> เล่นซ้ำ 9 รอบรวด<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>qa</code>  # เริ่มบันทึกลง register a<br/>
    <code>A;&lt;Esc&gt;j</code>  # ทำงานตามปกติ<br/>
    <code>q</code>  # หยุดบันทึก<br/>
    <code>9@a</code>  # เล่นซ้ำ 9 รอบ<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> macro เล่นซ้ำคำสั่งเป๊ะตามที่บันทึกไว้ ไม่ได้ "เข้าใจ" เนื้อหา — ถ้าบางบรรทัดมีโครงสร้างต่างจากบรรทัดแรกที่ใช้บันทึก (เช่น มี <code>;</code> ติดอยู่ท้ายบรรทัดอยู่แล้ว หรือบรรทัดว่างคั่นอยู่) ผลลัพธ์ตอนเล่นซ้ำจะเพี้ยนทันที ควรเช็คให้แน่ใจว่าทุกบรรทัดมีรูปแบบเดียวกันก่อนเล่นซ้ำจำนวนมาก`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix ls: ดูรายชื่อไฟล์ทั้งหมดรวมไฟล์ซ่อน พร้อมรายละเอียด และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>ls</code> เฉยๆ แสดงแค่ชื่อไฟล์/โฟลเดอร์แบบสั้น และ<strong>ไม่แสดงไฟล์ซ่อน</strong> (ไฟล์ที่ชื่อขึ้นต้นด้วย <code>.</code> เช่น <code>.env</code>, <code>.gitignore</code>)<br/><br/>
    • <code>-l</code> (long) — แสดงแบบละเอียด: สิทธิ์ (rwx), เจ้าของ, กลุ่ม, ขนาดไฟล์, วันที่แก้ไขล่าสุด<br/>
    • <code>-a</code> (all) — แสดงไฟล์ซ่อนด้วย (รวมถึง <code>.</code> และ <code>..</code> ที่แทนโฟลเดอร์ปัจจุบัน/แม่)<br/>
    • รวมกันเป็น <code>-la</code> หรือ <code>-al</code> ได้ผลเหมือนกัน<br/><br/>
    เพิ่ม <code>-h</code> (human-readable) แสดงขนาดไฟล์เป็น KB/MB/GB แทนตัวเลข byte ยาวๆ อ่านยาก: <code>ls -lah</code><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>ls -la</code><br/>
    <code>ls -lah</code>  # + ขนาดไฟล์แบบอ่านง่าย<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>-a</code> จะรวม <code>.</code> (โฟลเดอร์ปัจจุบัน) และ <code>..</code> (โฟลเดอร์แม่) เข้ามาในรายการด้วยเสมอ — ถ้าเอาผลลัพธ์ <code>ls -la</code> ไปนับจำนวนไฟล์ด้วยสคริปต์ (เช่น <code>wc -l</code>) จะได้ตัวเลขเกินมา 2 จากสองรายการนี้ ต้องกรองออกก่อนถ้าต้องการนับไฟล์จริงๆ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix cat: แสดงเนื้อหาไฟล์สั้นๆ ในเทอร์มินัลทันที และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>cat</code> (concatenate) พิมพ์เนื้อหาไฟล์ออกทาง stdout ตรงๆ ทั้งไฟล์ — เหมาะกับไฟล์สั้นๆ ที่อยากดูเนื้อหาเร็วๆ โดยไม่ต้องเปิด editor<br/><br/>
    ใส่หลายไฟล์พร้อมกันได้ จะพิมพ์ต่อกันเป็นเนื้อหาเดียว: <code>cat a.txt b.txt</code> — ที่มาของชื่อ "concatenate" (เอามาต่อกัน) นั่นเอง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>cat deploy.log</code><br/>
    <code>cat part1.txt part2.txt &gt; combined.txt</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าไฟล์ยาวมาก (log เป็นหมื่นบรรทัด) <code>cat</code> จะพิมพ์รัวออกมาทั้งหมดจนล้นหน้าจอ อ่านไม่ทัน — กรณีนั้นควรใช้ <code>head</code>/<code>tail</code> (ดูเฉพาะส่วนต้น/ท้าย) หรือ <code>less</code> (เลื่อนดูทีละหน้า) แทน`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix head/tail: ดูแค่ต้นไฟล์หรือท้ายไฟล์ (รวมถึงแบบ Real-time) และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>head</code> แสดง<strong>บรรทัดแรกๆ</strong> ของไฟล์ (default 10 บรรทัด ถ้าไม่ระบุ), <code>tail</code> แสดง<strong>บรรทัดท้ายๆ</strong> ของไฟล์ — ใช้ <code>-n &lt;จำนวน&gt;</code> กำหนดจำนวนบรรทัดที่ต้องการทั้งคู่<br/><br/>
    <strong><code>tail -f</code></strong> (follow) พิเศษกว่า: แสดงบรรทัดท้ายไฟล์แล้ว<strong>ไม่จบโปรแกรม</strong> แต่ค้างรอดูบรรทัดใหม่ที่ถูกเขียนเพิ่มเข้าไฟล์แบบ real-time (เหมือนเปิดจอมอนิเตอร์ log สด) — เป็นวิธีมาตรฐานที่ใช้ตามดู log ของ server/process ที่กำลังรันอยู่ กด <code>Ctrl+C</code> เพื่อหยุดตาม<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>head -n 20 deploy.log</code><br/>
    <code>tail -f deploy.log</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>tail -f</code> ตามดู<strong>ไฟล์เดิมตาม file descriptor</strong> — ถ้า log ถูก rotate (ไฟล์เดิมถูก rename แล้วสร้างไฟล์ใหม่ชื่อเดิมแทน ซึ่งเป็นเรื่องปกติของระบบ log rotation) <code>tail -f</code> จะยังตามไฟล์เก่าที่ถูก rename ไปต่อ ไม่สลับไปไฟล์ใหม่ให้ ต้องใช้ <code>tail -F</code> (ตัวใหญ่) แทนถ้าต้องการให้ตามชื่อไฟล์แทน`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix cp/mv: สำรองไฟล์ (Copy) และย้าย/เปลี่ยนชื่อไฟล์ (Move) และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>cp &lt;ต้นทาง&gt; &lt;ปลายทาง&gt;</code> (copy) — ทำสำเนาไฟล์ ต้นฉบับยังอยู่เหมือนเดิม หลังรันจะมี<strong>2 ไฟล์</strong> ถ้าอยาก copy ทั้งโฟลเดอร์ต้องเติม <code>-r</code> (recursive): <code>cp -r src-dir/ dest-dir/</code><br/><br/>
    <code>mv &lt;ต้นทาง&gt; &lt;ปลายทาง&gt;</code> (move) — ย้ายไฟล์ ต้นฉบับ<strong>หายไป</strong> เหลือแค่ที่ปลายทางใหม่ (มีไฟล์เดียว) ใช้ syntax เดียวกันได้ทั้ง 2 จุดประสงค์:<br/>
    • <strong>ย้ายไปโฟลเดอร์อื่น</strong> (ชื่อไฟล์เหมือนเดิม): <code>mv file.txt archive/file.txt</code><br/>
    • <strong>เปลี่ยนชื่อ</strong> (อยู่โฟลเดอร์เดิม): <code>mv old-name.txt new-name.txt</code> — Unix ไม่มีคำสั่ง <code>rename</code> แยกต่างหาก ใช้ <code>mv</code> ทำหน้าที่นี้แทน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>cp config.yaml config.yaml.bak</code><br/>
    <code>mv config.yaml.bak archive/config.yaml.bak</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ทั้ง <code>cp</code> และ <code>mv</code> จะ<strong>เขียนทับไฟล์ปลายทางที่มีชื่อซ้ำโดยไม่เตือนเลย</strong> ถ้าปลายทางมีไฟล์อยู่แล้ว ข้อมูลเดิมจะหายทันทีไม่มีถามยืนยัน — ใช้ flag <code>-i</code> (interactive) ถ้าอยากให้ถามก่อนทับทุกครั้ง`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix rm: ลบไฟล์/โฟลเดอร์ทิ้งถาวร (ไม่มีถังขยะ) และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>rm &lt;ไฟล์&gt;</code> แบบ default ลบได้แค่ไฟล์เดี่ยว ลบโฟลเดอร์ไม่ได้ (error <code>Is a directory</code>) ต้องเติม flag:<br/><br/>
    • <code>-r</code> (recursive) — ลบแบบวนลึกเข้าไปทุก subdirectory จำเป็นสำหรับลบโฟลเดอร์<br/>
    • <code>-f</code> (force) — ไม่ถามยืนยันทีละไฟล์ และไม่ error ถ้าไฟล์ไม่มีอยู่จริง<br/>
    • รวมกันเป็น <code>-rf</code> คือ pattern มาตรฐานที่ใช้ลบโฟลเดอร์ทั้งก้อนแบบเงียบๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>rm -rf tmp-cache</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong style="color:#e00">คำเตือนสำคัญที่สุด:</strong> Unix <strong>ไม่มีถังขยะ (trash)</strong> — <code>rm -rf</code> ลบถาวรทันที กู้คืนไม่ได้เลย และห้ามใช้กับตัวแปรที่อาจว่างเปล่าเด็ดขาด: <code>rm -rf "$DIR"</code> ถ้า <code>$DIR</code> ดันไม่ได้ตั้งค่าไว้ (unset) จะกลายเป็น <code>rm -rf ""</code> ซึ่งบางกรณีตีความเป็นโฟลเดอร์ปัจจุบันหรือแย่กว่านั้น — นี่คือเหตุผลที่ <code>set -euo pipefail</code> (โดยเฉพาะ <code>-u</code>) สำคัญมากในสคริปต์ที่มี <code>rm -rf</code>`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix wc: นับจำนวนบรรทัด/คำ/ตัวอักษรในไฟล์ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>wc</code> (word count) นับสถิติพื้นฐานของไฟล์ text:<br/><br/>
    • <code>-l</code> — นับจำนวน<strong>บรรทัด</strong> (line)<br/>
    • <code>-w</code> — นับจำนวน<strong>คำ</strong> (word, แบ่งด้วย whitespace)<br/>
    • <code>-c</code> — นับจำนวน<strong>byte</strong>, <code>-m</code> — นับจำนวน<strong>ตัวอักษร</strong> (character อาจต่างจาก byte ถ้ามีตัวอักษรหลาย byte เช่นภาษาไทย)<br/><br/>
    ใช้บ่อยที่สุดแบบต่อ pipe เพื่อนับจำนวนผลลัพธ์จากคำสั่งอื่น เช่น <code>grep FAIL test-results.log | wc -l</code> นับว่ามีกี่บรรทัดที่ fail — เร็วกว่าเปิดไฟล์มานับเองเยอะ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>wc -l test-results.log</code><br/>
    <code>grep FAIL test-results.log | wc -l</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>wc -l</code> นับจากจำนวนตัวอักษร<strong>newline</strong> ในไฟล์ ไม่ใช่นับ "บรรทัด" ตรงๆ — ถ้าบรรทัดสุดท้ายของไฟล์ไม่มี newline ปิดท้าย (ไม่ได้กด Enter ก่อนจบไฟล์) <code>wc -l</code> จะนับขาดไป 1 บรรทัดจากที่เห็นจริงบนหน้าจอ`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix Redirection: ส่ง Output ไปเก็บในไฟล์แทนพิมพ์หน้าจอ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใช้บ่อยตอนรัน script ใน background/cron แล้วอยากเก็บทั้ง output และ error ไว้ตรวจสอบทีหลังในไฟล์เดียว แทนที่จะปล่อยหายไปกับ terminal<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>run-tests.sh &gt; out.log</code>  # ทับของเดิม<br/>
    <code>run-tests.sh &gt;&gt; out.log</code>  # ต่อท้าย<br/>
    <code>run-tests.sh &gt; out.log 2&gt;&1</code>  # รวม stdout+stderr<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>ลำดับสำคัญมาก</strong> — <code>2&gt;&1</code> ต้องอยู่<strong>หลัง</strong> <code>&gt; out.log</code> เสมอ ถ้าเขียนสลับเป็น <code>2&gt;&1 &gt; out.log</code> stderr จะยังคงพิมพ์ออก terminal เหมือนเดิม ไม่ถูกส่งเข้าไฟล์ด้วย เพราะตอนที่ <code>2&gt;&1</code> ทำงาน stdout ยังไม่ได้ถูกย้ายไปที่ไฟล์เลย`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix xargs: ส่งผลลัพธ์จาก Pipe ไปเป็น Argument ของคำสั่งถัดไป และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>หลายคำสั่ง (เช่น <code>rm</code>) รับ<strong>argument</strong>เป็นชื่อไฟล์ แต่<strong>ไม่ได้อ่านจาก stdin โดยตรง</strong> — ถ้า <code>find ... | rm</code> ตรงๆ จะไม่ทำงาน เพราะ <code>rm</code> ไม่รู้จะเอา stdin ไปทำอะไร<br/><br/>
    <code>xargs</code> แก้ปัญหานี้: อ่านแต่ละบรรทัดจาก stdin แล้ว<strong>แปลงเป็น argument</strong> ต่อท้ายคำสั่งที่ระบุ — <code>find . -name '*.tmp' | xargs rm</code> เท่ากับสั่ง <code>rm</code> พร้อม argument เป็นรายชื่อไฟล์ทั้งหมดที่ find เจอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>find . -name '*.tmp' | xargs rm</code><br/>
    <code>find . -name '*.tmp' -print0 | xargs -0 rm</code>  # ปลอดภัยกว่า<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าชื่อไฟล์มี space อยู่ข้างใน <code>xargs</code> ธรรมดาจะตัดคำผิดพลาด (แยกชื่อไฟล์เดียวเป็นหลาย argument) วิธีป้องกันคือใช้คู่กับ <code>find -print0</code> และ <code>xargs -0</code> ที่คั่นด้วย null byte แทน space`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix ps/kill: หา Process ที่ค้างอยู่แล้วปิดทิ้ง และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>ps aux</code> แสดง process ทั้งหมดที่กำลังรันอยู่ในเครื่อง (ทุก user, <code>a</code>=all users, <code>u</code>=user-oriented format แสดง CPU%/mem%, <code>x</code>=รวม process ที่ไม่ได้ผูกกับ terminal ด้วย) แต่ละแถวมี <strong>PID</strong> (Process ID) ซึ่งเป็นตัวเลขไว้อ้างอิงว่าจะสั่งอะไรกับ process ไหน — ต่อ pipe เข้า <code>grep</code> เพื่อกรองหาเฉพาะที่สนใจ<br/><br/>
    <code>kill &lt;PID&gt;</code> ส่ง<strong>signal</strong>ไปให้ process — default คือ <code>SIGTERM</code> (signal 15) ที่แค่ "ขอร้อง" ให้ process ปิดตัวเอง (ยังทำ cleanup ก่อนปิดได้) ส่วน <code>kill -9</code> คือ <code>SIGKILL</code> ที่<strong>บังคับปิดทันที ไม่ให้โอกาส cleanup เลย</strong><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>ps aux | grep node</code><br/>
    <code>kill -9 1234</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>แนวทางที่ควรทำ:</strong> ลอง <code>kill &lt;PID&gt;</code> เปล่าๆ (ไม่มี -9) ก่อนเสมอ ให้โอกาส process ปิดตัวเองอย่างเรียบร้อย (ทำ cleanup ก่อนปิดได้) ถ้าไม่ยอมปิดจริงๆ ค่อยใช้ <code>-9</code> (SIGKILL) เป็นทางเลือกสุดท้าย — และ <code>ps aux | grep node</code> มักเจอ process ของ <code>grep</code> เองติดมาด้วยเสมอ (เพราะชื่อคำสั่งมีคำว่า node อยู่ในนั้น) ต้องดู PID ให้ถูกตัวก่อน kill`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix curl: ยิง Request ทดสอบ API จาก Terminal และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Flag ที่ใช้บ่อยสำหรับ smoke test: <code>-s</code> (silent ปิด progress meter), <code>-o /dev/null</code> (ทิ้ง response body), <code>-w "%{http_code}"</code> (พิมพ์ HTTP status code แทน) — รวมกันได้ one-liner เช็คว่า endpoint ตอบ 200 มั้ยโดยไม่ต้อง parse response เอง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>curl -s -o /dev/null -w "%{http_code}" \</code><br/>
    <code>&nbsp;&nbsp;https://api.example.com/health</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>curl</code> default ถือว่า<strong>สำเร็จ (exit code 0) แม้ server ตอบ 404 หรือ 500</strong> ก็ตาม เพราะ curl มองว่า request-response สำเร็จแล้ว (แค่ status code ไม่ใช่ 200) — ถ้าอยากให้ curl fail จริงตอนเจอ HTTP error ต้องเติม flag <code>-f</code> (fail) เพิ่มด้วย ไม่งั้น script ที่เช็คแค่ exit code จะไม่รู้ตัวว่า endpoint พังอยู่`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix tar: บีบอัดและแตกไฟล์ Archive และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>tar</code> (tape archive) รวมหลายไฟล์/โฟลเดอร์เป็น archive ไฟล์เดียว — flag ที่ต้องจำ (เรียงลำดับสำคัญ <code>f</code> ต้องอยู่ท้ายสุดก่อนชื่อไฟล์เสมอ):<br/><br/>
    • <code>c</code> (create) — สร้าง archive ใหม่, <code>x</code> (extract) — แตก archive ออกมา<br/>
    • <code>z</code> (gzip) — บีบอัด/แตกแบบ gzip พร้อมกันในตัว (ได้ <code>.tar.gz</code>)<br/>
    • <code>v</code> (verbose) — แสดงรายชื่อไฟล์ที่กำลังประมวลผลระหว่างทาง (เห็น progress)<br/>
    • <code>f</code> (filename) — ระบุว่าชื่อไฟล์ archive คืออะไร (argument ถัดจาก flag นี้ต้องเป็นชื่อไฟล์เสมอ)<br/><br/>
    <code>-czvf</code> (create) กับ <code>-xzvf</code> (extract) คือ 2 pattern ที่ใช้บ่อยที่สุดจนควรจำขึ้นใจ — ใช้เก็บ build artifact/test report ก่อนอัปโหลดใน CI pipeline บ่อยมาก เพราะไฟล์เดียวอัปโหลด/ดาวน์โหลดง่ายกว่าไฟล์กระจายเป็นร้อยไฟล์<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>tar -czvf test-reports.tar.gz test-reports/</code><br/>
    <code>tar -xzvf test-reports.tar.gz</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลำดับ flag สำคัญ — <code>f</code> ต้องอยู่<strong>ตัวสุดท้าย</strong>ของกลุ่ม flag เสมอ เพราะ argument ถัดจาก <code>f</code> ต้องเป็นชื่อไฟล์ archive โดยตรง ถ้าเขียนสลับเป็น <code>-fczv</code> tar จะเข้าใจผิดว่าชื่อไฟล์ archive คือ <code>czv</code> แทน แล้ว error ทันที`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix sed: แทนที่ข้อความในไฟล์ตรงๆ ผ่าน Command Line และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใช้บ่อยตอนต้องแก้ config/version หลายไฟล์พร้อมกันแบบอัตโนมัติใน script (เช่น bump version ตอน release) โดยไม่ต้องเปิด editor ทีละไฟล์<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>sed -i 's/1.2.0/1.3.0/g' version.txt</code><br/>
    <code>sed -i.bak 's/1.2.0/1.3.0/g' version.txt</code>  # เก็บสำรอง<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>ข้อควรระวังข้าม OS:</strong> บน Linux <code>sed -i 's/.../.../' file</code> ใช้ได้ตรงๆ แต่บน macOS (BSD sed) ต้องใส่ argument ว่างต่อจาก <code>-i</code> เสมอ: <code>sed -i '' 's/.../.../' file</code> ไม่งั้นจะ error หรือพฤติกรรมเพี้ยน`,
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix export: ตั้งค่า Environment Variable ให้ Subprocess มองเห็น และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>VAR=value</code> เฉยๆ (ไม่มี <code>export</code>) ตั้งค่าเป็นแค่<strong>shell variable</strong> — มองเห็นได้เฉพาะ shell ปัจจุบันเท่านั้น ถ้า shell นี้ไปเรียก process อื่นต่อ (เช่นรัน <code>node script.js</code>) process ลูกนั้น<strong>จะมองไม่เห็นค่านี้เลย</strong><br/><br/>
    <code>export VAR=value</code> เลื่อนสถานะตัวแปรขึ้นเป็น<strong>environment variable</strong> ที่ถูกส่งต่อ (inherit) ไปให้ทุก subprocess ที่ถูกเรียกจาก shell นี้นับจากนี้ไป — สำคัญมากเพราะเครื่องมือส่วนใหญ่ (test runner, build script, framework ต่างๆ) อ่าน config ผ่าน environment variable (เช่น <code>process.env.API_URL</code> ใน Node.js หรือ <code>os.environ</code> ใน Python) ไม่ได้อ่านจาก shell variable ตรงๆ<br/><br/>
    เช็คค่าที่ export ไว้ได้ด้วย <code>echo $API_URL</code> หรือดูทุก environment variable พร้อมกันด้วย <code>env</code><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>export API_URL=https://staging.api.example.com</code><br/>
    <code>echo $API_URL</code>  # เช็คค่าที่ตั้งไว้<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> environment variable ส่งต่อได้<strong>ทางเดียว</strong> จาก shell แม่ไปยัง subprocess ลูกเท่านั้น — ถ้ารันสคริปต์ (<code>./script.sh</code>) ที่ export ตัวแปรไว้ข้างใน ค่านั้นจะ<strong>ไม่ย้อนกลับมาให้ shell ที่เรียกมันเห็นเลย</strong> เพราะสคริปต์รันเป็น subprocess แยก ถ้าต้องการให้ shell ปัจจุบันเห็นค่าด้วยต้อง <code>source script.sh</code> แทนการรันตรงๆ`,
    example: `# เช็คค่าที่ export ไว้ แล้วลบทิ้งถ้าไม่ต้องการแล้ว
echo $API_URL
unset API_URL`,
    task: `จงตั้งค่า environment variable <code>API_URL</code> เป็น <code>https://staging.api.example.com</code> ด้วย <code>export</code>`
  },
  {
    id: "git_rebase_interactive",
    meta: "ขั้นสูง 3",
    title: "Git Rebase -i: รวมหลาย Commit เข้าด้วยกันก่อน Push",
    template: `# สถานการณ์: มี 3 commit ล่าสุดที่จริงๆ แก้เรื่องเดียวกัน (พัฒนาไปทีละนิดระหว่างทาง) ยังไม่ได้ push อยากรวมเป็น commit เดียวก่อนให้คนอื่นเห็น
# 1. เปิด interactive rebase ครอบคลุม 3 commit ล่าสุด
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git rebase -i...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRebaseI = /git rebase\s+-i\s+HEAD~3\b/.test(activeCode);
      if (hasRebaseI) {
        log("✓ ใช้ git rebase -i HEAD~3 ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git rebase -i HEAD~3\nตัวอย่าง: git rebase -i HEAD~3");
      }
    },
    hint: "rebase ปกติมี flag ที่เปิด editor ให้เลือก action ทีละ commit ได้ (interactive) แล้วระบุว่าย้อนไปกี่ commit จาก HEAD",
    solution: `git rebase -i HEAD~3`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Git Rebase -i: รวมหลาย Commit เข้าด้วยกันก่อน Push และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>git rebase -i HEAD~3</code> เปิด editor แสดงรายชื่อ 3 commit ล่าสุด แต่ละบรรทัดขึ้นต้นด้วย <code>pick</code> — แก้คำนำหน้าเพื่อสั่ง action ต่างกัน: <code>pick</code> ใช้เดิม, <code>squash</code>/<code>s</code> รวมกับ commit ด้านบน, <code>reword</code>/<code>r</code> แก้แค่ message, <code>drop</code>/<code>d</code> ลบทิ้ง — สลับลำดับบรรทัดในไฟล์ = สลับลำดับ commit<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git rebase -i HEAD~3</code><br/>
    <code>pick abc1234 ...</code><br/>
    <code>squash def5678 ...</code>  # แก้คำนำหน้าในตัว editor<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong style="color:#e00">กฎเดียวกับ amend:</strong> ห้าม <code>rebase -i</code> กับ commit ที่ push ไปแล้วและคนอื่นดึงไปใช้ต่อ เพราะเปลี่ยน commit hash ทั้งหมดที่ถูกแก้`,
    example: `# squash 3 commit ล่าสุดรวมเป็นก้อนเดียวแบบอัตโนมัติไม่ต้องเปิด editor เอง (ใช้ message ของ commit แรกสุด)
git reset --soft HEAD~3 && git commit -m "feat: complete login validation logic"`,
    task: `จงเปิด interactive rebase ครอบคลุม 3 commit ล่าสุดด้วย <code>git rebase -i HEAD~3</code>`
  },
  {
    id: "git_cherry_pick",
    meta: "ขั้นสูง 4",
    title: "Git Cherry-pick: หยิบ Commit เดียวจาก Branch อื่นมาใช้",
    template: `# สถานการณ์: มี commit แก้บั๊กด่วน (hash abc1234) อยู่ใน branch hotfix ต้องการเอาแค่ commit นี้อันเดียวมาใช้ที่ branch ปัจจุบัน โดยไม่ merge ทั้ง branch
# 1. หยิบ commit abc1234 มา apply เป็น commit ใหม่ที่ branch ปัจจุบัน
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git cherry-pick...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasCherryPick = /git cherry-pick\s+abc1234\b/.test(activeCode);
      if (hasCherryPick) {
        log("✓ ใช้ git cherry-pick abc1234 ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git cherry-pick abc1234\nตัวอย่าง: git cherry-pick abc1234");
      }
    },
    hint: "คำสั่งที่หยิบการแก้ไขจาก commit เดียว (ระบุด้วย hash) มาสร้างเป็น commit ใหม่ที่ branch ปัจจุบัน ไม่เกี่ยวกับ commit อื่นใน branch ต้นทางเลย",
    solution: `git cherry-pick abc1234`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git cherry-pick &lt;commit&gt;</strong> เอาการเปลี่ยนแปลง (diff) จาก commit เดียวมา apply เป็น<strong>commit ใหม่</strong>ที่ branch ปัจจุบัน (hash ใหม่ แต่เนื้อหา/ข้อความ commit เหมือนเดิมโดย default) — ต่างจาก <code>merge</code> ที่เอาทั้ง branch มารวม cherry-pick เอาแค่ commit เดียวที่เลือกจริงๆ<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>git cherry-pick &lt;commit&gt;</strong> เอาการเปลี่ยนแปลง (diff) จาก commit เดียวมา apply เป็น<strong>commit ใหม่</strong>ที่ branch ปัจจุบัน (hash ใหม่ แต่เนื้อหา/ข้อความ commit เหมือนเดิมโดย default) — ต่างจาก <code>merge</code> ที่เอาทั้ง branch มารวม cherry-pick เอาแค่ commit เดียวที่เลือกจริงๆ<br/><br/>
    ใช้บ่อยตอน "backport" — commit แก้บั๊กที่ทำไว้ใน branch หนึ่ง (เช่น hotfix) แล้วอยากเอาไปใช้ใน branch อื่นด้วย (เช่น release branch เก่า) โดยไม่ต้อง merge ทั้งประวัติ branch เข้าไป<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git cherry-pick abc1234</code><br/>
    <code>git cherry-pick --continue</code>  # หลังแก้ conflict<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> อาจเกิด conflict ได้ถ้า context รอบๆ commit ต่างกันมากระหว่าง 2 branch — ต้องแก้ conflict เองแล้ว <code>git add</code> ตามด้วย <code>git cherry-pick --continue</code> เหมือน rebase (ไม่ใช่ <code>git commit</code> ตรงๆ) หรือ <code>git cherry-pick --abort</code> ถ้าอยากยกเลิกกลับไปจุดก่อนเริ่ม`,
    example: `# หยิบมาแต่ยัง stage ไว้เฉยๆ ไม่สร้าง commit ทันที (เผื่ออยากแก้อะไรเพิ่มก่อน)
git cherry-pick --no-commit abc1234`,
    task: `จงหยิบ commit <code>abc1234</code> มา apply เป็นcommit ใหม่ที่ branch ปัจจุบันด้วย <code>git cherry-pick abc1234</code>`
  },
  {
    id: "git_reflog",
    meta: "ขั้นสูง 5",
    title: "Git Reflog: กู้คืน Commit ที่คิดว่าหายไปแล้ว",
    template: `# สถานการณ์: เผลอ git reset --hard ไปโดนของดีทิ้งหมด คิดว่า commit หายไปแล้วถาวร แต่จริงๆ git ยังไม่ลบทิ้งทันที
# 1. ดูประวัติการเคลื่อนที่ทั้งหมดของ HEAD เพื่อหา commit hash ที่หายไป
# WRITE YOUR CODE HERE


# 2. สมมติเจอว่าจุดที่ต้องการอยู่ที่ตำแหน่ง 2 ก้อนก่อนหน้า (HEAD@{2}) ย้อนกลับไปที่จุดนั้นแบบเอาไฟล์กลับมาด้วย
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git reflog...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasReflog = /git reflog\b/.test(activeCode);
      const hasReset = /git reset\s+--hard\s+HEAD@\{2\}/.test(activeCode);
      if (!hasReflog) {
        throw new Error("ไม่พบคำสั่ง git reflog\nตัวอย่าง: git reflog");
      }
      if (!hasReset) {
        throw new Error("ไม่พบคำสั่ง git reset --hard HEAD@{2}\nตัวอย่าง: git reset --hard HEAD@{2}");
      }
      log("✓ ใช้ git reflog แล้ว git reset --hard HEAD@{2} ถูกต้อง");
    },
    hint: "คำสั่งแรกแสดงประวัติทุกตำแหน่งที่ HEAD เคยชี้ไป (รวมจุดที่ดูเหมือนหายไปแล้วจาก log ปกติ) ส่วนคำสั่งที่สองย้อนกลับไปตำแหน่งที่ N ใน reflog นั้น ใช้ syntax HEAD@{N}",
    solution: `git reflog
git reset --hard HEAD@{2}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git reflog</strong> บันทึกทุกตำแหน่งที่ <code>HEAD</code> เคยชี้ไป — ทุก commit, reset, rebase, checkout ที่เคยทำ แม้ commit นั้นจะไม่ถูกอ้างถึงจาก branch ไหนแล้วก็ตาม (เช่นโดน <code>reset --hard</code> ทิ้งไป) git ก็<strong>ยังไม่ลบข้อมูลจริงทันที</strong> (เก็บไว้ในเครื่องประมาณ 90 วันโดย default ก่อน garbage collect)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>reflog คือ "ตาข่ายนิรภัย" ของ git สำหรับความผิดพลาดที่ทำในเครื่องตัวเองแทบทุกแบบ (reset ผิด, rebase พัง, ลบ branch เผลอ) แต่<strong>อยู่แค่ในเครื่องตัวเอง ไม่ถูก push ไปไหน</strong> — คนอื่นกู้จาก reflog ของเราไม่ได้<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git reflog</code><br/>
    <code>git reset --hard HEAD@{2}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ตำแหน่ง <code>HEAD@{N}</code> ขยับทุกครั้งที่มี action ใหม่เกิดขึ้น (commit, reset, checkout ฯลฯ) — ถ้าเช็ค <code>git reflog</code> ดูตำแหน่งไว้แล้ว แต่ดันทำ action อื่นคั่นก่อนจะ <code>reset</code> จริง ตัวเลข N ที่จำไว้จะไม่ตรงกับตำแหน่งเดิมอีกต่อไป ต้องเช็ค <code>git reflog</code> ซ้ำก่อน reset เสมอถ้ามีอะไรคั่นระหว่างทาง`,
    example: `# ดู reflog แบบมีเวลากำกับด้วยว่าแต่ละจุดเกิดขึ้นเมื่อไหร่
git reflog --date=iso`,
    task: `จงดูประวัติทั้งหมดของ HEAD ด้วย <code>git reflog</code> แล้วย้อนกลับไปที่ <code>HEAD@{2}</code> แบบเอาไฟล์กลับมาด้วย <code>git reset --hard HEAD@{2}</code>`
  },
  {
    id: "git_bisect",
    meta: "ขั้นสูง 6",
    title: "Git Bisect: หา Commit ต้นเหตุของบั๊กด้วย Binary Search",
    template: `# สถานการณ์: เพิ่งเจอบั๊กตอนนี้ แต่ไม่รู้ว่า commit ไหนใน 100 commit ที่ผ่านมาที่ทำให้เกิด รู้แค่ว่า tag v1.0.0 ตอนนั้นยังไม่มีบั๊กแน่ๆ
# 1. เริ่มกระบวนการ bisect
# WRITE YOUR CODE HERE


# 2. บอก git ว่า commit ปัจจุบัน (ล่าสุด) มีบั๊ก


# 3. บอก git ว่า tag v1.0.0 เป็นจุดที่ยังไม่มีบั๊ก (good) — จากนี้ git จะ checkout จุดกึ่งกลางให้ทดสอบเอง
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git bisect...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasStart = lines.some(l => l === 'git bisect start');
      const hasBad = lines.some(l => l === 'git bisect bad');
      const hasGood = lines.some(l => l === 'git bisect good v1.0.0');

      if (!hasStart) throw new Error("ไม่พบคำสั่ง git bisect start\nตัวอย่าง: git bisect start");
      if (!hasBad) throw new Error("ไม่พบคำสั่ง git bisect bad\nตัวอย่าง: git bisect bad");
      if (!hasGood) throw new Error("ไม่พบคำสั่ง git bisect good v1.0.0\nตัวอย่าง: git bisect good v1.0.0");
      log("✓ ใช้ git bisect start → bad → good v1.0.0 ถูกต้อง");
    },
    hint: "ต้องเริ่มโหมด bisect ก่อนเสมอ แล้วบอกสถานะ 2 จุด: จุดปัจจุบันที่รู้ว่ามีบั๊ก (bad) และจุดในอดีตที่รู้ว่ายังไม่มีบั๊ก (good) ระบุ tag/commit ต่อท้าย good ได้เลย",
    solution: `git bisect start
git bisect bad
git bisect good v1.0.0`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git bisect</strong> หา commit ต้นเหตุของบั๊กด้วย <strong>binary search</strong> แทนการไล่เช็คทีละ commit (O(log n) ครั้งแทน O(n)) — จาก 100 commit ใช้แค่ประมาณ 7 ครั้งก็เจอ<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ขั้นตอน: (1) <code>git bisect start</code> เข้าโหมด bisect (2) <code>git bisect bad</code> บอกว่าตำแหน่งปัจจุบันมีบั๊ก (3) <code>git bisect good v1.0.0</code> บอกจุดเก่าที่ยังไม่มีบั๊ก — git จะ <code>checkout</code> ไปจุดกึ่งกลางให้อัตโนมัติ (4) ทดสอบแล้วบอกผล <code>good</code>/<code>bad</code> ซ้ำจนกว่าจะเจอ commit ต้นเหตุ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git bisect start</code><br/>
    <code>git bisect bad</code><br/>
    <code>git bisect good v1.0.0</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ต้องรัน <code>git bisect reset</code> เมื่อหาเจอหรือยกเลิกแล้วเสมอ — ไม่งั้น repo จะค้างอยู่ในสถานะ detached HEAD กลางกระบวนการ bisect ต่อไปเรื่อยๆ ทำงานต่อบน branch ปกติไม่ได้จนกว่าจะ reset ออกมาก่อน`,
    example: `# ให้ git ทดสอบอัตโนมัติด้วย script/test command แทนตอบ good/bad มือเอง (เร็วกว่ามาก)
git bisect run npm test`,
    task: `จงเริ่ม bisect ด้วย <code>git bisect start</code> บอกจุดปัจจุบันว่ามีบั๊กด้วย <code>git bisect bad</code> แล้วบอกจุด <code>v1.0.0</code> ว่ายังไม่มีบั๊กด้วย <code>git bisect good v1.0.0</code>`
  },
  {
    id: "git_worktree",
    meta: "ขั้นสูง 7",
    title: "Git Worktree: ทำงานหลาย Branch พร้อมกันโดยไม่ต้อง Stash",
    template: `# สถานการณ์: กำลังเขียนโค้ดค้างอยู่ใน branch feature-a ยังไม่พร้อม commit/stash แต่ต้องรีบไปแก้บั๊กด่วนใน branch hotfix แบบขนานกัน โดยไม่รบกวนโฟลเดอร์ปัจจุบันเลย
# 1. สร้างโฟลเดอร์ทำงานใหม่ที่ ../hotfix-work ให้ checkout branch hotfix เข้าไปทำงานคู่ขนานกับโฟลเดอร์ปัจจุบัน
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง git worktree...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasWorktree = /git worktree add\s+\.\.\/hotfix-work\s+hotfix\b/.test(activeCode);
      if (hasWorktree) {
        log("✓ ใช้ git worktree add ../hotfix-work hotfix ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง git worktree add ../hotfix-work hotfix\nตัวอย่าง: git worktree add ../hotfix-work hotfix");
      }
    },
    hint: "worktree มีคำสั่งย่อย add ตามด้วย path โฟลเดอร์ใหม่ที่จะสร้าง แล้วตามด้วยชื่อ branch ที่ต้องการ checkout เข้าไปในโฟลเดอร์นั้น",
    solution: `git worktree add ../hotfix-work hotfix`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>git worktree</strong> ให้ checkout หลาย branch พร้อมกันได้ในเวลาเดียวกัน คนละโฟลเดอร์ แต่ทั้งหมดแชร์ <code>.git</code> history/object เดียวกัน (ไม่ใช่ clone ซ้ำ ประหยัดพื้นที่และ sync กันเองอัตโนมัติ)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>คำสั่งจัดการอื่น: <code>git worktree list</code> ดูทั้งหมดที่มีอยู่, <code>git worktree remove &lt;path&gt;</code> ลบทิ้งเมื่อทำงานเสร็จแล้ว<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>git worktree add ../hotfix-work hotfix</code><br/>
    <code>git worktree list</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>branch เดียวกันเช็คเอาท์พร้อมกันในหลาย worktree ไม่ได้</strong> — ถ้า branch <code>hotfix</code> ถูก checkout อยู่ที่ worktree หนึ่งแล้ว การ <code>git worktree add</code> ด้วย branch เดิมที่อื่นจะ error ทันที (<code>already checked out</code>) ต้องสร้าง branch ใหม่หรือใช้ branch อื่นแทน`,
    example: `# ดู worktree ทั้งหมดที่มีอยู่ตอนนี้
git worktree list`,
    task: `จงสร้าง worktree ใหม่ที่ <code>../hotfix-work</code> พร้อม checkout branch <code>hotfix</code> ด้วย <code>git worktree add ../hotfix-work hotfix</code>`
  },
  {
    id: "vim_registers",
    meta: "ขั้นสูง 8",
    title: "Vim Named Registers: คัดลอกหลายก้อนพร้อมกันโดยไม่ทับกัน",
    template: `# สถานการณ์: อยากคัดลอกบรรทัดปัจจุบันเก็บไว้ในที่เก็บแยกต่างหาก (ไม่ใช่ unnamed register ตัวเดียวที่ยกเลิกของเก่าทันทีที่ yank/delete ใหม่) แล้ววางออกมาทีหลัง
# 1. คัดลอกบรรทัดปัจจุบันเก็บลง register ชื่อ a
# WRITE YOUR CODE HERE


# 2. วางเนื้อหาจาก register a ออกมา
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasYank = lines.some(l => l === '"ayy');
      const hasPaste = lines.some(l => l === '"ap');

      if (!hasYank) throw new Error("ไม่พบคำสั่งคัดลอกลง register a\nตัวอย่าง: พิมพ์ \"ayy");
      if (!hasPaste) throw new Error("ไม่พบคำสั่งวางจาก register a\nตัวอย่าง: พิมพ์ \"ap");
      log("✓ ใช้ \"ayy แล้ว \"ap ถูกต้อง");
    },
    hint: "นำหน้าคำสั่ง yank/paste ปกติด้วย \" (double quote) ตามด้วยชื่อ register (ตัวอักษร a-z) ที่ต้องการใช้แทนที่ unnamed register เริ่มต้น",
    solution: `"ayy
"ap`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Unnamed register</strong> (ตัวที่ <code>yy</code>/<code>dd</code>/<code>p</code> ใช้โดย default ไม่ต้องระบุอะไร) มีแค่<strong>ก้อนเดียว</strong> — yank/delete ใหม่ทับของเก่าทันที เก็บพร้อมกันหลายก้อนไม่ได้<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Named register</strong> (ตัวอักษร a-z) แก้ปัญหานี้ — เก็บได้อิสระจากกัน 26 ก้อนพร้อมกัน <code>:reg</code> ดูเนื้อหาทุก register พร้อมกันได้ ช่วยเช็คว่าเก็บอะไรไว้ตรงไหนบ้าง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>"ayy</code>  # yank เก็บลง register a<br/>
    <code>"ap</code>  # วางจาก register a<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ใช้ตัวพิมพ์เล็ก <code>"a</code> จะ<strong>เขียนทับ</strong>เนื้อหาเดิมใน register a ทุกครั้ง — ถ้าต้องการ<strong>ต่อท้าย</strong>เพิ่มเข้า register เดิมแทนการทับ ต้องใช้ตัวพิมพ์ใหญ่ (เช่น <code>"Ayy</code>) พลาดตัวพิมพ์เล็ก-ใหญ่ตรงนี้บ่อยจนของเก่าหายไปโดยไม่ตั้งใจ`,
    example: `# ยก (yank) เข้า system clipboard ของ OS โดยตรง (แชร์กับโปรแกรมอื่นนอก Vim ได้)
"+yy`,
    task: `จง yank บรรทัดปัจจุบันลง register <code>a</code> ด้วย <code>"ayy</code> แล้ววางออกมาด้วย <code>"ap</code>`
  },
  {
    id: "vim_split_windows",
    meta: "ขั้นสูง 9",
    title: "Vim Split Windows: ดู 2 ไฟล์พร้อมกันในหน้าจอเดียว",
    template: `# สถานการณ์: กำลังแก้ login.ts อยู่ อยากเปิด test/login.spec.ts ดูคู่กันในหน้าจอเดียวกัน โดยไม่ต้องสลับ buffer ไปมา
# 1. split หน้าจอแนวนอน เปิดไฟล์ test/login.spec.ts ขึ้นมาอีกช่อง
# WRITE YOUR CODE HERE


# 2. สลับ focus ไปยังหน้าต่างถัดไป
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง split...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasSplit = lines.some(l => l === ':sp test/login.spec.ts');
      const hasSwitch = lines.some(l => /^ctrl-w\s*w$|^<c-w>\s*w$|^ctrl\+w\s*w$/i.test(l));

      if (!hasSplit) throw new Error("ไม่พบคำสั่ง split เปิดไฟล์ test/login.spec.ts\nตัวอย่าง: :sp test/login.spec.ts");
      if (!hasSwitch) throw new Error("ไม่พบคำสั่งสลับ focus ไปหน้าต่างถัดไป\nตัวอย่าง: Ctrl+w w");
      log("✓ ใช้ :sp test/login.spec.ts แล้ว Ctrl+w w ถูกต้อง");
    },
    hint: "คำสั่ง Ex สำหรับ split แนวนอนตามด้วยชื่อไฟล์ที่จะเปิดในช่องใหม่ ส่วนการสลับ focus ระหว่างช่องใช้ปุ่ม Ctrl ค้างไว้กับ w แล้วกด w ซ้ำอีกทีเพื่อวนไปช่องถัดไป",
    solution: `:sp test/login.spec.ts
Ctrl+w w`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim Split Windows: ดู 2 ไฟล์พร้อมกันในหน้าจอเดียว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>:sp &lt;ไฟล์&gt;</code> (split) แบ่งหน้าจอแนวนอนเป็น 2 ช่อง เปิดไฟล์ที่ระบุในช่องใหม่ (ถ้าไม่ใส่ชื่อไฟล์จะเปิดไฟล์เดิมซ้ำอีกช่อง เหมาะกับดู 2 จุดของไฟล์ยาวพร้อมกัน) — <code>:vsp</code> ทำแบบเดียวกันแต่แบ่งแนวตั้งแทน<br/><br/>
    การสลับ focus ระหว่างช่อง (window) ทั้งหมดขึ้นต้นด้วย <code>Ctrl+w</code> ตามด้วยคีย์ที่สอง:<br/>
    • <code>Ctrl+w w</code> — วนไปช่องถัดไป<br/>
    • <code>Ctrl+w h/j/k/l</code> — ย้าย focus ตามทิศทาง (เหมือนคีย์เคลื่อนที่ปกติ)<br/>
    • <code>Ctrl+w q</code> — ปิดช่องปัจจุบัน<br/><br/>
    <code>:only</code> ปิดช่องอื่นทั้งหมด เหลือแค่ช่องปัจจุบันช่องเดียว — ต่างจาก buffer/tab ตรงที่ split ทำให้เห็นหลายไฟล์<strong>พร้อมกันในจอเดียว</strong> ไม่ต้องสลับไปมา<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>:sp test/login.spec.ts</code><br/>
    <code>Ctrl+w w</code>  # วนไปช่องถัดไป<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>:q</code> ในหน้าต่าง split จะปิดแค่<strong>ช่องปัจจุบันช่องเดียว</strong> ไม่ได้ปิด Vim ทั้งโปรแกรม — หลายคนกด <code>:q</code> ซ้ำหลายรอบเพื่อปิดทีละช่องโดยไม่รู้ว่ามี <code>:qa</code> (quit all) ที่ปิดทุกช่องพร้อมกันในคำสั่งเดียว`,
    example: `# แบ่งแนวตั้งแทนแนวนอน เปิดไฟล์เดิมซ้ำเพื่อเทียบ 2 ส่วนของไฟล์ยาวเดียวกัน
:vsp`,
    task: `จง split แนวนอนเปิด <code>test/login.spec.ts</code> ด้วย <code>:sp test/login.spec.ts</code> แล้วสลับ focus ไปช่องถัดไปด้วย <code>Ctrl+w w</code>`
  },
  {
    id: "vim_global_command",
    meta: "ขั้นสูง 10",
    title: "Vim Global Command: รันคำสั่งกับทุกบรรทัดที่ Match Pattern",
    template: `# สถานการณ์: ไฟล์ log มีบรรทัด DEBUG ปนอยู่เต็มไปหมด อยากลบทุกบรรทัดที่มีคำว่า DEBUG ทิ้งทั้งไฟล์ในคำสั่งเดียว (ไม่ใช่ไล่ dd ทีละบรรทัด)
# 1. ลบทุกบรรทัดที่มีคำว่า DEBUG ทิ้งทั้งไฟล์
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง :g...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasGlobal = /:g\/DEBUG\/d\b/.test(activeCode);
      if (hasGlobal) {
        log("✓ ใช้ :g/DEBUG/d ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง :g/DEBUG/d\nตัวอย่าง: :g/DEBUG/d");
      }
    },
    hint: "คำสั่ง Ex ที่หาทุกบรรทัดที่ match pattern ก่อน (คั่นด้วย /) แล้วรันคำสั่งต่อท้ายกับทุกบรรทัดที่เจอ — คำสั่งที่จะรันในที่นี้คือคำสั่งลบบรรทัด",
    solution: `:g/DEBUG/d`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim Global Command: รันคำสั่งกับทุกบรรทัดที่ Match Pattern และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>:g/pattern/command</code> (global) หาทุกบรรทัดที่ match <code>pattern</code>ในไฟล์ทั้งหมดก่อน แล้วรัน Ex <code>command</code> ที่ระบุกับ<strong>ทุกบรรทัดที่เจอ</strong> — รวม "หา" กับ "ทำ" เป็นคำสั่งเดียว ไม่ต้องไล่ทีละบรรทัดเอง<br/><br/>
    <code>:g/DEBUG/d</code> — หาทุกบรรทัดที่มีคำว่า <code>DEBUG</code> แล้ว <code>d</code> (delete) ทิ้งทุกบรรทัดนั้น<br/><br/>
    ผสมกับ <code>:s</code> (substitute) ที่เรียนไปก่อนหน้าได้ด้วย: <code>:g/pattern/s/หา/แทน/</code> จะแทนที่แค่ในบรรทัดที่ match pattern เท่านั้น (ต่างจาก <code>:%s/หา/แทน/g</code> ที่ทำกับทุกบรรทัดไม่สนใจเงื่อนไข)<br/><br/>
    <code>:g!/pattern/command</code> (หรือ <code>:v/pattern/command</code>) กลับด้าน — ทำกับบรรทัดที่<strong>ไม่ match</strong> pattern แทน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>:g/DEBUG/d</code><br/>
    <code>:g/pattern/s/หา/แทน/</code>  # ผสมกับ substitute<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้า pattern ที่ค้นหามีเครื่องหมาย <code>/</code> อยู่ในตัวเอง (เช่นค้นหา path อย่าง <code>src/utils</code>) Vim จะตีความ <code>/</code> ตัวกลางเป็นตัวปิด pattern ผิดจุดทันที ต้องเปลี่ยนตัวคั่นเป็นอักขระอื่นแทน เช่น <code>:g#src/utils#d</code>`,
    example: `# แทนที่คำว่า TODO เป็น DONE เฉพาะบรรทัดที่มีคำว่า TODO เท่านั้น
:g/TODO/s/TODO/DONE/`,
    task: `จงลบทุกบรรทัดที่มีคำว่า <code>DEBUG</code> ทิ้งทั้งไฟล์ด้วย <code>:g/DEBUG/d</code>`
  },
  {
    id: "vim_marks",
    meta: "ขั้นสูง 11",
    title: "Vim Marks: ปักหมุดตำแหน่งแล้วกระโดดกลับมาแม่นยำ",
    template: `# สถานการณ์: กำลังแก้ไฟล์ยาวอยู่ อยากปักหมุดตำแหน่งปัจจุบันไว้ก่อนเลื่อนไปทำที่อื่น แล้วอยากกระโดดกลับมาที่หมุดเดิมแบบแม่นยำทีหลัง
# 1. ปักหมุดตำแหน่ง cursor ปัจจุบัน เก็บไว้ในชื่อ a
# WRITE YOUR CODE HERE


# 2. (เลื่อนไปทำที่อื่นแล้ว) กระโดดกลับมาตำแหน่งเป๊ะๆ ของหมุด a
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบลำดับคีย์ Vim...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasMark = lines.some(l => l === 'ma');
      const hasJump = lines.some(l => l === '`a');

      if (!hasMark) throw new Error("ไม่พบคำสั่งปักหมุด a\nตัวอย่าง: พิมพ์ ma ใน Normal mode");
      if (!hasJump) throw new Error("ไม่พบคำสั่งกระโดดกลับไปหมุด a\nตัวอย่าง: พิมพ์ `a (backtick ตามด้วย a)");
      log("✓ ใช้ ma แล้ว `a ถูกต้อง");
    },
    hint: "ปักหมุดใช้ m ตามด้วยชื่อหมุด (ตัวอักษรใดก็ได้) ส่วนกระโดดกลับไปตำแหน่งเป๊ะของหมุดนั้นใช้เครื่องหมาย backtick ตามด้วยชื่อหมุดเดียวกัน",
    solution: `ma
\`a`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Vim Marks: ปักหมุดตำแหน่งแล้วกระโดดกลับมาแม่นยำ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ตัวอักษร<strong>เล็ก</strong> (a-z) — หมุด local ใช้ได้แค่ในไฟล์ปัจจุบัน ส่วนตัวอักษร<strong>ใหญ่</strong> (A-Z) — หมุด global ใช้ข้ามไฟล์ได้<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>ma</code>  # ปักหมุด a<br/>
    <code>\`a</code>  # กระโดดกลับไปตำแหน่งเป๊ะ<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>\`a</code> (backtick) กระโดดไปตำแหน่ง<strong>เป๊ะ</strong>ทั้งบรรทัดและคอลัมน์ ส่วน <code>'a</code> (single quote) กระโดดไปแค่<strong>ต้นบรรทัด</strong>ของหมุด a เท่านั้น (ไม่สนใจคอลัมน์) — สับสนสอง symbol นี้บ่อยเพราะหน้าตาคล้ายกันมาก`,
    example: `# กระโดดกลับไปตำแหน่งก่อนหน้า jump ล่าสุด (ไม่ต้องปักหมุดเองล่วงหน้า)
\`\``,
    task: `จงปักหมุดตำแหน่งปัจจุบันชื่อ <code>a</code> ด้วย <code>ma</code> แล้วกระโดดกลับไปตำแหน่งเป๊ะของหมุดนั้นด้วย <code>\`a</code>`
  },
  {
    id: "unix_background_jobs",
    meta: "ขั้นสูง 12",
    title: "Unix Background Jobs: รัน Process เบื้องหลังโดยไม่ค้าง Terminal",
    template: `# สถานการณ์: รัน npm start (dev server) ซึ่งค้าง terminal ไว้ตลอดเวลาที่รัน อยากส่งไปรันเบื้องหลังแทนเพื่อใช้เทอร์มินัลเดิมพิมพ์คำสั่งอื่นต่อ แล้วอยากให้ process รอดแม้ปิด terminal
# 1. รัน npm start แบบส่งไปทำงานเบื้องหลังทันที
# WRITE YOUR CODE HERE


# 2. ดูรายการ background job ทั้งหมดของ terminal นี้


# 3. ถอด job ล่าสุดออกจากการดูแลของ shell เพื่อให้รอดแม้ปิด terminal
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ background job...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasBg = lines.some(l => l === 'npm start &');
      const hasJobs = lines.some(l => l === 'jobs');
      const hasDisown = lines.some(l => l === 'disown');

      if (!hasBg) throw new Error("ไม่พบคำสั่ง npm start &\nตัวอย่าง: npm start &");
      if (!hasJobs) throw new Error("ไม่พบคำสั่ง jobs\nตัวอย่าง: jobs");
      if (!hasDisown) throw new Error("ไม่พบคำสั่ง disown\nตัวอย่าง: disown");
      log("✓ ใช้ npm start &, jobs, disown ถูกต้อง");
    },
    hint: "เติม & ท้ายคำสั่งเพื่อส่งไปรันเบื้องหลังทันที คำสั่งดูรายการ background job ของ shell ปัจจุบันมีชื่อตรงตัว ส่วนคำสั่งถอด job ออกจากการดูแลของ shell ก็มีชื่อตรงตัวเช่นกัน",
    solution: `npm start &
jobs
disown`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix Background Jobs: รัน Process เบื้องหลังโดยไม่ค้าง Terminal และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>เติม <code>&</code> ท้ายคำสั่งใดก็ตาม สั่งให้รันเบื้องหลัง (background) ทันที — คืน terminal ให้พิมพ์คำสั่งอื่นต่อได้เลยโดยไม่ต้องรอ process นั้นจบก่อน (จะโชว์เลข job และ PID กลับมาให้)<br/><br/>
    • <code>jobs</code> — แสดง background job ทั้งหมดของ shell session ปัจจุบัน<br/>
    • <code>fg %1</code> — ดึง job หมายเลข 1 กลับมาทำงานที่ foreground<br/>
    • <code>bg</code> — สั่ง job ที่ถูกหยุดชั่วคราว (เช่นกด Ctrl+Z) ให้กลับไปทำงานต่อที่ background<br/><br/>
    <strong>ข้อควรรู้:</strong> background job ปกติจะ<strong>โดนปิดตาม</strong> (ได้รับ signal SIGHUP) ทันทีที่ terminal ปิด — <code>disown</code> ถอด job ออกจากตารางงานที่ shell ดูแล ทำให้รอดต่อไปได้แม้ terminal จะปิดไปแล้ว หรือใช้ <code>nohup command &</code> ตั้งแต่ต้นเพื่อป้องกันไว้ล่วงหน้าแบบเดียวกัน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>npm start &</code><br/>
    <code>jobs</code><br/>
    <code>disown</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>disown</code> เฉยๆ (ไม่ใส่ argument) ถอดแค่ <strong>job ล่าสุดเท่านั้น</strong> — ถ้ามีหลาย background job พร้อมกัน ต้องระบุเลข job ต่อท้ายเจาะจง (เช่น <code>disown %2</code>) ไม่งั้น job อื่นที่ไม่ใช่ล่าสุดจะยังโดน SIGHUP ปิดตามเมื่อปิด terminal อยู่ดี`,
    example: `# nohup + redirect + background รวมในคำสั่งเดียว: รันแบบไม่ต้องพึ่ง terminal เลยตั้งแต่เริ่ม
nohup npm start > server.log 2>&1 &`,
    task: `จงรัน <code>npm start</code> แบบ background ด้วย <code>npm start &</code> แล้วดู job ด้วย <code>jobs</code> แล้วถอดออกจากการดูแลของ shell ด้วย <code>disown</code>`
  },
  {
    id: "unix_awk_full",
    meta: "ขั้นสูง 13",
    title: "Unix awk: กรองและดึงคอลัมน์จากไฟล์ CSV ด้วยเงื่อนไข",
    template: `# สถานการณ์: ไฟล์ sales.csv คั่นด้วย comma คอลัมน์ที่ 3 คือยอดขาย อยากพิมพ์เฉพาะชื่อ (คอลัมน์ที่ 1) ของแถวที่ยอดขายมากกว่า 1000
# 1. กรองแถวที่คอลัมน์ 3 มากกว่า 1000 แล้วพิมพ์เฉพาะคอลัมน์ 1 ออกมา
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง awk...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasAwk = /awk\s+-F\s*['"]?,['"]?\s+['"]\$3\s*>\s*1000\s*\{\s*print\s+\$1\s*\}['"]\s+sales\.csv\b/.test(activeCode);
      if (hasAwk) {
        log("✓ ใช้ awk -F',' '$3 > 1000 {print $1}' sales.csv ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง awk -F',' '$3 > 1000 {print $1}' sales.csv\nตัวอย่าง: awk -F',' '$3 > 1000 {print $1}' sales.csv");
      }
    },
    hint: "ต้องกำหนดตัวคั่นคอลัมน์เป็น comma ก่อน (flag -F) แล้วเขียนเงื่อนไขเทียบคอลัมน์ที่ 3 นำหน้า action ที่พิมพ์คอลัมน์ที่ 1 — เงื่อนไขที่วางไว้ก่อน {action} จะกรองว่าบรรทัดไหนถึงจะรัน action นั้น",
    solution: `awk -F',' '$3 > 1000 {print $1}' sales.csv`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix awk: กรองและดึงคอลัมน์จากไฟล์ CSV ด้วยเงื่อนไข และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>awk</code> ประมวลผลไฟล์ทีละบรรทัด แบ่งแต่ละบรรทัดเป็น "คอลัมน์" อัตโนมัติตามตัวคั่น (default เป็น whitespace, override ด้วย <code>-F'&lt;ตัวคั่น&gt;'</code> เช่น <code>-F','</code> สำหรับ CSV) แล้วเข้าถึงแต่ละคอลัมน์ผ่าน <code>$1</code>, <code>$2</code>, <code>$3</code> ...<br/><br/>
    รูปแบบเต็มคือ <code>'&lt;เงื่อนไข&gt; {action}'</code> — เงื่อนไขก่อน <code>{}</code> กรองว่าบรรทัดไหนจะรัน action นั้น (ถ้าไม่ใส่เงื่อนไขจะรันทุกบรรทัด):<br/><br/>
    <code>'$3 > 1000 {print $1}'</code> — เฉพาะบรรทัดที่คอลัมน์ 3 มากกว่า 1000 ค่อยพิมพ์คอลัมน์ 1 ออกมา — รวม "กรอง" (เหมือน grep) กับ "ดึงคอลัมน์" (เหมือน cut) ไว้ในเครื่องมือเดียว ไม่ต้องต่อ pipe หลายตัว<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>awk -F',' '$3 > 1000 {print $1}' sales.csv</code><br/>
    <code>awk -F',' '{sum += $3} END {print sum}' sales.csv</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าคอลัมน์ตัวเลขมี format แปลกๆ ปนอยู่ (เช่น <code>"1,000"</code> ที่มี comma คั่นหลักพัน หรือมีช่องว่างนำหน้า) awk จะเทียบเป็น<strong>ตัวเลขได้แค่ prefix ที่ตีความได้</strong> เท่านั้น ทำให้เปรียบเทียบผิดพลาดแบบเงียบๆ โดยไม่ error ให้เห็นเลย ต้องเช็คว่าข้อมูลสะอาดเป็นตัวเลขล้วนก่อนเสมอ`,
    example: `# รวมยอด (sum) ของคอลัมน์ 3 ทั้งไฟล์ แล้วพิมพ์ผลรวมครั้งเดียวตอนจบ (END block)
awk -F',' '{sum += $3} END {print sum}' sales.csv`,
    task: `จงพิมพ์ชื่อ (คอลัมน์ 1) ของแถวที่ยอดขาย (คอลัมน์ 3) มากกว่า 1000 จากไฟล์ <code>sales.csv</code> ด้วย <code>awk -F',' '$3 > 1000 {print $1}' sales.csv</code>`
  },
  {
    id: "unix_rsync",
    meta: "ขั้นสูง 14",
    title: "Unix rsync: Sync ไฟล์ไปเซิร์ฟเวอร์แบบส่งแค่ส่วนที่เปลี่ยน",
    template: `# สถานการณ์: อยาก sync โฟลเดอร์ build output (dist/) ไปเซิร์ฟเวอร์ deploy ทุกครั้งที่ build ใหม่ โดยส่งแค่ไฟล์ที่เปลี่ยนแปลงจริง ไม่ต้อง copy ใหม่ทั้งหมดทุกครั้ง
# 1. sync โฟลเดอร์ dist/ ไปที่ user@server:/var/www/app/
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง rsync...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRsync = /rsync\s+-avz\s+dist\/\s+user@server:\/var\/www\/app\//.test(activeCode);
      if (hasRsync) {
        log("✓ ใช้ rsync -avz dist/ user@server:/var/www/app/ ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง rsync -avz dist/ user@server:/var/www/app/\nตัวอย่าง: rsync -avz dist/ user@server:/var/www/app/");
      }
    },
    hint: "รวม 3 flag ที่ใช้บ่อยที่สุด: archive mode (คงสิทธิ์/timestamp/symlink ไว้), verbose (แสดง progress), compress (บีบอัดระหว่างส่ง) แล้วตามด้วยโฟลเดอร์ต้นทาง (ใส่ / ท้ายด้วย) และปลายทางแบบ user@host:path",
    solution: `rsync -avz dist/ user@server:/var/www/app/`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix rsync: Sync ไฟล์ไปเซิร์ฟเวอร์แบบส่งแค่ส่วนที่เปลี่ยน และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Flag ที่ใช้บ่อย: <code>-a</code> (archive คงสิทธิ์/timestamp/symlink รวม recursive ในตัว), <code>-v</code> (verbose แสดงรายชื่อไฟล์ที่ส่ง), <code>-z</code> (compress ระหว่างส่ง)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>rsync -avz dist/ user@server:/var/www/app/</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <strong>เครื่องหมาย <code>/</code> ท้ายโฟลเดอร์ต้นทางสำคัญมาก</strong> — <code>dist/</code> (มี <code>/</code>) จะ sync แค่<strong>เนื้อหาข้างใน</strong> dist เข้าปลายทาง แต่ <code>dist</code> (ไม่มี <code>/</code>) จะ sync ทั้งโฟลเดอร์ dist ไปเป็น subfolder ซ้อนอีกชั้นที่ปลายทางแทน โครงสร้างไฟล์จะผิดทันทีถ้าพลาดตรงนี้`,
    example: `# เพิ่ม --delete ให้ปลายทางเหมือนต้นทางเป๊ะ (ลบไฟล์ที่ปลายทางที่ไม่มีในต้นทางด้วย — ใช้ระวังมาก)
rsync -avz --delete dist/ user@server:/var/www/app/`,
    task: `จง sync โฟลเดอร์ <code>dist/</code> ไปที่ <code>user@server:/var/www/app/</code> ด้วย <code>rsync -avz</code>`
  },
  {
    id: "unix_ssh_scp",
    meta: "ขั้นสูง 15",
    title: "Unix ssh/scp: เข้าเซิร์ฟเวอร์ระยะไกลและคัดลอกไฟล์ผ่าน SSH",
    template: `# สถานการณ์: ต้องเข้าไปดู log บนเซิร์ฟเวอร์ staging ตรงๆ ผ่าน SSH แล้วอยากคัดลอกไฟล์ log กลับมาที่เครื่องตัวเองเพื่อดูออฟไลน์
# 1. เปิด SSH session ไปที่เซิร์ฟเวอร์ staging.example.com ด้วย user 'deploy'
# WRITE YOUR CODE HERE


# 2. คัดลอกไฟล์ /var/log/app.log จากเซิร์ฟเวอร์นั้นมาไว้ที่เครื่องตัวเอง (โฟลเดอร์ปัจจุบัน)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง ssh/scp...");
      const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const hasSsh = lines.some(l => l === 'ssh deploy@staging.example.com');
      const hasScp = lines.some(l => l === 'scp deploy@staging.example.com:/var/log/app.log ./app.log');

      if (!hasSsh) throw new Error("ไม่พบคำสั่ง ssh deploy@staging.example.com\nตัวอย่าง: ssh deploy@staging.example.com");
      if (!hasScp) throw new Error("ไม่พบคำสั่ง scp deploy@staging.example.com:/var/log/app.log ./app.log\nตัวอย่าง: scp deploy@staging.example.com:/var/log/app.log ./app.log");
      log("✓ ใช้ ssh deploy@staging.example.com แล้ว scp ...:/var/log/app.log ./app.log ถูกต้อง");
    },
    hint: "ssh ต่อด้วย user@host ตรงๆ ส่วน scp มี syntax คล้าย cp แต่ path ฝั่งเซิร์ฟเวอร์ต้องมี user@host: นำหน้า path จริงบนเซิร์ฟเวอร์นั้น",
    solution: `ssh deploy@staging.example.com
scp deploy@staging.example.com:/var/log/app.log ./app.log`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix ssh/scp: เข้าเซิร์ฟเวอร์ระยะไกลและคัดลอกไฟล์ผ่าน SSH และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><code>ssh user@host</code> เปิด shell session บนเครื่องระยะไกล ยืนยันตัวตนด้วยรหัสผ่านหรือ SSH key pair (แนะนำ key-based: สร้างด้วย <code>ssh-keygen</code> เก็บ public key ไว้ที่ <code>~/.ssh/authorized_keys</code> บนเซิร์ฟเวอร์ ไม่ต้องพิมพ์รหัสผ่านทุกครั้ง)<br/><br/>
    <code>scp</code> (secure copy) คัดลอกไฟล์ผ่าน SSH protocol/auth เดียวกัน syntax คล้าย <code>cp</code> แต่ path ฝั่งเซิร์ฟเวอร์ต้องมี <code>user@host:</code> นำหน้า:<br/>
    • ดึงจากเซิร์ฟเวอร์มาเครื่องตัวเอง: <code>scp user@host:remote-path local-path</code><br/>
    • ส่งจากเครื่องตัวเองขึ้นเซิร์ฟเวอร์: <code>scp local-path user@host:remote-path</code> (สลับตำแหน่งต้นทาง/ปลายทาง)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>ssh deploy@staging.example.com</code><br/>
    <code>scp deploy@staging.example.com:/var/log/app.log ./app.log</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>scp</code> copy ได้แค่ไฟล์เดี่ยวเท่านั้นถ้าไม่ใส่ flag เพิ่ม — ถ้าต้องการ copy ทั้งโฟลเดอร์ต้องใส่ <code>-r</code> (recursive) เองเสมอเหมือน <code>cp</code> ไม่งั้นจะเจอ error <code>not a regular file</code> ทันที`,
    example: `# copy ทั้งโฟลเดอร์ขึ้นเซิร์ฟเวอร์แบบ recursive
scp -r ./dist deploy@staging.example.com:/var/www/app`,
    task: `จงเปิด SSH ไปที่ <code>deploy@staging.example.com</code> แล้วคัดลอก <code>/var/log/app.log</code> มาไว้ที่เครื่องตัวเองด้วย <code>scp</code>`
  },
  {
    id: "unix_cron",
    meta: "ขั้นสูง 16",
    title: "Unix Cron: ตั้งเวลารันสคริปต์อัตโนมัติ",
    template: `# สถานการณ์: อยากให้สคริปต์ /home/user/scripts/backup.sh รันอัตโนมัติทุกวันตอนตี 2 โดยไม่ต้องมีคนมานั่งรันเอง
# 1. เขียนบรรทัด crontab ที่ตั้งให้รัน backup.sh ทุกวันเวลา 02:00 น.
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบบรรทัด crontab...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasCron = /^0\s+2\s+\*\s+\*\s+\*\s+\/home\/user\/scripts\/backup\.sh\s*$/m.test(activeCode);
      if (hasCron) {
        log("✓ ใช้ 0 2 * * * /home/user/scripts/backup.sh ถูกต้อง");
      } else {
        throw new Error("ไม่พบบรรทัด crontab: 0 2 * * * /home/user/scripts/backup.sh\nตัวอย่าง: 0 2 * * * /home/user/scripts/backup.sh");
      }
    },
    hint: "crontab มี 5 ช่องเวลาเรียงกัน: นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์ ตามด้วยคำสั่งที่จะรัน ตอนตี 2 หมายถึงนาทีที่ 0 ชั่วโมงที่ 2 ส่วนอีก 3 ช่องที่เหลือใช้ * (ทุกค่า) เพราะอยากให้รันทุกวัน",
    solution: `0 2 * * * /home/user/scripts/backup.sh`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>cron</strong> รันงานตามเวลาที่ตั้งไว้อัตโนมัติ โดยไม่ต้องมีคนมานั่งรันเอง — แก้ตารางเวลาด้วย <code>crontab -e</code> (เปิดไฟล์ crontab ของ user ปัจจุบันด้วย editor ที่ตั้งไว้ใน <code>$EDITOR</code>)<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>แต่ละบรรทัดมี 5 ช่องเวลาเรียงกัน (<code>&lt;นาที&gt; &lt;ชั่วโมง&gt; &lt;วันที่&gt; &lt;เดือน&gt; &lt;วันในสัปดาห์&gt;</code>) ตามด้วยคำสั่งที่จะรัน — <code>crontab -l</code> ดูรายการ job ทั้งหมดที่ตั้งไว้<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>0 2 * * * /home/user/scripts/backup.sh</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> cron รันสคริปต์ด้วย<strong>environment ที่จำกัดมาก</strong> ไม่เหมือน interactive shell ปกติ (<code>PATH</code> สั้นกว่ามาก, ไม่มี alias/config ที่เคย source ไว้) — สคริปต์ที่รันได้ปกติเวลาพิมพ์เองอาจ fail เงียบๆ ใต้ cron เพราะหา command ไม่เจอ ควรใช้ path เต็มเสมอ (ไม่พึ่ง PATH) และ redirect output ไปไฟล์ log เพื่อ debug ได้`,
    example: `# รันทุก 15 นาที (*/N หมายถึง 'ทุกๆ N หน่วย' ของช่องนั้น)
*/15 * * * * /home/user/scripts/health-check.sh`,
    task: `จงเขียนบรรทัด crontab ที่รัน <code>/home/user/scripts/backup.sh</code> ทุกวันเวลา 02:00 น. ด้วย <code>0 2 * * * /home/user/scripts/backup.sh</code>`
  },
  {
    id: "unix_lsof_port",
    meta: "ขั้นสูง 17",
    title: "Unix lsof: หาว่า Process ไหนกำลังใช้ Port อยู่",
    template: `# สถานการณ์: พยายามรัน dev server ที่ port 3000 แต่เจอ error "port already in use" ต้องการหาว่า process ไหนกำลังใช้ port 3000 อยู่ก่อนจะไป kill ทิ้ง
# 1. หาว่า process ไหนกำลังใช้ port 3000 อยู่
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง lsof...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasLsof = /lsof\s+-i\s+:3000\b/.test(activeCode);
      if (hasLsof) {
        log("✓ ใช้ lsof -i :3000 ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง lsof -i :3000\nตัวอย่าง: lsof -i :3000");
      }
    },
    hint: "lsof (list open files) มี flag สำหรับกรองเฉพาะ network connection ตามด้วย : แล้วตามด้วยหมายเลข port ที่ต้องการเช็ค",
    solution: `lsof -i :3000`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Unix lsof: หาว่า Process ไหนกำลังใช้ Port อยู่ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใน Unix ทุกอย่างถูกมองเป็น "ไฟล์" รวมถึง network socket ด้วย — <code>lsof</code> (list open files) จึงใช้หาได้ว่า process ไหนกำลัง "เปิด" socket ของ port ไหนอยู่<br/><br/>
    <code>lsof -i :&lt;port&gt;</code> — กรองเฉพาะ network connection ที่ผูกกับ port นั้น แสดงคอลัมน์ <strong>PID</strong> ของ process ที่ถือ port นั้นอยู่ตรงๆ พร้อมชื่อ command — เร็วกว่าไล่ <code>ps aux | grep</code> เดามั่วๆ ว่า process ไหนคือตัวที่ใช้ port อยู่<br/><br/>
    หา PID ได้แล้วก็เอาไปต่อกับ <code>kill</code> (บทก่อนหน้า) ปิด process นั้นทิ้งได้ทันที<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>lsof -i :3000</code><br/>
    <code>kill -9 $(lsof -t -i :3000)</code>  # ฆ่าตรงๆ ในคำสั่งเดียว<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>lsof -i :3000</code> อาจโชว์<strong>หลายแถว</strong>ถ้ามีทั้ง IPv4 และ IPv6 socket ผูกกับ port เดียวกัน (หรือหลาย process ฟัง port เดียวกันจริงๆ ในบางกรณี) ต้องดู PID ให้ตรงตัวก่อน kill ไม่ใช่เดา kill ตัวแรกที่เห็นเสมอไป`,
    example: `# รวม lsof + kill ในคำสั่งเดียว: ฆ่า process ที่ถือ port 3000 อยู่ตรงๆ (-t = พิมพ์แค่ PID เปล่าๆ)
kill -9 $(lsof -t -i :3000)`,
    task: `จงหาว่า process ไหนกำลังใช้ port <code>3000</code> อยู่ด้วย <code>lsof -i :3000</code>`
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
