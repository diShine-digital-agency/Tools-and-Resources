# User Guide: diShine Toolkit

A practical guide to the **426-tool** diShine digital toolkit.

> See also: [README](README.md) · [ALGORITHM.md](ALGORITHM.md) · [DIRECTORY.md](DIRECTORY.md) · [changelog.md](changelog.md)

---

## 1. Interactive Access (No Code Required)

Double-click **`standalone.html`** to open the full toolkit in any browser. No install, no server, works offline.

### Browsing

- **Search bar** — type any keyword to filter by name, description, subcategory, or tags.
- **Tag badges** — click any `#tag` on a tool card to filter the entire directory by that tag. Click again to clear.
- **Pricing filter bar** — five buttons at the top: **All / Free / Freemium / Open Source / Paid**. Each shows an exact count. Click to filter instantly.
- **Accordions** — categories are collapsed by default. Click to open, click again to close. When searching or filtering, matching categories auto-expand.

### Agency Playbooks

Below the search area, the **Agency Playbooks** section provides quick-start tool stacks for common delivery scenarios such as privacy-focused analytics, zero-cost agency launches, or SEO-driven content pipelines. Each playbook lists the recommended tools at a glance.

### Stack Builder

Every tool card has a **`+ Stack`** button. Click to add tools to the "My Stack" sidebar on the right.

- **Toggle add/remove**: once a tool is in your stack, the button turns red and reads **`− Remove`**. Click to remove directly from the card.
- **Sidebar remove**: each item in the stack sidebar has a **✕** button.
- **Pricing summary**: the sidebar shows a live breakdown like `2 free / 1 OS / 3 freemium / 1 paid`.
- **Status indicator**: the sidebar header shows the current view state — chosen stack, free alternatives, or paid alternatives.

### Alternative Matching

Three action buttons in the sidebar header transform your stack:

| Button | Action |
|--------|--------|
| **Free Alts** | Replaces paid and freemium tools with the best free or open-source match |
| **Paid Alts** | Replaces free and freemium tools with the best paid premium match |
| **Reset** | Appears after any swap — restores your original hand-picked stack |

The algorithm uses a multi-signal weighted scoring system. It prioritizes tools in the **same subcategory** (e.g., Screen Recording, Audio & Podcasting) over broad category matches, so a screen recorder gets matched with another screen recorder — not a video editor. See **[ALGORITHM.md](ALGORITHM.md)** for the full scoring pipeline, weight rationale, and quality metrics.

Your original stack is always preserved in memory. Swapping to free alts or paid alternatives changes the view but never destroys your picks. Click **Reset** to return.

### Export (4 formats)

Four export buttons at the bottom of the sidebar:

| Button | Format | Output |
|--------|--------|--------|
| **Preview** (slate) | HTML report in a new browser tab | Review the branded report before downloading |
| **PDF** (red) | PDF file download | `diShine-tool-stack.pdf` — branded downloadable report |
| **Markdown** (blue) | Markdown file download | `diShine-tool-stack.md` — paste into proposals, docs, or Notion |
| **TXT** (gray) | Plain text file download | `diShine-tool-stack.txt` — stripped of all Markdown syntax |

All four generate the same consulting report with three sections:

1. **Chosen Stack** — your original hand-picked tools, grouped by category with pricing labels and links
2. **Free Alternatives** — a comparison table: each of your tools alongside the algorithm's best free/open-source match
3. **Paid Alternatives** — a comparison table: each tool alongside the best paid alternative

Add an optional client note in the textarea before exporting. Each row includes a **"Why it fits"** explanation based on the matching signals (shared subcategory, tags, or agency pick status). The `.txt` version strips bold markers, link syntax, and headings for clean pasting into emails or plain-text contexts.

---

## 2. Text-Only Access

Open **[`DIRECTORY.md`](DIRECTORY.md)** for a static Markdown list of all 426 tools with categories, descriptions, pricing, learning curves, and tags.

---

## 3. Developer Access (Astro Site)

### Prerequisites

[Node.js](https://nodejs.org) v22+ (see `engines` in `package.json`).

### Setup

```bash
git clone https://github.com/diShine-digital-agency/Tools-and-Resources.git
cd Tools-and-Resources
npm install
npm run dev
```

Open `http://localhost:4321`.

### Build & test scripts

| Script | Output | Purpose |
|--------|--------|---------|
| `npm run build` | `dist/` | Build the Astro production site |
| `npm test` | console | Run matching quality and export regression checks |
| `npm run build:standalone` | `standalone.html` | Regenerate the interactive single-file toolkit |
| `node build-md.js` | `DIRECTORY.md` | Regenerate the Markdown directory |

After modifying `src/data/tools.json`, run both `npm run build:standalone` and `node build-md.js` to keep generated outputs in sync.

---

## Contributing a Tool

1. Open `src/data/tools.json`
2. Add a new object:
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
3. Run `npm run build:standalone && node build-md.js && npm test`
4. Commit the updated outputs.

### Pricing field values

| Value | Meaning |
|-------|---------|
| `free` | Completely free, no paid plan exists |
| `freemium` | Free tier available, paid upgrades exist |
| `open-source` | Source code is public, self-hostable |
| `paid` | No free tier, subscription or license only |

### Tips for good alternative matching

- Always set `subCategory` — this is the strongest matching signal (+120 points)
- Add relevant `tags` — each shared tag adds +12 points
- Set `alternativeTo` for direct competitor pairs — these get matched instantly before scoring
- Use existing subcategory names when possible to maximize exact-subcategory matching
- Run `npm test` after adding tools to verify match quality stays above the 78% same-subcategory threshold

---

*Built by [diShine Digital Agency](https://dishine.it)*
