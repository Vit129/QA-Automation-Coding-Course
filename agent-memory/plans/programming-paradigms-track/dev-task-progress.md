# Programming-Paradigms Track — Dev Task Progress

See `design.md` in this folder for the full plan (lesson list, validate() strategy, file changes).

- [x] Create `Programming-Paradigms/` dir, add to `shared/sync-engine.sh` TRACKS array, run it
- [x] Write `Programming-Paradigms/course.js` — 12 lessons per design.md's table
- [x] Write `Programming-Paradigms/index.html` + `style.css` (adapt from OOP-Fundamentals, accent-fuchsia)
- [x] Homepage `index.html`: `--accent-fuchsia` var, new `.btn-pp` rule, new track card + nav link between OOP-Fundamentals and DSA, completion-banner list, static lesson-count text
- [x] `shared/selftest.mjs`: add `'Programming-Paradigms'` to TRACKS + add `setTimeout`/`clearTimeout` to the vm sandbox (needed by the event-loop-ordering lesson, wasn't in the sandbox before)
- [x] `exam/index.html`: add Programming-Paradigms script tag
- [x] `node shared/selftest.mjs` — 0 failures across all 14 tracks (268 lessons, 536 checks)
- [x] Manually verify Promise.all parallelism lesson rejects a sequential-await solution (peak concurrent stayed at 1)
- [x] Manually verify race-condition-fix lesson rejects an unsafe (non-locking) counter (final count 1 instead of 5 — lost updates)
- [x] Bump CURRENT_VERSION (index.html) + version.json for the update banner
- [x] Commit, push, PR, merge, release — https://github.com/Vit129/QA-Automation-Coding-Course/pull/18, released as v0.11.0
