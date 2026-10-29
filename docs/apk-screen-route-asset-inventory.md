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

### H. Explicit route-by-route visual audit register

The following register carries forward the current static route classification and adds the visual-evidence verdict. It is deliberately conservative: **every route remains “not visually verified”** until a matching APK screen or recorded walkthrough is reviewed. This avoids incorrectly certifying aliases or generic pages as identical.

| Route | Current page/flow classification | Static migration status | APK visual verdict |
|---|---|---|---|
| `/` | App entry / splash / sign-in | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/dashboard` | Dashboard | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/about` | About | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/account-actions` | Account actions | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/account-statement` | Account statement | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/agent-live-chat` | Agent chat | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/ai-assistant-chat` | Assistant chat | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/alerts` | Alerts | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/all-accounts` | All accounts | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/app-settings` | App settings | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/bill-pay` | Bill payment | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/borrow` | Borrow | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/bus-tickets` | Bus tickets | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/cards` | Cards | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/change-login-pin` | Change login PIN | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/change-transaction-pin` | Change transaction PIN | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/cheque-book-request` | Cheque book request | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/complaints` | Complaints | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/contact-details` | Contact details | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/contact-us-help` | Contact/help | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/credit-card-apply` | Credit card application | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/current-account-details` | Current account details | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/digital-loan` | Digital loan | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/digital-planner` | Digital planner | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/faqs` | FAQs | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/fixed-deposit` | Fixed deposit | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/fund-transfer` | Fund transfer | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/help` | Help | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/invest` | Investments | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/kyc-details` | KYC details | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/link-bank` | Link bank | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/more` | More services | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/need-help` | Need help | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/nominee-registration` | Nominee registration | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/offers` | Offers | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/passbook` | Passbook / transactions | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/personal-details` | Personal details | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/personal-loan-info` | Personal loan information | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/positive-pay` | Positive pay | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/profile` | Profile | Shared page alias | Not visually verified; needs original APK screenshot/runtime comparison |
| `/recharge` | Recharge | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/save` | Savings | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/scan` | Scan / QR | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/security` | Security settings | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/settings` | Settings | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/shop-and-pay` | Shop and pay | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/shop` | Shop | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/statement-analysis` | Statement analysis | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/switch-to-classic` | Classic layout | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/upi` | UPI | Dedicated page file | Not visually verified; needs original APK screenshot/runtime comparison |
| `/video-call` | Video call | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |
| `/watch-demo` | Watch demo | Generic feature page | Not visually verified; needs original APK screenshot/runtime comparison |

Route rows in this register: **52**. Reconcile any count difference with the migration script before release; route aliases and dynamic routes must be included in regression navigation checks.


## Step 27 — generic-route and alias remediation plan (2026-10-29)

Scope: static route architecture review after the 52-route visual audit. This step does not claim APK visual parity and does not change any runtime page.

### Generic feature route remediation register

All routes below currently need an evidence decision before their generic page can be accepted as a screen-specific migration. “Evidence required” means an authorized APK screenshot/walkthrough or trustworthy extracted first-party layout evidence that can be mapped to the route; asset names alone are not enough.

| Route | Required next action | Priority | Acceptance evidence |
|---|---|---:|---|
| `/agent-live-chat` | Determine whether the APK has a first-party support-chat screen or opens a provider SDK. | P1 | Screenshot of entry and conversation states; identify first-party vs SDK boundary. |
| `/help` | Compare with `/need-help` and `/contact-us-help`; decide if these are distinct destinations. | P1 | Screenshots and entry actions for each help entry point. |
| `/scan` | Verify scan landing, permission prompt and camera/QR states; keep all payment actions simulated. | P1 | APK screenshots for pre-permission and camera states; no live payment behavior. |
| `/security` | Map actual security menu items and destinations; do not infer PIN flows from route names. | P1 | Security screen and each accessible child-flow screenshot. |
| `/cards` | Verify card overview and whether card controls are first-party or external. | P2 | Card screen and accessible detail/control states. |
| `/kyc-details` | Verify whether this is a view-only details screen or a provider flow. | P2 | Screen evidence plus confirmed SDK handoff, if any. |
| `/link-bank` | Determine if the APK has a first-party screen or a third-party handoff. | P2 | Entry screen and handoff boundary; no collection of real credentials. |
| `/credit-card-apply` | Identify the actual application entry and disclosure screens. | P2 | Screenshots and visible navigation destinations. |
| `/digital-loan` | Compare against `/personal-loan-info` and `/borrow` to prevent invented duplicate screens. | P2 | Separate route entry screenshots and destination behavior. |
| `/borrow` | Verify if this is an actual APK destination or a web-only extra. | P2 | APK navigation evidence or explicit “not present” decision. |
| `/personal-loan-info` | Verify actual information hierarchy and its relationship to loan application. | P2 | Screen and tap-through evidence. |
| `/bus-tickets` | Confirm availability in the APK and whether it belongs to a partner service. | P3 | APK entry point and handoff evidence, or mark extra. |
| `/invest` | Confirm whether an investment service exists in this APK version. | P3 | APK entry point and screen evidence, or mark extra. |
| `/save` | Identify the exact savings destination; compare with dashboard/account routes. | P2 | Entry point and screen evidence. |
| `/shop-and-pay` | Verify service catalogue and relationship to `/shop` and `/offers`. | P3 | Navigation and destination screenshots. |
| `/shop` | Verify whether separate from `/shop-and-pay` or an alias/extra. | P3 | Distinct route evidence or consolidation decision. |
| `/statement-analysis` | Confirm that analysis exists in the APK and identify source data and chart layout. | P2 | Screenshot plus source-data behavior evidence. |
| `/nominee-registration` | Verify form fields, validation and success state; local demo only. | P2 | Form/error/success screenshots. |
| `/ai-assistant-chat` | Determine whether present in this APK version or an added prototype feature. | P3 | APK entry evidence or mark web-only extra. |
| `/about` | Confirm actual app information page and branding content. | P3 | Screen screenshot and asset mapping. |
| `/switch-to-classic` | Determine whether the APK supports a layout switch and what changes. | P3 | Before/after evidence or mark not present. |
| `/video-call` | Verify whether a real APK route exists or is only an SDK/placeholder route. | P3 | Entry/handoff evidence or mark not present. |
| `/watch-demo` | Verify whether this route exists in the APK or is only a prototype convenience. | P3 | APK entry evidence or mark web-only extra. |

Priority means migration order, not proof of business criticality. P1 = core navigation/security/support paths; P2 = account/service paths; P3 = likely optional, partner, or prototype paths. Reprioritize only when APK evidence shows a different user journey.

### Alias remediation register

Aliases must be tested as navigation destinations, not automatically converted into separate pages:

| Alias route | Compare with | Required decision |
|---|---|---|
| `/account-actions` | Account details and dashboard actions | Same screen with different entry point, or dedicated action menu? |
| `/account-statement` | `/statement` | Same statement flow, a distinct account statement page, or legacy alias? |
| `/all-accounts` | `/account-details`, `/current-account-details` | Account list vs selected-account details. |
| `/app-settings` | `/settings` | Separate app preferences or same settings destination? |
| `/change-login-pin` | `/security` | Dedicated PIN change flow, if present in APK. |
| `/change-transaction-pin` | `/security` | Dedicated transaction-PIN flow, if present in APK. |
| `/contact-details` | `/personal-details`, `/profile` | Contact-only view or shared profile screen? |
| `/contact-us-help` | `/help`, `/need-help` | Contact directory vs help index vs support entry. |
| `/current-account-details` | `/account-details`, `/all-accounts` | Distinct current-account detail screen or unsupported route? |
| `/fund-transfer` | `/transfers` | Legacy deep-link alias or a distinct transfer entry. |
| `/need-help` | `/help`, `/help-support` | Help landing vs support hub. |
| `/personal-details` | `/profile`, `/contact-details` | Personal profile fields vs contact details. |
| `/profile` | `/personal-details`, `/account-details` | Profile landing or duplicate route? |

### Shared shell blockers

Before changing header, logo, footer/bottom tabs, color tokens, font, or icons, record the same viewport and app state from the APK. Then compare:
1. top safe-area/status-bar and app-bar height;
2. logo asset, size, baseline and horizontal padding;
3. title/subtitle and back/action affordances per route;
4. background, surfaces, borders, elevation/shadows and text hierarchy;
5. bottom navigation destinations, labels, selected state and safe-area inset;
6. scroll behavior, keyboard resize, dialogs, loading, empty and error states.

Current BOB-NEW shell includes explicit demo labels, a local-workspace badge, Exit action, a global prototype notice, desktop route list, and a five-item glyph-based mobile tab bar. These are implementation facts only. Do not remove demo disclosures or replace icons/colors with guessed APK styling. For an accurate visual match, create a separate approved demo identity and preserve a visible non-affiliation/local-simulation disclosure.

### Exit criteria for this audit phase

- [x] Generic routes grouped into explicit evidence-based decisions.
- [x] Alias routes mapped to their competing destinations.
- [x] Shared shell comparison checklist documented.
- [ ] APK screen evidence attached/mapped for each route.
- [ ] Screen-specific UI changes implemented only after evidence is available.
- [ ] Browser screenshots compared at matching viewport/state.
- [ ] Production build and route smoke tests run.

No runtime code was changed in Step 27. No build, browser screenshot, or APK runtime test was run.


## Step 28 — startup and document metadata audit (2026-10-29)

### Static findings

- `app/page.tsx` is the actual root login gate and uses a locally stored demo PIN; it does not show the optional splash page first.
- `app/splash/page.tsx` is a separate route with a 450 ms timer and Continue link back to `/`. It is not currently a unified startup state with the root login page.
- `app/layout.tsx` previously advertised the unrelated title `Daybook | BOB-NEW`, which was inconsistent with the product label and independent-demo disclosure shown in the UI.
- The shared shell uses the BOB World name/logo in an independent demo, while the favicon remains `/assets/daybook-mark.svg`. The title inconsistency was safe to correct; the favicon and visual identity need a deliberate branding decision and must not be silently replaced with an official-looking bank icon.
- The splash/login appearance, route order, timing, and asset placement remain unverified against the original APK. This audit does not certify either page as visually identical.

### Change committed

- Updated `app/layout.tsx` metadata title to `BOB-NEW | Independent Demo`.
- Expanded the description to make local sample data, non-affiliation, and absence of banking/payment connectivity explicit.
- Preserved the existing favicon rather than making an unverified asset substitution.

### Startup parity acceptance still outstanding

- [ ] Establish the APK's actual cold-start sequence and any language-selection step.
- [ ] Record whether splash transitions automatically or waits for user input.
- [ ] Compare login fields, labels, keyboard type, button states, error state, spacing, background and logo at the same phone viewport.
- [ ] Decide whether `/splash` should become the canonical entry state or remain an explicit preview route, based on APK evidence.
- [ ] Confirm the chosen non-affiliating demo icon and consistent browser-tab metadata.
- [ ] Run production build and root/splash route smoke tests.

No browser or APK runtime test was performed in this step.


## Step 29 — shared header, route navigation and bottom-tab static audit (2026-10-29)

Scope: static inspection of `components/app-shell.tsx` and the mobile-shell rules in `app/style.css`. This step records current behavior and safe acceptance criteria; it does not infer the APK's exact chrome.

### Current implementation observed in source

- The shared header renders a logo, fixed title `BOB World 2.0 · DEMO`, a `LOCAL WORKSPACE` badge on wider screens, and an Exit action.
- A global prototype disclosure appears beneath the header on every shell page.
- Desktop navigation renders a long route index; CSS hides it at the mobile breakpoint (650px).
- The mobile tab bar has five fixed destinations: Dashboard, Transfers, Passbook, Payees and More. Its icons are text glyphs rather than verified APK-matched image/vector assets.
- The header has no route-aware title or in-shell Back control. Whether the APK uses a back arrow, route-specific title, action icons, or a different header on each screen is unknown.
- The bottom tab bar is fixed and safe-area-aware; page content receives bottom padding. The current source uses a 650px breakpoint, while other layout rules also use 720px, so cross-breakpoint consistency needs browser verification.
- Active state is based on exact path or a child path. The root destination is not a tab, and the active tab behavior for nested routes should be checked intentionally rather than treated as APK parity.
- These are implementation observations only. They do not prove the original app uses these destinations, labels, icons, or a shared header on every route.

### Shell parity register

| Element | Current implementation | Required evidence/check | Status |
|---|---|---|---|
| Top safe area | CSS header padding; no explicit APK status-bar model | Cold-start and in-page screenshots on same device/viewport | blocked: APK evidence |
| Header/logo | Fixed demo title and one logo asset | Confirm per-screen logo/title/back/actions, size, baseline and margins | blocked: APK evidence |
| Demo disclosure | Persistent prototype notice | Preserve honest non-affiliation disclosure; compare placement without imitating bank-issued UI | implementation requirement |
| Exit action | Clears demo session and routes to root | Verify keyboard/touch target, confirm no unsaved changes are lost | source test needed |
| Desktop route list | Long route index, hidden on mobile | Verify target is phone-only and no desktop layout is expected | user requirement; browser test needed |
| Bottom tabs | Five destinations with glyph icons | Confirm APK tab count, labels, icon assets, selected state and order | blocked: APK evidence |
| Bottom safe area | `env(safe-area-inset-bottom)` padding | Test iOS Safari/Android Chrome, browser bars and keyboard | device test needed |
| Route active state | `aria-current` based on pathname | Test direct loads, nested routes and tab-to-page transitions | browser test needed |
| Content clearance | Body bottom padding on mobile | Check long forms, focused inputs, dialogs and last item visibility above tabs | browser test needed |
| Accessibility | Skip link, nav labels, focus outlines, active-page semantics | Keyboard navigation, screen reader and visible focus check | browser test needed |

### Safe next implementation sequence

1. Do not change tab destinations, header structure, logo, colors, or icons without a reference screen.
2. Obtain a cold-start screenshot and one representative in-page screenshot from the original APK at a known viewport, plus a screenshot of the bottom-tab selected state if the APK has tabs.
3. Compare the same screens in BOB-NEW at the same viewport and state; record measured dimensions and observed assets.
4. Make one small shell change at a time, keeping the independent-demo disclosure visible and clearly separate from reference branding.
5. Run route smoke tests and narrow-screen checks after shell changes, then re-check dashboard, transfer, passbook, statement, receipt and settings.

### Exit criteria

- [x] Current header and navigation behavior described from source.
- [x] Evidence blockers and mobile test cases recorded.
- [ ] Original APK chrome/screens captured.
- [ ] Header and bottom-tab assets/metrics verified.
- [ ] Matching viewport screenshot comparison completed.
- [ ] Build and route regression tests passed.

No runtime code changed in Step 29. Desktop Commander was offline at the time of this audit; no APK or browser screenshot was captured and no build/test was run.


## Step 30 — dashboard, account details, Passbook and statement static review (2026-10-29)

This is a source-level content and structure audit of `app/dashboard/page.tsx`, `app/account-details/page.tsx`, `app/passbook/page.tsx`, and `app/statement/page.tsx`. It is not a screenshot comparison, browser test, or certification of APK parity.

### Dashboard (`/dashboard`)

Observed:
- Has a separate branding strip, greeting, call-to-action, background-art banner, sample balance card, six quick actions, six explore-service links, recent activity and an explicit local-demo disclaimer.
- Balance and transaction data come from the shared `lib/demo` state; refresh listens to the app's custom state event and browser storage event.
- The source uses a dashboard-specific background and title asset plus a reusable APK asset icon map.
- Its hierarchy and amount of content are prototype decisions until verified against the original APK. The two branding elements (shared shell and dashboard strip), banner text, balance treatment, action grid, and recent activity placement all need side-by-side visual review.
- Recent activity uses the last five array entries in reverse order; unlike Passbook's date sort, this assumes array order is the desired recency order. Confirm whether transaction insertion order is guaranteed and whether this should share one sorting helper.

### Account details (`/account-details`)

Observed:
- Displays account label, name, masked identifier, calculated sample balance, posted/pending counts, profile/account fields and links to Settings, statement and Passbook.
- It clearly marks values as fictional/local and avoids claiming account verification.
- The screen is information-dense and currently uses a multi-field detail grid. Exact field order, labels, card count, and navigation actions need APK evidence.
- Posted and pending counts are based on status; balance uses the shared helper. Verify these definitions remain consistent with dashboard, Passbook, and statement.

### Passbook (`/passbook`)

Observed:
- Supports search by description/date/reference, date range, transaction type, status, clear filters, result count, and transaction-to-receipt links.
- Results sort by transaction date descending, then by original array order descending for equal dates.
- Credit/debit summaries count posted records within the current filtered result set, not the full account history; UI labels currently indicate “in results”.
- The screen is feature-rich for a demo. The original APK must be checked to determine which filters, summary totals, icons, row layout, and receipt links belong on the actual passbook screen versus being prototype enhancements.

### Account statement (`/statement`)

Observed:
- Includes date/type/status filters, print/save-PDF, summary totals, account metadata, a transaction table and explicit demo disclaimer.
- The printed report header still uses “Daybook · Sample statement” and `/assets/daybook-mark.svg`, while application metadata now says “BOB-NEW | Independent Demo”. This is a branding inconsistency to resolve with an intentional non-affiliating demo identity; do not replace it with an official-looking bank-issued mark.
- The closing sample balance is computed from opening balance plus posted transactions through the selected end date, independent of the selected transaction type/status filters. This is reasonable for an account balance but should be labeled/verified as the account balance through the end date, not as a balance of filtered rows.
- Date validation blocks reversed ranges in the UI. Print pagination, mobile card rendering, and print table restoration still require real browser verification.
- Confirm the actual APK statement entry point, header fields, order, period label, transaction columns, quarterly/average balance sections if present, and print/export behavior before calling it matched.

### Cross-screen checks

| Check | Current source-level finding | Required validation |
|---|---|---|
| Shared data | Dashboard, account details, Passbook and statement read `lib/demo` state | Edit profile/account/transactions in Settings and verify all four pages refresh consistently |
| Balance | Uses shared balance helper on dashboard/account details; statement calculates through an end date | Deterministic test for posted credits/debits, pending items, and end-date boundaries |
| Ordering | Passbook and statement sort by date; dashboard reverses array insertion order | Add mixed-date transactions and confirm all screens present the intended order |
| Labels | Screens explicitly call values sample/demo | Check all states, empty results, and print output preserve disclosures |
| Responsive layout | CSS has mobile layouts and statement-specific print rules | Browser screenshots at 320, 360, 390 and 430 CSS px; print-to-PDF check |
| APK fidelity | No same-state reference screenshots attached | Blocked until original APK evidence is available |

### Acceptance status

- [x] Four core screens inspected statically.
- [x] Cross-screen data, ordering, labels and branding checks recorded.
- [ ] Compare all four screens with original APK at matched viewport and state.
- [ ] Test shared-data updates and date/balance edge cases.
- [ ] Verify mobile layout, keyboard behavior and print output.
- [ ] Run production build and route smoke tests.

No runtime code changed in Step 30. Desktop Commander remained offline; no original APK screenshots, browser run, build, or automated tests were available for this step.


## Step 31 — transfer, beneficiary, result and receipt static review (2026-10-29)

Reviewed `app/transfers/page.tsx`, `app/payees/page.tsx`, `app/payment-successful/page.tsx`, and `app/receipt/page.tsx`. This is a static source review; it does not establish APK visual parity or successful runtime behavior.

### Findings and action

- **Beneficiary ID browser compatibility:** `/payees` called `crypto.randomUUID()` directly, while the transfer flow already had a fallback for browsers without that API. Updated `app/payees/page.tsx` to use `createLocalId()`, which uses `crypto.randomUUID()` when available and a local fallback otherwise. This avoids a direct API dependency in the beneficiary-add action. This fallback is for local prototype record identity, not security tokens.
- **Safe saved-data handling:** beneficiary load/validation failures disable edits rather than replacing unreadable records with an empty list. Transfer workflow also validates loaded payees and guards duplicate saves with a lock.
- **Transfer simulation:** the transfer workflow checks amount format, account/code formats, sample balance and pending sample debits, then records a pending debit locally. Its result page correctly states no payment was made and will not substitute another transaction when an explicit ID is missing.
- **Receipt selection:** a supplied transaction ID is treated as authoritative; a missing ID does not silently display a different transaction. Without an ID, the receipt page can choose the latest transaction.
- **Branding consistency:** receipt preview still uses `Daybook · Sample receipt` and `/assets/daybook-mark.svg`, unlike the current BOB-NEW demo application title. Keep the demo clearly independent and non-affiliated; align this only through a deliberate demo-brand decision, not by presenting it as a bank-issued receipt.
- **Input and visual parity:** the recipient, beneficiary and receipt field order, exact APK labels, button hierarchy, validation messages, confirmation screen, and print/PDF layout remain unverified against original APK screenshots.

### Required verification

- [x] Add a fallback for beneficiary record ID creation when `crypto.randomUUID` is unavailable.
- [ ] Build and lint the branch; confirm no TypeScript or formatting regressions.
- [ ] Test adding/removing a beneficiary, reload persistence, corrupt stored data, and repeated submissions.
- [ ] Test transfer amount boundaries, insufficient sample balance, pending debit reservation, duplicate click prevention and result-ID mismatch.
- [ ] Print/save receipt on desktop and mobile; verify no shell navigation leaks into output and long values wrap.
- [ ] Compare transfer, beneficiary, result and receipt screens with authorized APK screenshots at matched mobile dimensions.

No real payment integration was added. All actions remain local demo simulations. Desktop Commander is still unavailable, and no build, browser, device or print test was run during this step.
