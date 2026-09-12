# QA Automation Coding Course — System Architecture

> Status: **active**. Companion to `PRODUCT.md` (vision/features), `DESIGN.md` (UI styles), and `CONTEXT.md` (domain terms).

## Constraints

- **No backend, no database:** Completely static client-side application. Zero operational cost.
- **Zero build step:** Pure HTML, CSS, and Vanilla JavaScript. Works immediately when opening `index.html` locally or on GitHub Pages.
- **Offline compatibility:** Runs standalone in the browser without active internet connection once loaded.
- **Privacy by default:** User progress never leaves the learner's browser unless explicitly exported to a local JSON file.

## Stack & Components

| Component | Technology | Rationale |
|---|---|---|
| **Frontend Core** | Vanilla HTML5 / CSS3 / ES Modules | Eliminates build tooling, bundler churn, and dependency vulnerabilities. |
| **In-Browser Database** | AlaSQL | Executes genuine relational SQL and normalization challenges directly in browser memory without a SQLite/PostgreSQL server. |
| **Code Validation** | Client-side assertion runner | Evaluates learner output in real time against challenge expectations with zero latency. |
| **State Persistence** | `localStorage` + File System Access API | Automatic local save per lesson; manual JSON export/import for multi-device sync (see ADR 0001). |
| **Hosting & CI/CD** | GitHub Pages | Continuous deployment triggered on pushes to `main`. |

## Architecture Layout

```
/
├── index.html                  # Course portal landing page
├── version.json                # Version check metadata
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   └── agents/                 # Agent skills configuration
├── Playwright/                 # Playwright test automation track
├── Robot-Framework/            # Robot Framework test automation track
├── API-Testing/                # API test automation track
├── Performance-Testing/        # k6 performance testing track
├── DB-Design-SQL/              # Database design & AlaSQL track
├── Security-Testing/           # Security & OWASP testing track
├── Accessibility-Testing/      # axe-core & accessibility track
├── Visual-Regression-Testing/  # Visual regression testing track
├── CI-CD-Pipeline/             # GitHub Actions CI/CD track
└── Framework-Design/           # Test automation framework architecture track
```

## Track Structure Pattern

Each track adheres to a consistent tripartite structure:
1. **Theory Block:** Explains the testing pattern, common failure modes, and best practices.
2. **Interactive Workspace:** Pre-populated code editor with `WRITE YOUR CODE HERE` checkpoints.
3. **Execution & Feedback:** Immediate validation against unit test assertions with progressive hint and reference solution disclosure.
