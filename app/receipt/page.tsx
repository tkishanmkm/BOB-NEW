"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/app-shell";
import { read, money, type State, type Tx } from "@/lib/demo";

export default function ReceiptPage() {
  const [state, setState] = useState<State>(read());
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  const rows = useMemo(() => state.transactions.slice().sort((a,b) => b.date.localeCompare(a.date)), [state.transactions]);
  const selected: Tx | undefined = rows.find(t => t.id === selectedId) || rows[0];
  function printReceipt() { if (!selected) { setMessage("Add a sample transaction in Settings before creating a receipt preview."); return; } setMessage(""); window.print(); }
  const receiptRef = selected ? `SAMPLE-${selected.id.replace(/[^a-zA-Z0-9-]/g, "").slice(0,32)}` : "—";
  return <Shell>
    <div className="page-heading"><div><h1>Transaction receipt</h1><p className="muted">Create a printable receipt preview from a saved local transaction.</p></div><button type="button" onClick={printReceipt}>Print / Save PDF</button></div>
    <div className="notice">SAMPLE RECEIPT — NOT BANK-ISSUED. This is generated from editable browser data and is not proof of a real transfer or payment.</div>
    <section className="card no-print"><label className="field">Choose saved transaction<select value={selected?.id || ""} onChange={e=>{setSelectedId(e.target.value);setMessage("")}}>{rows.length===0&&<option value="">No saved transactions</option>}{rows.map(t=><option key={t.id} value={t.id}>{t.date} · {t.description} · {money(t.amount)}</option>)}</select></label>{message&&<p role="alert">{message}</p>}{!selected&&<p className="muted">No transaction is available. Add sample transaction rows in Settings.</p>}</section>
    {selected&&<section className="card receipt-paper"><div className="receipt-brand"><Image src="/assets/reference/logos/bob-world-logo.svg" width={54} height={40} alt="BOB-WORLD reference logo"/><div><strong>Daybook · Sample receipt</strong><small>Independent demonstration workspace</small></div></div><div className="receipt-status"><span>{selected.status==="posted"?"SAMPLE POSTED STATUS":"SAMPLE PENDING STATUS"}</span><h2>{selected.type==="credit"?"+":"−"}{money(selected.amount)}</h2><p>{selected.description}</p></div><div className="receipt-grid"><ReceiptField label="Receipt reference" value={receiptRef}/><ReceiptField label="Transaction date" value={selected.date}/><ReceiptField label="Transaction type" value={selected.type==="credit"?"Credit (sample)":"Debit (sample)"}/><ReceiptField label="Status" value={selected.status==="posted"?"Posted in local sample data":"Pending in local sample data"}/><ReceiptField label="Account holder" value={state.name||"Not set in Settings"}/><ReceiptField label="Account label" value={state.accountLabel||"Not set in Settings"}/><ReceiptField label="Account number" value={state.accountNumber||state.maskedId||"Not set in Settings"}/><ReceiptField label="Customer ID" value={state.customerId||"Not set in Settings"}/><ReceiptField label="Branch" value={state.branch||"Not set in Settings"}/><ReceiptField label="IFSC-format code" value={state.ifsc||"Not set in Settings"}/><ReceiptField label="Mobile" value={state.mobile||"Not set in Settings"}/><ReceiptField label="Email" value={state.email||"Not set in Settings"}/><ReceiptField label="Address" value={state.address||"Not set in Settings"}/></div><p className="receipt-disclaimer">No payment network was contacted. This preview does not confirm receipt of funds, account ownership, bank authorization, or settlement. The reference above is generated locally and is not a bank transaction reference.</p></section>}
    <style jsx global>{` .receipt-paper{max-width:850px;margin-inline:auto}.receipt-brand{display:flex;align-items:center;gap:14px;padding-bottom:18px;border-bottom:1px solid var(--border,#ddd)}.receipt-brand div{display:grid;gap:4px}.receipt-brand small{color:#666}.receipt-status{text-align:center;padding:26px 8px;border-bottom:1px dashed #bbb}.receipt-status span{font-size:12px;letter-spacing:.08em;color:#666}.receipt-status h2{font-size:30px;margin:12px 0 4px}.receipt-status p{margin:0}.receipt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 24px;padding:24px 0}.receipt-field{display:grid;gap:5px;min-width:0}.receipt-field span{font-size:13px;color:#666}.receipt-field strong{overflow-wrap:anywhere}.receipt-disclaimer{font-size:12px;border-top:1px dashed #bbb;padding-top:14px;color:#555}@media(max-width:600px){.receipt-grid{grid-template-columns:1fr}}@media print{header,nav,.no-print,button{display:none!important}body{background:white!important}.layout,.main{display:block!important;margin:0!important;padding:0!important}.card{box-shadow:none!important;border:0!important}.receipt-paper{max-width:none!important}.receipt-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`}</style>
  </Shell>;
}
function ReceiptField({label,value}:{label:string;value:string}){return <div className="receipt-field"><span>{label}</span><strong>{value}</strong></div>}
