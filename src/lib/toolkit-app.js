import {
  BRAND_CONFIG,
  buildHtmlReport,
  buildMarkdownReport,
  buildPdfBytes,
  buildReportModel,
  buildTextReport,
  getPricingMeta,
  normalizeTools,
} from './toolkit-core.js';

function cloneStack(stack = []) {
  return stack.map((tool) => ({ ...tool, tags: Array.isArray(tool.tags) ? [...tool.tags] : [] }));
}

function downloadText(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadBytes(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function flashButton(button, originalClass) {
  if (!button) return;
  const originalText = button.innerHTML;
  button.innerHTML = 'Done';
  button.classList.replace(originalClass, 'bg-emerald-600');
  setTimeout(() => {
    button.innerHTML = originalText;
    button.classList.replace('bg-emerald-600', originalClass);
  }, 1500);
}

function setStackButtonState(button, active) {
  if (!button) return;
  if (active) {
    button.textContent = '− Remove';
    button.className = 'add-to-stack flex-shrink-0 text-xs bg-red-900/40 hover:bg-red-600 text-red-300 px-2 py-1.5 rounded border border-red-800/60 transition-colors font-medium shadow-sm';
  } else {
    button.textContent = '+ Stack';
    button.className = 'add-to-stack flex-shrink-0 text-xs bg-blue-900/40 hover:bg-blue-600 text-blue-300 px-2 py-1.5 rounded border border-blue-800/60 transition-colors font-medium shadow-sm';
  }
}

export function initToolkitApp({ tools = [], brand = BRAND_CONFIG } = {}) {
  const allTools = normalizeTools(tools);

  const searchInput = document.getElementById('searchInput');
  const sections = document.querySelectorAll('.category-section');
  const tagBadges = document.querySelectorAll('.tag-badge');
  const stackItemsContainer = document.getElementById('stackItems');
  const emptyStackMsg = document.getElementById('emptyStackMsg');
  const stackCounter = document.getElementById('stackCounter');
  const stackSummary = document.getElementById('stackSummary');
  const stackStatus = document.getElementById('stackStatus');
  const stackNotes = document.getElementById('stackNotes');
  const resetButton = document.getElementById('btnResetStack');
  const exportButtons = Array.from(document.querySelectorAll('.export-btn'));
  const filterButtons = Array.from(document.querySelectorAll('.pricing-filter'));
  const addButtons = Array.from(document.querySelectorAll('.add-to-stack'));

  const state = {
    myStack: [],
    originalStack: [],
    activeView: 'original',
    currentTagFilter: '',
    activePricingFilter: 'all',
  };

  function resetAlternativeContext() {
    state.originalStack = [];
    state.activeView = 'original';
  }

  function getBaseStack() {
    return state.originalStack.length > 0 ? state.originalStack : state.myStack;
  }

  function syncButtons() {
    const selected = new Set(state.myStack.map((tool) => tool.id));
    addButtons.forEach((button) => {
      try {
        const tool = JSON.parse(button.dataset.tool || '{}');
        setStackButtonState(button, selected.has(tool.id));
      } catch {
        setStackButtonState(button, false);
      }
    });
  }

  function updateStackSummary() {
    if (!stackSummary || !stackStatus) return;
    if (state.myStack.length === 0) {
      stackSummary.textContent = 'Build a stack and export the chosen tools plus both alternative views.';
      stackStatus.textContent = 'Ready for discovery';
      stackStatus.className = 'text-[11px] font-semibold text-gray-500';
      return;
    }

    const counts = { free: 0, freemium: 0, 'open-source': 0, paid: 0 };
    state.myStack.forEach((tool) => {
      counts[tool.pricing] = (counts[tool.pricing] || 0) + 1;
    });

    const parts = [];
    if (counts.free) parts.push(`${counts.free} free`);
    if (counts['open-source']) parts.push(`${counts['open-source']} OS`);
    if (counts.freemium) parts.push(`${counts.freemium} freemium`);
    if (counts.paid) parts.push(`${counts.paid} paid`);
    stackSummary.textContent = parts.join(' / ');

    const viewMap = {
      original: {
        label: 'Chosen stack view',
        className: 'text-[11px] font-semibold text-blue-300',
      },
      free: {
        label: 'Viewing free alternatives',
        className: 'text-[11px] font-semibold text-emerald-300',
      },
      paid: {
        label: 'Viewing paid alternatives',
        className: 'text-[11px] font-semibold text-purple-300',
      },
    };

    stackStatus.textContent = viewMap[state.activeView].label;
    stackStatus.className = viewMap[state.activeView].className;
  }

  function toggleExportState(disabled) {
    exportButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function renderStack() {
    if (!stackItemsContainer || !emptyStackMsg || !stackCounter) return;

    stackCounter.textContent = String(state.myStack.length);
    stackItemsContainer.querySelectorAll('.stack-item').forEach((element) => element.remove());

    if (state.myStack.length === 0) {
      emptyStackMsg.style.display = 'block';
      toggleExportState(true);
      if (resetButton) resetButton.style.display = 'none';
      updateStackSummary();
      syncButtons();
      return;
    }

    emptyStackMsg.style.display = 'none';
    toggleExportState(false);
    if (resetButton) resetButton.style.display = state.originalStack.length > 0 ? 'block' : 'none';

    if (state.activeView !== 'original') {
      const viewLabel = document.createElement('div');
      const stateStyles = state.activeView === 'free'
        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50'
        : 'bg-purple-900/40 text-purple-300 border-purple-800/50';
      viewLabel.className = `stack-item text-[11px] text-center font-bold rounded-md p-2 border ${stateStyles}`;
      viewLabel.textContent = state.activeView === 'free' ? '🍏 Free alternatives preview' : '💎 Paid alternatives preview';
      stackItemsContainer.appendChild(viewLabel);
    }

    state.myStack.forEach((tool, index) => {
      const pricing = getPricingMeta(tool.pricing);
      const item = document.createElement('article');
      item.className = 'stack-item p-3 bg-[#161b22] border border-gray-700/50 rounded-lg flex justify-between items-start gap-3 shadow-sm';
      item.innerHTML = `
        <div class="min-w-0">
          <h4 class="text-sm font-semibold text-blue-300 leading-tight break-words">${tool.name} <span class="text-xs">${pricing.icon}</span></h4>
          <p class="mt-1 text-[11px] text-gray-400">${pricing.label}${tool.sub ? ` · ${tool.sub}` : ''}</p>
          <span class="mt-2 inline-flex text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-full">${tool.cat}</span>
        </div>
        <button class="remove-btn flex-shrink-0 text-gray-500 hover:text-red-400 text-xs font-bold p-1 transition-colors" data-idx="${index}" aria-label="Remove ${tool.name} from stack">✕</button>
      `;
      stackItemsContainer.appendChild(item);
    });

    stackItemsContainer.querySelectorAll('.remove-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const target = event.currentTarget;
        const index = Number(target?.dataset.idx || -1);
        if (index < 0) return;
        state.myStack.splice(index, 1);
        resetAlternativeContext();
        renderStack();
      });
    });

    updateStackSummary();
    syncButtons();
  }

  function swapStack(mode) {
    if (state.myStack.length === 0) return;
    if (state.originalStack.length === 0) {
      state.originalStack = cloneStack(state.myStack);
    }

    const report = buildReportModel({ stack: state.originalStack, allTools, brand });
    const rows = mode === 'free' ? report.freeRows : report.paidRows;
    state.activeView = mode;
    state.myStack = rows.map((row) => (row.alternative ? { ...row.alternative } : { ...row.original }));
    renderStack();
  }

  function handleStackToggle(rawTool) {
    const tool = allTools.find((item) => item.id === rawTool.id);
    if (!tool) return;
    const index = state.myStack.findIndex((item) => item.id === tool.id);
    if (index >= 0) {
      state.myStack.splice(index, 1);
    } else {
      state.myStack.push({ ...tool });
    }
    resetAlternativeContext();
    renderStack();
  }

  function buildExportModel() {
    return buildReportModel({
      stack: getBaseStack(),
      allTools,
      notes: stackNotes?.value || '',
      brand,
    });
  }

  function handlePdfExport(button) {
    if (state.myStack.length === 0) return;
    const bytes = buildPdfBytes(buildExportModel());
    downloadBytes(bytes, `${brand.exportBaseName}.pdf`, 'application/pdf');
    flashButton(button, 'bg-rose-600');
  }

  function handleMarkdownExport(button) {
    if (state.myStack.length === 0) return;
    const markdown = buildMarkdownReport(buildExportModel());
    downloadText(markdown, `${brand.exportBaseName}.md`, 'text/markdown');
    flashButton(button, 'bg-blue-600');
  }

  function handleTextExport(button) {
    if (state.myStack.length === 0) return;
    const text = buildTextReport(buildExportModel());
    downloadText(text, `${brand.exportBaseName}.txt`, 'text/plain');
    flashButton(button, 'bg-gray-600');
  }

  function handlePreviewExport() {
    if (state.myStack.length === 0) return;
    const html = buildHtmlReport(buildExportModel());
    const preview = window.open('', '_blank', 'noopener,noreferrer');
    if (!preview) return;
    preview.document.open();
    preview.document.write(html);
    preview.document.close();
  }

  function filterTools() {
    if (state.currentTagFilter && searchInput) {
      searchInput.value = `#${state.currentTagFilter}`;
    }

    const term = (searchInput?.value || '').toLowerCase().replace('#', '').trim();

    sections.forEach((section) => {
      let sectionHasMatch = false;
      section.querySelectorAll('.tool-card').forEach((cardElement) => {
        const card = cardElement;
        const matchText = !term || [
          card.dataset.name,
          card.dataset.desc,
          card.dataset.tags,
          card.dataset.category,
          card.dataset.subcategory,
        ].some((value) => (value || '').includes(term));
        const matchPricing = state.activePricingFilter === 'all' || card.dataset.pricing === state.activePricingFilter;

        if (matchText && matchPricing) {
          card.style.display = 'flex';
          sectionHasMatch = true;
        } else {
          card.style.display = 'none';
        }
      });

      if (term || state.activePricingFilter !== 'all') {
        section.open = sectionHasMatch;
      }
      section.style.display = sectionHasMatch ? 'block' : 'none';
    });
  }

  addButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.currentTarget;
      try {
        const rawTool = JSON.parse(target.dataset.tool || '{}');
        handleStackToggle(rawTool);
      } catch {
        // noop
      }
    });
  });

  document.getElementById('btnConvertFree')?.addEventListener('click', () => swapStack('free'));
  document.getElementById('btnConvertPro')?.addEventListener('click', () => swapStack('paid'));
  resetButton?.addEventListener('click', () => {
    if (state.originalStack.length === 0) return;
    state.myStack = cloneStack(state.originalStack);
    resetAlternativeContext();
    renderStack();
  });

  document.getElementById('exportPdfBtn')?.addEventListener('click', (event) => handlePdfExport(event.currentTarget));
  document.getElementById('exportMdBtn')?.addEventListener('click', (event) => handleMarkdownExport(event.currentTarget));
  document.getElementById('exportTxtBtn')?.addEventListener('click', (event) => handleTextExport(event.currentTarget));
  document.getElementById('previewReportBtn')?.addEventListener('click', handlePreviewExport);

  filterButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const target = event.currentTarget;
      filterButtons.forEach((item) => {
        item.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-500');
        item.classList.add('bg-[#0f1115]');
      });
      target.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-500');
      target.classList.remove('bg-[#0f1115]');
      state.activePricingFilter = target.dataset.pricing || 'all';
      filterTools();
    });
  });

  searchInput?.addEventListener('input', () => {
    state.currentTagFilter = '';
    filterTools();
  });

  tagBadges.forEach((badge) => {
    badge.addEventListener('click', (event) => {
      const tag = event.currentTarget?.dataset.tag || '';
      state.currentTagFilter = state.currentTagFilter === tag ? '' : tag;
      if (!state.currentTagFilter && searchInput) searchInput.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      filterTools();
    });
  });

  renderStack();
}
