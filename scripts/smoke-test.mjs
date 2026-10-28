const base = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const routes = [
  "/", "/dashboard", "/settings", "/payees", "/help-support",
  "/statement", "/receipt", "/fund-transfer", "/transfers",
  "/account-details", "/account-statement", "/passbook",
];
let failures = 0;
for (const route of routes) {
  try {
    const response = await fetch(new URL(route, base), { redirect: "manual" });
    const type = response.headers.get("content-type") || "";
    if (response.status !== 200 || !type.includes("text/html")) {
      failures++;
      console.error(`FAIL ${route}: status=${response.status}, content-type=${type || "missing"}`);
    } else {
      console.log(`PASS ${route}: HTTP ${response.status}`);
    }
  } catch (error) {
    failures++;
    console.error(`FAIL ${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failures) {
  console.error(`Smoke test failed: ${failures} of ${routes.length} routes.`);
  process.exitCode = 1;
} else {
  console.log(`Smoke test passed: all ${routes.length} routes returned HTML successfully.`);
}
