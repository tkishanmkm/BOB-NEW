"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { read, money, type State } from "@/lib/demo";

type Filter = "all" | "credit" | "debit";
type StatusFilter = "all" | "posted" | "pending";

export default function Passbook() {
  const [state, setState] = useState<State>(read());
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Filter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

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

  const transactions = useMemo(() => state.transactions
    .map((tx, index) => ({ tx, index }))
    .filter(({ tx }) => type === "all" || tx.type === type)
    .filter(({ tx }) => status === "all" || tx.status === status)
    .filter(({ tx }) => !query.trim() || tx.description.toLowerCase().includes(query.trim().toLowerCase()) || tx.date.includes(query.trim()) || tx.id.toLowerCase().includes(query.trim().toLowerCase()))
    // Random IDs are not timestamps; preserve saved order for same-day entries.
    .sort((a, b) => b.tx.date.localeCompare(a.tx.date) || b.index - a.index)
    .map(({ tx }) => tx), [state.transactions, query, type, status]);

  const postedCredits = transactions.filter(tx => tx.type === "credit" && tx.status === "posted").reduce((sum, tx) => sum + tx.amount, 0);
  const postedDebits = transactions.filter(tx => tx.type === "debit" && tx.status === "posted").reduce((sum, tx) => sum + tx.amount, 0);

  return <Shell>
    <div className="page-heading"><div><h1>Transactions</h1><p className="muted">Search and filter the sample activity saved in this browser.</p></div></div>
    <div className="notice">SAMPLE WORKSPACE â€” pending simulation entries are not completed payments. Only posted sample entries contribute to the calculated balance.</div>
    <section className="card">
      <div className="grid">
        <label className="field">Search description, date or reference<input value={query} maxLength={120} onChange={e => setQuery(e.target.value)} placeholder="Search transactions" /></label>
        <label className="field">Transaction type<select value={type} onChange={e => setType(e.target.value as Filter)}><option value="all">All types</option><option value="credit">Credits</option><option value="debit">Debits</option></select></label>
        <label className="field">Status<select value={status} onChange={e => setStatus(e.target.value as StatusFilter)}><option value="all">All statuses</option><option value="posted">Posted sample entries</option><option value="pending">Pending simulations</option></select></label>
      </div>
      <div className="grid"><div><span className="muted">Posted credits in results</span><h2>{money(postedCredits)}</h2></div><div><span className="muted">Posted debits in results</span><h2>{money(postedDebits)}</h2></div></div>
      <p className="muted" aria-live="polite">{transactions.length} matching transaction(s).</p>
    </section>
    <section className="card">
      {transactions.length === 0 ? <p className="muted">No transactions match these filters.</p> : transactions.map(tx => <div className="row" key={tx.id}>
        <span><Link href={`/receipt?id=${encodeURIComponent(tx.id)}`}>{tx.description}</Link><small className="muted">{tx.date} · {tx.status === "pending" ? "PENDING SIMULATION — NOT PAID" : "Posted sample entry"} · Ref: {tx.id} · <Link href={`/receipt?id=${encodeURIComponent(tx.id)}`}>View sample receipt</Link></small></span>
        <b>{tx.type === "credit" ? "+" : "âˆ’"}{money(tx.amount)}</b>
      </div>)}
    </section>
  </Shell>;
}

