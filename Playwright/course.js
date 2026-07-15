// Playwright Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/My-Investment-Port/react_typescript_101/ codebase.

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "แนะนำความรู้พื้นฐาน Playwright",
    template: `import { test, expect } from '@playwright/test';
 
 test('TC-H001: ค้นหาหุ้น AAPL', async ({ page }) => {
   // 1. ไปที่หน้า /holdings
   await page.goto('/holdings');
 
   // 2. ค้นหาช่องค้นหา testId = 'search-input' แล้วกรอก 'AAPL'
   // WRITE YOUR CODE HERE
   
   
   // 3. ตรวจสอบว่า table-container มีข้อความ 'AAPL'
   
 });`,
    validate: (code, log) => {
      log("🔍 กำลังตรวจสอบไวยากรณ์...");
      if (code.includes("page.goto('/holdings')")) {
        log("✓ ขั้นตอนที่ 1: ไปที่พิกัด /holdings ถูกต้อง");
      } else {
        throw new Error("ลบคำสั่ง page.goto('/holdings') หรือไม่? กรุณาเขียนคืนด้วย");
      }
      
      const hasFill = /await\s+page\.getByTestId\(['"]search-input['"]\)\.fill\(['"]AAPL['"]\)/.test(code);
      if (hasFill) {
        log("✓ ขั้นตอนที่ 2: ใช้ getByTestId('search-input').fill('AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งกรอกข้อมูล AAPL ลงในช่องค้นหา หรือไม่ได้ค้นหาด้วย TestId 'search-input'\nตัวอย่าง: await page.getByTestId('search-input').fill('AAPL');");
      }
      
      const hasExpect = /await\s+expect\(page\.getByTestId\(['"]table-container['"]\)\)\.toContainText\(['"]AAPL['"]\)/.test(code);
      if (hasExpect) {
        log("✓ ขั้นตอนที่ 3: ใช้ expect(table-container).toContainText('AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งทำ Assertion เพื่อเช็คว่าตารางประกอบด้วยข้อความ AAPL\nตัวอย่าง: await expect(page.getByTestId('table-container')).toContainText('AAPL');");
      }
    },
    hint: "ใช้คำสั่ง page.getByTestId('search-input').fill('AAPL') ในขั้นตอนที่ 2 และเขียน expect(page.getByTestId('table-container')).toContainText('AAPL') ในขั้นตอนที่ 3",
    solution: `import { test, expect } from '@playwright/test';
 
 test('TC-H001: ค้นหาหุ้น AAPL', async ({ page }) => {
   // 1. ไปที่หน้า /holdings
   await page.goto('/holdings');
 
   // 2. ค้นหาช่องค้นหา testId = 'search-input' แล้วกรอก 'AAPL'
   await page.getByTestId('search-input').fill('AAPL');
 
   // 3. ตรวจสอบว่า table-container มีข้อความ 'AAPL'
   await expect(page.getByTestId('table-container')).toContainText('AAPL');
 });`,
    theory: `<strong>Playwright</strong> เป็นเฟรมเวิร์กการทำเว็บออโตเมชันยุคใหม่ (Code-first) ที่ออกแบบโดย Microsoft เพื่อแก้ไขปัญหาความช้าและความไม่เสถียร (Flakiness) ของเครื่องมือยุคก่อน ด้วยสถาปัตยกรรมสำคัญ 3 ข้อ:<br/><br/>
    1. <strong>Auto-waiting</strong>: Playwright จะตรวจสอบความพร้อมของอิลิเมนต์ (Visible, Enabled, Stable) เบื้องหลังโดยอัตโนมัติก่อนที่จะส่งเหตุการณ์คลิกหรือกรอกข้อมูล ป้องกันข้อผิดพลาดจากเน็ตเวิร์กช้า<br/>
    2. <strong>Browser Context Isolation</strong>: ทุกสคริปต์เทสจะได้พื้นที่จัดเก็บเซสชัน คุกกี้ และ LocalStorage แยกขาดจากกันโดยไม่ต้องเปิดเปิดเบราว์เซอร์ใหม่ประหนึ่งเข้าโหมดไม่ระบุตัวตน (Incognito)<br/>
    3. <strong>Web-first Assertions</strong>: ตัวประเมินผลจะส่งคำสั่งวนซ้ำสกรีนตรวจค่าจนสำเร็จ แทนการนอนหลับค้างรอเวลาคงที่ (Static sleep)`,
    example: `// หน้าตาการประกาศสคริปต์ทดสอบมาตรฐานใน Playwright
import { test, expect } from '@playwright/test';
 
test('ทดสอบคลิกปุ่ม', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page).toHaveURL('/dashboard');
});`,
    task: `จงดำเนินการกรอกข้อมูลคำค้นหาหุ้นในสคริปต์ด้านขวาให้สมบูรณ์ โดย:<br/>
    1. กรอกข้อมูลคำว่า <code>'AAPL'</code> ลงในช่องที่มี Test ID เป็น <code>'search-input'</code><br/>
    2. ทำการตรวจสอบและคาดหวังผลว่า อิลิเมนต์ที่มี Test ID เป็น <code>'table-container'</code> จะต้องประกอบด้วยข้อความ <code>'AAPL'</code>`
  },
  {
    id: "concepts",
    meta: "บทที่ 1",
    title: "Core Concepts & Types ที่ต้องรู้",
    template: `import { Page } from '@playwright/test';
 
 async function getHoldingsFromStorage(page: Page): Promise<string | null> {
   // ดึงค่า 'portfolio_holdings' จาก localStorage ของหน้าเว็บและส่งค่ากลับคืนออกไป
   // WRITE YOUR CODE HERE
   
   
 }`,
    validate: (code, log) => {
      log("🔍 วิเคราะห์ความต้องการ...");
      if (!code.includes("page.evaluate")) {
        throw new Error("คุณจำเป็นต้องรันสคริปต์ในฝั่งเบราว์เซอร์ด้วยคำสั่ง page.evaluate()");
      }
      log("✓ ค้นพบคำสั่ง page.evaluate");
      
      if (!code.includes("portfolio_holdings")) {
        throw new Error("ไม่ได้ดึงคีย์คาร์ด 'portfolio_holdings' จากหน่วยความจำเบราว์เซอร์");
      }
      log("✓ ค้นพบตัวแปรเป้าหมาย 'portfolio_holdings'");
      
      const pattern = /await\s+page\.evaluate.*?window\.localStorage\.getItem\(['"]portfolio_holdings['"]\)/s.test(code) || 
                      /await\s+page\.evaluate.*?localStorage\.getItem\(['"]portfolio_holdings['"]\)/s.test(code);
                      
      if (pattern) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ดึงและรีเทิร์นค่า JSON จาก localStorage สำเร็จ");
      } else {
        throw new Error("โค้ดดึงค่าไม่ถูกต้อง\nตัวอย่างการเขียน:\nreturn await page.evaluate(() => localStorage.getItem('portfolio_holdings'));");
      }
    },
    hint: "ใช้คำสั่ง return await page.evaluate(() => localStorage.getItem('portfolio_holdings')) เพื่อสั่งเอาสคริปต์ JavaScript ส่งเข้าไปดึงค่าในเบราว์เซอร์",
    solution: `import { Page } from '@playwright/test';
 
 async function getHoldingsFromStorage(page: Page): Promise<string | null> {
   // ดึงค่า 'portfolio_holdings' จาก localStorage ของหน้าเว็บและส่งค่ากลับคืนออกไป
   return await page.evaluate(() => {
     return window.localStorage.getItem('portfolio_holdings');
   });
 }`,
    theory: `ในระบบของ Playwright มี Core Types สำคัญที่คุณต้องรู้:<br/>
    1. <strong>Page</strong>: หน้าแท็บเบราว์เซอร์เดี่ยว ใช้โต้ตอบหลัก<br/>
    2. <strong>Locator</strong>: ตัวอ้างอิงตีกรอบหาอิลิเมนต์ ซึ่งทำงานแบบ <strong>Lazy Evaluation</strong> (จะทำการคิวรี DOM ค้นหาปุ่มจริง ๆ เฉพาะตอนสั่งคำสั่งแอคชันคลิก/พิมพ์เท่านั้น)<br/>
    3. <strong>page.evaluate()</strong>: เป็นสะพานข้ามผ่านข้อมูล โดยจะส่งโค้ดฟังก์ชันภาษา JavaScript ของคุณข้ามไปทำงานประมวลผลอยู่ฝั่งตัวบราวน์เซอร์จริง ๆ ทำให้เข้าถึงตัวแปรเบราว์เซอร์อย่าง <code>window</code>, <code>document</code> หรือ <code>localStorage</code> ได้โดยตรง`,
    example: `// การเข้าถึง API เบราว์เซอร์ดึงข้อมูล User-Agent ของเครื่อง
const userAgent = await page.evaluate(() => navigator.userAgent);`,
    task: `จงป้อนสคริปต์ฟังก์ชัน <code>getHoldingsFromStorage</code> ให้ผ่านเกณฑ์ตรวจสอบ โดยสั่งให้ระบบข้ามไปดึงข้อมูลในคีย์ <code>'portfolio_holdings'</code> ที่จัดเก็บอยู่ใน <code>localStorage</code> และดึงค่าคืนส่งกลับออกไปภายนอกฟังก์ชัน`
  },
  {
    id: "pom",
    meta: "บทที่ 2",
    title: "Page Object Model (POM) Structure",
    template: `import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
 
export class TaxPage extends BasePage {
  readonly metricsSection: Locator;
 
  constructor(page: Page) {
    // 1. เรียก constructor ของ BasePage เพื่อส่งต่อหน้าเพจ
    // WRITE YOUR CODE HERE
    
    
    // 2. ประกาศ locator สำหรับ 'tax-metrics-section' ด้วย getByTestId
    
  }
 
  async navigate() {
    // 3. เรียก navigateTo ไปหน้า '/tax'
    
  }
}`,
    validate: (code, log) => {
      log("🔍 กำลังตรวจสอบโครงสร้าง Hierarchy...");
      if (code.includes("super(page)")) {
        log("✓ ขั้นตอนที่ 1: เรียก constructor คลาสแม่ด้วย super(page) ถูกต้อง");
      } else {
        throw new Error("คุณลืมเรียกใช้ super(page) ภายใน constructor หรือไม่?");
      }
      
      const hasMetric = /this\.metricsSection\s*=\s*page\.getByTestId\(['"]tax-metrics-section['"]\)/.test(code) ||
                        /this\.metricsSection\s*=\s*this\.page\.getByTestId\(['"]tax-metrics-section['"]\)/.test(code);
      if (hasMetric) {
        log("✓ ขั้นตอนที่ 2: ลงทะเบียนตัวแปร metricsSection สำเร็จ");
      } else {
        throw new Error("ไม่พบการลงทะเบียน metricsSection ด้วยการค้นหา TestId 'tax-metrics-section'\nตัวอย่าง: this.metricsSection = page.getByTestId('tax-metrics-section');");
      }
      
      const hasNav = /await\s+this\.navigateTo\(['"]\/tax['"]\)/.test(code);
      if (hasNav) {
        log("✓ ขั้นตอนที่ 3: เมธอด navigate เรียกใช้งานพิกัด /tax สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่งเปลี่ยนหน้าไปพิกัด '/tax' โดยเรียกผ่าน navigateTo ของคลาสแม่\nตัวอย่าง: await this.navigateTo('/tax');");
      }
    },
    hint: "ภายใน constructor ให้เรียก super(page) และกำหนด this.metricsSection = page.getByTestId('tax-metrics-section') ส่วนเมธอด navigate ให้เรียก await this.navigateTo('/tax')",
    solution: `import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
 
export class TaxPage extends BasePage {
  readonly metricsSection: Locator;
 
  constructor(page: Page) {
    super(page);
    this.metricsSection = page.getByTestId('tax-metrics-section');
  }
 
  async navigate() {
    await this.navigateTo('/tax');
  }
}`,
    theory: `การรักษาความมั่นคงของสคริปต์นิยมใช้ <strong>Page Object Model (POM)</strong> ในการสร้างคลาสตัวแทนความสามารถของหน้าเว็บแต่ละหน้า โดยใช้แนวคิด Class Inheritance:<br/>
    1. สร้างคลาสฐานร่วมกลาง <code>BasePage</code> เพื่อจัดเตรียมเมธอดส่วนกลาง เช่น การเปลี่ยนพิกัดลิงก์ หรือการรอหน้าโหลดเสร็จสิ้น<br/>
    2. คลาสลูกที่จะสืบทอดจะต้องเรียกใช้คำสั่ง <code>super(page)</code> ในบรรทัดแรกของ constructor เพื่อเรียกใช้ชุดตัวแปรของคลาสแม่<br/>
    3. ตัวระบุเป้าหมายใน Class ควรประกาศเป็น <code>readonly Locator</code> เสมอเพื่อความมั่นคงและป้องกันการเขียนโค้ดทับคีย์ตำแหน่งปุ่ม`,
    example: `// คลาสลูกที่ทำการสืบทอดความสามารถ
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
 
  constructor(page: Page) {
    super(page); // ส่งหน้าต่างเว็บต่อให้แม่
    this.usernameInput = page.getByLabel('Username');
  }
}`,
    task: `จงเติมความสามารถของโครงสร้างคลาสลูก <code>TaxPage</code> ให้ถูกต้อง:<br/>
    1. เรียกใช้งานฟังก์ชัน constructor ของคลาสแม่ (super) ส่งผ่านออบเจกต์ page<br/>
    2. ผูกตัวแปร <code>this.metricsSection</code> เข้ากับอิลิเมนต์ของกล่อง Test ID <code>'tax-metrics-section'</code><br/>
    3. ป้อนขั้นตอนคำสั่งในเมธอด <code>navigate</code> ให้ข้ามเส้นทางไปหน้าจอ <code>'/tax'</code> ด้วยฟังก์ชัน <code>navigateTo</code>`
  },
  {
    id: "fixtures",
    meta: "บทที่ 3",
    title: "Fixtures & Test Data Management",
    template: `import { Page } from '@playwright/test';
 
export async function setupTestData(page: Page, baseline: any) {
  // 1. ส่ง baseline data เข้าไปเซ็ตค่า 'portfolio_holdings' ใน localStorage ก่อนหน้าเว็บโหลด
  // WRITE YOUR CODE HERE
  
  
}`,
    validate: (code, log) => {
      log("🔍 กำลังตรวจสอบระบบ Seed Data...");
      if (!code.includes("addInitScript")) {
        throw new Error("โปรเจคนี้ต้องการให้เพิ่มข้อมูลเริ่มต้นก่อนหน้าเว็บเรนเดอร์ กรุณาใช้งาน page.addInitScript()");
      }
      log("✓ ตรวจพบการใช้งาน page.addInitScript");
      
      if (!code.includes("portfolio_holdings")) {
        throw new Error("ไม่พบการเซ็ตคีย์ 'portfolio_holdings' ใน localStorage ของสคริปต์");
      }
      
      const checkSet = /window\.localStorage\.setItem\(['"]portfolio_holdings['"],\s*JSON\.stringify\(.*?\)\)/.test(code) ||
                       /localStorage\.setItem\(['"]portfolio_holdings['"],\s*JSON\.stringify\(.*?\)\)/.test(code);
                       
      if (checkSet) {
        log("✓ โค้ดคอมไพล์สำเร็จ: โหลดชุดจำลองข้อมูลเข้า LocalStorage ก่อนเรนเดอร์สำเร็จ");
      } else {
        throw new Error("รูปแบบสคริปต์ addInitScript ไม่ถูกต้อง\nตัวอย่างการเขียน:\nawait page.addInitScript((data) => {\n  localStorage.setItem('portfolio_holdings', JSON.stringify(data));\n}, baseline);");
      }
    },
    hint: "ใช้ await page.addInitScript((data) => { localStorage.setItem('portfolio_holdings', JSON.stringify(data)); }, baseline)",
    solution: `import { Page } from '@playwright/test';
 
export async function setupTestData(page: Page, baseline: any) {
  // 1. ส่ง baseline data เข้าไปเซ็ตค่า 'portfolio_holdings' ใน localStorage ก่อนหน้าเว็บโหลด
  await page.addInitScript((data) => {
    window.localStorage.setItem('portfolio_holdings', JSON.stringify(data));
  }, baseline);
}`,
    theory: `กลไกการป้อนข้อมูลจำลองเริ่มต้น (Data Seeding) เพื่อล้างสถานะและพร้อมทดสอบอย่างสม่ำเสมอ ใน Playwright การใช้คำสั่ง <code>page.addInitScript()</code> เป็นหนทางที่เสถียรที่สุดในการเตรียมสภาพแวดล้อม เพราะมันจะแทรกการทำงานของ JavaScript เข้าไปประมวลผลภายใน DOM ทันทีตั้งแต่ช่วงเริ่มสถาปนาหน้าเอกสาร (Document Creation) ก่อนที่โค้ดประมวลผลเว็บหลักหรือเฟรมเวิร์กอย่าง React/Next.js จะรันขึ้นมาเช็คค่า ทำให้ค่า LocalStorage มีข้อมูลพร้อมใช้ทันเวลาหน้าจอโชว์ตัว`,
    example: `// เซ็ตค่าธีมสีดำลงในหน้าต่างของเครื่องก่อนหน้าเว็บถูกเรนเดอร์โชว์
await page.addInitScript(() => {
  window.localStorage.setItem('theme', 'dark');
});`,
    task: `จงป้อนคำสั่งให้ฟังก์ชัน <code>setupTestData</code> ทำการเอาออบเจกต์ข้อมูลเริ่มต้น <code>baseline</code> ส่งไปแปลงค่าเป็นสตริงเขียนจัดเก็บลงใน <code>localStorage</code> ภายใต้คีย์ <code>'portfolio_holdings'</code> ผ่านการใช้งาน <code>page.addInitScript()</code>`
  },
  {
    id: "locators",
    meta: "บทที่ 4",
    title: "Locator Strategy & Priority",
    template: `import { Page, Locator } from '@playwright/test';
 
export class HoldingsPage {
  readonly formPanel: Locator;
  readonly formSaveBtn: Locator;
 
  constructor(page: Page) {
    this.formPanel = page.getByTestId('holdings-form-panel');
    
    // 1. ตีกรอบปุ่มบันทึก 'form-save-btn' ให้อยู่ภายใต้ container ฟอร์ม (formPanel)
    // WRITE YOUR CODE HERE
    
    
  }
}`,
    validate: (code, log) => {
      log("🔍 กำลังตรวจสอบกลยุทธ์การตีกรอบ Locator...");
      const pattern = /this\.formSaveBtn\s*=\s*this\.formPanel\.getByTestId\(['"]form-save-btn['"]\)/.test(code);
      if (pattern) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ทำการจำกัดขอบเขตการค้นหาปุ่มบันทึกสำเร็จ (Scoped Locator)");
      } else {
        throw new Error("การอ้างอิงปุ่มบันทึกไม่ถูกต้อง หรือไม่ได้จำกัดขอบเขต (Scoped) ลงใน formPanel\nตัวอย่าง: this.formSaveBtn = this.formPanel.getByTestId('form-save-btn');");
      }
    },
    hint: "ใช้ this.formSaveBtn = this.formPanel.getByTestId('form-save-btn') เพื่อสืบค้นตัวปุ่มย่อยจากขอบเขตของตัวพ่อแม่ (formPanel)",
    solution: `import { Page, Locator } from '@playwright/test';
 
export class HoldingsPage {
  readonly formPanel: Locator;
  readonly formSaveBtn: Locator;
 
  constructor(page: Page) {
    this.formPanel = page.getByTestId('holdings-form-panel');
    this.formSaveBtn = this.formPanel.getByTestId('form-save-btn');
  }
}`,
    theory: `การตีกรอบ Locator ย่อยภายใต้เป้าหมายเดิม (Scoped Locator) ช่วยแก้ไขปัญหากล่องฟังก์ชันชนกัน เช่น บนหน้าเว็บมีโมดอลขึ้นมาทับ และมีปุ่มเซฟทั้งในแบบฟอร์มเบื้องหลังและในปุ่มโมดอลด้านบน หากดึงตรง ๆ จะเกิดข้อบกพร่องจับอิลิเมนต์หลายชิ้นพร้อมกัน (Strict Mode violation) การดึงจาก <code>this.formPanel.getByTestId('child')</code> จะจำกัดวงคิวรี DOM ลงใต้โฟลเดอร์ Parent เท่านั้น ทำให้รวดเร็วและปลอดภัยยิ่งกว่าการสืบหาผ่าน XPath ยาวเหยียด`,
    example: `// การเข้าถึงกล่องย่อยของโมเดลผ่าน Parent Container
const modal = page.getByRole('dialog');
const okBtn = modal.getByRole('button', { name: 'ตกลง' });`,
    task: `จงป้อนระบุที่อยู่ของตัวแปร <code>this.formSaveBtn</code> ให้อยู่ใต้ของเขตข้อมูลของตัวแปรคลาสพ่อแม่ <code>this.formPanel</code> โดยมองหาเป้าหมายที่มีไอดีเป็น <code>'form-save-btn'</code>`
  },
  {
    id: "assertions",
    meta: "บทที่ 5",
    title: "Assertions & Waits (Auto-retry)",
    template: `import { Page, Locator, expect } from '@playwright/test';
 
async function verifyHoldingsRedirect(page: Page, formPanel: Locator) {
  // 1. ตรวจสอบว่า formPanel จะต้องไม่แสดงอยู่บนหน้าจอ (not visible)
  // WRITE YOUR CODE HERE
  
  
  // 2. ตรวจสอบว่า URL ล่าสุดตรงกับพิกัด /holdings (ใช้ RegExp)
  
}`,
    validate: (code, log) => {
      log("🔍 กำลังตรวจสอบระบบ Web-first Assertion...");
      const hasNotVisible = /await\s+expect\(formPanel\)\.not\.toBeVisible\(\)/.test(code);
      if (hasNotVisible) {
        log("✓ ขั้นตอนที่ 1: ตรวจสอบความซ่อนรูปของฟอร์ม (not.toBeVisible) สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่งตรวจเช็คว่าฟอร์มซ่อนตัว\nตัวอย่าง: await expect(formPanel).not.toBeVisible();");
      }
      
      const hasURL = /await\s+expect\(page\)\.toHaveURL\(\/\\\/holdings\/\)/.test(code) || 
                     /await\s+expect\(page\)\.toHaveURL\(.*holdings.*\)/.test(code);
      if (hasURL) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบเส้นทาง URL ของระบบจัดพอร์ตสำเร็จ");
      } else {
        throw new Error("ไม่พบการเช็ค URL ของหน้าด้วย expect(page).toHaveURL()\nตัวอย่าง: await expect(page).toHaveURL(/\\/holdings/);");
      }
    },
    hint: "ขั้นตอนที่ 1 ใช้คำสั่ง await expect(formPanel).not.toBeVisible() และขั้นตอนที่ 2 ใช้คำสั่ง await expect(page).toHaveURL(/\\/holdings/)",
    solution: `import { Page, Locator, expect } from '@playwright/test';
 
async function verifyHoldingsRedirect(page: Page, formPanel: Locator) {
  // 1. ตรวจสอบว่า formPanel จะต้องไม่แสดงอยู่บนหน้าจอ (not visible)
  await expect(formPanel).not.toBeVisible();
 
  // 2. ตรวจสอบว่า URL ล่าสุดตรงกับพิกัด /holdings (ใช้ RegExp)
  await expect(page).toHaveURL(/\\/holdings/);
}`,
    theory: `หลีกเลี่ยงการใช้คำสั่ง <code>page.waitForTimeout()</code> เพราะเป็นสาเหตุทำสคริปต์เทสสะดุดโดยไร้เหตุผลเนื่องจากไม่สัมพันธ์กับประสิทธิภาพเครื่องรันเบื้องหลัง การยืนยันผลควรใช้งานคำสั่งกลุ่ม <strong>Web-first assertions</strong> ซึ่งเมื่อนำหน้าร่วมกับคีย์เวิร์ด <code>expect</code> ระบบจะคอยยิงสุ่มเช็คสถานะอิลิเมนต์ถี่ ๆ บนหน้าเว็บจนกว่าจะตรงเป้าหมาย ช่วยให้ความเร็วขึ้นสูงสุดและเสถียรที่สุด`,
    example: `// การยืนยันผลลัพธ์ว่าหน้าเว็บเปลี่ยนเส้นทางลิงก์สำเร็จ
await expect(page).toHaveURL(/\\/dashboard/);
await expect(page.getByRole('heading')).toBeVisible();`,
    task: `จงพิมพ์คำสั่งตรวจสอบสถานะสคริปต์ในฟังก์ชัน โดย:<br/>
    1. ยืนยันว่าหน้าฟอร์มกรอกข้อมูล <code>formPanel</code> ได้รับการสลับซ่อนรูปหายไปจากหน้าต่าง (not visible)<br/>
    2. เช็คว่าบราวเซอร์ได้ทำการเปลี่ยนเส้นทาง URL ไปอยู่หน้ารายชื่อพอร์ต <code>/holdings</code> สำเร็จ`
  },
  {
    id: "mocking",
    meta: "บทที่ 6",
    title: "API Intercept & Mocking",
    template: `import { Page } from '@playwright/test';
 
async function mockGoogleScript(page: Page) {
  // 1. ดักจับทุก Request ไปที่ script.google.com
  // 2. ตอบกลับ (fulfill) ด้วยสถานะ 200 และเนื้อหา JSON: { ok: true }
  // WRITE YOUR CODE HERE
  
  
}`,
    validate: (code, log) => {
      log("🔍 กำลังประเมินการดักจับเน็ตเวิร์ก...");
      if (!code.includes("page.route")) {
        throw new Error("ไม่ได้เรียกใช้ page.route() เพื่อสกัดกั้นสัญญาณเน็ตเวิร์ก");
      }
      
      const checkGlob = /'(\*\*\/script\.google\.com\/\*\*|\*\*script\.google\.com\*\*|.*?script\.google\.com.*?)'/.test(code) || 
                        /"(\*\*\/script\.google\.com\/\*\*|\*\*script\.google\.com\*\*|.*?script\.google\.com.*?)"/.test(code);
      if (checkGlob) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบการตั้ง Glob Pattern ดักเซิร์ฟเวอร์ยิง Google Sheets");
      } else {
        throw new Error("ตั้งค่าพิกัด URL ดักจับไม่ถูกต้องสำหรับ script.google.com\nตัวอย่าง: '**/script.google.com/**'");
      }
      
      const checkFulfill = /route\.fulfill\(.*?status:\s*200.*?body:\s*JSON\.stringify\(.*?ok:\s*true.*?\).*?\)/s.test(code) ||
                            /route\.fulfill\(.*?body:\s*JSON\.stringify\(.*?ok:\s*true.*?\).*?status:\s*200.*?\)/s.test(code);
      if (checkFulfill) {
        log("✓ ขั้นตอนที่ 2: ส่งข้อมูลตอบกลับจำลองจำลองสำเร็จ (route.fulfill)");
      } else {
        throw new Error("สคริปต์ตอบข้อมูล fulfill ผิดพลาด\nตัวอย่างการเขียน:\nawait page.route('**/script.google.com/**', route => {\n  route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });\n});");
      }
    },
    hint: "ใช้คำสั่ง await page.route('**/script.google.com/**', route => { route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }); })",
    solution: `import { Page } from '@playwright/test';
 
async function mockGoogleScript(page: Page) {
  // 1. ดักจับทุก Request ไปที่ script.google.com
  // 2. ตอบกลับ (fulfill) ด้วยสถานะ 200 และเนื้อหา JSON: { ok: true }
  await page.route('**/script.google.com/**', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ ok: true })
    });
  });
}`,
    theory: `เพื่อป้องกันไม่ให้การรันเทสส่งผลกระทบเขียนทับข้อมูลจริงฝั่งโปรดักชัน หรือแก้ปัญหาระบบเซิร์ฟเวอร์ภายนอกที่กำลังเรียกใช้งานล่มบ่อย Playwright เตรียมฟังก์ชัน <code>page.route()</code> ในการสืบดักจับเน็ตเวิร์กสัญญาณบราวเซอร์ และประมวลผลส่งคำตอบปลอมออกไปแทนด้วย <code>route.fulfill()</code> ทำให้รวดเร็วและสามารถระบุข้อมูลสมมติที่ต้องการจำลองเทสได้อย่างอิสระ`,
    example: `// การดักและตอบกลับข้อมูลสินค้าปลอมลงในหน้าแคตตาล็อกสินค้า
await page.route('**/api/products', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'สินค้าสมมติ' }])
  });
});`,
    task: `จงป้อนคีย์คำสั่งให้ฟังก์ชัน <code>mockGoogleScript</code> ดักจับสัญญาณเน็ตเวิร์กที่ยิงไปที่เซิร์ฟเวอร์ <code>**/script.google.com/**</code> และสั่งส่งข้อมูลตอบกลับ (fulfill) คืนเป็นสถานะ HTTP 200 และเนื้อหาในรูปแบบออบเจกต์ JSON ค่า <code>{ ok: true }</code>`
  },
  {
    id: "advanced",
    meta: "บทที่ 7",
    title: "Advanced Execution & Auth",
    template: `import { test } from '@playwright/test';
 
test.describe('Holdings Suite', () => {
  // 1. กำหนดโหมดการทำงานของชุดการทดสอบนี้ให้ทำงานเรียงต่อกันเป็นลำดับ (Serial)
  // WRITE YOUR CODE HERE
  
  
  test('TC-01: เพิ่มหุ้น', async ({ page }) => { /* ... */ });
});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง Serial Config...");
      if (code.includes("test.describe.configure")) {
        log("✓ ค้นพบคำสั่งจัดแจงโหมดทดสอบ");
      } else {
        throw new Error("คุณจำเป็นต้องเรียกใช้งานคำสั่ง configure บนกลุ่มเทส describe");
      }
      
      const checkMode = /test\.describe\.configure\(\{\s*mode:\s*['"]serial['"]\s*\}\)/.test(code);
      if (checkMode) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ตั้งค่าเทสให้รันต่อเนื่องกัน CRUD Flow สำเร็จ");
      } else {
        throw new Error("ตั้งค่าโหมด Serial ไม่ถูกต้อง\nตัวอย่างการเขียน:\ntest.describe.configure({ mode: 'serial' });");
      }
    },
    hint: "เขียนคำสั่ง test.describe.configure({ mode: 'serial' }); ไว้ใต้ชื่อกลุ่มอ้างอิงของชุดเทส Holdings Suite",
    solution: `import { test } from '@playwright/test';
 
test.describe('Holdings Suite', () => {
  // 1. กำหนดโหมดการทำงานของชุดการทดสอบนี้ให้ทำงานเรียงต่อกันเป็นลำดับ (Serial)
  test.describe.configure({ mode: 'serial' });
  
  test('TC-01: เพิ่มหุ้น', async ({ page }) => { /* ... */ });
});`,
    theory: `โดยปกติ Playwright จะสุ่มทำงานแบบขนานเพื่อรันความเร็วสูงสุด แต่สำหรับสคริปต์การทดสอบที่เกี่ยวพันกับลำดับขั้นตอน (เช่นเคส เพิ่ม ลบ แก้ไข ข้อมูลพอร์ตหุ้นแบบ CRUD) การขนานจะขัดแย้งทำลายข้อมูลตัวแปรกันเอง เราสามารถล็อกลำดับความเรียงของกลุ่มเทสเคสย่อยให้ออกคิวต่อเรียงหน้ากระดานได้โดยการเซ็ตโหมด <code>test.describe.configure({ mode: 'serial' })</code> ซึ่งหากเคสย่อยตัวใดตัวหนึ่งพบปัญหาพัง ตัวเทสลำดับถัดไปในแถวจะข้ามยกเลิกทำงานอัตโนมัติเพื่อป้องกันข้อมูลขยะคั่งค้าง`,
    example: `// ล็อกลำดับเรียงชุดเทสภายในกลุ่ม describe
test.describe('บล็อกลงทะเบียนและล็อกอิน', () => {
  test.describe.configure({ mode: 'serial' });
  test('ขั้นแรก: ลงทะเบียน', async ({ page }) => { ... });
  test('ขั้นสอง: ล็อกอินเข้าระบบ', async ({ page }) => { ... });
});`,
    task: `จงป้อนคีย์คำสั่งให้กลุ่มเทส <code>'Holdings Suite'</code> สลับการทำงานไปใช้งานโหมดแบบเรียงลำดับทำงานคิวเดียว (<code>'serial'</code>) เพื่อให้เทสเคสทำงานสลับต่อคิวเรียบร้อย`
  },
  {
    id: "debugging",
    meta: "บทที่ 8",
    title: "Systematic Debugging & Trace",
    template: `import { Page } from '@playwright/test';
 
function listenBrowserErrors(page: Page) {
  // 1. ดักจับข้อความ console ทั้งหมดบนหน้าเพจ
  // 2. ถ้าข้อความมีระดับ (type) เป็น 'error' ให้ปริ้นท์ออกทาง terminal ด้วย console.log
  // WRITE YOUR CODE HERE
  
  
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบระบบดักสัญญาณ console...");
      if (!code.includes("page.on")) {
        throw new Error("คุณต้องจับเหตุการณ์ (Event Listener) ด้วยคำสั่ง page.on()");
      }
      log("✓ ตรวจพบเหตุการณ์ดัก page.on");
      
      if (!code.includes("'console'") && !code.includes('"console"')) {
        throw new Error("ไม่ได้ผูกรับเหตุการณ์สืบจับของคลาส 'console'");
      }
      
      const checkType = /msg\.type\(\)\s*===\s*['"]error['"]/.test(code);
      if (checkType) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ตั้งสคริปต์สืบจับและสกรีนข้อผิดพลาดสีแดงหลังบ้านสำเร็จ");
      } else {
        throw new Error("รูปแบบสคริปต์การสืบจับคลาสคอนโซลคลาดเคลื่อน\nตัวอย่างการเขียน:\npage.on('console', msg => {\n  if (msg.type() === 'error') console.log(msg.text());\n});");
      }
    },
    hint: "ใช้ฟังก์ชัน page.on('console', msg => { if (msg.type() === 'error') console.log(msg.text()); }) ในการสุ่มดักจับสีแดงหน้าจอคอนโซลบราวเซอร์",
    solution: `import { Page } from '@playwright/test';
 
function listenBrowserErrors(page: Page) {
  // 1. ดักจับข้อความ console ทั้งหมดบนหน้าเพจ
  // 2. ถ้าข้อความมีระดับ (type) เป็น 'error' ให้ปริ้นท์ออกทาง terminal ด้วย console.log
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(msg.text());
    }
  });
}`,
    theory: `ความบกพร่องที่ร้ายแรงที่สุดส่วนใหญ่ไม่ได้ขึ้นโชว์เด่นชัดหน้าจอเบราว์เซอร์ แต่ซ่อนตัวอยู่ใน Uncaught JavaScript Errors ฝั่ง Console ของเบราว์เซอร์ การผูกฟังก์ชันดักรับเหตุการณ์ในสคริปต์เทสผ่านเมธอด <code>page.on('console', msg => { ... })</code> จะช่วยสตรีมข้อความเตือนเหล่านั้นกลับมาสกรีนรายงานผลลัพธ์ผ่านหน้าจอเทอร์มินัลของฝั่งรันสคริปต์เพื่อทำการวิเคราะห์หาสาเหตุในระบบเบื้องหลังได้รวดเร็วขึ้น`,
    example: `// ดักจับและพิมพ์ประวัติล็อกเตือนเหลืองและแดงของระบบเว็บทุกลูก
page.on('console', message => {
  if (message.type() === 'warning' || message.type() === 'error') {
    console.log(\`ดักล็อกสลัว: \${message.text()}\`);
  }
});`,
    task: `จงเขียนฟังก์ชันดักสัญญาณใน <code>listenBrowserErrors</code> โดยดักจับคีย์ประวัติของบราวเซอร์เหตุการณ์ <code>'console'</code> ตรวจเช็คว่าหากข้อความที่โผล่ขึ้นมาประเภทระดับเป็น <code>'error'</code> จริง ให้สั่งส่งออกข้อความไปแสดงบนคอนโซลเทอร์มินัลหลังบ้านผ่าน <code>console.log()</code>`
  },
  {
    id: "react_testing",
    meta: "บทที่ 9",
    title: "React-specific Web Testing",
    template: `import { Page, Locator, expect } from '@playwright/test';
 
async function inputSalaryAndSave(page: Page, salaryInput: Locator, saveBtn: Locator) {
  // 1. กรอกค่า '65000' ลงช่องกรอกข้อมูล (กระตุ้น React onChange)
  // WRITE YOUR CODE HERE
  
  
  // 2. ตรวจเช็คตรวจสอบว่าปุ่มเซฟกลับมาเปิดทำงานพร้อมกด (enabled)
  
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบพฤติกรรมการทดสอบ React UI...");
      if (code.includes(".type(")) {
        throw new Error("ห้ามใช้คำสั่ง .type() ในระบบ React Component เพราะอาจไม่กระตุ้นการเปลี่ยนค่า State ให้ใช้ .fill() แทน");
      }
      
      const checkFill = /await\s+salaryInput\.fill\(['"]65000['"]\)/.test(code);
      if (checkFill) {
        log("✓ ขั้นตอนที่ 1: เลือกกรอกข้อมูลด้วยเมธอด fill() ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งกรอกเงินเดือน 65000 ด้วยคำสั่ง fill\nตัวอย่าง: await salaryInput.fill('65000');");
      }
      
      const checkAssert = /await\s+expect\(saveBtn\)\.toBeEnabled\(\)/.test(code);
      if (checkAssert) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบคำสั่งเช็คความพร้อมปุ่มเซฟ (toBeEnabled)");
      } else {
        throw new Error("ไม่พบคำสั่งตรวจสอบสถานะความพร้อมของปุ่มเซฟ\nตัวอย่าง: await expect(saveBtn).toBeEnabled();");
      }
    },
    hint: "พิมพ์ await salaryInput.fill('65000'); ในส่วนแรก และพิมพ์ await expect(saveBtn).toBeEnabled(); ในขั้นตอนยืนยันผลด้านล่าง",
    solution: `import { Page, Locator, expect } from '@playwright/test';
 
async function inputSalaryAndSave(page: Page, salaryInput: Locator, saveBtn: Locator) {
  // 1. กรอกค่า '65000' ลงช่องกรอกข้อมูล (กระตุ้น React onChange)
  await salaryInput.fill('65000');
 
  // 2. ตรวจเช็คตรวจสอบว่าปุ่มเซฟกลับมาเปิดทำงานพร้อมกด (enabled)
  await expect(saveBtn).toBeEnabled();
}`,
    theory: `Controlled Component ใน React จะซิงค์ข้อความภายในช่องฟอร์มผูกเข้ากับ State ของ JavaScript ตลอดเวลา หลีกเลี่ยงการใช้คำสั่ง <code>locator.type()</code> ในการจำลองการพิมพ์ทีละปุ่ม เพราะหากบราวเซอร์โหลดการรันสเตตช้าตัวอักษรบางตัวอาจตกหล่นหายไประหว่างทาง การใช้งานเมธอด <code>locator.fill()</code> จะสั่งให้ล้างอักขระเก่าทิ้งและนำประโยคใหม่วางทับแบบจำลอง Direct Value Assignment ทันที ซึ่งเสถียรและกระตุ้น <code>onChange</code> สเตตได้แน่นอนครบถ้วนกว่า`,
    example: `// การกรอกฟอร์มเข้าสู่ระบบใน React ให้ปลอดภัยสูงสุด
await page.getByLabel('รหัสผ่าน').fill('my-pass-code');
await expect(page.getByRole('button', { name: 'ยืนยัน' })).toBeEnabled();`,
    task: `จงเติมขั้นตอนการกรอกเงินเดือนในฟังก์ชัน โดยป้อนตัวเลข <code>'65000'</code> ลงไปที่พิกัด <code>salaryInput</code> ด้วยฟังก์ชัน <code>fill()</code> และตรวจสอบด้วย Web-first assertion เช็คปุ่มเซฟ <code>saveBtn</code> ว่าพร้อมสำหรับกดโต้ตอบ (enabled) แล้ว`
  },
  {
    id: "responsive_sync",
    meta: "บทที่ 10",
    title: "Responsive Loop Layout Simulation",
    template: `import { Page } from '@playwright/test';
 
async function testLayouts(page: Page) {
  const viewports = [
    { width: 393, height: 852 },
    { width: 744, height: 1133 }
  ];
 
  for (const vp of viewports) {
    // 1. สลับขนาด Viewport ขนาดหน้าต่างเบราว์เซอร์ตามตัวแปรลูป vp
    // WRITE YOUR CODE HERE
    
    
  }
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่งสลับขนาด Viewport ไดนามิก...");
      const checkSet = /await\s+page\.setViewportSize\(\{\s*width:\s*vp\.width,\s*height:\s*vp\.height\s*\}\)/.test(code) ||
                       /await\s+page\.setViewportSize\(vp\)/.test(code);
      if (checkSet) {
        log("✓ โค้ดคอมไพล์สำเร็จ: วนลูปสลับความกว้าง Responsive (Mobile/Tablet) สำเร็จ");
      } else {
        throw new Error("ไม่พบสคริปต์การสลับขนาดหน้าต่างเบราว์เซอร์ด้วยคำสั่ง setViewportSize\nตัวอย่าง: await page.setViewportSize({ width: vp.width, height: vp.height });");
      }
    },
    hint: "เรียกคำสั่ง await page.setViewportSize(vp); หรือส่งผ่านออบเจกต์ await page.setViewportSize({ width: vp.width, height: vp.height }); ในลูปความกว้างหน้าจอ",
    solution: `import { Page } from '@playwright/test';
 
async function testLayouts(page: Page) {
  const viewports = [
    { width: 393, height: 852 },
    { width: 744, height: 1133 }
  ];
 
  for (const vp of viewports) {
    // 1. สลับขนาด Viewport ขนาดหน้าต่างเบราว์เซอร์ตามตัวแปรลูป vp
    await page.setViewportSize(vp);
  }
}`,
    theory: `การทดสอบแบบจำลองการรองรับขนาดอุปกรณ์หน้าจอ (Responsive Testing) เพื่อป้องกันปัญหาอิลิเมนต์เลื่อนเบียดบังทับซ้อนกัน หรือปุ่มหายบนหน้าจอมือถือ แทนที่เราจะเปิดปิดเบราว์เซอร์ใหม่แยกโปรเจคทุก ๆ ครั้ง การสุ่มวนลูปและใช้คำสั่ง <strong><code>page.setViewportSize({ width, height })</code></strong> ภายในเทสเคสเดิมบนแท็บหน้าเว็บเดิมจะช่วยทดสอบความเรียบร้อยของ UI ได้เร็วกว่า และใช้ทรัพยากรคุ้มค่าที่สุด`,
    example: `// วนลูปตรวจสอบเลย์เอาท์หน้าแสดงผล
const screens = [{ width: 412, height: 915 }, { width: 1280, height: 800 }];
for (const sc of screens) {
  await page.setViewportSize(sc);
  // ดำเนินการตรวจสอบการจัดวาง HTML ในหน้าเว็บ
}`,
    task: `จงป้อนคีย์คำสั่งให้ลูปบราวเซอร์สลับความกว้างหน้าต่างแสดงผลตามขนาด viewport ตัวแปร <code>vp</code> ไดนามิกของลูปการรันให้ผ่านเกณฑ์การทดสอบ`
  },
  {
    id: "hybrid_api_ui",
    meta: "บทที่ 11",
    title: "Hybrid Testing: Cross-check API Response กับ UI ที่เรนเดอร์จริง",
    template: `import { test, expect } from '@playwright/test';

test('TC-11: ค่า Resistance R1 ที่ API ส่งมาต้องตรงกับตัวเลขที่ UI แสดงจริง', async ({ page, request }) => {
  // 1. ยิง API ตรงไปที่ /api/ta/levels?ticker=AAPL เพื่อเอาค่า resistance ตัวแรก (R1) มาเป็น "ค่าอ้างอิงจริง"
  // WRITE YOUR CODE HERE


  // 2. เปิดหน้า /holdings แล้วตรวจสอบว่ามีข้อความราคาที่ตรงกับค่าจาก API เป๊ะ (ทศนิยม 2 ตำแหน่ง นำหน้าด้วย $)

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการผสาน API เข้ากับ UI Test...");
      const hasApiCall = /await\s+request\.get\(['"]\/api\/ta\/levels\?ticker=AAPL['"]\)/.test(code);
      if (hasApiCall) {
        log("✓ ขั้นตอนที่ 1a: ยิง request.get('/api/ta/levels?ticker=AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.get('/api/ta/levels?ticker=AAPL')\nตัวอย่าง: const response = await request.get('/api/ta/levels?ticker=AAPL');");
      }

      const hasJsonParse = /await\s+response\.json\(\)/.test(code) && /resistance\[0\]/.test(code);
      if (hasJsonParse) {
        log("✓ ขั้นตอนที่ 1b: ดึงค่า resistance[0] จาก response.json() ถูกต้อง");
      } else {
        throw new Error("ไม่พบการแปลง response เป็น JSON แล้วดึงค่า resistance[0]\nตัวอย่าง: const body = await response.json();\nconst r1 = body.resistance[0];");
      }

      const hasGoto = /await\s+page\.goto\(['"]\/holdings['"]\)/.test(code);
      if (hasGoto) {
        log("✓ ขั้นตอนที่ 2a: เปิดหน้า /holdings ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.goto('/holdings')");
      }

      const hasCrossCheck = /getByText\(\s*['"]\$['"]\s*\+\s*\w+\.toFixed\(2\)\s*\)/.test(code) && /toBeVisible\(\)/.test(code);
      if (hasCrossCheck) {
        log("✓ ขั้นตอนที่ 2b: ตรวจสอบว่า UI แสดงตัวเลขตรงกับค่าจาก API สำเร็จ (Cross-check)");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความราคาบน UI ที่ตรงกับค่าจาก API\nตัวอย่าง: await expect(page.getByText('$' + r1.toFixed(2))).toBeVisible();");
      }
    },
    hint: "ขั้นแรกยิง const response = await request.get('/api/ta/levels?ticker=AAPL'); แล้ว const body = await response.json(); const r1 = body.resistance[0]; จากนั้น await page.goto('/holdings'); แล้วเช็ค await expect(page.getByText('$' + r1.toFixed(2))).toBeVisible();",
    solution: `import { test, expect } from '@playwright/test';

test('TC-11: ค่า Resistance R1 ที่ API ส่งมาต้องตรงกับตัวเลขที่ UI แสดงจริง', async ({ page, request }) => {
  // 1. ยิง API ตรงไปที่ /api/ta/levels?ticker=AAPL เพื่อเอาค่า resistance ตัวแรก (R1) มาเป็น "ค่าอ้างอิงจริง"
  const response = await request.get('/api/ta/levels?ticker=AAPL');
  const body = await response.json();
  const r1 = body.resistance[0];

  // 2. เปิดหน้า /holdings แล้วตรวจสอบว่ามีข้อความราคาที่ตรงกับค่าจาก API เป๊ะ (ทศนิยม 2 ตำแหน่ง นำหน้าด้วย $)
  await page.goto('/holdings');
  await expect(page.getByText('$' + r1.toFixed(2))).toBeVisible();
});`,
    theory: `เทคนิค <strong>Hybrid Testing</strong> คือการใช้ <code>request</code> (ยิง API ตรง) ร่วมกับ <code>page</code> (เบราว์เซอร์จริง) อยู่ใน Test เดียวกัน โดยแบ่งหน้าที่กันชัดเจน: <code>request</code> เอาไว้ "รู้คำตอบที่ถูกต้องจริง" อย่างรวดเร็ว ส่วน <code>page</code> เอาไว้ตรวจว่า "หน้าจอที่ผู้ใช้เห็นตรงกับคำตอบนั้นไหม"<br/><br/>
    คอมโพเนนต์จริง <code>PivotPoints.jsx</code> ในโปรเจก My-Investment-Port ดึงข้อมูลจาก <code>/api/ta/levels</code> ผ่าน <code>fetch()</code> แล้วเรนเดอร์ค่า <code>resistance</code>/<code>support</code> ออกมาเป็นข้อความบนหน้าจอ โดยขึ้นต้นด้วยตัวอักษร <code>$</code> ตามด้วยค่าตัวเลขจาก <code>value.toFixed(2)</code> และ<strong>ไม่มี <code>data-testid</code> กำกับไว้เลย</strong> — สถานการณ์แบบนี้พบบ่อยมากในโค้ดจริง ทำให้ต้องอ้างอิงด้วย <code>getByText()</code> จับข้อความที่เรนเดอร์แทน<br/><br/>
    ข้อดีของเทคนิคนี้: ถ้า Backend คำนวณถูกแต่ Frontend เอาไปแสดงผิด (ปัดเศษผิด, ต่อ field ผิดตัว, ฟอร์แมตทศนิยมผิด) การทดสอบแบบนี้จะจับได้ทันที ต่างจาก UI test ทั่วไปที่ hardcode ค่าคาดหวังไว้ล่วงหน้า ซึ่งจะไม่รู้เลยว่าค่านั้น "ผิดตั้งแต่ต้นทาง" หรือ "ถูกต้นทางแต่แสดงผิด"`,
    example: `// ตัวอย่างยืนยันว่าค่าจาก API ตรงกับข้อความที่แสดงบนหน้าจอ
const response = await request.get('/api/ai/health');
const body = await response.json();

await page.goto('/settings');
await expect(page.getByText(body.geminiConfigured ? 'Connected' : 'Not Connected')).toBeVisible();`,
    task: `จงเขียนสคริปต์ Hybrid Test ให้สมบูรณ์ โดย:<br/>
    1. ยิง GET request ไปที่ <code>/api/ta/levels?ticker=AAPL</code> แล้วดึงค่า <code>resistance[0]</code> เก็บไว้ในตัวแปร<br/>
    2. เปิดหน้า <code>/holdings</code> แล้วตรวจสอบด้วย <code>getByText()</code> ว่ามีข้อความราคารูปแบบ <code>$XX.XX</code> ที่ตรงกับค่าจาก API ปรากฏอยู่จริงบนหน้าจอ`
  },
  {
    id: "flaky_retry",
    meta: "บทที่ 12",
    title: "Flaky-Test Retry Strategy",
    template: `import { test, expect } from '@playwright/test';

test.describe.configure({ /* 1. กำหนดให้ทุก test ใน describe block นี้ retry ได้สูงสุด 2 ครั้งเมื่อ fail */ });

test('TC-12: หน้า Holdings โหลดราคาแบบ async บางครั้งช้าจนทำให้ test ไม่เสถียร', async ({ page }, testInfo) => {
  await page.goto('/holdings');

  // 2. ใช้ auto-retry assertion (ห้ามหน่วงเวลาคงที่แบบตายตัว) รอข้อความ 'AAPL' ปรากฏบนหน้าจอ
  // WRITE YOUR CODE HERE


  // 3. ถ้าเป็นการ retry รอบที่ 2 ขึ้นไป (testInfo.retry > 0) ให้ log เตือนผ่าน console.log('Retry attempt: ' + testInfo.retry)

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ Flaky-Test Retry Strategy...");
      const hasRetryConfig = /test\.describe\.configure\(\{\s*retries:\s*2\s*\}\)/.test(code);
      if (hasRetryConfig) {
        log("✓ ขั้นตอนที่ 1: กำหนด test.describe.configure({ retries: 2 }) ถูกต้อง");
      } else {
        throw new Error("ไม่พบ test.describe.configure({ retries: 2 })\nตัวอย่าง: test.describe.configure({ retries: 2 });");
      }

      const hasAutoRetryAssertion = /await\s+expect\(page\.getByText\(['"]AAPL['"]\)\)\.toBeVisible\(\)/.test(code);
      const hasFixedWait = /waitForTimeout/.test(code);
      if (hasAutoRetryAssertion && !hasFixedWait) {
        log("✓ ขั้นตอนที่ 2: ใช้ auto-retry assertion toBeVisible() แทน waitForTimeout ถูกต้อง");
      } else if (hasFixedWait) {
        throw new Error("ห้ามใช้ waitForTimeout ตายตัว ให้ใช้ await expect(page.getByText('AAPL')).toBeVisible(); แทน (auto-retry จนกว่าจะเจอหรือ timeout)");
      } else {
        throw new Error("ไม่พบการรอด้วย auto-retry assertion\nตัวอย่าง: await expect(page.getByText('AAPL')).toBeVisible();");
      }

      const hasRetryLog = /testInfo\.retry\s*>\s*0/.test(code) && /console\.log\(.*Retry attempt.*testInfo\.retry/.test(code);
      if (hasRetryLog) {
        log("✓ ขั้นตอนที่ 3: log เตือนเมื่อ testInfo.retry > 0 ถูกต้อง");
      } else {
        throw new Error("ไม่พบเงื่อนไข if (testInfo.retry > 0) พร้อม console.log('Retry attempt: ' + testInfo.retry)");
      }
    },
    hint: "เปิดหัวไฟล์ด้วย test.describe.configure({ retries: 2 }); แล้วในตัว test รอด้วย await expect(page.getByText('AAPL')).toBeVisible(); จากนั้นเช็ค if (testInfo.retry > 0) { console.log('Retry attempt: ' + testInfo.retry); }",
    solution: `import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2 });

test('TC-12: หน้า Holdings โหลดราคาแบบ async บางครั้งช้าจนทำให้ test ไม่เสถียร', async ({ page }, testInfo) => {
  await page.goto('/holdings');

  // 2. ใช้ auto-retry assertion (ห้ามหน่วงเวลาคงที่แบบตายตัว) รอข้อความ 'AAPL' ปรากฏบนหน้าจอ
  await expect(page.getByText('AAPL')).toBeVisible();

  // 3. ถ้าเป็นการ retry รอบที่ 2 ขึ้นไป (testInfo.retry > 0) ให้ log เตือนผ่าน console.log('Retry attempt: ' + testInfo.retry)
  if (testInfo.retry > 0) {
    console.log('Retry attempt: ' + testInfo.retry);
  }
});`,
    theory: `Flaky test คือ test ที่บางทีผ่านบางทีไม่ผ่านโดยไม่มีการเปลี่ยนโค้ด root cause ส่วนใหญ่คือ timing (UI โหลดข้อมูล async ช้ากว่าที่ test คาดไว้) ทางแก้ที่ผิดคือใส่ <code>page.waitForTimeout(3000)</code> ตายตัว เพราะช้าไปก็เสียเวลาฟรี เร็วไปก็ยัง flaky อยู่ดี<br/><br/>
    ทางแก้ที่ถูกต้อง 2 ชั้น: (1) ใช้ <strong>auto-retry assertion</strong> อย่าง <code>expect().toBeVisible()</code> ซึ่ง Playwright จะ poll ซ้ำจนกว่าจะผ่านหรือ timeout เอง ไม่ต้องเดาเวลาที่แน่นอน (2) เมื่อ timing ยังไม่เสถียรจริงๆ (เช่น 3rd-party widget, network jitter) ให้ตั้ง <strong>retry ระดับ test</strong> เป็นทางสำรอง ไม่ใช่ทางหลัก<br/><br/>
    โปรเจกจริง <code>tests/web-testing/playwright.config.ts</code> ตั้งค่า <code>retries: process.env.CI ? 2 : 0</code> คือ retry เฉพาะบน CI (ที่เครื่องช้ากว่าและ flaky ง่ายกว่า) ไม่ retry ตอน dev เครื่อง local เพื่อให้เห็น failure จริงทันทีเวลาเขียนโค้ด ฟิกซ์เจอร์ <code>testInfo</code> (parameter ตัวที่ 2 ของ test callback) มี property <code>testInfo.retry</code> บอกว่านี่คือการรันครั้งที่เท่าไหร่ (0 = ครั้งแรก) ใช้ log เพื่อสืบสาเหตุว่า test ไหน flaky บ่อยจริงๆ`,
    example: `// ตัวอย่างตั้ง retry เฉพาะกลุ่ม test ที่รู้ว่า flaky (ไม่ใช่ทั้งไฟล์)
test.describe('Live price widget (flaky on CI)', () => {
  test.describe.configure({ retries: 2 });

  test('shows live price', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('live-price')).toBeVisible();
  });
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. กำหนด <code>test.describe.configure({ retries: 2 })</code> ให้ suite นี้ retry ได้สูงสุด 2 ครั้ง<br/>
    2. ใช้ auto-retry assertion <code>await expect(page.getByText('AAPL')).toBeVisible()</code> แทนการ <code>waitForTimeout</code> ตายตัว<br/>
    3. เช็ค <code>testInfo.retry > 0</code> แล้ว log <code>'Retry attempt: ' + testInfo.retry</code> เพื่อสืบสาเหตุ flaky ภายหลัง`
  },
  {
    id: "stale_locator",
    meta: "บทที่ 13",
    title: "Stale Locator หลัง UI Refactor: เลือก Locator ที่ทนต่อการเปลี่ยนแปลง",
    template: `import { test, expect } from '@playwright/test';

test('TC-13: ค้นหาหุ้นต้องทำงานได้แม้ Dev รีแฟคเตอร์ CSS class ของหน้า UI ใหม่', async ({ page }) => {
  await page.goto('/holdings');

  // ห้ามค้นหาช่องค้นหาด้วย CSS class เพราะเปลี่ยนได้ทุกครั้งที่ Dev รีแฟคเตอร์ ให้ใช้ Test ID ที่เสถียรกว่าแทน แล้วกรอกคำว่า 'AAPL'
  // WRITE YOUR CODE HERE

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบความทนทานของ Locator ต่อการรีแฟคเตอร์...");
      const usesFragileClassLocator = /\.locator\(\s*['"]\./.test(code);
      if (usesFragileClassLocator) {
        throw new Error("ห้ามใช้ page.locator('.class-name') เพราะ CSS class เปลี่ยนได้ทุกครั้งที่ Dev รีแฟคเตอร์ ให้ใช้ page.getByTestId('search-input') แทน");
      }

      const hasTestIdFill = /await\s+page\.getByTestId\(['"]search-input['"]\)\.fill\(['"]AAPL['"]\)/.test(code);
      if (hasTestIdFill) {
        log("✓ ใช้ getByTestId('search-input').fill('AAPL') ที่ทนต่อการรีแฟคเตอร์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('search-input').fill('AAPL')\nตัวอย่าง: await page.getByTestId('search-input').fill('AAPL');");
      }
    },
    hint: "ใช้ await page.getByTestId('search-input').fill('AAPL'); ห้ามใช้ page.locator('.some-css-class') เด็ดขาดเพราะเปราะบางต่อการรีแฟคเตอร์",
    solution: `import { test, expect } from '@playwright/test';

test('TC-13: ค้นหาหุ้นต้องทำงานได้แม้ Dev รีแฟคเตอร์ CSS class ของหน้า UI ใหม่', async ({ page }) => {
  await page.goto('/holdings');

  // ห้ามค้นหาช่องค้นหาด้วย CSS class เพราะเปลี่ยนได้ทุกครั้งที่ Dev รีแฟคเตอร์ ให้ใช้ Test ID ที่เสถียรกว่าแทน แล้วกรอกคำว่า 'AAPL'
  await page.getByTestId('search-input').fill('AAPL');
});`,
    theory: `ไม่ใช่ flaky test ทุกตัวจะแก้ด้วยการเพิ่ม timeout หรือ retry — บางตัว "เสถียรดี" ตอนเขียนครั้งแรก แต่พังถาวรทันทีที่ Dev รีแฟคเตอร์ CSS class เพราะ locator ผูกติดกับรายละเอียดที่ไม่คงที่ (Stale Locator) ปัญหานี้ retry เท่าไหร่ก็ไม่ผ่าน เพราะ element ตามหาไม่เจอจริงๆ ไม่ใช่แค่ช้า<br/><br/>
    ในโปรเจก My-Investment-Port หน้า <code>/holdings</code> มีทั้งสอง pattern: บาง element อย่างช่องค้นหามี <code>data-testid="search-input"</code> กำกับไว้ชัดเจน (เสถียร ไม่ผูกกับ CSS/ข้อความ) แต่บาง component อย่าง <code>PivotPoints.jsx</code> (ดูบทที่ 11 Hybrid Testing) ไม่มี <code>data-testid</code> เลย ต้องอาศัย <code>getByText()</code> จับข้อความที่เรนเดอร์แทน ซึ่งเปราะบางกว่ามาก<br/><br/>
    หลักการเลือก Locator เรียงจากทนทานสุดไปเปราะบางสุด:<br/>
    1. <code>getByTestId()</code> — ผูกกับ attribute ที่ QA/Dev ตกลงกันไว้ล่วงหน้า ไม่เปลี่ยนตามการรีแฟคเตอร์ style<br/>
    2. <code>getByRole()</code> / <code>getByLabel()</code> — ผูกกับ semantic ของ element ทนทานพอสมควร<br/>
    3. <code>getByText()</code> — พังทันทีที่ copy เปลี่ยน<br/>
    4. <code>page.locator('.css-class')</code> / <code>page.locator('#id')</code> — เปราะบางที่สุด เพราะ Dev เปลี่ยน class/id เวลารีแฟคเตอร์ได้ตลอดเวลาโดยไม่รู้ว่ามันไปกระทบ test`,
    example: `// ไม่ควรทำ: ผูก locator กับ CSS class ที่ Dev เปลี่ยนได้ทุกเมื่อ
await page.locator('.stock-search-box').fill('AAPL');

// ควรทำ: ผูกกับ Test ID ที่เสถียรไม่ว่า style จะเปลี่ยนแบบไหน
await page.getByTestId('search-input').fill('AAPL');`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. เปิดหน้า <code>/holdings</code><br/>
    2. ค้นหาช่องค้นหาด้วย Test ID <code>'search-input'</code> (ห้ามใช้ CSS class locator) แล้วกรอกคำว่า <code>'AAPL'</code>`
  },
  {
    id: "dialog_confirm",
    meta: "บทที่ 14",
    title: "Confirm Dialog: ลบข้อมูลต้องผ่านการยืนยันก่อนเสมอ",
    template: `import { test, expect } from '@playwright/test';

test('TC-14: กดลบ Holdings ต้องเจอ Confirm Dialog ก่อนข้อมูลจะหายจริง', async ({ page }) => {
  await page.goto('/holdings');

  // 1. คลิกปุ่มลบแถวแรก (Test ID: btn-delete-holding)
  // WRITE YOUR CODE HERE


  // 2. ต้องเจอ Dialog ยืนยันก่อนเสมอ ตรวจสอบว่าปุ่มยืนยัน (Test ID: confirm-dialog-confirm) ปรากฏอยู่จริง


  // 3. คลิกปุ่มยืนยันเพื่อลบจริง

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการจัดการ Confirm Dialog...");
      const hasDeleteClick = /await\s+page\.getByTestId\(['"]btn-delete-holding['"]\)\.first\(\)\.click\(\)/.test(code);
      if (hasDeleteClick) {
        log("✓ ขั้นตอนที่ 1: คลิกปุ่มลบ (btn-delete-holding) ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('btn-delete-holding').first().click()\nตัวอย่าง: await page.getByTestId('btn-delete-holding').first().click();");
      }

      const hasDialogCheck = /await\s+expect\(page\.getByTestId\(['"]confirm-dialog-confirm['"]\)\)\.toBeVisible\(\)/.test(code);
      if (hasDialogCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบว่า Dialog ยืนยันปรากฏจริงก่อนถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบว่า Dialog ยืนยันปรากฏอยู่จริง\nตัวอย่าง: await expect(page.getByTestId('confirm-dialog-confirm')).toBeVisible();");
      }

      const hasConfirmClick = /await\s+page\.getByTestId\(['"]confirm-dialog-confirm['"]\)\.click\(\)/.test(code);
      if (hasConfirmClick) {
        log("✓ ขั้นตอนที่ 3: คลิกยืนยันลบจริงถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งคลิกยืนยันลบ\nตัวอย่าง: await page.getByTestId('confirm-dialog-confirm').click();");
      }
    },
    hint: "คลิก await page.getByTestId('btn-delete-holding').first().click(); แล้วเช็ค await expect(page.getByTestId('confirm-dialog-confirm')).toBeVisible(); จากนั้นคลิก await page.getByTestId('confirm-dialog-confirm').click();",
    solution: `import { test, expect } from '@playwright/test';

test('TC-14: กดลบ Holdings ต้องเจอ Confirm Dialog ก่อนข้อมูลจะหายจริง', async ({ page }) => {
  await page.goto('/holdings');

  // 1. คลิกปุ่มลบแถวแรก (Test ID: btn-delete-holding)
  await page.getByTestId('btn-delete-holding').first().click();

  // 2. ต้องเจอ Dialog ยืนยันก่อนเสมอ ตรวจสอบว่าปุ่มยืนยัน (Test ID: confirm-dialog-confirm) ปรากฏอยู่จริง
  await expect(page.getByTestId('confirm-dialog-confirm')).toBeVisible();

  // 3. คลิกปุ่มยืนยันเพื่อลบจริง
  await page.getByTestId('confirm-dialog-confirm').click();
});`,
    theory: `บั๊กอัตโนมัติที่พบบ่อยมากคือ: สคริปต์คลิกปุ่ม "ลบ" แล้วรีบไปตรวจสอบผลลัพธ์ทันที ทั้งที่จริงแล้วแอปมี <strong>Confirm Dialog</strong> คั่นกลางอยู่ก่อนข้อมูลจะถูกลบจริง — ถ้าไม่คลิกยืนยันในไดอะล็อก ข้อมูลจะไม่หายไปไหนเลย แต่เทสอาจ "ผ่าน" แบบหลอกๆ เพราะดันไปจับ error อื่นแทนที่จะรู้ว่าไม่ได้ลบจริง<br/><br/>
    ในโปรเจก My-Investment-Port หน้า <code>/holdings</code> ปุ่มลบแต่ละแถวมี Test ID <code>btn-delete-holding</code> (ดูจริงใน <code>HoldingsLedger.jsx</code>) กดแล้วจะเปิด <code>ConfirmDialog</code> component (<code>src/components/modals/ConfirmDialog.jsx</code>) ซึ่ง <strong>ใช้ Test ID เดียวกันซ้ำทั้งแอป</strong> ไม่ว่าจะลบ Holdings, RMF Fund, หรือ Passive Income: ปุ่มยืนยันคือ <code>confirm-dialog-confirm</code> ปุ่มยกเลิกคือ <code>confirm-dialog-cancel</code><br/><br/>
    หลักการ: ก่อนคลิกปุ่มยืนยันในไดอะล็อกใดๆ ต้องยืนยันก่อนด้วย <code>toBeVisible()</code> ว่ามันเปิดขึ้นมาจริงแล้ว (ไม่ใช่คลิกไปมั่วๆ ตำแหน่งเดิมที่เคยมี dialog) เพราะถ้า dialog ยังไม่ทันเปิด การคลิกจะพลาดเป้าและ test จะ fail ด้วยสาเหตุที่เข้าใจผิดได้ง่าย`,
    example: `// ตัวอย่าง cancel flow: กดลบแล้วเปลี่ยนใจกดยกเลิก ข้อมูลต้องยังอยู่เหมือนเดิม
await page.getByTestId('btn-delete-holding').first().click();
await expect(page.getByTestId('confirm-dialog-cancel')).toBeVisible();
await page.getByTestId('confirm-dialog-cancel').click();
await expect(page.getByTestId('confirm-dialog-confirm')).toBeHidden();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. คลิกปุ่มลบแถวแรกด้วย Test ID <code>btn-delete-holding</code><br/>
    2. ตรวจสอบว่าปุ่มยืนยัน Test ID <code>confirm-dialog-confirm</code> ปรากฏอยู่จริงก่อนดำเนินการต่อ<br/>
    3. คลิกปุ่มยืนยันเพื่อสั่งลบจริง`
  },
  {
    id: "loading_state_wait",
    meta: "บทที่ 15",
    title: "Loading State: รอผลลัพธ์จริง ไม่ใช่เดาเวลา",
    template: `import { test, expect } from '@playwright/test';

test('TC-15: ถามคำถาม AI แล้วต้องรอคำตอบจริง ไม่ใช่เดาเวลา', async ({ page }) => {
  await page.goto('/');

  // 1. กรอกคำถามลงในช่อง Test ID 'ai-overview-chat-input' แล้วกดปุ่มส่ง (Test ID 'ai-overview-chat-send')
  // WRITE YOUR CODE HERE


  // 2. รอจนกว่าปุ่มส่งจะกลับมาพร้อมใช้งานอีกครั้ง (ไม่ disabled ระหว่างรอ AI ตอบ) แทนการเดาเวลาว่า AI จะตอบเมื่อไหร่

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการรอ Loading State...");
      const hasFill = /await\s+page\.getByTestId\(['"]ai-overview-chat-input['"]\)\.fill\(/.test(code);
      const hasSendClick = /await\s+page\.getByTestId\(['"]ai-overview-chat-send['"]\)\.click\(\)/.test(code);
      if (hasFill && hasSendClick) {
        log("✓ ขั้นตอนที่ 1: กรอกคำถามแล้วกดส่งถูกต้อง");
      } else {
        throw new Error("ไม่พบการกรอกคำถามลงในช่อง ai-overview-chat-input แล้วคลิก ai-overview-chat-send\nตัวอย่าง: await page.getByTestId('ai-overview-chat-input').fill('...');\nawait page.getByTestId('ai-overview-chat-send').click();");
      }

      const hasFixedWait = /waitForTimeout/.test(code);
      const hasEnabledWait = /await\s+expect\(page\.getByTestId\(['"]ai-overview-chat-send['"]\)\)\.toBeEnabled\(\)/.test(code);
      if (hasFixedWait) {
        throw new Error("ห้ามใช้การหน่วงเวลาคงที่แทนการรอผลลัพธ์จริง — เวลาที่ AI ใช้ตอบไม่คงที่ เดาไม่ได้");
      } else if (hasEnabledWait) {
        log("✓ ขั้นตอนที่ 2: รอปุ่มส่งกลับมาพร้อมใช้งาน (toBeEnabled) แทนการเดาเวลาถูกต้อง");
      } else {
        throw new Error("ไม่พบการรอด้วย auto-retry assertion\nตัวอย่าง: await expect(page.getByTestId('ai-overview-chat-send')).toBeEnabled();");
      }
    },
    hint: "กรอกด้วย await page.getByTestId('ai-overview-chat-input').fill('สรุปพอร์ตให้หน่อย'); แล้วคลิก await page.getByTestId('ai-overview-chat-send').click(); จากนั้นรอด้วย await expect(page.getByTestId('ai-overview-chat-send')).toBeEnabled();",
    solution: `import { test, expect } from '@playwright/test';

test('TC-15: ถามคำถาม AI แล้วต้องรอคำตอบจริง ไม่ใช่เดาเวลา', async ({ page }) => {
  await page.goto('/');

  // 1. กรอกคำถามลงในช่อง Test ID 'ai-overview-chat-input' แล้วกดปุ่มส่ง (Test ID 'ai-overview-chat-send')
  await page.getByTestId('ai-overview-chat-input').fill('สรุปพอร์ตให้หน่อย');
  await page.getByTestId('ai-overview-chat-send').click();

  // 2. รอจนกว่าปุ่มส่งจะกลับมาพร้อมใช้งานอีกครั้ง (ไม่ disabled ระหว่างรอ AI ตอบ) แทนการเดาเวลาว่า AI จะตอบเมื่อไหร่
  await expect(page.getByTestId('ai-overview-chat-send')).toBeEnabled();
});`,
    theory: `ฟีเจอร์ที่เรียก AI/LLM ตอบคำถาม (เช่น chat panel) มีเวลาตอบสนองที่ "ไม่คงที่" โดยธรรมชาติ — บางครั้งเร็ว บางครั้งช้ากว่าเดิมหลายเท่า การใส่ <code>waitForTimeout(3000)</code> เดาเวลาจึงเป็นทางแก้ที่ผิดเสมอ: เดาน้อยไปก็ flaky เดามากไปก็เสียเวลาทุก run<br/><br/>
    ในโปรเจก My-Investment-Port หน้าแรก <code>/</code> (route <code>path: '/'</code> ใน <code>src/routes/index.jsx</code>) มี <code>OverviewChatPanel</code> ที่เขียนโค้ดจริงไว้ชัดเจน:<br/>
    <code>const [loading, setLoading] = useState(false);<br/>
    ...<br/>
    disabled={!input.trim() || loading}<br/>
    {loading ? 'Thinking...' : 'Send'}</code><br/><br/>
    ปุ่มส่ง (Test ID <code>ai-overview-chat-send</code>) จะ <code>disabled</code> ระหว่างรอ AI ตอบ และกลับมาพร้อมใช้งานเมื่อได้คำตอบแล้วเท่านั้น — นี่คือสัญญาณ "โหลดเสร็จจริง" ที่เชื่อถือได้ 100% ใช้ <code>expect().toBeEnabled()</code> (auto-retry จนกว่าจะผ่านหรือ timeout ของ test เอง) แทนการเดาเวลาแบบตายตัว`,
    example: `// ตัวอย่างรอ loading indicator หายไปก่อนอ่านผลลัพธ์ (รูปแบบทั่วไป)
await page.getByTestId('submit-btn').click();
await expect(page.getByTestId('loading-spinner')).toBeHidden();
await expect(page.getByTestId('result-panel')).toBeVisible();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. กรอกคำถามลงในช่อง Test ID <code>ai-overview-chat-input</code> แล้วคลิกปุ่มส่ง Test ID <code>ai-overview-chat-send</code><br/>
    2. รอด้วย <code>expect(page.getByTestId('ai-overview-chat-send')).toBeEnabled()</code> แทนการหน่วงเวลาคงที่ เพื่อยืนยันว่า AI ตอบกลับมาแล้วจริง`
  },
  {
    id: "file_upload_ui",
    meta: "บทที่ 16",
    title: "File Upload UI: ทดสอบ Import ไฟล์ผ่านหน้าจอ",
    template: `import { test, expect } from '@playwright/test';

test('TC-16: นำเข้าไฟล์ CSV ผ่านหน้าจอ Holdings (ฟีเจอร์สมมติ)', async ({ page }) => {
  await page.goto('/holdings');

  // หมายเหตุ: ช่องอัปโหลดนี้เป็นฟีเจอร์สมมติ ยังไม่มีอยู่จริงใน My-Investment-Port ปัจจุบัน (สอนเทคนิค setInputFiles สำหรับตอนที่ต้องเจอฟีเจอร์นี้จริง)
  // 1. อัปโหลดไฟล์ผ่าน input Test ID 'import-csv-input' ด้วย setInputFiles ส่ง path './fixtures/holdings-sample.csv'
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่าข้อความผลลัพธ์ Test ID 'import-result-message' ปรากฏและมีคำว่า 'Imported'

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการอัปโหลดไฟล์ผ่าน UI...");
      const hasSetInputFiles = /await\s+page\.getByTestId\(['"]import-csv-input['"]\)\.setInputFiles\(['"]\.\/fixtures\/holdings-sample\.csv['"]\)/.test(code);
      if (hasSetInputFiles) {
        log("✓ ขั้นตอนที่ 1: อัปโหลดไฟล์ด้วย setInputFiles ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv')\nตัวอย่าง: await page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv');");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]Imported['"]\)/.test(code);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความผลลัพธ์การนำเข้าถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความผลลัพธ์\nตัวอย่าง: await expect(page.getByTestId('import-result-message')).toContainText('Imported');");
      }
    },
    hint: "ใช้ await page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv'); แล้วเช็ค await expect(page.getByTestId('import-result-message')).toContainText('Imported');",
    solution: `import { test, expect } from '@playwright/test';

test('TC-16: นำเข้าไฟล์ CSV ผ่านหน้าจอ Holdings (ฟีเจอร์สมมติ)', async ({ page }) => {
  await page.goto('/holdings');

  // หมายเหตุ: ช่องอัปโหลดนี้เป็นฟีเจอร์สมมติ ยังไม่มีอยู่จริงใน My-Investment-Port ปัจจุบัน (สอนเทคนิค setInputFiles สำหรับตอนที่ต้องเจอฟีเจอร์นี้จริง)
  // 1. อัปโหลดไฟล์ผ่าน input Test ID 'import-csv-input' ด้วย setInputFiles ส่ง path './fixtures/holdings-sample.csv'
  await page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv');

  // 2. ตรวจสอบว่าข้อความผลลัพธ์ Test ID 'import-result-message' ปรากฏและมีคำว่า 'Imported'
  await expect(page.getByTestId('import-result-message')).toContainText('Imported');
});`,
    theory: `<strong>หมายเหตุสำคัญ:</strong> โปรเจก My-Investment-Port ปัจจุบัน<strong>ไม่มี</strong> input อัปโหลดไฟล์เลยสักจุด (เช็คแล้วทั้ง repo ไม่พบ <code>&lt;input type="file"&gt;</code> หรือ endpoint สำหรับ import ไฟล์) — บทเรียนนี้จึงสอนเทคนิคที่จำเป็นล่วงหน้า เผื่อวันที่แอปมีฟีเจอร์นี้จริง หรือไปเจอในโปรเจกอื่น<br/><br/>
    การทดสอบ <code>&lt;input type="file"&gt;</code> ห้ามคลิกเปิดหน้าต่างเลือกไฟล์ของ OS จริง (Native File Picker) เพราะ browser automation ควบคุมหน้าต่าง OS แบบนั้นไม่ได้และไม่เสถียร วิธีที่ถูกต้องคือใช้ <code>page.setInputFiles()</code> ซึ่งจะ "แนบไฟล์" เข้ากับ <code>&lt;input&gt;</code> โดยตรง ข้าม Native Picker ไปเลย ทำให้เทสเร็วและเสถียร 100%<br/><br/>
    รับ path เดียว (<code>string</code>) สำหรับไฟล์เดียว หรือ array ของ path สำหรับหลายไฟล์พร้อมกัน (<code>setInputFiles(['a.csv', 'b.csv'])</code>) และใช้ <code>setInputFiles([])</code> เพื่อล้างค่าไฟล์ที่เลือกไว้ก่อนหน้า`,
    example: `// ตัวอย่างอัปโหลดหลายไฟล์พร้อมกัน และล้างค่าไฟล์ที่เลือกไว้
await page.getByTestId('attachment-input').setInputFiles(['receipt1.pdf', 'receipt2.pdf']);
// ...
await page.getByTestId('attachment-input').setInputFiles([]); // ล้างค่า`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (ฟีเจอร์สมมติเพื่อฝึกเทคนิค) โดย:<br/>
    1. อัปโหลดไฟล์ <code>./fixtures/holdings-sample.csv</code> ผ่าน Test ID <code>import-csv-input</code> ด้วย <code>setInputFiles</code><br/>
    2. ตรวจสอบว่าข้อความผลลัพธ์ Test ID <code>import-result-message</code> มีคำว่า <code>'Imported'</code>`
  },
  {
    id: "file_type_validation",
    meta: "บทที่ 17",
    title: "File Type Validation: UI ต้องแจ้ง Error เมื่ออัปโหลดไฟล์ผิดประเภท",
    template: `import { test, expect } from '@playwright/test';

test('TC-17: อัปโหลดไฟล์ .exe ต้องขึ้น Error ไม่ใช่ Import สำเร็จ (ฟีเจอร์สมมติ)', async ({ page }) => {
  await page.goto('/holdings');

  // หมายเหตุ: ฟีเจอร์สมมติต่อยอดจากบทที่ 16
  // 1. อัปโหลดไฟล์ 'malware.exe' ผ่าน input Test ID 'import-csv-input' ด้วย setInputFiles
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่าข้อความ Test ID 'import-result-message' มีคำว่า 'Only CSV files are allowed'

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ File Type Validation ฝั่ง UI...");
      const hasSetInputFiles = /await\s+page\.getByTestId\(['"]import-csv-input['"]\)\.setInputFiles\(['"]\.\/fixtures\/malware\.exe['"]\)/.test(code);
      if (hasSetInputFiles) {
        log("✓ ขั้นตอนที่ 1: อัปโหลดไฟล์ malware.exe ด้วย setInputFiles ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe')\nตัวอย่าง: await page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe');");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]Only CSV files are allowed['"]\)/.test(code);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error\nตัวอย่าง: await expect(page.getByTestId('import-result-message')).toContainText('Only CSV files are allowed');");
      }
    },
    hint: "ใช้ await page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe'); แล้วเช็ค await expect(page.getByTestId('import-result-message')).toContainText('Only CSV files are allowed');",
    solution: `import { test, expect } from '@playwright/test';

test('TC-17: อัปโหลดไฟล์ .exe ต้องขึ้น Error ไม่ใช่ Import สำเร็จ (ฟีเจอร์สมมติ)', async ({ page }) => {
  await page.goto('/holdings');

  // หมายเหตุ: ฟีเจอร์สมมติต่อยอดจากบทที่ 16
  // 1. อัปโหลดไฟล์ 'malware.exe' ผ่าน input Test ID 'import-csv-input' ด้วย setInputFiles
  await page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe');

  // 2. ตรวจสอบว่าข้อความ Test ID 'import-result-message' มีคำว่า 'Only CSV files are allowed'
  await expect(page.getByTestId('import-result-message')).toContainText('Only CSV files are allowed');
});`,
    theory: `บทที่แล้วสอน happy path ของการอัปโหลด บทนี้ต่อยอดเช็คว่า UI แจ้งเตือนถูกต้องเมื่อผู้ใช้เลือกไฟล์ผิดประเภทหรือเปล่า — จุดสำคัญคือ<strong>การ Validate ควรเกิดตั้งแต่ฝั่ง Client</strong> (ก่อนแม้แต่จะส่งไปหา Backend) เพื่อ feedback ผู้ใช้ทันทีโดยไม่ต้องรอ round-trip เครือข่าย ถึงแม้ว่า Backend เองก็ต้อง validate ซ้ำอีกชั้นเสมอ (Client-side validation หลอกได้ ห้ามเชื่อฝั่งเดียว ดู track API Testing บทที่ 11)<br/><br/>
    เทคนิคสำคัญ: <code>page.setInputFiles()</code> ไม่จำเป็นต้องมีไฟล์จริงอยู่บนดิสก์เสมอไป — รับ <code>string</code> path ก็ได้ (ต้องมีไฟล์จริงตามที่ระบุ) แต่ก็รับ object <code>{ name, mimeType, buffer }</code> ได้ด้วย (สร้างไฟล์จำลองขึ้นในหน่วยความจำตรงๆ ไม่ต้องมีไฟล์จริง) — บทถัดไปจะสอนรูปแบบหลังสำหรับทดสอบไฟล์ขนาดใหญ่โดยไม่ต้อง commit ไฟล์จริงติด repo`,
    example: `// ตัวอย่างสร้างไฟล์จำลองในหน่วยความจำแทนการอ้างอิง path จริง (ไม่ต้องมีไฟล์จริงบนดิสก์)
await page.getByTestId('import-csv-input').setInputFiles({
  name: 'notes.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('this is not a csv file'),
});
await expect(page.getByTestId('import-result-message')).toContainText('Only CSV files are allowed');`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (ฟีเจอร์สมมติต่อยอดจากบทที่ 16) โดย:<br/>
    1. อัปโหลดไฟล์ <code>./fixtures/malware.exe</code> ผ่าน Test ID <code>import-csv-input</code><br/>
    2. ตรวจสอบว่าข้อความ Test ID <code>import-result-message</code> มีคำว่า <code>'Only CSV files are allowed'</code>`
  },
  {
    id: "file_size_validation",
    meta: "บทที่ 18",
    title: "File Size Validation: UI ต้องปฏิเสธไฟล์ใหญ่เกินโดยไม่ต้องมีไฟล์จริง",
    template: `import { test, expect } from '@playwright/test';

test('TC-18: อัปโหลดไฟล์ใหญ่เกิน 5MB ต้องขึ้น Error (ฟีเจอร์สมมติ)', async ({ page }) => {
  await page.goto('/holdings');

  // หมายเหตุ: ฟีเจอร์สมมติต่อยอดจากบทที่ 16-17
  // 1. อัปโหลดไฟล์จำลองขนาด 6MB ผ่าน input Test ID 'import-csv-input' ด้วย setInputFiles แบบ object (ไม่ต้องมีไฟล์จริง)
  // WRITE YOUR CODE HERE


  // 2. ตรวจสอบว่าข้อความ Test ID 'import-result-message' มีคำว่า 'File size exceeds 5MB limit'

});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ File Size Validation ฝั่ง UI...");
      const hasSetInputFiles = /await\s+page\.getByTestId\(['"]import-csv-input['"]\)\.setInputFiles\(\{[\s\S]*?buffer:\s*Buffer\.alloc\(\s*6\s*\*\s*1024\s*\*\s*1024\s*\)[\s\S]*?\}\)/.test(code);
      if (hasSetInputFiles) {
        log("✓ ขั้นตอนที่ 1: อัปโหลดไฟล์จำลองขนาด 6MB ด้วย setInputFiles แบบ object ถูกต้อง");
      } else {
        throw new Error("ไม่พบการอัปโหลดไฟล์จำลองขนาด 6MB\nตัวอย่าง: await page.getByTestId('import-csv-input').setInputFiles({ name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) });");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]File size exceeds 5MB limit['"]\)/.test(code);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error\nตัวอย่าง: await expect(page.getByTestId('import-result-message')).toContainText('File size exceeds 5MB limit');");
      }
    },
    hint: "ใช้ await page.getByTestId('import-csv-input').setInputFiles({ name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) }); แล้วเช็ค toContainText('File size exceeds 5MB limit')",
    solution: `import { test, expect } from '@playwright/test';

test('TC-18: อัปโหลดไฟล์ใหญ่เกิน 5MB ต้องขึ้น Error (ฟีเจอร์สมมติ)', async ({ page }) => {
  await page.goto('/holdings');

  // หมายเหตุ: ฟีเจอร์สมมติต่อยอดจากบทที่ 16-17
  // 1. อัปโหลดไฟล์จำลองขนาด 6MB ผ่าน input Test ID 'import-csv-input' ด้วย setInputFiles แบบ object (ไม่ต้องมีไฟล์จริง)
  await page.getByTestId('import-csv-input').setInputFiles({
    name: 'huge.csv',
    mimeType: 'text/csv',
    buffer: Buffer.alloc(6 * 1024 * 1024)
  });

  // 2. ตรวจสอบว่าข้อความ Test ID 'import-result-message' มีคำว่า 'File size exceeds 5MB limit'
  await expect(page.getByTestId('import-result-message')).toContainText('File size exceeds 5MB limit');
});`,
    theory: `การทดสอบไฟล์ขนาดใหญ่ไม่จำเป็นต้อง commit ไฟล์ 6MB ติด test repo จริงๆ — ใช้รูปแบบ object ของ <code>setInputFiles({ name, mimeType, buffer })</code> สร้างไฟล์จำลองขึ้นในหน่วยความจำแทน (<code>Buffer.alloc(6 * 1024 * 1024)</code> จองพื้นที่ 6MB เปล่าๆ ในหน่วยความจำตอนรัน ไม่ต้องมีไฟล์จริงบนดิสก์เลย) — เร็วกว่า ไม่ทำให้ repo บวม และ reproducible 100% ทุกเครื่องที่รัน<br/><br/>
    UI ที่ดีควรเช็คขนาดไฟล์<strong>ฝั่ง Client ทันทีที่เลือกไฟล์</strong> (ผ่าน <code>File.size</code> ใน JavaScript) ก่อนจะอัปโหลดขึ้น Backend ด้วยซ้ำ — ประหยัด bandwidth และให้ feedback ผู้ใช้เร็วกว่ารอ round-trip เครือข่ายไปเจอ 413 กลับมา (แต่ฝั่ง Backend ก็ต้องเช็คซ้ำเสมอ เพราะ client-side validation ข้ามได้เสมอถ้ายิง request ตรงแบบ track API Testing บทที่ 12)`,
    example: `// ตัวอย่างไฟล์ขนาดพอดี limit ต้องผ่าน ไม่ใช่โดนบล็อก
await page.getByTestId('import-csv-input').setInputFiles({
  name: 'ok.csv',
  mimeType: 'text/csv',
  buffer: Buffer.alloc(1024) // 1KB เล็กมาก ไม่เกิน limit แน่นอน
});
await expect(page.getByTestId('import-result-message')).toContainText('Imported');`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ (ฟีเจอร์สมมติต่อยอดจากบทที่ 16-17) โดย:<br/>
    1. อัปโหลดไฟล์จำลองขนาด <code>6MB</code> ผ่าน Test ID <code>import-csv-input</code> ด้วย <code>setInputFiles({ name, mimeType, buffer: Buffer.alloc(6 * 1024 * 1024) })</code><br/>
    2. ตรวจสอบว่าข้อความ Test ID <code>import-result-message</code> มีคำว่า <code>'File size exceeds 5MB limit'</code>`
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
  const savedCode = localStorage.getItem(`pw_sandbox_code_${lesson.id}`);
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
  return localStorage.getItem('pw_course_completed_' + lessonId) === 'true';
}

// Mark lesson completed
function setLessonCompleted(lessonId) {
  localStorage.setItem('pw_course_completed_' + lessonId, 'true');
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
  localStorage.setItem(`pw_sandbox_code_${lesson.id}`, userCode);
  
  // Start compiling animation log in terminal
  terminal.innerHTML = `
    <div class="terminal-line info">[Playwright Runner] กำหนดคอมไพล์เพื่อเริ่มรัน...</div>
    <div class="terminal-line info">npx playwright test ${lesson.id}.spec.ts --project=macbook-pro-14</div>
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
        <div class="terminal-line success">1 passed (136ms)</div>
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
        <div class="terminal-line error">1 failed (48ms)</div>
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
      if (key && (key.startsWith('pw_course_completed_') || key.startsWith('pw_sandbox_code_'))) {
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Playwright Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค Page Object, API Mocking, React components testing และกลยุทธ์การตรวจจับบั๊กขั้นสูงไปใช้งานจริงในโปรเจค My-Investment-Port!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

// Run on window boot
window.onload = initApp;
