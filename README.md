# Promotion vs PIP

A Brechtian deckbuilding card game. You climb the promotion track while
accruing PIP red flags. The audience votes change the rules mid-round.

## What this is

A 36-card print-and-play prototype. Six Meeting cards, eighteen Proposal
cards, six Policy cards, six Exposure cards. The deck is corporate
satire with mechanical teeth: every promotion-track win quietly
increases your PIP exposure, and the audience (other players, or a
live audience at the table) can vote rule changes that flip incentives
mid-round.

The artifact is a printable card deck plus a one-page rules sheet plus
a playtest report after the first session. No app, no engine, no
companion software. The whole thing fits in a paper sleeve.

## Status

v0.1 — 36 cards committed, renderer ships a print.html, rules v0
ready for a first 60-minute session. `print.example.html` is the
committed sample render.

10 node tests pass: schema validation, render output, card count,
HTML-escape, banned-name regression.

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

Print on cardstock, cut along the 2.5" x 3.5" borders. Each page
holds 9 cards. Read `rules/v0.md` for setup, round structure, and
win conditions. After playing, log what happened in
`playtest-log/<date>.md` (template at `playtest-log/2026-06-21-template.md`).

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

## Why this exists

The user has Amazon TPM ground-truth on actual promotion and PIP
dynamics, MIT systems-thinking literacy on the feedback loops, and the
portfolio's operating-discipline aesthetic as the satire substrate. The
2026 indie deckbuilder wave (Shroom and Gloom, Mr Magpie, Beyond Words,
StarVaders) showed appetite for narrative-mechanical hybrids. This is
the smallest possible entry: a paper deck a person can print at home
and play in 30 minutes.

## live demo

the static site is a clean vercel static deploy. `npm run build` renders the
deck into `public/` (a landing `index.html` plus the printable `deck.html`),
and `vercel.json` points the output directory at `public/`.

deploy steps:

1. go to vercel.com -> add new -> project -> import `AthenaTheOwl/promotion-vs-pip`
2. vercel reads `vercel.json` (build command `npm run build`, output dir `public/`)
3. deploy

<!-- live-url: https://___.vercel.app -->

## License

MIT. See `LICENSE`. Game design is licensed under the same terms.
