"use client";
import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type Topic = { title: string; prompt: string; answer: string };
const topics: Topic[] = [
 {title:"Finding account details",prompt:"Where can I find account details?",answer:"Open Account Details or Account Actions to review the sample profile saved in this browser. The details are not verified by a bank."},
 {title:"Statements and transactions",prompt:"How can I view my statement?",answer:"Use Passbook to browse sample transactions, Statement to view a local report, or Statement Analysis to filter a date range and review totals. These are prototype records, not bank-issued documents."},
 {title:"Transfers and payments",prompt:"Can I make a real transfer?",answer:"No. Transfer and payment flows are demonstrations only. No bank request is sent and no money moves. Do not use this prototype to make or confirm a real payment."},
 {title:"Backup and local data",prompt:"How do I back up my demo data?",answer:"Open Settings and review the available JSON export and import options. Exported files may contain personal-looking sample values; store them securely. Clearing browser site data may remove local records."},
 {title:"Keeping information safe",prompt:"What should I never share?",answer:"Never enter or share banking passwords, PINs, OTPs, CVVs, recovery codes, or remote-access credentials. Use official, independently verified banking channels for real support."},
 {title:"Support options",prompt:"How do I contact support?",answer:"The Help Centre, local Support Inbox, and Agent Live Chat preview explain this prototype. They do not connect to a bank employee or submit a support ticket."}
];
export default function AIAssistantChatPage() {
 const [selected,setSelected]=useState<Topic|null>(null);
 const [question,setQuestion]=useState("");
 const [answer,setAnswer]=useState("");
 function ask(text:string){const q=text.trim();if(!q)return;const lower=q.toLowerCase();const topic=topics.find(t=>t.title.toLowerCase().split(" ").some(word=>word.length>4&&lower.includes(word)))??(lower.includes("backup")||lower.includes("export")?topics[3]:lower.includes("pin")||lower.includes("otp")||lower.includes("safe")?topics[4]:lower.includes("help")||lower.includes("support")?topics[5]:lower.includes("transfer")||lower.includes("payment")?topics[2]:lower.includes("statement")||lower.includes("transaction")?topics[1]:topics[0]);setSelected(topic);setAnswer(topic.answer);setQuestion(q);}
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="help" size={32}/><div><p className="eyebrow">DEMO ASSISTANT</p><h1>AI Assistant Chat</h1><p className="muted">Explore guided answers about the prototype.</p></div></div>
  <div className="notice" role="note"><strong>Prototype only.</strong> This page does not connect to an AI service, bank account, or human agent. Answers are selected from a fixed local help guide; do not enter confidential information.</div>
  <section className="card"><h2>What can I help you find?</h2><p className="muted">Choose a topic or type a question to find the closest help entry.</p><div className="grid">{topics.map(topic=><button type="button" className="card" key={topic.title} onClick={()=>{setSelected(topic);setAnswer(topic.answer);setQuestion(topic.prompt)}}><strong>{topic.title}</strong><p className="muted">{topic.prompt}</p></button>)}</div>
  <form onSubmit={e=>{e.preventDefault();ask(question)}}><label className="field">Ask a demo question<textarea value={question} onChange={e=>setQuestion(e.target.value)} maxLength={300} rows={2} placeholder="For example: How do I view my statement?" required/></label><button type="submit">Find an answer</button></form>
  {answer&&<article className="card" aria-live="polite"><p className="eyebrow">LOCAL HELP RESULT</p><h3>{selected?.title??"Suggested guidance"}</h3><p>{answer}</p><p className="muted">This is informational guidance only, not a verified banking answer.</p></article>}
  <div className="actions"><Link className="btn secondary" href="/help">Help centre</Link><Link className="btn secondary" href="/faqs">FAQs</Link><Link className="btn secondary" href="/security">Security guidance</Link></div></section>
 </Shell>;
}
