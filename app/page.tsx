"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT, hydrate, read } from "@/lib/demo";
import Image from "next/image";
const SESSION_KEY = "bob-new-demo-session-v1";
export default function Home() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [expected, setExpected] = useState(DEFAULT.demoPin);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  useEffect(() => {
    let active = true;
    hydrate().then(() => {
      if (!active) return;
      setExpected(read().demoPin);
      try {
        if (sessionStorage.getItem(SESSION_KEY) === "granted") {
          setRedirecting(true);
          router.replace("/dashboard");
          return;
        }
      } catch {
        setErr("Session storage is unavailable. Continuing requires browser storage to be enabled.");
      }
      setReady(true);
    }).catch(() => { if (active) { setErr("Could not open this device's local database. Check browser storage settings and reload."); setReady(true); } });
    return () => { active = false; };
  }, [router]);
  if (redirecting) return <main className="main" aria-live="polite"><p className="muted">Opening your local account workspace…</p></main>;
  return <main className="login-page"><section className="login-card"><div className="login-brand"><Image className="bob-world-logo" src="/assets/bob-world/bob-world-logo.svg" width={54} height={54} alt="Bank of Baroda logo — unofficial demo"/><div><h1>BOB World 2.0 <span className="prototype-tag">DEMO</span></h1><p>Local account workspace</p></div></div><p className="muted">Your records are stored in this browser. This prototype is not connected to a bank or payment service.</p><form onSubmit={e => { e.preventDefault(); if (!ready) return; if (pin === expected) { try { sessionStorage.setItem(SESSION_KEY, "granted"); router.push("/dashboard"); } catch { setErr("Session storage is unavailable. Enable browser storage to continue."); } } else setErr("Incorrect access PIN."); }}><label className="field">Access PIN<input type="password" inputMode="numeric" autoComplete="current-password" value={pin} maxLength={6} onChange={e => setPin(e.target.value.replace(/[^0-9]/g, ""))} required /></label>{err && <p className="error" role="alert">{err}</p>}<button disabled={!ready}>{ready ? "Continue" : "Opening local account…"}</button></form><p className="muted login-footnote">Initial PIN: 2468. This local access gate is for prototype navigation only and is not secure authentication.</p></section></main>;
}
