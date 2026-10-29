"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { money, read, type State, type Tx } from "@/lib/demo";

export default function PaymentSuccessfulPage() {
  const [state, setState] = useState<State | null>(null);
  const [requestedId, setRequestedId] = useState("");
  useEffect(() => {
    const refresh = () => setState(read());
    setRequestedId(new URLSearchParams(window.location.search).get("id") || "");
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Prefer the exact pending demo debit created by the transfer workflow.
  // This is a local simulation and is not a bank payment confirmation.
  const isTransferResult = (tx: Tx) =>
    tx.type === "debit" && tx.status === "pending" && tx.description.startsWith("Demo transfer to ");
  // Results should not repeat a full account identifier when a masked value is sufficient.
  const maskedAccount = (value: string) => {
    const digits = value.replace(/\\D/g, "");
    return digits.length >= 4 ? `•••• ${digits.slice(-4)}` : "Not set";
  };
  // A supplied ID is authoritative. Do not show a different transfer if it is missing.
  const latest: Tx | undefined = requestedId
    ? state?.transactions.find((tx) => tx.id === requestedId && isTransferResult(tx))
    : state?.transactions.map((tx, index) => ({ tx, index })).sort((a, b) => b.tx.date.localeCompare(a.tx.date) || b.index - a.index).map(({ tx }) => tx).find(isTransferResult);

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
        <div className="receipt-row"><span>Recipient</span><b>{latest.description.replace("Demo transfer to ", "").split(" · ")[0]}</b></div>
        <div className="receipt-row"><span>Amount</span><b>{money(latest.amount)}</b></div><hr /><h2>Sample account details from Settings</h2><div className="receipt-row"><span>Account holder</span><b>{state.name}</b></div><div className="receipt-row"><span>Account (masked)</span><b>{maskedAccount(state.accountNumber || state.maskedId || "")}</b></div><div className="receipt-row"><span>Customer ID</span><b>{state.customerId || "Not set"}</b></div><div className="receipt-row"><span>Branch / IFSC</span><b>{state.branch || "Not set"} / {state.ifsc || "Not set"}</b></div><div className="receipt-row"><span>Contact</span><b>{state.mobile || "Not set"} · {state.email || "Not set"}</b></div><div className="receipt-row"><span>Address</span><b>{state.address || "Not set"}</b></div>
        <p className="warning">LOCAL RESULT — NOT A PAYMENT CONFIRMATION OR BANK RECEIPT</p>
      </>}
      {state && !latest && <p className="muted" role="alert">{requestedId ? "The requested transfer result was not found in saved browser data. No other transaction has been substituted." : "No saved transfer result was found. Start a new transfer to create one."}</p>}
      <div className="actions no-print"><button type="button" onClick={() => window.print()}>Print / Save sample receipt</button><Link className="btn secondary" href="/statement">View statement</Link><Link className="btn secondary" href={latest ? "/receipt?id="+encodeURIComponent(latest.id) : "/receipt"}>View receipt</Link><Link className="btn secondary" href="/passbook">View transactions</Link><Link className="btn" href="/transfers">Create another transfer</Link><Link className="btn secondary" href="/dashboard">Back to overview</Link></div>
    </section>
    <style jsx global>{`@media print { header, nav, .no-print, .notice { display:none !important; } body { background:white !important; } .layout,.main { display:block !important; margin:0 !important; padding:0 !important; } .success-panel { box-shadow:none !important; border:1px solid #ddd; } }`}</style>  </Shell>;
}


