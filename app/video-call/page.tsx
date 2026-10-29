"use client";
import Link from "next/link";
import { useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

export default function VideoCallPage() {
  const [view, setView] = useState<"intro" | "checklist">("intro");
  const [checks, setChecks] = useState([false, false, false]);
  const complete = checks.every(Boolean);
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="help" size={32}/><div><p className="eyebrow">ASSISTANCE</p><h1>Video call</h1><p className="muted">Preview the video-assistance preparation screen.</p></div></div>
    <div className="notice" role="note"><strong>Prototype limitation.</strong> This page does not start a real video call, request camera or microphone access, join a queue, or connect to Bank of Baroda support.</div>
    <section className="card">
      <div className="video-call-preview" aria-label="Illustrative video call preview">
        <div className="video-call-avatar"><ApkAssetIcon asset="profile" size={52}/></div>
        <p className="eyebrow">VIDEO ASSISTANCE</p>
        <h2>{view === "intro" ? "Speak with an advisor" : "Before a real support call"}</h2>
        <p className="muted">{view === "intro" ? "In the official banking app, availability and identity checks may be required. This local preview only explains the preparation steps." : "Use only the bank’s official app or verified support channel for any real session."}</p>
        {view === "intro" ? <button type="button" className="btn" onClick={() => setView("checklist")}>Review preparation</button> : <button type="button" className="btn secondary" onClick={() => setView("intro")}>Back to overview</button>}
      </div>
    </section>
    <section className="card">
      <h2>Preparation checklist</h2>
      <p className="muted">Tick these items to complete the local checklist. This does not verify identity or initiate a call.</p>
      {[
        "I will open the official banking app or independently verify the support channel.",
        "I will not share my PIN, password, OTP, CVV, or screen-control access.",
        "I will keep account documents private and share them only through a verified secure channel if required."
      ].map((label, index) => <label className="field video-call-check" key={label}><input type="checkbox" checked={checks[index]} onChange={event => setChecks(old => old.map((value, i) => i === index ? event.target.checked : value))}/><span>{label}</span></label>)}
      <div className={complete ? "info-banner" : "notice"} role="status">{complete ? "Checklist complete. No call was placed and no information was sent." : `${checks.filter(Boolean).length} of ${checks.length} items checked.`}</div>
      <div className="actions"><Link className="btn secondary" href="/help-support">Help and support</Link><Link className="btn secondary" href="/security">Security guidance</Link></div>
    </section>
  </Shell>;
}
