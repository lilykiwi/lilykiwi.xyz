import { Navbar } from '../components/navbar';
import { Repositories } from '../components/repos';
import { Container } from '../components/container';

import { JSX } from 'preact';

/**
 * @todo: document this
 */
export function Home(): JSX.Element {
  return <>
    <Navbar />
    <Container>
      <Repositories />
    </Container>
  </>;
}
