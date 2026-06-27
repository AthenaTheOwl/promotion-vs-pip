// Balance simulator. The one question the design hinges on: does the Complicity
// Track punish STRATEGY (you leaned on one suit on purpose) or DRAW LUCK (you got
// forced into a third same-suit win)? Run a fleet of games and measure.
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

function run(perSuit, tickOn) {
  const wins = [0, 0, 0, 0];
  const exposures = [0, 0, 0, 0];
  const forced = [0, 0, 0, 0];
  const applause = [0, 0, 0, 0];
  let draws = 0;
  for (let g = 0; g < GAMES; g++) {
    const rng = makeRng(g + perSuit * 1_000_000);
    const res = runGame({ strategies: table(), perSuit, quarters: 6, handSize: 5, tickOn }, rng);
    if (res.winner < 0) draws++; else wins[res.winner]++;
    for (const p of res.players) {
      exposures[p.id] += p.exposedSuits;
      forced[p.id] += p.forcedExposures;
      applause[p.id] += p.applause;
    }
  }
  return { wins, exposures, forced, applause, draws };
}

function report(perSuit, tickOn) {
  const r = run(perSuit, tickOn);
  console.log(`\n=== tickOn='${tickOn}' · ${perSuit}-of-each (deck of ${perSuit * 4}), ${GAMES} games ===`);
  console.log('strategy        win%    avg applause   exposures/game   forced-exposures/game');
  for (let i = 0; i < 4; i++) {
    const winPct = ((r.wins[i] / GAMES) * 100).toFixed(1).padStart(5);
    const avgApp = (r.applause[i] / GAMES).toFixed(2).padStart(6);
    const expG = (r.exposures[i] / GAMES).toFixed(3).padStart(6);
    const forcedG = (r.forced[i] / GAMES).toFixed(3).padStart(6);
    console.log(`${LABELS[i].padEnd(14)}  ${winPct}   ${avgApp}        ${expG}           ${forcedG}`);
  }
  console.log(`draws (no unique winner): ${((r.draws / GAMES) * 100).toFixed(1)}%`);
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
