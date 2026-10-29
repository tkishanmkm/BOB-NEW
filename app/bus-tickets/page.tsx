"use client";
import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const routes = [
 {from:"Delhi",to:"Jaipur",duration:"5–6 hours",note:"Illustrative intercity route"},
 {from:"Jaipur",to:"Udaipur",duration:"6–8 hours",note:"Illustrative intercity route"},
 {from:"Kota",to:"Jaipur",duration:"4–5 hours",note:"Illustrative intercity route"},
 {from:"Kota",to:"Delhi",duration:"8–10 hours",note:"Illustrative intercity route"}
];
export default function BusTicketsPage(){
 const [from,setFrom]=useState("Kota");
 const [to,setTo]=useState("Jaipur");
 const [date,setDate]=useState("");
 const [result,setResult]=useState(false);
 const [message,setMessage]=useState("");
 const route=routes.find(r=>r.from.toLowerCase()===from.trim().toLowerCase()&&r.to.toLowerCase()===to.trim().toLowerCase());
 function search(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setResult(true);setMessage(from.trim().toLowerCase()===to.trim().toLowerCase()?"Choose two different cities.":"This prototype does not search live operators or inventory. Only illustrative route guidance is shown.");}
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="bus" size={32}/><div><p className="eyebrow">TRAVEL SERVICES</p><h1>Bus tickets</h1><p className="muted">Explore the bus-ticket journey preview.</p></div></div>
  <div className="notice" role="note"><strong>Demo only.</strong> No live bus operator, ticket inventory, fare, payment, or booking service is connected. This page cannot reserve or issue a ticket.</div>
  <section className="card"><h2>Plan a route</h2><form onSubmit={search}><div className="field-grid"><label className="field">From city<input value={from} onChange={e=>setFrom(e.target.value)} maxLength={60} required placeholder="Departure city"/></label><label className="field">To city<input value={to} onChange={e=>setTo(e.target.value)} maxLength={60} required placeholder="Destination city"/></label><label className="field">Travel date<input type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={e=>setDate(e.target.value)} required/></label></div><div className="actions"><button type="submit">Explore route</button><button type="button" className="btn secondary" onClick={()=>{setFrom(to);setTo(from);setResult(false);setMessage("")}}>Swap cities</button></div></form>
  {result&&<div className="card" aria-live="polite"><h3>Route preview</h3>{from.trim().toLowerCase()===to.trim().toLowerCase()?<p className="error">{message}</p>:<><p><strong>{from.trim()} → {to.trim()}</strong></p><p>Travel date: {date||"Not selected"}</p>{route&&<p>Illustrative journey duration: {route.duration}.</p>}<p>{message}</p></>}</div>}
  </section>
  <section className="card"><h2>Example routes</h2><p className="muted">Examples only; these are not live schedules or confirmed services.</p><div className="service-grid">{routes.map(r=><button className="service-tile" type="button" key={r.from+"-"+r.to} onClick={()=>{setFrom(r.from);setTo(r.to);setResult(false);setMessage("")}}><span className="service-copy"><strong>{r.from} → {r.to}</strong><span className="muted">{r.duration}</span><span className="service-arrow">Use route →</span></span></button>)}</div></section>
  <div className="actions"><Link className="btn secondary" href="/shop-and-pay">Shop and pay</Link><Link className="btn secondary" href="/help">Help centre</Link></div>
 </Shell>;
}
