# Product

## Vision
Browser-based, no-backend, no-build-step code sandbox for learning QA automation — theory, then write real code in-browser, get validated instantly.

## Target Users
Self-learners studying QA automation (Playwright, Robot Framework, API/performance/security/accessibility/visual-regression testing, CI/CD, framework design).

## Core Problems
- QA automation tutorials are usually video/text-only, no hands-on coding checkpoint
- Setting up a real project per topic (Playwright project, k6, Robot Framework env) is too much friction just to practice one concept
- No single place covering the full QA automation stack (E2E, API, perf, DB, security, a11y, visual, CI/CD, framework design)

## Core Features
- 11 tracks: Playwright, Robot Framework, API Testing, Performance Testing (k6), DB Design/SQL (AlaSQL in-browser), CLI Essentials, Security Testing, Accessibility Testing (axe-core), Visual Regression Testing, CI/CD Pipeline (GitHub Actions YAML), Framework Design
- Per-lesson flow: theory → code template ("WRITE YOUR CODE HERE") → in-browser validation → hint → solution
- Progress saved to `localStorage`, no account/backend needed
- Mixed exam mode (`exam/`)
- Deployed via GitHub Pages, auto-updates on push to `main`

## Out of Scope
- Backend/accounts/cross-device progress sync
- Real CI runners, real browsers under test — everything sandboxed in-browser
- Grading/certification

## Success Metrics
- Learner completes tracks and passes in-browser validation for each exercise

---
Sourced from README.md and package.json as of 2026-07-18. Repo is course material, not a product with users/roadmap — this file restates the README's scope rather than inventing goals not present in the repo.
