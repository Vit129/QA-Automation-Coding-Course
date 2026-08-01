# OOP-Fundamentals Track — Dev Task Progress

See `design.md` in this folder for the full plan (lesson list, validate() strategy, file changes).

- [x] Create `OOP-Fundamentals/` dir, run `shared/sync-engine.sh` (add track to its TRACKS array first) to populate engine.js/editor-*.js/gamification.js
- [x] Write `OOP-Fundamentals/course.js` — 15 lessons per design.md's table (regex for 1-7/10, real execution for 8/9/11-15)
- [x] Write `OOP-Fundamentals/index.html` + `style.css` (adapt from Framework-Design)
- [x] Homepage `index.html`: `--accent-amber` var, `.btn-dsa` -> amber, new `.btn-oop` -> emerald, new track card between Framework-Design and DSA
- [x] `shared/selftest.mjs`: add `'OOP-Fundamentals'` to TRACKS
- [x] `exam/index.html`: add OOP-Fundamentals script tag to the mixed exam pool
- [x] `DESIGN.md`: update accent palette section (already generic, accent-amber already documented — no per-track mapping needed)
- [x] `node shared/selftest.mjs` — 0 failures across all 13 tracks (259 lessons, 518 passed — caught+fixed a real bug: getLearnerClass re-executed code per class name, giving separate class references so instanceof/extends checks always failed; fixed with getLearnerClasses extracting all classes from one execution)
- [x] Manually verify a real-execution lesson (Singleton) rejects a plausible-but-wrong solution (verified: `getInstance() { return new ConfigManager(); }` without caching correctly fails identity check)
- [x] Commit on a feature branch, open PR — https://github.com/Vit129/QA-Automation-Coding-Course/pull/15

## Scope expansion (2026-08-01)

- [x] Add SOLID principles ×5 (SRP/OCP/LSP/ISP/DIP) to OOP-Fundamentals/course.js
- [x] Add Observer/Strategy/Adapter/Decorator patterns (4 lessons)
- [x] Add TypeScript interface/abstract class lesson (regex-only, TS not executable in sandbox)
- [x] Renumber all lesson meta (บทที่ 1-24 + capstone), track now 25 lessons total
- [x] Hide Accessibility-Testing from homepage (nav/card/CSS/script tag/TRACKS array), exam pool, and shared/selftest.mjs — files on disk untouched
- [x] Update homepage OOP card (desc/tags/lesson count) and static fallback lesson-count text
- [x] `node shared/selftest.mjs` — 256 lessons, 512 checks, 0 failed (12 tracks, a11y excluded)
- [x] Verified LSP lesson rejects plausible-but-wrong solution (subclass returning wrong shape `"ok"` instead of `{passed: boolean}`)
- [x] Reused getLearnerClasses fix for OCP/LSP multi-class extraction (same bug class as original Polymorphism/Abstraction fix)
- [x] Commit + push expansion, update PR #15
