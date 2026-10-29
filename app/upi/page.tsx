"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { read, type State } from "@/lib/demo";

const DEMO_UPI_KEY = "bob-new-demo-upi-profile-v1";
type DemoUpiProfile = { handle: string; enabled: boolean };
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
  const [message, setMessage] = useState("");
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    try {
      const raw = window.localStorage.getItem(DEMO_UPI_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validProfile(parsed)) { setHandle(parsed.handle); setEnabled(parsed.enabled); }
        else setMessage("Saved UPI demo settings were invalid and were not loaded.");
      }
    } catch { setMessage("Browser storage is unavailable; UPI demo settings cannot be loaded."); }
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const profile = { handle: handle.trim(), enabled };
    if (profile.handle.length > 80 || !/^[a-zA-Z0-9._-]*$/.test(profile.handle)) {
      setMessage("Use only letters, numbers, dots, underscores or hyphens for the demo handle.");
      return;
    }
    try {
      window.localStorage.setItem(DEMO_UPI_KEY, JSON.stringify(profile));
      setMessage("Local demo preferences saved in this browser only. No UPI profile was registered.");
    } catch { setMessage("Could not save the demo preferences. Browser storage may be unavailable."); }
  }

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="upi" size={32}/><div><h1>UPI services</h1><p className="muted">A dedicated local prototype screen for UPI-related shortcuts and preferences.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This page is not connected to Bank of Baroda, NPCI, a UPI app, or any payment network. It cannot register a UPI ID, scan a payment QR code, check balances with a bank, or send or receive money.</div>
    <section className="card"><h2>Sample account</h2><div className="grid"><div className="field"><span className="muted">Account holder</span><b>{state.name || "Not set"}</b></div><div className="field"><span className="muted">Sample account</span><b>{state.maskedId || "Not set"}</b></div><div className="field"><span className="muted">Mobile (sample)</span><b>{state.mobile || "Not set"}</b></div></div></section>
    <section className="card"><h2>Local demo preferences</h2><form onSubmit={saveProfile}><label className="field">Demo handle (optional)<input value={handle} maxLength={80} autoComplete="off" onChange={event => setHandle(event.target.value)} placeholder="example.name" aria-describedby="upi-handle-help"/></label><p id="upi-handle-help" className="muted">This is an offline label for this prototype, not a valid or registered UPI ID.</p><label className="field"><span><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)}/> Mark demo preferences as enabled</span></label><p className="muted">The enabled switch only changes a local preference. It does not activate UPI services.</p><button type="submit">Save demo preferences</button>{message && <p className="good" role="status">{message}</p>}</form></section>
    <section className="card"><h2>Available shortcuts</h2><p className="muted">Continue to local-only screens. These actions do not submit a payment.</p><div className="actions"><Link className="btn secondary" href="/payees">Manage sample beneficiaries</Link><Link className="btn secondary" href="/transfers">Open transfer simulation</Link><Link className="btn secondary" href="/scan">Open scan &amp; pay information</Link><Link className="btn secondary" href="/statement">View sample statement</Link><Link className="btn secondary" href="/settings">Open settings</Link></div></section>
    <p className="muted">Original APK visual reference remains unverified; this dedicated screen is a functional local prototype, not a claim of exact screen parity.</p>
  </Shell>;
}
