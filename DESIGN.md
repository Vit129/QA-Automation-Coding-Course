# Design System

## Design Direction
Dark-theme developer sandbox — code-first, minimal chrome, per-track accent color for quick visual identification.

## Colors
Source: per-track `style.css` + `index.html` CSS custom properties (not perfectly unified across tracks)
- Background: `--bg-primary: #0a0d14` / `#080b11`, `--bg-secondary`
- Border: `--border-color: rgba(255,255,255,0.08)`
- Text: `--text-primary: #f3f4f6`, `--text-secondary: #9ca3af`
- Accent palette: `--accent-blue #3b82f6`, `--accent-emerald #10b981`, `--accent-amber/orange`, `--accent-rose/red`, plus violet/gold/teal/indigo/pink/cyan/lime variants used per-track for identity

## Typography
- UI: Inter (`--font-sans`, Google Fonts)
- Code blocks: Fira Code (`--font-mono`)

## Components
- Border-radius: 3px–9999px (pill badges/buttons), cards 8-16px
- Shadows: soft dark drop-shadow on cards (`0 20px 40px -15px rgba(0,0,0,0.6)`), glow-style accent shadow (`0 0 12px rgba(accent,0.4)`) on interactive elements
- Gradients: sparse — progress bars, headline text-fill only
- Same structural conventions repeat per track, accent color is the per-track differentiator

## Avoid
- Introducing a UI framework/build step — the site is intentionally vanilla HTML/CSS/JS
- Light theme — dark-only across all tracks
- Fully unifying accent colors across tracks — per-track color is the intended visual cue, not an inconsistency to fix

---
Sourced from `Playwright/style.css`, `index.html`, and cross-track CSS custom properties as of 2026-07-18.
