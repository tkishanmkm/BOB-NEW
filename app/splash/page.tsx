"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const [showContinue, setShowContinue] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowContinue(true), 450);
    return () => window.clearTimeout(timer);
  }, []);
  return <main className="splash-page">
    <section className="splash-card">
      <Image className="bob-world-logo splash-logo" src="/assets/bob-world/bob-world-logo.svg" width={88} height={88} alt="Bank of Baroda logo — unofficial demo"/>
      <p className="eyebrow">INDEPENDENT UI PROTOTYPE</p>
      <h1>BOB World 2.0</h1>
      <p className="splash-subtitle">A local account workspace prototype</p>
      <div className="splash-progress" aria-label="Prototype ready"><span /></div>
      <p className="splash-note">Sample interface only. Not an official bank application; no bank or payment network is connected.</p>
      {showContinue && <Link className="btn splash-continue" href="/">Continue to prototype <span aria-hidden="true">→</span></Link>}
    </section>
    <footer>BOB-NEW · UNOFFICIAL PROTOTYPE · SAMPLE DATA ONLY</footer>
  </main>;
}
