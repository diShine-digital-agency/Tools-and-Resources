# diShine Toolkit | Tools & Resources

**426 curated tools. Smarter utility-based matching. Branded full-stack exports in PDF, Markdown, and TXT.**

A client-ready toolkit for agencies, consultants, and digital teams. Browse the directory, build a stack, compare free and paid alternatives, and export a branded recommendation pack prepared as diShine Digital Agency.

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [GUIDE.md](GUIDE.md) | End-user guide — browsing, stacking, exporting, and contributing tools |
| [ALGORITHM.md](ALGORITHM.md) | Technical reference for the matching engine scoring and thresholds |
| [DIRECTORY.md](DIRECTORY.md) | Static Markdown listing of all 426 tools with metadata |
| [changelog.md](changelog.md) | Release notes and version history |

---

## What ships now

- **Utility-first matching engine** that prioritizes the same use-case before broader same-category fallbacks
- **Full stack exports** with the chosen stack, free alternatives, and paid alternatives in every file
- **Branded outputs** in **PDF**, **Markdown**, and **TXT** with an in-browser **Preview**
- **Agency Playbooks** — pre-built tool stacks for common delivery scenarios
- **Shared runtime logic** across the Astro app, standalone HTML build, and regression tests
- **Improved stack UX** with pricing filters, clearer stack state, reset support, and report preview

---

## Run locally

```bash
npm install
npm run build
npm test
npm run build:standalone
```

### Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Astro app locally |
| `npm run build` | Build the Astro app |
| `npm test` | Run matching and export regression checks |
| `npm run build:standalone` | Regenerate `standalone.html` |
| `npm run preview` | Preview the production build |

---

## Product behavior

### Stack builder

- Add any tool to **My Stack**
- Switch between **Chosen stack**, **Free alternatives**, and **Paid alternatives** views
- Reset back to the original hand-picked selection at any time
- Add optional client notes before export

### Agency Playbooks

Pre-built tool stacks for common delivery scenarios are available on the main page. Each playbook includes a curated set of tools that work well together for a specific workflow, such as privacy-focused analytics, bootstrap agency delivery, or SEO-driven content pipelines.

### Export package

Every export includes:

1. **Chosen Stack**
2. **Free Alternatives**
3. **Paid Alternatives**

The report is generated with diShine branding and can be delivered as:

- **Preview** — view the branded HTML report in-browser before downloading
- **PDF** — branded downloadable report
- **Markdown** — easy to paste into proposals, docs, and Notion
- **TXT** — clean plain-text handoff

### Matching rules

The engine only searches inside the **same category**, then strongly prioritizes the **same subcategory / utility cluster**. If no strong match exists, it returns no recommendation instead of forcing a weak one.

For the technical details, see [ALGORITHM.md](ALGORITHM.md).

---

## Project structure

### Application

- `src/pages/index.astro` — main Astro experience
- `src/components/ToolCard.astro` — tool card UI
- `src/layouts/Layout.astro` — shared HTML layout with header and footer
- `src/styles/global.css` — global stylesheet
- `src/lib/toolkit-core.js` — shared matching, report, PDF, and HTML helpers
- `src/lib/toolkit-app.js` — shared browser-side stack behavior

### Data

- `src/data/tools.json` — tool dataset (426 entries)
- `src/data/stacks.json` — Agency Playbook definitions

### Build & test

- `build-standalone.js` — standalone HTML generator
- `build-md.js` — DIRECTORY.md generator
- `test.js` — regression checks for matching and exports

### Generated outputs

- `standalone.html` — generated single-file delivery build
- `DIRECTORY.md` — generated Markdown tool directory

### Utilities

- `parse.js` — data parsing helpers
- `add-fmhy.js` / `add-fmhy-bulk.js` — import helpers for external tool lists

---

## Dataset

- **426 tools** across **21 categories** and **63 subcategories**
- **11 agency picks** (curated top recommendations)
- **46 curated `alternativeTo` relationships** for direct competitor matching
- Pricing distribution: 89 free · 106 open-source · 92 freemium · 139 paid
- Structured metadata for category, subcategory, pricing, tags, learning curve, and curated relationships

---

## License

Built and maintained by [diShine Digital Agency](https://dishine.it). Licensed under the [CC0 1.0 Universal](LICENSE) license.
