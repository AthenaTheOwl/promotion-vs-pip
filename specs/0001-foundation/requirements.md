# Spec 0001 — Foundation

## R-PVP-001 — repo scaffold
Repo at `e:/claude_code/random-apps/promotion-vs-pip`. MIT license.
README, AGENTS.md, LICENSE, .gitignore at the root.

## R-PVP-002 — four card YAMLs
`cards/meetings.yaml`, `cards/proposals.yaml`, `cards/policies.yaml`,
`cards/exposures.yaml`. Each card has `id`, `name`, `cost`, `effect`,
`flavor`, `kind` (meeting / proposal / policy / exposure),
`promotion_delta`, `pip_delta`.

## R-PVP-003 — card counts
v0 ships exactly 6 Meetings, 18 Proposals, 6 Policies, 6 Exposures =
36 cards. The validator refuses to render with the wrong counts.

## R-PVP-004 — rule sheet
`rules/v0.md` is the playable rules file. Sections: setup, turn,
audience-vote, promotion-track win, PIP-track loss. Length under 800
words.

## R-PVP-005 — audience-vote mechanism
The rules name three audience-vote triggers and the exact card effect
each vote produces. The triggers and effects are listed in
`rules/v0.md` and cross-referenced from the relevant Policy cards by
`id`.

## R-PVP-006 — render pipeline
`scripts/render_cards.py` reads the four YAMLs plus `templates/card.html`
and produces `generated/cards.html` ready for browser print to PDF.
v0 does not embed a PDF library; the user prints from a browser.

## R-PVP-007 — card validator
`scripts/validate_cards.py` enforces: counts per kind (R-PVP-003);
required fields (R-PVP-002); `promotion_delta` and `pip_delta`
integer ranges; no duplicate `id`; flavor text length cap.

## R-PVP-008 — voice lint
`scripts/voice_lint.py` (portfolio copy) runs over `cards/*.yaml` and
`rules/v0.md`. The banlist includes the portfolio defaults plus a
small extension for "innovative", "disruptive", "rockstar", "ninja",
"thought leader".

## R-PVP-009 — playtest report shape
`playtest-archive/_template.md` defines the expected sections: date,
players, deck-version, what-happened, what-broke, proposed-fixes.

## R-PVP-010 — spec check
`scripts/spec_check.py` confirms every `R-PVP-NNN` referenced in
`design.md` and `tasks.md` is defined here.

## R-PVP-011 — no real names
The validator rejects any card or rule text matching a small deny-list
of real-company and real-executive name patterns.
