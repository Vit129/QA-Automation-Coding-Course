#!/bin/bash
# Prepare, publish, or resume a SemVer/build-only deployment.
# Usage: scripts/release.sh <patch|minor|major|skip>
#        scripts/release.sh --prepare <patch|minor|major|skip>
#        scripts/release.sh --publish <patch|minor|major|skip>
#        scripts/release.sh --resume
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

require_main() {
  local mode="${1:-strict}" branch head remote ahead
  branch="$(git branch --show-current)"
  [[ "$branch" == "main" ]] || { echo "Delivery must run from main (current branch: $branch)." >&2; exit 1; }
  [[ -z "$(git status --porcelain)" ]] || { echo "Delivery requires a clean working tree." >&2; exit 1; }
  git fetch origin main --tags
  head="$(git rev-parse HEAD)"
  remote="$(git rev-parse origin/main)"
  if [[ "$mode" == "resume" && "$head" != "$remote" ]]; then
    git merge-base --is-ancestor "$remote" "$head" || { echo "Local main and origin/main have diverged." >&2; exit 1; }
    ahead="$(git rev-list --count "${remote}..${head}")"
    [[ "$ahead" == "1" ]] || { echo "Recovery allows exactly one local candidate commit ahead of origin/main." >&2; exit 1; }
  else
    [[ "$head" == "$remote" ]] || { echo "Local main must match origin/main before delivery." >&2; exit 1; }
  fi
}

release_notes() {
  local tag="$1" previous
  previous="$(git tag --sort=-v:refname | grep -vx "$tag" | head -n 1 || true)"
  if [[ -n "$previous" ]]; then git-cliff "${previous}..${tag}" --strip header
  else git-cliff --tag "$tag" --strip header
  fi
}

prepare_candidate() {
  local type="$1" current current_tag build meta_tag major minor patch next_patch next_minor next_major next_build new_version tag build_only=0 latest_tag latest_version live_response live_status live_info
  [[ -z "$(git status --porcelain)" ]] || { echo "Prepare requires a clean tree after the source commit." >&2; exit 1; }
  git fetch origin --tags
  current="$(node -p "require('./package.json').version")"
  current_tag="v${current}"
  build="$(node -p "require('./version.json').version")"
  meta_tag="$(node -p "require('./version.json').tag")"
  [[ "$meta_tag" == "$current_tag" ]] || { echo "version.json tag ($meta_tag) does not match package version ($current_tag)." >&2; exit 1; }
  if git rev-parse --verify "refs/tags/${current_tag}" >/dev/null 2>&1 && ! gh release view "$current_tag" --json tagName >/dev/null 2>&1; then
    echo "The current tag $current_tag has no confirmed GitHub Release; recover it before starting another." >&2
    exit 1
  fi
  latest_tag="$(git tag --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1 || true)"
  latest_version="${latest_tag#v}"
  if [[ -n "$latest_tag" && "$current" != "$latest_version" ]]; then
    echo "Pending SemVer candidate $current exists; finish that same release before preparing another version." >&2
    exit 1
  fi
  live_response="$(curl -sS -w $'\n%{http_code}' "https://vit129.github.io/QA-Automation-Coding-Course/deploy-info.json?nocache=$(date +%s)")"
  live_status="${live_response##*$'\n'}"
  live_info="${live_response%$'\n'*}"
  if [[ "$live_status" == "200" ]]; then
    LIVE_INFO="$live_info" EXPECTED_VERSION="$current" EXPECTED_BUILD="$build" node -e 'const i=JSON.parse(process.env.LIVE_INFO); for(const k of ["version","build"]){if(String(i[k])!==String(process.env[`EXPECTED_${k.toUpperCase()}`])){console.error(`Last deployment is incomplete: live ${k}=${i[k]}, repo has ${process.env[`EXPECTED_${k.toUpperCase()}`]}`);process.exit(1)}}'
  elif [[ "$live_status" == "404" ]]; then
    echo "No deploy marker exists yet; allowing the first release-gated Pages deployment."
  else
    echo "Could not read the current Pages deployment marker (HTTP $live_status)." >&2
    exit 1
  fi
  IFS='.' read -r major minor patch <<< "$current"
  next_patch="${major}.${minor}.$((patch + 1))"
  next_minor="${major}.$((minor + 1)).0"
  next_major="$((major + 1)).0.0"
  next_build=$((build + 1))
  printf 'Current: v%s (build %s)\npatch:   v%s (build %s)\nminor:   v%s (build %s)\nmajor:   v%s (build %s)\nskip:    v%s (build %s; no tag or GitHub Release)\nSelected: %s\n' \
    "$current" "$build" "$next_patch" "$next_build" "$next_minor" "$next_build" "$next_major" "$next_build" "$current" "$next_build" "$type"
  if [[ "$type" == "skip" ]]; then
    new_version="$current"
    tag="$current_tag"
    build_only=1
  else
    case "$type" in
      major) new_version="$next_major" ;;
      minor) new_version="$next_minor" ;;
      patch) new_version="$next_patch" ;;
      *) echo "Version type must be patch, minor, major, or skip." >&2; exit 2 ;;
    esac
    tag="v${new_version}"
    if git rev-parse --verify "refs/tags/${tag}" >/dev/null 2>&1; then
      echo "Tag $tag already exists; refusing to move or reuse it." >&2
      exit 1
    fi
  fi

  npm run release:check
  CANDIDATE_COMMITTED=0
  cleanup_candidate() {
    local result=$?
    if [[ $result -ne 0 && $CANDIDATE_COMMITTED -eq 0 ]]; then
      git reset --quiet -- CHANGELOG.md package.json package-lock.json version.json index.html
      git restore --quiet -- CHANGELOG.md package.json package-lock.json version.json index.html
    fi
  }
  trap cleanup_candidate EXIT
  if [[ $build_only -eq 1 ]]; then
    unreleased_notes="$(git-cliff --unreleased --strip header)"
  else
    git-cliff --tag "$tag" --output CHANGELOG.md
    unreleased_notes=""
  fi
  RELEASE_DATE="$(date +%F)" NEW_VERSION="$new_version" TAG="$tag" RELEASE_TYPE="$type" UNRELEASED_NOTES="$unreleased_notes" node <<'NODE'
const fs = require('node:fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = process.env.NEW_VERSION;
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
lock.version = process.env.NEW_VERSION;
if (lock.packages?.['']) lock.packages[''].version = process.env.NEW_VERSION;
fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
const meta = JSON.parse(fs.readFileSync('version.json', 'utf8'));
meta.version += 1;
meta.updated = process.env.RELEASE_DATE;
if (process.env.RELEASE_TYPE !== 'skip') meta.tag = process.env.TAG;
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
if (process.env.RELEASE_TYPE === 'skip') {
  const start = changelog.search(/^## \[Unreleased\]\s*$/m);
  let priorNotes = '';
  let clean = changelog;
  if (start >= 0) {
    const contentStart = clean.indexOf('\n', start) + 1;
    const nextHeader = /^## \[/m.exec(clean.slice(contentStart));
    const end = nextHeader ? contentStart + nextHeader.index : clean.length;
    priorNotes = clean.slice(contentStart, end).trim();
    clean = clean.slice(0, start) + clean.slice(end);
  }
  const releaseIndex = clean.search(/^## \[\d/m);
  if (releaseIndex < 0) throw new Error('Could not find the released changelog section');
  const newNotes = process.env.UNRELEASED_NOTES.trim();
  const notes = [priorNotes, newNotes].filter(Boolean).join('\n\n') || `- Build ${meta.version} deployed without a SemVer release.`;
  const firstEntry = newNotes.split('\n').find(line => line.startsWith('- '));
  if (firstEntry) meta.summary = firstEntry.slice(2).trim();
  fs.writeFileSync('CHANGELOG.md', clean.slice(0, releaseIndex) + `## [Unreleased]\n\n${notes}\n\n` + clean.slice(releaseIndex));
} else {
  const section = changelog.split(/^## /m)[1] || '';
  const firstEntry = section.split('\n').find(line => line.startsWith('- '));
  if (firstEntry) meta.summary = firstEntry.slice(2).trim();
  fs.writeFileSync('CHANGELOG.md', changelog);
}
fs.writeFileSync('version.json', JSON.stringify(meta, null, 2) + '\n');
const html = fs.readFileSync('index.html', 'utf8');
if (!/const CURRENT_VERSION = \d+;/.test(html)) throw new Error('Could not find the update-check build number in index.html');
fs.writeFileSync('index.html', html.replace(/const CURRENT_VERSION = \d+;/, `const CURRENT_VERSION = ${meta.version};`));
NODE
  npm run release:check
  CANDIDATE_COMMITTED=1
  trap - EXIT
  echo "Prepared v${new_version} (build ${next_build}); metadata is ready to commit before push."
}

publish_candidate() {
  local type="$1" mode="${2:-strict}" current tag meta_tag build latest_tag latest_version baseline_build head_sha tag_sha notes
  require_main "$mode"
  command -v graphify >/dev/null || { echo "graphify is required before delivery." >&2; exit 1; }
  graphify update .
  npm run release:check
  current="$(node -p "require('./package.json').version")"
  tag="v${current}"
  meta_tag="$(node -p "require('./version.json').tag")"
  build="$(node -p "require('./version.json').version")"
  head_sha="$(git rev-parse HEAD)"
  [[ "$meta_tag" == "$tag" ]] || { echo "version.json tag ($meta_tag) does not match package version ($tag)." >&2; exit 1; }

  if [[ "$type" == "skip" ]]; then
    baseline_build="$(git show "${tag}:version.json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(String(JSON.parse(s).version)))')"
    (( build > baseline_build )) || { echo "Build $build is not newer than the last released build $baseline_build." >&2; exit 1; }
    if [[ "$mode" == "resume" ]]; then git push origin HEAD; fi
    bash scripts/verify-pages-deploy.sh "$head_sha"
    return
  fi

  [[ "$type" == "patch" || "$type" == "minor" || "$type" == "major" || "$type" == "release" ]] || { echo "Version type must be patch, minor, major, release, or skip." >&2; exit 2; }
  if git rev-parse --verify "refs/tags/${tag}^{commit}" >/dev/null 2>&1; then
    tag_sha="$(git rev-parse "refs/tags/${tag}^{commit}")"
    [[ "$tag_sha" == "$head_sha" ]] || { echo "$tag exists at another commit; refusing to move it." >&2; exit 1; }
  else
    git tag "$tag" -m "$tag"
  fi
  if [[ "$mode" == "resume" ]]; then git push origin HEAD; fi
  git push origin "refs/tags/$tag"
  if ! gh release view "$tag" --json tagName >/dev/null 2>&1; then
    notes="$(release_notes "$tag")"
    if ! gh release create "$tag" --repo Vit129/QA-Automation-Coding-Course --title "$tag" --notes "$notes"; then
      echo "Tag $tag is pushed. Retry the same candidate with: npm run release -- --resume" >&2
      exit 1
    fi
  fi
  bash scripts/verify-pages-deploy.sh "$head_sha"
  echo "Released and deployed $tag (build $build)."
}

MODE="direct"
if [[ "${1:-}" == "--prepare" ]]; then MODE="prepare"; VERSION_TYPE="${2:-}"
elif [[ "${1:-}" == "--publish" ]]; then MODE="publish"; VERSION_TYPE="${2:-}"
elif [[ "${1:-}" == "--resume" ]]; then MODE="resume"; VERSION_TYPE="auto"
else VERSION_TYPE="${1:-}"
fi
case "$VERSION_TYPE" in
  patch|minor|major|skip|release|auto) ;;
  *) echo "Usage: scripts/release.sh <patch|minor|major|skip> | --prepare <type> | --publish <type> | --resume" >&2; exit 2 ;;
esac
command -v git-cliff >/dev/null || { echo "git-cliff is required." >&2; exit 1; }

if [[ "$MODE" == "prepare" ]]; then
  command -v graphify >/dev/null || { echo "graphify is required before delivery." >&2; exit 1; }
  graphify update .
  prepare_candidate "$VERSION_TYPE"
  exit 0
fi
if [[ "$MODE" == "publish" ]]; then
  publish_candidate "$VERSION_TYPE"
  exit 0
fi
if [[ "$MODE" == "resume" ]]; then
  require_main resume
  current="$(node -p "require('./package.json').version")"
  tag="v${current}"
  build="$(node -p "require('./version.json').version")"
  latest_tag="$(git tag --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1 || true)"
  latest_version="${latest_tag#v}"
  if [[ "$latest_tag" == "$tag" ]] && git rev-parse --verify "refs/tags/${tag}^{commit}" >/dev/null 2>&1 && [[ "$(git rev-parse "refs/tags/${tag}^{commit}")" == "$(git rev-parse HEAD)" ]]; then
    publish_candidate patch resume
  elif [[ "$current" != "$latest_version" ]]; then
    publish_candidate patch resume
  else
    baseline_build="$(git show "${latest_tag}:version.json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(String(JSON.parse(s).version)))')"
    (( build > baseline_build )) || { echo "No pending release/build candidate found on main." >&2; exit 1; }
    publish_candidate skip resume
  fi
  exit 0
fi

command -v graphify >/dev/null || { echo "graphify is required before delivery." >&2; exit 1; }
graphify update .
require_main
npm run release:check
prepare_candidate "$VERSION_TYPE"
if [[ "$VERSION_TYPE" == "skip" ]]; then
  BUILD="$(node -p "require('./version.json').version")"
  git add CHANGELOG.md package.json package-lock.json version.json index.html
  git commit -m "chore(build): build $BUILD"
else
  TAG="v$(node -p "require('./package.json').version")"
  git add CHANGELOG.md package.json package-lock.json version.json index.html
  git commit -m "chore(release): prepare $TAG"
fi
git push origin HEAD
publish_candidate "$VERSION_TYPE"
