/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is intentional for the release-check runner. */
const { spawnSync } = require("node:child_process");

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const checks = [
  ["typecheck", ["run", "typecheck"]],
  ["lint", ["run", "lint"]],
  ["data validation", ["run", "test:data"]],
  ["transfer safety", ["run", "test:transfer-safety"]],
  ["feature route audit", ["run", "audit:routes"]],
  ["migration inventory", ["run", "audit:migration"]],
  ["asset inventory", ["run", "audit:assets"]],
  ["production build", ["run", "build"]],
];

const results = [];
for (const [label, args] of checks) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(npm, args, {
    stdio: "inherit",
    env: process.env,
    shell: isWindows,
  });
  const code = result.error ? 1 : (result.status ?? 1);
  results.push({ label, code });
  if (code !== 0) {
    console.error(`FAILED: ${label} (exit ${code})`);
    break;
  }
  console.log(`PASSED: ${label}`);
}

console.log("\n=== Release check summary ===");
for (const item of results) {
  console.log(`${item.code === 0 ? "PASS" : "FAIL"}  ${item.label}`);
}
if (results.length !== checks.length || results.some(item => item.code !== 0)) {
  console.error("Release checks did not all pass. Do not treat this run as release approval.");
  process.exitCode = 1;
} else {
  console.log("All configured static and build checks passed. Browser walkthrough and live deployment verification are separate required checks.");
}
