# Repository Guidelines

## Project Structure & Module Organization
The site is a static HTML portfolio served from the repository root. Top-level pages such as `index.html`, `teams.html`, and the `publication_*.html` series load shared assets from `assets/`. Stylesheets live in `src/styles/`, scripts in `src/js/` (publication data in `src/js/project_renderer.js`), publication thumbnails in `assets/projects/`, and logos in `assets/institutions/`. Project subpages reside in `projects/<slug>/index.html`, and downloadable materials (CVs, slides, papers) belong in `files/`.

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

## Adding a Publication (checklist — run through every time)
Publications are defined in `src/js/project_renderer.js` (`render_project(...)` entries, `render_author(...)` calls at the bottom) and placed via `<tr name="...">` rows in `index.html`.

1. **Find the paper.** Query arXiv (`export.arxiv.org/api/query?search_query=au:"Yinghao Xu"`). Other people share this name (e.g., an astronomer) — confirm via co-authors. Skip papers already on the site (match arXiv id or title).
2. **Venue.** Read the arXiv comment and project page for "Accepted at X". Use `'NeurIPS 2026'`-style labels if accepted, otherwise `'arXiv 2026'`. The first `material_list` item must contain a name from `venue_patterns`, or it won't render as the venue.
3. **Links.** Paper = arXiv abs URL. Add Project Page / Code / Model only if they really exist ("coming soon" is not a link). Never copy links from a neighboring entry.
4. **Authors.**
   - Copy the order exactly from arXiv. Mark `'equal'` (*) / `'corresponding'` (+) per the paper or project page.
   - Homepage: take it from the project page's author links first, else reuse an existing `render_author` link, else leave plain. Never guess a URL.
   - Every author needs a `render_author(...)` call, or the name renders blank.
   - Same name, different people: use an alias key, e.g. `render_author('Shuai Yang (student)', url, 'Shuai Yang')`. Lab students must link to the same homepage as the Students list.
5. **Teaser (prefer video).** The box is 180×101 (16:9, `object-fit: cover`), larger on mobile.
   - Take the project page teaser video; fall back to a teaser image (~800px JPEG).
   - Edit: keep the best 5–15 s, drop title cards / black frames, crop side-by-side panels to the most visual one, frame close to 16:9.
   - Encode: `ffmpeg -ss S -t T -i in.mp4 -vf "crop=...,scale=640:-2" -an -c:v libx264 -crf 23-28 -pix_fmt yuv420p -movflags +faststart assets/projects/<slug>.mp4`
   - Keep it **< 2 MB**, name it lowercase-hyphenated, preview frames before committing.
6. **Placement** (`index.html` rows): add to Recent, the year section of "by date", and one best-fit topic. Add to Selected only when asked. Respect manual ordering (commented-out rows stay commented).
7. **News.** If an acceptance count in Recent News changes, update or flag it.
8. **Verify** on a local server with headless Chrome: no console errors, no empty author spans (`<span name="..." title=""></span>`), screenshot looks right. Push only when asked.
