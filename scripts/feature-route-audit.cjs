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

// Derive dedicated routes from app/**/page.* instead of maintaining a stale hard-coded list.
const appRoot = path.join(root, "app");
const appRoutes = new Set();
function collectPageRoutes(directory, segments = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectPageRoutes(absolute, [...segments, entry.name]);
    } else if (/^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      const routeSegments = segments.filter((segment) => !/^\(.*\)$/.test(segment) && !/^\[.*\]$/.test(segment));
      appRoutes.add(routeSegments.length ? "/" + routeSegments.join("/") : "/");
    }
  }
}
collectPageRoutes(appRoot);

// The smoke list is a separate source of expected routes. A catch-all page can
// return HTTP 200 even when the requested feature has no actual configuration.
const smokeFile = path.join(root, "scripts", "smoke-test.mjs");
const smokeSource = fs.existsSync(smokeFile) ? fs.readFileSync(smokeFile, "utf8") : "";
const smokeRoutesBlock = smokeSource.match(/const routes = \[([\s\S]*?)\];/);
const smokeRoutes = smokeRoutesBlock
  ? [...smokeRoutesBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  : [];
const pageKeysBlock = source.match(/const pages: Record<string, \{[\s\S]*?\}> = \{([\s\S]*?)\n\};/);
const configuredFeatures = new Set(
  pageKeysBlock
    ? [...pageKeysBlock[1].matchAll(/^\s*["']?([a-z0-9-]+)["']?\s*:\s*\{/gm)].map((m) => m[1])
    : []
);
const directRoutes = new Set([...appRoutes]);
const featureRoute = (route) => route !== "/" && configuredFeatures.has(route.replace(/^\//, ""));
let failures = 0;
let genericRoutes = 0;
for (const route of smokeRoutes) {
  if (directRoutes.has(route)) {
    console.log(`PASS smoke route has a direct page: ${route}`);
  } else if (featureRoute(route)) {
    genericRoutes++;
    console.warn(`WARN smoke route is served by generic FeaturePage, not a dedicated screen: ${route}`);
  } else {
    failures++;
    console.error(`FAIL smoke route has no direct page or configured feature: ${route}`);
  }
}
if (!smokeRoutes.length) {
  failures++;
  console.error("FAIL could not locate the route list in scripts/smoke-test.mjs.");
}

for (const action of uniqueActions) {
  const target = links.get(action);
  if (!target) {
    console.error(`FAIL action has no explicit route: "${action}"`);
    failures++;
    continue;
  }
  const routeExists = navRoutes.has(target) || appRoutes.has(target);
  const feature = target.replace(/^\//, "");
  const featureExists = source.includes(`  "${feature}":{`) || source.includes(`  ${feature}:{`);
  if (!routeExists && !featureExists) {
    console.error(`FAIL action "${action}" points to unregistered route ${target}`);
    failures++;
  } else {
    console.log(`PASS "${action}" -> ${target}`);
  }
}
console.log(`Checked ${uniqueActions.length} unique action labels and ${smokeRoutes.length} smoke-test routes; ${genericRoutes} use generic feature screens.`);
if (failures) {
  console.error(`Feature route audit failed: ${failures} issue(s).`);
  process.exit(1);
}
console.log("Feature route audit passed.");

