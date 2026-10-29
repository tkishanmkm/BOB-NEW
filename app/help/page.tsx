"use client";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const topics = [
  { title: "Account and profile", detail: "Update the sample account profile and review the contact details stored in this browser.", links: [{ label: "Account details", href: "/account-details" }, { label: "Contact details", href: "/contact-details" }, { label: "Settings", href: "/settings" }] },
  { title: "Transactions and statements", detail: "Browse local sample transactions, filter history, and view or print a demo statement.", links: [{ label: "Passbook", href: "/passbook" }, { label: "Statement", href: "/statement" }, { label: "Statement analysis", href: "/statement-analysis" }] },
  { title: "Payments and beneficiaries", detail: "Transfer, UPI, QR, and bill-payment screens are simulations. They do not move money or contact a payment network.", links: [{ label: "Fund transfer", href: "/transfers" }, { label: "Beneficiaries", href: "/payees" }, { label: "UPI", href: "/upi" }, { label: "Scan & Pay", href: "/scan" }] },
  { title: "Security and PINs", detail: "Demo PIN controls are local prototype features, not secure bank authentication. Never enter a real PIN or one-time code.", links: [{ label: "Security", href: "/security" }, { label: "Change login PIN", href: "/change-login-pin" }, { label: "Change transaction PIN", href: "/change-transaction-pin" }] },
  { title: "Data backup and recovery", detail: "Use the shared Settings screen to export or import supported JSON files. Keep backups private and do not clear site data if you are trying to recover saved records.", links: [{ label: "Data management", href: "/settings" }, { label: "App settings", href: "/app-settings" }] },
];

export default function HelpPage() {
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="help" size={30}/><div><p className="eyebrow">HELP CENTRE</p><h1>Help</h1><p className="muted">Guidance for using this local finance interface prototype.</p></div></div>
    <div className="info-banner" role="note"><span aria-hidden="true">ⓘ</span><div><strong>Prototype support only</strong><br/>This app is not connected to Bank of Baroda or any payment network. Local support screens do not create bank tickets and no live agent is connected.</div></div>
    <div className="service-directory">{topics.map(topic => <section className="card" key={topic.title}><h2>{topic.title}</h2><p>{topic.detail}</p><div className="actions">{topic.links.map(link => <Link className="btn secondary" href={link.href} key={link.href}>{link.label}</Link>)}</div></section>)}</div>
    <section className="card"><h2>Common questions</h2><p><strong>Why does a balance not match my bank?</strong><br/>Balances and transaction records shown here are calculated from sample data saved in this browser. They are not fetched from a bank.</p><p><strong>Did a transfer or request go through?</strong><br/>No real transfer or bank request is submitted by this prototype. Treat any confirmation as a local simulation only.</p><p><strong>Where can I find more answers?</strong><br/><Link href="/faqs">Open Frequently Asked Questions</Link> or <Link href="/help-support">open the local Help &amp; Support screen</Link>.</p></section>
    <section className="card"><h2>Protect your information</h2><ul><li>Never enter real bank passwords, PINs, OTPs, card numbers, CVVs, or identity documents.</li><li>Browser-local data may be visible to other people using the same browser profile and is not automatically encrypted.</li><li>JSON backups can contain profile and transaction values. Store exported files securely.</li></ul><div className="actions"><Link className="btn secondary" href="/security">Review security guidance</Link><Link className="btn secondary" href="/about">About this prototype</Link></div></section>
  </Shell>;
}
