# User Guide: diShine Tools & Resources

Welcome! We designed this repository to be accessible for both casual users and developers. There are three primary ways to leverage this toolkit:

## 1. Interactive Access (No Code Required)

If you are a consultant, marketer, or agency member who wants maximum functionality without touching a terminal:

**Simply double-click the `standalone.html` file!**

- **What it is:** A completely independent, fully-styled HTML file containing the entire database of tools.
- **Features:** It features a Tech-Stack "Cart" builder, NLP tag-based searching, category breakdown, and color-coded metadata. It fetches styling via CDN, so be online!

## 2. Text-Only Access (The Classic Way)

If you prefer simply reading through a structured document without interactive scripts:

**Click on `DIRECTORY.md`**.

- **What it is:** A compiled, static Markdown file. It reads just like standard GitHub documentation.
- **Features:** Fully categorized with table of contents. Includes pricing, descriptions, learning curves, and tags compiled into the text.

## 3. Developer Access (The Astro Site)

If you want to run the full, scalable, static site environment locally or deploy it to a server:

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
