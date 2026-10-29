# BOB-NEW — APK screen, route, and asset migration inventory

Status: **inventory baseline / implementation in progress**  
Target repository: `tkishanmkm/BOB-NEW`, branch `main`  
Source: local static APK resource audit at `C:\Users\theki\Downloads\bob-world-ui-audit`  
Isolation rule: **do not modify BOB-WORLD**.

## Evidence and limits

This inventory combines the 52 source-app route paths recorded in the migration audit with APK resource groups found in static inspection. It is not a claim that all routes were runtime-observed in the APK. The APK contains Flutter AOT UI and native/embedded SDK resources; static resource names cannot prove a route, exact runtime appearance, or whether a third-party SDK screen is reachable. Unknown runtime paths must be verified from authorized screenshots or a runtime walkthrough rather than invented.

## Complete known source-app route list

The paths below are the known source application's page routes to map into BOB-NEW. The root route is the app entry point; the splash should be an explicit predictable startup state, not an extra duplicate redirect. Route coverage in BOB-NEW must be checked individually before marking any path implemented.

| Route | Page / flow | Expected demo implementation |
|---|---|---|
| `/` | App entry / splash / sign-in | One controlled splash state, then demo sign-in; never imply official bank access |
| `/dashboard` | Dashboard | Summary cards and navigation backed by shared demo data |
| `/about` | About | Demo product identity and disclosures |
| `/account-actions` | Account actions | Local account action menu |
| `/account-statement` | Account statement | Date-filtered demo transactions; print/export watermarked demo statement |
| `/agent-live-chat` | Agent chat | Clearly labelled simulated support chat |
| `/ai-assistant-chat` | Assistant chat | Local informational demo assistant; no sensitive data upload |
| `/alerts` | Alerts | Locally stored demo notifications |
| `/all-accounts` | All accounts | Accounts from shared profile model |
| `/app-settings` | App settings | Preferences backed by validated local storage |
| `/bill-pay` | Bill payment | Simulated form and confirmation only |
| `/borrow` | Borrow | Informational demo page |
| `/bus-tickets` | Bus tickets | Demo-only booking interface |
| `/cards` | Cards | Demo card overview; do not collect live card credentials |
| `/change-login-pin` | Change login PIN | Demo security flow; never log PIN values or store as ordinary plaintext settings |
| `/change-transaction-pin` | Change transaction PIN | Demo-only security flow; no real banking authentication |
| `/cheque-book-request` | Cheque book request | Simulated request form |
| `/complaints` | Complaints | Local demo complaint form and history |
| `/contact-details` | Contact details | Shared profile data |
| `/contact-us-help` | Contact/help | Demo support contact information |
| `/credit-card-apply` | Credit card application | Educational/demo form; no real submission |
| `/current-account-details` | Current account details | Shared account model |
| `/digital-loan` | Digital loan | Informational demo flow |
| `/digital-planner` | Digital planner | Local planning tools |
| `/faqs` | FAQs | Local FAQ content |
| `/fixed-deposit` | Fixed deposit | Calculator/informational demo |
| `/fund-transfer` | Fund transfer | Beneficiary validation and clearly labelled local simulation; never move real funds |
| `/help` | Help | Local help index |
| `/invest` | Investments | Informational demo page |
| `/kyc-details` | KYC details | Demo placeholders only; do not collect actual identity documents |
| `/link-bank` | Link bank | Non-functional illustrative demo; never request credentials for another bank |
| `/more` | More services | Service directory |
| `/need-help` | Need help | Local help entry point |
| `/nominee-registration` | Nominee registration | Demo form; no real submission |
| `/offers` | Offers | Local sample offers |
| `/passbook` | Passbook / transactions | Shared transaction history |
| `/personal-details` | Personal details | Shared profile model |
| `/personal-loan-info` | Personal loan information | Informational demo page |
| `/positive-pay` | Positive pay | Simulated form only |
| `/profile` | Profile | Shared profile model |
| `/recharge` | Recharge | Simulated recharge only |
| `/save` | Savings | Demo savings overview |
| `/scan` | Scan / QR | Camera/QR UI must be explicitly demo-only; no payment initiation |
| `/security` | Security settings | Safe demo preferences and explanations |
| `/settings` | Settings | Single source of truth for demo profile, account, balance and preferences |
| `/shop-and-pay` | Shop and pay | Demo catalogue/flow; no real checkout |
| `/shop` | Shop | Demo catalogue |
| `/statement-analysis` | Statement analysis | Analysis of local demo transactions only |
| `/switch-to-classic` | Classic layout | Local layout toggle if implemented |
| `/upi` | UPI | Non-payment demo UI; no real UPI collect/pay intent |
| `/video-call` | Video call | Explain unavailable/demo-only functionality; do not imply a live bank agent |
| `/watch-demo` | Watch demo | Local product walkthrough |

**Known source route count: 52**, including `/`. This is a source-app route list, not proof that the original APK exposes 52 independent Flutter routes. Any additional native activity or embedded SDK screen must be inventoried separately with its evidence and confidence.

## Splash and startup inventory

Static audit evidence includes:
- `base_res__drawable-mdpi__src_assets_newui_splashscreen.png`
- `base_res__drawable-mdpi__src_assets_newui_splashscreenend.png`
- `base_assets__splash_screen.mp4`
- launcher icon resources in multiple densities and variants.

Migration requirements:
1. Map the source splash resources in the asset gallery; don't infer exact timing/placement from filenames alone.
2. Implement one startup state machine (loading → demo sign-in or dashboard according to explicit demo session state).
3. Avoid duplicated splash logic in both root layout and page components.
4. Do not bypass sign-in based on arbitrary PIN input. Never log PINs.
5. Use an original demo identity and a visible notice that this is not the official bank application.

## Asset types and current inventory

The audit identifies the following categories. The current BOB-NEW asset import is reported as 4,886 tracked files under `public/assets/reference/`; category counts below come from the earlier audit and may overlap, so they must not be summed as unique files.

| Asset type | Audit count / evidence | Mapping rule |
|---|---:|---|
| Logos | 121 identified in category audit | Reference-only unless approved for a clearly distinct demo identity; do not impersonate the bank |
| Backgrounds | 236 | Match using gallery or verified screenshots |
| Banners | 9 | Match using gallery or verified screenshots |
| Fonts | 21 identified in category audit; Flutter manifest lists 4 | Record family, file and licensing; use only when appropriate |
| Illustrations | 2 | Map to screen only with evidence |
| Launcher icons | 26 | Reference only; create an original app icon for the demo |
| Flutter UI assets | 612 in category audit; expanded report lists 611 manifest image assets | Preserve original paths and note count differences pending reconciliation |
| Native visual resources | 1,415 | Includes XML/vector/drawable resources; some may be third-party SDK UI |
| Native XML layouts | 1,022 catalogued | Inspect as structural evidence; do not assume first-party page |
| Total original resource inventory | 3,746 records | Inventory records can overlap categories and include non-visual resources |

Asset audit artifacts:
- `docs/asset-usage-audit.md` - complete public-file inventory, manifest reconciliation, hash duplicate analysis, static usage scan and inferred route placement.
- `docs/asset-usage-audit.csv` - one row per public file with URL, category, source path, size, hash, static usage and inferred route placement.
- `scripts/asset-usage-audit.cjs` - reproducible asset audit (`npm run audit:assets`).
- `docs/bob-world-asset-manifest.json` — asset manifest already added to BOB-NEW.
- Source audit gallery: `gallery/flutter-assets.html` and `gallery/native-layouts.html` under the local audit folder.
- Path lists: `inventory/flutter-asset-paths.txt`, `inventory/flutter-image-paths.txt`, `inventory/flutter-font-paths.txt`.
- Detailed reports: `reports/expanded-page-inventory.md`, `reports/page-inventory.md`, `reports/visual-design-system.md`, `reports/statement-visual-specification.md`, `reports/statement-generation-findings.md`.

## Shared demo data model required for all relevant routes

Use one validated persisted model for:
- profile/contact details;
- one or more demo accounts and account display settings;
- demo balance and transaction history;
- beneficiaries;
- simulated transfer records;
- preferences and notification state.

Settings is the editable source of truth. Dashboard, account details, passbook, statements, analysis, transfer previews and receipts must read from that same store. Validate imported JSON before replacing data; provide export/restore and storage-error handling. Do not put uploaded PDFs as large Base64 strings in localStorage.

## Transfer, statement, and receipt safeguards

- Transfer submission creates only a **local simulated transaction** and must display that no money moved.
- Statement and receipt exports must display **DEMO — NOT A BANK-ISSUED DOCUMENT** on every page/output.
- A receipt must only be generated from a saved demo transaction and must not look like bank-issued proof.
- Use transaction dates and account/profile fields from the shared store; validate date filters and page breaks.
- No live bank/payment rails, real credentials, real UPI intents, or external AI document upload.

## Status checklist

- [x] Known source route list captured from audit notes (52 paths).
- [x] Splash/static resource evidence documented.
- [x] Asset types, counts and source inventory artifacts documented.
- [x] Reconcile all imported target assets against source manifest and SHA-256/file counts (`docs/asset-usage-audit.md` and `docs/asset-usage-audit.csv`).
- [ ] Map each asset to a page with confidence (confirmed / likely / unknown).
- [ ] Inspect every BOB-NEW route and record implemented / partial / placeholder / missing.
- [ ] Implement one shared validated local demo store.
- [ ] Implement and test local transfer simulation.
- [ ] Implement and test watermarked statement and receipt exports.
- [ ] Test every route, mobile layout, navigation and empty/error states.
- [ ] Run lint, typecheck and complete production build; record exact results.
- [ ] Runtime screenshot walkthrough to identify APK-only native/SDK screens that static inspection cannot recover.

## Confidence labels

- **Confirmed** — seen in an authorized runtime screenshot or verified screen capture.
- **Likely** — resource name/path strongly suggests purpose, but no runtime confirmation.
- **Unknown** — static evidence cannot establish purpose or use.

Never mark the migration 100% complete solely because assets are present or a route file exists.


## Direct APK Flutter asset import — 2026-10-29

- Parsed base/assets/flutter_assets/AssetManifest.json: **622 manifest keys**.
- Copied **617 available manifest-backed files (24.01 MiB)** into public/assets/bob-world/original-assets/, retaining the Flutter asset-relative path under assets/. The two SSL certificate manifest entries are intentionally not published as web assets; missing/non-file manifest entries are not silently represented as copied.
- Wrote a per-file SHA-256-prefix inventory to docs/bob-apk-resource-map.json.
- Dashboard service icons in components/apk-asset-map.tsx now reference the direct imported Flutter asset tree. The dashboard also uses dashBoard/bobWorldNTitle.svg as an APK-derived brand reference, with the demo label retained.
- Static folder grouping highlights: bank_logo_with_bank_code (214), bankLogo (77), dashBoard (50), mySpace (38), activateUpi (33), sendMoney (22), vpaExist (21), pay (19), upi_circle (18), and accountManagement (17).
- These groupings are purpose hints, not a verified screen map. Exact placement/use still needs runtime screenshot evidence. Assets are kept under their original manifest-relative paths so later page mapping can reuse them without flattening or renaming.


## Visual review — dashboard asset correction (2026-10-29)

- Visually inspected `assets/images/dashBoard/bob_bg.png`: it depicts a successful-transfer confirmation on a phone with two people, so it is **not a general dashboard hero/banner**. It should not be presented as dashboard artwork without route evidence. The dashboard now uses its local demo banner copy without this mismatched illustration.
- `assets/images/dashBoard/bobWorld.svg` is a compact orange BOB World wordmark; `bobWorldNTitle.svg` is the larger branded variant. These are **likely branding assets** based on their visible contents, but their exact on-screen placements remain unconfirmed without an original-app runtime capture.
- Visually inspected `res/drawable-mdpi-v4/src_assets_newui_splashscreen.png` and `res/drawable/launch_screen.png`; both render as plain white images in the extracted resources. Do not use them as a branded splash artwork.
- Confidence: `bob_bg.png` meaning = **confirmed by visual contents**; dashboard/splash exact placement = **unknown** until runtime screenshot evidence is available.

## First-launch journey audit — splash, language, login, dashboard

This is the required first implementation batch because the app must match the APK's actual startup journey, not merely contain separately reachable pages.

| Journey stage | Evidence currently in repository | Confidence / current gap | Next implementation rule |
|---|---|---|---|
| Android launch / splash | Resource inventory lists `base_res__drawable-mdpi__src_assets_newui_splashscreen.png`, `base_res__drawable-mdpi__src_assets_newui_splashscreenend.png`, and `base_assets__splash_screen.mp4`. Earlier visual inspection found the two named PNGs appear plain white. | Resource existence is confirmed; exact runtime splash, duration, animation, and transition are **unknown**. | Inspect the video and all density variants visually, then compare with an APK runtime capture. Do not infer splash artwork from filenames. |
| Language selection | Asset manifest includes `assets/images/mySpace/change_app_language_icon.svg`. | This proves a language-change icon exists, **not** that there is a language-selection screen during first launch, what languages are offered, or how selection works. | Find the relevant APK screen/runtime evidence before adding or changing first-launch language UI. Do not invent a list of languages or layout. |
| Login / PIN | Target currently has a local demo PIN gate in `app/page.tsx`. | The current implementation is a prototype access gate; the extracted static asset inventory does not prove it matches the APK login screen, login steps, PIN pad, fields, or authentication transitions. | Capture/inspect the APK login journey and map each visible component/state before changing the Next.js login UI. Keep prototype/demo disclosure and never represent the local gate as real authentication. |
| Dashboard | Direct APK asset groups include `assets/images/dashBoard/`, including `bobWorld.svg`, `bobWorldNTitle.svg`, and dashboard feature icons. | Asset purpose can often be inferred, but exact placement, header structure, footer/navigation, tile order, banners, dimensions, and interactions are **not confirmed** by asset names alone. | Compare an APK dashboard screenshot/runtime capture; map each used asset and component to visible evidence before adjusting the Next.js dashboard. |
| Shared header / bottom navigation | Static resource groupings and current Next.js shell exist. | Exact labels, icon order, visibility by route, dimensions, selected state, and navigation behavior are **unknown** without screenshots or runtime walkthrough. | Build a route-by-route component matrix from the APK evidence. Do not assume the current generic bottom navigation is the APK's design. |

### First-launch acceptance criteria

- [ ] Obtain or inspect authorized APK runtime captures for launch/splash, any language-selection step, login, and dashboard.
- [ ] Record each screen's visible text, exact asset path where identifiable, component bounds/order, actions, and transition destination.
- [ ] Label each observation **confirmed**, **likely**, or **unknown**.
- [ ] Implement only confirmed details first; preserve unresolved gaps in this table.
- [ ] Verify the Next.js phone-width rendering against the corresponding APK captures at matching viewport dimensions.
- [ ] Do not claim exact APK parity until the first-launch screens and shared navigation have been visually compared.

**Current status:** this repository contains a static resource inventory and imported assets, but no cited APK runtime screenshot evidence for the complete splash → language → login → dashboard sequence. Therefore the current Next.js splash and login are not yet certified as APK-matched. This is an evidence gap, not permission to fill in missing behavior by convention.

## Step 25 — startup asset availability check (static repository check)

Checked the current `main` branch for the expected imported native splash resources at:
- `public/assets/bob-world/original-assets/base_res__drawable-mdpi__src_assets_newui_splashscreen.png`
- `public/assets/bob-world/original-assets/base_res__drawable-mdpi__src_assets_newui_splashscreenend.png`

Both exact paths return **not found** from the repository contents API. A search for `splash_screen.mp4` also did not return a repository file. This means their presence in an earlier source inventory must not be treated as proof that the binary resources are currently available to the Next.js app at those paths.

Confirmed available Flutter asset paths include:
- `public/assets/bob-world/original-assets/assets/images/activateUpi/bob_world_logo.svg`
- `public/assets/bob-world/original-assets/assets/images/dashBoard/bobWorldNTitle.svg`
- `public/assets/bob-world/original-assets/assets/images/dashBoard/bob_bg.png`

These are source assets, but their names alone do not establish which startup screen uses them or their exact placement. The current splash page uses the `activateUpi/bob_world_logo.svg` asset; that is confirmed as an existing Flutter asset, but **not confirmed as the original splash-screen artwork**.

### Required next action
Recover/copy the missing native splash binaries from the original APK extraction into the repository and verify their visual contents and dimensions before wiring them into the startup UI. The Desktop Commander machine was offline during this check, so the original local extraction could not be accessed. Do not substitute a dashboard or UPI logo for the missing splash artwork.

**Scope of this check:** repository-path availability only. No image-rendering or runtime screenshot comparison was completed.

## Step 26 — whole-app UI/layout/color parity audit (static source review)

Audit date: 2026-10-29. Target: `tkishanmkm/BOB-NEW`, branch `main`. No other project is in scope.

### A. Coverage baseline

The current static migration report lists 52 source routes and 62 Next.js page files (including a dynamic route file): 16 dedicated route files, 23 routes delegated to a generic feature page, and 13 aliases. All 52 known routes have a direct or dynamic route configuration, but this is **route coverage only**, not screen parity.

The asset report lists 6,913 manifest records, 4,886 unique manifest paths, and zero missing manifest paths in the audited public directory. It also reports only 27 distinct literal asset URLs in app/components/lib source scans. The scan reports 18 route files with an explicit APK asset component import. This is a warning that most imported assets are not yet explicitly mapped to a screen; the large asset archive alone does not make a screen identical.

### B. Shared layout / header / footer findings

| Area | Current implementation evidence | Audit status / required work |
|---|---|---|
| Global page shell | `app/layout.tsx` imports one large global stylesheet and sets metadata/icon to Daybook branding | **Mismatch risk:** metadata still says `Daybook | BOB-NEW` and uses `/assets/daybook-mark.svg`; verify against the intended app identity and APK. |
| Desktop/header navigation | `components/app-shell.tsx` renders a BOB World logo, “BOB World 2.0 · DEMO”, local-workspace pill, Exit button, and a local-prototype notice | **Static-only, not APK-identical:** no runtime capture has established this header, wording, sizing, colors, or button placement against the APK. |
| Main navigation | Shell contains a long vertical route list for many pages | **Likely structural mismatch for a mobile-only APK recreation:** the menu is a web-oriented navigation system unless the APK evidence confirms it. |
| Mobile bottom navigation | Five tabs use text glyphs (`⌂`, `⇄`, `▤`, `♙`, `⋯`) for Home, Transfer, Passbook, Payees, More | **Unverified and likely mismatch risk:** glyphs are not mapped to the actual APK icons; labels, order, active state, dimensions, and visibility need screenshot evidence. |
| Footer | No separate APK-matched persistent footer is established by the reviewed shell; the mobile tab bar acts as primary mobile navigation | **Unknown:** confirm from runtime evidence whether the APK has a bottom navigation bar, footer, or both, and which pages show them. |
| Authentication gate | Local sessionStorage PIN gate and local browser store guard protected pages | Functional prototype guard, not real bank authentication; exact APK onboarding/login flow remains unverified. |
| Responsive shell | Global CSS includes desktop two-column layout plus narrow-screen media queries and phone-specific rules | **Not pixel-verified:** the CSS breakpoint alone does not establish original APK screen dimensions or behavior. |

### C. Global color / typography / component findings

The opening global CSS currently defines `body` background `#f3f6fb`, text `#202b3d`, link/button blue `#315da8`, borders `#e0e6ef`, muted text `#6b7789`, and a yellow/amber notice style. The stylesheet uses Inter/system fonts as the global stack. The imported APK inventory includes Acumin and Gabarito fonts, but the reviewed global declaration does not establish those as the actual application font stack.

**Conclusion:** these are confirmed BOB-NEW CSS values, not confirmed APK design tokens. Do not call the colors, font, border radii, shadows, card spacing, header height, icon sizes, or touch targets identical until they have been sampled from APK screenshots/runtime and compared at the same viewport size.

Shared component audit must explicitly record:
- screen background and surface colors (including gradients);
- font family, weight, size, line height, letter spacing;
- top safe area/status bar and app-bar height;
- logo/icon source, rendered size, stroke/fill, and alignment;
- page horizontal gutters, section spacing, card radius, border/shadow;
- primary/secondary/disabled/error/success states;
- keyboard, focus, pressed, loading, empty, error, and confirmation states;
- fixed bottom navigation visibility, active state, and device safe-area inset;
- scrolling, overflow, and keyboard-resize behavior.

### D. Route-by-route audit decision

All 52 routes from the static migration inventory remain **not visually verified** until each has an APK reference screen or recorded walkthrough. Route types from the current report:

1. **Dedicated pages (16):** source code exists, but layout and behavior still require APK comparison.
2. **Generic feature routes (23):** must not be treated as identical independent pages. Each needs evidence-led page structure, text, controls, assets, and interactions rather than a shared placeholder.
3. **Aliases (13):** must be checked against source-app navigation. An alias is acceptable only if the original APK truly uses the same screen/flow; otherwise it needs its own route-specific screen.

For every route, record: APK screen ID, how it is reached, screenshot/device viewport, header/footer presence, color/font measurements, asset paths, Next.js component, interaction outcomes, differences, and evidence status. Unknown items remain explicitly marked unknown.

### E. Highest-priority remediation order

1. **Entry and session flow:** splash, any evidenced language/onboarding steps, login/PIN, error/loading states, dashboard entry.
2. **Shared chrome:** status-bar/safe-area treatment, header/app bar, logo, navigation, footer/bottom bar, typography and color tokens.
3. **Dashboard:** source banner/background, account summary, service tiles, carousel/banner behavior, icons and click destinations.
4. **Primary user journeys:** account details, transfer/beneficiary/review/result, passbook, statement, receipt.
5. **Remaining route families:** settings/profile/security, support/chat, bill pay/recharge, cards/loans/deposits, UPI, scan, and all remaining source routes.
6. **Regression pass:** every route on phone viewport, scroll/keyboard states, links, local-data safety, print/PDF, accessibility, and production build.

### F. Evidence and environment limitation

This pass inspected repository text and existing static audit reports. The Desktop Commander device was reported offline, and no authorized runtime screenshot set or recording was available in the current task. Therefore, this pass did not run the APK, render a Next.js browser session, or perform pixel-difference testing. No screen is certified as identical.

### G. Acceptance criteria for final parity

- Every source route has an explicit route-to-screen mapping and route-specific verdict.
- Every shared component has a reference screenshot and a measured comparison at a matching viewport.
- No placeholder/generic route is marked identical without screen-specific evidence.
- Every used APK asset is mapped to the correct screen and its source/hash is recorded.
- Header, bottom navigation/footer, typography, color palette, spacing, icons, and interactive states are visually compared.
- Navigation and forms are walked through on mobile; regressions and browser console/build errors are recorded.
- Final report separates verified parity from remaining gaps. A successful build or existing asset inventory alone does not satisfy visual parity.
