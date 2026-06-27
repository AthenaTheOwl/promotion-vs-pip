// Bot strategies for the balance sim. A strategy picks a declared suit from the
// suits available in hand this quarter.

import { SUITS } from './engine.mjs';

const pick = (arr, rng) => arr[Math.floor((rng ? rng() : Math.random()) * arr.length)];

// mono(suit): always lean one suit. The "legible" player the Complicity Track
// is supposed to punish. Declares its suit if drawn, else its most-drawn suit.
export const mono = (suit) => (self, ctx) => {
  if (ctx.handSuits.includes(suit)) return suit;
  return ctx.handSuits[0];
};

// maskSwitcher: never take a 3rd win on a suit if it can help it. Prefers the
// available suit it has won the FEWEST times. If every available suit is already
// maxed (won >= 2), it's forced. This is the bot whose forced-exposure rate
// tells us if the deck is too thin.
export const maskSwitcher = () => (self, ctx) => {
  const ranked = ctx.handSuits.slice().sort((a, b) => (self.wins[a] || 0) - (self.wins[b] || 0));
  return ranked[0];
};

// greedy: declare the suit you have the most of (drawn strength), ignoring
// complicity. A naive optimizer.
export const greedy = () => (self, ctx) => {
  // ctx.handSuits is a set; approximate "most of" by preferring a fixed order
  // when tied. Good enough: declare the strongest available by ring position.
  return ctx.handSuits[0];
};

// adaptive: like maskSwitcher but will take a 2nd win freely (the +1 is worth
// it) and only avoids the 3rd. Closest to how a smart human plays the dilemma.
export const adaptive = () => (self, ctx) => {
  const safe = ctx.handSuits.filter((s) => (self.wins[s] || 0) < 2);
  if (safe.length) {
    // among safe suits, prefer the one with a win already (build the +1) then fresh
    safe.sort((a, b) => (self.wins[b] || 0) - (self.wins[a] || 0));
    return safe[0];
  }
  return ctx.handSuits[0]; // forced into a maxed suit
};

export const random = (rng) => (self, ctx) => pick(ctx.handSuits, rng);

export { SUITS };
