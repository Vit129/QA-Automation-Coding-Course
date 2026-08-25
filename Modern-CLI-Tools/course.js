(function() {
// Modern CLI Tools Interactive Coding Playground Data and Logic
// Covers modern, fast Rust-based and fuzzy CLI tools: zoxide (z), fd, ripgrep (rg), bat, eza, fzf, and jq.

const LESSONS = [
  {
    id: "modern_cli_setup",
    meta: "บทนำ",
    title: "ภาพรวมและคู่มือติดตั้ง Modern CLI Tools ในเครื่อง",
    template: `# อ่านคู่มือการติดตั้งและการตั้งค่า ~/.zshrc ในแถบเนื้อหาซ้ายมือ
# พิมพ์ 'ready' หรือคำสั่งติดตั้ง แล้วกดปุ่ม Run Tests เพื่อเริ่มต้นบทเรียน
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบความพร้อม...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const isReady = /(ready|brew install|ok|start)/i.test(activeCode);
      if (isReady) {
        log("✓ รับทราบขั้นตอนการติดตั้งและพร้อมเข้าสู่บทเรียนถัดไป");
      } else {
        throw new Error("ยังไม่ได้พิมพ์ 'ready' หรือคำสั่งติดตั้งเพื่อยืนยันว่าอ่านเนื้อหาแล้ว");
      }
    },
    hint: "พิมพ์คำว่า ready หรือ brew install zoxide fd fzf ripgrep bat eza jq ใน editor แล้วกด Run Tests ได้เลย",
    solution: `brew install zoxide fd fzf ripgrep bat eza jq`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจภาพรวมของ Modern CLI Tools และวิธีติดตั้ง/ตั้งค่าในเครื่องจริง<br/><br/>
    ⚖️ <strong>ตารางสรุปคำสั่งเดิม vs เครื่องมือใหม่:</strong><br/>
    • <code>cd</code> → <strong><code>z</code> (zoxide)</strong>: จำประวัติและกระโดดข้ามโฟลเดอร์ด้วย Frecency<br/>
    • <code>find</code> → <strong><code>fd</code></strong>: ค้นหาไฟล์เร็วกว่า 10 เท่า ข้าม .gitignore อัตโนมัติ<br/>
    • <code>grep</code> → <strong><code>rg</code> (ripgrep)</strong>: ค้นหาข้อความ/โค้ดในโปรเจกต์เสร็จในเสี้ยววินาที<br/>
    • <code>cat</code> → <strong><code>bat</code></strong>: อ่านไฟล์พร้อม Syntax Highlighting + เลขบรรทัด + Git diff<br/>
    • <code>ls</code> → <strong><code>eza</code></strong>: แสดงไฟล์สวยงาม มีไอคอน และบอกสถานะ Git<br/>
    • <em>(ไม่มี)</em> → <strong><code>fzf</code></strong>: Fuzzy Finder ค้นหาแบบ Interactive กรองสดได้ทุกอย่าง<br/>
    • <em>(เขียน script)</em> → <strong><code>jq</code></strong>: ตัวสกัดและตัดต่อ JSON Response จาก API<br/><br/>
    📦 <strong>วิธีติดตั้งในเครื่อง (Installation):</strong><br/>
    <code>brew install zoxide fd fzf ripgrep bat eza jq</code>  <em>(macOS Homebrew)</em><br/>
    <code>sudo apt install -y fd-find ripgrep bat fzf jq</code>  <em>(Ubuntu/Debian)</em><br/><br/>
    ⚙️ <strong>วิธีตั้งค่าใน <code>~/.zshrc</code>:</strong><br/>
    เปิดไฟล์ <code>nano ~/.zshrc</code> แล้วแปะโค้ดนี้ที่บรรทัดล่างสุด:<br/>
    <pre style="background:rgba(0,0,0,0.35);padding:12px;border-radius:6px;font-family:var(--font-mono);font-size:0.85rem;overflow-x:auto;color:#38bdf8;line-height:1.5;"># 1. zoxide
eval "$(zoxide init zsh)"

# 2. fzf keybindings
source &lt;(fzf --zsh 2&gt;/dev/null) || [ -f ~/.fzf.zsh ] &amp;&amp; source ~/.fzf.zsh

# 3. Aliases
alias ls='eza --icons --group-directories-first'
alias ll='eza -la --icons --git'
alias lt='eza --tree --level=2 --icons'
alias cat='bat --paging=never'
alias find='fd'
alias grep='rg'

# 4. Combo File Preview
fp() { fzf --preview 'bat --color=always {}'; }</pre><br/>
    จากนั้นสั่ง <code>source ~/.zshrc</code> ใน Terminal เพื่อใช้งานได้ทันที`,
    example: `# ติดตั้งทั้งหมดในคำสั่งเดียวผ่าน Homebrew
brew install zoxide fd fzf ripgrep bat eza jq`,
    task: `อ่านคู่มือการติดตั้งด้านซ้ายมือ แล้วพิมพ์ <code>ready</code> หรือคำสั่งติดตั้งเพื่อเข้าสู่บทเรียนถัดไป`
  },
  {
    id: "z_intro",
    meta: "บทที่ 1",
    title: "zoxide (z): กระโดดข้ามโฟลเดอร์ลึกๆ ด้วย Frecency",
    template: `# สถานการณ์: ต้องการกระโดดไปยังโฟลเดอร์โปรเจกต์ 'QA-Automation-Coding-Course' ที่เคยเข้ามาก่อน ด้วยคีย์เวิร์ดสั้นๆ
# 1. ใช้คำสั่ง z กระโดดไปยังโฟลเดอร์ดังกล่าวด้วยคำค้นสั้นๆ 'qa'
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง z...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasZ = /\bz\s+qa\b/i.test(activeCode);
      if (hasZ) {
        log("✓ ใช้ z qa ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง z qa เพื่อกระโดดไปยังโฟลเดอร์เป้าหมาย");
      }
    },
    hint: "พิมพ์ z ตามด้วยชื่อย่อหรือบางส่วนของโฟลเดอร์ เช่น z qa ไม่ต้องพิมพ์ full path",
    solution: `z qa`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการทำงานของ <strong>z (zoxide)</strong> เครื่องมือช่วยนำทางที่ฉลาดกว่า <code>cd</code> ดั้งเดิม<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>
    • <strong>Frecency Algorithm:</strong> คำนวณจาก <em>Frequency</em> (ความถี่ที่เข้า) + <em>Recency</em> (ความล่าสุดที่เข้า) ทำให้เดาใจโฟลเดอร์ที่เราต้องการไปได้แม่นยำ<br/>
    • ยิ่งใช้งาน Terminal มากเท่าไหร่ zoxide จะยิ่งเรียนรู้เส้นทางที่เราใช้บ่อย<br/>
    • แทนที่จะต้องพิมพ์ <code>cd ../../../Git/Personal/QA-Automation-Coding-Course</code> แค่พิมพ์ <code>z qa</code> ก็กระโดดไปถึงทันที<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>z &lt;keyword&gt;</code>  # กระโดดไปโฟลเดอร์ที่ match กับ keyword ที่สุด<br/>
    <code>z -</code>  # กลับไปยังโฟลเดอร์ก่อนหน้า (เหมือน cd -)<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>z</code> จะกระโดดไปได้เฉพาะโฟลเดอร์ที่<strong>เคยเข้าอย่างน้อยหนึ่งครั้ง</strong>หลังจากติดตั้ง zoxide แล้วเท่านั้น (ถ้าเพิ่งติดตั้งใหม่ต้องเคย <code>cd</code> เข้าไปก่อนเพื่อให้มันเริ่มจำ)`,
    example: `# กระโดดไปโฟลเดอร์ playwright-tests
z playwright`,
    task: `จงกระโดดไปยังโฟลเดอร์ที่มีคำว่า <code>qa</code> ด้วยคำสั่ง <code>z qa</code>`
  },
  {
    id: "z_interactive",
    meta: "บทที่ 2",
    title: "zoxide zi: ค้นหาและเลือกโฟลเดอร์แบบ Interactive",
    template: `# สถานการณ์: มีโฟลเดอร์โปรเจกต์หลายแห่งที่มีชื่อคล้ายกัน ต้องการเปิดเมนู Interactive (ผ่าน fzf) ขึ้นมาให้กดเลือกปลายทาง
# 1. ใช้คำสั่ง zoxide แบบ interactive selection
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง zi...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasZi = /\bzi\b/.test(activeCode);
      if (hasZi) {
        log("✓ ใช้ zi ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง zi สำหรับเปิด interactive selection");
      }
    },
    hint: "zoxide มีคำสั่งย่อตัวเดียวที่รวมตัว i (interactive) เข้ากับ z นั่นคือ zi",
    solution: `zi`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <strong>zi</strong> (Interactive Mode) เมื่อมีโฟลเดอร์เป้าหมายหลายแห่งที่มีชื่อซ้ำหรือใกล้เคียงกัน<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>
    • เมื่อพิมพ์ <code>zi</code> ระบบจะดึงประวัติโฟลเดอร์ทั้งหมดขึ้นมาแสดงผลร่วมกับ <code>fzf</code> (Fuzzy Finder)<br/>
    • สามารถพิมพ์ตัวอักษรเพื่อกรองผลลัพธ์แบบ real-time และใช้ลูกศรขึ้น/ลงเลือกโฟลเดอร์แล้วกด <code>Enter</code> เพื่อกระโดดไปทันที<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>zi</code><br/>
    <code>zi test</code>  # เปิด interactive mode พร้อมตั้งต้นคำค้นหาว่า test<br/><br/>
    🚨 <strong>ข้อควรระวัง:</strong> <code>zi</code> ต้องทำงานร่วมกับ <code>fzf</code> (ถ้าเครื่องไม่ได้ติดตั้ง fzf คำสั่ง zi จะแจ้งเตือนให้ติดตั้งก่อน)`,
    example: `# ค้นหาแบบเลือกเองในหมวดหมู่ api
zi api`,
    task: `จงเปิดโหมดค้นหาโฟลเดอร์แบบ Interactive ด้วยคำสั่ง <code>zi</code>`
  },
  {
    id: "fd_basic",
    meta: "บทที่ 3",
    title: "fd: ค้นหาไฟล์ความเร็วสูงและ Syntax จำง่าย",
    template: `# สถานการณ์: ต้องการค้นหาไฟล์ทั้งหมดในโปรเจกต์ที่มีคำว่า 'login' อยู่ในชื่อไฟล์
# 1. ใช้คำสั่ง fd ค้นหาไฟล์ที่มีคำว่า login
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง fd...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFd = /\bfd\s+login\b/.test(activeCode);
      if (hasFd) {
        log("✓ ใช้ fd login ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง fd login");
      }
    },
    hint: "fd ใช้งานง่ายมาก เพียงพิมพ์ fd ตามด้วยคำที่ต้องการค้นหา เช่น fd login",
    solution: `fd login`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <strong>fd</strong> เครื่องมือค้นหาไฟล์ยุคใหม่ที่เขียนด้วย Rust<br/><br/>
    ⚖️ <strong>เปรียบเทียบ fd vs find:</strong><br/>
    • <code>find . -iname "*login*"</code> (Unix ดั้งเดิม: ยาว, จำยาก, ช้าเพราะค้นทุกอย่างรวมถึง node_modules)<br/>
    • <code>fd login</code> (fd ยุคใหม่: สั้น, เร็วกว่า 10 เท่า, ข้าม <code>.gitignore</code> และไฟล์ซ่อนให้อัตโนมัติ)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>fd &lt;search_pattern&gt;</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> โดยค่าเริ่มต้น fd จะไม่ค้นหาในโฟลเดอร์ที่อยู่ใน <code>.gitignore</code> หรือโฟลเดอร์ซ่อน (เช่น <code>.git/</code>) หากต้องการค้นหารวมไฟล์เหล่านั้นด้วย ต้องใส่ flag เพิ่มเติม`,
    example: `# ค้นหาไฟล์ที่มีคำว่า config
fd config`,
    task: `จงค้นหาไฟล์ที่มีคำว่า <code>login</code> ด้วยคำสั่ง <code>fd login</code>`
  },
  {
    id: "fd_extension",
    meta: "บทที่ 4",
    title: "fd -e: กรองค้นหาเฉพาะนามสกุลไฟล์ที่ต้องการ",
    template: `# สถานการณ์: ต้องการค้นหาเฉพาะไฟล์สคริปต์เทสที่มีนามสกุล .spec.ts
# 1. ใช้คำสั่ง fd กรองเฉพาะไฟล์นามสกุล spec.ts
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง fd -e...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFdExt = /\bfd\s+-e\s+spec\.ts\b/.test(activeCode);
      if (hasFdExt) {
        log("✓ ใช้ fd -e spec.ts ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง fd -e spec.ts");
      }
    },
    hint: "ใช้ flag -e (extension) ตามด้วยนามสกุล เช่น fd -e spec.ts (ไม่ต้องใส่จุดนำหน้า)",
    solution: `fd -e spec.ts`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> รู้วิธีกรองค้นหาไฟล์ตามประเภท/นามสกุลด้วย flag <code>-e</code><br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ:</strong><br/>
    • Flag <code>-e</code> หรือ <code>--extension</code> ช่วยให้ค้นหาเฉพาะไฟล์ชนิดนั้นๆ ในโปรเจกต์ได้อย่างแม่นยำ<br/>
    • สามารถใส่คีย์เวิร์ดร่วมกับนามสกุลได้ เช่น <code>fd user -e ts</code> (หาไฟล์ที่มีคำว่า user และลงท้ายด้วย .ts)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>fd -e &lt;ext&gt;</code><br/>
    <code>fd &lt;pattern&gt; -e &lt;ext&gt;</code><br/><br/>
    🚨 <strong>ข้อควรระวัง:</strong> ใน flag <code>-e</code> ไม่ต้องพิมพ์จุด <code>.</code> นำหน้า เช่น <code>-e js</code> หรือ <code>-e spec.ts</code>`,
    example: `# ค้นหาไฟล์ JSON ทั้งหมดในโปรเจกต์
fd -e json`,
    task: `จงค้นหาไฟล์นามสกุล <code>spec.ts</code> ทั้งหมดด้วยคำสั่ง <code>fd -e spec.ts</code>`
  },
  {
    id: "fd_type_directory",
    meta: "บทที่ 5",
    title: "fd -t: กรองค้นหาเฉพาะโฟลเดอร์หรือไฟล์",
    template: `# สถานการณ์: ต้องการค้นหาเฉพาะโฟลเดอร์ (Directory) ที่ชื่อมีคำว่า 'test'
# 1. ใช้คำสั่ง fd ค้นหาเฉพาะประเภท directory ที่มีชื่อว่า test
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง fd -t d...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFdType = /\bfd\s+(-t\s+d\s+test|test\s+-t\s+d)\b/.test(activeCode);
      if (hasFdType) {
        log("✓ ใช้ fd -t d test ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง fd -t d test");
      }
    },
    hint: "ใช้ flag -t (type) ตามด้วย d (directory) เช่น fd -t d test",
    solution: `fd -t d test`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการแยกประเภทผลลัพธ์ด้วย <code>-t</code> (Type)<br/><br/>
    ⚖️ <strong>ตัวเลือก Type ที่พบบ่อย:</strong><br/>
    • <code>-t f</code> (file) : กรองเฉพาะไฟล์ทั่วไป<br/>
    • <code>-t d</code> (directory) : กรองเฉพาะโฟลเดอร์<br/>
    • <code>-t l</code> (symlink) : กรองเฉพาะ symbolic link<br/>
    • <code>-t x</code> (executable) : กรองเฉพาะไฟล์ที่มีสิทธิ์สั่งรัน (executable)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>fd -t d &lt;name&gt;</code><br/>
    <code>fd -t f &lt;name&gt;</code>`,
    example: `# ค้นหาโฟลเดอร์ที่ชื่อว่า helpers
fd -t d helpers`,
    task: `จงค้นหาโฟลเดอร์ที่มีชื่อว่า <code>test</code> ด้วย <code>fd -t d test</code>`
  },
  {
    id: "fd_hidden_ignore",
    meta: "บทที่ 6",
    title: "fd -H: ค้นหาไฟล์ซ่อน (Hidden Files) และ Config",
    template: `# สถานการณ์: ต้องการค้นหาไฟล์คอนฟิกที่ขึ้นต้นด้วยจุด เช่น .env ซึ่งปกติถูกซ่อนไว้
# 1. ใช้คำสั่ง fd พร้อม flag ค้นหาไฟล์ซ่อนเพื่อหา .env
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง fd -H...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFdH = /\bfd\s+-H\s+\.env\b/.test(activeCode);
      if (hasFdH) {
        log("✓ ใช้ fd -H .env ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง fd -H .env");
      }
    },
    hint: "ใช้ flag -H (Hidden) เพื่อสั่งให้ค้นหาไฟล์ที่ขึ้นต้นด้วย . เช่น fd -H .env",
    solution: `fd -H .env`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการเปิดโหมดค้นหาไฟล์ซ่อนและไฟล์ใน <code>.gitignore</code><br/><br/>
    ⚖️ <strong>Flags สำคัญ:</strong><br/>
    • <code>-H</code> (<code>--hidden</code>): ค้นหาไฟล์ซ่อน (ไฟล์ที่ขึ้นต้นด้วย dot <code>.</code> เช่น <code>.env</code>, <code>.eslintrc</code>)<br/>
    • <code>-I</code> (<code>--no-ignore</code>): ไม่ต้องสนใจกฎใน <code>.gitignore</code> (ค้นหาใน build output หรือ node_modules ด้วย)<br/>
    • <code>-u</code> (<code>--unrestricted</code>): รวมทั้ง <code>-H</code> และ <code>-I</code> (ค้นหาทุกอย่างแบบไม่จำกัด)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>fd -H .env</code><br/>
    <code>fd -u secret</code>`,
    example: `# ค้นหาไฟล์ .githooks ทั้งหมด
fd -H githooks`,
    task: `จงค้นหาไฟล์ซ่อน <code>.env</code> ด้วยคำสั่ง <code>fd -H .env</code>`
  },
  {
    id: "fd_exec",
    meta: "บทที่ 7",
    title: "fd -x: ค้นหาพร้อมสั่งรันคำสั่งอื่นต่อเนื่อง (Execute)",
    template: `# สถานการณ์: ต้องการค้นหาไฟล์ชั่วคราวนามสกุล .tmp ทั้งหมดแล้วลบทิ้งทันทีในคำสั่งเดียว
# 1. ใช้คำสั่ง fd กรองนามสกุล tmp แล้วสั่งรัน rm {} ผ่าน flag -x
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง fd -x...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasFdExec = /\bfd\s+-e\s+tmp\s+-x\s+rm\s+\{\}/.test(activeCode);
      if (hasFdExec) {
        log("✓ ใช้ fd -e tmp -x rm {} ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง fd -e tmp -x rm {}");
      }
    },
    hint: "ใช้ fd -e tmp ตามด้วย -x rm {}",
    solution: `fd -e tmp -x rm {}`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <code>-x</code> (Execute) ในการรันคำสั่งต่อจากผลลัพธ์ที่ค้นพบแบบขนาน<br/><br/>
    ⚖️ <strong>หลักการทำงาน:</strong><br/>
    • <code>-x &lt;cmd&gt; {}</code> จะรันคำสั่ง <code>cmd</code> กับทุกไฟล์ที่พบ โดยแทนที่ <code>{}</code> ด้วย path ของไฟล์นั้น<br/>
    • ทำงานแบบ Parallel (มัลติเธรด) อัตโนมัติ เร็วกว่า <code>find ... -exec</code> หรือ xargs หลายเท่า<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>fd -e tmp -x rm {}</code><br/>
    <code>fd -e jpg -x convert {} {.}.png</code>  # แปลงรูปภาพทั้งหมด<br/><br/>
    🚨 <strong>ข้อควรระวัง:</strong> คำสั่งที่ส่งให้ <code>-x</code> ทำงานจริงกับไฟล์ ควรทดสอบรัน <code>fd</code> ดูรายชื่อไฟล์ก่อนเสมอเพื่อความปลอดภัย`,
    example: `# บีบอัดไฟล์ log ทุกไฟล์
fd -e log -x gzip {}`,
    task: `จงสั่งค้นหาไฟล์ <code>.tmp</code> ทั้งหมดแล้วลบด้วยคำสั่ง <code>fd -e tmp -x rm {}</code>`
  },
  {
    id: "rg_basic",
    meta: "บทที่ 8",
    title: "ripgrep (rg): ค้นหาข้อความในโค้ดทั้งโปรเจกต์แบบเร็วที่สุด",
    template: `# สถานการณ์: ต้องการค้นหาว่ามีไฟล์ไหนในโปรเจกต์ที่เรียกใช้ฟังก์ชัน authenticateUser บ้าง
# 1. ใช้คำสั่ง rg ค้นหาข้อความ 'authenticateUser'
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง rg...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRg = /\brg\s+['"]?authenticateUser['"]?\b/.test(activeCode);
      if (hasRg) {
        log("✓ ใช้ rg authenticateUser ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง rg authenticateUser");
      }
    },
    hint: "พิมพ์ rg ตามด้วยคำที่ต้องการค้นหา เช่น rg authenticateUser",
    solution: `rg authenticateUser`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <strong>ripgrep (rg)</strong> เครื่องมือค้นหา Text/Code ในโปรเจกต์ที่เร็วที่สุดในปัจจุบัน<br/><br/>
    ⚖️ <strong>ทำไม ripgrep ถึงชนะ grep?:</strong><br/>
    • ละเว้นไฟล์ใน <code>.gitignore</code>, binary files, และไฟล์ซ่อนให้อัตโนมัติ<br/>
    • ประมวลผลแบบ Multi-threaded ทำให้ค้นหาโค้ดล้านบรรทัดเสร็จในเสี้ยววินาที<br/>
    • ไฮไลต์สีและบอกหมายเลขบรรทัดให้อ่านง่ายโดยไม่ต้องใส่ flag เพิ่ม<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>rg &lt;pattern&gt;</code><br/>
    <code>rg "const apiKey"</code>`,
    example: `# ค้นหาคำว่า TODO ในทุกไฟล์
rg "TODO"`,
    task: `จงค้นหาข้อความ <code>authenticateUser</code> ด้วยคำสั่ง <code>rg authenticateUser</code>`
  },
  {
    id: "rg_type_and_case",
    meta: "บทที่ 9",
    title: "ripgrep (rg): กรองประเภทไฟล์ (-t) และไม่สนใจ Case (-i)",
    template: `# สถานการณ์: ต้องการค้นหาคำว่า "timeout_error" โดยไม่สนใจตัวพิมพ์เล็ก-ใหญ่ และหาเฉพาะในไฟล์ประเภท javascript
# 1. ใช้คำสั่ง rg พร้อม flag -i และ -t js
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง rg -i -t js...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasRgFlags = /\brg\s+(-i\s+-t\s+js|-t\s+js\s+-i)\s+['"]?timeout_error['"]?\b/.test(activeCode);
      if (hasRgFlags) {
        log("✓ ใช้ rg -i -t js timeout_error ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง rg -i -t js timeout_error");
      }
    },
    hint: "ใช้ flag -i สำหรับ ignore case และ -t js สำหรับกรองไฟล์ js เช่น rg -i -t js timeout_error",
    solution: `rg -i -t js timeout_error`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> กรองผลลัพธ์การค้นหาข้อความให้กระชับและตรงจุดด้วย Flags สำคัญของ ripgrep<br/><br/>
    ⚖️ <strong>Flags ที่ใช้บ่อย:</strong><br/>
    • <code>-i</code> (<code>--ignore-case</code>): ไม่สนใจตัวพิมพ์เล็ก-ใหญ่ (เช่น Timeout, TIMEOUT, timeout)<br/>
    • <code>-t &lt;type&gt;</code>: ค้นหาเฉพาะประเภทไฟล์ที่ระบุ (เช่น <code>-t js</code>, <code>-t ts</code>, <code>-t py</code>, <code>-t json</code>)<br/>
    • <code>-l</code> (<code>--files-with-matches</code>): แสดงเฉพาะชื่อไฟล์ที่พบ ไม่แสดงเนื้อหาบรรทัด<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>rg -i -t js &lt;pattern&gt;</code><br/>
    <code>rg -l &lt;pattern&gt;</code>`,
    example: `# ค้นหาคำว่า endpoint ในไฟล์ python แบบ case-insensitive
rg -i -t py endpoint`,
    task: `จงค้นหาคำว่า <code>timeout_error</code> แบบไม่สนใจตัวพิมพ์ ในไฟล์ javascript ด้วย <code>rg -i -t js timeout_error</code>`
  },
  {
    id: "bat_syntax_highlight",
    meta: "บทที่ 10",
    title: "bat: แสดงเนื้อหาไฟล์พร้อม Syntax Highlighting และเลขบรรทัด",
    template: `# สถานการณ์: ต้องการเปิดอ่านไฟล์ package.json ใน Terminal แบบมีเลขบรรทัดและไฮไลต์สีสวยงาม
# 1. ใช้คำสั่ง bat เปิดดูเนื้อหาของ package.json
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง bat...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasBat = /\bbat\s+package\.json\b/.test(activeCode);
      if (hasBat) {
        log("✓ ใช้ bat package.json ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง bat package.json");
      }
    },
    hint: "พิมพ์ bat ตามด้วยชื่อไฟล์ เช่น bat package.json",
    solution: `bat package.json`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <strong>bat</strong> ซึ่งเป็นเครื่องมือแสดงเนื้อหาไฟล์ที่มาแทนที่ <code>cat</code><br/><br/>
    ⚖️ <strong>จุดเด่นของ bat:</strong><br/>
    • <strong>Syntax Highlighting:</strong> ไฮไลต์สีตามภาษาของโค้ดโดยอัตโนมัติ (รองรับ JS, TS, Python, JSON, YAML ฯลฯ)<br/>
    • <strong>Git Integration:</strong> มีแถบสีบอกการเปลี่ยนแปลง (Added, Modified, Removed) เทียบกับ Git HEAD ให้เห็นข้างเลขบรรทัด<br/>
    • <strong>Line Numbers:</strong> แสดงเลขบรรทัดให้อ่านง่าย เหมาะกับการรีวิวโค้ดหรือสคริปต์สั้นๆ ใน Terminal<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>bat &lt;file&gt;</code><br/><br/>
    🚨 <strong>ทริค:</strong> หากต้องการใช้ bat ในสคริปต์แบบไม่ต้องการ pager (ไม่ต้องกด q ออก) ให้ใส่ flag <code>--paging=never</code>`,
    example: `# ดูเนื้อหาไฟล์ config
bat tsconfig.json`,
    task: `จงเปิดดูไฟล์ <code>package.json</code> ด้วยคำสั่ง <code>bat package.json</code>`
  },
  {
    id: "bat_line_range",
    meta: "บทที่ 11",
    title: "bat -r: แสดงเฉพาะช่วงบรรทัดที่ต้องการดู",
    template: `# สถานการณ์: ไฟล์ log มีขนาดยาวมาก ต้องการเปิดดูเฉพาะบรรทัดที่ 50 ถึง 80 เท่านั้น
# 1. ใช้คำสั่ง bat กำหนดช่วงบรรทัด 50:80 ของไฟล์ test.log
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง bat -r...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasBatRange = /\bbat\s+-r\s+50:80\s+test\.log\b/.test(activeCode);
      if (hasBatRange) {
        log("✓ ใช้ bat -r 50:80 test.log ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง bat -r 50:80 test.log");
      }
    },
    hint: "ใช้ flag -r (line range) ตามด้วย จุดเริ่ม:จุดจบ เช่น bat -r 50:80 test.log",
    solution: `bat -r 50:80 test.log`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> รู้วิธีตัดดูเฉพาะส่วนของไฟล์ขนาดใหญ่ด้วย <code>-r</code> (Range)<br/><br/>
    ⚖️ <strong>Syntax ของ Range:</strong><br/>
    • <code>-r 50:80</code> : แสดงบรรทัดที่ 50 ถึง 80<br/>
    • <code>-r :30</code> : แสดงตั้งแต่ต้นไฟล์จนถึงบรรทัดที่ 30 (เหมือน head)<br/>
    • <code>-r 100:</code> : แสดงตั้งแต่บรรทัดที่ 100 ไปจนจบไฟล์<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>bat -r &lt;start&gt;:&lt;end&gt; &lt;file&gt;</code>`,
    example: `# ดู 20 บรรทัดแรกของไฟล์
bat -r :20 report.txt`,
    task: `จงแสดงเฉพาะบรรทัดที่ 50 ถึง 80 ของไฟล์ <code>test.log</code> ด้วย <code>bat -r 50:80 test.log</code>`
  },
  {
    id: "eza_git_status",
    meta: "บทที่ 12",
    title: "eza: แสดงรายชื่อไฟล์พร้อมรายละเอียดและสถานะ Git",
    template: `# สถานการณ์: ต้องการดูรายชื่อไฟล์ทั้งหมดรวมไฟล์ซ่อน แบบละเอียด และแสดงสถานะ Git ของแต่ละไฟล์
# 1. ใช้คำสั่ง eza พร้อม flag แสดงไฟล์ทั้งหมด, รายละเอียดแบบยาว และสถานะ Git
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง eza -la --git...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasEza = /\beza\s+(-la\s+--git|-al\s+--git|-a\s+-l\s+--git|-l\s+-a\s+--git)\b/.test(activeCode);
      if (hasEza) {
        log("✓ ใช้ eza -la --git ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง eza -la --git");
      }
    },
    hint: "ใช้คำสั่ง eza ตามด้วย flag -la และ --git",
    solution: `eza -la --git`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้งาน <strong>eza</strong> (ตัวแทนสมัยใหม่ของ <code>ls</code>)<br/><br/>
    ⚖️ <strong>สิ่งที่เหนือกว่า ls ดั้งเดิม:</strong><br/>
    • จัดประเภทสีของไฟล์และสิทธิ์ (Permissions) ให้อ่านง่าย ไม่ตาลาย<br/>
    • แสดงสถานะ Git (เช่น <code>M</code> = Modified, <code>N</code> = New untracked, <code>I</code> = Ignored) ในแต่ละบรรทัดเมื่อใส่ <code>--git</code><br/>
    • รองรับไอคอนไฟล์ (Icons) และการจัดเรียงโฟลเดอร์ไว้ด้านบนอัตโนมัติ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>eza -la --git</code>`,
    example: `# แสดงเฉพาะไฟล์พร้อมไอคอน
eza --icons`,
    task: `จงดูรายการไฟล์แบบละเอียดรวมไฟล์ซ่อนและสถานะ Git ด้วย <code>eza -la --git</code>`
  },
  {
    id: "eza_tree_view",
    meta: "บทที่ 13",
    title: "eza --tree: แสดงโครงสร้างไดเรกทอรีเป็นแผนผังต้นไม้",
    template: `# สถานการณ์: ต้องการดูโครงสร้างโฟลเดอร์และไฟล์ย่อยเป็นแผนผังต้นไม้ (Tree View) ลึกไม่เกิน 2 ชั้น
# 1. ใช้คำสั่ง eza พร้อม flag --tree และจำกัดความลึก --level=2
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง eza --tree...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasEzaTree = /\beza\s+--tree\s+--level=2\b/.test(activeCode);
      if (hasEzaTree) {
        log("✓ ใช้ eza --tree --level=2 ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง eza --tree --level=2");
      }
    },
    hint: "ใช้ flag --tree คู่กับ --level=2 เช่น eza --tree --level=2",
    solution: `eza --tree --level=2`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ใช้ <strong>eza</strong> สร้าง Tree View สวยงามโดยไม่ต้องลงโปรแกรม <code>tree</code> เพิ่มเติม<br/><br/>
    ⚖️ <strong>หลักการสำคัญ:</strong><br/>
    • <code>--tree</code>: สั่งให้แสดงผลลัพธ์เป็นกิ่งก้านสาขาของโฟลเดอร์<br/>
    • <code>--level=N</code>: กำหนดความลึกสูงสุดที่จะแสดงผล (ป้องกัน terminal ค้างถ้าโฟลเดอร์มีไฟล์ลึกเป็นพันๆ ชั้น)<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>eza --tree --level=2</code>`,
    example: `# ดูโครงสร้างโฟลเดอร์ src ลึก 3 ชั้น
eza --tree --level=3 src`,
    task: `จงแสดงโครงสร้างแผนผังต้นไม้ลึก 2 ชั้นด้วย <code>eza --tree --level=2</code>`
  },
  {
    id: "fzf_interactive",
    meta: "บทที่ 14",
    title: "fzf: ค้นหาไฟล์แบบ Fuzzy Finder และเปิดใน Editor",
    template: `# สถานการณ์: ต้องการค้นหาไฟล์ในโปรเจกต์แบบพิมพ์เดาคำ แล้วส่งชื่อไฟล์ที่เลือกไปเปิดใน vim ทันที
# 1. ใช้คำสั่ง vim ร่วมกับ Command Substitution ของ fzf
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง vim $(fzf)...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasVimFzf = /\bvim\s+\$\(fzf\)/.test(activeCode);
      if (hasVimFzf) {
        log("✓ ใช้ vim $(fzf) ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง vim $(fzf)");
      }
    },
    hint: "ใช้คำสั่ง vim ตามด้วย $(fzf) เพื่อนำผลลัพธ์ที่เลือกจาก fzf ไปเป็น argument ให้ vim",
    solution: `vim $(fzf)`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิด <strong>Fuzzy Search</strong> และการต่อยอด <code>fzf</code> ร่วมกับโปรแกรมอื่น<br/><br/>
    ⚖️ <strong>Fuzzy Finding คืออะไร?:</strong><br/>
    • การค้นหาโดยไม่ต้องพิมพ์ชื่อไฟล์ให้ถูกทุกตัวอักษร เช่น พิมพ์ <code>authspec</code> ก็ match กับ <code>src/tests/auth.spec.ts</code> ได้<br/>
    • สามารถรับ Input ผ่าน Pipe เช่น <code>cat list.txt | fzf</code> หรือทำงานเป็นตัวเลือกไฟล์แบบเดี่ยวๆ<br/>
    • <code>$(fzf)</code> คือ Command Substitution ใน Shell ซึ่งจะแทนที่ด้วย path ไฟล์ที่เรากดเลือก<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>vim $(fzf)</code><br/>
    <code>code $(fzf)</code>`,
    example: `# เลือกไฟล์เพื่อเปิดใน VS Code
code $(fzf)`,
    task: `จงเขียนคำสั่งเปิดไฟล์ใน vim ด้วยการเลือกผ่าน fzf ด้วย <code>vim $(fzf)</code>`
  },
  {
    id: "jq_field_extract",
    meta: "บทที่ 15",
    title: "jq: สกัดและดึงค่า Field จาก JSON Response",
    template: `# สถานการณ์: ยิง GET API ไปที่ https://api.example.com/user แล้วได้ JSON ตอบกลับ ต้องการดึงเฉพาะค่า field .data.email
# 1. ใช้ curl ยิงแบบ silent (-s) แล้ว pipe ต่อไปยัง jq เพื่อดึง field .data.email
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง curl + jq...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasJq = /\bcurl\s+-s\s+https:\/\/api\.example\.com\/user\s*\|\s*jq\s+['"]?\.data\.email['"]?/.test(activeCode);
      if (hasJq) {
        log("✓ ใช้ curl -s ... | jq '.data.email' ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง curl -s https://api.example.com/user | jq '.data.email'");
      }
    },
    hint: "ใช้ curl -s https://api.example.com/user | jq '.data.email'",
    solution: `curl -s https://api.example.com/user | jq '.data.email'`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจการใช้ <strong>jq</strong> เพื่อประมวลผลและดึงข้อมูล JSON บน Command Line<br/><br/>
    ⚖️ <strong>ทำไม QA ต้องใช้ jq?:</strong><br/>
    • ในงาน API Automation หรือ E2E Testing มักต้องยิง curl ดึง Token, User ID, หรือสถานะมาใช้งานต่อ<br/>
    • <code>.</code> หมายถึง root object, <code>.data.email</code> คือการเจาะเข้า property ซ้อนข้างใน<br/>
    • ใส่ <code>-r</code> (raw output) ถ้าต้องการตัดเครื่องหมายคำพูด (quotes) ออกไปใช้ใน shell variable<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>curl -s &lt;url&gt; | jq '.path.to.field'</code><br/>
    <code>cat data.json | jq -r '.token'</code>`,
    example: `# ดึง token ออกมาใช้งาน
curl -s https://api.example.com/login | jq -r '.token'`,
    task: `จงยิง curl ไปยัง URL ที่กำหนดแล้วสกัด <code>.data.email</code> ด้วย jq`
  },
  {
    id: "jq_array_filter",
    meta: "บทที่ 16",
    title: "jq select(): กรอง Array ข้อมูลผลการทดสอบที่ Fail",
    template: `# สถานการณ์: มีไฟล์ test-results.json ต้องการดึงเฉพาะ test item ใน array .tests[] ที่มี status เป็น "FAILED"
# 1. ใช้ cat อ่านไฟล์แล้ว pipe ให้ jq กรองเฉพาะ item ที่ status == "FAILED"
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง jq select()...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasJqFilter = /\bcat\s+test-results\.json\s*\|\s*jq\s+['"]?\.tests\[\]\s*\|\s*select\(\.status\s*==\s*['"]FAILED['"]\)/.test(activeCode);
      if (hasJqFilter) {
        log("✓ ใช้ cat test-results.json | jq '.tests[] | select(.status == \"FAILED\")' ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง cat test-results.json | jq '.tests[] | select(.status == \"FAILED\")'");
      }
    },
    hint: "ใช้คำสั่ง: cat test-results.json | jq '.tests[] | select(.status == \"FAILED\")'",
    solution: `cat test-results.json | jq '.tests[] | select(.status == "FAILED")'`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ใช้ฟังก์ชัน <code>select()</code> ของ <strong>jq</strong> เพื่อกรองเฉพาะข้อมูลตามเงื่อนไขที่ต้องการ<br/><br/>
    ⚖️ <strong>หลักการทำงาน:</strong><br/>
    • <code>.tests[]</code> กระจายสมาชิกแต่ละตัวใน Array ออกมาเป็นแถวข้อมูล<br/>
    • <code>select(&lt;condition&gt;)</code> กรองเฉพาะตัวที่ตรงกับเงื่อนไข เช่น <code>.status == "FAILED"</code> หรือ <code>.duration &gt; 5000</code><br/>
    • มีประโยชน์มหาศาลในการสรุปผล Test Report ใน CI/CD Pipeline<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>jq '.items[] | select(.key == "value")'</code>`,
    example: `# กรองเฉพาะเคสเทสที่ใช้เวลาเกิน 10 วินาที
cat report.json | jq '.tests[] | select(.duration > 10)'`,
    task: `จงกรองเฉพาะ test ใน <code>test-results.json</code> ที่ <code>status == "FAILED"</code> ด้วยคำสั่งที่กำหนด`
  },
  {
    id: "modern_cli_combo",
    meta: "ขั้นสูง",
    title: "Modern CLI Combo: ค้นหาไฟล์พร้อม Preview สดด้วย fzf + bat",
    template: `# สถานการณ์: ต้องการค้นหาไฟล์ด้วย fzf แบบมีหน้าต่าง Preview สดด้านข้างด้วยคำสั่ง bat
# 1. ใช้คำสั่ง fzf พร้อม flag --preview ให้รัน bat --color=always {}
# WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง fzf + bat combo...");
      const activeCode = code.split('\n').filter(l => !l.trim().startsWith('#')).join('\n');
      const hasCombo = /\bfzf\s+--preview\s+['"]bat\s+--color=always\s+\{\}['"]/.test(activeCode);
      if (hasCombo) {
        log("✓ ใช้ fzf --preview 'bat --color=always {}' ถูกต้อง");
      } else {
        throw new Error("ยังไม่พบคำสั่ง fzf --preview 'bat --color=always {}'");
      }
    },
    hint: "ใช้ fzf --preview ตามด้วย string คำสั่ง 'bat --color=always {}'",
    solution: `fzf --preview 'bat --color=always {}'`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ผสานพลัง <strong>fzf + bat</strong> เพื่อสร้างสุดยอด File Finder ประจำเครื่อง<br/><br/>
    ⚖️ <strong>หลักการทำงาน:</strong><br/>
    • <code>fzf --preview</code> จะเปิดหน้าต่างแบ่งครึ่งหน้าจอ (Split Preview Window)<br/>
    • ทุกครั้งที่เลื่อนแถบเลือกไฟล์ <code>fzf</code> จะส่งชื่อไฟล์ไปแทนที่ <code>{}</code> และรันคำสั่ง <code>bat --color=always</code> ให้เห็นโค้ดข้างในแบบทันที<br/>
    • ทำให้สามารถอ่านโค้ดในไฟล์ได้โดยไม่ต้องกดเปิดไฟล์เข้าไปดูเลย<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>
    <code>fzf --preview 'bat --color=always {}'</code>`,
    example: `# ตั้งเป็นฟังก์ชันหรือ alias ใน .zshrc
alias fp="fzf --preview 'bat --color=always {}'"`,
    task: `จงสร้างคำสั่งค้นหาไฟล์พร้อม preview ด้วย <code>fzf --preview 'bat --color=always {}'</code>`
  }
];

// Application state
const PREFIX = 'mcli';
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
    <div class="terminal-line info">[Shell] กำลังตรวจสอบคำสั่ง Modern CLI...</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Modern CLI Tools แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณเชี่ยวชาญเครื่องมือยุคใหม่ — zoxide, fd, ripgrep, bat, eza, fzf, และ jq เรียบร้อยแล้ว!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Modern CLI Tools for Developers & QA');
}

// Expose globals for single-page standalone and registry
window.PREFIX = PREFIX;
window.TAB_WIDTH = TAB_WIDTH;
window.LESSONS = LESSONS;
window.runSandboxCode = runSandboxCode;
window.showGraduationMessage = showGraduationMessage;
window.QA_TRACKS = window.QA_TRACKS || {};
window.QA_TRACKS['modern-cli-tools'] = { id: 'modern-cli-tools', title: 'Modern CLI Tools for Developers & QA', folder: 'Modern-CLI-Tools', lessons: LESSONS };
})();
