"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { read, balance, money, type State } from "@/lib/demo";
import { ApkAssetIcon, type AssetKey } from "@/components/apk-asset-map";

const pages: Record<string, {title:string;description:string;actions:string[]}> = {
  about:{title:"About Daybook",description:"Learn about this independent sample finance workspace.",actions:["Review sample account details","Open settings"]},
  "account-actions":{title:"Account actions",description:"Common account shortcuts using sample data only.",actions:["View account details","Open statement"]},
  "account-statement":{title:"Account statement",description:"Review and print the locally generated sample statement.",actions:["Filter transactions","Print sample statement"]},
  "agent-live-chat":{title:"Agent live chat",description:"Demonstration only. No live support agent is connected.",actions:["Open sample support","Review saved sample chat"]},
  "ai-assistant-chat":{title:"Assistant chat",description:"A local help hub with links to supported prototype tasks; no AI service is connected.",actions:["Open help and support","View transactions"]},
  alerts:{title:"Alerts",description:"Sample alerts derived from your saved local transactions.",actions:["Review pending transactions","Open settings"]},
  "all-accounts":{title:"All accounts",description:"View account profiles saved in this browser. This prototype currently supports one sample account.",actions:["View account details","Edit account settings"]},
  "app-settings":{title:"App settings",description:"Manage profile and transaction settings from the shared settings screen.",actions:["Open settings","Export sample data"]},
  "bill-pay":{title:"Bill payments",description:"Bill-payment screens are demonstration-only; no biller is contacted and no payment is made.",actions:["Review transactions","Open sample transfer flow"]},
  borrow:{title:"Borrow",description:"Loan information demo. No credit decision, offer or application is submitted.",actions:["View sample account","Open help and support"]},
  "bus-tickets":{title:"Bus tickets",description:"Travel booking demo only. No tickets are booked.",actions:["Open help and support","Return to overview"]},
  cards:{title:"Cards",description:"Sample card-management information; no real card details are stored or verified.",actions:["Open settings","Open help and support"]},
  "change-login-pin":{title:"Change login PIN",description:"Change the local demo gate PIN in Settings. This is not secure banking authentication.",actions:["Open settings"]},
  "change-transaction-pin":{title:"Change transaction PIN",description:"No separate transaction PIN or real payment authorization is implemented. Manage the local demo PIN in Settings.",actions:["Open settings"]},
  "cheque-book-request":{title:"Cheque book request",description:"Request workflow preview only; no request is sent to a bank.",actions:["Open help and support","View account details"]},
  complaints:{title:"Complaints",description:"Local complaint draft workflow; no bank case is submitted.",actions:["Open help and support"]},
  "contact-details":{title:"Contact details",description:"Read the sample mobile, email and address saved in Settings.",actions:["Open settings","View account details"]},
  "contact-us-help":{title:"Contact us",description:"This prototype has no external support connection. Use the local sample support page.",actions:["Open help and support"]},
  "credit-card-apply":{title:"Credit card application",description:"Information preview only. No application or credit check is submitted.",actions:["Open help and support"]},
  "current-account-details":{title:"Current account details",description:"The workspace currently stores one sample account; it does not verify account type.",actions:["View account details","Open settings"]},
  "digital-loan":{title:"Digital loan",description:"Loan workflow preview only. No application, credit check or disbursement occurs.",actions:["Open help and support"]},
  "digital-planner":{title:"Digital planner",description:"A placeholder for planning tools; saved profile and transaction data remain available below.",actions:["View transactions","Open settings"]},
  faqs:{title:"Frequently asked questions",description:"This prototype stores data in browser storage and does not connect to bank systems.",actions:["Open help and support","Open settings"]},
  "fixed-deposit":{title:"Fixed deposit",description:"Deposit product information preview. No deposit is opened and no interest is calculated.",actions:["Open help and support"]},
  "fund-transfer":{title:"Fund transfer",description:"Open the shared multi-step transfer simulation. It never sends money.",actions:["Start sample transfer","Manage beneficiaries"]},
  help:{title:"Help",description:"Find help for this independent sample workspace.",actions:["Open help and support","Open settings"]},
  invest:{title:"Investments",description:"Investment information preview only; no trades or investments are placed.",actions:["Open help and support"]},
  "kyc-details":{title:"KYC details",description:"KYC status is not verified or submitted in this demo. Do not enter real identity documents.",actions:["Open settings","Open help and support"]},
  "link-bank":{title:"Link bank",description:"Bank linking is not implemented; no credentials or tokens are requested.",actions:["Open account details"]},
  more:{title:"More services",description:"Explore the available sample pages in the navigation.",actions:["Open settings","Open help and support"]},
  "need-help":{title:"Need help?",description:"Use the local sample support conversation; no agent receives messages.",actions:["Open help and support"]},
  "nominee-registration":{title:"Nominee details",description:"Sample nominee workflow preview; no registration is submitted.",actions:["Open settings","Open help and support"]},
  offers:{title:"Offers",description:"Offer-list placeholder. No eligibility is checked and no offer is activated.",actions:["Open help and support"]},
  "personal-details":{title:"Personal details",description:"View the sample personal data stored in Settings.",actions:["Open settings","View account details"]},
  "personal-loan-info":{title:"Personal loan information",description:"General loan information preview only; no application is sent.",actions:["Open help and support"]},
  "positive-pay":{title:"Positive pay",description:"Cheque confirmation workflow preview only; no instruction is submitted.",actions:["Open help and support"]},
  profile:{title:"Profile",description:"Profile information comes from the shared saved Settings data.",actions:["Open settings","View account details"]},
  recharge:{title:"Recharge",description:"Recharge workflow preview only; no operator is contacted and no recharge occurs.",actions:["Open help and support"]},
  save:{title:"Save",description:"Savings tools preview. No deposit or investment is created.",actions:["View account details","Open help and support"]},
  scan:{title:"Scan & pay",description:"Camera and payment rails are not connected. No QR payment is made.",actions:["Open sample transfer","Open help and support"]},
  security:{title:"Security",description:"This local demo PIN is not secure authentication. Never use a real banking PIN.",actions:["Open settings"]},
  "shop-and-pay":{title:"Shop and pay",description:"Shopping/payment workflow preview only. No order or payment is submitted.",actions:["View transactions","Open help and support"]},
  shop:{title:"Shop",description:"Shopping catalogue placeholder. No purchases are made.",actions:["Open help and support"]},
  "statement-analysis":{title:"Statement analysis",description:"Review your saved sample transaction list and account balance.",actions:["Open statement","View transactions"]},
  "switch-to-classic":{title:"Display options",description:"Classic mode is not a separate theme yet; the responsive Daybook layout is active.",actions:["Open settings"]},
  upi:{title:"UPI",description:"UPI registration and payment rails are not connected. No UPI payment is sent.",actions:["Manage beneficiaries","Open help and support"]},
  "video-call":{title:"Video call",description:"Video calling is not connected in this prototype.",actions:["Open help and support"]},
  "watch-demo":{title:"Watch demo",description:"This workspace is a local prototype; explore the routes from the navigation.",actions:["View overview","Open settings"]}
};
const featureAssets: Record<string, AssetKey> = {
  about: "help", "account-actions": "settings", "account-statement": "statement",
  "agent-live-chat": "help", "ai-assistant-chat": "help", alerts: "alerts",
  "all-accounts": "account", "app-settings": "settings", "bill-pay": "billPay",
  borrow: "loan", "bus-tickets": "bus", cards: "cards", "change-login-pin": "security",
  "change-transaction-pin": "security", "cheque-book-request": "account", complaints: "complaints",
  "contact-details": "profile", "contact-us-help": "help", "credit-card-apply": "cards",
  "current-account-details": "account", "digital-loan": "loan", "digital-planner": "offers",
  faqs: "faq", "fixed-deposit": "fixedDeposit", "fund-transfer": "transfer", help: "help",
  invest: "offers", "kyc-details": "security", "link-bank": "account", more: "help",
  "need-help": "help", "nominee-registration": "profile", offers: "offers",
  "personal-details": "profile", "personal-loan-info": "loan", "positive-pay": "statement",
  profile: "profile", recharge: "recharge", save: "account", scan: "scan", security: "security",
  "shop-and-pay": "shop", shop: "shop", "statement-analysis": "statement",
  "switch-to-classic": "settings", upi: "upi", "video-call": "video", "watch-demo": "help"
};
const links: Record<string,string> = {
  "Review sample account details":"/account-details","Open settings":"/settings","Open account details":"/account-details","Open statement":"/statement","Open sample support":"/help-support","Review saved sample chat":"/help-support","Review pending transactions":"/passbook","Review transactions":"/passbook","Open help and support":"/help-support","View transactions":"/passbook","View account details":"/account-details","Edit account settings":"/settings","Export sample data":"/settings","Open sample transfer flow":"/transfers","Start sample transfer":"/transfers","Manage beneficiaries":"/payees","Return to overview":"/dashboard","View sample account":"/account-details","Filter transactions":"/statement","Print sample statement":"/statement","Open sample transfer":"/transfers","View overview":"/dashboard"
};
export function FeaturePage({feature}:{feature:string}){
  const page=pages[feature];
  const [state,setState]=useState<State>(read());
  useEffect(()=>{const refresh=()=>setState(read());refresh();window.addEventListener("bob-new-state-change",refresh);window.addEventListener("storage",refresh);return()=>{window.removeEventListener("bob-new-state-change",refresh);window.removeEventListener("storage",refresh)}},[]);
  if (!page) return null;
  return <Shell><div className="page-heading apk-page-heading feature-page-heading"><ApkAssetIcon asset={featureAssets[feature] ?? "help"} size={30}/><div><h1>{page.title}</h1><p className="muted">{page.description}</p></div></div><div className="notice">SAMPLE WORKSPACE — no bank service, real payment, account verification or external submission is performed here.</div>
    <div className="notice" role="status"><strong>Original APK reference: UNVERIFIED.</strong> This BOB-NEW prototype is based on static APK resources; exact layout and navigation have not been confirmed from an original-app screenshot.</div><section className="card"><h2>Saved account snapshot</h2><div className="grid"><Info label="Profile" value={state.name}/><Info label="Account label" value={state.accountLabel}/><Info label="Sample account" value={state.maskedId}/><Info label="Mobile" value={state.mobile||"Not set"}/><Info label="Email" value={state.email||"Not set"}/><Info label="Branch" value={state.branch||"Not set"}/><Info label="Customer ID" value={state.customerId||"Not set"}/><Info label="Account number" value={state.accountNumber||"Not set"}/><Info label="IFSC-format code" value={state.ifsc||"Not set"}/><Info label="Address" value={state.address||"Not set"}/><Info label="Date of birth" value={state.dob||"Not set"}/><Info label="Calculated balance" value={money(balance(state))}/><Info label="Transactions" value={String(state.transactions.length)}/></div>
      <div className="actions">{page.actions.map(action=><Link key={action} className="btn secondary" href={links[action]||"/settings"}>{action}</Link>)}</div>
    </section>
    <section className="card"><h2>Recent saved transactions</h2>{state.transactions.map((t,index)=>({t,index})).sort((a,b)=>b.t.date.localeCompare(a.t.date)||b.index-a.index).slice(0,5).map(({t})=><div className="row" key={t.id}><span>{t.description}<small className="muted">{t.date} · {t.status}</small></span><b>{t.type==="credit"?"+":"−"}{money(t.amount)}</b></div>)}{state.transactions.length===0&&<p className="muted">No sample transactions saved. Add them in Settings.</p>}</section>
  </Shell>
}
function Info({label,value}:{label:string;value:string}){return <div className="field"><span className="muted">{label}</span><b>{value}</b></div>}