"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { read, money, sortTransactionsNewestFirst, type State } from "@/lib/demo";

type Filter = "all" | "credit" | "debit";
type StatusFilter = "all" | "posted" | "pending";

export default function Passbook() {
  const [state, setState] = useState<State>(read());
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<Filter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const invalidRange = Boolean(from && to && from > to);
  const transactions = useMemo(() => sortTransactionsNewestFirst(state.transactions)
    .filter(tx => !invalidRange && (!from || tx.date >= from) && (!to || tx.date <= to))
    .filter(tx => type === "all" || tx.type === type)
    .filter(tx => status === "all" || tx.status === status)
    .filter(tx => !query.trim() || tx.description.toLowerCase().includes(query.trim().toLowerCase()) || tx.date.includes(query.trim()) || tx.id.toLowerCase().includes(query.trim().toLowerCase())), [state.transactions, query, from, to, type, status, invalidRange]);
  const credits = transactions.filter(tx => tx.type === "credit" && tx.status === "posted").reduce((sum, tx) => sum + tx.amount, 0);
  const debits = transactions.filter(tx => tx.type === "debit" && tx.status === "posted").reduce((sum, tx) => sum + tx.amount, 0);
  function clearFilters() { setQuery(""); setFrom(""); setTo(""); setType("all"); setStatus("all"); }
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="passbook" size={30}/><div><p className="eyebrow">ACCOUNT ACTIVITY</p><h1>Passbook</h1><p className="muted">Search and review transaction records saved in this browser.</p></div></div>
    <div className="notice">SAMPLE WORKSPACE — pending simulation entries are not completed payments. Only posted sample entries contribute to the calculated balance.</div>
    <section className="card passbook-summary">
      <div><span className="muted">Account</span><strong>{state.accountLabel}</strong><small>{(() => { const value = state.accountNumber || state.maskedId; const digits = value.replace(/\D/g, ""); return digits.length >= 4 ? "•••• " + digits.slice(-4) : value ? "••••" : "Not set"; })()}</small></div>
      <div><span className="muted">Posted credits in results</span><strong className="amount-credit">{money(credits)}</strong></div>
      <div><span className="muted">Posted debits in results</span><strong className="amount-debit">{money(debits)}</strong></div>
    </section>
    <section className="card passbook-search-card">
      <div className="passbook-filter-grid">
        <label className="field">Search description, date or reference<input value={query} maxLength={120} onChange={e => setQuery(e.target.value)} placeholder="Search transactions"/></label>
        <label className="field">From date<input type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)}/></label>
        <label className="field">To date<input type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)}/></label>
        <label className="field">Transaction type<select value={type} onChange={e => setType(e.target.value as Filter)}><option value="all">All types</option><option value="credit">Credits</option><option value="debit">Debits</option></select></label>
        <label className="field">Status<select value={status} onChange={e => setStatus(e.target.value as StatusFilter)}><option value="all">All statuses</option><option value="posted">Posted sample entries</option><option value="pending">Pending simulations</option></select></label>
      </div>
      <div className="passbook-filter-footer"><p className="muted" aria-live="polite">{invalidRange ? "Choose a valid date range: the start date must be on or before the end date." : `${transactions.length} matching transaction(s).`}</p><button type="button" className="btn secondary" onClick={clearFilters}>Clear filters</button></div>
    </section>
    <section className="card passbook-transactions"><div className="section-title"><div><h2>Transaction history</h2><p className="muted">Newest dates first · sample records only</p></div><ApkAssetIcon asset="statement" size={24}/></div>
      {transactions.length === 0 ? <p className="muted">{invalidRange ? "Adjust the date range to continue." : "No transactions match these filters."}</p> : transactions.map(tx => <div className="passbook-row" key={tx.id}>
        <span className={"passbook-transaction-symbol " + (tx.type === "credit" ? "credit" : "debit")}>{tx.type === "credit" ? "↓" : "↑"}</span>
        <span className="passbook-transaction-copy"><Link href={"/receipt?id=" + encodeURIComponent(tx.id)}>{tx.description}</Link><small className="passbook-row-meta">{tx.date} · <span className={"passbook-status-chip " + tx.status}>{tx.status === "pending" ? "Pending simulation · not paid" : "Posted sample entry"}</span></small><small className="passbook-row-meta">Ref: <span className="passbook-reference">{tx.id}</span> · <Link href={"/receipt?id=" + encodeURIComponent(tx.id)}>View sample receipt</Link></small></span>
        <strong className={tx.type === "credit" ? "amount-credit" : "amount-debit"}>{tx.type === "credit" ? "+" : "−"}{money(tx.amount)}</strong>
      </div>)}
    </section>
  </Shell>;
}
