import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { updateReleaseVersion } from "../scripts/set-release-version.mjs";

test("release metadata updates semver and build surfaces together", (t) => {
  const tempRoot = path.join(process.cwd(), ".tmp");
  fs.mkdirSync(tempRoot, { recursive: true });
  const root = fs.mkdtempSync(path.join(tempRoot, "qa-release-version-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  fs.writeFileSync(path.join(root, "package.json"), '{"version":"0.15.1"}\n');
  fs.writeFileSync(path.join(root, "version.json"), '{"version":10,"tag":"v0.15.1","updated":"2026-10-25"}\n');
  fs.writeFileSync(path.join(root, "index.html"), "const CURRENT_VERSION = 10;\n");

  updateReleaseVersion(root, "0.15.2");

  assert.equal(JSON.parse(fs.readFileSync(path.join(root, "package.json"))).version, "0.15.2");
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, "version.json"))), {
    version: 11,
    tag: "v0.15.2",
    updated: new Date().toISOString().slice(0, 10),
  });
  assert.match(fs.readFileSync(path.join(root, "index.html"), "utf8"), /CURRENT_VERSION = 11/);
});
