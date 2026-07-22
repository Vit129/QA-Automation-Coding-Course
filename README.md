# QA Automation Coding Course

Browser-based code sandbox course for learning QA automation. No backend, no build step — open `index.html` and go.

## Tracks

- **Playwright** — TypeScript end-to-end testing
- **Robot-Framework** — keyword-driven automation
- **API-Testing** — API test scenarios
- **Performance-Testing** — k6 load testing
- **DB-Design-SQL** — SQL + database design, Normal Forms (1NF-BCNF), runs real queries in-browser via AlaSQL
- **CLI-Essentials** — Git, Vim & Unix cheat sheet
- **Security-Testing** — auth bypass, injection awareness, XSS prevention
- **Accessibility-Testing** — axe-core, ARIA, keyboard navigation
- **Visual-Regression-Testing** — Playwright screenshot diffing
- **CI-CD-Pipeline** — GitHub Actions YAML
- **Framework-Design** — test automation project structure (fixtures, DRY, reporting)
- **Data-Structures-Algorithms** — Big-O, hash tables, stacks/queues, trees/graphs, sorting, DP — intro CS fundamentals framed around QA scenarios

Each track is a static HTML/CSS/JS page: theory → code template (`WRITE YOUR CODE HERE`) → validation → hint → solution. Progress saves to `localStorage`.

## Run

Two ways to use this course:

- **Always up to date, no git needed:** open **https://vit129.github.io/QA-Automation-Coding-Course/** — every push to `main` redeploys automatically.
- **Offline / local copy:** `git clone` the repo and open `index.html` directly. This is read-only for learning — no need to push anything back. The landing page checks `version.json` against this repo on load and shows a banner if your clone is behind; run `git pull origin main` to catch up.

## License

MIT — see [LICENSE](./LICENSE).
