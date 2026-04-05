# User Guide: diShine Tools & Resources

A practical guide to the **422-tool** diShine digital toolkit.

---

## 1. Interactive Access (No Code Required)

Double-click **`standalone.html`** to open the full toolkit in any browser. No install, no server, works offline.

### Browsing

- **Search bar** -- type any keyword to filter by name, description, or tags
- **Tag badges** -- click any `#tag` on a tool card to filter the entire directory by that tag. Click again to clear.
- **Pricing filter bar** -- five buttons at the top: All / Free / Freemium / Open Source / Paid. Each shows an exact count. Click to filter instantly.
- **Accordions** -- categories are collapsed by default. Click to open, click again to close. When searching or filtering, matching categories auto-expand.

### Stack Builder

Every tool card has a **`+ Stack`** button. Click to add tools to the "My Stack" sidebar on the right.

- **Toggle add/remove**: once a tool is in your stack, the button turns red and reads **`- Remove`**. Click to remove directly from the card.
- **Sidebar remove**: each item in the stack sidebar has a **x** button.
- **Pricing summary**: the sidebar shows a live breakdown like `2 free / 1 OS / 3 freemium / 1 paid`.

### Alternative Matching

Two action buttons in the sidebar header transform your stack:

| Button | Action |
|--------|--------|
| **Free Alts** | Replaces paid and freemium tools with the best free or open-source match |
| **Upgrade** | Replaces free and freemium tools with the best paid premium match |
| **Reset** | Appears after any swap -- restores your original hand-picked stack |

The algorithm uses a multi-signal weighted scoring system. It prioritizes tools in the **same subcategory** (e.g., Screen Recording, Audio & Podcasting) over broad category matches, so a screen recorder gets matched with another screen recorder -- not a video editor. See the [README](README.md) for the full scoring breakdown.

Your original stack is always preserved in memory. Swapping to free alts or premium upgrades changes the view but never destroys your picks. Click **Reset** to return.

### Triple Export

Click **Export Markdown** to copy a complete consulting report to your clipboard. The export always includes three sections:

1. **Chosen Stack** -- your original hand-picked tools, grouped by category with pricing labels and links
2. **Free & Open-Source Alternatives** -- a comparison table: each of your tools alongside the algorithm's best free/OS match
3. **Premium Upgrade Alternatives** -- a comparison table: each tool alongside the best paid alternative

Add an optional client note in the textarea before exporting. The markdown is ready to paste into proposals, Notion, Slack, or email.

---

## 2. Text-Only Access

Open **[`DIRECTORY.md`](DIRECTORY.md)** for a static Markdown list of all 422 tools with categories, descriptions, pricing, learning curves, and tags.

---

## 3. Developer Access (Astro Site)

### Prerequisites

[Node.js](https://nodejs.org) v18+.

### Setup

```bash
git clone https://github.com/diShine-digital-agency/Tools-and-Resources.git
cd Tools-and-Resources
npm install
npm run dev
```

Open `http://localhost:4321`.

### Build scripts

| Script | Output | Purpose |
|--------|--------|---------|
| `node build-standalone.js` | `standalone.html` | Regenerates the interactive single-file toolkit |
| `node build-md.js` | `DIRECTORY.md` | Regenerates the Markdown directory |

Run both after modifying `src/data/tools.json`.

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
3. Run `node build-standalone.js && node build-md.js`
4. Commit the updated outputs.

### Pricing field values

| Value | Meaning |
|-------|---------|
| `free` | Completely free, no paid plan exists |
| `freemium` | Free tier available, paid upgrades exist |
| `open-source` | Source code is public, self-hostable |
| `paid` | No free tier, subscription or license only |

### Tips for good alternative matching

- Always set `subCategory` -- this is the strongest matching signal (+50 points)
- Add relevant `tags` -- each shared tag adds +10 points
- Set `alternativeTo` for direct competitor pairs -- these get matched instantly before scoring
- Use existing subcategory names when possible (check the [README](README.md) for the full list)

---

*Built by [diShine Digital Agency](https://dishine.it)*
