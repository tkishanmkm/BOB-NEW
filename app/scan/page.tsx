"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

export default function ScanPage() {
  const [simulated, setSimulated] = useState(false);
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="scan" size={32}/><div><p className="eyebrow">PAYMENTS</p><h1>Scan &amp; Pay</h1><p className="muted">A guided preview of the QR payment journey.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This page does not open your camera, read QR codes, validate payment requests, or send money. Never use this prototype to verify a real payment QR code.</div>
    <section className="card">
      <div style={{ maxWidth: 340, margin: "0 auto", textAlign: "center" }}>
        <div aria-label="Illustrative QR scan frame" style={{ border: "2px dashed var(--border, #b8c3d1)", borderRadius: 20, padding: 28, margin: "12px auto 20px", maxWidth: 260 }}>
          <ApkAssetIcon asset="scan" size={64}/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 18 }} aria-hidden="true">
            {["■■■","■ □","■■■","■ □","□ ■","■ □","■■■","□ ■","■■■"].map((part, index) => <span key={index} style={{ border: "1px solid currentColor", padding: "8px 0", borderRadius: 4, fontSize: 13 }}>{part}</span>)}
          </div>
          <p className="muted">Illustration only · not a scannable QR code</p>
        </div>
        <h2>{simulated ? "Demo scan preview" : "Ready for a demo?"}</h2>
        <p className="muted">{simulated ? "A fictional result is shown below to demonstrate the next step." : "Use the button to preview a fictional scan result. No camera or payment data is accessed."}</p>
        <button type="button" onClick={() => setSimulated(true)} disabled={simulated}>{simulated ? "Demo result displayed" : "Simulate demo scan"}</button>
        {simulated && <div className="card" role="status" style={{ textAlign: "left", marginTop: 16 }}><p className="eyebrow">FICTIONAL RESULT</p><h3>Sample payment request</h3><p><strong>Payee:</strong> Demo Merchant</p><p><strong>Reference:</strong> DEMO-QR-0001</p><p><strong>Amount:</strong> Not specified</p><p className="muted">This result is hard-coded for demonstration and was not read from a QR code. No payment has been created or sent.</p><button type="button" className="secondary" onClick={() => setSimulated(false)}>Clear demo result</button></div>}
      </div>
    </section>
    <section className="card"><h2>Continue in the prototype</h2><div className="actions"><Link className="btn secondary" href="/upi">UPI services</Link><Link className="btn secondary" href="/payees">Sample beneficiaries</Link><Link className="btn secondary" href="/transfers">Transfer simulation</Link><Link className="btn secondary" href="/help-support">Help &amp; Support</Link></div></section>
    <p className="muted">The original APK screen has not been visually verified against this page. This interface is a local demonstration only.</p>
  </Shell>;
}
