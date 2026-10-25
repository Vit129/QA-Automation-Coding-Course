# Product

## Vision
Browser-based, no-backend, no-build-step interactive code sandbox for learning QA automation, software engineering fundamentals, and application security (AppSec / Cyber Defense) — theory, interactive code in-browser, and instant client-side validation.

## Target Users
- Self-learners and QA Engineers expanding into test automation, performance engineering, and CI/CD pipelines.
- Software Developers and QA Engineers career-switching into Cybersecurity and Application Security (AppSec), preparing for industry certifications such as **CompTIA Security+ (SY0-701)**, **eJPT**, and **PortSwigger Certified Web Security Practitioner (BSCP)**.
- Engineers mastering command-line mastery (CLI essentials & modern fast rust-based tools) and system architecture.

## Core Problems
- QA automation & security tutorials are usually video/text-only with no hands-on coding checkpoint.
- Setting up authentic environments per topic (Playwright, k6, Robot Framework, security scanners, SQL databases) creates friction just to practice a single concept.
- Fragmented resources: rarely does a single platform bridge test automation, database design, computer science paradigms, and deep application security defense in one cohesive curriculum.

## Core Features
- **14 Tracks (315+ Interactive Lessons):**
  1. **Playwright UI & Visual Regression Testing** — E2E automation, locators, fixtures, network mocking, pixel diffing, dynamic masking, and viewport thresholds (33 lessons)
  2. **Robot Framework Native UI Testing** — Keyword-driven automation & Appium patterns
  3. **Playwright API Testing** — REST endpoints, assertions, auth, payload schemas
  4. **Performance Testing (k6)** — Virtual users, thresholds, load/stress scenarios
  5. **Database Design & SQL** — Relational algebra, normal forms (1NF-BCNF), runs real in-browser AlaSQL
  6. **CLI Essentials** — Git, Vim, Unix shell pipelines & stream processing
  7. **Modern CLI Tools** — Fast modern tools (`zoxide`, `fd`, `ripgrep`, `bat`, `eza`, `fzf`, `jq`)
  8. **AppSec & Cyber Defense** — CompTIA Security+ (SY0-701) core, STRIDE threat modeling, Cryptography, PKI, OWASP Top 10 (SQLi, XSS, IDOR, SSRF, JWT), WAF rules, DevSecOps SAST/Secret scanning, and NIST incident response
  9. **Accessibility Testing (a11y)** — `axe-core`, WCAG 2.2, ARIA attributes, keyboard navigation
  10. **CI/CD Pipeline** — GitHub Actions YAML workflows, caching, test matrix
  11. **OOP & Test Automation Framework Architecture** — OOP principles, SOLID, design patterns (Factory, Builder, Strategy), custom fixtures, POM, test data management, and parallel worker isolation (38 lessons)
  12. **Programming Paradigms** — Functional, imperative, declarative, and reactive patterns
  13. **Data Structures & Algorithms** — Big-O, arrays, hash maps, queues, stacks, trees/graphs for automation
  14. **Tech Builder** — Agentic engineering, resilient backends, AST dependency analysis, offline-first sync
  - **Final Project Capstone** — Multi-phase integration project
- **Per-lesson flow:** Theory block → interactive code template (`WRITE YOUR CODE HERE`) → client-side validation runner → hint → reference solution.
- **Progress saved to `localStorage`** + JSON import/export for cross-device state portability (ADR 0001).
- **Mixed Exam Mode (`exam/`)** for comprehensive cross-track knowledge assessment.
- **Zero operational overhead:** 100% static client-side app hosted on GitHub Pages.

## Out of Scope
- Remote backend runners / virtual machines / cloud user databases.
- Manual grading or proctoring services.

## Success Metrics
- Learner completes tracks and passes in-browser validation for each exercise with zero setup friction.
