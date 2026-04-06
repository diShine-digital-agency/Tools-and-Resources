# Matching Engine — Technical Reference

This document describes how the diShine Toolkit chooses alternatives that preserve the **utility** of the original tool instead of matching only on broad category labels.

---

## Core idea

A replacement is only useful when it still solves the same job.

Because of that, the engine now applies these rules in order:

1. **Resolve the exact source tool by stable identity**
2. **Honor curated `alternativeTo` relationships first**
3. **Search only inside the same category**
4. **Prefer the same subcategory / utility cluster whenever it exists**
5. **Reject weak matches instead of forcing a fallback**

This keeps the output safer for client recommendations and avoids misleading substitutions.

---

## Data used by the engine

Each tool record contributes the following signals:

- `category` — broad operating area
- `subCategory` — actual use-case / utility cluster
- `pricing` — `free`, `freemium`, `open-source`, `paid`
- `tags` — semantic overlap helpers
- `alternativeTo` — curated hard link between known alternatives
- stable derived `id` — `name + category + subCategory`

The derived `id` is important because the dataset intentionally contains some duplicated names in different categories. Matching by name alone is no longer reliable.

---

## Candidate selection

### Free mode
The engine accepts only tools priced as:
- `free`
- `open-source`

### Paid mode
The engine accepts only tools priced as:
- `paid`

### Shared constraint
Candidates must:
- not be the same tool
- live in the **same category** as the source tool

If that pool is empty, the engine returns `null`.

---

## Matching flow

### 1. Explicit curated pair
If either side points to the other through `alternativeTo`, that candidate wins immediately.

### 2. Exact utility pool
If there are candidates in the same category **and** the exact same subcategory, only that pool is considered.

### 3. Weighted scoring
The remaining candidates are scored with these signals:

| Signal | Weight | Why |
|---|---:|---|
| Exact subcategory | +120 | Strongest utility signal |
| Shared subcategory keywords | +24 each | Captures close utility wording |
| Same-category baseline | +22 | Candidate pool is already category-safe |
| Shared tags | +12 each | Reinforces semantic fit |
| Shared description keywords | +6 each (capped) | Adds softer relevance |
| Agency pick | +3 | Slight tiebreak toward curated picks |
| Open-source bonus | +2 | Mild preference when looking for cost-efficient swaps |

### 4. Confidence thresholds
- **Exact-subcategory pool present:** score must reach **80**
- **Fallback inside category with source subcategory present:** score must reach **40**
- **Fallback with sparse metadata:** score must reach **28**

If the best candidate stays below the threshold, the engine returns `null`.

---

## Why this is safer

Previous behavior could still be confused by duplicated tool names or overly broad category matches. The current flow improves that by:

- resolving tools by stable identity
- isolating exact-utility candidates first
- requiring meaningful semantic overlap before allowing a fallback
- refusing low-confidence suggestions

That produces cleaner exports and more credible client-facing recommendations.

---

## Regression coverage

`npm test` now validates:

- key scenario matches
- same-category enforcement across the dataset
- minimum same-subcategory match quality
- export generation for Markdown and TXT

---

## Related files

- `src/lib/toolkit-core.js`
- `src/lib/toolkit-app.js`
- `test.js`
- `build-standalone.js`
