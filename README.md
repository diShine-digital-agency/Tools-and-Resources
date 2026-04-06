# diShine Toolkit | Tools & Resources

**426 curated tools. Smarter utility-based matching. Branded full-stack exports in PDF, Markdown, and TXT.**

A client-ready toolkit for agencies, consultants, and digital teams. Browse the directory, build a stack, compare free and paid alternatives, and export a branded recommendation pack prepared as diShine Digital Agency.

---

## What ships now

- **Utility-first matching engine** that prioritizes the same use-case before broader same-category fallbacks
- **Full stack exports** with the chosen stack, free alternatives, and paid alternatives in every file
- **Branded outputs** in **PDF**, **Markdown**, and **TXT**
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

### Export package

Every export includes:

1. **Chosen Stack**
2. **Free Alternatives**
3. **Paid Alternatives**

The report is generated with diShine branding and can be exported as:

- **PDF** — branded downloadable report
- **Markdown** — easy to paste into proposals, docs, and Notion
- **TXT** — clean plain-text handoff

### Matching rules

The engine only searches inside the **same category**, then strongly prioritizes the **same subcategory / utility cluster**. If no strong match exists, it returns no recommendation instead of forcing a weak one.

For the technical details, see [ALGORITHM.md](ALGORITHM.md).

---

## Project structure

- `src/pages/index.astro` — main Astro experience
- `src/components/ToolCard.astro` — tool card UI
- `src/lib/toolkit-core.js` — shared matching, report, and PDF helpers
- `src/lib/toolkit-app.js` — shared browser-side stack behavior
- `src/data/tools.json` — tool dataset
- `standalone.html` — generated single-file delivery build
- `build-standalone.js` — standalone generator
- `test.js` — regression checks for matching and exports

---

## Dataset

- **426 tools**
- **21 categories**
- Structured metadata for category, subcategory, pricing, tags, learning curve, and curated `alternativeTo` relationships

---

## License

Built and maintained by [diShine Digital Agency](https://dishine.it). Licensed under the MIT License.
