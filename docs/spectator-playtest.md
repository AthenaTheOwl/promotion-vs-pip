# Playtest the audience intervention as a separate mechanism

Method update: October 18, 2026.

The printed deck's audience rule can change a player's incentives in the middle of a round. The bot simulation in `engine/` and `sim/balance.mjs` cannot measure that: it models the deckbuilder reframe (suit declarations and the Complicity Track), not the printed 36-card deck, and it has no audience vote. Keep bot balance findings separate from evidence about what happens around a physical table.

The next proposed playtest uses two short sessions with the same deck and player count. In one, use the audience rule exactly as printed. In the other, omit it as an explicitly labeled experiment. Here the audience rule means the vote after each Proposal (step 3 of the round in `rules/v0.md`). Some printed effects also resolve on a table vote or reaction (P-01, P-03, P-13, P-15 and M-03 among them), and `rules/v0.md` breaks promotion ties with an audience pick, so decide and record how those resolve in the omitted session before play. Otherwise the two sessions differ in more than the audience rule. Record game length, promotion and PIP outcomes, how often an audience intervention changes the active player's intended move, and the time a non-active player waits before participating again.

Ask players to identify the decision that changed after an intervention. A funny moment and a useful strategic choice can coincide, but laughter alone does not establish balance. Preserve the existing cards, role-only names and printed rules until the playtest supplies a reason for a specific change. This refresh changes no flavor text, card effect or print layout.
