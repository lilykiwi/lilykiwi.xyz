import { JSX } from 'preact';
import { HomeIcon, ImageIcon } from '@primer/octicons-react';
import { Container } from './container';

/**
 * Sticky strip below the hero. The brand fades in once the hero has scrolled away.
 * Home and Gallery are stubs until those pages exist.
 */
export function Navbar({ stuck }: { stuck: boolean }): JSX.Element {
  return <nav class={`navbar${stuck ? ' stuck' : ''}`}>
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
