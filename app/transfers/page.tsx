"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/app-shell";
import { money, read, write, getLocalRecord, type State } from "@/lib/demo";

type Stage = "details" | "review";
type Payee = { id: string; name: string; bank: string; account: string; code: string };
const PAYEES_KEY = "bob-new-sample-payees-v1";
export default function Transfers() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("details");
  const [recipient, setRecipient] = useState("Recipient");
  const [bank, setBank] = useState("Institution");
  const [account, setAccount] = useState("0000004821");
  const [ifsc, setIfsc] = useState("SAMP0000001");
  const [amount, setAmount] = useState("100");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [payees, setPayees] = useState<Payee[]>([]);
  const [selectedPayee, setSelectedPayee] = useState("");

  useEffect(() => {
    let active = true;
    (async () => { try {
      const saved: unknown = await getLocalRecord<unknown>(PAYEES_KEY, []);
      if (active && Array.isArray(saved)) setPayees(saved.filter((p): p is Payee => !!p && typeof p.id === "string" && typeof p.name === "string" && typeof p.bank === "string" && typeof p.account === "string" && typeof p.code === "string"));
    } catch { if (active) setPayees([]); } })();
    return () => { active = false; };
  }, []);

  function choosePayee(id: string) {
    setSelectedPayee(id);
    const p = payees.find(item => item.id === id);
    if (p) { setRecipient(p.name); setBank(p.bank); setAccount(p.account); setIfsc(p.code); }
  }

  function finish() {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid positive amount.");
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
          description: "Transfer result for " + recipient.trim() + (remark.trim() ? " · " + remark.trim() : ""),
          amount: value,
          type: "debit",
          status: "pending",
        },
      ],
    };
    if (!write(next)) {
      setError("The transfer result could not be saved in this browser. Check browser storage and try again.");
      return;
    }
    router.push("/payment-successful");
  }

  function review(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount);
    if (!recipient.trim() || !bank.trim() || !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc) || !/^[0-9]{6,18}$/.test(account) || !Number.isFinite(n) || n <= 0) {
      setError("Check recipient, account number, code and positive amount.");
      return;
    }
    setError("");
    setStage("review");
  }

  return <Shell>
    <div className="page-heading"><Image src="/assets/transfer-generic.svg" width={36} height={36} alt="" /><div><h1>Fund transfer</h1><p className="muted">Review a transfer using locally stored prototype details.</p></div></div>
    <div className="info-banner"><Image src="/assets/institution-generic.svg" width={32} height={32} alt="" /><div><b>Local prototype</b><div>No money is moved and no bank is contacted. Finishing records a pending result in this browser’s transaction history.</div></div></div>
    <div className="stepper"><span className={stage === "details" ? "active" : ""}>1 · Details</span><span className={stage === "review" ? "active" : ""}>2 · Review</span><span>3 · Result</span></div>
    {stage === "details" && <form className="card" onSubmit={review}>
      <h2>Recipient details</h2><p className="muted">Use fictional information only. Do not enter sensitive banking details.</p>
      <Field label="Choose a saved beneficiary"><select value={selectedPayee} onChange={e => choosePayee(e.target.value)}><option value="">Enter details manually</option>{payees.map(p => <option key={p.id} value={p.id}>{p.name} · •••• {p.account.slice(-4)}</option>)}</select></Field>
      {payees.length === 0 && <p className="muted">No saved beneficiaries yet. Add a recipient on the <Link href="/payees">Beneficiaries page</Link>.</p>}
      <div className="grid">
        <Field label="Recipient name"><input value={recipient} maxLength={100} onChange={e => setRecipient(e.target.value)} required /></Field>
        <Field label="Institution name"><input value={bank} maxLength={100} onChange={e => setBank(e.target.value)} required /></Field>
        <Field label="Account number"><input inputMode="numeric" value={account} maxLength={18} onChange={e => setAccount(e.target.value.replace(/[^0-9]/g, ""))} required /><small>Use placeholder details only</small></Field>
        <Field label="IFSC-format code"><input value={ifsc} maxLength={11} onChange={e => setIfsc(e.target.value.toUpperCase())} required /></Field>
        <Field label="Amount (₹)"><input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required /></Field>
        <Field label="Note (optional)"><input value={remark} maxLength={120} onChange={e => setRemark(e.target.value)} /></Field>
      </div>
      {error && <p className="error" role="alert">{error}</p>}<button type="submit">Review transfer</button>
    </form>}
    {stage === "review" && <section className="card">
      <h2>Review transfer</h2>
      <div className="receipt-row"><span>Recipient</span><b>{recipient}</b></div><div className="receipt-row"><span>Institution</span><b>{bank}</b></div><div className="receipt-row"><span>Account</span><b>•••• {account.slice(-4)}</b></div><div className="receipt-row"><span>IFSC-format code</span><b>{ifsc}</b></div><div className="receipt-row"><span>Amount</span><b>{money(Number(amount))}</b></div><div className="receipt-row"><span>Note</span><b>{remark || "—"}</b></div>
      <p className="warning">NO PAYMENT WILL BE SENT — LOCAL PROTOTYPE ONLY</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions"><button type="button" className="secondary" onClick={() => { setStage("details"); setError(""); }}>Back to edit</button><button type="button" onClick={finish}>Finish and view result</button></div>
    </section>}
  </Shell>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field">{label}{children}</label>; }
