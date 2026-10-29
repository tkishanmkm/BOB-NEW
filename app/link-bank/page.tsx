"use client";
import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

export default function LinkBankPage(){
 const [bank,setBank]=useState("Bank of Baroda");
 const [purpose,setPurpose]=useState("View linked account information");
 const [ack,setAck]=useState(false);
 const [message,setMessage]=useState("");
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={32}/><div><p className="eyebrow">ACCOUNT SERVICES</p><h1>Link a bank</h1><p className="muted">Review the steps involved in linking an account.</p></div></div>
  <div className="notice" role="note"><strong>Safe demo.</strong> No bank connection, account verification, consent request, or payment-network access is performed here. Never enter account passwords, PINs, OTPs, or credentials into a prototype.</div>
  <section className="card"><h2>Explore linking guidance</h2><label className="field">Bank to learn about<select value={bank} onChange={e=>{setBank(e.target.value);setMessage("")}}><option>Bank of Baroda</option><option>Another bank</option></select></label><label className="field">Purpose<select value={purpose} onChange={e=>{setPurpose(e.target.value);setMessage("")}}><option>View linked account information</option><option>Set up a payment method</option><option>Review account permissions</option><option>Remove an existing connection</option></select></label><label className="field"><span><input type="checkbox" checked={ack} onChange={e=>{setAck(e.target.checked);setMessage("")}}/> I understand this page does not connect to or change any bank account.</span></label><button type="button" onClick={()=>setMessage(ack?bank+": "+(purpose==="View linked account information"?"Use the bank’s official app or verified website to review supported accounts and account details.":purpose==="Set up a payment method"?"Follow the official bank or regulated payment provider’s verified flow; check the displayed permissions before consenting.":purpose==="Review account permissions"?"Review the institution, permitted data, purpose, and duration before granting consent through an official channel.":"Use the official provider’s settings to review and revoke a connection, then confirm its status directly with that provider."):"Please acknowledge the demo notice to view guidance.")}>Show guidance</button>{message&&<p className="info-banner" role="status">{message}</p>}</section>
  <section className="card"><h2>Before linking</h2><ul><li>Confirm the bank or provider independently using its official website or app.</li><li>Read the requested data access and permissions carefully.</li><li>Never share OTPs, PINs, passwords, CVVs, or recovery codes with anyone claiming to link an account.</li></ul></section>
  <div className="actions"><Link className="btn secondary" href="/all-accounts">All accounts</Link><Link className="btn secondary" href="/security">Security guidance</Link><Link className="btn secondary" href="/help">Help centre</Link></div>
 </Shell>;
}
