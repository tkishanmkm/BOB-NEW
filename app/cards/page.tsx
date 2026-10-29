"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { getLocalRecord, setLocalRecord } from "@/lib/demo";

const KEY = "bob-new-demo-card-controls-v1";
type CardControls = { version: 1; frozen: boolean; onlinePayments: boolean; contactless: boolean };
const DEFAULT_CONTROLS: CardControls = { version: 1, frozen: false, onlinePayments: true, contactless: true };
function validControls(value: unknown): value is CardControls {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<CardControls>;
  return v.version === 1 && typeof v.frozen === "boolean" && typeof v.onlinePayments === "boolean" && typeof v.contactless === "boolean";
}

export default function CardsPage() {
  const [controls, setControls] = useState<CardControls>(DEFAULT_CONTROLS);
  const [baseline, setBaseline] = useState<CardControls>(DEFAULT_CONTROLS);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    void getLocalRecord<unknown>(KEY, DEFAULT_CONTROLS).then(value => {
      if (!validControls(value)) throw new Error("Saved card demo controls failed validation.");
      if (active) { setControls(value); setBaseline(value); setReady(true); }
    }).catch(() => { if (active) { setError("Saved card settings could not be safely loaded. Existing data was preserved; controls are locked."); setReady(false); } });
    return () => { active = false; };
  }, []);
  async function toggle(field: "frozen" | "onlinePayments" | "contactless") {
    if (!ready || saving) return;
    const next = { ...controls, [field]: !controls[field] };
    if (!validControls(next) || !validControls(baseline)) { setError("Change blocked because card demo settings failed validation."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      await setLocalRecord(KEY, next, baseline);
      setControls(next); setBaseline(next);
      setMessage("Demo preference saved in this browser. No real card or bank setting was changed.");
    } catch { setError("Could not save this preference. Another tab may have changed it; reload the page and retry."); }
    finally { setSaving(false); }
  }
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="cards" size={32}/><div><p className="eyebrow">CARDS</p><h1>Card services</h1><p className="muted">Review simulated card controls for this local prototype.</p></div></div>
    <div className="notice">DEMO ONLY — no real card is linked. These controls do not contact a bank, block a card, or change payment permissions.</div>
    {error && <p className="error" role="alert">{error}</p>}
    {!ready ? <section className="card" role="status"><h2>Card settings unavailable</h2><p className="muted">{error || "Loading saved demo preferences…"}</p><button type="button" className="secondary" onClick={() => window.location.reload()}>Retry</button></section> : <>
      <section className="card">
        <div className="section-title"><div><p className="eyebrow">SAMPLE CARD</p><h2>Debit card overview</h2></div><ApkAssetIcon asset="cards" size={28}/></div>
        <div className="card" style={{ background: "linear-gradient(135deg, #173d76, #2678a9)", color: "#fff", margin: "16px 0" }}>
          <div className="actions" style={{ justifyContent: "space-between" }}><strong>BOB World · DEMO</strong><span>{controls.frozen ? "FROZEN (SIMULATED)" : "ACTIVE (SIMULATED)"}</span></div>
          <p style={{ margin: "28px 0 8px", letterSpacing: "0.14em" }}>•••• •••• •••• 0000</p>
          <div className="actions" style={{ justifyContent: "space-between" }}><span>SAMPLE CARDHOLDER</span><span>DEMO</span></div>
        </div>
        <p className="muted">The illustration uses a fictional masked number. No card number, expiry date, CVV, or card PIN is collected.</p>
      </section>
      <section className="card"><h2>Simulated card controls</h2><p className="muted">Toggle a preference to save it locally. This is a UI demonstration only.</p>
        <Control title="Freeze card" description="Simulates a frozen-card status in this browser only." checked={controls.frozen} disabled={saving} onChange={() => void toggle("frozen")}/>
        <Control title="Online payments" description="Stores a sample preference; does not block or enable real transactions." checked={controls.onlinePayments} disabled={saving} onChange={() => void toggle("onlinePayments")}/>
        <Control title="Contactless payments" description="Stores a sample preference; no card terminal or bank is contacted." checked={controls.contactless} disabled={saving} onChange={() => void toggle("contactless")}/>
        {saving && <p role="status" className="muted">Saving preference…</p>}
        {message && <p role="status" className="success">{message}</p>}
      </section>
    </>}
    <section className="card"><h2>Related pages</h2><div className="actions"><Link className="btn secondary" href="/account-details">Account details</Link><Link className="btn secondary" href="/settings">Settings</Link><Link className="btn secondary" href="/security">Security guidance</Link></div></section>
  </Shell>;
}
function Control({ title, description, checked, disabled, onChange }: { title: string; description: string; checked: boolean; disabled: boolean; onChange: () => void }) {
  return <div className="account-detail-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}><div><strong>{title}</strong><p className="muted">{description}</p><span className="muted">Demo status: {checked ? "On" : "Off"}</span></div><button type="button" className={checked ? "secondary" : ""} disabled={disabled} aria-pressed={checked} onClick={onChange}>{checked ? "Turn off" : "Turn on"}</button></div>;
}
