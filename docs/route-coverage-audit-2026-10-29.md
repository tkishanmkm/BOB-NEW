# BOB-NEW route coverage audit — 2026-10-29

## Scope and method

Reviewed App Router `page.tsx` files, the shared `FeaturePage` route map, and selected key pages. This is a source-code audit only; the original APK still does not launch on the current x86_64 emulator, so this does not certify visual or navigation parity with BOB World 2.0. All flows remain fictional/local demos and must not collect real banking credentials or submit real payments.

## Route categories

### Dedicated local demo screens

- `/` — local demo entry / PIN gate
- `/splash` — prototype splash/continue screen
- `/dashboard` — local overview
- `/account-details` — shared browser-stored sample profile and calculated balance
- `/statement` — date/type/status-filtered sample activity and browser print/save-to-PDF
- `/passbook` — sample activity list
- `/transfers` — transfer simulation; no funds are sent
- `/payees` — local beneficiary/recipient demo
- `/bill-pay` — local bill-payment workflow demo
- `/upi` — local UPI feature preview; no UPI rails connected
- `/settings` — shared local demo profile/data settings
- `/receipt` and `/payment-successful` — locally rendered simulation/receipt screens
- `/fixed-deposit`, `/recharge`, `/cheque-book-request`, `/complaints`, `/positive-pay`, `/digital-planner`, `/offers`, `/help-support`, `/alerts`, `/faqs`, `/more` — dedicated pages exist, but must be reviewed individually for completeness; route existence alone is not functional coverage.

### Alias routes (intentional reuse)

- `/account-statement` re-exports `/statement`
- `/fund-transfer` re-exports `/transfers`
- `/all-accounts` re-exports `/account-details`

These are code-level aliases, not missing screens. They intentionally share behavior with the canonical page.

### Generic mapped routes

Many routes currently use `app/[feature]/page.tsx` and `components/feature-page.tsx`. They render mapped title, description, icon, saved account snapshot and links, rather than a dedicated feature workflow. This is useful navigation scaffolding but is not equivalent to a complete implementation of the corresponding original APK feature.

Generic/mapped examples include `/cards`, `/profile`, `/personal-details`, `/contact-details`, `/current-account-details`, `/app-settings`, `/security`, `/change-login-pin`, `/change-transaction-pin`, `/link-bank`, `/kyc-details`, `/invest`, `/borrow`, `/digital-loan`, `/personal-loan-info`, `/credit-card-apply`, `/nominee-registration`, `/bus-tickets`, `/shop`, `/shop-and-pay`, `/scan`, `/video-call`, `/agent-live-chat`, `/ai-assistant-chat`, `/contact-us-help`, `/need-help`, `/about`, `/help`, `/save`, `/switch-to-classic`, `/statement-analysis`, `/watch-demo`, `/account-actions`.

## Prioritized next implementation work

1. **Account details + statement consistency:** ensure statement closing balance respects both date filters and the selected posted/pending filter; ensure date-range validation and empty-state behavior are coherent. Current statement `closing` calculation includes posted entries through `to` but does not include `from`, `type`, or `status`, so the displayed closing balance can differ from the visible filtered rows. It should be labelled as an account balance through the end date, not as a balance for only the filtered rows.
2. **Transfer simulation integrity:** verify amount validation, payee selection, no negative balance, no duplicate submissions, and that any generated receipt clearly says sample/demo. No real payment integration should be added.
3. **Settings data integrity:** verify import/export schema validation, backup-before-replace behavior, and that corrupt imports cannot silently overwrite local state.
4. **Dedicated feature prioritization:** build richer local-only workflows for high-use routes such as UPI preview, bill-pay preview, recharge preview and cheque-book request; keep each visibly marked as not connected to the bank.
5. **Original APK evidence:** retry runtime capture only in a compatible ARM64 Android environment. Do not use third-party/web screenshots as evidence of APK parity.

## Confirmed limitation

This audit confirms route architecture and local code paths, not real banking integration, security certification, or exact original-APK fidelity. Keep the DEMO/unofficial disclosure visible.
