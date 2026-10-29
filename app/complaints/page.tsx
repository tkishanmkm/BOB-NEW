"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

const STORAGE_KEY = "bob-new-local-complaint-draft-v1";
const CATEGORIES = ["Account information", "Card services", "Digital banking", "Transaction query", "Other"] as const;
type Draft = { category: string; subject: string; details: string; reference: string; savedAt: string };
const EMPTY: Draft = { category: "Other", subject: "", details: "", reference: "", savedAt: "" };

function validDraft(value: unknown): value is Draft {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<Draft>;
  return typeof v.category === "string" && (CATEGORIES as readonly string[]).includes(v.category)
    && typeof v.subject === "string" && v.subject.length <= 120
    && typeof v.details === "string" && v.details.length <= 3000
    && typeof v.reference === "string" && v.reference.length <= 100
    && typeof v.savedAt === "string";
}

export default function ComplaintsPage() {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validDraft(parsed)) setDraft(parsed);
        else setMessage("The saved draft was invalid and has not been loaded.");
      }
    } catch {
      setMessage("Browser storage is unavailable. Draft saving may not work.");
    }
    setReady(true);
  }, []);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = draft.subject.trim();
    const details = draft.details.trim();
    const reference = draft.reference.trim();
    if (!subject || subject.length > 120 || !details || details.length > 3000 || reference.length > 100) {
      setMessage("Enter a subject and details within the stated limits before saving.");
      return;
    }
    const next: Draft = { ...draft, subject, details, reference, savedAt: new Date().toISOString() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDraft(next);
      setMessage("Draft saved in this browser only. Nothing was sent to the bank.");
    } catch {
      setMessage("Could not save the draft. Check browser storage availability.");
    }
  }

  function clearDraft() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setDraft(EMPTY);
      setMessage("Local draft cleared.");
    } catch {
      setMessage("Could not clear the draft from browser storage.");
    }
  }

  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="complaints" size={30}/><div><p className="eyebrow">HELP & SUPPORT</p><h1>Complaint draft</h1><p className="muted">Prepare a local note for your own reference.</p></div></div>
    <div className="notice" role="note"><strong>DEMO ONLY.</strong> This page is not connected to Bank of Baroda or a support desk. Saving a draft does not submit a complaint, create a case, or contact anyone. Do not enter passwords, PINs, OTPs, or sensitive identity information.</div>
    <section className="card">
      <h2>{draft.savedAt ? "Saved local draft" : "New draft"}</h2>
      <form onSubmit={saveDraft}>
        <label className="field">Category<select value={draft.category} onChange={e => update("category", e.target.value)}>{CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
        <label className="field">Subject<input value={draft.subject} maxLength={120} required onChange={e => update("subject", e.target.value)} placeholder="Short summary"/></label>
        <label className="field">Reference (optional)<input value={draft.reference} maxLength={100} onChange={e => update("reference", e.target.value)} placeholder="Your own non-sensitive reference"/></label>
        <label className="field">Details<textarea value={draft.details} maxLength={3000} required rows={6} onChange={e => update("details", e.target.value)} placeholder="Describe the issue without passwords, PINs or OTPs"/></label>
        <p className="muted">{draft.details.length}/3000 characters. Saved drafts remain in this browser only.</p>
        <div className="actions"><button type="submit" disabled={!ready}>Save local draft</button><button type="button" className="btn secondary" onClick={clearDraft} disabled={!ready}>Clear draft</button></div>
      </form>
      {message && <p className="muted" role="status" aria-live="polite">{message}</p>}
      {draft.savedAt && <p className="muted">Last saved: {new Date(draft.savedAt).toLocaleString()}</p>}
    </section>
    <p className="muted">Original APK visual reference remains unverified; this is a local prototype workflow, not a bank complaint submission.</p>
  </Shell>;
}
