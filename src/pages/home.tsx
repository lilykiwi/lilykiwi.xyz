import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { Repositories } from '../components/repos';
import { Container } from '../components/container';
import { Section } from '../components/section';
import { MenuAnchor, SidebarItem, useScrollspy } from '../components/sidebar';

import { JSX } from 'preact';
import { useEffect, useLayoutEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { PersonIcon, RepoIcon, ImageIcon } from '@primer/octicons-react';

// module-level so the sidebar's effect isn't torn down on every render
const sections: SidebarItem[] = [
  { id: 'about', label: 'about', icon: <PersonIcon /> },
  { id: 'projects', label: 'projects', icon: <RepoIcon /> },
  { id: 'gallery', label: 'gallery', icon: <ImageIcon /> },
];

/**
 * @todo: document this
 */
export function Home(): JSX.Element {
  const stuck = useSignal(false);
  const titleGone = useSignal(false);
  const menuOpen = useSignal(false);
  const header = useRef<HTMLDivElement>(null);
  const active = useScrollspy(sections);

  // The hero and nav strip live in one sticky block that is pulled up by the hero's height,
  // so only the strip stays pinned. That keeps them a single painted surface (no seam).
  useLayoutEffect(() => {
    const el = header.current;
    const hero = el?.querySelector<HTMLElement>('.hero');
    const title = el?.querySelector<HTMLElement>('.heroTitle');
    if (!el || !hero || !title) return;

    const measure = () => el.style.setProperty('--hero-h', `${hero.offsetHeight}px`);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(hero);

    // stuck once the hero has scrolled fully out of view; the strip's brand takes over as soon as the big title is gone
    const onScroll = () => {
      stuck.value = window.scrollY >= hero.offsetHeight;
      titleGone.value = title.getBoundingClientRect().bottom <= 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // the menu is a dropdown, so Escape or a click anywhere else dismisses it
  useEffect(() => {
    if (!menuOpen.value) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') menuOpen.value = false;
    };
    const onClick = (e: MouseEvent) => {
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
      <Hero />
      <Navbar
        items={sections}
        active={active.value}
        menuOpen={menuOpen.value}
        onMenuToggle={() => (menuOpen.value = !menuOpen.value)}
        onMenuClose={() => (menuOpen.value = false)}
      />
    </div>
    <Container>
      <div class="layout">
        <MenuAnchor
          items={sections}
          active={active.value}
          open={menuOpen.value}
          onToggle={() => (menuOpen.value = !menuOpen.value)}
          onClose={() => (menuOpen.value = false)}
        />
        <main class="content">
          <Section id="about" title="about">
            {/* placeholder until there is something to say */}
            <p class="placeholder">nothing here yet.</p>
          </Section>
          <Section id="projects" title="projects">
            <Repositories />
          </Section>
          <Section id="gallery" title="gallery">
            <p class="placeholder">coming eventually.</p>
          </Section>
        </main>
      </div>
    </Container>
  </>;
}
