# Promotion vs PIP

Every card that climbs the promotion track also quietly stamps you with a red flag. Win enough, loudly enough, and the same deck that promoted you has built the case for your PIP. Thirty-six cards, one paper sleeve, and an audience that can vote the rules sideways while you're mid-pitch.

## What it does

A 36-card print-and-play deck of corporate satire with mechanical teeth. Six Meeting cards frame the round, eighteen Proposal cards are where you actually move, six Policy cards bend the rules until the next shuffle, and six Exposure cards exist to point at your work and ask "what problem does this solve?" The promotion track and the PIP track are the same track read in two directions: a Roadmap Tightening that earns you +2 reputation leaves the cut Proposal sitting there as a Red Flag next round.

It's Brechtian on purpose. Cards carry an alienation instruction — say "synergies" exactly once and apologize for it, mime cradling a fragile object whenever you say "customer" — so the table is always half-performing the meeting it's mocking. And the audience votes can flip incentives mid-round, so the strategy you committed to on turn one can be the thing that sinks you by turn four.

No app, no engine, no companion software. The whole game fits in a paper sleeve and runs in about 30 minutes.

## Try it

```bash
npm install                 # ajv + js-yaml only
npm run validate
```

```
valid: 36 cards (M:6 P:18 L:6 E:6)
```

`validate` checks all 36 card YAMLs against the schema and confirms the deck still counts to six Meetings, eighteen Proposals, six Policies, and six Exposures. Exits clean on a clean deck.

## How to run

```bash
npm install                 # ajv + js-yaml only

# Validate every card YAML against the schema
npm run validate

# Render the 36 cards to one printable HTML page (4 pages of 9 cards)
npm run render
open print.html             # mac;  start print.html on windows

# Build the static site (public/index.html landing + public/deck.html deck)
npm run build

# Run the tests
npm test
```

Print on cardstock, cut along the 2.5" x 3.5" borders. Each page holds 9 cards. Read `rules/v0.md` for setup, round structure, and win conditions. After playing, log what happened in `playtest-log/<date>.md` (template at `playtest-log/2026-06-21-template.md`).

## live demo

the static site is a clean vercel static deploy. `npm run build` renders the
deck into `public/` (a landing `index.html` plus the printable `deck.html`),
and `vercel.json` points the output directory at `public/`.

deploy steps:

1. go to vercel.com -> add new -> project -> import `AthenaTheOwl/promotion-vs-pip`
2. vercel reads `vercel.json` (build command `npm run build`, output dir `public/`)
3. deploy

<!-- live-url: https://___.vercel.app -->

## How it connects

Part of the narrative cluster — small print-and-play experiments that turn a system into something you can sit at a table and play. Its sibling [oulipo-memory-deck](https://github.com/AthenaTheOwl/oulipo-memory-deck) runs the same paper-deck shape over a writing constraint instead of a promotion ladder, and both live alongside the [starforge demos](https://github.com/AthenaTheOwl?tab=repositories&q=starforge), which share one prose source and ship as different playable shapes.

## Layout

```
.
├── cards/                       36 cards as YAML
│   ├── meetings.yaml            6 cards (round frames)
│   ├── proposals.yaml          18 cards (the main action)
│   ├── policies.yaml            6 cards (persistent rule tweaks)
│   └── exposures.yaml           6 cards (callouts)
├── schema/cards.schema.json     JSON Schema (2020-12 draft)
├── scripts/
│   ├── lib/loader.js            YAML load + validate
│   ├── validate_cards.js        CLI: validate everything
│   ├── render_cards.js          CLI: emit print.html
│   └── tests/                   node:test files
├── templates/card.html          one-card HTML template
├── styles/cards.css             2.5x3.5in print CSS
├── rules/v0.md                  60-minute session rules
├── decisions/
│   └── DEC-PVP-001-card-counts.md
├── playtest-log/
│   └── 2026-06-21-template.md
├── print.example.html           committed sample render
└── specs/
    ├── 0001-foundation/         original scaffold spec
    └── 0002-design/             v0.1 narrowed scope (this is what shipped)
```

## License

MIT. See `LICENSE`. Game design is licensed under the same terms.
