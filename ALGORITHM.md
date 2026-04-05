# Matching Engine — Technical Reference

A deep dive into how the Ressource&Apps Toolkit finds intelligent alternatives for any tool in the database.

---

## The Problem

Digital agencies juggle hundreds of tools across marketing, development, analytics, design, and operations. When building a client tech stack, two recurring questions come up:

1. **"Is there a free alternative to this?"** — the client has budget constraints, or the agency wants to propose an open-source-first approach.
2. **"What's the premium upgrade?"** — the free tool works, but the client needs enterprise features, SLA guarantees, or dedicated support.

A naive approach would match tools by category. But categories are broad. "Video & Audio" contains screen recorders (Loom, OBS), video editors (DaVinci Resolve, Adobe Premiere), and podcast platforms (Audacity, Riverside.fm). Matching Loom to DaVinci Resolve is same-category but functionally useless — one records screens, the other edits cinema-grade video.

The matching engine solves this by using **multiple weighted signals** to find alternatives that actually serve the same purpose.

---

## Data Architecture

Every tool in `tools.json` carries structured metadata that feeds the matching engine:

```
{
  "name": "Loom",
  "category": "Video & Audio",              ← broad grouping (21 categories)
  "subCategory": "Screen Recording",        ← functional cluster (60+ subcategories)
  "tags": ["Video", "Communication"],        ← semantic descriptors
  "pricing": "freemium",                     ← free | freemium | open-source | paid
  "alternativeTo": "",                       ← explicit human-curated link
  "isFree": false,
  "isOpenSource": false
}
```

### Why subCategory matters

The `subCategory` field is the single most important matching signal. It groups tools by **what they actually do**, not just what industry they belong to.

Examples within the "Web Development" category:

| subCategory | Purpose | Example tools |
|-------------|---------|---------------|
| Frameworks & CMS | Build websites | Next.js, WordPress, Shopify |
| Frontend Utilities | UI components and CSS | Tailwind CSS, shadcn/ui |
| Testing & Monitoring | Quality assurance | Playwright, Datadog, BrowserStack |
| APIs & Backend | Server-side infrastructure | Supabase, Firebase, PocketBase |

Without subCategory, a request for "paid alternative to Next.js" would scan all 40+ Web Development tools and pick whichever has the highest tag overlap — potentially a testing tool or a CDN. With subCategory, it immediately narrows to Frameworks & CMS and returns Shopify or Webflow.

### Tag system

Tags provide semantic dimensionality beyond category/subcategory. They capture cross-cutting concerns:

- `AI` — tools with artificial intelligence capabilities
- `OSS` — open-source projects
- `Enterprise` — tools designed for large organizations
- `Self-Hosted` — can be deployed on your own infrastructure
- `DevTools` — developer-oriented utilities

Two tools in different subcategories but sharing tags like `["AI", "Marketing"]` get a scoring bonus, making the match more relevant when an exact subcategory match isn't available.

### The `alternativeTo` field

A curated, human-verified relationship between two tools. When set, it creates a **hard link** that bypasses the scoring algorithm entirely. Examples:

- Penpot → `alternativeTo: "Figma"` (open-source design tool vs. commercial leader)
- Listmonk → `alternativeTo: "Mailchimp"` (self-hosted email vs. SaaS email)
- 7-Zip → `alternativeTo: "WinRAR"` (free archiver vs. paid archiver)

These relationships are one-directional by convention: the challenger tool points to the incumbent it replaces.

---

## The Scoring Pipeline

Given a source tool **T** and a target pricing mode (`free` or `paid`), the engine runs in three sequential phases.

### Phase 1 — Explicit match (O(n), instant return)

```
for each tool C in database:
  if C.pricing matches target
  AND C.name ≠ T.name
  AND (C.alternativeTo = T.name OR T.alternativeTo = C.name):
    → return C immediately
```

This handles curated pairs. If Figma asks for a free alternative and Penpot's `alternativeTo` points to Figma, Penpot is returned without scoring.

**Time complexity:** O(n) single pass, but returns on first match.

### Phase 2 — Candidate pool construction

```
candidates = all tools where:
  - pricing matches target (free/OS for "free" mode, paid for "paid" mode)
  - name ≠ T.name
  - category = T.category        ← SAME CATEGORY ONLY
```

If this pool is empty, the engine returns `null`. It does **not** fall back to cross-category search.

**Design decision:** Earlier versions included a cross-category fallback that searched all 426 tools when no same-category match existed. This caused absurd matches (WinRAR as premium alternative to Next.js, Codeium as free alternative to advertising platforms). Removing the fallback increased null results from 2.0% to 4.7%, but eliminated 100% of nonsensical recommendations. The export report handles nulls gracefully by showing "— no match found" instead of a forced bad suggestion.

### Phase 3 — Weighted scoring

Each candidate **C** is scored against source **T** using five signals:

```
score = 0

// Signal 1: Exact subCategory match (strongest)
if T.sub AND C.sub AND C.sub = T.sub:
  score += 50

// Signal 2: Same category, different subCategory (weak positive)
else if C.cat = T.cat AND T.sub AND C.sub AND C.sub ≠ T.sub:
  score += 5

// Signal 3: Same category, missing sub data (moderate)
else if C.cat = T.cat:
  score += 15

// Signal 4: Tag overlap (additive)
for each tag in C.tags:
  if tag exists in T.tags:
    score += 10

// Signal 5: SubCategory keyword overlap (same-category only)
if T.sub AND C.sub AND C.cat = T.cat:
  for each word W in T.sub (where len(W) > 5):
    if W appears in C.sub:
      score += 20
```

The candidate with the highest score wins. If the best score is **below 5**, the engine returns `null` (prevents low-confidence matches).

### Weight rationale

| Signal | Weight | Why this value |
|--------|--------|----------------|
| Exact subCategory | +50 | Two tools in the same subcategory serve the same function by definition. This should dominate all other signals. |
| Different subCategory | +5 | Same category provides some relevance, but tools in different subcategories often serve very different purposes. Low weight prevents false positives. |
| No sub data | +15 | When subcategory data is missing, category match is the best available signal. Weighted between exact-sub and different-sub. |
| Tag overlap | +10 each | Tags capture semantic similarity. Two tools sharing 3 tags (+30) should outweigh a different-subcategory match (+5) but not an exact-subcategory match (+50). |
| Keyword overlap | +20 each | Catches partial subcategory matches. "Video Creation & Editing" and "Video Creation" share the word "Creation" (+20). Only applies within same category to prevent false cross-category matches like "Management & Scheduling" matching "Tag Management". |

### Minimum word length for keyword matching

SubCategory keywords must be longer than 5 characters to qualify for overlap scoring. This prevents common short words from creating false matches:

- ✅ `"Editing"` (7 chars) — meaningful functional word
- ✅ `"Recording"` (9 chars) — meaningful functional word
- ❌ `"&"` (1 char) — conjunction, no meaning
- ❌ `"Tools"` (5 chars) — too generic

### Minimum score threshold

If the best candidate scores below 5, the engine returns `null`. This threshold sits just below the weakest positive signal (same-category-different-sub at +5), meaning:

- A same-category tool with zero tag overlap still passes (score = 5)
- A tool with nothing in common fails (score = 0)

---

## Score Examples

### Perfect matches (score ≥ 50)

| Source | Target | Winner | Score | Breakdown |
|--------|--------|--------|-------|-----------|
| Loom (Screen Recording) | free | OBS Studio | 50 | sub=+50 |
| Figma (Design Platforms) | paid | Adobe Creative Cloud | 50 | sub=+50 |
| Ahrefs (Keyword Research) | free | Keyword Surfer | 50 | sub=+50 |
| Supabase (APIs & Backend) | paid | Firebase | 60 | sub=+50, tags(DevTools)=+10 |
| Tailwind CSS (Frontend Utilities) | paid | Tailwind UI | 70 | sub=+50, tags(DevTools,CSS)=+20 |

### Good matches (score 15-49)

| Source | Target | Winner | Score | Breakdown |
|--------|--------|--------|-------|-----------|
| Notion (Project Management) | free | AppFlowy (Documentation) | 15 | cat=+5, tags(Productivity)=+10 |
| Slack (Communication) | paid | Zoom (Communication) | 50 | sub=+50 |
| WordPress (Frameworks & CMS) | paid | Shopify (Frameworks & CMS) | 60 | sub=+50, tags(CMS)=+10 |

### Graceful nulls

| Source | Target | Result | Why |
|--------|--------|--------|-----|
| Google Ads (Ad Platforms) | free | null | No free ad platform exists |
| Bitwarden (Password Mgmt) | paid | null | No paid password manager in database |
| Firefox (Web Browsers) | paid | null | No paid browser in database |

---

## Concentration Analysis

"Concentration" measures how often a single tool appears as the recommended alternative. High concentration isn't inherently bad — it often means a tool is genuinely the best option in its niche. But extreme concentration can indicate a data gap.

### Current top recommendations (v1.4)

| Tool | Times recommended | Mode | Why |
|------|-------------------|------|-----|
| Cookiebot | 19x | paid | Only paid consent management tool — all others are free/OS |
| Codeium | 18x | free | Only free AI coding tool — alternatives to Copilot, Cursor, etc. |
| Coolify | 18x | free | Strong open-source hosting alt — matches many deployment tools |
| Adobe Creative Cloud | 16x | paid | Dominant paid design platform |
| ActiveCampaign | 14x | paid | Dominant paid email marketing tool |

These concentrations are all **legitimate** — each tool genuinely is the best-in-category alternative. Compare to the pre-fix state where WinRAR appeared 34 times as a paid alternative for web frameworks, which was a data/algorithm bug.

---

## Quality Metrics (v1.4)

Tested against the full 426-tool dataset (852 match attempts: 426 tools × 2 modes):

| Quality Level | Count | Percentage | Definition |
|---------------|-------|------------|------------|
| **Good** | 681 | **79.9%** | Alternative is in the same subCategory |
| **Acceptable** | 129 | **15.1%** | Same category, different subCategory |
| **Cross-category** | 2 | **0.2%** | Different category (only Hunter.io, intentional) |
| **Null** | 40 | **4.7%** | No match exists in the database |

### Evolution

| Version | Good | Acceptable | Bad | Null |
|---------|------|------------|-----|------|
| v1.0 (category-only) | ~55% | ~25% | ~18% | ~2% |
| v1.2 (subCategory added) | 70.9% | 22.0% | 5.1% | 2.0% |
| v1.4 (fallback removed + data cleanup) | **79.9%** | **15.1%** | **0.2%** | **4.7%** |

---

## Data Quality Standards

The matching engine's output quality is directly proportional to input data quality. These standards ensure consistent results.

### Required fields

Every tool **must** have:

- `category` — one of the 21 defined categories
- `subCategory` — a functional cluster within the category
- `tags` — at least 2 descriptive tags from the standardized tag vocabulary
- `pricing` — one of: `free`, `freemium`, `open-source`, `paid`

### SubCategory coverage

100% of tools now have a subCategory assigned. When adding new tools, always set `subCategory`. The matching engine gives +50 points for exact sub matches vs. +5 for different-sub — a 10x difference that determines whether the user gets a relevant or irrelevant suggestion.

### Tag vocabulary

Standardized on ~50 tags. Key conventions:

- Use `OSS` (not "Open-Source") for open-source projects
- Use `DevTools` (not "Development" or "Dev") for developer tools
- Use `Enterprise` for tools targeting large organizations
- Use `Self-Hosted` for self-deployable tools
- Limit to 2-4 tags per tool — more tags dilute the signal

### AlternativeTo relationships

The `alternativeTo` field creates hard links that bypass scoring. Use it for well-known competitive pairs:

- Penpot → Figma
- Listmonk → Mailchimp
- Supabase → Firebase

Convention: the challenger tool points to the incumbent. Reciprocal links are not required (the engine checks both directions).

---

## Limitations and Known Issues

### The Hunter.io edge case

Hunter.io is intentionally listed in two categories (SEO / Link Building and Lead Gen / Email Verification). The `alternativeTo` field on the Lead Gen version triggers an explicit match to an SEO tool (Ahrefs Backlink Checker), producing the only 2 cross-category matches. This is a data modeling trade-off, not an algorithm bug.

### Concentration in sparse subcategories

When a subcategory has only one tool of a given pricing tier (e.g., Cookiebot is the only paid consent management tool), that tool becomes the default recommendation for all other tools in the subcategory. This is correct behavior — the tool genuinely is the only option — but can look repetitive in exports.

### Null results for entire pricing tiers

Some categories naturally lack tools in certain pricing tiers:

- No free ad platforms (Google Ads, Meta, LinkedIn are all paid)
- No paid web browsers (all browsers are free or open-source)
- No free lead generation tools (all B2B data tools are paid/freemium)

These nulls are accurate and the export handles them with "— no match found" rather than forcing a bad suggestion.

---

## Implementation

The matching engine runs entirely client-side in the browser. The full tool database is embedded as a JSON array in `standalone.html`, and the algorithm executes in vanilla JavaScript with zero dependencies.

Source: `build-standalone.js` → function `findBestAlternative()`

The `buildExportMd()` function calls `computeAlts()` which runs `findBestAlternative()` for every tool in the stack, in both free and paid modes, to generate the triple-section export report.

---

*Part of [Ressource&Apps Toolkit](https://github.com/diShine-digital-agency/Tools-and-Resources) — built by [diShine Digital Agency](https://dishine.it)*
