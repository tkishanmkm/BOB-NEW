"use client";

import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon, type AssetKey } from "@/components/apk-asset-map";

type Service = [title: string, href: string, detail: string, icon: AssetKey];
type Group = { title: string; description: string; items: Service[] };

const groups: Group[] = [
  { title: "Accounts", description: "Account information and activity", items: [
    ["Savings", "/save", "Review the sample savings overview", "account"],
    ["Current account", "/current-account-details", "View sample current-account details", "account"],
    ["All accounts", "/all-accounts", "Browse available local account views", "account"],
    ["Account actions", "/account-actions", "Open common account shortcuts", "settings"],
  ]},
  { title: "Transactions", description: "Browse and review locally stored entries", items: [
    ["Passbook", "/passbook", "Search sample transaction history", "passbook"],
    ["Statement", "/statement", "View or print a demo statement", "statement"],
    ["Statement analysis", "/statement-analysis", "Explore transaction summaries", "statement"],
    ["Account statement", "/account-statement", "Open statement details", "statement"],
  ]},
  { title: "Payments", description: "Interactive local simulations only", items: [
    ["Fund transfer", "/fund-transfer", "Preview a transfer workflow", "transfer"],
    ["UPI", "/upi", "Explore a non-connected UPI screen", "upi"],
    ["Recharge", "/recharge", "Preview recharge details", "recharge"],
    ["Bill pay", "/bill-pay", "Explore bill-payment fields", "billPay"],
    ["Scan / QR", "/scan", "QR screen preview; no payment rails", "scan"],
  ]},
  { title: "Banking services", description: "Service information and workflow previews", items: [
    ["Cards", "/cards", "View sample card-service information", "cards"],
    ["Cheque book", "/cheque-book-request", "Preview a request form", "account"],
    ["Positive pay", "/positive-pay", "Explore cheque-confirmation fields", "statement"],
    ["Alerts", "/alerts", "Review local sample alerts", "alerts"],
  ]},
  { title: "Loans and investments", description: "Informational prototypes; no applications are submitted", items: [
    ["Digital loan", "/digital-loan", "View a loan workflow preview", "loan"],
    ["Personal loan", "/personal-loan-info", "Explore general sample information", "loan"],
    ["Fixed deposit", "/fixed-deposit", "View a deposit product preview", "fixedDeposit"],
    ["Investments", "/invest", "Explore investment information", "offers"],
  ]},
  { title: "Profile and security", description: "Manage local prototype settings", items: [
    ["Personal details", "/personal-details", "View sample profile information", "profile"],
    ["KYC details", "/kyc-details", "KYC is not verified or submitted", "security"],
    ["Change login PIN", "/change-login-pin", "Manage the local demo gate", "security"],
    ["Change transaction PIN", "/change-transaction-pin", "View PIN settings information", "security"],
    ["Security", "/security", "Review prototype security notes", "security"],
    ["Settings", "/settings", "Manage locally stored sample data", "settings"],
  ]},
  { title: "Help and support", description: "Local support previews; no external agent is connected", items: [
    ["FAQs", "/faqs", "Browse help information", "faq"],
    ["Complaints", "/complaints", "Draft a local complaint preview", "complaints"],
    ["Agent chat", "/agent-live-chat", "View a sample support interface", "help"],
    ["Help and support", "/help-support", "Open the local support hub", "help"],
    ["Contact us", "/contact-us-help", "View contact/help information", "help"],
  ]},
  { title: "Other services", description: "Additional screen previews", items: [
    ["Offers", "/offers", "Browse sample offers", "offers"],
    ["Bus tickets", "/bus-tickets", "Preview a travel flow", "bus"],
    ["Video call", "/video-call", "Video calling is not connected", "video"],
    ["Shop", "/shop", "Explore a sample catalogue", "shop"],
    ["Shop and pay", "/shop-and-pay", "Preview a shopping workflow", "shop"],
    ["Watch demo", "/watch-demo", "Review the prototype guide", "help"],
  ]},
];

export default function MoreServicesPage() {
  return <Shell>
    <div className="page-heading"><div><p className="eyebrow">SERVICE DIRECTORY</p><h1>More services</h1><p className="muted">Browse the available BOB-NEW prototype screens by category.</p></div></div>
    <div className="info-banner" role="note"><span aria-hidden="true">ⓘ</span><div><strong>Unofficial interface prototype</strong><br />These pages use sample/local data. No bank systems, payment rails, bookings, applications, or support agents are connected.</div></div>
    <div className="service-directory">{groups.map(group => <section className="card service-group" key={group.title}>
      <div className="section-heading"><div><h2>{group.title}</h2><p className="muted">{group.description}</p></div><span className="service-count">{group.items.length} screens</span></div>
      <div className="service-grid">{group.items.map(([title, href, detail, icon]) => <Link className="service-tile" href={href} key={href}>
        <ApkAssetIcon asset={icon} size={25} className="service-icon"/>
        <span className="service-copy"><strong>{title}</strong><small>{detail}</small></span><span className="service-arrow" aria-hidden="true">›</span>
      </Link>)}</div>
    </section>)}</div>
  </Shell>;
}
