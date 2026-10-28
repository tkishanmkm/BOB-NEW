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
    .find((tx) => tx.description.startsWith("Transfer result for "));

  return <Shell>
    <section className="success-panel" aria-labelledby="result-title">
      <div className="pill">LOCAL WORKSPACE</div>
      <h1 id="result-title">Transfer result</h1>
      <p><strong>No payment was made.</strong> This is a locally recorded result, not a successful bank transfer. No bank, payment network, recipient or account was contacted.</p>
      {!state && <p className="muted">Loading saved transfer result…</p>}
      {state && latest && <>
        <div className="receipt-row"><span>Result</span><b>Pending — not processed</b></div>
        <div className="receipt-row"><span>Reference</span><b>{latest.id}</b></div>
        <div className="receipt-row"><span>Date</span><b>{latest.date}</b></div>
        <div className="receipt-row"><span>Recipient</span><b>{latest.description.replace("Transfer result for ", "").split(" · ")[0]}</b></div>
        <div className="receipt-row"><span>Amount</span><b>{money(latest.amount)}</b></div>
        <p className="warning">LOCAL RESULT — NOT A PAYMENT CONFIRMATION OR BANK RECEIPT</p>
      </>}
      {state && !latest && <p className="muted">No saved transfer result was found. Start a new transfer to create one.</p>}
      <div className="actions"><Link className="btn secondary" href="/passbook">View transactions</Link><Link className="btn" href="/transfers">Create another transfer</Link><Link className="btn secondary" href="/dashboard">Back to overview</Link></div>
    </section>
  </Shell>;
}
