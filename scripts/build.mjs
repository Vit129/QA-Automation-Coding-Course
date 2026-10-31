import { cp, mkdir, rm } from 'node:fs/promises';

const roots = [
  'index.html', 'certificate_preview.html', 'assets', 'shared', 'exam',
  'API-Testing', 'Accessibility-Testing', 'CI-CD-Pipeline', 'CLI-Essentials',
  'DB-Design-SQL', 'Data-Structures-Algorithms', 'Final-Project',
  'Framework-Design', 'Modern-CLI-Tools', 'OOP-Fundamentals',
  'Performance-Testing', 'Playwright', 'Programming-Paradigms',
  'Robot-Framework', 'Security-Testing', 'Tech-Builder',
  'Visual-Regression-Testing',
];
const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const root of roots) {
  await cp(new URL(`../${root}`, import.meta.url), new URL(`../dist/${root}`, import.meta.url), { recursive: true });
}
console.log(`Built static course preview in ${new URL('../dist/', import.meta.url).pathname}`);
