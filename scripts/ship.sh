#!/bin/bash
# Full ship cycle: commit -> push (+ PR merge if not already on main) -> lesson
# self-test -> version bump/tag/GitHub Release (scripts/release.sh) -> confirm
# the GitHub Pages deploy that auto-triggers on push actually succeeded.
#
# Usage:
#   scripts/ship.sh ["commit message"] [patch|minor|major|skip]
#   scripts/ship.sh                       # prompts for a commit message, defaults to patch
#   scripts/ship.sh "fix: typo" skip      # commit + push only, no release
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMMIT_MSG="${1:-}"
VERSION_TYPE="${2:-patch}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 1: Commit & Push"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ -n "$(git status --porcelain)" ]]; then
  git status --short
  if [[ -z "$COMMIT_MSG" ]]; then
    if [[ -t 0 ]]; then
      read -rp "Commit message: " COMMIT_MSG
    else
      echo "Working tree is dirty and no commit message was given (non-interactive). Aborting." >&2
      exit 1
    fi
  fi
  if [[ -z "$COMMIT_MSG" ]]; then
    echo "Commit message cannot be empty." >&2
    exit 1
  fi
  git add -A
  git commit -m "$COMMIT_MSG"
else
  echo "Working tree clean — continuing with the existing commit."
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "Current branch: $BRANCH"

if [[ "$BRANCH" == "main" ]]; then
  git push origin main
else
  git push origin "HEAD:$BRANCH"
  echo "Creating/merging PR into main..."
  PR_URL="$(gh pr create --base main --head "$BRANCH" --title "Merge $BRANCH into main" --body "Auto-merged by scripts/ship.sh" 2>/dev/null || gh pr view "$BRANCH" --json url --jq .url)"
  gh pr merge "$PR_URL" --merge --admin
  git checkout main
  git pull origin main
  git push origin --delete "$BRANCH" || true
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 2: Verify & Release"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Running lesson self-test (npm test)..."
npm test

if [[ "$VERSION_TYPE" == "skip" ]]; then
  echo "Skipping release (version type = skip)."
else
  bash scripts/release.sh "$VERSION_TYPE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PHASE 3: Confirm Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GitHub Pages deploys automatically on push to main (.github/workflows/pages.yml)."
echo "Waiting for the run to start, then watching it..."
sleep 5
RUN_ID="$(gh run list --workflow="Deploy to GitHub Pages" --limit 1 --json databaseId --jq '.[0].databaseId')"
if gh run watch "$RUN_ID" --exit-status; then
  echo ""
  echo "🎉 SHIP COMPLETE — live at https://vit129.github.io/QA-Automation-Coding-Course/"
else
  echo ""
  echo "⚠️  Deploy run failed — check: gh run view $RUN_ID --log-failed" >&2
  exit 1
fi
