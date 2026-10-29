"use client";
import { useMemo, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const demoOffers = [
 {id:"travel",title:"Travel planning",category:"Lifestyle",description:"Explore a sample travel-planning offer card.",label:"Illustrative demo"},
 {id:"savings",title:"Savings habits",category:"Banking education",description:"A sample educational card about building a regular savings habit.",label:"Educational"},
 {id:"security",title:"Digital safety checklist",category:"Banking education",description:"Review simple tips for protecting your devices and personal information.",label:"Educational"},
 {id:"shopping",title:"Shopping benefits",category:"Lifestyle",description:"A mock retail-benefit card for layout testing only.",label:"Illustrative demo"},
 {id:"wellness",title:"Wellness planner",category:"Lifestyle",description:"A sample planner card to demonstrate the offers interface.",label:"Illustrative demo"},
 {id:"alerts",title:"Account alert awareness",category:"Banking education",description:"Learn why account alerts can help you notice unusual activity.",label:"Educational"}
];
const categories=["All","Lifestyle","Banking education"];
export default function OffersPage(){
 const [category,setCategory]=useState("All");
 const [query,setQuery]=useState("");
 const filtered=useMemo(()=>demoOffers.filter(o=>(category==="All"||o.category===category)&&[o.title,o.description,o.category].join(" ").toLowerCase().includes(query.trim().toLowerCase())),[category,query]);
 return <Shell>
 <div className="page-heading apk-page-heading"><ApkAssetIcon asset="offers" size={30}/><div><p className="eyebrow">DISCOVER</p><h1>Offers</h1><p className="muted">Browse sample cards and try the category filters.</p></div></div>
 <div className="notice" role="note"><strong>DEMO CONTENT ONLY.</strong> These are illustrative interface examples, not verified Bank of Baroda promotions. No eligibility, discount, reward, or live offer is confirmed.</div>
 <section className="card"><label htmlFor="offer-search">Search sample cards</label><input id="offer-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title or description"/>
 <div className="actions" role="group" aria-label="Filter offer categories">{categories.map(c=><button key={c} type="button" className={category===c?"":"secondary"} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
 <p className="muted" aria-live="polite">Showing {filtered.length} of {demoOffers.length} sample cards.</p>
 {filtered.length===0?<div className="empty-state"><h2>No sample cards match</h2><p>Try another search or choose All.</p><button type="button" className="secondary" onClick={()=>{setQuery("");setCategory("All");}}>Clear filters</button></div>:<div className="grid">{filtered.map(o=><article className="card" key={o.id}><span className="pill">{o.category}</span><h2>{o.title}</h2><p>{o.description}</p><p className="muted">{o.label}</p></article>)}</div>}
 </section>
 </Shell>;
}
