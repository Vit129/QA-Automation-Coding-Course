# Glossary

## Cross-Device Progress Sync

Learner's lesson progress lives in `localStorage` (per-browser). Moving it between devices is handled entirely via the existing Export/Import buttons plus whatever cloud-sync client (Google Drive, iCloud Drive, Dropbox, etc.) the learner already has running on their OS — no code integration with any cloud provider needed.

- **Import** (📥): already uses a native `<input type="file">` picker — the learner can browse into any folder, including one synced by Google Drive/iCloud Drive desktop apps. No change needed.
- **Export** (📤): planned upgrade to the File System Access API (`showSaveFilePicker()`) so the learner can choose the save destination directly — e.g. save straight into their iCloud Drive or Google Drive synced folder — instead of silently landing in the browser's default Downloads folder. Falls back to the original `<a download>` behavior in browsers without File System Access API support (Safari, Firefox). Not yet implemented — `exportProgress()` in `index.html` still uses the plain `<a download>` flow.
- **Why this and not OAuth+Drive/CloudKit integration:** considered and rejected during `/interview` (2026-07-29) — building direct Google Drive/iCloud API integration would need a Google Cloud OAuth client (free but requires setup) and, for iCloud, a paid Apple Developer Program membership ($99/yr) plus CloudKit JS domain verification. The OS-level file-picker approach gets the same "sync across my own devices" outcome for free, with zero new backend/account surface, and privacy is automatic (each learner only ever touches their own file system and their own cloud client — this site never sees or stores anyone's data either way).

**Status:** decided, 2026-07-29. Not yet implemented.
