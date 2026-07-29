# Feature Plan: Course Content Readability & Pedagogical Upgrade

**Status:** COMPLETED (100% of all lessons across 12 tracks upgraded to 4-block standard on branch `feature/course-content-upgrade`, uncommitted as requested)  
**Target:** All 12 Course Tracks (`course.js` files)  
**Created:** 2026-07-29  

---

## 🎯 Overview & Objectives
Upgrade the `theory` content across all 12 course tracks in `QA-Automation-Coding-Course` to improve readability, visual hierarchy, and pedagogical flow for learners.

### 📐 4-Block Standard Structure for `theory` fields:
1. **🎯 Goal & Key Takeaway:** 1-2 sentence punchy summary of the lesson target.
2. **⚖️ Comparison / Concept Matrix:** HTML table or structured bullets comparing Before vs After, Good vs Bad, or decision criteria.
3. **💡 Mental Model & Code Snippet:** Clean 3-5 line code example with HTML tags (`<code>`, `<strong>`).
4. **🚨 Common Pitfall:** 1-line callout box warning learners about common mistakes.

---

## 📋 Task Checklist (12 Tracks)

- [x] **Track 1: Playwright E2E Testing** (`Playwright/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Locator vs ElementHandle comparison, Auto-waiting vs `waitForTimeout` visual tips
- [x] **Track 2: Robot Framework** (`Robot-Framework/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Visual Syntax Map, Variable scope table (`$`, `@`, `&`), Browser Library vs Selenium
- [x] **Track 3: API Testing** (`API-Testing/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add HTTP Method matrix, Status code table, Asymmetric Matchers cheat sheet (`toHaveLength`, `toMatchObject`, `expect.any`)
- [x] **Track 4: Performance Testing** (`Performance-Testing/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Load test types matrix (Smoke, Load, Stress, Spike), VUs timeline, Thresholds guide
- [x] **Track 5: DB Design & SQL** (`DB-Design-SQL/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add SQL Execution Order map, JOIN types visual matrix, Normalization rule checklist
- [x] **Track 6: CLI Essentials** (`CLI-Essentials/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Unix command cheat table, Git workflow stage diagram, Vim mode cheat sheet
- [x] **Track 7: Security Testing** (`Security-Testing/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add OWASP Vulnerability -> Exploit -> Prevention matrix, Payload breakdown, Security Headers
- [x] **Track 8: Accessibility Testing** (`Accessibility-Testing/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add WCAG 4 Principles (POUR) table, Native HTML vs ARIA checklist, Keyboard focus trap pattern
- [x] **Track 9: Visual Regression Testing** (`Visual-Regression-Testing/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Visual Snapshot Diff vs DOM Assertion table, Masking & Threshold tuning rules
- [x] **Track 10: CI/CD Pipeline** (`CI-CD-Pipeline/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add GitHub Actions Anatomy map, YAML syntax cheat table, Artifacts vs Caching
- [x] **Track 11: Framework Design** (`Framework-Design/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Architecture diagram, DRY principle checklist, Custom Fixtures vs Helpers table
- [x] **Track 12: Data Structures & Algorithms** (`Data-Structures-Algorithms/course.js`)
  - Refactor `theory` for all lessons into 4-block standard
  - Add Big-O Time & Space Complexity cheat table, Data Structure selection guide for QA

---

## 🤖 AI Execution Prompt Reference

```markdown
คุณได้รับมอบหมายให้ทำการ Upgrade เนื้อหาทฤษฎี (field `theory`) ของคอร์สเรียน QA-Automation-Coding-Course ทั้งหมด 12 Tracks ที่อยู่ในไฟล์ `course.js` ของแต่ละโฟลเดอร์

### 🎯 เป้าหมาย:
ปรับปรุงข้อความทฤษฎีในฟิลด์ `theory` ของทุกๆ LESSON ในคอร์สให้อ่านง่าย มี Visual Hierarchy สูง สแกนสายตาง่าย และลดความล้าในการอ่านของผู้เรียน โดยคงความกระชับและถูกต้องเชิงเทคนิคไว้ 100%

### 📐 กฎการปรับปรุง (Pedagogical & Formatting Rules):
1. ใช้ 4-Block Structure ในทุกบทเรียน (🎯 Goal, ⚖️ Comparison/Table, 💡 Code & Mental Model, 🚨 Common Pitfall)
2. ใช้ HTML Formatting ที่สะอาด (<table>, <ul>, <li>, <code>, <strong>, <span>)
3. รักษาไวยากรณ์และความถูกต้องของไฟล์ JavaScript แก้ไขเฉพาะข้อความในฟิลด์ `theory` เท่านั้น
```
