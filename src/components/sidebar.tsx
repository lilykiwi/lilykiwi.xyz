import { JSX } from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ThreeBarsIcon, XIcon } from '@primer/octicons-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

/**
 * Tracks which section is being read (scrollspy). Shared by the sidebar and the mobile menu.
 */
export function useScrollspy(items: SidebarItem[]): Signal<string> {
  const active = useSignal(items[0].id);

  useLayoutEffect(() => {
    const update = () => {
      const stripBottom = document.querySelector<HTMLElement>('.navbar')?.getBoundingClientRect().bottom ?? 0;
      // a section becomes current once its top passes a line a little below the strip
      const line = Math.max(stripBottom, 0) + window.innerHeight * 0.2;

      let current = items[0].id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }

      // short first/last sections can never own the line, so hand over at the page's ends
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const atTop = window.scrollY < 4;
      active.value = atBottom ? items[items.length - 1].id : atTop ? items[0].id : current;
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
    {items.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        aria-current={active === item.id ? 'location' : undefined}
        onClick={onNavigate}
      >
        {item.icon} {item.label}
      </a>
    ))}
  </nav>;
}

/**
 * Hamburger + dropdown that float in the gutter to the left of the centred content, just under the nav strip.
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
