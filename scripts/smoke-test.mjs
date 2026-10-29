const base = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const routes = [
  "/", "/splash", "/dashboard", "/more", "/about", "/account-actions",
  "/account-statement", "/agent-live-chat", "/ai-assistant-chat", "/alerts",
  "/all-accounts", "/app-settings", "/bill-pay", "/borrow", "/bus-tickets",
  "/cards", "/change-login-pin", "/change-transaction-pin", "/cheque-book-request",
  "/complaints", "/contact-details", "/contact-us-help", "/credit-card-apply",
  "/current-account-details", "/digital-loan", "/digital-planner", "/faqs",
  "/fixed-deposit", "/fund-transfer", "/help", "/invest", "/kyc-details",
  "/link-bank", "/need-help", "/nominee-registration", "/offers", "/passbook",
  "/personal-details", "/personal-loan-info", "/positive-pay", "/profile",
  "/recharge", "/save", "/scan", "/security", "/settings", "/shop-and-pay",
  "/shop", "/statement-analysis", "/switch-to-classic", "/upi", "/video-call",
  "/watch-demo", "/payees", "/help-support", "/receipt", "/statement", "/transfers",
  "/account-details", "/demo-documents", "/payment-successful",
];
const requiredContent = new Map([
  ["/", ["BOB-NEW"]],
  ["/dashboard", ["Dashboard"]],
  ["/settings", ["Settings"]],
  ["/statement", ["Statement"]],
  ["/receipt", ["Receipt"]],
  ["/transfers", ["Transfer"]],
  ["/passbook", ["Passbook"]],
  ["/account-details", ["Account"]],
  ["/payees", ["Beneficiar"]],
  ["/help-support", ["Support"]],
]);
let failures = 0;
for (const route of routes) {
  try {
    const response = await fetch(new URL(route, base), { redirect: "manual" });
    const type = response.headers.get("content-type") || "";
    const html = await response.text();
    const normalizedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
    const routeFailures = [];
    if (response.status !== 200) routeFailures.push(`status=${response.status}`);
    if (!type.includes("text/html")) routeFailures.push(`content-type=${type || "missing"}`);
    if (html.length < 500 || !/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) routeFailures.push("response is not a substantial HTML document");
    if (/This page could not be found|404: NOT_FOUND|Application error: a client-side exception has occurred/i.test(normalizedHtml)) routeFailures.push("response contains a not-found or application-error marker");
    const expected = requiredContent.get(route) || [];
    for (const marker of expected) if (!normalizedHtml.toLowerCase().includes(marker.toLowerCase())) routeFailures.push(`missing expected page marker: ${marker}`);
    if (routeFailures.length) {
      failures++;
      console.error(`FAIL ${route}: ${routeFailures.join("; ")}`);
    } else {
      console.log(`PASS ${route}: HTTP ${response.status}, ${html.length} HTML characters${expected.length ? `, identity markers: ${expected.join(", ")}` : ""}`);
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
  console.log(`Smoke test passed: all ${routes.length} routes returned substantial HTML without obvious error markers; ${requiredContent.size} routes also passed identity-marker checks.`);
}
