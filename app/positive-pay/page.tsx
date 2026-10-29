"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type Draft = { payee: string; chequeNumber: string; amount: string; date: string; note: string };
const STORAGE_KEY = "bob-new-local-positive-pay-v1";
const emptyDraft: Draft = { payee: "", chequeNumber: "", amount: "", date: "", note: "" };

export default function PositivePayPage() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saved, setSaved] = useState<Draft | null>(null);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const value = parsed as Partial<Draft>;
          const restored: Draft = {
            payee: typeof value.payee === "string" ? value.payee : "",
            chequeNumber: typeof value.chequeNumber === "string" ? value.chequeNumber : "",
            amount: typeof value.amount === "string" ? value.amount : "",
            date: typeof value.date === "string" ? value.date : "",
            note: typeof value.note === "string" ? value.note : "",
          };
          setDraft(restored);
          setSaved(restored);
        }
      }
    } catch {
      setMessage("Could not read the saved local draft. Existing browser data was not changed.");
    } finally {
      setReady(true);
    }
  }, []);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payee = draft.payee.trim();
    const chequeNumber = draft.chequeNumber.trim();
    const amount = Number(draft.amount);
    if (!payee || payee.length > 100) { setMessage("Enter a payee name of 1–100 characters."); return; }
    if (!/^\d{1,12}$/.test(chequeNumber)) { setMessage("Cheque number must contain 1–12 digits."); return; }
    if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999) { setMessage("Enter a valid positive amount up to 999,999,999."); return; }
    if (!draft.date) { setMessage("Choose the cheque date."); return; }
    if (draft.note.length > 240) { setMessage("Keep the note to 240 characters or fewer."); return; }
    const next = { ...draft, payee, chequeNumber, amount: amount.toFixed(2), note: draft.note.trim() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDraft(next);
      setSaved(next);
      setMessage("Draft saved on this device only. No bank submission was made.");
    } catch {
      setMessage("Could not save the draft. Check browser storage and try again.");
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setDraft(emptyDraft);
      setSaved(null);
      setMessage("Local draft cleared. No bank record was changed.");
    } catch {
      setMessage("Could not clear the local draft.");
    }
  }

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={30}/><div><p className="eyebrow">CHEQUE SERVICES</p><h1>Positive Pay</h1><p className="muted">Prepare a sample cheque-detail draft for review.</p></div></div>
    <div className="notice"><strong>LOCAL DEMO ONLY.</strong> This does not register cheque details with Bank of Baroda or any payment service. Do not enter real account details or other sensitive information.</div>
    <section className="card">
      <h2>Cheque details</h2>
      <form className="form-grid" onSubmit={save}>
        <label className="field">Payee name<input value={draft.payee} onChange={e => update("payee", e.target.value)} maxLength={100} required autoComplete="off" /></label>
        <label className="field">Cheque number<input value={draft.chequeNumber} onChange={e => update("chequeNumber", e.target.value)} inputMode="numeric" pattern="[0-9]{1,12}" maxLength={12} required /></label>
        <label className="field">Cheque amount (₹)<input type="number" value={draft.amount} onChange={e => update("amount", e.target.value)} min="0.01" max="999999999" step="0.01" required /></label>
        <label className="field">Cheque date<input type="date" value={draft.date} onChange={e => update("date", e.target.value)} required /></label>
        <label className="field">Note (optional)<textarea value={draft.note} onChange={e => update("note", e.target.value)} maxLength={240} rows={3} placeholder="Non-sensitive reminder only" /></label>
        <div className="actions"><button type="submit" disabled={!ready}>Save local draft</button><button type="button" className="secondary" onClick={clearDraft} disabled={!saved}>Clear draft</button></div>
      </form>
      <p role="status" aria-live="polite" className="muted">{message || (ready ? "Drafts stay in this browser." : "Loading local draft…")}</p>
    </section>
    {saved && <section className="card"><div className="section-title"><div><h2>Saved draft preview</h2><p className="muted">Review before using this illustrative screen.</p></div><ApkAssetIcon asset="statement" size={24}/></div>
      <div className="row"><span>Payee</span><strong>{saved.payee}</strong></div>
      <div className="row"><span>Cheque number</span><strong>{saved.chequeNumber}</strong></div>
      <div className="row"><span>Amount</span><strong>₹{Number(saved.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
      <div className="row"><span>Cheque date</span><strong>{saved.date}</strong></div>
      {saved.note && <div className="row"><span>Note</span><strong>{saved.note}</strong></div>}
      <p className="notice">Preview only — no verification, approval, or submission has taken place.</p>
    </section>}
  </Shell>;
}
