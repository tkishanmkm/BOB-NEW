"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type BillDraft = { category: string; provider: string; reference: string; amount: string; dueDate: string };
const KEY = "bob-new-local-bill-pay-draft-v1";
const categories = ["Electricity", "Water", "Gas", "Broadband", "Other utility"];
const providers = ["Sample provider A", "Sample provider B", "Other / not specified"];

const emptyDraft: BillDraft = { category: categories[0], provider: providers[0], reference: "", amount: "", dueDate: "" };

export default function BillPayPage() {
  const [draft, setDraft] = useState<BillDraft>(emptyDraft);
  const [saved, setSaved] = useState<BillDraft | null>(null);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const v = parsed as Partial<BillDraft>;
          const restored: BillDraft = {
            category: categories.includes(v.category || "") ? v.category! : categories[0],
            provider: providers.includes(v.provider || "") ? v.provider! : providers[0],
            reference: typeof v.reference === "string" ? v.reference : "",
            amount: typeof v.amount === "string" ? v.amount : "",
            dueDate: typeof v.dueDate === "string" ? v.dueDate : "",
          };
          setDraft(restored);
          setSaved(restored);
        }
      }
    } catch {
      setStatus("Could not read the saved local draft. Existing browser data was left unchanged.");
    } finally {
      setReady(true);
    }
  }, []);

  function change<K extends keyof BillDraft>(key: K, value: BillDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = draft.reference.trim();
    if (reference.length < 3 || reference.length > 32 || !/^[a-zA-Z0-9\-/ ]+$/.test(reference)) {
      setStatus("Enter a sample bill reference (3–32 letters, numbers, spaces, hyphens or slashes).");
      return;
    }
    const amount = Number(draft.amount);
    if (!Number.isFinite(amount) || amount < 1 || amount > 1000000 || !/^\d+(\.\d{1,2})?$/.test(draft.amount)) {
      setStatus("Enter a sample amount from ₹1 to ₹10,00,000 with up to two decimal places.");
      return;
    }
    const next = { ...draft, reference, amount: amount.toFixed(2) };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setDraft(next);
      setSaved(next);
      setStatus("Bill preview saved in this browser only. No bill was fetched or paid.");
    } catch {
      setStatus("Could not save this preview. Check browser storage and try again.");
    }
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
      setDraft(emptyDraft);
      setSaved(null);
      setStatus("Local bill preview cleared.");
    } catch {
      setStatus("Could not clear the local preview.");
    }
  }

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="billPay" size={30}/><div><p className="eyebrow">PAYMENTS & UTILITIES</p><h1>Bill Payment</h1><p className="muted">Organise a sample utility bill and preview its details.</p></div></div>
    <div className="notice"><strong>SIMULATION ONLY.</strong> No biller lookup, bill fetch, payment, receipt from a provider, or external submission is performed. Use fictional test references and amounts; never enter passwords, OTPs, card details, or real banking credentials.</div>
    <section className="card">
      <h2>Bill details</h2>
      <form className="form-grid" onSubmit={save}>
        <label className="field">Bill category<select value={draft.category} onChange={e => change("category", e.target.value)}>{categories.map(v => <option key={v}>{v}</option>)}</select></label>
        <label className="field">Sample provider<select value={draft.provider} onChange={e => change("provider", e.target.value)}>{providers.map(v => <option key={v}>{v}</option>)}</select></label>
        <label className="field">Fictional bill reference<input value={draft.reference} onChange={e => change("reference", e.target.value)} maxLength={32} autoComplete="off" placeholder="e.g. DEMO-12345" required /></label>
        <label className="field">Sample amount (₹)<input type="number" inputMode="decimal" min="1" max="1000000" step="0.01" value={draft.amount} onChange={e => change("amount", e.target.value)} placeholder="e.g. 850" required /></label>
        <label className="field">Due date (optional)<input type="date" value={draft.dueDate} onChange={e => change("dueDate", e.target.value)} /></label>
        <div className="actions"><button type="submit" disabled={!ready}>Save bill preview</button><button type="button" className="secondary" onClick={clear} disabled={!saved}>Clear</button></div>
      </form>
      <p className="muted" role="status" aria-live="polite">{status || (ready ? "Only this browser's local draft is used." : "Loading saved draft…")}</p>
    </section>
    {saved && <section className="card">
      <div className="section-title"><div><h2>Bill preview</h2><p className="muted">For reference only — not a payment receipt.</p></div><ApkAssetIcon asset="statement" size={24}/></div>
      <div className="row"><span>Category</span><strong>{saved.category}</strong></div>
      <div className="row"><span>Provider</span><strong>{saved.provider}</strong></div>
      <div className="row"><span>Bill reference</span><strong>{saved.reference}</strong></div>
      <div className="row"><span>Amount</span><strong>₹{Number(saved.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
      <div className="row"><span>Due date</span><strong>{saved.dueDate || "Not provided"}</strong></div>
      <p className="notice">Draft only. No payment has been initiated and no provider has been contacted.</p>
    </section>}
  </Shell>;
}
