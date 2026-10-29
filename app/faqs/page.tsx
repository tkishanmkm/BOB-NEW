"use client";
import { useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
const items = [
 {q:"Is this connected to Bank of Baroda?",a:"No. BOB-NEW is a local prototype for exploring screens and sample workflows. It is not connected to bank systems."},
 {q:"Can I make a real payment or transfer?",a:"No. Payment and transfer flows in this prototype are simulations only. No money moves and no payment network is contacted."},
 {q:"Are sample statements real bank records?",a:"No. Treat displayed transactions and account details as sample data unless a verified bank source is explicitly integrated."},
 {q:"Where are demo preferences stored?",a:"Some demo preferences and drafts are stored in this browser. Clearing browser site data may remove them. Do not enter passwords, PINs, OTPs, or sensitive identity details."},
 {q:"Does saving a draft submit it?",a:"No. Saving a local draft only saves information in this browser. It does not submit anything to the bank or create a service request."},
 {q:"How do I get help with the prototype?",a:"Use the in-app demo support pages to explore sample flows. They do not open a real bank support ticket."}
];
export default function FAQsPage(){
 const [open,setOpen]=useState<number|null>(0);
 return <Shell>
 <div className="page-heading apk-page-heading"><ApkAssetIcon asset="faq" size={30}/><div><p className="eyebrow">HELP CENTRE</p><h1>Frequently asked questions</h1><p className="muted">Answers about the BOB-NEW prototype and its demo features.</p></div></div>
 <div className="notice" role="note"><strong>PROTOTYPE NOTICE.</strong> This site is not an official banking channel and cannot access or change real bank accounts.</div>
 <section className="card"><h2>Common questions</h2><div className="faq-list">{items.map((item,index)=><article className="card" key={item.q}><button type="button" className="faq-question" aria-expanded={open===index} onClick={()=>setOpen(open===index?null:index)}>{item.q}<span aria-hidden="true">{open===index?"−":"+"}</span></button>{open===index&&<p>{item.a}</p>}</article>)}</div><p className="muted">For real banking services, use official Bank of Baroda channels independently.</p></section>
 </Shell>;
}
