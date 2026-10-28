# BOB-NEW — Daybook finance workspace

An independent, separately branded finance-workspace prototype. It does not modify BOB-WORLD and does not connect to real bank/payment systems.

## Implemented routes
- `/` — local sample PIN gate.
- `/dashboard` — shared sample profile, calculated balance, recent activity.
- `/account-details` — read-only shared sample account details, calculated balance and transaction counts.
- `/passbook` — transaction list.
- `/statement` — date/type/status-filtered sample statement with posted credit/debit totals and print-to-PDF support; output is explicitly marked as a demo.
- `/settings` — edit account display, opening balance, sample PIN and transactions; validated JSON import/export.
- `/transfers` — multi-step sample fund-transfer details, review and completion preview. It never sends funds.
- `/payees` — add/remove fictional beneficiaries stored in this browser.
- `/help-support` — local sample support chat with browser-only history; it does not contact an agent.
- Dynamic one-segment routes are available for the complete 51-route BOB-WORLD source inventory (including profile, account-statement, fund-transfer, UPI, recharge, cards, help, and service routes). Existing dedicated Next.js pages take precedence; remaining routes use a shared saved-state feature page with simulation-only notices. APK static inventory is separate and cannot confirm every runtime APK screen.
- `/demo-documents` — printable sample account summary, clearly labelled **DEMO — NOT A BANK-ISSUED DOCUMENT**.

## Assets and design
- Original SVG Daybook mark, generic institution icon and transfer icon are in `public/assets/`.
- Responsive CSS, cross-platform system font stack, mobile navigation and keyboard focus styling are included.
- The APK inventory previously documented 611 Flutter image assets, four font assets and a large resource inventory. That inventory does not itself establish permission to reuse those assets, and static extraction does not prove exact runtime page behavior. Proprietary bank logos, fonts, and branded APK assets have therefore not been copied into this independent app. A permission-cleared asset pack can be mapped after its rights and files are verified.
- Routes are generic equivalents for common finance-app tasks, not pixel-identical copies of a bank's branded UI.

## Run locally
Node.js 20.9+ recommended.
```sh
npm install
npm run dev
```
Quality commands:
```sh
npm run lint
npm run typecheck
npm run build
```

## Known limitations
- The local PIN gate is a navigation convenience, not secure authentication. Do not enter real credentials or financial data.
- Browser localStorage is not secure storage. This prototype has no server/database.
- Fund transfer and beneficiary details are fictional UI flows only; no real transfer, account verification, or payment record is created.
- Not production-ready until dependencies install, lint/typecheck/build, interaction tests, security review, and device testing have passed.
