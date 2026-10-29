/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is intentional for the local verification runner. */
const { spawn, spawnSync } = require("node:child_process");

const isWindows = process.platform === "win32";
const npm = isWindows ? "npm.cmd" : "npm";
const host = "127.0.0.1";
const port = Number(process.env.VERIFY_PORT || 3100);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error(`Invalid VERIFY_PORT: ${process.env.VERIFY_PORT}. Choose an integer from 1024 to 65535.`);
  process.exit(1);
}
const baseUrl = `http://${host}:${port}`;
const checks = [
  ["data validation", ["run", "test:data"]],
  ["transfer safety", ["run", "test:transfer-safety"]],
  ["feature route audit", ["run", "audit:routes"]],
  ["migration completeness audit", ["run", "audit:migration"]],
  ["asset usage audit", ["run", "audit:assets"]],
  ["TypeScript type checking", ["run", "typecheck"]],
  ["ESLint", ["run", "lint"]],
  ["production build", ["run", "build"]],
];
const results = [];

function runSync(label, args, env = process.env) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(npm, args, { stdio: "inherit", env, shell: isWindows });
  const code = result.error ? 1 : (result.status ?? 1);
  results.push({ label, code });
  if (code !== 0) console.error(`FAILED: ${label} (exit ${code})`);
  else console.log(`PASSED: ${label}`);
  return code === 0;
}

async function waitForServer(child, timeoutMs = 45000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (child.exitCode !== null || child.signalCode !== null) throw new Error(`Next.js server exited${child.exitCode !== null ? ` with code ${child.exitCode}` : ` after signal ${child.signalCode}`}`);
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`Next.js server did not become ready at ${baseUrl} within ${timeoutMs}ms`);
}

async function main() {
  for (const [label, args] of checks) {
    if (!runSync(label, args)) {
      console.error("Verification stopped at the first failure.");
      process.exitCode = 1;
      return;
    }
  }

  console.log("\n=== Start production server for route smoke test ===");
  // Launch Next.js directly rather than through npm so shutdown targets the
  // actual server process and does not leave an npm child running on Windows.
  const nextCli = require.resolve("next/dist/bin/next");
  const server = spawn(process.execPath, [nextCli, "start", "--hostname", host, "--port", String(port)], {
    stdio: "inherit",
    env: process.env,
    shell: false,
  });
  try {
    await waitForServer(server);
    if (!runSync("route smoke test", ["run", "smoke-test"], { ...process.env, SMOKE_BASE_URL: baseUrl })) {
      throw new Error("Route smoke test failed.");
    }
  } catch (error) {
    console.error(`FAILED: production server / smoke-test setup: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      await new Promise(resolve => {
        const timer = setTimeout(resolve, 3000);
        server.once("exit", () => { clearTimeout(timer); resolve(); });
      });
      if (server.exitCode === null && server.signalCode === null) {
        server.kill("SIGKILL");
        await new Promise(resolve => {
          if (server.exitCode !== null || server.signalCode !== null) return resolve();
          server.once("exit", resolve);
        });
      }
    }
  }

  console.log("\n=== Local verification summary ===");
  for (const item of results) console.log(`${item.code === 0 ? "PASS" : "FAIL"}  ${item.label}`);
  if (process.exitCode) console.error("Verification failed. Do not treat this run as release approval.");
  else console.log("Configured local checks passed. Browser walkthrough and live deployment verification are still separate.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
