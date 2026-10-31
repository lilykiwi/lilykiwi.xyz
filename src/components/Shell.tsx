import type { ComponentChildren, JSX } from 'preact';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Hero } from './hero';
import { Navbar } from './navbar';
import { Container } from './container';
import { BackButton, MenuAnchor, useScrollspy, type BackLink, type SidebarItem } from './sidebar';

// widescreen = enough gutter beside the content for the floating menu (keep in sync with the 85rem media queries)
const isWide = () => window.matchMedia('(min-width: 85rem)').matches;

interface ShellProps {
  /** pathname of the page, to mark the current nav link */
  path: string;
  /** show the big hero above the strip (home only) */
  hero?: boolean;
  /** the page's sections; drives the floating menu and scrollspy. Empty hides the menu */
  sections?: SidebarItem[];
  /** parent page link, shown in the hamburger's slot on pages without sections */
  back?: BackLink;
  children?: ComponentChildren;
}

/**
 * The site chrome shared by every page: hero + sticky nav strip, and the section menu.
 * The page body arrives as children.
 */
export function Shell({ path, hero = false, sections = [], back, children }: ShellProps): JSX.Element {
  const stuck = useSignal(false);
  const titleGone = useSignal(!hero);
  const menuOpen = useSignal(false);
  const header = useRef<HTMLDivElement>(null);
  const active = useScrollspy(sections);

  // The hero and nav strip live in one sticky block that is pulled up by the hero's height,
  // so only the strip stays pinned. That keeps them a single painted surface (no seam).
  useLayoutEffect(() => {
    const el = header.current;
    const heroEl = el?.querySelector<HTMLElement>('.hero');
    const title = el?.querySelector<HTMLElement>('.heroTitle');
    if (!el) return;

    // No hero: the strip is pinned from the start, so it counts as stuck as soon as the page has scrolled under it.
    if (!heroEl || !title) {
      const onScroll = () => {
        stuck.value = window.scrollY > 0;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const measure = () => el.style.setProperty('--hero-h', `${heroEl.offsetHeight}px`);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(heroEl);

    // stuck once the hero has scrolled fully out of view; the strip's brand takes over as soon as the big title is gone
    const onScroll = () => {
      // mid-morph (see Base.astro) the hero is cropped out of its box, so its positions mean nothing; the scroll event fired when the morph ends re-checks
      if (el.hasAttribute('data-morph')) return;
      stuck.value = window.scrollY >= heroEl.offsetHeight;
      titleGone.value = title.getBoundingClientRect().bottom <= 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Escape always closes the menu. Where it's a dropdown (narrow), a click elsewhere dismisses it too;
  // on widescreen it acts like a sidebar and stays open until the button is pressed again.
  useEffect(() => {
    if (!menuOpen.value) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') menuOpen.value = false;
    };
    const onClick = (e: MouseEvent) => {
      if (isWide()) return;
      if (!(e.target as Element).closest('.menuButton, .menuPanel, .sectionMenu')) menuOpen.value = false;
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [menuOpen.value]);

  return <>
    <div ref={header} class={`siteHeader${stuck.value ? ' stuck' : ''}${titleGone.value ? ' titleGone' : ''}`}>
      {hero && <Hero />}
      <Navbar
        path={path}
        back={back}
        items={sections}
        active={active.value}
        menuOpen={menuOpen.value}
        onMenuToggle={() => (menuOpen.value = !menuOpen.value)}
        onMenuClose={() => (menuOpen.value = false)}
      />
    </div>
    <Container>
      <div class="layout">
        {sections.length > 0 && (
          <MenuAnchor
            items={sections}
            active={active.value}
            open={menuOpen.value}
            onToggle={() => (menuOpen.value = !menuOpen.value)}
            onClose={() => {
              if (!isWide()) menuOpen.value = false;
            }}
          />
        )}
        {sections.length === 0 && back && (
          <div class="menuAnchor">
            <BackButton back={back} gutter />
          </div>
        )}
        <main class="content">{children}</main>
      </div>
    </Container>
  </>;
}
export default Shell;
