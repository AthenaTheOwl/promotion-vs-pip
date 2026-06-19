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

v0 scaffold. No cards, no rules text, no renderer. Spec 0001 defines
the card-type schemas, the rule-vote mechanism, the render pipeline,
and the playtest-report shape that land in spec 0002.

## How to run

Placeholder. Spec 0002 will ship the render pipeline:

```bash
python scripts/render_cards.py --out generated/cards.pdf
python scripts/render_cards.py --kind playtest-sheet --out generated/playtest.pdf
```

Print double-sided on cardstock. Use the audience-vote rules from
`rules/v0.md`. Record what happened in
`playtest-archive/<date>-<group>.md`.

## Layout

```
.
├── AGENTS.md
├── LICENSE
├── README.md
├── docs/
│   └── first-pr.md
└── specs/
    └── 0001-foundation/
        ├── acceptance.md
        ├── design.md
        ├── requirements.md
        └── tasks.md
```

Planned directories named in the spec:

- `cards/`
  - `meetings.yaml`
  - `proposals.yaml`
  - `policies.yaml`
  - `exposures.yaml`
- `rules/v0.md` — the playable rules sheet.
- `scripts/render_cards.py` — YAML to printable HTML (then PDF).
- `templates/` — the HTML+CSS card template.
- `playtest-archive/` — one Markdown report per session.
- `generated/` — gitignored output (cards.pdf, playtest.pdf).

## Why this exists

The user has Amazon TPM ground-truth on actual promotion and PIP
dynamics, MIT systems-thinking literacy on the feedback loops, and the
portfolio's operating-discipline aesthetic as the satire substrate. The
2026 indie deckbuilder wave (Shroom and Gloom, Mr Magpie, Beyond Words,
StarVaders) showed appetite for narrative-mechanical hybrids. This is
the smallest possible entry: a paper deck a person can print at home
and play in 30 minutes.

## License

MIT. See `LICENSE`. Game design is licensed under the same terms.
