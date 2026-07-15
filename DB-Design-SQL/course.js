// Database Design & SQL Interactive Coding Playground Data and Logic
// Schema models the real Holdings domain from My-Investment-Port (ticker/broker/shares/avgCost/sector
// fields all real — see src/pages/HoldingsPage.jsx, src/data/raw/webull_holdings.js). The tables
// themselves are seeded mock data (My-Investment-Port stores this in Google Sheets, not SQL) run for
// real via AlaSQL (in-browser JS SQL engine) — every query in this track actually executes, it is not
// regex-matched like the other tracks, because SQL has too many equally-correct phrasings for regex.

// Seed a fresh, deterministic dataset before every validate() run so earlier DELETE/INSERT
// exercises never leak state into the next lesson.
function resetDatabase() {
  try { alasql('DROP TABLE IF EXISTS holdings'); } catch (e) {}
  try { alasql('DROP TABLE IF EXISTS brokers'); } catch (e) {}
  try { alasql('DROP TABLE IF EXISTS watchlist'); } catch (e) {}

  alasql('CREATE TABLE holdings (ticker STRING, broker STRING, shares NUMBER, avgCost NUMBER, sector STRING)');
  alasql(`INSERT INTO holdings (ticker, broker, shares, avgCost, sector) VALUES
    ('AMZN','Webull',50,145.20,'Consumer Discretionary'),
    ('GOOGL','Webull',30,138.50,'Technology'),
    ('ROBO','Webull',100,42.10,'Technology'),
    ('GRID','Webull',80,55.30,'Utilities'),
    ('QQQI','Webull',60,48.75,'ETF'),
    ('AAPL','Dime',40,178.00,'Technology'),
    ('MSFT','Dime',25,320.50,'Technology'),
    ('TLT','Dime',70,92.15,'Bonds')`);

  alasql('CREATE TABLE brokers (name STRING, displayName STRING, country STRING)');
  alasql(`INSERT INTO brokers (name, displayName, country) VALUES
    ('Webull','Webull Financial','US'),
    ('Dime','Dime Technologies','US')`);
}

// Run user SQL for real; wrap engine errors into a readable message
function runQuery(code) {
  try {
    return alasql(code);
  } catch (err) {
    throw new Error("SQL Error: " + err.message);
  }
}

const LESSONS = [
  {
    id: "intro",
    meta: "บทนำ",
    title: "SELECT พื้นฐาน: ดึงข้อมูล Holdings ตาม Broker",
    template: `-- ตาราง holdings มีคอลัมน์: ticker, broker, shares, avgCost, sector
-- 1. ดึงข้อมูล ticker และ shares ของ Holdings ทั้งหมดที่อยู่กับ Broker 'Webull'
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 กำลังรันคำสั่ง SQL จริงผ่าน AlaSQL...");
      resetDatabase();
      const result = runQuery(code);
      if (!Array.isArray(result)) {
        throw new Error("คำสั่งนี้ต้องเป็น SELECT ที่คืนค่าเป็นแถวข้อมูล\nตัวอย่าง: SELECT ticker, shares FROM holdings WHERE broker = 'Webull';");
      }
      if (result.length !== 5) {
        throw new Error(`คาดว่าจะได้ 5 แถว (Holdings ทั้งหมดของ Webull) แต่ได้ ${result.length} แถว\nตัวอย่าง: SELECT ticker, shares FROM holdings WHERE broker = 'Webull';`);
      }
      const amzn = result.find(r => r.ticker === 'AMZN');
      if (!amzn || Number(amzn.shares) !== 50) {
        throw new Error("ไม่พบแถว AMZN ที่มี shares = 50 ในผลลัพธ์ — ตรวจสอบเงื่อนไข WHERE broker = 'Webull' อีกครั้ง");
      }
      log("✓ ได้ผลลัพธ์ 5 แถวถูกต้อง ตรงกับ Holdings ทั้งหมดของ Webull");
    },
    hint: "ใช้ SELECT ticker, shares FROM holdings WHERE broker = 'Webull';",
    solution: `SELECT ticker, shares FROM holdings WHERE broker = 'Webull';`,
    theory: `<strong>SQL (Structured Query Language)</strong> คือภาษามาตรฐานสำหรับดึง/แก้ไขข้อมูลในฐานข้อมูลเชิงสัมพันธ์ (Relational Database) — ทักษะที่ QA ใช้แทบทุกวันเวลาต้องยืนยันว่าข้อมูลที่ถูกต้องจริงในฐานข้อมูล ไม่ใช่แค่ "ดูเหมือนถูกต้อง" บนหน้าจอ UI<br/><br/>
    บทเรียนนี้จำลองตาราง <code>holdings</code> ขึ้นจากโครงสร้างข้อมูลจริงในโปรเจก My-Investment-Port (คอลัมน์ <code>ticker</code>, <code>broker</code>, <code>shares</code>, <code>avgCost</code>, <code>sector</code> ทั้งหมดคือ field จริงที่ใช้ใน <code>HoldingsPage.jsx</code>) — ของจริงเก็บอยู่ใน Google Sheet ไม่ใช่ SQL DB แต่โครงสร้างข้อมูลเหมือนกันเป๊ะ<br/><br/>
    <strong>คำสั่งพื้นฐาน:</strong><br/>
    1. <code>SELECT column1, column2</code> — เลือกเฉพาะคอลัมน์ที่ต้องการ (ไม่ต้องดึงทุกคอลัมน์ด้วย <code>*</code> ถ้าไม่จำเป็น)<br/>
    2. <code>FROM table_name</code> — ระบุตารางต้นทาง<br/>
    3. <code>WHERE condition</code> — กรองเฉพาะแถวที่ตรงเงื่อนไข<br/><br/>
    <strong>หมายเหตุด้านเทคนิค:</strong> Sandbox นี้รันคำสั่ง SQL ของคุณ<strong>จริง</strong>ผ่าน <a href="https://alasql.org" target="_blank" style="color:inherit;">AlaSQL</a> (SQL engine แบบ JavaScript ล้วนที่รันในเบราว์เซอร์) ไม่ใช่การเช็ค regex บนข้อความเหมือน track อื่น — เขียน SQL ถูกวิธีไหนก็ได้ ขอแค่ได้ผลลัพธ์ถูกต้อง`,
    example: `-- ตัวอย่างดึงข้อมูลเฉพาะคอลัมน์ที่ต้องการจาก sector หนึ่งๆ
SELECT ticker, broker FROM holdings WHERE sector = 'Technology';`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. ดึง <code>ticker</code> และ <code>shares</code> จากตาราง <code>holdings</code> เฉพาะแถวที่ <code>broker = 'Webull'</code>`
  },
  {
    id: "filtering_sorting",
    meta: "บทที่ 1",
    title: "Filter และเรียงลำดับ: หา Holdings มูลค่าสูงสุด",
    template: `-- 1. หา Holdings ที่มูลค่ารวม (shares * avgCost) เกิน 5000 ดอลลาร์ เรียงจากมูลค่ามากไปน้อย
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ WHERE + ORDER BY...");
      resetDatabase();
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 4) {
        throw new Error(`คาดว่าจะได้ 4 แถว (มูลค่ารวมเกิน 5000) แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว\nตัวอย่าง: SELECT ... WHERE shares * avgCost > 5000 ORDER BY shares * avgCost DESC;`);
      }
      if (result[0].ticker !== 'MSFT') {
        throw new Error(`แถวแรกควรเป็น MSFT (มูลค่าสูงสุด 8012.5) แต่ได้ ${result[0].ticker} — ตรวจสอบว่าใช้ ORDER BY ... DESC หรือยัง`);
      }
      log("✓ Filter และเรียงลำดับถูกต้อง (MSFT มาก่อนเพราะมูลค่ารวมสูงสุด)");
    },
    hint: "ใช้ SELECT ticker, shares, avgCost FROM holdings WHERE shares * avgCost > 5000 ORDER BY shares * avgCost DESC;",
    solution: `SELECT ticker, shares, avgCost FROM holdings WHERE shares * avgCost > 5000 ORDER BY shares * avgCost DESC;`,
    theory: `เงื่อนไขใน <code>WHERE</code> ไม่จำเป็นต้องเทียบกับ column ตรงๆ เท่านั้น — ใช้นิพจน์คำนวณได้เลย เช่น <code>shares * avgCost > 5000</code> (มูลค่ารวมของแต่ละ Holding) กรองก่อนแล้วค่อยเรียงด้วย <code>ORDER BY</code><br/><br/>
    <strong>ORDER BY</strong> ค่า default คือ <code>ASC</code> (น้อยไปมาก) ต้องระบุ <code>DESC</code> เองถ้าต้องการมากไปน้อย และเรียงตามนิพจน์คำนวณได้เหมือนกับที่ใช้ใน WHERE (ไม่จำเป็นต้องมี column นี้ปรากฏใน SELECT ก็เรียงได้)<br/><br/>
    ในงาน QA จริง เทคนิคนี้ใช้บ่อยมากตอนตรวจสอบ "รายการ Top N" (เช่น หุ้นที่ถือมูลค่าสูงสุด 5 อันดับ) ว่า Backend/Report คำนวณและเรียงลำดับถูกต้องตรงกับที่ควรจะเป็นหรือไม่`,
    example: `-- ตัวอย่างเรียงจากน้อยไปมาก (ค่า default ไม่ต้องระบุ ASC ก็ได้)
SELECT ticker, avgCost FROM holdings ORDER BY avgCost;`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. ดึง Holdings ที่ <code>shares * avgCost > 5000</code><br/>
    2. เรียงผลลัพธ์ด้วย <code>ORDER BY shares * avgCost DESC</code> (มูลค่ามากไปน้อย)`
  },
  {
    id: "schema_design",
    meta: "บทที่ 2",
    title: "Database Design: PRIMARY KEY ป้องกันข้อมูลซ้ำ",
    template: `-- 1. สร้างตาราง watchlist ใหม่ มีคอลัมน์ ticker (STRING, PRIMARY KEY) และ note (STRING)
-- WRITE YOUR CODE HERE


-- 2. เพิ่มแถวใหม่: ticker = 'TSLA', note = 'รอราคาย่อ'
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการออกแบบตารางและ Insert ข้อมูล...");
      resetDatabase();
      runQuery(code);
      let result;
      try {
        result = alasql("SELECT * FROM watchlist");
      } catch (err) {
        throw new Error("ไม่พบตาราง watchlist — ตรวจสอบว่าสร้างด้วย CREATE TABLE watchlist (...) หรือยัง");
      }
      if (result.length !== 1) {
        throw new Error(`คาดว่าตาราง watchlist จะมี 1 แถว แต่มี ${result.length} แถว`);
      }
      if (result[0].ticker !== 'TSLA' || result[0].note !== 'รอราคาย่อ') {
        throw new Error("ข้อมูลในตาราง watchlist ไม่ตรงกับที่คาดไว้ (ticker='TSLA', note='รอราคาย่อ')");
      }
      log("✓ สร้างตาราง watchlist พร้อม PRIMARY KEY และ Insert ข้อมูลถูกต้อง");
    },
    hint: "ใช้ CREATE TABLE watchlist (ticker STRING PRIMARY KEY, note STRING); แล้ว INSERT INTO watchlist VALUES ('TSLA', 'รอราคาย่อ');",
    solution: `CREATE TABLE watchlist (ticker STRING PRIMARY KEY, note STRING);
INSERT INTO watchlist VALUES ('TSLA', 'รอราคาย่อ');`,
    theory: `<strong>Database Design</strong> คือการตัดสินใจว่าข้อมูลควรแบ่งเป็นกี่ตาราง แต่ละตารางมีคอลัมน์อะไรบ้าง และอะไรคือ "กุญแจ" ที่ทำให้แต่ละแถวไม่ซ้ำกัน<br/><br/>
    <strong>PRIMARY KEY</strong> คือคอลัมน์ (หรือกลุ่มคอลัมน์) ที่รับประกันว่าไม่มีค่าซ้ำในตาราง — ในตัวอย่างนี้ <code>ticker</code> เป็น PRIMARY KEY ของ <code>watchlist</code> เพราะเราต้องการห้ามไม่ให้ตั๋วเดียวกันถูกเพิ่มซ้ำสองครั้งโดยไม่ตั้งใจ<br/><br/>
    ทำไมต้องแยกเป็นตารางต่างหากแทนที่จะยัดทุกอย่างลงตารางเดียว: ในบทถัดไป (JOIN) เราจะเห็นตาราง <code>holdings</code> กับ <code>brokers</code> ที่แยกจากกัน — เหตุผลคือถ้าเก็บชื่อเต็มของ Broker ซ้ำในทุกแถวของ <code>holdings</code> (เช่น "Webull Financial" ซ้ำ 5 ครั้ง) แล้ว Broker เปลี่ยนชื่อ ต้องไปแก้ทุกแถว เสี่ยงพลาดตกหล่น การแยกเป็นตาราง <code>brokers</code> ต่างหากทำให้แก้ที่เดียวจบ (หลักการนี้เรียกว่า <strong>Normalization</strong>)`,
    example: `-- ตัวอย่างตารางที่มี PRIMARY KEY แบบผสมหลายคอลัมน์ (composite key)
CREATE TABLE holdings_v2 (ticker STRING, broker STRING, shares NUMBER, PRIMARY KEY (ticker, broker));
-- ป้องกันไม่ให้ ticker เดียวกัน + broker เดียวกัน ถูกเพิ่มซ้ำ (แต่ ticker เดียวกันคนละ broker เพิ่มได้)`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. สร้างตาราง <code>watchlist</code> ด้วยคอลัมน์ <code>ticker</code> (STRING, PRIMARY KEY) และ <code>note</code> (STRING)<br/>
    2. เพิ่มแถว <code>ticker = 'TSLA'</code>, <code>note = 'รอราคาย่อ'</code>`
  },
  {
    id: "joins",
    meta: "บทที่ 3",
    title: "JOIN: รวมข้อมูลจาก 2 ตารางเข้าด้วยกัน",
    template: `-- ตาราง brokers มีคอลัมน์: name, displayName, country
-- 1. ดึง ticker, broker และชื่อเต็มของโบรกเกอร์ (displayName) เฉพาะแถวที่ ticker = 'AMZN'
--    โดย JOIN ตาราง holdings กับ brokers (holdings.broker = brokers.name)
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบคำสั่ง JOIN...");
      resetDatabase();
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 1) {
        throw new Error(`คาดว่าจะได้ 1 แถว (AMZN) แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว\nตัวอย่าง: SELECT h.ticker, h.broker, b.displayName FROM holdings h JOIN brokers b ON h.broker = b.name WHERE h.ticker = 'AMZN';`);
      }
      const values = Object.values(result[0]).map(v => String(v));
      if (!values.includes('Webull Financial')) {
        throw new Error("ผลลัพธ์ไม่มีค่า 'Webull Financial' — ตรวจสอบว่า JOIN ด้วยเงื่อนไข ON h.broker = b.name ถูกต้องหรือไม่ และดึงคอลัมน์ b.displayName มาด้วย");
      }
      log("✓ JOIN สำเร็จ ได้ displayName 'Webull Financial' ถูกต้อง");
    },
    hint: "ใช้ SELECT h.ticker, h.broker, b.displayName FROM holdings h JOIN brokers b ON h.broker = b.name WHERE h.ticker = 'AMZN';",
    solution: `SELECT h.ticker, h.broker, b.displayName FROM holdings h JOIN brokers b ON h.broker = b.name WHERE h.ticker = 'AMZN';`,
    theory: `<strong>JOIN</strong> คือการรวมแถวจาก 2 ตารางเข้าด้วยกันโดยอาศัยคอลัมน์ที่เชื่อมโยงกัน (Foreign Key) — ต่อยอดจากบทก่อนหน้าที่แยก <code>holdings</code> กับ <code>brokers</code> ออกจากกันตามหลัก Normalization ตอนนี้เราต้องการ "เอาข้อมูลทั้งสองฝั่งมาต่อกัน" เพื่อแสดงผล<br/><br/>
    รูปแบบ: <code>FROM table1 alias1 JOIN table2 alias2 ON alias1.col = alias2.col</code> — ใช้ <code>alias</code> (เช่น <code>h</code>, <code>b</code>) เพื่อย่อชื่อตารางยาวๆ และแก้ปัญหาตอนสองตารางมีคอลัมน์ชื่อซ้ำกัน (เช่นถ้าทั้งคู่มีคอลัมน์ <code>name</code> ต้องระบุว่าเอา <code>h.name</code> หรือ <code>b.name</code>)<br/><br/>
    <code>ON h.broker = b.name</code> คือเงื่อนไขการจับคู่: แถว holdings ที่มี <code>broker = 'Webull'</code> จะจับคู่กับแถว brokers ที่มี <code>name = 'Webull'</code> — ถ้าไม่มีแถวไหนใน brokers ตรงกับค่านั้นเลย (Foreign Key ที่ไม่มีจริง) แถวนั้นจะหายไปจากผลลัพธ์ (INNER JOIN ค่า default) ซึ่งเป็นบั๊กที่พบบ่อยเวลาข้อมูลอ้างอิงไม่ตรงกัน`,
    example: `-- ตัวอย่าง JOIN แล้วกรองด้วยคอลัมน์จากตารางที่ join มา
SELECT h.ticker, b.country FROM holdings h JOIN brokers b ON h.broker = b.name WHERE b.country = 'US';`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. JOIN ตาราง <code>holdings</code> กับ <code>brokers</code> ด้วยเงื่อนไข <code>holdings.broker = brokers.name</code><br/>
    2. ดึง <code>ticker</code>, <code>broker</code>, <code>displayName</code> เฉพาะแถว <code>ticker = 'AMZN'</code>`
  },
  {
    id: "aggregation",
    meta: "บทที่ 4",
    title: "Aggregate Function: รวมมูลค่าพอร์ตต่อ Broker",
    template: `-- 1. รวมมูลค่าพอร์ต (shares * avgCost) ของแต่ละ Broker ตั้งชื่อคอลัมน์ผลลัพธ์ว่า totalValue
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ GROUP BY + Aggregate Function...");
      resetDatabase();
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 2) {
        throw new Error(`คาดว่าจะได้ 2 แถว (Webull, Dime) แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว\nตัวอย่าง: SELECT broker, SUM(shares * avgCost) AS totalValue FROM holdings GROUP BY broker;`);
      }
      const sum = result.reduce((a, r) => a + Number(r.totalValue || 0), 0);
      if (Math.abs(sum - 44557) > 0.5) {
        throw new Error(`ผลรวม totalValue ของทั้งสอง Broker ควรเป็น 44557 แต่ได้ ${sum}\nตรวจสอบว่าใช้ SUM(shares * avgCost) AS totalValue และ GROUP BY broker ถูกต้องหรือไม่`);
      }
      log("✓ GROUP BY + SUM ถูกต้อง (Webull 22974 + Dime 21583 = 44557)");
    },
    hint: "ใช้ SELECT broker, SUM(shares * avgCost) AS totalValue FROM holdings GROUP BY broker;",
    solution: `SELECT broker, SUM(shares * avgCost) AS totalValue FROM holdings GROUP BY broker;`,
    theory: `<strong>GROUP BY</strong> จับกลุ่มแถวที่มีค่าคอลัมน์เดียวกัน (เช่น <code>broker</code>) แล้วให้ <strong>Aggregate Function</strong> (<code>SUM</code>, <code>COUNT</code>, <code>AVG</code>, <code>MAX</code>, <code>MIN</code>) คำนวณสรุปทีละกลุ่ม<br/><br/>
    ข้อควรระวังสำคัญ: ทุกคอลัมน์ใน <code>SELECT</code> ที่ไม่ใช่ Aggregate Function ต้องอยู่ใน <code>GROUP BY</code> ด้วย (เช่น <code>SELECT broker, SUM(...)</code> ต้องมี <code>GROUP BY broker</code>) ไม่งั้นฐานข้อมูลจะไม่รู้ว่าจะเอาค่า <code>broker</code> ตัวไหนมาแสดงในแต่ละกลุ่ม<br/><br/>
    ในงาน QA การทดสอบ Report/Dashboard ที่สรุปยอดรวม (เช่น มูลค่าพอร์ตรวมต่อ Broker, จำนวนรายการต่อสถานะ) มักต้องเขียน SQL แบบนี้เพื่อ "คำนวณเลขที่ถูกต้องแบบอิสระ" มาเทียบกับตัวเลขที่ระบบแสดงผล ถ้าไม่ตรงกันคือเจอบั๊กในโค้ดคำนวณจริง`,
    example: `-- ตัวอย่างนับจำนวน Holdings และหาค่าเฉลี่ยต้นทุนต่อ sector
SELECT sector, COUNT(*) AS numHoldings, AVG(avgCost) AS avgPrice FROM holdings GROUP BY sector;`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. หา <code>SUM(shares * avgCost)</code> ตั้งชื่อคอลัมน์ผลลัพธ์ว่า <code>totalValue</code><br/>
    2. จับกลุ่มด้วย <code>GROUP BY broker</code>`
  },
  {
    id: "data_integrity_check",
    meta: "บทที่ 5",
    title: "Data Integrity Check: ยืนยันว่าลบข้อมูลจริงหลัง Action",
    template: `-- 1. ลบ Holdings ที่ ticker = 'QQQI' และ broker = 'Webull'
-- WRITE YOUR CODE HERE


-- 2. ยืนยันว่าลบสำเร็จจริง ด้วยการนับจำนวนแถวที่เหลือของ ticker 'QQQI' (ตั้งชื่อคอลัมน์ผลลัพธ์ว่า cnt)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ DELETE + การยืนยันผลลัพธ์...");
      resetDatabase();
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length < 1) {
        throw new Error("ต้องมีอย่างน้อย 2 คำสั่ง (DELETE ตามด้วย SELECT COUNT) คั่นด้วย ;\nตัวอย่าง: DELETE FROM holdings WHERE ticker = 'QQQI' AND broker = 'Webull';\nSELECT COUNT(*) AS cnt FROM holdings WHERE ticker = 'QQQI';");
      }
      const last = result[result.length - 1];
      if (!Array.isArray(last) || last.length !== 1 || Number(last[0].cnt) !== 0) {
        throw new Error(`คำสั่งสุดท้ายต้องเป็น SELECT COUNT(*) AS cnt ที่ได้ผลลัพธ์ cnt = 0 (ไม่มี QQQI เหลืออยู่แล้ว)\nได้: ${JSON.stringify(last)}`);
      }
      log("✓ ลบข้อมูลจริงสำเร็จ และยืนยันด้วย COUNT(*) = 0 ถูกต้อง");
    },
    hint: "ใช้ DELETE FROM holdings WHERE ticker = 'QQQI' AND broker = 'Webull'; แล้วตามด้วย SELECT COUNT(*) AS cnt FROM holdings WHERE ticker = 'QQQI';",
    solution: `DELETE FROM holdings WHERE ticker = 'QQQI' AND broker = 'Webull';
SELECT COUNT(*) AS cnt FROM holdings WHERE ticker = 'QQQI';`,
    theory: `ในโค้ดจริงของ <code>HoldingsPage.jsx</code> ฟังก์ชัน <code>confirmDelete()</code> ทำงานเป็น 2 ขั้นตอนแยกกัน:<br/><br/>
    <code>// Optimistic update: remove immediately from UI<br/>
    addOptimisticHolding({ type: 'delete', ticker: pendingDelete, broker: ... });<br/><br/>
    // Real update: persist deletion<br/>
    onUpdate(getLatestHoldings().filter(h => !(h.ticker === pendingDelete && ...)));</code><br/><br/>
    สังเกตคำว่า "Optimistic update" — UI จะเอาแถวออกจากหน้าจอ<strong>ทันที</strong>โดยไม่รอผลจริงจาก Backend/storage เลย ถ้าขั้นตอน "Real update: persist deletion" ล้มเหลวเงียบๆ (เช่น network error, permission error) <strong>ผู้ใช้จะเห็นว่าแถวหายไปแล้ว ทั้งที่ข้อมูลจริงยังอยู่</strong> — นี่คือเหตุผลว่าทำไม Playwright test ที่เช็คแค่ "UI ไม่แสดงแถวนี้แล้ว" ถึงไม่พอ<br/><br/>
    <strong>Data Integrity Check</strong> คือการยืนยันที่ชั้นข้อมูลจริง (Database) แยกต่างหากจากการเช็ค UI — ยิ่งเป็น action ที่ทำลายข้อมูล (DELETE) ยิ่งควรเช็คสองชั้น: (1) UI อัปเดตถูกต้อง (Playwright) และ (2) ข้อมูลหายไปจริงจาก storage (SQL/API เช็คตรงๆ)`,
    example: `-- ตัวอย่างยืนยันว่า UPDATE เปลี่ยนค่าจริง ไม่ใช่แค่ไม่ error
UPDATE holdings SET shares = 999 WHERE ticker = 'GOOGL';
SELECT shares FROM holdings WHERE ticker = 'GOOGL';
-- ต้องได้ shares = 999 กลับมา ไม่ใช่แค่ไม่มี error ตอนรัน UPDATE`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. ลบแถวที่ <code>ticker = 'QQQI'</code> และ <code>broker = 'Webull'</code><br/>
    2. ยืนยันด้วย <code>SELECT COUNT(*) AS cnt</code> ว่าไม่มี QQQI เหลืออยู่แล้ว (<code>cnt = 0</code>)`
  },
  {
    id: "null_handling",
    meta: "บทที่ 6",
    title: "NULL Handling: ทำไม column = NULL ถึงไม่เจออะไรเลย",
    template: `-- หมายเหตุ: มีแถวชื่อ NEWCO ที่ sector ยังไม่ได้จัดหมวดหมู่ (เป็น NULL) เตรียมไว้ให้แล้ว
-- 1. ดึง ticker ของ Holdings ทั้งหมดที่ยังไม่มี sector
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการจัดการค่า NULL...");
      resetDatabase();
      alasql("INSERT INTO holdings (ticker, broker, shares, avgCost, sector) VALUES ('NEWCO','Webull',10,100,NULL)");
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error("ได้ผลลัพธ์ว่างเปล่า — ถ้าเขียน WHERE sector = NULL จะไม่มีวันเจอแถวไหนเลย (แม้แถวนั้นจะมี sector เป็น NULL จริงก็ตาม) เพราะ '= NULL' ไม่ใช่ตรรกะเปรียบเทียบที่ใช้ได้ใน SQL ต้องใช้ WHERE sector IS NULL แทน");
      }
      if (result.length !== 1 || result[0].ticker !== 'NEWCO') {
        throw new Error(`คาดว่าจะได้แถวเดียวคือ NEWCO แต่ได้: ${JSON.stringify(result)}`);
      }
      log("✓ ใช้ IS NULL เจอแถว NEWCO ที่ยังไม่มี sector ถูกต้อง");
    },
    hint: "ใช้ SELECT ticker FROM holdings WHERE sector IS NULL; (ห้ามใช้ = NULL เพราะจะไม่เจออะไรเลย)",
    solution: `SELECT ticker FROM holdings WHERE sector IS NULL;`,
    theory: `<strong>NULL</strong> ไม่ใช่ค่า "ว่างเปล่า" หรือ "ศูนย์" — มันแปลว่า "ไม่รู้ค่า/ไม่มีค่า" ในทางตรรกะของ SQL การเปรียบเทียบใดๆ กับ NULL ด้วย <code>=</code> จะได้ผลลัพธ์เป็น "ไม่รู้" (ไม่ใช่ true หรือ false) เสมอ — แปลว่า <code>WHERE sector = NULL</code> จะ<strong>ไม่มีวันคืนแถวไหนเลย แม้แถวนั้นจะมี sector เป็น NULL จริงๆ ก็ตาม</strong><br/><br/>
    ต้องใช้ตัวดำเนินการพิเศษแทน:<br/>
    1. <code>WHERE column IS NULL</code> — หาแถวที่ไม่มีค่า<br/>
    2. <code>WHERE column IS NOT NULL</code> — หาแถวที่มีค่าแล้ว<br/><br/>
    บั๊กนี้พบบ่อยมากในโค้ดที่เขียนโดยคนไม่คุ้น SQL (เอา logic แบบภาษาโปรแกรมทั่วไปมาใช้ เช่น JavaScript <code>x === null</code>) แล้วงงว่าทำไม query ที่ "ดูถูกต้อง" ถึงไม่คืนผลลัพธ์ที่ควรจะมี — เจอบ่อยตอนเขียน Test Data verification ที่ต้องเช็คว่า field ไหนยังไม่ได้กรอกข้อมูล (เช่น ผู้ใช้ยังไม่จัดหมวดหมู่ sector ให้ Holding ตัวใหม่)`,
    example: `-- ตัวอย่างรวม IS NULL กับเงื่อนไขอื่น
SELECT ticker FROM holdings WHERE sector IS NULL AND broker = 'Webull';`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. ดึง <code>ticker</code> ของ Holdings ที่ <code>sector IS NULL</code> (ยังไม่ได้จัดหมวดหมู่)`
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
  const savedCode = localStorage.getItem(`sql_sandbox_code_${lesson.id}`);
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
  return localStorage.getItem('sql_course_completed_' + lessonId) === 'true';
}

// Mark lesson completed
function setLessonCompleted(lessonId) {
  const alreadyDone = isLessonCompleted(lessonId);
  localStorage.setItem('sql_course_completed_' + lessonId, 'true');
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
  localStorage.setItem(`sql_sandbox_code_${lesson.id}`, userCode);

  // Start compiling animation log in terminal
  terminal.innerHTML = `
    <div class="terminal-line info">[SQL Runner] กำลังรันคำสั่ง SQL จริงผ่าน AlaSQL...</div>
    <div class="terminal-line info">sqlite3 sandbox.db < ${lesson.id}.sql</div>
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
      // Execute the validator function of the current lesson (runs real SQL via AlaSQL)
      lesson.validate(userCode, log);

      // Success logs
      terminal.innerHTML += `
        <div class="terminal-line text-muted">...................................................</div>
        <div class="terminal-line success">✓ <strong>ผลการรัน: สำเร็จ (Passed)</strong></div>
        <div class="terminal-line success">Query OK, 0 rows affected</div>
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
      if (key && (key.startsWith('sql_course_completed_') || key.startsWith('sql_sandbox_code_'))) {
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Database & SQL Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค SELECT/WHERE, JOIN, GROUP BY, PRIMARY KEY และ Data Integrity Check ไปตรวจสอบข้อมูลจริงในโปรเจคของคุณเอง!</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

// Run on window boot
window.onload = initApp;
