"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT, hydrate, read } from "@/lib/demo";
const SESSION_KEY = "bob-new-demo-session-v1";
export default function Home() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [expected, setExpected] = useState(DEFAULT.demoPin);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    hydrate().then(() => { if (active) { setExpected(read().demoPin); setReady(true); } })
      .catch(() => { if (active) { setErr("Could not open this device's local database. Check browser storage settings and reload."); setReady(true); } });
    return () => { active = false; };
  }, []);
  return <main className="login-page"><section className="login-card"><div className="login-brand"><span className="daybook-mark" aria-hidden="true">D</span><div><h1>Daybook Demo</h1><p>Local account workspace</p></div></div><p className="muted">Your records are stored in this browser. This prototype is not connected to a bank or payment service.</p><form onSubmit={e => { e.preventDefault(); if (!ready) return; if (pin === expected) { try { sessionStorage.setItem(SESSION_KEY, "granted"); router.push("/dashboard"); } catch { setErr("Session storage is unavailable. Enable browser storage to continue."); } } else setErr("Incorrect access PIN."); }}><label className="field">Access PIN<input type="password" inputMode="numeric" autoComplete="current-password" value={pin} maxLength={6} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ""))} required /></label>{err && <p className="error" role="alert">{err}</p>}<button disabled={!ready}>{ready ? "Continue" : "Opening local account…"}</button></form><p className="muted login-footnote">Initial PIN: 2468. This local access gate is for prototype navigation only and is not secure authentication.</p></section></main>;
}
