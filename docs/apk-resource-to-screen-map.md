# BOB-NEW APK resource-to-screen map

Updated: 2026-10-29  
Scope: `tkishanmkm/BOB-NEW` only. Do not modify PNB or Paxones.

## What the extracted APK actually contains

Static inspection of `C:\\Users\\theki\\Downloads\\BOB-NEW-APK-RESOURCES\\base\\assets\\flutter_assets\\AssetManifest.json` reports **622 manifest keys**:

| Manifest family | Entries | What this establishes |
|---|---:|---|
| Flutter image assets | 612 | Image paths bundled in the Flutter asset manifest |
| Flutter font assets | 3 | Acumin, Gabarito, Gabarito ExtraBold |
| SSL certificate assets | 2 | Bundled certificate files; do not publish these as UI assets |
| Lottie asset | 1 | Animation resource; inspect before mapping |
| English/Hindi/Kannada locale JSON | 3 | Localized text resources |
| Cupertino icon font/package reference | 1 | Package asset reference |

These counts are manifest keys, not a claim that every entry is a unique visible image or that every resource is used at runtime. The current Next.js tree already contains a Flutter image resource collection under `public/assets/reference/flutter-ui/assets/images/` and a smaller curated brand folder under `public/assets/bob-world/`. The asset audit must reconcile manifest keys against physical files before declaring the import complete.

## Evidence labels

- **Confirmed — bundled:** the path exists in the extracted APK manifest or resource tree.
- **Likely — screen family:** a directory/file name strongly suggests a feature family, but exact on-screen placement is not proven.
- **Unverified — visual match:** requires a screenshot from the original app at the same screen, state and viewport.
- **Not a web page layout:** native Android XML resources may belong to embedded SDKs, Android wrappers or third-party features; do not assume they define the primary Flutter screen.

## First screen-family map

| Original screen family | Extracted evidence | Next.js location / integration | Confidence |
|---|---|---|---|
| Splash / app identity | `assets/images/activateUpi/bob_world_logo.svg`; Android launcher/splash resources under `base/res` | `app/splash/page.tsx`, `app/page.tsx`, shared branding | Logo path confirmed; exact splash layout unverified |
| Login / access gate | `assets/images/activateUpi/bob_world_logo.svg`; native layouts include `activity_login.xml`, `login_fragment.xml`, `login_screen_background.xml` | `app/page.tsx` | Native layouts are structural clues only; Flutter runtime screen still unverified |
| Dashboard / home | `assets/images/dashBoard/*`, including `bob_bg.png`, `bank.svg`, `beneficiary.svg`, `billPayment.svg`, `transcationHistory.svg`, `needHelp.svg`, `alerts.svg` | `app/dashboard/page.tsx`, `components/apk-asset-map.tsx` | Asset family likely; exact placement unverified |
| Account actions / management | `assets/images/accountManagement/*` | `app/account-actions/page.tsx`, `app/account-details/page.tsx`, settings-related routes | Likely |
| UPI / activate UPI | `assets/images/activateUpi/*` | `app/upi/page.tsx`, `app/scan/page.tsx`, service tiles | Likely |
| Send money / transfer | `assets/images/sendMoney/*`, `assets/images/sendMoneySuccess/*` | `app/transfers/page.tsx`, `app/fund-transfer/page.tsx`, `app/receipt/page.tsx` | Likely |
| Transaction history / passbook | `assets/images/transactionHistory/*`, `assets/images/dashBoard/transcationHistory.svg` | `app/passbook/page.tsx`, statement routes | Likely |
| Cards | `assets/images/cardDetails/*` | `app/cards/page.tsx` | Likely |
| Recharge and bill payment | `assets/images/rechargesAndBills/*`, `assets/images/dashBoard/billPayment.svg` | `app/recharge/page.tsx`, `app/bill-pay/page.tsx` | Likely |
| Profile / My Space | `assets/images/mySpace/*`, `assets/images/profileManagement/*` | `app/profile/page.tsx`, `app/personal-details/page.tsx`, `app/settings/page.tsx` | Likely |
| Bank picker / beneficiary bank logos | `assets/images/bankLogo/*`, `assets/images/bankIcon/*`, `assets/images/bank_logo_with_bank_code/*` | Bank picker and beneficiary demo UI only when needed | Asset confirmed; exact usage per route unknown |
| Bharat Connect / bill-pay branding | `assets/images/bharat_connect/*`, `assets/images/bbps_raise_complaint/*` | Bill payment/support feature family | Likely; may include embedded SDK screens |
| UPI Circle | `assets/images/upi_circle/*` | UPI Circle-related screen if route evidence is found | Asset confirmed; route/visibility unknown |
| VPA / UPI setup | `assets/images/createVpa/*`, `assets/images/vpaExist/*` | UPI setup demo routes only after reviewing asset previews | Likely; possible SDK-specific resources |

## Native Android resource clues

The extracted base package contains native XML resources such as `base/res/layout/activity_main.xml`, `activity_bob_main.xml`, `activity_login.xml`, `activity_pin_activity_component.xml`, `launch_screen.xml`, and `base/res/navigation/login.xml`. The package also contains many third-party/SDK layouts. These files can identify Android wrapper and embedded-screen structure, but they do **not** prove the primary Flutter UI layout. The app includes compiled Flutter AOT native code, so original Dart widget source was not recovered from the resource archive.

## Work already integrated in Next.js

- Existing `components/apk-asset-map.tsx` maps extracted feature-family icons to dashboard and service-directory actions.
- The dashboard now references the extracted `dashBoard/bob_bg.png` artwork as a visual banner.
- Existing splash, login and shared shell use selected extracted branding/font resources and retain the explicit DEMO/local-only notice.
- All app behavior remains local demo behavior. No real bank authentication, payment initiation, or money movement is connected.

## Next implementation order

1. **Splash:** inspect the logo, launcher/splash drawables and Lottie/video assets; reproduce layout only where source evidence supports it.
2. **Login:** inspect the source background/logo assets and native login-related resource XML; keep the demo access gate and never collect real credentials.
3. **Dashboard:** preview the entire `dashBoard` folder, match icons to actual controls, and refine header, account summary, banners and navigation from a genuine screenshot if available.
4. **Shared navigation:** map app bar/back/home/notification/profile assets to components and keep desktop/mobile navigation consistent.
5. **Screen families:** account/profile, transfers, transaction history, cards, bill pay/recharge, UPI and support.
6. **Asset reconciliation:** compare manifest paths, extracted physical files and Next.js public files; document missing, duplicate, dynamic and SDK-only assets.
7. **Verification:** run typecheck/lint/build and route smoke tests after each batch. Do not call a screen visually identical without a source APK screenshot and a same-viewport comparison.

## Important limitation

The original APK launch attempt returned to the Android launcher, so there is currently no verified original-app screenshot for pixel comparison. This map is a static-evidence implementation guide, not proof of pixel parity. The Next.js app must remain clearly identified as an unofficial local demo prototype.
