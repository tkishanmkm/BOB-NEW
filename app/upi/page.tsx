"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, getLocalRecord, setLocalRecord, type State } from "@/lib/demo";

const DEMO_UPI_KEY = "bob-new-demo-upi-profile-v1";
type DemoUpiProfile = { handle: string; enabled: boolean };
const DEFAULT_PROFILE: DemoUpiProfile = { handle: "", enabled: false };
function validProfile(value: unknown): value is DemoUpiProfile {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<DemoUpiProfile>;
  return typeof v.handle === "string" && v.handle.length <= 80 && /^[a-zA-Z0-9._-]*$/.test(v.handle)
    && typeof v.enabled === "boolean";
}

export default function UpiPage() {
  const [state, setState] = useState<State>(read());
  const [handle, setHandle] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [baseline, setBaseline] = useState<DemoUpiProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = () => setState(read());
    void hydrate().then(async () => {
      const value: unknown = await getLocalRecord<unknown>(DEMO_UPI_KEY, DEFAULT_PROFILE);
      if (!validProfile(value)) throw new Error("Saved UPI demo settings failed validation.");
      if (active) { setState(read()); setHandle(value.handle); setEnabled(value.enabled); setBaseline(value); setReady(true); }
    }).catch(() => { if (active) { setError("Saved browser data could not be safely loaded. UPI demo preferences are locked and existing records were preserved."); setReady(false); } });
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || saving) { setError("UPI demo preferences are not ready to save."); return; }
    const profile = { handle: handle.trim(), enabled };
    if (!validProfile(profile) || !validProfile(baseline)) { setError("Save blocked: the demo handle or saved-data baseline failed validation."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      await setLocalRecord(DEMO_UPI_KEY, profile, baseline);
      setBaseline(profile); setHandle(profile.handle); setMessage("Saved locally in this browser. No UPI ID was registered and no payment service was changed.");
    } catch { setError("Could not save: saved preferences may have changed in another tab. Reload and review the latest data before retrying."); }
    finally { setSaving(false); }
  }

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="upi" size={32}/><div><p className="eyebrow">PAYMENTS</p><h1>UPI services</h1><p className="muted">Manage local demo preferences and shortcuts.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This page is not connected to Bank of Baroda, NPCI, a UPI app, or any payment network. It cannot register a UPI ID, scan a payment QR code, check balances with a bank, or send or receive money.</div>
    {error && <p className="error" role="alert">{error}</p>}
    <section className="card"><h2>Sample account</h2><div className="grid"><div className="field"><span className="muted">Account holder</span><b>{state.name || "Not set"}</b></div><div className="field"><span className="muted">Sample account</span><b>{state.maskedId || "Not set"}</b></div><div className="field"><span className="muted">Mobile (sample)</span><b>{state.mobile || "Not set"}</b></div></div></section>
    <section className="card"><h2>Local demo preferences</h2>
      {!ready ? <div role="status"><p className="muted">{error || "Loading saved preferences…"}</p><button type="button" className="secondary" onClick={() => window.location.reload()}>Retry</button></div> :
      <form onSubmit={saveProfile}><label className="field">Demo handle (optional)<input value={handle} maxLength={80} autoComplete="off" onChange={event => setHandle(event.target.value)} placeholder="example.name" aria-describedby="upi-handle-help" disabled={saving}/></label><p id="upi-handle-help" className="muted">Offline label only — not a valid or registered UPI ID. Leave blank if not needed.</p><label className="field"><span><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} disabled={saving}/> Mark demo preferences as enabled</span></label><p className="muted">The enabled switch only changes a local preference. It does not activate UPI services.</p><button type="submit" disabled={saving}>{saving ? "Saving…" : "Save demo preferences"}</button>{message && <p className="good" role="status">{message}</p>}</form>}
    </section>
    <section className="card"><h2>Available shortcuts</h2><p className="muted">Continue to local-only screens. These actions do not submit a payment.</p><div className="actions"><Link className="btn secondary" href="/payees">Manage sample beneficiaries</Link><Link className="btn secondary" href="/transfers">Open transfer simulation</Link><Link className="btn secondary" href="/scan">Open scan &amp; pay information</Link><Link className="btn secondary" href="/statement">View sample statement</Link><Link className="btn secondary" href="/settings">Open settings</Link></div></section>
    <p className="muted">Original APK visual reference remains unverified; this dedicated screen is a functional local prototype, not a claim of exact screen parity.</p>
  </Shell>;
}
