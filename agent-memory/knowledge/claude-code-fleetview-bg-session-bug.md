---
name: claude-code-fleetview-bg-session-bug
description: Claude Code CLI Agent/Fleet view hides just-submitted background-job sessions when the tengu_fleet_past_sessions flag is off; local workaround confirmed
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7724b62f-e762-4356-a6be-bf938a9e844a
  modified: 2026-07-29T09:28:44.506Z
---

Claude Code CLI (not this project's code — the `claude` binary itself) has a reproducible bug: after
submitting a message in Chat view and pressing `←` to switch to Agent/Fleet view, the just-submitted
session does not appear. 100% reproducible before the fix below.

**Root cause** (found by extracting literal JS strings from the installed binary
`~/.local/share/claude/versions/<version>` — CLI ships largely un-obfuscated source): the fleet
enumeration function (`fcl` in the minified bundle) has `if(!t && s.sessionKind==="bg") return []` —
it drops any session with `sessionKind:"bg"` from the list when flag `t` is false. `t` corresponds to
the cached remote feature flag `tengu_fleet_past_sessions` in `~/.claude.json`, which was `false` on
this account. A submitted-then-processing session gets `sessionKind:"bg"` internally, so it was being
silently filtered out of the Fleet view list.

**Fix applied**: edited `~/.claude.json`, flipped `"tengu_fleet_past_sessions": false` → `true`.
Backup of the pre-edit file was kept in the session's job tmp dir (not persisted — a fresh backup
should be taken again before re-editing). Restarting the CLI session was required for the flag to
take effect. User confirmed (2026-07-29) this fixed the symptom.

**Caveat**: this is a client-side cache of a server-controlled flag (Statsig-style rollout). It may
get overwritten back to `false` on a future config sync from Anthropic's servers, since the feature
may be gated intentionally (partial rollout / not fully stable). If the bug reappears, re-check and
re-flip this same key in `~/.claude.json`.

**Upstream report**: filed as https://github.com/anthropics/claude-code/issues/82216 (bug report only,
filed before root cause was found — does not yet mention the flag/code-path finding above).

This is a Claude Code CLI (tooling) issue, not specific to this project's codebase — the finding
applies machine-wide, to any project run through this CLI install.
