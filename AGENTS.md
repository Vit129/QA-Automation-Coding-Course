# QA-Automation-Coding-Course — Agent Instructions

Static HTML/JS course site: one folder per track (`API-Testing/`, `Playwright/`, ...), each with `course.js`
(+ `lessons/`), shared engine in `shared/`, exam in `exam/`. Read `ARCHITECTURE.md` first.

## Tests

- `npm test` runs every `tests/*.mjs` (self-test of all tracks' lessons, editor modules, regression tests).
  Dependencies for the SQL track: `npm ci` (also used by CI).
- New track → add it to the `TRACKS` array in `tests/selftest.mjs`. Test files read course/shared code via
  paths relative to `tests/`.
- Release: stage only intended files, then use `npm run ship -- "<message>" <patch|minor|major|skip>`. The cycle runs tests before commit, prepares changelog/version metadata in a second local commit before pushing, never stages the whole repo, waits for PR checks, merges without admin bypass, and verifies the live Pages commit/version/build. `npm run release -- <patch|minor|major>` is release + deploy only; `skip` increments only the build and records changes under `Unreleased`, with no tag or GitHub Release; after a tag is pushed but release creation fails, resume the same candidate with `npm run release -- --resume`.

## Agent Memory

Per-project memory lives centrally in `~/Git/Personal/agent-memory-private/agent-memory/QA-Automation-Coding-Course/` (never in this repo). Resolve path via `python3 ~/.claude/scripts/lib/memory_root.py .` or search via `python3 ~/.claude/scripts/recall.py "<query>"`.

## Code search

- Use `project_search` first. One call returns text matches and code-graph hits together.
- `rg` plus `Read` is the primary method. Read the file before you edit it.
- If `project_search` reports a stale index, treat its graph hits as hints and confirm them with `rg` and `Read`.
- Code-index output is local. Never commit it.

## Agent skills

### Issue tracker
Issues live in GitHub Issues (Vit129/QA-Automation-Coding-Course), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels
Default five canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs
Single-context layout: `CONTEXT.md` + `docs/adr/` at repo root. See `docs/agents/domain.md`.

