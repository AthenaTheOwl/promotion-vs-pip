import { test } from "node:test";
import assert from "node:assert/strict";
import { SUITS, adaptive, greedy, maskSwitcher, mono, random } from "../bots.mjs";
import { makeRng, runGame } from "../engine.mjs";

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

test("maskSwitcher and adaptive steer on ctx.complicity (leans under tickOn declare), not wins", () => {
  // No wins anywhere, but vision has already been leaned on twice: a third lean exposes it.
  const self = { wins: {}, leans: { vision: 2, process: 1 } };
  const ctx = { handSuits: ["vision", "process"], complicity: self.leans };

  assert.equal(maskSwitcher()(self, ctx), "process");
  assert.equal(adaptive()(self, ctx), "process");
});

test("in a declare-rule game, maskSwitcher only exposes a suit when its hand forces it", () => {
  for (let seed = 0; seed < 200; seed++) {
    const result = runGame(
      { strategies: [maskSwitcher(), mono("vision"), adaptive(), greedy()], perSuit: 3, quarters: 6, handSize: 5, tickOn: "declare" },
      makeRng(seed),
    );
    const switcher = result.players[0];
    assert.equal(switcher.exposedSuits, switcher.forcedExposures, `seed ${seed}`);
  }
});

test("random uses the supplied rng to pick from hand suits", () => {
  const strategy = random(() => 0.6);

  assert.equal(strategy({}, { handSuits: ["vision", "process", "receipts"] }), "process");
});

test("bots module re-exports the engine suit list", () => {
  assert.deepEqual(SUITS, ["vision", "process", "receipts", "coalition"]);
});
