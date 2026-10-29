/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const pageFile = path.join(root, "components", "feature-page.tsx");
const shellFile = path.join(root, "components", "app-shell.tsx");
const source = fs.readFileSync(pageFile, "utf8");
const shell = fs.readFileSync(shellFile, "utf8");

const linksBlock = source.match(/const links: Record<string,string> = \{([\s\S]*?)\n\};/);
if (!linksBlock) {
  console.error("FAIL: could not locate the generic feature action link map.");
  process.exit(1);
}
const links = new Map([...linksBlock[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
const actions = [...source.matchAll(/actions:\s*\[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
const uniqueActions = [...new Set(actions)];
const navRoutes = new Set([...shell.matchAll(/\["(\/[^"]+)","[^"]+"\]/g)].map((m) => m[1]));
const dedicatedRoutes = new Set(["/", "/splash", "/statement", "/settings", "/transfers", "/receipt", "/account-details", "/payees", "/help-support", "/demo-documents", "/payment-successful", "/dashboard", "/passbook"]);
let failures = 0;

for (const action of uniqueActions) {
  const target = links.get(action);
  if (!target) {
    console.error(`FAIL action has no explicit route: "${action}"`);
    failures++;
    continue;
  }
  const routeExists = navRoutes.has(target) || dedicatedRoutes.has(target);
  const feature = target.replace(/^\//, "");
  const featureExists = source.includes(`  "${feature}":{`) || source.includes(`  ${feature}:{`);
  if (!routeExists && !featureExists) {
    console.error(`FAIL action "${action}" points to unregistered route ${target}`);
    failures++;
  } else {
    console.log(`PASS "${action}" -> ${target}`);
  }
}
console.log(`Checked ${uniqueActions.length} unique action labels.`);
if (failures) {
  console.error(`Feature route audit failed: ${failures} issue(s).`);
  process.exit(1);
}
console.log("Feature route audit passed.");

