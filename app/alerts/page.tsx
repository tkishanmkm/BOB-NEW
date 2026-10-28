"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { read, money, type State } from "@/lib/demo";

export default function AlertsPage() {
  const [state, setState] = useState<State>(read());
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const pending = state.transactions.filter(t => t.status === "pending");
  const recent = state.transactions.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,8);
  const sampleBalance = state.openingBalance + state.transactions.filter(t=>t.status==="posted").reduce((n,t)=>n+(t.type==="credit"?t.amount:-t.amount),0);
  return <Shell>
    <div className="page-heading"><div><h1>Alerts & activity</h1><p className="muted">Local alerts calculated from sample records saved in this browser.</p></div><Link className="btn secondary" href="/settings">Manage data</Link></div>
    <div className="notice">SAMPLE WORKSPACE — these are local demo notices, not bank or payment-network alerts.</div>
    <section className="grid">
      <div className="card"><span className="muted">Pending records</span><h2>{pending.length}</h2><p className="muted">Items marked pending in this browser.</p></div>
      <div className="card"><span className="muted">Saved transactions</span><h2>{state.transactions.length}</h2><p className="muted">Local records across all dates.</p></div>
      <div className="card"><span className="muted">Calculated sample balance</span><h2>{money(sampleBalance)}</h2><p className="muted">Based only on the saved opening balance and posted sample records.</p></div>
    </section>
    <section className="card"><h2>Pending record alerts</h2>{pending.length ? pending.map(t=><div className="row" key={t.id}><div><b>{t.description}</b><small className="muted">{t.date} · Ref {t.id}</small></div><b>{t.type==="credit"?"+":"−"}{money(t.amount)}</b></div>) : <p className="muted">No pending sample records.</p>}</section>
    <section className="card"><h2>Recent activity</h2>{recent.length ? recent.map(t=><div className="row" key={t.id}><div><b>{t.description}</b><small className="muted">{t.date} · {t.status} · {t.type}</small></div><Link href={"/receipt?id="+encodeURIComponent(t.id)}>View record</Link></div>) : <p className="muted">No records saved yet.</p>}<div className="actions"><Link className="btn secondary" href="/passbook">Open transactions</Link><Link className="btn secondary" href="/statement">Open statement</Link></div></section>
  </Shell>;
}