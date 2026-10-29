"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, balance, money, type State } from "@/lib/demo";

const items = [
  { title: "Account details", detail: "Review the saved sample profile.", href: "/account-details", icon: "account" as const },
  { title: "Statement", detail: "Filter and print a local sample report.", href: "/statement", icon: "statement" as const },
  { title: "Transaction history", detail: "Browse records saved in this browser.", href: "/passbook", icon: "passbook" as const },
  { title: "Beneficiaries", detail: "Review locally saved sample beneficiaries.", href: "/payees", icon: "beneficiaries" as const },
  { title: "Transfer simulation", detail: "Explore the offline demo flow.", href: "/transfers", icon: "transfer" as const },
  { title: "Settings and backups", detail: "Edit sample values and manage local data.", href: "/settings", icon: "settings" as const },
  { title: "Alerts and activity", detail: "Review pending demo records.", href: "/alerts", icon: "alerts" as const },
  { title: "Security information", detail: "Review prototype security limitations.", href: "/security", icon: "security" as const },
];

export default function AccountActionsPage() {
  const [state, setState] = useState<State>(read());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => setState(read());
    void hydrate().then(() => { if (active) { refresh(); setReady(true); } }).catch(() => { if (active) setFailed(true); });
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  if (failed) return <Shell><section className="card"><h1>Account actions unavailable</h1><p className="error" role="alert">Saved browser data could not be loaded. Reload after checking browser storage.</p><button onClick={() => window.location.reload()}>Retry</button></section></Shell>;
  if (!ready) return <Shell><section className="card" role="status"><h1>Loading account actions</h1><p className="muted">Loading saved sample data…</p></section></Shell>;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={32}/><div><p className="eyebrow">ACCOUNT SERVICES</p><h1>Account actions</h1><p className="muted">Shortcuts for the sample account in this browser.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This independent prototype is not connected to bank systems. Values are editable sample data; no action here can change a real account or send money.</div>
    <section className="card">
      <div className="section-title"><div><h2>{state.accountLabel || "Sample account"}</h2><p className="muted">{state.name || "Account holder"} · {state.maskedId || "Identifier not set"}</p></div><ApkAssetIcon asset="account" size={28}/></div>
      <div className="grid"><div className="field"><span className="muted">Calculated sample balance</span><strong>{money(balance(state))}</strong></div><div className="field"><span className="muted">Saved transactions</span><strong>{state.transactions.length}</strong></div><div className="field"><span className="muted">Pending simulations</span><strong>{state.transactions.filter(t => t.status === "pending").length}</strong></div></div>
      <p className="muted">Balance is calculated from the opening balance and posted sample transactions.</p>
    </section>
    <section className="grid">{items.map(item => <article className="card" key={item.href}><div className="section-title"><ApkAssetIcon asset={item.icon} size={28}/><h2>{item.title}</h2></div><p className="muted">{item.detail}</p><Link className="btn secondary" href={item.href}>Open</Link></article>)}</section>
  </Shell>;
}
