# User Guide: diShine Tools & Resources

Welcome! We designed this repository to be accessible for both casual users and developers. There are three primary ways to leverage this toolkit of **392** curated tools:

## 1. Interactive Access (No Code Required)

If you are a consultant, marketer, or agency member who wants maximum functionality without touching a terminal:

**Simply double-click the `standalone.html` file!**

This is an incredibly powerful offline application that functions seamlessly. 

### Core Features:
- **Scalable Accordions**: The 392 tools are tucked away into nested categories that auto-expand, ensuring you never have to scroll endlessly.
- **Pricing & Philosophy Filters**: Big toggles at the top let you instantly view only "Free/Freemium" or strictly "Open Source" tools across the whole directory.

### The Consultant "Stack Builder":
Every tool has a `+ Stack` button. As you browse, add tools to your My Stack sidebar.
- **Budget Hot-Swapping**: In your Stack sidebar, you will see a button to `🪄 Find Free Alts`. If you added premium tools to your stack, clicking this button tells the algorithm to scan the 392 tools and instantly replace your premium selections with Open Source/Free tools that accomplish the same task! (e.g. Swapping *Ahrefs* for a free alternative).
- **Pro Upgrades**: Similarly, click `💎 Upgrade Stack` to swap simple free tools with enterprise-grade premium suggestions.
- **Exporting**: Type a client greeting in the note box and click `Export Markdown`. The system automatically categorizes your selected tools and copies a beautifully formatted guide to your clipboard!

## 2. Text-Only Access (The Classic Way)

If you prefer simply reading through a structured document without interactive scripts:

**Click on `DIRECTORY.md`**.

- **What it is:** A compiled, static Markdown file containing all 392 tools. It reads just like standard GitHub documentation.
- **Features:** Fully categorized with an interactive table of contents. Includes pricing, descriptions, learning curves, and tags compiled directly into the text.

## 3. Developer Access (The Astro Site)

If you want to run the full, scalable, static site environment locally or deploy it to a server (this architecture perfectly matches the standalone HTML capabilities):

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system (v18+ recommended).

### Running the App
1. Clone the repository and navigate into it:
   ```bash
   git clone https://github.com/diShine-digital-agency/Tools-and-Resources.git
   cd Tools-and-Resources
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser and go to **`http://localhost:4321`**.

---

## How to Contribute / Add a Tool

We have separated the *data* from the *display*. This means you don't need to know HTML or Astro to add a tool.

1. Open `src/data/tools.json`.
2. Paste a new tool chunk into the JSON array:
   ```json
   {
      "name": "My New Tool",
      "url": "https://example.com",
      "category": "Web Analytics & Tag Management",
      "type": "[OS][F]",
      "description": "Short description of the platform.",
      "learningCurve": "Easy",
      "agencyPick": false,
      "alternativeTo": "Google Analytics"
   }
   ```
3. Save the file.

*(Note: If you want the `standalone.html` and `DIRECTORY.md` to reflect this new tool, a maintainer must run `node build-standalone.js` and `node build-md.js` before committing).*
