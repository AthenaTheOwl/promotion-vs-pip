# Acceptance — 0002-design

Run on a clean clone (node 20+):

```bash
git clone https://github.com/AthenaTheOwl/promotion-vs-pip
cd promotion-vs-pip
npm install                 # installs ajv + js-yaml

node scripts/validate_cards.js
# expect: exit 0, "valid: 36 cards (M:6 P:18 L:6 E:6)"

node --test scripts/
# expect: all pass

node scripts/render_cards.js --out print.html
# expect: exit 0; print.html exists; contains exactly 36 card divs

node scripts/tests/test_no_employer_names.js
# expect: exit 0
```

Manual check:

```bash
open print.html       # mac
start print.html      # windows
```

Print preview: 4 pages, 9 cards each (3×3 layout), 2.5"×3.5" per card.
