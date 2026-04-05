import fs from 'fs';

const tools = JSON.parse(fs.readFileSync('src/data/tools.json', 'utf-8'));
const categories = [...new Set(tools.map(t => t.category))];

function pricingBadge(tool) {
  const p = tool.pricing || 'free';
  if (p === 'paid') return '<span class="pricing-badge px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-rose-900/30 text-rose-400 border-rose-800/50">Paid only</span>';
  if (p === 'freemium') return '<span class="pricing-badge px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-amber-900/30 text-amber-400 border-amber-800/50">Freemium</span>';
  if (p === 'open-source') return '<span class="pricing-badge px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-teal-900/30 text-teal-400 border-teal-800/50">Open Source</span>';
  return '<span class="pricing-badge px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-emerald-900/30 text-emerald-400 border-emerald-800/50">100% Free</span>';
}

function curveBadge(lc) {
  if (lc === 'Easy') return 'bg-green-900/30 text-green-400 border-green-800/50';
  if (lc === 'Steep') return 'bg-red-900/30 text-red-400 border-red-800/50';
  return 'bg-yellow-900/30 text-yellow-500 border-yellow-800/50';
}

// Sanitize strings for safe embedding in HTML attributes
function escAttr(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&apos;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tools & Resources | diShine Digital Agency</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>details > summary { list-style: none; } details > summary::-webkit-details-marker { display: none; }</style>
</head>
<body class="bg-[#0f1115] text-gray-100 antialiased min-h-screen p-4 sm:p-8">
  <div class="max-w-[1400px] mx-auto flex gap-6">
    <div class="flex-1 min-w-0">
      <header class="mb-8 border-b border-gray-800 pb-8 flex flex-col justify-between gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            diShine<span class="text-blue-500">_</span>Toolkit
          </h1>
          <p class="text-gray-400 mt-2">Consulting Edition (v1.2.0) &mdash; ${tools.length} tools</p>
        </div>
      </header>

      <div class="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-full md:w-1/2">
             <input type="text" id="searchInput" placeholder="Search by name, tags or description..." class="w-full pl-4 pr-10 py-3 rounded-lg bg-[#0f1115] text-gray-100 border border-gray-700/80 focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
             <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
        </div>
        <div class="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button id="filterAll" class="pricing-filter active text-[11px] font-bold px-4 py-2.5 rounded-lg border transition-colors whitespace-nowrap bg-blue-600 text-white border-blue-500">All (${tools.length})</button>
          <button id="filterFree" class="pricing-filter text-[11px] font-bold px-4 py-2.5 rounded-lg border transition-colors whitespace-nowrap bg-[#0f1115] text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/30">Free (${tools.filter(t=>t.pricing==='free').length})</button>
          <button id="filterFreemium" class="pricing-filter text-[11px] font-bold px-4 py-2.5 rounded-lg border transition-colors whitespace-nowrap bg-[#0f1115] text-amber-400 border-amber-800/50 hover:bg-amber-900/30">Freemium (${tools.filter(t=>t.pricing==='freemium').length})</button>
          <button id="filterOS" class="pricing-filter text-[11px] font-bold px-4 py-2.5 rounded-lg border transition-colors whitespace-nowrap bg-[#0f1115] text-teal-400 border-teal-800/50 hover:bg-teal-900/30">Open Source (${tools.filter(t=>t.pricing==='open-source').length})</button>
          <button id="filterPaid" class="pricing-filter text-[11px] font-bold px-4 py-2.5 rounded-lg border transition-colors whitespace-nowrap bg-[#0f1115] text-rose-400 border-rose-800/50 hover:bg-rose-900/30">Paid (${tools.filter(t=>t.pricing==='paid').length})</button>
        </div>
      </div>

      <div id="toolsContainer">
        ${categories.map(cat => {
          const catTools = tools.filter(t => t.category === cat);
          return `
          <details class="category-section group mb-6 bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden transition-colors" data-category="${escAttr(cat.toLowerCase())}">
            <summary class="text-xl font-bold text-gray-100 p-5 cursor-pointer flex justify-between items-center hover:bg-[#1f262e] transition-colors outline-none focus:ring-2 focus:ring-blue-500 inset-0">
              <div class="flex items-center gap-3">
                  ${cat}
                  <span class="text-xs font-semibold text-gray-400 px-2.5 py-0.5 bg-[#0f1115] border border-gray-800 rounded-full">${catTools.length} tools</span>
              </div>
              <svg class="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div class="p-5 border-t border-gray-800 bg-[#0f1115]/50">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                ${catTools.map(tool => `
                  <div class="tool-card flex flex-col p-5 rounded-xl border border-gray-800 bg-[#161b22] hover:bg-gray-800/80 transition-all shadow-sm"
                    data-name="${escAttr((tool.name || '').toLowerCase())}"
                    data-desc="${escAttr((tool.description || '').toLowerCase())}"
                    data-tags="${escAttr((tool.tags || []).join(' ').toLowerCase())}"
                    data-pricing="${escAttr(tool.pricing)}"
                    data-free="${tool.isFree}"
                    data-os="${tool.isOpenSource}"
                    data-cat="${escAttr(tool.category)}">

                    <div class="flex justify-between items-start mb-3 gap-2">
                      <a href="${escAttr(tool.url)}" target="_blank" rel="noopener" class="font-semibold text-white hover:text-blue-400 leading-tight">
                        ${tool.name} ${tool.agencyPick ? '<span title="diShine Top Pick">&#128081;</span>' : ''}
                      </a>
                      <button class="add-to-stack flex-shrink-0 text-xs bg-blue-900/40 hover:bg-blue-600 text-blue-300 px-2 py-1.5 rounded border border-blue-800/60 transition-colors font-medium shadow-sm" data-tool="${escAttr(JSON.stringify({name: tool.name, url: tool.url, desc: tool.description, pricing: tool.pricing, cat: tool.category}))}">+ Stack</button>
                    </div>

                    <div class="flex flex-wrap gap-1.5 mb-3">
                      ${tool.tags.map(tag => `<span class="tag-badge cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 transition" data-tag="${escAttr(tag.toLowerCase())}">#${tag}</span>`).join('')}
                      <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold border ${curveBadge(tool.learningCurve)}">${tool.learningCurve}</span>
                      ${pricingBadge(tool)}
                    </div>
                    <p class="text-sm text-gray-400 leading-relaxed flex-grow mb-4">${tool.description}</p>
                    ${tool.alternativeTo ? `<p class="text-[10px] text-gray-500 mt-2 border-t border-gray-800/80 pt-2 font-medium">Alt to: ${tool.alternativeTo}</p>`:''}
                  </div>
                `).join('')}
              </div>
            </div>
          </details>
        `;}).join('')}
      </div>
    </div>

    <!-- Stack Sidebar -->
    <div class="w-[340px] flex-shrink-0 hidden lg:block sticky top-8 h-[calc(100vh-4rem)]">
      <div class="rounded-xl border border-gray-800 bg-[#161b22] h-full flex flex-col shadow-2xl">
        <div class="p-5 border-b border-gray-800 bg-[#0f1115] rounded-t-xl">
          <div class="flex justify-between items-center mb-3">
             <h2 class="text-lg font-extrabold text-white flex items-center gap-2">
               <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               My Stack
             </h2>
             <span id="stackCounter" class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">0</span>
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
             <button id="btnConvertFree" class="text-[10px] font-bold py-1.5 px-2 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-800 transition rounded shadow-sm">Find Free Alts</button>
             <button id="btnConvertPro" class="text-[10px] font-bold py-1.5 px-2 bg-purple-900/30 text-purple-400 border border-purple-800/50 hover:bg-purple-800 transition rounded shadow-sm">Upgrade Stack</button>
          </div>
        </div>

        <div id="stackItems" class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1115]">
           <p id="emptyStackMsg" class="text-sm text-gray-500 text-center mt-10 px-4">Your stack is empty.<br/><br/>Click <b class="text-blue-400">"+ Stack"</b> on any tool card to start building a consultancy stack. Use the buttons above to swap pricing tiers.</p>
        </div>

        <div class="p-4 border-t border-gray-800 bg-[#161b22]">
          <textarea id="stackNotes" placeholder="Client intro note... (optional)" class="w-full bg-[#0f1115] border border-gray-700 rounded p-2 text-xs text-gray-300 mb-3 h-16 resize-none focus:ring-1 focus:ring-blue-500 outline-none"></textarea>
          <button id="exportMdBtn" disabled class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            Export Markdown
          </button>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.ALL_TOOLS = ${JSON.stringify(tools.map(t=>({name: t.name, url: t.url, desc: t.description, isFree: t.isFree, pricing: t.pricing, cat: t.category, alt: t.alternativeTo, tags: t.tags || []})))};

    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.category-section');
    const tagBadges = document.querySelectorAll('.tag-badge');

    let myStack = [];
    const stackItemsContainer = document.getElementById('stackItems');
    const emptyStackMsg = document.getElementById('emptyStackMsg');
    const stackCounter = document.getElementById('stackCounter');
    const exportBtn = document.getElementById('exportMdBtn');

    function pricingIcon(p) {
      if (p === 'paid') return '\\uD83D\\uDC8E';
      if (p === 'freemium') return '\\u2696\\uFE0F';
      if (p === 'open-source') return '\\uD83C\\uDF10';
      return '\\uD83C\\uDF4F';
    }
    function pricingLabel(p) {
      if (p === 'paid') return 'Paid';
      if (p === 'freemium') return 'Freemium';
      if (p === 'open-source') return 'Open Source';
      return 'Free';
    }

    function findBestAlternative(originalToolName, needFree) {
      const originalTool = window.ALL_TOOLS.find(function(t) { return t.name === originalToolName; });
      if (!originalTool) return null;
      var explicit = window.ALL_TOOLS.find(function(t) { return t.isFree === needFree && t.name !== originalTool.name && (t.alt === originalTool.name || originalTool.alt === t.name); });
      if (explicit) return explicit;
      var pool = window.ALL_TOOLS.filter(function(t) { return t.isFree === needFree && t.name !== originalTool.name && t.cat === originalTool.cat; });
      if (pool.length === 0) return null;
      var bestAlt = pool[0];
      var maxScore = -1;
      var targetTagVals = (originalTool.tags || []).map(function(t) { return t.toLowerCase(); });
      pool.forEach(function(t) {
        var candidateTags = (t.tags || []).map(function(tg) { return tg.toLowerCase(); });
        var score = candidateTags.filter(function(tg) { return targetTagVals.indexOf(tg) !== -1; }).length;
        if (score > maxScore) { maxScore = score; bestAlt = t; }
      });
      return bestAlt;
    }

    document.getElementById('btnConvertFree').addEventListener('click', function() {
      if (myStack.length === 0) return;
      myStack = myStack.map(function(st) {
        if (st.pricing === 'free' || st.pricing === 'open-source') return st;
        var alt = findBestAlternative(st.name, true);
        if (alt) return {name: alt.name, url: alt.url, desc: alt.desc, pricing: alt.pricing || 'free', cat: alt.cat};
        return st;
      });
      renderStack();
      syncButtons();
    });

    document.getElementById('btnConvertPro').addEventListener('click', function() {
      if (myStack.length === 0) return;
      myStack = myStack.map(function(st) {
        if (st.pricing === 'paid') return st;
        var alt = findBestAlternative(st.name, false);
        if (alt) return {name: alt.name, url: alt.url, desc: alt.desc, pricing: alt.pricing || 'paid', cat: alt.cat};
        return st;
      });
      renderStack();
      syncButtons();
    });

    function renderStack() {
      stackCounter.textContent = myStack.length;
      if (myStack.length === 0) {
        emptyStackMsg.style.display = 'block';
        exportBtn.disabled = true;
        var old = stackItemsContainer.querySelectorAll('.stack-item');
        for (var i = 0; i < old.length; i++) old[i].remove();
        return;
      }
      emptyStackMsg.style.display = 'none';
      exportBtn.disabled = false;
      var oldItems = stackItemsContainer.querySelectorAll('.stack-item');
      for (var i = 0; i < oldItems.length; i++) oldItems[i].remove();

      var counts = {free: 0, freemium: 0, 'open-source': 0, paid: 0};
      myStack.forEach(function(t) { counts[t.pricing] = (counts[t.pricing]||0) + 1; });
      var parts = [];
      if (counts.free) parts.push(counts.free + ' free');
      if (counts['open-source']) parts.push(counts['open-source'] + ' OS');
      if (counts.freemium) parts.push(counts.freemium + ' freemium');
      if (counts.paid) parts.push(counts.paid + ' paid');

      var statsDiv = document.createElement('div');
      statsDiv.className = 'stack-item text-[10px] text-center font-bold bg-gray-800 rounded p-1.5 mb-2';
      statsDiv.textContent = parts.join(' / ');
      stackItemsContainer.appendChild(statsDiv);

      myStack.forEach(function(tool, index) {
        var div = document.createElement('div');
        div.className = 'stack-item p-3 bg-[#161b22] border border-gray-700/50 rounded-lg flex justify-between items-start gap-2 shadow-sm';

        var infoDiv = document.createElement('div');
        infoDiv.className = 'overflow-hidden';
        var h4 = document.createElement('h4');
        h4.className = 'text-sm font-semibold text-blue-400 leading-tight truncate';
        h4.textContent = tool.name + ' ' + pricingIcon(tool.pricing);
        infoDiv.appendChild(h4);
        var catSpan = document.createElement('span');
        catSpan.className = 'text-[9px] bg-gray-800 text-gray-400 px-1 rounded mt-1 inline-block';
        catSpan.textContent = tool.cat;
        infoDiv.appendChild(catSpan);
        div.appendChild(infoDiv);

        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn flex-shrink-0 text-gray-500 hover:text-red-400 text-xs font-bold p-1 transition-colors';
        removeBtn.textContent = '\u2715';
        removeBtn.dataset.idx = index;
        removeBtn.addEventListener('click', function(e) {
          myStack.splice(parseInt(e.target.dataset.idx), 1);
          renderStack();
          syncButtons();
        });
        div.appendChild(removeBtn);
        stackItemsContainer.appendChild(div);
      });
    }

    function syncButtons() {
      var btns = document.querySelectorAll('.add-to-stack');
      for (var i = 0; i < btns.length; i++) {
        var btn = btns[i];
        var toolData = JSON.parse(btn.dataset.tool);
        var inStack = myStack.some(function(t) { return t.name === toolData.name; });
        if (inStack) {
          btn.textContent = '- Remove';
          btn.className = 'add-to-stack flex-shrink-0 text-xs bg-red-900/40 hover:bg-red-600 text-red-300 px-2 py-1.5 rounded border border-red-800/60 transition-colors font-medium shadow-sm';
        } else {
          btn.textContent = '+ Stack';
          btn.className = 'add-to-stack flex-shrink-0 text-xs bg-blue-900/40 hover:bg-blue-600 text-blue-300 px-2 py-1.5 rounded border border-blue-800/60 transition-colors font-medium shadow-sm';
        }
      }
    }

    var addBtns = document.querySelectorAll('.add-to-stack');
    for (var i = 0; i < addBtns.length; i++) {
      addBtns[i].addEventListener('click', function(e) {
        var btn = e.target.closest('.add-to-stack') || e.target;
        var toolData = JSON.parse(btn.dataset.tool);
        var idx = -1;
        for (var j = 0; j < myStack.length; j++) {
          if (myStack[j].name === toolData.name) { idx = j; break; }
        }
        if (idx !== -1) {
          myStack.splice(idx, 1);
        } else {
          myStack.push(toolData);
        }
        renderStack();
        syncButtons();
      });
    }

    exportBtn.addEventListener('click', function() {
      if (myStack.length === 0) return;
      var notes = document.getElementById('stackNotes').value.trim();
      var md = '# Digital Agency Tech Stack\\n\\n';
      if (notes) md += '> ' + notes + '\\n\\n';
      var counts = {free: 0, freemium: 0, 'open-source': 0, paid: 0};
      myStack.forEach(function(t) { counts[t.pricing] = (counts[t.pricing]||0)+1; });
      md += '**Stack overview:** ' + myStack.length + ' tools - ' + counts.free + ' free, ' + counts['open-source'] + ' open-source, ' + counts.freemium + ' freemium, ' + counts.paid + ' paid\\n\\n';
      var grouped = {};
      myStack.forEach(function(t) {
        if (!grouped[t.cat]) grouped[t.cat] = [];
        grouped[t.cat].push(t);
      });
      Object.keys(grouped).forEach(function(cat) {
        md += '### ' + cat + '\\n';
        grouped[cat].forEach(function(t) {
          md += '- **[' + t.name + '](' + t.url + ')** [' + pricingLabel(t.pricing) + ']: ' + t.desc + '\\n';
        });
        md += '\\n';
      });
      navigator.clipboard.writeText(md).then(function() {
        var orig = exportBtn.textContent;
        exportBtn.textContent = 'Copied!';
        exportBtn.classList.replace('bg-blue-600', 'bg-emerald-600');
        setTimeout(function() {
          exportBtn.textContent = orig;
          exportBtn.classList.replace('bg-emerald-600', 'bg-blue-600');
        }, 2000);
      });
    });

    var activePricingFilter = 'all';
    var currentTagFilter = '';

    var pricingBtns = document.querySelectorAll('.pricing-filter');
    for (var i = 0; i < pricingBtns.length; i++) {
      pricingBtns[i].addEventListener('click', function(e) {
        var btn = e.target.closest('.pricing-filter') || e.target;
        for (var j = 0; j < pricingBtns.length; j++) {
          pricingBtns[j].classList.remove('active','bg-blue-600','text-white','border-blue-500');
          pricingBtns[j].classList.add('bg-[#0f1115]');
        }
        btn.classList.add('active','bg-blue-600','text-white','border-blue-500');
        btn.classList.remove('bg-[#0f1115]');
        var id = btn.id;
        if (id === 'filterAll') activePricingFilter = 'all';
        else if (id === 'filterFree') activePricingFilter = 'free';
        else if (id === 'filterFreemium') activePricingFilter = 'freemium';
        else if (id === 'filterOS') activePricingFilter = 'open-source';
        else if (id === 'filterPaid') activePricingFilter = 'paid';
        filterTools();
      });
    }

    function filterTools() {
      if (currentTagFilter) searchInput.value = '#' + currentTagFilter;
      var term = searchInput.value.toLowerCase().replace('#', '');
      for (var si = 0; si < sections.length; si++) {
        var sec = sections[si];
        var hasMatch = false;
        var cards = sec.querySelectorAll('.tool-card');
        for (var ci = 0; ci < cards.length; ci++) {
          var card = cards[ci];
          var matchText = !term || card.dataset.name.indexOf(term) !== -1 || card.dataset.desc.indexOf(term) !== -1 || card.dataset.tags.indexOf(term) !== -1;
          var matchPricing = activePricingFilter === 'all' || card.dataset.pricing === activePricingFilter;
          if (matchText && matchPricing) {
            card.style.display = 'flex';
            hasMatch = true;
          } else {
            card.style.display = 'none';
          }
        }
        if (term.length > 0 || activePricingFilter !== 'all') {
          sec.open = hasMatch;
        }
        sec.style.display = hasMatch ? 'block' : 'none';
      }
    }

    searchInput.addEventListener('input', function() { currentTagFilter = ''; filterTools(); });

    for (var ti = 0; ti < tagBadges.length; ti++) {
      tagBadges[ti].addEventListener('click', function(e) {
        var tag = e.target.dataset.tag;
        currentTagFilter = (currentTagFilter === tag) ? '' : tag;
        if (!currentTagFilter) searchInput.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        filterTools();
      });
    }
  <\/script>
</body>
</html>`;

fs.writeFileSync('standalone.html', html);
console.log('standalone.html rebuilt: ' + tools.length + ' tools, accordions closed, 4-tier pricing, toggle buttons.');
