# Design — 0002-design

## Architecture

```
┌──────────────────────────────────────┐
│ cards/{meetings,proposals,policies,  │  human-edited YAML
│        exposures}.yaml               │
└─────────────────┬────────────────────┘
                  │ load + validate
                  ▼
        ┌────────────────────┐
        │ scripts/lib/loader │  reads + merges all 4 files
        │ + validator.js     │  + AJV schema check
        └─────┬─────────┬────┘
              │         │
              ▼         ▼
   ┌────────────────┐  ┌──────────────────┐
   │ validate_cards │  │ render_cards.js  │  HTML emitter
   │ .js (CLI)      │  │ (CLI)            │  + CSS for print
   └────────────────┘  └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ print.html       │  4 pages, 36 cards
                       └──────────────────┘
```

Zero dependencies beyond `ajv` (JSON Schema validator) and `js-yaml`. Pure node — no bundler, no transpiler, no build step.

## Card schema

```json
{
  "id": "M-01",
  "title": "All-Hands",
  "type": "meeting",
  "effect": "Applause tokens worth double; boo tokens convert to red flags.",
  "alienation": "Read this card's effect aloud in your CEO voice.",
  "flavor": "(optional one-liner)"
}
```

- `id` format: `<TYPE_LETTER>-NN` where letter is `M|P|L|E` for Meeting/Proposal/Policy/Exposure, NN is 2-digit.
- `type` is constrained to one of the four card types.
- `effect` is the rules-text on the card.
- `alienation` is the Brechtian audience-facing bit (the fourth-wall break).
- `flavor` is optional comedic dressing.

## Render pipeline

`render_cards.js`:
1. Read 4 YAML files via `js-yaml`.
2. Validate against schema via AJV.
3. For each card, fill `templates/card.html` (a string template with `${title}`, `${effect}`, `${alienation}`, `${flavor}` slots).
4. Wrap in a page layout (`styles/cards.css` for 2.5×3.5" print).
5. Write to `--out` (default `print.html`).

The template + CSS are committed alongside; non-coders can edit visuals without touching JS.

## Round structure (rules/v0.md preview)

```
Setup (5 min):
  - shuffle 6 Meeting cards; 18 Proposals; 6 Policies; 6 Exposures
  - deal each player 5 Proposals + 2 Exposures
  - place Policies face-up; they're a pool everyone can pull from

Round (× 6):
  1. Reveal one Meeting card. Read alienation aloud.
  2. Each player proposes up to 1 Proposal. Read its alienation.
  3. Audience (other players) votes thumbs-up/down.
  4. Resolve effects. Update reputation + red-flag tracks.
  5. Optionally play 1 Exposure on someone.

Win condition:
  - Highest reputation after the 6th meeting wins promotion.
  - Anyone hitting 4 red flags triggers PIP — they swap to "HR" role
    and weaponize Exposure cards for the remaining rounds.
```

## Voice constraint encoded as a test

`scripts/tests/test_no_employer_names.js` is the regression that prevents accidental satire-against-a-specific-employer drift. Banned tokens are case-insensitive whole-word matches. Failure points at file:line.

This is the security-lens finding made executable.

## Failure modes per block

| Block | Failure mode | Behavior |
|---|---|---|
| validate_cards.js | YAML parse error | exit 2 with file:line |
| validate_cards.js | schema violation | exit 2 with card.id + missing field |
| validate_cards.js | duplicate id across files | exit 2 |
| render_cards.js | validation fails | propagate exit 2 |
| render_cards.js | template file missing | exit 3 with path |
| render_cards.js | output path unwritable | exit 3 |
| tests/test_no_employer_names | banned token hit | exit 1 with file:card.id:token |

## Out of scope for v0.1 (future specs)

- Web playable (Electron / browser-based digital game)
- Card-image generator
- Localization
- Deck variants (PMs vs Engineers vs Sales) — each is a v0.2+ deck
