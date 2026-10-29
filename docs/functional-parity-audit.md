# BOB-NEW core functional-parity audit

**Scope:** Static source review of the current `main` branch. This is not a runtime test, security certification, or claim of parity with the original BOB World APK. The application is a local prototype and must not represent sample transactions as real bank activity.

## Core flows reviewed

| Flow | Source reviewed | Current implemented behavior | Gaps / verification still required |
|---|---|---|---|
| Fund transfer | `app/transfers/page.tsx`, `app/payment-successful/page.tsx` | Details and review stages; validates amount/recipient formats; checks posted balance and existing pending demo debits; writes a pending local demo debit through IndexedDB; result page requires the exact requested transfer ID when supplied. | No bank/payment rail, beneficiary verification, OTP or real authorization. Runtime tests needed for repeated clicks, stale tabs, insufficient balance, storage failures and refresh/deep links. |
| Beneficiaries | `app/payees/page.tsx`, `lib/demo.ts` | Validates local recipient records; add/remove operations use expected-value conflict checks; editing is disabled if saved data cannot be loaded or validated. | IFSC-shaped values are format checks only, not verification. Runtime tests needed for concurrent tabs, duplicate accounts, malformed storage and restore conflicts. |
| Passbook | `app/passbook/page.tsx` | Searches descriptions, dates and IDs; filters date/type/status; sorts newest first; totals posted credits/debits separately; labels pending entries as simulations. | Must confirm date-range edge cases and totals against known fixture data in a browser. |
| Statement | `app/statement/page.tsx` | Filters local transactions and provides print/save-PDF via browser print; includes explicit sample-data disclaimer. | Not a bank-issued statement or a generated native bank PDF. Verify print layout, page breaks, mobile print behavior and invalid date ranges. |
| Receipt | `app/receipt/page.tsx` | Selects local transaction; uses an explicit query ID as authoritative; prints a sample receipt and labels status as local sample data. | Must verify empty history, invalid ID, query navigation and print layout. Receipt is not proof of payment. |
| Local demo PIN settings | `app/change-login-pin/page.tsx`, `app/change-transaction-pin/page.tsx`, `lib/demo.ts` | Login demo PIN has a dedicated change screen; transaction demo PIN is stored as a separate local record and can be configured independently. Both screens disclose that these are browser-local demonstrations, not bank authentication. | Transaction demo PIN is not integrated with transfer confirmation and must not be treated as transfer authorization. Values are prototype data, not encrypted bank credentials. Runtime tests and original APK comparison are still required. |
| Transfer result | `app/payment-successful/page.tsx` | Hydrates IndexedDB before looking up the exact transfer; displays pending/not processed and explicitly says no payment was made. | Runtime tests needed for direct URL, refresh, missing ID, deleted transaction and storage rejection. |
| Settings / data import | `app/settings/page.tsx`, `lib/demo.ts` | Hydrates browser storage; validates account JSON; previews import before applying to the form; save goes through validated IndexedDB state write; workspace restore validates account, beneficiary and support records and uses conflict baselines. | Review the complete export/import/restore UI in browser; test malformed JSON, oversized files, failed saves and recovery from invalid legacy storage. |
| Support inbox | `app/help-support/page.tsx` | Local-only conversation; validates message list; preserves draft when save fails; uses conflict-aware save/clear operations. | No remote agent receives messages. Verify concurrent tabs and storage failures. |
| Persistence / conflicts | `lib/demo.ts` | IndexedDB-backed state, validation, legacy migration safeguards, queued compare-and-write for account state, conflict-aware collection writes, cross-tab notification. | No runtime/browser tests have been run as part of this review. IndexedDB behavior differs across browser/private modes and needs real browser testing. |

## Status vocabulary

- **Implemented (source-reviewed):** Relevant behavior is visible in the source code.
- **Runtime-unverified:** No execution result is available; the source review does not prove the flow works end to end.
- **Not integrated:** Requires a real external service or native capability that this local prototype does not have.
- **Visual parity unverified:** No side-by-side screenshot comparison with the original APK was performed.

## Release-blocking checks before calling the migration complete

1. Run `npm run verify:local` in a clean checkout with dependencies installed; retain the complete output and fix failures rather than treating this static audit as test evidence.
2. Walk through every route in a real browser at desktop and mobile widths; include the login/demo gate, direct URL loads, refreshes, keyboard focus, and back navigation.
3. Exercise the flows above with known fixture data, including invalid inputs, duplicate actions, concurrent tabs, malformed imports and storage failures.
4. Compare each implemented screen with authorized original APK screenshots. Route presence, reused icons and HTTP 200 responses do not establish visual parity.
5. Keep demo notices visible. Do not connect real bank credentials, claim a transfer succeeded, or describe local data as bank-verified.

## Current conclusion

**Core local-demo flows are present in source, but runtime reliability and APK visual/functional parity remain unverified.** This audit does not authorize production banking use.
