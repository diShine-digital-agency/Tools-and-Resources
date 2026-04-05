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
  <title>Ressource &amp; Apps Toolkit | Consulting Edition</title>
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
            Ressource<span class="text-blue-500">&amp;</span>Apps<span class="text-blue-500">_</span>Toolkit
          </h1>
          <p class="text-gray-400 mt-2">Consulting Edition (v1.2.0) &mdash; ${tools.length} tools | Matching model v1.4</p>
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
          <div class="grid grid-cols-3 gap-2 mt-2">
             <button id="btnConvertFree" class="text-[10px] font-bold py-1.5 px-2 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-800 transition rounded shadow-sm">Free Alts</button>
             <button id="btnConvertPro" class="text-[10px] font-bold py-1.5 px-2 bg-purple-900/30 text-purple-400 border border-purple-800/50 hover:bg-purple-800 transition rounded shadow-sm">Upgrade</button>
             <button id="btnResetStack" class="text-[10px] font-bold py-1.5 px-2 bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 transition rounded shadow-sm" style="display:none;">Reset</button>
          </div>
        </div>

        <div id="stackItems" class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1115]">
           <p id="emptyStackMsg" class="text-sm text-gray-500 text-center mt-10 px-4">Your stack is empty.<br/><br/>Click <b class="text-blue-400">"+ Stack"</b> on any tool card to start building a consultancy stack. Use the buttons above to swap pricing tiers.</p>
        </div>

        <div class="p-4 border-t border-gray-800 bg-[#161b22]">
          <textarea id="stackNotes" placeholder="Client intro note... (optional)" class="w-full bg-[#0f1115] border border-gray-700 rounded p-2 text-xs text-gray-300 mb-3 h-16 resize-none focus:ring-1 focus:ring-blue-500 outline-none"></textarea>
          <div class="grid grid-cols-3 gap-2">
            <button id="exportClipBtn" disabled class="export-btn py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copy
            </button>
            <button id="exportMdBtn" disabled class="export-btn py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              .md
            </button>
            <button id="exportTxtBtn" disabled class="export-btn py-2.5 bg-gray-600 hover:bg-gray-500 text-white text-[11px] font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              .txt
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.ALL_TOOLS = ${JSON.stringify(tools.map(t=>({name: t.name, url: t.url, desc: t.description, isFree: t.isFree, pricing: t.pricing, cat: t.category, sub: t.subCategory || '', alt: t.alternativeTo, tags: t.tags || []})))};

    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.category-section');
    const tagBadges = document.querySelectorAll('.tag-badge');

    let myStack = [];
    var originalStack = [];
    var freeAltStack = [];
    var proAltStack = [];
    var activeView = 'original';
    const stackItemsContainer = document.getElementById('stackItems');
    const emptyStackMsg = document.getElementById('emptyStackMsg');
    const stackCounter = document.getElementById('stackCounter');
    const exportClipBtn = document.getElementById('exportClipBtn');
    const exportMdBtn = document.getElementById('exportMdBtn');
    const exportTxtBtn = document.getElementById('exportTxtBtn');
    const allExportBtns = document.querySelectorAll('.export-btn');

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

    function findBestAlternative(originalToolName, wantFreeOrPaid) {
      var originalTool = window.ALL_TOOLS.find(function(t) { return t.name === originalToolName; });
      if (!originalTool) return null;
      var pricingMatch = (wantFreeOrPaid === 'free')
        ? function(t) { return t.pricing === 'free' || t.pricing === 'open-source'; }
        : function(t) { return t.pricing === 'paid'; };
      var explicit = window.ALL_TOOLS.find(function(t) {
        return pricingMatch(t) && t.name !== originalTool.name && (t.alt === originalTool.name || originalTool.alt === t.name);
      });
      if (explicit) return explicit;
      var origSub = (originalTool.sub || '').toLowerCase();
      var origTags = (originalTool.tags || []).map(function(tg) { return tg.toLowerCase(); });
      var candidates = window.ALL_TOOLS.filter(function(t) {
        return pricingMatch(t) && t.name !== originalTool.name && t.cat === originalTool.cat;
      });
      if (candidates.length === 0) {
        candidates = window.ALL_TOOLS.filter(function(t) {
          return pricingMatch(t) && t.name !== originalTool.name;
        });
      }
      if (candidates.length === 0) return null;
      var best = null;
      var bestScore = -1;
      candidates.forEach(function(c) {
        var score = 0;
        var cSub = (c.sub || '').toLowerCase();
        if (origSub && cSub && cSub === origSub) score += 50;
        else if (c.cat === originalTool.cat && origSub && cSub && cSub !== origSub) score += 5;
        else if (c.cat === originalTool.cat) score += 15;
        var cTags = (c.tags || []).map(function(tg) { return tg.toLowerCase(); });
        var tagOverlap = cTags.filter(function(tg) { return origTags.indexOf(tg) !== -1; }).length;
        score += tagOverlap * 10;
        if (origSub && cSub && c.cat === originalTool.cat) {
          var subWords = origSub.split(/[\\s&,]+/).filter(function(w) { return w.length > 5; });
          subWords.forEach(function(w) { if (cSub.indexOf(w) !== -1) score += 20; });
        }
        if (score > bestScore) { bestScore = score; best = c; }
      });
      if (bestScore < 5) return null;
      return best;
    }

    function computeAlts(stack, mode) {
      return stack.map(function(st) {
        if (mode === 'free' && (st.pricing === 'free' || st.pricing === 'open-source')) return {original: st, alt: null};
        if (mode === 'paid' && st.pricing === 'paid') return {original: st, alt: null};
        var alt = findBestAlternative(st.name, mode);
        return {original: st, alt: alt ? {name: alt.name, url: alt.url, desc: alt.desc, pricing: alt.pricing, cat: alt.cat, sub: alt.sub} : null};
      });
    }

    document.getElementById('btnConvertFree').addEventListener('click', function() {
      if (myStack.length === 0) return;
      if (originalStack.length === 0) originalStack = myStack.map(function(t) { return Object.assign({}, t); });
      freeAltStack = computeAlts(originalStack, 'free');
      activeView = 'free';
      myStack = freeAltStack.map(function(r) { return r.alt ? r.alt : Object.assign({}, r.original); });
      renderStack();
      syncButtons();
      showResetBtn();
    });

    document.getElementById('btnConvertPro').addEventListener('click', function() {
      if (myStack.length === 0) return;
      if (originalStack.length === 0) originalStack = myStack.map(function(t) { return Object.assign({}, t); });
      proAltStack = computeAlts(originalStack, 'paid');
      activeView = 'paid';
      myStack = proAltStack.map(function(r) { return r.alt ? r.alt : Object.assign({}, r.original); });
      renderStack();
      syncButtons();
      showResetBtn();
    });

    function showResetBtn() {
      document.getElementById('btnResetStack').style.display = originalStack.length > 0 ? 'block' : 'none';
    }

    document.getElementById('btnResetStack').addEventListener('click', function() {
      if (originalStack.length === 0) return;
      myStack = originalStack.map(function(t) { return Object.assign({}, t); });
      activeView = 'original';
      renderStack();
      syncButtons();
    });

    function renderStack() {
      stackCounter.textContent = myStack.length;
      if (myStack.length === 0) {
        emptyStackMsg.style.display = 'block';
        for (var ei = 0; ei < allExportBtns.length; ei++) allExportBtns[ei].disabled = true;
        var old = stackItemsContainer.querySelectorAll('.stack-item');
        for (var i = 0; i < old.length; i++) old[i].remove();
        return;
      }
      emptyStackMsg.style.display = 'none';
      for (var ei = 0; ei < allExportBtns.length; ei++) allExportBtns[ei].disabled = false;
      var oldItems = stackItemsContainer.querySelectorAll('.stack-item');
      for (var i = 0; i < oldItems.length; i++) oldItems[i].remove();

      var counts = {free: 0, freemium: 0, 'open-source': 0, paid: 0};
      myStack.forEach(function(t) { counts[t.pricing] = (counts[t.pricing]||0) + 1; });
      var parts = [];
      if (counts.free) parts.push(counts.free + ' free');
      if (counts['open-source']) parts.push(counts['open-source'] + ' OS');
      if (counts.freemium) parts.push(counts.freemium + ' freemium');
      if (counts.paid) parts.push(counts.paid + ' paid');

      if (activeView !== 'original') {
        var viewLabel = document.createElement('div');
        var viewColor = activeView === 'free' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' : 'bg-purple-900/40 text-purple-400 border-purple-800/50';
        viewLabel.className = 'stack-item text-[10px] text-center font-bold rounded p-1.5 mb-1 border ' + viewColor;
        viewLabel.textContent = activeView === 'free' ? '\\uD83C\\uDF4F Viewing Free Alternatives' : '\\uD83D\\uDC8E Viewing Premium Alternatives';
        stackItemsContainer.appendChild(viewLabel);
      }

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
          originalStack = [];
          freeAltStack = [];
          proAltStack = [];
          activeView = 'original';
          showResetBtn();
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
        originalStack = [];
        freeAltStack = [];
        proAltStack = [];
        activeView = 'original';
        showResetBtn();
        renderStack();
        syncButtons();
      });
    }

    function stackSummary(stack) {
      var c = {free:0, freemium:0, 'open-source':0, paid:0};
      stack.forEach(function(t) { c[t.pricing] = (c[t.pricing]||0)+1; });
      return stack.length + ' tools \\u2014 ' + c.free + ' free, ' + c['open-source'] + ' open-source, ' + c.freemium + ' freemium, ' + c.paid + ' paid';
    }

    function renderStackSection(title, stack) {
      var md = '## ' + title + '\\n\\n';
      md += '> ' + stackSummary(stack) + '\\n\\n';
      var grouped = {};
      stack.forEach(function(t) { if (!grouped[t.cat]) grouped[t.cat] = []; grouped[t.cat].push(t); });
      Object.keys(grouped).forEach(function(cat) {
        md += '### ' + cat + '\\n';
        grouped[cat].forEach(function(t) {
          md += '- **[' + t.name + '](' + t.url + ')** [' + pricingLabel(t.pricing) + ']: ' + t.desc + '\\n';
        });
        md += '\\n';
      });
      return md;
    }

    function buildExportMd() {
      var notes = document.getElementById('stackNotes').value.trim();
      var baseStack = originalStack.length > 0 ? originalStack : myStack;
      var md = '# Digital Agency Tech Stack\\n\\n';
      if (notes) md += '> ' + notes + '\\n\\n';
      md += renderStackSection('\\uD83D\\uDCCB Chosen Stack', baseStack);
      var freeAlts = computeAlts(baseStack, 'free');
      var hasAnyFreeAlt = freeAlts.some(function(r) { return r.alt !== null; });
      if (hasAnyFreeAlt) {
        md += '---\\n\\n## \\uD83C\\uDF4F Free & Open-Source Alternatives\\n\\n';
        md += '| Chosen Tool | Pricing | Free Alternative | Pricing |\\n';
        md += '|---|---|---|---|\\n';
        freeAlts.forEach(function(r) {
          var origLabel = pricingLabel(r.original.pricing);
          if (r.alt) {
            md += '| ' + r.original.name + ' | ' + origLabel + ' | **' + r.alt.name + '** | ' + pricingLabel(r.alt.pricing) + ' |\\n';
          } else {
            md += '| ' + r.original.name + ' | ' + origLabel + ' | \\u2014 (already free/OS) | |\\n';
          }
        });
        md += '\\n';
      }
      var proAlts = computeAlts(baseStack, 'paid');
      var hasAnyProAlt = proAlts.some(function(r) { return r.alt !== null; });
      if (hasAnyProAlt) {
        md += '---\\n\\n## \\uD83D\\uDC8E Premium Upgrade Alternatives\\n\\n';
        md += '| Chosen Tool | Pricing | Premium Alternative | Pricing |\\n';
        md += '|---|---|---|---|\\n';
        proAlts.forEach(function(r) {
          var origLabel = pricingLabel(r.original.pricing);
          if (r.alt) {
            md += '| ' + r.original.name + ' | ' + origLabel + ' | **' + r.alt.name + '** | ' + pricingLabel(r.alt.pricing) + ' |\\n';
          } else {
            md += '| ' + r.original.name + ' | ' + origLabel + ' | \\u2014 (already premium) | |\\n';
          }
        });
        md += '\\n';
      }
      md += '---\\n\\n*Generated with Ressource&Apps Toolkit*\\n';
      return md;
    }

    function downloadFile(content, filename, mimeType) {
      var blob = new Blob([content], {type: mimeType});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function flashBtn(btn, origClass, successClass) {
      var origText = btn.textContent;
      btn.textContent = 'Done!';
      btn.classList.replace(origClass, 'bg-emerald-600');
      setTimeout(function() {
        btn.textContent = origText;
        btn.classList.replace('bg-emerald-600', origClass);
      }, 1500);
    }

    exportClipBtn.addEventListener('click', function() {
      if (myStack.length === 0) return;
      var md = buildExportMd();
      navigator.clipboard.writeText(md).then(function() {
        flashBtn(exportClipBtn, 'bg-blue-600');
      });
    });

    exportMdBtn.addEventListener('click', function() {
      if (myStack.length === 0) return;
      var md = buildExportMd();
      downloadFile(md, 'tech-stack.md', 'text/markdown');
      flashBtn(exportMdBtn, 'bg-purple-600');
    });

    exportTxtBtn.addEventListener('click', function() {
      if (myStack.length === 0) return;
      var md = buildExportMd();
      var txt = md.replace(/\\*\\*/g, '').replace(/\\[([^\\]]+)\\]\\([^)]+\\)/g, '$1').replace(/^#+\\s*/gm, '').replace(/^>\\s*/gm, '');
      downloadFile(txt, 'tech-stack.txt', 'text/plain');
      flashBtn(exportTxtBtn, 'bg-gray-600');
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
