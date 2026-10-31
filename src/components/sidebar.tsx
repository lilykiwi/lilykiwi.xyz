import { JSX } from 'preact';
import { useLayoutEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export interface SidebarItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

/**
 * Sticky section list that sits under the nav strip and highlights the section being read (scrollspy).
 */
export function Sidebar({ items }: { items: SidebarItem[] }): JSX.Element {
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

      // short final sections can never reach the line, so hand over once the page bottoms out
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

  return <aside class="sidebar">
    <nav aria-label="Sections">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active.value === item.id ? 'location' : undefined}
        >
          {item.icon} {item.label}
        </a>
      ))}
    </nav>
  </aside>;
}
