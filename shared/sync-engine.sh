#!/usr/bin/env bash
set -euo pipefail

# shared/*.js are the canonical sources. WebKit's file:// sandboxing blocks
# <script src="../shared/engine.js"> (confirmed: parent-directory script tags
# silently fail to load), so each track needs its own same-directory copy.
# Edit the shared/ files, then re-run this script - never edit a track's
# copy directly, it will be overwritten.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRACKS=(API-Testing Playwright Robot-Framework Performance-Testing DB-Design-SQL CLI-Essentials Security-Testing Accessibility-Testing Visual-Regression-Testing CI-CD-Pipeline Framework-Design)
FILES=(engine.js editor-autocomplete.js)

for track in "${TRACKS[@]}"; do
  for file in "${FILES[@]}"; do
    cp "$DIR/$file" "$DIR/../$track/$file"
    echo "synced -> $track/$file"
  done
done
