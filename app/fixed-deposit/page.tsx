"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const money = (value: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2,
}).format(Number.isFinite(value) ? value : 0);

export default function FixedDepositPage() {
  const [principal, setPrincipal] = useState("10000");
  const [annualRate, setAnnualRate] = useState("6");
  const [tenureMonths, setTenureMonths] = useState("12");
  const [frequency, setFrequency] = useState("4");

  const result = useMemo(() => {
    const p = Number(principal);
    const rate = Number(annualRate);
    const months = Number(tenureMonths);
    const periods = Number(frequency);
    if (!Number.isFinite(p) || p < 1 || p > 100000000
      || !Number.isFinite(rate) || rate < 0 || rate > 30
      || !Number.isInteger(months) || months < 1 || months > 120
      || !Number.isInteger(periods) || periods < 1 || periods > 12) return null;
    const years = months / 12;
    const maturity = p * Math.pow(1 + rate / 100 / periods, periods * years);
    if (!Number.isFinite(maturity)) return null;
    return { principal: p, maturity, interest: maturity - p, months, rate, periods };
  }, [principal, annualRate, tenureMonths, frequency]);

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="fixedDeposit" size={30}/><div><p className="eyebrow">SAVINGS TOOLS</p><h1>Fixed deposit calculator</h1><p className="muted">Estimate an illustrative maturity value using a rate you enter.</p></div></div>
    <div className="notice" role="note"><strong>DEMO CALCULATOR ONLY.</strong> This is not a Bank of Baroda rate quote or deposit application. Rates, eligibility, tax, payout options, and actual maturity amounts must be confirmed with the bank. Nothing is opened and no money is moved.</div>
    <section className="card">
      <h2>Estimate your maturity amount</h2>
      <div className="grid">
        <label className="field">Deposit amount (₹)<input type="number" min="1" max="100000000" step="1" inputMode="decimal" value={principal} onChange={e=>setPrincipal(e.target.value)} /></label>
        <label className="field">Annual interest rate (%)<input type="number" min="0" max="30" step="0.01" inputMode="decimal" value={annualRate} onChange={e=>setAnnualRate(e.target.value)} /></label>
        <label className="field">Tenure (months)<input type="number" min="1" max="120" step="1" inputMode="numeric" value={tenureMonths} onChange={e=>setTenureMonths(e.target.value)} /></label>
        <label className="field">Compounding frequency<select value={frequency} onChange={e=>setFrequency(e.target.value)}><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></label>
      </div>
      {result ? <div className="card" aria-live="polite"><p className="muted">Illustrative maturity value</p><h2>{money(result.maturity)}</h2><div className="grid"><div className="field"><span className="muted">Principal</span><b>{money(result.principal)}</b></div><div className="field"><span className="muted">Estimated interest</span><b>{money(result.interest)}</b></div><div className="field"><span className="muted">Tenure</span><b>{result.months} months</b></div><div className="field"><span className="muted">Entered annual rate</span><b>{result.rate.toFixed(2)}%</b></div></div></div> : <p className="muted" role="alert">Enter a valid amount, rate (0–30%), tenure (1–120 months), and compounding frequency.</p>}
      <p className="muted">Calculation uses the compound-interest formula A = P(1 + r/n)^(nt), prorated by tenure in years. It excludes taxes, penalties, special rates, and bank-specific terms.</p>
    </section>
  </Shell>;
}
