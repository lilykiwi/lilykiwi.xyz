import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

// every image sitting in an album folder; Astro processes (resizes, re-encodes, strips EXIF from) them at build time
const images = import.meta.glob<ImageMetadata>('/src/content/albums/*/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export interface Photo {
  file: string;
  image: ImageMetadata;
  alt: string;
  caption?: string;
}

export type Album = CollectionEntry<'albums'>;

/** Published albums, newest first (drafts show in dev only). */
export async function getAlbums(): Promise<Album[]> {
  const albums = await getCollection('albums', ({ data }) => import.meta.env.DEV || !data.draft);
  return albums.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** All photos in an album's folder, in file-name order. */
export function getPhotos(album: Album): Photo[] {
  const prefix = `/src/content/albums/${album.id}/`;
  return Object.entries(images)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, image]) => {
      const file = path.slice(prefix.length);
      const meta = album.data.photos[file];
      return { file, image, alt: meta?.alt ?? '', caption: meta?.caption };
    })
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
}

export function getCover(album: Album): Photo | undefined {
  const photos = getPhotos(album);
  return photos.find((p) => p.file === album.data.cover) ?? photos[0];
}

/** "1 photo" / "3 photos". */
export const count = (n: number) => `${n} photo${n === 1 ? '' : 's'}`;
