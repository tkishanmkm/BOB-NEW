# APK inventory and BOB-NEW migration ledger

## Goal
Use the APK as evidence for page/resource coverage, while implementing application behavior based on the separate `tkishanmkm/BOB-WORLD` Next.js source. All development changes belong in `tkishanmkm/BOB-NEW`; BOB-WORLD remains read-only.

## Source repository routes mapped in BOB-NEW
The source repository contains 51 directories under `src/app`, plus the root route. The routes below are linked in BOB-NEW navigation; dedicated pages take precedence, and other one-segment routes render through `app/[feature]/page.tsx`.

- `/`
- `/about`
- `/account-actions`
- `/account-statement`
- `/agent-live-chat`
- `/ai-assistant-chat`
- `/alerts`
- `/all-accounts`
- `/app-settings`
- `/bill-pay`
- `/borrow`
- `/bus-tickets`
- `/cards`
- `/change-login-pin`
- `/change-transaction-pin`
- `/cheque-book-request`
- `/complaints`
- `/contact-details`
- `/contact-us-help`
- `/credit-card-apply`
- `/current-account-details`
- `/dashboard`
- `/digital-loan`
- `/digital-planner`
- `/faqs`
- `/fixed-deposit`
- `/fund-transfer`
- `/help`
- `/invest`
- `/kyc-details`
- `/link-bank`
- `/more`
- `/need-help`
- `/nominee-registration`
- `/offers`
- `/passbook`
- `/personal-details`
- `/personal-loan-info`
- `/positive-pay`
- `/profile`
- `/recharge`
- `/save`
- `/scan`
- `/security`
- `/settings`
- `/shop-and-pay`
- `/shop`
- `/statement-analysis`
- `/switch-to-classic`
- `/upi`
- `/video-call`
- `/watch-demo`

Additional dedicated BOB-NEW routes include `/account-details`, `/statement`, `/transfers`, `/payees`, `/help-support`, and `/demo-documents`.

## APK static asset inventory
The local APK audit inventory records:
- 611 Flutter image assets.
- 4 Flutter font assets in the Flutter asset manifest; additional decoded font resources include Acumin variants, Gabarito, MaterialIcons, CupertinoIcons and Roboto variants.
- 1,022 native Android XML layout files.
- 1,415 native drawable/mipmap visual resources.
- 3,746 resource records.
- Catalogues at `gallery/flutter-assets.html`, `gallery/native-layouts.html`, `inventory/flutter-image-paths.txt`, `inventory/flutter-font-paths.txt`, and `inventory/asset-inventory.csv` in the local audit folder.

These are inventory counts, not proof that every resource appears in a live screen. The Flutter AOT UI and third-party SDK resources mean exact runtime page-to-asset mapping is not fully recoverable from filenames alone.

## Current BOB-NEW asset policy/status
- App assets currently committed: original Daybook SVG mark, generic institution icon, and generic transfer icon under `public/assets/`.
- APK-specific official bank logos and unverified proprietary font files have not been copied into the independent Daybook identity. Keep those as reference-only until reuse rights and exact intended usage are verified.
- Do not assign an APK asset to a screen based only on its filename. Record mapping confidence as confirmed (runtime screenshot), likely (strong filename/path evidence), or unknown (may be unused/SDK-owned).
- All generated statement/account-summary documents must be labelled `DEMO — NOT A BANK-ISSUED DOCUMENT`.

## Shared sample state
`lib/demo.ts` is the single local source for sample profile, account display fields, opening balance and transaction history. Settings JSON import/export validates the data; the account details, dashboard, passbook, statement and generic route screens read the shared state. Transfer completion creates a pending, clearly marked local simulation transaction only.

## Not yet verified
- Full lint, TypeScript, production build and browser/mobile interaction suite.
- Every feature has the same depth of behavior as the source app; generic routes are route coverage and saved-state overview pages, not a claim that all real banking services exist.
- Exact APK runtime screen list, per-screen asset mapping, and pixel-level layout.
