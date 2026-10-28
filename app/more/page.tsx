"use client";

import Link from "next/link";
import { Shell } from "@/components/app-shell";

const groups = [
  { title: "Accounts", description: "Account information and activity", items: [
    ["Savings", "/save", "Review the sample savings overview"],
    ["Current account", "/current-account-details", "View sample current-account details"],
    ["All accounts", "/all-accounts", "Browse available local account views"],
    ["Account actions", "/account-actions", "Open common account shortcuts"],
  ]},
  { title: "Transactions", description: "Browse and review locally stored entries", items: [
    ["Passbook", "/passbook", "Search sample transaction history"],
    ["Statement", "/statement", "View or print a demo statement"],
    ["Statement analysis", "/statement-analysis", "Explore transaction summaries"],
    ["Account statement", "/account-statement", "Open statement details"],
  ]},
  { title: "Payments", description: "Interactive local simulations only", items: [
    ["Fund transfer", "/fund-transfer", "Preview a transfer workflow"],
    ["UPI", "/upi", "Explore a non-connected UPI screen"],
    ["Recharge", "/recharge", "Preview recharge details"],
    ["Bill pay", "/bill-pay", "Explore bill-payment fields"],
    ["Scan / QR", "/scan", "QR screen preview; no payment rails"],
  ]},
  { title: "Banking services", description: "Service information and workflow previews", items: [
    ["Cards", "/cards", "View sample card-service information"],
    ["Cheque book", "/cheque-book-request", "Preview a request form"],
    ["Positive pay", "/positive-pay", "Explore cheque-confirmation fields"],
    ["Alerts", "/alerts", "Review local sample alerts"],
  ]},
  { title: "Loans and investments", description: "Informational prototypes; no applications are submitted", items: [
    ["Digital loan", "/digital-loan", "View a loan workflow preview"],
    ["Personal loan", "/personal-loan-info", "Explore general sample information"],
    ["Fixed deposit", "/fixed-deposit", "View a deposit product preview"],
    ["Investments", "/invest", "Explore investment information"],
  ]},
  { title: "Profile and security", description: "Manage local prototype settings", items: [
    ["Personal details", "/personal-details", "View sample profile information"],
    ["KYC details", "/kyc-details", "KYC is not verified or submitted"],
    ["Change login PIN", "/change-login-pin", "Manage the local demo gate"],
    ["Change transaction PIN", "/change-transaction-pin", "View PIN settings information"],
    ["Security", "/security", "Review prototype security notes"],
    ["Settings", "/settings", "Manage locally stored sample data"],
  ]},
  { title: "Help and support", description: "Local support previews; no external agent is connected", items: [
    ["FAQs", "/faqs", "Browse help information"],
    ["Complaints", "/complaints", "Draft a local complaint preview"],
    ["Agent chat", "/agent-live-chat", "View a sample support interface"],
    ["Help and support", "/help-support", "Open the local support hub"],
    ["Contact us", "/contact-us-help", "View contact/help information"],
  ]},
  { title: "Other services", description: "Additional screen previews", items: [
    ["Offers", "/offers", "Browse sample offers"],
    ["Bus tickets", "/bus-tickets", "Preview a travel flow"],
    ["Video call", "/video-call", "Video calling is not connected"],
    ["Shop", "/shop", "Explore a sample catalogue"],
    ["Shop and pay", "/shop-and-pay", "Preview a shopping workflow"],
    ["Watch demo", "/watch-demo", "Review the prototype guide"],
  ]},
];

export default function MoreServicesPage() {
  return <Shell>
    <div className="page-heading"><div><p className="eyebrow">SERVICE DIRECTORY</p><h1>More services</h1><p className="muted">Browse the available BOB-NEW prototype screens by category.</p></div></div>
    <div className="info-banner" role="note"><span aria-hidden="true">ⓘ</span><div><strong>Unofficial interface prototype</strong><br />These pages use sample/local data. No bank systems, payment rails, bookings, applications, or support agents are connected.</div></div>
    <div className="service-directory">{groups.map(group => <section className="card service-group" key={group.title}>
      <div className="section-heading"><div><h2>{group.title}</h2><p className="muted">{group.description}</p></div><span className="service-count">{group.items.length} screens</span></div>
      <div className="service-grid">{group.items.map(([title, href, detail]) => <Link className="service-tile" href={href} key={href}>
        <span className="service-icon" aria-hidden="true">{title === "UPI" || title === "Scan / QR" ? "⌗" : title.includes("Statement") || title === "Passbook" ? "▤" : title.includes("loan") || title.includes("Loan") || title === "Fixed deposit" ? "◫" : title === "Settings" || title === "Security" ? "⚙" : "◇"}</span>
        <span className="service-copy"><strong>{title}</strong><small>{detail}</small></span><span className="service-arrow" aria-hidden="true">›</span>
      </Link>)}</div>
    </section>)}</div>
  </Shell>;
}
