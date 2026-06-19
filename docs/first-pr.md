# First PR after the scaffold

Title: `feat: card schema, validator, two sample cards per kind`

## Scope

This PR lands the four card YAMLs (each with 2 sample cards), the
validator with relaxed count rules, and the playtest report
template. No full 36-card deck yet; no rules sheet yet; no renderer
yet. The goal is that the schema is locked and the validator runs
green against 8 hand-authored cards.

## Files added

- `cards/meetings.yaml` — 2 cards. IDs `M-001`, `M-002`. Both
  `kind: meeting`. At least one card uses `effect` that references
  another deck.
- `cards/proposals.yaml` — 2 cards. IDs `P-001`, `P-002`. Both
  `kind: proposal`. At least one with `pip_delta > 0` so the
  validator can be tested.
- `cards/policies.yaml` — 2 cards. IDs `POL-001`, `POL-002`. Both
  `kind: policy`. One of them is reserved for a later
  `MAJORITY_GROAN` reference.
- `cards/exposures.yaml` — 2 cards. IDs `E-001`, `E-002`. Both
  `kind: exposure`. Both have `promotion_delta < 0` and
  `pip_delta > 0`.
- `scripts/validate_cards.py` — R-PVP-007 with the relaxed count
  rule (`>= 1` per kind, not exact). Enforces required fields,
  delta ranges, duplicate ids, flavor length cap.
- `playtest-archive/_template.md` — R-PVP-009. Sections: date,
  players, deck-version, what-happened, what-broke,
  proposed-fixes.
- A short `cards/README.md` describing the YAML row shape.

## Files changed

None. First PR after the scaffold.

## Verification

```bash
python scripts/validate_cards.py
```

The validator exits zero with the 8 sample cards present and exits
non-zero if any card YAML is malformed (a fixture test in
`tests/test_validator.py` covers both branches).

## What this PR does not do

- No `rules/v0.md`. The rules sheet ships in PR 2.
- No `render_cards.py`. PR 2.
- No HTML templates. PR 2.
- No voice_lint or spec_check. PR 3.
- No real-name deny-list (PR 3).

## Review checklist

- [ ] Each YAML file has exactly 2 cards.
- [ ] No duplicate ids across the four files.
- [ ] No real company or executive name appears in any `name`,
      `effect`, or `flavor`.
- [ ] Flavor text on each card is under the cap defined in the
      validator (default 140 chars).
- [ ] Validator fails clearly when a deliberately-broken fixture is
      passed in.
