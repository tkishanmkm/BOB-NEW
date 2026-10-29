"use client";

import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type RechargeDraft = { service: string; mobile: string; operator: string; amount: string };
const STORAGE_KEY = "bob-new-local-recharge-draft-v1";
const services = ["Mobile prepaid", "DTH", "Data top-up"];
const operators = ["Sample operator A", "Sample operator B", "Other / not specified"];

export default function RechargePage() {
  const [draft, setDraft] = useState<RechargeDraft>({ service: services[0], mobile: "", operator: operators[0], amount: "" });
  const [saved, setSaved] = useState<RechargeDraft | null>(null);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const value: unknown = JSON.parse(raw);
        if (value && typeof value === "object") {
          const item = value as Partial<RechargeDraft>;
          const restored = {
            service: services.includes(item.service || "") ? item.service! : services[0],
            mobile: typeof item.mobile === "string" ? item.mobile : "",
            operator: operators.includes(item.operator || "") ? item.operator! : operators[0],
            amount: typeof item.amount === "string" ? item.amount : "",
          };
          setDraft(restored);
          setSaved(restored);
        }
      }
    } catch {
      setMessage("Saved local draft could not be read. Existing browser data was not changed.");
    } finally {
      setReady(true);
    }
  }, []);

  function update<K extends keyof RechargeDraft>(key: K, value: RechargeDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mobile = draft.mobile.replace(/\s+/g, "");
    if (!/^[6-9]\d{9}$/.test(mobile)) { setMessage("Enter a 10-digit sample Indian mobile number beginning with 6–9."); return; }
    const amount = Number(draft.amount);
    if (!Number.isFinite(amount) || amount < 10 || amount > 10000 || !/^\d+(\.\d{1,2})?$/.test(draft.amount)) {
      setMessage("Enter a sample amount from ₹10 to ₹10,000, with up to two decimal places."); return;
    }
    const next = { ...draft, mobile, amount: amount.toFixed(2) };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDraft(next);
      setSaved(next);
      setMessage("Recharge preview saved locally. No recharge or payment was made.");
    } catch {
      setMessage("Could not save this preview. Check browser storage and try again.");
    }
  }

  function clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setDraft({ service: services[0], mobile: "", operator: operators[0], amount: "" });
      setSaved(null);
      setMessage("Local recharge preview cleared.");
    } catch {
      setMessage("Could not clear the local preview.");
    }
  }

  const displayMobile = useMemo(() => saved ? saved.mobile.replace(/^(\d{2})\d{4}(\d{4})$/, "$1••••$2") : "", [saved]);
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="recharge" size={30}/><div><p className="eyebrow">RECHARGES & BILLS</p><h1>Recharge</h1><p className="muted">Prepare a sample prepaid or DTH recharge preview.</p></div></div>
    <div className="notice"><strong>SIMULATION ONLY.</strong> No operator lookup, live plan, payment, recharge, or refund is available. Use fictional test details; do not enter payment credentials or sensitive banking information.</div>
    <section className="card">
      <h2>Recharge details</h2>
      <form className="form-grid" onSubmit={save}>
        <label className="field">Service<select value={draft.service} onChange={e => update("service", e.target.value)}>{services.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field">Sample operator<select value={draft.operator} onChange={e => update("operator", e.target.value)}>{operators.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field">Mobile number (fictional test number)<input value={draft.mobile} onChange={e => update("mobile", e.target.value)} inputMode="numeric" autoComplete="off" maxLength={14} placeholder="10-digit test value" required /></label>
        <label className="field">Amount (₹)<input value={draft.amount} onChange={e => update("amount", e.target.value)} inputMode="decimal" type="number" min="10" max="10000" step="0.01" placeholder="e.g. 199" required /></label>
        <div className="actions"><button type="submit" disabled={!ready}>Create preview</button><button type="button" className="secondary" onClick={clear} disabled={!saved}>Clear</button></div>
      </form>
      <p className="muted" role="status" aria-live="polite">{message || (ready ? "Preview is stored only in this browser." : "Loading saved preview…")}</p>
    </section>
    {saved && <section className="card"><div className="section-title"><div><h2>Recharge preview</h2><p className="muted">No transaction has been initiated.</p></div><ApkAssetIcon asset="statement" size={24}/></div>
      <div className="row"><span>Service</span><strong>{saved.service}</strong></div>
      <div className="row"><span>Operator</span><strong>{saved.operator}</strong></div>
      <div className="row"><span>Mobile</span><strong>{displayMobile}</strong></div>
      <div className="row"><span>Amount</span><strong>₹{Number(saved.amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
      <p className="notice">Demo preview only — no payment or recharge was sent.</p>
    </section>}
  </Shell>;
}
