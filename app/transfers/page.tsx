"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/app-shell";
import { money, read, write, type State } from "@/lib/demo";

type Stage = "details" | "review";
export default function Transfers() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("details");
  const [recipient, setRecipient] = useState("Sample recipient");
  const [bank, setBank] = useState("Sample institution");
  const [account, setAccount] = useState("0000004821");
  const [ifsc, setIfsc] = useState("SAMP0000001");
  const [amount, setAmount] = useState("100");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");

  function finish() {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid positive sample amount.");
      setStage("details");
      return;
    }
    const current = read();
    const next: State = {
      ...current,
      transactions: [
        ...current.transactions,
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString().slice(0, 10),
          description: "SIMULATION — Transfer preview to " + recipient.trim() + (remark.trim() ? " · " + remark.trim() : ""),
          amount: value,
          type: "debit",
          status: "pending",
        },
      ],
    };
    if (!write(next)) {
      setError("The sample result could not be saved in this browser. Check browser storage and try again.");
      return;
    }
    router.push("/payment-successful");
  }

  function review(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!recipient.trim() || !bank.trim() || !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc) || !/^[0-9]{6,18}$/.test(account) || !Number.isFinite(n) || n <= 0) {
      setError("Check recipient, sample account number, IFSC-format code and positive amount.");
      return;
    }
    setError("");
    setStage("review");
  }

  return <Shell>
    <div className="page-heading"><Image src="/assets/transfer-generic.svg" width={36} height={36} alt="" /><div><h1>Fund transfer</h1><p className="muted">Create a sample transfer preview using fictional details.</p></div></div>
    <div className="info-banner"><Image src="/assets/institution-generic.svg" width={32} height={32} alt="" /><div><b>Simulation only</b><div>No money is moved and no bank is contacted. Finishing creates a pending sample entry in this browser’s transaction history.</div></div></div>
    <div className="stepper"><span className={stage === "details" ? "active" : ""}>1 · Details</span><span className={stage === "review" ? "active" : ""}>2 · Review</span><span>3 · Result</span></div>
    {stage === "details" && <form className="card" onSubmit={review}>
      <h2>Recipient details</h2><p className="muted">Use sample information only. Do not enter real banking details.</p>
      <div className="grid">
        <Field label="Recipient name"><input value={recipient} maxLength={100} onChange={e => setRecipient(e.target.value)} required /></Field>
        <Field label="Institution name"><input value={bank} maxLength={100} onChange={e => setBank(e.target.value)} required /></Field>
        <Field label="Sample account number"><input inputMode="numeric" value={account} maxLength={18} onChange={e => setAccount(e.target.value.replace(/[^0-9]/g, ""))} required /><small>Fictional details only</small></Field>
        <Field label="IFSC-format sample code"><input value={ifsc} maxLength={11} onChange={e => setIfsc(e.target.value.toUpperCase())} required /></Field>
        <Field label="Amount (₹)"><input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required /></Field>
        <Field label="Note (optional)"><input value={remark} maxLength={120} onChange={e => setRemark(e.target.value)} /></Field>
      </div>
      {error && <p className="error" role="alert">{error}</p>}<button type="submit">Review transfer</button>
    </form>}
    {stage === "review" && <section className="card">
      <h2>Review sample transfer</h2>
      <div className="receipt-row"><span>Recipient</span><b>{recipient}</b></div><div className="receipt-row"><span>Institution</span><b>{bank}</b></div><div className="receipt-row"><span>Sample account</span><b>•••• {account.slice(-4)}</b></div><div className="receipt-row"><span>IFSC-format code</span><b>{ifsc}</b></div><div className="receipt-row"><span>Amount</span><b>{money(Number(amount))}</b></div><div className="receipt-row"><span>Note</span><b>{remark || "—"}</b></div>
      <p className="warning">SIMULATION ONLY — NO PAYMENT WILL BE SENT</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions"><button type="button" className="secondary" onClick={() => { setStage("details"); setError(""); }}>Back to edit</button><button type="button" onClick={finish}>Finish sample preview</button></div>
    </section>}
  </Shell>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field">{label}{children}</label>; }
