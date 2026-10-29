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
