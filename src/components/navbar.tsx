import type { JSX } from 'preact';
import { BookIcon, HomeIcon, ImageIcon, ThreeBarsIcon, XIcon } from './icons';
import { Container } from './container';
import { BackButton, SectionLinks, type BackLink, type SidebarItem } from './sidebar';

interface NavbarProps {
  /** pathname of the page being shown, used to mark the current link */
  path: string;
  /** parent page link, shown instead of the section menu button on pages without sections */
  back?: BackLink;
  items: SidebarItem[];
  active: string;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

const links = [
  { href: '/', label: 'home', Icon: HomeIcon },
  { href: '/blog/', label: 'blog', Icon: BookIcon },
  { href: '/gallery/', label: 'gallery', Icon: ImageIcon },
];

const isCurrent = (href: string, path: string) => (href === '/' ? path === '/' : path.startsWith(href));

/**
 * Strip below the hero. The brand fades in once the hero has scrolled away (see .siteHeader.titleGone).
 * On narrow screens, where there's no gutter for the floating hamburger, this strip carries the
 * button and a dropdown of the page's sections instead. Pages without sections get neither.
 */
export function Navbar({ path, back, items, active, menuOpen, onMenuToggle, onMenuClose }: NavbarProps): JSX.Element {
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
          {items.length === 0 && back && <BackButton back={back} />}
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
  </>;
}

/**
 * Narrow-screen dropdown of the page's sections. It's rendered after the header rather than inside it: the header
 * blurs what's behind it once stuck, which would make it the backdrop root and stop a nested blur from reaching the page.
 * Always mounted so opening can animate; closed, it's visibility:hidden so it's out of the tab order and the a11y tree.
 */
export function SectionMenu({ items, active, menuOpen, onMenuClose }: Pick<NavbarProps, 'items' | 'active' | 'menuOpen' | 'onMenuClose'>): JSX.Element | null {
  if (items.length === 0) return null;
  return <div class="sectionMenuRail">
    <div id="sectionMenu" class={`sectionMenu${menuOpen ? ' open' : ''}`}>
      <SectionLinks items={items} active={active} onNavigate={onMenuClose} />
    </div>
  </div>;
}
