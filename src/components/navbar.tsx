import { JSX } from 'preact';
import { HomeIcon, ImageIcon } from '@primer/octicons-react';
import { Container } from './container';

/**
 * Strip below the hero. The brand fades in once the hero has scrolled away (see .siteHeader.stuck).
 * Home and Gallery are stubs until those pages exist.
 */
export function Navbar(): JSX.Element {
  return <nav class="navbar">
    <Container>
      <div class="navbarInner">
        <a class="navbar-brand" href="#">lilykiwi.xyz</a>
        <div class="navButtons">
          <a class="navButton active" href="#" aria-current="page"><HomeIcon /> home</a>
          <a class="navButton" href="#gallery"><ImageIcon /> gallery</a>
        </div>
      </div>
    </Container>
  </nav>;
}
