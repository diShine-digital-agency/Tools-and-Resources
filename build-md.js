import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));
const categories = [...new Set(tools.map(t => t.category))];

let md = '# 📚 The Complete Tools & Resources List\n\nThis is a statically generated list of all tools available in the diShine toolkit, designed for pure markdown reading.\n\n## Table of Contents\n';

categories.forEach((cat, index) => {
    const link = cat.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    md += `${index + 1}. [${cat}](#${link})\n`;
});

md += '\n---\n\n';

categories.forEach(cat => {
    md += `## ${cat}\n\n`;
    md += '| Tool | Philosophy | Curve | Description & Metadata |\n';
    md += '|------|------------|-------|------------------------|\n';
    tools.filter(t => t.category === cat).forEach(t => {
        const pick = t.agencyPick ? '👑 **diShine Pick**<br>' : '';
        const phil = []
        if (t.isFree) phil.push('Free/Freemium');
        else phil.push('Paid');
        if (t.isOpenSource) phil.push('OSS');
        
        const tags = t.tags && t.tags.length > 0 ? `<br>*Tags: ${t.tags.map(tag=>'#'+tag).join(', ')}*` : '';
        const alt = t.alternativeTo ? `<br>**Alt to:** ${t.alternativeTo}` : '';
        
        md += `| **[${t.name}](${t.url})** | ${phil.join('<br>')} | ${t.learningCurve} | ${pick}${t.description}${alt}${tags} |\n`;
    });
    md += '\n[⬆ Back to Top](#table-of-contents)\n\n---\n\n';
});

fs.writeFileSync('DIRECTORY.md', md);
console.log('DIRECTORY.md generated successfully.');
