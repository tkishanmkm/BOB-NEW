/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS is intentional for this source-level safety test. */
const assert = require("node:assert/strict");
const fs = require("node:fs");

const transfer = fs.readFileSync("app/transfers/page.tsx", "utf8");
const result = fs.readFileSync("app/payment-successful/page.tsx", "utf8");
let count = 0;
function test(name, fn) {
  fn();
  count++;
  console.log("PASS " + name);
}

test("transfer flow is explicitly labelled as a local prototype", () => {
  assert.match(transfer, /Local prototype/);
  assert.match(transfer, /No money is moved/i);
});

test("transfer amount must be positive and have at most two decimals", () => {
  assert.match(transfer, /amount <= 0/);
  assert.match(transfer, /no more than two decimal places/i);
});

test("transfer is blocked when available sample balance is insufficient", () => {
  assert.match(transfer, /value > available/);
  assert.match(transfer, /Insufficient (?:available )?sample balance/i);
});

test("pending demo debits are reserved to prevent overspending", () => {
  assert.match(transfer, /type === "debit" && t\.status === "pending"/);
  assert.match(transfer, /pending demo debits/i);
});

test("transfer uses a duplicate-submit lock", () => {
  assert.match(transfer, /saveLock\.current \|\| saving/);
  assert.match(transfer, /saveLock\.current = true/);
  assert.match(transfer, /saveLock\.current = false/);
});

test("recorded transfer is pending and clearly identified as a demo", () => {
  assert.match(transfer, /description: "Demo transfer to "/);
  assert.match(transfer, /status: "pending"/);
});

test("transfer only proceeds to result after local save succeeds", () => {
  assert.match(transfer, /await saveState\(next\)/);
  assert.match(transfer, /if \(!saved\)/);
  assert.match(transfer, /router\.push\("\/payment-successful\?id="/);
});

test("result page disclaims real payment and bank connectivity", () => {
  assert.match(result, /No payment was made/);
  assert.match(result, /No bank, payment network, recipient or account was contacted/);
  assert.match(result, /LOCAL RESULT — NOT A PAYMENT CONFIRMATION OR BANK RECEIPT/);
});

test("result lookup requires the requested transfer ID when one is supplied", () => {
  assert.match(result, /tx\.id === requestedId && isTransferResult\(tx\)/);
  assert.match(result, /No other transaction has been substituted/);
});

for (const [label, source] of [["transfer", transfer], ["result", result]]) {
  test(label + " page contains no direct browser network submission API", () => {
    assert.doesNotMatch(source, /\bfetch\s*\(/);
    assert.doesNotMatch(source, /XMLHttpRequest/);
    assert.doesNotMatch(source, /navigator\.sendBeacon/);
  });
}

console.log(`Transfer safety tests passed: ${count}/${count}`);
