# QA Automation Coding Course

Browser-based code sandbox course for learning QA automation. No backend; the static build copies the course into `dist/` for isolated preview and Pages packaging.

## Tracks

- **Playwright** — TypeScript end-to-end testing
- **Robot-Framework** — keyword-driven automation
- **API-Testing** — API test scenarios
- **Performance-Testing** — k6 load testing
- **DB-Design-SQL** — SQL + database design, Normal Forms (1NF-BCNF), runs real queries in-browser via AlaSQL
- **CLI-Essentials** — Git, Vim & Unix cheat sheet
- **Modern-CLI-Tools** — zoxide, fd, ripgrep, bat, eza, fzf, jq (Modern fast CLI productivity)
- **Security-Testing** — AppSec & Cyber Defense: CompTIA Security+ (SY0-701) core, STRIDE, cryptography, PKI, OWASP Top 10 (SQLi, XSS, IDOR, SSRF, JWT), WAF, DevSecOps & Incident Response
- **Accessibility-Testing** — axe-core, ARIA, keyboard navigation
- **Visual-Regression-Testing** — Playwright screenshot diffing
- **CI-CD-Pipeline** — GitHub Actions YAML
- **Framework-Design** — test automation project structure (fixtures, DRY, reporting)
- **OOP-Fundamentals** — OOP concepts & design patterns in TypeScript/JavaScript
- **Programming-Paradigms** — functional, imperative, declarative & reactive programming for automation
- **Data-Structures-Algorithms** — Big-O, hash tables, stacks/queues, trees/graphs, sorting, DP — intro CS fundamentals framed around QA scenarios
- **Tech-Builder** — Become a Tech Builder (Agentic Engineering): System architecture, resilient backends, AST dependency analysis, offline-first sync, and shift-left security
- **Final-Project** — Capstone project integrating full-cycle automation and engineering practices

Each track is a static HTML/CSS/JS page: theory → code template (`WRITE YOUR CODE HERE`) → validation → hint → solution. Progress saves to `localStorage`.

## Run

`npm start` / `make start` serves the source on loopback at port 8000. `npm run preview` builds and serves the production copy on loopback at port 4173. Run `npm run release:check` before publishing; it verifies semver/build parity, runs every lesson test, and builds the static site. Pull request CI and the Pages workflow run this gate. `npm run ship` is readiness-only: it does not commit, push, merge, tag, release, or deploy. The release script synchronizes `package.json`, `version.json`, the update-check build number, and the changelog, then runs the gate on the committed candidate before tag/push.

Two ways to use this course:

- **Always up to date, no git needed:** open **https://vit129.github.io/QA-Automation-Coding-Course/** — every push to `main` redeploys automatically.
- **Offline / local copy:** `git clone` the repo and open `index.html` directly. This is read-only for learning — no need to push anything back. The landing page checks `version.json` against this repo on load and shows a banner if your clone is behind; run `git pull origin main` to catch up.

## License

MIT — see [LICENSE](./LICENSE).
