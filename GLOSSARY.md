# Glossary

## Cloud Progress Sync

Opt-in feature (not yet built) letting a learner's lesson progress (currently `localStorage`-only, per-browser) follow them across devices by saving to a cloud storage provider they sign into voluntarily.

- **Provider phasing:** Google Drive first (feasible from a static GitHub Pages site — client-side OAuth via Google Identity Services + Drive API `appDataFolder`, no backend needed, free). iCloud deferred — requires a paid Apple Developer Program membership ($99/yr) plus a CloudKit JS container verified against the `vit129.github.io` domain; not started until that cost is accepted.
- **Mechanism:** extends the existing "Export progress" flow (today: downloads a JSON file the learner manually re-imports on another device). Adds a "Save to Google Drive" / "Load from Google Drive" action using the same progress JSON shape already produced by the local export and consumed by `applyProgressData()`.
- **Relationship to existing no-account design:** `PRODUCT.md`'s Out of Scope line ("Backend/accounts/cross-device progress sync") stays true for the *default* experience — no sign-in required, `localStorage` remains the source of truth. Cloud sync is an additive, opt-in layer: signing into Google is only needed if the learner wants cross-device sync. No custom backend is introduced — Drive API is called directly from the browser.
- **Hard external blocker:** a Google Cloud Console project + OAuth 2.0 Client ID (configured with the `vit129.github.io` origin) must exist before any Drive-sync code can authenticate. This requires the repo owner's own Google account — Claude cannot create it. This is the actual next step before `dev-architect` can design the integration in detail.

**Status:** scoped via `/interview`, 2026-07-29. Not yet designed or implemented.
