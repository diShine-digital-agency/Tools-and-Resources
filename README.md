# Ressource&Apps Toolkit | Your Tech Stack Companion

**426 digital tools. 4-tier pricing. Intelligent alternative matching (v1.4). One HTML file.**

Tool / Repo in corso di sviluppo.

An interactive toolkit for companies, agencies, consultants, and digital teams. Browse, filter, build tech stacks, and export client-ready reports in Markdown or plain text -- all offline, all in a single HTML file with zero dependencies.

---

## 3 Ways to Access

### 1. Standalone HTML (Recommended)

Open **[`standalone.html`](standalone.html)** in any browser. No install, no server, works offline.

- **Search & filter** 422 tools by name, tags, description, and pricing tier
- **Click any tag** to instantly filter the directory
- **4-tier pricing filters**: Free / Freemium / Open Source / Paid -- with exact counts
- **Collapsible accordions** per category (closed by default)

### 2. Markdown Directory

Open **[`DIRECTORY.md`](DIRECTORY.md)** for a clean, scrollable text list of every tool with categories, descriptions, and pricing.

### 3. Astro Dev Server

```bash
npm install && npm run dev
```

Full static site at `http://localhost:4321`. See [GUIDE.md](GUIDE.md) for details.

---

## The Stack Builder

The right sidebar turns the toolkit from a directory into a consulting instrument.

### Building a stack

Click **`+ Stack`** on any tool card to add it. The button toggles to **`- Remove`** (red) so you can remove directly from the card. The sidebar shows a live pricing breakdown (`2 free / 1 OS / 3 freemium / 1 paid`).

### Alternative matching

Two buttons transform your stack:

| Button | What it does |
|--------|-------------|
| **Free Alts** | Replaces paid/freemium tools with free or open-source alternatives |
| **Upgrade** | Replaces free/freemium tools with premium paid alternatives |
| **Reset** | Appears after any swap -- restores your original hand-picked stack |

Your original stack is preserved in memory. Clicking **Free Alts** or **Upgrade** swaps the view but never destroys your selections. Click **Reset** to go back.

### Three export formats

Three buttons at the bottom of the sidebar:

| Button | Action |
|--------|--------|
| **Copy** | Copies the full Markdown report to clipboard |
| **.md** | Downloads a `tech-stack.md` file |
| **.txt** | Downloads a `tech-stack.txt` file (stripped of Markdown syntax) |

All three generate a consulting report with three sections:

1. **Chosen Stack** -- your original hand-picked tools, grouped by category
2. **Free & Open-Source Alternatives** -- a comparison table showing each tool alongside its best free/OS match
3. **Premium Upgrade Alternatives** -- a comparison table showing each tool alongside its best paid match

The report includes pricing labels, category groupings, clickable links, and a footer. The `.txt` version strips all Markdown formatting (bold, links, headings) for pasting into plain-text contexts. Ready to paste into a proposal, Notion page, or client email.

---

## Matching Algorithm

The alternative engine uses a **multi-signal weighted scoring system** with 5 signals (subCategory match +50, tag overlap +10 each, keyword overlap +20, category fallback +5/+15) and a minimum score threshold of 5. It only searches within the same category — no cross-category fallback, no forced bad matches.

**Current quality (v1.4):** 79.9% exact subcategory match, 15.1% same-category, 0.2% cross-category, 4.7% graceful null.

For the full scoring pipeline, weight rationale, concentration analysis, quality evolution, and data architecture: **[ALGORITHM.md](ALGORITHM.md)**

---

## Dataset

`src/data/tools.json` -- 426 tools across 21 categories and 60+ subcategories.

### Match quality (v1.4)

Tested against the full dataset (426 tools x 2 modes = 852 match attempts):

| Quality | Count | % |
|---------|-------|---|
| Good (same subCategory) | 681 | 79.9% |
| Acceptable (same category) | 129 | 15.1% |
| Cross-category | 2 | 0.2% |
| Null (no match exists) | 40 | 4.7% |

The 2 cross-category matches are Hunter.io (intentionally listed in two categories). The 40 nulls are legitimate data gaps (no free ad platforms, no paid browsers, etc.).

### Pricing tiers

| Tier | Count | Definition |
|------|-------|------------|
| **Free** | ~85 | No paid plan exists at all |
| **Freemium** | ~93 | Free tier available, paid upgrades exist |
| **Open Source** | ~107 | Source code is public, self-hostable |
| **Paid** | ~141 | No free tier -- subscription or license only |

### Sources

- Agency field experience across 50+ client engagements
- [FMHY compendium](https://fmhy.pages.dev/) for privacy, self-hosted, and open-source tools
- Manual verification of every pricing classification

---

## Contributing

1. Open `src/data/tools.json`
2. Add a tool object:
   ```json
   {
     "name": "Tool Name",
     "url": "https://example.com",
     "category": "Category Name",
     "subCategory": "SubCategory Name",
     "type": "[F]",
     "description": "What it does.",
     "learningCurve": "Easy",
     "agencyPick": false,
     "alternativeTo": "",
     "isFree": true,
     "isOpenSource": false,
     "tags": ["tag1", "tag2"],
     "pricing": "free"
   }
   ```
3. Run `node build-standalone.js` and `node build-md.js` to regenerate outputs.

> See [GUIDE.md](GUIDE.md) for detailed development instructions.

---

## License

Built and maintained by Kevin Escoda | [diShine Digital Agency](https://dishine.it). Licensed under the MIT License.
