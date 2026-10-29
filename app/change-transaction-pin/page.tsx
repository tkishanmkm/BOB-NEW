"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { getLocalRecord, setLocalRecord } from "@/lib/demo";

const TRANSACTION_PIN_KEY = "bob-new-local-transaction-pin-v1";
type TransactionPinRecord = { version: 1; configured: boolean; pin: string };
const EMPTY_RECORD: TransactionPinRecord = { version: 1, configured: false, pin: "" };
function validRecord(value: unknown): value is TransactionPinRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<TransactionPinRecord>;
  return record.version === 1 && typeof record.configured === "boolean" && typeof record.pin === "string" && (record.configured ? /^[0-9]{4,6}$/.test(record.pin) : record.pin === "");
}

export default function ChangeTransactionPinPage() {
  const [baseline, setBaseline] = useState<TransactionPinRecord | null>(null);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getLocalRecord<unknown>(TRANSACTION_PIN_KEY, EMPTY_RECORD).then((stored) => {
      if (!active) return;
      if (!validRecord(stored)) throw new Error("Transaction PIN record failed validation.");
      setBaseline({ ...stored });
      setReady(true);
    }).catch(() => {
      if (active) setMessage("Could not safely load the saved local transaction-PIN record. Changes are disabled; preserve browser data and retry after recovery.");
    });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || !baseline || saving) return;
    if (!validRecord(baseline)) { setMessage("Saved transaction-PIN record failed validation. No change was made."); return; }
    if (baseline.configured && currentPin !== baseline.pin) { setMessage("Current local transaction PIN does not match."); return; }
    if (!/^[0-9]{4,6}$/.test(newPin)) { setMessage("Choose a transaction demo PIN containing 4–6 digits."); return; }
    if (newPin !== confirmPin) { setMessage("The new PIN and confirmation do not match."); return; }
    if (baseline.configured && newPin === currentPin) { setMessage("Choose a different PIN."); return; }
    setSaving(true);
    try {
      const next: TransactionPinRecord = { version: 1, configured: true, pin: newPin };
      await setLocalRecord(TRANSACTION_PIN_KEY, next, baseline);
      setBaseline(next); setCurrentPin(""); setNewPin(""); setConfirmPin("");
      setMessage("Local transaction demo PIN saved. It is separate from the login demo PIN, but it is not secure banking authorization and does not authorize transfers.");
    } catch {
      setMessage("Save was not confirmed. The record may have changed in another tab; reload and review before retrying.");
    } finally { setSaving(false); }
  }

  return <Shell>
    <div className="page-heading"><div><p className="eyebrow">LOCAL WORKSPACE</p><h1>Change transaction PIN</h1><p className="muted">Configure a separate PIN for the prototype transaction-flow demonstration.</p></div></div>
    <div className="notice" role="note"><strong>Demo only.</strong> This PIN is stored in this browser as local prototype data. It is not encrypted banking authentication, is not your bank’s transaction PIN, and does not authorize or protect real transfers. Never enter a real banking PIN here.</div>
    <form className="card" onSubmit={(event) => void submit(event)}>
      <fieldset disabled={!ready || saving} className="settings-fields">
        {baseline?.configured && <label className="field">Current local transaction PIN<input type="password" inputMode="numeric" autoComplete="current-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={currentPin} onChange={(event) => setCurrentPin(event.target.value)} required /></label>}
        {!baseline?.configured && <p className="muted">No transaction demo PIN is configured yet. Create one below.</p>}
        <label className="field">New local transaction PIN<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={newPin} onChange={(event) => setNewPin(event.target.value)} required /></label>
        <label className="field">Confirm new PIN<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value)} required /></label>
        <div className="actions"><button type="submit" disabled={!ready || saving}>{!ready ? "Loading saved data…" : saving ? "Saving…" : baseline?.configured ? "Update demo PIN" : "Set transaction demo PIN"}</button><Link className="btn secondary" href="/settings">Back to Settings</Link></div>
      </fieldset>
      {message && <p className="muted" role="status" aria-live="polite">{message}</p>}
    </form>
  </Shell>;
}
