// CLI: render the 36 cards to one print-friendly HTML page.
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { loadAllCards, summarize, CardError } from "./lib/loader.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCard(template, card) {
  const fields = ["id", "title", "type", "effect", "alienation", "flavor"];
  let html = template;
  for (const f of fields) {
    html = html.replaceAll("{" + f + "}", escapeHtml(card[f] ?? ""));
  }
  return html;
}

export function renderAll(cards, template, css) {
  const cardsPerPage = 9;
  const pages = [];
  for (let i = 0; i < cards.length; i += cardsPerPage) {
    const chunk = cards.slice(i, i + cardsPerPage);
    const inner = chunk.map((c) => renderCard(template, c)).join("\n");
    pages.push(`<section class="page">\n${inner}\n</section>`);
  }
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    `<title>promotion-vs-pip — ${cards.length} cards</title>`,
    "<style>",
    css,
    "</style>",
    "</head>",
    "<body>",
    pages.join("\n"),
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function main() {
  const { values } = parseArgs({
    options: {
      out: { type: "string", default: "print.html" },
    },
  });
  try {
    const cards = loadAllCards(repoRoot);
    const template = readFileSync(
      join(repoRoot, "templates", "card.html"),
      "utf8"
    );
    const css = readFileSync(join(repoRoot, "styles", "cards.css"), "utf8");
    const html = renderAll(cards, template, css);
    const outPath = resolve(repoRoot, values.out);
    writeFileSync(outPath, html, "utf8");
    const b = summarize(cards);
    console.log(
      `wrote ${cards.length} cards (M:${b.meeting} P:${b.proposal} L:${b.policy} E:${b.exposure}) to ${outPath}`
    );
  } catch (err) {
    if (err instanceof CardError) {
      console.error(`render failed: ${err.message}`);
      process.exit(2);
    }
    throw err;
  }
}

// Only run main() if invoked as a script (not when imported by tests).
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}` || process.argv[1].endsWith("render_cards.js")) {
  main();
}
