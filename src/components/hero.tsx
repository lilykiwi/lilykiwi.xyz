import type { JSX } from 'preact'
import { BlueskyIcon, MarkGithubIcon, MailIcon } from './icons'
import { Title } from './heroTitle'

/**
 * Large intro block shown above the navbar.
 */
export function Hero(): JSX.Element {
  return (
    <header class="hero">
      <Title text="lilykiwi.xyz" />
      <p class="heroTagline">i make things sometimes.</p>
      <div class="linkRow">
        <a href="https://github.com/lilykiwi" aria-label="GitHub">
          <MarkGithubIcon /> github
        </a>
        <a href="https://bsky.app/profile/lilykiwi.xyz" aria-label="Bluesky">
          <BlueskyIcon /> bluesky
        </a>
        <a href="mailto:lily@lilykiwi.xyz" aria-label="Email">
          <MailIcon /> email
        </a>
      </div>
    </header>
  )
}
