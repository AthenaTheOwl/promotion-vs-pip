# AGENTS.md — promotion-vs-pip

Operating contract for AI agents working on this card game.

## What this repo is

A 36-card print-and-play satire deckbuilder. The game lives in four
YAML files (one per card type), a Markdown rules file, and a small
render script that produces a printable PDF.

This is not a digital game. It is not a companion app. The artifact
the user prints and plays is the entire product.

## Voice constraints

- Card flavor text is Brechtian: it tells you the trick rather than
  hiding it. A card whose effect is "draw 1, take 1 PIP token" reads
  the same way out loud.
- No marketing words. No antithetical reversals as a structural
  device. The satire is concrete, not gestural.
- Names of real companies, products, or executives never appear.
  Roles only (`Director of Strategy`, `Skip-Level`, `PIP Coach`).
- Audience-vote rules are stated in plain imperative: "If three or
  more spectators clap, the active player discards a Proposal."

## Roles in tasks

| Role | What they do |
|---|---|
| `card-author` | Writes YAML entries; one card per author session |
| `rules-keeper` | Owns `rules/v0.md`; integrates playtest learnings |
| `renderer` | Maintains `scripts/render_cards.py` and templates |
| `playtester` | Files `playtest-archive/<date>-<group>.md` |

## Gates

Built and running in CI (`.github/workflows/ci.yml`):

```bash
npm run validate    # node scripts/validate_cards.js — 36 cards, counts by type
npm test            # node --test over validate, render, no-employer-names, engine, bots
npm run build       # node scripts/build_site.js
```

The gates landed in Node, not Python. The earlier plan named
`validate_cards.py`, `render_cards.py --check-only`, and
`spec_check.py`; the first two exist as `scripts/validate_cards.js` and
`scripts/render_cards.js`, and `npm run validate` is the card gate.
`test_no_employer_names.js` enforces the "no real companies, products,
or executives" rule from Voice constraints.

Planned, not built: `spec_check.py` (every R-* ID in `specs/` resolved
by a DEC or test) and a voice lint over `cards/*.yaml` and `rules/v0.md`.
Do not cite either as if it runs.

A card YAML that fails validation does not get rendered.

## Out of scope

- A digital implementation. The deck stays paper.
- A campaign / legacy mode. v0 is a single 30-minute session.
- Real names. Satire of roles, not of identifiable individuals.
- Profit. The deck is MIT-licensed and free to print.
