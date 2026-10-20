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

test("6 quarters cannot reach the 4 red flags a PIP needs; the sim table reaches PIP in a longer game", async () => {
  const { mono, maskSwitcher, adaptive, greedy } = await import("../bots.mjs");
  const table = () => [mono("vision"), maskSwitcher(), adaptive(), greedy()];
  let pips = 0;
  for (let seed = 0; seed < 200; seed++) {
    const six = runGame({ strategies: table(), perSuit: 3, quarters: 6, handSize: 5, tickOn: "declare" }, makeRng(seed));
    for (const player of six.players) {
      assert.ok(player.redFlags <= 3, `seed ${seed}`);
      assert.equal(player.pip, false);
    }
    const eight = runGame({ strategies: table(), perSuit: 3, quarters: 8, handSize: 5, tickOn: "declare" }, makeRng(seed));
    pips += eight.players.filter((player) => player.pip).length;
  }
  assert.ok(pips > 0, "a simulated game should reach a PIP");
});

test("a PIP player keeps playing as HR but cannot win the promotion", () => {
  // vision beats process every quarter: player 0 wins 7 times, exposes vision
  // on the 3rd win and takes a red flag on each of wins 4-7.
  const result = runGame(
    { strategies: [() => "vision", () => "process"], perSuit: 1, quarters: 7, handSize: 1, tickOn: "win" },
    makeRng(7),
  );

  const [onPip, other] = result.players;
  assert.equal(onPip.pip, true);
  assert.equal(onPip.pipQuarter, 6);
  assert.ok(onPip.applause > other.applause);
  assert.equal(result.hiringFreeze, false);
  assert.equal(result.winner, 1);
});

test("PIP play continues after the 4th red flag", () => {
  const rotate = (suits) => (self, ctx) => suits[ctx.quarter % suits.length];
  const result = runGame(
    {
      strategies: [() => "vision", rotate(["process", "receipts", "coalition", "vision"])],
      perSuit: 1,
      quarters: 8,
      handSize: 1,
      tickOn: "declare",
    },
    makeRng(7),
  );

  assert.equal(result.quartersPlayed, 8);
  assert.equal(result.players[0].pipQuarter, 6);
  assert.equal(result.players[0].redFlags, 5);
  assert.equal(result.winner, 1);
});

test("a second PIP is a hiring freeze: the game ends with no winner", () => {
  const alwaysVision = () => "vision";
  const result = runGame(
    { strategies: [alwaysVision, alwaysVision], perSuit: 1, quarters: 8, handSize: 1, tickOn: "declare" },
    makeRng(7),
  );

  assert.equal(result.hiringFreeze, true);
  assert.equal(result.quartersPlayed, 7);
  assert.equal(result.winner, -1);
  for (const player of result.players) {
    assert.equal(player.pip, true);
    assert.equal(player.redFlags, 4);
  }
});

test("a hiring freeze leaves no winner even when a clean player leads", () => {
  const rotate = (suits) => (self, ctx) => suits[ctx.quarter % suits.length];
  const result = runGame(
    {
      strategies: [() => "vision", () => "vision", rotate(["process", "receipts", "coalition", "vision"])],
      perSuit: 1,
      quarters: 8,
      handSize: 1,
      tickOn: "declare",
    },
    makeRng(7),
  );

  const clean = result.players[2];
  assert.equal(result.hiringFreeze, true);
  assert.equal(result.quartersPlayed, 7);
  assert.equal(clean.pip, false);
  assert.equal(clean.redFlags, 0);
  for (const other of result.players.slice(0, 2)) assert.ok(clean.applause > other.applause);
  assert.equal(result.winner, -1);
});
