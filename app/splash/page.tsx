"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "bob-new-demo-session-v1";

export default function SplashPage() {
  const router = useRouter();
  const [showContinue, setShowContinue] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "granted") {
        router.replace("/dashboard");
        return () => { active = false; };
      }
    } catch {
      // Keep the explicit continue path available when session storage is blocked.
    }

    const timer = window.setTimeout(() => {
      if (active) {
        setCheckingSession(false);
        setShowContinue(true);
      }
    }, 450);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [router]);

  return <main className="splash-page">
    <section className="splash-card" aria-busy={checkingSession}>
      <Image className="bob-world-logo splash-logo" src="/assets/bob-world/original-assets/assets/images/activateUpi/bob_world_logo.svg" width={88} height={88} alt="BOB World reference logo shown in an independent demo"/>
      <p className="eyebrow">INDEPENDENT UI PROTOTYPE</p>
      <h1>BOB World 2.0</h1>
      <p className="splash-subtitle">A local account workspace prototype</p>
      <div className="splash-progress" role="progressbar" aria-label="Preparing local prototype" aria-valuemin={0} aria-valuemax={100} aria-valuenow={showContinue ? 100 : 45}><span /></div>
      <p className="splash-note">Sample interface only. Not an official bank application; no bank or payment network is connected.</p>
      {showContinue && <Link className="btn splash-continue" href="/">Continue to prototype <span aria-hidden="true">→</span></Link>}
      {!showContinue && <p className="muted" role="status">Preparing local workspace…</p>}
    </section>
    <footer>BOB-NEW · UNOFFICIAL PROTOTYPE · SAMPLE DATA ONLY</footer>
  </main>;
}
