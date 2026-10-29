"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, balance, money, maskAccountIdentifier, type State } from "@/lib/demo";

export default function AllAccountsPage() {
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
  if (failed) return <Shell><section className="card"><h1>Accounts unavailable</h1><p className="error" role="alert">Saved account data could not be loaded. Account information is hidden to avoid showing unverified defaults. Check browser storage, then reload.</p><button type="button" onClick={() => window.location.reload()}>Retry</button></section></Shell>;
  if (!ready) return <Shell><section className="card" role="status"><h1>Loading accounts</h1><p className="muted">Loading saved account data from this browser…</p></section></Shell>;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={32}/><div><p className="eyebrow">MY ACCOUNTS</p><h1>All accounts</h1><p className="muted">Accounts currently represented in this browser workspace.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This prototype currently supports one editable sample account. It does not connect to Bank of Baroda or verify account ownership, balances, or account status.</div>
    <section className="card">
      <div className="section-title"><div><p className="eyebrow">SAVED LOCAL PROFILE</p><h2>{state.accountLabel || "Sample account"}</h2><p className="muted">{state.name || "Account holder"}</p></div><ApkAssetIcon asset="account" size={32}/></div>
      <div className="account-balance-strip"><span>Calculated sample balance</span><strong>{money(balance(state))}</strong><small>Calculated from the saved opening balance and posted sample transactions.</small></div>
      <div className="account-detail-grid">
        <div className="field"><span className="muted">Account identifier (masked)</span><strong>{maskAccountIdentifier(state.accountNumber || state.maskedId)}</strong></div>
        <div className="field"><span className="muted">Customer ID (sample)</span><strong>{state.customerId || "Not set"}</strong></div>
        <div className="field"><span className="muted">Branch (sample)</span><strong>{state.branch || "Not set"}</strong></div>
        <div className="field"><span className="muted">Account type label</span><strong>{state.accountLabel || "Not set"}</strong></div>
        <div className="field"><span className="muted">Posted entries</span><strong>{state.transactions.filter(t => t.status === "posted").length}</strong></div>
        <div className="field"><span className="muted">Pending simulations</span><strong>{state.transactions.filter(t => t.status === "pending").length}</strong></div>
      </div>
      <div className="actions"><Link className="btn" href="/account-details">View account details</Link><Link className="btn secondary" href="/settings">Edit in Settings</Link><Link className="btn secondary" href="/statement">View statement</Link></div>
    </section>
    <section className="card"><h2>Need another account?</h2><p className="muted">Multi-account profiles are not implemented. This screen intentionally does not invent extra accounts or duplicate the current profile.</p><Link className="btn secondary" href="/help-support">Help &amp; Support</Link></section>
  </Shell>;
}
