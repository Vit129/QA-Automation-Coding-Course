// Robot Framework Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/kouen-terminal/Tests/ codebase.

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
      const checkResource = /Resource\s{2,}\.\.\/resources\/kouen\.resource/.test(code) ||
                            /Resource\t+\.\.\/resources\/kouen\.resource/.test(code);
                            
      if (checkResource) {
        log("✓ ขั้นตอนที่ 1: ดึง Resource จากพิกัดที่กำหนดสำเร็จ");
      } else {
        throw new Error("ไม่พบการดึง Resource หรือพิมพ์แยกเว้นวรรคไม่ถูกต้อง\nหมายเหตุ: Robot Framework ใช้ช่องว่างอย่างน้อย 2 เคาะ (Double Spaces) หรือ 1 Tab ในการแยกคีย์เวิร์ด\nตัวอย่าง: Resource         ../resources/kouen.resource");
      }
      
      if (code.includes("Test Setup") && code.includes("Test Teardown")) {
        log("✓ ขั้นตอนที่ 2: ตั้งค่า Setup & Teardown สำเร็จ");
      } else {
        throw new Error("ห้ามแก้ไขตัวสคริปต์ setup/teardown ด้านล่าง");
      }
    },
    hint: "ระบุนำเข้า Resource ด้วยการพิมพ์: Resource          ../resources/kouen.resource (อย่าลืมใช้ 2 ช่องว่างขึ้นไปคั่นคำสั่ง)",
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

      const checkEnv = /\${KOUEN_ENV}\s{2,}preview/.test(code) ||
                           /\${KOUEN_ENV}\t+preview/.test(code);

      if (checkEnv) {
        log("✓ ขั้นตอนที่ 1: ประกาศตัวแปรสเกลาร์ ${KOUEN_ENV} สำเร็จ");
      } else {
        throw new Error("การตั้งค่าตัวแปร ${KOUEN_ENV} คลาดเคลื่อน หรือเว้นวรรคคำไม่ถึง 2 เคาะ\nตัวอย่าง: \${KOUEN_ENV}    preview");
      }

      const checkShortcuts = /@{PANE_SHORTCUTS}\s{2,}cmd\+d\s{2,}cmd\+w/.test(code) ||
                           /@{PANE_SHORTCUTS}\t+cmd\+d\t+cmd\+w/.test(code) ||
                           /@{PANE_SHORTCUTS}\s{2,}cmd\+d\t+cmd\+w/.test(code);

      if (checkShortcuts) {
        log("✓ ขั้นตอนที่ 2: ประกาศตัวแปรรายการลิสต์ @{PANE_SHORTCUTS} สำเร็จ");
      } else {
        throw new Error("การกำหนดตัวแปร @{PANE_SHORTCUTS} ไม่ถูกต้อง ต้องระบุค่า cmd+d และ cmd+w แยกกันตัวละ 2 ช่องว่าง\nตัวอย่าง: @{PANE_SHORTCUTS}    cmd+d    cmd+w");
      }
    },
    hint: "กำหนดตัวแปรเดี่ยวด้วย \${KOUEN_ENV}    preview และตัวแปรกลุ่มด้วย @{PANE_SHORTCUTS}    cmd+d    cmd+w (เว้นวรรค 2 ช่องขึ้นไปคั่นแต่ละค่า)",
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

      const checkArgs = /\[Arguments\]\s{2,}\${filename}/.test(code) ||
                        /\[Arguments\]\t+\${filename}/.test(code);

      if (checkArgs) {
        log("✓ ขั้นตอนที่ 1: กำหนดการรับค่าอาร์กิวเมนต์ [Arguments] ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง [Arguments] เพื่อระบุตัวแปรสืบทอด \${filename}\nตัวอย่าง: [Arguments]    \${filename}");
      }

      const checkType = /Type Text\s{2,}\${filename}/.test(code) ||
                         /Type Text\t+\${filename}/.test(code);

      if (checkType) {
        log("✓ ขั้นตอนที่ 2: ผูกการพิมพ์คีย์บอร์ดเข้ากับ Command Palette สำเร็จ");
      } else {
        throw new Error("การเขียนคีย์เวิร์ดป้อนข้อมูลไม่ถูกต้อง\nตัวอย่าง: Type Text    \${filename}");
      }
    },
    hint: "พิมพ์ย่อหน้าเคาะ 4 ช่องว่างระบุ: [Arguments]    \${filename} และบรรทัดถัดไปใช้คำสั่ง: Type Text    \${filename}",
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
      
      const checkRemove = /Remove File\s{2,}\${CONFIG_FILE}/.test(code) ||
                          /Remove File\t+\${CONFIG_FILE}/.test(code);
                          
      if (checkRemove) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบสคริปต์สืบจับและสั่งลบไฟล์เก่าทิ้งสำเร็จ");
      } else {
        throw new Error("ไม่พบคีย์เวิร์ดลบไฟล์คอนฟิกเก่าทิ้ง หรือระบุตัวแปรไฟล์ปลายทางคลาดเคลื่อน\nตัวอย่าง: Remove File    \${CONFIG_FILE}");
      }
      
      const checkCreate = /Create File\s{2,}\${CONFIG_FILE}\s{2,}kouen\.toast\("v1"\)/.test(code) ||
                          /Create File\t+\${CONFIG_FILE}\t+kouen\.toast\("v1"\)/.test(code) ||
                          /Create File\s{2,}\${CONFIG_FILE}\s{2,}.*?/.test(code);
                          
      if (checkCreate) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบสคริปต์เขียนทับไฟล์ระบบคอมพิวเตอร์สำเร็จ");
      } else {
        throw new Error("คำสั่งสร้างและเขียนข้อมูลลงไฟล์ไม่ถูกต้อง\nตัวอย่าง: Create File    \${CONFIG_FILE}    kouen.toast(\"v1\")");
      }
    },
    hint: "ใช้คำสั่ง Remove File    \${CONFIG_FILE} เพื่อทำลายไฟล์ และ Create File    \${CONFIG_FILE}    kouen.toast(\"v1\") เพื่อสร้างเขียนข้อมูลทับในตำแหน่งเดิม",
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

      const checkExist = /Element Should Exist\s{2,}new-tab-button/.test(code) ||
                        /Element Should Exist\t+new-tab-button/.test(code);

      if (checkExist) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบสคริปต์ยืนยันอิลิเมนต์มีอยู่จริง (Element Should Exist)");
      } else {
        throw new Error("การระบุคำสั่งตรวจสอบอิลิเมนต์ไม่สมบูรณ์\nตัวอย่าง: Element Should Exist    new-tab-button");
      }

      const checkClick = /Click UI Element\s{2,}new-tab-button/.test(code) ||
                         /Click UI Element\t+new-tab-button/.test(code);

      if (checkClick) {
        log("✓ ขั้นตอนที่ 2: สั่งคลิกที่อิลิเมนต์สำเร็จ");
      } else {
        throw new Error("ไม่พบคีย์เวิร์ดคลิกเป้าหมายปุ่มเปิดแท็บใหม่\nตัวอย่าง: Click UI Element    new-tab-button");
      }
    },
    hint: "ใช้คีย์เวิร์ด Element Should Exist    new-tab-button ในแถวแรก และคลิกด้วย Click UI Element    new-tab-button",
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

      const checkContain = /Kouen Board Should Have Column\s{2,}Backlog/.test(code) ||
                           /Kouen Board Should Have Column\t+Backlog/.test(code);

      if (checkContain) {
        log("✓ ขั้นตอนที่ 1: ใช้คีย์เวิร์ดตรวจสอบคอลัมน์บนกระดาน Backlog ถูกต้อง");
      } else {
        throw new Error("คำสั่งตรวจเช็คคอลัมน์บนกระดานคลาดเคลื่อน\nตัวอย่าง: Kouen Board Should Have Column    Backlog");
      }

      const checkTrue = /Should Be True\s{2,}\${count}\s*>\s*0/.test(code) ||
                        /Should Be True\t+\${count}\s*>\s*0/.test(code);

      if (checkTrue) {
        log("✓ ขั้นตอนที่ 2: ใช้ Should Be True ตรวจสอบประเมินค่าถูกต้อง");
      } else {
        throw new Error("สคริปต์เปรียบเทียบตรรกะตัวเลขด้วยคำสั่ง Should Be True ไม่ถูกต้อง\nตัวอย่าง: Should Be True    \${count} > 0");
      }
    },
    hint: "ใช้คีย์เวิร์ดเช็คคอลัมน์: Kouen Board Should Have Column    Backlog และตรวจตรรกะบูลีนด้วย: Should Be True    \${count} > 0",
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
      
      const checkLaunch = /Launch Process\s{2,}kouen-cli\s{2,}handle=kouen_process/.test(code) ||
                          /Launch Process\t+kouen-cli\t+handle=kouen_process/.test(code);
                          
      if (checkLaunch) {
        log("✓ ขั้นตอนที่ 1: เรียกใช้ Launch Process และส่งค่า handle='kouen_process' ถูกต้อง");
      } else {
        throw new Error("การตั้งคำสั่งรันโปรเซสแอปพลิเคชันไม่ถูกต้อง\nตัวอย่าง: Launch Process    kouen-cli    handle=kouen_process");
      }
      
      const checkWait = /Wait For Process\s{2,}kouen_process\s{2,}timeout=10s/.test(code) ||
                        /Wait For Process\t+kouen_process\t+timeout=10s/.test(code);
                        
      if (checkWait) {
        log("✓ ขั้นตอนที่ 2: สั่งหน่วงรอด้วย Wait For Process สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่ง Wait For Process หรือส่ง handle ไม่ถูกต้อง\nตัวอย่าง: Wait For Process    kouen_process    timeout=10s");
      }
    },
    hint: "ใช้คำสั่ง Launch Process    kouen-cli    handle=kouen_process ในขั้นตอนแรก และสั่งหน่วงรอด้วย Wait For Process    kouen_process    timeout=10s",
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
      
      const checkGet = /\${count}=\s{2,}Get Window Count/.test(code) ||
                       /\${count}=\t+Get Window Count/.test(code) ||
                       /\${count}=\s{2,}KouenUILibrary\.Get Window Count/.test(code);
                       
      if (checkGet) {
        log("✓ ขั้นตอนที่ 1: รับค่าจาก Custom Python Keyword เซฟในตัวแปรสำเร็จ");
      } else {
        throw new Error("รูปแบบรับข้อมูลจากคีย์เวิร์ด Get Window Count ไม่ถูกต้อง\nตัวอย่าง: \${count}=    Get Window Count");
      }
      
      const checkTrue = /Should Be True\s{2,}\${count}\s*>\s*0/.test(code) ||
                        /Should Be True\t+\${count}\s*>\s*0/.test(code);
                        
      if (checkTrue) {
        log("✓ ขั้นตอนที่ 2: เช็คตรรกะจำนวนหน้าต่าง UI สำเร็จ");
      } else {
        throw new Error("กรุณาใช้ Should Be True เช็คความถูกต้องของ \${count} > 0");
      }
    },
    hint: "ป้อนย่อหน้าระบุตัวแปรรับค่า: \${count}=    Get Window Count และแถวถัดไปเปรียบเปรียบเปรียบเทียบ: Should Be True    \${count} > 0",
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
      
      const checkCreate = /Create Directory\s{2,}\${CONFIG_DIR}/.test(code) ||
                          /Create Directory\t+\${CONFIG_DIR}/.test(code);
                          
      if (checkCreate) {
        log("✓ ขั้นตอนที่ 1: เรียกใช้คำสั่ง Create Directory สำเร็จ");
      } else {
        throw new Error("คำสั่งสร้างโฟลเดอร์เป้าหมายไม่ถูกต้อง\nตัวอย่าง: Create Directory    \${CONFIG_DIR}");
      }
      
      const checkExist = /Directory Should Exist\s{2,}\${CONFIG_DIR}/.test(code) ||
                         /Directory Should Exist\t+\${CONFIG_DIR}/.test(code);
                         
      if (checkExist) {
        log("✓ ขั้นตอนที่ 2: เรียกใช้ระบบตรวจจับโฟลเดอร์สำเร็จ");
      } else {
        throw new Error("คำสั่งตรวจสอบความมีอยู่ของโฟลเดอร์ปลายทางไม่ถูกต้อง\nตัวอย่าง: Directory Should Exist    \${CONFIG_DIR}");
      }
    },
    hint: "ใช้คำสั่งสร้างไดเรกทอรี: Create Directory    \${CONFIG_DIR} และสั่งตรวจสอบสถานะโฟลเดอร์ด้วย: Directory Should Exist    \${CONFIG_DIR}",
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
      
      const checkSetup = /\[Setup\]\s{2,}Create Config File/.test(code) ||
                         /\[Setup\]\t+Create Config File/.test(code);
                         
      if (checkSetup) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบสคริปต์ [Setup] สำหรับจำลองเตรียมไฟล์เริ่มต้นเฉพาะเคสสำเร็จ");
      } else {
        throw new Error("คำสั่งการเขียน Setup เฉพาะตัวเทสไม่ถูกต้อง\nตัวอย่าง: [Setup]    Create Config File");
      }
      
      const checkTeardown = /\[Teardown\]\s{2,}Cleanup And Quit/.test(code) ||
                            /\[Teardown\]\t+Cleanup And Quit/.test(code);
                            
      if (checkTeardown) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบสคริปต์ [Teardown] ล้างข้อมูลสำเร็จ");
      } else {
        throw new Error("คำสั่งการเขียน Teardown เฉพาะตัวเทสไม่ถูกต้อง\nตัวอย่าง: [Teardown]    Cleanup And Quit");
      }
    },
    hint: "ใช้คีย์สั่งการเหลี่ยมป้อนข้อมูล: [Setup]    Create Config File และปิดแถวของเทสเคสด้วย: [Teardown]    Cleanup And Quit",
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
      
      const checkRun = /\${result}=\s{2,}Run Process\s{2,}osascript/.test(code) ||
                       /\${result}=\t+Run Process\t+osascript/.test(code) ||
                       /\${result}=\s{2,}Run Process\s{2,}osascript\s+.*?/.test(code);
                       
      if (checkRun) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบคำสั่งเรียกใช้โปรเซส osascript เก็บในตัวแปรสำเร็จ");
      } else {
        throw new Error("คำสั่งรันโปรเซสสคริปต์ปลายทางไม่ถูกต้อง\nตัวอย่าง: \${result}=    Run Process    osascript");
      }
      
      const checkAssert = /Should Be Equal As Integers\s{2,}\${result\.rc}\s{2,}0/.test(code) ||
                          /Should Be Equal As Integers\t+\${result\.rc}\t+0/.test(code);
                          
      if (checkAssert) {
        log("✓ ขั้นตอนที่ 2: ทำการเปรียบเทียบ Exit Code ตัวเลขเป็น 0 ถูกต้อง");
      } else {
        throw new Error("การเช็ค Exit Code ด้วย Should Be Equal As Integers ล้มเหลว\nตัวอย่าง: Should Be Equal As Integers    \${result.rc}    0");
      }
    },
    hint: "ใช้ตัวรับพิกัดคำสั่ง: \${result}=    Run Process    osascript และยืนยันความถูกต้องด้วยคำสั่ง: Should Be Equal As Integers    \${result.rc}    0",
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

      const checkRetry = /Wait Until Keyword Succeeds\s{2,}5x\s{2,}2s\s{2,}Verify App Window Ready/.test(code) ||
                         /Wait Until Keyword Succeeds\t+5x\t+2s\t+Verify App Window Ready/.test(code);

      if (checkRetry) {
        log("✓ ขั้นตอนที่ 1: เรียกใช้ Wait Until Keyword Succeeds กำหนด 5x/2s เรียก Verify App Window Ready ถูกต้อง");
      } else {
        throw new Error("คำสั่ง Wait Until Keyword Succeeds ไม่ถูกต้อง\nตัวอย่าง: Wait Until Keyword Succeeds    5x    2s    Verify App Window Ready");
      }
    },
    hint: "ใช้คำสั่งวนซ้ำเรียก keyword ที่อาจ flaky: Wait Until Keyword Succeeds    5x    2s    Verify App Window Ready",
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

      if (/Wait For UI/i.test(code)) {
        throw new Error("ห้ามใช้ Wait For UI (หน่วงเวลาคงที่) แทนการเช็คสภาพจริง — ข้างในคือ time.sleep() เฉยๆ ไม่รู้ว่า element พร้อมจริงหรือยัง");
      }

      const checkExist = /Element Should Exist\s{2,}search-field/.test(code) ||
                         /Element Should Exist\t+search-field/.test(code);
      if (checkExist) {
        log("✓ ขั้นตอนที่ 1: เช็ค Element Should Exist    search-field ก่อนพิมพ์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Element Should Exist    search-field\nตัวอย่าง: Element Should Exist    search-field");
      }

      const checkType = /Type Text\s{2,}AAPL/.test(code) || /Type Text\t+AAPL/.test(code);
      if (checkType) {
        log("✓ ขั้นตอนที่ 2: พิมพ์ข้อความ AAPL ด้วย Type Text หลังยืนยัน element พร้อมแล้วถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Type Text    AAPL\nตัวอย่าง: Type Text    AAPL");
      }
    },
    hint: "เช็คสภาพจริงก่อนด้วย Element Should Exist    search-field แล้วค่อยพิมพ์ด้วย Type Text    AAPL ห้ามหน่วงเวลาคงที่แทนการเช็ค",
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

      const checkExist = /Element Should Exist\s{2,}dialog-confirm-close/.test(code) ||
                         /Element Should Exist\t+dialog-confirm-close/.test(code);
      if (checkExist) {
        log("✓ ขั้นตอนที่ 1: เช็ค Element Should Exist    dialog-confirm-close ก่อนคลิกถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Element Should Exist    dialog-confirm-close\nตัวอย่าง: Element Should Exist    dialog-confirm-close");
      }

      const checkClick = /Click UI Element\s{2,}dialog-confirm-close/.test(code) ||
                         /Click UI Element\t+dialog-confirm-close/.test(code);
      if (checkClick) {
        log("✓ ขั้นตอนที่ 2: คลิกปุ่มยืนยันถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Click UI Element    dialog-confirm-close\nตัวอย่าง: Click UI Element    dialog-confirm-close");
      }
    },
    hint: "เช็คก่อนด้วย Element Should Exist    dialog-confirm-close แล้วค่อยคลิกด้วย Click UI Element    dialog-confirm-close",
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

      if (/Wait For UI/i.test(code)) {
        throw new Error("ห้ามใช้ Wait For UI (หน่วงเวลาคงที่) แทนการเช็คว่า Loading หายไปจริงหรือยัง");
      }

      const checkWait = /Wait Until Keyword Succeeds\s{2,}10x\s{2,}0\.5s\s{2,}Element Should Not Exist\s{2,}task-dashboard-loading/.test(code) ||
                        /Wait Until Keyword Succeeds\t+10x\t+0\.5s\t+Element Should Not Exist\t+task-dashboard-loading/.test(code);
      if (checkWait) {
        log("✓ วนเช็คด้วย Wait Until Keyword Succeeds 10x/0.5s จนกว่า Loading จะหายไปถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Wait Until Keyword Succeeds    10x    0.5s    Element Should Not Exist    task-dashboard-loading");
      }
    },
    hint: "ใช้ Wait Until Keyword Succeeds    10x    0.5s    Element Should Not Exist    task-dashboard-loading",
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

      const checkGoToFolder = /Press Shortcut\s{2,}cmd\+shift\+g/.test(code) ||
                              /Press Shortcut\t+cmd\+shift\+g/.test(code);
      if (checkGoToFolder) {
        log("✓ ขั้นตอนที่ 1: เปิดช่อง Go to Folder ด้วย Press Shortcut    cmd+shift+g ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Press Shortcut    cmd+shift+g\nตัวอย่าง: Press Shortcut    cmd+shift+g");
      }

      const checkType = /Type Text\s{2,}\/tmp\/demo-project/.test(code) ||
                        /Type Text\t+\/tmp\/demo-project/.test(code);
      if (checkType) {
        log("✓ ขั้นตอนที่ 2a: พิมพ์ path /tmp/demo-project ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Type Text    /tmp/demo-project\nตัวอย่าง: Type Text    /tmp/demo-project");
      }

      const checkReturn = /Press Shortcut\s{2,}return/.test(code) ||
                          /Press Shortcut\t+return/.test(code);
      if (checkReturn) {
        log("✓ ขั้นตอนที่ 2b: กด Enter เพื่อเปิดโฟลเดอร์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง Press Shortcut    return\nตัวอย่าง: Press Shortcut    return");
      }
    },
    hint: "ใช้ Press Shortcut    cmd+shift+g เปิดช่อง Go to Folder แล้ว Type Text    /tmp/demo-project จากนั้น Press Shortcut    return",
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
  }
];

// Application state
let currentLessonIndex = 0;

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
    
    // Insert 4 spaces (Robot Framework standard is 4 spaces or tab)
    textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
    
    // Move cursor
    textarea.selectionStart = textarea.selectionEnd = start + 4;
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
  const savedCode = localStorage.getItem(`rf_sandbox_code_${lesson.id}`);
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
  return localStorage.getItem('rf_course_completed_' + lessonId) === 'true';
}

// Mark lesson completed
function setLessonCompleted(lessonId) {
  localStorage.setItem('rf_course_completed_' + lessonId, 'true');
  renderLessonList();
  updateProgressBar();
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
  localStorage.setItem(`rf_sandbox_code_${lesson.id}`, userCode);
  
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
        <div class="terminal-line error">ข้อผิดพลาด: ${err.message.replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line text-muted">---------------------------------------------------</div>
        <div class="terminal-line error">✕ <strong>ผลการรัน: ล้มเหลว (Failed)</strong></div>
        <div class="terminal-line error">0 passed, 1 failed, 0 skipped</div>
        <div class="terminal-line text-muted">===================================================</div>
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
      if (key && (key.startsWith('rf_course_completed_') || key.startsWith('rf_sandbox_code_'))) {
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Robot Framework Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณมีความคุ้นเคยอย่างลึกซึ้งในการเขียนโครงสร้างไฟล์ Settings, Variables, Keywords, การควบคุม Native macOS UI ผ่าน KouenUILibrary และ OperatingSystem/Process ของ Robot Framework เรียบร้อยแล้ว!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

// Run on window boot
window.onload = initApp;
