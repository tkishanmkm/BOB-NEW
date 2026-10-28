# APK asset-to-route mapping — BOB-NEW

Status: **first mapped asset batch implemented; not yet visually verified against runtime screenshots**.

## Mapping convention
All paths below are relative to `public/` and are served from the matching `/assets/reference/flutter-ui/assets/images/...` URL. These assets were found in the extracted Flutter image directory. The map uses screen-family icons rather than official brand marks, and the independent prototype disclosure remains visible.

| BOB-NEW route / location | Component | Source asset | Evidence / confidence |
|---|---|---|---|
| `/dashboard` quick actions | `components/apk-asset-map.tsx` | `images/sendMoney/bank_transfer_icon.svg` | Transfer icon named for transfer flow; medium |
| `/dashboard` quick actions | same | `images/transactionHistory/history.svg` | Transaction history family; medium |
| `/dashboard` quick actions | same | `images/dashBoard/beneficiary.svg` | Dashboard beneficiary family; medium |
| `/dashboard` account shortcut | same | `images/dashBoard/bank.svg` | Account/bank category; medium |
| `/dashboard` statement shortcut | same | `images/dashBoard/transcationHistory.svg` | Dashboard transaction history; medium |
| `/dashboard` settings shortcut | same | `images/mySpace/accountManagement.svg` | Account management family; medium |
| `/more` bill-pay tile | same | `images/dashBoard/billPayment.svg` | Dashboard bill-payment family; medium |
| `/more` cards tile | same | `images/cardDetails/creditCardIcon.svg` | Card details family; medium |
| `/more` recharge tile | same | `images/rechargesAndBills/mobile_icon.svg` | Recharge and bills family; medium |
| `/more` scan tile | same | `images/activateUpi/scanner_icon.svg` | UPI scanner family; medium |
| `/more` loan tile | same | `images/rechargesAndBills/loan_icon.svg` | Recharge/bill loan category; medium |
| `/more` profile tile | same | `images/mySpace/personalDetails.svg` | Profile family; medium |
| `/more` security tile | same | `images/profileManagement/lock.svg` | Security family; medium |
| `/more` complaints tile | same | `images/bbps_raise_complaint/complaint_info_icon.svg` | Complaint family; medium |
| `/more` FAQ tile | same | `images/vpaExist/faq.svg` | FAQ family; medium |

## Validation and limits
- Each mapped path is checked by the route smoke test for actual HTTP serving, and the audit manifest validates copied files exist.
- Filename grouping is useful evidence but not a substitute for screenshot matching; a few icons may have been bundled for a related embedded SDK flow.
- Native Android XML/vector drawables are not directly substituted into browser pages unless converted and reviewed.
- The complete extracted asset collection is not blindly placed on every page: irrelevant assets and official bank marks are not appropriate for this independent demo identity.
- Exact asset placement, sizes, margins and screen state still require a side-by-side comparison against authorized source APK screenshots/runtime captures.

Additional confirmed mapping decisions:
- Cards tile: `images/cardDetails/bob_card_icon.svg` (card-family asset; medium confidence).
- Fixed-deposit tile: `images/mySpace/save.svg` (savings icon used as a general savings-product cue; low-to-medium confidence, pending screenshot comparison).
- Bus-tickets tile deliberately uses a labelled `BUS` fallback instead of incorrectly reusing an unrelated transfer icon. A suitable source asset has not yet been verified.
- Recharge tile: `images/activateUpi/mobile_icon.svg` (mobile-service icon; medium confidence).
