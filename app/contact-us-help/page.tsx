import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const options=[
 {title:"Help centre",description:"Browse common questions about accounts, statements, payments, backups and security.",href:"/help",label:"Browse help",asset:"faq" as const},
 {title:"Support inbox",description:"Open the prototype's local support-message area. Messages are not sent to the bank.",href:"/help-support",label:"Open inbox",asset:"alerts" as const},
 {title:"Frequently asked questions",description:"Review answers to common app and prototype questions.",href:"/faqs",label:"View FAQs",asset:"faq" as const},
 {title:"Security guidance",description:"Review safe PIN, password, one-time-code and device practices.",href:"/security",label:"Review security",asset:"security" as const},
 {title:"Contact details",description:"Review the contact information stored in this local prototype.",href:"/contact-details",label:"View details",asset:"profile" as const}
];
export default function ContactUsHelpPage(){
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="faq" size={32}/><div><p className="eyebrow">ASSISTANCE</p><h1>Contact Us & Help</h1><p className="muted">Choose the right place to find help with this prototype.</p></div></div>
  <div className="notice"><strong>Support limitation:</strong> BOB-NEW is an independent local demo, not an official Bank of Baroda support channel. This page cannot call the bank, create a bank service request, or guarantee a response. For real account issues, use contact details published through the bank's verified official channels.</div>
  <section className="service-directory">{options.map(item=><article className="service-group" key={item.href}><div className="service-tile"><ApkAssetIcon asset={item.asset} size={28}/><div className="service-copy"><h2>{item.title}</h2><p className="muted">{item.description}</p><Link className="btn secondary" href={item.href}>{item.label} →</Link></div></div></article>)}</section>
  <section className="card"><h2>Protect your information</h2><p>Never share your PIN, password, OTP, full card credentials, or online banking login with anyone through a message. Verify contact information independently before reaching out.</p><div className="actions"><Link className="btn secondary" href="/dashboard">Dashboard</Link><Link className="btn secondary" href="/security">Security guidance</Link></div></section>
 </Shell>;
}
