# Repository Guidelines

## Project Structure & Module Organization
The site is a static HTML portfolio served from the repository root. Top-level pages such as `index.html`, `teams.html`, and the `publication_*.html` series load shared assets from `assets/`. Stylesheets, scripts, and icons live under `assets/`, with project-specific scripts in `assets/project_renderer.js` and images in `images/` or `assets/institutions/`. Project subpages reside in `projects/<slug>/index.html`, and downloadable materials (CVs, slides, papers) belong in `files/`.

## Build, Test, and Development Commands
- `python3 -m http.server 8000`: start a lightweight preview server from the repository root; open `http://localhost:8000` in a browser to validate layout and navigation before pushing.
- `npx prettier@3.2.5 --check "**/*.{html,css,js}"`: optional formatting audit that flags indentation or spacing drift without rewriting files; run with `--write` locally if you need automated fixes. Install Node ≥18 locally to use this.

## Coding Style & Naming Conventions
Match existing 2-space indentation in HTML and CSS tables, and keep HTML attributes double-quoted. JavaScript helpers under `assets/` prefer single quotes and camelCase function names (`showPubs`, `toggle_vis`). Use lowercase, hyphenated filenames for new assets (`assets/projects/new-module.css`) and keep linked paths relative so GitHub Pages resolves them correctly.

## Testing Guidelines
There is no automated test suite; rely on manual inspection. After content changes, preview via the local server, click through navigation anchors, and watch the browser console for JavaScript errors. When adding downloads or images, verify the paths resolve from the published site by reloading with cache disabled.

## Commit & Pull Request Guidelines
Follow the concise, present-tense style in the Git history (e.g., `Fix navigation links: change absolute URLs`). Start each subject with a verb and keep it under ~60 characters when possible. Pull requests should list the pages touched, mention any new files placed under `files/` or `assets/`, and include screenshots for visual tweaks. Link to related issues or tasks so maintainers can trace the change.

## Content Updates & Asset Tips
Prefer editing reusable HTML fragments (e.g., publication sections) instead of duplicating markup. Compress large images before adding them to `images/` to keep page loads snappy, and reuse SVG logos stored in `assets/institutions/` where possible.
