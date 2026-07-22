# Plan: Formal Normal Forms, DS&A Track, Test Design Theory Track, and Course Roadmap

Status: draft, not implemented. Decisions below were confirmed via interview on 2026-07-21.

## 1. Formal Normal Forms (NF) in DB-Design-SQL

### Context
`DB-Design-SQL/course.js` lesson 5 ("Normalization: ทำไมต้องแยกตาราง") already teaches the
*intuition* of normalization (redundancy, update anomalies) via a `COUNT(DISTINCT ...)` exercise,
and lesson 13 applies it to a schema-design exercise. Neither ever names 1NF/2NF/3NF/BCNF or
teaches the formal rules (atomicity, functional dependency, partial/transitive dependency). That's
the real gap — this plan adds the formal layer on top of the existing intuition, it does not
duplicate it.

### Decisions
- Depth: 1NF, 2NF, 3NF, **and BCNF** (user confirmed — BCNF included despite being an edge case,
  since the goal is full formal coverage, not just the common-case 3 forms).
- Placement: **append**, not insert. New lessons become 14–18, after the existing 13. Lesson 5
  stays as-is ("พื้นฐาน" / foundation). No renumbering of existing `บทที่ N` labels — avoids
  touching 13 already-shipped, already-tested lessons.
- Volume: 5 lessons (bigger option, confirmed).

### Lesson breakdown (DB-Design-SQL, lessons 14–18)

| # | Title (draft) | Concept | Exercise shape |
|---|------|---------|----------------|
| 14 | Functional Dependency: รากฐานของ Normal Form | `A → B` notation, how every NF rule after this is defined in terms of FDs | Given a sample table, identify which column(s) functionally determine which |
| 15 | 1NF: Atomic Values และ Repeating Groups | No multi-valued/composite columns, no repeating groups | Given a denormalized table with a comma-separated column, query/prove the violation, then the fix |
| 16 | 2NF: Partial Dependency บนคีย์ผสม | Only applies to composite PKs; every non-key column must depend on the *whole* key | Composite-key table where a column depends on only part of the key — prove & split |
| 17 | 3NF: Transitive Dependency | Non-key column depending on another non-key column, not directly on the PK | e.g. `broker_country` depending on `broker_name` depending on PK — prove & split |
| 18 | BCNF: เมื่อ 3NF ยังไม่พอ | Edge case: a table already in 3NF but with an overlapping candidate key still has an anomaly | Classic BCNF counterexample table (e.g. student-advisor-department style, adapted to this course's portfolio/broker domain) |

Each lesson follows the existing track's file format exactly: `template` (SQL skeleton with `WRITE
YOUR CODE HERE`), `validate` (real AlaSQL execution + assertions, same pattern as lessons 1–13),
`hint`, `solution`, `theory`, `example`, `task`. No new files, no engine/UI changes — this is a
`course.js`-only change (append 5 objects to the `LESSONS` array, no changes to `engine.js`,
`editor-autocomplete.js`, or `index.html`).

### Verification
Same bar as every other lesson in this repo: after writing, `node shared/selftest.mjs` must show
`DB-Design-SQL: 18 lessons, N checks passed, 0 failed` (up from the current 13 lessons / 26
checks). No manual browser check strictly required for a `course.js`-only change, but worth one
pass given BCNF's exercise is more elaborate than the others.

---

## 2. New Track: Data Structures & Algorithms for QA

### Rationale
PRODUCT.md's vision is "full QA automation stack," not general CS fundamentals — a generic
LeetCode-style DS&A track would be scope creep against the repo's own stated vision. The user
confirmed the resolution: **start from a QA-motivated framing, then expand into a real CS/CE/SWE-
style DS&A curriculum** rather than staying narrowly QA-flavored throughout. In practice: each
topic opens with a QA-relevant motivating example (why a tester should care), then teaches the
actual data structure/algorithm at normal CS-course depth.

### Decisions
- Volume: 10+ lessons (bigger option, confirmed).
- Folder name: `Data-Structures-Algorithms` (matches the repo's existing descriptive-not-abbreviated
  naming style — `DB-Design-SQL`, `CI-CD-Pipeline` — over a cryptic `DSA`).
- Track id: `dsa`, title: `"Data Structures & Algorithms for QA"`.

### Lesson breakdown (draft, 11 lessons)

| # | Title (draft) | QA motivation | CS content |
|---|------|----------------|-------------|
| 1 | Big-O Notation: ทำไม Test Suite ถึงรันช้าลงเรื่อยๆ เมื่อข้อมูลโต | A test helper that does a linear scan per assertion silently becomes O(n²) as fixtures grow | O(1)/O(log n)/O(n)/O(n²), how to eyeball complexity from nested loops |
| 2 | Array vs Linked List | Test data list that's constantly reordered/filtered vs one that's only appended to | Contiguous memory + index access vs pointer-chasing, insert/delete cost tradeoffs |
| 3 | Hash Table / Set: Dedup Test Data ใน O(1) | Removing duplicate test cases from a large generated dataset | Hashing, collision handling at a conceptual level, average-case O(1) lookup |
| 4 | Stack & Queue: ลำดับการรัน Test และ Undo/Redo | Test execution order (LIFO rollback vs FIFO queue), BFS/DFS groundwork | Push/pop, enqueue/dequeue, where each is the right structure |
| 5 | Sorting Algorithms และทำไม Order ของผลลัพธ์ถึงสำคัญ | A flaky test comparing unsorted API results; stable sort avoiding false positives | Bubble/merge/quick at a conceptual level, stability, `O(n log n)` as the practical bar |
| 6 | Searching: Linear vs Binary Search สำหรับ Test Oracle | Looking up an expected value in a huge fixture file | Linear O(n) vs binary O(log n), the sorted-input precondition |
| 7 | Recursion: Traversal และ Test Data Generators | Recursively walking a nested JSON test fixture | Base case/recursive case, stack depth, converting to iteration when needed |
| 8 | Trees: Test Suite Hierarchy และ DOM Structure | Test suite/describe-block nesting, DOM tree for UI testing | Binary trees, tree traversal (pre/in/post-order), depth |
| 9 | Graphs & Traversal: Test Dependency และ CI Pipeline DAG | CI job dependency graph, detecting a circular test-dependency bug | Nodes/edges, directed vs undirected, BFS/DFS, cycle detection |
| 10 | Big-O of Nested Loops: จับ Bug ประสิทธิภาพจากโค้ดจริง | Reading a real (buggy) helper function and identifying its true complexity | Applying lessons 1–9 together to diagnose a planted performance bug |
| 11 | Basic Dynamic Programming: Memoization กับ Test ที่คำนวณซ้ำ | A test helper recomputing the same expensive derived value every assertion | Memoization as a targeted fix, not full DP theory — kept scoped to what a QA engineer needs |

Each lesson needs a way to *execute* code for validation. Verified: most tracks' `validate()` only
regex-matches the learner's source text (e.g. Playwright, Framework-Design's config-file checks) —
that's too weak for an algorithms track, where a broken binary search can still satisfy a regex.
`Framework-Design/course.js` (lines 73–82) already has the right precedent though —
`execLearnerCode(code, params, expr)`, which defines the learner's code in a fresh `new
Function(...)` scope with injected params, then evaluates an expression in that same scope and
returns its value. DS&A's `validate()` should copy this same helper into its own `course.js` (each
track keeps its own copy — `course.js` isn't synced across tracks the way `engine.js` is) and use it
to actually *call* the learner's function against real inputs and assert the return value, not just
pattern-match the source. This is a real, if small, new-infra item for this track — not a pure
content-only change like the NF lessons above.

### File scaffolding checklist
New track needs the full 11-track pattern, all mechanical:
1. `Data-Structures-Algorithms/{course.js, engine.js, editor-autocomplete.js, index.html, style.css}`
   — scaffold from an existing plain-JS track (Framework-Design or CLI-Essentials are the closest
   templates, no external CDN dependency like AlaSQL/axe-core).
2. `shared/sync-engine.sh` — add `Data-Structures-Algorithms` to the `TRACKS` array.
3. `shared/selftest.mjs` — add to its `TRACKS` array so the new lessons get self-tested.
4. `exam/index.html` — add `<script src="../Data-Structures-Algorithms/course.js"></script>` so its
   lessons are eligible for the mixed exam mode (same `window.QA_TRACKS` registry pattern every
   other track uses).
5. Root `index.html` — add a landing-page card + `./Data-Structures-Algorithms/index.html` link.
6. `PRODUCT.md` — bump "11 tracks" → "12 tracks", add to the Core Features track list.
7. `README.md` — add to track list if one exists there.
8. `graphify update .` after implementation (mechanical, already established convention).

---

## 3. New Track: Test Design Theory

### Rationale
Raised during discussion of "how does this compare to a university/ISTQB software testing
curriculum" — grepped the whole repo for `Equivalence Partitioning`, `Boundary Value`, `Decision
Table`, `State Transition`, `Test Pyramid`, `Pairwise`: zero matches across all 11 tracks. Every
existing track teaches *how to automate* a check; none teach the *test-design techniques* that
decide what to check in the first place. This is the one gap that's arguably more foundational than
DS&A — DS&A is general CS fundamentals, this is QA's own core discipline, and it's the part every
formal software-testing curriculum (ISTQB Foundation Level, university testing courses) treats as
non-negotiable.

### Decisions
User confirmed: add as its own new track (not folded into an existing one).
- Folder: `Test-Design-Theory` (descriptive naming, matches repo convention).
- Track id: `test-design-theory`, title: `"Test Design Theory"`.

### Lesson breakdown (draft, 7 lessons)

| # | Title (draft) | Technique | Exercise shape |
|---|------|-----------|----------------|
| 1 | Equivalence Partitioning: แบ่ง Input เป็นกลุ่มที่ทดสอบแทนกันได้ | Split an input domain into classes where one representative value stands in for the whole class | Given a function's valid/invalid input ranges, learner writes the minimal set of test cases (one per partition) as a JS array; `validate()` checks every partition is covered and no redundant cases exist |
| 2 | Boundary Value Analysis: Bug ชอบซ่อนอยู่ตรงขอบ | Min-1/min/min+1, max-1/max/max+1 around every boundary | Given a range spec (e.g. age 0–120), learner writes boundary test cases; `validate()` checks all 6 boundary points are present |
| 3 | Decision Table Testing: ครบทุก Combination ของเงื่อนไข | Conditions × actions truth table, one test case per rule/column | Given 2–3 boolean conditions from a realistic feature (e.g. this course's own broker/portfolio domain), learner fills in the decision table's expected actions; `validate()` checks against the real logic |
| 4 | State Transition Testing: Valid และ Invalid Transitions | States + transitions + explicitly testing a transition that should be *rejected* | Given a state machine (e.g. test-run status: pending→running→passed/failed, no skipping states), learner writes test cases including at least one invalid-transition case |
| 5 | Pairwise (Combinatorial) Testing: ลดจำนวน Combination แบบไม่เสีย Coverage | All-pairs coverage instead of full combinatorial explosion | Given N parameters with multiple values each, learner produces a reduced test set; `validate()` checks every *pair* of values is covered at least once, without requiring the full cross-product |
| 6 | Test Pyramid: สัดส่วน Unit/Integration/E2E ทำไมถึงสำคัญ | Why an inverted pyramid (too many slow E2E, too few fast unit tests) causes slow, flaky suites | Given a list of test descriptions, learner classifies each by pyramid level and computes whether the resulting ratio is healthy |
| 7 | Capstone: ออกแบบ Test Case ชุดเต็มจากทุกเทคนิค | Combine EP + BVA + decision table on one realistic feature | Given a small spec (e.g. "portfolio rebalance" input validation), learner produces a full test case set; `validate()` checks coverage across all three techniques at once |

Same execution concern as DS&A: this track's `validate()` needs to check the *substance* of
submitted test cases (are the right partitions/boundaries/pairs covered), not just regex-match the
source. Same `execLearnerCode`-style approach applies — copy the pattern from
`Framework-Design/course.js`, run the learner's array/object against the real reference logic
instead of pattern-matching.

### File scaffolding
Same 12-track (now 13th) checklist as the DS&A section above: `Test-Design-Theory/{course.js,
engine.js, editor-autocomplete.js, index.html, style.css}`, register in `sync-engine.sh`,
`selftest.mjs`, `exam/index.html`, root `index.html`, `PRODUCT.md` (→13 tracks), `README.md`.

---

## 4. Roadmap — what else, given 137 lessons across 11 tracks already

Grounded in what's actually in the repo right now, not invented:

### High-value, low-effort
- **No CI test run on push/PR.** `.github/workflows/` only has `pages.yml` (deploy). The repo has
  invested in a 274-check self-test harness (`shared/selftest.mjs`) but nothing runs it
  automatically — a content regression (like the "hint-leaked answers" bug fixed in commit
  `38bc980`) could ship silently. Recommend adding a `test.yml` workflow: `npm ci && npm test` on
  every push and PR to `main`. Cheap, catches exactly the class of bug this repo has already been
  bitten by once.
- **`version.json`'s schema-version vs the new semver tags are two parallel, uncoordinated
  versioning schemes.** `version.json` still says `"version": 2"` (a content-schema counter, last
  bumped 2026-07-15) while `package.json`/git tags now have real semver (`v0.5.0`, just released).
  Worth deciding: keep both (they track different things — content-schema vs release) and document
  that distinction, or retire `version.json` now that a real release process exists, so nobody
  reads "version 2" and confuses it with the release version.

### Content depth imbalance
Lesson counts per track (from the self-test output): Playwright 21, API-Testing 15,
Robot-Framework 18, CLI-Essentials 18, DB-Design-SQL 13 (→18 after this plan), Performance-Testing
12, then a visible drop — CI-CD-Pipeline 9, Security-Testing 8, Accessibility-Testing 8,
Framework-Design 8, Visual-Regression-Testing 7. The five newest tracks are noticeably shallower
than the original six. Before adding yet another brand-new track's worth of surface area, it may be
worth deepening these five to the ~12-15 range the older tracks reached — same audience benefit,
lower total new-content cost than a 12th track, and directly addresses the imbalance rather than
adding to it. (Not a blocker for NF/DS&A above — just worth weighing against them for the next
round of work.)

### Genuinely missing topics (present in a real QA automation curriculum, absent from all 11 tracks)
- **BDD/Gherkin** (Cucumber-style `Given/When/Then` specs) — a distinct skill from both Playwright
  and Robot Framework's current native-syntax approach.
- **Contract testing** (Pact-style consumer/provider contracts) — a natural extension of
  `API-Testing`, not covered there today.
- **Test management & defect lifecycle** (writing a good bug report, test case management tool
  concepts, traceability) — a practical QA skill with no coding component, so it wouldn't fit this
  repo's "write code, get validated" format without adapting the lesson shape itself. Flagging as a
  possible future format experiment, not a drop-in track.
- **Mobile-native app testing** (Appium-style) — `Robot-Framework`'s current scope is macOS-native
  UI automation (`KouenUILibrary`), not mobile. A real gap if "full QA automation stack" is meant to
  include mobile.

None of these are blockers for the NF/DS&A work above — listed as candidates for what comes after,
per the question asked.
