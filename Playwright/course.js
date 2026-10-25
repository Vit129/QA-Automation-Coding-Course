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
  const clean = noLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
  if (/\.(GET|POST|PUT|DELETE|PATCH)\s*\(/.test(clean)) {
    const match = clean.match(/\.(GET|POST|PUT|DELETE|PATCH)\s*\(/)[1];
    throw new Error(`⚠️ ข้อผิดพลาด: Playwright และ JavaScript เป็น Case-sensitive กรุณาใช้ตัวพิมพ์เล็ก .${match.toLowerCase()}() เท่านั้น (ห้ามใช้ตัวพิมพ์ใหญ่ .${match})`);
  }
  return clean;
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
        throw new Error("ยังไม่พบขั้นตอนการเปิดไปยังหน้า /holdings ที่ระบุไว้ในโจทย์ กรุณาตรวจสอบว่าใช้เมธอด navigate ของ page ไปยังพิกัดดังกล่าวแล้วหรือยัง");
      }

      const hasFill = /await\s+page\.getByTestId\(['"]search-input['"]\)\.fill\(['"]AAPL['"]\)/.test(clean);
      if (hasFill) {
        log("✓ ขั้นตอนที่ 2: ใช้ getByTestId('search-input').fill('AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งกรอกข้อมูล AAPL ลงในช่องค้นหา หรือไม่ได้ค้นหาด้วย Test ID 'search-input' ให้ทบทวนวิธีค้นหาอิลิเมนต์ด้วย Test ID แล้วตามด้วยแอคชันกรอกข้อความแทนที่ค่าทั้งหมดในช่อง (ดูตัวอย่างใน theory ด้านบน)");
      }

      const hasExpect = /await\s+expect\(page\.getByTestId\(['"]table-container['"]\)\)\.toContainText\(['"]AAPL['"]\)/.test(clean);
      if (hasExpect) {
        log("✓ ขั้นตอนที่ 3: ใช้ expect(table-container).toContainText('AAPL') ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งทำ Assertion เพื่อเช็คว่าตารางประกอบด้วยข้อความ AAPL ให้ใช้ Web-first assertion ตระกูลตรวจสอบว่ามีข้อความปรากฏอยู่บางส่วนภายใน element ตามที่อธิบายไว้ในทฤษฎี");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> ทำความรู้จัก Playwright เฟรมเวิร์กการทำเว็บออโตเมชันยุคใหม่ (Code-first) ที่ออกแบบโดย Microsoft เพื่อทดสอบเว็บได้รวดเร็วและเสถียร<br/><br/>
    ⚖️ <strong>3 สถาปัตยกรรมสำคัญที่ทำให้ Playwright เหนือกว่ายุคก่อน:</strong><br/>
    • <strong>Auto-waiting:</strong> ตรวจสอบความพร้อมของอิลิเมนต์ (Visible, Enabled, Stable) เบื้องหลังโดยอัตโนมัติก่อนคลิกหรือพิมพ์ หมดปัญหา Flaky Test จากเน็ตเวิร์กช้า<br/>
    • <strong>Browser Context Isolation:</strong> แยกพื้นที่ Session และ Cookie ออกจากกันโดยเด็ดขาดเหมือนเปิดโหมด Incognito ใหม่ทุกครั้ง<br/>
    • <strong>Web-first Assertions:</strong> ตรวจสอบค่าซ้ำๆ แบบ Asynchronous จนกว่าจะผ่าน แทนการสั่ง Sleep แบบคงที่<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.getByTestId('search-input').fill('AAPL');</code><br/>
    <code>await expect(page.getByTestId('table-container')).toContainText('AAPL');</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> อย่าใช้ <code>page.waitForTimeout(5000)</code> เพื่อรอ ให้ใช้ Web-first Assertions ของ Playwright ซึ่งมีระบบ Auto-retry ในตัว`,
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
        throw new Error("คุณจำเป็นต้องรันสคริปต์ให้ไปทำงานในบริบทฝั่งเบราว์เซอร์ผ่านเมธอดของ Page ที่ออกแบบมาสำหรับข้ามไปประมวลผล JavaScript ในหน้าเว็บโดยตรง");
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
        throw new Error("รูปแบบการดึงค่าคืนยังไม่ถูกต้อง ตรวจสอบว่าได้ return ผลลัพธ์จากฟังก์ชันที่รันในฝั่งเบราว์เซอร์ ซึ่งภายในต้องเรียกใช้เมธอดมาตรฐานของ Web Storage API เพื่อดึงค่าตามคีย์เป้าหมายที่กำหนดไว้ในโจทย์");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Core Types สำคัญใน Playwright (<code>Page</code>, <code>Locator</code>) และวิธีรัน JavaScript ในเบราว์เซอร์ด้วย <code>page.evaluate()</code><br/><br/>
    ⚖️ <strong>เปรียบเทียบ Core Concepts:</strong><br/>
    • <strong>Page:</strong> หน้าแท็บเบราว์เซอร์เดี่ยวสำหรับส่งแอคชันหลัก<br/>
    • <strong>Locator:</strong> ตัวอ้างอิงตำแหน่ง DOM ที่ทำงานแบบ <strong>Lazy Evaluation</strong> (ค้นหาอิลิเมนต์จริงเฉพาะตอนสั่งคลิก/พิมพ์)<br/>
    • <strong>page.evaluate():</strong> สะพานเชื่อมสำหรับข้ามไปรัน JS ในฝั่งเบราว์เซอร์ เพื่อเข้าถึง <code>window</code>, <code>document</code> หรือ <code>localStorage</code><br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>const data = await page.evaluate(() => localStorage.getItem('portfolio_holdings'));</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> โค้ดใน <code>page.evaluate()</code> จะถูกส่งไปรันฝั่ง Browser ไม่สามารถเข้าถึงตัวแปรฝั่ง Node.js ได้โดยตรง เว้นแต่จะส่งผ่านพารามิเตอร์`,
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
        throw new Error("คุณลืมเรียกใช้ constructor ของคลาสแม่เป็นบรรทัดแรกภายใน constructor หรือไม่? (ทบทวนหลักการ Class Inheritance ใน theory)");
      }

      const hasMetric = /this\.metricsSection\s*=\s*page\.getByTestId\(['"]tax-metrics-section['"]\)/.test(clean) ||
                        /this\.metricsSection\s*=\s*this\.page\.getByTestId\(['"]tax-metrics-section['"]\)/.test(clean);
      if (hasMetric) {
        log("✓ ขั้นตอนที่ 2: ลงทะเบียนตัวแปร metricsSection สำเร็จ");
      } else {
        throw new Error("ไม่พบการลงทะเบียนตัวแปร metricsSection ด้วยการค้นหาผ่าน Test ID 'tax-metrics-section' ให้ตรวจสอบว่าใช้วิธีค้นหาด้วย Test ID แบบเดียวกับที่ formPanel ใช้ในบทอื่นหรือยัง");
      }

      const hasNav = /await\s+this\.navigateTo\(['"]\/tax['"]\)/.test(clean);
      if (hasNav) {
        log("✓ ขั้นตอนที่ 3: เมธอด navigate เรียกใช้งานพิกัด /tax สำเร็จ");
      } else {
        throw new Error("ไม่พบคำสั่งเปลี่ยนหน้าไปพิกัด '/tax' ให้ตรวจสอบว่าเรียกผ่านเมธอดของ BasePage ที่มีไว้สำหรับเปลี่ยนเส้นทางหน้าโดยเฉพาะหรือยัง");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> จัดโครงสร้างโค้ดด้วย <strong>Page Object Model (POM)</strong> ผ่านคลาสเชิงวัตถุเพื่อลดความซ้ำซ้อนและบำรุงรักษาง่าย<br/><br/>
    ⚖️ <strong>หลักการสร้าง Page Object ชั้นครู:</strong><br/>
    1. <strong>BasePage:</strong> คลาสกลางเก็บความสามารถร่วม เช่น การสลับหน้า หรือการรอ Network<br/>
    2. <strong>Class Inheritance:</strong> คลาสลูกต้องใช้ <code>super(page)</code> ใน constructor เพื่อส่งต่อ <code>page</code> instance<br/>
    3. <strong>Readonly Locators:</strong> ประกาศ Locators เป็น <code>readonly Locator</code> ป้องกันการถูกเขียนทับระหว่างรัน<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>export class TaxPage extends BasePage {</code><br/>
    <code>  readonly metricsSection: Locator;</code><br/>
    <code>  constructor(page: Page) { super(page); this.metricsSection = page.getByTestId('tax-metrics-section'); }</code><br/>
    <code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> คลาสลูกที่ extends คลาสอื่น ต้องเรียก <code>super(page)</code> เป็นบรรทัดแรกใน constructor เสมอ`,
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
        throw new Error("โปรเจคนี้ต้องการให้เพิ่มข้อมูลเริ่มต้นก่อนหน้าเว็บเรนเดอร์ ให้ตรวจสอบว่าใช้เมธอดของ Page ที่แทรกสคริปต์ให้รันตั้งแต่ก่อนหน้าเว็บถูกสร้างขึ้นหรือยัง");
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
        throw new Error("รูปแบบสคริปต์การแทรกข้อมูลเริ่มต้นยังไม่ถูกต้อง ตรวจสอบว่าภายใน callback ได้เรียกใช้เมธอดมาตรฐานของ Web Storage สำหรับบันทึกค่า โดยแปลง object ให้เป็นสตริงก่อนด้วยเมธอดมาตรฐานของ JSON และส่ง baseline เป็นพารามิเตอร์ที่สองของฟังก์ชันแทรกสคริปต์");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Fixtures & Test Data Management และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>กลไกการป้อนข้อมูลจำลองเริ่มต้น (Data Seeding) เพื่อล้างสถานะและพร้อมทดสอบอย่างสม่ำเสมอ ใน Playwright การใช้คำสั่ง <code>page.addInitScript()</code> เป็นหนทางที่เสถียรที่สุดในการเตรียมสภาพแวดล้อม เพราะมันจะแทรกการทำงานของ JavaScript เข้าไปประมวลผลภายใน DOM ทันทีตั้งแต่ช่วงเริ่มสถาปนาหน้าเอกสาร (Document Creation) ก่อนที่โค้ดประมวลผลเว็บหลักหรือเฟรมเวิร์กอย่าง React/Next.js จะรันขึ้นมาเช็คค่า ทำให้ค่า LocalStorage มีข้อมูลพร้อมใช้ทันเวลาหน้าจอโชว์ตัว<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.addInitScript((data) => {</code><br/>
    <code>&nbsp;&nbsp;window.localStorage.setItem('portfolio_holdings', JSON.stringify(data));</code><br/>
    <code>}, baseline);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ฟังก์ชันที่ส่งเข้า <code>addInitScript()</code> รันในบริบทเบราว์เซอร์แยกจาก Node.js — ห้ามอ้างอิงตัวแปรภายนอกผ่าน Closure โดยตรง (เช่น <code>baseline</code>) ต้องส่งผ่านพารามิเตอร์ตัวที่สองของ <code>addInitScript()</code> เท่านั้น ไม่งั้นจะได้ <code>ReferenceError</code>`,
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
        throw new Error("การอ้างอิงปุ่มบันทึกไม่ถูกต้อง หรือไม่ได้จำกัดขอบเขต (Scoped) ลงใน formPanel ให้ตรวจสอบว่าเรียกเมธอดค้นหาด้วย Test ID ต่อจากตัวแปร formPanel แทนที่จะเรียกจาก page ตรง ๆ");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Locator Strategy & Priority และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การตีกรอบ Locator ย่อยภายใต้เป้าหมายเดิม (Scoped Locator) ช่วยแก้ไขปัญหากล่องฟังก์ชันชนกัน เช่น บนหน้าเว็บมีโมดอลขึ้นมาทับ และมีปุ่มเซฟทั้งในแบบฟอร์มเบื้องหลังและในปุ่มโมดอลด้านบน หากดึงตรง ๆ จะเกิดข้อบกพร่องจับอิลิเมนต์หลายชิ้นพร้อมกัน (Strict Mode violation) การดึงจาก <code>this.formPanel.getByTestId('child')</code> จะจำกัดวงคิวรี DOM ลงใต้โฟลเดอร์ Parent เท่านั้น ทำให้รวดเร็วและปลอดภัยยิ่งกว่าการสืบหาผ่าน XPath ยาวเหยียด<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>this.formPanel = page.getByTestId('holdings-form-panel');</code><br/>
    <code>this.formSaveBtn = this.formPanel.getByTestId('form-save-btn');</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าเรียก <code>page.getByTestId('form-save-btn')</code> ตรง ๆ โดยไม่ scope ผ่าน <code>formPanel</code> ก่อน แล้วหน้าเว็บมีอิลิเมนต์ id ซ้ำ (เช่น ปุ่มเดียวกันในฟอร์มกับใน Modal) จะเจอ Strict Mode violation เพราะ Playwright เจอ element ตรงเป้ามากกว่า 1 ตัว`,
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
        throw new Error("ไม่พบคำสั่งตรวจเช็คว่าฟอร์มซ่อนตัว ให้ใช้ Web-first assertion ตระกูลตรวจสอบการมองเห็น พร้อม negate ผลลัพธ์ด้วยคีย์เวิร์ดที่ใช้กลับด้านเงื่อนไข");
      }

      const hasURL = /await\s+expect\(page\)\.toHaveURL\(\/\\\/holdings\/\)/.test(clean) ||
                     /await\s+expect\(page\)\.toHaveURL\(.*holdings.*\)/.test(clean);
      if (hasURL) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบเส้นทาง URL ของระบบจัดพอร์ตสำเร็จ");
      } else {
        throw new Error("ไม่พบการเช็ค URL ของหน้าปัจจุบัน ให้ใช้ assertion ตระกูลตรวจสอบ URL โดยรับ RegExp ที่ตรงกับพิกัด /holdings เป็นอาร์กิวเมนต์");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Assertions & Waits (Auto-retry) และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>หลีกเลี่ยงการใช้คำสั่ง <code>page.waitForTimeout()</code> เพราะเป็นสาเหตุทำสคริปต์เทสสะดุดโดยไร้เหตุผลเนื่องจากไม่สัมพันธ์กับประสิทธิภาพเครื่องรันเบื้องหลัง การยืนยันผลควรใช้งานคำสั่งกลุ่ม <strong>Web-first assertions</strong> ซึ่งเมื่อนำหน้าร่วมกับคีย์เวิร์ด <code>expect</code> ระบบจะคอยยิงสุ่มเช็คสถานะอิลิเมนต์ถี่ ๆ บนหน้าเว็บจนกว่าจะตรงเป้าหมาย ช่วยให้ความเร็วขึ้นสูงสุดและเสถียรที่สุด<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await expect(formPanel).not.toBeVisible();</code><br/>
    <code>await expect(page).toHaveURL(/\/holdings/);</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> อย่าใช้ <code>await formPanel.isVisible()</code> แล้วเอา boolean ไปเทียบเอง — เมธอดนี้เช็คสถานะทันที ณ ขณะนั้นครั้งเดียว ไม่ auto-retry เหมือน <code>expect().toBeVisible()</code> ถ้าฟอร์มยังไม่ทันซ่อนจะ fail ทันทีโดยไม่รอ`,
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
        throw new Error("ไม่ได้เรียกใช้เมธอดของ Page สำหรับดักจับคำร้องขอเน็ตเวิร์กเพื่อสกัดกั้นสัญญาณเน็ตเวิร์กที่ยิงไปยังปลายทางเป้าหมาย");
      }

      const checkGlob = /page\.route\(\s*['"][^'"]*script\.google\.com[^'"]*['"]/.test(clean);
      if (checkGlob) {
        log("✓ ขั้นตอนที่ 1: ตรวจพบการตั้ง Glob Pattern ดักเซิร์ฟเวอร์ยิง Google Sheets");
      } else {
        throw new Error("ตั้งค่าพิกัด URL ดักจับไม่ถูกต้องสำหรับ script.google.com ให้ตรวจสอบว่าใช้ glob pattern ที่ครอบคลุมโดเมนดังกล่าวถูกต้องหรือไม่");
      }

      const checkFulfill = /route\.fulfill\(.*?status:\s*200.*?body:\s*JSON\.stringify\(.*?ok:\s*true.*?\).*?\)/s.test(clean) ||
                            /route\.fulfill\(.*?body:\s*JSON\.stringify\(.*?ok:\s*true.*?\).*?status:\s*200.*?\)/s.test(clean);
      if (checkFulfill) {
        log("✓ ขั้นตอนที่ 2: ส่งข้อมูลตอบกลับจำลองจำลองสำเร็จ (route.fulfill)");
      } else {
        throw new Error("สคริปต์ตอบข้อมูล fulfill ผิดพลาด ให้ตรวจสอบว่าภายใน callback เรียกเมธอดของออบเจกต์ route ที่ใช้ส่งข้อมูลตอบกลับปลอม พร้อมกำหนด status code เป็น 200 และแปลง body เป็น JSON string ที่มีค่า ok เป็น true");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ API Intercept & Mocking และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>เพื่อป้องกันไม่ให้การรันเทสส่งผลกระทบเขียนทับข้อมูลจริงฝั่งโปรดักชัน หรือแก้ปัญหาระบบเซิร์ฟเวอร์ภายนอกที่กำลังเรียกใช้งานล่มบ่อย Playwright เตรียมฟังก์ชัน <code>page.route()</code> ในการสืบดักจับเน็ตเวิร์กสัญญาณบราวเซอร์ และประมวลผลส่งคำตอบปลอมออกไปแทนด้วย <code>route.fulfill()</code> ทำให้รวดเร็วและสามารถระบุข้อมูลสมมติที่ต้องการจำลองเทสได้อย่างอิสระ<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.route('**/script.google.com/**', route => {</code><br/>
    <code>&nbsp;&nbsp;route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });</code><br/>
    <code>});</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ต้องเรียก <code>page.route()</code> ลงทะเบียนดักจับ "ก่อน" action ที่ทำให้เกิด request (เช่น <code>page.goto()</code> หรือคลิกปุ่ม) เสมอ ถ้าลงทะเบียนหลัง request ยิงออกไปแล้วจะดักไม่ทัน`,
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
        throw new Error("คุณจำเป็นต้องเรียกใช้งานเมธอด configure ที่แนบอยู่กับกลุ่มเทส describe");
      }

      const checkMode = /test\.describe\.configure\(\{\s*mode:\s*['"]serial['"]\s*\}\)/.test(clean);
      if (checkMode) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ตั้งค่าเทสให้รันต่อเนื่องกัน CRUD Flow สำเร็จ");
      } else {
        throw new Error("ตั้งค่าโหมดการรันไม่ถูกต้อง ให้ตรวจสอบว่าส่ง option object ที่มีคีย์ mode และค่าที่หมายถึง 'เรียงต่อกันเป็นลำดับ' (ตรงข้ามกับการรันแบบขนาน) เข้าไปในเมธอด configure หรือไม่");
      }
    },
    hint: "ใช้เมธอด configure ที่แนบอยู่กับ test.describe เพื่อกำหนดโหมดการรันของกลุ่มเทสทั้งหมด โดยส่ง option object ที่มีคีย์ mode และค่าที่หมายถึง 'เรียงต่อกันเป็นลำดับ' (คำภาษาอังกฤษที่ตรงข้ามกับการรันแบบขนาน)",
    solution: `import { test } from '@playwright/test';
 
test.describe('Holdings Suite', () => {
  // 1. กำหนดโหมดการทำงานของชุดการทดสอบนี้ให้ทำงานเรียงต่อกันเป็นลำดับ (Serial)
  test.describe.configure({ mode: 'serial' });
  
  test('TC-01: เพิ่มหุ้น', async ({ page }) => { /* ... */ });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Advanced Execution & Auth และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>โดยปกติ Playwright จะสุ่มทำงานแบบขนานเพื่อรันความเร็วสูงสุด แต่สำหรับสคริปต์การทดสอบที่เกี่ยวพันกับลำดับขั้นตอน (เช่นเคส เพิ่ม ลบ แก้ไข ข้อมูลพอร์ตหุ้นแบบ CRUD) การขนานจะขัดแย้งทำลายข้อมูลตัวแปรกันเอง เราสามารถล็อกลำดับความเรียงของกลุ่มเทสเคสย่อยให้ออกคิวต่อเรียงหน้ากระดานได้โดยการเซ็ตโหมด <code>test.describe.configure({ mode: 'serial' })</code> ซึ่งหากเคสย่อยตัวใดตัวหนึ่งพบปัญหาพัง ตัวเทสลำดับถัดไปในแถวจะข้ามยกเลิกทำงานอัตโนมัติเพื่อป้องกันข้อมูลขยะคั่งค้าง<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>test.describe.configure({ mode: 'serial' });</code><br/>
    <code>test('TC-01: เพิ่มหุ้น', async ({ page }) => { /* ... */ });</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ต้องเรียก <code>test.describe.configure()</code> เป็นบรรทัดแรกสุดในบล็อก <code>describe</code> ก่อนประกาศ <code>test()</code> ตัวแรกเสมอ ถ้าเรียกหลังจากนั้นจะไม่มีผลใด ๆ`,
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
        throw new Error("คุณต้องจับเหตุการณ์ (Event Listener) ที่ผูกไว้กับ page");
      }
      log("✓ ตรวจพบเหตุการณ์ดัก page.on");

      if (!/page\.on\(\s*['"]console['"]/.test(clean)) {
        throw new Error("ไม่ได้ผูกรับเหตุการณ์สืบจับของคลาส 'console' ให้ตรวจสอบว่าฟังอีเวนต์ชื่อ console เป็นอาร์กิวเมนต์แรกของการผูก Event Listener หรือยัง");
      }

      const checkType = /msg\.type\(\)\s*===\s*['"]error['"]/.test(clean);
      if (checkType) {
        log("✓ โค้ดคอมไพล์สำเร็จ: ตั้งสคริปต์สืบจับและสกรีนข้อผิดพลาดสีแดงหลังบ้านสำเร็จ");
      } else {
        throw new Error("รูปแบบสคริปต์การสืบจับคลาสคอนโซลคลาดเคลื่อน ให้ตรวจสอบว่าใน callback มีการเช็ค property ที่บอกระดับของข้อความผ่านเมธอด .type() เทียบกับค่าที่หมายถึงข้อผิดพลาด แล้วปริ้นท์ข้อความออกทาง console.log หรือไม่");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Systematic Debugging & Trace และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ความบกพร่องที่ร้ายแรงที่สุดส่วนใหญ่ไม่ได้ขึ้นโชว์เด่นชัดหน้าจอเบราว์เซอร์ แต่ซ่อนตัวอยู่ใน Uncaught JavaScript Errors ฝั่ง Console ของเบราว์เซอร์ การผูกฟังก์ชันดักรับเหตุการณ์ในสคริปต์เทสผ่านเมธอด <code>page.on('console', msg => { ... })</code> จะช่วยสตรีมข้อความเตือนเหล่านั้นกลับมาสกรีนรายงานผลลัพธ์ผ่านหน้าจอเทอร์มินัลของฝั่งรันสคริปต์เพื่อทำการวิเคราะห์หาสาเหตุในระบบเบื้องหลังได้รวดเร็วขึ้น<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>page.on('console', msg => {</code><br/>
    <code>&nbsp;&nbsp;if (msg.type() === 'error') console.log(msg.text());</code><br/>
    <code>});</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ต้องผูก <code>page.on('console', ...)</code> ก่อนสั่ง <code>page.goto()</code> เสมอ ถ้าผูกหลังนำทางหน้าไปแล้ว error ที่เกิดขึ้นระหว่างโหลดหน้าแรกจะหลุดไม่ถูกดักจับ`,
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
        throw new Error("ไม่พบคำสั่งกรอกเงินเดือน 65000 ลงในช่องกรอกข้อมูล ให้ใช้เมธอดกรอกข้อมูลที่ล้างค่าเดิมแล้ว set ค่าใหม่ทันที (ตามที่อธิบายไว้ใน hint)");
      }

      const checkAssert = /await\s+expect\(saveBtn\)\.toBeEnabled\(\)/.test(clean);
      if (checkAssert) {
        log("✓ ขั้นตอนที่ 2: ตรวจพบคำสั่งเช็คความพร้อมปุ่มเซฟ (toBeEnabled)");
      } else {
        throw new Error("ไม่พบคำสั่งตรวจสอบสถานะความพร้อมของปุ่มเซฟ ให้ใช้ Web-first assertion ตระกูลตรวจสอบว่าอิลิเมนต์อยู่ในสถานะพร้อมกดโต้ตอบหรือไม่");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ React-specific Web Testing และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Controlled Component ใน React จะซิงค์ข้อความภายในช่องฟอร์มผูกเข้ากับ State ของ JavaScript ตลอดเวลา หลีกเลี่ยงการใช้คำสั่ง <code>locator.type()</code> ในการจำลองการพิมพ์ทีละปุ่ม เพราะหากบราวเซอร์โหลดการรันสเตตช้าตัวอักษรบางตัวอาจตกหล่นหายไประหว่างทาง การใช้งานเมธอด <code>locator.fill()</code> จะสั่งให้ล้างอักขระเก่าทิ้งและนำประโยคใหม่วางทับแบบจำลอง Direct Value Assignment ทันที ซึ่งเสถียรและกระตุ้น <code>onChange</code> สเตตได้แน่นอนครบถ้วนกว่า<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await salaryInput.fill('65000');</code><br/>
    <code>await expect(saveBtn).toBeEnabled();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>fill()</code> set ค่าตรง ๆ ทันทีโดยไม่จำลอง keydown/keyup ทีละตัวอักษร ถ้าคอมโพเนนต์มี handler เฉพาะที่ฟังทีละคีย์ (เช่น debounce autocomplete) การทดสอบด้วย <code>fill()</code> อาจไม่ trigger logic นั้น ต้องใช้ <code>pressSequentially()</code> แทนในกรณีนั้น`,
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
        throw new Error("ไม่พบสคริปต์การสลับขนาดหน้าต่างเบราว์เซอร์ตามตัวแปรลูป vp ให้ตรวจสอบว่าใช้เมธอดของ Page ที่เปลี่ยนขนาดหน้าต่างโดยตรง รับ object ที่มี width/height เป็นอาร์กิวเมนต์ (ส่งตัวแปรลูปเข้าไปตรง ๆ หรือ destructure เป็น object ใหม่ก็ได้)");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Responsive Loop Layout Simulation และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การทดสอบแบบจำลองการรองรับขนาดอุปกรณ์หน้าจอ (Responsive Testing) เพื่อป้องกันปัญหาอิลิเมนต์เลื่อนเบียดบังทับซ้อนกัน หรือปุ่มหายบนหน้าจอมือถือ แทนที่เราจะเปิดปิดเบราว์เซอร์ใหม่แยกโปรเจคทุก ๆ ครั้ง การสุ่มวนลูปและใช้คำสั่ง <strong><code>page.setViewportSize({ width, height })</code></strong> ภายในเทสเคสเดิมบนแท็บหน้าเว็บเดิมจะช่วยทดสอบความเรียบร้อยของ UI ได้เร็วกว่า และใช้ทรัพยากรคุ้มค่าที่สุด<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>for (const vp of viewports) {</code><br/>
    <code>&nbsp;&nbsp;await page.setViewportSize(vp);</code><br/>
    <code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>setViewportSize()</code> เปลี่ยนแค่ขนาดหน้าต่างเท่านั้น ไม่ได้เปลี่ยน User-Agent หรือ touch support ให้เหมือนมือถือจริง ถ้าต้องการจำลองอุปกรณ์เต็มรูปแบบต้องสร้าง context ใหม่ด้วย <code>browser.newContext({ ...devices['iPhone 13'] })</code> แทน`,
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
        throw new Error("ไม่พบการยิง GET request ไปที่ /api/ta/levels?ticker=AAPL ให้ตรวจสอบว่าใช้เมธอดของ fixture request สำหรับยิง HTTP GET ตรง ๆ หรือยัง");
      }

      const hasJsonParse = /await\s+response\.json\(\)/.test(clean) && /\.resistance\[0\]/.test(clean);
      if (hasJsonParse) {
        log("✓ ขั้นตอนที่ 1b: ดึงค่า resistance[0] จาก response.json() ถูกต้อง");
      } else {
        throw new Error("ไม่พบการแปลง response เป็น JSON แล้วดึงค่า index แรกของอาร์เรย์ resistance ให้ตรวจสอบว่าแปลง response เป็น JSON ด้วยเมธอดมาตรฐานก่อน แล้วเข้าถึง index แรกของอาร์เรย์เป้าหมายหรือยัง");
      }

      const hasGoto = /await\s+page\.goto\(['"]\/holdings['"]\)/.test(clean);
      if (hasGoto) {
        log("✓ ขั้นตอนที่ 2a: เปิดหน้า /holdings ถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งเปิดไปยังหน้า /holdings");
      }

      const hasCrossCheck = /getByText\(\s*['"]\$['"]\s*\+\s*\w+\.toFixed\(2\)\s*\)/.test(clean) && /toBeVisible\(\)/.test(clean);
      if (hasCrossCheck) {
        log("✓ ขั้นตอนที่ 2b: ตรวจสอบว่า UI แสดงตัวเลขตรงกับค่าจาก API สำเร็จ (Cross-check)");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความราคาบน UI ที่ตรงกับค่าจาก API ให้ใช้ getByText() ประกอบสตริงราคาที่มีเครื่องหมาย $ นำหน้าและปัดทศนิยม 2 ตำแหน่งด้วยเมธอดมาตรฐานของตัวเลข แล้วตรวจสอบด้วย Web-first assertion ตระกูลการมองเห็น");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Hybrid Testing: Cross-check API Response กับ UI ที่เรนเดอร์จริง และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ข้อดีของเทคนิคนี้: ถ้า Backend คำนวณถูกแต่ Frontend เอาไปแสดงผิด (ปัดเศษผิด, ต่อ field ผิดตัว, ฟอร์แมตทศนิยมผิด) การทดสอบแบบนี้จะจับได้ทันที ต่างจาก UI test ทั่วไปที่ hardcode ค่าคาดหวังไว้ล่วงหน้า ซึ่งจะไม่รู้เลยว่าค่านั้น "ผิดตั้งแต่ต้นทาง" หรือ "ถูกต้นทางแต่แสดงผิด"<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>const body = await (await request.get('/api/ta/levels?ticker=AAPL')).json();</code><br/>
    <code>await page.goto('/holdings');</code><br/>
    <code>await expect(page.getByText('$' + body.resistance[0].toFixed(2))).toBeVisible();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> คอมโพเนนต์จริง <code>PivotPoints.jsx</code> ในโปรเจก My-Investment-Port ดึงข้อมูลจาก <code>/api/ta/levels</code> ผ่าน <code>fetch()</code> แล้วเรนเดอร์ค่า <code>resistance</code>/<code>support</code> ออกมาเป็นข้อความบนหน้าจอ โดยขึ้นต้นด้วยตัวอักษร <code>$</code> ตามด้วยค่าตัวเลขจาก <code>value.toFixed(2)</code> และ<strong>ไม่มี <code>data-testid</code> กำกับไว้เลย</strong> — สถานการณ์แบบนี้พบบ่อยมากในโค้ดจริง ทำให้ต้องอ้างอิงด้วย <code>getByText()</code> จับข้อความที่เรนเดอร์แทน<br/><br/>`,
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
        throw new Error("ไม่พบการกำหนดค่า retries ให้ suite นี้ ให้ตรวจสอบว่า configure ของ describe block รับ option ชื่อ retries เป็นตัวเลขจำนวนครั้งที่ยอมให้ลองซ้ำตามที่โจทย์กำหนดหรือยัง");
      }

      const hasAutoRetryAssertion = /await\s+expect\(page\.getByText\(['"]AAPL['"]\)\)\.toBeVisible\(\)/.test(clean);
      const hasFixedWait = /waitForTimeout/.test(clean);
      if (hasAutoRetryAssertion && !hasFixedWait) {
        log("✓ ขั้นตอนที่ 2: ใช้ auto-retry assertion toBeVisible() แทน waitForTimeout ถูกต้อง");
      } else if (hasFixedWait) {
        throw new Error("ห้ามใช้การหน่วงเวลาคงที่ ให้ใช้ Web-first assertion ตระกูลตรวจสอบการมองเห็นรอข้อความ 'AAPL' แทน (auto-retry จนกว่าจะเจอหรือ timeout)");
      } else {
        throw new Error("ไม่พบการรอด้วย auto-retry assertion ให้ใช้ Web-first assertion ตระกูลตรวจสอบการมองเห็นรอข้อความ 'AAPL' ปรากฏบนหน้าจอ");
      }

      const hasRetryLog = /testInfo\.retry\s*>\s*0/.test(clean) && /console\.log\(.*Retry attempt.*testInfo\.retry/.test(clean);
      if (hasRetryLog) {
        log("✓ ขั้นตอนที่ 3: log เตือนเมื่อ testInfo.retry > 0 ถูกต้อง");
      } else {
        throw new Error("ไม่พบเงื่อนไขตรวจสอบว่า testInfo.retry มีค่ามากกว่า 0 พร้อมปริ้นท์ข้อความเตือนบอกรอบที่กำลังรันซ้ำผ่าน console.log ตามที่โจทย์กำหนด");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Flaky-Test Retry Strategy และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Flaky test คือ test ที่บางทีผ่านบางทีไม่ผ่านโดยไม่มีการเปลี่ยนโค้ด root cause ส่วนใหญ่คือ timing (UI โหลดข้อมูล async ช้ากว่าที่ test คาดไว้) ทางแก้ที่ผิดคือใส่ <code>page.waitForTimeout(3000)</code> ตายตัว เพราะช้าไปก็เสียเวลาฟรี เร็วไปก็ยัง flaky อยู่ดี<br/><br/>
    ทางแก้ที่ถูกต้อง 2 ชั้น: (1) ใช้ <strong>auto-retry assertion</strong> อย่าง <code>expect().toBeVisible()</code> ซึ่ง Playwright จะ poll ซ้ำจนกว่าจะผ่านหรือ timeout เอง ไม่ต้องเดาเวลาที่แน่นอน (2) เมื่อ timing ยังไม่เสถียรจริงๆ (เช่น 3rd-party widget, network jitter) ให้ตั้ง <strong>retry ระดับ test</strong> เป็นทางสำรอง ไม่ใช่ทางหลัก<br/><br/>
    โปรเจกจริง <code>tests/web-testing/playwright.config.ts</code> ตั้งค่า <code>retries: process.env.CI ? 2 : 0</code> คือ retry เฉพาะบน CI (ที่เครื่องช้ากว่าและ flaky ง่ายกว่า) ไม่ retry ตอน dev เครื่อง local เพื่อให้เห็น failure จริงทันทีเวลาเขียนโค้ด ฟิกซ์เจอร์ <code>testInfo</code> (parameter ตัวที่ 2 ของ test callback) มี property <code>testInfo.retry</code> บอกว่านี่คือการรันครั้งที่เท่าไหร่ (0 = ครั้งแรก) ใช้ log เพื่อสืบสาเหตุว่า test ไหน flaky บ่อยจริงๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>โปรเจกจริง <code>tests/web-testing/playwright.config.ts</code> ตั้งค่า <code>retries: process.env.CI ? 2 : 0</code> คือ retry เฉพาะบน CI (ที่เครื่องช้ากว่าและ flaky ง่ายกว่า) ไม่ retry ตอน dev เครื่อง local เพื่อให้เห็น failure จริงทันทีเวลาเขียนโค้ด ฟิกซ์เจอร์ <code>testInfo</code> (parameter ตัวที่ 2 ของ test callback) มี property <code>testInfo.retry</code> บอกว่านี่คือการรันครั้งที่เท่าไหร่ (0 = ครั้งแรก) ใช้ log เพื่อสืบสาเหตุว่า test ไหน flaky บ่อยจริงๆ<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ทางแก้ที่ถูกต้อง 2 ชั้น: (1) ใช้ <strong>auto-retry assertion</strong> อย่าง <code>expect().toBeVisible()</code> ซึ่ง Playwright จะ poll ซ้ำจนกว่าจะผ่านหรือ timeout เอง ไม่ต้องเดาเวลาที่แน่นอน (2) เมื่อ timing ยังไม่เสถียรจริงๆ (เช่น 3rd-party widget, network jitter) ให้ตั้ง <strong>retry ระดับ test</strong> เป็นทางสำรอง ไม่ใช่ทางหลัก<br/><br/>`,
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
        throw new Error("ห้ามใช้ page.locator() ด้วย CSS selector เพราะ CSS class เปลี่ยนได้ทุกครั้งที่ Dev รีแฟคเตอร์ ให้ค้นหาด้วยเมธอดที่อ้างอิง data-testid attribute แทน");
      }

      const hasTestIdFill = /await\s+page\.getByTestId\(['"]search-input['"]\)\.fill\(['"]AAPL['"]\)/.test(clean);
      if (hasTestIdFill) {
        log("✓ ใช้ getByTestId('search-input').fill('AAPL') ที่ทนต่อการรีแฟคเตอร์ถูกต้อง");
      } else {
        throw new Error("ไม่พบการค้นหาช่องค้นหาด้วย Test ID 'search-input' แล้วกรอกคำว่า 'AAPL' ให้ตรวจสอบว่าใช้เมธอดที่อ้างอิง data-testid ตามด้วยแอคชันกรอกข้อความหรือยัง");
      }
    },
    hint: "ห้ามใช้ page.locator() ด้วย CSS selector เด็ดขาด ให้ค้นหาด้วยเมธอดที่อ้างอิง data-testid attribute แทน แล้วตามด้วยแอคชันกรอกข้อความมาตรฐานเหมือนบทนำ",
    solution: `import { test, expect } from '@playwright/test';

test('TC-13: ค้นหาหุ้นต้องทำงานได้แม้ Dev รีแฟคเตอร์ CSS class ของหน้า UI ใหม่', async ({ page }) => {
  await page.goto('/holdings');

  // ห้ามค้นหาช่องค้นหาด้วย CSS class เพราะเปลี่ยนได้ทุกครั้งที่ Dev รีแฟคเตอร์ ให้ใช้ Test ID ที่เสถียรกว่าแทน แล้วกรอกคำว่า 'AAPL'
  await page.getByTestId('search-input').fill('AAPL');
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Stale Locator หลัง UI Refactor: เลือก Locator ที่ทนต่อการเปลี่ยนแปลง และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>หลักการเลือก Locator เรียงจากทนทานสุดไปเปราะบางสุด:<br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/>1. <code>getByTestId()</code> — ผูกกับ attribute ที่ QA/Dev ตกลงกันไว้ล่วงหน้า ไม่เปลี่ยนตามการรีแฟคเตอร์ style<br/><br/>2. <code>getByRole()</code> / <code>getByLabel()</code> — ผูกกับ semantic ของ element ทนทานพอสมควร<br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ในโปรเจก My-Investment-Port หน้า <code>/holdings</code> มีทั้งสอง pattern: บาง element อย่างช่องค้นหามี <code>data-testid="search-input"</code> กำกับไว้ชัดเจน (เสถียร ไม่ผูกกับ CSS/ข้อความ) แต่บาง component อย่าง <code>PivotPoints.jsx</code> (ดูบทที่ 11 Hybrid Testing) ไม่มี <code>data-testid</code> เลย ต้องอาศัย <code>getByText()</code> จับข้อความที่เรนเดอร์แทน ซึ่งเปราะบางกว่ามาก<br/><br/>`,
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
        throw new Error("ไม่พบคำสั่งคลิกปุ่มลบแถวแรก ให้ตรวจสอบว่าค้นหาด้วย Test ID btn-delete-holding แล้วเลือกอิลิเมนต์แถวแรกจากหลายแถวด้วยเมธอดที่ระบุลำดับก่อนคลิกหรือยัง");
      }

      const hasDialogCheck = /await\s+expect\(page\.getByTestId\(['"]confirm-dialog-confirm['"]\)\)\.toBeVisible\(\)/.test(clean);
      if (hasDialogCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบว่า Dialog ยืนยันปรากฏจริงก่อนถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบว่า Dialog ยืนยันปรากฏอยู่จริงก่อนคลิกยืนยัน ให้ใช้ Web-first assertion ตระกูลตรวจสอบการมองเห็นกับปุ่มยืนยัน");
      }

      const hasConfirmClick = /await\s+page\.getByTestId\(['"]confirm-dialog-confirm['"]\)\.click\(\)/.test(clean);
      if (hasConfirmClick) {
        log("✓ ขั้นตอนที่ 3: คลิกยืนยันลบจริงถูกต้อง");
      } else {
        throw new Error("ไม่พบคำสั่งคลิกปุ่มยืนยันเพื่อลบจริง หลังจากตรวจสอบว่า Dialog ปรากฏแล้ว");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Confirm Dialog: ลบข้อมูลต้องผ่านการยืนยันก่อนเสมอ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บั๊กอัตโนมัติที่พบบ่อยมากคือ: สคริปต์คลิกปุ่ม "ลบ" แล้วรีบไปตรวจสอบผลลัพธ์ทันที ทั้งที่จริงแล้วแอปมี <strong>Confirm Dialog</strong> คั่นกลางอยู่ก่อนข้อมูลจะถูกลบจริง — ถ้าไม่คลิกยืนยันในไดอะล็อก ข้อมูลจะไม่หายไปไหนเลย แต่เทสอาจ "ผ่าน" แบบหลอกๆ เพราะดันไปจับ error อื่นแทนที่จะรู้ว่าไม่ได้ลบจริง<br/><br/>
    ในโปรเจก My-Investment-Port หน้า <code>/holdings</code> ปุ่มลบแต่ละแถวมี Test ID <code>btn-delete-holding</code> (ดูจริงใน <code>HoldingsLedger.jsx</code>) กดแล้วจะเปิด <code>ConfirmDialog</code> component (<code>src/components/modals/ConfirmDialog.jsx</code>) ซึ่ง <strong>ใช้ Test ID เดียวกันซ้ำทั้งแอป</strong> ไม่ว่าจะลบ Holdings, RMF Fund, หรือ Passive Income: ปุ่มยืนยันคือ <code>confirm-dialog-confirm</code> ปุ่มยกเลิกคือ <code>confirm-dialog-cancel</code><br/><br/>
    หลักการ: ก่อนคลิกปุ่มยืนยันในไดอะล็อกใดๆ ต้องยืนยันก่อนด้วย <code>toBeVisible()</code> ว่ามันเปิดขึ้นมาจริงแล้ว (ไม่ใช่คลิกไปมั่วๆ ตำแหน่งเดิมที่เคยมี dialog) เพราะถ้า dialog ยังไม่ทันเปิด การคลิกจะพลาดเป้าและ test จะ fail ด้วยสาเหตุที่เข้าใจผิดได้ง่าย<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.getByTestId('btn-delete-holding').first().click();</code><br/>
    <code>await expect(page.getByTestId('confirm-dialog-confirm')).toBeVisible();</code><br/>
    <code>await page.getByTestId('confirm-dialog-confirm').click();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>confirm-dialog-confirm</code> เป็น Test ID เดียวกันที่ใช้ซ้ำทั้งแอปสำหรับทุก modal ยืนยัน — ถ้าเผลอเปิดสอง dialog ซ้อนกัน (เช่น toast แจ้งเตือนทับ confirm dialog) locator นี้จะจับหลายอิลิเมนต์พร้อมกันจนเจอ Strict Mode violation`,
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
        throw new Error("ไม่พบการกรอกคำถามลงในช่อง Test ID ai-overview-chat-input แล้วคลิกปุ่มส่ง Test ID ai-overview-chat-send ให้ตรวจสอบว่าทำครบทั้งสองขั้นตอนหรือยัง");
      }

      const hasFixedWait = /waitForTimeout/.test(clean);
      const hasEnabledWait = /await\s+expect\(page\.getByTestId\(['"]ai-overview-chat-send['"]\)\)\.toBeEnabled\(\)/.test(clean);
      if (hasFixedWait) {
        throw new Error("ห้ามใช้การหน่วงเวลาคงที่แทนการรอผลลัพธ์จริง — เวลาที่ AI ใช้ตอบไม่คงที่ เดาไม่ได้");
      } else if (hasEnabledWait) {
        log("✓ ขั้นตอนที่ 2: รอปุ่มส่งกลับมาพร้อมใช้งาน (toBeEnabled) แทนการเดาเวลาถูกต้อง");
      } else {
        throw new Error("ไม่พบการรอด้วย auto-retry assertion ให้ใช้ Web-first assertion ตระกูลตรวจสอบว่าอิลิเมนต์กลับมาอยู่ในสถานะพร้อมโต้ตอบ (ไม่ disabled) แทนการเดาเวลา");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Loading State: รอผลลัพธ์จริง ไม่ใช่เดาเวลา และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ฟีเจอร์ที่เรียก AI/LLM ตอบคำถาม (เช่น chat panel) มีเวลาตอบสนองที่ "ไม่คงที่" โดยธรรมชาติ — บางครั้งเร็ว บางครั้งช้ากว่าเดิมหลายเท่า การใส่ <code>waitForTimeout(3000)</code> เดาเวลาจึงเป็นทางแก้ที่ผิดเสมอ: เดาน้อยไปก็ flaky เดามากไปก็เสียเวลาทุก run ในโปรเจก My-Investment-Port หน้าแรก <code>/</code> มี <code>OverviewChatPanel</code> ที่ผูกปุ่มส่งเข้ากับ state <code>loading</code> โดยตรง วิธีที่เสถียรคือรอ Web-first assertion เช็คสถานะปุ่มแทนการเดาเวลา<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>const [loading, setLoading] = useState(false);</code><br/>
    <code>&lt;button disabled={!input.trim() || loading}&gt;</code><br/>
    <code>&nbsp;&nbsp;{loading ? 'Thinking...' : 'Send'}</code><br/>
    <code>&lt;/button&gt;</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ห้ามใช้ <code>page.waitForTimeout(3000)</code> เดาเวลาที่ AI จะตอบเด็ดขาด เพราะเวลาตอบสนองไม่คงที่ — ให้รอด้วย <code>expect(sendBtn).toBeEnabled()</code> ซึ่งจะ poll สถานะปุ่มจนกว่า Backend ตอบกลับจริงแทน`,
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
        throw new Error("ไม่พบการอัปโหลดไฟล์ ./fixtures/holdings-sample.csv ผ่าน input Test ID import-csv-input ให้ตรวจสอบว่าใช้เมธอดของ Locator ที่แนบไฟล์เข้ากับ input type=file โดยตรง รับ path ของไฟล์เป็นอาร์กิวเมนต์หรือยัง");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]Imported['"]\)/.test(clean);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความผลลัพธ์การนำเข้าถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความผลลัพธ์ ให้ตรวจสอบข้อความ Test ID import-result-message ด้วย assertion ตระกูลตรวจสอบว่ามีข้อความ 'Imported' ปรากฏอยู่บางส่วนหรือยัง");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>หมายเหตุสำคัญ:</strong> โปรเจก My-Investment-Port ปัจจุบัน<strong>ไม่มี</strong> input อัปโหลดไฟล์เลยสักจุด (เช็คแล้วทั้ง repo ไม่พบ <code>&lt;input type="file"&gt;</code> หรือ endpoint สำหรับ import ไฟล์) — บทเรียนนี้จึงสอนเทคนิคที่จำเป็นล่วงหน้า เผื่อวันที่แอปมีฟีเจอร์นี้จริง หรือไปเจอในโปรเจกอื่น<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>หมายเหตุสำคัญ:</strong> โปรเจก My-Investment-Port ปัจจุบัน<strong>ไม่มี</strong> input อัปโหลดไฟล์เลยสักจุด (เช็คแล้วทั้ง repo ไม่พบ <code>&lt;input type="file"&gt;</code> หรือ endpoint สำหรับ import ไฟล์) — บทเรียนนี้จึงสอนเทคนิคที่จำเป็นล่วงหน้า เผื่อวันที่แอปมีฟีเจอร์นี้จริง หรือไปเจอในโปรเจกอื่น<br/><br/>
    การทดสอบ <code>&lt;input type="file"&gt;</code> ห้ามคลิกเปิดหน้าต่างเลือกไฟล์ของ OS จริง (Native File Picker) เพราะ browser automation ควบคุมหน้าต่าง OS แบบนั้นไม่ได้และไม่เสถียร วิธีที่ถูกต้องคือใช้ <code>page.setInputFiles()</code> ซึ่งจะ "แนบไฟล์" เข้ากับ <code>&lt;input&gt;</code> โดยตรง ข้าม Native Picker ไปเลย ทำให้เทสเร็วและเสถียร 100%<br/><br/>
    รับ path เดียว (<code>string</code>) สำหรับไฟล์เดียว หรือ array ของ path สำหรับหลายไฟล์พร้อมกัน (<code>setInputFiles(['a.csv', 'b.csv'])</code>) และใช้ <code>setInputFiles([])</code> เพื่อล้างค่าไฟล์ที่เลือกไว้ก่อนหน้า<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.getByTestId('import-csv-input').setInputFiles('./fixtures/holdings-sample.csv');</code><br/>
    <code>await expect(page.getByTestId('import-result-message')).toContainText('Imported');</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>setInputFiles()</code> ต้องเรียกกับ Locator ของ <code>&lt;input type="file"&gt;</code> โดยตรงเท่านั้น (แม้ตัว input จะถูกซ่อนด้วย CSS ก็ยังเรียกได้ปกติ) ห้ามพยายามคลิกเปิด Native File Picker ก่อนเด็ดขาด เพราะ browser automation ควบคุมหน้าต่าง OS แบบนั้นไม่ได้`,
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
        throw new Error("ไม่พบการอัปโหลดไฟล์ ./fixtures/malware.exe ผ่าน input Test ID import-csv-input ด้วยเทคนิคเดียวกับบทก่อนหน้า");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]Only CSV files are allowed['"]\)/.test(clean);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ให้ตรวจสอบข้อความ Test ID import-result-message ว่ามีคำว่า 'Only CSV files are allowed' ปรากฏอยู่บางส่วนหรือยัง");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ File Type Validation: UI ต้องแจ้ง Error เมื่ออัปโหลดไฟล์ผิดประเภท และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทที่แล้วสอน happy path ของการอัปโหลด บทนี้ต่อยอดเช็คว่า UI แจ้งเตือนถูกต้องเมื่อผู้ใช้เลือกไฟล์ผิดประเภทหรือเปล่า — จุดสำคัญคือ<strong>การ Validate ควรเกิดตั้งแต่ฝั่ง Client</strong> (ก่อนแม้แต่จะส่งไปหา Backend) เพื่อ feedback ผู้ใช้ทันทีโดยไม่ต้องรอ round-trip เครือข่าย ถึงแม้ว่า Backend เองก็ต้อง validate ซ้ำอีกชั้นเสมอ (Client-side validation หลอกได้ ห้ามเชื่อฝั่งเดียว ดู track API Testing บทที่ 11)<br/><br/>
    เทคนิคสำคัญ: <code>page.setInputFiles()</code> ไม่จำเป็นต้องมีไฟล์จริงอยู่บนดิสก์เสมอไป — รับ <code>string</code> path ก็ได้ (ต้องมีไฟล์จริงตามที่ระบุ) แต่ก็รับ object <code>{ name, mimeType, buffer }</code> ได้ด้วย (สร้างไฟล์จำลองขึ้นในหน่วยความจำตรงๆ ไม่ต้องมีไฟล์จริง) — บทถัดไปจะสอนรูปแบบหลังสำหรับทดสอบไฟล์ขนาดใหญ่โดยไม่ต้อง commit ไฟล์จริงติด repo<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.getByTestId('import-csv-input').setInputFiles('./fixtures/malware.exe');</code><br/>
    <code>await expect(page.getByTestId('import-result-message')).toContainText('Only CSV files are allowed');</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> Client-side validation หลอกได้ง่าย (แก้ MIME type header หรือยิง request ตรงข้าม UI) — ต้องเช็คซ้ำฝั่ง Backend เสมอ อย่าเชื่อแค่ error message ที่ UI แสดงว่าไฟล์ถูกบล็อกจริง`,
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
        throw new Error("ไม่พบการอัปโหลดไฟล์จำลองขนาด 6MB ให้ตรวจสอบว่าใช้ setInputFiles แบบ object (name, mimeType, buffer) พร้อมจองพื้นที่หน่วยความจำขนาด 6MB ด้วยเมธอดมาตรฐานของ Buffer โดยไม่ต้องมีไฟล์จริงหรือยัง");
      }

      const hasResultCheck = /await\s+expect\(page\.getByTestId\(['"]import-result-message['"]\)\)\.toContainText\(['"]File size exceeds 5MB limit['"]\)/.test(clean);
      if (hasResultCheck) {
        log("✓ ขั้นตอนที่ 2: ตรวจสอบข้อความ error ถูกต้อง");
      } else {
        throw new Error("ไม่พบการตรวจสอบข้อความ error ให้ตรวจสอบข้อความ Test ID import-result-message ว่ามีคำว่า 'File size exceeds 5MB limit' ปรากฏอยู่บางส่วนหรือยัง");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ File Size Validation: UI ต้องปฏิเสธไฟล์ใหญ่เกินโดยไม่ต้องมีไฟล์จริง และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>การทดสอบไฟล์ขนาดใหญ่ไม่จำเป็นต้อง commit ไฟล์ 6MB ติด test repo จริงๆ — ใช้รูปแบบ object ของ <code>setInputFiles({ name, mimeType, buffer })</code> สร้างไฟล์จำลองขึ้นในหน่วยความจำแทน (<code>Buffer.alloc(6 * 1024 * 1024)</code> จองพื้นที่ 6MB เปล่าๆ ในหน่วยความจำตอนรัน ไม่ต้องมีไฟล์จริงบนดิสก์เลย) — เร็วกว่า ไม่ทำให้ repo บวม และ reproducible 100% ทุกเครื่องที่รัน<br/><br/>
    UI ที่ดีควรเช็คขนาดไฟล์<strong>ฝั่ง Client ทันทีที่เลือกไฟล์</strong> (ผ่าน <code>File.size</code> ใน JavaScript) ก่อนจะอัปโหลดขึ้น Backend ด้วยซ้ำ — ประหยัด bandwidth และให้ feedback ผู้ใช้เร็วกว่ารอ round-trip เครือข่ายไปเจอ 413 กลับมา (แต่ฝั่ง Backend ก็ต้องเช็คซ้ำเสมอ เพราะ client-side validation ข้ามได้เสมอถ้ายิง request ตรงแบบ track API Testing บทที่ 12)<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.getByTestId('import-csv-input').setInputFiles({</code><br/>
    <code>&nbsp;&nbsp;name: 'huge.csv', mimeType: 'text/csv', buffer: Buffer.alloc(6 * 1024 * 1024)</code><br/>
    <code>});</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>Buffer.alloc(n)</code> จองพื้นที่หน่วยความจำจริง — ถ้าทดสอบไฟล์หลาย GB พร้อมกันหลาย test อาจกิน RAM เครื่องรันเทสจนช้าหรือ crash ควรใช้ขนาดที่ใหญ่กว่า limit แค่พอสมควร ไม่ต้องจำลองใหญ่เกินจำเป็น`,
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
        throw new Error("ไม่พบการตรวจสอบด้วย Web-first assertion ที่ถูกต้อง ให้ส่ง Locator ของ current-price เข้า expect() ตรง ๆ แล้วใช้ assertion ตระกูลตรวจสอบข้อความให้ตรงกับราคาที่คาดหวังเป๊ะ");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Race Condition</strong> เป็นสาเหตุของ flaky test ที่พบบ่อยกว่าที่คิด: โค้ดคลิกปุ่มแล้ว "อ่านค่า" ออกมาทันทีด้วยเมธอด synchronous อย่าง <code>innerText()</code>/<code>textContent()</code> แล้วนำค่านั้นไปเทียบด้วย <code>expect(value).toBe(...)</code> ธรรมดา — ปัญหาคือ ณ จังหวะที่อ่านค่า React อาจยังไม่ re-render เสร็จเลย ค่าที่ได้จึงเป็นค่าเก่าบ้าง ค่าใหม่บ้าง แล้วแต่จังหวะเครื่องรันเร็วช้าแค่ไหนในแต่ละรอบ<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Race Condition</strong> เป็นสาเหตุของ flaky test ที่พบบ่อยกว่าที่คิด: โค้ดคลิกปุ่มแล้ว "อ่านค่า" ออกมาทันทีด้วยเมธอด synchronous อย่าง <code>innerText()</code>/<code>textContent()</code> แล้วนำค่านั้นไปเทียบด้วย <code>expect(value).toBe(...)</code> ธรรมดา — ปัญหาคือ ณ จังหวะที่อ่านค่า React อาจยังไม่ re-render เสร็จเลย ค่าที่ได้จึงเป็นค่าเก่าบ้าง ค่าใหม่บ้าง แล้วแต่จังหวะเครื่องรันเร็วช้าแค่ไหนในแต่ละรอบ<br/><br/>
    บทที่ 12 (Flaky-Test Retry Strategy) สอนเรื่อง <code>retries</code> ไว้เป็น "ทางสำรอง" สำหรับ timing ที่ควบคุมไม่ได้จริง ๆ แต่บทนี้สอน "ทางแก้ที่ต้นเหตุ": อย่าอ่านค่าออกมาเช็คเองเลย ให้ส่ง Locator ตรงเข้า <code>expect()</code> แล้วใช้ Web-first assertion ตระกูล <code>toHaveText()</code> แทน — ตัวมันจะ poll ตรวจ DOM ซ้ำเองจนกว่าข้อความจะตรงตามที่คาดหรือ timeout ของ test เอง ไม่ต้องพึ่ง retry ทั้งเทสหรือเดาเวลาหน่วงเลยแม้แต่น้อย<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>await page.getByTestId('btn-refresh-price').click();</code><br/>
    <code>await expect(page.getByTestId('current-price')).toHaveText('$150.25');</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> บทที่ 12 (Flaky-Test Retry Strategy) สอนเรื่อง <code>retries</code> ไว้เป็น "ทางสำรอง" สำหรับ timing ที่ควบคุมไม่ได้จริง ๆ แต่บทนี้สอน "ทางแก้ที่ต้นเหตุ": อย่าอ่านค่าออกมาเช็คเองเลย ให้ส่ง Locator ตรงเข้า <code>expect()</code> แล้วใช้ Web-first assertion ตระกูล <code>toHaveText()</code> แทน — ตัวมันจะ poll ตรวจ DOM ซ้ำเองจนกว่าข้อความจะตรงตามที่คาดหรือ timeout ของ test เอง ไม่ต้องพึ่ง retry ทั้งเทสหรือเดาเวลาหน่วงเลยแม้แต่น้อย`,
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
        throw new Error("เมธอด searchTicker ต้องเรียกใช้ this.searchInput (Locator ที่ประกาศไว้แล้วในคลาส) ด้วยแอคชันกรอกข้อความ โดยส่งพารามิเตอร์ ticker เข้าไปแทนค่าตายตัว");
      }

      const hasReadTable = /async\s+getVisibleTableText[^{]*\{[^}]*return\s+await\s+this\.tableContainer\.textContent\(\)/s.test(clean);
      if (hasReadTable) {
        log("✓ เมธอด getVisibleTableText คืนค่าข้อความจาก Locator ตารางถูกต้อง");
      } else {
        throw new Error("เมธอด getVisibleTableText ต้องคืนค่าข้อความทั้งหมดจาก this.tableContainer ด้วยเมธอดที่ดึงข้อความล้วนออกมาเป็น string (ไม่ใช่ innerHTML หรือค่า attribute)");
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
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Page Object Model (POM)</strong> ที่ดีไม่ใช่แค่เก็บ Locator ไว้เฉย ๆ แต่ห่อหุ้ม (encapsulate) พฤติกรรมของหน้านั้นไว้เป็นเมธอดระดับสูงที่อ่านง่าย เพื่อให้ไฟล์เทสจริงเรียกใช้ได้โดยไม่ต้องรู้รายละเอียด Locator ภายใน เช่น เทสไฟล์เรียก <code>await holdingsPage.searchTicker('AAPL')</code> แทนที่จะเขียน <code>page.getByTestId('search-input').fill('AAPL')</code> ซ้ำทุกไฟล์<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Page Object Model (POM)</strong> ที่ดีไม่ใช่แค่เก็บ Locator ไว้เฉย ๆ แต่ห่อหุ้ม (encapsulate) พฤติกรรมของหน้านั้นไว้เป็นเมธอดระดับสูงที่อ่านง่าย เพื่อให้ไฟล์เทสจริงเรียกใช้ได้โดยไม่ต้องรู้รายละเอียด Locator ภายใน เช่น เทสไฟล์เรียก <code>await holdingsPage.searchTicker('AAPL')</code> แทนที่จะเขียน <code>page.getByTestId('search-input').fill('AAPL')</code> ซ้ำทุกไฟล์<br/><br/>
    ข้อดีสำคัญ: ถ้าวันหนึ่ง Dev เปลี่ยนวิธีค้นหา Locator ของช่องค้นหา (เช่น เปลี่ยน Test ID) จะต้องแก้แค่จุดเดียวในคลาส <code>HoldingsPage</code> ไม่ต้องไล่แก้ทุกไฟล์เทสที่เรียกใช้ — นี่คือหลักการ <strong>DRY (Don't Repeat Yourself)</strong> ที่ทำให้ test suite ขนาดใหญ่ดูแลรักษาง่ายในระยะยาว<br/><br/>
    เมธอดในคลาสควรรับพารามิเตอร์ที่จำเป็น (เช่น <code>ticker</code>) แทนการ hardcode ค่าตายตัว เพื่อให้นำเมธอดเดิมไปใช้ซ้ำได้กับทุกกรณีทดสอบ ไม่ใช่แค่เคสเดียว<br/><br/>
    💡 <strong>Mental Model:</strong><br/>
    <code>async searchTicker(ticker: string) {</code><br/>
    <code>&nbsp;&nbsp;await this.searchInput.fill(ticker);</code><br/>
    <code>}</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> อย่าให้เมธอดของคลาสเรียก <code>page.getByTestId(...)</code> ตรง ๆ ซ้ำใหม่ทุกครั้ง — ต้องใช้ Locator ที่ประกาศไว้ใน constructor เท่านั้น (<code>this.searchInput</code>) ไม่งั้นเสียประโยชน์ของ POM ที่แก้จุดเดียวได้ทั้งคลาส`,
    example: `// ตัวอย่างการใช้งานคลาส Page Object ในไฟล์เทสจริง (ไม่ต้องรู้ Locator ภายใน)
const holdingsPage = new HoldingsPage(page);
await page.goto('/holdings');
await holdingsPage.searchTicker('MSFT');
const tableText = await holdingsPage.getVisibleTableText();
expect(tableText).toContain('MSFT');`,
    task: `จงเติมเมธอดของคลาส <code>HoldingsPage</code> ให้สมบูรณ์ตามสเปก:<br/>
    1. เมธอด <code>searchTicker(ticker)</code> ต้องกรอกค่าพารามิเตอร์ <code>ticker</code> ลงในช่องค้นหาผ่าน Locator <code>this.searchInput</code> ที่ประกาศไว้แล้วในคลาส<br/>
    2. เมธอด <code>getVisibleTableText()</code> ต้องคืนค่าข้อความทั้งหมดที่แสดงอยู่ภายในตาราง (<code>this.tableContainer</code>) ออกไปเป็น string`
  },

  // ==========================================
  // MODULE: VISUAL REGRESSION & SNAPSHOT TESTING
  // ==========================================
  {
    id: "visual_intro",
    meta: "Visual 1",
    title: "Visual Regression Testing คืออะไร: จับบั๊กที่ Functional Test มองไม่เห็น",
    template: `// สถานการณ์: ต้องการถ่ายภาพหน้าจอเปรียบเทียบกับ baseline ที่เคยเซฟไว้
// 1. ถ่ายภาพหน้าจอทั้งหน้าด้วย toHaveScreenshot()
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ toHaveScreenshot()...");
      const src = stripComments(code);
      const hasScreenshot = /await expect\(page\)\.toHaveScreenshot\(\)/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      log("✓ ถ่ายภาพหน้าจอเปรียบเทียบกับ baseline ถูกต้อง");
    },
    hint: "ใช้ assertion ของ Playwright ที่เทียบภาพทั้งหน้ากับ baseline โดยตรง ไม่ต้องส่ง argument ใดๆ เข้าไป — ชื่อ method สื่อความหมายตรงตัวว่า 'ต้องมีภาพหน้าจอ (เทียบกับ baseline)'",
    solution: `import { test, expect } from '@playwright/test';

test('หน้าเว็บไม่มีการเปลี่ยนแปลงทาง visual โดยไม่ตั้งใจ', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Visual Regression Testing</strong> จับบั๊กประเภทที่ Functional Test (เช็คค่า/behavior) มองไม่เห็นเลย — เช่น CSS พังจน layout ทับกัน, สีเปลี่ยนผิดโดยไม่ตั้งใจ, font ไม่โหลด, รูปภาพหาย ทั้งที่ทุก assertion เชิงข้อมูล/behavior ยังผ่านหมด เพราะ DOM/data ถูกต้อง แค่ "หน้าตา" ผิดไป<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>1. <strong>ครั้งแรกที่รัน</strong> — ไม่มี baseline ให้เทียบ จึงถ่ายภาพเก็บไว้เป็น baseline ทันที (ผ่านเสมอ)<br/><br/>2. <strong>ครั้งถัดไป</strong> — ถ่ายภาพใหม่แล้วเทียบ pixel-by-pixel กับ baseline ที่เก็บไว้ ถ้าต่างเกินค่าที่ยอมรับได้ (threshold) test จะ fail พร้อมสร้างไฟล์ diff image ให้ดูว่าต่างกันตรงไหน<br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>toHaveScreenshot()</code> ของ Playwright ทำงาน 2 แบบ:<br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> บทถัดไปจะครอบคลุมปัญหาจริงที่ต้องรู้ก่อนใช้งาน: การ mask เนื้อหาที่เปลี่ยนตลอดเวลา, การเทส responsive หลาย viewport, และการปรับ threshold ให้ไม่ false-positive จากเรื่องเล็กน้อยอย่าง anti-aliasing`,
    example: `// ถ่ายภาพเฉพาะ element เดียว ไม่ใช่ทั้งหน้า (เจาะจงกว่า เร็วกว่า)
await expect(page.getByTestId('watchlist-panel')).toHaveScreenshot();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพหน้าจอทั้งหน้าเปรียบเทียบกับ baseline ด้วย <code>toHaveScreenshot()</code>`
  },
  {
    id: "visual_masking_dynamic_content",
    meta: "Visual 2",
    title: "Masking: ปิดบังส่วนที่เปลี่ยนตลอดเวลาก่อนเทียบภาพ",
    template: `// สถานการณ์: QuickBuyWatchlist.jsx จริงแสดง currentPrice แบบ real-time (ราคาหุ้นเปลี่ยนทุกวินาที)
// ถ่ายภาพเทียบ baseline ตรงๆ จะ fail ทุกครั้งเพราะราคาไม่เท่าเดิม ทั้งที่ layout ไม่ได้พังอะไรเลย
// 1. ถ่ายภาพทั้งหน้า แต่ mask element ที่มี data-testid="watchlist-current-price" ไว้ก่อน
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ mask()...");
      const src = stripComments(code);
      const hasMaskOption = /mask:\s*\[/.test(src);
      const hasCorrectTestId = /getByTestId\(\s*['"]watchlist-current-price['"]\s*\)/.test(src);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasMaskOption) {
        throw new Error("ไม่พบ option mask: [...]");
      }
      if (!hasCorrectTestId) {
        throw new Error("mask ต้องเจาะจงไปที่ locator ของ data-testid='watchlist-current-price' โดยใช้ page.getByTestId(...) จริง ไม่ใช่แค่พิมพ์ชื่อ testId ไว้เฉยๆ");
      }
      log("✓ Mask เนื้อหาที่เปลี่ยนตลอดเวลาก่อนเทียบภาพถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option mask เป็น array ของ locator — ใช้ page.getByTestId() หา element ตาม data-testid ที่โจทย์กำหนด แล้วใส่ locator นั้นเข้าไปใน array",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพเปรียบเทียบโดย mask ราคาที่เปลี่ยนตลอดเวลา', async ({ page }) => {
  await page.goto('/watchlist');
  await expect(page).toHaveScreenshot({
    mask: [page.getByTestId('watchlist-current-price')],
  });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>QuickBuyWatchlist.jsx</code> ของ My-Investment-Port แสดง <code>currentPrice</code> จริงแบบ real-time:<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>&lt;ResponsiveValue label={UI_STRINGS.AI_WATCH_COL_CURRENT} value={currentPrice ? \`\$\${formatMoney(currentPrice)}\` : '—'} align="right" /&gt;</code><br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>const currentPrice = prices[item.ticker];<br/><br/><code>mask</code> option ของ <code>toHaveScreenshot()</code> รับ array ของ locator — Playwright จะ<strong>วาดกล่องสีทึบทับ</strong>บริเวณนั้นก่อนเทียบภาพ ทำให้เนื้อหาที่เปลี่ยนตลอดเวลา (ราคา, เวลา, ตัวนับ, ข้อมูลที่ randomize) ไม่ถูกนำมาเทียบเลย ในขณะที่ส่วนอื่นของหน้า (layout, สี, ตำแหน่ง) ยังถูกตรวจสอบตามปกติ<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าถ่ายภาพหน้านี้เทียบ baseline ตรงๆ โดยไม่ mask ราคา — test จะ<strong>fail แทบทุกครั้ง</strong>เพราะราคาหุ้นจริงเปลี่ยนแทบทุกวินาที ทั้งที่ layout/สไตล์ไม่ได้พังอะไรเลย นี่คือ <strong>false positive</strong> ที่พบบ่อยที่สุดของ Visual Regression Testing<br/><br/>`,
    example: `// mask หลาย element พร้อมกัน (ราคา + เวลาล่าสุดที่อัปเดต)
await expect(page).toHaveScreenshot({
  mask: [
    page.getByTestId('watchlist-current-price'),
    page.getByTestId('last-updated-timestamp'),
  ],
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพทั้งหน้าด้วย <code>toHaveScreenshot()</code><br/>
    2. mask element <code>data-testid="watchlist-current-price"</code>`
  },
  {
    id: "visual_responsive_visual_check",
    meta: "Visual 3",
    title: "Responsive Visual Check: เทียบภาพหลาย Viewport",
    template: `// สถานการณ์: ต้องการเช็คว่าหน้าเว็บแสดงผลถูกต้องทั้งจอมือถือและจอ desktop
// 1. ตั้งค่า viewport เป็นขนาดมือถือ (375x667)
// 2. ถ่ายภาพเปรียบเทียบด้วย toHaveScreenshot('mobile.png')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการเทส Responsive หลาย viewport...");
      const src = stripComments(code);
      const hasSetViewport = /setViewportSize\(\{\s*width:\s*375,\s*height:\s*667\s*\}\)/.test(src);
      const hasNamedScreenshot = /toHaveScreenshot\(['"]mobile\.png['"]\)/.test(src);
      if (!hasSetViewport) {
        throw new Error("ไม่พบการตั้งค่า viewport 375x667");
      }
      if (!hasNamedScreenshot) {
        throw new Error("ไม่พบการถ่ายภาพชื่อ 'mobile.png'");
      }
      log("✓ เทส Responsive Visual สำหรับ viewport มือถือถูกต้อง");
    },
    hint: "ต้องเรียกสอง method เรียงกัน: หนึ่งคือ method ของ page ที่ตั้งขนาดหน้าจอ (รับ object ที่มี width กับ height) แล้วตามด้วย toHaveScreenshot() ที่ส่งชื่อไฟล์เป็น argument ตัวแรก",
    solution: `import { test, expect } from '@playwright/test';

test('หน้าเว็บแสดงผลถูกต้องบนจอมือถือ', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page).toHaveScreenshot('mobile.png');
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Responsive Visual Check: เทียบภาพหลาย Viewport และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ขนาด viewport ที่นิยมทดสอบ: มือถือ (375×667, iPhone SE), แท็บเล็ต (768×1024, iPad), desktop (1920×1080) — ครอบคลุมกลุ่มผู้ใช้ส่วนใหญ่โดยไม่ต้องทดสอบทุกขนาดจอที่มีในโลกจริง<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>page.setViewportSize({ width, height })</code> จำลองขนาดหน้าจอต่างๆ ก่อนถ่ายภาพ — ตั้งชื่อไฟล์ screenshot ให้ต่างกันชัดเจน (<code>'mobile.png'</code>, <code>'tablet.png'</code>, <code>'desktop.png'</code>) เพื่อไม่ให้ baseline ของแต่ละขนาดทับกัน<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ถ้าถ่ายภาพหลาย viewport แต่ตั้งชื่อไฟล์ซ้ำกัน (หรือไม่ตั้งชื่อเลย) baseline ของแต่ละขนาดจะทับกันและเทียบผิดชุดโดยไม่มี error เตือน นอกจากนี้ <code>page.setViewportSize()</code> เปลี่ยนแค่ขนาดหน้าจอ ไม่ได้จำลอง touch input หรือ device pixel ratio ของอุปกรณ์จริง ถ้าต้องการ emulate มือถือให้ครบถ้วนควรใช้ <code>test.use({ ...devices['iPhone SE'] })</code> แทน`,
    example: `// ทดสอบหลายขนาดจอในลูปเดียว ลดโค้ดซ้ำ
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
];
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await expect(page).toHaveScreenshot(\`\${vp.name}.png\`);
}`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ตั้งค่า viewport เป็น <code>{ width: 375, height: 667 }</code><br/>
    2. ถ่ายภาพเปรียบเทียบชื่อ <code>'mobile.png'</code>`
  },
  {
    id: "visual_full_page_screenshot",
    meta: "Visual 4",
    title: "Full Page Screenshot: ถ่ายภาพทั้งหน้าที่ยาวเกินจอ",
    template: `// สถานการณ์: หน้า Investment Timeline ยาวเกินจอ ต้องเลื่อนดูหลายรอบ
// 1. ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดู ด้วย option fullPage: true
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการถ่ายภาพ Full Page...");
      const src = stripComments(code);
      const hasFullPage = /fullPage:\s*true/.test(src);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasFullPage) {
        throw new Error("ไม่พบการตั้งค่า fullPage: true");
      }
      log("✓ ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดูถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option ที่บอกให้ถ่ายภาพความสูงทั้งหมดของหน้า ไม่ใช่แค่ส่วนที่มองเห็นในจอ — ชื่อ option สื่อความหมายตรงตัวว่า 'เต็มหน้า'",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพทั้งหน้ารวมส่วนที่ต้องเลื่อนดู', async ({ page }) => {
  await page.goto('/timeline');
  await expect(page).toHaveScreenshot({ fullPage: true });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Full Page Screenshot: ถ่ายภาพทั้งหน้าที่ยาวเกินจอ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ค่า default ของ <code>toHaveScreenshot()</code> ถ่ายภาพแค่<strong>ส่วนที่มองเห็นในจอ (viewport)</strong> เท่านั้น — ถ้าหน้าเว็บยาวเกินจอ (ต้องเลื่อนดู) เนื้อหาส่วนที่อยู่นอกจอจะไม่ถูกถ่ายภาพเลย ทำให้ Visual Regression พลาดบั๊กที่อยู่ใน section ที่มองไม่เห็นตอนแรก<br/><br/>
    <code>fullPage: true</code> สั่งให้ Playwright เลื่อนหน้าจอไปเรื่อยๆ แล้วต่อภาพทุกส่วนเข้าด้วยกันเป็นภาพเดียวยาวเท่าความสูงจริงของหน้า — เหมาะกับหน้าที่มีเนื้อหายาว เช่น <code>InvestmentTimeline.jsx</code> ของ My-Investment-Port ที่แสดงประวัติการลงทุนเป็นรายการยาวตามช่วงเวลา<br/><br/>
    ข้อควรระวัง: หน้าที่มีเนื้อหา<strong>โหลดเพิ่มตอนเลื่อน</strong> (infinite scroll / lazy load) อาจได้ผลลัพธ์ไม่คงที่ระหว่างการรันแต่ละครั้ง เพราะจำนวนแถวที่โหลดมาขึ้นกับจังหวะเวลาที่ถ่ายภาพพอดี — กรณีแบบนี้ควร screenshot เฉพาะ element ที่ต้องการแทนการใช้ <code>fullPage: true</code> ทั้งหน้า<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>fullPage: true</code> สั่งให้ Playwright เลื่อนหน้าจอไปเรื่อยๆ แล้วต่อภาพทุกส่วนเข้าด้วยกันเป็นภาพเดียวยาวเท่าความสูงจริงของหน้า — เหมาะกับหน้าที่มีเนื้อหายาว เช่น <code>InvestmentTimeline.jsx</code> ของ My-Investment-Port ที่แสดงประวัติการลงทุนเป็นรายการยาวตามช่วงเวลา<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ข้อควรระวัง: หน้าที่มีเนื้อหา<strong>โหลดเพิ่มตอนเลื่อน</strong> (infinite scroll / lazy load) อาจได้ผลลัพธ์ไม่คงที่ระหว่างการรันแต่ละครั้ง เพราะจำนวนแถวที่โหลดมาขึ้นกับจังหวะเวลาที่ถ่ายภาพพอดี — กรณีแบบนี้ควร screenshot เฉพาะ element ที่ต้องการแทนการใช้ <code>fullPage: true</code> ทั้งหน้า`,
    example: `// ถ่ายภาพเฉพาะ element เดียวที่ยาวเกินจอ (แทนทั้งหน้า)
await expect(page.getByTestId('timeline-list')).toHaveScreenshot();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพทั้งหน้าด้วย <code>toHaveScreenshot({ fullPage: true })</code>`
  },
  {
    id: "visual_threshold_tuning",
    meta: "Visual 5",
    title: "Threshold Tuning: กันไม่ให้ False Positive จาก Font Rendering",
    template: `// สถานการณ์: baseline generate บน CI (Linux) แต่ dev รัน test บน macOS
// font rendering ต่างกันเล็กน้อยทำให้ diff เกิดขึ้นเสมอทั้งที่ไม่มีอะไรพัง
// 1. ถ่ายภาพเปรียบเทียบ พร้อมตั้งค่า maxDiffPixelRatio ให้ยอมรับความต่างเล็กน้อยได้ (0.02 = 2%)
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งค่า Threshold...");
      const src = stripComments(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      const hasMaxDiffRatio = /maxDiffPixelRatio:\s*0\.02/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      if (!hasMaxDiffRatio) {
        throw new Error("ไม่พบการตั้งค่า maxDiffPixelRatio: 0.02");
      }
      log("✓ ตั้งค่า threshold ให้ยอมรับความต่างเล็กน้อยถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option ที่กำหนดสัดส่วนพิกเซลสูงสุดที่ยอมให้ต่างจาก baseline ได้ ค่าเป็นทศนิยมระหว่าง 0-1 แทนเปอร์เซ็นต์ (0.02 = 2%)",
    solution: `import { test, expect } from '@playwright/test';

test('เทียบภาพโดยยอมรับความต่างเล็กน้อยจาก font rendering', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.02 });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Threshold Tuning: กันไม่ให้ False Positive จาก Font Rendering และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ปัญหาจริงที่ทีมที่ใช้ Visual Regression Testing เจอบ่อยที่สุด: <strong>macOS กับ Linux render font ต่างกันเล็กน้อย</strong> (anti-aliasing, sub-pixel rendering ไม่เหมือนกัน) ถ้า baseline สร้างบน CI (มักรันบน Linux) แล้ว dev รัน test เดิมบนเครื่อง macOS ของตัวเอง — จะได้ diff เล็กๆ น้อยๆ ทุกครั้งทั้งที่ไม่มีอะไรพังจริง (false positive)<br/><br/>
    <code>maxDiffPixelRatio</code> กำหนดสัดส่วนพิกเซลที่ต่างกันได้สูงสุด (0.02 = ยอมรับความต่างได้ถึง 2% ของพิกเซลทั้งหมด) ก่อนจะถือว่า test fail จริง — ตั้งค่าน้อยเกินไปจะ false-positive บ่อย (เจอ diff จาก font rendering ทั้งที่ไม่มีบั๊กจริง) ตั้งค่ามากเกินไปจะพลาดบั๊กจริงที่ทำให้ layout เปลี่ยนแปลงชัดเจน<br/><br/>
    <strong>วิธีที่ถูกต้องที่สุด</strong> (ตามที่ track Playwright UI Testing เคยแนะนำไว้ในหัวข้อ Gotchas): <strong>generate baseline บน CI เสมอ ไม่ใช่บนเครื่อง local ของแต่ละคน</strong> — เพราะถ้าทุกคน (และ CI) รัน test เทียบกับ baseline ที่มาจากสภาพแวดล้อมเดียวกันเป๊ะ (Linux ของ CI) ปัญหา font-rendering-ต่างกันจะไม่เกิดขึ้นเลยตั้งแต่แรก การตั้ง <code>maxDiffPixelRatio</code> เป็นแค่ตาข่ายนิรภัยสำรอง ไม่ใช่ทางแก้หลัก<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>วิธีที่ถูกต้องที่สุด</strong> (ตามที่ track Playwright UI Testing เคยแนะนำไว้ในหัวข้อ Gotchas): <strong>generate baseline บน CI เสมอ ไม่ใช่บนเครื่อง local ของแต่ละคน</strong> — เพราะถ้าทุกคน (และ CI) รัน test เทียบกับ baseline ที่มาจากสภาพแวดล้อมเดียวกันเป๊ะ (Linux ของ CI) ปัญหา font-rendering-ต่างกันจะไม่เกิดขึ้นเลยตั้งแต่แรก การตั้ง <code>maxDiffPixelRatio</code> เป็นแค่ตาข่ายนิรภัยสำรอง ไม่ใช่ทางแก้หลัก<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>maxDiffPixelRatio</code> กำหนดสัดส่วนพิกเซลที่ต่างกันได้สูงสุด (0.02 = ยอมรับความต่างได้ถึง 2% ของพิกเซลทั้งหมด) ก่อนจะถือว่า test fail จริง — ตั้งค่าน้อยเกินไปจะ false-positive บ่อย (เจอ diff จาก font rendering ทั้งที่ไม่มีบั๊กจริง) ตั้งค่ามากเกินไปจะพลาดบั๊กจริงที่ทำให้ layout เปลี่ยนแปลงชัดเจน<br/><br/>`,
    example: `// ตัวอย่างตั้งค่าอีกแบบ: จำนวนพิกเซลตายตัวแทนสัดส่วน (เหมาะกับภาพขนาดคงที่)
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพเปรียบเทียบด้วย <code>toHaveScreenshot()</code><br/>
    2. ตั้งค่า <code>maxDiffPixelRatio: 0.02</code>`
  },
  {
    id: "visual_combined_mask_and_threshold",
    meta: "Visual 6",
    title: "รวมร่าง: Mask หลาย Element พร้อม Threshold ในการถ่ายภาพเดียว",
    template: `// สถานการณ์: หน้า Dashboard แสดงราคาหุ้น real-time (data-testid="watchlist-current-price")
// และเวลาล่าสุดที่อัปเดต (data-testid="last-updated-timestamp") พร้อมกัน
// นอกจากนี้ baseline ยัง generate มาจาก CI (Linux) ทำให้ font rendering ต่างจากเครื่อง local เล็กน้อย (เหมือนบทที่ 4)
// ต้องแก้ทั้งสองปัญหาพร้อมกันในการถ่ายภาพครั้งเดียว:
// 1. mask ทั้ง watchlist-current-price และ last-updated-timestamp (สองส่วนที่เปลี่ยนตลอดเวลา)
// 2. ตั้งค่า maxDiffPixelRatio เป็น 0.02 เพื่อกันความต่างเล็กน้อยจาก font rendering
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการรวม mask หลาย element + maxDiffPixelRatio...");
      const src = stripComments(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      const hasMaskOption = /mask:\s*\[/.test(src);
      if (!hasMaskOption) {
        throw new Error("ไม่พบ option mask: [...] ที่รวม locator ของส่วนที่เปลี่ยนตลอดเวลาทั้งสองส่วน");
      }
      const hasPriceTestId = /getByTestId\(\s*['"]watchlist-current-price['"]\s*\)/.test(src);
      const hasTimestampTestId = /getByTestId\(\s*['"]last-updated-timestamp['"]\s*\)/.test(src);
      if (!hasPriceTestId || !hasTimestampTestId) {
        throw new Error("mask ต้องครอบคลุม locator ของทั้งสอง testid ที่ระบุในโจทย์ให้ครบ (watchlist-current-price และ last-updated-timestamp)");
      }
      const hasMaxDiffRatio = /maxDiffPixelRatio:\s*0\.02/.test(src);
      if (!hasMaxDiffRatio) {
        throw new Error("ไม่พบการตั้งค่า maxDiffPixelRatio: 0.02 ร่วมกับ mask ในการถ่ายภาพเดียวกัน");
      }
      log("✓ รวม mask หลาย element และ maxDiffPixelRatio ในการถ่ายภาพเดียวถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ options object เดียว ที่ใส่ทั้ง mask (array ของหลาย locator ที่ได้จาก getByTestId) และ maxDiffPixelRatio เป็น key พร้อมกันได้ ลองนึกถึงบทที่ 1 (mask หลาย element) รวมกับบทที่ 4 (threshold) แล้วรวมสอง option เข้าใน object เดียว",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพ Dashboard โดย mask ส่วนที่เปลี่ยนตลอดเวลา และยอมรับความต่างเล็กน้อยจาก font rendering', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot({
    mask: [
      page.getByTestId('watchlist-current-price'),
      page.getByTestId('last-updated-timestamp'),
    ],
    maxDiffPixelRatio: 0.02,
  });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ รวมร่าง: Mask หลาย Element พร้อม Threshold ในการถ่ายภาพเดียว และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทเรียนนี้รวมสองปัญหาที่เจอแยกกันในบทที่ 1 (masking) และบทที่ 4 (threshold) เข้าด้วยกัน เพราะในงานจริง Dashboard หนึ่งหน้ามักมี<strong>ปัญหาซ้อนกันหลายอย่างพร้อมกัน</strong> ไม่ได้เจอทีละปัญหาเรียงลำดับสวยงามแบบในบทเรียน<br/><br/>
    <code>toHaveScreenshot()</code> รับ options object เดียว ดังนั้น <code>mask</code> และ <code>maxDiffPixelRatio</code> จึงเป็นแค่สอง key ใน object เดียวกัน — ไม่ต้องเรียก <code>toHaveScreenshot()</code> สองครั้งหรือแยกเป็นสอง assertion<br/><br/>
    ข้อควรระวัง: <code>mask</code> จัดการเฉพาะ "พื้นที่ที่รู้อยู่แล้วว่าเปลี่ยนตลอดเวลา" (ราคา, เวลา) ส่วน <code>maxDiffPixelRatio</code> จัดการ "ความต่างเล็กน้อยที่คาดเดาตำแหน่งไม่ได้" (font rendering, anti-aliasing) — สอง option นี้แก้ปัญหาคนละประเภท ใช้แทนกันไม่ได้ ต้องใช้ร่วมกันเมื่อหน้าเว็บมีทั้งสองปัญหาพร้อมกัน<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>toHaveScreenshot()</code> รับ options object เดียว ดังนั้น <code>mask</code> และ <code>maxDiffPixelRatio</code> จึงเป็นแค่สอง key ใน object เดียวกัน — ไม่ต้องเรียก <code>toHaveScreenshot()</code> สองครั้งหรือแยกเป็นสอง assertion<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ข้อควรระวัง: <code>mask</code> จัดการเฉพาะ "พื้นที่ที่รู้อยู่แล้วว่าเปลี่ยนตลอดเวลา" (ราคา, เวลา) ส่วน <code>maxDiffPixelRatio</code> จัดการ "ความต่างเล็กน้อยที่คาดเดาตำแหน่งไม่ได้" (font rendering, anti-aliasing) — สอง option นี้แก้ปัญหาคนละประเภท ใช้แทนกันไม่ได้ ต้องใช้ร่วมกันเมื่อหน้าเว็บมีทั้งสองปัญหาพร้อมกัน`,
    example: `// ตัวอย่าง: mask element เดียวแต่รวมกับ threshold (กรณีมีแค่ปัญหาเดียวของแต่ละฝั่ง)
await expect(page).toHaveScreenshot({
  mask: [page.getByTestId('live-clock')],
  maxDiffPixelRatio: 0.01,
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพด้วย <code>toHaveScreenshot()</code><br/>
    2. mask ทั้ง <code>data-testid="watchlist-current-price"</code> และ <code>data-testid="last-updated-timestamp"</code> ในการถ่ายภาพเดียวกัน<br/>
    3. ตั้งค่า <code>maxDiffPixelRatio: 0.02</code> ร่วมด้วยใน options object เดียวกัน`
  },
  {
    id: "visual_flaky_font_animation_fix",
    meta: "Visual 7",
    title: "Debug Flaky Test: Font โหลดไม่ทัน + CSS Animation กำลังเล่นอยู่",
    template: `// สถานการณ์: Test นี้ flaky บน CI — บางครั้งผ่าน บางครั้ง fail แบบสุ่ม ทั้งที่หน้าเว็บไม่มีอะไรเปลี่ยนแปลงจริง
// สาเหตุ: (1) font ยังโหลดไม่เสร็จตอนถ่ายภาพ (2) มี CSS animation (fade-in) กำลังเล่นอยู่พอดีตอนถ่ายภาพ
// โค้ดด้านล่างพยายามแก้ด้วย blind wait ซึ่ง "เดา" เวลาไปเฉยๆ ไม่ได้รับประกันว่า font โหลดเสร็จหรือ animation จบจริง
// ทำให้ยัง flaky อยู่บางครั้ง (เครื่องช้ากว่าที่เดาไว้ ก็ยังไม่จบทัน)
import { test, expect } from '@playwright/test';

test('ถ่ายภาพหน้า Dashboard อย่างเสถียร ไม่ flaky จาก font และ animation', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForTimeout(2000); // ผิด: blind wait เดาเวลา ไม่รับประกันความเสถียรจริง
  await expect(page).toHaveScreenshot();
});

// TODO: แก้ไขให้ถูกต้อง แทนที่ blind wait ด้านบนด้วย:
// 1. ปิด CSS animation ก่อนถ่ายภาพ ด้วยการตั้งค่า context/test option ที่เกี่ยวกับการลดการเคลื่อนไหว
// 2. รอสัญญาณจริงว่า font โหลดเสร็จสมบูรณ์ก่อนถ่ายภาพ
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการแก้ไข Flaky Test จาก Font/Animation...");
      const src = stripComments(code);
      const hasBlindWait = /waitForTimeout\(/.test(src);
      if (hasBlindWait) {
        throw new Error("ยังพบ page.waitForTimeout() อยู่ — เป็น blind wait ที่เดาเวลาเฉยๆ ไม่รับประกันความเสถียรจริง ต้องเอาออกแล้วรอสัญญาณที่แท้จริงแทน");
      }
      const hasReducedMotion = /reducedMotion:\s*['"]reduce['"]/.test(src);
      if (!hasReducedMotion) {
        throw new Error("ไม่พบการปิด CSS animation ด้วย option reducedMotion: 'reduce'");
      }
      const hasFontReady = /document\.fonts\.ready/.test(src);
      const hasNetworkIdle = /waitForLoadState\(\s*['"]networkidle['"]\s*\)/.test(src);
      if (!hasFontReady && !hasNetworkIdle) {
        throw new Error("ไม่พบการรอความเสถียรก่อนถ่ายภาพ — ต้องรอ font โหลดเสร็จด้วย document.fonts.ready หรือรอ page.waitForLoadState('networkidle')");
      }
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      log("✓ แก้ไข Flaky Test ด้วยการรอความเสถียรที่แท้จริง (ไม่ใช่ blind wait) ถูกต้อง");
    },
    hint: "แทนที่ blind wait ด้วยสองอย่างร่วมกัน: (1) ปิด animation ด้วย context/test option ที่ปิดการเคลื่อนไหวตามการตั้งค่า prefers-reduced-motion ของระบบ (Playwright มี option ระดับ context ให้ตรงนี้) และ (2) รอ Promise ที่ browser มีให้อยู่แล้วสำหรับเช็คว่า font ทั้งหมดโหลดเสร็จ (อยู่ใต้ object ของ document ที่เกี่ยวกับ fonts)",
    solution: `import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('ถ่ายภาพหน้า Dashboard อย่างเสถียร ไม่ flaky จาก font และ animation', async ({ page }) => {
  await page.goto('/dashboard');
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot();
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ Debug Flaky Test: Font โหลดไม่ทัน + CSS Animation กำลังเล่นอยู่ และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>Flaky visual test (บางครั้งผ่าน บางครั้ง fail แบบสุ่ม โดยไม่มีอะไรเปลี่ยนจริง) ต่างจาก false positive ที่คงที่ (เช่น font-rendering ต่างเครื่องในบทที่ 4) ตรงที่<strong>ผลลัพธ์ไม่คงที่แม้รันซ้ำบนเครื่องเดียวกัน</strong> — สาเหตุหลักสองอย่างที่พบบ่อยที่สุดคือ font ที่โหลดผ่านเครือข่ายยังมาไม่ครบตอนถ่ายภาพ (บางครั้งมาทัน บางครั้งไม่ทัน) และ CSS animation/transition ที่กำลังเล่นอยู่พอดี (จับภาพได้คนละ frame ทุกครั้งที่รัน)<br/><br/>
    <strong>ทำไม <code>page.waitForTimeout()</code> ไม่ใช่ทางแก้ที่ถูกต้อง:</strong> เป็นการ "เดา" ตัวเลขเวลาคงที่ ซึ่งไม่รับประกันอะไรเลย — เครื่อง CI ที่ช้ากว่าปกติ (เช่น ตอน CI คิวงานหนัก) อาจยังโหลด font ไม่เสร็จแม้รอเกินเวลาที่เดาไว้ ในขณะที่เครื่องเร็วก็รอเสียเวลาโดยไม่จำเป็น<br/><br/>
    <strong>ทางแก้ที่ถูกต้อง</strong> คือรอ "สัญญาณจริง" แทนการเดาเวลา: <code>document.fonts.ready</code> คือ Promise มาตรฐานของ browser ที่ resolve เมื่อฟอนต์ทั้งหมดโหลดเสร็จจริง (เรียกผ่าน <code>page.evaluate()</code>) ส่วนการปิด CSS animation ทำได้ผ่าน context option <code>reducedMotion: 'reduce'</code> ซึ่งบอก browser ให้ส่งสัญญาณ <code>prefers-reduced-motion: reduce</code> — เว็บที่เขียน CSS animation ให้เคารพ media query นี้ (แนวทางที่ดีอยู่แล้วเพื่อ accessibility) จะปิด/ข้าม animation ไปเอง ทำให้ทุกครั้งที่ถ่ายภาพ ได้ frame สุดท้ายที่นิ่งแล้วเสมอ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>test.use({ reducedMotion: 'reduce' });</code><br/>
    <code>await page.goto('/dashboard');</code><br/>
    <code>await page.evaluate(() => document.fonts.ready);</code><br/>
    <code>await expect(page).toHaveScreenshot();</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>document.fonts.ready</code> เป็น browser API ต้องเรียกผ่าน <code>page.evaluate()</code> เท่านั้น เขียนลอยๆ ในโค้ดฝั่ง test runner จะ error ทันทีเพราะไม่มี <code>document</code> ให้ใช้ นอกจากนี้ <code>reducedMotion: 'reduce'</code> ต้องตั้งผ่าน <code>test.use()</code> ก่อน test เริ่มรัน (หรือตอนสร้าง browser context) — ถ้าไปตั้งหลัง <code>page.goto()</code> จะไม่มีผลย้อนหลังกับ animation ที่กำลังเล่นอยู่ก่อนหน้านั้น`,
    example: `// ทางเลือกอื่นสำหรับรอความเสถียร: รอ network idle แทนรอ font โดยตรง
// (เหมาะกับกรณีที่ font โหลดมาพร้อมกับ resource อื่นๆ ผ่าน network เดียวกัน)
test.use({ reducedMotion: 'reduce' });
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
await expect(page).toHaveScreenshot();`,
    task: `จงแก้ไขสคริปต์ทดสอบที่ flaky ให้เสถียร โดย:<br/>
    1. เอา <code>page.waitForTimeout()</code> (blind wait) ออก<br/>
    2. ปิด CSS animation ด้วย <code>reducedMotion: 'reduce'</code><br/>
    3. รอ font โหลดเสร็จด้วย <code>document.fonts.ready</code> (หรือรอ <code>page.waitForLoadState('networkidle')</code>) ก่อนถ่ายภาพด้วย <code>toHaveScreenshot()</code>`
  },
  {
    id: "visual_clip_screenshot",
    meta: "Visual 8",
    title: "Clip: ถ่ายภาพเฉพาะพิกัดที่ต้องการ",
    template: `// สถานการณ์: Header banner ของหน้า Dashboard เป็นพื้นหลัง gradient รวมปุ่มหลายตัว ไม่มี data-testid เดี่ยวๆ ให้เจาะจง
// ต้องการถ่ายภาพเฉพาะแถบบนสุด กว้าง 1280 สูง 120 พิกเซล โดยไม่ต้องเทียบทั้งหน้า
// 1. ถ่ายภาพเปรียบเทียบด้วย toHaveScreenshot() พร้อมตั้งค่า clip ระบุ x: 0, y: 0, width: 1280, height: 120
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการใช้ clip...");
      const src = stripComments(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      const hasClip = /clip:\s*\{/.test(src);
      if (!hasClip) {
        throw new Error("ไม่พบ option clip: {...}");
      }
      const hasX = /x:\s*0\b/.test(src);
      const hasY = /y:\s*0\b/.test(src);
      const hasWidth = /width:\s*1280\b/.test(src);
      const hasHeight = /height:\s*120\b/.test(src);
      if (!hasX || !hasY || !hasWidth || !hasHeight) {
        throw new Error("clip ต้องระบุครบทั้ง 4 ค่า: x: 0, y: 0, width: 1280, height: 120");
      }
      log("✓ ถ่ายภาพเฉพาะพิกัดที่ต้องการถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ option clip เป็น object 4 key: x, y (จุดเริ่มถ่ายภาพนับจากมุมซ้ายบน) และ width, height (ขนาดพื้นที่ที่ต้องการ) — ใช้แทน mask หรือ locator เดี่ยวเมื่อพื้นที่ที่ต้องการไม่มี element ที่เจาะจงได้ตรงๆ",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพเฉพาะแถบ header บนสุดของ Dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot({
    clip: { x: 0, y: 0, width: 1280, height: 120 },
  });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>clip</strong> ถ่ายภาพเฉพาะพื้นที่สี่เหลี่ยมตามพิกัดที่กำหนด (x, y, width, height) นับจากมุมซ้ายบนของหน้า — ต่างจาก <code>mask</code> ที่ถ่ายทั้งหน้าแต่ปิดบังบางส่วน, ต่างจาก screenshot เฉพาะ element ที่ต้องมี locator ชี้ element เดี่ยวๆ ได้<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ใช้ clip เมื่อพื้นที่ที่ต้องการเทียบ<strong>ไม่มี element เดี่ยวที่เจาะจงได้ตรงๆ</strong> เช่น แถบพื้นหลัง gradient ที่รวมปุ่มหลายตัวไว้ด้วยกัน หรือต้องการเทียบเฉพาะ "มุมหนึ่งของหน้า" โดยไม่สนใจ DOM structure ว่าจริงๆ แล้วมีกี่ element ซ้อนกันอยู่ตรงนั้น<br/><br/><br/><br/>
    💡 <strong>Mental Model:</strong><br/><code>await expect(page).toHaveScreenshot({</code><br/>
    <code>&nbsp;&nbsp;clip: { x: 0, y: 0, width: 1280, height: 120 },</code><br/>
    <code>});</code><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ข้อควรระวัง: พิกัดเป็นค่าคงที่ (fixed pixel) ไม่ผูกกับ element ใดๆ — ถ้า layout เปลี่ยนตำแหน่ง (เช่น เพิ่ม banner แจ้งเตือนด้านบนทำให้ทุกอย่างเลื่อนลง) พื้นที่ที่ clip ไว้จะไม่ตรงกับส่วนที่ต้องการอีกต่อไป เหมาะกับ element ที่ตำแหน่ง/ขนาดค่อนข้างคงที่เท่านั้น`,
    example: `// clip พื้นที่ footer ที่อยู่ด้านล่างสุดของหน้าจอ (สมมติหน้าจอสูง 900px, footer สูง 80px)
await expect(page).toHaveScreenshot({
  clip: { x: 0, y: 820, width: 1280, height: 80 },
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพเปรียบเทียบด้วย <code>toHaveScreenshot()</code><br/>
    2. ตั้งค่า <code>clip: { x: 0, y: 0, width: 1280, height: 120 }</code>`
  },
  {
    id: "visual_array_path_naming",
    meta: "Visual 9",
    title: "จัดกลุ่ม Baseline เป็นโฟลเดอร์ด้วย Array Path Naming",
    template: `// สถานการณ์: Track นี้มีหลายหน้าที่ต้องเทส visual (dashboard, watchlist, timeline)
// ถ้าตั้งชื่อ baseline แบบ flat ('dashboard-header.png', 'watchlist-header.png', ...) จะสับสนเมื่อไฟล์เยอะขึ้น
// ต้องการจัดกลุ่มไฟล์ baseline ของหน้า dashboard ไว้ในโฟลเดอร์ dashboard/ ชื่อไฟล์ header.png
// 1. ถ่ายภาพเปรียบเทียบด้วย toHaveScreenshot(['dashboard', 'header.png'])
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการตั้งชื่อ Baseline แบบ Array Path...");
      const src = stripComments(code);
      const hasArrayName = /toHaveScreenshot\(\s*\[\s*['"]dashboard['"]\s*,\s*['"]header\.png['"]\s*\]\s*\)/.test(src);
      if (!hasArrayName) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot(['dashboard', 'header.png'])\nต้องส่ง argument แรกเป็น array ของ string ไม่ใช่ string เดี่ยว");
      }
      log("✓ จัดกลุ่ม Baseline เป็นโฟลเดอร์ถูกต้อง");
    },
    hint: "toHaveScreenshot() รับ argument แรกเป็น string เดี่ยว (ชื่อไฟล์ตรงๆ) หรือ array ของ string ก็ได้ — ถ้าส่งเป็น array แต่ละตัวใน array คือหนึ่งระดับของ path โฟลเดอร์ ตัวสุดท้ายในนั้นคือชื่อไฟล์",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพ header ของ dashboard จัดเก็บในโฟลเดอร์ dashboard/', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot(['dashboard', 'header.png']);
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจ จัดกลุ่ม Baseline เป็นโฟลเดอร์ด้วย Array Path Naming และสามารถนำไปประยุกต์ใช้ในการทดสอบระบบได้อย่างถูกต้อง<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>ประโยชน์จริง: เวลา diff ทีละหน้าใน PR review หรือลบ baseline เก่าทั้งหน้าเมื่อ redesign หน้านั้นใหม่ทำได้ง่ายกว่ามาก เพราะไฟล์ที่เกี่ยวข้องกันอยู่ในโฟลเดอร์เดียวกันจริงๆ<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>toHaveScreenshot()</code> รับ argument แรกเป็น<strong>array ของ string</strong>ได้ด้วย — Playwright จะตีความแต่ละตัวใน array เป็นหนึ่งระดับของโฟลเดอร์ ตัวสุดท้ายเป็นชื่อไฟล์ เช่น <code>['dashboard', 'header.png']</code> จะเก็บไฟล์ไว้ที่ <code>__screenshots__/dashboard/header.png</code> แทนที่จะกองรวมเป็น <code>dashboard-header.png</code> ในโฟลเดอร์เดียวกับไฟล์อื่นๆ ทั้งหมด<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> ลำดับใน array มีความหมาย — ตัวสุดท้ายต้องเป็นชื่อไฟล์ที่มีนามสกุลเสมอ (เช่น <code>'header.png'</code>) ถ้าสลับลำดับหรือลืมใส่นามสกุลจะได้ path ผิดโดยไม่มี error เตือนตอน compile และถ้าเปลี่ยนโครงสร้าง array ภายหลัง (เช่น เพิ่มระดับโฟลเดอร์) Playwright จะมองว่าเป็น baseline คนละไฟล์ทันที ทำให้ CI fail เพราะหา baseline เดิมไม่เจอ ต้องรัน <code>--update-snapshots</code> สร้างใหม่`,
    example: `// จัดกลุ่มลึกได้มากกว่า 2 ระดับ เช่น แยกตาม feature แล้วแยกตาม breakpoint อีกชั้น
await expect(page).toHaveScreenshot(['watchlist', 'mobile', 'header.png']);`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพเปรียบเทียบด้วย <code>toHaveScreenshot(['dashboard', 'header.png'])</code>`
  },
  {
    id: "visual_canvas_chart_animation",
    meta: "Visual 10",
    title: "JS/Canvas Chart Animation: จุดที่ animations:'disabled' และ reducedMotion เอาไม่อยู่",
    template: `// สถานการณ์: PortfolioValueChart.jsx จริงของ My-Investment-Port ใช้ react-chartjs-2 (วาดกราฟบน <canvas>)
// พร้อมตั้งค่า animation: { duration: 900, easing: 'easeInOutQuart' } — เล่น animation วาดกราฟทุกครั้งที่ mount
// toHaveScreenshot() ค่า default (animations: 'disabled') หยุดได้แค่ CSS animation/transition/Web Animations เท่านั้น
// กราฟที่วาดผ่าน canvas ด้วย JS ไม่ใช่ CSS เลย จึง "เอาไม่อยู่" — ถ่ายภาพจะได้ frame กลางๆ ของ animation แบบสุ่มทุกครั้งที่รัน
// ทางแก้ที่ทำได้จริงตอนนี้ (ไม่มี hook ให้รอ animation จบในโค้ดนี้): รอเวลาให้นานกว่า duration จริงของ animation (900ms) พร้อม buffer เผื่อเครื่องช้า
// 1. รอ 1200ms (900ms ของ animation + buffer) ด้วย page.waitForTimeout() ก่อนถ่ายภาพ
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการรอ Canvas Chart Animation จบก่อนถ่ายภาพ...");
      const src = stripComments(code);
      const hasWait = /waitForTimeout\(\s*1200\s*\)/.test(src);
      if (!hasWait) {
        throw new Error("ไม่พบ page.waitForTimeout(1200)\nกราฟวาดผ่าน canvas ใช้เวลาจริง 900ms ตาม config ของ chart ต้องรอนานกว่านั้นพร้อม buffer");
      }
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      log("✓ รอ Canvas Chart Animation จบก่อนถ่ายภาพถูกต้อง");
    },
    hint: "บทก่อนหน้าสอนว่า blind wait (waitForTimeout) ผิดเพราะมีสัญญาณจริงให้รอแทนได้ (document.fonts.ready) — แต่กราฟที่วาดด้วย canvas ผ่าน chart library ไม่มี Promise หรือ event มาตรฐานให้รอว่า 'วาดเสร็จแล้ว' เมื่อไม่มีสัญญาณจริงให้ใช้ ตัวเลขที่รอต้องอ้างอิงจาก duration จริงในโค้ด ไม่ใช่เดาตัวเลขลอยๆ",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพกราฟหลัง canvas animation วาดเสร็จ', async ({ page }) => {
  await page.goto('/portfolio-value');
  await page.waitForTimeout(1200);
  await expect(page).toHaveScreenshot();
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>PortfolioValueChart.jsx</code> ของ My-Investment-Port ใช้ <code>react-chartjs-2</code> วาดกราฟผ่าน <code>&lt;canvas&gt;</code> พร้อมตั้งค่าจริง:<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>Real grounding:</strong> <code>PortfolioValueChart.jsx</code> ของ My-Investment-Port ใช้ <code>react-chartjs-2</code> วาดกราฟผ่าน <code>&lt;canvas&gt;</code> พร้อมตั้งค่าจริง:<br/><br/>
    <code>animation: { duration: 900, easing: 'easeInOutQuart' }</code><br/><br/>
    <code>toHaveScreenshot()</code> ค่า default มี <code>animations: 'disabled'</code> อยู่แล้ว (ไม่ต้องตั้งเอง) ซึ่งตามเอกสารของ Playwright หยุดเฉพาะ <strong>CSS animations, CSS transitions และ Web Animations</strong> เท่านั้น — กราฟที่วาดผ่าน canvas ด้วย JavaScript (ไม่ใช่ CSS เลย) จึง<strong>ไม่ถูกหยุด</strong>โดย option นี้ และ <code>reducedMotion: 'reduce'</code> (บทขั้นสูง 2) ก็เช่นกัน เพราะ chart library ต้อง implement เองว่าจะ respect prefers-reduced-motion หรือไม่ ซึ่ง config ที่เห็นในไฟล์จริงไม่มีการเช็คนี้เลย<br/><br/>
    สรุปช่องว่าง: ทั้งสอง option ที่เรียนมาแล้ว "เอาไม่อยู่" กับ canvas animation — เมื่อไม่มี event/Promise มาตรฐานให้รอ (ต่างจาก <code>document.fonts.ready</code> ที่มีจริง) ทางแก้ที่เหลืออยู่คือ<strong>blind wait ที่มีเหตุผลรองรับ</strong>: รอเวลานานกว่า duration จริงที่ระบุในโค้ด (900ms) บวก buffer กันเครื่องช้า (ตัวอย่างนี้ใช้ 1200ms) — ไม่ใช่การเดาตัวเลขลอยๆ แบบบทเรียนก่อนที่สอนว่าผิด เพราะตัวเลขนี้ผูกกับค่าจริงในซอร์สโค้ด ถ้า duration เปลี่ยนในโค้ดจริง ค่าที่รอในเทสต้องอัปเดตตาม<br/><br/>
    ทางแก้ที่ดีกว่าถ้าทำได้ (นอกเหนือขอบเขตของ component นี้): ให้ component เปิด prop/callback แจ้งเมื่อ animation จบ (เช่น Chart.js มี <code>onComplete</code> callback ใน options.animation) แล้วตั้ง <code>data-testid</code> หรือ attribute บอกสถานะ "พร้อมแล้ว" ให้เทสรอ element นั้นแทน blind wait — แต่ต้องแก้ component เพิ่ม ไม่ใช่แค่แก้ฝั่งเทส<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>animation: { duration: 900, easing: 'easeInOutQuart' }</code><br/><br/><br/><code>toHaveScreenshot()</code> ค่า default มี <code>animations: 'disabled'</code> อยู่แล้ว (ไม่ต้องตั้งเอง) ซึ่งตามเอกสารของ Playwright หยุดเฉพาะ <strong>CSS animations, CSS transitions และ Web Animations</strong> เท่านั้น — กราฟที่วาดผ่าน canvas ด้วย JavaScript (ไม่ใช่ CSS เลย) จึง<strong>ไม่ถูกหยุด</strong>โดย option นี้ และ <code>reducedMotion: 'reduce'</code> (บทขั้นสูง 2) ก็เช่นกัน เพราะ chart library ต้อง implement เองว่าจะ respect prefers-reduced-motion หรือไม่ ซึ่ง config ที่เห็นในไฟล์จริงไม่มีการเช็คนี้เลย<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> สรุปช่องว่าง: ทั้งสอง option ที่เรียนมาแล้ว "เอาไม่อยู่" กับ canvas animation — เมื่อไม่มี event/Promise มาตรฐานให้รอ (ต่างจาก <code>document.fonts.ready</code> ที่มีจริง) ทางแก้ที่เหลืออยู่คือ<strong>blind wait ที่มีเหตุผลรองรับ</strong>: รอเวลานานกว่า duration จริงที่ระบุในโค้ด (900ms) บวก buffer กันเครื่องช้า (ตัวอย่างนี้ใช้ 1200ms) — ไม่ใช่การเดาตัวเลขลอยๆ แบบบทเรียนก่อนที่สอนว่าผิด เพราะตัวเลขนี้ผูกกับค่าจริงในซอร์สโค้ด ถ้า duration เปลี่ยนในโค้ดจริง ค่าที่รอในเทสต้องอัปเดตตาม<br/><br/>`,
    example: `// ถ้า component เปิด callback onComplete ไว้แล้ว (สมมติเพิ่มในอนาคต) ควรรอสัญญาณจริงแทน blind wait เสมอ
await page.waitForSelector('[data-chart-ready="true"]');
await expect(page).toHaveScreenshot();`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. รอ <code>page.waitForTimeout(1200)</code> (900ms ของ animation จริง + buffer)<br/>
    2. ถ่ายภาพเปรียบเทียบด้วย <code>toHaveScreenshot()</code>`
  },
  {
    id: "visual_mask_third_party_iframe",
    meta: "Visual 11",
    title: "Mask iframe ของ Third-Party Widget ที่ควบคุมไม่ได้",
    template: `// สถานการณ์: TradingViewWidgetFrame.jsx จริงของ My-Investment-Port ฝัง TradingView chart ผ่าน iframe
// โดย title ของ iframe คือ "TradingView technical analysis for AAPL" (สำหรับ ticker AAPL)
// เนื้อหาข้างใน iframe โหลดจาก script ภายนอก (s3.tradingview.com) เปลี่ยนตามข้อมูลตลาดจริงแบบ real-time ควบคุมไม่ได้จากฝั่งเราเลย
// ถ่ายภาพหน้าที่มี widget นี้ตรงๆ จะ fail แทบทุกครั้งเหมือนปัญหาราคาหุ้นในบทที่ 1 แต่รุนแรงกว่า (ควบคุม/mock เนื้อหาข้างในไม่ได้แม้แต่น้อย)
// 1. mask iframe ทั้งก้อนด้วย page.getByTitle('TradingView technical analysis for AAPL')
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการ mask iframe ของ Third-Party Widget...");
      const src = stripComments(code);
      const hasScreenshot = /toHaveScreenshot\(/.test(src);
      if (!hasScreenshot) {
        throw new Error("ไม่พบการเรียก toHaveScreenshot()");
      }
      const hasMaskOption = /mask:\s*\[/.test(src);
      if (!hasMaskOption) {
        throw new Error("ไม่พบ option mask: [...]");
      }
      const hasGetByTitle = /getByTitle\(\s*['"]TradingView technical analysis for AAPL['"]\s*\)/.test(src);
      if (!hasGetByTitle) {
        throw new Error("mask ต้องเจาะจงไปที่ iframe จริงด้วย page.getByTitle('TradingView technical analysis for AAPL') — title ต้องตรงกับที่ component ส่งมาเป๊ะ (รวม ticker)");
      }
      log("✓ Mask iframe ของ Third-Party Widget ที่ควบคุมไม่ได้ถูกต้อง");
    },
    hint: "iframe เข้าถึงด้วย accessible role ผ่าน title attribute — Playwright มี locator ที่หา element จาก attribute title โดยตรง (getByTitle) ใส่ locator นั้นเข้าไปใน array ของ mask option เหมือนบทที่ 1 ที่ mask element ปกติ",
    solution: `import { test, expect } from '@playwright/test';

test('ถ่ายภาพหน้าที่มี TradingView widget โดย mask iframe ทั้งก้อน', async ({ page }) => {
  await page.goto('/stock/AAPL');
  await expect(page).toHaveScreenshot({
    mask: [page.getByTitle('TradingView technical analysis for AAPL')],
  });
});`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>Real grounding:</strong> <code>TradingViewWidgetFrame.jsx</code> ของ My-Investment-Port ฝัง third-party widget ผ่าน:<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/>บทที่ 1 สอน mask element ที่ "เรารู้ว่าเปลี่ยน" (ราคาหุ้นของเราเอง) แต่กรณีนี้รุนแรงกว่านั้นมาก: <strong>ทั้งก้อน iframe</strong> เป็นของ third party ทั้งหมด ไม่ใช่แค่ตัวเลขเดียว — ราคา, กราฟ, สี, ข้อความ ข้างในเปลี่ยนได้ตลอดเวลาโดยเราไม่รู้ล่วงหน้า วิธีที่ถูกต้องคือ<strong>ปิดบังทั้ง element iframe</strong> ไม่ใช่พยายามไล่ mask ทีละส่วนย่อยข้างในซึ่งเราไม่มีสิทธิ์เข้าถึง DOM ข้างในด้วยซ้ำ (cross-origin content บางกรณี)<br/><br/><br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><code>&lt;iframe title={title} srcDoc={srcDoc} ... /&gt;</code><br/><br/>โดย <code>title</code> ที่ส่งมาจริงจาก <code>TradingViewTA.jsx</code> คือ <code>\`TradingView technical analysis for \${ticker}\`</code> และเนื้อหาข้างใน iframe โหลดผ่าน <code>&lt;script src="https://s3.tradingview.com/..."&gt;</code> — เป็น service ภายนอกที่เราไม่มีทางควบคุมได้เลยว่าจะ render อะไรตอนไหน<br/><br/><br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> <code>title</code> ของ iframe ผูกกับ ticker จริง (<code>\`TradingView technical analysis for \${ticker}\`</code>) ถ้าเปลี่ยนไปเทสหน้าอื่น (เช่น MSFT แทน AAPL) แล้วลืมแก้ selector ตาม ticker ใหม่ <code>getByTitle()</code> จะหา element ไม่เจอทันที นอกจากนี้ถ้า iframe ยังโหลดเนื้อหาจาก third-party ไม่เสร็จตอนถ่ายภาพ bounding box อาจเล็กผิดปกติ ทำให้ mask ปิดไม่ครอบคลุมพื้นที่จริงที่ widget จะขยายไปถึงหลังโหลดเสร็จ`,
    example: `// mask หลาย third-party widget พร้อมกันในหน้าเดียว (เช่น มีทั้ง TA widget และ News widget)
await expect(page).toHaveScreenshot({
  mask: [
    page.getByTitle('TradingView technical analysis for AAPL'),
    page.getByTitle('TradingView news for AAPL'),
  ],
});`,
    task: `จงเขียนสคริปต์ทดสอบให้สมบูรณ์ โดย:<br/>
    1. ถ่ายภาพด้วย <code>toHaveScreenshot()</code><br/>
    2. mask iframe ทั้งก้อนด้วย <code>page.getByTitle('TradingView technical analysis for AAPL')</code>`
  },
  {
    id: "visual_update_baseline_discipline",
    meta: "Visual 12",
    title: "Update Baseline อย่างมีวินัย: --update-snapshots และการ Review Diff ก่อน Merge",
    template: `// สถานการณ์: designer เพิ่งอนุมัติการเปลี่ยนสี background ของปุ่ม primary ทั้งเว็บ (ตั้งใจเปลี่ยนจริง ไม่ใช่บั๊ก)
// ทุก baseline เก่าจะ diff เพราะสีเปลี่ยนไปตามที่ตั้งใจ ต้อง regenerate baseline ใหม่ทั้งหมด "อย่างมีวินัย" ไม่ใช่ลบไฟล์ baseline ทิ้งมั่วๆ
// เก็บคำสั่ง CLI ที่ถูกต้องสำหรับ regenerate baseline ทั้งหมดไว้ในตัวแปร updateCommand
// 1. ประกาศตัวแปร updateCommand เก็บคำสั่ง 'npx playwright test --update-snapshots'
// WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง Update Baseline...");
      const src = stripComments(code);
      const hasCommand = /updateCommand\s*=\s*['"]npx playwright test --update-snapshots['"]/.test(src);
      if (!hasCommand) {
        throw new Error("ไม่พบตัวแปร updateCommand ที่เก็บคำสั่ง 'npx playwright test --update-snapshots'");
      }
      log("✓ คำสั่ง Update Baseline ถูกต้อง");
    },
    hint: "Playwright มี flag บรรทัดคำสั่งเฉพาะสำหรับ regenerate baseline ทั้งหมดในคำสั่งเดียว รูปแบบคือ npx playwright test ตามด้วย flag ที่สื่อความหมายว่า 'อัปเดต snapshot'",
    solution: `const updateCommand = 'npx playwright test --update-snapshots';`,
    theory: `🎯 <strong>เป้าหมาย (Goal):</strong> เข้าใจแนวคิดและหลักการของ <strong>เมื่อไหร่ควร Update Baseline:</strong> diff ที่เกิดจากการเปลี่ยนแปลงที่<strong>ตั้งใจ</strong> (designer อนุมัติสี/layout ใหม่) ต้อง regenerate baseline ให้ตรงกับดีไซน์ใหม่ ต่างจาก diff ที่เกิดจากบั๊กจริงซึ่งต้องแก้โค้ด ไม่ใช่แก้ baseline<br/><br/>
    ⚖️ <strong>หลักการและจุดสำคัญ (Key Concepts):</strong><br/><strong>เมื่อไหร่ควร Update Baseline:</strong> diff ที่เกิดจากการเปลี่ยนแปลงที่<strong>ตั้งใจ</strong> (designer อนุมัติสี/layout ใหม่) ต้อง regenerate baseline ให้ตรงกับดีไซน์ใหม่ ต่างจาก diff ที่เกิดจากบั๊กจริงซึ่งต้องแก้โค้ด ไม่ใช่แก้ baseline<br/><br/>
    คำสั่ง <code>npx playwright test --update-snapshots</code> รัน test ทั้งหมดแล้วเขียนทับไฟล์ baseline เดิมด้วยภาพที่ถ่ายได้ล่าสุดทันที — สะดวกแต่<strong>อันตรายถ้าใช้พร่ำเพรื่อ</strong>: ถ้ามีบั๊ก visual จริงซ้อนอยู่ด้วยพร้อมกับการเปลี่ยนแปลงที่ตั้งใจ คำสั่งนี้จะ "กลืน" บั๊กนั้นเข้าไปเป็น baseline ใหม่โดยไม่มีใครรู้ตัว<br/><br/>
    <strong>วินัยที่ต้องมี:</strong> baseline ที่ regenerate ใหม่ต้องถูก<strong>commit เป็นไฟล์ image และ review ใน PR</strong> เหมือน code diff ทั่วไป — reviewer เห็นภาพ before/after จริงก่อน approve ไม่ใช่รัน <code>--update-snapshots</code> แล้ว commit ทันทีโดยไม่มีใครดูภาพเลย เพราะไฟล์ .png ไม่สามารถ code-review แบบอ่าน diff ข้อความได้ ต้อง<strong>ดูภาพจริง</strong>เท่านั้นถึงจะรู้ว่าเปลี่ยนถูกต้องตามที่ตั้งใจหรือไม่<br/><br/>
    💡 <strong>Mental Model & Syntax:</strong><br/><strong>วินัยที่ต้องมี:</strong> baseline ที่ regenerate ใหม่ต้องถูก<strong>commit เป็นไฟล์ image และ review ใน PR</strong> เหมือน code diff ทั่วไป — reviewer เห็นภาพ before/after จริงก่อน approve ไม่ใช่รัน <code>--update-snapshots</code> แล้ว commit ทันทีโดยไม่มีใครดูภาพเลย เพราะไฟล์ .png ไม่สามารถ code-review แบบอ่าน diff ข้อความได้ ต้อง<strong>ดูภาพจริง</strong>เท่านั้นถึงจะรู้ว่าเปลี่ยนถูกต้องตามที่ตั้งใจหรือไม่<br/><br/>
    🚨 <strong>ข้อควรระวัง (Common Pitfall):</strong> คำสั่ง <code>npx playwright test --update-snapshots</code> รัน test ทั้งหมดแล้วเขียนทับไฟล์ baseline เดิมด้วยภาพที่ถ่ายได้ล่าสุดทันที — สะดวกแต่<strong>อันตรายถ้าใช้พร่ำเพรื่อ</strong>: ถ้ามีบั๊ก visual จริงซ้อนอยู่ด้วยพร้อมกับการเปลี่ยนแปลงที่ตั้งใจ คำสั่งนี้จะ "กลืน" บั๊กนั้นเข้าไปเป็น baseline ใหม่โดยไม่มีใครรู้ตัว<br/><br/>`,
    example: `// update baseline เฉพาะไฟล์/เทสเดียว แทนทั้งหมด (ปลอดภัยกว่าเมื่อรู้ชัดว่าเปลี่ยนแค่จุดเดียว)
const updateSingleCommand = 'npx playwright test dashboard.spec.ts --update-snapshots';`,
    task: `จงเขียนโค้ดให้สมบูรณ์ โดย:<br/>
    1. ประกาศตัวแปร <code>updateCommand</code> เก็บคำสั่ง <code>'npx playwright test --update-snapshots'</code>`
  }
];

// Application state

const PREFIX = 'pw';

// Migration map from standalone Visual Regression track to unified Playwright track
const VISUAL_MIGRATION_IDS = [
  'intro',
  'masking_dynamic_content',
  'responsive_visual_check',
  'full_page_screenshot',
  'threshold_tuning',
  'combined_mask_and_threshold',
  'flaky_font_animation_fix',
  'clip_screenshot',
  'array_path_naming',
  'canvas_chart_animation',
  'mask_third_party_iframe',
  'update_baseline_discipline'
];

function migrateVisualRegressionProgress() {
  if (typeof localStorage === 'undefined') return;
  try {
    for (const oldId of VISUAL_MIGRATION_IDS) {
      const newId = 'visual_' + oldId;
      const oldCompletedKey = 'visual_course_completed_' + oldId;
      const newCompletedKey = PREFIX + '_course_completed_' + newId;
      if (localStorage.getItem(oldCompletedKey) === 'true' && !localStorage.getItem(newCompletedKey)) {
        localStorage.setItem(newCompletedKey, 'true');
      }
      const oldCodeKey = 'visual_sandbox_code_' + oldId;
      const newCodeKey = PREFIX + '_sandbox_code_' + newId;
      const oldCode = localStorage.getItem(oldCodeKey);
      if (oldCode && !localStorage.getItem(newCodeKey)) {
        localStorage.setItem(newCodeKey, oldCode);
      }
    }
  } catch (e) {
    // Non-blocking in restricted storage
  }
}
migrateVisualRegressionProgress();

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
  showTrackCertificate('Playwright UI Testing');
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
