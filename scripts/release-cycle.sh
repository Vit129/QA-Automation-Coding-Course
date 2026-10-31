#!/bin/bash
# Safe release readiness check. Publishing is a separate, explicitly requested stage.
# This helper never stages, commits, pushes, merges, tags, releases, or deploys.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Running release readiness gate (tests + static build)..."
npm run release:check
echo "Gates passed for $(git branch --show-current). No publishing action was performed."
