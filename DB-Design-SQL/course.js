(function() {
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

  alasql('CREATE TABLE brokers (name STRING PRIMARY KEY, displayName STRING, country STRING)');
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
    hint: "เลือกเฉพาะคอลัมน์ ticker และ shares จากตาราง holdings แล้วกรองเฉพาะแถวที่คอลัมน์ broker ตรงกับชื่อ Broker ที่โจทย์กำหนด — นึกถึงคำสั่งที่ใช้เทียบค่าคอลัมน์ string ให้เท่ากับข้อความหนึ่งๆ",
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
      const expectedOrder = ['MSFT', 'AMZN', 'AAPL', 'TLT'];
      const actualOrder = result.map(r => r.ticker);
      if (JSON.stringify(actualOrder) !== JSON.stringify(expectedOrder)) {
        throw new Error(`ลำดับ ticker ที่ได้ไม่ตรง คาดว่าจะได้ ${expectedOrder.join(' > ')} (เรียงมูลค่ารวมมากไปน้อย) แต่ได้ ${actualOrder.join(' > ')} — ตรวจสอบว่าใช้ ORDER BY shares * avgCost DESC ครบทุกแถวหรือยัง`);
      }
      log("✓ Filter และเรียงลำดับถูกต้องครบทั้ง 4 แถว (MSFT > AMZN > AAPL > TLT ตามมูลค่ารวม)");
    },
    hint: "คำนวณมูลค่ารวมของแต่ละ Holding จาก shares คูณ avgCost ก่อน แล้วกรองเฉพาะที่เกินเกณฑ์ที่โจทย์กำหนด จากนั้นเรียงผลลัพธ์ด้วยนิพจน์คำนวณเดียวกัน — อย่าลืมว่าค่า default ของการเรียงคือน้อยไปมาก ต้องระบุทิศทางตรงข้ามเองถ้าต้องการมากไปน้อย",
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
      let duplicateBlocked = false;
      try {
        alasql("INSERT INTO watchlist VALUES ('TSLA', 'ซ้ำ')");
      } catch (err) {
        duplicateBlocked = true;
      }
      if (!duplicateBlocked) {
        throw new Error("ตาราง watchlist ยอมให้ ticker ซ้ำกันได้ — ตรวจสอบว่ากำหนดให้ ticker เป็น PRIMARY KEY ตอนสร้างตารางหรือยัง (นี่คือจุดประสงค์หลักของบทเรียนนี้)");
      }
      log("✓ สร้างตาราง watchlist พร้อม PRIMARY KEY ถูกต้อง — ทดสอบแล้วว่า block ticker ซ้ำได้จริง และ Insert ข้อมูลถูกต้อง");
    },
    hint: "ต้องสร้างตารางใหม่ก่อนด้วยคำสั่งที่กำหนดชื่อคอลัมน์และ type รวมถึงระบุว่าคอลัมน์ไหนเป็นกุญแจหลักที่ห้ามซ้ำ จากนั้นค่อยเพิ่มแถวข้อมูลด้วยอีกคำสั่งหนึ่งแยกต่างหาก",
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
    id: "foreign_key_design",
    meta: "บทที่ 3",
    title: "FOREIGN KEY: บังคับให้ข้อมูลอ้างอิงต้องมีอยู่จริง",
    template: `-- ตาราง brokers มีอยู่แล้ว (name เป็น PRIMARY KEY)
-- 1. สร้างตาราง orders ใหม่: id (NUMBER), ticker (STRING), broker (STRING)
--    กำหนด FOREIGN KEY (broker) ให้อ้างอิงไปที่ brokers(name)
-- WRITE YOUR CODE HERE


-- 2. เพิ่มแถวใหม่: id=1, ticker='AMZN', broker='Webull' (Broker ที่มีอยู่จริง)
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ FOREIGN KEY constraint...");
      resetDatabase();
      runQuery(code);

      let rows;
      try {
        rows = alasql("SELECT * FROM orders");
      } catch (err) {
        throw new Error("ไม่พบตาราง orders — ตรวจสอบว่าสร้างด้วย CREATE TABLE orders (...) หรือยัง");
      }
      if (rows.length !== 1 || rows[0].broker !== 'Webull') {
        throw new Error(`คาดว่าตาราง orders จะมี 1 แถวที่ broker = 'Webull' แต่ได้: ${JSON.stringify(rows)}`);
      }

      let blocked = false;
      try {
        alasql("INSERT INTO orders VALUES (2, 'FAKE', 'NoSuchBroker')");
      } catch (err) {
        blocked = true;
      }
      if (!blocked) {
        throw new Error("ตาราง orders ยอมรับค่า broker ที่ไม่มีอยู่จริงใน brokers ได้ — ตรวจสอบว่าใส่ FOREIGN KEY (broker) REFERENCES brokers(name) ตอนสร้างตารางหรือยัง");
      }
      log("✓ สร้างตาราง orders พร้อม FOREIGN KEY ถูกต้อง — ทดสอบแล้วว่า block ค่า broker ปลอมได้จริง");
    },
    hint: "สร้างตารางใหม่ที่มีคอลัมน์อ้างอิงกลับไปยังตาราง brokers ที่มีอยู่แล้ว โดยระบุ constraint ที่บังคับว่าค่าในคอลัมน์นั้นต้องมีอยู่จริงในตารางปลายทาง (ดูคอลัมน์ไหนของ brokers ที่เป็น PRIMARY KEY) แล้วค่อยเพิ่มแถวด้วยค่าที่อ้างอิงถูกต้องจริง",
    solution: `CREATE TABLE orders (id NUMBER, ticker STRING, broker STRING, FOREIGN KEY (broker) REFERENCES brokers(name));
INSERT INTO orders VALUES (1, 'AMZN', 'Webull');`,
    theory: `<strong>FOREIGN KEY</strong> คือคอลัมน์ที่บังคับว่าค่าที่ใส่เข้าไปต้อง<strong>มีอยู่จริง</strong>ในตารางอื่นที่อ้างอิงถึง (referenced table) — ต่อยอดจากบท JOIN ก่อนหน้าที่เรา JOIN <code>holdings.broker = brokers.name</code> โดยไม่มีอะไรบังคับเลยว่าค่า <code>broker</code> ต้องมีจริงใน <code>brokers</code> บทนี้ทำให้มันเป็นกฎบังคับจริงระดับฐานข้อมูล ไม่ใช่แค่ความหวังว่าข้อมูลจะสอดคล้องกันเอง<br/><br/>
    <code>FOREIGN KEY (broker) REFERENCES brokers(name)</code> แปลว่า: ทุกค่าที่ใส่ในคอลัมน์ <code>orders.broker</code> ต้องตรงกับค่าใดค่าหนึ่งในคอลัมน์ <code>brokers.name</code> เท่านั้น — ถ้าลองใส่ชื่อ Broker ที่ไม่มีจริง ฐานข้อมูลจะ<strong>ปฏิเสธการ INSERT ทันที</strong> (พิสูจน์แล้วในบทนี้: sandbox รัน AlaSQL จริง ไม่ใช่ mock)<br/><br/>
    ในงาน QA เทคนิคนี้ช่วยตอบคำถาม "ข้อมูลมีสิทธิ์เพี้ยนจนอ้างอิงของที่ไม่มีจริงได้มั้ย" — ถ้า schema มี FOREIGN KEY ถูกต้อง คำตอบคือ "ไม่มีทาง" เพราะ DB บังคับเอง ไม่ต้องพึ่งให้ทุกจุดของโค้ด Backend เขียน validation ซ้ำเอง`,
    example: `-- ถ้าลองใส่ broker ปลอมเข้าไปตรงๆ จะได้ error ทันที (ลองรันดูได้)
INSERT INTO orders VALUES (99, 'FAKE', 'ThisBrokerDoesNotExist');
-- Error: Foreign key "ThisBrokerDoesNotExist" not found in table "brokers"`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. สร้างตาราง <code>orders</code> ด้วยคอลัมน์ <code>id</code> (NUMBER), <code>ticker</code> (STRING), <code>broker</code> (STRING) พร้อม <code>FOREIGN KEY (broker) REFERENCES brokers(name)</code><br/>
    2. เพิ่มแถว <code>id=1, ticker='AMZN', broker='Webull'</code>`
  },
  {
    id: "normalization_basics",
    meta: "บทที่ 4",
    title: "Normalization: ทำไมต้องแยกตาราง ไม่ยัดทุกอย่างลงตารางเดียว",
    template: `-- สถานการณ์: ถ้าเราเก็บชื่อเต็มของ Broker ("Webull Financial") ซ้ำไว้ในทุกแถวของ holdings
-- แทนที่จะแยกตาราง brokers ต่างหาก จะเกิดข้อมูลซ้ำซ้อนมากแค่ไหน?
-- 1. หาจำนวนแถวทั้งหมดใน holdings (ตั้งชื่อคอลัมน์ totalRows)
-- 2. หาจำนวน Broker ที่ไม่ซ้ำกัน (ตั้งชื่อคอลัมน์ distinctBrokers)
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการพิสูจน์ความซ้ำซ้อนของข้อมูล...");
      resetDatabase();
      alasql("INSERT INTO holdings (ticker, broker, shares, avgCost, sector) VALUES ('FIDX','Fidelity',5,10.00,'ETF')");
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 1) {
        throw new Error(`คาดว่าจะได้ 1 แถวสรุปผล แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว
ตัวอย่าง: SELECT COUNT(*) AS totalRows, COUNT(DISTINCT broker) AS distinctBrokers FROM holdings;`);
      }
      const row = result[0];
      if (Number(row.totalRows) !== 9 || Number(row.distinctBrokers) !== 3) {
        throw new Error(`คาดว่า totalRows=9, distinctBrokers=3 (นับจากข้อมูลจริงในตาราง holdings ณ ตอนนี้) แต่ได้ totalRows=${row.totalRows}, distinctBrokers=${row.distinctBrokers} — ตรวจสอบว่าใช้ COUNT(*) และ COUNT(DISTINCT broker) จริงหรือไม่ (ห้ามใส่ตัวเลขคงที่)`);
      }
      log("✓ พิสูจน์ได้ว่า holdings มี 9 แถว แต่ Broker จริงมีแค่ 3 ราย — ถ้าเก็บชื่อเต็ม Broker ซ้ำในทุกแถวจะซ้ำซ้อนโดยไม่จำเป็น");
    },
    hint: "ใช้ Aggregate Function สองตัวในคำสั่งเดียวกัน: ตัวหนึ่งนับจำนวนแถวทั้งหมด อีกตัวนับจำนวนค่าที่ไม่ซ้ำกันในคอลัมน์ broker — อย่าลืมตั้งชื่อคอลัมน์ผลลัพธ์ทั้งสองด้วย AS ตามที่โจทย์กำหนด",
    solution: `SELECT COUNT(*) AS totalRows, COUNT(DISTINCT broker) AS distinctBrokers FROM holdings;`,
    theory: `<strong>Normalization</strong> คือหลักการออกแบบฐานข้อมูลเพื่อลดข้อมูลซ้ำซ้อน โดยแยกข้อมูลที่ "ซ้ำกันได้" ออกเป็นตารางต่างหาก แล้วใช้ FOREIGN KEY เชื่อมกลับมา<br/><br/>
    ผลลัพธ์ของ query นี้พิสูจน์ปัญหาให้เห็นเป็นตัวเลขจริง: <code>holdings</code> มี 9 แถว (รวมข้อมูลที่ระบบเพิ่มเข้ามาตอนตรวจคำตอบ) แต่มี Broker ที่ไม่ซ้ำกันแค่ 3 ราย (Webull, Dime, Fidelity) — ถ้าเราเก็บ <code>displayName</code> ("Webull Financial") และ <code>country</code> ("US") ซ้ำไว้ในทุกแถวของ <code>holdings</code> โดยตรงแทนที่จะแยกตาราง <code>brokers</code> ต่างหาก ข้อมูลชุดเดียวกันนี้จะถูกเก็บซ้ำถึง 5 ครั้ง (Webull), 3 ครั้ง (Dime) และ 1 ครั้ง (Fidelity) โดยไม่จำเป็น<br/><br/>
    ปัญหาจริงที่ตามมาถ้าไม่ Normalize: ถ้า Webull เปลี่ยนชื่อเป็น "Webull Corp" ต้อง <code>UPDATE</code> ทั้ง 5 แถวให้ตรงกัน — พลาดแม้แถวเดียวจะทำให้ข้อมูล<strong>ไม่สอดคล้องกันเอง</strong> (inconsistent) ทันที การแยกเป็นตาราง <code>brokers</code> (ตามที่ทำไว้ในบท "Database Design: PRIMARY KEY") ทำให้แก้ที่เดียวจบ แล้วใช้ JOIN (บทก่อนหน้า) ดึงข้อมูลกลับมาต่อกันตอนต้องใช้จริง`,
    example: `-- ตัวอย่างเช็คความซ้ำซ้อนแบบเดียวกันกับคอลัมน์อื่น
SELECT COUNT(*) AS totalRows, COUNT(DISTINCT sector) AS distinctSectors FROM holdings;`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. หา <code>COUNT(*)</code> ตั้งชื่อคอลัมน์ <code>totalRows</code><br/>
    2. หา <code>COUNT(DISTINCT broker)</code> ตั้งชื่อคอลัมน์ <code>distinctBrokers</code>`
  },
  {
    id: "joins",
    meta: "บทที่ 5",
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
      const row = result[0];
      if (row.ticker !== 'AMZN' || row.broker !== 'Webull' || row.displayName !== 'Webull Financial') {
        throw new Error(`แถวที่ได้ต้องมีคอลัมน์ ticker='AMZN', broker='Webull', displayName='Webull Financial' ครบทั้งสามคอลัมน์ แต่ได้ ${JSON.stringify(row)} — ตรวจสอบว่า SELECT คอลัมน์ ticker, broker, displayName ครบหรือไม่ และ JOIN ด้วยเงื่อนไข ON h.broker = b.name ถูกต้องหรือไม่`);
      }
      log("✓ JOIN สำเร็จ ได้ ticker, broker, displayName ครบถูกต้องทุกคอลัมน์");
    },
    hint: "เชื่อมสองตารางเข้าด้วยกันด้วยเงื่อนไขที่คอลัมน์ broker ของ holdings ตรงกับคอลัมน์ที่เป็น PRIMARY KEY ของ brokers แล้วกรองเฉพาะแถวที่ ticker ตรงกับที่โจทย์ต้องการ — ใช้ alias ย่อชื่อตารางให้เขียนสั้นลง",
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
    id: "data_types_boolean",
    meta: "บทที่ 6",
    title: "เลือก Data Type ให้ถูกงาน: BOOLEAN สำหรับค่าใช่/ไม่ใช่",
    template: `-- สถานการณ์: อยากกันแจ้งเตือนซ้ำสำหรับ ticker ใน price_alerts ต้องมีคอลัมน์เก็บว่า "แจ้งเตือนไปแล้วหรือยัง"
-- 1. สร้างตาราง price_alerts ใหม่: ticker (STRING PRIMARY KEY), note (STRING), notified (BOOLEAN)
-- WRITE YOUR CODE HERE


-- 2. เพิ่มแถว: ticker='TSLA', note='รอราคาย่อ', notified=FALSE


-- 3. อัปเดตว่า TSLA ถูกแจ้งเตือนไปแล้ว: SET notified = TRUE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการออกแบบคอลัมน์ BOOLEAN...");
      resetDatabase();
      runQuery(code);
      let rows;
      try {
        rows = alasql("SELECT * FROM price_alerts");
      } catch (err) {
        throw new Error("ไม่พบตาราง price_alerts — ตรวจสอบว่าสร้างด้วย CREATE TABLE price_alerts (...) หรือยัง");
      }
      if (rows.length !== 1 || rows[0].ticker !== 'TSLA') {
        throw new Error(`คาดว่าตาราง price_alerts จะมี 1 แถวที่ ticker='TSLA' แต่ได้: ${JSON.stringify(rows)}`);
      }
      if (rows[0].notified !== true) {
        throw new Error(`คาดว่า notified จะเป็น TRUE (boolean จริง ไม่ใช่ string 'true') หลัง UPDATE แต่ได้: ${JSON.stringify(rows[0].notified)}`);
      }
      log("✓ ออกแบบคอลัมน์ BOOLEAN และอัปเดตค่าถูกต้อง (notified = true)");
    },
    hint: "เลือก data type ที่เหมาะกับค่าที่มีแค่ 2 สถานะ (จริง/เท็จ) ตอนสร้างตาราง จากนั้นต้องมี 3 คำสั่งตามลำดับ: สร้างตาราง, เพิ่มแถวเริ่มต้น, แล้วแก้ไขแถวเดิมด้วยคำสั่งที่เปลี่ยนค่าคอลัมน์ notified — ห้ามใช้ string หรือตัวเลขแทนค่าที่ควรเป็น boolean จริง",
    solution: `CREATE TABLE price_alerts (ticker STRING PRIMARY KEY, note STRING, notified BOOLEAN);
INSERT INTO price_alerts (ticker, note, notified) VALUES ('TSLA', 'รอราคาย่อ', FALSE);
UPDATE price_alerts SET notified = TRUE WHERE ticker = 'TSLA';`,
    theory: `การออกแบบตารางไม่ใช่แค่ "มี column อะไรบ้าง" แต่ต้องเลือก <strong>Data Type</strong> ให้ตรงกับความหมายจริงของข้อมูลด้วย — คอลัมน์ที่มีค่าได้แค่ 2 แบบ (ใช่/ไม่ใช่, เปิด/ปิด, จริง/เท็จ) ควรเป็น <strong>BOOLEAN</strong> ไม่ใช่ STRING ("yes"/"no") หรือ NUMBER (1/0) เพราะ:<br/><br/>
    1. <strong>ชัดเจนกว่า:</strong> อ่าน schema แล้วรู้ทันทีว่าคอลัมน์นี้มีค่าได้แค่ true/false ไม่ต้องเดาว่า string ไหน "ถือว่าใช่"<br/>
    2. <strong>ป้องกันค่าผิดรูปแบบ:</strong> STRING เปิดช่องให้พิมพ์ "Yes", "yes", "Y", "true" ปนกันได้ในแต่ละแถว ทำให้ query <code>WHERE notified = 'yes'</code> พลาดแถวที่พิมพ์ "Yes" ไป — BOOLEAN ไม่มีปัญหานี้เพราะมีแค่ true/false เท่านั้นจริงๆ<br/><br/>
    หมายเหตุ: คอลัมน์ <code>notified</code> ในบทนี้เป็นตัวอย่างสมมติต่อยอดจากตาราง <code>price_alerts</code> (บทที่ 2) เพื่อสอนหลักการเลือก data type — ไม่ได้มีอยู่จริงในโค้ดของ My-Investment-Port`,
    example: `-- ตัวอย่าง query กรองด้วย BOOLEAN ตรงๆ ไม่ต้องเทียบ string
SELECT ticker FROM price_alerts WHERE notified = FALSE;`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. สร้างตาราง <code>price_alerts</code> ด้วยคอลัมน์ <code>ticker</code> (STRING PRIMARY KEY), <code>note</code> (STRING), <code>notified</code> (BOOLEAN)<br/>
    2. เพิ่มแถว <code>ticker='TSLA', note='รอราคาย่อ', notified=FALSE</code><br/>
    3. อัปเดตเป็น <code>notified = TRUE</code> สำหรับ <code>ticker = 'TSLA'</code>`
  },
  {
    id: "left_join_vs_inner",
    meta: "บทที่ 7",
    title: "LEFT JOIN vs INNER JOIN: หา Foreign Key ที่อ้างอิงของไม่มีจริง",
    template: `-- หมายเหตุ: มีแถว Holdings ของ ticker 'ORPHAN' ที่ broker เป็น 'GhostBroker' (ไม่มีอยู่จริงใน brokers) เตรียมไว้ให้แล้ว
-- 1. หา ticker ทั้งหมดที่ broker ไม่มีอยู่จริงในตาราง brokers (ข้อมูลกำพร้า)
--    ใช้ LEFT JOIN แล้วกรองด้วย WHERE brokers.name IS NULL
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ LEFT JOIN + IS NULL...");
      resetDatabase();
      alasql("INSERT INTO holdings (ticker, broker, shares, avgCost, sector) VALUES ('ORPHAN','GhostBroker',10,50,'Technology')");
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 1) {
        throw new Error(`คาดว่าจะได้ 1 แถว (ORPHAN) แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว
ตัวอย่าง: SELECT h.ticker FROM holdings h LEFT JOIN brokers b ON h.broker = b.name WHERE b.name IS NULL;`);
      }
      if (result[0].ticker !== 'ORPHAN') {
        throw new Error(`คาดว่าจะได้ ticker='ORPHAN' แต่ได้ ${JSON.stringify(result[0])}`);
      }
      log("✓ เจอ Holdings ที่ broker อ้างอิงของไม่มีจริง (ORPHAN/GhostBroker) ถูกต้อง");
    },
    hint: "ใช้ JOIN แบบที่เก็บทุกแถวจากตารางฝั่งซ้าย (holdings) ไว้เสมอ แม้จะจับคู่กับฝั่งขวา (brokers) ไม่ได้ก็ตาม แถวที่จับคู่ไม่ได้จะมีคอลัมน์ฝั่งขวาเป็นค่าว่าง จากนั้นกรองหาแถวที่คอลัมน์ของฝั่งขวานั้นเป็นค่าว่างด้วยตัวดำเนินการเปรียบเทียบที่ใช้กับค่าว่างโดยเฉพาะ",
    solution: `SELECT h.ticker FROM holdings h LEFT JOIN brokers b ON h.broker = b.name WHERE b.name IS NULL;`,
    theory: `บท JOIN ก่อนหน้าเคยบอกไว้ว่า: ถ้าไม่มีแถวไหนใน <code>brokers</code> ตรงกับค่า <code>broker</code> เลย แถวนั้นจะ<strong>หายไปจากผลลัพธ์เงียบๆ</strong> เพราะ <code>JOIN</code> เฉยๆ คือ <strong>INNER JOIN</strong> (ค่า default) — บทนี้ทำให้ปัญหานั้น "มองเห็นได้" แทนที่จะถูกซ่อนไว้<br/><br/>
    <strong>LEFT JOIN</strong> เก็บ<strong>ทุกแถว</strong>จากตารางฝั่งซ้าย (<code>holdings</code>) ไว้เสมอ ไม่ว่าจะจับคู่กับฝั่งขวา (<code>brokers</code>) ได้หรือไม่ก็ตาม — ถ้าจับคู่ไม่ได้ คอลัมน์จากฝั่งขวาทั้งหมดจะเป็น <code>NULL</code><br/><br/>
    เทคนิคมาตรฐาน: <code>LEFT JOIN ... WHERE &lt;ฝั่งขวา&gt;.&lt;key&gt; IS NULL</code> คือวิธีหา "ข้อมูลกำพร้า" (orphaned data) — แถวที่อ้างอิง Foreign Key ไปยังของที่ไม่มีอยู่จริง ในงาน QA เทคนิคนี้ใช้ตรวจสอบ Data Integrity จริงเวลาสงสัยว่าระบบมีข้อมูลอ้างอิงพังหลุดรอดออกมาบ้างหรือไม่ (เช่น หลัง migration หรือหลัง bug ที่ปล่อยให้ข้าม FOREIGN KEY constraint ไปได้)`,
    example: `-- INNER JOIN แบบเดิมจะไม่เจอ ORPHAN เลย (หายไปเงียบๆ) — ลองเทียบกันดู
SELECT h.ticker FROM holdings h JOIN brokers b ON h.broker = b.name;
-- ไม่มี ORPHAN ในผลลัพธ์ ทั้งที่ ORPHAN มีอยู่จริงในตาราง holdings`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. LEFT JOIN ตาราง <code>holdings</code> กับ <code>brokers</code><br/>
    2. กรองด้วย <code>WHERE brokers.name IS NULL</code> เพื่อหา Holdings ที่ broker ไม่มีอยู่จริง`
  },
  {
    id: "aggregation",
    meta: "บทที่ 8",
    title: "Aggregate Function: รวมมูลค่าพอร์ตต่อ Broker",
    template: `-- 1. รวมมูลค่าพอร์ต (shares * avgCost) ของแต่ละ Broker ตั้งชื่อคอลัมน์ผลลัพธ์ว่า totalValue
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ GROUP BY + Aggregate Function...");
      resetDatabase();
      alasql("INSERT INTO holdings (ticker, broker, shares, avgCost, sector) VALUES ('EXTRA','Webull',10,100,'Technology')");
      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 2) {
        throw new Error(`คาดว่าจะได้ 2 แถว (Webull, Dime) แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว\nตัวอย่าง: SELECT broker, SUM(shares * avgCost) AS totalValue FROM holdings GROUP BY broker;`);
      }
      const webull = result.find(r => r.broker === 'Webull');
      const dime = result.find(r => r.broker === 'Dime');
      if (!webull || Math.abs(Number(webull.totalValue) - 23974) > 0.5) {
        throw new Error(`totalValue ของ Webull ควรเป็น 23974 (คำนวณจากข้อมูลจริงในตาราง ณ ตอนนี้) แต่ได้ ${webull ? webull.totalValue : 'ไม่พบแถว Webull'}\nตรวจสอบว่าใช้ SUM(shares * avgCost) AS totalValue และ GROUP BY broker ถูกต้องหรือไม่ (ห้ามใส่ตัวเลขคงที่)`);
      }
      if (!dime || Math.abs(Number(dime.totalValue) - 21583) > 0.5) {
        throw new Error(`totalValue ของ Dime ควรเป็น 21583 แต่ได้ ${dime ? dime.totalValue : 'ไม่พบแถว Dime'}`);
      }
      log("✓ GROUP BY + SUM ถูกต้องทั้งสอง Broker (Webull 23974, Dime 21583) คำนวณจากข้อมูลจริงในตาราง");
    },
    hint: "ต้องคำนวณนิพจน์ shares คูณ avgCost ก่อน แล้วรวมค่านั้นด้วย Aggregate Function ตัวหนึ่ง จากนั้นจับกลุ่มผลลัพธ์ตามคอลัมน์ broker — อย่าลืมตั้งชื่อคอลัมน์ผลลัพธ์ด้วย AS ตามที่โจทย์กำหนด",
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
    meta: "บทที่ 9",
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
      const remaining = alasql("SELECT COUNT(*) AS totalCnt FROM holdings");
      if (Number(remaining[0].totalCnt) !== 7) {
        throw new Error(`ตาราง holdings ควรเหลือ 7 แถว (ลบออกไป 1 แถวจากทั้งหมด 8 แถว) แต่พบ ${remaining[0].totalCnt} แถว — cnt=0 ต้องมาจากการ DELETE จริง ไม่ใช่แค่เขียนเงื่อนไข WHERE ในคำสั่ง SELECT ที่กรองไม่เจอ QQQI ตั้งแต่แรกโดยไม่ได้ลบอะไรเลย`);
      }
      log("✓ ลบข้อมูลจริงสำเร็จ (เหลือ 7 แถวจาก 8 แถว) และยืนยันด้วย COUNT(*) = 0 ถูกต้อง");
    },
    hint: "ต้องมี 2 คำสั่งคั่นด้วย ; คำสั่งแรกลบแถวที่ตรงกับเงื่อนไขทั้งสองคอลัมน์ที่โจทย์กำหนด คำสั่งที่สองนับจำนวนแถวที่เหลือของ ticker เดิมเพื่อพิสูจน์ว่าลบสำเร็จจริง",
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
    meta: "บทที่ 10",
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
    hint: "ค่าที่ยังไม่ถูกกำหนดใน SQL ไม่ใช่ string ว่างหรือเลข 0 — การเทียบด้วยเครื่องหมาย = ตามปกติจะไม่มีวันเจอแถวที่ยังไม่มีค่าเลย ต้องใช้ตัวดำเนินการเปรียบเทียบพิเศษที่ออกแบบมาสำหรับตรวจสอบว่าคอลัมน์ 'ไม่มีค่า' โดยเฉพาะแทน",
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
  },
  {
    id: "advanced_join_having",
    meta: "ขั้นสูง 1",
    title: "Reporting ขั้นสูง: หา Test Suite ที่มี Test Case FAIL เกินเกณฑ์ (JOIN + GROUP BY + HAVING)",
    template: `-- ตาราง test_suites: id, name
-- ตาราง test_cases: id, suiteId (อ้างอิงไปยัง test_suites.id), status ('PASS' หรือ 'FAIL')
-- 1. หาชื่อ Test Suite (name) พร้อมจำนวน Test Case ที่ status = 'FAIL' ของแต่ละ suite (ตั้งชื่อคอลัมน์ผลลัพธ์ว่า failCount)
--    เอาเฉพาะ suite ที่มีจำนวน FAIL มากกว่า 1 รายการเท่านั้น
-- WRITE YOUR CODE HERE
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบ JOIN + GROUP BY + HAVING...");
      resetDatabase();
      try { alasql('DROP TABLE IF EXISTS test_cases'); } catch (e) {}
      try { alasql('DROP TABLE IF EXISTS test_suites'); } catch (e) {}
      alasql('CREATE TABLE test_suites (id NUMBER PRIMARY KEY, name STRING)');
      alasql(`INSERT INTO test_suites (id, name) VALUES
        (1,'Login'), (2,'Checkout'), (3,'Search'), (4,'Reports')`);
      alasql('CREATE TABLE test_cases (id NUMBER PRIMARY KEY, suiteId NUMBER, status STRING, FOREIGN KEY (suiteId) REFERENCES test_suites(id))');
      alasql(`INSERT INTO test_cases (id, suiteId, status) VALUES
        (1,1,'FAIL'), (2,1,'FAIL'), (3,1,'PASS'),
        (4,2,'FAIL'), (5,2,'FAIL'), (6,2,'FAIL'),
        (7,3,'PASS'), (8,3,'PASS'),
        (9,4,'FAIL')`);

      const result = runQuery(code);
      if (!Array.isArray(result) || result.length !== 2) {
        throw new Error(`คาดว่าจะได้ 2 แถว (Login, Checkout — suite ที่มี FAIL มากกว่า 1 รายการ) แต่ได้ ${Array.isArray(result) ? result.length : 'ไม่ใช่ array'} แถว
ตัวอย่าง: SELECT s.name, COUNT(*) AS failCount FROM test_cases c JOIN test_suites s ON c.suiteId = s.id WHERE c.status = 'FAIL' GROUP BY s.name HAVING COUNT(*) > 1;`);
      }
      const login = result.find(r => r.name === 'Login');
      const checkout = result.find(r => r.name === 'Checkout');
      if (!login || Number(login.failCount) !== 2) {
        throw new Error(`Login ควรมี failCount = 2 แต่ได้ ${login ? login.failCount : 'ไม่พบแถว Login ในผลลัพธ์'}`);
      }
      if (!checkout || Number(checkout.failCount) !== 3) {
        throw new Error(`Checkout ควรมี failCount = 3 แต่ได้ ${checkout ? checkout.failCount : 'ไม่พบแถว Checkout ในผลลัพธ์'}`);
      }
      const hasWrongSuite = result.some(r => r.name === 'Search' || r.name === 'Reports');
      if (hasWrongSuite) {
        throw new Error("ผลลัพธ์มี Search หรือ Reports ปนอยู่ ทั้งที่ทั้งสอง suite นี้มีจำนวน FAIL ไม่เกิน 1 รายการ — ตรวจสอบเงื่อนไข HAVING COUNT(*) > 1 อีกครั้ง");
      }
      log("✓ JOIN + GROUP BY + HAVING ถูกต้อง (Login FAIL 2 ครั้ง, Checkout FAIL 3 ครั้ง เกินเกณฑ์ที่กำหนด)");
    },
    hint: "ต้อง JOIN สองตารางก่อนด้วยคอลัมน์ที่เชื่อมกัน (suiteId กับ id) กรองเฉพาะแถวสถานะ FAIL ก่อนนับ แล้วจับกลุ่มตามชื่อ suite จากนั้นกรองผลลัพธ์ 'หลัง' การนับด้วยคำสั่งที่ต่างจาก WHERE (คำสั่งที่ใช้กรองค่าซึ่งมาจาก Aggregate Function ไม่ใช่คอลัมน์ตรงๆ)",
    solution: `SELECT s.name, COUNT(*) AS failCount
FROM test_cases c JOIN test_suites s ON c.suiteId = s.id
WHERE c.status = 'FAIL'
GROUP BY s.name
HAVING COUNT(*) > 1;`,
    theory: `บทเรียนนี้รวม 3 เทคนิคที่เรียนมาแล้วเข้าด้วยกันในคำถามเดียว (JOIN + WHERE + GROUP BY) และเพิ่มเทคนิคใหม่: <strong>HAVING</strong><br/><br/>
    ความแตกต่างสำคัญระหว่าง <code>WHERE</code> กับ <code>HAVING</code>:<br/>
    1. <code>WHERE</code> กรอง<strong>แถวดิบ</strong>ก่อนที่จะ <code>GROUP BY</code> — ใช้กรองแถวที่ <code>status = 'FAIL'</code> ก่อนนับ<br/>
    2. <code>HAVING</code> กรอง<strong>ผลลัพธ์หลังคำนวณ Aggregate Function แล้ว</strong> — ใช้กรอง suite ที่มี <code>COUNT(*) > 1</code> หลังจากนับจำนวน FAIL ต่อ suite เสร็จแล้ว<br/><br/>
    ทำไมต้องแยกกัน: <code>WHERE</code> ทำงานก่อน <code>GROUP BY</code> เกิดขึ้น จึงยังไม่มีค่า <code>COUNT(*)</code> ให้เทียบ (เขียน <code>WHERE COUNT(*) > 1</code> จะ error) ต้องรอให้จับกลุ่มและคำนวณเสร็จก่อน แล้วค่อยกรองด้วย <code>HAVING</code> ทีหลัง<br/><br/>
    ในงาน QA เทคนิคนี้ตอบคำถามเชิงรายงานที่ซับซ้อนขึ้น เช่น "Test Suite ไหนที่มีอัตราความล้มเหลวสูงเกินเกณฑ์ที่ทีมต้องรีบตรวจสอบ" — คำถามที่ต้องรวมข้อมูลจากหลายตาราง กรองก่อนนับ นับแล้วจับกลุ่ม แล้วกรองอีกรอบหลังนับ ครบทุกขั้นตอนในคำสั่งเดียว`,
    example: `-- ตัวอย่าง HAVING แบบนับทุกสถานะรวมกัน (ไม่กรอง WHERE ก่อน) หา suite ที่มี test case รวมมากกว่า 2 รายการ
SELECT s.name, COUNT(*) AS totalCases FROM test_cases c JOIN test_suites s ON c.suiteId = s.id GROUP BY s.name HAVING COUNT(*) > 2;`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. JOIN ตาราง <code>test_cases</code> กับ <code>test_suites</code> ด้วยเงื่อนไข <code>test_cases.suiteId = test_suites.id</code><br/>
    2. กรองเฉพาะแถวที่ <code>status = 'FAIL'</code><br/>
    3. จับกลุ่มด้วย <code>GROUP BY</code> ชื่อ suite แล้วนับจำนวนด้วย <code>COUNT(*) AS failCount</code><br/>
    4. กรองผลลัพธ์หลังนับด้วย <code>HAVING COUNT(*) > 1</code>`
  },
  {
    id: "advanced_normalization_schema",
    meta: "ขั้นสูง 2",
    title: "ออกแบบ Schema แบบ Normalized: จากตารางเดียวที่ข้อมูลซ้ำซ้อน สู่ 3 ตารางที่เชื่อมด้วย Foreign Key",
    template: `-- สถานการณ์: เดิมทีข้อมูล Test Run ถูกเก็บรวมในตารางเดียว (test_runs_flat) แบบนี้:
-- | caseName    | testerName | testerEmail    | suiteName | status |
-- | Login OK    | Jane       | jane@test.com  | Login     | PASS   |
-- | Login Fail  | Jane       | jane@test.com  | Login     | FAIL   |
-- | Checkout OK | Bob        | bob@test.com   | Checkout  | PASS   |
-- ปัญหา: testerName/testerEmail ซ้ำทุกแถวของ Jane, suiteName ซ้ำทุกแถวของ Login (repeating groups)
-- ถ้า Jane เปลี่ยนอีเมล ต้องไล่แก้ทุกแถวที่มีชื่อ Jane — เสี่ยงพลาดตกหล่นเหมือนปัญหาที่เคยเจอในบท Normalization
--
-- จงออกแบบใหม่เป็น 3 ตาราง:
-- 1. testers: email (STRING PRIMARY KEY), name (STRING)
-- 2. suites: id (NUMBER PRIMARY KEY), name (STRING)
-- 3. test_runs: id (NUMBER PRIMARY KEY), testerEmail (STRING), suiteId (NUMBER), status (STRING)
--    โดย test_runs.testerEmail ต้อง FOREIGN KEY REFERENCES testers(email)
--    และ test_runs.suiteId ต้อง FOREIGN KEY REFERENCES suites(id)
-- WRITE YOUR CODE HERE


-- 4. เพิ่มข้อมูลตัวอย่าง: testers ('jane@test.com','Jane'), suites (1,'Login'), test_runs (1,'jane@test.com',1,'PASS')
`,
    validate: (code, log) => {
      log("🔍 ตรวจสอบการออกแบบ Schema แบบ Normalized (3 ตาราง + Foreign Key)...");
      resetDatabase();
      try { alasql('DROP TABLE IF EXISTS test_runs'); } catch (e) {}
      try { alasql('DROP TABLE IF EXISTS suites'); } catch (e) {}
      try { alasql('DROP TABLE IF EXISTS testers'); } catch (e) {}

      runQuery(code);

      let testers, suites, testRuns;
      try {
        testers = alasql("SELECT * FROM testers");
      } catch (err) {
        throw new Error("ไม่พบตาราง testers — ตรวจสอบว่าสร้างด้วย CREATE TABLE testers (email STRING PRIMARY KEY, name STRING) หรือยัง");
      }
      try {
        suites = alasql("SELECT * FROM suites");
      } catch (err) {
        throw new Error("ไม่พบตาราง suites — ตรวจสอบว่าสร้างด้วย CREATE TABLE suites (id NUMBER PRIMARY KEY, name STRING) หรือยัง");
      }
      try {
        testRuns = alasql("SELECT * FROM test_runs");
      } catch (err) {
        throw new Error("ไม่พบตาราง test_runs — ตรวจสอบว่าสร้างด้วย CREATE TABLE test_runs (...) หรือยัง");
      }

      if (testers.length !== 1 || testers[0].email !== 'jane@test.com' || testers[0].name !== 'Jane') {
        throw new Error(`ข้อมูลในตาราง testers ไม่ตรงกับที่คาดไว้ (email='jane@test.com', name='Jane') ได้: ${JSON.stringify(testers)}`);
      }
      if (suites.length !== 1 || Number(suites[0].id) !== 1 || suites[0].name !== 'Login') {
        throw new Error(`ข้อมูลในตาราง suites ไม่ตรงกับที่คาดไว้ (id=1, name='Login') ได้: ${JSON.stringify(suites)}`);
      }
      if (testRuns.length !== 1 || testRuns[0].testerEmail !== 'jane@test.com' || Number(testRuns[0].suiteId) !== 1 || testRuns[0].status !== 'PASS') {
        throw new Error(`ข้อมูลในตาราง test_runs ไม่ตรงกับที่คาดไว้ (testerEmail='jane@test.com', suiteId=1, status='PASS') ได้: ${JSON.stringify(testRuns)}`);
      }

      let blockedTester = false;
      try {
        alasql("INSERT INTO test_runs VALUES (99, 'ghost@test.com', 1, 'FAIL')");
      } catch (err) {
        blockedTester = true;
      }
      if (!blockedTester) {
        throw new Error("ตาราง test_runs ยอมรับ testerEmail ที่ไม่มีอยู่จริงใน testers ได้ — ตรวจสอบว่าใส่ FOREIGN KEY (testerEmail) REFERENCES testers(email) หรือยัง");
      }

      let blockedSuite = false;
      try {
        alasql("INSERT INTO test_runs VALUES (98, 'jane@test.com', 999, 'FAIL')");
      } catch (err) {
        blockedSuite = true;
      }
      if (!blockedSuite) {
        throw new Error("ตาราง test_runs ยอมรับ suiteId ที่ไม่มีอยู่จริงใน suites ได้ — ตรวจสอบว่าใส่ FOREIGN KEY (suiteId) REFERENCES suites(id) หรือยัง");
      }

      log("✓ ออกแบบ Schema แบบ Normalized ถูกต้อง — 3 ตารางเชื่อมกันด้วย Foreign Key และบังคับ referential integrity ได้จริงทั้งสองจุด");
    },
    hint: "แยกข้อมูลที่ซ้ำกันได้ (ชื่อ/อีเมล tester, ชื่อ suite) ออกเป็นตารางของตัวเองที่มี PRIMARY KEY ไม่ซ้ำ แล้วเหลือแค่ตัวอ้างอิง (เช่น email, suite id) ไว้ในตารางบันทึกผลการรัน — ตารางบันทึกผลต้องมี FOREIGN KEY อ้างกลับไปทั้งสองตารางที่แยกออกมา ไม่ใช่แค่ตารางเดียว",
    solution: `CREATE TABLE testers (email STRING PRIMARY KEY, name STRING);
CREATE TABLE suites (id NUMBER PRIMARY KEY, name STRING);
CREATE TABLE test_runs (id NUMBER PRIMARY KEY, testerEmail STRING, suiteId NUMBER, status STRING, FOREIGN KEY (testerEmail) REFERENCES testers(email), FOREIGN KEY (suiteId) REFERENCES suites(id));
INSERT INTO testers VALUES ('jane@test.com', 'Jane');
INSERT INTO suites VALUES (1, 'Login');
INSERT INTO test_runs VALUES (1, 'jane@test.com', 1, 'PASS');`,
    theory: `บทเรียนนี้เป็นบทสรุปของหลักการที่เรียนมาทั้งหมด: <strong>Normalization</strong> (บทที่ 4) + <strong>PRIMARY KEY</strong> (Database Design) + <strong>FOREIGN KEY</strong> (บทที่ 3) รวมกันเป็นงานออกแบบ Schema จริง<br/><br/>
    ตาราง <code>test_runs_flat</code> แบบเดิมมีปัญหาที่เรียกว่า <strong>repeating groups</strong> — ข้อมูลของ tester คนเดียวกัน (<code>testerName</code>, <code>testerEmail</code>) ถูกพิมพ์ซ้ำทุกครั้งที่เขารัน test อีกครั้ง เช่นเดียวกับข้อมูล suite (<code>suiteName</code>) ที่ซ้ำทุกครั้งที่มี test case ในนั้น<br/><br/>
    วิธีแก้: แยกข้อมูลที่ "ซ้ำกันได้" ออกเป็นตารางอ้างอิงต่างหาก แล้วให้ตารางบันทึกเหตุการณ์ (<code>test_runs</code>) เก็บแค่ตัวอ้างอิง (Foreign Key) กลับไปยังตารางเหล่านั้น:<br/>
    1. <code>testers</code> — ข้อมูล tester แต่ละคนถูกเก็บครั้งเดียว ระบุตัวด้วย <code>email</code> (PRIMARY KEY)<br/>
    2. <code>suites</code> — ข้อมูล suite แต่ละชุดถูกเก็บครั้งเดียว ระบุตัวด้วย <code>id</code> (PRIMARY KEY)<br/>
    3. <code>test_runs</code> — 1 แถวต่อ 1 การรัน test จริง อ้างอิงกลับไปยังทั้งสองตารางด้วย Foreign Key สองจุด<br/><br/>
    ถ้า Jane เปลี่ยนอีเมล ตอนนี้แก้แค่แถวเดียวในตาราง <code>testers</code> ก็จบ — ไม่ต้องไล่หาทุกแถวใน <code>test_runs</code> ที่เคยพิมพ์อีเมลเธอซ้ำไว้เหมือนตอนที่ยังไม่ได้ Normalize`,
    example: `-- ตัวอย่างออกแบบคล้ายกันสำหรับข้อมูล environment ที่ test ใช้รัน (แยก environment ออกจาก run log)
CREATE TABLE environments (id NUMBER PRIMARY KEY, name STRING, osVersion STRING);
CREATE TABLE test_run_logs (id NUMBER PRIMARY KEY, envId NUMBER, result STRING, FOREIGN KEY (envId) REFERENCES environments(id));`,
    task: `จงเขียน SQL ให้สมบูรณ์ โดย:<br/>
    1. สร้างตาราง <code>testers</code> ด้วยคอลัมน์ <code>email</code> (STRING PRIMARY KEY), <code>name</code> (STRING)<br/>
    2. สร้างตาราง <code>suites</code> ด้วยคอลัมน์ <code>id</code> (NUMBER PRIMARY KEY), <code>name</code> (STRING)<br/>
    3. สร้างตาราง <code>test_runs</code> ด้วยคอลัมน์ <code>id</code> (NUMBER PRIMARY KEY), <code>testerEmail</code> (STRING), <code>suiteId</code> (NUMBER), <code>status</code> (STRING) พร้อม <code>FOREIGN KEY (testerEmail) REFERENCES testers(email)</code> และ <code>FOREIGN KEY (suiteId) REFERENCES suites(id)</code><br/>
    4. เพิ่มแถวตัวอย่าง: <code>testers ('jane@test.com','Jane')</code>, <code>suites (1,'Login')</code>, <code>test_runs (1,'jane@test.com',1,'PASS')</code>`
  }
];

// Application state

const PREFIX = 'sql';
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
    <div class="terminal-line success">🎉 ขอแสดงความยินดี! คุณเรียนจบหลักสูตร Database & SQL Sandbox แล้ว!</div>
    <div class="terminal-line success">สำเร็จครบทั้งหมด: ${totalCorrect} จาก ${LESSONS.length} บทเรียน</div>
    <div class="terminal-line info">===================================================</div>
    <div class="terminal-line text-muted">คุณพร้อมแล้วในการนำเอาเทคนิค SELECT/WHERE, JOIN, GROUP BY, PRIMARY KEY และ Data Integrity Check ไปตรวจสอบข้อมูลจริงในโปรเจคของคุณเอง!</div>
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
  window.QA_TRACKS['db-design-sql'] = { id: 'db-design-sql', title: 'Database Design & SQL', folder: 'DB-Design-SQL', lessons: LESSONS };
})();
