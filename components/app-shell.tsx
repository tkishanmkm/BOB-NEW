"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hydrate } from "@/lib/demo";

const DEMO_SESSION_KEY = "bob-new-demo-session-v1";
export function Shell({children}:{children:React.ReactNode}) {
  const router = useRouter();
  const pathname = usePathname();
  const [gateChecked, setGateChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    hydrate().then(() => { if (active) setStorageReady(true); }).catch((error: unknown) => { if (active) { const detail = error instanceof Error ? error.message : "Unknown browser-storage error."; setStorageError(`Saved local data could not be loaded: ${detail} Existing records are preserved and editing remains locked.`); setStorageUnavailable(true); setStorageReady(true); } });
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
  if (!gateChecked || !allowed || !storageReady) return <main className="main" aria-live="polite"><p className="muted">Opening your local account workspace…</p></main>;
  if (storageUnavailable) return <main className="main" role="alert"><section className="card"><h1>Local storage unavailable</h1><p>{storageError}</p><p>Check browser storage availability and retry. If the message reports invalid saved data, do not reset or clear this site’s data; recoverable records may still be present. Account changes remain disabled until the issue is resolved.</p><button type="button" onClick={() => window.location.reload()}>Retry storage</button><button type="button" className="secondary" onClick={() => { try { sessionStorage.removeItem(DEMO_SESSION_KEY); } finally { router.replace("/"); } }}>Exit workspace</button></section></main>;
  const routes = [["/dashboard","Overview"],["/account-details","Account Details"],["/passbook","Transactions"],["/statement","Statement"],["/receipt","Transaction Receipt"],["/transfers","Fund Transfer"],["/payees","Beneficiaries"],["/help-support","Help & Support"],["/demo-documents","Account Summary"],["/settings","Settings"],["/about","About"],["/account-actions","Account Actions"],["/account-statement","Account Statement"],["/agent-live-chat","Agent Live Chat"],["/ai-assistant-chat","AI Assistant Chat"],["/alerts","Alerts"],["/all-accounts","All Accounts"],["/app-settings","App Settings"],["/bill-pay","Bill Pay"],["/borrow","Borrow"],["/bus-tickets","Bus Tickets"],["/cards","Cards"],["/change-login-pin","Change Login PIN"],["/change-transaction-pin","Change Transaction PIN"],["/cheque-book-request","Cheque Book Request"],["/complaints","Complaints"],["/contact-details","Contact Details"],["/contact-us-help","Contact Us Help"],["/credit-card-apply","Credit Card Apply"],["/current-account-details","Current Account Details"],["/digital-loan","Digital Loan"],["/digital-planner","Digital Planner"],["/faqs","FAQs"],["/fixed-deposit","Fixed Deposit"],["/fund-transfer","Fund Transfer (legacy path)"],["/help","Help"],["/invest","Invest"],["/kyc-details","KYC Details"],["/link-bank","Link Bank"],["/more","More"],["/need-help","Need Help"],["/nominee-registration","Nominee Registration"],["/offers","Offers"],["/personal-details","Personal Details"],["/personal-loan-info","Personal Loan Info"],["/positive-pay","Positive Pay"],["/profile","Profile"],["/recharge","Recharge"],["/save","Save"],["/scan","Scan"],["/security","Security"],["/shop-and-pay","Shop And Pay"],["/shop","Shop"],["/statement-analysis","Statement Analysis"],["/switch-to-classic","Switch To Classic"],["/upi","UPI"],["/video-call","Video Call"],["/watch-demo","Watch Demo"]] as const;
  return <>
    <a className="skip-link" href="#main-content">Skip to page content</a>
    <header><Link className="brand brand-row" href="/dashboard"><Image src="/assets/bob-world/bob-world-logo.svg" width={34} height={34} alt="Bank of Baroda logo — unofficial demo"/><span>BOB World 2.0 · DEMO</span></Link><div className="actions"><span className="pill">LOCAL WORKSPACE</span><button type="button" className="secondary" onClick={() => { try { sessionStorage.removeItem(DEMO_SESSION_KEY); } finally { setAllowed(false); router.replace("/"); } }}>Exit</button></div></header>
    <div className="notice">LOCAL PROTOTYPE — records are saved on this device; no bank or payment server is connected.</div>
    <div className="layout"><nav className="nav" aria-label="Main navigation">{routes.map(([u,l])=><Link href={u} key={u} aria-current={pathname === u || pathname.startsWith(u + "/") ? "page" : undefined}>{l}</Link>)}</nav><main id="main-content" tabIndex={-1} className="main">{storageError && <div className="info-banner" role="alert">{storageError}</div>}{children}</main></div>
    <nav className="mobile-tabbar" aria-label="Primary mobile navigation">{[["/dashboard","⌂","Home"],["/transfers","⇄","Transfer"],["/passbook","▤","Passbook"],["/payees","♙","Payees"],["/more","⋯","More"]].map(([href,icon,label])=><Link key={href} href={href} aria-current={pathname===href || (href!=="/dashboard" && pathname.startsWith(href+"/")) ? "page" : undefined}><span className="mobile-tab-icon" aria-hidden="true">{icon}</span><span>{label}</span></Link>)}</nav>
  </>;
}

