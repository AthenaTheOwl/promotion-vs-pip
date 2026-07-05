import { test } from "node:test";
import assert from "node:assert/strict";
import { SUITS, adaptive, greedy, maskSwitcher, mono, random } from "../bots.mjs";

test("mono declares its suit when available and otherwise takes the first suit in hand", () => {
  const strategy = mono("vision");

  assert.equal(strategy({}, { handSuits: ["process", "vision"] }), "vision");
  assert.equal(strategy({}, { handSuits: ["receipts", "coalition"] }), "receipts");
});

test("maskSwitcher picks the available suit with the fewest wins", () => {
  const strategy = maskSwitcher();
  const self = { wins: { vision: 2, process: 0, receipts: 1 } };
  const ctx = { handSuits: ["vision", "process", "receipts"] };

  assert.equal(strategy(self, ctx), "process");
});

test("greedy declares the first available suit", () => {
  const strategy = greedy();

  assert.equal(strategy({}, { handSuits: ["coalition", "vision", "process"] }), "coalition");
});

test("adaptive avoids a third win and prefers a useful second win", () => {
  const strategy = adaptive();

  assert.equal(
    strategy(
      { wins: { vision: 1, process: 0, receipts: 2 } },
      { handSuits: ["process", "vision", "receipts"] },
    ),
    "vision",
  );
  assert.equal(
    strategy(
      { wins: { vision: 2, process: 3 } },
      { handSuits: ["vision", "process"] },
    ),
    "vision",
  );
});

test("random uses the supplied rng to pick from hand suits", () => {
  const strategy = random(() => 0.6);

  assert.equal(strategy({}, { handSuits: ["vision", "process", "receipts"] }), "process");
});

test("bots module re-exports the engine suit list", () => {
  assert.deepEqual(SUITS, ["vision", "process", "receipts", "coalition"]);
});
