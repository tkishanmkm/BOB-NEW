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
- [ ] Reconcile all imported target assets against source manifest and hash/file counts.
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
