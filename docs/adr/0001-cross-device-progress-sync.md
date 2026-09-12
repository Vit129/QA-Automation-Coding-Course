# 1. Cross-Device Progress Sync via File Export/Import Instead of CloudKit/OAuth

Date: 2026-07-29
Status: Accepted

## Context
Learner lesson progress lives in browser `localStorage`. We evaluated how to allow learners to move progress across multiple devices:
- Option A: Direct cloud integration (Google Drive OAuth client, Apple CloudKit JS with Apple Developer Program membership).
- Option B: OS-level file picker export/import using File System Access API (`showSaveFilePicker()`) with fallback to `<a download>` and native `<input type="file">`.

## Decision
We chose **Option B (OS-level export/import)**:
- Moving progress between devices is handled via Export/Import buttons combined with whatever cloud sync client (Google Drive, iCloud Drive, Dropbox) the learner already runs on their OS.
- Eliminates the need for backend accounts, OAuth setup, and Apple Developer Program membership ($99/yr).
- Preserves privacy: each learner touches only their local filesystem; the static site never sees or stores user identity or progress data.

## Consequences
- Requires the user to trigger manual export/import to transfer state between machines.
- Browser without File System Access API falls back to standard file download.
