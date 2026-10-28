export type Tx={id:string;date:string;description:string;amount:number;type:"credit"|"debit";status:"posted"|"pending"};
export type State={schemaVersion:1;name:string;accountLabel:string;maskedId:string;openingBalance:number;demoPin:string;mobile:string;email:string;address:string;branch:string;customerId:string;accountNumber:string;ifsc:string;dob:string;panNumber:string;transactions:Tx[]};
export const KEY="bob-new-state-v1";
const DB_NAME="bob-new-local-store";
const DB_VERSION=1;
const STORE="records";
const STATE_RECORD="account-state";
export const DEFAULT:State={schemaVersion:1,name:"Account Holder",accountLabel:"Savings Account",maskedId:"•••• 4821",openingBalance:25000,demoPin:"2468",mobile:"",email:"",address:"",branch:"Main Branch",customerId:"CUST-0001",accountNumber:"XXXXXX4821",ifsc:"SAMP0000001",dob:"",panNumber:"",transactions:[{id:"initial-credit",date:"2026-10-25",description:"Account credit",amount:5000,type:"credit",status:"posted"},{id:"initial-debit",date:"2026-10-24",description:"Purchase",amount:850,type:"debit",status:"posted"}]};
let cache:State={...DEFAULT,transactions:DEFAULT.transactions.map(t=>({...t}))};
let hydrated=false;
let hydrationPromise:Promise<State>|null=null;
function openDB():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    if(typeof indexedDB==="undefined"){reject(new Error("IndexedDB is unavailable in this browser."));return}
    let settled=false;
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"id"})};
    request.onsuccess=()=>{
      const db=request.result;
      db.onversionchange=()=>db.close();
      if(settled){db.close();return}
      settled=true;
      resolve(db);
    };
    request.onerror=()=>{if(!settled){settled=true;reject(request.error||new Error("Could not open local database."))}};
    request.onblocked=()=>{if(!settled){settled=true;reject(new Error("Local database upgrade is blocked by another open tab. Close other BOB-NEW tabs and retry."))}};
  });
}
function readRecord(db:IDBDatabase):Promise<unknown>{
  return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readonly");const request=tx.objectStore(STORE).get(STATE_RECORD);request.onsuccess=()=>resolve(request.result?.value);request.onerror=()=>reject(request.error||new Error("Could not read local records."))});
}
function putRecord(db:IDBDatabase,value:State):Promise<void>{
  return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({id:STATE_RECORD,value});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Could not save local records."));tx.onabort=()=>reject(tx.error||new Error("Local save was cancelled."))});
}
export async function hydrate():Promise<State>{
  if(typeof window==="undefined")return cache;
  if(hydrationPromise)return hydrationPromise;
  hydrationPromise=(async()=>{
    let db:IDBDatabase|undefined;
    try{
      db=await openDB();
      let stored=await readRecord(db);
      if(!valid(stored)){
        let legacy:unknown=null;
        try{const raw=localStorage.getItem(KEY);if(raw)legacy=JSON.parse(raw)}catch{}
        const initial=valid(legacy)?({...DEFAULT,...legacy} as State):cache;
        await putRecord(db,initial);
        stored=initial;
      }
      if(valid(stored))cache={...DEFAULT,...stored,transactions:stored.transactions.map(t=>({...t}))};
      try{localStorage.removeItem(KEY)}catch{}
      hydrated=true;
      window.dispatchEvent(new Event("bob-new-state-change"));
      return cache;
    }catch(error){
      hydrationPromise=null;
      throw error;
    }finally{db?.close()}
  })();
  return hydrationPromise;
}
export function isHydrated(){return hydrated}
export function valid(v:unknown):v is State{if(!v||typeof v!=="object")return false;const s=v as Partial<State>;if(s.schemaVersion!==1||typeof s.name!=="string"||!s.name.trim()||s.name.length>100||typeof s.accountLabel!=="string"||!s.accountLabel.trim()||s.accountLabel.length>100||typeof s.maskedId!=="string"||!s.maskedId.trim()||s.maskedId.length>80||typeof s.openingBalance!=="number"||!Number.isFinite(s.openingBalance)||s.openingBalance<0||typeof s.demoPin!=="string"||!/^[0-9]{4,6}$/.test(s.demoPin)||![ "mobile","email","address","branch","customerId","accountNumber","ifsc","dob","panNumber"].every(k=>s[k as keyof State]===undefined||typeof s[k as keyof State]==="string"&&(s[k as keyof State] as string).length<=200)||typeof s.email==="string"&&s.email.length>0&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)||typeof s.dob==="string"&&s.dob.length>0&&!isValidISODate(s.dob)||!Array.isArray(s.transactions)||s.transactions.length>5000)return false;const ids=new Set<string>();return s.transactions.every((item:unknown)=>{if(!item||typeof item!=="object")return false;const t=item as Partial<Tx>;if(typeof t.id!=="string"||!t.id.trim()||t.id.length>100||ids.has(t.id)||typeof t.date!=="string"||!isValidISODate(t.date)||typeof t.description!=="string"||t.description.length>300||typeof t.amount!=="number"||!Number.isFinite(t.amount)||t.amount<0||(t.type!=="credit"&&t.type!=="debit")||(t.status!=="posted"&&t.status!=="pending"))return false;ids.add(t.id);return true})}
function isValidISODate(value:string):boolean{if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value))return false;const d=new Date(value+"T00:00:00Z");return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value}
export function read():State{return {...cache,transactions:cache.transactions.map(t=>({...t}))}}
let saveQueue:Promise<void>=Promise.resolve();
export async function saveState(v:State):Promise<boolean>{
  if(!valid(v)||typeof window==="undefined")return false;
  const next:State={...v,transactions:v.transactions.map(t=>({...t}))};
  const operation=saveQueue.then(async()=>{
    let db:IDBDatabase|undefined;
    try{
      if(!hydrated)await hydrate();
      db=await openDB();
      await putRecord(db,next);
      cache=next;
      window.dispatchEvent(new Event("bob-new-state-change"));
      return true;
    }catch{
      window.dispatchEvent(new CustomEvent("bob-new-storage-error",{detail:"Could not save to IndexedDB. Check browser storage availability."}));
      return false;
    }finally{db?.close()}
  });
  saveQueue=operation.then(()=>undefined);
  return operation;
}
// Persist state only through saveState(), which resolves after IndexedDB commits.
// A synchronous writer could report success before durable storage finishes.
export function balance(s:State):number{return s.openingBalance+s.transactions.filter(t=>t.status==="posted").reduce((n,t)=>n+(t.type==="credit"?t.amount:-t.amount),0)}
export function money(n:number):string{return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(n)}

export async function getLocalRecord<T>(key:string,fallback:T):Promise<T>{
  const db=await openDB();
  try{
    let value=await readRecordById(db,"collection:"+key);
    if(value===undefined){
      try{const raw=localStorage.getItem(key);if(raw)value=JSON.parse(raw)}catch{}
      if(value===undefined)value=fallback;
      await putRecordById(db,"collection:"+key,value);
      try{localStorage.removeItem(key)}catch{}
    }
    return value as T;
  }finally{db.close()}
}
export async function setLocalRecord<T>(key:string,value:T):Promise<void>{
  const db=await openDB();
  try{await putRecordById(db,"collection:"+key,value);try{localStorage.removeItem(key)}catch{}}
  finally{db.close()}
}
export async function deleteLocalRecord(key:string):Promise<void>{
  const db=await openDB();
  try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).delete("collection:"+key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Could not delete local records."))});try{localStorage.removeItem(key)}catch{}}
  finally{db.close()}
}
function readRecordById(db:IDBDatabase,id:string):Promise<unknown>{
  return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readonly");const request=tx.objectStore(STORE).get(id);request.onsuccess=()=>resolve(request.result?.value);request.onerror=()=>reject(request.error||new Error("Could not read local records."))});
}
function putRecordById(db:IDBDatabase,id:string,value:unknown):Promise<void>{
  return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({id,value});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Could not save local records."));tx.onabort=()=>reject(tx.error||new Error("Local save was cancelled."))});
}
