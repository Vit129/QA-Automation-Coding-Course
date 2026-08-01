# Playbook — Problem Resolution Cases

<!-- Flat table. Search by domain or trigger keywords at session start. -->
<!-- Trigger/Fix: 120 chars max. If more detail needed → store in knowledge/ and reference path. -->
<!-- Sequential IDs: CASE-001, CASE-002, etc. -->
<!-- Applied/Prevented: increment when case is used or prevents a repeat. -->
<!-- Archive rule: when Applied+Prevented >= 5 AND no use in 30 days → move to knowledge/archive-playbook.md -->

| ID | Trigger | Fix | Domain | Outcome | Applied | Prevented |
|----|---------|-----|--------|---------|---------|-----------|
| CASE-001 | course.js validate() regex silently fails on solution containing `(` `)` e.g. `VARCHAR(100)` | Negated char class `[^,()]*` excludes parens too — swap to `[^,]*` (stop only at comma) unless parens must truly be excluded | course-content/js-regex | Prevented (caught before merge via solution+template sanity check) | 0 | 1 |
| CASE-002 | real-execution validate() extracts 2+ related classes (e.g. subclass + base for `instanceof`) via separate `new Function()`/`execLearnerCode()` calls, one per class name | Each call re-runs the WHOLE code string in a fresh scope — separate calls produce unrelated class objects, so `instanceof`/`extends` checks fail even on correct solutions. Extract all related classes from ONE execution instead (return an array/tuple from a single `new Function()` call) | course-content/js-sandbox | Applied 2x (OOP-Fundamentals Polymorphism+Abstraction, pre-empted for OCP+LSP) | 2 | 0 |
| CASE-003 | A new track's `engine.js`/`editor-*.js`/`gamification.js` looks stale after a repo-wide feature ships to the other 12 tracks while the new track's branch was open | `shared/sync-engine.sh`'s FILES array is JS-only — it does NOT sync `style.css`. A repo-wide CSS change (e.g. `.lesson-item.locked` styling) needs its own manual propagation check across all N track `style.css` files; re-running sync-engine.sh alone won't catch it | course-content/repo-wide-propagation | Applied 1x (OOP-Fundamentals missing `.locked` dimming, caught by fable-advisor 2nd review after sync-engine.sh already "fixed" the JS side) | 1 | 0 |
