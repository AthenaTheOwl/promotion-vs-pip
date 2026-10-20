// Balance simulator. The one question the design hinges on: does the Complicity
// Track punish STRATEGY (you leaned on one suit on purpose) or DRAW LUCK (you got
// forced into a third same-suit tick: a lean under RULE B, a win under RULE A)?
// Run a fleet of games and measure.
//
//   node sim/balance.mjs

import { runGame, makeRng } from '../engine/engine.mjs';
import { mono, maskSwitcher, adaptive, greedy } from '../engine/bots.mjs';

const GAMES = 4000;

// A 4-player table: a legible mono-vision optimizer, a mask-switcher trying to
// stay clean, an adaptive human-like player, and a greedy naive one.
function table() {
  return [mono('vision'), maskSwitcher(), adaptive(), greedy()];
}
const LABELS = ['mono-vision', 'mask-switcher', 'adaptive', 'greedy'];

function run(perSuit, tickOn, quarters = 6) {
  const wins = [0, 0, 0, 0];
  const exposures = [0, 0, 0, 0];
  const forced = [0, 0, 0, 0];
  const applause = [0, 0, 0, 0];
  const pips = [0, 0, 0, 0];
  let draws = 0;
  let freezes = 0;
  let maxRedFlags = 0;
  for (let g = 0; g < GAMES; g++) {
    const rng = makeRng(g + perSuit * 1_000_000);
    const res = runGame({ strategies: table(), perSuit, quarters, handSize: 5, tickOn }, rng);
    if (res.hiringFreeze) freezes++;
    else if (res.winner < 0) draws++; else wins[res.winner]++;
    for (const p of res.players) {
      exposures[p.id] += p.exposedSuits;
      forced[p.id] += p.forcedExposures;
      applause[p.id] += p.applause;
      if (p.pip) pips[p.id]++;
      maxRedFlags = Math.max(maxRedFlags, p.redFlags);
    }
  }
  return { wins, exposures, forced, applause, pips, draws, freezes, maxRedFlags };
}

function report(perSuit, tickOn, quarters = 6) {
  const r = run(perSuit, tickOn, quarters);
  console.log(`\n=== tickOn='${tickOn}' · ${perSuit}-of-each (deck of ${perSuit * 4}), ${quarters} quarters, ${GAMES} games ===`);
  console.log('strategy        win%    avg applause   exposures/game   forced-exposures/game   PIP%');
  for (let i = 0; i < 4; i++) {
    const winPct = ((r.wins[i] / GAMES) * 100).toFixed(1).padStart(5);
    const avgApp = (r.applause[i] / GAMES).toFixed(2).padStart(6);
    const expG = (r.exposures[i] / GAMES).toFixed(3).padStart(6);
    const forcedG = (r.forced[i] / GAMES).toFixed(3).padStart(6);
    const pipPct = ((r.pips[i] / GAMES) * 100).toFixed(1).padStart(5);
    console.log(`${LABELS[i].padEnd(14)}  ${winPct}   ${avgApp}        ${expG}           ${forcedG}                ${pipPct}`);
  }
  console.log(`draws (no unique winner): ${((r.draws / GAMES) * 100).toFixed(1)}%`);
  console.log(`hiring freezes (2+ PIPs): ${((r.freezes / GAMES) * 100).toFixed(1)}% · most red flags seen: ${r.maxRedFlags}`);
  // the verdict signals
  const switcherForced = r.forced[1] / GAMES;
  const monoExposed = r.exposures[0] / GAMES;
  const switcherExposed = r.exposures[1] / GAMES;
  console.log(`  signal: mono exposes ${monoExposed.toFixed(2)}/game, switcher exposes ${switcherExposed.toFixed(2)}/game ` +
    `(${(switcherForced).toFixed(3)} of switcher's were FORCED by draw).`);
  return r;
}

console.log('promotion-vs-pip — Complicity Track balance probe');
console.log('Q1: under each rule, does the track fire at all, and who does it punish?');
console.log('\n----- RULE A: complicity ticks only on WINNING a quarter (Codex draft) -----');
report(3, 'win');
console.log('\n----- RULE B: complicity ticks on LEANING (declaring a suit) -----');
report(3, 'declare');
report(4, 'declare');

// PIP (rules/v0.md) fires at 4 red flags. Under RULE B a red flag needs a lean
// on an already-exposed suit, and exposure takes 3 leans, so a 6-quarter game
// tops out at 3 red flags and PIP cannot fire. This probe lengthens the game
// only to exercise the PIP / HR / hiring-freeze path; it is not a rule change.
console.log('\n----- PIP probe: RULE B, longer game (6 quarters cannot reach 4 red flags) -----');
report(3, 'declare', 8);
