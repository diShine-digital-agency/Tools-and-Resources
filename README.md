# Ressource&Apps Toolkit | Your Tech Stack Companion

**422 digital tools. 4-tier pricing. Intelligent alternative matching (v1.4). One HTML file.**

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

## How the Matching Algorithm Works

The alternative engine uses a **multi-signal weighted scoring system** to find the most relevant replacement for any tool, respecting functional purpose rather than just broad category.

### The problem it solves

A naive approach would match tools by category alone. But categories are broad: "Video & Audio" contains screen recorders, video editors, and podcast platforms -- tools that serve completely different purposes. Matching Loom (screen recording) to DaVinci Resolve (video editing) is technically same-category but functionally useless.

### Data model

Every tool carries structured metadata:

| Field | Example | Role in matching |
|-------|---------|-----------------|
| `category` | Video & Audio | Broad grouping (27 categories) |
| `subCategory` | Screen Recording | Functional cluster within category |
| `tags` | `["AI", "Design"]` | Semantic descriptors |
| `pricing` | `freemium` | One of: `free`, `freemium`, `open-source`, `paid` |
| `alternativeTo` | `Loom` | Explicit human-curated alternative link |

### Scoring pipeline

For a given tool T and a pricing target (free or paid), the algorithm runs in three phases:

**Phase 1 -- Explicit match (instant return)**

If any tool in the database has an `alternativeTo` field pointing to T (or vice versa) _and_ matches the target pricing, return it immediately. This handles curated pairs like Ahrefs/Semrush or Figma/Penpot.

**Phase 2 -- Same-category candidate pool**

Filter all tools that match the target pricing constraint and share the same `category` as T. If this pool is empty, fall back to all tools matching the pricing constraint (cross-category).

**Phase 3 -- Weighted scoring**

Each candidate C is scored against T:

| Signal | Condition | Points | Rationale |
|--------|-----------|--------|-----------|
| **Exact subCategory** | `C.sub === T.sub` | **+50** | Same functional cluster = strongest signal |
| **Same category, different sub** | `C.cat === T.cat && C.sub !== T.sub` | **+5** | Related but different purpose |
| **Same category, no sub data** | `C.cat === T.cat && (!C.sub \|\| !T.sub)` | **+15** | Category match without sub-specificity |
| **Tag overlap** | Each shared tag | **+10 each** | Semantic similarity (e.g., both tagged "AI") |
| **SubCategory keyword overlap** | Shared words > 5 chars between sub names (same category only) | **+20 each** | Catches partial sub matches like "Video Creation" vs "Video Editing" |

The candidate with the highest score wins. If the best score is below **5**, no alternative is returned (prevents nonsensical cross-category matches).

### Score examples

| Tool | Target | Winner | Score breakdown |
|------|--------|--------|----------------|
| Loom (Screen Recording) | Free | OBS Studio (Screen Recording) | sub=+50 |
| Canva (Design Platforms) | Paid | Adobe Creative Cloud (Design Platforms) | sub=+50 |
| Ahrefs (Keyword Research) | Free | Keyword Surfer (Keyword Research) | sub=+50 |
| Mailchimp (Email Marketing) | Free | Listmonk (Email Marketing) | sub=+50 |
| Buffer (Mgmt & Scheduling) | Paid | Hootsuite (Mgmt & Scheduling) | sub=+50, keyword "Scheduling"=+20 |
| Notion (Project Mgmt) | Free | AppFlowy (same cat, no sub) | cat=+15 |

### Graceful degradation

When no good alternative exists in the database (e.g., no paid-only Communication tool for Slack), the algorithm returns `null` and the export table shows "-- (already free/OS)" or "-- (already premium)" rather than forcing a bad match.

---

## Dataset

`src/data/tools.json` -- 422 tools across 27 categories and 60+ subcategories.

### Pricing tiers

| Tier | Count | Definition |
|------|-------|------------|
| **Free** | 90 | No paid plan exists at all |
| **Freemium** | 94 | Functional free tier with paid upgrades |
| **Open Source** | 112 | Source code is public, self-hostable |
| **Paid** | 126 | No free tier -- subscription or license only |

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
