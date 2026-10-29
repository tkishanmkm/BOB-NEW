/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is intentional for the isolated TypeScript test harness. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync("lib/demo.ts", "utf8");
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
console.log(`Data validation tests passed: ${count}/${count}`);
