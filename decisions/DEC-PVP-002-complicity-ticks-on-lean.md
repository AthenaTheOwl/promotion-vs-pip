# DEC-PVP-002 — Complicity ticks on the lean, not the win

**Date:** 2026-06-21
**Status:** accepted (sim-validated, pre-playtest)
**Supersedes:** the draft assumption in the deckbuilder reframe that complicity
ticks when you *win* a quarter's dominance.

## Context

The deckbuilder reframe of promotion-vs-pip rests on the Complicity Track: lean on
one suit too long and the crowd exposes you, so a legible strategy is supposed to
lose. The open design question was whether that track punishes *strategy* (you
over-leaned on purpose) or *draw luck* (you got forced into a third same-suit win).
Built a pure rules engine (`engine/`) and a balance sim (`sim/balance.mjs`, 4000
games per config) to answer it before writing any cards.

## What the sim found

Two rules, 4-player table (mono-vision / mask-switcher / adaptive / greedy):

| rule | mono win% | mono exposes/game | switcher win% | forced-by-luck |
|---|---|---|---|---|
| ticks on WIN (draft) | 14.9% | 0.01 | 13.3% | n/a — never fires |
| ticks on LEAN | 1.6% | 1.00 | 26.5% | ~0.003/game |

- **Ticking on win makes the mechanic inert.** Dominance wins are rare (37% of
  quarters tie under non-transitive RPS with 4 players), so no one wins a single
  suit three times in six quarters. The Brechtian engine never triggers.
- **Ticking on the lean turns it on and aims it right.** The legible over-leaner
  collapses (15% → 1.6%) and exposes its suit every game by Q3; the players who
  spread their leans rise to ~26%.
- **It punishes intent, not luck.** Forced-exposures are ~0.003/game. Deck size
  (3/4/5-of-each) barely moves anything, so this is not a card-count problem.

## Decision

Complicity ticks when you **declare (lean on) a suit**, not when you win the
quarter. First two leans on a suit: +1 applause (tempo). Third lean: the suit is
exposed. Leaning an exposed suit: −1 applause and +1 red flag. The dominance
contest still awards a separate +2 to the quarter winner.

## Open follow-up

Mono-vision at 1.6% is near-unplayable — the post-exposure penalty may be too
harsh. Over-leaning should be sub-optimal, not suicidal. Sweep the exposed-suit
penalty (try −1 applause with no red flag, or red flag only) and pick the value
where the naive one-suit line lands around 8-10% rather than ~2%. The sim is the
tool; this is a one-number change.

## Evidence

`engine/engine.mjs`, `engine/bots.mjs`, `sim/balance.mjs`. Reproduce with
`node sim/balance.mjs`.

## Correction (2026-10-19)

The ticks-on-LEAN row above was measured with a bug: the mask-switcher and
adaptive bots avoided a third same-suit *win*, not a third *lean*, so under this
rule they were not trying to stay clean, and the forced-by-luck figure described
a bot that ignored its leans. The bots now steer on the count the active rule
ticks. Re-run of `node sim/balance.mjs`, 3-of-each, ticks on LEAN:

| rule | mono win% | mono exposes/game | switcher win% | switcher exposes/game | forced-by-luck (switcher / adaptive) |
|---|---|---|---|---|---|
| ticks on LEAN (corrected bots) | 1.3% | 1.00 | 24.2% | 0.00 | 0.000 / ~0.014 per game |

The decision stands: the over-leaner still collapses, and a bot that spreads its
leans can avoid exposure entirely, so the track still punishes intent, not luck.
Greedy, which ignores the track, falls from 25.1% to 18.6%.

PIP note: the engine had no PIP. It now applies the `rules/v0.md` PIP (4 red
flags; a PIP player keeps declaring with the same bot and cannot win the
promotion, though HR's free Exposures are not modelled; a second PIP is a
hiring freeze). Under this rule a 6-quarter
game tops out at 3 red flags (3 leans to expose, then 1 per lean), so PIP
cannot fire in a 6-quarter game. The sim exercises it with a labelled
8-quarter probe, where mono-vision is on a PIP in 62% of games. Whether PIP
should be reachable in 6 quarters belongs with the penalty sweep above.
