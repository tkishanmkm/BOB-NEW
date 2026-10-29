"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";
import { balance, money, read, saveState, getLocalRecord, type State } from "@/lib/demo";

type Stage = "details" | "review";
type Payee = { id: string; name: string; bank: string; account: string; code: string };
const PAYEES_KEY = "bob-new-sample-payees-v1";
function localCalendarDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function parseAmount(value: string): number | null {
  if (!/^(?:0|[1-9][0-9]*)(?:\.[0-9]{1,2})?$/.test(value)) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(Math.round(amount * 100))) return null;
  return Math.round(amount * 100) / 100;
}
function validPayees(value: unknown): Payee[] | null {
  if (!Array.isArray(value) || value.length > 500) return null;
  const ids = new Set<string>();
  const accounts = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const p = item as Partial<Payee>;
    if (typeof p.id !== "string" || !p.id.trim() || p.id.length > 100 || ids.has(p.id)
      || typeof p.name !== "string" || !p.name.trim() || p.name.length > 100
      || typeof p.bank !== "string" || !p.bank.trim() || p.bank.length > 100
      || typeof p.account !== "string" || !/^[0-9]{6,18}$/.test(p.account) || accounts.has(p.account)
      || typeof p.code !== "string" || !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(p.code)) return null;
    ids.add(p.id);
    accounts.add(p.account);
  }
  return value as Payee[];
}
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
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);

  const [payees, setPayees] = useState<Payee[]>([]);
  const [payeesLoadError, setPayeesLoadError] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState("");

  useEffect(() => {
    let active = true;
    (async () => { try {
      const saved: unknown = await getLocalRecord<unknown>(PAYEES_KEY, []);
      if (!active) return;
      const loaded = validPayees(saved);
      if (loaded) setPayees(loaded);
      else setPayeesLoadError(true);
    } catch { if (active) { setPayeesLoadError(true); } } })();
    return () => { active = false; };
  }, []);

  function choosePayee(id: string) {
    setSelectedPayee(id);
    const p = payees.find(item => item.id === id);
    if (p) { setRecipient(p.name); setBank(p.bank); setAccount(p.account); setIfsc(p.code); }
  }

  async function finish() {
    if (saveLock.current || saving) return;
    const value = parseAmount(amount);
    if (value === null) {
      setError("Enter a positive amount with no more than two decimal places.");
      setStage("details");
      return;
    }
    if (!recipient.trim() || !bank.trim() || !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc) || !/^[0-9]{6,18}$/.test(account)) {
      setError("Recipient details are invalid. Return to details and correct them.");
      setStage("details");
      return;
    }
    const current = read();
    // Reserve pending demo debits too, so repeated pending transfers cannot overspend the sample balance.
    const available = balance(current) - current.transactions.filter(t => t.type === "debit" && t.status === "pending").reduce((total, t) => total + t.amount, 0);
    if (!Number.isFinite(available) || available < 0) {
      setError("The saved sample balance is invalid. Review account settings before continuing.");
      return;
    }
    if (value > available) {
      setError("Insufficient available sample balance. Posted debits and pending demo debits are accounted for; reduce the amount or review sample account data in Settings.");
      setStage("details");
      return;
    }
    if (current.transactions.length >= 5000) {
      setError("The local transaction history has reached its 5,000-entry limit. No result was recorded.");
      return;
    }
    const transferId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "demo-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
    const next: State = {
      ...current,
      transactions: [
        ...current.transactions,
        {
          id: transferId,
          date: localCalendarDate(),
          description: "Demo transfer to " + recipient.trim() + (remark.trim() ? "\nNote: " + remark.trim() : ""),
          amount: value,
          type: "debit",
          status: "pending",
        },
      ],
    };
    saveLock.current = true;
    setSaving(true);
    setError("");
    try {
      const saved = await saveState(next);
      if (!saved) {
        setError("The sample result could not be saved in this browser. No result was recorded. Check browser storage and try again.");
        return;
      }
      router.push("/payment-successful?id=" + encodeURIComponent(transferId));
    } catch {
      setError("The sample result could not be saved or opened. Check browser storage and try again; no bank payment was sent.");
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  function review(e: React.FormEvent) {
    e.preventDefault();
    const n = parseAmount(amount);
    if (!recipient.trim() || !bank.trim() || !/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc) || !/^[0-9]{6,18}$/.test(account) || n === null) {
      setError("Check recipient and account details; enter a positive amount with no more than two decimal places.");
      return;
    }
    setError("");
    setStage("review");
  }

  return <Shell>
    <div className="page-heading apk-page-heading transfer-page-heading"><ApkAssetIcon asset="transfer" size={30}/><div><p className="eyebrow">PAYMENT SERVICES</p><h1>Fund transfer</h1><p className="muted">Review a transfer using locally stored prototype details.</p></div></div>
    <div className="info-banner"><Image src="/assets/institution-generic.svg" width={32} height={32} alt="" /><div><b>Local prototype</b><div>No money is moved and no bank is contacted. Finishing records a pending result in this browser’s transaction history.</div></div></div>
    <div className="stepper"><span className={stage === "details" ? "active" : ""}>1 · Details</span><span className={stage === "review" ? "active" : ""}>2 · Review</span><span>3 · Result</span></div>
    {stage === "details" && <form className="card transfer-form" onSubmit={review}>
      <h2>Recipient details</h2><p className="muted">Use fictional information only. Do not enter sensitive banking details.</p>
      <Field label="Choose a saved beneficiary"><select value={selectedPayee} onChange={e => choosePayee(e.target.value)}><option value="">Enter details manually</option>{payees.map(p => <option key={p.id} value={p.id}>{p.name} · •••• {p.account.slice(-4)}</option>)}</select></Field>
      {payeesLoadError ? <p className="error" role="alert">Saved beneficiary data is invalid or could not be loaded. No saved recipients are shown. You may enter fictional placeholder details manually, but inspect or recover browser data before editing beneficiaries.</p> : payees.length === 0 && <p className="muted">No saved beneficiaries yet. Add a recipient on the <Link href="/payees">Beneficiaries page</Link>.</p>}
      <div className="grid">
        <Field label="Recipient name"><input value={recipient} maxLength={100} onChange={e => setRecipient(e.target.value)} required /></Field>
        <Field label="Institution name"><input value={bank} maxLength={100} onChange={e => setBank(e.target.value)} required /></Field>
        <Field label="Account number"><input inputMode="numeric" value={account} maxLength={18} onChange={e => setAccount(e.target.value.replace(/[^0-9]/g, ""))} required /><small>Use placeholder details only</small></Field>
        <Field label="IFSC-format code"><input value={ifsc} maxLength={11} onChange={e => setIfsc(e.target.value.toUpperCase())} required /></Field>
        <Field label="Amount (₹)"><input type="number" inputMode="decimal" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required /></Field>
        <Field label="Note (optional)"><input value={remark} maxLength={120} onChange={e => setRemark(e.target.value)} /></Field>
      </div>
      {error && <p className="error" role="alert">{error}</p>}<button type="submit">Review transfer</button>
    </form>}
    {stage === "review" && <section className="card transfer-review-card">
      <div className="transfer-review-heading"><div><p className="eyebrow">STEP 2 OF 3</p><h2>Review transfer</h2></div><ApkAssetIcon asset="account" size={26}/></div>
      <div className="receipt-row"><span>Recipient</span><b>{recipient}</b></div><div className="receipt-row"><span>Institution</span><b>{bank}</b></div><div className="receipt-row"><span>Account</span><b>•••• {account.slice(-4)}</b></div><div className="receipt-row"><span>IFSC-format code</span><b>{ifsc}</b></div><div className="receipt-row"><span>Amount</span><b>{money(Number(amount))}</b></div><div className="receipt-row"><span>Note</span><b>{remark || "—"}</b></div>
      <p className="warning">NO PAYMENT WILL BE SENT — LOCAL PROTOTYPE ONLY</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions"><button type="button" className="secondary" onClick={() => { setStage("details"); setError(""); }}>Back to edit</button><button type="button" onClick={finish} disabled={saving}>{saving ? "Saving sample result…" : "Finish and view result"}</button></div>
    </section>}
  </Shell>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="field">{label}{children}</label>; }
