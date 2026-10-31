---
title: Hello, world
description: A placeholder post to check the blog works. Delete or rewrite it.
date: 2026-10-31
tags: [meta]
---

This is a placeholder post so the blog has something to render. Replace it with a real one, or delete the file.

## Writing a post

Add a markdown file to `src/content/blog/`. The file name becomes the URL, so `my-post.md` lives at `/blog/my-post/`.

```md
---
title: My post
date: 2026-11-01
description: One line shown on the blog index.
tags: [thoughts]
draft: true # hidden from the built site until you remove this
---
```

Anything after the frontmatter is ordinary markdown.
