"use client";
import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const benefits=[
 {title:"Everyday spending",detail:"Review how a card may be used for routine purchases."},
 {title:"Statement awareness",detail:"Understand the importance of checking each statement and due date."},
 {title:"Security habits",detail:"Protect card details, PINs, CVVs, and one-time passwords."}
];
export default function CreditCardApplyPage(){
 const [interest,setInterest]=useState("Everyday spending");
 const [ack,setAck]=useState(false);
 const [message,setMessage]=useState("");
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="cards" size={32}/><div><p className="eyebrow">CARD SERVICES</p><h1>Credit card</h1><p className="muted">Explore card information and application guidance.</p></div></div>
  <div className="notice" role="note"><strong>Prototype only.</strong> This is not a credit-card application and is not connected to Bank of Baroda. No eligibility check, credit enquiry, application submission, or card issuance takes place.</div>
  <section className="card"><h2>Explore card features</h2><div className="service-grid">{benefits.map(b=><article className="service-tile" key={b.title}><span className="service-copy"><strong>{b.title}</strong><span className="muted">{b.detail}</span></span></article>)}</div></section>
  <section className="card"><h2>Prepare for an application</h2><p className="muted">Choose the information you would like to learn about. This selection stays on this page and is not submitted.</p><label className="field">Area of interest<select value={interest} onChange={e=>{setInterest(e.target.value);setMessage("")}}><option>Everyday spending</option><option>Fees and charges</option><option>Repayment and due dates</option><option>Card security</option></select></label><label className="field"><span><input type="checkbox" checked={ack} onChange={e=>{setAck(e.target.checked);setMessage("")}}/> I understand this page is a demo and does not submit an application.</span></label><button type="button" onClick={()=>setMessage(ack?interest==="Fees and charges"?"Review the official issuer’s current fee schedule, interest rates, and terms before applying.":interest==="Repayment and due dates"?"Review the official issuer’s statement cycle, payment due date, minimum payment, and interest terms.":interest==="Card security"?"Never share your card PIN, CVV, OTP, or password. Contact the issuer through a verified official channel if you suspect misuse.":"Compare the official card’s benefits, eligibility rules, fees, and repayment terms before deciding.":"Please acknowledge the demo notice before viewing guidance.")}>Show guidance</button>{message&&<p className="info-banner" role="status">{message}</p>}</section>
  <div className="actions"><Link className="btn secondary" href="/cards">My cards</Link><Link className="btn secondary" href="/help">Help centre</Link><Link className="btn secondary" href="/security">Security guidance</Link></div>
 </Shell>;
}
