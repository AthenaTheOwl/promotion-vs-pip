# Spec 0001 — Tasks

Ordered for the first 2-3 PRs.

## PR 1 — card schema + validator + 4 sample cards per kind

- [ ] Write `cards/meetings.yaml` with 2 sample cards.
- [ ] Write `cards/proposals.yaml` with 2 sample cards.
- [ ] Write `cards/policies.yaml` with 2 sample cards.
- [ ] Write `cards/exposures.yaml` with 2 sample cards.
- [ ] Write `scripts/validate_cards.py` (R-PVP-007) — count check is
      relaxed to "more than 0" in this PR; full count enforced in
      PR 2 once the deck is complete.
- [ ] Write `playtest-archive/_template.md` (R-PVP-009).

## PR 2 — full 36-card draft + render pipeline

- [ ] Expand to the full 6 / 18 / 6 / 6 split (R-PVP-003).
- [ ] Write `templates/card.html` + `templates/sheet.html`.
- [ ] Write `scripts/render_cards.py` (R-PVP-006).
- [ ] Tighten `validate_cards.py` to enforce exact counts.
- [ ] Write `rules/v0.md` with all five required sections (R-PVP-004,
      R-PVP-005).
- [ ] Cross-reference audience-vote triggers from Policy cards by
      id; validator checks the link.

## PR 3 — voice lint, spec check, real-name guard, first playtest

- [ ] Copy `scripts/voice_lint.py` from portfolio + extend banlist
      (R-PVP-008).
- [ ] Write `scripts/spec_check.py` (R-PVP-010).
- [ ] Add the real-name deny-list check inside `validate_cards.py`
      (R-PVP-011).
- [ ] Render the first PDF, print, run one playtest, file
      `playtest-archive/2026-MM-DD-first-session.md`.
- [ ] All gates exit zero.
