/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is intentional for the release-check runner. */
const { spawn, spawnSync } = require("node:child_process");

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

const host = "127.0.0.1";
const port = Number(process.env.RELEASE_PORT || 3200);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error(`Invalid RELEASE_PORT: ${process.env.RELEASE_PORT}. Choose an integer from 1024 to 65535.`);
  process.exit(1);
}
const baseUrl = `http://${host}:${port}`;
const results = [];
async function main() {\nfor (const [label, args] of checks) {
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


if (results.length === checks.length && results.every(item => item.code === 0)) {
  console.log("\\n=== Production server route smoke test ===");
  const nextCli = require.resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [nextCli, "start", "--hostname", host, "--port", String(port)], {
    stdio: "inherit", env: process.env, shell: false,
  });
  let smokePassed = false;
  try {
    const started = Date.now();
    let ready = false;
    while (Date.now() - started < 45000) {
      if (server.exitCode !== null || server.signalCode !== null) throw new Error(`Next.js server exited${server.exitCode !== null ? ` with code ${server.exitCode}` : ` after signal ${server.signalCode}`}`);
      try {
        const response = await fetch(baseUrl, { signal: AbortSignal.timeout(1500) });
        if (response.ok) { ready = true; break; }
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error(`Next.js server did not become ready at ${baseUrl} within 45000ms`);
    console.log(`\\n=== Route smoke test (${baseUrl}) ===`);
    const smoke = spawnSync(npm, ["run", "smoke-test"], { stdio: "inherit", env: { ...process.env, SMOKE_BASE_URL: baseUrl }, shell: isWindows });
    const code = smoke.error ? 1 : (smoke.status ?? 1);
    results.push({ label: "production route smoke test", code });
    smokePassed = code === 0;
    if (!smokePassed) console.error(`FAILED: production route smoke test (exit ${code})`);
    else console.log("PASSED: production route smoke test");
  } catch (error) {
    results.push({ label: "production route smoke test", code: 1 });
    console.error(`FAILED: production server / smoke-test setup: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      server.kill("SIGTERM");
      await new Promise(resolve => { const timer = setTimeout(resolve, 3000); server.once("exit", () => { clearTimeout(timer); resolve(); }); });
      if (server.exitCode === null && server.signalCode === null) {
        server.kill("SIGKILL");
        await new Promise(resolve => { if (server.exitCode !== null || server.signalCode !== null) return resolve(); server.once("exit", resolve); });
      }
    }
  }
}

console.log("\\n=== Release check summary ===");
for (const item of results) console.log(`${item.code === 0 ? "PASS" : "FAIL"}  ${item.label}`);
if (results.length !== checks.length + (results.some(item => item.label === "production route smoke test") ? 1 : 0) || results.some(item => item.code !== 0)) {
  console.error("Release checks did not all pass. Do not treat this run as release approval.");
  process.exitCode = 1;
} else {
  console.log("All configured static, build and route smoke checks passed. Browser visual walkthrough and live deployment verification remain separate required checks.");
}
