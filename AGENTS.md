# QA-Automation-Coding-Course — Agent Instructions

Static HTML/JS course site: one folder per track (`API-Testing/`, `Playwright/`, ...), each with `course.js`
(+ `lessons/`), shared engine in `shared/`, exam in `exam/`. Read `ARCHITECTURE.md` first.

## Tests

- `npm test` runs every `tests/*.mjs` (self-test of all tracks' lessons, editor modules, regression tests).
  Dependencies for the SQL track: `npm install` (CI uses `npm install`; `npm ci` fails because `package-lock.json`
  is out of sync with `package.json`).
- New track → add it to the `TRACKS` array in `tests/selftest.mjs`. Test files read course/shared code via
  paths relative to `tests/`.
- Release: `npm run release` / `npm run ship` (see `scripts/`).

## Agent Memory

Per-project memory lives centrally in `~/Git/Personal/agent-memory-private/agent-memory/QA-Automation-Coding-Course/` (never in this repo). Resolve path via `python3 ~/.claude/scripts/lib/memory_root.py .` or search via `python3 ~/.claude/scripts/recall.py "<query>"`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<ClassName/FileName>"` for a known symbol/file (name match, not free-form concept search - use `query` for that). These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- After judging a query/path/explain result useful, a dead end, or wrong, run `graphify save-result --question "Q" --answer "A" --outcome useful|dead_end|corrected --nodes N1 N2` - this accumulates across sessions so the same dead end or vocabulary mismatch isn't re-derived every time. At the start of a session, check `graphify-out/reflections/LESSONS.md` if it exists (built via `graphify reflect`) for preferred sources, known dead ends, and past corrections.

## Agent skills

### Issue tracker
Issues live in GitHub Issues (Vit129/QA-Automation-Coding-Course), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels
Default five canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs
Single-context layout: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

