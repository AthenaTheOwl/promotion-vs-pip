// CLI: build the static site for deploy (Vercel-friendly).
// Emits public/index.html (landing) + public/deck.html (printable 36-card deck).
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { loadAllCards, summarize, CardError } from "./lib/loader.js";
import { renderAll } from "./render_cards.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const outDir = join(repoRoot, "public");

function landingPage(counts) {
  const css = `
:root { color-scheme: light dark; }
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  margin: 0; line-height: 1.5; color: #1a1a1a; background: #fafafa;
}
main { max-width: 44rem; margin: 0 auto; padding: 3rem 1.25rem 5rem; }
h1 { font-size: 2rem; margin: 0 0 0.25rem; }
.tag { color: #666; margin: 0 0 2rem; }
p { margin: 0 0 1rem; }
.mix { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; padding: 0; margin: 1.5rem 0; }
.mix li { padding: 0.35rem 0.7rem; border: 1.5px solid; border-radius: 0.4rem; font-size: 0.85rem; }
.m-meeting  { border-color: #1f5fa6; color: #1f5fa6; }
.m-proposal { border-color: #2a7a3a; color: #2a7a3a; }
.m-policy   { border-color: #a85a00; color: #a85a00; }
.m-exposure { border-color: #a8002a; color: #a8002a; }
.cta { display: inline-block; margin: 0.5rem 0 2rem; padding: 0.7rem 1.2rem;
  background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
.cta:hover { background: #333; }
h2 { font-size: 1.15rem; margin: 2rem 0 0.5rem; }
ul.plain { padding-left: 1.2rem; }
footer { margin-top: 3rem; color: #888; font-size: 0.85rem; border-top: 1px solid #ddd; padding-top: 1rem; }
a { color: #1f5fa6; }
`.trim();

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>promotion vs pip — print-and-play card deck</title>",
    '<meta name="description" content="A Brechtian corporate-satire deckbuilder. 36-card print-and-play prototype.">',
    `<style>${css}</style>`,
    "</head>",
    "<body>",
    "<main>",
    "<h1>promotion vs pip</h1>",
    '<p class="tag">a brechtian corporate-satire deckbuilder — 36-card print-and-play prototype</p>',
    "<p>you climb the promotion track while accruing pip red flags. every promotion-track win quietly increases your pip exposure, and the audience (other players, or a live audience at the table) can vote rule changes that flip incentives mid-round.</p>",
    "<p>the artifact is a printable card deck plus a one-page rules sheet. no app, no engine, no companion software. the whole thing fits in a paper sleeve.</p>",
    "<ul class=\"mix\">",
    `<li class="m-meeting">${counts.meeting} meeting</li>`,
    `<li class="m-proposal">${counts.proposal} proposal</li>`,
    `<li class="m-policy">${counts.policy} policy</li>`,
    `<li class="m-exposure">${counts.exposure} exposure</li>`,
    "</ul>",
    '<a class="cta" href="./deck.html">view the printable deck &rarr;</a>',
    "<h2>how to play</h2>",
    "<ul class=\"plain\">",
    "<li>print the deck on cardstock, 9 cards per page, cut along the 2.5in x 3.5in borders.</li>",
    "<li>meeting cards frame each round. proposal cards are the main action. policy cards apply persistent rule tweaks. exposure cards are callouts.</li>",
    "<li>climbing the promotion track raises your pip exposure — the two loops are coupled by design.</li>",
    "<li>the table audience can vote a rule change mid-round, flipping who is winning.</li>",
    "</ul>",
    '<footer>print-and-play prototype, v0.1. <a href="https://github.com/AthenaTheOwl/promotion-vs-pip">source on github</a>. mit licensed.</footer>',
    "</main>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function main() {
  try {
    const cards = loadAllCards(repoRoot);
    const template = readFileSync(join(repoRoot, "templates", "card.html"), "utf8");
    const css = readFileSync(join(repoRoot, "styles", "cards.css"), "utf8");

    mkdirSync(outDir, { recursive: true });

    const deckHtml = renderAll(cards, template, css);
    writeFileSync(join(outDir, "deck.html"), deckHtml, "utf8");

    const counts = summarize(cards);
    writeFileSync(join(outDir, "index.html"), landingPage(counts), "utf8");

    console.log(
      `built site to ${outDir} (index.html + deck.html, ${cards.length} cards: ` +
        `M:${counts.meeting} P:${counts.proposal} L:${counts.policy} E:${counts.exposure})`
    );
  } catch (err) {
    if (err instanceof CardError) {
      console.error(`build failed: ${err.message}`);
      process.exit(2);
    }
    throw err;
  }
}

main();
