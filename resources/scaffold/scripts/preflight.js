#!/usr/bin/env node
/* eslint-disable */
// Pre-render preflight. Catches authoring slop before a 2-minute render.
// Run before `npm run render` (or chained via npm script).
//
// Checks:
//   1. No <DebugCrosshair> imports left in src/scenes/
//   2. Every beat id in BEATS has a matching entry in BEAT_COMPONENTS
//   3. Every public/<dir>/<file>.png referenced via staticFile() exists

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const errors = [];
const warnings = [];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const sourceFiles = walk(join(root, "src"));

// ---- Check 1: DebugCrosshair leftovers ----
for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  if (/<DebugCrosshair[\s>]/.test(text)) {
    errors.push(
      `${relative(root, file)}: <DebugCrosshair> still present. ` +
        `Remove before render.`
    );
  }
  // Allow imports that aren't used (the component is part of the scaffold) —
  // only flag actual JSX usage.
}

// ---- Check 2: BEATS ↔ BEAT_COMPONENTS coverage ----
const beatsConfigPath = join(root, "src/scenes/beats-config.ts");
try {
  const beatsConfig = readFileSync(beatsConfigPath, "utf8");
  // Extract id strings from BEATS array — naive regex but good enough for a
  // preflight. Matches: id: "name" or id: 'name'
  const idMatches = [...beatsConfig.matchAll(/\bid:\s*["']([^"']+)["']/g)];
  const beatIds = idMatches.map((m) => m[1]);
  // Extract registered ids from BEAT_COMPONENTS — match keys in the record.
  const compMatch = beatsConfig.match(
    /BEAT_COMPONENTS[^=]*=\s*{([\s\S]*?)}/
  );
  const registeredIds = compMatch
    ? [...compMatch[1].matchAll(/["']([^"']+)["']\s*:/g)].map((m) => m[1])
    : [];
  for (const id of beatIds) {
    if (!registeredIds.includes(id)) {
      errors.push(
        `BEATS contains id "${id}" but it's not registered in ` +
          `BEAT_COMPONENTS. Add a component mapping.`
      );
    }
  }
  for (const id of registeredIds) {
    if (!beatIds.includes(id)) {
      warnings.push(
        `BEAT_COMPONENTS has unused entry "${id}". ` +
          `Either remove it or add to BEATS.`
      );
    }
  }
} catch (e) {
  warnings.push(
    `Could not parse beats-config.ts (${e.message}). Skipping beat check.`
  );
}

// ---- Check 3: staticFile() references exist ----
const publicDir = join(root, "public");
for (const file of sourceFiles) {
  const text = readFileSync(file, "utf8");
  const refs = [...text.matchAll(/staticFile\(\s*["']([^"']+)["']\s*\)/g)];
  for (const r of refs) {
    const path = r[1];
    try {
      statSync(join(publicDir, path));
    } catch {
      errors.push(
        `${relative(root, file)}: staticFile("${path}") references a ` +
          `missing file in public/`
      );
    }
  }
}

// ---- Report ----
if (warnings.length) {
  for (const w of warnings) console.warn(`WARN  ${w}`);
}
if (errors.length) {
  for (const e of errors) console.error(`FAIL  ${e}`);
  console.error(`\nPreflight failed (${errors.length} issue(s)).`);
  process.exit(1);
}
console.log(
  `Preflight ok (${warnings.length} warning(s), ${sourceFiles.length} files checked).`
);
