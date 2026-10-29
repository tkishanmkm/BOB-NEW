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
let stateChannel:BroadcastChannel|undefined;
async function syncStateFromDatabase(){
  if(typeof window==="undefined")return;
  let db:IDBDatabase|undefined;
  try{
    db=await openDB();
    const stored=await readRecord(db);
    if(stored!==undefined){
      if(!valid(stored))throw new Error("Saved account data from another tab failed validation.");
      cache={...DEFAULT,...stored,transactions:stored.transactions.map(t=>({...t}))};
      hydrated=true;
      window.dispatchEvent(new Event("bob-new-state-change"));
    }
  }catch{
    window.dispatchEvent(new CustomEvent("bob-new-storage-error",{detail:"Could not refresh saved data from another tab. Reload this page before editing."}));
  }finally{db?.close()}
}
function notifyStateChange(){
  if(typeof window==="undefined")return;
  window.dispatchEvent(new Event("bob-new-state-change"));
  if(typeof BroadcastChannel!=="undefined"){
    try{
      stateChannel??=new BroadcastChannel("bob-new-state-sync-v1");
      stateChannel.onmessage=()=>{void syncStateFromDatabase()};
      stateChannel.postMessage({type:"state-changed"});
    }catch{}
  }
}
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
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readonly");
    const request=tx.objectStore(STORE).get(STATE_RECORD);
    let value:unknown;
    request.onsuccess=()=>{value=request.result?.value};
    request.onerror=()=>reject(request.error||new Error("Could not read local account records."));
    tx.oncomplete=()=>resolve(value);
    tx.onerror=()=>reject(tx.error||new Error("Reading local account records failed."));
    tx.onabort=()=>reject(tx.error||new Error("Reading local account records was cancelled."));
  });
}
function putRecord(db:IDBDatabase,value:State):Promise<void>{
  return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({id:STATE_RECORD,value});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Could not save local records."));tx.onabort=()=>reject(tx.error||new Error("Local save was cancelled."))});
}
function putRecordIfUnchanged(db:IDBDatabase,value:State,expected:State):Promise<boolean>{
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readwrite");
    const store=tx.objectStore(STORE);
    const request=store.get(STATE_RECORD);
    let stale=false;
    request.onsuccess=()=>{
      const stored=request.result?.value;
      if(!valid(stored)||JSON.stringify(stored)!==JSON.stringify(expected)){
        stale=true;
        try{tx.abort()}catch{}
        return;
      }
      store.put({id:STATE_RECORD,value});
    };
    request.onerror=()=>reject(request.error||new Error("Could not verify the latest saved account state."));
    tx.oncomplete=()=>resolve(!stale);
    tx.onerror=()=>{if(stale)resolve(false);else reject(tx.error||new Error("Could not save local records."))};
    tx.onabort=()=>{if(stale)resolve(false);else reject(tx.error||new Error("Local save was cancelled."))};
  });
}
export async function hydrate():Promise<State>{
  if(typeof window==="undefined")return cache;
  if(hydrationPromise)return hydrationPromise;
  hydrationPromise=(async()=>{
    let db:IDBDatabase|undefined;
    try{
      db=await openDB();
      let stored=await readRecord(db);
      if(stored!==undefined&&!valid(stored)){
        throw new Error("Saved IndexedDB account data is invalid; it was preserved for recovery.");
      }
      if(stored===undefined){
        const raw=localStorage.getItem(KEY);
        let legacy:unknown;
        if(raw!==null){
          try{legacy=JSON.parse(raw)}catch{
            throw new Error("Legacy account data is not valid JSON; it was preserved for recovery.");
          }
          if(!valid(legacy)){
            throw new Error("Legacy account data has an invalid structure; it was preserved for recovery.");
          }
          stored={...DEFAULT,...legacy} as State;
        }else{
          stored={...DEFAULT,transactions:DEFAULT.transactions.map(t=>({...t}))};
        }
        await putRecord(db,stored as State);
      }
      if(!valid(stored))throw new Error("Saved account data could not be validated.");
      cache={...DEFAULT,...stored,transactions:stored.transactions.map(t=>({...t}))};
      try{localStorage.removeItem(KEY)}catch{}
      hydrated=true;
      notifyStateChange();
      return cache;
    }catch(error){
      hydrationPromise=null;
      throw error;
    }finally{db?.close()}
  })();
  return hydrationPromise;
}
export function isHydrated(){return hydrated}
function hasAtMostTwoDecimals(value:number):boolean{return Math.abs(value*100-Math.round(value*100))<1e-8}
export function normalizeImportedState(v:unknown):State|null{
  if(!valid(v))return null;
  const s=v as State;
  return {
    schemaVersion:1,
    name:s.name,
    accountLabel:s.accountLabel,
    maskedId:s.maskedId,
    openingBalance:s.openingBalance,
    demoPin:s.demoPin,
    mobile:s.mobile??"",
    email:s.email??"",
    address:s.address??"",
    branch:s.branch??"",
    customerId:s.customerId??"",
    accountNumber:s.accountNumber??"",
    ifsc:s.ifsc??"",
    dob:s.dob??"",
    panNumber:s.panNumber??"",
    transactions:s.transactions.map(t=>({id:t.id,date:t.date,description:t.description,amount:t.amount,type:t.type,status:t.status}))
  };
}
export function valid(v:unknown):v is State{if(!v||typeof v!=="object")return false;const s=v as Partial<State>;if(s.schemaVersion!==1||typeof s.name!=="string"||!s.name.trim()||s.name.length>100||typeof s.accountLabel!=="string"||!s.accountLabel.trim()||s.accountLabel.length>100||typeof s.maskedId!=="string"||!s.maskedId.trim()||s.maskedId.length>80||typeof s.openingBalance!=="number"||!Number.isFinite(s.openingBalance)||s.openingBalance<0||!hasAtMostTwoDecimals(s.openingBalance)||typeof s.demoPin!=="string"||!/^[0-9]{4,6}$/.test(s.demoPin)||![ "mobile","email","address","branch","customerId","accountNumber","ifsc","dob","panNumber"].every(k=>s[k as keyof State]===undefined||typeof s[k as keyof State]==="string"&&(s[k as keyof State] as string).length<=200)||typeof s.email==="string"&&s.email.length>0&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)||typeof s.ifsc==="string"&&s.ifsc.length>0&&!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(s.ifsc)||typeof s.dob==="string"&&s.dob.length>0&&!isValidISODate(s.dob)||!Array.isArray(s.transactions)||s.transactions.length>5000)return false;const ids=new Set<string>();return s.transactions.every((item:unknown)=>{if(!item||typeof item!=="object")return false;const t=item as Partial<Tx>;if(typeof t.id!=="string"||!t.id.trim()||t.id.length>100||ids.has(t.id)||typeof t.date!=="string"||!isValidISODate(t.date)||typeof t.description!=="string"||!t.description.trim()||t.description.length>300||typeof t.amount!=="number"||!Number.isFinite(t.amount)||t.amount<0||!hasAtMostTwoDecimals(t.amount)||(t.type!=="credit"&&t.type!=="debit")||(t.status!=="posted"&&t.status!=="pending"))return false;ids.add(t.id);return true})}
function isValidISODate(value:string):boolean{if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value))return false;const d=new Date(value+"T00:00:00Z");return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===value}
export function read():State{return {...cache,transactions:cache.transactions.map(t=>({...t}))}}
let saveQueue:Promise<void>=Promise.resolve();
export async function saveState(v:State):Promise<boolean>{
  if(!valid(v)||typeof window==="undefined")return false;
  const next:State={...v,transactions:v.transactions.map(t=>({...t}))};
  // Capture the caller-visible baseline before waiting in the queue, so a stale
  // full-state object cannot overwrite a newer state while it waits to be saved.
  const expected:State=read();
  const operation=saveQueue.then(async()=>{
    let db:IDBDatabase|undefined;
    try{
      // A write created before hydration may contain the default/stale cache.
      // Hydrate first, then require the caller to retry with freshly loaded state.
      if(!hydrated){
        await hydrate();
        return false;
      }
      db=await openDB();
      // Compare-and-write inside one IndexedDB read/write transaction. A stale tab
      // must not replace newer data written by another tab.
      const wrote=await putRecordIfUnchanged(db,next,expected);
      if(!wrote){
        window.dispatchEvent(new CustomEvent("bob-new-storage-error",{detail:"Another tab changed the saved account data. Your edit was not saved; refresh this page before retrying."}));
        return false;
      }
      cache=next;
      notifyStateChange();
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
export function balanceThroughDate(s:State,endDate?:string):number{return s.openingBalance+s.transactions.filter(t=>t.status==="posted"&&(!endDate||t.date<=endDate)).reduce((n,t)=>n+(t.type==="credit"?t.amount:-t.amount),0)}
export function balance(s:State):number{return balanceThroughDate(s)}
// Sum currency in integer paise so repeated decimal additions do not accumulate
// binary floating-point fractions in statement/passbook totals.
export function postedTotal(transactions:Tx[],type:"credit"|"debit"):number{
  const paise=transactions.filter(t=>t.status==="posted"&&t.type===type).reduce((sum,t)=>sum+Math.round(t.amount*100),0);
  return paise/100;
}
export function maskAccountIdentifier(value:string,emptyLabel="Not set"):string{const digits=value.replace(/\D/g,"");return digits.length>=4?"•••• "+digits.slice(-4):value.trim()?"••••":emptyLabel}

// Shared ordering rule: newest ISO date first; for same-day entries, later stored entries first.
export function sortTransactionsNewestFirst(transactions:Tx[]):Tx[]{return transactions.map((tx,index)=>({tx,index})).sort((a,b)=>b.tx.date.localeCompare(a.tx.date)||b.index-a.index).map(({tx})=>tx)}
export function money(n:number):string{return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(n)}

export function validWorkspacePayees(value:unknown):boolean{
  if(!Array.isArray(value)||value.length>500)return false;
  const ids=new Set<string>(),accounts=new Set<string>();
  return value.every((item:unknown)=>{
    if(!item||typeof item!=="object")return false;
    const p=item as {id?:unknown;name?:unknown;bank?:unknown;account?:unknown;code?:unknown};
    if(typeof p.id!=="string"||!p.id.trim()||p.id.length>100||ids.has(p.id)||typeof p.name!=="string"||!p.name.trim()||p.name.length>100||typeof p.bank!=="string"||!p.bank.trim()||p.bank.length>100||typeof p.account!=="string"||!/^[0-9]{6,18}$/.test(p.account)||accounts.has(p.account)||typeof p.code!=="string"||!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(p.code))return false;
    ids.add(p.id);accounts.add(p.account);return true;
  });
}
export function validWorkspaceMessages(value:unknown):boolean{
  if(!Array.isArray(value)||value.length>200)return false;
  const ids=new Set<string>();
  return value.every((item:unknown)=>{
    if(!item||typeof item!=="object")return false;
    const m=item as {id?:unknown;text?:unknown;sender?:unknown;time?:unknown};
    if(typeof m.id!=="string"||!m.id.trim()||m.id.length>100||ids.has(m.id)||typeof m.text!=="string"||!m.text.trim()||m.text.length>1000||(m.sender!=="you"&&m.sender!=="daybook")||typeof m.time!=="string"||!m.time.trim()||m.time.length>100)return false;
    ids.add(m.id);return true;
  });
}
export async function restoreWorkspaceRecords(account:State,payees:unknown,supportMessages:unknown):Promise<boolean>{
  if(!valid(account)||!validWorkspacePayees(payees)||!validWorkspaceMessages(supportMessages)||typeof window==="undefined")return false;
  // Backups are untrusted input: persist only the documented schema, not
  // unexpected fields that happen to pass structural validation.
  const normalized=normalizeImportedState(account);
  if(!normalized)return false;
  const next:State=normalized;
  const safePayees=(payees as Array<{id:string;name:string;bank:string;account:string;code:string}>).map(p=>({id:p.id,name:p.name,bank:p.bank,account:p.account,code:p.code}));
  const safeMessages=(supportMessages as Array<{id:string;text:string;sender:"you"|"daybook";time:string}>).map(m=>({id:m.id,text:m.text,sender:m.sender,time:m.time}));
  const operation=saveQueue.then(async()=>{
    let db:IDBDatabase|undefined;
    try{
      if(!hydrated)await hydrate();
      db=await openDB();
      await new Promise<void>((resolve,reject)=>{
        const tx=db!.transaction(STORE,"readwrite");
        const store=tx.objectStore(STORE);
        store.put({id:STATE_RECORD,value:next});
        store.put({id:"collection:bob-new-sample-payees-v1",value:safePayees});
        store.put({id:"collection:bob-new-support-messages-v1",value:safeMessages});
        tx.oncomplete=()=>resolve();
        tx.onerror=()=>reject(tx.error||new Error("Workspace restore transaction failed."));
        tx.onabort=()=>reject(tx.error||new Error("Workspace restore was cancelled."));
      });
      cache=next;
      try{localStorage.removeItem(KEY);localStorage.removeItem("bob-new-sample-payees-v1");localStorage.removeItem("bob-new-support-messages-v1")}catch{}
      notifyStateChange();
      return true;
    }catch{
      window.dispatchEvent(new CustomEvent("bob-new-storage-error",{detail:"Could not restore workspace backup. Existing records were not confirmed as changed."}));
      return false;
    }finally{db?.close()}
  });
  saveQueue=operation.then(()=>undefined);
  return operation;
}
export async function getLocalRecord<T>(key:string,fallback:T,persistMigration=true):Promise<T>{
  const db=await openDB();
  try{
    let value=await readRecordById(db,"collection:"+key);
    if(value===undefined){
      // Do not replace a legacy record if it exists but cannot be read or parsed.
      // Let the caller show a recovery error rather than silently migrating fallback data.
      const raw=localStorage.getItem(key);
      if(raw!==null){
        try{value=JSON.parse(raw)}catch{
          throw new Error("Legacy local record is not valid JSON; it was preserved for recovery.");
        }
      }else{
        value=fallback;
      }
      if(persistMigration)await putRecordById(db,"collection:"+key,value);
      // Keep the legacy copy until the caller validates the record's schema.
      // This preserves a recovery source if the migrated value is malformed.
    }
    return value as T;
  }finally{db.close()}
}
export async function setLocalRecord<T>(key:string,value:T):Promise<void>{
  const operation=saveQueue.then(async()=>{
    let db:IDBDatabase|undefined;
    try{
      db=await openDB();
      await putRecordById(db,"collection:"+key,value);
      try{localStorage.removeItem(key)}catch{}
    }finally{db?.close()}
  });
  // Keep the queue usable after a failed collection write while returning the
  // original rejection to the caller.
  saveQueue=operation.then(()=>undefined,()=>undefined);
  return operation;
}
export async function deleteLocalRecord(key:string):Promise<void>{
  const operation=saveQueue.then(async()=>{
    let db:IDBDatabase|undefined;
    try{
      // Remove the legacy copy first. If it remains after deleting IndexedDB,
      // a later read could migrate the supposedly deleted record back.
      try{localStorage.removeItem(key)}catch{
        throw new Error("Could not remove the legacy local copy; the record was not deleted.");
      }
      db=await openDB();
      await new Promise<void>((resolve,reject)=>{
        const tx=db!.transaction(STORE,"readwrite");
        tx.objectStore(STORE).delete("collection:"+key);
        tx.oncomplete=()=>resolve();
        tx.onerror=()=>reject(tx.error||new Error("Could not delete local records."));
        tx.onabort=()=>reject(tx.error||new Error("Local record deletion was cancelled."));
      });
    }finally{db?.close()}
  });
  saveQueue=operation.then(()=>undefined,()=>undefined);
  return operation;
}
function readRecordById(db:IDBDatabase,id:string):Promise<unknown>{
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,"readonly");
    const request=tx.objectStore(STORE).get(id);
    let value:unknown;
    request.onsuccess=()=>{value=request.result?.value};
    request.onerror=()=>reject(request.error||new Error("Could not read local collection records."));
    tx.oncomplete=()=>resolve(value);
    tx.onerror=()=>reject(tx.error||new Error("Reading local collection records failed."));
    tx.onabort=()=>reject(tx.error||new Error("Reading local collection records was cancelled."));
  });
}
function putRecordById(db:IDBDatabase,id:string,value:unknown):Promise<void>{
  return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put({id,value});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error("Could not save local records."));tx.onabort=()=>reject(tx.error||new Error("Local save was cancelled."))});
}
