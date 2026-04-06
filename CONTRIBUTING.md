# Contributing to diShine Toolkit

Thank you for helping improve the diShine Toolkit! This guide explains how to add a new tool, update existing data, and ensure everything stays consistent.

> See also: [README](README.md) · [GUIDE.md](GUIDE.md) · [ALGORITHM.md](ALGORITHM.md) · [DIRECTORY.md](DIRECTORY.md)

---

## Adding a Tool

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
3. Run the full build and test pipeline:
   ```bash
   npm run build:all
   ```
   This runs `build:standalone` → `build-md` → `test` in sequence and ensures all generated outputs stay in sync.
4. Verify docs are still consistent:
   ```bash
   npm run lint:docs
   ```
5. Commit the updated outputs (`standalone.html`, `DIRECTORY.md`).

---

## Pricing field values

| Value | Meaning |
|-------|---------|
| `free` | Completely free, no paid plan exists |
| `freemium` | Free tier available, paid upgrades exist |
| `open-source` | Source code is public, self-hostable |
| `paid` | No free tier, subscription or license only |

---

## Tips for good alternative matching

- Always set `subCategory` — this is the strongest matching signal (+120 points)
- Add relevant `tags` — each shared tag adds +12 points
- Set `alternativeTo` for direct competitor pairs — these get matched instantly before scoring
- Use existing subcategory names when possible to maximize exact-subcategory matching
- Run `npm test` after adding tools to verify match quality stays above the 78% same-subcategory threshold

---

## Build & test scripts

| Script | Output | Purpose |
|--------|--------|---------|
| `npm run build` | `dist/` | Build the Astro production site |
| `npm test` | console | Run matching quality and export regression checks |
| `npm run build:standalone` | `standalone.html` | Regenerate the interactive single-file toolkit |
| `npm run build:md` | `DIRECTORY.md` | Regenerate the Markdown directory |
| `npm run build:all` | all generated outputs | Run standalone build, Markdown build, and tests in sequence |
| `npm run lint:docs` | console | Validate documentation references match the actual data |

---

## Code of conduct

Be respectful, constructive, and inclusive. Focus on improving the toolkit for everyone.

---

*Built by [diShine Digital Agency](https://dishine.it)*
