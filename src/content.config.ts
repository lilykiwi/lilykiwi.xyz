import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts: any markdown file under src/content/blog. The file name is the URL slug.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * Photo albums: one folder per album under src/content/albums, holding an `album.md` plus the photos.
 * Every image in the folder is part of the album (sorted by file name), so adding a photo is just dropping
 * the file in. `photos` is only for optional per-photo alt text and captions, keyed by file name.
 */
const albums = defineCollection({
  loader: glob({
    pattern: '*/album.md',
    base: './src/content/albums',
    // folder name is the id/slug
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    /** file name of the cover photo; defaults to the first photo */
    cover: z.string().optional(),
    photos: z
      .record(
        z.string(),
        z.object({
          alt: z.string().default(''),
          caption: z.string().optional(),
        }),
      )
      .default({}),
    draft: z.boolean().default(false),
  }),
});

/**
 * The home page's about section: the single file src/content/about/about.md. Its body is the bio,
 * `github` is the username the profile picture is pulled from, and `specs` are the gear cards
 * (each group's rows are label: value, shown in the order written). `people` are the links at the bottom: a name and
 * a url, plus an optional picture (a file next to about.md, resized at build time, or a link to one hosted elsewhere).
 */
const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/about' }),
  schema: ({ image }) => z.object({
    github: z.string(),
    peopleTitle: z.string().default('cool people i know !!'),
    people: z
      .array(
        z.object({
          name: z.string(),
          url: z.httpUrl(),
          // a file next to about.md (resized at build time), or an http(s) link that's loaded live from its own site
          image: image().or(z.httpUrl()).optional(),
        }),
      )
      .default([]),
    specs: z
      .array(
        z.object({
          title: z.string(),
          rows: z.record(z.string(), z.string()),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog, albums, about };
