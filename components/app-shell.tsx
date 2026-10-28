"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hydrate } from "@/lib/demo";

const DEMO_SESSION_KEY = "bob-new-demo-session-v1";
export function Shell({children}:{children:React.ReactNode}) {
  const router = useRouter();
  const [gateChecked, setGateChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    hydrate().then(() => { if (active) setStorageReady(true); }).catch(() => { if (active) { setStorageError("Local storage could not be opened. The workspace is locked to protect saved records."); setStorageUnavailable(true); setStorageReady(true); } });
    const onStorageError = (event: Event) => { const detail = (event as CustomEvent<string>).detail; setStorageError(detail || "A local save failed."); };
    window.addEventListener("bob-new-storage-error", onStorageError);
    try {
      const ok = sessionStorage.getItem(DEMO_SESSION_KEY) === "granted";
      if (active) { setAllowed(ok); setGateChecked(true); if (!ok) router.replace("/"); }
    } catch {
      if (active) { setAllowed(false); setGateChecked(true); router.replace("/"); }
    }
    return () => { active = false; window.removeEventListener("bob-new-storage-error", onStorageError); };
  }, [router]);
  if (!gateChecked || !allowed || !storageReady) return <main className="main" aria-live="polite"><p className="muted">Opening your local account workspaceâ€¦</p></main>;
  if (storageUnavailable) return <main className="main" role="alert"><section className="card"><h1>Local storage unavailable</h1><p>{storageError}</p><p>Enable browser storage for this site, then retry. No account changes can be made here.</p><button type="button" onClick={() => window.location.reload()}>Retry storage</button><button type="button" className="secondary" onClick={() => { try { sessionStorage.removeItem(DEMO_SESSION_KEY); } finally { router.replace("/"); } }}>Exit workspace</button></section></main>;
  const routes = [["/dashboard","Overview"],["/account-details","Account Details"],["/passbook","Transactions"],["/statement","Statement"],["/receipt","Transaction Receipt"],["/transfers","Fund Transfer"],["/payees","Beneficiaries"],["/help-support","Help & Support"],["/demo-documents","Account Summary"],["/settings","Settings"],["/about","About"],["/account-actions","Account Actions"],["/account-statement","Account Statement"],["/agent-live-chat","Agent Live Chat"],["/ai-assistant-chat","AI Assistant Chat"],["/alerts","Alerts"],["/all-accounts","All Accounts"],["/app-settings","App Settings"],["/bill-pay","Bill Pay"],["/borrow","Borrow"],["/bus-tickets","Bus Tickets"],["/cards","Cards"],["/change-login-pin","Change Login PIN"],["/change-transaction-pin","Change Transaction PIN"],["/cheque-book-request","Cheque Book Request"],["/complaints","Complaints"],["/contact-details","Contact Details"],["/contact-us-help","Contact Us Help"],["/credit-card-apply","Credit Card Apply"],["/current-account-details","Current Account Details"],["/digital-loan","Digital Loan"],["/digital-planner","Digital Planner"],["/faqs","FAQs"],["/fixed-deposit","Fixed Deposit"],["/fund-transfer","Fund Transfer (legacy path)"],["/help","Help"],["/invest","Invest"],["/kyc-details","KYC Details"],["/link-bank","Link Bank"],["/more","More"],["/need-help","Need Help"],["/nominee-registration","Nominee Registration"],["/offers","Offers"],["/personal-details","Personal Details"],["/personal-loan-info","Personal Loan Info"],["/positive-pay","Positive Pay"],["/profile","Profile"],["/recharge","Recharge"],["/save","Save"],["/scan","Scan"],["/security","Security"],["/shop-and-pay","Shop And Pay"],["/shop","Shop"],["/statement-analysis","Statement Analysis"],["/switch-to-classic","Switch To Classic"],["/upi","UPI"],["/video-call","Video Call"],["/watch-demo","Watch Demo"]];
  return <>
    <header><Link className="brand brand-row" href="/dashboard"><Image src="/assets/daybook-mark.svg" width={30} height={30} alt="Daybook mark"/><span>Daybook · DEMO</span></Link><div className="actions"><span className="pill">LOCAL WORKSPACE</span><button type="button" className="secondary" onClick={() => { try { sessionStorage.removeItem(DEMO_SESSION_KEY); } finally { setAllowed(false); router.replace("/"); } }}>Exit</button></div></header>
    <div className="notice">LOCAL PROTOTYPE â€” records are saved on this device; no bank or payment server is connected.</div>
    <div className="layout"><nav className="nav" aria-label="Main navigation">{routes.map(([u,l])=><Link href={u} key={u}>{l}</Link>)}</nav><main className="main">{storageError && <div className="info-banner" role="alert">{storageError}</div>}{children}</main></div>
  </>;
}



