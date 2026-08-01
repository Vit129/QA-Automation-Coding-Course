---
name: final-project-capstone-redesign
description: "Final-Project/course.js redesigned 2026-07-31 from 9 isolated phases to 8 integrated ones — merged API+visa, cross-phase reuse, index-based algorithm"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0b0d6759-d464-44eb-89f9-8a2e8ee68394
  modified: 2026-07-31T14:13:35.607Z
---

`Final-Project/course.js` (Japan Concert Trip capstone) was redesigned 2026-07-31 after user flagged it felt "too much like a regular lesson" despite the PRD/AC labeling — same single-concept-per-lesson, heavy-scaffold, literal-regex-match pattern as the 3 tracks in [[course-structure]], just re-skinned with a story.

Changes made (confirmed with user before implementing):
- Merged old Phase 3 (booking API) + Phase 4 (visa API) into one phase (`fp_booking_visa_integration`) — single test must call both endpoints in sequence, not two isolated tests.
- Phase 4 (Web E2E, was Phase 5) now must re-call the Phase 3 visa API via the `request` fixture before filling the UI form — real cross-phase code dependency, not just shared story text.
- DB schema phase (Phase 2) gained AC-203 (NOT NULL constraints) — first pattern-based check (regex tolerant of type/length) instead of pure literal match.
- k6 phase gained AC-603 (`thresholds.http_req_duration p(95)<500`) — SLA concept, not just vus/duration.
- CI/CD phase gained AC-702/703 (`actions/setup-node@v4` step, ordered before `npm test`) — order-sensitive validation via string index comparison, not just presence.
- Bonus DSA phase changed API contract: `findBestTicketPrice` now returns the found **index** (or `-1`), not a boolean — closer to real `indexOf`-style search.
- Total phases 9 → 8. All 8 solutions verified to pass their own `validate()`, and all 8 blank templates verified to fail — ran as an ad hoc Node sanity check (`require('./course.js')`, iterate `l.validate(l.solution/template, ...)`), no permanent test file added (matches the "extend, don't add test framework" pattern already established here).

**Why:** user wants the capstone to feel meaningfully harder/more integrated than a single lesson, not just a longer chain of isolated ones.

**How to apply:** If asked to review or extend Final-Project again, this is the current phase structure (8, not 9) — re-verify against the file before citing phase numbers, this memory decays like any other snapshot.
