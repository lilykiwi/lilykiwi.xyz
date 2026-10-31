import type { JSX } from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import { useSignal, type Signal } from '@preact/signals';
import { BookIcon, HomeIcon, ImageIcon, PersonIcon, RepoIcon, ThreeBarsIcon, XIcon } from './icons';

// Icons are referenced by name because island props from Astro have to be serialisable.
const icons = {
  home: HomeIcon,
  person: PersonIcon,
  repo: RepoIcon,
  book: BookIcon,
  image: ImageIcon,
};

/** A "go up a level" link that takes the hamburger's place on pages with no sections. */
export interface BackLink {
  href: string;
  label: string;
  icon: keyof typeof icons;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: keyof typeof icons;
}

/**
 * Tracks which section is being read (scrollspy). Shared by the floating menu and the strip's dropdown.
 */
export function useScrollspy(items: SidebarItem[]): Signal<string> {
  const active = useSignal(items[0]?.id ?? '');

  useLayoutEffect(() => {
    if (!items.length) return;

    const update = () => {
      // Work from where the sections actually are on the page, so this never depends on the order of `items`.
      const found = items
        .map((item) => ({ id: item.id, top: document.getElementById(item.id)?.getBoundingClientRect().top }))
        .filter((s): s is { id: string; top: number } => s.top !== undefined)
        .sort((a, b) => a.top - b.top);
      if (!found.length) return;

      // A section is current once its top reaches the line just under the strip. Jumping to a heading by link
      // parks it at the strip plus the 1rem scroll-padding, so the line sits a few pixels below that: the target
      // counts as current even when it's short and the next section is close behind.
      const stripBottom = document.querySelector<HTMLElement>('.navbar')?.getBoundingClientRect().bottom ?? 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const line = Math.max(stripBottom, 0) + rem * 1.5;

      let current = found[0].id;
      for (const s of found) if (s.top <= line) current = s.id;

      // the first and last sections can't always reach the line, so hand over at the page's ends
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const atTop = window.scrollY < 4;
      active.value = atBottom ? found[found.length - 1].id : atTop ? found[0].id : current;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  return active;
}

/**
 * The list of section links, with the current one marked.
 */
export function SectionLinks({ items, active, onNavigate }: {
  items: SidebarItem[];
  active: string;
  onNavigate?: () => void;
}): JSX.Element {
  return <nav class="sectionLinks" aria-label="Sections">
    {items.map((item) => {
      const Icon = icons[item.icon];
      return (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? 'location' : undefined}
          onClick={onNavigate}
        >
          <Icon /> {item.label}
        </a>
      );
    })}
  </nav>;
}

/**
 * Hamburger + list that float in the gutter to the left of the centred content, just under the nav strip.
 * They stay put while scrolling. When the viewport is too narrow for a gutter, the navbar's own button takes over.
 */
export function MenuAnchor({ items, active, open, onToggle, onClose }: {
  items: SidebarItem[];
  active: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}): JSX.Element {
  return <div class="menuAnchor">
    <button
      type="button"
      class="menuButton menuButtonGutter"
      aria-label="Sections"
      aria-expanded={open}
      aria-controls="sectionPanel"
      onClick={onToggle}
    >
      {open ? <XIcon /> : <ThreeBarsIcon />}
    </button>
    <div id="sectionPanel" class="menuPanel" hidden={!open}>
      <SectionLinks items={items} active={active} onNavigate={onClose} />
    </div>
  </div>;
}

/**
 * Icon-only link to the parent page. It occupies exactly the hamburger's slot (gutter on widescreen,
 * left of the brand in the strip otherwise) so it reads as the same control on every page.
 */
export function BackButton({ back, gutter = false }: { back: BackLink; gutter?: boolean }): JSX.Element {
  const Icon = icons[back.icon];
  return <a
    class={`menuButton${gutter ? ' menuButtonGutter' : ''}`}
    href={back.href}
    aria-label={`Back to ${back.label}`}
    title={`Back to ${back.label}`}
  >
    <Icon />
  </a>;
}
