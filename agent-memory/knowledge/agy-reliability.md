---
name: agy-reliability
description: "User distrusts agy (Antigravity) delegation — fast but frequently wrong, prefers direct/self execution for content-accuracy-sensitive work"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 161338b4-e3c4-4a0e-8a8b-df27ff6a146f
  modified: 2026-07-30T14:34:08.612Z
---

Don't default to delegating content-accuracy-sensitive fixes to `agy` — user considers it fast but error-prone ("agy จอมมั่วจริงๆ เสร็จเร็ว แต่ผิดบ่อยมาก").

**Why:** Confirmed live in session — routing.md triggered `Skill(agy)` for a course-content boilerplate fix (lesson theory text needing per-lesson technical accuracy), user immediately interrupted with "แก้เองเลย" (do it yourself) before agy produced anything, then afterward explicitly called agy "จอมมั่ว" (a serial mess-up/unreliable).

**How to apply:** For tasks needing technical accuracy or content quality (writing/reviewing lesson content, code fixes, anything where a wrong-but-plausible-looking answer is worse than a slow correct one), do it directly (self or `general-purpose`/specialized Agent subagents) rather than routing to `agy`. Still fine to *offer* agy for genuinely exploratory/second-opinion use per its skill description, but don't assume it's the default fast path — check with the user first if unsure, especially right after any prior agy dispatch got cut short like this one did.

**Update 2026-07-30:** User's actual working pattern — let `agy` do a task in its own session, then have Claude (a separate session/turn) review that output before trusting it. This time (branch `feature/editor-autocomplete-keyboard-nav`, keyboard-nav autocomplete feature) agy's work held up under Claude's review — no bugs found in the agy-authored code itself (the one real finding, a GLOSSARY.md doc/code mismatch, was a doc-status issue, not a functional agy mistake). User's own comment: "ให้ agy ทำแล้ว claude รีวิว ... รอบนี้ agy ทำไม่ผิดแหะ" — a positive data point, not a reversal of the underlying distrust. Keep the review-gate: agy output still gets a Claude pass before shipping, don't skip that step just because one round came back clean.
