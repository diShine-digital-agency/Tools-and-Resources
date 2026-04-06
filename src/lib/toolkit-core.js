export const BRAND_CONFIG = {
  agency: 'diShine Digital Agency',
  product: 'diShine Toolkit',
  reportTitle: 'Client Tool Stack Report',
  reportSubtitle: 'A branded stack recommendation with curated free and paid alternatives.',
  website: 'https://dishine.it',
  accentHex: '#2563eb',
  exportBaseName: 'diShine-tool-stack',
};

export const PRICING_META = {
  free: {
    label: 'Free',
    icon: '🍏',
    badgeClass: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
  },
  freemium: {
    label: 'Freemium',
    icon: '⚖️',
    badgeClass: 'bg-amber-900/30 text-amber-400 border-amber-800/50',
  },
  'open-source': {
    label: 'Open Source',
    icon: '🌐',
    badgeClass: 'bg-teal-900/30 text-teal-400 border-teal-800/50',
  },
  paid: {
    label: 'Paid',
    icon: '💎',
    badgeClass: 'bg-rose-900/30 text-rose-400 border-rose-800/50',
  },
};

const STOP_WORDS = new Set([
  'with', 'that', 'this', 'from', 'into', 'your', 'their', 'than', 'then', 'tool', 'tools',
  'platform', 'suite', 'based', 'using', 'only', 'more', 'very', 'data', 'work', 'team', 'teams',
  'marketing', 'digital', 'client', 'clients', 'agency', 'agencies', 'software', 'service',
]);

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function normalizePricing(tool = {}) {
  if (tool.pricing) return tool.pricing;
  if (tool.isOpenSource || String(tool.type || '').includes('[OS]')) return 'open-source';
  if (tool.isFree && String(tool.type || '').includes('[$]')) return 'freemium';
  if (tool.isFree) return 'free';
  return 'paid';
}

export function normalizeTool(tool = {}) {
  const pricing = normalizePricing(tool);
  const desc = tool.desc || tool.description || '';
  const category = tool.category || tool.cat || 'General';
  const subCategory = tool.subCategory || tool.sub || '';
  const alternativeTo = tool.alternativeTo || tool.alt || '';
  const id = tool.id || `${tool.name || ''}::${category}::${subCategory}`;
  return {
    ...tool,
    id,
    name: tool.name || '',
    url: tool.url || '',
    desc,
    description: desc,
    pricing,
    category,
    cat: category,
    subCategory,
    sub: subCategory,
    alternativeTo,
    alt: alternativeTo,
    tags: Array.isArray(tool.tags) ? [...tool.tags] : [],
    isFree: typeof tool.isFree === 'boolean' ? tool.isFree : ['free', 'freemium', 'open-source'].includes(pricing),
    isOpenSource: typeof tool.isOpenSource === 'boolean' ? tool.isOpenSource : pricing === 'open-source',
    learningCurve: tool.learningCurve || 'Medium',
    agencyPick: Boolean(tool.agencyPick),
  };
}

export function normalizeTools(tools = []) {
  return tools.map(normalizeTool);
}

export function getPricingMeta(pricing) {
  return PRICING_META[pricing] || PRICING_META.free;
}

export function isFreeModePricing(pricing) {
  return pricing === 'free' || pricing === 'open-source';
}

export function isPaidModePricing(pricing) {
  return pricing === 'paid';
}

function tokenize(value = '', minLength = 3) {
  return Array.from(new Set(
    String(value)
      .toLowerCase()
      .split(/[^a-z0-9+#]+/)
      .filter((token) => token.length >= minLength && !STOP_WORDS.has(token))
  ));
}

function overlapCount(source = [], target = []) {
  const targetSet = new Set(target);
  return source.filter((item) => targetSet.has(item)).length;
}

function sameAlternativePair(left, right) {
  return left && right && left.name !== right.name && (left.alt === right.name || right.alt === left.name);
}

function getModeMatcher(mode) {
  return mode === 'paid' ? isPaidModePricing : isFreeModePricing;
}

function resolveToolReference(allTools = [], reference) {
  const tools = normalizeTools(allTools);
  if (!reference) return null;
  if (typeof reference === 'string') {
    return tools.find((tool) => tool.id === reference) || tools.find((tool) => tool.name === reference) || null;
  }
  if (typeof reference === 'object') {
    if (reference.id) return tools.find((tool) => tool.id === reference.id) || null;
    if (reference.name && reference.cat) {
      return tools.find((tool) => tool.name === reference.name && tool.cat === reference.cat && tool.sub === (reference.sub || reference.subCategory || '')) || null;
    }
    if (reference.name) return tools.find((tool) => tool.name === reference.name) || null;
  }
  return null;
}

function getSimilaritySignals(original, candidate) {
  const originalSubTokens = tokenize(original.sub, 4);
  const candidateSubTokens = tokenize(candidate.sub, 4);
  const originalTagTokens = tokenize((original.tags || []).join(' '), 2);
  const candidateTagTokens = tokenize((candidate.tags || []).join(' '), 2);
  const originalDescTokens = tokenize(original.desc, 4);
  const candidateDescTokens = tokenize(candidate.desc, 4);

  const sharedSubTokens = overlapCount(originalSubTokens, candidateSubTokens);
  const sharedTagTokens = overlapCount(originalTagTokens, candidateTagTokens);
  const sharedDescTokens = overlapCount(originalDescTokens, candidateDescTokens);

  return {
    exactSubCategoryMatch: Boolean(original.sub && candidate.sub && original.sub.toLowerCase() === candidate.sub.toLowerCase()),
    sharedSubTokens,
    sharedTagTokens,
    sharedDescTokens,
  };
}

function scoreCandidate(original, candidate, exactSubPoolExists) {
  const signals = getSimilaritySignals(original, candidate);
  let score = 0;

  if (signals.exactSubCategoryMatch) {
    score += 120;
  } else if (original.sub && candidate.sub) {
    score += signals.sharedSubTokens * 24;
    score -= exactSubPoolExists ? 25 : 10;
  } else if (!original.sub || !candidate.sub) {
    score += 18;
  }

  score += 22; // same-category baseline (candidate pool is already same category only)
  score += signals.sharedTagTokens * 12;
  score += Math.min(signals.sharedDescTokens, 5) * 6;

  if (candidate.agencyPick) score += 3;
  if (candidate.pricing === 'open-source' && !original.isOpenSource) score += 2;

  return { score, signals };
}

export function findBestAlternative(allTools = [], originalReference, mode = 'free') {
  const tools = normalizeTools(allTools);
  const original = resolveToolReference(tools, originalReference);
  if (!original) return null;

  const pricingMatch = getModeMatcher(mode);
  const explicit = tools.find((tool) => pricingMatch(tool.pricing) && sameAlternativePair(tool, original));
  if (explicit) return explicit;

  const candidates = tools.filter((tool) => pricingMatch(tool.pricing) && tool.id !== original.id && tool.cat === original.cat);
  if (candidates.length === 0) return null;

  const sameSubCandidates = original.sub
    ? candidates.filter((tool) => tool.sub && tool.sub.toLowerCase() === original.sub.toLowerCase())
    : [];
  const workingPool = sameSubCandidates.length > 0 ? sameSubCandidates : candidates;
  const exactSubPoolExists = sameSubCandidates.length > 0;

  let bestCandidate = null;
  let bestScore = -Infinity;
  let bestSignals = null;

  for (const candidate of workingPool) {
    const result = scoreCandidate(original, candidate, exactSubPoolExists);
    if (
      result.score > bestScore ||
      (result.score === bestScore && candidate.agencyPick && !bestCandidate?.agencyPick) ||
      (result.score === bestScore && candidate.tags.length > (bestCandidate?.tags.length || 0))
    ) {
      bestCandidate = candidate;
      bestScore = result.score;
      bestSignals = result.signals;
    }
  }

  const threshold = exactSubPoolExists ? 80 : original.sub ? 40 : 28;
  if (!bestCandidate || bestScore < threshold) return null;

  if (!exactSubPoolExists && original.sub) {
    const hasUtilitySignal = (bestSignals?.sharedSubTokens || 0) > 0 || (bestSignals?.sharedTagTokens || 0) > 0 || (bestSignals?.sharedDescTokens || 0) > 0;
    if (!hasUtilitySignal) return null;
  }

  return bestCandidate;
}

export function computeAlternativeRows(stack = [], allTools = [], mode = 'free') {
  const baseStack = normalizeTools(stack);
  return baseStack.map((original) => {
    const alreadyCovered = mode === 'free'
      ? isFreeModePricing(original.pricing)
      : isPaidModePricing(original.pricing);

    if (alreadyCovered) {
      return {
        original,
        alternative: null,
        status: 'already-covered',
      };
    }

    const alternative = findBestAlternative(allTools, original.name, mode);
    return {
      original,
      alternative,
      status: alternative ? 'matched' : 'missing',
    };
  });
}

export function summarizeStack(stack = []) {
  const counts = { free: 0, freemium: 0, 'open-source': 0, paid: 0 };
  normalizeTools(stack).forEach((tool) => {
    counts[tool.pricing] = (counts[tool.pricing] || 0) + 1;
  });
  return {
    total: stack.length,
    counts,
    line: `${stack.length} tools · ${counts.free} free · ${counts['open-source']} open source · ${counts.freemium} freemium · ${counts.paid} paid`,
  };
}

export function groupToolsByCategory(stack = []) {
  return normalizeTools(stack).reduce((grouped, tool) => {
    if (!grouped[tool.cat]) grouped[tool.cat] = [];
    grouped[tool.cat].push(tool);
    return grouped;
  }, {});
}

function buildAlternativeReason(row) {
  if (row.status === 'already-covered') {
    return row.original.pricing === 'paid' ? 'Already premium in the chosen stack.' : 'Already free in the chosen stack.';
  }
  if (row.status === 'missing') {
    return 'No strong alternative exists in the current dataset.';
  }
  if (!row.alternative) return '';

  const signals = getSimilaritySignals(row.original, row.alternative);
  const reasons = [];
  if (signals.exactSubCategoryMatch) reasons.push('same utility cluster');
  else if (signals.sharedSubTokens > 0) reasons.push('similar use-case keywords');
  if (signals.sharedTagTokens > 0) reasons.push(`${signals.sharedTagTokens} shared tag${signals.sharedTagTokens > 1 ? 's' : ''}`);
  if (row.alternative.agencyPick) reasons.push('agency pick');
  return reasons.length > 0 ? reasons.join(', ') : 'best same-category fit available';
}

export function buildReportModel({ stack = [], allTools = [], notes = '', generatedAt = new Date().toISOString(), brand = BRAND_CONFIG } = {}) {
  const chosenStack = normalizeTools(stack);
  return {
    brand,
    generatedAt,
    notes: String(notes || '').trim(),
    chosenStack,
    chosenSummary: summarizeStack(chosenStack),
    freeRows: computeAlternativeRows(chosenStack, allTools, 'free').map((row) => ({ ...row, reason: buildAlternativeReason(row) })),
    paidRows: computeAlternativeRows(chosenStack, allTools, 'paid').map((row) => ({ ...row, reason: buildAlternativeReason(row) })),
  };
}

export function formatReportDate(value) {
  return new Date(value).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function buildMarkdownReport(model) {
  const lines = [
    `# ${model.brand.agency} — ${model.brand.reportTitle}`,
    '',
    `${model.brand.reportSubtitle}`,
    '',
    `- **Generated:** ${formatReportDate(model.generatedAt)}`,
    `- **Prepared by:** ${model.brand.agency}`,
    `- **Website:** ${model.brand.website}`,
    '',
    `> ${model.chosenSummary.line}`,
  ];

  if (model.notes) {
    lines.push('', '## Client Notes', '', `> ${model.notes}`);
  }

  lines.push('', '## Chosen Stack', '');

  const grouped = groupToolsByCategory(model.chosenStack);
  for (const [category, tools] of Object.entries(grouped)) {
    lines.push(`### ${category}`, '');
    for (const tool of tools) {
      const pricing = getPricingMeta(tool.pricing).label;
      const sub = tool.sub ? ` · ${tool.sub}` : '';
      lines.push(`- **[${tool.name}](${tool.url})** — ${pricing}${sub}`);
      lines.push(`  ${tool.desc}`);
    }
    lines.push('');
  }

  const altSections = [
    ['Free Alternatives', model.freeRows],
    ['Paid Alternatives', model.paidRows],
  ];

  for (const [title, rows] of altSections) {
    lines.push(`## ${title}`, '');
    for (const row of rows) {
      const originalPricing = getPricingMeta(row.original.pricing).label;
      lines.push(`### ${row.original.name}`, '');
      lines.push(`- **Original:** ${row.original.name} — ${originalPricing}${row.original.sub ? ` · ${row.original.sub}` : ''}`);
      if (row.alternative) {
        const altPricing = getPricingMeta(row.alternative.pricing).label;
        lines.push(`- **Recommended alternative:** [${row.alternative.name}](${row.alternative.url}) — ${altPricing}${row.alternative.sub ? ` · ${row.alternative.sub}` : ''}`);
        lines.push(`- **Why it fits:** ${row.reason}`);
        lines.push(`- **What it does:** ${row.alternative.desc}`);
      } else if (row.status === 'already-covered') {
        lines.push(`- **Recommended alternative:** Not needed.`);
        lines.push(`- **Why it fits:** ${row.reason}`);
      } else {
        lines.push(`- **Recommended alternative:** No high-confidence match found.`);
        lines.push(`- **Why it fits:** ${row.reason}`);
      }
      lines.push('');
    }
  }

  lines.push('---', '', `*Generated by ${model.brand.product} · ${model.brand.website}*`, '');
  return lines.join('\n');
}

export function buildTextReport(model) {
  const lines = [
    `${model.brand.agency} — ${model.brand.reportTitle}`,
    model.brand.reportSubtitle,
    '',
    `Generated: ${formatReportDate(model.generatedAt)}`,
    `Prepared by: ${model.brand.agency}`,
    `Website: ${model.brand.website}`,
    model.chosenSummary.line,
  ];

  if (model.notes) {
    lines.push('', 'CLIENT NOTES', model.notes);
  }

  lines.push('', 'CHOSEN STACK');
  const grouped = groupToolsByCategory(model.chosenStack);
  for (const [category, tools] of Object.entries(grouped)) {
    lines.push('', category.toUpperCase());
    for (const tool of tools) {
      const pricing = getPricingMeta(tool.pricing).label;
      lines.push(`- ${tool.name} (${pricing}${tool.sub ? ` | ${tool.sub}` : ''})`);
      lines.push(`  ${tool.desc}`);
      lines.push(`  ${tool.url}`);
    }
  }

  const altSections = [
    ['FREE ALTERNATIVES', model.freeRows],
    ['PAID ALTERNATIVES', model.paidRows],
  ];

  for (const [title, rows] of altSections) {
    lines.push('', title);
    for (const row of rows) {
      const originalPricing = getPricingMeta(row.original.pricing).label;
      lines.push('', `* ${row.original.name} (${originalPricing}${row.original.sub ? ` | ${row.original.sub}` : ''})`);
      if (row.alternative) {
        const altPricing = getPricingMeta(row.alternative.pricing).label;
        lines.push(`  Recommended: ${row.alternative.name} (${altPricing}${row.alternative.sub ? ` | ${row.alternative.sub}` : ''})`);
        lines.push(`  Why it fits: ${row.reason}`);
        lines.push(`  What it does: ${row.alternative.desc}`);
        lines.push(`  URL: ${row.alternative.url}`);
      } else if (row.status === 'already-covered') {
        lines.push(`  Recommended: not needed`);
        lines.push(`  Why it fits: ${row.reason}`);
      } else {
        lines.push(`  Recommended: no high-confidence match found`);
        lines.push(`  Why it fits: ${row.reason}`);
      }
    }
  }

  lines.push('', `Generated by ${model.brand.product} · ${model.brand.website}`, '');
  return lines.join('\n');
}

function renderHtmlToolList(tools = []) {
  return tools.map((tool) => {
    const pricing = getPricingMeta(tool.pricing);
    return `
      <article class="report-card">
        <div class="report-card__top">
          <div>
            <h4>${escapeHtml(tool.name)}</h4>
            <p class="report-card__meta">${escapeHtml(pricing.label)}${tool.sub ? ` · ${escapeHtml(tool.sub)}` : ''}</p>
          </div>
          <span class="report-pill">${escapeHtml(pricing.icon)} ${escapeHtml(pricing.label)}</span>
        </div>
        <p>${escapeHtml(tool.desc)}</p>
        <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener">${escapeHtml(tool.url)}</a>
      </article>
    `;
  }).join('');
}

function renderHtmlAlternativeRows(rows = []) {
  return rows.map((row) => {
    const originalPricing = getPricingMeta(row.original.pricing);
    const originalSub = row.original.sub ? ` · ${row.original.sub}` : '';

    let recommendation = '<p class="report-empty">No high-confidence match found.</p>';
    if (row.status === 'already-covered') {
      recommendation = '<p class="report-empty">Already aligned with this pricing tier.</p>';
    } else if (row.alternative) {
      const altPricing = getPricingMeta(row.alternative.pricing);
      recommendation = `
        <div class="report-alt">
          <div>
            <h5>${escapeHtml(row.alternative.name)}</h5>
            <p>${escapeHtml(altPricing.label)}${row.alternative.sub ? ` · ${escapeHtml(row.alternative.sub)}` : ''}</p>
          </div>
          <a href="${escapeHtml(row.alternative.url)}" target="_blank" rel="noopener">Open</a>
        </div>
        <p class="report-alt__desc">${escapeHtml(row.alternative.desc)}</p>
      `;
    }

    return `
      <article class="report-card report-card--alt">
        <div class="report-grid">
          <div>
            <span class="report-label">Original tool</span>
            <h4>${escapeHtml(row.original.name)}</h4>
            <p class="report-card__meta">${escapeHtml(originalPricing.label)}${escapeHtml(originalSub)}</p>
            <p>${escapeHtml(row.original.desc)}</p>
          </div>
          <div>
            <span class="report-label">Recommendation</span>
            ${recommendation}
            <p class="report-card__reason"><strong>Why it fits:</strong> ${escapeHtml(row.reason)}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

export function buildHtmlReport(model) {
  const grouped = groupToolsByCategory(model.chosenStack);
  const chosenSections = Object.entries(grouped).map(([category, tools]) => `
    <section class="report-block">
      <div class="report-section-title">
        <h3>${escapeHtml(category)}</h3>
        <span>${tools.length} tool${tools.length === 1 ? '' : 's'}</span>
      </div>
      <div class="report-list">
        ${renderHtmlToolList(tools)}
      </div>
    </section>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(model.brand.agency)} — ${escapeHtml(model.brand.reportTitle)}</title>
    <style>
      :root {
        --bg: #0f1115;
        --panel: #161b22;
        --panel-soft: #1d2430;
        --line: #2b3442;
        --text: #e5eefc;
        --muted: #94a3b8;
        --accent: ${model.brand.accentHex};
        --accent-soft: rgba(37, 99, 235, 0.14);
      }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 32px; background: #f4f7fb; color: #102033; font-family: Inter, Arial, sans-serif; }
      .report-shell { max-width: 1100px; margin: 0 auto; }
      .report-hero {
        background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
        color: white;
        padding: 36px;
        border-radius: 24px;
        margin-bottom: 24px;
      }
      .report-hero__eyebrow { letter-spacing: 0.18em; text-transform: uppercase; font-size: 12px; opacity: 0.72; margin-bottom: 14px; }
      .report-hero h1 { margin: 0 0 12px; font-size: 32px; line-height: 1.1; }
      .report-hero p { margin: 0; max-width: 720px; color: rgba(255,255,255,0.85); }
      .report-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin: 24px 0; }
      .report-meta__card, .report-block { background: white; border: 1px solid #dbe4f0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06); }
      .report-meta__card span, .report-label { display: block; margin-bottom: 8px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #64748b; }
      .report-meta__card strong { font-size: 16px; color: #0f172a; }
      .report-section { margin-top: 28px; }
      .report-section h2 { font-size: 24px; margin: 0 0 16px; color: #0f172a; }
      .report-section-title { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 16px; }
      .report-section-title h3 { margin: 0; font-size: 18px; color: #0f172a; }
      .report-section-title span, .report-card__meta, .report-card__reason { color: #64748b; }
      .report-list { display: grid; gap: 16px; }
      .report-card { border: 1px solid #dbe4f0; background: #f8fbff; border-radius: 18px; padding: 18px; }
      .report-card__top, .report-alt { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
      .report-card h4, .report-alt h5 { margin: 0 0 6px; color: #0f172a; font-size: 18px; }
      .report-card p { margin: 8px 0 0; line-height: 1.5; }
      .report-card a, .report-alt a { color: var(--accent); word-break: break-all; text-decoration: none; }
      .report-pill { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 700; }
      .report-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
      .report-alt__desc { margin-top: 10px; }
      .report-empty { font-weight: 600; color: #334155; }
      .report-footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 28px; }
      @media print {
        body { padding: 0; background: white; }
        .report-meta__card, .report-block { box-shadow: none; }
        .report-hero { page-break-inside: avoid; }
        .report-card { page-break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <div class="report-shell">
      <section class="report-hero">
        <div class="report-hero__eyebrow">${escapeHtml(model.brand.agency)}</div>
        <h1>${escapeHtml(model.brand.reportTitle)}</h1>
        <p>${escapeHtml(model.brand.reportSubtitle)}</p>
      </section>

      <section class="report-meta">
        <article class="report-meta__card">
          <span>Generated</span>
          <strong>${escapeHtml(formatReportDate(model.generatedAt))}</strong>
        </article>
        <article class="report-meta__card">
          <span>Prepared by</span>
          <strong>${escapeHtml(model.brand.agency)}</strong>
        </article>
        <article class="report-meta__card">
          <span>Stack summary</span>
          <strong>${escapeHtml(model.chosenSummary.line)}</strong>
        </article>
      </section>

      ${model.notes ? `<section class="report-block"><div class="report-label">Client notes</div><p>${escapeHtml(model.notes)}</p></section>` : ''}

      <section class="report-section">
        <h2>Chosen Stack</h2>
        ${chosenSections}
      </section>

      <section class="report-section">
        <h2>Free Alternatives</h2>
        <div class="report-list">${renderHtmlAlternativeRows(model.freeRows)}</div>
      </section>

      <section class="report-section">
        <h2>Paid Alternatives</h2>
        <div class="report-list">${renderHtmlAlternativeRows(model.paidRows)}</div>
      </section>

      <p class="report-footer">Generated by ${escapeHtml(model.brand.product)} · ${escapeHtml(model.brand.website)}</p>
    </div>
  </body>
</html>`;
}

function escapePdfText(value = '') {
  const sanitized = String(value)
    .normalize('NFKD')
    .replace(/[–—]/g, '-')
    .replace(/[•·]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E]/g, '');

  return sanitized
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapPdfText(text, limit = 88) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > limit && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

function addPdfSectionLine(lines, text, options = {}) {
  const settings = {
    size: options.size || 10,
    bold: Boolean(options.bold),
    color: options.color || '0 0 0',
    gapAfter: options.gapAfter ?? 4,
    gapBefore: options.gapBefore ?? 0,
  };
  if (settings.gapBefore > 0) lines.push({ type: 'spacer', height: settings.gapBefore });
  lines.push({ type: 'text', text, ...settings });
  if (settings.gapAfter > 0) lines.push({ type: 'spacer', height: settings.gapAfter });
}

function buildPdfLinePlan(model) {
  const lines = [];
  addPdfSectionLine(lines, model.brand.agency, { size: 18, bold: true, color: '0.145 0.388 0.922', gapAfter: 2 });
  addPdfSectionLine(lines, model.brand.reportTitle, { size: 14, bold: true, gapAfter: 10 });
  addPdfSectionLine(lines, `Generated: ${formatReportDate(model.generatedAt)}`, { gapAfter: 2 });
  addPdfSectionLine(lines, `Prepared by: ${model.brand.agency}`, { gapAfter: 2 });
  addPdfSectionLine(lines, `Website: ${model.brand.website}`, { gapAfter: 8 });
  addPdfSectionLine(lines, model.chosenSummary.line, { bold: true, gapAfter: 12 });

  if (model.notes) {
    addPdfSectionLine(lines, 'Client Notes', { size: 12, bold: true, color: '0.145 0.388 0.922', gapAfter: 4 });
    for (const noteLine of wrapPdfText(model.notes)) addPdfSectionLine(lines, noteLine, { gapAfter: 1 });
    lines.push({ type: 'spacer', height: 10 });
  }

  addPdfSectionLine(lines, 'Chosen Stack', { size: 12, bold: true, color: '0.145 0.388 0.922', gapAfter: 6 });
  const grouped = groupToolsByCategory(model.chosenStack);
  for (const [category, tools] of Object.entries(grouped)) {
    addPdfSectionLine(lines, category, { size: 11, bold: true, gapAfter: 4 });
    for (const tool of tools) {
      addPdfSectionLine(lines, `${tool.name} · ${getPricingMeta(tool.pricing).label}${tool.sub ? ` · ${tool.sub}` : ''}`, { bold: true, gapAfter: 2 });
      for (const line of wrapPdfText(tool.desc)) addPdfSectionLine(lines, line, { gapAfter: 1 });
      addPdfSectionLine(lines, tool.url, { color: '0.145 0.388 0.922', gapAfter: 5 });
    }
  }

  const sections = [
    ['Free Alternatives', model.freeRows],
    ['Paid Alternatives', model.paidRows],
  ];

  for (const [title, rows] of sections) {
    addPdfSectionLine(lines, title, { size: 12, bold: true, color: '0.145 0.388 0.922', gapBefore: 6, gapAfter: 6 });
    for (const row of rows) {
      addPdfSectionLine(lines, `${row.original.name} · ${getPricingMeta(row.original.pricing).label}${row.original.sub ? ` · ${row.original.sub}` : ''}`, { bold: true, gapAfter: 2 });
      if (row.alternative) {
        addPdfSectionLine(lines, `Recommendation: ${row.alternative.name} · ${getPricingMeta(row.alternative.pricing).label}${row.alternative.sub ? ` · ${row.alternative.sub}` : ''}`, { gapAfter: 2 });
        for (const line of wrapPdfText(`Why it fits: ${row.reason}`)) addPdfSectionLine(lines, line, { gapAfter: 1 });
        for (const line of wrapPdfText(`What it does: ${row.alternative.desc}`)) addPdfSectionLine(lines, line, { gapAfter: 1 });
        addPdfSectionLine(lines, row.alternative.url, { color: '0.145 0.388 0.922', gapAfter: 5 });
      } else {
        const fallback = row.status === 'already-covered' ? 'Recommendation: not needed' : 'Recommendation: no high-confidence match found';
        addPdfSectionLine(lines, fallback, { gapAfter: 2 });
        for (const line of wrapPdfText(`Why it fits: ${row.reason}`)) addPdfSectionLine(lines, line, { gapAfter: 1 });
        lines.push({ type: 'spacer', height: 5 });
      }
    }
  }

  return lines;
}

export function buildPdfBytes(model) {
  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 48;
  const top = 792;
  const bottomMargin = 52;
  const footerY = 26;

  const plannedLines = buildPdfLinePlan(model);
  const pages = [];
  let currentPage = [];
  let y = top;

  for (const line of plannedLines) {
    if (line.type === 'spacer') {
      y -= line.height;
      continue;
    }

    const wrapped = wrapPdfText(line.text, line.size >= 14 ? 54 : 88);
    const requiredHeight = wrapped.length * (line.size + 4) + (line.gapAfter || 0);
    if (y - requiredHeight < bottomMargin) {
      pages.push(currentPage);
      currentPage = [];
      y = top;
    }

    for (const wrappedLine of wrapped) {
      currentPage.push({
        text: wrappedLine,
        x: marginX,
        y,
        size: line.size,
        bold: line.bold,
        color: line.color,
      });
      y -= line.size + 4;
    }

    y -= line.gapAfter || 0;
  }

  if (currentPage.length > 0) pages.push(currentPage);

  const objects = [];
  const addObject = (value) => {
    objects.push(value);
    return objects.length;
  };

  const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>');
  const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >>');

  const pageRefs = [];
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const commands = pages[pageIndex].map((line) => `BT\n/${line.bold ? 'F2' : 'F1'} ${line.size} Tf\n${line.color} rg\n1 0 0 1 ${line.x} ${line.y} Tm\n(${escapePdfText(line.text)}) Tj\nET`).join('\n');
    const footer = `BT\n/F1 9 Tf\n0.45 0.5 0.58 rg\n1 0 0 1 ${marginX} ${footerY} Tm\n(${escapePdfText(`${model.brand.product} · Page ${pageIndex + 1} of ${pages.length}`)}) Tj\nET`;
    const contentId = addObject(`<< /Length ${commands.length + footer.length + 1} >>\nstream\n${commands}\n${footer}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent PAGES_REF /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageRefs.push(pageId);
  }

  const pagesId = addObject(`<< /Type /Pages /Kids [${pageRefs.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`);
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  const finalizedObjects = objects.map((value) => value.replace(/PAGES_REF/g, `${pagesId} 0 R`));

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  finalizedObjects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${finalizedObjects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${finalizedObjects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}
