"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { hydrate, read, type State } from "@/lib/demo";

export default function ContactDetailsPage() {
  const [state, setState] = useState<State>(read());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => setState(read());
    void hydrate().then(() => { if (active) { refresh(); setReady(true); } }).catch(() => { if (active) setFailed(true); });
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { active = false; window.removeEventListener("bob-new-state-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  if (failed) return <Shell><section className="card"><h1>Contact details unavailable</h1><p className="error" role="alert">Saved contact data could not be loaded. Values are hidden until browser data can be validated. Check storage and reload; do not clear your existing data as a recovery step.</p><button type="button" onClick={() => window.location.reload()}>Retry</button></section></Shell>;
  if (!ready) return <Shell><section className="card" role="status"><h1>Loading contact details</h1><p className="muted">Loading saved profile data from this browser…</p></section></Shell>;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="profile" size={30}/><div><p className="eyebrow">MY PROFILE</p><h1>Contact details</h1><p className="muted">Review the contact information saved in this browser workspace.</p></div></div>
    <div className="notice">SAMPLE PROFILE ONLY — these values are not verified by a bank or mobile operator.</div>
    <section className="card">
      <div className="account-overview-top"><div className="account-avatar"><ApkAssetIcon asset="profile" size={32}/></div><div><span className="muted">Profile name</span><h2>{state.name}</h2><p className="muted">Contact information from Settings</p></div></div>
      <div className="account-detail-grid">
        <Detail label="Mobile number (sample)" value={state.mobile || "Not set"}/>
        <Detail label="Email address (sample)" value={state.email || "Not set"}/>
        <Detail label="Address (sample)" value={state.address || "Not set"}/>
        <Detail label="Branch label (sample)" value={state.branch || "Not set"}/>
      </div>
      <div className="actions"><Link className="btn" href="/settings">Edit contact details in Settings</Link><Link className="btn secondary" href="/account-details">View account details</Link><Link className="btn secondary" href="/security">Security</Link></div>
    </section>
    <section className="card"><h2>Privacy reminder</h2><p>Contact information is stored in this browser prototype. Do not use real personal data on a shared device, and remember that exported JSON backups may contain these values.</p></section>
  </Shell>;
}
function Detail({label,value}:{label:string;value:string}) { return <div className="account-detail-item"><span>{label}</span><strong>{value}</strong></div>; }
