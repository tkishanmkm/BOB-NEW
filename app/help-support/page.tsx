"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/app-shell";
import { getLocalRecord, setLocalRecord, deleteLocalRecord } from "@/lib/demo";
type Message={id:string;text:string;sender:"you"|"daybook";time:string};
const KEY="bob-new-support-messages-v1";
const starter:Message[]=[{id:"welcome",text:"Hello! This is the local support inbox for the prototype. Never share passwords, PINs, one-time codes or sensitive account information.",sender:"daybook",time:"Welcome"}];
function validMessages(v:unknown):Message[]|null{
 if(!Array.isArray(v)||v.length>200)return null;
 const ids=new Set<string>();
 for(const item of v){
  if(!item||typeof item!=="object")return null;
  const m=item as Partial<Message>;
  if(typeof m.id!=="string"||!m.id.trim()||m.id.length>100||ids.has(m.id)||typeof m.text!=="string"||!m.text.trim()||m.text.length>1000||(m.sender!=="you"&&m.sender!=="daybook")||typeof m.time!=="string"||!m.time.trim()||m.time.length>100)return null;
  ids.add(m.id);
 }
 return v as Message[];
}
export default function HelpSupportPage(){
 const[messages,setMessages]=useState<Message[]>(starter);const[draft,setDraft]=useState("");const[notice,setNotice]=useState("");const[ready,setReady]=useState(false);const[sending,setSending]=useState(false);
 useEffect(()=>{let active=true;getLocalRecord<unknown>(KEY,starter).then(v=>{if(active){const loaded=validMessages(v);if(loaded){setMessages(loaded);setReady(true)}else{setNotice("Saved conversation data is invalid. Editing is disabled to protect the existing records. Export or inspect browser data before clearing it.");setReady(false)}}}).catch(()=>{if(active){setNotice("Could not open the saved conversation. Editing is disabled to protect messages that could not be loaded. Check browser storage and reload.");setReady(false)}});return()=>{active=false}},[]);
 async function send(e:React.FormEvent){e.preventDefault();if(!ready||sending)return;const text=draft.trim();if(!text)return;if(text.length>1000){setNotice("Please keep messages under 1,000 characters.");return}const now=new Date().toLocaleString();const next:Message[]=[...messages,{id:crypto.randomUUID(),text,sender:"you" as const,time:now},{id:crypto.randomUUID(),text:"Your message is saved locally. No support agent receives it because this prototype has no server connection.",sender:"daybook" as const,time:now}].slice(-200);setSending(true);try{await setLocalRecord(KEY,next);setMessages(next);setDraft("");setNotice("Conversation saved on this device.")}catch{setNotice("Could not save the conversation. Check browser storage space.")}finally{setSending(false)}}
 async function clear(){if(!ready||sending)return;setSending(true);try{await deleteLocalRecord(KEY);setMessages(starter);setNotice("Conversation cleared.")}catch{setNotice("Could not clear saved messages.")}finally{setSending(false)}}
 return <Shell><h1>Help & support</h1><p className="muted">Messages are stored on this device and are not sent to a support team.</p><div className="notice">Do not enter passwords, PINs, one-time codes or sensitive financial information.</div><section className="card" aria-label="Support conversation"><div className="chat-list">{messages.map(m=><div className="card" key={m.id}><b>{m.sender==="you"?"You":"Daybook support"}</b><p>{m.text}</p><small className="muted">{m.time}</small></div>)}</div><form onSubmit={send} className="no-print"><label className="field">Message<textarea value={draft} maxLength={1000} rows={3} onChange={e=>setDraft(e.target.value)} placeholder="Write a message…" required/></label><div className="actions"><button type="submit" disabled={!ready||sending}>{sending?"Saving…":"Send message"}</button><button type="button" className="secondary" disabled={!ready||sending} onClick={()=>void clear()}>Clear conversation</button></div></form>{notice&&<p className="muted" role="status">{notice}</p>}</section></Shell>
}
