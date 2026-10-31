import { JSX } from 'preact';
import { useEffect } from 'preact/hooks';
import { HomeIcon, ImageIcon, ThreeBarsIcon, XIcon } from '@primer/octicons-react';
import { Container } from './container';
import { SectionLinks, SidebarItem } from './sidebar';

interface NavbarProps {
  items: SidebarItem[];
  active: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

/**
 * Strip below the hero. The brand fades in once the hero has scrolled away (see .siteHeader.titleGone).
 * Home and Gallery are stubs until those pages exist. On small screens a hamburger opens the section list.
 */
export function Navbar({ items, active, menuOpen, onMenuToggle, onMenuClose }: NavbarProps): JSX.Element {
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onMenuClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return <>
    <nav class="navbar">
      <Container>
        <div class="navbarInner">
          <button
            type="button"
            class="menuButton"
            aria-label="Sections"
            aria-expanded={menuOpen}
            aria-controls="sectionMenu"
            onClick={onMenuToggle}
          >
            {menuOpen ? <XIcon /> : <ThreeBarsIcon />}
          </button>
          <a class="navbar-brand" href="#">lilykiwi.xyz</a>
          <div class="linkRow">
            <a href="#" aria-current="page"><HomeIcon /> home</a>
            <a href="#gallery"><ImageIcon /> gallery</a>
          </div>
        </div>
      </Container>
    </nav>
    <div id="sectionMenu" class="sectionMenu" hidden={!menuOpen}>
      <Container>
        <SectionLinks items={items} active={active} onNavigate={onMenuClose} />
      </Container>
    </div>
  </>;
}
