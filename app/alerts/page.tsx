"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, money, type State } from "@/lib/demo";

export default function AlertsPage() {
  const [state, setState] = useState<State>(read());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = () => setState(read());
    void hydrate().then(() => {
      if (!active) return;
      refresh();
      setReady(true);
    }).catch(() => {
      if (active) setLoadError("Saved account data could not be safely loaded. Alerts are hidden to avoid showing unverified default data. Check browser storage and reload.");
    });
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const pending = useMemo(() => state.transactions.filter(t => t.status === "pending").sort((a,b) => b.date.localeCompare(a.date)), [state.transactions]);
  const recent = useMemo(() => state.transactions.slice().sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 8), [state.transactions]);
  const sampleBalance = state.openingBalance + state.transactions.filter(t => t.status === "posted").reduce((n,t) => n + (t.type === "credit" ? t.amount : -t.amount), 0);
  if (loadError) return <Shell><section className="card"><h1>Alerts unavailable</h1><p className="error" role="alert">{loadError}</p><button type="button" onClick={() => window.location.reload()}>Retry</button></section></Shell>;
  if (!ready) return <Shell><section className="card" role="status"><h1>Loading alerts</h1><p className="muted">Loading saved sample transactions from this browser…</p></section></Shell>;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="alerts" size={32}/><div><p className="eyebrow">ACCOUNT ACTIVITY</p><h1>Alerts &amp; activity</h1><p className="muted">Local notices derived from saved sample transactions.</p></div><Link className="btn secondary" href="/settings">Manage data</Link></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> These notices are calculated from browser records. They are not bank notifications, payment confirmations, fraud monitoring, or real-time account alerts.</div>
    <section className="grid">
      <div className="card"><span className="muted">Pending records</span><h2>{pending.length}</h2><p className="muted">Saved transactions marked pending.</p></div>
      <div className="card"><span className="muted">Saved transactions</span><h2>{state.transactions.length}</h2><p className="muted">Local records across all dates.</p></div>
      <div className="card"><span className="muted">Calculated sample balance</span><h2>{money(sampleBalance)}</h2><p className="muted">Opening balance adjusted by posted sample records only.</p></div>
    </section>
    <section className="card"><div className="section-title"><div><h2>Pending record alerts</h2><p className="muted">These items are marked pending in your local data.</p></div><ApkAssetIcon asset="alerts" size={24}/></div>
      {pending.length ? pending.map(t => <div className="row" key={t.id}><div><b>{t.description}</b><small className="muted">{t.date} · Ref {t.id}</small></div><b>{t.type === "credit" ? "+" : "−"}{money(t.amount)}</b></div>) : <p className="muted">No pending sample records.</p>}
    </section>
    <section className="card"><h2>Recent activity</h2>
      {recent.length ? recent.map(t => <div className="row" key={t.id}><div><b>{t.description}</b><small className="muted">{t.date} · {t.status} · {t.type}</small></div><Link href={"/receipt?id=" + encodeURIComponent(t.id)}>View record</Link></div>) : <p className="muted">No transactions saved yet.</p>}
      <div className="actions"><Link className="btn secondary" href="/passbook">Open transactions</Link><Link className="btn secondary" href="/statement">Open statement</Link><Link className="btn secondary" href="/help-support">Help &amp; Support</Link></div>
    </section>
  </Shell>;
}
