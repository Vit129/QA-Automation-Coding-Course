---
name: grounding-verification
description: "When course/doc content claims to be \"grounded in a real project,\" verify against the actual source files rather than trusting the claim"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4567889e-7952-4efe-a260-64b453280364
---

Don't trust a "grounded in real project X" comment/claim at face value — read the actual source files in that project and cross-check specific keywords, endpoints, or APIs the content teaches.

**Why:** The Robot Framework track's header comment claimed grounding in `harness-terminal` (a native macOS app), but 3 of 11 lessons actually taught `SeleniumLibrary` web-DOM keywords (`Input Text`, `Wait Until Element Is Visible`, `Element Should Contain` with `id=`) against a fictional stock-holdings web page — a library that doesn't exist anywhere in that project and couldn't possibly work against a native app (no DOM). This was only caught by actually reading `harness-terminal/Tests/HarnessRobotTests/libraries/HarnessUILibrary.py` and the real `.robot` suites, not by trusting the course's own claim. User confirmed the fix was valuable ("เนื้อหา ดีกว่าเดิม ดีสิ", 2026-07-04). [[course-structure]]

**How to apply:** Before extending or reviewing any lesson/doc that claims real-project grounding, grep the claimed source for the specific library/function/endpoint names used in the content. A mechanical self-check (does validate() logic pass/fail correctly) is necessary but NOT sufficient — it won't catch a factually wrong but internally-consistent scenario. Do both: mechanical self-check + content-vs-source cross-reference.
