"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Shell } from "@/components/app-shell";
import { money, read, type State, type Tx } from "@/lib/demo";

export default function ReceiptPage() {
  const [requestedId, setRequestedId] = useState("");
  const [state, setState] = useState<State>(read());
  useEffect(() => {
    setRequestedId(new URLSearchParams(window.location.search).get("id") || "");
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const tx = useMemo<Tx | undefined>(() => {
    if (requestedId) return state.transactions.find(item => item.id === requestedId);
    return state.transactions.slice().reverse().find(item => item.description.startsWith("Transfer result for ")) || state.transactions[state.transactions.length - 1];
  }, [state.transactions, requestedId]);
  return <Shell>
    <div className="page-heading"><div><h1>Transaction receipt</h1><p className="muted">Printable receipt-style record from transaction data saved in this browser.</p></div><button type="button" className="no-print" onClick={() => window.print()} disabled={!tx}>Print / Save PDF</button></div>
    <div className="notice">INDEPENDENT SAMPLE WORKSPACE â€” this is not a bank-issued receipt, proof of payment, or payment-network confirmation.</div>
    {!tx ? <section className="card"><h2>No transaction selected</h2><p className="muted">Choose a saved transaction below or create a local transfer preview.</p><Link className="btn" href="/passbook">Choose transaction</Link> <Link className="btn secondary" href="/transfers">Open transfer demo</Link></section> : <>
      <section className="card receipt-print">
        <div className="statement-header"><Image src="/assets/reference/logos/bob-world-logo.svg" width={54} height={40} alt="BOB-WORLD reference logo"/><div className="pill">SAMPLE TRANSACTION RECORD</div><h2>Transaction receipt</h2><p>Reference: <b>{tx.id}</b></p></div>
        <div className="receipt-row"><span>Record status</span><b>{tx.status === "posted" ? "Saved locally (not bank-verified)" : "Pending sample record"}</b></div>
        <div className="receipt-row"><span>Transaction type</span><b>{tx.type === "credit" ? "Credit" : "Debit"}</b></div>
        <div className="receipt-row"><span>Description / recipient</span><b>{tx.description}</b></div>
        <div className="receipt-row"><span>Date</span><b>{tx.date}</b></div>
        <div className="receipt-row"><span>Amount</span><b>{tx.type === "credit" ? "+" : "âˆ’"}{money(tx.amount)}</b></div>
        <hr />
        <h2>Account details saved in Settings</h2>
        <div className="receipt-row"><span>Account holder</span><b>{state.name || "Not set"}</b></div>
        <div className="receipt-row"><span>Account label</span><b>{state.accountLabel || "Not set"}</b></div>
        <div className="receipt-row"><span>Account number</span><b>{state.accountNumber || state.maskedId || "Not set"}</b></div>
        <div className="receipt-row"><span>Customer ID</span><b>{state.customerId || "Not set"}</b></div>
        <div className="receipt-row"><span>Branch / IFSC</span><b>{state.branch || "Not set"} / {state.ifsc || "Not set"}</b></div>
        <div className="receipt-row"><span>Mobile / Email</span><b>{state.mobile || "Not set"} / {state.email || "Not set"}</b></div>
        <div className="receipt-row"><span>Address</span><b>{state.address || "Not set"}</b></div>
        <p className="warning">LOCAL SAMPLE ONLY â€” no money was sent, received, or verified by a bank or payment service.</p>
      </section>
      <section className="card no-print"><h2>Other saved transactions</h2>{state.transactions.slice().reverse().map(item=><div className="row" key={item.id}><span><Link href={"/receipt?id="+encodeURIComponent(item.id)}>{item.description}</Link><small className="muted">{item.date} Â· {item.status} Â· Ref {item.id}</small></span><b>{item.type==="credit"?"+":"âˆ’"}{money(item.amount)}</b></div>)}</section>
    </>}
    <div className="actions no-print"><Link className="btn secondary" href="/passbook">Transactions</Link><Link className="btn secondary" href="/statement">Statement</Link><Link className="btn secondary" href="/settings">Settings</Link></div>
    <style jsx global>{`@media print { header, nav, .no-print, .notice { display:none !important; } body { background:white !important; } .layout,.main { display:block !important; margin:0 !important; padding:0 !important; } .card,.receipt-print { break-inside:avoid; box-shadow:none !important; border:1px solid #ddd; } .receipt-row { break-inside:avoid; } }`}</style>
  </Shell>;
}

