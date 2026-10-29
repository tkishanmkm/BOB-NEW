"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, money, balance, sortTransactionsNewestFirst, type State } from "@/lib/demo";

export default function StatementAnalysisPage() {
  const [state, setState] = useState<State>(read());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [kind, setKind] = useState<"all" | "credit" | "debit">("all");
  useEffect(() => {
    let active = true;
    const refresh = () => setState(read());
    hydrate().then(() => { if (active) { refresh(); setReady(true); } }).catch(() => { if (active) setFailed(true); });
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const invalidRange = Boolean(from && to && from > to);
  const rows = useMemo(() => sortTransactionsNewestFirst(state.transactions)
    .filter(tx => !invalidRange && (!from || tx.date >= from) && (!to || tx.date <= to))
    .filter(tx => kind === "all" || tx.type === kind), [state.transactions, from, to, kind, invalidRange]);
  const posted = rows.filter(tx => tx.status === "posted");
  const credits = posted.filter(tx => tx.type === "credit").reduce((sum, tx) => sum + tx.amount, 0);
  const debits = posted.filter(tx => tx.type === "debit").reduce((sum, tx) => sum + tx.amount, 0);
  const pending = rows.filter(tx => tx.status === "pending").length;
  const average = posted.length ? posted.reduce((sum, tx) => sum + tx.amount, 0) / posted.length : 0;
  if (failed) return <Shell><section className="card"><h1>Statement analysis unavailable</h1><p className="error" role="alert">Saved account data could not be loaded. Analysis is hidden to avoid showing unverified defaults. Check browser storage and retry.</p><button type="button" onClick={() => window.location.reload()}>Retry</button></section></Shell>;
  if (!ready) return <Shell><section className="card" role="status"><h1>Loading statement analysis</h1><p className="muted">Reading saved local transaction data…</p></section></Shell>;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="statement" size={30}/><div><p className="eyebrow">ACCOUNT ACTIVITY</p><h1>Statement analysis</h1><p className="muted">Summaries calculated from the locally saved sample transaction records.</p></div></div>
    <div className="notice" role="note">SAMPLE DATA ONLY — these figures are not bank-confirmed. Pending simulation entries are excluded from posted credit/debit totals and from the average transaction amount.</div>
    <section className="card"><h2>Current sample balance</h2><p className="metric-value">{money(balance(state))}</p><p className="muted">Calculated from opening balance and posted sample entries across the saved transaction list.</p><Link href="/statement" className="btn secondary">Open statement</Link></section>
    <section className="card"><h2>Filter analysis period</h2><div className="field-grid">
      <label className="field">From date<input type="date" value={from} max={to || undefined} onChange={e=>setFrom(e.target.value)}/></label>
      <label className="field">To date<input type="date" value={to} min={from || undefined} onChange={e=>setTo(e.target.value)}/></label>
      <label className="field">Transaction type<select value={kind} onChange={e=>setKind(e.target.value as "all"|"credit"|"debit")}><option value="all">All types</option><option value="credit">Credits</option><option value="debit">Debits</option></select></label>
    </div><div className="actions"><button className="btn secondary" type="button" onClick={()=>{setFrom("");setTo("");setKind("all")}}>Clear filters</button><Link className="btn secondary" href="/passbook">Search passbook</Link></div>{invalidRange&&<p className="error" role="alert">Choose a valid range: the start date must be on or before the end date.</p>}</section>
    <div className="feature-grid">
      <section className="card"><p className="muted">Posted credits in range</p><h2 className="amount-credit">{money(credits)}</h2></section>
      <section className="card"><p className="muted">Posted debits in range</p><h2 className="amount-debit">{money(debits)}</h2></section>
      <section className="card"><p className="muted">Net posted movement</p><h2>{money(credits-debits)}</h2></section>
      <section className="card"><p className="muted">Average posted transaction</p><h2>{money(average)}</h2><small className="muted">Based on {posted.length} posted entries</small></section>
      <section className="card"><p className="muted">Matching entries</p><h2>{rows.length}</h2><small className="muted">{pending} pending simulation(s)</small></section>
    </div>
    <section className="card"><div className="section-heading"><div><h2>Entries in this range</h2><p className="muted">Newest first · {rows.length} matching records</p></div><ApkAssetIcon asset="passbook" size={24}/></div>
      {rows.length===0?<p className="muted">No transactions match these filters.</p>:rows.slice(0,20).map(tx=><div className="passbook-row" key={tx.id}><span className={"passbook-transaction-symbol "+(tx.type==="credit"?"credit":"debit")}>{tx.type==="credit"?"↓":"↑"}</span><span className="passbook-transaction-copy"><strong>{tx.description}</strong><small className="passbook-row-meta">{tx.date} · {tx.status==="pending"?"Pending simulation — not paid":"Posted sample entry"}</small><small className="passbook-row-meta"><Link href={"/receipt?id="+encodeURIComponent(tx.id)}>View sample receipt</Link></small></span><strong className={tx.type==="credit"?"amount-credit":"amount-debit"}>{tx.type==="credit"?"+":"−"}{money(tx.amount)}</strong></div>)}
      {rows.length>20&&<p className="muted">Showing the latest 20 matching entries. Open Passbook to browse the full filtered history.</p>}
    </section>
  </Shell>;
}
