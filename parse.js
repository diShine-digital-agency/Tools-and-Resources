import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));

function generateTags(name, desc, category) {
  const text = ((name || "") + " " + (desc || "") + " " + (category || "")).toLowerCase();
  const tags = [];
  if (text.includes('seo') || text.includes('search')) tags.push('SEO');
  if (text.includes('analytics') || text.includes('tracking')) tags.push('Analytics');
  if (text.includes('gdpr') || text.includes('privacy') || text.includes('cookie')) tags.push('Privacy');
  if (text.includes('open source') || text.includes('open-source')) tags.push('OSS');
  if (text.includes('ai ') || text.includes('llm') || text.includes('gpt')) tags.push('AI');
  if (text.includes('marketing') || text.includes('email') || text.includes('newsletter')) tags.push('Marketing');
  if (text.includes('design') || text.includes('ui') || text.includes('mockup')) tags.push('Design');
  if (text.includes('automation') || text.includes('zapier')) tags.push('Automation');
  if (text.includes('crm') || text.includes('sales')) tags.push('CRM');
  if (text.includes('developer') || text.includes('code') || text.includes('api')) tags.push('DevTools');
  return [...new Set(tags)];
}

const enrichedTools = tools.map(tool => {
  const isFree = (tool.type || "").includes('[F]') || (tool.type || "").includes('Free');
  const isOpenSource = (tool.type || "").includes('[OS]') || (tool.type || "").includes('Open Source');
  const tags = generateTags(tool.name, tool.description, tool.category);

  return {
    ...tool,
    isFree,
    isOpenSource,
    tags
  };
});

fs.writeFileSync('src/data/tools.json', JSON.stringify(enrichedTools, null, 2));
console.log(`Enriched ${enrichedTools.length} tools dynamically.`);
