import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const topics=[
 {title:"I cannot sign in",detail:"Check the prototype session and review the sign-in guidance. Never share your PIN or one-time code.",href:"/security",action:"Sign-in safety"},
 {title:"I need a statement",detail:"Open the sample statement and transaction history screens.",href:"/statement",action:"Open statement"},
 {title:"I have a transaction question",detail:"Review sample transactions and the local statement analysis.",href:"/statement-analysis",action:"Review transactions"},
 {title:"I need to update profile details",detail:"Review the profile and contact information stored in this browser.",href:"/personal-details",action:"Personal details"},
 {title:"I need support",detail:"Open the prototype support inbox; it does not contact the bank.",href:"/help-support",action:"Support inbox"}
];
export default function NeedHelpPage(){
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="faq" size={32}/><div><p className="eyebrow">QUICK ASSISTANCE</p><h1>Need Help?</h1><p className="muted">Choose the topic that best matches what you need.</p></div></div>
  <div className="notice"><strong>Important:</strong> This is a local BOB-NEW prototype, not an official banking service. These links provide in-app guidance only and cannot verify or resolve real account issues.</div>
  <section className="service-directory">{topics.map(topic=><article className="service-group" key={topic.title}><div className="service-tile"><ApkAssetIcon asset="faq" size={26}/><div className="service-copy"><h2>{topic.title}</h2><p className="muted">{topic.detail}</p><Link className="btn secondary" href={topic.href}>{topic.action} →</Link></div></div></article>)}</section>
  <section className="card"><h2>Stay safe</h2><p>Never provide passwords, PINs, OTPs, full card details or online banking credentials through an unverified support channel.</p><div className="actions"><Link className="btn secondary" href="/help">Help centre</Link><Link className="btn secondary" href="/contact-us-help">Contact us & help</Link><Link className="btn secondary" href="/dashboard">Dashboard</Link></div></section>
 </Shell>;
}
