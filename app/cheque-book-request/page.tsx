"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const STORAGE_KEY = "bob-new-local-cheque-book-draft-v1";
const LEAVES = [10, 25, 50];
type Draft = { accountLabel: string; leaves: number; deliveryAddress: string; remarks: string; savedAt: string };
const EMPTY: Draft = { accountLabel: "Primary demo account", leaves: 25, deliveryAddress: "", remarks: "", savedAt: "" };

function validDraft(value: unknown): value is Draft {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<Draft>;
  return typeof v.accountLabel === "string" && v.accountLabel.length <= 80
    && typeof v.leaves === "number" && LEAVES.includes(v.leaves)
    && typeof v.deliveryAddress === "string" && v.deliveryAddress.length <= 300
    && typeof v.remarks === "string" && v.remarks.length <= 500
    && typeof v.savedAt === "string";
}

export default function ChequeBookRequestPage() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validDraft(parsed)) setDraft(parsed);
      }
    } catch {
      setMessage("Could not read the saved local draft. You can still create a new one.");
    } finally {
      setReady(true);
    }
  }, []);

  function saveDraft() {
    const address = draft.deliveryAddress.trim();
    if (address.length < 5) { setMessage("Enter a delivery address of at least 5 characters for the local preview."); return; }
    if (address.length > 300 || draft.remarks.length > 500) { setMessage("Please shorten the address or remarks."); return; }
    const next = { ...draft, accountLabel: draft.accountLabel.trim() || "Primary demo account", deliveryAddress: address, savedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDraft(next);
      setPreview(true);
      setMessage("Draft saved in this browser only. No request was sent to the bank.");
    } catch {
      setMessage("The browser could not save this draft. Check available local storage.");
    }
  }

  function clearDraft() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setDraft(EMPTY);
      setPreview(false);
      setMessage("Local draft cleared.");
    } catch { setMessage("Could not clear local storage."); }
  }

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={30}/><div><p className="eyebrow">ACCOUNT SERVICES</p><h1>Cheque book request</h1><p className="muted">Prepare a local-only request preview.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This prototype does not verify your bank account, create a cheque-book order, or submit anything to Bank of Baroda. Use fictional sample details only; do not enter account numbers, PINs, OTPs, or other sensitive information.</div>
    <section className="card">
      <h2>Request details</h2>
      <label className="field">Account label (sample only)<input maxLength={80} value={draft.accountLabel} onChange={e=>setDraft({...draft,accountLabel:e.target.value})} placeholder="e.g. Primary demo account" /></label>
      <label className="field">Number of cheque leaves<select value={draft.leaves} onChange={e=>setDraft({...draft,leaves:Number(e.target.value)})}>{LEAVES.map(n=><option key={n} value={n}>{n} leaves</option>)}</select></label>
      <label className="field">Delivery address for preview<textarea maxLength={300} rows={3} value={draft.deliveryAddress} onChange={e=>setDraft({...draft,deliveryAddress:e.target.value})} placeholder="Enter a fictional sample address" /></label>
      <label className="field">Additional remarks (optional)<textarea maxLength={500} rows={3} value={draft.remarks} onChange={e=>setDraft({...draft,remarks:e.target.value})} placeholder="Optional note for your local preview" /></label>
      <div className="actions"><button type="button" onClick={saveDraft} disabled={!ready}>Save and preview</button><button type="button" className="secondary" onClick={()=>setPreview(p=>!p)} disabled={!ready}> {preview ? "Hide preview" : "Show preview"} </button><button type="button" className="secondary" onClick={clearDraft} disabled={!ready}>Clear draft</button></div>
      {message && <p className="status-message" role="status">{message}</p>}
    </section>
    {preview && <section className="card" aria-live="polite"><p className="eyebrow">LOCAL PREVIEW — NOT SUBMITTED</p><h2>Cheque book request summary</h2><dl className="details-list"><div><dt>Account label</dt><dd>{draft.accountLabel || "Primary demo account"}</dd></div><div><dt>Cheque leaves</dt><dd>{draft.leaves}</dd></div><div><dt>Delivery address</dt><dd>{draft.deliveryAddress || "Not provided"}</dd></div><div><dt>Remarks</dt><dd>{draft.remarks || "None"}</dd></div><div><dt>Saved locally</dt><dd>{draft.savedAt ? new Date(draft.savedAt).toLocaleString() : "Not saved yet"}</dd></div></dl><p className="muted">This is only a browser-stored draft. It is not a bank order, confirmation, or service request.</p></section>}
  </Shell>;
}

