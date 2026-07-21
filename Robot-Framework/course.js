(function() {
// Robot Framework Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/kouen-terminal/Tests/ codebase.

// --- Validation helpers -----------------------------------------------
// These exist so validate() checks can't be satisfied by a commented-out
// line or by the expected text showing up inside an unrelated string
// (e.g. a Documentation value). A match only counts if it is the first
// token on a real (non-comment) line, optionally scoped to the RF
// section the lesson actually cares about.

// Extract the body of a "*** SectionName ***" block (up to the next
// "*** ... ***" header or end of string). Falls back to the full code
// if the header isn't found, so a missing header is still caught by the
// keyword-line check failing (never by silently widening scope).
function rfSection(code, sectionName) {
  const re = new RegExp('\\*\\*\\*\\s*' + sectionName + '\\s*\\*\\*\\*([\\s\\S]*?)(?=\\n\\*\\*\\*|$)', 'i');
  const m = code.match(re);
  return m ? m[1] : '';
}

// Strip leading indentation and drop blank/comment lines.
function rfRealLines(text) {
  return text.split('\n')
    .map(line => line.replace(/^[ \t]+/, ''))
    .filter(line => line.length > 0 && !line.startsWith('#'));
}

// True if `regex` matches starting at column 0 of some real (non-comment)
// line, optionally restricted to `sectionName`'s block.
function rfLineMatch(code, regex, sectionName) {
  const text = sectionName ? rfSection(code, sectionName) : code;
  return rfRealLines(text).some(line => {
    const m = line.match(regex);
    return !!m && m.index === 0;
  });
}

const LESSONS = [
  {
    id: "settings",
    meta: "บทที่ 1",
    title: "RF Settings Section",
    template: `*** Settings ***
Documentation     ชุดการทดสอบระบบวางแผนภาษี
# 1. ทำการดึง Resource จากไฟล์ '../resources/kouen.resource'
# WRITE YOUR CODE HERE


Test Setup        Launch Kouen
Test Teardown     Quit Kouen`,
    validate: (code, log) => {
      log("🔍 Parsing Settings section...");
      if (code.includes("Documentation")) {
        log("✓ Found Documentation directive");
      }
      
      // Match "Resource" followed by 2+ spaces or tabs, then the resource path
      // Anchored to a real (non-comment) line inside *** Settings *** so a
      // commented-out or documentation-embedded copy doesn't count.
      const checkResource = rfLineMatch(code, /Resource\s{2,}\.\.\/resources\/kouen\.resource/, "Settings") ||
                            rfLineMatch(code, /Resource\t+\.\.\/resources\/kouen\.resource/, "Settings");

      if (checkResource) {
        log("✓ ขั้นตอนที่ 1: ดึง Resource จากพิกัดที่กำหนดสำเร็จ");
      } else {
        throw new Error("ไม่พบการดึง Resource หรือพิมพ์แยกเว้นวรรคไม่ถูกต้อง\nหมายเหตุ: Robot Framework ใช้ช่องว่างอย่างน้อย 2 เคาะ (Double Spaces) หรือ 1 Tab ในการแยกคีย์เวิร์ด\nตัวอย่าง: Resource         ../resources/kouen.resource");
      }

      const checkSetupTeardown = (rfLineMatch(code, /Test Setup\s{2,}Launch Kouen/, "Settings") ||
                                  rfLineMatch(code, /Test Setup\t+Launch Kouen/, "Settings")) &&
                                  (rfLineMatch(code, /Test Teardown\s{2,}Quit Kouen/, "Settings") ||
                                  rfLineMatch(code, /Test Teardown\t+Quit Kouen/, "Settings"));

      if (checkSetupTeardown) {
        log("✓ ขั้นตอนที่ 2: ตั้งค่า Setup & Teardown สำเร็จ");
      } else {
        throw new Error("ห้ามแก้ไขตัวสคริปต์ setup/teardown ด้านล่าง");
      }
    },
    hint: "บล็อก *** Settings *** มีคำสั่งสำหรับนำเข้าไฟล์ resource ภายนอกอยู่ (ตามที่ task ระบุพิกัดไฟล์ไว้แล้ว) — สิ่งที่ต้องระวังคือการเว้นวรรคระหว่างชื่อคำสั่งกับพิกัดไฟล์ต้องอย่างน้อย 2 เคาะ หรือใช้ Tab แทน เว้นวรรคเดียวจะถือว่าเป็นคำเดียวกันและพัง",
    solution: `*** Settings ***
Documentation     ชุดการทดสอบระบบวางแผนภาษี
Resource          ../resources/kouen.resource
 
Test Setup        Launch Kouen
Test Teardown     Quit Kouen`,
    theory: `ใน <strong>Robot Framework (RF)</strong> บล็อก <code>*** Settings ***</code> คือประตูด่านแรกในการประกาศคอนฟิกูเรชันของสคริปต์ ทำหน้าที่นำเข้าปลั๊กอินไลบรารีภายนอก ทรัพยากรย่อย และโครงสร้างเริ่ม/ปิดการทดสอบ:<br/><br/>
    1. <strong>Documentation</strong>: ระบุอธิบายเป้าหมายการทดสอบของหน้าต่างนี้ เพื่อดึงไปขึ้นแสดงบนบอร์ดรายงานผลอัตโนมัติ<br/>
    2. <strong>Resource & Library</strong>: นำเข้าคำสั่งภายนอกมารวมกัน (Modular) เช่น <code>Resource  kouen.resource</code><br/>
    3. <strong>Setup & Teardown</strong>: ระบุกระบวนการโต้ตอบที่ต้องเรียกเคลียร์รันระบบก่อนเริ่มและหลังจบทุก ๆ เทสเคส<br/><br/>
    ⚠️ <strong>กฎเหล็ก 2 ช่องว่าง (Double Space Rule)</strong>: Robot Framework ใช้ตัวแยกคำสั่งโดยเช็คช่องเว้นวรรค <strong>2 เคาะขึ้นไป</strong> หรือใช้ <strong>Tab key</strong> เสมอ! หากเคาะเพียงช่องเดียว ตัวประเมินจะอ่านเป็นตัวหนังสือคำเดียวกันและแจ้งเตือนพัง`,
    example: `*** Settings ***
Documentation    ชุดเทสตัวอย่างของ Selenium
Library          SeleniumLibrary
Test Setup       Open Browser  http://example.com  chrome`,
    task: `จงป้อนคีย์คำสั่งดึงไฟล์นำเข้าลงในบล็อกด้านขวา โดย:<br/>
    1. นำเข้ารายการคีย์เวิร์ดร่วมของไฟล์ <code>../resources/kouen.resource</code> เข้ามาประมวลผลผ่านคำสั่ง <code>Resource</code> (เว้นวรรค 2 เคาะขึ้นไปหลังคีย์คำสั่ง)`
  },
  {
    id: "variables",
    meta: "บทที่ 2",
    title: "RF Variables Section",
    template: `*** Variables ***
# 1. กำหนดตัวแปร \${KOUEN_ENV} ให้มีค่า preview (ชื่อ Environment ที่ launch_kouen() เรียกใช้)
# WRITE YOUR CODE HERE


# 2. กำหนดตัวแปรลิสต์ @{PANE_SHORTCUTS} มีค่า cmd+d และ cmd+w (Split Right, Close Pane)

`,
    validate: (code, log) => {
      log("🔍 Parsing Variables section...");

      const checkEnv = rfLineMatch(code, /\${KOUEN_ENV}\s{2,}preview/, "Variables") ||
                           rfLineMatch(code, /\${KOUEN_ENV}\t+preview/, "Variables");

      if (checkEnv) {
        log("✓ ขั้นตอนที่ 1: ประกาศตัวแปรสเกลาร์ ${KOUEN_ENV} สำเร็จ");
      } else {
        throw new Error("การตั้งค่าตัวแปร ${KOUEN_ENV} คลาดเคลื่อน หรือเว้นวรรคคำไม่ถึง 2 เคาะ\nตัวอย่าง: \${KOUEN_ENV}    preview");
      }

      const checkShortcuts = rfLineMatch(code, /@{PANE_SHORTCUTS}\s{2,}cmd\+d\s{2,}cmd\+w/, "Variables") ||
                           rfLineMatch(code, /@{PANE_SHORTCUTS}\t+cmd\+d\t+cmd\+w/, "Variables") ||
                           rfLineMatch(code, /@{PANE_SHORTCUTS}\s{2,}cmd\+d\t+cmd\+w/, "Variables");

      if (checkShortcuts) {
        log("✓ ขั้นตอนที่ 2: ประกาศตัวแปรรายการลิสต์ @{PANE_SHORTCUTS} สำเร็จ");
      } else {
        throw new Error("การกำหนดตัวแปร @{PANE_SHORTCUTS} ไม่ถูกต้อง ต้องระบุค่า cmd+d และ cmd+w แยกกันตัวละ 2 ช่องว่าง\nตัวอย่าง: @{PANE_SHORTCUTS}    cmd+d    cmd+w");
      }
    },
    hint: "ตัวแปรเดี่ยว (Scalar, \${...}) เก็บได้ค่าเดียว ส่วนตัวแปรลิสต์ (@{...}) เก็บได้หลายค่าโดยเรียงต่อกันแบบเว้นวรรคอย่างน้อย 2 เคาะต่อค่า — กำหนดค่าตามที่ task ระบุให้ครบทั้งสองตัวแปร",
    solution: `*** Variables ***
\${KOUEN_ENV}    preview
@{PANE_SHORTCUTS}     cmd+d    cmd+w`,
    theory: `ในบล็อก <code>*** Variables ***</code> ของ Robot Framework เราประมวลผลประกาศชนิดตัวแปรแบ่งแยกตามสัญลักษณ์นำหน้าเพื่อให้ตัวรันสแกนดึงข้อมูลได้แม่นยำ:<br/><br/>
    1. <strong>Scalar Variables (<code>\${NAME}</code>)</strong>: เก็บค่าข้อความหรือค่าเดี่ยวทั่วไป เช่น <code>\${KOUEN_ENV}</code> ที่ในโค้ดจริงของ <code>KouenUILibrary.py</code> ถูกส่งเข้า <code>launch_kouen(env="preview")</code> เป็นค่าตั้งต้น<br/>
    2. <strong>List Variables (<code>@{NAME}</code>)</strong>: เก็บข้อมูลประเภทกลุ่มชุดรายการอาร์เรย์ (Array) เช่นชุดคีย์ลัดที่ประกาศไว้ใน <code>kouen.resource</code> จริง (<code>cmd+d</code> = Split Right, <code>cmd+w</code> = Close Pane)<br/>
    3. <strong>Dictionary Variables (<code>&{NAME}</code>)</strong>: เก็บโครงสร้างคีย์คู่มูลค่าแบบ Key/Value คู่ข้อมูล<br/>
    4. <strong>Environment Variables (<code>%{NAME}</code>)</strong>: ใช้สำหรับดึงค่าตัวแปรจาก OS ภายนอก เช่น <code>%{HOME}</code>`,
    example: `*** Variables ***
\${TIMEOUT}      5s
@{SESSION_KEYS}      cmd+1    cmd+2`,
    task: `จงเติมความสามารถของตัวแปรในระบบตรวจสอบด้านขวา โดย:<br/>
    1. ประกาศตัวแปรเดี่ยว <code>\${KOUEN_ENV}</code> ให้เก็บค่า <code>preview</code><br/>
    2. ประกาศตัวแปรชุดกลุ่มรายการ <code>@{PANE_SHORTCUTS}</code> ให้เก็บค่าคีย์ลัด <code>cmd+d</code> และ <code>cmd+w</code>`
  },
  {
    id: "keywords",
    meta: "บทที่ 3",
    title: "RF Custom Keywords & Arguments",
    template: `*** Keywords ***
Open File Via Palette
    # 1. ระบุ Arguments รับตัวแปร \${filename}
    # WRITE YOUR CODE HERE


    # 2. เรียกใช้งานคีย์เวิร์ดจริงของ KouenUILibrary ชื่อ Type Text พิมพ์ชื่อไฟล์ \${filename} ลงในช่อง Command Palette ที่เปิดอยู่
    `,
    validate: (code, log) => {
      log("🔍 Parsing Custom Keywords...");

      const checkArgs = rfLineMatch(code, /\[Arguments\]\s{2,}\${filename}/, "Keywords") ||
                        rfLineMatch(code, /\[Arguments\]\t+\${filename}/, "Keywords");

      if (checkArgs) {
        log("✓ ขั้นตอนที่ 1: กำหนดการรับค่าอาร์กิวเมนต์ [Arguments] ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง [Arguments] เพื่อระบุตัวแปรสืบทอด \${filename}\nตัวอย่าง: [Arguments]    \${filename}");
      }

      const checkType = rfLineMatch(code, /Type Text\s{2,}\${filename}/, "Keywords") ||
                         rfLineMatch(code, /Type Text\t+\${filename}/, "Keywords");

      if (checkType) {
        log("✓ ขั้นตอนที่ 2: ผูกการพิมพ์คีย์บอร์ดเข้ากับ Command Palette สำเร็จ");
      } else {
        throw new Error("การเขียนคีย์เวิร์ดป้อนข้อมูลไม่ถูกต้อง\nตัวอย่าง: Type Text    \${filename}");
      }
    },
    hint: "คีย์เวิร์ดที่ต้องรับค่าที่เปลี่ยนไปในแต่ละครั้งที่เรียกใช้ ต้องประกาศตัวรับพารามิเตอร์ไว้เป็นบรรทัดแรกในตัวคีย์เวิร์ดก่อนเสมอ (ใช้คีย์คำสั่งที่อยู่ในวงเล็บเหลี่ยม) จากนั้นค่อยส่งตัวแปรที่รับมานั้นต่อให้คีย์เวิร์ดพิมพ์ข้อความจริงของ KouenUILibrary ที่ระบุไว้ใน task",
    solution: `*** Keywords ***
Open File Via Palette
    [Arguments]    \${filename}
    Type Text      \${filename}`,
    theory: `เพื่อจัดกลุ่มขั้นตอนการโต้ตอบที่ทำงานเป็นชุดให้สะดวกต่อการเรียกใช้ซ้ำ ๆ ในหลายกรณีทดสอบ เราจะสร้างคีย์เวิร์ดขึ้นใช้งานเองในบล็อก <code>*** Keywords ***</code> โดยสามารถนำคีย์ <strong><code>[Arguments]</code></strong> มากำหนดตัวรับพารามิเตอร์ส่งต่อสืบทอด และเรียกใช้ในลักษณะการส่งต่อค่าตำแหน่งอาร์กิวเมนต์ได้ทันที<br/><br/>
    ต่างจากคีย์เวิร์ดสำเร็จรูปใน <code>kouen.resource</code> จริงอย่าง <code>Split Right</code> หรือ <code>Open Command Palette</code> ที่ไม่รับอาร์กิวเมนต์เลย (เพราะแค่กดคีย์ลัดตายตัว) คีย์เวิร์ดที่ต้อง "พิมพ์ข้อความที่ต่างกันในแต่ละครั้ง" อย่างการเปิดไฟล์ จำเป็นต้องรับพารามิเตอร์ผ่าน <code>[Arguments]</code> เพื่อให้เรียกใช้ซ้ำกับไฟล์คนละชื่อได้`,
    example: `*** Keywords ***
Switch To Session And Verify
    [Arguments]    \${session_number}
    Press Shortcut    cmd+\${session_number}
    Wait For UI    0.3`,
    task: `จงป้อนคีย์การทำงานด้านขวาให้สมบูรณ์เพื่อสร้างขั้นตอน <code>Open File Via Palette</code> โดย:<br/>
    1. ตั้งค่าการรับอาร์กิวเมนต์ตัวแปรสืบทอดชื่อ <code>\${filename}</code><br/>
    2. เรียกใช้งานคีย์เวิร์ดจริงของ <code>KouenUILibrary</code> ชื่อ <code>Type Text</code> เพื่อพิมพ์ <code>\${filename}</code> ลงในช่อง Command Palette`
  },
  {
    id: "os_library",
    meta: "บทที่ 4",
    title: "OperatingSystem & Workspace",
    template: `*** Keywords ***
Reset Config File
    # 1. ทำการลบไฟล์คอนฟิกเก่า \${CONFIG_FILE} ทิ้งด้วยคำสั่งของ OperatingSystem
    # WRITE YOUR CODE HERE
    
    
    # 2. สร้างไฟล์เปล่าตัวใหม่ขึ้นมาแทนที่ด้วยคำสั่ง Create File โดยเขียนเนื้อหา 'kouen.toast("v1")' ลงไปใน \${CONFIG_FILE}
    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่งระบบคอมพิวเตอร์...");
      
      const checkRemove = rfLineMatch(code, /Remove File\s{2,}\${CONFIG_FILE}/, "Keywords") ||
                          rfLineMatch(code, /Remove File\t+\${CONFIG_FILE}/, "Keywords");

      if (checkRemove) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบสคริปต์สืบจับและสั่งลบไฟล์เก่าทิ้งสำเร็จ");
      } else {
        throw new Error("ไม่พบคีย์เวิร์ดลบไฟล์คอนฟิกเก่าทิ้ง หรือระบุตัวแปรไฟล์ปลายทางคลาดเคลื่อน\nตัวอย่าง: Remove File    \${CONFIG_FILE}");
      }

      // Require the exact log content too — a "Create File" line with
      // some other content shouldn't count as satisfying task step 2.
      const checkCreate = rfLineMatch(code, /Create File\s{2,}\${CONFIG_FILE}\s{2,}kouen\.toast\("v1"\)/, "Keywords") ||
                          rfLineMatch(code, /Create File\t+\${CONFIG_FILE}\t+kouen\.toast\("v1"\)/, "Keywords");

      if (checkCreate) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบสคริปต์เขียนทับไฟล์ระบบคอมพิวเตอร์สำเร็จ");
      } else {
        throw new Error("คำสั่งสร้างและเขียนข้อมูลลงไฟล์ไม่ถูกต้อง\nตัวอย่าง: Create File    \${CONFIG_FILE}    kouen.toast(\"v1\")");
      }
    },
    hint: "OperatingSystem library มีคีย์เวิร์ดคู่สำหรับลบไฟล์เก่าทิ้งแบบปลอดภัย (ไม่ฟ้องเออเรอร์แม้ไม่มีไฟล์อยู่) และอีกตัวสำหรับสร้างไฟล์ใหม่พร้อมเขียนเนื้อหาลงไปในคราวเดียว — ทั้งสองคำสั่งรับพิกัดไฟล์ปลายทางเป็นอาร์กิวเมนต์แรก",
    solution: `*** Keywords ***
Reset Config File
    Remove File    \${CONFIG_FILE}
    Create File    \${CONFIG_FILE}    kouen.toast("v1")`,
    theory: `ไลบรารี <code>OperatingSystem</code> ของ Robot Framework ถูกออกแบบมาสำหรับสแกนสร้างและเคลียร์ไฟล์หรือแคชตกค้างบนระบบปฏิบัติการของเครื่องเทสจริง ๆ โดยมีคำสั่งจัดการหลักอย่าง <code>Remove File</code> ในการล้างไฟล์แบบปลอดภัย (ไม่ฟ้องเออเรอร์หากไม่มีไฟล์) และ <code>Create File</code> ในการป้อนสร้างข้อความไฟล์ข้อมูลขึ้นมาใหม่ได้ทันที`,
    example: `*** Settings ***
Library          OperatingSystem
*** Keywords ***
ล้างโฟลเดอร์ผลลัพธ์
    Remove Directory    \${OUTPUT_DIR}    recursive=True`,
    task: `จงพิมพ์คำสั่งในขั้นตอน <code>Reset Config File</code> ด้านขวา โดย:<br/>
    1. สั่งลบไฟล์ระบบที่มีตำแหน่งชี้หาพิกัดตัวแปร <code>\${CONFIG_FILE}</code> ทิ้งไป<br/>
    2. สร้างไฟล์เปล่าตัวใหม่ขึ้นมาทดแทนในตำแหน่งเดิม และเขียนข้อความล็อกอักษร <code>'kouen.toast("v1")'</code> ลงในไฟล์`
  },
  {
    id: "native_ui",
    meta: "บทที่ 5",
    title: "Native macOS UI Automation (KouenUILibrary)",
    template: `*** Test Cases ***
TC-01: เปิดแท็บใหม่ผ่านปุ่มบนหน้าจอสำเร็จ
    # 1. ตรวจสอบว่าอิลิเมนต์ accessibility identifier 'new-tab-button' มีอยู่จริงในแอปก่อนโต้ตอบ
    # WRITE YOUR CODE HERE


    # 2. สั่งคลิกที่อิลิเมนต์ 'new-tab-button' ผ่าน Accessibility API
    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่งควบคุม Native macOS UI...");

      const checkExist = rfLineMatch(code, /Element Should Exist\s{2,}new-tab-button/, "Test Cases") ||
                        rfLineMatch(code, /Element Should Exist\t+new-tab-button/, "Test Cases");

      if (checkExist) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบสคริปต์ยืนยันอิลิเมนต์มีอยู่จริง (Element Should Exist)");
      } else {
        throw new Error("การระบุคำสั่งตรวจสอบอิลิเมนต์ไม่สมบูรณ์\nตัวอย่าง: Element Should Exist    new-tab-button");
      }

      const checkClick = rfLineMatch(code, /Click UI Element\s{2,}new-tab-button/, "Test Cases") ||
                         rfLineMatch(code, /Click UI Element\t+new-tab-button/, "Test Cases");

      if (checkClick) {
        log("✓ ขั้นตอนที่ 2: สั่งคลิกที่อิลิเมนต์สำเร็จ");
      } else {
        throw new Error("ไม่พบคีย์เวิร์ดคลิกเป้าหมายปุ่มเปิดแท็บใหม่\nตัวอย่าง: Click UI Element    new-tab-button");
      }
    },
    hint: "ก่อนโต้ตอบกับอิลิเมนต์ใดๆ ผ่าน Accessibility API ควรมีคีย์เวิร์ดยืนยันการมีอยู่จริงของมันก่อนเสมอ (กันคลิกอิลิเมนต์ที่ยังเรนเดอร์ไม่เสร็จ) จากนั้นจึงค่อยเรียกคีย์เวิร์ดคลิกจริงตามด้วยชื่ออิลิเมนต์เป้าหมายเดียวกัน",
    solution: `*** Test Cases ***
TC-01: เปิดแท็บใหม่ผ่านปุ่มบนหน้าจอสำเร็จ
    Element Should Exist    new-tab-button
    Click UI Element    new-tab-button`,
    theory: `Kouen Terminal เป็นแอปพลิเคชัน macOS แบบเนทีฟ (Native App) ไม่ใช่หน้าเว็บ จึงไม่มี DOM ให้ <code>SeleniumLibrary</code> เข้าไปสืบค้นด้วย <code>id=</code>/<code>css=</code>/<code>xpath=</code> ได้เลย โปรเจกจริงจึงเขียนไลบรารีเสริมขึ้นเองชื่อ <strong><code>KouenUILibrary.py</code></strong> ซึ่งควบคุมแอปผ่าน macOS Accessibility API (ยิงคำสั่งผ่าน <code>osascript</code> เบื้องหลัง) โดยอ้างอิงอิลิเมนต์ด้วยคีย์ <strong><code>AXIdentifier</code></strong> แทน:<br/><br/>
    1. <strong>Element Should Exist</strong>: ตรวจสอบว่าอิลิเมนต์ปรากฏอยู่ใน Accessibility Tree จริงก่อนโต้ตอบ (ป้องกันคลิกอิลิเมนต์ที่ยังเรนเดอร์ไม่เสร็จ)<br/>
    2. <strong>Click UI Element</strong>: สั่งคลิกอิลิเมนต์ผ่าน System Events จริง ไม่ใช่การจำลองผ่านเบราว์เซอร์`,
    example: `// การสลับเปิด/ปิด Sidebar ผ่านคีย์เวิร์ดจริงของ KouenUILibrary
Press Shortcut    cmd+backslash
Wait For UI       0.5
Element Should Not Exist    sidebar-panel`,
    task: `จงป้อนสคริปต์จำลองพฤติกรรมในเคส <code>TC-01</code> เพื่อสั่งเปิดแท็บใหม่ผ่านการควบคุม UI แบบเนทีฟ โดย:<br/>
    1. ตรวจสอบว่าอิลิเมนต์ <code>new-tab-button</code> มีอยู่จริงในผังการช่วยเข้าถึง (Accessibility Tree)<br/>
    2. ทำการส่งคำสั่งคลิกโต้ตอบลงไปบนอิลิเมนต์เป้าหมาย <code>new-tab-button</code>`
  },
  {
    id: "assertions",
    meta: "บทที่ 6",
    title: "RF Assertions & Validation",
    template: `*** Test Cases ***
TC-02: ตรวจสอบ Kanban Board ของ Kouen สำเร็จ
    # 1. ตรวจสอบว่ากระดาน (Board) ของ Kouen ต้องมีคอลัมน์ชื่อ 'Backlog' อยู่จริง
    # WRITE YOUR CODE HERE


    # 2. ตรวจสอบความถูกต้องว่าค่าในตัวแปร \${count} มีความยาวมากกว่า 0 หรือไม่ (Should Be True)
    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่งทำ Assertion ใน Robot...");

      const checkContain = rfLineMatch(code, /Kouen Board Should Have Column\s{2,}Backlog/, "Test Cases") ||
                           rfLineMatch(code, /Kouen Board Should Have Column\t+Backlog/, "Test Cases");

      if (checkContain) {
        log("✓ ขั้นตอนที่ 1: ใช้คีย์เวิร์ดตรวจสอบคอลัมน์บนกระดาน Backlog ถูกต้อง");
      } else {
        throw new Error("คำสั่งตรวจเช็คคอลัมน์บนกระดานคลาดเคลื่อน\nตัวอย่าง: Kouen Board Should Have Column    Backlog");
      }

      const checkTrue = rfLineMatch(code, /Should Be True\s{2,}\${count}\s*>\s*0/, "Test Cases") ||
                        rfLineMatch(code, /Should Be True\t+\${count}\s*>\s*0/, "Test Cases");

      if (checkTrue) {
        log("✓ ขั้นตอนที่ 2: ใช้ Should Be True ตรวจสอบประเมินค่าถูกต้อง");
      } else {
        throw new Error("สคริปต์เปรียบเทียบตรรกะตัวเลขด้วยคำสั่ง Should Be True ไม่ถูกต้อง\nตัวอย่าง: Should Be True    \${count} > 0");
      }
    },
    hint: "Assertion ของ Robot ไม่จำเป็นต้องผูกกับ UI เสมอไป มีคีย์เวิร์ดเฉพาะที่เขียนขึ้นเช็คผลลัพธ์จากฝั่ง CLI ของกระดาน Kanban อยู่แล้ว ให้เรียกใช้พร้อมชื่อคอลัมน์ที่ต้องการยืนยัน ส่วนการเช็คเงื่อนไขตัวเลข/ตรรกะทั่วไปให้ใช้คีย์เวิร์ดตระกูล Should Be... ที่ประเมินนิพจน์ Python ได้ตรงๆ",
    solution: `*** Test Cases ***
TC-02: ตรวจสอบ Kanban Board ของ Kouen สำเร็จ
    Kouen Board Should Have Column    Backlog
    Should Be True                     \${count} > 0`,
    theory: `การยืนยันความสมบูรณ์ในการทำรายการทดสอบ (Assertions) ของ Robot Framework จะถูกขึ้นต้นชื่อของคำสั่งด้วยคำว่า <code>Should</code> เสมอเพื่อตรวจสอบเปรียบเทียบผลลัพธ์ข้อมูล:<br/><br/>
    1. <strong>Kouen Board Should Have Column</strong>: คีย์เวิร์ดที่เขียนขึ้นเองใน <code>KouenUILibrary.py</code> โดยข้างในจะสั่งรันคำสั่ง <code>kouen board</code> ผ่าน CLI จริง แล้วเช็คว่าชื่อคอลัมน์ที่ระบุปรากฏอยู่ใน stdout หรือไม่ — เป็นตัวอย่างว่า Assertion ของ Robot ไม่จำเป็นต้องผูกกับ UI เสมอไป จะเขียนขึ้นมาเช็คผลลัพธ์จาก CLI ก็ได้<br/>
    2. <strong>Should Be True</strong>: ประเมินสมการตัวเลขหรือตรรกะเงื่อนไขของตัวแปร โดยจะดึงสิทธิ์ส่งต่อไปคำนวณเบื้องหลังในระบบภาษา Python`,
    example: `// การเช็คความเท่ากันและเช็คผลลัพธ์คำสั่ง CLI สำเร็จ
Should Be Equal As Strings       \${status}           SUCCESS
Kouen CLI Should Succeed       worktree    list`,
    task: `จงป้อนคีย์คำสั่งทำ Assertion ตรวจสอบผลลัพธ์ของเคส <code>TC-02</code> โดย:<br/>
    1. ยืนยันว่ากระดาน Kanban ของ Kouen มีคอลัมน์ชื่อ <code>'Backlog'</code> อยู่จริง (ผ่าน CLI จริงเบื้องหลัง)<br/>
    2. ประเมินสมการเช็คตัวแปร <code>\${count}</code> ผ่านฟังก์ชัน <code>Should Be True</code> เพื่อเช็คว่ามีปริมาณมากกว่า 0 รายการ`
  },
  {
    id: "process_lib",
    meta: "บทที่ 7",
    title: "Process Library & Process Control",
    template: `*** Test Cases ***
Launch Application Process
    # 1. รันโปรเซสแอปพลิเคชันด้วยคีย์เวิร์ด Launch Process ส่งอาร์กิวเมนต์ 'kouen-cli' และระบุตัวแปรเซฟ handle เป็น 'kouen_process'
    # WRITE YOUR CODE HERE
    
    
    # 2. สั่งรอให้โปรเซส 'kouen_process' ทำงานเสร็จสิ้นด้วยคำสั่ง Wait For Process (ระบุ timeout=10s)
    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบสิทธิ์การใช้ Process Library...");
      
      const checkLaunch = rfLineMatch(code, /Launch Process\s{2,}kouen-cli\s{2,}handle=kouen_process/, "Test Cases") ||
                          rfLineMatch(code, /Launch Process\t+kouen-cli\t+handle=kouen_process/, "Test Cases");

      if (checkLaunch) {
        log("✓ ขั้นตอนที่ 1: เรียกใช้ Launch Process และส่งค่า handle='kouen_process' ถูกต้อง");
      } else {
        throw new Error("การตั้งคำสั่งรันโปรเซสแอปพลิเคชันไม่ถูกต้อง\nตัวอย่าง: Launch Process    kouen-cli    handle=kouen_process");
      }

      const checkWait = rfLineMatch(code, /Wait For Process\s{2,}kouen_process\s{2,}timeout=10s/, "Test Cases") ||
                        rfLineMatch(code, /Wait For Process\t+kouen_process\t+timeout=10s/, "Test Cases");

      if (checkWait) {
        log("✓ ขั้นตอนที่ 2: สั่งหน่วงรอด้วย Wait For Process สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่ง Wait For Process หรือส่ง handle ไม่ถูกต้อง\nตัวอย่าง: Wait For Process    kouen_process    timeout=10s");
      }
    },
    hint: "การรันโปรเซสเบื้องหลังแบบไม่บล็อก ต้องผูก handle ตัวแปรอ้างอิงไว้ตอนสั่งรัน (ผ่าน keyword argument ชื่อ handle) เพื่อให้ขั้นตอนถัดไปเรียกคีย์เวิร์ดที่รอให้โปรเซสนั้นจบการทำงานได้ พร้อมระบุ timeout ป้องกันค้างตลอดไป",
    solution: `*** Test Cases ***
Launch Application Process
    Launch Process    kouen-cli    handle=kouen_process
    Wait For Process    kouen_process    timeout=10s`,
    theory: `การสั่งรันแอปพลิเคชันหลังบ้าน เซิร์ฟเวอร์ทดสอบ หรือโปรแกรมคอมมานด์ไลน์ภายนอก (Background running) ใน Robot Framework ใช้งานโมดูล <code>Process</code> โดยการรันประเภทแอปที่ห้ามปิดบล็อก (Non-blocking) เราจะดึง <strong><code>Launch Process</code></strong> คีย์เวิร์ดมาทำงานส่งผลลัพธ์ย้อนกลับไปผูกติดไว้ที่ตัวแปร <code>handle</code> ทำให้สคริปต์รันเทสขั้นตอนอื่นได้ทันทีโดยไม่ต้องนอนค้างรอหน้าจอ`,
    example: `// การสั่งเริ่มเปิดจำลองเซิร์ฟเวอร์ย่อยเบื้องหลังการประมวลผล
Launch Process    npm    run    start    handle=dev_server
# สคริปต์สามารถสั่งทำเทสส่วนถัดไปขนานได้ทันที`,
    task: `จงป้อนคีย์คำสั่งควบคุมโปรเซสการรันแอป <code>kouen-cli</code> โดย:<br/>
    1. สั่งรันขึ้นมาทำงานเบื้องหลังและผูกติดเก็บไว้กับ handle ตัวแปรอ้างอิงชื่อ <code>kouen_process</code><br/>
    2. เขียนคำสั่งชะลอประมวลผลหน่วงรอให้การรันแอปข้างต้นเสร็จสิ้นโดยระบุไทม์เอาท์ 10 วินาที`
  },
  {
    id: "custom_lib",
    meta: "บทที่ 8",
    title: "Custom Python Libraries",
    template: `*** Test Cases ***
Verify App Windows Count
    # 1. เรียกคีย์เวิร์ดของ KouenUILibrary ชื่อ 'Get Window Count' และรับค่าเซฟในตัวแปร \${count}
    # WRITE YOUR CODE HERE
    
    
    # 2. ตรวจสอบตรวจสอบว่าจำนวนหน้าต่างเปิดอยู่มากกว่า 0 โดยเปรียบเทียบใน Should Be True
    `,
    validate: (code, log) => {
      log("🔍 กำลังประเมินผลคำสั่งห้องคลาส Python Library...");
      
      const checkGet = rfLineMatch(code, /\${count}=\s{2,}Get Window Count/, "Test Cases") ||
                       rfLineMatch(code, /\${count}=\t+Get Window Count/, "Test Cases") ||
                       rfLineMatch(code, /\${count}=\s{2,}KouenUILibrary\.Get Window Count/, "Test Cases");

      if (checkGet) {
        log("✓ ขั้นตอนที่ 1: รับค่าจาก Custom Python Keyword เซฟในตัวแปรสำเร็จ");
      } else {
        throw new Error("รูปแบบรับข้อมูลจากคีย์เวิร์ด Get Window Count ไม่ถูกต้อง\nตัวอย่าง: \${count}=    Get Window Count");
      }

      const checkTrue = rfLineMatch(code, /Should Be True\s{2,}\${count}\s*>\s*0/, "Test Cases") ||
                        rfLineMatch(code, /Should Be True\t+\${count}\s*>\s*0/, "Test Cases");

      if (checkTrue) {
        log("✓ ขั้นตอนที่ 2: เช็คตรรกะจำนวนหน้าต่าง UI สำเร็จ");
      } else {
        throw new Error("กรุณาใช้ Should Be True เช็คความถูกต้องของ \${count} > 0");
      }
    },
    hint: "การรับค่าคืนกลับจากคีย์เวิร์ดมาเก็บในตัวแปร ต้องประกาศชื่อตัวแปรพร้อมเครื่องหมาย = ต่อท้ายก่อนเรียกชื่อคีย์เวิร์ดในบรรทัดเดียวกัน จากนั้นค่อยนำตัวแปรที่ได้ไปเช็คเงื่อนไขตรรกะตามที่ task ระบุ",
    solution: `*** Test Cases ***
Verify App Windows Count
    \${count}=    Get Window Count
    Should Be True    \${count} > 0`,
    theory: `เมื่อต้องการสร้างคำสั่งใหม่ที่ไม่มีในระบบหรือเรียกอ่านคุณสมบัติลึกในระบบ OS คลาสของภาษา Python สามารถเขียนขึ้นเป็น Custom Library ได้ โดยเมื่อ Robot Framework สแกนนำเข้าคำสั่ง ฟังก์ชันที่เขียนสไตล์ <code>snake_case</code> ของ Python (เช่น <code>get_window_count</code>) จะถูกทำการแปลงมาโชว์เป็นคำแยกช่องว่างคีย์คำใหญ่ <code>Get Window Count</code> ให้อัตโนมัติ`,
    example: `# ตัวอย่างไฟล์ Python คลาสเสริมระบบ
class MyCustomLibrary:
    def verify_security_token(self, token):
        return token.startswith("SEC_")`,
    task: `จงป้อนคีย์เขียนสคริปต์โต้ตอบกับคีย์เวิร์ดคลาส Python เสริม โดย:<br/>
    1. เรียกคำสั่ง <code>Get Window Count</code> และนำผลข้อมูลจำนวนหน้าต่างที่ได้ส่งคืนมาจัดเก็บที่ตัวแปร <code>\${count}</code><br/>
    2. เช็คตรรกะยืนยันความถูกต้องผ่าน <code>Should Be True</code> ว่าปริมาณค่าข้อมูลมีพิกัดมากกว่า 0 รายการจริง`
  },
  {
    id: "directories",
    meta: "บทที่ 9",
    title: "RF Directory Constraints",
    template: `*** Keywords ***
Prepare Config Workspace
    # 1. ทำการสร้างโฟลเดอร์สำหรับเก็บสคริปต์คอนฟิก '\${CONFIG_DIR}' ด้วยคำสั่ง Create Directory
    # WRITE YOUR CODE HERE
    
    
    # 2. ตรวจสอบยืนยันว่าโฟลเดอร์ถูกสร้างและพร้อมใช้งานจริงด้วย Directory Should Exist
    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง Workspace Directory...");
      
      const checkCreate = rfLineMatch(code, /Create Directory\s{2,}\${CONFIG_DIR}/, "Keywords") ||
                          rfLineMatch(code, /Create Directory\t+\${CONFIG_DIR}/, "Keywords");

      if (checkCreate) {
        log("✓ ขั้นตอนที่ 1: เรียกใช้คำสั่ง Create Directory สำเร็จ");
      } else {
        throw new Error("คำสั่งสร้างโฟลเดอร์เป้าหมายไม่ถูกต้อง\nตัวอย่าง: Create Directory    \${CONFIG_DIR}");
      }

      const checkExist = rfLineMatch(code, /Directory Should Exist\s{2,}\${CONFIG_DIR}/, "Keywords") ||
                         rfLineMatch(code, /Directory Should Exist\t+\${CONFIG_DIR}/, "Keywords");

      if (checkExist) {
        log("✓ ขั้นตอนที่ 2: เรียกใช้ระบบตรวจจับโฟลเดอร์สำเร็จ");
      } else {
        throw new Error("คำสั่งตรวจสอบความมีอยู่ของโฟลเดอร์ปลายทางไม่ถูกต้อง\nตัวอย่าง: Directory Should Exist    \${CONFIG_DIR}");
      }
    },
    hint: "OperatingSystem library มีคีย์เวิร์ดคู่กันสำหรับจัดการโฟลเดอร์: ตัวหนึ่งสร้างไดเรกทอรีขึ้นมาใหม่ (ทำงานคล้าย mkdir -p ไม่พังแม้มีอยู่แล้ว) อีกตัวยืนยันว่าโฟลเดอร์นั้นมีอยู่จริง ทั้งสองรับพิกัดโฟลเดอร์เป้าหมายเป็นอาร์กิวเมนต์เดียว",
    solution: `*** Keywords ***
Prepare Config Workspace
    Create Directory    \${CONFIG_DIR}
    Directory Should Exist    \${CONFIG_DIR}`,
    theory: `เพื่อหลีกเลี่ยงบั๊กโฟลเดอร์ไม่มีอยู่จริง (Folder not found error) ตอนบันทึกเขียนไฟล์สคริปต์เทส โมดูล OperatingSystem จัดเตรียมคำสั่งตรวจสอบขอบเขตระบบโฟลเดอร์มาให้ครบถ้วน เช่น <code>Create Directory</code> (ซึ่งทำหน้าที่คล้ายกับ mkdir -p ที่จะป้อนสร้างโฟลเดอร์แม่ขนานย่อยขึ้นมาให้อัตโนมัติโดยไม่แจ้งเตือนพังหากมีโฟลเดอร์นั้นอยู่แล้ว) และคำสั่งยืนยันพฤติกรรมความมีอยู่ <code>Directory Should Exist</code>`,
    example: `// การสแกนเช็คโฟลเดอร์เก็บรูปแคปหน้าจอเทสพัง
Create Directory          \${SCREENSHOT_DIR}
Directory Should Exist    \${SCREENSHOT_DIR}`,
    task: `จงป้อนคีย์สคริปต์ด้านขวาจัดการโครงสร้างไดเรกทอรีของโฟลเดอร์ <code>\${CONFIG_DIR}</code> โดย:<br/>
    1. สั่งประมวลผลสร้างไดเรกทอรีดังกล่าวขึ้นมาใหม่ในระบบคอมพิวเตอร์<br/>
    2. เขียนเงื่อนไขสืบเช็คประเมินผลยืนยันว่าโฟลเดอร์ปลายทางมีอยู่จริงในระบบไดรฟ์จัดเก็บข้อมูล`
  },
  {
    id: "setup_override",
    meta: "บทที่ 10",
    title: "Test Cases Inline Overrides",
    template: `*** Test Cases ***
Script Reload Spec Test
    # 1. บังคับเซ็ตอัพเฉพาะตัวเทสนี้ [Setup] ให้ยิงเรียกคีย์เวิร์ด 'Create Config File'
    # WRITE YOUR CODE HERE
    
    
    # 2. บังคับขั้นตอนจบการทำงาน [Teardown] ให้ยิงเรียกคีย์เวิร์ด 'Cleanup And Quit'
    `,
    validate: (code, log) => {
      log("🔍 Parsing Local Setup/Teardown Overrides...");
      
      const checkSetup = rfLineMatch(code, /\[Setup\]\s{2,}Create Config File/, "Test Cases") ||
                         rfLineMatch(code, /\[Setup\]\t+Create Config File/, "Test Cases");

      if (checkSetup) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบสคริปต์ [Setup] สำหรับจำลองเตรียมไฟล์เริ่มต้นเฉพาะเคสสำเร็จ");
      } else {
        throw new Error("คำสั่งการเขียน Setup เฉพาะตัวเทสไม่ถูกต้อง\nตัวอย่าง: [Setup]    Create Config File");
      }

      const checkTeardown = rfLineMatch(code, /\[Teardown\]\s{2,}Cleanup And Quit/, "Test Cases") ||
                            rfLineMatch(code, /\[Teardown\]\t+Cleanup And Quit/, "Test Cases");

      if (checkTeardown) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบสคริปต์ [Teardown] ล้างข้อมูลสำเร็จ");
      } else {
        throw new Error("คำสั่งการเขียน Teardown เฉพาะตัวเทสไม่ถูกต้อง\nตัวอย่าง: [Teardown]    Cleanup And Quit");
      }
    },
    hint: "การล็อกทับ Setup/Teardown เฉพาะเคสหนึ่งๆ ใช้คีย์คำสั่งในวงเล็บเหลี่ยมวางเป็นบรรทัดแรก(และบรรทัดใดก็ได้)ภายในตัวเทสเคสเอง ตามด้วยชื่อคีย์เวิร์ดที่ต้องการให้เรียกแทนค่าของ Suite Setup/Teardown เดิม",
    solution: `*** Test Cases ***
Script Reload Spec Test
    [Setup]       Create Config File
    [Teardown]    Cleanup And Quit`,
    theory: `กรณีหน้าจอต้องการจำลองสถานการณ์พิเศษเฉพาะบางกรณีทดสอบ (เช่น ตัวรันเคสนี้จำเป็นต้องจำลองข้อบกพรณ์หรือสวิตช์เปิดปิดสิทธิ์ข้อมูล) เราสามารถล็อกหลีกเลี่ยงกระบวนการเริ่มรันหลักของ Suite (Suite Setup) โดยใช้คำสั่งป้ายสัญลักษณ์ปีกกาเหลี่ยม <code>[Setup]</code> และ <code>[Teardown]</code> ภายในแถวย่อยเพื่อเขียนจำลองเงื่อนไขส่วนตนขึ้นมาทับค่าเดิมโดยสมบูรณ์เฉพาะเคสตัวนี้`,
    example: `*** Test Cases ***
เทสทดสอบส่งอีเมลผิดพลาด
    [Setup]       BlockMailServerConnection
    ส่งจดหมายจำลองหาแอดมิน
    [Teardown]    RestoreMailServerConnection`,
    task: `จงป้อนคีย์ระบุ setup/teardown ย่อยทับระบบสำหรับเคส <code>Script Reload Spec Test</code> โดย:<br/>
    1. ป้อนคำสั่ง <code>[Setup]</code> เพื่อกระตุ้นเรียกคีย์เวิร์ดเตรียมไฟล์ <code>Create Config File</code><br/>
    2. ป้อนคำสั่ง <code>[Teardown]</code> สั่งเรียกคีย์เวิร์ดคืนค่าสถานะล้างข้อมูล <code>Cleanup And Quit</code>`
  },
  {
    id: "applescript",
    meta: "บทที่ 11",
    title: "System CLI & Applescript Integration",
    template: `*** Test Cases ***
System Control Over osascript
    # 1. สั่งรันคำสั่ง osascript บนเทอร์มินัลด้วย Run Process โดยส่งอาร์กิวเมนต์ 'osascript' และบันทึกผลลงในตัวแปร \${result}
    # WRITE YOUR CODE HERE
    
    
    # 2. ตรวจสอบว่าผลการ Exit code (\${result.rc}) มีสถานะสำเร็จสมบูรณ์เป็นตัวเลข 0 (Should Be Equal As Integers)
    `,
    validate: (code, log) => {
      log("🔍 กำลังประเมินสิทธิ์ Run Process ตรวจ Exit code...");
      
      const checkRun = rfLineMatch(code, /\${result}=\s{2,}Run Process\s{2,}osascript/, "Test Cases") ||
                       rfLineMatch(code, /\${result}=\t+Run Process\t+osascript/, "Test Cases");

      if (checkRun) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบคำสั่งเรียกใช้โปรเซส osascript เก็บในตัวแปรสำเร็จ");
      } else {
        throw new Error("คำสั่งรันโปรเซสสคริปต์ปลายทางไม่ถูกต้อง\nตัวอย่าง: \${result}=    Run Process    osascript");
      }

      const checkAssert = rfLineMatch(code, /Should Be Equal As Integers\s{2,}\${result\.rc}\s{2,}0/, "Test Cases") ||
                          rfLineMatch(code, /Should Be Equal As Integers\t+\${result\.rc}\t+0/, "Test Cases");

      if (checkAssert) {
        log("✓ ขั้นตอนที่ 2: ทำการเปรียบเทียบ Exit Code ตัวเลขเป็น 0 ถูกต้อง");
      } else {
        throw new Error("การเช็ค Exit Code ด้วย Should Be Equal As Integers ล้มเหลว\nตัวอย่าง: Should Be Equal As Integers    \${result.rc}    0");
      }
    },
    hint: "คีย์เวิร์ดรันโปรเซสแบบบล็อกจะคืนค่าออบเจกต์ผลลัพธ์กลับมา ให้เก็บไว้ในตัวแปร (อย่าลืมเครื่องหมาย = ต่อท้ายชื่อตัวแปร) แล้วดึงค่า Return Code ของออบเจกต์นั้นไปเทียบกับ 0 ด้วยคีย์เวิร์ดเปรียบเทียบเลขจำนวนเต็ม",
    solution: `*** Test Cases ***
System Control Over osascript
    \${result}=    Run Process    osascript
    Should Be Equal As Integers    \${result.rc}    0`,
    theory: `การสั่งโต้ตอบกระบวนการรันแอปบน macOS มักต้องอาศัย AppleScript (ผ่านคอมมานด์ <code>osascript</code>) ในการประมวลผลผ่านตัวรันเทส ใน Robot Framework เมธอด <code>Run Process</code> จะทำการคืนค่าผลลัพธ์ข้อมูลกลับออกมาเป็นตัวแปรโครงสร้างออบเจกต์ ซึ่งบรรจุข้อมูลตรวจสอบหลักคือ <strong><code>\${result.rc}</code></strong> (รหัส Return Code/Exit Code) ซึ่งหากมีสถานะเป็น 0 จะฟ้องว่าการทำงานระดับระบบปฏิบัติการเสร็จสิ้นเป็นปกติ ปราศจากความพัง`,
    example: `// การสั่งคำสั่งคอมมานด์ไลน์และดักข้อมูล Return code
\${output}=    Run Process    git    status
Should Be Equal As Integers    \${output.rc}    0`,
    task: `จงพิมพ์ขั้นตอนจำลองรันสคริปต์ควบคุมระบบในเคสการทดสอบ โดย:<br/>
    1. สั่งประมวลผลคำสั่ง <code>osascript</code> ผ่านเมธอด <code>Run Process</code> และจัดเก็บบันทึกผลลัพธ์ไว้ที่ <code>\${result}</code><br/>
    2. เปรียบเทียบตรวจยืนยันความสมบูรณ์ของ exit code ย่อย <code>\${result.rc}</code> ว่ามีสถานะประมวลผลเท่ากับ 0 โดยเลือกใช้งาน <code>Should Be Equal As Integers</code>`
  },
  {
    id: "flaky_retry",
    meta: "บทที่ 12",
    title: "Flaky-Test Retry Strategy",
    template: `*** Test Cases ***
Retry Flaky Window Check
    # 1. ใช้ Wait Until Keyword Succeeds วนเรียก keyword 'Verify App Window Ready' สูงสุด 5 ครั้ง ห่างกันครั้งละ 2 วินาที
    # WRITE YOUR CODE HERE

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Flaky-Test Retry Strategy...");

      const checkRetry = rfLineMatch(code, /Wait Until Keyword Succeeds\s{2,}5x\s{2,}2s\s{2,}Verify App Window Ready/, "Test Cases") ||
                         rfLineMatch(code, /Wait Until Keyword Succeeds\t+5x\t+2s\t+Verify App Window Ready/, "Test Cases");

      if (checkRetry) {
        log("✓ ขั้นตอนที่ 1: เรียกใช้ Wait Until Keyword Succeeds กำหนด 5x/2s เรียก Verify App Window Ready ถูกต้อง");
      } else {
        throw new Error("คำสั่ง Wait Until Keyword Succeeds ไม่ถูกต้อง\nตัวอย่าง: Wait Until Keyword Succeeds    5x    2s    Verify App Window Ready");
      }
    },
    hint: "BuiltIn keyword ตัวนี้รับอาร์กิวเมนต์เรียงกัน 3 ค่า: จำนวนครั้ง/เวลารวมสูงสุดที่จะ retry, ช่วงห่างระหว่างแต่ละครั้ง, แล้วตามด้วยชื่อ keyword ที่จะถูกวนเรียก — ใส่ค่าตามที่ task ระบุให้ครบตามลำดับนี้",
    solution: `*** Test Cases ***
Retry Flaky Window Check
    Wait Until Keyword Succeeds    5x    2s    Verify App Window Ready`,
    theory: `UI Automation บน macOS มักเจอ timing issue: หน้าต่างแอปยังไม่ทันเรนเดอร์เสร็จตอนที่ keyword ตรวจสอบทำงาน ทำให้ test fail ทั้งที่แอปทำงานถูกต้อง (Flaky Test) ทางแก้ที่ผิดคือใส่ <code>Sleep</code> ค่าคงที่ยาวๆ ก่อนเช็ค เพราะช้าไปก็เสียเวลาทุก run เร็วไปก็ยัง flaky<br/><br/>
    Robot Framework มี BuiltIn keyword <strong><code>Wait Until Keyword Succeeds</code></strong> ที่ retry การเรียก keyword ตัวใน (ไม่ใช่ retry ทั้ง test case) ซ้ำไปเรื่อยๆ จนกว่าจะผ่านหรือครบจำนวนครั้ง/เวลาที่กำหนด รูปแบบคือ <code>Wait Until Keyword Succeeds    &lt;จำนวนครั้งหรือเวลารวม&gt;    &lt;ช่วงห่างระหว่างครั้ง&gt;    &lt;keyword&gt;    &lt;args...&gt;</code><br/><br/>
    ข้อแตกต่างสำคัญกับการ retry ทั้ง suite ด้วย CLI flag <code>--rerunfailed</code>: <code>Wait Until Keyword Succeeds</code> retry เฉพาะจุดที่ flaky จริง (granular, เร็ว) ส่วน <code>--rerunfailed</code> รันทั้ง test case ใหม่ทั้งหมด (coarse, ช้ากว่าแต่ครอบคลุมกรณี setup พังด้วย) ควรเลือก granular ก่อนเสมอถ้ารู้จุดที่ flaky ชัดเจน`,
    example: `// ตัวอย่าง retry การเช็ค element ที่บางทีโหลดช้าบนหน้าเว็บ
Wait Until Keyword Succeeds    10x    1s    Element Should Be Visible    id=submit-button`,
    task: `จงป้อนคำสั่งรับมือกับ keyword ตรวจสอบหน้าต่างแอปที่บางทีทำงานช้า (Flaky) โดย:<br/>
    1. ใช้ <code>Wait Until Keyword Succeeds</code> วนเรียก keyword <code>Verify App Window Ready</code> สูงสุด <code>5</code> ครั้ง ห่างกันครั้งละ <code>2</code> วินาที`
  },
  {
    id: "window_focus_check",
    meta: "บทที่ 13",
    title: "หน้าต่างยังไม่พร้อมก่อนพิมพ์: เช็ค Element ก่อน Type ไม่ใช่หน่วงเวลาคงที่",
    template: `*** Test Cases ***
Type Into Ready Element Only
    Click UI Element    search-field
    # ก่อนพิมพ์ทุกครั้งต้องยืนยันว่า element ชื่อ 'search-field' พร้อมใช้งานจริงด้วยการเช็คสภาพจริง (ห้ามหน่วงเวลาคงที่แทน)
    # WRITE YOUR CODE HERE

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเช็ค Element ก่อนพิมพ์...");

      if (rfLineMatch(code, /Wait For UI/i, "Test Cases")) {
        throw new Error("ห้ามใช้ Wait For UI (หน่วงเวลาคงที่) แทนการเช็คสภาพจริง — ข้างในคือ time.sleep() เฉยๆ ไม่รู้ว่า element พร้อมจริงหรือยัง");
      }

      const checkExist = rfLineMatch(code, /Element Should Exist\s{2,}search-field/, "Test Cases") ||
                         rfLineMatch(code, /Element Should Exist\t+search-field/, "Test Cases");
      if (checkExist) {
        log("✓ ขั้นตอนที่ 1: เช็ค Element Should Exist    search-field ก่อนพิมพ์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Element Should Exist    search-field\nตัวอย่าง: Element Should Exist    search-field");
      }

      const checkType = rfLineMatch(code, /Type Text\s{2,}AAPL/, "Test Cases") || rfLineMatch(code, /Type Text\t+AAPL/, "Test Cases");
      if (checkType) {
        log("✓ ขั้นตอนที่ 2: พิมพ์ข้อความ AAPL ด้วย Type Text หลังยืนยัน element พร้อมแล้วถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Type Text    AAPL\nตัวอย่าง: Type Text    AAPL");
      }
    },
    hint: "อย่าใช้คีย์เวิร์ดที่แค่หน่วงเวลาตายตัวมาแทนการเช็คสภาพจริง — ต้องมีคีย์เวิร์ดยืนยันว่าอิลิเมนต์ปรากฏใน accessibility tree จริงก่อนเสมอ แล้วจึงค่อยพิมพ์ข้อความตามที่ task ระบุ",
    solution: `*** Test Cases ***
Type Into Ready Element Only
    Click UI Element    search-field
    Element Should Exist    search-field
    Type Text    AAPL`,
    theory: `ไม่ใช่ flaky ทุกตัวจะแก้ด้วยการเพิ่มเวลาหน่วง — ใน <code>KouenUILibrary.py</code> จริงมี keyword ชื่อ <strong><code>Wait For UI</code></strong> ที่ข้างในคือ <code>time.sleep(seconds)</code> เฉยๆ (ดูซอร์สจริง: <code>def wait_for_ui(self, seconds=1.0): time.sleep(float(seconds))</code>) — เดาเวลาแบบตายตัว ถ้าเครื่อง CI ช้ากว่าที่เดาไว้ ก็ยัง fail เหมือนเดิม เพิ่มเวลาเท่าไหร่ก็แค่ลดโอกาส ไม่ได้แก้ปัญหาที่ต้นตอ<br/><br/>
    keyword <code>Element Should Exist</code> ในไลบรารีเดียวกันตรวจสอบสภาพจริงผ่าน macOS Accessibility tree (เดินสคริปต์ <code>osascript</code> หา <code>AXIdentifier</code> จริงบนหน้าจอ) ไม่ใช่การเดาเวลา — ตรงกับแนวคิดเดียวกับ <code>_wait_for_window</code> ที่ <code>Launch Kouen</code> ใช้ภายใน (polling เช็คจำนวนหน้าต่างทุก 0.5 วินาทีจนกว่าจะเจอ แทนที่จะ sleep ค่าคงที่) แต่ library ไม่ได้บังคับเช็คแบบนี้ให้อัตโนมัติก่อน <code>Type Text</code> ทุกครั้ง — ผู้เขียนเทสต้องเรียก <code>Element Should Exist</code> เองก่อนพิมพ์ทุกครั้งที่ element นั้นอาจจะยังโหลดไม่เสร็จ`,
    example: `// ไม่ควรทำ: Wait For UI คือ time.sleep() ตายตัว เดาเวลาไม่แม่น เครื่อง CI ช้ากว่าปกติก็ยัง fail
Click UI Element    save-button
Wait For UI    2
Type Text    my-file.txt

// ควรทำ: เช็คสภาพจริงผ่าน accessibility tree ก่อนเสมอ ไม่ว่าเครื่องจะช้าหรือเร็ว
Click UI Element    save-button
Element Should Exist    filename-field
Type Text    my-file.txt`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. หลังคลิก <code>search-field</code> แล้ว ให้เช็ค <code>Element Should Exist    search-field</code> ก่อนเสมอ (ห้ามใช้การหน่วงเวลาคงที่)<br/>
    2. เมื่อมั่นใจว่า element พร้อมแล้ว ให้พิมพ์ <code>Type Text    AAPL</code>`
  },
  {
    id: "dialog_confirm_identifier",
    meta: "บทที่ 14",
    title: "Confirm Dialog: เช็ค Accessibility Identifier ก่อน Automate เสมอ",
    template: `*** Test Cases ***
Confirm Before Closing Session
    # หมายเหตุ: dialog ปิด session จริงใน confirmCloseSession() ยังไม่มี accessibility identifier บนปุ่มเลย (เช็ค source แล้ว) สมมติว่า Dev เพิ่ม identifier 'dialog-confirm-close' ให้แล้วตามคำแนะนำ
    # 1. เช็คก่อนเสมอว่าปุ่มยืนยัน 'dialog-confirm-close' มีอยู่จริง ก่อนจะคลิก
    # WRITE YOUR CODE HERE

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเช็ค Identifier ก่อน Automate Dialog...");

      const checkExist = rfLineMatch(code, /Element Should Exist\s{2,}dialog-confirm-close/, "Test Cases") ||
                         rfLineMatch(code, /Element Should Exist\t+dialog-confirm-close/, "Test Cases");
      if (checkExist) {
        log("✓ ขั้นตอนที่ 1: เช็ค Element Should Exist    dialog-confirm-close ก่อนคลิกถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Element Should Exist    dialog-confirm-close\nตัวอย่าง: Element Should Exist    dialog-confirm-close");
      }

      const checkClick = rfLineMatch(code, /Click UI Element\s{2,}dialog-confirm-close/, "Test Cases") ||
                         rfLineMatch(code, /Click UI Element\t+dialog-confirm-close/, "Test Cases");
      if (checkClick) {
        log("✓ ขั้นตอนที่ 2: คลิกปุ่มยืนยันถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Click UI Element    dialog-confirm-close\nตัวอย่าง: Click UI Element    dialog-confirm-close");
      }
    },
    hint: "ก่อน automate ปุ่มที่เพิ่งได้ identifier มาใหม่ ให้ยึดหลักเดิมจากบทที่แล้ว: ยืนยันการมีอยู่จริงของอิลิเมนต์ก่อนเสมอ แล้วจึงค่อยคลิกอิลิเมนต์เป้าหมายเดียวกันนั้น",
    solution: `*** Test Cases ***
Confirm Before Closing Session
    Element Should Exist    dialog-confirm-close
    Click UI Element    dialog-confirm-close`,
    theory: `ในโค้ดจริงของ <code>confirmCloseSession()</code> (<code>KouenSidebarPanelViewController+RecentProjects.swift</code>) มี NSAlert ถามยืนยันก่อนปิด session:<br/><br/>
    <code>let alert = NSAlert()<br/>
    alert.addButton(withTitle: "Close Session")<br/>
    alert.addButton(withTitle: "Cancel")<br/>
    alert.buttons[0].keyEquivalent = ""<br/>
    alert.buttons[1].keyEquivalent = ""</code><br/><br/>
    ตรวจสอบซอร์สทั้ง repo แล้วพบว่า<strong>ไม่มีปุ่ม Alert ตัวไหนเลยที่ตั้งค่า <code>accessibilityIdentifier</code></strong> ไว้ — และ Dev ยังจงใจล้าง <code>keyEquivalent</code> ของทั้งสองปุ่มเป็นค่าว่าง (ปิดทางลัดคีย์บอร์ด Return/Escape ด้วย) ซึ่งหมายความว่า <strong>วันนี้ยังไม่มีทางอัตโนมัติคลิกปุ่มนี้ได้เลยสักทาง</strong> ทั้งผ่าน <code>Click UI Element</code> (หา AXIdentifier ไม่เจอ) และผ่านคีย์ลัด (ถูกปิดไว้)<br/><br/>
    นี่คือปัญหาจริงที่พบบ่อยในงาน Automation: <strong>ไม่ใช่ทุกปัญหาแก้ได้ด้วยเทคนิค RF ที่ฉลาดขึ้น</strong> บางครั้ง UI ที่ Dev สร้างมายังไม่ได้ "เปิดช่องให้อัตโนมัติ" เลยด้วยซ้ำ ทางแก้ที่ถูกต้องคือ (1) เช็คด้วย <code>Element Should Exist</code> ก่อนคลิกทุกครั้ง ถ้าไม่เจอให้หยุดและแจ้งกลับทีม Dev ให้เพิ่ม <code>accessibilityIdentifier</code> พร้อมเสนอชื่อที่ตกลงกันไว้ล่วงหน้า ไม่ใช่ (2) วน retry คลิกซ้ำๆ ไปเรื่อยๆ เพราะปัญหาไม่ได้อยู่ที่ timing`,
    example: `// ตัวอย่างเช็คก่อนคลิกปุ่มลบ workspace ที่มี Alert แบบเดียวกัน (deleteWorkspaceFromMenu)
Element Should Exist    dialog-delete-workspace-confirm
Click UI Element        dialog-delete-workspace-confirm`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (สมมติว่า Dev เพิ่ม identifier ตามคำแนะนำแล้ว) โดย:<br/>
    1. เช็คด้วย <code>Element Should Exist    dialog-confirm-close</code> ก่อนคลิกทุกครั้ง<br/>
    2. คลิกยืนยันด้วย <code>Click UI Element    dialog-confirm-close</code>`
  },
  {
    id: "loading_state_check",
    meta: "บทที่ 15",
    title: "Loading State: เช็คให้ Loading หายไปก่อน ไม่ใช่หน่วงเวลาคงที่",
    template: `*** Test Cases ***
Wait For Task List Ready
    # หมายเหตุ: ProgressView ตอน isLoading จริงใน TaskDashboardView.swift ยังไม่มี accessibility identifier (เช็ค source แล้ว) สมมติว่า Dev เพิ่ม identifier 'task-dashboard-loading' ให้แล้วตามคำแนะนำ
    # 1. วนเช็คด้วย Wait Until Keyword Succeeds สูงสุด 10 ครั้ง ห่างกันครั้งละ 0.5 วินาที จนกว่า element 'task-dashboard-loading' จะหายไปจากจอ (ห้ามหน่วงเวลาคงที่แทน)
    # WRITE YOUR CODE HERE

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการรอ Loading State หายไป...");

      if (rfLineMatch(code, /Wait For UI/i, "Test Cases")) {
        throw new Error("ห้ามใช้ Wait For UI (หน่วงเวลาคงที่) แทนการเช็คว่า Loading หายไปจริงหรือยัง");
      }

      const checkWait = rfLineMatch(code, /Wait Until Keyword Succeeds\s{2,}10x\s{2,}0\.5s\s{2,}Element Should Not Exist\s{2,}task-dashboard-loading/, "Test Cases") ||
                        rfLineMatch(code, /Wait Until Keyword Succeeds\t+10x\t+0\.5s\t+Element Should Not Exist\t+task-dashboard-loading/, "Test Cases");
      if (checkWait) {
        log("✓ วนเช็คด้วย Wait Until Keyword Succeeds 10x/0.5s จนกว่า Loading จะหายไปถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Wait Until Keyword Succeeds    10x    0.5s    Element Should Not Exist    task-dashboard-loading");
      }
    },
    hint: "รวมสองเทคนิคที่เรียนมาแล้วเข้าด้วยกัน: คีย์เวิร์ดวน retry เรียกอีกคีย์เวิร์ดหนึ่งซ้ำจนสำเร็จ (จากบทก่อนหน้า) ผสานกับคีย์เวิร์ดที่เช็คว่าอิลิเมนต์หายไปจากจอแล้ว — ใส่จำนวนครั้งและช่วงเวลาตามที่ task ระบุ",
    solution: `*** Test Cases ***
Wait For Task List Ready
    Wait Until Keyword Succeeds    10x    0.5s    Element Should Not Exist    task-dashboard-loading`,
    theory: `ในโค้ดจริงของ <code>TaskDashboardView.swift</code>:<br/><br/>
    <code>@State private var isLoading = true<br/>
    ...<br/>
    if isLoading {<br/>
    &nbsp;&nbsp;ProgressView().controlSize(.small)<br/>
    }</code><br/><br/>
    Task Dashboard แสดง <code>ProgressView</code> ระหว่างโหลดข้อมูลจริง เวลาโหลดขึ้นอยู่กับจำนวน session/task และความเร็วเครื่อง ไม่คงที่ — ใส่ <code>Wait For UI    2</code> เดาเวลาจึงพังได้ทั้งสองทาง (เร็วไปยัง loading อยู่, ช้าไปเสียเวลาฟรี)<br/><br/>
    เทคนิคที่ถูกต้อง: รวม <code>Element Should Not Exist</code> (เช็คว่า loading indicator หายไปหรือยัง) เข้ากับ <code>Wait Until Keyword Succeeds</code> (จากบทที่ 12) เพื่อวนเช็คซ้ำจนกว่าจะหายไปจริงหรือครบจำนวนครั้ง — ผสานสองเทคนิคที่เรียนมาแล้วเข้าด้วยกันเป็นรูปแบบมาตรฐานสำหรับรอ Loading State ใดๆ`,
    example: `// ตัวอย่างรอ Loading หายไปก่อนอ่านค่าจำนวน Task ทั้งหมด
Wait Until Keyword Succeeds    10x    0.5s    Element Should Not Exist    task-dashboard-loading
\${count}=    Get Window Count`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (สมมติว่า Dev เพิ่ม identifier ตามคำแนะนำแล้ว) โดย:<br/>
    1. วนเช็คด้วย <code>Wait Until Keyword Succeeds    10x    0.5s    Element Should Not Exist    task-dashboard-loading</code> จนกว่า Loading จะหายไป`
  },
  {
    id: "file_import_open_panel",
    meta: "บทที่ 16",
    title: "File Import: เปิดโฟลเดอร์ผ่าน NSOpenPanel ด้วยคีย์ลัด",
    template: `*** Test Cases ***
Import Project Folder Via Open Panel
    # หมายเหตุ: ปุ่มเปิดโฟลเดอร์ใน addSession() จริงยังไม่มี accessibility identifier (เช็ค source แล้ว) สมมติว่า Dev เพิ่ม identifier 'sidebar-add-session' ให้แล้วตามคำแนะนำ
    Click UI Element    sidebar-add-session
    # 1. เปิดช่อง "Go to Folder" ของ Open Panel ด้วยคีย์ลัดมาตรฐาน macOS (ไม่เจาะจง Kouen)
    # WRITE YOUR CODE HERE


    # 2. พิมพ์ path '/tmp/demo-project' แล้วกด Enter เพื่อเปิดโฟลเดอร์นั้น

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเปิดไฟล์ผ่าน NSOpenPanel...");

      const checkGoToFolder = rfLineMatch(code, /Press Shortcut\s{2,}cmd\+shift\+g/, "Test Cases") ||
                              rfLineMatch(code, /Press Shortcut\t+cmd\+shift\+g/, "Test Cases");
      if (checkGoToFolder) {
        log("✓ ขั้นตอนที่ 1: เปิดช่อง Go to Folder ด้วย Press Shortcut    cmd+shift+g ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Press Shortcut    cmd+shift+g\nตัวอย่าง: Press Shortcut    cmd+shift+g");
      }

      const checkType = rfLineMatch(code, /Type Text\s{2,}\/tmp\/demo-project/, "Test Cases") ||
                        rfLineMatch(code, /Type Text\t+\/tmp\/demo-project/, "Test Cases");
      if (checkType) {
        log("✓ ขั้นตอนที่ 2a: พิมพ์ path /tmp/demo-project ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Type Text    /tmp/demo-project\nตัวอย่าง: Type Text    /tmp/demo-project");
      }

      const checkReturn = rfLineMatch(code, /Press Shortcut\s{2,}return/, "Test Cases") ||
                          rfLineMatch(code, /Press Shortcut\t+return/, "Test Cases");
      if (checkReturn) {
        log("✓ ขั้นตอนที่ 2b: กด Enter เพื่อเปิดโฟลเดอร์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Press Shortcut    return\nตัวอย่าง: Press Shortcut    return");
      }
    },
    hint: "Open Panel ของ macOS เป็น system sheet ที่ไม่มี AXIdentifier ให้เกาะ — ใช้คีย์ลัดมาตรฐานของ Finder/Open Panel เพื่อเปิดช่องพิมพ์ path ตรงๆ แทน แล้วพิมพ์พิกัดโฟลเดอร์ตามที่ task ระบุ ปิดท้ายด้วยคีย์ลัดยืนยัน",
    solution: `*** Test Cases ***
Import Project Folder Via Open Panel
    Click UI Element    sidebar-add-session
    Press Shortcut    cmd+shift+g
    Type Text    /tmp/demo-project
    Press Shortcut    return`,
    theory: `ในโค้ดจริงของ <code>addSession()</code> (<code>KouenSidebarPanelViewController.swift</code>) การเลือกโฟลเดอร์โปรเจกใหม่ใช้ <code>NSOpenPanel</code> ของระบบปฏิบัติการโดยตรง:<br/><br/>
    <code>let panel = NSOpenPanel()<br/>
    panel.canChooseDirectories = true<br/>
    panel.canChooseFiles = false<br/>
    panel.prompt = "Open"<br/>
    panel.message = "Choose a project folder"<br/>
    panel.begin { response in ... }</code><br/><br/>
    <code>NSOpenPanel</code> เป็น <strong>system sheet ของ macOS เอง</strong> ไม่ใช่ SwiftUI view ที่ Dev เขียนขึ้นเอง — จะไปตั้งค่า <code>accessibilityIdentifier</code> ให้ปุ่ม/รายการไฟล์ข้างในแบบเดียวกับ UI ของแอปตัวเองไม่ได้ วิธีที่เสถียรที่สุดคือใช้ <strong>คีย์ลัดมาตรฐานของ macOS Open/Save Panel ทุกตัว</strong> (ใช้ได้กับทุกแอปที่ใช้ Open Panel ไม่ใช่แค่ Kouen): กด <code>Cmd+Shift+G</code> เพื่อเปิดช่อง "Go to Folder" พิมพ์ path เต็มลงไปตรงๆ แล้วกด <code>Enter</code> เพื่อยืนยัน — ข้าม UI element ทั้งหมดของ panel ไปเลย ไม่ต้องพึ่ง AXIdentifier ใดๆ<br/><br/>
    เทคนิคนี้ใช้ทั่วไปได้กับ Native File Picker ของ macOS ทุกตัว ต่างจากปุ่มในแอปเองที่ต้องพึ่ง <code>Click UI Element</code>/<code>AXIdentifier</code> ตามที่เรียนมาในบทก่อนหน้า`,
    example: `// ตัวอย่างเปิดไฟล์ (ไม่ใช่โฟลเดอร์) ผ่าน Open Panel ด้วยเทคนิคเดียวกัน
Press Shortcut    cmd+shift+g
Type Text         /Users/demo/config.yaml
Press Shortcut    return`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (สมมติว่า Dev เพิ่ม identifier ปุ่มกระตุ้นตามคำแนะนำแล้ว) โดย:<br/>
    1. เปิดช่อง "Go to Folder" ด้วย <code>Press Shortcut    cmd+shift+g</code><br/>
    2. พิมพ์ path <code>/tmp/demo-project</code> ด้วย <code>Type Text</code> แล้วกด <code>Press Shortcut    return</code> เพื่อยืนยันเปิดโฟลเดอร์`
  },
  {
    id: "keyword_composition",
    meta: "ขั้นสูง 1",
    title: "ประกอบคีย์เวิร์ดขึ้นใช้เอง (Keyword Composition)",
    template: `*** Keywords ***
Open File Via Command Palette
    [Arguments]    \${filename}
    # 1. ประกอบคีย์เวิร์ดนี้จากคีย์เวิร์ดพื้นฐาน 3 ตัวเรียงต่อกันตามลำดับ:
    #    a) เปิด Command Palette ด้วยคีย์เวิร์ดสำเร็จรูปของ kouen.resource (ไม่รับอาร์กิวเมนต์เลย)
    #    b) พิมพ์ชื่อไฟล์ \${filename} ที่รับเข้ามาลงไปในช่องที่เปิดอยู่
    #    c) กดคีย์ลัดยืนยันเพื่อเปิดไฟล์ที่เลือกไว้
    # WRITE YOUR CODE HERE



*** Test Cases ***
Open Demo File From Palette
    # 2. เรียกใช้คีย์เวิร์ดที่เพิ่งประกอบขึ้นเองด้านบน ส่งชื่อไฟล์ 'demo.robot' เป็นอาร์กิวเมนต์
    # WRITE YOUR CODE HERE

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการประกอบคีย์เวิร์ดขึ้นใช้เอง (Keyword Composition)...");

      const checkArgs = rfLineMatch(code, /\[Arguments\]\s{2,}\${filename}/, "Keywords") ||
                        rfLineMatch(code, /\[Arguments\]\t+\${filename}/, "Keywords");
      if (checkArgs) {
        log("✓ ขั้นตอนที่ 1a: คีย์เวิร์ดใหม่รับอาร์กิวเมนต์ \${filename} ถูกต้อง");
      } else {
        throw new Error("ไม่พบการประกาศ [Arguments] รับตัวแปร \${filename} ในคีย์เวิร์ดที่สร้างขึ้นใหม่\nตัวอย่าง: [Arguments]    \${filename}");
      }

      const checkPalette = rfLineMatch(code, /Open Command Palette/, "Keywords");
      if (checkPalette) {
        log("✓ ขั้นตอนที่ 1b: เรียกเปิด Command Palette ด้วยคีย์เวิร์ดสำเร็จรูปถูกต้อง");
      } else {
        throw new Error("ไม่พบการเรียกคีย์เวิร์ด Open Command Palette ภายในคีย์เวิร์ดที่ประกอบขึ้นใหม่");
      }

      const checkType = rfLineMatch(code, /Type Text\s{2,}\${filename}/, "Keywords") ||
                        rfLineMatch(code, /Type Text\t+\${filename}/, "Keywords");
      if (checkType) {
        log("✓ ขั้นตอนที่ 1c: พิมพ์ชื่อไฟล์ \${filename} ลงในช่องถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Type Text    \${filename} ภายในคีย์เวิร์ดที่ประกอบขึ้นใหม่");
      }

      const checkReturn = rfLineMatch(code, /Press Shortcut\s{2,}return/, "Keywords") ||
                          rfLineMatch(code, /Press Shortcut\t+return/, "Keywords");
      if (checkReturn) {
        log("✓ ขั้นตอนที่ 1d: กดคีย์ลัดยืนยันเปิดไฟล์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Press Shortcut    return ภายในคีย์เวิร์ดที่ประกอบขึ้นใหม่");
      }

      const checkUsage = rfLineMatch(code, /Open File Via Command Palette\s{2,}demo\.robot/, "Test Cases") ||
                         rfLineMatch(code, /Open File Via Command Palette\t+demo\.robot/, "Test Cases");
      if (checkUsage) {
        log("✓ ขั้นตอนที่ 2: เรียกใช้คีย์เวิร์ดที่ประกอบขึ้นเองพร้อมส่งชื่อไฟล์ demo.robot สำเร็จ");
      } else {
        throw new Error("ไม่พบการเรียกใช้ Open File Via Command Palette    demo.robot ในบล็อก *** Test Cases ***");
      }
    },
    hint: "คีย์เวิร์ดใหม่นี้ต้องรับพารามิเตอร์ชื่อไฟล์เข้ามาก่อน (ทบทวนวิธีรับอาร์กิวเมนต์จากบทที่ 3) จากนั้นเรียงประกอบคีย์เวิร์ดสำเร็จรูป 3 ตัวต่อกันตามลำดับที่คอมเมนต์ระบุไว้ในเทมเพลต — คีย์เวิร์ดตัวแรกไม่รับอาร์กิวเมนต์ ตัวที่สองรับตัวแปรที่เพิ่งประกาศ ตัวที่สามกดคีย์ลัดมาตรฐานตัวเดียวกับที่เคยใช้ยืนยันในบทเรียนก่อนหน้า จากนั้นในเทสเคสให้เรียกคีย์เวิร์ดใหม่นี้พร้อมส่งชื่อไฟล์ตามที่ task ระบุ",
    solution: `*** Keywords ***
Open File Via Command Palette
    [Arguments]    \${filename}
    Open Command Palette
    Type Text    \${filename}
    Press Shortcut    return

*** Test Cases ***
Open Demo File From Palette
    Open File Via Command Palette    demo.robot`,
    theory: `การเขียนเทสจริงมักเจอขั้นตอนซ้ำๆ ที่ประกอบจากคีย์เวิร์ดพื้นฐานหลายตัวเรียงกันเสมอ (เปิดพาเลตคำสั่ง → พิมพ์ชื่อไฟล์ → กดยืนยัน) หากเขียนคีย์เวิร์ดพื้นฐานเหล่านี้ซ้ำในทุกเทสเคสที่ต้องเปิดไฟล์ จะบำรุงรักษายาก — ถ้าพฤติกรรมของ Command Palette เปลี่ยน (เช่น ต้องกดคีย์ลัดเพิ่มก่อนพิมพ์) ต้องไปแก้ทุกจุดที่เขียนซ้ำไว้<br/><br/>
    การ<strong>ประกอบคีย์เวิร์ด (Keyword Composition)</strong> คือการห่อคีย์เวิร์ดพื้นฐานหลายตัวไว้ในคีย์เวิร์ดใหม่ที่ตั้งชื่อสื่อความหมายระดับสูงขึ้น (เช่น <code>Open File Via Command Palette</code>) แล้วให้ทุกเทสเคสเรียกใช้คีย์เวิร์ดระดับสูงนี้แทน — ต่างจากบทที่ 3 ที่สอนแค่การรับอาร์กิวเมนต์ผ่าน <code>[Arguments]</code> ตัวเดียว บทนี้ต้องนำแนวคิดนั้นมาผสานกับการเรียงเรียกคีย์เวิร์ดสำเร็จรูปหลายตัวให้ทำงานเป็นชุดเดียว ซึ่งเป็นรูปแบบที่ใช้บ่อยที่สุดในการเขียน Test Suite จริงระดับ production`,
    example: `// ตัวอย่างคีย์เวิร์ดประกอบอีกแบบ: ปิดแท็บปัจจุบันพร้อมยืนยันว่าจำนวนแท็บลดลงจริง
*** Keywords ***
Close Current Tab And Verify
    [Arguments]    \${expected_remaining}
    Press Shortcut    cmd+w
    \${count}=    Get Window Count
    Should Be Equal As Integers    \${count}    \${expected_remaining}`,
    task: `จงประกอบคีย์เวิร์ดขึ้นใช้เองและเรียกใช้งานจริง โดย:<br/>
    1. สร้างคีย์เวิร์ด <code>Open File Via Command Palette</code> รับอาร์กิวเมนต์ <code>\${filename}</code> แล้วเรียงคำสั่งภายใน 3 ขั้นตอนตามที่คอมเมนต์ในเทมเพลตระบุ<br/>
    2. เรียกใช้คีย์เวิร์ดที่ประกอบขึ้นใหม่นี้ในบล็อก <code>*** Test Cases ***</code> พร้อมส่งชื่อไฟล์ <code>demo.robot</code>`
  },
  {
    id: "debug_flaky_sleep",
    meta: "ขั้นสูง 2",
    title: "Debug Flaky Test: แก้ Sleep คงที่ด้วย Explicit Wait ให้ถูกจุด",
    template: `*** Test Cases ***
Load Recent Sessions List
    Click UI Element    sidebar-recent-tab
    # บั๊ก: เทสนี้ flaky บน CI เพราะรายชื่อ session โหลดผ่าน async เบื้องหลัง บางเครื่องใช้เวลานานกว่า 2 วินาทีที่ hardcode ไว้ด้านล่าง
    Sleep    2s
    Element Should Exist    session-list-item
    # 1. แก้บั๊ก flaky ด้านบน: ลบบรรทัด Sleep ทิ้ง (ห้ามแค่เพิ่มเวลา Sleep ให้นานขึ้นเป็นทางแก้)
    #    แล้วแทนที่สองบรรทัดข้างบนด้วยคีย์เวิร์ดที่วนเช็คสภาพจริงว่า 'session-list-item' ปรากฏหรือยัง
    #    สูงสุด 8 ครั้ง ห่างกันครั้งละ 1 วินาที
    # WRITE YOUR CODE HERE

    `,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแก้ Flaky Test จาก Sleep คงที่...");

      const sleepUsed = rfLineMatch(code, /Sleep\s{2,}/i, "Test Cases") ||
                        rfLineMatch(code, /Sleep\t+/i, "Test Cases");
      if (sleepUsed) {
        throw new Error("ยังพบคำสั่ง Sleep หลงเหลืออยู่ในเทสเคส — ห้ามแก้ flaky test ด้วยการเพิ่มหรือคงคำสั่งหน่วงเวลาคงที่ไว้ ต้องลบทิ้งแล้วแทนที่ด้วยคีย์เวิร์ดที่วนเช็คสภาพจริงแทน");
      }

      const checkWait = rfLineMatch(code, /Wait Until Keyword Succeeds\s{2,}8x\s{2,}1s\s{2,}Element Should Exist\s{2,}session-list-item/, "Test Cases") ||
                        rfLineMatch(code, /Wait Until Keyword Succeeds\t+8x\t+1s\t+Element Should Exist\t+session-list-item/, "Test Cases");
      if (checkWait) {
        log("✓ แก้ไข flaky test ด้วยการวนเช็คสภาพจริงแทนการหน่วงเวลาคงที่สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่งแก้ไขที่ถูกต้อง\nตัวอย่าง: Wait Until Keyword Succeeds    8x    1s    Element Should Exist    session-list-item");
      }
    },
    hint: "ต้นตอบั๊กนี้คือการหน่วงเวลาคงที่ (ตายตัว) ก่อนเช็คอิลิเมนต์ที่โหลดแบบ async — ทางแก้ไม่ใช่การเดาเวลาให้นานขึ้น แต่ต้องลบ Sleep ออกไปทั้งหมด แล้วผสานคีย์เวิร์ดวนเช็คซ้ำ (ทบทวนบทที่ 12) เข้ากับคีย์เวิร์ดตรวจสอบการมีอยู่ของอิลิเมนต์ (ทบทวนบทที่ 5) เข้าด้วยกันเป็นคำสั่งเดียว โดยกำหนดจำนวนครั้งและช่วงเวลาตามที่คอมเมนต์ในเทมเพลตระบุ",
    solution: `*** Test Cases ***
Load Recent Sessions List
    Click UI Element    sidebar-recent-tab
    Wait Until Keyword Succeeds    8x    1s    Element Should Exist    session-list-item`,
    theory: `ทีมพัฒนามักแก้ flaky test ด้วยวิธีที่ผิดที่สุดโดยไม่รู้ตัว: เจอเทส fail บน CI ก็เพิ่มตัวเลขใน <code>Sleep</code> ให้นานขึ้นเรื่อยๆ (2s → 5s → 10s) ซึ่งไม่ได้แก้ต้นตอเลย เพราะ <code>Sleep</code> คือการเดาเวลาแบบตายตัว ไม่ว่าจะเดานานแค่ไหนก็ยังมีโอกาส fail ได้เสมอถ้าเครื่อง CI ช้ากว่าที่เดาไว้ในวันนั้น (และวันที่โหลดเร็วกว่าปกติก็เสียเวลารอฟรีทุก run)<br/><br/>
    รายชื่อ session ใน sidebar ของ Kouen โหลดจากการสแกน worktree ที่มีอยู่จริงในระบบไฟล์แบบ async เบื้องหลัง เวลาที่ใช้ขึ้นอยู่กับจำนวน session และความเร็วดิสก์ของเครื่องที่รันเทส ไม่คงที่ — การแก้ที่ถูกต้องคือรื้อ <code>Sleep</code> ทิ้งทั้งหมด แล้วแทนที่ด้วยการผสาน <code>Wait Until Keyword Succeeds</code> (วนรอ) เข้ากับ <code>Element Should Exist</code> (เช็คสภาพจริง) แบบเดียวกับที่เรียนมาแล้วในบทที่ 12 และ 15 — จุดต่างของบทนี้คือต้อง<strong>ดีบักโค้ดที่มีบั๊กอยู่แล้ว</strong>ด้วยตัวเอง ไม่ใช่แค่เติมช่องว่าง และต้องรู้ว่า "เพิ่มเวลา Sleep" ไม่ใช่ทางแก้ที่ยอมรับได้เลยไม่ว่าจะเพิ่มเท่าไหร่ก็ตาม`,
    example: `// ตัวอย่างบั๊กแบบเดียวกันในหน้าจออื่น: รอผลลัพธ์คำสั่ง search แบบ async
// ผิด: Sleep    3s ตามด้วยเช็คผล — เดาเวลาตายตัว
// ถูก: วนเช็คสภาพจริงจนกว่าผลลัพธ์จะปรากฏ หรือครบจำนวนครั้งที่กำหนด
Wait Until Keyword Succeeds    6x    0.5s    Element Should Exist    search-result-item`,
    task: `เทสเคส <code>Load Recent Sessions List</code> ด้านขวา flaky บน CI เพราะใช้ <code>Sleep    2s</code> หน่วงเวลาคงที่ก่อนเช็ครายการ session ที่โหลดแบบ async จงดีบักและแก้ไขให้ถูกจุด โดย:<br/>
    1. ลบคำสั่ง <code>Sleep</code> ทิ้ง (ห้ามแก้ด้วยการเพิ่มเวลาหน่วงให้นานขึ้น)<br/>
    2. แทนที่ด้วย <code>Wait Until Keyword Succeeds</code> วนเช็ค <code>Element Should Exist    session-list-item</code> สูงสุด <code>8</code> ครั้ง ห่างกันครั้งละ <code>1</code> วินาที`
  }
];

// Application state

const PREFIX = 'rf';
const TAB_WIDTH = 4;

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
    <div class="terminal-line info">[Robot Runner] กำลังเริ่มรันชุดทดสอบ...</div>
    <div class="terminal-line info">robot --outputdir results/ ${lesson.id}.robot</div>
    <div class="terminal-line text-muted">===================================================</div>
    <div class="terminal-line text-muted">Test Suite: ${lesson.id}</div>
    <div class="terminal-line text-muted">===================================================</div>
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
        <div class="terminal-line text-muted">---------------------------------------------------</div>
        <div class="terminal-line success">Test Case: Verify Scenario | PASS |</div>
        <div class="terminal-line text-muted">---------------------------------------------------</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: ผ่าน (Passed)</strong></div>
        <div class="terminal-line success">1 passed, 0 failed, 0 skipped</div>
        <div class="terminal-line text-muted">===================================================</div>
        <div class="terminal-line info">Output:  results/output.xml</div>
        <div class="terminal-line info">Log:     results/log.html</div>
        <div class="terminal-line info">Report:  results/report.html</div>
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
        <div class="terminal-line text-muted">---------------------------------------------------</div>
        <div class="terminal-line error">Test Case: Verify Scenario | FAIL |</div>
        <div class="terminal-line error">ข้อผิดพลาด: ${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line text-muted">---------------------------------------------------</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">0 passed, 1 failed, 0 skipped</div>
        <div class="terminal-line text-muted">===================================================</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Robot Framework Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณมีความคุ้นเคยอย่างลึกซึ้งในการเขียนโครงสร้างไฟล์ Settings, Variables, Keywords, การควบคุม Native macOS UI ผ่าน KouenUILibrary และ OperatingSystem/Process ของ Robot Framework เรียบร้อยแล้ว!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
  showTrackCertificate('Robot Framework Native UI Testing');
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
  window.QA_TRACKS['robot-framework'] = { id: 'robot-framework', title: 'Robot Framework Native UI Testing', folder: 'Robot-Framework', lessons: LESSONS };
})();
