/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is intentional for the isolated TypeScript test harness. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync("lib/demo.ts", "utf8");
const payeesSource = fs.readFileSync("app/payees/page.tsx", "utf8");
const supportSource = fs.readFileSync("app/help-support/page.tsx", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleObject = { exports: {} };
vm.runInNewContext(compiled, {
  module: moduleObject,
  exports: moduleObject.exports,
  require,
  console,
  Date,
  Intl,
  Number,
  Set,
  Array,
  Object,
  RegExp,
  Error,
  Promise,
});
const api = moduleObject.exports;
const validAccount = () => structuredClone(api.DEFAULT);
const payee = () => ({ id: "p1", name: "Demo", bank: "Sample Bank", account: "123456789012", code: "ABCD0123456" });
const message = () => ({ id: "m1", text: "Hello", sender: "daybook", time: "10:00" });
let count = 0;
function test(name, fn) {
  fn();
  count++;
  console.log("PASS " + name);
}

test("Settings saves compare against the account snapshot loaded with the form", () => {\n  const settings = fs.readFileSync("app/settings/page.tsx", "utf8");\n  assert.match(source, /export async function saveState\(v:State,expectedBaseline\?:State\)/);\n  assert.match(source, /expectedBaseline\?\{\.\.\.expectedBaseline,transactions:expectedBaseline\.transactions\.map\(t=>\(\{\.\.\.t\}\)\)\}:expectedCollections\?\.account\?\?read\(\)/);\n  assert.match(settings, /B\(\{\.\.\.loaded,transactions:loaded\.transactions\.map\(t=>\(\{\.\.\.t\}\)\)\}\)/);\n  assert.match(settings, /saveState\(s,baseline\)/);\n  assert.match(settings, /if\(saved\)\{B\(\{\.\.\.s,transactions:s\.transactions\.map\(t=>\(\{\.\.\.t\}\)\)\}\)/);\n  assert.match(settings, /Your form draft is preserved/);\n});\ntest("beneficiary writes compare against the loaded list to prevent stale-tab overwrites", () => {
  assert.match(source, /export async function setLocalRecord<T>\(key:string,value:T,expected\?:unknown\)/);
  assert.match(source, /Another tab changed this record\. Refresh before retrying\./);
  assert.match(payeesSource, /setLocalRecord\(KEY,next,list\)/);
  assert.match(payeesSource, /The displayed list was not changed/);
});
test("support message save and clear compare against the loaded conversation", () => {
  assert.match(supportSource, /setLocalRecord\(KEY,next,messages\)/);
  assert.match(supportSource, /deleteLocalRecord\(KEY,messages\)/);
  assert.match(supportSource, /refresh before retrying/i);
  assert.match(supportSource, /conversation was not confirmed cleared/i);
});
test("account migration validates and commits legacy data before cleanup", () => {
  const hydration = source.slice(source.indexOf("export async function hydrate"), source.indexOf("export function isHydrated"));
  assert.ok(hydration.indexOf("await putRecord(db,stored as State)") < hydration.indexOf("localStorage.removeItem(KEY)"));
  assert.match(hydration, /Legacy account data is not valid JSON; it was preserved for recovery/);
  assert.match(hydration, /Legacy account data has an invalid structure; it was preserved for recovery/);
  assert.match(hydration, /Saved IndexedDB account data is invalid; it was preserved for recovery/);
  assert.match(hydration, /hydrationPromise=null/);
});
test("collection migration preserves legacy source until its IndexedDB write completes", () => {
  const migration = source.slice(source.indexOf("export async function getLocalRecord"), source.indexOf("export async function setLocalRecord"));
  assert.ok(migration.indexOf("await putRecordById(db,\"collection:\"+key,value)") < migration.indexOf("return value as T"));
  assert.match(migration, /Legacy local record is not valid JSON; it was preserved for recovery/);
  assert.doesNotMatch(migration, /localStorage\.removeItem\(key\)/);
});
test("legacy records are not removed before IndexedDB deletion succeeds", () => {
  const deletion = source.slice(source.indexOf("export async function deleteLocalRecord"), source.indexOf("function readRecordById"));
  assert.ok(deletion.indexOf("const db=await openDB()") < deletion.indexOf("localStorage.removeItem(key)"));
  assert.ok(deletion.indexOf("await new Promise<void>") < deletion.indexOf("localStorage.removeItem(key)"));
  assert.match(deletion, /Legacy local record is not valid JSON; it was preserved for recovery/);
  assert.match(deletion, /if\(hadPrevious\)await putRecordById\(db,id,previous\)/);
  assert.match(deletion, /The saved record was preserved; retry deletion/);
});
test("state saves use an atomic stale-write guard for cross-tab consistency", () => { assert.match(source, /function putRecordIfUnchanged\(/); assert.match(source, /JSON\.stringify\(stored\)!==JSON\.stringify\(expected\)/); assert.match(source, /const expected:State=read\(\)/); assert.match(source, /putRecordIfUnchanged\(db,next,expected\)/); });
test("workspace restore checks account, beneficiary, and support snapshots before replacing records", () => { assert.match(source, /export async function restoreWorkspaceRecords/); assert.match(source, /const expected:State=expectedCollections\?\.account\?\?read\(\)/); assert.match(source, /const request=store\.get\(STATE_RECORD\)/); assert.match(source, /const payeesRequest=store\.get\("collection:bob-new-sample-payees-v1"\)/); assert.match(source, /const supportRequest=store\.get\("collection:bob-new-support-messages-v1"\)/); assert.match(source, /expectedCollections\.account\?\?read\(\)/); assert.match(source, /expectedCollections\.payees/); assert.match(source, /expectedCollections\.supportMessages/); assert.match(source, /Workspace restore was cancelled; refresh before retrying/); });

test("workspace restore reports when legacy browser cleanup is incomplete", () => {
  assert.match(source, /return "cleanup-pending"/);
  assert.match(source, /Workspace restore succeeded in IndexedDB, but one or more legacy browser copies could not be removed/);
  assert.match(fs.readFileSync("app/settings/page.tsx", "utf8"), /Workspace restored and saved, but legacy browser copies could not all be removed/);
});

test("accepts the default demo account", () => assert.equal(api.valid(validAccount()), true));
test("rejects impossible ISO transaction dates", () => {
  const s = validAccount(); s.transactions[0].date = "2026-02-30";
  assert.equal(api.valid(s), false);
});
test("rejects duplicate transaction IDs", () => {
  const s = validAccount(); s.transactions[1].id = s.transactions[0].id;
  assert.equal(api.valid(s), false);
});
test("rejects empty transaction descriptions", () => {
  const s = validAccount(); s.transactions[0].description = "   ";
  assert.equal(api.valid(s), false);
});
test("rejects transaction amounts with more than two decimals", () => {
  const s = validAccount(); s.transactions[0].amount = 1.234;
  assert.equal(api.valid(s), false);
});
test("rejects opening balances with more than two decimals", () => {
  const s = validAccount(); s.openingBalance = 100.001;
  assert.equal(api.valid(s), false);
});
test("rejects invalid demo PIN shape", () => {
  const s = validAccount(); s.demoPin = "12ab";
  assert.equal(api.valid(s), false);
});
test("normalizes imported account data to known schema fields", () => {
  const s = validAccount();
  s.unexpectedImportedProperty = "must not persist";
  s.transactions[0].unexpected = "must not persist";
  const normalized = api.normalizeImportedState(s);
  assert.equal(normalized.unexpectedImportedProperty, undefined);
  assert.equal(normalized.transactions[0].unexpected, undefined);
  assert.equal(normalized.name, s.name);
  assert.equal(normalized.transactions.length, s.transactions.length);
});
test("rejects invalid account data during import normalization", () => {
  const s = validAccount(); s.transactions[0].amount = -1;
  assert.equal(api.normalizeImportedState(s), null);
});
test("accepts an empty beneficiary list", () => assert.equal(api.validWorkspacePayees([]), true));
test("rejects duplicate beneficiary account numbers", () => {
  assert.equal(api.validWorkspacePayees([payee(), { ...payee(), id: "p2" }]), false);
});
test("rejects malformed beneficiary IFSC", () => {
  const p = payee(); p.code = "INVALID";
  assert.equal(api.validWorkspacePayees([p]), false);
});
test("accepts an empty support history", () => assert.equal(api.validWorkspaceMessages([]), true));
test("rejects duplicate support message IDs", () => {
  assert.equal(api.validWorkspaceMessages([message(), { ...message(), text: "second" }]), false);
});
test("rejects unknown support sender", () => {
  const m = message(); m.sender = "admin";
  assert.equal(api.validWorkspaceMessages([m]), false);
});
test("rejects beneficiary lists above the supported limit", () => {
  assert.equal(api.validWorkspacePayees(Array.from({ length: 501 }, (_, i) => ({ ...payee(), id: `p${i}`, account: String(100000000000 + i) }))), false);
});
test("rejects support histories above the supported limit", () => {
  assert.equal(api.validWorkspaceMessages(Array.from({ length: 201 }, (_, i) => ({ ...message(), id: `m${i}` }))), false);
});
test("rejects oversized transaction histories", () => {
  const s = validAccount();
  s.transactions = Array.from({ length: 5001 }, (_, i) => ({ id: `t${i}`, date: "2026-10-25", description: "Test", amount: 1, type: "debit", status: "posted" }));
  assert.equal(api.valid(s), false);
});
test("rejects malformed account email", () => {
  const s = validAccount(); s.email = "not-an-email";
  assert.equal(api.valid(s), false);
});
test("rejects malformed account IFSC", () => {
  const s = validAccount(); s.ifsc = "INVALID";
  assert.equal(api.valid(s), false);
});
test("accepts the configured sample IFSC", () => {
  const s = validAccount();
  assert.equal(api.valid(s), true);
});
test("rejects unsupported account schema versions", () => {
  const s = validAccount(); s.schemaVersion = 99;
  assert.equal(api.valid(s), false);
});
test("rejects non-finite transaction amounts", () => {
  const s = validAccount(); s.transactions[0].amount = Number.POSITIVE_INFINITY;
  assert.equal(api.valid(s), false);
});
test("rejects transaction descriptions over the limit", () => {
  const s = validAccount(); s.transactions[0].description = "x".repeat(301);
  assert.equal(api.valid(s), false);
});
test("posted totals use integer paise and ignore pending entries", () => { const tx = [{id:"a",date:"2026-10-01",description:"a",amount:0.1,type:"credit",status:"posted"},{id:"b",date:"2026-10-02",description:"b",amount:0.2,type:"credit",status:"posted"},{id:"c",date:"2026-10-03",description:"c",amount:100,type:"credit",status:"pending"}]; assert.equal(api.postedTotal(tx,"credit"),0.3); assert.equal(api.postedTotal(tx,"debit"),0); });
test("posted transfer debits reduce the calculated sample balance", () => {
  const s = validAccount();
  const before = api.balance(s);
  s.transactions.push({ id: "transfer-test", date: "2026-10-29", description: "Demo transfer to Test", amount: 125.50, type: "debit", status: "posted" });
  assert.equal(Math.round((before - api.balance(s)) * 100) / 100, 125.50);
});
test("pending transfer simulations do not change the calculated sample balance", () => {
  const s = validAccount();
  const before = api.balance(s);
  s.transactions.push({ id: "pending-transfer-test", date: "2026-10-29", description: "Pending demo transfer", amount: 125.50, type: "debit", status: "pending" });
  assert.equal(api.balance(s), before);
});

test("posted credits and debits are reflected in the sample balance", () => {
  const s = validAccount();
  s.openingBalance = 1000;
  s.transactions = [
    { id: "before", date: "2026-10-01", description: "Before range", amount: 100, type: "credit", status: "posted" },
    { id: "on-end", date: "2026-10-10", description: "End date", amount: 40, type: "debit", status: "posted" },
    { id: "pending", date: "2026-10-10", description: "Pending", amount: 500, type: "debit", status: "pending" },
    { id: "after", date: "2026-10-11", description: "After range", amount: 25, type: "credit", status: "posted" },
  ];
  assert.equal(api.balance(s), 1085);
});


test("date-bounded balance includes posted transactions through the inclusive end date", () => {
  const s = validAccount();
  s.openingBalance = 1000;
  s.transactions = [
    { id: "before", date: "2026-10-01", description: "Before range", amount: 100, type: "credit", status: "posted" },
    { id: "on-end", date: "2026-10-10", description: "End date", amount: 40, type: "debit", status: "posted" },
    { id: "pending", date: "2026-10-10", description: "Pending", amount: 500, type: "debit", status: "pending" },
    { id: "after", date: "2026-10-11", description: "After range", amount: 25, type: "credit", status: "posted" },
  ];
  assert.equal(api.balanceThroughDate(s, "2026-10-10"), 1060);
});
test("date-bounded balance equals full balance when no end date is supplied", () => {
  const s = validAccount();
  assert.equal(api.balanceThroughDate(s), api.balance(s));
});

console.log(`Data validation tests passed: ${count}/${count}`);
