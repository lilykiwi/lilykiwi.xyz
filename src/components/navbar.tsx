import type { JSX } from 'preact';
import { BookIcon, HomeIcon, ImageIcon, ThreeBarsIcon, XIcon } from './icons';
import { Container } from './container';
import { TitleImage } from './titleImage';
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
    <nav class={`navbar${items.length > 0 ? ' hasMenu' : ''}`}>
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
          <a class="navbar-brand" href="/"><TitleImage text="lilykiwi.xyz" size="brand" /></a>
          <div class="linkRow">
            {links.map(({ href, label, Icon }) => (
              <a key={href} href={href} aria-label={label} aria-current={isCurrent(href, path) ? 'page' : undefined}>
                <Icon /> <span class="linkLabel">{label}</span>
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
export function SectionMenu({ path, items, active, menuOpen, onMenuClose }: Pick<NavbarProps, 'path' | 'items' | 'active' | 'menuOpen' | 'onMenuClose'>): JSX.Element | null {
  if (items.length === 0) return null;
  return <div class="sectionMenuRail">
    <div id="sectionMenu" class={`sectionMenu${menuOpen ? ' open' : ''}`}>
      {/* where the strip has no room for its links (see .hasMenu), they replace the page's sections here */}
      <nav class="sectionLinks menuPages" aria-label="Pages">
        {links.map(({ href, label, Icon }, i) => (
          <a key={href} href={href} style={{ '--i': i }} aria-current={isCurrent(href, path) ? 'page' : undefined} onClick={onMenuClose}>
            <Icon /> {label}
          </a>
        ))}
      </nav>
      <SectionLinks items={items} active={active} onNavigate={onMenuClose} />
    </div>
  </div>;
}
