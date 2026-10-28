"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/app-shell";
import { read, money, type State, type Tx } from "@/lib/demo";

export default function ReceiptPage() {
  const [state, setState] = useState<State>(read());
  const [selectedId, setSelectedId] = useState("");
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
  const selected = useMemo<Tx | undefined>(() => state.transactions.find(t => t.id === selectedId) ?? state.transactions[0], [state.transactions, selectedId]);
  return <Shell>
    <div className="page-heading"><div><h1>Transaction receipt</h1><p className="muted">Choose a saved sample transaction to preview or print its receipt.</p></div><button type="button" onClick={() => window.print()} disabled={!selected}>Print / Save PDF</button></div>
    <div className="notice">SAMPLE RECEIPT ONLY — not a bank-issued receipt, payment confirmation, or proof of funds transfer.</div>
    <section className="card no-print"><label className="field">Select transaction<select value={selected?.id ?? ""} onChange={e => setSelectedId(e.target.value)}>{state.transactions.length === 0 && <option value="">No transactions saved</option>}{state.transactions.map(t => <option key={t.id} value={t.id}>{t.date} · {t.description} · {money(t.amount)}</option>)}</select></label></section>
    {selected ? <article className="card receipt-card">
      <div className="receipt-brand"><Image src="/assets/reference/logos/bob-world-logo.svg" width={54} height={40} alt="BOB-WORLD reference logo"/><div><h2>Daybook transaction receipt</h2><p className="muted">Independent sample workspace</p></div></div>
      <div className="receipt-amount"><span>{selected.type === "credit" ? "Sample credit" : "Sample debit"}</span><strong>{selected.type === "credit" ? "+" : "−"}{money(selected.amount)}</strong><span className="pill">{selected.status.toUpperCase()}</span></div>
      <div className="receipt-details">
        <ReceiptRow label="Transaction description" value={selected.description}/>
        <ReceiptRow label="Transaction date" value={selected.date}/>
        <ReceiptRow label="Transaction reference" value={selected.id}/>
        <ReceiptRow label="Account holder (sample)" value={state.name}/>
        <ReceiptRow label="Account label" value={state.accountLabel}/>
        <ReceiptRow label="Account number (sample)" value={state.accountNumber || state.maskedId || "Not set"}/>
        <ReceiptRow label="Customer ID (sample)" value={state.customerId || "Not set"}/>
        <ReceiptRow label="Branch (sample)" value={state.branch || "Not set"}/>
        <ReceiptRow label="IFSC-format code (sample)" value={state.ifsc || "Not set"}/>
      </div>
      <p className="receipt-warning">DEMO ONLY · This receipt is generated from editable data stored in this browser. It does not verify that money was sent or received.</p>
    </article> : <section className="card"><p>No saved transactions are available. Add sample activity or import validated sample data in Settings.</p></section>}
    <style jsx global>{`@media print { header, nav, .notice, .no-print, button { display:none !important; } body { background:#fff !important; } .layout,.main { display:block !important; margin:0 !important; padding:0 !important; } .receipt-card { box-shadow:none !important; border:1px solid #ccc !important; break-inside:avoid; } } .receipt-brand{display:flex;align-items:center;gap:14px;border-bottom:1px solid var(--border);padding-bottom:16px}.receipt-brand h2{margin:0}.receipt-amount{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:22px 0;border-bottom:1px solid var(--border)}.receipt-amount strong{font-size:1.8rem}.receipt-details{padding-top:12px}.receipt-warning{margin-top:24px;padding:12px;border:1px dashed #a44;font-size:.85rem;color:#8b2929}`}</style>
  </Shell>;
}
function ReceiptRow({label,value}:{label:string;value:string}) { return <div className="row"><span className="muted">{label}</span><strong>{value}</strong></div>; }
