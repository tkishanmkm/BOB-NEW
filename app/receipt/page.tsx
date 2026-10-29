"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { read, money, type State, type Tx } from "@/lib/demo";

export default function ReceiptPage() {
  const [state, setState] = useState<State>(read());
  const [selectedId, setSelectedId] = useState("");
  const [requestedId, setRequestedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => setState(read());
    const queryId = new URLSearchParams(window.location.search).get("id");
    // Normalize a missing query parameter so the page can default to the latest transaction.
    // A supplied but missing ID remains authoritative and must not select a different row.
    setRequestedId(queryId ?? "");
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const rows = useMemo(() => state.transactions.map((tx, index) => ({ tx, index })).sort((a, b) => b.tx.date.localeCompare(a.tx.date) || b.index - a.index).map(({ tx }) => tx), [state.transactions]);
  const selected: Tx | undefined = requestedId
    ? rows.find(t => t.id === requestedId)
    : requestedId === "" ? (rows.find(t => t.id === selectedId) || rows[0]) : undefined;
  function printReceipt() {
    if (!selected) { setMessage("Add a sample transaction in Settings before creating a receipt preview."); return; }
    setMessage("");
    window.print();
  }
  const receiptRef = selected ? "SAMPLE-" + selected.id.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 32) : "—";
  return <Shell>
    <div className="page-heading apk-page-heading receipt-page-heading"><ApkAssetIcon asset="statement" size={30}/><div><p className="eyebrow">TRANSACTION SERVICES</p><h1>Transaction receipt</h1><p className="muted">Print a receipt preview for a saved local sample transaction.</p></div><button type="button" className="statement-print-button" onClick={printReceipt}>Print / Save PDF</button></div>
    <div className="notice">SAMPLE RECEIPT — NOT BANK-ISSUED. This preview uses editable browser data and is not proof of a real transfer or payment.</div>
    <section className="card no-print receipt-selector">
      <label className="field">Choose saved transaction<select value={selected?.id || ""} onChange={e=>{setRequestedId("");setSelectedId(e.target.value);setMessage("");}}>{rows.length===0&&<option value="">No saved transactions</option>}{rows.map(t=><option key={t.id} value={t.id}>{t.date} · {t.description} · {money(t.amount)}</option>)}</select></label>
      {message&&<p role="alert" className="error">{message}</p>}
      {!selected&&requestedId&&<p className="error" role="alert">The requested transaction was not found in saved browser data. No other transaction has been substituted.</p>}
      {!selected&&!requestedId&&<p className="muted">No transaction is available. Add sample transaction rows in Settings.</p>}
    </section>
    {selected&&<section className="card receipt-paper">
      <div className="receipt-brand"><Image src="/assets/daybook-mark.svg" width={42} height={42} alt="Daybook mark"/><div><strong>Daybook · Sample receipt</strong><small>Independent demonstration workspace</small></div><span className="receipt-sample-stamp">SAMPLE</span></div>
      <div className="receipt-status"><span>{selected.status==="posted"?"SAMPLE POSTED STATUS":"SAMPLE PENDING STATUS"}</span><h2>{selected.type==="credit"?"+":"−"}{money(selected.amount)}</h2><p>{selected.description}</p></div>
      <div className="receipt-section-heading"><h2>Transaction details</h2><ApkAssetIcon asset="passbook" size={22}/></div>
      <div className="receipt-grid">
        <ReceiptField label="Receipt reference (local)" value={receiptRef}/>
        <ReceiptField label="Transaction date" value={selected.date}/>
        <ReceiptField label="Transaction type" value={selected.type==="credit"?"Credit (sample)":"Debit (sample)"}/>
        <ReceiptField label="Status" value={selected.status==="posted"?"Posted in local sample data":"Pending in local sample data"}/>
        <ReceiptField label="Account holder" value={state.name||"Not set in Settings"}/>
        <ReceiptField label="Account label" value={state.accountLabel||"Not set in Settings"}/>
        <ReceiptField label="Account number (sample)" value={state.accountNumber||state.maskedId||"Not set in Settings"}/>
        <ReceiptField label="Customer ID (sample)" value={state.customerId||"Not set in Settings"}/>
        <ReceiptField label="Branch (sample)" value={state.branch||"Not set in Settings"}/>
        <ReceiptField label="IFSC-format code (sample)" value={state.ifsc||"Not set in Settings"}/>
        <ReceiptField label="Mobile (sample)" value={state.mobile||"Not set in Settings"}/>
        <ReceiptField label="Email (sample)" value={state.email||"Not set in Settings"}/>
        <ReceiptField label="Address (sample)" value={state.address||"Not set in Settings"}/>
      </div>
      <p className="receipt-disclaimer">No payment network was contacted. This preview does not confirm receipt of funds, account ownership, bank authorization, or settlement. The reference above is generated locally and is not a bank transaction reference.</p>
    </section>}
  </Shell>;
}
function ReceiptField({label,value}:{label:string;value:string}) { return <div className="receipt-field"><span>{label}</span><strong>{value}</strong></div>; }
