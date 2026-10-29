"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { hydrate, read, saveState, valid, type State } from "@/lib/demo";

export default function ChangeLoginPinPage() {
  const [baseline, setBaseline] = useState<State | null>(null);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    hydrate().then(() => {
      if (!active) return;
      const loaded = read();
      if (!valid(loaded)) throw new Error("Saved demo settings failed validation.");
      setBaseline({ ...loaded, transactions: loaded.transactions.map((tx) => ({ ...tx })) });
      setReady(true);
    }).catch(() => {
      if (active) setMessage("Saved data could not be safely loaded. PIN changes are disabled; preserve your browser data and retry after recovery.");
    });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || !baseline || saving) return;
    if (!valid(baseline)) { setMessage("Saved data failed validation. No change was made."); return; }
    if (currentPin !== baseline.demoPin) { setMessage("Current local demo PIN does not match."); return; }
    if (!/^[0-9]{4,6}$/.test(newPin)) { setMessage("Choose a new demo PIN containing 4–6 digits."); return; }
    if (newPin !== confirmPin) { setMessage("The new PIN and confirmation do not match."); return; }
    if (newPin === currentPin) { setMessage("Choose a different PIN."); return; }
    setSaving(true);
    try {
      const next = { ...baseline, demoPin: newPin, transactions: baseline.transactions.map((tx) => ({ ...tx })) };
      const saved = await saveState(next, baseline);
      if (!saved) { setMessage("Save was not confirmed. Another tab may have changed saved data; reload and retry. No success is claimed."); return; }
      setBaseline(next);
      setCurrentPin(""); setNewPin(""); setConfirmPin("");
      setMessage("Local demo PIN updated. This is not bank authentication or a transaction PIN.");
    } catch {
      setMessage("Could not save the local demo PIN. No successful save was confirmed.");
    } finally { setSaving(false); }
  }

  return <Shell>
    <div className="page-heading"><div><p className="eyebrow">LOCAL WORKSPACE</p><h1>Change login PIN</h1><p className="muted">Update the PIN used only by this BOB-NEW demo gate.</p></div></div>
    <div className="notice" role="note"><strong>Demo security only.</strong> This PIN is stored with local browser demo data. It is not secure banking authentication, does not protect data like a bank credential, and must not be your real banking PIN.</div>
    <form className="card" onSubmit={(event) => void submit(event)}>
      <fieldset disabled={!ready || saving} className="settings-fields">
        <label className="field">Current local demo PIN<input type="password" inputMode="numeric" autoComplete="current-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={currentPin} onChange={(event) => setCurrentPin(event.target.value)} required /></label>
        <label className="field">New local demo PIN<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={newPin} onChange={(event) => setNewPin(event.target.value)} required /></label>
        <label className="field">Confirm new PIN<input type="password" inputMode="numeric" autoComplete="new-password" pattern="[0-9]{4,6}" minLength={4} maxLength={6} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value)} required /></label>
        <div className="actions"><button type="submit" disabled={!ready || saving}>{!ready ? "Loading saved data…" : saving ? "Saving…" : "Update demo PIN"}</button><Link className="btn secondary" href="/settings">Back to Settings</Link></div>
      </fieldset>
      {message && <p className="muted" role="status" aria-live="polite">{message}</p>}
    </form>
  </Shell>;
}
