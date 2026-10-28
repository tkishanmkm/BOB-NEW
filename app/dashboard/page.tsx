"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { read, balance, money, type State } from "@/lib/demo";

const primaryActions = [
  { icon: "↗", title: "Fund transfer", detail: "Review a sample transfer", href: "/transfers" },
  { icon: "▤", title: "Passbook", detail: "Search sample activity", href: "/passbook" },
  { icon: "♙", title: "Beneficiaries", detail: "Manage saved demo payees", href: "/payees" },
  { icon: "▣", title: "Account details", detail: "View your sample profile", href: "/account-details" },
  { icon: "▧", title: "Account statement", detail: "Review a demo statement", href: "/statement" },
  { icon: "⚙", title: "Settings", detail: "Edit sample workspace data", href: "/settings" },
];

const exploreActions = [
  { icon: "▤", title: "Bill payments", href: "/bill-pay" },
  { icon: "▣", title: "Cards", href: "/cards" },
  { icon: "⌕", title: "UPI", href: "/upi" },
  { icon: "◷", title: "Fixed deposit", href: "/fixed-deposit" },
  { icon: "◇", title: "Offers", href: "/offers" },
  { icon: "?", title: "Help & support", href: "/help-support" },
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

  const recent = s.transactions.slice().reverse().slice(0, 5);

  return <Shell>
    <div className="dashboard-heading">
      <div><p className="eyebrow">YOUR FINANCIAL WORKSPACE</p><h1>Hello, {s.name}</h1><p className="muted">A clear view of your sample account and recent activity.</p></div>
      <Link className="btn dashboard-outline" href="/account-details">View account details →</Link>
    </div>

    <section className="card balance dashboard-balance" aria-label="Sample balance">
      <div className="balance-top"><div><p className="balance-caption">Sample available balance</p><h2>{money(balance(s))}</h2><p className="balance-account">{s.accountLabel} <span>·</span> {s.maskedId}</p></div><span className="balance-mark" aria-hidden="true">◈</span></div>
      <div className="balance-foot"><span>● Fictional demo data</span><Link href="/statement">View statement ↗</Link></div>
    </section>

    <section className="dashboard-section">
      <div className="section-heading"><div><h2>Quick actions</h2><p className="muted">Common tasks, all within this demo workspace.</p></div></div>
      <div className="dashboard-action-grid">{primaryActions.map(a => <Link className="dashboard-action" href={a.href} key={a.title}><span className="dashboard-action-icon" aria-hidden="true">{a.icon}</span><span className="dashboard-action-copy"><strong>{a.title}</strong><small>{a.detail}</small></span><span className="action-arrow" aria-hidden="true">→</span></Link>)}</div>
    </section>

    <section className="dashboard-section">
      <div className="section-heading"><div><h2>Explore services</h2><p className="muted">Feature previews based on the source app's route map.</p></div><Link href="/more">View all →</Link></div>
      <div className="dashboard-explore-grid">{exploreActions.map(a => <Link className="dashboard-explore" href={a.href} key={a.title}><span aria-hidden="true">{a.icon}</span><strong>{a.title}</strong><span aria-hidden="true">↗</span></Link>)}</div>
    </section>

    <section className="card dashboard-recent">
      <div className="section-heading"><div><h2>Recent activity</h2><p className="muted">Latest sample entries stored in this browser.</p></div><Link href="/passbook">Open Passbook →</Link></div>
      {recent.length ? recent.map(t => <div className="row dashboard-transaction" key={t.id}><span className="transaction-symbol" aria-hidden="true">{t.type === "credit" ? "↓" : "↑"}</span><span className="transaction-description"><strong>{t.description}</strong><small className="muted">{t.date} · {t.status === "pending" ? "Pending simulation — not paid" : "Sample entry"}</small></span><b className={t.type === "credit" ? "credit-value" : ""}>{t.type === "credit" ? "+" : "−"}{money(t.amount)}</b></div>) : <p className="muted">No activity yet. Sample entries will appear here when added.</p>}
    </section>
    <p className="dashboard-disclaimer">Demo only: balances and transactions are fictional and do not represent real funds or completed payments.</p>
  </Shell>;
}
