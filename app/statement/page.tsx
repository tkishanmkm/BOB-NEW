"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { read, money, type State } from "@/lib/demo";

export default function StatementPage() {
  const [state, setState] = useState<State>(read());
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<"all" | "credit" | "debit">("all");
  const [status, setStatus] = useState<"all" | "posted" | "pending">("all");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const rows = useMemo(() => state.transactions.map((tx, index) => ({ tx, index }))
    .filter(({ tx }) => !(from && to && from > to) && (!from || tx.date >= from)).filter(({ tx }) => !to || tx.date <= to)
    .filter(({ tx }) => type === "all" || tx.type === type).filter(({ tx }) => status === "all" || tx.status === status)
    .sort((a, b) => b.tx.date.localeCompare(a.tx.date) || b.index - a.index).map(({ tx }) => tx), [state.transactions, from, to, type, status]);
  const credits = rows.filter(t => t.type === "credit" && t.status === "posted").reduce((n,t) => n + t.amount, 0);
  const debits = rows.filter(t => t.type === "debit" && t.status === "posted").reduce((n,t) => n + t.amount, 0);
  const closing = state.openingBalance + state.transactions.filter(t => t.status === "posted" && (!to || t.date <= to)).reduce((n,t) => n + (t.type === "credit" ? t.amount : -t.amount),0);
  function clearFilters() { setFrom(""); setTo(""); setType("all"); setStatus("all"); setMessage(""); }
  function printStatement() {
    if (from && to && from > to) { setMessage("Start date must be on or before end date."); return; }
    setMessage("");
    window.print();
  }
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="statement" size={30}/><div><p className="eyebrow">ACCOUNT SERVICES</p><h1>Account statement</h1><p className="muted">Filter activity and print a local sample report.</p></div><button type="button" className="statement-print-button" onClick={printStatement} disabled={Boolean(from && to && from > to)}>Print / Save PDF</button></div>
    <div className="notice">DEMO — NOT A BANK-ISSUED STATEMENT. This report is generated from editable sample data in this browser.</div>
    <section className="card no-print statement-filters"><div className="section-title"><div><h2>Search transactions</h2><p className="muted">Choose a date range and transaction filters.</p></div><ApkAssetIcon asset="passbook" size={24}/></div>
      <div className="passbook-filter-grid">
        <label className="field">From date<input type="date" max={to || undefined} value={from} onChange={e=>setFrom(e.target.value)}/></label>
        <label className="field">To date<input type="date" min={from || undefined} value={to} onChange={e=>setTo(e.target.value)}/></label>
        <label className="field">Transaction type<select value={type} onChange={e=>setType(e.target.value as typeof type)}><option value="all">All types</option><option value="credit">Credits</option><option value="debit">Debits</option></select></label>
        <label className="field">Status<select value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">All statuses</option><option value="posted">Posted sample entries</option><option value="pending">Pending simulations</option></select></label>
      </div>
      {from && to && from > to && <p role="alert" className="error">Start date must be on or before end date.</p>}{message && <p role="alert" className="error">{message}</p>}<div className="passbook-filter-footer"><p className="muted" aria-live="polite">{from && to && from > to ? "Correct the date range to view results." : `${rows.length} matching transaction(s).`}</p><button type="button" className="btn secondary" onClick={clearFilters}>Clear filters</button></div>
    </section>
    <section className="statement-summary-grid">
      <div className="card statement-summary-item"><span>Posted credits in results</span><strong className="amount-credit">{money(credits)}</strong></div>
      <div className="card statement-summary-item"><span>Posted debits in results</span><strong className="amount-debit">{money(debits)}</strong></div>
      <div className="card statement-summary-item"><span>Calculated sample balance</span><strong>{money(closing)}</strong></div>
    </section>
    <section className="card statement-document">
      <div className="statement-header">
        <div className="statement-brand"><Image src="/assets/daybook-mark.svg" width={38} height={38} alt="Daybook mark"/><div><strong>Daybook · Sample statement</strong><small>Independent demonstration workspace</small></div></div>
        <h2>{state.accountLabel}</h2><p>{state.name} · {state.maskedId}</p>
        <div className="statement-account-meta"><span>Account no.: {state.accountNumber || "Not set in Settings"}</span><span>Customer ID: {state.customerId || "Not set in Settings"}</span><span>Branch: {state.branch || "Not set in Settings"}</span><span>IFSC-format code: {state.ifsc || "Not set in Settings"}</span><span>Mobile: {state.mobile || "Not set in Settings"}</span><span>Email: {state.email || "Not set in Settings"}</span><span>Address: {state.address || "Not set in Settings"}</span></div>
        <p className="statement-period">Period: {from || "Any date"} — {to || "Any date"}</p><p className="statement-disclaimer">Opening sample balance: {money(state.openingBalance)} · Calculated sample balance through selected end date: {money(closing)}</p>
      </div>
      <div className="statement-table-wrap"><table className="statement-table"><thead><tr><th>Date</th><th>Remarks</th><th>Reference</th><th>Amount (INR)</th><th>Status</th></tr></thead><tbody>
        {rows.map(t=><tr key={t.id}><td>{t.date}</td><td>{t.description}</td><td>{t.id}</td><td className={t.type === "credit" ? "amount-credit" : "amount-debit"}>{t.type==="credit"?"+":"−"}{money(t.amount)}</td><td><span className={"status-chip " + t.status}>{t.status === "pending" ? "Pending simulation" : "Posted sample"}</span></td></tr>)}
      </tbody></table>{rows.length === 0 && <p className="muted">No transactions match these filters.</p>}</div>
      <p className="statement-footnote">This is a locally generated sample report. It is not proof of account ownership, a real payment, or bank authorization.</p>
    </section>
  </Shell>;
}
