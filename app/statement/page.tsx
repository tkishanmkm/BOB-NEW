"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/app-shell";
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
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const rows = useMemo(() => state.transactions
    .filter(t => !from || t.date >= from)
    .filter(t => !to || t.date <= to)
    .filter(t => type === "all" || t.type === type)
    .filter(t => status === "all" || t.status === status)
    .slice().sort((a, b) => b.date.localeCompare(a.date)), [state.transactions, from, to, type, status]);
  const credits = rows.filter(t => t.type === "credit" && t.status === "posted").reduce((n,t) => n + t.amount, 0);
  const debits = rows.filter(t => t.type === "debit" && t.status === "posted").reduce((n,t) => n + t.amount, 0);

  function printStatement() {
    if (from && to && from > to) { setMessage("Start date must be on or before end date."); return; }
    setMessage("");
    window.print();
  }

  return <Shell>
    <div className="page-heading"><div><h1>Account statement</h1><p className="muted">Filter sample transactions and print a local report.</p></div><button type="button" onClick={printStatement}>Print / Save PDF</button></div>
    <div className="notice">DEMO â€” NOT A BANK-ISSUED STATEMENT. This report is generated from editable sample data in this browser.</div>
    <section className="card no-print">
      <div className="grid">
        <label className="field">From date<input type="date" value={from} onChange={e=>setFrom(e.target.value)} /></label>
        <label className="field">To date<input type="date" value={to} onChange={e=>setTo(e.target.value)} /></label>
        <label className="field">Transaction type<select value={type} onChange={e=>setType(e.target.value as typeof type)}><option value="all">All types</option><option value="credit">Credits</option><option value="debit">Debits</option></select></label>
        <label className="field">Status<select value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">All statuses</option><option value="posted">Posted</option><option value="pending">Pending</option></select></label>
      </div>
      {message && <p role="alert">{message}</p>}
      <p className="muted">{rows.length} matching transaction(s).</p>
    </section>
    <section className="grid">
      <div className="card"><span className="muted">Posted credits</span><h2>{money(credits)}</h2></div>
      <div className="card"><span className="muted">Posted debits</span><h2>{money(debits)}</h2></div>
    </section>
    <section className="card">
      <div className="statement-header"><Image src="/assets/reference/logos/bob-world-logo.svg" width={54} height={40} alt="BOB-WORLD reference logo"/><h2>{state.accountLabel}</h2><p>{state.name} · {state.maskedId}</p><div className="grid"><p>Account number: {state.accountNumber || "Not set in Settings"}</p><p>Customer ID: {state.customerId || "Not set in Settings"}</p><p>Branch: {state.branch || "Not set in Settings"}</p><p>IFSC-format code: {state.ifsc || "Not set in Settings"}</p><p>Mobile: {state.mobile || "Not set in Settings"}</p><p>Email: {state.email || "Not set in Settings"}</p><p>Address: {state.address || "Not set in Settings"}</p></div><p>Period: {from || "Any date"} — {to || "Any date"}</p><p>Opening sample balance: {money(state.openingBalance)} · Calculated sample balance: {money(state.openingBalance + state.transactions.filter(t => t.status === "posted" && (!from || t.date >= from) && (!to || t.date <= to)).reduce((n,t) => n + (t.type === "credit" ? t.amount : -t.amount),0))}</p></div>
      {rows.length === 0 ? <p className="muted">No transactions match these filters.</p> : rows.map(t=><div className="row" key={t.id}><div><b>{t.description}</b><small className="muted">{t.date} Â· {t.status}</small></div><b>{t.type==="credit"?"+":"âˆ’"}{money(t.amount)}</b></div>)}
      <p className="muted">This is a locally generated sample report. It is not proof of account ownership or payment.</p>
    </section>
    <style jsx global>{`@media print { header, nav, .no-print, button { display:none !important; } body { background:white !important; } .layout,.main { display:block !important; margin:0 !important; padding:0 !important; } .card { break-inside:avoid; box-shadow:none !important; } .notice { border:1px solid #333; color:#111; } }`}</style>
  </Shell>;
}

