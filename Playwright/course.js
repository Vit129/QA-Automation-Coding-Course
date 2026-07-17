(function() {
// Playwright Interactive Coding Playground Data and Logic
// Grounded in the /Users/supavit.cho/Git/Personal/My-Investment-Port/react_typescript_101/ codebase.

// Strip // line-comments and /* */ block comments from submitted code before pattern-matching,
// so a learner cannot "pass" validate() by pasting the answer inside a comment instead of writing real code.
function stripComments(code) {
  const noLineComments = code
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n');
  return noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
}

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
      const clean = stripComments(code);
      if (/await\s+page\.goto\(['"]\/holdings['"]\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 1: ไปที่พิกัด /holdings ถูกต้อง");
      } else {
        throw new Error("ลบคำสั่ง page.goto('/holdings') หรือไม่? กรุณาเขียนคืนด้วย");
      }

      const hasFill = /await\s+page\.getByTestId\(['"]search-input['"]\)\.fill\(['"]AAPL['"]\)/.test(clean);
      if (hasFill) {
        log("✓ ขั้นตอนที่ 2: ใช้ getByTestId('search-input').fill('AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งกรอกข้อมูล AAPL ลงในช่องค้นหา หรือไม่ได้ค้นหาด้วย TestId 'search-input'\nตัวอย่าง: await page.getByTestId('search-input').fill('AAPL');");
      }

      const hasExpect = /await\s+expect\(page\.getByTestId\(['"]table-container['"]\)\)\.toContainText\(['"]AAPL['"]\)/.test(clean);
      if (hasExpect) {
        log("✓ ขั้นตอนที่ 3: ใช้ expect(table-container).toContainText('AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งทำ Assertion เพื่อเช็คว่าตารางประกอบด้วยข้อความ AAPL\nตัวอย่าง: await expect(page.getByTestId('table-container')).toContainText('AAPL');");
      }
    },
    hint: "ขั้นตอนที่ 2 ต้องใช้ Locator ค้นหาด้วย Test ID แล้วตามด้วยแอคชันสำหรับกรอกข้อความแทนที่ค่าทั้งหมดในช่อง (ไม่ใช่การพิมพ์ทีละตัวอักษร) ส่วนขั้นตอนที่ 3 ให้ใช้ Web-first assertion ตระกูลตรวจสอบว่ามีข้อความปรากฏอยู่บางส่วนภายใน element",
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
      const clean = stripComments(code);
      if (!/page\.evaluate\s*\(/.test(clean)) {
        throw new Error("คุณจำเป็นต้องรันสคริปต์ในฝั่งเบราว์เซอร์ด้วยคำสั่ง page.evaluate()");
      }
      log("✓ ค้นพบคำสั่ง page.evaluate");

      if (!/portfolio_holdings/.test(clean)) {
        throw new Error("ไม่ได้ดึงคีย์คาร์ด 'portfolio_holdings' จากหน่วยความจำเบราว์เซอร์");
      }
      log("✓ ค้นพบตัวแปรเป้าหมาย 'portfolio_holdings'");

      const pattern = /await\s+page\.evaluate.*?window\.localStorage\.getItem\(['"]portfolio_holdings['"]\)/s.test(clean) ||
                      /await\s+page\.evaluate.*?localStorage\.getItem\(['"]portfolio_holdings['"]\)/s.test(clean);

      if (pattern) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ดึงและรีเทิร์นค่า JSON จาก localStorage สำเร็จ");
      } else {
        throw new Error("โค้ดดึงค่าไม่ถูกต้อง\nตัวอย่างการเขียน:\nreturn await page.evaluate(() => localStorage.getItem('portfolio_holdings'));");
      }
    },
    hint: "ต้องส่งฟังก์ชัน callback ไปรันในบริบทของเบราว์เซอร์ผ่านเมธอดของ Page ที่ทำหน้าที่นี้โดยเฉพาะ แล้วภายใน callback นั้นเรียกใช้เมธอดมาตรฐานของ Web Storage API สำหรับดึงค่าตามคีย์ที่กำหนด",
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
      const clean = stripComments(code);
      if (/super\(page\)/.test(clean)) {
        log("✓ ขั้นตอนที่ 1: เรียก constructor คลาสแม่ด้วย super(page) ถูกต้อง");
      } else {
        throw new Error("คุณลืมเรียกใช้ super(page) ภายใน constructor หรือไม่?");
      }

      const hasMetric = /this\.metricsSection\s*=\s*page\.getByTestId\(['"]tax-metrics-section['"]\)/.test(clean) ||
                        /this\.metricsSection\s*=\s*this\.page\.getByTestId\(['"]tax-metrics-section['"]\)/.test(clean);
      if (hasMetric) {
        log("✓ ขั้นตอนที่ 2: ลงทะเบียนตัวแปร metricsSection สำเร็จ");
      } else {
        throw new Error("ไม่พบการลงทะเบียน metricsSection ด้วยการค้นหา TestId 'tax-metrics-section'\nตัวอย่าง: this.metricsSection = page.getByTestId('tax-metrics-section');");
      }

      const hasNav = /await\s+this\.navigateTo\(['"]\/tax['"]\)/.test(clean);
      if (hasNav) {
        log("✓ ขั้นตอนที่ 3: เมธอด navigate เรียกใช้งานพิกัด /tax สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่งเปลี่ยนหน้าไปพิกัด '/tax' โดยเรียกผ่าน navigateTo ของคลาสแม่\nตัวอย่าง: await this.navigateTo('/tax');");
      }
    },
    hint: "constructor ของคลาสลูกที่สืบทอด (extends) ต้องเรียก constructor ของคลาสแม่เป็นบรรทัดแรกเสมอ ส่วน Locator ให้ใช้วิธีค้นหาด้วย Test ID แบบเดียวกับที่ formPanel ใช้ในบทอื่น และเมธอด navigate ให้เรียกใช้เมธอดของ BasePage ที่มีไว้สำหรับเปลี่ยนเส้นทางหน้าโดยเฉพาะ",
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
      const clean = stripComments(code);
      if (!/addInitScript\s*\(/.test(clean)) {
        throw new Error("โปรเจคนี้ต้องการให้เพิ่มข้อมูลเริ่มต้นก่อนหน้าเว็บเรนเดอร์ กรุณาใช้งาน page.addInitScript()");
      }
      log("✓ ตรวจพบการใช้งาน page.addInitScript");

      if (!/portfolio_holdings/.test(clean)) {
        throw new Error("ไม่พบการเซ็ตคีย์ 'portfolio_holdings' ใน localStorage ของสคริปต์");
      }

      const checkSet = /window\.localStorage\.setItem\(['"]portfolio_holdings['"],\s*JSON\.stringify\(.*?\)\)/.test(clean) ||
                       /localStorage\.setItem\(['"]portfolio_holdings['"],\s*JSON\.stringify\(.*?\)\)/.test(clean);

      if (checkSet) {
        log("✓ โค้ดคอมไพล์สำเร็จ: โหลดชุดจำลองข้อมูลเข้า LocalStorage ก่อนเรนเดอร์สำเร็จ");
      } else {
        throw new Error("รูปแบบสคริปต์ addInitScript ไม่ถูกต้อง\nตัวอย่างการเขียน:\nawait page.addInitScript((data) => {\n  localStorage.setItem('portfolio_holdings', JSON.stringify(data));\n}, baseline);");
      }
    },
    hint: "ต้องแทรกสคริปต์ให้รันตั้งแต่ก่อนหน้าเว็บเรนเดอร์ (เมธอดของ Page ที่ตรงข้ามกับ evaluate ตรงที่รันล่วงหน้าก่อน document ถูกสร้างขึ้น) แล้วภายในนั้นใช้เมธอดมาตรฐานของ Web Storage สำหรับบันทึกค่า โดยแปลง object ให้เป็นสตริงก่อนด้วยเมธอดมาตรฐานของ JSON",
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
      const clean = stripComments(code);
      const pattern = /this\.formSaveBtn\s*=\s*this\.formPanel\.getByTestId\(['"]form-save-btn['"]\)/.test(clean);
      if (pattern) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ทำการจำกัดขอบเขตการค้นหาปุ่มบันทึกสำเร็จ (Scoped Locator)");
      } else {
        throw new Error("การอ้างอิงปุ่มบันทึกไม่ถูกต้อง หรือไม่ได้จำกัดขอบเขต (Scoped) ลงใน formPanel\nตัวอย่าง: this.formSaveBtn = this.formPanel.getByTestId('form-save-btn');");
      }
    },
    hint: "Locator สามารถเรียกเมธอดค้นหาต่อจาก Locator อีกตัวได้โดยตรงเพื่อจำกัดขอบเขตการค้นหาเฉพาะลูกหลานของมัน (Scoped Locator) — ลองเรียกเมธอดค้นหาด้วย Test ID ต่อจากตัวแปร formPanel แทนที่จะเรียกจาก page ตรง ๆ",
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
      const clean = stripComments(code);
      const hasNotVisible = /await\s+expect\(formPanel\)\.not\.toBeVisible\(\)/.test(clean);
      if (hasNotVisible) {
        log("✓ ขั้นตอนที่ 1: ตรวจสอบความซ่อนรูปของฟอร์ม (not.toBeVisible) สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่งตรวจเช็คว่าฟอร์มซ่อนตัว\nตัวอย่าง: await expect(formPanel).not.toBeVisible();");
      }

      const hasURL = /await\s+expect\(page\)\.toHaveURL\(\/\\\/holdings\/\)/.test(clean) ||
                     /await\s+expect\(page\)\.toHaveURL\(.*holdings.*\)/.test(clean);
      if (hasURL) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบเส้นทาง URL ของระบบจัดพอร์ตสำเร็จ");
      } else {
        throw new Error("ไม่พบการเช็ค URL ของหน้าด้วย expect(page).toHaveURL()\nตัวอย่าง: await expect(page).toHaveURL(/\\/holdings/);");
      }
    },
    hint: "ขั้นตอนที่ 1 ต้องใช้ Web-first assertion ตระกูลตรวจสอบการมองเห็น พร้อม negate ผลลัพธ์ด้วยคีย์เวิร์ดที่ใช้กลับด้านเงื่อนไข ขั้นตอนที่ 2 ต้องใช้ assertion ตระกูลตรวจสอบ URL ของหน้าปัจจุบัน โดยรับ RegExp เป็นอาร์กิวเมนต์",
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
      const clean = stripComments(code);
      if (!/page\.route\s*\(/.test(clean)) {
        throw new Error("ไม่ได้เรียกใช้ page.route() เพื่อสกัดกั้นสัญญาณเน็ตเวิร์ก");
      }

      const checkGlob = /page\.route\(\s*['"][^'"]*script\.google\.com[^'"]*['"]/.test(clean);
      if (checkGlob) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบการตั้ง Glob Pattern ดักเซิร์ฟเวอร์ยิง Google Sheets");
      } else {
        throw new Error("ตั้งค่าพิกัด URL ดักจับไม่ถูกต้องสำหรับ script.google.com\nตัวอย่าง: '**/script.google.com/**'");
      }

      const checkFulfill = /route\.fulfill\(.*?status:\s*200.*?body:\s*JSON\.stringify\(.*?ok:\s*true.*?\).*?\)/s.test(clean) ||
                            /route\.fulfill\(.*?body:\s*JSON\.stringify\(.*?ok:\s*true.*?\).*?status:\s*200.*?\)/s.test(clean);
      if (checkFulfill) {
        log("✓ ขั้นตอนที่ 2: ส่งข้อมูลตอบกลับจำลองจำลองสำเร็จ (route.fulfill)");
      } else {
        throw new Error("สคริปต์ตอบข้อมูล fulfill ผิดพลาด\nตัวอย่างการเขียน:\nawait page.route('**/script.google.com/**', route => {\n  route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });\n});");
      }
    },
    hint: "ต้องใช้เมธอดของ Page สำหรับดักจับคำร้องขอเน็ตเวิร์กโดยระบุ glob pattern ของโดเมนเป้าหมายเป็นอาร์กิวเมนต์แรก แล้วภายใน callback เรียกเมธอดของออบเจกต์ route ที่ใช้ส่งข้อมูลตอบกลับปลอม พร้อมกำหนด status code และแปลง body เป็น JSON string",
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
      const clean = stripComments(code);
      if (/test\.describe\.configure\s*\(/.test(clean)) {
        log("✓ ค้นพบคำสั่งจัดแจงโหมดทดสอบ");
      } else {
        throw new Error("คุณจำเป็นต้องเรียกใช้งานคำสั่ง configure บนกลุ่มเทส describe");
      }

      const checkMode = /test\.describe\.configure\(\{\s*mode:\s*['"]serial['"]\s*\}\)/.test(clean);
      if (checkMode) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ตั้งค่าเทสให้รันต่อเนื่องกัน CRUD Flow สำเร็จ");
      } else {
        throw new Error("ตั้งค่าโหมด Serial ไม่ถูกต้อง\nตัวอย่างการเขียน:\ntest.describe.configure({ mode: 'serial' });");
      }
    },
    hint: "ใช้เมธอด configure ที่แนบอยู่กับ test.describe เพื่อกำหนดโหมดการรันของกลุ่มเทสทั้งหมด โดยส่ง option object ที่มีคีย์ mode และค่าที่หมายถึง 'เรียงต่อกันเป็นลำดับ' (คำภาษาอังกฤษที่ตรงข้ามกับการรันแบบขนาน)",
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
      const clean = stripComments(code);
      if (!/page\.on\s*\(/.test(clean)) {
        throw new Error("คุณต้องจับเหตุการณ์ (Event Listener) ด้วยคำสั่ง page.on()");
      }
      log("✓ ตรวจพบเหตุการณ์ดัก page.on");

      if (!/page\.on\(\s*['"]console['"]/.test(clean)) {
        throw new Error("ไม่ได้ผูกรับเหตุการณ์สืบจับของคลาส 'console'");
      }

      const checkType = /msg\.type\(\)\s*===\s*['"]error['"]/.test(clean);
      if (checkType) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ตั้งสคริปต์สืบจับและสกรีนข้อผิดพลาดสีแดงหลังบ้านสำเร็จ");
      } else {
        throw new Error("รูปแบบสคริปต์การสืบจับคลาสคอนโซลคลาดเคลื่อน\nตัวอย่างการเขียน:\npage.on('console', msg => {\n  if (msg.type() === 'error') console.log(msg.text());\n});");
      }
    },
    hint: "ต้องผูก Event Listener เข้ากับ page โดยฟังอีเวนต์ชื่อ 'console' เป็นอาร์กิวเมนต์แรก แล้วใน callback ตรวจสอบ property ที่บอกระดับของข้อความผ่านเมธอด .type() ของอ็อบเจกต์ message เทียบกับค่าที่หมายถึงข้อผิดพลาด",
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
      const clean = stripComments(code);
      if (/\.type\(/.test(clean)) {
        throw new Error("ห้ามใช้คำสั่ง .type() ในระบบ React Component เพราะอาจไม่กระตุ้นการเปลี่ยนค่า State ให้ใช้ .fill() แทน");
      }

      const checkFill = /await\s+salaryInput\.fill\(['"]65000['"]\)/.test(clean);
      if (checkFill) {
        log("✓ ขั้นตอนที่ 1: เลือกกรอกข้อมูลด้วยเมธอด fill() ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งกรอกเงินเดือน 65000 ด้วยคำสั่ง fill\nตัวอย่าง: await salaryInput.fill('65000');");
      }

      const checkAssert = /await\s+expect\(saveBtn\)\.toBeEnabled\(\)/.test(clean);
      if (checkAssert) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบคำสั่งเช็คความพร้อมปุ่มเซฟ (toBeEnabled)");
      } else {
        throw new Error("ไม่พบคำสั่งตรวจสอบสถานะความพร้อมของปุ่มเซฟ\nตัวอย่าง: await expect(saveBtn).toBeEnabled();");
      }
    },
    hint: "ห้ามใช้ .type() กับ React controlled component เพราะไม่กระตุ้น state ให้ครบทุกตัวอักษร ใช้เมธอดกรอกข้อมูลที่ล้างค่าเดิมแล้ว set ค่าใหม่ทันทีแทน ส่วนขั้นตอนที่ 2 ใช้ Web-first assertion ตระกูลตรวจสอบว่าอิลิเมนต์อยู่ในสถานะพร้อมกดโต้ตอบหรือไม่",
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
      const clean = stripComments(code);
      const checkSet = /await\s+page\.setViewportSize\(\{\s*width:\s*vp\.width,\s*height:\s*vp\.height\s*\}\)/.test(clean) ||
                       /await\s+page\.setViewportSize\(vp\)/.test(clean);
      if (checkSet) {
        log("✓ โค้ดคอมไพล์สำเร็จ: วนลูปสลับความกว้าง Responsive (Mobile/Tablet) สำเร็จ");
      } else {
        throw new Error("ไม่พบสคริปต์การสลับขนาดหน้าต่างเบราว์เซอร์ด้วยคำสั่ง setViewportSize\nตัวอย่าง: await page.setViewportSize({ width: vp.width, height: vp.height });");
      }
    },
    hint: "มีเมธอดของ Page ที่ใช้เปลี่ยนขนาดหน้าต่างเบราว์เซอร์โดยตรง รับ object ที่มี width/height เป็นอาร์กิวเมนต์ — ลองส่งตัวแปรลูปเข้าไปตรง ๆ หรือ destructure เป็น object ใหม่ก็ได้",
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
      const clean = stripComments(code);
      const hasApiCall = /await\s+request\.get\(['"]\/api\/ta\/levels\?ticker=AAPL['"]\)/.test(clean);
      if (hasApiCall) {
        log("✓ ขั้นตอนที่ 1a: ยิง request.get('/api/ta/levels?ticker=AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง request.get('/api/ta/levels?ticker=AAPL')\nตัวอย่าง: const response = await request.get('/api/ta/levels?ticker=AAPL');");
      }

      const hasJsonParse = /await\s+response\.json\(\)/.test(clean) && /\.resistance\[0\]/.test(clean);
      if (hasJsonParse) {
        log("✓ ขั้นตอนที่ 1b: ดึงค่า resistance[0] จาก response.json() ถูกต้อง");
      } else {
        throw new Error("ไม่พบการแปลง response เป็น JSON แล้วดึงค่า resistance[0]\nตัวอย่าง: const body = await response.json();\nconst r1 = body.resistance[0];");
      }

      const hasGoto = /await\s+page\.goto\(['"]\/holdings['"]\)/.test(clean);
      if (hasGoto) {
        log("✓ ขั้นตอนที่ 2a: เปิดหน้า /holdings ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.goto('/holdings')");
      }

      const hasCrossCheck = /getByText\(\s*['"]\$['"]\s*\+\s*\w+\.toFixed\(2\)\s*\)/.test(clean) && /toBeVisible\(\)/.test(clean);
      if (hasCrossCheck) {
        log("✓ ขั้นตอนที่ 2b: ตรวจสอบว่า UI แสดงตัวเลขตรงกับค่าจาก API สำเร็จ (Cross-check)");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความราคาบน UI ที่ตรงกับค่าจาก API\nตัวอย่าง: await expect(page.getByText('$' + r1.toFixed(2))).toBeVisible();");
      }
    },
    hint: "fixture request มีเมธอดสำหรับยิง HTTP GET ตรง ๆ แล้วแปลง response เป็น JSON ด้วยเมธอดมาตรฐาน จากนั้นเข้าถึง index แรกของอาร์เรย์ resistance ที่ได้ ฝั่ง UI ใช้ getByText() ประกอบสตริงราคาที่มีเครื่องหมาย $ นำหน้าและปัดทศนิยม 2 ตำแหน่งด้วยเมธอดมาตรฐานของตัวเลข แล้วตรวจสอบด้วย Web-first assertion ตระกูลการมองเห็น",
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
      const clean = stripComments(code);
      const hasRetryConfig = /test\.describe\.configure\(\{\s*retries:\s*2\s*\}\)/.test(clean);
      if (hasRetryConfig) {
        log("✓ ขั้นตอนที่ 1: กำหนด test.describe.configure({ retries: 2 }) ถูกต้อง");
      } else {
        throw new Error("ไม่พบ test.describe.configure({ retries: 2 })\nตัวอย่าง: test.describe.configure({ retries: 2 });");
      }

      const hasAutoRetryAssertion = /await\s+expect\(page\.getByText\(['"]AAPL['"]\)\)\.toBeVisible\(\)/.test(clean);
      const hasFixedWait = /waitForTimeout/.test(clean);
      if (hasAutoRetryAssertion && !hasFixedWait) {
        log("✓ ขั้นตอนที่ 2: ใช้ auto-retry assertion toBeVisible() แทน waitForTimeout ถูกต้อง");
      } else if (hasFixedWait) {
        throw new Error("ห้ามใช้ waitForTimeout ตายตัว ให้ใช้ await expect(page.getByText('AAPL')).toBeVisible(); แทน (auto-retry จนกว่าจะเจอหรือ timeout)");
      } else {
        throw new Error("ไม่พบการรอด้วย auto-retry assertion\nตัวอย่าง: await expect(page.getByText('AAPL')).toBeVisible();");
      }

      const hasRetryLog = /testInfo\.retry\s*>\s*0/.test(clean) && /console\.log\(.*Retry attempt.*testInfo\.retry/.test(clean);
      if (hasRetryLog) {
        log("✓ ขั้นตอนที่ 3: log เตือนเมื่อ testInfo.retry > 0 ถูกต้อง");
      } else {
        throw new Error("ไม่พบเงื่อนไข if (testInfo.retry > 0) พร้อม console.log('Retry attempt: ' + testInfo.retry)");
      }
    },
    hint: "configure ของ describe block รับ option ชื่อ retries เป็นตัวเลขจำนวนครั้งที่ยอมให้ลองซ้ำ การรอข้อความปรากฏให้ใช้ Web-first assertion ตระกูลการมองเห็นแทนการหน่วงเวลาคงที่เด็ดขาด และ testInfo (พารามิเตอร์ตัวที่สองของ test callback) มี property บอกจำนวนรอบที่กำลังรันซ้ำ",
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
      const clean = stripComments(code);
      const usesFragileClassLocator = /\.locator\(\s*['"]\./.test(clean);
      if (usesFragileClassLocator) {
        throw new Error("ห้ามใช้ page.locator('.class-name') เพราะ CSS class เปลี่ยนได้ทุกครั้งที่ Dev รีแฟคเตอร์ ให้ใช้ page.getByTestId('search-input') แทน");
      }

      const hasTestIdFill = /await\s+page\.getByTestId\(['"]search-input['"]\)\.fill\(['"]AAPL['"]\)/.test(clean);
      if (hasTestIdFill) {
        log("✓ ใช้ getByTestId('search-input').fill('AAPL') ที่ทนต่อการรีแฟคเตอร์ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('search-input').fill('AAPL')\nตัวอย่าง: await page.getByTestId('search-input').fill('AAPL');");
      }
    },
    hint: "ห้ามใช้ page.locator() ด้วย CSS selector เด็ดขาด ให้ค้นหาด้วยเมธอดที่อ้างอิง data-testid attribute แทน แล้วตามด้วยแอคชันกรอกข้อความมาตรฐานเหมือนบทนำ",
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
      const clean = stripComments(code);
      const hasDeleteClick = /await\s+page\.getByTestId\(['"]btn-delete-holding['"]\)\.first\(\)\.click\(\)/.test(clean);
      if (hasDeleteClick) {
        log("✓ ขั้นตอนที่ 1: คลิกปุ่มลบ (btn-delete-holding) ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('btn-delete-holding').first().click()\nตัวอย่าง: await page.getByTestId('btn-delete-holding').first().click();");
      }

      const hasDialogCheck = /await\s+expect\(page\.getByTestId\(['"]confirm-dialog-confirm['"]\)\)\.toBeVisible\(\)/.test(clean);
      if (hasDialogCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบว่า Dialog ยืนยันปรากฏจริงก่อนถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบว่า Dialog ยืนยันปรากฏอยู่จริง\nตัวอย่าง: await expect(page.getByTestId('confirm-dialog-confirm')).toBeVisible();");
      }

      const hasConfirmClick = /await\s+page\.getByTestId\(['"]confirm-dialog-confirm['"]\)\.click\(\)/.test(clean);
      if (hasConfirmClick) {
        log("✓ ขั้นตอนที่ 3: คลิกยืนยันลบจริงถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งคลิกยืนยันลบ\nตัวอย่าง: await page.getByTestId('confirm-dialog-confirm').click();");
      }
    },
    hint: "ขั้นตอนที่ 1 และ 3 ใช้เมธอดค้นหาด้วย Test ID ตามด้วยแอคชันคลิก (ขั้นตอนที่ 1 ต้องเลือกอิลิเมนต์แถวแรกจากหลายแถวด้วยเมธอดที่ระบุลำดับ) ขั้นตอนที่ 2 ใช้ Web-first assertion ตระกูลตรวจสอบการมองเห็นก่อนคลิกยืนยันจริง",
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
      const clean = stripComments(code);
      const hasFill = /await\s+page\.getByTestId\(['"]ai-overview-chat-input['"]\)\.fill\(/.test(clean);
      const hasSendClick = /await\s+page\.getByTestId\(['"]ai-overview-chat-send['"]\)\.click\(\)/.test(clean);
      if (hasFill && hasSendClick) {
        log("✓ ขั้นตอนที่ 1: กรอกคำถามแล้วกดส่งถูกต้อง");
      } else {
        throw new Error("ไม่พบการกรอกคำถามลงในช่อง ai-overview-chat-input แล้วคลิก ai-overview-chat-send\nตัวอย่าง: await page.getByTestId('ai-overview-chat-input').fill('...');\nawait page.getByTestId('ai-overview-chat-send').click();");
      }

      const hasFixedWait = /waitForTimeout/.test(clean);
      const hasEnabledWait = /await\s+expect\(page\.getByTestId\(['"]ai-overview-chat-send['"]\)\)\.toBeEnabled\(\)/.test(clean);
      if (hasFixedWait) {
        throw new Error("ห้ามใช้การหน่วงเวลาคงที่แทนการรอผลลัพธ์จริง — เวลาที่ AI ใช้ตอบไม่คงที่ เดาไม่ได้");
      } else if (hasEnabledWait) {
        log("✓ ขั้นตอนที่ 2: รอปุ่มส่งกลับมาพร้อมใช้งาน (toBeEnabled) แทนการเดาเวลาถูกต้อง");
      } else {
        throw new Error("ไม่พบการรอด้วย auto-retry assertion\nตัวอย่าง: await expect(page.getByTestId('ai-overview-chat-send')).toBeEnabled();");
      }
    },
    hint: "กรอกข้อมูลด้วยเมธอด fill ตามด้วยคลิกปุ่มส่ง แล้วรอด้วย Web-first assertion ตระกูลตรวจสอบว่าอิลิเมนต์กลับมาอยู่ในสถานะพร้อมโต้ตอบ (ไม่ disabled) แทนการหน่วงเวลาคงที่เด็ดขาด",
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
      const clean = stripComments(code);
      const hasSetInputFiles = /await\s+page\.getByTestId\(['"]import-csv-input['"]\)\.setInputFiles\(['"]\.\/fixtures\/holdings-sample\.csv['"]\)/.test(clean);
      if (hasSetInputFiles) {
        log("✓ ขั้นตอนที่ 1: อัปโหลดไฟล์ด้วย setInputFiles ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv')\nตัวอย่าง: await page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv');");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]Imported['"]\)/.test(clean);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความผลลัพธ์การนำเข้าถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความผลลัพธ์\nตัวอย่าง: await expect(page.getByTestId('import-result-message')).toContainText('Imported');");
      }
    },
    hint: "ใช้เมธอดของ Locator ที่แนบไฟล์เข้ากับ input type=file โดยตรง (ข้าม Native File Picker ของ OS) รับ path string ของไฟล์เป็นอาร์กิวเมนต์ แล้วตรวจสอบข้อความผลลัพธ์ด้วย assertion ตระกูลตรวจสอบว่ามีข้อความปรากฏอยู่บางส่วน",
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
      const clean = stripComments(code);
      const hasSetInputFiles = /await\s+page\.getByTestId\(['"]import-csv-input['"]\)\.setInputFiles\(['"]\.\/fixtures\/malware\.exe['"]\)/.test(clean);
      if (hasSetInputFiles) {
        log("✓ ขั้นตอนที่ 1: อัปโหลดไฟล์ malware.exe ด้วย setInputFiles ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่ง page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe')\nตัวอย่าง: await page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe');");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]Only CSV files are allowed['"]\)/.test(clean);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error\nตัวอย่าง: await expect(page.getByTestId('import-result-message')).toContainText('Only CSV files are allowed');");
      }
    },
    hint: "เทคนิคเดียวกับบทก่อนหน้า (setInputFiles รับ path string ของไฟล์) แต่เปลี่ยนไฟล์เป็นนามสกุลที่ไม่ใช่ CSV แล้วตรวจสอบข้อความ error ที่ระบบควรแสดงด้วย assertion ตระกูลเดิม",
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
      const clean = stripComments(code);
      const hasSetInputFiles = /await\s+page\.getByTestId\(['"]import-csv-input['"]\)\.setInputFiles\(\{[\s\S]*?buffer:\s*Buffer\.alloc\(\s*6\s*\*\s*1024\s*\*\s*1024\s*\)[\s\S]*?\}\)/.test(clean);
      if (hasSetInputFiles) {
        log("✓ ขั้นตอนที่ 1: อัปโหลดไฟล์จำลองขนาด 6MB ด้วย setInputFiles แบบ object ถูกต้อง");
      } else {
        throw new Error("ไม่พบการอัปโหลดไฟล์จำลองขนาด 6MB\nตัวอย่าง: await page.getByTestId('import-csv-input').setInputFiles({ name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024) });");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]File size exceeds 5MB limit['"]\)/.test(clean);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error\nตัวอย่าง: await expect(page.getByTestId('import-result-message')).toContainText('File size exceeds 5MB limit');");
      }
    },
    hint: "setInputFiles รองรับการส่ง object แทน path string ได้ (มี name, mimeType, buffer) ใช้เมธอดมาตรฐานของ Buffer สำหรับจองพื้นที่หน่วยความจำขนาดที่ต้องการโดยไม่ต้องมีไฟล์จริง แล้วตรวจสอบข้อความ error ด้วย assertion ตระกูลเดิม",
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
  },
  {
    id: "race_condition_debug",
    meta: "ขั้นสูง 1",
    title: "Debug Flaky Test: แก้ Race Condition ด้วย Auto-waiting",
    template: `import { test, expect } from '@playwright/test';

test('TC-ADV1: กดปุ่มรีเฟรชราคาแล้วราคาล่าสุดต้องอัปเดตถูกต้อง', async ({ page }) => {
  await page.goto('/holdings');

  await page.getByTestId('btn-refresh-price').click();

  // บั๊ก Race Condition: โค้ดด้านล่างอ่านค่าจากหน้าจอทันทีหลังคลิก
  // ก่อนที่ state ของ React จะอัปเดตและ re-render เสร็จจริง ทำให้ test นี้ flaky (บางทีผ่านบางทีไม่ผ่าน)
  // แก้ไขให้ใช้กลไก Auto-waiting ของ Playwright แทน ห้ามใช้ page.waitForTimeout() เด็ดขาด
  const priceText = await page.getByTestId('current-price').innerText();
  expect(priceText).toBe('$150.25');
});`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแก้ไข Race Condition...");
      const clean = stripComments(code);

      if (/waitForTimeout/.test(clean)) {
        throw new Error("ห้ามแก้ Race Condition ด้วยการหน่วงเวลาคงที่ (page.waitForTimeout) เด็ดขาด เพราะเดาเวลาที่ state จะอัปเดตเสร็จไม่ได้จริง ให้ใช้ Web-first assertion ที่ auto-retry ของ Playwright แทน");
      }

      if (/\.innerText\(\)/.test(clean)) {
        throw new Error("ยังพบการอ่านค่าด้วย .innerText() มาเปรียบเทียบแบบ manual อยู่ ซึ่งเป็นต้นเหตุของ Race Condition ให้ลบทิ้งแล้วเปลี่ยนไปใช้ Web-first assertion ของ expect(locator) แทนทั้งหมด");
      }

      const hasFix = /await\s+expect\(page\.getByTestId\(['"]current-price['"]\)\)\.toHaveText\(['"]\$150\.25['"]\)/.test(clean);
      if (hasFix) {
        log("✓ แก้ไข Race Condition ด้วย Web-first assertion (toHaveText) สำเร็จ ระบบจะ auto-retry รอจนกว่าข้อความจะอัปเดตหรือ timeout เอง");
      } else {
        throw new Error("ไม่พบการตรวจสอบด้วย Web-first assertion ที่ถูกต้อง\nตัวอย่าง: await expect(page.getByTestId('current-price')).toHaveText('$150.25');");
      }
    },
    hint: "ปัญหาคือมีการอ่านค่าจาก DOM ด้วยเมธอด synchronous ทันทีหลังคลิก ก่อนที่ state ของแอปจะอัปเดตเสร็จจริง (Race Condition) ให้ลบขั้นตอนอ่านค่า+เปรียบเทียบแบบ manual ทิ้งทั้งหมด แล้วเปลี่ยนไปใช้ Web-first assertion ของ expect ที่รับ Locator ตรง ๆ และรอเช็คข้อความเอง ห้ามแก้ด้วยการหน่วงเวลาคงที่ (waitForTimeout) เด็ดขาด",
    solution: `import { test, expect } from '@playwright/test';

test('TC-ADV1: กดปุ่มรีเฟรชราคาแล้วราคาล่าสุดต้องอัปเดตถูกต้อง', async ({ page }) => {
  await page.goto('/holdings');

  await page.getByTestId('btn-refresh-price').click();

  // แก้บั๊ก Race Condition ด้วย Web-first assertion ที่ auto-retry รอจนกว่าข้อความจะตรงหรือ timeout เอง
  await expect(page.getByTestId('current-price')).toHaveText('$150.25');
});`,
    theory: `<strong>Race Condition</strong> เป็นสาเหตุของ flaky test ที่พบบ่อยกว่าที่คิด: โค้ดคลิกปุ่มแล้ว "อ่านค่า" ออกมาทันทีด้วยเมธอด synchronous อย่าง <code>innerText()</code>/<code>textContent()</code> แล้วนำค่านั้นไปเทียบด้วย <code>expect(value).toBe(...)</code> ธรรมดา — ปัญหาคือ ณ จังหวะที่อ่านค่า React อาจยังไม่ re-render เสร็จเลย ค่าที่ได้จึงเป็นค่าเก่าบ้าง ค่าใหม่บ้าง แล้วแต่จังหวะเครื่องรันเร็วช้าแค่ไหนในแต่ละรอบ<br/><br/>
    บทที่ 12 (Flaky-Test Retry Strategy) สอนเรื่อง <code>retries</code> ไว้เป็น "ทางสำรอง" สำหรับ timing ที่ควบคุมไม่ได้จริง ๆ แต่บทนี้สอน "ทางแก้ที่ต้นเหตุ": อย่าอ่านค่าออกมาเช็คเองเลย ให้ส่ง Locator ตรงเข้า <code>expect()</code> แล้วใช้ Web-first assertion ตระกูล <code>toHaveText()</code> แทน — ตัวมันจะ poll ตรวจ DOM ซ้ำเองจนกว่าข้อความจะตรงตามที่คาดหรือ timeout ของ test เอง ไม่ต้องพึ่ง retry ทั้งเทสหรือเดาเวลาหน่วงเลยแม้แต่น้อย`,
    example: `// ตัวอย่างอื่น: แก้ Race Condition ของ badge สถานะซิงก์ข้อมูลหลังกดปุ่ม Sync
// ผิด: อ่านค่าทันทีหลังคลิกแล้วเทียบแบบ manual (แข่งกับ state ที่ยังอัปเดตไม่เสร็จ)
await page.getByTestId('btn-sync').click();
const status = await page.getByTestId('sync-status-badge').innerText();
expect(status).toBe('Synced');

// ถูก: ส่ง Locator เข้า expect() ให้มันรอเช็คเองจนกว่าจะตรงหรือ timeout
await page.getByTestId('btn-sync').click();
await expect(page.getByTestId('sync-status-badge')).toHaveText('Synced');`,
    task: `หน้า Holdings มีปุ่มรีเฟรชราคา (Test ID <code>btn-refresh-price</code>) ที่กดแล้วราคาล่าสุด (Test ID <code>current-price</code>) จะอัปเดตแบบ async — สคริปต์ปัจจุบันมีบั๊ก Race Condition ที่ทำให้ test ไม่เสถียร จงแก้ไขโดย:<br/>
    1. ลบขั้นตอนอ่านค่าด้วย <code>innerText()</code> แล้วเปรียบเทียบแบบ manual ทิ้งทั้งหมด<br/>
    2. แทนที่ด้วย Web-first assertion ที่ส่ง Locator ของ <code>current-price</code> เข้า <code>expect()</code> ตรง ๆ แล้วตรวจสอบว่าข้อความเท่ากับ <code>'$150.25'</code> เป๊ะ (ห้ามใช้ <code>page.waitForTimeout()</code> เด็ดขาด)`
  },
  {
    id: "pom_holdings_page",
    meta: "ขั้นสูง 2",
    title: "สร้าง Page Object Model: HoldingsPage Class จากสเปก",
    template: `import { Page, Locator } from '@playwright/test';

export class HoldingsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly tableContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.tableContainer = page.getByTestId('table-container');
  }

  // 1. เขียนเมธอดกรอกคำค้นหา ticker ลงในช่องค้นหาของหน้า Holdings
  async searchTicker(ticker: string) {
    // WRITE YOUR CODE HERE


  }

  // 2. เขียนเมธอดอ่านข้อความทั้งหมดที่แสดงอยู่ในตาราง แล้วคืนค่ากลับออกไปเป็น string
  async getVisibleTableText(): Promise<string> {
    // WRITE YOUR CODE HERE


  }
}`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบโครงสร้าง Page Object Model HoldingsPage...");
      const clean = stripComments(code);

      const hasSearch = /async\s+searchTicker\s*\([^)]*\)\s*\{[^}]*this\.searchInput\.fill\(\s*ticker\s*\)[^}]*\}/s.test(clean);
      if (hasSearch) {
        log("✓ เมธอด searchTicker กรอกคำค้นหาผ่าน Locator ที่ประกาศไว้ในคลาสถูกต้อง");
      } else {
        throw new Error("เมธอด searchTicker ต้องเรียกใช้ this.searchInput (Locator ที่ประกาศไว้แล้วในคลาส) ด้วยแอคชันกรอกข้อความ โดยส่งพารามิเตอร์ ticker เข้าไป\nตัวอย่าง: await this.searchInput.fill(ticker);");
      }

      const hasReadTable = /async\s+getVisibleTableText[^{]*\{[^}]*return\s+await\s+this\.tableContainer\.textContent\(\)/s.test(clean);
      if (hasReadTable) {
        log("✓ เมธอด getVisibleTableText คืนค่าข้อความจาก Locator ตารางถูกต้อง");
      } else {
        throw new Error("เมธอด getVisibleTableText ต้องคืนค่าข้อความทั้งหมดจาก this.tableContainer ด้วยเมธอดที่ดึงข้อความล้วนออกมาเป็น string\nตัวอย่าง: return await this.tableContainer.textContent();");
      }
    },
    hint: "searchTicker ควรใช้ Locator ของช่องค้นหาที่ประกาศไว้แล้วในคลาส (this.searchInput) ตามด้วยแอคชันกรอกข้อความมาตรฐานที่เจอมาตั้งแต่บทนำ โดยส่งพารามิเตอร์ ticker เข้าไปแทนค่าตายตัว ส่วน getVisibleTableText ให้ใช้เมธอดของ Locator ที่คืนค่าข้อความทั้งหมดภายใน element ออกมาเป็น string ล้วน (ไม่ใช่ innerHTML หรือค่า attribute)",
    solution: `import { Page, Locator } from '@playwright/test';

export class HoldingsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly tableContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.tableContainer = page.getByTestId('table-container');
  }

  // 1. เขียนเมธอดกรอกคำค้นหา ticker ลงในช่องค้นหาของหน้า Holdings
  async searchTicker(ticker: string) {
    await this.searchInput.fill(ticker);
  }

  // 2. เขียนเมธอดอ่านข้อความทั้งหมดที่แสดงอยู่ในตาราง แล้วคืนค่ากลับออกไปเป็น string
  async getVisibleTableText(): Promise<string> {
    return await this.tableContainer.textContent() ?? '';
  }
}`,
    theory: `<strong>Page Object Model (POM)</strong> ที่ดีไม่ใช่แค่เก็บ Locator ไว้เฉย ๆ แต่ห่อหุ้ม (encapsulate) พฤติกรรมของหน้านั้นไว้เป็นเมธอดระดับสูงที่อ่านง่าย เพื่อให้ไฟล์เทสจริงเรียกใช้ได้โดยไม่ต้องรู้รายละเอียด Locator ภายใน เช่น เทสไฟล์เรียก <code>await holdingsPage.searchTicker('AAPL')</code> แทนที่จะเขียน <code>page.getByTestId('search-input').fill('AAPL')</code> ซ้ำทุกไฟล์<br/><br/>
    ข้อดีสำคัญ: ถ้าวันหนึ่ง Dev เปลี่ยนวิธีค้นหา Locator ของช่องค้นหา (เช่น เปลี่ยน Test ID) จะต้องแก้แค่จุดเดียวในคลาส <code>HoldingsPage</code> ไม่ต้องไล่แก้ทุกไฟล์เทสที่เรียกใช้ — นี่คือหลักการ <strong>DRY (Don't Repeat Yourself)</strong> ที่ทำให้ test suite ขนาดใหญ่ดูแลรักษาง่ายในระยะยาว<br/><br/>
    เมธอดในคลาสควรรับพารามิเตอร์ที่จำเป็น (เช่น <code>ticker</code>) แทนการ hardcode ค่าตายตัว เพื่อให้นำเมธอดเดิมไปใช้ซ้ำได้กับทุกกรณีทดสอบ ไม่ใช่แค่เคสเดียว`,
    example: `// ตัวอย่างการใช้งานคลาส Page Object ในไฟล์เทสจริง (ไม่ต้องรู้ Locator ภายใน)
const holdingsPage = new HoldingsPage(page);
await page.goto('/holdings');
await holdingsPage.searchTicker('MSFT');
const tableText = await holdingsPage.getVisibleTableText();
expect(tableText).toContain('MSFT');`,
    task: `จงเติมเมธอดของคลาส <code>HoldingsPage</code> ให้สมบูรณ์ตามสเปก:<br/>
    1. เมธอด <code>searchTicker(ticker)</code> ต้องกรอกค่าพารามิเตอร์ <code>ticker</code> ลงในช่องค้นหาผ่าน Locator <code>this.searchInput</code> ที่ประกาศไว้แล้วในคลาส<br/>
    2. เมธอด <code>getVisibleTableText()</code> ต้องคืนค่าข้อความทั้งหมดที่แสดงอยู่ภายในตาราง (<code>this.tableContainer</code>) ออกไปเป็น string`
  }
];

// Application state

const PREFIX = 'pw';
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
        <div class="terminal-line error">ข้อผิดพลาด: ${escapeHtml(err.message).replace(/\n/g, '<br/>')}</div>
        <div class="terminal-line error">1 failed (48ms)</div>
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Playwright Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค Page Object, API Mocking, React components testing และกลยุทธ์การตรวจจับบั๊กขั้นสูงไปใช้งานจริงในโปรเจค My-Investment-Port!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
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
  window.QA_TRACKS['playwright'] = { id: 'playwright', title: 'Playwright UI Testing', folder: 'Playwright', lessons: LESSONS };
})();
