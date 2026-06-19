# Spec 0001 — Design

## Shape

Four YAML files of cards, one Markdown rules sheet, one HTML template,
one render script, one validator, one voice lint, one playtest
template. That is the whole repo.

```
cards/
  meetings.yaml      # 6 cards (R-PVP-003)
  proposals.yaml     # 18 cards
  policies.yaml      # 6 cards
  exposures.yaml     # 6 cards
rules/
  v0.md              # R-PVP-004, R-PVP-005
templates/
  card.html          # one card layout; CSS print stylesheet
  sheet.html         # 9-card-per-page layout for printing
scripts/
  render_cards.py    # R-PVP-006
  validate_cards.py  # R-PVP-007
  voice_lint.py      # R-PVP-008
  spec_check.py      # R-PVP-010
playtest-archive/
  _template.md       # R-PVP-009
generated/           # gitignored
```

## Card schema

Each card YAML row:

```yaml
- id: M-001
  kind: meeting
  name: "Standup with Skip-Level"
  cost: 1
  effect: "Reveal the top card of the Policy deck. If it's a Policy you can pay 0 to play it now."
  flavor: "He just wants to be in the loop."
  promotion_delta: 0
  pip_delta: 0
```

Per-kind defaults differ: Proposals have non-zero `promotion_delta` and
often non-zero `pip_delta`; Exposures have negative `promotion_delta`
and positive `pip_delta`; Policies have effect-only payloads.

## Audience-vote mechanism

Three triggers, three effects, all listed in `rules/v0.md`:

1. `MAJORITY_GROAN` — when the active player plays a Proposal with
   `pip_delta >= 2`. Effect: the player draws -1.
2. `MAJORITY_LAUGH` — when an Exposure is revealed. Effect: the
   exposed player keeps the exposure but gains 1 promotion token.
3. `SPLIT_VOTE` — once per round, any spectator may call a Split Vote
   on a Policy. Effect: the Policy's text is read out loud by the
   spectator and applied immediately.

The triggers attach to Policy cards by id reference; the validator
checks the cross-reference.

## Render pipeline

`render_cards.py` loads the four YAMLs, validates, applies the HTML
template per card, and emits a single `generated/cards.html`. The user
opens the file in a browser and prints to PDF using the included CSS
print stylesheet. v0 does not pretend to be a print shop; it produces
a clean browser-printable artifact.

## Why no game engine

The audience-vote mechanism only works face-to-face. Building a
digital version would change the game from Brechtian satire (audience
breaks the fourth wall) to single-player optimization. v0 stays
paper.

## What is not in spec 0001

- Multiple expansions (Engineering Manager edition, etc.).
- A campaign mode.
- Stretch art assets.

Spec 0002 lands the first complete 36-card draft + the first
real playtest session report.
