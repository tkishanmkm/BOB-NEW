"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type Checklist={identity:boolean;address:boolean;contact:boolean;review:boolean};
const KEY="bob-new-kyc-review-checklist-v1";
const blank:Checklist={identity:false,address:false,contact:false,review:false};
const items:[keyof Checklist,string,string][]=[
 ["identity","Identity document","Check that the document type and name match official requirements."],
 ["address","Address information","Confirm the address evidence is current and accepted by the official channel."],
 ["contact","Contact information","Review the registered mobile number and email through a verified bank channel."],
 ["review","Final review","Check details for accuracy and understand the bank's submission process."]
];
export default function KycDetailsPage(){
 const [checked,setChecked]=useState<Checklist>(blank);
 const [loaded,setLoaded]=useState(false);
 const [status,setStatus]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const value=JSON.parse(raw);if(value&&typeof value==="object")setChecked({...blank,...value});}}catch{setStatus("Could not read the saved checklist from browser storage.");}finally{setLoaded(true);}},[]);
 function toggle(key:keyof Checklist,value:boolean){const next={...checked,[key]:value};setChecked(next);try{localStorage.setItem(KEY,JSON.stringify(next));setStatus("Checklist saved in this browser only; no KYC information was submitted.");}catch{setStatus("Storage unavailable. Your current checklist remains visible until you leave this page.");}}
 const count=items.filter(([key])=>checked[key]).length;
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="security" size={32}/><div><p className="eyebrow">PROFILE & VERIFICATION</p><h1>KYC Details</h1><p className="muted">Review common identity-verification preparation steps.</p></div></div>
  <div className="notice"><strong>Prototype only.</strong> This page does not display verified KYC records, upload identity documents, perform identity checks, or update your bank profile. Do not enter document numbers or upload sensitive files here.</div>
  <section className="card"><h2>Verification preparation checklist</h2><p className="muted">{count} of {items.length} steps reviewed</p><div className="info-banner" aria-live="polite">Progress: {Math.round(count/items.length*100)}%</div>
   {items.map(([key,title,description],index)=><label className="passbook-row" key={key} style={{display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer"}}><input type="checkbox" checked={checked[key]} onChange={e=>toggle(key,e.target.checked)} aria-label={title}/><span style={{flex:1}}><strong>{index+1}. {title}</strong><br/><span className="muted">{description}</span></span><span>{checked[key]?"Reviewed":"Pending"}</span></label>)}
   {loaded&&status&&<p className="muted" role="status">{status}</p>}
   <div className="actions"><button className="btn secondary" type="button" onClick={()=>{setChecked(blank);try{localStorage.removeItem(KEY);setStatus("Checklist reset.");}catch{setStatus("Checklist reset on screen.");}}}>Reset checklist</button></div>
  </section>
  <section className="card"><h2>Need to update your profile?</h2><p>Use verified bank channels to check current KYC status, accepted documents, and any update requirements.</p><div className="actions"><Link className="btn secondary" href="/personal-details">Personal details</Link><Link className="btn secondary" href="/contact-details">Contact details</Link><Link className="btn secondary" href="/help">Help centre</Link><Link className="btn secondary" href="/security">Security</Link></div></section>
 </Shell>;
}
