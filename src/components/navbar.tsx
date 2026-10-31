import { JSX } from 'preact';
import { MarkGithubIcon, MailIcon } from '@primer/octicons-react';
import { Container } from './container';

/**
 * Sticky strip below the hero. The brand fades in once the hero has scrolled away.
 */
export function Navbar({ stuck }: { stuck: boolean }): JSX.Element {
  return <nav class={`navbar${stuck ? ' stuck' : ''}`}>
    <Container>
      <div class="navbarInner">
        <a class="navbar-brand" href="#">lilykiwi.xyz</a>
        <div class="navLinks">
          <a href="https://github.com/lilykiwi" aria-label="GitHub"><MarkGithubIcon /> github</a>
          <a href="mailto:lily@lilykiwi.xyz" aria-label="Email"><MailIcon /> email</a>
        </div>
      </div>
    </Container>
  </nav>;
}
