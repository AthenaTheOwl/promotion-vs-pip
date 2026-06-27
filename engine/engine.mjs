// promotion-vs-pip — pure rules engine (no UI, no I/O, seeded RNG passed in).
// The deckbuilder reframe: every quarter you declare a suit, dominance is
// resolved non-transitively, and winning the SAME suit too many times exposes
// it (the Complicity Track). The UI and the balance sim both import this.

export const SUITS = ['vision', 'process', 'receipts', 'coalition'];

// Non-transitive ring: a beats BEATS[a].
// vision>process (story cuts through paperwork), process>receipts (paperwork
// buries evidence), receipts>coalition (receipts break alliances),
// coalition>vision (the room refuses the slogan).
export const BEATS = { vision: 'process', process: 'receipts', receipts: 'coalition', coalition: 'vision' };
export const beats = (a, b) => BEATS[a] === b;

// mulberry32 — small seeded PRNG so runs are reproducible.
export function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeDeck(perSuit) {
  const deck = [];
  for (const suit of SUITS) for (let i = 0; i < perSuit; i++) deck.push({ suit });
  return deck;
}

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Complicity scoring for winning a quarter with `suit`.
// 1st win: +2. 2nd: +1 (you "say the quiet part"). 3rd: +0 and the suit is
// EXPOSED. Every win after exposure: +0 applause and +1 red flag.
function applyWin(player, suit) {
  player.wins[suit] = (player.wins[suit] || 0) + 1;
  const n = player.wins[suit];
  if (n === 1) { player.applause += 2; return { bonus: 2, exposedNow: false }; }
  if (n === 2) { player.applause += 1; return { bonus: 1, exposedNow: false, confess: true }; }
  if (n === 3) { player.exposed[suit] = true; return { bonus: 0, exposedNow: true }; }
  // n > 3, suit already exposed
  player.redFlags += 1;
  return { bonus: 0, exposedNow: false, redFlag: true };
}

// Resolve one quarter. Each player has already chosen a declared suit.
// Dominance = how many opponents your suit beats. Unique max wins the quarter.
function resolveQuarter(players, declared, { bonusOnly = false } = {}) {
  const beatCount = players.map((p, i) => {
    let c = 0;
    for (let j = 0; j < players.length; j++) if (i !== j && beats(declared[i], declared[j])) c++;
    return c;
  });
  const max = Math.max(...beatCount);
  const leaders = beatCount.map((c, i) => (c === max ? i : -1)).filter((i) => i >= 0);
  if (leaders.length !== 1) return { winner: -1 }; // tie → no quarter winner
  const w = leaders[0];
  if (bonusOnly) return { winner: w, suit: declared[w] };
  const res = applyWin(players[w], declared[w]);
  return { winner: w, suit: declared[w], ...res };
}

// Lean scoring (tickOn='declare'): the crowd notices the TACTIC, not the trophy.
// Every quarter you declare a suit you "lean" on it. 1st-2nd lean: +1 applause
// (tempo). 3rd lean: the suit is EXPOSED. Leaning an exposed suit: -1 applause
// and +1 red flag (we can see the wires). The dominance winner still gets +2 on
// top. This is the variant where the Complicity Track actually bites.
function applyLean(player, suit) {
  if (player.exposed[suit]) { player.applause -= 1; player.redFlags += 1; return; }
  player.leans[suit] = (player.leans[suit] || 0) + 1;
  if (player.leans[suit] >= 3) { player.exposed[suit] = true; return; }
  player.applause += 1;
}

// Run a full game. `strategies` is an array of bot fns:
//   (self, ctx) => declaredSuit, where ctx = { handSuits, quarter, players }.
// tickOn: 'win' (complicity ticks only on quarter dominance) or 'declare'
// (complicity ticks every time you lean on a suit). Returns a result record.
export function runGame({ strategies, perSuit = 3, quarters = 6, handSize = 5, tickOn = 'win' }, rng) {
  const players = strategies.map((strategy, id) => ({
    id, strategy,
    deck: shuffle(makeDeck(perSuit), rng),
    applause: 0, redFlags: 0,
    wins: {}, leans: {}, exposed: {},
    forcedExposures: 0, // times the bot was forced to declare a maxed suit (no alternative)
  }));

  const counter = (p) => (tickOn === 'declare' ? p.leans : p.wins);

  for (let q = 0; q < quarters; q++) {
    // draw a hand: the suits available to declare this quarter
    const declared = players.map((p) => {
      if (p.deck.length < handSize) p.deck = shuffle(makeDeck(perSuit), rng); // reshuffle a fresh cycle
      const hand = p.deck.slice(0, handSize);
      p.deck = p.deck.slice(handSize);
      const handSuits = [...new Set(hand.map((c) => c.suit))];
      const choice = p.strategy(p, { handSuits, quarter: q, players });
      // forced = wanted to avoid a maxed suit, but the hand only offered maxed suits
      const c = counter(p);
      const fresh = handSuits.filter((s) => (c[s] || 0) < 2);
      p._forcedThisQuarter = fresh.length === 0 && (c[choice] || 0) >= 2;
      return choice;
    });

    if (tickOn === 'declare') {
      // complicity ticks on the lean; dominance winner gets a flat +2 on top
      players.forEach((p, i) => {
        const wasExposed = p.exposed[declared[i]];
        applyLean(p, declared[i]);
        if (!wasExposed && p.exposed[declared[i]] && p._forcedThisQuarter) p.forcedExposures += 1;
      });
      const res = resolveQuarter(players, declared, { bonusOnly: true });
      if (res.winner >= 0) players[res.winner].applause += 2;
    } else {
      // complicity ticks only on winning the quarter's dominance
      const res = resolveQuarter(players, declared);
      if (res.winner >= 0 && res.exposedNow && players[res.winner]._forcedThisQuarter) {
        players[res.winner].forcedExposures += 1;
      }
    }
  }

  const ranked = players.map((p) => ({
    id: p.id, applause: p.applause, redFlags: p.redFlags,
    wins: p.wins, exposedSuits: Object.keys(p.exposed).length, forcedExposures: p.forcedExposures,
  }));
  const top = Math.max(...ranked.map((r) => r.applause));
  const winners = ranked.filter((r) => r.applause === top).map((r) => r.id);
  return { winner: winners.length === 1 ? winners[0] : -1, players: ranked };
}
