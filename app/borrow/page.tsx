import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const options = [
 {title:"Personal loan information",description:"Explore the sample personal-loan information screen and its illustrative details.",href:"/personal-loan-info",label:"View information",asset:"account"},
 {title:"Digital loan",description:"Open the prototype digital-loan journey to review its available demo screens.",href:"/digital-loan",label:"Explore demo",asset:"security"},
 {title:"Account overview",description:"Review account information available in this local browser prototype before exploring other features.",href:"/all-accounts",label:"View accounts",asset:"account"}
] as const;

export default function BorrowPage() {
 return <Shell>
  <div className="page-heading apk-page-heading"><ApkAssetIcon asset="account" size={32}/><div><p className="eyebrow">BORROW</p><h1>Loans and borrowing</h1><p className="muted">Explore loan-related screens in the BOB-NEW prototype.</p></div></div>
  <div className="notice" role="note"><strong>Demo only.</strong> This page does not check eligibility, provide a loan offer, run a credit check, collect an application, or connect to Bank of Baroda. Any sample values are illustrative and are not financial advice or a bank commitment.</div>
  <section className="card"><h2>Explore borrowing features</h2><p className="muted">Choose a destination to continue through the local prototype.</p><div className="service-grid">{options.map(option=><Link className="service-tile" href={option.href} key={option.href}><span className="service-copy"><strong>{option.title}</strong><span className="muted">{option.description}</span><span className="service-arrow">{option.label} →</span></span></Link>)}</div></section>
  <section className="card"><h2>Before you proceed</h2><ul><li>Use only official, independently verified bank channels for real loan products or applications.</li><li>Never enter an OTP, banking PIN, password, card CVV, or other secret into a demo form.</li><li>Review rates, fees, eligibility criteria, and repayment terms directly with the lender before making a financial decision.</li></ul></section>
 </Shell>;
}
