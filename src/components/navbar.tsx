import type { JSX } from 'preact';
import { BookIcon, HomeIcon, ImageIcon, ThreeBarsIcon, XIcon } from './icons';
import { Container } from './container';
import { SectionLinks, type SidebarItem } from './sidebar';

interface NavbarProps {
  /** pathname of the page being shown, used to mark the current link */
  path: string;
  items: SidebarItem[];
  active: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

// Hidden for now: blog and gallery are sections on the home page, so these links (and "home") are redundant.
// Uncomment to bring them back; /blog/ and /gallery/ still exist as their own pages.
const links: { href: string; label: string; Icon: typeof HomeIcon }[] = [
  // { href: '/', label: 'home', Icon: HomeIcon },
  // { href: '/blog/', label: 'blog', Icon: BookIcon },
  // { href: '/gallery/', label: 'gallery', Icon: ImageIcon },
];

const isCurrent = (href: string, path: string) => (href === '/' ? path === '/' : path.startsWith(href));

/**
 * Strip below the hero. The brand fades in once the hero has scrolled away (see .siteHeader.titleGone).
 * On narrow screens, where there's no gutter for the floating hamburger, this strip carries the
 * button and a dropdown of the page's sections instead. Pages without sections get neither.
 */
export function Navbar({ path, items, active, menuOpen, onMenuToggle, onMenuClose }: NavbarProps): JSX.Element {
  return <>
    <nav class="navbar">
      <Container>
        <div class="navbarInner">
          {items.length > 0 && (
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
          )}
          <a class="navbar-brand" href="/">lilykiwi.xyz</a>
          <div class="linkRow">
            {links.map(({ href, label, Icon }) => (
              <a key={href} href={href} aria-current={isCurrent(href, path) ? 'page' : undefined}>
                <Icon /> {label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </nav>
    {items.length > 0 && (
      <div id="sectionMenu" class="sectionMenu" hidden={!menuOpen}>
        <Container>
          <SectionLinks items={items} active={active} onNavigate={onMenuClose} />
        </Container>
      </div>
    )}
  </>;
}
