"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/app-shell";
import { read, balance, money, type State } from "@/lib/demo";

export default function AccountDetailsPage() {
  const [state, setState] = useState<State>(read());
  useEffect(() => {
    const refresh = () => setState(read());
    refresh();
    window.addEventListener("bob-new-state-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("bob-new-state-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const posted = state.transactions.filter(t => t.status === "posted").length;
  const pending = state.transactions.filter(t => t.status === "pending").length;
  return <Shell>
    <h1>Account details</h1>
    <p className="muted">A read-only overview of the current sample account profile. Edit sample values in Settings.</p>
    <div className="notice">SAMPLE ACCOUNT ONLY — these details are fictional and are not verified by a financial institution.</div>
    <section className="card">
      <div className="grid">
        <Detail label="Display name" value={state.name}/>
        <Detail label="Account label" value={state.accountLabel}/>
        <Detail label="Sample account identifier" value={state.maskedId}/>
        <Detail label="Calculated sample balance" value={money(balance(state))}/>
        <Detail label="Opening balance" value={money(state.openingBalance)}/>
        <Detail label="Posted transactions" value={String(posted)}/>
        <Detail label="Pending transactions" value={String(pending)}/>
      </div>
      <div className="actions"><Link className="btn" href="/settings">Edit sample account</Link><Link className="btn secondary" href="/statement">View statement</Link></div>
    </section>
    <section className="card">
      <h2>About this workspace</h2>
      <p>This independent Next.js prototype stores its sample data in this browser. It does not verify account ownership, contact a bank, or provide secure banking authentication.</p>
    </section>
  </Shell>;
}
function Detail({label,value}:{label:string;value:string}) { return <div className="field"><span className="muted">{label}</span><b>{value}</b></div>; }
