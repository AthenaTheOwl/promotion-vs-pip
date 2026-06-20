# Requirements — 0002-design (v0.1 paper prototype)

Brand prefix: `PVP`. v0.1 narrows the foundation's 36-card ambition into the smallest playable artifact: 36 cards in YAML, rendered to one printable HTML page, with v0 rules sized for one 60-minute session at a table of 3–5 players.

## v0.1 requirements

- R-PVP-V1-001: 36 cards committed across 4 YAML files: 6 Meetings, 18 Proposals, 6 Policies, 6 Exposures. Each card has `id`, `title`, `type`, `effect`, `alienation` (the audience-facing bit prompt), optional `flavor` (a one-liner deadpan note).
- R-PVP-V1-002: card YAML files validate against a JSON Schema. Schema is committed at `schema/cards.schema.json`.
- R-PVP-V1-003: `node scripts/validate_cards.js` exits non-zero on any schema violation, with file:path naming the offending card.
- R-PVP-V1-004: `node scripts/render_cards.js [--out PATH]` reads the 4 YAML files and emits one HTML file containing 36 cards. Default output: `print.html`.
- R-PVP-V1-005: rendered cards are sized 2.5" × 3.5" via CSS (standard poker-card dimensions for print). One page fits ~9 cards (3×3 layout); 4 pages total.
- R-PVP-V1-006: `rules/v0.md` is a 1–2 page document describing setup, round structure, win conditions, and the audience-vote mechanic. Sized for a 60-minute first session.
- R-PVP-V1-007: `DEC-PVP-001-card-counts.md` documents why the 6/18/6/6 split.
- R-PVP-V1-008: `node --test scripts/` runs all node:test files and exits 0. Coverage: schema validation, render output, card-count invariants, banned-name invariants.
- R-PVP-V1-009: a banned-name invariant test (`scripts/tests/test_no_employer_names.js`) scans every card YAML for tokens that would tie the satire to a specific real employer (`Amazon`, `AWS`, `Azure`, `Google`, `Microsoft`, `Apple`, `Meta`, `OpenAI`, `Anthropic`). Failure on any hit.
- R-PVP-V1-010: README documents card formats, how to render, how to run tests, and how to log a playtest session.
- R-PVP-V1-011: `playtest-log/2026-06-21-template.md` is committed as the template for the first real playtest. Headings: setup, attendees, what-broke, what-worked, edits-for-next.
- R-PVP-V1-012: `print.example.html` is committed as a sample render for reviewers who don't want to install node.

## Out of scope for v0.1

- Any digital playable engine (no game loop, no scoring code)
- Score-tracking automation, action-resolution simulator
- Multi-deck variants
- Card-pack downloadable beyond the print HTML
- Localization
