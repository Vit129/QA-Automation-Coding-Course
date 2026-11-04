#!/bin/bash
# Wait for the Pages workflow for the requested source commit and verify its live marker.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
SOURCE_SHA="${1:-$(git rev-parse HEAD)}"
SITE_URL="https://vit129.github.io/QA-Automation-Coding-Course"
RUN_ID=""

find_run() {
  gh run list --workflow="Deploy to GitHub Pages" --limit 20 --json databaseId,headSha --jq "[.[] | select(.headSha == \"$SOURCE_SHA\")] | first | .databaseId // empty"
}
wait_for_new_run() {
  local previous="$1" found=""
  for attempt in {1..30}; do
    found="$(find_run)"
    if [[ -n "$found" && "$found" != "$previous" ]]; then
      printf '%s' "$found"
      return 0
    fi
    sleep 2
  done
  echo "No new Pages run appeared for $SOURCE_SHA." >&2
  return 1
}
dispatch_retry() {
  local previous="$1"
  echo "Dispatching a fresh Pages deployment for $SOURCE_SHA." >&2
  gh workflow run pages.yml --ref main >&2
  wait_for_new_run "$previous"
}
verify_live() {
  local live
  live="$(curl -fsSL "$SITE_URL/deploy-info.json?nocache=$(date +%s)")"
  EXPECTED_SHA="$SOURCE_SHA" EXPECTED_VERSION="$(node -p "require('./package.json').version")" EXPECTED_BUILD="$(node -p "require('./version.json').version")" LIVE_INFO="$live" node -e 'const i=JSON.parse(process.env.LIVE_INFO); for(const k of ["commit","version","build"]){const e=process.env[`EXPECTED_${k.toUpperCase()}`]; if(String(i[k])!==String(e)){console.error(`Live ${k} ${i[k]} does not match ${e}`);process.exit(1)}}'
}

for attempt in {1..30}; do
  RUN_ID="$(find_run)"
  [[ -n "$RUN_ID" ]] && break
  sleep 2
done
if [[ -z "$RUN_ID" ]]; then RUN_ID="$(dispatch_retry "")"; fi
if ! gh run watch "$RUN_ID" --exit-status; then
  RUN_ID="$(dispatch_retry "$RUN_ID")"
  gh run watch "$RUN_ID" --exit-status
fi
if ! verify_live; then
  RUN_ID="$(dispatch_retry "$RUN_ID")"
  gh run watch "$RUN_ID" --exit-status
  verify_live
fi
echo "Pages is serving $SOURCE_SHA (v$(node -p "require('./package.json').version"), build $(node -p "require('./version.json').version")) at $SITE_URL"
