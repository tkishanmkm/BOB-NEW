# BOB-NEW — Independent Finance Workspace

This is a separate, independently branded finance-workspace prototype. It does not modify or copy the branded interface of BOB-WORLD and does not connect to real banking or payment systems.

## Current implementation
- Next.js App Router, React, and TypeScript foundation.
- Routes: local access gate, overview, transactions, settings, transfer preview, and account-summary preview.
- One shared browser-local state model for sample profile, account display, opening balance, and transactions.
- Schema validation for imported JSON, duplicate transaction-ID rejection, and date/amount/type/status checks.
- Settings supports editing, adding/removing transactions, JSON import, and JSON export.
- Dashboard balance includes posted transactions only; pending transactions are excluded.
- Transfer page only previews intent; it does not create or send payments.
- Printable account summary always displays **DEMO — NOT A BANK-ISSUED DOCUMENT**.

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

## Important limitations
- The local PIN gate is only a navigation convenience, not secure authentication. Do not enter real credentials or financial data.
- Browser localStorage is not secure storage and this prototype has no server/database.
- No real banking, identity verification, or payment rails are connected.
- Not production-ready until dependency installation, lint, typecheck, build, interaction tests, security review, and device testing have passed.
- UI/assets from the reference APK have not been copied; exact screen-by-screen mapping remains separate work.
