## What's new in v1.2.0: pricing overhaul, smart stacks & FMHY expansion

This release reworks how pricing is displayed across the entire toolkit and adds several usability improvements to the stack builder.

### Pricing clarity
- **4-tier pricing model**: every tool now carries one of four explicit labels — `100% Free` (no paid plan exists), `Freemium` (free tier with paid upgrades), `Open Source` (code is public, self-hostable), or `Paid only` (no free tier at all). Previously most tools were just "Free" or "Paid", which hid the fact that tools like Canva, Figma, Mailchimp, and ChatGPT all have significant paid tiers.
- **Pricing filter bar**: the old Free/OS checkboxes are replaced with a row of five filter buttons (All / Free / Freemium / Open Source / Paid) showing exact counts. Click any button to instantly filter the entire directory.
- **Color-coded badges**: free is green, freemium is amber, open-source is teal, paid is red — consistent across tool cards, stack items, and markdown export.

### Stack builder improvements
- **Toggle add/remove**: the `+ Stack` button on each tool card now toggles to `- Remove` (red) when the tool is already in your stack. Clicking again removes it — no need to scroll down to the sidebar to delete.
- **Pricing breakdown in stack**: the stack sidebar shows a live summary like "2 free / 1 OS / 3 freemium / 1 paid" instead of just a free/paid ratio.
- **Smarter markdown export**: the exported markdown now includes a pricing summary line and each tool carries its pricing tier label in brackets.
- **Find Free Alts / Upgrade Stack**: these buttons now respect the 4-tier model — "Find Free Alts" skips tools already marked free or open-source, "Upgrade Stack" skips tools already paid.

### Layout
- **Accordions closed by default**: all category sections start collapsed. Click to open the ones you need, click again to close. Saves a lot of scrolling on a 422-tool page.

### Data
- **FMHY content expansion**: privacy, self-hosted, and open-source tools sourced from the FMHY compendium (Pi-hole, Coolify, Uptime Kuma, and more).
- **`pricing` field added to tools.json**: every tool object now carries an explicit `pricing` property (`free`, `freemium`, `open-source`, or `paid`) alongside the existing `type` and `isFree` fields.

*Maintained by diShine Digital Agency.*
