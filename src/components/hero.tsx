import { JSX } from 'preact';
import { Title } from './heroTitle';

/**
 * Large intro block shown above the navbar.
 */
export function Hero(): JSX.Element {
  return <header class="hero">
    <Title text="lilykiwi.xyz" />
    <p class="heroTagline">small things, made slowly.</p>
  </header>;
}
