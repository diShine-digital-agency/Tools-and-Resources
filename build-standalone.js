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
  <div class="max-w-[1400px] mx-auto flex gap-6">
    <div class="flex-1 min-w-0">
      <header class="mb-8 border-b border-gray-800 pb-8 flex flex-col justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            diShine<span class="text-blue-500">_</span>Toolkit
          </h1>
          <p class="text-gray-400 mt-2">Consulting Standalone Edition (v1.1.0)</p>
        </div>
      </header>

      <div class="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-full md:w-1/2">
             <input type="text" id="searchInput" placeholder="Search by name, tags or description..." class="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0f1115] text-gray-100 border border-gray-700/80 focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
             <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
        </div>
        <div class="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <label class="flex items-center gap-2 cursor-pointer bg-[#0f1115] border border-gray-700 px-4 py-3 rounded-lg hover:border-blue-500 transition-colors whitespace-nowrap">
            <input type="checkbox" id="freeFilter" class="form-checkbox h-4 w-4 text-blue-500 rounded bg-gray-800 border-gray-600 focus:ring-blue-500" />
            <span class="text-sm font-semibold text-gray-200">Free / Freemium</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer bg-[#0f1115] border border-gray-700 px-4 py-3 rounded-lg hover:border-blue-500 transition-colors whitespace-nowrap">
            <input type="checkbox" id="osFilter" class="form-checkbox h-4 w-4 text-blue-500 rounded bg-gray-800 border-gray-600 focus:ring-blue-500" />
            <span class="text-sm font-semibold text-gray-200">Open Source</span>
          </label>
        </div>
      </div>
      
      <div id="toolsContainer">
        ${categories.map(cat => `
          <div class="category-section mb-12">
            <h2 class="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">${cat}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              ${tools.filter(t => t.category === cat).map(tool => `
                <div class="tool-card flex flex-col p-5 rounded-xl border border-gray-800 bg-[#161b22] hover:bg-gray-800/80 transition-all group" 
                  data-name="${(tool.name || '').toLowerCase()}" 
                  data-desc="${(tool.description || '').toLowerCase()}"
                  data-tags="${(tool.tags || []).join(' ').toLowerCase()}"
                  data-free="${tool.isFree}"
                  data-os="${tool.isOpenSource}">
                  
                  <div class="flex justify-between items-start mb-3 gap-2">
                    <a href="${tool.url}" target="_blank" class="font-semibold text-white group-hover:text-blue-400 leading-tight">
                      ${tool.name} ${tool.agencyPick ? '<span title="diShine Top Pick">👑</span>' : ''}
                    </a>
                    <button class="add-to-stack flex-shrink-0 text-xs bg-blue-900/40 hover:bg-blue-600 text-blue-300 px-2 py-1.5 rounded border border-blue-800/60 transition-colors font-medium shadow-sm" data-tool='${JSON.stringify({name: tool.name, url: tool.url, desc: tool.description}).replace(/'/g, "&apos;")}'>+ Stack</button>
                  </div>
                  
                  <div class="flex flex-wrap gap-1.5 mb-3">
                    ${tool.tags.map(tag => `<span class="tag-badge cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 transition" data-tag="${tag.toLowerCase()}">#${tag}</span>`).join('')}
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold ${tool.learningCurve === 'Easy' ? 'bg-green-900/30 text-green-400' : tool.learningCurve === 'Steep' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-500'} border ${tool.learningCurve === 'Easy' ? 'border-green-800/50' : tool.learningCurve === 'Steep' ? 'border-red-800/50' : 'border-yellow-800/50'}">${tool.learningCurve}</span>
                  </div>
                  <p class="text-sm text-gray-400 leading-relaxed flex-grow mb-4">${tool.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Stack Sidebar -->
    <div class="w-80 flex-shrink-0 hidden lg:block sticky top-8 h-[calc(100vh-4rem)]">
      <div class="rounded-xl border border-gray-800 bg-[#161b22] h-full flex flex-col shadow-xl">
        <div class="p-5 border-b border-gray-800 bg-[#0f1115] rounded-t-xl flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              My Stack
            </h2>
            <p class="text-xs text-gray-400">Curate tools to export.</p>
          </div>
          <span id="stackCounter" class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">0</span>
        </div>
        <div id="stackItems" class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#11141a]">
           <p id="emptyStackMsg" class="text-sm text-gray-500 text-center mt-10">Your stack is empty.<br/><br/>Browse the directory and click <b class="text-blue-400">"+ Stack"</b> on tools to curate a consultancy list.</p>
        </div>
        <div class="p-4 border-t border-gray-800 bg-[#0f1115] rounded-b-xl">
          <button id="exportMdBtn" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Export Markdown
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const searchInput = document.getElementById('searchInput');
    const freeFilter = document.getElementById('freeFilter');
    const osFilter = document.getElementById('osFilter');
    const sections = document.querySelectorAll('.category-section');
    const tagBadges = document.querySelectorAll('.tag-badge');
    
    // Stack State
    let myStack = [];
    const stackItemsContainer = document.getElementById('stackItems');
    const emptyStackMsg = document.getElementById('emptyStackMsg');
    const stackCounter = document.getElementById('stackCounter');
    const exportBtn = document.getElementById('exportMdBtn');

    function renderStack() {
      stackCounter.innerText = myStack.length;
      if (myStack.length === 0) {
        emptyStackMsg.style.display = 'block';
        exportBtn.disabled = true;
        stackItemsContainer.querySelectorAll('.stack-item').forEach(el => el.remove());
        return;
      }
      emptyStackMsg.style.display = 'none';
      exportBtn.disabled = false;
      stackItemsContainer.querySelectorAll('.stack-item').forEach(el => el.remove());
      
      myStack.forEach((tool, index) => {
        const div = document.createElement('div');
        div.className = 'stack-item p-3 bg-[#161b22] border border-gray-700/50 hover:border-gray-600 rounded-lg flex justify-between items-start gap-2 transition-colors';
        div.innerHTML = \`
          <div class="overflow-hidden">
            <h4 class="text-sm font-semibold text-blue-400 leading-tight truncate">\${tool.name}</h4>
            <p class="text-[10px] text-gray-500 mt-1 truncate">\${tool.desc}</p>
          </div>
          <button class="remove-btn flex-shrink-0 text-gray-500 hover:text-red-400 text-xs font-bold p-1 transition-colors" data-idx="\${index}" title="Remove">✕</button>
        \`;
        stackItemsContainer.appendChild(div);
      });

      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.dataset.idx);
          myStack.splice(idx, 1);
          renderStack();
        });
      });
    }
    renderStack();

    document.querySelectorAll('.add-to-stack').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const toolData = JSON.parse(e.target.dataset.tool);
        if (!myStack.find(t => t.name === toolData.name)) {
          myStack.push(toolData);
          renderStack();
          
          const origText = e.target.innerText;
          e.target.innerText = '✓ Added';
          e.target.classList.replace('bg-blue-900/40', 'bg-emerald-900/60');
          e.target.classList.replace('text-blue-300', 'text-emerald-300');
          e.target.classList.replace('border-blue-800/60', 'border-emerald-800/60');
          setTimeout(() => {
            e.target.innerText = origText;
            e.target.classList.replace('bg-emerald-900/60', 'bg-blue-900/40');
            e.target.classList.replace('text-emerald-300', 'text-blue-300');
            e.target.classList.replace('border-emerald-800/60', 'border-blue-800/60');
          }, 1500);
        }
      });
    });

    exportBtn.addEventListener('click', () => {
      if (myStack.length === 0) return;
      let md = '# 🚀 Curated Tech Stack\\n\\nHere is your custom curated list of tools:\\n\\n';
      myStack.forEach(t => {
        md += \`- **[\${t.name}](\${t.url})**: \${t.desc}\\n\`;
      });
      navigator.clipboard.writeText(md).then(() => {
        const orig = exportBtn.innerHTML;
        exportBtn.innerHTML = '✓ Copied to Clipboard!';
        exportBtn.classList.replace('bg-blue-600', 'bg-emerald-600');
        setTimeout(() => {
           exportBtn.innerHTML = orig;
           exportBtn.classList.replace('bg-emerald-600', 'bg-blue-600');
        }, 2000);
      });
    });

    let currentTagFilter = "";

    function filterTools() {
      // If we clicked a tag, override the input visually
      if (currentTagFilter) {
          searchInput.value = "#" + currentTagFilter;
      }
      
      const term = searchInput.value.toLowerCase().replace('#', '');
      const needsFree = freeFilter.checked;
      const needsOS = osFilter.checked;

      sections.forEach(sec => {
        let hasMatch = false;
        sec.querySelectorAll('.tool-card').forEach(card => {
          const name = card.dataset.name;
          const desc = card.dataset.desc;
          const isFree = card.dataset.free === 'true';
          const isOS = card.dataset.os === 'true';
          const tags = card.dataset.tags;

          const matchText = name.includes(term) || desc.includes(term) || tags.includes(term);
          const matchFree = !needsFree || isFree;
          const matchOS = !needsOS || isOS;

          if (matchText && matchFree && matchOS) {
            card.style.display = 'flex';
            hasMatch = true;
          } else {
            card.style.display = 'none';
          }
        });
        sec.style.display = hasMatch ? 'block' : 'none';
      });
    }

    searchInput.addEventListener('input', (e) => {
        currentTagFilter = ''; // typing clears exact tag filter
        filterTools();
    });
    freeFilter.addEventListener('change', filterTools);
    osFilter.addEventListener('change', filterTools);

    tagBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        const tag = e.target.dataset.tag;
        if (currentTagFilter === tag) {
          currentTagFilter = ""; // toggle off
          searchInput.value = "";
        } else {
          currentTagFilter = tag;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        filterTools();
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync('standalone.html', html);
console.log('standalone.html generated successfully with new consulting features.');
