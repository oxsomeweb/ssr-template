#!/usr/bin/env node
/**
 * Deterministic structure validator for the AI Handoff Pack.
 * Reads site-map.json and verifies every contract an external agent must respect.
 * Exits non-zero with a specific reason on the first failure.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");

const errors = [];
const fail = (msg) => errors.push(msg);

function readFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

// 0. Load site-map.json
const mapPath = path.join(ROOT, "site-map.json");
if (!fs.existsSync(mapPath)) {
  console.error("FAIL: site-map.json not found at repo root");
  process.exit(1);
}
let map;
try {
  map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
} catch (e) {
  console.error("FAIL: site-map.json is not valid JSON:", e.message);
  process.exit(1);
}

// 1. All paths in site-map.json exist on disk
const collectPaths = [];
for (const [key, df] of Object.entries(map.data_files || {})) {
  collectPaths.push({ where: `data_files.${key}.path`, p: df.path });
  if (df.hub_path) collectPaths.push({ where: `data_files.${key}.hub_path`, p: df.hub_path });
}
for (const [key, sp] of Object.entries(map.static_pages || {})) {
  collectPaths.push({ where: `static_pages.${key}.path`, p: sp.path });
}
for (const filePath of Object.keys(map.editable_regions || {})) {
  collectPaths.push({ where: `editable_regions["${filePath}"]`, p: filePath });
}
if (map.prerender_registration?.file) {
  collectPaths.push({ where: "prerender_registration.file", p: map.prerender_registration.file });
}
if (map.new_page_config?.router_anchor_file) {
  collectPaths.push({ where: "new_page_config.router_anchor_file", p: map.new_page_config.router_anchor_file });
}
if (map.new_page_config?.template_path) {
  collectPaths.push({ where: "new_page_config.template_path", p: map.new_page_config.template_path });
}
for (const { where, p } of collectPaths) {
  if (!fs.existsSync(path.join(ROOT, p))) {
    fail(`Path missing on disk — ${where} → ${p}`);
  }
}

// 2. Data anchors present in their files
for (const [key, df] of Object.entries(map.data_files || {})) {
  const src = readFile(df.path);
  if (src == null) continue;
  if (!src.includes(df.anchor)) {
    fail(`Anchor "${df.anchor}" missing in data file ${df.path} (data_files.${key})`);
  }
}

// 3. AI_ROUTE_ANCHOR present in router file
const routerFile = map.new_page_config?.router_anchor_file;
const routerAnchor = map.new_page_config?.router_anchor;
if (routerFile && routerAnchor) {
  const src = readFile(routerFile);
  if (src && !src.includes(routerAnchor)) {
    fail(`Router anchor "${routerAnchor}" missing in ${routerFile}`);
  }
}

// 4 & 5. No duplicate slugs + required fields present in every entry
for (const [key, df] of Object.entries(map.data_files || {})) {
  const src = readFile(df.path);
  if (src == null) continue;
  const slugMatches = [...src.matchAll(/slug:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  const seen = new Set();
  for (const s of slugMatches) {
    if (seen.has(s)) fail(`Duplicate slug "${s}" in ${df.path}`);
    seen.add(s);
  }
  const required = df.required_fields || [];
  const segments = src.split(/\bslug:\s*["'`]/).slice(1);
  segments.forEach((seg, i) => {
    const slugName = (seg.match(/^([^"'`]+)/) || [])[1] || `#${i}`;
    const entryText = seg;
    for (const field of required) {
      if (field === "slug") continue;
      const re = new RegExp(`\\b${field}:`);
      if (!re.test(entryText.slice(0, 20000))) {
        fail(`Entry "${slugName}" in ${df.path} is missing required field "${field}"`);
      }
    }
  });
}

// 6 & 7. Editable regions: matching pairs and non-empty content
for (const [filePath, regions] of Object.entries(map.editable_regions || {})) {
  const src = readFile(filePath);
  if (src == null) continue;
  for (const r of regions) {
    const startTag = r.anchor_start;
    const endTag = r.anchor_end;
    const startIdx = src.indexOf(startTag);
    const endIdx = src.indexOf(endTag);
    if (startIdx === -1) {
      fail(`Editable region start tag "${startTag}" missing in ${filePath}`);
      continue;
    }
    if (endIdx === -1) {
      fail(`Editable region end tag "${endTag}" missing in ${filePath}`);
      continue;
    }
    if (endIdx <= startIdx) {
      fail(`Editable region end tag "${endTag}" appears before its start "${startTag}" in ${filePath}`);
      continue;
    }
    const startCommentEnd = src.indexOf("*/", startIdx);
    const endCommentStart = src.lastIndexOf("/*", endIdx);
    if (startCommentEnd === -1 || endCommentStart === -1 || endCommentStart <= startCommentEnd) {
      fail(`Could not parse comment boundaries for "${startTag}" in ${filePath}`);
      continue;
    }
    const inner = src.slice(startCommentEnd + 2, endCommentStart).replace(/\s/g, "");
    if (inner.length === 0) {
      fail(`Editable region "${startTag}" in ${filePath} is empty`);
    }
  }
}

// 9. Every dynamic & static route in routes must match a Route definition in router file
if (routerFile) {
  const src = readFile(routerFile) || "";
  const routePathRegex = /<Route\s+path=["']([^"']+)["']/g;
  const declared = new Set([...src.matchAll(routePathRegex)].map((m) => m[1]));
  for (const dyn of map.routes?.dynamic || []) {
    // /mobile-detailing-:slug is documented as expanded per-city — skip the abstract pattern itself
    if (dyn.path === "/mobile-detailing-:slug") continue;
    if (!declared.has(dyn.path)) {
      fail(`Dynamic route "${dyn.path}" (${dyn.component}) not found as a <Route path="..."> in ${routerFile}`);
    }
  }
  for (const stat of map.routes?.static || []) {
    if (!declared.has(stat.path)) {
      fail(`Static route "${stat.path}" (${stat.component}) not found as a <Route path="..."> in ${routerFile}`);
    }
  }
}

// 10. Prerender plugin contract — direct_import must show real `import` statements
const pre = map.prerender_registration;
if (pre?.file) {
  const src = readFile(pre.file) || "";
  if (pre.method === "direct_import") {
    for (const [key, descriptor] of Object.entries(pre.imports || {})) {
      const m = descriptor.match(/^(\S+)\s+from\s+(\S+)/);
      if (!m) continue;
      const [, exportName, importPath] = m;
      const cleanPath = importPath.replace(/^\.?\/?/, "").replace(/[/.]/g, "[/.]");
      const re = new RegExp(`import\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}\\s*from\\s*["'\`][./]*${cleanPath}["'\`]`);
      if (!re.test(src)) {
        fail(`prerender_registration says "${key}" should be imported as "${exportName}" from "${importPath}" but no matching import was found in ${pre.file}`);
      }
    }
  } else if (pre.method === "duplicated_inline_array") {
    if (!/CITY_CONTENT\s*:\s*CityContent\[\]\s*=/.test(src)) {
      fail(`prerender_registration.method is "duplicated_inline_array" but ${pre.file} no longer defines CITY_CONTENT — contract drift`);
    }
  }
}

// 11. Hub anchor (only when hub_* fields are present on a data type)
for (const [key, df] of Object.entries(map.data_files || {})) {
  if (!df.hub_path || !df.hub_anchor) continue;
  const src = readFile(df.hub_path);
  if (src == null) continue;
  if (!src.includes(df.hub_anchor)) {
    fail(`Hub anchor "${df.hub_anchor}" missing in ${df.hub_path} (data_files.${key}.hub_anchor)`);
  }
}

// 8. tsc --noEmit — run last (slowest)
let tscFailed = false;
try {
  execSync(map.tsc_command || "npx tsc --noEmit", { cwd: ROOT, stdio: "pipe" });
} catch (e) {
  tscFailed = true;
  const out = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
  fail(`TypeScript check failed:\n${out.split("\n").slice(0, 60).join("\n")}`);
}

if (errors.length) {
  console.error(`\n✖ validate-structure.js — ${errors.length} error(s):\n`);
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
  process.exit(1);
}

console.log("✓ validate-structure.js — all checks passed" + (tscFailed ? "" : " (incl. tsc)"));
