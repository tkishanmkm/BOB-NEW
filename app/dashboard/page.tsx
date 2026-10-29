"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon, type AssetKey } from "@/components/apk-asset-map";
import { read, balance, money, maskAccountIdentifier, sortTransactionsNewestFirst, type State } from "@/lib/demo";

const primaryActions: { icon: AssetKey; title: string; detail: string; href: string }[] = [
  { icon: "transfer", title: "Fund transfer", detail: "Create and review a transfer", href: "/transfers" },
  { icon: "passbook", title: "Passbook", detail: "Search account activity", href: "/passbook" },
  { icon: "beneficiaries", title: "Beneficiaries", detail: "Manage saved recipients", href: "/payees" },
  { icon: "account", title: "Account details", detail: "View your account profile", href: "/account-details" },
  { icon: "statement", title: "Account statement", detail: "Review account activity", href: "/statement" },
  { icon: "settings", title: "Settings", detail: "Manage profile and records", href: "/settings" },
];

const exploreActions: { icon: AssetKey; title: string; href: string }[] = [
  { icon: "billPay", title: "Bill payments", href: "/bill-pay" },
  { icon: "cards", title: "Cards", href: "/cards" },
  { icon: "upi", title: "UPI", href: "/upi" },
  { icon: "fixedDeposit", title: "Fixed deposit", href: "/fixed-deposit" },
  { icon: "offers", title: "Offers", href: "/offers" },
  { icon: "help", title: "Help & support", href: "/help-support" },
];

export default function Dashboard() {
  const [s, S] = useState<State>(read());
  useEffect(() => {
    const refresh = () => S(read());
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const recent = sortTransactionsNewestFirst(s.transactions).slice(0, 5);

  return <Shell>
    <div className="dashboard-brand-strip" aria-label="BOB World original APK brand asset, displayed in a local demo">
      <Image src="/assets/bob-world/original-assets/assets/images/dashBoard/bobWorldNTitle.svg" alt="BOB World branding reference" width={200} height={40} priority />
      <span className="prototype-tag">DEMO</span>
    </div>
    <div className="dashboard-heading">
      <div><p className="eyebrow">YOUR ACCOUNT OVERVIEW</p><h1>Hello, {s.name}</h1><p className="muted">Review your account information, balances and recent activity.</p></div>
      <Link className="btn dashboard-outline" href="/account-details">View account details →</Link>
    </div>

    <section className="dashboard-source-banner" aria-label="Local demo account workspace banner">
      <Image
        className="dashboard-source-banner-art"
        src="/assets/bob-world/original-assets/assets/images/dashBoard/bob_bg.png"
        alt=""
        aria-hidden="true"
        width={1200}
        height={420}
        sizes="(max-width: 650px) 100vw, 1100px"
      />
      <div className="dashboard-source-banner-copy">
        <p className="eyebrow">ACCOUNT WORKSPACE · DEMO</p>
        <h2>Your accounts, activity and services</h2>
        <p>Explore this local prototype. No bank connection or real payments.</p>
      </div>
    </section>

    <section className="card balance dashboard-balance" aria-label="Available sample balance">
      <div className="balance-top"><div><p className="balance-caption">Available sample balance</p><h2>{money(balance(s))}</h2><p className="balance-account">{s.accountLabel} <span>·</span> {maskAccountIdentifier(s.accountNumber || s.maskedId)}</p></div><span className="balance-mark" aria-hidden="true">◈</span></div>
      <div className="balance-foot"><span>● Stored on this device</span><Link href="/statement">View statement ↗</Link></div>
    </section>

    <section className="dashboard-section">
      <div className="section-heading"><div><h2>Quick actions</h2><p className="muted">Frequently used account services.</p></div></div>
      <div className="dashboard-action-grid">{primaryActions.map(a => <Link className="dashboard-action" href={a.href} key={a.title}><ApkAssetIcon asset={a.icon} size={26} className="dashboard-action-icon"/><span className="dashboard-action-copy"><strong>{a.title}</strong><small>{a.detail}</small></span><span className="action-arrow" aria-hidden="true">→</span></Link>)}</div>
    </section>

    <section className="dashboard-section">
      <div className="section-heading"><div><h2>Explore services</h2><p className="muted">More account tools and service areas.</p></div><Link href="/more">View all →</Link></div>
      <div className="dashboard-explore-grid">{exploreActions.map(a => <Link className="dashboard-explore" href={a.href} key={a.title}><ApkAssetIcon asset={a.icon} size={24}/><strong>{a.title}</strong><span aria-hidden="true">↗</span></Link>)}</div>
    </section>

    <section className="card dashboard-recent">
      <div className="section-heading"><div><h2>Recent activity</h2><p className="muted">Latest entries saved in this browser.</p></div><Link href="/passbook">Open Passbook →</Link></div>
      {recent.length ? recent.map(t => <div className="row dashboard-transaction" key={t.id}><span className="transaction-symbol" aria-hidden="true">{t.type === "credit" ? "↓" : "↑"}</span><span className="transaction-description"><strong>{t.description}</strong><small className="muted">{t.date} · {t.status === "pending" ? "Pending — not processed by a bank" : "Recorded locally"}</small></span><b className={t.type === "credit" ? "credit-value" : ""}>{t.type === "credit" ? "+" : "−"}{money(t.amount)}</b></div>) : <p className="muted">No activity yet. Add an entry in Settings to get started.</p>}
    </section>
    <p className="dashboard-disclaimer">Local prototype: account records and transfer results stay in this browser. No bank or payment network is connected, so entries do not move real money.</p>
  </Shell>;
}
