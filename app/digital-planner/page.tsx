"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { ApkAssetIcon } from "@/components/apk-asset-map";

type PlanItem = { id: string; title: string; category: string; date: string; done: boolean };
const STORAGE_KEY = "bob-new-local-digital-planner-v1";
const categories = ["Savings habit", "Bill reminder", "Personal goal", "Learning"];

export default function DigitalPlannerPage() {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item): item is PlanItem =>
            item && typeof item.id === "string" && typeof item.title === "string" &&
            typeof item.category === "string" && typeof item.date === "string" &&
            typeof item.done === "boolean"
          ));
        }
      }
    } catch {
      setMessage("Saved planner data could not be read. Your browser storage was left unchanged.");
    } finally {
      setReady(true);
    }
  }, []);

  function persist(next: PlanItem[]) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setItems(next);
      setMessage("Saved in this browser only.");
    } catch {
      setMessage("Could not save. Check browser storage availability and try again.");
    }
  }

  function addItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) { setMessage("Enter a short title for your plan."); return; }
    if (cleanTitle.length > 80) { setMessage("Keep the title to 80 characters or fewer."); return; }
    const next: PlanItem[] = [{ id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: cleanTitle, category, date, done: false }, ...items];
    persist(next);
    setTitle("");
    setDate("");
  }

  function toggleItem(id: string) {
    persist(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  }

  function removeItem(id: string) {
    persist(items.filter(item => item.id !== id));
  }

  function clearPlan() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setItems([]);
      setMessage("Local plan cleared.");
    } catch {
      setMessage("Could not clear the plan from browser storage.");
    }
  }

  const completed = items.filter(item => item.done).length;
  return <Shell>
    <div className="page-heading apk-page-heading"><ApkAssetIcon asset="alerts" size={30}/><div><p className="eyebrow">PLAN AHEAD</p><h1>Digital planner</h1><p className="muted">Keep simple reminders and personal goals in this browser.</p></div></div>
    <div className="notice"><strong>LOCAL DEMO ONLY.</strong> Plans are stored in this browser and are not synced with Bank of Baroda or sent to any bank service. Do not enter account numbers, PINs, passwords, or other sensitive information.</div>
    <section className="card">
      <div className="section-title"><div><h2>Add a plan</h2><p className="muted">Use this as a personal reminder list, not as an official bank reminder service.</p></div><ApkAssetIcon asset="alerts" size={24}/></div>
      <form onSubmit={addItem} className="form-grid">
        <label className="field">Plan title<input value={title} onChange={event => setTitle(event.target.value)} maxLength={80} placeholder="e.g. Review monthly budget" required /></label>
        <label className="field">Category<select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="field">Reminder date (optional)<input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>
        <div className="actions"><button type="submit" disabled={!ready}>Save plan</button></div>
      </form>
      <p className="muted" role="status" aria-live="polite">{message || (ready ? "Changes stay on this device." : "Loading saved plans…")}</p>
    </section>
    <section className="card">
      <div className="section-title"><div><h2>Your plans</h2><p className="muted">{completed} of {items.length} completed</p></div><button type="button" className="secondary" onClick={clearPlan} disabled={!items.length}>Clear all</button></div>
      {!items.length ? <div className="empty-state"><h3>No plans saved</h3><p>Add a personal goal or reminder above to get started.</p></div> :
        <div className="list">{items.map(item => <article className="row" key={item.id}>
          <div><strong className={item.done ? "muted" : ""}>{item.title}</strong><small className="muted">{item.category}{item.date ? ` · ${item.date}` : ""}</small></div>
          <div className="actions"><button type="button" className="secondary" onClick={() => toggleItem(item.id)}>{item.done ? "Mark open" : "Complete"}</button><button type="button" className="secondary" onClick={() => removeItem(item.id)} aria-label={`Delete ${item.title}`}>Delete</button></div>
        </article>)}</div>}
    </section>
  </Shell>;
}
