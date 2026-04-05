## What's new in v1.2.0: pricing overhaul, intelligent matching & triple export

This release reworks pricing, rebuilds the alternative matching algorithm, and adds stack preservation with triple-section consulting exports.

### Pricing clarity
- **4-tier pricing model**: every tool now carries one of four explicit labels -- `100% Free` (no paid plan exists), `Freemium` (free tier with paid upgrades), `Open Source` (code is public, self-hostable), or `Paid only` (no free tier at all). Previously most tools were just "Free" or "Paid", which hid the fact that tools like Canva, Figma, Mailchimp, and ChatGPT all have significant paid tiers.
- **Pricing filter bar**: the old Free/OS checkboxes are replaced with a row of five filter buttons (All / Free / Freemium / Open Source / Paid) showing exact counts. Click any button to instantly filter the entire directory.
- **Color-coded badges**: free is green, freemium is amber, open-source is teal, paid is red -- consistent across tool cards, stack items, and markdown export.

### Intelligent alternative matching (rewritten)
- **SubCategory-aware scoring**: the matching algorithm now uses a multi-signal weighted scoring system that prioritizes `subCategory` (e.g., Screen Recording, Audio & Podcasting) over broad category. A screen recorder gets matched with another screen recorder -- not a video editor.
- **Scoring weights**: exact subCategory match = +50, same-category different sub = +5, tag overlap = +10 per shared tag, subCategory keyword overlap = +20 per word, explicit `alternativeTo` = instant match.
- **Minimum score threshold**: candidates scoring below 5 are rejected, preventing nonsensical cross-category matches.
- **Same-category priority**: the algorithm searches within the same category first. Only falls back to cross-category if no same-category candidate exists.

### Stack preservation & reset
- **Original stack memory**: clicking "Free Alts" or "Upgrade" preserves your original hand-picked stack in memory. A **Reset** button appears to restore it.
- **View indicator**: the sidebar shows a colored label ("Viewing Free Alternatives" or "Viewing Premium Alternatives") so you always know which view is active.
- **Non-destructive swaps**: adding or removing tools manually clears the alt-swap state and returns to your fresh stack.

### Triple export
- **Three-section markdown report**: Export now generates a complete consulting report with: (1) your chosen stack grouped by category, (2) a comparison table of free/OS alternatives for each tool, (3) a comparison table of premium upgrade alternatives.
- **Smart omission**: tools that already match the target pricing tier (e.g., a free tool in the free alternatives table) show "already free/OS" instead of a forced bad match.

### Stack builder improvements
- **Toggle add/remove**: the `+ Stack` button on each tool card now toggles to `- Remove` (red) when the tool is already in your stack.
- **Pricing breakdown in stack**: the stack sidebar shows a live summary like "2 free / 1 OS / 3 freemium / 1 paid".

### Layout
- **Accordions closed by default**: all category sections start collapsed. Click to open the ones you need, click again to close.

### Data
- **FMHY content expansion**: privacy, self-hosted, and open-source tools sourced from the FMHY compendium (Pi-hole, Coolify, Uptime Kuma, and more).
- **`pricing` field added to tools.json**: every tool object now carries an explicit `pricing` property alongside the existing `type` and `isFree` fields.
- **`subCategory` field**: 382 of 422 tools now have a subcategory for precise alternative matching.

*Maintained by diShine Digital Agency.*
