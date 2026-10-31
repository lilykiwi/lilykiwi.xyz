# Photo albums

One folder per album. The folder name is the URL (`iceland-2025` → `/gallery/iceland-2025/`).

```
albums/
  iceland-2025/
    album.md        <- required
    001.jpg
    002.jpg
```

`album.md`:

```md
---
title: Iceland
date: 2025-08-14
description: Optional blurb shown at the top of the album.
cover: 002.jpg # optional, defaults to the first photo
photos: # optional alt text and captions, keyed by file name
  001.jpg:
    alt: A black sand beach under cloud
    caption: Reynisfjara
---
```

Every `jpg`, `jpeg`, `png`, `webp` or `avif` in the folder is included, sorted by file name. Photos are resized and
re-encoded when the site is built, which also drops embedded metadata such as GPS location; the originals
are never published.
