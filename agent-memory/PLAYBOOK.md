# Playbook — Problem Resolution Cases

<!-- Flat table. Search by domain or trigger keywords at session start. -->
<!-- Trigger/Fix: 120 chars max. If more detail needed → store in knowledge/ and reference path. -->
<!-- Sequential IDs: CASE-001, CASE-002, etc. -->
<!-- Applied/Prevented: increment when case is used or prevents a repeat. -->
<!-- Archive rule: when Applied+Prevented >= 5 AND no use in 30 days → move to knowledge/archive-playbook.md -->

| ID | Trigger | Fix | Domain | Outcome | Applied | Prevented |
|----|---------|-----|--------|---------|---------|-----------|
| CASE-001 | course.js validate() regex silently fails on solution containing `(` `)` e.g. `VARCHAR(100)` | Negated char class `[^,()]*` excludes parens too — swap to `[^,]*` (stop only at comma) unless parens must truly be excluded | course-content/js-regex | Prevented (caught before merge via solution+template sanity check) | 0 | 1 |
