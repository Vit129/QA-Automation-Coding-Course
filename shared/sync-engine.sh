#!/usr/bin/env bash
set -euo pipefail

# shared/engine.js is the canonical source. WebKit's file:// sandboxing blocks
# <script src="../shared/engine.js"> (confirmed: parent-directory script tags
# silently fail to load), so each track needs its own same-directory copy.
# Edit shared/engine.js, then re-run this script - never edit a track's
# engine.js copy directly, it will be overwritten.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRACKS=(API-Testing Playwright Robot-Framework Performance-Testing DB-Design-SQL CLI-Essentials)

for track in "${TRACKS[@]}"; do
  cp "$DIR/engine.js" "$DIR/../$track/engine.js"
  echo "synced -> $track/engine.js"
done
