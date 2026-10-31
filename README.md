<!-- PROJECT INFO -->
<p align="center">
  <h2 align="center">lilykiwi.xyz</h2>

  <p align="center">
    <a href="https://lilykiwi.xyz/"><strong>View the live site »</strong></a>
  </p>
</p>
<br />

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#writing-content">Writing content</a></li>
    <li><a href="#project-layout">Project layout</a></li>
    <li><a href="#deploying">Deploying</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

This is the source code for my personal website, [lilykiwi.xyz](https://lilykiwi.xyz). It's built with [Astro](https://astro.build) into a fully static site, with [Preact](https://preactjs.com) for the interactive bits (the header and section menu, and the GitHub repository list), plain CSS for styling, and [Bun](https://bun.sh) as the package manager.

Pages are driven by content on disk: blog posts are markdown files and photo albums are folders of images.

## Usage

Install dependencies with `bun install`, then:

- `bun run dev` - starts the dev server with hot reload at <http://localhost:4321>.
- `bun run build` - typechecks, then builds the site to `dist/`.
- `bun run preview` - serves the contents of `dist/` locally, to check a production build.
- `bun run check` - typechecks only.

`bun run build` typechecks with `tsc`, which covers `.ts` and `.tsx` files but not `.astro` files (`astro check` doesn't support TypeScript 7 yet).

## Writing content

### Blog posts

Add a markdown file to `src/content/blog/`. The file name is the URL, so `my-post.md` is served at `/blog/my-post/`.

```md
---
title: My post
date: 2026-11-01
description: One line shown on the blog index.   # optional
tags: [thoughts]                                  # optional
draft: true                                       # optional, hides it from the built site
---

Anything after the frontmatter is ordinary markdown.
```

Drafts are visible in `bun run dev` (with a "draft" badge on the index) but are left out of `bun run build`.

### Photo albums

One folder per album under `src/content/albums/`. The folder name is the URL, so `iceland-2025` is served at `/gallery/iceland-2025/`.

```
src/content/albums/
  iceland-2025/
    album.md        <- required
    001.jpg
    002.jpg
```

```md
---
title: Iceland
date: 2025-08-14
description: Optional blurb shown at the top of the album.
cover: 002.jpg          # optional, defaults to the first photo
photos:                 # optional alt text and captions, keyed by file name
  001.jpg:
    alt: A black sand beach under cloud
    caption: Reynisfjara
draft: true             # optional
---
```

Every `jpg`, `jpeg`, `png`, `webp` or `avif` in the folder is included, sorted by file name (numerically, so `2.jpg` comes before `10.jpg`). Adding a photo is just dropping the file in.

Photos are resized and converted to WebP when the site is built. This also drops embedded metadata such as GPS location. The original files are never published (check `dist/` if you want to be sure).

Album folders are listed in `.gitignore`, so photos are never committed by accident: they stay on the machine you build from, so keep your own backup of them. To commit one on purpose, use `git add -f src/content/albums/<name>`.

### Home page

`src/pages/index.astro` holds the "about" section (currently a placeholder) and the project list, which is fetched client-side from the GitHub API.

### Adding a page with sections

Pages share one layout, `src/layouts/Base.astro`. Pass `sections` to get the floating section menu and scrollspy, and `hero` for the large header (the home page is the only one that uses it):

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="uses · lilykiwi.xyz" sections={[{ id: 'editor', label: 'editor', icon: 'person' }]}>
  <section id="editor" class="section">
    <h2 class="sectionHeading">editor</h2>
    ...
  </section>
</Base>
```

The available `icon` names are listed at the top of `src/components/sidebar.tsx`. Pages that don't pass `sections` get no menu button.

## Project layout

```
astro.config.mjs        Astro config (Preact integration, static output)
scripts/gen-icons.cjs   regenerates src/components/icons.tsx from @primer/octicons
src/
  content.config.ts     schemas for the blog and albums collections
  content/
    blog/               markdown posts
    albums/             one folder per album
  layouts/Base.astro    <head>, global CSS, wraps every page in the Shell
  pages/                file-based routes: index, blog/, gallery/
  components/
    Shell.tsx           sticky header, scroll handling, section menu (hydrated in the browser)
    hero.tsx navbar.tsx the large header and the sticky link strip
    sidebar.tsx         scrollspy hook, section links and the floating hamburger
    repos.tsx           GitHub repository list (client-side fetch)
    icons.tsx           generated SVG icons
  lib/albums.ts         finds the photos in each album folder
  style.css             all styles
```

## Deploying

`bun run build`, then run `./deploy.sh`, which replaces `/data/www` with the contents of `dist/`. The build output is plain static files, so any web server that serves a directory will do. Every page is a `<path>/index.html`, so URLs like `/blog/my-post/` work without any rewrite rules.

## License

This project is licensed under the MIT license. See the [License](LICENSE) file for more information.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change. This is a personal site so I may not accept all changes, but I will try to be as open as possible. If you want to use this code for your own site, feel free to fork it and modify it to your liking.
