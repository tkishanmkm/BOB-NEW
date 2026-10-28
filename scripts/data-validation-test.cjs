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
console.log(`Data validation tests passed: ${count}/${count}`);
