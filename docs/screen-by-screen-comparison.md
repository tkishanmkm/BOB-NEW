# Screen-by-screen comparison tracker — BOB-NEW

Date: 2026-10-29
Scope: original BOB-WORLD APK resource inventory vs BOB-NEW Next.js local demo.

## Truthful status

- **52/52 source routes now resolve to dedicated Next.js route files**. 33 routes were moved off the single dynamic route into route-specific page entry files.
- Shared feature rendering still lives in `components/feature-page.tsx`; dedicated route files alone do not mean 52 different layouts or exact visual parity.
- **0/52 screens can be certified pixel-identical from this workstation** because the original APK could not be launched for runtime screenshots (no adb, emulator, Android SDK, or screenshot set available). Static resources and filenames are evidence for asset families, not proof of exact screen appearance.
- Asset inventory: 611 Flutter images, 4 declared Flutter font assets, 1,022 native XML layouts, and 1,415 native drawable/mipmap resources. The archive includes asset galleries/inventories, not a verified runtime screenshot walkthrough.
- The independent Daybook branding and local-only disclosures remain intentional; the demo must not impersonate a bank app or imply live bank/payment integration.

## Route-by-route comparison matrix

Legend: **Route = PASS** means the route file exists. **Visual = BLOCKED** means the exact APK screenshot is not available for a fair side-by-side comparison. **Behavior = DEMO** means only local prototype behavior is intended.

| # | Route | Screen / comparison target | Current implementation focus | Route | Visual parity | Local behavior |
|---:|---|---|---|---|---|---|
| 1 | `/` | Entry / access gate | Local PIN gate | PASS | BLOCKED | DEMO |
| 2 | `/dashboard` | Home / dashboard | Balance, quick actions, recent activity | PASS | BLOCKED | DEMO |
| 3 | `/about` | About | Feature-specific title, description, links | PASS | BLOCKED | DEMO |
| 4 | `/account-actions` | Account actions | Account shortcuts | PASS | BLOCKED | DEMO |
| 5 | `/account-statement` | Account statement | Statement route/filters links | PASS | BLOCKED | DEMO |
| 6 | `/agent-live-chat` | Agent chat | Local-only support notice | PASS | BLOCKED | DEMO |
| 7 | `/ai-assistant-chat` | Assistant chat | Local help navigation | PASS | BLOCKED | DEMO |
| 8 | `/alerts` | Alerts | Saved activity-oriented page | PASS | BLOCKED | DEMO |
| 9 | `/all-accounts` | All accounts | One locally saved sample account | PASS | BLOCKED | DEMO |
| 10 | `/app-settings` | App settings | Shared settings navigation | PASS | BLOCKED | DEMO |
| 11 | `/bill-pay` | Bill payments | Local feature overview | PASS | BLOCKED | DEMO |
| 12 | `/borrow` | Borrow | Product preview only | PASS | BLOCKED | DEMO |
| 13 | `/bus-tickets` | Bus tickets | Product preview only | PASS | BLOCKED | DEMO |
| 14 | `/cards` | Cards | Card feature overview | PASS | BLOCKED | DEMO |
| 15 | `/change-login-pin` | Change login PIN | Settings-based demo PIN route | PASS | BLOCKED | DEMO |
| 16 | `/change-transaction-pin` | Change transaction PIN | Settings-based demo PIN route | PASS | BLOCKED | DEMO |
| 17 | `/cheque-book-request` | Cheque-book request | Local request preview | PASS | BLOCKED | DEMO |
| 18 | `/complaints` | Complaints | Local support navigation | PASS | BLOCKED | DEMO |
| 19 | `/contact-details` | Contact details | Shared saved profile | PASS | BLOCKED | DEMO |
| 20 | `/contact-us-help` | Contact/help | Local support navigation | PASS | BLOCKED | DEMO |
| 21 | `/credit-card-apply` | Credit-card application | Product preview only | PASS | BLOCKED | DEMO |
| 22 | `/current-account-details` | Current account details | Shared saved account | PASS | BLOCKED | DEMO |
| 23 | `/digital-loan` | Digital loan | Product preview only | PASS | BLOCKED | DEMO |
| 24 | `/digital-planner` | Digital planner | Local data links | PASS | BLOCKED | DEMO |
| 25 | `/faqs` | FAQs | Help navigation | PASS | BLOCKED | DEMO |
| 26 | `/fixed-deposit` | Fixed deposit | Product preview only | PASS | BLOCKED | DEMO |
| 27 | `/fund-transfer` | Fund transfer alias | Shared local transfer flow | PASS | BLOCKED | DEMO |
| 28 | `/help` | Help | Local help navigation | PASS | BLOCKED | DEMO |
| 29 | `/invest` | Investments | Product preview only | PASS | BLOCKED | DEMO |
| 30 | `/kyc-details` | KYC details | Status not verified; no real KYC | PASS | BLOCKED | DEMO |
| 31 | `/link-bank` | Link bank | No credential collection or linking | PASS | BLOCKED | DEMO |
| 32 | `/more` | More services | Service directory | PASS | BLOCKED | DEMO |
| 33 | `/need-help` | Need help | Local support navigation | PASS | BLOCKED | DEMO |
| 34 | `/nominee-registration` | Nominee registration | Local preview only | PASS | BLOCKED | DEMO |
| 35 | `/offers` | Offers | Offer preview only | PASS | BLOCKED | DEMO |
| 36 | `/passbook` | Passbook / transactions | Transaction ledger and filters | PASS | BLOCKED | DEMO |
| 37 | `/personal-details` | Personal details | Shared saved profile | PASS | BLOCKED | DEMO |
| 38 | `/personal-loan-info` | Personal loan information | Product preview only | PASS | BLOCKED | DEMO |
| 39 | `/positive-pay` | Positive pay | Preview only | PASS | BLOCKED | DEMO |
| 40 | `/profile` | Profile | Shared saved profile | PASS | BLOCKED | DEMO |
| 41 | `/recharge` | Recharge | Preview only | PASS | BLOCKED | DEMO |
| 42 | `/save` | Save / savings | Local account links | PASS | BLOCKED | DEMO |
| 43 | `/scan` | Scan / QR | No camera/payment rail connected | PASS | BLOCKED | DEMO |
| 44 | `/security` | Security | Local demo security notice | PASS | BLOCKED | DEMO |
| 45 | `/settings` | Settings | Local profile, data import/export | PASS | BLOCKED | DEMO |
| 46 | `/shop-and-pay` | Shop and pay | Preview only | PASS | BLOCKED | DEMO |
| 47 | `/shop` | Shop | Preview only | PASS | BLOCKED | DEMO |
| 48 | `/statement-analysis` | Statement analysis | Saved transaction links | PASS | BLOCKED | DEMO |
| 49 | `/switch-to-classic` | Display options | Current responsive theme | PASS | BLOCKED | DEMO |
| 50 | `/upi` | UPI | No UPI rail connected | PASS | BLOCKED | DEMO |
| 51 | `/video-call` | Video call | No call service connected | PASS | BLOCKED | DEMO |
| 52 | `/watch-demo` | Watch demo | Local demo navigation | PASS | BLOCKED | DEMO |

## Asset-family comparison currently supported by static evidence

| Screen family | Asset evidence used | Confidence | Exact visual comparison |
|---|---|---|---|
| Dashboard quick actions | Flutter `dashBoard`, `sendMoney`, `transactionHistory` SVGs | Medium: names/folders are relevant | Blocked |
| More/service directory | Flutter `dashBoard`, `mySpace`, `cardDetails`, `rechargesAndBills` SVGs | Medium for family, not exact placement | Blocked |
| Account/profile | Flutter `accountManagement`, `mySpace`, `profileManagement` resources | Medium | Blocked |
| Transfers | Flutter `sendMoney` icon family | Medium | Blocked |
| Passbook/statement | Flutter `transactionHistory` and dashboard history icons | Medium | Blocked |
| Cards, UPI, recharge, support | Corresponding Flutter resource folders | Medium/low per item | Blocked |
| Statement PDF | No verified original statement PDF template recovered | Unknown | Blocked |

## Completion criteria for exact screen-by-screen parity

For each route, compare a source APK screenshot and BOB-NEW screenshot at the same viewport, device scale, orientation, and state. Check header/status/navigation bars, typography, dimensions, margins, colors, iconography, banners, scrolling, dialogs, validation errors, empty states, and button destinations. Save both images and a per-screen diff/notes. Repeat for loading, empty, populated, validation, and confirmation states.

**Required evidence still missing:** launchable authorized APK runtime or user-provided screenshots/video of each screen. The archive's native XML and Flutter asset gallery cannot substitute for actual Flutter screenshots. Once that evidence exists, change each Visual parity value from BLOCKED to PASS only after comparison.
