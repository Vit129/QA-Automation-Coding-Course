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
- [ ] Commit on a feature branch, open PR
