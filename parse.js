import fs from 'fs';

const content = fs.readFileSync('README.md', 'utf-8');
const lines = content.split('\n');

const tools = [];
let currentCategory = '';
let currentSubCategory = '';

const regex = /\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/;

for (const line of lines) {
  if (line.startsWith('## ') && !line.includes('Table of Contents') && !line.includes('diShine Open Source') && !line.includes('Contributing') && !line.includes('License')) {
    currentCategory = line.replace('## ', '').replace(/^\d+\.\s*/, '').trim();
    currentSubCategory = currentCategory;
  }
  if (line.startsWith('### ')) {
    currentSubCategory = line.replace('### ', '').trim();
  }
  
  const match = line.match(regex);
  if (match && !match[1].includes('Tool')) {
    const name = match[1].trim();
    const url = match[2].trim();
    const type = match[3].trim();
    const desc = match[4].trim();
    
    // Auto-curation logic for "Agency Pick" and "Alternative To"
    let agencyPick = false;
    let alternativeTo = "";
    let learningCurve = "Medium";
    
    if (name === 'PostHog' || name === 'Plausible' || name === 'Ahrefs' || name === 'Brevo' || name === 'Figma' || name === 'Supabase' || name === 'Plane' || name === 'Astro') {
      agencyPick = true;
    }

    if (name === 'Listmonk' || name === 'NocoDB') alternativeTo = 'Mailchimp / Airtable';
    if (name === 'PostHog') alternativeTo = 'Google Analytics / Mixpanel';
    if (name === 'Supabase') alternativeTo = 'Firebase';
    if (name === 'Plane') alternativeTo = 'Jira / Linear';
    if (name === 'Huly') alternativeTo = 'Notion / Linear';

    if (desc.toLowerCase().includes('enterprise') || desc.toLowerCase().includes('advanced')) learningCurve = 'Steep';
    if (desc.toLowerCase().includes('simple') || desc.toLowerCase().includes('quick') || desc.toLowerCase().includes('free tier')) learningCurve = 'Easy';

    tools.push({
      name,
      url,
      category: currentCategory,
      subCategory: currentSubCategory,
      type: type,
      description: desc,
      learningCurve,
      agencyPick,
      alternativeTo
    });
  }
}

// Create src/data directory if not exist
if (!fs.existsSync('src/data')){
    fs.mkdirSync('src/data', { recursive: true });
}

fs.writeFileSync('src/data/tools.json', JSON.stringify(tools, null, 2));

const stacks = [
  {
    name: "The Privacy Tech Stack",
    description: "Analytics and tracking without cookie banners.",
    tools: ["Plausible", "Cookiebot", "Zaraz"]
  },
  {
    name: "The Bootstrap Delivery Stack",
    description: "Launch your agency site for $0.",
    tools: ["Astro", "Tailwind CSS", "Vercel", "Supabase"]
  },
  {
    name: "Modern Content Engine",
    description: "SEO optimized content lifecycle.",
    tools: ["Ahrefs", "Surfer SEO", "Ghost"]
  }
];

fs.writeFileSync('src/data/stacks.json', JSON.stringify(stacks, null, 2));
console.log('Parsed', tools.length, 'tools into src/data/tools.json');
