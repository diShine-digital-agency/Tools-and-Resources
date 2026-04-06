import assert from 'node:assert/strict';
import fs from 'fs';
import {
  BRAND_CONFIG,
  buildMarkdownReport,
  buildReportModel,
  buildTextReport,
  findBestAlternative,
  normalizeTools,
} from './src/lib/toolkit-core.js';

const tools = normalizeTools(JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8')));
console.log('Total Tools:', tools.length);

function utilityAligned(left = '', right = '') {
  const leftTokens = String(left).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4);
  const rightTokens = new Set(String(right).toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4));
  return left.toLowerCase() === right.toLowerCase() || leftTokens.some((token) => rightTokens.has(token));
}

const scenarios = [
  ['Adobe Premiere Pro', 'free'],
  ['HubSpot CRM', 'free'],
  ['Jira', 'free'],
  ['Superhuman', 'free'],
  ['Figma', 'paid'],
];

for (const [toolName, mode] of scenarios) {
  const original = tools.find((tool) => tool.name === toolName);
  const match = findBestAlternative(tools, toolName, mode);
  assert.ok(original, `${toolName} should exist in the dataset`);
  assert.ok(match, `${toolName} should return a ${mode} alternative`);
  assert.equal(match.category, original.category, `${toolName} should stay in the same category`);
  assert.ok(utilityAligned(original.subCategory, match.subCategory), `${toolName} should keep an aligned utility subcategory`);
  console.log(`Scenario ${toolName} -> ${mode}:`, match.name);
}

const metrics = {
  total: 0,
  sameCategory: 0,
  sameSubCategory: 0,
  missing: 0,
};

for (const tool of tools) {
  for (const mode of ['free', 'paid']) {
    const match = findBestAlternative(tools, tool, mode);
    metrics.total += 1;
    if (!match) {
      metrics.missing += 1;
      continue;
    }
    assert.equal(match.category, tool.category, `${tool.name} should never match outside its category`);
    metrics.sameCategory += 1;
    if (tool.subCategory && match.subCategory === tool.subCategory) {
      metrics.sameSubCategory += 1;
    }
  }
}

const sameSubCategoryRate = metrics.sameSubCategory / metrics.total;
console.log('Match metrics:', metrics, `same-sub rate=${(sameSubCategoryRate * 100).toFixed(1)}%`);
assert.ok(sameSubCategoryRate >= 0.78, 'Same-subcategory match rate should stay above 78%');

const sampleStack = tools.filter((tool) => ['Ahrefs', 'Figma', 'Slack'].includes(tool.name));
const report = buildReportModel({
  stack: sampleStack,
  allTools: tools,
  notes: 'Prepared for a diShine client audit.',
  brand: BRAND_CONFIG,
  generatedAt: '2026-04-06T17:30:12.166Z',
});
const markdown = buildMarkdownReport(report);
const text = buildTextReport(report);

assert.match(markdown, /## Chosen Stack/);
assert.match(markdown, /## Free Alternatives/);
assert.match(markdown, /## Paid Alternatives/);
assert.match(text, /CHOSEN STACK/);
assert.match(text, /FREE ALTERNATIVES/);
assert.match(text, /PAID ALTERNATIVES/);

console.log('Export checks passed.');

// alternativeTo bidirectional validation
const altTools = tools.filter((tool) => tool.alternativeTo);
const orphaned = [];
for (const tool of altTools) {
  const targets = tool.alternativeTo.split('/').map((s) => s.trim());
  for (const targetName of targets) {
    const target = tools.find((t) => t.name === targetName);
    if (!target) continue; // target not in dataset — skip external references
    if (!target.alternativeTo || !target.alternativeTo.includes(tool.name)) {
      orphaned.push(`${tool.name} → ${targetName} (reverse: ${target.alternativeTo || '(empty)'})`);
    }
  }
}
if (orphaned.length > 0) {
  console.log(`⚠ ${orphaned.length} one-directional alternativeTo pair(s) found (non-blocking):`);
  orphaned.forEach((pair) => console.log(`  • ${pair}`));
}
console.log(`alternativeTo validation: ${altTools.length} tools checked, ${orphaned.length} orphaned.`);

console.log('All regression checks passed.');
