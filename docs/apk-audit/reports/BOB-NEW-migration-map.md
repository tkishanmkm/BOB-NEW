# BOB-NEW migration map — evidence-based working document

Status: route and resource mapping started; no application source changed and no repository created.
Reference repository: tkishanmkm/BOB-WORLD (read-only during this task).
APK audit folder: C:\\Users\\theki\\Downloads\\bob-world-ui-audit

## Rules for the migration
- Build a distinct demo finance application identity. Do not copy official bank branding or assets in a way that could impersonate the bank.
- Any generated receipt/statement must be visibly labelled DEMO — NOT A BANK-ISSUED DOCUMENT.
- Keep BOB-WORLD unchanged.
- Treat APK static analysis as evidence of resources, not proof of every runtime screen or business flow.
- Do not connect to real banking/payment systems or execute financial transactions.

## GitHub application route inventory
The following 50 page files exist under src/app:
- /about
- /account-actions
- /account-statement
- /agent-live-chat
- /ai-assistant-chat
- /alerts
- /all-accounts
- /app-settings
- /bill-pay
- /borrow
- /bus-tickets
- /cards
- /change-login-pin
- /change-transaction-pin
- /cheque-book-request
- /complaints
- /contact-details
- /contact-us-help
- /credit-card-apply
- /current-account-details
- /dashboard
- /digital-loan
- /digital-planner
- /faqs
- /fixed-deposit
- /fund-transfer
- /help
- /invest
- /kyc-details
- /link-bank
- /more
- /need-help
- /nominee-registration
- /offers
- /
- /passbook
- /personal-details
- /personal-loan-info
- /positive-pay
- /profile
- /recharge
- /save
- /scan
- /security
- /settings
- /shop-and-pay
- /shop
- /statement-analysis
- /switch-to-classic
- /upi
- /video-call
- /watch-demo

## Initial feature-to-route mapping
| Feature | Existing route(s) | Migration note |
|---|---|---|
| Splash/login | / | Separate splash behavior exists in root layout and login page; consolidate to one predictable flow. |
| Dashboard | /dashboard | Rebuild with original demo identity and shared data store. |
| Profile/account | /profile, /personal-details, /contact-details, /all-accounts, /current-account-details, /kyc-details | Use a single typed demo profile/account model; do not imply real KYC. |
| Settings/security | /settings, /app-settings, /security, /change-login-pin, /change-transaction-pin | Settings should be central source for demo data; PIN must not be logged or stored as ordinary plaintext settings. |
| Transactions | /passbook, /account-statement, /fund-transfer, /statement-analysis | Make transaction changes consistent with demo balance; mark all exported docs as demo. |
| Payment-style flows | /upi, /bill-pay, /recharge, /scan, /shop, /shop-and-pay | Demo/simulation only; no real payments or bank rails. |
| Saving/investment/credit | /save, /invest, /fixed-deposit, /borrow, /digital-loan, /personal-loan-info, /digital-planner | Informational/demo UI only unless safe verified service exists. |
| Cards/banking services | /cards, /link-bank, /cheque-book-request, /positive-pay, /nominee-registration, /credit-card-apply | Clearly simulated; do not collect real bank credentials or sensitive IDs. |
| Help/chat | /help, /need-help, /contact-us-help, /faqs, /complaints, /alerts, /agent-live-chat, /ai-assistant-chat, /video-call | Demo content only; no claims of official bank support. |
| Other | /account-actions, /more, /offers, /bus-tickets, /switch-to-classic, /watch-demo, /about | Review each route for actual functionality before migration. |

## APK inventory evidence already recorded
- 611 Flutter image assets listed in the Flutter manifest.
- 4 Flutter font assets listed in the Flutter manifest; decoded resources include Acumin, Gabarito, MaterialIcons and CupertinoIcons font entries.
- 1,022 native Android XML layouts catalogued.
- 1,415 native drawable/mipmap resources copied into the audit folder.
- 3,746 resource records in the inventory.
- Searchable galleries: gallery/flutter-assets.html and gallery/native-layouts.html.
- Resource-derived font/theme notes are in reports/visual-design-system.md.
- The APK is Flutter with compiled AOT UI. Resource inventory alone cannot establish every runtime page, route, exact dimensions, or business logic.

## APK-to-application mapping status
| APK screen/component | Evidence | Status |
|---|---|---|
| Flutter assets/fonts | Asset manifest and resource inventory | Indexed; individual screen usage not fully mapped |
| Native statement upload UI | custom_upload_bank_statements.xml and dialog_upload_bank_statements.xml | Static UI evidence only; not the account-statement PDF generator |
| Exact runtime screen list and navigation | Not fully exposed by static AOT extraction | Requires authorized screenshots/runtime walkthrough |
| Exact statement PDF layout and generator | No verified template or generator found in current static pass | Unverified; needs redacted sample PDF or screenshots |
| Banner currently shown at runtime | Resource inventory alone insufficient | Unverified |
| Exact page dimensions/spacing/typography | No runtime screenshot measurements | Unverified |

## Existing source findings requiring fixes in the new project
1. Login page currently routes to dashboard when any four digits are entered; it also logs the entered PIN to console.
2. Login splash behavior is duplicated between root layout and login page.
3. Existing settings/localStorage logic needs schema validation and a single typed store to avoid stale or inconsistent data.
4. Uploaded PDF stored as a Base64 data URI in localStorage may exceed browser storage limits.
5. AI PDF extraction sends statement data to an external model; new demo flow should not send sensitive documents externally by default.
6. Existing account-statement page was observed to download a stored/uploaded PDF; this does not prove it generates statements from transactions.
7. Receipt preview fields were found in source; PDF export behavior still requires a separate verified test.

## Acceptance checklist before calling migration complete
- [ ] Confirm BOB-NEW repository exists and is accessible.
- [ ] Preserve BOB-WORLD untouched; work only in BOB-NEW.
- [ ] Complete APK screen/path mapping using permitted runtime screenshots or explicitly mark unknowns.
- [ ] Define original brand, theme tokens, fonts and asset manifest.
- [ ] Implement a shared, typed demo data model and validated persistence/import/export.
- [ ] Test all routes, navigation, mobile layout, keyboard behavior and browser storage errors.
- [ ] Test demo receipt/statement PDF output and page breaks; add visible demo watermark.
- [ ] Run lint, typecheck, production build and browser/device smoke tests.
- [ ] Record actual results; do not claim 100% or production-ready without evidence.


## Follow-up: extracted asset-category inspection
Desktop Commander confirmed these directories exist in the APK audit output:
- assets/backgrounds/ (236 items; listing was truncated after 100)
- assets/banners/
- assets/flutter-ui/
- assets/fonts/
- assets/illustrations/
- assets/launcher-icons/
- assets/logos/ (121 items; listing was truncated after 100)
- assets/native-visual-resources/
- gallery/contact-sheets/
- screenshots/

Examples of resource names found (names are evidence of extracted resources, not proof of runtime use):
- Background candidates: `base_assets__flutter_assets__assets__images__dashBoard__bob_bg.png`, `base_res__drawable-nodpi__home_bg.jpg`, `base_res__drawable__login_screen_background.xml`.
- Banner candidates: `base_assets__flutter_assets__assets__images__upi_circle__upi_circle_banner.png`, `base_res__drawable-mdpi__src_assets_images_introcarousel.png`, `base_res__drawable-mdpi__src_assets_images_nudgebanner.png`.
- Font files include Acumin variants, Gabarito, MaterialIcons, CupertinoIcons and Roboto variants.
- Logo folder contains bank/app/payment/provider logos; these should remain reference-only for an independently branded app rather than be copied into the new product identity.

### Asset mapping rule
Do not assign any extracted image to a particular screen solely because of its filename. Use the searchable gallery and, where possible, authorized runtime screenshots to map visual placement. Record confidence as:
- Confirmed: visible in a verified screenshot or runtime capture.
- Likely: name/path strongly suggests purpose but no runtime confirmation.
- Unknown: resource could be unused or owned by a third-party SDK.

### Current asset-mapping result
Directory-level inventory is confirmed; screen-by-screen placement remains unverified. No assets have been copied into a new app, and no app source has been modified.
