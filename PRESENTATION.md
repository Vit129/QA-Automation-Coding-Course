# บทพรีเซนต์ QA Automation Coding Course (~10 นาที)

พรีเซนต์นี้ใช้ได้สองแบบ: (1) พิตช์โปรเจกต์ให้ทีม/ผู้บริหารฟัง และ (2) แนะนำคอร์สให้ผู้เรียนใหม่ก่อนเริ่มลงมือทำ — สคริปต์เดียวครอบคลุมทั้งสองจุดประสงค์ ปรับน้ำหนักได้ตามผู้ฟังจริง

**เตรียมก่อนพูด:** เปิด https://vit129.github.io/QA-Automation-Coding-Course/ ไว้ในแท็บ พร้อม track "Playwright" ไว้ demo

---

## 0:00–0:45 — Hook: ปัญหาที่เจอ

- เวลาเรียน QA automation จากบทความ/วิดีโอ มักได้แค่ "ดู" ไม่ได้ "ลงมือเขียนจริง"
- พอจะลองเขียนจริง ต้อง setup project ทั้งชุด (npm install, config, browser driver) ก่อนจะได้แตะโค้ดบรรทัดแรก — เสียเวลาไปกับ setup มากกว่าเนื้อหา
- และไม่มีที่ไหนที่เดียวครอบคลุมทั้ง stack ของ QA จริง ๆ (E2E, API, performance, security, a11y, visual, CI/CD, framework design) ส่วนใหญ่แยกเป็นคอร์สละเรื่อง

> "ถ้าเปิดเบราว์เซอร์แล้วเขียนโค้ดได้เลย ไม่ต้อง setup อะไรทั้งนั้นล่ะ?"

## 0:45–1:30 — คืออะไร

- **QA Automation Coding Course** — code sandbox ที่รันในเบราว์เซอร์ล้วน ๆ
- ไม่มี backend ไม่มี build step — เปิดไฟล์ `index.html` (หรือเข้าลิงก์ GitHub Pages) ก็ใช้ได้ทันที
- โปรเกรสเก็บใน `localStorage` ของเครื่อง ไม่ต้องสมัครสมาชิก ไม่ต้องมี account

## 1:30–4:00 — Demo: flow การเรียนต่อ 1 บทเรียน

เปิด track **Playwright** โชว์สดตาม flow นี้:

1. **Theory** — อธิบายคอนเซปต์สั้น ๆ ก่อนเข้าโจทย์
2. **Code template** — มีโค้ดตั้งต้นพร้อมจุด `WRITE YOUR CODE HERE` ให้เติมเอง
3. **Validate** — กดตรวจแล้วรู้ผลทันทีว่าโค้ดที่เขียนถูกหรือไม่ ไม่ต้องรอใครตรวจ
4. **Hint → Solution** — ติดตรงไหนดูคำใบ้ก่อน ถ้ายังไม่ได้ค่อยดูเฉลย

พูดเน้น: "เขียนโค้ดจริง ตรวจจริง ในเบราว์เซอร์ ไม่ต้องเปิด terminal เลยด้วยซ้ำ"

## 4:00–6:00 — 11 Tracks ครอบคลุมทั้ง stack

จัดกลุ่มพูดให้เห็นภาพรวม ไม่ต้องไล่ทีละอัน:

- **สาย Functional Testing:** Playwright (TypeScript E2E), Robot Framework (keyword-driven), API Testing
- **สาย Non-functional:** Performance Testing (k6), Security Testing (auth bypass/injection/XSS), Accessibility Testing (axe-core/ARIA), Visual Regression Testing (screenshot diffing)
- **พื้นฐานที่ QA ต้องมี:** DB Design/SQL (รัน query จริงในเบราว์เซอร์ผ่าน AlaSQL), CLI Essentials (Git/Vim/Unix)
- **ระดับทีม/โปรเจกต์:** CI/CD Pipeline (GitHub Actions YAML), Framework Design (fixtures, DRY, reporting)
- ปิดท้ายด้วย **Mixed Mock Exam** — สุ่มโจทย์ข้ามทุก track มาให้ทำแบบจับเวลา เหมือนสอบจริง

## 6:00–7:30 — ทำไมถึงออกแบบแบบนี้ (ถ้าฟังเป็นทีม/ผู้บริหาร เน้นช่วงนี้)

- **Vanilla HTML/CSS/JS ล้วน** — ไม่มี framework ไม่มี build step ตั้งใจให้เบา แก้ง่าย เปิดได้ทุกที่
- **Dark-theme developer sandbox** — ธีมเดียวทุก track แต่ให้สีเด่นต่างกันต่อ track เพื่อจำง่ายว่ากำลังอยู่บทไหน
- **Deploy อัตโนมัติ** — push ขึ้น `main` แล้ว GitHub Pages build ให้เอง ผู้เรียนที่ clone ไว้จะเห็น banner เตือนถ้าโค้ดในเครื่อง "ตกรุ่น" เทียบกับ `main`
- **Out of scope โดยตั้งใจ:** ไม่มี account, ไม่มี cross-device sync, ไม่มี real CI runner/browser จริง, ไม่มีใบ certify — เพราะเป้าหมายคือ "ฝึกโค้ดให้ไว" ไม่ใช่ระบบ LMS เต็มรูปแบบ

## 7:30–8:30 — ใครควรใช้ / เริ่มยังไง

- กลุ่มเป้าหมาย: คนที่เรียนรู้ด้วยตัวเอง อยากฝึก QA automation แบบลงมือทำจริง
- เริ่มได้ 2 ทาง:
  - **ออนไลน์ตลอดเวลา:** เข้า https://vit129.github.io/QA-Automation-Coding-Course/ ได้เลย อัปเดตล่าสุดเสมอ
  - **ออฟไลน์:** `git clone` แล้วเปิด `index.html` ตรง ๆ เหมาะกับตอนไม่มีเน็ต

## 8:30–9:30 — Call to action

- ให้ทีม/ผู้เรียนลองเข้าไปทำ 1 บทเรียนหลังจบมิตติ้งนี้ แล้วส่ง feedback กลับมา
- ถ้าเป็นทีม: ชวนช่วยกันรีวิว/เพิ่ม track ใหม่ที่ทีมอยากได้ (repo เปิด MIT license)
- ถ้าเป็นผู้เรียน: แนะนำให้เริ่มจาก track ที่ตรงงานตัวเองที่สุดก่อน แล้วค่อยไล่ที่เหลือ ปิดท้ายด้วย Mock Exam เพื่อเช็คความพร้อม

## 9:30–10:00 — Closing

> "สรุปคือ เปิดเบราว์เซอร์ เขียนโค้ดจริง ตรวจจริง ครบทั้ง QA stack ในที่เดียว — ไม่ต้อง setup ไม่ต้องรอใคร"

เปิดรับคำถาม

---

## Timing cheat sheet

| ช่วงเวลา | หัวข้อ | นาที |
|---|---|---|
| 0:00–0:45 | Hook / ปัญหา | 0.75 |
| 0:45–1:30 | คืออะไร | 0.75 |
| 1:30–4:00 | Live demo 1 บทเรียน | 2.5 |
| 4:00–6:00 | 11 tracks ภาพรวม | 2.0 |
| 6:00–7:30 | Design decisions | 1.5 |
| 7:30–8:30 | ใครใช้ได้ / เริ่มยังไง | 1.0 |
| 8:30–9:30 | Call to action | 1.0 |
| 9:30–10:00 | Closing + Q&A | 0.5 |

**ทิปเวลาจริง:** ถ้ารู้สึกเวลาจะเกิน ตัดช่วง 6:00–7:30 (design decisions) ให้สั้นลงเหลือ 2-3 ประโยคได้ก่อน เพราะ demo (1:30–4:00) และ tracks overview (4:00–6:00) คือใจความหลักที่ต้องคงไว้เต็ม ๆ
