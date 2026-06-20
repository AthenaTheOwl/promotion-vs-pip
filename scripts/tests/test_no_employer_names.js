// Interface test: prevent satire-against-a-specific-employer drift.
// Regression: this is the security-lens finding made executable.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { readFileSync, readdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");

const BANNED = [
  "Amazon",
  "AWS",
  "Azure",
  "Google",
  "Microsoft",
  "Apple",
  "Meta",
  "Facebook",
  "OpenAI",
  "Anthropic",
];

test("no card YAML references a specific real employer", () => {
  const cardsDir = join(repoRoot, "cards");
  const files = readdirSync(cardsDir).filter((f) => f.endsWith(".yaml"));
  const offenders = [];
  for (const f of files) {
    const text = readFileSync(join(cardsDir, f), "utf8");
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      for (const word of BANNED) {
        const pat = new RegExp(`\\b${word}\\b`, "i");
        if (pat.test(lines[i])) {
          offenders.push(`${f}:${i + 1}: ${word} -> ${lines[i].trim()}`);
        }
      }
    }
  }
  assert.equal(offenders.length, 0, "banned tokens found:\n" + offenders.join("\n"));
});
