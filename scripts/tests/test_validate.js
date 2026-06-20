import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadAllCards, summarize } from "../lib/loader.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

test("loadAllCards parses all 4 files and counts to 36", () => {
  const cards = loadAllCards(repoRoot);
  assert.equal(cards.length, 36);
});

test("summarize returns the expected card-type mix", () => {
  const cards = loadAllCards(repoRoot);
  const b = summarize(cards);
  assert.deepEqual(b, { meeting: 6, proposal: 18, policy: 6, exposure: 6 });
});

test("every card id matches the schema pattern", () => {
  const cards = loadAllCards(repoRoot);
  const pat = /^[MPLE]-[0-9]{2}$/;
  for (const c of cards) assert.match(c.id, pat, `bad id: ${c.id}`);
});

test("every card has the required fields", () => {
  const cards = loadAllCards(repoRoot);
  for (const c of cards) {
    assert.ok(c.title, `${c.id} missing title`);
    assert.ok(c.effect, `${c.id} missing effect`);
    assert.ok(c.alienation, `${c.id} missing alienation`);
  }
});

test("card ids are unique", () => {
  const cards = loadAllCards(repoRoot);
  const seen = new Set();
  for (const c of cards) {
    assert.ok(!seen.has(c.id), `duplicate id: ${c.id}`);
    seen.add(c.id);
  }
});
