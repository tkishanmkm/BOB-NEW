"use client";
import Link from "next/link";
import { useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const steps = [
  { title: "Explore the overview", description: "Start at the dashboard to see the current sample account summary and the available navigation.", href: "/dashboard", action: "Open overview", icon: "account" as const, kind: "Local display" },
  { title: "Review account details", description: "Open the sample account and contact details. These values come from the local workspace and are not verified with a bank.", href: "/account-details", action: "View account", icon: "profile" as const, kind: "Local data" },
  { title: "Browse transaction history", description: "Search and filter sample transactions, then open a sample receipt. Posted and pending simulation entries are labelled separately.", href: "/passbook", action: "Open passbook", icon: "passbook" as const, kind: "Local data" },
  { title: "View a statement", description: "Open a locally generated sample statement or inspect totals and date filters in Statement Analysis.", href: "/statement", action: "Open statement", icon: "statement" as const, kind: "Generated locally" },
  { title: "Try a transfer preview", description: "Explore the transfer form with fictional/sample data. It does not contact a bank or payment rail and does not move money.", href: "/transfers", action: "Open transfer demo", icon: "transfer" as const, kind: "Simulation only" },
  { title: "Explore UPI and QR previews", description: "Review the UPI preferences and QR illustration. No UPI registration, camera scan, or real payment is connected.", href: "/upi", action: "Open UPI demo", icon: "upi" as const, kind: "Simulation only" },
  { title: "Manage local data", description: "Settings provides supported account edits and JSON import/export or workspace backup. Review previews before confirming an import.", href: "/settings", action: "Open settings", icon: "settings" as const, kind: "Browser storage" },
  { title: "Review privacy and limits", description: "Learn how browser storage works in this prototype and which sensitive information must never be entered.", href: "/about", action: "Read about this app", icon: "help" as const, kind: "Important" },
];

export default function WatchDemoPage() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="help" size={30}/><div><p className="eyebrow">QUICK TOUR</p><h1>Watch Demo</h1><p className="muted">A step-by-step guide to the main BOB-NEW prototype screens.</p></div></div>
    <div className="notice" role="note"><strong>Demo only.</strong> This is an interactive guide, not a video or a live banking tutorial. The app is not connected to Bank of Baroda, and no real payment or bank request is submitted.</div>
    <section className="card demo-walkthrough">
      <div className="section-heading"><div><p className="eyebrow">STEP {step + 1} OF {steps.length}</p><h2>{current.title}</h2></div><span className="pill">{current.kind}</span></div>
      <div className="demo-step-progress" aria-label={`Step ${step + 1} of ${steps.length}`}><div className="demo-step-progress-fill" style={{width:`${((step+1)/steps.length)*100}%`}}/></div>
      <p>{current.description}</p>
      <div className="actions"><Link className="btn" href={current.href}>{current.action}</Link><Link className="btn secondary" href="/more">Browse all services</Link></div>
      <div className="actions demo-step-controls"><button type="button" className="btn secondary" disabled={step===0} onClick={()=>setStep(v=>Math.max(0,v-1))}>Previous step</button><button type="button" className="btn secondary" disabled={step===steps.length-1} onClick={()=>setStep(v=>Math.min(steps.length-1,v+1))}>Next step</button><button type="button" className="btn secondary" onClick={()=>setStep(0)}>Restart tour</button></div>
    </section>
    <section className="card"><h2>Tour contents</h2><ol className="demo-tour-list">{steps.map((item,index)=><li key={item.href}><button type="button" className={index===step?"demo-tour-item active":"demo-tour-item"} aria-current={index===step?"step":undefined} onClick={()=>setStep(index)}><span className="demo-tour-number">{index+1}</span><span><strong>{item.title}</strong><small>{item.kind} · {item.description}</small></span><span aria-hidden="true">›</span></button></li>)}</ol></section>
    <section className="card"><h2>Before you begin</h2><ul><li>Use fictional/sample values only; never enter real passwords, PINs, OTPs, CVVs, or bank credentials.</li><li>Local records may be lost if browser site data is cleared. Exported JSON files can contain personal-looking values; keep them private.</li><li>Transfer, UPI, card, loan, booking, and support flows do not connect to real providers.</li></ul><div className="actions"><Link className="btn secondary" href="/security">Security guidance</Link><Link className="btn secondary" href="/help">Help centre</Link></div></section>
  </Shell>;
}
