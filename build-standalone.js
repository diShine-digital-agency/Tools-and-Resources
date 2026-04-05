import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));
const categories = [...new Set(tools.map(t => t.category))];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tools & Resources | diShine Digital Agency</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0f1115] text-gray-100 antialiased min-h-screen p-4 sm:p-8">
  <div class="max-w-7xl mx-auto">
    <header class="mb-12 border-b border-gray-800 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          diShine<span class="text-blue-500">_</span>Toolkit
        </h1>
        <p class="text-gray-400 mt-2">Standalone HTML Version (Zero Dependencies)</p>
      </div>
      <a href="https://github.com/diShine-digital-agency/Tools-and-Resources" target="_blank" class="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-200 transition-colors inline-block text-center">
        View on GitHub
      </a>
    </header>

    <div class="relative max-w-2xl mb-12">
      <input type="text" id="searchInput" placeholder="Search by name or description..." class="w-full pl-4 pr-4 py-4 rounded-xl bg-[#161b22] text-gray-100 border border-gray-700/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm" />
    </div>
    
    <div id="toolsContainer">
      ${categories.map(cat => `
        <div class="category-section mb-16">
          <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            ${cat}
            <span class="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">${tools.filter(t => t.category === cat).length}</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            ${tools.filter(t => t.category === cat).map(tool => `
              <a href="${tool.url}" target="_blank" rel="noopener" class="tool-card flex flex-col p-5 rounded-xl border border-gray-800 bg-[#161b22] hover:bg-gray-800/80 transition-all group" data-name="${(tool.name || '').toLowerCase()}" data-desc="${(tool.description || '').toLowerCase()}">
                <div class="flex justify-between items-start mb-3 gap-2">
                  <h3 class="font-semibold text-white group-hover:text-blue-400 leading-tight">
                    ${tool.name} ${tool.agencyPick ? '<span title="diShine Top Pick">👑</span>' : ''}
                  </h3>
                  <div class="flex gap-1.5 flex-shrink-0">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700">${tool.type}</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${tool.learningCurve === 'Easy' ? 'bg-green-900/30 text-green-400' : tool.learningCurve === 'Steep' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-500'}">${tool.learningCurve}</span>
                  </div>
                </div>
                <p class="text-sm text-gray-400 leading-relaxed flex-grow">${tool.description}</p>
                ${tool.alternativeTo ? `<p class="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-800"><span class="font-medium">Alt to:</span> ${tool.alternativeTo}</p>` : ''}
              </a>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  <script>
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.category-section');
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      sections.forEach(sec => {
        let hasMatch = false;
        sec.querySelectorAll('.tool-card').forEach(card => {
          if (card.dataset.name.includes(term) || card.dataset.desc.includes(term)) {
            card.style.display = 'flex';
            hasMatch = true;
          } else {
            card.style.display = 'none';
          }
        });
        sec.style.display = hasMatch ? 'block' : 'none';
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync('standalone.html', html);
console.log('standalone.html generated successfully.');
