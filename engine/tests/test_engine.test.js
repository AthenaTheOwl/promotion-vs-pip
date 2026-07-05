import { test } from "node:test";
import assert from "node:assert/strict";
import { BEATS, SUITS, beats, makeDeck, makeRng, runGame } from "../engine.mjs";

test("beats implements the accepted non-transitive 4-cycle", () => {
  const cycle = [
    ["vision", "process"],
    ["process", "receipts"],
    ["receipts", "coalition"],
    ["coalition", "vision"],
  ];

  for (const [winner, loser] of cycle) {
    assert.equal(beats(winner, loser), true, `${winner} should beat ${loser}`);
    assert.equal(beats(loser, winner), false, `${loser} should not beat ${winner}`);
  }

  for (const suit of SUITS) {
    assert.equal(SUITS.filter((other) => beats(suit, other)).length, 1);
    assert.equal(SUITS.filter((other) => beats(other, suit)).length, 1);
  }

  assert.equal(beats("vision", "receipts"), false);
  assert.equal(beats("coalition", "process"), false);
});

test("BEATS names every suit exactly once", () => {
  assert.deepEqual(Object.keys(BEATS).sort(), SUITS.toSorted());
  assert.deepEqual(Object.values(BEATS).sort(), SUITS.toSorted());
});

test("makeDeck creates the requested count for each suit", () => {
  const perSuit = 4;
  const deck = makeDeck(perSuit);
  const counts = Object.fromEntries(SUITS.map((suit) => [suit, 0]));

  for (const card of deck) counts[card.suit] += 1;

  assert.equal(deck.length, perSuit * SUITS.length);
  for (const suit of SUITS) assert.equal(counts[suit], perSuit);
});

test("makeRng produces deterministic sequences for a seed", () => {
  const first = Array.from({ length: 10 }, makeRng(42));
  const second = Array.from({ length: 10 }, makeRng(42));
  const advanced = makeRng(42);
  advanced();

  assert.deepEqual(first, second);
  assert.notDeepEqual(first, Array.from({ length: 10 }, advanced));
});

test("runGame is reproducible with a fixed seed", () => {
  const strategies = [
    (self, ctx) => ctx.handSuits[0],
    (self, ctx) => ctx.handSuits.at(-1),
    (self, ctx) => ctx.handSuits[0],
    (self, ctx) => ctx.handSuits.at(-1),
  ];
  const config = { strategies, perSuit: 3, quarters: 6, handSize: 5, tickOn: "declare" };

  const first = runGame(config, makeRng(1234));
  const second = runGame(config, makeRng(1234));

  assert.equal(first.winner, second.winner);
  assert.deepEqual(
    first.players.map(({ applause, redFlags, exposedSuits }) => ({ applause, redFlags, exposedSuits })),
    second.players.map(({ applause, redFlags, exposedSuits }) => ({ applause, redFlags, exposedSuits })),
  );
});

test("tickOn declare exposes a third lean and penalizes exposed leans", () => {
  const alwaysVision = () => "vision";
  const result = runGame(
    {
      strategies: [alwaysVision, alwaysVision],
      perSuit: 1,
      quarters: 6,
      handSize: 1,
      tickOn: "declare",
    },
    makeRng(7),
  );

  assert.equal(result.winner, -1);
  for (const player of result.players) {
    assert.equal(player.applause, -1);
    assert.equal(player.redFlags, 3);
    assert.equal(player.exposedSuits, 1);
  }
});
