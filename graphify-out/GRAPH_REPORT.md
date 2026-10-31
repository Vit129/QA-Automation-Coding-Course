# Graph Report - graphify-track  (2026-10-31)

## Corpus Check
- 193 files · ~307,025 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4725 nodes · 5711 edges · 267 communities (236 shown, 31 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 204 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e67c72a6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `LESSONS` - 67 edges
2. `LESSONS` - 43 edges
3. `LESSONS` - 39 edges
4. `LESSONS` - 34 edges
5. `LESSONS` - 29 edges
6. `Changelog` - 28 edges
7. `LESSONS` - 23 edges
8. `LESSONS` - 19 edges
9. `LESSONS` - 19 edges
10. `LESSONS` - 19 edges

## Cross-Cutting Nodes (span the most distinct areas of the codebase)
A high-degree node isn't always architecturally central - a widely-used
utility/config file can rack up more edges than a real coupler while only
ever touching one area. This ranks by how many DIFFERENT communities a
node's neighbors span, not by raw edge count.
1. `Changelog` - bridges 21 areas (28 edges)
2. `LESSONS` - bridges 1 areas (67 edges)
3. `LESSONS` - bridges 1 areas (43 edges)
4. `LESSONS` - bridges 1 areas (39 edges)
5. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
6. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
7. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
8. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
9. `@media (max-width: 480px)` - bridges 1 areas (17 edges)
10. `@media (max-width: 480px)` - bridges 1 areas (17 edges)

## Surprising Connections (you probably didn't know these)
- `initExamPage()` --indirect_call--> `handleTextareaKeydown()`  [INFERRED]
  shared/exam-engine.js → shared/engine.js

## Import Cycles
- None detected.

## Communities (267 total, 31 thin omitted)

### Community 0 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 1 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 2 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 3 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 4 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 5 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 6 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 7 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 8 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 9 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 10 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 11 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 12 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 13 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 14 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 15 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 16 - "style.css"
Cohesion: 0.02
Nodes (113): :root, .sidebar-header, @keyframes bounce{
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}, .sidebar-title, .sidebar-title span, .content-block, .content-block.theory, .content-block.example (+105 more)

### Community 17 - "LESSONS"
Cohesion: 0.03
Nodes (67): LESSONS, Git Add -p: Stage เฉพาะบางส่วนของไฟล์ (Patch Mode), Git Commit --amend: แก้ไข Commit ล่าสุดโดยไม่สร้างใหม่, Git Bisect: หา Commit ต้นเหตุของบั๊กด้วย Binary Search, Git Cherry-pick: หยิบ Commit เดียวจาก Branch อื่นมาใช้, Git Clone: ดึง Repository ที่มีอยู่แล้วมาไว้ในเครื่อง, Git Diff: ดูว่าเปลี่ยนอะไรไปบ้างก่อน Commit, Git Fetch: ดึงข้อมูลใหม่จาก Remote แบบปลอดภัย (ไม่ Merge อัตโนมัติ) (+59 more)

### Community 18 - "exam-engine.js"
Cohesion: 0.08
Nodes (57): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+49 more)

### Community 19 - "LESSONS"
Cohesion: 0.05
Nodes (43): LESSONS, AI-Generated Detection Rules: อย่าเชื่อ ให้ validate ก่อน Deploy เข้าระบบ Production, Securing AI: ป้องกัน Prompt Injection เมื่อป้อน Log/ข้อมูลผู้ใช้เข้า LLM (OWASP LLM Top 10), AI-Assisted Triage: ให้ LLM ช่วยจัดลำดับ Alert แต่ enforce กติกาด้วยโค้ด (Human-in-the-loop), Authentication Gate: ใช้ Default-Deny ปิดช่องโหว่ Endpoint ที่ลืมผูก Auth, Business Continuity & Disaster Recovery: RTO, RPO และการเลือก Hot/Warm/Cold Site, IDOR & BOLA: Horizontal vs Vertical Privilege Escalation (OWASP #1 Broken Access Control), CIA Triad & Zero Trust: เสาหลักความปลอดภัยและสถาปัตยกรรม Never Trust, Always Verify (+35 more)

### Community 20 - "LESSONS"
Cohesion: 0.05
Nodes (37): LESSONS, Advanced Execution & Auth, Assertions & Waits (Auto-retry), Core Concepts & Types ที่ต้องรู้, Systematic Debugging & Trace, Confirm Dialog: ลบข้อมูลต้องผ่านการยืนยันก่อนเสมอ, File Size Validation: UI ต้องปฏิเสธไฟล์ใหญ่เกินโดยไม่ต้องมีไฟล์จริง, File Type Validation: UI ต้องแจ้ง Error เมื่ออัปโหลดไฟล์ผิดประเภท (+29 more)

### Community 21 - "LESSONS"
Cohesion: 0.05
Nodes (35): execLearnerCode(), getLearnerClass(), getLearnerFn(), LESSONS, Concurrency: async/await พื้นฐาน, Functional Programming: Currying, Concurrency: Event Loop — Microtask vs Macrotask, Functional Programming: Function Composition (+27 more)

### Community 22 - "index.html"
Cohesion: 0.05
Nodes (36): #badges-row, #card-api, #card-cicd, #card-cli, #card-dsa, #card-moderncli, #card-oop, #card-perf (+28 more)

### Community 23 - "LESSONS"
Cohesion: 0.05
Nodes (39): LESSONS, Retry Wrapper: ห่อฟังก์ชัน Async ให้ลองใหม่อัตโนมัติเมื่อ Fail, Test Data Factory: สร้าง Mock Object ใหม่ทุกครั้งพร้อม Unique ID, Custom Fixtures: ฉีดค่าที่ Test ต้องใช้ซ้ำๆ โดยไม่ต้อง Setup เอง, Environment-based Config: สลับ Base URL ตาม Environment พร้อม Safety Guard, Fixture Composition: ให้ Fixture หนึ่งพึ่งพา Fixture อื่นที่สร้างไว้แล้ว, โครงสร้างโฟลเดอร์: แยกหน้าที่ให้ชัด ไม่ใช่โยนทุกอย่างลงที่เดียว, ทำไมต้องออกแบบ Framework: ปัญหาของ \"ไฟล์เดียวยาวเป็นพันบรรทัด\ (+31 more)

### Community 24 - "LESSONS"
Cohesion: 0.07
Nodes (27): execLearnerCode(), getLearnerFn(), LESSONS, Array vs Linked List: โครงสร้างข้อมูลพื้นฐานสองแบบ, BFS: หาระยะทางสั้นที่สุดระหว่าง Job สองตัวใน Dependency Graph, Big-O Notation: ทำไม Test Suite ถึงรันช้าลงเรื่อยๆ เมื่อข้อมูลโต, Searching: Linear vs Binary Search สำหรับ Test Oracle, Binary Search Tree: โครงสร้างที่เรียงลำดับตัวเองอัตโนมัติ (+19 more)

### Community 25 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 26 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 27 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 28 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 29 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 30 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 31 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 32 - "index.html"
Cohesion: 0.08
Nodes (24): #code-setup, #editor-gutter, #editor-textarea, #exam-editor-container, #exam-mcq-choices, #exam-next-btn, #exam-prev-btn, #exam-progress-label (+16 more)

### Community 33 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 34 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 35 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 36 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 37 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 38 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 39 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 40 - "LESSONS"
Cohesion: 0.09
Nodes (24): LESSONS, System CLI & Applescript Integration, RF Assertions & Validation, Custom Python Libraries, Debug Flaky Test: แก้ Sleep คงที่ด้วย Explicit Wait ให้ถูกจุด, Confirm Dialog: เช็ค Accessibility Identifier ก่อน Automate เสมอ, RF Directory Constraints, File Import: เปิดโฟลเดอร์ผ่าน NSOpenPanel ด้วยคีย์ลัด (+16 more)

### Community 41 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 42 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 43 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 44 - "engine.js"
Cohesion: 0.20
Nodes (24): applySolution(), AUTO_CLOSE_PAIRS, closeDialog(), escapeHtml(), getFirstIncompleteIndex(), handleAutoClosePair(), handlePairBackspace(), handleSmartEnter() (+16 more)

### Community 45 - "LESSONS"
Cohesion: 0.09
Nodes (21): LESSONS, Reporting ขั้นสูง: หา Test Suite ที่มี Test Case FAIL เกินเกณฑ์ (JOIN + GROUP BY + HAVING), ออกแบบ Schema แบบ Normalized: จากตารางเดียวที่ข้อมูลซ้ำซ้อน สู่ 3 ตารางที่เชื่อมด้วย Foreign Key, Aggregate Function: รวมมูลค่าพอร์ตต่อ Broker, Data Integrity Check: ยืนยันว่าลบข้อมูลจริงหลัง Action, เลือก Data Type ให้ถูกงาน: BOOLEAN สำหรับค่าใช่/ไม่ใช่, Filter และเรียงลำดับ: หา Holdings มูลค่าสูงสุด, FOREIGN KEY: บังคับให้ข้อมูลอ้างอิงต้องมีอยู่จริง (+13 more)

### Community 46 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 47 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 48 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 49 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 50 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 51 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 52 - "course.js"
Cohesion: 0.12
Nodes (17): createMockExpect(), formatPhaseProgress(), LESSONS, 3. [Phase 3] Booking Execution & Visa Compliance Integration Specification, 7. [Phase 7] Continuous Integration & Pipeline Specification, 2. [Phase 2] Database Schema Architecture Specification, 8. [Phase 8 ⭐ Bonus] Algorithmic Engineering Specification, 1. [Phase 1] Test Framework & Environment Specification (+9 more)

### Community 53 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 54 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 55 - "LESSONS"
Cohesion: 0.10
Nodes (21): LESSONS, bat -r: แสดงเฉพาะช่วงบรรทัดที่ต้องการดู, bat: แสดงเนื้อหาไฟล์พร้อม Syntax Highlighting และเลขบรรทัด, eza: แสดงรายชื่อไฟล์พร้อมรายละเอียดและสถานะ Git, eza --tree: แสดงโครงสร้างไดเรกทอรีเป็นแผนผังต้นไม้, fd: ค้นหาไฟล์ความเร็วสูงและ Syntax จำง่าย, fd -x: ค้นหาพร้อมสั่งรันคำสั่งอื่นต่อเนื่อง (Execute), fd -e: กรองค้นหาเฉพาะนามสกุลไฟล์ที่ต้องการ (+13 more)

### Community 56 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 57 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 58 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 59 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 60 - "LESSONS"
Cohesion: 0.10
Nodes (18): execLearnerCode(), getLearnerClass(), getLearnerFn(), LESSONS, Concurrency: async/await พื้นฐาน, Functional Programming: Currying, Concurrency: Event Loop — Microtask vs Macrotask, Functional Programming: Function Composition (+10 more)

### Community 61 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 62 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 63 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 64 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 65 - "index.html"
Cohesion: 0.09
Nodes (21): #active-filename, #current-lesson-title, #dialog-action-btn, #dialog-content, #dialog-overlay, #dialog-title, #editor-gutter, #editor-tabs (+13 more)

### Community 66 - "LESSONS"
Cohesion: 0.11
Nodes (19): contrastRatio(), hexToRgb(), LESSONS, เจาะจงกฎ ARIA: สแกนเฉพาะ aria-required-attr ด้วย axe-core, รวมปัญหา: แก้ Accessibility Violations พร้อมกันหลายจุด, Alt Text: รูปภาพต้องมีคำอธิบายสำหรับ Screen Reader, ARIA Label: ปุ่มไอคอนอย่างเดียวต้องมีชื่อให้ Screen Reader อ่านได้, Color Contrast: WCAG Failure ที่พบบ่อยที่สุด (+11 more)

### Community 67 - "1. Formal Normal Forms (NF) in DB-Design-SQL"
Cohesion: 0.10
Nodes (20): 1. Formal Normal Forms (NF) in DB-Design-SQL, 2. New Track: Data Structures & Algorithms for QA, 3. New Track: Test Design Theory, 4. Roadmap — what else, given 137 lessons across 11 tracks already, Content depth imbalance, Context, Decisions, Decisions (+12 more)

### Community 68 - "LESSONS"
Cohesion: 0.10
Nodes (16): LESSONS, Retry Wrapper: ห่อฟังก์ชัน Async ให้ลองใหม่อัตโนมัติเมื่อ Fail, Test Data Factory: สร้าง Mock Object ใหม่ทุกครั้งพร้อม Unique ID, Custom Fixtures: ฉีดค่าที่ Test ต้องใช้ซ้ำๆ โดยไม่ต้อง Setup เอง, Environment-based Config: สลับ Base URL ตาม Environment พร้อม Safety Guard, Fixture Composition: ให้ Fixture หนึ่งพึ่งพา Fixture อื่นที่สร้างไว้แล้ว, โครงสร้างโฟลเดอร์: แยกหน้าที่ให้ชัด ไม่ใช่โยนทุกอย่างลงที่เดียว, ทำไมต้องออกแบบ Framework: ปัญหาของ \"ไฟล์เดียวยาวเป็นพันบรรทัด\ (+8 more)

### Community 69 - "test-exam-editor-wiring.mjs"
Cohesion: 0.10
Nodes (9): __dirname, documentMock, elements, loadListeners, MockElement, overlay, sandbox, textarea (+1 more)

### Community 70 - "LESSONS"
Cohesion: 0.11
Nodes (18): LESSONS, Custom Headers & API Key Authentication, Session/Token Authentication: Login แล้วแนบ Token ใช้ข้าม Request (Mock Endpoint), Chained Request Workflow: สร้าง Resource แล้วดึงข้อมูลกลับด้วย id ที่ได้จาก Response (Mock Endpoint), Capstone: Comma-separated Query Params, File Import: ตรวจสอบไฟล์ผิดรูปแบบก่อนประมวลผล (Mock Endpoint), File Size Validation: ปฏิเสธไฟล์ใหญ่เกินก่อนจะกินหน่วยความจำ (Mock Endpoint), File Type Validation: ปฏิเสธไฟล์ผิดประเภทก่อนประมวลผล (Mock Endpoint) (+10 more)

### Community 71 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 72 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 73 - "LESSONS"
Cohesion: 0.12
Nodes (16): LESSONS, Debug Pipeline: ทำไม Deploy ถึงรันก่อน Test เสร็จ, Multi-Job Pipeline: ส่งไฟล์ข้าม Job ด้วย needs + Artifact Hand-off, continue-on-error: Job แบบ Advisory ที่ไม่ควรบล็อกการ Merge, Artifact Upload: เอาหลักฐาน Test ที่ Fail ออกมาจาก CI ให้ได้, Caching: อย่าโหลด Dependency ใหม่ทุกครั้งถ้าไม่จำเป็น, Concurrency: ยกเลิก Run เก่าที่ล้าสมัยแล้วอัตโนมัติ, env: กำหนดตัวแปรระดับ Workflow เพื่อ Pin เวอร์ชัน Dependency (+8 more)

### Community 74 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 75 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 76 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 77 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 78 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 79 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 80 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 81 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 82 - "LESSONS"
Cohesion: 0.12
Nodes (15): LESSONS, หลาย Scenarios พร้อมกัน + Compound check(): ตรวจทั้ง Status และ Body พร้อมกัน, รวม Stages กับ Thresholds แบบ Compound: ต้องผ่านทั้ง Latency และ Error Rate พร้อมกัน, Custom Metrics: นับเหตุการณ์เฉพาะที่ k6 ไม่ได้วัดให้อัตโนมัติ, group(): จัดกลุ่ม Multi-step Transaction ในรายงานผล, แนะนำความรู้พื้นฐาน k6, Options: กำหนดจำนวน Virtual User และระยะเวลา, Load Test ชนกับ Rate Limit จริง: ต้องคาดการณ์ 429 ไว้ล่วงหน้า (+7 more)

### Community 83 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 84 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 85 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 86 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 87 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 88 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 89 - "LESSONS"
Cohesion: 0.12
Nodes (15): LESSONS, จัดกลุ่ม Baseline เป็นโฟลเดอร์ด้วย Array Path Naming, JS/Canvas Chart Animation: จุดที่ animations:'disabled' และ reducedMotion เอาไม่อยู่, Clip: ถ่ายภาพเฉพาะพิกัดที่ต้องการ, รวมร่าง: Mask หลาย Element พร้อม Threshold ในการถ่ายภาพเดียว, Debug Flaky Test: Font โหลดไม่ทัน + CSS Animation กำลังเล่นอยู่, Full Page Screenshot: ถ่ายภาพทั้งหน้าที่ยาวเกินจอ, Visual Regression Testing คืออะไร: จับบั๊กที่ Functional Test มองไม่เห็น (+7 more)

### Community 90 - "@media (max-width: 480px)"
Cohesion: 0.12
Nodes (17): @media (max-width: 480px), .sidebar, .main-header, #current-lesson-title, .header-actions, .header-actions .btn, .panel-body, .editor-header (+9 more)

### Community 91 - "Changelog"
Cohesion: 0.14
Nodes (13): [0.10.1] - 2026-08-01, [0.11.1] - 2026-08-01, [0.12.0] - 2026-08-25, [0.13.0] - 2026-08-29, [0.8.4] - 2026-07-30, [0.9.4] - 2026-07-31, Added, Added (+5 more)

### Community 92 - "pages.yml"
Cohesion: 0.14
Nodes (13): concurrency, cancel-in-progress, group, jobs, deploy, name, on, push (+5 more)

### Community 93 - "Curriculum Overview (9 Modules, 42 Interactive Lessons)"
Cohesion: 0.15
Nodes (12): Application Security & Cyber Defense Track, Curriculum Overview (9 Modules, 42 Interactive Lessons), Module 1: Cybersecurity Fundamentals & Threat Modeling (Security+ Core), Module 2: Cryptography & Identity Defense, Module 3: Deep-Dive OWASP Top 10 & Offensive AppSec, Module 4: Security Architecture & Web Defense, Module 5: DevSecOps, Incident Response & Operations, Module 6: Governance, Risk & Compliance (Security+ Domain 5 ~20%) (+4 more)

### Community 94 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 95 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 96 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 97 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 98 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 99 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 100 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 101 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 102 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 103 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 104 - "package.json"
Cohesion: 0.17
Nodes (11): description, devDependencies, alasql, name, private, scripts, release, ship (+3 more)

### Community 105 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 106 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 107 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 108 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 109 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 110 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 111 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 112 - "editor-autocomplete.js"
Cohesion: 0.38
Nodes (11): acceptEditorAutocomplete(), acceptEditorAutocompleteClick(), BUILTIN_KEYWORDS, getCaretPixelPosition(), getCurrentWord(), getEditorAutocompleteEl(), getKnownWords(), handleEditorAutocompleteKeydown() (+3 more)

### Community 113 - "course.js"
Cohesion: 0.24
Nodes (6): execLearnerCode(), FWK_MIGRATION_IDS, getLearnerClass(), getLearnerClasses(), runSandboxCode(), showGraduationMessage()

### Community 114 - "test-normal-forms.mjs"
Cohesion: 0.20
Nodes (7): __dirname, failures, lessonById, LESSONS, require, sandbox, src

### Community 115 - "QA-Automation-Coding-Course — Agent Instructions"
Cohesion: 0.22
Nodes (8): Agent Memory, Agent skills, Domain docs, graphify, Issue tracker, QA-Automation-Coding-Course — Agent Instructions, Tests, Triage labels

### Community 116 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 117 - "mcq-logic.js"
Cohesion: 0.28
Nodes (6): allocateByDomain(), api, buildMcqExam(), DOMAIN_NAMES, DOMAIN_WEIGHTS, shuffle()

### Community 118 - "renderProgress"
Cohesion: 0.22
Nodes (9): applyProgressData(), countCompleted(), downloadElementAsImage(), fireConfetti(), importProgress(), notifyNewBadges(), renderProgress(), showBadgeToast() (+1 more)

### Community 119 - "test-complexity-lessons.mjs"
Cohesion: 0.22
Nodes (6): __dirname, failures, lessonById, LESSONS, sandbox, src

### Community 120 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 121 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 122 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 123 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 124 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 125 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 126 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 127 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 128 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 129 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 130 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 131 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 132 - "Product"
Cohesion: 0.25
Nodes (7): Core Features, Core Problems, Out of Scope, Product, Success Metrics, Target Users, Vision

### Community 133 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 134 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 135 - "course.js"
Cohesion: 0.32
Nodes (5): execLearnerCode(), getLearnerFn(), LEGACY_ID_MIGRATIONS, runSandboxCode(), showGraduationMessage()

### Community 136 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 137 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 138 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 139 - "editor-highlight.js"
Cohesion: 0.46
Nodes (7): getEditorHighlightKeywordRegex(), getEditorHighlightLayer(), highlightKeywordsInChunk(), initEditorHighlight(), syncEditorHighlightScroll(), tokenizeToHtml(), updateSyntaxHighlight()

### Community 140 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 141 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 142 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 143 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 144 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 145 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 146 - "Design System"
Cohesion: 0.29
Nodes (6): Avoid, Colors, Components, Design Direction, Design System, Typography

### Community 147 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 148 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 149 - "test.yml"
Cohesion: 0.29
Nodes (6): jobs, selftest, name, on, pull_request, push

### Community 150 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 151 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 152 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 153 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 154 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 155 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 156 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 157 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 158 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 159 - "selftest.mjs"
Cohesion: 0.29
Nodes (5): __dirname, failures, require, ROOT, TRACKS

### Community 160 - "editor-enhancements.js"
Cohesion: 0.48
Nodes (6): detectEditorCommentMarker(), EDITOR_DEDENT_CLOSERS, handleAutoDedentOnClose(), handleEditorEnhancementsKeydown(), initEditorEnhancements(), toggleEditorLineComment()

### Community 161 - "QA Automation Coding Course — System Architecture"
Cohesion: 0.33
Nodes (5): Architecture Layout, Constraints, QA Automation Coding Course — System Architecture, Stack & Components, Track Structure Pattern

### Community 162 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 164 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 165 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 166 - "[0.5.0] - 2026-07-21"
Cohesion: 0.40
Nodes (5): [0.5.0] - 2026-07-21, Added, Changed, Documentation, Fixed

### Community 167 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 168 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 169 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 170 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 171 - "1. Cross-Device Progress Sync via File Export/Import Instead of CloudKit/OAuth"
Cohesion: 0.40
Nodes (4): 1. Cross-Device Progress Sync via File Export/Import Instead of CloudKit/OAuth, Consequences, Context, Decision

### Community 172 - "Domain Docs"
Cohesion: 0.40
Nodes (4): Before exploring, read these, Domain Docs, Flag ADR conflicts, Use the glossary's vocabulary

### Community 173 - "Issue tracker: GitHub"
Cohesion: 0.40
Nodes (4): Conventions, Issue tracker: GitHub, When a skill says "fetch the relevant ticket", When a skill says "publish to the issue tracker"

### Community 174 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 175 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 176 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 177 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 178 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 179 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 180 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 181 - "QA Automation Coding Course"
Cohesion: 0.40
Nodes (4): License, QA Automation Coding Course, Run, Tracks

### Community 182 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 183 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 184 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 185 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 187 - "test-editor-highlight.mjs"
Cohesion: 0.50
Nodes (4): __dirname, escapeHtml(), highlightCode, loadSandbox()

### Community 188 - "test-editor-highlight-sync.mjs"
Cohesion: 0.40
Nodes (3): __dirname, engineCode, highlightCode

### Community 190 - "gamification.js"
Cohesion: 0.50
Nodes (3): downloadElementAsImage(), MILESTONES, showTrackCertificate()

### Community 191 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 192 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 193 - "[0.14.0] - 2026-10-25"
Cohesion: 0.50
Nodes (4): [0.14.0] - 2026-10-25, Added, Documentation, Fixed

### Community 194 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 195 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 196 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 197 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 198 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 199 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 200 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 201 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 202 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 203 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 204 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 205 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 206 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 207 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 208 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 209 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 210 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 214 - "@media (max-width: 768px)"
Cohesion: 0.50
Nodes (4): @media (max-width: 768px), .sidebar, .main-header, .panel-body

### Community 215 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 216 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 217 - "[0.10.0] - 2026-08-01"
Cohesion: 0.67
Nodes (3): [0.10.0] - 2026-08-01, Added, Fixed

### Community 218 - "[0.10.2] - 2026-08-01"
Cohesion: 0.67
Nodes (3): [0.10.2] - 2026-08-01, Documentation, Fixed

### Community 219 - "[0.11.0] - 2026-08-01"
Cohesion: 0.67
Nodes (3): [0.11.0] - 2026-08-01, Added, Documentation

### Community 220 - "[0.6.1] - 2026-07-22"
Cohesion: 0.67
Nodes (3): [0.6.1] - 2026-07-22, Added, Fixed

### Community 221 - "[0.8.0] - 2026-07-29"
Cohesion: 0.67
Nodes (3): [0.8.0] - 2026-07-29, Added, Fixed

### Community 222 - "[0.8.3] - 2026-07-30"
Cohesion: 0.67
Nodes (3): [0.8.3] - 2026-07-30, Added, Fixed

### Community 223 - "[0.9.2] - 2026-07-31"
Cohesion: 0.67
Nodes (3): [0.9.2] - 2026-07-31, Added, Documentation

### Community 224 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 228 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 231 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 232 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 233 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 234 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 235 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 236 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 237 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 238 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 239 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 240 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 241 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 242 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

### Community 243 - "@media (max-width: 1100px)"
Cohesion: 0.67
Nodes (3): @media (max-width: 1100px), .workspace, .panel-left

## Knowledge Gaps
- **3368 isolated node(s):** `name`, `push`, `workflow_dispatch`, `contents`, `pages` (+3363 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.
- **15 possibly unreachable function(s):** `__dirname`, `__dirname`, `__dirname`, `__dirname`, `__dirname` (+10 more)
  Not reached from any recognized entry point - could be dead code, or dynamically dispatched/decorator-registered.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@media (max-width: 480px)` connect `@media (max-width: 480px)` to `style.css`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `@media (max-width: 480px)` connect `@media (max-width: 480px)` to `style.css`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `@media (max-width: 480px)` connect `@media (max-width: 480px)` to `style.css`?**
  _High betweenness centrality (0.000) - this node is a cross-community bridge._
- **What connects `name`, `push`, `workflow_dispatch` to the rest of the system?**
  _3368 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `style.css` be split into smaller, more focused modules?**
  _Cohesion score 0.017543859649122806 - nodes in this community are weakly interconnected._
- **Should `style.css` be split into smaller, more focused modules?**
  _Cohesion score 0.017543859649122806 - nodes in this community are weakly interconnected._
- **Should `style.css` be split into smaller, more focused modules?**
  _Cohesion score 0.017543859649122806 - nodes in this community are weakly interconnected._