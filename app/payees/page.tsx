"use client";
import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/app-shell";
import { getLocalRecord, setLocalRecord } from "@/lib/demo";
import { ApkAssetIcon } from "@/components/apk-asset-map";
type Payee={id:string;name:string;bank:string;account:string;code:string};
const KEY="bob-new-sample-payees-v1";
function validList(value:unknown):Payee[]|null{
 if(!Array.isArray(value)||value.length>500)return null;
 const ids=new Set<string>(),accounts=new Set<string>();
 for(const item of value){
  if(!item||typeof item!=="object")return null;
  const p=item as Partial<Payee>;
  if(typeof p.id!=="string"||!p.id.trim()||p.id.length>100||ids.has(p.id)||typeof p.name!=="string"||!p.name.trim()||p.name.length>100||typeof p.bank!=="string"||!p.bank.trim()||p.bank.length>100||typeof p.account!=="string"||!/^[0-9]{6,18}$/.test(p.account)||accounts.has(p.account)||typeof p.code!=="string"||!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(p.code))return null;
  ids.add(p.id);accounts.add(p.account);
 }
 return value as Payee[];
}
export default function Payees(){
 const [list,List]=useState<Payee[]>([]);const[name,Name]=useState("");const[bank,Bank]=useState("");const[account,Account]=useState("");const[code,Code]=useState("");const[msg,Msg]=useState("");const[ready,Ready]=useState(false);const[loaded,Loaded]=useState(false);const[saving,Saving]=useState(false);const saveLock=useRef(false);
 useEffect(()=>{let active=true;getLocalRecord<unknown>(KEY,[]).then(v=>{if(active){const loaded=validList(v);if(loaded){List(loaded);Ready(true)}else{Msg("Saved beneficiary data is invalid. Editing is disabled to protect the existing records. Inspect or recover browser data before making changes.");Ready(false)}Loaded(true)}}).catch(()=>{if(active){Msg("Could not open saved beneficiary records. Editing is disabled to avoid overwriting data that could not be loaded.");Ready(false);Loaded(true)}});return()=>{active=false}},[]);
 async function save(next:Payee[]):Promise<boolean>{if(saveLock.current){Msg("A save is already in progress. Please wait.");return false}saveLock.current=true;Saving(true);try{await setLocalRecord(KEY,next);List(next);Msg("Beneficiary list saved on this device.");return true}catch{Msg("Could not save beneficiaries to local storage. The displayed list was not changed.");return false}finally{saveLock.current=false;Saving(false)}}
 async function add(e:React.FormEvent){e.preventDefault();if(!name.trim()||!bank.trim()||!/^[0-9]{6,18}$/.test(account)||!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(code)){Msg("Check the recipient details and code format.");return}if(list.some(p=>p.account===account)){Msg("That account is already in the list.");return}const saved=await save([...list,{id:crypto.randomUUID(),name:name.trim(),bank:bank.trim(),account,code:code.toUpperCase()}]);if(saved){Name("");Bank("");Account("");Code("")}}
 return <Shell><div className="page-heading apk-page-heading"><ApkAssetIcon asset="beneficiaries" size={30}/><div><h1>Beneficiaries</h1><p className="muted">Manage recipients saved on this device.</p></div></div><p className="warning">Local prototype only. No bank details are verified and transfers are not sent.</p><form className="card" onSubmit={add}><h2>Add beneficiary</h2><div className="grid"><Field label="Recipient name"><input value={name} maxLength={100} onChange={e=>Name(e.target.value)} required/></Field><Field label="Institution"><input value={bank} maxLength={100} onChange={e=>Bank(e.target.value)} required/></Field><Field label="Account number"><input inputMode="numeric" value={account} maxLength={18} onChange={e=>Account(e.target.value.replace(/[^0-9]/g,""))} required/></Field><Field label="IFSC-format code"><input value={code} maxLength={11} onChange={e=>Code(e.target.value.toUpperCase())} required/></Field></div><button disabled={!ready||saving}> {saving?"Saving…":"Add beneficiary"} </button>{msg&&<p className="muted" role="status">{msg}</p>}</form><section className="card"><h2>Saved beneficiaries ({list.length})</h2>{!loaded?<p className="muted">Loading saved beneficiaries…</p>:!ready?<p className="muted">Saved beneficiaries are unavailable. Existing records are protected; editing is disabled.</p>:list.length===0?<p className="muted">No beneficiaries saved yet.</p>:list.map(p=><div className="row" key={p.id}><div><b>{p.name}</b><div className="muted">{p.bank} · •••• {p.account.slice(-4)} · {p.code}</div></div><button type="button" className="secondary" disabled={saving} onClick={()=>void save(list.filter(x=>x.id!==p.id))}>Remove</button></div>)}</section></Shell>
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field">{label}{children}</label>}
