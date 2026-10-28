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
  "/watch-demo", "/payees", "/help-support", "/receipt", "/transfers",
  "/account-details", "/demo-documents", "/payment-successful",
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
