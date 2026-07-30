# Feature Plan & Task Progress: Capstone Architecture & Course Refinement

**Status:** IN_PROGRESS (Session checkpoint saved for tomorrow's continuation)  
**Target:** Final Project Capstone (`Final-Project/`) & All 12 Course Tracks (`course.js`, UI/UX Design)  
**Created:** 2026-07-30  
**Latest Release:** `v0.9.1` (Git commit `41478ee`, tagged & pushed to GitHub)

---

## 🎯 Overview & Context (สิ่งที่ทำลงไป ที่ไหน เพราะอะไร ทำไมถึงทำ)

### 1. ⌨️ Code Editor & Keyboard Usability Enhancements
- **ไฟล์ที่เกี่ยวข้อง:** `shared/editor-autocomplete.js`, `shared/engine.js`, `shared/sync-engine.sh`
- **สิ่งที่ทำ:** 
  - เพิ่ม **Keyboard Navigation** (กดลูกศร `ArrowDown`, `ArrowUp` วนลูป, `Enter`, `Tab`, `Escape`) พร้อม Active Highlight (`rgba(59, 130, 246, 0.25)`) และ `scrollIntoView`
  - เพิ่ม **Built-in Domain Keywords Dictionary** ครอบคลุมคำสั่งประจำวิชาทั้ง 12 แท็กวิชา (ตั้งแต่ API `request`, `get`, `status` ไปจนถึง SQL, RF, k6, Security, a11y, และ DS&A)
  - เพิ่ม **Pair Backspace Deletion** ลบคู่เครื่องหมาย (`''`, `""`, `()`, `{}`, `[]`) พร้อมกันเมื่อกด Backspace
  - เพิ่ม **Smart Enter Indentation** เมื่อกด Enter ภายใน `{}` จะยุบย่อหน้า 2 ช่องและขึ้นบรรทัดใหม่อัตโนมัติ
- **ทำไมถึงทำ:** ผู้เรียนได้รับประสบการณ์การเขียนโค้ดที่ลื่นไหล สมจริงใกล้เคียง IDE ยุคใหม่ (VS Code / WebStorm) และไม่ต้องเสียเวลาพิมพ์ชื่อคำสั่งยาวๆ เองทั้งหมด

---

### 2. ⚠️ Case-Sensitivity Guard
- **ไฟล์ที่เกี่ยวข้อง:** `API-Testing/course.js`, `Playwright/course.js`, `shared/test-case-sensitivity-guard.mjs`
- **สิ่งที่ทำ:** 
  - สแกนจับโค้ดที่ใช้ HTTP Methods ตัวพิมพ์ใหญ่ เช่น `.GET()`, `.POST()` แล้วแสดงข้อความแนะนำเป็นภาษาไทยว่า *"Playwright และ JavaScript เป็น Case-sensitive กรุณาใช้ตัวพิมพ์เล็ก .get() เท่านั้น"*
- **ทำไมถึงทำ:** ผู้เรียนที่ย้ายมาจาก Tool อื่น (เช่น Cypress หรือ Postman) มักติดสับสนใช้ตัวพิมพ์ใหญ่ การแสดงข้อความตรงจุดช่วยให้เข้าใจข้อผิดพลาดและปรับพฤติกรรมทันที

---

### 3. 🇯🇵 Final Project: Japan Concert Trip (All-in-One Capstone Suite)
- **ไฟล์ที่เกี่ยวข้อง:** `Final-Project/course.js`, `Final-Project/index.html`, `Final-Project/style.css`, `index.html` (Main Hub)
- **สิ่งที่ทำ:** 
  - ออกแบบระบบโปรเจกต์จบ **Japan Concert Trip Capstone** (วันบินออก 14 ต.ค. 2026 / ดูคอนเสิร์ต Tokyo Dome 16 ต.ค. 2026 / บินกลับ 18 ต.ค. 2026)
  - วางโครงสร้างเป็น **9-Step Software & QA Engineering Lifecycle Architecture**:
    1. **`Step 1/9` [Framework Design]:** วางโครงสร้าง Base Config (`baseURL`, `trace`) ตั้งแต่ต้น
    2. **`Step 2/9` [DB Design]:** ออกแบบตาราง SQL `japan_trip_bookings`
    3. **`Step 3/9` [Backend API]:** เขียน Playwright API Test ยิง POST `/api/japan-trip/book` บันทึกลง DB
    4. **`Step 4/9` [Security & Visa]:** เขียน API Guard ตรวจพาสปอร์ตไทย & ฟรีวีซ่า 15 วัน (`visaRequired: false`)
    5. **`Step 5/9` [Web UI Automation]:** เขียน Playwright Web UI Test (POM) เลือกวันเดินทาง 14 ต.ค. และกดยืนยันจอง
    6. **`Step 6/9` [Mobile App Automation]:** เขียน Robot Framework เปิดแอปมือถือ `/mobile/e-ticket` ดึง QR Code
    7. **`Step 7/9` [Performance k6]:** เขียน k6 Load Test จำลองแฟนคลับ 1,000 VUs แย่งกดตั๋วพร้อมกัน
    8. **`Step 8/9` [CI/CD Pipeline]:** รวมสคริปต์จาก Step 1-7 ไปรันบน GitHub Actions YAML
    9. **`Step 9/9` [⭐ DS&A Bonus Challenge]:** เขียน Binary Search O(log n) ค้นหาราคาตั๋วเครื่องบินที่ดีที่สุด (สำหรับสายโหด!)
  - ออกแบบ UI มีแบนเนอร์ Capstone, กล่อง **Mock Elements Preview Grid** (#departure-date, #confirm-booking-btn, ฯลฯ), และปุ่ม Hint / Solution
- **ทำไมถึงทำ:** เปลี่ยนผู้เรียนจาก "คนเขียนโค้ดแยกข้อ" ให้เป็น "Senior/Staff QA Engineer" ที่มองภาพรวมและวางโครงสร้าง Automation Infrastructure ของระบบจริงได้ครบตั้งแต่ต้นจนจบ

---

## 📋 Task Checklist สำหรับพรุ่งนี้ (Next Session Continuation)

### Phase 1: Refine Course Content & Pedagogical Alignment (ปรับเนื้อหาคอร์สเรียน)
- [ ] **ปรับเนื้อหา 12 แท็กวิชาให้สอดรับกับ Capstone Lifecycle:**
  - ทบทวนโจทย์และเนื้อหาในวิชา `Framework-Design`, `Playwright`, และ `API-Testing` ให้มี Keyword/Concept ที่เชื่อมโยงเข้ากับโปรเจกต์จบอย่างเป็นธรรมชาติ
- [ ] **ตรวจสอบความถูกต้องของ Theory & Examples:**
  - เช็คว่าทุกบทเรียนใน 12 วิชาสอดคล้องกับ 4-Block Standard (Goal, Matrix/Comparison, Code Snippet, Common Pitfall)

### Phase 2: Refine UI/UX Design & Visual Polish (ปรับ Design & Layout)
- [ ] **ปรับปรุง UI หน้าคอร์สเรียนและ Final Project ให้สวยงามพรีเมียม:**
  - ยกระดับ Aesthetics (Glassmorphism, Vibrant Color Badges, Responsive Layout สำหรับ Mobile/Tablet)
  - เพิ่ม Visual Indicators บอกสถานะความคืบหน้าของแต่ละ Step ใน Capstone Sidebar
- [ ] **ปรับแต่ง E-Ticket & Mock Web Preview Card:**
  - ขยายกล่อง UI Elements Preview ให้มีปุ่มกดจำลอง (Interactive Mock Component) บนหน้าเว็บเพื่อให้ผู้เรียนลองกดดูหน้าตาตั๋ว E-Ticket จริงได้

### Phase 3: Verification & Release
- [ ] **รัน `npm test` แบบเต็มรูปแบบ:** ตรวจสอบ 245 บทเรียน (490 checks) ให้เขียว 100%
- [ ] **ตัด Git Commit & Tag Release ใหม่:** หากมีการปรับแก้เพิ่มเติมในคอร์ส

---

## 🧪 Status Verification
- `npm test` passed 100% clean (245 lessons, 490 checks passed, 0 failed)
- Git branch `main` at commit `41478ee` tagged `v0.9.1` pushed to origin remote.
