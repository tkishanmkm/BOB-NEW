"use client";
import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const topics=[
 {title:"Savings and deposits",description:"Learn how savings products and fixed deposits may differ.",detail:"Compare access to funds, tenure, applicable rates, penalties, and terms using current official provider information."},
 {title:"Recurring commitments",description:"Understand regular contributions and maturity dates.",detail:"Before committing, review the contribution amount, schedule, maturity terms, and early-exit conditions in the official product documents."},
 {title:"Market-linked investments",description:"Understand that returns and capital values can fluctuate.",detail:"Market-linked investments may lose value. Read official offer documents and consider risk, costs, time horizon, and diversification before deciding."},
 {title:"Fraud prevention",description:"Recognise suspicious investment claims.",detail:"Be cautious of guaranteed high returns, urgency, unsolicited links, and requests for OTPs or remote access. Verify firms and products independently."}
];
export default function InvestPage(){
 const [active,setActive]=useState(topics[0]);
 const [ack,setAck]=useState(false);
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="fixedDeposit" size={32}/><div><p className="eyebrow">INVESTMENTS</p><h1>Invest</h1><p className="muted">Explore general investment education and product considerations.</p></div></div>
  <div className="notice" role="note"><strong>Educational prototype.</strong> This screen does not provide personalised investment advice, show live rates or market prices, open an investment account, or place orders. No investment is made here.</div>
  <section className="card"><h2>Explore a topic</h2><div className="service-grid">{topics.map(topic=><button type="button" className="service-tile" key={topic.title} onClick={()=>setActive(topic)} aria-pressed={active.title===topic.title}><span className="service-copy"><strong>{topic.title}</strong><span className="muted">{topic.description}</span><span className="service-arrow">Read guidance →</span></span></button>)}</div><article className="card" aria-live="polite"><p className="eyebrow">GUIDANCE</p><h3>{active.title}</h3><p>{active.detail}</p></article></section>
  <section className="card"><h2>Before making a decision</h2><label className="field"><span><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/> I understand this page is educational and not a live investment service.</span></label><p className="muted">{ack?"Acknowledged for this page only; no data has been submitted.":"Review the product’s official documents and risks before making any investment decision."}</p><div className="actions"><Link className="btn secondary" href="/save">Savings</Link><Link className="btn secondary" href="/fixed-deposit">Fixed deposit</Link><Link className="btn secondary" href="/help">Help centre</Link></div></section>
 </Shell>;
}
