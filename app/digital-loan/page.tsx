"use client";
import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const steps=[
 {title:"Understand the product",detail:"Read the official product description, eligibility rules, fees, interest rate, repayment schedule, and any applicable charges."},
 {title:"Review affordability",detail:"Consider whether each repayment fits your budget, including existing commitments and unexpected expenses. Avoid borrowing more than you can repay."},
 {title:"Verify the provider",detail:"Use an independently verified official bank channel. Never follow unsolicited links or pay an unknown person to unlock a loan."},
 {title:"Read before accepting",detail:"Review the Key Fact Statement, total cost, disbursal terms, cooling-off provisions where applicable, and grievance contacts before accepting a real offer."}
];
export default function DigitalLoanPage(){
 const [step,setStep]=useState(0);
 const [checked,setChecked]=useState<boolean[]>([false,false,false,false]);
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="loan" size={32}/><div><p className="eyebrow">DIGITAL LENDING</p><h1>Digital loan</h1><p className="muted">A guided checklist for understanding a digital loan journey.</p></div></div>
  <div className="notice" role="note"><strong>Prototype only.</strong> This page does not check eligibility, calculate an approved offer, collect documents, perform a credit enquiry, or submit a loan application.</div>
  <section className="card"><h2>Loan journey checklist</h2><p className="muted">Step {step+1} of {steps.length}</p><div className="card"><p className="eyebrow">STEP {step+1}</p><h3>{steps[step].title}</h3><p>{steps[step].detail}</p><label className="field"><span><input type="checkbox" checked={checked[step]} onChange={e=>setChecked(current=>current.map((v,i)=>i===step?e.target.checked:v))}/> Mark this guidance as reviewed</span></label></div><div className="actions"><button type="button" className="btn secondary" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>Previous</button><button type="button" disabled={step===steps.length-1} onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))}>Next step</button></div><div className="service-grid">{steps.map((item,i)=><button type="button" className="service-tile" key={item.title} aria-pressed={step===i} onClick={()=>setStep(i)}><span className="service-copy"><strong>{i+1}. {item.title}</strong><span className="muted">{checked[i]?"Reviewed":"Not marked reviewed"}</span></span></button>)}</div></section>
  <section className="card"><h2>Keep borrowing decisions safe</h2><p>Do not share OTPs, banking PINs, passwords, card CVVs, or remote-access permissions. Verify any lender independently and compare the total repayment cost before committing.</p><div className="actions"><Link className="btn secondary" href="/borrow">Loans and borrowing</Link><Link className="btn secondary" href="/security">Security guidance</Link><Link className="btn secondary" href="/help">Help centre</Link></div></section>
 </Shell>;
}
