---
name: common-failure-lessons-backlog
description: "Common-problems/root-cause-not-timeout lessons — delivered 2026-07-15 to all 3 tracks (PR #2)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 10d5caeb-dd5a-42a2-91ce-6bf7ebb91692
---

**Status: done.** Written and verified 2026-07-15, same session, same PR #2 (`worktree-add-lessons`):
- Playwright API Testing → `state_leak_race` (บทที่ 8): global-state race condition via the real `currentModel` module variable in `packages/ai-core/services/gemini-service.js` — read/mutate/restore pattern, `test.describe.configure({ mode: 'serial' })` as the alternative fix. Not a timing issue at all.
- Playwright UI Testing → `stale_locator` (บทที่ 13): CSS-class locators breaking on refactor vs `getByTestId`, grounded in the real testid/no-testid split already present in the app (`search-input` has one, `PivotPoints.jsx` doesn't).
- Robot Framework Native UI Testing → `window_focus_check` (บทที่ 13): contrasts the real `Wait For UI` keyword (literally `time.sleep()`) against `Element Should Exist` (real accessibility-tree check) in `kouen-terminal/Tests/KouenRobotTests/libraries/KouenUILibrary.py`.

Original backlog context below, kept for the reasoning trail.

Discussed 2026-07-15 while adding the flaky-test-retry lessons (PR #2, branch `worktree-add-lessons`).

**Insight that sparked this:** RF syntax is identical regardless of driver (Appium Native / Appium Flutter / this course's Kouen-based Robot-Framework track). What actually differs — and is genuinely hard — is the locator/infra layer underneath: Appium Native needs `accessibility_id` + a live emulator/simulator/device (heavy setup, itself a flaky dependency); Appium Flutter needs devs to add `Key()` to widgets, a debug/profile build, and FLUTTER↔NATIVE_APP context switching; this course's Kouen track skips all of that (no device/emulator/Appium server — just `subprocess` + `osascript` against a locally running macOS process). Source: `.claude/skills/robotframework-testing/references/flutter-appium.md` + `kouen-terminal/Tests/KouenRobotTests/libraries/KouenUILibrary.py`.

**Ask (not scoped or built yet):** for all 3 tracks — Playwright UI Testing, Playwright API Testing, Robot Framework Native UI Testing — add a lesson/section on common problems learners actually hit + how to *think* about diagnosing them, explicitly not "just increase the timeout." Mirrors the root-cause-over-symptom framing already used in the flaky-retry lessons added this session.

**Why:** user's own framing — this is meant as a course-quality improvement (teach diagnosis, not band-aids), not urgent, deferred with "ใส่ไว้ก่อนก็ได้" (just save it for now).

**How to apply:** when picked up, needs a real scoping pass first (what specifically breaks in each track's actual grounding project — My-Investment-Port, kouen-terminal — not a guessed list). Draft candidate problems from this conversation, unverified:
- Playwright UI: stale locator after refactor, POM state leak across tests, screenshot-baseline drift (macOS local vs CI Linux fonts)
- Playwright API: shared test-data race condition under parallel runs, env-specific base URL misconfig, loose assertions missing schema drift
- Robot Framework Native UI: window not focused/rendered before keystroke, macOS Accessibility permission prompt blocking CI, previous test's process not fully torn down before next launch

This is a genuinely lightweight content-backlog note — do not force a full DDD/bounded-context design pass on it; it's 3 short lesson additions to a static HTML sandbox, same shape as the lessons already added in [[course-structure]].
