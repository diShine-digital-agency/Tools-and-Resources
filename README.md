# 🛠 Tools & Resources Directory

Welcome to the **diShine Tools & Resources** directory!

Previously a static Markdown list, this project is now a high-performance, searchable **Astro** application. We curate over 400 digital tools, platforms, and resources specifically vetted for agencies, consultants, and digital teams.

## 🚀 Features

- **Blazing Fast**: Built with Astro and Tailwind CSS.
- **Interactive Search**: Client-side filtering across tool names, categories, and alternatives.
- **Agency Curation**: Features "diShine Top Picks" (👑) and curated *Agency Playbooks*.
- **Rich Metadata**: Learning curves, better structured descriptions, and "Alternative To" suggestions.

## 💻 Local Development

To run this directory locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the local dev server
npm run dev
```

Visit `localhost:4321` to view your interactive directory!

## ⚙️ Adding New Tools

Tools are now managed logically through structured JSON data.

To add new tools, update the array in `src/data/tools.json`:

```json
{
  "name": "New Tool",
  "url": "https://newtool.io",
  "category": "Web Analytics & Tag Management",
  "subCategory": "Analytics Platforms",
  "type": "[$]",
  "description": "Very fast tracker.",
  "learningCurve": "Easy",
  "agencyPick": false,
  "alternativeTo": "Google Analytics"
}
```

The site will automatically regenerate pages and categories upon building via `npm run build`.

## 📄 License & Maintenance

Maintained by [diShine Digital Agency](https://github.com/diShine-digital-agency). Licensed under the MIT License.
