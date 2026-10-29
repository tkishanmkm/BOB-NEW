"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, balance, money, maskAccountIdentifier, type State } from "@/lib/demo";

export default function AccountDetailsPage() {
  const [state, setState] = useState<State>(read());
  const [stateReady, setStateReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => setState(read());
    void hydrate().then(() => {
      if (!active) return;
      refresh();
      setStateReady(true);
    }).catch(() => {
      if (active) setLoadError(true);
    });
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const posted = state.transactions.filter(t => t.status === "posted").length;
  const pending = state.transactions.filter(t => t.status === "pending").length;
  if (loadError) return <Shell><section className="card"><h1>Account details unavailable</h1><p className="error" role="alert">Saved account data could not be loaded. Account information is hidden to avoid showing unverified defaults. Check browser storage, then reload.</p><button type="button" onClick={() => window.location.reload()}>Retry</button></section></Shell>;
  if (!stateReady) return <Shell><section className="card" role="status"><h1>Loading account details</h1><p className="muted">Loading saved account data from this browser…</p></section></Shell>;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={30}/><div><p className="eyebrow">MY ACCOUNTS</p><h1>Account details</h1><p className="muted">Review the profile values stored in this browser workspace.</p></div></div>
    <div className="notice">SAMPLE ACCOUNT ONLY — these details are fictional and are not verified by a financial institution.</div>
    <section className="card account-overview">
      <div className="account-overview-top"><div className="account-avatar"><ApkAssetIcon asset="account" size={34}/></div><div><span className="muted">Account label</span><h2>{state.accountLabel}</h2><p>{state.name} · {maskAccountIdentifier(state.accountNumber || state.maskedId)}</p></div></div>
      <div className="account-balance-strip"><span>Calculated sample balance</span><strong>{money(balance(state))}</strong><small>Based on opening balance and posted sample transactions</small></div>
      <div className="account-stats"><div><strong>{posted}</strong><span>Posted entries</span></div><div><strong>{pending}</strong><span>Pending simulations</span></div><div><strong>{state.transactions.length}</strong><span>Total entries</span></div></div>
    </section>
    <section className="card"><div className="section-title"><div><h2>Account information</h2><p className="muted">Edit sample values from Settings.</p></div><ApkAssetIcon asset="profile" size={24}/></div>
      <div className="account-detail-grid">
        <Detail label="Display name" value={state.name}/><Detail label="Account identifier" value={maskAccountIdentifier(state.accountNumber || state.maskedId)}/>
        <Detail label="Account number (masked sample)" value={maskAccountIdentifier(state.accountNumber)}/><Detail label="Customer ID (sample)" value={state.customerId || "Not set"}/>
        <Detail label="Branch (sample)" value={state.branch || "Not set"}/><Detail label="IFSC-format code (sample)" value={state.ifsc || "Not set"}/>
        <Detail label="Date of birth (sample)" value={state.dob || "Not set"}/><Detail label="PAN placeholder (sample)" value={state.panNumber || "Not set"}/>
        <Detail label="Mobile (sample)" value={state.mobile || "Not set"}/><Detail label="Email (sample)" value={state.email || "Not set"}/>
        <Detail label="Address (sample)" value={state.address || "Not set"}/><Detail label="Opening balance" value={money(state.openingBalance)}/>
      </div>
      <div className="actions"><Link className="btn" href="/settings">Edit sample account</Link><Link className="btn secondary" href="/statement">View statement</Link><Link className="btn secondary" href="/passbook">Open passbook</Link></div>
    </section>
    <section className="card account-local-note"><h2>About this workspace</h2><p>This independent Next.js prototype stores sample data in this browser. It does not verify account ownership, contact a bank, or provide secure banking authentication.</p></section>
  </Shell>;
}
function Detail({label,value}:{label:string;value:string}) { return <div className="account-detail-item"><span>{label}</span><strong>{value}</strong></div>; }
