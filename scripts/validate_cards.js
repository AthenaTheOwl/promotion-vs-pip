// CLI: validate the 4 card YAML files. Exits 0 on success, 2 on failure.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { loadAllCards, summarize, CardError } from "./lib/loader.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

try {
  const cards = loadAllCards(repoRoot);
  const b = summarize(cards);
  console.log(
    `valid: ${cards.length} cards (M:${b.meeting} P:${b.proposal} L:${b.policy} E:${b.exposure})`
  );
} catch (err) {
  if (err instanceof CardError) {
    console.error(`INVALID: ${err.message}`);
    process.exit(2);
  }
  throw err;
}
