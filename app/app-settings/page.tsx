"use client";
import Link from "next/link";
import { Shell } from "@/components/app-shell";

const items = [
  { title: "Profile & account data", description: "Edit the sample account holder, account identifiers, contact details and transaction records.", href: "/settings", action: "Open Settings" },
  { title: "Data management", description: "Use the shared Settings screen to export account data, import validated JSON, or manage a workspace backup.", href: "/settings", action: "Manage local data" },
  { title: "Security information", description: "Review prototype security limits and demo PIN controls. These are not bank authentication.", href: "/security", action: "Review security" },
  { title: "Account details", description: "Review the current sample account details shown throughout this workspace.", href: "/account-details", action: "View account" },
  { title: "Contact details", description: "View the mobile, email and address stored in the sample profile.", href: "/contact-details", action: "View contacts" },
  { title: "About Daybook", description: "Understand what this prototype does, local-storage behavior and privacy precautions.", href: "/about", action: "Read about this app" },
];

export default function AppSettingsPage() {
  return <Shell>
    <div className="page-heading"><div><p className="eyebrow">PREFERENCES &amp; DATA</p><h1>App Settings</h1><p className="muted">Shortcuts to the shared settings and privacy controls for this local workspace.</p></div></div>
    <div className="notice" role="note"><strong>Local prototype only.</strong> These options do not change settings at a bank or send information to a banking service. Profile and data-management actions open the single shared Settings screen so there is one source of saved account data.</div>
    <div className="feature-grid">
      {items.map(item => <section className="card" key={item.title}>
        <h2>{item.title}</h2><p>{item.description}</p><Link className="btn secondary" href={item.href}>{item.action}</Link>
      </section>)}
    </div>
    <section className="card"><h2>Before changing or exporting data</h2><ul><li>Review imported JSON before confirming a restore.</li><li>Exported files can contain profile and transaction values; store them privately.</li><li>Browser-local data is not automatically encrypted and can be lost if site data is cleared.</li><li>Never enter real passwords, PINs, OTPs, card details or banking credentials.</li></ul><div className="actions"><Link className="btn secondary" href="/settings">Open shared Settings</Link><Link className="btn secondary" href="/dashboard">Return to overview</Link></div></section>
  </Shell>;
}
