"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const KEY="bob-new-classic-mode-preference-v1";
type Mode="modern"|"classic";
export default function SwitchToClassicPage(){
 const [mode,setMode]=useState<Mode>("modern");
 const [ready,setReady]=useState(false);
 const [message,setMessage]=useState("");
 useEffect(()=>{try{const value=window.localStorage.getItem(KEY);if(value==="modern"||value==="classic")setMode(value);}catch{setMessage("Browser storage is unavailable; the selection will remain temporary.");}finally{setReady(true);}},[]);
 function choose(next:Mode){setMode(next);try{window.localStorage.setItem(KEY,next);setMessage(next==="classic"?"Classic mode preference saved in this browser. The full app layout is not changed by this demo selector.":"Modern mode preference saved in this browser. The full app layout is not changed by this demo selector.");}catch{setMessage("Could not save this preference. It remains selected for this page only.");}}
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="settings" size={32}/><div><p className="eyebrow">DISPLAY PREFERENCE</p><h1>Switch to Classic</h1><p className="muted">Review the display-mode choice available in this prototype.</p></div></div>
  <div className="notice" role="note"><strong>Prototype limitation.</strong> This screen stores a local preference only. It does not switch the entire application to an authentic Classic interface or alter banking features.</div>
  <section className="card"><h2>Choose a display preference</h2><p className="muted">Your current saved selection is shown below.</p><div className="service-grid"><button type="button" className="service-tile" aria-pressed={mode==="modern"} onClick={()=>choose("modern")}><span className="service-copy"><strong>Modern interface</strong><span className="muted">Keep the current BOB-NEW prototype layout.</span><span className="service-arrow">{mode==="modern"?"Selected":"Choose modern"} →</span></span></button><button type="button" className="service-tile" aria-pressed={mode==="classic"} onClick={()=>choose("classic")}><span className="service-copy"><strong>Classic preference</strong><span className="muted">Save a preference for a classic-style experience.</span><span className="service-arrow">{mode==="classic"?"Selected":"Choose classic"} →</span></span></button></div>{ready&&<p className="info-banner" role="status">{message||`Saved preference: ${mode==="classic"?"Classic":"Modern"}.`}</p>}</section>
  <section className="card"><h2>Continue exploring</h2><p>Both selections keep you in this prototype. No bank settings or real account preferences are changed.</p><div className="actions"><Link className="btn secondary" href="/settings">Settings</Link><Link className="btn secondary" href="/dashboard">Dashboard</Link><Link className="btn secondary" href="/help">Help centre</Link></div></section>
 </Shell>;
}
