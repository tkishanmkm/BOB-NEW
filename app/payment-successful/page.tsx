"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { money, read, type State, type Tx } from "@/lib/demo";

export default function PaymentSuccessfulPage() {
  const [state, setState] = useState<State | null>(null);
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

  // Array order reflects the order in which the local previews were saved.
  // Reverse it so two previews made on the same day show the newest one.
  const latest: Tx | undefined = state?.transactions
    .slice()
    .reverse()
    .find((tx) => tx.description.startsWith("SIMULATION — Transfer preview to "));

  return <Shell>
    <section className="success-panel" aria-labelledby="result-title">
      <div className="pill">SAMPLE WORKSPACE</div>
      <h1 id="result-title">Transfer preview complete</h1>
      <p><strong>No payment was made.</strong> This is a local simulation result, not a successful bank transfer. No bank, payment network, recipient or account was contacted.</p>
      {!state && <p className="muted">Loading the saved sample result…</p>}
      {state && latest && <>
        <div className="receipt-row"><span>Result</span><b>Pending simulation</b></div>
        <div className="receipt-row"><span>Reference</span><b>{latest.id}</b></div>
        <div className="receipt-row"><span>Date</span><b>{latest.date}</b></div>
        <div className="receipt-row"><span>Sample recipient</span><b>{latest.description.replace("SIMULATION — Transfer preview to ", "").split(" · ")[0]}</b></div>
        <div className="receipt-row"><span>Amount</span><b>{money(latest.amount)}</b></div>
        <p className="warning">DEMO RESULT — NOT A PAYMENT CONFIRMATION OR BANK RECEIPT</p>
      </>}
      {state && !latest && <p className="muted">No saved transfer preview was found. Start a new sample transfer to create one.</p>}
      <div className="actions"><Link className="btn secondary" href="/passbook">View sample transactions</Link><Link className="btn" href="/transfers">Create another preview</Link><Link className="btn secondary" href="/dashboard">Back to overview</Link></div>
    </section>
  </Shell>;
}
