"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";

type Message = { id: string; text: string; sender: "you" | "daybook"; time: string };
const KEY = "bob-new-support-messages-v1";
const starter: Message[] = [{id:"welcome",text:"Hello! This is sample support for the Daybook prototype. Do not share passwords, PINs or real financial details.",sender:"daybook",time:"Welcome"}];

export default function HelpSupportPage() {
  const [messages, setMessages] = useState<Message[]>(starter);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length <= 200 && parsed.every(m => m && typeof m.id === "string" && typeof m.text === "string" && (m.sender === "you" || m.sender === "daybook") && typeof m.time === "string")) setMessages(parsed as Message[]);
      }
    } catch { setNotice("Saved sample chat could not be read; a fresh conversation is shown."); }
  }, []);
  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (text.length > 1000) { setNotice("Please keep messages under 1,000 characters."); return; }
    const next: Message[] = [...messages, {id:crypto.randomUUID(),text,sender:"you",time:new Date().toLocaleString()}, {id:crypto.randomUUID(),text:"Thanks. This is a demonstration inbox only; no support agent receives this message. For this prototype, use Settings to manage sample data.",sender:"daybook",time:new Date().toLocaleString()}].slice(-200);
    try { localStorage.setItem(KEY, JSON.stringify(next)); setMessages(next); setDraft(""); setNotice("Sample conversation saved in this browser only."); }
    catch { setNotice("Could not save the sample conversation in browser storage."); }
  }
  function clear() { try { localStorage.removeItem(KEY); setMessages(starter); setNotice("Sample conversation cleared."); } catch { setNotice("Could not clear browser storage."); } }
  return <Shell>
    <h1>Help & support</h1>
    <p className="muted">Local demonstration chat. Messages are not sent to a real support team.</p>
    <div className="notice">Never enter real banking credentials, PINs, OTPs or account information in this demo.</div>
    <section className="card" aria-label="Sample support conversation">
      <div className="chat-list">{messages.map(m=><div className="card" key={m.id}><b>{m.sender==="you"?"You":"Daybook demo assistant"}</b><p>{m.text}</p><small className="muted">{m.time}</small></div>)}</div>
      <form onSubmit={send} className="no-print"><label className="field">Message<textarea value={draft} maxLength={1000} rows={3} onChange={e=>setDraft(e.target.value)} placeholder="Type a sample message…" required /></label><div className="actions"><button type="submit">Send sample message</button><button type="button" className="secondary" onClick={clear}>Clear chat</button></div></form>
      {notice && <p role="status" className="muted">{notice}</p>}
    </section>
  </Shell>;
}
