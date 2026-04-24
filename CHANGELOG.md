## What's new in v1.3.0: audit pass, branded exports, and stronger matching

This release audits the toolkit end to end, rebuilds the matching/export flow around shared logic, improves the stack UX, and updates the documentation so the repo reflects the shipped behavior.

### Matching engine
- Added a shared core matching module used by the Astro app, standalone build, and regression checks.
- Alternatives now resolve against **stable tool identities** instead of tool names only, preventing category collisions for duplicate names such as Hunter.io.
- Matching now prioritizes the same utility cluster more aggressively and returns no recommendation when confidence is too low.
- Same-category-only behavior remains enforced to avoid nonsense cross-category replacements.

### Export workflow
- Replaced the broken single-action export flow with a branded export package.
- Added **PDF**, **Markdown**, and **TXT** exports.
- Every export now contains the **chosen stack**, **free alternatives**, and **paid alternatives**.
- Added a **preview** action for reviewing the branded report in-browser before export.

### UX / UI
- Refreshed the main page with stronger diShine positioning and clearer audit messaging.
- Replaced checkbox pricing filters with explicit **All / Free / Freemium / Open Source / Paid** filters.
- Improved tool cards with visible utility subcategories.
- Improved the stack panel with clearer state labels, reset support, better summaries, and mobile-friendly visibility.

### Engineering / repo hygiene
- Added shared runtime modules: `src/lib/toolkit-core.js` and `src/lib/toolkit-app.js`.
- Added formal `npm test` and `npm run build:standalone` scripts.
- Rewrote `test.js` into a regression check covering matching quality and export generation.
- Regenerated `standalone.html` from the updated shared logic.
- Updated README and algorithm notes to match the current product.

*Maintained by diShine Digital Agency.*
