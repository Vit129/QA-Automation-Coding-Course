import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function updateReleaseVersion(root, version) {
  if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) throw new Error("Expected semver X.Y.Z");
  const packageFile = path.join(root, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  pkg.version = version;
  fs.writeFileSync(packageFile, `${JSON.stringify(pkg, null, 2)}\n`);

  const versionFile = path.join(root, "version.json");
  const release = JSON.parse(fs.readFileSync(versionFile, "utf8"));
  release.version += 1;
  release.tag = `v${version}`;
  release.updated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(versionFile, `${JSON.stringify(release, null, 2)}\n`);

  const htmlFile = path.join(root, "index.html");
  const html = fs.readFileSync(htmlFile, "utf8");
  const updated = html.replace(/const CURRENT_VERSION = \d+;/, `const CURRENT_VERSION = ${release.version};`);
  if (updated === html) throw new Error("Could not update index.html CURRENT_VERSION");
  fs.writeFileSync(htmlFile, updated);
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  updateReleaseVersion(path.resolve(path.dirname(scriptPath), ".."), process.argv[2]);
}
