# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a static personal academic website for Yinghao Xu (Justin), hosted on GitHub Pages. The site showcases research publications and projects in computer vision and generative models.

## Architecture

- **Static HTML site**: No build process required - files are served directly by GitHub Pages
- **Main homepage**: `index.html` - personal academic profile with publications and contact info
- **Publication pages**: `publication_*.html` files categorize publications by type (2D gen, 3D gen, object recognition, oral presentations, full list)
- **Project showcases**: Individual project directories in `projects/` containing dedicated landing pages
- **Assets**: Shared CSS, JavaScript, and images in `assets/` directory

## Key Components

### Main Files
- `index.html`: Homepage with profile, research interests, and publication highlights
- `assets/style.css`: Main stylesheet for consistent typography and styling
- `assets/function.js`: JavaScript utilities for query parameter parsing and page functionality

### Project Structure
- `projects/cmpl/`: CMPL project page with Bootstrap-based styling
- `projects/dmv3d/`: DMV3D project page using Bulma CSS framework with interactive elements
- `projects/grm/`: GRM project page with similar Bulma-based architecture

Each project directory contains:
- `index.html`: Project landing page
- `static/css/`: Project-specific stylesheets (Bulma, FontAwesome)
- `static/js/`: Interactive JavaScript components (carousels, sliders, 3D viewers)

## Development Workflow

Since this is a static site hosted on GitHub Pages:

1. **No build step required** - edit HTML, CSS, or JS files directly
2. **Testing locally**: Open HTML files directly in browser or use a simple HTTP server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```
3. **Deployment**: Push changes to the `master` branch - GitHub Pages automatically serves updates

## File Editing Guidelines

- **Styling**: Modify `assets/style.css` for site-wide changes
- **Content updates**: Edit HTML files directly for text, links, or structural changes
- **New publications**: Add entries to appropriate `publication_*.html` files and update `index.html`
- **Project pages**: Each project uses different CSS frameworks (Bootstrap for CMPL, Bulma for DMV3D/GRM)

## Common Tasks

- **Update publication list**: Edit `index.html` and relevant `publication_*.html` files
- **Add new project**: Create new directory in `projects/` with `index.html` and assets
- **Style modifications**: Update `assets/style.css` for global changes, or project-specific CSS files
- **Image/file updates**: Place in `assets/`, `images/`, or `files/` directories as appropriate