import fs from 'fs';
import { normalizeTools } from './src/lib/toolkit-core.js';

const tools = normalizeTools(JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8')));
const categories = [...new Set(tools.map((t) => t.category))];
const subCategories = [...new Set(tools.map((t) => t.subCategory).filter(Boolean))];
const pricingCounts = tools.reduce(
  (counts, tool) => {
    counts[tool.pricing] = (counts[tool.pricing] || 0) + 1;
    return counts;
  },
  { free: 0, freemium: 0, 'open-source': 0, paid: 0 },
);
const altPairs = tools.filter((t) => t.alternativeTo);
const agencyPicks = tools.filter((t) => t.agencyPick);

const errors = [];

function check(label, condition, detail) {
  if (!condition) errors.push(`${label}: ${detail}`);
}

function checkFileContains(file, pattern, label) {
  const content = fs.readFileSync(file, 'utf-8');
  if (!content.includes(pattern)) {
    errors.push(`${file} — ${label}: expected "${pattern}" not found`);
  }
}

function checkFileRegex(file, regex, label) {
  const content = fs.readFileSync(file, 'utf-8');
  if (!regex.test(content)) {
    errors.push(`${file} — ${label}: pattern ${regex} not matched`);
  }
}

// === README.md checks ===
const readme = fs.readFileSync('README.md', 'utf-8');
check('README tool count', readme.includes(`${tools.length} tools`) || readme.includes(`**${tools.length} tools`), `Expected ${tools.length} tools`);
check('README category count', readme.includes(`${categories.length} categories`), `Expected ${categories.length} categories`);
check('README subcategory count', readme.includes(`${subCategories.length} subcategories`), `Expected ${subCategories.length} subcategories`);
check('README agency picks', readme.includes(`${agencyPicks.length} agency picks`), `Expected ${agencyPicks.length} agency picks`);
check('README alternativeTo count', readme.includes(`${altPairs.length} curated`), `Expected ${altPairs.length} curated alternativeTo relationships`);
check('README license text', readme.includes('CC0 1.0 Universal'), 'Should reference CC0 1.0 Universal license');
check('README pricing free', readme.includes(`${pricingCounts.free} free`), `Expected ${pricingCounts.free} free`);
check('README pricing OS', readme.includes(`${pricingCounts['open-source']} open-source`), `Expected ${pricingCounts['open-source']} open-source`);
check('README pricing freemium', readme.includes(`${pricingCounts.freemium} freemium`), `Expected ${pricingCounts.freemium} freemium`);
check('README pricing paid', readme.includes(`${pricingCounts.paid} paid`), `Expected ${pricingCounts.paid} paid`);
check('README export formats', ['PDF', 'Markdown', 'TXT', 'Preview'].every((f) => readme.includes(f)), 'Should mention all 4 export formats');

// === GUIDE.md checks ===
const guide = fs.readFileSync('GUIDE.md', 'utf-8');
check('GUIDE tool count', guide.includes(`${tools.length}-tool`) || guide.includes(`${tools.length} tool`), `Expected ${tools.length} tools`);
check('GUIDE export formats', ['PDF', 'Markdown', 'TXT', 'Preview'].every((f) => guide.includes(f)), 'Should mention all 4 export formats');

// === LICENSE check ===
const license = fs.readFileSync('LICENSE', 'utf-8');
check('LICENSE is CC0', license.includes('CC0 1.0 Universal'), 'LICENSE should be CC0 1.0 Universal');

// === DIRECTORY.md checks ===
if (fs.existsSync('DIRECTORY.md')) {
  const dir = fs.readFileSync('DIRECTORY.md', 'utf-8');
  for (const cat of categories) {
    check(`DIRECTORY category "${cat}"`, dir.includes(`## ${cat}`), `Category heading missing`);
  }
}

// === CONTRIBUTING.md checks ===
if (fs.existsSync('CONTRIBUTING.md')) {
  const contrib = fs.readFileSync('CONTRIBUTING.md', 'utf-8');
  check('CONTRIBUTING has tool template', contrib.includes('"name"'), 'Should include tool JSON template');
  check('CONTRIBUTING has pricing values', contrib.includes('free') && contrib.includes('freemium') && contrib.includes('open-source') && contrib.includes('paid'), 'Should list pricing values');
}

// === Report ===
if (errors.length > 0) {
  console.error(`\n❌ Documentation integrity check failed (${errors.length} issue${errors.length > 1 ? 's' : ''}):\n`);
  errors.forEach((err) => console.error(`  • ${err}`));
  console.error('');
  process.exit(1);
} else {
  console.log(`✅ Documentation integrity check passed — ${tools.length} tools, ${categories.length} categories, ${subCategories.length} subcategories, all docs consistent.`);
}
