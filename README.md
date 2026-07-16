# QA Automation Coding Course

Browser-based code sandbox course for learning QA automation. No backend, no build step — open `index.html` and go.

## Tracks

- **Playwright** — TypeScript end-to-end testing
- **Robot-Framework** — keyword-driven automation
- **API-Testing** — API test scenarios
- **Performance-Testing** — k6 load testing
- **DB-Design-SQL** — SQL + database design, runs real queries in-browser via AlaSQL
- **CLI-Essentials** — Git, Vim & Unix cheat sheet
- **Security-Testing** — auth bypass, injection awareness, XSS prevention
- **Accessibility-Testing** — axe-core, ARIA, keyboard navigation
- **Visual-Regression-Testing** — Playwright screenshot diffing
- **CI-CD-Pipeline** — GitHub Actions YAML
- **Framework-Design** — test automation project structure (fixtures, DRY, reporting)

Each track is a static HTML/CSS/JS page: theory → code template (`WRITE YOUR CODE HERE`) → validation → hint → solution. Progress saves to `localStorage`.

## Run

Two ways to use this course:

- **Always up to date, no git needed:** open **https://vit129.github.io/QA-Automation-Coding-Course/** — every push to `main` redeploys automatically.
- **Offline / local copy:** `git clone` the repo and open `index.html` directly. This is read-only for learning — no need to push anything back. The landing page checks `version.json` against this repo on load and shows a banner if your clone is behind; run `git pull origin main` to catch up.

## Development

This is a static site with no build step for end users, but lesson content has a self-test harness to guard against a lesson's `validate()` drifting out of sync with its `solution`/`template`:

```bash
npm install   # pulls in alasql, used only by the DB-Design-SQL track's real SQL execution
npm test      # runs shared/selftest.mjs across every track
```

Each lesson's `validate(solution)` must pass and `validate(template)` must fail — that invariant is the only thing catching silent regex/content drift. Run this after editing any `course.js`.

If you edit `shared/engine.js` (the sandbox engine shared by every track), re-run `shared/sync-engine.sh` to propagate the change into each track's own `engine.js` copy — `<script src="../shared/engine.js">` doesn't work due to `file://` sandboxing, so every track keeps a same-directory copy in sync via that script.

## License

MIT — see [LICENSE](./LICENSE).
