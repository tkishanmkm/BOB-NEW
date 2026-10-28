# BOB-WORLD to BOB-NEW Migration Baseline

Generated from GitHub main trees on 2026-10-28. This is a migration checklist, not a claim that migration is complete.

## Scope and safeguards
- Target: tkishanmkm/BOB-NEW. Reference: tkishanmkm/BOB-WORLD (read-only; do not modify).
- No GitHub Actions or Actions minutes.
- Port relevant UI patterns, routes, workflows, schemas and usable assets only after auditing their source.
- Do not copy real customer records, credentials, tokens, OTPs, account secrets or live transaction data. Use fictional demo fixtures.
- Keep the app clearly independent and demonstrative. Do not claim real bank authentication, actual transfers or bank-issued documents. Real payments require an authorized banking/payment integration.

## Snapshot
- Reference tree SHA: 4cce00fcc2c21b51196febfd1bad4a03b6020869
- Target tree SHA: 1093706b2c74a2991ba7a7bb68e42c89fcab3523
- Reference single-segment page files found: 51
- Reference Git tree contains 8 files with recognizable raster/vector/font/icon extensions; most audit-listed APK assets are extracted/compiled Android resources and must be sourced from the supplied audit archive, not assumed to exist as ordinary files in the source repo.
- Target has 11 explicit page files plus app/[feature]/page.tsx. A dynamic fallback is not equivalent to a complete implementation of every source feature.
- Review archive: C:\Users\theki\Downloads\bob-world-ui-audit-review.zip
- Extracted audit directory: C:\Users\theki\Downloads\bob-world-ui-audit
- The supplied archive and extracted audit directory were located on the desktop. Their full binary contents have not yet been exhaustively compared with target assets; the extracted audit inventory contains categorized logo, icon, background, banner, font and launcher-icon groups.

## Route-by-route inventory
| Reference route | Target status at snapshot | Required review |
|---|---|---|
| /about | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /account-actions | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /account-statement | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /agent-live-chat | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /ai-assistant-chat | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /alerts | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /all-accounts | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /app-settings | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /bill-pay | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /borrow | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /bus-tickets | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /cards | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /change-login-pin | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /change-transaction-pin | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /cheque-book-request | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /complaints | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /contact-details | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /contact-us-help | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /credit-card-apply | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /current-account-details | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /dashboard | Dedicated target page exists; behavior parity still needs audit | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /digital-loan | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /digital-planner | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /faqs | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /fixed-deposit | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /fund-transfer | Dedicated target page exists; behavior parity still needs audit | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /help | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /invest | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /kyc-details | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /link-bank | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /more | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /need-help | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /nominee-registration | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /offers | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /passbook | Dedicated target page exists; behavior parity still needs audit | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /personal-details | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /personal-loan-info | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /positive-pay | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /profile | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /recharge | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /save | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /scan | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /security | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /settings | Dedicated target page exists; behavior parity still needs audit | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /shop-and-pay | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /shop | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /statement-analysis | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /switch-to-classic | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /upi | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /video-call | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |
| /watch-demo | Dynamic fallback only; dedicated parity not verified | Compare layout, navigation, state, validation, loading/error/success states and assets. |

## Core workflows to map from source
1. Login/access PIN and change-login-PIN. The target's local PIN gate is a demo gate, not secure authentication.
2. Dashboard, all accounts, savings/current-account details, balance and recent transactions.
3. Fund transfer: beneficiary list/add/edit/delete, recipient selection, review, demo PIN/OTP UI if applicable, success/failure/cancel, reference and matching Passbook entry.
4. Passbook, account statements, statement analysis and exports.
5. Cards, cheque book, positive pay, bill pay, recharge, UPI, scan, shop/pay, bus tickets, offers, investment/deposit/loan features.
6. Profile, contact details, KYC, nominee, security, app settings, alerts, complaints, FAQ/help/support, live chat, assistant, video-call and demo/watch routes.
7. Shared shell: responsive navigation, typography, spacing, colors, icons, empty/loading/error states, mobile keyboard and responsive behavior.

## Asset migration checklist
- Inventory every archive entry and extracted audit asset, then compare names and hashes against target.
- Separate app assets from Android framework/vendor SDK resources; do not blindly copy Android XML/framework assets into Next.js.
- Port appropriate logos, banners, backgrounds, illustrations, icons and fonts into a stable public/assets folder; preserve source path in a manifest.
- Verify asset usage, path validity, responsive rendering, licenses and branding appropriateness.
- Add favicon/app icons only after confirming they belong in this independent demo.

## Data model and transaction integrity
- Audit all source routes for localStorage keys and inconsistent independent state reads/writes.
- Map profile/account fields, payees, transaction schema, transfer states, references, statuses and balance calculations before implementation.
- Never copy real user/customer records. Preserve schema shape with synthetic fixtures.
- Simulated transfers must remain clearly labelled and must not be presented as settled/paid. A demo success flow should create exactly one matching sample transaction; retry/cancel must not duplicate it.
- Define one canonical state module and test import/export, schema validation, same-day ordering, pending-versus-posted balance rules and cross-page refresh.

## Acceptance criteria (not yet claimed complete)
- Every listed route has an intentional dedicated UI or documented placeholder/not-supported state; no silent generic fallback for a promised feature.
- UI reviewed against supplied audit galleries and relevant APK screenshots.
- All intended assets present and loading; framework/vendor-only assets excluded.
- Workflow tests cover success, validation error, cancellation, refresh/reopen, duplicate submit, empty state and storage failure.
- npm run typecheck, npm run lint, npm run build and browser route/smoke checks pass after changes.
- Manual desktop/mobile visual review completed.
- No GitHub Actions workflows added.

## Execution order
1. Finish archive/asset inventory and generate source-to-target asset manifest.
2. Build route parity matrix and prioritize shell, dashboard, account details, Passbook, payees and fund transfer.
3. Port appropriate assets and wire them into target UI.
4. Port feature behavior one workflow at a time using synthetic data and explicit demo semantics.
5. Validate locally without GitHub Actions; commit only to BOB-NEW/main.