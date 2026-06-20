import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readFileSync } from "node:fs";
import { loadAllCards } from "../lib/loader.js";
import { renderAll } from "../render_cards.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

test("renderAll emits one card div per card", () => {
  const cards = loadAllCards(repoRoot);
  const template = readFileSync(join(repoRoot, "templates", "card.html"), "utf8");
  const css = readFileSync(join(repoRoot, "styles", "cards.css"), "utf8");
  const html = renderAll(cards, template, css);
  const matches = html.match(/<div class="card card-/g) || [];
  assert.equal(matches.length, cards.length, `expected ${cards.length} cards, got ${matches.length}`);
});

test("render output is wrapped in pages of 9", () => {
  const cards = loadAllCards(repoRoot);
  const template = readFileSync(join(repoRoot, "templates", "card.html"), "utf8");
  const css = readFileSync(join(repoRoot, "styles", "cards.css"), "utf8");
  const html = renderAll(cards, template, css);
  const pages = html.match(/<section class="page">/g) || [];
  assert.equal(pages.length, Math.ceil(cards.length / 9));
});

test("CSS specifies 2.5in by 3.5in card dimensions", () => {
  const css = readFileSync(join(repoRoot, "styles", "cards.css"), "utf8");
  assert.match(css, /width:\s*2\.5in/);
  assert.match(css, /height:\s*3\.5in/);
});

test("render escapes HTML in card text", () => {
  const template = readFileSync(join(repoRoot, "templates", "card.html"), "utf8");
  const css = "";
  const card = {
    id: "M-99",
    title: "Title <with> &amp special",
    type: "meeting",
    effect: "<script>alert(1)</script>",
    alienation: "say <hi>",
    flavor: "",
  };
  const html = renderAll([card], template, css);
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});
