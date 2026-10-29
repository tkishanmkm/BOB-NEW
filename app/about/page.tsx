"use client";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

export default function AboutPage() {
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="help" size={32}/><div><p className="eyebrow">APP INFORMATION</p><h1>About Daybook</h1><p className="muted">An independent browser-based finance interface prototype.</p></div></div>
    <section className="card">
      <p className="eyebrow">PROJECT OVERVIEW</p>
      <h2>Daybook · BOB-NEW prototype</h2>
      <p>This project recreates selected screens and interaction patterns inspired by the supplied BOB World app resources. It is an independent demonstration and is not an official Bank of Baroda application or service.</p>
      <div className="notice" role="note"><strong>NOT A BANKING SERVICE.</strong> No bank account is authenticated or verified. The app cannot access bank systems, receive real-time bank alerts, submit bank requests, or transfer real money.</div>
    </section>
    <section className="card"><h2>What this prototype supports</h2><ul><li>Editable sample account profile and transaction records.</li><li>Local transaction history and a statement that can be printed as a sample report.</li><li>Demonstration-only transfer, UPI, QR, card, and beneficiary screens.</li><li>Browser-local data management and supported export/import workflows.</li></ul><p className="muted">Features can vary by screen; a visible demo control does not mean a real banking integration exists.</p></section>
    <section className="card"><h2>Local data and privacy</h2><ul><li>Account and transaction records are intended to be stored in this browser using local browser storage.</li><li>Browser storage is not encrypted merely because it is local. Other people using this browser profile may be able to access its data.</li><li>Exported JSON files may contain personal-looking sample values and should be kept private.</li><li>Clearing browser site data or losing the browser profile may remove locally saved records. Keep a backup only if you understand what it contains.</li></ul><p><Link href="/settings">Open Settings and data management</Link></p></section>
    <section className="card"><h2>Safe use</h2><p>Do not enter real bank passwords, PINs, OTPs, card numbers, CVVs, or other credentials. Do not rely on balances, payment results, QR previews, or notifications from this prototype for financial decisions.</p><div className="actions"><Link className="btn secondary" href="/security">Security information</Link><Link className="btn secondary" href="/help-support">Help &amp; Support</Link><Link className="btn secondary" href="/dashboard">Back to overview</Link></div></section>
    <p className="muted">No official bank affiliation or production banking integration is represented by this page.</p>
  </Shell>;
}
