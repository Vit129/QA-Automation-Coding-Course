---
name: course-structure
description: QA-Automation-Coding-Course now has 3 interactive tracks; extend-not-rebuild is the established pattern
metadata: 
  node_type: memory
  type: project
  originSessionId: 4567889e-7952-4efe-a260-64b453280364
---

The course at `/Users/supavit.cho/Git/Personal/QA-Automation-Coding-Course` has 3 tracks, each a static HTML/CSS/JS sandbox sharing one driver pattern (theory → template with `WRITE YOUR CODE HERE` → `validate()` regex check → hint → solution → localStorage progress):

- **Playwright** (11 lessons) — grounded in `My-Investment-Port/react_typescript_101` + real React app (POM, fixtures, locators, mocking, React testing)
- **Robot Framework** (11 lessons) — grounded in `harness-terminal/Tests/HarnessRobotTests` (native macOS app tested via `HarnessUILibrary.py`, AppleScript/Accessibility API, `harness` CLI)
- **API Testing** (7 lessons, added 2026-07-04) — grounded in `My-Investment-Port/server/index.js` real Express endpoints (status codes, negative testing, POST bodies, auth headers, schema assertions, request context reuse)

**Why:** user explicitly asked for content grounded in real projects under `~/Git/Personal`, not fabricated scenarios. [[grounding-verification]]

**How to apply:** When adding a 4th track or extending lessons, follow the existing pattern (copy driver code, change localStorage key prefix, keep validate() as regex-on-code-text not real execution) rather than restructuring — confirmed with advisor that tool-based tracks (Playwright=web, RF=desktop/CLI) is the right spine, not a testing-pyramid reorg.
