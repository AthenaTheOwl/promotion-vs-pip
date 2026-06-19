# Spec 0001 — Acceptance

v0 is done when the following hold.

## Repo shape

- README, LICENSE, AGENTS.md, .gitignore at the root.
- `specs/0001-foundation/` complete.
- `docs/first-pr.md` concrete and file-level.

## Commands

After PR 1-3 land:

```bash
python scripts/validate_cards.py
python scripts/voice_lint.py cards/*.yaml rules/v0.md
python scripts/spec_check.py
python scripts/render_cards.py --out generated/cards.html
```

All four exit zero.

## Functional gates

- Exactly 36 cards across the four YAMLs in the 6 / 18 / 6 / 6 split
  (R-PVP-003).
- `rules/v0.md` is under 800 words and contains all five required
  sections (R-PVP-004).
- All three audience-vote triggers in `rules/v0.md` map to at least
  one Policy card by id reference (R-PVP-005).
- `generated/cards.html` opens in a browser and prints to a clean
  9-card-per-page PDF.
- Zero real-company or real-executive name matches (R-PVP-011) across
  all YAMLs and the rules sheet.
- At least one playtest report exists at
  `playtest-archive/2026-MM-DD-*.md` following the
  `_template.md` shape.

## Out of scope for v0 acceptance

- Stretch art.
- Expansions.
- A digital implementation.
- Distribution channels.

Those are not planned.
