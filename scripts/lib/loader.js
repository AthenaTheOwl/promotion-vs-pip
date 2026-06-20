// Load + validate the 4 card YAML files.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020.js";

const CARD_FILES = [
  ["meeting", "meetings.yaml"],
  ["proposal", "proposals.yaml"],
  ["policy", "policies.yaml"],
  ["exposure", "exposures.yaml"],
];

export class CardError extends Error {}

export function loadAllCards(repoRoot) {
  const ajv = new Ajv({ allErrors: true });
  const schema = JSON.parse(
    readFileSync(join(repoRoot, "schema", "cards.schema.json"), "utf8")
  );
  const validate = ajv.compile(schema);
  const all = [];
  const seenIds = new Set();
  for (const [expectedType, filename] of CARD_FILES) {
    const path = join(repoRoot, "cards", filename);
    let raw;
    try {
      raw = yaml.load(readFileSync(path, "utf8"));
    } catch (err) {
      throw new CardError(`${filename}: yaml parse: ${err.message}`);
    }
    if (!Array.isArray(raw)) {
      throw new CardError(`${filename}: top level must be a list`);
    }
    for (const card of raw) {
      if (!validate(card)) {
        const errors = (validate.errors || [])
          .map((e) => `${e.instancePath || "/"}: ${e.message}`)
          .join("; ");
        throw new CardError(
          `${filename}: card ${card.id || "<no id>"}: ${errors}`
        );
      }
      if (card.type !== expectedType) {
        throw new CardError(
          `${filename}: card ${card.id} has type ${card.type}, expected ${expectedType}`
        );
      }
      if (seenIds.has(card.id)) {
        throw new CardError(`${filename}: duplicate id ${card.id}`);
      }
      seenIds.add(card.id);
      all.push(card);
    }
  }
  return all;
}

export function summarize(cards) {
  const buckets = { meeting: 0, proposal: 0, policy: 0, exposure: 0 };
  for (const c of cards) buckets[c.type] += 1;
  return buckets;
}
