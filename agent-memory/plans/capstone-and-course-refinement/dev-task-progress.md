# Feature Plan & Task Progress: Capstone Architecture & PRD Spec Refinement

**Status:** COMPLETED_V093 (PRD & AC Spec standard + integration redesign; 9 Phases → 8 Phases)  
**Target:** Final Project Capstone (`Final-Project/`) & All 12 Course Tracks  
**Created:** 2026-07-30 | **Updated:** 2026-07-31  
**Latest Release:** `v0.9.2` (Git commit tagged & pushed to GitHub) — v0.9.3 integration redesign applied on top, not yet tagged/released

---

## 🎯 Overview & Context (สิ่งที่ปรับเปลี่ยน สไตล์ PRD Spec & AC)

### 🏛️ เปลี่ยนโฉมเนื้อหาฝั่งซ้าย: จาก "บทเรียนแบบฝึกหัด" เป็น "Engineering Architecture Spec (PRD / AC Sheet)"
- **เป้าหมาย:** ปรับเปลี่ยน Mindset ผู้เรียนจากการเป็น *"นักเรียนทำแบบฝึกหัดส่งครู"* ให้กลายเป็น **"Senior/Staff QA Engineer ที่อ่าน PRD & Acceptance Criteria (AC) เพื่อออกแบบและสร้างระบบจริงระดับ Production"**
- **โครงสร้างสเปก 3 ส่วนประจำทุก Phase:**
  1. 📌 **1. Business & Architectural Context:** บริบททางธุรกิจและเป้าหมายสถาปัตยกรรมระบบ
  2. 📋 **2. System Requirements & Acceptance Criteria (AC):** เกณฑ์การรับรองระบบแบบ `[AC-101]`, `[AC-102]`
  3. 🏗️ **3. Production Constraints:** ข้อกำหนดและข้อควรระวังในระดับระบบโปรดักชันจริง

---

## 📋 9-Step Sequential Lifecycle Architecture Summary (v0.9.2 — superseded, see below)

- [x] **`Phase 1` [Framework Config Spec]:** `defineConfig` (`baseURL: 'https://japan-trip.test'`, `trace: 'on-first-retry'`)
- [x] **`Phase 2` [Data Architecture Spec]:** SQL Schema `japan_trip_bookings` (id, user_name, concert_date, departure_date, return_date, passport_no, status)
- [x] **`Phase 3` [Backend REST API Spec]:** POST `/api/japan-trip/book` (HTTP 200, status 'CONFIRMED')
- [x] **`Phase 4` [Security & Visa Guard Spec]:** POST `/api/japan-trip/verify-visa` (HTTP 200, visaRequired false)
- [x] **`Phase 5` [Web UI POM Spec]:** E2E Voyage `/japan-trip` (#departure-date, #confirm-booking-btn, #booking-status)
- [x] **`Phase 6` [Mobile Client App Spec]:** Robot Framework App check `/mobile/e-ticket` (#ticket-title)
- [x] **`Phase 7` [Performance Engineering Spec]:** k6 Spike Test (vus: 1000, duration: '10s')
- [x] **`Phase 8` [Continuous Delivery Spec]:** GitHub Actions YAML (checkout@v4, npm test)
- [x] **`Phase 9` [⭐ Bonus Algorithmic Spec]:** Binary Search Ticket Price Optimization O(log n)

---

## 📋 8-Step Integrated Lifecycle Architecture Summary (v0.9.3 — current)

Reason for revision: user flagged the 9-phase version felt "too much like a regular lesson" — single-concept-per-phase, heavy scaffold, literal-regex validation, no real cross-phase code dependency despite the shared story. Redesigned 2026-07-31:

- [x] **`Phase 1` [Framework Config Spec]:** unchanged — `defineConfig` (`baseURL`, `trace: 'on-first-retry'`)
- [x] **`Phase 2` [Data Architecture Spec]:** SQL Schema + new AC-203 (`user_name`/`passport_no` `NOT NULL`) — first pattern-tolerant check (type/length free) instead of pure literal match
- [x] **`Phase 3` [Booking + Visa Compliance Integration]:** merged old Phase 3+4 — ONE test must POST `/book` then POST `/verify-visa` in sequence, not two isolated tests
- [x] **`Phase 4` [Web UI + Visa Reuse]:** was Phase 5 — must re-call the Phase 3 `verify-visa` API via the `request` fixture before filling the UI form (`page` + `request` together) — real cross-phase code reuse, not just shared narrative
- [x] **`Phase 5` [Mobile Client App Spec]:** unchanged (was Phase 6)
- [x] **`Phase 6` [Performance Engineering + SLA]:** was Phase 7 — added AC-603 `thresholds.http_req_duration p(95)<500`
- [x] **`Phase 7` [Continuous Delivery, multi-step]:** was Phase 8 — added AC-702/703 `actions/setup-node@v4` step, order-checked (must precede `npm test`)
- [x] **`Phase 8` [⭐ Bonus Algorithmic Spec]:** was Phase 9 — API contract changed: `findBestTicketPrice` now returns the found **index** (or `-1`), not a boolean

---

## 🧪 Status Verification
- v0.9.2: `npm test` passed 100% clean (245 lessons, 490 checks passed, 0 failed). Git commit & release `v0.9.2` published on GitHub.
- v0.9.3 (2026-07-31): ad hoc Node sanity check (`require('./course.js')`, iterate all 8 lessons) confirmed every `solution` passes its own `validate()` and every blank `template` fails `validate()`. One real regex bug caught and fixed during this check: the DB schema NOT NULL check used `[^,()]*` which excluded parens and never matched past `VARCHAR(100)` — fixed to `[^,]*`. Full `npm test` re-run afterward: 244 lessons, 488 checks passed, 0 failed (Final-Project: 8 lessons, 16 checks) — no regressions in the other 11 tracks. Not yet tagged/released.
