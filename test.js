import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));
console.log('Total Tools:', tools.length);

function findBestAlternative(originalToolName, needFree) {
    const originalTool = tools.find(t => t.name === originalToolName);
    if (!originalTool) return null;
    let explicit = tools.find(t => t.isFree === needFree && t.name !== originalTool.name && (t.alternativeTo === originalTool.name || originalTool.alternativeTo === t.name));
    if (explicit) return explicit;
    let pool = tools.filter(t => t.isFree === needFree && t.name !== originalTool.name && t.category === originalTool.category);
    if (pool.length === 0) return null;
    let bestAlt = pool[0];
    let maxScore = -1;
    const targetTagVals = (originalTool.tags || []).map(t => t.toLowerCase());
    pool.forEach(t => {
        const candidateTags = (t.tags || []).map(tg => tg.toLowerCase());
        let score = candidateTags.filter(tg => targetTagVals.includes(tg)).length;
        if (score > maxScore) { maxScore = score; bestAlt = t; }
    });
    return bestAlt;
}

console.log('Test 1 (Premiere -> Free):', findBestAlternative('Adobe Premiere Pro', true)?.name);
console.log('Test 2 (HubSpot -> Free):', findBestAlternative('HubSpot CRM', true)?.name);
console.log('Test 3 (Jira -> Free):', findBestAlternative('Jira', true)?.name);
console.log('Test 4 (Superhuman -> OS):', findBestAlternative('Superhuman', true)?.name);
