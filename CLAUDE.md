# CLAUDE.md

## Project Overview

Personal GitHub Pages website for David Beltrán (@edy527). A static site built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no package manager. Originally created as part of the **SummerHack 2023** program, a summer coding challenge series.

**Live site:** https://edy527.github.io/

## Repository Structure

```
.
├── index.html              # Landing page (linktree-style hub with social links)
├── css/estilos.css          # Styles for the landing page
├── img/                     # Images for the landing page (avatar, favicon)
├── docs/                    # Downloadable documents (CV PDF)
├── favicon.ico
├── addEventListener.html    # JS event listener demo (greeting app)
├── addEventListener.js      # Script for the greeting demo
├── asincrono/index.js       # Simple Node.js console log example
├── reto-02/                 # Challenge 2: Google homepage clone (dark theme)
│   ├── index.html
│   ├── style.css
│   ├── main.js              # Search toggle (commented out / WIP)
│   └── img/                 # SVG icons and images for the clone
└── reto03/                  # Challenge 3: Todo List app
    ├── index.html
    ├── style.css
    └── main.js              # Task CRUD with DOM manipulation
```

## Tech Stack

- **HTML5** — semantic markup, Open Graph / Twitter Card meta tags
- **CSS3** — Flexbox layouts, CSS custom properties (reto03), media queries
- **Vanilla JavaScript** — DOM manipulation, event listeners, template literals
- **Font Awesome** — icons via CDN (`kit.fontawesome.com`)
- **Google Fonts** — Roboto (landing page)
- **No build step** — edit files and push; GitHub Pages serves them directly

## Development Workflow

### Local development

Open any `.html` file directly in a browser, or use a local server:

```sh
# Python
python3 -m http.server 8000

# Node.js (npx)
npx serve .
```

### Deployment

The site deploys automatically via **GitHub Pages** from the `main` branch. Push to `main` and the site updates within minutes — no CI/CD pipeline or build step required.

### Branching

- `main` — production branch, deployed to GitHub Pages
- Feature branches for new challenges or changes, merged into `main`

## Key Conventions

### Language

- UI text and comments are in **Spanish**
- File/folder names use lowercase; challenges use `reto-XX` naming (note: `reto-02` has a hyphen, `reto03` does not — inconsistent but established)

### Styling

- Landing page: external stylesheet at `css/estilos.css`
- Challenge pages: co-located `style.css` in each challenge folder
- No CSS preprocessors or utility frameworks

### JavaScript

- No modules or bundlers — scripts loaded via `<script>` tags
- DOM elements accessed by `getElementById` or `querySelector`
- Event delegation used in reto03 (`list.addEventListener`)
- No external JS libraries (beyond Font Awesome CDN)

### HTML

- Spanish `lang="es"` on most pages
- Meta tags for SEO and social sharing on the landing page
- Font Awesome loaded from CDN in pages that use icons

## Adding a New Challenge

1. Create a folder: `reto-XX/`
2. Add `index.html`, `style.css`, and optionally `main.js`
3. Link to it from the root `index.html` inside the `<ul class="menu">` list
4. Keep styling self-contained in the challenge folder

## Notes for AI Assistants

- There is **no package.json**, no linter, no test suite, and no build pipeline. Changes are verified by opening the HTML in a browser.
- All paths in HTML are relative (e.g., `./css/estilos.css`, `./reto-02/index.html`).
- The `reto-02/main.js` search toggle is commented out and marked as WIP.
- The `asincrono/index.js` file is a standalone Node.js snippet, not used by the website.
- Do not introduce build tools, transpilers, or frameworks unless explicitly requested.
