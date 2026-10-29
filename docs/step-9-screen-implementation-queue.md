# BOB-NEW screen-by-screen parity implementation queue

Generated from `docs/migration-completeness-audit.md` and `docs/asset-usage-audit.md` on 2026-10-29. This is a planning artifact, not a claim that the reference APK was freshly executed or visually compared.

## Guardrails

- Change BOB-NEW only. Do not modify the BOB-WORLD reference repository, PNB, or Paxones.
- Keep the current local-demo boundary explicit. Do not imply that transfers, account data, KYC, card services, or support messages connect to bank systems.
- Do not call a route complete merely because it returns HTTP 200.
- Before matching an APK screen, obtain its source layout or authorized screenshot and record the source resource/asset evidence. Do not invent pixel-perfect details when evidence is missing.
- Preserve the shared account/transaction store and existing validated workflows unless a focused regression test proves a change is safe.

## Current static baseline

The existing migration audit reports 52 source routes: 16 dedicated page files, 23 generic feature pages, 13 aliases, and no source routes missing a direct or dynamic route configuration. The asset audit reports 7,332 public files, 6,913 manifest records, zero missing manifest asset paths, and 27 statically detected asset URLs resolving to public files.

These counts describe static source structure only. They do not prove runtime, functional, or visual parity.

## Phase 1 — highest priority user journeys

Complete one route at a time, with reference evidence, asset mapping, interaction checks, and regression tests.

1. Authentication and entry: `/`, `/splash`, then the actual sign-in and session states found in the APK.
2. Home and account: `/dashboard`, `/account-details`, `/all-accounts`, `/current-account-details`, `/personal-details`, `/profile`, `/contact-details`.
3. Transfer journey: `/transfers`, `/fund-transfer`, beneficiary management, confirmation/result and `/receipt`.
4. History and documents: `/passbook`, `/statement`, `/account-statement`, transaction details and print/PDF output.
5. Settings and data integrity: `/settings`, `/app-settings`, PIN-related routes, import/export, restore and error states.
6. Support: `/help-support`, `/agent-live-chat`, `/need-help`, `/contact-us-help`.

For each route, record the reference screen identifier, entry action, source asset paths, corresponding Next.js component, data dependencies, interaction result, and evidence of verification.

## Phase 2 — generic feature routes to convert into evidenced screen-specific pages

The static migration audit currently marks these 23 routes as generic feature pages:

- `/about`
- `/agent-live-chat`
- `/ai-assistant-chat`
- `/borrow`
- `/bus-tickets`
- `/cards`
- `/credit-card-apply`
- `/digital-loan`
- `/help`
- `/invest`
- `/kyc-details`
- `/link-bank`
- `/nominee-registration`
- `/personal-loan-info`
- `/save`
- `/scan`
- `/security`
- `/shop-and-pay`
- `/shop`
- `/statement-analysis`
- `/switch-to-classic`
- `/video-call`
- `/watch-demo`

Before replacing a generic page, verify that the route really corresponds to a screen in the reference APK and identify its original layout/assets. If the APK has no matching screen, mark the route as an extra web prototype route rather than fabricating a reference match.

## Phase 3 — aliases requiring separate parity decisions

The audit currently marks these 13 routes as shared page aliases:

- `/account-actions`
- `/account-statement`
- `/all-accounts`
- `/app-settings`
- `/change-login-pin`
- `/change-transaction-pin`
- `/contact-details`
- `/contact-us-help`
- `/current-account-details`
- `/fund-transfer`
- `/need-help`
- `/personal-details`
- `/profile`

An alias may be acceptable when the APK intentionally opens the same screen for two entry points. Otherwise, implement a dedicated route component. This decision must be evidence-based and must not break working navigation.

## Per-screen acceptance checklist

- [ ] Reference APK screen and entry point identified.
- [ ] Screenshot/layout or source implementation inspected.
- [ ] Correct logo, icon, banner, font and background mapped.
- [ ] Screen layout compared at a matching viewport.
- [ ] All visible controls have a verified destination or documented disabled state.
- [ ] Form validation, loading, empty, success and error states checked where applicable.
- [ ] Shared data reads/writes are consistent across related pages.
- [ ] Local demo disclosures remain accurate.
- [ ] Route smoke test and relevant regression tests pass.
- [ ] Result marked `verified`, `partial`, `blocked: reference evidence missing`, or `not present in APK`.

## Next implementation unit

Start with the first high-priority user journey for which reference evidence is available. Do not batch-convert all generic routes in one change: that makes visual review and regression isolation harder. If reference screenshots or APK source files are not accessible from the current workspace, collect those artifacts before claiming exact parity.

## Step 16 — transfer-flow static audit (2026-10-29)

Scope inspected: `app/transfers/page.tsx`, `app/payees/page.tsx`, `lib/demo.ts`, and the Settings transaction editor. This is a source inspection only; no build, browser run, or bank integration test was performed.

### Findings

- Transfer amounts are parsed as positive decimal values with at most two fractional digits; malformed values are rejected.
- Recipient account and IFSC-format fields are validated before review and again before recording the result.
- A synchronous ref lock prevents duplicate finish submissions while a save is in progress.
- The available sample balance subtracts existing pending debit simulations, and the recorded transfer remains `pending`; no network payment is sent.
- The transfer's date is currently derived from `new Date().toISOString().slice(0, 10)`. This is a UTC date, not necessarily the browser's local calendar date. It can appear one day off in local statement/passbook views around timezone boundaries. Follow-up fix should use a local calendar-date helper and add a deterministic test around a timezone-boundary instant.
- Beneficiary persistence validates the saved list and disables editing if saved data cannot be loaded or validated.

### Acceptance work still outstanding

- [ ] Change simulated transfer date generation to the intended local calendar date.
- [ ] Add deterministic tests for amount parsing, pending-debit reservation, and duplicate-submit behavior.
- [ ] Verify transfer result, balance, Passbook, statement and receipt consistency in a browser.
- [ ] Run the production build and route smoke tests; none are claimed by this static audit.


## Step 19 — mobile-device-only presentation

Implemented in `app/style.css` on `main`:

- Constrains the app shell to a 520px phone-width viewport, including desktop previews; removes the desktop sidebar from the active UI and keeps the five-destination bottom tab bar visible.
- Adds safe-area-aware bottom navigation padding, a sticky compact header, thumb-sized 44px controls, and 16px form control text to reduce unwanted mobile browser zoom.
- Uses single-column layouts for forms, filters, service tiles and transaction rows; wraps long identifiers/content and clips accidental horizontal page overflow.
- Keeps statement/document styles and the local-prototype disclosure; this is a responsive presentation change, not APK pixel-parity proof.
- Static source verification confirmed the phone-width shell, bottom tabs, safe-area padding, touch targets, form sizing, overflow safeguards and narrow Passbook filter layout.
- Not yet verified in a real mobile browser or via production build. Follow-up acceptance: test iOS Safari and Android Chrome at 320px, 360px, 390px and 430px widths, plus safe-area and keyboard behavior.

## Step 20 — mobile statement transaction cards

- Added explicit data labels to each sample statement transaction cell in `app/statement/page.tsx`.
- On narrow screens (650px and below), the statement's wide five-column table is replaced by stacked transaction cards with visible Date, Remarks, Reference, Amount, and Status labels. Long descriptions and references wrap instead of requiring sideways scrolling.
- Added print-specific overrides so printing restores a conventional table with its column headings.
- Fetched both committed source files from `main` and statically verified mobile card rules, labels, hidden mobile header, zero minimum table width, and print table restoration.
- Real-device layout, print output, and production build remain untested.

## Step 21 — mobile receipt layout

- Updated `app/style.css` so the receipt page heading and Print / Save PDF action fit a phone viewport; the action becomes full-width on narrow screens.
- Receipt selector and receipt paper use reduced mobile padding, and the sample stamp no longer rotates on narrow screens.
- Transaction amount, account details, identifiers, status and long references use compact two-column labeled rows with safe wrapping. Extra-narrow screens switch detail rows to a single column.
- Print-specific rule hides the on-screen print action and keeps receipt fields from splitting across pages where possible.
- Static verification to be completed against the committed stylesheet. Real iOS/Android rendering, print pagination and production build remain untested.
