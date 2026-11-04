import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
if (!/^\d+\.\d+\.\d+$/.test(packageVersion ?? "")) throw new Error(`Invalid package semver: ${packageVersion}`);

const release = JSON.parse(fs.readFileSync(path.join(root, "version.json"), "utf8"));
if (release.tag !== `v${packageVersion}`) throw new Error(`version.json tag ${release.tag} does not match package.json ${packageVersion}`);
if (!Number.isInteger(release.version)) throw new Error(`version.json build must be an integer; found ${release.version}`);

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const build = html.match(/const CURRENT_VERSION = (\d+);/)?.[1];
if (Number(build) !== release.version) throw new Error(`index.html update-check build ${build ?? "missing"} does not match version.json ${release.version}`);

const changelog = fs.readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
const latest = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
if (latest !== packageVersion) throw new Error(`CHANGELOG.md latest version ${latest ?? "missing"} does not match ${packageVersion}`);

console.log(`version surfaces agree: ${packageVersion} (build ${release.version})`);
