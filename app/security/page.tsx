"use client";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

export default function SecurityPage() {
  return <Shell>
    <div className="page-heading apk-page-heading">
      <ApkAssetIcon asset="security" size={30} />
      <div><p className="eyebrow">LOCAL WORKSPACE</p><h1>Security</h1><p className="muted">Review the demo access settings and safe-use guidance for this browser-based prototype.</p></div>
    </div>
    <div className="notice" role="note"><strong>Prototype security only.</strong> This application does not provide bank-grade authentication or secure storage for banking credentials. Never enter your real banking PIN, password, OTP, card PIN, or transaction PIN.</div>
    <section className="card">
      <h2>Demo access PINs</h2>
      <p className="muted">These controls update local prototype values only. They do not change credentials at a bank or authorize a payment.</p>
      <div className="actions">
        <Link className="btn" href="/change-login-pin">Change login demo PIN</Link>
        <Link className="btn secondary" href="/change-transaction-pin">Manage transaction demo PIN</Link>
      </div>
    </section>
    <section className="card">
      <h2>Protect your sample data</h2>
      <ul>
        <li>Use fictional account and beneficiary details only.</li>
        <li>Browser storage may be cleared, copied, or accessed by someone who can use this browser profile.</li>
        <li>Exported JSON backups may contain profile and transaction sample data; keep them private and delete copies you no longer need.</li>
        <li>A PIN configured here is demo data, not encryption and not a substitute for device security.</li>
      </ul>
      <div className="actions"><Link className="btn secondary" href="/settings">Open Settings and data management</Link><Link className="btn secondary" href="/help-support">Help and support</Link></div>
    </section>
  </Shell>;
}
