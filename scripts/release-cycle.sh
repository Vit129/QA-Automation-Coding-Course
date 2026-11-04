#!/bin/bash
# Full cycle: test -> scoped staged commit -> push/PR merge -> release or skip -> verified Pages deploy.
# Usage: scripts/release-cycle.sh [commit-message] [patch|minor|major|skip]
# Stage only the files intended for this commit before running the script.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "${1:-}" == "--resume" ]]; then
  BRANCH="$(git branch --show-current)"
  if [[ "$BRANCH" == "main" ]]; then
    exec bash scripts/release.sh --resume
  fi
  SUBJECT="$(git log -1 --format=%s)"
  if [[ "$SUBJECT" =~ ^chore\(build\):\ build\ ([0-9]+)$ ]]; then
    VERSION_TYPE="skip"
  elif [[ "$SUBJECT" =~ ^chore\(release\):\ prepare\ v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    VERSION_TYPE="release"
  else
    echo "HEAD is not a prepared delivery candidate; refusing to create a new version during recovery." >&2
    exit 1
  fi
  command -v graphify >/dev/null || { echo "graphify is required before delivery." >&2; exit 1; }
  graphify update .
  npm run release:check
  PR_RECORD="$(gh pr list --state all --head "$BRANCH" --base main --json url,state,mergedAt --jq 'if length == 0 then "" else .[0] | [.url, .state, (.mergedAt // "")] | @tsv end')"
  if [[ -n "$PR_RECORD" ]]; then
    IFS=$'\t' read -r PR_URL PR_STATE PR_MERGED_AT <<< "$PR_RECORD"
    if [[ -n "$PR_MERGED_AT" || "$PR_STATE" == "MERGED" ]]; then
      git switch main
      git pull --ff-only origin main
      bash scripts/release.sh --publish "$VERSION_TYPE"
      exit 0
    fi
    [[ "$PR_STATE" == "OPEN" ]] || { echo "The candidate PR is closed without a merge; reopen or replace it before resuming." >&2; exit 1; }
    git push origin "HEAD:refs/heads/$BRANCH"
  else
    git push origin "HEAD:refs/heads/$BRANCH"
    PR_URL="$(gh pr create --base main --head "$BRANCH" --title "Merge $BRANCH into main" --body "Resume prepared delivery candidate.")"
  fi
  gh pr checks "$PR_URL" --watch
  gh pr merge "$PR_URL" --merge
  git switch main
  git pull --ff-only origin main
  bash scripts/release.sh --publish "$VERSION_TYPE"
  exit 0
fi

if [[ "$(git branch --show-current)" == "main" ]]; then
  echo "Ship requires a feature branch; refusing to prepare or push directly on main." >&2
  exit 1
fi

COMMIT_MSG="${1:-}"
VERSION_TYPE="${2:-}"
if [[ -z "$VERSION_TYPE" ]]; then
  if [[ -t 0 ]]; then
    read -erp "Release type (patch/minor/major/skip): " VERSION_TYPE
  else
    echo "Pass an explicit release type: patch, minor, major, or skip." >&2
    exit 2
  fi
fi
case "$VERSION_TYPE" in
  patch|minor|major|skip) ;;
  *) echo "Version type must be patch, minor, major, or skip." >&2; exit 2 ;;
esac

CURRENT_VERSION="$(node -p "require('./package.json').version")"
CURRENT_BUILD="$(node -p "require('./version.json').version")"
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
printf 'Current: v%s (build %s)\npatch:   v%s (build %s)\nminor:   v%s (build %s)\nmajor:   v%s (build %s)\nskip:    v%s (build %s; no tag or GitHub Release)\nSelected: %s\n' \
  "$CURRENT_VERSION" "$CURRENT_BUILD" "${MAJOR}.${MINOR}.$((PATCH + 1))" "$((CURRENT_BUILD + 1))" \
  "${MAJOR}.$((MINOR + 1)).0" "$((CURRENT_BUILD + 1))" "$((MAJOR + 1)).0.0" "$((CURRENT_BUILD + 1))" \
  "$CURRENT_VERSION" "$((CURRENT_BUILD + 1))" "$VERSION_TYPE"

# Test the proposed source before committing or publishing it.
command -v graphify >/dev/null || { echo "graphify is required before commit." >&2; exit 1; }
graphify update .
echo "Running course self-tests before commit..."
npm run release:check

STAGED="$(git diff --cached --name-only)"
UNSTAGED="$(git diff --name-only)"
UNTRACKED="$(git ls-files --others --exclude-standard)"
if [[ -n "$STAGED" ]]; then
  if [[ -n "$UNSTAGED" || -n "$UNTRACKED" ]]; then
    echo "Working tree has unstaged or untracked files. Stage the intended files explicitly, then retry." >&2
    git status --short >&2
    exit 1
  fi
  if [[ -z "$COMMIT_MSG" ]]; then
    if [[ -t 0 ]]; then read -erp "Commit message: " COMMIT_MSG; else
      echo "Staged changes need a commit message in non-interactive mode." >&2; exit 1
    fi
  fi
  [[ -n "$COMMIT_MSG" ]] || { echo "Commit message cannot be empty." >&2; exit 1; }
  git commit -m "$COMMIT_MSG"
elif [[ -n "$UNSTAGED" || -n "$UNTRACKED" ]]; then
  echo "No staged changes. Stage the intended files explicitly; this script will not stage the whole repository." >&2
  git status --short >&2
  exit 1
else
  echo "Working tree clean; continuing from the current commit."
fi

# Generate the version and release documentation from the committed source change,
# then add that metadata commit before any push or merge.
bash scripts/release.sh --prepare "$VERSION_TYPE"
git add CHANGELOG.md package.json package-lock.json version.json index.html
if [[ "$VERSION_TYPE" == "skip" ]]; then
  BUILD="$(node -p "require('./version.json').version")"
  git commit -m "chore(build): build $BUILD"
else
  TAG="v$(node -p "require('./package.json').version")"
  git commit -m "chore(release): prepare $TAG"
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" == "main" ]]; then
  echo "Ship requires a feature branch; refusing to push directly to main." >&2
  exit 1
else
  git push origin "HEAD:refs/heads/$BRANCH"
  PR_URL="$(gh pr list --head "$BRANCH" --base main --json url --jq '.[0].url // empty')"
  if [[ -z "$PR_URL" ]]; then
    PR_URL="$(gh pr create --base main --head "$BRANCH" --title "Merge $BRANCH into main" --body "Delivery workflow release cycle.")"
  fi
  gh pr checks "$PR_URL" --watch
  gh pr merge "$PR_URL" --merge
  git switch main
  git pull --ff-only origin main
fi

bash scripts/release.sh --publish "$VERSION_TYPE"
