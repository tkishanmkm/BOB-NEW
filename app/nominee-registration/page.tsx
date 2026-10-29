"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type Draft={name:string;relationship:string;dob:string;share:string;address:string;reviewed:boolean};
const KEY="bob-new-nominee-draft-v1";
const blank:Draft={name:"",relationship:"",dob:"",share:"100",address:"",reviewed:false};
const relationships=["Spouse","Son","Daughter","Parent","Sibling","Other"];
export default function NomineeRegistrationPage(){
 const [draft,setDraft]=useState<Draft>(blank);
 const [saved,setSaved]=useState(false);
 const [status,setStatus]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(parsed&&typeof parsed==="object")setDraft({...blank,...parsed});}}catch{setStatus("Could not load the saved local draft.");}setSaved(true);},[]);
 function update<K extends keyof Draft>(key:K,value:Draft[K]){setDraft(old=>({...old,[key]:value}));setStatus("");}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(draft));setStatus("Draft saved in this browser only. It has not been sent to the bank.");}catch{setStatus("Browser storage is unavailable. Copy your details before leaving this page.");}}
 function clear(){setDraft(blank);try{localStorage.removeItem(KEY);setStatus("Local draft cleared.");}catch{setStatus("Draft cleared on screen, but browser storage could not be updated.");}}
 const share=Number(draft.share);
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="profile" size={32}/><div><p className="eyebrow">ACCOUNT SERVICES</p><h1>Nominee Registration</h1><p className="muted">Prepare a nominee-details draft for review.</p></div></div>
  <div className="notice"><strong>Demo only:</strong> This form stores information in this browser. It does not register or change a nominee with Bank of Baroda. Avoid entering sensitive information into a prototype.</div>
  <form className="card" onSubmit={e=>{e.preventDefault();save();}}>
   <h2>Nominee details</h2>
   <div className="field-grid">
    <label className="field">Nominee full name<input value={draft.name} onChange={e=>update("name",e.target.value)} autoComplete="off" maxLength={100} placeholder="Enter sample name" required/></label>
    <label className="field">Relationship<select value={draft.relationship} onChange={e=>update("relationship",e.target.value)} required><option value="">Choose relationship</option>{relationships.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="field">Date of birth<input type="date" value={draft.dob} onChange={e=>update("dob",e.target.value)}/></label>
    <label className="field">Nominee share (%)<input type="number" min="1" max="100" step="1" value={draft.share} onChange={e=>update("share",e.target.value)} required/><small className="muted">Illustrative share; total nomination rules may vary.</small></label>
    <label className="field">Address (optional)<textarea value={draft.address} onChange={e=>update("address",e.target.value)} rows={3} maxLength={300} placeholder="Avoid using real personal data in this demo"/></label>
   </div>
   <label className="field"><span><input type="checkbox" checked={draft.reviewed} onChange={e=>update("reviewed",e.target.checked)}/> I have reviewed these sample details and understand this is not a bank submission.</span></label>
   <div className="actions"><button className="btn" type="submit" disabled={!saved||!draft.name.trim()||!draft.relationship||!Number.isInteger(share)||share<1||share>100||!draft.reviewed}>Save local draft</button><button className="btn secondary" type="button" onClick={clear}>Clear draft</button></div>
   {status&&<p className="info-banner" role="status">{status}</p>}
  </form>
  <section className="card"><h2>Before making a real nomination</h2><p>Use official bank channels to confirm eligibility, documentation, nominee rules and submission requirements. Review every field carefully before submitting through a verified banking service.</p><div className="actions"><Link className="btn secondary" href="/account-details">Account details</Link><Link className="btn secondary" href="/help">Help centre</Link><Link className="btn secondary" href="/security">Security</Link></div></section>
 </Shell>;
}
