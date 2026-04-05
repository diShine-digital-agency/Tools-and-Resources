## What's new in v1.2.0: pricing overhaul, intelligent matching & triple export

This release reworks pricing, rebuilds the alternative matching algorithm, adds stack preservation with triple-section consulting exports, and performs a major data quality cleanup.

### Data quality overhaul (v1.2.0b)
- **5 duplicate entries removed**: Penpot, Coolify, Descript (AI duplicate), Loom, Tella. Cross-category duplicates (Hunter.io, PostHog, Notion) kept intentionally.
- **40 missing subCategories filled**: every tool now has a subCategory for precise matching.
- **10 misclassified tools moved**: Adobe Premiere Pro, Kdenlive → Video & Audio. Jira, Focalboard, OpenProject → Project Management. Obsidian, AppFlowy → PM Documentation. Mattermost → PM Communication. Odoo → CRM & Sales.
- **"Email Marketing & CRM" category merged** into Email Marketing & Automation (3 tools: Superhuman, Thunderbird, Mailspring → new "Email Clients" sub).
- **129 empty tag arrays filled** with 2-4 relevant tags per tool.
- **"Open-Source" / "OSS" tag consolidated** into "OSS" (was split across 31 tools).
- **Cross-category fallback removed** from matching algorithm. Now returns null instead of forcing a bad match from an unrelated category. Bad match rate: 5.1% → 0.2%.
- **Removed 5 non-agency utilities** (WinRAR, 7-Zip, PeaZip, Rufus, Ventoy) that polluted paid alternatives.
- **Added 14 real paid alternatives** for categories that had none: Shopify, Webflow, Contentful (CMS), Tailwind UI (frontend), Datadog, New Relic, BrowserStack (testing), Firebase, Neon (backend), AWS Amplify, Heroku (hosting), Zoom (communication), Guru, Tettra (documentation).
- **Final dataset**: 426 tools, 21 categories, 60+ subcategories. Match quality: 79.9% good (same sub), 15.1% acceptable (same cat), 0.2% cross-category, 4.7% null (legitimate data gaps).

### Export formats (v1.2.0b)
- **Three export buttons**: Copy (clipboard), .md (file download), .txt (file download with Markdown stripped). Replaces single clipboard button.
- **Renamed**: Ressource&Apps_Toolkit. Subtitle: Consulting Edition (v1.2.0) — 417 tools | Matching model v1.4.

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
